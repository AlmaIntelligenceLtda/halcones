const LandingRenderer = {
    defaults: {
        theme: {
            primary: '#2563eb',
            secondary: '#1e293b',
            accent: '#f59e0b',
            bg: '#ffffff',
            text: '#334155',
            font: "'Overpass', sans-serif",
            headingFont: "'Overpass', sans-serif",
            radius: '0.5rem',
            shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            container: '1200px',
            spacing: '4rem'
        }
    },

    ensureFontLoaded(fontFamily) {
        const ff = (fontFamily || '').toLowerCase();
        const needsPoppins = ff.includes('poppins');
        const needsInter = ff.includes('inter');
        let href = null;
        if (needsPoppins) href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap';
        else if (needsInter) href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap';
        if (!href) return;

        const id = `lp-font-${needsPoppins ? 'poppins' : 'inter'}`;
        if (document.getElementById(id)) return;
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    },

    render(containerId, schema) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Normalize schema (unify *_v2 + normalize structures)
        schema = this.normalizeSchema(schema);

        // Apply Theme
        if (schema.theme) {
            this.applyTheme(schema.theme);
        } else {
            this.applyTheme(this.defaults.theme);
        }

        // Best-effort: load per-block fonts (hero headline/subheadline)
        try {
            (schema.blocks || []).forEach((b) => {
                const bf = b?.data?.headlineFont;
                const sf = b?.data?.subheadlineFont;
                if (bf) this.ensureFontLoaded(bf);
                if (sf) this.ensureFontLoaded(sf);
            });
        } catch {}

        // Clear container
        container.innerHTML = '';

        // Render Blocks
        if (schema.blocks && Array.isArray(schema.blocks)) {
            schema.blocks.forEach((block, index) => {
                const renderer = this.renderMap[block.type];
                if (renderer) {
                    const section = document.createElement('section');
                    section.className = 'landing-section';
                    section.dataset.blockType = block.type;

                    const selfContained = ['header', 'hero', 'features', 'gallery', 'testimonials', 'contact', 'footer'].includes(block.type);
                    const isLegacyV2 = (block.type || '').endsWith('_v2');
                    if (selfContained || isLegacyV2) {
                        section.style.padding = '0';
                        section.dataset.noAnimate = '1';
                    }
                    section.innerHTML = renderer(block.data);
                    container.appendChild(section);

                    // Execute scripts for embeds
                    const scripts = section.querySelectorAll('script');
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });

                    // Re-trigger social parsers
                    if (window.instgrm) window.instgrm.Embeds.process();
                    if (window.twttr) window.twttr.widgets.load();
                    if (window.FB) window.FB.XFBML.parse();
                }
            });
        }

        // Initialize Icons
        if (window.feather) {
            window.feather.replace();
        }

        // Initialize animations if needed
        this.initAnimations();
    },

    // -------- Schema Normalization --------
    normalizeSchema(schema) {
        if (!schema || typeof schema !== 'object') return { theme: this.defaults.theme, blocks: [] };
        const normalized = schema;
        normalized.theme = { ...this.defaults.theme, ...(normalized.theme || {}) };
        if (!Array.isArray(normalized.blocks)) normalized.blocks = [];
        normalized.blocks.forEach((b) => this.normalizeBlock(b));
        return normalized;
    },

    normalizeBlock(block) {
        if (!block || typeof block !== 'object') return;
        switch (block.type) {
            case 'header_v2':
                block.type = 'header';
                break;
            case 'hero_v2':
                block.type = 'hero';
                break;
            case 'features_v2':
                block.type = 'features';
                break;
            case 'gallery_v2':
                block.type = 'gallery';
                break;
            case 'testimonials_v2':
                block.type = 'testimonials';
                break;
            case 'contact_v2':
                block.type = 'contact';
                break;
            case 'footer_v2':
                block.type = 'footer';
                break;
        }

        const data = (block.data && typeof block.data === 'object') ? block.data : {};
        if (block.type === 'header') {
            if (data.logotext && !data.logoText) data.logoText = data.logotext;
            if (!Array.isArray(data.links)) data.links = [];
            if (!data.style || typeof data.style !== 'object') data.style = {};
        }
        if (block.type === 'hero') {
            if (data.image && !data.backgroundImageUrl) data.backgroundImageUrl = data.image;
            if (!Array.isArray(data.buttons)) data.buttons = [];
            if (data.buttons.length === 0 && (data.ctaText || data.ctaLink)) {
                data.buttons.push({
                    text: data.ctaText || 'Llamada a la acción',
                    url: data.ctaLink || '#',
                    variant: 'primary',
                    backgroundFrom: data.overlayToColor || '#f59e0b',
                    backgroundTo: '#d97706',
                    textColor: data.textColor || '#ffffff',
                    borderColor: data.overlayToColor || '#f59e0b',
                    borderWidth: 0,
                    radiusPx: 40,
                    shadow: '0 4px 15px rgba(245,158,11,0.3)'
                });
            }
        }
        if (block.type === 'features') {
            if (Array.isArray(data.cards) && !Array.isArray(data.items)) {
                data.items = data.cards;
                delete data.cards;
            }
            if (!Array.isArray(data.items)) data.items = [];
        }
        if (block.type === 'gallery') {
            if (Array.isArray(data.items) && !Array.isArray(data.images)) {
                data.images = data.items.map(it => ({ url: it?.imageUrl || it?.url || '', caption: it?.label || it?.caption || '' }));
                delete data.items;
            }
            if (!Array.isArray(data.images)) data.images = [];
        }
        if (block.type === 'testimonials') {
            if (!Array.isArray(data.items)) data.items = [];
            data.items.forEach((it) => {
                if (!it || typeof it !== 'object') return;
                if (it.author && !it.name) it.name = it.author;
                if (it.name && !it.author) it.author = it.name;
            });
        }
        if (block.type === 'contact') {
            if (!Array.isArray(data.buttons)) data.buttons = [];
        }
        if (block.type === 'footer') {
            if (data.copyright && !data.text) data.text = data.copyright;
            if (!Array.isArray(data.links)) data.links = [];
        }

        block.data = data;
    },

    applyTheme(theme) {
        const root = document.documentElement;
        const t = { ...this.defaults.theme, ...theme };
        
        root.style.setProperty('--lp-primary', t.primary);
        root.style.setProperty('--lp-secondary', t.secondary);
        if (t.accent) root.style.setProperty('--lp-accent', t.accent);
        if (t.bg) root.style.setProperty('--lp-bg', t.bg);
        if (t.text) root.style.setProperty('--lp-text', t.text);
        if (t.font) {
            root.style.setProperty('--lp-font-main', t.font);
            this.ensureFontLoaded(t.font);
        }
        if (t.headingFont) {
            root.style.setProperty('--lp-font-heading', t.headingFont);
            this.ensureFontLoaded(t.headingFont);
        }
        if (t.spacing) root.style.setProperty('--lp-spacing', t.spacing);
        if (t.radius) root.style.setProperty('--lp-radius', t.radius);
        if (t.shadow) root.style.setProperty('--lp-shadow', t.shadow);
        if (t.container) root.style.setProperty('--lp-container', t.container);
    },

    renderMap: {
        // Canonical blocks (single global system): advanced renderers live here
        header: (data) => {
            const s = data.style || {};
            const bg = s.backgroundColor || '#ffffff';
            const opacity = (typeof s.backgroundOpacity === 'number') ? s.backgroundOpacity : 1;
            const blur = (typeof s.blurPx === 'number') ? s.blurPx : 0;
            const paddingY = (typeof s.paddingY === 'number') ? s.paddingY : 15;
            const paddingX = (typeof s.paddingX === 'number') ? s.paddingX : 20;
            const fixed = s.fixed ? 'fixed' : 'sticky';

            const toRgba = (hex, a) => {
                const h = (hex || '').trim();
                if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return hex;
                const full = h.length === 4
                    ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
                    : h;
                const r = parseInt(full.slice(1, 3), 16);
                const g = parseInt(full.slice(3, 5), 16);
                const b = parseInt(full.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            };

            const bgComputed = toRgba(bg, opacity);
            const logoColor = s.logoColor || 'var(--lp-primary)';
            const linkColor = s.linkColor || 'var(--lp-primary)';
            const linkHover = s.linkHoverColor || 'var(--lp-accent)';

            const logoText = data.logoText || data.logotext || '';
            const logoHtml = data.logoImage
                ? `<img src="${data.logoImage}" alt="Logo" class="lp-header-v2__logo-img" />`
                : `${logoText}`;

            return `
                <div>
                    <style>
                        .lp-header-v2 { left: 0; width: 100%; box-sizing: border-box; }
                        .lp-header-v2 a:hover { color: ${linkHover} !important; }
                        .lp-header-v2__inner { max-width: var(--lp-container); margin: 0 auto; padding: 0 1.5rem; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
                        .lp-header-v2__logo { font-size: 1.5rem; font-weight: 700; }
                        .lp-header-v2__logo-img { height: 44px; width: auto; max-width: 180px; object-fit: contain; display: block; }
                        .lp-header-v2__nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 20px; min-width: 0; max-width: 100%; }
                        .lp-header-v2__nav a { text-decoration: none; font-weight: 500; transition: color 0.3s; white-space: nowrap; }
                        @media (max-width: 768px) {
                            .lp-header-v2__inner { flex-direction: column; align-items: center; gap: 10px; }
                            .lp-header-v2__nav { justify-content: center; }
                            .lp-header-v2__nav a { white-space: normal; }
                        }
                    </style>
                    <header class="lp-header-v2" style="background:${bgComputed}; backdrop-filter: blur(${blur}px); padding:${paddingY}px ${paddingX}px; position:${fixed}; top:0; z-index:1000; box-shadow:${s.shadow || 'none'};">
                        <div class="lp-header-v2__inner">
                            <div class="lp-header-v2__logo" style="color:${logoColor};">${logoHtml}</div>
                            <nav class="lp-header-v2__nav">
                                ${(data.links || []).map(l => `<a href="${l.url}" style="color:${linkColor};">${l.text}</a>`).join('')}
                            </nav>
                        </div>
                    </header>
                </div>
            `;
        },

        hero: (data) => {
            const angle = (typeof data.overlayAngleDeg === 'number') ? data.overlayAngleDeg : 135;
            const from = data.overlayFromColor || 'var(--lp-primary)';
            const to = data.overlayToColor || 'var(--lp-accent)';
            const fromA = (typeof data.overlayFromOpacity === 'number') ? data.overlayFromOpacity : 0.9;
            const toA = (typeof data.overlayToOpacity === 'number') ? data.overlayToOpacity : 0.8;
            const minVh = (typeof data.minHeightVh === 'number') ? data.minHeightVh : 70;
            const textColor = data.textColor || '#ffffff';
            const bgImg = data.backgroundImageUrl || data.image || '';

            const headlineFont = data.headlineFont || 'var(--lp-font-heading)';
            const subheadlineFont = data.subheadlineFont || 'var(--lp-font-main)';
            const headlineSizePx = (typeof data.headlineSizePx === 'number') ? data.headlineSizePx : 48;
            const subheadlineSizePx = (typeof data.subheadlineSizePx === 'number') ? data.subheadlineSizePx : 21;
            const headlineWeight = (typeof data.headlineWeight === 'number') ? data.headlineWeight : 700;
            const subheadlineWeight = (typeof data.subheadlineWeight === 'number') ? data.subheadlineWeight : 300;
            const headlineColor = data.headlineColor || textColor;
            const subheadlineColor = data.subheadlineColor || textColor;

            const rgba = (hexOrRgba, a) => {
                const h = (hexOrRgba || '').trim();
                if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) return h;
                const full = h.length === 4
                    ? '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]
                    : h;
                const r = parseInt(full.slice(1, 3), 16);
                const g = parseInt(full.slice(3, 5), 16);
                const b = parseInt(full.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            };

            const overlay = `linear-gradient(${angle}deg, ${rgba(from, fromA)} 0%, ${rgba(to, toA)} 100%)`;
            const bg = bgImg
                ? `${overlay}, url('${bgImg}') center/cover no-repeat`
                : overlay;

            const btns = Array.isArray(data.buttons) ? data.buttons : [];
            const fallbackButtons = (!btns.length && (data.ctaText || data.ctaLink))
                ? [{
                    text: data.ctaText || 'Llamada a la acción',
                    url: data.ctaLink || '#',
                    variant: 'primary',
                    backgroundFrom: to,
                    backgroundTo: '#d97706',
                    textColor: textColor,
                    borderColor: to,
                    borderWidth: 0,
                    radiusPx: 40,
                    shadow: '0 4px 15px rgba(245,158,11,0.3)'
                }]
                : btns;

            const buttons = fallbackButtons.map(btn => {
                const radius = (typeof btn.radiusPx === 'number') ? `${btn.radiusPx}px` : '50px';
                const borderW = (typeof btn.borderWidth === 'number') ? `${btn.borderWidth}px` : '0px';
                const borderC = btn.borderColor || 'transparent';
                const bgBtn = (btn.variant === 'primary')
                    ? `linear-gradient(45deg, ${btn.backgroundFrom || 'var(--lp-accent)'}, ${btn.backgroundTo || 'var(--lp-accent)'})`
                    : (btn.backgroundFrom || 'rgba(255,255,255,0.2)');
                const shadow = btn.shadow || 'none';
                return `
                    <a href="${btn.url || '#'}" style="display:inline-block; text-decoration:none; padding:15px 30px; border-radius:${radius}; font-weight:600; border:${borderW} solid ${borderC}; color:${btn.textColor || textColor}; background:${bgBtn}; box-shadow:${shadow}; transition:transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease;">
                        ${btn.text || 'Botón'}
                    </a>
                `;
            }).join('');

            return `
                <section id="${data.id || ''}" style="padding: 120px 20px 80px; text-align:center; color:${textColor}; background:${bg}; min-height:${minVh}vh; display:flex; align-items:center; justify-content:center;">
                    <div class="landing-container" style="max-width:800px;">
                        <h1 style="font-family:${headlineFont}; font-size:${headlineSizePx}px; margin:0 0 20px; font-weight:${headlineWeight}; color:${headlineColor}; text-shadow:2px 2px 4px rgba(0,0,0,0.3);">${data.headline || ''}</h1>
                        <p style="font-family:${subheadlineFont}; font-size:${subheadlineSizePx}px; margin:0 0 30px; font-weight:${subheadlineWeight}; color:${subheadlineColor};">${data.subheadline || ''}</p>
                        <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">${buttons}</div>
                    </div>
                </section>
            `;
        },

        features: (data) => {
            const min = (typeof data.columnsMinWidthPx === 'number') ? data.columnsMinWidthPx : 300;
            const gap = (typeof data.gapPx === 'number') ? data.gapPx : 30;
            const cardsSrc = Array.isArray(data.cards) ? data.cards : (Array.isArray(data.items) ? data.items : []);
            const cards = cardsSrc.map(card => {
                const radius = (typeof card.radiusPx === 'number') ? `${card.radiusPx}px` : '15px';
                const shadow = card.shadow || '0 10px 30px rgba(0,0,0,0.1)';
                const cardBg = card.cardBg || '#ffffff';
                const iconBg = (card.iconBgFrom || card.iconBgTo)
                    ? `linear-gradient(45deg, ${card.iconBgFrom || 'var(--lp-primary)'}, ${card.iconBgTo || 'var(--lp-secondary)'})`
                    : (card.color || 'var(--lp-primary)');
                const imageHtml = card.image
                    ? `<img src="${card.image}" alt="${card.title || ''}" style="width:100%; height:170px; object-fit:cover; border-radius:${radius}; margin-bottom:16px;" loading="lazy">`
                    : '';
                return `
                    <div style="background:${cardBg}; padding:40px 30px; border-radius:${radius}; box-shadow:${shadow}; text-align:center; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${shadow}';">
                        ${imageHtml}
                        <div style="width:80px; height:80px; background:${iconBg}; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; color:white; font-size:2rem;">
                            <i data-feather="${card.icon || 'star'}"></i>
                        </div>
                        <h3 style="font-size:1.5rem; color: var(--lp-primary); margin:0 0 15px;">${card.title || ''}</h3>
                        <p style="color:#666; margin:0;">${card.text || ''}</p>
                    </div>
                `;
            }).join('');

            return `
                <section id="${data.id || ''}" style="padding: 80px 20px;">
                    <div class="landing-container">
                        <h2 style="text-align:center; font-size:2.5rem; color: var(--lp-primary); margin-bottom:50px; font-weight:600;">${data.title || ''}</h2>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(${min}px, 1fr)); gap:${gap}px;">${cards}</div>
                    </div>
                </section>
            `;
        },

        gallery: (data) => {
            const h = (typeof data.itemHeightPx === 'number') ? data.itemHeightPx : 200;
            const src = Array.isArray(data.items)
                ? data.items
                : (Array.isArray(data.images)
                    ? data.images.map(img => ({ label: img.caption || '', imageUrl: img.url || '' }))
                    : []);
            const items = src.map(item => `
                <div style="position:relative; border-radius:10px; overflow:hidden; height:${h}px; background-image:url('${item.imageUrl || item.url || ''}'); background-size:cover; background-position:center; background-repeat:no-repeat; display:flex; align-items:center; justify-content:center; color:white; font-weight:500; text-shadow:2px 2px 4px rgba(0,0,0,0.7); font-size:1.2rem;">
                    ${item.label || item.caption || ''}
                </div>
            `).join('');

            return `
                <section style="padding: 80px 20px;">
                    <div class="landing-container">
                        <h2 style="text-align:center; font-size:2.5rem; color: var(--lp-primary); margin-bottom:50px; font-weight:600;">${data.title || ''}</h2>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin-top:30px;">${items}</div>
                    </div>
                </section>
            `;
        },

        testimonials: (data) => {
            const bg = data.backgroundColor || '#f8f9fa';
            const cards = (data.items || []).map(t => {
                const author = t.author || t.name || '';
                const role = t.role || '';
                const avatar = t.avatar || '';
                const avatarHtml = avatar
                    ? `<img src="${avatar}" alt="${author}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;" loading="lazy">`
                    : '';
                return `
                    <div style="background:white; padding:30px; border-radius:12px; box-shadow:0 5px 15px rgba(0,0,0,0.08);">
                        <p style="font-style:italic; color:#555; margin:0 0 16px;">"${t.quote || ''}"</p>
                        <div style="display:flex; gap:12px; align-items:center;">
                            ${avatarHtml}
                            <div>
                                <div style="font-weight:700; color: var(--lp-primary);">${author}</div>
                                ${role ? `<div style="font-size:0.85rem; color:#64748b;">${role}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <section style="background:${bg}; padding:80px 20px;">
                    <div class="landing-container" style="max-width:1000px;">
                        <h2 style="text-align:center; margin-bottom:50px;">${data.title || ''}</h2>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">${cards}</div>
                    </div>
                </section>
            `;
        },

        contact: (data) => {
            const angle = (typeof data.bgAngleDeg === 'number') ? data.bgAngleDeg : 135;
            const bg = `linear-gradient(${angle}deg, ${data.bgFrom || 'var(--lp-primary)'} 0%, ${data.bgTo || 'var(--lp-secondary)'} 100%)`;
            const textColor = data.textColor || '#ffffff';
            const buttons = (data.buttons || []).map(btn => {
                const radius = (typeof btn.radiusPx === 'number') ? `${btn.radiusPx}px` : '25px';
                const bgBtn = btn.bg || 'var(--lp-accent)';
                const hoverBg = btn.hoverBg || bgBtn;
                return `
                    <a href="${btn.url || '#'}"
                       style="background:${bgBtn}; color:white; padding:15px 25px; border:none; border-radius:${radius}; font-size:1rem; font-weight:600; cursor:pointer; text-decoration:none; transition: all 0.3s ease; display:inline-block;"
                       onmouseover="this.style.background='${hoverBg}'; this.style.transform='translateY(-2px)';"
                       onmouseout="this.style.background='${bgBtn}'; this.style.transform='translateY(0)';">
                        ${btn.text || 'Botón'}
                    </a>
                `;
            }).join('');

            return `
                <section id="${data.id || ''}" style="background:${bg}; color:${textColor}; padding:80px 20px; text-align:center;">
                    <div class="landing-container">
                        <h2 style="margin-bottom:20px; color:${textColor};">${data.title || ''}</h2>
                        <p style="font-size:1.2rem; margin-bottom:40px; max-width:600px; margin-left:auto; margin-right:auto;">${data.text || ''}</p>
                        <div style="display:flex; gap:20px; justify-content:center; flex-wrap:wrap;">${buttons}</div>
                    </div>
                </section>
            `;
        },

        footer: (data) => `
            <footer style="background:${data.backgroundColor || 'var(--lp-primary)'}; color:${data.textColor || '#fff'}; padding:30px 20px; text-align:center;">
                <div class="landing-container">
                    <p style="margin:0; font-size:0.9rem;">${data.text || ''}</p>
                </div>
            </footer>
        `,
        pricing: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="text-center mb-5">
                    <h2>${data.title}</h2>
                </div>
                <div class="lp-pricing-grid">
                    ${data.plans.map(plan => `
                        <div class="lp-pricing-card ${plan.featured ? 'featured' : ''}">
                            <h3>${plan.name}</h3>
                            <div class="lp-price">$${plan.price}<span>/mes</span></div>
                            <ul class="list-unstyled mb-4 text-left" style="text-align: left; margin-left: 1rem;">
                                ${plan.features.map(f => `<li class="mb-2"><i data-feather="check" style="width:16px; color:var(--lp-primary)"></i> ${f}</li>`).join('')}
                            </ul>
                            <button onclick="LandingRenderer.handlePlanSelect('${plan.name}')" class="landing-btn ${plan.featured ? '' : 'secondary'}" style="width:100%">${plan.cta || 'Seleccionar'}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        form: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="lp-form-wrapper">
                    <h2 class="text-center mb-4">${data.title}</h2>
                    <form onsubmit="LandingRenderer.handleFormSubmit(event)">
                        ${data.fields.map(field => `
                            <div class="lp-form-group">
                                <label>${field.label}</label>
                                <input type="${field.type}" name="${field.label}" class="lp-input" placeholder="${field.placeholder}" required>
                            </div>
                        `).join('')}
                        <button type="submit" class="landing-btn" style="width:100%">${data.submitText}</button>
                    </form>
                </div>
            </div>
        `,
        // (header already mapped above)
        social: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="text-center mb-5">
                    <h2>${data.title}</h2>
                </div>
                <div style="display: flex; justify-content: center; gap: 1.5rem;">
                    ${data.links.map(link => `
                        <a href="${link.url}" target="_blank" style="display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background: #f1f5f9; border-radius: 50%; color: var(--lp-primary); transition: all 0.2s;">
                            <i data-feather="${link.platform}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        `,
        // (footer already mapped above)
        video: (data) => {
            let src = (data.videoUrl || '').trim();
            const lower = src.toLowerCase();
            const isNative = lower.startsWith('/uploads/') || lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov');

            // If it's not a native file, keep YouTube conversion behavior
            if (!isNative) {
                if (src.includes('watch?v=')) {
                    src = src.replace('watch?v=', 'embed/');
                    if (src.includes('&')) src = src.split('&')[0];
                } else if (src.includes('youtu.be/')) {
                    src = src.replace('youtu.be/', 'www.youtube.com/embed/');
                }
            }

            const header = data.title
                ? `<div class="text-center mb-4"><h2>${data.title}</h2>${data.description ? `<p>${data.description}</p>` : ''}</div>`
                : '';

            const body = isNative
                ? `<div style="width:100%; border-radius: 0.5rem; background:#000; overflow:hidden;">
                        <video src="${src}" controls style="width:100%; height:auto; display:block;"></video>
                   </div>`
                : `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 0.5rem; background: #000;">
                        <iframe src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                   </div>`;

            return `
            <div class="landing-container" id="${data.id || ''}">
                ${header}
                ${body}
            </div>
        `},
        embed: (data) => {
            let content = data.htmlCode;
            
            // Auto-generate embed code if URL is provided and HTML is empty
            if (data.url && (!content || content.trim() === '')) {
                const url = data.url;
                if (url.includes('instagram.com')) {
                    // Instagram
                    content = `
                        <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                        </blockquote>
                        <script async src="//www.instagram.com/embed.js"></script>
                    `;
                } else if (url.includes('twitter.com') || url.includes('x.com')) {
                    // Twitter
                    content = `
                        <blockquote class="twitter-tweet"><a href="${url}"></a></blockquote>
                        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                    `;
                } else if (url.includes('tiktok.com')) {
                    // TikTok
                    const videoId = url.split('/').pop().split('?')[0];
                    content = `
                        <blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;">
                            <section> <a target="_blank" href="${url}">${url}</a> </section>
                        </blockquote>
                        <script async src="https://www.tiktok.com/embed.js"></script>
                    `;
                } else if (url.includes('facebook.com')) {
                     // Facebook (Only works for public posts/pages via SDK, using simple iframe generator for public posts often requires access token, skipping or generic link)
                     content = `<div class="fb-post" data-href="${url}" data-width="500"></div><script async defer crossorigin="anonymous" src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v15.0"></script>`;
                }
            }

            return `
            <div class="landing-container" id="${data.id || ''}">
                ${data.title ? `<div class="text-center mb-4"><h2>${data.title}</h2></div>` : ''}
                <div class="text-center" style="display: flex; justify-content: center;">
                    ${content || '<!-- Sin contenido -->'}
                </div>
            </div>
        `},
        // (gallery already mapped above)
        faq: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="text-center mb-5">
                    <h2>${data.title}</h2>
                </div>
                <div class="lp-faq-grid" style="max-width: 800px; margin: 0 auto;">
                    ${data.items.map(item => `
                        <div class="lp-faq-item" style="margin-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 1.5rem;">
                            <h4 style="margin-bottom: 0.5rem; color: var(--lp-primary); font-size: 1.15rem; font-weight: 600;">${item.question}</h4>
                            <p style="margin: 0; color: var(--lp-text); opacity: 0.85; line-height: 1.6;">${item.answer}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,

    },

    initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.landing-section').forEach(section => {
            if (section.dataset.noAnimate === '1') return;
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(section);
        });
    },

    // --- Action Handlers ---

    async submitData(type, data) {
        if (!window.LANDING_ID) {
            console.error("Landing ID not found");
            return;
        }
        try {
            const res = await fetch(`/api/landings/${window.LANDING_ID}/lead`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            });

            if (res.ok) {
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Enviado!',
                        text: 'Hemos recibido tus datos correctamente.',
                        confirmButtonColor: this.defaults.theme.primary
                    });
                } else {
                    alert('¡Datos enviados correctamente! Gracias por tu interés.');
                }
            } else {
                if (window.Swal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al enviar los datos. Por favor intenta nuevamente.',
                        confirmButtonColor: this.defaults.theme.primary
                    });
                } else {
                    alert('Hubo un error al enviar los datos.');
                }
            }
        } catch (err) {
            console.error("Error submitting lead:", err);
            alert('Error de conexión.');
        }
    },

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        
        this.submitData('form', data);
        form.reset();
    },

    async handlePlanSelect(planName) {
        if (window.Swal) {
            const result = await Swal.fire({
                title: `Interés en plan ${planName}`,
                html: `
                    <p class="mb-3">Déjanos tus datos para contactarte.</p>
                    <input id="swal-input-name" class="swal2-input" placeholder="Tu Nombre">
                    <input id="swal-input-email" class="swal2-input" placeholder="Tu Correo Electrónico" type="email">
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Enviar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: this.defaults.theme.primary,
                preConfirm: () => {
                    const name = document.getElementById('swal-input-name').value;
                    const email = document.getElementById('swal-input-email').value;
                    if (!name || !email) {
                        Swal.showValidationMessage('Por favor completa ambos campos');
                    }
                    return { name, email };
                }
            });

            if (result.isConfirmed) {
                this.submitData('pricing', {
                    plan: planName,
                    name: result.value.name,
                    email: result.value.email
                });
            }
        } else {
            // Fallback if Swal not loaded
            if (confirm(`¿Estás interesado en el plan "${planName}"?`)) {
                const name = prompt("Por favor ingresa tu nombre:");
                if(name) {
                    const email = prompt("Por favor ingresa tu email:");
                    if(email) {
                         this.submitData('pricing', { plan: planName, name, email });
                    }
                }
            }
        }
    }
};

window.LandingRenderer = LandingRenderer;

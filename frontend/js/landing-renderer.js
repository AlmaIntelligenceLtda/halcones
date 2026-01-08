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

        // Apply Theme
        if (schema.theme) {
            this.applyTheme(schema.theme);
        } else {
            this.applyTheme(this.defaults.theme);
        }

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
                    const isV2 = (block.type || '').endsWith('_v2');
                    if (isV2) {
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
        hero: (data) => `
            <div class="landing-container">
                <div class="lp-hero">
                    <div class="lp-hero-content">
                        <h1>${data.headline}</h1>
                        <p>${data.subheadline}</p>
                        <br>
                        <a href="${data.ctaLink}" class="landing-btn">${data.ctaText}</a>
                    </div>
                    <div class="lp-hero-image">
                        <img src="${data.image}" alt="Hero Image" loading="lazy">
                    </div>
                </div>
            </div>
        `,
        features: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="text-center mb-5">
                    <h2>${data.title}</h2>
                </div>
                <div class="lp-features-grid">
                    ${data.items.map(item => `
                        <div class="lp-feature-card" style="${item.color ? `border-top: 4px solid ${item.color};` : ''}">
                            ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 150px; object-fit: cover; margin-bottom: 1rem; border-radius: 0.5rem;">` : ''}
                            <div class="lp-feature-icon" style="${item.color ? `background-color: ${item.color};` : ''}">
                                <i data-feather="${item.icon}"></i>
                            </div>
                            <h3>${item.title}</h3>
                            <p>${item.text}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        testimonials: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <h2 class="text-center mb-5">Lo que dicen nuestros clientes</h2>
                <div class="lp-testimonials-grid">
                    ${data.items.map(item => `
                        <div class="lp-testimonial-card">
                            <p>"${item.quote}"</p>
                            <div class="lp-testimonial-author">
                                <img src="${item.avatar || 'https://via.placeholder.com/50'}" class="lp-avatar" loading="lazy">
                                <div>
                                    <strong>${item.name}</strong><br>
                                    <small>${item.role}</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
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
        header: (data) => `
            <div style="background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1rem 0; position: sticky; top: 0; z-index: 1000;">
                <div class="landing-container" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--lp-primary);">${data.logotext}</div>
                    <nav class="lp-nav">
                        ${data.links.map(link => `
                            <a href="${link.url}" style="margin-left: 1.5rem; text-decoration: none; color: var(--lp-text); font-weight: 500;">${link.text}</a>
                        `).join('')}
                    </nav>
                </div>
            </div>
        `,
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
        footer: (data) => `
            <div class="lp-footer">
                <div class="landing-container">
                    <p>${data.copyright}</p>
                    <div class="mt-3">
                        ${data.links.map(link => `<a href="${link.url}">${link.text}</a>`).join('')}
                    </div>
                </div>
            </div>
        `,
        video: (data) => {
            // Helper to convert watch URLs to embed URLs
            let src = data.videoUrl;
            if (src.includes('watch?v=')) {
                src = src.replace('watch?v=', 'embed/');
                // Remove any ampersand parameters usually found after video id
                if (src.includes('&')) src = src.split('&')[0];
            } else if (src.includes('youtu.be/')) {
                src = src.replace('youtu.be/', 'www.youtube.com/embed/');
            }
            
            return `
            <div class="landing-container" id="${data.id || ''}">
                ${data.title ? `<div class="text-center mb-4"><h2>${data.title}</h2>${data.description ? `<p>${data.description}</p>` : ''}</div>` : ''}
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 0.5rem; background: #000;">
                    <iframe src="${src}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
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
        gallery: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="text-center mb-5">
                    <h2>${data.title}</h2>
                </div>
                <div class="lp-gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${data.images.map(img => `
                        <div class="lp-gallery-item" style="position: relative; overflow: hidden; border-radius: 0.5rem; height: 250px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <img src="${img.url}" alt="${img.caption || ''}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; display: block;"
                                 onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            ${img.caption ? `
                                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 0.75rem; font-size: 0.875rem; text-align: center; backdrop-filter: blur(2px);">
                                    ${img.caption}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
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

        // ---------------- Demo.html equivalent blocks (V2) ----------------
        header_v2: (data) => {
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

            const logoHtml = data.logoImage
                ? `<img src="${data.logoImage}" alt="Logo" class="lp-header-v2__logo-img" />`
                : `${data.logoText || ''}`;

            return `
                <div>
                    <style>
                        .lp-header-v2 { left: 0; width: 100%; box-sizing: border-box; }
                        .lp-header-v2 a:hover { color: ${linkHover} !important; }
                        body.has-builder-sidebar .lp-header-v2 { left: 300px !important; width: calc(100% - 300px) !important; }
                        @media (max-width: 768px) { body.has-builder-sidebar .lp-header-v2 { left: 0 !important; width: 100% !important; } }
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

        hero_v2: (data) => {
            const angle = (typeof data.overlayAngleDeg === 'number') ? data.overlayAngleDeg : 135;
            const from = data.overlayFromColor || 'var(--lp-primary)';
            const to = data.overlayToColor || 'var(--lp-accent)';
            const fromA = (typeof data.overlayFromOpacity === 'number') ? data.overlayFromOpacity : 0.9;
            const toA = (typeof data.overlayToOpacity === 'number') ? data.overlayToOpacity : 0.8;
            const minVh = (typeof data.minHeightVh === 'number') ? data.minHeightVh : 70;
            const textColor = data.textColor || '#ffffff';
            const bgImg = data.backgroundImageUrl || '';

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

            const buttons = (data.buttons || []).map(btn => {
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
                        <h1 style="font-size:3rem; margin:0 0 20px; font-weight:700; text-shadow:2px 2px 4px rgba(0,0,0,0.3);">${data.headline || ''}</h1>
                        <p style="font-size:1.3rem; margin:0 0 30px; font-weight:300;">${data.subheadline || ''}</p>
                        <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">${buttons}</div>
                    </div>
                </section>
            `;
        },

        features_v2: (data) => {
            const min = (typeof data.columnsMinWidthPx === 'number') ? data.columnsMinWidthPx : 300;
            const gap = (typeof data.gapPx === 'number') ? data.gapPx : 30;
            const cards = (data.cards || []).map(card => {
                const radius = (typeof card.radiusPx === 'number') ? `${card.radiusPx}px` : '15px';
                const shadow = card.shadow || '0 10px 30px rgba(0,0,0,0.1)';
                const cardBg = card.cardBg || '#ffffff';
                const iconBg = `linear-gradient(45deg, ${card.iconBgFrom || 'var(--lp-primary)'}, ${card.iconBgTo || 'var(--lp-secondary)'})`;
                return `
                    <div style="background:${cardBg}; padding:40px 30px; border-radius:${radius}; box-shadow:${shadow}; text-align:center; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.15)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${shadow}';">
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

        gallery_v2: (data) => {
            const h = (typeof data.itemHeightPx === 'number') ? data.itemHeightPx : 200;
            const items = (data.items || []).map(item => `
                <div style="position:relative; border-radius:10px; overflow:hidden; height:${h}px; background-image:url('${item.imageUrl || ''}'); background-size:cover; background-position:center; background-repeat:no-repeat; display:flex; align-items:center; justify-content:center; color:white; font-weight:500; text-shadow:2px 2px 4px rgba(0,0,0,0.7); font-size:1.2rem;">
                    ${item.label || ''}
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

        testimonials_v2: (data) => {
            const bg = data.backgroundColor || '#f8f9fa';
            const cards = (data.items || []).map(t => `
                <div style="background:white; padding:30px; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1); margin-bottom:20px;">
                    <p style="font-style:italic; color:#555; margin:0 0 15px;">"${t.quote || ''}"</p>
                    <div style="font-weight:600; color: var(--lp-primary);">- ${t.author || ''}</div>
                </div>
            `).join('');

            return `
                <section style="background:${bg}; padding:80px 20px;">
                    <div class="landing-container" style="max-width:1000px;">
                        <h2 style="text-align:center; margin-bottom:50px;">${data.title || ''}</h2>
                        ${cards}
                    </div>
                </section>
            `;
        },

        contact_v2: (data) => {
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

        footer_v2: (data) => `
            <footer style="background:${data.backgroundColor || 'var(--lp-primary)'}; color:${data.textColor || '#fff'}; padding:30px 20px; text-align:center;">
                <div class="landing-container">
                    <p style="margin:0; font-size:0.9rem;">${data.text || ''}</p>
                </div>
            </footer>
        `
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

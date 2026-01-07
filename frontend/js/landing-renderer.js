const LandingRenderer = {
    defaults: {
        theme: {
            primary: '#2563eb',
            secondary: '#1e293b',
            font: 'Overpass, sans-serif'
        }
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
        if (t.font) root.style.setProperty('--lp-font-main', t.font);
        if (t.font) root.style.setProperty('--lp-font-heading', t.font);
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

        document.querySelectorAll('.landing-section > div').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
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

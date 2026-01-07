/**
 * Landing Page Builder Engine
 * Interprets JSON Schema -> Renders HTML
 */

var LandingBuilder = {
    // Default Theme
    defaults: {
        theme: {
            primary: '#2563eb',
            secondary: '#1e293b',
            bg: '#ffffff',
            text: '#334155',
            font: 'Overpass, sans-serif'
        }
    },

    // Mock Data (Fallback)
    mockSchema: {
        theme: {
            primary: '#4f46e5',
            secondary: '#0f172a',
            bg: '#ffffff',
            text: '#334155',
            font: 'Inter, sans-serif'
        },
        blocks: [
            {
                type: 'hero',
                data: {
                    headline: 'Construye Landing Pages en Minutos',
                    subheadline: 'Una solución potente, flexible y sin código para tus campañas de marketing.',
                    ctaText: 'Empezar',
                    ctaLink: '#features',
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
                }
            },
            {
                type: 'features',
                data: {
                    id: 'features',
                    title: 'Todo lo que necesitas',
                    items: [
                        { icon: 'zap', title: 'Ultrarrápido', text: 'Optimizado para Core Web Vitals y carga instantánea.' },
                        { icon: 'layout', title: 'Diseño Responsive', text: 'Se ve perfecto en móviles, tablets y escritorio.' },
                        { icon: 'lock', title: 'Seguro', text: 'SSL incluido y protección contra ataques.' },
                        { icon: 'box', title: 'Marca Blanca', text: 'Personaliza totalmente la experiencia sin marcas de agua.' },
                        { icon: 'code', title: 'Acceso API', text: 'Integra tus propias herramientas y flujos de trabajo.' }
                    ]
                }
            },


            {
                type: 'footer',
                data: {
                    copyright: '© 2026 In-Pages. Todos los derechos reservados.',
                    links: [
                        { text: 'Términos', url: '#' },
                        { text: 'Privacidad', url: '#' }
                    ]
                }
            }
        ]
    },

    // Block Templates for New Sections
    templates: {
        hero: {
            type: 'hero',
            data: {
                headline: 'Nuevo Hero Section',
                subheadline: 'Describe tu propuesta de valor aquí.',
                ctaText: 'Llamada a la acción',
                ctaLink: '#',
                image: 'https://via.placeholder.com/800x600'
            }
        },
        features: {
            type: 'features',
            data: {
                id: 'features',
                title: 'Características Principales',
                items: [
                    { icon: 'check', title: 'Característica 1', text: 'Descripción breve.' },
                    { icon: 'check', title: 'Característica 2', text: 'Descripción breve.' },
                    { icon: 'check', title: 'Característica 3', text: 'Descripción breve.' }
                ]
            }
        },
        testimonials: {
            type: 'testimonials',
            data: {
                id: 'testimonials',
                items: [
                    { quote: 'Increíble servicio, totalmente recomendado.', name: 'Juan Pérez', role: 'CEO, Empresa X' }
                ]
            }
        },
        pricing: {
            type: 'pricing',
            data: {
                id: 'pricing',
                title: 'Nuestros Planes',
                plans: [
                    { name: 'Básico', price: '29', features: ['Feature 1', 'Feature 2'], cta: 'Elegir' },
                    { name: 'Pro', price: '59', features: ['Feature 1', 'Feature 2', 'Feature 3'], cta: 'Elegir', featured: true }
                ]
            }
        },
        form: {
            type: 'form',
            data: {
                id: 'contact',
                title: 'Contáctanos',
                submitText: 'Enviar Mensaje',
                fields: [
                    { label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
                    { label: 'Email', type: 'email', placeholder: 'tu@email.com' }
                ]
            }
        },
        footer: {
            type: 'footer',
            data: {
                copyright: '© 2024 Mi Empresa.',
                links: [{ text: 'Aviso Legal', url: '#' }]
            }
        },
        header: {
            type: 'header',
            data: {
                logotext: 'Mi Logo',
                links: [
                    { text: 'Inicio', url: '#hero' },
                    { text: 'Características', url: '#features' },
                    { text: 'Contacto', url: '#contact' }
                ]
            }
        },
        social: {
            type: 'social',
            data: {
                id: 'social',
                title: 'Nuestras Redes',
                links: [
                    { platform: 'facebook', url: '#' },
                    { platform: 'twitter', url: '#' },
                    { platform: 'instagram', url: '#' },
                    { platform: 'linkedin', url: '#' }
                ]
            }
        },
        video: {
            type: 'video',
            data: {
                id: 'video',
                title: 'Nuestra Historia',
                description: 'Conoce más sobre nosotros en este video.',
                videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
            }
        },
        embed: {
            type: 'embed',
            data: {
                id: 'embed-section',
                title: 'Síguenos en Redes',
                url: ''
            }
        },
        gallery: {
            type: 'gallery',
            data: {
                id: 'gallery',
                title: 'Galería de Imágenes',
                images: [
                    { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80', caption: 'Workspace' },
                    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', caption: 'Team' },
                    { url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80', caption: 'Design' }
                ]
            }
        },
        faq: {
            type: 'faq',
            data: {
                id: 'faq',
                title: 'Preguntas Frecuentes',
                items: [
                    { question: '¿El viaje incluye seguro?', answer: 'Sí, todos nuestros paquetes cuentan con seguro de viajero y asistencia 24/7 en destino.' },
                    { question: '¿Puedo cancelar mi reserva?', answer: 'Ofrecemos cancelación gratuita hasta 48 horas antes de la salida del vuelo o tour.' },
                    { question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito, débito y planes de financiamiento para tus vacaciones.' }
                ]
            }
        }
    },

    setDevice(mode) {
        const root = document.getElementById('landing-builder-root');
        if (!root) return;

        root.style.transition = 'width 0.3s ease, margin 0.3s ease';
        root.style.margin = '0 auto';
        root.style.boxShadow = '0 0 20px rgba(0,0,0,0.2)';

        switch (mode) {
            case 'mobile':
                root.style.width = '375px';
                root.style.border = '10px solid #1e293b';
                root.style.borderRadius = '20px';
                break;
            case 'tablet':
                root.style.width = '768px';
                root.style.border = '10px solid #1e293b';
                root.style.borderRadius = '12px';
                break;
            case 'desktop':
            default:
                root.style.width = '100%';
                root.style.border = 'none';
                root.style.borderRadius = '0';
                break;
        }

        // Active State for buttons
        document.querySelectorAll('.lp-builder-header button').forEach(btn => {
            if(btn.onclick && btn.onclick.toString().includes(mode)) {
                btn.style.color = 'var(--lp-primary)';
                btn.style.background = 'rgba(255,255,255,0.1)';
            } else {
                btn.style.color = 'white';
                btn.style.background = 'transparent';
            }
        });
    },

    init(containerId, landingOrSchema = null) {
        this.containerId = containerId;
        const container = document.getElementById(containerId);
        if (!container) return;

        // Use mock schema if none provided (or fetch from API in real app)
        if (landingOrSchema && landingOrSchema.id) {
            this.currentLanding = landingOrSchema;
            // Ensure data is valid, if it's empty string or null, use mock
             if (this.currentLanding.data && Object.keys(this.currentLanding.data).length > 0) {
                 this.currentSchema = this.currentLanding.data;
             } else {
                 this.currentSchema = this.mockSchema;
             }
        } else {
            // Initialize empty landing object for creation mode
            this.currentLanding = {
                slug: '',
                title: '',
                is_public: false,
                data: landingOrSchema || this.mockSchema
            };
            this.currentSchema = this.currentLanding.data;
        }

        // Apply Theme
        this.applyTheme(this.currentSchema.theme);

        // Render Blocks
        this.renderCanvas(containerId);

        // Render Editor Sidebar
        this.renderEditor(containerId);

        // Initialize Animations (Simple Intersection Observer)
        this.initAnimations();
    },

    renderCanvas(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear loader
        
        this.currentSchema.blocks.forEach((block, index) => {
            const renderFn = this.renderMap[block.type];
            if (renderFn) {
                const blockHtml = renderFn(block.data);
                const section = document.createElement('div');
                section.className = `landing-section section-${block.type}`;
                section.dataset.blockIndex = index;
                section.innerHTML = blockHtml;
                
                // Add hover effect for selection (optional visual cue)
                section.style.position = 'relative';
                
                container.appendChild(section);

                // Execute scripts in the block if any (required for embeds like Instagram/Twitter)
                const scripts = section.querySelectorAll('script');
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });

                // Re-trigger social embed parsers if they are already loaded
                if (window.instgrm) window.instgrm.Embeds.process();
                if (window.twttr) window.twttr.widgets.load();
                if (window.FB) window.FB.XFBML.parse();
            }
        });

        // Re-initialize Icons
        if (window.feather) feather.replace();
    },

    renderArrayField(key, array, block, containerId, parentElement) {
        const container = document.createElement('div');
        container.className = 'lp-array-container';
        container.style.marginTop = '1rem';
        container.style.borderTop = '1px solid #475569';
        container.style.paddingTop = '1rem';

        const label = document.createElement('label');
        label.className = 'lp-control-label';
        label.innerText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        container.appendChild(label);

        // Define fields based on block type
        let itemFields = ['title', 'text'];
        let defaultItem = { title: 'Nuevo Item', text: 'Descripción' };

        if (block.type === 'features') {
            itemFields = ['icon', 'title', 'text', 'image', 'color'];
            defaultItem = { icon: 'star', title: 'Nuevo Feature', text: 'Descripción', image: '', color: '' };
        } else if (block.type === 'testimonials') {
            itemFields = ['quote', 'name', 'role', 'avatar'];
            defaultItem = { quote: 'Testimonio', name: 'Nombre', role: 'Cargo', avatar: '' };
        } else if (block.type === 'header') {
            itemFields = ['text', 'url'];
            defaultItem = { text: 'Enlace', url: '#' };
        } else if (block.type === 'social') {
            itemFields = ['platform', 'url'];
            defaultItem = { platform: 'facebook', url: '#' };
        } else if (block.type === 'pricing' && key === 'plans') {
             // Simplified for pricing plans
             itemFields = ['name', 'price', 'features', 'cta', 'featured']; 
             defaultItem = { name: 'Plan', price: '0', features: [], cta: 'Elegir', featured: false };
        } else if (block.type === 'gallery') {
            itemFields = ['url', 'caption'];
            defaultItem = { url: 'https://via.placeholder.com/600x400', caption: '' };
        } else if (block.type === 'faq') {
            itemFields = ['question', 'answer'];
            defaultItem = { question: '¿Nueva Pregunta?', answer: 'Escribe la respuesta aquí.' };
        } else if (block.type === 'form' && key === 'fields') {
            itemFields = ['label', 'type', 'placeholder'];
            defaultItem = { label: 'Nuevo Campo', type: 'text', placeholder: '' };
        }

        array.forEach((item, index) => {
            const itemContainer = document.createElement('div');
            itemContainer.style.background = '#0f172a';
            itemContainer.style.padding = '0.5rem';
            itemContainer.style.marginBottom = '0.5rem';
            itemContainer.style.borderRadius = '0.25rem';
            itemContainer.style.border = '1px solid #334155';

            // Item Header
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '0.5rem';
            
            const itemTitle = document.createElement('span');
            itemTitle.style.fontSize = '0.8rem';
            itemTitle.style.fontWeight = 'bold';
            itemTitle.innerText = item.title || item.name || item.label || `Item ${index + 1}`;
            
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '×';
            delBtn.className = 'landing-btn small';
            delBtn.style.backgroundColor = '#ef4444';
            delBtn.style.padding = '0.1rem 0.4rem';
            delBtn.style.fontSize = '0.7rem';
            delBtn.onclick = (e) => {
                if(confirm('¿Eliminar item?')) {
                    array.splice(index, 1);
                    this.renderCanvas(containerId);
                    this.renderEditor(containerId);
                }
            };

            header.appendChild(itemTitle);
            header.appendChild(delBtn);
            itemContainer.appendChild(header);

            // Fields
            const fieldsContainer = document.createElement('div');
            
            itemFields.forEach(itemKey => {
                const fieldWrapper = document.createElement('div');
                fieldWrapper.style.marginBottom = '0.5rem';

                const fieldLabel = document.createElement('label');
                fieldLabel.className = 'lp-control-label';
                fieldLabel.style.fontSize = '0.75rem';
                fieldLabel.style.color = '#94a3b8';
                fieldLabel.style.marginBottom = '0.2rem';
                fieldLabel.innerText = itemKey;
                
                let input;
                if (itemKey === 'text' || itemKey === 'quote' || itemKey === 'subheadline' || itemKey === 'features' || itemKey === 'answer') {
                    input = document.createElement('textarea');
                    input.className = 'lp-control-textarea';
                    input.style.minHeight = '50px';
                    input.style.fontSize = '0.8rem';
                    if (itemKey === 'features') {
                        input.placeholder = 'Una característica por línea';
                    }
                } else if (itemKey === 'color') {
                     input = document.createElement('input');
                     input.type = 'color';
                     input.className = 'lp-control-input';
                     input.style.height = '30px';
                     input.style.padding = '0';
                } else if (itemKey === 'platform') {
                    input = document.createElement('select');
                    input.className = 'lp-control-input';
                    // Common social icons supported by Feather Icons
                    const socialIcons = [
                        { val: 'facebook', label: 'Facebook' },
                        { val: 'twitter', label: 'Twitter' },
                        { val: 'instagram', label: 'Instagram' },
                        { val: 'linkedin', label: 'LinkedIn' },
                        { val: 'youtube', label: 'YouTube' },
                        { val: 'message-circle', label: 'WhatsApp' },
                        { val: 'github', label: 'GitHub' },
                        { val: 'twitch', label: 'Twitch' },
                        { val: 'slack', label: 'Slack' },
                        { val: 'dribbble', label: 'Dribbble' },
                        { val: 'figma', label: 'Figma' },
                        { val: 'gitlab', label: 'GitLab' },
                        { val: 'trello', label: 'Trello' },
                        { val: 'mail', label: 'Mail' },
                        { val: 'link', label: 'Link' },
                        { val: 'globe', label: 'Website' },
                        { val: 'phone', label: 'Phone' }
                    ];
                    socialIcons.forEach(iconObj => {
                        const opt = document.createElement('option');
                        opt.value = iconObj.val;
                        opt.innerText = iconObj.label;
                        if (item[itemKey] === iconObj.val) opt.selected = true;
                        input.appendChild(opt);
                    });
                    input.onchange = (e) => {
                        item[itemKey] = e.target.value;
                        this.renderCanvas(containerId);
                    };
                    fieldWrapper.appendChild(fieldLabel);
                    fieldWrapper.appendChild(input);
                    fieldsContainer.appendChild(fieldWrapper);
                    return;
                } else if (itemKey === 'featured') {
                    input = document.createElement('input');
                    input.type = 'checkbox';
                    input.checked = item[itemKey];
                    input.onchange = (e) => {
                        item[itemKey] = e.target.checked;
                        this.renderCanvas(containerId);
                    };
                    fieldWrapper.appendChild(fieldLabel);
                    fieldWrapper.appendChild(input);
                    fieldsContainer.appendChild(fieldWrapper);
                    return; // Skip default input handling
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'lp-control-input';
                    input.style.fontSize = '0.8rem';
                    input.style.padding = '0.25rem 0.5rem';
                }
                
                if (itemKey !== 'featured') {
                    if (itemKey === 'features') {
                        input.value = Array.isArray(item[itemKey]) ? item[itemKey].join('\n') : item[itemKey];
                        input.addEventListener('input', (e) => {
                            item[itemKey] = e.target.value.split('\n').filter(line => line.trim() !== '');
                            this.renderCanvas(containerId);
                        });
                    } else {
                        input.value = item[itemKey] || '';
                        input.addEventListener('input', (e) => {
                            item[itemKey] = e.target.value;
                            this.renderCanvas(containerId);
                        });
                    }
                }

                fieldWrapper.appendChild(fieldLabel);
                fieldWrapper.appendChild(input);
                fieldsContainer.appendChild(fieldWrapper);
            });

            itemContainer.appendChild(fieldsContainer);
            container.appendChild(itemContainer);
        });

        // Add Item Button
        const addBtn = document.createElement('button');
        addBtn.className = 'landing-btn secondary small';
        addBtn.style.width = '100%';
        addBtn.style.marginTop = '0.5rem';
        addBtn.innerText = '+ Agregar Item';
        addBtn.onclick = () => {
            array.push(JSON.parse(JSON.stringify(defaultItem)));
            this.renderCanvas(containerId);
            this.renderEditor(containerId);
        };
        container.appendChild(addBtn);

        parentElement.appendChild(container);
    },

    renderEditor(containerId) {
        let sidebar = document.getElementById('lp-builder-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'lp-builder-sidebar';
            document.body.appendChild(sidebar);
            document.body.classList.add('has-builder-sidebar');
        }

        sidebar.innerHTML = `
            <div class="lp-builder-header" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>Editor Visual</h3>
                    <div style="display: flex; gap: 0.5rem;">
                        <a href="/pages/${this.currentLanding?.slug || ''}" target="_blank" class="landing-btn secondary small" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; text-decoration: none; display: flex; align-items: center; border-color: #94a3b8; color: white;">Ver</a>
                        <button class="landing-btn small" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="LandingBuilder.save()">Guardar</button>
                    </div>
                </div>
                <div style="display: flex; justify-content: center; gap: 0.5rem; background: #334155; padding: 0.25rem; border-radius: 0.25rem;">
                    <button onclick="LandingBuilder.setDevice('desktop')" class="landing-btn secondary small" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; border-color: transparent; color: white;">
                        <i data-feather="monitor"></i>
                    </button>
                    <button onclick="LandingBuilder.setDevice('tablet')" class="landing-btn secondary small" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; border-color: transparent; color: white;">
                        <i data-feather="tablet"></i>
                    </button>
                    <button onclick="LandingBuilder.setDevice('mobile')" class="landing-btn secondary small" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; border-color: transparent; color: white;">
                         <i data-feather="smartphone"></i>
                    </button>
                </div>
            </div>
            <div class="lp-builder-controls" id="lp-builder-controls" style="padding-top: 0.5rem;"></div>
            <div class="lp-builder-footer" style="padding: 1.5rem; border-top: 1px solid #334155;">
                <h4 style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 1rem;">Agregar Sección</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                    ${Object.keys(this.templates).map(type => `
                        <button class="landing-btn secondary small" style="padding: 0.5rem; font-size: 0.75rem; text-transform: capitalize;" 
                                onclick="LandingBuilder.addBlock('${type}', '${containerId}')">
                            + ${type}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const controlsContainer = sidebar.querySelector('#lp-builder-controls');

        // Render General Settings (Slug, Title, Published) FIRST
        this.renderGeneralSettings(controlsContainer);

        // Render Global Settings (Theme)
        this.renderGlobalSettings(controlsContainer, containerId);

        this.currentSchema.blocks.forEach((block, index) => {
            const group = document.createElement('div');
            group.className = 'lp-control-group';
            
            // Header with Controls
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '1rem';
            header.style.borderBottom = '1px solid #475569';
            header.style.paddingBottom = '0.5rem';

            const title = document.createElement('h4');
            title.innerText = `${block.type.toUpperCase()}`;
            title.style.margin = '0';
            title.style.border = 'none';
            title.style.padding = '0';

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.gap = '0.25rem';

            // Move Up
            if (index > 0) {
                const upBtn = document.createElement('button');
                upBtn.innerHTML = '↑';
                upBtn.className = 'landing-btn secondary small';
                upBtn.style.padding = '0.1rem 0.4rem';
                upBtn.onclick = () => this.moveBlock(index, -1, containerId);
                actions.appendChild(upBtn);
            }

            // Move Down
            if (index < this.currentSchema.blocks.length - 1) {
                const downBtn = document.createElement('button');
                downBtn.innerHTML = '↓';
                downBtn.className = 'landing-btn secondary small';
                downBtn.style.padding = '0.1rem 0.4rem';
                downBtn.onclick = () => this.moveBlock(index, 1, containerId);
                actions.appendChild(downBtn);
            }

            // Delete
            const delBtn = document.createElement('button');
            delBtn.innerHTML = '×';
            delBtn.className = 'landing-btn small';
            delBtn.style.backgroundColor = '#ef4444';
            delBtn.style.padding = '0.1rem 0.4rem';
            delBtn.onclick = () => this.deleteBlock(index, containerId);
            actions.appendChild(delBtn);

            header.appendChild(title);
            header.appendChild(actions);
            group.appendChild(header);

            // Fields
            Object.keys(block.data).forEach(key => {
                if (key === 'id' || key === 'helperText') return; // Hide internal ID field from UI
                if (block.type === 'embed' && key === 'htmlCode') return; // Hide HTML code if not needed

                const value = block.data[key];
                
                if (Array.isArray(value)) {
                    this.renderArrayField(key, value, block, containerId, group);
                    return;
                }

                if (typeof value === 'object') return; // Skip other objects for now

                const label = document.createElement('label');
                label.className = 'lp-control-label';
                label.innerText = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // CamelCase to Title Case
                
                let input;
                if (key === 'subheadline' || key === 'text' || (typeof value === 'string' && value.length > 50)) {
                    input = document.createElement('textarea');
                    input.className = 'lp-control-textarea';
                } else {
                    input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'lp-control-input';
                }
                
                input.value = value;
                input.addEventListener('input', (e) => {
                    block.data[key] = e.target.value;
                    this.renderCanvas(containerId);
                });

                group.appendChild(label);
                group.appendChild(input);
            });

            controlsContainer.appendChild(group);
        });

        // Initialize icons in sidebar
        if (window.feather) feather.replace();
    },

    renderGeneralSettings(container) {
        // Ensure currentLanding exists to avoid crashes
        if (!this.currentLanding) {
             this.currentLanding = { slug: '', title: '', is_public: false };
        }

        const group = document.createElement('div');
        group.className = 'lp-control-group';
        group.style.background = '#0f172a'; // Darker bg for emphasis
        group.innerHTML = `
            <div style="margin-bottom: 1rem; border-bottom: 1px solid #475569; padding-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #f59e0b; font-size: 0.875rem; text-transform: uppercase;">Ajustes de Publicación</h4>
            </div>
        `;

        // Slug Input
        const slugWrapper = document.createElement('div');
        slugWrapper.style.marginBottom = '1rem';
        slugWrapper.innerHTML = `
            <label class="lp-control-label">URL Slug (Identificador)</label>
            <input type="text" class="lp-control-input" id="setting-slug" value="${this.currentLanding.slug || ''}" placeholder="ej. mi-producto">
            <small style="color: #64748b; font-size: 0.75rem;">Tu página estará en: /pages/${this.currentLanding.slug || 'tu-slug'}</small>
        `;
        group.appendChild(slugWrapper);

        // Title Input
        const titleWrapper = document.createElement('div');
        titleWrapper.style.marginBottom = '1rem';
        titleWrapper.innerHTML = `
            <label class="lp-control-label">Título de la Página</label>
            <input type="text" class="lp-control-input" id="setting-title" value="${this.currentLanding.title || ''}" placeholder="Mi Landing Page">
        `;
        group.appendChild(titleWrapper);

        // Published Toggle
        const statusWrapper = document.createElement('div');
        statusWrapper.style.marginBottom = '0.5rem';
        statusWrapper.style.display = 'flex';
        statusWrapper.style.alignItems = 'center';
        statusWrapper.style.gap = '0.5rem';
        
        const isPublished = this.currentLanding.is_public;
        statusWrapper.innerHTML = `
            <input type="checkbox" id="setting-published" ${isPublished ? 'checked' : ''} style="width: 16px; height: 16px;">
            <label for="setting-published" class="lp-control-label" style="margin: 0; cursor: pointer;">Página Publicada</label>
        `;
        group.appendChild(statusWrapper);

        // Update links dynamically when slug changes
        const slugInput = slugWrapper.querySelector('#setting-slug');
        slugInput.addEventListener('input', (e) => {
            const val = e.target.value;
            // Update help text
            slugWrapper.querySelector('small').innerText = `Tu página estará en: /pages/${val || 'tu-slug'}`;
            // Update global currentLanding state immediately so 'Ver' button works on re-render or if we had a live binding (which we dont for the button, but good practice)
            this.currentLanding.slug = val;
            
            // Try to update the 'Ver' button href if it exists in the DOM
            const verBtn = document.querySelector('.lp-builder-header a.landing-btn');
            if(verBtn) {
                verBtn.href = `/pages/${val}`;
            }
        });

        container.appendChild(group);
    },

    renderGlobalSettings(container, containerId) {
        const group = document.createElement('div');
        group.className = 'lp-control-group';
        group.innerHTML = `
            <div style="margin-bottom: 1rem; border-bottom: 1px solid #475569; padding-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #94a3b8; font-size: 0.875rem; text-transform: uppercase;">Configuración Global</h4>
            </div>
        `;

        const colors = [
            { key: 'primary', label: 'Color Primario' },
            { key: 'secondary', label: 'Color Secundario' },
            { key: 'bg', label: 'Fondo' },
            { key: 'text', label: 'Texto' }
        ];

        colors.forEach(c => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '0.75rem';
            
            const label = document.createElement('label');
            label.className = 'lp-control-label';
            label.innerText = c.label;
            
            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.gap = '0.5rem';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = this.currentSchema.theme[c.key] || this.defaults.theme[c.key];
            colorInput.style.width = '40px';
            colorInput.style.height = '30px';
            colorInput.style.border = 'none';
            colorInput.style.padding = '0';
            colorInput.style.background = 'transparent';
            colorInput.style.cursor = 'pointer';

            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.className = 'lp-control-input';
            textInput.style.marginBottom = '0';
            textInput.value = this.currentSchema.theme[c.key] || this.defaults.theme[c.key];

            const updateColor = (val) => {
                this.currentSchema.theme[c.key] = val;
                this.applyTheme(this.currentSchema.theme);
                colorInput.value = val;
                textInput.value = val;
            };

            colorInput.addEventListener('input', (e) => updateColor(e.target.value));
            textInput.addEventListener('input', (e) => updateColor(e.target.value));

            inputContainer.appendChild(colorInput);
            inputContainer.appendChild(textInput);
            wrapper.appendChild(label);
            wrapper.appendChild(inputContainer);
            group.appendChild(wrapper);
        });

        // Font Family Selector
        const fontWrapper = document.createElement('div');
        fontWrapper.style.marginBottom = '0.75rem';
        const fontLabel = document.createElement('label');
        fontLabel.className = 'lp-control-label';
        fontLabel.innerText = 'Tipografía';
        
        const fontSelect = document.createElement('select');
        fontSelect.className = 'lp-control-input';
        
        const fonts = [
            { val: "'Overpass', sans-serif", label: 'Overpass (Default)' },
            { val: "'Inter', sans-serif", label: 'Inter' },
            { val: "system-ui, -apple-system, sans-serif", label: 'System UI' }, 
            { val: "'Georgia', serif", label: 'Georgia (Serif)' },
            { val: "'Courier New', monospace", label: 'Courier New (Mono)' }
        ];

        fonts.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.val;
            opt.innerText = f.label;
            if((this.currentSchema.theme.font || this.defaults.theme.font) === f.val) opt.selected = true;
            fontSelect.appendChild(opt);
        });

        fontSelect.addEventListener('change', (e) => {
            this.currentSchema.theme.font = e.target.value;
            this.applyTheme(this.currentSchema.theme);
        });

        fontWrapper.appendChild(fontLabel);
        fontWrapper.appendChild(fontSelect);
        group.appendChild(fontWrapper);

        container.appendChild(group);
    },

    addBlock(type, containerId) {
        const template = JSON.parse(JSON.stringify(this.templates[type])); // Deep copy
        
        // Ensure unique ID for the block to prevent duplicate IDs in HTML
        if (template.data && template.data.id) {
            const timestamp = Date.now().toString().slice(-6);
             template.data.id = `${type}-${timestamp}`;
        }

        this.currentSchema.blocks.push(template);
        this.renderCanvas(containerId);
        this.renderEditor(containerId);
        // Scroll to bottom of sidebar
        setTimeout(() => {
            const sidebar = document.getElementById('lp-builder-sidebar');
            sidebar.scrollTop = sidebar.scrollHeight;
        }, 100);
    },

    moveBlock(index, direction, containerId) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.currentSchema.blocks.length) return;
        
        const temp = this.currentSchema.blocks[index];
        this.currentSchema.blocks[index] = this.currentSchema.blocks[newIndex];
        this.currentSchema.blocks[newIndex] = temp;
        
        this.renderCanvas(containerId);
        this.renderEditor(containerId);
    },

    deleteBlock(index, containerId) {
        if (confirm('¿Estás seguro de eliminar esta sección?')) {
            this.currentSchema.blocks.splice(index, 1);
            this.renderCanvas(containerId);
            this.renderEditor(containerId);
        }
    },

    async save() {
        const btn = document.querySelector('button[onclick="LandingBuilder.save()"]');
        const originalText = btn ? btn.innerText : 'Guardar';
        if (btn) {
            btn.innerText = 'Guardando...';
            btn.disabled = true;
        }

        try {
            // Retrieve values from General Settings inputs
            const newSlug = document.getElementById('setting-slug')?.value;
            const newTitle = document.getElementById('setting-title')?.value;
            const isPublished = document.getElementById('setting-published')?.checked;

            if (newSlug) this.currentLanding.slug = newSlug;
            if (newTitle) this.currentLanding.title = newTitle;
            if (isPublished !== undefined) this.currentLanding.is_public = isPublished;

            if (!this.currentLanding.slug) {
                alert('El campo Slug es obligatorio para guardar.');
                throw new Error('Slug missing');
            }

            const payload = {
                title: this.currentLanding.title || 'Sin Título',
                slug: this.currentLanding.slug,
                is_public: !!this.currentLanding.is_public,
                description: this.currentLanding.description || '',
                data: this.currentSchema
            };

            let res;
            if (this.currentLanding.id) {
                // Update
                res = await fetch(`/api/landings/${this.currentLanding.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // Create
                res = await fetch(`/api/landings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                const updated = await res.json();
                this.currentLanding = updated;
                alert('¡Diseño guardado exitosamente!');

                // Update URL parameter without reload
                const url = new URL(window.location);
                url.searchParams.set('slug', updated.slug);
                window.history.pushState({}, '', url);

                // Re-render UI to update links
                if (this.containerId) this.renderEditor(this.containerId);

            } else {
                const err = await res.json().catch(() => ({}));
                alert('Error al guardar: ' + (err.error || 'Desconocido'));
            }
        } catch (error) {
            if (error.message !== 'Slug missing') {
                console.error('Error saving landing:', error);
                alert('Error de conexión al guardar.');
            }
        } finally {
            if (btn) {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        }
    },

    applyTheme(theme) {
        const root = document.documentElement;
        const t = { ...this.defaults.theme, ...theme };
        
        root.style.setProperty('--lp-primary', t.primary);
        root.style.setProperty('--lp-secondary', t.secondary);
        if (t.bg) root.style.setProperty('--lp-bg', t.bg);
        if (t.text) root.style.setProperty('--lp-text', t.text);
        if (t.font) root.style.setProperty('--lp-font-main', t.font);
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
                            <a href="#" class="landing-btn ${plan.featured ? '' : 'secondary'}" style="width:100%">${plan.cta || 'Seleccionar'}</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `,
        form: (data) => `
            <div class="landing-container" id="${data.id || ''}">
                <div class="lp-form-wrapper">
                    <h2 class="text-center mb-4">${data.title}</h2>
                    <form onsubmit="event.preventDefault(); alert('Formulario enviado (Demo)');">
                        ${data.fields.map(field => `
                            <div class="lp-form-group">
                                <label>${field.label}</label>
                                <input type="${field.type}" class="lp-input" placeholder="${field.placeholder}" required>
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
    }
};

// Expose initLanding globally as requested
window.initLanding = (schema) => LandingBuilder.init('landing-builder-root', schema);

// Initialize when script loads
// Check if we have a slug in URL to fetch real data, otherwise use mock
(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    let landing = null;

    if (slug) {
        try {
            console.log("Fetching data for slug:", slug);
            const res = await fetch(`/api/landings/editor/${slug}`);
            
            if (res.status === 401) {
                window.location.href = '/login.html';
                return;
            }

            if (res.ok) {
                landing = await res.json();
                console.log("Loaded landing:", landing);
            } else {
                console.error("Error fetching landing:", res.status);
                // alert("No se pudo cargar la landing. Verifica que existe y tienes permisos.");
            }
        } catch (e) {
            console.error("Error loading landing data", e);
        }
    }

    // Auto-init if the container exists
    if (document.getElementById('landing-builder-root')) {
        LandingBuilder.init('landing-builder-root', landing);
    }
})();

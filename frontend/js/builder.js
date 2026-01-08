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

    // Default Demo Schema (Fallback for first-time edits)
    // This mirrors the layout of frontend/demo.html but expressed as JSON blocks.
    mockSchema: {
        theme: {
            primary: '#1e3a8a',
            secondary: '#1e293b',
            accent: '#f59e0b',
            bg: '#ffffff',
            text: '#334155',
            font: "'Poppins', 'Overpass', sans-serif",
            headingFont: "'Poppins', 'Overpass', sans-serif",
            radius: '0.75rem',
            shadow: '0 10px 30px rgba(0,0,0,0.1)',
            container: '1200px',
            spacing: '5rem'
        },
        blocks: [
            {
                type: 'header_v2',
                data: {
                    logoText: 'Halcones',
                    logoImage: '',
                    links: [
                        { text: 'Inicio', url: '#home' },
                        { text: 'Servicios', url: '#services' },
                        { text: 'Contacto', url: '#contact' }
                    ],
                    style: {
                        backgroundColor: '#ffffff',
                        backgroundOpacity: 0.95,
                        blurPx: 10,
                        shadow: '0 2px 20px rgba(0,0,0,0.1)',
                        fixed: true,
                        paddingY: 15,
                        paddingX: 20,
                        logoColor: '#1e3a8a',
                        linkColor: '#1e3a8a',
                        linkHoverColor: '#f59e0b'
                    }
                }
            },
            {
                type: 'hero_v2',
                data: {
                    id: 'home',
                    headline: 'Halcones - Tu Agencia de Viajes y Cruceros',
                    subheadline: 'Descubre destinos inolvidables con nuestros cruceros de lujo y paquetes turísticos personalizados. Vive experiencias únicas alrededor del mundo.',
                    backgroundImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
                    overlayAngleDeg: 135,
                    overlayFromColor: '#1e3a8a',
                    overlayFromOpacity: 0.90,
                    overlayToColor: '#f59e0b',
                    overlayToOpacity: 0.80,
                    minHeightVh: 70,
                    textColor: '#ffffff',
                    buttons: [
                        {
                            text: 'Cotizar Crucero',
                            url: 'https://wa.me/56912345678?text=Hola,%20quiero%20cotizar%20un%20crucero',
                            variant: 'primary',
                            backgroundFrom: '#f59e0b',
                            backgroundTo: '#d97706',
                            textColor: '#ffffff',
                            borderColor: '#f59e0b',
                            borderWidth: 0,
                            radiusPx: 50,
                            shadow: '0 4px 15px rgba(245,158,11,0.3)'
                        },
                        {
                            text: 'Llamar Ahora',
                            url: 'tel:+56912345678',
                            variant: 'secondary',
                            backgroundFrom: 'rgba(255,255,255,0.2)',
                            backgroundTo: 'rgba(255,255,255,0.2)',
                            textColor: '#ffffff',
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            radiusPx: 50,
                            shadow: 'none'
                        }
                    ]
                }
            },
            {
                type: 'features_v2',
                data: {
                    id: 'services',
                    title: 'Nuestros Servicios',
                    columnsMinWidthPx: 300,
                    gapPx: 30,
                    cards: [
                        {
                            icon: 'anchor',
                            title: 'Cruceros de Lujo',
                            text: 'Viajes inolvidables por el Caribe, Mediterráneo y más destinos exóticos con todo incluido.',
                            iconBgFrom: '#667eea',
                            iconBgTo: '#764ba2',
                            cardBg: '#ffffff',
                            radiusPx: 15,
                            shadow: '0 10px 30px rgba(0,0,0,0.1)'
                        },
                        {
                            icon: 'airplay',
                            title: 'Viajes Internacionales',
                            text: 'Paquetes completos a Europa, Asia, América y todos los continentes con vuelos y hospedaje.',
                            iconBgFrom: '#667eea',
                            iconBgTo: '#764ba2',
                            cardBg: '#ffffff',
                            radiusPx: 15,
                            shadow: '0 10px 30px rgba(0,0,0,0.1)'
                        },
                        {
                            icon: 'map',
                            title: 'Paquetes Turísticos',
                            text: 'Experiencias personalizadas con alojamiento premium, tours guiados y actividades exclusivas.',
                            iconBgFrom: '#667eea',
                            iconBgTo: '#764ba2',
                            cardBg: '#ffffff',
                            radiusPx: 15,
                            shadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }
                    ]
                }
            },
            {
                type: 'gallery_v2',
                data: {
                    title: 'Destinos Populares',
                    itemHeightPx: 200,
                    items: [
                        { label: 'Caribe', imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
                        { label: 'Mediterráneo', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
                        { label: 'Alaska', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' },
                        { label: 'Europa', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80' }
                    ]
                }
            },
            {
                type: 'testimonials_v2',
                data: {
                    title: 'Testimonios de Clientes',
                    backgroundColor: '#f8f9fa',
                    items: [
                        { quote: 'El crucero por el Caribe fue increíble. Halcones hizo todo perfecto desde el principio.', author: 'María González' },
                        { quote: 'Excelente servicio y atención. Recomiendo totalmente para viajes internacionales.', author: 'Carlos Rodríguez' }
                    ]
                }
            },
            {
                type: 'contact_v2',
                data: {
                    id: 'contact',
                    title: '¡Contáctanos!',
                    text: 'Estamos aquí para planificar tu próximo viaje. ¡No esperes más para vivir aventuras inolvidables!',
                    bgAngleDeg: 135,
                    bgFrom: '#1e3a8a',
                    bgTo: '#3b82f6',
                    textColor: '#ffffff',
                    buttons: [
                        { text: 'WhatsApp', url: 'https://wa.me/56912345678?text=Hola,%20tengo%20una%20consulta%20sobre%20viajes', bg: '#f59e0b', hoverBg: '#d97706', radiusPx: 25 },
                        { text: 'Teléfono', url: 'tel:+56912345678', bg: '#f59e0b', hoverBg: '#d97706', radiusPx: 25 },
                        { text: 'Instagram', url: 'https://www.instagram.com/Halcones', bg: '#f59e0b', hoverBg: '#d97706', radiusPx: 25 }
                    ]
                }
            },
            {
                type: 'footer_v2',
                data: {
                    text: '© 2026 Halcones - Viajes y Cruceros. Todos los derechos reservados.',
                    backgroundColor: '#1e3a8a',
                    textColor: '#ffffff'
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
        },

        // V2 (Demo.html) blocks
        header_v2: {
            type: 'header_v2',
            data: {
                logoText: 'Halcones',
                logoImage: '',
                links: [
                    { text: 'Inicio', url: '#home' },
                    { text: 'Servicios', url: '#services' },
                    { text: 'Contacto', url: '#contact' }
                ],
                style: {
                    backgroundColor: '#ffffff',
                    backgroundOpacity: 0.95,
                    blurPx: 10,
                    shadow: '0 2px 20px rgba(0,0,0,0.1)',
                    fixed: true,
                    paddingY: 15,
                    paddingX: 20,
                    logoColor: '#1e3a8a',
                    linkColor: '#1e3a8a',
                    linkHoverColor: '#f59e0b'
                }
            }
        },
        hero_v2: {
            type: 'hero_v2',
            data: {
                id: 'home',
                headline: 'Halcones - Tu Agencia de Viajes y Cruceros',
                subheadline: 'Describe tu propuesta de valor aquí.',
                backgroundImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1350&q=80',
                overlayAngleDeg: 135,
                overlayFromColor: '#1e3a8a',
                overlayFromOpacity: 0.90,
                overlayToColor: '#f59e0b',
                overlayToOpacity: 0.80,
                minHeightVh: 70,
                textColor: '#ffffff',
                buttons: [
                    {
                        text: 'Cotizar',
                        url: '#',
                        variant: 'primary',
                        backgroundFrom: '#f59e0b',
                        backgroundTo: '#d97706',
                        textColor: '#ffffff',
                        borderColor: '#f59e0b',
                        borderWidth: 0,
                        radiusPx: 50,
                        shadow: '0 4px 15px rgba(245,158,11,0.3)'
                    },
                    {
                        text: 'Llamar',
                        url: 'tel:+56912345678',
                        variant: 'secondary',
                        backgroundFrom: 'rgba(255,255,255,0.2)',
                        backgroundTo: 'rgba(255,255,255,0.2)',
                        textColor: '#ffffff',
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        radiusPx: 50,
                        shadow: 'none'
                    }
                ]
            }
        },
        features_v2: {
            type: 'features_v2',
            data: {
                id: 'services',
                title: 'Nuestros Servicios',
                columnsMinWidthPx: 300,
                gapPx: 30,
                cards: [
                    { icon: 'anchor', title: 'Servicio 1', text: 'Descripción breve.', iconBgFrom: '#667eea', iconBgTo: '#764ba2', cardBg: '#ffffff', radiusPx: 15, shadow: '0 10px 30px rgba(0,0,0,0.1)' }
                ]
            }
        },
        gallery_v2: {
            type: 'gallery_v2',
            data: {
                title: 'Destinos Populares',
                itemHeightPx: 200,
                items: [
                    { label: 'Destino', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1350&q=80' }
                ]
            }
        },
        testimonials_v2: {
            type: 'testimonials_v2',
            data: {
                title: 'Testimonios',
                backgroundColor: '#f8f9fa',
                items: [
                    { quote: 'Excelente servicio.', author: 'Nombre Apellido' }
                ]
            }
        },
        contact_v2: {
            type: 'contact_v2',
            data: {
                id: 'contact',
                title: '¡Contáctanos!',
                text: 'Escribe aquí tu mensaje.',
                bgAngleDeg: 135,
                bgFrom: '#1e3a8a',
                bgTo: '#3b82f6',
                textColor: '#ffffff',
                buttons: [
                    { text: 'WhatsApp', url: '#', bg: '#f59e0b', hoverBg: '#d97706', radiusPx: 25 }
                ]
            }
        },
        footer_v2: {
            type: 'footer_v2',
            data: {
                text: '© 2026 Mi Empresa. Todos los derechos reservados.',
                backgroundColor: '#1e3a8a',
                textColor: '#ffffff'
            }
        }
    },

    // -------- Editor Helpers --------
    ensureFontLoaded(fontFamily) {
        // Best-effort: if the selected font is a Google font (e.g. Poppins/Inter), load it.
        // No-op if it already exists; safe if offline (falls back to next font).
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

    isLikelyColorKey(key, value) {
        if (!key) return false;
        const k = key.toLowerCase();
        if (k.includes('color')) return true;
        if (typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) return true;
        return false;
    },

    createFieldLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());
    },

    renderAnyField({ parent, labelText, value, onChange, keyName }) {
        const label = document.createElement('label');
        label.className = 'lp-control-label';
        label.innerText = labelText;

        // Selects for known enum fields
        const enumOptions = {
            variant: ['primary', 'secondary'],
            platform: [
                'facebook',
                'twitter',
                'instagram',
                'linkedin',
                'youtube',
                'message-circle',
                'github',
                'twitch',
                'slack',
                'dribbble',
                'figma',
                'gitlab',
                'trello',
                'mail',
                'link',
                'globe',
                'phone'
            ]
        };

        // Booleans
        if (typeof value === 'boolean') {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '0.5rem';
            row.style.marginBottom = '1rem';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = !!value;
            checkbox.style.width = '16px';
            checkbox.style.height = '16px';

            const inlineLabel = document.createElement('label');
            inlineLabel.className = 'lp-control-label';
            inlineLabel.style.margin = '0';
            inlineLabel.style.cursor = 'pointer';
            inlineLabel.innerText = labelText;

            checkbox.addEventListener('change', (e) => onChange(!!e.target.checked));
            inlineLabel.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });

            row.appendChild(checkbox);
            row.appendChild(inlineLabel);
            parent.appendChild(row);
            return;
        }

        // Enums
        if (keyName && enumOptions[keyName]) {
            const select = document.createElement('select');
            select.className = 'lp-control-input';
            enumOptions[keyName].forEach(optVal => {
                const opt = document.createElement('option');
                opt.value = optVal;
                opt.innerText = optVal;
                if (String(value) === optVal) opt.selected = true;
                select.appendChild(opt);
            });
            select.addEventListener('change', (e) => onChange(e.target.value));
            parent.appendChild(label);
            parent.appendChild(select);
            return;
        }

        // Numbers
        if (typeof value === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'lp-control-input';
            input.value = String(value);

            if ((keyName || '').toLowerCase().includes('opacity')) {
                input.step = '0.05';
                input.min = '0';
                input.max = '1';
            } else {
                input.step = '1';
            }
            input.addEventListener('input', (e) => {
                const next = e.target.value === '' ? 0 : Number(e.target.value);
                onChange(Number.isFinite(next) ? next : 0);
            });
            parent.appendChild(label);
            parent.appendChild(input);
            return;
        }

        // Colors
        if (this.isLikelyColorKey(keyName, value)) {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '1rem';

            const inputRow = document.createElement('div');
            inputRow.style.display = 'flex';
            inputRow.style.gap = '0.5rem';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            const normalized = (typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) ? value.trim() : '#000000';
            colorInput.value = normalized;
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
            textInput.value = value || '';

            const setVal = (val) => {
                onChange(val);
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((val || '').trim())) {
                    colorInput.value = val.trim();
                }
                textInput.value = val;
            };

            colorInput.addEventListener('input', (e) => setVal(e.target.value));
            textInput.addEventListener('input', (e) => setVal(e.target.value));

            wrapper.appendChild(label);
            inputRow.appendChild(colorInput);
            inputRow.appendChild(textInput);
            wrapper.appendChild(inputRow);
            parent.appendChild(wrapper);
            return;
        }

        // Feather icon picker
        if ((keyName || '').toLowerCase() === 'icon' && (typeof value === 'string' || value === undefined || value === null)) {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '0.5rem';
            row.style.marginBottom = '1rem';

            const preview = document.createElement('div');
            preview.style.width = '34px';
            preview.style.height = '34px';
            preview.style.flex = '0 0 auto';
            preview.style.border = '1px solid #475569';
            preview.style.borderRadius = '0.5rem';
            preview.style.background = '#1e293b';
            preview.style.display = 'flex';
            preview.style.alignItems = 'center';
            preview.style.justifyContent = 'center';
            preview.style.color = '#cbd5e1';

            const setPreview = (name) => {
                const iconsObj = window.feather?.icons;
                preview.innerHTML = (iconsObj && name && iconsObj[name])
                    ? iconsObj[name].toSvg({ width: 18, height: 18 })
                    : '<span style="font-size:10px; opacity:0.8;">—</span>';
            };

            const input = document.createElement('input');
            input.className = 'lp-control-input';
            input.type = 'text';
            input.value = value || '';
            input.placeholder = 'ej. anchor';
            input.addEventListener('input', (e) => {
                const next = e.target.value;
                setPreview(next);
                onChange(next);
            });

            const pickBtn = document.createElement('button');
            pickBtn.type = 'button';
            pickBtn.className = 'landing-btn secondary small';
            pickBtn.style.padding = '0.35rem 0.6rem';
            pickBtn.style.fontSize = '0.75rem';
            pickBtn.textContent = 'Elegir';
            pickBtn.onclick = () => {
                this.openFeatherIconPicker({
                    current: input.value || '',
                    onSelect: (name) => {
                        input.value = name;
                        setPreview(name);
                        onChange(name);
                    }
                });
            };

            setPreview(input.value);
            parent.appendChild(label);
            row.appendChild(preview);
            row.appendChild(input);
            row.appendChild(pickBtn);
            parent.appendChild(row);
            return;
        }

        // Long text
        let input;
        if (keyName === 'subheadline' || keyName === 'text' || (typeof value === 'string' && value.length > 80)) {
            input = document.createElement('textarea');
            input.className = 'lp-control-textarea';
        } else {
            input = document.createElement('input');
            const k = (keyName || '').toLowerCase();
            input.type = (k.includes('url') || k.includes('link') || k.includes('image')) ? 'url' : 'text';
            input.className = 'lp-control-input';
        }
        input.value = value ?? '';
        input.addEventListener('input', (e) => onChange(e.target.value));
        parent.appendChild(label);
        parent.appendChild(input);
    },

    openFeatherIconPicker({ current = '', onSelect }) {
        const existing = document.getElementById('lp-icon-picker-modal');
        if (existing) existing.remove();

        const iconsObj = window.feather?.icons;
        const allNames = iconsObj ? Object.keys(iconsObj) : [];

        const overlay = document.createElement('div');
        overlay.id = 'lp-icon-picker-modal';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.zIndex = '100000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '70px 16px 16px';

        const modal = document.createElement('div');
        modal.style.width = '720px';
        modal.style.maxWidth = '100%';
        modal.style.background = '#0f172a';
        modal.style.border = '1px solid #334155';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 18px 40px rgba(0,0,0,0.45)';
        modal.style.color = 'white';
        modal.style.overflow = 'hidden';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.padding = '12px 14px';
        header.style.borderBottom = '1px solid #334155';
        header.innerHTML = `
            <div style="font-weight:700;">Seleccionar Ícono</div>
            <button type="button" class="landing-btn secondary small" style="padding:0.25rem 0.5rem; font-size:0.75rem; border-color:#475569; color:#cbd5e1;" data-action="close">Cerrar</button>
        `;

        const body = document.createElement('div');
        body.style.padding = '14px';

        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.gap = '10px';
        topRow.style.alignItems = 'center';
        topRow.style.marginBottom = '12px';

        const search = document.createElement('input');
        search.type = 'text';
        search.className = 'lp-control-input';
        search.placeholder = 'Buscar ícono...';
        search.value = current || '';

        const helper = document.createElement('div');
        helper.style.color = '#94a3b8';
        helper.style.fontSize = '0.75rem';
        helper.style.whiteSpace = 'nowrap';
        helper.textContent = iconsObj ? `${allNames.length} íconos` : 'Feather no cargó';

        topRow.appendChild(search);
        topRow.appendChild(helper);

        const gridWrap = document.createElement('div');
        gridWrap.style.maxHeight = '60vh';
        gridWrap.style.overflow = 'auto';

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
        grid.style.gap = '10px';

        const renderGrid = () => {
            grid.innerHTML = '';
            if (!iconsObj) {
                const empty = document.createElement('div');
                empty.style.gridColumn = '1 / -1';
                empty.style.color = '#94a3b8';
                empty.style.fontSize = '0.875rem';
                empty.textContent = 'No se pudo cargar la lista de íconos (feather.icons).';
                grid.appendChild(empty);
                return;
            }

            const q = (search.value || '').trim().toLowerCase();
            const names = q ? allNames.filter(n => n.toLowerCase().includes(q)) : allNames;

            names.forEach((name) => {
                const tile = document.createElement('button');
                tile.type = 'button';
                tile.style.height = '86px';
                tile.style.borderRadius = '10px';
                tile.style.border = '1px solid #475569';
                tile.style.background = (name === current) ? '#1e293b' : '#111827';
                tile.style.cursor = 'pointer';
                tile.style.overflow = 'hidden';
                tile.style.display = 'flex';
                tile.style.flexDirection = 'column';
                tile.style.alignItems = 'center';
                tile.style.justifyContent = 'center';
                tile.style.gap = '8px';
                tile.style.padding = '10px';
                tile.style.color = '#cbd5e1';

                const svg = iconsObj[name].toSvg({ width: 20, height: 20 });
                tile.innerHTML = `${svg}<div style="font-size:11px; line-height:1.1; opacity:0.9; text-align:center; word-break:break-word;">${name}</div>`;

                tile.onclick = () => {
                    if (typeof onSelect === 'function') onSelect(name);
                    overlay.remove();
                };
                grid.appendChild(tile);
            });
        };

        search.addEventListener('input', renderGrid);
        renderGrid();

        gridWrap.appendChild(grid);
        body.appendChild(topRow);
        body.appendChild(gridWrap);

        modal.appendChild(header);
        modal.appendChild(body);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('[data-action="close"]');
        closeBtn.onclick = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    },

    renderObjectFields({ parent, title, objRef, containerId }) {
        if (!objRef || typeof objRef !== 'object') return;

        const subTitle = document.createElement('h4');
        subTitle.innerText = title;
        subTitle.style.marginTop = '1rem';
        subTitle.style.marginBottom = '1rem';
        parent.appendChild(subTitle);

        Object.keys(objRef).forEach((k) => {
            const v = objRef[k];
            if (v === null || v === undefined) return;

            if (Array.isArray(v)) {
                // Not expected here for v2 styles, but keep it safe.
                return;
            }

            if (typeof v === 'object') {
                // Recurse one level
                this.renderObjectFields({ parent, title: this.createFieldLabel(k), objRef: v, containerId });
                return;
            }

            this.renderAnyField({
                parent,
                labelText: this.createFieldLabel(k),
                value: v,
                keyName: k,
                onChange: (next) => {
                    objRef[k] = next;
                    this.renderCanvas(containerId);
                }
            });
        });
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
                section.dataset.blockType = block.type;
                section.innerHTML = blockHtml;

                // V2 blocks are self-contained (they already define their own padding/background).
                // Avoid double-spacing and avoid animating critical above-the-fold elements.
                const isV2 = (block.type || '').endsWith('_v2');
                if (isV2) {
                    section.style.padding = '0';
                    section.dataset.noAnimate = '1';
                }
                
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

        // Generic inference for custom/v2 blocks (buttons/cards/items/links)
        const inferFromFirst = () => {
            if (!Array.isArray(array) || array.length === 0) return false;
            const first = array[0];
            if (!first || typeof first !== 'object' || Array.isArray(first)) return false;
            itemFields = Object.keys(first);
            defaultItem = {};
            itemFields.forEach(f => {
                const v = first[f];
                if (typeof v === 'boolean') defaultItem[f] = false;
                else if (typeof v === 'number') defaultItem[f] = 0;
                else defaultItem[f] = '';
            });
            return true;
        };

        const setDefaultsByKey = () => {
            const k = (key || '').toLowerCase();
            if (k === 'links') {
                itemFields = ['text', 'url'];
                defaultItem = { text: 'Enlace', url: '#' };
                return true;
            }
            if (k === 'buttons') {
                itemFields = ['text', 'url', 'variant', 'backgroundFrom', 'backgroundTo', 'textColor', 'borderColor', 'borderWidth', 'radiusPx', 'shadow'];
                defaultItem = {
                    text: 'Botón',
                    url: '#',
                    variant: 'primary',
                    backgroundFrom: '#f59e0b',
                    backgroundTo: '#d97706',
                    textColor: '#ffffff',
                    borderColor: '#f59e0b',
                    borderWidth: 0,
                    radiusPx: 25,
                    shadow: 'none'
                };
                return true;
            }
            if (k === 'cards') {
                itemFields = ['icon', 'title', 'text', 'iconBgFrom', 'iconBgTo', 'cardBg', 'radiusPx', 'shadow'];
                defaultItem = {
                    icon: 'star',
                    title: 'Título',
                    text: 'Descripción',
                    iconBgFrom: '#667eea',
                    iconBgTo: '#764ba2',
                    cardBg: '#ffffff',
                    radiusPx: 15,
                    shadow: '0 10px 30px rgba(0,0,0,0.1)'
                };
                return true;
            }
            if (k === 'items' && block.type === 'gallery_v2') {
                itemFields = ['label', 'imageUrl'];
                defaultItem = { label: 'Item', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1350&q=80' };
                return true;
            }
            return false;
        };

        const isKnownType = ['features','testimonials','header','social','pricing','gallery','faq','form'].includes(block.type);
        if (!isKnownType) {
            if (!setDefaultsByKey()) inferFromFirst();
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

            const refreshItemTitle = () => {
                itemTitle.innerText = item.title || item.name || item.label || item.text || `Item ${index + 1}`;
            };
            
            itemFields.forEach(itemKey => {
                const val = item[itemKey];

                // pricing.features special case (array of strings in a textarea)
                if (itemKey === 'features') {
                    const fieldWrapper = document.createElement('div');
                    fieldWrapper.style.marginBottom = '0.5rem';

                    const fieldLabel = document.createElement('label');
                    fieldLabel.className = 'lp-control-label';
                    fieldLabel.style.fontSize = '0.75rem';
                    fieldLabel.style.color = '#94a3b8';
                    fieldLabel.style.marginBottom = '0.2rem';
                    fieldLabel.innerText = itemKey;

                    const input = document.createElement('textarea');
                    input.className = 'lp-control-textarea';
                    input.style.minHeight = '60px';
                    input.style.fontSize = '0.8rem';
                    input.placeholder = 'Una característica por línea';
                    input.value = Array.isArray(val) ? val.join('\n') : (val || '');
                    input.addEventListener('input', (e) => {
                        item[itemKey] = e.target.value.split('\n').filter(line => line.trim() !== '');
                        refreshItemTitle();
                        this.renderCanvas(containerId);
                    });

                    fieldWrapper.appendChild(fieldLabel);
                    fieldWrapper.appendChild(input);
                    fieldsContainer.appendChild(fieldWrapper);
                    return;
                }

                // Nested objects inside array items
                if (val && typeof val === 'object' && !Array.isArray(val)) {
                    const nested = document.createElement('div');
                    nested.style.marginBottom = '0.75rem';
                    nested.style.padding = '0.5rem';
                    nested.style.border = '1px dashed rgba(255,255,255,0.15)';
                    nested.style.borderRadius = '0.5rem';

                    const nestedTitle = document.createElement('div');
                    nestedTitle.className = 'lp-control-label';
                    nestedTitle.style.fontSize = '0.75rem';
                    nestedTitle.style.color = '#94a3b8';
                    nestedTitle.style.marginBottom = '0.35rem';
                    nestedTitle.innerText = itemKey;
                    nested.appendChild(nestedTitle);

                    Object.keys(val).forEach(subKey => {
                        const subVal = val[subKey];
                        if (subVal && typeof subVal === 'object') return;
                        this.renderAnyField({
                            parent: nested,
                            labelText: this.createFieldLabel(subKey),
                            value: subVal,
                            keyName: subKey,
                            onChange: (next) => {
                                val[subKey] = next;
                                refreshItemTitle();
                                this.renderCanvas(containerId);
                            }
                        });
                    });

                    fieldsContainer.appendChild(nested);
                    return;
                }

                const fieldWrapper = document.createElement('div');
                fieldWrapper.style.marginBottom = '0.5rem';
                this.renderAnyField({
                    parent: fieldWrapper,
                    labelText: this.createFieldLabel(itemKey),
                    value: val,
                    keyName: itemKey,
                    onChange: (next) => {
                        item[itemKey] = next;
                        refreshItemTitle();
                        this.renderCanvas(containerId);
                    }
                });
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

            // Custom controls
            if (block.type === 'header_v2') {
                this.renderHeaderV2LogoSelector(group, block, index, containerId);
            }

            // Fields
            Object.keys(block.data).forEach(key => {
                if (key === 'id' || key === 'helperText') return; // Hide internal ID field from UI
                if (block.type === 'embed' && key === 'htmlCode') return; // Hide HTML code if not needed

                // We render logo selector UI for header_v2
                if (block.type === 'header_v2' && (key === 'logoText' || key === 'logoImage')) return;

                const value = block.data[key];

                if (Array.isArray(value)) {
                    this.renderArrayField(key, value, block, containerId, group);
                    return;
                }

                if (value && typeof value === 'object') {
                    this.renderObjectFields({
                        parent: group,
                        title: this.createFieldLabel(key),
                        objRef: value,
                        containerId
                    });
                    return;
                }

                this.renderAnyField({
                    parent: group,
                    labelText: this.createFieldLabel(key),
                    value,
                    keyName: key,
                    onChange: (next) => {
                        block.data[key] = next;
                        this.renderCanvas(containerId);
                    }
                });
            });

            controlsContainer.appendChild(group);
        });

        // Initialize icons in sidebar
        if (window.feather) feather.replace();
    },

    // --- Header V2: Logo picker ---
    getHeaderV2LogoOptions() {
        const media = Array.isArray(this.currentLanding?.media) ? this.currentLanding.media : [];
        const options = media
            .filter(m => (m?.type === 'image') || (m?.metadata?.mimetype || '').startsWith('image/'))
            .map(m => m?.url || m?.path)
            .filter(Boolean);

        // de-dupe
        return Array.from(new Set(options));
    },

    renderHeaderV2LogoSelector(parent, block, blockIndex, containerId) {
        const wrapper = document.createElement('div');

        const preview = block.data.logoImage
            ? `<img src="${block.data.logoImage}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain; display:block;">`
            : `<div style="font-weight:700; font-size:0.75rem; text-align:center; padding:0 6px; color:#cbd5e1;">${(block.data.logoText || 'Logo')}</div>`;

        wrapper.innerHTML = `
            <label class="lp-control-label">Logo</label>
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="width:56px; height:56px; background:#1e293b; border:1px solid #475569; border-radius:0.5rem; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                    ${preview}
                </div>
                <button type="button" class="landing-btn secondary small" style="padding:0.4rem 0.6rem; font-size:0.75rem;" data-action="pick">Seleccionar</button>
                <button type="button" class="landing-btn secondary small" style="padding:0.4rem 0.6rem; font-size:0.75rem; border-color:#475569; color:#cbd5e1;" data-action="clear">Quitar</button>
            </div>
            <small style="color:#94a3b8; font-size:0.75rem; display:block; margin-top:0.5rem;">Elige un logo desde las imágenes subidas a esta landing.</small>
        `;

        const pickBtn = wrapper.querySelector('[data-action="pick"]');
        const clearBtn = wrapper.querySelector('[data-action="clear"]');

        pickBtn.onclick = () => this.openHeaderV2LogoPicker(blockIndex, containerId);
        clearBtn.onclick = () => {
            block.data.logoImage = '';
            this.renderCanvas(containerId);
            this.renderEditor(containerId);
        };

        parent.appendChild(wrapper);
    },

    openHeaderV2LogoPicker(blockIndex, containerId) {
        const block = this.currentSchema?.blocks?.[blockIndex];
        if (!block || block.type !== 'header_v2') return;

        // Remove existing modal if any
        const existing = document.getElementById('lp-logo-picker-modal');
        if (existing) existing.remove();

        const options = this.getHeaderV2LogoOptions();

        const overlay = document.createElement('div');
        overlay.id = 'lp-logo-picker-modal';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.zIndex = '100000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'flex-start';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '70px 16px 16px';

        const modal = document.createElement('div');
        modal.style.width = '520px';
        modal.style.maxWidth = '100%';
        modal.style.background = '#0f172a';
        modal.style.border = '1px solid #334155';
        modal.style.borderRadius = '12px';
        modal.style.boxShadow = '0 18px 40px rgba(0,0,0,0.45)';
        modal.style.color = 'white';
        modal.style.overflow = 'hidden';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.padding = '12px 14px';
        header.style.borderBottom = '1px solid #334155';
        header.innerHTML = `
            <div style="font-weight:700;">Seleccionar Logo</div>
            <button type="button" class="landing-btn secondary small" style="padding:0.25rem 0.5rem; font-size:0.75rem; border-color:#475569; color:#cbd5e1;" data-action="close">Cerrar</button>
        `;

        const body = document.createElement('div');
        body.style.padding = '14px';

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.style.gap = '10px';

        // Option: text (no image)
        const textTile = document.createElement('button');
        textTile.type = 'button';
        textTile.style.height = '96px';
        textTile.style.borderRadius = '10px';
        textTile.style.border = '1px solid #475569';
        textTile.style.background = '#1e293b';
        textTile.style.color = '#cbd5e1';
        textTile.style.cursor = 'pointer';
        textTile.style.display = 'flex';
        textTile.style.alignItems = 'center';
        textTile.style.justifyContent = 'center';
        textTile.style.textAlign = 'center';
        textTile.style.padding = '8px';
        textTile.innerHTML = `<div><div style="font-weight:700;">Usar texto</div><div style="font-size:0.75rem; color:#94a3b8;">(sin imagen)</div></div>`;
        textTile.onclick = () => {
            block.data.logoImage = '';
            overlay.remove();
            this.renderCanvas(containerId);
            this.renderEditor(containerId);
        };
        grid.appendChild(textTile);

        if (options.length === 0) {
            const empty = document.createElement('div');
            empty.style.gridColumn = '1 / -1';
            empty.style.color = '#94a3b8';
            empty.style.fontSize = '0.875rem';
            empty.innerText = 'No hay imágenes disponibles para usar como logo. Primero sube una imagen a esta landing.';
            body.appendChild(empty);
        } else {
            options.forEach((src) => {
                const tile = document.createElement('button');
                tile.type = 'button';
                tile.style.height = '96px';
                tile.style.borderRadius = '10px';
                tile.style.border = '1px solid #475569';
                tile.style.background = '#111827';
                tile.style.cursor = 'pointer';
                tile.style.overflow = 'hidden';
                tile.style.display = 'flex';
                tile.style.alignItems = 'center';
                tile.style.justifyContent = 'center';

                const img = document.createElement('img');
                img.src = src;
                img.alt = 'Logo';
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                img.style.display = 'block';

                tile.appendChild(img);
                tile.onclick = () => {
                    block.data.logoImage = src;
                    overlay.remove();
                    this.renderCanvas(containerId);
                    this.renderEditor(containerId);
                };
                grid.appendChild(tile);
            });

            body.appendChild(grid);
        }

        modal.appendChild(header);
        modal.appendChild(body);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const closeBtn = overlay.querySelector('[data-action="close"]');
        closeBtn.onclick = () => overlay.remove();
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
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
            { key: 'accent', label: 'Color Acento' },
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

        // Font Family Selector (Body)
        const fontWrapper = document.createElement('div');
        fontWrapper.style.marginBottom = '0.75rem';
        const fontLabel = document.createElement('label');
        fontLabel.className = 'lp-control-label';
        fontLabel.innerText = 'Tipografía (Texto)';
        
        const fontSelect = document.createElement('select');
        fontSelect.className = 'lp-control-input';
        
        const fonts = [
            { val: "'Poppins', 'Overpass', sans-serif", label: 'Poppins' },
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
            this.ensureFontLoaded(e.target.value);
            this.applyTheme(this.currentSchema.theme);
        });

        fontWrapper.appendChild(fontLabel);
        fontWrapper.appendChild(fontSelect);
        group.appendChild(fontWrapper);

        // Heading Font Selector
        const headingWrapper = document.createElement('div');
        headingWrapper.style.marginBottom = '0.75rem';
        const headingLabel = document.createElement('label');
        headingLabel.className = 'lp-control-label';
        headingLabel.innerText = 'Tipografía (Títulos)';
        const headingSelect = document.createElement('select');
        headingSelect.className = 'lp-control-input';
        fonts.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.val;
            opt.innerText = f.label;
            if ((this.currentSchema.theme.headingFont || this.currentSchema.theme.font || this.defaults.theme.headingFont) === f.val) opt.selected = true;
            headingSelect.appendChild(opt);
        });
        headingSelect.addEventListener('change', (e) => {
            this.currentSchema.theme.headingFont = e.target.value;
            this.ensureFontLoaded(e.target.value);
            this.applyTheme(this.currentSchema.theme);
        });
        headingWrapper.appendChild(headingLabel);
        headingWrapper.appendChild(headingSelect);
        group.appendChild(headingWrapper);

        // Layout + shape controls
        const layoutFields = [
            { key: 'container', label: 'Ancho Contenedor (px)', placeholder: '1200px' },
            { key: 'spacing', label: 'Espaciado Secciones', placeholder: '4rem' },
            { key: 'radius', label: 'Radio Global', placeholder: '0.5rem' },
            { key: 'shadow', label: 'Sombra Global', placeholder: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
        ];

        layoutFields.forEach(f => {
            const label = document.createElement('label');
            label.className = 'lp-control-label';
            label.innerText = f.label;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'lp-control-input';
            input.placeholder = f.placeholder;
            input.value = this.currentSchema.theme[f.key] || this.defaults.theme[f.key] || '';
            input.addEventListener('input', (e) => {
                this.currentSchema.theme[f.key] = e.target.value;
                this.applyTheme(this.currentSchema.theme);
            });

            group.appendChild(label);
            group.appendChild(input);
        });

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
        ,

        // ---------------- Demo.html equivalent blocks (V2) ----------------
        header_v2: (data) => {
            const s = data.style || {};
            const bg = s.backgroundColor || '#ffffff';
            const opacity = (typeof s.backgroundOpacity === 'number') ? s.backgroundOpacity : 1;
            const blur = (typeof s.blurPx === 'number') ? s.blurPx : 0;
            const paddingY = (typeof s.paddingY === 'number') ? s.paddingY : 15;
            const paddingX = (typeof s.paddingX === 'number') ? s.paddingX : 20;
            const fixed = s.fixed ? 'fixed' : 'sticky';

            // Use rgba only for hex colors; otherwise fall back to raw backgroundColor.
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
                    <a href="${btn.url || '#'}" class="lp-hero-btn" style="display:inline-block; text-decoration:none; padding:15px 30px; border-radius:${radius}; font-weight:600; border:${borderW} solid ${borderC}; color:${btn.textColor || textColor}; background:${bgBtn}; box-shadow:${shadow}; transition:transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease;">
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

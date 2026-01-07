(async function() {
  try {
    const res = await fetch("/api/settings/public");
    if (!res.ok) return;
    const settings = await res.json();

    // 1. Primary RGB Color Update (If using CSS variables)
    // We assume the CSS handles colors via --primary-color variable or similar if set up.
    // If specific elements need update, we target them.
    if (settings.primary_color) {
      document.documentElement.style.setProperty('--primary-color', settings.primary_color);
      
      // Update specific elements if they don't use the var yet (fallback)
      const aiSpans = document.querySelectorAll('.titulo .ai');
      aiSpans.forEach(el => el.style.setProperty('color', settings.primary_color, 'important'));

      // Also backgrounds that might be hardcoded
      // .bg-primary etc might be bootstrap derived, so overriding via css var is best if bootstrap is recompiled or we override it.
      // For now, let's inject a style tag to override .btn-primary and others if they don't use the var.
      const style = document.createElement('style');
      style.innerHTML = `
        .text-primary { color: ${settings.primary_color} !important; }
        .bg-primary { background-color: ${settings.primary_color} !important; }
        .btn-primary { background-color: ${settings.primary_color} !important; border-color: ${settings.primary_color} !important; }
        .btn-primary:hover { opacity: 0.9; }
        .sidebar .sidebar-header .sidebar-brand .titulo .ai { color: ${settings.primary_color} !important; }
        a { color: ${settings.primary_color}; }
      `;
      document.head.appendChild(style);
    }

    // 2. Site Name
    if (settings.site_name) {
      document.title = settings.site_name; // Browser Tab Title
      
      // Update sidebar logo or other .site-name elements
      // For the specific sidebar structure: <h3>In<span class="ai">Pages</span></h3>
      // This is tricky if we want to preserve the "In" + "Pages" logic.
      // Let's assume the user enters "MySite" -> We might just replace the text or handle it smarter.
      // For now, let's replace elements with class .site-name-text if they exist, 
      // OR try to guess the sidebar split if the name is short.
      
      // If we used a class in sidebar.html, it would be easier.
      // Let's target .sidebar-brand .titulo directly.
      const titles = document.querySelectorAll('.sidebar-brand .titulo');
      titles.forEach(el => {
        // Simple replace, we lose the 2-color effect unless we parse it.
        // Let's try to keep the first 2 letters black, rest colored, or just simple text.
        // Current: In<span class="ai">Pages</span>
        // Check if there is a span.ai
        const span = el.querySelector('.ai');
        if (span) {
             // If name is "Halcones", we keep it. If changed, we might just plain text it.
             // Or we can try to smart split?
             if(settings.site_name.toLowerCase() !== 'halcones') {
                el.innerHTML = settings.site_name;
                el.style.color = settings.primary_color || '#000';
             }
        }
      });
      
      // Also update any .site-name placeholders
      document.querySelectorAll('.site-name').forEach(el => el.textContent = settings.site_name);
    }

    // 3. Support Email
    if (settings.support_email) {
      document.querySelectorAll('.support-email').forEach(el => {
        el.textContent = settings.support_email;
        if (el.tagName === 'A') el.href = `mailto:${settings.support_email}`;
      });
    }

    // 4. Registration Handling
    if (settings.allow_registration === 'false') {
      const registerLinks = document.querySelectorAll('a[href*="/register.html"], .cta-register');
      registerLinks.forEach(el => {
        el.style.display = 'none';
        // If it's a list item in nav, hide parent
        if(el.parentElement.tagName === 'LI') el.parentElement.style.display = 'none';
      });
      // Specific messages if on register page
      if (window.location.pathname.includes('register.html')) {
         document.body.innerHTML = `
            <div style="height:100vh;display:flex;align-items:center;justify-content:center;background:#f0f0f0;flex-direction:column;">
               <h2>Registro Deshabilitado</h2>
               <p>El registro de nuevos usuarios no está disponible en este momento.</p>
               <a href="/home.html" style="margin-top:20px;padding:10px 20px;background:#333;color:#fff;text-decoration:none;border-radius:5px;">Volver al inicio</a>
            </div>
         `;
      }
    }

    // 5. Maintenance Mode Banner
    if (settings.maintenance_mode === 'true') {
      const banner = document.createElement('div');
      banner.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:30px;background:#e74c3c;color:#fff;
                    display:flex;justify-content:center;align-items:center;font-size:12px;z-index:9999;font-weight:bold;">
           🚧 MODO MANTENIMIENTO ACTIVO — El acceso está restringido a administradores. 🚧
        </div>
      `;
      document.body.style.paddingTop = '30px';
      document.body.appendChild(banner);
    }

  } catch (err) {
    console.error("Error applying public settings:", err);
  }
})();


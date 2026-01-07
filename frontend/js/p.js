(async () => {
  // Extract slug from path /pages/:slug
  const parts = location.pathname.split('/').filter(Boolean);
  const slug = parts[1] || parts[0];
  if (!slug) {
    document.getElementById('app').innerHTML = '<h1>Slug no especificado</h1>';
    return;
  }

  try {
    const res = await fetch(`/api/landings/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) {
      document.getElementById('app').innerHTML = '<h1>Landing no encontrada</h1>';
      return;
    }
    const landing = await res.json();
    
    // Store ID globally for submissions
    window.LANDING_ID = landing.id;

    // Check if landing has JSON schema data (created with Builder)
    if (landing.data && landing.data.blocks) {
        // Use the Renderer
        console.log("Rendering schema:", landing.data);
        LandingRenderer.render('app', landing.data);
    } else {
        // Fallback for creating landings without builder (rendering title only)
        // Or if data is empty
        const app = document.getElementById('app');
        app.style.padding = '2rem';
        app.style.maxWidth = '800px';
        app.style.margin = '0 auto';
        
        let html = `<h1>${landing.title || 'Sin título'}</h1>`;
        html += `<p>${landing.description || ''}</p>`;
        
        if (landing.media && landing.media.length > 0) {
            html += `<div style="margin-top:2rem">`;
            landing.media.forEach(m => {
                 if (m.type === 'image') {
                    html += `<img src="${m.path}" style="max-width:100%; border-radius:0.5rem; margin-bottom:1rem">`;
                } else if (m.type === 'video') {
                    html += `<video src="${m.path}" controls style="max-width:100%; border-radius:0.5rem"></video>`;
                }
            });
            html += `</div>`;
        }
        
        app.innerHTML = html;
        
    }
    
    // Update Page Title
    document.title = landing.title || 'Landing Page';

  } catch (err) {
    console.error(err);
    document.getElementById('app').innerText = 'Error cargando landing';
  }
})();

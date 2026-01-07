(async () => {
  const container = document.getElementById('list');
  
  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  try {
    const res = await fetch('/api/landings/public');
    
    if (!res.ok) {
        throw new Error('Error al conectar con el servidor');
    }
    
    const list = await res.json();
    
    // Clear loader
    container.innerHTML = '';
    
    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; background: rgba(0,0,0,0.2); border-radius: 20px; border: 1px dashed rgba(255,255,255,0.2);">
            <i data-feather="users" style="width: 48px; height: 48px; color: #ccc; margin-bottom: 20px;"></i>
            <h3 style="color: #fff; margin: 0 0 10px;">Aún no hay miembros públicos</h3>
            <p style="color: #bbb; margin: 0;">Sé el primero en publicar tu landing page.</p>
        </div>
      `;
      if (typeof feather !== 'undefined') feather.replace();
      return;
    }

    list.forEach(l => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'member-card';
      
      const description = l.description ? l.description : 'Una increíble landing page creada con Halcones.';
      const icon = 'layout'; // default icon

      card.innerHTML = `
        <div class="member-content">
            <div class="member-icon">
                <i data-feather="${icon}"></i>
            </div>
            <div class="member-info">
                <h3>${escapeHtml(l.title)}</h3>
                <p>${escapeHtml(description)}</p>
            </div>
        </div>
        <div class="member-actions">
            <a href="/pages/${encodeURIComponent(l.slug)}" target="_blank" class="btn-visit">
                <span>Visitar Landing</span>
                <i data-feather="arrow-right" style="width: 18px; height: 18px;"></i>
            </a>
        </div>
      `;
      
      container.appendChild(card);
    });
    
    // Initialize icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <i data-feather="alert-circle" style="width: 48px; height: 48px; color: #ff7a18; margin-bottom: 20px;"></i>
            <h3 style="color: #fff;">Ocurrió un error</h3>
            <p style="color: #ccc;">No pudimos cargar la lista de miembros. Inténtalo de nuevo más tarde.</p>
        </div>
    `;
    if (typeof feather !== 'undefined') feather.replace();
  }
})();

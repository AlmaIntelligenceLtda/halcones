(async () => {
  try {
    const res = await fetch('/api/landings/public?limit=6');
    if (!res.ok) return document.getElementById('featured').innerText = 'No hay landings disponibles';
    const list = await res.json();
    const container = document.getElementById('featured');
    list.forEach(l => {
      const card = document.createElement('a');
      card.href = `/pages/${encodeURIComponent(l.slug)}`;
      card.style.display = 'block';
      card.style.width = '200px';
      card.style.border = '1px solid #ddd';
      card.style.padding = '8px';
      card.style.textDecoration = 'none';
      card.style.color = '#000';
      card.innerHTML = `<strong>${l.title}</strong><div style="font-size:12px;color:#666">${l.description || ''}</div>`;
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('featured').innerText = 'Error cargando landings';
  }
})();

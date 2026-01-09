document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".page-content");

  document.body.addEventListener("click", async (e) => {
    const target = e.target.closest("[data-page]");
    if (!target) {
      return;
    }

    e.preventDefault();
    const page = target.getAttribute("data-page");

    try {
      const fetchUrl = `../views/${page}.html`;

      const res = await fetch(fetchUrl);

      const html = await res.text();

      contenedor.innerHTML = html;

      // ---------------------------------------------------------
      // MODO BUILDER: Ocultar sidebar/header si es el builder
      // ---------------------------------------------------------
      if (page === 'builder') {
        document.body.classList.add('is-builder-mode');
        document.documentElement.classList.add('is-builder-mode');
      } else {
        document.body.classList.remove('is-builder-mode');
        document.documentElement.classList.remove('is-builder-mode');
      }

      if (window.feather) {
        requestAnimationFrame(() => feather.replace());
      }

      // Sidebar: desmarcar todo
      document.querySelectorAll(".nav-item.nav-menu").forEach(item =>
        item.classList.remove("active")
      );

      // Sidebar: marcar si corresponde
      const matchingSidebarItem = document.querySelector(
        `.nav-item.nav-menu .nav-link[data-page="${page}"]`
      );
      if (matchingSidebarItem) {
        matchingSidebarItem.closest(".nav-item.nav-menu").classList.add("active");
      } else {
        console.log(`⚠️ No se encontró item de sidebar con data-page="${page}"`);
      }

      // Cargar JS asociado si existe
      const scriptPath = `./js/${page}.js`;

      fetch(scriptPath, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            // Remove previously injected SPA page script (avoid duplicates / stale code)
            document.querySelectorAll('script[data-spa-page-script="1"]').forEach(s => s.remove());

            const script = document.createElement('script');
            // Builder tends to change often; add a cache buster to prevent stale caching issues
            const cacheBuster = (page === 'builder') ? `?v=${Date.now()}` : '';
            script.src = `${scriptPath}${cacheBuster}`;
            script.type = 'text/javascript';
            script.defer = true;
            script.setAttribute('data-spa-page-script', '1');
            script.setAttribute('data-page', page);
            document.body.appendChild(script);
          } else {
            console.log(`🚫 Script no encontrado: ${scriptPath}`);
          }
        })
        .catch(err => {
          console.log(`❌ Error HEAD a ${scriptPath}:`, err);
        });

    } catch (err) {
      contenedor.innerHTML = `
        <div class="alert alert-danger">
          Error al cargar componente: <strong>${page}</strong>
        </div>`;
      console.error(`❌ Error cargando vista: ${page}`, err);
    }
  });
});

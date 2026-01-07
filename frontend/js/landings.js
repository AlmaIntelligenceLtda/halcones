(function () {
  async function cargarLandings() {
    try {
      const res = await fetch("/api/landings/all");
      if (!res.ok) {
        throw new Error("Error al obtener landings");
      }
      const landings = await res.json();

      const tbody = document.querySelector("#tablaLandingsTotales tbody");
      tbody.innerHTML = "";

      landings.forEach((l) => {
        const tr = document.createElement("tr");

        const usuario = l.usuario_nombres ? `${l.usuario_nombres} ${l.usuario_apellidos}` : "Desconocido";
        const fecha = new Date(l.created_at).toLocaleDateString("es-CL");
        const estado = l.is_public
          ? '<span class="badge badge-success">Pública</span>'
          : '<span class="badge badge-secondary">Privada</span>';

        const views = l.total_views || 0;

        // Link correcto formato /pages/:slug
        const verLink = `/pages/${l.slug}`;

        tr.innerHTML = `
          <td>${l.id}</td>
          <td>${l.title}</td>
          <td>${l.slug}</td>
          <td>
            <div>${usuario}</div>
            <small class="text-muted">${l.usuario_email || ""}</small>
          </td>
          <td>
            <div class="d-flex align-items-center">
               <i data-feather="eye" class="mr-1 text-muted" style="width:16px;"></i>
               <b>${views}</b>
            </div>
          </td>
          <td>${estado}</td>
          <td>${fecha}</td>
        `;
        tbody.appendChild(tr);
      });

      if (typeof feather !== "undefined") {
        feather.replace();
      }

    } catch (err) {
      console.error("Error cargando landings:", err);
      // Podríamos mostrar un mensaje en la tabla si falla
      const tbody = document.querySelector("#tablaLandingsTotales tbody");
      tbody.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Error al cargar datos</td></tr>`;
    }
  }

  // Iniciar
  cargarLandings();
})();

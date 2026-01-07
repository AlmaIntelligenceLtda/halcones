(function () {
  async function cargarLandings() {
    try {
      const res = await fetch("/api/landings/all");
      if (!res.ok) {
        let msg = "Error al obtener landings";
        try {
            const errData = await res.json();
            if(errData.error) msg = errData.error;
        } catch(e) {}
        throw new Error(msg);
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
          <td>
            <a href="${verLink}" target="_blank" class="btn btn-sm btn-info" title="Ver Landing">
              <i data-feather="external-link"></i>
            </a>
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (typeof feather !== "undefined") {
        feather.replace();
      }

    } catch (err) {
      console.error("Error cargando landings:", err);
      const tbody = document.querySelector("#tablaLandingsTotales tbody");
      // Colspan adjusted to 8 to match header
      const msg = err.message || "Error desconocido";
      tbody.innerHTML = `<tr><td colspan="8" class="text-danger text-center">Error al cargar datos: ${msg}</td></tr>`;
    }
  }

  // Iniciar
  cargarLandings();
})();

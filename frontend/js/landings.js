(function () {
  const role = (window.currentUser?.rol || '').toLowerCase();
  const canManage = role === 'superusuario';

  const TABLE_SELECTOR = "#tablaLandingsTotales";
  const ACTIONS_COL_INDEX = 7;

  let defaultDemoSlug = null;

  const loadDefaultDemoSlug = async () => {
    try {
      const res = await fetch('/api/settings/public');
      if (!res.ok) return;
      const data = await res.json();
      defaultDemoSlug = (data?.demo_landing_slug || '').trim() || null;
    } catch {
      defaultDemoSlug = null;
    }
  };

  const destroyDataTableIfAny = () => {
    if (typeof window.$ === 'undefined') return;
    if (!window.$.fn || !window.$.fn.dataTable) return;
    if (window.$.fn.dataTable.isDataTable(TABLE_SELECTOR)) {
      window.$(TABLE_SELECTOR).DataTable().clear().destroy();
    }
  };

  const initDataTable = () => {
    if (typeof window.$ === 'undefined') return;
    if (!window.$.fn || !window.$.fn.dataTable) return;

    if (window.$.fn.dataTable.isDataTable(TABLE_SELECTOR)) {
      window.$(TABLE_SELECTOR).DataTable().destroy();
    }

    window.$(TABLE_SELECTOR).DataTable({
      language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" },
      pageLength: 10,
      order: [[0, 'desc']],
      columnDefs: canManage
        ? [{ targets: [ACTIONS_COL_INDEX], orderable: false, searchable: false }]
        : [{ targets: [ACTIONS_COL_INDEX], visible: false, orderable: false, searchable: false }],
      drawCallback: () => {
        if (typeof feather !== "undefined") {
          feather.replace();
        }
      }
    });
  };

  async function cargarLandings() {
    try {
      destroyDataTableIfAny();

      const res = await fetch("/api/landings/all");
      if (!res.ok) {
        throw new Error("Error al obtener landings");
      }
      const landings = await res.json();

      // Mostrar/ocultar columna de acciones
      const thAcciones = document.getElementById('thAccionesLandingsTotales');
      if (thAcciones) thAcciones.hidden = !canManage;

      const tbody = document.querySelector("#tablaLandingsTotales tbody");
      tbody.innerHTML = "";

      landings.forEach((l) => {
        const tr = document.createElement("tr");

        const slugSafe = encodeURIComponent(l.slug);

        const usuario = l.usuario_nombres ? `${l.usuario_nombres} ${l.usuario_apellidos}` : "Desconocido";
        const fecha = new Date(l.created_at).toLocaleDateString("es-CL");
        const estado = l.is_public
          ? '<span class="badge badge-success">Pública</span>'
          : '<span class="badge badge-secondary">Privada</span>';

        const views = l.total_views || 0;

        const toggleIcon = l.is_public ? 'lock' : 'globe';
        const toggleTitle = l.is_public ? 'Privar' : 'Publicar';

        const isDefaultDemo = !!defaultDemoSlug && l.slug === defaultDemoSlug;
        const demoBtnClass = isDefaultDemo ? 'btn-success' : 'btn-secondary';
        const demoIcon = isDefaultDemo ? 'check' : 'star';
        const demoTitle = isDefaultDemo ? 'Demo predeterminado' : 'Marcar como demo predeterminado';

        const accionesTd = canManage
          ? `
              <td>
                <div class="btn-group btn-group-sm" role="group" aria-label="Acciones">
                  <button type="button" class="btn ${demoBtnClass}" data-action="set-demo-default" data-slug="${l.slug}" title="${demoTitle}" aria-label="${demoTitle}" ${isDefaultDemo ? 'disabled' : ''}>
                    <i data-feather="${demoIcon}" class="icon-sm"></i>
                  </button>
                  <button type="button" class="btn btn-primary" data-action="edit" data-slug="${l.slug}" title="Editar" aria-label="Editar">
                    <i data-feather="edit-2" class="icon-sm"></i>
                  </button>
                  <button type="button" class="btn btn-warning" data-action="toggle" data-id="${l.id}" data-is-public="${l.is_public ? '1' : '0'}" title="${toggleTitle}" aria-label="${toggleTitle}">
                    <i data-feather="${toggleIcon}" class="icon-sm"></i>
                  </button>
                  <button type="button" class="btn btn-danger" data-action="delete" data-id="${l.id}" data-title="${(l.title || '').replace(/"/g, '&quot;')}" title="Eliminar" aria-label="Eliminar">
                    <i data-feather="trash-2" class="icon-sm"></i>
                  </button>
                </div>
              </td>
            `
          : '<td></td>';

        tr.innerHTML = `
          <td>${l.id}</td>
          <td>${l.title}</td>
          <td>
            <a href="/pages/${slugSafe}" title="Ver demo" aria-label="Ver demo">
              ${l.slug} <i data-feather="external-link" class="icon-sm ms-1"></i>
            </a>
          </td>
          <td>
            <div>${usuario}</div>
            <small class="text-muted">${l.usuario_email || ""}</small>
          </td>
          <td>
            <div class="d-flex align-items-center">
               <i data-feather="eye" class="icon-sm mr-1 text-muted"></i>
               <b>${views}</b>
            </div>
          </td>
          <td>${estado}</td>
          <td>${fecha}</td>
          ${accionesTd}
        `;
        tbody.appendChild(tr);
      });

      if (canManage) {
        // Delegación de eventos para acciones
        tbody.onclick = async (ev) => {
          const btn = ev.target.closest('button[data-action]');
          if (!btn) return;

          const action = btn.getAttribute('data-action');

          if (action === 'edit') {
            const slug = btn.getAttribute('data-slug');
            window.location.href = `/build.html?slug=${encodeURIComponent(slug)}`;
            return;
          }

          if (action === 'set-demo-default') {
            const slug = (btn.getAttribute('data-slug') || '').trim();
            if (!slug) return;

            try {
              const confirmText = `¿Dejar "/pages/${slug}" como demo predeterminado?`;
              let ok = true;
              if (window.Swal) {
                const result = await Swal.fire({
                  title: 'Confirmar',
                  text: confirmText,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí',
                  cancelButtonText: 'Cancelar'
                });
                ok = !!result.isConfirmed;
              } else {
                ok = window.confirm(confirmText);
              }
              if (!ok) return;

              const res = await fetch('/api/settings/demo-default', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug })
              });

              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'No se pudo guardar el demo predeterminado');
              }

              defaultDemoSlug = slug;
              if (window.Swal) {
                await Swal.fire('OK', 'Demo predeterminado actualizado', 'success');
              }
              await cargarLandings();
            } catch (e) {
              console.error(e);
              if (window.Swal) {
                Swal.fire('Error', e.message || 'No se pudo actualizar', 'error');
              } else {
                alert(e.message || 'No se pudo actualizar');
              }
            }
            return;
          }

          if (action === 'toggle') {
            const id = btn.getAttribute('data-id');
            const isPublic = btn.getAttribute('data-is-public') === '1';
            const nextValue = !isPublic;

            try {
              const confirmText = nextValue ? '¿Publicar esta landing?' : '¿Privar esta landing?';
              let ok = true;
              if (window.Swal) {
                const result = await Swal.fire({
                  title: 'Confirmar',
                  text: confirmText,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí',
                  cancelButtonText: 'Cancelar'
                });
                ok = !!result.isConfirmed;
              } else {
                ok = window.confirm(confirmText);
              }
              if (!ok) return;

              const res = await fetch(`/api/landings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_public: nextValue })
              });

              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'No se pudo actualizar el estado');
              }

              if (window.Swal) {
                await Swal.fire('OK', 'Estado actualizado', 'success');
              }
              await cargarLandings();
            } catch (e) {
              console.error(e);
              if (window.Swal) {
                Swal.fire('Error', e.message || 'No se pudo actualizar', 'error');
              } else {
                alert(e.message || 'No se pudo actualizar');
              }
            }
            return;
          }

          if (action === 'delete') {
            const id = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title') || '';

            try {
              const confirmText = `¿Eliminar la landing "${title}"? Esta acción no se puede deshacer.`;
              let ok = true;
              if (window.Swal) {
                const result = await Swal.fire({
                  title: 'Confirmar eliminación',
                  text: confirmText,
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Eliminar',
                  cancelButtonText: 'Cancelar'
                });
                ok = !!result.isConfirmed;
              } else {
                ok = window.confirm(confirmText);
              }
              if (!ok) return;

              const res = await fetch(`/api/landings/${id}`, { method: 'DELETE' });
              if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'No se pudo eliminar');
              }

              if (window.Swal) {
                await Swal.fire('Eliminada', 'La landing fue eliminada', 'success');
              }
              await cargarLandings();
            } catch (e) {
              console.error(e);
              if (window.Swal) {
                Swal.fire('Error', e.message || 'No se pudo eliminar', 'error');
              } else {
                alert(e.message || 'No se pudo eliminar');
              }
            }
          }
        };
      }

      if (typeof feather !== "undefined") {
        feather.replace();
      }

      initDataTable();

    } catch (err) {
      console.error("Error cargando landings:", err);
      // Podríamos mostrar un mensaje en la tabla si falla
      const tbody = document.querySelector("#tablaLandingsTotales tbody");
      const colspan = canManage ? 8 : 7;
      tbody.innerHTML = `<tr><td colspan="${colspan}" class="text-danger text-center">Error al cargar datos</td></tr>`;
    }
  }

  // Iniciar
  (async () => {
    await loadDefaultDemoSlug();
    await cargarLandings();
  })();
})();

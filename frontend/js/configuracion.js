(function () {
  const container = document.getElementById("settingsContainer");
  const btnSave = document.getElementById("btnSaveSettings");
  let currentSettings = {};

  async function loadSettings() {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Error cargando configuraciones");
      const data = await res.json();
      renderSettings(data);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="alert alert-danger">Error al cargar configuraciones.</div>`;
    }
  }

  function renderSettings(groupedSettings) {
    container.innerHTML = "";
    
    // Mapeo de nombres de categorías
    const catLabels = {
      general: "General",
      system: "Sistema & Seguridad",
      appearance: "Apariencia"
    };

    for (const [category, items] of Object.entries(groupedSettings)) {
      const card = document.createElement("div");
      card.className = "card mb-4";
      
      const headerTitle = catLabels[category] || category.toUpperCase();

      let itemsHtml = "";
      items.forEach(item => {
        // Guardar referencia en currentSettings para luego comparar
        currentSettings[item.key] = item.value;

        let inputHtml = "";
        
        if (item.type === 'boolean') {
          const checked = item.value === 'true' ? 'checked' : '';
          inputHtml = `
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input setting-input" id="${item.key}" data-key="${item.key}" data-type="boolean" ${checked}>
              <label class="custom-control-label" for="${item.key}">${item.description || ''}</label>
            </div>
          `;
        } else if (item.type === 'color') {
          inputHtml = `
            <input type="color" class="form-control setting-input" id="${item.key}" data-key="${item.key}" value="${item.value}" style="height: 40px; max-width: 100px;">
            <small class="form-text text-muted">${item.description || ''}</small>
          `;
        } else {
          // Default text / number
          inputHtml = `
            <input type="text" class="form-control setting-input" id="${item.key}" data-key="${item.key}" value="${item.value}">
            <small class="form-text text-muted">${item.description || ''}</small>
          `;
        }

        itemsHtml += `
          <div class="form-group row">
            <label class="col-sm-3 col-form-label font-weight-bold">${item.label || item.key}</label>
            <div class="col-sm-9">
              ${inputHtml}
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="card-body">
          <h4 class="card-title mb-4 border-bottom pb-2">${headerTitle}</h4>
          <form onsubmit="return false;">
            ${itemsHtml}
          </form>
        </div>
      `;
      
      container.appendChild(card);
    }
    
    if (typeof feather !== 'undefined') feather.replace();
  }

  async function saveSettings() {
    const inputs = document.querySelectorAll(".setting-input");
    const updates = {};
    let hasChanges = false;

    inputs.forEach(input => {
      const key = input.dataset.key;
      const type = input.dataset.type;
      let value = input.value;

      if (type === 'boolean') {
        value = input.checked ? 'true' : 'false';
      }

      if (value !== currentSettings[key]) {
        updates[key] = value;
        hasChanges = true;
      }
    });

    if (!hasChanges) {
      return Swal.fire("Sin cambios", "No hay nada que guardar.", "info");
    }

    try {
      btnSave.disabled = true;
      btnSave.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      // Actualizar localmente
      Object.assign(currentSettings, updates);

      Swal.fire("Éxito", "Configuraciones actualizadas correctamente.", "success");
    } catch (err) {
      Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = '<i data-feather="save"></i> Guardar Cambios';
      if (typeof feather !== 'undefined') feather.replace();
    }
  }

  btnSave.addEventListener("click", saveSettings);
  loadSettings();
})();

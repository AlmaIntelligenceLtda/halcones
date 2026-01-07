(async function initLeads() {
    const tbody = document.querySelector("#leadsTable tbody");

    try {
        const res = await fetch("/api/leads");
        if (!res.ok) throw new Error("Error fetching leads");
        const leads = await res.json();

        tbody.innerHTML = "";
        
        if (leads.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5' class='text-center text-muted'>No hay contactos registrados aún.</td></tr>";
            return;
        }

        leads.forEach(lead => {
            const tr = document.createElement("tr");
            
            // Format Date
            const date = new Date(lead.created_at).toLocaleString();
            
            // Format Type
            let typeBadge = '';
            if (lead.type === 'form') typeBadge = '<span class="badge bg-primary">Formulario</span>';
            else if (lead.type === 'pricing') typeBadge = '<span class="badge bg-success">Plan / Pricing</span>';
            else typeBadge = `<span class="badge bg-secondary">${lead.type}</span>`;
            
            // Format Data
            // lead.data is a JSON object. We should format it nicely.
            let dataContent = '';
            if (lead.data) {
                dataContent = `<ul class="list-unstyled mb-0">`;
                
                // Prioritize "Plan" if it exists (nice format)
                if (lead.data.plan) {
                    dataContent += `<li class="mb-1 text-primary"><strong>Plan:</strong> ${lead.data.plan}</li>`;
                }

                Object.entries(lead.data).forEach(([key, val]) => {
                    // Skip 'plan' if handled above
                    if (key === 'plan') return;
                    // Format key labels nicely
                    let label = key.charAt(0).toUpperCase() + key.slice(1);
                    dataContent += `<li><strong>${label}:</strong> ${val}</li>`;
                });
                dataContent += `</ul>`;
            }

            tr.innerHTML = `
                <td>${date}</td>
                <td>
                    <a href="/pages/${lead.landing_slug}" target="_blank">${lead.landing_title}</a>
                </td>
                <td>${typeBadge}</td>
                <td>${dataContent}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error cargando leads:", err);
        tbody.innerHTML = "<tr><td colspan='5' class='text-danger'>Error cargando datos.</td></tr>";
    }
})();

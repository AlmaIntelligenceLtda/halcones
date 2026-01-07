/* global Chart, feather */

(async function initReportes() {
  try {
    const res = await fetch("/api/reportes/dashboard");
    if (!res.ok) throw new Error("Error fetching reports");
    const data = await res.json();

    // 1. Update summary cards
    document.getElementById("total-views").innerText = data.totalViews;
    document.getElementById("total-landings-report").innerText = data.totalLandings;

    // 2. Render Chart using Chart.js
    const ctx = document.getElementById("viewsChart");
    if (ctx) {
      // Prepare data
      // Fill gaps if needed? For now just plot what DB returns.
      const labels = data.history.map(d => d.day);
      const values = data.history.map(d => d.count);

      new Chart(ctx.getContext("2d"), {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Visitas',
            data: values,
            backgroundColor: 'rgba(114, 124, 245, 0.2)',
            borderColor: '#727cf5',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#fff',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(0,0,0,0.05)"
              },
              ticks: { stepSize: 1 }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // 3. Render Top Table
    const tbody = document.getElementById("top-landings-table");
    if (tbody) {
      tbody.innerHTML = "";
      if (data.topLandings.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3' class='text-muted'>Sin visitas registradas.</td></tr>";
      } else {
        data.topLandings.forEach(l => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
                <td>${l.title || "Sin título"}</td>
                <td>
                  <a href="/pages/${l.slug}" target="_blank" class="d-flex align-items-center">
                    ${l.slug} <i data-feather="external-link" class="icon-sm ms-1"></i>
                  </a>
                </td>
                <td><span class="badge bg-primary">${l.views}</span></td>
            `;
          tbody.appendChild(tr);
        });
      }
    }

    // Initialize icons
    if (window.feather) feather.replace();

  } catch (err) {
    console.error("Reportes error:", err);
    // document.getElementById("viewsChart").parentNode.innerHTML = "<div class='alert alert-danger'>Error cargando reportes</div>";
  }
})();

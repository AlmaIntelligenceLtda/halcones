(function() {
    async function loadMetrics() {
        try {
            const res = await fetch("/api/reportes/global");
            if (!res.ok) throw new Error("Error obteniendo métricas");
            
            const data = await res.json();
            
            // 1. KPIs
            document.getElementById("metric-users").innerText = data.total_usuarios || 0;
            document.getElementById("metric-landings").innerText = data.total_landings || 0;
            document.getElementById("metric-views").innerText = data.total_vistas || 0;
            document.getElementById("metric-leads").innerText = data.total_leads || 0;

            // 2. Chart Views
            if(document.getElementById('viewsChartGlobal')) {
                const labels = data.viewsByDay.map(d => d.day);
                const values = data.viewsByDay.map(d => d.count);
                
                new Chart(document.getElementById('viewsChartGlobal'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Visitas Diarias',
                            data: values,
                            borderColor: '#727cf5',
                            backgroundColor: 'rgba(114, 124, 245, 0.2)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }

            // 3. Chart Roles
            if(document.getElementById('rolesChart')) {
                // Ensure chart.js colors
                const colors = ['#f77eb9', '#7ee5e5', '#4d8af0', '#fbbc06', '#10b759'];
                // Agrupar roles
                const labelsRoles = data.usersByRole.map(r => r.rol);
                const valuesRoles = data.usersByRole.map(r => r.count);

                new Chart(document.getElementById('rolesChart'), {
                    type: 'doughnut',
                    data: {
                        labels: labelsRoles,
                        datasets: [{
                            data: valuesRoles,
                            backgroundColor: colors
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom' }
                        }
                    }
                });
            }

        } catch (err) {
            console.error("Error loading global metrics:", err);
        }
    }

    loadMetrics();
})();

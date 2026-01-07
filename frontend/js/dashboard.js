(async function() {
  const totalLandingsEl = document.getElementById('total-landings');
  const publicLandingsEl = document.getElementById('public-landings');
  const userRoleEl = document.getElementById('user-role');
  const tableBody = document.querySelector('#dashboard-table tbody');
  
  // Elements for Role Toggle
  const contentSuperUser = document.getElementById('contentSuperUser');
  const contentClient = document.getElementById('contentClient');
  const currentDateEl = document.getElementById('currentDate');

  // Date Setup
  if (currentDateEl) {
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.innerText = new Date().toLocaleDateString('es-ES', dateOpts);
  }

  try {
    // 1. Get User Info (for role) - Check global cache first
    let userData = null;
    
    if (window.currentUser) {
        userData = window.currentUser;
    } else {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (meData.success && meData.user) {
            userData = meData.user;
            window.currentUser = userData; // Cache it
        }
    }
    
    let userRole = 'professional'; // default
    if (userData) {
      if (userRoleEl) userRoleEl.textContent = userData.rol;
      userRole = (userData.rol || '').toLowerCase();
    }

    // 2. Toggle View Based on Role
    if (userRole === 'superusuario') {
        if(contentSuperUser) contentSuperUser.style.display = 'block';
        if(contentClient) contentClient.style.display = 'none';
        
        // Force icon render with a small delay to handle visibility change
        setTimeout(() => {
            if (window.feather) feather.replace();
        }, 50);
        
        // --- SUPERUSER LOGIC HERE ---
        // (Optional) Load specific stats for admin
        return; // Stop here, do not load client stats
    } else {
        if(contentSuperUser) contentSuperUser.style.display = 'none';
        if(contentClient) contentClient.style.display = 'block';
    }

    // --- CLIENT LOGIC BELOW ---

    // 2. Get Landings
    const res = await fetch('/api/landings');
    if (!res.ok) throw new Error('Error fetching landings');
    
    const landings = await res.json();
    
    // Update Stats
    if (totalLandingsEl) totalLandingsEl.textContent = landings.length;
    const publicCount = landings.filter(l => l.is_public).length;
    if (publicLandingsEl) publicLandingsEl.textContent = publicCount;

    // Populate Table (Last 5)
    if (tableBody) {
        tableBody.innerHTML = '';
        landings.slice(0, 5).forEach(landing => {
        const tr = document.createElement('tr');
        const date = new Date(landing.created_at).toLocaleDateString();
        const statusBadge = landing.is_public 
            ? '<span class="badge bg-success">Pública</span>' 
            : '<span class="badge bg-secondary">Privada</span>';
        
        tr.innerHTML = `
            <td>${landing.title}</td>
            <td><a href="/pages/${landing.slug}" target="_blank">${landing.slug}</a></td>
            <td>${statusBadge}</td>
            <td>${date}</td>
            <td>
            <a href="/build.html?slug=${landing.slug}" class="btn btn-xs btn-primary">Editar</a>
            </td>
        `;
        tableBody.appendChild(tr);
        });
    }

  } catch (err) {
    console.error('Dashboard Error:', err);
  }
})();

// Function to create new landing
window.crearNuevaLanding = async () => {
    let title, slug;

    if (window.Swal) {
        const { value: formValues } = await Swal.fire({
            title: 'Nueva Landing Page',
            html:
                '<p style="margin-bottom:5px; text-align:left">Título</p>' +
                '<input id="swal-input1" class="swal2-input" placeholder="Ej: Mi Portafolio" style="margin-top:0">' +
                '<p style="margin-bottom:5px; text-align:left; margin-top:15px">Slug (URL)</p>' +
                '<input id="swal-input2" class="swal2-input" placeholder="Ej: mi-portafolio">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ]
            }
        });

        if (!formValues) return;
        [title, slug] = formValues;
    } else {
        title = prompt("Título de la Landing:");
        if (!title) return;
        slug = prompt("Slug (identificador URL, sin espacios):");
    }

    if (!title || !slug) {
        alert("Título y Slug son obligatorios");
        return;
    }

    // Basic slug cleaning
    slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    try {
        const res = await fetch('/api/landings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                slug,
                description: `Landing page para ${title}`,
                is_public: true, // Default to true or false as desired
                data: {} // Empty schema initially
            })
        });

        if (res.ok) {
            const data = await res.json();
            // Redirect to builder
            window.location.href = `/build.html?slug=${data.slug}`;
        } else {
            const err = await res.json();
            if (window.Swal) {
                Swal.fire('Error', err.error || 'No se pudo crear la landing', 'error');
            } else {
                alert("Error: " + (err.error || "No se pudo crear"));
            }
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
};

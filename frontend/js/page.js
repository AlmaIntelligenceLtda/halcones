class Page {
  constructor(user) {
    this.user = user;
    this.attachEvents();
    this.loadDataUser();
  }

  get(id) {
    return document.querySelector(id);
  }

  setElementValue(selector, property, value) {
    const el = this.get(selector);
    if (el) el[property] = value;
  }

  attachEvents() {
    this.get('#btnLogout')?.addEventListener('click', this.logout.bind(this));
  }

  async logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store"
      });
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err);
    } finally {
      // 🔒 Redirigir siempre a login y bloquear "atrás"
      window.location.replace("/home.html");
    }
  }

  loadDataUser() {
    const { nombres, apellidos, email, rol } = this.user;

    // Set datos en el header
    [
      ['#profileNameInicio', 'innerHTML', nombres + " " + apellidos],
      ['#profileNombre', 'innerHTML', nombres + " " + apellidos],
      ['#profileEmail', 'innerHTML', email],
      ['#nombreUsuarioDashboard', 'innerHTML', nombres + " " + apellidos]
    ].forEach(([selector, prop, val]) => this.setElementValue(selector, prop, val));

    // Ocultar todos los menús y tarjetas por defecto
    [
      ...document.querySelectorAll('.nav-menu'),
      ...document.querySelectorAll('.nav-category'),
      ...document.querySelectorAll('.card-dashboard')
    ].forEach(el => el.style.display = 'none');

    // Mostrar elementos autorizados por rol
    this.mostrarElementosPorRol(rol);
  }

  mostrarElementosPorRol(rol) {
    // Normalizar rol
    const r = (rol || '').toLowerCase();

    // Definir accesos
    const accesos = {
      superusuario: [
        '#menuUsuarios', '#menuDashboard', '#menuLandingsTotales', '#menuConfiguracion', '#menuMetricas'
      ],
      administrador: [
        '#menuUsuarios', '#menuDashboard', '#menuConfiguracion', '#menuMetricas'
      ],
      cliente: [
        '#menuReportes', '#menuDashboard', '#menuContactos'
      ]
    };

    // Obtener selectores permitidos
    const permitidos = accesos[r] || [];

    // Mostrar siempre Dashboard si no está explícito (opcional)
    // Pero aquí lo controlamos explícitamente.

    permitidos.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) el.style.display = '';
    });

    // Mostrar las categorías del menú si tienen ítems visibles
    document.querySelectorAll('.nav-category').forEach(category => {
      let siguiente = category.nextElementSibling;
      let tieneHijosVisibles = false;
      while (siguiente && !siguiente.classList.contains('nav-category')) {
        if (siguiente.style.display !== 'none') {
          tieneHijosVisibles = true;
          break;
        }
        siguiente = siguiente.nextElementSibling;
      }
      if (tieneHijosVisibles) category.style.display = '';
    });

    // ------------------------------------------------------------
    // LOGICA ESPECIFICA PARA DASHBOARD / INICIO (Fix visibility)
    // ------------------------------------------------------------
    const superUserContent = document.getElementById('contentSuperUser');
    const clientContent = document.getElementById('contentClient');

    if (r === 'superusuario') {
      if (superUserContent) superUserContent.style.display = 'block';
      if (clientContent) clientContent.style.display = 'none';
    } else {
      // Cliente / Profesional
      if (superUserContent) superUserContent.style.display = 'none';
      if (clientContent) clientContent.style.display = 'block';
    }

    feather.replace();
  }
}

(async () => {
  try {
    // 1) Validar sesión ANTES de armar la UI
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });

    if (!res.ok) throw new Error("No autorizado");

    const data = await res.json();
    if (!data.success || !data.user) {
      window.location.replace("/home.html");
      return;
    }

    // Guardar usuario globalmente para acceso rápido sin fetch
    window.currentUser = data.user;

    // 2) Incluir HTML solo si está autenticado
    if (typeof includeHTML === "function") {
      await includeHTML();
    }

    // 3) Cargar template.js
    await new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "../assets/js/template.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });

    // 4) Inicializar página con el usuario
    new Page(data.user);

    // 5) Mostrar la app
    document.getElementById("app").hidden = false;

    // 6) Ir al dashboard por defecto
    const dashboardLink = document.querySelector('[data-page="dashboard"]');
    if (dashboardLink) {
       dashboardLink.click();
    }

  } catch (error) {
    console.error("❌ Error al obtener el usuario:", error);
    window.location.replace("/home.html");
  }
})();

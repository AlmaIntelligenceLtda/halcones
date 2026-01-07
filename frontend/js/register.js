document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombres = document.getElementById('nombres').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const msg = document.getElementById('msg');

  msg.textContent = '';

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nombres, apellidos, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.message || data.error || JSON.stringify(data);
      return;
    }
    // Redirect to dashboard (auto-logged in)
    window.location.href = '/dashboard';
  } catch (err) {
    console.error('Error registering:', err);
    msg.textContent = 'Error de red. Intenta nuevamente.';
  }
});

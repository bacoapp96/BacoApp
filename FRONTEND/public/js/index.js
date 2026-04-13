/* landing.js
   Comportamiento básico del hero: manejo de botones, accesibilidad y animación ligera.
*/

/* ---------------------------
   Cachear elementos del DOM
   --------------------------- */
const btnClient = document.getElementById('btn-client');
const btnAdmin  = document.getElementById('btn-admin');
const yearSpan  = document.getElementById('year');
const heroEl    = document.getElementById('hero');

/* ---------------------------
   Inicialización (se ejecuta al cargar)
   --------------------------- */
function init() {
  // 1) colocar año en footer
  setCurrentYear();

  // 2) poner listeners accesibles a los botones principales
  attachCTAListeners();

  // 3) animación de entrada suave (solo si no se prefiere reducir movimiento)
  if (!prefersReducedMotion()) {
    requestAnimationFrame(() => heroEl.classList.add('enter'));
  }
}

/* ---------------------------
   setCurrentYear: actualiza el año dinámicamente
   --------------------------- */
function setCurrentYear() {
  const y = new Date().getFullYear();
  if (yearSpan) yearSpan.textContent = y;
}

/* ---------------------------
   attachCTAListeners: conecta eventos a botones
   - gestión de click y teclado (Enter/Space)
   --------------------------- */
function attachCTAListeners() {
  if (btnClient) {
    btnClient.addEventListener('click', handleClient);
    btnClient.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClient();
      }
    });
  }

  if (btnAdmin) {
    btnAdmin.addEventListener('click', handleAdmin);
    btnAdmin.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAdmin();
      }
    });
  }
}

/* ---------------------------
   handleClient: acción al pulsar "Inicio clientes"
   - aquí redirigimos a la lista de productos / tienda
   - si no quieres redirigir, puedes abrir un modal en su lugar
   --------------------------- */
function handleClient() {
  // efecto visual pequeño: pulsar (feedback)
  pulse(btnClient);

  // navegar a la página de clientes / tienda (cambia la ruta si es diferente)
  window.location.href = 'tienda.html';
}

/* ---------------------------
   handleAdmin: acción al pulsar "Inicio administrador"
   - ejemplo: redirige a la pantalla de login admin
   --------------------------- */
function handleAdmin() {
  pulse(btnAdmin);

  // para pruebas: redirige a 'admin.html' (cambia por la ruta real)
  window.location.href = 'admin/login.html';
}

/* ---------------------------
  pulse: efecto visual rápido para dar feedback al usuario
  - aplica una clase temporal para escalar y volver
  --------------------------- */
function pulse(el) {
  if (!el) return;
  el.style.transform = 'scale(0.98)';
  setTimeout(() => {
    el.style.transform = '';
  }, 130);
}

/* ---------------------------
   prefersReducedMotion: respetar la preferencia del usuario
   --------------------------- */
function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

/* ---------------------------
   Ejecutar init cuando el DOM esté listo
   --------------------------- */
document.addEventListener('DOMContentLoaded', init);

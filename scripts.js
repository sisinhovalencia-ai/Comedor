// 🛠️ Función que se ejecuta al hacer clic en un día del menú
function cambiarDia(dia, btn) {
  document.querySelectorAll('.dia-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.dia-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + dia).classList.add('active');
  btn.classList.add('active');
}

// 🛠️ Detecta el día actual automáticamente al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const mapaDias = ['lunes','martes','miercoles','jueves','viernes'];
  const hoy = mapaDias[new Date().getDay() - 1];

  if (hoy) {
    const tabs = document.querySelectorAll('.dia-tab');
    document.querySelectorAll('.dia-panel').forEach(p => p.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));
    const idx = mapaDias.indexOf(hoy);
    tabs[idx].classList.add('active');
    document.getElementById('panel-' + hoy).classList.add('active');
  }
});
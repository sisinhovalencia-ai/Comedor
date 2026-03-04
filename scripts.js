// =============================================
//  SISTEMA DE PEDIDOS - SABOR MARIMBERO
// =============================================

// Estado del carrito: { "Nombre Plato": { nombre, precio, emoji, cantidad } }
let carrito = {};

// ---- Tabs de días ----
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

// ---- Cambiar cantidad desde la card ----
function cambiarCantidad(btn, delta) {
  // Sube al .card padre
  const card = btn.closest('.card');
  const spanCantidad = card.querySelector('.cantidad');
  const nombre  = card.dataset.nombre;
  const precio  = parseFloat(card.dataset.precio);
  const emoji   = card.dataset.emoji;

  let actual = parseInt(spanCantidad.textContent) || 0;
  actual = Math.max(0, actual + delta);
  spanCantidad.textContent = actual;

  // Actualizar estado del carrito
  if (actual === 0) {
    delete carrito[nombre];
    card.classList.remove('seleccionada');
  } else {
    carrito[nombre] = { nombre, precio, emoji, cantidad: actual };
    card.classList.add('seleccionada');
  }

  actualizarUI();
}

// ---- Actualizar toda la UI del carrito ----
function actualizarUI() {
  const items = Object.values(carrito);
  const totalPlatos = items.reduce((s, i) => s + i.cantidad, 0);
  const totalPrecio = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  // Barra flotante
  const btnFlotante = document.getElementById('carrito-btn');
  if (totalPlatos === 0) {
    btnFlotante.classList.add('hidden');
  } else {
    btnFlotante.classList.remove('hidden');
    document.getElementById('carrito-count').textContent = totalPlatos;
    document.getElementById('carrito-total').textContent = totalPrecio.toFixed(2);
  }

  // Panel lateral
  document.getElementById('carrito-total-panel').textContent = '$' + totalPrecio.toFixed(2);

  const contenedor = document.getElementById('carrito-items');
  if (items.length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">Aún no has agregado platos 🍽️</p>';
    return;
  }

  contenedor.innerHTML = items.map(item => `
    <div class="carrito-item">
      <span class="carrito-item-emoji">${item.emoji}</span>
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${item.nombre}</div>
        <div class="carrito-item-precio">$${(item.precio * item.cantidad).toFixed(2)}</div>
      </div>
      <div class="carrito-item-qty">
        <button class="ci-menos" onclick="cambiarDesdePanel('${item.nombre}', -1)">−</button>
        <span class="ci-num">${item.cantidad}</span>
        <button class="ci-mas" onclick="cambiarDesdePanel('${item.nombre}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

// ---- Cambiar cantidad desde el panel del carrito ----
function cambiarDesdePanel(nombre, delta) {
  if (!carrito[nombre]) return;
  carrito[nombre].cantidad = Math.max(0, carrito[nombre].cantidad + delta);

  // Sincronizar el contador en la card visual
  document.querySelectorAll('.card').forEach(card => {
    if (card.dataset.nombre === nombre) {
      card.querySelector('.cantidad').textContent = carrito[nombre].cantidad;
      if (carrito[nombre].cantidad === 0) {
        card.classList.remove('seleccionada');
      }
    }
  });

  if (carrito[nombre].cantidad === 0) delete carrito[nombre];
  actualizarUI();
}

// ---- Abrir / cerrar panel ----
function toggleCarrito() {
  const panel = document.getElementById('carrito-panel');
  const overlay = document.getElementById('carrito-overlay');
  const abierto = !panel.classList.contains('hidden');
  if (abierto) {
    panel.classList.add('hidden');
    overlay.classList.add('hidden');
  } else {
    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }
}

// ---- Vaciar carrito ----
function limpiarCarrito() {
  carrito = {};
  document.querySelectorAll('.card').forEach(card => {
    card.querySelector('.cantidad').textContent = '0';
    card.classList.remove('seleccionada');
  });
  actualizarUI();
  toggleCarrito();
}

// ---- Enviar pedido por WhatsApp ----
function enviarPedido() {
  const items = Object.values(carrito);
  if (items.length === 0) return;

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  let lineas = items.map(i =>
    `${i.emoji} ${i.nombre} x${i.cantidad} — $${(i.precio * i.cantidad).toFixed(2)}`
  ).join('\n');

  const mensaje =
    `🍽️ *Pedido - Sabor Marimbero*\n\n` +
    `${lineas}\n\n` +
    `💰 *Total: $${total.toFixed(2)}*\n\n` +
    `¡Muchas gracias! 🌿`;

  const url = `https://wa.me/593968770724?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// -------------------
// Obtener / Guardar datos del hotel
// -------------------
function getHotelData() {
  let data = JSON.parse(localStorage.getItem("hotelData"));
  if (!data) {
    data = { 
      total: 5, 
      disponibles: 5, 
      ocupadas: 0, 
      reservas: [], 
      habitaciones: []  // 🔹 necesario para admin
    };
    setHotelData(data);
  }
  return data;
}

function setHotelData(data) {
  localStorage.setItem("hotelData", JSON.stringify(data));
}

// -------------------
// Inicialización global
// -------------------
function inicializarHotel() {
  if (!localStorage.getItem("hotelData")) {
    const base = { 
      total: 5, 
      disponibles: 5, 
      ocupadas: 0, 
      reservas: [], 
      habitaciones: [] 
    };
    setHotelData(base);
  }
}

// -------------------
// Obtener / Guardar reservas de un usuario
// -------------------
function getReservasUsuario(email) {
  return JSON.parse(localStorage.getItem(`reservas_${email}`)) || [];
}

function setReservasUsuario(email, reservas) {
  localStorage.setItem(`reservas_${email}`, JSON.stringify(reservas));
}

// -------------------
// Crear nueva reserva
// -------------------
function hacerReserva(nombre, habitacion, ingreso, salida, imagen, habitacionId, metodoPago = "No registrado", total = 0) {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuarioActivo) {
    alert("⚠️ Debes iniciar sesión para reservar.");
    return;
  }

  const reservasUsuario = getReservasUsuario(usuarioActivo.email);

  const nuevaReserva = {
    id: Date.now(),
    nombre,
    habitacion,
    habitacionId,
    ingreso,
    salida,
    estado: "Activa",
    imagen,
    metodoPago,
    total,
    pagoEstado: "Confirmado",
    usuarioEmail: usuarioActivo.email
  };

  // Guardar en usuario
  reservasUsuario.push(nuevaReserva);
  setReservasUsuario(usuarioActivo.email, reservasUsuario);

  // Guardar en hotelData global (para ADMIN)
  const data = getHotelData();
  data.reservas.push(nuevaReserva);
  data.ocupadas++;
  data.disponibles = data.total - data.ocupadas;
  setHotelData(data);

  // 🚨 Notificar actualización global
  localStorage.setItem("lastUpdate", Date.now());

  actualizarDashboard();
  alert("✅ Reserva confirmada");
}

// -------------------
// Cancelar / Finalizar reserva
// -------------------
function cancelarReserva(id) {
  const data = getHotelData();
  const index = data.reservas.findIndex((r) => r.id === id);

  if (index !== -1 && data.reservas[index].estado === "Activa") {
    data.reservas[index].estado = "Cancelada";
    if (data.ocupadas > 0) data.ocupadas--;
    data.disponibles = data.total - data.ocupadas;
    setHotelData(data);

    const email = data.reservas[index].usuarioEmail;
    const reservasUsuario = getReservasUsuario(email);
    const indexUser = reservasUsuario.findIndex((r) => r.id === id);
    if (indexUser !== -1) reservasUsuario[indexUser].estado = "Cancelada";
    setReservasUsuario(email, reservasUsuario);

    actualizarDashboard();
    localStorage.setItem("lastUpdate", Date.now());
    alert("❌ Reserva cancelada");
  }
}

function finalizarReserva(id) {
  const data = getHotelData();
  const index = data.reservas.findIndex((r) => r.id === id);

  if (index !== -1 && data.reservas[index].estado === "Activa") {
    data.reservas[index].estado = "Finalizada";
    if (data.ocupadas > 0) data.ocupadas--;
    data.disponibles = data.total - data.ocupadas;
    setHotelData(data);

    const email = data.reservas[index].usuarioEmail;
    const reservasUsuario = getReservasUsuario(email);
    const indexUser = reservasUsuario.findIndex((r) => r.id === id);
    if (indexUser !== -1) reservasUsuario[indexUser].estado = "Finalizada";
    setReservasUsuario(email, reservasUsuario);

    actualizarDashboard();
    localStorage.setItem("lastUpdate", Date.now());
    alert("✅ Estancia finalizada");
  }
}

// -------------------
// Reset general (ADMIN) y por usuario
// -------------------
function resetHotelData() {
  const base = { total: 5, disponibles: 5, ocupadas: 0, reservas: [], habitaciones: [] };
  setHotelData(base);
  alert("🔄 Datos generales reiniciados (TODOS los usuarios)");
  actualizarDashboard();
  localStorage.setItem("lastUpdate", Date.now());
}

function resetUsuario(email) {
  localStorage.removeItem(`reservas_${email}`);
  alert(`🔄 Datos reiniciados para el usuario: ${email}`);
  localStorage.setItem("lastUpdate", Date.now());
}

// -------------------
// Actualizar Dashboard (Usuario o Admin)
// -------------------
function actualizarDashboard() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const data = getHotelData();

  // Total fijo
  if (document.getElementById("totalHabitaciones"))
    document.getElementById("totalHabitaciones").innerText = data.total;

  if (usuarioActivo) {
    // 🔹 Solo reservas del usuario logueado
    const reservasUsuario = getReservasUsuario(usuarioActivo.email);
    const ocupadas = reservasUsuario.filter((r) => r.estado === "Activa").length;
    const disponibles = data.total - ocupadas;

    if (document.getElementById("habitacionesDisponibles"))
      document.getElementById("habitacionesDisponibles").innerText = disponibles;

    if (document.getElementById("habitacionesOcupadas"))
      document.getElementById("habitacionesOcupadas").innerText = ocupadas;
  } else {
    // 🔹 Para admin (global)
    if (document.getElementById("habitacionesDisponibles"))
      document.getElementById("habitacionesDisponibles").innerText = data.disponibles;

    if (document.getElementById("habitacionesOcupadas"))
      document.getElementById("habitacionesOcupadas").innerText = data.ocupadas;
  }
}

// -------------------
// Autoejecución global
// -------------------
document.addEventListener("DOMContentLoaded", () => {
  inicializarHotel();
  actualizarDashboard();
});

// -------------------
// Logout global
// -------------------
function logout() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
}

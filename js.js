// -------------------
// Manejo de datos base
// -------------------
function getHotelData() {
  let data = JSON.parse(localStorage.getItem("hotelData"));
  if (!data) {
    data = { total: 5, disponibles: 5, ocupadas: 0, reservas: [] };
    setHotelData(data);
  }
  return data;
}

function setHotelData(data) {
  localStorage.setItem("hotelData", JSON.stringify(data));
}

// -------------------
// Inicialización
// -------------------
function inicializarHotel() {
  if (!localStorage.getItem("hotelData")) {
    const base = { total: 5, disponibles: 5, ocupadas: 0, reservas: [] };
    setHotelData(base);
  }
}

// -------------------
// Crear reserva
// -------------------
function hacerReserva(nombre, habitacion, ingreso, salida, imagen, habitacionId) {
  const data = getHotelData();

  if (data.disponibles <= 0) {
    alert("⚠️ No hay habitaciones disponibles.");
    return;
  }

  const nuevaReserva = {
    id: Date.now(),
    nombre,
    habitacion,
    habitacionId,
    ingreso,
    salida,
    estado: "Activa",
    imagen
  };

  data.reservas.push(nuevaReserva);
  data.ocupadas++;
  data.disponibles = data.total - data.ocupadas;

  setHotelData(data);
  actualizarDashboard();
  alert("✅ Reserva confirmada");
}

// -------------------
// Cancelar / Finalizar
// -------------------
function cancelarReserva(id) {
  const data = getHotelData();
  const index = data.reservas.findIndex(r => r.id === id);

  if (index !== -1 && data.reservas[index].estado === "Activa") {
    data.reservas[index].estado = "Cancelada";
    if (data.ocupadas > 0) data.ocupadas--;
    data.disponibles = data.total - data.ocupadas;
    setHotelData(data);
    actualizarDashboard();
    alert("❌ Reserva cancelada");
  }
}

function finalizarReserva(id) {
  const data = getHotelData();
  const index = data.reservas.findIndex(r => r.id === id);

  if (index !== -1 && data.reservas[index].estado === "Activa") {
    data.reservas[index].estado = "Finalizada";
    if (data.ocupadas > 0) data.ocupadas--;
    data.disponibles = data.total - data.ocupadas;
    setHotelData(data);
    actualizarDashboard();
    alert("✅ Estancia finalizada");
  }
}

// -------------------
// Actualizar Dashboard
// -------------------
function actualizarDashboard() {
  const data = getHotelData();

  if (document.getElementById("totalHabitaciones"))
    document.getElementById("totalHabitaciones").innerText = data.total;

  if (document.getElementById("habitacionesDisponibles"))
    document.getElementById("habitacionesDisponibles").innerText = data.disponibles;

  if (document.getElementById("habitacionesOcupadas"))
    document.getElementById("habitacionesOcupadas").innerText = data.ocupadas;

  if (document.getElementById("totalReservas"))
    document.getElementById("totalReservas").innerText = data.reservas.length;
}

// -------------------
// Reset (opcional para pruebas)
// -------------------
function resetHotelData() {
  const base = { total: 5, disponibles: 5, ocupadas: 0, reservas: [] };
  setHotelData(base);
  actualizarDashboard();
  alert("🔄 Datos reiniciados");
}

// -------------------
// Autoejecución
// -------------------
document.addEventListener("DOMContentLoaded", () => {
  inicializarHotel();
  actualizarDashboard();
});

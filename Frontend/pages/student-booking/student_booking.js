document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "student") {
        Swal.fire("Error", "Inicia sesión como estudiante para acceder", "error");
        window.location.href = "../../login.html";
        return;
    }

    const API_URL = "http://localhost:3000";
    const statsEls = {
        total: document.querySelector(".stat-card:nth-child(1) h2"),
        pending: document.querySelector(".stat-card.yellow h2"),
        confirmed: document.querySelector(".stat-card.green h2"),
        canceled: document.querySelector(".stat-card.red h2")
    };
    const bookingsContainer = document.querySelector(".bookings");

    // Cerrar sesión
    document.querySelector(".header .icon").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "../../login.html";
    });

    // Obtener reservas del estudiante
    async function fetchBookings() {
        try {
            const res = await fetch(`${API_URL}/booking/student/${user.id}`);
            const bookings = await res.json();

            // Estadísticas
            const total = bookings.length;
            const pending = bookings.filter(b => b.booking_status === "pending").length;
            const confirmed = bookings.filter(b => b.booking_status === "confirmed").length;
            const canceled = bookings.filter(b => b.booking_status === "canceled").length;

            statsEls.total.textContent = total;
            statsEls.pending.textContent = pending;
            statsEls.confirmed.textContent = confirmed;
            statsEls.canceled.textContent = canceled;

            // Renderizar tarjetas
            bookingsContainer.innerHTML = bookings.map(b => `
                <div class="booking-card">
                    <img src="${b.photo_url || '../images/default-room.jpg'}" alt="Habitación">
                    <div class="info">
                        <h3>${b.title}</h3>
                        <p><i class="fas fa-map-marker-alt"></i> ${b.address}</p>
                        <p>Entrada: ${new Date(b.start_date).toLocaleDateString()} &nbsp; | &nbsp; Salida: ${new Date(b.end_date).toLocaleDateString()}</p>
                        <strong>$${b.price}/mes</strong>
                    </div>
                    <div class="status">
                        ${b.booking_status === "pending" ? 
                            `<span class="pending"><i class="fas fa-clock"></i> Pendiente</span>` : ""}
                        ${b.booking_status === "confirmed" ? 
                            `<span class="confirmed"><i class="fas fa-check"></i> Confirmada</span>` : ""}
                        ${b.booking_status === "canceled" ? 
                            `<span class="cancel"><i class="fa-solid fa-xmark"></i> Cancelada</span>` : ""}
                        ${b.booking_status === "pending" ? 
                            `<span class="cancel-booking" style="cursor:pointer; color:red;">Cancelar</span>` : ""}
                    </div>
                </div>
            `).join("");

            // Agregar funcionalidad de cancelar
            document.querySelectorAll(".cancel-booking").forEach((btn, index) => {
                btn.addEventListener("click", async () => {
                    const bookingId = bookings[index].booking_id;
                    try {
                        const res = await fetch(`${API_URL}/booking/${bookingId}/cancel`, { method: "PUT" });
                        if (!res.ok) throw new Error("Error cancelando reserva");

                        Swal.fire("Cancelada", "La reserva ha sido cancelada", "success");
                        fetchBookings(); // refrescar
                    } catch (err) {
                        console.error(err);
                        Swal.fire("Error", "No se pudo cancelar la reserva", "error");
                    }
                });
            });

        } catch (err) {
            console.error("Error cargando reservas:", err);
            bookingsContainer.innerHTML = "<p>No se pudieron cargar las reservas.</p>";
        }
    }

    fetchBookings();
});

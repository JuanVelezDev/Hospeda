document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "owner") {
        Swal.fire("Error", "Inicia sesión como propietario para acceder", "error");
        window.location.href = "../../login.html";
        return;
    }

    const userId = user.id; // id del propietario
    const API_URL = "http://localhost:3000";

    // Elementos del DOM
    const propiedadesActivasEl = document.getElementById("propiedadesActivas");
    const solicitudesPendientesEl = document.getElementById("solicitudesPendientes");
    const misPropiedadesEl = document.getElementById("misPropiedades");
    const solicitudesRecibidasEl = document.getElementById("solicitudesRecibidas");
    const todasPropiedadesEl = document.getElementById("todasPropiedades");
    const ownerNameEl = document.getElementById("ownerName");
    const logoutBtn = document.getElementById("logoutBtn");

    ownerNameEl.textContent = user.name;
    logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "../../login.html";
    });

    // ---------------- FUNCIONES ---------------- //

    // Mis propiedades
    async function fetchMisPropiedades() {
        try {
            const res = await fetch(`${API_URL}/apartment`);
            const apartments = await res.json();
            const misProps = apartments.filter(a => a.user_id == userId);

            propiedadesActivasEl.textContent = misProps.length;

            misPropiedadesEl.innerHTML = misProps.map(apto => `
                <div class="listing-card">
                    <h3>${apto.title}</h3>
                    <p>${apto.address}</p>
                    <p><strong>$${apto.price}</strong> / mes</p>
                </div>
            `).join("");

        } catch (err) {
            console.error("Error cargando propiedades:", err);
        }
    }

    // Solicitudes pendientes
    async function fetchSolicitudesPendientes() {
        try {
            const res = await fetch(`${API_URL}/booking/owner/${userId}/pending`);
            const data = await res.json();

            solicitudesPendientesEl.textContent = data.length;

            if (data.length === 0) {
                solicitudesRecibidasEl.innerHTML = "<p>No hay solicitudes pendientes</p>";
                return;
            }

            solicitudesRecibidasEl.innerHTML = data.map(req => `
                <div class="request-card">
                    <p><strong>${req.student_name}</strong> (${req.student_email})</p>
                    <p>${req.title} - ${req.address}</p>
                    <p>Del ${new Date(req.start_date).toLocaleDateString()} al ${new Date(req.end_date).toLocaleDateString()}</p>
                    <div class="request-actions">
                        <button class="btn-approve" data-id="${req.request_id}">✅ Aprobar</button>
                        <button class="btn-reject" data-id="${req.request_id}">❌ Rechazar</button>
                    </div>
                </div>
            `).join("");

            // Asignar eventos después de renderizar
            document.querySelectorAll(".btn-approve").forEach(btn => {
                btn.addEventListener("click", () => aprobarSolicitud(btn.dataset.id));
            });
            document.querySelectorAll(".btn-reject").forEach(btn => {
                btn.addEventListener("click", () => rechazarSolicitud(btn.dataset.id));
            });

        } catch (err) {
            console.error("Error cargando solicitudes pendientes:", err);
        }
    }

    // Todas las solicitudes
    async function fetchTodasSolicitudes() {
        try {
            const res = await fetch(`${API_URL}/booking/owner/${userId}/all`);
            const data = await res.json();

            if (data.length === 0) {
                todasPropiedadesEl.innerHTML = "<p>No hay solicitudes</p>";
                return;
            }

            todasPropiedadesEl.innerHTML = data.map(req => `
                <div class="property-card">
                    <h3>${req.title}</h3>
                    <p>${req.address}</p>
                    <p>Estudiante: ${req.student_name} (${req.student_email})</p>
                    <p>Estado: <strong>${req.request_status}</strong> / Reserva: <strong>${req.booking_status}</strong></p>
                </div>
            `).join("");

        } catch (err) {
            console.error("Error cargando todas las solicitudes:", err);
        }
    }

    // Aprobar solicitud
    window.aprobarSolicitud = async function (requestId) {
        try {
            const res = await fetch(`${API_URL}/booking/${requestId}/approve`, { method: "PUT" });
            if (!res.ok) throw new Error("Error aprobando solicitud");

            Swal.fire("✅ Aprobada", "La solicitud fue aprobada", "success");

            // Recargar solicitudes pendientes y todas
            fetchSolicitudesPendientes();
            fetchTodasSolicitudes();
        } catch (err) {
            console.error(err);
            Swal.fire("❌ Error", "No se pudo aprobar la solicitud", "error");
        }
    }


    // Rechazar solicitud
    window.rechazarSolicitud = async function (requestId) {
        try {
            const res = await fetch(`${API_URL}/booking/${requestId}/reject`, { method: "PUT" });
            if (!res.ok) throw new Error("Error rechazando solicitud");

            Swal.fire("❌ Rechazada", "La solicitud fue rechazada", "success");

            // Recargar solicitudes pendientes y todas
            fetchSolicitudesPendientes();
            fetchTodasSolicitudes();
        } catch (err) {
            console.error(err);
            Swal.fire("❌ Error", "No se pudo rechazar la solicitud", "error");
        }
    }

    // ---------------- EJECUTAR ---------------- //
    fetchMisPropiedades();
    fetchSolicitudesPendientes();
    fetchTodasSolicitudes();
});

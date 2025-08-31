const form = document.getElementById("registerForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const role = document.getElementById("role").value;

    // Mostrar alerta de carga
    Swal.fire({
        title: 'Creando Cuenta...',
        text: 'Por favor espera mientras procesamos tu registro',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const res = await fetch(`${API_CONFIG.baseUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, email, password, role, phone })
        });

        const data = await res.json();

        if (res.ok) {
            // Cerrar alerta de carga y mostrar éxito
            Swal.fire({
                icon: 'success',
                title: '¡Registro Exitoso!',
                text: 'Tu cuenta ha sido creada. Redirigiendo al login...',
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => window.location.href = "login.html", 1500);
        } else {
            // Cerrar alerta de carga y mostrar error
            Swal.fire({
                icon: 'error',
                title: 'Error de Registro',
                text: data.message || 'Hubo un problema al crear tu cuenta',
                confirmButtonColor: '#ff4757',
                confirmButtonText: 'Intentar de Nuevo'
            });
        }

    } catch (err) {
        // Cerrar alerta de carga y mostrar error de conexión
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            confirmButtonColor: '#ff4757',
            confirmButtonText: 'Intentar de Nuevo'
        });
        console.error(err);
    }
});

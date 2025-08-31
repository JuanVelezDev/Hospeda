const form = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Mostrar alerta de carga
    Swal.fire({
        title: 'Iniciando Sesión...',
        text: 'Por favor espera mientras verificamos tus credenciales',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Cerrar alerta de carga y mostrar éxito
            Swal.fire({
                icon: 'success',
                title: '¡Login Exitoso!',
                text: 'Redirigiendo a tu dashboard...',
                timer: 1500,
                showConfirmButton: false
            });

            // Guardar info en localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirección según el rol
            setTimeout(() => {
                if (data.user.role === "student") {
                    window.location.href = "./pages/students-serch/student.html";
                } else if (data.user.role === "owner") {
                    window.location.href = "./pages/publish-property/index.html";
                } else {
                    window.location.href = "index.html"; // fallback al dashboard
                }
            }, 1500);

        } else {
            // Cerrar alerta de carga y mostrar error
            Swal.fire({
                icon: 'error',
                title: 'Error de Login',
                text: data.message || 'Credenciales incorrectas',
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

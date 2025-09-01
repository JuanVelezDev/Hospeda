const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    Swal.fire({
        title: 'Iniciando Sesión...',
        text: 'Por favor espera',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Login Exitoso!',
                timer: 1500,
                showConfirmButton: false
            });

            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                if (data.user.role === "student") {
                    window.location.href = "./pages/students-serch/student.html";
                } else if (data.user.role === "owner") {
                    window.location.href = "./pages/owner-dashboard/owner_dashboard.html";
                } else {
                    window.location.href = "index.html";
                }
            }, 1500);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error de Login',
                text: data.message || 'Credenciales incorrectas'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor.'
        });
        console.error(err);
    }
});

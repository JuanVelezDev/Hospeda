const form = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            messageEl.style.color = "green";
            messageEl.textContent = "✅ Login exitoso. Redirigiendo...";

            // Guardar info en localStorage (opcional)
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirección según el rol
            setTimeout(() => {
                if (data.user.role === "student") {
                    window.location.href = "./pages/students-serch/student.html";
                } else if (data.user.role === "owner") {
                    window.location.href = "dashboard_owner.html";
                } else {
                    window.location.href = "dashboard.html"; // fallback
                }
            }, 1500);

        } else {
            messageEl.style.color = "red";
            messageEl.textContent = "❌ " + data.message;
        }
    } catch (err) {
        messageEl.style.color = "red";
        messageEl.textContent = "Error de conexión con el servidor.";
        console.error(err);
    }
});

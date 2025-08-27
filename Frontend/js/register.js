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

    try {
        const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name, last_name, email, password, role, phone })
        });

        const data = await res.json();

        if (res.ok) {
            messageEl.style.color = "green";
            messageEl.textContent = "✅ Registro exitoso. Ahora puedes iniciar sesión.";
            // setTimeout(() => window.location.href = "index.html", 1500);
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

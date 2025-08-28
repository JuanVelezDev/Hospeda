// student-serch/student.js

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Limpiar localStorage
        localStorage.removeItem("user");

        // Usar ruta absoluta para evitar problemas de navegación
        window.location.href = "../../index.html";
    });
});

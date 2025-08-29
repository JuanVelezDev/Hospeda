// student-serch/student.js

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const logoLink = document.getElementById("logoLink");

    // Funcionalidad del botón de logout
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Limpiar localStorage
        localStorage.removeItem("user");

        // Usar ruta absoluta para evitar problemas de navegación
        window.location.href = "../../index.html";
    });

    // Funcionalidad del logo para redirigir al landing page
    logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Siempre redirigir al landing page principal
        window.location.href = "../../index.html";
    });
});

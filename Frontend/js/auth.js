// auth.js - Manejo de autenticación y estado del usuario

// Verificar si el usuario está logueado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateUserInterface();
});

// Función para actualizar la interfaz según el estado de autenticación
function updateUserInterface() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userActions = document.querySelector(".user-actions");
    
    if (user) {
        // Usuario logueado - mostrar botón de logout y nombre
        userActions.innerHTML = `
            <span class="user-name">Hola, ${user.name}</span>
            <button class="btn btn-secondary" onclick="logout()">Cerrar Sesión</button>
        `;
    } else {
        // Usuario no logueado - mostrar botones de login/registro
        userActions.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Iniciar Sesión</a>
            <a href="register.html" class="btn btn-primary">Registrarse</a>
        `;
    }
}

// Función para logout
function logout() {
    localStorage.removeItem("user");
    window.location.reload();
}

// Función para verificar si el usuario está logueado
function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
}

// Función para obtener datos del usuario logueado
function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// Función para redirigir según el rol del usuario
function redirectByRole() {
    const user = getCurrentUser();
    if (!user) return;
    
    if (user.role === "student") {
        window.location.href = "./pages/students-serch/student.html";
    } else if (user.role === "owner") {
        window.location.href = "./pages/publish-property/index.html";
    }
}

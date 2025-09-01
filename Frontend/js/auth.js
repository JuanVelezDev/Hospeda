// Manejo de autenticación y estado del usuario

document.addEventListener("DOMContentLoaded", () => {
    updateUserInterface();
});

function updateUserInterface() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userActions = document.querySelector(".user-actions");

    if (user) {
        userActions.innerHTML = `
            <span class="user-name">Hola, ${user.name}</span>
            <button class="btn btn-secondary" onclick="logout()">Cerrar Sesión</button>
        `;
    } else {
        userActions.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Iniciar Sesión</a>
            <a href="register.html" class="btn btn-primary">Registrarse</a>
        `;
    }
}

function logout() {
    Swal.fire({
        title: '¿Cerrar Sesión?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#ff4757',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, Cerrar Sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("user");
            window.location.reload();
        }
    });
}

function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
}

function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

function redirectByRole() {
    const user = getCurrentUser();
    if (!user) return;

    if (user.role === "student") {
        window.location.href = "./pages/students-serch/student.html";
    } else if (user.role === "owner") {
        window.location.href = "./pages/publish-property/index.html";
    }
}

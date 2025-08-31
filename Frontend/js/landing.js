// landing.js - Manejo de la funcionalidad del landing page

// Función para verificar si el usuario está logueado
function isUserLoggedIn() {
    return localStorage.getItem("user") !== null;
}

// Función para redirigir al login
function redirectToLogin() {
    window.location.href = "login.html";
}

// Función para obtener el rol del usuario logueado
function getUserRole() {
    const user = localStorage.getItem("user");
    if (user) {
        const userData = JSON.parse(user);
        return userData.role;
    }
    return null;
}

// Función para mostrar mensaje de acceso denegado
function showAccessDeniedMessage(message) {
    Swal.fire({
        icon: "error",
        title: "Acceso Denegado",
        text: message,
        confirmButtonColor: '#ff4757',
        confirmButtonText: 'Entendido'
    }).then((result) => {
        redirectToLogin();
    });
}

// Función para manejar el clic en "Buscar Habitaciones"
function handleSearchRooms() {
    if (!isUserLoggedIn()) {
        // Si no está logueado, redirigir al login
        redirectToLogin();
        return;
    }

    const userRole = getUserRole();
    
    if (userRole === "student") {
        // Si es estudiante, permitir acceso a buscar habitaciones
        window.location.href = "pages/students-serch/student.html";
    } else if (userRole === "owner") {
        // Si es owner, denegar acceso y mostrar mensaje
        showAccessDeniedMessage("Acceso denegado. Solo los estudiantes pueden buscar habitaciones.");
    } else {
        // Rol no reconocido, redirigir al login
        redirectToLogin();
    }
}

// Función para manejar el clic en "Publicar Propiedad"
function handlePublishProperty() {
    if (!isUserLoggedIn()) {
        // Si no está logueado, redirigir al login
        redirectToLogin();
        return;
    }

    const userRole = getUserRole();
    
    if (userRole === "owner") {
        // Si es owner, permitir acceso a publicar propiedad
        window.location.href = "pages/publish-property/index.html";
    } else if (userRole === "student") {
        // Si es estudiante, denegar acceso y mostrar mensaje
        showAccessDeniedMessage("Acceso denegado. Solo los propietarios pueden publicar propiedades.");
    } else {
        // Rol no reconocido, redirigir al login
        redirectToLogin();
    }
}

// Función para manejar el clic en "Ver Detalles" de las propiedades destacadas
function handleViewDetails() {
    if (!isUserLoggedIn()) {
        // Si no está logueado, redirigir al login
        redirectToLogin();
        return;
    }

    const userRole = getUserRole();
    
    if (userRole === "student") {
        // Si es estudiante, permitir ver detalles de propiedades
        window.location.href = "pages/property-description/property_description.html";
    } else if (userRole === "owner") {
        // Si es owner, también puede ver detalles de propiedades
        window.location.href = "pages/property-description/property_description.html";
    } else {
        // Rol no reconocido, redirigir al login
        redirectToLogin();
    }
}

// Función para inicializar los event listeners
function initializeLandingPage() {
    const searchRoomsBtn = document.getElementById("searchRoomsBtn");
    const publishPropertyBtn = document.getElementById("publishPropertyBtn");
    const propertyDetailBtns = document.querySelectorAll(".property-btn");

    // Event listener para el botón "Buscar Habitaciones"
    if (searchRoomsBtn) {
        searchRoomsBtn.addEventListener("click", handleSearchRooms);
    }

    // Event listener para el botón "Publicar Propiedad"
    if (publishPropertyBtn) {
        publishPropertyBtn.addEventListener("click", handlePublishProperty);
    }

    // Event listeners para los botones "Ver Detalles" de las propiedades
    propertyDetailBtns.forEach(btn => {
        btn.addEventListener("click", handleViewDetails);
    });
}

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", initializeLandingPage);

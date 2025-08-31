// Owner Dashboard JavaScript
class OwnerDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
    }

    loadUserData() {
        const userData = localStorage.getItem('user');
        const userNameElement = document.querySelector('.profile span');
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (userNameElement && user.name) {
                    userNameElement.textContent = user.name;
                } else if (userNameElement && user.email) {
                    // Si no hay nombre, mostrar el email
                    userNameElement.textContent = user.email;
                }
            } catch (error) {
                console.error('Error al parsear datos del usuario:', error);
                if (userNameElement) {
                    userNameElement.textContent = 'Usuario';
                }
            }
        } else {
            // Si no hay datos de usuario, mostrar usuario genérico
            if (userNameElement) {
                userNameElement.textContent = 'Usuario';
            }
            console.log('No hay datos de usuario en localStorage');
        }
    }

    setupEventListeners() {
        // Event listener para el botón de logout
        const logoutBtn = document.querySelector('.fas.fa-sign-out-alt');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Event listeners para botones de aceptar/rechazar solicitudes
        const acceptButtons = document.querySelectorAll('.btn-accept');
        const declineButtons = document.querySelectorAll('.btn-decline');

        acceptButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleRequestAction(e, 'accept'));
        });

        declineButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleRequestAction(e, 'decline'));
        });

        // Event listeners para botones de editar/eliminar propiedades
        const editButtons = document.querySelectorAll('.edit');
        const deleteButtons = document.querySelectorAll('.delete');

        editButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePropertyAction(e, 'edit'));
        });

        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handlePropertyAction(e, 'delete'));
        });

        // Event listener para el botón de agregar nueva habitación
        const addRoomBtn = document.querySelector('.btn-primary');
        if (addRoomBtn) {
            addRoomBtn.addEventListener('click', () => this.handleAddRoom());
        }
    }

    handleLogout() {
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
                localStorage.removeItem('user');
                window.location.href = '../../index.html';
            }
        });
    }

    handleRequestAction(event, action) {
        const requestElement = event.target.closest('.request');
        const userName = requestElement.querySelector('strong').textContent;
        
        if (action === 'accept') {
            Swal.fire({
                title: '¿Aceptar Solicitud?',
                text: `¿Aceptar la solicitud de ${userName}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, Aceptar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica para aceptar la solicitud
                    console.log(`Solicitud aceptada para ${userName}`);
                    requestElement.style.opacity = '0.5';
                    requestElement.querySelector('.actions').innerHTML = '<span class="accepted">Aceptada</span>';
                    
                    Swal.fire(
                        '¡Aceptada!',
                        'La solicitud ha sido aceptada exitosamente.',
                        'success'
                    );
                }
            });
        } else if (action === 'decline') {
            Swal.fire({
                title: '¿Rechazar Solicitud?',
                text: `¿Rechazar la solicitud de ${userName}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, Rechazar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica para rechazar la solicitud
                    console.log(`Solicitud rechazada para ${userName}`);
                    requestElement.style.opacity = '0.5';
                    requestElement.querySelector('.actions').innerHTML = '<span class="declined">Rechazada</span>';
                    
                    Swal.fire(
                        'Rechazada',
                        'La solicitud ha sido rechazada.',
                        'info'
                    );
                }
            });
        }
    }

    handlePropertyAction(event, action) {
        const propertyCard = event.target.closest('.property-card');
        const propertyName = propertyCard.querySelector('h3').textContent;
        
        if (action === 'edit') {
            // Aquí iría la lógica para editar la propiedad
            console.log(`Editando propiedad: ${propertyName}`);
            // Redirigir a la página de edición
            // window.location.href = `../publish-property/index.html?edit=${propertyId}`;
        } else if (action === 'delete') {
            Swal.fire({
                title: '¿Eliminar Propiedad?',
                text: `¿Estás seguro de que quieres eliminar "${propertyName}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica para eliminar la propiedad
                    console.log(`Eliminando propiedad: ${propertyName}`);
                    propertyCard.style.opacity = '0.5';
                    setTimeout(() => {
                        propertyCard.remove();
                    }, 300);
                    
                    Swal.fire(
                        '¡Eliminada!',
                        'La propiedad ha sido eliminada exitosamente.',
                        'success'
                    );
                }
            });
        }
    }

    handleAddRoom() {
        // Redirigir a la página de publicar propiedad
        window.location.href = '../publish-property/index.html';
    }
}

// Inicializar el dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new OwnerDashboard();
});

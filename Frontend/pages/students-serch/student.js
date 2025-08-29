// student-serch/student.js

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const logoLink = document.getElementById("logoLink");
    const roomGrid = document.querySelector(".room-grid");

    // 🔹 Cargar apartamentos desde el backend
    async function loadApartments() {
        try {
            const response = await fetch("http://localhost:3000/apartment");
            const apartments = await response.json();

            roomGrid.innerHTML = ""; // Limpiar los que estaban quemados en el HTML

            apartments.forEach(apartment => {
                // Creamos la card dinámica
                const card = document.createElement("div");
                card.classList.add("room-card");

                card.innerHTML = `
                    <div class="room-image">
                        <img src="https://via.placeholder.com/400x250?text=No+Photo" alt="${apartment.title}">
                    </div>
                    <div class="room-info">
                        <h3 class="room-title">${apartment.title}</h3>
                        <p class="room-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${apartment.address}, ${apartment.city}
                        </p>
                        <div class="room-details">
                            <div class="price">$${apartment.price}/mo</div>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>4.5</span>
                            </div>
                        </div>
                        <button class="view-details-btn" data-id="${apartment.apartment_id}">
                            View Details
                        </button>
                    </div>
                `;

                roomGrid.appendChild(card);

                // 🔹 Cargar fotos de cada apartamento
                loadApartmentPhotos(apartment.apartment_id, card.querySelector(".room-image img"));
            });
        } catch (error) {
            console.error("Error cargando apartamentos:", error);
        }
    }

    // 🔹 Cargar fotos de un apartamento
    async function loadApartmentPhotos(apartmentId, imgElement) {
        try {
            const response = await fetch(`http://localhost:3000/apartment/${apartmentId}/photos`);
            if (!response.ok) return; // Si no hay fotos, queda el placeholder

            const photos = await response.json();
            if (photos.length > 0) {
                imgElement.src = photos[0].photo_url; // Mostrar la primera foto
            }
        } catch (error) {
            console.error(`Error cargando fotos del apto ${apartmentId}:`, error);
        }
    }

    // Cargar apartamentos al abrir la página
    loadApartments();

    // Funcionalidad del botón de logout
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "../../index.html";
    });

    // Funcionalidad del logo para redirigir al landing page
    logoLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../../index.html";
    });
});

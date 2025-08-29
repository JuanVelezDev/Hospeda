document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.property-form');
    const uploadArea = document.querySelector('.upload-area');
    const chooseFilesBtn = document.querySelector('.choose-files-btn');
    const fileInput = document.createElement('input');
    let selectedFiles = [];

    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';

    chooseFilesBtn.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#6b46c1';
        uploadArea.style.backgroundColor = '#f3f4f6';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', function () {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        selectedFiles = Array.from(files);
        if (selectedFiles.length > 0) {
            const uploadText = uploadArea.querySelector('h3');
            uploadText.textContent = `${selectedFiles.length} imagen(es) seleccionada(s)`;
            uploadArea.style.borderColor = '#10b981';
            uploadArea.style.backgroundColor = '#f0fdf4';
        }
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById('property-title').value.trim();
        const neighborhood = document.getElementById('neighborhood').value;
        const price = document.getElementById('monthly-price').value.trim().replace(/\D/g, '');
        const address = document.getElementById('full-address').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!title || !neighborhood || !price || !address || !description) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        try {
            // 1️⃣ Crear el apartamento en el back
            const apartmentResponse = await fetch('http://localhost:3000/apartment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1, // ⚡ Cambia por el ID real del usuario logueado
                    title,
                    description,
                    address,
                    city: neighborhood,
                    price
                })
            });

            const apartmentData = await apartmentResponse.json();
            if (!apartmentResponse.ok) throw new Error(apartmentData.message || "Error creando apartamento");

            const apartmentId = apartmentData.apartment_id;
            console.log("✅ Apartamento creado con ID:", apartmentId);

            // 2️⃣ Subir fotos (si hay)
            if (selectedFiles.length > 0) {
                for (let file of selectedFiles) {
                    const formData = new FormData();
                    formData.append('photo', file);
                    formData.append('description', title);

                    const photoResponse = await fetch(`http://localhost:3000/apartment/${apartmentId}/photo`, {
                        method: 'POST',
                        body: formData
                    });

                    const photoData = await photoResponse.json();
                    if (!photoResponse.ok) throw new Error(photoData.error || "Error subiendo foto");

                    console.log("📸 Foto subida:", photoData);
                }
            }

            alert('¡Propiedad publicada exitosamente!');
            form.reset();
            selectedFiles = [];
            const uploadText = uploadArea.querySelector('h3');
            uploadText.textContent = 'Subir imágenes de la propiedad';
            uploadArea.style.borderColor = '#d1d5db';
            uploadArea.style.backgroundColor = '#f9fafb';

        } catch (error) {
            console.error("❌ Error publicando:", error);
            alert("Hubo un error publicando la propiedad.");
        }
    });
});

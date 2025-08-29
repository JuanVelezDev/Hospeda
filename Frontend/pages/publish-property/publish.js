// Functionality for the property publication form
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM element references
    const form = document.querySelector('.property-form');
    const uploadArea = document.querySelector('.upload-area');
    const chooseFilesBtn = document.querySelector('.choose-files-btn');
    const fileInput = document.createElement('input');
    const logoutBtn = document.querySelector('.logout-btn');
    
    // Configure file input
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    
    // Event for logout button
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear user session from localStorage
        localStorage.removeItem("user");
        // Redirect to main landing page
        window.location.href = '../../index.html';
    });
    
    // Event for choose files button
    chooseFilesBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Event for upload area
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Event for drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#6b46c1';
        uploadArea.style.backgroundColor = '#f3f4f6';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // Event for file selection
    fileInput.addEventListener('change', function() {
        const files = this.files;
        handleFiles(files);
    });
    
    // Function to handle selected files
    function handleFiles(files) {
        if (files.length > 0) {
            // Here you can add logic to preview images
            // or send them to the server
            console.log(`${files.length} file(s) selected`);
            
            // Update upload area text
            const uploadText = uploadArea.querySelector('h3');
            uploadText.textContent = `${files.length} image(s) selected`;
            
            // Change style to show that there are files
            uploadArea.style.borderColor = '#10b981';
            uploadArea.style.backgroundColor = '#f0fdf4';
        }
    }
    
    // Event for form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const title = document.getElementById('property-title').value.trim();
        const neighborhood = document.getElementById('neighborhood').value;
        const price = document.getElementById('monthly-price').value.trim();
        const address = document.getElementById('full-address').value.trim();
        const description = document.getElementById('description').value.trim();
        
        if (!title || !neighborhood || !price || !address || !description) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
        
        // Here you can add logic to send the form to the server
        console.log('Form submitted:', {
            title,
            neighborhood,
            price,
            address,
            description
        });
        
        // Show success message
        alert('¡Propiedad publicada exitosamente!');
        
        // Reset form
        form.reset();
        
        // Reset upload area
        const uploadText = uploadArea.querySelector('h3');
        uploadText.textContent = 'Subir imágenes de la propiedad';
        uploadArea.style.borderColor = '#d1d5db';
        uploadArea.style.backgroundColor = '#f9fafb';
    });
    
    // Event for cancel button
    const cancelBtn = document.querySelector('.btn-secondary');
    cancelBtn.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.')) {
            form.reset();
            const uploadText = uploadArea.querySelector('h3');
            uploadText.textContent = 'Subir imágenes de la propiedad';
            uploadArea.style.borderColor = '#d1d5db';
            uploadArea.style.backgroundColor = '#f9fafb';
        }
    });
    
    // Auto-format price
    const priceInput = document.getElementById('monthly-price');
    priceInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            value = '$ ' + value;
        }
        e.target.value = value;
    });
    
    // Format price when page loads
    if (priceInput.value) {
        priceInput.value = '$ ' + priceInput.value.replace(/[^\d]/g, '');
    }
});

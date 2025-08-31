// Configuración de la API
const API_CONFIG = {
    // Detectar si estamos en desarrollo local o en producción
    getBaseUrl: () => {
        // Si estamos en localhost, usar el servidor local
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000';
        }
        
        // Si estamos en producción (Vercel), usar la URL de la API
        // La URL será la misma del dominio actual pero con /api
        return `${window.location.origin}/api`;
    },
    
    // URL base de la API
    baseUrl: null,
    
    // Inicializar la configuración
    init: () => {
        API_CONFIG.baseUrl = API_CONFIG.getBaseUrl();
        console.log('🌐 API Base URL:', API_CONFIG.baseUrl);
        console.log('📍 Current hostname:', window.location.hostname);
        console.log('🔗 Current origin:', window.location.origin);
    },
    
    // Función helper para hacer requests con mejor manejo de errores
    fetch: async (endpoint, options = {}) => {
        const url = `${API_CONFIG.baseUrl}${endpoint}`;
        console.log('🚀 Making request to:', url);
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            console.error('❌ API request failed:', error);
            console.error('🔗 Request URL:', url);
            throw error;
        }
    }
};

// Inicializar la configuración cuando se carga el script
API_CONFIG.init();

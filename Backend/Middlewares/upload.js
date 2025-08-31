import multer from "multer";

// Usamos almacenamiento en memoria para subir a Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

export default upload;
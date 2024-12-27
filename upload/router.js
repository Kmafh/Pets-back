const express = require("express");
const multer = require("multer"); // Middleware para manejar archivos
const cloudinary = require("cloudinary"); // Ruta a tu configuración de Cloudinary
const { v4: uuidv4 } = require("uuid"); // Para generar identificadores únicos

const router = express.Router();

// Configuración de Multer para recibir archivos en memoria
const storage = multer.memoryStorage(); // Guardar el archivo en memoria temporalmente
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ruta para subir imágenes
router.post("", upload.single("image"), async (req, res) => {
  try {
    const file = req.file; // Archivo recibido del cliente
    if (!file) {
      return res.status(400).json({ message: "No se envió ninguna imagen." });
    }
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`, {
        folder: 'uploads',
        public_id: uuidv4(),
      });
      res.status(200).json({ message: 'Imagen subida con éxito.', url: result.secure_url });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Ruta para manejar la subida de múltiples imágenes
router.post("/all", upload.array("images"), async (req, res) => {
  try {
    const files = req.files; // Archivos recibidos del cliente
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No se enviaron imágenes." });
    }

    // Subir todas las imágenes a Cloudinary
    const uploadPromises = files.map(file => {
      return cloudinary.uploader.upload(`data:image/jpeg;base64,${file.buffer.toString('base64')}`, {
        folder: 'uploads',
        public_id: uuidv4(), // Se genera un id único para cada imagen
      });
    });

    // Esperar a que todas las imágenes sean subidas
    const uploadResults = await Promise.all(uploadPromises);

    // Enviar la respuesta con las URLs de las imágenes subidas
    const imageUrls = uploadResults.map(result => result.secure_url);
    res.status(200).json({ message: 'Imágenes subidas con éxito.', urls: imageUrls });

  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});
module.exports = router;

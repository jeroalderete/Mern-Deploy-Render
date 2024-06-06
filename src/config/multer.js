import multer from "multer";

// Configuración de almacenamiento vacío ya que los archivos se subirán directamente a Cloudinary
const storage = multer.diskStorage({});

// Crear el uploader utilizando la configuración de almacenamiento
const uploader = multer({ storage });

export { uploader };

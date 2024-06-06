import path from "path" // utilizamos funciones nativas de nodejs
import { fileURLToPath } from "url" // traemos el modulo de js fillURLtopath




const __filename = fileURLToPath(import.meta.url)

// como no queremos traer utils.js sino todo lo que esta dentro de la carpeta views creamos otra constante


const __dirname = path.dirname(__filename)


// console.log(__filename) // nos trae la ruta donde esta utils.js

 console.log(__dirname) // nos trae la carpeta src


// exportamos dirname par que luego sea utilizado



export default __dirname;
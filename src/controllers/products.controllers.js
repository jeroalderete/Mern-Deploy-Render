import {request, response} from "express"
// no es necesario con javascript puro ya que express nos provee esos objetos
// import { request, response } from "express"; // Traerse los objetos  request y response sirven para especificar en Typescript que tipo de objeto es y permite autocompletado y demas
import { productModel } from "../models/productsModel.js";
import { getProductsServices, getProductByIdServices, addProductServices, deleteProductServices, updateProductServices, getProductByCodeService } from "../services/products.services.js";
// import ProductServices from '../services/products.services.js'
import { cloudinary } from "../config/cloudinary.js"
import { validFileExtension } from "../utils/validFileExtension.js";

//enviamos nuestro query a nuestro servicio

export const getProducts = async (req = request, res = response) => {
   try {
      // mediante el spread operator recuperamos  toda la query de nuestro Service
      const result = await getProductsServices({ ...req.query });
      return res.json({ result });
   } catch (error) {
      return res.status(500).json({ msg: "error al traer los productos" });
   }
};

export const getProductById = async (req = request, res = response) => {
   // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
   try {
      const { pid } = req.params;

      const producto = await getProductByIdServices({ ...req.params }) // recuperamos del params con spread operator  
      if (!producto) {
         // hago validacion por si no encuentro el producto
         return res.status(404).json({ msg: `el producto con id ${pid} no existe` });
      }
      return res.json({ producto });
   } catch (error) {
      console.log("no se pudo traer los productos");
      return res
         .status(500)
         .json({ msg: "Producto no encontrado, hablar con un administrador" });
   }
};

export const addProduct = async (req = request, res = response) => {
   // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
   try {
      const { title, description, price, code, stock, category } = req.body;

      if (!title, !description, !price, !code, !stock, !category) {
         return res.status(400).json({
            msg: `Los campos title, description, code, price, stock y category son obligatorios`
         });
      }

      const existeCode = await getProductByCodeService(code);

      // validacion si existe el codigo del producto para que no se repita

      if (existeCode) {
         return res.status(400).json({ msg: "el codigo ingresado ya existe en un producto" })
      }
      // Vaidacion de cloudinary
      // el uploader es el compresor de multer
      // si existe una imagen llamamos a cloudinary y utilizamos la funcion upload para cargar, como argumento le pasamos el path para que pueda tomar la ruta de la imagen
      if (req.file) {
      
         // validacion de extension de la imagen

         const isValidExtension =  validFileExtension(req.file.originalname);

         if(!isValidExtension){
            return res.status(400).json({msg: "la extension del archivo no es valida"})
         }


         const { secure_url } = await cloudinary.uploader.upload(req.file.path)
         req.body.thumbnail = secure_url;
      }

      console.log(req.file)


      const producto = await addProductServices({ ...req.body })
      return res.json({ producto });

   } catch (error) {
      return res
         .status(500)
         .json({
            msg: "Error al crear el producto, hablar con un administrador",
         });
   }
};

export const updateProduct = async (req = request, res = response) => {
   // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
   try {
      const { pid } = req.params;
      const { _id, ...rest } = req.body;

      const product = await getProductByIdServices({ pid })

      console.log("ACAA ID DE PRODUCTO", product)

      if (!product) {
         return res.status(404).json({ msg: `el producto con el id ${pid} no existe` })
      }

      // si existe una imagen
      if (req.file) {

      const isValidExtension = validFileExtension(req.file.originalname);

      if (!isValidExtension) {
         return res.status(400).json({ msg: "la extension del archivo no es valida, los formatos validos son png - jpg - jpeg" })
      }



         if (product.thumbnail) { // y si existe una imagen en un producto existente
            // reemplazar la url y a su vez eliminar la imagen anterior de cloudinary asi no se acumulan
            // con el split extraigo el id de cada imagen

            const url = product.thumbnail.split('/') // esto me devuelve un array
            // ['https:', '', 'res.cloudinary.com', 'dvrc38ei4', 'image', 'upload', 'v1717626253', 'njofdz26ngoguxopo9dx.webp' ]
            console.log(url)

            // a ese array quiero acceder al ultimo valor por eso el -1
            const nombre = url[url.length - 1] // obtengo la ultima posicionn

            // esto me devuelve un array de 2 elementos el id del producto y el png

            // https://res.cloudinary.com/dvrc38ei4/image/upload/v1717616225/---> pgm979e1zkenp3zt27ph   .  -->  png
            // como me devuelve un array puedo desetructurar los 2 elementos
            // recupero solo el id ya que es lo unico que me interesa
            const [id] = nombre.split('.')
            //una vez capturado por el id lo eliminamos en cloudinary
            cloudinary.uploader.destroy(id)
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            //utilizo rest ya que no quiero el id sino todo el resto de sus propiedades
            rest.thumbnail = secure_url;

         }

      }

      const updateProduct = await updateProductServices(pid, rest);

      if (updateProduct) {
         return res.json({
            msg: "Producto Actualizado exitosamente",
            updateProduct,
         });
      }
      return res
         .status(404)
         .json({ msg: `No se pudo actualizar el producto con id ${pid}` });
   } catch (error) {
      console.log("no se pudo actualizar el producto");
      return res
         .status(500)
         .json({
            msg: "Error al actualizar el producto, hablar con un administrador",
         });
   }
};

// Eliminar un producto por ID

export const deleteProduct = async (req = request, res = response) => {
   try {
      const { cid, pid } = req.params;
      // eliminar imagen de cloudinary cuando borramos producto
      const product = await getProductByIdServices({ pid })
      if (!product) {
         return res.status(400).json({ msg: "el producto no pudo ser eliminado" })
      }
      const deletedProduct = await deleteProductServices(pid);

      if (!deletedProduct) {
         return res.status(404).json({ msg: "error al eliminar el producto" })
      }

      const url = product.thumbnail.split('/')
      const nombre = url[url.length - 1]
      const [id] = nombre.split('.')

      try {
         await cloudinary.uploader.destroy(id);
         console.log(`Imagen con id ${id} eliminada de Cloudinary`);
      } catch (error) {
         console.error(`Error al eliminar la imagen de Cloudinary: ${error.message}`);
      }
      
      return res.json({
         msg: "Producto eliminado exitosamente",
         deletedProduct,
      });
   } catch (error) {
      console.log("No se pudo eliminar el producto", error);
      return res.status(500).json({ msg: "error al eliminar el producto" })
   }
};

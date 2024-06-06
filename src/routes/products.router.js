import { Router } from "express";
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/products.controllers.js";
import { uploader } from "../config/multer.js";

const productRouter = Router();

// obtengo todos los productos

productRouter.get('/', getProducts);

// obtengo producto por id
productRouter.get('/:pid', getProductById);

// crear un producto, especificamos que venga a traves de un campo que se llama file
productRouter.post('/', uploader.single('file'), addProduct);

// actualizar un producto

productRouter.put('/:pid', uploader.single('file'), updateProduct)

// borrar un producto
productRouter.delete('/:pid', deleteProduct)


export  {productRouter};
import {Router} from "express"
import {createCart, getCartById, addProductInCart, getCarts,deleteProductInCart, updateProductInCart, deleteCart} from "../controllers/carts.controllers.js"

const cartRouter = Router();


cartRouter.get('/', getCarts)

cartRouter.get('/:cid', getCartById)

cartRouter.post('/', createCart)

cartRouter.post('/:cid/products/:pid', addProductInCart)

cartRouter.delete('/:cid/product/:pid', deleteProductInCart)

cartRouter.put('/:cid/product/:pid', updateProductInCart)

cartRouter.delete('/:cid', deleteCart)


export {cartRouter}
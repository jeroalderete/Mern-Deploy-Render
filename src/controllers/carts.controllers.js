// import {cartModel} from "../models/cartModel.js"
import { addProductInCartServices, createCartServices, deleteCartServices, deleteProductInCartServices, getCartByIdServices, getCartsServices, updateProductInCartServices } from "../services/carts.services.js";

// nos traemos todos los carritos 

export const getCarts = async (req, res) => {
    try {
        const carts = await getCartsServices();
        if (carts && carts.length > 0) {
            return res.status(200).json({
                msg: "Carritos obtenidos exitosamente",
                carts
            });
        } else {
            return res.status(404).json({ msg: "No se encontraron carritos" });
        }
    } catch (error) {
        console.error("Error al traer los carritos:", error);
        return res.status(500).json({ msg: "Error al traer los carritos" });
    }
};

export const getCartById = async (req, res) => {
    // como vamos a llamar al modelo de nuestra base de datos como puede dar error l o hacemos en un try y un catch
    try {
        const { cid } = req.params; // recuperamos el id del carrito mediante el params
        const cart = await getCartByIdServices(cid) // buscamos el carrito en la collecion cart por el id del carrito

        if (cart) {
            return res.json({ cart })
        }

    } catch (error) {
        console.log("no se pudo traer el carrito");
        return res.status(500).json({ mssg: `el carrito con id ${req.params.cid} no existe` }) // no utilizamos cid porque esta fuera del scope, realizamos la solicitud al params accediendo dsps

    }
}


export const createCart = async (req, res) => {
    // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
    try {
        const cart = await createCartServices() // se va a crear nuestra coleccion con productos vacios por eso creamos un objeto vacio, para poder almacenar la data
        return res.json({ msg: 'carrito creado', cart })

    } catch (error) {
        console.log("no se pudo traer los productos");
        return res.status(500).json({ msg: "hablar con un administrador" });
    }
}


// agregamos un producto al carrito creado

export const addProductInCart = async (req, res) => {

    try {
        const { cid, pid } = req.params; // recuperamos el id del carrito y producto por params
        const cart = await addProductInCartServices(cid, pid) // buscamos por id del carrito en nuestra collecion de mongodb, utilizamos el metodo findById de mongoose

        // validamos si el carrito no existe para poder emitir un mensaje
        if (!cart) {
            return res.status(404).json({ msg: 'el carrito no existe', cart })
        }

        // retornamos un mensaje en postman
        return res.json({ msg: "carrito actualizado", cart })

    } catch (error) {
        console.log("no se pudo traer los productos");
        return res.status(500).json({ msg: "hablar con un administrador" });
    }

}


export const deleteProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const deletedProduct = await deleteProductInCartServices(cid, pid)

        if (!deletedProduct) {
            return res.status(404).json("error")
        } else {
            return res.json({ msg: "producto liminado", deletedProduct })
        }

    } catch (error) {
        console.log("error")
    }
}

export const updateProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!quantity || !Number.isInteger(quantity)) {
            return res.status(404).json({ msg: "la propiedad quantity es obligatoria y debe ser un numero entero" })
        }

        const carrito = await updateProductInCartServices(cid, pid, quantity);

        if (!carrito) {
            return res.status(404).json({ msg: 'no se pudo realizar la operacion' })
        }

        return res.json({ msg: "producto actualizado en el carrito", carrito })

    } catch (error) {
        return res.status(500).json({ msg: "error" })
    }
}

// DELET

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const carrito = await deleteCartServices(cid);

        if (!carrito) {
            return res.status(404).json({ msg: 'no se pudo realizar la operacion' })
        } else {
            return res.json({ msg: "producto actualizado en el carrito", carrito })
        }

    } catch (error) {
        console.log("error")
    }
}



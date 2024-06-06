import { cartModel } from "../models/cartModel.js";

// nos traemos todos los carritos

export const getCartsServices = async () => {
    try {
        const carts = await cartModel.find().lean(); // .lean() convierte un documento Mongoose a un objeto JavaScript plano
        return carts;
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        throw new Error("Error al obtener carritos");
    }
};

export const getCartByIdServices = async (cid) => {
    // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
    try {

        // populate se utiliza para obtener todos los detalles de los productos referenciados en el carrito. Nos traemos todas las propiedades del producto
        return await cartModel.findById(cid).populate('products.id').lean() // buscamos el carrito en la collecion cart por el id del carrito

    } catch (error) {
        console.log("no se pudo traer el carrito");
        throw new Error("Error");
    }
};

// creamos un carrito

export const createCartServices = async () => {
    // como vamos a llamar al modelo de nuestra base de datos como puede dar error lo hacemos en un try y un catch
    try {
        return await cartModel.create({}); // se va a crear nuestra coleccion con productos vacios por eso creamos un objeto vacio, para poder almacenar la dat
    } catch (error) {
        console.log("no se pudo traer los productos");
        throw new Error("Error");
    }
};

// agregamos un producto al carrito creado

export const addProductInCartServices = async (cid, pid) => {
    try {
        //  const cart = await cartModel.findById(cid) // buscamos por id del carrito en nuestra collecion de mongodb, utilizamos el metodo findById de mongoose
        //   const total = await cartModel.countDocuments();

        const [cart, total] = await Promise.all([
            cartModel.findById(cid),
            cartModel.countDocuments(),
        ]);
        // validamos si el carrito no existe para poder emitir un mensaje
        if (!cart) {
            return null;
        }
        const productInCart = cart.products.find((p) => p.id.toString() === pid);

        // si el producto en el carrito ya existe le aumento quantity en 1
        if (productInCart) {
            productInCart.quantity++;
        } else {
            // si el producto no existe en el carrito lo puseamos con su id y quantity en 1
            cart.products.push({ id: pid, quantity: 1 }); // realizamos un push
        }

        // guardamos los cambios realizados en el documento cart en la base de datos de mongodb
        await cart.save();

        // retornamos un mensaje en postman
        return { total, cart };
    } catch (error) {
        console.log("no se pudo traer los productos");
        throw new Error("Error");
    }
};

export const deleteProductInCartServices = async (cid, pid) => {
    try {
        // ejecutamos la funcion pull - que busque nuestra propiedad products y su id lo igualamos al recibido por params
        // el new:true significa que quiero que me retorne el nuevo objto actualizado
        const deletedProductInCart = await cartModel.findByIdAndUpdate(cid, { $pull: { 'products': { id: pid } } }, { new: true }); // utilizamos findByIdAndUpdate por que vamos a actualizar ese carrito
        // Si el carrito no se encuentra, retorna null
        if (!deletedProductInCart) {
            return null;
        }

        return deletedProductInCart;
    } catch (error) {
        console.log("no se pudo traer los productos");
        throw new Error("Error");
    }
};


export const updateProductInCartServices = async (cid, pid,quantity) => {

    try {

        return await cartModel.findOneAndUpdate(
            // busco el id de monngo una ves que lo encuentre voy a la propiedad products
            {_id:cid, 'products.id':pid},
            // una vez que lo enncuentro seteo ese quantity con el quantity recibido
            {$set: {'products.$.quantity':quantity}},
            // y devolvemos el nuevo objeto actualizaado
            {new:true}
        )
               
    } catch (error) {
        console.log("no se pudo traer los productos");
        throw new Error("Error");
    }
};



export const deleteCartServices = async (cid) => {
    try {
        // ejecutamos la funcion pull - que busque nuestra propiedad products y su id lo igualamos al recibido por params
        // el new:true significa que quiero que me retorne el nuevo objto actualizado



       //  const deletedProductInCart = await cartModel.findByIdAndUpdate(cid, { $set: { 'products': [] } }, { new: true }); // utilizamos findByIdAndUpdate por que vamos a actualizar ese carrito
        
       const deletedProductInCart = await cartModel.findByIdAndDelete(cid); // utilizamos findByIdAndUpdate por que vamos a actualizar ese carrito
  
       // Si el carrito no se encuentra, retorna null
        if (!deletedProductInCart) {
            return null;
        }

        return deletedProductInCart;
    } catch (error) {
        console.log("no se pudo traer los productos");
        throw new Error("Error");
    }
};


/* Ventajas de usar populate

    Simplicidad: Simplifica la obtención de datos relacionados en una sola consulta.
    Legibilidad: Hace que el código sea más legible y mantenible.
    Eficiencia: Reduce la necesidad de realizar múltiples consultas manuales, aunque puede tener impacto en el rendimiento si se abusa.

Consideraciones

    Rendimiento: Si los documentos referenciados son muchos, el uso de populate puede afectar el rendimiento. En estos casos, puede ser más eficiente hacer consultas separadas y manejar la combinación de datos en la aplicación.
    Proyección: Puedes limitar los campos devueltos por populate para mejorar el rendimiento y obtener solo los datos necesarios. 
    
    
    Supongamos que tienes dos modelos: User y Post. Cada Post tiene un campo author que es una referencia al User.
    
    
    const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});


const getPostWithAuthorDetails = async (postId) => {
    try {
        const post = await Post.findById(postId).populate('author');
        return post;
    } catch (error) {
        console.error("Error al obtener el post con detalles del autor:", error);
        throw new Error("Error al obtener el post con detalles del autor");
    }
};


obtenemkos detalles comletos del autor

{
    "_id": "60c72b2f9b1d4c23d8f61b08",
    "title": "Mi primer post",
    "content": "Este es el contenido de mi primer post.",
    "author": {
        "_id": "60c72b9f9b1d4c23d8f61b09",
        "name": "Juan Pérez",
        "email": "juan.perez@example.com"
    }
}

 
    
    */
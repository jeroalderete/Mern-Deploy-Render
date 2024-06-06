import {Schema, model} from "mongoose"

// definimos el nombre de la coleccion

const nameCollection = 'Producto';

// realizamos la estructura de nuestro producto para mongodb - el id no lo incluimos ya que mongo nos provee uno

const ProductoSchema = new Schema({
    title: {type: String, required: [true, 'el titulo del producto es obligatorio' ]       },
    description:  {type: String, required: [true, 'el description del producto es obligatorio' ] },
    price:  {type: Number, required: [true, 'el price del producto es obligatorio' ] },
    code:  {type: String, required: [true, 'el code del producto es obligatorio' ] },
    status: {type: Boolean, default: true},
    stock: {type: String, required: [true, 'el stock del producto es obligatorio' ] },
    category:  {type: String, required: [true, 'el category del producto es obligatorio' ] },
    thumbnail:  {type: String},
})

// removemos la propiedad __v cuando recibimos los productos en el json
ProductoSchema.set('toJSON', {
    transform: function(doc,ret){
        delete ret.__v;
        return ret;
    }
})





export const productModel = model(nameCollection, ProductoSchema)
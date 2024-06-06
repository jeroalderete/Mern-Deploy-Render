import { Schema, model } from "mongoose"


// definimos el nombre de la coleccion


const nameCollection = 'Cart';


// realizamos la estructura de nuestro producto para mongodb - el id no lo incluimos ya que mongo nos provee uno

const CartSchema = new Schema({

  products: [

    {
      _id: false, // le quito el id que me trae de mas  mongo
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
      },
      quantity: {
        type: Number,
        required: [true, 'La cantidad del produto es obligatorio']
      }


    }

  ]


})


CartSchema.set('toJSON', {
  transform: function(doc,ret){
      delete ret.__v;
      return ret;
  }
})

export const cartModel = model(nameCollection, CartSchema)
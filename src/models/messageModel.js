import {Schema, model} from "mongoose"


// definimos el nombre de la coleccion

const nameCollection = 'Message';


// realizamos la estructura de nuestro producto para mongodb - el id no lo incluimos ya que mongo nos provee uno

const MessageSchema = new Schema({

    user: {type: String, required: [true, 'el nombre del usuario es obligatorio' ]},
    message: {type: String, required: [true, 'el mensaje es obligatorio' ] }

})

export const messageModel = model(nameCollection, MessageSchema)
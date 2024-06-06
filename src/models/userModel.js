import { Schema, model } from "mongoose"


const nameCollection = "User";



/* const userSchema = new Schema({
    id: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true, // Asegura que el campo email sea único
      message: "email already registered", // Mensaje de error personalizado
    },
    firstName: String,
    lastName: String,
    profilePhoto: String,
    password: String,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() }
}); */ 
  

 const userSchema = new Schema({
    username: { type: String, unique: true, sparse: true },
    name: { type: String},
    lastName: { type: String},
    email: { type: String, required: [true, 'El email es obligatorio'], unique: false }, // asignamo unique en true para que no se pueda repetir ese email
    password: { type: String, required: [false , 'El password es obligatorio'] }, // esta string despues va a ser hasheada
    rol: { type: String, default: 'user', enum: ['user', 'admin'] }, // rol de usuario utilizando la propiedad enum, que serian los valores que va a permitir este parametro
    status: { type: Boolean, default: true }, // el status es por si quiero suspender el usuario en vez de eliminar el usuario, lo pongo en false
    fechaCreacion: { type: Date, default: Date.now }, // evitar ejecutar el date, por que sino la fecha se crea cuando se ejecuta el codigo y no cuando se crea el documento
    displayName: { type: String }, 
    googleId: { type: String, unique: true },
    profilePhoto: { type: String }  // Añadido campo image // Añadido campo displayName
}) 


// removemos la propiedad __v cuando recibimos los productos en el json
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
})


export const userModel = model(nameCollection, userSchema)

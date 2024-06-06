import mongoose from "mongoose"

// es asincrono por que devuelve una promesa

export const dbConnection = async () =>{
    try {
    await mongoose.connect(process.env.URI_MONGO_DB)
        console.log("connectados a MongoDB")
    } catch (error) {
        console.log(`error al levantar la base de datos ${error}`)
        process.exit(1); // si tira error con esto indico que no quiero que se siga ejecutando        
    }
}
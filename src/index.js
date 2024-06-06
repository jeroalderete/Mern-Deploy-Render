import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import { productRouter } from "./routes/products.router.js";
import { dbConnection } from "./database/config.js";
import { cartRouter } from "./routes/carts.router.js";
import  viewRouter  from "./routes/views.router.js";
// import { productModel } from "./models/productsModel.js";
import { messageModel } from "./models/messageModel.js";
import bodyParser from 'body-parser';
import 'dotenv/config';
import { addProductServices, getProductsServices, deleteProductServices } from "./services/products.services.js";
import initializePassport from "./config/passport.js";
import passport from "passport";

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
await dbConnection();


app.use(session({
   store: MongoStore.create({
      mongoUrl: `${process.env.URI_MONGO_DB}`, // seteamos nuestra url de mongo db
      ttl: 3600                // esto es el tiempo de expiracion de la session
   }),
   secret: process.env.SECRET_SESSION,               // generamos un secret random puede contener cualquier caracter
   resave: false,                 // parametros por default
   saveUninitialized: true      // parametro por default
}))

// RUTA DE LOGIN

app.get(
   "/auth/google/callback",
   passport.authenticate("google", {
     successRedirect: "http://localhost:6005/",
     failureRedirect: "http://localhost:3000/login",
   })
 );


 app.get(
   "/auth/google",
   passport.authenticate("google", { scope: ["profile", "email"] })
 );
 
 
 // RUTA DE LOGIN
 
 app.get(
   "/auth/google/callback",
   passport.authenticate("google", {
     successRedirect: "http://localhost:3000/dashboard",
     failureRedirect: "http://localhost:3000/login",
   })
 );
 
 app.get("/login/sucess", async (req, res) => {
   if (req.user) {
     res.status(200).json({ message: "user Login", user: req.user });
   } else {
     res.status(400).json({ message: "Not Authorized" });
   }
 });




// CONFIG PASSPORT 

initializePassport();
app.use(passport.initialize())
app.use(passport.session())


const expressServer = app.listen(PORT, (req, res) => {
   console.log(`servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(expressServer);

// utilizamos el endpoint para el router
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);


// seteamos el enrutamiento de la carpeta public
app.use(express.static(__dirname + "/public"));

//estructura de handlebars

app.engine("handlebars", engine()); // le decimos a nuestro server que vamos a utiilzar handlebars y esta se va a ejecutra con la funcion engine importada arriba
app.set("view engine", "handlebars"); // tenemos que decir que nuestros view engine van a tener como extension de los archivos el formato handlebars
app.set("views", __dirname + "/views");

// Conexión de Socket.IO

io.on("connection", async (socket) => {
   try {

      // Products Rendering
      const { payload } = await getProductsServices({}); // paso un objeto vacio donde se almavena toda la info
      const productos = payload;
      socket.emit("productos", payload);

      // AGREGO PRODUCTOS CON SOCKET IO
      socket.on("agregarProductos", async (producto) => {
         try {
            //  const newProduct = await productModel.create({ ...producto });
            const newProduct = await addProductServices({ ...producto })
            console.log({ newProduct });

            if (newProduct) {
               // Obtener la lista de productos actualizada
               productos.push(newProduct)
               // Emitir la lista actualizada a todos los clientes
               io.emit("productos", productos);
            }
         } catch (error) {
            console.error("Error al agregar producto: ", error);
         }
      });
   } catch (error) {
      console.error("Error al obtener productos: ", error);
   }


   // ELIMINAR PRODUCTO
   socket.on("eliminarProducto", async (_id) => {
      try {
         // const eliminado = await productModel.findByIdAndDelete(_id);
         const eliminado = await deleteProductServices(_id);
         if (eliminado) {
            console.log("Producto eliminado exitosamente:", eliminado);
            // Emitir evento de confirmación al cliente que solicitó la eliminación
            socket.emit("productoEliminado", { msg: "Producto eliminado exitosamente" });
            // Actualizar lista de productos para todos los clientes
            // const productosActualizados = await productModel.find().lean();
            const productosActualizados = await getProductsServices({});
            io.emit("productos", productosActualizados);
         } else {
            console.log("Producto no encontrado");
            // Emitir evento de error al cliente que solicitó la eliminación
            socket.emit("errorEliminarProducto", { msg: "Producto no encontrado" });
         }
      } catch (error) {
         console.error("Error al eliminar producto:", error);
         // Emitir evento de error al cliente que solicitó la eliminación
         socket.emit("errorEliminarProducto", { msg: "Error al eliminar producto" });
      }
   });


   // Chat Message 

   const messages = await messageModel.find()
   socket.emit("message", messages)


   // cuando me envien algo del fronto lo voy a ecuchar


   socket.on('message', async (data) => {

      const newMessage = await messageModel.create({ ...data })

      if (newMessage) {
         const messages = await messageModel.find()
         io.emit("messageLogs", messages)
      }
   })

   socket.broadcast.emit('nuevo_user', {
      message: 'Nuevo usuario se ha conectado'
   });

});


import { request, response } from "express"
import { addProductServices, getProductByCodeService, getProductsServices } from "../services/products.services.js";
import { getCartByIdServices } from "../services/carts.services.js";
import { getUserEmail, registerUser } from "../services/user.services.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { cloudinary } from "../config/cloudinary.js";
import { validFileExtension } from "../utils/validFileExtension.js";
// @ts-ignore ---------> DESACTIVA TS
export const homeView = async (req = request, res = response) => {

   const { payload } = await getProductsServices({}); // extraemos todos los productos del payload

   // recupero el user de la sesion

   const userIsAuthenticated = req.session.user;

   // devuelve un booleano true o false - esto lo utilizamos en nuestra app  como parametro
   // const isAuthenticated = req.session.user !== undefined // esto toma la session y pregunta si es diferente a undefined
   return res.render("home", {
      productos: payload,
      title: "Home",
      userIsAuthenticated,
   });
};

export const realTimeProductsView = async (req = request, res = response) => {

   const productos = await getProductsServices({ ...req.query });
   const userIsAuthenticated = req.session.user;
   return res.render("realtimeProducts", { productos, userIsAuthenticated });
};

export const chatView = async (req = request, res = response) => {

   const userIsAuthenticated = req.session.user;
   return res.render("chat", { title: "Chat Page", userIsAuthenticated });
};

export const productsView = async (req = request, res = response) => {
   // pasamos toda las propiedades de los productos por query params
   const userIsAuthenticated = req.session.user; // Eliminé el await aquí
   console.log(userIsAuthenticated + "IS AUTHENTICATED EN PRODUCTVIEW");
   const result = await getProductsServices({ ...req.query });
   return res.render("products", {
      title: "productos",
      userIsAuthenticated,
      result,
   });
};

export const addProductView = (req = request, res = response) => {

   const userIsAuthenticated = req.session.user;
   return res.render("addProduct", {
      title: "Agregar Producto",
      userIsAuthenticated,
   });
};

export const addProductViewPost = async (req = request, res = response) => {
   const { title, description, price, code, stock, category } = req.body;

   if (!title || !description || !price || !code || !stock || !category) {
      return res.status(404).json({
         msg: `Los campos title, description, code, price, stock y category son obligatorios`
      });
   }

   const existeCode = await getProductByCodeService(code);

   // validacion si existe el codigo del producto para que no se repita

   if (existeCode) {
      return res.status(400).json({ msg: "el codigo ingresado ya existe en un producto" })
   }
   // Vaidacion de cloudinary
   // el uploader es el compresor de multer
   // si existe una imagen llamamos a cloudinary y utilizamos la funcion upload para cargar, como argumento le pasamos el path para que pueda tomar la ruta de la imagen
   if (req.file) {

      const isValidExtension = validFileExtension(req.file.originalname);

      if (!isValidExtension) {
         return res.status(400).json({ msg: "la extension del archivo no es valida" })
      }



      const { secure_url } = await cloudinary.uploader.upload(req.file.path)
      req.body.thumbnail = secure_url;
   }

   console.log(req.file)


   await addProductServices({ ...req.body })
   return res.redirect('/products')

};

export const cartIdView = async (req = request, res = response) => {
   const { cid } = req.params;

   const userIsAuthenticated = req.session.user;

   console.log("id del carrito", cid);
   const carrito = await getCartByIdServices(cid);
   return res.render("cart", {
      title: "carrito",
      carrito,
      userIsAuthenticated,
   });
};

export const loginView = async (req = request, res = response) => {

   const isUserAuthenticated = req.session.user;
   if (isUserAuthenticated) {
      return res.redirect("/");
   } else {
      return res.render("login", { title: "login" });
   }
};

export const registerView = async (req = request, res = response) => {

   const isUserAuthenticated = req.session.user;
   if (isUserAuthenticated) {
      return res.redirect("/");
   } else {
      return res.render("register", { title: "register" });
   }
};

export const registerPostView = async (req = request, res = response) => {
   try {
      if (!req.user) {
         return res.redirect("/register");
      }
      return res.redirect("/login");
   } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.redirect("/register");
   }
};

/* export const registerPostView = async (req, res) => {
   // vamos a extraer del body los campos del formulario
   const { username, name, lastName, email, password, confirmPassword } =
      req.body; // extraemos los valores password y confirmPassword del atributo name="" en la etiqueta html

   console.log({ name, password, confirmPassword });
   // Validar que los campos no estén vacíos
   if ( !username || !name || !lastName || !email || !password || !confirmPassword ) {
      console.log("Todos los campos son requeridos");
      return res.redirect("/register");
   }

   // Validamos si las contraseñas no coinciden
   if (password !== confirmPassword) {
      console.log(
         "El usuario no se ha podido registrar ingrese contrasenas iguales"
      );
      // te redirijo de nuevo hasta que las pongas bien
      return res.redirect("/register");
   }
   
   // return res.alert('ingreso mal las claves')

   try {
      const existingUser = await getUserEmail(email);

      if (existingUser) {
         console.log("El nombre de usuario ya está en uso");
         return res.redirect("/register");
      }

      // de lo contrario si voy a guardar ese ususario en la base de datos
      // Si el username no existe, registrar el nuevo usuario
      // Registrar el nuevo usuario

      const user = await registerUser({
         username,
         name,
         lastName,
         email,
         password: createHash(password)   // CREAMOS EL HASH  Y LE PASAMOS POR PARAMETRO PASSWORD RECUPERADO DEL BODY
      });
      if (user) {
         const userName = `${user.name} ${user.lastName}`;
         req.session.user = userName;
         req.session.rol = user.rol;

         console.log("El Usuario se ha registrado con éxito", user);
         return res.redirect("/");
      }
   } catch (error) {
      console.error("Error al registrar el usuario:", error);
      return res.redirect("/register");
   }
}; */

// el login es muy parecido -    if(req.user){ return res.redirect('/login') }

export const loginPostView = async (req = request, res = response) => {
   try {
      // Verifica si el usuario está autenticado correctamente
      if (!req.user) {
         // Si el usuario no está autenticado, redirige a la página de inicio
         return res.redirect("/login");
      }

      // Si el usuario está autenticado correctamente, guarda la sesión

      req.session.user = {
         name: req.user.name,
         lastName: req.user.lastName,
         email: req.user.email,
         rol: req.user.rol,
      };

      // Redirige al usuario a una página apropiada después del login exitoso
      return res.redirect("/"); // Por ejemplo, redirige al usuario a su panel de control o a alguna página principal de la aplicación
   } catch (error) {
      // Maneja cualquier error que pueda ocurrir durante el proceso de login
      console.error("Error en el proceso de login:", error);
      return res.redirect(
         "/login?error=Ocurrió un error durante el proceso de login"
      );
   }
};

/* export const loginPostView = async (req, res) => {
   // vamos a extraer del body los campos del formulario
   const { email, password } = req.body; // extraemos los valores email y password del atributo name="" en la etiqueta html
   // utilizo nuestro servicio getUserEmail
   const user = await getUserEmail(email); // nos traemos toda la data del body

   console.log(email, password.user);

   //validamos en el caso de que exista el user
   // validamos tambien que su contrasena sea igual a la password de la base de datos
   if (user) {

      if (isValidPassword(password, user.password)) {
         const userName = `${user.name} ${user.lastName}`;
         req.session.user = userName;
         req.session.rol = user.rol;
         console.log("Bienvenido!!!");
         return res.redirect("/");
      }
   }

   console.log({ user });

   // si njo existre el user redirijo ??

   return res.redirect("/login");

   // falta validacion por si el email existe y mas validaciones
}; */

export const logout = async (req = request, res = response) => {
   req.session.destroy((err) => {
      if (err) {
         return res.send({ status: false, body: err });
      } else {
         // redireccionamos al login por default si no esta logeado
         return res.redirect("/login");
      }
   });
};

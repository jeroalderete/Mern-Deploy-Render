import { Router } from "express";
// import { getProductsServices } from "../services/products.services.js"
import { getCartByIdServices } from "../services/carts.services.js";
import {
    cartIdView,
    chatView,
    homeView,
    productsView,
    addProductView,
    realTimeProductsView,
    loginView,
    registerView,
    loginPostView,
    registerPostView,
    logout,
    addProductViewPost,
} from "../controllers/views.controllers.js";
// import { productModel } from "../models/productsModel.js"
import { adminAuth, auth } from "../middleware/auth.js";
import passport from "passport";
import { uploader } from "../config/multer.js";

const viewRouter = Router();

viewRouter.get("/", homeView);
viewRouter.get("/realtimeproducts", [auth,adminAuth], realTimeProductsView); // en el array puedo importar muchos middlewares
viewRouter.get("/chat", auth, chatView);
viewRouter.get("/products", auth, productsView);
viewRouter.get('/add-product',auth, addProductView)

viewRouter.post('/add-product',[auth, uploader.single('file')],addProductViewPost )
viewRouter.get("/cart/:cid", auth, cartIdView);


viewRouter.get("/login", loginView);
viewRouter.get("/register", registerView);
viewRouter.get("/logout", logout);

// viewRouter.post("/register", registerPostView);
// viewRouter.post("/login", loginPostView);

viewRouter.post('/register', passport.authenticate('register',{failureRedirect: '/register'}), registerPostView)
viewRouter.post('/login', passport.authenticate('login',{failureRedirect: '/login'}), loginPostView)

// export { viewRouter };

export default viewRouter

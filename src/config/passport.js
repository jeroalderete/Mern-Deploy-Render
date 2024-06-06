import passport from "passport";
import * as local from "passport-local";
import { Strategy as GoogleOAuth2Strategy } from "passport-google-oauth2";
import dotenv from "dotenv"

import { createHash, isValidPassword } from "../utils/bcrypt.js"
import { getUserById, getUserEmail, registerUser, addGoogleUser,getUsersByEmail } from "../services/user.services.js";
import { userModel } from "../models/userModel.js";


dotenv.config()

// creamos esto que es parte de la configuracion
// LocalStrategy es una estrategia de autenticación diseñada para autenticar a los usuarios utilizando un nombre de usuario y 
// una contraseña en una base de datos local o en algún otro tipo de almacenamiento de datos.

const LocalStrategy = local.Strategy;
const OauthGoogleStrategy = GoogleOAuth2Strategy.Strategy

// para empezar a usarlos hay que crear middlwares para register y login

const initializePassport = () => {

    // CREDENCIALES GOOGLE APP

    const GoogleId = process.env.GOOGLE_ID
    const GoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET


    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, // email campo a evaluar, lo damos en el formulario 
        // recibimo req, username password y done es un callback
        async (req, username, password, done) => {
            // tyc ya que trabajamos con bd
            try {
                const { confirmPassword } = req.body; //extraemos el confirmpassword para validar ambas clave
                if (password !== confirmPassword) {
                    console.log("no coinciden las claves")
                    return done(null, false) // devuelvo el callback un null y false
                }
                // en caso contrario voy a hacer un apeticion a la bd para er si exisre el usuario
                const user = await getUserEmail(username) // esta funcion va a ir a buscar por el campo email en la base de datos por que espeficiamos que el usernamefield es email ahi arriba
                // validamos si existe el usuario retornamos false
                if (user) {
                    console.log("el usuario ya existe")
                    return done(null, false)
                }
                // vamos a crear un hash para la clave cuando se registre
                req.body.password = createHash(password)

                // tengo que crear el usuario  en la bd
                const newUser = await registerUser({ ...req.body })
                //valido si existe un nuevo usuario
                if (newUser) {
                    return done(null, newUser)
                }
                // sino exite es que ocurrio un error en la db
                return done(null, false)

            } catch (error) {
                req.logger.fatal(`Error al registrar usuario ${error}`);
                // mando un error a traves del callback
                return done(`Error al registrar usuario ${error}`);
            }
        }
    )
    );

    /* ------------------------------------------------------ */

    // el middleware login sera llamado en router 'login'
    passport.use('login', new LocalStrategy({ usernameField: "email" },
        async (username, password, done) => {
            try {
                const user = await getUserEmail(username);

                if (!user) {
                    console.log("el usuario no existe")
                    done(null, false)
                }
                if (!isValidPassword(password, user.password)) {
                    console.log("las paswrod no coinciden")
                    return done(null, false)

                }

                return done(null, user)

            } catch (error) {
                done(error)
            }
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id) // tomamos solo el _id  de mongo del user
    })

    // pasamos ese id que serializamos
    passport.deserializeUser(async (id, done) => {

        const user = await getUserById(id)
        done(null, user)
    })


    /* ------------------------------------------------------ */

/*
   
    passport.use(
        new OauthGoogleStrategy(
            {
                callbackURL: process.env.CALLBACK_URL,
                clientID: GoogleId,
                clientSecret: GoogleClientSecret,
                callbackURL: "/auth/google/callback",
                scope: ["profile", "email"],
            },
            async (accessToken, refreshToken, profile, done) => {


                // const id = profile.id;
                const email = profile.emails[0].value;
                const name = profile.name.givenName;
                const lastName = profile.name.familyName;
                const profilePhoto = profile.photos[0].value;
                const source = "google";
    
                try {
                    const currentUser = await getUsersByEmail(email);
                    if (!currentUser) {
                        const newUser = await addGoogleUser(
                            //id,
                            email,
                            name,
                            lastName,
                            profilePhoto
                        );
                        return done(null, newUser);
                    }
                    if (currentUser.source !== "google") {
                        // return error
                        return done(null, false, { message: "You have previously signed up with a different signin method" });
                    }
    
                    currentUser.lastVisited = new Date();
                    return done(null, currentUser);
                } catch (error) {
                    console.error("Error during Google OAuth:", error);
                    return done(error, null);
                }
            }
        )
    );

*/
    /* 
    passport.use(
        new OauthGoogleStrategy(
            {
                clientID: GoogleId,
                clientSecret: GoogleClientSecret,
                callbackURL: "/auth/google/callback",
                 scope: ["profile", "email"],
            },
            async (accessToken, refreshToken, profile, done) => {


                try {
                    let user = await userModel.findOne({ googleId: profile.id });

                    if (!user) {
                        const email = profile.emails[0].value;

                        if (!email) {
                            console.log("Google account does not have an email");
                            return done(null, false);
                        }

                        const newUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: email,
                            photo: profile.photos[0].value
                        };

                        user = await userModel.create(newUser);
                        console.log("Creating new user");
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    ); */ 


   






}

export default initializePassport;

/* 

La función serializeUser se utiliza para determinar qué datos del usuario deben almacenarse en la sesión. Su objetivo es tomar la
 información del usuario que se recibe del proceso de autenticación y almacenar solo la información necesaria para identificar al 
 usuario en las solicitudes subsecuentes.

En la mayoría de los casos, esto implica almacenar el ID del usuario en la sesión. Por ejemplo:




*/


/* En Passport.js, LocalStrategy es una estrategia de autenticación diseñada para autenticar a los usuarios utilizando un nombre de usuario y 

una contraseña en una base de datos local o en algún otro tipo de almacenamiento de datos. Cuando creas una instancia de LocalStrategy mediante new LocalStrategy, 

   estás configurando Passport para usar esta estrategia de autenticación. Aquí hay una descripción de lo que hace:

    Inicialización de la estrategia: Al crear una nueva instancia de LocalStrategy, estás inicializando esta estrategia de autenticación en tu aplicación.

    Configuración de la estrategia: LocalStrategy necesita una función de verificación que Passport usará para verificar las credenciales del usuario. Esta función de verificación debe tomar el nombre de usuario y la contraseña como argumentos, y luego llamar a un callback con el resultado de la autenticación.

    Uso de la estrategia en Passport: Después de crear una instancia de LocalStrategy, debes configurar Passport para usar esta estrategia. Esto se hace mediante el método passport.use().*/ 


export const auth = (req,res,next) =>{

    if(req.session?.user){
        // si existe una sesion del usuario lo dejo pasar
        return next();
    }else{
        // hacemos redirect al login por que queremos autenticar que este logeado para pasar
        return res.redirect('/login')
    }
}

export const adminAuth = (req,res, next) =>{

    if(req.session?.rol === "admin"){

        return next();

    }else{
        return res.redirect('/login')
    }

} 



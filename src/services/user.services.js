import mongoose from 'mongoose';
import {userModel} from "../models/userModel.js";

export const getUsersByEmail = async (email) => {
    try {
        return await userModel.findOne({ email });
    } catch (error) {
        console.error("getUsersByEmail ---->", error);
        throw error;
    }
};

export const addGoogleUser = async (id, email, firstName, lastName, profilePhoto) => {
    try {
        console.log(id, email, firstName, lastName, profilePhoto);
        const user = new userModel({
            googleId: id,
            email,
            firstName,
            lastName,
            profilePhoto,
            source: "google"
        });
        return await user.save();
    } catch (error) {
        console.error("addGoogleUser ---->", error);
        throw error;
    }
};

export const getUserByGoogleId = async (googleId) => {
    try {
        if (typeof googleId !== 'string' || googleId.trim() === '') {
            throw new Error(`Invalid googleId: ${googleId}`);
        }

        const user = await userModel.findOne({ googleId });
        return user;
    } catch (error) {
        console.error(`Failed to get user by googleId: ${googleId}`, error);
        throw new Error(`Unable to retrieve user: ${error.message}`);
    }
};


export const getUserById = async (id) =>{
    try {
        return await userModel.findById(id)  
    } catch (error) {
        console.log("no se pudo obtener el usuario por id")
        throw error;
    }
}

// voy a validar si el usermail existe 
export const getUserEmail = async(email) => {
    try {
        //hacemos la consulta al modelo para que nos busque el email en la bd comparando al que le paso por parametro,  si no lo encuentra devuelve undefined
        return await userModel.findOne({email})
    } catch (error) {
        console.log("getUserMail ---->", error)
        throw error;
    }
}


// en esta funcion se registran todos los datos del uduario nombre email password etc
export const registerUser = async(user) => {
    try {
        //hacemos la consulta al modelo para que nos busque el email en la bd comparando al que le paso por parametro,  si no lo encuentra devuelve undefined
        return await userModel.create({...user}) // con el spead operator le paso todos los valores que vienene de ese objeto
    } catch (error) {
        console.log("getUserMail ---->", error)
        throw error;
    }
}
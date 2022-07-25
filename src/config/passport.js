import passport from 'passport';
const LocalStrategy=require('passport-local').Strategy;
import {sequelize} from "../database/conexion.js";

import {encryptPassword, matchPassword}from '../helpers/encrypterpass.js'
import {Usuario} from '../models/Usuario.js'
// import {Alumno} from '../models/alumno.js'

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'

},async(email, password, done)=>{
    //si existe el correo
   const user= await Usuario.findOne({ where: { email: email } })
//    console.log('usuario existe', user.toJSON());
    if(!user){
        console.log('control 1')
        return done(null, false, {message: "El usuario no existe"})
    }else{
       let match = await matchPassword(password, user.password);
        if(!match){
            console.log('archivo passport - contraseñas no coinciden')
        return done(null, false, {message: "Contraseña incorrecta"})
        }else{
            console.log('control3 - Estrategia passport creada')
            return done(null, user)
        }
    }
}));

passport.serializeUser((user, done)=>{
    console.log('serializado ok con passport')
    done(null, user.id)
})

passport.deserializeUser(async(id, done)=>{
    const user =await Usuario.findOne({ where: { id: id }})  
    console.log('Deserializdo ok con passport')
    if(user){
        done(null, user)
    // }else{
    //     const alum =await Alumno.findOne({ where: { id: id }}) 
    //     console.log('Deserializdo ok como alumno con passport')
    //     if(alum){
    //         done(null, alum)
    //     }
}
}) 
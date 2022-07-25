import {pool} from '../database/conexion.js'
import { encryptPassword, matchPassword } from "../helpers/encrypterpass.js";
import path from 'path'
import passport from 'passport'
import {Usuario} from '../models/Usuario.js'
import {Producto} from '../models/Productos.js'
import {Rol} from '../models/rol.js'
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
moment.locale('es');
import sharp from "sharp";

export const login=(req, res)=>{
 res.render('index')
}

//probando sequelize
export const consultarusuario=async (req, res)=>{
  
const {id}=req.body;

let user= await Usuario.findOne({where: {id: id}})

res.json(user)

}

//para crear un administraor de sistemas con postman
export const crearAdmin=async (req, res)=>{
try {
    const { email } = req.body;
    req.body.id=uuidv4();
   const user= await Usuario.findOne({ where: { email: email } })
 
    if(user){
        req.flash("error", "el usuario ya existe")
        return res.json({message: "El usuario ya existe"})
    };
    let id_rol= parseInt(req.body.id_rol);
    const newUser= await Usuario.create(req.body)
    req.flash('message', 'Usuario registrado con éxito')
    res.json({message: "usuario registrado con éxito"})
} catch (error) {
    req.flash("error", "Ha ocurrido un error en el servidor");
    res.json({message: "Ha ocurrido un error en el servidor"})
}
};

export const crearBodeguero=async (req, res) =>{
    let errors=[];
    const {nombre, apellido, email, password, password2}=req.body

    if (password != password2) {
    errors.push({ text: "Las contraseñas no coinciden" });
    }
    if (password.length < 4) {
    errors.push({ text: "Las contraseñas deben tener mas de 4 digitos" });
    }
    req.body.id_rol=2
    req.body.id=uuidv4()
    const user= await Usuario.findOne({where: {email: email, id_rol: 2}})
    if(user){
        req.flash("error", "El funcionario ya está registrado")
        return res.json({message: "El funcionario ya está registrado"})
    }


    if(errors.length>0) { 
        let errores=errors.map(el=>`${el.text}`).join('. ')
        req.flash('error', errores)
        res.redirect('/admin')
    
    }else{
        let newUser=await Usuario.create(req.body)
        req.flash("success_msg","Funcionario creado con éxito")
        res.redirect(('/admin'))
    }
    
};

export const createProduct=async (req, res) =>{
    const {producto, descripcion, precio, url_img, cantidad}=req.body
   req.body.id=uuidv4()
//    console.log('req.file==>',req.file)
   req.body.url_img=req.file.filename.replace(path.extname(req.file.filename),'.png')
   req.body.stock=cantidad
//    console.log('Req.body==>', req.body)

    let ruta = __dirname.replace("controllers", "public/img/products");
    sharp(req.file.path)
        .resize(190,192)
        .toFormat('png', {palette: true})
        .toFile(ruta + `/${req.file.filename.replace(path.extname(req.file.filename),'.png')}`)
        .then(async (data) => {
          const newProduct = await Producto.create(req.body);
          req.flash("success_msg", "Producto guardado con éxito");
          res.redirect("/productos");
        })
        .catch((err) => {
          console.log(err.message);
        });
};

export const tienda=async (req, res) =>{

    const productos=await Producto.findAll()
    res.render('tienda',{
        productos
    })
};

export const updatestock=async (req, res) =>{
    console.log('PAra actualizar', req.body)
    const {id, cantidad, precio}=req.body

    const product=await Producto.findByPk(id)
    product.precio=precio;
    product.stock=parseInt(cantidad);
    await product.save()
    
    req.flash('success_msg', "Stock actualizado con éxito")
    res.redirect('/productos')
}


export const stock=async (req, res) =>{
    const productos=await Producto.findAll();
    console.log('Productos==>', JSON.stringify(productos, null, 2))
    res.render('productos',{
        productos
    })
}

export const userlogout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
  };


export const validar=passport.authenticate('local',{
    failureRedirect:'/login',
    successRedirect:'/productos',
    failureFlash: true
})

export const LogAdmin=async(req, res) => {
    if(req.user.id_rol==1){
    try{
        const user= await Usuario.findOne({where: {id: req.user.id}})
        let roles=["Administrador de sistemas", "Supervisor", "Docente", "Alumno"]
        let ultimoAcceso= moment(user.updateAt).format('LLL')
    
        res.render("admin",{
            user,
            rol: roles[user.id_rol-1],
            ultimoacceso:ultimoAcceso
        })
    }catch(e){
        console.log(e)
        res.redirect('/login')
    }
    }else{
        req.flash('error', 'No estas autorizado. Contacta con el administador de sistemas')
        res.redirect('/forbidden')
    }
};


export const forbidden=(req, res) => {
    
    res.render('contacto')
}


export const perfil=async(req, res) =>{
    console.log('req.user.id===>', req.user.id)
    console.log('req.user.id_rol===>', req.user.id_rol)

 
    if(!req.user.id){
        res.render('/')
    }

    if(req.user.id_rol==1){
        console.log('el rol es admin', req.flash('error'))
        req.flash('success_msg', 'logueado como administrador')
        res.redirect('/admin')
    };
    if(req.user.id_rol==2){
        //si es un trabajador
        console.log('el rol es vendedor')
        req.flash('success_msg', 'logueado como personal autorizado')
        res.redirect('/productos')
    };
    if(req.user.id_rol==3){
        //si es un cliente
        console.log('el rol es docente')
        req.flash('success_msg', 'logueado como Docente')
        res.redirect('/docente')
    };
    if(req.user.id_rol==4){
        console.log('el rol es alumno')
        req.flash('success_msg', 'logueado como alumno')
        res.redirect('/alumno')
    };
 
      
}

export const validarAutenticacion=(req,res, next)=>{
    // console.log('req.user ====>', req.user)
    console.log('session.id_rol', req.session.id_rol)
    console.log('req.isAuthenticated ====>', req.isAuthenticated())
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
}
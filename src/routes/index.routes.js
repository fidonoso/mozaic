import {Router} from 'express'
const router=Router();
import multer from 'multer'
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import {validarAutenticacion} from '../controllers/index.controller.js'
import { login, crearAdmin, crearBodeguero, stock, createProduct, tienda, updatestock, crearUsuario2, validar, perfil, userlogout, consultarusuario, LogAdmin, forbidden} from '../controllers/index.controller.js'

//midlewares para esta ruta
///Multer para subir foto de perfil
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb)=>{
      let nameFile =uuidv4() +path.extname(file.originalname.toLocaleLowerCase())
      console.log('nameFile=>>', nameFile)
      cb(null, nameFile )
    }
  });
  
const profileImg=multer({
    storage:storage,
    dest: path.join(__dirname, '../public/uploads'),
    limits: { fileSize: 3000000},
    fileFilter: (req, file, cb)=>{
      const filetypes= /jpeg|jpg|png/;
      const mimetype= filetypes.test(file.mimetype)
      const extname= filetypes.test(path.extname(file.originalname))
      if(mimetype && extname){
       
        return cb(null, true)
      }
      cb("Error: el archivo debe ser una imagen válida")
    }
  }).single('url_img');

router.get('/', tienda)
router.get('/',validarAutenticacion, perfil);
router.get('/login', login);
router.post('/validar', validar)
router.post('/crearadmin', crearAdmin)
router.get('/admin', validarAutenticacion, LogAdmin)

router.post('/crearbodeguero', crearBodeguero)

router.get('/productos', validarAutenticacion, stock)
router.post('/createproduct', validarAutenticacion, profileImg, createProduct)

router.get('/tienda', tienda)
router.post('/updatestock', updatestock)

// router.post('/consultarusuario', consultarusuario)

router.get('/logout', userlogout)
// router.get('/forbidden', forbidden)

export default router
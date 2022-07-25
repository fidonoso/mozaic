import express from 'express'
const app=express();
import config from './config.js';
import exphbs from "express-handlebars";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import flash from "connect-flash";
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
import cookieParser from 'cookie-parser'
import passport from 'passport';
require('./config/passport.js')
import indexRoutes from './routes/index.routes.js'
var numeral = require('numeral');
// import RoutesSupervisor from './routes/supervisor.routes.js'
// import RoutesDocente from './routes/docente.routes.js'
// import RoutesAlumno from './routes/alumno.routes.js'
import main from './database/start_bd.js' //para iniciar la base de datos
main()
import {sequelize} from "./database/conexion.js";
var SequelizeStore = require("connect-session-sequelize")(session.Store)
import  './models/sessions.js'





//configuraciones

app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
        inc: function (value, options) {
          return parseInt(value) + 1;
        },   
        promedio: function (nota1, nota2, nota3, options) {
          if(nota1 && nota2 && nota3 ){
            return (Math.floor(nota1+nota2+nota3)/3).toFixed(2);

          }
          return
          
        },   
        resultado: function (nota1, nota2, nota3, options) {
            if(nota1 && nota2 && nota3){
              let res=Math.floor(nota1+nota2+nota3)/3
              if(res>=40){
                return "Aprobado"
              }else{
                return "Reprobado"
              }
            }

          return ;
        },
        color: function(nota1, nota2, nota3){
          if(nota1 && nota2 && nota3){
            let res=Math.floor(nota1+nota2+nota3)/3
            if(res>=40){
              return "text-primary"
            }else{
              return "text-danger"
            }
          }
        },
        colorsolo:function(nota){
          if(nota>=40){
            return "text-primary"
          }else{
            return "text-danger"
          }
        },
        precio: function(numero){
          return numeral(numero).format('$0,0')
        }
    },   
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", ".hbs");

//Middleware
app.use(morgan('dev'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    id_rol: session.id_rol,
    id: session.user
  };
}

const store = new SequelizeStore({
  db: sequelize,
  table: "Session",
  extendDefaultFields: extendDefaultFields,
});

// guardado de sesiones





app.use(session({
  key: 'examen',
  secret:'examen_admin_serv_web',
  store: store,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//variables globales
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.user = req.user || req.flash("user");
  
  next();
})

//Archivos estaticos
app.use(express.static(__dirname + '/public'));


//routes
app.use(indexRoutes)
// app.use(RoutesSupervisor)
// app.use(RoutesDocente)
// app.use(RoutesAlumno)

//restringido
app.use((req, res)=>{
  res.render('404')
})

export default app
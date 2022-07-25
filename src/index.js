import app from './app.js'
import config from './config.js';
app.set("port", config.PORT);
import {sequelize} from './database/conexion.js'

app.listen(app.get('port'), ()=>{ console.log(`escuchando en elpuerto ${app.get('port')}`)})
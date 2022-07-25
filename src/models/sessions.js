import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'


const Sesion= sequelize.define("Session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    // name: DataTypes.STRING,
    id_rol:DataTypes.INTEGER,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  },{
        timestamps:false
    });

  export default Sesion
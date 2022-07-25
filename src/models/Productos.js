import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'



export const Producto=sequelize.define('productos',{
    id:{
        type:DataTypes.STRING,
        primaryKey:true,
    },
    producto:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    descripcion:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    precio:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    url_img:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    stock:{
        type: DataTypes.INTEGER
    }
 
},{
    timestamps:false
});

// Carrera.hasMany(Alumno, {
//     foreignKey: 'id_carrera',
//     sourceKey: 'id',
//     onDelete: 'CASCADE'
// });

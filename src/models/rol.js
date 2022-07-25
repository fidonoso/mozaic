import {DataTypes} from 'sequelize'
import {sequelize} from '../database/conexion.js'
import {Usuario} from './Usuario.js' 
// import {Alumno} from './alumno.js' 

export const Rol=sequelize.define('roles',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type:   DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type:   DataTypes.STRING,
       
    }
},{
    timestamps: false
});

Rol.hasMany(Usuario, {
    foreignKey: 'id_rol',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});



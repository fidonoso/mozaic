import {sequelize} from './conexion.js'

 const main =async()=>{
    try {
        await sequelize.sync({force: false})
        console.log('La conexion con la base de datos ha sido exitosa')
        
     } catch (error) {
         console.log('error en la conexion', error)
     }
    }
    // main()

    export default main
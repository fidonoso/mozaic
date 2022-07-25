import mysql from 'mysql2';
import Sequelice from "sequelize";

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database:'mozaic',
    password: '13991987Ft',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

export const sequelize = new Sequelice(
  "mozaic",
  "root",
  "13991987Ft",
  {
    host: "localhost", 
    dialect: "mysql",
    logging: false,
  }
);
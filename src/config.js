import { config } from "dotenv";
config();

const configurations = {
  PORT: process.env.PORT || 3000,
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: process.env.MYSQL_PORT || 3306,
  MYSQL_DATABASE: process.env.MYSQL_DB || "mozaic",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "13991987Ft"

};
export default configurations;
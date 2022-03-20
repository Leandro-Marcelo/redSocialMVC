const dotenv = require("dotenv");
dotenv.config();

/* hace esta configuración para que donde tenga que usar las variables de entorno no tenga que poner proccess.env.PORT process.env .... y mejor solamente pongo config y la wea que quiero */

const config = {
  port: process.env.PORT,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  secret: process.env.SECRET,
};

module.exports = config;

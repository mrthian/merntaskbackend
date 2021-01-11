const mogoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
  try {
    await mogoose.connect(process.env.DB_MONGO, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      //useFindAndModify: false
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('DB Conectada');
  } catch (error) {
    console.log('Error al conectar con la base de datos:', error);
    process.exit(1); // Detener la APP 
  }
}

module.exports = conectarDB;
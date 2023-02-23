const mongoose = require("mongoose");

const dbMongoConnect = () => {
  const RUTADB = process.env.RUTA_DB;
  console.log(RUTADB)
  mongoose.set("strictQuery", true);

  mongoose.connect(RUTADB, (error) => {
    if (!error) {
      console.log("CONEXION EXITOSA");
    } else {
      console.log("ERROR DE CONEXION");
    }
  });
};

module.exports = dbMongoConnect();

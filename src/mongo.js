const mongoose = require("mongoose");
const { productModel } = require("./models/products.model");

const dbMongoConnect = async () => {
  const RUTADB = process.env.RUTA_DB;
  console.log(RUTADB);
  mongoose.set("strictQuery", true);

  mongoose.connect(RUTADB, (error) => {
    if (!error) {
      console.log("CONEXION EXITOSA");
    } else {
      console.log("ERROR DE CONEXION");
    }
  });

  const response = await productModel.paginate(
    { description: "Bebida" },
    { page: 2, limit: 2 }
  );
  // console.log(response);
};

module.exports = dbMongoConnect();

const mongoose = require("mongoose");

const carrito = "carrito";

const cartSchema = new mongoose.Schema(
  {
    articulos: [
      {
        IdProducto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productos",
        },
        title: String,
        quantity: String,
        _id: false,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const cartModel = mongoose.model(carrito, cartSchema);

module.exports = { cartModel };

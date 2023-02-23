const mongoose = require("mongoose");

const productColecction = "productos";

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: String,
    thumbnail: String,
    code: String,
    stock: String,
  },
  {
    versionKey: false,
  }
);

const productModel = mongoose.model(productColecction, productSchema);

module.exports = { productModel };

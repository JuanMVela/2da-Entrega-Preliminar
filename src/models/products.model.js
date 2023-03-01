const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productColecction, productSchema);

module.exports = { productModel };

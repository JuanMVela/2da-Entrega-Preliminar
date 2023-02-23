const express = require("express");
const viewsRouters = express.Router();
const { productModel } = require("../models/products.model");

viewsRouters.get("/", async (req, res) => {
  const products = await productModel.find().lean();
  res.render("home", { products });
});
viewsRouters.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts");
});

module.exports = viewsRouters;

const express = require("express");
const products = express.Router();
const { productModel } = require("../models/products.model");

products.get("/", async (req, res) => {
  const datos = await productModel.find();
  res.send(datos);
});

products.get("/:id", async (req, res) => {
  const { id } = req.params;
  const datoId = await productModel.findOne({ _id: id });
  res.send(datoId);
});

products.post("/", async (req, res) => {
  const bodyNew = await req.body;
  await productModel.create(bodyNew);
  res.send("Producto cargado");
});

products.put("/:id", async (req, res) => {
  const { id } = req.params;
  const bodyNew = await req.body;
  await productModel.findByIdAndUpdate({ _id: id }, bodyNew);
  res.send(`Producto "${id}" actualizado`);
});

products.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await productModel.deleteOne({ _id: id });
  res.send(`Producto "${id}" eliminado`);
});

module.exports = products;

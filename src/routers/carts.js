const express = require("express");
const carts = express.Router();

const { productModel } = require("../models/products.model");
const { cartModel } = require("../models/cart.model");
// const { productCartModel } = require("../models/productcart.model");

// --------------------VISUALIZAR CARRITOS----------------------------
carts.get("/", async (req, res) => {
  const datos = await cartModel.find();
  res.json(datos);
});

// --------------------CREAR CARRITOS---------------------------------
carts.post("/", async (req, res) => {
  const body = req.body;
  await cartModel.create(body);
  res.send("Carrito creado");
});

//--------------------VISUALIZAR CARRITO SEGUN ID---------------------
carts.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  let traerID = await cartModel.findOne({ _id: cid });
  res.send(traerID);
});

// -------------------CARGAR PRODUCTOS EN CARRITO SEGUN "CID" Y "PID"--
carts.put("/:cid/products/:pid", async (req, res) => {
  //tomamos los datos de la url
  const id_Cart = req.params.cid;
  const id_producto = req.params.pid;

  //seleccionamos el carrito
  const cartIdMongo = await cartModel.findOne({ _id: id_Cart });
  if (!cartIdMongo) {
    res.send("El carrito no existe");
  }

  //FIltra el producto que cumple con la condicion del id_producto (parametro)
  const productIdMongo = await productModel.findOne({ _id: id_producto });
  if (!productIdMongo) {
    res.send("El producto no existe");
  }

  //FIltra solamente la ID de la Collecion Productos (productIdMongo)
  const idMongoPro = productIdMongo._id;

  let constPro = {
    IdProducto: idMongoPro,
    quantity: 1,
  };

  //revisamos si el carrito ya tiene el producto
  const verifyCart1 = cartIdMongo.articulos.find(
    (element) => element.IdProducto.toString() === idMongoPro.toString()
  );

  if (verifyCart1) {
    cartIdMongo.articulos.map((element) => {
      if (element.IdProducto.toString() === idMongoPro.toString()) {
        element.quantity++;
      }
    });
    // Actualiza el carrito segun la ID pasada y luego los datos a actualizar
    await cartModel.updateOne({ _id: id_Cart }, cartIdMongo);
    res.send(cartIdMongo);
  } else {
    // se pushea los datos utilizando el modelo de Cart.model
    cartIdMongo.articulos.push({
      title: productIdMongo.title,
      ...constPro,
    });
    // se transcribe la informacion
    await cartModel.updateOne({ _id: id_Cart }, cartIdMongo);
    res.send(cartIdMongo);
  }
});

// -------------------ELIMINAR PRODUCTOS EN CARRITOS SEGUN "CID" Y "PID"--
carts.delete("/:cid/products/:pid", async (req, res) => {
  //tomamos los datos de la url
  const id_Cart = req.params.cid;
  const id_producto = req.params.pid;

  //seleccionamos al carrito
  const cartIdMongo = await cartModel.findOne({ _id: id_Cart });

  //filtra y trae todos los dinstintos productos que encuentre
  const productosActualizados = cartIdMongo.articulos.filter(
    (element) => element.IdProducto.toString() !== id_producto.toString()
  );

  //Se transcribe la informacion y se deja el nuevo array con los que son distintos
  cartIdMongo.articulos = productosActualizados;
  console.log(productosActualizados);

  await cartModel.updateOne({ _id: id_Cart }, cartIdMongo);

  res.send({
    mensaje: `Carrito ${id_Cart} Actualizado`,
    carrito: cartIdMongo,
  });
});

// --------------------ELIMINAR CARRITO---------------------------------
carts.delete("/:cid", async (req, res) => {
  //tomamos los datos de la url
  const id_Cart = req.params.cid;
  //seleccionamos al carrito
  await cartModel.deleteOne({ _id: id_Cart });
  res.send({
    mensaje: `Carrito ${id_Cart} Eliminado`,
  });
});

// --------------------VACIAR CARRITO (EN PROCESO,FALTA TERMIANAR)------
// carts.put("/vaciar/:cid", async (req, res) => {
//   //tomamos los datos de la url
//   const id_Cart = req.params.cid;
//   //seleccionamos al carrito
//   const cartIdMongo = await cartModel.findOne({ _id: id_Cart });

//   const cartsArray = cartIdMongo.articulos;

//   if (cartsArray) {
//     cartIdMongo.push({ articulos: [] });

//     await cartModel.updateOne({ _id: id_Cart }, cartIdMongo);
//     res.send(cartIdMongo);
//   }
//   console.log(cartsArray);

//   res.send({ mensaje: `Carrito ${id_Cart} Eliminado` });
// });

module.exports = carts;

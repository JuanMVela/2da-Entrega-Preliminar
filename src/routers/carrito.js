const express = require("express");
const carrito = express.Router();

const { productModel } = require("../models/products.model");
const { cartModel } = require("../models/cart.model");
// const { productCartModel } = require("../models/productcart.model");

carrito.get("/", async (req, res) => {
  const datos = await cartModel.find();
  res.json(datos);
});

carrito.post("/", async (req, res) => {
  const body = req.body;
  await cartModel.create(body);
  res.send("Carrito creado");
});

carrito.get("/:id", async (req, res) => {
  const { id } = req.params;
  let traerID = await cartModel.findOne({ _id: id });
  res.send(traerID);
});

carrito.put("/carrito/:idcart/producto/:idproducto", async (req, res) => {
  //tomamos los datos de la url
  const id_Cart = req.params.idcart;
  const id_producto = req.params.idproducto;

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

carrito.put(
  "/eliminarproducto/carrito/:idcart/producto/:idproducto",
  async (req, res) => {
    //tomamos los datos de la url
    const id_Cart = req.params.idcart;
    const id_producto = req.params.idproducto;

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
  }
);

module.exports = carrito;

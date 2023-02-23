const fs = require("fs");
const express = require("express");
const cartsRouter = express.Router();

let cartBase = JSON.parse(fs.readFileSync("./database/carritos.json", "utf-8"));
let productosBase = JSON.parse(
  fs.readFileSync("./database/productos.json", "utf-8")
);

const generadorID = (array) => {
  let id = 1; //tenemos la variable ID
  const ultimoElemento = array[array.length - 1]; //Tomamos el ultimo elemento del array (si existe)
  if (ultimoElemento) {
    id = ultimoElemento.id + 1;
  }
  //Si el ultimo elemento existe, vamos a hacer que id sea igual al id del ultimo elemento + 1
  return id; //retornamos el id
};

cartsRouter.post("/", (req, res) => {
  const products = [];
  const idGenerada = generadorID(cartBase);
  cartBase.push({ id: idGenerada, products: products });
  fs.writeFileSync("./database/carritos.json", JSON.stringify(cartBase));

  res.send("Carrito creado");
});

cartsRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cartId = cartBase.find((cartBase) => cartBase.id === +cid);
  res.send(cartId);
  // Mostrar los productos que pertenezcan al carrito con ese cid
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid } = req.params;
  const { pid } = req.params;

  function AgregarProductos(cid, pid) {
    const cartId = cartBase.find((cartBase) => cartBase.id === +cid);
    // const productsArray = cartId.products

    const proIdBase = productosBase.find(
      (productBase) => productBase.id === +pid
    );
    const idProduct = proIdBase.id;
    /* Solo ID de ese Array */

    let constPro = {
      pro: idProduct,
      quantity: 1,
    };

    const verify1 = cartId.products.find(
      (product) => product.pro === idProduct
    );
    console.log(verify1);

    const verify2 = cartId.products.find(
      (product) => product.pro === idProduct
    );
    console.log(verify2);

    if (verify1) {
      verify2.quantity++;
    } else {
      cartId.products.push({ ...constPro });
    }
  }
  AgregarProductos(cid, pid);
  fs.writeFileSync("./database/carritos.json", JSON.stringify(cartBase));

  res.send(cartBase);
  // agregar el producto al carrito
});

module.exports = cartsRouter;

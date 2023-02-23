// import Rutas
const routerProduct = require("./routers/routerProduct");
const carrito = require("./routers/carrito");
const viewsRouters = require("./routers/viewsRouter");

// const productsRouter = require("./routers/productsRouter");

// Modelos
const { productModel } = require("./models/products.model");
// const { cartModel } = require("../models/cart.model");

const express = require("express");
const app = express();

const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

const dotenv = require("dotenv");
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Vistas
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Rutas
app.use("/productos", routerProduct);
app.use("/carrito", carrito);
app.use("/", viewsRouters);

// Puerto servidor
const PORT = 8080;

// Activacion servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// websockets
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("nuevo cliente");

  const products = await productModel.find().lean();
  // console.log(products);
  socket.emit("cargaDeProductos", products);

  socket.on("nuevoProducto", async (data) => {
    let productoNuevo = { ...data };
    if (productoNuevo) {
      await productModel.create(productoNuevo);
    }
    socket.emit("cargaDeProductos", products);
  });
  // socket.on("eliminarProducto", (id) => {
  //   if (id) {
  //     productsJson = productsJson.filter((producto) => producto.id !== +id);
  //     fs.writeFileSync(
  //       "./database/productos.JSON",
  //       JSON.stringify(productsJson)
  //     );

  //     res.send("El Producto ha sido eliminado");
  //   } else {
  //     res.status(404).send("El producto no existe");
  //   }
  // });
});

// Conexion a MongoDB
const dbMongoConnect = require("./mongo");

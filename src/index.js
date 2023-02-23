// import Rutas
const routerProduct = require("./routers/routerProduct");
const carrito = require("./routers/carrito");
const viewsRouters = require("./routers/viewsRouter");

// Modelos
const { productModel } = require("./models/products.model");

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

// Websockets
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("nuevo cliente");

  // Almacenar los "productos" desde MongoDB en una variable
  const products = await productModel.find().lean();

  // Socket VISUALIZAR productos en tiempo real
  socket.emit("cargaDeProductos", products);

  // Socket AGREGAR nuevo producto
  socket.on("nuevoProducto", async (data) => {
    let productoNuevo = { ...data };
    if (productoNuevo) {
      await productModel.create(productoNuevo);
    }
  });

  // Socket ELIMINAR producto con ID de FORM
  socket.on("eliminarProducto", async (id) => {
    if (id) {
      await productModel.deleteOne({ _id: id });
      // res.send(`Producto "${id}" eliminado`);
    } else {
      // res.status(404).send("El producto no existe");
    }
  });

  // Socket ACTUALIZAR productos
  socket.on("cargaDeProductos", (products) => {});
});

// Conexion a MongoDB
const dbMongoConnect = require("./mongo");

// import Rutas
const products = require("./routers/products");
const carts = require("./routers/carts");
const viewsRouters = require("./routers/viewsRouter");

// Modelos
const { productModel } = require("./models/products.model");

const express = require("express");
const app = express();

const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Vistas
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Rutas
app.use("/productos", products);
app.use("/carts", carts);
app.use("/", viewsRouters);

// Cookie
app.get("/setCookie", (req, res) => {
  res
    .cookie("Coder", "soy una cookie", { maxAge: 20000 })
    .send("Cookie Fronted");
});

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
    await productModel.create(data);
    const actualizados = await productModel.find();
    socket.emit("cargaDeProductos", actualizados);
  });

  // Socket ELIMINAR producto con ID de FORM
  socket.on("eliminarProducto", async (id) => {
    if (id) {
      await productModel.deleteOne({ _id: id });
      const actualizados = await productModel.find();
      socket.emit("cargaDeProductos", actualizados);
      // res.send(`Producto "${id}" eliminado`);
    } else {
      // res.status(404).send("El producto no existe");
    }
  });
});

// Conexion a MongoDB
const dbMongoConnect = require("./mongo");

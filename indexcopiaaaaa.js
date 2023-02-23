const productsRouter = require("./routers/productsRouter");
const cartsRouter = require("./routers/cartsRouter");
const viewsRouters = require("./routers/viewsRouter");
const fs = require("fs");

const express = require("express");
const app = express();

const handlebars = require("express-handlebars");
const { Server } = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouters);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("nuevo cliente");
  let productsJson = JSON.parse(
    fs.readFileSync("./database/productos.JSON", "utf-8")
  );


  socket.emit("cargaDeProductos", productsJson);
  socket.emit("cargaDeProductos", productsJson);

  socket.on("nuevoProducto", (data) => {
    let id =
      productsJson.length > 0
        ? productsJson[productsJson.length - 1].id + 1
        : 1;
    let productoNuevo = { id, ...data };
    if (productoNuevo) {
      productsJson.push(productoNuevo);
      fs.writeFileSync(
        "./database/productos.JSON",
        JSON.stringify(productsJson)
      );
    }
  });
  socket.on("eliminarProducto", (id) => {
    
    if (id) {
      productsJson = productsJson.filter((producto) => producto.id !== +id);
      fs.writeFileSync("./database/productos.JSON", JSON.stringify(productsJson));
  
      res.send("El Producto ha sido eliminado");
    } else {
      res.status(404).send("El producto no existe");
    }

  })

});

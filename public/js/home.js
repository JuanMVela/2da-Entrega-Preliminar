// const socket = io.connect();
// console.log("Hola");

// let formulario = document.querySelector(".formulario");
// let formularioEliminar = document.querySelector(".formularioEliminar");
// let productsRealTime = document.querySelector("#productsRealTime");

// Targets value Formualario "cargar productos"
// let title = document.querySelector("#nombre");
// let description = document.querySelector("#descripcion");
// let price = document.querySelector("#precio");
// let thumbnail = document.querySelector("#url");
// let code = document.querySelector("#codigo");
// let stock = document.querySelector("#stock");

// // Target value Formualario "eliminar"
// let IdDeleteProducto = document.querySelector("#idDelete");

// const cargaDeProductos = () => {
//   socket.on("cargaDeProductos", (data) => {
//     productsRealTime.innerHTML = "";

//     data.forEach((e) => {
//       productsRealTime.innerHTML += `<ul>
//             <li><h3>Nombre: ${e.title}</h3></li>
//             <li>Description: ${e.description} </li>
//             <li>Precio: ${e.price} </li>
//             <li>Imagenes: ${e.thumbnail} </li>
//             <li>Codigo: ${e.code} </li>
//             <li>Stock: ${e.stock} </li>
//             <li>ID: ${e._id} </li>
//          </ul>`;
//     });
//   });
// };

// const nuevoProducto = () => {
//   formulario.onsubmit = (e) => {
//     e.preventDefault();

//     let productoNuevo = {
//       title: title.value,
//       description: description.value,
//       price: price.value,
//       thumbnail: thumbnail.value,
//       code: code.value,
//       stock: stock.value,
//     };

//     socket.emit("nuevoProducto", productoNuevo);
//   };
// };

// const eliminarProducto = () => {
//   formularioEliminar.onsubmit = (e) => {
//     e.preventDefault();

//     let id = IdDeleteProducto.value;

//     socket.emit("eliminarProducto", id);
//   };
// };

// socket.on("cargaDeProductos", cargaDeProductos());

// cargaDeProductos();
// nuevoProducto();
// eliminarProducto();

// Funcion ELIMINAR producto con ID de FORM

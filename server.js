const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { Server: HttpServer } = require('http');

const Contenedor = require('./containers/Contenedor');

const app = express();
const httpServer = new HttpServer(app);
const io = new SocketServer(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(express.static('public'));

const contenedorProductos = new Contenedor('productos.txt');
contenedorProductos.checkIfFileExists();

const contenedorMensajes = new Contenedor('mensajes.txt');
contenedorMensajes.checkIfFileExists();


io.on('connection', (socket) => {
    console.log('socket id: ', socket.id);
    socket.emit('conversation', contenedorMensajes.getAll());
    socket.emit('productos', contenedorProductos.getAll());
    
    socket.on('new-message', (message) => {
        console.log('nuevo mensaje');
        contenedorMensajes.save(message);
        io.sockets.emit('conversation', contenedorMensajes.getAll());
    });

    socket.on('new-producto', (producto) => {
        console.log('nuevo producto');
        contenedorProductos.save(producto);
        io.sockets.emit('productos', contenedorProductos.getAll());
    });

});

// app.get('/productos', (req, res) => {
//     res.render('public/productos.html');
// });


const port = 8080;

const connectedServer = httpServer.listen(port, () => {
  console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`));




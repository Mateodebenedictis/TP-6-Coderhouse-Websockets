const socket = io(); //emitimos el evento connection que el socket server esta escuchando


socket.on('productos', (productos) => {
    
    console.log(productos);
    
    if(productos.length == 0){
        document.getElementById('mensajeSinProductos').innerHTML = 'No hay productos cargados';
    } else {
        document.getElementById('mensajeSinProductos').innerHTML = '';
    }
    
    const productosHtml = productos.map((producto) => {
        return `<tr>
        <td>${producto.title}</td>
        <td>${producto.price}</td>
        <td class="w-25">
        <img src=${producto.thumbnail} class="foto" alt=${producto.title} >
        </td>
        </tr>`
    }).join(' ');
    
    document.getElementById('tablaProductos').innerHTML = productosHtml;
    
});

socket.on('conversation', (messages) => {

    console.log(messages);

    const messagesHtml = messages.map((message) => {
        return `<div class="marron mensaje">
            <strong class="azul">${message.email}</strong> ${message.date}: <em class="verde">${message.text}</em>
        </div>`
    }).join(' ');

    document.getElementById('messages').innerHTML = messagesHtml;

});


document.getElementById('chatForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const message = {};
    const hoy = new Date();

    message.email = document.getElementById('email').value;
    message.date = `[${hoy.toLocaleString()}]`;
    message.text = document.getElementById('text').value;
    
    socket.emit('new-message', message);
    
    document.getElementById('text').value = '';
});

document.getElementById('insertProducto').addEventListener('submit', (event) => {
    event.preventDefault();

    const producto = {};

    producto.title = document.getElementById('titulo').value;
    producto.price = document.getElementById('precio').value;
    producto.thumbnail = document.getElementById('imagen').value;
    
    socket.emit('new-producto', producto);
    
    document.getElementById('title').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
});


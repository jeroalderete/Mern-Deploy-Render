const socket = io();

socket.on('productos', productos =>{
    const tbody = document.getElementById('productos-body');

tbody.innerHTML = "";

productos.forEach(producto => {
    const row = tbody.insertRow();

    row.innerHTML = `

    <td>${producto._id}</td>
    <td>${producto.title}</td>
    <td>${producto.description}</td>
    <td>${producto.price}</td>
    <td>${producto.code}</td>
    <td>${producto.stock}</td>
    <td>${producto.category}</td>
    <td>${producto.status ? "activo" : "desactivado"}</td>
    <td>${producto.thumbnails && producto.thumbnails.length > 0 ? `<a href="${producto.thumbnails[0]}" target="_blank">${producto.thumbnails[0]}</a>` : 'No Hay Imagen'}</td>
    <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
    `
});
    console.log(productos)

})



const formulario = document.getElementById('producto-form')


formulario.addEventListener('submit', (e) =>{
    e.preventDefault();

    const titulo = document.getElementById('titulo').value
    const descripcion = document.getElementById('descripcion').value
    const precio = document.getElementById('precio').value
    const codigo = document.getElementById('codigo').value
    const stock = document.getElementById('stock').value
    const categoria = document.getElementById('categoria').value
    const thumbnails = document.getElementById('thumbnails').value.split(',').map(url => url.trim());

   const producto = {
                title: titulo,
                description: descripcion,
                price: parseFloat(precio),
                code: codigo,
                stock: parseInt(stock),
                category: categoria,
                thumbnails: thumbnails
            };


    socket.emit('agregarProductos', producto)
    console.log(producto)
    formulario.reset();

})


function eliminarProducto(_id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        socket.emit('eliminarProducto', _id);
    }
}
// const tableLista = document.querySelector('#tableListaDeseo tbody');
// document.addEventListener('DOMContentLoaded',function(){
//     getlistaDeseo();
// })
// function getlistaDeseo(){
//     const url = base_url + 'principal/listaDeseo';
//     const http = new XMLHttpRequest();
//     http.open('POST',url,true);
//     http.send(JSON.stringify(listaDeseo));
//     http.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200 ){
//             const res = JSON.parse(this.responseText);
//             console.log(this.responseText);
//             let html = '';
//             res.productos.forEach(producto=>{
//                 html += `<td>
//                             <img class="img-thumbnail rounded-circle" src="${producto.imagen}" alt="" width="100">
//                         </td>
//                         <td>${producto.nombre}</td>
//                         <td>
//                             <span class="badge bg-warning">${res.moneda +' ' + producto.precio}</span>
//                         </td>
//                         <td>
//                             <span class="badge bg-primary">${producto.cantidad}</span>
//                         </td>
//                         <td>
//                             <button class="btn btn-danger btnEliminarDeseo" type="button" prod="${producto.id}">
//                                 <i class="fa fa-trash"></i>
//                             </button>
//                             <button class="btn btn-primary btnAddCarro btnElminarDeseo" type="button" prod="${producto.id}">
//                                 <i class="fa fa-cart-plus"></i>
//                             </button>
//                         </td> 
//                     </tr>`;
//             });
//             tableLista.innerHTML = html;
//             btnEliminarDeseo();
//             btnAgregarProducto();
//         }
//     }
// }

// function btnEliminarDeseo(){
//     let listaEliminar = document.querySelectorAll('.btnEliminarDeseo');
//     for (let i = 0; i < listaEliminar.length; i++) {
//         listaEliminar[i].addEventListener('click',function(){
//         let idProducto = listaEliminar[i].getAttribute('prod');
//         eliminarListaDeseo(idProducto);
//         })
//     }


// }

// function eliminarListaDeseo(idProducto){
//     for (let i = 0; i < listaDeseo.length; i++) {
//         if(listaDeseo[i]['idProducto']==idProducto){
//             listaDeseo.splice(i,1);
//         }
//     }
//     localStorage.setItem('listaDeseo',JSON.stringify(listaDeseo));
//     getlistaDeseo();
//     cantidadDeseo();
//     Swal.fire({
//         title: "Aviso",
//         text: "Producto eliminado de la lista",
//         icon: "success"
//     });
// }

// function btnAgregarProducto(){
//     let listaAgregar = document.querySelectorAll('.btnAddCarro');
//     for (let i = 0; i < listaAgregar.length; i++) {
//         listaAgregar[i].addEventListener('click',function(){
//             let idProducto = listaAgregar[i].getAttribute('prod');
//             //eliminarListaDeseo(idProducto);// Esto no estaba en la clase se puede  asi o piniendo btnEliminarDeseo en el boton de carrito 
//             agregarCarrito(idProducto, 1 , true);
//         })
        
//     }
// }
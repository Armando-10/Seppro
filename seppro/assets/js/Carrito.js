
document.addEventListener("DOMContentLoaded", function(){
    //querySelectorAll es cuando son varios elementos, en este caso botones(links)
    //si dice que no es una funcion puede ser porque son varios elementos y no se esta iterando con el foreach o viceverza 
    const btnEliminarCarrito = document.querySelectorAll('#btnEliminarCarrito'); //El punto es clase, el all es para poder obtener multiples elementos
    btnEliminarCarrito.forEach(EliminarCarrito => {
        EliminarCarrito.addEventListener('click',function(){
            const idproducto = this.getAttribute('data-id');
            let formData = new FormData();
            formData.append('idproducto',idproducto);
            const url = base_url + 'Usuarios/EliminarCarrito';
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.send(formData);
            Swal.fire('Aviso','Producto eliminado del carrito', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
    });   
    });

            // const url = base_url + 'Usuarios/EliminarCarrito';
            // const http = new XMLHttpRequest();
            // http.open('POST', url, true);
            // http.send(formData);
            // http.onreadystatechange = function(){
            //     if(this.readyState == 4 && this.status == 200){
            //         const res = JSON.parse(this.responseText);
            //         Swal.fire('Aviso', res.msg,res.icono)
            //         if(res.icono == 'success'){
            //             setTimeout(() => {
            //                 EliminarCarrito(res.idpersona);
            //             }, 2000);
            //         }
            //     }
            // }


// function EliminarCarrito(idproducto){
//     let formData = new FormData();
//     formData.append('idproducto',idproducto);
//     const url = base_url + 'Usuarios/EliminarCarrito';
//     const http = new XMLHttpRequest();
//     http.open('POST', url, true);
//     http.send(formData);
//     http.onreadystatechange = function(){
//         if(this.readyState == 4 && this.status == 200){
//             const res = JSON.parse(this.responseText);
//             Swal.fire('Aviso?', res.msg,res.icono)
//             if(res.icono == 'success'){
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 2000);
//             }
//         }
//     }
// }


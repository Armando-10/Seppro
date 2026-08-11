
const btnAñadirCarrito = document.querySelector('#btnAñadirCarrito');
document.addEventListener("DOMContentLoaded", function(){
    const cantidadproducto = document.querySelector('#cantidadproducto');
    const maxCantidad = parseInt(cantidadproducto.max);
    btnAñadirCarrito.addEventListener('click',function(){//puede llegar a funcionar sin delararlo pues detecta el id en detail
        event.preventDefault();//Si se reinicia pagina es porqque es lo que viene por default en el form
        if(cantidadproducto.value>maxCantidad){
            Swal.fire('Aviso','NO TENEMOS SUFICIENTE STOCK EN LA SUCURSAL SELECCIONADA', 'error');
        }else{
        let formData = new FormData();
        formData.append('cantidadproducto1',cantidadproducto.value);
        const url = base_url + 'Principal/agregarCarrito';
        const http = new XMLHttpRequest();
        http.open('POST', url, true);
        http.send(formData);
        // Swal.fire('Aviso','Producto eliminado del carrito', 'success');
        http.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                console.log(this.responseText);
                const res = JSON.parse(this.responseText);
                Swal.fire('Aviso', res.msg,res.icono)
                if(res.icono == 'success'){
                    setTimeout(() => {
                        window.location.reload();//recarga la pagina despues de 2s
                    }, 1000);
                }
            }
        }
    }
    })

});

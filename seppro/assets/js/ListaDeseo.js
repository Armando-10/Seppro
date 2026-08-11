document.addEventListener("DOMContentLoaded", function(){
    //querySelectorAll es cuando son varios elementos, en este caso botones(links)
    //si dice que no es una funcion puede ser porque son varios elementos y no se esta iterando con el foreach o viceverza 
    const btnEliminarDeseo = document.querySelectorAll('#btnEliminarDeseo'); //El punto es clase, el all es para poder obtener multiples elementos
    btnEliminarDeseo.forEach(EliminarDeseo => {
        EliminarDeseo.addEventListener('click',function(){
            const idproducto = this.getAttribute('data-id');
            let formData = new FormData();
            formData.append('idproducto',idproducto);
            const url = base_url + 'Usuarios/EliminarDeseo';
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.send(formData);
            Swal.fire('Aviso','Producto eliminado del la lista de deseos', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
    });   
    });
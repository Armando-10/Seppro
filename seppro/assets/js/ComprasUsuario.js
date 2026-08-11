
document.addEventListener("DOMContentLoaded", function(){
    //querySelectorAll es cuando son varios elementos, en este caso botones(links)
    //si dice que no es una funcion puede ser porque son varios elementos y no se esta iterando con el foreach o viceverza 
    const btnFactura = document.querySelectorAll('#btnFactura'); //El punto es clase, el all es para poder obtener multiples elementos
    btnFactura.forEach(Factura => {
        Factura.addEventListener('click',function(){
            const idventa = this.getAttribute('data-id-venta');
            let formData = new FormData();
            formData.append('idventa',idventa);
            const url = base_url + 'Usuarios/obtenerventa';
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.send(formData);
            setTimeout(() => {
                window.location.href = base_url + 'usuarios/DescargarPDF';//recarga la pagina despues de 1s
            }, 50);
        })
    });   
    });
document.addEventListener("DOMContentLoaded", function(){
    //querySelectorAll es cuando son varios elementos, en este caso botones(links)
    //si dice que no es una funcion puede ser porque son varios elementos y no se esta iterando con el foreach o viceverza 
    const btnProcesarpedido = document.querySelector('#btnProcesarpedido'); //El punto es clase, el all es para poder obtener multiples elementos

    
    const codigoPostal = document.querySelector('#codigoPostal');
    const ciudad = document.querySelector('#ciudad');
    const estado = document.querySelector('#estado');
    const colonia = document.querySelector('#colonia');
    const calle = document.querySelector('#calle');
    const nexterior = document.querySelector('#nexterior');
    const ninterior = document.querySelector('#ninterior');
    const rfc = document.querySelector('#rfc');
        btnProcesarpedido.addEventListener('click',function(){
            if (
                codigoPostal.value == "" || 
                ciudad.value == "" ||
                estado.value == "" || 
                colonia.value == "" ||
                calle.value == "" || 
                nexterior.value == "" ||
                rfc.value == ""
            ) 
                {
                Swal.fire('Aviso','La direccion de envio es obligatoria', 'warning');
            } else {
                let formData = new FormData();
                formData.append('codigoPostal',codigoPostal.value);
                formData.append('ciudad',ciudad.value);
                formData.append('estado',estado.value);
                formData.append('colonia',colonia.value);
                formData.append('calle',calle.value);
                formData.append('nexterior',nexterior.value);
                formData.append('ninterior',ninterior.value);
                formData.append('rfc',rfc.value);
                const url = base_url + 'Usuarios/agregarDireccion';
                const http = new XMLHttpRequest();
                http.open('POST', url, true);
                http.send(formData);
                http.onreadystatechange = function(){
                    if(this.readyState == 4 && this.status == 200){
                        console.log(this.responseText);
                        const res = JSON.parse(this.responseText);
                        Swal.fire('Aviso', res.msg,res.icono)
                        if(res.icono == 'success'){
                            setTimeout(() => {
                                window.location.reload();//recarga la pagina despues de 1s
                            }, 1000);
                        }
                    }
                }
            }
        });   
    });
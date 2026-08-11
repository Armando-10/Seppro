
//PARA INICIO DE SESION
// const frmInicioSesion = document.querySelector('#frmInicioSesion');
const btnIniciarSesion = document.querySelector('#btnIniciarSesion');
const correoInicioSesion = document.querySelector('#correoInicioSesion');
const contraseñaInicioSesion = document.querySelector('#contraseñaInicioSesion');


document.addEventListener("DOMContentLoaded", function(){
    btnIniciarSesion.addEventListener('click',function(){
        event.preventDefault();
        if (
            correoInicioSesion.value == "" || 
            contraseñaInicioSesion.value == "") 
            {
            Swal.fire('Aviso','TODO LOS CAMPOS SON OBLIGATORIOS', 'warning');
        } else {
            let formData = new FormData();
            formData.append('correoInicioSesion',correoInicioSesion.value);
            formData.append('contraseñaInicioSesion',contraseñaInicioSesion.value);

            const url = base_url + 'Usuarios/Iniciar';
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
                            window.location.href = base_url + 'usuarios/PerfilUsuario';//recarga la pagina despues de 2s
                        }, 2000);
                    }
                }
            }
        }
    })
});

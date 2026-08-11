//SE DEBE DE LLAMAR IGUAL AL PHP QUE HAY
//PARA REGISTRO 
// const frmRegistro = document.querySelector('#frmRegistro');
const btnRegistrar = document.querySelector('#btnRegistrar');
const nombreUsuario = document.querySelector('#nombreUsuario');
const apUsuario = document.querySelector('#apUsuario');
const amUsuario = document.querySelector('#amUsuario');
const correoUsuario = document.querySelector('#correoUsuario');
const usuarioUsuario = document.querySelector('#usuarioUsuario');
const contraseñaUsuario = document.querySelector('#contraseñaUsuario');
const confirmarContraseña = document.querySelector('#confirmarContraseña');
const telefonoUsuario = document.querySelector('#telefonoUsuario');

document.addEventListener("DOMContentLoaded", function(){
    btnRegistrar.addEventListener('click',function(){
        event.preventDefault();
        if (nombreUsuario.value == "" || 
            apUsuario.value == "" || 
            usuarioUsuario.value == "" ||
            correoUsuario.value == "" ||
            contraseñaUsuario.value == "" ||
            confirmarContraseña.value == "" ||
            telefonoUsuario.value == "")
            {
            Swal.fire('Aviso','TODO LOS CAMPOS SON OBLIGATORIOS', 'warning');
        } else {
            let formData = new FormData();
            formData.append('nombre',nombreUsuario.value);
            formData.append('apaterno',apUsuario.value);
            formData.append('amaterno',amUsuario.value);
            formData.append('correo',correoUsuario.value);
            formData.append('usuario',usuarioUsuario.value);
            formData.append('contraseña',contraseñaUsuario.value);
            formData.append('confirmarContraseña',confirmarContraseña.value);
            formData.append('telefono',telefonoUsuario.value);

            const url = base_url + 'Usuarios/Registrarse';
            const http = new XMLHttpRequest();
            http.open('POST', url, true);
            http.send(formData);
            http.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    const res = JSON.parse(this.responseText);
                    Swal.fire('Aviso', res.msg,res.icono)
                    if(res.icono == 'success'){
                        setTimeout(() => {
                                enviarCorreo(correoUsuario.value, res.idpersona);
                        }, 2000);
                    }
                }
            }
        }
    })
});


function enviarCorreo(correo, idpersona){
    let formData = new FormData();
    formData.append('correo',correo);
    formData.append('idpersona',idpersona);
    const url = base_url + 'Usuarios/enviarCorreo';
    const http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.send(formData);
    http.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const res = JSON.parse(this.responseText);
            Swal.fire('Aviso?', res.msg,res.icono)
            if(res.icono == 'success'){
                setTimeout(() => {
                    window.location.href = base_url + 'usuarios/PerfilUsuario';
                }, 2000);
            }
        }
    }
}


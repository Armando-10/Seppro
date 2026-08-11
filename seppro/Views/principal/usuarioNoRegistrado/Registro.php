<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>


   <!-- Register Form -->
   <div class="container py-5">
        <div class="row">
            <div class="col-lg-6 col-md-8 col-sm-10 mx-auto">
                <h2 class="text-center mb-4">Registrarse</h2>
                <form method="POST" id="frmRegistro">
                    <div class="mb-3">
                        <label for="nombreUsuario" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombreUsuario" name="nombreUsuario" placeholder="Ingrese Nombre">
                    </div>
                    <div class="mb-3">
                        <label for="apUsuario" class="form-label">Apellido Paterno</label>
                        <input type="text" class="form-control" id="apUsuario" name="apUsuario" placeholder="Ingrese Apellido Paterno">
                    </div>
                    <div class="mb-3">
                        <label for="amUsuario" class="form-label">Apellido Materno</label>
                        <input type="text" class="form-control" id="amUsuario" name="amUsuario" placeholder="Ingrese Apellido Materno" >
                    </div>
                    <div class="mb-3">
                        <label for="usuarioUsuario" class="form-label">Nombre de usuario</label>
                        <input type="text" class="form-control" id="usuarioUsuario" name="usuarioUsuario" placeholder="Ingrese el nombre de usuario que deseas tener" >
                    </div>
                    <div class="mb-3">
                        <label for="correoUsuario" class="form-label">Correo Electrónico</label>
                        <input type="email" class="form-control" id="correoUsuario" name="correoUsuario" placeholder="Ingrese su correo electrónico" >
                    </div>
                    <div class="mb-3">
                        <label for="contraseñaUsuario" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="contraseñaUsuario" name="contraseñaUsuario"  placeholder="Ingrese su contraseña" >
                    </div>
                    <div class="mb-3">
                        <label for="confirmarContraseña" class="form-label">Confirmar Contraseña</label>
                        <input type="password" class="form-control" id="confirmarContraseña" name="confirmarContraseña" placeholder="Confirme su contraseña" >
                    </div>
                    <div class="mb-3">
                    <label for="telefonoUsuario" class="form-label">Telefono</label>
                        <input type="text" class="form-control" id="telefonoUsuario" name="telefonoUsuario" placeholder="Ingrese su Telefono" 
                        minlength="10">
                    </div>
                    <!-- <div class="mb-3">
                        <label for="confirmPassword" class="form-label">RFC</label>
                        <input type="text" class="form-control" id="rfc" name="rfc" placeholder="Ingrese su RFC" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Codigo Postal</label>
                        <input type="number" class="form-control" id="cp" name="cp" placeholder="Ingrese su codigo postal" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Ciudad</label>
                        <input type="text" class="form-control" id="city" name="city" placeholder="Igrese su Ciudad" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Estado</label>
                        <input type="text" class="form-control" id="state" name="state" placeholder="Igrese su Estado" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Colonia</label>
                        <input type="text" class="form-control" id="colonia" name="colonia" placeholder="Igrese su Colonia" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Calle</label>
                        <input type="text" class="form-control" id="calle" name="calle" placeholder="Igrese su Calle" required minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Numero Exterior</label>
                        <input type="text" class="form-control" id="nexterior" name="nexterior" placeholder="Igrese su Numero Exterior">
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Numero Interiror (opcional (S/N))</label>
                        <input type="text" class="form-control" id="ninterior" name="ninterior" placeholder="Igrese su Numero Interior">
                    </div> -->

                    <button type="submit" class="btn btn-success w-100" name="btnRegistrar" id="btnRegistrar" value="ok">Registrarse</button>
                </form>
                <div class="text-center mt-3">
                    <p>¿Ya tienes una cuenta? <a href="<?php echo BASE_URL.'usuarios/IniciarSesion'?>">Inicia sesión aquí</a></p>
                </div>
            </div>
        </div>
    </div>
    <!-- End Register Form -->
    <?php include_once 'Views/template-principal/footer.php'?>
    <script src="<?php echo BASE_URL;?>assets/js/Registro.js"></script>
</body>

</html>

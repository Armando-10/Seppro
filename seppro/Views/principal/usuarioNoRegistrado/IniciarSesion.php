<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>


    <!-- Login Form -->
    <div class="container py-5">
        <div class="row">
            <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
                <h2 class="text-center mb-4">Iniciar Sesión</h2>
                <form method="POST" id="frmInicioSesion">
                    <div class="mb-3">
                        <label for="correoInicioSesion" class="form-label">Correo Electrónico</label>
                        <input type="email" class="form-control" id="correoInicioSesion" name="correoInicioSesion" placeholder="Ingrese su correo electrónico">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="contraseñaInicioSesion" name="contraseñaInicioSesion" placeholder="Ingrese su contraseña">
                    </div>
                    <button type="submit" class="btn btn-success w-100" name="btnIniciarSesion" id="btnIniciarSesion">Iniciar Sesión</button>
                </form>
                <div class="text-center mt-3">
                    <p>¿No tienes una cuenta? <a href="<?php echo BASE_URL.'usuarios/Registro' ?>">Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    </div>
    <!-- End Login Form -->

    <?php include_once 'Views/template-principal/footer.php'?>
    <script src="<?php echo BASE_URL;?>assets/js/InicioSesion.js"></script>
</body>

</html>

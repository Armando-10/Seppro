<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php'?>

    <?php if($data['confirmarVerificacion']==1){?>
        <div class="container">
            <div class="profile-card">
                <div class="profile-header text-center">
                    <h2>Perfil de Usuario</h2>
                </div>
                <div class="profile-body">
                <div class="info">
                        <h6>Nombre de Usuario:</h6>
                        <p> <?php echo $_SESSION['usuarioUsuario']?></p>
                        
                    </div>
                    <div class="info">
                        <h6>Nombre:</h6>
                        <p><?php echo $_SESSION['nombreUsuario'] ." ". $_SESSION['apUsuario'] ." ". $_SESSION['amUsuario']?></p>
                    </div>
                    <div class="info">
                        <h6>Correo Electrónico:</h6>
                        <p> <?php echo $_SESSION['correoUsuario'] ?></p>
                    </div>
                    <div class="info">
                        <h6>Teléfono:</h6>
                        <p><?php echo $_SESSION['telefonoUsuario'] ?></p>
                    </div>
                    <!-- <div class="info">
                        <h6>Dirección:</h6>
                        <?php if (!empty($_SESSION['telefonoUsuario'])) {?>
                            <p>Av. Siempre Viva 123, Ciudad, País</p>
                        <?php }?>
                    </div> -->
                </div>
                <div class="profile-footer">
                    <!-- <a href="GestionarCuentaUsuario.html" class="btn btn-danger"><i class="fas fa-cogs"></i> Gestionar Cuenta</a> -->
                    <a href="<?php echo BASE_URL.'usuarios/ComprasUsuario' ?>" class="btn btn-warning"><i class="fa-solid fa-file"></i> Mis compras</a>
                </div>
            </div>
        </div>
    <?php }else{?>
        <div class="alert alert-warning text-center mt-5 mb-5" role="alert">
            <p>Falta verificar tu correo electrónico</p>
            <p>REVISA TU BANDEJA DE ENTRADA-SPAM</p>
        </div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
    <?php }?>
<?php include_once 'Views/template-principal/footer.php'?>
</body>

</html>
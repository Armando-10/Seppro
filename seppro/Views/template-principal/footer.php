<footer class="bg-dark" id="tempaltemo_footer">
        <div class="container">
            <div class="row">

                <div class="col-md-4 pt-5">
                    <h2 class="h2 text-success border-bottom pb-3 border-light logo">SEPPRO</h2>
                    <ul class="list-unstyled text-light footer-link-list">
                        <li>
                            <i class="fas fa-map-marker-alt fa-fw"></i>
                            JJXF+8H, 76147 San José el Alto, Qro.
                        </li>
                        <li>
                            <i class="fa fa-phone fa-fw"></i>
                            <a class="text-decoration-none" href="tel:010-020-0340">442-710-9612</a>
                        </li>
                        <li>
                            <i class="fa fa-envelope fa-fw"></i>
                            <a class="text-decoration-none" href="mailto:info@company.com">sepproqro@gmail.com</a>
                        </li>
                    </ul>
                </div>

                
                <div class="col-md-4 pt-5">
                    <h2 class="h2 text-light border-bottom pb-3 border-light">Productos</h2>
                    <ul class="list-unstyled text-light footer-link-list">
                        <?php foreach ($data['categorias'] as $categoria){?>
                        <li><a class="text-decoration-none" href="<?php echo BASE_URL . 'principal/categorias/' . $categoria['idcategoria'];?>"><?php echo $categoria['categoria']?></a></li>
                        <?php }?>
                    </ul>
                </div>

                <div class="col-md-4 pt-5">
                    <h2 class="h2 text-light border-bottom pb-3 border-light">Más Información</h2>
                    <ul class="list-unstyled text-light footer-link-list">
                        <li><a class="text-decoration-none" href="<?php echo BASE_URL ?>">Inicio</a></li>
                        <li><a class="text-decoration-none" href="<?php echo BASE_URL.'principal/about'?>">Nosotros</a></li>
                        <li><a class="text-decoration-none" href="<?php echo BASE_URL.'principal/shop' ?>">Catalogo</a></li>
                        <li><a class="text-decoration-none" href="<?php echo BASE_URL.'principal/contact' ?>">Contacto</a></li>
                    </ul>
                </div>

            </div>

            <div class="row text-light mb-4">
                <div class="col-12 mb-3">
                    <div class="w-100 my-3 border-top border-light"></div>
                </div>
                <div class="col-auto me-auto">
                    <ul class="list-inline text-left footer-icons">
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-light text-decoration-none" target="_blank" href="https://www.instagram.com/seppro_qro/"><i class="fab fa-instagram fa-lg fa-fw"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="w-100 bg-black py-3">
            <div class="container">
                <div class="row pt-2">
                    <div class="col-12">
                        <p class="text-left text-light">
                            Copyright &copy; 2024 CECIS 
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </footer>
    <!-- End Footer -->

    <!-- Start Script -->
    <script src="<?php echo BASE_URL;?>assets/js/jquery-1.11.0.min.js"></script>
    <script src="<?php echo BASE_URL;?>assets/js/jquery-migrate-1.2.1.min.js"></script>
    <script src="<?php echo BASE_URL;?>assets/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo BASE_URL;?>assets/js/templatemo.js"></script>
    <script src="<?php echo BASE_URL;?>assets/js/custom.js"></script>
    <script src="<?php echo BASE_URL;?>assets/js/sweetalert2.all.min.js"></script>

    <script>
        const base_url = '<?php echo BASE_URL;?>'
    </script>
<!-- 
    <script src="<?php echo BASE_URL;?>assets/js/carrito.js"></script> -->
    <!-- <script src="<?php echo BASE_URL;?>assets/js/Registro.js"></script>  -->
    <!-- <script src="<?php echo BASE_URL;?>assets/js/InicioSesion.js"></script> -->
    <!-- End Script -->
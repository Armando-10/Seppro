<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>
    <!-- Start Content -->
    <div class="container py-5">
        <div class="row">

            <!-- <div class="col-lg-3">
                <h1 class="h2 pb-4">Categorias</h1>
                <ul class="list-unstyled templatemo-accordion">
                    <li class="pb-3">
                        <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                            Bombas y motores Sumergibles
                            <i class="fa fa-fw fa-chevron-circle-down mt-1"></i>
                        </a>
                        <ul class="collapse show list-unstyled pl-3">
                            <li><a class="text-decoration-none" href="#">Neumann</a></li>
                            <li><a class="text-decoration-none" href="#">Altamira</a></li>
                            <li><a class="text-decoration-none" href="#">Grunfus</a></li>
                            <li><a class="text-decoration-none" href="#">Bamsa</a></li>
                            <li><a class="text-decoration-none" href="#">Franklin</a></li>
                            <li><a class="text-decoration-none" href="#">KSB</a></li>
                        </ul>
                    </li>
                    <li class="pb-3">
                        <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                            Cable Sumergible
                            <i class="pull-right fa fa-fw fa-chevron-circle-down mt-1"></i>
                        </a>
                        <ul id="collapseTwo" class="collapse list-unstyled pl-3">
                            <li><a class="text-decoration-none" href="#"></a></li>
                            <li><a class="text-decoration-none" href="#">3 Polos</a></li>
                        </ul>
                    </li>
                    <li class="pb-3">
                        <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                            Tubería de Acero
                            <i class="pull-right fa fa-fw fa-chevron-circle-down mt-1"></i>
                        </a>
                        <ul id="collapseThree" class="collapse list-unstyled pl-3">
                            <li><a class="text-decoration-none" href="#">8in</a></li>
                            <li><a class="text-decoration-none" href="#">6in</a></li>
                            <li><a class="text-decoration-none" href="#">4in</a></li>
                        </ul>
                    </li>
                    <li class="pb-3">
                        <a class="collapsed d-flex justify-content-between h3 text-decoration-none" href="#">
                            Arrancadores
                            <i class="pull-right fa fa-fw fa-chevron-circle-down mt-1"></i>
                        </a>
                        <ul id="collapseTwo" class="collapse list-unstyled pl-3">
                            <li><a class="text-decoration-none" href="#"></a></li>
                            <li><a class="text-decoration-none" href="#">Siemens</a></li>
                            <li><a class="text-decoration-none" href="#">Weg</a></li>
                            <li><a class="text-decoration-none" href="#">Enerwell</a></li>
                        </ul>
                    </li>
                </ul>
            </div> -->

            <div class="col-lg-15">
                <div class="row">
                    <div class="col-md-9">
                        <ul class="list-inline shop-top-menu pb-3 pt-1">
                            <li class="list-inline-item">
                                <a class="h3 text-dark text-decoration-none mr-3" href="<?php echo BASE_URL.'principal/shop/'?>">Todo</a>
                            </li>
                            <?php foreach($data['categorias'] as $categoria){?>
                            <li class="list-inline-item">
                                <a class="h3 text-dark text-decoration-none mr-3" href="<?php echo BASE_URL.'principal/shopCategoria/'.$categoria['idcategoria']?>"><?php echo $categoria['categoria']?></a>
                            </li>
                            <?php }?>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <?php foreach($data['produ'] as $producto) { ?>
                    <div class="col-md-4">
                        <div class="card mb-4 product-wap rounded-0">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid " src="<?php echo BASE_URL . $producto['urlproducto']?>">
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul class="list-unstyled">
                                        <!-- <li><a class="btn btn-success text-white" href="ShopProducto1Usuario.html"><i class="far fa-heart"></i></a></li> -->
                                        <li><a class="btn btn-success text-white mt-2" href="<?php echo BASE_URL.'principal/detail/'.$producto['idproducto']?>"><i class="far fa-eye"></i></a></li>
                                        <!-- <li><a class="btn btn-success text-white mt-2" href="<?php echo BASE_URL.'principal/CarritoUsuario'?>"><i class="fas fa-cart-plus"></i></a></li> -->
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="shop-single.html" class="h3 text-decoration-none"><?php echo  $producto['nombreproducto'];?></a>
                                <p class="text-center mb-0"><?php echo MONEDA. ' '.  $producto['precioproducto'];?></p>
                            </div>
                        </div>
                    </div>
                    <?php }?>
                </div>
                <!-- <div div="row">
                    <ul class="pagination pagination-lg justify-content-end">
                        <?php 
                        $anterior = $data['pagina'] - 1;
                        $siguiente = $data['pagina'] + 1;
                        $url = BASE_URL. 'principal/shop/';
                        if ($data['pagina']>1){
                            echo '<li class="page-item ">
                            <a class="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0" href="'.$url .$anterior.'">Anterior</a>
                        </li>';
                        }
                        if($data['total'] >= $siguiente){
                            echo '<li class="page-item">
                            <a class="page-link active rounded-0 mr-3 shadow-sm border-top-0 border-left-0 text-white" href="'.$url .$siguiente.'">Siguiente</a>
                        </li>';
                        }
                        ?>

                    </ul>
                </div> -->
            </div>

        </div>
    </div>
    <!-- End Content -->

    <!-- Start Brands -->
    <section class="bg-light py-5">
        <div class="container my-4">
            <div class="row text-center py-3">
                <div class="col-lg-6 m-auto">
                <h1 class="h1">Nuestras Marcas</h1>
                </div>
                <div class="col-lg-9 m-auto tempaltemo-carousel">
                    <div class="row d-flex flex-row">
                        <!--Controls-->
                        <div class="col-1 align-self-center">
                            <a class="h1" href="#multi-item-example" role="button" data-bs-slide="prev">
                                <i class="text-light fas fa-chevron-left"></i>
                            </a>
                        </div>
                        <!--End Controls-->

                        <!--Carousel Wrapper-->
                        <div class="col">
                            <div class="carousel slide carousel-multi-item pt-2 pt-md-0" id="multi-item-example" data-bs-ride="carousel">
                                <!--Slides-->
                                <div class="carousel-inner product-links-wap" role="listbox">

                                    <!--First slide-->
                                    <div class="carousel-item active">
                                        <div class="row">
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/altamiralogo.png" alt=" Logo Altamira"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/neumannlogo.png" alt="Logo Neumann"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/ksblogo.png" alt="Logo Ksbl"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/bamsalogo.png" alt="Logo Bomsa"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <!--End First slide-->

                                    <!--Second slide-->
                                    <div class="carousel-item">
                                        <div class="row">
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/altamiralogo.png" alt=" Logo Altamira" alt="Brand Logo"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/neumannlogo.png" alt="Logo Neumann"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/ksblogo.png" alt="Logo Ksbl"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/bamsalogo.png" alt="Logo Bomsa"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <!--End Second slide-->

                                    <!--Third slide-->
                                    <div class="carousel-item">
                                        <div class="row">
                                        <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/altamiralogo.png" alt=" Logo Altamira" alt="Brand Logo"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/neumannlogo.png" alt="Logo Neumann"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/ksblogo.png" alt="Logo Ksbl"></a>
                                            </div>
                                            <div class="col-3 p-md-5">
                                                <a href="#"><img class="img-fluid brand-img" src="<?php echo BASE_URL?>assets/img/bamsalogo.png" alt="Logo Bomsa"></a>
                                            </div>
                                        </div>
                                    </div>
                                    <!--End Third slide-->

                                </div>
                                <!--End Slides-->
                            </div>
                        </div>
                        <!--End Carousel Wrapper-->


                        <!--Controls-->
                        <div class="col-1 align-self-center">
                            <a class="h1" href="#multi-item-example" role="button" data-bs-slide="next">
                                <i class="text-light fas fa-chevron-right"></i>
                            </a>
                        </div>
                        <!--End Controls-->
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--End Brands-->


    <!-- Start Footer -->
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
                        <li><a class="text-decoration-none" href="#">Motores</a></li>
                        <li><a class="text-decoration-none" href="#">Bombas</a></li>
                        <li><a class="text-decoration-none" href="#">Cable</a></li>
                        <li><a class="text-decoration-none" href="#">Tuberia</a></li>
                        <li><a class="text-decoration-none" href="#">Arrancadores</a></li>
                    </ul>
                </div>

                <div class="col-md-4 pt-5">
                    <h2 class="h2 text-light border-bottom pb-3 border-light">Más Información</h2>
                    <ul class="list-unstyled text-light footer-link-list">
                        <li><a class="text-decoration-none" href="#">Inicio</a></li>
                        <li><a class="text-decoration-none" href="#">Nosotros</a></li>
                        <li><a class="text-decoration-none" href="#">Ubicación</a></li>
                        <li><a class="text-decoration-none" href="#">Contacto</a></li>
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
                            <a class="text-light text-decoration-none" target="_blank" href="http://facebook.com/"><i class="fab fa-facebook-f fa-lg fa-fw"></i></a>
                        </li>
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-light text-decoration-none" target="_blank" href="https://www.instagram.com/seppro_qro/"><i class="fab fa-instagram fa-lg fa-fw"></i></a>
                        </li>
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-light text-decoration-none" target="_blank" href="https://twitter.com/"><i class="fab fa-twitter fa-lg fa-fw"></i></a>
                        </li>
                        <li class="list-inline-item border border-light rounded-circle text-center">
                            <a class="text-light text-decoration-none" target="_blank" href="https://www.linkedin.com/"><i class="fab fa-linkedin fa-lg fa-fw"></i></a>
                        </li>
                    </ul>
                </div>
                <div class="col-auto">
                    <label class="sr-only" for="subscribeEmail">Email</label>
                    <div class="input-group mb-2">
                        <input type="text" class="form-control bg-dark border-light" id="subscribeEmail" placeholder="Correo">
                        <div class="input-group-text btn-success text-light">Registrate</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-100 bg-black py-3">
            <div class="container">
                <div class="row pt-2">
                    <div class="col-12">
                        <p class="text-left text-light">
                            Copyright &copy; 2024 Seppro Qro
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </footer>
    <!-- End Footer -->

    <!-- Start Script -->
    <script src=" assets/js/jquery-1.11.0.min.js"></script>
    <script src=" assets/js/jquery-migrate-1.2.1.min.js"></script>
    <script src=" assets/js/bootstrap.bundle.min.js"></script>
    <script src=" assets/js/templatemo.js"></script>
    <script src=" assets/js/custom.js"></script>
    <!-- End Script -->
</body>

</html>
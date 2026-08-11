<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>

    <!-- Start Banner Hero -->
    <div id="template-mo-zay-hero-carousel" class="carousel slide" data-bs-ride="carousel">
        <ol class="carousel-indicators">
            <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="0" class="active"></li>
            <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="1"></li>
            <li data-bs-target="#template-mo-zay-hero-carousel" data-bs-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="container">
                    <div class="row p-5">
                        <div class="mx-auto col-md-8 col-lg-6 order-lg-last">
                            <img class="img-fluid" src="<?php echo BASE_URL?>assets/img/banner_img_01.png" alt="">
                        </div>
                        <div class="col-lg-6 mb-0 d-flex align-items-center">
                        <div class="text-align-left align-self-center">
                                <h1 class="h1 text-success"><b>SEPPRO</b></h1>
                                <h3 class="h2">Excelencia en Mantenimiento Hidráulico</h3>
                                <p>
                                    Seppro es una empresa líder en el mantenimiento de pozos de agua, comprometida con garantizar la pureza y la eficiencia del suministro hídrico para sus clientes. Con más de 30 años de experiencia en el sector, <Strong>Seppro</Strong> se especializa en servicios integrales que incluyen limpieza, inspección, reparación y optimización de pozos, utilizando tecnología de punta y prácticas sostenibles. Nuestro equipo de expertos está dedicado a proporcionar soluciones confiables y de alta calidad, asegurando que cada pozo mantenga un rendimiento óptimo y una vida útil prolongada. En Seppro, cuidamos el corazón de tu agua para que disfrutes de un suministro seguro y saludable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="container">
                    <div class="row p-5">
                        <div class="mx-auto col-md-8 col-lg-6 order-lg-last">
                            <img class="img-fluid" src="<?php echo BASE_URL?>assets/img/motores-grundfos.png" alt="">
                        </div>
                        <div class="col-lg-6 mb-0 d-flex align-items-center">
                        <div class="text-align-left">
                                <h1 class="h1">¿Por qué elegir a Seppro?</h1>
                                <h3 class="h2"></h3>
                                <p>
                                    Elegir <strong>Seppro</strong> significa optar por calidad y confiabilidad en el mantenimiento de pozos de agua. Nuestros años de experiencia, uso de tecnología avanzada y compromiso con prácticas sostenibles garantizan un servicio excepcional. <Strong>Seppro</Strong> asegura pureza y eficiencia en cada proyecto, respaldado por un equipo de expertos dedicados a optimizar el rendimiento y la durabilidad de tus pozos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <div class="container">
                    <div class="row p-5">
                        <div class="mx-auto col-md-8 col-lg-6 order-lg-last">
                            <img class="img-fluid" src="<?php echo BASE_URL?>assets/img/servicios_seppro.png" alt="">
                        </div>
                        <div class="col-lg-6 mb-0 d-flex align-items-center">
                        <div class="text-align-left">
                                <h1 class="h1">Servicios que Ofrece SEPPRO</h1>
                                <h3 class="h2"></h3>
                                <p>
                                    1.Instalación y Desinstalación de Equipos Sumergibles.</p>
                                    <p>
                                    2.Reparaciones de Equipos Sumergibles.</p>
                                    <p>
                                    3.Monitoreo y Mantenimiento Preventivo.</p>
                                    <p>
                                    4.Venta de Equipamiento para Pozos Profundos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a class="carousel-control-prev text-decoration-none w-auto ps-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="prev">
            <i class="fas fa-chevron-left"></i>
        </a>
        <a class="carousel-control-next text-decoration-none w-auto pe-3" href="#template-mo-zay-hero-carousel" role="button" data-bs-slide="next">
            <i class="fas fa-chevron-right"></i>
        </a>
    </div>
    <!-- End Banner Hero -->


    <!-- Start Categories of The Month -->
    <section class="container py-5">
        <div class="row text-center pt-3">
            <div class="col-lg-6 m-auto">
                <h1 class="h1">Categorias</h1>
            </div>
        </div>
        <div class="row">
            <?php foreach ($data['categorias'] as $categoria){ ?>
            <div class="col-12 col-md-4 p-5 mt-3">
                <a href="<?php echo BASE_URL . 'principal/categorias/' . $categoria['idcategoria'];?>"><img src="<?php echo BASE_URL . $categoria['imagencategoria']?>" class="rounded-circle img-fluid border"></a>
                <h5 class="text-center mt-3 mb-3"><?php echo $categoria['categoria'] ?></h5>
                <p class="text-center"><a class="btn btn-success" href="<?php echo BASE_URL . 'principal/categorias/' . $categoria['idcategoria'];?>">Ir a catalogo</a></p>
            </div>
            <?php }?>
        </div>
    </section>
    <!-- End Categories of The Month -->


    <!-- Start Featured Product -->
    <section class="bg-light">
        <div class="container py-5">
            <div class="row text-center py-3">
                <div class="col-lg-6 m-auto">
                    <h1 class="h1">Productos Nuevos</h1>
                    <p>
                        Nuestros Productos Nuevos
                    </p>
                </div>
            </div>
            <div class="row">
                <?php foreach ($data['nuevosProductos'] as $producto) { ?>
                <div class="col-12 col-md-4 mb-4">
                    <div class="card h-100">
                        <a href="<?php echo BASE_URL . 'principal/detail/' .$producto['idproducto']?>">
                            <img src="<?php echo BASE_URL . $producto['urlproducto']?>" class="card-img-top" alt="<?php echo $producto['nombreproducto'];?>">
                        </a>
                        <div class="card-body">
                            <ul class="list-unstyled d-flex justify-content-between">
                                <li class="text-muted text-right"><?php  echo MONEDA . " " .$producto['precioproducto'];?></li>
                            </ul>
                            <a href="<?php echo BASE_URL . 'principal/detail/' .$producto['idproducto']?>" class="h2 text-decoration-none text-dark"><?php echo $producto['nombreproducto'];?></a>
                            <p class="card-text">
                            <?php echo $producto['descripcionproducto'];?>
                            </p>
                        </div>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>
    </section>
    <!-- End Featured Product -->

<?php include_once 'Views/template-principal/footer.php' ?>
    
</body>

</html>
<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php'?>

    <!-- Open Content -->
    <section class="bg-light">
        <div class="container pb-5">
            <div class="row">
                <div class="col-lg-5 mt-5">
                    <div class="card mb-3">
                    <!-- style="height: 800px; width:550px;" -->
                        <img class="card-img img-fluid"  src="<?php echo BASE_URL . $data['producto']['urlproducto']?>" alt="Imagen del producto" id="imagenproducto">
                    </div>
                </div>
                <!-- col end -->
                <div class="col-lg-7 mt-5">
                    <div class="card">
                        <div class="card-body">
                            <h1 class="h2"><?php echo $data['producto']['nombreproducto'];?></h1>
                            <p class="h3 py-2"><?php echo MONEDA.' '. $data['producto']['precioproducto'];?></p>
                            <ul class="list-inline">
                                <li class="list-inline-item">
                                    <h6>Categoria:</h6>
                                </li>
                                <li class="list-inline-item">
                                    <p class="text-muted"><strong><?php echo $data['producto']['categoria'];?></strong></p>
                                </li>
                            </ul>

                            <h6>Descripcion:</h6>
                            <p><?php echo $data['producto']['descripcionproducto'];?></p>

                            <?php if(!empty($data['sucursales'])) {?>
                                <h6>Sucursales donde esta disponible:</h6>
                                <?php foreach($data['sucursales'] as $sucursal){?>
                                    <p><?php echo $sucursal['nombresucursal'] . ": " . $sucursal['existencia'] ?></p>
                                <?php }?>
                                
                                <h6>Selecciona Sucursal</h6>
                                <form id="seleccionSucursal" class="mb-3" method="POST" action="">
                                        <select class="form-control" id="sucursal" name="sucursal">
                                        <?php foreach($data['sucursales'] as $sucursal){?>
                                            <option value=<?php echo $sucursal['idsucursal']?>><?php echo $sucursal['nombresucursal']?></option>
                                        <?php }?>
                                        </select>
                                        <button type="submit" class="btn btn-primary btn-sm mt-3" name="btnSeleccionSucursal" id="btnSeleccionSucursal">Seleccionar</button>
                                </form>


                                <?php if(!empty($data['sucursal'])) {?>
                                    <form id="agregarCarrito" action="" method="POST">
                                        <!-- <input type="hidden" id="idProducto" value="<?php echo $data['producto']['idproducto'];?>"> -->
                                        <div class="row">
                                            <div class="col-auto">
                                                <p>Estas comprando en: <?php echo $data['sucursal']?></p>
                                                <!-- <p><?php echo $_SESSION['idproducto']?></p>
                                                <p><?php echo $_SESSION['precioproducto']?></p>
                                                <p><?php echo $_SESSION['eleccionSucursal']?></p>
                                                <p><?php echo $_SESSION['idUsuario']?></p> -->
                                                <p>Cantidad</p>
                                                <input type="number" class="form-control mb-3" id="cantidadproducto" name="cantidadproducto" min=1 max=<?php echo $data['existencia']?>  value=1>
                                            </div>
                                        </div>
                                            <?php if(!empty($_SESSION['idUsuario'])) {?>
                                            <div class="row pb-3">
                                                <div class="col d-grid">
                                                    <button type="submit" class="btn btn-success btn-lg btn" id="btnAñadirDeseo" name="btnAñadirDeseo" value="ok" >Agregar a lista de deseos</button>
                                                </div>
                                                <div class="col d-grid">
                                                    <button type="submit" class="btn btn-success btn-lg btn"  id="btnAñadirCarrito" name="btnAñadirCarrito" value="ok">Agregar al Carrito</button>
                                                </div>
                                            </div>
                                            <?php }else{ ?>
                                                <div class="alert alert-warning text-center" role="alert">
                                                    <p>Necesitas iniciar sesion para poder comprar</p>
                                                    <a href="<?php echo BASE_URL.'usuarios/IniciarSesion' ?>" class="alert-link">Iniciar Sesion</a>
                                                </div>
                                            <?php }?>
                                    </form>
                                <?php }?>
                            <?php }else{?>
                                <div class="alert alert-warning text-center" role="alert">
                                    <p>Lo sentimos! No hay existencia en nuestras sucursales</p>
                                    <a href="<?php echo BASE_URL.'principal/shop' ?>" class="alert-link">Volvel al catalogo</a>
                                </div>
                            <?php }?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Close Content -->

    <!-- Start Article -->
    <section class="py-5">
        <div class="container">
            <div class="row text-left p-2 pb-3">
                <h4>Productos Relacionados</h4>
            </div>

            <!--Start relacinados-->
            <div id="carousel-related-product">
                <?php foreach ($data['relacionados'] as $producto) {?>
                <div class="p-2 pb-3">
                    <div class="product-wap card rounded-0">
                        <div class="card rounded-0">
                            <img class="card-img rounded-0 img-fluid" src="<?php echo BASE_URL . $producto['urlproducto']?>">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                <ul class="list-unstyled">
                                        <li><a class="btn btn-success text-white mt-2" href="<?php echo BASE_URL.'principal/detail/'.$producto['idproducto']?>"><i class="far fa-eye"></i></a></li>
                                    </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="<?php echo BASE_URL.'principal/detail/'.$producto['idproducto']?>" class="h3 text-decoration-none"><?php echo $producto['nombreproducto']?></a>
                            <p class="text-center mb-0"><?php echo MONEDA.' '.$producto['precioproducto']; ?></p>
                        </div>
                    </div>
                </div>
                <?php } ?>
            </div>
        </div>
    </section>
    <!-- End Article -->


<?php include_once 'Views/template-principal/footer.php'?>
<script src="<?php echo BASE_URL;?>assets/js/Detail.js"></script>
<script src="<?php echo BASE_URL;?>assets/js/AgregarDeseo.js"></script>

    <!-- Start Slider Script -->
    <script src="<?php echo BASE_URL;?>assets/js/slick.min.js"></script>
    <script>
        $('#carousel-related-product').slick({
            infinite: true,
            arrows: false,
            slidesToShow: 4,
            slidesToScroll: 3,
            dots: true,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 3
                    }
                }
            ]
        });
    </script>
    <!-- End Slider Script -->

</body>

</html>
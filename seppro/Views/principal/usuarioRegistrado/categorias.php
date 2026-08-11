<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>

    <!-- Start Content -->

    <div class="container py-5">
        <div class="row">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-md-6">
                        <ul class="list-inline shop-top-menu pb-3 pt-1">
                            <li class="list-inline-item">
                                <a class="h3 text-dark text-decoration-none mr-3" href="#"><?php echo $data['nombre'];?></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row"><!--Se puede poner otro numero en logar de 4 para hacer mas pequenas los productos-->
                    <?php foreach($data['productos'] as $producto) {?>
                    <div class="col-md-3">
                        <div class="card mb-4 product-wap rounded-0">
                            <div class="card rounded-0">
                                <img class="card-img rounded-0 img-fluid" src="<?php echo BASE_URL . $producto['urlproducto']?>" alt="Imagen del Producto">
                                <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                    <ul class="list-unstyled">
                                        <li><a class="btn btn-success text-white" href="ShopProducto1Usuario.html"><i class="far fa-heart"></i></a></li>
                                        <li><a class="btn btn-success text-white mt-2" href="<?php echo BASE_URL.'principal/detail/'.$producto['idproducto']?>"><i class="far fa-eye"></i></a></li>
                                        <li><a class="btn btn-success text-white mt-2" href="<?php echo BASE_URL.'principal/CarritoUsuario'?>"><i class="fas fa-cart-plus"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="card-body">
                                <a href="<?php echo BASE_URL.'principal/detail'?>" class="h3 text-decoration-none"><?php echo  $producto['nombreproducto'];?></a>
                                <p class="text-center mb-0"><?php echo MONEDA. ' '.  $producto['precioproducto'];?></p>
                            </div>
                        </div>
                    </div>
                    <?php }?>
                </div>
                <div div="row">
                    <ul class="pagination pagination-lg justify-content-end">
                        <?php 
                        $anterior = $data['pagina'] - 1;
                        $siguiente = $data['pagina'] + 1;
                        $url = BASE_URL . 'principal/categorias/';
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
                </div>
            </div>

        </div>
    </div>
    <!-- End Content -->

    <?php include_once 'Views/template-principal/footer.php'?>
</body>

</html>
<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php'?>

    <div class="container mt-5">
        <h1 class="text-center">Carrito de Compras</h1>
        <?php if(!empty($data['carrito'])) {?>
            <div class="table-responsive">
                <table class="table table-bordered mt-3 table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Sucursal</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <?php foreach($data['carrito'] as $carrito) {?>
                        <tbody id="cart-items">
                            <tr>
                                <td><?php echo $carrito['nombreproducto']?></td>
                                <td><?php echo "$" . number_format($carrito['precioproducto'],2) . " " . MONEDA?></td>
                                <td>
                                    <!-- <input type="number" class="form-control quantity-input" value="1" min="1" data-price="134.062,89"> -->
                                    <?php echo $carrito['cantidadproducto']?>
                                </td>
                                <td> <?php echo "$" . number_format($carrito['totalcarrito'],2) . " " . MONEDA?></td>
                                <td> <?php echo $carrito['nombresucursal']?></td>
                                <td>
                                    <a class="btn btn-danger remove-item" id="btnEliminarCarrito" data-id="<?php echo $carrito['idproducto']?>" >Eliminar</a>
                                </td>
                            </tr>
                        </tbody>
                    <?php } ?>
                </table>
            </div>
            <div class="text-right">
                <h3 id="total-price"><?php echo "Subtotal: $" . $data['subtotalcarrito'] ." ". MONEDA?></h3>
                <h3 id="total-price"><?php echo "Iva:$" . $data['ivaCarrito'] ." ". MONEDA?></h3>
                <h3 id="total-price"><?php echo "Total a pagar: $" . $data['totalCarritoPayPal'] ." ". MONEDA?></h3>
                <a class="btn btn-success mt-2" href="<?php echo BASE_URL.'usuarios/CheckoutUsuario' ?>">Comprar</a>

            </div>
        <?php }else{?>
            <div class="alert alert-warning text-center mb-5" role="alert">
            No hay artículos en el carrito
            </div>
        <?php }?>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <?php include_once 'Views/template-principal/footer.php'?>
<script src="<?php echo BASE_URL;?>assets/js/Carrito.js"></script>
</body>

</html>
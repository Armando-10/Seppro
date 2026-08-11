<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php'?>

    <div class="container mt-5">
        <h1 class="text-center">Lista de compras</h1>
        <?php if(!empty($data['comprasUsuario'])) {?>
            <div class="table-responsive">
                <table class="table table-bordered mt-3 table-hover">
                    <thead class="bg-light">
                        <tr>
                            <th>Fecha de la compra</th>
                            <th>Subtotal</th>
                            <th>Iva</th>
                            <th>Total</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <?php foreach($data['comprasUsuario'] as $compras) {?>
                        <tbody id="cart-items">
                            <tr>
                                <td><?php echo $compras['fechaventa']?></td>
                                <td><?php echo "$" . number_format($compras['subtotalventa'],2) . " " . MONEDA?></td>
                                <td><?php echo "$" . number_format($compras['ivaventa'],2) . " " . MONEDA?></td>
                                <td><?php echo "$" . number_format($compras['totalventa'],2) . " " . MONEDA?></td>
                                <td>
                                    <a class="btn btn-primary remove-item" id="btnFactura" data-id-venta="<?php echo $compras['idventa']?>" >Factura</a>
                                </td>
                            </tr>
                        </tbody>
                    <?php } ?>
                </table>
            </div>
            <br>
            <br>
            <br>
        <?php }else{?>
            <div class="alert alert-warning text-center mb-5" role="alert">
            No has realizado compras
            </div>
        <?php }?>
    </div>
    <br>
    <br>
    <br>
    <br>
    <?php include_once 'Views/template-principal/footer.php'?>
<script src="<?php echo BASE_URL;?>assets/js/ComprasUsuario.js"></script>
</body>

</html>
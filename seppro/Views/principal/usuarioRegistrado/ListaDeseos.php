<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php'?>

<div class="container mt-5">
    <h1 class="text-center">Lista de deseos</h1>
    <?php if(!empty($data['listadeseo'])) { ?>
        <div class="table-responsive">
            <table class="table table-bordered mt-3 table-hover">
                <thead class="bg-light">
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <?php foreach($data['listadeseo'] as $deseo) { ?>
                    <tbody id="cart-items">
                        <tr>
                            <td><?php echo $deseo['nombreproducto']?></td>
                            <td><?php echo "$" . number_format($deseo['precioproducto'], 2) . " " . MONEDA?></td>
                            <td>
                                <a class="btn btn-success remove-item " href="<?php echo BASE_URL . 'principal/detail/' . $deseo['idproducto'] ?>">Ver producto</a>
                                <a class="btn btn-danger remove-item" id="btnEliminarDeseo" data-id="<?php echo $deseo['idproducto']?>" >Eliminar</a>
                            </td>
                        </tr>
                    </tbody>
                <?php } ?>
            </table>
        </div>
    <?php } else { ?>
        <div class="alert alert-warning text-center mb-5" role="alert">
            No hay artículos en la lista de deseos.
        </div>
    <?php } ?>
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
<script src="<?php echo BASE_URL;?>assets/js/ListaDeseo.js"></script>
</body>
</html>

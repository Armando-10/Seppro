<?php include_once 'Views/template-principal/headerUsuarioRegistrado.php' ?>

<!-- Checkout Form -->
<div class="container py-5">
    <h2 class="text-center mb-4">Procesar Compra</h2>
    <form>
        <div class="row">
            <!-- Shipping Information -->
            <div class="col-md-6">
                <h4 class="text-center mb-3">Direccion de Envío</h4>
                <!-- <label for="">Deseas usar la direccion guardada?</label>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="mismaUbicacion">
                    <label class="form-check-label" for="sameAsBilling">La dirección de envío es la misma que la de facturación</label>
                </div> -->
                <!--DIVISION -->
                <div class="mb-2">
                    <label for="codigoPostal" class="form-label">Codigo Postal</label>
                    <input type="number" class="form-control" id="codigoPostal" name="codigoPostal" placeholder="Ingrese su codigo postal" required minlength="8">
                </div>
                <div class="mb-2">
                    <label for="ciudad" class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="ciudad" name="ciudad" placeholder="Igrese su Ciudad" required minlength="8">
                </div>
                <div class="mb-2">
                    <label for="estado" class="form-label">Estado</label>
                    <input type="text" class="form-control" id="estado" name="estado" placeholder="Igrese su Estado" required minlength="8">
                </div>
                <div class="mb-2">
                    <label for="colonia" class="form-label">Colonia</label>
                    <input type="text" class="form-control" id="colonia" name="colonia" placeholder="Igrese su Colonia" required minlength="8">
                </div>
                <div class="mb-2">
                    <label for="calle" class="form-label">Calle</label>
                    <input type="text" class="form-control" id="calle" name="calle" placeholder="Igrese su Calle" required minlength="8">
                </div>
                <div class="mb-2">
                    <label for="nexterior" class="form-label">Numero Exterior</label>
                    <input type="text" class="form-control" id="nexterior" name="nexterior" placeholder="Igrese su Numero Exterior">
                </div>
                <div class="mb-2">
                    <label for="ninterior" class="form-label">Numero Interiror (opcional (S/N))</label>
                    <input type="text" class="form-control" id="ninterior" name="ninterior" placeholder="Igrese su Numero Interior">
                </div>
                <div class="mb-2">
                    <label for="rfc" class="form-label">RFC</label>
                    <input type="text" class="form-control" id="rfc" name="rfc" placeholder="Ingresa tu RFC">
                </div>
            </div>
            <!-- Order Summary -->
            <div class="col-md-6">
                <h4 class="text-center mb-3">Resumen del Pedido</h4>
                <div class="card">
                    <div class="card-body">
                        <?php foreach($data['carrito'] as $carrito) {?>
                            <p><?php echo $carrito['nombreproducto'] . " - " . $carrito['cantidadproducto'] . "X$" . number_format($carrito['precioproducto'],2) . " = $" . number_format($carrito['totalcarrito'],2)?></p>
                        <?php }?>
                        <h5>Subtotal:</h5>
                        <p id="subtotalCarrito"><?php echo "$" . $data['subtotalcarrito'] ." ". MONEDA . MONEDA ?></p>

                        <h5>IVA:</h5>
                        <p id="ivaCarrito"><?php echo "$" . $data['ivaCarrito'] . MONEDA ?></p>

                        <h5>Total:</h5>
                        <p id="totalCarrito"><?php echo "$" . $data['totalCarrito'] . MONEDA ?></p>
                    </div>
                </div>

                <?php
                    $productosCarrito = [];
                    foreach ($data['carrito'] as $carrito) {
                        $productosCarrito[] = [
                            'name' => $carrito['nombreproducto'],
                            'quantity' => $carrito['cantidadproducto'],
                            'unit_amount' => [
                                'currency_code' => 'MXN', 
                                'value' => number_format($carrito['precioproducto'],2, '.', '')                  
                            ],
                            'sku' => $carrito['idproducto'], // EL SKU lo uso para obtener el id
                            'description' => $carrito['nombresucursal']
                        ];
                    }

                    // Convertir el array a JSON para poder ocuparlo en js
                    $productosCarritoJSON = json_encode($productosCarrito);
                ?>
                
                <?php if(empty( $_SESSION['cppersona'])) {?>
                <div class="text-center mt-4">
                    <button type="button" class="btn btn-primary btn-lg" id="btnProcesarpedido" name="btnProcesarpedido">Procesar Pedido</button>
                </div>
                <?php }?>

                <?php if(!empty( $_SESSION['cppersona'])) {?>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            PayPal
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <div id="paypal-button-container"></div>
                        </div>
                    </div>
                </div>

                <a href="<?php echo BASE_URL.'usuarios/simularCompra'?>" type="button" class="btn btn-primary btn-lg bt-5" id="btnSimulaPago" name="btnSimulaPago"> Simular Pago</a>
                <?php }?>
            </div>
        </div>
    </form>
</div>

<?php include_once 'Views/template-principal/footer.php' ?>
<script src="https://www.paypal.com/sdk/js?client-id=<?php echo $_SESSION['idUsuario']; ?>&currency=MXN"></script> <!-- Replace YOUR_CLIENT_ID with your actual client ID -->

<script>//debe de estaar declarada la constante de cliente id
    let productosCarritoJSON = <?php echo $productosCarritoJSON; ?>;
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                    currency_code: 'MXN',
                    value: <?php echo $data['totalCarritoPayPal'] ?> ,
                    breakdown: {
                        item_total: {
                            currency_code: 'MXN',
                            value: <?php echo $data['totalCarritoPayPal'] ?> // Este valor debe coincidir con el valor total
                        }
                    }
                },
                items:productosCarritoJSON //La descripcion no deja que sea la miama sucursal ya funciona
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                let fechaVenta = new Date();//me da la fecha de la transaccion
                //Es para que solo me de año, mes y dia, pues sino devuelve hora y todo eso 
                let fechaFormateada = fechaVenta.getFullYear() + '-' + ('0' + (fechaVenta.getMonth() + 1)).slice(-2) + '-' + ('0' + fechaVenta.getDate()).slice(-2);

                //objeto que contendra todos los datos para las funciones 
                let ventaData = {
                fechaventa: fechaFormateada,
                subtotalventa: <?php echo $data['subtotalcarritoPayPal']; ?>,
                ivaventa: <?php echo $data['ivaCarritoPayPal']; ?>,
                totalventa: <?php echo $data['totalCarritoPayPal']; ?>,
                productos: productosCarritoJSON
                };

            agregarVenta(ventaData);
            });
        }
    }).render('#paypal-button-container');


    function agregarVenta(ventaData){
        const fechaventa = ventaData.fechaventa;
        const subtotalventa = ventaData.subtotalventa;
        const ivaventa = ventaData.ivaventa;
        const totalventa = ventaData.totalventa;
        const productos = JSON.stringify(ventaData.productos); // Convertir productos a JSON
        let formData = new FormData();
        formData.append('fechaventa',fechaventa);
        formData.append('subtotalventa',subtotalventa);
        formData.append('ivaventa',ivaventa);
        formData.append('totalventa',totalventa);
        formData.append('productos',productos);
        const url = base_url + 'Usuarios/agregarVenta';
        const http = new XMLHttpRequest();
        http.open('POST', url, true);
        http.send(formData);
        setTimeout(() => {
            window.location.href = base_url + 'usuarios/PerfilUsuario';//recarga la pagina despues de 1s
        }, 500);
    
}
</script>
<script src="<?php echo BASE_URL;?>assets/js/CheckOut.js"></script>

</body>

</html>
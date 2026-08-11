<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

class Usuarios extends Controller // Para que funcionen estas funciones al momento de poner el href en el icono se debe de cambiar despues del punto a el nombre de esta clase
{
    public function __construct()
    {
        parent::__construct();
        session_start();
    }

    public function index(){

    }

    public function IniciarSesion(){//Pantalla
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
        }
        $data['title'] = 'Inicio de Sesion';
        $this->views->getView('principal/usuarioNoRegistrado','IniciarSesion',$data);
    }
    public function Registro(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
        }
        $data['title'] = 'Registro de Usuario';
        $this->views->getView('principal/usuarioNoRegistrado','Registro',$data);
    }

    public function jaj(){
        $data['persona'] = $this->model->getIdPersona('pruebas12901290@gmail.com');
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        $datos = $this->model->confirmarExistencia('pruebas12901290@gmail.com');
        $data['nombre'] = $datos['nombrepersona'];
        $data['title'] = 'Registro de Usuario';
        $this->views->getView('principal/usuarioNoRegistrado','jaj',$data);
    }

    public function Registrarse(){
        if ($_SERVER['REQUEST_METHOD'] === 'POST' ) {
            if (empty($_POST['nombre']) || //Debe de tener el name de append no de el formulario
                empty($_POST['apaterno']) ||
                empty($_POST['correo']) ||
                empty($_POST['usuario']) ||
                empty($_POST['contraseña']) ||
                empty($_POST['confirmarContraseña']) ||
                empty($_POST['telefono'])) {
                $mensaje = array('msg' => 'TODOS LOS CAMPOS SON REQUERIDOS', 'icono' => 'warning');
            } else {
                $nombreUsuario = $_POST['nombre'];
                $apUsuario = $_POST['apaterno'];
                $amUsuario = isset($_POST['amaterno']) ? $_POST['amaterno'] : "null";
                $correoUsuario = $_POST['correo'];
                $usuarioUsuario = $_POST['usuario'];
                $contraseñaUsuario = $_POST['contraseña'];
                $confirmarContraseña = $_POST['confirmarContraseña'];
                $telefonoUsuario = $_POST['telefono'];

                $confirmarExistencia = $this->model->confirmarExistencia($correoUsuario);
    
                if (empty($confirmarExistencia)){//esto es si esta vacia la variable
                    if ($contraseñaUsuario == $confirmarContraseña) {
                        $contraseñaUsuario = password_hash($contraseñaUsuario, PASSWORD_DEFAULT);
                        $data = $this->model->registroPersona($nombreUsuario, $apUsuario, $amUsuario, $correoUsuario, $telefonoUsuario);
                        $data = $this->model->registroUsuario($correoUsuario,$usuarioUsuario, $contraseñaUsuario);
                        if ($data > 0) {//Esto falta
                            $_SESSION['usuarioUsuario'] = $_POST['usuario'];
                            $_SESSION['nombreUsuario'] = $_POST['nombre'];
                            $_SESSION['apUsuario'] = $_POST['apaterno'];
                            $_SESSION['amUsuario'] = isset($_POST['amaterno']) ? $_POST['amaterno'] : "null";
                            $_SESSION['correoUsuario'] = $_POST['correo'];
                            $_SESSION['telefonoUsuario'] = $_POST['telefono'];
                            $_SESSION['idUsuario'] = $this->model->getIdPersona($correoUsuario);
                            $mensaje = array('msg' => 'Registrado con Éxito', 'icono' => 'success','idpersona' => $_SESSION['idUsuario']); //es aqui el idpersona solo cambia orden de data 
                        } else {
                            $mensaje = array('msg' => 'Error al Registrarse', 'icono' => 'error');
                        }
                    } else {
                        $mensaje = array('msg' => 'La contraseña debe de ser la misma', 'icono' => 'error');
                    }
                } else {
                    $mensaje = array('msg' => 'YA TIENES UNA CUENTA', 'icono' => 'warning');
                }
            }
            echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(array('msg' => 'Método de solicitud no permitido', 'icono' => 'error'), JSON_UNESCAPED_UNICODE);
        }
    }

    public function enviarCorreo(){
        if (isset($_POST['correo']) && isset($_POST['idpersona'])) {
            $mail = new PHPMailer(true);

            try {
                //Server settings
                $mail->SMTPDebug = 0;                      //Enable verbose debug output
                $mail->isSMTP();                                            //Send using SMTP
                $mail->Host       = HOST_SMTP;                     //Set the SMTP server to send through
                $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
                $mail->Username   = USER_SMTP;                     //SMTP username
                $mail->Password   = PASS_SMTP;                               //SMTP password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
                $mail->Port       = PUERTO_SMTP;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

                //Recipients
                $mail->setFrom('pruebas12901290@gmail.com', TITLE);
                $mail->addAddress($_POST['correo']);     //Add a recipient


                //Content
                $mail->isHTML(true);                                  //Set email format to HTML
                $mail->Subject = 'Mensaje desde ' . TITLE;
                $mail->Body    = 'Para Verificar tu correo en nuestra Tienda da <a href="' . BASE_URL . 'Usuarios/verificarCorreo/' . $_POST['idpersona'] . '">CLIC AQUÍ </a>';
                $mail->AltBody = 'Gracias por la preferencia a nuestra tienda y ser nuestro cliente';

                $mail->send();
                $mensaje = array('msg' => 'CORREO ENVIADO, REVISA TU BANDEJA DE ENTRADA-SPAM', 'icono' => 'success');
            } catch (Exception $e) {
                $mensaje = array('msg' => 'ERROR AL ENVIAR CORREO: ' . $mail->ErrorInfo, 'icono' => 'error');
            }
        } else {
            $mensaje = array('msg' => 'ERROR FATAL ', 'icono' => 'error');
        }
        echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        die();
    }
    //YA MANDA CORREO SOLO FALTA EL CLICK AQUI 
    public function verificarCorreo($idpersona){
        $this->model->actualizarEstatus($idpersona);
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
            $data['confirmarVerificacionPre'] = $this->model->confirmarVerificacion($_SESSION['idUsuario']);
            $data['confirmarVerificacion']  = $data['confirmarVerificacionPre']['estatus'];
        }
        $data['title'] = 'Perfil de Usuario';
        $this->views->getView('principal/usuarioRegistrado','PerfilUsuario',$data);
    }

    public function Iniciar(){//FUncion de iniciar sesion
        if ($_SERVER['REQUEST_METHOD'] === 'POST' ) {
            if (empty($_POST['correoInicioSesion']) || empty($_POST['contraseñaInicioSesion'])) {
                $mensaje = array ('msg'=> 'TODOS LOS CAMPOS SON REQUERIDOS', 'icono'=>'warning');//nonono
            } else {
                $correoInicioSesion = $_POST['correoInicioSesion'];//el post es el javascrip que manda llamar 
                $contraseñaInicioSesion = $_POST['contraseñaInicioSesion'];
                $confirmarExistencia = $this->model->confirmarExistenciaUser($correoInicioSesion);
                $confirmarExistenciaPersona = $this->model->confirmarExistencia($correoInicioSesion);
                if (!empty($confirmarExistenciaPersona)) {
                    if (password_verify($contraseñaInicioSesion, $confirmarExistencia['contraseña']) || $confirmarExistencia['contraseña'] == $contraseñaInicioSesion) {
                        $datos = $this->model->confirmarExistencia($correoInicioSesion);
                        $_SESSION['nombreUsuario'] = $datos['nombrepersona'];
                        $_SESSION['apUsuario'] = $datos['apaternopersona'];
                        $_SESSION['amUsuario'] = $datos['amaternopersona'];
                        $_SESSION['correoUsuario'] = $datos['correopersona'];
                        $_SESSION['telefonoUsuario'] = $datos['telefonopersona'];
                        $_SESSION['usuarioUsuario'] = $confirmarExistencia['usuario'];
                        $_SESSION['idUsuario'] = $this->model->getIdPersona($correoInicioSesion);
                        $mensaje = array ('msg'=> 'SESION INICIADA CORRECTAMENTE', 'icono'=>'success');
                    } else {
                        $mensaje = array ('msg'=> 'CONTRASEÑA INCORRECTA', 'icono'=>'error');
                    }
                    
                } else {
                    $mensaje = array ('msg'=> 'EL CORREO NO EXISTE', 'icono'=>'warning');
                }
            }
            echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
            die();
        }
    }

    public function salir(){
        session_destroy();
        header('Location: '. BASE_URL);
    }
    public function PerfilUsuario(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
                    //Saber cuantos articulos hay en la lista de deseos
        $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
        $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
            $data['confirmarVerificacionPre'] = $this->model->confirmarVerificacion($_SESSION['idUsuario']);
            $data['confirmarVerificacion']  = $data['confirmarVerificacionPre']['estatus'];
        }
        $data['title'] = 'Perfil de Usuario';
        $this->views->getView('principal/usuarioRegistrado','PerfilUsuario',$data);
    }


    //Carrito Usuario 
    public function CarritoUsuario(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
                
            //obtener el productos en el carrito
            $data['carrito'] = $this->model->getCarrito($_SESSION['idUsuario']);
            //obtener el precio total del carrito sin iva ni nada
            $data['totalCarritoPre'] = $this->model->getTotalCarrito($_SESSION['idUsuario']);

            //Se hizo el Pre para poder fromatear los numeros oues no deja hacer operaciones si estan formateados 
            $data['subtotalcarritoPre'] = $data['totalCarritoPre']['total'];//checar que este en el script de paypal
            $data['subtotalcarrito'] = number_format($data['subtotalcarritoPre']/1.16,2);

            $data['ivaCarritoPre'] = $data['subtotalcarritoPre'];
            $data['ivaCarrito'] = number_format($data['totalCarritoPre']['total'] - $data['subtotalcarritoPre']/1.16,2);

            $data['totalCarritoPayPal'] = number_format($data['totalCarritoPre']['total'],2);

            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

        }

        $data['title'] = 'Carrito';
        $this->views->getView('principal/usuarioRegistrado','CarritoUsuario',$data);
    }

    //Eliminar producto del carrito
    public function EliminarCarrito(){
        $this->model->eliminarCarrito($_SESSION['idUsuario'],$_POST['idproducto']);//esto viene del js
        // $mensaje = array('msg' => 'YA TIENES UNA CUENTA', 'icono' => 'warning');
        // echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        // $data['title'] = 'Carrito'; ESTO NO DEBE DE ESTAR SI SE QUIERE QUE FUNCIONE LO DE ARRIBA
        // $this->views->getView('principal/usuarioRegistrado','CarritoUsuario',$data);
        // $mensaje = array('msg' => 'YA TIENES UNA CUENTA', 'icono' => 'warning');
        // echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        //Estas haciendo que se elimine un prodicto de carrito ya sabes como mandar el id, solo debes de ver como hacer para que se haga esta funcion al dar al boton el el js 
    }

    //Eliminar producto del carrito
    public function EliminarDeseo(){
        $this->model->eliminarDeseo($_SESSION['idUsuario'],$_POST['idproducto']);//esto viene del js
        // $mensaje = array('msg' => 'YA TIENES UNA CUENTA', 'icono' => 'warning');
        // echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        // $data['title'] = 'Carrito'; ESTO NO DEBE DE ESTAR SI SE QUIERE QUE FUNCIONE LO DE ARRIBA
        // $this->views->getView('principal/usuarioRegistrado','CarritoUsuario',$data);
        // $mensaje = array('msg' => 'YA TIENES UNA CUENTA', 'icono' => 'warning');
        // echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
        //Estas haciendo que se elimine un prodicto de carrito ya sabes como mandar el id, solo debes de ver como hacer para que se haga esta funcion al dar al boton el el js 
    }

    //vista Check out
    public function CheckoutUsuario(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
            //obtener el productos en el carrito
            $data['carrito'] = $this->model->getCarrito($_SESSION['idUsuario']);
            //obtener el precio total del carrito sin iva ni nada
            $data['totalCarritoPre'] = $this->model->getTotalCarrito($_SESSION['idUsuario']);


            //Se hizo el Pre para poder fromatear los numeros oues no deja hacer operaciones si estan formateados 
            $data['subtotalcarritoPre'] = $data['totalCarritoPre']['total'];//checar que este en el script de paypal
            $data['subtotalcarrito'] = number_format($data['subtotalcarritoPre']/1.16,2);
            $data['subtotalcarritoPayPal'] = number_format($data['subtotalcarritoPre']/1.16,2, '.', '');//Hice uno de paypal para poder mandarselo a paypal en su formato

            $data['ivaCarritoPre'] = $data['subtotalcarritoPre'];
            $data['ivaCarrito'] = number_format($data['totalCarritoPre']['total'] - $data['subtotalcarritoPre']/1.16,2);
            $data['ivaCarritoPayPal'] = number_format($data['totalCarritoPre']['total'] - $data['subtotalcarritoPre']/1.16,2, '.', '');

            $data['totalCarrito'] = number_format($data['totalCarritoPre']['total'],2);
            $data['totalCarritoPayPal'] = number_format($data['totalCarritoPre']['total'],2, '.', '');//debe de tener ese punto para que lo acepte paypal
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

        }
        $data['title'] = 'Check Out';
        $this->views->getView('principal/usuarioRegistrado','CheckoutUsuario',$data);
    }
    
    //Funcion para agregar direccion
    public function agregarDireccion(){
        $_SESSION['cppersona'] = $_POST['codigoPostal'];
        $cppersona = $_POST['codigoPostal'];
        $ciudadpersona = $_POST['ciudad'];
        $estadopersona = $_POST['estado'];
        $coloniapersona = $_POST['colonia'];
        $callepersona = $_POST['calle'];
        $nexteriorpersona = $_POST['nexterior'];
        $ninteriorpersona = $_POST['ninterior'];
        $rfcpersona = $_POST['rfc'];
        $idpersona = $_SESSION['idUsuario'];

        $this->model->agregarDireccion($cppersona,$ciudadpersona,$estadopersona,$coloniapersona,$callepersona,$nexteriorpersona,$ninteriorpersona,$rfcpersona,$idpersona);

        $mensaje = array ('msg'=> 'Direccion guardada', 'icono'=>'success');
        echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);

    }



    //Funcion para guardar la venta 
    public function agregarVenta(){
        $fechaventa = $_POST['fechaventa'];
        $subtotalventa = $_POST['subtotalventa'];
        $ivaventa = $_POST['ivaventa'];
        $totalventa = $_POST['totalventa'];
        $idpersona = $_SESSION['idUsuario'];
        $this->model->agregarVenta($fechaventa,$subtotalventa,$ivaventa,$totalventa,$idpersona);

        $productos = json_decode($_POST['productos'], true); // Decodificar JSON a array
        if (is_array($productos)) {
            // Iterar sobre cada producto
            foreach ($productos as $producto) {
                // Obtener los datos por cada producto
                $cantidadproducto = $producto['quantity'];
                $precioproducto = $producto['unit_amount']['value'];
                $idproducto = $producto['sku'];
                $nombresucursal = $producto['description'];

                $idsucursal['idsucursalPre'] = $this->model->getIdSucursal($nombresucursal);
                $idsucursal['idsucursal'] = $idsucursal['idsucursalPre']['idsucursal'];


                $idventa['idventaPre']=$this->model->getIdVenta($idpersona);
                $idventa['idventa']=$idventa['idventaPre']['idventa'];


                $this->model->agregarDetalleVenta($idventa['idventa'],$idproducto,$cantidadproducto,$precioproducto,$idsucursal['idsucursal']);

                $data['stock'] = $this->model->getStockMax($idsucursal['idsucursal'],$idproducto);
                $data['existencia'] = $data['stock']['existencia'];

                $stockActializado = $data['existencia'] - $cantidadproducto;

                $this->model->actualizarStock($stockActializado,$idproducto,$idsucursal['idsucursal']);

                $this->model->eliminarCarrito($idpersona,$idproducto);

            }
        }

    }

    public function simularCompra(){
    if(!empty($_SESSION['idUsuario'])){
        //Saber cuantos articulos hay en el carrito
        $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
        $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
        //obtener el productos en el carrito
        $data['carrito'] = $this->model->getCarrito($_SESSION['idUsuario']);
        //obtener el precio total del carrito sin iva ni nada
        $data['totalCarritoPre'] = $this->model->getTotalCarrito($_SESSION['idUsuario']);

        //Se hizo el Pre para poder fromatear los numeros oues no deja hacer operaciones si estan formateados 
        $data['subtotalcarritoPre'] = $data['totalCarritoPre']['total'];//checar que este en el script de paypal
        $data['subtotalcarrito'] = number_format($data['subtotalcarritoPre']/1.16,2);
        $data['subtotalcarritoPayPal'] = number_format($data['subtotalcarritoPre']/1.16,2, '.', '');//Hice uno de paypal para poder mandarselo a paypal en su formato

        $data['ivaCarritoPre'] = $data['subtotalcarritoPre'];
        $data['ivaCarrito'] = number_format($data['totalCarritoPre']['total'] - $data['subtotalcarritoPre']/1.16,2);
        $data['ivaCarritoPayPal'] = number_format($data['totalCarritoPre']['total'] - $data['subtotalcarritoPre']/1.16,2, '.', '');

        $data['totalCarrito'] = number_format($data['totalCarritoPre']['total'],2);
        $data['totalCarritoPayPal'] = number_format($data['totalCarritoPre']['total'],2, '.', '');//debe de tener ese punto para que lo acepte paypal

        }

        $fechaventa = '2024-08-06';
        $subtotalventa = $data['subtotalcarritoPayPal'];
        $ivaventa = $data['ivaCarritoPayPal'];
        $totalventa = $data['totalCarritoPayPal'];
        $idpersona = $_SESSION['idUsuario'];
        $this->model->agregarVenta($fechaventa,$subtotalventa,$ivaventa,$totalventa,$idpersona);

        foreach ($data['carrito'] as $carrito) {
            // Obtener los datos por cada producto
            $cantidadproducto = $carrito['cantidadproducto'];
            $precioproducto = $carrito['precioproducto'];
            $idproducto = $carrito['idproducto'];
            $nombresucursal = $carrito['nombresucursal'];

            $idsucursal['idsucursalPre'] = $this->model->getIdSucursal($nombresucursal);
            $idsucursal['idsucursal'] = $idsucursal['idsucursalPre']['idsucursal'];


            $idventa['idventaPre']=$this->model->getIdVenta($idpersona);
            $idventa['idventa']=$idventa['idventaPre']['idventa'];


            $this->model->agregarDetalleVenta($idventa['idventa'],$idproducto,$cantidadproducto,$precioproducto,$idsucursal['idsucursal']);

            $data['stock'] = $this->model->getStockMax($idsucursal['idsucursal'],$idproducto);
            $data['existencia'] = $data['stock']['existencia'];

            $stockActializado = $data['existencia'] - $cantidadproducto;

            $this->model->actualizarStock($stockActializado,$idproducto,$idsucursal['idsucursal']);

            $this->model->eliminarCarrito($idpersona,$idproducto);

        }
        $data['title'] = 'Check Out';
        $this->views->getView('principal/usuarioRegistrado','CheckoutUsuario',$data);

    }

    //Lsita de deseos
    public function ListaDeseos(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        //obtener el productos en el carrito
        $data['listadeseo'] = $this->model->getListaDeseo($_SESSION['idUsuario']);

        //Saber cuantos articulos hay en el carrito
        $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
        $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

        //Saber cuantos articulos hay en la lista de deseos
        $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
        $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];

        $data['totalCarritoPre'] = $this->model->getTotalCarrito($_SESSION['idUsuario']);


        $data['title'] = 'Lista de deseos';
        $this->views->getView('principal/usuarioRegistrado',"ListaDeseos",$data);

    }

    //Carrito Usuario 
    public function ComprasUsuario(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber las compras de la persona
            $data['comprasUsuario']  = $this->model->getCompras($_SESSION['idUsuario']);

            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];


        }

        $data['title'] = 'Mis Compras';
        $this->views->getView('principal/usuarioRegistrado','ComprasUsuario',$data);
    }

    public function DescargarPDF(){
        $idventa = $_SESSION['idventa'];

        $data['persona'] = $this->model->getpersona($_SESSION['idUsuario']);
        $data['rfc'] = $data['persona']['rfcpersona'];

        $data['detallesventa'] = $this->model->getDetalleVenta($idventa);
        $data['totales'] = $this->model->getCompra($idventa);
        $data['subtotal'] = $data['totales']['subtotalventa'];
        $data['iva'] = $data['totales']['ivaventa'];
        $data['total'] = $data['totales']['totalventa'];

        $data['title'] = 'Descargar Factura';
        $this->views->getView('principal/usuarioRegistrado','DescargarPDF',$data);
    }

    public function obtenerventa(){
        $_SESSION['idventa'] = $_POST['idventa'];//NO se puede obtener un post de js si tiene un getview
    }
    
}
?>
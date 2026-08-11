<?php
class Principal extends Controller
{
    public function __construct()
    {
        parent::__construct();
        session_start();
    }

    public function index()
    {

    }
    //Vistas de paginas
    //Vista About
    public function about(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }
        $data['title'] = 'Acerca de Nosotros';
        $this->views->getView('principal/usuarioRegistrado','about',$data);
    }
    
    //Vista Shop
    public function shop($page){
        $pagina = (empty($page)) ? 1 :$page;
        $porPagina = 6;
        $desde = ($pagina - 1)* $porPagina;
        $data['productos'] = $this->model->getProductos($desde,$porPagina);
        $data['pagina'] = $pagina;
        $total = $this->model->getTotalProductos();
        $data['total'] = ceil($total['total']/ $porPagina);
        //Filtar por categoria
        $data['categorias'] = $this->model->getCategorias();       
        $data['title'] = 'Nuestros Productos';
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }
        $this->views->getView('principal/usuarioRegistrado','shop',$data);
    }

    public function shopCategoria($idcategoria){//Esto es para que en el catalogo funcione el filtro
        $data['categorias'] = $this->model->getCategorias();   
        $data['produ'] = $this->model->getProductosCategoria($idcategoria);
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }
        $data['title'] = 'Nuestros Productos';
        $this->views->getView('principal/usuarioRegistrado','shopCategoria',$data);
    }


    public function categorias($datos,){
        $id_categoria =1;
        $page = 1;
        $array = explode(',',$datos);
        if(isset($array[0])){
            if(!empty($array[0])){
                $id_categoria = $array [0];
            }
        }
        if(isset($array[1])){
            if(!empty($array[1])){
                $page = $array [1];
            }
        }
        $pagina = (empty($page)) ? 1 :$page;
        $porPagina = 16;
        $desde = ($pagina - 1)* $porPagina;
        $data['pagina'] = $pagina;
        $total = $this->model->getTotalProductosCat($id_categoria,$desde,$porPagina);
        $data['total'] = ceil($total['total']/ $porPagina);
        $data['productos'] = $this->model->getProductosCat($id_categoria,$desde,$porPagina);
        $data['title'] = 'Categorias';
        $data['id_categoria'] = $id_categoria;
        //obtener categoria
        $data['categoria'] = $this->model->getCategoria($id_categoria);
        $data['nombre'] = $data['categoria']['categoria'];
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }
        $this->views->getView('principal/usuarioRegistrado','categorias',$data);
    }

    //Vista Contact
    public function contact(){
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
        }
        $data['title'] = 'Contacto';
        $this->views->getView('principal/usuarioRegistrado','contact',$data);
    }

    public function jaj(){
        $data['title'] = 'Registro de Usuario';
        $this->views->getView('principal/usuarioRegistrado','hohoh',$data);
    }

    //Vista detail
    public function detail($id_producto){
        $data['producto'] = $this->model->getProducto($id_producto);
        $_SESSION['idproducto'] = $data['producto']['idproducto'];
        $_SESSION['precioproducto'] = $data['producto']['precioproducto'];
        $id_categoria = $data['producto']['idcategoria'];
        $data['relacionados'] = $this->model->getAleatorios($id_categoria,$data['producto']['idproducto']);
        //Obtener ducrusales en donde esta  disponible el producto y obtenr el stock de cada sucursal
        $data['sucursales'] = $this->model->getSucursalesDisponibles($id_producto);  
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(!empty($_POST['btnAñadirCarrito'])){
                //Esto de momento asi porque estaba dando error en lo de existencia,si da tiempo lo corrijo :)
                $data['sucudatos'] = $this->model->getSucursal($_SESSION['eleccionSucursal']);
                $data['sucursal'] = $data['sucudatos']['nombresucursal'];
                $data['stock'] =$this->model->getStockMax($_SESSION['eleccionSucursal'],$id_producto);
                $data['existencia'] = $data['stock']['existencia'];
            }else{
            //Para poner en que sucursal esta comprando
            $_SESSION['eleccionSucursal'] = $_POST['sucursal'];
            //Esto es del formulario de eleccion de suucursal 
            $data['stock'] =$this->model->getStockMax($_SESSION['eleccionSucursal'],$id_producto);
            $data['existencia'] = $data['stock']['existencia'];


            $data['sucudatos'] = $this->model->getSucursal($_SESSION['eleccionSucursal']);
            $data['sucursal'] = $data['sucudatos']['nombresucursal'];//Esto en detail se puede hacer con el empty porque no se esta corriendo la funcion devolvindo el array o false, esta quedando vacia pues no hay $_SESSION['eleccionSucursal'] 
            }
        }
        $data['categorias'] = $this->model->getCategorias(); //para el footer
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];

            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }
        $data['title'] = $data['producto']['nombreproducto'];
        $this->views->getView('principal/usuarioRegistrado','detail',$data);
    }

    public function agregarCarrito(){    //Esta funcion es para agregar al carrito y que aparezca el mensaje a traves de Detail.js
        if ($_SERVER['REQUEST_METHOD'] === 'POST' ) {    
            $cantidadproducto = $_POST['cantidadproducto1'];//Viene del Detail.js
            $precioproducto = $_SESSION['precioproducto'];//viene de detail
            $idproducto = $_SESSION['idproducto'];
            $idsucursal =  $_SESSION['eleccionSucursal'];//Viene del detail arriba 
            $idusuario = $_SESSION['idUsuario'];

            $data['exitenciaCarritoPre'] = $this->model->existenciaCarrito($idusuario,$idproducto,$idsucursal);//Si la consulta no encuentra datos devuelve false 
            if($data['exitenciaCarritoPre'] == false){
                $this->model->agregarCarrito($idusuario,$idsucursal,$idproducto,$precioproducto,$cantidadproducto);
                $mensaje = array ('msg'=> 'Producto agregado al carrito', 'icono'=>'success');
            }else{
                $mensaje = array ('msg'=> 'EL producto ya esta en el carrito en la sucursal seleccionada', 'icono'=>'warning');
            }
        }
        echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
    }

    
    public function agregarDeseo1(){    //Esta funcion es para agregar al carrito y que aparezca el mensaje a traves de Detail.js 
        $idproducto = $_SESSION['idproducto'];
        $idusuario = $_SESSION['idUsuario'];

        $data['exitenciaDeseosPre'] = $this->model->existenciaDeseos($idusuario,$idproducto);//Si la consulta no encuentra datos devuelve false
                    
        if($data['exitenciaDeseosPre'] == false){
            $this->model->agregarDeseo($idusuario,$idproducto);
            $mensaje = array ('msg'=> 'Producto agregado a la lista de deseos', 'icono'=>'success');
        }else{
            $mensaje = array ('msg'=> 'EL producto ya esta en la lista de deseos', 'icono'=>'warning');
        }
        echo json_encode($mensaje, JSON_UNESCAPED_UNICODE);
    }

    const IVA = 0.16;



    // public function listaCarrito(){
    //     $datos = file_get_contents('php://input');
    //     $json = json_decode($datos, true);
    //     $array ['productos'] = array();
    //     $total = 0.00;
    //     foreach ($json as $producto) {
    //         $result = $this->model->getProducto($producto['idProducto']);
    //         $data['id'] = $result['id'];
    //         $data['nombre'] = $result['nombre'];
    //         $data['precio'] = $result['precio'];
    //         $data['cantidad'] = $producto['cantidad'];
    //         $data['imagen'] = $result['imagen'];
    //         $subTotal = $result['precio'] * $producto['cantidad'];
    //         $data['subtotal'] = number_format($subTotal,2);
    //         array_push($array['productos'],$data);
    //         $total += $subTotal;
    //     }
    //     $array['total'] = number_format($total,2);
    //     $array['moneda'] =  MONEDA;
    //     echo json_encode($array , JSON_UNESCAPED_UNICODE);
    //     die();
    // }
    
    // //Administrador
    // public function indexAdministrador(){
    //     $data['title'] = 'Administador';
    //     $this->views->getView('principal/administrador','IndexAdministrador',$data);
    // }
    
    // public function SeleccionarSucursalAdministrador(){
    //     $data['title'] = 'Sucursales';
    //     $this->views->getView('principal/administrador','SeleccionarSucursalAdministrador',$data);
    // }
    // public function SucursalQueretaroAdministrador(){
    //     $data['title'] = 'Sucursal-Queretaro';
    //     $this->views->getView('principal/administrador','SucursalQueretaroAdministrador',$data);
    // }
    // public function ProductosQueretaro(){
    //     $data['title'] = 'Productos-Queretaro';
    //     $this->views->getView('principal/administrador','ProductosQueretaro',$data);
    // }
    // public function AgregarProductosQueretaro(){
    //     if(!empty($_POST['btnhola'])){ 
    //         $nombreProducto = isset($_POST['nombreProducto']) ? $_POST['nombreProducto'] : "null";
    //         $descProducto = isset($_POST['descProducto']) ? $_POST['descProducto'] : "null";
    //         $categoriaProducto = isset($_POST['categoriaProducto']) ? $_POST['categoriaProducto'] : "null";
    //         $precioProducto = isset($_POST['precioProducto']) ? $_POST['precioProducto'] : "null";
    //         $costoProducto = isset($_POST['costoProducto']) ? $_POST['costoProducto'] : "null";
    //         if(isset($_FILES['urlProducto'])){
    //             $urlProducto = $_FILES['urlProducto']['name'];
    //             $direccionTemporal = $_FILES['urlProducto']['tmp_name'];
    //             $direccionProducto = 'assets/img/';
    //             $direccionProductoActualizada = $direccionProducto . $urlProducto;
    //             // basename($urlProducto); esto es para obtener el nombre solamente de la imagen 
    //             $imagenSize = getimagesize($direccionTemporal);
    //             $ancho = $imagenSize[0];
    //             $largo =  $imagenSize[1];
    //             $anchoNuevo = 512;
    //             $largoNuevo = 512;
    //             switch ($imagenSize['mime']) {
    //                 case 'image/jpeg':
    //                     $imagenOriginal = imagecreatefromjpeg($direccionTemporal);
    //                     break;
    //                 case 'image/png':
    //                     $imagenOriginal = imagecreatefrompng($direccionTemporal);
    //                     break;
    //                 default:
    //                     echo "Tipo de imagen no soportado";
    //                 exit;
    //             }
    //             $imagenRedimensionada = imagecreatetruecolor($anchoNuevo,$largoNuevo);
    //             imagecopyresampled($imagenRedimensionada,$imagenOriginal,0,0,0,0,$anchoNuevo,$largoNuevo,$ancho,$largo);
    //             // move_uploaded_file($direccionTemporal,$direccionProductoActualizada); una forma de mover imagen
    //             switch ($imagenSize['mime']) {
    //                 case 'image/jpeg':
    //                     imagejpeg($imagenRedimensionada, $direccionProductoActualizada);
    //                     break;
    //                 case 'image/png':
    //                     imagepng($imagenRedimensionada, $direccionProductoActualizada);
    //                     break;
    //             }

    //         }else{
    //             $direccionProductoActualizada = "null";
    //         }
    //         $this->model->agregarProductos($nombreProducto, $descProducto, $precioProducto, $costoProducto, $direccionProductoActualizada,$categoriaProducto);  
    //         $data['title'] = 'Productos-Queretaro';
    //         $this->views->getView('principal/administrador','hola',$data);
    //     }else{
        
    //     $data['categorias'] = $this->model->getCategorias();
    //     $data['title'] = 'Agregar Productos';
    //     $this->views->getView('principal/administrador','AgregarProductosQueretaro',$data);
    //     }
    // }

    // public function EliminarProductosQueretaro(){
    //     $data['title'] = 'Eliminar Productos';
    //     $this->views->getView('principal/administrador','EliminarProductosQueretaro',$data);
    // }
}
?>
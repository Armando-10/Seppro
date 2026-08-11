<?php
class Home extends Controller
{
    public function __construct()
    {
        parent::__construct();
        session_start();
    }

    public function index()
    {
        $data['title'] = 'Pagina Principal';
        $data['categorias'] = $this->model->getCategorias();
        $data['nuevosProductos'] = $this->model->getNuevosProductos();
        if(!empty($_SESSION['idUsuario'])){
            //Saber cuantos articulos hay en el carrito
            $data['cantidadCarritoPre'] = $this->model->getCantidadCarrito($_SESSION['idUsuario']);
            $data['cantidadCarrito'] = $data['cantidadCarritoPre']['cantidadCarrito'];
            //Saber cuantos articulos hay en la lista de deseos
            $data['cantidadDeseosPre'] = $this->model->getCantidadDeseos($_SESSION['idUsuario']);
            $data['cantidadDeseos'] = $data['cantidadDeseosPre']['cantidadDeseos'];
        }

        $this->views->getView('home','index',$data);
    }
    public function footer()
    {
        $data['categorias'] = $this->model->getCategorias();
    }

}

?>
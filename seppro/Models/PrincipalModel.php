<?php
class PrincipalModel extends Query{ //Se requiere lo del Model en controler
    public function __construct()
    {
        parent::__construct();
    }

    //Se van a agregar los datos consultados de los productos
    public function  getProducto($id_producto){
        $sql =("SELECT p.*, c.categoria FROM producto p INNER JOIN categoria c ON p.idcategoria = c.idcategoria WHERE p.idproducto = $id_producto;");
        return $this->select($sql);
    }

    //obtiene el total de los productos
    public function getProductos($desde, $porPagina){
        $sql = "SELECT * FROM producto where estatus = 1 LIMIT $desde,$porPagina";
        return $this->selectAll($sql);
    }

    //obtener los productos para la apginacion
    public function getTotalProductos(){
        $sql = "SELECT COUNT(*) AS total FROM producto";
        return $this->select($sql);
    }

    //Productos relacionados con la categoria
    public function getProductosCat($id_categoria, $desde, $porPagina){
        $sql = "SELECT * FROM producto WHERE idcategoria = $id_categoria and estatus = 1 LIMIT $desde, $porPagina";
        return $this->selectAll($sql);
    }

    //Obtener todos los productos relacionados con cada categoria
    public function getTotalProductosCat($id_categoria){
        $sql = "SELECT COUNT(*) AS total FROM producto WHERE idcategoria=$id_categoria";
        return $this->select($sql);
    }

    public function getListaDeseo($id_producto){
        $sql = "SELECT * FROM producto WHERE idproducto = $id_producto";
        return $this->selectAll($sql);
    }

    //Productos relacionados aleatorios 
    public function getAleatorios($id_categoria, $id_producto){
        $sql = "SELECT * FROM producto WHERE idcategoria= $id_categoria AND idproducto != $id_producto ORDER BY RAND() LIMIT 15";
        return $this->selectAll($sql);
    }


    //Administardor $stockProducto,
    //Agregar productos nuevos
    public function agregarProductos($nombreProducto,$descProducto,$precioProducto,$costoProducto,$urlProducto,$categoriaProducto){
        $sql = "INSERT INTO producto (nombreproducto,descripcionproducto,precioproducto,costoproducto,urlproducto,estatus,idcategoria) VALUES (?,?,?,?,?,?,?)";
        $datos = [$nombreProducto,$descProducto,$precioProducto,$costoProducto,$urlProducto,true,$categoriaProducto];
        return $this->insertar($sql,$datos);
    }
    //obtener categorias para poder seleccionarla y aparezcan los productos por categoria
    public function getCategorias(){
        $sql = ("SELECT idcategoria, categoria FROM categoria");
        return $this->selectAll($sql);
    }
    //Obtener productos por filtro de categoria
    public function  getProductosCategoria($idcategoria){
        $sql = "SELECT * FROM producto WHERE idcategoria=$idcategoria";
        return $this->selectAll($sql);
    }
    //obtener categoria para categorias
    public function getCategoria($idcategoria){
        $sql = "SELECT c.categoria from categoria c WHERE c.idcategoria = $idcategoria";
        return $this->select($sql);
    }


    //ESTO ES PARA DETAIL AGREAGAR AL CARRITO

    //Obtener Sucursal y el stock por sucursal
    public function getSucursalesDisponibles($idproducto){
        $sql = "SELECT s.nombresucursal, s.idsucursal,di.existencia FROM sucursal s JOIN detalleinventario di ON s.idsucursal = di.idsucursal WHERE di.idproducto = $idproducto and di.existencia >=1";
        return $this->selectAll($sql);
    }
    //Obtener sucursal para estas comprando en:
    public function getSucursal($idsucursal){
        $sql = "SELECT nombresucursal FROM sucursal WHERE idsucursal = $idsucursal";
        return $this->select($sql);
    }
    //Para el value de cantidad y que no sea maximo a el stock
    public function getStockMax($idsucursal,$idproducto){
        $sql = "SELECT existencia  FROM  detalleinventario  WHERE idsucursal = $idsucursal and idproducto = $idproducto";
        return $this->select($sql);
    }

    //Agregar al carrito
    public function agregarCarrito($idusuario,$idsucursal,$idproducto,$precioproducto,$cantidadproducto){
        $sql = "INSERT INTO carrito values (?,?,?,?,?)";
        $datos = [$cantidadproducto,$cantidadproducto*$precioproducto,$idproducto,$idsucursal,$idusuario];
        return $this->insertar($sql,$datos);
    }

    //Esto es par saber cuantos articulos hay en el carrito
    public function getCantidadCarrito($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadCarrito FROM carrito WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Esto es para saber si el producto seleccionado ya esta en el carrito y no agregarlo en caso de que si 
    public function existenciaCarrito($idpersona,$idproducto,$idsucursal){
        $sql = "SELECT idproducto FROM carrito WHERE idproducto = $idproducto and idpersona = $idpersona and idsucursal = $idsucursal";
        return $this->select($sql);
    }

    //Esto es para saber si el producto seleccionado ya esta en el carrito y no agregarlo en caso de que si 
    public function existenciaDeseos($idpersona,$idproducto){
        $sql = "SELECT idproducto FROM listadeseos WHERE idproducto = $idproducto and idpersona = $idpersona";
        return $this->select($sql);
    }

    //Agregar a la lista de deseos
    public function agregarDeseo($idusuario,$idproducto){
        $sql = "INSERT INTO listadeseos(idpersona,idproducto) values (?,?)";
        $datos = [$idusuario,$idproducto];
        return $this->insertar($sql,$datos);
    }

    //Esto es par saber cuantos articulos hay en el carrito
    public function getCantidadDeseos($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadDeseos FROM listadeseos WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

}

?>
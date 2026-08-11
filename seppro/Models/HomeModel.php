<?php
class HomeModel extends Query
{
    public function __construct()
    {
        parent::__construct();
    }
    public function getCategorias(){
        $sql = ("SELECT * FROM categoria");
        return $this->selectAll($sql);
    }
    public function getNuevosProductos(){
        $sql = ("SELECT * FROM producto ORDER BY idproducto DESC LIMIT 6");
        return $this->selectAll($sql);
    }
    //Esto es par saber cuantos articulos hay en el carrito
    public function getCantidadCarrito($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadCarrito FROM carrito WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    
    //Esto es par saber cuantos articulos hay en el carrito
    public function getCantidadDeseos($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadDeseos FROM listadeseos WHERE idpersona = $idpersona";
        return $this->select($sql);
    }
}

?>
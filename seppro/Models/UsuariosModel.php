<?php
class UsuariosModel extends Query{ //Se requiere lo del Model en controler
    public function __construct()
    {
        parent::__construct();
    }
    //Esto fue para el footer
     //obtener categorias para poder seleccionarla y dar categorias
    public function getCategorias(){
        $sql = ("SELECT * FROM categoria");
        return $this->selectAll($sql);
    }

    //Regitrar Usuario
    public function registroPersona($nombreUsuario,$apUsuario,$amUsuario,$correoUsuario,$telefonoUsuario){
        $sql = "INSERT INTO persona (nombrepersona,apaternopersona,amaternopersona,correopersona,telefonopersona,estatus) VALUES (?,?,?,?,?,?)";//posible cmabio estatus
        $datos = [$nombreUsuario,$apUsuario,$amUsuario,$correoUsuario,$telefonoUsuario,false];
        return  $this->insertar($sql,$datos);

    }
    public function registroUsuario($correoUsuario,$usuarioUsuario,$contraseñaUsuario){
        $sql = "SELECT idpersona from persona where correopersona = '$correoUsuario'";
        $consulta = $this->select($sql);
        $idpersona = $consulta['idpersona'];
        $sql = "INSERT INTO usuario (idpersona,usuario,contraseña,estatus) VALUES (?,?,?,?)";
        $datos = [$idpersona,$usuarioUsuario,$contraseñaUsuario,false];
        $this->insertar($sql,$datos);
        if ($idpersona > 0) {//Para poder mandar mensaje de exito en el if de $data>0
            $res = $idpersona;
        } else {
            $res = 0;
        }
        return $res;
    }
    public function getIdPersona($correoUsuario){//btener id de persona para poder usarlo en lugar de token y validar correo y poner estatus en 1
        $sql = "SELECT * from persona where correopersona = '$correoUsuario'";
        // return $this->select($sql1);
        $consulta = $this->select($sql);
        $idpersona = $consulta['idpersona'];
        return $idpersona;
        // $sql = "SELECT idpersona FROM persona WHERE correopersona = '$correoUsuario'";
        // return $this->select($sql);
        
    }

    public function actualizarEstatus($idpersona)
    {
        $sql = "UPDATE persona SET estatus=? WHERE idpersona=?";//esto sera por estatus
        $datos = [true,$idpersona];
        $this->save($sql, $datos);
        
        $sql = "UPDATE usuario SET estatus=? WHERE idpersona=?";
        $datos = [true,$idpersona];
        $this->save($sql, $datos);
        // $data = 
        // if ($data == 1) {
        //     $res = $data;
        // } else {
        //     $res = 0;
        // }
        // return $res;
    }

    public function confirmarExistencia($correoUsuario){//confirma existencia de correo y pasa los datos  al iniciar sesion y registrarse
        $sql = "SELECT * FROM persona WHERE correopersona = '$correoUsuario'";
        return $this->select($sql);
    }

    public function confirmarExistenciaUser($correoInicioSesion){
        $sql = "SELECT idpersona from persona where correopersona = '$correoInicioSesion'";
        $consulta = $this->select($sql);
        $idpersona = $consulta['idpersona'];
        $sql = "SELECT * FROM usuario WHERE idpersona=$idpersona";
        return $this->select($sql);
    }

    //Para saber si el correo esta verificado
    public function confirmarVerificacion($idpersona){
        $sql = "SELECT estatus FROM persona WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Obtener el carrito 
    public function getCarrito($idpersona){
        $sql = "SELECT p.nombreproducto,p.precioproducto,c.totalcarrito,s.nombresucursal,c.cantidadproducto,c.idproducto from carrito c,sucursal s,producto p where c.idsucursal=s.idsucursal and c.idproducto = p.idproducto  and idpersona=$idpersona";
        return $this->selectAll($sql);
    }

    //Obtener el precio total del carrito sin IVA ni nada
    public function getTotalCarrito($idpersona){
        $sql = "SELECT SUM(totalcarrito) as total FROM carrito WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Obtener la cantidad de artiiculos en el carrito
    public function getCantidadCarrito($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadCarrito FROM carrito WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Eliminar articulo del carrito
    public function eliminarCarrito($idpersona,$idproducto){
        $sql = "DELETE FROM carrito WHERE idpersona =$idpersona and idproducto = $idproducto ";
        $this->delete($sql);
    }


    //Agregar Direccion de usuario
    public function agregarDireccion($cppersona,$ciudadpersona,$estadopersona,$coloniapersona,$callepersona,$nexteriorpersona,$ninteriorpersona,$rfcpersona,$idpersona){
        $sql = "UPDATE persona SET cppersona = ? ,ciudadpersona = ? , estadopersona = ? , coloniapersona = ? , callepersona = ? , nexteriorpersona = ? , ninteriorpersona = ? , rfcpersona = ?
        WHERE idpersona = ?";
        $datos = [$cppersona,$ciudadpersona,$estadopersona,$coloniapersona,$callepersona,$nexteriorpersona,$ninteriorpersona,$rfcpersona,$idpersona];
        $this->save($sql, $datos);
    }

    //Obtener direccion 
    public function getDireccion($idpersona){
        $sql = "SELECT cppersona FROM persona WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Agregar venta 
    public function agregarVenta($fechaventa,$subtotalventa,$ivaventa,$totalventa,$idpersona,){
        $sql = "INSERT INTO VENTA (fechaventa,subtotalventa,ivaventa,totalventa,idpersona,idtipopago) VALUES(?,?,?,?,?,?)";
        $datos = [$fechaventa,$subtotalventa,$ivaventa,$totalventa,$idpersona,4003];
        $this->insertar($sql,$datos);
    }
    
    //Obtener id de sucursal a traves del nombre para poderm mandarlo en el insert de detalleventa
    public function getIdSucursal($nombresucursal){
        $sql = "SELECT idsucursal FROM sucursal WHERE nombresucursal = '$nombresucursal'";
        return $this->select($sql);
    }

    //obtener id de la venta, lo obtengo de la ultima venta no se si sea lo mejor pero es lo unico que se me ocurre ahorita. Queda pendiente buscar otra forma 
    public function getIdVenta($idpersona){
        $sql="SELECT idventa FROM venta WHERE idpersona = $idpersona ORDER BY idventa DESC  LIMIT 1;"; //Buscar oopcion SELECT LAST_INSERT_ID()
        return $this->select($sql);
    }

    //Agregar detalle de venta
    public function agregarDetalleVenta($idventa,$idproducto,$cantidadproducto,$precioproducto,$idsucursal){
        $sql = "INSERT INTO DETALLESVENTA (idventa,idproducto,cantidadproducto,importeproducto,importetotal,idsucursal) VALUES (?,?,?,?,?,?);";
        $datos = [$idventa,$idproducto,$cantidadproducto,$precioproducto,$cantidadproducto*$precioproducto,$idsucursal];
        $this->insertar($sql,$datos);
    }

    //La misma que en dettail para obtenr el stock del producto y poder restarle la cantidad comprada
    public function getStockMax($idsucursal,$idproducto){
        $sql = "SELECT existencia  FROM  detalleinventario  WHERE idsucursal = $idsucursal and idproducto = $idproducto";
        return $this->select($sql);
    }

    //Actualizar stock despues de compra
    public function actualizarStock($stockActializado,$idproducto,$idsucursal){
        $sql = "UPDATE detalleinventario SET existencia = ? WHERE idproducto = ? and idsucursal = ?";
        $datos = [$stockActializado,$idproducto,$idsucursal];
        $this->save($sql, $datos);
    }


    //Obtener el carrito 
    public function getListaDeseo($idpersona){
    $sql = "SELECT p.nombreproducto,p.precioproducto,ld.idproducto from listadeseos ld,producto p where ld.idproducto = p.idproducto and idpersona=$idpersona";
    return $this->selectAll($sql);
    }

    //Eliminar articulo de la lista de deseos
    public function eliminarDeseo($idpersona,$idproducto){
        $sql = "DELETE FROM listadeseos WHERE idpersona =$idpersona and idproducto = $idproducto ";
        $this->delete($sql);
    }

    //Esto es par saber cuantos articulos hay en el carrito
    public function getCantidadDeseos($idpersona){
        $sql = "SELECT COUNT(idproducto) as cantidadDeseos FROM listadeseos WHERE idpersona = $idpersona";
        return $this->select($sql);
    }

    //Obtener las compras del usuario 
    public function getCompras($idpersona){
        $sql = "SELECT v.idventa, v.fechaventa,v.subtotalventa,v.ivaventa,v.totalventa from venta v where idpersona = $idpersona";
        return $this->selectAll($sql);
    }

    //obtener los detalles de cada compra 
    public function getDetalleVenta($idventa){
        $sql = "SELECT p.nombreproducto, dv.cantidadproducto,dv.importeproducto,dv.importetotal, s.nombresucursal  From DETALLESVENTA dv, producto p, sucursal s where idventa = $idventa and dv.idproducto=p.idproducto and s.idsucursal=dv.idsucursal;";
        return $this->selectAll($sql);
    }

    //Obtener el subtotal, iva y total de la compra
    public function getCompra($idventa){
        $sql = "SELECT v.subtotalventa,v.ivaventa,v.totalventa from venta v where idventa = $idventa";
        return $this->select($sql);
    }

    public function getpersona($idpersona){
        $sql = "SELECT * from persona where idpersona = $idpersona";
        return $this->select($sql);
    }
}

?>
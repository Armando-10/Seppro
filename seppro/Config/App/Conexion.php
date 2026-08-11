<?php
class Conexion{
    private $conecta;
    public function __construct()
    {
        $pdo = "mysql:host=" . HOST . ";dbname=" . DB . ";" . CHARSET; //Debe de haber espacios entre los puntos
        try
        {
            $this->conecta = new PDO($pdo, USER, PASS);
            $this->conecta->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e){
            echo "Error en la conexión ".$e->getMessage();
        }
    }
    public function conecta()
    {
        return $this->conecta;
    }
}
?>
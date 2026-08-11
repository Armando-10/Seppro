<?php
class Views{
    public function getView($ruta, $vista, $data="")//al pasar data debe de ser igual el nombre de variable
    {
        if($ruta == "home"){
            $vista = "Views/".$vista.".php";
        }else{
            $vista = "Views/".$ruta."/".$vista.".php";
        }
        require $vista;
    }
}

?>

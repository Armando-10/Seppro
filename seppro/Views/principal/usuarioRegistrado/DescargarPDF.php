<?php
require('assets\pdf\fpdf\fpdf.php');
class PDF extends FPDF
{


    function infotienda($nombre,$direccion,$rfc,$correo,$telefono){
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(220, 5, $nombre, 0, 1,'C');
        $this->Ln(1);
        $this->SetFont('Arial', 'B', 12);
        $this->Ln(1);
        $this->Cell(220, 5, $direccion, 0, 1,'C');
        $this->Ln(1);
        $this->Cell(220, 5, $rfc, 0, 1,'C');
        $this->Cell(220, 5, $correo, 0, 1,'C');
        $this->Ln(1);
        $this->Cell(220, 5, $telefono, 0, 1,'C');
        $this->Ln(10);
    }

    
    function titulo($titulo){
        $this->SetFont('Arial', 'B', 16);
        $this->Cell(220, 5, $titulo, 0, 1,'C');
        $this->Ln(5);
    }

    
    function tabla(){
        $this->SetFillColor(200, 220, 255);
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(20, 10, 'Cantidad', 1, 0, 'C', true);
        $this->Cell(95, 10, 'Descripcion', 1, 0, 'C', true);
        $this->Cell(35, 10, 'Sucursal', 1, 0, 'C', true);
        $this->Cell(35, 10, 'Precio', 1, 0, 'C', true);
        $this->Cell(35, 10, 'Importe', 1, 1, 'C', true);
        $this->SetFont('Arial', '', 12);
    }

    function contenidoTabla($cantidad,$descripcion,$sucursal,$precio,$importe)
    {
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(20, 10, $cantidad, 1);
        $this->Cell(95, 10, $descripcion, 1);
        $this->Cell(35, 10, $sucursal, 1);
        $this->Cell(35, 10, "$" . number_format($precio, 2), 1);
        $this->Cell(35, 10, "$" . number_format($importe, 2), 1);
        $this->Ln();
    }
    
    function espacio(){
        $this->SetFont('Arial', 'B', 9);
        $this->Cell(20, 10, '', 1, 0, 'C');
        $this->Cell(95, 10, '', 1, 0, 'C');
        $this->Cell(35, 10, '', 1, 0, 'C');
        $this->Cell(35, 10, '', 1, 0, 'C');
        $this->Cell(35, 10, '', 1, 1, 'C');
        
    }

    function subtotal($subtotal){
        $this->Cell(20, 10, '', 0);
        $this->Cell(95, 10, '', 0);
        $this->Cell(35, 10, '', 0);
        $this->Cell(35, 10, 'Subtotal', 1);
        $this->Cell(35, 10, "$" . number_format($subtotal, 2), 1);
        $this->Ln();
    }

    function iva($iva){
        $this->Cell(20, 10, '', 0);
        $this->Cell(95, 10, '', 0);
        $this->Cell(35, 10, '', 0);
        $this->Cell(35, 10, 'Iva', 1);
        $this->Cell(35, 10, "$" . number_format($iva, 2), 1);
        $this->Ln();
    }

    function total($total){
        $this->Cell(20, 10, '', 0);
        $this->Cell(95, 10, '', 0);
        $this->Cell(35, 10, '', 0);
        $this->Cell(35, 10, 'Total', 1);
        $this->Cell(35, 10, "$" . number_format($total, 2), 1);
        $this->Ln();
    }

    function persona($nombre,$appaterno,$amaterno,$rfc,$correo){
        $this->SetFont('Arial', 'B', 12);
        $this->Cell(220, 5,  "Nombre: $nombre $appaterno $amaterno", 0, 1,'C');
        $this->Ln(1);
        $this->SetFont('Arial', 'B', 12);
        $this->Ln(1);
        $this->Cell(220, 5, "RFC: $rfc", 0, 1,'C');
        $this->Ln(1);
        $this->Cell(220, 5, "Correo: $correo", 0, 1,'C');
        $this->Ln(5);
    }

}

$pdf = new PDF();
$pdf->AddPage('P',array(240,280));


// Añadir la información al PDF
$pdf->Image(BASE_URL . 'assets/img/banner_img_01.png',20,10,40,40);


$nombre = 'SERVICIO Y EQUIPAMIENTO A POZOS PROFUNDOS';
$direccion = 'Av. La Luz # 2709, Queretaro';
$rfc = 'SERPDICH01';
$correo = 'sepproqro@gmail.com';
$telefono = '442-710-9612';
$pdf->infotienda($nombre,$direccion,$rfc,$correo,$telefono);


$titulo = 'Datos del cliente';
$pdf->titulo($titulo);

$pdf->persona(utf8_decode($_SESSION['nombreUsuario']),utf8_decode($_SESSION['apUsuario']),utf8_decode($_SESSION['amUsuario']),utf8_decode($data['rfc']),utf8_decode($_SESSION['correoUsuario']));

$titulo = 'Factura de la venta';
$pdf->titulo($titulo);

$pdf->tabla();

foreach ( $data['detallesventa'] as $producto){
    $pdf->contenidoTabla($producto['cantidadproducto'],utf8_decode($producto['nombreproducto']),utf8_decode($producto['nombresucursal']),$producto['importeproducto'],$producto['importetotal']);
}

$pdf->espacio();


$pdf->subtotal($data['subtotal']);
$pdf->iva($data['iva']);
$pdf->total($data['total']);



$pdf->Output();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <title><?php echo TITLE. '-'.$data['title']; ?></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="shortcut icon" href="<?php echo BASE_URL;?>assets/img/favicon-32x32.png">
    <link rel="shortcut icon" type="image/x-icon" href="<?php echo BASE_URL;?>assets/img/favicon.ico">

    <link rel="stylesheet" href="<?php echo BASE_URL;?>assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo BASE_URL;?>assets/css/templatemo.css">
    <link rel="stylesheet" href="<?php echo BASE_URL;?>assets/css/custom.css">

    <!-- Load fonts style after rendering the layout styles -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;200;300;400;500;700;900&display=swap">
    <link rel="stylesheet" href="<?php echo BASE_URL;?>assets/css/fontawesome.min.css">

    <!-- Slick -->
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_URL;?>assets/css/slick.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BASE_URL;?>assets/css/slick-theme.css">

    <script src="https://www.paypal.com/sdk/js?client-id=<?php echo CLIENTE_ID?>&currency=<?PHP ECHO MONEDA ?>"></script>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
    <script src="https://kit.fontawesome.com/44613530ae.js" crossorigin="anonymous"></script>


</head>

<body>

    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-light shadow">
        <div class="container d-flex justify-content-between align-items-center">

            <a class="navbar-brand text-success logo h1 align-self-center" href="<?php echo BASE_URL ?>">
            <?php echo TITLE; ?>
            </a>

            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#templatemo_main_nav" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="align-self-center collapse navbar-collapse flex-fill  d-lg-flex justify-content-lg-between" id="templatemo_main_nav">
                <div class="flex-fill">
                    <ul class="nav navbar-nav d-flex justify-content-between mx-lg-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL ?>">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL.'principal/about' ?>">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL.'principal/shop' ?>">Catalogo</a>
                        </li>
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL.'principal/contact' ?>">Contacto</a>
                        </li> -->
                        <!-- <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL.'principal/IndexAdministrador' ?>">Contacto</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="<?php echo BASE_URL.'administradores/GestionarPaginaAdministrador'?>">Contacto</a>
                        </li> -->
                    </ul>
                </div>
                <div class="navbar align-self-center d-flex">
                    <?php if (empty($_SESSION['idUsuario'])){?>
                    <a class="nav-icon position-relative text-decoration-none" href="<?php echo BASE_URL.'usuarios/IniciarSesion' ?>">
                        <?php // Para que funcionen estas funciones al momento de poner el href en el icono se debe de cambiar despues del punto a el nombre de esta clase?>
                        <i class="fa fa-fw fa-user text-dark mr-3"></i>
                    </a>
                    <?php }else{ ?>
                        <!--CARRITO-->
                        <a class="nav-icon position-relative text-decoration-none" href="<?php echo BASE_URL.'usuarios/CarritoUsuario'  ?>" id="verCarrito">
                            <i class="fa fa-fw fa-cart-arrow-down text-dark mr-1"></i>
                            <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark" id="btnCantidadCarrito"><?php echo $data['cantidadCarrito']?></span>
                        </a>
                        <!--DESEO-->
                        <a class="nav-icon position-relative text-decoration-none" href="<?php echo BASE_URL.'usuarios/ListaDeseos'  ?>">
                            <i class="fa fa-fw fa-heart text-dark mr-1"></i>
                            <span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-light text-dark" id="btnCantidadDeseo"><?php echo $data['cantidadDeseos']?></span>
                        </a>
                        <!--PERFIL-->
                        <a class="nav-icon position-relative text-decoration-none" href="<?php echo BASE_URL.'usuarios/PerfilUsuario'  ?>">
                        <?php // Para que funcionen estas funciones al momento de poner el href en el icono se debe de cambiar despues del punto a el nombre de esta clase?>
                        <i class="fa fa-fw fa-user text-dark mr-3"></i>
                        </a>
                        <a class="nav-icon position-relative text-decoration-none" href="<?php echo BASE_URL.'usuarios/salir' ?>">
                        <?php // Para que funcionen estas funciones al momento de poner el href en el icono se debe de cambiar despues del punto a el nombre de esta clase?>
                        <i class="fas fa-sign-out-alt text-dark mr-3"></i>
                    </a>
                    <?php }?>
                </div>
            </div>

        </div>
    </nav>
    <!-- Close Header -->

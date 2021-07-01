const express = require('express');
const router = express.Router();

// importar controladores
const generalController = require('../controllers/generalController');
const authController = require('../controllers/authController');
const rolController = require('../controllers/rolController');

// Controladores Usuarios por Rol
const dashboardController = require('../controllers/dashboardController');
const usuariosController = require('../controllers/usuariosController');
const plataformasController = require('../controllers/plataformasController');
const marcasController = require('../controllers/marcasController');
const comprarPlataformasController = require('../controllers/comprarPlataformasController');
const cuentasController = require('../controllers/cuentasController');
const notificacionesController = require('../controllers/notificacionesController');
const consignacionesController = require('../controllers/consignacionesController');
const mediosController = require('../controllers/mediosController');

module.exports = function() {

    // Inicio
    router.get('/', generalController.inicio);
    
    // Crear y confirmar cuenta usuario
    router.get('/registro', 
        generalController.formRegistro,
    );
    router.post('/registro', generalController.validarRegistro);
    router.post('/registro', generalController.crearRegistro);
    router.get('/confirmar-cuenta/:correo', generalController.confirmarCuenta);
    
    // Ingreso
    router.get('/ingreso', generalController.formIngreso);
    router.post('/ingreso', authController.autenticarUsuario);
    
    // =====================
    //     Dashboard
    // =====================

    // Inicio
    router.get('/dashboard/inicio', 
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.inicio
    );

    router.post('/inicio/asignarPlataformasUsuarios', 
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.asignarPlataformasUsuarios
    );

    // Perfil
    router.get('/dashboard/mi-perfil', 
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.countRed,
        dashboardController.perfil
    );
    router.post('/dashboard/mi-perfil/cambiarPassword',
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.countRed,
        dashboardController.cambiarPassword
    );
    router.post('/dashboard/mi-perfil/editar/:correo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.countRed,
        dashboardController.validarEditarPerfil,
        dashboardController.editarPerfil
    );
    router.post('/dashboard/mi-perfil/editar-redes/:correo', 
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.countRed,
        dashboardController.editarRedesSociales
    );
    router.post('/dashboard/mi-perfil/subir-foto/:correo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        dashboardController.countRed,
        dashboardController.uploadFoto,
        dashboardController.subirFoto
    );

    // Cerrar Sesion
    router.get('/cerrar-sesion', (req, res) => {
        req.logout();
        res.redirect('/ingreso');
    });

    // =====================
    //    Paginas Admin
    // =====================

    // Administrador Usuarios (Admin)
    router.get('/dashboard/adminUsuarios',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        dashboardController.countRed,
        usuariosController.adminUsuarios
    );

    router.post('/adminUsuarios/cambioPefil',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.cambioPerfil
    );

    router.post('/adminUsuarios/bloqueoUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.bloqueoUsuario
    );

    router.post('/adminUsuarios/editarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.editarUsuario
    );

    router.post('/adminUsuarios/eliminarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.eliminarUsuario
    );

    router.post('/adminUsuarios/tablaAsignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.tablaAsignarPlataformas
    );

    router.post('/adminUsuarios/asignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        usuariosController.asignarPlataformaSuperdistribuidor
    );


    // Administrador Plataformas (Admin)
    router.get('/dashboard/adminPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        plataformasController.adminPlataformas
    );

    router.post('/adminPlataformas/crearPlataforma',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        plataformasController.uploadFoto,
        plataformasController.crearPlataforma
    );

    router.post('/adminPlataformas/editarPlataforma',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        plataformasController.editarPlataforma
    );

    router.post('/adminPlataformas/eliminarPlataforma',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        plataformasController.eliminarPlataforma
    );

    router.post('/adminPlataformas/cambioEstado',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        plataformasController.cambioEstado
    );

    // Administrador Marcas Blancas (Admin)
    router.get('/dashboard/adminMarcasBlancas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        marcasController.adminMarcasBlancas
    );

    router.post('/adminMarcasBlancas/crearMarca',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        marcasController.uploadLogo,
        marcasController.crearMarca
    );

    router.post('/adminMarcasBlancas/editarMarca',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        marcasController.editarMarca
    );

    router.post('/adminMarcasBlancas/eliminarMarca',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        marcasController.eliminarMarca
    );

    router.post('/adminMarcasBlancas/cambioEstado',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaAdmin,
        marcasController.cambioEstado
    );

    // ===============================
    //    Paginas SuperDistribuidor
    // ===============================

    // Administrador Usuarios (Admin)
    router.get('/dashboard/adminUsuariosSuperdistribuidor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        dashboardController.countRed,
        usuariosController.adminUsuariosSuperdistribuidor
    );

    router.post('/adminUsuariosSuperdistribuidor/cambioPefil',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.cambioPerfil
    );

    router.post('/adminUsuariosSuperdistribuidor/bloqueoUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.bloqueoUsuario
    );

    router.post('/adminUsuariosSuperdistribuidor/editarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.editarUsuario
    );

    router.post('/adminUsuariosSuperdistribuidor/eliminarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.eliminarUsuario
    );

    router.post('/adminUsuariosSuperdistribuidor/cargarSaldo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.cargarSaldo
    );


    router.post('/adminUsuariosSuperdistribuidor/restarSaldo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.restarSaldo
    );

    router.post('/adminUsuariosSuperdistribuidor/tablaAsignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.tablaAsignarPlataformas
    );

    router.post('/adminUsuariosSuperdistribuidor/asignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        usuariosController.asignarPlataformaSuperdistribuidor
    );


    // Administrador Plataformas (Superdistribuidor)
    router.get('/dashboard/adminPlataformasSuperdistribuidor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.adminPlataformasSuperdistribuidor
    );

    router.post('/adminPlataformasSuperdistribuidor/crearPlataformaSuperdistribuidor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.uploadFoto,
        plataformasController.crearPlataformaSuperdistribuidor
    );

    router.post('/adminPlataformasSuperdistribuidor/editarPlataforma',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.editarPlataforma
    );

    router.post('/adminPlataformasSuperdistribuidor/eliminarPlataformaSuperdistribuidor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.eliminarPlataformaSuperdistribuidor
    );

    router.post('/adminPlataformasSuperdistribuidor/cambioEstado',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.cambioEstado
    );

    router.post('/adminPlataformasSuperdistribuidor/desplegarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.desplegarPlataformas
    );

    router.post('/adminPlataformasSuperdistribuidor/subirValor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.subirValor
    );

    router.post('/adminPlataformasSuperdistribuidor/bajarValor',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        plataformasController.bajarValor
    );


    // Subir Cuentas (Superdistribuidor)
    router.get('/dashboard/subirCuentas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        cuentasController.subirCuentas
    );

    router.post('/subirCuentas/subirCuentasExcel',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        cuentasController.uploadExcel,
        cuentasController.subirCuentasExcel
    );

    router.post('/subirCuentas/editarCuenta',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        cuentasController.editarCuenta
    );

    router.post('/subirCuentas/eliminarCuenta',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        cuentasController.eliminarCuenta
    );


    // Subir Cuentas (Superdistribuidor)
    router.get('/dashboard/cuentasSinTomar',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        cuentasController.cuentasSinTomar
    );

    // Medios de consignacion (Superdistribuidor)
    router.get('/dashboard/mediosConsignacion',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.mediosConsignacion
    );

    router.post('/mediosConsignacion/subirMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.uploadRecursos,
        mediosController.subirMedio
    );

    router.post('/mediosConsignacion/infoMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.infoMedio
    );

    router.post('/mediosConsignacion/editarMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.editarMedio
    );

    router.post('/mediosConsignacion/bloquearMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.bloquearMedio
    );

    router.post('/mediosConsignacion/eliminarMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaSuperdistribuidor,
        mediosController.eliminarMedio
    );


    // =======================
    //    Paginas Usuarios
    // =======================

    // Administrador Usuarios (Admin)
    router.get('/dashboard/usuarios',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        dashboardController.countRed,
        usuariosController.usuarios
    );

    router.post('/usuarios/cambioPefil',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.cambioPerfil
    );

    router.post('/usuarios/bloqueoUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.bloqueoUsuario
    );

    router.post('/usuarios/editarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.editarUsuario
    );

    router.post('/usuarios/eliminarUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.eliminarUsuario
    );

    router.post('/usuarios/cargarSaldo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.cargarSaldoUsuario
    );


    router.post('/usuarios/restarSaldo',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.restarSaldoUsuario
    );

    router.post('/usuarios/tablaAsignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.tablaAsignarPlataformas
    );

    router.post('/usuarios/asignarPlataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaDistribuidor,
        usuariosController.asignarPlataformaUsuario
    );


    // Compra plataformas (Distribuidores y resellers)
    router.get('/dashboard/plataformas',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        dashboardController.countRed,
        comprarPlataformasController.plataformas
    );

    router.post('/plataformas/compraCuentaNormal',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaNormal
    );

    router.post('/plataformas/compraCuentaPedido',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaPedido
    );

    router.post('/plataformas/compraCuentaRenovacion',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaRenovacion
    );

    router.post('/plataformas/compraCuentaPersonalizada',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaPersonalizada
    );

    router.post('/plataformas/compraCuentaFreefire',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaFreefire
    );

    router.post('/plataformas/compraCuentaCallofduty',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        comprarPlataformasController.compraCuentaCallofduty
    );

    // Reportar consignaciones
    router.get('/dashboard/reportarConsignacion',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        consignacionesController.reportarConsignacion
    );

    router.post('/reportarConsignacion/subirConsignacion',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        consignacionesController.uploadComprobante,
        consignacionesController.subirConsignacion
    );

    router.post('/reportarConsignacion/infoMedio',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaUsuario,
        mediosController.infoMedio
    );

    // Notificaciones usuario
    router.post('/notificaciones/notificacionesUsuario',
        authController.usuarioAutenticado,
        authController.verifyToken,
        rolController.permisosPaginaGeneral,
        notificacionesController.notificacionesUsuario
    );

    return router;
}
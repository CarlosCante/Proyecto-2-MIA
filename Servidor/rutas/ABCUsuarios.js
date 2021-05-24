const express = require('express');
const router = express.Router();
const ABCUsuarios_ctrl = require('../Controladores/ABCUsuarios_ctrl');
const multiparty = require('connect-multiparty');
const path = require('path');

const multipartyMid = multiparty({
    uploadDir: './Servidor/imagenes'
})

router.post('/RegistrarUsuario', ABCUsuarios_ctrl.registrar_usuario);
router.get('/VerificacionCorreo/:llave', ABCUsuarios_ctrl.VerificarCorreo);
router.post('/Login', ABCUsuarios_ctrl.Login);
router.post('/CargarProducto', ABCUsuarios_ctrl.cargar_producto);
router.post('/RecuperarContrasena', ABCUsuarios_ctrl.recuperar_contrasena);
router.get('/ObtenerUsuarios', ABCUsuarios_ctrl.obtener_usuarios);
router.post('/ModificarUsuarioAdm', ABCUsuarios_ctrl.modificar_usuario);
router.get('/ObtenerBitacora', ABCUsuarios_ctrl.obtener_bitacora);
router.get('/ObtenerCategoriasPadre', ABCUsuarios_ctrl.obtener_categorias_padre);
router.post('/ObtenerCategoriasHija', ABCUsuarios_ctrl.obtener_categorias_hija);
router.post('/BuscarProductos', ABCUsuarios_ctrl.buscar_productos);
router.post('/ObtenerProducto', ABCUsuarios_ctrl.obtener_producto);

router.get('/R1', ABCUsuarios_ctrl.R1);
router.post('/R2', ABCUsuarios_ctrl.R2);
router.post('/R3', ABCUsuarios_ctrl.R3);
router.get('/R4', ABCUsuarios_ctrl.R4);
router.post('/R5', ABCUsuarios_ctrl.R5);
router.post('/R6', ABCUsuarios_ctrl.R6);
router.post('/R7', ABCUsuarios_ctrl.R7);
router.get('/R8', ABCUsuarios_ctrl.R8);
router.post('/R9', ABCUsuarios_ctrl.R9);
router.post('/R10', ABCUsuarios_ctrl.R10);
router.post('/R11', ABCUsuarios_ctrl.R11);


router.post('/SubirFoto', multipartyMid, (req, res) => {
    res.json({'Ruta': path.basename(req.files.uploads[0].path)});
});


module.exports = router;
const ABCUsuarios_ctrl = {};
const db = require('../db');

ABCUsuarios_ctrl.prueba = function(request, response){
    sql = "INSERT INTO TMP VALUES('Esteban','Lopez')";
    db.open(sql, [], true, response);
};

ABCUsuarios_ctrl.registrar_usuario = async (request, response) => {
    db.RegistrarUsuario(request,response);
};

ABCUsuarios_ctrl.VerificarCorreo = (request, response) => {
    db.VerificarCorreo(request,response);
}

ABCUsuarios_ctrl.Login = async(request, response) => {
    db.Login(request,response);
}

ABCUsuarios_ctrl.cargar_producto = async(request, response) => {
    db.cargar_producto(request,response);
}

ABCUsuarios_ctrl.recuperar_contrasena = async(request, response) => {
    db.recuperar_contrasena(request, response);
}

ABCUsuarios_ctrl.obtener_usuarios = async(request, response) => {
    sql = 'SELECT * FROM USUARIO'
    db.open(sql, [], false, response);
}

ABCUsuarios_ctrl.modificar_usuario = async(request, response) => {
    db.modificar_usuario(request, response);
}

ABCUsuarios_ctrl.obtener_bitacora = async(request, response) => {
    sql = 'SELECT BD.tipo_operacion, BD.descripcion, BD.fecha, u1.correo, u2.correo FROM USUARIO u1, USUARIO u2, BITACORA_ADMINISTRADOR BD WHERE BD.ID_USUARIO_ADMINISTRADOR = u1.ID_USUARIO AND BD.ID_USUARIO_MODIFICADO = u2.ID_USUARIO';
    db.obtener_bitacora(sql, [], false, response);
}

ABCUsuarios_ctrl.obtener_categorias_padre = async(request, response) => {
    sql = 'SELECT id_categoria, nombre FROM CATEGORIA WHERE id_categoria_padre is null';
    db.obtener_categorias(sql, [], false, response);
}

ABCUsuarios_ctrl.obtener_categorias_hija = async(request, response) => {
    sql = 'SELECT id_categoria, nombre FROM CATEGORIA WHERE id_categoria_padre = :id';
    db.obtener_categorias(sql, {id: request.body.id}, false, response);
}

ABCUsuarios_ctrl.buscar_productos = async(request, response) => {
    sql =   'SELECT P.NOMBRE, P.IMAGEN, P.PRECIO, P.DESCRIPCION, P.STOCK, P.COLOR, U.NOMBRE, U.APELLIDO, P.ID_PRODUCTO '
            +'FROM '
            +'    PRODUCTO P, USUARIO U, CATEGORIA C '
            +'WHERE '
            +'    p.id_categoria = :cathija '
            +'AND c.id_categoria = :cathija '
            +'AND c.id_categoria_padre = :catpadre '
            +'AND p.id_usuario_autor = u.id_usuario '
            +'AND lower(p.descripcion) LIKE lower(\'%' + request.body.palabra + '%\')';
    db.buscar_productos(sql, { catpadre: request.body.idpadre, cathija: request.body.idhija }, false, response);
}

ABCUsuarios_ctrl.obtener_producto = async(request, response) => {
    sql =   'SELECT P.NOMBRE, P.IMAGEN, P.PRECIO, P.DESCRIPCION, P.STOCK, P.COLOR, U.NOMBRE, U.APELLIDO '
            +'FROM '
            +'    PRODUCTO P, USUARIO U '
            +'WHERE '
            +'    p.id_producto = :id '
            +'AND p.id_usuario_autor = u.id_usuario';
    db.obtener_producto(sql, { id: request.body.id }, false, response);
}

ABCUsuarios_ctrl.R1 = async(request, response) => {
    sql = 'SELECT U.NOMBRE, (SUM(C.PUNTUACION) / COUNT(C.HELP_DESK)) AS Promedio '
            +'FROM USUARIO U, CHAT C '
            +'WHERE U.ID_USUARIO = C.HELP_DESK '
            +'GROUP BY U.NOMBRE '
            +'ORDER BY Promedio DESC';
    db.R1(sql, [], false, response);
}

ABCUsuarios_ctrl.R2 = async(request, response) => {
    sql = 'SELECT NOMBRE FROM USUARIO '
            +'WHERE EXTRACT(YEAR FROM fecha_nacimiento) > :anio '
            +'AND genero = \'Masculino\' '
            + 'AND id_rol = 2';
    db.R2(sql, {anio: request.body.anio}, false, response);
}

ABCUsuarios_ctrl.R3 = async(request, response) => {
    sql = 'SELECT NOMBRE FROM USUARIO '
            +'WHERE EXTRACT(YEAR FROM fecha_nacimiento) < :anio '
            +'AND genero = \'Femenino\' '
            + 'AND id_rol = 2';
    db.R3(sql, {anio: request.body.anio}, false, response);
}

ABCUsuarios_ctrl.R4 = async(request, response) => {
    sql = 'SELECT NOMBRE, GANACIA_OBTENIDA FROM USUARIO '
            +'WHERE ID_ROL = 3 '
            +'ORDER BY GANACIA_OBTENIDA DESC';
    db.R4(sql, [], false, response);
}

ABCUsuarios_ctrl.R5 = async(request, response) => {
    
}

ABCUsuarios_ctrl.R6 = async(request, response) => {
    
}

ABCUsuarios_ctrl.R7 = async(request, response) => {
    
}

ABCUsuarios_ctrl.R8 = async(request, response) => {
    sql = 'SELECT P.NOMBRE, P.DESCRIPCION, U.NOMBRE, P.PRECIO, P.STOCK, C1.NOMBRE, C2.NOMBRE '
        + 'FROM PRODUCTO P, CATEGORIA C1, CATEGORIA C2, USUARIO U '
        + 'WHERE p.id_categoria = c2.id_categoria '
        + 'AND c2.id_categoria_padre = c1.id_categoria '
        + 'AND u.id_usuario = p.id_usuario_autor'
    db.R8(sql, [], false, response);
}

ABCUsuarios_ctrl.R9 = async(request, response) => {
    
}

ABCUsuarios_ctrl.R10 = async(request, response) => {
    
}

ABCUsuarios_ctrl.R11 = async(request, response) => {
    
}

module.exports = ABCUsuarios_ctrl;
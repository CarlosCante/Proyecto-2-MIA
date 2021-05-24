var oracledb = require('oracledb');
var EmailCtrl = require('./Controladores/ mailCtrl');

function error(err, rs, cn){
    if(err){
        console.error(err.message);
        rs.contentType('application/json').status(500);
        rs.send(err.message);
        if(cn != null) close(sn);
        return -1;
    }
    else
        return 0;
}

function open(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var usuarios = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        usuarios.push({
                            id_usuario: result.rows[i][0],
                            nombre: result.rows[i][1],
                            apellido: result.rows[i][2],
                            password: result.rows[i][3],
                            correo: result.rows[i][4],
                            telefono: result.rows[i][5],
                            genero: result.rows[i][7],
                            fecha_nacimiento: result.rows[i][8],
                            estado: result.rows[i][14]
                        })
                    }
                    rs.send(usuarios);
                }
                close(connection);
            });
        });
}

function close(cn){
    cn.release(
        function(err){
            if(err){ console.error(err.message); }
        }
    )
}


function RegistrarUsuario(req,rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          var llave = makeid(30);

          connection.execute(
            `BEGIN registrarusuario(:nombre, :apellido, :password, :correo, :telefono, :fotografia, :genero, :fecha_nac, 1, 3, :key, :res); END;`,
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                password: req.body.password,
                correo: req.body.correo,
                telefono: req.body.telefono,
                fotografia: req.body.fotografia,
                genero: req.body.genero,
                fecha_nac: req.body.fecha_nac,
                key: llave,
                res: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
                var linkVerificacion = 'http://localhost:4200/Verificacion/' + llave;
                //Envio del email al usuario
                EmailCtrl.sendEmail({
                    from: 'PUBLISHES AND SELLS',
                    to: req.body.correo,
                    subject: 'Confirmacion de correo electronico',
                    text: 'Gracias por registrarse en nuestra pagina web, por favor haga click en el siguiente enlace para finalizar el proceso de registro:\n\n' + linkVerificacion + '\n\nCabe recalcar que no podra iniciar sesion en la pagina hasta que verifique su correo electronico.'
                });
              rs.json(result.outBinds);
            });
        }

    );
  
}

function VerificarCorreo(req,rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          connection.execute(
            `BEGIN verificarcorreo(:llave, :res); END;`,
            {
                llave: req.params.llave,
                res: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
                rs.json(result.outBinds);
            });
        }

    );
}

function Login(req,rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          connection.execute(
            `BEGIN login(:ccorreo, :cpassword, :nombre, :apellido, :password, :correo, :telefono, :fotografia, :fecha_nacimiento, :rol, :resultado); END;`,
            {
                ccorreo: req.body.correo,
                cpassword: req.body.password,
                nombre: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                apellido: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                password: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                correo: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                telefono: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                fotografia: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                fecha_nacimiento: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                rol: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER },
                resultado: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
                rs.json(result.outBinds);
            });
        }

    );
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function cargar_producto(req, rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          var llave = makeid(30);

          connection.execute(
            `BEGIN CARGARPRODUCTO(:codigo, :foto, :descripcion, :catpadre, :cathija, :precio, :cantidad, :color, :usuario); END;`,
            {
                codigo: req.body.codigo, 
                foto: req.body.foto, 
                descripcion: req.body.descripcion, 
                catpadre: req.body.catPadre,
                cathija: req.body.catHija, 
                precio: req.body.precio, 
                cantidad: req.body.cantidad, 
                color: req.body.color, 
                usuario: req.body.usuario
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
            });
        }

    );
}

function recuperar_contrasena(req, rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          var llave = makeid(10);

          connection.execute(
            `BEGIN RECUPERARCONTRASENA(:correo, :password, :resultado); END;`,
            {
                correo: req.body.correo,
                password: llave,
                resultado: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
                //Envio del email al usuario
                if(result.outBinds.resultado == '1'){
                    EmailCtrl.sendEmail({
                        from: 'PUBLISHES AND SELLS',
                        to: req.body.correo,
                        subject: 'Recuperacion de contraseña Publishes And Sells',
                        text: 'Este correo fue enviado devido a que se solicito la recuperacion de la contraseña de usuario con el correo "' + req.body.correo + '" porfavor para recuperar su contraseña ingrese al usuario con los sigueintes datos: \n\nCorreo: ' + req.body.correo + '\nContraseña: ' + llave + '\n\nAl momento de ingresar al usuario ingrese a la configuracion de sus usuario y solicite el cambio de contraseña.'
                    });
                }
              rs.json(result.outBinds);
            });
        }

    );
}

function modificar_usuario(req, rs){
    //Verificacion de si ya existe el usuario
    oracledb.getConnection(
        {
            user          : "carlos",
            password      : "1234",
            connectString : "localhost:1521/XE"
        },
        
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }

          var llave = makeid(30);

          connection.execute(
            `BEGIN MODIFICARUSUARIO(:nombre, :apellido, :password, :correomod, :correoadm, :telefono, :estado, :motivo, :tipoop, :resultado); END;`,
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                password: req.body.password,
                correomod: req.body.correomod,
                correoadm: req.body.correoadm,
                telefono: req.body.telefono,
                estado: req.body.estado,
                motivo: req.body.motivo,
                tipoop: req.body.tipoop,
                resultado: { dir: oracledb.BIND_OUT, type: oracledb.INTEGER }
            },
            {autoCommit: true},
            function (err, result) {
                if (err) { console.error(err.message); return; }
                rs.json(result.outBinds);
            });
        }

    );
}

function obtener_bitacora(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var bitacora = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        bitacora.push({
                            tipo: result.rows[i][0],
                            descripcion: result.rows[i][1],
                            fecha: result.rows[i][2],
                            usuariomod: result.rows[i][4],
                            usuarioadm: result.rows[i][3]
                        })
                    }
                    rs.send(bitacora);
                }
                close(connection);
            });
        });
}

function obtener_categorias(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var categoria = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        categoria.push({
                            id: result.rows[i][0],
                            nombre: result.rows[i][1]
                        })
                    }
                    rs.send(categoria);
                }
                close(connection);
            });
        });
}

function buscar_productos(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0],
                            imagen: 'http://localhost:3000/' + result.rows[i][1],
                            precio: result.rows[i][2],
                            descripcion: result.rows[i][3],
                            stock: result.rows[i][4],
                            color: result.rows[i][5],
                            autor: result.rows[i][6] + ' ' + result.rows[i][7],
                            id_producto: result.rows[i][8]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function obtener_producto(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0],
                            imagen: 'http://localhost:3000/' + result.rows[i][1],
                            precio: result.rows[i][2],
                            descripcion: result.rows[i][3],
                            stock: result.rows[i][4],
                            color: result.rows[i][5],
                            autor: result.rows[i][6] + ' ' + result.rows[i][7]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R1(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0],
                            promedio: result.rows[i][1]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R2(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R3(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R4(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0],
                            ganancia: result.rows[i][1]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R5(sql,parametros,EsDML,rs){

}

function R6(sql,parametros,EsDML,rs){

}

function R7(sql,parametros,EsDML,rs){

}

function R8(sql,parametros,EsDML,rs){
    oracledb.getConnection(
        {
          user          : "carlos",
          password      : "1234",
          connectString : "localhost:1521/XE"
        },
        function(err, connection)
        {
          if (error(err, rs, null) == -1) { return; }
          connection.execute(
            sql, parametros, {autoCommit : EsDML},
            function(err, result)
            {
                if (error(err, rs, connection) == -1) { return; }
                if(EsDML) { rs.send(JSON.stringify(result.rowsAffected)); }
                else{
                    var productos = [];
                    for(let i = 0 ; i < result.rows.length ; i++){
                        productos.push({
                            nombre: result.rows[i][0],
                            descripcion: result.rows[i][1],
                            autor: result.rows[i][2],
                            precio: result.rows[i][3],
                            stock: result.rows[i][4],
                            catpadre: result.rows[i][5],
                            cathija: result.rows[i][6]
                        })
                    }
                    rs.send(productos);
                }
                close(connection);
            });
        });
}

function R9(sql,parametros,EsDML,rs){

}

function R10(sql,parametros,EsDML,rs){

}

function R11(sql,parametros,EsDML,rs){

}
exports.open = open;
exports.RegistrarUsuario = RegistrarUsuario;
exports.VerificarCorreo = VerificarCorreo;
exports.Login = Login;
exports.cargar_producto = cargar_producto;
exports.recuperar_contrasena = recuperar_contrasena;
exports.modificar_usuario = modificar_usuario;
exports.obtener_bitacora = obtener_bitacora;
exports.obtener_categorias = obtener_categorias;
exports.buscar_productos = buscar_productos;
exports.obtener_producto = obtener_producto;
exports.R1 = R1;
exports.R2 = R2;
exports.R3 = R3;
exports.R4 = R4;
exports.R5 = R5;
exports.R6 = R6;
exports.R7 = R7;
exports.R8 = R8;
exports.R9 = R9;
exports.R10 = R10;
exports.R11 = R11;

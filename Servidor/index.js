const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

global.Ruta_Foto = "ninguna";

/**CONFIGURACION */
app.set('Puerto', process.env.PORT || 3000);

/**MANEJO DE DATOS */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('Servidor/imagenes'));
app.use(cors({origin: 'http://localhost:4200'}));

/**RUTAS */
app.use('/API/Usuarios', require('./rutas/ABCUsuarios'));


/**INICIAR SERVIDOR */
app.listen(app.get('Puerto'), () => {
    console.log('Servidor iniciado en el puerto ', app.get('Puerto'));
})
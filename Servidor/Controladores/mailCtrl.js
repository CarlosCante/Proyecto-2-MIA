const MailCtrl = {};
var nodemailer = require('nodemailer');
// email sender function
MailCtrl.sendEmail = function(mailOptions){
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cecl2010043@gmail.com',
            pass: '564902679'
        }
    });
/* Definimos el email
var mailOptions = {
    from: 'Remitente',
    to: 'destinatario@gmail.com',
    subject: 'Asunto',
    text: 'Contenido del email'
};
*/
// Enviamos el email
transporter.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
    } else {
        console.log("Email sent");
    }
});
};

module.exports = MailCtrl;
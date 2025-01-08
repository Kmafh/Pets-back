const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify().then(() => {
    console.log('Ready to send emails');
}).catch(error => console.error('Error verifying transporter:', error));

async function sendMailVerification(direccion, payload) {
    try {
        const encodedPayload = encodeURIComponent(JSON.stringify(payload));
        const verificationLink = `${process.env.HOST_FRONT}/register?data=${encodedPayload}`;
        
        await transporter.sendMail({
            from: '"Registro FindAFriend  👻" <ecocostenergy@gmail.com>',
            to: direccion,
            subject: "Confirmación de Registro",
            html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Registro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #ff7043;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #ff7043;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            background-color: #f4f4f4;
            color: #666666;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a FindAFriend!</h1>
        </div>
        <div class="content">
            <p>Hola, ${encodedPayload.name}:</p>
            <p>Gracias por registrarte en EcoCost. Estamos emocionados de que te unas a nuestra comunidad.</p>
            <p>Para completar tu registro, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
            <a href=${verificationLink} class="button">Confirmar Registro</a>
            <p>Si el botón anterior no funciona, copia y pega la siguiente URL en tu navegador:</p>
            <p>${verificationLink}</p>
            <p>Gracias por confiar en nosotros,<br>El equipo de EcoCost</p>
        </div>
        <div class="footer">
            <p>© 2024 FindAFriend. Todos los derechos reservados.</p>
            <p>Si no solicitaste este correo, puedes ignorarlo.</p>
        </div>
    </div>
</body>
</html>
`
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error al enviar el correo de verificación');
    }
}

module.exports = {
    transporter,
    sendMailVerification
};

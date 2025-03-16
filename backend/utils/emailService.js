const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar correo
const enviarCorreo = async (destinatario, asunto, mensaje) => {
    try {
        await transporter.sendMail({
            from: `"Soporte Sinergia SGI" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            html: mensaje
        });
        console.log(`📧 Correo enviado a ${destinatario}`);
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
    }
};

module.exports = enviarCorreo;

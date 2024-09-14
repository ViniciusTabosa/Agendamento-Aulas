const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, 
    secure: true,
    auth: {
      user: 'testanildo001@gmail.com', // Seu email
      pass: 'atwyatqopydaifew' // Senha de aplicativo gerada
    },
    tls: {
      rejectUnauthorized: false // Ignora erros relacionados ao certificado
    }
  });

  const mailOptions = {
    from: 'testanildo001@gmail.com',
    to: options.email, // E-mail do destinatário
    subject: options.subject, // Assunto do email
    text: options.message // Mensagem do email
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;


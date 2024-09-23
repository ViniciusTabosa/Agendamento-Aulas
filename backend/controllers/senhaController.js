const crypto = require('crypto');
const Usuario = require('../models/Usuario');
const sendEmail = require('../utils/sendEmail');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verifica se o e-mail foi fornecido
    if (!email) {
      return res.status(400).json({ error: 'Por favor, forneça um e-mail.' });
    }

    // Verifica se o usuário existe no banco de dados
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Gera um token de recuperação de senha
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Define o token e a expiração no modelo de usuário
    usuario.resetPasswordToken = resetToken;
    usuario.resetPasswordExpires = Date.now() + 3600000; // Token válido por 1 hora

    await usuario.save();

    // Cria a mensagem do e-mail
    const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
    const message = `Você está recebendo este e-mail porque solicitou a recuperação de sua senha. Acesse o link para redefinir sua senha: ${resetUrl}`;

    try {
      // Envia o e-mail
      await sendEmail({
        email: usuario.email,
        subject: 'Recuperação de Senha',
        message,
      });

      res.status(200).json({ message: 'E-mail de recuperação de senha enviado.' });
    } catch (error) {
      usuario.resetPasswordToken = undefined;
      usuario.resetPasswordExpires = undefined;
      await usuario.save();
      res.status(500).json({ error: 'Erro ao enviar o e-mail de recuperação.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a recuperação de senha.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Procura o usuário pelo token e verifica se o token não expirou
    const usuario = await Usuario.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    // Atualiza a senha
    usuario.senha = req.body.senha;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    await usuario.save();
    res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao redefinir a senha.' });
  }
};

const sendEmail = require('./sendEmail'); // Importa a função de envio de e-mail

// Função para enviar o lembrete de aula para o aluno e instrutor
const enviarLembreteAula = async (usuario, instrutor, aula, minutos) => {
  const messageUsuario = `Olá ${usuario.nome}, este é um lembrete que sua aula de ${aula.nome} começa em ${minutos} minutos!`;
  const messageInstrutor = `Olá ${instrutor.nome}, este é um lembrete que você tem uma aula de ${aula.nome} começando em ${minutos} minutos!`;

  try {
    // Enviar lembrete para o usuário (aluno)
    await sendEmail({
      email: usuario.email,
      subject: 'Lembrete de Aula',
      message: messageUsuario,
    });
    console.log(`Lembrete enviado para o aluno ${usuario.email}`);

    // Enviar lembrete para o instrutor
    await sendEmail({
      email: instrutor.email,
      subject: 'Lembrete de Aula',
      message: messageInstrutor,
    });
    console.log(`Lembrete enviado para o instrutor ${instrutor.email}`);

  } catch (error) {
    console.error(`Erro ao enviar e-mail: ${error}`);
  }
};

module.exports = { enviarLembreteAula };

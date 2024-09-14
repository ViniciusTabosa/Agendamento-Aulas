const cron = require('node-cron');
const Agendamento = require('../models/Agendamento'); 
const StatusAgendamento = require('../models/StatusAgendamento'); 
const moment = require('moment');
const { enviarLembreteAula } = require('../utils/emailReminders');

// Tarefa agendada para rodar a cada minuto
cron.schedule('* * * * *', async () => {
  console.log('Verificando aulas que irão começar em 5 minutos...');

  const now = moment();
  
  try {
    // Buscar status de aula "Agendada" e "Reagendada"
    const statusAgendamentos = await StatusAgendamento.find({ code: { $in: ["001", "002"] } });
    const statusIds = statusAgendamentos.map(status => status._id);

    // Buscar agendamentos com status "agendada" ou "reagendada"
    const agendamentos = await Agendamento.find({
      statusId: { $in: statusIds }
    }).populate('usuarioId aulaId horarioId');

    // Para cada agendamento, verificar se a aula começa em exatamente 5 minutos
    for (const agendamento of agendamentos) {
      const horaInicioString = agendamento.horarioId.hora_inicio;

      if (horaInicioString) {
        // Combinar a data atual com a hora de início para criar um objeto Moment completo
        const horarioInicio = moment(`${now.format('YYYY-MM-DD')} ${horaInicioString}`, 'YYYY-MM-DD HH:mm');

        // Verificar se o horário atual é exatamente 5 minutos antes do horário de início
        const diffInMinutes = horarioInicio.diff(now, 'minutes');

        if (diffInMinutes === 4) { 
          console.log('Enviando lembrete para aluno e instrutor:', agendamento.usuarioId.email, agendamento.aulaId.instrutorId.email);

          // Enviar o lembrete tanto para o aluno quanto para o instrutor
          const instrutor = await Usuario.findById(agendamento.aulaId.instrutorId); // Certifique-se de que a aula tem o instrutor populado
          if (instrutor) {
            await enviarLembreteAula(agendamento.usuarioId, instrutor, agendamento.aulaId, moment().add(5, 'minutes'));
          } else {
            console.error('Instrutor não encontrado para a aula:', agendamento.aulaId.nome);
          }
        }
      } else {
        console.error('Horário de início não definido para o agendamento:', agendamento._id);
      }
    }
  } catch (error) {
    console.error('Erro ao verificar agendamentos para lembretes:', error);
  }
});

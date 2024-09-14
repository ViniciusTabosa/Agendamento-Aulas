const mongoose = require('mongoose');

const AgendamentoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  aulaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aula',
    required: true,
  },
  horarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HorarioDisponivel',
    required: true,
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StatusAgendamento',
    required: true,
  },
}, { collection: 'agendamentos' });

module.exports = mongoose.model('Agendamento', AgendamentoSchema);

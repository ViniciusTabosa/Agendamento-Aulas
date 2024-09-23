const mongoose = require('mongoose');

const HorarioDisponivelSchema = new mongoose.Schema({
  aulaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aula',
    required: true,
  },
  diaSemana: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6], // 0: Domingo, 1: Segunda, etc.
    required: true,
  },
  hora_inicio: {
    type: String, // Usando Date para armazenar a hora
    required: true,
  },
  hora_fim: {
    type: String, // Usando Date para armazenar a hora
    required: true,
  },
  disponivel: {
    type: Boolean,
    default: true,
  },
}, { collection: 'horarios_disponiveis' });

module.exports = mongoose.model('HorarioDisponivel', HorarioDisponivelSchema);

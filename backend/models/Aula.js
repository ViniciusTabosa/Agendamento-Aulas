const mongoose = require('mongoose');

const AulaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  duracao: {
    type: Number,
    required: true,
  },
  categoriaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoriaAula',
    required: true,
  },
  instrutorId: {  // Novo relacionamento
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  }
}, { collection: 'aulas' });

// Middleware para remover registros relacionados quando a aula for deletada
AulaSchema.pre('findOneAndDelete', async function(next) {
  const aulaId = this.getQuery()['_id'];

  // Deletar todos os horários relacionados a aula
  await mongoose.model('HorarioDisponivel').deleteMany({ aulaId });

  // Deletar todos os agendamentos relacionados a aula
  await mongoose.model('Agendamento').deleteMany({ aulaId });

  next();
});

module.exports = mongoose.model('Aula', AulaSchema);

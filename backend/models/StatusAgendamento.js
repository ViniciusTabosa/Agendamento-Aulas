const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
}, { collection: 'status_agendamento' });

module.exports = mongoose.model('StatusAgendamento', StatusSchema);

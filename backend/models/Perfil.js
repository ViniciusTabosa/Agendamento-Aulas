const mongoose = require('mongoose');

const PerfilSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
}, { collection: 'perfis' }); 

module.exports = mongoose.model('Perfil', PerfilSchema);

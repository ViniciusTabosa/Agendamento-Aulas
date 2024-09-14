const mongoose = require('mongoose');

const CategoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  }
}, { collection: 'categorias_aulas' });

module.exports = mongoose.model('CategoriaAula', CategoriaSchema);

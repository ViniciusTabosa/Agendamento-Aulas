const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  sobrenome: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  perfilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Perfil',
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,  // Inicialmente falso
  },
  confirmationToken: {
    type: String,  // Token de confirmação
  },
  resetPasswordToken: { // Token para resetar senha
    type: String, 
  },
  resetPasswordExpires: {
    type: Date,
  },
  novoEmail: {
    type: String,
  },
  codigoConfirmacaoEmail: {
    type: String,
  },  
}, { collection: 'usuarios' });

// Hash da senha antes de salvar o usuário
UsuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Hook para excluir agendamentos relacionados ao excluir um usuário
UsuarioSchema.pre('findOneAndDelete', async function(next) {
  const usuarioId = this.getQuery()['_id'];

  try {
    // Excluir agendamentos relacionados ao usuário
    await Agendamento.deleteMany({ usuarioId });

    next();
  } catch (error) {
    next(error); // Propagar erro se houver
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

const mongoose = require('mongoose');
const Perfil = require('../models/Perfil');
const StatusAgendamento = require('../models/StatusAgendamento');

const seedDatabase = async () => {
  await mongoose.connect('mongodb://localhost:27017/class-scheduling');

  const perfis = [
    { nome: 'Administrador', code: '001' },
    { nome: 'Usuario', code: '002' },
    { nome: 'Instrutor', code: '003' },
  ];

  const status = [
    { nome: "Agendada", code: "001" },
    { nome: "Reagendada", code: "002" },
    { nome: "Cancelada", code: "003" },
    { nome: "Finalizada", code: "004" }
  ];

  try {
    // Inserir novos dados
    await Perfil.insertMany(perfis);
    await StatusAgendamento.insertMany(status);

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

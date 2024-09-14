const Agendamento = require('../models/Agendamento');
const HorarioDisponivel = require('../models/HorarioDisponivel');
const Usuario = require('../models/Usuario');
const Aula = require('../models/Aula');
const StatusAgendamento = require('../models/StatusAgendamento');
const sendEmail = require('../utils/sendEmail');


// Criar um novo agendamento
exports.criarAgendamento = async (req, res) => {
  try {
    const { usuarioId, aulaId, horarioId } = req.body;

    // Verificar se todos os campos foram fornecidos
    if (!usuarioId || !aulaId || !horarioId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o usuário existe e popular os dados do usuário
    const usuarioExistente = await Usuario.findById(usuarioId).select('nome email');
    if (!usuarioExistente) {
      return res.status(400).json({ error: 'Usuário inválido' });
    }

    // Verificar se a aula existe e popular o instrutor associado
    const aulaExistente = await Aula.findById(aulaId).populate({
      path: 'instrutorId',
      select: 'nome email',
    });
    if (!aulaExistente) {
      return res.status(400).json({ error: 'Aula inválida' });
    }

    // Garantir que o instrutor esteja associado à aula e tenha um e-mail
    if (!aulaExistente.instrutorId || !aulaExistente.instrutorId.email) {
      return res.status(400).json({ error: 'Instrutor inválido ou sem e-mail associado à aula' });
    }

    // Verificar se o horário existe
    const horarioExistente = await HorarioDisponivel.findById(horarioId);
    if (!horarioExistente) {
      return res.status(400).json({ error: 'Horário inválido' });
    }

    // Verificar se o horário está disponível
    if (!horarioExistente.disponivel) {
      return res.status(400).json({ error: 'Este horário está indisponível para agendamento.' });
    }

    // Buscar status "Agendada"
    const statusAgendada = await StatusAgendamento.findOne({ code: '001' });

    // Criar um novo agendamento
    const novoAgendamento = new Agendamento({
      usuarioId,
      aulaId,
      horarioId,
      statusId: statusAgendada._id, // Atribuir status "Agendada"
    });

    // Salvar o novo agendamento
    const agendamentoSalvo = await novoAgendamento.save();

    // Atualizar o horário para indisponível
    horarioExistente.disponivel = false;
    await horarioExistente.save();

    // Enviar e-mails de notificação de agendamento para o aluno e o instrutor
    await sendEmail({
      email: usuarioExistente.email,
      subject: 'Agendamento Confirmado',
      message: `Olá ${usuarioExistente.nome}, seu agendamento para a aula "${aulaExistente.nome}" foi confirmado para o horário ${horarioExistente.hora_inicio} às ${horarioExistente.hora_fim}.`,
    });

    await sendEmail({
      email: aulaExistente.instrutorId.email,
      subject: 'Novo Agendamento',
      message: `Olá ${aulaExistente.instrutorId.nome}, uma nova aula foi agendada para você no horário ${horarioExistente.hora_inicio} às ${horarioExistente.hora_fim} para a aula "${aulaExistente.nome}".`,
    });

    // Retornar resposta de sucesso
    res.status(201).json({ message: 'Agendamento criado com sucesso', agendamento: agendamentoSalvo });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento', detalhes: error.message });
  }
};

// Reagendar uma aula
exports.reagendarAgendamento = async (req, res) => {
  try {
    const { agendamentoId, novoHorarioId } = req.body;

    const agendamento = await Agendamento.findById(agendamentoId)
      .populate('usuarioId')   // Popula o usuário
      .populate({
        path: 'aulaId',
        populate: {
          path: 'instrutorId', // Popula o instrutor associado à aula
          select: 'email nome' // Somente os campos 'email' e 'nome'
        }
      });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    const novoHorario = await HorarioDisponivel.findById(novoHorarioId);
    if (!novoHorario || !novoHorario.disponivel) {
      return res.status(400).json({ error: 'Horário indisponível ou inválido' });
    }

    const statusReagendada = await StatusAgendamento.findOne({ code: '002' }); // Status 'Reagendada'

    const horarioAnterior = await HorarioDisponivel.findById(agendamento.horarioId);
    horarioAnterior.disponivel = true;
    await horarioAnterior.save();

    agendamento.horarioId = novoHorarioId;
    agendamento.statusId = statusReagendada._id; // Atribuir status 'Reagendada'
    await agendamento.save();

    novoHorario.disponivel = false;
    await novoHorario.save();

     // Enviar e-mails de notificação de reagendamento
     await sendEmail({
      email: agendamento.usuarioId.email,
      subject: 'Aula Reagendada',
      message: `Seu agendamento para a aula "${agendamento.aulaId.nome}" foi reagendado para o novo horário ${novoHorario.hora_inicio} às ${novoHorario.hora_fim}.`
    });

    await sendEmail({
      email: agendamento.aulaId.instrutorId.email,
      subject: 'Aula Reagendada',
      message: `A aula "${agendamento.aulaId.nome}" foi reagendada para o novo horário ${novoHorario.hora_inicio} às ${novoHorario.hora_fim}.`
    });

    res.status(200).json({ message: 'Agendamento reagendado com sucesso', agendamento });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao reagendar aula', detalhes: error.message });
  }
};

// Cancelar um agendamento com confirmação
exports.cancelarAgendamento = async (req, res) => {
  try {
    const { agendamentoId } = req.body;

    // Buscar o agendamento, populando o usuário e a aula
    const agendamento = await Agendamento.findById(agendamentoId)
      .populate('usuarioId')   // Popula o usuário
      .populate({
        path: 'aulaId',
        populate: {
          path: 'instrutorId', // Popula o instrutor associado à aula
          select: 'email nome' // Somente os campos 'email' e 'nome'
        }
      });

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    // Buscar status "Cancelada"
    const statusCancelada = await StatusAgendamento.findOne({ code: '003' });

    // Marcar o horário como disponível
    const horario = await HorarioDisponivel.findById(agendamento.horarioId);
    horario.disponivel = true;
    await horario.save();

    // Atualizar o status do agendamento para 'Cancelada'
    agendamento.statusId = statusCancelada._id;
    await agendamento.save();

    // Verificar se os e-mails do usuário e do instrutor estão presentes
    if (!agendamento.usuarioId.email) {
      return res.status(400).json({ error: 'E-mail do usuário não encontrado' });
    }
    if (!agendamento.aulaId.instrutorId || !agendamento.aulaId.instrutorId.email) {
      return res.status(400).json({ error: 'E-mail do instrutor não encontrado' });
    }

    // Enviar e-mails de notificação de cancelamento para o aluno e o instrutor
    await sendEmail({
      email: agendamento.usuarioId.email,
      subject: 'Aula Cancelada',
      message: `Olá ${agendamento.usuarioId.nome}, sua aula de "${agendamento.aulaId.nome}" foi cancelada.`
    });

    await sendEmail({
      email: agendamento.aulaId.instrutorId.email,
      subject: 'Aula Cancelada',
      message: `Olá ${agendamento.aulaId.instrutorId.nome}, a aula de "${agendamento.aulaId.nome}" foi cancelada.`
    });

    res.status(200).json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Erro ao cancelar agendamento', detalhes: error.message });
  }
};


// Obter todos os agendamentos
exports.obterAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().populate('usuarioId').populate('aulaId').populate('horarioId').populate('tipo_pagamentoId');
    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter agendamentos' });
  }
};

// Obter um agendamento por ID
exports.obterAgendamentoPorId = async (req, res) => {
  try {
    const agendamento = await Agendamento.findById(req.params.id).populate('usuarioId').populate('aulaId').populate('horarioId').populate('statusId');
    if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
    res.status(200).json(agendamento);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter agendamento' });
  }
};

// Obter agendamentos de um aluno por usuarioId
exports.obterAgendamentosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Verificar se o usuário existe
    const usuarioExistente = await Usuario.findById(usuarioId);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar todos os agendamentos do usuário
    const agendamentos = await Agendamento.find({ usuarioId })
      .populate('aulaId')
      .populate('horarioId')
      .populate('statusId')

    if (agendamentos.length === 0) {
      return res.status(404).json({ error: 'Nenhum agendamento encontrado para este usuário' });
    }

    res.status(200).json(agendamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter agendamentos do usuário', detalhes: error.message });
  }
};

// Buscar agendamentos com filtros para a página de gerenciamento de agendamentos (admin)
exports.buscarAgendamentosComFiltros = async (req, res) => {
  try {
    const { searchQuery, statusId, pagina = 1, agendamentosPorPagina = 10 } = req.query;

    let query = {};

    // Se houver um filtro de busca por nome do usuário ou nome da aula
    if (searchQuery) {
      // Buscar usuários cujo nome ou sobrenome correspondem ao searchQuery
      const usuarios = await Usuario.find({ 
        $or: [
          { nome: { $regex: searchQuery, $options: 'i' } },
          { sobrenome: { $regex: searchQuery, $options: 'i' } }
        ]
      }).select('_id');

      // Buscar aulas cujo nome corresponda ao searchQuery
      const aulas = await Aula.find({ 
        nome: { $regex: searchQuery, $options: 'i' } 
      }).select('_id');

      // Adicionar os filtros de ID de usuário e aula ao query
      query.$or = [
        { usuarioId: { $in: usuarios.map(usuario => usuario._id) } },
        { aulaId: { $in: aulas.map(aula => aula._id) } }
      ];
    }

    // Filtro por status
    if (statusId) {
      query.statusId = statusId;
    }

    // Buscar agendamentos com paginação
    const agendamentos = await Agendamento.find(query)
      .populate('usuarioId', 'nome sobrenome')
      .populate('aulaId', 'nome')
      .populate('horarioId', 'hora_inicio hora_fim')
      .populate('statusId', 'nome')
      .skip((pagina - 1) * agendamentosPorPagina)
      .limit(parseInt(agendamentosPorPagina))
      .sort({ 'horarioId.hora_inicio': 1 }); // Ordena por horário de início

    // Contar o total de agendamentos para paginação
    const totalAgendamentos = await Agendamento.countDocuments(query);

    res.status(200).json({ agendamentos, totalAgendamentos });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar agendamentos', detalhes: error.message });
  }
};
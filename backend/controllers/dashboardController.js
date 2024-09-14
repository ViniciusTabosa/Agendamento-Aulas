const Agendamento = require('../models/Agendamento');
const Aula = require('../models/Aula');
const Usuario = require('../models/Usuario');
const HorarioDisponivel = require('../models/HorarioDisponivel');

exports.obterDadosDoDashboard = async (req, res) => {
  try {
    // Total de aulas
    const totalAulas = await Aula.countDocuments();

    // Aulas com horários disponíveis
    const aulasDisponiveis = await HorarioDisponivel.find({ disponivel: true }).distinct('aulaId');
    const totalAulasDisponiveis = aulasDisponiveis.length;

    // Aulas mais populares (com base no número de agendamentos)
    const aulasPopulares = await Agendamento.aggregate([
      { $group: { _id: "$aulaId", totalAgendamentos: { $sum: 1 } } },
      { $sort: { totalAgendamentos: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "aulas",
          localField: "_id",
          foreignField: "_id",
          as: "aula"
        }
      }
    ]);

    // Total de agendamentos
    const totalAgendamentos = await Agendamento.countDocuments();

    // Próximas aulas agendadas
    const proximasAulas = await Agendamento.find()
      .sort({ 'horarioId.hora_inicio': 1 })
      .limit(5)
      .populate('aulaId')
      .populate('usuarioId')
      .populate('horarioId');

    // Total de usuários
    const totalUsuarios = await Usuario.countDocuments();

    // Distribuição de perfis (quantos alunos, instrutores, admins)
    const usuariosPorPerfil = await Usuario.aggregate([
      { $group: { _id: "$perfilId", total: { $sum: 1 } } }
    ]);

    // Horários disponíveis e ocupados
    const totalHorarios = await HorarioDisponivel.countDocuments();
    const horariosOcupados = await HorarioDisponivel.countDocuments({ disponivel: false });

    // Resposta com os dados do dashboard
    res.status(200).json({
      totalAulas,
      totalAulasDisponiveis,
      aulasPopulares,
      totalAgendamentos,
      proximasAulas,
      totalUsuarios,
      usuariosPorPerfil,
      totalHorarios,
      horariosOcupados
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter dados do dashboard', detalhes: error.message });
  }
};

const Aula = require('../models/Aula');
const HorarioDisponivel = require('../models/HorarioDisponivel');
const Agendamento = require('../models/Agendamento');
const StatusAgendamento = require('../models/StatusAgendamento');

// Criar uma nova aula
exports.criarAula = async (req, res) => {
  try {
    const { nome, descricao, duracao, categoriaId, instrutorId } = req.body;

    // Verificação de campos obrigatórios
    if (!nome || !descricao || !duracao || !categoriaId || !instrutorId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificação se a duração é um número positivo
    if (duracao <= 0) {
      return res.status(400).json({ error: 'A duração da aula não pode ser um valor negativo' });
    }

    // Verificação de duplicidade de nome de aula
    const aulaExistente = await Aula.findOne({ nome });
    if (aulaExistente) {
      return res.status(400).json({ error: 'Já existe uma aula com este nome' });
    }

    // Criar e salvar a aula
    const novaAula = new Aula({ nome, descricao, duracao, categoriaId, instrutorId });
    const aulaSalva = await novaAula.save();
    res.status(201).json({ message: 'Aula criada com sucesso', aula: aulaSalva });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aula', detalhes: error.message });
  }
};

// Atualizar uma aula
exports.atualizarAula = async (req, res) => {
  try {
    const { nome, descricao, duracao, categoriaId, instrutorId } = req.body;
    const aulaId = req.params.id;

    // Verificar se todos os campos obrigatórios foram fornecidos
    if (!nome || !descricao || !duracao || !categoriaId || !instrutorId) {
      return res.status(400).json({ error: 'Os campos nome, duracao e categoriaId são obrigatórios' });
    }

    // Atualizar a aula
    const aulaAtualizada = await Aula.findByIdAndUpdate(
      aulaId,
      { nome, descricao, duracao, categoriaId, instrutorId },
      { new: true } // Retornar a aula atualizada
    );

    if (!aulaAtualizada) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }

    res.status(200).json({ message: 'Aula atualizada com sucesso', aula: aulaAtualizada });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a aula', detalhes: error.message });
  }
};

// Deletar uma aula e registros relacionados
exports.deletarAula = async (req, res) => {
  try {
    const aulaId = req.params.id;

    // Deletar a aula
    const aulaDeletada = await Aula.findByIdAndDelete(aulaId);

    if (!aulaDeletada) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }

    res.status(200).json({ message: 'Aula e registros relacionados deletados com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aula', detalhes: error.message });
  }
};


// Obter todas as aulas
exports.obterAulas = async (req, res) => {
  try {
    const aulas = await Aula.find()
      .populate('categoriaId')  // Populando a categoria
      .populate('instrutorId', 'nome sobrenome');  // Populando o instrutor com apenas nome e sobrenome

    res.status(200).json(aulas);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter aulas' });
  }
};


// Obter uma aula por ID
exports.obterAulaPorId = async (req, res) => {
  try {
    const aula = await Aula.findById(req.params.id)
      .populate('categoriaId')  // Populando a categoria
      .populate('instrutorId', 'nome sobrenome');  // Populando o instrutor com nome e sobrenome

    if (!aula) return res.status(404).json({ error: 'Aula não encontrada' });
    
    res.status(200).json(aula);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter aula' });
  }
};

// Obter todas as aulas e verificar se possuem horários disponíveis
exports.obterAulasEDisponibilidade = async (req, res) => {
  try {
    // Buscar todas as aulas cadastradas, incluindo categoria e instrutor
    const aulas = await Aula.find()
      .populate('categoriaId')
      .populate('instrutorId', 'nome sobrenome'); // Populando o instrutor diretamente na aula
    
    // Mapear as aulas para adicionar a informação de disponibilidade
    const aulasComDisponibilidade = await Promise.all(aulas.map(async (aula) => {
      // Buscar os horários disponíveis relacionados a esta aula
      const horarios = await HorarioDisponivel.find({ aulaId: aula._id });
      
      let temHorarioDisponivel = false;

      if (horarios.length > 0) {
        // Verificar se há algum horário disponível (disponivel === true)
        temHorarioDisponivel = horarios.some(horario => horario.disponivel);
      }

      return {
        ...aula.toObject(), // Converte o documento do Mongoose para objeto JS
        temHorarioDisponivel: temHorarioDisponivel, // Indica se há ou não horários disponíveis
      };
    }));

    res.status(200).json(aulasComDisponibilidade);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar aulas e horários disponíveis.' });
  }
};


// buscar aulas com filtro para a página de gerenciamento de aulas (admin)
exports.buscarAulasComFiltros = async (req, res) => {
  try {
    const { searchQuery, categoriaId, pagina = 1, aulasPorPagina = 10 } = req.query;

    let query = {};

    // Aplicar filtros de nome e categoria
    if (searchQuery) {
      query.nome = { $regex: searchQuery, $options: "i" };
    }
    if (categoriaId) {
      query.categoriaId = categoriaId;
    }

    // Buscar aulas com paginação
    const aulas = await Aula.find(query)
      .populate('categoriaId')
      .populate('instrutorId', 'nome sobrenome')
      .sort({ nome: 1 }) // Ordena por nome
      .skip((pagina - 1) * aulasPorPagina)
      .limit(parseInt(aulasPorPagina));

    // Contar o total de aulas para paginação
    const totalAulas = await Aula.countDocuments(query);

    // Verificar a disponibilidade de horários para cada aula
    const resultado = await Promise.all(aulas.map(async (aula) => {
      // Buscar os horários disponíveis relacionados a esta aula
      const horarios = await HorarioDisponivel.find({ aulaId: aula._id });
      
      // Verificar se há algum horário disponível
      let temHorarioDisponivel = false;
      if (horarios.length > 0) {
        temHorarioDisponivel = horarios.some(horario => horario.disponivel);
      }

      return {
        ...aula.toObject(),
        temHorarioDisponivel, // Adiciona a informação de disponibilidade
      };
    }));

    res.status(200).json({ aulas: resultado, totalAulas });
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar aulas", detalhes: error.message });
  }
};

// Obter aulas com maior demanda (mais agendamentos, exceto os cancelados)
exports.obterAulasEmDestaque = async (req, res) => {
  try {
    // Buscar status cancelado para excluir da contagem
    const statusCancelado = await StatusAgendamento.findOne({ code: '003' }); 

    // Agrupar agendamentos por aulaId e contar, excluindo agendamentos com status cancelado
    const aulasComDemanda = await Agendamento.aggregate([
      { $match: { statusId: { $ne: statusCancelado._id } } }, // Excluir agendamentos cancelados
      { $group: { _id: "$aulaId", totalAgendamentos: { $sum: 1 } } }, // Contar agendamentos por aula
      { $sort: { totalAgendamentos: -1 } }, // Ordenar por maior número de agendamentos
      { $limit: 10 } // Limitar a 10 aulas com maior demanda
    ]);

    // Obter os detalhes das aulas
    const aulasIds = aulasComDemanda.map(item => item._id);
    const aulas = await Aula.find({ _id: { $in: aulasIds } })
      .populate('categoriaId')
      .populate('instrutorId', 'nome sobrenome');

    // Mapear e verificar a disponibilidade dos horários para cada aula
    const resultado = await Promise.all(aulas.map(async (aula) => {
      // Buscar os horários disponíveis relacionados a esta aula
      const horarios = await HorarioDisponivel.find({ aulaId: aula._id });
      
      // Verificar se há algum horário disponível
      let temHorarioDisponivel = false;
      if (horarios.length > 0) {
        temHorarioDisponivel = horarios.some(horario => horario.disponivel);
      }

      // Buscar o número total de agendamentos para a aula
      const agendamentos = aulasComDemanda.find(item => item._id.equals(aula._id)).totalAgendamentos;

      return {
        ...aula.toObject(),
        totalAgendamentos: agendamentos,
        temHorarioDisponivel, // Indica se a aula tem horários disponíveis
      };
    }));

    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aulas com maior demanda', detalhes: error.message });
  }
};


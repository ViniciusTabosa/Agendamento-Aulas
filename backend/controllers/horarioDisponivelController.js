const HorarioDisponivel = require('../models/HorarioDisponivel');
const Aula = require('../models/Aula');

// Função auxiliar para converter horário no formato "HH:mm" para minutos
function converterHorarioParaMinutos(horario) {
  const [horas, minutos] = horario.split(':').map(Number);
  return horas * 60 + minutos;
}

// Criar um novo horário disponível
exports.criarHorarioDisponivel = async (req, res) => {
  try {
    const { aulaId, diaSemana, hora_inicio, hora_fim } = req.body;

    // Verificação de campos obrigatórios
    if (!aulaId || diaSemana === undefined || !hora_inicio || !hora_fim) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificação se a aula existe
    const aulaExistente = await Aula.findById(aulaId);
    if (!aulaExistente) {
      return res.status(400).json({ error: 'Aula inválida' });
    }

    // Verificação se o horário de início é anterior ao horário de fim
    const startTimeInMinutes = converterHorarioParaMinutos(hora_inicio);
    const endTimeInMinutes = converterHorarioParaMinutos(hora_fim);

    if (startTimeInMinutes >= endTimeInMinutes) {
      return res.status(400).json({ error: 'O horário de início deve ser anterior ao horário de fim' });
    }

    // Verificação da duração do horário com a duração da aula (em minutos)
    const duracaoHorario = endTimeInMinutes - startTimeInMinutes;
    const duracaoAula = aulaExistente.duracao * 60; // Converte a duração da aula de horas para minutos

    if (duracaoHorario !== duracaoAula) {
      return res.status(400).json({ error: `A duração do horário (${duracaoHorario} minutos) deve ser igual à duração da aula (${duracaoAula} minutos)` });
    }

    // Verificação se já existe um horário disponível para a mesma aula, dia da semana e horário
    const horarioExistente = await HorarioDisponivel.findOne({
      aulaId,
      diaSemana,
      hora_inicio,
      hora_fim
    });

    if (horarioExistente) {
      return res.status(400).json({ error: 'Já existe um horário cadastrado com os mesmos detalhes' });
    }

    // Criar e salvar o horário disponível
    const novoHorario = new HorarioDisponivel({ aulaId, diaSemana, hora_inicio, hora_fim });
    const horarioSalvo = await novoHorario.save();
    res.status(201).json({ message: 'Horário disponível criado com sucesso', horario: horarioSalvo });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar horário disponível', detalhes: error.message });
  }
};

exports.atualizarHorarioDisponivel = async (req, res) => {
  try {
    const { aulaId, diaSemana, hora_inicio, hora_fim, disponivel } = req.body;
    const horarioDisponivelAtualizado = await HorarioDisponivel.findByIdAndUpdate(req.params.id, { aulaId, diaSemana, hora_inicio, hora_fim, disponivel }, { new: true });

    if (!horarioDisponivelAtualizado) return res.status(404).json({ error: 'Categoria não encontrada' });

    res.status(200).json({ message: 'Horário atualizado com sucesso', horario: horarioDisponivelAtualizado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar horário', detalhes: error.message });
  }
};

// Obter todos os horários disponíveis
exports.obterHorariosDisponiveis = async (req, res) => {
  try {
    const horarios = await HorarioDisponivel.find().populate('aulaId');
    res.status(200).json(horarios);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter horários disponíveis' });
  }
};

// Obter um horário disponível por ID
exports.obterHorarioDisponivelPorId = async (req, res) => {
  try {
    const horario = await HorarioDisponivel.findById(req.params.id).populate('aulaId');
    if (!horario) return res.status(404).json({ error: 'Horário não encontrado' });
    res.status(200).json(horario);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter horário disponível' });
  }
};

// Obter horários disponíveis por aula
exports.obterHorariosDisponiveisPorAulaId = async (req, res) => {
  try {
    const horarios = await HorarioDisponivel.find({ aulaId: req.params.aulaId }).populate('aulaId');
    if (horarios.length === 0) return res.status(404).json({ error: 'Nenhum horário encontrado para esta aula' });
    res.status(200).json(horarios);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter horários disponíveis' });
  }
};

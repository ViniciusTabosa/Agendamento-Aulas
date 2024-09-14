const Perfil = require('../models/Perfil');

// Obter todos os perfis
exports.obterPerfis = async (req, res) => {
  try {
    const perfis = await Perfil.find();
    res.status(200).json(perfis);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter perfis' });
  }
};

// Obter um perfil por code
exports.obterPerfilPorCode = async (req, res) => {
  try {
    const perfil = await Perfil.findOne({ code: req.params.code });
    if (!perfil) return res.status(404).json({ error: 'Perfil não encontrado' });
    res.status(200).json(perfil);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter perfil' });
  }
};

// Obter um perfil por ID
exports.obterPerfilPorId = async (req, res) => {
  try {
    const perfil = await Perfil.findById(req.params.id);
    if (!perfil) return res.status(404).json({ error: 'perfil não encontrado' });
    res.status(200).json(perfil);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter perfil' });
  }
};

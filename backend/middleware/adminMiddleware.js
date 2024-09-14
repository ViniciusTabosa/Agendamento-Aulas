const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verificarAdmin = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(403).json({ error: 'Acesso negado. Token não fornecido.' });
    }
    
    try {
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);  // Verifique se o token está correto
      const usuario = await Usuario.findById(decoded.id).populate('perfilId');
    
      if (usuario.perfilId.code !== '001') {
        return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
      }
    
      req.user = usuario; // Passa o usuário para a próxima função
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    
};

module.exports = verificarAdmin; 

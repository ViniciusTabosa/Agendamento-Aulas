const jwt = require('jsonwebtoken');

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica e decodifica o token
        req.usuario = decoded; // Armazena o usuário decodificado na requisição
        next(); // Passa para a próxima função
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;

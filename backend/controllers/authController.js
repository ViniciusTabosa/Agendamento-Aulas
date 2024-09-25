const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Verificação de campos obrigatórios
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Verificação se o usuário existe
        const usuario = await Usuario.findOne({ email }).populate('perfilId');
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        // Verificação se a conta foi confirmada
        if (!usuario.isConfirmed) {
            return res.status(403).json({ error: 'A conta ainda não foi confirmada. Verifique seu e-mail.' });
        }

        // Verificação de senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login realizado com sucesso', 
            token, 
            userId: usuario._id,
            nome: usuario.nome,
            sobrenome: usuario.sobrenome,
            perfilCode: usuario.perfilId.code // Retornar o código do perfil
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login', detalhes: error.message });
    }
};

// Função para redefinir senha
exports.redefinirSenha = async (req, res) => {
    const { token, password } = req.body;

    try {
        // Verifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuarioId = decoded.id;

        // Encontra o usuário no banco de dados
        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(400).json({ error: 'Usuário não encontrado.' });
        }

        // Hash da nova senha
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(password, salt);

        // Salva o usuário com a nova senha
        await usuario.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
};


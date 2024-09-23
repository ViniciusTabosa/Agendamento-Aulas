const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para criar um novo usuário
router.post('/', usuarioController.criarUsuario);

// Rota para confirmar conta do usuário
router.get('/confirm-account/:token', usuarioController.confirmAccount);

// Rota para obter todos os usuários
router.get('/', usuarioController.buscarUsuarios);

// Rota para obter um usuário específico por ID
router.get('/:id', usuarioController.obterUsuarioPorId);

// Rota para obter usuários por Perfil (ex: instrutor, administrador)
router.get('/role/:role', usuarioController.obterUsuariosPorPerfil);

// Atualizar informações pessoais (nome e sobrenome)
router.put('/atualizar-informacoes/:id', usuarioController.atualizarInformacoesPessoais);

// Atualizar senha
router.put('/alterar-senha/:id', usuarioController.alterarSenha);

// Enviar código de confirmação para alterar o e-mail
router.post('/enviar-codigo-confirmacao/:id', usuarioController.enviarCodigoConfirmacaoEmail);

// Confirmar código e atualizar o e-mail
router.post('/confirmar-codigo-email/:id', usuarioController.confirmarCodigoEmail);

// Deletar perfil
router.delete('/:id', usuarioController.deletarUsuario);

module.exports = router;

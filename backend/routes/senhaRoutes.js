const express = require('express');
const router = express.Router();
const senhaController = require('../controllers/senhaController');

// Rota para solicitar recuperação de senha
router.post('/forgot-password', senhaController.forgotPassword);

// Rota para redefinir senha
router.post('/reset-password/:token', senhaController.resetPassword);

module.exports = router;

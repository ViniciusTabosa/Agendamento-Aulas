const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota para login
router.post('/', authController.login); 

// Rota para redefinir senha
router.post('/reset-password', authController.redefinirSenha);

module.exports = router;

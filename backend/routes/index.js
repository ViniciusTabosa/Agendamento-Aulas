const express = require('express');
const router = express.Router();
const verificarAdmin = require('../middleware/adminMiddleware');  

// Rotas que não precisam de autenticação (ex: login, registro)
router.use('/login', require('./authRoutes')); 
router.use('/register', require('./usuarioRoutes')); 
router.use('/perfis', require('./perfilRoutes')); 
router.use('/password', require('./senhaRoutes'));
router.use('/account', require('./usuarioRoutes'));
router.use('/classes', require('./aulaRoutes')); 
router.use('/categories', require('./categoriaAulaRoutes')); 
router.use('/horarios-disponiveis', require('./horarioDisponivelRoutes')); 
router.use('/agendamentos', require('./agendamentoRoutes')); 
router.use('/usuarios', require('./usuarioRoutes')); 
router.use('/admin', verificarAdmin, require('./adminRoutes'));  // Usa o middleware aqui
router.use('/dashboard', verificarAdmin, require('./dashboardRoutes'));


module.exports = router;

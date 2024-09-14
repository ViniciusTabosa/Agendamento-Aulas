const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');

router.get('/', perfilController.obterPerfis);
router.get('/:id', perfilController.obterPerfilPorId);
router.get('/code/:code', perfilController.obterPerfilPorCode);

module.exports = router;

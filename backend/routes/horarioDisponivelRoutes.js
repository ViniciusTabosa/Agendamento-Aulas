const express = require('express');
const router = express.Router();
const horarioDisponivelController = require('../controllers/horarioDisponivelController');


router.get('/', horarioDisponivelController.obterHorariosDisponiveis);
router.get('/:id', horarioDisponivelController.obterHorarioDisponivelPorId);
router.get('/aula/:aulaId', horarioDisponivelController.obterHorariosDisponiveisPorAulaId)

module.exports = router;

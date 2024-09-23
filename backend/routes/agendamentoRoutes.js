const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.post('/', agendamentoController.criarAgendamento);

router.get('/obter-agendamentos', agendamentoController.obterAgendamentos);

// Obter agendamentos por usuarioId
router.get('/usuario-agendamentos/:usuarioId', agendamentoController.obterAgendamentosPorUsuario);

// Reagendar aula
router.put('/reagendar', agendamentoController.reagendarAgendamento);

// Cancelar agendamento
router.put('/cancelar', agendamentoController.cancelarAgendamento);

// Buscar agendamentos com filtros
router.get('/get-filtered-scheduling', agendamentoController.buscarAgendamentosComFiltros);

router.get('/:id', agendamentoController.obterAgendamentoPorId);

module.exports = router;

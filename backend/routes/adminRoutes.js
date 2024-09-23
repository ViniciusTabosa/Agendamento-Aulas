const express = require('express');
const router = express.Router();
const aulaController = require('../controllers/aulaController');
const categoriaController = require('../controllers/categoriaAulaController');
const horarioDisponivelController = require('../controllers/horarioDisponivelController');
const agendamentoController = require('../controllers/agendamentoController');


// Rota para criar aula
router.post('/create-class', aulaController.criarAula);

// Rota para deletar aula
router.delete('/delete-class/:id', aulaController.deletarAula);

// Rota para atualizar aula
router.put('/update-class/:id', aulaController.atualizarAula);

// Rota para criar uma categoria de aula
router.post('/create-category', categoriaController.criarCategoria);

// Rota para atualizar uma categoria
router.put('/update-category/:id', categoriaController.atualizarCategoria);

// Rota para criar um horário para a aula
router.post('/create-available-time', horarioDisponivelController.criarHorarioDisponivel);

// Rota para atualizar horário disponível
router.put('/update-available-time/:id', horarioDisponivelController.atualizarHorarioDisponivel);



module.exports = router;

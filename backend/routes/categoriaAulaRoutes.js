const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaAulaController');


// Rota para obter todas as categorias
router.get('/', categoriaController.obterCategorias);

// Rota para buscar todas as categorias com ou sem utilização de filtros
router.get('/get-categories', categoriaController.buscarCategoriasComFiltros)

// Rota para obter uma categoria específica por ID
router.get('/:id', categoriaController.obterCategoriaPorId);

module.exports = router;

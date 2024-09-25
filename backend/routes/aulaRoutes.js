const express = require('express');
const router = express.Router();
const aulaController = require('../controllers/aulaController');

router.get('/get-classes-details', aulaController.obterAulasEDisponibilidade); 
router.get('/get-classes', aulaController.obterAulas);
router.get('/get-filtered-classes', aulaController.buscarAulasComFiltros);
router.get('/:id', aulaController.obterAulaPorId); 

module.exports = router;

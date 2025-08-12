const express = require('express');
const router = express.Router();
const avaliacaoController = require('../controllers/avaliacaoController');
const authMiddleware = require('../middlewares/auth'); // Exemplo de middleware de autenticação

router.post('/:VendaId', authMiddleware, avaliacaoController.registrarAvaliacao);

module.exports = router;
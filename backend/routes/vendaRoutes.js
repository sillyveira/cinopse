const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/vendaController') // Ajuste o path conforme sua estrutura
const authMiddleware = require('../middlewares/auth')

// Exemplo de rota protegida que usa o middleware de autenticação
router.put('/:LivroId/:ReservaId/:VendaPendenteId', authMiddleware, VendaController.confirmarVenda);

module.exports = router;

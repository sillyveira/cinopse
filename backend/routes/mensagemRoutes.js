const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');
const authMiddleware = require('../middlewares/auth');

// GET /mensagens/conversa/:conversaId - Get conversation messages
router.get('/conversa/:conversaId', authMiddleware, mensagemController.getConversationMessages);

// POST /mensagens - Create message
router.post('/', authMiddleware, mensagemController.createMessage);

module.exports = router;

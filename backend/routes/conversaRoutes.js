// routes/conversations.js
const express = require('express');
const router = express.Router();
const conversaController = require('../controllers/conversaController');
const authMiddleware = require('../middlewares/auth');

// POST /conversas - Create or get conversation
router.post('/', authMiddleware, conversaController.iniciarConversa);

// GET /conversas/usuario/:userId - Get user conversations
router.get('/usuario', authMiddleware, conversaController.getConversasUsuario);

module.exports = router;

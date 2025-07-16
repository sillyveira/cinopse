const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
 
// GET /users/search?nome=... - Buscar usuários por nome
router.get('/search', userController.searchUsers);

// GET /users - Buscar todos os usuários
router.get('/', userController.getAllUsers);

// GET /users/:id - Buscar usuário por ID
router.get('/perfil/:id', userController.getUserById);

router.get('/meus-salvos', authMiddleware, userController.meusSalvos);

router.post('/salvar-livro', authMiddleware ,userController.salvarLivro);

module.exports = router;

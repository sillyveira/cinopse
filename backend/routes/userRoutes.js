const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users/search?nome=... - Buscar usuários por nome
router.get('/search', userController.searchUsers);

// GET /users - Buscar todos os usuários
router.get('/', userController.getAllUsers);

// GET /users/:id - Buscar usuário por ID
router.get('/:id', userController.getUserById);

module.exports = router;

const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// GET /categorias - Buscar todas as categorias
router.get('/', categoriaController.getAllCategorias);

// GET /categorias/:id - Buscar categoria por ID
router.get('/:id', categoriaController.getCategoriaById);

// POST /categorias - Criar nova categoria
router.post('/', categoriaController.createCategoria);

// PUT /categorias/:id - Atualizar categoria
router.put('/:id', categoriaController.updateCategoria);

// DELETE /categorias/:id - Deletar categoria
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;

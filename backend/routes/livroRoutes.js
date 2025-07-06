const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');

// GET /livros - Buscar todos os livros
router.get('/', livroController.getAllLivros);

// GET /livros/:id - Buscar livro por ID
router.get('/:id', livroController.getLivroById);

// GET /livros/categoria/:categoriaId - Buscar livros por categoria
router.get('/categoria/:categoriaId', livroController.getLivrosByCategoria);

// POST /livros/:id/visualizar - Incrementar visualizações
router.post('/:id/visualizar', livroController.incrementarVisualizacoes);

// POST /livros - Criar novo livro
router.post('/', livroController.createLivro);

// PUT /livros/:id - Atualizar livro
router.put('/:id', livroController.updateLivro);

// DELETE /livros/:id - Deletar livro
router.delete('/:id', livroController.deleteLivro);

module.exports = router;

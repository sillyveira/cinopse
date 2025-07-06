const Categoria = require('../models/categoria');


const categoriaController = {
  // Buscar todas as categorias
  getAllCategorias: async (req, res) => {
    try {
      const categorias = await Categoria.find().sort({ nome: 1 });
      res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Buscar categoria por ID
  getCategoriaById: async (req, res) => {
    try {
      const categoria = await Categoria.findById(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Criar nova categoria
  createCategoria: async (req, res) => {
    try {
      const { nome, emoji } = req.body;
      const categoria = new Categoria({ nome, emoji });
      await categoria.save();
      res.status(201).json(categoria);
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Categoria já existe' });
      }
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Atualizar categoria
  updateCategoria: async (req, res) => {
    try {
      const categoria = await Categoria.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.status(200).json(categoria);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Deletar categoria
  deleteCategoria: async (req, res) => {
    try {
      const categoria = await Categoria.findByIdAndDelete(req.params.id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  }
};

module.exports = categoriaController;

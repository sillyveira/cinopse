const User = require('../models/user');

const userController = {
  // Buscar usuários por nome
  searchUsers: async (req, res) => {
    try {
      const { nome } = req.query;
      
      if (!nome || nome.trim().length < 2) {
        return res.status(400).json({ error: 'Nome deve ter pelo menos 2 caracteres' });
      }
      
      const users = await User.find({
        nome: { $regex: nome, $options: 'i' }
      })
      .select('nome email foto')
      .limit(20);
      
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Buscar todos os usuários
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find()
        .select('nome email foto dataIngresso')
        .sort({ nome: 1 });
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  // Buscar usuário por ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .select('nome email foto dataIngresso ultimaVezOnline quantidadeLivrosComprados quantidadeLivrosVendidos');
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  }
};

module.exports = userController;

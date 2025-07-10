const User = require('../models/user');
const mongoose = require('mongoose');
const { calcularMedia, buscarUltimas } = require('./avaliacaoController');

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
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de usuário inválido' });
      }

      // Buscar dados básicos do usuário
      const user = await User.findById(id).select(
        'nome email foto dataIngresso ultimaVezOnline quantidadeLivrosComprados quantidadeLivrosVendidos'
      );

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const mediaAvaliacao = await calcularMedia(id);
      const ultimasAvaliacoes = await buscarUltimas(id, 3);
      res.status(200).json({
        nome: user.nome,
        email: user.email,
        foto: user.foto,
        dataIngresso: user.dataIngresso,
        ultimaVezOnline: user.ultimaVezOnline,
        quantidadeLivrosComprados: user.quantidadeLivrosComprados,
        quantidadeLivrosVendidos: user.quantidadeLivrosVendidos,
        mediaAvaliacao: mediaAvaliacao, // 2 casas decimais
        ultimasAvaliacoes
      });
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

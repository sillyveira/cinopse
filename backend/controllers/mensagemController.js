const Mensagem = require('../models/mensagem');
const Conversa = require('../models/conversa');

const mensagemController = {
  getConversationMessages: async (req, res) => {
    try {
      const { conversaId } = req.params;

      const mensagens = await Mensagem.find({ idConversa: conversaId })
        .sort({ timestamp: 1 });

      res.status(200).json(mensagens);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  },

  createMessage: async (req, res) => {
    try {
      const { idConversa, de, para, texto } = req.body;

      const mensagem = new Mensagem({
        idConversa,
        de,
        para,
        texto
      });

      await mensagem.save();

      // Atualizar última mensagem da conversa
      await Conversa.findByIdAndUpdate(idConversa, {
        ultimaMensagem: new Date()
      });

      const mensagemPopulada = await Mensagem.findById(mensagem._id)
        .populate('de', 'nome foto')
        .populate('para', 'nome foto');

      res.status(201).json(mensagemPopulada);
    } catch (error) {
      console.error('Erro ao criar mensagem:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor', 
        message: error.message 
      });
    }
  }
};

module.exports = mensagemController;

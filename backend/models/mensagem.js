const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
  idConversa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversa',
    required: true
  },
  de: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  para: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  texto: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

mensagemSchema.index({ idConversa: 1, timestamp: -1 });

module.exports = mongoose.model('Mensagem', mensagemSchema, 'mensagens');

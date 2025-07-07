// models/Conversation.js
const mongoose = require('mongoose');

const conversaSchema = new mongoose.Schema({
    usuarios: {
    type: [mongoose.Schema.Types.ObjectId], // [comprador, vendedor]
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  ultimaMensagem: {
    type: Date
  }
});

module.exports = mongoose.model('Conversa', conversaSchema, 'conversas');

const mongoose = require('mongoose');

const salvosSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Livro',
    required: true
  },
  dataSalvo: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'salvos'
});

const Salvos = mongoose.model('Salvos', salvosSchema);

module.exports = Salvos;

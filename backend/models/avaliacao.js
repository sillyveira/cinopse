const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  nomeUsuario: {
    type: String,
    required: true,
    trim: true
  },
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    default: ''
  },
  idVendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // tituloLivro: {
  //   type: String,
  //   required: true,
  //   trim: true
  // }
}, {
  timestamps: true,
  collection: 'avaliacoes'
});

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema, 'avaliacoes');

module.exports = Avaliacao;

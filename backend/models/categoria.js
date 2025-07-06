const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
  },
  emoji: {
    type: String,
    required: true,
    trim: true
  },
  quantidade: {
    type: Number,
    default: 0,
    min: 0,
  }
});


const Categoria = mongoose.model('Categoria', categorySchema, 'categorias');

module.exports = Categoria;
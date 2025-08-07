const mongoose = require('mongoose');
// livro schema
const livroSchema = new mongoose.Schema({
  reservador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  disponibilidade: {
    type: Boolean,
    default: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  autor: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  condicao: {
    type: String,
    required: true,
    enum: ['Novo', 'Seminovo', 'Usado', 'Avariado'],
    default: 'Usado - Bom estado'
  },
  preco: {
    type: Number,
    required: true,
    min: 0
  },
  fotos: [{
    type: String,
  }],
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isbn: {
    type: String,
    trim: true
  },
  editora: {
    type: String,
    trim: true,
    maxlength: 100
  },
  anoPublicacao: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  visualizacoes: {
    type: Number,
    default: 0,
    min: 0
  },
  dataPublicacao: {
    type: Date,
    default: Date.now
  },
  nPaginas: {
    type: Number,
    default: null
  },
  idioma: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: null
  }
}, {
  timestamps: true,
  collection: 'livros'
});

// Índices para melhor performance
livroSchema.index({ titulo: 'text', autor: 'text', descricao: 'text' });
livroSchema.index({ categoria: 1 });
livroSchema.index({ vendedor: 1 });
livroSchema.index({ preco: 1 });

// Middleware para popular referências automaticamente
livroSchema.pre(['find', 'findOne'], function() {
  this.populate('categoria', 'nome')
      .populate('vendedor', 'nome foto');
});

/* // Método para incrementar visualizações
livroSchema.methods.incrementarVisualizacoes = function() {
  this.visualizacoes += 1;
  return this.save();
};
 */

// Método estático para buscar por categoria
livroSchema.statics.findByCategoria = function(categoriaId) {
  return this.find({ categoria: categoriaId, disponivel: true });
};

const Livro = mongoose.model('Livro', livroSchema);

module.exports = Livro;

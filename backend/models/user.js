const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  foto: {
    type: String,
    default: null
  },
  dataIngresso: {
    type: Date,
    default: Date.now
  },
  ultimaVezOnline: {
    type: Date,
    default: Date.now
  },
  quantidadeLivrosComprados: {
    type: Number,
    default: 0,
    min: 0
  },
  quantidadeLivrosVendidos: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  collection: 'usuarios'
});

// Middleware para atualizar ultimaVezOnline automaticamente
userSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.ultimaVezOnline = new Date();
  }
  next();
});

// Método para incrementar livros comprados
userSchema.methods.incrementarLivrosComprados = function() {
  this.quantidadeLivrosComprados += 1;
  return this.save();
};

// Método para incrementar livros vendidos
userSchema.methods.incrementarLivrosVendidos = function() {
  this.quantidadeLivrosVendidos += 1;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
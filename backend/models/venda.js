const mongoose = require('mongoose')

const venda_schema = new mongoose.Schema({
    compradorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    VendedorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    LivroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true},
    dataexpira: { type: Date },
    datapagamento: { type: Date}, 
    datareserva: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['reservado', 'confirmado', 'expirado', 'cancelado'],
        default: 'reservado'
    },
    Avaliacao: {
        nota: Number,
        comentario: string,
    } 
}) 

module.exports = mongoose.model('Venda', venda_schema)
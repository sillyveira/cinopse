const mongoose = require('mongoose')

const vendaSchema = new mongoose.Schema({
    compradorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendedorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    livroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        required: true
    },
    reservaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    },
    dataConfirmacao: {
        type: Date
    },
    status: {
        type: String,
        enum: ['espera', 'Confirmada'],
        default: 'espera'
    },
    confirmacaoVendedor: {
        type: Boolean,
        default: false
    },
    avaliacao: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt
})

vendaSchema.index({ compradorId: 1 })
vendaSchema.index({ livroId: 1 })

module.exports = mongoose.model('Venda', vendaSchema)

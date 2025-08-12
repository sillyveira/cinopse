const mongoose = require('mongoose')

const reservaSchema = new mongoose.Schema ({
    reservadorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendedorid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    data_exp: {
        type: Date,
        required: true
    },
    statusreserva: {
        type: Boolean,
        default: true
    },
    livroid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        required: true
    }
}, { 
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
})

reservaSchema.index({ reservadorid: 1 });
reservaSchema.index({ livroid: 1 });

module.exports = mongoose.model('Reserva', reservaSchema)
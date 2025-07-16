const mongoose = require('mongoose')

const reserva_Schema = new mongoose.Schema ({
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
    status_r: {
        type: Boolean,
        default: true
    },
    livroid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro'
    }
})

module.exports = mongoose.model('Reserva', reserva_Schema)
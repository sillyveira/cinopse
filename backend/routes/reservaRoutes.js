const express = require('express')
const reservaController = require('../controllers/reservaController')
const auth = require('../middlewares/auth')

const router = express.Router()
// Criar Reserva
router.post('/:LivroId', auth, reservaController.criarReserva)

// Cancelar Reserva
router.post('/cancelarReserva/:reservaId/:livroId', auth, reservaController.cancelar_reserva)
module.exports = router
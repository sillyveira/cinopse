const express = require('express')
const reservaController = require('../controllers/reservaController')
const auth = require('../middlewares/auth')

const router = express.Router()
// Criar Reserva
router.post('/:LivroId', auth, reservaController.criarReserva)

// Cancelar Reserva
router.delete('/cancelarReserva/:reservaId', auth, reservaController.cancelarReserva)

//Recuperar reservas do vendedor.
router.get('/reservas',auth, reservaController.getAllUserReservas);

module.exports = router
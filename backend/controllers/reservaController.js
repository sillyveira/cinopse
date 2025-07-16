const Livro = require('../models/livro')
const Reserva = require('../models/reserva')
const mongoose = require('mongoose')

async function validar_reserva(LivroId){
    const livro_doc = await Livro.findById(LivroId)
    if(!livro_doc)throw new Error('Livro não encontrado')  //Verificando se o livro existe
    if(!livro_doc.vendedor) throw new Error('O livro não possui vendedor válido')
    if(!livro_doc.disponibilidade) throw new Error('Livro indisponível para reserva')  // Verificando se o Livro ja está reservado
    return livro_doc
}

async function criar_nova_reserva({reservadorId, vendedorId, LivroId}){
    return new Reserva({
        reservadorid: reservadorId,
        vendedorid: vendedorId,
        data_exp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // [PROVISÓRIO] a reserva será desfeita após um tempo, vou implementar mais adiante                                                 
        status_r: true,                                           // vou utilizar uma biblioteca chamada nodecron pra deletar a reserva após o tempo expirar
        livroid: LivroId,
    })
}

exports.criarReserva = async (req, res) => {
    try{
        const { LivroId } = req.params
        if(!mongoose.Types.ObjectId.isValid(LivroId)){ return res.status(400).json({ erro: 'Id do livro é inválido' })} // verificando id do livro
        if(!req.user || !req.user.id) { return res.status(400).json({ erro: 'Usuário não autenticado' })} // verificando se o usuário está autenticado
        const livro = await validar_reserva(LivroId)
        
        const vendedorId = livro.vendedor
        
        const reservadorId = req.user.id
        const nova_reserva = await criar_nova_reserva({reservadorId, vendedorId, LivroId})

        livro.disponibilidade = false
        await livro.save()
        await nova_reserva.save()
        return res.status(201).json(nova_reserva)

        }catch(erro){
            console.error(erro)
           
            if(erro.message === 'Livro não encontrado'){ return res.status(404).json({ erro: erro.message })}
            if(erro.message === 'Livro indisponível para reserva'){return res.status(400).json({ erro: erro.message })}
            if(erro.nessage === 'O livro não possui vendedor válido'){ return res.status(404).json({ erro: erro.message })}
            return res.status(500).json({ erro: '[ERRO]: ao reservar Livro'})
        }
}

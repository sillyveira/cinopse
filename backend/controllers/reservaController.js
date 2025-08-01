const Livro = require('../models/livro')
const Reserva = require('../models/reserva')
const mongoose = require('mongoose')

async function criar_nova_reserva({reservadorId, vendedorId, LivroId}){
    return new Reserva({
        reservadorid: reservadorId,
        vendedorid: vendedorId,
        data_exp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // [PROVISÓRIO] a reserva será desfeita após um tempo, vou implementar mais adiante                                                 
        statusreserva: true,                                           // vou a biblioteca chamada nodecron pra deletar a reserva após o tempo expirar
        livroid: LivroId,
    })
}

exports.criarReserva = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const { LivroId } = req.params
        if(!mongoose.Types.ObjectId.isValid(LivroId)){ return res.status(400).json({ erro: 'Id do livro é inválido' })} // verificando id do livro
        if(!req.user || !req.user.id) { return res.status(400).json({ erro: 'Usuário não autenticado' })} // verificando se o usuário está autenticado
        
        const livro = await Livro.findById(LivroId).session(session)
        
        if(!livro) throw new Error('Livro não encontrado')  // Verificando se o livro existe
        if(!livro.vendedor || !mongoose.Types.ObjectId.isValid(livro.vendedor)) throw new Error('O livro não possui vendedor válido')
        if(!livro.disponibilidade) throw new Error('Livro indisponível para reserva')  // Verificando se o Livro ja está reservado
        
        const vendedorId = livro.vendedor

        const reservadorId = req.user.id
        const nova_reserva = await criar_nova_reserva({reservadorId, vendedorId, LivroId})

        livro.disponibilidade = false // Livro indisponível
        
        await Promise.all([
            nova_reserva.save({session}),
            livro.save({session})
        ]) 

        // Finalizando sessão
        await session.commitTransaction()
        session.endSession()
        
        return res.status(201).json({
            id: nova_reserva._id,
        }) // retornando id da nova reserva

        }catch(erro){
            console.error(erro)
            await session.abortTransaction()
            session.endSession()

            if(erro.message === 'Livro não encontrado'){ return res.status(404).json({ erro: erro.message })}
            if(erro.message === 'Livro indisponível para reserva'){return res.status(400).json({ erro: erro.message })}
            if(erro.message === 'O livro não possui vendedor válido'){ return res.status(404).json({ erro: erro.message })}
            return res.status(500).json({ erro: '[ERRO]: ao reservar Livro'})
        }
}

exports.cancelar_reserva = async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    
    try{
        const { reservaId, livroId } = req.params
      
        const userId = req.user.id
        
        if(!mongoose.Types.ObjectId.isValid(reservaId)) return res.status(400).json({ erro: 'Id de reserva não encontrado'})
        if(!mongoose.Types.ObjectId.isValid(livroId)) throw new Error('Id do livro não encontrado')
        
        const [reserva, livro] = await Promise.all([
            Reserva.findById(reservaId).session(session),
            Livro.findById(livroId).session(session)
        ])

        if(!reserva){ return res.status(404).json({ erro: 'Id reserva inválido' })}
        if(!livro){ return res.status(404).json({ erro: 'Id livro inválido'})}

        const isvendedor = reserva.vendedorid.toString() === userId
        const isreservador = reserva.reservadorid.toString() === userId
        
        if(!isreservador && !isvendedor) throw  new Error ('Apenas Vendedor e Reservador podem efetuar o cancelamento')
        if(!reserva.statusreserva) throw new Error ('Reserva cancelada ou expirada')
        if(reserva.livroid.toString() !== livroId) throw new Error ('Livro não correspondente a reserva')

        livro.disponibilidade = true 
        reserva.statusreserva = false

        await Promise.all([
            livro.save({session}),
            Reserva.findByIdAndDelete(reserva._id, { session })
        ])
        
        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({ 
            message: 'Reserva cancelada com Sucesso!',
            data: {
               reservaId: reserva._id,
               livroId: livro._id,
            }
        })
    } catch(erro){
        console.error(erro)
        await session.abortTransaction()
        session.endSession()
        
        // Tratamento de mensagens específicas
        if (erro.message === 'Id do livro não encontrado') {
            return res.status(400).json({ erro: 'Id do livro não encontrado' });
        }

        if (erro.message === 'Apenas Vendedor e Reservador podem efetuar o cancelamento') {
            return res.status(403).json({ erro: erro.message });
        }

        if (erro.message === 'Reserva cancelada ou expirada') {
            return res.status(400).json({ erro: erro.message });
        }

        if (erro.message === 'Livro não correspondente a reserva') {
            return res.status(400).json({ erro: erro.message });
        }

        return res.status(500).json({ erro: 'Falha ao cancelar a reserva'})
    }
}

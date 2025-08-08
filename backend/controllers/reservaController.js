const Livro = require('../models/livro')
const Reserva = require('../models/reserva')
const venda = require('../models/venda')
const Venda = require('../models/venda')
const mongoose = require('mongoose')

// Função pra criar uma nova reserva no banco de dados
async function criarNovaReserva({reservadorId, vendedorId, LivroId}){
    return new Reserva({
        reservadorid: reservadorId,
        vendedorid: vendedorId,
        data_exp: new Date(new Date().getTime() + 60 * 60 * 1000),  // Prazo de 1 hora até a reserva Expirar
        statusreserva: true,                                          
        livroid: LivroId,
    })
}

// Função que cria uma venda com confirmação pendente no banco de dados
async function criarVendaPendente({compradorId, vendedorId, livroId, reservaId}){
    return new Venda({
        compradorId: compradorId,
        vendedorId: vendedorId,
        livroId: livroId,
        reservaId: reservaId,
        dataConfirmacao: Date.now(),
        status: 'espera',
        confirmacaoVendedor: false,
        avaliacao: 0
    })
}

// Método de criar reserva
exports.criarReserva = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const { LivroId } = req.params
        if(!mongoose.Types.ObjectId.isValid(LivroId)){ return res.status(400).json({ erro: 'Id do livro é inválido' })} // verificando id do livro
        if(!req.user || !req.user._id) { return res.status(400).json({ erro: 'Usuário não autenticado' })} // verificando se o usuário está autenticado
        
        const livro = await Livro.findById(LivroId).session(session)
        
        if(!livro) throw new Error('Livro não encontrado')  // Verificando se o livro existe
        if(!livro.vendedor || !mongoose.Types.ObjectId.isValid(livro.vendedor)) throw new Error('O livro não possui vendedor válido')
        if(!livro.disponibilidade) throw new Error('Livro indisponível para reserva')  // Verificando se o Livro ja está reservado
        
        const vendedorId = livro.vendedor
        const reservadorId = req.user.id
        const nova_reserva = await criarNovaReserva({reservadorId, vendedorId, LivroId})

        livro.disponibilidade = false // Livro indisponível
        
        await nova_reserva.save({ session });
        await livro.save({ session });

        // chamando a função de criar venda pendente (aguardando confirmação)
        const venda_pendente = await criarVendaPendente({
            compradorId: reservadorId,
            vendedorId: vendedorId, 
            livroId: LivroId, 
            reservaId: nova_reserva._id
        })

        await venda_pendente.save({session})
        
        // Finalizando sessão
        await session.commitTransaction()
        return res.status(201).json({
            id: nova_reserva._id,
        }) // retornando id da nova reserva

        }catch(erro){
            console.error(erro)
            await session.abortTransaction()

            if(erro.message === 'Livro não encontrado'){ return res.status(404).json({ erro: erro.message })}
            if(erro.message === 'Livro indisponível para reserva'){return res.status(400).json({ erro: erro.message })}
            if(erro.message === 'O livro não possui vendedor válido'){ return res.status(404).json({ erro: erro.message })}
            return res.status(500).json({ erro: '[ERRO]: ao reservar Livro'})
        } finally {
            await session.endSession()
        }

}

exports.cancelarReserva = async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try{
        const { reservaId } = req.params
      
        const userId = req.user.id
        
        // verificando se o id do livro é válido
        if(!mongoose.Types.ObjectId.isValid(reservaId)) return res.status(400).json({ erro: 'Id de reserva é inválido'})
        
        const reserva = await Reserva.findById(reservaId);

        if(!reserva){ return res.status(404).json({ erro: 'Reserva não encontrada.' })}
        
        const isvendedor = reserva.vendedorid.toString() === userId
        const isreservador = reserva.reservadorid.toString() === userId
        
        // barrando cancelas de usuários que não sejam o vendedor e o reservador 
        if(!isreservador && !isvendedor) throw  new Error ('Apenas Vendedor ou Reservador podem efetuar o cancelamento')
        if(!reserva.statusreserva) throw new Error ('Reserva cancelada ou expirada')
        const vendaReserva = await Venda.findOne({reservaId: reserva._id})
        const livro = await Livro.findById(reserva.livroid)

        if(!vendaReserva){
            return res.status(404).json({message:'Venda não encontrada.'})
        }

        if(!livro){
            return res.status(404).json({message: 'Livro não encontrado.'})
        }
        livro.disponibilidade = true
        reserva.statusreserva = false

        await livro.save({ session });
        await Reserva.findByIdAndDelete(reserva._id, { session });
        await Venda.findByIdAndDelete(vendaReserva._id, { session });


        await session.commitTransaction()
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
        
        // Tratamento de mensagens específicas
        if (erro.message === 'Apenas Vendedor e Reservador podem efetuar o cancelamento') {
            return res.status(403).json({ erro: erro.message });
        }

        if (erro.message === 'Reserva cancelada ou expirada') {
            return res.status(400).json({ erro: erro.message });
        }

        if (erro.message === 'Livro não correspondente a reserva') {
            return res.status(400).json({ erro: erro.message });
        }

        if (erro.message === 'ID da reserva não corresponde a essa venda pendente') {
            return res.status(400).json({ erro: erro.message })
        }

        return res.status(500).json({ erro: 'Falha ao cancelar a reserva'})
    } finally {
        await session.endSession() // finalizando sessao
    }
}

exports.getAllUserReservas = async(req,res) => {
    try{
        const userId = req.user._id;

        console.log(userId)

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message: 'ID do usuário precisa ser um id válido.'})
        }

        const reservas = await Reserva.find({vendedorid: userId })
        .populate("vendedorid", "nome")
        .populate("livroid", "titulo fotos preco condicao")
        .populate("reservadorid", "nome")
        ;

        if(!reservas){
            throw new Error("Erro durante fetch das reservas.")
        }

        return res.status(200).json({
            message: 'Reservas do vendedor encontradas com sucesso!',
            data: reservas
        })
    } catch(error){
        console.error(error)
        return res.status(500).json({
            message: error.message
        });
    }
}


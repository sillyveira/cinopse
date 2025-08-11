const Venda = require('../models/venda')
const mongoose = require('mongoose')
const Livro = require('../models/livro')
const Reserva = require ('../models/reserva')
const User = require('../models/user')
const Categoria = require('../models/categoria')
const Salvos = require('../models/salvos')

exports.confirmarVenda = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        // Extrai os IDs da requisição
        const { reservaId } = req.params
        const userId = req.user.id;

        if(!mongoose.Types.ObjectId.isValid(reservaId)) return res.status(400).json({ erro: 'Id de reserva não encontrado'})

        // Busca os documentos com sessão ativa
        const reserva = await Reserva.findById(reservaId)

        if(!reserva){
            return res.status(404).json({message: 'Reserva não encontrada.'})
        }
       
        const venda = await Venda.findOne({reservaId: reserva._id})

        if(!venda){
            return res.status(404).json({message: 'Venda não encontrada.'})
        }   
        
        // Verifica se quem está tentando confirmar é o vendedor
        const isVendedor = venda.vendedorId.equals(userId)
        
        if(!isVendedor) throw new Error('Apenas o vendedor pode confirmar a venda')

        // Impede confirmações duplicadas
        if (isVendedor && venda.confirmacaoVendedor) throw new Error('O vendedor já confirmou a venda anteriormente')
        
        // Marca a confirmação de acordo com o usuário
        if (isVendedor) venda.confirmacaoVendedor = true

        venda.status = 'Confirmada' // Venda confirmada
        const livro = await Livro.findById(reserva.livroid).populate("categoria", "_id nome")
        if(!livro){
            return res.status(404).json({message: 'O livro não foi encontrado.'})
        }
        const categoria = await Categoria.findById(livro.categoria._id)

        if(!categoria){
            return res.status(404).json({message: "A categoria deste livro não foi encontrada."})
        }
        // Salva as alterações na venda e na reserva
        categoria.quantidade--;

        const userV = await User.findById(reserva.vendedorid)
        const userC = await User.findById(reserva.reservadorid)

        if(!userV || !userC){
            return res.status(404).json({message: 'Usuário não encontrado.'})
        }

        userV.quantidadeLivrosVendidos++;
        userC.quantidadeLivrosComprados++;
        
        await Salvos.deleteMany({ livro: reserva.livroid }).session(session)
        await userV.save({session})
        await userC.save({session})
        await venda.save({ session })
        await reserva.save({ session})
        await categoria.save({session})

        // Exclui a reserva se a venda foi concluída
        if(venda.status === 'Confirmada'){
            await Reserva.findByIdAndDelete(reserva._id, { session }) // deleta reserva após a confirmação
            await Livro.findByIdAndDelete(reserva.livroid, { session }) // deleta o anúncio do livro (livro) do bd
        }

        // Finaliza a transação com sucesso
        await session.commitTransaction()
       
        return res.status(201).json({ 
            message: 'Venda concluída com sucesso',
            vendaId: venda._id,
            status: venda.status
        })
            

    } catch(erro){
        // Em caso de erro, desfaz a transação
        await session.abortTransaction()

        console.log(erro)

        // Erros específicos tratados com mensagens apropriadas
        if (erro.message === 'Id reserva inválido') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Id Livro inválido') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Id Venda Pendente inválido') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'ID do livro diferente do Id livro reservado') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Venda não corresponde à reserva enviada') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Comprador ou vendedor inválido') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Reserva expirada ou Cancelada') {
            return res.status(400).json({ erro: erro.message });
        }

        else if (erro.message === 'Apenas o vendedor pode confirmar a venda') {
            return res.status(403).json({ erro: erro.message });
        }
        
        else if (erro.message === 'O vendedor já confirmou a venda anteriormente') {
            return res.status(400).json({ erro: erro.message });
        }

        // Resposta genérica para outros erros
        return res.status(500).json({ erro: 'Erro ao confirmar a venda' });

    } finally {
        // Encerra a sessão do MongoDB
        await session.endSession()
    }
}

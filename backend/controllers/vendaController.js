const Venda = require('../models/venda')
const mongoose = require('mongoose')
const Livro = require('../models/livro')
const Reserva = require ('../models/reserva')
const User = require('../models/user')

exports.confirmarVenda = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        // Extrai os IDs da requisição
        const { LivroId, ReservaId, VendaPendenteId } = req.params
        const userId = req.user._id;

        // Validação dos IDs
        if(!mongoose.Types.ObjectId.isValid(LivroId)) return res.status(400).json({ erro: 'Id livro não encontrado'})
        if(!mongoose.Types.ObjectId.isValid(ReservaId)) return res.status(400).json({ erro: 'Id de reserva não encontrado'})
        if(!mongoose.Types.ObjectId.isValid(VendaPendenteId)) return res.status(400).json({ erro: 'Id de venda pendente não encontrado'})

        // Busca os documentos com sessão ativa
        const [reserva, livro, venda] = await Promise.all([
            Reserva.findById(ReservaId).session(session),
            Livro.findById(LivroId).session(session),
            Venda.findById(VendaPendenteId).session(session)
        ])
       
        // Verificações de existência
        if(!reserva) throw new Error('Id reserva inválido')
        if(!livro) throw new Error('Id Livro inválido')
        if(!venda) throw new Error('Id Venda Pendente inválido')

        // Verifica se o livro da reserva corresponde ao informado
        if(!reserva.livroid.equals(LivroId)) throw new Error ('ID do livro diferente do Id livro reservado')

        // Verifica se a venda está associada à reserva
        if (!venda.reservaId.equals(ReservaId)) throw new Error('Venda não corresponde à reserva enviada')

        // Busca os usuários (comprador e vendedor)
        const [vendedor] = await Promise.all([
            User.findById(reserva.vendedorid).session(session)
        ])

        if(!vendedor) throw new Error('Id Vendedor inválido')

        // Verifica se a reserva ainda está válida
        if(!reserva.statusreserva) throw new Error ('Reserva expirada ou Cancelada')
        
        // Verifica se quem está tentando confirmar é o vendedor
        const isVendedor = venda.vendedorId.equals(userId)
        
        if(!isVendedor) throw new Error('Apenas o vendedor pode confirmar a venda')

        // Impede confirmações duplicadas
        if (isVendedor && venda.confirmacaoVendedor) throw new Error('O vendedor já confirmou a venda anteriormente')
        
        // Marca a confirmação de acordo com o usuário
        if (isVendedor) venda.confirmacaoVendedor = true

        venda.status = 'Confirmada' // Venda confirmada

        // Salva as alterações na venda e na reserva
        await Promise.all([
            venda.save({ session }),
            reserva.save({ session})
        ])

        // Exclui a reserva se a venda foi concluída
        if(venda.status === 'Confirmada'){
            await Promise.all([
                Reserva.findByIdAndDelete(ReservaId, { session }), // deleta reserva após a confirmação
                Livro.findByIdAndDelete(LivroId, { session }) // deleta o anúncio do livro (livro) do bd
            ]) 
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

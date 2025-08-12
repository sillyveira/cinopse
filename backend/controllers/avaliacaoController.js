const mongoose = require('mongoose');
const Avaliacao = require('../models/avaliacao');
const Venda = require('../models/venda');
const User = require('../models/user');

// Função auxiliar para validar ObjectId
function validarObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// 📊 Calcular média de avaliações de um vendedor
// TODO: Após o MVP, fazer cálculo diário e armazenar no BD para não recalcular sempre.
const calcularMedia = async (idVendedor) => {
  try {
    if (!validarObjectId(idVendedor)) {
      throw new Error('ID de vendedor inválido');
    }

    const resultado = await Avaliacao.aggregate([
      { $match: { idVendedor: new mongoose.Types.ObjectId(idVendedor) } },
      {
        $group: {
          _id: null,
          media: { $avg: '$nota' }
        }
      },
      { $project: { _id: 0, media: { $ifNull: ['$media', 0] } } }
    ]);

    return resultado[0] || { media: 0 };

  } catch (error) {
    console.error('Erro ao calcular média:', error);
    return { media: 0 };
  }
};

// 🕓 Buscar últimas X avaliações de um vendedor
const buscarUltimas = async (idVendedor, limiteBusca) => {
  try {
    if (!validarObjectId(idVendedor)) {
      console.error('ID de vendedor inválido');
      return [];
    }

    const limite = parseInt(limiteBusca, 10) || 5;

    const avaliacoes = await Avaliacao.find({ idVendedor })
      .sort({ createdAt: -1 })
      .limit(limite)
      .populate('idUsuario', 'nome foto')
      .lean();

    return avaliacoes;

  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return [];
  }
};

// Criar instância de avaliação
async function createAvaliacao(nomeUsuario, idUsuario, nota, comentario, idVendedor, tituloLivro) {
  return new Avaliacao({
    nomeUsuario,
    idUsuario,
    nota,
    comentario,
    idVendedor,
    tituloLivro
  });
}

// Registrar avaliação
const registrarAvaliacao = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { nota, comentario } = req.body;
    const { VendaId } = req.params;
    const userId = req.user._id;

    if (!validarObjectId(userId)) throw new Error('Id de usuário inválido');
    if (!validarObjectId(VendaId)) throw new Error('Id de venda inválido');

    const venda = await Venda.findById(VendaId).session(session);
    if (!venda) throw new Error('Venda não encontrada');


    const comprador = await User.findById(venda.compradorId).session(session);
    if (!comprador) throw new Error('Comprador não encontrado');

    if (!comprador._id.equals(userId)) throw new Error('Usuário não autorizado a avaliar esta venda');
    if (nota < 1 || nota > 5) throw new Error('Nota fora da escala definida');
    if (venda.status === 'espera') throw new Error('Vendas em espera não podem ser avaliadas');

    const novaAvaliacao = await createAvaliacao(
      comprador.nome,
      comprador._id,
      nota,
      comentario,
      venda.vendedorId,
      venda.tituloLivro
    );

    venda.avaliacao = nota;

    await Promise.all([
      novaAvaliacao.save({ session }),
      venda.save({ session })
    ]);

    await session.commitTransaction();

    return res.status(200).json({
      message: 'Avaliação concluída com sucesso',
      avaliacao: novaAvaliacao
    });

  } catch (erro) {
    await session.abortTransaction();

    // Tratamento unificado e claro
    const erros400 = [
      'Id de usuário inválido',
      'Id de venda inválido',
      'Nota fora da escala definida',
      'Vendas em espera não podem ser avaliadas'
    ];

    if (erros400.includes(erro.message)) {
      return res.status(400).json({ erro: erro.message });
    }

    if (['Venda não encontrada', 'Comprador não encontrado'].includes(erro.message)) {
      return res.status(404).json({ erro: erro.message });
    }

    if (erro.message === 'Usuário não autorizado a avaliar esta venda') {
      return res.status(403).json({ erro: erro.message });
    }

    console.error('Erro interno:', erro);
    return res.status(500).json({ erro: 'Ocorreu um erro interno no servidor' });

  } finally {
    await session.endSession();
  }
};

module.exports = { calcularMedia, buscarUltimas, registrarAvaliacao };

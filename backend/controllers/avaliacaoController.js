const mongoose = require('mongoose');
const Avaliacao = require('../models/avaliacao');

// 📊 Calcular média de avaliações de um vendedor
// TODO: após o MVP fazer esse cálculo diariamente e armazenar ao invés de calcular toda vez que acessar o perfil/anúncio.
const calcularMedia = async (idVendedor) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(idVendedor)) {
      return res.status(400).json({ erro: 'ID de vendedor inválido' });
    }

    const resultado = await Avaliacao.aggregate([
      { $match: { idVendedor: new mongoose.Types.ObjectId(idVendedor) } },
      {
        $group: {
          _id: '$idVendedor',
          media: { $avg: '$nota' }
        }
      }
    ]);

    const dados = resultado[0] || { media: 0};
    return dados;
  } catch (error) {
    console.error('Erro ao calcular média:', error);
    return -1;
  }
};

// 🕓 Buscar últimas X avaliações de um vendedor
const buscarUltimas = async (idVendedor, limiteBusca) => {
  try {

    const limite = parseInt(limiteBusca) || 5;

    if (!mongoose.Types.ObjectId.isValid(idVendedor)) {
      console.error('Erro ao buscar avaliações: ', error);
      return [];
    }

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

module.exports = {calcularMedia, buscarUltimas}
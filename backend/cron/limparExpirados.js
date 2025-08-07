const Livro = require('../models/livro');
const Reserva = require('../models/reserva');
const Venda = require('../models/venda')
const mongoose = require('mongoose')

async function limparExpiradas() {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const expiradas = await Reserva.find({ data_exp: { $lt: new Date() } });

    console.log(`Encontradas ${expiradas.length} reservas expiradas.`);
    console.log(expiradas);

    if (expiradas.length === 0) {
      console.log('Nenhuma reserva expirada encontrada.');
      await session.endSession();
      return;
    }

    for (const reserva of expiradas) {
      // Deixa o livro disponível
      await Livro.findByIdAndUpdate(reserva.livroid, { disponibilidade: true }, { session });

      // Deleta vendas ligadas à reserva
      const result = await Venda.deleteOne({ reservaId:  new mongoose.Types.ObjectId(reserva._id) }, { session });
      console.log(`Deletado: ${result._id} venda pendente para a reserva ${reserva._id}`);

      // Deleta reserva
      await Reserva.findByIdAndDelete(reserva._id, { session });

      console.log(`Reserva ${reserva._id} expirada removida.`);
    }

    await session.commitTransaction();
    console.log('Transação concluída com sucesso.');
  } catch (erro) {
    await session.abortTransaction();
    console.error('Erro ao limpar reservas expiradas:', erro.message);
  } finally {
    await session.endSession();
  }
}



setInterval(limparExpiradas, 20 * 1000); // 20 segundos em milissegundos
limparExpiradas()

module.exports = limparExpiradas
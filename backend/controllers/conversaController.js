const { mongoose } = require("mongoose");
const Conversa = require("../models/conversa");
const User = require("../models/user");

const conversaController = {
  iniciarConversa: async (req, res) => {
    try {
      const usuarioId = req.user.id;
      const { outroUsuarioId } = req.body;

      if (!usuarioId || !outroUsuarioId) {
        return res
          .status(400)
          .json({ error: "IDs dos usuários são obrigatórios" });
      }

      // Ordenar IDs para evitar duplicatas
      const usuariosOrdenados = [usuarioId, outroUsuarioId].sort();

      // Verificar se conversa já existe
      let conversa = await Conversa.findOne({
        usuarios: { $all: usuariosOrdenados },
      });

      if (!conversa) {
        // Criar nova conversa
        conversa = new Conversa({
          usuarios: usuariosOrdenados,
        });
        await conversa.save();
      }

      // Buscar informações do outro usuário
      const usuarioConversaId = usuariosOrdenados.find((id) => id !== usuarioId);
      const usuarioConversa = await User.findById(usuarioConversaId).select(
        "_id nome email foto"
      );

      // Retornar no mesmo formato que getConversasUsuario para consistência no frontend
      const conversaFormatada = {
        _id: conversa._id,
        criadoEm: conversa.criadoEm,
        ultimaMensagem: conversa.ultimaMensagem,
        outroUsuario: {
          _id: usuarioConversa._id,
          nome: usuarioConversa.nome,
          email: usuarioConversa.email,
          foto: usuarioConversa.foto,
        },
      };

      res.status(200).json(conversaFormatada);
    } catch (error) {
      console.error("Erro ao criar/obter conversa:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  getConversasUsuario: async (req, res) => {
    try {
      const userId = req.user._id;

      const conversas = await Conversa.aggregate([
        {
          $match: {
            usuarios: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $sort: { ultimaMensagem: -1 },
        },
        {
          $addFields: {
            outroUsuarioId: {
              $first: {
                $filter: {
                  input: "$usuarios",
                  as: "id",
                  cond: { $ne: ["$$id", new mongoose.Types.ObjectId(userId)] },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "usuarios",
            localField: "outroUsuarioId",
            foreignField: "_id",
            as: "outroUsuario",
          },
        },
        {
          $unwind: "$outroUsuario",
        },
        {
          $project: {
            _id: 1,
            criadoEm: 1,
            ultimaMensagem: 1,
            outroUsuario: {
              _id: "$outroUsuario._id",
              nome: "$outroUsuario.nome",
              email: "$outroUsuario.email",
              foto: "$outroUsuario.foto",
            },
          },
        },
      ]);

      res.status(200).json(conversas);
    } catch (error) {
      console.error("Erro ao buscar conversas com aggregation:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },
};

module.exports = conversaController;

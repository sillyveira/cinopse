const Livro = require("../models/livro");
const Categoria = require("../models/categoria");

const livroController = {
  // Buscar todos os livros
  getAllLivros: async (req, res) => {
    try {
      // Extrair parâmetros de query da URL
      const { precoMin, precoMax, categoria, condicao } = req.query;
      
      // Construir objeto de filtros dinamicamente
      const filtros = {};
      
      // Filtro por preço mínimo e máximo
      if (precoMin || precoMax) {
        filtros.preco = {};
        if (precoMin) {
          const precoMinimo = parseFloat(precoMin);
          if (isNaN(precoMinimo) || precoMinimo < 0) {
            return res.status(400).json({ error: "Preço mínimo deve ser um número válido maior ou igual a 0" });
          }
          filtros.preco.$gte = precoMinimo;
        }
        if (precoMax) {
          const precoMaximo = parseFloat(precoMax);
          if (isNaN(precoMaximo) || precoMaximo < 0) {
            return res.status(400).json({ error: "Preço máximo deve ser um número válido maior ou igual a 0" });
          }
          filtros.preco.$lte = precoMaximo;
        }
      }
      
      // Filtro por categoria (ID)
      if (categoria) {
        if (!/^[0-9a-fA-F]{24}$/.test(categoria)) {
          return res.status(400).json({ error: "ID da categoria inválido" });
        }
        filtros.categoria = categoria;
      }
      
      // Filtro por condição
      if (condicao) {
        const condicoesValidas = ['Novo', 'Seminovo', 'Usado', 'Avariado'];
        if (!condicoesValidas.includes(condicao)) {
          return res.status(400).json({ 
            error: "Condição inválida", 
            condicoesValidas: condicoesValidas 
          });
        }
        filtros.condicao = condicao;
      }
      
      const livros = await Livro.find(filtros)
        .populate("categoria", "nome emoji")
        .populate("vendedor", "nome foto")
        .sort({ dataPublicacao: -1 });
      res.status(200).json(livros);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  // Buscar livro por ID
  getLivroById: async (req, res) => {
    try {
      console.log("Buscando livro com ID:", req.params.id);
      if (!req.params.id) {
        return res.status(400).json({ error: "ID do livro é obrigatório" });
      }
      if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
        return res.status(400).json({ error: "ID do livro inválido" });
      }
      const livro = await Livro.findById(req.params.id)
        .populate("categoria", "nome emoji")
        .populate("vendedor", "nome foto email");
      //livro.incrementarVisualizacoes(); // Incrementa visualizações ao buscar o livro

      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      res.status(200).json(livro);
    } catch (error) {
      console.error("Erro ao buscar livro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  // Incrementar visualizações
  // TODO: (pensando em apagar, deixarei aqui para ideias futuras, mas talvez seja melhor fatorar usando o método de busca por ID, pois já significaria que o usuário está visualizando o livro.)
/*   incrementarVisualizacoes: async (req, res) => {
    try {
      const livro = await Livro.findById(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      await livro.incrementarVisualizacoes();
      res
        .status(200)
        .json({
          message: "Visualizações incrementadas",
          visualizacoes: livro.visualizacoes,
        });
    } catch (error) {
      console.error("Erro ao incrementar visualizações:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },
 */
  // TODO: Criar novo livro (método somente para teste, pois o usuário não deve criar livros diretamente, vai ter o formulário com algumas verificações.)
  createLivro: async (req, res) => {
    try {
      const livro = new Livro(req.body);
      await livro.save();

      // Incrementar quantidade na categoria
      await Categoria.findByIdAndUpdate(livro.categoria, {
        $inc: { quantidade: 1 },
      });

      const livroPopulado = await Livro.findById(livro._id)
        .populate("categoria", "nome emoji")
        .populate("vendedor", "nome foto");

      res.status(201).json(livroPopulado);
    } catch (error) {
      console.error("Erro ao criar livro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  // Atualizar livro
  updateLivro: async (req, res) => {
    try {
      const livro = await Livro.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("categoria", "nome emoji")
        .populate("vendedor", "nome foto");

      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      res.status(200).json(livro);
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },

  // Deletar livro
  deleteLivro: async (req, res) => {
    try {
      const livro = await Livro.findByIdAndDelete(req.params.id);
      if (!livro) {
        return res.status(404).json({ error: "Livro não encontrado" });
      }

      // Decrementar quantidade na categoria
      await Categoria.findByIdAndUpdate(livro.categoria, {
        $inc: { quantidade: -1 },
      });

      res.status(200).json({ message: "Livro deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: error.message,
      });
    }
  },
};

module.exports = livroController;

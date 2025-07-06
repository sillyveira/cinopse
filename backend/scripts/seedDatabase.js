require('dotenv').config();
const mongoose = require('mongoose');
const Livro = require('../models/livro');
const User = require('../models/user');
const Categoria = require('../models/categoria');

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI);

const seedDatabase = async () => {
  try {
    // Verificar se já existem dados
    const livroCount = await Livro.countDocuments();
    const userCount = await User.countDocuments();
    const categoriaCount = await Categoria.countDocuments();

    if (livroCount > 0 && userCount > 0 && categoriaCount > 0) {
      console.log('Banco de dados já possui dados. Cancelando seed...');
      return;
    }

    // Limpar coleções existentes
    await Livro.deleteMany({});
    await User.deleteMany({});
    await Categoria.deleteMany({});

    // Criar categorias
    const categorias = await Categoria.insertMany([
      { nome: 'Comédia', emoji: '😂' },
      { nome: 'Romance', emoji: '❤️' },
      { nome: 'Ação', emoji: '💥' },
      { nome: 'Terror', emoji: '👻' },
      { nome: 'Ficção', emoji: '🚀' },
      { nome: 'Drama', emoji: '🎭' },
      { nome: 'Aventura', emoji: '🗺️' },
      { nome: 'Mistério', emoji: '🔍' },
      { nome: 'Técnico', emoji: '💻' },
      { nome: 'Acadêmico', emoji: '📚' },
    ]);

    // Criar usuários
    const usuarios = await User.insertMany([
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/640px-User_icon_2.svg.png',
        quantidadeLivrosComprados: 5,
        quantidadeLivrosVendidos: 3,
        dataIngresso: new Date('2023-01-15'),
        ultimaVezOnline: new Date()
      },
      {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        foto: 'https://s2.glbimg.com/paF5KTEVGzMU-ZcZa2mjYicNDjM=/e.glbimg.com/og/ed/f/original/2015/03/09/ada.jpg',
        quantidadeLivrosComprados: 8,
        quantidadeLivrosVendidos: 2,
        dataIngresso: new Date('2023-02-20'),
        ultimaVezOnline: new Date()
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@email.com',
        foto: 'https://super.abril.com.br/wp-content/uploads/2019/10/buda-introducao-2.jpg?crop=1&resize=1212,909',
        quantidadeLivrosComprados: 3,
        quantidadeLivrosVendidos: 1,
        dataIngresso: new Date('2023-03-10'),
        ultimaVezOnline: new Date()
      },
      {
        nome: 'Ana Lima',
        email: 'ana@email.com',
        foto: 'https://blogdaengenharia.com/wp-content/uploads/grace-hopper-blog-da-engenharia-4.jpg',
        quantidadeLivrosComprados: 12,
        quantidadeLivrosVendidos: 7,
        dataIngresso: new Date('2022-12-05'),
        ultimaVezOnline: new Date()
      },
      {
        nome: 'Carlos Souza',
        email: 'carlos@email.com',
        foto: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg',
        quantidadeLivrosComprados: 2,
        quantidadeLivrosVendidos: 1,
        dataIngresso: new Date('2023-04-18'),
        ultimaVezOnline: new Date()
      },
    ]);

    // Criar livros
    const livros = [
      {
        titulo: 'O Pequeno Príncipe',
        autor: 'Antoine de Saint-Exupéry',
        condicao: 'Novo',
        preco: 25.90,
        fotos: ['https://upload.wikimedia.org/wikipedia/pt/4/47/O-pequeno-pr%C3%ADncipe.jpg'],
        categoria: categorias.find(c => c.nome === 'Ficção')._id,
        vendedor: usuarios[0]._id,
        descricao: 'Uma obra-prima da literatura mundial que conquistou leitores de todas as idades.',
        editora: 'Agir',
        anoPublicacao: 1943,
        visualizacoes: 45
      },
      {
        titulo: '1984',
        autor: 'George Orwell',
        condicao: 'Usado',
        preco: 32.50,
        fotos: ['https://cirandacultural.fbitsstatic.net/img/p/1984-70665/257179.jpg?w=520&h=520&v=no-change&qs=ignore', 'https://photos.enjoei.com.br/1984-george-orwell-98515117/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8zNjI3OTg5OS8yOTY2MTk5NjEyMWIwZjE1NDA2MWE1ZWRhMzQ5MzI1Yi5qcGc'],
        categoria: categorias.find(c => c.nome === 'Ficção')._id,
        vendedor: usuarios[1]._id,
        descricao: 'Romance distópico que retrata uma sociedade totalitária.',
        editora: 'Companhia das Letras',
        anoPublicacao: 1949,
        visualizacoes: 67
      },
      {
        titulo: 'Dom Casmurro',
        autor: 'Machado de Assis',
        condicao: 'Usado',
        preco: 18.00,
        fotos: ['https://d5gag3xtge2og.cloudfront.net/producao/33362376/G/43021.jpg', 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-ltvwqpgfk21s3a'],
        categoria: categorias.find(c => c.nome === 'Romance')._id,
        vendedor: usuarios[2]._id,
        descricao: 'Clássico da literatura brasileira que narra a história de Bentinho e Capitu.',
        editora: 'Ática',
        anoPublicacao: 1899,
        visualizacoes: 23
      },
      {
        titulo: 'Algoritmos: Teoria e Prática',
        autor: 'Thomas H. Cormen',
        condicao: 'Seminovo',
        preco: 120.00,
        fotos: ['https://m.media-amazon.com/images/I/71QtOUBMtNL._UF1000,1000_QL80_.jpg', 'https://photos.enjoei.com.br/algoritmos-teoria-e-pratica-44611540/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy84NTY5NTY0LzQ5NzY1OTQxNzk3OGM2NjVhOTZmMzdhOGVkMGY1YzNkLmpwZw', 'https://img.olx.com.br/images/47/471535773769462.jpg'],
        categoria: categorias.find(c => c.nome === 'Técnico')._id,
        vendedor: usuarios[3]._id,
        descricao: 'Livro fundamental para estudantes de Ciência da Computação.',
        editora: 'Campus',
        anoPublicacao: 2012,
        visualizacoes: 89
      },
      {
        titulo: 'Harry Potter e a Pedra Filosofal',
        autor: 'J.K. Rowling',
        condicao: 'Usado',
        preco: 35.00,
        fotos: ['https://img.olx.com.br/images/38/389541246001617.jpg', 'https://http2.mlstatic.com/D_NQ_NP_691429-MLB84158436787_042025-O.webp'],
        categoria: categorias.find(c => c.nome === 'Aventura')._id,
        vendedor: usuarios[4]._id,
        descricao: 'Primeiro livro da famosa série do bruxinho mais conhecido do mundo.',
        editora: 'Rocco',
        anoPublicacao: 1997,
        visualizacoes: 156
      },
      {
        titulo: 'O Código Da Vinci',
        autor: 'Dan Brown',
        condicao: 'Usado',
        preco: 20.00,
        fotos: ['https://seboaugusto.com.br/thumbnail.php?pic=uplimg/img_A_1390867_467465d09a89d49361726d434e6756bc.jpg&w=750&sq=Y', 'https://img.olx.com.br/images/90/907585266363308.jpg'],
        categoria: categorias.find(c => c.nome === 'Mistério')._id,
        vendedor: usuarios[0]._id,
        descricao: 'Thriller que mistura arte, história e mistério.',
        editora: 'Arqueiro',
        anoPublicacao: 2003,
        visualizacoes: 34
      },
      {
        titulo: 'A Culpa é das Estrelas',
        autor: 'John Green',
        condicao: 'Novo',
        preco: 28.90,
        fotos: ['https://m.media-amazon.com/images/I/51M9IbBqxCL._UF1000,1000_QL80_.jpg', 'https://http2.mlstatic.com/D_NQ_NP_743391-MLB47967396962_102021-O.webp', 'https://http2.mlstatic.com/D_NQ_NP_763882-MLB46031024783_052021-O.webp'],
        categoria: categorias.find(c => c.nome === 'Romance')._id,
        vendedor: usuarios[1]._id,
        descricao: 'Romance jovem que emociona e faz refletir sobre a vida.',
        editora: 'Intrínseca',
        anoPublicacao: 2012,
        visualizacoes: 78
      },
      {
        titulo: 'Estruturas de Dados e Algoritmos',
        autor: 'Mark Allen Weiss',
        condicao: 'Usado',
        preco: 85.00,
        fotos: ['https://m.media-amazon.com/images/I/81aYcGlPpSL._UF1000,1000_QL80_.jpg'],
        categoria: categorias.find(c => c.nome === 'Técnico')._id,
        vendedor: usuarios[2]._id,
        descricao: 'Livro essencial para programadores e estudantes de computação.',
        editora: 'Pearson',
        anoPublicacao: 2013,
        visualizacoes: 45
      },
      {
        titulo: 'O Exorcista',
        autor: 'William Peter Blatty',
        condicao: 'Seminovo',
        preco: 42.00,
        fotos: ['https://m.media-amazon.com/images/I/91fQ51I4TRL._UF1000,1000_QL80_.jpg', 'https://m.media-amazon.com/images/I/91eaUpEvJ9L._UF350,350_QL80_.jpg'],
        categoria: categorias.find(c => c.nome === 'Terror')._id,
        vendedor: usuarios[3]._id,
        descricao: 'Romance de terror que inspirou o filme clássico.',
        editora: 'DarkSide',
        anoPublicacao: 1971,
        visualizacoes: 67
      },
      {
        titulo: 'As Crônicas de Nárnia',
        autor: 'C.S. Lewis',
        condicao: 'Avariado',
        preco: 55.00,
        fotos: ['https://http2.mlstatic.com/D_NQ_NP_774584-MLB83706068702_042025-O.webp', 'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lsvk24805tes05'],
        categoria: categorias.find(c => c.nome === 'Aventura')._id,
        vendedor: usuarios[4]._id,
        descricao: 'Série fantástica que encanta crianças e adultos.',
        editora: 'Martins Fontes',
        anoPublicacao: 1950,
        visualizacoes: 92
      }
    ];

    await Livro.insertMany(livros);

    // Atualizar contadores de categorias
    for (const categoria of categorias) {
      const count = await Livro.countDocuments({ categoria: categoria._id });
      await Categoria.findByIdAndUpdate(categoria._id, { quantidade: count });
    }

    console.log('✅ Banco de dados populado com sucesso!');
    console.log(`📚 ${livros.length} livros adicionados`);
    console.log(`👥 ${usuarios.length} usuários adicionados`);
    console.log(`🏷️ ${categorias.length} categorias adicionadas`);

  } catch (error) {
    console.error('❌ Erro ao popular o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Executar o script
seedDatabase();
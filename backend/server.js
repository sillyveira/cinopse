require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./models/database');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');


const categoriaRoutes = require('./routes/categoriaRoutes');
const livroRoutes = require('./routes/livroRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // para conseguir enviar cookies
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Conectar ao banco de dados
connectToDatabase();

// Rotas
app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/livros', livroRoutes);


app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

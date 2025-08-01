require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { connectToDatabase } = require('./models/database');
const socketHandler = require('./socketHandler');

const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const livroRoutes = require('./routes/livroRoutes');
const userRoutes = require('./routes/userRoutes');
const conversaRoutes = require('./routes/conversaRoutes');
const mensagemRoutes = require('./routes/mensagemRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // para conseguir enviar cookies
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
app.use('/usuarios', userRoutes);
app.use('/conversas', conversaRoutes);
app.use('/mensagens', mensagemRoutes);
app.use('/r', reservaRoutes )


// iniciar Websocket.
socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
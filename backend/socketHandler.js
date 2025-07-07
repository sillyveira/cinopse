const Mensagem = require('./models/mensagem');
const Conversa = require('./models/conversa');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Entra em uma sala (uma sala = uma conversação)
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`Usuário ${socket.id} entrou na conversa ${conversationId}`);
    });

    // Envia uma mensagem
    socket.on('sendMessage', async ({ idConversa, de, para, texto }) => {
      if (!idConversa || !de || !para || !texto) return;

      const novaMensagem = new Mensagem({
        idConversa,
        de,
        para,
        texto,
        timestamp: new Date()
      });

      await novaMensagem.save();

      // Atualiza último envio na conversa
      await Conversa.findByIdAndUpdate(idConversa, {
        ultimaMensagem: new Date()
      });

      // Envia para todos da sala
      io.to(idConversa).emit('newMessage', {
        _id: novaMensagem._id,
        de,
        para,
        texto,
        timestamp: novaMensagem.timestamp
      });
    });

    socket.on('disconnect', () => {
      console.log('Usuário desconectado:', socket.id);
    });
  });
};

module.exports = socketHandler;

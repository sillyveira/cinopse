const mongoose = require('mongoose');

let isConnected = false;
let reconnectTimeout = null;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Já conectado ao MongoDB');
    return;
  }

  try {

    await mongoose.connect(process.env.MONGO_URI);
    
    isConnected = true;
    console.log('Conectado ao MongoDB com sucesso');
    
    // Limpar timeout de reconexão se existir, pois a conexão foi bem-sucedida
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    isConnected = false;
    
    // Reconexão automática após 5 segundos
    console.log('Tentando reconectar em 5 segundos...');
    reconnectTimeout = setTimeout(connectToDatabase, 5000);
  }
};

// Monitorando a conexão para não precisar reconectar manualmente
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão do Mongoose:', err);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado do MongoDB');
  isConnected = false;
  
  // Tentar reconectar automaticamente
  if (!reconnectTimeout) {
    console.log('Tentando reconectar...');
    reconnectTimeout = setTimeout(connectToDatabase, 5000);
  }
});

module.exports = {
  connectToDatabase,
  mongoose
};
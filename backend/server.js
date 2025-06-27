require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});


const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env;

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  try {
    // Trocar código por tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenRes.data;

    // Decodificar e validar o token JWT
    const decoded = jwt.decode(id_token);

    // Aqui você pode salvar/verificar o usuário no banco
    console.log('Usuário logado:', decoded);

    // Redirecionar de volta para o frontend com algum token seu (opcional)
    return res.redirect(`http://localhost:3000/dashboard`);
  } catch (err) {
    console.error('Erro ao fazer login:', err.response?.data || err.message);
    res.status(500).send('Erro no login');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

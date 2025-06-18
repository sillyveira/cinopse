require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});


app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

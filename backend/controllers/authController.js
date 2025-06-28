const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/user');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
  JWT_EXPIRATION
} = process.env;

const googleCallback = async (req, res) => {
  const code = req.query.code;
  
  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenRes.data;
    const decoded = jwt.decode(id_token);

    // Verificar se o usuário já existe
    let user = await User.findOne({ email: decoded.email });

    if (!user) {
      // Criar novo usuário
      user = new User({
        nome: decoded.name,
        email: decoded.email,
        foto: decoded.picture
      });
      await user.save();
      console.log('Novo usuário criado:', user.nome);
    } else {
      // Atualizar última vez online
      user.ultimaVezOnline = new Date();
      await user.save();
      console.log('Usuário logado:', user.nome);
    }

    // Gerar JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: `${JWT_EXPIRATION*60*60*1000}h` || '1h' }
    );

    // Definir cookie com o token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRATION * 60 * 60 * 1000 // 24 horas
    });

    return res.redirect(`http://localhost:5173/`);
    
  } catch (err) {
    console.error('Erro ao fazer login:', err.response?.data || err.message);
    res.status(500).json({ error: 'Erro no login' });
  }
};

const verifyAuth = async (req, res) => {
  try {
    // req.user já foi definido pelo middleware
    const user = {
      id: req.user._id,
      nome: req.user.nome,
      email: req.user.email,
      foto: req.user.foto
    };
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro na verificação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro no logout' });
  }
};

module.exports = {
  googleCallback,
  verifyAuth,
  logout
};
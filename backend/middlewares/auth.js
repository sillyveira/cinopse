const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      // Limpar cookie se usuário não existe
      res.clearCookie('authToken');
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    
    // Limpar cookie se token inválido
    res.clearCookie('authToken');
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
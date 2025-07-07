import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';

const BotaoMensagem = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    navigate('/chat');
  };

  // Não renderizar se o usuário não estiver logado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed cursor-pointer bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
      aria-label="Abrir chat"
    >
      <MessageCircle size={24} className="group-hover:scale-110 transition-transform duration-200" />
    </button>
  );
};

export default BotaoMensagem;

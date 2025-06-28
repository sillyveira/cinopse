import React from 'react';
import logo from '../assets/cinopse.png';
import GoogleButton from './GoogleButton';
import { useAuth } from '../context/Auth';

function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <div className="w-25">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <div>Carregando...</div>
      </header>
    );
  }

  return (
    <header className="flex items-center p-4 bg-white shadow-sm">
      <div className="flex items-center w-1/3">
        <div className="w-25">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <nav className="flex space-x-8 w-1/3 justify-center">
        <a href="#" className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
          Home
        </a>
        <a href="#" className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
          Descobrir
        </a>
      </nav>

      <div className="flex items-center space-x-4 w-1/3 justify-end">
        {isAuthenticated ? (
          <>
            <img src={user.foto} alt={user.nome} className="w-8 h-8 rounded-full" />
            <span>{user.nome.split(' ')[0]}</span>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sair
            </button>
          </>
        ) : (
          <GoogleButton/>
        )}
      </div>
    </header>
  );
}

export default Header;

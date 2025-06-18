import React from 'react';
import logo from '../assets/cinopse.png';

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex items-center">
        <div className="w-25">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <nav className="flex space-x-8">
        <a href="#" className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
          Home
        </a>
        <a href="#" className="text-blue-500 font-medium hover:text-blue-600 transition-colors">
          Descobrir
        </a>
      </nav>

      <button className="cursor-pointer px-6 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors">
        Entrar
      </button>
    </header>
  );
}

export default Header;

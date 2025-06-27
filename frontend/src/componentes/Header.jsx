import React from 'react';
import logo from '../assets/cinopse.png';
import GoogleButton from './GoogleButton';

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

      <GoogleButton/>
    </header>
  );
}

export default Header;

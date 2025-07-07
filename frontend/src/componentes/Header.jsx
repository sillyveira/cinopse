import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/cinopse.png';
import GoogleButton from './GoogleButton';
import { useAuth } from '../context/Auth';
import LoginTeste from './LoginTeste';

function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        
        <div className="flex items-center">
          <div className="w-20 md:w-25">
            <img src={logo} alt="Logo" />
          </div>
        </div>
         {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-black font-bold hover:text-red-600 transition-colors">
            Home
          </a>
          <a href="/descobrir" className="text-black font-bold hover:text-red-600 transition-colors">
            Descobrir
          </a>
        </nav>
        <div className="text-sm md:text-base">Carregando...</div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-20 md:w-25">
              <img src={logo} alt="Logo" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-black font-bold hover:text-red-600 transition-colors">
              Home
            </a>
            <a href="/descobrir" className="text-black font-bold hover:text-red-600 transition-colors">
              Descobrir
            </a>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <img src={user.foto} alt={user.nome} className="w-8 h-8 rounded-full" />
                <span className="text-sm lg:text-base">{user.nome.split(' ')[0]}</span>
                <button 
                  onClick={logout}
                  className="px-3 py-1 lg:px-4 lg:py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm lg:text-base"
                >
                  Sair
                </button>
              </>
            ) : (
              <GoogleButton/>
            )}
            <LoginTeste />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={` md:hidden bg-white shadow-lg transition-all duration-300 ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <nav className="flex flex-col space-y-4 p-4 border-t">
          <a href="/" className="text-blue-500 font-medium hover:text-blue-600 transition-colors py-2">
            Home
          </a>
          <a href="/descobrir" className="text-blue-500 font-medium hover:text-blue-600 transition-colors py-2">
            Descobrir
          </a>
          
          {/* Mobile Auth Section */}
          <div className="pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={user.foto} alt={user.nome} className="w-8 h-8 rounded-full" />
                  <span>{user.nome.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sair
                </button>
              </div>
            ) : (
              <GoogleButton/>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

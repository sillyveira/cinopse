import React, { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/cinopse.png';
import GoogleButton from './GoogleButton';
import { useAuth } from '../context/Auth';
import LoginTeste from './LoginTeste';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const contextMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close context menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenuOpen(false);
      }
    }

    if (contextMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenuOpen]);

  if (loading) {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <div className="w-20 md:w-25">
            <img
            onClick={() => navigate('/')}
            src={logo} alt="Logo" />
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
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="cursor-pointer w-20 md:w-25">
              <img
              onClick={() => navigate('/')}
              src={logo} alt="Logo" />
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
              <div className="relative" ref={contextMenuRef}>
                <button
                  onClick={() => setContextMenuOpen(!contextMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                >
                  <img src={user.foto} alt={user.nome} className="w-8 h-8 rounded-full" />
                  <span className="text-sm lg:text-base">{user.nome.split(' ')[0]}</span>
                </button>

                {/* Context Menu */}
                {contextMenuOpen && (
                  <>
                    {/* Fundo invisível para fechar o menu */}
                    <div
                    onClick={() => setContextMenuOpen(false)}
                    className="fixed inset-0  bg-opacity-20 z-40" />
                    
                    {/* Context Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-2">
                        <a
                          href={`/perfil/${user.id}`}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setContextMenuOpen(false)}
                        >
                          <span>Meu perfil</span>
                        </a>
                        <button
                          onClick={() => {
                            logout();
                            setContextMenuOpen(false);
                          }}
                          className="cursor-pointer w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        >
                          <span>Sair</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <GoogleButton/>
            )}
            <LoginTeste />
          </div>

          {/* Mobile Botão Hamburguer Menu */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <nav className="flex flex-col p-4">
          <a 
            href="/" 
            className="text-black font-bold hover:text-red-600 transition-colors py-3 px-2 border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href="/descobrir" 
            className="text-black font-bold hover:text-red-600 transition-colors py-3 px-2 border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            Descobrir
          </a>
          
          {/* Autenticação Mobile */}
          <div className="pt-4 mt-2">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 py-2 px-2">
                  <img src={user.foto} alt={user.nome} className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{user.nome.split(' ')[0]}</span>
                    <a 
                      href={`/perfil/${user.id}`}
                      className="text-sm text-red-600 hover:text-red-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ver perfil
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="py-2">
                <GoogleButton/>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

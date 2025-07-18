import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// COMPONENTES
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import BotaoMensagem from './componentes/BotaoMensagem'

// PROVIDERS
import { AuthProvider } from './context/Auth'
import { DataProvider } from './context/DataContext'

// PÁGINAS
import Chat from './pages/Chat'
import Home from './pages/Home'
import Descobrir from './pages/Descobrir'
import Perfil from './pages/Perfil'
import PaginaLivro from './pages/PaginaLivro'
import MeusSalvos from './pages/MeusSalvos'

function AppContent() {
  const location = useLocation();
  const chatAberto = location.pathname === '/chat'; // Verifica se está no chat, se sim, não exibe o botão de mensagem

  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex-1 overflow-auto'> {/* permitir rolagem */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/descobrir" element={<Descobrir />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil/:id_usuario" element={<Perfil />} />
          <Route path="/perfil/meus-salvos" element={<MeusSalvos />} />
          <Route path="/livros/:idLivro" element={<PaginaLivro />} />
        </Routes>
      </div>
      {!chatAberto && <BotaoMensagem />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
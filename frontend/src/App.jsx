import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'

// COMPONENTES
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import BotaoMensagem from './componentes/BotaoMensagem'

// PROVIDERS
import { AuthProvider, useAuth } from './context/Auth'
import { DataProvider } from './context/DataContext'

// PÁGINAS
import Chat from './pages/Chat'
import Home from './pages/Home'
import Descobrir from './pages/Descobrir'
import Perfil from './pages/Perfil'
import PaginaLivro from './pages/PaginaLivro'

import Pesquisar from "./pages/Pesquisar"
import NovoLivro from './pages/NovoLivro'
import MeusAnuncios from './pages/MeusAnuncios'

import MeusSalvos from './pages/MeusSalvos'

// Component to protect private routes
function RotaPrivada({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Carregando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const location = useLocation();
  const chatAberto = location.pathname === '/chat'; // Verifica se está no chat, se sim, não exibe o botão de mensagem
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div className='h-screen flex flex-col'>
      <Header />
      <div className='flex-1 overflow-auto'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/descobrir" element={<Descobrir/>} />
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/perfil/:id_usuario" element={<Perfil/>}></Route>
          <Route path="/livros/:idLivro" element={<PaginaLivro/>}></Route>
          <Route path='/vendedor/cadastrar-livro' element={<NovoLivro/>}></Route>
          <Route path="/descobrir" element={<Descobrir />} />
          <Route path="/chat" element={
            <RotaPrivada>
              <Chat />
            </RotaPrivada>
          } />
          <Route path="/perfil/:id_usuario" element={<Perfil />} />
          <Route path="/perfil/meus-salvos" element={
            <RotaPrivada>
              <MeusSalvos />
            </RotaPrivada>
          } />
          <Route path="/livros/:idLivro" element={<PaginaLivro />} />
          <Route path="/pesquisar" element={<Pesquisar />} />
          <Route path='/vendedor/meus-anuncios' element={
            <RotaPrivada>
              <MeusAnuncios/>
            </RotaPrivada>
          }/>
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
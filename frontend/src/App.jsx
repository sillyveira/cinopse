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
<<<<<<< Updated upstream
import MeusSalvos from './pages/MeusSalvos'

function AppContent() {
  const location = useLocation();
  const chatAberto = location.pathname === '/chat'; // Verifica se está no chat, se sim, não exibe o botão de mensagem
=======
import NovoLivro from './pages/NovoLivro'
import MeusAnuncios from './pages/MeusAnuncios'
import Pesquisar from "./pages/Pesquisar"
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
  const chatAberto = location.pathname === '/chat';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex-1 overflow-auto'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/descobrir" element={<Descobrir />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/perfil/:id_usuario" element={<Perfil />} />
          <Route path="/perfil/meus-salvos" element={<MeusSalvos />} />
          <Route path="/livros/:idLivro" element={<PaginaLivro />} />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
          <Route path="/livros" element={<Pesquisar />} />
          <Route path="/vendedor/cadastrar-livro" element={<NovoLivro />} />
          <Route path="/vendedor/meus-anuncios" element={
            <RotaPrivada>
              <MeusAnuncios />
            </RotaPrivada>
          }/>
>>>>>>> Stashed changes
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
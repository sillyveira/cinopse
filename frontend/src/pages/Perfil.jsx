import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Star, StarHalf } from "lucide-react";
import { useAuth } from '../context/Auth';
import axios from "axios";

// Página integrada com o backend para exibir o perfil de um usuário específico
// http://urldofrontend.com/usuarios/:id_usuario
// exemplo: http://localhost:5173/perfil/686fb86f96e939526ac63330

function Perfil() {
  // Extrai o parâmetro id_usuario da URL
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Estados para armazenar dados do usuário e controle de carregamento
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservas, setReservas] = useState([]);


  const openModal = () => {
    setShowModal(true);
    fetchReservas();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const fetchReservas = async () => {
    try {
      const response = await axios.get("http://localhost:3000/r/minhas-reservas", {
        withCredentials: true
      });
      setReservas(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    }
  };

  // Hook para buscar dados do id do usuário que está na url quando entra na página 
  useEffect(() => {
    async function buscarDados() {
      try {
        // Faz requisição para o backend
        const resposta = await fetch(`http://localhost:3000/usuarios/perfil/${id_usuario}`);
        const dados = await resposta.json();
        setUsuario(dados);
      } catch (erro) {
        console.error('Erro ao buscar perfil:', erro);
      } finally {
        // Finaliza o estado de carregamento independente do resultado
        setCarregando(false);
      }
    }

    buscarDados();
  }, [id_usuario]);

  // Função para redirecionar para a página de "Meus Salvos"
  const irParaMeusSalvos = () => {
    navigate('/perfil/meus-salvos');
  };

  // Função para formatar as datas
  const formatarData = (dataStr) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(dataStr));
  };

  // Função para renderizar estrelas de avaliação
  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <div className="flex items-center text-yellow-400">
        {Array(full)
          .fill()
          .map((_, i) => <Star key={i} className="w-4 h-4" />)}
        {half && <StarHalf className="w-4 h-4" />}
      </div>
    );
  };

  if (carregando) {
    return <div className="text-center mt-10 text-gray-500">Carregando...</div>;
  }

  if (!usuario) {
    return <div className="text-center mt-10 text-red-500">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-gray-50 min-h-screen">
      {/* Cabeçalho do perfil */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white p-6 rounded-lg shadow-md mb-8">
        <img
          src={usuario.foto || "/perfilimg.jpg"}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-red-900"
          alt="Perfil"
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{usuario.nome}</h1>
          <p className="text-gray-600 mb-3">{usuario.email}</p>
          <div className="flex items-center gap-3">
            {renderStars(usuario.mediaAvaliacao?.media)}
            <span className="text-gray-700">
              {usuario.mediaAvaliacao?.media?.toFixed(2) || '0.00'} ({usuario.ultimasAvaliacoes?.length || 0} avaliações)
            </span>
          </div>
        </div>
        <div className="w-full md:w-auto">

          {user && user.id === id_usuario ? (
            <div className='flex gap-2'>
              <button
                onClick={openModal}
                className="w-full md:w-auto px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 font-medium"
              >
                Minha reserva
              </button>
              <button
                onClick={irParaMeusSalvos}
                className="w-full md:w-auto px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition-colors duration-300 font-medium"
              >
                Meus Salvos
              </button>
            </div>
          ) : (
            <></>
          )}

          {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Minhas Reservas</h2>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            {reservas.length > 0 ? (
              <ul className="space-y-4">
                {reservas.map((reserva) => (
                  <li
                    key={reserva._id}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <p>
                      <strong>Livro:</strong> {reserva.livroid?.titulo || "Título não disponível"}
                    </p>
                    <p>
                      <strong>Data de Expiração:</strong>{" "}
                      {new Date(reserva.data_exp).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {reserva.statusreserva ? "Ativa" : "Expirada"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Nenhuma reserva encontrada.</p>
            )}
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Estatísticas do usuário */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white text-center p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Livros Comprados</h3>
          <p className="text-2xl font-bold text-gray-800">{usuario.quantidadeLivrosComprados || 0}</p>
        </div>
        <div className="bg-white text-center p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Livros Vendidos</h3>
          <p className="text-2xl font-bold text-gray-800">{usuario.quantidadeLivrosVendidos || 0}</p>
        </div>
        <div className="bg-white text-center p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Membro desde</h3>
          <p className="text-2xl font-bold text-gray-800">{new Date(usuario.dataIngresso).getFullYear()}</p>
        </div>
      </div>

      {/* Seção de Avaliações - só exibe se existirem avaliações */}
      {usuario.ultimasAvaliacoes && usuario.ultimasAvaliacoes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Últimas Avaliações ({usuario.ultimasAvaliacoes.length})</h2>
          <div className="space-y-4">
            {usuario.ultimasAvaliacoes.map((avaliacao) => (
              <div key={avaliacao._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="font-semibold text-gray-800">{avaliacao.nomeUsuario}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(avaliacao.nota)}
                      <span className="text-gray-700 font-medium">{avaliacao.nota}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Livro: {avaliacao.nomeLivro}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{formatarData(avaliacao.createdAt)}</span>
                </div>
                {avaliacao.comentario && (
                  <p className="text-gray-700 text-sm leading-relaxed">"{avaliacao.comentario}"</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Informações adicionais */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Informações do Perfil</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Data de ingresso:</span> {formatarData(usuario.dataIngresso)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Última vez online:</span> {formatarData(usuario.ultimaVezOnline)}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Perfil;

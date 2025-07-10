import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Página integrada com o backend para exibir o perfil de um usuário específico
// http://urldofrontend.com/usuarios/:id_usuario
// exemplo: http://localhost:5173/perfil/686fb86f96e939526ac63330

// TODO (Adrielly): Estilizar de acordo com o prototipo e adicionar melhorias de UX.

function Perfil() {
  // Extrai o parâmetro id_usuario da URL
  const { id_usuario } = useParams();
  
  // Estados para armazenar dados do usuário e controle de carregamento
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Hook para buscar dados do id do usuário que está na url quando entra na página 
  useEffect(() => {
    async function buscarDados() {
      try {
        // Faz requisição para o backend
        const resposta = await fetch(`http://localhost:3000/usuarios/${id_usuario}`);        // TODO (trabalho para wesley): Refatorar essa parte para services/api.js
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

  // Função para formatar as datas
  const formatarData = (dataStr) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(dataStr));
  };

  if (carregando) {
    return <div className="text-center mt-10 text-gray-500">Carregando...</div>;
  }

  if (!usuario) {
    return <div className="text-center mt-10 text-red-500">Usuário não encontrado.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md overflow-y-auto">
      <div className="flex items-center space-x-6">
        <img
          src={usuario.foto}
          alt={usuario.nome}
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">{usuario.nome}</h1>
          <p className="text-gray-600">{usuario.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <p><span className="font-semibold">Data de ingresso:</span> {formatarData(usuario.dataIngresso)}</p>
        <p><span className="font-semibold">Última vez online:</span> {formatarData(usuario.ultimaVezOnline)}</p>
        <p><span className="font-semibold">Livros comprados:</span> {usuario.quantidadeLivrosComprados}</p>
        <p><span className="font-semibold">Livros vendidos:</span> {usuario.quantidadeLivrosVendidos}</p>
        <p><span className="font-semibold">Média de avaliação:</span> {usuario.mediaAvaliacao?.media?.toFixed(2) || '0.00'}</p>
      </div>

      {/* Seção de Avaliações - só exibe se existirem avaliações */}
      {usuario.ultimasAvaliacoes && usuario.ultimasAvaliacoes.length > 0 && (
        <div className="mt-8">
          {/* Título da seção com contador de avaliações */}
          <h2 className="text-xl font-bold mb-4">Últimas Avaliações ({usuario.ultimasAvaliacoes.length})</h2>
          <div className="space-y-3">
            {/* Mapeia cada avaliação para criar um card */}
            {usuario.ultimasAvaliacoes.map((avaliacao) => (
              <div key={avaliacao._id} className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-start mb-2">
                  {/* Informações do avaliador e livro */}
                  <div>
                    <p className="font-medium">{avaliacao.nomeUsuario}</p>
                    <p className="text-sm text-gray-600">Livro: {avaliacao.nomeLivro}</p>
                  </div>

                  {/* Nota e data da avaliação */}
                  <div className="text-right">
                    <p className="font-bold">Nota: {avaliacao.nota}/5</p>
                    <p className="text-xs text-gray-500">{formatarData(avaliacao.createdAt)}</p>
                  </div>
                  
                </div>
                {/* Comentário da avaliação (opcional) */}
                {avaliacao.comentario && (
                  <p className="text-gray-700 text-sm">"{avaliacao.comentario}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PaginaLivro() {
  const { idLivro } = useParams();
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const salvarLivro = async (livroId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/usuarios/salvar-livro`,
        {
          method: "POST",
          credentials: "include", // Inclui cookies para autenticação
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ livroId }), // Exemplo de corpo da requisição
        }
      );
      if (!response.ok) {
        throw new Error("Não foi possível salvar o livro.");
      }
      const data = await response.json();
      alert(data.message); // Exibe a mensagem do salvamento
    } catch (err) {
      setErro(err.message); // Lidar com o erro
    }
  };

  useEffect(() => {
    const fetchLivro = async () => {
      try {
        const response = await fetch(`http://localhost:3000/livros/${idLivro}`);
        if (!response.ok) {
          throw new Error("Livro não encontrado");
        }
        const data = await response.json();
        setLivro(data);
      } catch (err) {
        setErro(err.message);
      }
    };

    fetchLivro();
  }, [idLivro]);

  const iniciarConversaVendedor = async (vendedorId) => {
    // Cria uma conversa com o vendedor
    try {
      const response = await fetch(`http://localhost:3000/conversas`, {
        method: "POST",
        credentials: "include", // Inclui cookies para autenticação
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ outroUsuarioId: vendedorId }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível iniciar a conversa");
      }

      const data = await response.json();

      // Redireciona para a página de conversas na conversa iniciada
      navigate(`/chat`, {
        state: {
          conversa: data, autoSelect: true 
        }
      });

    } catch (err) {
      setErro(err.message);
    }
  };

  if (erro) {
    return <div className="p-4 text-red-600">Erro: {erro}</div>;
  }

  if (!livro) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{livro.titulo}</h1>
      {/* Verificar se o array de fotos existe e tem pelo menos uma imagem */}
      {livro.fotos && livro.fotos.length > 0 ? (
        <img src={livro.fotos[0]} alt={livro.titulo} className="w-40 h-auto" />
      ) : (
        <div className="w-40 h-auto bg-gray-200 flex items-center justify-center text-gray-500">
          Sem imagem disponível
        </div>
      )}

      {/* Galeria de fotos */}
      <div className="flex gap-2 flex-wrap">
        {livro.fotos && livro.fotos.length > 0 ? (
          livro.fotos.map((foto, index) => (
            <div
              key={index}
              className="w-16 h-16 overflow-hidden rounded border"
            >
              <img
                src={foto}
                alt={`${livro.titulo} - foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">Sem fotos adicionais</p>
        )}
      </div>

      <div>
        <p>
          <span className="font-medium">Autor:</span> {livro.autor}
        </p>
        <p>
          <span className="font-medium">Editora:</span> {livro.editora}
        </p>
        <p>
          <span className="font-medium">Ano de Publicação:</span>{" "}
          {livro.anoPublicacao}
        </p>
        <p>
          <span className="font-medium">Categoria:</span> {livro.categoria.nome}
        </p>
        <p>
          <span className="font-medium">Condição:</span> {livro.condicao}
        </p>
        <p>
          <span className="font-medium">Preço:</span> R${" "}
          {livro.preco.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Visualizações:</span>{" "}
          {livro.visualizacoes}
        </p>
      </div>

      <div>
        <p className="font-medium">Descrição:</p>
        <p>{livro.descricao}</p>
      </div>

      <div className="flex items-center gap-2">
        <img
          src={livro.vendedor.foto}
          alt={livro.vendedor.nome}
          className="w-10 h-10 rounded-full"
        />
        <p>
          <span className="font-medium">Vendedor:</span> {livro.vendedor.nome}
        </p>
      </div>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={async () => {
          await salvarLivro(livro._id);
        }}
      >
        Salvar
      </button>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={async () => {
          await iniciarConversaVendedor(livro.vendedor._id);
        }}
      >
        Conversar com o vendedor
      </button>
    </div>
  );
}

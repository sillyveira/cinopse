import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PaginaLivro() {
  const { idLivro } = useParams();
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const fetchLivro = async () => {
      try {
        const response = await fetch(`http://localhost:3000/livros/${idLivro}`);
        if (!response.ok) {
          throw new Error('Livro não encontrado');
        }
        const data = await response.json();
        setLivro(data);
      } catch (err) {
        setErro(err.message);
      }
    };

    fetchLivro();
  }, [idLivro]);

  if (erro) {
    return <div className="p-4 text-red-600">Erro: {erro}</div>;
  }

  if (!livro) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{livro.titulo}</h1>
      <img src={livro.fotos[0]} alt={livro.titulo} className="w-40 h-auto" />
      
      {/* Galeria de fotos */}
      <div className="flex gap-2 flex-wrap">
        {livro.fotos.map((foto, index) => (
          <div key={index} className="w-16 h-16 overflow-hidden rounded border">
            <img src={foto} alt={`${livro.titulo} - foto ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      
      <div>
        <p><span className="font-medium">Autor:</span> {livro.autor}</p>
        <p><span className="font-medium">Editora:</span> {livro.editora}</p>
        <p><span className="font-medium">Ano de Publicação:</span> {livro.anoPublicacao}</p>
        <p><span className="font-medium">Categoria:</span> {livro.categoria.nome}</p>
        <p><span className="font-medium">Condição:</span> {livro.condicao}</p>
        <p><span className="font-medium">Preço:</span> R$ {livro.preco.toFixed(2)}</p>
        <p><span className="font-medium">Visualizações:</span> {livro.visualizacoes}</p>
      </div>

      <div>
        <p className="font-medium">Descrição:</p>
        <p>{livro.descricao}</p>
      </div>

      <div className="flex items-center gap-2">
        <img src={livro.vendedor.foto} alt={livro.vendedor.nome} className="w-10 h-10 rounded-full" />
        <p><span className="font-medium">Vendedor:</span> {livro.vendedor.nome}</p>
      </div>
    </div>
  );
}

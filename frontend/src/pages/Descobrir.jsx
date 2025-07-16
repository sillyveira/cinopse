import React from 'react';
import Carrosel from '../componentes/descobrir/Carrosel';
import CarroselCategoria from '../componentes/descobrir/CarroselCategoria';
import { useData } from '../context/DataContext';

const Descobrir = () => {
  const { 
    categorias, 
    getLivrosRecentes, 
    getLivrosPopulares, 
    getLivrosPorCategoria,
    loading, 
    error 
  } = useData();

  const formatCategoryData = (categoria) => ({
    id: categoria._id,
    name: categoria.nome,
    emoji: categoria.emoji,
    count: categoria.quantidade
  });

  if (loading) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 p-3 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50 p-3 md:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erro ao carregar dados: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const livrosRecentes = getLivrosRecentes()
  const livrosPopulares = getLivrosPopulares();
  const categoriasFormatadas = categorias.map(formatCategoryData);

  // Pegar livros de ficção para a última seção
  const categoriaFiccao = categorias.find(cat => cat.nome.toLowerCase().includes('ficção'));
  const livrosFiccao = categoriaFiccao ? 
    getLivrosPorCategoria(categoriaFiccao._id) : 
    livrosPopulares.slice(0, 5);

  return (
    <>
      <div className="h-full overflow-y-auto bg-gray-50 p-3 md:p-6">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">

          <CarroselCategoria categories={categoriasFormatadas} title="Categorias" />
          
          <Carrosel books={livrosPopulares} title="Livros Populares" />
          
          <Carrosel books={livrosRecentes} title="Adicionados Recentemente" />
          
          <Carrosel books={livrosFiccao} title="Ficção e Literatura" />
        </div>
      </div>
    </>
  );
};

export default Descobrir;

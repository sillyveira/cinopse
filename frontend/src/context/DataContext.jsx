import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategorias, fetchLivros } from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [categoriasData, livrosData] = await Promise.all([
        fetchCategorias(),
        fetchLivros()
      ]);
      
      // Ordenar categorias por quantidade de livros (maior para menor)
      const categoriasOrdenadas = categoriasData.sort((a, b) => b.quantidade - a.quantidade);
      
      setCategorias(categoriasOrdenadas);
      setLivros(livrosData);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const getLivrosRecentes = () => {
    return [...livros]
      .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
      .slice(0, 10);
  };

  const getLivrosPopulares = () => {
    return [...livros]
      .sort((a, b) => b.visualizacoes - a.visualizacoes)
      .slice(0, 10);
  };

  const getLivrosPorCategoria = (categoriaId) => {
    return livros.filter(livro => livro.categoria._id === categoriaId);
  };

  const value = {
    categorias,
    livros,
    loading,
    error,
    getLivrosRecentes,
    getLivrosPopulares,
    getLivrosPorCategoria,
    recarregarDados: carregarDados
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

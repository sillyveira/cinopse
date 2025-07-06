const API_BASE_URL = 'http://localhost:3000';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchCategorias = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    return handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

export const fetchLivros = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/livros`);
    return handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw error;
  }
};

export const fetchLivrosPorCategoria = async (categoriaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/livros/categoria/${categoriaId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Erro ao buscar livros por categoria:', error);
    throw error;
  }
};

export const incrementarVisualizacoes = async (livroId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/livros/${livroId}/visualizar`, {
      method: 'POST',
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
    throw error;
  }
};

import React, { useState, useEffect } from 'react'
import CardLivro from '../componentes/descobrir/CardLivro'

export default function MeusAnuncios() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/usuarios/meus-anuncios', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar anúncios')
        }

        const data = await response.json()
        console.log(data)
        setBookmarks(data)
        console.log('Meus anúncios:', bookmarks)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnuncios();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-600">Carregando seus anúncios...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-red-600">Erro: {error}</div>
      </div>
    )

  }

  const apagarLivro = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/livros/${id}`, {
        credentials: 'include',
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar anúncio')
      }

      const data = await response.json()
      
      // Recarregar a página após deletar
      window.location.reload()
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar anúncio')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Anúncios</h1>

      {bookmarks.length === 0 ? (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-gray-600">Nenhum anúncio ainda.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {bookmarks.map((book) => (
            <div key={book._id} className="flex flex-col">
              <CardLivro book={book} />
              <button 
                onClick={() => apagarLivro(book._id)}
                className="mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors duration-200"
              >
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

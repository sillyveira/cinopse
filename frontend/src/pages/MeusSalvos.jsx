import React, { useState, useEffect } from 'react'
import CardLivro from '../componentes/descobrir/CardLivro'

export default function MeusSalvos() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/usuarios/meus-salvos', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Erro ao buscar salvos')
        }
        
        const data = await response.json()
        setBookmarks(data)
        console.log(data)
        console.log('Meus Salvos:', bookmarks)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-600">Carregando seus livros salvos...</div>
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Salvos</h1>
      
      {bookmarks.length === 0 ? (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-gray-600">Nenhum livro salvo ainda.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {bookmarks.map((book) => (
            <CardLivro key={book._id} book={book.livro} />
          ))}
        </div>
      )}
    </div>
  )
}

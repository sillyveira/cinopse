import React, { useState, useEffect } from 'react'
import CardReserva from '../componentes/CardReserva'

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/r/reservas', {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar reservas')
        }

        const data = await response.json()
        console.log(data.data)
        setReservas(data.data)
        console.log('Minhas reservas:', reservas)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReservas();
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-600">Carregando seus anúncios reservados...</div>
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

  const cancelarReserva = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/r/cancelarReserva/${id}`, {
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

  const confirmarVenda = async(id) => {
    try{
      const response = await fetch(`http://localhost:3000/cv/${id}`, {
        credentials: 'include',
        method: 'PUT'
      })

      if(!response.ok){
        throw new Error("Erro ao confirmar venda.")
      }
      window.location.reload();
    }catch(error){
      console.error(error.message)
      alert("Erro ao confirmar venda.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Anúncios Reservados</h1>

      {reservas.length === 0 ? (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-gray-600">Ninguém reservou seu(s) anúncio(s) ainda.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {reservas.map((resv) => (
            <div key={resv._id} className="flex flex-col">
              <CardReserva reserva={resv} />
              <button
                onClick={() => cancelarReserva(resv._id)}
                className="mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors duration-200"
              >
                Cancelar Reserva
              </button>
              <button
                onClick={() => confirmarVenda(resv._id)}
                className="mt-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition-colors duration-200"
              >
                Confirmar Venda
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

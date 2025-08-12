import React from 'react';
import { Star } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';


const CardReserva = ({reserva}) => {
//   const navigate = useNavigate();
  return (
    <div
    // onClick={() => navigate(`/livros/${reserva._id}`)}
    className="cursor-pointer bg-white rounded-lg md:rounded-xl shadow-lg p-2 md:p-4 mx-1 md:mx-2 min-w-0 flex-shrink-0 hover:shadow-xl transition-shadow duration-300 h-80 md:h-96 flex flex-col">
      <div className=" bg-gray-200 rounded-md md:rounded-lg mb-2 md:mb-4">
        <img 
          src={reserva.livroid.fotos[0] || '/placeholder-book.jpg'}
          alt={reserva.livroid.titulo}
          className="w-full h-56 md:h-64 rounded-md md:rounded-lg overflow-hidden flex-shrink-0"
        />
      </div>
      <div className="space-y-1 md:space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-xs md:text-sm line-clamp-2 truncate"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
            {reserva.livroid.titulo}
          </h3>
          <p className="text-gray-600 text-xs truncate">Condição: {reserva.livroid.condicao}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex-col justify-center items-center">
            <span className="text-xs text-gray-500 max-w-20 truncate">Reservado por: </span>
            <span className="text-red-600 font-bold text-xs md:text-sm">{reserva.reservadorid.nome}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardReserva;

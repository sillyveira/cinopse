import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardCategoria from './CardCategoria';
import { useNavigate } from "react-router-dom";

const CarroselCategoria = ({ categories, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
      const updateCardsPerView = () => {
        if (window.innerWidth < 640) {
          setCardsPerView(2);
        } else if (window.innerWidth < 768) {
          setCardsPerView(3);
        } else if (window.innerWidth < 1024) {
          setCardsPerView(4);
        } else {
          setCardsPerView(5);
        }
      };
  
      updateCardsPerView();
      window.addEventListener('resize', updateCardsPerView);
      return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);
  
    const maxIndex = Math.max(0, categories.length - cardsPerView);
  
    const nextSlide = () => {
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };
  
    const prevSlide = () => {
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    };
  
    useEffect(() => {
      if (currentIndex > maxIndex) {
        setCurrentIndex(maxIndex);
      }
    }, [maxIndex, currentIndex]);

  return (
    <div className="w-full">
      <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{title}</h2>

      <div className="relative">
        {/* Botão de Voltar */}
        {currentIndex > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 md:p-2 shadow-lg hover:shadow-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
          </button>
        )}

        {/* Div dos Cards */}
        <div className="overflow-hidden mx-6 md:mx-12">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
      
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 px-1 md:px-2"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <CardCategoria 
                  category={category} 
                  onClick={() => navigate(`/livros?categoria=${category.id}`)} 
                />
              </div>
            ))}
          </div>
        </div>

      {/* Botão de Próximo */}
      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 md:p-2 shadow-lg hover:shadow-xl transition-all"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
          </button>
      )}
    </div>

    {/* Pontos */}
    {maxIndex > 0 && (
      <div className="flex justify-center mt-4 md:mt-6 space-x-1 md:space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-red-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    )}
  </div>
  );
};

export default CarroselCategoria;

import React from 'react';

const CardCategoria = ({ category }) => {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 hover:border-red-400 p-4 md:p-6 mx-1 md:mx-2 min-w-0 flex-shrink-0 hover:shadow-lg transition-all duration-300 cursor-pointer h-24 md:h-32 flex flex-col justify-center items-start">
      <div className="flex items-center space-x-2 md:space-x-3 mb-1 md:mb-2">
        <span className="text-2xl md:text-3xl">{category.emoji}</span>
        <h3 className="font-bold text-gray-800 text-sm md:text-lg">{category.name}</h3>
      </div>
      <p className="text-xs md:text-sm text-gray-600">{category.count} livros</p>
    </div>
  );
};

export default CardCategoria;

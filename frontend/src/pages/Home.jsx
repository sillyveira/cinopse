import React, { useState } from "react";
import { Search } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Add search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="bg-gray-50 pt-4 md:pt-10 h-full flex items-center justify-center relative px-4">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url('https://i0.wp.com/conectaprofessores.com/wp-content/uploads/2025/02/UFPE-abre-selecao-para-Professores-Visitantes-com-remuneracao-de-ate-R-22-mil.png')`,
        }}
      ></div>

      <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-12 max-w-3xl w-full relative z-10">
        {/* Header Text */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-lg md:text-2xl font-medium text-gray-800 leading-relaxed">
            conectando estudantes da federal por meio de livros
          </h1>
          <p className="text-base md:text-xl text-gray-600 mt-2">
            por que não tenta procurar um que você gosta?
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <form onSubmit={handleSearch} className="mb-8 md:mb-16">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar livros..."
              className="w-full px-4 md:px-6 py-3 md:py-4 rounded-full border-2 border-gray-300 focus:border-red-400 focus:outline-none text-base md:text-lg"
            />
            <button
              type="submit"
              className="cursor-pointer absolute right-1 md:right-2 top-1 md:top-2 bg-red-800 hover:bg-red-500 p-2 md:p-3 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>
        </form>

        {/* Estatísticas */}
        <div className="flex justify-center md:justify-end items-center gap-8 md:gap-20">
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              120
            </div>
            <div className="text-xs md:text-sm lg:text-base text-gray-600 mt-1">
              Leitores
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              881
            </div>
            <div className="text-xs md:text-sm lg:text-base text-gray-600 mt-1">
              Livros
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              4521
            </div>
            <div className="text-xs md:text-sm lg:text-base text-gray-600 mt-1">
              Vendas
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

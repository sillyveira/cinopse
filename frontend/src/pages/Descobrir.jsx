import React from 'react';
import Carrosel from '../componentes/descobrir/Carrosel';
import CarroselCategoria from '../componentes/descobrir/CarroselCategoria';
import Footer from '../componentes/Footer';

const Descobrir = () => {
  // Sample data
  const popularBooks = [
    { title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", price: "25.90", condition: "Novo", image: "https://upload.wikimedia.org/wikipedia/pt/4/47/O-pequeno-pr%C3%ADncipe.jpg", seller: "João Silva", rating: "4.8" },
    { title: "1984", author: "George Orwell", price: "32.50", condition: "Usado", image: "", seller: "Maria Santos", rating: "4.5" },
    { title: "Dom Casmurro", author: "Machado de Assis", price: "18.00", condition: "Novo", image: "", seller: "Pedro Costa", rating: "4.2" },
    { title: "O Cortiço", author: "Aluísio Azevedo", price: "22.90", condition: "Usado", image: "", seller: "Ana Lima", rating: "4.7" },
    { title: "Senhora", author: "José de Alencar", price: "20.00", condition: "Novo", image: "", seller: "Carlos Souza", rating: "4.3" },
    { title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", price: "28.90", condition: "Usado", image: "", seller: "Lucia Oliveira", rating: "4.6" },
    { title: "O Guarani", author: "José de Alencar", price: "24.50", condition: "Novo", image: "", seller: "Roberto Alves", rating: "4.4" },
  ];

  const recentBooks = [
    { title: "Algoritmos", author: "Thomas H. Cormen", price: "89.90", condition: "Novo", image: "", seller: "Tech Books", rating: "4.9" },
    { title: "Estruturas de Dados", author: "Mark Allen Weiss", price: "75.00", condition: "Usado", image: "", seller: "Estudante CIN", rating: "4.1" },
    { title: "Redes de Computadores", author: "Andrew S. Tanenbaum", price: "95.50", condition: "Novo", image: "", seller: "Livraria Central", rating: "4.8" },
    { title: "Sistemas Operacionais", author: "Abraham Silberschatz", price: "82.00", condition: "Usado", image: "", seller: "Bruno Tech", rating: "4.5" },
    { title: "Banco de Dados", author: "Ramez Elmasri", price: "110.90", condition: "Novo", image: "", seller: "Academic Store", rating: "4.7" },
    { title: "Engenharia de Software", author: "Ian Sommerville", price: "98.50", condition: "Usado", image: "", seller: "Dev Books", rating: "4.3" },
  ];

  // Categories data
  const categories = [
    { name: "Comédia", emoji: "😂", count: 102 },
    { name: "Romance", emoji: "❤️", count: 55 },
    { name: "Ação", emoji: "💥", count: 32 },
    { name: "Terror", emoji: "👻", count: 78 },
    { name: "Ficção", emoji: "🚀", count: 94 },
    { name: "Drama", emoji: "🎭", count: 67 },
    { name: "Aventura", emoji: "🗺️", count: 45 },
    { name: "Mistério", emoji: "🔍", count: 38 },
  ];

  return (
    <>
    <div className="h-full overflow-y-auto bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">

        <CarroselCategoria categories={categories} title="Categorias" />
        
        <Carrosel books={popularBooks} title="Livros Populares" />
        
        <Carrosel books={recentBooks} title="Adicionados Recentemente" />
        
        <Carrosel books={popularBooks} title="Ficção e Literatura" />
      </div>
    
    </div>
     
    </>
  );
};

export default Descobrir;

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Search, Bookmark, ListFilterPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pesquisar = () => {
  const { getLivrosPorCategoria } = useData();
  const [searchParams] = useSearchParams();
  const categoriaId = searchParams.get("categoria");

  const [livros, setLivros] = useState([]);
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [condicao, setCondicao] = useState("");

  const [generos, setGeneros] = useState({
    Romance: false,
    Drama: false,
    Aventura: false,
    Matemática: false,
    História: false,
    "Direito civil": false,
    Sociologia: false,
    Comédia: false,
    Fantasia: false,
  });

  const [generosExpanded, setGenerosExpanded] = useState(false);
  const [precosExpanded, setPrecosExpanded] = useState(false);
  const [condicaoExpanded, setCondicaoExpanded] = useState(false);

  const [salvos, setSalvos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  const termoBusca = searchParams.get("busca") || "";
  const [termoPesquisa, setTermoPesquisa] = useState(termoBusca);

  const termo = termoPesquisa.trim().toLowerCase();

  const COLOR_PRIMARY = "#5a2c2c";

  const navigate = useNavigate();

  const irParaDetalhes = (livroId) => {
  navigate(`/livros/${livroId}`);
  };

  useEffect(() => {
    if (categoriaId) {
      const livrosCategoria = getLivrosPorCategoria(categoriaId) || [];
      setLivros(livrosCategoria);
    }
  }, [categoriaId, getLivrosPorCategoria]);

  const salvarLivro = async (id) => {
  setSalvando(true);
  try {
    setSalvos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  } finally {
    setSalvando(false);
  }
  };

  const isSalvo = (id) => salvos.includes(id);

  const livrosFiltrados = useMemo(() => {
    const generosSelecionados = Object.keys(generos).filter((g) => generos[g]);

    return livros.filter((livro) => {
      const preco = Number(livro.preco);
      if (precoMin && preco < Number(precoMin)) return false;
      if (precoMax && preco > Number(precoMax)) return false;
      if (condicao && livro.condicao !== condicao) return false;
      if (
        generosSelecionados.length > 0 &&
        !generosSelecionados.includes(livro.genero)
      ) {
        return false;
      }

      const titulo = livro.titulo.toLowerCase();
      const autor = livro.autor.toLowerCase();
      if (termoBusca && !titulo.includes(termoBusca) && !autor.includes(termoBusca)) {
        return false;
      }

      return true;
    });
  }, [livros, precoMin, precoMax, condicao, generos, termoBusca]);


  // const livrosFiltrados = useMemo(() => {
  //   const generosSelecionados = Object.keys(generos).filter((g) => generos[g]);

  //   return livros.filter((livro) => {
  //     const preco = Number(livro.preco);
  //     if (precoMin && preco < Number(precoMin)) return false;
  //     if (precoMax && preco > Number(precoMax)) return false;
  //     if (condicao && livro.condicao !== condicao) return false;
  //     if (
  //       generosSelecionados.length > 0 &&
  //       !generosSelecionados.includes(livro.genero)
  //     )
  //       return false;
  //     return true;
  //   });
  // }, [livros, precoMin, precoMax, condicao, generos]);

  const toggleGenero = (nome) => {
    setGeneros((prev) => ({ ...prev, [nome]: !prev[nome] }));
  };

  return (
    <div className="min-h-screen bg-[#fdfafa] text-[#5a2c2c]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 p-6 border-r border-[#5a2c2c]">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            Filtragem <span className="ml-2 text-xl">
              <ListFilterPlus />
            </span>
          </h2>

          {/* Gêneros */}
          <div className="mb-4">
            <button
              onClick={() => setGenerosExpanded(!generosExpanded)}
              className="w-full flex justify-between items-center bg-[#5a2c2c] text-white px-4 py-2 rounded-md font-semibold"
            >
              Gêneros <span>{generosExpanded ? "-" : "+"}</span>
            </button>
            {generosExpanded && (
              <div className="mt-2 space-y-1 px-2">
                {Object.keys(generos).map((g) => (
                  <label
                    key={g}
                    className="flex justify-between items-center bg-white px-2 py-1 rounded border text-sm"
                  >
                    <span>{g}</span>
                    <input
                      type="checkbox"
                      checked={generos[g]}
                      onChange={() => toggleGenero(g)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preços */}
          <div className="mb-4">
            <button
              onClick={() => setPrecosExpanded(!precosExpanded)}
              className="w-full flex justify-between items-center bg-[#5a2c2c] text-white px-4 py-2 rounded-md font-semibold"
            >
              Preços <span>{precosExpanded ? "-" : "+"}</span>
            </button>
            {precosExpanded && (
              <div className="mt-2 space-y-2 px-2 text-sm">
                <div>
                  <label>Valor Mínimo:</label>
                  <input
                    type="number"
                    value={precoMin}
                    onChange={(e) => setPrecoMin(e.target.value)}
                    className="w-full p-1 border rounded mt-1"
                  />
                </div>
                <div>
                  <label>Valor Máximo:</label>
                  <input
                    type="number"
                    value={precoMax}
                    onChange={(e) => setPrecoMax(e.target.value)}
                    className="w-full p-1 border rounded mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Condição */}
          <div className="mb-4">
            <button
              onClick={() => setCondicaoExpanded(!condicaoExpanded)}
              className="w-full flex justify-between items-center bg-[#5a2c2c] text-white px-4 py-2 rounded-md font-semibold"
            >
              Condição <span>{condicaoExpanded ? "-" : "+"}</span>
            </button>
            {condicaoExpanded && (
              <div className="mt-2 space-y-1 px-2 text-sm">
                {["Novo", "Seminovo", "Usado", "Avariado"].map((c) => (
                  <label key={c} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="condicao"
                      value={c}
                      checked={condicao === c}
                      onChange={() => setCondicao(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-6">
          {/* Barra de pesquisa */}
          <div className="flex justify-center mb-6">
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Digite aqui o título do livro..."
                className="w-full p-3 pl-4 pr-12 border border-[#c7a5a5] rounded-full text-sm shadow-inner"
              />
              <button
                type="submit"
                className="cursor-pointer absolute right-1 md:right-2 top-1 md:top-1 bg-red-800 hover:bg-red-500 p-2 md:p-3 rounded-full transition-colors"
              >
                <Search className="w-3 h-3 md:w-3 md:h-3 text-white" />
              </button>
            </div>
          </div>

          {/* Lista de livros */}
          <div className="space-y-4">
            {livrosFiltrados.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhum livro encontrado.
              </p>
            ) : (
              livrosFiltrados.map((livro) => (
                <div
                  key={livro._id}
                  onClick={() => irParaDetalhes(livro._id)}
                  className="relative border border-[#5a2c2c] rounded-lg bg-white cursor-pointer hover:shadow-md transition"
                >
                  <div className="flex gap-4 items-center">
                  <div className="w-20 h-28 flex items-center justify-center">
                    <img
                      src={livro.fotos || "/default-book.png"}
                      alt={livro.titulo}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold relative pr-16">
                      {livro.titulo}

                        {/* Botão Salvar à direita do título */}
                        <button
                          type="button"
                          disabled={salvando}
                          onClick={(e) => {
                            e.stopPropagation();
                            salvarLivro(livro._id);
                          }}
                          className="absolute top-0 right-0 flex items-center gap-1 text-sm font-medium transition-colors disabled:opacity-50"
                          style={{ color: COLOR_PRIMARY }}
                        >
                          <span>{isSalvo(livro._id) ? "Salvo" : "Salvar"}</span>
                          <span aria-hidden="true">
                            {isSalvo(livro._id) ? (
                              <Bookmark color="#D4A037" fill="#D4A037" />
                            ) : (
                              <Bookmark />
                            )}
                          </span>
                        </button>
                      </h3>

                      <p className="text-sm">
                      {livro.autor} / Ano: {livro.ano} / Condição: {livro.condicao}
                    </p>
                  </div>
                </div>

                  <div className="text-right pr-1 pt-1">
                    <p className="text-2xl font-bold text-[#5a2c2c]">
                      R$ {Number(livro.preco).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pesquisar;
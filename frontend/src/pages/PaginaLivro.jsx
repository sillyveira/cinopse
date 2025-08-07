import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  ArrowLeft,
  CircleChevronLeft,
  CircleChevronRight,
} from "lucide-react";
import { useAuth } from "../context/Auth";

/* -------- Configurações de tema ----------- */
const COLOR_PRIMARY = "#7D474D";
const COLOR_PRIMARY_HOVER = "#5c3237";
const COLOR_PRIMARY_RING = "#b58a8f";
const COLOR_PRIMARY_BORDER = "#d8b6bb";
const COLOR_PRIMARY_BG_SOFT = "#f3e2e4";
const COLOR_PRIMARY_BG_SOFT_HOVER = "#e6d0d3";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/* --------- Utils --------- */
function maskTelefone(tel) {
  if (!tel) return "--";
  const digits = tel.replace(/\D+/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return tel; // fallback
}

function formatPreco(v) {
  if (v == null || Number.isNaN(Number(v))) return "--";
  return BRL.format(Number(v));
}

function Stars({ value = 0, max = 5 }) {
  const full = Math.round(value); // arredonda simples
  return (
    <span
      aria-label={`Avaliação: ${value} de ${max}`}
      className="text-yellow-500 select-none"
    >
      {Array.from({ length: max }).map((_, i) => (i < full ? "★" : "☆"))}
    </span>
  );
}

function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function LivroPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] gap-4 sm:gap-6 lg:gap-8 items-start">
      <div>
        <SkeletonBox className="w-full aspect-[3/4]" />
        <div className="mt-4 flex gap-2 overflow-x-auto sm:flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="w-16 h-16 flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <SkeletonBox className="h-8 w-64" />
        <SkeletonBox className="h-6 w-32" />
        <SkeletonBox className="h-48 w-full" />
        <SkeletonBox className="h-40 w-full" />
        <div className="flex gap-4">
          <SkeletonBox className="h-12 w-40" />
          <SkeletonBox className="h-12 w-40" />
        </div>
      </div>
    </div>
  );
}

function Atributo({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center gap-1 p-2">
      <span className="text-2xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs text-gray-500 leading-tight">{label}</span>
      <span className="text-sm font-medium leading-tight text-gray-900 whitespace-nowrap">
        {value ?? "--"}
      </span>
    </div>
  );
}

export default function PaginaLivroEstilizada() {
  const { idLivro } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [isSalvo, setIsSalvo] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [desativado, setDesativado] = useState(false);

  useEffect(() => {
    let abort = false;
    async function fetchLivro() {
      setIsLoading(true);
      setErro(null);
      try {
        const resp = await fetch(`http://localhost:3000/livros/${idLivro}`);
        if (!resp.ok) throw new Error("Livro não encontrado.");
        const data = await resp.json();
        if (!abort) {
          setLivro(data);
          setImgIndex(0);
        }
      } catch (err) {
        if (!abort) setErro(err.message || "Erro ao carregar livro.");
      } finally {
        if (!abort) setIsLoading(false);
      }
    }
    fetchLivro();
    return () => {
      abort = true;
    };
  }, [idLivro]);

  const salvarLivro = useCallback(async (livroId) => {
    setSalvando(true);
    setErro(null);
    try {
      const response = await fetch(
        `http://localhost:3000/usuarios/salvar-livro`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ livroId }),
        }
      );
      if (!response.ok) throw new Error("Não foi possível salvar o livro.");
      const data = await response.json();
      setIsSalvo(data?.saved ?? true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }, []);

  const iniciarConversaVendedor = useCallback(
    async (vendedorId) => {
      try {
        const response = await fetch(`http://localhost:3000/conversas`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outroUsuarioId: vendedorId }),
        });
        if (!response.ok)
          throw new Error("Não foi possível iniciar a conversa.");
        const data = await response.json();
        navigate(`/chat`, { state: { conversa: data, autoSelect: true } });
      } catch (err) {
        setErro(err.message);
      }
    },
    [navigate]
  );

  const reservarLivro = useCallback(async (livroId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/livros/${livroId}/reservar`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Não foi possível reservar o livro.");
      const data = await response.json();
    } catch (err) {
      setErro(err.message);
    }
  }, []);

  const fotos = livro?.fotos?.length ? livro.fotos : null;
  const mainImg = fotos ? fotos[imgIndex] : null;

  const vendedor = livro?.vendedor ?? {};
  const precoFmt = useMemo(() => formatPreco(livro?.preco), [livro]);

  if (isLoading) return <LivroPageSkeleton />;
  if (erro) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <p style={{ color: COLOR_PRIMARY }} className="font-medium">
          Erro: {erro}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{ backgroundColor: COLOR_PRIMARY }}
          className="mt-4 px-4 py-2 rounded text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  if (!livro) return null;

  return (
    <div className="relative max-w-7xl mx-auto p-2 sm:p-4 lg:p-8">
      {/* Barra topo: voltar + salvar */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: COLOR_PRIMARY }}
        >
          <span className="text-lg" aria-hidden="true">
            <ArrowLeft />
          </span>
        </button>

        {isAuthenticated && (
          <button
            type="button"
            disabled={salvando}
            onClick={() => salvarLivro(livro._id)}
            className="cursor-pointer flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ color: COLOR_PRIMARY }}
          >
            <span>{isSalvo ? "Salvo" : "Salvar"}</span>
            <span aria-hidden="true">
              {isSalvo ? (
                <Bookmark color="#D4A037" fill="#D4A037" />
              ) : (
                <Bookmark />
              )}
            </span>
          </button>
        )}
      </div>

      {/* GRID PRINCIPAL DESCRIÇÃO LIVRO*/}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Coluna imagens */}
        <div className="w-full flex flex-col items-start">
          <div className="w-full max-w-[400px] aspect-[3/4] relative">
            {mainImg ? (
              <>
                <img
                  src={mainImg}
                  alt={`${livro.titulo} - imagem ${imgIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl border-4"
                  style={{ borderColor: COLOR_PRIMARY_BORDER }}
                />

                {/* Botão esquerda */}
                {imgIndex > 0 && (
                  <button
                    onClick={() => setImgIndex((prev) => Math.max(prev - 1, 0))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-white transition"
                  >
                    <CircleChevronLeft size={28} color={COLOR_PRIMARY} />
                  </button>
                )}

                {/* Botão direita */}
                {imgIndex < fotos.length - 1 && (
                  <button
                    onClick={() =>
                      setImgIndex((prev) => Math.min(prev + 1, fotos.length - 1))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full hover:bg-white transition"
                  >
                    <CircleChevronRight size={28} color={COLOR_PRIMARY} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl border-4" style={{ borderColor: COLOR_PRIMARY_BORDER }}>
                <span className="text-gray-500 text-sm">Sem imagem disponível</span>
              </div>
            )}
          </div>


          {/* Miniaturas - scroll horizontal no mobile */}
          {fotos ? (
            <div className="mt-4 flex gap-2 overflow-x-auto sm:flex-wrap">
              {fotos.map((foto, i) => {
                const selected = i === imgIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border transition-shadow ${
                      selected ? "ring-2" : ""
                    }`}
                    style={
                      selected
                        ? {
                            borderColor: COLOR_PRIMARY,
                            boxShadow: `0 0 0 2px ${COLOR_PRIMARY_RING}`,
                          }
                        : { borderColor: "#e5e7eb" }
                    }
                  >
                    <img
                      src={foto}
                      alt={`${livro.titulo} miniatura ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Coluna dados */}
        <div className="w-full space-y-8">
          {/* Título + preço */}
          <header className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 leading-tight break-words">
              {livro.titulo}
            </h1>
            <p
              className="text-lg sm:text-xl lg:text-2xl font-semibold"
              style={{ color: COLOR_PRIMARY }}
            >
              {precoFmt}
            </p>
          </header>

          {/* Card descrição + atributos */}
          <section className="rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 lg:p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Descrição do Livro
              </h2>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Condição:</span>{" "}
                {livro.condicao || "--"}
              </p>
              {livro.descricao ? (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {livro.descricao}
                </p>
              ) : (
                <p className="text-sm text-gray-400">Sem descrição.</p>
              )}
            </div>

            {/* Atributos - grid responsiva */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-4">
              <Atributo icon="👤" label="Autor" value={livro.autor || "--"} />
              <Atributo
                icon="📄"
                label="Nº páginas"
                value={livro.nPaginas ?? "--"}
              />
              <Atributo icon="🗣️" label="Idioma" value={livro.idioma || "--"} />
              <Atributo
                icon="🏢"
                label="Editora"
                value={livro.editora || "--"}
              />
              <Atributo
                icon="🗓️"
                label="Ano Publicação"
                value={livro.anoPublicacao || "--"}
              />
              <Atributo
                icon="🏷️"
                label="Categoria"
                value={livro?.categoria?.nome || "--"}
              />
            </div>
          </section>

          {/* Card vendedor */}
          <section
            onClick={() => navigate(`/perfil/${vendedor?._id}`)}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 lg:p-6 shadow-sm space-y-4 group"
          >
            <header className="flex items-start gap-4">
              <img
                src={
                  vendedor?.foto || "https://via.placeholder.com/80x80?text=?"
                }
                alt={vendedor?.nome || "Vendedor"}
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 leading-tight truncate">
                  {vendedor?.nome || "Vendedor"}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stars value={vendedor?.avaliacaoMedia ?? 0} />
                  <span>({vendedor?.qtdAvaliacoes ?? 0} avaliações)</span>
                </div>
              </div>
            </header>

            {/* <ul className="space-y-1 text-sm text-gray-700">
              {vendedor?.localizacao && (
                <li>📍 <span className="font-medium">Localização:</span> {vendedor.localizacao}</li>
              )}
              {vendedor?.disponibilidade && (
                <li>🕒 <span className="font-medium">Disponibilidade:</span> {vendedor.disponibilidade}</li>
              )}
              {vendedor?.telefone && (
                <li>
                  📞 <span className="font-medium">Telefone:</span> {maskTelefone(vendedor.telefone)}{" "}
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(vendedor.telefone)}
                    className="underline text-xs ml-1 transition-colors"
                    style={{ color: COLOR_PRIMARY }}
                  >Copiar</button>
                </li>
              )}
              {vendedor?.observacoes && (
                <li>📝 <span className="font-medium">Observações:</span> {vendedor.observacoes}</li>
              )}
              {vendedor?.respondeRapido && (
                <li>⚡ Responde rápido no chat.</li>
              )}
              <li>
                💰 {vendedor?.aceitaPix ? "Aceita Pix" : null}{vendedor?.aceitaPix && vendedor?.aceitaDinheiro ? " e " : ""}{vendedor?.aceitaDinheiro ? "dinheiro" : null}{(!vendedor?.aceitaPix && !vendedor?.aceitaDinheiro) ? "Formas de pagamento a combinar" : null}.
              </li>
              {vendedor?.observacaoPreco && (
                <li>💬 {vendedor.observacaoPreco}</li>
              )}
            </ul> */}
          </section>

          {/* Botões de ação */}
          {isAuthenticated && ( 
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={() => iniciarConversaVendedor(vendedor?._id)}
              className="cursor-pointer flex-1 inline-flex items-center justify-center px-1 py-3 rounded-full bg-rose-800 text-white font-medium hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition"
            >
              💬 Chat com Vendedor
            </button>
            <button
              type="button"
              onClick={!desativado ? () => reservarLivro(livro._id) : null}
              disabled={true}
              className={` flex-1 inline-flex items-center justify-center px-1 py-3 rounded-full 
    ${
      desativado
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "cursor-pointer bg-rose-100 text-rose-800 hover:bg-rose-200"
    }
    font-medium transition`}
            >
              📚 Reservar livro
            </button>
          </div>)}
        </div>
      </div>
    </div>
  );
}

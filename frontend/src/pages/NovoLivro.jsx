import CardImagem from "../componentes/cardImagem"
import { Plus, UploadCloud, Trash2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import ReactDOM from 'react-dom'
import { useAuth } from "../context/Auth"
import imageCompression from 'browser-image-compression'
import { Navigate, useNavigate } from "react-router-dom"
import { fetchCategorias } from "../services/api"

async function compressPhoto(file){
    const compressedImage = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true
    })

    return await imageCompression.getDataUrlFromFile(compressedImage);
}

async function removeNulls(array) {
    const newArray = await array.filter(elem => elem != null)

    return newArray
}

const FileInput = ({ index, file, onChange, IconComponent }) => (
  <div className="flex mb-4 gap-3">
    <input
      id={`file-input-${index}`}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={e => onChange(index, e.target.files?.[0] || null)}
      disabled={file ? true : false}
    />
    <label
      htmlFor={`file-input-${index}`}
      className="relative flex justify-between items-center w-full bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <IconComponent className="h-5 w-5 absolute left-3 text-gray-500" />
      <span className="block pl-8 text-sm text-gray-700 truncate">
        {file ? `Imagem ${index + 1} ✅` : `Selecionar imagem ${index + 1}`}
      </span>
    </label>
    {file && <Trash2Icon onClick={()=> {
        console.log('clicou')
        const erasePic = document.getElementById(`file-input-${index}`)
        if(erasePic instanceof HTMLInputElement) {
        console.log('cheguei aqui')
        erasePic.value = '';
        onChange(index, null)

    }
      }} color="black" className="self-center cursor-pointer"/>}
  </div>
);

const Modal = ({ isOpen, onClose, images, onImageChange }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/20 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Envie até 5 imagens</h2>
        {[...Array(5)].map((_, idx) => (
            <FileInput
            key={idx}
            index={idx}
            file={images[idx]}
            onChange={onImageChange}
            IconComponent={UploadCloud}
          />
        ))}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-[#7D474D] text-white rounded cursor-pointer"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default function NovoLivro(){
    const [form, setForm] = useState({titulo: '', autor: '', condicao: '', preco: '', categoria: '', anoPublicacao: '', descricao: '',editora: '', nPaginas: '', idioma: ''})
    const [fotos, setFotos] = useState(Array(5).fill(null))
    const [error,setError] = useState({})
    const [isOpen, setIsOpen] = useState(false)
    const [isDisa, setIsDisa] = useState(false)
    const [fCategorias, setFCategorias] = useState([])

    const {user} = useAuth()

    const handleImageChange = (index, file) => {
    const newImages = [...fotos];
    newImages[index] = file;
    setFotos(newImages);
  };

    useEffect(()=> {
        const getCategorias = async()=> {
            try{
                const categorias = await fetchCategorias();

                if(!categorias){
                    throw new Error("Erro ao recuperar categorias.")
                }

                setFCategorias(categorias)
            } catch(error){
                console.log(error.message)
            }
        }

        getCategorias();
    }, [])


    const toggleModal = () => setIsOpen(isOpen => !isOpen);

    function validate(name,value){

        let msg = '';
        if ((name === 'titulo' || name === 'autor' || name === 'editora')
            && value.length > 100
        ) {
        msg = `${name === 'titulo' ? 'Título' :
                name === 'autor' ? 'Nome do autor' : 'Editora'
                } deve ter no máximo 100 caracteres.`;
        }

        if((name === 'titulo' || name === 'autor' || name === 'editora') && value === '' || value === null) {
            msg = `${name === 'titulo' ? 'Título' :
                name === 'autor' ? 'Nome do autor' : 'Editora'
                } é obrigatório`;
        }
        if (name === 'preco') {
        const num = Number(value);
        if (value === '') {
            msg = `${name} obrigatório.`;
        } else if (Number.isNaN(num)) {
            msg = `${name} deve ser número.`;
        } else if (num < 0) {
            msg = `${name} não pode ser negativo.`;
        }
        }
        setError(err => ({ ...err, [name]: msg }));

        return !msg;
            
    }
    const navigate = useNavigate();
    const submitData = async (e) => {
        
        setIsDisa(true)
        e.preventDefault()

        const validando = Object.entries(form).every(
            ([n,v]) => validate(n,v) 
        )

        
        if(!validando) {
            setIsDisa(false)
            console.log('Corrija os erros')
            return
        }
        
        const removerNulls = await removeNulls(fotos)

        if(!removerNulls) {
            setIsDisa(false)
            setError(err => ({...err, ['fotos']: 'Anexe pelo menos uma imagem.'}))
            return
        }

        const imagensConvertidas = await Promise.all(
            removerNulls.map(foto => foto instanceof File ? compressPhoto(foto) : null )
        );

        if(!imagensConvertidas) {
            setIsDisa(false)
            console.log('Erro durante a conversão de imagem')
            return
        }


        const response = await fetch('http://localhost:3000/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                ...form,
                fotos: imagensConvertidas,
                vendedor: user.id
            }),
            credentials: 'include'
        })

        if (response.status == 201){
            navigate('/vendedor/meus-anuncios')
        }
        setIsDisa(false)

        console.log('Dados recolhidos:', form, fotos)
    }

    return (
        <div className="bg-[#FFFFFF] flex flex-wrap w-full h-full overflow-y-scroll">
            <strong><h1 className="text-3xl px-38 pt-18 pb-2 max-lg:py-8 max-lg:text-2xl max-md:text-xl">Cadastre o seu livro para venda</h1></strong>
            <div className="flex flex-col px-64 max-xl:px-24 max-lg:px-12 w-11/12 max-lg:w-full gap-8">
            <form onSubmit={submitData} noValidate className="contents">
                <div className="flex max-lg:flex-col gap-12">
                    <div className="w-1/2 max-lg:w-full">
                        <strong><p>Título *</p></strong>
                        <input className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4" type="text" placeholder="Digite aqui o título do livro..."
                        name="titulo"
                        value={form.titulo}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]:e.target.value }))
                            validate(e.target.name, e.target.value)
                        }}
                        />
                        {error['titulo'] && (<p className="text-red-500">{error['titulo']}</p>)}
                    </div>
                    <div className="w-1/2 max-lg:w-full">
                        <strong><p>Nome do autor</p></strong>
                        <input className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4" type="text" placeholder="Digite aqui o nome do autor..."
                        name="autor"
                        value={form.autor}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        />
                        {error['autor'] && (<p className="text-red-500">{error['autor']}</p>)}
                    </div>
                </div>
                <div className="flex max-lg:flex-wrap gap-8">
                    <div className="w-1/4 max-lg:w-6/12">
                        <strong><p>Condição *</p></strong>
                        <select className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4"
                        name="condicao"
                        value={form.condicao}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        >
                            <option value="" disabled>Condição do livro</option>
                            <option value="Novo">Novo</option>
                            <option value="Seminovo">Seminovo</option>
                            <option value="Usado">Usado</option>
                            <option value="Avariado">Avariado</option>
                        </select>
                        {error['condicao'] && (<p className="text-red-500">{error['condicao']}</p>)}
                    </div>
                    <div className="w-1/4 max-lg:w-5/12">
                        <strong><p>Preço</p></strong>
                        <input className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4" type="number" placeholder="R$ 0.00"
                        name="preco"
                        value={form.preco}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        />
                        {error['preco'] && (<p className="text-red-500">{error['preco']}</p>)}
                    </div>
                    <div className="w-1/4 max-lg:w-6/12">
                        <strong><p>Categoria</p></strong>
                        <select className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4"
                        name="categoria"
                        value={form.categoria}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        >
                            <option value="" disabled>Categoria</option>
                            {fCategorias.map((cats, index)=> (
                                <option id={index} value={cats._id}>{cats.nome}</option>
                            ))}
                            
                        </select>
                        {error['categoria'] && (<p className="text-red-500">{error['categoria']}</p>)}
                    </div>
                    <div className="w-1/4 max-lg:w-5/12">
                        <strong><p>Ano de publicação</p></strong>
                        <input className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4" type="number" placeholder="Ano de publicação"
                        name="anoPublicacao"
                        value={form.anoPublicacao}
                        onChange={(e)=> {
                            setForm(prev => ({...prev, [e.target.name]:e.target.value }))
                            validate(e.target.name,e.target.value)
                        }}
                        />
                        {error['anoPublicacao'] && (<p className="text-red-500">{error['anoPublicacao']}</p>)}
                    </div>
                </div>
                <div className="w-full">
                    <strong><p>Descrição</p></strong>
                    <textarea className="flex border border-[#A29797] rounded-[12px] h-40 w-full pl-4 items-start py-2 text-black" placeholder="Descrição"
                    name="descricao"
                    value={form.descricao}
                    onChange={(e)=> {
                        setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                        validate(e.target.name,e.target.value)
                    }}
                    />
                </div>
                <div className="flex max-lg:flex-col w-full gap-24 max-lg:gap-8">

                    <div className="w-1/2 max-lg:w-full">
                        <strong><p>Fotos *</p></strong>
                        <div className="grid grid-cols-3 max-lg:grid-cols-2 w-full gap-y-4 gap-x-4">
                            <CardImagem texto="📷 Imagem 1" isTrue={fotos[0]}/>
                            <CardImagem texto="📷 Imagem 2" isTrue={fotos[1]}/>
                            <CardImagem texto="📷 Imagem 3" isTrue={fotos[2]}/>
                            <CardImagem texto="📷 Imagem 4" isTrue={fotos[3]}/>
                            <CardImagem texto="📷 Imagem 5" isTrue={fotos[4]}/>
                            <button onClick={toggleModal} className="flex flex-row w-full h-12 bg-[#7D474D] border border-[#7D474D] text-white rounded-[12px] p-2 justify-around items-center self-center cursor-pointer">
                                <Plus/>
                                <strong><p>Adicionar Foto</p></strong>
                            </button>    
                        </div>
                        {error['fotos'] && (<p className="text-red-500">{error['fotos']}</p>)}
                    </div>
                    <div className="flex flex-col w-1/2 gap-4 max-lg:w-full">
                        <div className="flex flex-col w-full">
                        <strong><p>Editora*</p></strong>
                        <input className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4" type="text" placeholder="Digite o nome da editora..."
                        name="editora"
                        value={form.editora}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        />
                        {error['editora'] && (<p className="text-red-500">{error['editora']}</p>)}
                        </div>
                        <div className="flex gap-8 flex-row w-full">

                        <div className="flex flex-col w-1/2">
                        <strong><p>Nº de páginas</p></strong>
                        <input type="number" className="w-full border border-[#A29797] rounded-[12px] h-12 pl-4" placeholder="Digite o número de páginas..."
                        name="nPaginas"
                        value={form.nPaginas}
                        onChange={(e)=> {
                            setForm(prev=> ({...prev, [e.target.name]: e.target.value}))
                            validate(e.target.name, e.target.value)
                        }}
                        />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <strong><p>Idioma*</p></strong>
                            <select
                                className="border border-[#A29797] rounded-[12px] h-12 w-full pl-4"
                                name="idioma"
                                value={form.idioma}
                                onChange={(e) => {
                                    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
                                    validate(e.target.name, e.target.value);
                                }}
                                >
                                <option value="" disabled>
                                    Selecione um idioma
                                </option>
                                <option value="Português">Português</option>
                                <option value="Inglês">Inglês</option>
                                <option value="Espanhol">Espanhol</option>
                                <option value="Francês">Francês</option>
                                <option value="Alemão">Alemão</option>
                                <option value="Italiano">Italiano</option>
                                <option value="Chinês (Mandarim)">Chinês (Mandarim)</option>
                                <option value="Japonês">Japonês</option>
                                <option value="Coreano">Coreano</option>
                                <option value="Árabe">Árabe</option>
                                <option value="Russo">Russo</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Turco">Turco</option>
                                <option value="Hebraico">Hebraico</option>
                                <option value="Grego">Grego</option>
                                <option value="Tailandês">Tailandês</option>
                                <option value="Vietnamita">Vietnamita</option>
                                <option value="Sueco">Sueco</option>
                                <option value="Norueguês">Norueguês</option>
                                <option value="Dinamarquês">Dinamarquês</option>
                                <option value="Finlandês">Finlandês</option>
                                <option value="Holandês">Holandês</option>
                                <option value="Romeno">Romeno</option>
                                <option value="Tcheco">Tcheco</option>
                                <option value="Polonês">Polonês</option>
                                <option value="Húngaro">Húngaro</option>
                                <option value="Ucraniano">Ucraniano</option>
                                <option value="Eslovaco">Eslovaco</option>
                                <option value="Croata">Croata</option>
                                <option value="Sérvio">Sérvio</option>
                                <option value="Búlgaro">Búlgaro</option>
                                <option value="Lituano">Lituano</option>
                                <option value="Letão">Letão</option>
                                <option value="Estoniano">Estoniano</option>
                                </select>
                        </div>
                        </div>
                    </div>
                </div>
                <button disabled={isDisa} className="flex flex-row w-full h-12 bg-[#7D474D] border border-[#7D474D] text-white rounded-[12px] p-2 items-center justify-center cursor-pointer" type="submit"><strong>{isDisa ? "Carregando..." : "Cadastrar Livro"}</strong></button>
            </form>
            </div>
            <Modal
            isOpen={isOpen}
            onClose={toggleModal}
            images={fotos}
            onImageChange={handleImageChange}
            />
        </div>
    )
}
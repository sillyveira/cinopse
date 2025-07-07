import React, { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { useAuth } from "../context/Auth";
import io from "socket.io-client";
// TODO: Implementar a página de chat com as seguintes funcionalidades:

// - Exibir mensagens de uma conversa selecionada
// - Permitir iniciar uma nova conversa
// - Enviar e receber mensagens em tempo real
// - Integrar com o WebSocket para comunicação em tempo real
// - Implementar pesquisa de conversas por nome de usuário

// DEPOIS:
// - Não permitir que o usuário inicie uma conversa com ele mesmo
// - Não permitir que o usuário acesse a página de chat sem estar logado

export default function Chat() {
  const { user } = useAuth();

  // Estado para armazenar a conexão do WebSocket
  const [socket, setSocket] = useState(null);

  const [textoMensagem, setTextoMensagem] = useState("");

  // Estado para armazenar o usuário da conversa selecionada
  const [usuarioConversa, setUsuarioConversa] = useState();

  // Estado para armazenar as conversas do usuário
  const [conversas, setConversas] = useState([]);

  // Estado para armazenar as mensagens da conversa selecionada
  const [mensagens, setMensagens] = useState([
    {
      _id: "1",
      idConversa: "12345",
      texto: "Olá, como você está?",
      de: {
        _id: "123",
      },
      para: {
        _id: "456",
      },
      timestamp: "2025-07-06T14:35:09.475Z",
    },
    {
      _id: "2",
      idConversa: "12345",
      texto: "Tô bem",
      de: {
        _id: "686a73c7192639a2a3b49f7c",
      },
      para: {
        _id: "456",
      },
      timestamp: "2025-07-06T14:35:09.475Z",
    },
  ]);

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:3000", {
        query:{ùserId: user.id},
      });

      newSocket.on("connect", () => {
        console.log("Conectado ao WebSocket:", newSocket.id);
      });
      newSocket.on("disconnect", () => {
        console.log("Desconectado do WebSocket");
      });
      newSocket.on("newMessage", (message) => {
        console.log("Nova mensagem recebida:", message);

        setMensagens((prevMensagens) => [...prevMensagens, message]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        console.log("WebSocket desconectado");
      };
    }}, [user]);
  // Função para selecionar uma conversa e exibir as mensagens
  const selecionarConversa = async (conversa) => {
    setUsuarioConversa({
      idConversa: conversa._id,
      id: conversa.outroUsuario._id,
      nome: conversa.outroUsuario.nome || "Desconhecido",
      imagem: conversa.outroUsuario.foto || "https://via.placeholder.com/150",
    });
    // TODO: Lógica para exibir as mensagens da conversa selecionada
    await receberMensagens(conversa);
    if (socket) {
      socket.emit("joinConversation", conversa._id);
    }
    console.log("Conversa selecionada:", conversa);
  };

  const receberMensagens = async (conversa) => {
    try {
      const response = await fetch(
        `http://localhost:3000/mensagens/conversa/${conversa._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar mensagens");
      }
      const data = await response.json();
      setMensagens(data);
      console.log("Mensagens recebidas:", data);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const fecharConversa = () => {
    setUsuarioConversa(null);
    socket.emit("leaveConversation", usuarioConversa.idConversa);
    setMensagens([]);
    console.log("Conversa fechada");
  };

  const handleSendMessage = async () => {
    if (textoMensagem.trim() && usuarioConversa && socket) {
      const messageData = {
        idConversa: usuarioConversa.idConversa,
        de: user.id,
        para: usuarioConversa.id,
        texto: textoMensagem,
      };

      // Send via WebSocket
      socket.emit("sendMessage", messageData);

      setTextoMensagem("");
    }
  };

  // useEffect para buscar as conversas do usuário ao carregar a página
  useEffect(() => {
    async function puxarConversas() {
      try {
        const response = await fetch(
          "http://localhost:3000/conversas/usuario",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar conversas");
        }
        const data = await response.json();
        setConversas(data);
        console.log("Conversas:", data);
        console.log("------------");
        console.log("Conversas:", conversas);
      } catch (error) {
        console.error("Erro ao buscar conversas:", error);
      }
    }

    puxarConversas();
  }, []);

  return (
    <>
      <div className="flex h-screen">
        {/* Conversas */}
        <div className="text-2xl font-bold h-full p-4 w-104">
          <h1>Conversas Recentes</h1>
          <hr />

          {conversas.length === 0 ? (
            <div className="text-gray-500">Nenhuma conversa encontrada.</div>
          ) : (
            conversas.map((conversa) => (
              <ConversaItem
                key={conversa._id}
                conversa={conversa}
                selecionarConversa={selecionarConversa}
              />
            ))
          )}
        </div>

        {/* ---------------------------------------------*/}

        {/* Tela das Conversas */}
        {/* Exibe a conversa selecionada ou uma mensagem padrão se nenhuma for selecionada */}
        {usuarioConversa?.id ? (
          <div className="text-gray-600 mb-2 bg-purple-300 h-full w-full">
            <HeaderConversa
              usuarioConversa={usuarioConversa}
              fecharConversa={fecharConversa}
            />
            <div className="overflow-y-auto">
              <TelaMensagens
                mensagens={mensagens}
                usuarioConversa={usuarioConversa}
                usuario={user}
              />
              {/* Formulário de Envio de Mensagem */}
              <form
                className="flex items-center p-4 bg-white border-t border-gray-200"
                >
                <input
                  type="text" 
                  className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
                  placeholder="Digite sua mensagem..."
                  value={textoMensagem}
                  onChange={(e) => setTextoMensagem(e.target.value)}
                  ></input>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleSendMessage}
                >
                  <Send size={20} />
                </button>
                </form>
            </div>
          
          </div>
        ) : (
          <div className=" mb-2 bg-gray-100 h-full w-full flex items-center justify-center ">
            <div className="flex flex-col items-center gap-2">
              <Send className="text-red-800" size={62} />
              <h1 className="text-2xl">
                Clique em uma conversa à esquerda para iniciar o chat.
              </h1>
            </div>
          </div>
        )}
        {/* ------------- */}
      </div>

      <div className="text-gray-600 mb-8">
        Esta página será implementada em breve!
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-b- 2 border-blue-600 mb-4"></div>
      <div className="text-gray-500">Carregando...</div>
      <div>Conversas</div>
    </>
  );
}

function TelaMensagens({ mensagens, usuario, usuarioConversa }) {
  return (
    <div className="overflow-y-auto p-4 bg-gray-100">
      {mensagens.length === 0 ? (
        <div className="text-gray-500">Nenhuma mensagem encontrada.</div>
      ) : (
        mensagens.map((msg) =>
          msg.de === usuario.id ? (
            <div key={msg._id} className="mb-2 flex justify-end">
              <div className="bg-red-800 text-white p-3 rounded-lg max-w-xs">
                <p>{msg.texto}</p>
                <span className="text-xs text-red-200 block mt-1">
                  {formatarUltimaMensagem(msg.timestamp)}
                </span>
              </div>
            </div>
          ) : (
            <div key={msg._id} className="mb-2 flex justify-start">
              <div className="bg-white p-3 rounded-lg max-w-xs shadow-sm">
                <p className="font-semibold text-gray-800 text-sm">
                  {usuarioConversa.nome}
                </p>
                <p>{msg.texto}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {formatarUltimaMensagem(msg.timestamp)}
                </span>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}


// Imagem e nome do usuário na conversa.
function HeaderConversa({ usuarioConversa, fecharConversa }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center ">
        <img
          src={usuarioConversa.imagem}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {usuarioConversa.nome}
          </h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      <div
        className="cursor-pointer hover:bg-gray-100 active:bg-gray-300  rounded-full p-2 transition-all "
        onClick={() => fecharConversa()}
      >
        <X size={30} />
      </div>
    </div>
  );
}

// Componente de item de conversa na lista
function ConversaItem({ conversa, selecionarConversa }) {
  return (
    <div
      className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
      onClick={() => selecionarConversa(conversa)}
    >
      <img
        src={conversa.outroUsuario.foto}
        alt="?"
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {conversa.outroUsuario.nome || "Desconhecido"}
        </h3>
        <p className="text-sm text-gray-500">
          {formatarUltimaMensagem(conversa.ultimaMensagem)}
        </p>
      </div>
    </div>
  );
}

// Função para formatar a data da última mensagem
// Transforma a data ISO (2025-07-06T14:35:09.475Z) em uma string legível (Hoje às 11:35)
function formatarUltimaMensagem(dataISO) {
  if (!dataISO) return "Sem mensagens";

  const agora = new Date();
  const data = new Date(dataISO);
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const ontem = new Date(hoje.getTime() - 24 * 60 * 60 * 1000);
  const dataMsg = new Date(data.getFullYear(), data.getMonth(), data.getDate());

  const horario = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dataMsg.getTime() === hoje.getTime()) {
    return `Hoje às ${horario}`;
  } else if (dataMsg.getTime() === ontem.getTime()) {
    return `Ontem às ${horario}`;
  } else {
    return `${data.toLocaleDateString("pt-BR")} às ${horario}`;
  }
}

//------------------------------------//

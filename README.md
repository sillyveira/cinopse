# Cinopse 📚

Um marketplace de livros desenvolvido especialmente para estudantes da UFPE (Universidade Federal de Pernambuco). O Cinopse conecta estudantes que desejam vender, comprar ou trocar livros acadêmicos e de interesse geral.

## 🎯 Sobre o Projeto

O Cinopse é uma plataforma web que facilita a compra e venda de livros entre estudantes universitários, promovendo a sustentabilidade e economia colaborativa no ambiente acadêmico.

### ✨ Funcionalidades

- 🔐 **Autenticação**: Login seguro com integração Google OAuth
- 📖 **Catálogo de Livros**: Navegação por categorias e busca avançada
- 💬 **Chat Integrado**: Comunicação em tempo real entre compradores e vendedores
- 👤 **Perfil de Usuário**: Gerenciamento de anúncios e livros salvos
- 📱 **Interface Responsiva**: Design moderno e adaptável para todos os dispositivos
- ⭐ **Sistema de Avaliações**: Feedback entre usuários para maior confiabilidade

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Socket.io** - Comunicação em tempo real
- **Google OAuth** - Autenticação social

### Frontend
- **React.js** - Biblioteca para interfaces
- **Vite** - Build tool e dev server
- **Tailwind** - Estilização

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (local ou MongoDB Atlas)

## 🚀 Como Executar o Projeto

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cinopse
```

### 2. Configuração do Backend
```bash
# Navegue para a pasta backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (crie um arquivo .env), o arquivo .env que usamos está disponível no Discord da displicina, para um usuário de fora da cadeira, essas são as diretivas do .env:

#GOOGLE_CLIENT_ID=
#GOOGLE_CLIENT_SECRET=
#GOOGLE_REDIRECT_URI=
#PORT=3000
#JWT_SECRET=
#JWT_EXPIRATION=
#MONGO_URI=

# Execute o servidor
npm run dev
```

### 3. Configuração do Frontend
```bash
# Abra um novo terminal e navegue para a pasta frontend
cd frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000 (ou porta configurada)

## 📁 Estrutura do Projeto

```
cinopse/
├── backend/                 # Servidor Node.js
│   ├── controllers/         # Controladores da API
│   ├── models/             # Modelos do banco de dados
│   ├── routes/             # Rotas da API
│   ├── middlewares/        # Middlewares personalizados
│   └── server.js           # Arquivo principal do servidor
│
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços e APIs
│   │   └── context/        # Context API para gerenciamento de estado
│   └── public/             # Arquivos estáticos
│
└── README.md              # Este arquivo
```

## 📝 Licença

Este projeto é desenvolvido para fins acadêmicos.

---

📚 **Cinopse** - Conectando estudantes através dos livros

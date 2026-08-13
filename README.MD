# 🚀 ReadMeGen

O **ReadMeGen** é uma aplicação que analisa projetos públicos do GitHub e utiliza a **Google Gemini API** para gerar automaticamente documentação em português de Portugal.

## ✨ Funcionalidades

- 🔗 Análise de repositórios GitHub públicos
- 🤖 Geração automática de documentação com Gemini
- 📝 Criação de `README.md`
- 📄 Criação de `descricao_curta.txt`
- 🖥️ Interface gráfica
- ⚙️ Servidor iniciado automaticamente
- 📦 Suporte para utilização portátil

## 🛠️ Requisitos

- Node.js
- Chave da Google Gemini API
- Ligação à Internet

## ⚙️ Configuração

Instala as dependências:

```bash
npm install
cd ReadMeGen-Server
npm install
cd ..

Cria o ficheiro:

ReadMeGen-Server/.env

Com:

GEMINI_API_KEY=A_TUA_CHAVE

⚠️ Nunca publiques o .env no GitHub.

▶️ Executar

Na pasta principal:

npm start

O ReadMeGen inicia automaticamente o ReadMeGen-Server, pelo que não é necessário iniciar o servidor manualmente.

📖 Como utilizar
Abre o ReadMeGen.
Introduz um repositório público do GitHub.

Exemplo:

Lord-beep/MultiPrint
Clica em Gerar Ficheiros de Documentação.
A aplicação obtém o código do GitHub.
O Gemini analisa o projeto.
A documentação é gerada automaticamente.

Os ficheiros são guardados na pasta:

Documentacao-Gerada/
├── README.md
└── descricao_curta.txt

A pasta é criada automaticamente caso não exista.

🔒 Segurança

A chave da Gemini deve permanecer no .env e nunca deve ser publicada.

O .gitignore impede o envio de ficheiros como:

.env
node_modules/
dist/
*.log
📦 Versão portátil

O ReadMeGen pode ser compilado para Windows através do Electron Builder.

A versão compilada inicia automaticamente o servidor local e permite utilizar a aplicação sem iniciar manualmente o backend.

📁 Estrutura
ReadMeGen/
├── ReadMeGen-Server/
│   ├── server.js
│   ├── package.json
│   └── .env
├── Documentacao-Gerada/
├── main.js
├── index.html
├── style.css
├── package.json
└── .gitignore
💻 Tecnologias
Electron
Node.js
Express
Google Gemini API
GitHub API
JavaScript
HTML
CSS
👤 Autor

Lord-beep
# 🚀 ReadMeGen

O **ReadMeGen** é uma aplicação que gera automaticamente documentação para projetos públicos do GitHub utilizando a **Google Gemini API**.

## ⚙️ Instalação

Na pasta principal do projeto:

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

Os ficheiros são guardados em:

Documentacao-Gerada/
├── README.md
└── descricao_curta.txt

A pasta é criada automaticamente caso não exista.

📦 Versão portátil / EXE

Também podes utilizar o ReadMeGen através do executável do Windows, sem executar npm start.

Depois de compilares o projeto com o Electron Builder, encontrarás o executável na pasta dist.

Por exemplo:

dist/
└── win-unpacked/
    └── ReadMeGenUI.exe

Para utilizar:

Compila o projeto.
Abre a pasta dist/win-unpacked.
Executa ReadMeGenUI.exe.
O ReadMeGen inicia automaticamente o servidor local.
Introduz o repositório GitHub.
Clica em Gerar Ficheiros de Documentação.

A versão portátil não necessita que abras manualmente o ReadMeGen-Server.

⚠️ A versão portátil continua a precisar de acesso à Internet e de uma chave Gemini configurada no servidor.

🔒 Segurança

A chave da Gemini deve permanecer no .env e nunca deve ser publicada.

O .gitignore impede o envio de ficheiros como:

.env
node_modules/
dist/
*.log
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

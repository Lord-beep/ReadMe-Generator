# 🚀 ReadMeGen

> **Gera documentação automaticamente para projetos públicos do GitHub utilizando a Google Gemini API.**

O **ReadMeGen** é uma aplicação desktop desenvolvida com **Electron** que analisa projetos públicos do GitHub e utiliza a **Google Gemini API** para gerar automaticamente ficheiros de documentação.

---

## ✨ Funcionalidades

* 🤖 Geração automática de documentação com Gemini
* 🐙 Suporte para repositórios públicos do GitHub
* 📄 Geração de `README.md`
* 📝 Geração de uma descrição curta do projeto
* 💻 Interface gráfica com Electron
* ⚡ Arranque automático do servidor local
* 📦 Possibilidade de utilizar uma versão portátil `.exe`
* 🔒 Chave da API protegida através de `.env`

---

## 🛠️ Tecnologias

| Tecnologia                 | Utilização                        |
| -------------------------- | --------------------------------- |
| ⚡ Electron                 | Aplicação desktop                 |
| 🟢 Node.js                 | Ambiente de execução              |
| 🚂 Express                 | Servidor local                    |
| 🤖 Google Gemini API       | Análise e geração da documentação |
| 🐙 GitHub API              | Obtenção dos projetos             |
| 🌐 HTML / CSS / JavaScript | Interface                         |

---

## ⚙️ Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Lord-beep/ReadMeGen.git
cd ReadMeGen
```

### 2. Instalar as dependências

Na pasta principal do projeto:

```bash
npm install
```

Depois instala as dependências do servidor:

```bash
cd ReadMeGen-Server
npm install
cd ..
```

### 3. Configurar a Gemini API

Cria o ficheiro:

```text
ReadMeGen-Server/.env
```

E adiciona a tua chave:

```env
GEMINI_API_KEY=A_TUA_CHAVE
```

> ⚠️ **Importante:** nunca publiques a tua chave da Gemini no GitHub.

---

## ▶️ Executar

Depois de instalar tudo, basta executar:

```bash
npm start
```

O **ReadMeGen** inicia automaticamente o `ReadMeGen-Server`, por isso **não é necessário iniciar o servidor manualmente**.

---

## 📖 Como utilizar

1. Abre o **ReadMeGen**.
2. Introduz o nome de um repositório público do GitHub.

Por exemplo:

```text
Lord-beep/MultiPrint
```

3. Clica em **Gerar Ficheiros de Documentação**.
4. A aplicação obtém o código do GitHub.
5. O Gemini analisa o projeto.
6. A documentação é gerada automaticamente.

Os ficheiros são guardados em:

```text
Documentacao-Gerada/
├── README.md
└── descricao_curta.txt
```

A pasta é criada automaticamente caso ainda não exista.

---

## 📦 Versão portátil / EXE

Também podes utilizar o **ReadMeGen** através do executável do Windows, sem executar `npm start`.

Depois de compilares o projeto com o **Electron Builder**, encontrarás o executável na pasta:

```text
dist/
└── win-unpacked/
    └── ReadMeGenUI.exe
```

### 🚀 Utilizar a versão portátil

1. Compila o projeto.
2. Abre a pasta `dist/win-unpacked`.
3. Executa `ReadMeGenUI.exe`.
4. O ReadMeGen inicia automaticamente o servidor local.
5. Introduz o repositório do GitHub.
6. Clica em **Gerar Ficheiros de Documentação**.

> 💡 Não é necessário iniciar manualmente o `ReadMeGen-Server`.

### ⚠️ Requisitos

A versão portátil continua a necessitar de:

* 🌐 Acesso à Internet
* 🤖 Uma chave da Google Gemini API
* 🔐 Uma configuração válida do servidor

---

## 🔒 Segurança

A chave da Gemini deve permanecer sempre no ficheiro `.env`.

O `.gitignore` do projeto impede o envio de ficheiros sensíveis ou desnecessários, como:

```text
.env
node_modules/
dist/
*.log
```

> 🚨 **Nunca coloques a tua `GEMINI_API_KEY` diretamente no código ou no repositório.**

---

## 📁 Estrutura do projeto

```text
ReadMeGen/
│
├── 📂 ReadMeGen-Server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── 📂 Documentacao-Gerada/
│
├── main.js
├── index.html
├── style.css
├── package.json
└── .gitignore
```

---

## 🧠 Como funciona

```text
┌──────────────────────┐
│      ReadMeGen       │
│       Electron       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     GitHub API       │
│  Obtém o repositório │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Gemini API         │
│ Analisa o projeto    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Documentação gerada  │
│                      │
│ README.md            │
│ descricao_curta.txt  │
└──────────────────────┘
```

---

## 🎯 Exemplo

### Repositório

```text
Lord-beep/MultiPrint
```

### Resultado

```text
Documentacao-Gerada/
├── README.md
└── descricao_curta.txt
```

O conteúdo é gerado automaticamente com base no projeto analisado.

---

## 👤 Autor

**Lord-beep**

---

## ⭐ Gostaste do projeto?

Se este projeto te foi útil, considera deixar uma ⭐ no GitHub!

---

<p align="center">
  🚀 <strong>ReadMeGen</strong> — Documentação gerada automaticamente com IA.
</p>

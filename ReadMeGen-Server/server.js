import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

if (!process.env.GEMINI_API_KEY) {
    console.error('❌ ERRO: GEMINI_API_KEY não encontrada.');
    console.error('Cria um ficheiro .env dentro de ReadMeGen-Server.');
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get('/', (req, res) => {
    res.send('✅ ReadMeGen Server está online e a funcionar!');
});

app.get('/status', (req, res) => {
    res.json({
        online: true,
        service: 'ReadMeGen Server',
        port: PORT
    });
});

app.post('/gerar', async (req, res) => {
    try {
        console.log('');
        console.log('📥 Novo pedido recebido');

        const { codigo } = req.body;

        if (!codigo) {
            return res.status(400).json({
                sucesso: false,
                error: 'Código do projeto não foi enviado.'
            });
        }

        console.log(`📦 Código recebido: ${codigo.length} caracteres`);

        const MAX_CODIGO = 150000;
        const codigoAnalise = codigo.length > MAX_CODIGO
            ? codigo.substring(0, MAX_CODIGO)
            : codigo;
            
    const prompt = `
    És um especialista profissional em documentação de software, GitHub e escrita técnica.

    A tua tarefa é analisar EXCLUSIVAMENTE o código fonte do projeto fornecido e criar uma documentação README.md moderna, profissional, visualmente organizada e adequada para publicação no GitHub.

    Escreve SEMPRE em PORTUGUÊS DE PORTUGAL.

    ==================================================
    REGRAS FUNDAMENTAIS
    ==================================================

    1. Analisa primeiro o código e identifica:
    - Nome do projeto, quando for possível determinar.
    - Objetivo do projeto.
    - Funcionalidades realmente existentes.
    - Tecnologias utilizadas.
    - Dependências.
    - Forma de instalação.
    - Forma de execução.
    - Estrutura de ficheiros.
    - Configurações necessárias.
    - Variáveis de ambiente.
    - APIs ou serviços externos utilizados.
    - Requisitos do sistema.
    - Autor, apenas se estiver explicitamente presente no código ou ficheiros fornecidos.

    2. NÃO INVENTES:
    - Funcionalidades.
    - Comandos.
    - Ficheiros.
    - Tecnologias.
    - APIs.
    - Variáveis de ambiente.
    - Autores.
    - Licenças.
    - Badges.
    - Screenshots.
    - Links.
    - Informações que não possam ser confirmadas através do código.

    3. Se uma informação não puder ser confirmada, simplesmente não a incluas.

    4. O README deve ser escrito em Markdown válido.

    5. Não coloques as tags [DESCRICAO_CURTA], [/DESCRICAO_CURTA],
    [README_MARKDOWN] ou [/README_MARKDOWN] dentro do README.

    6. Não escrevas nenhuma explicação antes ou depois das tags.

    7. Não uses frases como:
    "Com base no código fornecido..."
    "Segundo a análise..."
    "Não foi possível determinar..."
    O README deve parecer escrito diretamente para o utilizador do projeto.

    ==================================================
    DESCRIÇÃO CURTA
    ==================================================

    Cria uma descrição comercial curta.

    Regras:
    - Máximo de 3 frases.
    - Profissional.
    - Clara.
    - Natural.
    - Adequada para GitHub e portfólio.
    - Explica rapidamente o que o projeto faz.
    - Não inventa funcionalidades.

    ==================================================
    README.md
    ==================================================

    Cria um README moderno e profissional.

    A estrutura deve seguir esta ordem, MAS apenas inclui secções que sejam relevantes para o projeto:

    # 🚀 Nome do Projeto

    Uma descrição curta e clara do projeto.

    ---

    ## ✨ Funcionalidades

    Lista as principais funcionalidades reais do projeto.

    Usa emojis moderadamente para tornar o README visualmente agradável.

    Exemplo:

    - 🤖 Funcionalidade X
    - 📄 Funcionalidade Y
    - ⚡ Funcionalidade Z

    ---

    ## 🛠️ Tecnologias

    Apresenta as tecnologias realmente utilizadas.

    Quando fizer sentido, utiliza uma tabela:

    | Tecnologia | Utilização |
    |---|---|
    | Node.js | Backend |
    | Express | Servidor |
    | ... | ... |

    Não inventes tecnologias.

    ---

    ## ⚙️ Instalação

    Explica passo a passo como instalar o projeto.

    Usa blocos de código Markdown para comandos.

    Exemplo:

    \`\`\`bash
    npm install
    \`\`\`

    Se existirem variáveis de ambiente, explica como configurá-las.

    ---

    ## ▶️ Execução

    Explica como iniciar o projeto.

    Inclui os comandos reais encontrados no projeto.

    ---

    ## 📖 Como utilizar

    Explica de forma simples como utilizar a aplicação.

    Se for uma aplicação gráfica, explica os passos principais.

    Se for uma API, apresenta os endpoints relevantes.

    Se existirem exemplos reais no código, podes utilizá-los.

    ---

    ## 📁 Estrutura do projeto

    Mostra a estrutura relevante do projeto num bloco de código.

    Exemplo:

    \`\`\`text
    Projeto/
    ├── src/
    │   ├── ...
    │   └── ...
    ├── package.json
    └── README.md
    \`\`\`

    Não inventes ficheiros ou pastas.

    ---

    ## 🧠 Como funciona

    Quando for possível perceber através do código, explica resumidamente o funcionamento interno.

    Podes utilizar um pequeno diagrama ASCII se isso ajudar a compreensão.

    Exemplo:

    \`\`\`text
    Utilizador
        │
        ▼
    Aplicação
        │
        ▼
    Servidor
        │
        ▼
    API
        │
        ▼
    Resultado
    \`\`\`

    Só utiliza este tipo de diagrama quando representar corretamente o funcionamento real.

    ---

    ## 🔒 Segurança

    Inclui esta secção apenas quando existirem aspetos relevantes, como:
    - API keys
    - ficheiros .env
    - autenticação
    - tokens
    - credenciais
    - dados sensíveis

    Nunca reveles valores reais de chaves ou credenciais.

    ---

    ## 📦 Versão portátil / Build

    Inclui esta secção apenas se o código indicar claramente que existe Electron Builder, executável, build ou distribuição portátil.

    Explica os comandos reais necessários.

    ---

    ## 👤 Autor

    Inclui apenas se o autor puder ser identificado com segurança através do código ou informações fornecidas.

    ---

    ## ⭐ Projeto

    Se for apropriado, termina com uma pequena mensagem convidando o utilizador a dar uma estrela ao projeto.

    Não inventes links.

    ==================================================
    ESTILO
    ==================================================

    O README deve parecer um README de um projeto profissional do GitHub.

    Utiliza:

    - Títulos claros.
    - Emojis com moderação.
    - Separadores "---" quando melhorarem a organização.
    - Listas.
    - Tabelas quando forem úteis.
    - Blocos de código.
    - Estrutura visual limpa.
    - Frases curtas e fáceis de ler.
    - Português de Portugal.

    Evita:

    - Texto excessivamente longo.
    - Repetições.
    - Parágrafos gigantes.
    - Emojis em todas as frases.
    - Informação especulativa.
    - Secções vazias.
    - Comentários sobre o processo de geração.

    ==================================================
    FORMATO DA RESPOSTA
    ==================================================

    Responde EXATAMENTE neste formato:

    [DESCRICAO_CURTA]
    Descrição comercial curta do projeto.
    [/DESCRICAO_CURTA]

    [README_MARKDOWN]
    # 🚀 Nome do Projeto

    README completo em Markdown.
    [/README_MARKDOWN]

    Não escrevas absolutamente nada fora destas duas secções.

    ==================================================
    CÓDIGO DO PROJETO
    ==================================================

    ${codigoAnalise}

    ==================================================
    FIM DO CÓDIGO
    ==================================================
    `;

        let resposta = null;
        const MAX_TENTATIVAS = 3;

        for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
            try {
                console.log(`🤖 Tentativa ${tentativa}/${MAX_TENTATIVAS}...`);

                resposta = await ai.models.generateContent({
                    model: 'gemini-3.6-flash',
                    contents: prompt
                });

                break;
            } catch (erro) {
                console.error(`❌ Tentativa ${tentativa} falhou:`, erro?.message || erro);

                const mensagem = erro?.message || JSON.stringify(erro);

                const servidorOcupado =
                    mensagem.includes('503') ||
                    mensagem.includes('UNAVAILABLE') ||
                    mensagem.includes('high demand') ||
                    mensagem.includes('overloaded');

                if (servidorOcupado) {
                    if (tentativa < MAX_TENTATIVAS) {
                        console.log('⏳ Gemini ocupado. A aguardar 5 segundos...');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        continue;
                    }

                    throw new Error(
                        'O Gemini está temporariamente indisponível devido a elevada procura. Tente novamente dentro de alguns segundos.'
                    );
                }

                throw erro;
            }
        }

        if (!resposta) {
            throw new Error('O Gemini não devolveu nenhuma resposta.');
        }

        const texto = resposta.text || '';

        if (!texto.trim()) {
            throw new Error('O Gemini devolveu uma resposta vazia.');
        }

        console.log('✅ Documentação gerada com sucesso.');

        res.json({
            sucesso: true,
            resultado: texto
        });

    } catch (erro) {
        console.error('❌ ERRO:', erro?.message || erro);

        res.status(500).json({
            sucesso: false,
            error: erro?.message || 'Erro desconhecido ao comunicar com o Gemini.'
        });
    }
});

app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        error: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
});

app.listen(PORT, () => {
    console.log('');
    console.log('======================================');
    console.log('🚀 ReadMeGen Server iniciado');
    console.log('======================================');
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`🔗 Endpoint: http://localhost:${PORT}/gerar`);
    console.log(`📊 Status: http://localhost:${PORT}/status`);
    console.log('======================================');
});
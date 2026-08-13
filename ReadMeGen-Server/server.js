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
És um especialista em documentação de software.

Analisa o código fonte do projeto abaixo.

Escreve tudo em PORTUGUÊS DE PORTUGAL.

Cria duas coisas:

1. Uma descrição curta comercial do projeto.
- Máximo 3 frases.
- Clara e profissional.
- Adequada para apresentar o projeto num portfólio.

2. Um README.md profissional e relativamente resumido.

O README deve conter, quando aplicável:
- Nome do projeto
- Descrição
- Principais funcionalidades
- Requisitos
- Instalação
- Como utilizar
- Estrutura do projeto
- Tecnologias utilizadas

REGRAS:
- Não inventes funcionalidades.
- Baseia-te apenas no código fornecido.
- Não incluas explicações fora das tags.
- Não coloques as tags dentro de blocos de código.
- O README deve estar em Markdown.
- Utiliza português de Portugal.

Responde EXATAMENTE neste formato:

[DESCRICAO_CURTA]
Escreve aqui a descrição curta.
[/DESCRICAO_CURTA]

[README_MARKDOWN]
Escreve aqui o README completo em Markdown.
[/README_MARKDOWN]

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
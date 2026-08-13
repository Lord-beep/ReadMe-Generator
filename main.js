import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pastaExecucaoReal = app.isPackaged
    ? path.dirname(process.execPath)
    : process.cwd();

let servidorProcesso = null;

function iniciarServidor() {
    const pastaServidor = app.isPackaged
        ? path.join(process.resourcesPath, 'ReadMeGen-Server')
        : path.join(__dirname, 'ReadMeGen-Server');

    const caminhoServidor = path.join(pastaServidor, 'server.js');

    if (!fs.existsSync(caminhoServidor)) {
        console.error('❌ server.js não encontrado:', caminhoServidor);
        return;
    }

    console.log('🚀 A iniciar ReadMeGen-Server...');

    servidorProcesso = spawn(process.execPath, [caminhoServidor], {
        cwd: pastaServidor,
        env: {
            ...process.env,
            ELECTRON_RUN_AS_NODE: '1'
        },
        windowsHide: true
    });

    servidorProcesso.stdout.on('data', data => {
        console.log(`[SERVER] ${data.toString().trim()}`);
    });

    servidorProcesso.stderr.on('data', data => {
        console.error(`[SERVER] ${data.toString().trim()}`);
    });

    servidorProcesso.on('error', erro => {
        console.error('❌ Erro ao iniciar servidor:', erro);
    });

    servidorProcesso.on('exit', codigo => {
        console.log(`Servidor terminado. Código: ${codigo}`);
        servidorProcesso = null;
    });
}

async function esperarServidor() {
    for (let tentativa = 1; tentativa <= 20; tentativa++) {
        try {
            const resposta = await fetch('http://localhost:3000/status');

            if (resposta.ok) {
                console.log('✅ ReadMeGen-Server está online.');
                return true;
            }
        } catch {}

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.error('❌ O ReadMeGen-Server não respondeu.');
    return false;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('executar-geracao', async (event, { repoPath }) => {
    let contextoCodigo = '';

    const headersSeguros = {
        'User-Agent': 'ReadMeGen/1.0',
        'Accept': 'application/vnd.github+json'
    };

    try {
        console.log(`GitHub: https://api.github.com/repos/${repoPath}`);

        const repoRes = await fetch(
            `https://api.github.com/repos/${repoPath}`,
            { headers: headersSeguros }
        );

        if (!repoRes.ok) {
            if (repoRes.status === 404) {
                throw new Error('Repositório GitHub não encontrado ou privado.');
            }

            throw new Error(`Erro GitHub API (${repoRes.status}).`);
        }

        const repoData = await repoRes.json();
        const defaultBranch = repoData.default_branch;

        console.log(`Branch principal: ${defaultBranch}`);

        const treeUrl =
            `https://api.github.com/repos/${repoPath}/git/trees/${encodeURIComponent(defaultBranch)}?recursive=1`;

        const treeRes = await fetch(treeUrl, {
            headers: headersSeguros
        });

        if (!treeRes.ok) {
            throw new Error('Não foi possível obter os ficheiros do repositório.');
        }

        const treeData = await treeRes.json();

        if (!treeData.tree) {
            throw new Error('O GitHub não devolveu a árvore de ficheiros.');
        }

        const IGNORE_LIST = [
            'node_modules',
            '.git',
            '.env',
            'package-lock.json',
            'README.md',
            'dist',
            'build',
            'descricao_curta.txt'
        ];

        const ALLOWED_EXTENSIONS = [
            '.js', '.json', '.html', '.css', '.py', '.ts',
            '.tsx', '.jsx', '.go', '.java', '.cpp', '.c',
            '.cs', '.php', '.rb', '.vue', '.sql', '.xml',
            '.yml', '.yaml'
        ];

        for (const file of treeData.tree) {
            if (file.type !== 'blob') continue;

            const nomeFicheiro = path.basename(file.path);

            if (IGNORE_LIST.includes(nomeFicheiro)) continue;

            const extensao = path.extname(file.path).toLowerCase();

            if (!ALLOWED_EXTENSIONS.includes(extensao)) continue;

            const rawUrl =
                `https://raw.githubusercontent.com/${repoPath}/${encodeURIComponent(defaultBranch)}/${file.path
                    .split('/')
                    .map(segment => encodeURIComponent(segment))
                    .join('/')}`;

            try {
                const fileRes = await fetch(rawUrl, {
                    headers: {
                        'User-Agent': 'ReadMeGen/1.0'
                    }
                });

                if (!fileRes.ok) continue;

                const conteudo = await fileRes.text();

                contextoCodigo +=
                    `\n\n--- FICHEIRO: ${file.path} ---\n${conteudo}`;
            } catch {
                console.warn(`Não foi possível ler: ${file.path}`);
            }
        }

        if (!contextoCodigo.trim()) {
            throw new Error(
                'O repositório não contém ficheiros de código suportados.'
            );
        }

        console.log(
            `Código obtido: ${contextoCodigo.length} caracteres`
        );

        return contextoCodigo;
    } catch (error) {
        console.error('Erro GitHub:', error);

        const detalhe = error?.cause
            ? ` (${error.cause.message || error.cause})`
            : '';

        throw new Error(`${error.message}${detalhe}`);
    }
});

    ipcMain.handle(
        'gravar-resultados',
        async (event, { readme, staticDesc }) => {
            try {
                const pastaDocumentacao = path.join(
                    pastaExecucaoReal,
                    'Documentacao-Gerada'
                );

                if (!fs.existsSync(pastaDocumentacao)) {
                    fs.mkdirSync(pastaDocumentacao, {
                        recursive: true
                    });
                }

                if (readme) {
                    fs.writeFileSync(
                        path.join(pastaDocumentacao, 'README.md'),
                        readme,
                        'utf-8'
                    );
                }

                if (staticDesc) {
                    fs.writeFileSync(
                        path.join(pastaDocumentacao, 'descricao_curta.txt'),
                        staticDesc,
                        'utf-8'
                    );
                }

                console.log(
                    '✅ Ficheiros gravados em:',
                    pastaDocumentacao
                );

                return true;
            } catch (error) {
                console.error('Erro ao gravar:', error);

                throw new Error(
                    `Não foi possível gravar os ficheiros: ${error.message}`
                );
            }
        }
    );

app.whenReady().then(async () => {
    iniciarServidor();
    await esperarServidor();
    createWindow();
});

app.on('before-quit', () => {
    if (servidorProcesso) {
        console.log('🛑 A fechar ReadMeGen-Server...');
        servidorProcesso.kill();
        servidorProcesso = null;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
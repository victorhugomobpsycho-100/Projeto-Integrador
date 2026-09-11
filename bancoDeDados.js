// bancoDeDados.js
//
// Este arquivo é o único lugar do projeto que "sabe" SQL.
// Vocês não precisam entender cada linha por enquanto — pensem nele
// como uma caixinha com duas alavancas: SALVAR e LISTAR.
//
// Quem usa este arquivo (o server.js) só chama as funções abaixo,
// sem escrever nenhum SQL.
//
// IMPORTANTE: aqui estamos usando o pacote "sqlite3" (não o
// "better-sqlite3"). A diferença que mais importa pra vocês é que
// o "sqlite3" é ASSÍNCRONO: cada operação no banco não termina na
// hora, ela termina "depois", e a gente é avisado quando terminar.
//
// Para não espalhar callback aninhado pelo projeto todo, embrulhamos
// cada operação numa Promise. Na prática, isso significa que quem
// for usar salvarUsuario() e listarUsuarios() no server.js vai
// precisar usar "await" na frente da chamada (ou ".then()").

const sqlite3 = require("sqlite3").verbose();

// Isso cria (ou abre, se já existir) um arquivo chamado "dados.sqlite"
// na mesma pasta do projeto. Todo o banco de dados fica dentro desse
// único arquivo — não precisa instalar nem configurar nenhum servidor
// de banco de dados separado.
const db = new sqlite3.Database("dados.sqlite");

// Criamos a tabela "usuarios" caso ela ainda não exista.
// Isso roda automaticamente toda vez que o servidor liga.
// db.run() também é assíncrono, mas como isso acontece só uma vez,
// ao ligar o servidor, não precisamos esperar por ele em Promise.
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        idade INTEGER NOT NULL,
        criadoEm TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Função para salvar um novo usuário no banco.
// Recebe os três dados já prontos e devolve (numa Promise) o registro criado.
//
// db.run() não devolve o resultado como "return" normal — ele avisa
// através de uma função de callback quando termina. Por isso embrulhamos
// tudo numa "new Promise(...)": assim quem chamar salvarUsuario()
// pode simplesmente usar "await salvarUsuario(...)" e esperar o
// resultado, como se fosse uma função síncrona comum.
function salvarUsuario(nome, email, idade) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)";

        // Atenção: aqui usamos "function" (e não uma arrow function "=>")
        // de propósito. É só dentro de uma function "tradicional" como essa
        // que o sqlite3 nos dá acesso a "this.lastID", que é o id que o
        // banco acabou de gerar automaticamente para a nova linha.
        db.run(sql, [nome, email, idade], function (erro) {
            if (erro) {
                // Se algo deu errado (ex.: banco travado, SQL inválido),
                // rejeitamos a Promise para quem chamou poder tratar o erro.
                reject(erro);
                return;
            }

            resolve({
                id: this.lastID,
                nome,
                email,
                idade
            });
        });
    });
}

// Função para listar todos os usuários já cadastrados,
// dos mais recentes para os mais antigos.
function listarUsuarios() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM usuarios ORDER BY id DESC";

        db.all(sql, [], (erro, linhas) => {
            if (erro) {
                reject(erro);
                return;
            }

            resolve(linhas);
        });
    });
}

// Exportamos as duas funções para que o server.js possa usá-las.
module.exports = {
    salvarUsuario,
    listarUsuarios
};
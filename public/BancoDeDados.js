const Database = require("better-sqlite3");
// Abre (ou cria) o arquivo dados.sqlite na pasta do projeto
const db = new Database("dados.sqlite");
// Cria a tabela "usuarios" se ela ainda não existir
db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
email TEXT NOT NULL,
idade INTEGER NOT NULL,
criadoEm TEXT DEFAULT CURRENT_TIMESTAMP
)
`);
// Salva um novo usuário e devolve o registro criado
function salvarUsuario(nome, email, idade) {
const comando = db.prepare(
"INSERT INTO usuarios (nome, email, idade) VALUES (?, ?, ?)"
);
const resultado = comando.run(nome, email, idade);
return { id: resultado.lastInsertRowid, nome, email, idade };
}
// Retorna todos os usuários cadastrados, do mais novo pro mais antigo
function listarUsuarios() {
const comando = db.prepare("SELECT * FROM usuarios ORDER BY id DESC");
return comando.all();
}
module.exports = { salvarUsuario, listarUsuarios };
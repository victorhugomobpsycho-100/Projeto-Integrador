// server.js
//
// Este é o nosso servidor. Ele fica "escutando" numa porta do
// computador, esperando que o navegador faça pedidos (requisições).
//
// Repare que é o MESMO JavaScript que vocês já usaram no Node:
// variáveis, funções, if/else. A única novidade aqui é o Express,
// uma ferramenta que nos dá o "esqueleto" pronto de um servidor web.

const express = require("express");
const { salvarUsuario, listarUsuarios } = require("./bancoDeDados");

const app = express();
const PORTA = 3000;

// Middleware: permite que o servidor entenda JSON enviado pelo front-end
app.use(express.json());

// Middleware: serve os arquivos da pasta "public" diretamente.
// Ou seja, o index.html, script.js e style.css ficam acessíveis
// no navegador sem precisarmos criar uma rota manual para cada um.
app.use(express.static("public"));

// ROTA 1: receber o cadastro vindo do formulário
// O front-end vai chamar isso com fetch(..., { method: "POST" })
//
// Reparem na palavra "async" antes de (req, res). Ela é necessária
// porque, lá dentro, usamos "await salvarUsuario(...)": salvarUsuario
// agora mexe no banco de forma assíncrona (não é mais instantâneo),
// então pedimos pro servidor "esperar" o banco responder antes de
// continuar para a linha de baixo.
app.post("/cadastrar", async (req, res) => {
    const { nome, email, idade } = req.body;

    // Validação simples no servidor (além da validação que já
    // fazemos no front-end com alert)
    if (!nome || !email || !idade) {
        return res.status(400).json({
            erro: "Preencha nome, email e idade."
        });
    }

    // O "try/catch" aqui serve para pegar erros que possam acontecer
    // ao salvar no banco (ex.: arquivo do banco sem permissão de
    // escrita) e responder com um erro 500 ao invés de derrubar o
    // servidor inteiro.
    try {
        const novoUsuario = await salvarUsuario(nome, email, Number(idade));

        // 201 = "Created" -> conseguimos criar o recurso com sucesso
        res.status(201).json(novoUsuario);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível salvar o usuário." });
    }
});

// ROTA 2: listar todos os usuários cadastrados até agora
// O front-end da página de listagem vai chamar isso com fetch(...)
app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.json(usuarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível listar os usuários." });
    }
});

// Liga o servidor e mantém ele "escutando" a porta 3000
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
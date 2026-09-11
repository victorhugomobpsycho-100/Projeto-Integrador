const corpoTabela = document.getElementById("corpoTabela");
// fetch sem "method" faz uma requisição GET automaticamente
fetch("/usuarios")
.then(function (resposta) { return resposta.json(); })
.then(function (usuarios) {
usuarios.forEach(function (usuario) {
const linha = document.createElement("tr");
const celulaNome = document.createElement("td");
celulaNome.textContent = usuario.nome;
const celulaEmail = document.createElement("td");
celulaEmail.textContent = usuario.email;
const celulaIdade = document.createElement("td");
celulaIdade.textContent = usuario.idade;
linha.appendChild(celulaNome);
linha.appendChild(celulaEmail);
linha.appendChild(celulaIdade);
corpoTabela.appendChild(linha);
});
});
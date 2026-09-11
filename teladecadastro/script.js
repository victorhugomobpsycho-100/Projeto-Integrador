// Espera o carregamento completo do HTML antes de rodar o script
document.addEventListener('DOMContentLoaded', function () {

  // Pega o formulário pelo id definido no HTML
  const form = document.getElementById('signup-form');

  // Pega o campo de data de nascimento
  const birthDateInput = document.getElementById('birth-date');

  // Pega o campo de senha
  const passwordInput = document.getElementById('password');

  // Pega o campo de confirmar senha
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Pega o campo de e-mail
  const emailInput = document.getElementById('email');

  // Pega o campo de gênero (select)
  const genderInput = document.getElementById('gender');

  // Pega o campo de primeiro nome
  const firstNameInput = document.getElementById('first-name');

  // Pega o campo de último nome
  const lastNameInput = document.getElementById('last-name');

  // Cria e insere uma mensagem de erro logo abaixo de um campo específico
  function ensureErrorSpan(input) {
    // Verifica se já existe uma mensagem de erro criada para esse campo
    let span = input.parentElement.querySelector('.msg');
    // Se não existir, cria uma nova
    if (!span) {
      span = document.createElement('span');        // cria o elemento <span>
      span.className = 'msg';                        // adiciona a classe usada para estilizar
      span.style.fontSize = '11.5px';                 // define o tamanho da fonte da mensagem
      span.style.color = '#c0392b';                   // define a cor vermelha da mensagem de erro
      span.style.minHeight = '14px';                  // reserva um espaço mesmo sem texto
      span.style.display = 'block';                   // faz a mensagem ocupar a linha toda
      input.parentElement.appendChild(span);          // insere a mensagem dentro do .field, após o input
    }
    // Retorna a mensagem de erro (nova ou já existente)
    return span;
  }

  // Marca ou desmarca um campo como inválido, mostrando ou limpando a mensagem
  function setError(input, message) {
    const span = ensureErrorSpan(input);              // garante que a mensagem exista
    if (message) {                                    // se houver texto de erro
      input.style.borderColor = '#c0392b';             // deixa a borda do campo vermelha
      span.textContent = message;                      // escreve a mensagem de erro
    } else {                                          // se não houver erro
      input.style.borderColor = '#c9c3b0';             // volta a borda para a cor normal
      span.textContent = '';                            // limpa a mensagem
    }
  }

  // Aplica a máscara dd/mm/aaaa enquanto o usuário digita a data
  birthDateInput.addEventListener('input', function () {
    let v = birthDateInput.value.replace(/\D/g, '');   // remove tudo que não for número
    v = v.slice(0, 8);                                  // limita a 8 dígitos (ddmmaaaa)
    if (v.length >= 5) {                                // se já tiver dia, mês e parte do ano
      v = v.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3'); // insere as barras dd/mm/aaaa
    } else if (v.length >= 3) {                         // se já tiver só dia e parte do mês
      v = v.replace(/(\d{2})(\d{0,2})/, '$1/$2');        // insere a barra dd/mm
    }
    birthDateInput.value = v;                           // atualiza o valor exibido no campo
  });

  // Verifica se uma string no formato dd/mm/aaaa é uma data real e válida
  function isValidDate(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value); // testa o formato exato
    if (!match) return false;                            // se não bater com o formato, é inválida
    const day = Number(match[1]);                         // extrai o dia como número
    const month = Number(match[2]);                        // extrai o mês como número
    const year = Number(match[3]);                          // extrai o ano como número
    const date = new Date(year, month - 1, day);            // cria um objeto Date real
    // Confere se o Date criado bate com os números digitados (evita datas tipo 31/02)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  // Verifica se um e-mail tem um formato básico válido
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);        // padrão simples: algo@algo.algo
  }

  // Escuta o envio do formulário
  form.addEventListener('submit', function (event) {
    event.preventDefault();                                // impede o recarregamento da página

    let isValid = true;                                    // assume que está tudo certo até achar erro

    // Valida o primeiro nome
    if (!firstNameInput.value.trim()) {                    // se estiver vazio (só espaços também conta)
      setError(firstNameInput, 'Informe o nome.');          // mostra mensagem de erro
      isValid = false;                                       // marca o formulário como inválido
    } else {
      setError(firstNameInput, '');                          // limpa erro se estiver preenchido
    }

    // Valida o último nome
    if (!lastNameInput.value.trim()) {                      // se estiver vazio
      setError(lastNameInput, 'Informe o sobrenome.');        // mostra mensagem de erro
      isValid = false;                                        // marca o formulário como inválido
    } else {
      setError(lastNameInput, '');                            // limpa erro se estiver preenchido
    }

    // Valida a data de nascimento
    const birthValue = birthDateInput.value.trim();          // pega o valor digitado sem espaços
    if (!birthValue) {                                        // se estiver vazio
      setError(birthDateInput, 'Informe a data.');             // mostra mensagem de campo obrigatório
      isValid = false;                                         // marca o formulário como inválido
    } else if (!isValidDate(birthValue)) {                     // se o formato/data não for válido
      setError(birthDateInput, 'Data inválida.');               // mostra mensagem de data inválida
      isValid = false;                                          // marca o formulário como inválido
    } else {
      setError(birthDateInput, '');                              // limpa erro se a data for válida
    }

    // Valida o e-mail
    const emailValue = emailInput.value.trim();                // pega o valor digitado sem espaços
    if (!emailValue) {                                          // se estiver vazio
      setError(emailInput, 'Informe o e-mail.');                 // mostra mensagem de campo obrigatório
      isValid = false;                                           // marca o formulário como inválido
    } else if (!isValidEmail(emailValue)) {                      // se o formato do e-mail for inválido
      setError(emailInput, 'E-mail inválido.');                   // mostra mensagem de e-mail inválido
      isValid = false;                                            // marca o formulário como inválido
    } else {
      setError(emailInput, '');                                    // limpa erro se o e-mail for válido
    }

    // Valida a senha
    if (passwordInput.value.length < 8) {                        // se tiver menos de 8 caracteres
      setError(passwordInput, 'Mínimo de 8 caracteres.');          // mostra mensagem de senha curta
      isValid = false;                                             // marca o formulário como inválido
    } else {
      setError(passwordInput, '');                                  // limpa erro se a senha for válida
    }

    // Valida a confirmação de senha
    if (confirmPasswordInput.value !== passwordInput.value) {      // se as senhas forem diferentes
      setError(confirmPasswordInput, 'As senhas não coincidem.');    // mostra mensagem de senhas diferentes
      isValid = false;                                               // marca o formulário como inválido
    } else if (!confirmPasswordInput.value) {                       // se o campo estiver vazio
      setError(confirmPasswordInput, 'Confirme a senha.');            // mostra mensagem de campo obrigatório
      isValid = false;                                                // marca o formulário como inválido
    } else {
      setError(confirmPasswordInput, '');                              // limpa erro se as senhas coincidirem
    }

    // Valida o gênero selecionado
    if (!genderInput.value) {                                        // se nenhuma opção foi escolhida
      setError(genderInput, 'Selecione uma opção.');                   // mostra mensagem de campo obrigatório
      isValid = false;                                                 // marca o formulário como inválido
    } else {
      setError(genderInput, '');                                        // limpa erro se algo foi selecionado
    }

    // Se tudo estiver válido, simula o sucesso do cadastro
    if (isValid) {
      alert('Conta criada com sucesso!');                              // mostra um aviso simples de sucesso
      form.reset();                                                     // limpa todos os campos do formulário
    }
  });

});
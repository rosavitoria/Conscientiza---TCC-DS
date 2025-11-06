// ===============================
// INICIALIZAÇÃO DO EMAILJS
// ===============================
(function() {
  emailjs.init("oBosbatTsoFKYBz3I"); // Substitua pelo seu user ID do EmailJS (mantenha o mesmo do original)
})();

// ===============================
// FORMULÁRIO DE CONTATO
// ===============================
const formularioContato = document.getElementById("formulario-contato");
const mensagemFormulario = document.getElementById("mensagem-formulario");

formularioContato.addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = formularioContato.nome.value.trim();
  const email = formularioContato.email.value.trim();
  const mensagem = formularioContato.mensagem.value.trim();

  // Verifica campos vazios
  if (!nome || !email || !mensagem) {
    mostrarMensagem("Por favor, preencha todos os campos.", "erro");
    return;
  }

  // Verifica formato do e-mail
  if (!validarEmail(email)) {
    mostrarMensagem("Por favor, insira um e-mail válido.", "erro");
    return;
  }

  // Envio pelo EmailJS
  emailjs.send("service_d3a5qg8", "template_58w8n8r", {
    nome: nome,
    email: email,
    mensagem: mensagem
  })
  .then(() => {
    mostrarMensagem("Mensagem enviada com sucesso! 💚", "sucesso");
    formularioContato.reset();
  })
  .catch(() => {
    mostrarMensagem("Ops! Algo deu errado. Tente novamente mais tarde.", "erro");
  });
});

// ===============================
// BOTÃO VOLTAR AO TOPO
// ===============================
const botaoVoltarTopo = document.getElementById("voltar-topo");

window.addEventListener("scroll", function() {
  if (window.scrollY > 300) {
    botaoVoltarTopo.style.opacity = "1";
    botaoVoltarTopo.style.pointerEvents = "auto";
  } else {
    botaoVoltarTopo.style.opacity = "0";
    botaoVoltarTopo.style.pointerEvents = "none";
  }
});

botaoVoltarTopo.addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ===============================
// FUNÇÕES DE APOIO
// ===============================
function validarEmail(email) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return padrao.test(email);
}

function mostrarMensagem(texto, tipo) {
  mensagemFormulario.style.display = "block";
  mensagemFormulario.textContent = texto;
  mensagemFormulario.className = ""; // Reseta classes

  if (tipo === "sucesso") {
    mensagemFormulario.classList.add("mensagem-sucesso");
  } else {
    mensagemFormulario.classList.add("mensagem-erro");
  }

  // Animação suave de fade-in
  mensagemFormulario.style.animation = "fadeIn 0.5s ease-in";

  // Desaparece após alguns segundos
  setTimeout(() => {
    mensagemFormulario.style.animation = "fadeOut 0.5s ease-out";
    setTimeout(() => {
      mensagemFormulario.style.display = "none";
    }, 500);
  }, 4000);
}

// Adiciona estilos CSS para as mensagens via JS (para suavidade)
const estiloMensagens = document.createElement("style");
estiloMensagens.textContent = `
  .mensagem-sucesso { color: #2a9d8f; font-weight: 600; }
  .mensagem-erro { color: #e63946; font-weight: 600; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
`;
document.head.appendChild(estiloMensagens);

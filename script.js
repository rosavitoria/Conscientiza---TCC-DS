// config emailjs
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "IjCwtseqIbiYBHcg7",
  SERVICE_ID: "rosavitoria",
  USER_EMAIL: "rosavitoriafernandes@outlook.com",
  TEMPLATES: { CONTATO: "template_lqbuncc", AUTO: "template_9iz7aej" }
};

// iniciar emailjs
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// menu mobile
document.querySelector('.mobile-menu').onclick = () => {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('active');
  document.querySelector('.mobile-menu').textContent =
    nav.classList.contains('active') ? '✕' : '☰';
};

// fechar menu ao clicar em link
document.querySelectorAll('.nav-links a').forEach(a =>
  a.onclick = () => {
    document.querySelector('.nav-links').classList.remove('active');
    document.querySelector('.mobile-menu').textContent = '☰';
  }
);

// tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab + "-tab").classList.add('active');
  };
});

// filtro por cidade
document.getElementById('cityFilter')?.addEventListener('change', e => {
  const city = e.target.value;
  document.querySelectorAll('.resource-card').forEach(card => {
    card.style.display = city === 'all' || card.dataset.city === city ? 'flex' : 'none';
  });
});

// validar email
const validarEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// enviar formulario
document.getElementById('contactForm').onsubmit = function (e) {
  e.preventDefault();

  const name = name.value.trim(),
        email = email.value.trim(),
        subject = subject.value,
        message = message.value.trim();

  if (!name || !email || !subject || !message)
    return mostrarMensagem('preencha todos os campos', 'erro');

  if (!validarEmail(email))
    return mostrarMensagem('email invalido', 'erro');

  const btn = this.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = 'enviando...';
  btn.disabled = true;

  const params = {
    nome: name,
    email,
    assunto: subject.options[subject.selectedIndex].text,
    mensagem: message,
    destinatario: EMAILJS_CONFIG.USER_EMAIL,
    reply_to: email
  };

  emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATES.CONTATO, params)
    .then(() => {
      mostrarMensagem('mensagem enviada! 💚', 'sucesso');
      this.reset();
      return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATES.AUTO,
        { nome: name, email, remetente: EMAILJS_CONFIG.USER_EMAIL }
      );
    })
    .catch(() => mostrarMensagem('erro ao enviar. tente novamente.', 'erro'))
    .finally(() => {
      btn.textContent = original;
      btn.disabled = false;
    });
};

// scroll suave
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.onclick = e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  };
});

// animacao de cards
function initCardAnimations() {
  const cards = document.querySelectorAll('.card, .stat-card, .tip-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  });
  cards.forEach(c => obs.observe(c));
}

// contadores animados
function animateCounter(el, target, duration = 2000) {
  const isPercent = el.textContent.includes('%');
  let start = 0;
  const inc = target / (duration / 16);
  const timer = setInterval(() => {
    start += inc;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = isPercent ? Math.floor(start) + '%' : start.toFixed(1);
  }, 16);
}

function initCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const val = parseFloat(el.textContent.replace('%', '').replace(',', '.'));
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(el, val);
        obs.unobserve(el);
      }
    });
    obs.observe(el);
  });
}

// mensagens de feedback
function mostrarMensagem(txt, tipo) {
  let el = document.getElementById('mensagemFormulario');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mensagemFormulario';
    el.style.position = 'fixed';
    el.style.top = '20px';
    el.style.right = '20px';
    el.style.padding = '15px 25px';
    el.style.borderRadius = '8px';
    el.style.zIndex = '9999';
    el.style.fontWeight = '600';
    document.body.appendChild(el);
  }
  el.textContent = txt;
  el.style.display = 'block';
  el.style.background = tipo === 'sucesso'
    ? 'rgba(46,204,113,0.95)'
    : 'rgba(231,76,60,0.95)';

  setTimeout(() => el.style.display = 'none', 3500);
}

// inicializacao
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initCardAnimations();
  document.getElementById('cityFilter')?.dispatchEvent(new Event('change'));
});

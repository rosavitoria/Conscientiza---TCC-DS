// ===============================
// CONFIGURAÇÕES DO EMAILJS - ROSA VITÓRIA
// ===============================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "IjCwtseqIbiYBHcg7",
    SERVICE_ID: "rosavitoria",
    USER_EMAIL: "rosavitoriafernandes@outlook.com",
    TEMPLATES: {
        CONTATO: "template_lqbuncc",
        RESPOSTA_AUTOMATICA: "template_9iz7aej"
    }
};

// ===============================
// INICIALIZAÇÃO DO EMAILJS
// ===============================
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// Menu mobile
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Tabs de informações
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove classe active de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Adiciona classe active ao botão clicado
        button.classList.add('active');
        
        // Mostra o conteúdo correspondente
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Filtro por cidade
document.getElementById('cityFilter').addEventListener('change', function() {
    const selectedCity = this.value;
    const resourceCards = document.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        if (selectedCity === 'all' || card.getAttribute('data-city') === selectedCity) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Formulário de contato CORRIGIDO
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validação básica
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !subject || !message) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validação de email
    if (!validateEmail(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Envio via EmailJS COM CONFIGURAÇÕES CORRETAS
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID, 
        EMAILJS_CONFIG.TEMPLATES.CONTATO, 
        {
            nome: name,
            email: email,
            assunto: subject,
            mensagem: message,
            destinatario: EMAILJS_CONFIG.USER_EMAIL
        }
    )
    .then(() => {
        mostrarMensagem("Mensagem enviada com sucesso! 💚 Entraremos em contato em breve.", "sucesso");
        this.reset();

        // Envio da resposta automática
        return emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID, 
            EMAILJS_CONFIG.TEMPLATES.RESPOSTA_AUTOMATICA, 
            {
                nome: name,
                email: email,
                assunto: subject,
                remetente: EMAILJS_CONFIG.USER_EMAIL
            }
        );
    })
    .then(() => {
        console.log('Email de confirmação enviado com sucesso');
    })
    .catch((error) => {
        console.error('Erro ao enviar:', error);
        mostrarMensagem("Ops! Algo deu errado. Tente novamente mais tarde.", "erro");
    })
    .finally(() => {
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Fechar menu mobile se estiver aberto
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Animações dos gráficos ao entrar na viewport
function animateCharts() {
    const chartFills = document.querySelectorAll('.chart-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0';
                
                setTimeout(() => {
                    fill.style.width = width;
                }, 300);
                
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });
    
    chartFills.forEach(fill => {
        observer.observe(fill);
    });
}

// Contador de estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '%';
        }
    }, 16);
}

// Inicializar contadores quando visíveis
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.textContent.replace('%', '').replace(',', '.'));
                
                if (!element.classList.contains('animated')) {
                    animateCounter(element, target);
                    element.classList.add('animated');
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Efeito de digitação no hero (opcional)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Validação de email no formulário
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    if (email && !validateEmail(email)) {
        this.style.borderColor = 'red';
    } else {
        this.style.borderColor = '#ddd';
    }
});

// Fechar menu ao clicar fora (para mobile)
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Adicionar classe de scroll para header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
});

// ===============================
// BOTÃO VOLTAR AO TOPO
// ===============================
const botaoVoltarTopo = document.getElementById("voltar-topo");

if (botaoVoltarTopo) {
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ===============================
// FUNÇÕES DE APOIO
// ===============================
function validarEmail(email) {
    const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padrao.test(email);
}

function mostrarMensagem(texto, tipo) {
    // Criar elemento de mensagem se não existir
    let mensagemFormulario = document.getElementById('mensagemFormulario');
    if (!mensagemFormulario) {
        mensagemFormulario = document.createElement('div');
        mensagemFormulario.id = 'mensagemFormulario';
        mensagemFormulario.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 5px; z-index: 10000; font-weight: 600; display: none;';
        document.body.appendChild(mensagemFormulario);
    }
    
    mensagemFormulario.style.display = "block";
    mensagemFormulario.textContent = texto;
    mensagemFormulario.className = "";

    if (tipo === "sucesso") {
        mensagemFormulario.classList.add("mensagem-sucesso");
        mensagemFormulario.style.backgroundColor = '#d4edda';
        mensagemFormulario.style.color = '#155724';
        mensagemFormulario.style.border = '1px solid #c3e6cb';
    } else {
        mensagemFormulario.classList.add("mensagem-erro");
        mensagemFormulario.style.backgroundColor = '#f8d7da';
        mensagemFormulario.style.color = '#721c24';
        mensagemFormulario.style.border = '1px solid #f5c6cb';
    }

    mensagemFormulario.style.animation = "fadeIn 0.5s ease-in";

    setTimeout(() => {
        mensagemFormulario.style.animation = "fadeOut 0.5s ease-out";
        setTimeout(() => {
            mensagemFormulario.style.display = "none";
        }, 500);
    }, 4000);
}

// ===============================
// CSS INJETADO VIA JS
// ===============================
const estiloMensagens = document.createElement("style");
estiloMensagens.textContent = `
    .mensagem-sucesso { color: #2a9d8f; font-weight: 600; }
    .mensagem-erro { color: #e63946; font-weight: 600; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
`;
document.head.appendChild(estiloMensagens);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    animateCharts();
    initCounters();
    
    // Adicionar classe active ao primeiro item de cada seção
    const firstTabContent = document.querySelector('.tab-content');
    if (firstTabContent) {
        firstTabContent.classList.add('active');
    }
    
    // Ativar efeito de digitação se necessário
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText);
    }
});
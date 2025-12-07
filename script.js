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

// menu mobile - toggle simples para mostrar/esconder navegação
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
    this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
});

// fechar menu mobile ao clicar em link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.mobile-menu').textContent = '☰';
    });
});

// sistema de tabs - alternância entre conteúdos sem recarregar página
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // remove classe active de todos os botões e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // adiciona classe active ao botão clicado
        button.classList.add('active');
        
        // mostra o conteúdo correspondente baseado no data-attribute
        const tabId = button.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// filtro por cidade - mostra/oculta cards baseado na seleção
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

// formulário de contato com emailjs - validação e envio assíncrono
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // validação básica dos campos obrigatórios
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !subject || !message) {
        mostrarMensagem('por favor, preencha todos os campos obrigatórios.', 'erro');
        return;
    }
    
    // validação de email com regex
    if (!validarEmail(email)) {
        mostrarMensagem('por favor, insira um email válido.', 'erro');
        return;
    }
    
    // estado de loading no botão de envio
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'enviando...';
    submitBtn.disabled = true;
    
    // preparação dos dados para envio
    const templateParams = {
        nome: name,
        email: email,
        assunto: document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text,
        mensagem: message,
        destinatario: EMAILJS_CONFIG.USER_EMAIL,
        reply_to: email
    };
    
    // primeiro envio: mensagem para o administrador
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID, 
        EMAILJS_CONFIG.TEMPLATES.CONTATO, 
        templateParams
    )
    .then((response) => {
        console.log('email para admin enviado:', response.status, response.text);
        mostrarMensagem('mensagem enviada com sucesso! 💚 entraremos em contato em breve.', 'sucesso');
        this.reset();

        // segundo envio: resposta automática para o usuário
        const autoReplyParams = {
            nome: name,
            email: email,
            assunto: document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text,
            remetente: EMAILJS_CONFIG.USER_EMAIL
        };
        
        return emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID, 
            EMAILJS_CONFIG.TEMPLATES.RESPOSTA_AUTOMATICA, 
            autoReplyParams
        );
    })
    .then((response) => {
        console.log('email de confirmação enviado:', response.status, response.text);
    })
    .catch((error) => {
        console.error('erro ao enviar email:', error);
        mostrarMensagem('ops! algo deu errado. tente novamente mais tarde.', 'erro');
    })
    .finally(() => {
        // restaurar estado normal do botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// scroll suave para âncoras internas - melhor experiência de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // fechar menu mobile se estiver aberto
            const navLinks = document.querySelector('.nav-links');
            const mobileMenu = document.querySelector('.mobile-menu');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.textContent = '☰';
            }
        }
    });
});

// ===============================
// ANIMAÇÃO DOS GRÁFICOS - CORRIGIDA
// ===============================
function animateCharts() {
    const chartFills = document.querySelectorAll('.chart-fill');
    
    if (!chartFills.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                
                // SALVAR a largura original ANTES de mudar para 0
                const originalWidth = fill.style.width || fill.getAttribute('data-width') || '0%';
                
                // Reset para animação
                fill.style.width = '0';
                fill.style.transition = 'none'; // Remove transição inicial
                
                // Pequeno delay para trigger da animação
                setTimeout(() => {
                    fill.style.transition = 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    fill.style.width = originalWidth;
                    
                    // Adicionar classe para evitar reanimação
                    fill.classList.add('animated');
                }, 50);
                
                observer.unobserve(fill);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    chartFills.forEach(fill => {
        // Adicionar data-width se não existir (como fallback)
        if (!fill.getAttribute('data-width') && fill.style.width) {
            fill.setAttribute('data-width', fill.style.width);
        }
        observer.observe(fill);
    });
}

// ===============================
// SOLUÇÃO ALTERNATIVA PARA GRÁFICOS
// ===============================
function forceChartAnimation() {
    const chartFills = document.querySelectorAll('.chart-fill:not(.animated)');
    
    chartFills.forEach(fill => {
        // Salvar largura atual
        const currentWidth = fill.style.width;
        
        // Animar de 0 para a largura atual
        fill.style.width = '0';
        fill.style.transition = 'none';
        
        // Trigger reflow
        fill.offsetHeight;
        
        // Aplicar animação
        setTimeout(() => {
            fill.style.transition = 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            fill.style.width = currentWidth;
            fill.classList.add('animated');
        }, 50);
    });
}

// contadores animados para estatísticas - efeito de contagem
function animateCounter(element, target, duration = 2000) {
    const isPercent = element.textContent.includes('%');
    const currentValue = parseFloat(element.textContent.replace('%', '').replace(',', '.'));
    let start = 0;
    const increment = target / (duration / 16);
    const startTime = Date.now();
    
    const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easing function para animação mais natural
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);
        
        element.textContent = isPercent ? current + '%' : current.toFixed(1);
        
        if (progress >= 1) {
            clearInterval(timer);
            element.textContent = isPercent ? target + '%' : target.toFixed(1);
        }
    }, 16);
}

// inicializar contadores quando se tornarem visíveis
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent.trim();
                
                // extrair valor numérico (remove % e converte vírgula para ponto)
                const numericValue = parseFloat(text.replace('%', '').replace(',', '.'));
                
                if (!isNaN(numericValue) && !element.classList.contains('animated')) {
                    animateCounter(element, numericValue);
                    element.classList.add('animated');
                }
                
                observer.unobserve(element);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// efeito de digitação no título hero (opcional)
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

// validação de email com regex pattern
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// validação em tempo real do campo email
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validarEmail(email)) {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.1)';
    } else {
        this.style.borderColor = '#ddd';
        this.style.boxShadow = 'none';
    }
});

// fechar menu mobile ao clicar fora dele
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenu.textContent = '☰';
    }
});

// efeito de scroll no header - sombra dinâmica
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
        header.style.backdropFilter = 'none';
    }
});

// ===============================
// BOTÃO TOGGLE RECURSOS
// ===============================
const btnToggleRecursos = document.getElementById("toggleRecursos");
const secaoRecursos = document.getElementById("recursos");
let recursosAberto = false;

if (btnToggleRecursos && secaoRecursos) {
    btnToggleRecursos.addEventListener("click", () => {
        recursosAberto = !recursosAberto;
        
        if (recursosAberto) {
            // mostrar com animação
            secaoRecursos.style.display = "block";
            secaoRecursos.classList.add("open");
            btnToggleRecursos.textContent = "Ocultar Recursos e Apoio";
            
            // scroll suave para a seção
            setTimeout(() => {
                secaoRecursos.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }, 300);
        } else {
            // ocultar com animação
            secaoRecursos.classList.remove("open");
            btnToggleRecursos.textContent = "Mostrar Recursos e Apoio";
            
            // esperar animação para esconder completamente
            setTimeout(() => {
                if (!secaoRecursos.classList.contains("open")) {
                    secaoRecursos.style.display = "none";
                }
            }, 500);
        }
    });
}

// ===============================
// FUNÇÕES DE APOIO
// ===============================
function mostrarMensagem(texto, tipo) {
    // criar ou reutilizar elemento de mensagem
    let mensagemElemento = document.getElementById('mensagemFormulario');
    
    if (!mensagemElemento) {
        mensagemElemento = document.createElement('div');
        mensagemElemento.id = 'mensagemFormulario';
        mensagemElemento.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            display: none;
            max-width: 350px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(mensagemElemento);
    }
    
    // configurar estilo baseado no tipo
    mensagemElemento.textContent = texto;
    mensagemElemento.style.display = "block";
    
    if (tipo === "sucesso") {
        mensagemElemento.style.backgroundColor = 'rgba(46, 204, 113, 0.95)';
        mensagemElemento.style.color = '#fff';
        mensagemElemento.style.border = '2px solid #27ae60';
    } else {
        mensagemElemento.style.backgroundColor = 'rgba(231, 76, 60, 0.95)';
        mensagemElemento.style.color = '#fff';
        mensagemElemento.style.border = '2px solid #c0392b';
    }
    
    // animação de entrada
    mensagemElemento.style.animation = "fadeInSlide 0.5s ease forwards";
    
    // auto-remover após 4 segundos
    setTimeout(() => {
        mensagemElemento.style.animation = "fadeOutSlide 0.5s ease forwards";
        setTimeout(() => {
            mensagemElemento.style.display = "none";
        }, 500);
    }, 4000);
}

// ===============================
// CSS INJETADO DINAMICAMENTE
// ===============================
const estiloDinamico = document.createElement("style");
estiloDinamico.textContent = `
    @keyframes fadeInSlide { 
        from { 
            opacity: 0; 
            transform: translateX(100px) translateY(0); 
        } 
        to { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
        } 
    }
    
    @keyframes fadeOutSlide { 
        from { 
            opacity: 1; 
            transform: translateX(0) translateY(0); 
        } 
        to { 
            opacity: 0; 
            transform: translateX(100px) translateY(0); 
        } 
    }
    
    .chart-fill {
        transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* animação para cards ao entrar na viewport */
    .card, .stat-card, .tip-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .card.visible, .stat-card.visible, .tip-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(estiloDinamico);

// observador para animar cards quando entrarem na viewport
function initCardAnimations() {
    const cards = document.querySelectorAll('.card, .stat-card, .tip-card');
    
    if (!cards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ===============================
// INICIALIZAÇÃO GERAL
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as animações
    initCounters();
    initCardAnimations();
    animateCharts(); // Chamar aqui também
    
    // Garantir que a primeira tab esteja ativa
    const firstTabContent = document.querySelector('.tab-content');
    if (firstTabContent && !firstTabContent.classList.contains('active')) {
        const firstTabBtn = document.querySelector('.tab-btn');
        if (firstTabBtn) {
            firstTabBtn.classList.add('active');
            firstTabContent.classList.add('active');
        }
    }
    
    // Efeito de digitação no hero (opcional)
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle && !sessionStorage.getItem('heroAnimated')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText);
        }, 500);
        sessionStorage.setItem('heroAnimated', 'true');
    }
    
    // Configurar filtro de cidade para mostrar todas inicialmente
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        cityFilter.value = 'all';
        cityFilter.dispatchEvent(new Event('change'));
    }
    
    // Previnir envio de formulário com enter em campos não-submit
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    });
    
    // Forçar animação dos gráficos após um pequeno delay (para garantir que o DOM esteja pronto)
    setTimeout(() => {
        const chartFills = document.querySelectorAll('.chart-fill');
        chartFills.forEach(fill => {
            // Verificar se já está visível na viewport
            const rect = fill.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible && !fill.classList.contains('animated')) {
                const originalWidth = fill.style.width || fill.getAttribute('data-width') || '0%';
                fill.style.width = '0';
                
                setTimeout(() => {
                    fill.style.transition = 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    fill.style.width = originalWidth;
                    fill.classList.add('animated');
                }, 100);
            }
        });
    }, 300);
    
    // Adicionar event listener para as tabs para reanimar gráficos
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(forceChartAnimation, 300);
        });
    });
});

// debounce para eventos de scroll/resize
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// re-inicializar animações ao redimensionar
window.addEventListener('resize', debounce(() => {
    // Forçar reanimação dos gráficos que ainda não foram animados
    const chartFills = document.querySelectorAll('.chart-fill:not(.animated)');
    chartFills.forEach(fill => {
        const originalWidth = fill.style.width || fill.getAttribute('data-width') || '0%';
        fill.style.width = '0';
        
        setTimeout(() => {
            fill.style.transition = 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            fill.style.width = originalWidth;
            fill.classList.add('animated');
        }, 100);
    });
    
    initCounters();
}));

// Chamar após carregamento completo
window.addEventListener('load', function() {
    setTimeout(forceChartAnimation, 500);
});

// suporte para navegadores mais antigos
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function() {
        window.scrollTo(0, this.offsetTop - 80);
    };
}
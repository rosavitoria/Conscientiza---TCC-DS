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

// Formulário de contato
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
    
    // Simulação de envio
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
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

// Inicializar animações quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    animateCharts();
    
    // Adicionar classe active ao primeiro item de cada seção
    const firstTabContent = document.querySelector('.tab-content');
    if (firstTabContent) {
        firstTabContent.classList.add('active');
    }
});

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

// Ativar efeito de digitação se necessário
const heroTitle = document.querySelector('.hero h2');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText);
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
        // Adicionar mensagem de erro se desejar
    } else {
        this.style.borderColor = '#ddd';
    }
});

// Contador de estatísticas (opcional)
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

// Ativar contadores quando visíveis
function initCounters() {
    const counters = document.querySelectorAll('.chart-label span:last-child');
    
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

// Inicializar contadores
document.addEventListener('DOMContentLoaded', function() {
    initCounters();
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

// Carregamento de recursos externos (exemplo)
function loadExternalResources() {
    // Aqui você pode carregar dados de APIs externas
    // Por exemplo, carregar lista atualizada de CAPS
    
    // Simulação de carregamento
    console.log('Carregando recursos externos...');
}

// Inicializar quando a página carregar
window.addEventListener('load', function() {
    loadExternalResources();
    
    // Adicionar loading state se necessário
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--light-color);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s;
    `;
    loadingElement.innerHTML = '<div class="loading-spinner">Carregando...</div>';
    
    document.body.appendChild(loadingElement);
    
    // Remover loading após um tempo (simulação)
    setTimeout(() => {
        loadingElement.style.opacity = '0';
        setTimeout(() => {
            loadingElement.remove();
        }, 300);
    }, 1000);
});


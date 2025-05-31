// =========================
// ACESSIBILIDADE: TAMANHO DA FONTE E ALTO CONTRASTE
// =========================
const aumentarFonteBtn = document.getElementById('aumentar-fonte');
const diminuirFonteBtn = document.getElementById('diminuir-fonte');
const fonteNiveis = [14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96, 120];
let fonteNivelAtual = 1; // 0=menor, 1=padrão, ...máx
const fonteStorageKey = 'preferenciaFonte';

// Aplica o tamanho da fonte em todos os textos relevantes
function aplicarFonte() {
    const tamanho = fonteNiveis[fonteNivelAtual];
    // Aplica em todos os elementos de texto visíveis, exceto elementos de navegação/menu
    document.querySelectorAll('body, main, section, h1, h2, h3, h4, h5, h6, p, label, input, textarea, select, button, a, li, ul, ol, span, div, .btn, .noticia-card, .banner-overlay, .img-lightbox-caption, .formulario').forEach(el => {
        el.style.fontSize = tamanho + 'px';
    });
    // Ajusta tamanho do menu hamburguer e botões de acessibilidade
    document.querySelectorAll('#menu-toggle, #acessibilidade button').forEach(el => {
        el.style.fontSize = (tamanho * 0.9) + 'px';
    });
    localStorage.setItem(fonteStorageKey, fonteNivelAtual);
}
function setFonteNivel(novoNivel) {
    fonteNivelAtual = Math.max(0, Math.min(fonteNiveis.length - 1, novoNivel));
    aplicarFonte();
}
if (aumentarFonteBtn && diminuirFonteBtn) {
    aumentarFonteBtn.addEventListener('click', () => setFonteNivel(fonteNivelAtual + 1));
    diminuirFonteBtn.addEventListener('click', () => setFonteNivel(fonteNivelAtual - 1));
}
// Carrega preferência de fonte
const fonteSalva = localStorage.getItem(fonteStorageKey);
if (fonteSalva !== null && !isNaN(fonteSalva)) {
    fonteNivelAtual = parseInt(fonteSalva, 10);
}
aplicarFonte();

// ALTO CONTRASTE
let btnContraste = document.getElementById('contraste-btn');
if (!btnContraste) {
    btnContraste = document.createElement('button');
    btnContraste.id = 'contraste-btn';
    btnContraste.setAttribute('aria-label', 'Ativar/desativar alto contraste');
    btnContraste.textContent = '⧉';
    document.getElementById('acessibilidade').appendChild(btnContraste);
}
btnContraste.addEventListener('click', () => {
    const isAtivo = document.body.classList.toggle('high-contrast');
    btnContraste.setAttribute('aria-pressed', isAtivo ? 'true' : 'false');
    localStorage.setItem('contraste', isAtivo ? '1' : '');
});
// Aplica preferência de contraste
if (localStorage.getItem('contraste') === '1') {
    document.body.classList.add('high-contrast');
    btnContraste.setAttribute('aria-pressed', 'true');
}

// =========================
// TEMA CLARO/ESCURO
// =========================
const toggleThemeButton = document.querySelector('.toggle-mode');
const savedTheme = localStorage.getItem('theme');

function setTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    toggleThemeButton.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Aplica o tema salvo ou o padrão do sistema
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

toggleThemeButton.addEventListener('click', () => {
    const isDarkMode = !document.body.classList.contains('dark-mode');
    setTheme(isDarkMode);
});

// =========================
// FEEDBACK VISUAL FORMULÁRIO
// =========================
document.querySelectorAll("form input, form textarea").forEach(input => {
    input.addEventListener("focus", () => {
        input.style.borderColor = "var(--secondary-color)";
        input.style.boxShadow = "0 0 5px var(--secondary-color)";
    });
    input.addEventListener("blur", () => {
        input.style.borderColor = "";
        input.style.boxShadow = "";
    });
});

// Validação simples e feedback para o formulário de contato
const contatoForm = document.querySelector('#contato form');
if (contatoForm) {
    const feedback = contatoForm.querySelector('.form-feedback');
    contatoForm.addEventListener('submit', function (e) {
        let ok = true;
        let msg = '';
        const nome = contatoForm.querySelector('#nome');
        const email = contatoForm.querySelector('#email');
        const mensagem = contatoForm.querySelector('#mensagem');
        if (!nome.value.trim()) {
            ok = false;
            msg = 'Por favor, preencha seu nome.';
            nome.focus();
        } else if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
            ok = false;
            msg = 'Por favor, informe um e-mail válido.';
            email.focus();
        } else if (!mensagem.value.trim()) {
            ok = false;
            msg = 'Por favor, escreva sua mensagem.';
            mensagem.focus();
        }
        if (!ok) {
            e.preventDefault();
            if (feedback) feedback.textContent = msg;
        } else {
            e.preventDefault(); // Impede o envio e o redirecionamento
            if (feedback) {
                feedback.style.color = "#2a7c2a";
                feedback.textContent = "Muito obrigada pelo feedback!";
            }
            contatoForm.reset();
        }
    });
    // Limpa feedback ao digitar
    contatoForm.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            if (feedback) feedback.textContent = '';
        });
    });
};

// =========================
// SCROLL SUAVE PARA LINKS INTERNOS
// =========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

// =========================
// CARROSSEL AUTOMÁTICO
// =========================
const carousel = document.querySelector('.carousel');
let isScrolling = false;

function autoScrollCarousel() {
    if (!isScrolling && carousel) {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

let carouselInterval = setInterval(autoScrollCarousel, 3000);

if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        isScrolling = true;
        clearInterval(carouselInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        isScrolling = false;
        carouselInterval = setInterval(autoScrollCarousel, 3000);
    });
}

// =========================
// DESTAQUE DE SEÇÃO VISÍVEL
// =========================
const sections = document.querySelectorAll('main section[id], #festejando');
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('section-ativa', entry.isIntersecting);
        });
    },
    { threshold: 0.5 }
);

sections.forEach(section => observer.observe(section));

// =========================
// LIGHTBOX DE IMAGEM E ORIGEM NO HOVER
// =========================
function criarLightbox(src, alt, origem) {
    // Remove qualquer lightbox existente
    document.querySelectorAll('.img-lightbox-overlay').forEach(el => el.remove());

    const overlay = document.createElement('div');
    overlay.className = 'img-lightbox-overlay';
    overlay.tabIndex = 0;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    overlay.appendChild(img);

    if (origem) {
        const caption = document.createElement('div');
        caption.className = 'img-lightbox-caption';
        caption.textContent = origem;
        overlay.appendChild(caption);
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') overlay.remove();
    });

    document.body.appendChild(overlay);
    overlay.focus();
}

// Adiciona classe e atributo de origem nas imagens relevantes
document.querySelectorAll('img[data-origem]').forEach(img => {
    img.classList.add('img-origem-hover');
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', function () {
        criarLightbox(this.src, this.alt, this.getAttribute('data-origem'));
    });
    img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            criarLightbox(this.src, this.alt, this.getAttribute('data-origem'));
        }
    });
});

// MENU HAMBURGUER LATERAL ESQUERDO
const menuToggle = document.getElementById('menu-toggle');
const menuList = document.getElementById('menu-list');
if (menuToggle && menuList) {
    menuToggle.addEventListener('click', () => {
        const aberto = menuList.classList.toggle('menu-open');
        if (aberto) {
            document.body.classList.add('menu-open-overlay');
            menuToggle.setAttribute('aria-expanded', 'true');
            // Foca o primeiro link do menu para acessibilidade
            const firstLink = menuList.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            document.body.classList.remove('menu-open-overlay');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    // Fecha o menu ao clicar em um link
    menuList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuList.classList.remove('menu-open');
            document.body.classList.remove('menu-open-overlay');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    // Fecha o menu ao clicar fora dele em mobile
    document.addEventListener('click', (e) => {
        if (
            menuList.classList.contains('menu-open') &&
            !menuList.contains(e.target) &&
            e.target !== menuToggle
        ) {
            menuList.classList.remove('menu-open');
            document.body.classList.remove('menu-open-overlay');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    // Fecha o menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuList.classList.contains('menu-open')) {
            menuList.classList.remove('menu-open');
            document.body.classList.remove('menu-open-overlay');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
}

// =========================
// ACESSIBILIDADE: TAMANHO DA FONTE (incremental)
// =========================
const aumentarFonteBtn = document.getElementById('aumentar-fonte');
const diminuirFonteBtn = document.getElementById('diminuir-fonte');
const root = document.documentElement;
let fonteAtual = 16;

function atualizarFonte(tam) {
    root.style.setProperty('--user-font-size', tam + 'px');
}

aumentarFonteBtn.addEventListener('click', () => {
    fonteAtual = Math.min(fonteAtual + 2, 28);
    atualizarFonte(fonteAtual);
});
diminuirFonteBtn.addEventListener('click', () => {
    fonteAtual = Math.max(fonteAtual - 2, 12);
    atualizarFonte(fonteAtual);
});

// Inicializa o tamanho da fonte ao carregar
atualizarFonte(fonteAtual);

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
// ALTO CONTRASTE
// =========================
const altoContrasteBtn = document.getElementById('alto-contraste');
altoContrasteBtn.addEventListener('click', () => {
    document.body.classList.toggle('alto-contraste');
    // Remove dark-mode se alto contraste for ativado
    if (document.body.classList.contains('alto-contraste')) {
        document.body.classList.remove('dark-mode');
    }
});

// =========================
// FEEDBACK VISUAL FORMULÁRIO
// =========================
document.querySelectorAll("form input, form textarea").forEach(input => {
    input.addEventListener("focus", () => {
        input.classList.add("input-focus");
    });
    input.addEventListener("blur", () => {
        input.classList.remove("input-focus");
    });
});

// =========================
// FEEDBACK DE ENVIO DO FORMULÁRIO (mensagem mais descritiva)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form[action*="formsubmit"]');
    const feedback = document.getElementById('form-feedback');
    if (form) {
        form.addEventListener('submit', function (e) {
            // Exibe mensagem de obrigada e impede envio real para visualização local
            if (feedback && !feedback.textContent) {
                e.preventDefault();
                feedback.textContent = 'Mensagem enviada com sucesso! Obrigada pelo contato.';
                feedback.style.display = 'block';
                setTimeout(() => { feedback.textContent = ''; }, 4000);
            }
        });
    }
});

// =========================
// SCROLL SUAVE PARA LINKS INTERNOS E SKIP LINK
// =========================
document.querySelectorAll('a[href^="#"], .skip-link').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                target.focus && target.focus();
            }
        }
    });
});

// =========================
// CARROSSEL AUTOMÁTICO E ACESSÍVEL
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

    // Controles acessíveis
    const prevBtn = carousel.querySelector('.carousel-control.prev');
    const nextBtn = carousel.querySelector('.carousel-control.next');
    const imgs = carousel.querySelectorAll('img');
    let currentIndex = 0;

    function showImage(idx) {
        if (!imgs.length) return;
        imgs.forEach((img, i) => {
            img.style.display = window.innerWidth <= 900 ? 'none' : 'block';
            img.classList.remove('active');
            if (i === idx) {
                img.style.display = 'block';
                img.classList.add('active');
            }
        });
        currentIndex = idx;
        const desc = document.getElementById('carousel-desc');
        if (desc) desc.textContent = imgs[idx].alt;
    }

    // Inicializa carrossel acessível
    if (prevBtn && nextBtn && imgs.length) {
        // Mostra apenas a primeira imagem em telas pequenas
        imgs.forEach((img, i) => {
            if (window.innerWidth <= 900) {
                img.style.display = i === 0 ? 'block' : 'none';
                img.classList.toggle('active', i === 0);
            } else {
                img.style.display = 'block';
                img.classList.remove('active');
            }
        });
        prevBtn.addEventListener('click', () => {
            showImage((currentIndex - 1 + imgs.length) % imgs.length);
        });
        nextBtn.addEventListener('click', () => {
            showImage((currentIndex + 1) % imgs.length);
        });
        prevBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                showImage((currentIndex - 1 + imgs.length) % imgs.length);
            }
        });
        nextBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                showImage((currentIndex + 1) % imgs.length);
            }
        });
        carousel.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });

        // Atualiza exibição ao redimensionar
        window.addEventListener('resize', () => {
            showImage(currentIndex);
        });
    }
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

    // Mostra a fonte/origem da imagem de forma clara
    if (origem) {
        const caption = document.createElement('div');
        caption.className = 'img-lightbox-caption';
        caption.textContent = 'Fonte: ' + origem;
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

// =========================
// MENU HAMBURGUER MOBILE
// =========================
const menuToggle = document.getElementById('menu-toggle');
const menuList = document.getElementById('menu-list');

if (menuToggle && menuList) {
    menuToggle.addEventListener('click', function () {
        const aberto = menuList.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        if (aberto) menuList.querySelector('a')?.focus();
    });

    // Fecha o menu ao clicar em um link
    menuList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                menuList.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Fecha o menu ao pressionar ESC ou ao perder o foco
    menuList.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menuList.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
    menuList.addEventListener('focusout', (e) => {
        if (!menuList.contains(e.relatedTarget)) {
            menuList.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// =========================
// FEEDBACK VISUAL FORMULÁRIO - MELHORADO
// =========================
document.querySelectorAll("form input, form textarea").forEach(input => {
    input.addEventListener("focus", () => {
        input.classList.add("input-focus");
    });
    input.addEventListener("blur", () => {
        input.classList.remove("input-focus");
    });
});

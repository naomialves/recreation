// =========================
// SCRIPT PRINCIPAL - Encapsulado para evitar poluir o escopo global
// =========================
(() => {
    // =========================
    // ACESSIBILIDADE: TAMANHO DA FONTE E ALTO CONTRASTE
    // =========================
    const aumentarFonteBtn = document.querySelector('#aumentar-fonte');
    const diminuirFonteBtn = document.querySelector('#diminuir-fonte');
    const fonteNiveis = [14, 16, 18, 20, 22, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96, 120];
    let fonteNivelAtual = 1;
    const fonteStorageKey = 'preferenciaFonte';

    function aplicarFonte() {
        const tamanho = fonteNiveis[fonteNivelAtual];
        document.querySelectorAll('body, main, section, h1, h2, h3, h4, h5, h6, p, label, input, textarea, select, button, a, li, ul, ol, span, div, .btn, .noticia-card, .banner-overlay, .img-lightbox-caption, .formulario').forEach(el => {
            el.style.fontSize = tamanho + 'px';
        });
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
    const fonteSalva = localStorage.getItem(fonteStorageKey);
    if (fonteSalva !== null && !isNaN(fonteSalva)) {
        fonteNivelAtual = parseInt(fonteSalva, 10);
    }
    aplicarFonte();

    // =========================
    // ALTO CONTRASTE
    // =========================
    let btnContraste = document.querySelector('#contraste-btn');
    if (!btnContraste) {
        btnContraste = document.createElement('button');
        btnContraste.id = 'contraste-btn';
        btnContraste.setAttribute('aria-label', 'Ativar/desativar alto contraste');
        btnContraste.textContent = '⧉';
        document.querySelector('#acessibilidade').appendChild(btnContraste);
    }
    btnContraste.addEventListener('click', () => {
        const isAtivo = document.body.classList.toggle('high-contrast');
        btnContraste.setAttribute('aria-pressed', isAtivo ? 'true' : 'false');
        localStorage.setItem('contraste', isAtivo ? '1' : '');
    });
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
        if (toggleThemeButton) {
            toggleThemeButton.textContent = isDark ? '☀️' : '🌙';
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    if (savedTheme) {
        setTheme(savedTheme === 'dark');
    } else {
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    if (toggleThemeButton) {
        toggleThemeButton.addEventListener('click', () => {
            const isDarkMode = !document.body.classList.contains('dark-mode');
            setTheme(isDarkMode);
        });
    }

    // =========================
    // MENU RESPONSIVO (Hambúrguer)
    // =========================
    const menuToggle = document.querySelector('#menu-toggle');
    const menuList = document.querySelector('#menu-list');
    let menuOpen = false;

    function abrirMenu() {
        if (!menuList) return;
        menuList.classList.add('menu-open');
        document.body.classList.add('menu-open-overlay');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.classList.add('active');
        // Ícone animado
        menuToggle.textContent = '✖';
        menuOpen = true;
        // Foco no primeiro link
        const firstLink = menuList.querySelector('a');
        if (firstLink) firstLink.focus();
    }
    function fecharMenu() {
        if (!menuList) return;
        menuList.classList.remove('menu-open');
        document.body.classList.remove('menu-open-overlay');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('active');
        menuToggle.textContent = '☰';
        menuOpen = false;
    }
    if (menuToggle && menuList) {
        // Acessibilidade: aria-label e aria-controls
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.setAttribute('aria-controls', 'menu-list');
        menuToggle.setAttribute('aria-expanded', 'false');
        // Clique no botão
        menuToggle.addEventListener('click', () => {
            if (menuOpen) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });
        // Teclado: Enter ou Espaço abre/fecha menu
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (menuOpen) fecharMenu();
                else abrirMenu();
            }
        });
        // Fecha ao clicar em link do menu
        menuList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => fecharMenu());
        });
        // Fecha ao clicar fora do menu
        document.addEventListener('mousedown', (e) => {
            if (
                menuOpen &&
                !menuList.contains(e.target) &&
                e.target !== menuToggle
            ) {
                fecharMenu();
            }
        });
        // Fecha com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuOpen) {
                fecharMenu();
                menuToggle.focus();
            }
        });
    }

    // =========================
    // SCROLL SUAVE PARA LINKS INTERNOS
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
                // Foco acessível na seção
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
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
    // FORMULÁRIO DE CONTATO: Validação e Feedback Visual
    // =========================
    const contatoForm = document.querySelector('#contato form');
    if (contatoForm) {
        const feedback = contatoForm.querySelector('.form-feedback');
        // Função para mostrar erro visual no campo
        function mostrarErro(input, msg) {
            input.style.borderColor = "#b00";
            let erro = input.nextElementSibling;
            if (!erro || !erro.classList.contains('input-erro')) {
                erro = document.createElement('div');
                erro.className = 'input-erro';
                erro.style.color = "#b00";
                erro.style.fontSize = "0.95em";
                erro.style.marginTop = "2px";
                input.parentNode.insertBefore(erro, input.nextSibling);
            }
            erro.textContent = msg;
        }
        // Função para limpar erro visual
        function limparErro(input) {
            input.style.borderColor = "";
            const erro = input.parentNode.querySelector('.input-erro');
            if (erro) erro.remove();
        }
        contatoForm.addEventListener('submit', function (e) {
            let ok = true;
            let msg = '';
            const nome = contatoForm.querySelector('#nome');
            const email = contatoForm.querySelector('#email');
            const mensagem = contatoForm.querySelector('#mensagem');
            // Limpa erros anteriores
            [nome, email, mensagem].forEach(limparErro);

            // Validação campo nome
            if (!nome.value.trim() || /^[^a-zA-ZÀ-ÿ]+$/.test(nome.value.trim())) {
                ok = false;
                msg = 'Nome é obrigatório e deve conter letras.';
                mostrarErro(nome, msg);
                nome.focus();
            }
            // Validação campo email
            else if (!email.value.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
                ok = false;
                msg = 'Informe um e-mail válido.';
                mostrarErro(email, msg);
                email.focus();
            }
            // Validação campo mensagem
            else if (!mensagem.value.trim() || mensagem.value.trim().length < 3) {
                ok = false;
                msg = 'Mensagem é obrigatória.';
                mostrarErro(mensagem, msg);
                mensagem.focus();
            }
            if (!ok) {
                e.preventDefault();
                if (feedback) {
                    feedback.style.color = "#b00";
                    feedback.textContent = msg;
                }
            } else {
                e.preventDefault(); // Impede o envio real
                if (feedback) {
                    feedback.style.color = "#2a7c2a";
                    feedback.textContent = "Muito obrigada pelo feedback!";
                }
                contatoForm.reset();
                // Remove erros visuais
                [nome, email, mensagem].forEach(limparErro);
                // Foco no feedback
                feedback.focus();
            }
        });
        // Limpa feedback e erros ao digitar
        contatoForm.querySelectorAll('input, textarea').forEach(el => {
            el.addEventListener('input', () => {
                limparErro(el);
                if (feedback) feedback.textContent = '';
            });
        });
    }

    // =========================
    // FEEDBACK VISUAL EM CAMPOS DE FORMULÁRIO
    // =========================
    document.querySelectorAll("form input, form textarea").forEach(input => {
        input.addEventListener("focus", () => {
            input.style.boxShadow = "0 0 5px var(--secondary-color)";
        });
        input.addEventListener("blur", () => {
            input.style.boxShadow = "";
        });
    });
})();

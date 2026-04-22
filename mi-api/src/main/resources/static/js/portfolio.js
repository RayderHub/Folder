// Configuración de Supabase (Evitar redeclaración si ya existe en videos.js)
if (typeof SB_URL === 'undefined') {
    window.SB_URL = 'https://cwjbpiuqvxiubctdyhsc.supabase.co';
}
if (typeof SB_KEY === 'undefined') {
    window.SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3amJwaXVxdnhpdWJjdGR5aHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ0MTksImV4cCI6MjA5MjIwMDQxOX0.ICnz4xSdJ_l-XUX9xEVecG23lEeKtUisFPLQKS6M6nY';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar Experiencia desde Supabase (Datos reales)
    fetchExperience();

    // 2. Ejecutar la animación de "Abrir Cortinas" al cargar la página
    playInitialTransition();

    // 3. Interceptar clics en la navegación para la animación de "Cerrar Cortinas"
    setupLinkInterception();

    // 4. Configurar menú móvil
    setupMobileMenu();
});

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-btn');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        });
    }
}

// Cargar Experiencia directamente de Supabase
async function fetchExperience() {
    const expCarousel = document.getElementById('experience-carousel');
    if (!expCarousel) return;

    const currentLang = expCarousel.getAttribute('data-lang') || 'es';
    const noDescText = expCarousel.getAttribute('data-no-desc') || 'Sin descripción detallada.';

    try {
        const response = await fetch(`${SB_URL}/rest/v1/experience?select=*&order=order_index.asc`, {
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`
            }
        });
        const allExperiences = await response.json();

        // Filtrar localmente si existe la columna 'lang'
        let experiences = allExperiences;
        if (allExperiences.length > 0 && 'lang' in allExperiences[0]) {
            experiences = allExperiences.filter(exp => exp.lang === currentLang);
        }

        if (experiences && experiences.length > 0) {
            expCarousel.innerHTML = experiences.map((exp, index) => `
                <div class="exp-card">
                    <div class="exp-number">${(index + 1).toString().padStart(2, '0')}</div>
                    <div class="exp-header">
                        <h3 class="exp-role">${exp.puesto}</h3>
                        <div class="exp-company">${exp.empresa}</div>
                    </div>
                    <div class="exp-body">
                        <div class="exp-date">${exp.periodo} <span class="exp-duration">(${exp.duracion})</span></div>
                        <p class="exp-description">${exp.descripcion || noDescText}</p>
                    </div>
                    <div class="card-accent"></div>
                </div>
            `).join('');

            // Inicializar funcionalidad del carrusel después de cargar datos
            setupExperienceCarousel();
        } else {
             expCarousel.innerHTML = `<div style="color: #666; font-size: 10px; padding: 20px;">NO DATA FOUND (${currentLang})</div>`;
        }
    } catch (err) {
        console.error("Error fetching experience from Supabase:", err);
    }
}

// Arreglo para navegación atrás/adelante del navegador (BFCache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Si la página viene de la caché, forzamos la apertura de cortinas
        playInitialTransition();
    }
});

// Animación de entrada al cargar cualquier página
function playInitialTransition() {
    const topSlice = document.querySelector('.top-slice');
    const bottomSlice = document.querySelector('.bottom-slice');
    const activeView = document.querySelector('.view-panel.active');

    // Empezamos con las cortinas cerradas (centro de la pantalla)
    gsap.set(topSlice, { translateY: "0%" });
    gsap.set(bottomSlice, { translateY: "0%" });

    // 1. Abrimos las cortinas deslizándolas hacia afuera
    gsap.to(topSlice, { translateY: "-105%", duration: 0.8, ease: "power4.inOut", delay: 0.3 });
    gsap.to(bottomSlice, {
        translateY: "105%",
        duration: 0.8,
        ease: "power4.inOut",
        delay: 0.3,
        onComplete: () => {
            // 2. Aparecemos el panel principal suavemente
            if (activeView) {
                gsap.to(activeView, { opacity: 1, duration: 0.4 });

                // 3. Animamos los elementos internos (stagger)
                const elements = activeView.querySelectorAll('.stagger-enter');
                gsap.to(elements, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out"
                });
            }
        }
    });
}

// Interceptar los enlaces de la barra lateral
function setupLinkInterception() {
    const navLinks = document.querySelectorAll('.nav-btn');
    const topSlice = document.querySelector('.top-slice');
    const bottomSlice = document.querySelector('.bottom-slice');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && !link.classList.contains('active')) {
                e.preventDefault();
                const destination = link.href;

                // Animamos el cierre de cortinas deslizándolas al centro
                gsap.to(topSlice, { translateY: "0%", duration: 0.6, ease: "power4.inOut" });
                gsap.to(bottomSlice, {
                    translateY: "0%",
                    duration: 0.6,
                    ease: "power4.inOut",
                    onComplete: () => {
                        window.location.href = destination;
                    }
                });
            }
        });
    });
}

// Configuración de la navegación dinámica (SPA)
function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-panel');

    let isAnimating = false;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating) return;
            if (btn.classList.contains('active')) return;

            isAnimating = true;

            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            const currentView = Array.from(views).find(v => v.classList.contains('active'));

            animateTransition(currentView, targetView, () => {
                isAnimating = false;
            });
        });
    });
}

function animateTransition(currentView, targetView, callback) {
    const topSlice = document.querySelector('.top-slice');
    const bottomSlice = document.querySelector('.bottom-slice');

    gsap.to(topSlice, { translateY: "0%", duration: 0.5, ease: "power4.inOut" });
    gsap.to(bottomSlice, {
        translateY: "0%",
        duration: 0.5,
        ease: "power4.inOut",
        onComplete: () => {
            currentView.classList.remove('active');
            targetView.classList.add('active');

            gsap.set(targetView, { opacity: 0 });
            gsap.set(targetView.querySelectorAll('.stagger-enter'), { y: 50, opacity: 0 });

            setTimeout(() => {
                gsap.to(topSlice, { translateY: "-105%", duration: 0.6, ease: "power4.out" });
                gsap.to(bottomSlice, {
                    translateY: "105%",
                    duration: 0.6,
                    ease: "power4.out",
                    onComplete: () => {
                        animateViewIn(targetView);
                        callback();
                    }
                });
            }, 200);
        }
    });
}

function animateViewIn(view) {
    const elements = view.querySelectorAll('.stagger-enter');
    gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
}

function setupExperienceCarousel() {
    const carousel = document.getElementById('experience-carousel');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const pagination = document.querySelector('.carousel-pagination');

    if (!carousel || !pagination) return;

    const cards = carousel.querySelectorAll('.exp-card');

    pagination.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            carousel.scrollTo({
                left: cards[i].offsetLeft - carousel.offsetLeft,
                behavior: 'smooth'
            });
        });
        pagination.appendChild(dot);
    });

    carousel.addEventListener('scroll', () => {
        const index = Math.round(carousel.scrollLeft / (cards[0].offsetWidth + 30));
        const dots = pagination.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            if (dots[i]) dot.classList.toggle('active', i === index);
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -cards[0].offsetWidth, behavior: 'smooth' });
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: cards[0].offsetWidth, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciar cargando los datos
    fetchData();

    // 2. Ejecutar la animación de "Abrir Cortinas" al cargar la página
    playInitialTransition();
    
    // 3. Interceptar clics en la navegación para la animación de "Cerrar Cortinas"
    setupLinkInterception();
});

// Animación de entrada al cargar cualquier página
function playInitialTransition() {
    const topSlice = document.querySelector('.top-slice');
    const bottomSlice = document.querySelector('.bottom-slice');
    const activeView = document.querySelector('.view-panel.active');

    // Empezamos con las cortinas cerradas (cubriendo la pantalla)
    gsap.set([topSlice, bottomSlice], { scaleY: 1 });
    
    // 1. Abrimos las cortinas
    gsap.to([topSlice, bottomSlice], {
        scaleY: 0,
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
            // Si es un enlace real y no tiene la clase active
            if (link.href && !link.classList.contains('active')) {
                e.preventDefault(); // Detenemos la navegación inmediata
                const destination = link.href;

                // Animamos el cierre de cortinas
                gsap.to([topSlice, bottomSlice], {
                    scaleY: 1,
                    duration: 0.6,
                    ease: "power4.inOut",
                    onComplete: () => {
                        // Cuando las cortinas cubren todo, navegamos
                        window.location.href = destination;
                    }
                });
            }
        });
    });
}

// Fallback para los datos de la API
function fetchData() {
    fetch('/api/portfolio/data')
        .then(res => res.json())
        .then(data => populateUI(data))
        .catch(err => populateUI(getDummyData()));
}

function populateUI(data) {
    const expList = document.getElementById('experience-list');
    if (expList) {
        data.experience.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `<span>${item}</span>`;
            expList.appendChild(li);
        });
    }

    const vidList = document.getElementById('video-types-list');
    if (vidList) {
        data.videoTypes.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `<span class="bullet">▪</span> ${item}`;
            vidList.appendChild(li);
        });
    }

    const stuList = document.getElementById('studies-list');
    if (stuList) {
        data.studies.forEach(item => {
            let li = document.createElement('li');
            li.innerText = item;
            stuList.appendChild(li);
        });
    }

    const couList = document.getElementById('courses-list');
    if (couList) {
        data.courses.forEach(item => {
            let li = document.createElement('li');
            li.innerText = item;
            couList.appendChild(li);
        });
    }
}

// Configuración de la navegación dinámica (SPA)
function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-panel');

    let isAnimating = false;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isAnimating) return;
            if (btn.classList.contains('active')) return; // Ya estamos aquí

            isAnimating = true;

            // Actualizar estado botones
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Encontrar vista actual y objetivo
            const targetId = btn.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            const currentView = Array.from(views).find(v => v.classList.contains('active'));

            // Iniciar transición genial estilo corte
            animateTransition(currentView, targetView, () => {
                isAnimating = false;
            });
        });
    });
}

// Animación de transición (estilo corte transversal)
function animateTransition(currentView, targetView, callback) {
    const topSlice = document.querySelector('.top-slice');
    const bottomSlice = document.querySelector('.bottom-slice');

    // 1. Las cortinas tapan la pantalla
    gsap.to([topSlice, bottomSlice], {
        scaleY: 1.05,
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => {
            // 2. Cambiamos las vistas detrás del telón
            currentView.classList.remove('active');
            targetView.classList.add('active');
            
            // Re-esconder los elementos de la nueva vista temporalmente
            gsap.set(targetView.querySelectorAll('.stagger-enter'), { y: 50, opacity: 0 });

            // 3. Abrir telón
            gsap.to([topSlice, bottomSlice], {
                scaleY: 0,
                duration: 0.6,
                ease: "power4.inOut",
                onComplete: () => {
                    // 4. Animar entrada de los contenidos de la nueva vista
                    animateViewIn(targetView);
                    callback();
                }
            });
        }
    });
}

// Animación fluida de entrada de los elementos
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

function getDummyData() {
    return {
        name: "Job de la Vega",
        profession: "Editor de Video",
        experience: [
            "<strong>Editor Principal</strong> - Agencia Creativa Visual (2020-Presente)", 
            "<strong>Montajista Freelance</strong> - Creadores de Contenido (2018-2020)",
            "<strong>Operador de Postproducción</strong> - Productora Local (2017)"
        ],
        videoTypes: [
            "Formatos dinámicos (YouTube/Twitch/TikTok)", 
            "Montaje narrativo y cortometrajes", 
            "Estética Manga / AMV experimental", 
            "Colorización y Grading cinematográfico"
        ],
        studies: [
            "Licenciatura en Comunicación Audiovisual", 
            "Diplomado Técnico en Artes y Cine"
        ],
        courses: [
            "Adobe Master Collection: Postproducción", 
            "DaVinci Resolve - Advanced Color Grading", 
            "Narrativa Visual Avanzada"
        ]
    };
}

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

// ==========================================
// INTEGRACIÓN CON SUPABASE (CONTACTO)
// ==========================================

// REEMPLAZA ESTOS VALORES CON LOS DE TU PROYECTO (Settings -> API en Supabase)
const SUPABASE_URL = 'https://cwjbpiuqvxiubctdyhsc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3amJwaXVxdnhpdWJjdGR5aHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ0MTksImV4cCI6MjA5MjIwMDQxOX0.ICnz4xSdJ_l-XUX9xEVecG23lEeKtUisFPLQKS6M6nY';

document.addEventListener('DOMContentLoaded', () => {
    // Escuchar el envío del formulario usando delegación por si la vista cambia
    document.addEventListener('submit', async (e) => {
        if (e.target && e.target.id === 'contact-form') {
            e.preventDefault();

            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = "ENVIANDO...";
            btn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                contact_info: document.getElementById('contact_info').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const successBox = document.getElementById('success-message');
                    document.getElementById('contact-form').style.display = 'none';
                    successBox.style.display = 'block';

                    // Animación de éxito fluida sin parpadeos
                    gsap.fromTo(successBox, 
                        { rotate: -5, scale: 0.5, opacity: 0 }, 
                        { rotate: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
                    );
                } else {
                    throw new Error("Error en la respuesta de Supabase");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema al enviar el mensaje. Verifica tu URL y API KEY de Supabase.");
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    });
});

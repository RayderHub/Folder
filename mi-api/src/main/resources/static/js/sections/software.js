/**
 * Software Section Control Script
 */

function playSoftwareEntrance() {
    const tl = gsap.timeline();
    tl.to("#stagger-header", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "+=0.5")
        .to(".sw-list-item", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out"
        }, "-=0.3")
        .to("#stagger-bg", { opacity: 1, y: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.2")
        .to("#stagger-content", { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.4");
}

// Iniciar animación al cargar la sección
setTimeout(playSoftwareEntrance, 100);

function switchSoftware(element, type, desc, logoSrc, infoBgSrc, customScale = 1, realName = '', exp = 'MASTERED') {
    // Manejo de clase activa
    document.querySelectorAll('.software-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const descEl = document.getElementById('sw-desc');
    const titleEl = document.getElementById('sw-title-display');
    const catEl = document.getElementById('sw-cat');
    const imgEl = document.getElementById('info-bg-img');
    const logoEl = document.getElementById('software-logo');
    const scalerEl = document.getElementById('logo-scaler');

    // 1. Salida rápida para ocultar el cambio de src
    gsap.to([descEl, titleEl, catEl, imgEl, scalerEl], {
        opacity: 0,
        y: 5,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
            // 2. Cambiamos datos cuando están invisibles
            descEl.innerText = desc;
            titleEl.innerText = realName.toUpperCase();
            catEl.innerText = exp.toUpperCase();

            if (logoSrc) logoEl.src = logoSrc;
            if (infoBgSrc) imgEl.src = infoBgSrc;

            gsap.set(scalerEl, { scale: customScale });

            // 3. Pequeño delay de cortesía para que el navegador procese el render
            setTimeout(() => {
                // 4. Entrada fluida
                gsap.to([descEl, titleEl, catEl, imgEl, scalerEl], {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "power2.out"
                });
            }, 50);
        }
    });

    // Fondo panorámico (independiente)
    document.querySelectorAll('.software-bg-image').forEach(bg => bg.classList.remove('active'));
    const targetBg = document.getElementById('bg-' + type);
    if (targetBg) targetBg.classList.add('active');
}

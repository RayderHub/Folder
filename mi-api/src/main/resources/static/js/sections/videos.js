/**
 * Videos Section Control Script - Supabase Integration
 */

// Configuración de Supabase
const SB_URL = 'https://cwjbpiuqvxiubctdyhsc.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3amJwaXVxdnhpdWJjdGR5aHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjQ0MTksImV4cCI6MjA5MjIwMDQxOX0.ICnz4xSdJ_l-XUX9xEVecG23lEeKtUisFPLQKS6M6nY';

let videoData = [];

async function fetchVideos() {
    try {
        const response = await fetch(`${SB_URL}/rest/v1/videos?select=*&order=order_index.asc`, {
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        videoData = await response.json();

        if (videoData && videoData.length > 0) {
            renderThumbnails();
        } else {
            const container = document.getElementById('thumbnails-container');
            if (container) container.innerHTML = '<div style="color:red; font-size:10px; padding:10px;">SIN DATOS</div>';
        }
    } catch (error) {
        console.error("Error cargando videos:", error);
    }
}

function renderThumbnails() {
    const container = document.getElementById('thumbnails-container');
    if (!container) return;
    container.innerHTML = '';

    const seenTitles = new Set();

    videoData.forEach((vid, index) => {
        if (seenTitles.has(vid.title)) return;
        seenTitles.add(vid.title);

        const box = document.createElement('div');
        box.className = `thumb-box ${container.children.length === 0 ? 'selected' : ''}`;
        box.onclick = () => updateView(box, vid);
        box.innerHTML = `<div>${vid.title}</div>`;
        container.appendChild(box);
    });

    if (container.firstChild) {
        const firstVid = videoData.find(v => v.title === container.firstChild.innerText);
        applyVideoChanges(container.firstChild, firstVid);
    }
}

function updateView(thumb, vid) {
    // Animación de salida cinematográfica
    gsap.to(['#video-title', '#video-desc', '.comparison-grid'], {
        opacity: 0,
        y: 10,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
            applyVideoChanges(thumb, vid);
            // Animación de entrada suave
            gsap.to(['#video-title', '#video-desc', '.comparison-grid'], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });
}

function applyVideoChanges(thumb, vid) {
    document.querySelectorAll('.thumb-box').forEach(el => el.classList.remove('selected'));
    thumb.classList.add('selected');

    document.getElementById('video-title').innerText = vid.title;
    document.getElementById('video-desc').innerText = vid.description;

    const rawFrame = document.getElementById('raw-video-player');
    const editFrame = document.getElementById('edit-video-player');

    rawFrame.setAttribute('data-id', vid.raw_video_id);
    editFrame.setAttribute('data-id', vid.edit_video_id);

    rawFrame.src = `https://www.youtube.com/embed/${vid.raw_video_id}?autoplay=0&controls=1&rel=0&modestbranding=1`;
    editFrame.src = `https://www.youtube.com/embed/${vid.edit_video_id}?autoplay=0&controls=1&rel=0&modestbranding=1`;

    document.querySelectorAll('.video-container').forEach(c => c.classList.remove('is-playing'));
}

function playManual(type) {
    const container = document.getElementById('container-' + type);
    const player = document.getElementById(type + '-video-player');
    const videoId = player.getAttribute('data-id');

    container.classList.add('is-playing');
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
}

function toggleCinema(show, type = '') {
    const overlay = document.getElementById('cinema-overlay');
    const cinemaPlayer = document.getElementById('cinema-player');
    const layout = document.getElementById('videos-layout-container');

    if (show) {
        const player = document.getElementById(type + '-video-player');
        const videoId = player.getAttribute('data-id');
        cinemaPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;
        overlay.style.display = 'flex';
        layout.classList.add('bg-blur-active');
    } else {
        overlay.style.display = 'none';
        cinemaPlayer.src = '';
        layout.classList.remove('bg-blur-active');
    }
}

// Inicializar carga
fetchVideos();

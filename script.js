// Icônes Lucide
lucide.createIcons();

// Menu mobile
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mainNav.classList.remove('open'));
    });
}

// Révélation au scroll (fade + slide, purement 2D)
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

function observeReveal(el) {
    revealObserver.observe(el);
}

document.querySelectorAll('.reveal, .skill-bar').forEach(observeReveal);

// ---------------------------------------------------------------
// Galerie Projets — se met à jour toute seule avec le dossier /projects
//
// 1) /api/projects (fonction serverless Vercel) relit le dossier à chaque
//    requête : en local avec "vercel dev" ou une fois déployé, une image
//    ajoutée au dossier apparaît sans toucher au code.
// 2) Si l'API n'est pas disponible (site ouvert en simple statique),
//    on retombe sur projects/manifest.json, regénéré via
//    "npm run build" (node scripts/build-manifest.js).
// ---------------------------------------------------------------
const projectsGrid = document.getElementById('projectsGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

function renderProjects(projects) {
    if (!projectsGrid) return;

    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = '<p class="projects-status">Aucun projet pour le moment — revenez bientôt !</p>';
        return;
    }

    projectsGrid.innerHTML = '';
    projects.forEach((project, i) => {
        const card = document.createElement('figure');
        card.className = 'project-card reveal';
        card.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;

        const img = document.createElement('img');
        img.src = project.url;
        img.alt = project.title;
        img.loading = 'lazy';

        const caption = document.createElement('figcaption');
        caption.innerHTML = `<span>${project.title}</span><i data-lucide="maximize-2"></i>`;

        card.appendChild(img);
        card.appendChild(caption);
        card.addEventListener('click', () => openLightbox(project.url, project.title));

        projectsGrid.appendChild(card);
        observeReveal(card);
    });

    lucide.createIcons();
}

async function loadProjects() {
    if (!projectsGrid) return;

    try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) throw new Error('api indisponible');
        renderProjects(await res.json());
        return;
    } catch (e) {
        // API non disponible (site statique) : on retombe sur le manifeste
    }

    try {
        const res = await fetch('projects/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('manifest indisponible');
        renderProjects(await res.json());
    } catch (e) {
        projectsGrid.innerHTML = '<p class="projects-status">Impossible de charger les projets pour le moment.</p>';
    }
}

loadProjects();

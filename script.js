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
const revealTargets = document.querySelectorAll('.reveal, .skill-bar');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// Scanne le dossier /projects et transforme son contenu en une liste
// de projets exploitable par le site (fonction API Vercel + manifeste statique).
// Utilisé à la fois par api/projects.js (lecture à chaque requête, en prod Vercel)
// et par scripts/build-manifest.js (génération du secours statique projects/manifest.json).
const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(process.cwd(), 'projects');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const GENERIC_NAME = /^(whatsapp|img|image|photo|screenshot|capture|sans[-_ ]titre|untitled)[\s_-]*/i;

function titleFromFilename(filename, index) {
    const base = path.basename(filename, path.extname(filename));
    if (GENERIC_NAME.test(base) || /^[\d\s()_-]+$/.test(base)) {
        return `Projet ${String(index).padStart(2, '0')}`;
    }
    return base
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, c => c.toUpperCase());
}

function getProjects() {
    if (!fs.existsSync(PROJECTS_DIR)) return [];

    const files = fs.readdirSync(PROJECTS_DIR)
        .filter(f => IMAGE_EXT.has(path.extname(f).toLowerCase()))
        .map(f => {
            const stat = fs.statSync(path.join(PROJECTS_DIR, f));
            return { file: f, mtime: stat.mtimeMs };
        })
        .sort((a, b) => a.mtime - b.mtime); // ordre chronologique d'ajout

    return files
        .map((entry, i) => ({
            title: titleFromFilename(entry.file, i + 1),
            url: 'projects/' + encodeURIComponent(entry.file),
            addedAt: entry.mtime
        }))
        .sort((a, b) => b.addedAt - a.addedAt); // le plus récent en premier à l'affichage
}

module.exports = { getProjects, PROJECTS_DIR };

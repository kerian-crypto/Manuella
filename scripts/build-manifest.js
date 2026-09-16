// Génère projects/manifest.json à partir du contenu actuel du dossier /projects.
// Sert de secours d'affichage quand /api/projects n'est pas disponible
// (site ouvert en simple statique, sans "vercel dev").
// À relancer après avoir ajouté des images, avant un déploiement statique pur.
const fs = require('fs');
const path = require('path');
const { getProjects, PROJECTS_DIR } = require('../lib/projects');

function buildManifest() {
    const projects = getProjects();
    fs.writeFileSync(
        path.join(PROJECTS_DIR, 'manifest.json'),
        JSON.stringify(projects, null, 2)
    );
    return projects;
}

if (require.main === module) {
    const projects = buildManifest();
    console.log(`manifest.json généré avec ${projects.length} projet(s).`);
}

module.exports = { buildManifest };

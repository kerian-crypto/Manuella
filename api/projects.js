// Fonction serverless Vercel — GET /api/projects
// Relit le dossier /projects à chaque appel : aucun redéploiement n'est requis
// en local (vercel dev) pour voir apparaître une image nouvellement ajoutée.
// Sur un déploiement Vercel figé, /projects fait partie du bundle : une nouvelle
// image doit être poussée (git push) pour être incluse dans le prochain déploiement.
const { getProjects } = require('../lib/projects');

module.exports = (req, res) => {
    const projects = getProjects();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(projects);
};

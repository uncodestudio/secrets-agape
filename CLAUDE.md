# Site Webflow : Les Secrets d'Agapë

@~/uncode-playbook/sites/CLAUDE.md
@~/uncode-playbook/webflow/CLAUDE.md
@~/uncode-playbook/projects/secrets-agape.md

Type : site-webflow. Ce dépôt contient le JS du site (Vite, servi par jsDelivr) ; le site lui-même vit dans Webflow. Les règles viennent du playbook et ne sont jamais copiées ici (R-32). Si les trois imports ci-dessus ne sont pas chargés dans ta session, lis ces fichiers avant d'agir. La section « À reprendre » de la fiche projet dit où on en est.

## Repères

- Port de dev : 3003 (`vite.config.js`), aussi dans la ligne `localhost` du pied de page Webflow (R-29, R-45).
- `npm install`, `npm run dev`, `npm run build`.
- Un module par fonctionnalité dans `modules/`, déclaré dans le détecteur de `main.js` ; nouveaux modules accrochés par attributs `data-*` (R-44). Modèle et catalogue : `webflow/js.md` du playbook.
- Mise en production : build, commit avec `dist/`, push, nouveau hash dans la ligne jsDelivr de Webflow, publication sur `webflow.io` puis sur le domaine par Fabien (`webflow/process.md`, section 4).

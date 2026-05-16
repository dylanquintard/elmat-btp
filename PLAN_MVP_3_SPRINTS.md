# Plan MVP Presentable - 3 Sprints

## Objectif
Livrer un MVP presentable, stable et deployable pour demo client BTP (public + admin + pipeline Docker).

## Sprint 1 - Fondations produit (Must-Have)
Periode conseillee: 3 a 5 jours
Statut actuel: `CLOTURE (2026-05-12)`

### Objectifs
- Fiabiliser le socle technique.
- Garantir que toutes les donnees sont gerables en admin.
- Stabiliser l'environnement local/Docker.

### Backlog
1. Prisma propre
- Creer les migrations `prisma/migrations` (init + suivantes).
- Remplacer le flux `db push` par `migrate deploy` partout.
- Verifier coherence schema + seed + runtime.

2. Auth admin robuste
- Verifier login/logout de bout en bout.
- Gerer erreurs de connexion et session expiree.
- Verifier protection `/admin/*` et `/api/admin/*`.

3. CRUD admin complets (priorite haute)
- `SiteSetting`: create/update.
- `Service`: create/read/update/delete.
- `Project`: create/read/update/delete.
- `Testimonial`: create/read/update/delete.
- `ServiceArea`: create/read/update/delete.
- `ContactRequest`: list + mark as read + delete.

4. Validation et securite minimales
- Zod sur toutes les routes API admin/public.
- Validation client coherente avec backend.
- Durcir messages d'erreur (pas d'info sensible).

5. Docker local stable
- Verifier `docker compose up -d --build` sans action manuelle.
- Verifier migration au demarrage + service up.
- Documenter commandes de base (up/down/logs/seed).

### Definition of Done Sprint 1
- Un nouvel environnement clone du repo peut demarrer en Docker.
- Admin peut gerer toutes les entites principales.
- Aucune route critique ne plante sur parcours nominal.

---

## Sprint 2 - Experience MVP & contenu demo (Must-Have)
Periode conseillee: 3 a 5 jours

### Objectifs
- Rendre le site presentable visuellement pour demo.
- Finaliser parcours conversion (contact/devis).
- Injecter du contenu credible.

### Backlog
1. UI/UX vitrine
- Home plus impactante: hero, blocs confiance, CTA clairs.
- CTA mobile visibles (`Appeler`, `Demander un devis`).
- Mise en page responsive propre sur mobile/tablette/desktop.

2. Upload image exploitable
- Brancher upload sur formulaires Services et Realisations.
- Preview des images dans l'admin.
- Suppression/remplacement image propre.

3. Parcours contact complet
- Formulaire public finalise (UX, validations, retours utilisateur).
- Verification creation `ContactRequest` en base.
- Gestion admin des demandes (lecture, statut, suppression).

4. Contenu demo
- Seed enrichi: services, realisations, avis, zones.
- Textes et visuels de demonstration realistes.
- Parametres entreprise coherents pour presentation.

5. Pages essentielles
- `mentions-legales` completees (version MVP).
- Footer avec coordonnees et liens utiles.

### Definition of Done Sprint 2
- Demo possible sans trou fonctionnel majeur.
- Le visiteur comprend offre, zones, preuves, contact.
- L'admin peut publier/mettre a jour contenu sans toucher au code.

---

## Sprint 3 - Finition, SEO et pre-prod (Must-Have + polish)
Periode conseillee: 2 a 4 jours

### Objectifs
- Finaliser qualite percue et robustesse.
- Verrouiller SEO local et checklist de livraison.

### Backlog
1. SEO local final
- Metadata dynamiques sur toutes les pages cles.
- Verification `sitemap.xml` dynamique.
- Verification `robots.txt`.
- JSON-LD `HomeAndConstructionBusiness` complet.

2. Securite et anti-abus minimum
- Rate limit simple sur `/api/contact` et `/api/auth/login`.
- Durcissement upload (taille/type/nommage deja present, revue finale).
- Revue des secrets et variables d'env.

3. Qualite et tests minimum
- Smoke tests API critiques (auth/contact/admin list).
- Verification manuelle des parcours critiques.
- Nettoyage warnings/errors runtime importants.

4. Qualite de livraison Docker
- Build final propre.
- Procedure de deploiement locale reproductible.
- Verifier conservation du volume `/app/uploads`.

5. Checklist demo/livraison
- Script de demo: login admin, ajout service, ajout realisation + image, reception demande.
- Checklist QA pre-demo.

### Definition of Done Sprint 3
- MVP presentable en demo client.
- SEO local en place sur pages cles.
- Process de run/deploiement local clair et reproductible.

---

## Priorisation globale
- Must-have absolu: Sprint 1 complet + points 1/2/3 de Sprint 2.
- Must-have demo client: Sprint 2 complet.
- Must-have pre-prod: points 1/2/4 de Sprint 3.
- Nice-to-have: tests plus profonds, polish visuel avance, optimisations secondaires.

## Risques a surveiller
1. Dette migration Prisma si on reste trop longtemps en `db push`.
2. Regression auth/middleware pendant ajout CRUD.
3. Qualite contenu demo insuffisante pour convaincre en presentation.
4. Temps de finition UI sous-estime.

## Prochaine action recommandee
Demarrer Sprint 1 par:
1. Migrations Prisma officielles.
2. CRUD `SiteSetting` + `Service`.
3. Stabilisation auth admin.

## Mise a jour avancement (2026-05-12)
- Fait: migrations Prisma versionnees + Docker runtime stable.
- Fait: auth admin (login/logout, protections, session expiree UX).
- Fait: CRUD admin `settings`, `services`, `projects`, `testimonials`, `service-areas`, `contact-requests`.
- Fait: pages publiques dynamiques principales.
- Reste (non bloquant): warning NFT/Turbopack residuel sur route uploads (reporte Sprint 2).

## Mise a jour avancement (2026-05-13)

### Sprint 2 - Etat detaille
Statut: `QUASI TERMINE`

Fait:
1. UI/UX vitrine largement renforcee sur la home (hero, sections de confiance, CTA, animations de scroll).
2. Parcours contenu admin/public stabilise (services, realisations, galerie, zones, settings).
3. Upload image exploitable en admin avec preview/suppression, usage reel sur contenus publics.
4. Galerie dynamique integree a la page d'accueil avec modal et navigation fluide.
5. Contact et blocs de contenu demo fortement enrichis pour presentation client.
6. Footer/coordonnees/liens utiles en place avec Google Maps.

Reste:
1. Passe finale d'harmonisation UX mobile sur quelques ecrans secondaires.
2. Uniformisation editoriale finale (accents/variantes d'ecriture) sur certains textes.

### Sprint 3 - Etat detaille
Statut: `EN COURS (FINALISATION)`

Fait:
1. SEO local deja ajuste sur l'axe principal:
- Adresse entreprise: Valleiry.
- Zones prioritaires FR integrees.
- Mention explicite: proximite Geneve, sans intervention en Suisse pour le moment.
2. JSON-LD/metadata dynamiques deja actifs (base solide).
3. Metadata dediees ajoutees sur pages cles:
- `/services`
- `/services/[slug]`
- `/realisations`
- `/realisations/[slug]`
- `/contact`
- `/zones-intervention`
- `/zones-intervention/[slug]`
4. Rate limiting minimal ajoute:
- `/api/contact`
- `/api/auth/login`

Reste:
1. Finaliser la checklist QA/demo de cloture Sprint 3.
2. Traiter ou documenter proprement le warning Turbopack/NFT residuel.

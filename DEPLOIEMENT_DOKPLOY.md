# Deploiement Dokploy (pret a importer)

## 1) Ce qui est deja pret
- `Dockerfile` production (build Next.js + Prisma migrate au demarrage)
- `docker-compose.dokploy.yml` (app + postgres + volumes persistants)
- `.env.dokploy.example` (variables a copier dans Dokploy)

## 2) Preparer ton repo
1. Commit/push ces fichiers sur ton repository Git.
2. Verifie que tu as bien ton domaine pret.

## 3) Creer le projet dans Dokploy
1. `New Project` > `Docker Compose`.
2. Connecte ton repo Git.
3. Selectionne le fichier: `docker-compose.dokploy.yml`.

## 4) Configurer les variables d'environnement
Dans Dokploy, colle les variables de `.env.dokploy.example` avec tes vraies valeurs.

Variables critiques:
- `NEXT_PUBLIC_SITE_URL=https://ton-domaine.fr`
- `AUTH_SECRET` (long secret random)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- `RUN_DB_SEED_ON_START=true` (a activer une seule fois pour injecter services/chantiers de presentation)
- `POSTGRES_*`
- `SMTP_*` + `MAIL_FROM` + `CONTACT_RECEIVER`

## 5) Domaine et HTTPS
1. Dans Dokploy, attache ton domaine au service `app`.
2. Active TLS/SSL (Let's Encrypt) dans Dokploy.
3. Pointe ton DNS vers le serveur Dokploy.

## 6) Deploy
1. Lance `Deploy`.
2. Attends que les healthchecks passent.
3. Ouvre le site et teste:
   - Home
   - Contact (envoi mail)
   - Admin login

## 7) Check post-deploiement (important)
1. Va sur `/admin/login` et connecte-toi.
2. Mets a jour dans Settings:
   - Nom entreprise
   - Telephone
   - Adresse
   - Google Maps
   - Logo / Hero
3. Verifie:
   - `/robots.txt`
   - `/sitemap.xml`
   - image hero visible

## 8) Recommandations prod minimales
1. Utilise des mots de passe forts (admin + DB + SMTP).
2. Sauvegardes:
   - volume Postgres
   - volume uploads
3. Ne jamais committer un vrai `.env` en public.

## 9) Mise a jour ensuite
Pour chaque changement:
1. Push Git
2. Redeploy dans Dokploy

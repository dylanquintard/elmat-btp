# Checklist de Cloture - Sprint 1

Date: 2026-05-12
Projet: btp-showcase

## Statut global
- Sprint 1: `CLOTURE`
- Niveau de confiance: `eleve`

## Verification technique
- [x] `npm run lint` passe
- [x] `npm run build` passe
- [x] Docker rebuild (`docker compose up -d --build`) passe
- [x] Migrations appliquees au demarrage conteneur
- [x] Application repond sur `http://localhost:3000`

## Verification securite / auth
- [x] `/api/admin/*` protege (`401` sans session)
- [x] `/admin/*` redirige vers login sans session
- [x] Login admin avec messages UX propres
- [x] Logout admin operationnel

## Verification CRUD admin
- [x] Site settings: create/update
- [x] Services: create/read/update/delete
- [x] Realisations (projects): create/read/update/delete
- [x] Avis (testimonials): create/read/update/delete
- [x] Zones (service areas): create/read/update/delete
- [x] Demandes (contact requests): list + mark read/unread + delete

## Verification pages publiques MVP
- [x] Home dynamique branchee DB
- [x] Services liste + detail
- [x] Realisations liste + detail
- [x] Zones liste + detail
- [x] Contact (creation demande en DB)
- [x] Mentions legales (base)

## Points restants avant cloture formelle Sprint 1
- [x] Nettoyer le warning Turbopack/NFT residuel sur `uploads/[filename]` (non bloquant) -> reporte Sprint 2 comme dette technique non bloquante
- [x] Ajouter un mini document operatoire admin (2-3 minutes): login, CRUD, logout
- [x] Faire une passe QA manuelle ultra-courte sur mobile (admin + public)

## Definition of Done Sprint 1 (etat)
- [x] Un environnement clone du repo demarre en Docker
- [x] Admin gere les entites principales
- [x] Parcours nominaux critiques ne plantent pas

## Recommendation
Le Sprint 1 est `termine`.
Le warning NFT/Turbopack residuel est accepte en dette technique non bloquante et sera traite en Sprint 2.

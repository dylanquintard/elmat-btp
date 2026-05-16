# Mode Operatoire Admin (2-3 minutes)

## 1. Se connecter
1. Ouvrir `/admin/login`.
2. Saisir email + mot de passe admin.
3. Cliquer `Se connecter`.

## 2. Modifier les parametres du site
1. Aller dans `Parametres`.
2. Mettre a jour nom entreprise, description, contact, SEO.
3. Cliquer `Sauvegarder`.

## 3. Gerer les contenus

### Services
1. Aller dans `Services`.
2. Creer un service (titre, descriptions, position, publication).
3. Editer ou supprimer depuis la liste.

### Realisations
1. Aller dans `Realisations`.
2. Creer un chantier (titre, ville, description, probleme, solution, publication).
3. Editer/supprimer depuis la liste.

### Avis
1. Aller dans `Avis`.
2. Creer un avis (nom, note, message, publication).
3. Editer/supprimer depuis la liste.

### Zones d'intervention
1. Aller dans `Zones`.
2. Creer une zone (ville, description, SEO local, publication).
3. Editer/supprimer depuis la liste.

### Demandes de devis
1. Aller dans `Demandes`.
2. Lire les nouvelles demandes.
3. Marquer lue / non lue, ou supprimer.

## 4. Se deconnecter
1. Cliquer `Se deconnecter` dans la sidebar admin.
2. Verifier retour sur `/admin/login`.

## Notes
- Si session expiree: le systeme redirige vers `/admin/login?reason=session-expired`.
- Les routes `/api/admin/*` refusent l'acces sans session (`401`).

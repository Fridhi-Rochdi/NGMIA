# Mise en ligne de NextGen MarketingAI

Ce guide couvre les six points bloquants du lancement. Ce qui est fait dans le code est indiqué ✅ ; ce qui demande une action sur un compte externe est indiqué 👤.

## 1. Serveur et HTTPS ✅ prêt · 👤 à lancer

Tout est dans `deploy/` :

| Fichier | Rôle |
|---|---|
| `docker-compose.prod.yml` | Postgres, sauvegarde quotidienne, API, application, console admin, proxy HTTPS |
| `Caddyfile` | `app.<domaine>`, `api.<domaine>`, `admin.<domaine>` ; certificats HTTPS automatiques |
| `.env.production.example` | Toutes les variables, avec ce qui est obligatoire |

Images Docker : `backend/Dockerfile`, `frontend/Dockerfile`, `admin/Dockerfile`. Les migrations de base sont appliquées automatiquement au démarrage de l'API.

**Étapes**

1. Un serveur Linux avec Docker : 2 vCPU et 4 Go de RAM suffisent pour démarrer. Exemples : Hetzner CX23 ou CPX22, OVH, Scaleway.
2. DNS : créer des enregistrements A pour `<domaine>`, `app.<domaine>`, `api.<domaine>` et `admin.<domaine>` vers l'IP du serveur.
3. Sur le serveur :
   ```bash
   git clone --recurse-submodules https://github.com/Fridhi-Rochdi/NGMIA.git && cd NGMIA/deploy
   cp .env.production.example .env   # remplir toutes les valeurs
   docker compose -f docker-compose.prod.yml up -d --build
   docker compose -f docker-compose.prod.yml exec backend node dist/prisma/seed-plans.js
   ```
   Le dépôt `admin/` doit aussi être présent sur le serveur (il n'est pas encore versionné, voir point 0).
4. Vérifier : `https://app.<domaine>` doit afficher la page d'accueil, et `https://api.<domaine>/health` doit répondre.

**Sauvegardes** : la base est sauvegardée chaque nuit dans `deploy/backups` (7 jours, 4 semaines, 6 mois). Copier ce dossier ailleurs chaque jour, par exemple vers un stockage objet avec `rclone`, car une sauvegarde sur le même disque ne survit pas à la perte du disque.

**Fichiers** : logos, photos et pages publiées sont dans le volume Docker `uploads`, conservé entre les déploiements. Il faut l'inclure dans la copie externe.

## 2. Fournisseur IA 👤

- Recharger le crédit sur platform.openai.com → Billing.
- **Limits** : fixer un budget mensuel et une alerte e-mail à 50 % et 80 %. Sans crédit, toutes les générations échouent ; l'application affiche alors « crédit du fournisseur IA épuisé ».
- Les tarifs et le coût de chaque génération sont détaillés dans `PRICING.md`.

## 3. Pages juridiques ✅ rédigées · 👤 à compléter

- Pages publiées : `/legal/mentions-legales`, `/legal/cgu`, `/legal/cgv`, `/legal/confidentialite`, `/legal/suppression-donnees` et `/contact`.
- Les passages **surlignés en jaune** sont à compléter : raison sociale, immatriculation, adresse, hébergeur, adresse e-mail dédiée aux données, droit applicable.
- **Faire relire par un juriste** avant d'encaisser le premier paiement.
- Le formulaire de contact envoie les messages à `CONTACT_EMAIL`.

## 4. Réseaux sociaux 👤 — à lancer en premier (délai Meta)

Adresse de redirection à déclarer dans chaque application : `https://api.<domaine>/social/oauth/callback`

**Meta (Facebook et Instagram)** — developers.facebook.com
1. Créer une application de type *Business*.
2. Ajouter les produits *Facebook Login* et *Instagram Graph API*.
3. Permissions à demander : `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`.
4. Renseigner les URL demandées :
   - politique de confidentialité : `https://app.<domaine>/legal/confidentialite`
   - suppression des données : `https://app.<domaine>/legal/suppression-donnees`
   - conditions : `https://app.<domaine>/legal/cgu`
5. **Vérification de l'entreprise et App Review**, avec une vidéo montrant la connexion d'une Page puis une publication. Compter 2 à 6 semaines.
6. Reporter `FACEBOOK_CLIENT_ID` et `FACEBOOK_CLIENT_SECRET` dans `.env`. Instagram utilise la même application.

**LinkedIn** — linkedin.com/developers : produits *Sign In with LinkedIn using OpenID Connect* et *Share on LinkedIn* (portée `w_member_social`).

**X** — developer.x.com : application OAuth 2.0 avec les portées `tweet.write`, `tweet.read`, `users.read` et `offline.access`. Publier via l'API X nécessite une offre payante chez X.

## 5. Paiement 👤

1. Stripe → activer le compte (identité, compte bancaire), puis passer en mode *Live*.
2. Mettre `sk_live_…` dans `STRIPE_SECRET_KEY`.
3. *Developers → Webhooks* : ajouter l'endpoint `https://api.<domaine>/billing/webhook` avec les événements `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid` et `invoice.payment_failed`, puis reporter le secret dans `STRIPE_WEBHOOK_SECRET`.
4. Charger le catalogue : `node dist/prisma/seed-plans.js` dans le conteneur de l'API (déjà fait en local). Les offres Essentiel, Pro et Business sont créées ; les anciennes sont masquées.
5. Configurer la TVA (*Stripe Tax* ou taux manuel) selon le pays de l'entreprise.

## 6. E-mails 👤

Remplacer le Gmail personnel par un service transactionnel (Brevo, Postmark, Resend) avec un domaine vérifié (SPF, DKIM, DMARC). Sans cela, les codes de connexion finissent en spam.

## 0. Versionner le code ✅

Le travail est commité sur la branche `task/002-baseline` de chaque dépôt. Le dossier `admin/` reste à versionner, dans son propre dépôt ou dans le dépôt principal.

## Vérification avant ouverture

- [ ] Créer un compte, ajouter un logo et vérifier les couleurs.
- [ ] Générer un menu, un site, une affiche et un post avec image.
- [ ] Connecter Facebook, programmer un post et vérifier sa publication automatique.
- [ ] Payer l'offre Essentiel avec une vraie carte, puis résilier.
- [ ] Envoyer un message depuis `/contact`.
- [ ] Restaurer une sauvegarde sur un serveur de test.

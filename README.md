# 🚀 NextGen MarketingAI

Plateforme SaaS **multi-tenant** propulsée par l'IA, destinée aux PME : identité de marque,
site web, menu digital, affiches, images marketing, posts sociaux, QR codes et calendrier éditorial.

## 📁 Architecture

```
nextgen-marketingai/
├── backend/            # NestJS 10 + Prisma 5 (dépôt Git séparé, submodule)
├── frontend/           # Next.js 16 App Router (dépôt Git séparé, submodule)
├── skills/             # Prompts de référence (.md) — documentation, non chargés par le code
├── docker-compose.yml  # PostgreSQL 16 + pgAdmin
├── .env.example        # Toutes les variables d'environnement
└── TASKS.md            # Registre de remédiation
```

> `backend/` et `frontend/` sont des **submodules Git**. Clonez avec `--recurse-submodules`.

## 🧩 Modules

| Module | Rôle | Publication |
|--------|------|-------------|
| **Auth** | Inscription, JWT, super-admin bootstrap | — |
| **Tenant** | Isolation multi-tenant, plans, quotas | — |
| **Branding** | Identité de marque + logo généré (IA) | — |
| **Website** | Générateur de sites, éditeur CMS click-to-edit | Déploiement **Vercel réel** |
| **Menu** | Menus digitaux (5 templates) + QR code | Page publique `/menu/:slug` |
| **Poster** | Affiches avec direction artistique IA en 2 passes | Page publique `/poster/:slug` |
| **Images** | Génération d'images marketing (FLUX) + upload | — |
| **Content** | Copy marketing (posts, blogs, pubs, emails) | — |
| **Social** | Posts par plateforme, comptes connectés | OAuth **simulé** |
| **Planner** | Calendrier éditorial généré | — |
| **QR Code** | URL, menu, poster, vCard, WiFi | — |
| **Reels** | Scripts vidéo structurés (générateur déterministe) | — |
| **Dashboard** | Statistiques, activité, analytics 6 mois | — |
| **Payment** | Plans, abonnements, factures, moyens de paiement | Stripe **non branché** |

## 🛠️ Stack

- **Frontend** : Next.js 16 (App Router, `src/proxy.ts`), React 18, TypeScript, Tailwind CSS 3, Zustand
- **Backend** : NestJS 10, **Prisma 5**, PostgreSQL 16, Passport-JWT, bcrypt, Swagger
- **IA** : **NVIDIA NIM** (réel) — texte `moonshotai/kimi-k3`, branding `z-ai/glm-5.2`, images `black-forest-labs/flux.*`
- **Déploiement des sites générés** : API Vercel v13

## 🚀 Démarrage

```bash
# 1. Cloner avec les submodules
git clone --recurse-submodules <url> && cd nextgen-marketingai

# 2. Base de données
docker-compose up -d

# 3. Variables d'environnement
cp .env.example .env
cp .env.example backend/.env    # renseignez au minimum JWT_SECRET et NVIDIA_NIM_API_KEY

# 4. Backend
cd backend
npm install
npm run prisma:generate
npm run prisma:deploy           # applique l'historique de migrations
npm run db:seed                 # optionnel : tenant + utilisateur de démo
npm run start:dev               # http://localhost:4000 — Swagger sur /api/docs

# 5. Frontend
cd ../frontend
npm install
npm run dev                     # http://localhost:3000
```

## 🔑 Configuration requise

| Variable | Obligatoire | Effet si absente |
|----------|-------------|------------------|
| `JWT_SECRET` | ✅ | Le backend refuse de démarrer |
| `DATABASE_URL` | ✅ | Pas de connexion base |
| `NVIDIA_NIM_API_KEY` | ✅ | Toutes les générations IA échouent |
| `VERCEL_TOKEN` | ⚠️ | La publication de sites échoue |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ⚪ | Pas de super-admin |
| `DEBUG_AI=true` | ⚪ | Active les traces verbeuses (jamais en production) |

Voir [`.env.example`](.env.example) pour la liste exhaustive.

## 🧪 Tests

```bash
cd backend
npm test          # tests unitaires
npm run test:e2e  # tests end-to-end
```

## 📌 Limites connues

- L'OAuth réseaux sociaux est **simulé** (jetons factices, aucune publication réelle).
- Le module **Payment** expose le CRUD mais n'est pas relié à Stripe.
- Les images générées sont stockées en **data URI base64** dans le contenu des sites.
- Les invitations d'utilisateurs (`UserRole.MEMBER`) ne sont pas implémentées.

Voir [`TASKS.md`](TASKS.md) pour le registre de remédiation détaillé.

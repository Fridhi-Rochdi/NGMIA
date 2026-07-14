# 🚀 NextGen MarketingAI

Plateforme SaaS IA pour PME — Génération de contenu marketing, posts réseaux sociaux, images, branding et planification.

## 📁 Architecture

```
nextgen-marketingai/
├── frontend/          # Next.js (App Router) - Dashboard CMS
├── backend/           # NestJS - API modulaire
├── skills/             # Système de prompts IA (.md)
├── docker-compose.yml  # PostgreSQL + pgAdmin
└── .env.example        # Variables d'environnement
```

## 🧩 Modules

| Module | Description |
|--------|-------------|
| Auth | Authentification & JWT |
| Tenant | Multi-tenant SaaS |
| Content | Génération de contenu marketing |
| Social | Posts réseaux sociaux |
| Images | Génération d'images marketing |
| Branding | Kit de branding |
| Planner | Calendrier de contenu |
| AI Engine | Moteur IA simulé (skills .md) |

## 🛠️ Stack

- **Frontend** : Next.js 14 (App Router), Tailwind CSS, TypeScript
- **Backend** : NestJS, TypeORM, PostgreSQL
- **IA** : Simulée via fichiers skills .md

## 🚀 Démarrage

```bash
# 1. Lancer PostgreSQL
docker-compose up -d

# 2. Copier les variables d'environnement
cp .env.example .env

# 3. Backend
cd backend && npm install && npm run start:dev

# 4. Frontend
cd frontend && npm install && npm run dev
```

## 🔑 API Keys (Simulées)

- `OPENAI_API_KEY=fake`
- `IMAGE_API_KEY=fake`

# NextGen MarketingAI - Task Execution Plan

> **Note (audit du 2026-09-14)** : ce plan date de la phase de prototypage
> (« IA SIMULÉE uniquement, fake API keys »). Le produit a depuis largement
> dépassé ce périmètre : l'IA est **réelle** (NVIDIA NIM) et les modules
> Website, Menu, Poster, QR Code, Reels, Dashboard et Payment — absents de ce
> plan — ont été livrés. Les statuts ci-dessous ont été réalignés sur le code.
> Le registre de remédiation actif est [`TASKS.md`](TASKS.md).

## Overview
SaaS IA pour PME permettant : génération de contenu marketing, création de posts réseaux sociaux, génération d'images marketing, création de branding, planification de contenu.

## Stack Technique
- **Frontend** : Next.js (App Router)
- **Backend** : NestJS (modulaire)
- **Database** : PostgreSQL
- **Architecture** : SaaS multi-tenant
- **IA** : SIMULÉE uniquement (fake APIs)

## Règles Critiques
- Travail en MODE TASK EXECUTION
- Une seule task à la fois
- Attendre validation implicite avant de continuer
- Utiliser fake API keys : OPENAI_API_KEY=fake, IMAGE_API_KEY=fake

---

## TASKS

### TASK-001 : Initialisation du projet et structure de base
**Module** : devops  
**Objective** : Créer la structure du monorepo avec Docker Compose, backend NestJS et frontend Next.js  
**Steps** :
1. Créer `docker-compose.yml` avec PostgreSQL
2. Initialiser le backend NestJS avec les modules de base
3. Initialiser le frontend Next.js avec TypeScript
4. Créer la structure des dossiers pour les skills
5. Ajouter les fichiers de configuration de base (.env.example, .gitignore)

**Expected Output** :
- `docker-compose.yml` fonctionnel
- `backend/` avec NestJS initialisé
- `frontend/` avec Next.js initialisé
- `skills/` avec les fichiers .md de base

**Dependencies** : Aucune  
**Status** : `completed`

---

### TASK-002 : Configuration PostgreSQL et Prisma
**Module** : database  
**Objective** : Configurer la base de données PostgreSQL et Prisma ORM  
**Steps** :
1. Ajouter Prisma au backend NestJS
2. Créer le schema Prisma pour le multi-tenant (Tenant, User, etc.)
3. Créer les migrations initiales
4. Configurer le module Prisma dans NestJS
5. Tester la connexion à la base de données

**Expected Output** :
- Schema Prisma complet avec modèles de base
- Migrations initiales générées
- Module Prisma fonctionnel dans NestJS

**Dependencies** : TASK-001  
**Status** : `completed`

---

### TASK-003 : Système d'authentification (Auth)
**Module** : backend  
**Objective** : Implémenter l'authentification JWT avec register/login  
**Steps** :
1. Créer le module Auth dans NestJS
2. Implémenter les endpoints `/auth/register` et `/auth/login`
3. Générer et valider les tokens JWT
4. Créer le guard d'authentification
5. Hasher les mots de passe avec bcrypt

**Expected Output** :
- Module Auth fonctionnel
- Endpoints register/login testables
- JWT tokens générés et validés

**Dependencies** : TASK-002  
**Status** : `completed`

---

### TASK-004 : Système multi-tenant
**Module** : backend  
**Objective** : Implémenter l'isolation des données par tenant  
**Steps** :
1. Créer le middleware/contexte multi-tenant
2. Implémenter la résolution du tenant par sous-domaine ou header
3. Filtrer toutes les requêtes par tenant_id
4. Créer le module Tenant avec CRUD de base
5. Associer les utilisateurs à un tenant

**Expected Output** :
- Isolation complète des données par tenant
- Middleware tenant fonctionnel
- CRUD Tenant opérationnel

**Dependencies** : TASK-003  
**Status** : `completed`

---

### TASK-005 : Frontend - Pages d'authentification
**Module** : frontend  
**Objective** : Créer les pages login et register  
**Steps** :
1. Créer la page `/login` avec formulaire
2. Créer la page `/register` avec formulaire
3. Implémenter la gestion du state d'authentification (Context/Redux)
4. Stocker le token JWT dans les cookies/localStorage
5. Gérer les redirections post-authentification

**Expected Output** :
- Pages login et register fonctionnelles
- State d'authentification persistant
- Redirections correctes

**Dependencies** : TASK-003  
**Status** : `completed`

---

### TASK-006 : Frontend - Layout Dashboard et Navigation
**Module** : frontend  
**Objective** : Créer le layout principal du dashboard avec navigation  
**Steps** :
1. Créer le layout du dashboard avec sidebar
2. Implémenter la navigation entre les sections (branding, content, images, planner, social)
3. Créer le composant Header avec info utilisateur
4. Gérer la protection des routes (route guard)
5. Créer la page d'accueil du dashboard

**Expected Output** :
- Layout dashboard responsive
- Navigation fonctionnelle entre les modules
- Protection des routes authentifiées

**Dependencies** : TASK-005  
**Status** : `completed`

---

### TASK-007 : AI Engine - Structure et Simulation
**Module** : ai-engine  
**Objective** : Créer le module AI Engine avec simulation d'API  
**Steps** :
1. Créer le module AI Engine dans NestJS
2. Implémenter le service de simulation d'IA (fake responses)
3. Créer les DTOs pour les requêtes/réponses IA
4. Implémenter la génération de texte simulée
5. Implémenter la génération d'image simulée (URLs placeholder)

**Expected Output** :
- Module AI Engine fonctionnel
- Simulation de génération de texte
- Simulation de génération d'image

**Dependencies** : TASK-004  
**Status** : `completed`

---

### TASK-008 : Module Content - Génération de contenu marketing
**Module** : backend  
**Objective** : Implémenter le module de génération de contenu marketing  
**Steps** :
1. Créer le module Content dans NestJS
2. Implémenter le service de génération de contenu (utilise AI Engine)
3. Créer les endpoints pour générer du contenu
4. Implémenter le stockage du contenu généré
5. Créer le fichier skill `/skills/generate_post.md`

**Expected Output** :
- Module Content avec CRUD
- Génération de contenu marketing fonctionnelle
- Skill file `generate_post.md` créé

**Dependencies** : TASK-007  
**Status** : `completed`

---

### TASK-009 : Module Social - Posts réseaux sociaux
**Module** : backend  
**Objective** : Implémenter le module de création de posts réseaux sociaux  
**Steps** :
1. Créer le module Social dans NestJS
2. Implémenter le service de génération de posts sociaux
3. Créer les endpoints pour gérer les posts
4. Implémenter les templates de posts par plateforme (LinkedIn, Twitter, etc.)
5. Créer le fichier skill `/skills/generate_social_post.md`

**Expected Output** :
- Module Social avec CRUD
- Génération de posts par plateforme
- Templates de posts fonctionnels

**Dependencies** : TASK-008  
**Status** : `completed`

---

### TASK-010 : Module Images - Génération d'images marketing
**Module** : backend  
**Objective** : Implémenter le module de génération d'images marketing  
**Steps** :
1. Créer le module Images dans NestJS
2. Implémenter le service de génération d'images (utilise AI Engine)
3. Créer les endpoints pour générer et stocker les images
4. Implémenter le stockage des images (local/cloud simulé)
5. Créer le fichier skill `/skills/generate_image.md`

**Expected Output** :
- Module Images avec génération simulée
- Stockage et récupération des images
- Skill file `generate_image.md` créé

**Dependencies** : TASK-007  
**Status** : `completed`

---

### TASK-011 : Module Branding - Création de branding
**Module** : backend  
**Objective** : Implémenter le module de création de branding  
**Steps** :
1. Créer le module Branding dans NestJS
2. Implémenter le service de génération de branding (nom, logo, couleurs, etc.)
3. Créer les endpoints pour gérer les projets de branding
4. Implémenter la génération de palettes de couleurs et typographie
5. Créer le fichier skill `/skills/generate_branding.md`

**Expected Output** :
- Module Branding avec CRUD
- Génération de branding simulée
- Skill file `generate_branding.md` créé

**Dependencies** : TASK-007  
**Status** : `completed`

---

### TASK-012 : Module Planner - Planification de contenu
**Module** : backend  
**Objective** : Implémenter le module de planification de contenu  
**Steps** :
1. Créer le module Planner dans NestJS
2. Implémenter le calendrier de contenu (dates, statuts)
3. Créer les endpoints pour planifier et gérer le contenu
4. Implémenter les rappels et notifications simulés
5. Créer le fichier skill `/skills/generate_calendar.md`

**Expected Output** :
- Module Planner avec CRUD
- Calendrier de contenu fonctionnel
- Skill file `generate_calendar.md` créé

**Dependencies** : TASK-008, TASK-009  
**Status** : `completed`

---

### TASK-013 : Frontend - Module Content
**Module** : frontend  
**Objective** : Créer l'interface du module Content  
**Steps** :
1. Créer la page `/content` dans le dashboard
2. Implémenter le formulaire de génération de contenu
3. Afficher l'historique du contenu généré
4. Intégrer les API du backend
5. Gérer les états de chargement et erreurs

**Expected Output** :
- Page Content fonctionnelle
- Génération et affichage du contenu
- Historique du contenu

**Dependencies** : TASK-008  
**Status** : `completed`

---

### TASK-014 : Frontend - Module Social
**Module** : frontend  
**Objective** : Créer l'interface du module Social  
**Steps** :
1. Créer la page `/social` dans le dashboard
2. Implémenter le formulaire de création de posts
3. Afficher les posts générés avec prévisualisation
4. Intégrer les API du backend
5. Ajouter les templates de posts par plateforme

**Expected Output** :
- Page Social fonctionnelle
- Création et prévisualisation de posts
- Templates par plateforme

**Dependencies** : TASK-009  
**Status** : `completed`

---

### TASK-015 : Frontend - Module Images
**Module** : frontend  
**Objective** : Créer l'interface du module Images  
**Steps** :
1. Créer la page `/images` dans le dashboard
2. Implémenter le formulaire de génération d'images
3. Afficher la galerie d'images générées
4. Intégrer les API du backend
5. Implémenter le téléchargement des images

**Expected Output** :
- Page Images fonctionnelle
- Génération et galerie d'images
- Téléchargement des images

**Dependencies** : TASK-010  
**Status** : `completed`

---

### TASK-016 : Frontend - Module Branding
**Module** : frontend  
**Objective** : Créer l'interface du module Branding  
**Steps** :
1. Créer la page `/branding` dans le dashboard
2. Implémenter le formulaire de création de branding
3. Afficher les projets de branding avec palettes de couleurs
4. Intégrer les API du backend
5. Prévisualisation du branding généré

**Expected Output** :
- Page Branding fonctionnelle
- Création et prévisualisation de branding
- Affichage des palettes de couleurs

**Dependencies** : TASK-011  
**Status** : `completed`

---

### TASK-017 : Frontend - Module Planner
**Module** : frontend  
**Objective** : Créer l'interface du module Planner  
**Steps** :
1. Créer la page `/planner` dans le dashboard
2. Implémenter le calendrier interactif
3. Afficher et gérer les contenus planifiés
4. Intégrer les API du backend
5. Implémenter le drag & drop pour la planification

**Expected Output** :
- Page Planner fonctionnelle
- Calendrier interactif
- Gestion des contenus planifiés

**Dependencies** : TASK-012  
**Status** : `completed`

---

### TASK-018 : Frontend - Module Settings
**Module** : frontend  
**Objective** : Créer la page des paramètres utilisateur et tenant  
**Steps** :
1. Créer la page `/settings` dans le dashboard
2. Implémenter le formulaire de profil utilisateur
3. Implémenter les paramètres du tenant (nom, branding, etc.)
4. Gérer la mise à jour des informations
5. Intégrer les API du backend

**Expected Output** :
- Page Settings fonctionnelle
- Gestion du profil et du tenant
- Mise à jour des informations

**Dependencies** : TASK-004  
**Status** : `completed`

---

### TASK-019 : Tests et Qualité
**Module** : devops  
**Objective** : Ajouter les tests et assurer la qualité du code  
**Steps** :
1. Configurer Jest pour le backend et le frontend
2. Écrire les tests unitaires pour les services critiques
3. Écrire les tests d'intégration pour les API
4. Configurer ESLint et Prettier
5. Vérifier la qualité du code et corriger les erreurs

**Expected Output** :
- Tests unitaires et d'intégration passants
- Configuration ESLint/Prettier complète
- Code propre et documenté

**Dependencies** : TASK-017  
**Status** : `partial` — 1 suite de tests unitaires (website-content.builder) ; couverture auth/multi-tenant/IA absente

---

### TASK-020 : Documentation et Livraison Finale
**Module** : devops  
**Objective** : Finaliser la documentation et préparer le projet pour la production  
**Steps** :
1. Compléter le README.md avec les instructions d'installation et d'utilisation
2. Documenter les API avec Swagger
3. Vérifier la configuration Docker pour la production
4. Créer un guide de déploiement
5. Faire une revue finale du projet

**Expected Output** :
- README.md complet et clair
- Documentation API Swagger accessible
- Configuration Docker production-ready
- Guide de déploiement fourni

**Dependencies** : TASK-019  
**Status** : `partial` — README et .env.example à jour ; pas de doc de déploiement ni de CI/CD

---

## Notes
- Chaque task doit être complétée et validée avant de passer à la suivante.
- Les skills sont des fichiers `.md` dans le dossier `/skills/` qui définissent les prompts et comportements des features IA.
- Les APIs IA sont simulées (fake) et ne nécessitent pas de clés réelles.

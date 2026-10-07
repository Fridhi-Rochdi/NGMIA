# Backlog — NextGen MarketingAI

> PO / Tech Lead : Claude · Développeur : Antigravity · Décideur final : Project Owner.
> Source : [`AUDIT_TECHNIQUE.md`](AUDIT_TECHNIQUE.md) (identifiants SEC-, MT-, DB-, BE-, FE-, AI-) et [`AUDIT_PROMPTS.md`](AUDIT_PROMPTS.md).
> Statuts : `TODO` · `IN_PROGRESS` · `IN_REVIEW` · `CHANGES_REQUIRED` · `APPROVED`. **Seul Claude passe une tâche en APPROVED, après revue.**

---

## Règles pour Antigravity (s'appliquent à toutes les tâches)

1. **Une tâche = une branche = un objectif.** Branche `task/NNN-slug` dans chaque submodule concerné. Aucun changement hors du périmètre (`SCOPE`).
2. **Lire avant d'écrire** : ouvrir chaque fichier de `FILES TO INSPECT` avant de modifier.
3. **Ne jamais** : lire un `tenantId` depuis le body, la query ou un en-tête ; retirer un guard ; désactiver un test ; renvoyer un secret au client ; changer un prompt IA sans que la tâche le demande.
4. **Commandes obligatoires avant le rapport** (backend) : `npx tsc --noEmit -p tsconfig.json`, `npx eslint src`, `npx jest`. Frontend/admin : `npx tsc --noEmit`, `npm run lint`, `npm run build`.
5. **Rapport de fin de tâche** (format imposé) :
   ```text
   TASK: TASK-NNN
   BRANCH:
   FILES CHANGED: (liste + une ligne par fichier)
   WHAT WAS DONE:
   ACCEPTANCE CRITERIA: (chaque critère : DONE / NOT DONE + preuve)
   COMMANDS RUN + RESULTS: (tsc / eslint / jest / build, sortie résumée)
   TESTS ADDED:
   DEVIATIONS FROM SPEC: (aucune, ou justification)
   OPEN QUESTIONS:
   ```
6. Si la spécification est ambiguë ou contredite par le code : **s'arrêter et poser la question** dans `OPEN QUESTIONS` plutôt qu'interpréter.

---

## K. BACKLOG

Vue d'ensemble :

| ID | Titre | Type | Prio | Complexité | Dépend de |
|---|---|---|---|---|---|
| TASK-001 | Appliquer et vérifier la migration `brand_platform` | BUG | P0 | S | — |
| TASK-002 | Établir la baseline : revue et commit du lot IA du 2026-09-28 | DOCUMENTATION | P0 | S | 001 |
| TASK-003 | Ne plus jamais renvoyer les jetons OAuth sociaux | SECURITY | P0 | S | 002 |
| TASK-004 | Mettre en place la CI (build, lint, type-check, tests) | TEST | P1 | M | 002 |
| TASK-005 | Tests e2e d'isolation multi-tenant exécutables en CI | TEST | P1 | M | 004 |
| TASK-006 | Dériver le tenant du JWT et appliquer le contrôle globalement | SECURITY | P1 | M | 005 |
| TASK-007 | Supprimer les endpoints IA bruts `/ai-engine/*` | SECURITY | P1 | S | 002 |
| TASK-008 | Contrainte d'unicité sur `Menu.slug` | BUG | P1 | S | 001 |
| TASK-009 | Reprise des rendus bloqués en RENDERING/PENDING | BUG | P1 | M | 002 |
| TASK-010 | Remplacer le nettoyage regex du HTML de poster par un sanitizer allowlist | SECURITY | P1 | M | 002 |
| TASK-011 | Filtre d'exceptions global (validation + erreurs non HTTP) | BUG | P1 | S | 002 |
| TASK-012 | Access token 15 min | SECURITY | P1 | S | 002 |
| TASK-013 | Connexion non ambiguë quand un e-mail existe dans plusieurs tenants | BUG | P1 | S | 002 |
| TASK-014 | Vérification réelle des générateurs IA réécrits | TEST | P1 | M | 001, 002 |
| TASK-015 | Index `tenantId` sur les tables métier | PERFORMANCE | P1 | S | 001 |
| TASK-016 | Marque active explicite | BUG | P2 | M | 001 |
| TASK-017 | Chiffrer les jetons OAuth au repos | SECURITY | P2 | M | 003 |
| TASK-018 | Vérification de l'e-mail à l'inscription | SECURITY | P2 | M | 013 |
| TASK-019 | Content-Security-Policy sur le frontend | SECURITY | P2 | M | 004 |
| TASK-020 | Génération de poster asynchrone | PERFORMANCE | P2 | L | 009, 010 |
| TASK-021 | Téléchargement de poster : formats réels | BUG | P2 | M | 010 |
| TASK-022 | Validation de schéma des sorties JSON des LLM | REFACTOR | P2 | M | 014 |
| TASK-023 | Cache d'images par tenant | BUG | P2 | S | 002 |
| TASK-024 | Endpoint public du poster : projection minimale | SECURITY | P2 | S | 002 |
| TASK-025 | Socle RBAC sur les actions sensibles | SECURITY | P2 | M | 006 |
| TASK-026 | Découper `menu/create/page.tsx` | REFACTOR | P2 | M | 004 |
| TASK-027 | Uniformiser 404 sur ressource d'un autre tenant | SECURITY | P3 | S | 005 |
| TASK-028 | Égaliser le temps de réponse du login | SECURITY | P3 | S | 013 |
| TASK-029 | Expiration du state OAuth | SECURITY | P3 | S | — |
| TASK-030 | Statuts en enums Prisma | REFACTOR | P3 | M | 015 |
| TASK-031 | `CalendarEvent.imageId` : supprimer le champ mort | REFACTOR | P3 | S | 001 |
| TASK-032 | Journalisation unifiée, sans payload client | REFACTOR | P3 | M | — |
| TASK-033 | Durcir `docker-compose.yml` | SECURITY | P3 | S | — |

**Justification des P0** : TASK-001 = sans la migration, toute lecture de `Brand` échoue et tous les générateurs tombent (panne de production). TASK-002 = ~30 fichiers modifiés non commités dans deux submodules ; aucune autre tâche ne peut être revue proprement sans baseline. TASK-003 = des identifiants tiers (jetons OAuth) sortent du serveur ; correction triviale, risque de prise de contrôle des comptes sociaux clients.

**Justification des P1** : isolation multi-tenant (TASK-005/006 = exigence absolue, protection aujourd'hui correcte mais non testée et fragile) ; surface d'abus de coût (007) ; écrasement possible du menu d'un autre tenant (008) ; statuts bloqués définitivement visibles par les clients (009) ; HTML IA non fiable (010) ; erreurs illisibles pour l'utilisateur (011) ; session volée valable 24 h (012) ; connexion au mauvais compte (013) ; code IA réécrit jamais exécuté en réel sur 6 générateurs (014) ; scans complets des tables par tenant (015) ; pas de CI = aucune garantie de non-régression (004).

---

### TASK-001 — Appliquer et vérifier la migration `brand_platform`
- **TYPE** BUG · **PRIORITY** P0 · **COMPLEXITY** S · **DEPENDENCIES** aucune
- **BUSINESS OBJECTIVE** Les générateurs (site, menu, poster, reels, contenu, social) fonctionnent après déploiement du lot IA.
- **TECHNICAL OBJECTIVE** Les 7 colonnes ajoutées à `brands` existent dans chaque base.
- **CONTEXT / CURRENT PROBLEM** `backend/prisma/migrations/20260928000000_brand_platform/migration.sql` ajoute `mission, vision, personality, messagingAngle, voice, logoConcept, visualStyle`. Le client Prisma les sélectionne ; tant que la migration n'est pas appliquée, `prisma.brand.findFirst` lève une erreur (colonne inexistante).
- **FILES TO INSPECT** `backend/prisma/schema.prisma` (modèle Brand), la migration ci-dessus, `backend/src/common/brand-kit/brand-kit.service.ts`.
- **FILES LIKELY TO MODIFY** aucun (opération) ; éventuellement `README.md` (procédure).
- **IMPLEMENTATION REQUIREMENTS** Démarrer PostgreSQL ; `npx prisma migrate deploy` ; `npx prisma migrate status` ; vérifier que la migration est la dernière et qu'elle est appliquée.
- **DO NOT CHANGE** Le contenu de la migration, le schéma.
- **ACCEPTANCE CRITERIA**
  1. `prisma migrate status` indique « Database schema is up to date ».
  2. `\d brands` montre les 7 colonnes nullable.
  3. `GET /branding` et `POST /menus/generate` répondent sans erreur Prisma.
- **TESTS REQUIRED** Aucun nouveau test ; exécuter `npx jest`.
- **SECURITY REQUIREMENTS** Ne pas committer de `.env`.
- **VALIDATION METHOD** Sortie de `migrate status` + extrait `\d brands` dans le rapport.
- **RISKS** Faible (ajout de colonnes nullable).
- **EXPECTED RESULT** Base à jour, application démarre et génère.

### TASK-002 — Établir la baseline : revue et commit du lot IA du 2026-09-28
- **TYPE** DOCUMENTATION · **PRIORITY** P0 · **COMPLEXITY** S · **DEPENDENCIES** TASK-001
- **BUSINESS OBJECTIVE** Un point de départ versionné et relisible pour toutes les tâches suivantes.
- **TECHNICAL OBJECTIVE** Committer, dans des commits séparés et thématiques, les modifications non commitées des submodules `backend` et `frontend` et du dépôt racine.
- **CONTEXT** (constat du 2026-09-28, révisé) Le working tree des trois dépôts contient **des semaines de travail jamais commité** : modules entiers non suivis (backend `reels/`, `admin/`, `business-context/`, `billing*`, `common/*`, `prisma/migrations/`, `scripts/`, `test/` ; frontend `i18n/`, `auth/verify`, `settings/billing`, composants ; racine `admin/`), les remédiations T-01…T-29 de `TASKS.md` et le lot IA du jour (`AUDIT_PROMPTS.md`). De nombreux fichiers mélangent ces lots (ex. `menu.service.ts`) : **une séparation par auteur n'est pas réalisable** sans découpage manuel ligne à ligne. Décision : commits **par domaine fonctionnel**, plan validé par le Project Owner.
- **FILES TO INSPECT** `git status` / `git diff --stat` des dépôts racine, `backend`, `frontend` ; `.gitignore` de chacun.
- **FILES LIKELY TO MODIFY** aucun fichier source ; éventuellement `.gitignore` si un artefact généré ou un secret apparaîtrait dans la liste (à signaler, pas à corriger seul).
- **IMPLEMENTATION REQUIREMENTS**
  1. **Phase 1 — inventaire (sans commit)** : branche `task/002-baseline` dans `backend`, `frontend` et le dépôt racine. Lister fichiers modifiés, supprimés et non suivis par dépôt.
  2. **Scan de sécurité** avant tout `git add` : aucun `.env*` (sauf `.env.example`), aucune clé (`sk-`, `nvapi-`, `sk_live`, `whsec_`, `-----BEGIN`, `Bearer ` suivi d'une valeur), aucun `storage/`, `node_modules/`, `dist/`, `.next/`, `*.tsbuildinfo`, média généré, dump de base. Rapporter chaque occurrence trouvée.
  3. **Proposer un plan de commits** par domaine, par exemple — backend : (1) outillage/config (eslint, tsconfig, package*.json) ; (2) Prisma : schéma + migrations + seeds ; (3) socle commun (`common/*` hors `ai/`) ; (4) auth (cookies, OTP, refresh) ; (5) tenant/admin/quota/business-context ; (6) paiement/billing ; (7) social + planner ; (8) website ; (9) menu ; (10) poster ; (11) reels ; (12) contenu/images/branding ; (13) couche IA (`common/ai`, `ai-engine`, prompts) ; (14) scripts + tests. Frontend : (1) config/deps ; (2) auth + session ; (3) i18n ; (4) composants partagés ; (5) écrans par module ; (6) pages publiques ; (7) suppressions. Racine : documentation, `.gitmodules`, `admin/`, pointeurs de submodules.
  4. **S'ARRÊTER** et rendre le rapport de phase 1 (inventaire + scan + plan). **Aucun commit avant l'accord écrit du Project Owner.** Points à faire trancher : suivre `admin/` comme dossier ou submodule ; committer `.claude/` ou l'ignorer ; suppression de `cv.tex`.
  5. **Phase 2 — après accord** : committer selon le plan validé, messages clairs en anglais (`feat(menu): …`, `chore(prisma): …`). Mettre à jour les pointeurs de submodules dans le dépôt racine en dernier. **Ne pas pousser.**
- **DO NOT CHANGE** Aucune ligne de code ni de configuration applicative.
- **ACCEPTANCE CRITERIA** Phase 1 : inventaire complet, scan de secrets documenté, plan de commits. Phase 2 : `git status` propre dans les trois dépôts (hors fichiers ignorés volontairement, listés) ; aucun secret ni artefact commité ; `npx tsc --noEmit` + `npx jest` (52 verts) backend et `npx tsc --noEmit` frontend passent sur le dernier commit.
- **TESTS REQUIRED** Ceux ci-dessus, sur l'état final.
- **SECURITY REQUIREMENTS** Scan de secrets obligatoire avant `git add` ; en cas de doute, ne pas ajouter et demander.
- **VALIDATION METHOD** Claude relit le plan (phase 1) puis les commits (phase 2) : `git log --stat`, recherche de secrets sur l'historique ajouté.
- **RISKS** Commit d'un secret (irréversible une fois poussé) → scan + pas de push ; commits intermédiaires qui ne compilent pas → accepté (baseline), seul l'état final doit compiler.
- **EXPECTED RESULT** Baseline propre et versionnée sur `task/002-baseline`, non poussée.

### TASK-003 — Ne plus jamais renvoyer les jetons OAuth sociaux
- **TYPE** SECURITY · **PRIORITY** P0 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Les jetons d'accès aux pages Facebook/Instagram/LinkedIn des clients ne quittent jamais le serveur.
- **TECHNICAL OBJECTIVE** Toutes les réponses de `/social/accounts*` passent par `redact()`.
- **CURRENT PROBLEM** (SEC-01) `backend/src/modules/social/social.service.ts` : `connectAccount`, `findAllAccounts`, `findOneAccount`, `updateAccount` renvoient la ligne Prisma complète (`accessToken`, `refreshToken`). `redact()` (l.~195) n'est utilisé que par le callback OAuth.
- **FILES TO INSPECT** `social.service.ts`, `social.controller.ts`, `social-publisher.service.ts`, `planner/auto-post.service.ts` (vérifier quels appelants internes ont besoin du jeton).
- **FILES LIKELY TO MODIFY** `social.service.ts`, nouveau `social.service.spec.ts`.
- **IMPLEMENTATION REQUIREMENTS**
  1. Les méthodes appelées par le contrôleur renvoient `redact(account)` / `accounts.map(redact)`.
  2. Si un appelant interne a besoin du jeton, créer une méthode interne distincte (ex. `findAccountWithToken`) **non exposée** par le contrôleur.
  3. `disconnectAccount` ne renvoie pas de jeton non plus.
- **DO NOT CHANGE** Le flux OAuth, la publication, le schéma.
- **ACCEPTANCE CRITERIA**
  1. Aucune réponse HTTP de `SocialController` ne contient les clés `accessToken` ou `refreshToken`.
  2. Les réponses contiennent `hasToken: boolean`.
  3. La publication automatique fonctionne toujours (le publisher lit le jeton côté serveur).
- **TESTS REQUIRED** Spec unitaire : pour chaque méthode exposée, Prisma mocké renvoie un compte avec jetons → le résultat n'a pas ces clés.
- **SECURITY REQUIREMENTS** Aucune journalisation des jetons.
- **VALIDATION METHOD** Revue + `npx jest` + grep `accessToken` dans les retours du contrôleur.
- **RISKS** Faible : vérifié le 2026-09-28, le frontend ne lit jamais `accessToken`/`refreshToken` d'un compte social (les seules occurrences concernent la session utilisateur : `useAuth.tsx`, `api.ts`, `types/index.ts AuthResponse`). Refaire le grep avant de livrer.
- **EXPECTED RESULT** Jetons invisibles côté client.

### TASK-004 — Mettre en place la CI
- **TYPE** TEST · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Aucune régression n'atteint `main` sans être détectée.
- **TECHNICAL OBJECTIVE** Workflow GitHub Actions par dépôt (backend, frontend) sur PR et push `main`.
- **CURRENT PROBLEM** Aucun dossier `.github/` ; vérifications uniquement manuelles.
- **FILES TO INSPECT** `backend/package.json`, `frontend/package.json`, `admin/package.json`, `backend/test/jest-e2e.json`.
- **FILES LIKELY TO MODIFY** `backend/.github/workflows/ci.yml`, `frontend/.github/workflows/ci.yml` (dans chaque submodule).
- **IMPLEMENTATION REQUIREMENTS** Backend : service PostgreSQL 16, `npm ci`, `npx prisma generate`, `npx prisma migrate deploy`, `npx tsc --noEmit`, `npx eslint src`, `npx jest`. Frontend : `npm ci`, `npx tsc --noEmit`, `npm run lint`, `npm run build`. Aucune clé IA en CI (les tests ne doivent pas appeler de fournisseur).
- **DO NOT CHANGE** Code applicatif, configuration ESLint (les avertissements existants ne bloquent pas ; les erreurs bloquent).
- **ACCEPTANCE CRITERIA** CI verte sur la baseline ; une PR avec une erreur de type échoue.
- **TESTS REQUIRED** Démontrer un échec volontaire sur une branche jetable.
- **SECURITY REQUIREMENTS** Secrets de CI factices (`JWT_SECRET` aléatoire), aucun secret réel.
- **VALIDATION METHOD** Lien vers les exécutions CI dans le rapport.
- **RISKS** Tests qui dépendent de l'environnement local → les marquer et corriger.
- **EXPECTED RESULT** Pipeline obligatoire avant merge.

### TASK-005 — Tests e2e d'isolation multi-tenant en CI
- **TYPE** TEST · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-004
- **BUSINESS OBJECTIVE** Garantie vérifiée qu'un utilisateur de l'organisation A ne voit ni ne modifie jamais les données de B.
- **TECHNICAL OBJECTIVE** Suite Jest e2e (supertest + base de test) couvrant chaque ressource tenant.
- **CURRENT PROBLEM** (MT-2) `backend/scripts/isolation-check.ts` nécessite un serveur lancé, n'est pas en CI et ne teste pas l'usurpation d'en-tête.
- **FILES TO INSPECT** `scripts/isolation-check.ts`, `common/middleware/tenant.middleware.ts`, `common/guards/tenant.guard.ts`, tous les `*.controller.ts`.
- **FILES LIKELY TO MODIFY** `backend/test/isolation.e2e-spec.ts` (nouveau), `test/jest-e2e.json`, script npm `test:e2e`, workflow CI.
- **IMPLEMENTATION REQUIREMENTS**
  1. Créer 2 tenants A/B, un utilisateur chacun, une ressource de chaque type pour B (content, image, brand, calendar+event, social post, social account, qr-code, website, menu, poster, reel, business-context).
  2. Avec le jeton de A : GET/PUT/DELETE/POST d'action sur chaque ressource de B → 403 ou 404, et la ressource de B est inchangée en base.
  3. **Usurpation d'en-tête** : jeton A + `X-Tenant-Slug: <slug B>` sur chaque contrôleur → 403, aucune donnée de B.
  4. Listes : les listes de A ne contiennent aucun id de B.
  5. Aucun appel IA : mocker `AiEngineService` et `BrandAssetService`.
- **DO NOT CHANGE** Code applicatif (tâche de test uniquement ; toute faille trouvée = nouvelle tâche, signalée dans le rapport).
- **ACCEPTANCE CRITERIA** Suite verte en CI ; ≥ 1 cas par endpoint `:id` et par liste ; cas d'usurpation d'en-tête présents.
- **TESTS REQUIRED** C'est la tâche.
- **SECURITY REQUIREMENTS** Base de test dédiée, jamais la base de dev.
- **VALIDATION METHOD** Claude compare la liste des endpoints testés à la liste des routes des contrôleurs.
- **RISKS** Durée d'exécution → une seule base, données préparées une fois.
- **EXPECTED RESULT** Isolation prouvée et protégée contre la régression.

### TASK-006 — Dériver le tenant du JWT et appliquer le contrôle globalement
- **TYPE** SECURITY · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-005
- **BUSINESS OBJECTIVE** Impossible, même par erreur de développement futur, qu'un en-tête client détermine le tenant.
- **TECHNICAL OBJECTIVE** `req.tenant` provient de `req.user.tenantId` ; l'en-tête `X-Tenant-Slug` n'est plus qu'un contrôle de cohérence.
- **CURRENT PROBLEM** (MT-1) `TenantMiddleware` remplit `req.tenant` depuis l'en-tête avant l'authentification ; la sécurité repose sur `@UseGuards(TenantGuard)` posé manuellement sur chaque contrôleur.
- **FILES TO INSPECT** `tenant.middleware.ts`, `tenant.guard.ts`, `jwt.strategy.ts`, `jwt-auth.guard.ts`, `app.module.ts`, `tenant.decorator.ts`, tous les contrôleurs.
- **FILES LIKELY TO MODIFY** `tenant.guard.ts` (ou nouveau guard global), `app.module.ts`, `tenant.middleware.ts`.
- **IMPLEMENTATION REQUIREMENTS**
  1. Guard global exécuté après `JwtAuthGuard` : pour une route non `@Public`, charger le tenant par `req.user.tenantId` (tenant actif requis) et remplir `req.tenant`.
  2. Si l'en-tête `X-Tenant-Slug` est présent et ne correspond pas → 403 (comportement actuel conservé).
  3. Conserver `@RequirePlan` et `@Public`.
  4. Les `@UseGuards(TenantGuard)` existants peuvent rester (idempotents) : ne pas les retirer dans cette tâche.
- **DO NOT CHANGE** Signatures des services, frontend (qui continue d'envoyer l'en-tête).
- **ACCEPTANCE CRITERIA** Suite TASK-005 verte sans modification ; un contrôleur de test sans `TenantGuard` reçoit quand même `req.tenant` du JWT ; routes `@Public` inchangées (menu/poster/site publics, webhook Stripe, callback OAuth, auth).
- **TESTS REQUIRED** Spec du guard (JWT A + en-tête B → 403 ; sans en-tête → tenant A ; route publique → passe).
- **SECURITY REQUIREMENTS** Aucune route ne lit le tenant depuis body/query.
- **VALIDATION METHOD** Revue + TASK-005 + test manuel de l'admin (super-admin).
- **RISKS** Routes admin et billing : vérifier explicitement.
- **EXPECTED RESULT** Tenant toujours issu du contexte authentifié.

### TASK-007 — Supprimer les endpoints IA bruts `/ai-engine/*`
- **TYPE** SECURITY · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Pas de proxy LLM/image ouvert, source d'abus de coût.
- **CURRENT PROBLEM** (SEC-08/AI-4) `ai-engine.controller.ts` expose `generate-text` (prompt 10 000 car., `maxTokens` 8192, `temperature`), `generate-image`, `generate-branding`, `generate-social-post`, sans contexte tenant. Aucun usage dans `frontend/src` ni `admin/src`.
- **FILES TO INSPECT** `ai-engine.controller.ts`, `ai-engine.module.ts`, grep des routes dans `frontend/` et `admin/`.
- **FILES LIKELY TO MODIFY** `ai-engine.controller.ts` (supprimé), `ai-engine.module.ts`.
- **IMPLEMENTATION REQUIREMENTS** Supprimer le contrôleur (le service reste exporté). Si le Project Owner veut les conserver : les protéger par `SuperAdminGuard` à la place (question à poser avant).
- **DO NOT CHANGE** `AiEngineService`.
- **ACCEPTANCE CRITERIA** `POST /ai-engine/generate-text` → 404 ; tous les générateurs métier fonctionnent ; build OK.
- **TESTS REQUIRED** Test e2e 404 sur les 4 routes.
- **SECURITY REQUIREMENTS** —
- **VALIDATION METHOD** Revue + Swagger (dev) ne liste plus `ai-engine`.
- **RISKS** Client externe non documenté → le Project Owner confirme.
- **EXPECTED RESULT** Surface d'API réduite.

### TASK-008 — Contrainte d'unicité sur `Menu.slug`
- **TYPE** BUG · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-001
- **BUSINESS OBJECTIVE** Le menu public d'un restaurant ne peut jamais servir ni écraser celui d'un autre.
- **CURRENT PROBLEM** (MT-3/DB-03) `Menu.slug` sans `@unique` ; `menu.service.ts generateSlug` lit puis écrit ; `publishMenu` déploie sur le projet Vercel `menu-<slug>`.
- **FILES TO INSPECT** `schema.prisma` (Menu), `menu.service.ts` (`generateSlug`, `generateMenu`, `getMenuBySlug`, `publishMenu`).
- **FILES LIKELY TO MODIFY** `schema.prisma`, nouvelle migration, `menu.service.ts`.
- **IMPLEMENTATION REQUIREMENTS**
  1. Migration : détecter les doublons existants (requête SQL dans la migration ou script préalable) et les suffixer `-2`, `-3` avant `CREATE UNIQUE INDEX`.
  2. `@unique` sur `slug`.
  3. À la création : en cas d'erreur Prisma `P2002` sur slug, régénérer et réessayer (max 5).
- **DO NOT CHANGE** Format des slugs existants non dupliqués (URLs imprimées en QR code).
- **ACCEPTANCE CRITERIA** Contrainte présente ; deux créations concurrentes du même nom produisent deux slugs distincts ; aucun slug existant non dupliqué ne change.
- **TESTS REQUIRED** Spec : collision simulée (`P2002`) → second slug.
- **SECURITY REQUIREMENTS** —
- **VALIDATION METHOD** Migration exécutée sur une copie de la base de dev ; rapport des doublons trouvés.
- **RISKS** QR codes imprimés pointant vers un slug renommé → lister les slugs modifiés au Project Owner.
- **EXPECTED RESULT** Unicité garantie par la base.

### TASK-009 — Reprise des rendus bloqués
- **TYPE** BUG · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Un client ne voit jamais un menu, un site ou un reel « en cours » indéfiniment.
- **CURRENT PROBLEM** (BE-01) `void this.renderMenuVisuals()` / `renderWebsiteVisuals()` / `render()` (reels) : un redémarrage ou un crash laisse `visualStatus`/`status` à `RENDERING`/`PENDING` pour toujours.
- **FILES TO INSPECT** `menu.service.ts` (~l.180, 1066, `renderMenuVisuals`), `website.service.ts` (~l.223, 283, `renderWebsiteVisuals`), `reels.service.ts` (~l.139, 330, `render`), `schema.prisma` (champs de statut, `updatedAt`).
- **FILES LIKELY TO MODIFY** nouveau `common/jobs/stale-render.service.ts` (ou équivalent), les 3 services pour exposer la relance.
- **IMPLEMENTATION REQUIREMENTS**
  1. Au démarrage (`onApplicationBootstrap`) et toutes les 10 min (`@Cron`) : toute ligne en `RENDERING`/`PENDING` dont `updatedAt` a plus de 30 min (configurable) passe en `FAILED` avec un message d'erreur lisible (reels : champ `error`).
  2. L'utilisateur peut relancer via les endpoints existants (`refresh-visuals`, `regenerate`).
  3. Pas de relance automatique (évite la consommation de crédits non demandée).
- **DO NOT CHANGE** Logique de rendu, crédits.
- **ACCEPTANCE CRITERIA** Une ligne forcée en RENDERING avec `updatedAt` ancien passe en FAILED au démarrage ; une ligne récente reste intacte.
- **TESTS REQUIRED** Spec avec Prisma mocké (ancien vs récent) pour les 3 tables.
- **SECURITY REQUIREMENTS** Requêtes sans filtre tenant acceptables ici (tâche système), mais aucune donnée renvoyée à un client.
- **VALIDATION METHOD** Revue + test manuel : arrêter le serveur pendant un rendu, redémarrer.
- **RISKS** Rendu long légitime > seuil → seuil configurable, 30 min par défaut.
- **EXPECTED RESULT** Aucun statut bloqué.

### TASK-010 — Sanitizer allowlist pour le HTML de poster
- **TYPE** SECURITY · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Le HTML écrit par le LLM ne peut contenir ni script, ni redirection, ni ressource non autorisée, y compris dans le fichier téléchargé.
- **CURRENT PROBLEM** (SEC-06) `poster.service.ts generateProfessionalPosterHtml` : nettoyage par regex qui ne couvre pas les balises non fermées, `<meta http-equiv>`, `<base>`, `<form>`, `<link>` hors Google Fonts, `javascript&colon;` encodé.
- **FILES TO INSPECT** `poster.service.ts` (bloc de nettoyage après `match[0]`, validations suivantes, `downloadPoster`), `frontend/src/app/poster/[slug]/page.tsx`.
- **FILES LIKELY TO MODIFY** `poster.service.ts`, `package.json` (dépendance `sanitize-html`), nouveau `poster-sanitize.ts` + spec.
- **IMPLEMENTATION REQUIREMENTS**
  1. Sanitizer allowlist : balises de structure et de texte, `img`, `style`, `main`, `section`, `header`, `footer`, `figure`, `svg` basique sans `foreignObject` ni `animate*`/`set` ; `<link>` uniquement `rel=stylesheet` + `href` commençant par `https://fonts.googleapis.com/` ; attributs `class`, `style`, `src`, `alt`, `href` (schémas `https:` et `data:image/` uniquement) ; aucun `on*`.
  2. Conserver `<!DOCTYPE html>`, `<html lang>`, `<head>`, `<meta charset>`, `<meta name=viewport>`.
  3. Appliquer le sanitizer **avant** les validations existantes et **à nouveau** dans `downloadPoster` (posters déjà en base).
  4. Retirer l'ancien nettoyage regex.
- **DO NOT CHANGE** Prompts, validations de jetons, logique de revue.
- **ACCEPTANCE CRITERIA** Les vecteurs de test ci-dessous sont neutralisés ; un poster légitime (fixture) garde son rendu (styles, image, polices).
- **TESTS REQUIRED** Spec avec vecteurs : `<script>`, `<img onerror>`, `<embed src>` non fermé, `<iframe src>` non fermé, `<meta http-equiv="refresh">`, `<base href>`, `<form action>`, `<a href="javascript&colon;…">`, `<svg><animate onbegin>`, `<link href="https://evil">`, `style="background:url(javascript:…)"`.
- **SECURITY REQUIREMENTS** L'iframe publique reste `sandbox="allow-same-origin"` sans `allow-scripts`.
- **VALIDATION METHOD** Revue + spec + génération réelle d'un poster (TASK-014).
- **RISKS** Sanitizer trop strict cassant le design → fixture de référence.
- **EXPECTED RESULT** HTML de poster sûr en affichage comme en téléchargement.

### TASK-011 — Filtre d'exceptions global
- **TYPE** BUG · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **BUSINESS OBJECTIVE** Messages d'erreur compréhensibles pour l'utilisateur, aucune fuite interne.
- **CURRENT PROBLEM** (BE-02) `common/filters/http-exception.filter.ts` ne capture que `HttpException` et renvoie `exception.message` : erreurs de validation réduites à « Bad Request Exception » ; `throw new Error()` des services → 500 génériques non journalisés de façon homogène.
- **FILES TO INSPECT** le filtre, `main.ts`, `transform.interceptor.ts`, `frontend/src/lib/api.ts` (lecture de `message`).
- **FILES LIKELY TO MODIFY** le filtre (+ spec).
- **IMPLEMENTATION REQUIREMENTS** `@Catch()` global ; `HttpException` → statut + `message` issu de `getResponse()` (tableau de validation conservé sous `errors`) ; autres erreurs → 500, message générique, erreur journalisée avec la route ; forme de réponse inchangée (`statusCode, timestamp, path, method, message`) + `errors?`.
- **DO NOT CHANGE** Codes de statut existants.
- **ACCEPTANCE CRITERIA** DTO invalide → 400 avec le détail des champs ; `Error` brute → 500 « Erreur interne », stack uniquement dans les logs ; frontend affiche le détail de validation.
- **TESTS REQUIRED** Spec du filtre (3 cas).
- **SECURITY REQUIREMENTS** Jamais de stack ni de message brut d'erreur non HTTP au client.
- **VALIDATION METHOD** Revue + appel manuel d'un DTO invalide.
- **RISKS** Faible.
- **EXPECTED RESULT** Erreurs homogènes et lisibles.

### TASK-012 — Access token 15 minutes
- **TYPE** SECURITY · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **CURRENT PROBLEM** (SEC-03) `JWT_EXPIRATION=24h` (`.env`, `.env.example`, défaut `jwt.config.ts`) ; `logout()` ne révoque que le refresh.
- **BUSINESS/TECHNICAL OBJECTIVE** Limiter la durée d'utilisation d'un cookie volé ; s'appuyer sur le refresh rotatif existant.
- **FILES TO INSPECT** `config/jwt.config.ts`, `auth.module.ts`, `auth.service.ts` (`accessTtlSeconds`), `.env.example`, `frontend/src/lib/api.ts` (refresh sur 401).
- **FILES LIKELY TO MODIFY** `jwt.config.ts`, `auth.service.ts`, `.env.example`.
- **IMPLEMENTATION REQUIREMENTS** Défaut `15m` partout ; documenter ; vérifier que le frontend renouvelle silencieusement.
- **DO NOT CHANGE** Rotation et détection de réutilisation des refresh tokens.
- **ACCEPTANCE CRITERIA** Avec `JWT_EXPIRATION=1m`, une session reste utilisable au-delà d'1 min sans reconnexion ; après logout, le refresh est refusé.
- **TESTS REQUIRED** Test e2e refresh après expiration.
- **SECURITY REQUIREMENTS** —
- **VALIDATION METHOD** Test manuel navigateur + e2e.
- **RISKS** Rafales de 401 → le frontend a déjà un refresh unique en vol.
- **EXPECTED RESULT** Fenêtre d'exposition réduite de 24 h à 15 min.

### TASK-013 — Connexion non ambiguë multi-tenant
- **TYPE** BUG · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **CURRENT PROBLEM** (SEC-04) `auth.service.ts login()` : sans `tenantSlug`, `findFirst({ email })` choisit un compte arbitraire parmi ceux ayant cet e-mail (unicité `[email, tenantId]`).
- **OBJECTIVE** Un utilisateur se connecte toujours au bon compte.
- **FILES TO INSPECT** `auth.service.ts` (`login`), `auth.dto.ts` (`LoginDto.tenantSlug`), `frontend/src/app/auth/login/page.tsx`.
- **FILES LIKELY TO MODIFY** `auth.service.ts`, page de login, spec.
- **IMPLEMENTATION REQUIREMENTS** Sans slug : `findMany` ; 0 → erreur générique ; 1 → flux actuel ; > 1 → vérifier le mot de passe sur chaque compte, et si plusieurs correspondent, renvoyer 409 `TENANT_REQUIRED` **sans lister les tenants** ; le frontend affiche alors le champ « Espace (slug) ».
- **DO NOT CHANGE** OTP, super-admin.
- **ACCEPTANCE CRITERIA** 3 cas testés ; aucun nom de tenant divulgué avant authentification.
- **TESTS REQUIRED** Spec des 3 cas.
- **SECURITY REQUIREMENTS** Message identique pour « inexistant » et « mauvais mot de passe ».
- **VALIDATION METHOD** Revue + spec.
- **RISKS** Faible.
- **EXPECTED RESULT** Connexion déterministe.

### TASK-014 — Vérification réelle des générateurs IA réécrits
- **TYPE** TEST · **PRIORITY** P1 · **COMPLEXITY** M · **DEPENDENCIES** TASK-001, TASK-002
- **BUSINESS OBJECTIVE** Les générateurs livrés produisent un résultat conforme avant d'être présentés aux clients.
- **CURRENT PROBLEM** (AI-5) menu (modes STRUCTURE/DRAFT), branding, logo, poster, reels, module Images n'ont pas été exécutés contre les vrais modèles après la réécriture.
- **FILES TO INSPECT** `scripts/menu-e2e.ts`, `scripts/website-e2e.ts`, `scripts/reel-e2e.ts`, `scripts/studio-e2e.ts`, `scripts/full-feature-check.ts`, `AUDIT_PROMPTS.md`.
- **FILES LIKELY TO MODIFY** scripts existants uniquement si adaptation nécessaire (aucun code applicatif).
- **IMPLEMENTATION REQUIREMENTS** Tenant de démonstration (ex. boulangerie) avec contexte complet ; exécuter chaque générateur ; consigner pour chacun les vérifications de la grille ci-dessous.
- **DO NOT CHANGE** Prompts (tout écart = nouvelle tâche proposée dans le rapport).
- **ACCEPTANCE CRITERIA** (grille, par générateur) : langue = langue du profil ; aucun prix, date, avis ou chiffre absent des données ; menu STRUCTURE = plats et prix du propriétaire inchangés ; menu DRAFT = prix vides + `draft: true` et publication refusée ; branding = 3 hex, 2 polices de l'allowlist, `visualStyle` valide, 7 champs persistés ; logo sans lettres ; poster valide au premier ou deuxième essai ; reel : voix off dans la langue, CTA adapté au métier ; aucun point d'exclamation dans posts et légendes.
- **TESTS REQUIRED** Exécution des scripts, sorties archivées (texte/JSON, captures pour les images).
- **SECURITY REQUIREMENTS** Clés IA uniquement en `.env` local.
- **VALIDATION METHOD** Claude relit les sorties archivées.
- **RISKS** Coût d'API (quelques dollars) → accord du Project Owner.
- **EXPECTED RESULT** Rapport de conformité par générateur.

### TASK-015 — Index `tenantId`
- **TYPE** PERFORMANCE · **PRIORITY** P1 · **COMPLEXITY** S · **DEPENDENCIES** TASK-001
- **CURRENT PROBLEM** (DB-02) Pas d'index sur `tenantId` pour Content, Image, Calendar, Website, Menu, Poster, QrCode, PaymentMethod, Brand ; ni sur `CalendarEvent.calendarId`. Chaque liste par tenant parcourt toute la table.
- **FILES TO INSPECT** `schema.prisma` ; requêtes `findMany({ where: { tenantId }, orderBy: { createdAt } })` dans les services.
- **FILES LIKELY TO MODIFY** `schema.prisma`, nouvelle migration.
- **IMPLEMENTATION REQUIREMENTS** `@@index([tenantId, createdAt])` sur les modèles cités (Brand : `@@index([tenantId, updatedAt])`) ; `@@index([calendarId])`.
- **DO NOT CHANGE** Contraintes existantes.
- **ACCEPTANCE CRITERIA** Migration appliquée ; `EXPLAIN` d'une liste de menus par tenant utilise l'index.
- **TESTS REQUIRED** Jest vert ; `EXPLAIN` dans le rapport.
- **RISKS** Verrou d'écriture pendant la création sur grosses tables → `CREATE INDEX CONCURRENTLY` si volumétrie importante (préciser dans le rapport).
- **EXPECTED RESULT** Listes par tenant indexées.

### TASK-016 — Marque active explicite
- **TYPE** BUG · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-001
- **CURRENT PROBLEM** (DB-04) `brand-kit.service.ts find()` prend la Brand au `updatedAt` le plus récent ; modifier une ancienne marque change l'identité de tous les générateurs.
- **OBJECTIVE** Le tenant choisit sa marque active ; elle ne change que sur action explicite.
- **FILES TO INSPECT** `brand-kit.service.ts`, `branding.service.ts`, `branding.controller.ts`, `schema.prisma` (Tenant, Brand), `frontend/src/app/(app)/branding/page.tsx`.
- **FILES LIKELY TO MODIFY** schéma + migration (`Tenant.activeBrandId` nullable, FK `SetNull`), `brand-kit.service.ts`, `branding.service.ts` (nouvelle marque = active), endpoint `POST /branding/:id/activate`, bouton frontend.
- **ACCEPTANCE CRITERIA** Modifier une marque non active ne change pas le kit ; activer change le kit ; sans marque active → comportement actuel (plus récente) ; activation d'une marque d'un autre tenant → 404.
- **TESTS REQUIRED** Spec BrandKit + e2e activation cross-tenant.
- **SECURITY REQUIREMENTS** Vérification tenant sur `activate`.
- **RISKS** Migration : initialiser `activeBrandId` avec la marque la plus récente.
- **EXPECTED RESULT** Identité stable.

### TASK-017 — Chiffrer les jetons OAuth au repos
- **TYPE** SECURITY · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-003
- **CURRENT PROBLEM** (SEC-02) `SocialAccount.accessToken/refreshToken` en clair.
- **IMPLEMENTATION REQUIREMENTS** Utilitaire AES-256-GCM (`common/crypto/secret-box.ts`), clé `TOKEN_ENCRYPTION_KEY` (32 octets base64) obligatoire au démarrage ; chiffrer à l'écriture (OAuth, connect, update), déchiffrer uniquement dans le publisher ; script de migration des lignes existantes ; format versionné `v1:iv:tag:data`.
- **FILES** `social.service.ts`, `social-oauth.service.ts`, `social-publisher.service.ts`, `.env.example`.
- **DO NOT CHANGE** Schéma (colonnes texte suffisantes).
- **ACCEPTANCE CRITERIA** En base, jetons illisibles ; publication OK ; clé absente → démarrage refusé.
- **TESTS REQUIRED** Spec aller-retour + altération détectée.
- **RISKS** Perte de clé = reconnexion des comptes → documenter.
- **EXPECTED RESULT** Fuite de base sans compromission des comptes sociaux.

### TASK-018 — Vérification de l'e-mail à l'inscription
- **TYPE** SECURITY · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-013
- **CURRENT PROBLEM** (SEC-05) `register()` connecte immédiatement sans preuve de possession de l'e-mail ; chaque inscription ouvre des crédits IA FREE.
- **IMPLEMENTATION REQUIREMENTS** Réutiliser `OtpService` (purpose dédié) : compte créé inactif pour l'IA (ou `emailVerifiedAt` null) ; génération IA refusée (403 explicite) tant que non vérifié ; écran de vérification réutilisant `frontend/src/app/auth/verify`.
- **FILES** `auth.service.ts`, `otp.service.ts`, `ai-quota.interceptor.ts` (refus si non vérifié), schéma (`User.emailVerifiedAt`), pages auth.
- **ACCEPTANCE CRITERIA** Sans vérification : navigation possible, génération IA refusée ; après OTP : tout fonctionne ; comptes existants considérés vérifiés (migration).
- **TESTS REQUIRED** e2e inscription → génération refusée → OTP → génération OK.
- **RISKS** Délivrabilité des e-mails → mode dev `storage/mail` existant.
- **EXPECTED RESULT** Fin de la ferme de crédits.

### TASK-019 — Content-Security-Policy sur le frontend
- **TYPE** SECURITY · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-004
- **CURRENT PROBLEM** (SEC-07) Aucune CSP dans `frontend/next.config.js`.
- **IMPLEMENTATION REQUIREMENTS** Étape 1 : `Content-Security-Policy-Report-Only` avec `default-src 'self'`, `connect-src` = API, `img-src 'self' data: blob:` + API, `font-src` Google Fonts, `frame-src 'self'`, `object-src 'none'`, `base-uri 'none'` ; recenser les violations sur tous les écrans ; étape 2 (sur accord) : mode bloquant.
- **FILES** `frontend/next.config.js` (+ `admin/next.config.js`).
- **ACCEPTANCE CRITERIA** Aucun écran cassé en Report-Only ; liste des violations dans le rapport.
- **TESTS REQUIRED** Parcours manuel de chaque écran, console sans violation bloquante.
- **RISKS** Next.js inline scripts → nonce si nécessaire (à signaler, pas `unsafe-inline` sans accord).
- **EXPECTED RESULT** Défense en profondeur XSS.

### TASK-020 — Génération de poster asynchrone
- **TYPE** PERFORMANCE · **PRIORITY** P2 · **COMPLEXITY** L · **DEPENDENCIES** TASK-009, TASK-010
- **CURRENT PROBLEM** (BE-03) `POST /posters/generate` enchaîne visuel FLUX + direction + jusqu'à 3 × (HTML + revue) dans la requête HTTP.
- **IMPLEMENTATION REQUIREMENTS** Même modèle que menus/sites : création immédiate `status=RENDERING`, traitement en arrière-plan, `FAILED` + message en cas d'échec, polling frontend ; crédits débités une seule fois (comportement actuel).
- **FILES** `poster.service.ts`, `poster.controller.ts`, `schema.prisma` (champ `error` si nécessaire), `frontend/src/app/(app)/poster/create/page.tsx`.
- **ACCEPTANCE CRITERIA** Réponse HTTP < 2 s ; poster final identique ; échec visible ; statut couvert par TASK-009.
- **TESTS REQUIRED** Spec du passage de statut (IA mockée).
- **RISKS** Changement d'UX → accord du Project Owner.
- **EXPECTED RESULT** Plus de requêtes de plusieurs minutes.

### TASK-021 — Téléchargement de poster : formats réels
- **TYPE** BUG · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-010
- **CURRENT PROBLEM** (BE-04) `downloadPoster` : `png`/`jpg` renvoient du HTML si aucune image embarquée ; `pdf` renvoie toujours du HTML.
- **IMPLEMENTATION REQUIREMENTS** Décision Project Owner requise : (a) rendu serveur (navigateur headless, isolé, réseau coupé sauf Google Fonts et `/uploads`) ou (b) retirer PNG/JPG/PDF du backend et utiliser l'export client existant (`frontend/src/lib/artwork-export.ts`). Poser la question avant d'implémenter.
- **ACCEPTANCE CRITERIA** Le fichier téléchargé a le type annoncé ; jamais du HTML sous extension `.png`.
- **TESTS REQUIRED** Selon option.
- **RISKS** (a) SSRF via rendu serveur → isolation réseau obligatoire.
- **EXPECTED RESULT** Téléchargements conformes.

### TASK-022 — Validation de schéma des sorties JSON des LLM
- **TYPE** REFACTOR · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-014
- **CURRENT PROBLEM** (AI-1) `parseStrictJson` + contrôles ad hoc ; pas de schéma.
- **IMPLEMENTATION REQUIREMENTS** Schémas zod pour : branding, sections de site (par type), section custom, patch de thème, menu, enrichissement menu, scènes de reel, légende, angles de calendrier, direction/revue poster ; échec de schéma = une relance avec l'erreur de validation dans le prompt, puis erreur explicite ; aucun changement de prompt au-delà de l'ajout du message de correction.
- **FILES** `ai-engine.service.ts`, `menu.service.ts`, `reels.service.ts`, `poster.service.ts`, nouveau `common/ai/schemas.ts`.
- **ACCEPTANCE CRITERIA** Tous les JSON parsés passent par un schéma ; les tests existants restent verts.
- **TESTS REQUIRED** Spec par schéma (valide, champ manquant, type faux).
- **RISKS** Rejets plus fréquents → journaliser le taux de relance.
- **EXPECTED RESULT** Sorties IA typées.

### TASK-023 — Cache d'images par tenant
- **TYPE** BUG · **PRIORITY** P2 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **CURRENT PROBLEM** (AI-6/MT-5) `BrandAssetService.memo` : clé `sha256(prompt|size)` sans scope ni seed → un tenant peut recevoir un fichier stocké sous le scope d'un autre.
- **IMPLEMENTATION REQUIREMENTS** Clé = `scope|seed|prompt|size`.
- **FILES** `common/brand-kit/brand-asset.service.ts` + spec.
- **ACCEPTANCE CRITERIA** Deux scopes avec le même prompt → deux appels de génération, deux fichiers.
- **TESTS REQUIRED** Spec avec `AiEngineService` mocké.
- **EXPECTED RESULT** Aucun partage d'actifs entre tenants.

### TASK-024 — Endpoint public du poster : projection minimale
- **TYPE** SECURITY · **PRIORITY** P2 · **COMPLEXITY** S · **DEPENDENCIES** TASK-002
- **CURRENT PROBLEM** (SEC-09) `GET /posters/slug/:slug` renvoie toute la ligne (tenantId, userId…).
- **IMPLEMENTATION REQUIREMENTS** Méthode `getPublicPoster` sur le modèle de `menu.service.ts getPublicMenu` : `slug, name, businessName, content, imageUrl, size, publishedAt/updatedAt`.
- **FILES** `poster.service.ts`, `poster.controller.ts`, vérifier `frontend/src/app/poster/[slug]/page.tsx`.
- **ACCEPTANCE CRITERIA** Réponse sans `tenantId`, `userId`, `sections` bruts ; page publique inchangée visuellement.
- **TESTS REQUIRED** e2e : clés absentes.
- **EXPECTED RESULT** Aucune donnée interne publique.

### TASK-025 — Socle RBAC sur les actions sensibles
- **TYPE** SECURITY · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-006
- **CONTEXT** Rôles `OWNER/ADMIN/MEMBER` définis ; `RolesGuard` jamais appliqué ; aucune invitation de membres (chaque tenant = 1 OWNER), donc pas exploitable aujourd'hui.
- **OBJECTIVE** Préparer le multi-utilisateur sans faille : facturation, paramètres tenant, contexte business, comptes sociaux, publication et suppression réservés à OWNER/ADMIN.
- **IMPLEMENTATION REQUIREMENTS** Enregistrer `RolesGuard` (global, après le guard tenant) ; `@Roles('OWNER')` sur billing/payment ; `@Roles('OWNER','ADMIN')` sur tenant PUT, business-context PUT, social accounts, `publish`/`unpublish`, `DELETE` ; `onDelete: SetNull` pour `userId` des ressources (DB-07, migration). Proposer la matrice au Project Owner avant implémentation.
- **FILES** `roles.guard.ts`, `roles.decorator.ts`, contrôleurs concernés, `schema.prisma`.
- **ACCEPTANCE CRITERIA** Un MEMBER de test reçoit 403 sur chaque action de la matrice ; OWNER inchangé.
- **TESTS REQUIRED** e2e par rôle.
- **EXPECTED RESULT** RBAC prêt avant l'ouverture des invitations.

### TASK-026 — Découper `menu/create/page.tsx`
- **TYPE** REFACTOR · **PRIORITY** P2 · **COMPLEXITY** M · **DEPENDENCIES** TASK-004
- **CURRENT PROBLEM** (FE-02) 1 038 lignes (formulaire, éditeur de catégories, aperçu, liste, actions).
- **IMPLEMENTATION REQUIREMENTS** Extraire sans changement de comportement : `MenuBriefForm`, `MenuCategoryEditor`, `MenuPreviewCard`, `MenuList`, hook `useMenus` (appels API). Aucun changement visuel.
- **FILES** `frontend/src/app/(app)/menu/create/page.tsx`, nouveau dossier `frontend/src/components/menu/`.
- **ACCEPTANCE CRITERIA** Page < 300 lignes ; parcours création → édition → publication identique (captures avant/après) ; build + lint OK.
- **EXPECTED RESULT** Modèle de découpage réutilisable ensuite pour websites/poster.

### TASK-027 — 404 uniforme sur ressource d'un autre tenant
- **TYPE** SECURITY · **PRIORITY** P3 · **COMPLEXITY** S · **DEPENDENCIES** TASK-005
- **CURRENT PROBLEM** (SEC-14) `website.service.ts owned()` renvoie 403 « Not your website » ; les autres modules renvoient 404.
- **IMPLEMENTATION REQUIREMENTS** `findFirst({ where: { id, tenantId } })` → 404.
- **ACCEPTANCE CRITERIA** TASK-005 attend 404 pour les sites.
- **EXPECTED RESULT** Pas d'oracle d'existence.

### TASK-028 — Égaliser le temps de réponse du login
- **TYPE** SECURITY · **PRIORITY** P3 · **COMPLEXITY** S · **DEPENDENCIES** TASK-013
- **CURRENT PROBLEM** (SEC-10) Pas de `bcrypt.compare` si l'utilisateur n'existe pas.
- **IMPLEMENTATION REQUIREMENTS** Comparer contre un hash factice constant (coût 12).
- **ACCEPTANCE CRITERIA** Écart de temps moyen < 20 % entre e-mail inconnu et mauvais mot de passe (mesure sur 20 essais dans le rapport).
- **EXPECTED RESULT** Énumération par timing neutralisée.

### TASK-029 — Expiration du state OAuth
- **TYPE** SECURITY · **PRIORITY** P3 · **COMPLEXITY** S · **DEPENDENCIES** —
- **CURRENT PROBLEM** (SEC-11) `social-oauth.service.ts` : state signé sans horodatage.
- **IMPLEMENTATION REQUIREMENTS** Ajouter `issuedAt` dans le payload signé ; refuser au-delà de 10 min.
- **ACCEPTANCE CRITERIA** State de plus de 10 min → erreur lisible ; state valide → OK.
- **TESTS REQUIRED** Spec avec horloge simulée.

### TASK-030 — Statuts en enums Prisma
- **TYPE** REFACTOR · **PRIORITY** P3 · **COMPLEXITY** M · **DEPENDENCIES** TASK-015
- **CURRENT PROBLEM** (DB-05) Statuts en `String` libres.
- **IMPLEMENTATION REQUIREMENTS** Enums pour Menu/Poster/Website `status`, `visualStatus`, `deploymentStatus`, Reel `status` ; migration avec contrôle préalable des valeurs existantes (rapport des valeurs inattendues).
- **ACCEPTANCE CRITERIA** Aucune valeur hors enum possible ; tests verts.

### TASK-031 — `CalendarEvent.imageId` : supprimer le champ mort
- **TYPE** REFACTOR · **PRIORITY** P3 · **COMPLEXITY** S · **DEPENDENCIES** TASK-001
- **CURRENT PROBLEM** (DB-06/MT-4) Champ jamais écrit, lu sans contrôle tenant dans `auto-post.service.ts imageUrl()`.
- **IMPLEMENTATION REQUIREMENTS** Question au Project Owner : supprimer (champ + lecture) ou implémenter l'image des posts planifiés (alors : relation FK + contrôle `image.tenantId === calendar.tenantId`). Par défaut : supprimer.
- **ACCEPTANCE CRITERIA** Plus de lecture d'image sans contrôle tenant.

### TASK-032 — Journalisation unifiée, sans payload client
- **TYPE** REFACTOR · **PRIORITY** P3 · **COMPLEXITY** M · **DEPENDENCIES** —
- **CURRENT PROBLEM** (BE-05/BE-06) `console.*` et `Logger` mêlés ; `debugLog` imprime prompts et payloads ; détails fournisseur renvoyés au client.
- **IMPLEMENTATION REQUIREMENTS** `Logger` Nest partout dans `src/modules` ; `debugLog` n'imprime ni prompt ni payload (longueurs et identifiants seulement) ; messages client neutres pour les erreurs de fournisseur (« Le service de génération est indisponible, réessayez »), détail dans les logs.
- **ACCEPTANCE CRITERIA** `grep console\. src/modules` vide (hors scripts) ; aucune réponse HTTP ne contient « Moteur IA ».

### TASK-033 — Durcir `docker-compose.yml`
- **TYPE** SECURITY · **PRIORITY** P3 · **COMPLEXITY** S · **DEPENDENCIES** —
- **CURRENT PROBLEM** (SEC-13) Identifiants par défaut, ports exposés sur toutes les interfaces.
- **IMPLEMENTATION REQUIREMENTS** Identifiants via variables (`.env`), ports liés à `127.0.0.1`, pgadmin sous profil optionnel ; mettre à jour `.env.example` et README.
- **ACCEPTANCE CRITERIA** `docker compose up` fonctionne avec `.env` ; aucun mot de passe en dur.

---

## L. ROADMAP

```text
Sprint 0 — Stabiliser (bloquant)          TASK-001 → TASK-002 → TASK-003
Sprint 1 — Filet de sécurité               TASK-004 (CI) → TASK-005 (isolation e2e) → TASK-006 (tenant depuis JWT)
Sprint 2 — Sécurité & fiabilité P1         TASK-007, TASK-008, TASK-011, TASK-012, TASK-013   (indépendantes, parallélisables)
                                           TASK-009 (statuts bloqués), TASK-010 (sanitizer poster), TASK-015 (index)
Sprint 3 — Qualité IA                      TASK-014 (vérification réelle) → TASK-022 (schémas) ; TASK-023
Sprint 4 — P2 produit/sécurité             TASK-016, TASK-017, TASK-018, TASK-019, TASK-024, TASK-021 → TASK-020
Sprint 5 — Préparer le multi-utilisateur   TASK-025 (RBAC) ; TASK-026 (refactor frontend)
Continu (P3)                               TASK-027 … TASK-033
```

Workflow par tâche : **Claude** spécifie → **Antigravity** implémente sur `task/NNN-*` et rend le rapport → **Claude** fait la revue (format ci-dessous) → `APPROVED` ou `CHANGES_REQUIRED` → **Project Owner** merge.

### Format de revue (utilisé par Claude)

```text
TASK REVIEW
Task:
Status:
Acceptance Criteria:
- [critère 1] PASS / FAIL (preuve)
Code Quality:
Security:
Architecture:
Tests:
Regression Risk:
Problems Remaining:
Required Changes:
Final Decision: APPROVED / CHANGES REQUIRED
```

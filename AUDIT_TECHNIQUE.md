# Audit technique — NextGen MarketingAI

> Rôle : Product Owner + Technical Auditor (Claude). Développeur : Antigravity. Décideur : Project Owner.
> Date : 2026-09-28. Base : code réel des dépôts `backend/`, `frontend/`, `admin/` (working tree, **y compris les modifications IA non commitées** faites le même jour, cf. `AUDIT_PROMPTS.md`).
> Convention : **[FAIT]** = vérifié dans le code (fichier cité) ; **[HYPOTHÈSE]** = non vérifiable sans exécuter l'application (PostgreSQL/Docker étaient arrêtés pendant l'audit).
> Backlog exécutable : [`BACKLOG.md`](BACKLOG.md). Le registre historique [`TASKS.md`](TASKS.md) reste en place.

---

## A. PROJECT MAP

```
nextgen marketingai/                  (dépôt racine — backend et frontend sont des submodules git, .gitmodules)
├── backend/                          NestJS 10 + Prisma + PostgreSQL
│   ├── prisma/schema.prisma          22 modèles, migrations versionnées (dernière : 20260928000000_brand_platform, NON appliquée)
│   ├── scripts/                      ~26 scripts ts-node de vérification (e2e, isolation, art direction…) — nécessitent services réels
│   ├── test/jest-e2e.json            config e2e, aucun test e2e présent
│   └── src/
│       ├── main.ts                   bootstrap : headers sécurité, /uploads statique, ValidationPipe(whitelist), CORS, Swagger (hors prod)
│       ├── app.module.ts             guards globaux : ThrottlerGuard (120/min) + JwtAuthGuard ; AiQuotaInterceptor ; TenantMiddleware(*)
│       ├── common/
│       │   ├── ai/                   prompt-rules.ts, brand-context.ts, prompt-guards.spec.ts   (nouveau, non commité)
│       │   ├── brand-kit/            BrandKitService, BrandAssetService (images → WebP), art-direction.ts, LogoAssetService
│       │   ├── guards/               jwt-auth, tenant, roles (inutilisé), super-admin
│       │   ├── middleware/tenant.middleware.ts   résout req.tenant depuis l'en-tête X-Tenant-Slug ou le sous-domaine
│       │   ├── quota/                crédits IA mensuels par plan (verrou advisory PostgreSQL)
│       │   ├── storage/              fichiers dans storage/uploads, servis publiquement sous /uploads
│       │   ├── net/safe-fetch.ts     fetch anti-SSRF
│       │   ├── filters/, interceptors/, mail/, deploy/, prisma/
│       └── modules/                  auth, tenant, business-context, ai-engine, content, social, images, branding,
│                                     planner (+ auto-post cron), qr-code, website, menu, poster, reels, dashboard,
│                                     payment (Stripe), admin (super-admin)
├── frontend/                         Next.js 16 (App Router) + React 18 + Tailwind + zustand
│   └── src/
│       ├── proxy.ts                  (ex-middleware) : réécriture sous-domaines → /site/[subdomain], redirection login
│       ├── lib/api.ts                client fetch (cookies HttpOnly + refresh unique en vol + en-tête X-Tenant-Slug)
│       ├── lib/auth-token.ts         jeton en mémoire uniquement
│       ├── lib/store/                7 stores zustand (dont content-store persisté en localStorage)
│       └── app/(app)/…               écrans générateurs ; app/menu|poster|site/[…] pages publiques (iframe sandbox)
├── admin/                            Next.js, console super-admin (tenants, users, subscriptions)
├── skills/*.md, agent.skills         documentation uniquement — lus par aucun code [FAIT]
├── docker-compose.yml                postgres + pgadmin uniquement (pas d'image applicative)
├── TASKS.md, task.md, AUDIT_PROMPTS.md, AUDIT_TECHNIQUE.md, BACKLOG.md
```

## B. ARCHITECTURE

```
Navigateur ──(cookies HttpOnly access/refresh + X-Tenant-Slug)──► NestJS API :4000
   │                                                               │
   │  pages publiques /menu/[slug] /poster/[slug] /site/[sub]      ├─ Guards : Throttler → JwtAuth (global) → TenantGuard (par contrôleur)
   │  = iframe sandbox="allow-same-origin" (pas de scripts)        ├─ Interceptor AiQuota (tenant lu depuis le JWT)
   ▼                                                               ├─ Prisma ─► PostgreSQL (toutes les tables métier ont tenantId)
Next.js :3000   Admin Next.js :3100                                ├─ Storage local ─► storage/uploads (public /uploads/*)
                                                                   ├─ IA texte : /chat/completions NVIDIA NIM ou OpenAI (routage par nom de modèle)
                                                                   ├─ IA image : NVIDIA NIM FLUX.1-dev
                                                                   ├─ TTS : ElevenLabs / OpenAI / Windows SAPI (reels)
                                                                   ├─ Déploiement : Vercel (sites et menus publiés)
                                                                   ├─ Paiement : Stripe (webhook signé)
                                                                   └─ Social : OAuth Meta / LinkedIn, publication cron (1/min)
```

Faits notables :
- **Modèles réellement configurés** (`backend/.env`) : `gpt-4o-mini` (texte, social, branding), `gpt-4o` (site, poster), `flux.1-dev` (image). Les défauts du code sont `openai/gpt-oss-20b` (NIM) et `z-ai/glm-5.2` (poster). **Aucune utilisation de Llama dans le code** [FAIT].
- Rendu des **sites** et des **menus** : gabarits déterministes côté serveur, contenu IA échappé (`website-renderer.service.ts`, `menu-document.ts`). Seul le **poster** est du HTML écrit par le LLM.
- Travaux longs (images de menu/site, rendu vidéo des reels) lancés en `void promise` après la réponse HTTP — pas de file de jobs.

## C. AI PIPELINE

| Flux | Entrée validée | Contexte | Prompt | Sortie | Validation sortie | Post-traitement | Stockage | Affichage |
|---|---|---|---|---|---|---|---|---|
| Contenu | DTO class-validator | BrandKit → `<brand_context>` | system dédié + FORMAT_SPEC par type | texte | `enforceVoice` (mots interdits) | extraction IMAGE_SUBJECT | `Content` | texte brut |
| Image contenu | — | art direction marque | sujet LLM + `composePrompt` | FLUX base64 | finishReason ≠ SUCCESS → erreur | WebP, dédup | fichier `/uploads` | `<img>` |
| Post social | DTO | brand_context | system social + limites plateforme | texte | `enforceVoice`, coupe X à 280 | — | `Content` | texte |
| Calendrier | DTO | brand_context | 1 appel planification + N posts | JSON angles + textes | parse tolérant | échecs par jour tolérés | `CalendarEvent` | liste |
| Branding | DTO | BusinessContext | system stratège (JSON) | JSON | champs requis, 3 hex, polices allowlist | — | `Brand` (+7 champs, migration non appliquée) | fiche |
| Logo | — | concept logo | prompt FLUX dédié, seed marque | image | finishReason | variantes (sharp) | fichiers | `<img>` |
| Site | DTO + BusinessContext.resolve | blueprint déterministe + brand_context | copy JSON par slot | JSON sections | ré-association par rôle ; avis/prix forcés côté code | `buildContent` | `Website.content` + HTML rendu | iframe sandbox / Vercel |
| Menu | DTO + resolve | brand_context | STRUCTURE / DRAFT | JSON | fusion avec la carte du propriétaire ; badges allowlist | rendu gabarit | `Menu` | iframe sandbox / Vercel |
| Poster | DTO + resolve | identité marque | direction → HTML → revue (3 tentatives) | **HTML libre** | jetons de copy, checklist CSS, **sanitizer regex** | remplacement jetons échappés | `Poster.content` | iframe sandbox ; téléchargement HTML brut |
| Reel | DTO + resolve | brand_context + blueprint CTA | script JSON | scènes | réparations déterministes (ouverture, imagePrompt) | frames SVG → vidéo | `Reel` + fichiers | vidéo |

Constats IA transverses (hors ceux déjà traités dans `AUDIT_PROMPTS.md`) :
- **AI-1 [FAIT]** Aucune validation de schéma formelle (zod/class-validator) des JSON produits par les LLM : `parseStrictJson` + contrôles ad hoc (`ai-engine.service.ts`). Les renderers tolèrent les champs manquants, donc pas de crash, mais des sections vides possibles.
- **AI-2 [FAIT]** Pas de fallback fournisseur ni de circuit breaker : une panne du fournisseur = fonctionnalité indisponible (choix assumé « pas de contenu factice »).
- **AI-3 [FAIT]** Coûts : crédits fixes par endpoint (`@AiQuota`), indépendants du nombre d'images générées (menu : jusqu'à `MENU_PHOTO_BUDGET_MAX=24` images pour 5 crédits + 3 pour les visuels).
- **AI-4 [FAIT]** Endpoints bruts `/ai-engine/generate-text|image|branding|social-post` : proxy LLM ouvert à tout utilisateur connecté (prompt 10 000 caractères, `maxTokens` 8192, `temperature` libre, 1 crédit), **non utilisés par le frontend ni l'admin** (grep).
- **AI-5 [HYPOTHÈSE]** Les générateurs menu, branding, logo, poster, reels, images n'ont pas été testés en réel après la réécriture des prompts (seuls social, calendrier, site, filtre de voix et art direction l'ont été).
- **AI-6 [FAIT]** Le cache mémoire `BrandAssetService.memo` est indexé par `prompt+taille` sans tenant ni seed : deux tenants avec le même style, les mêmes couleurs et le même sujet partagent le même fichier stocké sous le scope du premier.

## D. SECURITY AUDIT

| ID | Sév. | Module / fichier | Comportement actuel | Impact | Solution |
|---|---|---|---|---|---|
| SEC-01 | **HIGH** | `social.service.ts` (`connectAccount`, `findAllAccounts`, `findOneAccount`, `updateAccount`) | Renvoient la ligne Prisma complète, **accessToken et refreshToken OAuth inclus**. `redact()` existe (l.195) mais n'est utilisé que dans le callback OAuth (l.168). | Jetons Facebook/Instagram/LinkedIn de l'entreprise exposés au navigateur ; toute XSS ou tout futur membre = prise de contrôle des pages sociales. | Appliquer `redact()` à toutes les réponses + test. |
| SEC-02 | MEDIUM | `schema.prisma` `SocialAccount` | Jetons OAuth stockés en clair. | Fuite de base = comptes sociaux compromis. | Chiffrement applicatif AES-GCM (clé en env). |
| SEC-03 | MEDIUM | `jwt.config.ts`, `.env` (`JWT_EXPIRATION=24h`), `auth.service.ts logout()` | Access token valable 24 h ; la déconnexion ne révoque que le refresh. | Cookie volé utilisable 24 h après logout. | TTL 15 min (le refresh rotatif existe déjà). |
| SEC-04 | MEDIUM | `auth.service.ts login()`, `@@unique([email, tenantId])` | L'e-mail n'est unique que par tenant ; sans `tenantSlug`, `findFirst` choisit un compte arbitraire. | Connexion impossible ou vers le mauvais tenant pour un e-mail présent dans deux tenants. | Si plusieurs comptes : exiger le slug ; tests. |
| SEC-05 | MEDIUM | `auth.service.ts register()` (l.316) | Inscription sans preuve de possession de l'e-mail ; chaque inscription crée un tenant FREE avec ses crédits. | Création de comptes au nom de tiers ; « ferme » de crédits IA gratuits. | OTP d'e-mail à l'inscription (OtpService existe). |
| SEC-06 | MEDIUM | `poster.service.ts` (nettoyage regex après génération) | Retire `<script>…</script>`, `<iframe|object|embed>…</…>` **fermés uniquement**, `on*=`, `javascript:` littéral. Ne couvre pas : balises non fermées (`<embed src>`, `<iframe src>`), `<meta http-equiv=refresh>`, `<base>`, `<form>`, `<link>`, `javascript&colon;` encodé. | Atténué par l'iframe sans scripts ; **le téléchargement HTML n'est pas isolé**. | Sanitizer allowlist (sanitize-html). |
| SEC-07 | MEDIUM | `frontend/next.config.js`, sites publiés | Aucune Content-Security-Policy. | Pas de défense en profondeur contre XSS/exfiltration. | CSP stricte sur l'app (rapport d'abord). |
| SEC-08 | MEDIUM | `ai-engine.controller.ts` | Voir AI-4 : proxy LLM/image brut, inutilisé. | Abus de coût, usage hors produit, surface d'attaque inutile. | Supprimer ou réserver au super-admin. |
| SEC-09 | LOW | `poster.service.ts getPosterBySlug` | Endpoint public renvoyant toute la ligne (tenantId, userId, sections…). | Fuite d'identifiants internes. | Projection minimale comme `getPublicMenu`. |
| SEC-10 | LOW | `auth.service.ts login()` | Pas de `bcrypt.compare` si l'utilisateur n'existe pas. | Énumération d'e-mails par mesure du temps de réponse. | Comparaison factice. |
| SEC-11 | LOW | `social-oauth.service.ts parseState` | State OAuth signé sans horodatage. | Rejouable sans limite de temps. | Expiration (10 min). |
| SEC-12 | LOW | `main.ts useStaticAssets('/uploads')` | Tous les fichiers servis publiquement, noms UUID. | Brouillons accessibles si l'URL fuit. | Documenter ; accepter (assets destinés au public). |
| SEC-13 | LOW | `docker-compose.yml` | postgres/postgres, pgadmin admin/admin, ports exposés sur toutes les interfaces. | Risque si utilisé hors poste de dev. | Variables d'env + bind 127.0.0.1. |
| SEC-14 | LOW | `website.service.ts owned()` | 403 « Not your website » pour une ressource d'un autre tenant (autres modules : 404). | Oracle d'existence (UUID, faible). | 404 uniforme. |

Points vérifiés **sans problème** [FAIT] : refresh tokens opaques, hachés, rotation + détection de réutilisation (`refresh-token.service.ts`) ; OTP `randomInt`, haché, tentatives limitées ; bcrypt coût 12 ; mot de passe ≥ 8 caractères avec casse et chiffre ; cookies HttpOnly, SameSite=lax, Secure en prod ; jeton frontend en mémoire uniquement ; `validate()` du JWT relit l'utilisateur et `isSuperAdmin` en base ; webhook Stripe signé ; OAuth state signé HMAC ; `safe-fetch` anti-SSRF, Google Maps limité aux hôtes Google avec `redirect: manual` ; upload filtré (MIME image, 10 Mo, extension imposée, `nosniff`) ; pages publiques menu/site limitées au statut PUBLISHED ; throttling sur login/OTP/refresh.

## E. MULTI-TENANT AUDIT

**Résolution du tenant** [FAIT] : `TenantMiddleware` remplit `req.tenant` depuis **l'en-tête client `X-Tenant-Slug`** (ou le sous-domaine). `TenantGuard` refuse si `req.user.tenantId !== req.tenant.id`. Le tenant n'est donc jamais *fiable* seul, mais la sécurité repose sur la présence de `TenantGuard` sur chaque contrôleur qui lit `req.tenant`.

| Contrôleur | TenantGuard | Source du tenant | Verdict |
|---|---|---|---|
| branding, business-context, content, dashboard, images, menu, payment, planner, poster, qr-code, reels, social, tenant | classe | `req.tenant.id` (validé) ou `user.tenantId` | OK |
| billing | par méthode (webhook public signé) | `@CurrentTenant` validé | OK |
| website | **aucun** | `req.user.tenantId` (JWT, relu en base) | OK |
| ai-engine | aucun | n'accède à aucune donnée tenant ; quota via `user.tenantId` | OK (voir SEC-08) |
| admin | SuperAdminGuard | — | OK |

**Services** [FAIT] : toutes les lectures filtrent par `tenantId` (`findFirst({ id, tenantId })` ou `owned()`), et toutes les mises à jour/suppressions par `id` sont précédées de ce contrôle (planner via `calendar.tenantId`, social, reels, website, menu, poster, branding, images, content). **Aucune fuite inter-tenant trouvée.**

Points de vigilance :
- **MT-1 (P1, durcissement)** : la protection dépend d'un décorateur posé à la main. Un futur contrôleur utilisant `@CurrentTenant` sans `TenantGuard` serait vulnérable (IDOR par en-tête). → dériver le tenant du JWT globalement.
- **MT-2** : `scripts/isolation-check.ts` existe (serveur réel requis) mais ne teste pas l'usurpation d'en-tête (jeton A + `X-Tenant-Slug` B) et n'est pas exécuté en CI.
- **MT-3** : `Menu.slug` n'a pas de contrainte unique ; unicité vérifiée par lecture puis écriture (`generateSlug`) → en cas de course, deux tenants avec le même slug : la route publique `findFirst({slug})` sert un menu arbitraire et `publishMenu` déploie sur le même projet Vercel `menu-<slug>` (écrasement du menu d'un autre tenant).
- **MT-4 (latent)** : `CalendarEvent.imageId` n'est écrit par aucune API ; `auto-post.service.ts imageUrl()` le lit sans contrôle de tenant. Inexploitable aujourd'hui, fuite inter-tenant dès qu'une API l'écrira.
- **MT-5** : voir AI-6 (cache d'images partagé entre tenants).
- **RBAC** : rôles `OWNER/ADMIN/MEMBER` définis, `RolesGuard` jamais appliqué, **aucune API d'invitation de membres** → chaque tenant n'a qu'un OWNER. Pas exploitable aujourd'hui ; devient HIGH dès l'ajout du multi-utilisateur.

## F. DATABASE AUDIT

| ID | Sév. | Constat [FAIT] | Recommandation |
|---|---|---|---|
| DB-01 | **CRITICAL (déploiement)** | Migration `20260928000000_brand_platform` (7 colonnes `brands`) non appliquée. Le client Prisma généré les attend : toute lecture de `Brand` (BrandKit utilisé par tous les générateurs) échouera tant qu'elle n'est pas appliquée. | Appliquer sur tous les environnements. |
| DB-02 | MEDIUM | Pas d'index `tenantId` sur Content, Image, Calendar, Website, Menu, Poster, QrCode, PaymentMethod, Brand (unique `[slug, tenantId]` ne commence pas par tenantId) ; pas d'index `CalendarEvent.calendarId`. PostgreSQL n'indexe pas les clés étrangères automatiquement. | Index `@@index([tenantId, createdAt])`. |
| DB-03 | MEDIUM | `Menu.slug` sans `@unique` (MT-3). | Contrainte unique + gestion P2002. |
| DB-04 | MEDIUM | « Marque active » implicite : `BrandKitService.find` prend la `Brand` au `updatedAt` le plus récent → modifier une ancienne marque change silencieusement l'identité de tous les générateurs. | Pointeur explicite `Tenant.activeBrandId` ou flag. |
| DB-05 | LOW | Statuts en `String` libres (Menu, Poster, Website.status/visualStatus/deploymentStatus, Reel). | Enums Prisma. |
| DB-06 | LOW | `CalendarEvent.imageId` sans relation ni écriture (MT-4). | Implémenter avec FK + contrôle tenant, ou supprimer. |
| DB-07 | LOW (latent) | `onDelete: Cascade` de `User` vers Content/Image/Website/Menu/Poster/QrCode/Reel/Calendar : supprimer un utilisateur supprimerait les actifs du tenant. Aucune API de suppression d'utilisateur aujourd'hui. | `SetNull` sur `userId` avant tout multi-utilisateur. |

Transactions : inscription (tenant + user + context) et bootstrap admin en `$transaction` [FAIT]. N+1 : aucun motif `await` dans une boucle trouvé dans dashboard/admin (requêtes parallélisées) [FAIT, vérification partielle].

## G. FRONTEND AUDIT

| ID | Sév. | Constat |
|---|---|---|
| FE-01 | MEDIUM | Pas de CSP (SEC-07). En-têtes présents : nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy. |
| FE-02 | MEDIUM | Pages monolithiques : `menu/create` 1 038 lignes, `websites/create` 1 017, `poster/create` 857, `branding/create` 645. Formulaires, appels API, aperçu et état dans un seul composant. |
| FE-03 | MEDIUM | Aucun test frontend/admin ; aucune CI. |
| FE-04 | LOW | État de session dupliqué : plusieurs pages lisent `localStorage.user` directement (`branding/page.tsx`, `branding/create/page.tsx`) au lieu du hook `useAuth`. |
| FE-05 | LOW | UI mixte FR/EN (ex. `confirm('Are you sure you want to delete this content?')` dans `content/create`). |
| OK | — | Jeton en mémoire, cookies HttpOnly, refresh unique en vol ; `proxy.ts` protège les routes ; tout contenu généré est affiché en iframe `sandbox="allow-same-origin"` sans `allow-scripts` ; aucun `dangerouslySetInnerHTML` trouvé. |

Le frontend n'est pas une frontière de sécurité : tous les contrôles ci-dessus sont doublés côté serveur [FAIT].

## H. BACKEND AUDIT

| ID | Sév. | Constat [FAIT] | Recommandation |
|---|---|---|---|
| BE-01 | MEDIUM | Travaux longs en `void this.render…()` (`menu.service.ts:180,1066`, `reels.service.ts:139,330`, `website.service.ts:223,283`) : pas de file de jobs, pas de limite globale de concurrence, **aucune reprise après redémarrage** → statuts bloqués en `RENDERING`/`PENDING`. | Reprise au démarrage + timeout de statut (puis file de jobs en P2). |
| BE-02 | MEDIUM | `HttpExceptionFilter` ne capture que `HttpException` et renvoie `exception.message` : les erreurs de validation perdent leur détail (« Bad Request Exception ») ; les `throw new Error(...)` des services (branding regenerate/modify, QR menu) deviennent des 500 génériques. | Filtre global. |
| BE-03 | MEDIUM | Génération de poster synchrone : direction + jusqu'à 3 × (HTML 16k tokens + revue) dans une seule requête HTTP (timeouts jusqu'à 300 s). | Asynchrone avec statut, comme menus/sites. |
| BE-04 | MEDIUM | `downloadPoster` : `png`/`jpg` renvoient du HTML si aucune image embarquée ; `pdf` renvoie toujours du HTML. | Rendu réel ou retrait des formats. |
| BE-05 | LOW | Messages d'erreur exposant le détail du fournisseur IA (« Détail: Moteur IA 401: … »). | Message neutre + log serveur. |
| BE-06 | LOW | Logs mêlant `console.*` et `Logger` ; `debugLog` imprime prompts et payloads (données clients) quand le debug est actif. | Logger unique, pas de payload. |
| BE-07 | LOW | Services très volumineux : `ai-engine` ~1 000 lignes, `poster` ~1 350, `website` ~1 150, `menu` ~1 100. | Découpage progressif, pas prioritaire. |
| BE-08 | LOW | `TASKS.md` marque T-22 « done » alors que l'endpoint existait encore (corrigé le 2026-09-28) : statuts non vérifiés. | Validation par revue obligatoire (workflow). |

## I. AI PROMPT AUDIT

L'audit détaillé prompt par prompt (20 prompts + 3 éléments morts : actuel → problème → impact → amélioration → résultat) est dans [`AUDIT_PROMPTS.md`](AUDIT_PROMPTS.md). Les corrections ont été **appliquées dans le working tree mais ne sont ni commitées ni revues** : elles doivent être traitées comme un lot à valider (TASK-002). Problèmes IA restants : AI-1 à AI-6 (section C).

## J. TECHNICAL DEBT (par priorité)

| Priorité | Dette |
|---|---|
| P0 | Lot de modifications IA non commité dans deux submodules ; migration non appliquée. |
| P1 | Pas de CI ; tests quasi absents (6 fichiers spec backend, 0 frontend) ; scripts de vérification manuels dépendant de services réels ; travaux asynchrones non durables ; filtre d'erreurs incomplet. |
| P2 | Validation de schéma des sorties IA ; poster synchrone ; pages frontend monolithiques ; marque active implicite. |
| P3 | Statuts en String ; logs hétérogènes ; services géants ; `docker-compose` limité à la base (pas d'image applicative) ; UI bilingue incohérente. |

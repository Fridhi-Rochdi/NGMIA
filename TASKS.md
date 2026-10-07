# Plan de remédiation — NextGen MarketingAI

Registre des anomalies détectées lors de l'audit, converties en tasks exécutables.
Statuts : `pending` | `in_progress` | `done` | `skipped`

---

## P0 — Bloquants

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-01 | Corriger le chemin d'upload images (`./uploads` vs `storage/uploads`) | backend | **done** |
| T-02 | Corriger l'auth de `api.upload()` (localStorage → getAuthToken) | frontend | **done** |
| T-03 | Enregistrer `PaymentModule` + corriger `req.tenantId` | backend | **done** |
| T-04 | Réparer et versionner les migrations Prisma | backend | **done** |
| T-05 | Ajouter `.gitmodules` pour backend/frontend | racine | **done** |

## P1 — Endpoints manquants / contrats cassés

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-06 | Exposer `GET /menus/slug/:slug` (page publique cassée) | backend | **done** |
| T-07 | Exposer `POST /menus/:id/generate-image` | backend | **done** |
| T-08 | Implémenter `POST /menus/:id/generate-qr` | backend | **done** |
| T-09 | Ajouter `POST /social/posts` (création manuelle) | backend | **done** |
| T-10 | Ajouter `GET /planner/:calendarId/events` | backend | **done** |
| T-11 | Aligner les DTO QR vCard (`fullName`) et WiFi (`type`) | full | **done** |
| T-12 | Valider `POST /websites/generate` avec la classe DTO | backend | **done** |
| T-13 | Ajouter `POST /websites/:id/unpublish` | full | **done** |
| T-14 | Déballer l'enveloppe API dans `app/menu/[slug]` | frontend | **done** |

## P2 — Code mort / duplication

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-15 | Supprimer les pages orphelines `/create` et `/marketing` | frontend | **done** |
| T-16 | Supprimer les méthodes mortes de `ai-engine.service.ts` | backend | **done** |
| T-17 | Supprimer `validation.pipe.ts` inutilisé et le fichier `backend/git` | backend | **done** |
| T-18 | Supprimer la config Tailwind dupliquée | frontend | **done** |
| T-19 | Retirer les dépendances frontend inutilisées | frontend | **done** |
| T-20 | Déclarer `multer` / `@types/multer` en dépendances backend | backend | **n/a** (résolu par T-01 : plus d'import direct) |
| T-21 | Factoriser l'interface `AuthenticatedRequest` (7 duplications) | backend | **done** |
| T-22 | Retirer `POST /ai-engine/generate-menu` (doublon) | full | **done** |

## P3 — Sécurité / robustesse

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-23 | Sandboxer le HTML du menu public (`dangerouslySetInnerHTML`) | frontend | **done** |
| T-24 | Autoriser les scripts dans l'iframe du site publié | frontend | **done** |
| T-25 | Supprimer les logs de debug (dont préfixe de clé API) | backend | **done** |
| T-26 | Durcir `JWT_SECRET` et supprimer les clés factices du `.env` racine | config | **done** |
| T-27 | Corriger `DATABASE_NAME` incohérent dans `backend/.env` | config | **done** |
| T-28 | Compléter `.env.example` avec toutes les variables réelles | config | **done** |
| T-29 | Protéger `/ai-engine/*` avec TenantGuard | backend | **done** |

## P4 — Documentation / tests / outillage

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-30 | Mettre à jour `README.md` (stack réelle, modules réels) | docs | **done** |
| T-31 | Mettre à jour les statuts de `task.md` | docs | **done** |
| T-32 | Corriger `test:e2e` (config absente) | backend | **done** |
| T-33 | Déclarer le script `prisma db seed` | backend | **done** |
| T-34 | Rendre les scripts npm portables (Windows-only) | backend | **done** |
| T-35 | Sortir `cv.tex` et `logs/` du dépôt | racine | **done** |

## P5 — Découvert pendant l'exécution

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-36 | Persister les QR codes générés (`GET /qr-code` toujours vide) | backend | **done** |
| T-37 | Réparer `npm start` : build en `dist/src/main.js` vs `node dist/main` | backend | **done** |
| T-38 | `RolesGuard` : protéger le catalogue de plans nouvellement exposé | backend | **done** |

---

## P6 — Qualité du rendu des sites générés

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-39 | Bug de téléchargement : `localStorage.getItem('token')` → `getAuthToken()` | frontend | **done** |
| T-40 | Helper `api.download()` authentifié pour les réponses binaires | frontend | **done** |
| T-41 | Système de design : échelle typographique fluide, encre neutre, hairlines | backend | **done** |
| T-42 | Suppression de tous les gradients (hero, texte, overlays) | backend | **done** |
| T-43 | Couleur de marque réservée aux CTA et petits accents | backend | **done** |
| T-44 | `--sec-pad` réellement appliqué (le réglage `density` était inopérant) | backend | **done** |
| T-45 | Contraste : corps 4.83→9.29:1, secondaire 2.54→5.04:1 (AA) | backend | **done** |
| T-46 | Hiérarchie : titres de section alignés à gauche, centrage réservé FAQ/CTA | backend | **done** |
| T-47 | `.reveal` en progressive enhancement (contenu invisible sans JS) | backend | **done** |
| T-48 | `cta.body` de l'IA jamais affiché (lu comme `subtitle`) | backend | **done** |
| T-49 | Prompts IA : voix concrète, liste de mots bannis, longueurs, anti-invention | backend | **done** |
| T-50 | Contenus de repli inventés (« 10+ ans », « 500+ clients ») supprimés | backend | **done** |
| T-51 | Éléments de liste entièrement vides non rendus | backend | **done** |
| T-52 | Section `custom` : items `question`/`answer` invisibles (perte de contenu) | backend | **done** |
| T-53 | Eyebrow dédupliqué quand il répète le titre | backend | **done** |
| T-54 | 16 icônes + 30 alias (les services retombaient tous sur la même coche) | backend | **done** |
| T-55 | Repli de titre : plus de `<h1>` vide | backend | **done** |
| T-56 | `tsBuildInfoFile` dans `dist/` : build vide silencieux avec exit 0 | backend | **done** |

---

## Vérification finale

| Contrôle | Avant | Après |
|----------|-------|-------|
| `tsc --noEmit` backend | 0 erreur | 0 erreur |
| `tsc --noEmit` frontend | 0 erreur | 0 erreur |
| `jest` backend | 2/2 | 2/2 |
| `nest build` | ⚠️ sortie erronée | ✅ `dist/main.js` |
| `next build` | — | ✅ 25 routes |
| Démarrage DI Nest | — | ✅ 122 routes |
| `npm start` (production) | ❌ MODULE_NOT_FOUND | ✅ démarre |
| `prisma migrate` rejouable | ❌ P3006 | ✅ drift = 0 |
| `GET /uploads/<fichier>` | ❌ 404 | ✅ 200 |

## Reste à traiter (hors périmètre de cette passe)

- OAuth réseaux sociaux réel (actuellement simulé, jetons factices stockés en clair)
- Branchement Stripe du module Payment
- Stockage des images générées en fichiers plutôt qu'en data URI base64
- Invitations d'utilisateurs (`UserRole.MEMBER`, `Tenant.maxUsers`)
- Quotas / limites de plan sur les appels IA (`RequirePlan` défini mais jamais appliqué)
- Couverture de tests auth / isolation multi-tenant / parsing IA
- Pipeline CI/CD et Dockerfiles applicatifs

## P7 — Paiement Stripe & console admin

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-57 | Module Stripe : clé secrète côté serveur uniquement, jamais exposée | backend | **done** |
| T-58 | Checkout hébergé Stripe (aucune clé ni carte dans le frontend) | full | **done** |
| T-59 | Webhook signé + vérification de signature obligatoire | backend | **done** |
| T-60 | Workflow complet : checkout → paiement → confirmation → statut → erreurs | full | **done** |
| T-61 | Catalogue d'offres en base + création paresseuse des prix Stripe | backend | **done** |
| T-62 | Portail de facturation Stripe + annulation en fin de période | full | **done** |
| T-63 | Onglet Facturation + page de confirmation de paiement | frontend | **done** |
| T-64 | 12 tests automatisés du workflow de paiement | backend | **done** |
| T-65 | API admin (`/admin/*`) : RolesGuard ADMIN, hors TenantGuard | backend | **done** |
| T-66 | Projet séparé `admin/` : console Next.js autonome, sans secret | admin | **done** |
| T-67 | CORS : origine de la console admin autorisée | config | **done** |
| T-68 | `rawBody` activé (requis par la vérification de signature Stripe) | backend | **done** |
| T-69 | Téléchargement de logo : vraie conversion au lieu d'un MIME renommé | backend | **done** |
| T-70 | Suspense sur `useSearchParams` (build de production cassé) | frontend | **done** |

### Reste ouvert

- Qualité des **menus** générés : non traitée (les builders HTML de `menu.service.ts` sont inchangés).
- Génération IA **non vérifiable de bout en bout** : modèle `z-ai/glm-5.2` supprimé côté NVIDIA (410) — remplacé par `glm-5.3-flash` ; quotas 429 et latences de plusieurs minutes observés.
- `ai-engine.service.ts` a été réécrit par une session concurrente : le branding retourne un **template codé en dur**, plus un appel IA.

---

## P8 — Reels sonorisés, bugs bloquants, vérification de bout en bout

### Bugs corrigés

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-71 | `generateLogoWithRetry()` s'appelait elle-même : récursion infinie, `RangeError: Maximum call stack size exceeded` à **chaque** génération. Aucune marque n'a jamais obtenu de logo. | backend | **done** |
| T-72 | Logo illisible : 8 steps de diffusion suffisent à une photo mais rendent tout aplat vectoriel flou. Steps réglables par appel, 30 pour les logos (`NVIDIA_NIM_LOGO_STEPS`). | backend | **done** |
| T-73 | `unpublishWebsite()` ne changeait que le statut en base : le site restait **en ligne sur Vercel**. Ajout de `removeProject()`, et la dépublication échoue bruyamment si le retrait échoue. | backend | **done** |
| T-74 | Le super-admin court-circuitait l'OTP : le seul compte pouvant atteindre `/admin/*` était le seul exempté de 2FA. Il passe désormais par le même second facteur. | backend | **done** |
| T-75 | La console admin lisait `data.accessToken` directement : avec OTP actif (défaut) la réponse est un *challenge*, donc la connexion était impossible. Flux en deux étapes ajouté. | admin | **done** |
| T-76 | `KNOWN_TYPES` omettait `'faq'` : toute FAQ produite par l'IA était rétrogradée en `custom`, perdant son rendu dédié et son ancre de navigation. | backend | **done** |
| T-77 | `probeDuration()` ne lisait stderr que dans le `catch`, or ffmpeg sort en 0 : toute mesure renvoyait 0. | backend | **done** |
| T-78 | `StorageService` n'autorisait aucune extension audio : un WAV devenait `.bin` servi en `application/octet-stream`. | backend | **done** |
| T-79 | Variantes de logo `light`/`dark` byte-identiques à `primary` : `flatten()` est sans effet sur une source opaque. Produites seulement s'il y a de l'alpha. | backend | **done** |
| T-80 | Test `website-content.builder.spec` obsolète (attendait la FAQ pré-remplie supprimée volontairement). | backend | **done** |
| T-81 | `.env.example` : 6 variables utilisées mais non documentées, dont `STRIPE_SECRET_KEY` et `STRIPE_WEBHOOK_SECRET` — sans elles tout le module facturation est inerte sur un clone neuf. | config | **done** |
| T-89 | QR de **menu** et d'**affiche** appelaient `QRCode.toDataURL()` en direct, court-circuitant `QrCodeService` : le code était écrit sur la ligne du menu mais n'apparaissait jamais dans la bibliothèque `/qrcode`. C'est le bug T-36, corrigé pour les endpoints autonomes et laissé sur les deux qui comptent le plus. | backend | **done** |
| T-90 | Les deux contrôleurs ne transmettaient aucun `userId` ; et `request.user` porte `sub`, pas `id` (`@CurrentUser('id')` renvoie `undefined` partout). Aligné sur la convention du reste du projet. | backend | **done** |

### Reels : de diaporama muet à vraie publicité

| ID | Task | Portée | Statut |
|----|------|--------|--------|
| T-82 | **Voix off.** Le script écrivait une réplique par scène que rien ne disait jamais. `VoiceoverService` avec chaîne de fournisseurs dégradante : ElevenLabs → endpoint compatible OpenAI → System.Speech Windows (sans clé) → muet assumé et signalé. | backend | **done** |
| T-83 | **Le timing suit la voix.** La durée prévue devient un plancher : une scène ne peut plus couper sa propre réplique en plein mot. | backend | **done** |
| T-84 | **Mouvement.** Zoom Ken Burns alterné (avant/arrière) par scène et fondus aux raccords : une image fixe tenue N secondes est une story, pas une vidéo. | backend | **done** |
| T-85 | **Mixage.** Chaque scène est encodée en segment autonome portant ses deux flux, puis concaténée en copie de flux — la synchro est réglée par scène et le raccord ne peut pas dériver. AAC 48 kHz stéréo. | backend | **done** |
| T-86 | **Brief réécrit.** La réplique est traitée comme du texte dit à voix haute : 8 à 16 mots, jamais la redite du titre à l'écran, pas de chiffres (le synthétiseur les lit mal), CTA parlé naturellement. | backend | **done** |
| T-87 | `READY` n'est plus atteint que si **toutes** les scènes sont photographiées **et** toutes les répliques dites ; sinon `PARTIAL` avec le motif exact. | backend | **done** |
| T-88 | L'UI affiche la réplique de chaque scène, un lecteur audio par scène et la couverture de la voix off. | frontend | **done** |

### Tests ajoutés

| Script | Couvre |
|--------|--------|
| `npm run test:reel:voice` | Synthèse → timing → encodage → **assertion sur les flux du fichier produit** (le contrôle qui aurait attrapé le reel muet) |
| `scripts/studio-e2e.ts` | Branding (palette réelle, pas le gabarit), contenu, les 3 types de QR, persistance, isolation |
| `scripts/admin-login-check.ts` | Login admin en deux étapes, mauvais code refusé, accès `/admin/*` |
| `scripts/menu-qr-check.ts` | QR de menu : image produite, URL encodée correcte, page visée vivante, **persistance en bibliothèque** |
| `scripts/reel-e2e.ts` (étendu) | Répliques écrites **et** synthétisées, présence d'une piste audio dans le MP4 |

### Vérification exécutée (backend réel, clés réelles)

| Suite | Résultat |
|-------|----------|
| `jest` | 9/9 |
| `tsc --noEmit` backend / frontend / admin | 0 erreur |
| `reel-e2e` | 35/35 — MP4 1080x1920 H.264 + AAC, 22,6 s |
| `menu-e2e` | tout passe — 17 plats photographiés, publié, page publique lisible |
| `studio-e2e` | tout passe — logo généré et stocké en variantes |
| `admin-login-check` | tout passe |
| `website-e2e` | tout passe — 2 sites distincts, publication Vercel réelle, lisibles sans auth |
| `menu-qr-check` | tout passe |
| `test:reel:voice` | 3/3 répliques dites, flux vidéo + audio vérifiés dans le fichier |

### Reste ouvert

- La voix Windows (System.Speech) dépanne sans clé mais ne vaut pas une voix publicitaire : renseigner `ELEVENLABS_API_KEY` pour une vraie lecture.
- Pas de lit musical sous la voix : `musicMood` est stocké et inexploité, faute d'assets libres de droits.
- Les transitions sont des fondus, pas des fondus enchaînés (un `xfade` romprait la durée exacte sur laquelle repose la synchro audio).

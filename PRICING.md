# Tarification NextGen MarketingAI

Grille du 7 octobre 2026. Elle remplace l'ancienne (29 / 49 / 79 / 199), fixée sans calcul : deux offres donnaient les mêmes droits et « illimité » était affiché sur une offre plafonnée.

## La grille

| Offre | Prix HT / mois | Crédits IA / mois | Réseaux sociaux | Pour qui |
|---|---|---|---|---|
| Gratuit | 0 € | 30 | 1 | Essayer, sans carte |
| Essentiel | 19 € | 200 | 2 | Un commerce, une présence en ligne |
| **Pro** | **39 €** | **500** | 4 (FB, IG, LinkedIn, X) | Publier chaque semaine |
| Business | 79 € | 1 200 | 4 | Gros volume |

Aucune offre n'est illimitée : chaque image générée a un coût réel.

## Le crédit

**1 crédit ≈ 1 image générée ≈ 0,05 $ de coût IA.** Une génération coûte en crédits ce qu'elle consomme réellement.

| Génération | Crédits | Ce qu'elle produit |
|---|---|---|
| Post sans image | 1 | texte |
| Post avec image | 3 | texte + 1 image |
| Image seule | 2 | 1 image |
| Logo | 3 | 1 image transparente |
| Identité de marque | 6 | texte long + logo |
| Calendrier du mois | 5 | ~30 posts texte |
| Affiche | 8 | 1 image + mise en page par le modèle principal (+ relecture) |
| Menu complet | 15 | texte + ~10 à 25 photos |
| Site complet | 15 | texte long + ~8 à 10 photos |
| Re-photographier un menu / un site | 12 / 10 | photos |
| Reel (masqué pour l'instant) | 25 | vidéo avec présentateur |

Code : `@AiQuota(...)` dans chaque contrôleur ; plafonds mensuels dans `backend/src/common/quota/ai-quota.service.ts` (modifiables par `AI_QUOTA_STARTER`, etc.) ; catalogue Stripe dans `backend/prisma/seed-plans.ts` ; limite de réseaux dans `social.service.ts`.

## Coûts réels (prix publics relevés le 7 octobre 2026)

| Poste | Prix |
|---|---|
| gpt-image-2, qualité medium | 0,053 $ (carré) · 0,041 $ (portrait / paysage) par image |
| gpt-5.4 (affiches, sites) | 2,50 $ / M tokens en entrée · 15 $ / M en sortie |
| gpt-5.4-mini | 0,75 $ / 4,50 $ par M tokens |
| Voix gpt-4o-mini-tts | ~0,015 $ / minute |
| Présentateur HeyGen (Avatar IV, API) | ~3 à 6 $ / minute de vidéo |
| Stripe, cartes européennes | 1,5 % + 0,25 € par paiement |
| Serveur Hetzner (après la hausse de juin 2026) | CX23 5,49 € · CPX22 19,49 € / mois |

Estimation du coût IA par génération (images + texte, +30 % pour les nouvelles tentatives) :

| Génération | Coût estimé |
|---|---|
| Post avec image | ~0,06 $ |
| Affiche | ~0,40 $ |
| Menu (10 photos) | ~0,55 $ (jusqu'à ~1,30 $ pour 25 photos) |
| Site | ~0,50 $ |
| Reel avec présentateur, 15 s | ~1,50 $ |

Hébergement : sites et menus publiés sont des pages statiques, donc un coût marginal quasi nul par client (stockage des images de l'ordre de quelques dizaines de Mo par mois). Le coût fixe de départ (serveur, base, sauvegardes, e-mails) est d'environ 50 à 80 € par mois, quel que soit le nombre de clients.

## Marges

Pire cas : le client consomme 100 % de ses crédits chaque mois. En pratique, la plupart en utilisent 20 à 40 %.

| Offre | Prix | IA au pire (≈0,045 € / crédit) | Stripe | Marge brute au pire |
|---|---|---|---|---|
| Essentiel | 19 € | 9,00 € | 0,54 € | ~50 % |
| Pro | 39 € | 22,50 € | 0,84 € | ~40 % |
| Business | 79 € | 54,00 € | 1,44 € | ~30 % |

Usage typique (30 % des crédits) : marge brute de 75 à 85 % selon l'offre.

Point mort sur les coûts fixes : environ 3 clients Pro en usage typique, 5 au pire. Conversion utilisée : 1 $ ≈ 0,90 €.

## Concurrence

| Outil | Ce qu'il fait | Prix |
|---|---|---|
| Canva Pro | Visuels | 12 € / mois |
| Ocoya | Posts IA + programmation | 15 $ (100 crédits) · 39 $ (500) · 79 $ (1 500) · 159 $ |
| Predis.ai | Posts et vidéos IA | 19 $ · 40 $ · 212 $ |
| Wix | Site web seul | 17 € · 30 € · 41 € / mois (TTC) |
| MenuTiger | Menu QR seul | 17 $ · 46 $ · 119 $ / mois |

Positionnement : un commerçant qui assemble Wix Light + MenuTiger + Canva Pro paie environ 45 € par mois pour trois outils qu'il doit animer lui-même. NextGen fait le site, le menu, les affiches et les posts, puis les publie, pour 39 €. Les prix restent alignés sur Ocoya et Predis, qui ne font ni site ni menu.

## Prochaines étapes

1. Lancer `npx ts-node prisma/seed-plans.ts` : crée les trois offres dans le catalogue et masque les anciennes. Les clients déjà abonnés gardent leurs droits.
2. Proposer un paiement annuel à -20 % (deux mois offerts) : il faut un prix annuel dans Stripe.
3. Vendre des packs de crédits supplémentaires, par exemple 100 crédits pour 9 € (coût ~4,50 €).
4. Afficher les prix en MAD ou TND si la clientèle est au Maghreb : il faut des prix Stripe dans ces devises, ou un affichage converti.
5. Vérifier ces hypothèses avec la vraie facture OpenAI après un mois d'usage, et ajuster les crédits.

## Sources

- OpenAI, tarifs API : https://developers.openai.com/docs/pricing
- Coût par image de gpt-image-2 : https://yingtu.ai/ja/blog/gpt-image-2-cost-per-image
- gpt-4o-mini-tts : https://www.s-anand.net/blog/openai-tts-cost/
- HeyGen : https://creatify.ai/blog/heygen-pricing-(2026)-plans-and-what-you-ll-actually-pay
- Stripe Europe : https://globalfeecalculator.com/blog/how-stripe-fees-work/
- Hetzner, hausse de juin 2026 : https://privatedevops.com/news/hetzner-june-2026-cloud-price-increase-what-to-do
- Ocoya : https://toolradar.com/tools/ocoya/pricing
- Predis.ai : https://admakeai.com/alternatives-to/predis-ai/pricing
- Canva Pro (France) : https://siecledigital.fr/2026/03/30/canva-pro-prix-fonctionnalites-et-differences-avec-la-version-gratuite/
- Wix (France) : https://www.lafabriquedunet.fr/logiciels/tendances/prix-site-wix
- MenuTiger : https://www.menutiger.com/blog/qr-code-menu-price

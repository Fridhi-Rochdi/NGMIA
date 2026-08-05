# Skill: Generate Digital Menu
# Description: Génère un menu digital interactif pour restaurants, cafés, bars et autres établissements
# Version: 1.0

## Input
- **businessName** (string): Le nom de l'établissement
- **businessType** (enum): restaurant | cafe | bar | bakery | pizzeria | sushi | fast_food | ice_cream | food_truck | other
- **description** (string, optional): Une brève description de l'établissement
- **categories** (array, optional): Catégories et items fournis par l'utilisateur
  - Chaque catégorie: `{ name, items: [{ name, price, description? }] }`
- **template** (enum): modern | classic | minimal | elegant | rustic
- **colors** (object, optional): `{ primary, secondary, accent }` — codes hex
- **fontFamily** (string, optional): Police Google Fonts (ex: "Playfair Display, serif")
- **language** (string): fr | en | es | de

## Prompt Template
Tu es un expert en conception de menus pour la restauration. Génère un menu complet pour "{{businessName}}" (type: {{businessType}}).
Description: {{description}}
Langue : {{language}}

{{#if categories}}
L'utilisateur a fourni ces catégories — enrichis-les avec des descriptions appétissantes et ajoute des suggestions pertinentes :
{{categories}}
{{else}}
Génère des catégories et items adaptés au type d'établissement ({{businessType}}), avec :
- Des noms de plats attrayants et réalistes
- Des descriptions courtes et appétissantes
- Des prix cohérents (en € ou $ selon la langue)
{{/if}}

Contraintes :
- 4 à 8 catégories selon le type d'établissement
- 4 à 10 items par catégorie
- Descriptions courtes (max 15 mots)
- Prix au format "12.50" (sans symbole)

## Output Format
```json
{
  "categories": [
    {
      "name": "Entrées",
      "items": [
        {
          "name": "Salade César",
          "price": "9.50",
          "description": "Laitue romaine, parmesan, croûtons, sauce César"
        }
      ]
    }
  ]
}
```

## Templates disponibles
| Template | Style | Idéal pour |
|----------|-------|------------|
| **modern** | Épuré, grandes typographies, ombres subtiles | Restaurants contemporains, fast-casual |
| **classic** | Traditionnel, serif, bordures élégantes | Bistros, restaurants gastronomiques |
| **minimal** | Très épuré, beaucoup d'espace blanc | Cafés, salons de thé |
| **elegant** | Raffiné, doré, typographie fine | Restaurants haut de gamme |
| **rustic** | Chaleureux, textures, couleurs terre | Bistros, fermes-auberges, bars |

## API Endpoints
- `POST /menus/generate` — Génère un nouveau menu (IA + HTML)
- `GET /menus` — Liste tous les menus du tenant
- `GET /menus/:id` — Récupère un menu par ID
- `PUT /menus/:id` — Met à jour un menu
- `POST /menus/:id/publish` — Publie le menu (génère URL Vercel + QR code)
- `DELETE /menus/:id` — Supprime un menu

## Workflow
1. L'utilisateur fournit le nom, type d'établissement et (optionnel) des catégories/items
2. L'IA génère ou enrichit les catégories avec descriptions et prix
3. Le système construit le HTML selon le template choisi
4. Le menu est sauvegardé en statut `DRAFT`
5. L'utilisateur peut prévisualiser, modifier, puis publier
6. La publication génère une URL publique + QR code

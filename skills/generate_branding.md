# Skill: Generate Branding Kit
# Description: Génère un kit de branding complet pour une entreprise
# Version: 1.0

## Input
- **company_name** (string): Nom de l'entreprise
- **industry** (string): Secteur d'activité
- **values** (string[]): Valeurs de l'entreprise
- **target_audience** (string): Public cible
- **style_preference** (enum): modern | classic | bold | minimalist

## Prompt Template
Tu es un expert en branding. Crée un kit de branding complet pour :
- Entreprise : {{company_name}}
- Secteur : {{industry}}
- Valeurs : {{values}}
- Public cible : {{target_audience}}
- Style : {{style_preference}}

Génère : nom de marque, tagline, palette de couleurs, typographie suggérée, guidelines.

## Output Format
```json
{
  "brand_name": "string",
  "tagline": "string",
  "color_palette": {
    "primary": "string",
    "secondary": "string",
    "accent": "string",
    "background": "string",
    "text": "string"
  },
  "typography": {
    "heading": "string",
    "body": "string"
  },
  "guidelines": "string"
}
```

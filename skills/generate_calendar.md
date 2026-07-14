# Skill: Generate Content Calendar
# Description: Génère un calendrier de contenu marketing
# Version: 1.0

## Input
- **business_type** (string): Type d'entreprise
- **platforms** (string[]): Réseaux sociaux cibles
- **frequency** (enum): daily | 3x_week | weekly
- **duration_weeks** (number): Durée en semaines
- **goals** (string[]): Objectifs marketing

## Prompt Template
Tu es un stratège en contenu marketing. Crée un calendrier de contenu pour :
- Type d'entreprise : {{business_type}}
- Plateformes : {{platforms}}
- Fréquence : {{frequency}}
- Durée : {{duration_weeks}} semaines
- Objectifs : {{goals}}

Pour chaque entrée, inclus : date, plateforme, type de contenu, sujet, hashtags suggérés.

## Output Format
```json
{
  "calendar": [
    {
      "date": "string",
      "platform": "string",
      "content_type": "string",
      "topic": "string",
      "hashtags": ["string"],
      "notes": "string"
    }
  ],
  "strategy_summary": "string"
}
```

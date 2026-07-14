# Skill: Generate Marketing Post
# Description: Génère un post marketing optimisé pour les réseaux sociaux
# Version: 1.0

## Input
- **topic** (string): Le sujet du post
- **platform** (enum): instagram | linkedin | twitter | facebook
- **tone** (enum): professional | casual | humorous | inspirational
- **language** (string): fr | en | es | de
- **length** (enum): short | medium | long

## Prompt Template
Tu es un expert en marketing digital. Génère un post {{platform}} sur le sujet "{{topic}}".
Ton : {{tone}}
Langue : {{language}}
Longueur : {{length}}

Le post doit inclure :
- Un accroche captivante
- Le contenu principal avec des emojis pertinents
- Un call-to-action
- 3-5 hashtags pertinents

## Output Format
```json
{
  "content": "string",
  "hashtags": ["string"],
  "platform": "string",
  "metadata": {
    "estimated_read_time": "string",
    "character_count": "number"
  }
}
```

# Skill: Generate Marketing Image
# Description: Génère une image marketing à partir d'une description
# Version: 1.0

## Input
- **description** (string): Description de l'image souhaitée
- **style** (enum): modern | minimalist | bold | elegant | playful
- **format** (enum): square | landscape | story | banner
- **brand_colors** (string[]): Couleurs principales de la marque

## Prompt Template
Génère une image marketing avec les spécifications suivantes :
- Description : {{description}}
- Style : {{style}}
- Format : {{format}}
- Couleurs de marque : {{brand_colors}}

L'image doit être professionnelle, adaptée au marketing digital.

## Output Format
```json
{
  "image_url": "string",
  "alt_text": "string",
  "dimensions": {
    "width": "number",
    "height": "number"
  },
  "format": "string"
}
```

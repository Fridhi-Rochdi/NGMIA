# Skill: Generate Automatic Reels
# Description: Génère automatiquement des Reels vidéo à partir de photos et texte fournis par l'utilisateur
# Version: 1.0

## Input
- **media** (array): Liste des médias fournis par l'utilisateur
  - **type** (enum): photo | video
  - **url** (string): URL ou chemin du fichier média
  - **description** (string): Description/caption pour ce média
- **text_content** (array): Contenus textuels à intégrer
  - **title** (string): Titre principal
  - **body** (string): Corps du texte (paragraphes, citations, etc.)
  - **cta** (string): Call-to-action
  - **hashtags** (string[]): Hashtags à inclure
- **theme** (enum): lifestyle | business | product | tutorial | testimonial | event | announcement
- **tone** (enum): professional | casual | energetic | emotional | humorous | inspirational
- **duration** (enum): 15s | 30s | 60s | 90s
- **platform** (enum): instagram | tiktok | youtube_shorts | facebook_reels
- **music_mood** (enum): upbeat | chill | emotional | trending | cinematic | corporate
- **style** (enum): modern | minimalist | bold | elegant | playful | cinematic

## Prompt Template
Tu es un expert en création de contenu vidéo Reels. Génère un script complet pour un Reel basé sur les éléments suivants :

**Médias fournis :**
{{#each media}}
- [{{type}}] {{description}}
{{/each}}

**Contenus textuels :**
- Titre : {{title}}
- Corps : {{body}}
- CTA : {{cta}}
- Hashtags : {{hashtags}}

**Spécifications :**
- Thème : {{theme}}
- Ton : {{tone}}
- Durée : {{duration}}
- Plateforme : {{platform}}
- Ambiance musicale : {{music_mood}}
- Style visuel : {{style}}

Génère un script professionnel optimisé pour la plateforme cible avec timing précis, transitions, et tous les éléments nécessaires à la production.

## Output Format
```json
{
  "reel_metadata": {
    "platform": "string",
    "duration_seconds": "number",
    "theme": "string",
    "tone": "string",
    "style": "string",
    "created_at": "string"
  },
  "script": {
    "total_duration": "number",
    "scenes": [
      {
        "scene_number": "number",
        "start_time": "number",
        "end_time": "number",
        "duration": "number",
        "media_index": "number | null",
        "shot_type": "string",
        "transition": "string",
        "voiceover": "string",
        "caption_overlay": {
          "text": "string",
          "position": "string",
          "animation": "string"
        },
        "music_cue": "string"
      }
    ]
  },
  "text_overlays": [
    {
      "scene_number": "number",
      "text": "string",
      "position": "string",
      "font_size": "string",
      "color": "string",
      "animation": "string",
      "start_time": "number",
      "end_time": "number"
    }
  ],
  "captions": [
    {
      "text": "string",
      "start_time": "number",
      "end_time": "number",
      "style": "string"
    }
  ],
  "voiceover_script": {
    "full_text": "string",
    "segments": [
      {
        "text": "string",
        "start_time": "number",
        "end_time": "number",
        "pace": "string"
      }
    ]
  },
  "music": {
    "mood": "string",
    "suggested_tracks": [
      {
        "name": "string",
        "artist": "string",
        "mood": "string",
        "bpm": "number"
      }
    ],
    "cue_points": [
      {
        "time": "number",
        "action": "string"
      }
    ]
  },
  "hashtags": ["string"],
  "caption_final": "string",
  "cta_final": "string",
  "thumbnail_suggestion": {
    "scene_number": "number",
    "description": "string",
    "text_overlay": "string"
  },
  "production_notes": {
    "equipment_needed": ["string"],
    "lighting_tips": ["string"],
    "filming_tips": ["string"],
    "editing_suggestions": ["string"]
  }
}
```

## Scene Structure by Duration

### 15 seconds (Hook-focused)
1. **Hook (0-3s)** : Accroche visuelle + texte impactant
2. **Core Content (3-12s)** : Message principal avec médias
3. **CTA (12-15s)** : Call-to-action + hashtags

### 30 seconds (Balanced)
1. **Hook (0-3s)** : Accroche visuelle
2. **Introduction (3-8s)** : Présentation du sujet
3. **Core Content (8-25s)** : Développement avec transitions
4. **CTA (25-30s)** : Call-to-action + hashtags

### 60 seconds (Detailed)
1. **Hook (0-3s)** : Accroche visuelle
2. **Introduction (3-10s)** : Context et engagement
3. **Main Content (10-50s)** : Développement complet avec plusieurs scènes
4. **Highlights (50-56s)** : Points clés récapitulés
5. **CTA (56-60s)** : Call-to-action + hashtags

### 90 seconds (Comprehensive)
1. **Hook (0-5s)** : Accroche puissante
2. **Introduction (5-15s)** : Mise en contexte
3. **Part 1 (15-35s)** : Premier axe du contenu
4. **Part 2 (35-55s)** : Deuxième axe avec médias
5. **Part 3 (55-75s)** : Troisième axe ou témoignages
6. **Highlights (75-85s)** : Résumé des points clés
7. **CTA (85-90s)** : Call-to-action final

## Shot Types Reference
- **Hook Shot** : Plan d'ouverture impactant (aerial, close-up dramatique, etc.)
- **Wide Shot** : Vue d'ensemble, contexte
- **Medium Shot** : Présentation, dialogue
- **Close-Up** : Détails, émotions
- **POV** : Perspective subjective
- **B-Roll** : Images de support, transitions
- **Text Overlay** : Texte superposé avec animation
- **Split Screen** : Comparaison, avant/après

## Transitions Reference
- **Cut** : Coupure franche
- **Fade** : Fondu
- **Dissolve** : Fondu enchaîné
- **Zoom** : Zoom in/out
- **Pan** : Mouvement horizontal
- **Slide** : Glissement
- **Bounce** : Rebond dynamique
- **Glitch** : Effet glitch moderne

## Platform-Specific Optimizations

### Instagram Reels
- Ratio : 9:16 (1080x1920)
- Durée max : 90s
- Texte : 125 caractères visibles
- Hashtags : 3-5 recommandés

### TikTok
- Ratio : 9:16 (1080x1920)
- Durée max : 10min (pour certains)
- Texte : 100 caractères visibles
- Hashtags : 3-5 trending

### YouTube Shorts
- Ratio : 9:16 (1080x1920)
- Durée max : 60s
- Texte : 100 caractères visibles
- Description : 5000 caractères

### Facebook Reels
- Ratio : 9:16 (1080x1920)
- Durée max : 90s
- Texte : 125 caractères visibles
- Hashtags : 3 recommandés

## Variants

### Tutorial Variant
Pour les tutoriels et contenus éducatifs :
- Structure : Problème → Solution → Résultat → CTA
- Focus sur les étapes numérotées
- Textes explicatifs avec animations

### Product Showcase Variant
Pour les démonstrations de produits :
- Structure : Attention → Fonctionnalité → Bénéfice → CTA
- Focus sur les détails et caractéristiques
- Transitions fluides entre les angles

### Testimonial Variant
Pour les témoignages clients :
- Structure : Contexte → Expérience → Résultat → Recommandation
- Focus sur les émotions et authenticité
- Textes courts et impactants

### Event Recap Variant
Pour les résumés d'événements :
- Structure : Ambiance → Moments forts → Conclusion
- Mix de plans larges et détails
- Énergie et dynamique

### Announcement Variant
Pour les annonces importantes :
- Structure : Teaser → Annonce → Détails → CTA
- Focus sur le message principal
- Textes clairs et professionnels
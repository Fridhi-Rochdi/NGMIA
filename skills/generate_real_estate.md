# Skill: Generate Real Estate Content
# Description: Génère du contenu marketing immobilier professionnel (annonces, descriptions, visites virtuelles)
# Version: 1.0

## Input
- **property_type** (enum): apartment | house | villa | loft | studio | penthouse | commercial | land
- **action** (enum): sale | rent | investment
- **location** (string): Localisation du bien (ville, quartier, adresse)
- **price** (number): Prix du bien
- **surface** (number): Surface en m²
- **rooms** (number): Nombre de pièces
- **bedrooms** (number): Nombre de chambres
- **features** (string[]): Caractéristiques clés (piscine, jardin, parking, terrasse, etc.)
- **highlights** (string[]): Points forts du bien ou du quartier
- **tone** (enum): luxury | professional | warm | dynamic
- **language** (string): fr | en | es | de | it
- **platform** (enum): website | leboncoin | seloger | instagram | facebook | linkedin | brochure

## Prompt Template
Tu es un expert en marketing immobilier. Génère une annonce immobilière professionnelle pour :
- Type de bien : {{property_type}}
- Type de transaction : {{action}}
- Localisation : {{location}}
- Prix : {{price}}
- Surface : {{surface}} m²
- Pièces : {{rooms}} | Chambres : {{bedrooms}}
- Caractéristiques : {{features}}
- Atouts : {{highlights}}
- Ton : {{tone}}
- Langue : {{language}}
- Plateforme cible : {{platform}}

L'annonce doit inclure :
- Un titre accrocheur et optimisé SEO
- Une description immersive et persuasive
- La mise en valeur des points forts du bien et du quartier
- Un call-to-action adapté à la plateforme
- Des mots-clés pertinents pour le référencement

## Output Format
```json
{
  "title": "string",
  "description": "string",
  "summary": "string",
  "highlights_bullet_points": ["string"],
  "call_to_action": "string",
  "seo_keywords": ["string"],
  "meta_description": "string",
  "social_caption": "string",
  "hashtags": ["string"],
  "metadata": {
    "platform": "string",
    "language": "string",
    "tone": "string",
    "estimated_read_time": "string",
    "word_count": "number"
  }
}
```

## Variants

### Luxury Variant
Pour les biens de prestige, le ton est automatiquement ajusté vers un vocabulaire haut de gamme, avec des expressions comme "exceptionnel", "prestige", "rare sur le marché", "prestigieuse adresse".

### Social Media Variant
Pour les plateformes sociales (instagram, facebook, linkedin), la sortie inclut automatiquement :
- Une version courte (caption) avec emojis
- Des hashtags pertinents
- Un format adapté à la plateforme

### Professional Variant
Pour les biens standard et les transactions classiques, le ton professionnel est appliqué par défaut. Ce variant est recommandé pour :
- Agences immobilières traditionnelles
- Portails d'annonces (LeBonCoin, SeLoger, etc.)
- Communications B2B et LinkedIn
- Documents officiels (mandats, contrats, brochures)

**Caractéristiques du ton professionnel :**
- Langage précis et factuel (pas de superlatifs excessifs)
- Mise en avant des données concrètes (surface, prix/m², DPE, charges)
- Descriptions structurées avec sections claires
- Vocabulaire juridique et technique approprié
- Call-to-action direct et sans ambiguïté

**Vocabulaire recommandé :**
- "Surface habitable", "pièces de vie", "exposition", "orientation"
- "Prix net vendeur", "honoraires charge acquéreur", "dépôt de garantie"
- "Diagnostic de performance énergétique", "charges de copropriété"
- "Visite sur rendez-vous", "dossier de candidature"

**Exemple de structure :**
1. **En-tête** : Type + Localisation + Prix
2. **Descriptif** : Configuration, surfaces, équipements
3. **Environnement** : Quartier, transports, commodités
4. **Informations techniques** : DPE, charges, taxe foncière
5. **Conditions** : Prix, honoraires, délais

### Brochure Variant
Pour le format brochure, la sortie inclut :
- Un texte plus détaillé et narratif
- Des sections structurées (Introduction, Le Bien, Le Quartier, Les Atouts)
- Une version adaptée à l'impression

### Reels / Short Video Variant
Pour les Reels et vidéos courtes (Instagram Reels, TikTok, YouTube Shorts), la sortie inclut automatiquement :
- **script** : scénario détaillé avec timing pour chaque scène (hook, visite, highlights, CTA)
- **shot_list** : liste des plans recommandés (intérieur, extérieur, drone, détails)
- **voiceover_text** : texte de voix off narrée
- **captions** : textes superposés avec timing
- **hashtags** : 10-15 hashtags的趋势 et pertinents
- **sound_suggestion** : suggestion de musique/son adapté au ton et à la plateforme
- **cta_overlay** : texte du bouton call-to-action

```json
{
  "script": {
    "duration_seconds": "number",
    "scenes": [
      {
        "scene_number": "number",
        "timing": "string",
        "shot_type": "string",
        "description": "string",
        "voiceover": "string",
        "caption_overlay": "string"
      }
    ]
  },
  "voiceover_text": "string",
  "captions": [
    {
      "text": "string",
      "start_time": "string",
      "end_time": "string"
    }
  ],
  "hashtags": ["string"],
  "sound_suggestion": {
    "mood": "string",
    "suggested_tracks": ["string"]
  },
  "cta_overlay": "string",
  "platform_optimization": {
    "instagram": "string",
    "tiktok": "string",
    "youtube_shorts": "string"
  }
}
```

#### Reels Script Structure (30-60 secondes)
1. **Hook (0-3s)** : Accroche visuelle forte — plan aerial ou vue extérieure saisissante
2. **Introduction (3-8s)** : Présentation rapide du bien avec voix off
3. **Visite Guidée (8-45s)** : Parcours des pièces principales avec transitions fluides
4. **Highlights (45-52s)** : Points forts mis en avant avec texte superposé
5. **CTA Final (52-60s)** : Appel à l'action avec lien/bouton

#### Shot Types Recommandés
- **Drone/Aerial** : vue extérieure, quartier, environnement
- **Wide Shot** : salon, cuisine, façade
- **Detail Shot** : finitions, équipements, décoration
- **Walking Shot** : transition entre les pièces
- **Sunset/Golden Hour** : éclairage naturel valorisant

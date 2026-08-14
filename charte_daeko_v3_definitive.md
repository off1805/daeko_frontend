# Charte graphique Daeko

**Plateforme de gestion scolaire — Cameroun**
Version 3.0 — DÉFINITIVE — Référence : DAEKO-CG-3.0

---

## Journal de version

- **1.0** — Charte initiale, accent indigo, neutres chauds
- **1.1** — Neutres purs (zinc)
- **2.0** — Système monochromatique émeraude (teinte-mère)
- **3.0** — **Version définitive.** Accent unique cobalt `#1859C4` sur neutres zinc rigoureusement purs, sidebar marine `#132644` comme signature de marque. Philosophie « neutres purs + accent parcimonieux » (école Stripe/Notion), avec l'expression de marque concentrée dans la navigation (motif HubSpot/Shopify).

---

## Sommaire

1. Philosophie
2. Le système chromatique — méthode
3. Identité de marque
4. Palette complète
5. La sidebar marine
6. Typographie
7. Grille et espacements
8. Bordures, coins et élévation
9. Iconographie
10. Composants d'interface
11. États et interactions
12. Motifs de contenu
13. Mode sombre
14. Application aux écrans clés
15. Accessibilité
16. Variables CSS de référence
17. Gouvernance

---

## 1. Philosophie

Daeko est utilisé quotidiennement par des administrateurs d'établissements scolaires camerounais, souvent sur du matériel modeste avec une connectivité irrégulière. Trois principes tranchent tout débat :

**Lisibilité avant tout.** Chaque choix de taille, contraste et espacement est arbitré d'abord pour l'administrateur qui scanne une matrice de coefficients à 22h sur une tablette d'ancienne génération.

**Neutralité des fonds, parcimonie de l'accent.** La zone de travail est achromatique — blanc pur et gris zinc sans aucune dominante. Le cobalt n'apparaît que là où il signifie quelque chose : action primaire, navigation active, information de marque. Quand le cobalt apparaît, il veut dire quelque chose.

**Neutralité culturelle et bilingue.** Rien ne privilégie visuellement le sous-système francophone ou anglophone. Aucun symbole culturellement marqué.

---

## 2. Le système chromatique — méthode

### 2.1 Deux zones, deux registres

Le système repose sur une séparation nette :

**La zone de contenu** (là où l'administrateur travaille) est strictement neutre : fond blanc pur, surfaces et gris de la famille zinc — des gris mathématiquement purs, sans dominante chaude ni froide. Les données, les tableaux, les formulaires vivent sur cette neutralité absolue, qui garantit une lisibilité maximale et ne fatigue jamais.

**La zone de navigation** (la sidebar) porte l'identité : un marine profond `#132644` — qui est littéralement le cobalt de marque poussé vers l'encre (même hue ~215°). La marque s'exprime pleinement dans cette colonne sans jamais toucher un pixel de la zone de travail. C'est le motif HubSpot/Shopify : identité forte, contenu serein.

### 2.2 La discipline de l'accent unique

Le cobalt `#1859C4` est la **seule** couleur d'identité de l'interface. Il apparaît exclusivement sur :

- Le bouton d'action primaire (un seul par vue)
- L'item de navigation actif (via ses dérivés sidebar)
- Le bandeau informatif et le badge « officiel »
- Les liens, le focus ring, la barre de progression
- Le monogramme

Aucune deuxième couleur décorative n'est autorisée, jamais. Les couleurs fonctionnelles (vert, ambre, rouge) sont des signaux d'état, pas des éléments d'identité — elles sont volontairement assourdies pour ne pas concurrencer le cobalt ni agresser les fonds neutres.

### 2.3 Règle de dérivation

Toute nouvelle couleur ajoutée au système doit être : soit un dérivé direct du cobalt (hue ~215°, saturation/luminosité ajustées), soit un zinc pur, soit une fonctionnelle assourdie validée collégialement. Jamais une valeur brute piochée dans un framework.

---

## 3. Identité de marque

### 3.1 Le nom

**Daeko**, écrit **en minuscules** (`daeko`) dans les usages typographiques, majuscule initiale en début de phrase uniquement. Jamais `DAEKO`.

### 3.2 Le monogramme

Carré aux coins arrondis (rayon = 20% de la taille) contenant la lettre `D` stylisée, trait géométrique sans empattement.

| Contexte | Fond du carré | Lettre D |
|---|---|---|
| Sur fond clair (contenu, documents) | `#1859C4` | Blanc pur |
| Sur la sidebar marine | `#5B93E8` | `#132644` |
| Sur fond sombre (mode sombre) | `#5B93E8` | `#101012` |

**Tailles minimales :** favicon 16px · interface 24px · imprimé 8 mm · bulletin officiel 12 mm.
**Zone de protection :** 25% de la taille du logo tout autour.

### 3.3 Le mot-symbole

Inter Medium (500), minuscules, letter-spacing −2%. Couleur : Texte fort `#111113` sur fond clair, blanc sur la sidebar marine. Jamais en cobalt.

### 3.4 Composition et signature

Monogramme et mot-symbole alignés horizontalement, espacés de 35% de la hauteur du monogramme, hauteur d'x du mot = 65% du monogramme. Signature optionnelle : *La gestion scolaire, simplifiée* — Inter Regular 13px, Texte doux, calée sur le mot-symbole.

---

## 4. Palette complète

### 4.1 Accent — Cobalt

| Nom | Mode clair | Mode sombre | Usage |
|---|---|---|---|
| Cobalt Daeko | `#1859C4` | `#5B93E8` | Action primaire, liens, focus, progression |
| Cobalt hover | `#12448F` | `#79A8ED` | Survol de l'action primaire |
| Cobalt brume | `#EAF1FB` | `#14294A` | Bandeau informatif, badge officiel, fond d'accent doux |
| Cobalt encre | `#12448F` | `#A9C4F0` | Texte sur Cobalt brume |

Le cobalt n'est jamais utilisé en aplat de fond sur des surfaces larges de la zone de contenu.

### 4.2 Neutres — zinc, rigoureusement purs

Aucune dominante. Composantes R, G, B égales ou quasi égales dans chaque valeur.

**Mode clair :**

| Nom | Hex | Usage |
|---|---|---|
| Fond page | `#FFFFFF` | Canevas principal de la zone de contenu |
| Surface subtile | `#FAFAFA` | En-têtes de tableau, hover de ligne, cellule au survol |
| Bordure | `#E4E4E7` | Hairline des cartes, séparateurs |
| Bordure forte | `#D4D4D8` | Contours au survol, séparateurs marqués |
| Texte doux | `#71717A` | Métadonnées, placeholders, indications |
| Texte secondaire | `#52525B` | Sous-titres, texte de support |
| Texte fort | `#111113` | Corps de texte, titres, données |

**Mode sombre :**

| Nom | Hex | Usage |
|---|---|---|
| Fond page | `#101012` | Canevas principal |
| Surface carte | `#1A1A1D` | Cartes, panneaux, dialogues |
| Surface élevée | `#232327` | Popovers, éléments flottants |
| Bordure | `#333338` | Hairline |
| Bordure forte | `#45454B` | Contours au survol |
| Texte doux | `#A1A1AA` | Métadonnées |
| Texte fort | `#F4F4F5` | Corps de texte, titres |

### 4.3 Couleurs fonctionnelles — assourdies

Des tons posés, de palette d'imprimeur — jamais des couleurs de panneau de signalisation qui agresseraient les fonds neutres.

**Vert — stable, succès, en cours :**

| Rôle | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge | `#E3F3E8` | `#123A24` |
| Texte | `#1D5E37` | `#7DD3A0` |
| Trait plein / icône | `#2E8B57` | `#4DBB7F` |

**Ambre — attention, non-bloquant, obsolète, à préparer :**

| Rôle | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge / bandeau | `#FAF0DC` | `#453413` |
| Texte | `#7A5512` | `#EBC97F` |
| Trait plein / icône | `#B7791F` | `#D9A03C` |

L'ambre ne remplace jamais le rouge sur un vrai blocage.

**Rouge — blocage, erreur, irréversible :**

| Rôle | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge / bandeau | `#F9E6E3` | `#4A1815` |
| Texte | `#8A2A20` | `#F0A79E` |
| Trait plein / icône | `#C0392B` | `#E06152` |

Le rouge est réservé aux vrais blocages. Jamais pour un élément simplement obsolète — c'est le rôle de l'ambre.

### 4.4 Badges officiel / personnalisé

Le signal structurant du module Structure Pédagogique. Deux registres distincts et calmes — un coefficient personnalisé n'est pas une anomalie.

| Badge | Mode clair — fond / texte | Mode sombre — fond / texte |
|---|---|---|
| Officiel | `#EAF1FB` / `#12448F` (cobalt brume) | `#14294A` / `#A9C4F0` |
| Personnalisé | `#F3EBF8` / `#5E3A80` (prune discret) | `#2E2138` / `#CBB3E0` |

L'« officiel » reprend logiquement la brume de la marque (la norme nationale = la couleur du système) ; le « personnalisé » s'en écarte par un prune désaturé qui reste dans le registre posé.

### 4.5 Règle de contraste

WCAG AA minimum sur tout couple texte/fond (4.5:1 corps, 3:1 grands titres). Toutes les combinaisons listées sont conformes. Ne jamais improviser une combinaison hors charte.

---

## 5. La sidebar marine

La sidebar est la signature visuelle de Daeko : une colonne marine profonde sur laquelle la zone de contenu blanche se détache instantanément. Elle possède sa propre mini-palette, dérivée du cobalt (hue ~215°) — à spécifier telle quelle, sans improvisation.

### 5.1 Palette sidebar (mode clair de l'application)

| Rôle | Hex | Usage |
|---|---|---|
| Fond sidebar | `#132644` | La colonne entière |
| Item actif | `#1E3A66` | Fond de l'item de navigation courant |
| Item survolé | `#182F54` | Fond au survol |
| Texte item | `#B8C9E2` | Libellés des items au repos |
| Texte item actif | `#FFFFFF` | Libellé de l'item courant |
| Icône item | `#8FAAD1` | Icônes au repos |
| Icône item actif | `#FFFFFF` | Icône de l'item courant |
| Monogramme (fond) | `#5B93E8` | Le carré du logo sur la sidebar |
| Monogramme (lettre) | `#132644` | Le D, dans la teinte du fond |

### 5.2 Règles

- Largeur : 240px déployée, 64px repliée (icônes seules, tooltips au survol)
- Aucune bordure entre sidebar et contenu — le contraste marine/blanc suffit
- Item : 36px de hauteur, padding horizontal 12px, rayon 6px
- L'item actif ne prend jamais le cobalt vif `#1859C4` en fond : sur marine, un aplat saturé vibre. L'éclaircissement d'un cran (`#1E3A66`) + texte blanc fait le signal.
- Le pied de sidebar accueille l'identité de l'établissement (avatar initiales + nom), même registre de couleurs
- Sur mobile (< 640px), la sidebar devient un menu plein écran, même palette

### 5.3 Sidebar en mode sombre de l'application

Le contraste marine/contenu s'affaiblit quand le contenu devient sombre. La sidebar reste marine mais s'ajuste :

| Rôle | Hex |
|---|---|
| Fond sidebar | `#0E1D33` (marine légèrement plus sombre que le mode clair) |
| Item actif | `#1B355E` |
| Item survolé | `#152A4A` |
| Textes et icônes | Identiques au mode clair |

Une hairline `#1F2C42` sépare la sidebar du contenu sombre, puisque le contraste seul ne suffit plus.

---

## 6. Typographie

### 6.1 Police unique — Inter

Aucune seconde famille, aucune serif décorative.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Trois graisses : **Regular (400)**, **Medium (500)**, **Semibold (600)**.

### 6.2 Échelle typographique

| Nom | Taille | Graisse | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| Titre 1 | 32px | 500 | 1.2 | −2% | Titre principal d'écran |
| Titre 2 | 24px | 500 | 1.25 | −1% | Titres de section |
| Titre 3 | 20px | 500 | 1.3 | −1% | Sous-titres, en-têtes de bloc |
| Titre 4 | 17px | 500 | 1.4 | 0 | Titres de cartes |
| Corps | 15px | 400 | 1.6 | 0 | Texte courant |
| Corps fort | 15px | 500 | 1.6 | 0 | Libellés, données importantes |
| Secondaire | 13px | 400 | 1.5 | 0 | Métadonnées, sous-titres |
| Petit | 12px | 500 | 1.4 | 0 | Badges, étiquettes |
| Micro | 11px | 400 | 1.3 | 0 | Références techniques |

**Minimum absolu : 11px.**

### 6.3 Couleurs de texte

Texte fort `#111113`/`#F4F4F5` pour titres, corps et données ; Texte secondaire `#52525B` pour le support ; Texte doux `#71717A`/`#A1A1AA` pour métadonnées et placeholders. Rien de plus clair que Texte doux. Jamais d'opacité sur du texte.

### 6.4 Règles d'usage

- Jamais de capitales sauf acronymes officiels (BEPC, GCE, MINESEC). Casse de phrase partout.
- Pas de ponctuation finale sur les libellés courts ; normale sur les phrases complètes.
- Alignement à gauche, jamais justifié. Nombres de tableau alignables à droite.
- Ton naturel : « Vous n'avez pas encore… ».

---

## 7. Grille et espacements

### 7.1 Unité de base : 4px

Tous les espacements, tailles et rayons sont des multiples de 4.

### 7.2 Échelle

| Nom | Valeur | Usage |
|---|---|---|
| xs | 4px | Icône ↔ texte |
| sm | 8px | Éléments liés (label + input) |
| md | 12px | Éléments d'une même carte |
| lg | 16px | Entre cartes, entre paragraphes |
| xl | 24px | Entre sections |
| 2xl | 32px | Entre zones fonctionnelles |
| 3xl | 48px | Marges externes d'écran |
| 4xl | 64px | Respirations larges |

### 7.3 Layout

12 colonnes, gouttière 24px, contenu max 1280px centré dès 1440px.

| Rupture | Largeur | Comportement |
|---|---|---|
| Mobile | < 640px | Une colonne, sidebar en menu plein écran |
| Tablette | 640–1024px | Grille adaptée, sidebar repliée (64px) |
| Desktop | 1024–1440px | Grille pleine, sidebar déployée |
| Large | ≥ 1440px | Contenu centré à 1280px |

### 7.4 Padding des composants

| Composant | Vertical | Horizontal |
|---|---|---|
| Bouton standard | 9px | 16px |
| Bouton compact | 6px | 12px |
| Bouton large | 12px | 20px |
| Carte | 16px | 20px |
| Champ de saisie | 8px | 12px |
| Badge | 3px | 10px |
| Bandeau d'alerte | 12px | 14px |
| Cellule de tableau | 10px | 12px |

---

## 8. Bordures, coins et élévation

### 8.1 Épaisseur

**0.5px partout.** Exceptions : 1px pour les tableaux denses ; 2px pour un élément recommandé.

### 8.2 Couleurs

Bordure `#E4E4E7`/`#333338` ; Bordure forte `#D4D4D8`/`#45454B` ; fonctionnelle = teinte pleine de l'état.

### 8.3 Rayons

| Nom | Valeur | Usage |
|---|---|---|
| Petit | 6px | Boutons, champs, items de sidebar |
| Moyen | 8px | Bandeaux |
| Grand | 12px | Cartes, dialogues |
| Pilule | 999px | Badges |

**Jamais de coins arrondis sur une bordure d'un seul côté.**

### 8.4 Élévation plate

Pas d'ombres en flux, pas de dégradés. Hiérarchie par différence de fond, hairline et espacement. Le fond étant blanc pur, **toute carte porte sa hairline obligatoirement**.

Exception, éléments flottants uniquement :
- Clair : `box-shadow: 0 4px 12px rgba(17, 17, 19, 0.08), 0 2px 4px rgba(17, 17, 19, 0.04)`
- Sombre : `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)`

---

## 9. Iconographie

- **Tabler Icons**, variante **outline** exclusivement. Rien à la main sauf le monogramme.
- Tailles : 16px (boutons), 20px (titres), 24px (décorative), 40px (états vides). Jamais plus.
- Couleur : celle du texte adjacent. Exceptions : bandeaux fonctionnels (teinte de l'état), bouton primaire (blanc), sidebar (mini-palette section 5).
- **Aucun emoji dans l'interface.**

---

## 10. Composants d'interface

### 10.1 Boutons — trois variantes

**Primaire** (une seule par vue) : fond `#1859C4`/`#5B93E8`, texte blanc/`#101012`, sans bordure, rayon 8px, padding 9px 16px, Medium.
**Secondaire** : fond blanc/transparent, texte Texte fort, bordure 0.5px Bordure forte, rayon 8px.
**Ghost** : transparent, texte Texte doux, sans bordure.

**États :** hover = `#12448F` (primaire) ou fond assombri d'un cran · active = `scale(0.98)` 100ms · focus = ring 2px cobalt offset 4px · disabled = opacité 50%, `not-allowed`.

**Cas particulier :** le bouton « Clôturer définitivement » (et lui seul) est un plein rouge `#C0392B` texte blanc — seule exception au monopole cobalt sur les boutons pleins, réservée aux actions irréversibles.

### 10.2 Champs de saisie

Hauteur 36px, fond blanc/Surface carte, bordure 0.5px, rayon 6px, padding 8px 12px, texte 15px. Focus : bordure `#1859C4` + ring 2px `#EAF1FB`. Label au-dessus 13px Medium (marge 6px) ; aide 12px Texte doux (marge 4px) ; erreur 12px `#C0392B` avec `ti-alert-circle` 14px.

### 10.3 Cartes

Fond Surface carte, hairline 0.5px obligatoire, rayon 12px, padding 16px 20px. Hover cliquable : Bordure forte. Structure : en-tête (titre 15px Medium + badge), corps, séparateur 0.5px si besoin, pied 13px Texte doux.

### 10.4 Badges

Hauteur 20px, padding 3px 10px, pilule, 12px Medium. Sémantique selon 4.3/4.4. Pas d'icône sauf nécessité.

### 10.5 Bandeaux d'alerte

Padding 12px 14px, rayon 8px, icône 18px alignée première ligne.
- **Informatif** : fond `#EAF1FB`, bordure `#C4D8F3`, `ti-info-circle` `#1859C4`, texte `#12448F`
- **Attention** : fond `#FAF0DC`, bordure `#E8CD96`, `ti-alert-triangle` `#B7791F`, texte `#7A5512`
- **Blocage** : fond `#F9E6E3`, bordure `#EBB4AC`, `ti-alert-circle` `#C0392B`, texte `#8A2A20`

### 10.6 Tableaux

Bordure externe 0.5px rayon 8px ; séparateurs 0.5px ; en-tête fond `#FAFAFA`/`#232327` texte 13px Medium ; cellules padding 10px 12px texte 14px ; hover fond `#FAFAFA`. Denses : padding vertical réductible à 6px minimum. Matrice complète : 1px autorisé, en-tête sticky.

### 10.7 Dialogue modal

480px (confirmations) / 640px (formulaires). Fond Surface carte, rayon 12px, padding 24px. Overlay `rgba(17, 17, 19, 0.5)`. Titre 20px Medium, corps 15px, actions en bas à droite (primaire à droite).

---

## 11. États et interactions

### 11.1 Focus visible

Ring 2px cobalt, offset 4px, sur tout élément interactif au clavier. Sur fond coloré : 2px blanc 90% + 2px cobalt.

### 11.2 Transitions

**150ms ease-out**, max 200ms. Animables : `background`, `border-color`, `transform` uniquement.

### 11.3 Chargement

Bloc : squelette `#FAFAFA`/`#232327` avec shimmer discret. Bouton : `ti-loader-2` en rotation, taille conservée. Écran : barre 2px cobalt en haut.

### 11.4 États vides

Jamais « aucune donnée ». Icône 40px Texte doux, titre 17px Medium, une phrase 15px, bouton primaire.

### 11.5 Toasts

Succès : fond `#E3F3E8` texte `#1D5E37` `ti-check`, 3s, coin bas droit à 24px. Erreur : fond `#F9E6E3` texte `#8A2A20` `ti-alert-circle`, fermeture manuelle, message actionnable.

---

## 12. Motifs de contenu

### 12.1 Ton

Un collègue compétent — jamais un manuel, jamais un assistant obséquieux. Direct, bienveillant sans infantiliser, culturellement neutre (pas d'expressions franco-françaises, pas d'anglicismes évitables).

### 12.2 Formulations

- Boutons : verbe à l'infinitif. ✓ « Créer la branche » · ✗ « OK », « Valider »
- Erreurs : ce qui s'est passé + quoi faire. ✓ « Ce nom est déjà utilisé. Essayez un autre libellé. »
- Irréversible : énoncer la conséquence + confirmation par saisie du libellé.

### 12.3 Nombres et dates

Milliers à l'espace insécable (`1 234`), décimales à la virgule (`12,50`), dates `JJ/MM/AAAA` (longues en toutes lettres sur documents officiels), années académiques toujours `AAAA-AAAA`.

### 12.4 Bilinguisme

Tout localisé français/anglais, rien en dur. Les libellés du catalogue s'affichent dans la langue de leur sous-système, indépendamment de la langue d'interface.

---

## 13. Mode sombre

### 13.1 Principe

Neutres zinc redérivés en sombre (`#101012` fond, `#1A1A1D` cartes) ; cobalt éclairci en `#5B93E8` ; fonctionnelles éclaircies et désaturées. La hiérarchie s'inverse : les cartes remontent au-dessus du fond.

### 13.2 Déclenchement

1. Préférence explicite sauvegardée → 2. `prefers-color-scheme` → 3. Clair par défaut. Bascule manuelle + `Ctrl/Cmd + Shift + L`.

### 13.3 Ajustements

- Monogramme : carré `#5B93E8`, lettre `#101012`
- Bouton primaire : texte `#101012` sur `#5B93E8` (un blanc laverait le bouton)
- Sidebar : voir section 5.3 (marine assombri + hairline)
- Focus rings : `#5B93E8`

### 13.4 Invariants

Typographie, rayons, épaisseurs, espacements, grilles, tailles d'icônes : identiques dans les deux modes.

---

## 14. Application aux écrans clés

### 14.1 Tableau de bord

**Année stable :** contenu blanc, titre « Ma structure » 24px, sous-titre 13px Texte doux, cartes gap 12px, badges « En cours » verts. Aucun bouton primaire — écran calme.
**Fenêtre de rentrée :** bandeau `#EAF1FB` avec `ti-refresh` cobalt « Préparer la rentrée à partir de 2025-2026 », lien « Commencer » cobalt. Cartes avec barre de progression fine (fond `#E4E4E7`, remplissage ambre en cours, vert à complétion).

### 14.2 Assistant de configuration

Segments 4px : vert validé, cobalt en cours, `#E4E4E7` à venir. Titre 20px, sous-titre 13px « Étape 4 sur 5 · Matières · Terminale D ». Carte pleine largeur. « Retour » ghost, « Continuer » primaire.

### 14.3 Matrice des coefficients

Tableau 1px, en-tête sticky `#FAFAFA`, cellules coefficient + badge officiel (cobalt brume) / personnalisé (prune). Bascule « Par coefficient / Par groupe », « Imprimer » secondaire.

### 14.4 Clôture d'année

Écran sobre, titre 24px centré, conséquences en liste avec `ti-lock` Texte doux, confirmation par saisie du libellé. « Annuler » secondaire, « Clôturer définitivement » rouge plein `#C0392B` — l'unique bouton plein non-cobalt du système.

---

## 15. Accessibilité

- **Contraste** : WCAG AA minimum partout ; AAA visé
- **Clavier** : tout utilisable sans souris, focus ring visible partout
- **Lecteurs d'écran** : `aria-hidden` sur icônes décoratives, `aria-label` sur boutons-icônes, `aria-live` sur les changements d'état
- **`prefers-reduced-motion`** : animations non-essentielles désactivées
- **Cibles tactiles** : 44 × 44px minimum

---

## 16. Variables CSS de référence

```css
:root {
  /* Accent — Cobalt */
  --color-brand: #1859C4;
  --color-brand-hover: #12448F;
  --color-brand-mist: #EAF1FB;
  --color-brand-ink: #12448F;

  /* Neutres — zinc purs */
  --color-bg-page: #FFFFFF;
  --color-bg-subtle: #FAFAFA;
  --color-border: #E4E4E7;
  --color-border-strong: #D4D4D8;
  --color-text-soft: #71717A;
  --color-text-secondary: #52525B;
  --color-text-strong: #111113;

  /* Sidebar marine — mini-palette dédiée */
  --sidebar-bg: #132644;
  --sidebar-item-active: #1E3A66;
  --sidebar-item-hover: #182F54;
  --sidebar-text: #B8C9E2;
  --sidebar-text-active: #FFFFFF;
  --sidebar-icon: #8FAAD1;
  --sidebar-logo-bg: #5B93E8;

  /* Fonctionnelles — assourdies */
  --color-success-bg: #E3F3E8;
  --color-success-text: #1D5E37;
  --color-success-solid: #2E8B57;
  --color-warning-bg: #FAF0DC;
  --color-warning-text: #7A5512;
  --color-warning-solid: #B7791F;
  --color-danger-bg: #F9E6E3;
  --color-danger-text: #8A2A20;
  --color-danger-solid: #C0392B;

  /* Badges officiel / personnalisé */
  --color-official-bg: #EAF1FB;
  --color-official-text: #12448F;
  --color-custom-bg: #F3EBF8;
  --color-custom-text: #5E3A80;

  /* Typographie */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 20px;
  --font-size-h4: 17px;
  --font-size-body: 15px;
  --font-size-secondary: 13px;
  --font-size-small: 12px;
  --font-size-micro: 11px;

  /* Espacements */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-2xl: 32px;
  --space-3xl: 48px;
  --space-4xl: 64px;

  /* Bordures et rayons */
  --border-width: 0.5px;
  --border-width-table: 1px;
  --border-width-accent: 2px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;

  /* Ombres (flottants uniquement) et overlay */
  --shadow-popover: 0 4px 12px rgba(17, 17, 19, 0.08), 0 2px 4px rgba(17, 17, 19, 0.04);
  --overlay: rgba(17, 17, 19, 0.5);

  /* Transitions */
  --transition-fast: 150ms ease-out;
}

[data-mode="dark"] {
  --color-brand: #5B93E8;
  --color-brand-hover: #79A8ED;
  --color-brand-mist: #14294A;
  --color-brand-ink: #A9C4F0;

  --color-bg-page: #101012;
  --color-bg-card: #1A1A1D;
  --color-bg-elevated: #232327;
  --color-border: #333338;
  --color-border-strong: #45454B;
  --color-text-soft: #A1A1AA;
  --color-text-strong: #F4F4F5;

  --sidebar-bg: #0E1D33;
  --sidebar-item-active: #1B355E;
  --sidebar-item-hover: #152A4A;
  --sidebar-border: #1F2C42;

  --color-success-bg: #123A24;
  --color-success-text: #7DD3A0;
  --color-success-solid: #4DBB7F;
  --color-warning-bg: #453413;
  --color-warning-text: #EBC97F;
  --color-warning-solid: #D9A03C;
  --color-danger-bg: #4A1815;
  --color-danger-text: #F0A79E;
  --color-danger-solid: #E06152;

  --color-official-bg: #14294A;
  --color-official-text: #A9C4F0;
  --color-custom-bg: #2E2138;
  --color-custom-text: #CBB3E0;

  --shadow-popover: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
  --overlay: rgba(0, 0, 0, 0.6);
}
```

---

## 17. Gouvernance

Cette charte est la source unique de vérité pour toute intervention sur l'interface. Toute modification doit :

- Être justifiée par un besoin utilisateur réel, jamais par une préférence esthétique isolée
- Respecter la règle de dérivation (section 2.3) : dérivé du cobalt, zinc pur, ou fonctionnelle assourdie validée — jamais une valeur brute de framework
- Préserver le monopole du cobalt comme accent unique et la neutralité absolue des fonds de contenu
- Être documentée dans le journal de version
- Être validée collégialement

En cas de conflit entre cette charte et une décision technique locale, la charte prévaut, sauf décision explicite de l'équipe produit.

---

*Document de référence — équipe produit Daeko*
*Version 3.0 DÉFINITIVE · Référence DAEKO-CG-3.0*

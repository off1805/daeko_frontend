# Charte graphique Daeko

**Plateforme de gestion scolaire — Cameroun**
Version 1.0 — Référence : DAEKO-CG-1.0

---

## Sommaire

1. Philosophie de la charte
2. Identité de marque
3. Système de couleurs
4. Typographie
5. Grille et espacements
6. Bordures, coins et élévation
7. Iconographie
8. Composants d'interface
9. États et interactions
10. Motifs de contenu
11. Mode sombre
12. Application aux écrans clés
13. Accessibilité et bonnes pratiques
14. Ressources et livrables

---

## 1. Philosophie de la charte

Daeko est une plateforme utilisée quotidiennement par les administrateurs d'établissements scolaires camerounais, souvent sur du matériel modeste et avec une connectivité irrégulière. La charte graphique doit servir trois objectifs simultanés qui structurent chaque décision qui suit.

**Lisibilité avant tout.** Un administrateur qui prépare la rentrée à 22h sur une tablette d'ancienne génération doit pouvoir scanner une matrice de coefficients sans effort. Chaque choix de taille de texte, de contraste et d'espacement est arbitré en priorité en fonction de ce critère, jamais en fonction de l'esthétique pure.

**Sensation de produit moderne, sans effet gratuit.** L'interface doit donner immédiatement la sensation d'un outil actuel et bien conçu — pas d'un logiciel administratif des années 2010, mais pas non plus d'une démo tape-à-l'œil. Aucun dégradé complexe, aucune animation coûteuse, aucun effet visuel qui alourdit le rendu sur un ordinateur d'entrée de gamme.

**Neutralité culturelle et bilingue.** Rien dans la charte ne doit privilégier visuellement le sous-système francophone ou anglophone. Aucun symbole culturellement marqué, aucune imagerie qui daterait ou situerait géographiquement le produit.

Ces trois principes sont prioritaires sur tout ce qui suit. En cas de doute, ils tranchent.

---

## 2. Identité de marque

### 2.1 Le nom

Le nom du produit est **Daeko**, systématiquement écrit **en minuscules** dans les usages typographiques (`daeko`), sauf en début de phrase où il porte une majuscule initiale (`Daeko`). Ce choix renforce la sensation moderne et l'aligne avec les standards actuels des plateformes SaaS. Il ne doit jamais apparaître en capitales (`DAEKO`).

### 2.2 Le monogramme

Le logo principal est un monogramme géométrique : un carré aux coins arrondis contenant la lettre `D` stylisée.

**Spécifications techniques :**
- Format : carré à coins arrondis
- Rayon des coins : 20% de la taille du carré (ex. 8px de rayon pour un carré de 40px)
- Fond : Indigo Daeko (voir palette)
- Lettre `D` : blanc pur en mode clair, Indigo profond `#1E1B4B` en mode sombre
- Trait de la lettre : géométrique, sans empattement, épaisseur constante

**Tailles minimales d'usage :**
- Favicon : 16 × 16 pixels
- Interface : 24 × 24 pixels minimum
- Documents imprimés : 8 mm de côté minimum
- Impression sur bulletin officiel : 12 mm de côté

**Zone de protection :** aucun élément graphique ou texte ne doit se rapprocher du logo à moins d'une distance égale à 25% de sa taille (soit 10px de marge pour un logo de 40px).

### 2.3 Le mot-symbole

Le nom `daeko` écrit typographiquement suit ces règles :
- Police : Inter, graisse Medium (500)
- Casse : minuscules
- Espacement des lettres : `-2%` (letter-spacing serré)
- Couleur : Texte fort de la palette (jamais l'indigo)

### 2.4 Composition logo + mot-symbole

Lorsque le monogramme et le mot-symbole apparaissent ensemble (page de connexion, en-tête de document officiel), ils sont alignés horizontalement, séparés par un espace égal à 35% de la hauteur du monogramme. Le mot-symbole a une hauteur d'x égale à 65% de la hauteur du monogramme.

### 2.5 Signature

En dessous du logo composé, une signature en texte doux peut apparaître : *La gestion scolaire, simplifiée*. Elle utilise Inter Regular 13px et se cale à gauche sur le mot-symbole, jamais sur le monogramme.

---

## 3. Système de couleurs

### 3.1 Palette principale — Indigo Daeko

L'Indigo Daeko est la couleur d'identité du produit. Elle porte l'action primaire, les liens actifs, les focus rings et le monogramme. Elle n'est jamais utilisée en aplat de fond sur des surfaces larges — sa saturation est trop forte pour cet usage.

| Nom | Hex mode clair | Hex mode sombre | Usage |
|---|---|---|---|
| Indigo Daeko | `#4F46E5` | `#818CF8` | Action primaire, liens actifs, focus |
| Indigo léger | `#EEF2FF` | `#312E81` | Fond de badge officiel, hover discret |
| Indigo profond | `#1E1B4B` | `#C7D2FE` | Texte sur bouton primaire (dark uniquement), textes d'accent |

Règle absolue : n'utiliser que ces trois teintes, jamais une valeur intermédiaire non listée.

### 3.2 Neutres

Les neutres portent 90% de la surface de l'interface. Ils sont volontairement chauds (nuances de gris tirant légèrement vers le beige) plutôt que froids, pour donner une sensation moins clinique qu'un pur gris technique.

**Mode clair :**

| Nom | Hex | Usage |
|---|---|---|
| Fond page | `#FAFAF9` | Canevas principal de l'application |
| Surface carte | `#FFFFFF` | Cartes, panneaux, dialogues |
| Bordure | `#E7E5E4` | Séparateurs, contours de cartes |
| Bordure forte | `#D6D3D1` | Contours au survol, séparateurs marqués |
| Texte doux | `#78716C` | Métadonnées, sous-titres, texte secondaire |
| Texte fort | `#1C1917` | Corps de texte principal, titres |

**Mode sombre :**

| Nom | Hex | Usage |
|---|---|---|
| Fond page | `#1C1917` | Canevas principal de l'application |
| Surface carte | `#292524` | Cartes, panneaux, dialogues |
| Bordure | `#44403C` | Séparateurs, contours de cartes |
| Bordure forte | `#57534E` | Contours au survol |
| Texte doux | `#A8A29E` | Métadonnées, sous-titres |
| Texte fort | `#FAFAF9` | Corps de texte principal, titres |

### 3.3 Couleurs fonctionnelles

Elles portent les états métier récurrents. Chaque couleur a un rôle unique et invariant — un vert n'apparaît jamais pour signaler autre chose que du succès ou du stable.

**Vert — succès, stable, positif :**

| État | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge | `#D1FAE5` | `#064E3B` |
| Texte sur badge | `#065F46` | `#A7F3D0` |
| Icône ou trait | `#059669` | `#34D399` |

**Orange — attention, non-bloquant, à préparer :**

| État | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge ou bandeau | `#FEF3C7` | `#78350F` |
| Texte sur badge ou bandeau | `#92400E` | `#FDE68A` |
| Icône ou trait | `#D97706` | `#FBBF24` |

Le orange est utilisé exclusivement pour les avertissements non-bloquants (élément déprécié, année à préparer). Il ne remplace jamais le rouge sur un vrai blocage.

**Rouge — blocage, erreur, action irréversible :**

| État | Mode clair | Mode sombre |
|---|---|---|
| Fond de badge | `#FEE2E2` | `#7F1D1D` |
| Texte sur badge | `#991B1B` | `#FECACA` |
| Icône ou trait | `#DC2626` | `#F87171` |

Le rouge est réservé aux vrais blocages : validation impossible, coefficient invalide, doublon détecté, clôture irréversible. Ne jamais l'utiliser pour signaler quelque chose de simplement obsolète ou à préparer — c'est le rôle de l'orange.

### 3.4 Couleurs des badges officiel / personnalisé

Ce couple est le signal visuel structurant de tout le module. Il ne doit jamais être confondu avec les couleurs fonctionnelles.

| Badge | Mode clair — fond / texte | Mode sombre — fond / texte |
|---|---|---|
| Officiel | `#EEF2FF` / `#4338CA` | `#312E81` / `#C7D2FE` |
| Personnalisé | `#F5F3FF` / `#6D28D9` | `#4C1D95` / `#DDD6FE` |

Les deux teintes sont proches mais distinguables — c'est intentionnel : un coefficient personnalisé n'est pas une anomalie, c'est un choix légitime, il ne doit donc pas être signalé par une couleur d'alerte (jaune, orange, rouge).

### 3.5 Règle de contraste

Aucun texte ne doit apparaître sur un fond avec un ratio de contraste inférieur à 4.5:1 pour le corps de texte (WCAG AA), et 3:1 minimum pour les grands titres. Toutes les combinaisons listées dans cette charte respectent cette exigence — ne jamais improviser une nouvelle combinaison sans la vérifier.

---

## 4. Typographie

### 4.1 Police unique — Inter

Toute l'interface utilise **Inter** comme police unique. Aucune seconde famille typographique n'est autorisée, aucune police serif décorative, aucune écriture manuscrite.

Inter est chargée depuis Google Fonts avec ce lien :

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Trois graisses sont utilisées : **Regular (400)**, **Medium (500)**, et **Semibold (600)**. Ni light, ni bold — la charte tient sur trois graisses pour rester cohérente.

### 4.2 Échelle typographique

Chaque taille a un usage unique et invariant. Ne jamais inventer une taille intermédiaire.

| Nom | Taille | Graisse | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|
| Titre 1 | 32px | 500 | 1.2 | -2% | Titre principal d'écran, page d'accueil |
| Titre 2 | 24px | 500 | 1.25 | -1% | Titres de section importants |
| Titre 3 | 20px | 500 | 1.3 | -1% | Sous-titres, en-têtes de bloc |
| Titre 4 | 17px | 500 | 1.4 | 0 | Titres de cartes, libellés forts |
| Corps | 15px | 400 | 1.6 | 0 | Texte courant, paragraphes explicatifs |
| Corps fort | 15px | 500 | 1.6 | 0 | Libellés de champ, données importantes en ligne |
| Secondaire | 13px | 400 | 1.5 | 0 | Métadonnées, sous-titres, indications |
| Petit | 12px | 500 | 1.4 | 0 | Badges, pills, étiquettes |
| Micro | 11px | 400 | 1.3 | 0 | Références techniques, mentions légales |

La taille minimale absolue est **11px**. Aucun texte ne descend en dessous, jamais.

### 4.3 Couleur du texte

Le texte prend deux couleurs standard selon son rôle :

- **Texte primaire** (`#1C1917` en clair, `#FAFAF9` en sombre) : titres, corps de texte, données principales
- **Texte secondaire** (`#78716C` en clair, `#A8A29E` en sombre) : métadonnées, sous-titres, contexte

Aucun texte ne doit être plus clair que le texte secondaire (pas de gris ultra-clair, pas de texte à faible opacité qui devient illisible).

### 4.4 Règles d'usage

**Casse.** Aucun texte n'est jamais en capitales, sauf les acronymes officiels (BEPC, GCE, MINESEC). Les titres, boutons, étiquettes suivent la casse de phrase — première lettre en majuscule, le reste en minuscules.

**Ponctuation.** Les libellés courts (titres, boutons, étiquettes de champs) n'ont pas de ponctuation finale. Les phrases complètes (descriptions, messages d'aide, messages d'erreur) ont une ponctuation normale.

**Alignement.** Le texte est toujours aligné à gauche, jamais justifié (le justifié crée des espaces irréguliers et pénalise la lecture). Seuls les nombres dans les colonnes de tableau peuvent être alignés à droite.

**Contractions.** L'interface utilise un ton naturel et conversationnel : "Vous n'avez pas encore..." plutôt que "L'utilisateur n'a pas encore...".

---

## 5. Grille et espacements

### 5.1 Unité de base

L'interface est construite sur une **unité de base de 4 pixels**. Tous les espacements, tailles et rayons sont des multiples de 4. C'est ce qui garantit l'alignement visuel de tous les éléments.

### 5.2 Échelle d'espacement

| Nom | Valeur | Usage |
|---|---|---|
| xs | 4px | Espace entre une icône et son texte, séparation minimale |
| sm | 8px | Espace entre éléments proches et liés (label + input) |
| md | 12px | Espace entre éléments d'une même carte |
| lg | 16px | Espace entre cartes, entre paragraphes |
| xl | 24px | Espace entre sections d'un même écran |
| 2xl | 32px | Espace entre grandes zones fonctionnelles |
| 3xl | 48px | Marge externe d'un écran, en-tête |
| 4xl | 64px | Espaces respiratoires larges, pages d'accueil |

### 5.3 Grille de layout

L'interface s'appuie sur une grille de 12 colonnes avec une gouttière de 24px. La largeur maximale d'une zone de contenu est de 1280px, centrée horizontalement à partir de la largeur d'écran 1440px.

**Points de rupture responsive :**

| Nom | Largeur d'écran | Comportement |
|---|---|---|
| Mobile | < 640px | Une seule colonne, sidebar en menu déroulant |
| Tablette | 640–1024px | Grille adaptée, sidebar compacte |
| Desktop | 1024–1440px | Grille pleine, sidebar déployée |
| Large | ≥ 1440px | Contenu centré à 1280px maximum |

### 5.4 Padding intérieur des composants

| Composant | Padding vertical | Padding horizontal |
|---|---|---|
| Bouton standard | 9px | 16px |
| Bouton compact | 6px | 12px |
| Bouton large | 12px | 20px |
| Carte | 16px | 20px |
| Champ de saisie | 8px | 12px |
| Badge / pill | 3px | 10px |
| Bandeau d'alerte | 12px | 14px |
| Cellule de tableau | 10px | 12px |

---

## 6. Bordures, coins et élévation

### 6.1 Épaisseur de bordure

Toutes les bordures dans l'interface font **0.5px** par défaut. C'est délibérément fin — ça donne la sensation moderne et légère demandée, en contraste avec les 1px ou 2px qui alourdissent visuellement.

Deux exceptions :
- **1px** pour les tableaux denses où la structure doit être clairement lisible
- **2px** uniquement pour marquer un élément recommandé ou mis en avant (carte "à préparer en priorité", option recommandée)

### 6.2 Couleur des bordures

Trois niveaux, à utiliser selon le rôle :

- **Bordure standard** — hairline discrète des cartes et séparateurs (`#E7E5E4` clair, `#44403C` sombre)
- **Bordure forte** — au survol, séparateur marqué, focus visuel (`#D6D3D1` clair, `#57534E` sombre)
- **Bordure fonctionnelle** — teinte de la couleur fonctionnelle correspondante (bandeau d'avertissement, message d'erreur)

### 6.3 Rayon des coins

Trois valeurs, jamais d'autre :

| Nom | Valeur | Usage |
|---|---|---|
| Petit | 6px | Boutons, champs de saisie, petits éléments interactifs |
| Moyen | 8px | Bandeaux d'alerte, éléments moyens |
| Grand | 12px | Cartes, dialogues, panneaux |
| Pilule | 999px | Badges, pills, tags |

Règle absolue : **jamais de coins arrondis sur une bordure d'un seul côté**. Si une carte a un accent de couleur sur son bord gauche (`border-left`), les autres coins doivent être également non-arrondis (`border-radius: 0`). Sinon, l'effet visuel est cassé.

### 6.4 Élévation

Daeko utilise une élévation **plate** — pas d'ombres portées coûteuses en performance, pas de dégradés. La hiérarchie visuelle repose sur trois techniques uniquement :

1. **Différence de fond** : une carte blanche (`#FFFFFF`) sur un fond légèrement gris (`#FAFAF9`) remonte visuellement sans ombre
2. **Bordure hairline** : le contour 0.5px donne assez de définition pour distinguer une carte de son fond
3. **Espacement** : plus un élément a d'espace autour de lui, plus il paraît important

Une seule exception : les popovers et menus déroulants portent une ombre légère pour signaler qu'ils flottent au-dessus du reste.

**Ombre unique autorisée (popovers uniquement) :**
- Mode clair : `box-shadow: 0 4px 12px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(28, 25, 23, 0.04)`
- Mode sombre : `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)`

---

## 7. Iconographie

### 7.1 Bibliothèque unique — Tabler Icons

Toutes les icônes de l'interface proviennent de **Tabler Icons**, dans leur variante **outline** (jamais filled). Cette bibliothèque est libre, cohérente, et couvre plus de 5000 icônes — largement suffisant pour ne jamais avoir besoin d'en importer d'ailleurs.

Aucune autre bibliothèque d'icônes n'est utilisée. Aucune icône n'est dessinée à la main, sauf pour le monogramme du logo.

### 7.2 Tailles standard

| Contexte | Taille |
|---|---|
| Icône dans un bouton | 16px |
| Icône dans un titre de section | 20px |
| Icône décorative dans une carte | 24px |
| Icône dans un état vide (empty state) | 40px |

Ne jamais utiliser d'icône plus grande que 40px dans l'interface — au-delà, c'est de l'illustration, pas de l'iconographie.

### 7.3 Couleur

Les icônes prennent la couleur du texte adjacent — elles ne sont jamais colorées indépendamment. Exceptions :
- Icône dans un bandeau fonctionnel : couleur de l'état (vert, orange, rouge)
- Icône d'action primaire dans un bouton : blanc (mode clair) ou indigo profond (mode sombre)

### 7.4 Emoji

**Aucun emoji dans l'interface.** L'ensemble des signaux visuels passe par les icônes Tabler ou par la couleur — les emojis produisent un rendu incohérent selon les systèmes et cassent la sensation professionnelle.

---

## 8. Composants d'interface

### 8.1 Boutons

Trois variantes seulement.

**Bouton primaire.** Utilisé pour l'action principale d'un écran ou d'un formulaire. Une seule occurrence par vue, jamais deux boutons primaires côte à côte.
- Fond : Indigo Daeko (`#4F46E5` clair, `#818CF8` sombre)
- Texte : blanc (clair), Indigo profond `#1E1B4B` (sombre)
- Bordure : aucune
- Rayon : 8px
- Padding : 9px 16px
- Graisse texte : Medium (500)

**Bouton secondaire.** Utilisé pour les actions courantes non-primaires. Peut apparaître plusieurs fois sur un même écran.
- Fond : blanc (clair), transparent (sombre)
- Texte : Texte fort
- Bordure : 0.5px Bordure forte
- Rayon : 8px
- Padding : 9px 16px

**Bouton ghost.** Utilisé pour les actions tertiaires ou destructives dans un contexte secondaire.
- Fond : transparent
- Texte : Texte doux
- Bordure : aucune
- Rayon : 8px
- Padding : 9px 12px

**États de tous les boutons :**
- Hover : opacité 90% du fond ou fond légèrement plus foncé
- Active (cliqué) : transformation `scale(0.98)` pendant 100ms
- Focus : focus ring 2px Indigo Daeko à 4px de distance du bord
- Disabled : opacité 50%, curseur `not-allowed`

### 8.2 Champs de saisie

**Champ texte standard :**
- Hauteur : 36px
- Fond : blanc (clair), Surface carte (sombre)
- Bordure : 0.5px Bordure standard
- Rayon : 6px
- Padding : 8px 12px
- Taille de texte : 15px
- Focus : bordure passe en Indigo Daeko + focus ring 2px Indigo léger

**Label de champ :** placé au-dessus du champ, 13px Medium, texte primaire, marge inférieure de 6px.

**Texte d'aide :** placé sous le champ, 12px Regular, texte secondaire, marge supérieure de 4px.

**Message d'erreur :** remplace le texte d'aide en cas d'erreur, 12px Regular, couleur rouge (`#DC2626` clair, `#F87171` sombre), icône Tabler `ti-alert-circle` à 14px à gauche.

### 8.3 Cartes

Bloc structurant de l'interface. Toute information contextuelle (une branche, une classe, une matière détaillée) vit dans une carte.

- Fond : Surface carte
- Bordure : 0.5px Bordure standard
- Rayon : 12px
- Padding : 16px 20px
- Hover (si cliquable) : bordure passe en Bordure forte, curseur pointer

**Structure interne d'une carte :**
- En-tête : titre 15px Medium à gauche, badge d'état à droite
- Corps : contenu principal
- Séparateur interne (si nécessaire) : 0.5px Bordure standard, marges verticales de 12px
- Pied : méta-informations en 13px Regular, texte secondaire

### 8.4 Badges

Petits éléments visuels indiquant un état ou une catégorie.

- Hauteur : 20px
- Padding : 3px 10px
- Rayon : 999px (pilule complète)
- Taille de texte : 12px Medium
- Fond : selon la sémantique (voir couleurs fonctionnelles ou badges officiel/personnalisé)

Ne jamais mettre d'icône dans un badge sauf si sa signification est cruciale — les badges doivent rester compacts et lisibles à froid.

### 8.5 Bandeaux d'alerte

Trois variantes selon la gravité.

**Bandeau informatif** (bleu-indigo léger) :
- Fond : Indigo léger
- Bordure : 0.5px Indigo `#C7D2FE`
- Icône : `ti-info-circle` en Indigo Daeko
- Texte : Indigo profond

**Bandeau d'attention** (orange) :
- Fond : orange léger (`#FEF3C7` clair, `#78350F` sombre)
- Bordure : 0.5px orange plus foncé
- Icône : `ti-alert-triangle`
- Texte : selon la palette orange

**Bandeau de blocage** (rouge) — utilisé exclusivement pour des erreurs bloquantes :
- Fond : rouge léger
- Bordure : 0.5px rouge
- Icône : `ti-alert-circle`
- Texte : selon la palette rouge

Tous les bandeaux ont un padding de 12px 14px, un rayon de 8px, une icône à gauche (18px) alignée sur la première ligne de texte.

### 8.6 Tableaux

Pour les vues denses (matrice des coefficients, liste de classes).

- Bordure externe : 0.5px Bordure standard, rayon 8px
- Séparateur de lignes : 0.5px Bordure standard
- Ligne d'en-tête : fond légèrement teinté (`#F5F5F4` clair, `#1F1D19` sombre), texte 13px Medium
- Cellules : padding 10px 12px, texte 14px Regular
- Ligne survolée : fond `#FAFAF9` (clair) ou `#1F1D19` (sombre)

Les tableaux denses (matrice complète) peuvent réduire le padding vertical à 6px pour maximiser la densité, mais jamais en dessous.

### 8.7 Navigation latérale (sidebar)

- Largeur : 240px déployée, 64px repliée
- Fond : Fond page (pas Surface carte — c'est délibéré pour qu'elle se fonde)
- Séparateur avec le contenu : 0.5px Bordure standard vertical
- Item de menu : 36px de hauteur, padding horizontal 12px, rayon 6px
- Item actif : fond Indigo léger, texte Indigo profond
- Item au survol : fond très légèrement teinté

### 8.8 Dialogue modal

- Largeur : 480px pour les confirmations, 640px pour les formulaires
- Fond : Surface carte
- Rayon : 12px
- Padding : 24px
- Overlay derrière : noir à 45% d'opacité
- Titre : 20px Medium en haut
- Corps : 15px Regular
- Boutons d'action : en bas à droite, avec l'action primaire à droite

---

## 9. États et interactions

### 9.1 Focus visible

Tout élément interactif doit avoir un focus ring visible au clavier — c'est une exigence d'accessibilité, pas un choix esthétique.

- Focus ring standard : 2px Indigo Daeko, offset 4px du bord de l'élément
- Focus ring sur fond coloré : 2px blanc à 90% d'opacité + 2px Indigo Daeko

### 9.2 Transitions

Toutes les transitions durent **150ms** avec un timing `ease-out`. Aucune transition ne dure plus de 200ms — au-delà, l'interface commence à sembler lente.

Trois propriétés seulement peuvent être animées : `background`, `border-color`, `transform` (pour le `scale(0.98)` au clic). Ne jamais animer `width`, `height`, `top`, ou des propriétés coûteuses en rendu.

### 9.3 États de chargement

**Chargement d'une carte ou d'un bloc** : squelette gris (`#F5F5F4` clair, `#292524` sombre) aux formes des éléments à charger, avec une animation subtile de "shimmer" (dégradé qui se déplace horizontalement).

**Chargement d'un bouton** : le texte est remplacé par une icône spinner Tabler `ti-loader-2` en rotation, le bouton reste à sa taille et à sa couleur.

**Chargement global d'un écran** : barre de progression fine en haut de l'écran (2px de hauteur, Indigo Daeko, animation indéterminée).

### 9.4 États vides

Un écran ou une section vide n'affiche jamais "aucune donnée" ou "vide". Il propose une invitation à l'action :
- Icône Tabler à 40px, en texte doux
- Titre 17px Medium invitant à commencer
- Description 15px Regular en une phrase courte
- Bouton primaire de l'action à effectuer

### 9.5 Messages de succès et d'erreur

**Toast de succès** (temporaire, en bas de l'écran) :
- Fond vert léger, texte vert foncé, icône `ti-check`
- Apparaît pendant 3 secondes puis disparaît
- Position : coin bas droit, marge de 24px du bord

**Toast d'erreur** :
- Fond rouge léger, texte rouge foncé, icône `ti-alert-circle`
- Ne disparaît pas automatiquement — l'utilisateur doit le fermer
- Message actionnable : dire ce qui s'est passé et ce que l'utilisateur peut faire

---

## 10. Motifs de contenu

### 10.1 Ton de voix

Daeko s'adresse à ses utilisateurs comme un collègue compétent et disponible — jamais comme un manuel, jamais comme un assistant obséquieux.

- **Direct** : "Créer une branche" plutôt que "Veuillez cliquer ici pour créer une branche"
- **Bienveillant sans être infantilisant** : "Cette action est irréversible" plutôt que "Attention ! Vous êtes sûr ?"
- **Neutre culturellement** : pas d'expressions purement françaises de France (pas de "Nickel !", pas de "Top !"), pas d'anglicismes évitables

### 10.2 Formulations types

**Boutons d'action :** verbe à l'infinitif, jamais de "OK" ou "Valider" seul :
- ✓ "Créer la branche"
- ✓ "Enregistrer les modifications"
- ✗ "OK", "Valider", "Soumettre"

**Messages d'erreur :** décrire ce qui s'est passé et ce que l'utilisateur peut faire :
- ✓ "Ce nom est déjà utilisé. Essayez un autre libellé."
- ✗ "Erreur : nom en doublon."

**Confirmations irréversibles :** énoncer clairement la conséquence :
- ✓ "Une fois l'année clôturée, plus aucune modification ne sera possible. Tapez le libellé de l'année pour confirmer."
- ✗ "Êtes-vous sûr de vouloir continuer ?"

### 10.3 Nombres et dates

**Nombres :** les milliers sont séparés par une espace insécable (`1 234` et non `1,234` ou `1234`). Les décimales utilisent la virgule française (`12,50`).

**Dates :** format standard `JJ/MM/AAAA` en interface courte, format long en toutes lettres pour les documents officiels (`21 juillet 2026`).

**Années académiques :** toujours au format `AAAA-AAAA` (`2025-2026`), jamais `25-26` ou `2025/26`.

### 10.4 Bilinguisme

Toutes les chaînes de texte sont écrites en français et en anglais, choisies dynamiquement selon la préférence de l'utilisateur. Aucun texte n'est codé en dur dans l'interface — tout passe par le système de localisation.

Les libellés du catalogue (matières, séries, niveaux) s'affichent dans la langue du sous-système concerné : une matière du sous-système anglophone reste en anglais même si l'utilisateur a choisi le français comme langue d'interface.

---

## 11. Mode sombre

### 11.1 Principe général

Le mode sombre n'est pas une simple inversion des couleurs. Chaque décision est repensée :
- Le fond n'est jamais noir pur, mais un gris chaud très sombre (`#1C1917`)
- Les couleurs saturées sont désaturées et éclaircies pour ne pas "vibrer" sur fond sombre
- Les cartes s'enfoncent visuellement au lieu de remonter — la hiérarchie de profondeur est inversée

### 11.2 Déclenchement

Le mode sombre suit trois règles de priorité, dans cet ordre :
1. Préférence explicite de l'utilisateur si elle existe (sauvegardée)
2. À défaut, préférence système du navigateur/appareil (`prefers-color-scheme: dark`)
3. À défaut, mode clair par défaut

Un basculement manuel est toujours disponible dans les préférences utilisateur, avec un raccourci clavier `Ctrl/Cmd + Shift + L`.

### 11.3 Éléments à ajuster

Les éléments suivants ont un comportement différent en mode sombre :

- **Le monogramme du logo** : la lettre `D` intérieure passe du blanc au gris sombre du fond (`#1C1917`), pour éviter un halo lumineux gênant
- **Les boutons primaires** : le texte devient Indigo profond (`#1E1B4B`) sur fond Indigo éclairci — un texte blanc laverait le bouton
- **Les cartes** : elles s'enfoncent avec une teinte légèrement plus sombre que la surface (`#1F1D19` au lieu de `#292524`)
- **Les focus rings** : deviennent Indigo éclairci pour rester visibles

### 11.4 Éléments qui ne changent pas

- La typographie (police, tailles, graisses) reste identique
- Les rayons de coins et les épaisseurs de bordure restent identiques
- Les espacements et les grilles restent identiques
- Les icônes prennent la nouvelle couleur du texte adjacent, mais leur forme et taille ne changent pas

---

## 12. Application aux écrans clés

### 12.1 Tableau de bord

**État "année stable" (la majorité de l'année) :**
- Fond de page Fond page
- Titre 24px Medium en haut à gauche : "Ma structure"
- Sous-titre 13px texte secondaire : "Année 2025-2026 · en cours"
- Grille de cartes de branches (une par branche), gap 12px
- Chaque carte : titre de branche 15px Medium, badge "En cours" en vert, ligne de résumé 13px texte secondaire
- Aucun bouton primaire visible — l'écran est calme

**État "fenêtre de rentrée" :**
- Même structure, plus un bandeau accent tout en haut
- Bandeau : fond Indigo léger, icône `ti-refresh` Indigo Daeko, texte "Préparer la rentrée à partir de 2025-2026"
- À droite du bandeau : lien "Commencer" en Indigo Daeko avec flèche `ti-arrow-right`
- Les cartes montrent maintenant une barre de progression fine en bas

### 12.2 Assistant de configuration

- Étapes horizontales en haut, avec segments de progression (4px de hauteur) : verts pour les étapes validées, Indigo Daeko pour l'étape en cours, gris pour les étapes à venir
- Titre 20px Medium indiquant l'étape courante
- Sous-titre 13px texte secondaire indiquant "Étape 4 sur 5 · Matières · Terminale D"
- Contenu principal dans une carte pleine largeur
- Boutons en bas : "Retour" en ghost à gauche, "Continuer" en primaire à droite

### 12.3 Matrice des coefficients

- Tableau dense avec bordure 1px (exception à la règle 0.5px pour lisibilité)
- Ligne d'en-tête sticky au scroll
- Cellules avec coefficient + petit badge officiel/personnalisé
- Bouton de bascule d'affichage en haut à droite : "Par coefficient / Par groupe"
- Bouton "Imprimer" secondaire

### 12.4 Écran de clôture d'année

- Fond de page sobre, aucune décoration
- Titre 24px Medium centré : "Clôturer l'année 2025-2026"
- Description 15px sur plusieurs lignes expliquant les conséquences
- Liste à puces des conséquences irréversibles avec icônes `ti-lock` en texte secondaire
- Champ de saisie du libellé de confirmation, précédé de son label "Tapez 2025-2026 pour confirmer"
- Deux boutons en bas : "Annuler" en secondaire, "Clôturer définitivement" en rouge (exception : bouton primaire en couleur fonctionnelle rouge, réservé aux actions irréversibles)

---

## 13. Accessibilité et bonnes pratiques

### 13.1 Contraste

Tout couple couleur de texte / couleur de fond doit atteindre au minimum :
- **WCAG AA** : ratio de 4.5:1 pour le corps de texte, 3:1 pour les grands titres
- **WCAG AAA** (recommandé pour Daeko) : ratio de 7:1 pour le corps de texte

Les combinaisons listées dans cette charte respectent WCAG AA. Certaines atteignent AAA — c'est un objectif à viser sans l'imposer.

### 13.2 Navigation clavier

Toute l'interface doit être utilisable au clavier seul :
- Tab / Shift+Tab pour la navigation entre éléments interactifs
- Entrée pour activer un bouton ou un lien
- Espace pour cocher une case ou activer un bouton
- Échap pour fermer un modal ou un menu déroulant
- Flèches pour naviguer dans un menu ou une liste

Chaque élément interactif au focus doit afficher un focus ring visible (voir 9.1).

### 13.3 Lecteurs d'écran

- Chaque icône décorative porte l'attribut `aria-hidden="true"`
- Chaque icône seule (bouton icône) porte un `aria-label` explicite
- Les images informatives portent un `alt` descriptif ; les décoratives portent un `alt=""`
- Les changements d'état importants sont annoncés via `aria-live` (succès de sauvegarde, apparition d'un toast)

### 13.4 Réduction de mouvement

Si l'utilisateur a activé `prefers-reduced-motion` dans son système, toutes les animations non-essentielles sont désactivées. La transition de couleur des boutons reste, mais l'animation `scale(0.98)` du clic disparaît, les animations de shimmer des squelettes de chargement se figent.

### 13.5 Tailles cibles tactiles

Sur les interfaces tactiles (tablette, mobile), toute cible cliquable doit avoir une surface minimale de **44 × 44 pixels**, même si l'élément visuel apparaît plus petit. Cela s'applique aux boutons, icônes cliquables, cases à cocher.

---

## 14. Ressources et livrables

### 14.1 Fichiers à produire

- **daeko-tokens.css** : fichier CSS contenant toutes les variables (couleurs, tailles, espacements)
- **daeko-tokens.json** : équivalent JSON pour usage en dehors du web (documents, ERP tiers)
- **Logo SVG** : monogramme + mot-symbole, en versions couleur, blanc, noir, monochrome
- **Favicon** : versions 16, 32, 64, 180 pixels + version SVG animée pour navigateurs modernes
- **Bibliothèque de composants** : Figma ou équivalent, contenant tous les composants de la section 8

### 14.2 Variables CSS de référence

```css
:root {
  /* Couleurs — Indigo */
  --color-indigo: #4F46E5;
  --color-indigo-light: #EEF2FF;
  --color-indigo-deep: #1E1B4B;

  /* Couleurs — Neutres clair */
  --color-bg-page: #FAFAF9;
  --color-bg-card: #FFFFFF;
  --color-border: #E7E5E4;
  --color-border-strong: #D6D3D1;
  --color-text-soft: #78716C;
  --color-text-strong: #1C1917;

  /* Couleurs fonctionnelles clair */
  --color-success-bg: #D1FAE5;
  --color-success-text: #065F46;
  --color-success-solid: #059669;
  --color-warning-bg: #FEF3C7;
  --color-warning-text: #92400E;
  --color-warning-solid: #D97706;
  --color-danger-bg: #FEE2E2;
  --color-danger-text: #991B1B;
  --color-danger-solid: #DC2626;

  /* Badges officiel/personnalisé clair */
  --color-official-bg: #EEF2FF;
  --color-official-text: #4338CA;
  --color-custom-bg: #F5F3FF;
  --color-custom-text: #6D28D9;

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
  --border-width-strong: 1px;
  --border-width-accent: 2px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
}

[data-mode="dark"] {
  --color-indigo: #818CF8;
  --color-indigo-light: #312E81;
  --color-indigo-deep: #C7D2FE;

  --color-bg-page: #1C1917;
  --color-bg-card: #292524;
  --color-border: #44403C;
  --color-border-strong: #57534E;
  --color-text-soft: #A8A29E;
  --color-text-strong: #FAFAF9;

  --color-success-bg: #064E3B;
  --color-success-text: #A7F3D0;
  --color-success-solid: #34D399;
  --color-warning-bg: #78350F;
  --color-warning-text: #FDE68A;
  --color-warning-solid: #FBBF24;
  --color-danger-bg: #7F1D1D;
  --color-danger-text: #FECACA;
  --color-danger-solid: #F87171;

  --color-official-bg: #312E81;
  --color-official-text: #C7D2FE;
  --color-custom-bg: #4C1D95;
  --color-custom-text: #DDD6FE;
}
```

### 14.3 Gouvernance de la charte

Cette charte est un document vivant qui évoluera avec le produit. Toute modification doit :
- Être justifiée par un besoin utilisateur réel, pas par une préférence esthétique
- Être documentée dans un journal de version en tête de ce document
- Respecter les trois principes fondateurs (lisibilité, modernité sans effet gratuit, neutralité culturelle)
- Être validée collégialement avant d'être appliquée

Toute équipe intervenant sur l'interface (design, développement, contenu) doit se référer à cette charte comme source unique de vérité. En cas de conflit entre cette charte et une décision technique locale, cette charte prévaut, sauf décision explicite de l'équipe produit.

---

*Document de référence — équipe produit Daeko*
*Version 1.0 · Référence DAEKO-CG-1.0*

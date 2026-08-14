# Charte Daeko — Note de changement 1.1

**Objet :** neutralisation des tons chauds dans la palette des neutres
**Portée :** section 3 (Neutres — modes clair et sombre) uniquement
**Impact sur le reste de la charte :** aucun. Typographie, espacements, bordures, rayons, composants et couleurs fonctionnelles restent inchangés.
**Référence de la charte modifiée :** DAEKO-CG-1.0 → DAEKO-CG-1.1

---

## Motif du changement

La palette 1.0 s'appuyait sur des neutres chauds (base `stone`) tirant légèrement vers le beige, dans l'intention de casser la sensation clinique d'un gris technique pur. À l'usage, la dominante chaude ressort trop et donne une impression de fond jauni plutôt qu'une chaleur discrète.

La 1.1 bascule sur des neutres purs (base `zinc`), sans dominante colorée — dans la lignée de références comme Stripe ou Notion. Le blanc redevient réellement blanc, les gris deviennent des gris.

---

## Ce qui change — mode clair

| Rôle | Valeur 1.0 (à retirer) | Valeur 1.1 (à appliquer) |
|---|---|---|
| Fond page | `#FAFAF9` | `#FFFFFF` |
| Surface carte | `#FFFFFF` | `#FFFFFF` *(inchangé)* |
| Surface subtile *(nouveau rôle)* | — | `#FAFAFA` |
| Bordure | `#E7E5E4` | `#E4E4E7` |
| Bordure forte | `#D6D3D1` | `#D4D4D8` |
| Texte doux | `#78716C` | `#71717A` |
| Texte fort | `#1C1917` | `#09090B` |

**Note sur la surface subtile.** Le fond de page passant au blanc pur, les cartes ne se distinguent plus par différence de fond. Un nouveau rôle `Surface subtile` (`#FAFAFA`) est introduit pour les zones où il faut délimiter sans utiliser une bordure : fond des en-têtes de tableau, ligne de tableau survolée, fond de sidebar, cellule au survol. Ce n'est jamais le fond principal.

---

## Ce qui change — mode sombre

| Rôle | Valeur 1.0 (à retirer) | Valeur 1.1 (à appliquer) |
|---|---|---|
| Fond page | `#1C1917` | `#09090B` |
| Surface carte | `#292524` | `#18181B` |
| Surface élevée | `#1F1D19` | `#27272A` |
| Bordure | `#44403C` | `#3F3F46` |
| Bordure forte | `#57534E` | `#52525B` |
| Texte doux | `#A8A29E` | `#A1A1AA` |
| Texte fort | `#FAFAF9` | `#FAFAFA` |

---

## Ce qui ne change pas

- Les trois teintes d'Indigo (`#4F46E5`, `#EEF2FF`, `#1E1B4B` en clair ; `#818CF8`, `#312E81`, `#C7D2FE` en sombre)
- Toutes les couleurs fonctionnelles (vert, orange, rouge)
- Les badges officiel / personnalisé
- La typographie (Inter, échelle, graisses)
- La grille et les espacements
- Les bordures, coins et élévation
- L'iconographie et tous les composants d'interface
- Les règles d'accessibilité et le ton de voix

---

## Variables CSS à mettre à jour

Remplacer, dans le fichier `daeko-tokens.css`, les blocs suivants :

**Bloc mode clair :**

```css
:root {
  --color-bg-page: #FFFFFF;
  --color-bg-card: #FFFFFF;
  --color-bg-subtle: #FAFAFA;
  --color-border: #E4E4E7;
  --color-border-strong: #D4D4D8;
  --color-text-soft: #71717A;
  --color-text-strong: #09090B;
}
```

**Bloc mode sombre :**

```css
[data-mode="dark"] {
  --color-bg-page: #09090B;
  --color-bg-card: #18181B;
  --color-bg-elevated: #27272A;
  --color-border: #3F3F46;
  --color-border-strong: #52525B;
  --color-text-soft: #A1A1AA;
  --color-text-strong: #FAFAFA;
}
```

Noter les deux nouvelles variables : `--color-bg-subtle` en mode clair et `--color-bg-elevated` en mode sombre, qui portent le nouveau rôle de délimitation subtile.

---

## Points d'attention pour l'implémentation

**Le fond page passant au blanc pur en mode clair**, les cartes qui reposaient sur leur différence de fond avec le canevas perdent cette différence. Elles doivent donc systématiquement porter leur bordure hairline `0.5px --color-border` pour rester distinctes — c'était déjà la règle, mais elle devient stricte : plus jamais de carte sans bordure sur fond blanc.

**Les tableaux et sidebars** doivent maintenant utiliser `--color-bg-subtle` (mode clair) au lieu de reposer sur une teinte différente du fond. C'est un remplacement direct partout où l'ancien `#F5F5F4` (mentionné en section 8.6 pour les en-têtes de tableau) était utilisé — il devient `#FAFAFA`.

**En mode sombre**, la hiérarchie des surfaces reste identique dans son principe (carte plus sombre que la surface élevée) mais avec des valeurs plus tranchées. Le contraste global augmente légèrement, ce qui améliore la lisibilité sur écran de qualité moyenne.

---

## Historique de version

- **1.0** — Charte initiale, palette de neutres chauds (base `stone`)
- **1.1** — Bascule vers des neutres purs (base `zinc`), introduction de `--color-bg-subtle` et `--color-bg-elevated`

*Note de changement — équipe produit Daeko*

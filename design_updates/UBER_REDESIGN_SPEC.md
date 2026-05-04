# 🎨 Refonte Design Complète — PrivéChauffeur → Identité Uber

> **À destination de l'agent de développement (Antigravity)**
> Repo cible : `magentyagency-ops/chauffeur` (Next.js 16 + Tailwind CSS v4 + Supabase)
>
> Objectif : remplacer entièrement le design actuel (warm whites, arrondis 10-14px, inspiration Linear/Vercel) par une **identité visuelle 100% alignée sur Uber** (noir/blanc dominants, coins quasi droits, typographie massive, vert signature).

---

## 1. PHILOSOPHIE DE DESIGN UBER

| Principe | Application |
|---|---|
| **Confiance par la sobriété** | Noir et blanc dominants, accents minimaux |
| **Hiérarchie typographique massive** | Titres très gros, très tight (letter-spacing négatif) |
| **Géométrie nette** | Coins droits ou très peu arrondis (0–4px) |
| **Action claire** | CTA principaux : noir plein, blanc dessus, rectangulaires |
| **Espace généreux** | Padding/margin sur grille 8px, beaucoup de whitespace |
| **Vert signature** | Utilisé uniquement pour confirmation/CTA secondaire (jamais décoratif) |

**À supprimer absolument :**
- Tous les fonds beiges/warm (`#fafaf8`, `#f3f2ee`)
- Tous les `border-radius` ≥ 8px
- L'accent bleu `#276EF1`
- Les effets `translateY(-1px)` au hover
- Les bordures grises chaudes (`#e8e6e1`)

---

## 2. DESIGN TOKENS (à appliquer dans `src/app/globals.css`)

### 2.1 Palette de couleurs

```css
:root {
  /* === Palette Uber === */

  /* Neutres : noir/blanc purs */
  --background: #FFFFFF;          /* fond principal — blanc pur */
  --foreground: #000000;          /* texte principal — noir pur */
  --surface: #FFFFFF;             /* cartes, modals */
  --surface-alt: #F6F6F6;         /* zones secondaires (gris très clair) */
  --surface-dark: #000000;        /* sections inversées (hero, footer) */
  --surface-dark-alt: #1A1A1A;    /* dark mode cards */

  /* Bordures */
  --border: #EEEEEE;              /* bordure standard */
  --border-strong: #CBCBCB;       /* bordure marquée */
  --border-dark: #2E2E2E;         /* bordure sur fond noir */

  /* Texte */
  --text-primary: #000000;
  --text-secondary: #545454;      /* gris Uber pour texte secondaire */
  --text-tertiary: #757575;
  --text-on-dark: #FFFFFF;
  --text-on-dark-secondary: #AFAFAF;

  /* Couleurs sémantiques */
  --brand-green: #06C167;         /* Uber Green — succès, points forts */
  --brand-green-hover: #05A359;
  --error: #E11900;               /* rouge Uber */
  --warning: #FFC043;             /* jaune Uber */
  --info: #276EF1;                /* bleu utilisé uniquement pour liens */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-alt: var(--surface-alt);
  --color-surface-dark: var(--surface-dark);
  --color-surface-dark-alt: var(--surface-dark-alt);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-border-dark: var(--border-dark);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-tertiary: var(--text-tertiary);
  --color-text-on-dark: var(--text-on-dark);
  --color-text-on-dark-secondary: var(--text-on-dark-secondary);
  --color-brand-green: var(--brand-green);
  --color-error: var(--error);
  --color-warning: var(--warning);
  --color-info: var(--info);
  --font-sans: var(--font-inter);
  --font-display: var(--font-inter);
}
```

### 2.2 Typographie

Uber utilise **Uber Move** (propriétaire). Pour un rendu très proche, utiliser **Inter** avec tracking négatif marqué.

**À installer :** Inter est déjà importé dans `layout.tsx`. Garder Inter mais ajouter Inter Tight pour les titres.

```tsx
// src/app/layout.tsx
import { Inter, Inter_Tight } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

// Dans <html className={`${inter.variable} ${interTight.variable}`}>
```

**Échelle typographique Uber :**

| Token | Taille | Line-height | Letter-spacing | Weight | Usage |
|---|---|---|---|---|---|
| `display-xl` | 96px / 6rem | 0.95 | -0.04em | 800 | Hero principal |
| `display-l` | 72px / 4.5rem | 0.95 | -0.04em | 800 | Hero secondaire |
| `display-m` | 56px / 3.5rem | 1.0 | -0.035em | 700 | Section titre |
| `display-s` | 40px / 2.5rem | 1.05 | -0.03em | 700 | Sous-section |
| `heading-l` | 32px / 2rem | 1.1 | -0.025em | 700 | H2 |
| `heading-m` | 24px / 1.5rem | 1.2 | -0.02em | 600 | H3 |
| `heading-s` | 20px / 1.25rem | 1.3 | -0.015em | 600 | H4 |
| `body-l` | 18px / 1.125rem | 1.5 | -0.005em | 400 | Lead paragraph |
| `body-m` | 16px / 1rem | 1.5 | 0 | 400 | Body |
| `body-s` | 14px / 0.875rem | 1.45 | 0 | 400 | Captions |
| `label` | 13px / 0.8125rem | 1.4 | 0.02em | 600 | UI labels |
| `overline` | 12px / 0.75rem | 1.4 | 0.12em UPPERCASE | 700 | Section eyebrow |

### 2.3 Espacement & rayons

```css
/* Border-radius — TRÈS RÉDUITS vs design actuel */
--radius-none: 0px;
--radius-xs: 2px;     /* badges */
--radius-s: 4px;      /* boutons, inputs */
--radius-m: 8px;      /* cards (max) */
--radius-l: 12px;     /* modals seulement */
--radius-pill: 9999px;/* pills/avatars uniquement */

/* Shadows — minimalistes */
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-s:  0 2px 4px rgba(0,0,0,0.06);
--shadow-m:  0 4px 12px rgba(0,0,0,0.08);
--shadow-l:  0 8px 24px rgba(0,0,0,0.10);
--shadow-focus: 0 0 0 2px #000000; /* anneau de focus noir, signature Uber */
```

---

## 3. COMPOSANTS — SPÉCIFICATIONS

### 3.1 Boutons

**Règles globales :**
- `border-radius: 4px` (au lieu de 10px actuel)
- Pas de `transform` au hover (pas de translateY)
- Hover = changement opacité ou couleur de fond directe
- Hauteur fixe : 48px (md), 56px (lg), 40px (sm)
- Padding horizontal généreux (24-32px)
- `font-weight: 500-600`, `letter-spacing: -0.005em`

```css
/* === Bouton primaire — NOIR (action principale) === */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: #000000;
  color: #FFFFFF;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.005em;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-primary:hover { background: #2E2E2E; }
.btn-primary:active { background: #1A1A1A; }
.btn-primary:focus-visible { outline: 2px solid #000; outline-offset: 2px; }

/* === Bouton secondaire — BLANC bordé === */
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background: #FFFFFF;
  color: #000000;
  font-weight: 500;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: background 0.15s ease;
}
.btn-secondary:hover { background: #F6F6F6; }
.btn-secondary:active { background: #EEEEEE; }

/* === Bouton vert (succès / réservation confirmée) === */
.btn-success {
  background: #06C167;
  color: #000000;
  /* mêmes propriétés que btn-primary */
}
.btn-success:hover { background: #05A359; }

/* === Bouton inversé (sur fond noir) === */
.btn-inverse {
  background: #FFFFFF;
  color: #000000;
}
.btn-inverse:hover { background: #EEEEEE; }

/* === Bouton ghost (texte uniquement) === */
.btn-ghost {
  background: transparent;
  color: #000000;
  border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.btn-ghost:hover { color: #545454; }
```

### 3.2 Cartes

```css
.card {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 8px;     /* MAX — au lieu de 14px */
  padding: 24px;
  transition: border-color 0.15s ease;
}
.card:hover { border-color: #000000; }   /* Bordure noire au hover (signature Uber) */

/* Carte sans bordure (sur fond gris) */
.card-flat {
  background: #FFFFFF;
  border-radius: 8px;
  padding: 24px;
}

/* Carte sombre (utilisée dans hero ou sections inversées) */
.card-dark {
  background: #1A1A1A;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  color: #FFFFFF;
  padding: 24px;
}
```

### 3.3 Inputs / Formulaires

```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: #FFFFFF;
  border: 1px solid #CBCBCB;     /* bordure plus marquée */
  border-radius: 4px;             /* au lieu de 10px */
  font-size: 16px;
  color: #000000;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.input::placeholder { color: #757575; opacity: 1; }
.input:hover { border-color: #757575; }
.input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 1px #000000;  /* double border noire = focus Uber */
}
.input.error {
  border-color: #E11900;
  box-shadow: 0 0 0 1px #E11900;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
}

.helper {
  font-size: 13px;
  color: #545454;
  margin-top: 6px;
}
```

### 3.4 Navbar

```css
.navbar {
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
  height: 72px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-link {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.15s ease;
}
.navbar-link:hover { background: #F6F6F6; }

/* Logo wordmark — toujours noir, font-weight 800, letter-spacing -0.04em */
.navbar-logo {
  font-family: var(--font-inter-tight);
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.04em;
  color: #000000;
}
```

### 3.5 Sidebar (dashboard)

```css
.sidebar {
  background: #FFFFFF;
  border-right: 1px solid #EEEEEE;
  width: 260px;
  padding: 24px 16px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 4px;            /* au lieu de 10px */
  font-size: 15px;
  font-weight: 500;
  color: #545454;
  transition: background 0.15s ease, color 0.15s ease;
}
.sidebar-item:hover { background: #F6F6F6; color: #000000; }
.sidebar-item.active {
  background: #000000;            /* fond noir pour actif (signature Uber) */
  color: #FFFFFF;
  font-weight: 600;
}
```

### 3.6 Pills / Badges

```css
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;             /* moins arrondi qu'avant */
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}
.pill-success { background: #06C167; color: #000000; }
.pill-neutral { background: #F6F6F6; color: #000000; border: 1px solid #EEEEEE; }
.pill-dark    { background: #000000; color: #FFFFFF; }
.pill-error   { background: #E11900; color: #FFFFFF; }
```

### 3.7 Section labels (overline)

```css
.section-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #545454;
  display: inline-block;
  margin-bottom: 16px;
}
```

---

## 4. STRUCTURE DES PAGES — CHANGEMENTS PAR COMPOSANT

### 4.1 `Hero.tsx`
- **Fond** : passer en **noir pur** (`#000000`) avec texte blanc — c'est la signature Uber pour les hero (cf. uber.com)
- **Titre principal** : `font-family: Inter Tight`, `font-size: 96px` desktop / `56px` mobile, `font-weight: 800`, `letter-spacing: -0.04em`, `line-height: 0.95`
- **CTA** : 1 bouton blanc principal ("Créer mon espace") + 1 bouton ghost blanc ("Voir une démo →")
- Supprimer les arrondis et les fonds beige
- Ajouter une grille en bas style Uber : 2 cards "Pour les chauffeurs" / "Pour les clients" avec fond `#1A1A1A`

### 4.2 `Features.tsx` / `HowItWorks.tsx`
- Fond blanc pur (pas de `#fafaf8`)
- Cartes avec bordure `#EEEEEE` et `border-radius: 8px` MAX
- Au hover, la bordure passe à `#000000` (et **rien d'autre**)
- Icônes monochromes noires (pas de couleur)
- Titre de section : `display-m` (56px), aligné à gauche

### 4.3 `Pricing.tsx`
- Cards prix : fond blanc, bordure `#EEEEEE`, radius 8px
- **Plan recommandé** : fond noir `#000000` + texte blanc + bouton vert `#06C167`
- Prix en très gros (`64px`, `font-weight: 800`, `letter-spacing: -0.04em`)
- Liste features avec ✓ vert `#06C167` (pas d'autre couleur)

### 4.4 `FAQ.tsx`
- Accordéons sans bordure arrondie (radius 0 ou 4px max)
- Séparateurs simples 1px `#EEEEEE`
- Chevron noir (`+` qui devient `−`)

### 4.5 `Footer.tsx`
- **Fond noir** `#000000`, texte `#AFAFAF` pour les liens secondaires, `#FFFFFF` pour les titres
- Logo en blanc, gros (`32px`, weight 800)
- Liens organisés en 4 colonnes (Produit, Entreprise, Ressources, Légal)
- Mention légale en bas, bordure top `#2E2E2E`

### 4.6 `Navbar.tsx`
- Hauteur 72px, fond blanc, bordure bottom `#EEEEEE`
- Logo à gauche en noir
- Liens centrés ou à droite, font-size 15px, weight 500
- CTA "Connexion" (ghost) + "Démarrer" (btn-primary noir, radius 4px)
- En version dashboard : navbar peut être fond noir avec liens blancs

### 4.7 `dashboard/`
- Sidebar 260px à gauche, items avec **fond noir quand actif** (cf. spec sidebar)
- Header dashboard : titre `heading-l` (32px), pas de gradient
- KPI cards : fond blanc, bordure fine, chiffre principal `display-s` (40px) en `font-weight: 800`
- Tableaux : header `font-size: 12px`, `text-transform: uppercase`, `letter-spacing: 0.08em`, lignes avec hover gris très léger `#FAFAFA`

### 4.8 `chauffeur/[slug]/` (page publique du chauffeur)
- Hero du chauffeur : photo en grand (couvrant 50vh), nom en `display-l` (72px) blanc sur image
- Bloc réservation : carte blanche en superposition (radius 8px), champs date/heure/trajet avec inputs Uber-style
- CTA "Réserver" : `btn-success` (vert Uber)

---

## 5. TAILWIND v4 — UTILITAIRES À UTILISER

Avec `@theme inline` Tailwind v4 expose automatiquement les classes :
- `bg-background`, `bg-foreground`, `bg-surface-alt`, `bg-surface-dark`
- `text-text-primary`, `text-text-secondary`, `text-on-dark`
- `border-border`, `border-border-strong`
- `text-brand-green`, `bg-brand-green`

**Règles d'usage Tailwind :**
- `rounded-none`, `rounded-sm` (2px), `rounded` (4px), `rounded-md` (8px) → **ne jamais dépasser `rounded-md`**
- `font-sans` pour body, `font-display` (Inter Tight) pour titres ≥ 32px
- `tracking-tight` à `tracking-tighter` sur tous les titres
- Préférer `shadow-sm` ou pas de shadow du tout — Uber n'utilise quasi jamais de shadow

---

## 6. PLAN D'EXÉCUTION POUR ANTIGRAVITY

Effectuer les changements **dans cet ordre** pour limiter les régressions :

1. **`src/app/globals.css`** — remplacer intégralement par les tokens et classes section 2 et 3
2. **`src/app/layout.tsx`** — ajouter `Inter_Tight` et la variable `--font-inter-tight`
3. **`src/components/Navbar.tsx`** — appliquer specs 4.6 (radius 4px, hauteur 72px, logo Inter Tight)
4. **`src/components/Hero.tsx`** — refonte complète, fond noir, typographie display-xl
5. **`src/components/Features.tsx`** + **`Solution.tsx`** + **`Problem.tsx`** + **`HowItWorks.tsx`** — fond blanc, cards radius 8px, hover bordure noire
6. **`src/components/Pricing.tsx`** — plan recommandé en fond noir + bouton vert
7. **`src/components/FAQ.tsx`** — accordéons épurés radius 0
8. **`src/components/CTA.tsx`** — bloc CTA fond noir sur toute largeur, bouton blanc
9. **`src/components/Footer.tsx`** — fond noir intégral
10. **`src/components/dashboard/`** — sidebar items avec fond noir actif, KPI cards Uber
11. **`src/components/public-driver/`** — page chauffeur avec hero photo + bloc réservation Uber-style
12. **Vérifier** qu'aucun composant ne contient encore de `rounded-xl`, `rounded-2xl`, `rounded-3xl`, ni de couleurs `#fafaf8`, `#f3f2ee`, `#276EF1`

---

## 7. CHECKLIST DE VALIDATION FINALE

- [ ] Fond global `#FFFFFF` partout (sauf hero/footer/CTA full-bleed = `#000000`)
- [ ] Aucun `border-radius` > 8px sauf modals (12px) et pills (9999px)
- [ ] Tous les CTA primaires sont **noirs**, pas bleus
- [ ] Vert `#06C167` utilisé **uniquement** pour : succès, "réservation confirmée", plan recommandé, checkmarks
- [ ] Police Inter Tight active sur tous les titres ≥ 32px
- [ ] Letter-spacing négatif (`tracking-tight` minimum) sur tous les titres
- [ ] Hover des cards = bordure devient noire (pas de translateY)
- [ ] Sidebar dashboard : item actif = fond noir + texte blanc
- [ ] Footer fond noir avec texte gris `#AFAFAF`
- [ ] Navbar 72px, logo en Inter Tight 22px weight 800
- [ ] Aucun gradient (Uber n'utilise jamais de gradient)
- [ ] Aucune ombre portée sauf shadow-sm sur modals et dropdowns

---

## 8. NOTES SUPPLÉMENTAIRES

**Accessibilité :**
- Contraste noir/blanc dépasse largement WCAG AAA
- Conserver `outline: 2px solid #000` sur tous les éléments focusables
- `prefers-reduced-motion` : désactiver les animations de fade

**Mobile :**
- Display-xl passe à 56px sur mobile, display-l à 40px
- Padding horizontal mobile : 20px (au lieu de 32px desktop)
- Boutons : pleine largeur sur mobile

**Dark mode (optionnel) :**
- Si activé, simplement inverser : `--background: #000`, `--foreground: #FFF`
- Cards : `#1A1A1A`, bordures : `#2E2E2E`
- C'est le `card-dark` déjà spécifié

---

**Fin du document. Toute modification doit respecter strictement ces tokens et specs pour garantir la cohérence visuelle Uber.**

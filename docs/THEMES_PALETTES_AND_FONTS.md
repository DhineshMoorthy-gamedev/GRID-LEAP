# Grid Leap — Design System: Themes, Color Palettes & Typography

> **Status:** Production Reference Document  
> **Source Files:** [`src/styles/fonts.css`](file:///E:/PROTO/GRID%20LEAP/src/styles/fonts.css), [`src/styles/main.css`](file:///E:/PROTO/GRID%20LEAP/src/styles/main.css), [`index.html`](file:///E:/PROTO/GRID%20LEAP/index.html)

---

## 1. Design Philosophy

**Grid Leap** is built upon a minimalist, tactile aesthetic inspired by Bauhaus design, Swiss typography, and high-grade editorial printmaking. The design system centers on:

1. **Clarity over Clutter:** Zero decorative noise; every line, border, and glow conveys game mechanics and spatial logic.
2. **Dual-Theme Equilibrium:** Two mathematically balanced visual modes:
   - **Obsidian:** Low-emission, high-contrast dark space for deep focus and evening gameplay.
   - **Vellum:** Tactile 300gsm cotton rag paper aesthetic with blind deboss depth for daylight and serene play.
3. **100% Offline Typography:** Self-hosted `.woff2` variable font subsets ensuring zero external network dependency, instant boot, and no layout shifts.

---

## 2. Typography System

All fonts are self-hosted in `public/fonts/` and declared via `@font-face` in [`src/styles/fonts.css`](file:///E:/PROTO/GRID%20LEAP/src/styles/fonts.css).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TYPOGRAPHY STACK                              │
├───────────────────┬──────────────┬────────────────┬────────────────────┤
│ Font Family       │ Weights      │ Format         │ Primary Role       │
├───────────────────┼──────────────┼────────────────┼────────────────────┤
│ Space Grotesk     │ 400, 600, 700│ WOFF2 (Static) │ Primary UI & Heads │
│ JetBrains Mono    │ 400, 700, 800│ WOFF2 (Static) │ Numbers, HUD, Badg │
│ Bodoni Moda       │ 400, 600     │ WOFF2 (Static) │ Studio Brandmark   │
└───────────────────┴──────────────┴────────────────┴────────────────────┘
```

### Font 1: Space Grotesk (Primary UI)
* **CSS Variable:** `--font-ui`
* **Declaration:** `"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif`
* **Weights Used:** 400 (Regular), 600 (Semi-bold), 700 (Bold)
* **Usage:**
  - Navigation bars and header brand logo (`GRID LEAP`)
  - Screen titles, modal headings, and dialog labels
  - Button text, settings labels, and toggle controls
  - Tutorial instructions and dialog callouts

### Font 2: JetBrains Mono (Numbers & Monospace HUD)
* **CSS Variable:** `--font-num`
* **Declaration:** `"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace`
* **Weights Used:** 400 (Regular), 700 (Bold), 800 (Extra Bold)
* **Usage:**
  - Grid cell leap numbers (e.g. `1`, `2`, `3`, `4`)
  - Move counters, timer readouts, and streak numbers
  - Keyboard shortcuts (`<kbd class="kbd-badge">` badges)
  - Reticle coordinates, solver diagnostics, and JSON debug inspector
  - Studio intro sequence subtitle `"presents"`

### Font 3: Bodoni Moda (Editorial Brandmark)
* **Declaration:** `'Bodoni Moda', 'Didot', 'Bodoni MT', 'Cinzel', serif`
* **Weights Used:** 400 (Regular), 400 Italic, 600 (Semi-bold)
* **Usage:**
  - Fullscreen studio splash screen intro: `.logo-text-olai` (52px) and `.logo-text-studios` (22px)

---

## 3. Theme 1: Obsidian & Solar Ochre (Dark Mode)

* **Selector:** `:root`, `[data-theme="obsidian"]`
* **Theme Name Token:** `--theme-name: "obsidian"`
* **Character:** Deep midnight canvas with high-contrast glowing cyan accents and crisp off-white glyphs.

### Color Palette Reference

| Token Name | Hex / RGBA | Preview / Role | Purpose & Usage |
|---|---|---|---|
| `--bg-app` | `#121316` | Dark Obsidian | Full app backdrop & body base |
| `--bg-surface` | `#1A1C20` | Slate Surface | Header bar, board tray container |
| `--bg-card` | `#22252B` | Raised Card | Modals, menu cards, level buttons |
| `--bg-card-hover` | `#2C3038` | Hover Card | Hover & active state for cards/buttons |
| `--bg-void` | `#0D0E10` | Deep Void | Darkest inset recesses, backplates |
| `--text-main` | `#F4F4F5` | Off-White | Primary headings, button text, numbers |
| `--text-dim` | `#8E95A5` | Slate Grey | Secondary text, descriptions, inactive icons |
| `--text-muted` | `#5D6372` | Muted Ash | Disabled buttons, footnote labels, dividers |
| `--line` | `#2A2D35` | Subtle Border | Container borders, card outlines |
| `--line-soft` | `rgba(255,255,255,0.08)` | Ghost Line | Hairline dividers, subtle separators |
| `--accent-primary` | `#38BDF8` | Ice Cyan | Active reticle player, selected buttons |
| `--accent-primary-dim` | `rgba(56,189,248,0.16)`| Cyan Tint | Active button background tint |
| `--accent-primary-glow`| `rgba(56,189,248,0.35)`| Cyan Halo | Reticle pulse, player leap glow |
| `--accent-contrast` | `#0D1117` | Ink Contrast | Text color when overlaid on cyan |
| `--goal-color` | `#34D399` | Mint Green | Goal flag / destination cell |
| `--goal-dim` | `rgba(52,211,153,0.16)`| Mint Tint | Goal cell background glow plate |
| `--goal-glow` | `rgba(52,211,153,0.35)`| Mint Halo | Goal victory beacon effect |
| `--legal-dest-color` | `#38BDF8` | Ice Cyan | Valid jump destination indicators |
| `--legal-dest-bg` | `#162638` | Dark Azure | Legal destination tile fill |
| `--legal-dest-glow` | `rgba(56,189,248,0.32)`| Cyan Halo | Destination landing rings |
| `--danger` | `#FB7185` | Rose Coral | Dead-end trap warning, life loss |
| `--danger-dim` | `rgba(251,113,133,0.18)`| Rose Tint | Out of lives modal highlight |
| `--trail-stroke` | `#38BDF8` | Ice Cyan | Breadcrumb leap path line |
| `--trail-halo` | `#121316` | Dark Mask | Breadcrumb outline halo against tiles |
| `--cell-bg` | `#22252B` | Card Grey | Grid tile background |
| `--cell-glyph-bg` | `#282C34` | Tile Core | Inner glyph container badge |
| `--cell-glyph-color` | `#F4F4F5` | Off-White | Leap distance number on tile |
| `--studio-reticle` | `rgba(255,184,0,0.22)`| Amber Tint | Studio splash screen intro reticle |

---

## 4. Theme 2: Vellum & Blind Deboss (Light Mode)

* **Selector:** `[data-theme="vellum"]`
* **Theme Name Token:** `--theme-name: "vellum"`
* **Character:** Tactile warm papercraft with debossed tile shadows, deep charcoal calligraphy ink, and botanical slate accents.

### Color Palette Reference

| Token Name | Hex / RGBA | Preview / Role | Purpose & Usage |
|---|---|---|---|
| `--bg-app` | `#F7F5F0` | Cotton Paper | Full app warm cotton rag backdrop |
| `--bg-surface` | `#EFECE4` | Pressed Board | Topbar, game board recess tray |
| `--bg-card` | `#F7F5F0` | White Cotton | Modals, menu cards, floating panels |
| `--bg-card-hover` | `#ECE7DD` | Warm Crease | Hover & active state for buttons |
| `--bg-void` | `#E5DFD3` | Deep Paper Inset| Darkest recessed surfaces |
| `--text-main` | `#1E1C1A` | Charcoal Ink | High-contrast typography & regular numbers |
| `--text-dim` | `#68625A` | Warm Umber | Secondary descriptions, inactive controls |
| `--text-muted` | `#9E978E` | Sand Grey | Subtitle notes, disabled items |
| `--line` | `#DFD9CE` | Paper Crease | Card borders, board borders |
| `--line-soft` | `rgba(30,28,26,0.07)` | Faint Shadow | Subtle dividers, card inner hair lines |
| `--accent-primary` | `#2B5D7D` | Slate Blue | Player reticle, primary buttons, badges |
| `--accent-primary-dim` | `rgba(43,93,125,0.12)`| Blue Mist | Active button tint, selected pills |
| `--accent-primary-glow`| `rgba(43,93,125,0.28)`| Soft Indigo | Player highlight ring & selection |
| `--accent-contrast` | `#FFFFFF` | Pure White | Text color when overlaid on slate blue |
| `--goal-color` | `#2D6A4F` | Forest Green | Goal flag / destination cell |
| `--goal-dim` | `rgba(45,106,79,0.12)` | Sage Tint | Goal cell tactile background |
| `--goal-glow` | `rgba(45,106,79,0.25)` | Pine Halo | Goal victory celebratory beacon |
| `--legal-dest-color` | `#2B5D7D` | Slate Blue | Valid jump destination ring |
| `--legal-dest-bg` | `rgba(43,93,125,0.08)`| Soft Blue | Legal destination tile fill |
| `--legal-dest-glow` | `rgba(43,93,125,0.20)`| Slate Glow | Destination pulse indicator |
| `--danger` | `#505A64` | Slate Graphite | Dead-end warning, danger highlights |
| `--danger-dim` | `rgba(80,90,100,0.15)` | Graphite Wash | Out of lives modal highlight |
| `--trail-stroke` | `#2B5D7D` | Slate Blue | Breadcrumb trajectory stroke |
| `--trail-halo` | `#EFECE4` | Paper Cream | Trail line contrast border |
| `--cell-bg` | `#FFFFFF` | Crisp White | Raised sculpted papercraft cell |
| `--cell-border` | `#DFD9CE` | Emboss Edge | Border outlining each physical tile |
| `--cell-glyph-color` | `#1E1C1A` | Charcoal Ink | Leap distance number on tile |
| `--studio-reticle` | `rgba(217,119,6,0.26)`| Warm Amber | Studio splash screen intro reticle |

---

## 5. Semantic Gameplay & Difficulty Tiers

The game maps mechanics to semantic palette tokens rather than hardcoded hex codes:

```
┌────────────────────────────────────────────────────────────────────────┐
│                       MECHANIC COLOR MAPPINGS                          │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│ Gameplay Concept  │ Obsidian Palette     │ Vellum Palette              │
├───────────────────┼──────────────────────┼─────────────────────────────┤
│ Player Reticle    │ #38BDF8 (Ice Cyan)   │ #2B5D7D (Slate Blue)        │
│ Goal Destination  │ #34D399 (Mint Green) │ #2D6A4F (Forest Green)      │
│ Valid Next Leap   │ #38BDF8 (Cyan Ring)  │ #2B5D7D (Slate Blue Ring)   │
│ Dead End / Trap   │ #FB7185 (Rose Coral) │ #505A64 (Slate Graphite)    │
│ Breadcrumb Trail  │ #38BDF8 (Cyan Beam)  │ #2B5D7D (Drafting Blue Ink) │
│ Tier: Easy        │ #34D399 (Mint Green) │ #2D6A4F (Forest Green)      │
│ Tier: Medium      │ #38BDF8 (Ice Cyan)   │ #2B5D7D (Slate Blue)        │
│ Tier: Hard        │ #38BDF8 (Cyan Glow)  │ #2B5D7D (Deep Indigo)       │
│ Tier: Master      │ #FB7185 (Rose Coral) │ #505A64 (Slate Graphite)    │
└───────────────────┴──────────────────────┴─────────────────────────────┘
```

---

## 6. Tactile Surface & Shadow Tokens

Grid Leap uses physical elevation cues to make the grid feel like a physical board game:

### Obsidian Shadows (Luminous Emissive Depth)
```css
--cell-shadow: 0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
--cell-glyph-shadow: 0 0 6px 2px #121316;
--board-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
--app-shadow: 0 0 64px rgba(0, 0, 0, 0.75);
```

### Vellum Shadows (Tactile Papercraft Inset & Deboss)
```css
--cell-shadow: 0 2px 4px rgba(60, 50, 40, 0.08), 0 1px 1px rgba(60, 50, 40, 0.04);
--cell-glyph-shadow: none;
--board-shadow: inset 0 2px 6px rgba(60, 50, 40, 0.06), 0 12px 32px rgba(90, 80, 70, 0.10);
--app-shadow: 0 0 64px rgba(70, 60, 50, 0.12);
```

---

## 7. Dynamic Layout & Safe Area Tokens

Used for mobile notch clearance and adaptive bottom ad clearance:

```css
--ad-banner-height-mobile: 56px;
--ad-banner-height-tablet: 90px;
--ad-banner-height: var(--ad-banner-height-mobile);

--safe-top: env(safe-area-inset-top, 0px);
--safe-bottom: env(safe-area-inset-bottom, 0px);
--safe-left: env(safe-area-inset-left, 0px);
--safe-right: env(safe-area-inset-right, 0px);
```

---

## 8. Theme Switching Implementation

Theme switching operates instantaneously without layout recalculations or flash of unstyled content (FOUC):

1. **HTML Data Attribute:** Set dynamically on `<html>` (`<html data-theme="obsidian">` or `<html data-theme="vellum">`).
2. **Instant Pre-Paint Execution:** A synchronous inline script in [`index.html`](file:///E:/PROTO/GRID%20LEAP/index.html#L11-L24) reads `localStorage.getItem("number_grid_maze_save_v1")` and applies `data-theme` **before the first frame renders**.
3. **Android Status Bar Sync:** `PlatformBridge.init()` sets the native Capacitor status bar color and dark/light mode icons matching the selected theme.

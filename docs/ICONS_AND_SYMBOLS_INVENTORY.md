# Grid Leap — Icon & Symbol System Inventory

> **Status:** Production Reference Document  
> **Source Files:** [`index.html`](file:///E:/PROTO/GRID%20LEAP/index.html), [`src/scenes/game-renderer.js`](file:///E:/PROTO/GRID%20LEAP/src/scenes/game-renderer.js), [`src/scenes/reward-modal-controller.js`](file:///E:/PROTO/GRID%20LEAP/src/scenes/reward-modal-controller.js), [`src/scenes/tutorial-controller.js`](file:///E:/PROTO/GRID%20LEAP/src/scenes/tutorial-controller.js)

---

## 1. Overview & Icon Design System

All in-game iconography in **Grid Leap** adheres to a strict geometric, lightweight SVG vector standard:
* **Stroke Width:** `2.0px` to `2.6px` with `round` caps and joins for clean rendering on high-DPI retina screens.
* **ViewBox Standard:** Normalized `0 0 24 24` (or `0 0 12 12` for micro-reticle markers).
* **Color Binding:** `currentColor` inherits CSS theme custom properties (`var(--accent-primary)`, `var(--goal-color)`, `var(--text-main)`).
* **Zero External Network Dependencies:** All SVGs are inline or rendered dynamically.

---

## 2. Category 1: Navigation, Shell & Modal Controls

### 1.1 Theme Mode Switcher (Moon / Sun)
* **Context:** Header Topbar, Settings Modal
* **Purpose:** Toggles between Obsidian (Dark) and Vellum (Light Papercraft).
```html
<!-- Moon (Obsidian Mode) -->
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>

<!-- Sun (Vellum Mode) -->
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4.5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
</svg>
```

### 1.2 Universal Back Chevron
* **Context:** Game Topbar, Settings, Tutorial, Calendar Archive
* **Purpose:** Smooth navigation returning to the previous screen.
```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="15 18 9 12 15 6"></polyline>
</svg>
```

### 1.3 Forward Navigation Chevron (Next Level)
* **Context:** Win Modal "Next Level" Primary Button
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="9 18 15 12 9 6"></polyline>
</svg>
```

### 1.4 Home Hub Shortcut
* **Context:** Win Modal, Final Campaign Screen
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
  <polyline points="9 22 9 12 15 12 15 22"></polyline>
</svg>
```

### 1.5 External Link Arrow
* **Context:** Settings (Privacy Policy, Credits, Store Rating)
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
  <polyline points="15 3 21 3 21 9"></polyline>
</svg>
```

### 1.6 Additional Shell Symbols (Typography / Micro-Glyphs)
* **Settings Gear:** `⚙` (20px, HUD button)
* **How to Play / Rules:** `?` (Space Grotesk Bold, 14px circle button)
* **Pause Button:** `❚❚` (JetBrains Mono Black, 10px)
* **Close / Dismiss Modal:** `✕` (12px bold cross)
* **Fullscreen Expand:** `⛶` (Desktop & Web toolbar)
* **In-App Update Indicator:** `🚀` (Header badge pill)

---

## 3. Category 2: In-Game HUD, Token & Compass Tools

### 2.1 Undo Step
* **Context:** Gameplay Bottom Toolbar
* **Purpose:** Rewinds the previous leap step.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="1 4 1 10 7 10"></polyline>
  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
</svg>
```

### 2.2 Restart / Reset Level
* **Context:** Gameplay Bottom Toolbar, Pause Modal
* **Purpose:** Resets puzzle board and player token back to the origin.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="23 4 23 10 17 10"></polyline>
  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
</svg>
```

### 2.3 Hint / Compass (Lightbulb)
* **Context:** Gameplay Bottom Toolbar
* **Purpose:** Illuminates the next single optimal step toward the goal.
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 18h6"></path>
  <path d="M10 22h4"></path>
  <path d="M15.09 13.72A6 6 0 1 0 8.91 13.72 M12 2v2"></path>
</svg>
```

### 2.4 Compass Reticle / Reward Icon
* **Context:** Reward Modal, Hint Unlock Flow
```html
<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"></circle>
  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
</svg>
```

### 2.5 Breadcrumbs Trail Track
* **Context:** Game Topbar (Trail Toggle)
* **Purpose:** Toggles multi-lane topological line tracks over visited tiles.
```html
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 19c4-4 2-8 7-8s3 4 7 4 2-8 2-8"/>
  <circle cx="4" cy="19" r="1.5" fill="currentColor"/>
  <circle cx="20" cy="7" r="1.5" fill="currentColor"/>
</svg>
```

### 2.6 Lives: Active & Lost Hearts
* **Context:** Game Topbar Heart HUD
```html
<!-- Active Heart (Filled Green) -->
<svg class="heart-icon active" width="20" height="20" viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>

<!-- Lost Heart (Hollow Rose Outline) -->
<svg class="heart-icon lost" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(244,63,94,0.7)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>
```

### 2.7 Broken Heart (Out of Lives)
* **Context:** Out of Lives Game Over Modal
```html
<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  <polyline points="12 4 10 10 14 13 11 18"/>
</svg>
```

### 2.8 Cardinal Exit Reticle Arrows (↑ ↓ ← →)
* **Context:** Active Player Token Overlay (Indicating valid leap directions)
```html
<!-- Arrow Up -->
<svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 7.5 L6 3.5 L9.5 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>

<!-- Arrow Down -->
<svg viewBox="0 0 12 12" width="12" height="12"><path d="M2.5 4.5 L6 8.5 L9.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>

<!-- Arrow Left -->
<svg viewBox="0 0 12 12" width="12" height="12"><path d="M7.5 2.5 L3.5 6 L7.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>

<!-- Arrow Right -->
<svg viewBox="0 0 12 12" width="12" height="12"><path d="M4.5 2.5 L8.5 6 L4.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

---

## 4. Category 3: Progression, Ratings, Calendar & Social

### 3.1 Achievements Trophy
* **Context:** Home Topbar Button, Achievements Modal, Level 100 Finale
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.45 1-1 1H7 M14 14.66V17c0 .55.45 1 1 1h2 M18 2H6v7a6 6 0 0 0 12 0V2z"/>
</svg>
```

### 3.2 Daily Calendar Archive
* **Context:** Daily Challenge Card Archive Trigger
```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>
```

### 3.3 Daily Streak Flame
* **Context:** Daily Challenge Card, Win Modal Streak Strip
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>
</svg>
```

### 3.4 Play Action Triangle
* **Context:** Home Hero Launch, Daily Play Button
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
  <polygon points="6 3 20 12 6 21 6 3"/>
</svg>
```

### 3.5 Flawless Mastery Star
* **Context:** 3-Star Level Rating, 100% Move Efficiency, Remove Ads IAP
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>
```

### 3.6 Performance Rating Tiers
```html
<!-- Lightning Zap (Tier: Excellent / Near-Optimal) -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
</svg>

<!-- Thumbs Up (Tier: Good / Cleared) -->
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
</svg>
```

### 3.7 Footsteps (Player Move Count vs Optimal)
* **Context:** Win Modal Move Stats Strip
```html
<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
  <path d="M13 5.5C13 3.3 14.5 1.5 16.5 1.5S20 3.3 20 5.5c0 1.8-1 3.2-1.5 4.5h-4C14 8.7 13 7.3 13 5.5z M14.5 13c0-1.2 0.9-2 2-2s2 0.8 2 2-0.9 2-2 2-2-0.8-2-2z"/>
  <path d="M4 12.5C4 10.3 5.5 8.5 7.5 8.5S11 10.3 11 12.5c0 1.8-1 3.2-1.5 4.5h-4C5 15.7 4 14.3 4 12.5z M5.5 20c0-1.2 0.9-2 2-2s2 0.8 2 2-0.9 2-2 2-2-0.8-2-2z"/>
</svg>
```

### 3.8 Checkmark Verified
* **Context:** Level Selector Cleared Dots, Achievement Unlocked Check
```html
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="20 6 9 17 4 12"/>
</svg>
```

### 3.9 Social Sharing Icons
```html
<!-- Generic Share Network Node -->
<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="18" cy="5" r="3"></circle>
  <circle cx="6" cy="12" r="3"></circle>
  <circle cx="18" cy="19" r="3"></circle>
  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
</svg>

<!-- X / Twitter Brand Vector -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
</svg>

<!-- WhatsApp Brand Vector -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
</svg>

<!-- Copy / Clipboard Vector -->
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
  <polyline points="22,6 12,13 2,6"></polyline>
</svg>
```

---

## 5. Category 4: Level Designer & Diagnostics Icons

### 5.1 Pencil / Edit Brush
* **Context:** Visual Level Editor Launch Button
```html
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
</svg>
```

### 5.2 Flag (Goal Cell Marker)
* **Context:** Editor Palette Special Goal Tool
```html
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7"/>
</svg>
```

### 5.3 Additional Dev Symbols
* **Grid Steppers:** `−` and `+` (Size matrix controls)
* **Path Playback:** `⏮` (Step Back), `▶` (Auto-Play), `⏭` (Step Forward)
* **Start Brush Indicator:** `S` (JetBrains Mono Bold)
* **Goal Brush Indicator:** `★` (Five-point star glyph)
* **Clipboard JSON:** `📋`

---

## 6. Category 5: Store, Platform & Raster Assets

| Asset Name | Resolution | Format | Purpose | File Location |
|---|---|---|---|---|
| **App Icon** | 512 × 512 | PNG | Official Google Play & Web Icon | [`docs/store-assets/app_icon_512x512.png`](file:///E:/PROTO/GRID%20LEAP/docs/store-assets/app_icon_512x512.png) |
| **Feature Graphic** | 1024 × 500 | PNG | Play Store Banner | [`docs/store-assets/feature_graphic_1024x500.png`](file:///E:/PROTO/GRID%20LEAP/docs/store-assets/feature_graphic_1024x500.png) |
| **PWA Icon 192** | 192 × 192 | PNG | Progressive Web App Manifest | [`public/icon-192.png`](file:///E:/PROTO/GRID%20LEAP/public/icon-192.png) |
| **PWA Icon 512** | 512 × 512 | PNG | Progressive Web App Manifest | [`public/icon-512.png`](file:///E:/PROTO/GRID%20LEAP/public/icon-512.png) |
| **Favicon** | 64 × 64 | PNG | Browser Tab Icon | [`public/favicon.png`](file:///E:/PROTO/GRID%20LEAP/public/favicon.png) |
| **Adaptive Foreground** | Vector/PNG | Mipmap | Android Adaptive Icon Top Layer | `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png` |
| **Adaptive Background** | `#121316` | XML | Android Adaptive Icon Base Layer | `android/app/src/main/res/values/ic_launcher_background.xml` |

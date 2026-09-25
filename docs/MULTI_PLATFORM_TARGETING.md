# Multi-Platform Targeting — How One Codebase Ships Everywhere

> This document explains the platform targeting system used in **Grid Leap** — a pattern you can lift and apply to any other Vite-based game project. The goal is to ship a single codebase to multiple destinations (Android, Desktop, Web, Itch, etc.) without maintaining separate branches or copying code.

---

## The Core Idea

The game has **one codebase**. At build time, you tell it which platform you're building for. That platform label flows through the entire app and controls:

- Which features are turned on or off
- What UI elements are shown or hidden
- Whether native plugins (ads, billing, haptics) are active
- What gets compiled into the output bundle

The mechanism is dead simple: **a single environment variable** (`VITE_APP_TARGET`) answered at build time.

---

## The Platforms Grid Leap Targets

| Target Label | Description | Build Command |
|---|---|---|
| `editor` | Internal dev mode — level editor, diagnostics HUD, all dev tools | `npm run dev` |
| `playstore` | Google Play Android release — ads, IAP, haptics, native plugins | `npm run build:playstore` |
| `desktop` | Tauri Windows/Mac app — fullscreen, keyboard, no ads | `npm run tauri:build` |
| `itch` | Itch.io browser/desktop — fullscreen toggle, no ads | `npm run build:itch` |
| `web` | PWA / hosted web — Web Share API, ads | `npm run build:web` |
| `crazygames` | CrazyGames portal embed — portal SDK, no ads of our own | `npm run build:crazygames` |

---

## How It Works — Step by Step

### Step 1: The `.env` Files

Each platform has its own environment file sitting at the project root:

```
.env                  ← default fallback (used if no --mode is given)
.env.editor           ← loaded when --mode editor
.env.playstore        ← loaded when --mode playstore
.env.desktop          ← loaded when --mode desktop
.env.itch             ← loaded when --mode itch
.env.web              ← loaded when --mode web
.env.crazygames       ← loaded when --mode crazygames
```

Each file sets one key variable:

```bash
# .env.playstore
VITE_APP_TARGET=playstore
VITE_APP_TITLE=Grid Leap
VITE_AD_MODE=production

# .env.itch
VITE_APP_TARGET=itch
VITE_APP_TITLE=Grid Leap

# .env.editor
VITE_APP_TARGET=editor
VITE_APP_TITLE=Grid Leap (Level Editor & Diagnostics)
```

The build tool (Vite) automatically picks up the right `.env` file based on the `--mode` flag you pass. **You don't do anything special** — Vite handles this natively.

---

### Step 2: The `target-config.js` File

This is the single source of truth for the whole system. It reads the environment variable and exposes clean flags for the rest of the app.

```
src/
  platform/
    target-config.js   ← the brain of the whole system
```

What it does:

1. **Reads** `VITE_APP_TARGET` from the build environment
2. **Validates** it against a known list of platform labels
3. **Exposes** simple boolean flags like `isPlayStore`, `isDesktop`, etc.
4. **Exposes** a `features` object that maps feature names to true/false

```js
// Simplified version of what the file does:

const activeMode = import.meta.env.VITE_APP_TARGET || "editor";

export const TargetConfig = {
  mode: activeMode,

  // Platform booleans — use these for quick checks
  isPlayStore: activeMode === "playstore",
  isDesktop:   activeMode === "desktop",
  isItch:      activeMode === "itch",
  isWeb:       activeMode === "web",
  isEditor:    activeMode === "editor",

  // Feature flags — use these for UI and behavior toggles
  features: {
    levelEditor:       activeMode === "editor",
    devDiagnostics:    activeMode === "editor",
    showAdBanner:      activeMode === "playstore" || activeMode === "web",
    removeAdsIAP:      activeMode === "playstore",
    fullscreenControl: activeMode === "itch" || activeMode === "desktop" || activeMode === "web",
    haptics:           activeMode === "playstore",
    socialShare:       activeMode === "web",
  }
};
```

This file is imported once and used everywhere. Nothing else in the codebase needs to know what `VITE_APP_TARGET` is — they just ask `TargetConfig`.

---

### Step 3: Using It In Your Code

Anywhere in the game, you can import and use it like this:

**Show/hide a UI element:**
```js
// Only show the fullscreen button on Desktop and Itch
DOM.fullscreenBtn.style.display = TargetConfig.features.fullscreenControl ? "flex" : "none";

// Only show the ads banner space on Play Store
DOM.adBannerSlot.style.display = TargetConfig.features.showAdBanner ? "block" : "none";

// Only show the level editor card in dev mode
DOM.editorCard.style.display = TargetConfig.features.levelEditor ? "flex" : "none";
```

**Run platform-specific code paths:**
```js
// Initialize ads only on Play Store
if (TargetConfig.isPlayStore) {
  AdController.init();
}

// Use native Capacitor back button on Android, web history API on desktop
if (TargetConfig.isPlayStore || PlatformBridge.isCapacitor()) {
  App.addListener("backButton", handleBack);
} else {
  window.addEventListener("popstate", handleBack);
}

// Premium users on Desktop get ads disabled by default
const isPremium = AdController.isPremiumUser() || TargetConfig.isDesktop || TargetConfig.isEditor;
```

**In the Ad system:**
```js
async init() {
  // Skip entirely if ads aren't enabled for this build
  if (!TargetConfig.features.showAdBanner) return;

  // Only run AdMob initialization on Play Store native build
  if (TargetConfig.isPlayStore) {
    await PlatformBridge.initAds();
    await this._showBanner();
  }
}
```

The key insight: **code everywhere else stays clean**. You never check `VITE_APP_TARGET` directly — you only read the flags that `target-config.js` computed. This means if you rename a platform or add a new one, you only change one file.

---

### Step 4: The Build Scripts

The `package.json` scripts wire everything together:

```json
"scripts": {
  "dev":              "vite --mode editor",
  "dev:playstore":    "vite --mode playstore",
  "dev:desktop":      "vite --mode desktop",

  "build:playstore":  "vite build --mode playstore --outDir dist && cap sync android",
  "build:desktop":    "vite build --mode desktop --outDir dist/desktop",
  "build:itch":       "vite build --mode itch --outDir dist/itch",
  "build:web":        "vite build --mode web --outDir dist/web",
  "build:crazygames": "vite build --mode crazygames --outDir dist/crazygames",

  "tauri:build":      "npm run build:desktop && tauri build"
}
```

Each build command:
1. Passes `--mode <platform>` → Vite loads the matching `.env.<platform>` file
2. Sets `--outDir` to a platform-specific subfolder so outputs don't overwrite each other
3. Can chain additional native steps (like `cap sync android` for the Play Store build)

**Each output folder is fully self-contained** — the `dist/itch` bundle behaves differently from `dist/playstore` even though they were compiled from the same source files.

---

## The Special Case: Desktop / Tauri

Tauri (used for the Windows/Mac desktop app) is detected differently. Because Tauri apps run in a packaged WebView — not through Vite's dev server — there's no way to inject the env variable at runtime after packaging in all edge cases.

To solve this, `target-config.js` detects the Tauri runtime automatically:

```js
// If Tauri's global object is present, we're running as a desktop app
const isTauriRuntime = Boolean(window.__TAURI_INTERNALS__ || window.__TAURI__);

// Use Tauri detection OR the env variable — whichever fires first
const rawMode = isTauriRuntime ? "desktop" : (import.meta.env?.VITE_APP_TARGET || "editor");
```

This means you build with `--mode desktop`, and even if the mode somehow isn't detected, the app correctly identifies itself as a desktop app when running inside Tauri.

---

## What Each Platform Gets (Feature Matrix)

| Feature | editor | playstore | desktop | itch | web | crazygames |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Level Editor & tools | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dev diagnostics HUD | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ad banner slot | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Remove Ads IAP | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Native haptics | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fullscreen toggle | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Web Share API | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Daily push reminders | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Hint badge counter | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Hints free / unlimited | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## How to Reuse This Pattern in a New Project

Here's the minimum setup you need to copy:

### 1. Create your env files

At your project root, create one file per target:

```
.env.editor
.env.playstore
.env.web
.env.itch
```

Each just needs:
```bash
VITE_APP_TARGET=<platform-name>
VITE_APP_TITLE=Your Game
```

### 2. Create `src/platform/target-config.js`

```js
const rawMode = (import.meta.env?.VITE_APP_TARGET || "editor").toLowerCase();

export const TargetConfig = {
  mode: rawMode,

  isEditor:    rawMode === "editor",
  isPlayStore: rawMode === "playstore",
  isWeb:       rawMode === "web",
  isItch:      rawMode === "itch",

  features: {
    // Define every feature flag your game needs
    ads:         rawMode === "playstore" || rawMode === "web",
    iap:         rawMode === "playstore",
    devTools:    rawMode === "editor",
    fullscreen:  rawMode === "itch" || rawMode === "web",
    // ... add more as you need them
  }
};
```

### 3. Add build scripts to `package.json`

```json
"scripts": {
  "dev":              "vite --mode editor",
  "build:playstore":  "vite build --mode playstore --outDir dist",
  "build:itch":       "vite build --mode itch --outDir dist/itch",
  "build:web":        "vite build --mode web --outDir dist/web"
}
```

### 4. Import and use in your game code

```js
import { TargetConfig } from "./platform/target-config.js";

// Show/hide UI
adsPanel.style.display = TargetConfig.features.ads ? "block" : "none";

// Gate logic
if (TargetConfig.isPlayStore) {
  initNativePlugins();
}
```

That's the whole system. No special build plugins. No runtime detection tricks. Just an environment variable, a config file, and consistent flag checks throughout your code.

---

## Things to Keep in Mind

**Don't scatter raw `VITE_APP_TARGET` checks everywhere.** Always read from `TargetConfig`. If you need to rename a platform or change what a platform does, you change it in one place.

**Keep features semantic, not named after platforms.** Prefer `features.ads` over `features.isPlayStoreAds`. This way, if you later add ads to desktop too, you just change one flag value — not every callsite.

**One output folder per platform.** Using `--outDir dist/itch` instead of just `dist/` means you don't accidentally upload the wrong build to the wrong store. You can have all platforms built simultaneously in their own folders.

**The `.env` default file is your safety net.** Set its `VITE_APP_TARGET` to whatever mode is safest to run accidentally (usually `editor` or `desktop`). This is what runs if someone clones the repo and types `npm run dev` without reading the docs.

**Platform detection is not the same as feature detection.** Some features span multiple platforms (e.g., ads on both `playstore` and `web`). Always express this in the `features` object — don't check `isPlayStore || isWeb` everywhere in your game code. The feature flag absorbs that logic so callsites stay simple.

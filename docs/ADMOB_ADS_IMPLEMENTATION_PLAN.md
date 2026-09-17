# AdMob Ads Implementation Plan — Grid Leap
**Olai Digital Studios · Dhinesh**
*Created: 2026-09-17 · Updated: 2026-09-17 (multi-platform expansion)*

---

## 1. Overview

This document covers the full monetization strategy across **all Grid Leap distribution platforms**:
- **Play Store** (Capacitor/Android) — Google AdMob: Banner, Rewarded, Interstitial
- **Web** (Netlify/browser) — Google AdSense: Banner only
- **Itch.io APK** (sideloaded Android) — Unity Ads or Chartboost (AdMob is policy-blocked for sideloads)
- **Desktop** (Tauri) — No ads; freemium / one-time purchase model
- **Editor** (dev tool) — No ads

> [!IMPORTANT]
> AdMob is **Google Play Store–exclusive** for Android. It requires your app to be listed in an approved store (Play Store, Amazon, Samsung Galaxy). Sideloaded APKs (itch.io) cannot use AdMob without risking account termination. Similarly, AdSense **cannot be embedded in desktop app WebViews** (Tauri) — this is a hard policy violation.

### Ad Types Planned Per Platform

| Ad Type | Trigger | Platforms |
|---|---|---|
| **Banner** | Always visible during gameplay (bottom) | Play Store · Web (AdSense) |
| **Rewarded** | Hint button press | Play Store · Itch.io APK |
| **Interstitial** | Between levels (frequency-capped) | Play Store · Itch.io APK |

### Platform Ad Matrix

| Platform | Target | Ad Network | Banner | Rewarded | Interstitial | Remove Ads IAP |
|---|---|---|---|---|---|---|
| **Play Store** (Capacitor Android) | `playstore` | **Google AdMob** | ✅ | ✅ | ✅ | ✅ |
| **Web** (Netlify, browser) | `web` | **Google AdSense** | ✅ (Phase 2) | ❌ | ❌ | ❌ |
| **Itch.io APK** (sideloaded Android) | `itch` | **Unity Ads / Chartboost** | ⚠️ Optional | ✅ | ✅ | ❌ |
| **Desktop** (Tauri) | `tauri` | **None — freemium** | ❌ | ❌ | ❌ | ❌ |
| **Editor** (dev tool) | `editor` | None | ❌ | ❌ | ❌ | ❌ |

> **Note:** The `TargetConfig.features.showAdBanner` flag is already defined in `target-config.js`. It will be expanded to `true` for `playstore` and conditionally `true` for `web`/`itch`. Tauri and Editor always get `false`.

---

## 1a. Per-Platform Strategy Deep Dive

### 🟢 Play Store — Google AdMob (Primary)
The flagship monetization platform. AdMob is the industry standard for Android apps on the Play Store. Full Banner + Rewarded + Interstitial implementation. See Sections 3–10 for full implementation detail.

---

### 🔵 Web (Netlify) — Google AdSense

**Verdict: Use Google AdSense. Web-only (browser), never inside a desktop WebView.**

AdSense is the correct product for a browser-served web app on Netlify. It is **not** AdMob — they are separate Google products with separate policies.

| Property | Detail |
|---|---|
| Network | Google AdSense |
| Format | Responsive display ads (auto-sized banner) |
| Placement | Fixed bottom banner below the game canvas |
| Implementation | `<script>` tag in `index.html` + `<ins class="adsbygoogle">` slot |
| Revenue model | CPM / CPC programmatic |
| Consent | AdSense has built-in EU consent messaging (no extra UMP needed) |
| GDPR | Handled by Google's EU User Consent Policy tool |

**Policy notes:**
- AdSense is for **web pages served in a browser** — Netlify qualifies perfectly.
- AdSense **cannot** be embedded in desktop apps (Tauri WebView) — that is a hard TOS violation risking permanent account ban.
- Mobile web traffic to your Netlify URL is fine; AdSense handles responsive placement automatically.

**Implementation sketch (Web build only):**
```html
<!-- Load AdSense once per page (web build only — gated by TargetConfig.isWeb) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"></script>

<!-- Bottom banner slot -->
<ins class="adsbygoogle ad-banner-slot"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

Gate this in `index.html` with a Vite conditional template (or inject via `AdController.init()` only when `TargetConfig.isWeb === true`).

**Recommended Phase:** Phase 2 — after Play Store launch and revenue baseline is established.

---

### 🟡 Itch.io APK — Unity Ads or Chartboost

**Verdict: Use Unity Ads (primary) or Chartboost (alternative). AdMob is blocked for sideloaded APKs.**

> [!WARNING]
> **AdMob explicitly requires apps to be live in an approved app store** (Play Store, Amazon Appstore, Samsung Galaxy Store). Sideloaded APKs distributed via itch.io violate AdMob's distribution policy. Using AdMob in a sideloaded APK risks permanent AdMob account termination — which would also take down your Play Store monetization.

**The safe, industry-standard alternatives for non-Play-Store Android APKs:**

| Network | Verdict | Notes |
|---|---|---|
| **Unity Ads** | ✅ **Best choice** | Explicitly supports non-store APK distribution. Gaming-focused. Easy SDK. Rewarded + Interstitial + Banner. |
| **Chartboost** | ✅ Good alternative | Gaming-focused. Strong rewarded video. Supports independent/itch distribution. |
| **Adsterra** | 🟡 Acceptable | More flexible policies, good fill rates, but less gaming-optimized. |
| **AppLovin MAX** | ❌ Blocked | Requires official app store listing — same restriction as AdMob. |
| **AdMob** | ❌ Blocked | Policy violation for sideloaded APKs. Do **not** use. |

**Recommended stack for Itch.io APK:**

```
Unity Ads SDK (Android)
  ├── Rewarded video → gates hint
  ├── Interstitial → between levels (freq-capped)
  └── Banner → optional (itch.io users dislike banner ads; skip or make opt-in)
```

**Implementation approach:**
- Unity Ads has a native Android SDK. Since Grid Leap uses Capacitor, you'd create a `UnityAdsPlugin.java` following the same pattern as `AppUpdatePlugin.java`.
- Separate `ad-config.js` entry for `itch` target pointing to Unity Ads game IDs.
- `AdController.js` will route to Unity Ads methods when `TargetConfig.isItch === true`.
- The `requestHintReward()` and `onLevelCompleted()` API surface in `AdController` remains identical — only the underlying bridge changes.

**Revenue note:** Itch.io is an indie/developer-first platform. Many players there strongly dislike ads. Consider making the itch.io APK **ad-free by default with a "support the dev" donation prompt** instead — this is the cultural norm on itch.io and often yields better community reception.

---

### ⚫ Desktop (Tauri) — No Ads / Freemium Model

**Verdict: No ads. Use a freemium or one-time purchase model instead.**

> [!CAUTION]
> **Google AdSense explicitly prohibits use in desktop app WebViews.** Embedding AdSense inside a Tauri app's WebView2/WebKitGTK window is a hard TOS violation. Google's ad servers detect non-browser WebView environments and can terminate your AdSense account. Do not attempt this.

**Why desktop ads don't work well:**
- All major programmatic ad networks (AdSense, AdMob, AppLovin, IronSource) either prohibit desktop app use or heavily restrict it.
- Desktop users have extremely low ad CTR and CPM vs mobile — revenue would be negligible anyway.
- Desktop users are more sophisticated and react negatively to in-app ads.

**Industry-standard desktop monetization:**

| Model | Description | Recommended for Grid Leap |
|---|---|---|
| **One-time purchase** | Pay a fixed price for the Tauri desktop app | ✅ Best fit |
| **Freemium** | Free with limited levels; pay to unlock all levels | ✅ Great option |
| **"Remove ads" is moot** | Desktop has no ads to remove | — |
| **Donation prompt** | "Support development" button/link | ✅ Low friction, good will |
| **Sponsorship** | Partner with a brand for a co-branded desktop version | 🔲 Future |

**Recommended for Grid Leap Desktop:**
Present the Tauri desktop app as a **premium product** — either a one-time paid download (e.g., itch.io desktop, Gumroad) or a free download with a voluntary "buy me a coffee" style donation prompt inside the game. This matches both the desktop cultural norm and protects your ad accounts on other platforms.

No code changes needed for ads on `tauri` target — `AdController.isAdsEnabled()` will return `false` for this mode automatically.

---

## 2. Current Codebase Baseline

### Existing Hooks

- **`TargetConfig.features.showAdBanner`** — already `true` for `playstore` and `web`  
- **`TargetConfig.features.removeAdsIAP`** — already `true` for `playstore`
- **`PlatformBridge.checkRemoveAdsPurchased()`** — already wired via `BillingPlugin`; if `true`, all ads are suppressed
- **`PlatformBridge.purchaseRemoveAds()`** / **`restorePurchases()`** — already implemented in `lifecycle.js`
- **`AD_ID` permission** — already declared in `AndroidManifest.xml` (line 43)
- **`BillingClient 8.0.0`** — already in `android/app/build.gradle`
- **`google-services.json` detection** — already applied in `build.gradle`

### What Doesn't Exist Yet

- No `AdMobPlugin` (Capacitor plugin or Java bridge)
- No `AdController.js` scene controller
- No banner DOM slot in `index.html`
- No rewarded ad gate on the hint button
- No interstitial trigger between levels
- No test/production Ad Unit ID configuration
- No GDPR/UMP consent flow

---

## 3. Architecture Design

### 3.1 Layer Diagram

```
┌─────────────────────────────────────────┐
│             UI Layer (HTML/CSS)         │
│   #adBannerSlot · HintBtn (rewarded)   │
│   Interstitial (fullscreen overlay)     │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         AdController.js (Scene)         │
│  showBanner() · requestRewarded()       │
│  showInterstitial() · hideBanner()      │
│  isAdsEnabled() · suppressAds()        │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│   PlatformBridge (lifecycle.js)         │
│  Ad methods: showBanner, loadRewarded   │
│  showInterstitial, hideBanner, etc.     │
│  (no-op stubs on web/editor)            │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        AdMobPlugin.java (Android)       │
│   Capacitor plugin bridge → AdMob SDK  │
│   Uses com.google.android.gms:play-    │
│   services-ads                          │
└─────────────────────────────────────────┘
```

### 3.2 Key Design Decisions

1. **All ad calls go through `AdController`** — never directly call `PlatformBridge` from game logic. This makes it trivially easy to suppress ads (IAP purchased, editor mode, etc.).
2. **`PlatformBridge` ad methods are no-ops on non-Capacitor** — same pattern as `checkForPlayStoreUpdate()`.
3. **`AdController.isAdsEnabled()`** — single source of truth: returns `false` if `TargetConfig.features.showAdBanner === false` OR if IAP `remove_ads` is purchased.
4. **Interstitial is frequency-capped client-side** — minimum 3 levels between each show; also skipped on the first level start.
5. **Rewarded ad resolves as a `Promise<boolean>`** — `true` = reward granted, `false` = user skipped or ad failed. Hint button checks this promise before revealing hint.

---

## 4. Android / Capacitor Plugin

### 4.1 Gradle Dependency

Add to **`android/app/build.gradle`** inside `dependencies {}`:

```gradle
// Google AdMob
implementation 'com.google.android.gms:play-services-ads:23.5.0'
```

Also add to **root `build.gradle`** (project-level, inside `buildscript.dependencies`):

```gradle
classpath 'com.google.gms:google-services:4.4.2'
```

> The `google-services` classpath is already conditionally applied — just ensure the `google-services.json` file is present in `android/app/`.

### 4.2 AndroidManifest.xml Changes

Add inside `<application>` tag (already has `AD_ID` permission):

```xml
<!-- AdMob App ID (Grid Leap Production) -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-4890313674539327~9594835240" />

<!-- Optional: Optimize initialization -->
<meta-data
    android:name="com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT"
    android:value="true" />
```

> `AD_ID` permission is **already present** at line 43 of `AndroidManifest.xml`. ✅

### 4.3 AdMobPlugin.java (New Capacitor Plugin)

Location: `android/app/src/main/java/com/olaidigitalstudios/gridleap/AdMobPlugin.java`

This plugin mirrors the pattern of `AppUpdatePlugin.java`. Key plugin calls to implement:

```java
@PluginMethod
public void initialize(PluginCall call) { /* MobileAds.initialize() + UMP consent */ }

@PluginMethod
public void showBanner(PluginCall call) { /* Load and display BannerView at bottom */ }

@PluginMethod
public void hideBanner(PluginCall call) { /* BannerView.destroy() */ }

@PluginMethod
public void loadRewardedAd(PluginCall call) { /* RewardedAd.load() */ }

@PluginMethod
public void showRewardedAd(PluginCall call) {
    // Shows pre-loaded rewarded ad
    // On reward: notifyListeners("onRewardEarned", ...)
    // On dismiss without reward: notifyListeners("onRewardDismissed", ...)
}

@PluginMethod
public void loadInterstitial(PluginCall call) { /* InterstitialAd.load() */ }

@PluginMethod
public void showInterstitial(PluginCall call) { /* Show pre-loaded interstitial */ }

@PluginMethod
public void isAdFree(PluginCall call) { /* Returns whether ads are suppressed */ }
```

> **Ad Unit IDs** are passed in from JS via the `PluginCall` data, so they can be managed in `TargetConfig` or a separate `ad-config.js` file without recompiling Java.

### 4.4 UMP Consent (GDPR/CCPA)

Use **Google's User Messaging Platform (UMP)** SDK which is bundled with `play-services-ads 23.x`:

- Call `UmpPlugin.requestConsentInfoUpdate()` on first launch
- Show consent form if required (EU/EEA/UK users)
- Store consent state; only initialize AdMob after consent is confirmed (or not required)
- UMP call happens **before** `MobileAds.initialize()` inside `initialize()` plugin method

---

## 5. JavaScript Layer

### 5.1 Ad Unit ID Configuration

**New file:** `src/platform/ad-config.js`

```js
/**
 * AdMob Unit IDs
 * Switch between test IDs (dev/editor) and real IDs (release).
 * Test IDs are from Google's official test account — safe to use anytime.
 */
import { TargetConfig } from './target-config.js';

const IS_RELEASE = import.meta.env.VITE_AD_MODE === 'production';

export const AD_UNIT_IDS = {
  banner: IS_RELEASE
    ? 'ca-app-pub-4890313674539327/3352860524'   // REAL banner unit ID
    : 'ca-app-pub-3940256099942544/6300978111',   // Google test banner

  rewarded: IS_RELEASE
    ? 'ca-app-pub-4890313674539327/4091227126'   // REAL rewarded unit ID
    : 'ca-app-pub-3940256099942544/5224354917',   // Google test rewarded

  interstitial: IS_RELEASE
    ? 'ca-app-pub-4890313674539327/2179379650'   // REAL interstitial unit ID
    : 'ca-app-pub-3940256099942544/1033173712',   // Google test interstitial
};
```

> Add `VITE_AD_MODE=production` to your Play Store `.env.playstore` build environment.

### 5.2 PlatformBridge Ad Methods

Add to `src/platform/lifecycle.js`:

```js
// ── AdMob ──────────────────────────────────────────────────────────────────

async initAds(adUnitIds) {
  if (!isCapacitor) return { success: false };
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin) {
      return await window.Capacitor.Plugins.AdMobPlugin.initialize({ adUnitIds });
    }
  } catch (e) { console.warn('[Platform] initAds error:', e); }
  return { success: false };
},

async showBanner(adUnitId) {
  if (!isCapacitor) return;
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin)
      await window.Capacitor.Plugins.AdMobPlugin.showBanner({ adUnitId });
  } catch (e) { console.warn('[Platform] showBanner error:', e); }
},

async hideBanner() {
  if (!isCapacitor) return;
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin)
      await window.Capacitor.Plugins.AdMobPlugin.hideBanner({});
  } catch (e) { console.warn('[Platform] hideBanner error:', e); }
},

async loadRewardedAd(adUnitId) {
  if (!isCapacitor) return { success: false };
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin)
      return await window.Capacitor.Plugins.AdMobPlugin.loadRewardedAd({ adUnitId });
  } catch (e) { console.warn('[Platform] loadRewardedAd error:', e); }
  return { success: false };
},

/**
 * Shows the pre-loaded rewarded ad.
 * Resolves true if user earned reward, false if skipped/failed.
 */
showRewardedAd() {
  return new Promise((resolve) => {
    if (!isCapacitor || !window.Capacitor?.Plugins?.AdMobPlugin) {
      resolve(false);
      return;
    }
    try {
      const plugin = window.Capacitor.Plugins.AdMobPlugin;
      let resolved = false;
      const onReward = plugin.addListener('onRewardEarned', () => {
        if (!resolved) { resolved = true; resolve(true); }
        onReward.remove?.();
        onDismiss.remove?.();
      });
      const onDismiss = plugin.addListener('onRewardDismissed', () => {
        if (!resolved) { resolved = true; resolve(false); }
        onReward.remove?.();
        onDismiss.remove?.();
      });
      plugin.showRewardedAd({});
    } catch (e) {
      console.warn('[Platform] showRewardedAd error:', e);
      resolve(false);
    }
  });
},

async loadInterstitial(adUnitId) {
  if (!isCapacitor) return { success: false };
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin)
      return await window.Capacitor.Plugins.AdMobPlugin.loadInterstitial({ adUnitId });
  } catch (e) { console.warn('[Platform] loadInterstitial error:', e); }
  return { success: false };
},

async showInterstitial() {
  if (!isCapacitor) return;
  try {
    if (window.Capacitor?.Plugins?.AdMobPlugin)
      await window.Capacitor.Plugins.AdMobPlugin.showInterstitial({});
  } catch (e) { console.warn('[Platform] showInterstitial error:', e); }
},
```

### 5.3 AdController.js (New Scene Controller)

**New file:** `src/scenes/ad-controller.js`

```js
import { PlatformBridge } from '../platform/lifecycle.js';
import { TargetConfig } from '../platform/target-config.js';
import { AD_UNIT_IDS } from '../platform/ad-config.js';

const INTERSTITIAL_MIN_LEVEL_GAP = 3; // Show interstitial no more than once every N levels

class AdControllerClass {
  constructor() {
    this._adsEnabled = false;
    this._isPremium = false;          // ← persisted across sessions via localStorage
    this._levelsSinceLastInterstitial = 0;
    this._rewardedReady = false;
    this._interstitialReady = false;
  }

  async init() {
    if (!TargetConfig.features.showAdBanner) return;

    // ── Step 1: Check local premium flag (instant, works offline) ──────────
    const cachedPremium = localStorage.getItem('grid_leap_premium') === 'true';
    if (cachedPremium) {
      this._isPremium = true;
      this._adsEnabled = false;
      return; // premium user — skip all ad init
    }

    // ── Step 2: Verify with Play Billing (authoritative source) ────────────
    // Runs in background; catches cases where purchase was made on another device
    // or cache is stale. Does NOT block UI.
    if (TargetConfig.isPlayStore) {
      PlatformBridge.checkRemoveAdsPurchased().then((isPurchased) => {
        if (isPurchased && !this._isPremium) {
          this._grantPremium();   // silently upgrade mid-session if billing confirms
        }
      }).catch(() => { /* network unavailable — local cache already handled above */ });
    }

    // ── Step 3: Non-premium — initialize ads ──────────────────────────────
    this._adsEnabled = true;

    if (TargetConfig.isPlayStore) {
      await PlatformBridge.initAds(AD_UNIT_IDS);
      await this._showBanner();
      await this._preloadRewarded();
      await this._preloadInterstitial();
    }
  }

  /** Returns true if this user has purchased Remove Ads. Check this anywhere in the app. */
  isPremiumUser() {
    return this._isPremium;
  }

  isAdsEnabled() {
    return this._adsEnabled && !this._isPremium;
  }

  /** Internal: Grant premium status, persist flag, tear down all active ads immediately. */
  _grantPremium() {
    this._isPremium = true;
    this._adsEnabled = false;
    localStorage.setItem('grid_leap_premium', 'true');
    PlatformBridge.hideBanner().catch(() => {});
    document.getElementById('adBannerSlot')?.classList.add('hidden');
    document.body.classList.remove('ads-active');
  }

  /** Public: Call this after a successful Remove Ads purchase or restore. */
  async suppressAds() {
    this._grantPremium();
  }

  async _showBanner() {
    if (!this.isAdsEnabled()) return;
    await PlatformBridge.showBanner(AD_UNIT_IDS.banner);
    document.getElementById('adBannerSlot')?.classList.remove('hidden');
    document.body.classList.add('ads-active');
  }

  async _preloadRewarded() {
    const res = await PlatformBridge.loadRewardedAd(AD_UNIT_IDS.rewarded);
    this._rewardedReady = res?.success === true;
  }

  async _preloadInterstitial() {
    const res = await PlatformBridge.loadInterstitial(AD_UNIT_IDS.interstitial);
    this._interstitialReady = res?.success === true;
  }

  /**
   * Call when player taps the hint button.
   * Returns true if reward was earned (hint should be shown).
   * Returns false if ad was skipped/unavailable (hint blocked).
   */
  async requestHintReward() {
    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) {
      // Non-Play Store OR premium user: hints are free
      return true;
    }
    if (!this._rewardedReady) {
      console.warn('[AdController] Rewarded ad not ready');
      return false;
    }
    const earned = await PlatformBridge.showRewardedAd();
    this._rewardedReady = false;
    this._preloadRewarded();
    return earned;
  }

  /**
   * Call on each level completion.
   * Shows interstitial if frequency cap is satisfied.
   */
  async onLevelCompleted() {
    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) return;
    this._levelsSinceLastInterstitial++;
    if (this._levelsSinceLastInterstitial >= INTERSTITIAL_MIN_LEVEL_GAP && this._interstitialReady) {
      this._levelsSinceLastInterstitial = 0;
      await PlatformBridge.showInterstitial();
      this._interstitialReady = false;
      this._preloadInterstitial();
    }
  }

  async onPause() {
    // Banner stays visible on pause (AdMob handles visibility)
  }

  async onResume() {
    // Nothing required — AdMob handles resume state
  }
}

export const AdController = new AdControllerClass();
```

---

## 6. UI Changes

### 6.1 Banner Ad Slot (index.html)

Add a `#adBannerSlot` div at the bottom of `<div id="app">`:

```html
<!-- Banner Ad Slot — Play Store only; hidden on Web/Editor via JS -->
<div id="adBannerSlot" class="ad-banner-slot hidden" aria-hidden="true"></div>
```

> On Play Store (Capacitor), AdMob renders the native banner **above** the WebView by adjusting the WebView frame. The `#adBannerSlot` is a **CSS placeholder** that reserves the correct height so the game layout doesn't overlap the native banner. It does **not** contain actual ad content.

### 6.2 CSS for Banner Slot

Add to `src/styles/main.css`:

```css
/* ── Ad Banner Slot ─────────────────────────────────────────── */
.ad-banner-slot {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--ad-banner-height-mobile);   /* 56px already defined in :root */
  z-index: 10;
  pointer-events: none;
  background: transparent;
}

@media (min-width: 600px) {
  .ad-banner-slot {
    height: var(--ad-banner-height-tablet);  /* 90px already defined in :root */
  }
}

.ad-banner-slot.hidden {
  display: none;
}
```

> The existing CSS variables `--ad-banner-height-mobile: 56px` and `--ad-banner-height-tablet: 90px` are already defined in `:root`. ✅

### 6.3 Layout Padding

When the banner is active (Play Store), the main app container needs bottom padding to prevent content from hiding behind the native banner:

```css
/* Applied via JS: document.getElementById('app').style.paddingBottom = ... */
/* OR a CSS class toggled by AdController */

body.ads-active #app,
body.ads-active .game-scene {
  padding-bottom: calc(var(--ad-banner-height-mobile) + env(safe-area-inset-bottom));
}

@media (min-width: 600px) {
  body.ads-active #app,
  body.ads-active .game-scene {
    padding-bottom: calc(var(--ad-banner-height-tablet) + env(safe-area-inset-bottom));
  }
}
```

`AdController._showBanner()` adds `ads-active` to `document.body`; `_grantPremium()` removes it.

---

## 7. Hint Button Integration

### 7.1 Current Hint Flow

The hint button lives in the gameplay scene. Find the hint handler (search `hint` in `game-renderer.js` / `main.js`) — it currently calls `toggleSolutionPath()` or similar directly.

### 7.2 New Rewarded Ad Gate

```js
// In hint button click handler (main.js or game-renderer.js):
hintBtn.addEventListener('click', async () => {
  if (AdController.isAdsEnabled()) {
    const earned = await AdController.requestHintReward();
    if (!earned) {
      // Show toast: "Watch the full ad to use hint"
      showToast('Watch the ad to unlock a hint');
      return;
    }
  }
  // Existing hint logic
  toggleSolutionPath();
  AchievementManager.handle('HINT_USED', {});
});
```

> On **Web / Editor / Itch.io / premium users**, `AdController.isAdsEnabled()` returns `false`, so hints are free with no ad gate.

---

## 8. Interstitial Integration

### 8.1 Trigger Point

The best UX trigger is **after the win modal closes** (player has completed level, celebrated — then the ad appears before the next level loads):

```js
// In main.js — inside the level completion / "Next Level" handler:
async function handleNextLevel() {
  await AdController.onLevelCompleted();  // May show interstitial (awaits close)
  loadNextLevel();
}
```

### 8.2 Frequency Rules

- Minimum **3 levels** between interstitials (already in `AdController`)
- **Never** on the first level (counter starts at 0)
- **Never** after a daily challenge completion (daily mode has its own special win screen)
- **Never** for premium users (`isAdsEnabled()` returns `false`)

---

## 9. Remove Ads IAP — Premium User Flow

> [!IMPORTANT]
> The plan uses a **two-layer approach** to track premium status. This is the correct industry pattern:
> 1. **Local `localStorage` flag** (`grid_leap_premium`) — instant read, works offline, survives app restarts.
> 2. **Play Billing verification** (`BillingPlugin.isPurchased()`) — authoritative server-side check, runs in background after boot.

### Why Two Layers?

| Scenario | Local flag | Play Billing call | Result |
|---|---|---|---|
| First boot after purchase | ✅ set | ✅ confirms | Ad-free immediately |
| Subsequent boot (offline) | ✅ hit | ❌ unreachable | Ad-free ✅ (local wins) |
| Fresh install / new device | ❌ missing | ✅ confirms via restore | Ads shown briefly then suppressed |
| Cache tampered (flag deleted) | ❌ missing | ✅ re-confirms | Re-sets flag, ad-free |
| Never purchased | ❌ absent | ❌ not purchased | Ads shown normally |

### Storage Key

```
localStorage key: "grid_leap_premium"
Value:            "true"  (string — premium, no ads)
                  absent  (default — ads shown)
```

This key lives alongside `grid_leap_achievements_v1` and other existing storage keys.

### Full Purchase Flow

```js
// In settings screen — "Remove Ads" button handler:
async function onPurchaseRemoveAds() {
  const result = await PlatformBridge.purchaseRemoveAds();
  if (result.success) {
    await AdController.suppressAds();    // sets isPremium=true, persists flag, hides banner
    showToast('Ads removed! Thank you for supporting Grid Leap. 🎉');
    // Optionally: refresh settings UI to hide "Remove Ads" button
    settingsController.refreshPremiumState();
  } else {
    showToast('Purchase could not be completed. Please try again.');
  }
}

// Restore purchases (run on first launch or from settings "Restore Purchases"):
async function onRestorePurchases() {
  const restored = await PlatformBridge.restorePurchases();
  if (restored) {
    await AdController.suppressAds();
    showToast('Purchases restored. Welcome back, premium player!');
  } else {
    showToast('No purchases found to restore.');
  }
}
```

### Checking Premium Status Anywhere in the App

Since `AdController` is a singleton, any part of the codebase can check premium status synchronously — no async calls needed after boot:

```js
import { AdController } from './scenes/ad-controller.js';

// In settings controller — hide "Remove Ads" button for premium users:
if (AdController.isPremiumUser()) {
  removeAdsBtnEl.classList.add('hidden');
  premiumBadgeEl.classList.remove('hidden');  // e.g., show "✓ Ad-Free" badge
}

// In hint handler — skip ad gate for premium:
// (already handled by AdController.isAdsEnabled() returning false)
```

### Settings UI Recommendation

In the Settings panel, show one of two states:

| User State | Button shown |
|---|---|
| Free user | "🚫 Remove Ads — ₹XX" (tappable, triggers purchase) |
| Premium user | "✓ Ad-Free — Thank you!" (disabled / badge style, no tap action) |

The `settingsController.refreshPremiumState()` call (above) should toggle these on purchase/restore.

---


## 10. main.js Integration

```js
// Imports (add at top)
import { AdController } from './scenes/ad-controller.js';

// In the boot/init block (alongside AchievementManager.init(), UpdateController.init()):
await AdController.init();

// In onPause:
AdController.onPause();

// In onResume:
AdController.onResume();
```

---

## 11. Web / Itch.io / Desktop / Editor Platform Strategy

> All platform-specific ad strategies are fully detailed in **Section 1a** above. Below is a quick reference summary.

| Platform | Strategy | Reference |
|---|---|---|
| **Web (Netlify)** | Google AdSense — browser-served banner only; Phase 2 after Play Store launch | Section 1a → Web |
| **Itch.io APK** | Unity Ads (primary) — Rewarded + Interstitial only; no banner recommended | Section 1a → Itch.io |
| **Desktop (Tauri)** | **No ads** — freemium / one-time purchase / donation prompt | Section 1a → Desktop |
| **Editor** | **No ads** — dev tool; all ad code suppressed via `TargetConfig.isEditor` | — |

---

## 12. Editor Platform

**No ads.** `TargetConfig.isEditor` always suppresses everything. The editor build is an internal dev tool. No changes needed.

---


## 13. Implementation Phases

### Phase 1 — Android Plugin & Banner (Foundation)
1. Add `play-services-ads:23.5.0` to `android/app/build.gradle`
2. Add `APPLICATION_ID` meta-data to `AndroidManifest.xml`
3. Create `AdMobPlugin.java` (initialize + banner show/hide)
4. Add `PlatformBridge` banner methods to `lifecycle.js`
5. Create `src/platform/ad-config.js` with test IDs
6. Create `src/scenes/ad-controller.js` (init + banner only)
7. Add `#adBannerSlot` to `index.html`
8. Add CSS for banner slot + `body.ads-active` padding
9. Wire `AdController.init()` in `main.js`
10. **Test on device with test Ad Unit IDs**

### Phase 2 — Rewarded Ads (Hint Gate)
1. Add `loadRewardedAd()` + `showRewardedAd()` to `AdMobPlugin.java`
2. Add `PlatformBridge` rewarded methods + listener pattern to `lifecycle.js`
3. Implement `AdController.requestHintReward()` and `_preloadRewarded()`
4. Gate hint button with rewarded ad flow
5. Add "Watch ad for hint" UX toast/prompt
6. **Test full reward flow on device**

### Phase 3 — Interstitial (Between Levels)
1. Add `loadInterstitial()` + `showInterstitial()` to `AdMobPlugin.java`
2. Add `PlatformBridge` interstitial methods to `lifecycle.js`
3. Implement `AdController.onLevelCompleted()` with frequency cap
4. Wire into `handleNextLevel()` in `main.js`
5. **Test frequency capping behavior**

### Phase 4 — UMP Consent (GDPR/CCPA)
1. Implement UMP consent request inside `AdMobPlugin.java` `initialize()`
2. Only call `MobileAds.initialize()` after consent confirmed
3. Test with EU VPN to verify consent form appears
4. **Required before production release to EEA/UK markets**

### Phase 5 — Production
1. Create AdMob account → Create App → Get real App ID and Ad Unit IDs
2. Replace test IDs in `ad-config.js` with real IDs (gated by `VITE_AD_MODE=production`)
3. Set `VITE_AD_MODE=production` in Play Store build pipeline
4. Submit to Play Store; AdMob app review (typically 24–48 hrs after first impression)

---

## 14. Environment Variables

Add to your build system (`.env.playstore`, Vite config, or CI):

```bash
# .env.playstore
VITE_APP_TARGET=playstore
VITE_AD_MODE=production          # Use real Ad Unit IDs
```

```bash
# .env.development (or .env.editor)
VITE_APP_TARGET=editor
VITE_AD_MODE=test               # Use Google test Ad Unit IDs
```

---

## 15. Privacy Policy Update

The current `docs/PRIVACY_POLICY.txt` must be updated to disclose:

1. **Ad serving**: "We use Google AdMob to serve advertisements. AdMob may use device identifiers and browsing data to serve personalized ads."
2. **Android Advertising ID**: "We may collect your Android Advertising ID (AAID) for ad personalization purposes."
3. **GDPR compliance**: "Users in the EU/EEA will be shown a consent prompt before personalized ads are served."
4. **Opt-out**: Reference to Google's ad personalization opt-out and Android Ad ID reset options.

---

## 16. File Change Summary

| File | Action | Purpose |
|---|---|---|
| `android/app/build.gradle` | Add dependency | `play-services-ads:23.5.0` |
| `android/app/src/main/AndroidManifest.xml` | Add `<meta-data>` | AdMob App ID |
| `android/app/src/main/java/.../AdMobPlugin.java` | **Create** | Capacitor native plugin |
| `src/platform/ad-config.js` | **Create** | Test + production Ad Unit IDs |
| `src/platform/lifecycle.js` | Add methods | `initAds`, `showBanner`, `hideBanner`, `loadRewardedAd`, `showRewardedAd`, `loadInterstitial`, `showInterstitial` |
| `src/scenes/ad-controller.js` | **Create** | JS ad orchestration layer |
| `src/main.js` | Modify | Import + init `AdController`, lifecycle hooks |
| `index.html` | Modify | Add `#adBannerSlot` |
| `src/styles/main.css` | Modify | Banner slot CSS, `body.ads-active` padding |
| `src/platform/target-config.js` | Optional | Set `showAdBanner: false` for `web` if deferring web ads |
| `docs/PRIVACY_POLICY.txt` | Update | AdMob + AAID disclosure |

---

## 17. Testing Checklist

- [ ] Banner loads and displays at bottom without overlapping game content
- [ ] Banner respects safe area insets on notched devices
- [ ] Banner disappears when Remove Ads is purchased
- [ ] Rewarded ad loads before first hint use
- [ ] Hint button is blocked if rewarded ad not yet loaded
- [ ] Reward correctly granted / denied based on ad completion
- [ ] Next rewarded ad pre-loads after each show
- [ ] Interstitial shown only after 3+ levels
- [ ] Interstitial never shown on first-ever level
- [ ] Interstitial not shown in Daily Challenge mode
- [ ] UMP consent form appears on fresh install (EU locale)
- [ ] Ads fully suppressed when `TargetConfig.isEditor === true`
- [ ] Ads fully suppressed on Web build
- [ ] Test Ad Unit IDs used in debug/editor builds
- [ ] Production Ad Unit IDs used in `VITE_AD_MODE=production` build

---

*Grid Leap · Olai Digital Studios · Dhinesh*

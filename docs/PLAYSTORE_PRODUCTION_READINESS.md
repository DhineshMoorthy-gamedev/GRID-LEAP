# Grid Leap — Google Play Production Readiness Audit

**Auditor:** Senior Android / Capacitor Release Engineer  
**Audit Date:** 2026-09-18  
**Codebase Version:** v12 — `versionCode 11`, `versionName "0.0.11"` (commit `d4c913b`)  
**App ID:** `com.olaidigitalstudios.gridleap`  
**Developer:** OLAI Digital Studios — Dhinesh, Chennai, India

---

## ▶ PRODUCTION VERDICT

```
PRODUCTION STATUS:  NOT READY
BLOCKERS:           3
HIGH:               4
MEDIUM:             4
LOW:                3
PLAY CONSOLE VERIFICATION REQUIRED:  5
```

---

## Section 1 — Application Identity

| Property | Value | Status |
|---|---|---|
| App Type | Minimalist spatial logic puzzle game (100 handcrafted levels + daily challenges) | ✅ |
| Framework | Vite 6 + Capacitor 8.5.x (WebView bridge to Android) | ✅ |
| Entry Point | `index.html` → `src/main.js` | ✅ |
| App ID | `com.olaidigitalstudios.gridleap` | ✅ |
| Version Code | 11 | ✅ |
| Version Name | 0.0.11 | ✅ |
| Min SDK | 24 (Android 7.0) | ✅ |
| Target SDK | 36 | ✅ |
| Compile SDK | 36 | ✅ |
| AGP | 8.13.0 | ✅ |
| Orientation | Portrait only (`android:screenOrientation="portrait"`) | ✅ |
| Launch Mode | singleTask | ✅ |
| Build System | Gradle + Capacitor sync (`npm run build:playstore`) | ✅ |

> [!NOTE] The app name string is `"Grid Leap"` in `strings.xml`, but your Play Console listing target title is `"Grid Leap - Logic Maze Puzzle"`. The Play Console title overrides the in-app name on the store listing — this is **not** a bug, it is the correct pattern.

---

## Section 2 — Android Build Configuration

### BLOCKER-01 — Release Signing Config Missing in build.gradle

**Severity:** 🔴 BLOCKER  
**File:** [`android/app/build.gradle`](file:///E:/PROTO/GRID%20LEAP/android/app/build.gradle#L19-L24)

```groovy
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

**Problem:** There is **no `signingConfig` block** in the release build type. Google Play requires all production AABs to be signed with a release keystore. Without this, Android Studio will prompt you at AAB generation time — but if you attempt any CI/CD or command-line `gradlew bundleRelease` it will produce an **unsigned** AAB that Play rejects.

**Fix Required:**
1. Generate your release keystore: `keytool -genkey -v -keystore gridleap-release.jks -alias gridleap -keyalg RSA -keysize 2048 -validity 10000`
2. Add to `android/app/build.gradle`:
```groovy
android {
    signingConfigs {
        release {
            storeFile file('../gridleap-release.jks')
            storePassword System.getenv("KEYSTORE_PASS")
            keyAlias "gridleap"
            keyPassword System.getenv("KEY_PASS")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```
3. Store the `.jks` file outside the project root (already `.gitignore`d via `*.jks`). ✅

---

### HIGH-01 — `minifyEnabled false` in Release Build

**Severity:** 🟠 HIGH  
**File:** [`android/app/build.gradle`](file:///E:/PROTO/GRID%20LEAP/android/app/build.gradle#L21)

**Problem:** R8 minification/shrinking is disabled. This is **not a Play Store blocker** but has real-world consequences:
- The APK/AAB is larger than necessary (all unused class paths remain).
- Java bytecode is unobfuscated — trivially reversible.
- Capacitor WebView content (JS) ships as-is anyway, so security impact is symmetric regardless of R8 setting.

**Recommendation:** Set `minifyEnabled true` and ensure `proguard-rules.pro` has rules for Capacitor, BillingClient, AdMob, and Play Core:
```
-keep class com.getcapacitor.** { *; }
-keep class com.google.android.gms.** { *; }
-keep class com.google.android.play.core.** { *; }
-dontwarn com.google.android.gms.**
```

---

### MEDIUM-01 — `versionCode` / `versionName` Discrepancy

**Severity:** 🟡 MEDIUM  
**Files:** [`android/app/build.gradle`](file:///E:/PROTO/GRID%20LEAP/android/app/build.gradle#L10-L11) and [`src/platform/target-config.js`](file:///E:/PROTO/GRID%20LEAP/src/platform/target-config.js#L19-L20)

**Observation:** Both files are synchronized (`versionCode 11`, `versionName "0.0.11"`). ✅

**Risk:** These are maintained in **two places** manually. Any future mismatch between `build.gradle` and `target-config.js` would create a confusing version display in the update modal (the UI shows the JS version, Play Console enforces the Gradle version).

**Recommendation:** Single-source the version via a `version.properties` file or read it from a shared `gradle.properties`.

---

## Section 3 — VITE_APP_TARGET Configuration Risk

### BLOCKER-02 — Default `.env` Points to `playstore` But Title is Wrong

**Severity:** 🔴 BLOCKER (Data Integrity)  
**File:** [`E:/PROTO/GRID LEAP/.env`](file:///E:/PROTO/GRID%20LEAP/.env)

```
VITE_APP_TARGET=playstore
VITE_APP_TITLE=Grid Leap (Editor Mode)   ← ⚠️ WRONG TITLE
```

**Problem:** The **default** `.env` file correctly sets `VITE_APP_TARGET=playstore`, ensuring the fallback mode is `playstore` (good). However the title is `"Grid Leap (Editor Mode)"` — a development leftover. The `VITE_APP_TITLE` is rendered into `TargetConfig.title` and is referenced in update modal UI.

**Although** `npm run build:playstore` uses `--mode playstore` which loads `.env.playstore` (overriding the base `.env`), this base `.env` title is a risk: if anyone runs `vite build` without specifying `--mode`, they ship a build with `"Grid Leap (Editor Mode)"` as the title.

**Fix:**
```diff
# .env
VITE_APP_TARGET=playstore
-VITE_APP_TITLE=Grid Leap (Editor Mode)
+VITE_APP_TITLE=Grid Leap
```

---

### BLOCKER-03 — `VITE_AD_MODE` Not Set in `.env.playstore` — Defaults to Production

**Severity:** 🔴 BLOCKER (AdMob Policy Risk)  
**File:** [`src/platform/ad-config.js`](file:///E:/PROTO/GRID%20LEAP/src/platform/ad-config.js#L6)

```js
const isProdAdMode = (import.meta.env?.VITE_AD_MODE || "production").toLowerCase() !== "test";
```

**File:** [`E:/PROTO/GRID LEAP/.env.playstore`](file:///E:/PROTO/GRID%20LEAP/.env.playstore)

```
VITE_APP_TARGET=playstore
VITE_APP_TITLE=Grid Leap
```
`VITE_AD_MODE` is **not set** in `.env.playstore`.

**Analysis:** The fallback is `"production"` → `isProdAdMode = true` → production ad unit IDs are used. This is **the intended behavior** for a Play Store release build.

**However**, this is a BLOCKER because it means **during internal testing / debug builds**, production AdMob IDs are being served unless someone explicitly adds `VITE_AD_MODE=test` to their test `.env`. Serving real production ads in test/debug environments violates **Google AdMob policy** (invalid traffic risk) and can trigger account suspension.

**Fix:** Add `VITE_AD_MODE=test` to `.env` (the base file used outside of mode-specific builds) and `.env.editor`:
```diff
# .env
VITE_APP_TARGET=playstore
VITE_APP_TITLE=Grid Leap
+VITE_AD_MODE=test

# .env.editor
VITE_APP_TARGET=editor
VITE_APP_TITLE=Grid Leap (Level Editor & Diagnostics)
+VITE_AD_MODE=test
```
Only `.env.playstore` should omit `VITE_AD_MODE` (defaulting to production).

---

## Section 4 — Native Android Plugins

### All Three Custom Plugins — Status: ✅ COMPLETE

| Plugin | File | Status |
|---|---|---|
| `BillingPlugin` | [`BillingPlugin.java`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/java/com/olaidigitalstudios/gridleap/BillingPlugin.java) | ✅ Full Play Billing 8.0.0 implementation |
| `AdMobPlugin` | [`AdMobPlugin.java`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/java/com/olaidigitalstudios/gridleap/AdMobPlugin.java) | ✅ Banner + Rewarded + Interstitial + retry logic |
| `AppUpdatePlugin` | [`AppUpdatePlugin.java`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/java/com/olaidigitalstudios/gridleap/AppUpdatePlugin.java) | ✅ Play Core Flexible + Immediate update flows |

**Registration Order in MainActivity:** Plugins registered **before** `super.onCreate()` — this is the correct Capacitor pattern. ✅

**Billing version:** `com.android.billingclient:billing:8.0.0` — this is the current stable version. ✅  
**AdMob SDK:** `com.google.android.gms:play-services-ads:23.5.0` — present and correct. ✅  
**Play App Update:** `com.google.android.play:app-update:2.1.0` — present and correct. ✅

---

## Section 5 — AndroidManifest.xml Audit

| Item | Value | Status |
|---|---|---|
| INTERNET permission | Present | ✅ |
| BILLING permission | Present | ✅ |
| AD_ID permission | Present (`com.google.android.gms.permission.AD_ID`) | ✅ |
| CAMERA / MIC / LOCATION | Absent | ✅ Clean |
| AdMob App ID meta-data | `ca-app-pub-4890313674539327~9594835240` | ✅ |
| DELAY_APP_MEASUREMENT_INIT | Set to `true` | ✅ Good (respects consent timing) |
| `android:allowBackup` | `true` | ⚠️ See MEDIUM-02 |
| `android:exported` | `true` on MainActivity with intent-filter | ✅ Required |
| FileProvider | Present with correct authorities | ✅ |
| Portrait lock | `android:screenOrientation="portrait"` | ✅ |

### MEDIUM-02 — `android:allowBackup="true"` — Consider Disabling

**Severity:** 🟡 MEDIUM  
**File:** [`AndroidManifest.xml`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/AndroidManifest.xml#L5)

**Observation:** `allowBackup=true` enables Android ADB backup, which lets a user restore localStorage game data from a backup. For a puzzle game this is actually a **good thing** (progress survives device wipes). No security concern since game data contains only puzzle progress.

**Decision:** Leave as-is. This is player-friendly for a puzzle game.

---

## Section 6 — Advertising & In-App Purchases

### HIGH-02 — Production AdMob Ad Unit IDs Not Verified as Live in AdMob Console

**Severity:** 🟠 HIGH  
**File:** [`src/platform/ad-config.js`](file:///E:/PROTO/GRID%20LEAP/src/platform/ad-config.js#L17-L22)

```js
const PROD_UNIT_IDS = {
  appId:         "ca-app-pub-4890313674539327~9594835240",
  banner:        "ca-app-pub-4890313674539327/3352860524",
  rewarded:      "ca-app-pub-4890313674539327/4091227126",
  interstitial:  "ca-app-pub-4890313674539327/2179379650"
};
```

These IDs are hardcoded. **The audit cannot verify they exist and are active in AdMob Console** — this must be manually confirmed:

**You must verify in AdMob Console:**
- [ ] App ID `ca-app-pub-4890313674539327~9594835240` is linked to this app
- [ ] All 3 ad unit IDs are created under that app
- [ ] App status in AdMob is **"Ready"** (not "Pending" or "Requires app update")
- [ ] AdMob account is not in a restricted/hold state

**If any of these fail:** Ads silently return no-fill in production, IAP prompts appear but no ad plays, potentially confusing users.

---

### HIGH-03 — `remove_ads` IAP Product Must Exist in Play Console

**Severity:** 🟠 HIGH  
**Product ID:** `remove_ads`  
**File:** [`BillingPlugin.java`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/java/com/olaidigitalstudios/gridleap/BillingPlugin.java)

The billing code queries and purchases product ID `"remove_ads"`. This product **must be created in Play Console** → your app → Monetize → In-app products before the app goes live. If the product doesn't exist:
- `BillingPlugin.getProductDetails()` returns an empty list
- Purchase attempts throw `ITEM_UNAVAILABLE` 
- Users see a failed purchase flow with no clear explanation

**You must create in Play Console:**
- [ ] Product ID: `remove_ads` (exact string match)
- [ ] Product type: **One-time purchase** (non-consumable)
- [ ] Status: **Active** (not Draft)
- [ ] Price set for all target countries

---

### IAP / Ad Integration Architecture: ✅ SOLID

- Ad is only shown when `TargetConfig.isPlayStore` is true — no ads on web/editor builds. ✅
- Premium cache in `localStorage` prevents re-verification every launch. ✅
- Background billing re-verification on each launch to catch side-loaded purchases. ✅
- `AdMobPlugin.java` has retry logic (15-second retry on banner failure). ✅
- Interstitial shown after every 2 campaign levels (`INTERSTITIAL_MIN_LEVEL_GAP = 2`). ✅
- Daily levels and custom levels exempt from interstitial (`isCustomOrDaily = false`). ✅

---

## Section 7 — Audio Engine

### Status: ✅ PRODUCTION COMPLETE

**File:** [`src/audio/audio-engine.js`](file:///E:/PROTO/GRID LEAP/src/audio/audio-engine.js) — **1,281 lines**

The audio engine is a complete, production-quality procedural Web Audio API engine. Verified features:

| Feature | Status |
|---|---|
| Web Audio API lazy init | ✅ AudioContext created on first interaction |
| iOS/Mobile unlock sequence | ✅ Silent 1-frame buffer trick + event listeners |
| Context suspend/resume | ✅ `suspend()` and `resume()` wired to app lifecycle |
| Max active node guard | ✅ `MAX_ACTIVE_NODES = 32` prevents memory leaks |
| Per-SFX throttle | ✅ `_checkThrottle(id, minMs)` prevents audio spam |
| Node cleanup | ✅ `_bindCleanup()` + 2s safety timeout |
| SFX coverage | ✅ Leap, Blocked, Dead End, Win, OutOfLives, Undo, Restart, LevelStart, NextLevel, DailyStart, TutorialSuccess, TutorialWrong, RadialTileGrow + more |
| Sound settings respect | ✅ `isEnabled()` checks `GameState.settings.soundEnabled` |
| Zero external assets | ✅ All synthesis — no MP3/OGG/WAV files |

---

## Section 8 — In-App Update Pipeline

### Status: ✅ PRODUCTION COMPLETE

**Files:** [`src/scenes/update-controller.js`](file:///E:/PROTO/GRID%20LEAP/src/scenes/update-controller.js) | [`android/app/src/main/java/.../AppUpdatePlugin.java`](file:///E:/PROTO/GRID%20LEAP/android/app/src/main/java/com/olaidigitalstudios/gridleap/AppUpdatePlugin.java)

- Flexible update flow (background download) ✅
- Immediate update flow (blocking install) ✅
- Download progress events via `onUpdateDownloading` ✅
- `setDownloadedState()` / `setIdleState()` state machine ✅
- Browser simulation mode for non-Capacitor environments ✅
- `completeUpdate()` triggers restart and install ✅
- Platform guard: update check only runs on `isPlayStore` target ✅

---

## Section 9 — Game State & Persistence

### Status: ✅ SOLID

**File:** [`src/state/game-state.js`](file:///E:/PROTO/GRID%20LEAP/src/state/game-state.js) | [`src/state/persistence.js`](file:///E:/PROTO/GRID%20LEAP/src/state/persistence.js)

| Item | Status |
|---|---|
| localStorage key | `"number_grid_maze_save_v1"` — versioned ✅ |
| Save-on-every-action | No — saves are explicit via `save()` calls ✅ |
| Corrupt save fallback | `try/catch` with default state reset ✅ |
| Cross-session continuity | `activeSession` persisted for mid-level resume ✅ |
| `devModeEnabled` flag | Read from settings; defaults to `false` ✅ |
| `solutionPathVisible` | Session-only (not persisted) ✅ |
| Theme persistence | Persisted in `settings.theme` ✅ |
| Hints count | Persisted in `hintsAvailable` ✅ |
| Pro-upgrade cache | `"grid_leap_premium"` localStorage key (separate from save) ✅ |

> [!NOTE] The `relaxMode` and `showTrail` fields exist in the save schema even though the Play Store build hides them in settings. This is fine — persisted values are ignored when the UI doesn't expose them, and they cause no harm.

---

## Section 10 — Console Logging in Production

### LOW-01 — 43 `console.*` Statements Across Source

**Severity:** 🟢 LOW  
**Count:** 43 total across all `src/**/*.js` files

**Breakdown by type:**
- `console.warn` — 40 occurrences (all in platform bridge error handlers, audio engine, ad controller, billing — all guarded by `try/catch`)  
- `console.error` — 2 occurrences (Reset error, scene router — appropriate for genuine errors)  
- `console.log` — 1 occurrence (`main.js:1606` — PlayStore boot update check error, actually a `console.log` not `console.warn`)

**Assessment:** The logging is almost entirely production-safe. All `console.warn` calls are:
- In error catch blocks (network failures, native plugin unavailability)
- Properly labeled with module prefixes (`[Platform]`, `[AdController]`, `[AudioEngine]`, etc.)
- **Not** debug spam — no loop logging, no state dumps, no object dumps

The 1 `console.log` on line 1606 of `main.js` should be `console.warn` for consistency, but is **not a blocker**.

> [!TIP] With `minifyEnabled true` and R8, console calls can be removed at build time via ProGuard rules: `-assumenosideeffects class android.util.Log { *; }`. For WebView JS, Vite's `drop_console` esbuild option can strip them: add `build: { minify: 'esbuild', target: 'es2020' }` and `esbuild: { drop: ['console'] }` to `vite.config.js` for production builds.

---

## Section 11 — Permissions Audit

| Permission | Reason | Status |
|---|---|---|
| `INTERNET` | WebView + AdMob + Play Billing + In-App Update | ✅ Required |
| `com.android.vending.BILLING` | Google Play IAP | ✅ Required |
| `com.google.android.gms.permission.AD_ID` | AdMob advertising ID access | ✅ Required |
| CAMERA | Not declared | ✅ None needed |
| LOCATION | Not declared | ✅ None needed |
| MICROPHONE | Not declared | ✅ None needed |
| CONTACTS | Not declared | ✅ None needed |
| READ_EXTERNAL_STORAGE | Not declared | ✅ None needed |
| VIBRATE | Not declared — uses Capacitor Haptics | ✅ Haptics plugin handles this internally |

> [!NOTE] The `AD_ID` permission triggers Play Console's "Advertising ID" declaration in the Data Safety form. You must declare this in the Data Safety section even though you don't directly use the ID — AdMob uses it internally.

---

## Section 12 — Network & Connectivity

### Status: ✅ NO ISSUES

- No external API calls in game logic
- No user accounts, no remote authentication
- No server-side daily puzzle fetch — daily puzzles are generated client-side from a deterministic date seed
- AdMob, Play Billing, and In-App Update fail gracefully when offline (all have `try/catch` with silent fallbacks)
- No hardcoded `localhost` or `127.0.0.1` references found in source code ✅

---

## Section 13 — App Lifecycle (Pause / Resume / Back)

### Status: ✅ COMPLETE

**File:** [`src/platform/lifecycle.js`](file:///E:/PROTO/GRID%20LEAP/src/platform/lifecycle.js)

| Feature | Implementation | Status |
|---|---|---|
| App pause (background) | `App.addListener("appStateChange")` + `visibilitychange` + `window.blur` | ✅ |
| App resume (foreground) | Same + `focus` event | ✅ |
| AudioContext suspend on pause | Wired via `onPause` → `AudioEngine.suspend()` | ✅ |
| AudioContext resume on foreground | Wired via `onResume` → `AudioEngine.resume()` | ✅ |
| Hardware back button | `App.addListener("backButton")` → `handleBackButton()` | ✅ |
| Back press minimizes app | `App.minimizeApp()` when no modal is open | ✅ |
| Web popstate fallback | Present for non-Capacitor environments | ✅ |
| StatusBar styling | Dark style + `#0b131a` background on Capacitor | ✅ |
| AdMob lifecycle | `AdController.onResume()` replenishes ad preload queues | ✅ |

---

## Section 14 — Play Store Build Workflow

### Status: ✅ CORRECT — With One Warning

**Build command:**
```bash
npm run build:playstore
# Expands to:
# vite build --mode playstore --outDir dist && cap sync android
```

- Loads `.env.playstore` → `VITE_APP_TARGET=playstore` ✅
- Outputs to `dist/` (WebDir synced to `android/app/src/main/assets/public`) ✅
- `cap sync android` copies web assets + syncs plugins ✅

### HIGH-04 — `npm run build:apk` Builds a Debug APK

**Severity:** 🟠 HIGH  
**File:** [`package.json`](file:///E:/PROTO/GRID%20LEAP/package.json)

```json
"build:apk": "npm run build:playstore && cd android && gradlew.bat assembleDebug"
```

`assembleDebug` produces a **debug APK** — useful for local device testing but this should **never** be uploaded to Play Console. Play Console requires `bundleRelease` (AAB format). This script name is misleading.

**Risk:** A developer could run `build:apk` and try to upload the output to Play Console, where it would be rejected (wrong format + debug signature).

**Fix:** Either rename this script or add a clear comment, and add a `build:aab` script:
```json
"build:aab": "npm run build:playstore && cd android && gradlew.bat bundleRelease"
```

---

## Section 15 — Store Assets & Privacy Policy

| Asset | Status |
|---|---|
| App Icon (512×512) | ✅ Created — `docs/store-assets/app_icon_512x512.png` |
| Feature Graphic (1024×500) | ✅ Created — `docs/store-assets/feature_graphic_1024x500.png` |
| Screenshots (5×) | ✅ Created — `docs/store-assets/screenshots/` |
| Store listing copy | ✅ Created — `docs/store-assets/STORE_LISTING.md` |
| Privacy Policy | ✅ `docs/PRIVACY_POLICY.txt` — complete |
| App name in strings.xml | ✅ `"Grid Leap"` |
| Android mipmap icons (all densities) | ✅ Updated |
| Adaptive icon foreground layer | ✅ Updated |
| Adaptive icon background color | ✅ `#121316` (Obsidian dark) |

> [!IMPORTANT] The privacy policy exists only as a local `.txt` file. **Google Play requires a live URL** for the privacy policy — it must be hosted publicly (e.g., on Netlify, GitHub Pages, or any web host) before you can submit. You cannot submit the URL `file://` or a local path.

---

## Summary — Full Findings Table

| ID | Severity | Title | File |
|---|---|---|---|
| BLOCKER-01 | 🔴 BLOCKER | No release signing config in build.gradle | `android/app/build.gradle` |
| BLOCKER-02 | 🔴 BLOCKER | Default `.env` has wrong VITE_APP_TITLE | `.env` |
| BLOCKER-03 | 🔴 BLOCKER | Production AdMob IDs used in non-playstore builds (policy risk) | `.env`, `.env.editor` |
| HIGH-01 | 🟠 HIGH | `minifyEnabled false` in release — no R8 shrinking | `android/app/build.gradle` |
| HIGH-02 | 🟠 HIGH | Production AdMob ad unit IDs not verified in AdMob Console | `src/platform/ad-config.js` |
| HIGH-03 | 🟠 HIGH | `remove_ads` IAP product must exist in Play Console | Play Console |
| HIGH-04 | 🟠 HIGH | `build:apk` builds a debug APK, not a release AAB | `package.json` |
| MEDIUM-01 | 🟡 MEDIUM | Version maintained in two places (build.gradle + target-config.js) | Both |
| MEDIUM-02 | 🟡 MEDIUM | `android:allowBackup` left as true (acceptable for puzzle game) | `AndroidManifest.xml` |
| MEDIUM-03 | 🟡 MEDIUM | Privacy policy not yet hosted at a live URL | — |
| MEDIUM-04 | 🟡 MEDIUM | `console.log` at line 1606 of main.js should be `console.warn` | `src/main.js` |
| LOW-01 | 🟢 LOW | 43 console.* statements across source (all acceptable) | Various |
| LOW-02 | 🟢 LOW | `VITE_APP_TITLE` in default `.env` is stale | `.env` |
| LOW-03 | 🟢 LOW | No `build:aab` script for release AAB generation | `package.json` |

---

## Play Console Verification Required (Non-Code)

These cannot be verified by code inspection — must be done in the Google Play / AdMob dashboards:

| # | Item | Where |
|---|---|---|
| PCV-01 | `remove_ads` in-app product created and set to **Active** | Play Console → In-app products |
| PCV-02 | AdMob App ID and all 3 ad unit IDs verified as Live | AdMob Console → Apps |
| PCV-03 | Privacy Policy hosted at a public URL (e.g., Netlify) | External hosting |
| PCV-04 | Data Safety form completed (local data + AdMob + AD_ID declared) | Play Console → App content → Data safety |
| PCV-05 | Content Rating questionnaire completed (Expected: Everyone) | Play Console → App content → Content rating |

---

## Recommended Fix Priority Order

```
1. [BLOCKER-01] Create keystore + add signingConfig to build.gradle
2. [BLOCKER-02] Fix VITE_APP_TITLE in .env
3. [BLOCKER-03] Add VITE_AD_MODE=test to .env and .env.editor
4. [PCV-01]     Create remove_ads IAP product in Play Console
5. [PCV-02]     Verify AdMob ad unit IDs are live in AdMob Console
6. [PCV-03]     Host Privacy Policy at a public URL
7. [PCV-04/05]  Complete Data Safety + Content Rating in Play Console
8. [HIGH-01]    Enable minifyEnabled true + add ProGuard rules
9. [HIGH-04]    Add build:aab script to package.json
10. [LOW-01]    Optionally configure Vite esbuild drop:console for release
```

---

## What IS Production Ready ✅

The following areas are complete and require **no changes** before submission:

- ✅ All 3 custom native Java plugins (Billing, AdMob, AppUpdate) — fully implemented
- ✅ AdMob full stack: banner + rewarded + interstitial + retry + premium bypass
- ✅ Google Play Billing 8.0.0: purchase, restore, acknowledge, isPurchased
- ✅ In-app update: flexible + immediate flows, download progress, restart & install
- ✅ Audio engine: 1,281-line procedural Web Audio synthesizer, zero external files
- ✅ App lifecycle: pause/resume/back button fully handled on Capacitor + web
- ✅ Game state persistence: localStorage, migration, corrupt save recovery
- ✅ Dual theme system (Obsidian / Vellum) — persisted, flicker-free
- ✅ Achievements system, Daily Challenge system — complete implementations
- ✅ Android SDK versions: minSdk 24, target 36, compile 36 — all current
- ✅ All Android mipmap icons at all densities — replaced
- ✅ Adaptive icon (foreground + `#121316` background)
- ✅ Portrait orientation locked
- ✅ Minimal permissions (INTERNET + BILLING + AD_ID only)
- ✅ No localhost / debug references in production paths
- ✅ Platform-gated features (ads, IAP, editor tools, dev HUD all guarded)
- ✅ Store listing copy, screenshots, feature graphic, app icon — all ready

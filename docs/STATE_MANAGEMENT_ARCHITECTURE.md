# State Management & Scene Traversal Architecture
## Number Grid Maze — Android Portrait (Capacitor) & Web

**Status:** Architecture Proposal & Planning  
**Target Environments:** Web (Standard Browser, PWA) & Android Portrait (Capacitor Native Shell wrapping WebView)  
**Author:** Software Architecture Team  
**Date:** September 2026  

---

## 1. Current State & Navigation Architecture

The current codebase (`index.html`, `style.css`, `levels.js`, `game.js`) represents a single-page procedural puzzle prototype. 

### Screen Structure & Rendering
Currently, there is no formal scene graph or view hierarchy. The entire interface lives in `index.html` at all times:
- `.app` (base container containing Masthead, HUD, DevPanel, Board, Controls, LevelStrip, and Tip)
- `#toast` (fixed positioned floating toast)
- `#rulesOverlay` (`.overlay` styled card)
- `#winOverlay` (`.overlay` styled card)
- `#finalOverlay` (`.overlay` styled card)

All overlay elements are co-resident in the DOM. Transitions between "screens" are handled by manually adding or removing the CSS class `.show` on individual elements, which toggles opacity from 0 to 1 and pointer-events from none to auto.

### Current State Representation
State is scattered as loose top-level mutable variables (`let`) in global scope within `game.js`:
- **Active level & navigation:** `levelIndex = 0`, `completed = new Array(LEVELS.length).fill(false)`
- **Board state:** `player = null`, `moveCount = 0`, `history = []`
- **Engine/Animation lock:** `animating = false`
- **Developer state:** `devModeEnabled = false`, `solutionPathVisible = false`
- **Input scratch state:** `touchStartX`, `touchStartY`, `touchStartTime`
- **Timer handle:** `deadEndToastTimeout = null`

### Execution & Lifecycle Flow
- **Startup:** When `game.js` evaluates, it calls `validateAll()`, caches 20+ DOM elements, calls `loadLevel(0)`, and imperatively adds `.show` to `rulesOverlay`.
- **Level Load:** `loadLevel(i)` mutates globals (`player`, `moveCount`, `history`), clears dead-end timers, renders DOM cells, recalculates token metrics, and binds DOM event listeners directly to cell elements.
- **Player Move:** User clicks/swipes -> `attemptMoveTo()` -> `doMove()` -> updates history, triggers CSS transition -> `setTimeout(230ms)` -> `refreshLegalMoves()` -> `checkWin()`.
- **Win Transition:** If player coordinates equal goal coordinates, `completed[levelIndex] = true`, `buildLevelStrip()`, and `showWin()` is invoked, showing `#winOverlay`.

---

## 2. Problems & Risks in the Existing Implementation

1. **Zero Session Persistence:**
   - Progress (`completed[]`) and current level (`levelIndex`) are in-memory JavaScript variables.
   - Any browser refresh, web tab discard, Android activity recreation, or low-memory background kill resets the player to Level 1.
2. **Missing State Abstraction & Concurrency Leaks:**
   - Because screens are just toggled classes, multiple overlays can logically overlap.
   - Keyboard arrow listeners (`window.addEventListener("keydown")`) do not check if an overlay is open. Arrow keys continue to drive the player piece invisibly behind the Rules or Win card.
3. **No Native Android Back Button Contract:**
   - In Capacitor or Android WebView, pressing the hardware back button will pop the browser navigation or terminate the native Activity immediately, rather than closing an open modal (Rules, Win, Settings) or returning to level select.
4. **AdMob Transition Vulnerability:**
   - AdMob policies strictly mandate that interstitial or rewarded ads must occur at **natural transition points** (e.g., between levels, after level complete, or upon explicit user prompt).
   - Displaying an ad without a formalized state machine risks rendering an ad while input listeners are active or timers (like the dead-end toast timer or animation timeout) are ticking, causing desynchronization, missed win checks, or invalid game state mutations.
5. **DOM Re-creation Fragility on Screen/Orientation Resize:**
   - Token sizing and positioning relies on calculating bounding client rects (`cellMetrics()`). On Android, viewport resizes (e.g., soft keyboard appearance, notification bar pull, split-screen) trigger window resize handlers that re-evaluate positioning. Without an explicit pause/resume state, geometry can become distorted during lifecycle switches.
6. **Tight Coupling between Platform, Logic, and Presentation:**
   - UI mutation, BFS solving, audio/haptic triggers (to be added), platform hooks, and level orchestration all reside in one global scope. Testing pure game rules or stubbing native Capacitor plugins is impossible without rewriting large portions of `game.js`.

---

## 3. Proposed State Model

We separate state into four well-defined, decoupled layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Engine / App State (Global Machine)                                 │
│    • Current Phase: BOOT | MAIN_MENU | LEVEL_SELECT | GAMEPLAY |       │
│                     PAUSED | LEVEL_COMPLETE | LEVEL_FAILED | AD_WATCH │
│    • Active Scene Identifier                                           │
│    • Environment: WEB | CAPACITOR_ANDROID                              │
│    • Modal Stack: ['SETTINGS', 'RULES']                                │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Session / Gameplay State (Per-Level Run)                             │
│    • Level Index: number (0..N)                                        │
│    • Player Position: [row, col]                                       │
│    • Move Count: number                                                │
│    • Move History: Stack<{ player: [r,c], moveCount: number }>         │
│    • Is Animating: boolean                                             │
│    • Legal Destinations: Array<{ r, c, dir }>                          │
│    • Is Dead End: boolean                                              │
├────────────────────────────────────────────────────────────────────────┤
│ 3. Persistent Player Data (Saved to Disk/Preferences)                  │
│    • Schema Version: number                                            │
│    • Completed Levels: Record<number, { completed: bool, bestMoves: n}>│
│    • Last Active Level: number                                         │
│    • Settings: { sound: bool, haptics: bool, devMode: bool }           │
│    • Ad Profile: { movesSinceLastInterstitial: number }                │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Platform State (Device & Capacitor Bridge)                          │
│    • App Active / In Background: boolean                               │
│    • Network / Ad Readiness: boolean                                   │
│    • Safe Insets: { top, bottom, left, right }                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. State Transition Diagram & Flow

```
                      ┌───────────────┐
                      │     BOOT      │ (App start / load assets)
                      └───────┬───────┘
                              │
                    Persistence Loaded
                              │
                    ┌─────────▼─────────┐
       ┌───────────►│     MAIN_MENU     │◄──────────────┐
       │            └─────────┬─────────┘               │
       │                      │                         │
       │           ┌──────────┴──────────┐              │
       │           ▼                     ▼              │
       │    ┌──────────────┐      ┌──────────────┐      │
       │    │ LEVEL_SELECT │      │ STORE/ABOUT  │      │
       │    └──────┬───────┘      └──────────────┘      │
       │           │                                    │
       │      Level Chosen                              │
       │           │                                    │
       │           ▼                                    │
       │    ┌──────────────┐                            │
       │    │   LOADING    │ (Prepare board & metrics)  │
       │    └──────┬───────┘                            │
       │           │                                    │
       │     Board Ready                                │
       │           │                                    │
       │           ▼                                    │
       │    ┌──────────────┐  Pause clicked             │
       │    │   GAMEPLAY   ├──────────────────┐         │
       │    └──────┬───────┘                  ▼         │
       │           │      ▲            ┌─────────────┐  │
       │           │      └────────────┤   PAUSED    ├──┘
       │           │        Resume     └─────────────┘  Quit
       │    Goal Reached / No Moves                     │
       │           │                                    │
       │     ┌─────┴────────────────┐                   │
       │     ▼                      ▼                   │
       │┌──────────────┐     ┌──────────────┐           │
       ││LEVEL_COMPLETE│     │ LEVEL_FAILED │           │
       │└──────┬───────┘     └──────┬───────┘           │
       │       │                    │                   │
       │       │ Check Ad Threshold │ Retry             │
       │       ▼                    ▼                   │
       │┌──────────────┐     ┌──────────────┐           │
       ││  AD_DISPLAY  │     │   RESTART    │───────────┘
       │└──────┬───────┘     └──────────────┘
       │       │ Ad Closed / Failed
       │       ▼
       └─ Next Level / Menu
```

---

## 5. Responsibilities of Each State

| State | Entry Actions | Active Behaviors & Allowed Input | Exit Actions |
|---|---|---|---|
| **BOOT** | Initialize platform bridge, load saved data, run level validation. | Splash screen visible; user input blocked. | Transition to `MAIN_MENU` or auto-resume `GAMEPLAY`. |
| **MAIN_MENU** | Mount menu UI, play ambient audio (if enabled). | Menu navigation, settings modal. Board hidden or displays decorative background. | Unmount menu screen. |
| **LEVEL_SELECT** | Render level completion badges and unlock states from Persistent Data. | Tap level dot, back button to Menu. | Pass selected `levelIndex` to `LOADING`. |
| **STORE / ABOUT** | Render credit info, rules explanation, or cosmetics. | Scrolling, external links, back navigation. | Return to previous scene. |
| **LOADING** | Fetch level definition, precalculate BFS path and cell metrics. | Display spinner or instant black fade; inputs locked. | Emit `READY` event, hand off to `GAMEPLAY`. |
| **GAMEPLAY** | Reset `history`, set player at `start`, calculate legal moves, render token. | Tap valid cells, keyboard arrows, touch swipes, Undo, Restart, Pause button. | Snapshot current state if interrupted; clear transient feedback. |
| **PAUSED** | Save timestamp, open pause modal, disable board listeners. | Resume, Restart, Level Select, Audio toggle. | Restore game loop, recalculate layout if resized. |
| **LEVEL_COMPLETE** | Mark level as completed in Persistent Data, compute efficiency %, show Win Overlay. | "Next Level", "Retry", "Share". Game input disabled. | Check if interstitial ad criteria is met; transition to `AD_DISPLAY` or `GAMEPLAY`. |
| **LEVEL_FAILED** | Highlight dead end, show persistent warning banner and pulse controls. | Undo, Restart, Level Select. Forward moves blocked. | Clear dead-end toast and pulses. |
| **RESTART** | Clear undo stack, move player back to start, clear animations. | Instant reset of current session without full teardown. | Return immediately to `GAMEPLAY`. |
| **AD_DISPLAY** | Mute audio, pause all game timers and listeners, invoke Capacitor AdMob plugin. | Native ad overlay active. Game engine strictly suspended. | Unmute audio, resume target state (`GAMEPLAY` or `MAIN_MENU`). |

---

## 6. Scene / Screen Traversal Strategy

Instead of ad-hoc DOM manipulation, we employ a lightweight **Scene Stack Machine** (`SceneRouter`).

### Core Concepts
1. **Root Scenes vs. Modal Overlays:**
   - **Root Scenes** represent exclusive top-level views (`MAIN_MENU`, `LEVEL_SELECT`, `GAMEPLAY`). Only one root scene is active at a time. Switching root scenes replaces the active view.
   - **Modal Overlays** represent stackable views (`PAUSE`, `RULES`, `SETTINGS`, `WIN`). Modals push onto the modal stack on top of the active root scene and trap focus.
2. **Input Gating:**
   - An `InputGate` evaluates the top of the stack. If any modal overlay is present, game board listeners (clicks, arrow keys, touch gestures) are completely disabled.
3. **Data Passing via Payloads:**
   - Scenes communicate by passing typed payload objects into `.navigate(targetScene, payload)` or `.pushModal(modalName, payload)`.
   - *Example:* When `GAMEPLAY` completes, it dispatches:
     ```javascript
     SceneRouter.pushModal('WIN_MODAL', {
       levelIndex: 3,
       moveCount: 8,
       optimal: 6,
       efficiency: 75
     });
     ```
   - The modal reads from the payload directly without querying global variables.

---

## 7. Persistence & Session Strategy

### Storage Engine Abstraction
We define a unified `StorageAdapter` that runs identically across platforms:
- **Web:** Backed by `window.localStorage`.
- **Android (Capacitor):** Backed by `@capacitor/preferences` (asynchronous, robust against Android cache clears).

### Persistent Data Schema (Version 1)
```json
{
  "schemaVersion": 1,
  "lastUpdated": 1725883200000,
  "playerProgress": {
    "lastPlayedLevel": 2,
    "levels": {
      "0": { "completed": true, "bestMoves": 1 },
      "1": { "completed": true, "bestMoves": 2 },
      "2": { "completed": false, "bestMoves": null }
    }
  },
  "settings": {
    "hapticsEnabled": true,
    "soundEnabled": true,
    "hasSeenTutorial": true,
    "devModeEnabled": false
  },
  "adTelemetry": {
    "levelsCompletedSinceAd": 0
  }
}
```

### Save Trigger Points
To prevent I/O thrashing on mobile while ensuring zero data loss:
- **Save Immediately on:** Level completion, setting toggles, store purchases.
- **Save on Background:** In-progress level index and telemetry are flushed when the app goes into the background.
- **Never Save:** Individual in-flight move counts on every step (only stored in memory during active level session).

---

## 8. Android & Capacitor Lifecycle Strategy

### Critical Mobile Lifecycle Concerns
In an Android WebView wrapped by Capacitor, mobile behavior diverges from desktop browsers:
1. **Activity Destruction & Process Death:** Android can kill the background WebView process under memory pressure.
2. **Hardware Back Button:** Android users expect the physical/gesture back button to back out of modals before exiting the app.
3. **Orientation & Safe Insets:** Android displays have camera cutouts, navigation pill bars, and varying aspect ratios (18:9, 20:9).

### Lifecycle Management Integration

```javascript
// Native Capacitor App Lifecycle Listener
import { App as CapApp } from '@capacitor/app';

export function setupAppLifecycle(stateMachine, storage) {
  // App Backgrounding (User presses Home, phone call arrives, app switch)
  CapApp.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) {
      // 1. Force state to PAUSED if currently in active GAMEPLAY
      if (stateMachine.currentPhase === 'GAMEPLAY') {
        stateMachine.transition('PAUSE');
      }
      // 2. Flush pending persistent saves
      storage.flush();
      // 3. Freeze audio and non-essential timers
      AudioSystem.suspend();
    } else {
      // App Resumed
      AudioSystem.resume();
      // Recalculate board grid geometry in case screen metrics shifted
      LayoutManager.refreshMetrics();
    }
  });

  // Android Hardware Back Button Handler
  CapApp.addListener('backButton', ({ canGoBack }) => {
    const handled = stateMachine.handleBackAction();
    if (!handled) {
      // If at the root MAIN_MENU, minimize the application
      CapApp.minimizeApp();
    }
  });
}
```

### Back Action Priority Resolution
When the back button is triggered, `handleBackAction()` resolves in this strict hierarchy:
1. **Ad Displaying:** Back button ignored (AdMob native handles dismissal).
2. **Modal Stack has items (`RULES`, `SETTINGS`, `PAUSE`):** Pop the top modal. Return focus to previous scene.
3. **In `GAMEPLAY`:** Open `PAUSE` modal.
4. **In `LEVEL_SELECT`:** Return to `MAIN_MENU`.
5. **In `MAIN_MENU`:** Minimize/exit the app.

---

## 9. AdMob Integration Strategy

### Compliance with Google Play & AdMob Policies
Google AdMob imposes strict requirements on interstitial and rewarded ads:
- **No Unexpected Ads:** Ads must not pop up during active user actions or continuous gameplay.
- **No Accidental Clicks:** The game must not display an ad immediately before or after a user tap that was intended for game interaction.
- **Mute & Pause Compliance:** All game sounds, movement animations, and input systems must freeze completely while the ad is visible.

### Natural Transition Placement
We introduce an **Ad Coordinator** that inspects the state machine at two authorized transition points:
1. **Between Levels (Post-Level Complete):** After the Win Overlay is shown and the user taps "Next Level".
2. **On Manual Level Restart (Optional Rewarded or Soft Interstitial):** Only after a configurable failure threshold (e.g., 3 restarts on a single tricky level).

### Ad Workflow Machine

```
[Level Complete] ──► User taps "Next Level"
                           │
                           ▼
             AdCoordinator.shouldShowInterstitial()?
                           │
             ┌─────────────┴─────────────┐
             │ YES                       │ NO
             ▼                           ▼
    ┌────────────────┐          ┌────────────────┐
    │ State: AD_PREP │          │ Load Next Lvl  │
    └────────┬───────┘          └────────────────┘
             │ 1. Mute audio
             │ 2. Freeze timers & listeners
             │ 3. Call Capacitor AdMob plugin
             ▼
    ┌────────────────┐
    │ State: AD_SHOW │
    └────────┬───────┘
             │ User watches / closes ad, or ad fails to load
             ▼
    ┌────────────────┐
    │ State: AD_DONE │
    └────────┬───────┘
             │ 1. Unmute audio
             │ 2. Reset ad counter
             │ 3. Transition to LOADING -> GAMEPLAY
             ▼
    [Next Level Starts Cleanly]
```

### Graceful Degradation on Web
On the Web (or when offline on mobile), the Capacitor AdMob plugin is not available. The `AdCoordinator` detects the environment:
- If environment is `WEB` or ad fails to load: immediately bypass `AD_SHOW` and transition directly to `LOADING -> GAMEPLAY` with 0ms delay.
- The rest of the game state machine operates completely identically without error.

---

## 10. Recommended Folder & Module Structure

To achieve clean separation of concerns without enterprise bloat, we propose organizing the project into lightweight ES modules:

```
E:\PROTO\GRID LEAP\
├── index.html                  # Shell markup, viewport meta, root container
├── style.css                   # Design tokens, layouts, overlays, animations
├── capacitor.config.json       # Native Capacitor configuration
│
├── src/
│   ├── main.js                 # App entry point, bootstrap coordinator
│   │
│   ├── core/                   # Pure puzzle logic (platform-agnostic)
│   │   ├── solver.js           # Pure BFS solver and pathfinder
│   │   ├── rules.js            # Movement calculation, legal destinations
│   │   └── validator.js        # Dataset integrity & level solvability
│   │
│   ├── state/                  # State management
│   │   ├── app-state.js        # State machine (Current phase, transitions)
│   │   ├── session-state.js    # In-level progress, history stack, player pos
│   │   └── persistence.js      # LocalStorage & Capacitor Preferences adapter
│   │
│   ├── scenes/                 # View controllers & overlay bindings
│   │   ├── scene-router.js     # Modal stack & root scene transitions
│   │   ├── menu-scene.js       # Main menu & Level selector controller
│   │   ├── game-scene.js       # Board rendering, token animation, HUD
│   │   └── overlay-scene.js    # Win, Rules, Pause, and Settings modals
│   │
│   ├── platform/               # Platform-specific adapters
│   │   ├── platform.js         # Environment detection (Web vs Capacitor)
│   │   ├── lifecycle.js        # App background/foreground, back button
│   │   └── ads.js              # AdMob integration & transition coordinator
│   │
│   └── data/
│       └── levels.js           # Handcrafted puzzle dataset
```

---

## 11. Migration Plan from Current Architecture

The migration is designed as an **incremental, non-breaking refactor** executed in 5 manageable stages:

### Stage 1: State Isolation & Persistence (Zero Visual Impact)
- Extract state variables from `game.js` into `app-state.js` and `session-state.js`.
- Introduce `persistence.js` to save and load `completed` levels and `lastLevelIndex`.
- Verify game behaves identically in the browser, but player progress now survives a page refresh.

### Stage 2: Scene Router & Modal Stack
- Implement `scene-router.js`.
- Replace direct DOM `.classList.add("show")` calls with `SceneRouter.pushModal()` and `SceneRouter.popModal()`.
- Add the input gating check in the keyboard and touch listeners to reject inputs when modals are open.

### Stage 3: Modularize Pure Logic
- Move BFS `solve()` and `legalDestinations()` into `core/solver.js` and `core/rules.js`.
- Decouple `renderBoard()` and `refreshLegalMoves()` so legal calculations are stored in state first, then consumed by the renderer.

### Stage 4: Platform & Lifecycle Bridge
- Set up `platform/lifecycle.js`.
- Hook standard web events (`visibilitychange`, `popstate`, `resize`).
- Prepare Capacitor plugin hooks (`@capacitor/app`) behind platform checks so the game runs natively in browser when Capacitor is absent.

### Stage 5: AdMob Coordinator Integration
- Implement `platform/ads.js`.
- Intercept the "Next Level" and "Restart" actions with `AdCoordinator.evaluate()`.
- Ensure fallback to instant level load on Web.

---

## 12. Testing Checklist for Web and Android

### Web Platform Testing
- [ ] **Cold Boot:** Clearing localStorage and loading page initializes Level 1 and opens Rules overlay.
- [ ] **Warm Boot:** Completing Level 3, refreshing the browser opens Level 4 directly with Rules closed.
- [ ] **Input Isolation:** Opening Rules or Win overlay blocks arrow keys and cell clicks from moving the player underneath.
- [ ] **Resize Resilience:** Resizing browser window recalculates board and snaps player token to correct cell instantly.
- [ ] **Web Tab Background:** Switching tabs mid-level triggers auto-save and pauses any active animations.

### Android / Capacitor Platform Testing
- [ ] **Hardware Back Button — Modals:** Pressing Back while Rules, Pause, or Win is open closes the modal without quitting the app.
- [ ] **Hardware Back Button — Gameplay:** Pressing Back during active gameplay triggers the Pause modal.
- [ ] **Hardware Back Button — Main Menu:** Pressing Back on the top-level screen cleanly minimizes the Android app.
- [ ] **Android Background / Low Memory:** Backgrounding app on Level 5, opening heavy apps to trigger RAM pressure, and returning restores state to Level 5.
- [ ] **Orientation Lock:** Ensure app locks cleanly to portrait orientation without visual distortion.
- [ ] **Ad Interstitial Execution:** Completing designated levels prompts the AdMob interstitial; game sounds and token movements are 100% suspended while the ad plays.
- [ ] **Ad Failure / Offline Fallback:** Disabling Wi-Fi/cellular on Android and completing a level transitions to the next level seamlessly without freezing.

---

## 13. Priority Order for Implementation

| Priority | Task | Complexity | Value / Impact |
|---|---|---|---|
| **P1** | **State Encapsulation & Storage:** Unify mutable globals into structured state objects and add `localStorage` persistence. | Low | **Critical.** Eliminates progress loss on reload. |
| **P2** | **Scene Router & Input Gating:** Establish modal stack to prevent ghost inputs behind overlays. | Low | **High.** Solves core UX bugs and enables safe modals. |
| **P3** | **Android Lifecycle & Back Button:** Wire `@capacitor/app` events for pause-on-background and back navigation. | Medium | **Critical for Android.** Required for Google Play compliance. |
| **P4** | **AdMob Coordinator:** Implement transition-safe ad display hooks with seamless web fallbacks. | Medium | **High.** Prepares monetization without breaking game flow. |
| **P5** | **File Structure Refactor:** Transition from single-file `game.js` to the proposed `src/` module layout. | Medium | **High.** Maintains codebase cleanliness as new features arrive. |

---

## 14. Architecture Review & Next Steps

This architecture provides:
1. **Clean Platform Independence:** The core gameplay engine has zero awareness of Capacitor or AdMob, making it trivial to run and debug in any desktop browser.
2. **Bulletproof Mobile State:** Handles back-button navigation, process suspension, and viewport adjustments reliably.
3. **Policy-Compliant Monetization:** Integrates AdMob strictly at natural stopping points with complete engine suspension.

**Recommendation:** Wait for user sign-off on `STATE_MANAGEMENT_ARCHITECTURE.md`, then execute **Priority 1 (State Encapsulation & Persistence)** as the first non-breaking implementation step.

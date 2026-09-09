# Scene & State Architecture
## Number Grid Maze — Android Portrait + Web

**Analysis date:** September 2026  
**Scope:** Read-only analysis + recommended architecture. No code modified.  
**Target platforms:** Web (PWA-ready) · Android (WebView / TWA)

---

## 1. Current-State Analysis

### 1.1 What the Game Currently Has (Screens)

There is no scene system. The game has **one HTML page** that contains four visual layers rendered simultaneously in the DOM. Which layer the user sees is controlled exclusively by CSS classes (`opacity: 0 / pointer-events: none` vs `.show`):

| Layer | DOM element | Visible when | Controlled by |
|---|---|---|---|
| **Game board** | `.app` wrapper | Always (never hidden) | — |
| **Rules overlay** | `#rulesOverlay` | First load + `?` button | `classList.add/remove("show")` |
| **Win overlay** | `#winOverlay` | Level complete | `showWin()` / `hideWin()` |
| **Final overlay** | `#finalOverlay` | All levels complete | `classList.add/remove("show")` |

```
DOM Stack (all present at all times):
┌─────────────────────────────┐  z-index: 0
│         .app (board)        │  always rendered, always interactive
│  ┌──────────────────────┐   │
│  │  [Toast] (z: 60)     │   │  position: fixed, shown/hidden by class
│  └──────────────────────┘   │
├─────────────────────────────┤  z-index: 50
│  #rulesOverlay  (overlay)   │  opacity toggled
├─────────────────────────────┤  z-index: 50
│  #winOverlay    (overlay)   │  opacity toggled
├─────────────────────────────┤  z-index: 50
│  #finalOverlay  (overlay)   │  opacity toggled
└─────────────────────────────┘
```

### 1.2 Current Navigation Flow

```
Page load
  |
  v
loadLevel(0)            -- initialises game state
  |
  v
rulesOverlay.show       -- overlaid immediately (no "scene" concept)
  |
  v
User taps "Got it"
  |
  v
[GAME BOARD ACTIVE]
  |
  +-- level strip dot click  --> loadLevel(i)     [no transition]
  |
  +-- reach goal             --> showWin()         [overlay appears]
  |     |
  |     +-- "Retry"          --> hideWin() + restart()
  |     |
  |     +-- "Next Level"     --> nextLevel()
  |           |
  |           +-- more levels     --> loadLevel(next)
  |           |
  |           +-- last level      --> finalOverlay.show
  |                 |
  |                 +-- "Play Again" --> finalOverlay.hide + loadLevel(0)
  |
  +-- "?" button             --> rulesOverlay.show [no back-stack entry]
        |
        +-- "Got it"         --> rulesOverlay.hide
```

### 1.3 Current State Inventory

**All mutable state lives as top-level `let` variables in `game.js` — no grouping, no encapsulation:**

#### Game/Session state (ephemeral, lost on page reload)
| Variable | Type | Owner | Survives reload? |
|---|---|---|---|
| `levelIndex` | `number` | game.js global | ❌ No |
| `player` | `[r,c]` | game.js global | ❌ No |
| `moveCount` | `number` | game.js global | ❌ No |
| `history` | `array` | game.js global | ❌ No |
| `animating` | `boolean` | game.js global | ❌ No |
| `cellEls` | `array[][]` | game.js global | ❌ No |
| `tokenEl` | `Element` | game.js global | ❌ No |

#### Progress state (should persist, currently doesn't)
| Variable | Type | Should Survive Reload? | Currently Survives? |
|---|---|---|---|
| `completed[]` | `bool[]` | ✅ Yes | ❌ No |

#### UI/Tool state (session-scoped, fine to lose)
| Variable | Type |
|---|---|
| `devModeEnabled` | `boolean` |
| `solutionPathVisible` | `boolean` |
| `touchStartX/Y/Time` | `number` |
| `deadEndToastTimeout` | `TimeoutId` |

### 1.4 Current Problems

#### P1 — No persistence
`completed[]` is reset to all-`false` on every page refresh. On Android, the WebView may discard state on any background + memory-pressure event. A player who completes 8 levels and switches to their email app comes back to level 1 with no history.

#### P2 — No scene concept: overlays stack silently
Multiple overlays can technically be `.show` at the same time (e.g., if a win happens while the rules are open — unlikely now, but no guard exists). No system enforces "only one overlay active."

#### P3 — No back-navigation model
On Android, the hardware back button triggers the browser's default `history.go(-1)`, which exits the app entirely. There is no handler. There is also no "scene stack" to pop from. Pressing back while the Win overlay is open should close the overlay, not exit.

#### P4 — State loss during level transitions
`loadLevel(i)` resets all session state. This is correct for `player`, `moveCount`, `history`. But there is no pre-transition "save current progress" step. If a future feature needs to resume mid-level (Android backgrounding), there is nothing to restore from.

#### P5 — No mid-level resume
If Android kills and restarts the WebView while the player is mid-level, the game restarts at level 0. The player's position and move history are gone.

#### P6 — Arrow-key input fires when overlay is open
`window.addEventListener("keydown", ...)` always fires. If the rules overlay is open and the user presses an arrow key, the game board processes the move behind the overlay. No scene-aware input gate exists.

#### P7 — `loadLevel()` is the only initializer
There is no `init()` / `boot()` concept. The very bottom of `game.js` calls `loadLevel(0)` and shows rules — this is the only startup sequence. Adding a loading screen, a title screen, or a "continue from last session" flow requires rewriting this startup logic from scratch.

#### P8 — Overlay data populated inside `showWin()`
`showWin()` reads `levelIndex`, `moveCount`, `devModeEnabled` directly from global scope. If the Win overlay were ever a separate module or scene, it would have no clean data interface — it would need to reach back into the global scope of another module.

---

## 2. Recommended State Architecture

### 2.1 The Three State Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1: AppState (persists to localStorage, survives all restarts) │
│  • levelProgress: completed[]                                         │
│  • lastPlayedLevelIndex                                               │
│  • settings: { devMode: bool, ... }                                  │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 2: SessionState (in-memory, lives for one play session)        │
│  • currentLevelIndex                                                  │
│  • player: [r, c]                                                     │
│  • moveCount                                                          │
│  • moveHistory: []  (undo stack)                                      │
│  • animating: bool                                                    │
│  • activeScene: SceneName                                            │
│  • sceneStack: SceneName[]  (back-navigation stack)                  │
├──────────────────────────────────────────────────────────────────────┤
│  LAYER 3: UIState (transient, never saved, per-render only)           │
│  • solutionPathVisible: bool                                          │
│  • deadEndToastActive: bool                                          │
│  • touchStart: { x, y, time }                                        │
│  • deadEndToastTimeout: TimeoutId                                    │
└──────────────────────────────────────────────────────────────────────┘
```

**Rule:** Layers never reach up. `UIState` never reads `AppState` directly. `SessionState` never writes to `AppState` directly. All cross-layer communication flows through the **GameLoop** (the orchestrator described in `GAME_ARCHITECTURE.md`).

### 2.2 The Scene Registry

Each screen/view the player can be in is a named **scene**. Scenes are not full DOM swaps — the game is single-page, so scenes are still overlay CSS classes — but every show/hide is routed through a central `SceneManager` that enforces the rules.

**Defined scenes:**

| Scene ID | Overlay element | Can be "back"-navigated | Blocks board input |
|---|---|---|---|
| `GAME` | `.app` (base layer) | No (root scene) | No |
| `RULES` | `#rulesOverlay` | Yes → returns to `GAME` | Yes |
| `WIN` | `#winOverlay` | Yes → returns to `GAME` | Yes |
| `FINAL` | `#finalOverlay` | No (end state) | Yes |

**Future scenes** (added without changing existing logic):

| Scene ID | Purpose |
|---|---|
| `MAIN_MENU` | Title screen / world select |
| `SETTINGS` | Options screen |
| `LEVEL_SELECT` | Browse all levels by difficulty |
| `PAUSE` | In-level pause menu |
| `INTERSTITIAL` | Between-world transition |

### 2.3 The Scene Stack (Back Navigation)

The scene stack is a simple array inside `SessionState.sceneStack`. It behaves like a browser history but only within the app:

```
Initial state:  stack = ["GAME"]

Player taps "?":
  push("RULES")   stack = ["GAME", "RULES"]

Player taps "Got it":
  pop()           stack = ["GAME"]     --> shows GAME

Player reaches goal:
  push("WIN")     stack = ["GAME", "WIN"]

Player taps "Retry":
  pop()           stack = ["GAME"]     --> shows GAME, restarts level

Player taps "Next Level":
  replace("WIN", "GAME")  stack = ["GAME"]  --> shows GAME, loads next level

Player taps Android back while WIN is showing:
  pop()           stack = ["GAME"]     --> closes WIN (same as "Retry")

Player taps Android back while GAME is root:
  stack.length === 1  --> show OS exit dialog or minimize app (do not pop)
```

**SceneManager API:**
```js
SceneManager.push(sceneName)       // show a scene, push to stack
SceneManager.pop()                 // dismiss top scene, return to previous
SceneManager.replace(sceneName)    // replace top without growing stack
SceneManager.current()             // returns top of stack
SceneManager.isBlocking()          // returns true if current scene blocks board input
```

### 2.4 Data Flow Through Scenes

**No scene accesses another scene's internal state.** Data is passed explicitly:

```
GameLoop calls: SceneManager.push("WIN", { levelIndex, moveCount, optimal, devMode })
SceneManager calls: WinScene.enter({ levelIndex, moveCount, optimal, devMode })
WinScene populates its own DOM from the argument object.
```

When WinScene exits:
```
WinScene emits: "retry" | "next"
GameLoop receives the event and decides what to do.
```

This means WinScene never reads `levelIndex` from the global scope — it only knows what it was told when `.enter()` was called.

---

## 3. Scene Traversal / State-Flow Diagram

```
                        ┌─────────┐
                        │  BOOT   │  (page load / TWA cold start)
                        └────┬────┘
                             │
                    Persistence.load()
                             │
                     ┌───────┴──────────┐
                     │                  │
               first launch         returning player
                     │                  │
                     ▼                  ▼
              push("RULES")     push("GAME")
                     │          resume from AppState.lastPlayedLevel
                     │
                     ▼
               ┌──────────┐
               │  RULES   │◄───────────────────────────────┐
               └────┬─────┘                                │
                    │ "Got it"                              │
                    │ pop() → GAME                 "?" tapped from GAME
                    ▼                                       │
          ┌─────────────────────────────────────────────────┐
          │                   GAME (root)                   │
          │  SessionState: { levelIndex, player, moves,     │
          │                  history, animating }           │
          └─┬───────────────────────────────────────────────┘
            │                              │
      reach goal                   Android back (root)
            │                             │
            ▼                      minimize / exit dialog
     ┌─────────────┐
     │     WIN     │◄── SessionState preserved, AppState.completed updated
     └──┬─────┬────┘
        │     │
      Retry  Next
        │     │
        │     ├── more levels → replace("GAME") + loadLevel(next)
        │     │
        │     └── last level → replace("FINAL")
        │                              │
        │               ┌─────────────┴──────────┐
        │               │         FINAL           │
        │               └────────────┬────────────┘
        │                            │ "Play Again"
        │                            ▼
        └────────────────────────────┤
                                     │
                        replace("GAME") + loadLevel(0)
```

**Input gating at scene boundary:**
```
keydown / touchend / click on board cell
  │
  ▼
InputRouter
  ├── SceneManager.isBlocking() === true  → event discarded (RULES / WIN / FINAL showing)
  └── SceneManager.isBlocking() === false → event delivered to GameLoop
```

---

## 4. Proposed Folder / Module Structure

```
E:\PROTO\GRID LEAP\
│
├── index.html            -- markup; all scene DOM present, all hidden initially
├── style.css             -- all styles; scenes use .scene--active class
├── levels.js             -- level data only (unchanged)
│
├── app.js                -- NEW: boot sequence; loads persistence, starts SceneManager
│
├── game.js               -- refactored (from GAME_ARCHITECTURE.md)
│   │
│   ├── [Section 1: Rules Engine]   solve(), legalDestinations(), isWin(), isDeadEnd()
│   ├── [Section 2: State]          SessionState object
│   ├── [Section 3: Renderer]       DOM object, all render functions
│   ├── [Section 4: DevTools]       toggleDevMode(), updateDevPanel()
│   └── [Section 5: Game Loop]      tick(), doMove(), undo(), restart(), checkWin()
│
├── scene-manager.js      -- NEW: SceneManager, scene registry, back-stack
│
├── persistence.js        -- NEW: AppState read/write via localStorage
│
└── input-router.js       -- NEW: all event listeners; gates by SceneManager.isBlocking()
```

**Load order in `index.html`:**
```html
<script src="levels.js"></script>
<script src="persistence.js"></script>
<script src="scene-manager.js"></script>
<script src="game.js"></script>
<script src="input-router.js"></script>
<script src="app.js"></script>   <!-- last: boots the app after everything is defined -->
```

### New files in detail

#### `persistence.js`
```js
const Persistence = {
  KEY: "gridleap_v1",

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  save(appState) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(appState));
    } catch { /* storage full or private mode — fail silently */ }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  }
};
```

**AppState schema (what gets saved):**
```js
{
  version: 1,                       // for migration on future schema changes
  completed: [false, true, ...],    // one bool per level
  lastLevelIndex: 3,                // where to resume
  settings: {
    hasSeenRules: true              // skip rules on resume
  }
}
```

#### `scene-manager.js`
```js
const SCENES = {
  GAME:  { el: null /* set in init */, blocksInput: false },
  RULES: { el: null, blocksInput: true  },
  WIN:   { el: null, blocksInput: true  },
  FINAL: { el: null, blocksInput: true  },
};

const SceneManager = {
  stack: ["GAME"],

  init() {
    SCENES.GAME.el  = null;          // board is always visible; no overlay el
    SCENES.RULES.el = document.getElementById("rulesOverlay");
    SCENES.WIN.el   = document.getElementById("winOverlay");
    SCENES.FINAL.el = document.getElementById("finalOverlay");
  },

  current() { return this.stack[this.stack.length - 1]; },

  isBlocking() { return SCENES[this.current()].blocksInput; },

  push(name, data) {
    this._hide(this.current());
    this.stack.push(name);
    this._show(name, data);
  },

  pop() {
    if (this.stack.length <= 1) return false; // at root
    this._hide(this.current());
    this.stack.pop();
    this._show(this.current());
    return true;
  },

  replace(name, data) {
    this._hide(this.current());
    this.stack[this.stack.length - 1] = name;
    this._show(name, data);
  },

  _show(name, data) {
    const scene = SCENES[name];
    if (scene.el) scene.el.classList.add("show");
    if (scene.onEnter) scene.onEnter(data);
  },

  _hide(name) {
    const scene = SCENES[name];
    if (scene.el) scene.el.classList.remove("show");
    if (scene.onExit) scene.onExit();
  }
};
```

#### `input-router.js`
```js
// All raw input listeners live here.
// Each handler checks SceneManager.isBlocking() before dispatching.

window.addEventListener("keydown", (e) => {
  if (e.key === "d" || e.key === "D" || e.key === "`") {
    DevTools.toggle(); return;
  }
  if (SceneManager.isBlocking()) return;   // ← THE GATE
  const dir = { ArrowUp:"up", ArrowDown:"down", ArrowLeft:"left", ArrowRight:"right" }[e.key];
  if (!dir) return;
  e.preventDefault();
  GameLoop.handleDirectionInput(dir);
});

// Touch and click listeners follow the same pattern
```

#### `app.js`
```js
// Boot sequence — runs after all scripts are loaded
(function boot() {
  SceneManager.init();
  WireSceneHandlers();   // attaches button → SceneManager calls

  const saved = Persistence.load();
  const appState = saved ?? Persistence.defaultState();

  if (!saved || !saved.settings.hasSeenRules) {
    GameLoop.loadLevel(0, appState);
    SceneManager.push("RULES");
  } else {
    GameLoop.loadLevel(appState.lastLevelIndex, appState);
    SceneManager.push("GAME");
  }
})();
```

---

## 5. State Transitions — Full Reference

### Level Load
```
GameLoop.loadLevel(i, appState)
  SessionState.currentLevelIndex = i
  SessionState.player             = lv.start
  SessionState.moveCount          = 0
  SessionState.moveHistory        = []
  SessionState.animating          = false
  UIState.solutionPathVisible     = false
  UIState.deadEndToastActive      = false
  Renderer.renderBoard(lv)
  Renderer.renderHud(SessionState, appState)
  Renderer.renderLevelStrip(LEVELS, SessionState, appState)
  tick()
```

### Move
```
GameLoop.doMove(r, c)
  SessionState.moveHistory.push(snapshot)
  SessionState.player = [r, c]
  SessionState.moveCount++
  SessionState.animating = true
  Renderer.placeToken(false)
  Renderer.renderHud(SessionState, appState)
  setTimeout(230ms):
    SessionState.animating = false
    tick()
    GameLoop.checkWin()
```

### Win
```
GameLoop.checkWin()
  appState.completed[i] = true
  appState.lastLevelIndex = i
  Persistence.save(appState)              ← save immediately on level complete
  Renderer.renderLevelStrip(...)
  SceneManager.push("WIN", {
    levelIndex:  SessionState.currentLevelIndex,
    moveCount:   SessionState.moveCount,
    optimal:     currentLevel().optimal,
    devMode:     DevTools.devModeEnabled
  })
```

### Resume after Android background
```
document: visibilitychange → "visible"
  appState = Persistence.load()   ← re-read in case OS updated it
  if (SessionState is stale):
    GameLoop.loadLevel(appState.lastLevelIndex, appState)
  else:
    Renderer.renderBoard(currentLevel())   ← re-render in case DOM was recycled
    tick()
```

### Android Back Button
```
window: popstate  (or native bridge event in TWA)
  handled = SceneManager.pop()
  if (!handled):
    // at root GAME scene
    Android.minimizeApp()  or  confirm("Exit?")
```

---

## 6. Persistence Schema and Migration

### v1 Schema
```js
{
  version: 1,
  completed: Array(LEVELS.length).fill(false),
  lastLevelIndex: 0,
  settings: {
    hasSeenRules: false
  }
}
```

### Schema migration (future)
If a future update changes the schema (e.g., adding a `worldIndex` field), a migration guard in `persistence.js` handles it:

```js
load() {
  const raw = localStorage.getItem(this.KEY);
  if (!raw) return null;
  const data = JSON.parse(raw);
  return this.migrate(data);
},

migrate(data) {
  if (!data.version || data.version < 1) {
    // Upgrade from unversioned to v1
    data.version = 1;
    data.settings = { hasSeenRules: true };
  }
  // v1 → v2 migration would go here
  return data;
}
```

### When to save
| Event | Save? |
|---|---|
| Level complete (win) | ✅ Always — progress is valuable |
| Level load (loadLevel) | ✅ Save `lastLevelIndex` |
| Restart or undo | ❌ No — mid-level state not saved |
| Page visibility hidden (Android background) | ✅ Save `lastLevelIndex` |
| Settings change | ✅ Save settings only |

---

## 7. Android Lifecycle Handling

### Critical Android Events

| Event | Trigger | Action |
|---|---|---|
| **Back button** | `popstate` / TWA bridge | `SceneManager.pop()`, then minimize if at root |
| **App backgrounded** | `document.visibilitychange → "hidden"` | `Persistence.save(appState)` |
| **App resumed** | `document.visibilitychange → "visible"` | Re-render board, restore any in-progress input |
| **Low memory kill + cold restart** | App killed, user re-opens | `Persistence.load()` → resume from `lastLevelIndex` |
| **Screen rotation** | `resize` event | `Renderer.renderBoardOnResize()` — same as now |

### Visibility API Integration
```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // App going to background
    appState.lastLevelIndex = SessionState.currentLevelIndex;
    Persistence.save(appState);
  } else {
    // App resumed
    // Re-render in case DOM was recycled by low-memory event
    if (SessionState.player) {
      Renderer.renderBoard(currentLevel());
      Renderer.placeToken(SessionState.player, true);
      tick();
    }
  }
});
```

### Back Button (TWA / WebView)
In a **Trusted Web Activity (TWA)** for Android, the system back button fires `popstate` if there are browser history entries, or can be intercepted via the [Navigation API](https://developer.chrome.com/docs/web-platform/navigation-api/). The cleanest approach:

```js
// Prevent any accidental browser history entries from being created
// by using replaceState instead of pushState for any in-app navigation.
// Then intercept the back button via popstate.

window.addEventListener("popstate", (e) => {
  const handled = SceneManager.pop();
  if (!handled) {
    // At root — push a dummy state so the next back minimizes
    history.pushState({ gridleap: true }, "");
  }
});

// On boot, push one state so back has something to pop
history.pushState({ gridleap: true }, "");
```

---

## 8. Web-Specific Considerations

### PWA (Progressive Web App)
Adding a `manifest.json` and a minimal service worker enables "Add to Home Screen" on Android and desktop. The service worker caches game assets so the game works offline.

```
E:\PROTO\GRID LEAP\
├── manifest.json       -- app name, icons, theme color, display: "standalone"
└── sw.js               -- service worker, caches: index.html, style.css, game.js, levels.js
```

`manifest.json` key fields:
```json
{
  "name": "Number Grid Maze",
  "short_name": "GridLeap",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0B131A",
  "background_color": "#0B131A",
  "start_url": "/",
  "icons": [...]
}
```

### Page Refresh / Browser Tab Restore
On Web, the player can refresh the page. The "continue" flow handles this:
1. `Persistence.load()` finds saved `lastLevelIndex` and `completed[]`
2. `app.js` boots directly into that level (no rules screen if `hasSeenRules: true`)
3. Player is at level start (mid-level position not saved — by design)

If mid-level resume is desired later, `moveHistory` snapshots can be serialized to localStorage, but this adds complexity and is **not recommended for the prototype**.

### URL State (Optional, Future)
A future enhancement: encode the level index in the URL hash (`#level=5`). This allows direct linking to a level and proper browser back/forward navigation. Implementation: `history.replaceState` on `loadLevel`, parse `location.hash` in `app.js` boot.

### Page Visibility — Tab Switching (Web)
Same `visibilitychange` handler as Android works for web tab switching. When the tab is hidden, save state. When visible, re-render.

---

## 9. Adding New Scenes (Extensibility)

Adding a new scene — e.g., `SETTINGS` — requires four steps and zero changes to existing scenes:

**Step 1: Add DOM in `index.html`**
```html
<div class="overlay" id="settingsOverlay">
  <div class="card">...</div>
</div>
```

**Step 2: Register in `scene-manager.js`**
```js
const SCENES = {
  // existing...
  SETTINGS: {
    el: null,           // set in SceneManager.init()
    blocksInput: true,
    onEnter(data) { /* populate settings from appState */ },
    onExit()     { /* save changed settings */ }
  }
};
```

**Step 3: Wire the open trigger**
```js
document.getElementById("settingsBtn")
  .addEventListener("click", () => SceneManager.push("SETTINGS", appState.settings));
```

**Step 4: Wire the close trigger**
```js
document.getElementById("closeSettingsBtn")
  .addEventListener("click", () => SceneManager.pop());
```

The back button (`SceneManager.pop()`) automatically handles Android back for free.

**Adding a full new page-level scene** (e.g., `MAIN_MENU` or `LEVEL_SELECT`) follows the same four steps. The only difference is that `MAIN_MENU` would be the new root of the stack instead of `GAME`.

---

## 10. Migration / Refactoring Plan

This plan delivers the full architecture in 6 stages. Each stage ends with a working game.

### Stage 0 — Prerequisite (from GAME_ARCHITECTURE.md)
Complete Priority 1–3 refactors first:
- Extract `State` object
- Extract `DOM` object
- Replace `refreshLegalMoves()` with `tick()`

This stage is already planned and approved in `GAME_ARCHITECTURE.md`.

### Stage 1 — Add `persistence.js` (no visible change to player)
- Create `persistence.js` with `load()`, `save()`, `migrate()`
- Add `<script src="persistence.js">` before `game.js`
- In `checkWin()`, call `Persistence.save(appState)` after marking level complete
- In `loadLevel()`, call `Persistence.save({ lastLevelIndex: i })` after setting level
- **Test:** Complete level 1, refresh page, verify `localStorage` has the key
- **Regression:** All 10 levels still playable; no change to visual behavior

### Stage 2 — Add `scene-manager.js` (replaces raw class manipulation)
- Create `scene-manager.js` with `SceneManager` object and `SCENES` registry
- Replace all raw `overlay.classList.add("show")` calls with `SceneManager.push(name)`
- Replace all `overlay.classList.remove("show")` calls with `SceneManager.pop()`
- Add input gate: `if (SceneManager.isBlocking()) return;` at top of keyboard handler
- **Test:** All overlays open and close correctly; arrow keys are blocked while rules open
- **Regression:** All 10 levels; verify rules, win, and final overlays

### Stage 3 — Add `input-router.js` (consolidate all event listeners)
- Move all `addEventListener` calls from `game.js` into `input-router.js`
- `input-router.js` depends on `SceneManager` and `GameLoop`
- Remove the event listener block from `game.js`
- **Test:** Click, keyboard, swipe all work; dev mode toggle works
- **Regression:** All 10 levels; all input methods; mobile swipe

### Stage 4 — Add `app.js` boot sequence
- Create `app.js` as the last-loaded script
- Move `loadLevel(0)` and `rulesOverlay.classList.add("show")` into `app.js`
- Add the "continue from save" branch: if `Persistence.load()` returns a valid save, use `lastLevelIndex` instead of 0, skip rules if `hasSeenRules: true`
- **Test:** Complete level 2, refresh, verify game starts at level 2; first-time player sees rules
- **Regression:** All 10 levels; cold start vs warm start behavior

### Stage 5 — Android back button + visibility
- Add `visibilitychange` handler in `input-router.js` or `app.js`
- Add `popstate` handler for back button
- Add the dummy `history.pushState` on boot
- **Test (web):** Open rules, press browser back → rules close, not page navigation; press back from game root → browser back becomes no-op
- **Test (Android):** Open in Chrome on device; back closes overlays; background + resume restores position

### Stage 6 — PWA assets (optional, when targeting Android install)
- Add `manifest.json`
- Add `sw.js` (minimal service worker caching game files)
- Add `<link rel="manifest">` to `index.html`
- Add `<meta name="theme-color">` to `index.html`
- **Test:** "Add to Home Screen" on Android Chrome; app opens standalone; works offline

---

## 11. Risks and Edge Cases

### Risk 1 — localStorage unavailable
**Scenario:** iOS Safari Private Mode, some enterprise MDMs, or very old browsers block `localStorage`.  
**Impact:** `Persistence.save()` throws; game crashes.  
**Mitigation:** Wrap all `localStorage` calls in `try/catch`. On failure, fall back to in-memory state (game still works, just doesn't persist).

### Risk 2 — Multiple overlays visible simultaneously
**Scenario:** A bug causes `SceneManager.push()` to be called twice, stacking two overlays.  
**Mitigation:** `_show()` should hide all other overlay elements first, or maintain a strict stack invariant (throw a console error if the stack grows unexpectedly during development).

### Risk 3 — `animating` flag stale on Android resume
**Scenario:** Player triggers a move, Android backgrounds the app during the 230ms animation timeout, and resumes. The `animating = false` timeout never fired.  
**Impact:** Board is stuck; no moves accepted.  
**Mitigation:** In the `visibilitychange → "visible"` handler, force `SessionState.animating = false`.

### Risk 4 — Level strip state out of sync after resume
**Scenario:** Player completes level on device A, localStorage is not synced to device B (web). No cross-device sync exists.  
**Impact:** Progress is device-local. This is acceptable for the prototype; note it clearly in the doc.

### Risk 5 — SceneManager scene data becomes stale
**Scenario:** `showWin()` is called with a captured snapshot `{ moveCount: 5 }`. Player somehow undoes after the scene is shown (shouldn't happen if input is blocked, but defensive coding matters).  
**Mitigation:** Input is fully blocked by `SceneManager.isBlocking()` while `WIN` is active. Undo button is in the `.app` layer which is behind the overlay (pointer-events already blocked by the overlay CSS).

### Risk 6 — `history.pushState` causes unexpected back behavior on Web
**Scenario:** The dummy `pushState` on boot means pressing browser back once does nothing (pops the dummy), pressing back again exits. This is correct behavior but may confuse users.  
**Mitigation:** Only add this in Android/TWA context, not on normal web. Detect with `navigator.standalone` or TWA referrer header.

### Risk 7 — Schema version mismatch in localStorage
**Scenario:** Player upgrades the app and the localStorage key contains an old schema.  
**Mitigation:** The `migrate()` function in `persistence.js` handles this. The `version` field in the saved object gates each migration step. Always default safely (missing fields → default values, never crash).

---

## 12. Testing Strategy

### Unit-level (no browser needed)
- `solve()` — already implicitly tested by `validateAll()`
- `legalDestinations()` — test against known level configurations
- `Persistence.migrate()` — test with v0, v1, future schemas
- `SceneManager.push/pop/replace` — test stack invariants in isolation

### Integration (browser manual or Playwright)
| Test | Steps | Pass criterion |
|---|---|---|
| Cold start first time | Clear localStorage, load page | Rules overlay shown, level 1 loaded |
| Warm start | Complete level 1, refresh | Level 2 loaded, rules not shown |
| Back button closes overlay | Open rules, press back | Rules close, game board interactive |
| Back at root | Close all overlays, press back | App minimizes / no crash |
| Win overlay data | Complete level 3 | Overlay shows correct move count and optimal |
| Input gate | Open rules, press arrow key | Board does NOT move player |
| Android background | Mid-level, background, resume | Level and position correct (or level 1 if mid-level not saved) |
| Storage full | Fill localStorage, complete level | Game continues, logs warning, does not crash |
| Keyboard + touch coexist | Play on desktop with touch emulation | Both input methods work independently |

### Regression checklist (run after each stage)
1. All 10 levels completable
2. Undo works correctly
3. Restart resets to level start
4. Dev mode toggles correctly
5. Solution path shows/hides
6. Level strip reflects completion state
7. Touch swipe works on mobile viewport
8. Arrow keys work on desktop
9. Resize repositions token correctly
10. Win overlay shows correct data

---

## 13. Step-by-Step Implementation Order

(Assumes `GAME_ARCHITECTURE.md` Stage 0 refactors are done first)

| Step | File | Change | Testing |
|---|---|---|---|
| 1 | `persistence.js` | Create; add `load/save/migrate` | Check localStorage via DevTools |
| 2 | `index.html` | Add `<script src="persistence.js">` before game.js | No visible change |
| 3 | `game.js` | In `checkWin()`: call `Persistence.save()` | Complete level, refresh, check storage |
| 4 | `game.js` | In `loadLevel()`: call `Persistence.save()` for lastLevelIndex | Navigate levels, check storage |
| 5 | `scene-manager.js` | Create; register 4 scenes | No visible change yet |
| 6 | `index.html` | Add `<script src="scene-manager.js">` | No visible change |
| 7 | `game.js` | Replace all `overlay.classList.add/remove("show")` with `SceneManager` calls | Play all overlays, verify behavior |
| 8 | `game.js` | Add `if (SceneManager.isBlocking()) return` in keyboard handler | Test arrow keys while rules open |
| 9 | `input-router.js` | Create; move all `addEventListener` from game.js | All input still works |
| 10 | `game.js` | Remove event listener block (now in input-router.js) | Full regression test |
| 11 | `app.js` | Create boot sequence with `Persistence.load()` branch | Test cold start vs warm start |
| 12 | `index.html` | Add `<script src="app.js">` last; remove boot lines from game.js | Full regression test |
| 13 | `input-router.js` | Add `visibilitychange` handler | Background/resume on Android |
| 14 | `input-router.js` | Add `popstate` back-button handler | Browser/Android back test |
| 15 | `manifest.json` + `sw.js` | PWA assets (if targeting install) | Add to Home Screen test |

---

## 14. Summary

| Question | Answer |
|---|---|
| How many scenes exist? | 4 now (GAME, RULES, WIN, FINAL); architecture supports unlimited future scenes |
| How is navigation managed? | `SceneManager` with a scene stack; `push/pop/replace` API |
| What persists? | `completed[]`, `lastLevelIndex`, `hasSeenRules` via `localStorage` |
| What is session-only? | `player`, `moveCount`, `moveHistory`, `animating` |
| What is transient? | Touch state, toast timeout, solution path visibility |
| Android back button? | `popstate` → `SceneManager.pop()`; minimize at root |
| Android background? | `visibilitychange` → save; resume → re-render |
| Input blocked during overlays? | Yes — `SceneManager.isBlocking()` gates all board input |
| New scene cost? | 4 steps, 0 changes to existing scenes |
| Storage format? | Versioned JSON in `localStorage`; migrated on boot |

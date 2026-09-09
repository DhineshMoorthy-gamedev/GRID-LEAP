# Game Architecture Analysis
## Number Grid Maze — Vertical Slice

**Analysis date:** September 2026  
**Codebase version:** Post-implementation-plan (all 9 tasks complete)  
**Analyst scope:** Read-only. No code has been modified.

---

## 1. Current Architecture Assessment

### File Overview

| File | Lines | Size | Role |
|---|---|---|---|
| `index.html` | 152 | 5.3 KB | Semantic markup + 4 overlay structures |
| `style.css` | 643 | 14.7 KB | All visual styles + CSS design tokens |
| `levels.js` | 21 | 2.5 KB | `const LEVELS = [...]` — 10 level definitions |
| `game.js` | 575 | 18.2 KB | Everything else |

The modular split accomplished by Task 4.2 is the right foundation. `levels.js` is clean and focused. `index.html` is clean markup with no inline logic. `style.css` uses a well-defined CSS variable system. The problem is that `game.js` is a single 575-line flat script containing at least 5 distinct conceptual systems with no internal separation between them.

### What game.js Currently Contains

Reading the file linearly, these logical regions exist but are not formally separated:

| Lines | Region | Description |
|---|---|---|
| 1–36 | **BFS Solver** | `solve(level, fromPos)` — graph BFS returning `{distance, path}` |
| 38–55 | **Level Validator** | IIFE that calls `solve()` on every level at startup |
| 57–97 | **Global State + DOM Cache** | 20+ `let`/`const` declarations at module scope |
| 98–107 | **Level Strip Builder** | `buildLevelStrip()` — renders level nav dots |
| 109–124 | **Level Loader** | `loadLevel(i)` — resets all state and rebuilds board |
| 126–173 | **Board Renderer** | `renderBoard()` — creates cell DOM + token DOM |
| 175–202 | **Token Positioner** | `cellMetrics()`, `placeToken(instant)` |
| 204–217 | **Rules Engine** | `legalDestinations()` — pure logic, returns valid moves |
| 219–264 | **State Refresh Tick** | `refreshLegalMoves()` — the central update function |
| 266–298 | **Move Execution** | `attemptMoveTo()`, `doMove()`, `checkWin()` |
| 300–334 | **Solution Path Tools** | `clearSolutionPath()`, `highlightSolutionPath()`, `toggleSolutionPath()` |
| 336–384 | **Dev Mode Tools** | `toggleDevMode()`, `updateDevHud()` |
| 386–420 | **HUD + Game Flow** | `updateHud()`, `undo()`, `restart()`, `showWin()`, `hideWin()`, `nextLevel()` |
| 456–498 | **Toast / Dead-End** | `showToast()`, `showDeadEndToast()`, `clearDeadEndFeedback()` |
| 499–575 | **Event Listeners + Init** | Keyboard, touch, resize, button bindings, `loadLevel(0)` |

### Data Flow (Current)

```
User Input (click / key / swipe)
        |
  attemptMoveTo(r, c) / doMove(r, c)
        |
  Mutates global: player, moveCount, history
        |
  placeToken(false)  -->  CSS transform animation
        | (230ms timeout)
  refreshLegalMoves()   <-- THE CENTRAL TICK
        |
  +-- Updates cell classes (current-cell, legal-dest, dead-end, path-cell)
  +-- Updates token directional arrows
  +-- Dead-end detection --> showDeadEndToast()
  +-- updateDevHud()  -->  writes to dev panel DOM
        |
  checkWin()  -->  showWin()
```

`refreshLegalMoves()` is effectively the game's "render loop" — it is the single function that must be called after every state change to bring the display back into sync.

---

## 2. Major Architectural Problems

### Problem 1 — `refreshLegalMoves()` is doing too many jobs

This single function (lines 219–264) is responsible for:
1. Clearing all visual cell states
2. Marking the current cell
3. Computing legal destinations
4. Marking legal destination cells
5. Detecting dead-end state
6. Triggering dead-end feedback (toast + button animation)
7. Updating four directional arrow states on the token
8. Calling `updateDevHud()`

It is both the **state evaluator** and the **renderer** and the **feedback emitter** all at once. Any new feature that changes move legality (walls, special tiles, tile modifiers from GDD §29) will have to be woven into this function, making it increasingly fragile.

### Problem 2 — No encapsulation of game state

All mutable game state lives as top-level `let` variables:

```js
let levelIndex, player, moveCount, history, completed, animating,
    devModeEnabled, solutionPathVisible, cellEls, tokenEl,
    touchStartX, touchStartY, touchStartTime, deadEndToastTimeout;
```

Any function in `game.js` can read or write any of these at any time. There is no single "source of truth" object, no controlled mutation path, and no way to snapshot or restore state without manually tracking every variable. This becomes dangerous when adding features like undo branching, session persistence, or level transitions with animation states.

### Problem 3 — Dev tools are interleaved with core game logic

`updateDevHud()` is called from `refreshLegalMoves()` and from `updateHud()`. `showWin()` directly reads `devModeEnabled` to decide whether to show the efficiency stat. `toggleDevMode()` calls `toggleSolutionPath()`.

Dev tools are not a concern of the core game — they should observe the game state, not be embedded inside it. As the game grows, these dev-mode branches (`if (devModeEnabled)`) will scatter across all systems.

### Problem 4 — 20+ global DOM references declared at module top

Lines 65–89 cache 20 DOM element references as top-level `const`s. This works, but it means:
- Every system has implicit access to every DOM node, even nodes it has no business touching.
- If an element is ever renamed or restructured in `index.html`, every reference in `game.js` must be found and updated manually.
- `updateDevHud()` calls `document.getElementById("tokenDirUp")` inside the loop (line 253), bypassing the cache entirely — an inconsistency.

### Problem 5 — `legalDestinations()` duplicated in `updateDevHud()`

`refreshLegalMoves()` calls `legalDestinations()` once and uses the result.  
`updateDevHud()` (line 357) calls `legalDestinations()` **again** independently to compute the same direction validity for the dev panel badges.

This is redundant computation and a subtle divergence risk — if the logic in `legalDestinations()` ever changes, the dev panel will show correct data, but only because it re-runs the same function. If someone adds a filter to one call but not the other, the two displays will silently disagree.

### Problem 6 — Touch state is raw globals

`touchStartX`, `touchStartY`, `touchStartTime` are declared at line 530 as bare global variables in the middle of the event listener block. They are not related to game state — they are input state — and they are harder to find and reason about because they appear 400 lines after the other globals.

### Problem 7 — No clear "add a feature here" seam

If a developer wants to add **walls** (GDD §29 Layer 1), they would need to:
- Modify `legalDestinations()` to check wall data
- Modify `renderBoard()` to render wall indicators
- Add wall data to the level schema in `levels.js`
- Potentially modify `refreshLegalMoves()` for visual feedback

There is no clear module boundary. All changes go into the same flat `game.js` file, increasing the risk that a change to walls accidentally breaks the dead-end detection, the dev HUD, or the undo stack.

### Problem 8 — Minor: redundant `if/else` in `renderBoard()`

Lines 148–152:
```js
if (!isGoal) {
  cell.textContent = lv.grid[r][c];
} else {
  cell.textContent = lv.grid[r][c];
}
```
Both branches are identical. This is dead conditional logic that will mislead a future reader into thinking the goal cell is supposed to show different content.

---

## 3. What Is Working Well

These are architectural strengths to preserve:

- **`levels.js` is perfectly isolated.** The data schema (`{name, phase, w, h, start, goal, grid, optimal}`) is clean, extensible, and completely decoupled from game logic.
- **`solve()` is a pure function.** No side effects, no DOM access. It only takes a `level` and optional `fromPos` and returns a result. This is the right shape for a game function.
- **CSS variables are a proper design token system.** All colors, fonts, and spacing are defined in `:root`. No magic values scattered across the file.
- **`legalDestinations()` is pure logic.** Given the global `player` and `currentLevel()`, it computes and returns a value without mutating anything.
- **The animation lock (`animating = true/false`)** prevents input during movement. This is correct and should be preserved.
- **`loadLevel(i)` is the canonical reset point.** It resets all mutable state in one place before rebuilding the board.

---

## 4. Recommended Target Architecture

The recommendation is a **5-module structure** within `game.js`, with clear ownership boundaries. This does not require a build tool, ES modules, or any external dependency — it is achievable with plain JavaScript objects and function grouping.

> **Guiding principle:** Each module owns its own data, exposes a small surface of functions, and communicates with other modules only through those functions — not by reading each other's internal variables.

### The 5 Modules

```
+-----------------------------------------------------------+
|                         game.js                           |
|                                                           |
|  +-----------+   +----------+   +--------------------+   |
|  |   State   |<--|  Rules   |   |     Renderer       |   |
|  |  Module   |   |  Engine  |   |     Module         |   |
|  +-----+-----+   +----+-----+   +----------+---------+   |
|        |              |                    |              |
|        +--------------+--------------------+              |
|                       |                                   |
|               +-------+------+   +--------------------+  |
|               |    Input     |   |     DevTools       |  |
|               |   Handler    |   |      Module        |  |
|               +--------------+   +--------------------+  |
|                                                           |
+-----------------------------------------------------------+
```

---

### Module 1: State

**Owns:**
```js
const State = {
  levelIndex: 0,
  player: null,      // [r, c]
  moveCount: 0,
  history: [],       // stack of {player, moveCount}
  completed: [],     // bool array, one per level
  animating: false,
};
```

**Responsibilities:**
- Single source of truth for all mutable game state
- Exposes controlled mutation methods: `State.reset(level)`, `State.move(pos)`, `State.undo()`, `State.pushHistory()`
- Never touches the DOM directly

**What it does NOT own:**
- Dev flags (`devModeEnabled`, `solutionPathVisible`) — those live in `DevTools`
- Input scratch state (`touchStartX` etc.) — those live in `Input`
- DOM references — those live in `Renderer`

---

### Module 2: Rules Engine

**Owns:**
- `solve(level, fromPos)` — BFS solver
- `legalDestinations(level, player)` — pure function, takes arguments instead of reading globals
- `isDeadEnd(dests, player, level)` — pure predicate
- `isWin(player, level)` — pure predicate
- `validateAll(levels)` — startup validation

**Key principle:** Every function in this module is **pure** — given the same inputs, it returns the same output, with no side effects. It does not read from `State` directly; `State` values are passed as arguments.

**Benefit:** The rules engine is completely testable in isolation. Adding walls, special tiles, or modified movement rules only changes this module.

---

### Module 3: Renderer

**Owns:**
- All DOM references (collected into a single `DOM` object at init time)
- `renderBoard(level, player)` — builds the cell/token DOM
- `renderCellStates(level, player, dests, pathCells)` — applies classes to existing cells
- `placeToken(player, instant)` — positions the token element
- `renderHud(state)` — updates HUD text
- `renderLevelStrip(levels, levelIndex, completed)` — builds level nav
- `renderWinOverlay(level, moveCount, options)` — populates and shows win card
- `showToast(msg, type)`, `clearToast()` — toast notifications

**Key principle:** Renderer functions receive all data as parameters. They do not reach into `State` or `DevTools` by themselves — callers pass what the renderer needs.

**DOM object pattern:**
```js
const DOM = {
  board: document.getElementById("board"),
  hudLevel: document.getElementById("hudLevel"),
  // ... all 20+ refs collected once, in one place
};
```

---

### Module 4: DevTools

**Owns:**
- `devModeEnabled` flag
- `solutionPathVisible` flag
- `toggleDevMode()` — toggles panel visibility
- `updateDevPanel(state, dests)` — renders dev diagnostics; receives state and pre-computed dests as data, does **not** call `legalDestinations()` independently
- `toggleSolutionPath(state)` — calls `solve()` and passes result to Renderer
- `clearSolutionPath()` — delegates to Renderer

**Key separation:** `DevTools.updateDevPanel()` must receive pre-computed `dests` from the same call to `legalDestinations()` that the Renderer uses — eliminating the current redundant computation (Problem 5).

**The dev-mode flag must not leak into core logic.** Instead of `showWin()` reading `devModeEnabled`, the win overlay render function accepts `{ showEfficiency: bool }` as a parameter, and the caller decides what to pass.

---

### Module 5: Input

**Owns:**
- All `addEventListener` calls (keyboard, mouse, touch, resize)
- Touch scratch state (`touchStartX`, `touchStartY`, `touchStartTime`)
- Swipe detection logic
- Button click wiring
- Initialization: `loadLevel(0)`, rules overlay on first load

**Key principle:** Input handlers are "thin" — they translate raw browser events into game actions (`doMove(dir)`, `undo()`, `restart()`) and delegate immediately. They contain no game logic themselves.

---

## 5. Proposed Internal Structure of `game.js`

```
game.js
|
+-- [SECTION 1: Rules Engine]
|   +-- solve(level, fromPos)
|   +-- legalDestinations(level, player)
|   +-- isDeadEnd(dests, player, level)
|   +-- isWin(player, level)
|   +-- validateAll()   <-- called once at end of section
|
+-- [SECTION 2: State]
|   +-- const State = { ... }  with mutation methods
|
+-- [SECTION 3: Renderer]
|   +-- const DOM = { ... }  -- all DOM refs in one place
|   +-- renderBoard(level)
|   +-- renderCellStates(level, player, dests, options)
|   +-- placeToken(player, instant)
|   +-- renderHud(state)
|   +-- renderLevelStrip(levels, state)
|   +-- renderWinOverlay(level, state, options)
|   +-- showToast(msg, type)
|   +-- clearToast()
|
+-- [SECTION 4: DevTools]
|   +-- DevTools state (devModeEnabled, solutionPathVisible)
|   +-- toggleDevMode()
|   +-- updateDevPanel(state, dests)   <-- dests passed in, not re-computed
|   +-- toggleSolutionPath(state)
|
+-- [SECTION 5: Game Loop -- orchestrator]
|   +-- loadLevel(i)
|   +-- tick()          <-- replaces refreshLegalMoves()
|   +-- doMove(r, c)
|   +-- undo()
|   +-- restart()
|   +-- checkWin()
|
+-- [SECTION 6: Input]
    +-- button click listeners
    +-- keydown listener
    +-- touch listeners (with local touchStart* vars)
    +-- resize listener
    +-- init: loadLevel(0), show rules
```

The **Game Loop section** is the orchestrator — it is the only section allowed to call across module boundaries. It calls Rules to evaluate state, calls Renderer to display it, and calls DevTools if dev mode is on.

---

## 6. System Responsibilities and Boundaries

| Module | Reads from | Writes to | Calls |
|---|---|---|---|
| **Rules** | Arguments only | Returns values | Nothing |
| **State** | Itself | Itself | Nothing |
| **Renderer** | Arguments + `DOM` | DOM only | Nothing |
| **DevTools** | Its own flags + arguments | Its own flags + DOM | `Renderer` (path display) |
| **Game Loop** | `State`, Rules results | `State` (via methods) | Rules, Renderer, DevTools |
| **Input** | Browser events | Nothing | Game Loop |

---

## 7. The `tick()` Function — Replacing `refreshLegalMoves()`

The current `refreshLegalMoves()` conflates evaluation with rendering with side effects. The recommended replacement is a single `tick()` function that explicitly sequences the steps:

```js
function tick() {
  const lv = currentLevel();
  const dests = legalDestinations(lv, State.player);   // computed ONCE
  const deadEnd = isDeadEnd(dests, State.player, lv);

  // 1. Render board state — pass dests, not recompute
  renderCellStates(lv, State.player, dests, {
    solutionPath: DevTools.solutionPathVisible ? currentSolutionPath() : null
  });

  // 2. Render token directional arrows
  renderTokenArrows(dests);

  // 3. Dead-end feedback
  if (deadEnd) {
    showDeadEndToast();
    pulseUndoRestart();
  } else {
    clearDeadEndFeedback();
  }

  // 4. Dev panel — only if active, receives pre-computed dests
  if (DevTools.devModeEnabled) {
    DevTools.updateDevPanel(State, dests);
  }
}
```

Each step is visible at a glance. Adding a new feedback type (haptics, sound, particle effect) is a single new line in `tick()`. Adding walls changes only `legalDestinations()` — `tick()` does not change.

---

## 8. Scalability and Extensibility Strategy

The GDD (§29) defines 5 future expansion layers. Here is how each maps to the recommended architecture:

### Layer 1 — Walls (GDD §29)
- **levels.js:** Add `walls: [[r1,c1,r2,c2], ...]` to level objects
- **Rules:** `legalDestinations()` checks wall data — no other module changes
- **Renderer:** `renderBoard()` renders wall indicators on affected cells
- **Other modules:** No changes

### Layer 2 — Changing tile values (GDD §29)
- **State:** Grid values become mutable per-turn; `State` tracks current grid separately from the level definition
- **Rules:** `legalDestinations()` reads `State.grid` instead of `lv.grid`
- **Undo:** `history` entries save a grid snapshot (one-line change in `doMove`)
- **Other modules:** No changes

### Layer 3 — Special tiles (modifiers, teleporters, GDD §29)
- **levels.js:** Add tile type field to grid cell definitions
- **Rules:** `legalDestinations()` applies tile effects post-movement
- **Renderer:** `renderBoard()` renders special tile indicators
- **Other modules:** No changes

### Layer 4 — Procedural generation (GDD §29)
- **New module:** `Generator` — separate file or section, calls `solve()` to validate output
- **No changes** to State, Renderer, Input, or DevTools

### Layer 5 — Meta progression (worlds, stages, GDD §29)
- **New data file:** `worlds.js` alongside `levels.js`
- **State:** Add `worldIndex` alongside `levelIndex`
- **Renderer:** Level strip becomes world-aware
- **Other modules:** No changes

### Adding more levels
- Edit `levels.js` only. `validateAll()` automatically covers new entries. No other file changes.

### Adding new input methods (gamepad, direction menus)
- Add new listener in Input section. Calls the same `doMove()` / `undo()` that keyboard uses. No changes to State, Rules, or Renderer.

---

## 9. Maintainability Improvements

| Issue | Current | Recommended |
|---|---|---|
| State access | 15+ loose `let` globals | `State` object with mutation methods |
| DOM coupling | 20 top-level `const` refs, scattered | `DOM` object in Renderer; only Renderer touches DOM |
| Dev/game coupling | `showWin()` reads `devModeEnabled`; `updateHud()` calls `updateDevHud()` | Renderer accepts `{ showEfficiency }` param; DevTools called only from `tick()` |
| Duplicate computation | `legalDestinations()` called twice per tick | Computed once in `tick()`, passed to Renderer and DevTools |
| Inconsistent DOM access | `document.getElementById("tokenDirUp")` inside loop | Token arrows cached in `DOM`; accessed via `DOM.tokenArrows` |
| Dead conditional | Lines 148–152 both branches identical | Removed — `cell.textContent = lv.grid[r][c]` unconditionally |
| Touch state location | Lines 530–532, buried mid-file | Move to top of Input section |
| Animation flag | Bare `let animating` global | `State.animating` — consistent with other state |

---

## 10. Refactoring Priorities

Ordered from highest value / lowest risk:

| # | Change | Effort | Risk | Value |
|---|---|---|---|---|
| 1 | Extract `State` object | 30 min | Very low — mechanical rename | High |
| 2 | Extract `DOM` object | 20 min | Very low — organizational | High |
| 3 | Replace `refreshLegalMoves()` with `tick()` | 45 min | Low — behavior-preserving | High |
| 4 | Remove dev coupling from `showWin()` / `updateHud()` | 20 min | Low | Medium |
| 5 | Fix duplicate `legalDestinations()` in `updateDevHud()` | 10 min | None | Medium |
| 6 | Fix dead `if/else` in `renderBoard()` (lines 148–152) | 2 min | None | Low |
| 7 | Relocate touch state vars to Input section | 5 min | None | Low |
| 8 | Add section header comments throughout | 15 min | None | Medium |

---

## 11. Risks and Migration Considerations

### Risk 1 — Regression during `tick()` extraction
`refreshLegalMoves()` is called in multiple places: `loadLevel`, `doMove` (via setTimeout), `undo`, `restart`, `renderBoard`. All call sites must be updated.

**Mitigation:** Keep `refreshLegalMoves` as an alias for `tick()` during the transition period, then remove it after full verification.

### Risk 2 — `currentLevel()` after `State` extraction
After `levelIndex` moves inside `State`, `currentLevel()` becomes `LEVELS[State.levelIndex]`. All 10+ usages of `currentLevel()` stay the same — just update the one-line helper function body.

### Risk 3 — `tokenEl` as a renderer-internal detail
Currently a module-level global. After refactor it should live inside the Renderer as internal state (e.g., `Renderer.tokenEl`). Only `placeToken()` and `renderBoard()` touch it — a two-function update.

### Risk 4 — No automated tests
All verification must be done manually. Use the GDD §26 test plan as the acceptance checklist: test understandability (levels 1–3), engagement (levels 4–8), and frustration signals (dead-ends, undo, restart behavior).

---

## 12. Recommended Implementation Order

If approved to proceed:

1. **Add section header comments** to `game.js` marking the 6 logical sections. No code changes — purely documentation. This validates that the section boundaries make sense before touching anything.

2. **Extract `DOM` object** — collect all `document.getElementById` calls into `const DOM = {}`. Fix the stray call inside `refreshLegalMoves`. Play all 10 levels.

3. **Extract `State` object** — convert loose `let` globals into `const State = {}`. Update `currentLevel()`. Play all 10 levels.

4. **Replace `refreshLegalMoves()` with `tick()`** — same behavior, explicit sequenced structure. This is the most important step for future maintainability.

5. **Fix dev coupling** — remove `if (devModeEnabled)` from `showWin()` and `updateHud()`. Pass parameters explicitly. Verify dev mode on/off both produce correct win overlays.

6. **Fix duplicate `legalDestinations()` call** in `updateDevHud()`.

7. **Fix the dead `if/else`** in `renderBoard()`.

8. **Relocate touch state variables** to top of Input section.

9. **Final pass:** Add code comments to document the module structure for future contributors.

---

## 13. Summary Assessment

The prototype is in good shape for its scope. The modular file split (Task 4.2) was correct. The CSS design token system is clean. `solve()` and `legalDestinations()` are well-written pure functions that are already correctly shaped for the recommended architecture.

The core issue is that `game.js` is a flat script rather than a structured program. This is acceptable at 575 lines — the code works and is stable. But each new GDD expansion layer (walls, changing tiles, special cells) will add complexity directly into the already-overloaded `refreshLegalMoves()` and the loose global state block.

The refactoring plan above requires no framework, no build tool, and no external dependencies. It is 9 focused passes through a single file, each of which leaves the game in a fully working state after completion.

**The prototype does not need to be refactored before further design validation.** If the next step is playtesting, the current code is stable enough to support it. If the next step is adding GDD Layer 1 (walls) or more levels, completing Priority 1–3 first will make that work significantly cleaner and safer.

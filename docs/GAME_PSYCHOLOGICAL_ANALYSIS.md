# Grid Leap — Psychological Analysis of the Player Experience

**Scope:** Static analysis of the implemented codebase (rules, loop, feedback, economy, levels, tutorial, daily/achievement systems). No players were observed; no telemetry was analyzed.

**Evidence labels used throughout:**

| Label | Meaning |
|-------|---------|
| **[Game evidence]** | Directly readable in the current implementation (file/line cited). |
| **[Research-supported interpretation]** | Established theory applied as an interpretive lens; not a claim that this game produces the researched effect. |
| **[Hypothesis — requires playtesting]** | Plausible from mechanics, unverified without player data. |

**Method note:** This report reverse-engineers the game from source. Anything not determinable from code is marked **UNKNOWN / REQUIRES PLAYTESTING**. No claim here asserts that playing Grid Leap improves intelligence, memory, attention, or any clinical/cognitive capacity.

---

## 1. Executive Summary

Grid Leap is a deterministic, single-player grid puzzle: the number on the player’s current cell is the exact distance of the next cardinal leap. The player repeatedly chooses among up to four legal landings, each of which rewrites the next set of possibilities, until reaching a goal cell.

**Primary mental work [Game evidence]:** forward evaluation of landing choices — for each legal destination, predict the resulting option set and whether it preserves a route to the goal — under partial information (soft traps and the optimal path are hidden by default; legal moves and BFS distance-to-goal are shown continuously).

**Strongest engagement sources [Game evidence]:** immediate multi-channel feedback on every move; an efficiency score (moves vs. optimal) with tier labels at win; stars, best-move records, achievements, and a daily streak loop.

**Primary learning inside the game [Game evidence]:** fluency with the exact-distance rule; recognition of decoy landings; use of the distance-to-goal signal; chapter-scale patterns of trap structure.

**Biggest psychological weakness risk [Game evidence + Hypothesis]:** the always-on viability HUD (`"N TO GOAL"`) and pulsing legal destinations may close the information gap that would otherwise drive exploration and multi-step search — potentially reducing the game to greedy distance-chasing for some players. Magnitude is **UNKNOWN / REQUIRES PLAYTESTING**.

**Transfer [Hypothesis]:** the game *practices* spatial counting, mental simulation, and hypothesis testing. Whether any of that transfers beyond the game is untested and must not be claimed.

**Positioning:** credible as an **entertainment puzzle** with incidental spatial/logical practice. Not supported as a physics, formal-math, or cognitive-training product without substantial additional design and empirical validation.

---

## 2. Actual Gameplay Analysis

### 2.1 Core rule

**[Game evidence]** `src/core/rules.js:5-24`

- Current cell value `val > 0` defines four candidate landings: `(r±val, c)` and `(r, c±val)`.
- A landing is legal iff it is in bounds and its destination value is not `0`, unless the destination is the goal (`rules.js:18-24`).
- No diagonals, no partial moves, no off-board moves.
- Dead-end state: zero legal destinations and not on goal (`rules.js:32-34`).

### 2.2 Objective, success, failure

| Condition | Behavior | Source |
|-----------|----------|--------|
| Land on goal | Win: audio, haptic, confetti, WIN modal with efficiency/stars/achievements | `main.js:464-471`, `542-610` |
| Land on dead-end cell | −1 heart, dead-end flash 850ms, warning haptic/SFX, **auto-undo after 800ms** | `main.js:424-456` |
| Hearts reach 0 | Auto-undo, then OUT_OF_LIVES modal (watch ad for +1 heart, or restart) | `main.js:437-449`; `index.html:1358-1384` |
| Illegal direction (click/keypress to blocked cell) | Blocked SFX + cell shake; no state change | `main.js:365-372` |

Hearts reset to 3 on level start and on full restart (`game-state.js:161-164`, `main.js:511-540`). **Manual undo does not refund hearts** (`main.js:473+`, comment at 483).

### 2.3 Player actions

**[Game evidence]** `src/scenes/input-router.js`

- **Move:** Arrow keys / WASD, swipe (≥30px, ≤500ms), or click a legal destination.
- **Undo (Z/U):** restore previous position/moves; heart already spent stays spent.
- **Restart (R):** full reset of position, moves, hearts, hint path.
- **Hint (H):** spend hint currency (once per attempt) → solution compass, or if trapped: toast with backtrack count + auto-armed path visibility (`main.js:865-995`).
- **Trail toggle (T/B):** optional breadcrumb path colored by solvability (`main.js:317-321`); default off (`game-state.js:43` `showTrail: false`).
- **Pause / level select / settings / help:** standard modal routing; input blocked while any modal is open (`scene-router.js:60-62`).

### 2.4 What the game shows vs. hides

**Shown continuously [Game evidence]:**

- All tile numbers; start/goal identity.
- Legal destinations: `legal-dest` + `pulse` on every tick (`main.js:302-306`).
- Current cell value or `"GOAL"` in HUD (`main.js:296`).
- Move count; hearts.
- Viability bubble: `"ON TRACK"` / `"N TO GOAL"` from a **live BFS solve every tick** (`main.js:317-322`; `game-renderer.js:1114-1140`).
- Directional token arrows disabled when a direction has no legal exit (`main.js:324-338`).

**Hidden by default [Game evidence]:**

- Optimal move count (revealed only at win; editor/dev only during play) (`main.js:583-585`).
- Full BFS solution path — only via Hint or dev “Show Solution”.
- Soft-trap severity: dead-end/trap coloring on the viability bubble is **silenced unless hint feedback is active** (`game-renderer.js:1121-1131`); during normal play a soft trap renders as `"-- TO GOAL"` rather than a number — a subtle, unexplained difference.
- Difficulty tier of campaign levels (editor legend only).
- Achievement progress until earned; daily board shape until played.

**Interpretation tension [Game evidence]:** the design simultaneously (a) leaks shortest-path *distance* every frame and (b) hides whether the current state is a soft trap (unless the player notices `"--"` vs a number or spends a hint). This is a distinctive information design: distance is scaffolding; trap identity is the puzzle.

### 2.5 Feedback channels

| Channel | Events | Source |
|---------|--------|--------|
| Visual | Legal-dest pulse; current-cell mark; landed flash 160ms; dead-end-hit 850ms; hearts HUD; viability bubble; optional trail; disabled arrows; win constellation sigil; efficiency count-up + tier pill; confetti; toasts | `main.js`, `game-renderer.js`, `confetti-fx.js` |
| Audio | Procedural SFX set: leap, blocked, deadEnd, win, outOfLives, undo, restart, hintOn, trapped, trailToggle, etc. | `audio-engine.js`; `index.html:285-350` |
| Haptic | Light on move, warning on dead-end, success on win | `main.js:401,427,468,607` |
| Meta | Efficiency % (`optimal/actual`, clamp 10–100); tiers FLAWLESS/EXCELLENT/GREAT/GOOD/SOLVED; stars 1–3; best-move record; achievements; daily streak | `main.js:583-585`; `game-renderer.js:1394-1429`; `game-state.js:197-230` |

**Timing rhythm [Game evidence]:** 190ms token glide before logic resolves (`main.js:410-461`); 800ms dead-end pause before auto-undo (`main.js:453-456`) — explicitly commented as a “well-paced pause so player clearly perceives the consequence.” No per-level timer (decisions are untimed).

### 2.6 Resources and decision points

**[Game evidence]**

- **Hearts:** 3 per attempt; spent permanently on dead-end even after undo.
- **Hints:** account-level inventory (default 3); one consumption per level attempt, free re-toggle afterward; premium/desktop/editor unlimited; Play Store can buy via rewarded ad (`main.js:887-917`).
- **Stars:** 1 = clear; 2 = moves ≤ optimal+2; 3 = optimal moves and full hearts (`game-state.js:197-204`).
- **Undo/restart:** unlimited; restart restores hearts.
- **Ads:** interstitial every ≥2 campaign levels (`ad-controller.js:7`).

**Meaningful decisions:**

1. Which of ≤4 legal landings (each yields a different next number and different reachable set).
2. Spend hint vs. continue unaided.
3. After a soft trap: undo (heart already lost) vs. restart (hearts restored).
4. Watch ad for heart/hint vs. free restart.
5. Chase 3-star efficiency vs. merely clear.

### 2.7 Level structure and difficulty

**[Game evidence]** `src/data/levels.js` (100 levels, 10 chapters × 10): Origins → The Pivot → Vectors → Crossroads → The Chasm I/II → Labyrinth I/II → The Citadel → Grand Master. Grids 3×3 → 8×8. Level 1 “Learn Distance” (optimal 1) doubles as live tutorial.

**Difficulty engine** `src/core/solver.js:141-179`:

```
raw = moves×3.5 + decoyCount×1.0 + maxTrapDepth×2.0 + avgBranching×2.5 + √(w·h)×0.8
score = clamp((raw − 7.5)/5.2, 1, 10)
tiers: EASY <3.0 ≤ MEDIUM <5.5 ≤ HARD <8.0 ≤ MASTER
```

All levels validated solvable with stored `optimal` matching BFS (`solver.js:182-198`; `main.js:59`). Daily puzzles: seeded, min moves 4–5, 1095 days proven solvable (`tests/test-daily-solvability.js`).

**Difficulty is structural** (branching, decoys, trap depth, size), **not time pressure**. Whether later chapters introduce qualitatively new *mental operations* vs. the same operation at larger scale is partially visible (size grows) but **qualitative novelty per chapter is UNKNOWN / REQUIRES PLAYTESTING** beyond naming and scale.

### 2.8 Replay, persistence, retention

**[Game evidence]** Session resume restores mid-level state (`main.js:199-244`); best-moves and stars persist (`game-state.js`); 20+ achievements across CAMPAIGN/MASTERY/DAILY/STRATEGY/TIME (`achievement-manager.js`); daily streaks (`daily-manager.js`); optional tutorial of 8 interactive lessons (`tutorial-controller.js:12-175`); review prompt at level 10 (`review-manager.js`).

### 2.9 The loop as a model

The brief’s model **fits this game**, with one amendment:

```
Perceive  →  current number, pulsed legal landings, "N TO GOAL", hearts/moves
Hypothesize →  "If I land on that 3, my next options and distance become…"
Act        →  cardinal leap of exact length N
Observe    →  new number, new distance, or dead-end (−1 heart, auto-return)
Update     →  refine model of the leap-graph (which landings are decoys)
Try again  →  until goal; then efficiency/star feedback tightens the next attempt
```

**Amendment [Game evidence]:** the live BFS distance means the player does not fully *discover* distance-to-goal; they *receive* it. Hypothesis formation is therefore less about “is this state good?” and more about **“which of these landings gets me to a lower distance / avoids a soft trap?”** — unless the player ignores the HUD and searches unaided (possible; HUD is not optional in code).

---

## 3. Core Player Loop

### 3.1 Moment-to-moment (micro loop)

**[Game evidence]** `tick()` (`main.js:278-363`) → input (`input-router.js`) → `attemptMoveTo`/`doMove` (`main.js:365-462`) → dead-end or `checkWin` → `tick()` again.

1. Board refresh: clear classes, mark current, pulse legal destinations, run `solve()`, update viability + trail + arrows.
2. Player selects a direction/landing.
3. 190ms glide + leap SFX + light haptic.
4. On arrival: dead-end branch (lose life / auto-undo / out-of-lives) or win branch.
5. Repeat.

### 3.2 Secondary loops

| Loop | Driver | Goal state |
|------|--------|------------|
| **Efficiency loop** | Win modal: efficiency %, moves/optimal, tier, stars, best-moves | 3-star / FLAWLESS on a cleared level |
| **Campaign loop** | 100 levels, chapter framing, achievements at 25/50/100 | Campaign complete modal |
| **Daily loop** | Seeded daily board, streak, archive navigation, reminder opt-in after first daily win | Streak maintenance |
| **Hint economy loop** | Scarce hints; ad refill on mobile | Solve without spending vs. buy information |
| **Achievement loop** | Optimal N times, flawless runs, time-based awards | Collection completion |

### 3.3 Formal loop statement

**[Game evidence]**

> **Solve** each grid by choosing exact-distance leaps so that each landing keeps (or regains) a path to the goal, while spending as few moves and hearts as possible; **read** immediate feedback to correct the next choice; **compare** the result to the hidden optimal at win; **progress** through campaign, daily, and achievement meta-goals.

---

## 4. Intrinsic Motivation

Framework: Self-Determination Theory (Ryan & Deci, 2000) — autonomy, competence, relatedness — plus challenge, curiosity, control, immediate feedback, meaningful goals. **[Research-supported interpretation]** Applied as lens only.

### 4.1 Challenge

**[Game evidence]** Challenge is created by branching factor, decoy landings, trap depth, and grid size (`solver.js:145-165`), not by timers. Hearts add stakes to wrong landings without blocking undo/restart.

**[Hypothesis — requires playtesting]** Whether challenge tracks player ability across 100 handcrafted levels (vs. spikes or plateaus) is unknown without difficulty telemetry.

### 4.2 Curiosity / discovery

See §5. Mechanics support “what happens if I land here?” experimentation: destination numbers are visible, but trap structure and optimality are not.

### 4.3 Sense of control

**[Game evidence]** Full undo/restart; untimed moves; explicit legal-move highlighting; no randomized mid-level events (daily seed fixed per date). Failure is deterministic and attributable to a chosen landing.

**[Research-supported interpretation]** Perceived control and attributable failure are associated with persistence rather than helplessness (cf. attribution/helplessness literature). Whether players *feel* in control is **UNKNOWN / REQUIRES PLAYTESTING**.

### 4.4 Competence / mastery

**[Game evidence]** Layered mastery signals: clear → stars → best moves → efficiency tier → optimal-move achievements (`optimal_10`, `optimal_25`, `flawless_run`) → campaign completion. Competence feedback is immediate (per move) and deferred-detailed (at win).

### 4.5 Autonomy

**[Game evidence]** Optional: trail, hint, tutorial, relax mode (settings), how many levels to play, whether to optimize. Forced: none of the core rules; ads are interruptive but skippable via economy choices (restart free).

**Relatedness [Game evidence]:** essentially absent in core play (solo). Share card, daily concurrent puzzle, and streaks are thin social proxies. Not a socially mediated experience.

### 4.6 Immediate feedback

**[Game evidence]** Every input yields audio/haptic/visual response within ≤190ms; illegal moves shake; dead-ends flash and auto-correct; win is multi-sensory. This is a strength of the build.

### 4.7 Meaningful goals

**[Game evidence]** Intrinsic goal: reach the goal cell (always clear). Frame goals: 3-star, FLAWLESS, streak, 100-level completion. Meaning of “optimal” is concrete (stored `optimal` per level).

**Overall:** mechanics **support** conditions for challenge, competence, control, and feedback. They do not automatically *produce* intrinsic motivation in a given player.

---

## 5. Curiosity

### 5.1 What the player wants to discover

**[Game evidence]**

- Which landings are productive vs. decoys (`decoyCount = reachable − path` in `solver.js:59`).
- Whether the current branch is a soft trap (unsolvable but still has legal moves).
- The optimal route and move count (hidden until win).
- Structure of the daily board (hidden until played).

### 5.2 Information gaps

| Gap | Status in code |
|-----|----------------|
| Legal moves | **Closed** — always pulsed |
| Distance to goal | **Mostly closed** — `"N TO GOAL"` every tick when solvable |
| Soft trap | **Open** — trap styling only with hint feedback; default shows `"-- TO GOAL"` (unexplained) |
| Optimal path/count | **Open** until win or hint |
| Dead-end ahead | **Open** until landing (tick dead-end class gated on `solutionPathVisible`, `main.js:308-315`) |

**[Game evidence]** Loewenstein’s information-gap account **[Research-supported interpretation]**: curiosity rises when a person believes a gap is both identifiable and closable. The game *names* some gaps (efficiency revealed at win; hint closes path gap) but *partially closes* the distance gap continuously — a design tension.

### 5.3 “What happens if I do this?”

**[Game evidence]** Experimentation is cheap: each destination’s number is visible before commitment; undo/restart are free of currency (hearts only drop on *landing* a dead-end). Experimenting with *which number you stand on* is the core act.

### 5.4 Aha moments (plausible)

**[Hypothesis — requires playtesting]** Candidates:

- Recognizing that a “safe-looking” landing enters `-- TO GOAL` / trap.
- Seeing FLAWLESS after a predicted optimal line.
- Discovering that a large number overshoots useful region (0-cells / bounds).
- Tutorial lesson where chaining 1→goal only works via a specific turn.

Whether players report these moments is unknown.

### 5.5 Does experimentation produce useful information?

**[Game evidence]** Yes for local structure (landing → next option set). Partially for global structure (distance HUD gives global signal; full topology still requires search or hint). Memory of past dead branches is aided only if the player enables trail (`showTrail` default false).

---

## 6. Challenge & Mastery

### 6.1 How difficulty is created

**[Game evidence]** Formula in §2.7: longer optimal paths, more decoy cells, deeper trap subgraphs, higher average branching, larger grids. Campaign narrative scales size 3×3→8×8 across named phases.

### 6.2 Genuine reasoning vs. arbitrary complexity

**[Game evidence]** The rule is one sentence; complexity emerges from composition (each leap rewrites reachability), not from opaque extra systems. That is **reasoning-loaded difficulty** rather than hidden-rule difficulty.

**Counterweight [Game evidence]:** because legal moves and distance are shown, a player can apply a **greedy heuristic** (“pick the landing that minimizes N TO GOAL”) without deeper search. Whether greedy play fails often enough to force real lookahead is **UNKNOWN / REQUIRES PLAYTESTING** — this is the central challenge-integrity question.

### 6.3 Can player skill improve?

**[Game evidence]** Skill proxies in code: efficiency %, best-moves, optimal achievements, stars. Improvement is measurable by the game itself. Skills plausibly trained: exact-distance prediction, decoy recognition, multi-move planning on large boards.

### 6.4 Challenge–skill progression

**[Game evidence]** Designer intent: chapter progression + score tiers (`EASY…MASTER`). Player-facing: no adaptive difficulty; fixed 100 levels + daily.

**[Research-supported interpretation]** Flow-like balance requires challenge to track ability (Csikszentmihalyi; Nakamura & Csikszentmihalyi). Fixed curves suit players near the curve; others undershoot/overshoot.

### 6.5 Are mistakes informative?

**[Game evidence]**

- Dead-end: unmistakable (flash, −1 heart, SFX, haptic, auto-undo) — high-quality error signal for *immediate* wrong landing.
- Soft trap: weak signal until hint or noticed `"--"` — **error signal quality is asymmetric**.
- Efficiency gap at win: retrospective, does not show *which* move was suboptimal — player must infer.

### 6.6 Do successes feel earned?

**[Game evidence]** Win requires actually reaching the goal; hints cost currency; no autoplay in consumer path (dev stepper gated). Efficiency tiers reward clean execution. Earned-ness is plausible; entitlement to FLAWLESS specifically depends on hidden optimal being discoverable — partially scaffolded by distance HUD.

---

## 7. Cognitive Processes

Only processes the mechanics actually engage.

### 7.1 Spatial reasoning — **strongly supported**

**[Game evidence]** Cardinal axes; exact row/column counting by N; bounds and 0-cell geometry; mental map of a numbered grid; relative position of start/goal.

- Position, direction, distance, geometry (Manhattan/cardinal only), relative movement: **yes**.
- Rich 3D/metric spatial cognition: **no** (not that kind of game).

### 7.2 Prediction — **strongly supported**

**[Game evidence]** Core decision is: given current `val` and four landings, what will the next option set be? Destination numbers are shown, so prediction is *partially given* for one step; multi-step prediction (landing → landing → …) is not shown except via hint path.

Mental simulation depth of typical players: **UNKNOWN / REQUIRES PLAYTESTING**.

### 7.3 Planning — **supported, depth varies**

**[Game evidence]** Longer optima in later levels (e.g. 6+ steps targeted by `long_distance` achievement) require sequences, not single moves. Alternative evaluation is implicit among ≤4 branches per state.

Whether players plan depth-2, depth-4, or only greedy-1: **UNKNOWN / REQUIRES PLAYTESTING**.

### 7.4 Problem solving — **supported**

Hypothesis (“this landing keeps a route”) → test (move) → observe (distance/dead-end/win) → revise (undo/restart). Constraints (bounds, 0-cells, exact N) are stable and learnable. Strategy revision is available but heart economy penalizes discovering dead-ends (revision after failure costs a heart even with undo).

### 7.5 Mental models — **supported**

**[Game evidence]** The system is a deterministic directed graph of cells. Players can form: “numbers are leap lengths,” “0 is void,” “landing X opens set Y,” “large numbers can strand you.” The viability HUD externalizes part of this model (distance), which may *support* model-building or *replace* it — competing hypotheses (§19).

### 7.6 Systems thinking — **limited but real**

Supported claim: **changing the landing changes the future option set** (local feedback structure of a state machine). Not supported: multi-variable interconnected systems, delayed global side effects, resource markets, etc.

### 7.7 Attention — **supported**

- **Selective:** focus among ≤4 pulsed targets; ignore decorative UI.
- **Sustained:** multi-move levels without time pressure still require maintaining goal orientation.
- **Multiple objects:** monitor distance bubble, hearts, current number, goal position.
- **Change detection:** pulse on new legal set; dead-end flash; tier pop at win.

**Not** a high-speed vigilance task (no timers).

### 7.8 Working memory — **supported**

Hold: current plan; rule (exact N); recent dead branch (if trail off); remaining hearts/hints as constraints; for efficiency, remembered best-moves (shown at win only). Trail default-off increases WM load for path history.

### 7.9 Cognitive flexibility — **supported**

Abandon a branch when distance degrades or trap appears; switch from “get closer” to “detour through higher number”; switch from unhinted search to spending a hint; switch from optimize to just-survive when hearts are low.

### 7.10 Metacognition — **partially supported**

**[Game evidence]** Encourages: efficiency % asks “how efficient was I?”; trap toast can report “Undo N moves”; achievements contrast optimal vs. actual. Does **not** explain *which* decision was wrong.

**[Hypothesis]** Reflection quality depends on player disposition and on whether they use hint/trail diagnostically.

---

## 8. Problem Solving

### 8.1 Cycle present in code

**[Game evidence]**

| Phase | In-game correlate |
|-------|-------------------|
| Form hypothesis | Choice among pulsed landings; optional read of `"N TO GOAL"` |
| Test | Execute leap |
| Observe | New number, new distance, dead-end, win stats |
| Identify constraints | Bounds, 0-cells, trap branches, heart count |
| Revise | Undo, restart, hint, different landing sequence |

### 8.2 Constraint discovery

**[Game evidence]** Rules modal + 8-lesson tutorial + Level 1. Constraints are simple and taught. Ongoing constraint: soft-trap topology (not taught explicitly; discovered by failure or hint).

### 8.3 Decomposition

Natural decomposition: one leap at a time; each state is a small decision problem (≤4 options). Whole-level problem = path through leap-graph. This is **state-space search** in player form.

### 8.4 Trial-and-error vs. reasoning — honest balance

**[Game evidence]**

- Trial-and-error is **cheap** (free undo/restart) but **heart-penalized** on actual dead-end landings.
- Reasoning is **scaffolded** (distance HUD, pulses) which lowers pure-search demand.
- Hint converts reasoning into execution of a given path (compass).

**[Hypothesis]** Net balance between greedy HUD-following, deliberate search, and brute trial-and-error is a primary empirical question.

---

## 9. Mental Models & Systems Thinking

### 9.1 Model the game teaches operationally

**[Game evidence]** Implicit curriculum across tutorial + campaign:

1. Number = exact leap distance (lessons 1–3).
2. Chaining / boost / turns (lessons 4–7).
3. Dead-end existence (lesson 8; hearts system).
4. Distance-to-goal as progress signal (HUD).
5. Decoys and trap depth (harder chapters; hint diagnostics).

### 9.2 Internal model candidates

- **Leap-graph model:** cells are nodes; value defines out-edges. Directly matches `rules.js` + `solver.js`.
- **Greedy distance model:** always minimize displayed N. May fail when shortest displayed path requires a non-obvious intermediate — **needs playtest** whether HUD-greedy is ever wrong (BFS distance *is* optimal remaining hops, so minimizing distance each step *can* still require choosing among equal-distance or non-greedy-looking landings that preserve solvability; equal-distance branches and trap adjacency remain the subtle part).

*Technical note [Game evidence]:* because the bubble shows true BFS remaining moves, a player who can see all pulsed landings’ *future* distances cannot directly see destination distances without moving — destination tiles show **cell numbers**, not their distances. So one-step lookahead is **not** free: you see landing values, not landing-to-goal distances. **This preserves genuine evaluation work** — important counter to the “HUD spoils everything” concern.

### 9.3 Systems-style insight

Supported: “my choice of landing rewrites my future choices.” Not supported: broader systems causality.

---

## 10. Learning Inside the Game

### A. Game-specific learning — **demonstrated by design**

**[Game evidence]**

- Exact-distance rule fluency.
- 0-cell / bounds illegality.
- Legal-set reading (pulses/arrows).
- Interpretation of `"N TO GOAL"` / `"ON TRACK"` / `"--"` / hearts.
- Local chapter patterns (names suggest themes: pivot, vectors, chasm, labyrinth — thematic labels only; mechanical novelty per chapter **UNKNOWN / REQUIRES PLAYTESTING** beyond size/complexity metrics).
- Efficiency norms: optimal exists; FLAWLESS = optimal + full hearts.
- Hint economy: once per attempt; trap toast semantics.

### B. Transferable cognitive practice — **practice only, not proven transfer**

| Mechanic | Mental process | Potential skill practice |
|----------|----------------|---------------------------|
| Exact row/col counting by N | Spatial indexing, mental number-line on 2D grid | Spatial quantification |
| Evaluating ≤4 landings | Branch comparison, if-then simulation | Hypothetico-deductive micro-cycle |
| Avoiding trap branches | Constraint tracking, lookahead | Planning under constraints |
| Optimizing moves vs. optimal | Efficiency search, self-evaluation | Optimization mindset / metacognition |
| Undo after bad model update | Strategy revision, cognitive flexibility | Abandoning sunk choices |
| Daily timed-by-calendar commitment | Prospective memory (mild) | Habit formation around practice |

**[Research-supported interpretation]** Spatial training can transfer to some spatial tasks (Uttal et al., 2013 meta-analysis), with transfer strongly task- and population-dependent. Problem-solving and video-game transfer literatures are mixed (e.g., Sala et al. debates; single-repo vs. far transfer).

**Do not claim [critical]:** that Grid Leap raises IQ, attention span, working-memory capacity, math grades, or driving ability. Those require direct empirical testing on this game.

### C. Knowledge acquisition — **informal intuition only**

| Domain | Status |
|--------|--------|
| Informal graph/path reasoning | **Intuitive experience** of state-space and reachability |
| Formal graph theory (BFS, shortest path, decoys as non-goal-reachable set) | **Not taught** — solver is internal; player never sees BFS explained |
| Arithmetic | Minimal (compare N; no computation beyond counting cells) |
| Physics / orbital / formal science | **Not present** |
| Scientific reasoning | **Micro-scale:** hypothesis → test → revise is *practiced* as a loop, not framed as methodology |
| Geometry | Informal discrete geometry (grid, cardinal direction only) |

**Distinction:** a player can *experience* “some states cannot reach the goal” without learning the term *dead state* or how reverse BFS finds `canReachGoalSet` (`solver.js:70-95`).

---

## 11. Potential Transferable Skills

**Framing:** *Mechanic → process → practice.* Practice ≠ improvement. Improvement ≠ transfer. Transfer ≠ retained far transfer.

1. **Spatial counting on grids** → visuospatial working memory / counting → practice similar grid estimation tasks. *Far transfer untested.*
2. **Multi-step prediction** → mental simulation → practice lookahead habits. *Untested outside game.*
3. **Hypothesis testing** → scientific micro-loop → practice iterative debugging-like thinking. *Untested.*
4. **Efficiency evaluation** → comparing actual vs. optimal → practice self-monitoring. *Untested.*
5. **Constraint satisfaction** → rules + resources (hearts/hints) → practice tradeoff reasoning. *Untested.*

**[Hypothesis — requires playtesting]** Any transfer claim needs pre/post measures on non-game tasks with active controls. Absent that: **no transfer claims.**

---

## 12. Scientific / Educational Learning Potential

### What current mechanics support

**[Game evidence]**

- Clear causal rules; deterministic outcomes; no hidden randomness in campaign.
- Implicit reachability, path length, optimal vs. actual.
- Tutorial that teaches by doing (8 lessons).
- Immediate feedback and retry — aligned with drill/practice pedagogy for *this micro-rule*.

### What they do not support

- No explanatory layer for *why* a path fails beyond trap toast.
- No formal vocabulary, no reflection questions, no assessment of understanding beyond completion/efficiency.
- No subject-matter embedding (physics contexts, data, models).
- Ads/hearts/stars frame the experience as **entertainment progression**, not instruction.

### Positioning verdict

| Positioning | Verdict |
|-------------|---------|
| Entertainment puzzle | **Yes — primary fit** |
| Educational puzzle (light) | **Defensible only as “puzzles that exercise spatial planning” without efficacy claims** |
| Physics learning game | **No** |
| Scientific visualization | **No** |
| Cognitive-training-like | **Not without clinical/educational validation; do not market as such** |
| Simulation/puzzle hybrid | **No simulation of external systems** — pure abstract puzzle |

### What would be needed for credible educational claims

1. Explicit concept objectives (e.g., “shortest path,” “state space”).
2. Scaffolding that surfaces solver logic (why trap, not just that trap).
3. Reflection/assessment items measuring conceptual change.
4. Alignment to a curriculum standard if marketed to schools.
5. Empirical evaluation vs. active control.

None of these exist in the current build **[Game evidence]**.

---

## 13. Failure Psychology

### 13.1 What failure communicates

| Failure type | Message to player | Code |
|--------------|-------------------|------|
| Illegal move | “Not a legal direction/landing” | shake + blocked SFX |
| Dead-end landing | “This state has no exits; you lose a heart; return to previous” | flash, −1, auto-undo 800ms |
| Soft trap | Weak: `"-- TO GOAL"` or silence until hint | `game-renderer.js:1127-1130` |
| Out of lives | Stop / pay (ad) / restart | modal |
| Suboptimal win | “You solved it, inefficiently” | efficiency % + tier |

### 13.2 Is failure informative?

- **Dead-end:** highly informative for *that* landing; auto-undo immediately restores a solvable context (player rarely stuck on the failure square).
- **Soft trap:** poorly informative without hint — risk of **repetitive error without learning** until the player connects `"--"` or spends a hint.
- **Efficiency miss:** informative in aggregate, not in localization.

### 13.3 Retry friction

**[Game evidence]** Low: auto-undo, unlimited manual undo/restart, session save, no per-move fail state beyond hearts. Hearts **do not** restore on undo — only on restart/next level. So “retry” after a dead-end is spatially free but **score-economically costly** (3-star needs full hearts).

### 13.4 Encourages experimentation?

**[Game evidence]** Yes for non-dead-end exploration (free undo). **Partially damped** for exploring *risky* landings because dead-ends permanently tax the star attempt. Players optimizing stars may **avoid experimentation** once they fear traps — a plausible engagement tradeoff **[Hypothesis]**.

### 13.5 Arbitrariness

Failure is deterministic and rule-governed — not random. Perceived arbitrariness should be low **if** the player understands exact-distance rules (taught). If a player does not connect soft-trap silence to the HUD, failures can *feel* arbitrary — **[Hypothesis]**.

### 13.6 Risks

| Risk | Assessment from code |
|------|----------------------|
| Frustration | Moderate: ads at fail (mobile), hearts not refunded on undo, hidden optimal |
| Confusion | Low–moderate: soft-trap signal is subtle |
| Learned helplessness | Low: restart always restores hearts; deterministic rules |
| Trial-and-error without learning | **Real risk** on trap-heavy boards if HUD-greedy + brute undo dominates |
| Excessive cognitive load | Low on 3×3–4×4; grows with 8×8 + no trail; **UNKNOWN** empirically |
| Monetization-at-failure | OUT_OF_LIVES prioritizes rewarded ad — can feel punitive **[Game evidence]** |

**[Research-supported interpretation]** Informative feedback and controllable retry support learning from errors; unexplained errors can produce confusion or guessing strategies (error-feedback literature in learning science). Grid Leap implements the former for dead-ends and the latter-leaning path for soft traps unless hints are used.

---

## 14. Flow & Engagement

### Conditions present in the design

**[Game evidence]**

- Clear objective (goal cell) — **yes**.
- Immediate feedback — **yes** (strong).
- Player control — **yes** (undo/restart; no time pressure).
- Increasing mastery signals — **yes** (stars, efficiency, achievements, campaign).
- Low unnecessary friction — **mostly** (quick moves; modals/ads insert friction on mobile).
- Appropriate challenge — **varies** fixed curve vs. player skill; HUD may reduce challenge for some.

### Honest statement

**The design contains conditions that could support a flow-like experience** for players whose skill matches level difficulty and who find the distance scaffold motivating rather than spoiling.

**It does not follow that players enter flow.** Flow is a reported state; **UNKNOWN / REQUIRES PLAYTESTING** (experience sampling, challenge-skill ratings).

### Engagement threats (design-level)

Interstitial cadence (every 2 levels), hint scarcity→ads, and fixed difficulty for off-curve players can break absorption **[Game evidence + Hypothesis]**.

---

## 15. Player Archetypes

Not ranked. Why the mechanic may appeal:

| Archetype | Why the mechanic may appeal |
|-----------|-----------------------------|
| **Puzzle-oriented players** | Small ruleset, high positional meaning, discrete solutions |
| **Spatial thinkers** | Cardinal counting and grid mental maps are core |
| **Optimization players** | Hidden optimal, efficiency %, FLAWLESS, best-moves, optimal achievements |
| **Experimenters** | Cheap undo; “what does this number open?” |
| **Systems/state-space thinkers** | Landing rewrites future options; trap subgraphs |
| **Casual problem solvers** | Short levels, no timer, tutorial, relax-friendly restart |
| **Daily ritual / completionist** | Streaks, achievements, 100-level campaign, archive |
| **Physics enthusiasts** | **Weak fit** — no physical simulation; only discrete metric leaps |

**UNKNOWN / REQUIRES PLAYTESTING:** actual audience composition vs. designer intent.

---

## 16. Why Players May Want to Play

From the player’s perspective, motivations **actually supported by mechanics**:

1. **“I want to understand how this leap system behaves.”** — rule clarity + discoverable traps.
2. **“I want to predict correctly.”** — every move is a prediction with immediate truth.
3. **“I want to find the optimal solution.”** — optimal hidden until win; stars/FLAWLESS.
4. **“I want to master increasingly large grids.”** — 3×3→8×8 campaign arc.
5. **“I enjoy efficient solutions.”** — efficiency tiers and best-move records.
6. **“I want a daily bite-sized puzzle ritual.”** — daily + streak.
7. **“I like low-friction, no-timer brain snacks.”** — untimed, restartable, mobile-friendly.

**Not supported (do not pitch):** narrative attachment, creative expression, multiplayer competition, physical skill, real-world knowledge domains.

---

## 17. Psychological Weaknesses

Each tied to implementation evidence.

### 17.1 Distance HUD may collapse the information gap

**[Game evidence]** `solve()` every tick; `"N TO GOAL"` displayed (`game-renderer.js:1134-1137`).  
**Effect hypothesis:** turns “is this state good?” into “which pulse lowers the number?” — less discovery, more hill-climbing.  
**Residual work:** destination *distances* are not displayed (only cell values), so lookahead is not fully automated — mitigates but does not eliminate the concern.  
**Label:** **[Hypothesis — requires playtesting]**

### 17.2 Legal-dest pulsing reduces spatial search

**[Game evidence]** Player need not mentally compute all four landings’ legality; the board highlights them. Simplifies onboarding; may underserve players who want pure mental spatial practice.

### 17.3 Difficulty may become scale, not new reasoning

**[Game evidence]** Primary progression levers in data: grid size, stored optimal length, formula inputs. Chapter names differ more than the rule does.  
**Risk:** later levels = same mental operation, larger canvas → boredom for players who already “got it”; or load (more cells to scan) mistaken for depth.  
**Qualitative per-chapter mechanics:** largely same rule system — **novelty beyond size/structure: limited [Game evidence]**.

### 17.4 Soft-trap feedback does not explain failure

**[Game evidence]** Silent `"--"`; trap explanation gated on hint usage.  
**Risk:** guessing loops; unfair-feeling deaths; hint hoarding then sudden spoiler.  
**Metacognition prompt is weak** without hint.

### 17.5 Optimal hidden during play

**[Game evidence]** Efficiency only at win.  
**Risk:** players cannot aim at FLAWLESS mid-level; may replay blindly rather than reason about optimality. Achievements push optimality without in-level target distance beyond the BFS hop count (hop count ≠ full optimal *route* when equal-distance forks exist).

### 17.6 Trial-and-error can dominate if hearts feel disposable

**[Game evidence]** Unlimited restart restores 3 hearts. A player can farm attempts.  
**Risk:** if learning does not accumulate (no “why” feedback), repetition without model improvement.  
**Counter:** free restart also prevents lockout — double-edged.

### 17.7 Heart cost vs. undo creates approach-avoidance

**[Game evidence]** Undo does not refund heart (`main.js` comment 483); 3-star needs full hearts.  
**Risk:** cautious play, overuse of hints, or resignation from perfection goals; or opposite — ignore hearts and never pursue mastery metrics.

### 17.8 Monetization friction at emotional peaks

**[Game evidence]** OUT_OF_LIVES modal leads with rewarded ad; interstitials every 2 levels.  
**Risk:** breaks cognitive rhythm; failure associated with ads → external frustration attribution **[Hypothesis]**.

### 17.9 Insufficient novelty surfaces

**[Game evidence]** No mid-campaign mechanic unlocks (no new tile types in `rules.js`); trail/hint are toggles, not new verbs.  
**Risk:** 100 levels of one verb; retention relies on structure+meta (daily, stars, achievements).

### 17.10 Social vacuum

**[Game evidence]** No leaderboards/async competition in core loop (share is outward-facing only).  
**Risk:** weak relatedness; completionists and self-competitive players over-index.

### 17.11 Cognitive load growth on 8×8 without default trail

**[Game evidence]** `showTrail: false` default; scanning 64 cells; WM for visited bad branches.  
**Risk:** overload → hint dependence or abandonment. Load profile **UNKNOWN / REQUIRES PLAYTESTING**.

---

## 18. Research Evidence

Used to establish **framework**, not to prove benefits of Grid Leap.

| Theme | Anchors (examples) | How used here |
|-------|--------------------|---------------|
| Intrinsic motivation / SDT | Ryan & Deci (2000, 2017) | Lens for autonomy/competence/relatedness mapping (§4) |
| Flow | Csikszentmihalyi (1990); Nakamura & Csikszentmihalyi (2002) | Checklist of design *conditions*, not experienced flow (§14) |
| Curiosity / information gap | Loewenstein (1994); Kidd & Hayden (2015) | Analyze closed vs. open gaps (§5) |
| Challenge–skill balance | Csikszentmihalyi; ability-appropriate challenge in game learning (e.g., Hamari et al.; Admiraal et al. reviews) | Challenge progression discussion (§6) |
| Error feedback & learning | Feedback meta-analyses (e.g., Hattie & Timperley; Shute) | Informative vs. opaque failure (§13) |
| Spatial cognition transfer | Uttal et al. (2013) meta-analysis; Newcombe | Limits of spatial transfer claims (§11) |
| Game-based learning | Wouters et al. (2013); Sala & Gobet on far transfer skepticism | Separate engagement from efficacy (§10–12) |
| Problem solving / transfer | Barnett & Ceci (2002) taxonomies of near/far transfer | Boundary on educational claims (§12) |
| Search / problem spaces | Newell & Simon; Chase (chess expertise) | Leap-graph as state-space search (§8–9) |
| Self-regulated learning / metacognition | Flavell; Zimmerman | Efficiency-driven reflection (§7.10) |

**Label discipline:**

- **Evidence from the game** = code/design facts (§2, cited lines).
- **Research-supported interpretation** = applying the above to those facts.
- **Hypothesis requiring playtesting** = all claims about what *players* feel, learn, improve, or transfer (§19).

**No citation in this section should be read as proof that Grid Leap produces the cited effect.**

---

## 19. Hypotheses Requiring Playtesting

1. Does the `"N TO GOAL"` bubble reduce exploration of non-obvious routes (fewer unique paths per level) compared to a build without it?  
2. Can greedy distance minimization solve most campaign levels, or do equal-distance forks and trap adjacency force multi-step lookahead?  
3. Do players notice and interpret `"-- TO GOAL"` without a hint? At what rate?  
4. Does non-refunded heart-on-undo increase hint use, restart use, or abandonment of 3-star goals?  
5. Do efficiency tiers drive voluntary replay for FLAWLESS, and does that replay involve reasoning vs. memorized lines?  
6. Across chapters, do players report new *kinds* of thinking or only “bigger grids”?  
7. Soft-trap: what fraction of playtime is spent in unsolvable states before detection?  
8. Does trail-off default measurably increase WM errors or hint reliance on 6×6+ boards?  
9. Are OUT_OF_LIVES ad modals associated with session exit (telemetry needed)?  
10. Do tutorial completers outperform rules-modal-only players on early efficiency (A/B)?  
11. Experience sampling: how often do players report absorption/flow vs. boredom vs. confusion?  
12. Any near-transfer to unrelated grid/counting tasks? (Requires controlled study; do not assume.)  
13. Daily streaks: do they predict return better than campaign progress alone?  
14. Heart economy: approach-avoidance — do low-heart states change risk preference of landing choice?

**Without such data, treat player-experience outcomes as UNKNOWN.**

---

## 20. Final Psychological Profile

### Player Experience

**Primary motivation:**  
Competence/optimization — predict the correct landing sequence, reach the goal efficiently, and prove it with efficiency %, stars, and best-moves **[Game evidence: win/economy systems]**.

**Primary cognitive activity:**  
One-step-to-few-step forward simulation on a cardinal leap-graph: “given N and these pulsed landings, which choice preserves (or regains) a route with fewer hops?” **[Game evidence: rules + viability HUD + hidden destination distances]**.

**Core psychological loop:**

```text
Read number + pulses + "N TO GOAL"
        ↓
Hypothesize best landing (cell value ≠ shown future distance)
        ↓
Leap (190ms) → observe new state
        ↓
If dead-end → heart −1, auto-return, revised belief about branch
If better/worse distance → reinforce/update leap-graph model
        ↓
Reach goal → efficiency vs hidden optimal → tier/stars/best
        ↓
Mastery signal → next level / replay for FLAWLESS / daily streak
        ↓
Curiosity & challenge again
```

**Primary learning inside the game:**  
Rule fluency; decoy vs. viable landing discrimination; meaning of distance bubble/`"--"`/hearts; local trap structure; that optimality is a measurable, improvable quantity **[Game evidence]**.

**Potential transferable practice:**  
Spatial cell-counting, if-then mental simulation, hypothesis revision, efficiency self-monitoring — **practice only; transfer untested** **[Hypothesis]**.

**Strongest source of engagement:**  
Immediate, multi-sensory feedback on deterministic moves plus a clear mastery ladder (clear → efficient → flawless → meta-completion) **[Game evidence]**.

**Biggest psychological weakness:**  
Opaque soft-trap communication combined with always-on distance scaffolding: risk of either **greedy low-insight play** (HUD followers) or **confused trial-and-error** (players who miss `"--"` and hoard hints) — and a 100-level campaign whose verb set barely changes **[Game evidence + Hypothesis]**.

**Most important design opportunity:**  
Make the leap-graph *thinkable* without spoiling it — e.g., clearer but non-spoiling trap feedback, optional “show distances for pulsed landings” as a deliberate tool, mid-level optimality scaffolds (par display), and chapter mechanics that change *what* is reasoned about, not only board size — then **validate with playtests** before any educational or cognitive-benefit positioning **[Recommendation grounded in §17–19]**.

---

## Appendix A — Key code references

| Topic | Location |
|-------|----------|
| Movement rules | `src/core/rules.js` |
| BFS + difficulty | `src/core/solver.js` |
| Tick, move, dead-end, win | `src/main.js:278-610` |
| Hint economy & trap diagnostics | `src/main.js:865-995` |
| Viability HUD | `src/scenes/game-renderer.js:1085-1142` |
| Win presentation | `src/scenes/game-renderer.js:1394-1429` |
| Hearts/hints/stars | `src/state/game-state.js` |
| Input | `src/scenes/input-router.js` |
| Campaign | `src/data/levels.js` |
| Tutorial | `src/scenes/tutorial-controller.js` |
| Achievements | `src/state/achievement-manager.js` |
| Daily | `src/core/daily-generator.js`, `src/state/daily-manager.js` |
| Ads | `src/scenes/ad-controller.js` |
| Intended decision framing | `docs/Number Grid Maze — Vertical Slice Design Document.md` §7–8 |

## Appendix B — Claim checklist (compliance)

- [x] Analyzed implemented mechanics, not imagined ones  
- [x] Distinguished demonstrated requirements, plausible cognition, practice, in-game learning, transfer hypotheses  
- [x] No intelligence/memory/attention improvement claims  
- [x] No clinical/diagnostic language about players  
- [x] Research used as framework, labeled separately from game evidence  
- [x] Unknowns marked **UNKNOWN / REQUIRES PLAYTESTING**  
- [x] Single new file written; no codebase modifications  

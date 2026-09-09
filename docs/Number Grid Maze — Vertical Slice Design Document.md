# Number Grid Maze
## Vertical Slice Design Document

**Prototype Platform:** Web  
**Prototype Technology:** Simple HTML, CSS, and JavaScript  
**Primary Goal:** Validate the core puzzle mechanic and player decision-making

---

## 1. Concept

A 2D grid-based puzzle game in which every cell contains a number.

The number in the player's current cell determines how many grid cells the player must move. The player can choose **any of the four cardinal directions**:

- Up
- Down
- Left
- Right

The objective is to navigate from a **Start** cell to a **Goal** cell by selecting the correct sequence of directions.

The fundamental rule is:

> **The number on the current cell determines the exact distance of the next movement.**

Example:

```text
        ↑
        │
        3
        │
←  ←  [3]  →  →  →
        │
        3
        ↓
```

Standing on a `3` means the player can move exactly three cells in any valid cardinal direction.

---

# 2. Vertical Slice Objective

The vertical slice should answer five questions:

1. Is the basic movement mechanic understandable?
2. Is choosing between multiple possible destinations interesting?
3. Does the player naturally think about the number on the **next** cell?
4. Can small puzzles create meaningful planning?
5. Is the mechanic strong enough to support a complete game?

The prototype should **not** attempt to answer questions about monetization, long-term progression, narrative, or final visual style.

---

# 3. Scope

### Included

- 2D square grid
- Numbered cells
- Start cell
- Goal cell
- Exact-distance movement
- Four-direction movement
- Legal-move highlighting
- Player movement
- Win detection
- Restart
- Undo
- A small set of handcrafted levels
- Basic level progression
- Move counter
- Simple animations
- Basic responsive layout

### Not Included

- Accounts
- Backend
- Multiplayer
- Ads
- In-app purchases
- Procedural generation
- Complex special tiles
- Leaderboards
- Sound/music system
- Narrative
- 3D
- Advanced visual effects

---

# 4. Core Gameplay Rules

## Rule 1 — Every cell contains a number

Example:

```text
┌───┬───┬───┬───┬───┐
│ 2 │ 1 │ 3 │ 2 │ 1 │
├───┼───┼───┼───┼───┤
│ 1 │ 3 │ 2 │ 4 │ 2 │
├───┼───┼───┼───┼───┤
│ 2 │ 4 │ 1 │ 3 │ 1 │
├───┼───┼───┼───┼───┤
│ 3 │ 1 │ 2 │ 1 │ 4 │
├───┼───┼───┼───┼───┤
│ S │ 2 │ 3 │ 2 │ G │
└───┴───┴───┴───┴───┘
```

Numbers should initially be limited to **1–4**.

---

# 5. Movement

If the player is standing on a cell containing `N`, the player must move exactly `N` cells.

For example:

```text
Current cell = 3
```

Possible movement:

```text
↑ 3 cells

↓ 3 cells

← 3 cells

→ 3 cells
```

The player cannot move:

- 1 cell
- 2 cells
- 4 cells
- diagonally
- partially

The distance is always exact.

---

# 6. Boundary Rules

A movement is legal only if the destination remains inside the grid.

Example:

```text
┌───┬───┬───┐
│   │   │   │
├───┼───┼───┤
│   │ 3 │   │
├───┼───┼───┤
│   │   │   │
└───┴───┴───┘
```

If moving three cells upward would leave the board, the upward direction is unavailable.

The UI should communicate this visually.

---

# 7. Player Decision

The important decision is not simply:

> "Which direction should I move?"

Instead, the player should gradually learn to think:

> "Which reachable cell should I land on?"

Because every destination contains another number.

For example:

```text
Current = 3

        [2]
          ↑

[4] ←   [3]   → [1]

        [3]
          ↓
```

The player is choosing between future states:

```text
3 → 2
3 → 4
3 → 1
3 → 3
```

The number selected now determines the player's next set of possibilities.

---

# 8. Core Gameplay Loop

```text
Observe current number
        ↓
Calculate legal destinations
        ↓
Evaluate destination numbers
        ↓
Choose a direction
        ↓
Move exactly N cells
        ↓
Read new number
        ↓
Evaluate next possibilities
        ↓
Repeat
        ↓
Reach Goal
```

This loop should remain the central experience of the vertical slice.

---

# 9. Player Controls

## Desktop

The prototype should support:

- Mouse click
- Arrow keys

Arrow keys:

```text
↑ = Up
↓ = Down
← = Left
→ = Right
```

## Mobile/Web

The prototype should also support:

- Tap a highlighted destination
- Optional swipe controls

For the first implementation, **tap/clicking the highlighted destination is preferable** because it makes the puzzle state explicit.

---

# 10. Move Visualization

When the player is on a numbered cell, calculate all legal destinations.

Example:

```text
       ○
       │
       │
○ ─── [3] ─── ○
       │
       │
       ○
```

Legal destinations should be visually highlighted.

Invalid directions should either:

- not display a destination, or
- appear disabled.

The player should never have to guess whether a move is valid.

---

# 11. Movement Animation

When the player selects a destination:

```text
[PLAYER]
   ↓
Cell 1
   ↓
Cell 2
   ↓
Cell 3
   ↓
[DESTINATION]
```

The player token should move across the cells rather than instantly teleporting.

The animation should be short:

**~150–300 ms per movement**

The purpose is feedback, not spectacle.

---

# 12. Level Structure

The vertical slice should contain approximately:

## 10 handcrafted levels

### Levels 1–3 — Tutorial

Teach the basic rule.

Example:

```text
S 1 2
2 1 1
2 1 G
```

The solution should be obvious.

---

### Levels 4–6 — Basic Planning

Introduce multiple valid destinations.

The player must begin considering the next number.

Example:

```text
2 1 3 1
1 3 2 G
2 1 2 1
S 2 3 1
```

---

### Levels 7–8 — Dead Ends

Create cells that appear attractive but lead to dead ends.

The player must plan ahead.

Example thought:

> "I can reach the 4, but the 4 leaves me with no useful moves."

---

### Levels 9–10 — Multi-Step Solutions

Require a longer sequence of decisions.

Example:

```text
S
 ↓
2
 ↓
3
 →
1
 ↓
4
 →
2
 ↓
G
```

The player should need to think several moves ahead.

---

# 13. Difficulty Metrics

Each level should record:

### Player Moves

```text
Moves: 12
```

### Optimal Solution

For example:

```text
Optimal: 8 moves
Player: 12 moves
```

### Efficiency

```text
Efficiency = Optimal Moves / Player Moves
```

This does not need to be shown to the player initially.

It should primarily be useful during development and testing.

---

# 14. Undo

Undo is important for this type of puzzle.

The player should be able to return to the previous state.

Example:

```text
Move 1
Move 2
Move 3
Move 4
```

Press:

```text
UNDO
```

Result:

```text
Move 1
Move 2
Move 3
```

Because the initial version has no changing tiles, undo is extremely simple.

---

# 15. Restart

A prominent:

```text
↻ RESTART
```

button should reset the level immediately.

There should be no penalty for restarting.

The goal of the prototype is to encourage experimentation.

---

# 16. Win Condition

The level is complete when the player reaches the goal cell.

Example:

```text
┌───┬───┬───┐
│ 2 │ 1 │ 3 │
├───┼───┼───┤
│ 1 │ 2 │ 1 │
├───┼───┼───┤
│ S │ 2 │ G │
└───┴───┴───┘
```

When the player reaches `G`:

```text
LEVEL COMPLETE
```

Display:

- Moves used
- Optimal moves, if available
- Next Level
- Restart

---

# 17. UI Layout

The prototype should use a very simple interface.

```text
┌───────────────────────────────┐
│         NUMBER MAZE           │
│                               │
│       Level 04                │
│       Moves: 7                │
│                               │
│    ┌───┬───┬───┬───┐          │
│    │ 2 │ 1 │ 3 │ 2 │          │
│    ├───┼───┼───┼───┤          │
│    │ 1 │ ● │ 2 │ 1 │          │
│    ├───┼───┼───┼───┤          │
│    │ 3 │ 2 │ 1 │ G │          │
│    └───┴───┴───┴───┘          │
│                               │
│       [ UNDO ] [ RESTART ]    │
└───────────────────────────────┘
```

The grid should occupy the majority of the screen.

---

# 18. Visual Design

The vertical slice does not require final art.

Use:

- Flat background
- Simple square cells
- Clear typography
- Strong player indicator
- Clear goal indicator
- Subtle selected-cell state
- Simple movement animation

The visual language should prioritize **information clarity**.

Numbers must be immediately readable.

---

# 19. Technology

## Prototype Technology

The entire vertical slice can be built using **simple HTML, CSS, and JavaScript**.

No game engine is required.

Suggested structure:

```text
number-maze/
│
├── index.html
├── style.css
├── game.js
│
└── levels.js
```

The grid can be implemented using either:

### Option A — CSS Grid

Recommended for the prototype.

```text
display: grid;
grid-template-columns: repeat(5, 1fr);
```

### Option B — HTML Canvas

Useful if more advanced animation/rendering is eventually required.

For the vertical slice, **HTML elements + CSS Grid are preferable** because the game is fundamentally a grid UI.

---

# 20. Game State

A minimal game state could look conceptually like:

```text
level
grid
playerPosition
goalPosition
moveCount
moveHistory
```

Each cell:

```text
{
    row,
    column,
    value
}
```

The movement system calculates:

```text
destination =
currentPosition +
direction × currentCell.value
```

Then validates:

```text
Is destination inside grid?
```

If valid:

```text
playerPosition = destination
moveCount++
```

---

# 21. Level Data

Levels should be stored separately from game logic.

Conceptually:

```text
{
    width: 5,
    height: 5,

    start: [4, 0],

    goal: [0, 4],

    grid: [
        [2, 1, 3, 2, 1],
        [1, 3, 2, 4, 2],
        [2, 4, 1, 3, 1],
        [3, 1, 2, 1, 4],
        [0, 2, 3, 2, 1]
    ]
}
```

`0` can represent the Start cell or the start position can be stored separately.

Keeping level data independent makes it easy to create and test new puzzles.

---

# 22. Solver

The prototype should include a basic internal solver.

The solver treats each grid cell as a node in a graph.

For a cell containing `3`, edges are created to the valid cells exactly three spaces away.

Example:

```text
       B
       ↑
       │
A  ←   C   → D
       │
       ↓
       E
```

The solver can use **Breadth-First Search (BFS)** to determine the shortest path from Start to Goal.

This gives the development team:

```text
Solvable?
Shortest solution?
Number of moves?
```

This is valuable for validating handcrafted levels.

---

# 23. Level Validation

Every level must pass:

```text
START → SOLVER → GOAL
```

If no solution exists:

```text
INVALID LEVEL
```

If a solution exists:

```text
VALID LEVEL
Optimal moves = N
```

The game should never ship a level that hasn't passed the solver.

---

# 24. Prototype Developer Tools

Add a simple developer/debug mode.

Display:

```text
Level: 07

Current Cell: [2,3]
Current Value: 4

Legal Moves:
↑ INVALID
↓ VALID
← VALID
→ INVALID

Optimal Solution: 9 moves
```

Optional:

```text
SHOW SOLUTION
```

This dramatically reduces iteration time when designing puzzles.

---

# 25. What Should NOT Be Added Yet

Do not add the following during the first vertical slice:

### Special tiles

```text
+
-
×
÷
Teleport
Keys
Gates
```

### Changing numbers

```text
4 → 3 → 2 → 1
```

### Timers

### Lives

### Energy

### Procedural generation

### Ads

### Economy

### XP

### Daily challenges

### Multiplayer

These systems can obscure whether the **fundamental number-movement mechanic** is enjoyable.

---

# 26. Testing Plan

The prototype should be tested in three stages.

## Test A — Understandability

Give the game to a player without explaining the rules.

Measure:

- Do they understand what the number means?
- Do they understand that movement is exact?
- Do they discover the four directions?
- Do they understand why a move is unavailable?

Target:

> The basic rule should be understood within the first 30–60 seconds.

---

## Test B — Engagement

Observe levels 4–8.

Look for:

- Players planning before moving
- Players comparing destinations
- Players anticipating the next number
- Players restarting voluntarily
- Players using undo
- Players getting satisfaction from finding the correct route

The most important observation:

> **Does the player pause and think before selecting a destination?**

That pause is a strong indicator that the puzzle is generating meaningful decisions.

---

## Test C — Frustration

Measure:

- Repeated accidental moves
- Confusion about movement rules
- Excessive trial-and-error
- Levels requiring brute force
- Players feeling that solutions are arbitrary

If players say:

> "I couldn't know that."

the level design needs improvement.

If they say:

> "I knew where I needed to go, but I had to figure out how."

that is a much better result.

---

# 27. Success Criteria

The vertical slice should be considered successful if:

### Mechanical

- Movement feels responsive.
- The rule is immediately understandable.
- Players can predict legal moves.
- The grid communicates state clearly.

### Puzzle

- Players think about future cells.
- Levels produce meaningful decisions.
- Dead ends feel understandable rather than arbitrary.
- Solutions feel discoverable.

### Product

- Players voluntarily attempt the next level.
- Players restart failed attempts rather than abandoning the game.
- The mechanic remains interesting after the tutorial.

---

# 28. Recommended Vertical Slice Flow

The complete prototype experience should be:

```text
START
  │
  ▼
Level 1
  │
  ▼
Learn number = movement distance
  │
  ▼
Level 2
  │
  ▼
Learn four-direction choice
  │
  ▼
Level 3
  │
  ▼
First meaningful decision
  │
  ▼
Levels 4–6
  │
  ▼
Plan around future numbers
  │
  ▼
Levels 7–8
  │
  ▼
Dead ends / deceptive choices
  │
  ▼
Levels 9–10
  │
  ▼
Longer multi-step planning
  │
  ▼
Prototype Complete
```

---

# 29. Future Expansion — Only After Validation

If the vertical slice proves that the core mechanic is fun, the next version can investigate:

### Layer 1 — Obstacles

Walls change available moves.

### Layer 2 — Tile states

Numbers can change or disappear.

### Layer 3 — Special cells

Modifiers, teleporters, switches.

### Layer 4 — Procedural generation

Automatically generate and validate puzzles.

### Layer 5 — Meta progression

Worlds, stages, challenges, mastery.

The important principle is:

> **Do not add complexity until the base movement mechanic has demonstrated that it can carry the game.**

---

# 30. Final Vertical Slice Definition

The minimum successful prototype is:

```text
A 5×5 or 6×6 grid
        +
Numbers in every cell
        +
Start and Goal
        +
Exact-distance movement
        +
Four-direction choice
        +
Legal destination highlighting
        +
Undo
        +
Restart
        +
10 handcrafted puzzles
        +
BFS level validation
        +
Simple movement animation
        +
Simple HTML/CSS/JavaScript implementation
```

The prototype should feel like a **small, polished mathematical navigation puzzle**, not a feature-heavy game.

The central question after building it is:

> **When a player sees several reachable numbers, do they naturally start reasoning about which number gives them the best future possibilities?**

If the answer is yes, the mechanic has enough depth to justify developing the larger game.
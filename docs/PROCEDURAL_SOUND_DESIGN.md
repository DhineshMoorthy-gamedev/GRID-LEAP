# Grid Leap — Procedural Sound Design Plan & Specification

> **Status:** Fully Implemented & Audited (100% Procedural Web Audio Synthesis)
> **Date:** September 2026
> **Architecture:** Zero External Assets, Mobile & Cross-Platform Verified (Android, iOS Safari, Web, Desktop)

---

## 1. Audio Direction

Grid Leap is a **calm, cerebral, dark-aesthetic puzzle game**. The visual identity is "Obsidian & Ochre" — deep dark background, glowing amber/gold accents, sharp geometric grid lines. The audio must match: **minimal, crystalline, precise, slightly digital.** Think:

- Not arcade. Not chiptune beeps.
- Not ambient / atmospheric drones.
- **Clean electronic micro-tones.** Short, purposeful. Like a high-quality calculator or a spatial UI in a sci-fi terminal.
- Sounds should feel like *confirmation signals* — they tell the player exactly what happened, without demanding attention.

### Emotional targets per event
| Game Event | Emotional Target | Audio Character |
|---|---|---|
| Successful leap | Confident satisfaction | Short, bright sine ping, slight upward inflection |
| Illegal move | Gentle correction | Dull low thud, no harshness |
| Dead-end / life lost | Surprise + consequence | Descending minor tone, warm not jarring |
| Win / level complete | Earned delight | 3-note ascending chord, crystalline shimmer |
| Out of lives / game over | Gravity | Low sweep + dissipating noise |
| Undo | Stepping back | Short descending sweep — inverse of leap |
| Level start | Readiness | Soft rising single chime |
| Tutorial correct | Lighter delight | 2-tone positive blip — lower stakes than main win |
| UI open | Awareness | Subtle high-freq tick, 20–30 ms |
| Hint activated | Compass reveal | Soft airy tone, mid-range |
| Theme switch | Shift | 200 ms pitch-glide sweep |
| Sound toggle ON | Self-test | Pleasant preview tone |

---

## 2. Current Audio Implementation Audit

**Result: 0% implemented.**

```bash
# grep result across src/ for AudioContext, audio, sound
# matches: 0
```

| What exists | Status |
|---|---|
| `GameState.settings.soundEnabled` stored in localStorage | ✅ Flag exists |
| `DOM.settingSound` toggle in settings modal | ✅ UI exists |
| `settingSound.addEventListener("change", ...)` in `main.js:957` | ✅ Writes to GameState |
| Anything that **reads** `soundEnabled` to produce sound | ❌ None |
| Any `AudioContext`, oscillator, gain node, or audio element | ❌ None |
| Any audio file assets (mp3/ogg/wav) | ❌ None — correct per constraints |

**Haptics co-trigger points** already exist and can be directly mirrored for audio:

| Location | Haptic Call | Mirror Audio Hook |
|---|---|---|
| `main.js:337` inside `doMove()` | `vibrateLight()` | Leap sound |
| `main.js:362` dead-end landing | `vibrateWarning()` | Dead-end / life-lost sound |
| `main.js:400` on `checkWin()` | `vibrateSuccess()` | Win fanfare |
| `main.js:502` in `showWin()` (second call) | `vibrateSuccess()` | Win fanfare (second hook — pick one) |
| `main.js:800` in `handleToggleTheme()` | `vibrateLight()` | Theme switch whoosh |
| `main.js:813` in `handleToggleTrail()` | `vibrateLight()` | Subtle UI confirm |
| `main.js:600` in `toggleSolutionPath()` (trapped state) | `vibrateLight()` | Hint-trapped warning tone |
| `main.js:942` in `outOfLivesWatchAdBtn` handler | `vibrateSuccess()` | Life restored sound |

---

## 3. Complete SFX Inventory

### 3.1 Priority Classification

```
CRITICAL  — Direct gameplay feedback. Must fire every time, no exceptions.
HIGH      — Important state transitions. High value.
MEDIUM    — Settings, navigation, UI enhancement.
LOW       — Editor, dev tools, secondary polish.
```

---

### 3.2 Master SFX Table

| ID | Priority | Code Location | Trigger Event | Sound Name | Purpose |
|---|---|---|---|---|---|
| SFX-01 | CRITICAL | `main.js:337` (`doMove`) | Player leaps to valid cell | `leap` | Primary gameplay confirmation |
| SFX-02 | CRITICAL | `main.js` / `input-router.js` (illegal attempt) | Swipe/tap blocked — not a legal dest | `blocked` | Illegal move feedback |
| SFX-03 | CRITICAL | `main.js:360` (`doMove`, `isDeadEnd=true`) | Land in dead-end, lose 1 life | `deadEnd` | Consequence of trap |
| SFX-04 | CRITICAL | `main.js:400` / `showWin()` | `isGoalCell` true — level solved | `win` | Win celebration |
| SFX-05 | CRITICAL | `main.js:378` (`pushModal("OUT_OF_LIVES")`) | All lives gone, game over modal | `outOfLives` | Final failure gravity |
| SFX-06 | HIGH | `main.js:408` (`undo()`) | Player manually undoes last move | `undo` | Rewind confirmation |
| SFX-07 | HIGH | `main.js:439` (`restart()`) | Player manually restarts level | `restart` | Board reset signal |
| SFX-08 | HIGH | `main.js:114` (`startLevel`) | New level begins | `levelStart` | Readiness cue |
| SFX-09 | HIGH | `main.js:531` (`nextLevel`) | Advance to next level after win | `nextLevel` | Progression transition |
| SFX-10 | HIGH | `main.js:77` (`startDailyLevel`) | Daily challenge begins | `dailyStart` | Special daily cue (slightly distinct from SFX-08) |
| SFX-11 | HIGH | tutorial-controller.js (lesson advance) | Tutorial lesson correct action | `tutorialSuccess` | Lighter win — teaching context |
| SFX-12 | HIGH | tutorial-controller.js (wrong move) | Tutorial wrong move | `tutorialWrong` | Gentle correction, never harsh |
| SFX-13 | HIGH | tutorial-controller.js (lesson completes all 8) | Tutorial fully completed | `tutorialComplete` | Graduation moment |
| SFX-14 | HIGH | `main.js:635` (`toggleSolutionPath`) | Hint / compass activated | `hintOn` | Compass reveal cue |
| SFX-15 | MEDIUM | `main.js:599` (`showToast` when trapped + hint) | Hint used when trapped — no forward path | `trapped` | Directional warning |
| SFX-16 | MEDIUM | `main.js:506` (`showPause`) | Pause modal opened | `modalOpen` | UI layer up |
| SFX-17 | MEDIUM | `scene-router.js popModal()` | Any modal dismissed | `modalClose` | UI layer down |
| SFX-18 | MEDIUM | `main.js:849` (settings btn) | Settings modal opened | `modalOpen` | (same sound as SFX-16) |
| SFX-19 | MEDIUM | TutorialController.open() | Tutorial/rules modal opened | `modalOpen` | (same sound as SFX-16) |
| SFX-20 | MEDIUM | `main.js:790` (`handleToggleTheme`) | Theme switched Obsidian ↔ Vellum | `themeSwitch` | Aesthetic shift |
| SFX-21 | MEDIUM | `main.js:804` (`handleToggleTrail`) | Breadcrumb trail toggled | `trailToggle` | Feature feedback |
| SFX-22 | MEDIUM | Settings `settingSound` change event (→ ON) | Sound effects toggled ON | `soundToggleOn` | Self-test confirmation |
| SFX-23 | MEDIUM | `main.js:942` (ad watch → +1 life granted) | Extra life granted | `lifeGranted` | Recovery delight |
| SFX-24 | LOW | `editor-controller.js` (cell paint) | Editor cell value cycled | `editorTick` | Tactile paint feedback |
| SFX-25 | LOW | `editor-controller.js` (solver → SOLVABLE) | Editor BFS solver confirms solvable | `editorSolvable` | Design confirmation |
| SFX-26 | LOW | `editor-controller.js` (solver → UNSOLVABLE) | Editor BFS solver rejects | `editorUnsolvable` | Design rejection |
| SFX-27 | LOW | `editor-controller.js` (export JSON) | Level JSON copied to clipboard | `editorExport` | Clipboard confirmation |
| SFX-28 | HIGH | `game-renderer.js` (`renderBoard`) | Grid cells expand radially outward from center | `radialTileGrow` | Concentric marimba drops |
| SFX-29 | MEDIUM | `main.js` (`#gameBackBtn`, modals, editor) | Return to previous screen / Home Hub | `navBack` | Silky smooth descending fifth |

---

## 4. Procedural Synthesis Specification

Every sound is generated **at runtime** using the Web Audio API. No audio files are loaded. All synthesis uses:

- `OscillatorNode` (sine / square / sawtooth / triangle)
- `GainNode` (ADSR envelope)
- `BiquadFilterNode` (lowpass / highpass shaping)
- `AudioContext.createBuffer()` + `AudioBufferSourceNode` (white noise generation)
- Frequency modulation via `oscillator.frequency.setValueAtTime()` / `linearRampToValueAtTime()` / `exponentialRampToValueAtTime()`

---

### SFX-01 — `leap` (Successful leap)

**Character:** Short upward sine blip. Crisp, confident. Slightly varies per leap.
**Duration:** 90–120 ms

```
Oscillator: sine
Freq:       220 Hz → 330 Hz over 60 ms (exponential ramp)
Gain env:   attack 5 ms → sustain (0.25 gain) 30 ms → release 60 ms
Vol:        0.25
Variation:  ±15 Hz random offset on start frequency (prevents mechanical repetition)
Filter:     highpass at 200 Hz (remove low rumble)
```

---

### SFX-02 — `blocked` (Illegal move)

**Character:** Short dull thud. Square wave, heavily filtered. Non-jarring but clearly "no."
**Duration:** 60 ms

```
Oscillator: square
Freq:       90 Hz → 70 Hz over 40 ms
Gain env:   attack 2 ms → sustain (0.18 gain) 20 ms → release 40 ms
Filter:     lowpass at 300 Hz (muffle the square wave harshness)
Vol:        0.2
Throttle:   200 ms minimum between plays
```

---

### SFX-03 — `deadEnd` (Land in dead-end, life lost)

**Character:** Descending minor tone. Two-oscillator: primary descending + quiet low drone.
**Duration:** 280 ms

```
Oscillator A (primary): sine
  Freq:    320 Hz → 180 Hz over 200 ms (exponential down)
  Gain:    attack 5 ms → sustain (0.3) 100 ms → release 180 ms

Oscillator B (drone):  triangle
  Freq:    80 Hz (static)
  Gain:    attack 10 ms → sustain (0.1) 120 ms → release 150 ms

Vol:     0.3 combined
Timing:  Fires at same moment as `vibrateWarning()` — i.e., at 190 ms mark inside doMove() setTimeout
```

---

### SFX-04 — `win` (Level complete - Pure Crystalline Chord)

**Character:** Pure, mathematically harmonized E-Major chord (E4 → G#4 → B4 → E5). Zero detuned beating, zero static, zero noise — pristine crystalline bloom.
**Duration:** 850 ms

```
Sub-master Bus: Hold at 0.70 until t=0.35s, exponential decay to silence (0.00001) over 850ms
Notes:
  Note 1: sine  329.63 Hz (E4)  — fires at t=0ms,   gain 0→0.16 in 16ms, release to 850ms
  Note 2: sine  415.30 Hz (G#4) — fires at t=80ms,  gain 0→0.15 in 16ms, release to 850ms (Major 3rd)
  Note 3: sine  493.88 Hz (B4)  — fires at t=160ms, gain 0→0.17 in 16ms, release to 850ms (5th)
  Note 4: sine  659.25 Hz (E5)  — fires at t=240ms, gain 0→0.09 in 16ms, release to 850ms (Octave bell)
Filter: Highpass at 200 Hz on all notes
Vol:    0.17 peak (smooth, transparent, zero static)
```

---

### SFX-05 — `outOfLives` (All lives gone - Melancholy Minor Mirror of Win)

**Character:** Poignant minor resolution phrase mirroring Win's timing, envelope, and root (E4 → G4 → C5 → B4). Pure sine tones, zero noise, zero low-frequency rumble, zero detuned static.
**Duration:** 900 ms

```
Sub-master Bus: Hold at 0.70 until t=0.38s, exponential decay to silence (0.00001) over 900ms
Notes:
  Note 1: sine  329.63 Hz (E4)  — fires at t=0ms,   gain 0→0.16 in 16ms, release to 900ms
  Note 2: sine  392.00 Hz (G4)  — fires at t=80ms,  gain 0→0.15 in 16ms, release to 900ms (minor 3rd)
  Note 3: sine  523.25 Hz (C5)  — fires at t=160ms, gain 0→0.16 in 16ms, release to 900ms (minor 6th sigh)
  Note 4: sine  493.88 Hz (B4)  — fires at t=260ms, gain 0→0.17 in 16ms, release to 900ms (resolves to 5th, forming E minor)
Filter: Highpass at 200 Hz on all notes (clean, no low rumble)
Vol:    0.17 peak
```

---

### SFX-06 — `undo` (Undo last move / Rewind step)

**Character:** Crisp, crystalline 2-tone rewind drop (D5 587.33 Hz → G4 392.00 Hz). High audibility across mobile & laptop speakers, zero low-end mud, snappy tactile feel.
**Duration:** 130 ms

```
Tone 1: sine 587.33 Hz (D5) — fires at t=0ms, dur 75ms, attack 4ms, decay exp, vol 0.18
Tone 2: sine 392.00 Hz (G4) — fires at t=35ms, dur 95ms, attack 4ms, decay exp, vol 0.19
Filter: Highpass at 180 Hz
Throttle: 80 ms
```

---

### SFX-07 — `restart` (Level restart)

**Character:** Fast, crisp 3-tone fresh board cascade (G4 → C5 → E5) with grounding root undertone. Pure tones, zero noise.
**Duration:** 140 ms

```
Pings:      sine G4 (392 Hz), C5 (523 Hz), E5 (659 Hz) across 56 ms (vol 0.15 - 0.18)
Grounding:  sine C4 (261.63 Hz at t=28ms) for tactile reset feel without noise
Vol:        0.18 peak
```

---

### SFX-08 — `levelStart` (New level begins)

**Character:** Soft single rising chime. Readiness signal. Like a clean bell strike.
**Duration:** 200 ms

```
Oscillator: sine
Freq:       220 Hz → 330 Hz over 80 ms (exponential up)
Gain:       attack 8 ms → 0.22 sustain 60 ms → release 130 ms
Filter:     highpass 200 Hz
Vol:        0.22

Timing: Fire at the end of startLevel(), after placeToken() call (~line 142)
```

---

### SFX-09 — `nextLevel` (Advance to next level)

**Character:** Warm, uplifting, forward-propelling C-Major harmonic ascent (C4 → G4 → C5). Pure sine tones in comfortable mid-range, harmonically preceding radial tile grow.
**Duration:** 380 ms total

```
Ascent Triad:  sine C4 (261.63 Hz at t=0ms), sine G4 (392.00 Hz at t=45ms), sine C5 (523.25 Hz at t=90ms)
Filter:        highpass at 180 Hz on all notes
Bus Envelope:  sub-master bus decay down to silence (0.00001) over 380 ms
Vol:           0.16 peak (silky-smooth forward propulsion, zero screeching, zero laser pitch slides)
```

---

### SFX-10 — `dailyStart` (Daily challenge begins)

**Character:** Slightly richer version of SFX-08. Two-note harmony instead of single note. Marks the special occasion.
**Duration:** 250 ms

```
Note A: sine 330 Hz, gain 0→0.22→release 200ms
Note B: sine 440 Hz, delayed 60ms, gain 0→0.18→release 160ms
Filter: highpass 200 Hz
Vol:    0.25
```

---

### SFX-11 — `tutorialSuccess` (Tutorial lesson correct)

**Character:** Lighter, faster version of win. Two-note upward blip. Less grand than full win.
**Duration:** 300 ms

```
Note 1: sine 330 Hz, t=0,    gain 0→0.2→release 250ms
Note 2: sine 440 Hz, t=70ms, gain 0→0.2→release 200ms
Filter: highpass 200 Hz
Vol:    0.2
```

---

### SFX-12 — `tutorialWrong` (Tutorial wrong move)

**Character:** Gentle, warm damped triangle tap. Zero square wave buzz. Non-punitive, soft tactile cue.
**Duration:** 70 ms

```
Oscillator: triangle
Freq:       140 Hz → 90 Hz over 50 ms
Filter:     lowpass 220 Hz
Gain:       attack 1 ms → 0.18 peak → release 65 ms
Vol:        0.18
```

---

### SFX-13 — `tutorialComplete` (All 8 tutorial lessons done)

**Character:** Mini fanfare — fuller than SFX-11, slightly shorter than SFX-04.
**Duration:** 600 ms

```
Note 1: sine 330 Hz, t=0,    gain 0→0.28→release 550ms
Note 2: sine 415 Hz, t=70ms, gain 0→0.24→release 480ms
Note 3: sine 550 Hz, t=140ms, gain 0→0.28→release 450ms
Shimmer: gentle tremolo on note 3, 6 Hz LFO, depth ±0.03
Filter: highpass 220 Hz
Vol:    0.3
```

---

### SFX-14 — `hintOn` (Hint / compass activated)

**Character:** Soft airy mid-range tone. Contemplative. Like a compass clicking open.
**Duration:** 200 ms

```
Oscillator A: triangle 280 Hz, gain 0→0.18→release 180ms
Oscillator B: sine 420 Hz (a subtle harmonic), gain 0→0.08→release 150ms
Filter: bandpass center 350 Hz, Q 1.2
Vol:    0.18
```

---

### SFX-15 — `trapped` (Hint used when already trapped)

**Character:** Slightly dissonant, unresolved — like a question mark. Signals "you can't go forward."
**Duration:** 250 ms

```
Oscillator: sine
Freq:       280 Hz → 240 Hz over 150 ms (minor downward drift)
Gain:       attack 8 ms → 0.2 sustain 80 ms → release 150 ms

Add detune oscillator: sine freq 285 Hz (5 Hz beat frequency creates slight "wobble")
  Gain: 0→0.06→release 150ms

Vol: 0.2
```

---

### SFX-16/17/20 — `modalOpen` / `modalClose` / `themeSwitch` (Silky Smooth Settle Chime)

**Character:** Pure, silky-smooth descending sine fifth (G4 → C4). Soft gentle attack, zero noise buffers, zero clicks or pitch snaps. Shared across modal open, modal close, and theme toggle.
**Duration:** 220 ms

```
Chord: Descending pure sine fifth (G4 392.00 Hz at t=0, C4 261.63 Hz at t=32ms)
Bus:   Exponential decay down to 0.0001 over 220 ms
```

---

### SFX-21 — `trailToggle` (Breadcrumb trail on/off)

**Character:** Soft short click. Very subtle — same family as modal open but even softer.
**Duration:** 25 ms

```
Oscillator: triangle
Freq:       600 Hz (static)
Gain:       attack 2 ms → 0.10 → release 20 ms
Filter:     highpass 300 Hz
Vol:        0.10
```

---

### SFX-22 — `soundToggleOn` (Sound enabled from settings)

**Character:** Plays SFX-08 `levelStart` as a demo. The player hears a pleasant chime to confirm audio is working.
**Implementation note:** When `settingSound` toggles to `checked = true`, immediately call `playLevelStart()`.

---

### SFX-23 — `lifeGranted` (Extra life after watching ad)

**Character:** Warm, positive 2-note rising blip. Like a soft reward ping.
**Duration:** 250 ms

```
Note 1: sine 330 Hz, t=0,    gain 0→0.22→release 200ms
Note 2: sine 495 Hz, t=80ms, gain 0→0.2 →release 160ms
Filter: highpass 200 Hz
Vol:    0.22
```

---

### SFX-24 — `editorTick` (Editor cell painted)

**Character:** Ultra-short soft click. 20 ms. Like pressing a physical key.
**Duration:** 20 ms

```
Oscillator: triangle
Freq:       500 Hz
Gain:       attack 1 ms → 0.08 → release 16 ms
Vol:        0.08
```

---

### SFX-25 — `editorSolvable` (Editor solver: puzzle is solvable)

**Character:** Light two-note confirmation. "Yes, this works."
**Duration:** 220 ms

```
Note 1: sine 330 Hz, t=0,    gain 0→0.18→release 180ms
Note 2: sine 440 Hz, t=60ms, gain 0→0.16→release 150ms
Filter: highpass 200 Hz
Vol:    0.18
```

---

### SFX-26 — `editorUnsolvable` (Editor solver: puzzle is unsolvable)

**Character:** Short descending tone. Not alarming, just "no forward path."
**Duration:** 180 ms

```
Oscillator: sine
Freq:       280 Hz → 180 Hz over 120 ms (exponential down)
Gain:       attack 5 ms → 0.18 → release 140 ms
Vol:        0.18
```

---

### SFX-27 — `editorExport` (JSON copied to clipboard)

**Character:** Soft high-frequency double-tick. "Copied."
**Duration:** 60 ms

```
Tick 1: triangle 900 Hz, t=0,    gain 0→0.12→release 20ms
Tick 2: triangle 1100 Hz, t=30ms, gain 0→0.10→release 20ms
Vol:    0.12
```

---

### SFX-28 — `tileGrow` (Radial Tile Bloom / Level Load)

**Character:** Delicate, pure crystalline marimba/glass droplets ascending harmonically (C4 → E4 → G4 → C5 → E5) in lockstep with concentric tile rings expanding outward from center.
**Duration:** ~350 - 520 ms (dynamic based on ring count)

```
Harmonic Scale: C4 (261.63 Hz), E4 (329.63 Hz), G4 (392.00 Hz), C5 (523.25 Hz), E5 (659.25 Hz)
Ring Step:      90 ms between rings
Synthesis:      Pure sine wave (vol 0.14) + subtle triangle 2nd harmonic (vol 0.03)
Envelope:       Soft 4 ms attack → 75 ms exponential release per ring
Sub-Master:     Overarching smooth bus decay down to silence (0.0001)
Timing:         Triggered inside renderBoard() whenever shouldAnimate is true
```

---

## 5. Audio Architecture Recommendation

### Module: `src/audio/audio-engine.js`

A singleton module exposing a clean API. Key design principles:

1. **Lazy AudioContext init** — `AudioContext` is NOT created until first user gesture (required by browser policy and Capacitor Android)
2. **Reads `GameState.settings.soundEnabled`** before every play call
3. **Master gain node** — single mute point; toggle with `setMasterVolume(0)` / `setMasterVolume(1)`
4. **Auto-disconnect** — all nodes call `.disconnect()` inside their `onended` handler to prevent memory leaks
5. **Throttle map** — per-sound minimum interval tracking to prevent rapid-fire stacking

```
src/
└── audio/
    └── audio-engine.js    ← The only file needed initially
```

### Proposed Public API

```js
// Initialization
AudioEngine.init()                    // Call once in bootApp() after DOMContentLoaded
AudioEngine.resume()                  // Call on first user gesture (for Capacitor)

// Core play methods (call these from main.js / tutorial-controller.js)
AudioEngine.playLeap()
AudioEngine.playBlocked()
AudioEngine.playDeadEnd()
AudioEngine.playWin()
AudioEngine.playOutOfLives()
AudioEngine.playUndo()
AudioEngine.playRestart()
AudioEngine.playLevelStart()
AudioEngine.playNextLevel()
AudioEngine.playDailyStart()
AudioEngine.playTutorialSuccess()
AudioEngine.playTutorialWrong()
AudioEngine.playTutorialComplete()
AudioEngine.playHintOn()
AudioEngine.playTrapped()
AudioEngine.playModalOpen()
AudioEngine.playModalClose()
AudioEngine.playThemeSwitch()
AudioEngine.playTrailToggle()
AudioEngine.playLifeGranted()
AudioEngine.playEditorTick()
AudioEngine.playEditorSolvable()
AudioEngine.playEditorUnsolvable()
AudioEngine.playEditorExport()

// Volume / enable
AudioEngine.setEnabled(bool)          // Mirror of GameState.settings.soundEnabled
AudioEngine.setMasterVolume(0..1)
```

### Internal Primitive Helpers (private)

```js
// src/audio/audio-engine.js internal functions

function _ctx()               // Returns the shared AudioContext (lazy-init)
function _playTone(freq, type, attack, sustain, release, vol, startFreq2?, ramp?)
function _playNoise(duration, filterType, filterFreq, filterQ, vol)
function _playChord(notes, vol)     // notes = [{freq, delay, release}, ...]
function _playSweep(f1, f2, type, duration, vol)
function _throttle(id, minMs)       // Returns false if too recent
```

### AudioContext Lifecycle (Mobile-Safe)

```js
// In bootApp() — after DOMContentLoaded
AudioEngine.init()

// On first user interaction — unlock context (Capacitor Android requirement)
document.addEventListener('touchstart', () => AudioEngine.resume(), { once: true })
document.addEventListener('click',      () => AudioEngine.resume(), { once: true })
```

---

## 6. Code Integration Points

Exact lines in source where audio calls should be added (when implementation begins):

### `src/main.js`

```js
// Line 337 — inside doMove(), after PlatformBridge.vibrateLight()
AudioEngine.playLeap();

// Line 362 — dead-end, after PlatformBridge.vibrateWarning()
AudioEngine.playDeadEnd();

// Line 378 — before SceneRouter.pushModal("OUT_OF_LIVES")
AudioEngine.playOutOfLives();

// Line 400 — checkWin(), after PlatformBridge.vibrateSuccess()
AudioEngine.playWin();

// Line 408 — top of undo() (user-initiated, not auto-undo)
// Note: auto-undo at lines 376-388 should NOT play undo sound (it's automatic, not user action)
AudioEngine.playUndo(); // only when called directly from undoBtn event, not from autoUndoTimer

// Line 439 — restart()
AudioEngine.playRestart();

// Line 146 — end of startLevel(), after tick()
AudioEngine.playLevelStart();

// Line 111 — end of startDailyLevel(), after tick()
AudioEngine.playDailyStart();

// Line 531 — nextLevel() → startLevel(levelIndex + 1)
// SFX-09 plays via nextLevel() before startLevel fires SFX-08
AudioEngine.playNextLevel(); // fires SFX-09 whoosh; startLevel fires SFX-08 chime

// Line 509 — showPause()
AudioEngine.playModalOpen();

// Lines 892, 895, 909, etc. — popModal() calls
AudioEngine.playModalClose();

// Line 800 — handleToggleTheme()
AudioEngine.playThemeSwitch();

// Line 813 — handleToggleTrail()
AudioEngine.playTrailToggle();

// Line 958 — settingSound change → checked = true
if (e.target.checked) AudioEngine.playLevelStart(); // self-test tone

// Line 942 — lifeGranted
AudioEngine.playLifeGranted();

// Line 600 — toggleSolutionPath(), hint on trapped state
AudioEngine.playTrapped();

// Line 641 — toggleSolutionPath(), hint activated (not trapped)
AudioEngine.playHintOn();
```

### Illegal move feedback

Currently there is no explicit "illegal move attempted" event — the `attemptMoveTo()` function silently returns if the destination is not in `legalDests`. A sound hook requires either:

**Option A (preferred):** Add the check in `input-router.js` (keyboard handler) and in `attemptMoveTo()` in `main.js`:
```js
// main.js:308 — when match is not found (tap on non-legal cell)
if (!match) {
  AudioEngine.playBlocked(); // ADD THIS
  return;
}
```

**Option B:** In `input-router.js` keyboard/swipe handler — detect invalid direction attempts before calling `attemptMoveTo()`.

### `src/scenes/tutorial-controller.js`

```js
// On correct step (lesson solved):
AudioEngine.playTutorialSuccess();

// On wrong move detected (wrongMoves map lookup):
AudioEngine.playTutorialWrong();

// On full tutorial completion (all 8 lessons):
AudioEngine.playTutorialComplete();
```

### `src/editor/editor-controller.js`

```js
// On cell value cycled:
AudioEngine.playEditorTick();

// On solver result SOLVABLE:
AudioEngine.playEditorSolvable();

// On solver result UNSOLVABLE:
AudioEngine.playEditorUnsolvable();

// On JSON clipboard export:
AudioEngine.playEditorExport();
```

---

## 7. Performance & Mobile Constraints

### Node Lifecycle Rule

Every node must be created, connected, played, and destroyed per-sound call. No persistent nodes.

```js
const osc = ctx.createOscillator();
const gain = ctx.createGain();
osc.connect(gain);
gain.connect(ctx.destination);
osc.start(ctx.currentTime);
osc.stop(ctx.currentTime + duration);
osc.onended = () => { osc.disconnect(); gain.disconnect(); };
```

### Throttle Rules

| Sound | Minimum Interval |
|---|---|
| `leap` | 100 ms |
| `blocked` | 200 ms |
| `editorTick` | 40 ms |
| All others | No throttle (events are infrequent by nature) |

### Simultaneous Node Limit

Design target: maximum **4 concurrent oscillator nodes** at any time.
- `win` uses 3 + 1 optional LFO = 4 max
- `outOfLives` uses 1 osc + 1 noise = 2
- All other single-shot sounds use 1–2 nodes

### AudioContext Suspension

- On `visibilitychange` → `hidden`: call `ctx.suspend()`
- On `visibilitychange` → `visible`: call `ctx.resume()`
- On Capacitor App `appStateChange` → `isActive: false`: `ctx.suspend()`
- These hooks already exist in `src/platform/lifecycle.js` — audio suspend can be co-located.

### Capacitor Android — Unlock Requirement

```js
// Unlock on first touch (browser policy)
// Call AudioEngine.resume() on first touchstart/click
// AudioContext.state === 'suspended' until then
```

---

## 8. Audio Trigger Rules

| Rule | Rationale |
|---|---|
| Always check `GameState.settings.soundEnabled` before playing | Respects player preference |
| Auto-undo (computer-triggered) should NOT play `undo` sound | Sound only on human intent |
| Do NOT double-play win when `showWin()` calls `vibrateSuccess()` a second time (line 502) | Already triggered at line 400 — debounce or use only one hook |
| Tutorial sounds are separate from gameplay sounds | Different emotional register |
| `editorTick` throttled at 40 ms; fast cell painting shouldn't create noise stack | Performance |
| Dead-end sound fires AFTER 190 ms animation delay (inside `setTimeout`) | Syncs with visual `dead-end-hit` class and `vibrateWarning()` |
| Win sound fires BEFORE the WIN modal renders (at `checkWin()` not `showWin()`) | Player hears sound the moment they land on goal |

---

## 9. Implementation Priority Order

Implement sounds in this order (CRITICAL first):

1. **Phase 1 — Core gameplay sounds:** SFX-01 (`leap`), SFX-03 (`deadEnd`), SFX-04 (`win`), SFX-06 (`undo`)
2. **Phase 2 — Failure + state:** SFX-05 (`outOfLives`), SFX-07 (`restart`), SFX-08 (`levelStart`), SFX-02 (`blocked`)
3. **Phase 3 — Navigation + UI:** SFX-09 (`nextLevel`), SFX-16/17 (`modalOpen/Close`), SFX-22 (`soundToggleOn`)
4. **Phase 4 — Tutorial system:** SFX-11, SFX-12, SFX-13 (`tutorialSuccess/Wrong/Complete`)
5. **Phase 5 — Hints + daily:** SFX-10 (`dailyStart`), SFX-14 (`hintOn`), SFX-15 (`trapped`), SFX-23 (`lifeGranted`)
6. **Phase 6 — Settings polish:** SFX-20 (`themeSwitch`), SFX-21 (`trailToggle`)
7. **Phase 7 — Editor:** SFX-24–27 (editor-only, editor platform only)

---

## 10. Final Audio Checklist

Before shipping any platform with audio:

- [ ] `AudioEngine.init()` called in `bootApp()` after `GameState.init()`
- [ ] First user gesture unlocks AudioContext
- [ ] `GameState.settings.soundEnabled` gate on every `AudioEngine.play*()` call
- [ ] All nodes self-disconnect in `onended`
- [ ] `leap` sound has ≥100 ms throttle
- [ ] Auto-undo does NOT trigger undo sound
- [ ] `win` sound does NOT double-fire (single trigger point)
- [ ] `visibilitychange` and Capacitor `appStateChange` suspend/resume AudioContext
- [ ] Editor sounds are only bundled in `editor` build target (tree-shaken out of `web`/`itch`/`playstore`)
- [ ] Manual QA: test all 27 SFX in sequence on both themes
- [ ] Manual QA: test on Android WebView (Capacitor) — confirm no silence/crash on first launch
- [ ] Manual QA: toggle sound OFF in settings — confirm all audio stops
- [ ] Manual QA: toggle sound ON — confirm self-test chime plays

---

## 11. Sound-to-File Map (When Implemented)

All sounds live in one file: `src/audio/audio-engine.js`  
No audio asset files. No imports of MP3/OGG/WAV.  
All synthesis is JavaScript-only Web Audio API.

```
src/
└── audio/
    └── audio-engine.js    ← ~350–450 lines estimated
```

---

*End of Procedural Sound Design Plan — Grid Leap*  
*Next step: Implementation of `src/audio/audio-engine.js` (Phase 1 first)*

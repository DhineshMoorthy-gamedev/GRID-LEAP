import { solve } from "../core/solver.js";
import { TargetConfig } from "../platform/target-config.js";
import { PlatformBridge } from "../platform/lifecycle.js";

/**
 * UI Renderer & DOM Bindings
 */

export const DOM = {
  // Screens
  screenHome: document.getElementById("screenHome"),
  screenGame: document.getElementById("screenGame"),

  // Home Hub
  targetModePill: document.getElementById("targetModePill"),
  homeHelpBtn: document.getElementById("homeHelpBtn"),
  homeSettingsBtn: document.getElementById("homeSettingsBtn"),
  homeThemeToggleBtn: document.getElementById("homeThemeToggleBtn"),
  heroBanner: document.getElementById("heroBanner"),
  heroBadge: document.getElementById("heroBadge"),
  heroTitle: document.getElementById("heroTitle"),
  heroSub: document.getElementById("heroSub"),
  heroPlayBtn: document.getElementById("heroPlayBtn"),
  // Daily Challenge
  dailyChallengeSection: document.getElementById("dailyChallengeSection"),
  dailyChallengeCard: document.getElementById("dailyChallengeCard"),
  dailyStreakBadge: document.getElementById("dailyStreakBadge"),
  dailyCardTitle: document.getElementById("dailyCardTitle"),
  dailyCardSub: document.getElementById("dailyCardSub"),
  dailyPlayBtn: document.getElementById("dailyPlayBtn"),
  dailyPlayIcon: document.getElementById("dailyPlayIcon"),
  dailyPlayText: document.getElementById("dailyPlayText"),

  editorLevelSelectSection: document.getElementById("editorLevelSelectSection"),
  completionPill: document.getElementById("completionPill"),
  levelStrip: document.getElementById("levelStrip"),
  consumerLaunchSection: document.getElementById("consumerLaunchSection"),
  consumerBadge: document.getElementById("consumerBadge"),
  consumerClearedCount: document.getElementById("consumerClearedCount"),
  consumerTitle: document.getElementById("consumerTitle"),
  consumerSub: document.getElementById("consumerSub"),
  consumerPlayBtn: document.getElementById("consumerPlayBtn"),

  // Game Play Screen
  gameBackBtn: document.getElementById("gameBackBtn"),
  trailToggleBtn: document.getElementById("trailToggleBtn"),
  gameThemeToggleBtn: document.getElementById("gameThemeToggleBtn"),
  gameTitle: document.getElementById("gameTitle"),
  gameChapter: document.getElementById("gameChapter"),
  gamePauseBtn: document.getElementById("gamePauseBtn"),
  hudLives: document.getElementById("hudLives"),
  hudMoves: document.getElementById("hudMoves"),
  hudPathStatus: document.getElementById("hudPathStatus"),
  hudPathDot: document.getElementById("hudPathDot"),
  hudPathText: document.getElementById("hudPathText"),
  board: document.getElementById("board"),
  gameToolBar: document.getElementById("gameToolBar"),
  adBannerSlot: document.getElementById("adBannerSlot"),
  undoBtn: document.getElementById("undoBtn"),
  hintBtn: document.getElementById("hintBtn"),
  restartBtn: document.getElementById("restartBtn"),

  // Dev Playtest Stepper Bar
  devPlaytestBar: document.getElementById("devPlaytestBar"),
  devStepBackBtn: document.getElementById("devStepBackBtn"),
  devAutoPlayBtn: document.getElementById("devAutoPlayBtn"),
  devStepForwardBtn: document.getElementById("devStepForwardBtn"),
  devStepResetBtn: document.getElementById("devStepResetBtn"),
  devThemeToggleBtn: document.getElementById("devThemeToggleBtn"),
  devStepInfo: document.getElementById("devStepInfo"),

  // Dev Panel
  devPanel: document.getElementById("devPanel"),
  devToggleBtn: document.getElementById("devToggleBtn"),
  devLevelVal: document.getElementById("devLevelVal"),
  devCellVal: document.getElementById("devCellVal"),
  devValueVal: document.getElementById("devValueVal"),
  devOptimalVal: document.getElementById("devOptimalVal"),
  devEfficiencyVal: document.getElementById("devEfficiencyVal"),
  devDirUp: document.getElementById("devDirUp"),
  devDirDown: document.getElementById("devDirDown"),
  devDirLeft: document.getElementById("devDirLeft"),
  devDirRight: document.getElementById("devDirRight"),
  devShowSolutionBtn: document.getElementById("devShowSolutionBtn"),
  devModal: document.getElementById("devModal"),
  closeDevBtn: document.getElementById("closeDevBtn"),

  // Modals & Overlays
  toast: document.getElementById("toast"),
  winOverlay: document.getElementById("winOverlay"),
  winSigilMedallion: document.getElementById("winSigilMedallion"),
  winSigilSvg: document.getElementById("winSigilSvg"),
  winTitle: document.getElementById("winTitle"),
  winSubtitle: document.getElementById("winSubtitle"),
  winStatsStrip: document.getElementById("winStatsStrip"),
  winEffPill: document.getElementById("winEffPill"),
  winEffIcon: document.getElementById("winEffIcon"),
  winEffVal: document.getElementById("winEffVal"),
  winEffTier: document.getElementById("winEffTier"),
  winMovesPill: document.getElementById("winMovesPill"),
  winMovesVal: document.getElementById("winMovesVal"),
  winEfficiency: document.getElementById("winEfficiency"),
  winEfficiencyStat: document.getElementById("winEfficiencyStat"),
  winRestartBtn: document.getElementById("winRestartBtn"),
  winNextBtn: document.getElementById("winNextBtn"),
  winHomeBtn: document.getElementById("winHomeBtn"),

  finalOverlay: document.getElementById("finalOverlay"),
  finalTitle: document.getElementById("finalTitle"),
  finalSub: document.getElementById("finalSub"),
  finalTotalSolved: document.getElementById("finalTotalSolved"),
  finalTotalLevels: document.getElementById("finalTotalLevels"),
  finalRestartBtn: document.getElementById("finalRestartBtn"),
  finalHomeBtn: document.getElementById("finalHomeBtn"),

  outOfLivesModal: document.getElementById("outOfLivesModal"),
  outOfLivesWatchAdBtn: document.getElementById("outOfLivesWatchAdBtn"),
  outOfLivesRestartBtn: document.getElementById("outOfLivesRestartBtn"),

  pauseModal: document.getElementById("pauseModal"),
  pauseLevel: document.getElementById("pauseLevel"),
  pauseMoves: document.getElementById("pauseMoves"),
  resumeBtn: document.getElementById("resumeBtn"),
  pauseRestartBtn: document.getElementById("pauseRestartBtn"),
  pauseHomeBtn: document.getElementById("pauseHomeBtn"),

  settingsModal: document.getElementById("settingsModal"),
  pillThemeObsidian: document.getElementById("pillThemeObsidian"),
  pillThemeVellum: document.getElementById("pillThemeVellum"),
  settingSound: document.getElementById("settingSound"),
  settingHaptics: document.getElementById("settingHaptics"),
  settingRelaxMode: document.getElementById("settingRelaxMode"),
  settingTrail: document.getElementById("settingTrail"),
  settingDevMode: document.getElementById("settingDevMode"),
  closeSettingsBtn: document.getElementById("closeSettingsBtn"),

  // Editor & Platform Targets
  screenEditor: document.getElementById("screenEditor"),
  editorHubCard: document.getElementById("editorHubCard"),
  openEditorBtn: document.getElementById("openEditorBtn"),
  gameFullscreenBtn: document.getElementById("gameFullscreenBtn"),
  desktopKeyLegend: document.getElementById("desktopKeyLegend"),
  editorJsonModal: document.getElementById("editorJsonModal"),

  rulesModal: document.getElementById("rulesModal"),
  closeRulesBtn: document.getElementById("closeRulesBtn") || document.getElementById("tutorialCloseX")
};

if (DOM.toast) {
  DOM.toast.addEventListener("click", () => hideToast());
}


let cellEls = [];
let tokenEl = null;
let trailSvgEl = null;
let lastRenderedCoords = [];
let lastRenderedViable = true;
let lastRenderedShowTrail = false;
let lastRenderedShowSolutionFeedback = false;
let toastTimeout = null;

export function getCellElements() {
  return cellEls;
}

export function getTokenElement() {
  return tokenEl;
}

export function applyTheme(themeName) {
  const theme = themeName === "vellum" ? "vellum" : "obsidian";
  document.documentElement.setAttribute("data-theme", theme);

  // Status bar meta color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "vellum" ? "#F7F5F0" : "#121316");
  }

  const isVellum = theme === "vellum";
  const icon = isVellum ? "☀️" : "🌙";
  const label = isVellum ? "VELLUM" : "OBSIDIAN";

  if (DOM.homeThemeToggleBtn) {
    const iconEl = DOM.homeThemeToggleBtn.querySelector(".theme-icon");
    const labelEl = DOM.homeThemeToggleBtn.querySelector(".theme-label");
    if (iconEl) iconEl.textContent = icon;
    if (labelEl) labelEl.textContent = label;
  }

  if (DOM.gameThemeToggleBtn) {
    const iconEl = DOM.gameThemeToggleBtn.querySelector(".theme-icon");
    if (iconEl) iconEl.textContent = icon;
    DOM.gameThemeToggleBtn.setAttribute("title", `Theme: ${label} (Tap to switch)`);
  }

  if (DOM.devThemeToggleBtn) {
    DOM.devThemeToggleBtn.textContent = `🎨 ${label}`;
  }

  if (DOM.pillThemeObsidian) {
    DOM.pillThemeObsidian.classList.toggle("active", !isVellum);
  }
  if (DOM.pillThemeVellum) {
    DOM.pillThemeVellum.classList.toggle("active", isVellum);
  }

  // Update SVG filter color dynamically
  const glowTrail = document.getElementById("glowTrail") || document.getElementById("glowSky");
  if (glowTrail) {
    const shadow = glowTrail.querySelector("feDropShadow");
    if (shadow) {
      if (isVellum) {
        shadow.setAttribute("flood-color", "#1D4E6D");
        shadow.setAttribute("flood-opacity", "0.45");
      } else {
        shadow.setAttribute("flood-color", "#FFB800");
        shadow.setAttribute("flood-opacity", "0.85");
      }
    }
  }

  refreshTrail();
}

export function renderHomeHub(levels, lastPlayedIndex, completedArr, onLevelSelect, session = null) {
  const isEditor = TargetConfig.isEditor;
  const isAllCleared = completedArr.every(Boolean);
  const clearedCount = completedArr.filter(Boolean).length;

  if (isEditor) {
    // ----------------------------------------------------
    // EDITOR MODE: Show Dev Controls, Hero Card, Level Selector
    // ----------------------------------------------------
    if (DOM.editorLevelSelectSection) DOM.editorLevelSelectSection.style.display = "block";
    if (DOM.heroBanner) DOM.heroBanner.style.display = "flex";
    if (DOM.consumerLaunchSection) DOM.consumerLaunchSection.style.display = "none";

    // 1. Update Hero Card
    const currentLv = levels[lastPlayedIndex] || levels[0];
    const hasSession = Boolean(session && session.levelIndex === lastPlayedIndex && session.moveCount > 0);

    if (DOM.heroTitle) DOM.heroTitle.textContent = `Level ${String(lastPlayedIndex + 1).padStart(levels.length >= 100 ? 3 : 2, "0")}`;
    if (DOM.heroSub) {
      DOM.heroSub.textContent = hasSession
        ? `${currentLv.phase} • Move ${session.moveCount} in progress`
        : `${currentLv.phase} • ${currentLv.name}`;
    }
    if (DOM.heroBadge) {
      if (isAllCleared) {
        DOM.heroBadge.textContent = "COMPLETED";
      } else if (hasSession) {
        DOM.heroBadge.textContent = "RESUME";
      } else if (completedArr[lastPlayedIndex]) {
        DOM.heroBadge.textContent = "REPLAY";
      } else {
        DOM.heroBadge.textContent = "PLAY";
      }
    }
    if (DOM.completionPill) DOM.completionPill.textContent = `${clearedCount} / ${levels.length} CLEARED`;

    // 2. Render Numbered Circle Dots with Difficulty Score
    if (DOM.levelStrip) {
      DOM.levelStrip.innerHTML = "";
      levels.forEach((lv, i) => {
        const dot = document.createElement("div");
        const isDone = Boolean(completedArr[i]);
        const isActive = i === lastPlayedIndex;
        const solverRes = solve(lv);
        const diff = solverRes?.difficulty || { score: 1.0, tier: "EASY", color: "var(--teal)" };

        const tierClass = `tier-${diff.tier.toLowerCase()}`;
        dot.className = `level-dot ${tierClass}` + (isDone ? " done" : "") + (isActive ? " active" : "");
        dot.style.setProperty("--tier-color", diff.color);

        const numStr = String(i + 1).padStart(levels.length >= 100 ? 3 : 2, "0");
        dot.innerHTML = `
          <span class="dot-num ${numStr.length >= 3 ? "three-digit" : ""}">${numStr}</span>
          <span class="dot-score">${diff.score.toFixed(1)}</span>
          ${isDone ? '<span class="dot-check">✓</span>' : ""}
        `;

        dot.addEventListener("click", () => onLevelSelect(i));
        DOM.levelStrip.appendChild(dot);
      });
    }
  } else {
    // ----------------------------------------------------
    // CONSUMER PLATFORMS (Play Store, Itch, Web):
    // Dedicated single Next-Level Launch Card
    // ----------------------------------------------------
    if (DOM.editorLevelSelectSection) DOM.editorLevelSelectSection.style.display = "none";
    if (DOM.heroBanner) DOM.heroBanner.style.display = "none";
    if (DOM.consumerLaunchSection) DOM.consumerLaunchSection.style.display = "flex";

    // Resolve next uncompleted level index
    const firstUnfinished = completedArr.findIndex(done => !done);
    const nextIndex = firstUnfinished !== -1 ? firstUnfinished : 0;
    const nextLv = levels[nextIndex] || levels[0];

    // Check if player has an in-progress session with moves made on this level
    const hasSession = Boolean(session && session.levelIndex === nextIndex && session.moveCount > 0);

    const numStr = String(nextIndex + 1).padStart(levels.length >= 100 ? 3 : 2, "0");
    if (DOM.consumerTitle) DOM.consumerTitle.textContent = `Level ${numStr}`;
    if (DOM.consumerSub) {
      if (hasSession) {
        DOM.consumerSub.textContent = `${nextLv.phase || "Puzzle"} • Move ${session.moveCount} in progress`;
      } else {
        DOM.consumerSub.textContent = `${nextLv.phase || "Puzzle"} • ${nextLv.name || "Challenge"}`;
      }
    }
    if (DOM.consumerClearedCount) DOM.consumerClearedCount.textContent = `${clearedCount} / ${levels.length} CLEARED`;
    if (DOM.consumerBadge) {
      if (isAllCleared) {
        DOM.consumerBadge.textContent = "ALL CLEARED";
      } else if (hasSession) {
        DOM.consumerBadge.textContent = "RESUME";
      } else if (completedArr[nextIndex]) {
        DOM.consumerBadge.textContent = "REPLAY";
      } else {
        DOM.consumerBadge.textContent = "UP NEXT";
      }
    }
    const playLabel = DOM.consumerPlayBtn?.querySelector(".consumer-play-label");
    if (playLabel) {
      if (isAllCleared) {
        playLabel.textContent = "REPLAY";
      } else if (hasSession) {
        playLabel.textContent = "CONTINUE";
      } else {
        playLabel.textContent = "PLAY";
      }
    }
  }
}

/**
 * Render Daily Challenge Card status on Home Hub
 */
export function renderDailyChallengeCard({ isCompleted, streak, dateKey, displayDate, timeRemaining }) {
  if (!DOM.dailyChallengeCard) return;

  if (DOM.dailyCardTitle) {
    DOM.dailyCardTitle.textContent = displayDate || "Today's Puzzle";
  }

  if (DOM.dailyStreakBadge) {
    DOM.dailyStreakBadge.textContent = `🔥 ${streak} STREAK`;
    DOM.dailyStreakBadge.style.display = streak > 0 ? "inline-block" : "none";
  }

  if (DOM.dailyCardSub) {
    DOM.dailyCardSub.textContent = isCompleted
      ? `Completed! Resets in ${timeRemaining}`
      : `Resets in ${timeRemaining}`;
  }

  DOM.dailyChallengeCard.classList.toggle("completed", Boolean(isCompleted));

  if (DOM.dailyPlayIcon) {
    DOM.dailyPlayIcon.textContent = isCompleted ? "✓" : "▶";
  }

  if (DOM.dailyPlayText) {
    DOM.dailyPlayText.textContent = isCompleted ? "DONE" : "PLAY";
  }
}

export function renderLivesHUD(lives, maxLives, isRelaxMode = false) {
  if (!DOM.hudLives) return;
  const heartSvg = (isActive) => `
    <span class="heart-slot ${isActive ? "active" : "lost"}">
      <svg class="heart-icon ${isActive ? "active" : "lost"}" width="24" height="24" viewBox="0 0 24 24" fill="${isActive ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </span>`;

  if (isRelaxMode) {
    DOM.hudLives.innerHTML = `${heartSvg(true)} <span class="infinite-symbol">∞</span>`;
    return;
  }
  let html = "";
  for (let i = 0; i < maxLives; i++) {
    html += heartSvg(i < lives);
  }
  DOM.hudLives.innerHTML = html;
}

let creationAnimationTimer = null;
let hapticDropTimer = null;

export function flushLevelCreationAnimation() {
  if (creationAnimationTimer) {
    clearTimeout(creationAnimationTimer);
    creationAnimationTimer = null;
  }
  if (hapticDropTimer) {
    clearTimeout(hapticDropTimer);
    hapticDropTimer = null;
  }
  if (DOM.board) {
    DOM.board.classList.remove("creating");
  }
}

export function renderBoard(level, onCellClick, { animate = true } = {}) {
  flushLevelCreationAnimation();

  const maxDim = Math.max(level.w, level.h);
  DOM.board.dataset.gridSize = maxDim;
  const boardMax = maxDim >= 7 ? 405 : (maxDim >= 5 ? 385 : 360);
  const size = Math.min(boardMax, window.innerWidth - (window.innerWidth < 420 ? 24 : 44));
  DOM.board.style.width = size + "px";
  DOM.board.style.gridTemplateColumns = `repeat(${level.w}, 1fr)`;
  DOM.board.innerHTML = "";
  cellEls = [];

  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldAnimate = animate && !prefersReducedMotion;


  // Calculate center of grid for radial outward ordering
  const centerR = (level.h - 1) / 2;
  const centerC = (level.w - 1) / 2;
  let maxDelay = 0;

  // Collect all cells with their distances, then sort and rank them
  // so EVERY single cell gets a unique delay — true individual per-cell growth
  const cellData = [];
  for (let r = 0; r < level.h; r++) {
    cellEls.push([]);
    for (let c = 0; c < level.w; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.tabIndex = -1;

      const isStart = (r === level.start[0] && c === level.start[1]);
      const isGoal = (r === level.goal[0] && c === level.goal[1]);
      if (isStart) cell.classList.add("start-cell");
      if (isGoal) cell.classList.add("goal-cell");

      const val = level.grid[r][c];
      if (isGoal) {
        cell.innerHTML = '<span class="cell-glyph goal-label">GOAL</span>';
      } else if (val === 0) {
        cell.classList.add("void-cell");
        cell.innerHTML = '<span class="cell-glyph void">●</span>';
      } else {
        cell.innerHTML = `<span class="cell-glyph">${val}</span>`;
      }

      cell.addEventListener("click", () => {
        flushLevelCreationAnimation();
        onCellClick(r, c);
      });
      DOM.board.appendChild(cell);
      cellEls[r].push(cell);

      if (shouldAnimate) {
        const dist = Math.hypot(r - centerR, c - centerC);
        // Use angle to break ties within the same ring (top → clockwise)
        const angle = Math.atan2(c - centerC, r - centerR);
        cellData.push({ cell, dist, angle });
      }
    }
  }

  // Group cells into concentric rings by Euclidean distance from center.
  // All cells in the same ring reveal simultaneously; rings expand outward one-by-one.
  if (shouldAnimate) {
    // Round distance to 2 decimal places to reliably bucket cells into rings
    cellData.sort((a, b) => a.dist - b.dist);

    // Build ordered list of unique ring distances
    const rings = [];
    let lastDist = -1;
    cellData.forEach(({ cell, dist }) => {
      const rounded = Math.round(dist * 100) / 100;
      if (Math.abs(rounded - lastDist) > 0.05) {
        rings.push({ dist: rounded, cells: [] });
        lastDist = rounded;
      }
      rings[rings.length - 1].cells.push(cell);
    });

    let startCellDelay = 0;
    const [startR, startC] = level.start;
    const ringStepMs = 90;
    rings.forEach((ring, ringIndex) => {
      const delayMs = ringIndex * ringStepMs;
      if (delayMs > maxDelay) maxDelay = delayMs;
      ring.cells.forEach(cell => {
        cell.style.setProperty("--cell-spawn-delay", `${delayMs}ms`);
        if (parseInt(cell.dataset.r, 10) === startR && parseInt(cell.dataset.c, 10) === startC) {
          startCellDelay = delayMs;
        }
      });
    });

    // Breadcrumb Trail SVG layer (Multi-lane Overpass Architecture)
    const isVellum = document.documentElement.getAttribute("data-theme") === "vellum";
    const glowColor = isVellum ? "#1D4E6D" : "#FFB800";
    const glowOpacity = isVellum ? "0.45" : "0.85";
    const dangerColor = isVellum ? "#505A64" : "#F43F5E";

    trailSvgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    trailSvgEl.setAttribute("class", "trail-svg");
    trailSvgEl.setAttribute("id", "trailSvg");
    trailSvgEl.innerHTML = `
      <defs>
        <filter id="glowTrail" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
        <filter id="glowSky" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
        <filter id="glowDanger" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${dangerColor}" flood-opacity="0.9"/>
        </filter>
        <filter id="vellumInkDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#1E1C1A" flood-opacity="0.22"/>
        </filter>
      </defs>
      <g id="trailUnderHalos"></g>
      <g id="trailSegments"></g>
      <g id="trailChevrons"></g>
      <g id="trailNodes"></g>
    `;
    DOM.board.appendChild(trailSvgEl);

    tokenEl = document.createElement("div");
    tokenEl.className = "token";
    tokenEl.style.setProperty("--cell-spawn-delay", `${startCellDelay}ms`);
    tokenEl.innerHTML = `
      <div class="token-inner">
        <div class="token-frame"></div>
        <div class="token-dir-arrow up" id="tokenDirUp" aria-label="Up">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2.5 7.5 L6 3.5 L9.5 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow down" id="tokenDirDown" aria-label="Down">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2.5 4.5 L6 8.5 L9.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow left" id="tokenDirLeft" aria-label="Left">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M7.5 2.5 L3.5 6 L7.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow right" id="tokenDirRight" aria-label="Right">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M4.5 2.5 L8.5 6 L4.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
    DOM.board.appendChild(tokenEl);

    // Force reflow BEFORE adding .creating — this locks cells and token-inner at scale(0)
    // so the browser has a registered "initial state" to animate FROM.
    void DOM.board.offsetWidth;
    DOM.board.classList.add("creating");

    const revealDuration = maxDelay + 280;

    creationAnimationTimer = setTimeout(() => {
      if (DOM.board) DOM.board.classList.remove("creating");
      creationAnimationTimer = null;
    }, revealDuration);

    hapticDropTimer = setTimeout(() => {
      PlatformBridge.vibrateLight();
      hapticDropTimer = null;
    }, startCellDelay + 180);
  } else {
    // Non-animated board build (e.g. editor or reduced motion)
    const isVellum = document.documentElement.getAttribute("data-theme") === "vellum";
    const glowColor = isVellum ? "#1D4E6D" : "#FFB800";
    const glowOpacity = isVellum ? "0.45" : "0.85";
    const dangerColor = isVellum ? "#505A64" : "#F43F5E";

    trailSvgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    trailSvgEl.setAttribute("class", "trail-svg");
    trailSvgEl.setAttribute("id", "trailSvg");
    trailSvgEl.innerHTML = `
      <defs>
        <filter id="glowTrail" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
        <filter id="glowSky" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${glowColor}" flood-opacity="${glowOpacity}"/>
        </filter>
        <filter id="glowDanger" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="${dangerColor}" flood-opacity="0.9"/>
        </filter>
        <filter id="vellumInkDepth" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#1E1C1A" flood-opacity="0.22"/>
        </filter>
      </defs>
      <g id="trailUnderHalos"></g>
      <g id="trailSegments"></g>
      <g id="trailChevrons"></g>
      <g id="trailNodes"></g>
    `;
    DOM.board.appendChild(trailSvgEl);

    tokenEl = document.createElement("div");
    tokenEl.className = "token";
    tokenEl.innerHTML = `
      <div class="token-inner">
        <div class="token-frame"></div>
        <div class="token-dir-arrow up" id="tokenDirUp" aria-label="Up">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2.5 7.5 L6 3.5 L9.5 7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow down" id="tokenDirDown" aria-label="Down">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M2.5 4.5 L6 8.5 L9.5 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow left" id="tokenDirLeft" aria-label="Left">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M7.5 2.5 L3.5 6 L7.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="token-dir-arrow right" id="tokenDirRight" aria-label="Right">
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path d="M4.5 2.5 L8.5 6 L4.5 9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
    DOM.board.appendChild(tokenEl);
  }
}

export function cellMetrics() {
  const firstCell = cellEls[0]?.[0];
  if (!firstCell) return { step: 0, cellSize: 0 };
  const rect = firstCell.getBoundingClientRect();
  const step = rect.width + 6; // gap
  return { step, cellSize: rect.width };
}

export function setArrowsMoving(isMoving) {
  if (tokenEl) {
    tokenEl.classList.toggle("moving", Boolean(isMoving));
  }
}

export function placeToken(playerPos, instant = false) {
  if (!tokenEl || !playerPos) return;
  const [r, c] = playerPos;
  const targetCell = cellEls[r]?.[c];
  if (!targetCell) return;

  const x = targetCell.offsetLeft;
  const y = targetCell.offsetTop;
  const w = targetCell.offsetWidth;
  const h = targetCell.offsetHeight;

  if (instant) {
    tokenEl.style.transition = "none";
  } else {
    tokenEl.style.transition = "transform 190ms cubic-bezier(0.22, 1, 0.36, 1)";
  }
  tokenEl.style.width = w + "px";
  tokenEl.style.height = h + "px";
  tokenEl.style.transform = `translate(${x}px, ${y}px)`;
  if (instant) {
    tokenEl.getBoundingClientRect();
    tokenEl.style.transition = "";
  }
}

export function updateGameHeader(levelIndex, level, moveCount, historyLength) {
  if (DOM.gameTitle) DOM.gameTitle.textContent = `Level ${String(levelIndex + 1).padStart(levelIndex + 1 >= 100 ? 3 : 2, "0")}`;
  if (DOM.gameChapter) DOM.gameChapter.textContent = `${level.phase || ""} • ${level.name || ""}`;
  if (DOM.hudMoves) DOM.hudMoves.textContent = moveCount;
  if (DOM.undoBtn) DOM.undoBtn.disabled = historyLength === 0;
}

export function showToast(msg, durationMs = 1500) {
  if (!DOM.toast) return;
  if (msg) DOM.toast.textContent = msg;
  DOM.toast.classList.remove("warning");
  DOM.toast.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    hideToast();
  }, durationMs);
}

export function hideToast() {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  if (DOM.toast) {
    DOM.toast.classList.remove("show", "warning");
    DOM.toast.textContent = "No legal move that way";
  }
}

export function showDeadEndToast() {
  if (!DOM.toast) return;
  DOM.toast.textContent = "Dead end — no legal moves. Use Undo or Restart.";
  DOM.toast.classList.add("warning", "show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    hideToast();
  }, 2500);
}

export function clearDeadEndFeedback() {
  // If a dead-end warning toast specifically is active, dismiss it
  if (DOM.toast && DOM.toast.classList.contains("warning")) {
    hideToast();
  }
  if (DOM.undoBtn) DOM.undoBtn.classList.remove("attention-pulse");
  if (DOM.restartBtn) DOM.restartBtn.classList.remove("attention-pulse");
  if (cellEls && cellEls.length) {
    for (let r = 0; r < cellEls.length; r++) {
      for (let c = 0; c < (cellEls[r]?.length || 0); c++) {
        cellEls[r]?.[c]?.classList.remove("dead-end-hit");
      }
    }
  }
}

export function renderTrail(historyCoords = [], isViable = true, showTrail = false, showSolutionFeedback = false) {
  if (!trailSvgEl || !cellEls.length) return;
  lastRenderedCoords = historyCoords;
  lastRenderedViable = isViable;
  lastRenderedShowTrail = Boolean(showTrail);
  lastRenderedShowSolutionFeedback = Boolean(showSolutionFeedback);

  const halosGroup = trailSvgEl.querySelector("#trailUnderHalos");
  const segmentsGroup = trailSvgEl.querySelector("#trailSegments");
  const chevronsGroup = trailSvgEl.querySelector("#trailChevrons");
  const nodesGroup = trailSvgEl.querySelector("#trailNodes");
  if (!halosGroup || !segmentsGroup || !chevronsGroup || !nodesGroup) return;

  // 1. Mark ALL historical cells visited (persistent footprints)
  for (let r = 0; r < cellEls.length; r++) {
    for (let c = 0; c < cellEls[r].length; c++) {
      if (cellEls[r][c]) {
        cellEls[r][c].classList.remove("visited");
      }
    }
  }

  for (let i = 0; i < historyCoords.length - 1; i++) {
    const [r, c] = historyCoords[i];
    if (cellEls[r]?.[c]) {
      cellEls[r][c].classList.add("visited");
    }
  }

  // If breadcrumbs visualization is toggled OFF: keep cards completely clean and uncluttered
  if (!showTrail) {
    trailSvgEl.style.display = "none";
    halosGroup.innerHTML = "";
    segmentsGroup.innerHTML = "";
    chevronsGroup.innerHTML = "";
    nodesGroup.innerHTML = "";
    return;
  }

  trailSvgEl.style.display = "";

  // If no moves made yet (only start cell)
  const totalSegments = historyCoords.length - 1;
  if (totalSegments <= 0) {
    halosGroup.innerHTML = "";
    segmentsGroup.innerHTML = "";
    chevronsGroup.innerHTML = "";
    nodesGroup.innerHTML = "";
    return;
  }

  // 2. Rolling Recency Window: show up to last 4 segments (Comet Tail)
  const maxVisible = 4;
  const startSegmentIdx = Math.max(0, totalSegments - maxVisible);
  const visibleCount = totalSegments - startSegmentIdx;

  let halosHtml = "";
  let segmentsHtml = "";
  let chevronsHtml = "";
  let nodesHtml = "";

  // Dynamic scaling based on grid density
  const gridDim = Math.max(cellEls.length, cellEls[0]?.length || 4);
  let offsetVal = 3.8;
  let strokeW = 3.6;
  let haloW = 6.6;
  let nodeR = 3.4;
  let chevScale = 1.2;

  if (gridDim >= 7) {
    offsetVal = 1.8;
    strokeW = 1.8;
    haloW = 3.6;
    nodeR = 1.8;
    chevScale = 0.75;
  } else if (gridDim >= 5) {
    offsetVal = 2.4;
    strokeW = 2.2;
    haloW = 4.4;
    nodeR = 2.2;
    chevScale = 0.9;
  } else {
    offsetVal = 3.0;
    strokeW = 2.6;
    haloW = 5.2;
    nodeR = 2.6;
    chevScale = 1.05;
  }

  const isVellum = document.documentElement.getAttribute("data-theme") === "vellum";

  for (let segIdx = startSegmentIdx; segIdx < totalSegments; segIdx++) {
    const [r1, c1] = historyCoords[segIdx];
    const [r2, c2] = historyCoords[segIdx + 1];
    const cell1 = cellEls[r1]?.[c1];
    const cell2 = cellEls[r2]?.[c2];
    if (!cell1 || !cell2) continue;

    const w1 = cell1.offsetWidth;
    const h1 = cell1.offsetHeight;
    const w2 = cell2.offsetWidth;
    const h2 = cell2.offsetHeight;
    const cx1 = cell1.offsetLeft + w1 / 2;
    const cy1 = cell1.offsetTop + h1 / 2;
    const cx2 = cell2.offsetLeft + w2 / 2;
    const cy2 = cell2.offsetTop + h2 / 2;

    let x1 = cx1;
    let y1 = cy1;
    let x2 = cx2;
    let y2 = cy2;
    const isHorizontal = (r1 === r2);

    // Multi-lane corridor routing: parallel tracks for outbound vs return leaps
    if (isHorizontal) {
      const shift = (c2 > c1 ? offsetVal : -offsetVal);
      y1 += shift;
      y2 += shift;
    } else {
      const shift = (r2 > r1 ? offsetVal : -offsetVal);
      x1 += shift;
      x2 += shift;
    }

    // Recency opacity: older visible segments stay dark and clear in Vellum
    const recencyRank = segIdx - startSegmentIdx; // 0 to visibleCount - 1
    const minOpacity = isVellum ? 0.70 : 0.40;
    const opacity = (visibleCount === 1) 
      ? 1.0 
      : Math.min(1.0, minOpacity + (1.0 - minOpacity) * ((recencyRank + 1) / visibleCount));

    const isLatest = (segIdx === totalSegments - 1);
    const isTrapped = isLatest && !isViable && lastRenderedShowSolutionFeedback;
    const defaultColor = isVellum ? "var(--trail-stroke, var(--accent-primary))" : "var(--trail-stroke, var(--amber))";
    const strokeColor = isTrapped ? "var(--danger)" : defaultColor;
    const strokeDash = isTrapped ? 'stroke-dasharray="5 3"' : "";

    // 3D Overpass Halo: Precise bridge cut so crossing lines remain legible without thick stripes
    const haloStroke = isVellum ? "var(--trail-halo, #EFECE4)" : "var(--trail-halo, #0B131A)";
    const haloWidth = isVellum ? (strokeW + 1.2) : (strokeW + 2.0);
    halosHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${haloStroke}" stroke-width="${haloWidth}" stroke-linecap="round" />`;

    // Core vector line (Pure hardware-accelerated SVG line, no zero-dimension filter bugs)
    segmentsHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round" opacity="${opacity}" ${strokeDash} />`;

    // Directional Chevron Marker at midpoint (only if segment has sufficient length)
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const markerOpacity = Math.max(opacity, isVellum ? 0.88 : 0.75);
    if (dist >= 14) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      const cp1 = (-3 * chevScale).toFixed(1);
      const cp2 = (-2.5 * chevScale).toFixed(1);
      const cp3 = (3 * chevScale).toFixed(1);
      const cp4 = (2.5 * chevScale).toFixed(1);
      const cp5 = (-1.2 * chevScale).toFixed(1);
      chevronsHtml += `<polygon points="${cp1},${cp2} ${cp3},0 ${cp1},${cp4} ${cp5},0" transform="translate(${mx}, ${my}) rotate(${angle})" fill="${strokeColor}" opacity="${markerOpacity}" />`;
    }

    // Turn Node Pip at origin
    nodesHtml += `<circle cx="${x1}" cy="${y1}" r="${nodeR}" fill="${strokeColor}" opacity="${markerOpacity}" />`;
  }

  halosGroup.innerHTML = halosHtml;
  segmentsGroup.innerHTML = segmentsHtml;
  chevronsGroup.innerHTML = chevronsHtml;
  nodesGroup.innerHTML = nodesHtml;
}

export function refreshTrail(showTrail = lastRenderedShowTrail) {
  if (lastRenderedCoords && lastRenderedCoords.length) {
    renderTrail(lastRenderedCoords, lastRenderedViable, showTrail, lastRenderedShowSolutionFeedback);
  }
}

export function updateTrailButton(showTrail = false) {
  if (DOM.trailToggleBtn) {
    DOM.trailToggleBtn.classList.toggle("active", Boolean(showTrail));
    DOM.trailToggleBtn.setAttribute(
      "title",
      showTrail ? "Breadcrumbs: ON (Press T to turn off)" : "Breadcrumbs: OFF (Press T to turn on)"
    );
  }
  if (DOM.settingTrail) {
    DOM.settingTrail.checked = Boolean(showTrail);
  }
}

export function renderViability(viability, isGoal = false, isDeadEnd = false, playerPos = null, showSolutionFeedback = false) {
  const dot = tokenEl?.querySelector(".dot");
  const isTrapped = (!viability?.solvable && !isGoal) || isDeadEnd;

  // 1. Update Token Dot Resonance
  if (dot) {
    dot.classList.remove("viable", "trapped", "goal");
    if (isGoal) {
      dot.classList.add("goal");
    } else if (isTrapped && showSolutionFeedback) {
      dot.classList.add("trapped");
    } else {
      dot.classList.add("viable");
    }
  }

  // 2. Update Current Cell Trapped Branch marker
  if (playerPos && cellEls.length) {
    const [pr, pc] = playerPos;
    const currCell = cellEls[pr]?.[pc];
    if (currCell) {
      if (isTrapped && showSolutionFeedback) {
        currCell.classList.add("trapped-branch");
      } else {
        currCell.classList.remove("trapped-branch");
      }
    }
  }

  // 3. Update HUD Path Status Bubble
  if (DOM.hudPathStatus && DOM.hudPathText) {
    DOM.hudPathStatus.classList.remove("viable", "trapped", "goal");
    if (isGoal) {
      DOM.hudPathStatus.classList.add("goal");
      DOM.hudPathText.textContent = "★ GOAL";
      if (DOM.hudPathDot) DOM.hudPathDot.textContent = "★";
    } else if (isTrapped) {
      if (showSolutionFeedback) {
        DOM.hudPathStatus.classList.add("trapped");
        DOM.hudPathText.textContent = "⚠️ TRAP";
        if (DOM.hudPathDot) DOM.hudPathDot.textContent = "!";
        if (DOM.undoBtn) DOM.undoBtn.classList.add("attention-pulse");
      } else {
        DOM.hudPathStatus.classList.add("viable");
        DOM.hudPathText.textContent = "-- LEFT";
        if (DOM.hudPathDot) DOM.hudPathDot.textContent = "●";
      }
    } else {
      DOM.hudPathStatus.classList.add("viable");
      if (viability && typeof viability.moves === "number" && viability.moves > 0) {
        DOM.hudPathText.textContent = `${viability.moves} LEFT`;
      } else {
        DOM.hudPathText.textContent = "ON TRACK";
      }
      if (DOM.hudPathDot) DOM.hudPathDot.textContent = "●";
    }
  }
}

export function drawConstellationSigil(svgEl, path, level) {
  if (!svgEl) return;
  svgEl.innerHTML = "";

  const coords = (Array.isArray(path) && path.length > 0)
    ? path
    : (level?.start && level?.goal ? [level.start, level.goal] : [[0, 0], [0, 1]]);
  const cols = (level && (level.w || (level.grid && level.grid[0]?.length))) || 4;
  const rows = (level && (level.h || (level.grid && level.grid?.length))) || 4;

  const spanW = 108;
  const spanH = 108;
  const stepX = cols > 1 ? spanW / (cols - 1) : 0;
  const stepY = rows > 1 ? spanH / (rows - 1) : 0;
  const startX = 100 - ((cols - 1) * stepX) / 2;
  const startY = 100 - ((rows - 1) * stepY) / 2;

  const pts = coords.map(([r, c]) => ({
    x: Math.round(startX + c * stepX),
    y: Math.round(startY + r * stepY)
  }));

  const ns = "http://www.w3.org/2000/svg";

  // 1. Background Sacred Geometry & Celestial Rings
  const bgGroup = document.createElementNS(ns, "g");
  bgGroup.setAttribute("class", "sigil-bg-group");

  const outerRing = document.createElementNS(ns, "circle");
  outerRing.setAttribute("cx", "100");
  outerRing.setAttribute("cy", "100");
  outerRing.setAttribute("r", "88");
  outerRing.setAttribute("class", "sigil-ring sigil-outer-ring");
  bgGroup.appendChild(outerRing);

  const dashRing = document.createElementNS(ns, "circle");
  dashRing.setAttribute("cx", "100");
  dashRing.setAttribute("cy", "100");
  dashRing.setAttribute("r", "80");
  dashRing.setAttribute("class", "sigil-ring sigil-dash-ring");
  bgGroup.appendChild(dashRing);

  const innerRing = document.createElementNS(ns, "circle");
  innerRing.setAttribute("cx", "100");
  innerRing.setAttribute("cy", "100");
  innerRing.setAttribute("r", "50");
  innerRing.setAttribute("class", "sigil-ring sigil-core-ring");
  bgGroup.appendChild(innerRing);

  // Cardinal crosshair ticks
  const cardinalTicks = [
    [100, 7, 100, 15],
    [100, 185, 100, 193],
    [7, 100, 15, 100],
    [185, 100, 192, 100]
  ];
  cardinalTicks.forEach(([x1, y1, x2, y2]) => {
    const tick = document.createElementNS(ns, "line");
    tick.setAttribute("x1", String(x1));
    tick.setAttribute("y1", String(y1));
    tick.setAttribute("x2", String(x2));
    tick.setAttribute("y2", String(y2));
    tick.setAttribute("class", "sigil-cardinal-tick");
    bgGroup.appendChild(tick);
  });

  svgEl.appendChild(bgGroup);

  // 2. The Path Polyline String
  let pathD = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    pathD += ` L ${pts[i].x} ${pts[i].y}`;
  }

  // Ghost ambient path
  const ghostPath = document.createElementNS(ns, "path");
  ghostPath.setAttribute("d", pathD);
  ghostPath.setAttribute("class", "sigil-path-ghost");
  svgEl.appendChild(ghostPath);

  // Primary luminous laser beam (Graceful slowed down draw: 2000ms)
  const beamPath = document.createElementNS(ns, "path");
  beamPath.setAttribute("d", pathD);
  beamPath.setAttribute("class", "sigil-path-beam");
  svgEl.appendChild(beamPath);

  const traceDuration = 2000;

  try {
    const pathLength = beamPath.getTotalLength() || 240;
    beamPath.style.strokeDasharray = `${pathLength}`;
    beamPath.style.strokeDashoffset = `${pathLength}`;
    requestAnimationFrame(() => {
      beamPath.style.transition = `stroke-dashoffset ${traceDuration}ms cubic-bezier(0.35, 0, 0.25, 1)`;
      beamPath.style.strokeDashoffset = "0";
    });
  } catch {
    beamPath.style.strokeDasharray = "500";
    beamPath.style.strokeDashoffset = "0";
  }

  // 3. Constellation Junction Stars (Staggered progressive popping)
  const nodesGroup = document.createElementNS(ns, "g");
  nodesGroup.setAttribute("class", "sigil-nodes-group");

  const stepDelay = pts.length > 1 ? (traceDuration * 0.88) / (pts.length - 1) : 0;

  pts.forEach((pt, idx) => {
    const isStart = idx === 0;
    const isGoal = idx === pts.length - 1;
    const nodeDelay = Math.round(idx * stepDelay);

    if (isGoal) {
      // Radiant Goal Beacon with halo
      const goalHalo = document.createElementNS(ns, "circle");
      goalHalo.setAttribute("cx", String(pt.x));
      goalHalo.setAttribute("cy", String(pt.y));
      goalHalo.setAttribute("r", "11");
      goalHalo.setAttribute("class", "sigil-node-goal-halo");
      goalHalo.style.animation = "sigilHaloExpand 700ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
      goalHalo.style.animationDelay = `${Math.round(traceDuration * 0.92)}ms`;
      nodesGroup.appendChild(goalHalo);

      const goalCore = document.createElementNS(ns, "circle");
      goalCore.setAttribute("cx", String(pt.x));
      goalCore.setAttribute("cy", String(pt.y));
      goalCore.setAttribute("r", "6");
      goalCore.setAttribute("class", "sigil-node sigil-node-goal");
      goalCore.style.animation = "sigilNodePop 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
      goalCore.style.animationDelay = `${nodeDelay}ms`;
      nodesGroup.appendChild(goalCore);
    } else if (isStart) {
      // Start Origin Star
      const startCore = document.createElementNS(ns, "circle");
      startCore.setAttribute("cx", String(pt.x));
      startCore.setAttribute("cy", String(pt.y));
      startCore.setAttribute("r", "5");
      startCore.setAttribute("class", "sigil-node sigil-node-start");
      startCore.style.animation = "sigilNodePop 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
      startCore.style.animationDelay = "0ms";
      nodesGroup.appendChild(startCore);
    } else {
      // Intermediate Constellation Star
      const interCore = document.createElementNS(ns, "circle");
      interCore.setAttribute("cx", String(pt.x));
      interCore.setAttribute("cy", String(pt.y));
      interCore.setAttribute("r", "3.2");
      interCore.setAttribute("class", "sigil-node sigil-node-inter");
      interCore.style.animation = "sigilNodePop 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both";
      interCore.style.animationDelay = `${nodeDelay}ms`;
      nodesGroup.appendChild(interCore);
    }
  });

  svgEl.appendChild(nodesGroup);
}

let effAnimTimer = null;
function animateEfficiencyCounter(el, targetVal, durationMs = 450) {
  if (!el) return;
  if (effAnimTimer) cancelAnimationFrame(effAnimTimer);
  const startTime = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = progress * (2 - progress); // easeOutQuad
    const current = Math.round(startVal + (targetVal - startVal) * eased);
    el.textContent = `${current}%`;

    if (progress < 1) {
      effAnimTimer = requestAnimationFrame(step);
    } else {
      el.textContent = `${targetVal}%`;
      effAnimTimer = null;
    }
  }

  effAnimTimer = requestAnimationFrame(step);
}

export function renderWinModal({
  levelIndex,
  level,
  moveCount,
  optimal,
  path,
  isCustomLevel,
  isLastLevel,
  isDailyLevel,
  dailyStreak,
  devDiagnosticsEnabled
}) {
  const padIndex = String(levelIndex + 1).padStart(levelIndex + 1 >= 100 ? 3 : 2, "0");

  // 1. Level Number Title
  if (DOM.winTitle) {
    if (isDailyLevel) {
      DOM.winTitle.textContent = "Daily Challenge";
    } else if (isCustomLevel) {
      DOM.winTitle.textContent = "Playtest Level";
    } else {
      DOM.winTitle.textContent = `Level ${padIndex}`;
    }
  }

  // 1b. Completion badge (replays pop animation each time)
  if (DOM.winSubtitle) {
    DOM.winSubtitle.style.animation = "none";
    void DOM.winSubtitle.offsetWidth; // force reflow
    DOM.winSubtitle.style.animation = "";
    if (isDailyLevel) {
      DOM.winSubtitle.textContent = dailyStreak > 0 ? `🔥 ${dailyStreak} Day Streak!` : "Daily Solved!";
    } else if (isCustomLevel) {
      DOM.winSubtitle.textContent = "Playtest Complete";
    } else {
      DOM.winSubtitle.textContent = "Cleared";
    }
  }

  // 2. Centerpiece: The Constellation Sigil Medallion
  if (DOM.winSigilSvg) {
    drawConstellationSigil(DOM.winSigilSvg, path, level);
  }
  if (DOM.winSigilMedallion) {
    DOM.winSigilMedallion.classList.remove("pop");
    void DOM.winSigilMedallion.offsetWidth; // force reflow
    DOM.winSigilMedallion.classList.add("pop");
  }

  // 3. Movement Efficiency & Moves Ratio
  const optimalMoves = Math.max(1, optimal || 1);
  const actualMoves = Math.max(1, moveCount || 1);
  const eff = Math.min(100, Math.max(10, Math.round((optimalMoves / actualMoves) * 100)));

  if (DOM.winEfficiency) {
    DOM.winEfficiency.textContent = `${eff}%`;
    DOM.winEfficiency.classList.remove("good", "ok");
    DOM.winEfficiency.classList.add(eff >= 90 ? "good" : "ok");
  }
  if (DOM.winEfficiencyStat) {
    DOM.winEfficiencyStat.style.display = devDiagnosticsEnabled ? "flex" : "none";
  }

  // Consumer Dual-Stat Strip (Efficiency + Move Count)
  if (DOM.winStatsStrip) {
    let tierLabel = "SOLVED";
    let tierIcon = "🏁";
    let tierClass = "tier-solved";

    if (eff >= 100) {
      tierLabel = "FLAWLESS";
      tierIcon = "★";
      tierClass = "tier-flawless";
    } else if (eff >= 85) {
      tierLabel = "EXCELLENT";
      tierIcon = "⚡";
      tierClass = "tier-excellent";
    } else if (eff >= 70) {
      tierLabel = "GREAT";
      tierIcon = "⚡";
      tierClass = "tier-great";
    } else if (eff >= 50) {
      tierLabel = "GOOD";
      tierIcon = "👍";
      tierClass = "tier-good";
    }

    if (DOM.winEffPill) {
      DOM.winEffPill.className = `win-stat-pill efficiency ${tierClass}`;
      DOM.winEffPill.classList.remove("pop");
      void DOM.winEffPill.offsetWidth;
      DOM.winEffPill.classList.add("pop");
    }
    if (DOM.winEffIcon) DOM.winEffIcon.textContent = tierIcon;
    if (DOM.winEffTier) DOM.winEffTier.textContent = tierLabel;
    if (DOM.winMovesVal) DOM.winMovesVal.textContent = `${actualMoves}\u00A0/\u00A0${optimalMoves}`;

    // Animate percentage count-up
    animateEfficiencyCounter(DOM.winEffVal, eff);
  }

  // 4. Next / Editor / Final Button text
  if (DOM.winNextBtn) {
    if (isDailyLevel) {
      DOM.winNextBtn.innerHTML = `<span>Back to Hub</span><span style="font-size:15px;">⌂</span>`;
      DOM.winNextBtn.style.display = "flex";
    } else if (isCustomLevel) {
      DOM.winNextBtn.innerHTML = `<span>Back to Editor</span><span style="font-size:15px;">✎</span>`;
      DOM.winNextBtn.style.display = "flex";
    } else if (isLastLevel) {
      DOM.winNextBtn.innerHTML = `<span>Campaign Complete</span><span style="font-size:15px;">🏆</span>`;
      DOM.winNextBtn.style.display = "flex";
    } else {
      DOM.winNextBtn.innerHTML = `
        <span>Continue</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>`;
      DOM.winNextBtn.style.display = "flex";
    }
  }
}

export function renderFinalModal({ totalSolved, totalLevels }) {
  if (DOM.finalTitle) DOM.finalTitle.textContent = "Campaign Complete!";
  if (DOM.finalSub) {
    DOM.finalSub.textContent = `All ${totalLevels} puzzles conquered across all 10 chapters!`;
  }
  if (DOM.finalTotalSolved) DOM.finalTotalSolved.textContent = totalSolved;
  if (DOM.finalTotalLevels) DOM.finalTotalLevels.textContent = totalLevels;
}

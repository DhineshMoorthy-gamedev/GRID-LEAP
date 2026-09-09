import { solve } from "../core/solver.js";

/**
 * UI Renderer & DOM Bindings
 */

export const DOM = {
  // Screens
  screenHome: document.getElementById("screenHome"),
  screenGame: document.getElementById("screenGame"),

  // Home Hub
  homeHelpBtn: document.getElementById("homeHelpBtn"),
  homeSettingsBtn: document.getElementById("homeSettingsBtn"),
  heroBanner: document.getElementById("heroBanner"),
  heroBadge: document.getElementById("heroBadge"),
  heroTitle: document.getElementById("heroTitle"),
  heroSub: document.getElementById("heroSub"),
  heroPlayBtn: document.getElementById("heroPlayBtn"),
  completionPill: document.getElementById("completionPill"),
  levelStrip: document.getElementById("levelStrip"),

  // Game Play Screen
  gameBackBtn: document.getElementById("gameBackBtn"),
  gameTitle: document.getElementById("gameTitle"),
  gameChapter: document.getElementById("gameChapter"),
  gamePauseBtn: document.getElementById("gamePauseBtn"),
  hudLives: document.getElementById("hudLives"),
  hudMoves: document.getElementById("hudMoves"),
  board: document.getElementById("board"),
  undoBtn: document.getElementById("undoBtn"),
  hintBtn: document.getElementById("hintBtn"),
  restartBtn: document.getElementById("restartBtn"),

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
  winTitle: document.getElementById("winTitle"),
  winMoves: document.getElementById("winMoves"),
  winOptimal: document.getElementById("winOptimal"),
  winEfficiency: document.getElementById("winEfficiency"),
  winEfficiencyStat: document.getElementById("winEfficiencyStat"),
  winRestartBtn: document.getElementById("winRestartBtn"),
  winNextBtn: document.getElementById("winNextBtn"),

  outOfLivesModal: document.getElementById("outOfLivesModal"),
  outOfLivesRestartBtn: document.getElementById("outOfLivesRestartBtn"),
  outOfLivesHomeBtn: document.getElementById("outOfLivesHomeBtn"),

  pauseModal: document.getElementById("pauseModal"),
  pauseLevel: document.getElementById("pauseLevel"),
  pauseMoves: document.getElementById("pauseMoves"),
  resumeBtn: document.getElementById("resumeBtn"),
  pauseRestartBtn: document.getElementById("pauseRestartBtn"),
  pauseHomeBtn: document.getElementById("pauseHomeBtn"),

  settingsModal: document.getElementById("settingsModal"),
  settingSound: document.getElementById("settingSound"),
  settingHaptics: document.getElementById("settingHaptics"),
  settingRelaxMode: document.getElementById("settingRelaxMode"),
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
  closeRulesBtn: document.getElementById("closeRulesBtn"),

  finalOverlay: document.getElementById("finalOverlay"),
  finalRestartBtn: document.getElementById("finalRestartBtn")
};

let cellEls = [];
let tokenEl = null;
let deadEndToastTimeout = null;

export function getCellElements() {
  return cellEls;
}

export function getTokenElement() {
  return tokenEl;
}

export function renderHomeHub(levels, lastPlayedIndex, completedArr, onLevelSelect) {
  // 1. Update Hero Card
  const currentLv = levels[lastPlayedIndex] || levels[0];
  const isAllCleared = completedArr.every(Boolean);
  const clearedCount = completedArr.filter(Boolean).length;

  if (DOM.heroTitle) DOM.heroTitle.textContent = `Level ${String(lastPlayedIndex + 1).padStart(2, "0")}`;
  if (DOM.heroSub) DOM.heroSub.textContent = `${currentLv.phase} • ${currentLv.name}`;
  if (DOM.heroBadge) DOM.heroBadge.textContent = isAllCleared ? "COMPLETED" : (completedArr[lastPlayedIndex] ? "REPLAY" : "RESUME");
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

      dot.innerHTML = `
        <span class="dot-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="dot-score">${diff.score.toFixed(1)}</span>
        ${isDone ? '<span class="dot-check">✓</span>' : ""}
      `;

      dot.addEventListener("click", () => onLevelSelect(i));
      DOM.levelStrip.appendChild(dot);
    });
  }
}

export function renderLivesHUD(lives, maxLives, isRelaxMode = false) {
  if (!DOM.hudLives) return;
  if (isRelaxMode) {
    DOM.hudLives.innerHTML = '<span class="heart active">❤️</span> <span style="font-size:10px; font-weight:700; color:var(--paper-dim);">∞</span>';
    return;
  }
  let html = "";
  for (let i = 0; i < maxLives; i++) {
    const isActive = i < lives;
    html += `<span class="heart ${isActive ? "active" : "lost"}">${isActive ? "❤️" : "🖤"}</span>`;
  }
  DOM.hudLives.innerHTML = html;
}

export function renderBoard(level, onCellClick) {
  DOM.board.style.gridTemplateColumns = `repeat(${level.w}, 1fr)`;
  const size = Math.min(380, window.innerWidth - 64);
  DOM.board.style.width = size + "px";
  DOM.board.innerHTML = "";
  cellEls = [];

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

      cell.textContent = level.grid[r][c];
      cell.addEventListener("click", () => onCellClick(r, c));
      DOM.board.appendChild(cell);
      cellEls[r].push(cell);
    }
  }

  tokenEl = document.createElement("div");
  tokenEl.className = "token";
  tokenEl.innerHTML = `
    <div class="dot"></div>
    <div class="token-dir-arrow up" id="tokenDirUp">▲</div>
    <div class="token-dir-arrow down" id="tokenDirDown">▼</div>
    <div class="token-dir-arrow left" id="tokenDirLeft">◀</div>
    <div class="token-dir-arrow right" id="tokenDirRight">▶</div>
  `;
  DOM.board.appendChild(tokenEl);
}

export function cellMetrics() {
  const firstCell = cellEls[0]?.[0];
  if (!firstCell) return { step: 0, cellSize: 0 };
  const rect = firstCell.getBoundingClientRect();
  const step = rect.width + 6; // gap
  return { step, cellSize: rect.width };
}

export function placeToken(playerPos, instant = false) {
  if (!tokenEl || !playerPos) return;
  const { step, cellSize } = cellMetrics();
  const [r, c] = playerPos;
  const x = c * step;
  const y = r * step;

  if (instant) {
    tokenEl.style.transition = "none";
  } else {
    tokenEl.style.transition = "";
  }
  tokenEl.style.width = cellSize + "px";
  tokenEl.style.height = cellSize + "px";
  tokenEl.style.transform = `translate(${x}px, ${y}px)`;
  if (instant) {
    tokenEl.getBoundingClientRect();
    tokenEl.style.transition = "";
  }
}

export function updateGameHeader(levelIndex, level, moveCount, historyLength) {
  if (DOM.gameTitle) DOM.gameTitle.textContent = `Level ${String(levelIndex + 1).padStart(2, "0")}`;
  if (DOM.gameChapter) DOM.gameChapter.textContent = `${level.phase || ""} • ${level.name || ""}`;
  if (DOM.hudMoves) DOM.hudMoves.textContent = moveCount;
  if (DOM.undoBtn) DOM.undoBtn.disabled = historyLength === 0;
}

export function showToast(msg) {
  if (msg) DOM.toast.textContent = msg;
  DOM.toast.classList.remove("warning");
  DOM.toast.classList.add("show");
  if (deadEndToastTimeout) clearTimeout(deadEndToastTimeout);
  deadEndToastTimeout = setTimeout(() => {
    DOM.toast.classList.remove("show");
    DOM.toast.textContent = "No legal move that way";
  }, 900);
}

export function showDeadEndToast() {
  if (deadEndToastTimeout) clearTimeout(deadEndToastTimeout);
  DOM.toast.textContent = "Dead end — no legal moves. Use Undo or Restart.";
  DOM.toast.classList.add("warning", "show");
}

export function clearDeadEndFeedback() {
  if (deadEndToastTimeout) clearTimeout(deadEndToastTimeout);
  if (DOM.toast.classList.contains("warning")) {
    DOM.toast.classList.remove("show", "warning");
    DOM.toast.textContent = "No legal move that way";
  }
  if (DOM.undoBtn) DOM.undoBtn.classList.remove("attention-pulse");
  if (DOM.restartBtn) DOM.restartBtn.classList.remove("attention-pulse");
}

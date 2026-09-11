/**
 * Main Application Orchestrator
 */

import "./styles/main.css";
import { LEVELS } from "./data/levels.js";
import { solve, validateAll } from "./core/solver.js";
import { calculateLegalDestinations, isGoalCell, isDeadEndState } from "./core/rules.js";
import { GameState } from "./state/game-state.js";
import { SceneRouter } from "./scenes/scene-router.js";
import { PlatformBridge } from "./platform/lifecycle.js";
import { TargetConfig } from "./platform/target-config.js";
import { EditorController } from "./editor/editor-controller.js";
import { DailyManager } from "./state/daily-manager.js";
import { formatDisplayDate } from "./core/daily-seed.js";
import {
  DOM,
  renderHomeHub,
  renderDailyChallengeCard,
  renderBoard,
  flushLevelCreationAnimation,
  placeToken,
  setArrowsMoving,
  updateGameHeader,
  getCellElements,
  showToast,
  hideToast,
  clearDeadEndFeedback,
  renderLivesHUD,
  renderTrail,
  refreshTrail,
  updateTrailButton,
  renderViability,
  renderWinModal,
  renderFinalModal,
  applyTheme
} from "./scenes/game-renderer.js";
import { setupInputRouter } from "./scenes/input-router.js";

// Validate all shipped levels on load
validateAll(LEVELS);

let autoUndoTimer = null;

function clearAutoUndo() {
  if (autoUndoTimer) {
    clearTimeout(autoUndoTimer);
    autoUndoTimer = null;
  }
}

export function openHome() {
  clearAutoUndo();
  hideToast();
  if (SceneRouter.getCurrentScreen() === "screenGame") {
    GameState.saveCurrentSession();
  }
  GameState.customLevel = null;
  renderHomeHub(LEVELS, GameState.levelIndex, GameState.completed, (idx) => {
    startLevel(idx);
  }, GameState.activeSession);

  // Render Daily Challenge Card status
  const dailyLv = DailyManager.getTodayLevel();
  renderDailyChallengeCard({
    isCompleted: DailyManager.isTodayCompleted(),
    streak: DailyManager.data.currentStreak,
    dateKey: dailyLv.dateKey,
    displayDate: formatDisplayDate(dailyLv.dateKey),
    timeRemaining: DailyManager.getTimeUntilNextReset()
  });

  SceneRouter.navigateTo("screenHome");
}

export function startDailyLevel() {
  // Offline verification gate requested by user
  if (!DailyManager.isOnline()) {
    showToast("⚠️ You need to be online to play the Daily Challenge!");
    PlatformBridge.vibrateWarning?.();
    return;
  }

  clearAutoUndo();
  hideToast();
  devStopAutoPlay();

  const dailyLv = DailyManager.getTodayLevel();
  GameState.customLevel = dailyLv;
  GameState.player = [dailyLv.start[0], dailyLv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.resetLives();

  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  renderBoard(dailyLv, (r, c) => attemptMoveTo(r, c));
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(888, dailyLv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  if (DOM.gameTitle) DOM.gameTitle.textContent = "DAILY";
  if (DOM.gameChapter) DOM.gameChapter.textContent = `${formatDisplayDate(dailyLv.dateKey)} • ${dailyLv.name}`;
  tick();
}

export function startLevel(i) {
  clearAutoUndo();
  hideToast();
  devStopAutoPlay();
  GameState.customLevel = null;
  GameState.levelIndex = i;
  GameState.clearSession();
  GameState.save();

  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.resetLives();

  if (DOM.hintBtn) {
    DOM.hintBtn.classList.remove("active");
  }
  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  clearSolutionPath();
  renderBoard(lv, (r, c) => attemptMoveTo(r, c));
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  tick();
}

export function resumeLevelSession() {
  clearAutoUndo();
  const session = GameState.activeSession;
  if (!session || typeof session.levelIndex !== "number") {
    return startLevel(GameState.getNextUncompletedLevelIndex());
  }

  devStopAutoPlay();
  GameState.customLevel = null;
  GameState.levelIndex = session.levelIndex;
  GameState.player = [session.player[0], session.player[1]];
  GameState.moveCount = session.moveCount;
  GameState.history = Array.isArray(session.history) ? JSON.parse(JSON.stringify(session.history)) : [];
  GameState.lives = typeof session.lives === "number" ? session.lives : GameState.maxLives;
  GameState.solutionPathVisible = false;

  const lv = GameState.currentLevel();
  clearDeadEndFeedback();
  renderBoard(lv, (r, c) => attemptMoveTo(r, c));

  // Mark all visited cells on board
  const cellEls = getCellElements();
  if (cellEls && cellEls.length) {
    if (cellEls[lv.start[0]]?.[lv.start[1]]) {
      cellEls[lv.start[0]][lv.start[1]].classList.add("visited");
    }
    GameState.history.forEach(h => {
      if (h.player && cellEls[h.player[0]]?.[h.player[1]]) {
        cellEls[h.player[0]][h.player[1]].classList.add("visited");
      }
    });
  }

  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  refreshTrail();
  tick();
}

export function playtestCustomLevel(customLv) {
  clearAutoUndo();
  devStopAutoPlay();
  GameState.customLevel = customLv;
  GameState.player = [customLv.start[0], customLv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.resetLives();

  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  renderBoard(customLv, (r, c) => attemptMoveTo(r, c));
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(999, customLv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  if (DOM.gameTitle) DOM.gameTitle.textContent = "PLAYTEST";
  if (DOM.gameChapter) DOM.gameChapter.textContent = `${customLv.phase || "Custom"} • ${customLv.name || "Maze"}`;
  tick();
}

export function tick() {
  const lv = GameState.currentLevel();
  const cellEls = getCellElements();
  if (!GameState.player || !cellEls.length) return;

  for (let r = 0; r < lv.h; r++) {
    for (let c = 0; c < lv.w; c++) {
      if (cellEls[r]?.[c]) {
        cellEls[r][c].classList.remove("legal-dest", "current-cell", "pulse");
      }
    }
  }

  const [pr, pc] = GameState.player;
  if (cellEls[pr]?.[pc]) {
    cellEls[pr][pc].classList.add("current-cell");
  }
  const isGoal = isGoalCell(lv, GameState.player);
  if (DOM.hudCurrent) DOM.hudCurrent.textContent = isGoal ? "GOAL" : lv.grid[pr][pc];

  // Calculate legal moves once
  const dests = calculateLegalDestinations(lv, GameState.player);
  GameState.legalDests = dests;

  dests.forEach(d => {
    if (cellEls[d.r]?.[d.c]) {
      cellEls[d.r][d.c].classList.add("legal-dest", "pulse");
    }
  });

  // Dead-end check (silenced during active gameplay unless hint is active)
  const isDeadEnd = isDeadEndState(dests, isGoal);
  if (isDeadEnd && GameState.solutionPathVisible) {
    if (cellEls[pr]?.[pc]) cellEls[pr][pc].classList.add("dead-end");
  } else {
    if (cellEls[pr]?.[pc]) cellEls[pr][pc].classList.remove("dead-end");
    clearDeadEndFeedback();
  }

  // Viability and Breadcrumb Trail feedback
  const viability = solve(lv, GameState.player);
  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
  renderTrail(visitedPath, viability.solvable, GameState.settings.showTrail, GameState.solutionPathVisible);
  updateTrailButton(GameState.settings.showTrail);
  renderViability(viability, isGoal, isDeadEnd, GameState.player, GameState.solutionPathVisible);

  // Token directional arrows
  const hasUp = dests.some(d => d.dir === "up");
  const hasDown = dests.some(d => d.dir === "down");
  const hasLeft = dests.some(d => d.dir === "left");
  const hasRight = dests.some(d => d.dir === "right");

  const arrowUp = document.getElementById("tokenDirUp");
  const arrowDown = document.getElementById("tokenDirDown");
  const arrowLeft = document.getElementById("tokenDirLeft");
  const arrowRight = document.getElementById("tokenDirRight");

  if (arrowUp) arrowUp.classList.toggle("disabled", !hasUp);
  if (arrowDown) arrowDown.classList.toggle("disabled", !hasDown);
  if (arrowLeft) arrowLeft.classList.toggle("disabled", !hasLeft);
  if (arrowRight) arrowRight.classList.toggle("disabled", !hasRight);

  // Solution path / hint update if active
  if (GameState.solutionPathVisible) {
    highlightSolutionPath();
  }

  // Dev HUD update passing pre-computed dests
  if (GameState.devModeEnabled) {
    updateDevHud(dests);
  }

  // Dev Playtest Stepper Bar update
  const isDevOrPlaytest = TargetConfig.features.gameDevControls && (Boolean(GameState.customLevel) || Boolean(GameState.devModeEnabled));
  if (DOM.devPlaytestBar) {
    DOM.devPlaytestBar.style.display = isDevOrPlaytest ? "flex" : "none";
    if (isDevOrPlaytest) {
      if (DOM.devStepInfo) {
        DOM.devStepInfo.textContent = `Move ${GameState.moveCount} | ${viability.solvable ? `${viability.moves} to goal` : "Trap"}`;
      }
      if (DOM.devStepBackBtn) DOM.devStepBackBtn.disabled = GameState.history.length === 0;
      if (DOM.devStepForwardBtn) DOM.devStepForwardBtn.disabled = !viability.solvable || viability.moves === 0;
      if (DOM.devAutoPlayBtn) DOM.devAutoPlayBtn.disabled = !viability.solvable || viability.moves === 0;
    }
  }
}

export function attemptMoveTo(r, c) {
  flushLevelCreationAnimation();
  if (GameState.animating || SceneRouter.isInputBlocked()) return;
  const match = GameState.legalDests.find(d => d.r === r && d.c === c);
  if (!match) return;
  doMove(r, c);
}

export function doMove(r, c) {
  if (GameState.animating || SceneRouter.isInputBlocked()) return;

  GameState.history.push({
    player: [...GameState.player],
    moveCount: GameState.moveCount
  });
  GameState.player = [r, c];
  GameState.moveCount++;
  GameState.animating = true;

  // Clear previous compass hint highlight immediately when move starts
  if (GameState.solutionPathVisible) {
    clearSolutionPath();
  }

  // 1. Hide arrows immediately & activate smooth traveling reticle
  setArrowsMoving(true);

  // 2. Smoothly glide the player reticle to destination
  placeToken(GameState.player, false);

  const lv = GameState.currentLevel();
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  PlatformBridge.vibrateLight();

  // 3. Draw breadcrumb trail along with the glide
  const viability = solve(lv, GameState.player);
  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
  renderTrail(visitedPath, viability.solvable, GameState.settings.showTrail, GameState.solutionPathVisible);

  // 4. Upon arrival at 190ms:
  setTimeout(() => {
    GameState.animating = false;
    setArrowsMoving(false);
    tick();

    const cellEls = getCellElements();
    if (cellEls[r]?.[c]) {
      cellEls[r][c].classList.add("landed");
      setTimeout(() => cellEls[r]?.[c]?.classList.remove("landed"), 160);
    }

    const isGoal = isGoalCell(lv, GameState.player);
    const isDeadEnd = isDeadEndState(GameState.legalDests, isGoal);

    if (isDeadEnd) {
      GameState.loseLife();
      renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
      PlatformBridge.vibrateWarning();

      if (cellEls[r]?.[c]) {
        cellEls[r][c].classList.add("dead-end-hit");
        setTimeout(() => cellEls[r]?.[c]?.classList.remove("dead-end-hit"), 850);
      }

      clearAutoUndo();

      const outOfLives = GameState.lives <= 0 && !GameState.settings.relaxMode;

      if (outOfLives) {
        // Auto-undo the dead end step first so player returns to previous tile, then present Out of Lives modal
        autoUndoTimer = setTimeout(() => {
          undo();
          autoUndoTimer = setTimeout(() => {
            SceneRouter.pushModal("OUT_OF_LIVES");
            autoUndoTimer = null;
          }, 280);
        }, 800);
        return;
      }

      // Automatically undo the dead-end step after a well-paced pause so player clearly perceives the consequence
      autoUndoTimer = setTimeout(() => {
        undo();
        autoUndoTimer = null;
      }, 800);
      return;
    }

    checkWin();
  }, 190);
}

export function checkWin() {
  const lv = GameState.currentLevel();
  if (isGoalCell(lv, GameState.player)) {
    PlatformBridge.vibrateSuccess();
    showWin();
  }
}

export function undo() {
  clearAutoUndo();
  if (!GameState.history.length || GameState.animating || SceneRouter.isInputBlocked()) return;
  const prev = GameState.history.pop();
  GameState.player = prev.player;
  GameState.moveCount = prev.moveCount;
  // Note: Lost hearts are not restored on undo to preserve gameplay stakes
  clearDeadEndFeedback();
  if (GameState.solutionPathVisible) {
    clearSolutionPath();
  }
  GameState.animating = true;
  setArrowsMoving(true);
  placeToken(GameState.player, false);
  const lv = GameState.currentLevel();
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);

  const viability = solve(lv, GameState.player);
  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
  renderTrail(visitedPath, viability.solvable, GameState.settings.showTrail, GameState.solutionPathVisible);

  setTimeout(() => {
    GameState.animating = false;
    setArrowsMoving(false);
    tick();
    const [pr, pc] = GameState.player;
    const cellEls = getCellElements();
    if (cellEls[pr]?.[pc]) {
      cellEls[pr][pc].classList.add("landed");
      setTimeout(() => cellEls[pr]?.[pc]?.classList.remove("landed"), 160);
    }
  }, 190);
}

export function restart() {
  clearAutoUndo();
  hideToast();
  flushLevelCreationAnimation();
  devStopAutoPlay();
  if (GameState.animating) return;
  GameState.clearSession();
  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.resetLives();
  GameState.solutionPathVisible = false;
  if (DOM.hintBtn) DOM.hintBtn.classList.remove("active");
  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }
  clearSolutionPath();
  clearDeadEndFeedback();
  setArrowsMoving(false);
  placeToken(GameState.player, true);
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  tick();
}

export function showWin() {
  devStopAutoPlay();
  const lv = GameState.currentLevel();
  const isDaily = Boolean(lv?.isDaily);
  const isCustom = Boolean(GameState.customLevel) && !isDaily;
  const isLast = (GameState.levelIndex >= LEVELS.length - 1);

  let dailyResult = null;
  if (isDaily) {
    dailyResult = DailyManager.recordCompletion(GameState.moveCount, lv.optimal);
  }

  const { isNewBest } = (isCustom || isDaily)
    ? { isNewBest: false }
    : GameState.recordLevelResult(GameState.levelIndex, GameState.moveCount);

  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);

  renderWinModal({
    levelIndex: GameState.levelIndex,
    level: lv,
    moveCount: GameState.moveCount,
    optimal: lv.optimal,
    path: visitedPath,
    isNewBest,
    bestMoves: (isCustom || isDaily) ? GameState.moveCount : (GameState.bestMoves[GameState.levelIndex] || GameState.moveCount),
    lives: GameState.lives,
    maxLives: GameState.maxLives,
    isRelaxMode: GameState.settings.relaxMode,
    isCustomLevel: isCustom,
    isLastLevel: isLast,
    isDailyLevel: isDaily,
    dailyStreak: dailyResult ? dailyResult.streak : DailyManager.data.currentStreak,
    devDiagnosticsEnabled: (GameState.devModeEnabled && TargetConfig.features.devDiagnostics)
  });

  PlatformBridge.vibrateSuccess();
  SceneRouter.pushModal("WIN");
}

export function showPause() {
  if (DOM.pauseLevel) DOM.pauseLevel.textContent = GameState.customLevel ? (GameState.customLevel.isDaily ? "DAILY" : "TEST") : String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0");
  if (DOM.pauseMoves) DOM.pauseMoves.textContent = GameState.moveCount;
  SceneRouter.pushModal("PAUSE");
}

export function nextLevel() {
  SceneRouter.popModal();
  if (GameState.customLevel?.isDaily) {
    openHome();
    return;
  }
  if (GameState.customLevel) {
    SceneRouter.navigateTo("screenEditor");
    return;
  }
  if (GameState.levelIndex >= LEVELS.length - 1) {
    const totalSolved = GameState.completed.filter(Boolean).length;
    renderFinalModal({
      totalSolved,
      totalLevels: LEVELS.length
    });
    SceneRouter.pushModal("FINAL");
    return;
  }
  startLevel(GameState.levelIndex + 1);
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// Developer HUD tools
export function toggleDevMode() {
  if (SceneRouter.isModalOpen("DEV")) {
    SceneRouter.popModal();
  } else {
    tick();
    SceneRouter.pushModal("DEV");
  }
}

export function toggleSolutionPath() {
  // If already active, toggle OFF
  if (GameState.solutionPathVisible) {
    GameState.solutionPathVisible = false;
    if (DOM.hintBtn) DOM.hintBtn.classList.remove("active");
    if (DOM.devShowSolutionBtn) {
      DOM.devShowSolutionBtn.classList.remove("active");
      DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
    }
    clearSolutionPath();
    clearDeadEndFeedback();
    const lv = GameState.currentLevel();
    const isGoal = isGoalCell(lv, GameState.player);
    const dests = calculateLegalDestinations(lv, GameState.player);
    const isDeadEnd = isDeadEndState(dests, isGoal);
    const viability = solve(lv, GameState.player);
    renderViability(viability, isGoal, isDeadEnd, GameState.player, false);
    const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
    renderTrail(visitedPath, viability.solvable, GameState.settings.showTrail, false);
    return;
  }

  const lv = GameState.currentLevel();
  const isGoal = isGoalCell(lv, GameState.player);
  if (isGoal) {
    showToast("Already at the goal!");
    return;
  }

  const res = solve(lv, GameState.player);
  const isTrapped = !res || !res.solvable || !res.path || res.path.length < 2;

  if (isTrapped) {
    // 1. Calculate how many steps back the player diverged from a viable solution path
    let backtrackCount = 0;
    for (let i = GameState.history.length - 1; i >= 0; i--) {
      const pastSol = solve(lv, GameState.history[i].player);
      if (pastSol && pastSol.solvable) {
        backtrackCount = GameState.history.length - i;
        break;
      }
    }

    const msg = backtrackCount > 0
      ? `Trapped! Undo ${backtrackCount === 1 ? "1 move" : `${backtrackCount} moves`} to get back on track`
      : "No path to goal from here — use Restart";

    showToast(msg, 2000);
    PlatformBridge.vibrateLight();

    // 2. Shake Hint button to signal no forward path from this tile
    if (DOM.hintBtn) {
      DOM.hintBtn.classList.remove("shake-subtle");
      void DOM.hintBtn.offsetWidth;
      DOM.hintBtn.classList.add("shake-subtle");
      setTimeout(() => DOM.hintBtn?.classList.remove("shake-subtle"), 450);
    }

    // 3. Highlight the corrective action: pulse Undo (or Restart)
    if (backtrackCount > 0 && DOM.undoBtn) {
      DOM.undoBtn.classList.add("attention-pulse");
      setTimeout(() => DOM.undoBtn?.classList.remove("attention-pulse"), 2500);
    } else if (DOM.restartBtn) {
      DOM.restartBtn.classList.add("attention-pulse");
      setTimeout(() => DOM.restartBtn?.classList.remove("attention-pulse"), 2500);
    }

    // 4. Arm Hint state so as soon as player Undoes back to a viable cell, the compass hint automatically illuminates!
    GameState.solutionPathVisible = true;
    if (DOM.hintBtn) DOM.hintBtn.classList.add("active");
    if (DOM.devShowSolutionBtn) {
      DOM.devShowSolutionBtn.classList.add("active");
      DOM.devShowSolutionBtn.textContent = "HIDE SOLUTION";
    }
    const dests = calculateLegalDestinations(lv, GameState.player);
    const isDeadEnd = isDeadEndState(dests, isGoal);
    renderViability(res, isGoal, isDeadEnd, GameState.player, true);
    const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
    renderTrail(visitedPath, res ? res.solvable : false, GameState.settings.showTrail, true);
    return;
  }

  // Viable state: activate hint and illuminate single-step compass target
  GameState.solutionPathVisible = true;
  if (DOM.hintBtn) DOM.hintBtn.classList.add("active");
  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.add("active");
    DOM.devShowSolutionBtn.textContent = "HIDE SOLUTION";
  }
  highlightSolutionPath();
  const dests = calculateLegalDestinations(lv, GameState.player);
  const isDeadEnd = isDeadEndState(dests, isGoal);
  renderViability(res, isGoal, isDeadEnd, GameState.player, true);
  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
  renderTrail(visitedPath, res.solvable, GameState.settings.showTrail, true);
}

function clearSolutionPath() {
  const lv = GameState.currentLevel();
  const cellEls = getCellElements();
  if (!cellEls || !cellEls.length) return;
  for (let r = 0; r < lv.h; r++) {
    for (let c = 0; c < lv.w; c++) {
      const cell = cellEls[r]?.[c];
      if (cell) {
        cell.classList.remove("hint-compass", "hint-target", "path-cell", "path-next");
        delete cell.dataset.step;
      }
    }
  }
}

function highlightSolutionPath() {
  clearSolutionPath();
  const lv = GameState.currentLevel();
  const cellEls = getCellElements();
  if (!cellEls || !cellEls.length) return;
  const res = solve(lv, GameState.player);
  if (!res || !res.solvable || !res.path || res.path.length < 2) return;

  // Single-step Compass Hint:
  // Only highlight the immediate next optimal leap with a pulsing ring, hiding future steps
  const [nextR, nextC] = res.path[1];
  const targetEl = cellEls[nextR]?.[nextC];
  if (targetEl) {
    targetEl.classList.add("hint-compass", "hint-target");
  }
}

function updateDevHud(dests = GameState.legalDests) {
  if (!GameState.devModeEnabled || !GameState.player) return;
  const lv = GameState.currentLevel();
  const [r, c] = GameState.player;
  const val = lv.grid[r][c];

  if (DOM.devLevelVal) DOM.devLevelVal.textContent = String(GameState.levelIndex + 1).padStart(2, "0");
  if (DOM.devCellVal) DOM.devCellVal.textContent = `[${r}, ${c}]`;
  if (DOM.devValueVal) DOM.devValueVal.textContent = val;
  if (DOM.devOptimalVal) DOM.devOptimalVal.textContent = (lv.optimal !== undefined ? `${lv.optimal} moves` : "--");

  const hasUp = dests.some(d => d.dir === "up");
  const hasDown = dests.some(d => d.dir === "down");
  const hasLeft = dests.some(d => d.dir === "left");
  const hasRight = dests.some(d => d.dir === "right");

  if (DOM.devDirUp) DOM.devDirUp.className = `dev-dir-badge ${hasUp ? "valid" : "invalid"}`;
  if (DOM.devDirDown) DOM.devDirDown.className = `dev-dir-badge ${hasDown ? "valid" : "invalid"}`;
  if (DOM.devDirLeft) DOM.devDirLeft.className = `dev-dir-badge ${hasLeft ? "valid" : "invalid"}`;
  if (DOM.devDirRight) DOM.devDirRight.className = `dev-dir-badge ${hasRight ? "valid" : "invalid"}`;

  const opt = lv.optimal || 1;
  const currentEff = GameState.moveCount > 0 ? Math.round((opt / GameState.moveCount) * 100) : 100;
  if (DOM.devEfficiencyVal) {
    DOM.devEfficiencyVal.textContent = `${GameState.moveCount} moves (${currentEff}%)`;
  }
}

// Dev-only Auto-Play & Stepping Controls
let devAutoPlayTimer = null;

export function devStepForward() {
  if (GameState.animating || SceneRouter.isInputBlocked()) return;
  const lv = GameState.currentLevel();
  const sol = solve(lv, GameState.player);
  if (!sol.solvable || sol.path.length < 2) {
    devStopAutoPlay();
    return;
  }
  const [nextR, nextC] = sol.path[1];
  doMove(nextR, nextC);
}

export function devStepBackward() {
  devStopAutoPlay();
  undo();
}

export function devToggleAutoPlay() {
  if (devAutoPlayTimer) {
    devStopAutoPlay();
  } else {
    devStartAutoPlay();
  }
}

export function devStartAutoPlay() {
  if (devAutoPlayTimer) return;
  const lv = GameState.currentLevel();
  if (isGoalCell(lv, GameState.player)) {
    restart();
  }
  if (DOM.devAutoPlayBtn) {
    DOM.devAutoPlayBtn.textContent = "❚❚ PAUSE";
    DOM.devAutoPlayBtn.classList.add("playing");
  }

  devStepForward();

  devAutoPlayTimer = setInterval(() => {
    const currentLv = GameState.currentLevel();
    if (isGoalCell(currentLv, GameState.player) || GameState.lives <= 0) {
      devStopAutoPlay();
    } else {
      devStepForward();
    }
  }, 420);
}

export function devStopAutoPlay() {
  if (devAutoPlayTimer) {
    clearInterval(devAutoPlayTimer);
    devAutoPlayTimer = null;
  }
  if (DOM.devAutoPlayBtn) {
    DOM.devAutoPlayBtn.textContent = "▶ AUTO";
    DOM.devAutoPlayBtn.classList.remove("playing");
  }
}

export function devStepReset() {
  devStopAutoPlay();
  restart();
}

export function handleResize() {
  if (SceneRouter.getCurrentScreen() === "screenGame") {
    const lv = GameState.currentLevel();
    if (lv && DOM.board) {
      const maxDim = Math.max(lv.w, lv.h);
      const boardMax = maxDim >= 7 ? 405 : (maxDim >= 5 ? 385 : 360);
      const size = Math.min(boardMax, window.innerWidth - (window.innerWidth < 420 ? 24 : 44));
      DOM.board.style.width = size + "px";
      placeToken(GameState.player, true);
      refreshTrail();
    }
  }
}

export function handleToggleTheme(targetTheme) {
  let nextTheme;
  if (targetTheme) {
    nextTheme = targetTheme;
    GameState.setTheme(nextTheme);
  } else {
    nextTheme = GameState.toggleTheme();
  }
  applyTheme(nextTheme);
  refreshTrail(GameState.settings.showTrail);
  PlatformBridge.vibrateLight();
  showToast(`Theme: ${nextTheme === "vellum" ? "☀️ Vellum & Deboss" : "🌙 Obsidian & Ochre"}`);
}

export function handleToggleTrail(explicitValue) {
  const isNowOn = GameState.toggleTrail(explicitValue);
  const lv = GameState.currentLevel();
  if (lv && GameState.player) {
    const viability = solve(lv, GameState.player);
    const visitedPath = GameState.history.map(h => h.player).concat([GameState.player]);
    renderTrail(visitedPath, viability.solvable, isNowOn, GameState.solutionPathVisible);
  }
  updateTrailButton(isNowOn);
  PlatformBridge.vibrateLight();
  showToast(isNowOn ? "Breadcrumbs Trail ON" : "Breadcrumbs Trail OFF");
}

// App Boot Sequence
export function bootApp() {
  GameState.init();
  applyTheme(GameState.getTheme());
  updateTrailButton(GameState.settings.showTrail);

  // Theme & Trail toggle bindings
  if (DOM.trailToggleBtn) DOM.trailToggleBtn.addEventListener("click", () => handleToggleTrail());
  if (DOM.homeThemeToggleBtn) DOM.homeThemeToggleBtn.addEventListener("click", () => handleToggleTheme());
  if (DOM.gameThemeToggleBtn) DOM.gameThemeToggleBtn.addEventListener("click", () => handleToggleTheme());
  if (DOM.devThemeToggleBtn) DOM.devThemeToggleBtn.addEventListener("click", () => handleToggleTheme());
  if (DOM.pillThemeObsidian) DOM.pillThemeObsidian.addEventListener("click", () => handleToggleTheme("obsidian"));
  if (DOM.pillThemeVellum) DOM.pillThemeVellum.addEventListener("click", () => handleToggleTheme("vellum"));

  // Home Hub bindings
  const launchHeroLevel = () => {
    if (GameState.hasActiveSessionFor(GameState.levelIndex)) {
      resumeLevelSession();
    } else {
      startLevel(GameState.levelIndex);
    }
  };
  if (DOM.heroPlayBtn) DOM.heroPlayBtn.addEventListener("click", launchHeroLevel);
  if (DOM.heroBanner) DOM.heroBanner.addEventListener("click", (e) => {
    if (e.target !== DOM.heroPlayBtn) launchHeroLevel();
  });
  if (DOM.homeHelpBtn) DOM.homeHelpBtn.addEventListener("click", () => SceneRouter.pushModal("RULES"));
  if (DOM.homeSettingsBtn) DOM.homeSettingsBtn.addEventListener("click", () => SceneRouter.pushModal("SETTINGS"));

  // Initialize Daily Manager
  DailyManager.init();

  // Daily Challenge Card Launch Action
  if (DOM.dailyPlayBtn) DOM.dailyPlayBtn.addEventListener("click", () => startDailyLevel());
  if (DOM.dailyChallengeCard) {
    DOM.dailyChallengeCard.addEventListener("click", (e) => {
      if (!DOM.dailyPlayBtn?.contains(e.target)) {
        startDailyLevel();
      }
    });
  }

  // Consumer Next Level Launch Action (Resumes if in progress, else starts fresh)
  const launchConsumerNext = () => {
    const nextIdx = GameState.getNextUncompletedLevelIndex();
    if (GameState.hasActiveSessionFor(nextIdx)) {
      resumeLevelSession();
    } else {
      startLevel(nextIdx);
    }
  };
  if (DOM.consumerPlayBtn) DOM.consumerPlayBtn.addEventListener("click", launchConsumerNext);
  if (DOM.consumerLaunchSection) {
    DOM.consumerLaunchSection.addEventListener("click", (e) => {
      if (!DOM.consumerPlayBtn?.contains(e.target)) {
        launchConsumerNext();
      }
    });
  }

  // In-Game navigation
  if (DOM.gameBackBtn) DOM.gameBackBtn.addEventListener("click", () => openHome());
  if (DOM.gamePauseBtn) DOM.gamePauseBtn.addEventListener("click", showPause);

  // In-Game Bottom tools
  if (DOM.undoBtn) DOM.undoBtn.addEventListener("click", undo);
  if (DOM.hintBtn) DOM.hintBtn.addEventListener("click", toggleSolutionPath);
  if (DOM.restartBtn) DOM.restartBtn.addEventListener("click", restart);

  // Modals
  if (DOM.resumeBtn) DOM.resumeBtn.addEventListener("click", () => SceneRouter.popModal());
  if (DOM.pauseRestartBtn) {
    DOM.pauseRestartBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      restart();
    });
  }
  if (DOM.pauseHomeBtn) {
    DOM.pauseHomeBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      if (GameState.customLevel) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        openHome();
      }
    });
  }

  if (DOM.winRestartBtn) {
    DOM.winRestartBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      restart();
    });
  }
  if (DOM.winNextBtn) DOM.winNextBtn.addEventListener("click", nextLevel);
  if (DOM.winHomeBtn) {
    DOM.winHomeBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      openHome();
    });
  }

  if (DOM.outOfLivesWatchAdBtn) {
    DOM.outOfLivesWatchAdBtn.addEventListener("click", () => {
      // 1. Grant 1 life
      GameState.addLife(1);
      renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);

      // 2. Dismiss modal
      SceneRouter.popModal();

      // 3. Safety check: if player is still on a dead-end cell, auto-undo back to safety
      const lv = GameState.currentLevel();
      const isGoal = isGoalCell(lv, GameState.player);
      const isDeadEnd = isDeadEndState(GameState.legalDests, isGoal);
      if (isDeadEnd && GameState.history.length > 0) {
        undo();
      }

      // 4. Tactile and visual feedback
      PlatformBridge.vibrateSuccess();
      showToast("+1 Life added! Keep going", 1800);
    });
  }

  if (DOM.outOfLivesRestartBtn) {
    DOM.outOfLivesRestartBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      restart();
    });
  }

  // Settings Bindings
  if (DOM.settingSound) {
    DOM.settingSound.checked = GameState.settings.soundEnabled !== false;
    DOM.settingSound.addEventListener("change", (e) => {
      GameState.settings.soundEnabled = e.target.checked;
      GameState.save();
    });
  }
  if (DOM.settingHaptics) {
    DOM.settingHaptics.checked = GameState.settings.hapticsEnabled !== false;
    DOM.settingHaptics.addEventListener("change", (e) => {
      GameState.settings.hapticsEnabled = e.target.checked;
      GameState.save();
    });
  }
  if (DOM.settingRelaxMode) {
    DOM.settingRelaxMode.checked = Boolean(GameState.settings.relaxMode);
    DOM.settingRelaxMode.addEventListener("change", (e) => {
      GameState.settings.relaxMode = e.target.checked;
      GameState.save();
      renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
    });
  }
  if (DOM.settingTrail) {
    DOM.settingTrail.checked = Boolean(GameState.settings.showTrail);
    DOM.settingTrail.addEventListener("change", (e) => {
      handleToggleTrail(e.target.checked);
    });
  }
  if (DOM.settingDevMode) {
    DOM.settingDevMode.checked = Boolean(GameState.devModeEnabled);
    DOM.settingDevMode.addEventListener("change", (e) => {
      GameState.devModeEnabled = e.target.checked;
      GameState.settings.devModeEnabled = e.target.checked;
      GameState.save();
      if (DOM.devToggleBtn && TargetConfig.features.devDiagnostics) {
        DOM.devToggleBtn.classList.toggle("active", GameState.devModeEnabled);
      }
    });
  }

  if (DOM.closeRulesBtn) DOM.closeRulesBtn.addEventListener("click", () => SceneRouter.popModal());
  if (DOM.closeSettingsBtn) DOM.closeSettingsBtn.addEventListener("click", () => SceneRouter.popModal());
  if (DOM.closeDevBtn) DOM.closeDevBtn.addEventListener("click", () => SceneRouter.popModal());
  if (DOM.finalRestartBtn) {
    DOM.finalRestartBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      startLevel(0);
    });
  }
  if (DOM.finalHomeBtn) {
    DOM.finalHomeBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      openHome();
    });
  }

  // Target-specific UI Features Configuration
  document.body.dataset.targetMode = TargetConfig.mode;

  const modePill = document.getElementById("targetModePill");
  if (modePill) {
    modePill.textContent = `MODE: ${TargetConfig.mode.toUpperCase()}`;
    modePill.style.display = TargetConfig.features.homeDevControls ? "inline-block" : "none";
  }
  if (DOM.homeSettingsBtn) {
    DOM.homeSettingsBtn.style.display = TargetConfig.features.homeDevControls ? "inline-flex" : "none";
  }
  if (DOM.homeThemeToggleBtn) {
    DOM.homeThemeToggleBtn.style.display = TargetConfig.features.homeDevControls ? "inline-flex" : "none";
  }
  if (DOM.devToggleBtn) {
    DOM.devToggleBtn.style.display = TargetConfig.features.devDiagnostics ? "block" : "none";
  }
  if (DOM.trailToggleBtn) {
    DOM.trailToggleBtn.style.display = TargetConfig.features.gameDevControls ? "inline-flex" : "none";
  }
  if (DOM.gameThemeToggleBtn) {
    DOM.gameThemeToggleBtn.style.display = TargetConfig.features.gameDevControls ? "inline-flex" : "none";
  }
  if (DOM.gamePauseBtn) {
    DOM.gamePauseBtn.style.display = TargetConfig.features.gameDevControls ? "inline-flex" : "none";
  }
  if (DOM.devPlaytestBar) {
    DOM.devPlaytestBar.style.display = TargetConfig.features.gameDevControls ? "flex" : "none";
  }
  if (DOM.editorHubCard) {
    DOM.editorHubCard.style.display = TargetConfig.features.levelEditor ? "flex" : "none";
  }
  if (DOM.openEditorBtn && TargetConfig.features.levelEditor) {
    DOM.openEditorBtn.addEventListener("click", () => SceneRouter.navigateTo("screenEditor"));
    EditorController.init({
      onPlaytest: (customLv) => playtestCustomLevel(customLv)
    });
  }
  if (DOM.gameFullscreenBtn) {
    DOM.gameFullscreenBtn.style.display = TargetConfig.features.fullscreenControl ? "flex" : "none";
    DOM.gameFullscreenBtn.addEventListener("click", toggleFullscreen);
  }
  if (DOM.desktopKeyLegend) {
    DOM.desktopKeyLegend.style.display = TargetConfig.features.keyboardHints ? "flex" : "none";
  }

  if (DOM.devToggleBtn) DOM.devToggleBtn.addEventListener("click", toggleDevMode);
  if (DOM.devShowSolutionBtn) DOM.devShowSolutionBtn.addEventListener("click", toggleSolutionPath);

  // In-Game Dev Playtest Stepper buttons
  if (DOM.devStepBackBtn) DOM.devStepBackBtn.addEventListener("click", devStepBackward);
  if (DOM.devAutoPlayBtn) DOM.devAutoPlayBtn.addEventListener("click", devToggleAutoPlay);
  if (DOM.devStepForwardBtn) DOM.devStepForwardBtn.addEventListener("click", devStepForward);
  if (DOM.devStepResetBtn) DOM.devStepResetBtn.addEventListener("click", devStepReset);

  // Setup keyboard & touch router
  setupInputRouter({
    onMoveDirection: (dir) => {
      flushLevelCreationAnimation();
      if (GameState.animating) return;
      const match = GameState.legalDests.find(d => d.dir === dir);
      if (match) {
        doMove(match.r, match.c);
      } else {
        showToast();
      }
    },
    onUndo: undo,
    onRestart: restart,
    onStepForward: () => {
      if (SceneRouter.getCurrentScreen() === "screenEditor") {
        EditorController.stepForward();
      } else {
        devStepForward();
      }
    },
    onStepBackward: () => {
      if (SceneRouter.getCurrentScreen() === "screenEditor") {
        EditorController.stepBackward();
      } else {
        devStepBackward();
      }
    },
    onToggleAutoPlay: () => {
      if (SceneRouter.getCurrentScreen() === "screenEditor") {
        EditorController.toggleAutoPlay();
      } else {
        devToggleAutoPlay();
      }
    },
    onToggleTheme: () => handleToggleTheme(),
    onToggleTrail: () => handleToggleTrail(),
    onToggleDev: () => {
      if (TargetConfig.features.devDiagnostics) toggleDevMode();
    },
    onToggleSolution: toggleSolutionPath,
    onShowPause: showPause,
    onShowLevelSelect: () => {
      if (GameState.customLevel) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        openHome();
      }
    },
    onNextLevel: nextLevel,
    onCloseRules: () => SceneRouter.popModal(),
    boardElement: DOM.board,
    swipeContainer: DOM.screenGame
  });

  window.addEventListener("resize", handleResize);

  // Dev mode restore
  if (GameState.devModeEnabled && TargetConfig.features.devDiagnostics) {
    if (DOM.devToggleBtn) DOM.devToggleBtn.classList.add("active");
  }

  // Lifecycle coordination
  PlatformBridge.init({
    onPause: () => GameState.save(),
    onResume: () => {
      handleResize();
      if (GameState.animating) {
        GameState.animating = false;
        tick();
      }
    },
    onBackAction: () => {
      // 1. Dismiss open modal overlay
      const activeModal = SceneRouter.currentModal();
      if (activeModal) {
        if (activeModal.name === "OUT_OF_LIVES") {
          SceneRouter.popModal();
          restart();
          return true;
        }
        SceneRouter.popModal();
        return true;
      }
      // 2. If in custom level playtest, Back returns to Level Editor
      if (GameState.customLevel && SceneRouter.getCurrentScreen() === "screenGame") {
        SceneRouter.navigateTo("screenEditor");
        return true;
      }
      // 3. If in active gameplay, Back returns to Home Hub
      if (SceneRouter.getCurrentScreen() === "screenGame") {
        openHome();
        return true;
      }
      // 4. In Editor screen, Back returns to Home Hub
      if (SceneRouter.getCurrentScreen() === "screenEditor") {
        openHome();
        return true;
      }
      // 5. In Home Hub, let native Android minimize app
      return false;
    }
  });

  // Open Home Hub on boot
  openHome();
}

// Start application
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", bootApp);
}

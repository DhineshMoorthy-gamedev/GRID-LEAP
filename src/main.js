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
import {
  DOM,
  renderHomeHub,
  renderBoard,
  placeToken,
  updateGameHeader,
  getCellElements,
  showToast,
  showDeadEndToast,
  clearDeadEndFeedback,
  renderLivesHUD
} from "./scenes/game-renderer.js";
import { setupInputRouter } from "./scenes/input-router.js";

// Validate all shipped levels on load
validateAll(LEVELS);

export function openHome() {
  GameState.customLevel = null;
  renderHomeHub(LEVELS, GameState.levelIndex, GameState.completed, (idx) => {
    startLevel(idx);
  });
  SceneRouter.navigateTo("screenHome");
}

export function startLevel(i) {
  GameState.customLevel = null;
  GameState.levelIndex = i;
  GameState.save();

  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.resetLives();

  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  renderBoard(lv, (r, c) => attemptMoveTo(r, c));
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  tick();

  SceneRouter.navigateTo("screenGame");
}

export function playtestCustomLevel(customLv) {
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
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(999, customLv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  if (DOM.gameTitle) DOM.gameTitle.textContent = "PLAYTEST";
  if (DOM.gameChapter) DOM.gameChapter.textContent = `${customLv.phase || "Custom"} • ${customLv.name || "Maze"}`;
  tick();

  SceneRouter.navigateTo("screenGame");
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
  if (DOM.hudCurrent) DOM.hudCurrent.textContent = lv.grid[pr][pc];

  // Calculate legal moves once
  const dests = calculateLegalDestinations(lv, GameState.player);
  GameState.legalDests = dests;

  dests.forEach(d => {
    if (cellEls[d.r]?.[d.c]) {
      cellEls[d.r][d.c].classList.add("legal-dest", "pulse");
    }
  });

  // Dead-end check
  const isGoal = isGoalCell(lv, GameState.player);
  const isDeadEnd = isDeadEndState(dests, isGoal);
  if (isDeadEnd) {
    if (cellEls[pr]?.[pc]) cellEls[pr][pc].classList.add("dead-end");
    if (DOM.undoBtn) DOM.undoBtn.classList.add("attention-pulse");
    if (DOM.restartBtn) DOM.restartBtn.classList.add("attention-pulse");
    showDeadEndToast();
  } else {
    clearDeadEndFeedback();
  }

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

  // Dev HUD update passing pre-computed dests
  if (GameState.devModeEnabled) {
    updateDevHud(dests);
  }
}

export function attemptMoveTo(r, c) {
  if (GameState.animating || SceneRouter.isInputBlocked()) return;
  const match = GameState.legalDests.find(d => d.r === r && d.c === c);
  if (!match) return;
  doMove(r, c);
}

export function doMove(r, c) {
  GameState.history.push({
    player: [...GameState.player],
    moveCount: GameState.moveCount
  });
  GameState.player = [r, c];
  GameState.moveCount++;
  GameState.animating = true;
  placeToken(GameState.player, false);
  const lv = GameState.currentLevel();
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  PlatformBridge.vibrateLight();

  setTimeout(() => {
    GameState.animating = false;
    tick();

    const isGoal = isGoalCell(lv, GameState.player);
    const isDeadEnd = isDeadEndState(GameState.legalDests, isGoal);

    if (isDeadEnd) {
      GameState.loseLife();
      renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
      PlatformBridge.vibrateWarning();

      if (GameState.lives <= 0 && !GameState.settings.relaxMode) {
        setTimeout(() => {
          SceneRouter.pushModal("OUT_OF_LIVES");
        }, 300);
        return;
      }
    }

    checkWin();
  }, 230);
}

export function checkWin() {
  const lv = GameState.currentLevel();
  if (isGoalCell(lv, GameState.player)) {
    PlatformBridge.vibrateSuccess();
    showWin();
  }
}

export function undo() {
  if (!GameState.history.length || GameState.animating || SceneRouter.isInputBlocked()) return;
  const prev = GameState.history.pop();
  GameState.player = prev.player;
  GameState.moveCount = prev.moveCount;
  // Note: Lost hearts are not restored on undo to preserve gameplay stakes
  clearDeadEndFeedback();
  GameState.animating = true;
  placeToken(GameState.player, false);
  const lv = GameState.currentLevel();
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  setTimeout(() => {
    GameState.animating = false;
    tick();
  }, 230);
}

export function restart() {
  if (GameState.animating) return;
  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.resetLives();
  clearDeadEndFeedback();
  placeToken(GameState.player, true);
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  tick();
}

export function showWin() {
  const lv = GameState.currentLevel();
  const titleName = lv.name ? ` (${lv.name})` : "";

  if (GameState.customLevel) {
    if (DOM.winTitle) DOM.winTitle.textContent = "Playtest Cleared!";
    if (DOM.winNextBtn) {
      DOM.winNextBtn.textContent = "Back to Editor";
      DOM.winNextBtn.style.display = "block";
    }
  } else {
    GameState.recordLevelResult(GameState.levelIndex, GameState.moveCount);
    if (DOM.winTitle) DOM.winTitle.textContent = "Level " + String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0") + titleName + " cleared";
    if (DOM.winNextBtn) {
      DOM.winNextBtn.textContent = "Next Level";
      DOM.winNextBtn.style.display = (GameState.levelIndex === LEVELS.length - 1) ? "none" : "block";
    }
  }

  if (DOM.winMoves) DOM.winMoves.textContent = GameState.moveCount;
  if (DOM.winOptimal) DOM.winOptimal.textContent = lv.optimal;

  const eff = Math.round((lv.optimal / GameState.moveCount) * 100);
  if (DOM.winEfficiency) {
    DOM.winEfficiency.textContent = eff + "%";
    DOM.winEfficiency.classList.remove("good", "ok");
    DOM.winEfficiency.classList.add(eff >= 90 ? "good" : "ok");
  }

  if (DOM.winEfficiencyStat) {
    DOM.winEfficiencyStat.style.display = (GameState.devModeEnabled && TargetConfig.features.devDiagnostics) ? "flex" : "none";
  }

  SceneRouter.pushModal("WIN");
}

export function showPause() {
  if (DOM.pauseLevel) DOM.pauseLevel.textContent = GameState.customLevel ? "TEST" : String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0");
  if (DOM.pauseMoves) DOM.pauseMoves.textContent = GameState.moveCount;
  SceneRouter.pushModal("PAUSE");
}

export function nextLevel() {
  SceneRouter.popModal();
  if (GameState.customLevel) {
    SceneRouter.navigateTo("screenEditor");
    return;
  }
  if (GameState.levelIndex === LEVELS.length - 1) {
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
  GameState.solutionPathVisible = !GameState.solutionPathVisible;
  if (DOM.hintBtn) DOM.hintBtn.classList.toggle("active", GameState.solutionPathVisible);
  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.toggle("active", GameState.solutionPathVisible);
    DOM.devShowSolutionBtn.textContent = GameState.solutionPathVisible ? "HIDE SOLUTION" : "SHOW SOLUTION";
  }
  if (GameState.solutionPathVisible) {
    highlightSolutionPath();
  } else {
    clearSolutionPath();
  }
}

function clearSolutionPath() {
  const lv = GameState.currentLevel();
  const cellEls = getCellElements();
  for (let r = 0; r < lv.h; r++) {
    for (let c = 0; c < lv.w; c++) {
      if (cellEls[r]?.[c]) {
        cellEls[r][c].classList.remove("path-cell");
      }
    }
  }
}

function highlightSolutionPath() {
  clearSolutionPath();
  const lv = GameState.currentLevel();
  const cellEls = getCellElements();
  const res = solve(lv, GameState.player);
  if (!res || !res.path) return;
  res.path.forEach(([r, c]) => {
    if (cellEls[r]?.[c]) {
      cellEls[r][c].classList.add("path-cell");
    }
  });
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

  if (GameState.solutionPathVisible) {
    highlightSolutionPath();
  }
}

export function handleResize() {
  if (SceneRouter.getCurrentScreen() === "screenGame") {
    const size = Math.min(380, window.innerWidth - 64);
    DOM.board.style.width = size + "px";
    placeToken(GameState.player, true);
  }
}

// App Boot Sequence
export function bootApp() {
  GameState.init();

  // Home Hub bindings
  if (DOM.heroPlayBtn) DOM.heroPlayBtn.addEventListener("click", () => startLevel(GameState.levelIndex));
  if (DOM.heroBanner) DOM.heroBanner.addEventListener("click", (e) => {
    if (e.target !== DOM.heroPlayBtn) startLevel(GameState.levelIndex);
  });
  if (DOM.homeHelpBtn) DOM.homeHelpBtn.addEventListener("click", () => SceneRouter.pushModal("RULES"));
  if (DOM.homeSettingsBtn) DOM.homeSettingsBtn.addEventListener("click", () => SceneRouter.pushModal("SETTINGS"));

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

  if (DOM.outOfLivesRestartBtn) {
    DOM.outOfLivesRestartBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      restart();
    });
  }
  if (DOM.outOfLivesHomeBtn) {
    DOM.outOfLivesHomeBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      if (GameState.customLevel) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        openHome();
      }
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

  // Target-specific UI Features Configuration
  const modePill = document.getElementById("targetModePill");
  if (modePill) {
    modePill.textContent = `MODE: ${TargetConfig.mode.toUpperCase()}`;
  }
  if (DOM.devToggleBtn) {
    DOM.devToggleBtn.style.display = TargetConfig.features.devDiagnostics ? "block" : "none";
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

  // Setup keyboard & touch router
  setupInputRouter({
    onMoveDirection: (dir) => {
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
    boardElement: DOM.board
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
      if (SceneRouter.currentModal()) {
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

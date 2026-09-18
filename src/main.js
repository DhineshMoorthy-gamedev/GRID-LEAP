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
import { AudioEngine } from "./audio/audio-engine.js";
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
  calculateBoardSize,
  applyTheme,
  shakeActiveCell,
  updateHintBadge
} from "./scenes/game-renderer.js";
import { TutorialController } from "./scenes/tutorial-controller.js";
import { SettingsController } from "./scenes/settings-controller.js";
import { UpdateController } from "./scenes/update-controller.js";
import { DailyCalendarController } from "./scenes/daily-calendar-controller.js";
import { AchievementsController } from "./scenes/achievements-controller.js";
import { AchievementManager } from "./state/achievement-manager.js";
import { AdController } from "./scenes/ad-controller.js";
import { RewardModalController } from "./scenes/reward-modal-controller.js";
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
  AdController.ensureBanner();
}

export function startDailyLevel(targetDateKey = null) {
  // Offline verification gate requested by user
  if (!DailyManager.isOnline()) {
    showToast("⚠️ You need to be online to play the Daily Challenge!");
    PlatformBridge.vibrateWarning?.();
    return;
  }

  clearAutoUndo();
  hideToast();
  devStopAutoPlay();

  const dailyLv = targetDateKey ? DailyManager.getLevelForDate(targetDateKey) : DailyManager.getTodayLevel();
  GameState.customLevel = dailyLv;
  GameState.player = [dailyLv.start[0], dailyLv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.hintUsedThisLevel = false;
  GameState.hadDeadEndBeforeRestart = false;
  GameState.resetLives();

  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  renderBoard(dailyLv, (r, c) => attemptMoveTo(r, c), {
    onReadySound: () => AudioEngine.playDailyStart()
  });
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(888, dailyLv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  AdController.ensureBanner();
  tick();
}

export async function startLevel(i) {
  clearAutoUndo();
  hideToast();
  devStopAutoPlay();
  await AdController.showPendingInterstitialIfNeeded();
  GameState.customLevel = null;
  GameState.levelIndex = i;
  GameState.clearSession();
  GameState.save();

  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.solutionPathVisible = false;
  GameState.hintUsedThisLevel = false;
  GameState.hadDeadEndBeforeRestart = false;
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
  renderBoard(lv, (r, c) => attemptMoveTo(r, c), {
    onReadySound: () => AudioEngine.playLevelStart()
  });
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(GameState.levelIndex, lv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  updateHintBadge(GameState.getHintsCount(), AdController.isPremiumUser());
  AdController.ensureBanner();
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
  GameState.hintUsedThisLevel = false;

  const lv = GameState.currentLevel();
  clearDeadEndFeedback();
  renderBoard(lv, (r, c) => attemptMoveTo(r, c), {
    onReadySound: () => AudioEngine.playLevelStart()
  });

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
  updateHintBadge(GameState.getHintsCount(), AdController.isPremiumUser());
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
  GameState.hintUsedThisLevel = false;
  GameState.resetLives();

  if (DOM.devShowSolutionBtn) {
    DOM.devShowSolutionBtn.classList.remove("active");
    DOM.devShowSolutionBtn.textContent = "SHOW SOLUTION";
  }

  clearDeadEndFeedback();
  renderBoard(customLv, (r, c) => attemptMoveTo(r, c), {
    onReadySound: () => AudioEngine.playLevelStart()
  });
  SceneRouter.navigateTo("screenGame");
  placeToken(GameState.player, true);
  requestAnimationFrame(() => placeToken(GameState.player, true));
  updateGameHeader(999, customLv, GameState.moveCount, GameState.history.length);
  renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);
  updateHintBadge(GameState.getHintsCount(), AdController.isPremiumUser());
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
  if (!match) {
    AudioEngine.playBlocked();
    shakeActiveCell(GameState.player, r, c);
    return;
  }
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
  AudioEngine.playLeap();

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
      AudioEngine.playDeadEnd();

      if (cellEls[r]?.[c]) {
        cellEls[r][c].classList.add("dead-end-hit");
        setTimeout(() => cellEls[r]?.[c]?.classList.remove("dead-end-hit"), 850);
      }

      clearAutoUndo();

      const outOfLives = GameState.lives <= 0 && !GameState.settings.relaxMode;

      if (outOfLives) {
        // Auto-undo the dead end step first so player returns to previous tile, then present Out of Lives modal
        autoUndoTimer = setTimeout(() => {
          undo(true);
          autoUndoTimer = setTimeout(() => {
            AudioEngine.playOutOfLives();
            SceneRouter.pushModal("OUT_OF_LIVES");
            autoUndoTimer = null;
          }, 280);
        }, 800);
        return;
      }

      // Automatically undo the dead-end step after a well-paced pause so player clearly perceives the consequence
      autoUndoTimer = setTimeout(() => {
        undo(true);
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
    AudioEngine.playWin();
    PlatformBridge.vibrateSuccess();
    showWin();
  }
}

export function undo(isAuto = false) {
  clearAutoUndo();
  if (!GameState.history.length || GameState.animating || SceneRouter.isInputBlocked()) return;
  if (isAuto !== true) {
    AudioEngine.playUndo();
    AchievementManager.check("UNDO_USED");
  }
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
  AudioEngine.playRestart();
  GameState.hadDeadEndBeforeRestart = (GameState.deadEndsEncountered > 0);
  GameState.clearSession();
  const lv = GameState.currentLevel();
  GameState.player = [lv.start[0], lv.start[1]];
  GameState.moveCount = 0;
  GameState.history = [];
  GameState.resetLives();
  GameState.solutionPathVisible = false;
  GameState.hintUsedThisLevel = false;
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

  let isNewBest = false;
  let dailyResult = null;
  if (isDaily) {
    dailyResult = DailyManager.recordDateCompletion(lv.dateKey, GameState.moveCount, lv.optimal);
    const todayKey = DailyManager.getTodayDateKey();
    const isPastArchive = Boolean(lv.dateKey && lv.dateKey < todayKey);
    const monthKey = lv.dateKey.slice(0, 7);
    const monthCount = Object.keys(DailyManager.data.history).filter(k => k.startsWith(monthKey)).length;
    AchievementManager.check("DAILY_COMPLETED", {
      dateKey: lv.dateKey,
      isPastArchive,
      streak: dailyResult ? dailyResult.streak : DailyManager.data.currentStreak,
      monthCount
    });
  } else if (!isCustom) {
    const result = GameState.recordLevelResult(GameState.levelIndex, GameState.moveCount);
    isNewBest = result.isNewBest;
    const completedCount = GameState.completed.filter(Boolean).length;
    AchievementManager.check("LEVEL_COMPLETED", {
      levelIndex: GameState.levelIndex,
      completedCount,
      moveCount: GameState.moveCount,
      optimal: lv.optimal || 1,
      livesRemaining: GameState.lives,
      deadEndsEncountered: GameState.deadEndsEncountered,
      isNewBest,
      isImprovedReplay: result.isImprovedReplay,
      hadDeadEndBeforeRestart: GameState.hadDeadEndBeforeRestart
    });
  }

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

  AdController.recordLevelVictory(isCustom || isDaily);

  PlatformBridge.vibrateSuccess();
  SceneRouter.pushModal("WIN");
}

export function showPause() {
  if (DOM.pauseLevel) DOM.pauseLevel.textContent = GameState.customLevel ? (GameState.customLevel.isDaily ? "DAILY" : "TEST") : String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0");
  if (DOM.pauseMoves) DOM.pauseMoves.textContent = GameState.moveCount;
  SceneRouter.pushModal("PAUSE");
}

export async function nextLevel() {
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
  await AdController.showPendingInterstitialIfNeeded();
  AudioEngine.playNextLevel();
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

export async function toggleSolutionPath() {
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

  // ── Hint Currency & Rewarded Ad Gate ──────────────────────────────────────
  const isPremium = AdController.isPremiumUser();
  if (isPremium) {
    // Premium players get unlimited free hints
    updateHintBadge(Infinity, true);
    GameState.hintUsedThisLevel = true;
  } else if (GameState.hintUsedThisLevel) {
    // Already unlocked for this level attempt: re-illuminate for free without decrementing!
  } else if (GameState.getHintsCount() > 0) {
    // Consume 1 stored hint for this level attempt
    GameState.useHint();
    GameState.hintUsedThisLevel = true;
    const rem = GameState.getHintsCount();
    updateHintBadge(rem, false);
    showToast(`Hint used (${rem === 1 ? "1 hint remaining" : `${rem} hints remaining`})`, 1800);
  } else if (TargetConfig.isPlayStore) {
    // 0 free hints remaining: watch rewarded ad to earn +1 hint
    const earned = await AdController.requestHintReward();
    if (!earned) {
      return;
    }
    GameState.addHints(1);
    const rem = GameState.getHintsCount();
    updateHintBadge(rem, false);
    RewardModalController.open({
      type: "hint",
      title: "+1 Hint Added!",
      desc: "Added to your hint inventory."
    });
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
    AudioEngine.playTrapped();

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
  AudioEngine.playHintOn();
  AchievementManager.check("HINT_USED");
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
      const size = calculateBoardSize(lv);
      DOM.board.style.width = size + "px";
      DOM.board.style.height = size + "px";
      placeToken(GameState.player, true);
      refreshTrail();
    }
  }
}

export function handleToggleTheme(targetTheme) {
  if (targetTheme && GameState.getTheme() === targetTheme) {
    return; // Already active, do not re-trigger feedback
  }
  let nextTheme;
  if (targetTheme) {
    nextTheme = targetTheme;
    GameState.setTheme(nextTheme);
  } else {
    nextTheme = GameState.toggleTheme();
  }
  applyTheme(nextTheme);
  refreshTrail(GameState.settings.showTrail);
  if (GameState.settings.hapticsEnabled !== false) {
    PlatformBridge.vibrateLight();
  }
  if (GameState.settings.soundEnabled !== false) {
    AudioEngine.playThemeSwitch();
  }
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
  AudioEngine.playTrailToggle();
  showToast(isNowOn ? "Breadcrumbs Trail ON" : "Breadcrumbs Trail OFF");
}

/**
 * Studio Intro Splash Screen Controller (OLAI DIGITAL STUDIOS)
 */
export function runStudioIntro(onComplete) {
  const overlay = document.getElementById("startupOverlay");
  if (!overlay) {
    applyTheme(GameState.getTheme());
    if (typeof onComplete === "function") onComplete();
    return;
  }

  const slide = document.getElementById("studioScreen");
  let dismissed = false;
  let autoDismissTimer = null;

  const activateSlide = () => {
    if (slide && !dismissed) {
      slide.classList.add("active");
    }
  };

  // Hold a seamless solid dark screen for 300ms while Android stabilizes viewport insets and rasterizes fonts
  const fontPromise = document.fonts?.load
    ? Promise.all([
        document.fonts.load('400 52px "Bodoni Moda"'),
        document.fonts.load('400 22px "Bodoni Moda"'),
        document.fonts.ready
      ])
    : Promise.resolve();

  const bufferPromise = new Promise((resolve) => setTimeout(resolve, 300));

  Promise.all([fontPromise, bufferPromise]).then(() => {
    requestAnimationFrame(activateSlide);
  }).catch(() => {
    setTimeout(activateSlide, 300);
  });

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
      autoDismissTimer = null;
    }
    if (slide) slide.classList.add("exit");
    overlay.classList.add("fade-out");
    // Transition status bar theme in sync with the fade-out
    applyTheme(GameState.getTheme(), true);
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 700);
  };

  overlay.addEventListener("click", dismiss);
  overlay.addEventListener("touchstart", dismiss, { passive: true });

  const onKey = (e) => {
    if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
      dismiss();
      window.removeEventListener("keydown", onKey);
    }
  };
  window.addEventListener("keydown", onKey);

  // 2500ms display duration with instant tap/click/key-to-skip
  const displayDuration = 2500;
  autoDismissTimer = setTimeout(dismiss, displayDuration);
}

function setupAudioLab() {
  const lab = document.getElementById("editorAudioLabSection");
  if (!lab) return;

  const sfxMap = {
    leap: () => AudioEngine.playLeap(),
    blocked: () => AudioEngine.playBlocked(),
    deadEnd: () => AudioEngine.playDeadEnd(),
    win: () => AudioEngine.playWin(),
    outOfLives: () => AudioEngine.playOutOfLives(),
    undo: () => AudioEngine.playUndo(),
    restart: () => AudioEngine.playRestart(),
    levelStart: () => AudioEngine.playLevelStart(),
    tileGrow: () => AudioEngine.playRadialTileGrow(4, 90),
    nextLevel: () => AudioEngine.playNextLevel(),
    dailyStart: () => AudioEngine.playDailyStart(),
    hintOn: () => AudioEngine.playHintOn(),
    trapped: () => AudioEngine.playTrapped(),
    tutorialSuccess: () => AudioEngine.playTutorialSuccess(),
    tutorialWrong: () => AudioEngine.playTutorialWrong(),
    tutorialComplete: () => AudioEngine.playTutorialComplete(),
    modalOpen: () => AudioEngine.playModalOpen(),
    modalClose: () => AudioEngine.playModalClose(),
    themeSwitch: () => AudioEngine.playThemeSwitch(),
    navBack: () => AudioEngine.playNavBack(),
    trailToggle: () => AudioEngine.playTrailToggle(),
    lifeGranted: () => AudioEngine.playLifeGranted(),
    editorTick: () => AudioEngine.playEditorTick(),
    editorSolvable: () => AudioEngine.playEditorSolvable(),
    editorUnsolvable: () => AudioEngine.playEditorUnsolvable(),
    editorExport: () => AudioEngine.playEditorExport()
  };

  lab.querySelectorAll(".audio-test-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const sfx = btn.dataset.sfx;
      if (!sfx || !sfxMap[sfx]) return;

      AudioEngine.resume();

      // If sound was disabled in settings, enable it so tester can hear it immediately
      if (!AudioEngine.isEnabled()) {
        GameState.settings.soundEnabled = true;
        GameState.save();
        if (DOM.settingSound) DOM.settingSound.checked = true;
        showToast("🔊 Sound re-enabled for testing", 1200);
      }

      btn.classList.add("playing");
      setTimeout(() => btn.classList.remove("playing"), 200);

      sfxMap[sfx]();
    });
  });
}

// App Boot Sequence
export function bootApp() {
  GameState.init();
  AudioEngine.init();
  setupAudioLab();

  SceneRouter.subscribe((event, data) => {
    const modalName = data?.modalName;
    const isSpecialMusicalModal = modalName === "WIN" || modalName === "OUT_OF_LIVES" || modalName === "FINAL";

    if (event === "modal_opened") {
      if (!isSpecialMusicalModal) {
        AudioEngine.playModalOpen();
      }
    } else if (event === "modal_closed") {
      if (!isSpecialMusicalModal) {
        AudioEngine.playModalClose();
      }
    }
  });

  // Prepare theme DOM styling quietly under the startup overlay (status bar stays dark until intro dismisses)
  applyTheme(GameState.getTheme(), false);
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

  // Initialize Dedicated Interactive Tutorial
  TutorialController.init({
    onStartCampaign: () => {
      const nextIdx = GameState.getNextUncompletedLevelIndex();
      startLevel(nextIdx);
    }
  });
  window.TutorialController = TutorialController;

  // Initialize Dedicated Full-Screen Settings
  SettingsController.init();
  window.SettingsController = SettingsController;

  // Initialize Local In-Game Achievements
  AchievementManager.init();
  AchievementsController.init();
  window.AchievementsController = AchievementsController;
  window.AchievementManager = AchievementManager;
  window.resetAllData = () => {
    try {
      GameState.resetToDefault();
      DailyManager.reset();
      AchievementManager.reset();
      localStorage.removeItem("number_grid_maze_save_v1");
      localStorage.removeItem("grid_leap_daily_save_v1");
      localStorage.removeItem("grid_leap_achievements_v1");
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error("Reset error:", e);
    }
  };
  AchievementManager.updateHomeBadge();

  if (DOM.homeAchievementsBtn) {
    DOM.homeAchievementsBtn.addEventListener("click", () => {
      AudioEngine.playNavBack();
      AchievementsController.open();
    });
  }

  // Play Studio Intro Screen & Launch FTUE Tutorial for first-time players
  runStudioIntro(() => {
    // Initialize In-App Update Controller (Play Store)
    UpdateController.init();

    // Initialize Native AdMob / AdController (Play Store)
    AdController.init();

    if (!GameState.settings.hasSeenRules) {
      TutorialController.open();
    }
  });

  if (DOM.homeHelpBtn) {
    DOM.homeHelpBtn.addEventListener("click", () => {
      TutorialController.open();
    });
  }
  if (DOM.homeSettingsBtn) DOM.homeSettingsBtn.addEventListener("click", () => SettingsController.open());

  // Initialize Daily Manager & Calendar Archive
  DailyManager.init();
  DailyCalendarController.init({
    onPlayDate: (dateKey) => startDailyLevel(dateKey)
  });
  window.DailyCalendarController = DailyCalendarController;
  window.UpdateController = UpdateController;
  window.AdController = AdController;

  // Initialize Reward Success Modal Controller & Hint Badge HUD
  RewardModalController.init();
  window.RewardModalController = RewardModalController;
  updateHintBadge(GameState.getHintsCount(), AdController.isPremiumUser());

  // Sync existing historical progress into AchievementManager
  const initCompletedCampaign = (GameState.completed || []).filter(Boolean).length;
  const initTotalDaily = DailyManager.getTotalCompletedCount?.() || 0;
  const initStreak = DailyManager.data?.currentStreak || 0;
  const initToday = DailyManager.getTodayDateKey?.() || "";
  const initMonthKey = initToday.slice(0, 7);
  const initMonthDaily = Object.keys(DailyManager.data?.history || {}).filter(k => k.startsWith(initMonthKey)).length;
  AchievementManager.syncExistingProgress(initCompletedCampaign, initStreak, initMonthDaily, initTotalDaily);
  AchievementManager.updateHomeBadge();

  // Daily Challenge Card Launch & Calendar Actions
  if (DOM.dailyPlayBtn) DOM.dailyPlayBtn.addEventListener("click", () => startDailyLevel());
  if (DOM.dailyCalendarBtn) {
    DOM.dailyCalendarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      AudioEngine.playNavBack();
      DailyCalendarController.open();
    });
  }
  if (DOM.dailyChallengeCard) {
    DOM.dailyChallengeCard.addEventListener("click", (e) => {
      if (!DOM.dailyPlayBtn?.contains(e.target) && !DOM.dailyCalendarBtn?.contains(e.target)) {
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
  if (DOM.gameBackBtn) {
    DOM.gameBackBtn.addEventListener("click", () => {
      AudioEngine.playNavBack();
      openHome();
    });
  }
  if (DOM.gamePauseBtn) DOM.gamePauseBtn.addEventListener("click", showPause);

  // In-Game Bottom tools
  if (DOM.undoBtn) DOM.undoBtn.addEventListener("click", () => undo(false));
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
      AudioEngine.playNavBack();
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
    DOM.winHomeBtn.addEventListener("click", async () => {
      AudioEngine.playNavBack();
      SceneRouter.popModal();
      await AdController.showPendingInterstitialIfNeeded();
      openHome();
    });
  }

  if (DOM.outOfLivesWatchAdBtn) {
    DOM.outOfLivesWatchAdBtn.addEventListener("click", async () => {
      // 1. Request rewarded ad for life
      if (TargetConfig.isPlayStore && !AdController.isPremiumUser()) {
        const earned = await AdController.requestLifeReward();
        if (!earned) return;
      }

      // 2. Grant 1 life
      GameState.addLife(1);
      renderLivesHUD(GameState.lives, GameState.maxLives, GameState.settings.relaxMode);

      // 3. Dismiss out-of-lives modal
      SceneRouter.popModal();

      // 4. Safety check: if player is still on a dead-end cell, auto-undo back to safety
      const lv = GameState.currentLevel();
      const isGoal = isGoalCell(lv, GameState.player);
      const isDeadEnd = isDeadEndState(GameState.legalDests, isGoal);
      if (isDeadEnd && GameState.history.length > 0) {
        undo(true);
      }

      // 5. Open Reward Success Modal
      RewardModalController.open({
        type: "life",
        title: "+1 Life Added!",
        desc: "Added to your level."
      });
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
      if (e.target.checked) {
        AudioEngine.playLevelStart();
      }
    });
  }
  if (DOM.settingHaptics) {
    const isSupported = PlatformBridge.isHapticsSupported();
    DOM.settingHaptics.checked = isSupported && GameState.settings.hapticsEnabled !== false;
    DOM.settingHaptics.disabled = !isSupported;
    DOM.settingHaptics.addEventListener("change", (e) => {
      if (!isSupported) return;
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

  const settingsHowToPlayBtn = document.getElementById("settingsHowToPlayBtn");
  if (settingsHowToPlayBtn) {
    settingsHowToPlayBtn.addEventListener("click", () => {
      SceneRouter.popModal();
      TutorialController.open();
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
  if (DOM.homeHelpBtn) {
    DOM.homeHelpBtn.style.display = "inline-flex";
  }
  if (DOM.homeSettingsBtn) {
    DOM.homeSettingsBtn.style.display = "inline-flex";
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
    DOM.gamePauseBtn.style.display = "none";
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
  const editorSettingsRows = [
    document.getElementById("settingRowRelaxMode"),
    document.getElementById("settingRowTrail"),
    document.getElementById("settingRowDevMode"),
    document.getElementById("settingRowTutorial")
  ];
  editorSettingsRows.forEach(row => {
    if (row) row.style.display = TargetConfig.features.editorSettings ? "flex" : "none";
  });
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
        AudioEngine.playBlocked();
        shakeActiveCell(GameState.player);
        showToast();
      }
    },
    onUndo: () => undo(false),
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
    onToggleFullscreen: toggleFullscreen,
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
    onHomePlay: () => {
      if (GameState.hasActiveSessionFor(GameState.levelIndex)) {
        resumeLevelSession();
      } else {
        startLevel(GameState.levelIndex);
      }
    },
    onDailyPlay: () => startDailyLevel(),
    onOpenSettings: () => SettingsController.open(),
    onOpenHelp: () => TutorialController.open(),
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
    onPause: () => {
      GameState.save();
      AudioEngine.suspend();
      AchievementManager.stopPlayTimeTicker();
      AdController.onPause();
    },
    onResume: () => {
      AudioEngine.resume();
      AchievementManager.startPlayTimeTicker();
      AdController.onResume();
      handleResize();
      if (GameState.animating) {
        GameState.animating = false;
        tick();
      }
    },
    onBackAction: () => {
      // 0. Dismiss Studio Intro Overlay if active
      const overlay = document.getElementById("startupOverlay");
      if (overlay && !overlay.classList.contains("fade-out")) {
        overlay.click();
        return true;
      }
      // 1. Dismiss open modal overlay
      const activeModal = SceneRouter.currentModal();
      if (activeModal) {
        if (activeModal.name === "SETTINGS") {
          return SettingsController.back();
        }
        if (activeModal.name === "UPDATE") {
          UpdateController.close();
          return true;
        }
        if (activeModal.name === "REWARD") {
          RewardModalController.close();
          return true;
        }
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

  // Ensure no tooltips appear across any platform
  document.querySelectorAll("[title]").forEach((el) => el.removeAttribute("title"));

  // Open Home Hub on boot
  openHome();

  // Background check for Play Store update on boot
  if (TargetConfig.isPlayStore && PlatformBridge.isCapacitor()) {
    PlatformBridge.checkForPlayStoreUpdate().then(async info => {
      if (info?.isDownloaded) {
        UpdateController.setUpdateAvailable(info);
        UpdateController.open(info);
      } else if (info?.updateAvailable) {
        UpdateController.setUpdateAvailable(info);
        // Display dedicated in-app update popup on Home Screen
        UpdateController.open(info);
      }
    }).catch(err => {
      console.warn("[PlayStore] Boot update check error:", err);
    });
  }
}

// Start application
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", bootApp);
}

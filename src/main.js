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
import { formatDisplayDate, getTodayDateKey, getPreviousDateKey, getNextDateKey } from "./core/daily-seed.js";
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
import { LevelSelectController } from "./scenes/level-select-controller.js";
import { AchievementManager } from "./state/achievement-manager.js";
import { AdController } from "./scenes/ad-controller.js";
import { RewardModalController } from "./scenes/reward-modal-controller.js";
import { setupInputRouter } from "./scenes/input-router.js";
import { NotificationManager } from "./platform/notification-manager.js";
import { ReviewManager } from "./platform/review-manager.js";
import { ConfettiFX } from "./scenes/confetti-fx.js";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { generateVictoryCard } from "./scenes/share-card-generator.js";

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
  AchievementManager.stopPlayTimeTicker();
  clearAutoUndo();
  hideToast();
  ConfettiFX.stop();
  if (SceneRouter.getCurrentScreen() === "screenGame") {
    GameState.saveCurrentSession();
  }
  GameState.customLevel = null;
  const selectedIdx = GameState.getSelectedCardLevelIndex();
  renderHomeHub(LEVELS, selectedIdx, GameState.completed, (idx) => {
    startLevel(idx);
  }, GameState.activeSession, GameState.stars, GameState.bestMoves);

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
  AchievementManager.startPlayTimeTicker();
  tick();
}

export function navigateToAdjacentDaily(delta) {
  if (!GameState.customLevel?.isDaily) return;
  const curDateKey = GameState.customLevel?.dateKey || getTodayDateKey();
  const targetDate = delta < 0 ? getPreviousDateKey(curDateKey) : getNextDateKey(curDateKey);
  if (delta < 0 && DailyManager.isBeforeLaunch(targetDate)) {
    showToast("📅 Sept 16, 2026 is the earliest daily puzzle");
    PlatformBridge.vibrateWarning?.();
    return;
  }
  if (delta > 0 && DailyManager.isFutureDate(targetDate)) {
    showToast("🔒 Future daily challenge unlocks tomorrow");
    PlatformBridge.vibrateWarning?.();
    return;
  }
  AudioEngine.playDailyStart();
  startDailyLevel(targetDate);
}

export async function startLevel(i) {
  clearAutoUndo();
  hideToast();
  devStopAutoPlay();
  await AdController.showPendingInterstitialIfNeeded();
  GameState.customLevel = null;
  GameState.levelIndex = i;
  GameState.selectedCardLevelIndex = i;
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
  AchievementManager.startPlayTimeTicker();
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
  AchievementManager.startPlayTimeTicker();
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
  AchievementManager.startPlayTimeTicker();
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
  doMove(r, c, match);
}

export function doMove(r, c, destMeta = null) {
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
  ConfettiFX.stop();
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
    NotificationManager.onDailyPuzzleCompleted();
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

  const optimalMoves = Math.max(1, lv.optimal || 1);
  const actualMoves = Math.max(1, GameState.moveCount || 1);
  const eff = Math.min(100, Math.max(10, Math.round((optimalMoves / actualMoves) * 100)));

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

  AdController.recordLevelVictory(isCustom);

  PlatformBridge.vibrateSuccess();
  ConfettiFX.burst({ isFlawless: eff >= 100 });
  SceneRouter.pushModal("WIN");
}

export function showPause() {
  if (DOM.pauseLevel) DOM.pauseLevel.textContent = GameState.customLevel ? (GameState.customLevel.isDaily ? "DAILY" : "TEST") : String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0");
  if (DOM.pauseMoves) DOM.pauseMoves.textContent = GameState.moveCount;
  SceneRouter.pushModal("PAUSE");
}

export function showExitConfirm() {
  if (DOM.exitConfirmSub) {
    DOM.exitConfirmSub.textContent = "Progress is saved.";
  }
  SceneRouter.pushModal("EXIT_CONFIRM");
}

export async function nextLevel() {
  const wasDaily = Boolean(GameState.customLevel?.isDaily);
  ConfettiFX.stop();
  SceneRouter.popModal();
  if (wasDaily) {
    await AdController.showPendingInterstitialIfNeeded();
    openHome();
    if (!GameState.settings.dailyReminders && !GameState.settings.hasPromptedDailyReminders) {
      setTimeout(() => {
        NotificationManager.showOptInPrompt();
      }, 400);
    }
    return;
  }
  if (GameState.customLevel && !GameState.customLevel.isDaily) {
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

let activeShareContext = null;

export function openShareModal(shareContext) {
  activeShareContext = shareContext;
  const { shareTitle, shareText, storeUrl, card, savedFilePath, levelTitle, statsText } = shareContext;

  if (DOM.sharePreviewLevel) DOM.sharePreviewLevel.textContent = levelTitle || "Level Complete";
  if (DOM.sharePreviewStats) DOM.sharePreviewStats.textContent = statsText || "";

  if (DOM.sharePreviewImg && card?.dataUrl) {
    DOM.sharePreviewImg.src = card.dataUrl;
    DOM.sharePreviewImg.style.display = "block";
    if (DOM.sharePreviewPlaceholder) DOM.sharePreviewPlaceholder.style.display = "none";
  } else if (DOM.sharePreviewPlaceholder) {
    DOM.sharePreviewPlaceholder.style.display = "block";
    if (DOM.sharePreviewImg) DOM.sharePreviewImg.style.display = "none";
  }

  if (DOM.sharePreviewSavedTag) {
    if (savedFilePath) {
      DOM.sharePreviewSavedTag.textContent = "💾 Saved to Pictures";
      DOM.sharePreviewSavedTag.style.display = "block";
    } else {
      DOM.sharePreviewSavedTag.textContent = "🖼️ Victory Card Ready";
      DOM.sharePreviewSavedTag.style.display = "block";
    }
  }

  SceneRouter.pushModal("SHARE");
}

export async function shareVictoryResult() {
  const lv = GameState.currentLevel();
  const isDaily = Boolean(lv?.isDaily);
  const isCustom = Boolean(GameState.customLevel) && !isDaily;
  const padIdx = String(GameState.levelIndex + 1).padStart(GameState.levelIndex + 1 >= 100 ? 3 : 2, "0");
  const optimalMoves = Math.max(1, lv?.optimal || 1);
  const actualMoves = Math.max(1, GameState.moveCount || 1);
  const eff = Math.min(100, Math.max(10, Math.round((optimalMoves / actualMoves) * 100)));
  const visitedPath = GameState.history.map(h => h.player).concat([GameState.player || lv?.goal || [0, 0]]);

  let storeUrl = "https://play.google.com/store/apps/details?id=com.olaidigitalstudios.gridleap";
  if (TargetConfig.isItch || TargetConfig.isDesktop) {
    storeUrl = "https://olaidigitalstudios.itch.io/grid-leap";
  } else if (TargetConfig.isWeb) {
    storeUrl = "https://gridleap.netlify.app";
  }

  let shareTitle = "Grid Leap";
  let shareText = "";
  let levelTitle = "";
  let statsText = "";

  const moveSuffix = actualMoves === 1 ? "move" : "moves";
  const optSuffix = optimalMoves === 1 ? "move" : "moves";

  if (isDaily) {
    const displayDate = formatDisplayDate(lv?.dateKey || getTodayDateKey());
    const streak = DailyManager.data?.currentStreak || 1;
    const streakSuffix = streak === 1 ? "day" : "days";

    levelTitle = `Daily Challenge • ${displayDate}`;
    statsText = `${actualMoves} Moves (${eff}%) • 🔥 ${streak} ${streakSuffix}`;
    shareTitle = `Grid Leap — Daily Challenge | ${displayDate}`;
    shareText = `Grid Leap — Daily Challenge | ${displayDate}\n\nToday's challenge is solved in ${actualMoves} ${moveSuffix}.\n\nOptimal: ${optimalMoves} ${optSuffix}\nEfficiency: ${eff}%\nStreak: ${streak} ${streakSuffix}\n\nCan you match the optimal solution?\n\nPlay today's challenge:\n${storeUrl}`;
  } else if (isCustom) {
    levelTitle = "Custom Maze";
    statsText = `${actualMoves} Moves (${eff}%) • Optimal ${optimalMoves}`;
    shareTitle = "Grid Leap — Custom Maze";
    shareText = `Grid Leap — Custom Maze\n\nCustom maze solved in ${actualMoves} ${moveSuffix}.\n\nOptimal: ${optimalMoves} ${optSuffix}\nEfficiency: ${eff}%\n\nCan you match the optimal solution?\n\nPlay Grid Leap:\n${storeUrl}`;
  } else {
    levelTitle = `Level ${padIdx}`;
    statsText = `${actualMoves} Moves (${eff}%) • Optimal ${optimalMoves}`;
    shareTitle = `Grid Leap — Level ${padIdx}`;
    shareText = `Grid Leap — Level ${padIdx}\n\nLevel ${padIdx} solved in ${actualMoves} ${moveSuffix}.\n\nOptimal: ${optimalMoves} ${optSuffix}\nEfficiency: ${eff}%\n\nCan you match the optimal solution?\n\nPlay Grid Leap:\n${storeUrl}`;
  }

  AudioEngine.playNavBack();

  // Generate zero-lag, pixel-perfect Win Modal Card snapshot matching active theme
  let card = null;
  try {
    card = await generateVictoryCard({
      level: lv,
      path: visitedPath,
      moveCount: actualMoves,
      optimal: optimalMoves,
      eff,
      isDaily,
      dateKey: lv?.dateKey || getTodayDateKey(),
      streak: DailyManager.data?.currentStreak || 1,
      isCustom,
      levelIndex: GameState.levelIndex,
      theme: GameState.getTheme()
    });
  } catch (cardErr) {
    console.warn("[Share] Victory Card generation failed, continuing with text only:", cardErr);
  }

  // 1. Android / iOS Native Capacitor Share (with clean Base64 file writing to cache)
  if (TargetConfig.isPlayStore || PlatformBridge.isCapacitor()) {
    try {
      let fileUri = null;
      if (card?.rawBase64) {
        try {
          const fileName = `grid_leap_victory_${Date.now()}.png`;
          const writeRes = await Filesystem.writeFile({
            path: fileName,
            data: card.rawBase64,
            directory: Directory.Cache,
            recursive: true
          });
          fileUri = writeRes?.uri;
          if (!fileUri) {
            const uriRes = await Filesystem.getUri({
              path: fileName,
              directory: Directory.Cache
            });
            fileUri = uriRes?.uri;
          }
          if (fileUri && !fileUri.startsWith("file://") && fileUri.startsWith("/")) {
            fileUri = `file://${fileUri}`;
          }
        } catch (fsErr) {
          console.error("[Share] Filesystem write failed:", fsErr);
        }
      }

      const sharePayload = {
        title: shareTitle,
        text: shareText,
        dialogTitle: "Share Victory Result"
      };
      if (fileUri) {
        sharePayload.files = [fileUri];
      }

      const canShareRes = await Share.canShare().catch(() => ({ value: true }));
      if (canShareRes.value) {
        await Share.share(sharePayload);
        return;
      }
    } catch (err) {
      if (err.message?.includes("canceled") || err.name === "AbortError") {
        return; // User dismissed native share dialog
      }
      console.warn("[Share] Capacitor Share failed, trying fallback:", err);
    }
  }

  // 2. Desktop Native Tauri App (Save high-res PNG to Pictures / Downloads)
  let savedFilePath = null;
  if (TargetConfig.isDesktop || typeof window !== "undefined" && (window.__TAURI_INTERNALS__ || window.__TAURI__)) {
    try {
      const fileName = `Grid_Leap_${isDaily ? "Daily_" + (lv?.dateKey || getTodayDateKey()) : "Level_" + padIdx}.png`;
      if (card?.rawBase64) {
        const tauriInvoke = window.__TAURI__?.core?.invoke || window.__TAURI_INTERNALS__?.invoke;
        if (typeof tauriInvoke === "function") {
          savedFilePath = await tauriInvoke("save_image_card", {
            base64Data: card.rawBase64,
            filename: fileName,
            openFile: false
          });
        }
      }
    } catch (tauriErr) {
      console.warn("[Share] Tauri native image save failed, continuing with browser/clipboard fallback:", tauriErr);
    }
  }

  // 3. Guaranteed Clipboard Copy: Copy formatted text directly to clipboard so user can immediately Ctrl+V
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (clipErr) {
      console.warn("[Share] Clipboard writeText failed:", clipErr);
    }
  }

  // 4. Open Desktop / Web Share Options Modal with 1-click channels (X, WhatsApp, Email, Open Card, Copy)
  openShareModal({
    shareTitle,
    shareText,
    storeUrl,
    card,
    savedFilePath,
    levelTitle,
    statsText
  });

  if (savedFilePath) {
    showToast("💾 Victory Card saved & score text copied!");
  } else {
    showToast("📋 Score text copied to clipboard!");
  }
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
  const isPremium = AdController.isPremiumUser() || TargetConfig.isDesktop || TargetConfig.isEditor;
  if (isPremium) {
    // Premium & Desktop players get unlimited free hints
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
  } else if (TargetConfig.isPlayStore || TargetConfig.isCrazyGames) {
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
  applyTheme(nextTheme, true, true);
  refreshTrail(GameState.settings.showTrail);
  if (GameState.settings.hapticsEnabled !== false) {
    PlatformBridge.vibrateLight();
  }
  if (GameState.settings.soundEnabled !== false) {
    AudioEngine.playThemeSwitch();
  }
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
    applyTheme(GameState.getTheme(), false, false);
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
    applyTheme(GameState.getTheme(), true, false);
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
  AdController.init();
  setupAudioLab();

  SceneRouter.subscribe((event, data) => {
    const modalName = data?.modalName;
    const isSpecialMusicalModal = modalName === "WIN" || modalName === "OUT_OF_LIVES" || modalName === "FINAL";

    if (event === "modal_opened") {
      AchievementManager.stopPlayTimeTicker();
      AdController.gameplayStop();
      if (!isSpecialMusicalModal) {
        AudioEngine.playModalOpen();
      }
    } else if (event === "modal_closed") {
      if (SceneRouter.getCurrentScreen() === "screenGame" && !SceneRouter.currentModal()) {
        AchievementManager.startPlayTimeTicker();
        AdController.gameplayStart();
      }
      if (!isSpecialMusicalModal) {
        AudioEngine.playModalClose();
      }
    } else if (event === "screen_changed") {
      if (data?.screenId === "screenGame" && !SceneRouter.currentModal()) {
        AchievementManager.startPlayTimeTicker();
        AdController.gameplayStart();
      } else {
        AchievementManager.stopPlayTimeTicker();
        AdController.gameplayStop();
      }
    }
  });

  // Prepare theme DOM styling quietly under the startup overlay (status bar stays dark until intro dismisses)
  applyTheme(GameState.getTheme(), false, false);
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
  // CrazyGames: Skip studio intro — go straight to tutorial/home for instant gameplay
  const afterIntro = () => {
    // Initialize In-App Update Controller (Play Store)
    UpdateController.init();

    // Initialize Native AdMob / AdController (Play Store)
    AdController.init();

    if (!GameState.settings.hasSeenRules) {
      TutorialController.open();
    }
  };

  if (TargetConfig.isCrazyGames) {
    // Remove the startup overlay immediately — no studio intro on CrazyGames
    const overlay = document.getElementById("startupOverlay");
    if (overlay) overlay.remove();
    applyTheme(GameState.getTheme(), true, false);
    afterIntro();
  } else {
    runStudioIntro(afterIntro);
  }

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
  // Consumer Campaign Level Launch Action (Resumes if in progress, else starts fresh)
  const launchConsumerLevel = (targetIdx = GameState.getSelectedCardLevelIndex()) => {
    GameState.setSelectedCardLevelIndex(targetIdx);
    if (GameState.hasActiveSessionFor(targetIdx)) {
      resumeLevelSession();
    } else {
      startLevel(targetIdx);
    }
  };

  ReviewManager.init();
  LevelSelectController.init({
    onLevelChosen: () => openHome(),
    onLaunchLevel: (idx) => launchConsumerLevel(idx)
  });
  window.AchievementsController = AchievementsController;
  window.LevelSelectController = LevelSelectController;
  window.DailyCalendarController = DailyCalendarController;
  window.UpdateController = UpdateController;
  window.AdController = AdController;
  window.ReviewManager = ReviewManager;

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

  if (DOM.consumerPlayBtn) DOM.consumerPlayBtn.addEventListener("click", () => launchConsumerLevel());
  if (DOM.consumerLevelSelectBtn) {
    DOM.consumerLevelSelectBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      AudioEngine.playNavBack();
      LevelSelectController.open();
    });
  }

  // In-Game navigation
  if (DOM.gameBackBtn) {
    DOM.gameBackBtn.addEventListener("click", () => {
      AudioEngine.playNavBack();
      if (GameState.customLevel && !GameState.customLevel.isDaily) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        showExitConfirm();
      }
    });
  }
  if (DOM.gamePauseBtn) DOM.gamePauseBtn.addEventListener("click", showPause);

  // Exit Confirmation Modal handlers
  if (DOM.exitConfirmResumeBtn) {
    DOM.exitConfirmResumeBtn.addEventListener("click", () => {
      AudioEngine.playTap();
      SceneRouter.popModal();
    });
  }
  if (DOM.exitConfirmLeaveBtn) {
    DOM.exitConfirmLeaveBtn.addEventListener("click", () => {
      AudioEngine.playNavBack();
      SceneRouter.popModal();
      openHome();
    });
  }
  if (DOM.exitConfirmModal) {
    DOM.exitConfirmModal.addEventListener("click", (e) => {
      if (e.target === DOM.exitConfirmModal) {
        AudioEngine.playTap();
        SceneRouter.popModal();
      }
    });
  }

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
      if (GameState.customLevel && !GameState.customLevel.isDaily) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        openHome();
      }
    });
  }

  if (DOM.winDailyPrevBtn) {
    DOM.winDailyPrevBtn.addEventListener("click", async () => {
      const targetDate = DOM.winDailyPrevBtn.dataset.dateKey;
      if (!targetDate || DOM.winDailyPrevBtn.disabled) return;
      ConfettiFX.stop();
      AudioEngine.playDailyStart();
      SceneRouter.popModal();
      await AdController.showPendingInterstitialIfNeeded();
      startDailyLevel(targetDate);
    });
  }

  if (DOM.winDailyNextBtn) {
    DOM.winDailyNextBtn.addEventListener("click", async () => {
      const targetDate = DOM.winDailyNextBtn.dataset.dateKey;
      if (!targetDate || DOM.winDailyNextBtn.disabled) return;
      ConfettiFX.stop();
      AudioEngine.playDailyStart();
      SceneRouter.popModal();
      await AdController.showPendingInterstitialIfNeeded();
      startDailyLevel(targetDate);
    });
  }

  if (DOM.winRestartBtn) {
    DOM.winRestartBtn.addEventListener("click", async () => {
      ConfettiFX.stop();
      AudioEngine.playRestart();
      const wasDaily = Boolean(GameState.customLevel?.isDaily);
      const dailyDateKey = GameState.customLevel?.dateKey;
      SceneRouter.popModal();
      await AdController.showPendingInterstitialIfNeeded();
      if (wasDaily && dailyDateKey) {
        startDailyLevel(dailyDateKey);
      } else {
        restart();
      }
    });
  }
  if (DOM.winNextBtn) DOM.winNextBtn.addEventListener("click", nextLevel);
  if (DOM.winHomeBtn) {
    DOM.winHomeBtn.addEventListener("click", async () => {
      ConfettiFX.stop();
      AudioEngine.playNavBack();
      const wasDaily = Boolean(GameState.customLevel?.isDaily);
      SceneRouter.popModal();
      await AdController.showPendingInterstitialIfNeeded();
      openHome();
      if (wasDaily && !GameState.settings.dailyReminders && !GameState.settings.hasPromptedDailyReminders) {
        setTimeout(() => {
          NotificationManager.showOptInPrompt();
        }, 400);
      }
    });
  }

  if (DOM.winShareBtn) {
    DOM.winShareBtn.addEventListener("click", () => {
      shareVictoryResult();
    });
  }

  // Desktop / Web Share Options Modal Listeners
  if (DOM.shareModalCloseBtn) {
    DOM.shareModalCloseBtn.addEventListener("click", () => {
      AudioEngine.playNavBack();
      SceneRouter.popModal();
    });
  }

async function copyImageBlobToClipboard(blob) {
  if (!blob) return false;
  if (typeof navigator !== "undefined" && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    try {
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      return true;
    } catch (_) {
      return false;
    }
  }
  return false;
}

  if (DOM.shareBtnX) {
    DOM.shareBtnX.addEventListener("click", async () => {
      if (!activeShareContext) return;
      AudioEngine.playLeap();
      if (activeShareContext.card?.blob) {
        await copyImageBlobToClipboard(activeShareContext.card.blob);
      }
      const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(activeShareContext.shareText)}`;
      PlatformBridge.openExternalUrl(xUrl);
      showToast("🐦 X (Twitter) opened — press Ctrl+V to attach card image!");
    });
  }

  if (DOM.shareBtnWhatsApp) {
    DOM.shareBtnWhatsApp.addEventListener("click", async () => {
      if (!activeShareContext) return;
      AudioEngine.playLeap();
      if (activeShareContext.card?.blob) {
        await copyImageBlobToClipboard(activeShareContext.card.blob);
      }
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(activeShareContext.shareText)}`;
      PlatformBridge.openExternalUrl(waUrl);
      showToast("💬 WhatsApp opened — press Ctrl+V to paste card image!");
    });
  }

  if (DOM.shareBtnEmail) {
    DOM.shareBtnEmail.addEventListener("click", async () => {
      if (!activeShareContext) return;
      AudioEngine.playLeap();
      if (activeShareContext.card?.blob) {
        await copyImageBlobToClipboard(activeShareContext.card.blob);
      }
      const formattedBody = (activeShareContext.shareText || "").replace(/\r?\n/g, "\r\n");
      const mailUrl = `mailto:?subject=${encodeURIComponent(activeShareContext.shareTitle)}&body=${encodeURIComponent(formattedBody)}`;
      PlatformBridge.openExternalUrl(mailUrl);
      showToast("✉️ Mail client opened — press Ctrl+V to paste card image!");
    });
  }

  if (DOM.shareBtnOpenImage) {
    DOM.shareBtnOpenImage.addEventListener("click", () => {
      if (!activeShareContext) return;
      AudioEngine.playLeap();
      if (activeShareContext.savedFilePath) {
        const tauriInvoke = window.__TAURI__?.core?.invoke || window.__TAURI_INTERNALS__?.invoke;
        if (typeof tauriInvoke === "function") {
          tauriInvoke("open_file_path", { path: activeShareContext.savedFilePath });
          showToast("📂 Opened saved card in viewer!");
          return;
        }
      }
      if (activeShareContext.card?.dataUrl) {
        PlatformBridge.openExternalUrl(activeShareContext.card.dataUrl);
      }
    });
  }

  if (DOM.shareCopyTextBtn) {
    DOM.shareCopyTextBtn.addEventListener("click", async () => {
      if (!activeShareContext) return;
      AudioEngine.playLeap();
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeShareContext.shareText).catch(() => {});
        showToast("📋 Score text copied to clipboard!");
      }
    });
  }

  if (DOM.shareCopyImageBtn) {
    DOM.shareCopyImageBtn.addEventListener("click", async () => {
      if (!activeShareContext?.card?.blob) return;
      AudioEngine.playLeap();
      if (typeof navigator !== "undefined" && navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
        try {
          const item = new ClipboardItem({ "image/png": activeShareContext.card.blob });
          await navigator.clipboard.write([item]);
          showToast("🖼️ Victory Card image copied to clipboard!");
        } catch (err) {
          showToast("⚠️ Image clipboard copy not supported by browser");
        }
      }
    });
  }

  if (DOM.outOfLivesWatchAdBtn) {
    DOM.outOfLivesWatchAdBtn.addEventListener("click", async () => {
      // 1. Request rewarded ad for life
      if ((TargetConfig.isPlayStore || TargetConfig.isCrazyGames) && !AdController.isPremiumUser()) {
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
  if (DOM.settingDailyReminders) {
    DOM.settingDailyReminders.checked = Boolean(GameState.settings.dailyReminders);
    DOM.settingDailyReminders.addEventListener("change", async (e) => {
      if (e.target.checked) {
        const isBlocked = await NotificationManager.isPermanentlyDenied();
        if (isBlocked) {
          DOM.settingDailyReminders.checked = false;
          GameState.settings.dailyReminders = false;
          GameState.save();
          NotificationManager.showBlockedModal();
          return;
        }

        const startTime = Date.now();
        const granted = await NotificationManager.requestPermissions();
        const elapsed = Date.now() - startTime;
        if (!granted) {
          DOM.settingDailyReminders.checked = false;
          GameState.settings.dailyReminders = false;
          GameState.save();
          const isNowBlocked = (await NotificationManager.isPermanentlyDenied()) || elapsed < 350;
          if (isNowBlocked) {
            NotificationManager.showBlockedModal();
          } else {
            showToast("Notifications not allowed in device settings");
          }
          return;
        }
        GameState.settings.dailyReminders = true;
        GameState.save();
        await NotificationManager.scheduleDailyReminder(true);
        showToast("Daily reminders active for 10:00 AM");
      } else {
        GameState.settings.dailyReminders = false;
        GameState.save();
        await NotificationManager.cancelDailyReminder();
        showToast("Daily reminders turned off");
      }
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
      if (GameState.customLevel?.isDaily) {
        navigateToAdjacentDaily(1);
        return;
      }
      if (SceneRouter.getCurrentScreen() === "screenEditor") {
        EditorController.stepForward();
      } else {
        devStepForward();
      }
    },
    onStepBackward: () => {
      if (GameState.customLevel?.isDaily) {
        navigateToAdjacentDaily(-1);
        return;
      }
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
    onShowExitConfirm: showExitConfirm,
    onShowLevelSelect: () => {
      if (SceneRouter.getCurrentScreen() === "screenHome") {
        LevelSelectController.open();
      } else if (GameState.customLevel && !GameState.customLevel.isDaily) {
        SceneRouter.navigateTo("screenEditor");
      } else {
        openHome();
      }
    },
    onNextLevel: nextLevel,
    onCloseRules: () => SceneRouter.popModal(),
    onHomePlay: () => {
      const targetIdx = GameState.getSelectedCardLevelIndex();
      if (GameState.hasActiveSessionFor(targetIdx)) {
        resumeLevelSession();
      } else {
        startLevel(targetIdx);
      }
    },
    onDailyPlay: () => startDailyLevel(),
    onOpenAchievements: () => AchievementsController.open(),
    onOpenCalendar: () => DailyCalendarController.open(),
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
      if (SceneRouter.getCurrentScreen() === "screenGame" && !SceneRouter.currentModal()) {
        AchievementManager.startPlayTimeTicker();
      }
      AdController.onResume();
      NotificationManager.syncReminders();
      NotificationManager.checkAndSyncOnResume();
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
        if (activeModal.name === "NOTIF_PROMPT") {
          NotificationManager.dismissOptInPrompt();
          return true;
        }
        if (activeModal.name === "NOTIF_BLOCKED") {
          SceneRouter.popModal();
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
      if (GameState.customLevel && !GameState.customLevel.isDaily && SceneRouter.getCurrentScreen() === "screenGame") {
        SceneRouter.navigateTo("screenEditor");
        return true;
      }
      // 3. If in active gameplay, Back opens exit confirmation modal
      if (SceneRouter.getCurrentScreen() === "screenGame") {
        showExitConfirm();
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

  // Initialize Notification Manager (Daily Challenge Reminders & Deep Linking)
  NotificationManager.init(() => {
    startDailyLevel();
  });

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

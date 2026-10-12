/**
 * Central Game State Machine
 */

import { StorageService } from "./persistence.js";
import { LEVELS } from "../data/levels.js";

const storage = new StorageService(LEVELS.length);

export const GameState = {
  // Session gameplay state
  levelIndex: 0,
  player: null,       // [r, c]
  moveCount: 0,
  history: [],        // stack of { player: [r,c], moveCount: number, lives: number }
  animating: false,
  legalDests: [],
  lives: 3,
  maxLives: 3,
  deadEndsEncountered: 0,
  hintsAvailable: 3,
  hintUsedThisLevel: false,

  // Developer state
  devModeEnabled: false,
  solutionPathVisible: false,

  // Persistent user state
  completed: new Array(LEVELS.length).fill(false),
  stars: new Array(LEVELS.length).fill(0),
  bestMoves: new Array(LEVELS.length).fill(null),
  settings: {
    theme: "vellum",
    hasSeenRules: false,
    devModeEnabled: false,
    soundEnabled: true,
    hapticsEnabled: true,
    dailyReminders: false,
    hasPromptedDailyReminders: false,
    hasRequestedReview: false,
    lastReviewTimestamp: 0,
    relaxMode: false,
    showTrail: false
  },

  // Active in-progress puzzle session (for CONTINUE vs PLAY)
  activeSession: null,

  init() {
    const saved = storage.load();
    const padArray = (arr, len, fillVal) => {
      if (!Array.isArray(arr)) return new Array(len).fill(fillVal);
      if (arr.length < len) {
        return [...arr, ...new Array(len - arr.length).fill(fillVal)];
      }
      return arr;
    };

    this.completed = padArray(saved.completed, LEVELS.length, false);
    this.stars = padArray(saved.stars, LEVELS.length, 0);
    this.bestMoves = padArray(saved.bestMoves, LEVELS.length, null);
    this.hintsAvailable = typeof saved.hintsAvailable === "number" ? Math.max(0, saved.hintsAvailable) : 3;
    this.activeSession = saved.activeSession || null;
    this.selectedCardLevelIndex = typeof saved.selectedCardLevelIndex === "number" ? saved.selectedCardLevelIndex : null;
    this.levelIndex = Math.min(Math.max(0, saved.lastPlayedLevel || 0), LEVELS.length - 1);
    this.settings = { ...this.settings, ...(saved.settings || {}) };
    this.devModeEnabled = Boolean(this.settings.devModeEnabled);
    this.resetLives();
  },

  resetToDefault() {
    this.levelIndex = 0;
    this.selectedCardLevelIndex = null;
    this.player = null;
    this.moveCount = 0;
    this.history = [];
    this.animating = false;
    this.legalDests = [];
    this.lives = 3;
    this.maxLives = 3;
    this.hintsAvailable = 3;
    this.deadEndsEncountered = 0;
    this.completed = new Array(LEVELS.length).fill(false);
    this.stars = new Array(LEVELS.length).fill(0);
    this.bestMoves = new Array(LEVELS.length).fill(null);
    this.activeSession = null;
    this.settings = {
      theme: "vellum",
      hasSeenRules: false,
      devModeEnabled: false,
      soundEnabled: true,
      hapticsEnabled: true,
      dailyReminders: false,
      hasPromptedDailyReminders: false,
      relaxMode: false,
      showTrail: false
    };
    this.devModeEnabled = false;
    storage.clear();
    this.save();
  },

  save() {
    storage.save({
      lastPlayedLevel: this.levelIndex,
      selectedCardLevelIndex: this.selectedCardLevelIndex,
      completed: this.completed,
      stars: this.stars,
      bestMoves: this.bestMoves,
      hintsAvailable: this.hintsAvailable,
      activeSession: this.activeSession,
      settings: {
        ...this.settings,
        devModeEnabled: this.devModeEnabled
      }
    });
  },

  saveSettings() {
    this.save();
  },

  saveCurrentSession() {
    if (!this.customLevel && this.moveCount > 0 && this.player && !this.completed[this.levelIndex]) {
      this.activeSession = {
        levelIndex: this.levelIndex,
        player: [this.player[0], this.player[1]],
        moveCount: this.moveCount,
        history: JSON.parse(JSON.stringify(this.history)),
        lives: this.lives
      };
    } else {
      this.activeSession = null;
    }
    this.save();
  },

  clearSession() {
    this.activeSession = null;
    this.save();
  },

  hasActiveSessionFor(idx) {
    return Boolean(this.activeSession && this.activeSession.levelIndex === idx && this.activeSession.moveCount > 0);
  },

  getTheme() {
    return this.settings.theme === "vellum" ? "vellum" : "obsidian";
  },

  setTheme(themeName) {
    this.settings.theme = (themeName === "vellum") ? "vellum" : "obsidian";
    this.save();
  },

  toggleTheme() {
    const next = this.getTheme() === "obsidian" ? "vellum" : "obsidian";
    this.setTheme(next);
    return next;
  },

  toggleTrail(explicitValue) {
    if (typeof explicitValue === "boolean") {
      this.settings.showTrail = explicitValue;
    } else {
      this.settings.showTrail = !this.settings.showTrail;
    }
    this.save();
    return this.settings.showTrail;
  },

  resetLives() {
    this.lives = this.maxLives;
    this.deadEndsEncountered = 0;
  },

  loseLife() {
    if (this.settings.relaxMode) return this.lives;
    this.deadEndsEncountered++;
    this.lives = Math.max(0, this.lives - 1);
    return this.lives;
  },

  addLife(count = 1) {
    this.lives = Math.min(this.maxLives, Math.max(1, this.lives + count));
    return this.lives;
  },

  getHintsCount() {
    return this.hintsAvailable;
  },

  useHint() {
    if (this.hintsAvailable > 0) {
      this.hintsAvailable--;
      this.save();
      return true;
    }
    return false;
  },

  addHints(count = 1) {
    this.hintsAvailable = Math.max(0, this.hintsAvailable + count);
    this.save();
    return this.hintsAvailable;
  },

  calculateStarsEarned(levelIndex, moveCount, livesRemaining = this.lives) {
    const lv = this.customLevel || LEVELS[levelIndex];
    if (!lv) return 1;
    const optimal = lv.optimal || 1;
    let earned = 1; // 1 star for clearing the level
    if (moveCount <= optimal + 2) earned = 2; // Near-optimal efficiency
    if (moveCount <= optimal && (this.settings.relaxMode || livesRemaining >= this.maxLives)) earned = 3; // Flawless mastery
    return earned;
  },

  recordLevelResult(idx, moveCount, starsEarned) {
    if (idx >= 0 && idx < this.completed.length) {
      const isReplay = Boolean(this.completed[idx]);
      this.completed[idx] = true;
      const prevBest = this.bestMoves[idx];
      const isNewBest = (prevBest === null || moveCount < prevBest);
      const isImprovedReplay = Boolean(isReplay && prevBest !== null && moveCount < prevBest);
      if (isNewBest) {
        this.bestMoves[idx] = moveCount;
      }

      const stars = (typeof starsEarned === "number")
        ? starsEarned
        : this.calculateStarsEarned(idx, moveCount, this.lives);
      this.stars[idx] = Math.max(this.stars[idx] || 0, stars);

      if (this.activeSession?.levelIndex === idx) {
        this.activeSession = null;
      }

      // Automatically advance selected card level if cleared level was the active selection
      if (this.selectedCardLevelIndex === null || this.selectedCardLevelIndex === idx) {
        this.selectedCardLevelIndex = Math.min(idx + 1, LEVELS.length - 1);
        this.levelIndex = this.selectedCardLevelIndex;
      }

      this.save();
      return { isNewBest, isImprovedReplay, stars, prevBest };
    }
    return { isNewBest: false, isImprovedReplay: false, stars: 1, prevBest: null };
  },

  getTotalStars() {
    return this.stars.reduce((sum, s) => sum + (s || 0), 0);
  },

  customLevel: null,

  getMaxUnlockedLevelIndex() {
    const firstUnfinished = this.completed.findIndex(done => !done);
    return firstUnfinished !== -1 ? firstUnfinished : LEVELS.length - 1;
  },

  getSelectedCardLevelIndex() {
    const maxIndex = LEVELS.length - 1;
    if (typeof this.selectedCardLevelIndex === "number") {
      return Math.max(0, Math.min(this.selectedCardLevelIndex, maxIndex));
    }
    const candidate = typeof this.levelIndex === "number" ? this.levelIndex : 0;
    return Math.max(0, Math.min(candidate, maxIndex));
  },

  setSelectedCardLevelIndex(idx) {
    const maxIndex = LEVELS.length - 1;
    this.selectedCardLevelIndex = Math.max(0, Math.min(idx, maxIndex));
    this.levelIndex = this.selectedCardLevelIndex;
    this.save();
    return this.selectedCardLevelIndex;
  },

  getNextUncompletedLevelIndex() {
    const firstUnfinished = this.completed.findIndex(done => !done);
    if (firstUnfinished !== -1) return firstUnfinished;
    return 0;
  },

  currentLevel() {
    return this.customLevel || LEVELS[this.levelIndex];
  }
};

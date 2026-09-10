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
    relaxMode: false,
    showTrail: false
  },

  // Active in-progress puzzle session (for CONTINUE vs PLAY)
  activeSession: null,

  init() {
    const saved = storage.load();
    this.completed = saved.completed || new Array(LEVELS.length).fill(false);
    this.stars = saved.stars || new Array(LEVELS.length).fill(0);
    this.bestMoves = saved.bestMoves || new Array(LEVELS.length).fill(null);
    this.activeSession = saved.activeSession || null;
    this.levelIndex = Math.min(Math.max(0, saved.lastPlayedLevel || 0), LEVELS.length - 1);
    this.settings = { ...this.settings, ...(saved.settings || {}) };
    this.devModeEnabled = Boolean(this.settings.devModeEnabled);
    this.resetLives();
  },

  save() {
    storage.save({
      lastPlayedLevel: this.levelIndex,
      completed: this.completed,
      stars: this.stars,
      bestMoves: this.bestMoves,
      activeSession: this.activeSession,
      settings: {
        ...this.settings,
        devModeEnabled: this.devModeEnabled
      }
    });
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

  recordLevelResult(idx, moveCount) {
    if (idx >= 0 && idx < this.completed.length) {
      this.completed[idx] = true;
      if (this.bestMoves[idx] === null || moveCount < this.bestMoves[idx]) {
        this.bestMoves[idx] = moveCount;
      }
      if (this.activeSession?.levelIndex === idx) {
        this.activeSession = null;
      }
      this.save();
    }
  },

  customLevel: null,

  getNextUncompletedLevelIndex() {
    const firstUnfinished = this.completed.findIndex(done => !done);
    if (firstUnfinished !== -1) return firstUnfinished;
    return 0;
  },

  currentLevel() {
    return this.customLevel || LEVELS[this.levelIndex];
  }
};

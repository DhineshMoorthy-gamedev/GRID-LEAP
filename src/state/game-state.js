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
    hasSeenRules: false,
    devModeEnabled: false,
    soundEnabled: true,
    hapticsEnabled: true,
    relaxMode: false
  },

  init() {
    const saved = storage.load();
    this.completed = saved.completed || new Array(LEVELS.length).fill(false);
    this.stars = saved.stars || new Array(LEVELS.length).fill(0);
    this.bestMoves = saved.bestMoves || new Array(LEVELS.length).fill(null);
    this.levelIndex = Math.min(Math.max(0, saved.lastPlayedLevel || 0), LEVELS.length - 1);
    this.settings = saved.settings || this.settings;
    this.devModeEnabled = Boolean(this.settings.devModeEnabled);
    this.resetLives();
  },

  save() {
    storage.save({
      lastPlayedLevel: this.levelIndex,
      completed: this.completed,
      stars: this.stars,
      bestMoves: this.bestMoves,
      settings: {
        ...this.settings,
        devModeEnabled: this.devModeEnabled
      }
    });
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
      this.save();
    }
  },

  customLevel: null,

  currentLevel() {
    return this.customLevel || LEVELS[this.levelIndex];
  }
};

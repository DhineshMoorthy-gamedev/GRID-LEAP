/**
 * Daily Challenge State & Persistence Manager
 * Handles online verification, local streak calculation, and daily puzzle session tracking.
 */

import { getTodayDateKey } from "../core/daily-seed.js";
import { generateDailyLevel } from "../core/daily-generator.js";

const STORAGE_KEY = "grid_leap_daily_save_v1";

export const DailyManager = {
  data: {
    currentStreak: 0,
    maxStreak: 0,
    lastCompletedDate: null,
    history: {} // [dateKey]: { completed: boolean, moves: number, optimal: number, timestamp: number }
  },

  activeLevel: null,

  init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = {
          currentStreak: parsed.currentStreak || 0,
          maxStreak: parsed.maxStreak || 0,
          lastCompletedDate: parsed.lastCompletedDate || null,
          history: parsed.history || {}
        };
      }
    } catch (e) {
      console.warn("[DailyManager] Failed to load daily storage:", e);
    }
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("[DailyManager] Failed to save daily storage:", e);
    }
  },

  /**
   * Check if device is online
   */
  isOnline() {
    return typeof navigator !== "undefined" && navigator.onLine !== false;
  },

  /**
   * Checks if today's challenge is completed
   */
  isTodayCompleted() {
    const today = getTodayDateKey();
    return Boolean(this.data.history[today]?.completed);
  },

  /**
   * Gets today's puzzle level object
   */
  getTodayLevel() {
    const today = getTodayDateKey();
    if (!this.activeLevel || this.activeLevel.dateKey !== today) {
      this.activeLevel = generateDailyLevel(today);
    }
    return this.activeLevel;
  },

  /**
   * Record completion of daily puzzle and compute streak
   */
  recordCompletion(moveCount, optimal) {
    const today = getTodayDateKey();
    const alreadyCompleted = this.data.history[today]?.completed;

    if (!alreadyCompleted) {
      // Calculate streak
      const lastDate = this.data.lastCompletedDate;
      const yesterday = this.getYesterdayDateKey();

      if (lastDate === yesterday) {
        this.data.currentStreak += 1;
      } else if (lastDate === today) {
        // Already recorded today
      } else {
        // Missed one or more days, reset streak to 1
        this.data.currentStreak = 1;
      }

      if (this.data.currentStreak > this.data.maxStreak) {
        this.data.maxStreak = this.data.currentStreak;
      }

      this.data.lastCompletedDate = today;
    }

    this.data.history[today] = {
      completed: true,
      moves: moveCount,
      optimal,
      timestamp: Date.now()
    };

    this.save();
    return {
      streak: this.data.currentStreak,
      maxStreak: this.data.maxStreak,
      isNewStreak: !alreadyCompleted
    };
  },

  getYesterdayDateKey() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  },

  /**
   * Get formatted time remaining until next UTC midnight reset
   */
  getTimeUntilNextReset() {
    const now = new Date();
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
    const diffMs = Math.max(0, tomorrow.getTime() - now.getTime());
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
};

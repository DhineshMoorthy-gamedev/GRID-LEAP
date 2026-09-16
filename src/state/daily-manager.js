/**
 * Daily Challenge State & Persistence Manager
 * Handles online verification, local streak calculation, archive history,
 * and deterministic past/present daily puzzle sessions from launch date.
 */

import { getTodayDateKey } from "../core/daily-seed.js";
import { generateDailyLevel } from "../core/daily-generator.js";

const STORAGE_KEY = "grid_leap_daily_save_v1";
export const LAUNCH_DATE_KEY = "2026-09-16"; // Official Launch Date Floor

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

  reset() {
    this.data = {
      currentStreak: 0,
      maxStreak: 0,
      lastCompletedDate: null,
      history: {}
    };
    this.activeLevel = null;
    this.save();
  },

  /**
   * Check if device is online
   */
  isOnline() {
    return typeof navigator !== "undefined" && navigator.onLine !== false;
  },

  getLaunchDateKey() {
    return LAUNCH_DATE_KEY;
  },

  getTodayDateKey() {
    return getTodayDateKey();
  },

  /**
   * Checks if a given date is before official launch
   */
  isBeforeLaunch(dateKey) {
    return dateKey < LAUNCH_DATE_KEY;
  },

  /**
   * Checks if a given date is in the future relative to today
   */
  isFutureDate(dateKey) {
    return dateKey > getTodayDateKey();
  },

  /**
   * Checks if today's challenge is completed
   */
  isTodayCompleted() {
    const today = getTodayDateKey();
    return Boolean(this.data.history[today]?.completed);
  },

  /**
   * Checks if a specific date's challenge is completed
   */
  isDateCompleted(dateKey) {
    return Boolean(this.data.history[dateKey]?.completed);
  },

  /**
   * Gets completion record for a specific date
   */
  getDateRecord(dateKey) {
    return this.data.history[dateKey] || null;
  },

  /**
   * Total completed daily challenges (all-time archive)
   */
  getTotalCompletedCount() {
    return Object.values(this.data.history).filter(h => h && h.completed).length;
  },

  /**
   * Gets today's puzzle level object
   */
  getTodayLevel() {
    const today = getTodayDateKey();
    return this.getLevelForDate(today);
  },

  /**
   * Deterministically gets or generates a level for any dateKey
   */
  getLevelForDate(dateKey) {
    if (!this.activeLevel || this.activeLevel.dateKey !== dateKey) {
      this.activeLevel = generateDailyLevel(dateKey);
    }
    return this.activeLevel;
  },

  /**
   * Record completion of any daily puzzle (today or past archive)
   */
  recordDateCompletion(dateKey, moveCount, optimal) {
    const today = getTodayDateKey();
    const isToday = (dateKey === today);
    const alreadyCompleted = this.data.history[dateKey]?.completed;

    if (isToday && !alreadyCompleted) {
      // Calculate active live streak
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

    // Save record for this date
    this.data.history[dateKey] = {
      completed: true,
      moves: moveCount,
      optimal,
      timestamp: Date.now()
    };

    this.save();

    return {
      dateKey,
      isToday,
      streak: this.data.currentStreak,
      maxStreak: this.data.maxStreak,
      isNewStreak: isToday && !alreadyCompleted,
      totalCompleted: this.getTotalCompletedCount()
    };
  },

  // Backward compatibility alias
  recordCompletion(moveCount, optimal) {
    return this.recordDateCompletion(getTodayDateKey(), moveCount, optimal);
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
  },

  /**
   * Returns structured month data for calendar rendering
   */
  getMonthGridData(year, month) {
    // month is 0-indexed (0 = Jan, 8 = Sep, 11 = Dec)
    const firstDay = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const startWeekday = firstDay.getUTCDay(); // 0 = Sunday

    const todayKey = getTodayDateKey();
    const days = [];

    let completedInMonth = 0;
    let availableInMonth = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isBefore = this.isBeforeLaunch(dateKey);
      const isFuture = this.isFutureDate(dateKey);
      const isToday = (dateKey === todayKey);
      const isPlayable = !isBefore && !isFuture;
      const record = this.getDateRecord(dateKey);
      const isCompleted = Boolean(record?.completed);

      if (isPlayable) availableInMonth++;
      if (isCompleted) completedInMonth++;

      days.push({
        dayNum: d,
        dateKey,
        isBeforeLaunch: isBefore,
        isFuture,
        isToday,
        isPlayable,
        isCompleted,
        record
      });
    }

    return {
      year,
      month,
      startWeekday,
      daysInMonth,
      days,
      completedInMonth,
      availableInMonth,
      totalAllTimeCompleted: this.getTotalCompletedCount()
    };
  }
};

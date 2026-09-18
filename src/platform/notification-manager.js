/**
 * Grid Leap — Notification Manager
 * Handles local push notifications for Daily Challenge reminders.
 * Provides offline native scheduling (Capacitor/Android), Web Notification fallback,
 * smart auto-suppression upon completion, and direct deep linking into daily puzzles.
 */

import { LocalNotifications } from "@capacitor/local-notifications";
import { PlatformBridge } from "./lifecycle.js";
import { GameState } from "../state/game-state.js";
import { DailyManager } from "../state/daily-manager.js";
import { SceneRouter } from "../scenes/scene-router.js";
import { AudioEngine } from "../audio/audio-engine.js";

const DAILY_REMINDER_ID = 1001;
const CHANNEL_ID = "grid_leap_daily_channel";
const DEFAULT_REMINDER_HOUR = 10; // 10:00 AM

export const NotificationManager = {
  _initialized: false,
  _onDailyActionCallback: null,

  /**
   * Initializes notification channels, action listeners, prompt modal buttons, and syncs reminders.
   * @param {Function} onDailyAction Callback when user taps a daily challenge notification.
   */
  async init(onDailyAction = null) {
    if (onDailyAction) {
      this._onDailyActionCallback = onDailyAction;
    }

    if (this._initialized) {
      await this.syncReminders();
      return;
    }

    this._bindPromptModal();

    if (PlatformBridge.isCapacitor()) {
      try {
        // Create high-importance Android Notification Channel
        await LocalNotifications.createChannel({
          id: CHANNEL_ID,
          name: "Daily Challenge Reminders",
          description: "Reminders when a new daily logic maze puzzle is ready to play",
          importance: 4, // High importance (heads-up notification)
          visibility: 1, // Public on lockscreen
          vibration: true,
          lights: true,
          lightColor: "#10B981"
        });

        // Listen for notification taps
        LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
          const route = action?.notification?.extra?.route;
          if (route === "daily" && typeof this._onDailyActionCallback === "function") {
            this._onDailyActionCallback();
          }
        });

        this._initialized = true;
      } catch (e) {
        console.warn("[NotificationManager] Init error:", e);
      }
    } else {
      this._initialized = true;
    }

    await this.syncReminders();
  },

  _bindPromptModal() {
    const modal = document.getElementById("notificationPromptModal");
    const closeX = document.getElementById("notifPromptCloseX");
    const laterBtn = document.getElementById("notifPromptLaterBtn");
    const enableBtn = document.getElementById("notifPromptEnableBtn");

    if (closeX) {
      closeX.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.dismissOptInPrompt();
      });
    }

    if (laterBtn) {
      laterBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.dismissOptInPrompt();
      });
    }

    if (enableBtn) {
      enableBtn.addEventListener("click", async () => {
        AudioEngine.playNavBack();
        await this.enableFromPrompt();
      });
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          AudioEngine.playNavBack();
          this.dismissOptInPrompt();
        }
      });
    }
  },

  /**
   * Shows opt-in modal after winning a daily challenge if player hasn't decided yet
   */
  showOptInPrompt() {
    if (GameState.settings.dailyReminders || GameState.settings.hasPromptedDailyReminders) {
      return;
    }
    SceneRouter.pushModal("NOTIF_PROMPT");
  },

  async enableFromPrompt() {
    GameState.settings.hasPromptedDailyReminders = true;
    const granted = await this.requestPermissions();
    if (granted) {
      GameState.settings.dailyReminders = true;
      const toggle = document.getElementById("settingDailyReminders");
      if (toggle) toggle.checked = true;
      await this.scheduleDailyReminder(true);
    } else {
      GameState.settings.dailyReminders = false;
      const toggle = document.getElementById("settingDailyReminders");
      if (toggle) toggle.checked = false;
    }
    GameState.save();
    SceneRouter.popModal();
  },

  dismissOptInPrompt() {
    GameState.settings.hasPromptedDailyReminders = true;
    GameState.save();
    SceneRouter.popModal();
  },

  /**
   * Checks current notification permissions
   */
  async checkPermissions() {
    if (PlatformBridge.isCapacitor()) {
      try {
        const res = await LocalNotifications.checkPermissions();
        return res?.display === "granted";
      } catch (e) {
        console.warn("[NotificationManager] checkPermissions error:", e);
        return false;
      }
    } else if (typeof Notification !== "undefined") {
      return Notification.permission === "granted";
    }
    return false;
  },

  /**
   * Requests standard display notification permissions from the OS/Browser
   * Explicitly requests 'display' only to avoid triggering Alarms & Reminders special screen
   */
  async requestPermissions() {
    if (PlatformBridge.isCapacitor()) {
      try {
        const res = await LocalNotifications.requestPermissions({
          permissions: ["display"]
        });
        return res?.display === "granted";
      } catch (e) {
        console.warn("[NotificationManager] requestPermissions error:", e);
        return false;
      }
    } else if (typeof Notification !== "undefined") {
      try {
        const res = await Notification.requestPermission();
        return res === "granted";
      } catch (e) {
        console.warn("[NotificationManager] web requestPermission error:", e);
        return false;
      }
    }
    return false;
  },

  /**
   * Schedules or updates the offline local daily challenge reminder.
   * @param {boolean} forceTomorrow If true, targets tomorrow regardless of current time.
   */
  async scheduleDailyReminder(forceTomorrow = false) {
    const isEnabled = Boolean(GameState.settings.dailyReminders);
    if (!isEnabled) {
      await this.cancelDailyReminder();
      return;
    }

    if (!PlatformBridge.isCapacitor()) {
      return;
    }

    try {
      const isGranted = await this.checkPermissions();
      if (!isGranted) {
        return;
      }

      // Calculate target time: 10:00 AM local time
      const now = new Date();
      const target = new Date();
      target.setHours(DEFAULT_REMINDER_HOUR, 0, 0, 0);

      const isTodayDone = DailyManager.isTodayCompleted();

      // If 10 AM has passed today, or forceTomorrow is true, or today's puzzle is already completed
      if (now.getTime() >= target.getTime() || forceTomorrow || isTodayDone) {
        target.setDate(target.getDate() + 1);
      }

      // Cancel previous scheduled reminder
      await this.cancelDailyReminder();

      // Schedule new notification
      await LocalNotifications.schedule({
        notifications: [
          {
            id: DAILY_REMINDER_ID,
            title: "Daily Challenge Ready",
            body: "Today's logic grid puzzle is waiting. Keep your streak alive!",
            schedule: {
              at: target,
              allowWhileIdle: true
            },
            isExactNotification: false,
            isExactMandatory: false,
            channelId: CHANNEL_ID,
            smallIcon: "ic_stat_icon",
            iconColor: "#10B981",
            extra: {
              route: "daily"
            }
          }
        ]
      });
    } catch (e) {
      console.warn("[NotificationManager] scheduleDailyReminder error:", e);
    }
  },

  /**
   * Cancels any pending daily reminder notification.
   */
  async cancelDailyReminder() {
    if (!PlatformBridge.isCapacitor()) return;
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: DAILY_REMINDER_ID }]
      });
    } catch (e) {
      console.warn("[NotificationManager] cancelDailyReminder error:", e);
    }
  },

  /**
   * Smart Auto-Suppression: Called whenever player solves today's challenge.
   * Immediately cancels today's alert and queues tomorrow's reminder.
   */
  async onDailyPuzzleCompleted() {
    if (GameState.settings.dailyReminders) {
      await this.scheduleDailyReminder(true);
    }
  },

  /**
   * Synchronizes reminders with current game and completion state.
   */
  async syncReminders() {
    if (GameState.settings.dailyReminders) {
      await this.scheduleDailyReminder();
    } else {
      await this.cancelDailyReminder();
    }
  }
};

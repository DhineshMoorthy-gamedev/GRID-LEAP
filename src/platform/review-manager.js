/**
 * In-App Rating & Review Manager
 * Handles Google Play In-App Review integration via @capacitor-community/in-app-review.
 */

import { InAppReview } from "@capacitor-community/in-app-review";
import { TargetConfig } from "./target-config.js";
import { GameState } from "../state/game-state.js";
import { showToast } from "../scenes/game-renderer.js";

const PLAY_STORE_PACKAGE_ID = "com.olaidigitalstudios.gridleap";
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${PLAY_STORE_PACKAGE_ID}`;
const MILESTONE_LEVEL_INDEX = 9; // Level 10 (0-indexed 9)

class ReviewManagerClass {
  constructor() {
    this._isInitialized = false;
  }

  init() {
    this._isInitialized = true;
  }

  isOnline() {
    return typeof navigator === "undefined" || navigator.onLine !== false;
  }

  /**
   * Check whether the player reached the Level 10 milestone (or subsequent level if previously offline).
   * Non-blocking and guaranteed safe against ad collisions and offline states.
   */
  async checkLevelMilestone(levelIndex) {
    // Only trigger for Level 10 (index 9) or higher
    if (typeof levelIndex !== "number" || levelIndex < MILESTONE_LEVEL_INDEX) {
      return;
    }

    // Check if player has already been prompted
    if (GameState.settings.hasRequestedReview) {
      return;
    }

    // Offline check: If offline, defer the prompt to the next level they finish while online
    if (!this.isOnline()) {
      console.log("[ReviewManager] Player is offline. Deferring In-App Review milestone.");
      return;
    }

    // Delay 500ms so screen transition or ad dismiss finishes smoothly
    setTimeout(() => {
      this._triggerMilestoneReview();
    }, 500);
  }

  async _triggerMilestoneReview() {
    if (GameState.settings.hasRequestedReview) return;

    // Mark as requested immediately to prevent duplicate triggers
    GameState.settings.hasRequestedReview = true;
    GameState.settings.lastReviewTimestamp = Date.now();
    GameState.saveSettings();

    console.log("[ReviewManager] Triggering milestone In-App Review...");

    if (TargetConfig.isPlayStore && typeof InAppReview !== "undefined") {
      try {
        await InAppReview.requestReview();
        console.log("[ReviewManager] InAppReview.requestReview() completed successfully.");
      } catch (err) {
        console.warn("[ReviewManager] InAppReview.requestReview() error:", err);
      }
    } else {
      console.log("[ReviewManager] (Web/Dev mode) Milestone In-App Review simulated.");
    }
  }

  /**
   * Manual Review request triggered from Settings > "Rate Grid Leap"
   */
  async requestManualReview() {
    if (!this.isOnline()) {
      showToast("⚠️ Internet connection required to rate the app");
      return;
    }

    if (TargetConfig.isPlayStore && typeof InAppReview !== "undefined") {
      try {
        await InAppReview.requestReview();
      } catch (err) {
        console.warn("[ReviewManager] Manual review request fallback to URL:", err);
        this._openStoreUrl();
      }
    } else {
      this._openStoreUrl();
    }
  }

  _openStoreUrl() {
    try {
      window.open(PLAY_STORE_URL, "_blank");
    } catch (_) {}
  }
}

export const ReviewManager = new ReviewManagerClass();

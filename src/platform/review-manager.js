/**
 * In-App Rating & Review Manager
 * Handles Google Play In-App Review integration via @capacitor-community/in-app-review.
 */

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
   * Manual Review request triggered from Settings > "Rate"
   */
  async requestManualReview() {
    if (!this.isOnline()) {
      showToast("⚠️ Internet connection required to rate the app");
      return;
    }

    const inAppReviewPlugin = window.Capacitor?.Plugins?.InAppReview;
    if (TargetConfig.isPlayStore && inAppReviewPlugin?.requestReview) {
      try {
        await inAppReviewPlugin.requestReview();
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
      if (TargetConfig.isFdroid) {
        window.open("https://f-droid.org/packages/com.olaidigitalstudios.gridleap", "_blank");
      } else {
        window.open(PLAY_STORE_URL, "_blank");
      }
    } catch (_) {}
  }
}

export const ReviewManager = new ReviewManagerClass();

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
   * Manual Review request triggered from Settings > "Rate"
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

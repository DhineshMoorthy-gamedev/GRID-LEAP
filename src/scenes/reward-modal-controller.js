/**
 * Dedicated Reward Granted Success Modal Controller
 * Displays clean celebratory modal when rewarded ads complete (Hints / Lives).
 */

import { SceneRouter } from "./scene-router.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { PlatformBridge } from "../platform/lifecycle.js";

let onDismissCallback = null;

export const RewardModalController = {
  dom: {},

  ensureDom() {
    if (!this.dom.modal) {
      this.dom = {
        modal: document.getElementById("rewardModal"),
        iconDisc: document.getElementById("rewardIconDisc"),
        eyebrow: document.getElementById("rewardEyebrow"),
        title: document.getElementById("rewardTitle"),
        desc: document.getElementById("rewardDesc"),
        continueBtn: document.getElementById("rewardContinueBtn")
      };

      if (this.dom.continueBtn) {
        this.dom.continueBtn.addEventListener("click", () => this.close());
      }

      if (this.dom.modal) {
        this.dom.modal.addEventListener("click", (e) => {
          if (e.target === this.dom.modal) {
            this.close();
          }
        });
      }
    }
  },

  init() {
    this.ensureDom();
  },

  /**
   * Open the reward success modal.
   * @param {Object} options
   * @param {'hint'|'life'} options.type
   * @param {string} [options.title]
   * @param {string} [options.desc]
   * @param {Function} [options.onDismiss]
   */
  open({ type = "hint", title, desc, onDismiss = null } = {}) {
    this.ensureDom();
    onDismissCallback = onDismiss;

    if (type === "life") {
      if (this.dom.eyebrow) this.dom.eyebrow.textContent = "EXTRA LIFE";
      if (this.dom.title) this.dom.title.textContent = title || "+1 Life Added!";
      if (this.dom.desc) this.dom.desc.textContent = desc || "Added to your level.";
      if (this.dom.iconDisc) {
        this.dom.iconDisc.style.background = "rgba(16, 185, 129, 0.12)";
        this.dom.iconDisc.style.borderColor = "rgba(16, 185, 129, 0.35)";
        this.dom.iconDisc.innerHTML = `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#10B981" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(16,185,129,0.5));">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        `;
      }
    } else {
      // Hint
      if (this.dom.eyebrow) this.dom.eyebrow.textContent = "HINT EARNED";
      if (this.dom.title) this.dom.title.textContent = title || "+1 Hint Added!";
      if (this.dom.desc) this.dom.desc.textContent = desc || "Added to your hint inventory.";
      if (this.dom.iconDisc) {
        this.dom.iconDisc.style.background = "rgba(16, 185, 129, 0.12)";
        this.dom.iconDisc.style.borderColor = "rgba(16, 185, 129, 0.35)";
        this.dom.iconDisc.innerHTML = `
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(16,185,129,0.5));">
            <path d="M9 18h6"></path>
            <path d="M10 22h4"></path>
            <path d="M15.09 13.72A6 6 0 1 0 8.91 13.72 M12 2v2"></path>
          </svg>
        `;
      }
    }

    PlatformBridge.vibrateSuccess();
    AudioEngine.playLifeGranted?.();
    SceneRouter.pushModal("REWARD");
  },

  close() {
    if (SceneRouter.isModalOpen("REWARD")) {
      AudioEngine.playNavBack();
      SceneRouter.popModal();
      if (typeof onDismissCallback === "function") {
        const cb = onDismissCallback;
        onDismissCallback = null;
        cb();
      }
    }
  }
};

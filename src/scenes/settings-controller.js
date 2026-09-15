/**
 * Dedicated Full-Screen Settings Controller
 * Handles subview switching (main, privacy, about),
 * platform-specific gating (Remove Ads IAP on Play Store only),
 * and safe-area / modal navigation coordination.
 */

import { SceneRouter } from "./scene-router.js";
import { TargetConfig } from "../platform/target-config.js";
import { showToast } from "./game-renderer.js";
import { AudioEngine } from "../audio/audio-engine.js";

export const SettingsController = {
  dom: {},
  currentView: "main",

  init() {
    this.dom = {
      modal: document.getElementById("settingsModal"),
      closeBtn: document.getElementById("settingsCloseBtn"),
      btnOpenPrivacy: document.getElementById("btnOpenPrivacy"),
      btnOpenAbout: document.getElementById("btnOpenAbout"),
      privacyBackBtn: document.getElementById("privacyBackBtn"),
      aboutBackBtn: document.getElementById("aboutBackBtn"),
      btnRemoveAds: document.getElementById("btnRemoveAds"),
      sectionIAP: document.getElementById("settingsSectionIAP"),
      sectionDev: document.getElementById("settingsSectionDev")
    };

    // Platform Gating: Remove Ads IAP visible ONLY on Play Store
    if (this.dom.sectionIAP) {
      this.dom.sectionIAP.style.display = TargetConfig.isPlayStore ? "block" : "none";
    }

    // Platform Gating: Dev tools visible only in Editor mode
    if (this.dom.sectionDev) {
      this.dom.sectionDev.style.display = TargetConfig.features.editorSettings ? "block" : "none";
    }

    // Subview Navigation Listeners
    if (this.dom.closeBtn) {
      this.dom.closeBtn.addEventListener("click", () => this.close());
    }

    if (this.dom.btnOpenPrivacy) {
      this.dom.btnOpenPrivacy.addEventListener("click", () => this.setView("privacy"));
    }

    if (this.dom.btnOpenAbout) {
      this.dom.btnOpenAbout.addEventListener("click", () => this.setView("about"));
    }

    if (this.dom.privacyBackBtn) {
      this.dom.privacyBackBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.setView("main");
      });
    }

    if (this.dom.aboutBackBtn) {
      this.dom.aboutBackBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.setView("main");
      });
    }

    // In-App Purchase Action
    if (this.dom.btnRemoveAds) {
      this.dom.btnRemoveAds.addEventListener("click", () => {
        // Google Play Billing hook
        showToast("Google Play Billing: Remove Ads");
      });
    }
  },

  setView(viewName) {
    this.currentView = viewName;
    if (this.dom.modal) {
      this.dom.modal.dataset.view = viewName;
    }
    // Scroll content to top on view change
    const scrollAreas = this.dom.modal?.querySelectorAll(".settings-scroll-area");
    if (scrollAreas) {
      scrollAreas.forEach(area => {
        area.scrollTop = 0;
      });
    }
  },

  open() {
    this.setView("main");
    SceneRouter.pushModal("SETTINGS");
  },

  close() {
    this.setView("main");
    SceneRouter.popModal();
  },

  back() {
    if (this.currentView !== "main") {
      this.setView("main");
      return true;
    }
    this.close();
    return true;
  }
};

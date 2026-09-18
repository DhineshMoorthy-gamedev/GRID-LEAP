/**
 * Dedicated Full-Screen Settings Controller
 * Handles subview switching (main, privacy, about),
 * platform-specific gating (Remove Ads IAP on Play Store only),
 * and safe-area / modal navigation coordination.
 */

import { SceneRouter } from "./scene-router.js";
import { TargetConfig } from "../platform/target-config.js";
import { PlatformBridge } from "../platform/lifecycle.js";
import { showToast, updateHintBadge } from "./game-renderer.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { UpdateController } from "./update-controller.js";
import { AdController } from "./ad-controller.js";
import { NotificationManager } from "../platform/notification-manager.js";
import { ReviewManager } from "../platform/review-manager.js";
import { GameState } from "../state/game-state.js";

export const SettingsController = {
  dom: {},
  currentView: "main",
  versionName: "0.0.15",

  init() {
    this.dom = {
      modal: document.getElementById("settingsModal"),
      closeBtn: document.getElementById("settingsCloseBtn"),
      btnRateApp: document.getElementById("btnRateApp"),
      btnContactUs: document.getElementById("btnContactUs"),
      btnFeedback: document.getElementById("btnFeedback"),
      btnOpenPrivacy: document.getElementById("btnOpenPrivacy"),
      btnOpenAbout: document.getElementById("btnOpenAbout"),
      privacyBackBtn: document.getElementById("privacyBackBtn"),
      aboutBackBtn: document.getElementById("aboutBackBtn"),
      btnRemoveAds: document.getElementById("btnRemoveAds"),
      sectionIAP: document.getElementById("settingsSectionIAP"),
      sectionDev: document.getElementById("settingsSectionDev"),
      rowHaptics: document.getElementById("settingRowHaptics"),
      hapticsUnavailablePill: document.getElementById("hapticsUnavailablePill"),
      settingHaptics: document.getElementById("settingHaptics"),
      settingDailyReminders: document.getElementById("settingDailyReminders")
    };

    // Dynamic Version Sync across About pill and Settings footer
    PlatformBridge.getAppVersion().then(ver => {
      this.versionName = ver.versionName || "0.0.15";
      const versionPill = document.querySelector(".about-version-pill");
      if (versionPill) versionPill.textContent = `v${this.versionName}`;
      const footerNote = document.querySelector(".settings-footer-note");
      if (footerNote) footerNote.textContent = `GRID LEAP • v${this.versionName} • OLAI DIGITAL STUDIOS`;
    });

    // Strategic Dimming: If haptics is unsupported on this device/browser
    const hapticsAvailable = PlatformBridge.isHapticsSupported();
    if (!hapticsAvailable) {
      if (this.dom.rowHaptics) this.dom.rowHaptics.classList.add("disabled");
      if (this.dom.hapticsUnavailablePill) this.dom.hapticsUnavailablePill.style.display = "inline-block";
      if (this.dom.settingHaptics) {
        this.dom.settingHaptics.disabled = true;
        this.dom.settingHaptics.checked = false;
        this.dom.settingHaptics.tabIndex = -1;
      }
    }

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

    if (this.dom.btnRateApp) {
      this.dom.btnRateApp.addEventListener("click", () => {
        AudioEngine.playNavBack();
        ReviewManager.requestManualReview();
      });
    }

    if (this.dom.btnContactUs) {
      this.dom.btnContactUs.addEventListener("click", () => {
        AudioEngine.playNavBack();
        PlatformBridge.openExternalUrl("mailto:olaidigitalstudios@gmail.com?subject=Grid%20Leap%20Inquiry%20%26%20Support");
      });
    }

    if (this.dom.btnFeedback) {
      this.dom.btnFeedback.addEventListener("click", () => {
        AudioEngine.playNavBack();
        PlatformBridge.openExternalUrl("https://docs.google.com/forms/d/e/1FAIpQLSedSeFAmfjKKMenShbIpuy61ZFcljG2ox0LpAwaKc_tGQssUQ/viewform?usp=header");
      });
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

    // Online Privacy Policy Button Action
    const privacyOnlineBtn = document.getElementById("privacyOnlineBtn");
    if (privacyOnlineBtn) {
      privacyOnlineBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        PlatformBridge.openExternalUrl("https://sites.google.com/view/grid-leap-privacy-policy");
      });
    }

    if (this.dom.aboutBackBtn) {
      this.dom.aboutBackBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.setView("main");
      });
    }

    // In-App Updates Action (Google Play / Editor Simulator)
    const checkUpdateBtn = document.getElementById("aboutCheckUpdateBtn");
    const checkUpdateLabel = document.getElementById("aboutCheckUpdateLabel");

    const refreshUpdateBtnState = (state, ver = this.versionName || "0.0.15") => {
      if (!checkUpdateLabel) return;
      if (state === "checking") {
        checkUpdateLabel.textContent = "Checking...";
      } else if (state === "downloading") {
        checkUpdateLabel.textContent = "Downloading Update...";
      } else if (state === "downloaded") {
        checkUpdateLabel.textContent = "Restart to Apply Update 🚀";
        if (checkUpdateBtn) checkUpdateBtn.classList.add("btn-primary-highlight");
      } else if (state === "uptodate") {
        checkUpdateLabel.textContent = `Latest Version (v${ver}) ✓`;
        setTimeout(() => {
          if (checkUpdateLabel) checkUpdateLabel.textContent = "Check for Updates";
        }, 2500);
      } else {
        checkUpdateLabel.textContent = "Check for Updates";
      }
    };

    if (checkUpdateBtn) {
      checkUpdateBtn.addEventListener("click", async () => {
        AudioEngine.playNavBack();
        const curVer = this.versionName || TargetConfig.version || "0.0.15";
        if ((TargetConfig.isPlayStore && PlatformBridge.isCapacitor()) || TargetConfig.features.editorSettings) {
          refreshUpdateBtnState("checking", curVer);
          showToast("Checking Google Play for updates...");
          const info = await PlatformBridge.checkForPlayStoreUpdate();
          if (info?.isDownloaded) {
            refreshUpdateBtnState("downloaded", curVer);
            this.close();
            UpdateController.setUpdateAvailable(info);
            UpdateController.open(info);
          } else if (info?.updateAvailable) {
            refreshUpdateBtnState("default", curVer);
            this.close();
            UpdateController.setUpdateAvailable(info);
            UpdateController.open(info);
          } else {
            refreshUpdateBtnState("uptodate", curVer);
            showToast(`You are on the latest version (v${curVer}) ✓`);
          }
        } else {
          refreshUpdateBtnState("uptodate", curVer);
          showToast(`You are on the latest version (v${curVer}) ✓`);
        }
      });
    }

    // Developer In-App Update Simulation Controls (Editor Mode)
    const simAvailableBtn = document.getElementById("devSimUpdateAvailableBtn");
    const simDownloadedBtn = document.getElementById("devSimUpdateDownloadedBtn");
    const simResetBtn = document.getElementById("devSimUpdateResetBtn");

    const highlightSimBtn = (activeBtn) => {
      [simAvailableBtn, simDownloadedBtn, simResetBtn].forEach(b => {
        if (b) {
          b.style.borderColor = (b === activeBtn) ? "var(--teal)" : "";
          b.style.color = (b === activeBtn) ? "var(--teal)" : "";
        }
      });
    };

    if (simAvailableBtn) {
      simAvailableBtn.addEventListener("click", () => {
        const updateData = {
          updateAvailable: true,
          availableVersionCode: 16,
          isFlexibleAllowed: true,
          installStatus: "PENDING"
        };
        PlatformBridge.setSimulatedUpdateState(updateData);
        highlightSimBtn(simAvailableBtn);
        if (checkUpdateLabel) checkUpdateLabel.textContent = "Check for Updates";
        UpdateController.setUpdateAvailable(updateData);
        this.close();
        UpdateController.open(updateData);
        showToast("Simulated: Update Available (v0.1.6)");
      });
    }

    if (simDownloadedBtn) {
      simDownloadedBtn.addEventListener("click", () => {
        const updateData = {
          updateAvailable: false,
          isDownloaded: true,
          installStatus: "DOWNLOADED"
        };
        PlatformBridge.setSimulatedUpdateState(updateData);
        highlightSimBtn(simDownloadedBtn);
        refreshUpdateBtnState("downloaded", this.versionName);
        UpdateController.setUpdateAvailable(updateData);
        UpdateController.setDownloadedState();
        this.close();
        UpdateController.open(updateData);
        showToast("Simulated: Update Downloaded (Ready to Install)");
      });
    }

    if (simResetBtn) {
      simResetBtn.addEventListener("click", () => {
        PlatformBridge.setSimulatedUpdateState(null);
        highlightSimBtn(simResetBtn);
        refreshUpdateBtnState("default", this.versionName);
        UpdateController.clearUpdate();
        showToast(`Simulated: Up-to-date (v${this.versionName || "0.0.15"})`);
      });
    }

    // Lifecycle Update Listeners
    PlatformBridge.onPlayStoreUpdateDownloading(() => {
      refreshUpdateBtnState("downloading", this.versionName);
    });

    PlatformBridge.onPlayStoreUpdateCanceled(() => {
      refreshUpdateBtnState("default", this.versionName);
      showToast("Update canceled");
    });

    PlatformBridge.onPlayStoreUpdateDownloaded(() => {
      refreshUpdateBtnState("downloaded", this.versionName);
      UpdateController.setDownloadedState();
      showToast("🚀 Update Downloaded! Ready to install.", 4000);
    });

    // "More Games by Olai" Action
    const moreGamesBtn = document.getElementById("aboutMoreGamesBtn");
    if (moreGamesBtn) {
      moreGamesBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        if (TargetConfig.isPlayStore || PlatformBridge.isCapacitor()) {
          PlatformBridge.openExternalUrl("https://play.google.com/store/apps/developer?id=Olai+Digital+Studios");
        } else if (TargetConfig.isItch) {
          PlatformBridge.openExternalUrl("https://olaidigitalstudios.itch.io");
        } else {
          // Desktop / Editor
          PlatformBridge.openExternalUrl("https://olaidigitalstudios.itch.io");
        }
      });
    }

    // In-App Purchase Action & Status Sync
    if (this.dom.btnRemoveAds) {
      if (AdController.isPremiumUser()) {
        this.dom.btnRemoveAds.disabled = true;
        this.dom.btnRemoveAds.innerHTML = '<span class="iap-sparkle">✓</span> Purchased';
        this.dom.btnRemoveAds.style.opacity = '0.6';
      } else if (TargetConfig.isPlayStore || PlatformBridge.isCapacitor()) {
        PlatformBridge.checkRemoveAdsPurchased().then(isPurchased => {
          if (isPurchased && this.dom.btnRemoveAds) {
            AdController.suppressAds();
            updateHintBadge(Infinity, true);
            this.dom.btnRemoveAds.disabled = true;
            this.dom.btnRemoveAds.innerHTML = '<span class="iap-sparkle">✓</span> Purchased';
            this.dom.btnRemoveAds.style.opacity = '0.6';
          }
        });
      }

      this.dom.btnRemoveAds.addEventListener("click", async () => {
        AudioEngine.playNavBack();
        if (TargetConfig.isPlayStore && PlatformBridge.isCapacitor()) {
          const res = await PlatformBridge.purchaseRemoveAds();
          if (res?.success) {
            await AdController.suppressAds();
            updateHintBadge(Infinity, true);
            showToast("✓ Ads Removed Permanently!");
            this.dom.btnRemoveAds.disabled = true;
            this.dom.btnRemoveAds.innerHTML = '<span class="iap-sparkle">✓</span> Purchased';
            this.dom.btnRemoveAds.style.opacity = '0.6';
          } else if (res?.error !== "USER_CANCELED") {
            const errStr = typeof res?.error === "string" ? res.error : (res?.message || "Google Play product not active yet");
            showToast(errStr.includes("Unable to find product") ? "Google Play: Product still propagating" : "Google Play Purchase not completed");
          }
        } else {
          showToast("Available on Google Play Store");
        }
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
    if (this.dom.settingDailyReminders) {
      this.dom.settingDailyReminders.checked = Boolean(GameState.settings.dailyReminders);
    }
    if (this.dom.settingHaptics) {
      this.dom.settingHaptics.checked = PlatformBridge.isHapticsSupported() && GameState.settings.hapticsEnabled !== false;
    }
    SceneRouter.pushModal("SETTINGS");
  },

  close() {
    this.setView("main");
    SceneRouter.popModal();
  },

  back() {
    if (this.currentView !== "main") {
      AudioEngine.playNavBack();
      this.setView("main");
      return true;
    }
    this.close();
    return true;
  }
};

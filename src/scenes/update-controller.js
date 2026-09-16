/**
 * Grid Leap — In-App Update Modal Controller
 * Handles dedicated in-app update popups, topbar update triggers,
 * download progress, and restart/installation orchestration.
 */

import { SceneRouter } from "./scene-router.js";
import { PlatformBridge } from "../platform/lifecycle.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { TargetConfig } from "../platform/target-config.js";

export const UpdateController = {
  dom: {},
  updateInfo: null,
  status: "idle", // "idle" | "available" | "downloading" | "downloaded"
  progress: 0,

  init() {
    this.dom = {
      modal: document.getElementById("updateModal"),
      closeX: document.getElementById("updateModalCloseX"),
      laterBtn: document.getElementById("updateModalLaterBtn"),
      actionBtn: document.getElementById("updateModalActionBtn"),
      versionTag: document.getElementById("updateModalVersionTag"),
      progressWrap: document.getElementById("updateProgressWrap"),
      progressFill: document.getElementById("updateProgressFill"),
      progressLabel: document.getElementById("updateProgressLabel"),
      featureList: document.getElementById("updateFeatureList"),
      homeUpdateBtn: document.getElementById("homeUpdateBtn")
    };

    if (this.dom.closeX) {
      this.dom.closeX.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.close();
      });
    }

    if (this.dom.laterBtn) {
      this.dom.laterBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.close();
      });
    }

    if (this.dom.modal) {
      this.dom.modal.addEventListener("click", (e) => {
        if (e.target === this.dom.modal) {
          AudioEngine.playNavBack();
          this.close();
        }
      });
    }

    if (this.dom.homeUpdateBtn) {
      this.dom.homeUpdateBtn.addEventListener("click", () => {
        AudioEngine.playNavBack();
        this.open();
      });
    }

    if (this.dom.actionBtn) {
      this.dom.actionBtn.addEventListener("click", async () => {
        AudioEngine.playNavBack();
        if (this.status === "downloaded") {
          // Complete and restart
          this.dom.actionBtn.disabled = true;
          this.dom.actionBtn.textContent = "Restarting...";
          setTimeout(() => {
            PlatformBridge.completePlayStoreUpdate();
          }, 600);
        } else {
          // Start flexible update
          this.startUpdateFlow();
        }
      });
    }

    // Platform listeners
    PlatformBridge.onPlayStoreUpdateDownloading((data) => {
      const bytesDownloaded = data?.bytesDownloaded || 0;
      const totalBytes = data?.totalBytesToDownload || 1;
      const pct = Math.min(100, Math.round((bytesDownloaded / totalBytes) * 100)) || 50;
      this.setDownloadingState(pct);
    });

    PlatformBridge.onPlayStoreUpdateDownloaded(() => {
      this.setDownloadedState();
    });

    PlatformBridge.onPlayStoreUpdateCanceled(() => {
      this.setIdleState();
    });
  },

  open(info = null) {
    if (info) this.updateInfo = info;
    this.render();
    SceneRouter.pushModal("UPDATE");
  },

  close() {
    SceneRouter.popModal();
  },

  setUpdateAvailable(info) {
    this.updateInfo = info;
    this.status = info?.isDownloaded ? "downloaded" : "available";
    if (this.dom.homeUpdateBtn) {
      this.dom.homeUpdateBtn.style.display = "inline-flex";
      this.dom.homeUpdateBtn.classList.toggle("downloaded", this.status === "downloaded");
    }
  },

  setDownloadingState(pct = 0) {
    this.status = "downloading";
    this.progress = pct;
    if (this.dom.progressWrap) this.dom.progressWrap.style.display = "block";
    if (this.dom.progressFill) this.dom.progressFill.style.width = `${pct}%`;
    if (this.dom.progressLabel) this.dom.progressLabel.textContent = `Downloading... ${pct}%`;
    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = true;
      this.dom.actionBtn.textContent = `Downloading (${pct}%)...`;
    }
  },

  setDownloadedState() {
    this.status = "downloaded";
    if (this.dom.homeUpdateBtn) {
      this.dom.homeUpdateBtn.style.display = "inline-flex";
      this.dom.homeUpdateBtn.classList.add("downloaded");
      const textEl = this.dom.homeUpdateBtn.querySelector(".update-pill-text");
      if (textEl) textEl.textContent = "INSTALL";
    }
    if (this.dom.progressWrap) this.dom.progressWrap.style.display = "none";
    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = false;
      this.dom.actionBtn.textContent = "RESTART & INSTALL";
      this.dom.actionBtn.classList.add("primary");
    }
  },

  setIdleState() {
    this.status = "available";
    if (this.dom.progressWrap) this.dom.progressWrap.style.display = "none";
    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = false;
      this.dom.actionBtn.textContent = "UPDATE NOW";
    }
  },

  clearUpdate() {
    this.updateInfo = null;
    this.status = "idle";
    if (this.dom.homeUpdateBtn) {
      this.dom.homeUpdateBtn.style.display = "none";
      this.dom.homeUpdateBtn.classList.remove("downloaded");
      const textEl = this.dom.homeUpdateBtn.querySelector(".update-pill-text");
      if (textEl) textEl.textContent = "UPDATE";
    }
  },

  async startUpdateFlow() {
    if (this.dom.actionBtn) {
      this.dom.actionBtn.disabled = true;
      this.dom.actionBtn.textContent = "Launching Google Play...";
    }
    try {
      const res = await PlatformBridge.startPlayStoreUpdate("flexible");
      if (res?.userCanceled || res?.resultCode === 0) {
        this.setIdleState();
      } else if (res?.userAccepted || res?.resultCode === -1 || res?.status === "flow_started") {
        this.setDownloadingState(15);
      } else {
        this.setIdleState();
      }
    } catch (e) {
      console.warn("[UpdateController] Update flow error:", e);
      this.setIdleState();
    }
  },

  render() {
    const curVer = TargetConfig.version || "0.0.10";
    const newVer = this.updateInfo?.availableVersionCode
      ? `v${curVer} → Build ${this.updateInfo.availableVersionCode}`
      : `v${curVer} Update`;

    if (this.dom.versionTag) {
      this.dom.versionTag.textContent = newVer;
    }

    if (this.status === "downloaded") {
      this.setDownloadedState();
    } else if (this.status === "downloading") {
      this.setDownloadingState(this.progress);
    } else {
      this.setIdleState();
    }
  }
};

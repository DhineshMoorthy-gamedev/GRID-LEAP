import { PlatformBridge } from "../platform/lifecycle.js";
import { TargetConfig } from "../platform/target-config.js";
import { AD_UNIT_IDS } from "../platform/ad-config.js";
import { AudioEngine } from "../audio/audio-engine.js";
import { showToast } from "./game-renderer.js";

const INTERSTITIAL_MIN_LEVEL_GAP = 2;

class AdControllerClass {
  constructor() {
    this._adsEnabled = false;
    this._isPremium = false;
    this._levelsSinceLastInterstitial = this._loadLevelCount();
    this._rewardedReady = false;
    this._isRewardedLoading = false;
    this._interstitialReady = false;
    this._isInterstitialLoading = false;
    this._initialized = false;   // guard against double-init
    this._sdkReady = false;      // CrazyGames SDK fully initialized
  }

  _loadLevelCount() {
    try {
      const val = parseInt(localStorage.getItem("grid_leap_ad_level_count"), 10);
      return isNaN(val) ? 0 : Math.max(0, val);
    } catch (_) {
      return 0;
    }
  }

  _saveLevelCount() {
    try {
      localStorage.setItem("grid_leap_ad_level_count", String(this._levelsSinceLastInterstitial));
    } catch (_) {}
  }

  async init() {
    // Prevent double-init (called twice: early in bootApp + inside afterIntro)
    if (this._initialized) return;
    this._initialized = true;

    // ── CrazyGames SDK Initialization ───────────────────────────────────────
    if (TargetConfig.isCrazyGames) {
      if (typeof window !== "undefined" && window.CrazyGames?.SDK) {
        try {
          await window.CrazyGames.SDK.init();
          this._sdkReady = true;
          console.log("[AdController] CrazyGames SDK initialized successfully");
        } catch (err) {
          console.warn("[AdController] CrazyGames SDK init error:", err);
          // Still mark sdkReady so gameplay events don't get permanently blocked
          this._sdkReady = true;
        }
      }
      this._adsEnabled = true;
      return;
    }

    // Check if ads feature is enabled on this target build
    if (!TargetConfig.features.showAdBanner && !TargetConfig.features.ads) return;

    // ── Layer 1: Instant Local Cache (Offline-ready) ──────────────────────────
    try {
      const cachedPremium = localStorage.getItem("grid_leap_premium") === "true";
      if (cachedPremium) {
        this._isPremium = true;
        this._adsEnabled = false;
        return;
      }
    } catch (_) {}

    // ── Layer 2: Authoritative Play Billing Check (Background verification) ──
    if (TargetConfig.isPlayStore) {
      PlatformBridge.checkRemoveAdsPurchased()
        .then((isPurchased) => {
          if (isPurchased && !this._isPremium) {
            this._grantPremium();
          }
        })
        .catch(() => {
          // Network offline / store unavailable; handled via cached flag
        });
    }

    // ── Layer 3: Initialize Native AdMob on Play Store ────────────────────────
    this._adsEnabled = true;

    if (TargetConfig.isPlayStore) {
      try {
        await PlatformBridge.initAds();
        await this._showBanner();
        this._preloadRewarded();
        this._preloadInterstitial();
      } catch (err) {
        console.warn("[AdController] Error during AdMob initialization:", err);
      }
    }
  }

  isPremiumUser() {
    return this._isPremium;
  }

  isAdsEnabled() {
    return this._adsEnabled && !this._isPremium;
  }

  _grantPremium() {
    this._isPremium = true;
    this._adsEnabled = false;
    try {
      localStorage.setItem("grid_leap_premium", "true");
    } catch (_) {}

    PlatformBridge.hideBanner().catch(() => {});
    const bannerSlot = document.getElementById("adBannerSlot");
    if (bannerSlot) bannerSlot.classList.add("hidden");
    document.body.classList.remove("ads-active");
  }

  async suppressAds() {
    this._grantPremium();
  }

  async ensureBanner() {
    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) return;
    await this._showBanner();
  }

  async _showBanner() {
    if (!this.isAdsEnabled()) return;
    try {
      await PlatformBridge.showBanner(AD_UNIT_IDS.banner);
      const bannerSlot = document.getElementById("adBannerSlot");
      if (bannerSlot) bannerSlot.classList.remove("hidden");
      document.body.classList.add("ads-active");
    } catch (err) {
      console.warn("[AdController] showBanner error:", err);
    }
  }

  async _preloadRewarded() {
    if (!this.isAdsEnabled()) return false;
    if (this._rewardedReady) return true;
    if (this._isRewardedLoading) {
      // If already in flight, wait up to 4s for it to finish
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (this._rewardedReady) return true;
        if (!this._isRewardedLoading) break;
      }
      return this._rewardedReady;
    }

    this._isRewardedLoading = true;
    try {
      const res = await PlatformBridge.loadRewardedAd(AD_UNIT_IDS.rewarded);
      this._rewardedReady = res?.success === true || res?.ready === true;
      return this._rewardedReady;
    } catch (e) {
      this._rewardedReady = false;
      return false;
    } finally {
      this._isRewardedLoading = false;
    }
  }

  async _preloadInterstitial() {
    if (!this.isAdsEnabled()) return false;
    if (this._interstitialReady) return true;
    if (this._isInterstitialLoading) {
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 200));
        if (this._interstitialReady) return true;
        if (!this._isInterstitialLoading) break;
      }
      return this._interstitialReady;
    }

    this._isInterstitialLoading = true;
    try {
      const res = await PlatformBridge.loadInterstitial(AD_UNIT_IDS.interstitial);
      this._interstitialReady = res?.success === true || res?.ready === true;
      return this._interstitialReady;
    } catch (e) {
      this._interstitialReady = false;
      return false;
    } finally {
      this._isInterstitialLoading = false;
    }
  }

  showLoading(text = "Loading Ad...") {
    if (typeof document === "undefined") return;
    const overlay = document.getElementById("adLoadingOverlay");
    const label = document.getElementById("adLoadingText");
    if (label) label.textContent = text;
    if (overlay) {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
    }
    // Safety auto-dismiss fallback (max 7s)
    if (this._loadingTimeout) clearTimeout(this._loadingTimeout);
    this._loadingTimeout = setTimeout(() => {
      this.hideLoading();
    }, 7000);
  }

  hideLoading() {
    if (typeof document === "undefined") return;
    if (this._loadingTimeout) {
      clearTimeout(this._loadingTimeout);
      this._loadingTimeout = null;
    }
    const overlay = document.getElementById("adLoadingOverlay");
    if (overlay) {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  /**
   * Request rewarded ad for gameplay hint.
   * Returns true if user earned the hint, false otherwise.
   */
  async requestHintReward() {
    if (TargetConfig.isCrazyGames) {
      if (typeof window !== "undefined" && window.CrazyGames?.SDK) {
        return new Promise((resolve) => {
          const callbacks = {
            adFinished: () => {
              AudioEngine.resume();
              resolve(true);
            },
            adError: (error) => {
              console.warn("[CrazyGames] Rewarded ad error:", error);
              AudioEngine.resume();
              const isBasicLaunch = 
                error === "adsDisabledBasicLaunch" || 
                error?.code === "adsDisabledBasicLaunch" || 
                (typeof error === "string" && error.includes("adsDisabledBasicLaunch")) || 
                (error?.message && (String(error.message).includes("basic launch") || String(error.message).includes("Basic launch") || String(error.message).includes("Basic Launch")));

              if (isBasicLaunch) {
                // In Basic Launch, CrazyGames disables live ads. Grant the reward as per CrazyGames guidelines.
                resolve(true);
                return;
              }

              showToast("Ad is unavailable right now. Try again shortly.");
              resolve(false);
            },
            adStarted: () => {
              AudioEngine.suspend();
            }
          };
          try {
            window.CrazyGames.SDK.ad.requestAd("rewarded", callbacks);
          } catch (err) {
            console.warn("[CrazyGames] requestAd exception:", err);
            AudioEngine.resume();
            showToast("Ad failed to play. Please try again.");
            resolve(false);
          }
        });
      }
      return true;
    }

    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) {
      // Free hint for premium or non-PlayStore platforms
      return true;
    }

    if (!this._rewardedReady) {
      this.showLoading("Loading Hint Ad...");
      const loaded = await this._preloadRewarded();
      if (!loaded || !this._rewardedReady) {
        this.hideLoading();
        showToast("Ad is unavailable right now. Try again shortly.");
        return false;
      }
    }

    try {
      this.showLoading("Opening Ad...");
      const earned = await PlatformBridge.showRewardedAd();
      this.hideLoading();
      this._rewardedReady = false;
      setTimeout(() => this._preloadRewarded(), 500);

      if (!earned) {
        showToast("Watch the full ad to unlock a hint");
      }
      return earned;
    } catch (err) {
      this.hideLoading();
      console.warn("[AdController] showRewardedAd exception:", err);
      this._rewardedReady = false;
      setTimeout(() => this._preloadRewarded(), 500);
      showToast("Ad failed to play. Please try again.");
      return false;
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Request rewarded ad for life revival on Out of Lives modal.
   * Returns true if user earned the life, false otherwise.
   */
  async requestLifeReward() {
    if (TargetConfig.isCrazyGames) {
      if (typeof window !== "undefined" && window.CrazyGames?.SDK) {
        return new Promise((resolve) => {
          const callbacks = {
            adFinished: () => {
              AudioEngine.resume();
              resolve(true);
            },
            adError: (error) => {
              console.warn("[CrazyGames] Rewarded ad error:", error);
              AudioEngine.resume();
              const isBasicLaunch = 
                error === "adsDisabledBasicLaunch" || 
                error?.code === "adsDisabledBasicLaunch" || 
                (typeof error === "string" && error.includes("adsDisabledBasicLaunch")) || 
                (error?.message && (String(error.message).includes("basic launch") || String(error.message).includes("Basic launch") || String(error.message).includes("Basic Launch")));

              if (isBasicLaunch) {
                // In Basic Launch, CrazyGames disables live ads. Grant the revive as per CrazyGames guidelines.
                resolve(true);
                return;
              }

              showToast("Ad is unavailable right now. Try again shortly.");
              resolve(false);
            },
            adStarted: () => {
              AudioEngine.suspend();
            }
          };
          try {
            window.CrazyGames.SDK.ad.requestAd("rewarded", callbacks);
          } catch (err) {
            console.warn("[CrazyGames] requestAd exception:", err);
            AudioEngine.resume();
            showToast("Ad failed to play. Please try again.");
            resolve(false);
          }
        });
      }
      return true;
    }

    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) {
      return true;
    }

    if (!this._rewardedReady) {
      this.showLoading("Loading Extra Life Ad...");
      const loaded = await this._preloadRewarded();
      if (!loaded || !this._rewardedReady) {
        this.hideLoading();
        showToast("Ad is unavailable right now. Try again shortly.");
        return false;
      }
    }

    try {
      this.showLoading("Opening Ad...");
      const earned = await PlatformBridge.showRewardedAd();
      this.hideLoading();
      this._rewardedReady = false;
      setTimeout(() => this._preloadRewarded(), 500);

      if (!earned) {
        showToast("Watch the full ad to gain an extra life");
      }
      return earned;
    } catch (err) {
      this.hideLoading();
      console.warn("[AdController] showRewardedAd exception (life):", err);
      this._rewardedReady = false;
      setTimeout(() => this._preloadRewarded(), 500);
      showToast("Ad failed to play. Please try again.");
      return false;
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Called whenever a standard level or daily challenge is solved.
   * Increments the persistent level counter and preloads the interstitial.
   */
  recordLevelVictory(isCustom = false) {
    if (!this.isAdsEnabled() || (!TargetConfig.isPlayStore && !TargetConfig.isCrazyGames) || isCustom) return;
    this._levelsSinceLastInterstitial++;
    this._saveLevelCount();
    if (!this._interstitialReady && TargetConfig.isPlayStore) {
      this._preloadInterstitial();
    }
  }

  /**
   * Shows an interstitial if the player has completed >= 2 levels since the last ad.
   */
  async showPendingInterstitialIfNeeded() {
    if (TargetConfig.isCrazyGames) {
      if (this._levelsSinceLastInterstitial >= INTERSTITIAL_MIN_LEVEL_GAP) {
        this._levelsSinceLastInterstitial = 0;
        this._saveLevelCount();
        if (typeof window !== "undefined" && window.CrazyGames?.SDK) {
          return new Promise((resolve) => {
            const callbacks = {
              adFinished: () => {
                AudioEngine.resume();
                resolve(true);
              },
              adError: (error) => {
                console.warn("[CrazyGames] Midgame ad callback:", error);
                AudioEngine.resume();
                // Never block game progression if ads are disabled or fail
                resolve(true);
              },
              adStarted: () => {
                AudioEngine.suspend();
              }
            };
            try {
              window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
            } catch (err) {
              console.warn("[CrazyGames] Midgame requestAd exception:", err);
              AudioEngine.resume();
              resolve(false);
            }
          });
        }
      }
      return false;
    }

    if (!this.isAdsEnabled() || !TargetConfig.isPlayStore) return false;

    if (this._levelsSinceLastInterstitial >= INTERSTITIAL_MIN_LEVEL_GAP) {
      if (!this._interstitialReady) {
        this.showLoading("Loading...");
        await this._preloadInterstitial();
      }

      if (this._interstitialReady) {
        this._levelsSinceLastInterstitial = 0;
        this._saveLevelCount();
        try {
          this.showLoading("Loading...");
          await PlatformBridge.showInterstitial();
          return true;
        } catch (err) {
          console.warn("[AdController] showInterstitial failed:", err);
        } finally {
          this.hideLoading();
          this._interstitialReady = false;
          setTimeout(() => this._preloadInterstitial(), 500);
        }
      } else {
        this.hideLoading();
      }
    }
    return false;
  }

  async onLevelCompleted() {
    return await this.showPendingInterstitialIfNeeded();
  }

  gameplayStart() {
    if (TargetConfig.isCrazyGames && this._sdkReady && typeof window !== "undefined" && window.CrazyGames?.SDK?.game?.gameplayStart) {
      window.CrazyGames.SDK.game.gameplayStart();
    }
  }

  gameplayStop() {
    if (TargetConfig.isCrazyGames && this._sdkReady && typeof window !== "undefined" && window.CrazyGames?.SDK?.game?.gameplayStop) {
      window.CrazyGames.SDK.game.gameplayStop();
    }
  }

  onPause() {
    // Mobile AdMob maintains state automatically
  }

  onResume() {
    // If ads are active, ensure preload queues are replenished
    if (this.isAdsEnabled() && TargetConfig.isPlayStore) {
      if (!this._rewardedReady) this._preloadRewarded();
      if (!this._interstitialReady) this._preloadInterstitial();
    }
  }
}

export const AdController = new AdControllerClass();

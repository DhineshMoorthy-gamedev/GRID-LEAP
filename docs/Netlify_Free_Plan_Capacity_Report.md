# Netlify Free Plan (300 Credits/Month) Player Capacity Analysis

This analysis evaluates the player capacity of **Grid Leap** under Netlify's 300-credit/month Free plan. The evaluation is based directly on the actual codebase structure, build toolchain, runtime network behavior, asset footprint, and measured production build outputs (`dist/web`).

---

## 1. Understand the Project

Based on the inspection of `package.json`, `index.html`, `.env.web`, and the `src/` directory:

- **Framework / Engine:** Custom lightweight Vanilla TypeScript/JavaScript engine. The puzzle board, movement animations, HUD, and editor are built with standard DOM manipulations and modern CSS grid/flexbox. No heavy game engines (e.g., Phaser, Pixi.js, Unity WebGL, Godot) or UI frameworks (React/Vue) are used.
- **Build Tool:** Vite v6.4.3 (`vite`).
- **Production Build Command (Web Target):** `npm run build:web` (which executes `vite build --mode web --outDir dist/web`).
- **Output Directory:** `dist/web`.
- **Target Platform:** Cross-platform web (responsive mobile portrait and desktop browsers), with separate build targets for Android (via Capacitor 8), Itch.io, and Editor mode.
- **Static vs. Dynamic Backend:** **100% completely static single-page application (SPA).** The application has zero server-side APIs, zero backend microservices, zero serverless functions, and zero server database connections.
- **Asset Loading:** 100% local. Levels, styles, icons, logic, and solver algorithms are all bundled into the local distribution files.
- **Third-Party Runtime Services:** None. No external CDNs, fonts, third-party libraries, analytics, ads, telemetry, authentication, leaderboards, or cloud saves are contacted during runtime.
- **Local Persistence:** All progress, stars, settings, and high scores are persisted entirely on the client side via browser `localStorage` under key `number_grid_maze_save_v1`.

---

## 2. Analyze the Production Build

Executing `npm run build:web` generated the production output in `dist/web`. The exact sizes of every deployed file were measured both uncompressed (raw byte count) and compressed using standard Gzip and Brotli (`br`):

### Production Build Asset Breakdown

| File | Raw Bytes | Gzip Bytes | Brotli Bytes |
|---|---:|---:|---:|
| `index.html` | 16,880 B (16.48 KB) | 4,550 B (4.44 KB) | 3,638 B (3.55 KB) |
| `assets/index-B02QK0WJ.css` | 22,604 B (22.07 KB) | 4,740 B (4.63 KB) | 4,172 B (4.07 KB) |
| `assets/index-D_Rgff5P.js` | 48,070 B (46.94 KB) | 15,389 B (15.03 KB) | 13,582 B (13.26 KB) |
| `assets/web-CItxGl8h.js` | 842 B (0.82 KB) | 400 B (0.39 KB) | 299 B (0.29 KB) |
| `assets/web-CjTfkccY.js` | 940 B (0.92 KB) | 466 B (0.46 KB) | 406 B (0.40 KB) |
| `icon.svg` | 1,031 B (1.01 KB) | 381 B (0.37 KB) | 319 B (0.31 KB) |
| `manifest.json` | 403 B (0.39 KB) | 254 B (0.25 KB) | 206 B (0.20 KB) |
| `sw.js` | 810 B (0.79 KB) | 390 B (0.38 KB) | 312 B (0.30 KB) |
| **Total Build Artifacts** | **91,580 B (89.43 KB)** | **26,570 B (25.95 KB)** | **22,934 B (22.40 KB)** |

### Asset Category Summary

| Asset Category | Uncompressed Size | Compressed Size (Brotli) | Likely Downloaded by Player? |
|---|---:|---:|---|
| **HTML** | 16.48 KB (16,880 B) | 3.55 KB (3,638 B) | **Yes** (initial document request) |
| **JS** | 48.68 KB (49,852 B) | 13.95 KB (14,287 B) | **Yes** (main bundle: 13.26 KB; Capacitor fallbacks conditional) |
| **CSS** | 22.07 KB (22,604 B) | 4.07 KB (4,172 B) | **Yes** (referenced in `<head>`) |
| **Images / Textures** | 1.01 KB (1,031 B) | 0.31 KB (319 B) | **Yes** (PWA/shortcut `icon.svg`) |
| **Audio** | 0 B | 0 B | **None** (no audio assets exist in codebase) |
| **Fonts** | 0 B | 0 B | **None** (uses system font stack: system-ui, -apple-system, monospace) |
| **JSON / Data** | 0.39 KB (403 B) | 0.20 KB (206 B) | **Yes** (PWA `manifest.json`) |
| **WASM / Binaries** | 0 B | 0 B | **None** (pure JS solver) |
| **Service Worker** | 0.79 KB (810 B) | 0.30 KB (312 B) | **No** (not registered in `index.html` or `main.js`) |
| **Total Deployed** | **89.43 KB (91,580 B)** | **22.40 KB (22,934 B)** | **~21.4 KB payload per new player** |

### Compression Transfer Mechanism (Netlify Edge CDN)
Netlify’s Edge CDN automatically determines whether to send compressed or uncompressed versions based on the client's `Accept-Encoding` header:
- Over 97% of modern web browsers send `Accept-Encoding: gzip, deflate, br, zstd`.
- Netlify dynamically compresses and serves static text assets (`.html`, `.css`, `.js`, `.svg`, `.json`) using **Brotli (`br`)** compression.
- Browsers without Brotli support receive **Gzip (`gzip`)**.
- Only clients with compression disabled or raw HTTP/1.0 agents download uncompressed files.
- Therefore, player data consumption calculations must be based on **compressed transfer sizes**, plus standard HTTP request/response header overhead (~350–500 bytes per request).

---

## 3. First Visit Download Size

When a completely new player opens Grid Leap for the first time:

### Assets Fetched
1. `GET /` (`index.html`): 3,638 B (Brotli)
2. `GET /assets/index-B02QK0WJ.css`: 4,172 B (Brotli)
3. `GET /assets/index-D_Rgff5P.js`: 13,582 B (Brotli)
4. `GET /manifest.json`: 206 B (Brotli)
5. `GET /icon.svg` (or `/favicon.ico`): 319 B (Brotli)
*(Note: `web-CItxGl8h.js` and `web-CjTfkccY.js` are dynamically imported only if Capacitor native plugins are called on web. In `lifecycle.js`, `isCapacitor` evaluates to `false` on web, so these shims are not triggered. `sw.js` is unreferenced).*

- **Net Payload Transferred:** 21,917 bytes (21.40 KiB ≈ 0.0219 MB).
- **HTTP Header Overhead:** 5 requests × ~400 bytes header overhead = ~2.0 KB.
- **Total First Visit Wire Transfer:** **~23.9 KB / player (~0.0239 MB)**.

### First Visit Transfer Size Range
- **Brotli (Modern Chrome, Safari, Edge, Firefox):** **~22 KB – 24 KB / player**
- **Gzip (Older Browsers):** **~26 KB – 28 KB / player**
- **Uncompressed (Extreme worst-case fallback):** **~92 KB – 94 KB / player**

> **Measured First Visit Transfer Size:** **0.024 MB / player** (approx. 24 KB).

---

## 4. Repeat Visit Transfer Size

### Current Caching Behavior (Codebase State)
- **Vite Asset Hashing:** Static bundles in `assets/` have content hashes in their filenames (`index-B02QK0WJ.css`, `index-D_Rgff5P.js`).
- **Missing Custom Cache-Control:** The project currently lacks a `_headers` or `netlify.toml` file. Under Netlify's default configuration, all assets are served with `Cache-Control: public, max-age=0, must-revalidate` alongside an `ETag`.
- **Unregistered Service Worker:** While `public/sw.js` contains an offline cache worker (`grid-leap-v1`), it is **not registered** anywhere in `index.html` or `src/main.js`.

### Repeat Visit Wire Consumption
Because assets lack `immutable` cache headers, a returning player's browser sends conditional requests (`If-None-Match: "<etag>"`) for each cached resource:
1. `GET /` -> Netlify responds `304 Not Modified` (~350 bytes header, 0 bytes body).
2. `GET /assets/index-B02QK0WJ.css` -> Netlify responds `304 Not Modified` (~350 bytes header, 0 bytes body).
3. `GET /assets/index-D_Rgff5P.js` -> Netlify responds `304 Not Modified` (~350 bytes header, 0 bytes body).
4. `GET /manifest.json` -> Netlify responds `304 Not Modified` (~350 bytes header, 0 bytes body).

- **Data Transferred:** 4 × 350 B = **~1,400 bytes (~1.4 KB / session)**.
- **Requests Counted:** **4 requests / session**.

### Returning Player Transfer Summary
- **New player transfer:** **0.024 MB (23.9 KB)**
- **Returning player transfer (current codebase):** **0.0014 MB (1.4 KB)**
- **Returning player transfer (with 1-line `_headers` optimization):** **0.00035 MB (0.35 KB)** *(only `index.html` revalidated; hashed assets served 100% from browser disk cache with 0 Netlify requests)*.

---

## 5. Analyze Network Requests

The codebase was audited for network operations (`fetch`, `XMLHttpRequest`, `WebSocket`, external SDKs, analytics, ads). 

```mermaid
flowchart TD
    subgraph Browser["User Browser"]
        A[Initial Page Load] --> B[HTML, CSS, JS, Icon]
        C[Game Startup] --> D[Read localStorage]
        E[Level Gameplay] --> F[In-Memory BFS & Rules]
        G[Level Complete] --> H[Write localStorage]
        I[Pause / Resume / Restart] --> J[Pure DOM Updates]
    end

    subgraph Netlify["Netlify Edge CDN"]
        B -. "3 - 5 GET Requests (Only once)" .-> K[Netlify Static Storage]
    end

    subgraph External["External Services"]
        L[APIs / Ads / Telemetry] --- M[0 Requests: None Configured]
    end
```

### Network Activity by Lifecycle Phase

| Phase | Netlify Requests | External Requests | Notes |
|---|:---:|:---:|---|
| **1. Initial Page Load** | 3 to 5 (avg: 4) | 0 | Fetches `index.html`, CSS, JS, manifest, icon |
| **2. Game Startup** | 0 | 0 | `validateAll(LEVELS)` and `GameState.init()` run in-memory; save loaded from `localStorage` |
| **3. Starting a Game Session** | 0 | 0 | DOM board generation; token positioning |
| **4. Completing a Level** | 0 | 0 | Modal display, BFS efficiency score computed locally, progress saved to `localStorage` |
| **5. Returning to Menu** | 0 | 0 | View toggling via DOM class switching (`screenHome`) |
| **6. Loading Another Level** | 0 | 0 | Local array index lookup (`LEVELS[i]`) |
| **7. Typical 10-Minute Session** | 0 | 0 | All jumps, undo/redo stacks, hints, and resets are purely client-side |

- **Netlify-Hosted Requests per Player Session:**
  - New player: **4 requests**
  - Returning player: **4 requests** (304 revalidations under current configuration)
- **External Service Requests:** **0 requests**

---

## 6. Netlify Credit Consumption Calculations

### Plan Assumptions
- **Monthly Allowance:** 300 credits
- **Bandwidth Rate:** 20 credits / GB ($1\text{ GB} = 1,024\text{ MB} = 1,048,576\text{ KB}$)
- **Web Requests Rate:** 2 credits / 10,000 requests ($0.0002\text{ credits / request}$, or $1\text{ credit} = 5,000\text{ requests}$)
- **Production Deployments:** 15 credits / deployment

### Deployment Credit Reserve
In a typical production environment, developers deploy bug fixes or content updates 2 to 4 times per month:
- Reserving for 4 production deployments = $4 \times 15 = \mathbf{60\text{ credits}}$.
- Remaining credits available for player traffic = $300 - 60 = \mathbf{240\text{ credits}}$.
*(Calculations below display both the 300-credit absolute maximum and the 240-credit deployment-safe allowance).*

### Per-Player Credit Consumption Formulas

#### New Player (1 Session):
$$\text{Data Transferred} = 23.9\text{ KB} = \frac{23.9}{1,048,576}\text{ GB} \approx 0.00002279\text{ GB}$$
$$\text{Bandwidth Credits} = 0.00002279 \times 20 = \mathbf{0.0004558\text{ credits}}$$
$$\text{Request Credits} = \frac{4\text{ requests}}{10,000} \times 2 = \mathbf{0.0008000\text{ credits}}$$
$$\text{Total Credits / New Player} = 0.0004558 + 0.0008000 = \mathbf{0.0012558\text{ credits}}$$

> [!IMPORTANT]
> **Key Finding:** Web requests consume **64%** of the credits for a new player ($0.000800$ vs $0.000456$), while bandwidth consumes only **36%**. Because the entire game is under 25 KB compressed, **request count is the primary cost driver**, not bandwidth!

#### Returning Player (Per Session):
$$\text{Data Transferred (Headers)} = 1.4\text{ KB} = 0.000001335\text{ GB}$$
$$\text{Bandwidth Credits} = 0.000001335 \times 20 = \mathbf{0.0000267\text{ credits}}$$
$$\text{Request Credits} = \frac{4\text{ requests}}{10,000} \times 2 = \mathbf{0.0008000\text{ credits}}$$
$$\text{Total Credits / Returning Session} = 0.0000267 + 0.0008000 = \mathbf{0.0008267\text{ credits}}$$

---

## 7. Player Capacity Calculations

### Scenario A — 100% New Players (1 Session Each)
Every visitor is unique and downloads the full bundle:
$$\text{Capacity (300 credits)} = \frac{300}{0.0012558} \approx \mathbf{238,890\text{ players/month}}$$
$$\text{Capacity (240 credits, 4 deploys reserved)} = \frac{240}{0.0012558} \approx \mathbf{191,110\text{ players/month}}$$

### Scenario B — Mostly Returning Players (10% New, 90% Returning)
Average credits per player for 1 session = $(0.10 \times 0.0012558) + (0.90 \times 0.0008267) = 0.0008696\text{ credits}$:
$$\text{Capacity (300 credits)} = \frac{300}{0.0008696} \approx \mathbf{344,980\text{ players/month}}$$
$$\text{Capacity (240 credits)} = \frac{240}{0.0008696} \approx \mathbf{275,980\text{ players/month}}$$

### Scenario C — Mixed Audience (50% New, 50% Returning)
Credit consumption per player based on monthly sessions:
- **1 Session/player:** $0.5(0.0012558) + 0.5(0.0008267) = 0.0010413\text{ credits}$
  - Capacity: **288,100 players** (300 cr) / **230,480 players** (240 cr)
- **3 Sessions/player:** $0.5(0.0012558 + 2 \times 0.0008267) + 0.5(3 \times 0.0008267) = 0.0026947\text{ credits}$
  - Capacity: **111,330 players** (300 cr) / **89,060 players** (240 cr)
- **5 Sessions/player:** $0.5(0.0012558 + 4 \times 0.0008267) + 0.5(5 \times 0.0008267) = 0.0043481\text{ credits}$
  - Capacity: **68,990 players** (300 cr) / **55,190 players** (240 cr)
- **10 Sessions/player:** $0.5(0.0012558 + 9 \times 0.0008267) + 0.5(10 \times 0.0008267) = 0.0084816\text{ credits}$
  - Capacity: **35,370 players** (300 cr) / **28,290 players** (240 cr)

---

## 8. Capacity & Limiting Resource Tables

### Table 1: Capacity by Scenario & Engagement Level

| Scenario | Data / Player | Requests / Player | Monthly Capacity (300 Credits) | Monthly Capacity (240 Credits) |
|---|---:|---:|---:|---:|
| **New Player, 1 session** | 23.9 KB | 4 | **238,890** | **191,110** |
| **Returning Player, 1 session** | 1.4 KB | 4 | **362,880** | **290,300** |
| **Mixed (50/50), 1 session** | 12.6 KB | 4 | **288,100** | **230,480** |
| **Mixed (50/50), 3 sessions** | 15.4 KB | 12 | **111,330** | **89,060** |
| **Mixed (50/50), 5 sessions** | 18.2 KB | 20 | **68,990** | **55,190** |
| **Mixed (50/50), 10 sessions** | 25.2 KB | 40 | **35,370** | **28,290** |

### Table 2: Limiting Resource Bottleneck Analysis

| Scenario | Bandwidth Limit (15 GB Allowance) | Request Limit (1.5M Requests Allowance) | Deployment Limit (20 Deploys Max) | Actual Bottleneck |
|---|---:|---:|---:|---|
| **New Players (1 session)** | 657,800 players | 375,000 players | N/A | **Request Count** (64% of credit drain) |
| **Returning Players (1 session)** | 11,234,700 players | 375,000 players | N/A | **Request Count** (97% of credit drain) |
| **Continuous CI/CD Deployments** | N/A | N/A | 20 deployments | **Deployments** (if >10 deploys/month) |

---

## 9. Conservative Estimates

Accounting for real-world factors (unpredictable traffic bursts, cache evictions, occasional deployments, and a safety buffer):

### 1. Theoretical Maximum
- **~288,000 players/month**
- *Assumes:* 0 deployments, 50% returning users, single session/month, optimal Brotli compression, zero 404s/scanners.

### 2. Realistic Maximum
- **~65,000 – 75,000 players/month**
- *Assumes:* 4 production deployments/month (60 credits), realistic engagement of 3–5 sessions per player per month, mixed audience (50% new, 50% returning), typical mobile browser cache retention.

### 3. Safe Operating Target
- **~35,000 – 45,000 players/month**
- *Assumes:*
  - Retains a **35% credit safety buffer** (100+ credits unspent) to prevent sudden plan cutoffs or unexpected overages.
  - Accommodates 5 to 6 production deployments/month.
  - Accounts for active, engaged puzzle players returning 5 to 10 times a month.
  - Easily absorbs traffic spikes and automated web crawler scans without exceeding the 300-credit ceiling.

---

## 10. Identify the Biggest Problems

Ranked breakdown of contributors to Netlify credit consumption:

```text
1. Web Request Volume               [  64% - 97% of active traffic credits ]
2. Production Deployments           [  15 credits per build (20% of total quota at 4 deploys) ]
3. JavaScript Bundle (48 KB raw)    [  57% of first-visit transfer bandwidth ]
4. CSS Bundle (22 KB raw)           [  19% of first-visit transfer bandwidth ]
5. HTML Document (16 KB raw)        [  17% of first-visit transfer bandwidth ]
```

### Key Cost Observations
1. **The Request Inversion:** In large games (Unity WebGL / Godot WASM games of 20–100 MB), bandwidth is 99% of the cost. In Grid Leap, because the game is extremely small (~24 KB), **requests are drastically more expensive than bandwidth**. Each request costs 0.0002 credits, which is equivalent to transferring ~10.5 KB of bandwidth!
2. **Deployments Cost as Much as 12,000 Player Sessions:** Each production deploy on Netlify costs 15 credits. 15 credits is equivalent to hosting **11,940 new player sessions** or **18,140 returning player sessions**. Running CI/CD triggers on every git push will exhaust credits far faster than actual gameplay!

---

## 11. Optimization Recommendations

Implementing the following targeted optimizations can reduce credit drain by over **60%** and more than double player capacity:

### 1. Configure Immutable Cache-Control Headers
- **Action:** Add a `public/_headers` file:
  ```http
  /assets/*
    Cache-Control: public, max-age=31536000, immutable
  /index.html
    Cache-Control: public, max-age=0, must-revalidate
  ```
- **Impact:** Eliminates 304 revalidation requests for JS and CSS on repeat visits. Returning visits drop from 4 requests to **1 request**.
- **Current → Expected:** 4 requests/session → 1 request/session (**75% reduction in returning player requests**).

### 2. Activate the Existing Service Worker
- **Action:** Register `public/sw.js` in `src/main.js` via `navigator.serviceWorker.register('/sw.js')`.
- **Impact:** Once installed, repeat visits load 100% from Cache Storage. Netlify sees **0 requests** and **0 bandwidth** from repeat players.
- **Current → Expected:** 1.4 KB / 4 requests → 0 KB / 0 requests (**100% reduction for returning PWA players**).

### 3. Exclude Capacitor Web Shims from Pure Web Builds
- **Action:** In `src/platform/lifecycle.js`, dynamically import `@capacitor/*` only under native builds, or stub them out via Vite resolve aliases for `TARGET_MODES.WEB`.
- **Impact:** Eliminates the two unused dynamic chunks (`web-CItxGl8h.js`, `web-CjTfkccY.js`) and Capacitor plugin registry code from the web build.
- **Current → Expected:** ~48.0 KB JS → ~42.0 KB JS (**~12% bundle reduction**).

### 4. Tree-Shake Visual Level Designer from Web Build
- **Action:** In `src/main.js` and `index.html`, lazy-load or exclude the `screenEditor` DOM and `src/editor/editor-controller.js` when building for `mode: web`. Currently, the editor DOM elements and controller logic are bundled into `dist/web` even though `target-config.js` hides it at runtime.
- **Impact:** Removes ~11.7 KB of uncompressed editor JS and ~4 KB of HTML.
- **Current → Expected:** 91.5 KB raw → ~75.0 KB raw (**~18% total build size reduction**).

---

## 12. Advertising Considerations

When web advertisements (Google AdSense, AdMob Web, Poki SDK, GameDistribution, CrazyGames SDK) are integrated into Grid Leap:

```mermaid
flowchart LR
    Player[Player Browser]
    Netlify[Netlify CDN]
    AdNetwork[Ad Network CDN & Ad Server]

    Player -- "1. Fetches Game Files (24 KB)" --> Netlify
    Player -- "2. Loads Ad Script SDK" --> AdNetwork
    Player -- "3. Requests Banner / Video Creative" --> AdNetwork
    Player -- "4. Impressions & Telemetry Tracking" --> AdNetwork
```

### Traffic Separation

1. **Netlify-Hosted Traffic:**
   - The only Netlify consumption is the snippet or tag inside `index.html` (e.g., `<script async src="https://..."></script>`), adding less than **150 bytes** to the initial HTML document.
2. **Third-Party Handled Traffic (Zero Netlify Cost):**
   - **Ad Network SDKs:** Loaded directly from the ad provider's CDN.
   - **Ad Creatives:** All banner images, responsive HTML5 ads, and heavy rewarded video files (often 2 MB – 15 MB each) stream directly from the ad network's CDN.
   - **Impression / Click Tracking:** Beacon and telemetry pings connect directly to the ad server.
   - **Ad Bandwidth:** **0 MB** of ad video or image traffic passes through Netlify.
3. **Important Caution:**
   - Do **not** proxy ad requests through Netlify rewrites (e.g., `/ads/* -> https://adnetwork.com/*`), as that would cause massive third-party video bandwidth to route through Netlify and rapidly exhaust the 300 credits. Keep ad tags direct to the provider's domain.

---

## 13. Final Business-Oriented Result

## Netlify Free Plan Capacity

**Game build size:** 0.089 MB (89.43 KB uncompressed)

**New-player transfer:** 0.024 MB (23.9 KB wire transfer)

**Returning-player transfer:** 0.0014 MB (1.4 KB wire transfer; 0.00035 MB with cache headers)

**Estimated requests/player:** 4 requests (new) / 4 requests (returning; drops to 1 with cache headers)

**Theoretical capacity:** ~288,000 players/month

**Realistic capacity:** ~65,000 – 75,000 players/month

**Safe operating target:** ~35,000 – 45,000 players/month

**Primary bottleneck:** Web Request Volume (not bandwidth) & Deployments (15 credits each)

**Recommended optimization:** Add `_headers` with `immutable` caching for `/assets/*` and register the existing `sw.js`

---

> ### **Is Netlify Free sufficient for launching this game commercially?**
>
> ### **YES, but with limitations**
>
> **Why:**
> 1. **Outstanding Asset Efficiency:** Because Grid Leap is a handcrafted Vanilla JS puzzle game without heavy game engines or media assets, its wire payload is extraordinarily small (~24 KB). It can comfortably support **over 35,000 to 70,000 active players per month** completely free of charge.
> 2. **Commercial Soft-Launch Ready:** For a commercial soft launch, indie release, or web portal feature, this capacity is more than generous.
> 3. **The Limitations:**
>    - **Deployment Penalties:** Continuous deployment on every commit will drain credits rapidly ($15\text{ credits / deploy}$ means 20 deploys would consume the entire monthly quota alone, leaving zero credits for players). Deploys must be limited to intentional production releases.
>    - **Request Quota Limits:** Traffic spikes above ~100,000 monthly active users will exhaust the 300 credits primarily through HTTP request volume, even while using less than 2 GB of bandwidth.

---

### What to Monitor & When to Upgrade

#### Metrics to Monitor in the Netlify Team Dashboard:
1. **Credits Usage Meter (`Billing -> Usage`):**
   - Track the monthly burn rate against the 300-credit pool.
2. **Production Deploys Count:**
   - Ensure automated branch builds (PRs, dev commits) are configured to **Deploy Previews** or disabled for non-main branches so they do not consume production build credits.
3. **Bandwidth vs. Request Ratio:**
   - Watch the Request credit consumption. If request credits grow significantly faster than bandwidth, it indicates missing browser cache headers.

#### Upgrade Trigger:
- **Upgrade Threshold:** When monthly credit consumption consistently crosses **225 credits (75% of allowance)**, or if your game reaches **>40,000 monthly active players**.
- **Alternative Before Upgrading:** Before upgrading to Netlify Pro ($19/mo), implement the recommended `_headers` file and register `public/sw.js` — this single change will immediately slash request costs by 75–90% and elevate capacity well beyond 100,000 players/month on the Free plan.

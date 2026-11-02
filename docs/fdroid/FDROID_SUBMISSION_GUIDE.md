# F-Droid Submission Guide for Grid Leap

This guide walks you through submitting **Grid Leap** to the official **F-Droid** repository.

---

## Step 1: Push Codebase to Your Public GitHub Repository

1. On GitHub, make sure your repository (e.g. `https://github.com/olaidigitalstudios/grid-leap`) is set to **Public**.
2. Push all the latest changes including `LICENSE` and the dual-flavor Android setup:
   ```bash
   git add .
   git commit -m "feat: Add F-Droid flavor and open-source under MIT"
   git push origin main
   ```
3. Create a release tag matching the version (e.g., `v0.0.21`):
   ```bash
   git tag v0.0.21
   git push origin v0.0.21
   ```

---

## Step 2: Fork `fdroiddata` on GitLab

1. Sign in or register at [GitLab.com](https://gitlab.com).
2. Go to the official [fdroiddata repository](https://gitlab.com/fdroid/fdroiddata).
3. Click the **Fork** button (top right) to create your personal fork.

---

## Step 3: Add the App Metadata Recipe

1. In your fork on GitLab, create a new branch named `add-grid-leap`.
2. Navigate to the `metadata/` folder.
3. Click **+** → **New file**, and name it:
   ```
   metadata/com.olaidigitalstudios.gridleap.yml
   ```
4. Copy the exact contents of [`docs/fdroid/com.olaidigitalstudios.gridleap.yml`](com.olaidigitalstudios.gridleap.yml) into that file.
   *(Double-check that the `SourceCode:` URL points to your public repository).*
5. Commit the new file with message: `New app: Grid Leap`.

---

## Step 4: Open a Merge Request (MR)

1. On GitLab, click **Create Merge Request** from your `add-grid-leap` branch to `fdroid/fdroiddata:master`.
2. Title the MR:
   ```
   New app: Grid Leap
   ```
3. In the MR description template, check the boxes:
   - [x] The upstream app source code is public and licensed under a free/open-source license (MIT).
   - [x] The `fdroid` build flavor contains zero proprietary SDKs (no AdMob, no Google Play Billing, no tracking).
   - [x] All hints and features are unlocked without non-free network dependencies.
4. Click **Create merge request**.

---

## Step 5: What Happens Next

- **F-Droid CI Bot** will automatically trigger a build test.
- Maintainers will review the recipe and confirm no non-free binaries exist in the `fdroidRelease` flavor.
- Once merged, F-Droid's build server compiles the APK, cryptographically signs it with F-Droid's official key, and distributes it to millions of F-Droid users worldwide!

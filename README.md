# 中文

## 全心日記 — 網站與管理後台

日記 App「全心日記」的網站（首頁、使用者條款、隱私權政策、APK 下載）與管理後台。純靜態網頁，部署在 GitHub Pages。這份文件分成兩個獨立的部分，請依需求閱讀：

- **[專案報告](#專案報告)**：網站有哪些頁面、後台怎麼登入、為什麼這樣設計。
- **[架設 SOP](#架設-sop)**：在自己電腦上預覽、部署、發新版 APK 時要做的事。

這兩部分刻意分開，不要交叉閱讀；報告是背景知識，SOP 是操作手冊。

---

## 專案報告

### 這是什麼

| 頁面 | 內容 |
|---|---|
| `index.html` | 首頁：App 介紹、「你的日記只在你手上」、下載。上方的頁籤可以在同一頁切換到使用者條款、隱私權政策（網址會帶 `?doc=terms` / `?doc=privacy`，可以直接分享）。右上角可以用 Google 登入：一般使用者登入沒有作用；管理員登入後才出現「管理後台」的入口。 |
| `legal.html?doc=terms` / `privacy` | 條款與政策的單獨頁面，內容和首頁頁籤是同一份。App 內與 Google 同意畫面連的是這個網址，所以保留。 |
| `admin.html` | 管理後台，五個分頁：字體（字體清單的編輯、上傳字體檔、發布）、App 版本（強制更新門檻、原因、公告）、意見回饋、管理員、系統（快取與資料庫的版本、重新載入快取）。 |
| `demo/`、`demo-en/` | 首頁與管理後台的示範版（中文、英文），不連後端，見 [`demo/README.md`](demo/README.md)。 |

### 系統架構

```
all-mo-diary/                    ← meta repo，本機開發統一入口，本身不部署
├── all-mo-diary-app/            ← Flutter Android App
├── all-mo-diary-web/            ← 本 repo，部署到 GitHub Pages（純靜態 HTML/CSS/JS）
└── router-backend/              ← 共用後端（Render），全心日記的 API 掛在 /all-mo-diary 底下
```

沒有任何前端框架或建置流程，`.html`、`.css`、`.js` 直接交給 GitHub Pages。唯一的外部 script 是 Google Identity Services（Google 登入按鈕）；管理後台的資料都向後端的 `/api/admin/*` 讀寫。

### 前端的鎖只是方便，權限在後端

首頁只有管理員登入後才顯示「管理後台」的入口，但這只是方便，不是安全措施：任何人都能直接打開 `admin.html`（沒有登入狀態時會直接跳回首頁；登入只在首頁做，按「登出」也回到首頁）。真正的檢查在後端：`/api/admin/*` 每一個請求都要帶管理員的 session，後端每次都確認「這個 Email 現在還是不是管理員」。後端的 CORS 也只允許這個網站的網址呼叫。

### 登入：Google 的憑證只用一次

Google 的 ID token 大約一小時就過期，不能當長期憑證，否則後台開著超過一小時就會在操作中途失效。所以：

- 管理員登入時，網頁把 Google 的憑證送到後端，後端驗證後發一張我們自己的 session token；之後的請求都帶這張（`js/api.js`）。
- session token 存在這個瀏覽器的 `localStorage`，關掉分頁、重新整理、重開瀏覽器都還是登入狀態；滑動式有效期，連續 90 天沒用才過期。後端回 401 時才清掉，讓使用者重新登入。
- 首頁的 Google 登入，憑證也只送到後端確認是不是管理員，用完即丟。

### 下載點：APK 放在 App repo 的 GitHub Release

App 還沒上架 Google Play，首頁的「下載最新版全心日記」連到 `all-mo-diary-app` 的 GitHub Release：`v<版本號>` 這個 tag 上的 `all-mo-diary-<版本號>.apk`。網址由 `js/config.js` 的 `apkVersion` 組出來，所以發新版只要改一個值；`apkVersion` 空白時整個按鈕不顯示，不會出現連到不存在檔案的連結。上架後填 `playUrl`，首頁就改成「到 Google Play 下載」。

### 條款與政策和 App 內建的是同一份

`legal/*.md` 由 meta repo 的 `tools/sync_texts.sh` 從 App 的 `assets/texts/` 複製過來，網站與 App 不會說兩套話。不要直接改這裡的檔案，改 App 那份再複製。Markdown 由 `js/md.js` 轉成 HTML（只支援條款用到的語法：標題、段落、清單、表格、粗體、連結）。

### 慢回應不能蓋掉新畫面

後台每次讀取都拿一個編號，比較慢的舊回應晚回來時直接丟掉，不覆蓋比較新的畫面。字體上傳中的狀態記在模組層級（`uploading`），不記在表格上：上傳期間任何編輯、發布、切換頁籤都會重畫表格，重畫後的那一列仍然要顯示進度、不能再開第二次上傳。上傳請求的每一種結束方式（成功、網路錯誤、逾時、中斷）都會解除鎖定。

### 後端在休眠時

Render 免費方案閒置 15 分鐘會休眠，喚醒約一分鐘。所以第一次請求給 75 秒，連不上時顯示「可能正在喚醒」；後台打不開時保留登入狀態，重新整理即可重試，不會把管理員登出。

### 檔案結構

```
all-mo-diary-web/
├── index.html          首頁（介紹／條款／政策頁籤、下載、管理員登入）
├── legal.html          條款與政策的單獨頁面
├── admin.html          管理後台
├── css/style.css       全站樣式（跟著系統深淺色）
├── js/config.js        設定值（後端網址、Google 用戶端 ID、APK 版本、Google Play 網址）
├── js/api.js           呼叫後端、保存 session token、上傳檔案
├── js/home.js          首頁：頁籤、下載按鈕、管理員登入
├── js/admin.js         管理後台
├── js/md.js            Markdown → HTML
├── legal/              條款與政策（從 App 複製）
├── demo/、demo-en/     示範版
└── favicon.png、apple-touch-icon.png、icon_256.png
```

### 已知限制

- 下載的 APK 不經過 Google Play，第一次安裝時手機會要求允許瀏覽器「安裝不明應用程式」。
- 管理後台只為桌面瀏覽器設計，手機上可以用但表格需要左右捲動。
- GitHub Pages 免費方案只能用在公開的 repo。

---

# 架設 SOP / Setup Guide

## Part A. 在你的 Mac 上預覽

### 1. 啟動本機網頁伺服器

```bash
cd all-mo-diary-web
python3 -m http.server 8010
```

瀏覽器打開 `http://localhost:8010`。首頁、條款與政策、示範版（`/demo/`、`/demo-en/`）都不需要後端。

`8010` 不要隨便改：Google 登入會連 port 一起比對「已授權的 JavaScript 來源」，Google Cloud 上設定的就是 `http://localhost:8010`。

### 2.（要試管理後台時）接上本機的後端

1. 照 `router-backend` 的 README 把後端跑在本機，全心日記的設定裡 allowed origins 要包含 `http://localhost:8010`。
2. 暫時改 `js/config.js` 的 `apiBase` 成本機後端的網址加上 `/all-mo-diary`。**試完改回正式的網址，不要提交本機的網址。**
3. 重新整理首頁 → 右上角用第一位管理員的帳號登入 → 出現「管理後台」。

按 `Control + C` 停止網頁伺服器。

---

## Part B. 部署到 GitHub Pages

1. repo 的 **Settings → Pages**。
2. **Build and deployment → Source** 選 **Deploy from a branch**。
3. **Branch** 選 `main`、資料夾選 `/ (root)` → **Save**。
4. 一兩分鐘後打開 `https://beethoreven.github.io/all-mo-diary-web/` 看得到首頁。之後每次推上 `main`，Pages 會自動更新。

---

## Part C. 發新版 APK

1. 在 `all-mo-diary-app` 打包正式簽章的 APK（見那個 repo 的 README），把檔名改成 `all-mo-diary-<版本號>.apk`，例如 `all-mo-diary-0.1.0.apk`。版本號和 App 的 `pubspec.yaml` 的 `version`（`+` 前面那段）一致。
2. 打開 `https://github.com/beethoreven/all-mo-diary-app/releases/new`：
   - **Choose a tag** 輸入 `v<版本號>`（例如 `v0.1.0`）→ **Create new tag**。
   - **Release title** 填 `v<版本號>`，說明寫這版改了什麼。
   - 把 APK 拖進 **Attach binaries** → **Publish release**。
3. 改本 repo `js/config.js` 的 `apkVersion` 成新的版本號，提交、推上 `main`。
4. 打開首頁按「下載最新版全心日記」，確認下載得到檔案。

---

## Part D. 設定值總覽（`js/config.js`）

這些值都不是秘密（用戶端 ID 本來就會出現在網頁裡）。

| 欄位 | 必填？ | 說明 |
|---|---|---|
| `apiBase` | **必填** | 後端網址加上全心日記的路徑，例如 `https://router-backend-3hl2.onrender.com/all-mo-diary`，**結尾不要斜線**。 |
| `googleClientId` | **必填**（要用 Google 登入時） | Google Cloud「網頁應用程式」用戶端 ID（和後端全心日記設定的 Google 用戶端 ID 是同一個）。空白時不顯示登入按鈕。 |
| `playUrl` | 選填 | 上架後填 Google Play 的網址；空白時首頁顯示「目前尚未在 Google Play 上架」。 |
| `apkVersion` | 選填 | 首頁下載按鈕連到 `all-mo-diary-app` 的 Release `v<版本號>` 上的 `all-mo-diary-<版本號>.apk`；空白時不顯示按鈕。 |

---

# English

## all-mo-diary — Website and Admin Console

The website (home page, Terms of Use, Privacy Policy, APK download) and admin console of all-mo-diary (全心日記), a diary app. Plain static pages, deployed on GitHub Pages. This document has two independent parts:

- **[Project Report](#project-report)**: what pages the site has, how the console signs in, and why it is designed this way.
- **[Setup Guide](#setup-guide)**: previewing on your own computer, deploying, and releasing a new APK.

The two parts are deliberately separate; the report is background, the guide is a manual.

---

## Project Report

### What This Is

| Page | Content |
|---|---|
| `index.html` | Home page: about the app, "your diary stays with you", download. Tabs at the top switch to the Terms of Use and Privacy Policy on the same page (the address carries `?doc=terms` / `?doc=privacy`, so it can be shared). Google sign-in at the top right: ordinary users get nothing; an admin gets the "管理後台" (admin console) link. |
| `legal.html?doc=terms` / `privacy` | Stand-alone pages for the terms and policy, the same text as the home page tabs. The app and Google's consent screen link here, so it stays. |
| `admin.html` | Admin console with five tabs: Fonts (edit the font list, upload font files, publish), App version (forced-update threshold, reason, announcement), Feedback, Admins, System (cache and database versions, reload cache). |
| `demo/`, `demo-en/` | Demo versions of the home page and console (Chinese, English) that never contact the backend; see [`demo/README.md`](demo/README.md). |

### System Architecture

```
all-mo-diary/                    ← meta repo, local development entry point, not deployed
├── all-mo-diary-app/            ← Flutter Android app
├── all-mo-diary-web/            ← this repo, deployed to GitHub Pages (static HTML/CSS/JS)
└── router-backend/              ← shared backend (Render); the all-mo-diary API lives under /all-mo-diary
```

No frontend framework and no build step: the `.html`, `.css` and `.js` files go to GitHub Pages as they are. The only external script is Google Identity Services (the sign-in button); the console reads and writes everything through the backend's `/api/admin/*`.

### The Frontend Lock Is a Convenience; Permissions Live in the Backend

The home page shows the console link only after an admin signs in, but that is a convenience, not a security measure: anyone can open `admin.html` directly (without a stored session it goes straight back to the home page; signing in happens only on the home page, and "Sign out" returns there too). The real check is in the backend: every `/api/admin/*` request must carry an admin session, and the backend confirms every time that the e-mail is still an admin. The backend's CORS also allows only this site's address.

### Sign-In: The Google Credential Is Used Once

Google's ID token expires after about an hour and cannot be the long-term credential, or the console would fail mid-task after an hour. So:

- When an admin signs in, the page sends the Google credential to the backend, which verifies it and issues our own session token; later requests carry that token (`js/api.js`).
- The session token is kept in this browser's `localStorage`, so closing the tab, reloading or restarting the browser keeps you signed in; it expires only after 90 days without use (sliding). It is cleared only when the backend answers 401, so the user signs in again.
- The home page's Google sign-in sends the credential to the backend only to check for an admin, and it is then discarded.

### Download: The APK Lives on the App Repo's GitHub Release

The app is not yet on Google Play, so the home page's download button links to a GitHub Release of `all-mo-diary-app`: `all-mo-diary-<version>.apk` on the tag `v<version>`. The address is built from `apkVersion` in `js/config.js`, so a new version changes one value; with `apkVersion` empty the button is hidden, so there is never a link to a missing file. Once listed, fill in `playUrl` and the home page offers Google Play instead.

### Terms and Policy Are the Same Text as the App's

`legal/*.md` is copied from the app's `assets/texts/` by the meta repo's `tools/sync_texts.sh`, so the site and the app never say different things. Don't edit the files here; edit the app's copy and copy it over. `js/md.js` turns the Markdown into HTML (only the syntax the documents use: headings, paragraphs, lists, tables, bold, links).

### A Slow Response Must Not Overwrite a Newer Screen

Every console load takes a number; a slow old response that arrives after a newer one is dropped instead of overwriting the newer screen. Font uploads in progress are tracked at module level (`uploading`), not in the table: any edit, publish or tab switch during an upload rebuilds the table, and the rebuilt row must still show the progress and not offer a second upload. Every way an upload request can end (success, network error, timeout, abort) releases the lock.

### When the Backend Is Asleep

Render's free plan sleeps after 15 idle minutes and takes about a minute to wake. So the first request gets 75 seconds and a failure says the backend may be waking up; if the console can't load, the session is kept and a reload retries, without signing the admin out.

### File Layout

```
all-mo-diary-web/
├── index.html          home page (about / terms / policy tabs, download, admin sign-in)
├── legal.html          stand-alone terms and policy page
├── admin.html          admin console
├── css/style.css       site styles (follow the system's light/dark mode)
├── js/config.js        settings (backend address, Google client ID, APK version, Google Play address)
├── js/api.js           backend calls, session token storage, file upload
├── js/home.js          home page: tabs, download button, admin sign-in
├── js/admin.js         admin console
├── js/md.js            Markdown → HTML
├── legal/              terms and policy (copied from the app)
├── demo/, demo-en/     demo versions
└── favicon.png, apple-touch-icon.png, icon_256.png
```

### Known Limitations

- The downloaded APK does not come through Google Play, so the first install asks to allow the browser to "install unknown apps".
- The console is designed for desktop browsers; it works on a phone, but tables scroll sideways.
- GitHub Pages on the free plan works only for public repos.

---

# Setup Guide

## Part A. Preview on Your Mac

### 1. Start a Local Web Server

```bash
cd all-mo-diary-web
python3 -m http.server 8010
```

Open `http://localhost:8010`. The home page, terms, policy and demos (`/demo/`, `/demo-en/`) need no backend.

Don't change `8010` casually: Google sign-in matches the port against the "Authorized JavaScript origins", and the one set in Google Cloud is `http://localhost:8010`.

### 2. (To Try the Admin Console) Connect a Local Backend

1. Run the backend locally as described in the `router-backend` README, with `http://localhost:8010` among all-mo-diary's allowed origins.
2. Temporarily set `apiBase` in `js/config.js` to the local backend's address plus `/all-mo-diary`. **Change it back afterwards; never commit a local address.**
3. Reload the home page → sign in at the top right with the first admin's account → the console link appears.

Press `Control + C` to stop the web server.

---

## Part B. Deploy to GitHub Pages

1. The repo's **Settings → Pages**.
2. **Build and deployment → Source**: **Deploy from a branch**.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. A minute or two later `https://beethoreven.github.io/all-mo-diary-web/` shows the home page. Every push to `main` updates it automatically.

---

## Part C. Release a New APK

1. Build a release-signed APK in `all-mo-diary-app` (see that repo's README) and rename it `all-mo-diary-<version>.apk`, e.g. `all-mo-diary-0.1.0.apk`. The version matches the part of `version` in the app's `pubspec.yaml` before the `+`.
2. Open `https://github.com/beethoreven/all-mo-diary-app/releases/new`:
   - **Choose a tag**: type `v<version>` (e.g. `v0.1.0`) → **Create new tag**.
   - **Release title**: `v<version>`; describe what changed.
   - Drag the APK into **Attach binaries** → **Publish release**.
3. Set `apkVersion` in this repo's `js/config.js` to the new version, commit and push to `main`.
4. Open the home page, press the download button and confirm the file downloads.

---

## Part D. Settings Overview (`js/config.js`)

None of these are secret (the client ID appears in the page anyway).

| Field | Required? | Description |
|---|---|---|
| `apiBase` | **Required** | Backend address plus the all-mo-diary path, e.g. `https://router-backend-3hl2.onrender.com/all-mo-diary`, **no trailing slash**. |
| `googleClientId` | **Required** (for Google sign-in) | Google Cloud "Web application" client ID (the same as the backend all-mo-diary settings' Google client ID). Empty hides the sign-in button. |
| `playUrl` | Optional | Google Play address once listed; empty shows "not yet on Google Play". |
| `apkVersion` | Optional | The download button links to `all-mo-diary-<version>.apk` on the `all-mo-diary-app` Release `v<version>`; empty hides the button. |

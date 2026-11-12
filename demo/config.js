// 由 demo/tools/build.py 從 js/config.js 產生,不要手改。
// Website settings. Not secret (the client ID is public in any Google sign-in page by design).
window.AMD_CONFIG = {
  // router-backend on Render + the all-mo-diary prefix. No trailing slash.
  apiBase: "",
  // Google Cloud project all-mo-diary, OAuth client "all-mo-diary-web" (same as ALL_MO_DIARY__GOOGLE_CLIENT_ID).
  googleClientId: "759877918158-gp2co5qrmhataeu1rafvr3tl5odtkmc4.apps.googleusercontent.com",
  // Google Play address once the app is listed; empty shows 「目前尚未在 Google Play 上架」.
  playUrl: "",
  // The home page's download button links to the APK on the all-mo-diary-app GitHub Release.
  // For a new version: create Release v<version> with all-mo-diary-<version>.apk attached, then set
  // this. Empty hides the button.
  apkVersion: "",
};

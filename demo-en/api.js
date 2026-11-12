// 由 demo/tools/build.py 從 demo/api.js 產生,不要手改。
// Demo version of js/api.js: the same interface (window.amdApi), but no request ever leaves the page.
//
// - Sign-in: the Google credential is decoded in the browser only, to show the e-mail; it is sent
//   nowhere. Whoever signs in is an admin. The sign-in is kept in this page's own localStorage
//   (index.html prefixes the keys), so it survives a reload.
// - Reads: answered from fixtures.js, in the same shapes as the backend's admin routes.
// - Writes (save, publish, add, delete, upload): nothing changes; a notice says the demo doesn't
//   update real data.
// build.py copies this file to demo-en/ unchanged; every text shown to the user is in fixtures.js.
(function () {
  const KEY = "amd_admin_token";
  const EMAIL_KEY = "amd_demo_email";
  const fx = window.AMD_DEMO_FIXTURES || { text: {} };

  function read(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function write(k, v) {
    try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) { /* private browsing */ }
  }
  function token() { return read(KEY); }
  function setToken(t) {
    write(KEY, t);
    if (!t) write(EMAIL_KEY, null);
  }

  // Google's ID token is a JWT: the middle base64url part is JSON with the e-mail. Not verified;
  // only displayed.
  function emailFrom(credential) {
    try {
      const part = credential.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const bytes = Uint8Array.from(atob(part), (c) => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes)).email || fx.guestEmail;
    } catch (e) {
      return fx.guestEmail;
    }
  }

  function toast(text) {
    let box = document.getElementById("demo-toast");
    if (!box) {
      box = document.createElement("div");
      box.id = "demo-toast";
      box.setAttribute("role", "status");
      box.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:1000;" +
        "max-width:calc(100vw - 32px);padding:12px 18px;border-radius:12px;background:var(--text);color:var(--bg);" +
        "font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:opacity .2s;";
      document.body.appendChild(box);
    }
    box.textContent = text;
    box.style.opacity = "1";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { box.style.opacity = "0"; }, 3000);
  }

  // Writes only show the notice. The error thrown has no text, so no "saved" message appears and the
  // console's error banner stays empty.
  const silent = { status: 0, error: "", toString: () => "" };
  function readOnly() {
    toast(fx.text.readOnly);
    throw silent;
  }

  function overview() {
    return {
      fonts_version: fx.release.version,
      cache: { loaded: true, loaded_at: fx.cacheLoadedAt, fonts_version: fx.release.version },
      cache_consistent: true,
      feedback_table_mb: 0.02,
      feedback_table_limit_mb: 150,
      new_feedback: fx.feedback.filter((f) => f.status === "new").length,
      fonts_upload_configured: true,
    };
  }

  function feedbackList(query) {
    const q = new URLSearchParams(query);
    const items = fx.feedback.filter((f) => ["kind", "status", "app_version", "device_model"].every((k) => !q.get(k) || f[k] === q.get(k)));
    const page = Math.max(parseInt(q.get("page") || "1", 10) || 1, 1);
    const perPage = 50;
    const uniq = (k) => [...new Set(fx.feedback.map((f) => f[k]))].sort();
    return {
      total: items.length, page, per_page: perPage,
      items: items.slice((page - 1) * perPage, page * perPage).map((f) => ({ ...f, description: f.description.slice(0, 120) })),
      app_versions: uniq("app_version").reverse(), device_models: uniq("device_model"),
    };
  }

  async function call(method, path, body) {
    await new Promise((r) => setTimeout(r, 150));
    const [route, query = ""] = path.split("?");
    if (method === "POST" && route === "/api/admin/login") {
      write(EMAIL_KEY, emailFrom(body && body.credential));
      return { token: "demo" };
    }
    if (method === "POST" && route === "/api/admin/logout") return { ok: true };
    if (!token()) throw { status: 401, error: "" };
    if (method === "GET") {
      if (route === "/api/admin/me") return { email: read(EMAIL_KEY) || fx.guestEmail };
      if (route === "/api/admin/overview") return overview();
      if (route === "/api/admin/fonts") return { fonts: fx.fonts, release: fx.release };
      if (route === "/api/admin/app-config") return { ...fx.appConfig };
      if (route === "/api/admin/admins") return { admins: fx.admins };
      if (route === "/api/admin/feedback") return feedbackList(query);
      const m = route.match(/^\/api\/admin\/feedback\/(.+)$/);
      if (m) {
        const f = fx.feedback.find((x) => x.id === m[1]);
        if (f) return f;
      }
      throw { status: 404, error: fx.text.notFound };
    }
    // Reloading the cache changes no data; answered as usual.
    if (method === "POST" && route === "/api/admin/cache/reload") return overview().cache;
    return readOnly();
  }

  async function upload() {
    await new Promise((r) => setTimeout(r, 150));
    return readOnly();
  }

  window.amdApi = { call, token, setToken, upload };
})();

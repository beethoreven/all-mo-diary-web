// Home page: Google sign-in for admins. Ordinary users signing in get nothing;
// an admin gets the 管理後台 link. The credential goes to the backend once to check for an admin and
// is then discarded; the admin session that comes back is what the console uses.
(function () {
  const cfg = window.AMD_CONFIG;
  const api = window.amdApi;
  const $ = (id) => document.getElementById(id);

  if (cfg.playUrl) {
    $("play").innerHTML = "";
    const a = document.createElement("a");
    a.href = cfg.playUrl;
    a.className = "btn primary";
    a.textContent = "到 Google Play 下載";
    $("play").appendChild(a);
  }

  // The APK is attached to a GitHub Release of all-mo-diary-app: tag v<version>, file
  // all-mo-diary-<version>.apk. Empty apkVersion hides the button.
  if (cfg.apkVersion) {
    const v = cfg.apkVersion;
    $("apk-link").href = `https://github.com/beethoreven/all-mo-diary-app/releases/download/v${v}/all-mo-diary-${v}.apk`;
    $("apk-version").textContent = `版本 ${v}`;
    $("apk").hidden = false;
    $("apk-note").hidden = false;
  }

  // The introduction and the two documents are tabs on this page. ?doc=privacy opens that document
  // directly, and switching tabs updates the address so it can be copied. legal.html stays for the
  // links inside the app and on Google's consent screen.
  const DOCS = { terms: "使用者條款", privacy: "隱私權政策" };
  const loaded = {};
  async function showTab(doc) {
    if (!Object.prototype.hasOwnProperty.call(DOCS, doc)) doc = "";
    for (const b of $("tabs").querySelectorAll("button")) b.classList.toggle("active", b.dataset.doc === doc);
    $("intro").hidden = !!doc;
    $("doc").hidden = !doc;
    document.title = doc ? DOCS[doc] + " - 全心日記" : "全心日記";
    history.replaceState(null, "", doc ? "?doc=" + doc : location.pathname);
    if (!doc) return;
    if (!loaded[doc]) {
      $("doc").innerHTML = '<p class="muted">載入中…</p>';
      try {
        const r = await fetch("legal/" + doc + ".md", { cache: "no-cache" });
        if (!r.ok) throw new Error();
        loaded[doc] = window.renderMarkdown(await r.text());
      } catch (e) {
        $("doc").innerHTML = "<p>載入失敗，請重新整理。</p>";
        return;
      }
    }
    // Only if that tab is still the one shown: a slow load must not cover a tab picked meanwhile.
    if (!$("doc").hidden && document.querySelector("#tabs button.active").dataset.doc === doc) $("doc").innerHTML = loaded[doc];
  }
  $("tabs").onclick = (ev) => {
    const b = ev.target.closest("button");
    if (b) showTab(b.dataset.doc);
  };
  showTab(new URLSearchParams(location.search).get("doc") || "");

  async function showAdmin() {
    try {
      const me = await api.call("GET", "/api/admin/me", undefined, { timeoutMs: 20000 });
      $("account").textContent = me.email;
      $("admin-link").hidden = false;
      $("gsi").hidden = true;
    } catch (e) {
      $("admin-link").hidden = true;
    }
  }

  async function onCredential(resp) {
    $("login-note").textContent = "確認中…（後端可能正在喚醒，最多約一分鐘）";
    try {
      const data = await api.call("POST", "/api/admin/login", { credential: resp.credential });
      api.setToken(data.token);
      $("login-note").textContent = "";
      await showAdmin();
    } catch (e) {
      api.setToken(null);
      $("login-note").textContent = e.status === 403 ? "已登入。這個帳號不是管理員，網站上沒有其他功能。" : e.error;
    }
  }

  window.amdHomeGsiReady = function () {
    if (!cfg.googleClientId || !window.google) return;
    google.accounts.id.initialize({ client_id: cfg.googleClientId, callback: onCredential, auto_select: false });
    // A dark button in dark mode; the default outline button becomes a white ring on a dark page.
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    google.accounts.id.renderButton($("gsi"), { type: "icon", shape: "circle", theme: dark ? "filled_black" : "outline", size: "large" });
  };

  // A stored admin session survives reloads and new tabs (localStorage).
  if (api.token()) showAdmin();
})();

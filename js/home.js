// Home page: Google sign-in for admins (as mama-fufood-web). Ordinary users signing in get nothing;
// an admin gets the 管理後台 link. The credential goes to the backend once to check for an admin and
// is then discarded; the admin session that comes back is what the console uses.
(function () {
  const cfg = window.AMD_CONFIG;
  const api = window.amdApi;
  const $ = (id) => document.getElementById(id);

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

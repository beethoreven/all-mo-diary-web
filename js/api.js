// Calls the backend. The admin console uses our own session (traded for
// the Google credential at sign-in), kept in this browser's localStorage so it survives reloads and
// restarts; the Google ID token is never used as the ongoing credential (it expires in an hour).
(function () {
  const KEY = "amd_admin_token";
  const cfg = window.AMD_CONFIG;

  function token() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setToken(t) {
    try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch (e) { /* 私密瀏覽 */ }
  }

  // Render 免費方案閒置 15 分鐘會休眠,喚醒約一分鐘:第一次請求給長一點的時間。
  async function call(method, path, body, { timeoutMs = 75000, raw = false } = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const headers = {};
    const t = token();
    if (t) headers["Authorization"] = "Bearer " + t;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    let resp;
    try {
      resp = await fetch(cfg.apiBase + path, {
        method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctrl.signal,
      });
    } catch (e) {
      throw { status: 0, error: "連不上後端（可能正在喚醒，請等一下再試）" };
    } finally {
      clearTimeout(timer);
    }
    if (raw && resp.ok) return resp;
    let data = {};
    try { data = await resp.json(); } catch (e) { /* 不是 JSON */ }
    if (!resp.ok) {
      if (resp.status === 401) setToken(null);
      throw { status: resp.status, code: data.code, error: data.error || `後端回應錯誤（${resp.status}）` };
    }
    return data;
  }

  // Uploads a file as the raw request body, reporting progress (0–1). Font files can be tens of MB.
  // Every way the request can end settles the promise (load, network error, timeout, abort), so the
  // caller's "uploading" state always clears.
  function upload(path, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", cfg.apiBase + path);
      // The backend gives GitHub up to 10 minutes; this waits a little longer than that.
      xhr.timeout = 15 * 60 * 1000;
      const t = token();
      if (t) xhr.setRequestHeader("Authorization", "Bearer " + t);
      xhr.setRequestHeader("Content-Type", "application/gzip");
      xhr.upload.onprogress = (ev) => { if (ev.lengthComputable && onProgress) onProgress(ev.loaded / ev.total); };
      xhr.onload = () => {
        let data = {};
        try { data = JSON.parse(xhr.responseText); } catch (e) { /* not JSON */ }
        if (xhr.status >= 200 && xhr.status < 300) return resolve(data);
        if (xhr.status === 401) setToken(null);
        reject({ status: xhr.status, code: data.code, error: data.error || `後端回應錯誤（${xhr.status}）` });
      };
      xhr.onerror = () => reject({ status: 0, error: "連不上後端，請稍後再試" });
      xhr.ontimeout = () => reject({ status: 0, error: "上傳太久沒有完成，請再試一次" });
      xhr.onabort = () => reject({ status: 0, error: "上傳被中斷了，請再試一次" });
      xhr.send(file);
    });
  }

  window.amdApi = { call, token, setToken, upload };
})();

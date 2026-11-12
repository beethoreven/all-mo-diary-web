// 由 demo/tools/build.py 從 js/admin.js 產生,不要手改。
// 全心日記 admin console.
// ★ The lock here is cosmetic: every admin API on the backend requires an admin session
//   (router-backend apps/diary/access.py).
(function () {
  const api = window.amdApi;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Times in Taipei time: 2026-11-11 16:22 GMT+8. Anything unparseable is shown as is.
  const TIME_PARTS = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const fmtTime = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d)) return String(iso);
    const p = Object.fromEntries(TIME_PARTS.formatToParts(d).map((x) => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute} GMT+8`;
  };
  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1) + " MB";
  // Every load takes a number; a slow old response that comes back after a newer one is dropped
  // instead of overwriting the newer screen.
  const gen = { fonts: 0, feedback: 0, detail: 0 };
  let feedbackFilters = { kind: "", status: "", app_version: "", device_model: "", page: 1 };
  // Font uploads in progress: font id → progress (0–1). Kept here, not in the table: the table is
  // rebuilt by any edit, publish or tab switch during an upload, and the rebuilt row must still show
  // the upload and not offer a second one.
  const uploading = new Map();

  function message(text, kind) {
    $("msg").innerHTML = text ? `<div class="banner ${kind === "warn" ? "warn" : ""}">${esc(text)}</div>` : "";
    if (text) setTimeout(() => { if ($("msg").textContent.includes(text)) $("msg").innerHTML = ""; }, 6000);
  }

  async function run(fn, okText) {
    try {
      await fn();
      if (okText) message(okText);
    } catch (e) {
      message(e.error || String(e), "warn");
      if (e.status === 401) showLogin();
    }
  }

  // Signing in happens on the home page (the console link appears there for admins).
  function showLogin() {
    location.replace("index.html");
  }

  async function start() {
    if (!api.token()) return showLogin();
    try {
      const me = await api.call("GET", "/api/admin/me");
      $("who").textContent = me.email;
      $("status").hidden = true;
      $("app").hidden = false;
      $("logout").hidden = false;
      await loadFonts();
    } catch (e) {
      if (e.status === 401 || e.status === 403) return showLogin();
      // Backend asleep or unreachable: the session is still stored; stay so a reload can retry.
      $("status-msg").textContent = e.error;
      $("status").hidden = false;
    }
  }

  $("logout").onclick = () => run(async () => {
    try { await api.call("POST", "/api/admin/logout"); } finally { api.setToken(null); showLogin(); }
  });

  const TABS = ["fonts", "version", "feedback", "admins", "system"];
  $("tabs").onclick = (ev) => {
    const tab = ev.target.dataset && ev.target.dataset.tab;
    if (!tab) return;
    for (const b of $("tabs").querySelectorAll("button")) b.classList.toggle("active", b.dataset.tab === tab);
    for (const t of TABS) $("tab-" + t).hidden = t !== tab;
    ({ fonts: loadFonts, version: loadVersion, feedback: loadFeedback, admins: loadAdmins, system: loadSystem })[tab]();
  };

  // ── Fonts ───────────────────────────────────────────────
  async function loadFonts() {
    const mine = ++gen.fonts;
    await run(async () => {
      const [data, o] = await Promise.all([api.call("GET", "/api/admin/fonts"), api.call("GET", "/api/admin/overview")]);
      if (mine !== gen.fonts) return;
      renderFonts(data, o);
    });
  }

  function renderFonts(data, o) {
    const release = data.release;
    const publishedIds = new Set(release ? release.content.fonts.map((f) => f.id) : []);
    const unpublished = data.fonts.some((f) => f.download_url && (!f.published ||
      JSON.stringify(pick(f)) !== JSON.stringify(pick(release.content.fonts.find((r) => r.id === f.id) || {}))));
    const rows = data.fonts.map((f) => `<tr>
        <td>${f.id}</td>
        <td><input data-font="${f.id}" data-f="name" value="${esc(f.name)}" class="cell-name"></td>
        <td><input data-font="${f.id}" data-f="sort" value="${f.sort}" class="cell-sort" inputmode="numeric"></td>
        <td><label><input type="checkbox" data-font="${f.id}" data-f="licensed" ${f.licensed ? "checked" : ""}> Licensed</label></td>
        <td><label><input type="checkbox" data-font="${f.id}" data-f="disabled" ${f.disabled ? "checked" : ""}> Disabled</label></td>
        <td>${f.download_url
          ? `<span title="${esc(f.file_name)}">Installed ${mb(f.font_bytes)}<br><span class="muted">Download ${mb(f.download_bytes)}</span></span>`
          : '<span class="muted">Not uploaded</span>'}
          <br><input type="file" accept=".gz,application/gzip" data-upload="${f.id}" ${o.fonts_upload_configured && !uploading.has(f.id) ? "" : "disabled"}>
          <progress data-progress="${f.id}" max="1" value="${uploading.get(f.id) || 0}" ${uploading.has(f.id) ? "" : "hidden"}></progress></td>
        <td>${f.published || publishedIds.has(f.id) ? '<span class="muted">Published</span>' : `<button data-del-font="${f.id}" class="danger">Delete</button>`}</td>
      </tr>`).join("");
    $("tab-fonts").innerHTML = `
      ${o.fonts_upload_configured ? "" : '<div class="banner warn">The backend has no GitHub repo for fonts yet (DIARY__FONTS_REPO, DIARY__GITHUB_TOKEN), so uploads are off.</div>'}
      ${o.cache_consistent ? "" : '<div class="banner warn">The cache and the database disagree on the version. Go to "System" and press "Reload cache".</div>'}
      <div class="card">
        <p class="muted">Upload the <code>.otf.gz</code> made by the <strong>font subsetting tool</strong> (tools/ in the meta repo).
        Changes are saved as a draft; the App gets the new list only after "Publish". IDs never change and are never reused; a published font can't be deleted, only disabled.
        "Licensed" is only a label and doesn't block uploads. The built-in Noto Sans TC is not in this list.</p>
        <div class="row"><strong>Font list</strong><span class="muted">Published: ${esc(release ? release.version : "none")}</span>
          ${unpublished ? '<span class="pill warn">The draft has unpublished changes</span>' : '<span class="pill">Same as published</span>'}
          <span class="grow"></span><button id="publish-fonts" class="primary">Publish</button></div>
      </div>
      <div class="card admin">
        <div class="scroll-x"><table><thead><tr><th>ID</th><th>Name</th><th>Order</th><th>Licence</th><th></th><th>File</th><th></th></tr></thead>
        <tbody>${rows || '<tr><td colspan="7" class="muted">No fonts yet</td></tr>'}</tbody></table></div>
        <div class="row" style="margin-top:8px"><input id="new-font-name" class="field-name" placeholder="Font name (as shown in the App)">
          <input id="new-font-sort" class="cell-sort" placeholder="Order" inputmode="numeric">
          <label><input type="checkbox" id="new-font-licensed"> Licensed</label>
          <button id="add-font">Add font</button></div>
      </div>`;
    bindFonts();
  }

  function pick(f) {
    return { name: f.name, sort: f.sort, disabled: f.disabled, licensed: f.licensed, file_name: f.file_name };
  }

  function bindFonts() {
    $("publish-fonts").onclick = () => {
      if (!confirm("After publishing, the App gets the new font list at its next update check. Continue?")) return;
      run(async () => {
        const r = await api.call("POST", "/api/admin/fonts/publish");
        message(`Published version ${r.version} (${r.count} fonts)${r.cache_reloaded ? "" : "; the cache will catch up shortly"}`);
        await loadFonts();
      });
    };
    $("add-font").onclick = () => run(async () => {
      const sort = parseInt($("new-font-sort").value || "0", 10);
      await api.call("POST", "/api/admin/fonts", { name: $("new-font-name").value, sort: isNaN(sort) ? 0 : sort,
        licensed: $("new-font-licensed").checked });
      await loadFonts();
    }, "Added. Now upload the font file");
    document.querySelectorAll("[data-font]").forEach((el) => {
      el.onchange = () => {
        const f = el.dataset.f;
        let value = el.type === "checkbox" ? el.checked : el.value;
        if (f === "sort") { value = parseInt(value, 10); if (isNaN(value)) return message("Order must be a whole number", "warn"); }
        run(async () => { await api.call("PATCH", "/api/admin/fonts/" + el.dataset.font, { [f]: value }); await loadFonts(); }, "Saved as draft");
      };
    });
    document.querySelectorAll("[data-del-font]").forEach((b) => {
      b.onclick = () => {
        if (!confirm("Delete this font?")) return;
        run(async () => { await api.call("DELETE", "/api/admin/fonts/" + b.dataset.delFont); await loadFonts(); }, "Deleted");
      };
    });
    document.querySelectorAll("[data-upload]").forEach((input) => {
      input.onchange = () => {
        const file = input.files && input.files[0];
        if (!file) return;
        if (!file.name.endsWith(".gz")) { message("Upload the .otf.gz made by the font subsetting tool", "warn"); input.value = ""; return; }
        const id = Number(input.dataset.upload);
        if (uploading.has(id)) return;
        uploading.set(id, 0);
        input.disabled = true;
        // Looked up on every update: the table may have been rebuilt since the upload started.
        const showProgress = () => {
          const bar = document.querySelector(`[data-progress="${id}"]`);
          if (bar) { bar.hidden = false; bar.value = uploading.get(id) || 0; }
        };
        showProgress();
        run(async () => {
          try {
            await api.upload(`/api/admin/fonts/${id}/file`, file, (p) => { uploading.set(id, p); showProgress(); });
          } finally {
            // Success or failure, the row is rebuilt from the server without the upload state.
            uploading.delete(id);
            await loadFonts();
          }
        }, "Uploaded. Remember to press \"Publish\"");
      };
    });
  }

  // ── App version and forced update ───────────────────────
  async function loadVersion() {
    await run(async () => {
      const c = await api.call("GET", "/api/admin/app-config");
      $("tab-version").innerHTML = `<div class="card">
        <p class="muted">Use a forced update only for serious problems or legal conflicts; it only reaches phones that are online and run the daily check. The reason written here is shown on screen.</p>
        <p><label>Minimum usable App version (x.y.z)<br><input id="cfg-min" value="${esc(c.min_app_version)}"></label></p>
        <p><label>Reason for the forced update<br><textarea id="cfg-reason" maxlength="300">${esc(c.force_reason)}</textarea></label></p>
        <p><label>Update link (https://; may be empty before listing)<br><input id="cfg-url" value="${esc(c.update_url)}" style="width:100%"></label></p>
        <p><label>Announcement (shown once at the App's daily check; empty shows nothing)<br><input id="cfg-ann" value="${esc(c.announcement)}" style="width:100%" maxlength="300"></label></p>
        <p class="muted">Last changed: ${esc(fmtTime(c.updated_at))} ${esc(c.updated_by)}</p>
        <button id="cfg-save" class="primary">Save</button></div>`;
      $("cfg-save").onclick = () => {
        if (!confirm("Saving takes effect immediately. Continue?")) return;
        run(async () => {
          await api.call("PUT", "/api/admin/app-config", {
            min_app_version: $("cfg-min").value.trim(), force_reason: $("cfg-reason").value,
            update_url: $("cfg-url").value.trim(), announcement: $("cfg-ann").value,
          });
          await loadVersion();
        }, "Saved");
      };
    });
  }

  // ── Feedback ────────────────────────────────────────────
  const STATUS = { new: "New", in_progress: "In progress", done: "Done", wont_fix: "Won't fix" };
  const KIND = { suggestion: "Suggestion", problem: "Problem" };

  async function loadFeedback() {
    const mine = ++gen.feedback;
    await run(async () => {
      const q = new URLSearchParams(Object.entries(feedbackFilters).filter(([, v]) => v)).toString();
      const data = await api.call("GET", "/api/admin/feedback?" + q);
      if (mine !== gen.feedback) return;
      const opt = (values, labels, current) => '<option value="">All</option>' +
        values.map((v) => `<option value="${esc(v)}" ${v === current ? "selected" : ""}>${esc(labels ? labels[v] : v)}</option>`).join("");
      $("tab-feedback").innerHTML = `<div class="card admin">
          <div class="row">
            <select id="f-kind">${opt(Object.keys(KIND), KIND, feedbackFilters.kind)}</select>
            <select id="f-status">${opt(Object.keys(STATUS), STATUS, feedbackFilters.status)}</select>
            <select id="f-ver">${opt(data.app_versions, null, feedbackFilters.app_version)}</select>
            <select id="f-model">${opt(data.device_models, null, feedbackFilters.device_model)}</select>
            <span class="muted">${data.total} in total (kept up to 90 days)</span>
          </div>
          <div class="scroll-x"><table><thead><tr><th>Time</th><th>Type</th><th>Status</th><th>Description</th><th>Version</th><th>Model</th></tr></thead><tbody>
          ${data.items.map((i) => `<tr data-fb="${i.id}" style="cursor:pointer">
            <td>${esc(fmtTime(i.received_at))}</td><td>${esc(KIND[i.kind])}</td><td>${esc(STATUS[i.status])}</td>
            <td>${esc(i.description)}</td><td>${esc(i.app_version)}</td><td>${esc(i.device_model)}</td></tr>`).join("") ||
            '<tr><td colspan="6" class="muted">No feedback</td></tr>'}
          </tbody></table></div>
          <div class="row" style="margin-top:8px">
            <button id="f-prev" ${data.page <= 1 ? "disabled" : ""}>Previous</button>
            <span class="muted">Page ${data.page}</span>
            <button id="f-next" ${data.page * data.per_page >= data.total ? "disabled" : ""}>Next</button>
          </div>
        </div>
        <div id="fb-detail"></div>
        <div class="card"><h3 style="margin-top:0">Personal data deletion request</h3>
          <p class="muted">Delete all feedback from one e-mail (Privacy Policy, section 7).</p>
          <div class="row"><input id="del-email" class="field-name" placeholder="email@example.com"><button id="del-email-btn" class="danger">Delete all</button></div>
        </div>`;
      const set = (k) => (ev) => { feedbackFilters[k] = ev.target.value; feedbackFilters.page = 1; loadFeedback(); };
      $("f-kind").onchange = set("kind");
      $("f-status").onchange = set("status");
      $("f-ver").onchange = set("app_version");
      $("f-model").onchange = set("device_model");
      $("f-prev").onclick = () => { feedbackFilters.page -= 1; loadFeedback(); };
      $("f-next").onclick = () => { feedbackFilters.page += 1; loadFeedback(); };
      document.querySelectorAll("[data-fb]").forEach((tr) => { tr.onclick = () => showFeedback(tr.dataset.fb); });
      $("del-email-btn").onclick = () => {
        const email = $("del-email").value.trim();
        if (!email || !confirm(`Delete all feedback from ${email}? This can't be undone.`)) return;
        run(async () => {
          const r = await api.call("POST", "/api/admin/feedback/delete-by-email", { email });
          message(`Deleted ${r.deleted}`);
          await loadFeedback();
        });
      };
    });
  }

  function renderLogs(logs) {
    if (!logs) return '<p class="muted">No log (suggestions come without one).</p>';
    const lines = (logs.logs || []).map((l) => {
      const { t, lv, c, ...rest } = l;
      return `${t} ${String(lv).toUpperCase().padEnd(5)} ${c} ${Object.keys(rest).length ? JSON.stringify(rest) : ""}`;
    });
    return `<h4>Log (${lines.length} lines)</h4><pre class="log">${esc(lines.join("\n"))}</pre>
      ${logs.exit_reasons && logs.exit_reasons.length ? `<h4>Last exit reasons</h4><pre class="log">${esc(JSON.stringify(logs.exit_reasons, null, 1))}</pre>` : ""}
      ${logs.text ? `<pre class="log">${esc(logs.text)}</pre>` : ""}`;
  }

  async function showFeedback(id) {
    const mine = ++gen.detail;
    await run(async () => {
      const f = await api.call("GET", "/api/admin/feedback/" + id);
      if (mine !== gen.detail) return;
      $("fb-detail").innerHTML = `<div class="card">
        <div class="row"><strong>${esc(KIND[f.kind])}</strong><span class="muted">${esc(f.id)}</span><span class="grow"></span>
          <button id="fb-close">Close</button></div>
        <p>${esc(f.description).replace(/\n/g, "<br>")}</p>
        <p class="muted">Email: ${esc(f.email)} | Received: ${esc(fmtTime(f.received_at))} | Phone time: ${esc(fmtTime(f.device_time))}<br>
        App ${esc(f.app_version)} (${esc(f.build_number)}) | ${esc(f.device_model)} | ${esc(f.os_version)} | Install ID ${esc(f.install_id)}</p>
        <div class="row">
          <select id="fb-status">${Object.keys(STATUS).map((s) => `<option value="${s}" ${s === f.status ? "selected" : ""}>${STATUS[s]}</option>`).join("")}</select>
          <input id="fb-note" class="grow" value="${esc(f.admin_note)}" placeholder="Handling note">
          <button id="fb-save" class="primary">Save</button>
          <button id="fb-delete" class="danger">Delete</button>
        </div>
        <h4>Snapshot</h4><pre class="log">${esc(JSON.stringify(f.snapshot, null, 1))}</pre>
        ${renderLogs(f.logs)}
      </div>`;
      $("fb-close").onclick = () => { $("fb-detail").innerHTML = ""; };
      $("fb-save").onclick = () => run(async () => {
        await api.call("PATCH", "/api/admin/feedback/" + id, { status: $("fb-status").value, admin_note: $("fb-note").value });
        await loadFeedback();
      }, "Saved");
      $("fb-delete").onclick = () => {
        if (!confirm("Delete this feedback?")) return;
        run(async () => { await api.call("DELETE", "/api/admin/feedback/" + id); await loadFeedback(); }, "Deleted");
      };
      $("fb-detail").scrollIntoView({ behavior: "smooth" });
    });
  }

  // ── Admins ──────────────────────────────────────────────
  async function loadAdmins() {
    await run(async () => {
      const data = await api.call("GET", "/api/admin/admins");
      $("tab-admins").innerHTML = `<div class="card admin">
        <table><thead><tr><th>Email</th><th>Note</th><th></th></tr></thead><tbody>
        ${data.admins.map((a) => `<tr><td>${esc(a.email)}</td><td>${esc(a.note)}</td>
          <td>${a.fixed ? '<span class="muted">Set by environment variable</span>' : `<button data-rm="${esc(a.email)}" class="danger">Remove</button>`}</td></tr>`).join("")}
        </tbody></table>
        <div class="row" style="margin-top:8px"><input id="adm-email" class="field-name" placeholder="Email"><input id="adm-note" class="field-name" placeholder="Note"><button id="adm-add" class="primary">Add admin</button></div>
      </div>`;
      $("adm-add").onclick = () => run(async () => {
        await api.call("POST", "/api/admin/admins", { email: $("adm-email").value.trim(), note: $("adm-note").value.trim() });
        await loadAdmins();
      }, "Added");
      document.querySelectorAll("[data-rm]").forEach((b) => {
        b.onclick = () => {
          if (!confirm(`Remove ${b.dataset.rm}?`)) return;
          run(async () => { await api.call("DELETE", "/api/admin/admins/" + encodeURIComponent(b.dataset.rm)); await loadAdmins(); }, "Removed");
        };
      });
    });
  }

  // ── System ──────────────────────────────────────────────
  async function loadSystem() {
    await run(async () => {
      const o = await api.call("GET", "/api/admin/overview");
      $("tab-system").innerHTML = `<div class="card">
        <p>Font list version in cache: ${esc(o.cache.loaded ? (o.cache.fonts_version || "not published") : "not loaded")}<br>
        Font list version in database: ${esc(o.fonts_version || "not published")}<br>
        ${o.cache_consistent ? '<span class="ok">Consistent</span>' : '<span class="warn">Inconsistent</span>'}
        <span class="muted">(cache loaded ${esc(fmtTime(o.cache.loaded_at))})</span></p>
        <p>Feedback table: ${o.feedback_table_mb} MB (limit ${o.feedback_table_limit_mb} MB) | New feedback: ${o.new_feedback}</p>
        <button id="reload-cache">Reload cache</button>
        <p class="muted">If data was ever changed directly with SQL, press this or restart the backend.</p>
      </div>`;
      $("reload-cache").onclick = () => run(async () => { await api.call("POST", "/api/admin/cache/reload"); await loadSystem(); }, "Reloaded");
    });
  }

  start();
})();

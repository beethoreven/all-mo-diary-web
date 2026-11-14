"""英文示範版(demo-en/)的中英對照表,給 build.py 用。

每個檔案一串 (中文原文, 英文),依序替換;每一句都必須在原文裡找得到,找不到 build.py 就報錯
(多半是正式版改了字,這裡要跟著改)。

術語表(全站統一):
    全心日記 → all-mo-diary            本 App → the App
    使用者條款 → Terms of Use           隱私權政策 → Privacy Policy
    意見回饋 → Feedback                 管理後台 → Admin console
    字體 → font                         發布 → publish
    草稿 → draft                        快取 → cache
    日記同步 → Sync diaries to cloud    圖片與影片存到雲端 → Save images and videos to cloud
    營運者名稱「阿舍老師」照原文保留。
"""

INDEX = [
    ('lang="zh-Hant-TW"', 'lang="en"'),
    ("<title>全心日記</title>", "<title>all-mo-diary</title>"),
    (
        'content="一天一篇的日記 App。日記、圖片與影片只存在你的手機與你自己的 Google 雲端硬碟。"',
        'content="A one-entry-a-day diary app. Your diaries, images and videos stay on your phone and in your own Google Drive."',
    ),
    ('<span class="title">全心日記</span>', '<span class="title">all-mo-diary</span>'),
    (">管理後台</a>", ">Admin console</a>"),
    (">介紹</button>", ">About</button>"),
    (">使用者條款</button>", ">Terms of Use</button>"),
    (">隱私權政策</button>", ">Privacy Policy</button>"),
    ('alt="App 圖示"', 'alt="App icon"'),
    ('font-size: 22px">全心日記</h1>', 'font-size: 22px">all-mo-diary</h1>'),
    (
        "一天一篇的日記：可以調整字體大小、粗體、顏色，加上圖片與影片，\n"
        "              再用行事曆、篩選與搜尋找回過去的日記。",
        "A diary with one entry a day: change the font size, bold and colour, add images and videos,\n"
        "              and find past entries again with the calendar, filters and search.",
    ),
    (">你的日記只在你手上</h2>", ">Your diary stays with you</h2>"),
    (
        "<li>日記、圖片與影片只存在你的手機，或你自己的 Google 雲端硬碟（開啟雲端功能時）。</li>",
        "<li>Your diaries, images and videos are stored only on your phone, or in your own Google Drive when you turn on cloud features.</li>",
    ),
    (
        "<li>匯出檔整份加密，只能用匯出時的 Google 帳號匯入；我們拿不到金鑰。</li>",
        "<li>Export files are fully encrypted and can only be imported with the Google account that created them. We never have the key.</li>",
    ),
    ("<li>沒有廣告，也沒有任何分析工具。</li>", "<li>No ads and no analytics tools.</li>"),
    ('font-size: 17px">下載</h2>', 'font-size: 17px">Download</h2>'),
    (">下載最新版全心日記</a>", ">Download the latest all-mo-diary</a>"),
    (
        "Android 手機下載後點開安裝；第一次安裝需要允許瀏覽器「安裝不明應用程式」。",
        "On an Android phone, open the download to install it. The first time, allow your browser to \"install unknown apps\".",
    ),
    ("目前尚未在 Google Play 上架。", "Not yet available on Google Play."),
    ("無法載入 Google 登入元件（不影響瀏覽網站）。", "Could not load Google sign-in (browsing the site is not affected)."),
    (">不用 Google 帳號直接進入</button>", ">Enter without a Google account</button>"),
]

HOME = [
    ('"到 Google Play 下載"', '"Get it on Google Play"'),
    ("`版本 ${v}`", "`Version ${v}`"),
    ('{ terms: "使用者條款", privacy: "隱私權政策" }', '{ terms: "Terms of Use", privacy: "Privacy Policy" }'),
    ('DOCS[doc] + " - 全心日記" : "全心日記"', 'DOCS[doc] + " - all-mo-diary" : "all-mo-diary"'),
    ("載入中…", "Loading…"),
    ("載入失敗，請重新整理。", "Couldn't load. Please refresh."),
    ("確認中…（後端可能正在喚醒，最多約一分鐘）", "Checking… (the backend may be waking up; up to about a minute)"),
    (
        "已登入。這個帳號不是管理員，網站上沒有其他功能。",
        "Signed in. This account is not an admin; the site has nothing else to offer.",
    ),
]

# 英文翻譯是照哪一版的中文翻的:legal/<doc>.md 的 SHA-256。中文改了就要重翻、再更新這裡。
LEGAL_SOURCES = {
    "terms": "e0ca6e48b84b5586393237f264bca7903a8488ea07f9d568532b7f2faf4eb0a4",
    "privacy": "eccd5c2f9a180465a0fbde4014061048a50c77ab56259466b0a20fe89191b5fc",
}

ADMIN_HTML = [
    ('lang="zh-Hant-TW"', 'lang="en"'),
    ("<title>管理後台 - 全心日記</title>", "<title>Admin console - all-mo-diary</title>"),
    ('alt="回首頁"', 'alt="Home"'),
    ('<span class="title">管理後台</span>', '<span class="title">Admin console</span>'),
    (">登出</button>", ">Sign out</button>"),
    (">字體</button>", ">Fonts</button>"),
    (">App 版本</button>", ">App version</button>"),
    (">意見回饋</button>", ">Feedback</button>"),
    (">管理員</button>", ">Admins</button>"),
    (">系統</button>", ">System</button>"),
]

ADMIN = [
    # 字體
    ("> 有授權</label></td>", "> Licensed</label></td>"),
    ("> 停用</label></td>", "> Disabled</label></td>"),
    (">安裝後 ${mb(f.font_bytes)}<br>", ">Installed ${mb(f.font_bytes)}<br>"),
    (">下載 ${mb(f.download_bytes)}</span>", ">Download ${mb(f.download_bytes)}</span>"),
    (">還沒上傳</span>", ">Not uploaded</span>"),
    (">已發布</span>", ">Published</span>"),
    ('class="danger">刪除</button>`}</td>', 'class="danger">Delete</button>`}</td>'),
    (
        "後端還沒設定字體的 GitHub repo（ALL_MO_DIARY__FONTS_REPO、ALL_MO_DIARY__GITHUB_TOKEN），目前不能上傳。",
        "The backend has no GitHub repo for fonts yet (ALL_MO_DIARY__FONTS_REPO, ALL_MO_DIARY__GITHUB_TOKEN), so uploads are off.",
    ),
    (
        "快取版本和資料庫版本不一致，請到「系統」按「重新載入快取」。",
        "The cache and the database disagree on the version. Go to \"System\" and press \"Reload cache\".",
    ),
    (
        "上傳的是<strong>字體瘦身工具</strong>產生的 <code>.otf.gz</code>（meta repo 的 tools/字體瘦身.command）。",
        "Upload the <code>.otf.gz</code> made by the <strong>font subsetting tool</strong> (tools/ in the meta repo).",
    ),
    (
        "修改會先存成草稿，按「發布」才會讓 App 下載新的清單。ID 永遠不可改、不可重用；發布過的字體不能刪除，只能停用。",
        "Changes are saved as a draft; the App gets the new list only after \"Publish\". IDs never change and are never reused; a published font can't be deleted, only disabled.",
    ),
    (
        "「有授權」只是標示，不會擋上傳。內建的 Noto Sans TC 不在這個清單裡。",
        "\"Licensed\" is only a label and doesn't block uploads. The built-in Noto Sans TC is not in this list.",
    ),
    ("<strong>字體清單</strong>", "<strong>Font list</strong>"),
    ('目前發布：${esc(release ? release.version : "沒有")}', 'Published: ${esc(release ? release.version : "none")}'),
    (">草稿有未發布的修改</span>", ">The draft has unpublished changes</span>"),
    (">和發布版本一樣</span>", ">Same as published</span>"),
    ('class="primary">發布</button>', 'class="primary">Publish</button>'),
    (
        "<th>ID</th><th>名稱</th><th>排序</th><th>授權</th><th></th><th>檔案</th><th></th>",
        "<th>ID</th><th>Name</th><th>Order</th><th>Licence</th><th></th><th>File</th><th></th>",
    ),
    (">還沒有字體</td>", ">No fonts yet</td>"),
    ('placeholder="字體名稱（App 上顯示的名稱）"', 'placeholder="Font name (as shown in the App)"'),
    ('placeholder="排序"', 'placeholder="Order"'),
    ('id="new-font-licensed"> 有授權</label>', 'id="new-font-licensed"> Licensed</label>'),
    (">新增字體</button>", ">Add font</button>"),
    (
        "發布後，App 下次檢查更新就會拿到新的字體清單。確定？",
        "After publishing, the App gets the new font list at its next update check. Continue?",
    ),
    (
        '`已發布版本 ${r.version}（${r.count} 個字體）${r.cache_reloaded ? "" : "；快取晚點才會更新"}`',
        '`Published version ${r.version} (${r.count} fonts)${r.cache_reloaded ? "" : "; the cache will catch up shortly"}`',
    ),
    ('"已新增，接著上傳字體檔"', '"Added. Now upload the font file"'),
    ('"排序要是整數"', '"Order must be a whole number"'),
    ('"已存成草稿"', '"Saved as draft"'),
    ('"確定刪除這個字體？"', '"Delete this font?"'),
    ('"請上傳字體瘦身工具產生的 .otf.gz"', '"Upload the .otf.gz made by the font subsetting tool"'),
    ("已上傳，記得按「發布」", "Uploaded. Remember to press \\\"Publish\\\""),
    # App 版本
    (
        "強制更新只在重大問題或法律衝突時使用；只對有網路、而且有做每日檢查的手機生效。畫面上會顯示這裡寫的原因。",
        "Use a forced update only for serious problems or legal conflicts; it only reaches phones that are online and run the daily check. The reason written here is shown on screen.",
    ),
    ("最低可用 App 版本（x.y.z）", "Minimum usable App version (x.y.z)"),
    ("強制更新的原因", "Reason for the forced update"),
    ("更新連結（https://，上架前可以留空）", "Update link (https://; may be empty before listing)"),
    ("公告（App 每日檢查時顯示一次，留空就不顯示）", "Announcement (shown once at the App's daily check; empty shows nothing)"),
    ("最後修改：", "Last changed: "),
    ('id="cfg-save" class="primary">儲存</button>', 'id="cfg-save" class="primary">Save</button>'),
    ('"儲存後立即生效。確定？"', '"Saving takes effect immediately. Continue?"'),
    # 意見回饋
    (
        '{ new: "新的", in_progress: "處理中", done: "已處理", wont_fix: "不處理" }',
        '{ new: "New", in_progress: "In progress", done: "Done", wont_fix: "Won\'t fix" }',
    ),
    ('{ suggestion: "提供建議", problem: "遇到問題" }', '{ suggestion: "Suggestion", problem: "Problem" }'),
    ('<option value="">全部</option>', '<option value="">All</option>'),
    ("共 ${data.total} 則（最長保留 90 天）", "${data.total} in total (kept up to 90 days)"),
    (
        "<th>時間</th><th>類型</th><th>狀態</th><th>描述</th><th>版本</th><th>機型</th>",
        "<th>Time</th><th>Type</th><th>Status</th><th>Description</th><th>Version</th><th>Model</th>",
    ),
    (">沒有意見回饋</td>", ">No feedback</td>"),
    (">上一頁</button>", ">Previous</button>"),
    ("第 ${data.page} 頁", "Page ${data.page}"),
    (">下一頁</button>", ">Next</button>"),
    (">個資刪除請求</h3>", ">Personal data deletion request</h3>"),
    ("刪掉某個 Email 的所有意見回饋（隱私權政策第七條）。", "Delete all feedback from one e-mail (Privacy Policy, section 7)."),
    (">全部刪除</button>", ">Delete all</button>"),
    ("`確定刪除 ${email} 的所有意見回饋？無法復原。`", "`Delete all feedback from ${email}? This can't be undone.`"),
    ("`已刪除 ${r.deleted} 則`", "`Deleted ${r.deleted}`"),
    ("沒有記錄檔（「提供建議」不附記錄檔）。", "No log (suggestions come without one)."),
    ("<h4>記錄檔（${lines.length} 行）</h4>", "<h4>Log (${lines.length} lines)</h4>"),
    ("<h4>上次結束原因</h4>", "<h4>Last exit reasons</h4>"),
    (">關閉</button>", ">Close</button>"),
    ("Email：${esc(f.email)}｜收到：${esc(fmtTime(f.received_at))}｜手機時間：", "Email: ${esc(f.email)} | Received: ${esc(fmtTime(f.received_at))} | Phone time: "),
    (
        "App ${esc(f.app_version)}（${esc(f.build_number)}）｜${esc(f.device_model)}｜${esc(f.os_version)}｜安裝 ID ",
        "App ${esc(f.app_version)} (${esc(f.build_number)}) | ${esc(f.device_model)} | ${esc(f.os_version)} | Install ID ",
    ),
    ('placeholder="處理備註"', 'placeholder="Handling note"'),
    ('id="fb-save" class="primary">儲存</button>', 'id="fb-save" class="primary">Save</button>'),
    ('id="fb-delete" class="danger">刪除</button>', 'id="fb-delete" class="danger">Delete</button>'),
    ("<h4>快照</h4>", "<h4>Snapshot</h4>"),
    ('"確定刪除這則意見回饋？"', '"Delete this feedback?"'),
    # 管理員
    ("<th>Email</th><th>備註</th><th></th>", "<th>Email</th><th>Note</th><th></th>"),
    (">環境變數設定</span>", ">Set by environment variable</span>"),
    ('class="danger">移除</button>', 'class="danger">Remove</button>'),
    ('placeholder="備註"', 'placeholder="Note"'),
    (">新增管理員</button>", ">Add admin</button>"),
    ("`確定移除 ${b.dataset.rm}？`", "`Remove ${b.dataset.rm}?`"),
    # 系統
    (
        '快取的字體清單版本：${esc(o.cache.loaded ? (o.cache.fonts_version || "還沒發布") : "還沒載入")}',
        'Font list version in cache: ${esc(o.cache.loaded ? (o.cache.fonts_version || "not published") : "not loaded")}',
    ),
    ('資料庫的字體清單版本：${esc(o.fonts_version || "還沒發布")}', 'Font list version in database: ${esc(o.fonts_version || "not published")}'),
    ('<span class="ok">一致</span>', '<span class="ok">Consistent</span>'),
    ('<span class="warn">不一致</span>', '<span class="warn">Inconsistent</span>'),
    ("（快取載入時間 ${esc(fmtTime(o.cache.loaded_at))}）", "(cache loaded ${esc(fmtTime(o.cache.loaded_at))})"),
    (
        "意見回饋資料表：${o.feedback_table_mb} MB（上限 ${o.feedback_table_limit_mb} MB）｜新的意見回饋 ${o.new_feedback} 則",
        "Feedback table: ${o.feedback_table_mb} MB (limit ${o.feedback_table_limit_mb} MB) | New feedback: ${o.new_feedback}",
    ),
    (">重新載入快取</button>", ">Reload cache</button>"),
    (
        "萬一曾用 SQL 直接改了資料，按這個鈕或重啟後端即可。",
        "If data was ever changed directly with SQL, press this or restart the backend.",
    ),
    ('"已重新載入"', '"Reloaded"'),
    # 多處共用,放最後
    ('"已新增"', '"Added"'),
    ('"已移除"', '"Removed"'),
    ('"已刪除"', '"Deleted"'),
    ('"已儲存"', '"Saved"'),
]

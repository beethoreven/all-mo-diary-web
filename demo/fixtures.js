// 示範版的假資料（中文）：字體清單、意見回饋、管理員、App 版本設定，以及假後端要顯示的文字。
// Email 都是 example.com 的假地址，意見回饋的內容是虛構的。英文版在 demo-en/fixtures.js，兩份要一起改。
window.AMD_DEMO_FIXTURES = {
 "text": {
  "readOnly": "demo版本不會更新正式資料",
  "notFound": "找不到這筆資料"
 },
 "guestEmail": "guest@example.com",
 "cacheLoadedAt": "2026-11-11T01:00:00+00:00",
 "fonts": [
  {
   "id": 1,
   "name": "源泉圓體",
   "sort": 10,
   "disabled": false,
   "licensed": true,
   "file_name": "GenSenRounded-subset.otf.gz",
   "download_url": "https://github.com/example/fonts/releases/download/v1/GenSenRounded-subset.otf.gz",
   "download_bytes": 3460000,
   "download_sha256": "0000000000000000000000000000000000000000000000000000000000000000",
   "font_bytes": 6120000,
   "font_sha256": "1111111111111111111111111111111111111111111111111111111111111111",
   "published": true,
   "updated_at": "2026-11-10T02:00:00+00:00"
  },
  {
   "id": 2,
   "name": "芫荽",
   "sort": 20,
   "disabled": false,
   "licensed": true,
   "file_name": "Iansui-subset.otf.gz",
   "download_url": "https://github.com/example/fonts/releases/download/v1/Iansui-subset.otf.gz",
   "download_bytes": 2980000,
   "download_sha256": "2222222222222222222222222222222222222222222222222222222222222222",
   "font_bytes": 5240000,
   "font_sha256": "3333333333333333333333333333333333333333333333333333333333333333",
   "published": true,
   "updated_at": "2026-11-10T02:05:00+00:00"
  },
  {
   "id": 3,
   "name": "霞鶩文楷（準備中）",
   "sort": 30,
   "disabled": false,
   "licensed": false,
   "file_name": null,
   "download_url": null,
   "download_bytes": null,
   "download_sha256": null,
   "font_bytes": null,
   "font_sha256": null,
   "published": false,
   "updated_at": "2026-11-11T06:30:00+00:00"
  }
 ],
 "release": {
  "version": "20261110021000",
  "content": {
   "fonts": [
    {
     "id": 1,
     "name": "源泉圓體",
     "sort": 10,
     "disabled": false,
     "licensed": true,
     "file_name": "GenSenRounded-subset.otf.gz",
     "download_url": "https://github.com/example/fonts/releases/download/v1/GenSenRounded-subset.otf.gz",
     "download_bytes": 3460000,
     "download_sha256": "0000000000000000000000000000000000000000000000000000000000000000",
     "font_bytes": 6120000,
     "font_sha256": "1111111111111111111111111111111111111111111111111111111111111111"
    },
    {
     "id": 2,
     "name": "芫荽",
     "sort": 20,
     "disabled": false,
     "licensed": true,
     "file_name": "Iansui-subset.otf.gz",
     "download_url": "https://github.com/example/fonts/releases/download/v1/Iansui-subset.otf.gz",
     "download_bytes": 2980000,
     "download_sha256": "2222222222222222222222222222222222222222222222222222222222222222",
     "font_bytes": 5240000,
     "font_sha256": "3333333333333333333333333333333333333333333333333333333333333333"
    }
   ]
  }
 },
 "appConfig": {
  "min_app_version": "0.1.0",
  "force_reason": "",
  "update_url": "",
  "announcement": "",
  "updated_at": "2026-11-10T08:30:00+00:00",
  "updated_by": "admin@example.com"
 },
 "admins": [
  {
   "email": "admin@example.com",
   "note": "第一位管理員（環境變數）",
   "created_at": null,
   "created_by": "",
   "fixed": true
  },
  {
   "email": "helper@example.com",
   "note": "協助整理字體清單",
   "created_at": "2026-11-10T02:00:00+00:00",
   "created_by": "admin@example.com",
   "fixed": false
  }
 ],
 "feedback": [
  {
   "id": "6f1c2a4e-8b1d-4c3e-9a57-2d9e0b6f4a11",
   "received_at": "2026-11-11T12:40:00+00:00",
   "device_time": "2026-11-11T20:39:52+08:00",
   "email": "writer.one@example.com",
   "kind": "problem",
   "description": "這個欄位是使用者寫的問題描述（必填，上限 1000 字）。例如：開啟「日記同步」後一直顯示同步中，等了很久都沒有結束。",
   "install_id": "b4f0e2c1-77a3-4d0e-8c5b-1a9f3e6d2c80",
   "app_version": "0.1.0",
   "build_number": "10",
   "device_model": "Google Pixel 8",
   "os_version": "Android 16 (API 36)",
   "status": "in_progress",
   "admin_note": "處理備註：管理員自己看的紀錄，使用者看不到。",
   "updated_at": "2026-11-11T13:05:00+00:00",
   "snapshot": {
    "settings": {
     "week_start": "monday",
     "theme": "system",
     "sync_diaries": true,
     "sync_images": true,
     "signed_in": true,
     "diaries": 128,
     "images": 37
    },
    "fonts_version": "20261110021000",
    "display": {
     "width_dp": 412,
     "height_dp": 915,
     "density": 2.625,
     "font_scale": 1.0,
     "dark_mode": false,
     "locale": "zh-Hant-TW"
    },
    "device": {
     "manufacturer": "Google",
     "model": "Pixel 8",
     "release": "16",
     "sdk": 36
    },
    "state": {
     "free_storage_mb": 21840,
     "battery": 0.62,
     "network": "wifi"
    },
    "cloud": {
     "same_account_as_sync": true,
     "drive_scopes": "granted",
     "last_sync_ok": "2026-11-11T11:58:00Z",
     "last_sync_error": "timeout",
     "last_check_at": "2026-11-11T12:30:00Z",
     "last_check_ok_day": "2026-11-11",
     "check_fail_count": 0
    }
   },
   "logs": {
    "logs": [
     {
      "t": "2026-11-11T12:31:02Z",
      "lv": "info",
      "c": "app.resumed"
     },
     {
      "t": "2026-11-11T12:31:03Z",
      "lv": "info",
      "c": "sync.diaries",
      "up": 1,
      "down": 0
     },
     {
      "t": "2026-11-11T12:31:05Z",
      "lv": "info",
      "c": "sync.images",
      "up": 0,
      "down": 0
     },
     {
      "t": "2026-11-11T12:32:05Z",
      "lv": "warn",
      "c": "sync.failed",
      "type": "TimeoutException"
     }
    ],
    "exit_reasons": [
     {
      "reason": "USER_REQUESTED",
      "time": "2026-11-10T23:10:00Z"
     }
    ]
   }
  },
  {
   "id": "a3d9e7b2-1c4f-4e8a-b6d0-5f2c9e1a7b33",
   "received_at": "2026-11-10T03:15:00+00:00",
   "device_time": "2026-11-10T11:14:41+08:00",
   "email": "writer.two@example.com",
   "kind": "suggestion",
   "description": "這則是「提供建議」：描述欄位是使用者的建議內容。例如：希望行事曆可以用顏色標出寫得比較長的日子。",
   "install_id": "0c7e5d2a-3b91-4f6c-a2e8-9d4b1f0c6e57",
   "app_version": "0.1.0",
   "build_number": "10",
   "device_model": "samsung Galaxy S25",
   "os_version": "Android 15 (API 35)",
   "status": "new",
   "admin_note": "",
   "updated_at": "2026-11-10T03:15:00+00:00",
   "snapshot": {
    "settings": {
     "week_start": "sunday",
     "theme": "light",
     "sync_diaries": false,
     "sync_images": false,
     "signed_in": true,
     "diaries": 41,
     "images": 0
    },
    "fonts_version": null,
    "display": {
     "width_dp": 384,
     "height_dp": 832,
     "density": 2.8125,
     "font_scale": 1.15,
     "dark_mode": false,
     "locale": "zh-Hant-TW"
    },
    "device": {
     "manufacturer": "samsung",
     "model": "Galaxy S25",
     "release": "15",
     "sdk": 35
    }
   },
   "logs": null
  },
  {
   "id": "d81b4c6f-9e2a-4b75-8c13-7a0e5d9f2b64",
   "received_at": "2026-11-09T09:02:00+00:00",
   "device_time": "2026-11-09T17:01:30+08:00",
   "email": "writer.three@example.com",
   "kind": "problem",
   "description": "已處理的範例：手機空間不夠時下載字體失敗，沒有提示原因。狀態改成「已處理」後，仍會保留到 90 天期限。",
   "install_id": "5e2a9c1d-6f40-4b8e-91c7-3d8a0e4f7b21",
   "app_version": "0.1.0",
   "build_number": "9",
   "device_model": "Google Pixel 8",
   "os_version": "Android 16 (API 36)",
   "status": "done",
   "admin_note": "已改成空間不足時直接告訴使用者。",
   "updated_at": "2026-11-10T01:20:00+00:00",
   "snapshot": {
    "settings": {
     "week_start": "monday",
     "theme": "dark",
     "sync_diaries": true,
     "sync_images": false,
     "signed_in": true,
     "diaries": 23,
     "images": 5
    },
    "fonts_version": "20261110021000",
    "display": {
     "width_dp": 412,
     "height_dp": 915,
     "density": 2.625,
     "font_scale": 1.3,
     "dark_mode": true,
     "locale": "zh-Hant-TW"
    },
    "device": {
     "manufacturer": "Google",
     "model": "Pixel 8",
     "release": "16",
     "sdk": 36
    },
    "state": {
     "free_storage_mb": 512,
     "battery": 0.18,
     "network": "mobile"
    },
    "cloud": {
     "same_account_as_sync": true,
     "drive_scopes": "granted",
     "last_sync_ok": "2026-11-09T08:40:00Z",
     "last_sync_error": null,
     "last_check_at": "2026-11-09T08:00:00Z",
     "last_check_ok_day": "2026-11-09",
     "check_fail_count": 0
    }
   },
   "logs": {
    "logs": [
     {
      "t": "2026-11-09T08:58:10Z",
      "lv": "info",
      "c": "font.installed",
      "id": 2
     },
     {
      "t": "2026-11-09T08:58:40Z",
      "lv": "warn",
      "c": "font.install_failed",
      "id": 1,
      "type": "FileSystemException"
     }
    ],
    "exit_reasons": []
   }
  }
 ]
};

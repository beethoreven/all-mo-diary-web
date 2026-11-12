> **This English translation is provided for demonstration only. If it differs from the Traditional Chinese version, the Traditional Chinese version prevails.**

Effective date: November 11, 2026

## In one sentence

**The diaries and images you write are stored only on your phone and in your own Google Drive; our server does not keep them.** We receive your e-mail and debugging data only when you send feedback; at all other times the server discards what it handles as soon as it is done.

## 1. Who handles your data

阿舍老師 ("we" or "us"), contact: tutorarthurouat@outlook.com.

## 2. What data we come into contact with

Listed by feature. **We collect nothing that is not listed here**: no location, contacts, list of other apps, advertising ID, IMEI or serial number, and no advertising or analytics SDKs.

| What you do | Where the data goes | What we receive | How long it is kept |
|---|---|---|---|
| Writing diaries on your phone without signing in | Only on your phone | Nothing | — |
| Signing in with a Google account | Google gives the App your account e-mail, name and profile picture, used to show which account is signed in; the App sends the sign-in credential to our server and receives a "sign-in pass" (containing your Google account's fixed ID, e-mail and expiry, signed by us to prevent forgery), which is stored on your phone | The sign-in credential (containing your Google account's fixed ID and e-mail), used only to issue the pass | Account details and the pass stay on your phone and are cleared when you sign out; the server keeps neither the credential nor the pass |
| Checking for updates and the font list (after signing in, automatically when the App opens, or manually) | Sent to our server | The sign-in pass, App version and platform, and the version of the font list on your phone | Discarded once handled, never written to the database; the server only remembers in memory "how many times this account checked today", cleared every midnight Taipei time |
| Downloading fonts | Downloaded to your phone from the font's public download address | Our server only provides the download address | The font stays on your phone; you can delete it in "Font settings" |
| Turning on "Sync diaries to cloud" or "Save images to cloud" | Stored in **your own** Google Drive | Our server receives nothing | Kept by your Google account until you delete it |
| Exporting | Encrypted and saved in **your own** Google Drive (the "全心日記" folder); the key is stored in an area of your Drive that only the App can read | Our server receives nothing and never has the key | Kept by you |
| Sending feedback | Sent to our server and stored in the database | See section 3 | Up to 90 days; may be deleted earlier once debugging is done |
| Usage log on the phone | Only on your phone | We receive nothing (unless you send feedback) | Deleted automatically after 7 days |

In addition, our hosting provider (Render) keeps connection records in its system logs for 7 days; its documentation does not say whether they include your IP address. We do not keep IP addresses ourselves, and our program's logs never contain e-mails or sign-in credentials.

## 3. What feedback sends

After you tap "Send", the App first lists the items to be sent; nothing is sent until you tap "Confirm and send".

- **Always sent**: your e-mail (taken from the sign-in pass, used to reply to you; this is the only personal data in feedback), the description you wrote, the feedback ID, the phone's time and time zone, an install ID (a random code created when the App is first opened), the App version, a settings summary (week start, theme, cloud switches and sign-in state, and counts such as the number of entries and images; **no diary titles or content**), and the phone model and system version.
- **Also sent when you choose "Problem"**: phone state (for example free storage and network type), cloud sync state, the usage log of the last 7 days (for example which font could not be applied), and the reason the App last ended abnormally. These records **contain no diary titles or content**; any e-mail, sign-in credential or file name appearing in them is masked before sending.
- **Never sent**: diary content, images, screenshots, location, IP address.
- The description is written by you and kept as is; please don't put private matters in it.

## 4. Purposes

- Providing updates and the font list, and preventing abuse (update checks).
- Replying to you and finding and fixing problems (feedback).

We do not use your data for anything else, and we never sell or rent it or use it for advertising.

## 5. Where data is stored, and who helps us

- Our server and database are in **Singapore** (Render's and Neon's data centres); feedback is stored there.
- Synced and exported data is stored in your own Google account and kept by Google. The phone system's automatic backup (the diary database only, no images) is stored in your own Google account.
- Services that help us run: Google (sign-in, Drive), Render (hosting), Neon (database), GitHub (download addresses for font files). Google's privacy policy is at <https://policies.google.com/privacy>, Render's at <https://render.com/privacy>, and Neon's at <https://neon.com/privacy-policy>.
- Except as required by law (for example a lawful request by a court or prosecutors), we do not give your data to anyone else.

## 6. Use of Google user data

The App uses your Google data in accordance with the Google API Services User Data Policy, only to provide features you can see, never passing it to third parties or using it for advertising:

| Permission | Use | When it is requested |
|---|---|---|
| Basic profile (e-mail, name, profile picture) and authentication | Signing in, showing the account in the App, update checks, contact details for feedback | When you tap sign in |
| Access only to the App's own Drive data area (`drive.appdata`) | Diary sync, storing the export key | When you turn on a cloud feature, or the first time you export or import |
| Access only to files the App created or you chose (`drive.file`) | Storing images and export files | When you turn on "Save images to cloud", or the first time you export or import |

The App does not read any other files in your Drive. We (the developers) do not read the data in your Drive; it is read and written only by the App on your phone.

## 7. Your rights

Under Taiwan's Personal Data Protection Act, you may exercise the following rights over the data we keep about you (in practice, only feedback): to inquire or review, to request a copy, to supplement or correct, to stop collection, processing or use, and to request deletion.

- How: e-mail tutorarthurouat@outlook.com with your e-mail address and what you would like done.
- Time limits: inquiries, reviews and copies are answered within 15 days; corrections, stopping and deletion within 30 days; extended where necessary under the law, with notice to you.
- Data on your phone and in your Drive is managed by you: deleting an entry in the App deletes the data on your phone and (with cloud sync on) the matching data in your Drive; exported files are not deleted, so please delete them in your Drive yourself.

## 8. If you don't provide data

- Without signing in: you can still write, filter and search diaries on your phone, but cannot download fonts, use cloud sync, export or import, or send feedback.
- Without sending feedback: nothing is affected, except that we cannot learn about the problems you run into.

## 9. Data security

- The phone and the server always talk over an encrypted connection (HTTPS).
- Export files are fully encrypted, and the key is stored only in your own Drive.
- The server keeps only feedback; other data is handled in memory and discarded once done.
- Only our admins can view feedback.

## 10. Changes to this Policy

We may change this Policy. Changes will be published in the App and on the website; if we want to use your data in a new way, we will notify you and ask for your consent first.

## 11. Contact us

阿舍老師
Email: tutorarthurouat@outlook.com

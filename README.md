# BKG — Enlisted Discord Onboarding Form

Static web form (GitHub Pages) + Google Sheets as the database (via Apps Script).
No server, no hosting, no monthly costs.

## How it works (short version)

1. The applicant opens the form and answers questions one at a time.
2. On submit, the form sends the data to Google Apps Script, which appends
   a new row to the Google Sheet and returns a unique code to the applicant
   (e.g. `BKG-4F7K2P`).
3. You (the admin) open the Sheet, review the application, and manually set
   `Approved` or `Rejected` in the **Status** column.
4. The applicant returns to the form, enters their code in the "Check
   status" section, and if approved — a button with the Discord invite
   link appears automatically. You don't have to send anything manually.

This is the only realistic way to "automate" sending the invite link
without collecting an email address and without a Discord bot — the
status-check page does the work for you.

There's also an **admin panel** built into the same page — log in with
the admin username/password to see every application in a table, without
opening the Google Sheet.

---

## STEP 1 — Create the Google Sheet

1. Go to sheets.google.com → **Blank spreadsheet**.
2. Name it e.g. `BKG Enlisted Applications`.

## STEP 2 — Attach Apps Script to the Sheet

1. In the Sheet: **Extensions → Apps Script**.
2. Delete all existing code in the editor.
3. Open `apps-script/Code.gs` from this package, copy **the entire
   contents**, and paste it into the Apps Script editor.
4. Click the save icon (Ctrl+S).

## STEP 3 — Deploy as a Web App

1. Top right: **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**.
5. Google will ask you to authorize the script (your account) — click
   through it (Advanced → Go to [project name] (unsafe) is normal for
   your own script).
6. Copy the **Web app URL** you get — it looks like this:
   `https://script.google.com/macros/s/AKfycb.../exec`

## STEP 4 — Wire the URL into the form

1. Open `index.html` from this package.
2. Find the line:
   ```
   const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the text between the quotes with the URL from Step 3.
4. Save the file.

## STEP 5 — Publish on GitHub Pages

1. Create a new GitHub repo (e.g. `bkg-enlisted-onboarding`) under your
   account `arhistrategstudio`.
2. Push this package's contents (`index.html` and the `assets/` folder) to
   the root of that repo — the `apps-script/` folder does NOT need to go
   on GitHub, it's just for you, since that code never runs in the browser.
3. In repo settings: **Settings → Pages → Source: main branch, / (root)**.
4. After a couple of minutes, the form is live at:
   `https://arhistrategstudio.github.io/bkg-enlisted-onboarding/`

## STEP 6 — How to approve applications

1. Open the Google Sheet.
2. For each new application, type exactly `Approved` or `Rejected` in the
   **Status** column (no quotes, exactly that word, capitalized).
3. Done — the applicant will see the change as soon as they check status
   on the form.

## Admin panel (in the form itself)

The form has an "Admin login" link at the bottom. Logging in there shows
every application in a table (same data as the Sheet) without needing to
open Google Sheets at all.

- Username: `BKG1389`
- Password: `admin1389`

These credentials are checked server-side in `apps-script/Code.gs`
(`ADMIN_USERNAME` / `ADMIN_PASSWORD` constants) — they are never present
in the page's HTML/JS source, only sent to the backend when logging in.
To change them, edit those two constants in `Code.gs`, push, and redeploy
(see below).

Note: the Status column is still only editable from the Sheet itself —
the admin panel is read-only (a viewer/table), matching the manual
approve/reject workflow above.

---

## What to do if you change the Discord invite link

Open `apps-script/Code.gs`, change the line:
```
const DISCORD_INVITE_LINK = "https://discord.gg/bkg";
```
and redeploy (**Deploy → Manage deployments → Edit (pencil) → New
version → Deploy**).

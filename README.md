# 1% Better – setup (about 10 minutes)

**1. Backend (Google Sheets)**
1. Create a new Google Sheet. Open Extensions → Apps Script, paste in `Code.gs`, and change `TOKEN` to a long random string.
2. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy. Authorize, then copy the Web app URL.
3. (Optional) Import your existing history: run the app once so the `Log` tab exists, then File → Import → upload `Log_import.csv` → "Append to current sheet" on `Log`, with "Convert text to numbers, dates and formulas" **unchecked**.

**2. Host the app** – put this folder on any static host (Netlify Drop, Vercel, GitHub Pages). It must be https.

**3. Install on your phone** – open the URL. Android/Chrome: menu → Install app. iPhone/Safari: Share → Add to Home Screen. Tap ⚙ and paste the Web app URL and your token.

It works offline: entries are saved on the phone and sync to the sheet when you're back online.
After editing Code.gs, use Deploy → Manage deployments → Edit → New version.

// Google Apps Script backend. Paste into Extensions > Apps Script of your Google Sheet.
const TOKEN = 'CHANGE_ME_TO_A_LONG_RANDOM_STRING'; // must match the token in the app's settings
const SHEET = 'Log';                               // columns: Date | Key | Value

function sh_() {
  const ss = SpreadsheetApp.getActive();
  let s = ss.getSheetByName(SHEET);
  if (!s) { s = ss.insertSheet(SHEET); s.appendRow(['Date', 'Key', 'Value']); s.getRange('A:A').setNumberFormat('@'); }
  return s;
}
const out_ = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
const day_ = d => d instanceof Date ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') : String(d);

function doGet(e) {
  if (e.parameter.t !== TOKEN) return out_({ error: 'auth' });
  const s = sh_(), n = s.getLastRow();
  const rows = n > 1 ? s.getRange(2, 1, n - 1, 3).getValues().map(r => [day_(r[0]), String(r[1]), r[2]]) : [];
  return out_({ rows });
}

function doPost(e) {
  const b = JSON.parse(e.postData.contents);
  if (b.t !== TOKEN) return out_({ error: 'auth' });
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const s = sh_(), n = s.getLastRow(), idx = {};
    if (n > 1) s.getRange(2, 1, n - 1, 2).getValues().forEach((r, i) => idx[day_(r[0]) + '|' + r[1]] = i + 2);
    const fresh = [];
    b.items.forEach(it => {
      const row = idx[it.d + '|' + it.k];
      if (row) s.getRange(row, 3).setValue(it.v); else fresh.push([it.d, it.k, it.v]);
    });
    if (fresh.length) s.getRange(s.getLastRow() + 1, 1, fresh.length, 3).setValues(fresh);
    return out_({ ok: true });
  } finally { lock.releaseLock(); }
}

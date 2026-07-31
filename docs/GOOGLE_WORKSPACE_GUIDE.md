# Google Workspace Implementation Guide

This is the authoritative, detailed spec for wiring the Phase 3+ backend
(Google Apps Script, Sheets, Drive, Gmail) into this already-built static
frontend. Everything described here can be implemented **without changing
any HTML/CSS on the site** — every touchpoint on the frontend side is
already a documented placeholder function in
`assets/js/modules/integrations.js`.

If you only need the fast version, see `docs/phase3-integration-guide.md`.
This document goes deeper into each piece.

---

## 1. How Apps Script receives form data

Both `start-a-project.html` and the hidden Client Brief page post through
the same client-side function, `submitToGoogleSheets(payload)` in
`assets/js/modules/integrations.js`. Today it's a no-op that logs to the
console. To make it real:

1. In your Google Sheet: **Extensions → Apps Script**.
2. Write a `doPost(e)` entry point:

```js
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const projectId = getNextProjectId();          // §4
  const row = buildRowFromPayload(payload, projectId); // mirror buildSheetRow() column order
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  sheet.appendRow(row);

  createClientDriveFolder(projectId, payload);    // §3
  sendCompanyNotification(payload, projectId);     // §7
  sendClientConfirmation(payload, projectId);      // §7

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, projectId }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web app.** Execute as yourself, access
   "Anyone" (the form is public, so the endpoint must accept anonymous
   POSTs — this is normal and fine; there's no sensitive read access, only
   a write-only intake). Copy the `/exec` URL.
4. In `assets/js/modules/integrations.js`, replace `submitToGoogleSheets()`:

```js
const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";

export async function submitToGoogleSheets(payload) {
  const res = await fetch(SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json(); // { ok: true, projectId: "GA-0001" }
}
```

That's the only frontend file that changes. `project-form.js` already
`await`s this call and uses whatever `projectId` comes back.

---

## 2. How Google Sheets stores records

One sheet, one row per submission. Columns, in exact order (this is what
`buildSheetRow()` in `integrations.js` already produces client-side, for
you to mirror server-side):

| # | Column | Notes |
|---|---|---|
| 1 | Project ID | See §4 |
| 2 | Submission Date | ISO string, client-generated |
| 3 | Client Name | |
| 4 | Company | Optional |
| 5 | Email | |
| 6 | Phone | |
| 7 | WhatsApp | Falls back to Phone if not separately provided |
| 8 | Country | |
| 9 | City | |
| 10 | Industry | Optional dropdown |
| 11 | Service | |
| 12 | Budget | Selected range, not exact number |
| 13 | Deadline | Selected range |
| 14 | Project Description | Free text |
| 15 | Project Brief | `"Submitted"` if the row came from the Client Brief form, else `"Pending"` |
| 16 | Lead Status | Default `"New"` — Apps Script/Admin later moves this through `New → Qualified → Client → Completed` |
| 17 | Quotation Status | Default `"Not Sent"` → `"Sent"` → `"Accepted"` |
| 18 | Contract Status | Default `"Not Sent"` → `"Sent"` → `"Signed"` |
| 19 | Meeting Status | Default `"Not Scheduled"` → `"Scheduled"` → `"Completed"` |
| 20 | Google Drive Folder | URL, filled by §3 |
| 21 | Notes | Free text for internal use; client submissions put their form source here (`public` / `client-brief`) |
| 22 | Future Invoice Number | Empty until billing exists |

Keep a header row matching these exactly — every downstream script
(`getNextProjectId()`, dashboard reads, etc.) should reference columns by
name via `sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]`
rather than hardcoded numbers, so reordering columns later doesn't break
everything silently.

---

## 3. How Google Drive folders are created automatically

Structure (mirrors the comment already in `createDriveFolder()`):

```
GA ISTOVIA CLIENTS/
  GA-0001 Client Name/
    01 Project Brief/
    02 Contract/
    03 Quotation/
    04 Assets/
    05 Deliverables/
    06 Revisions/
    07 Final Files/
    08 Archive/
```

```js
function createClientDriveFolder(projectId, payload) {
  const root = DriveApp.getFolderById("YOUR_GA_ISTOVIA_CLIENTS_FOLDER_ID");
  const clientFolder = root.createFolder(`${projectId} ${payload.companyName || payload.fullName}`);
  ["01 Project Brief","02 Contract","03 Quotation","04 Assets",
   "05 Deliverables","06 Revisions","07 Final Files","08 Archive"]
    .forEach(name => clientFolder.createFolder(name));
  return clientFolder.getUrl();
}
```

Write the returned URL back into column 20 of the same row you just
appended (use `sheet.getRange(lastRow, 20).setValue(url)`).

The frontend's `createDriveFolder()` in `integrations.js` can stay a
no-op — folder creation only ever needs to happen server-side, since only
Apps Script knows the real Project ID at that point.

---

## 4. How Project IDs are generated

Sequential, permanent, never reused: `GA-0001`, `GA-0002`, ...

```js
function getNextProjectId() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  const lastRow = sheet.getLastRow(); // includes header row
  const nextNumber = lastRow; // header is row 1, so row count = next sequence
  return "GA-" + String(nextNumber).padStart(4, "0");
}
```

The frontend never invents this ID. Until Apps Script exists,
`generateTempReference()` in `integrations.js` shows a clearly-labeled
`TEMP-XXXXXX` placeholder on the success screen instead — the UI copy
explicitly tells the client this is temporary, so there's no risk of a fake
ID being mistaken for the real one.

---

## 5. How quotation PDFs are generated

Template: `docs/templates/quotation.html` — a self-contained, printable
HTML document with `{{TOKEN}}` placeholders (not a real templating engine;
Apps Script does plain string replacement).

```js
function generateQuotation(projectId, data) {
  let html = HtmlService.createHtmlOutputFromFile("quotation-template").getContent();
  Object.entries(data).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });
  const blob = Utilities.newBlob(html, "text/html", `${projectId}-Quotation.html`);
  const pdf = blob.getAs("application/pdf"); // or use a conversion service if this doesn't render well
  const folder = DriveApp.getFoldersByName("03 Quotation").next(); // within the client's folder
  const file = folder.createFile(pdf);
  updateSheetColumn(projectId, "Quotation Status", "Sent");
  return file.getUrl();
}
```

Note: Apps Script's native HTML→PDF via `getAs("application/pdf")` handles
simple layouts (like this template — table-based, no JS, no external
fonts) reasonably well. If output quality isn't good enough, swap in a
proper HTML-to-PDF service instead; the token-replacement step doesn't
change.

Call this from the future Admin Dashboard (see `docs/admin-architecture.md`)
once a lead is qualified — **not** from `doPost()` on initial submission. A
fresh form submission is a Lead, not yet a Client; quotations are only
sent to qualified leads.

---

## 6. How contract PDFs are generated

Identical mechanism to §5, using `docs/templates/contract.html` instead,
saved into the `02 Contract/` folder, updating the "Contract Status"
column to `"Sent"`.

---

## 7. How HTML emails are sent

Nine branded templates live in `docs/templates/emails/`, one per workflow
moment:

| File | Sent when |
|---|---|
| `01-project-request-received.html` | Immediately after `doPost()` (client copy) |
| `02-client-approved.html` | Staff marks Lead Status → "Qualified" |
| `03-quotation-ready.html` | After §5 runs |
| `04-contract-ready.html` | After §6 runs |
| `05-project-started.html` | Staff marks Lead Status → "Client" / work begins |
| `06-project-completed.html` | Staff marks project Completed |
| `07-payment-reminder.html` | Manually triggered or time-based trigger near a due date |
| `08-revision-notification.html` | Staff completes a requested revision |
| `09-meeting-reminder.html` | Time-based trigger before a scheduled meeting |

Same token-replacement pattern as the PDF templates:

```js
function sendTemplatedEmail(templateFile, toEmail, subject, tokens) {
  let html = HtmlService.createHtmlOutputFromFile(templateFile).getContent();
  Object.entries(tokens).forEach(([key, value]) => {
    html = html.replaceAll(`{{${key}}}`, value);
  });
  MailApp.sendEmail({ to: toEmail, subject, htmlBody: html });
}
```

The company notification (internal copy, not one of the 9 client-facing
templates — a plain `MailApp.sendEmail` with the raw payload dumped in is
sufficient) should also fire inside `doPost()`:

```js
function sendCompanyNotification(payload, projectId) {
  MailApp.sendEmail({
    to: "gaistovia@gmail.com",
    subject: `New Lead: ${projectId} — ${payload.fullName}`,
    body: JSON.stringify(payload, null, 2)
  });
}
```

---

## 8. How the Client Portal receives project updates

`client-portal-ffbc8a9b3ca48c91.html` today shows **static placeholder
content** — it's a finished UI shell with no data connection. To make it
live without a login system:

**Recommended approach — query string + a read-only Apps Script endpoint:**

1. Deploy a second Apps Script web app (or a second function in the same
   one) that responds to `doGet(e)`, reading `e.parameter.id` (the Project
   ID) and returning that row's data as JSON — read-only, no write access.
2. Add a small `<script type="module">` to the portal page that reads a
   `?id=GA-0001` query parameter, fetches from that endpoint, and populates
   the existing `.status-track`, `.portal-id-chip`, etc. elements (their
   IDs/classes are already in place — you're filling them, not rebuilding
   them).
3. The secret-URL model stays exactly as-is: you send the client a link
   like `client-portal-ffbc8a9b3ca48c91.html?id=GA-0001`. The filename
   provides the "you can't stumble onto this" privacy; the query param
   just tells the page whose data to show once they're already there.

This keeps the portal static-hostable (still pure GitHub Pages) while
giving it live data — no server-rendered pages, no accounts, no passwords,
exactly per the original "no login" requirement.

---

## 9. Summary — what changes, file by file

| File | Phase 3 change needed |
|---|---|
| `assets/js/modules/integrations.js` | Fill in `submitToGoogleSheets()`; everything else can stay as-is or be called from the future Admin Dashboard |
| Apps Script (new, lives in Google, not this repo) | `doPost()`, `getNextProjectId()`, `createClientDriveFolder()`, `generateQuotation()`, `generateContract()`, `sendTemplatedEmail()`, optional `doGet()` for the portal |
| `client-portal-*.html` | Add one small script block to fetch + populate from `doGet()` (§8) — no layout changes |
| Everything else | Untouched |

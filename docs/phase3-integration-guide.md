# Phase 3 Integration Guide — Google Sheets, Drive & Email

This project is currently in **Phase 2**: the frontend architecture for client
acquisition is fully built, but no backend exists yet. All Phase 3 work
should only touch `assets/js/modules/integrations.js` — nothing else.

## Where everything lives

```
assets/js/
  modules/
    validation.js           — field & step validation (no changes needed)
    whatsapp-generator.js   — builds the wa.me link (no changes needed)
    integrations.js         — <-- ALL Phase 3 work happens here
  project-form.js           — wizard controller (no changes needed)
```

`project-form.js` already calls every integration point in the right order
on submit:

```js
const sheetsResult = await submitToGoogleSheets(payload);
payload.projectId = sheetsResult.projectId || generateTempReference();
notifyCompany(payload);
notifyClient(payload);
createDriveFolder(payload);
```

You only need to make these four functions in `integrations.js` do real
work instead of logging to the console.

## Step 1 — Google Sheet

Create a sheet with these exact columns, in this order:

| Project ID | Submission Date | Full Name | Company Name | Email | Phone Number | WhatsApp Number | Country | City | Requested Service | Budget | Expected Deadline | Project Description | Lead Status | Google Drive Folder | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

`integrations.js` already exports `buildSheetRow(payload)`, which returns an
array in this exact column order — your Apps Script only needs to
`sheet.appendRow(buildSheetRowEquivalent)` (rebuilt server-side, since the
payload arrives as JSON).

## Step 2 — Google Apps Script Web App

1. In the Sheet: **Extensions → Apps Script**.
2. Write a `doPost(e)` function that:
   - Parses `JSON.parse(e.postData.contents)` as the payload.
   - Computes the next Project ID as `"GA-" + String(sheet.getLastRow()).padStart(4, "0")`.
   - Appends a row matching the column order above (`Lead Status` = `"New"`).
   - Calls `MailApp.sendEmail(...)` twice — once to the company inbox, once
     to the client's email (see Step 4).
   - Optionally creates a Drive folder (see Step 3) and writes its URL back
     into the same row's "Google Drive Folder" column.
   - Returns `ContentService.createTextOutput(JSON.stringify({ ok: true, projectId }))`.
3. Deploy as a **Web App** (execute as you, accessible to "Anyone"). Copy the
   `/exec` URL.

## Step 3 — Google Drive folder automation

Inside the same Apps Script, after appending the row:

```js
const parent = DriveApp.getFolderById("YOUR_CLIENTS_ROOT_FOLDER_ID");
const folderName = `${projectId} ${payload.companyName || payload.fullName}`;
const folder = parent.createFolder(folderName);
// write folder.getUrl() back into the sheet row you just appended
```

The frontend's `createDriveFolder()` placeholder in `integrations.js` can
stay a no-op — folder creation belongs entirely in Apps Script, since only
the server side knows the real Project ID at that point.

## Step 4 — Email notifications

Still inside `doPost(e)`, after computing `projectId`:

```js
MailApp.sendEmail({
  to: "gaistovia@gmail.com",
  subject: `New Lead: ${projectId} — ${payload.fullName}`,
  body: JSON.stringify(payload, null, 2)
});

MailApp.sendEmail({
  to: payload.email,
  subject: "Tumepokea ombi lako — GA Istovia",
  body: `Habari ${payload.fullName}, asante kwa kujaza fomu. Namba yako ya ` +
        `rejea ni ${projectId}. Timu yetu itawasiliana nawe hivi karibuni.`
});
```

## Step 5 — Connect the frontend

In `assets/js/modules/integrations.js`, replace the body of
`submitToGoogleSheets()` with:

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

That's it — no other file changes. `notifyCompany`, `notifyClient`, and
`createDriveFolder` can stay as no-op stubs on the frontend since all of
that now happens inside the same Apps Script `doPost()` call.

## Notes

- `generateTempReference()` in `integrations.js` produces a `TEMP-XXXXXX`
  placeholder shown on the success screen **only** until Phase 3 exists.
  Once `submitToGoogleSheets()` returns a real `projectId`, that temporary
  code is never shown again.
- The hidden **Client Brief** page (`client-brief-<slug>.html`) posts to the
  exact same `submitToGoogleSheets()` function, tagged with
  `formSource: "client-brief"` in the payload, so you can filter/report on
  which channel a lead came from using the sheet's "Notes" column.

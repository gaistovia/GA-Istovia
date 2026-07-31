# Phase 3 Quick Start — Google Apps Script Integration

This is the short version. For the complete spec (exact Sheet columns,
Drive folder structure, Project ID generation, quotation/contract PDF
generation, all 9 email templates, and how the Client Portal gets live
data), see **`docs/GOOGLE_WORKSPACE_GUIDE.md`** — this file just gets you
from zero to a working connection.

## The only file you need to touch on the frontend

`assets/js/modules/integrations.js` — specifically `submitToGoogleSheets()`.
Everything else (`buildSheetRow()`, `notifyCompany()`, `notifyClient()`,
`createDriveFolder()`, `generateQuotation()`, `generateContract()`,
`generateTempReference()`) is already documented in place and either stays
a no-op or gets called later from the future Admin Dashboard — not from
here.

## Minimum steps to go live

1. Create a Google Sheet with the 22 columns listed in
   `GOOGLE_WORKSPACE_GUIDE.md` §2.
2. **Extensions → Apps Script** on that Sheet, add a `doPost(e)` function
   (full code in `GOOGLE_WORKSPACE_GUIDE.md` §1).
3. **Deploy → New deployment → Web app**, access "Anyone", copy the
   `/exec` URL.
4. In `integrations.js`, replace the body of `submitToGoogleSheets()`:

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

5. Done — both `start-a-project.html` and the hidden Client Brief page use
   this same function, so both go live at once.

## Notes

- `generateTempReference()` produces a `TEMP-XXXXXX` placeholder shown on
  the success screen **only** until step 4 exists. Once
  `submitToGoogleSheets()` returns a real `projectId`, the temporary code
  is never shown again.
- The hidden Client Brief page tags its submissions with
  `formSource: "client-brief"` so you can tell the two intake channels
  apart in the sheet's "Notes" column.
- Drive folder creation, quotation/contract PDFs, and the 9 HTML email
  templates are all documented in `GOOGLE_WORKSPACE_GUIDE.md` — none of
  them require frontend changes, only Apps Script code.

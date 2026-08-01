# Phase 3 Quick Start — Google Apps Script Integration

**Status: Sheets intake is LIVE.** `submitToGoogleSheets()` in
`assets/js/modules/integrations.js` is already connected to a deployed
Apps Script Web App. Every submission from `start-a-project.html` and the
hidden Client Brief page now appends a real row to the GA Istovia Google
Sheet and gets back a real `GA-000X` Project ID. This file now doubles as
the record of *how* that connection was made, in case it ever needs to be
redeployed (e.g. the Apps Script project is deleted, or the URL changes).

For everything still undone (Drive folders, quotation/contract PDFs, the 9
email templates, Client Portal live data), see the complete spec in
**`docs/GOOGLE_WORKSPACE_GUIDE.md`**.

## What's connected right now

`assets/js/modules/integrations.js` → `submitToGoogleSheets()` → a Web App
deployment (`.../exec`) bound to the live Google Sheet. The deployed Apps
Script's `doPost(e)` function reads the JSON payload, computes the next
Project ID from the sheet's row count, appends a row, and returns
`{ ok, projectId }`.

**Important quirk this deployment already accounts for:** the frontend
sends the request with `Content-Type: text/plain` instead of
`application/json`. This is intentional — Apps Script Web Apps don't
respond to CORS preflight (`OPTIONS`) requests, so a real
`application/json` header would make the browser block the request
entirely. Sending as `text/plain` keeps it a CORS "simple request" while
the body is still valid JSON text, which `JSON.parse(e.postData.contents)`
on the Apps Script side reads exactly the same either way. If this ever
gets rebuilt from scratch, keep that header as `text/plain`.

## If you ever need to redeploy from zero

1. Create/open the Google Sheet, put this exact header row in Row 1:

```
Project ID	Submission Date	Client Name	Company	Email	Phone	WhatsApp	Country	City	Industry	Service	Budget	Deadline	Project Description	Project Brief	Lead Status	Quotation Status	Contract Status	Meeting Status	Google Drive Folder	Notes	Future Invoice Number
```

2. **Extensions → Apps Script**, paste the `doPost(e)` + `getNextProjectId()`
   code (full version in `GOOGLE_WORKSPACE_GUIDE.md` §1 — the deployed
   version matches it, using `getSheets()[0]` rather than a named tab so it
   works regardless of what the tab is called).
3. **Deploy → New deployment → Web app**, execute as yourself, access
   "Anyone", copy the new `/exec` URL.
4. In `integrations.js`, update the `SHEETS_WEBHOOK_URL` constant near the
   top of `submitToGoogleSheets()` to the new URL. That's the only line
   that ever needs to change.

## Notes

- `generateTempReference()` (the `TEMP-XXXXXX` fallback) now only fires if
  the live request fails — network hiccup, deployment paused, etc. The
  wizard fails soft: the client still sees a success screen either way.
- The hidden Client Brief page tags its submissions with
  `formSource: "client-brief"` in the sheet's "Notes" column, so you can
  tell the two intake channels apart.
- Drive folder creation, quotation/contract PDFs, and the 9 HTML email
  templates are documented in `GOOGLE_WORKSPACE_GUIDE.md` — none of them
  are wired up yet; they're the natural next pieces to connect.

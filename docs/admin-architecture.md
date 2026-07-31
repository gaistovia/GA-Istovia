# Admin Dashboard — Architecture Only

**Status: not implemented.** This document exists so the future Admin
Dashboard can be built without redesigning anything that already exists.
Nothing in this file should be built until explicitly requested.

---

## Why it doesn't exist yet

Every other piece of this project (Start a Project, Client Brief, Client
Portal, the Google Sheets schema, the Drive folder structure, the email
templates) is designed so a human at GA Istovia can operate the business
manually — reading the Sheet, WhatsApping clients, sending quotations by
hand — while looking exactly like a finished, professional product to the
client. The Admin Dashboard is what eventually removes the manual reading
and clicking. It is *automation of the operator's side*, not a new
capability the client-facing site needs.

## Where it would live

`/admin/` — a route that does not exist publicly yet. When built, it should
almost certainly **not** be a static GitHub Pages page (it needs auth and
live data), so it will likely be a small separate app (e.g. a lightweight
SPA calling the same Apps Script Web App endpoints as the public forms) or
a bound Google Sheets/AppSheet interface rather than another `.html` file
in this repo. Decide that when Phase 3 (the Apps Script backend) exists —
building the Admin UI before the backend it manages would be building on
sand.

## Modules (planned, not built)

| Module | Reads / writes | Depends on |
|---|---|---|
| **Dashboard** (overview) | Aggregate counts from the Sheet: new leads, active projects, overdue invoices | Google Sheets |
| **Leads** | Rows where Lead Status = "New" | Google Sheets |
| **Clients** | Rows where Lead Status = "Qualified" or later | Google Sheets |
| **Projects** | Project ID, status timeline (mirrors the Client Portal's own status track) | Google Sheets, Client Portal |
| **Quotations** | Trigger `generateQuotation()`, track Quotation Status | `assets/js/modules/integrations.js`, `docs/templates/quotation.html` |
| **Contracts** | Trigger `generateContract()`, track Contract Status | `assets/js/modules/integrations.js`, `docs/templates/contract.html` |
| **Google Sheets** | Direct link/embed to the live spreadsheet | Google Sheets |
| **Google Drive** | Direct link to `GA ISTOVIA CLIENTS/` folder tree | Google Drive |
| **Emails** | Trigger any of the 9 templates in `docs/templates/emails/` | Gmail/Apps Script `MailApp` |
| **Analytics** | Leads over time, conversion rate, revenue by service — computed from the Sheet, not tracked separately | Google Sheets |
| **Settings** | The two contact numbers, email signature, default statuses — today these are hardcoded across the frontend (see `DEVELOPER_GUIDE.md` §9); Settings is where that eventually becomes editable instead of a find-and-replace | — |

## Design constraints for whoever builds this later

- **Reuse the existing design system.** `assets/css/style.css` already has
  the full "Emerald Signal" component library (cards, status tracks,
  buttons, badges) — the Client Portal's `.status-track`/`.portal-card`
  components were built generically enough to reuse directly for an Admin
  project list.
- **Authentication is out of scope for this repo.** GitHub Pages cannot
  gate content — anything sensitive must live behind Google's own auth
  (a Sheets-bound Apps Script web app inherits Google account auth for
  free) rather than a client-side password check.
- **Don't duplicate the Sheet schema.** The 22-column structure documented
  in `assets/js/modules/integrations.js` (`buildSheetRow()`) and in
  `docs/GOOGLE_WORKSPACE_GUIDE.md` is the single source of truth. The
  Admin Dashboard should read/write those exact columns, not invent a
  parallel data model.

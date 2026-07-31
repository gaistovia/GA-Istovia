# GA Istovia — Developer Guide

This document is written so another developer can pick up this project
without asking the original author anything. It covers what exists today,
how it's organized, and exactly what's left to build for each future phase.

---

## 1. What this project is

A static, GitHub Pages–hosted marketing site + client-acquisition frontend
for **GA Istovia**, a digital studio in Tanzania. No build step, no
framework, no backend — vanilla HTML/CSS/JS by design, so it can be deployed
by pushing to a repo and nothing else.

It is **Phase 1–2** of a longer-term Client Management Platform (GCMS). The
backend (Google Apps Script + Sheets + Drive + Gmail) does not exist yet —
every integration point is a clearly labeled placeholder function. See
`docs/GOOGLE_WORKSPACE_GUIDE.md` for the complete backend spec, or
`docs/phase3-integration-guide.md` for the fast version.

---

## 2. Folder structure

```
/
├── index.html                          Homepage
├── start-a-project.html                Public lead-capture wizard
├── client-brief-<slug>.html            HIDDEN — detailed brief for qualified leads
├── client-portal-<slug>.html           HIDDEN — read-only client status page
├── robots.txt
├── sitemap.xml                         Public pages only — never the two hidden slugs above
├── manifest.webmanifest
├── README.md
├── docs/
│   ├── GOOGLE_WORKSPACE_GUIDE.md        Authoritative Phase 3+ backend spec (Sheets/Drive/PDFs/emails/portal)
│   ├── phase3-integration-guide.md      Short quick-start version of the above
│   ├── admin-architecture.md            Future Admin Dashboard — architecture only, not built
│   ├── DEVELOPER_GUIDE.md               This file
│   └── templates/
│       ├── quotation.html               Printable quotation template ({{TOKENS}})
│       ├── contract.html                Printable service agreement template ({{TOKENS}})
│       └── emails/                      9 branded HTML email templates ({{TOKENS}}), see §8
└── assets/
    ├── css/style.css                   Single stylesheet, CSS-custom-property theming
    ├── images/                         Self-hosted brand assets (see §5)
    └── js/
        ├── main.js                     Site-wide behavior: nav, loader, cursor, reveals, theme
        ├── demo-showcase.js            "Check Our Demos" carousel — data-driven, see §6
        ├── project-form.js             Multi-step wizard controller (start-a-project + client-brief)
        └── modules/
            ├── validation.js           Field + step validation, no dependencies
            ├── whatsapp-generator.js   Builds the post-submit wa.me deep link
            └── integrations.js         ALL Phase 3 placeholder functions live here
```

**Rule of thumb:** Phase 3 backend work should only ever touch
`assets/js/modules/integrations.js`. Nothing else needs to change to go
from "placeholder" to "live."

---

## 3. The two-contact system

Every CTA on the site routes to one of two WhatsApp numbers, on purpose:

| Contact | Number | Used for |
|---|---|---|
| Sales & Marketing | `+255 625 794 188` | New projects, pricing, quotes, general inquiries |
| Technical Support / Designer | `+255 797 701 372` | Existing clients, maintenance, technical issues |

These are hardcoded as constants in a couple of places (`assets/js/main.js`,
`assets/js/modules/whatsapp-generator.js`) rather than a single shared
config file — see §9 (Known limitations) for why that's worth fixing if
this project keeps growing.

---

## 4. Hidden pages — how privacy is enforced

Two pages are intentionally not part of the public site: the **Client
Brief** (`client-brief-<slug>.html`) and the **Client Portal**
(`client-portal-<slug>.html`). Both follow the same three rules — breaking
any one of them defeats the purpose:

1. **Long, random filename.** Generated with `python3 -c "import secrets;
   print(secrets.token_hex(8))"`. Don't rename these to something guessable.
2. **`<meta name="robots" content="noindex, nofollow, noarchive">`** in the
   `<head>`, so even if a search engine somehow finds the URL, it won't
   index or cache it.
3. **Never linked from anywhere public** — not in nav, not in the footer,
   not in `sitemap.xml`. **Never add them to `robots.txt` either** — a
   `Disallow` rule would publish the exact path to anyone who reads
   `robots.txt`, which is publicly readable by definition.

Send these URLs to clients manually (WhatsApp, email) once they're
qualified. If a slug ever leaks, generate a new one, update the file name,
and quietly retire the old file.

---

## 5. Brand assets

All logo assets are self-hosted PNGs (not true vector SVG — see §9) derived
from the original brand mark, processed into three ink colors:

- `logo-icon-charcoal.png` / `logo-icon-light.png` / `logo-icon-jade.png` —
  the circular "G" mark alone (favicons, preloader, nav badge background).
- `logo-wordmark-charcoal.png` / `logo-wordmark-light.png` — the full
  "ISTOVIA" lockup, swapped automatically based on light/dark theme via the
  `.wordmark-swap` CSS pattern (see `style.css`, search for `wordmark-swap`).
- `favicon-32.png`, `favicon-192.png`, `favicon-512.png`,
  `apple-touch-icon.png`, `og-cover.png` — generated once from the mark;
  regenerate only if the brand mark itself changes.

**Dark mode is the default theme** (the official brand identity). Light
mode is available via the sun/moon toggle in the nav and is remembered in
`localStorage` under the key `ga-theme`.

---

## 6. Adding a new demo project

`assets/js/demo-showcase.js` renders the "Check Our Demos" infinite
carousel from a single `DEMOS` array. To add a new one, add one object —
nothing else needs to change:

```js
{
  name: "Business Name — Category Demo",
  industry: "Industry label",
  tag: "Short Tag",
  icon: "font-awesome-icon-name",   // without the "fa-" prefix
  description: "Maelezo mafupi ya demo hii.",
  techTags: ["HTML5", "CSS3", "JavaScript"],
  image: "assets/images/demo-xxx-cover.png",  // or any external URL
  liveUrl: "https://gaistovia.github.io/xxx/"
}
```

The carousel automatically re-duplicates the array for a seamless
right-to-left loop and recalculates its animation speed so pacing stays
consistent regardless of how many demos exist.

---

## 7. Deployment (GitHub Pages)

1. Push this folder to a GitHub repository.
2. **Settings → Pages → Build and deployment → Source:** Deploy from a
   branch, branch `main`, folder `/ (root)`.
3. The site publishes at `https://<username>.github.io/<repo-name>/`.
4. **If the repo name isn't `GA-Istovia`**, or you move to a custom domain,
   update the base path in: `index.html` (canonical, OG, Twitter, JSON-LD),
   `start-a-project.html`, `sitemap.xml`, `robots.txt`, and
   `manifest.webmanifest` (`start_url`/`scope`). All asset references use
   relative paths (`assets/css/style.css`, not `/assets/...`), so those
   don't need touching — only the absolute canonical/OG URLs do.

No build step. No `npm install`. Editing the HTML/CSS/JS files directly and
pushing is the entire workflow today.

---

## 8. The client workflow this architecture supports

```
Visitor → Lead → Qualified Lead → Client → Project → Quotation → Contract → Client Portal → Completed Project
```

| Stage | What exists today |
|---|---|
| Visitor → Lead | `start-a-project.html` — public wizard, validates client-side, builds a payload, calls the (placeholder) `submitToGoogleSheets()`, shows a success screen with a WhatsApp CTA. |
| Lead → Qualified Lead | `client-brief-<slug>.html` — same wizard engine, deeper questions, sent manually once a lead looks promising. |
| Quotation / Contract | `docs/templates/quotation.html` and `docs/templates/contract.html` — printable HTML documents with `{{TOKEN}}` placeholders. Phase 3 Apps Script should populate these and render to PDF. `generateQuotation()` / `generateContract()` in `integrations.js` are the intended call sites — **called later from a future Admin dashboard action, not from the public form**, since a fresh submission is only a Lead, not yet a Client. |
| Client Portal | `client-portal-<slug>.html` — read-only status page (Project ID, status timeline, project summary, notes, contacts, and placeholder buttons for quotation/contract/files/invoice). No login by design; access is the secret URL alone. See `GOOGLE_WORKSPACE_GUIDE.md` §8 for how it can later receive live data without adding a login system. |
| Email notifications | `docs/templates/emails/` — 9 branded, token-based HTML templates (request received, client approved, quotation ready, contract ready, project started, project completed, payment reminder, revision notification, meeting reminder). Sending them is Apps Script's job — see `GOOGLE_WORKSPACE_GUIDE.md` §7. |
| Admin Dashboard | Does not exist yet, intentionally. See `docs/admin-architecture.md` for the planned module list and design constraints. `integrations.js` is written so its "approve lead" action can call `generateQuotation()`, `generateContract()`, and `createDriveFolder()` directly. |

---

## 9. Known limitations / honest notes for whoever continues this

- **Logos are raster, not vector.** True SVG versions would need the
  original design file (Illustrator/Figma) — what exists here is processed
  from a flattened PNG. Fine for web use at current sizes; would pixelate
  if used much larger than ~600px.
- **Contact numbers are duplicated** across `main.js` and
  `whatsapp-generator.js` (and hardcoded inline in HTML `href`s across every
  page) rather than pulled from one config file. If either number ever
  changes, search the whole project for `255625794188` / `255797701372`
  rather than assuming one place to edit. A `config.js` with a single
  `CONFIG` object (as sketched in earlier planning docs) would be the right
  fix if this project scales further — not done yet to avoid a large,
  risky refactor of already-working pages.
- **No automated tests.** Validation is manual (`node --check` for JS
  syntax, a Python script for HTML tag balance / broken links, run after
  every batch of changes — see any recent commit for the pattern).
- **The Testimonials section was intentionally removed** (no verified
  client testimonials exist yet). The CSS carousel and JS are still in
  `style.css` / `main.js`, untouched — restoring it later is a markup
  paste back into `index.html` where the HTML comment marks the spot, not
  a rebuild.

---

## 10. Quick reference

```
Sales:     +255 625 794 188  → wa.me/255625794188
Support:   +255 797 701 372  → wa.me/255797701372
Email:     gaistovia@gmail.com
Default theme: dark ("Signal"); light ("Daylight") is the toggle
Hidden pages: client-brief-0776670e79953a3b.html, client-portal-ffbc8a9b3ca48c91.html
```

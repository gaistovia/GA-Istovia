# GA Istovia — Flagship Website (v2.0 "Emerald Signal")

Production-ready static website for **GA Istovia**, a premium digital studio in Tanzania.
Built to be deployed directly on **GitHub Pages** — no backend, no Blogger dependency.

## Project structure

```
index.html              → the entire single-page site (semantic HTML5 + SEO/schema)
assets/css/style.css     → design system (deep emerald / jade / mint palette)
assets/js/main.js        → vanilla JS: reveals, hero animation, FAQ, form, theme toggle
robots.txt               → search engine crawl rules
sitemap.xml              → sitemap for search engines
manifest.webmanifest     → PWA-style manifest (installable icon/name)
```

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository (e.g. `gaistovia/gaistovia.github.io` for a user site,
   or any repo name for a project site).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. GitHub will publish the site at `https://<username>.github.io/` (or `/<repo>/` for a project page).
5. If you deploy under a sub-path (project page), update the `canonical`, Open Graph `og:url`,
   and `sitemap.xml` URLs in `index.html`/`sitemap.xml` to match the real published URL.

## Editing content

- All copy, pricing, services and links live directly in `index.html` — search for the section
  `<!-- ============ SECTION NAME ============ -->` to find it quickly.
- The WhatsApp number is centralized as `255625794188` — it's used in every `wa.me/` link across
  the page and in `assets/js/main.js` (`WA_NUMBER` constant) for the contact form redirect.
- Portfolio screenshots currently point to existing hosted images (Blogger CDN URLs kept only as
  image assets — there is no Blogger *code* left anywhere in the project). Swap the `src` values
  in the Portfolio section of `index.html` for your own hosted images whenever you'd like.

## SEO included

- Organization, ProfessionalService (LocalBusiness), WebSite, ItemList (Services) and FAQPage
  JSON-LD structured data
- Open Graph + Twitter Card meta tags
- Canonical URL, robots meta, semantic heading hierarchy, descriptive `alt` text, lazy-loaded images

## Accessibility

- Skip-to-content link, visible focus states, ARIA labels on icon-only controls, `aria-expanded`
  on the FAQ accordion, `prefers-reduced-motion` support, and color contrast tuned for WCAG AA.

## Notes

- No build step required — open `index.html` directly or serve the folder with any static host.
- No external JS frameworks; everything is vanilla HTML/CSS/JS for maximum portability and speed.

## Production Audit Fixes (this revision)

- **Asset paths corrected.** `index.html` references `assets/css/style.css` and
  `assets/js/main.js`, and those files now genuinely live at
  `assets/css/style.css` and `assets/js/main.js` — confirmed with a full
  reference-integrity scan (every local `href`/`src` in every `.html` file
  resolves to a real file on disk).
- **Deployed at a project path, not the domain root.** This repo is expected
  at `https://gaistovia.github.io/GA-Istovia/` (a GitHub Pages *project*
  page, not a user page at the bare `gaistovia.github.io`). Every canonical
  URL, Open Graph URL, Twitter Card URL, JSON-LD `@id`/`url`, `sitemap.xml`
  entry, and `manifest.webmanifest` `start_url`/`scope` now points at that
  exact path. **If your repo name is not `GA-Istovia`, or you deploy to a
  custom domain, search-and-replace that one path segment across `index.html`,
  `start-a-project.html`, `sitemap.xml`, `robots.txt`, and
  `manifest.webmanifest`.**
- **Zero Blogger dependency.** Every image is now self-hosted in
  `assets/images/` — the favicon, apple-touch-icon, manifest icons, and Open
  Graph cover are original artwork generated for this brand (see below). No
  request in this site ever touches `blogger.googleusercontent.com`.
- **Portfolio cover art is a placeholder, by design.** I could not download
  the real screenshots of Malisa Motors / Quality Electronics TZ / Blessing
  Motors from Blogger's CDN — my build environment can't reach that domain.
  So `assets/images/malisa-motors-cover.png`,
  `quality-electronics-cover.png`, and `blessing-motors-cover.png` are
  original abstract cover art (not fake screenshots) standing in for the
  real thing. **Replace those three files with real screenshots of the live
  demo sites whenever convenient** — same filenames, same folder, and the
  "View Live" buttons already point to the real sites either way.

## Version 2.5 — "Emerald Signal: Daylight"

A full creative rebuild on top of the production-audited v2.0 base, per an
explicit brief to stop feeling like "a converted Blogger template."

**Palette flip.** Default theme is now light and white-space-dominant (soft
warm white/grey backgrounds, soft dark charcoal text, deep emerald/jade/mint
used only as accents) instead of all-dark. The original moody dark palette
is preserved as a genuine toggle — click the sun/moon icon in the nav. This
also **fixed a real bug**: that toggle button existed in the HTML before but
had no JavaScript behind it.

**New preloader.** Real logo mark + letter-by-letter animated "GA ISTOVIA"
reveal + progress track, replacing the generic spinning-ring loader.

**Real logo everywhere.** The header and footer now render an actual logo
image (`assets/images/logo-badge.svg`) instead of a CSS text badge.

**Hero.** Headline upgraded to a character-by-character reveal. This also
fixed a **latent bug**: the previous word-by-word reveal script flattened
the entire `<h1>` on load, which would have silently destroyed the nested
typewriter target element the first time this page was visited fresh.

**Portfolio.** Cards rebuilt as laptop-mockup frames (screen bezel, webcam
dot, base) with a click-to-zoom lightbox, replacing the flat browser-chrome
cards.

**Testimonials.** Converted from a static 3-card grid to an auto-rotating
carousel with dots and prev/next controls.

**Contrast fixes.** Several components (buttons, badges, avatars, the
floating dock's tooltip bubble, the mobile full-screen menu) previously
assumed a dark page background when choosing text color. Flipping the
default theme to light surfaced these — all are now fixed so text stays
legible in both light and dark mode.

**Audit note on assets.** I compared the live Blogger site
(`gaistovia.blogspot.com`) against this build section-by-section. Content
parity is exact — no hidden copy or images were missed. I attempted again
to download the real portfolio screenshots and team photo directly from
Blogger's CDN for this revision; the fetch tool available in my environment
can reach that domain for page content but not for pulling the raw image
bytes (both a permissions restriction and a URL-length limit). The three
portfolio covers and the logo remain original, self-hosted artwork rather
than the real screenshots — swap in the real files under the same
filenames in `assets/images/` whenever you have them.

Two new pages were added, both sharing the same wizard engine
(`assets/js/project-form.js` + `assets/js/modules/*.js`):

- **`start-a-project.html`** — public, linked from the nav, hero, mobile
  nav, and footer. A 4-step form (Contact → Location → Project → Description)
  with a progress indicator, inline validation, and a premium success screen
  that reveals a "Continue on WhatsApp" button pre-filled with the client's
  name and requested service.
- **`client-brief-0776670e79953a3b.html`** — private. Same fields, different
  copy, `<meta name="robots" content="noindex, nofollow, noarchive">`, and
  **deliberately not linked from anywhere** (not in nav, footer, or
  `sitemap.xml`). Send this exact URL manually to approved clients only.
  ⚠️ Because the security of this page depends entirely on the URL staying
  unguessable, **do not** add it to `robots.txt` `Disallow` rules — that
  would publish the path to anyone who reads `robots.txt`.

**No backend exists yet, on purpose.** Submitting either form validates
client-side, builds a payload, and calls four clearly-labeled placeholder
functions in `assets/js/modules/integrations.js`
(`submitToGoogleSheets`, `notifyCompany`, `notifyClient`,
`createDriveFolder`) that currently just log to the console and return a
temporary `TEMP-XXXXXX` reference code. See
**`docs/phase3-integration-guide.md`** for the exact, minimal steps to wire
in a real Google Apps Script backend later — it only requires editing one
file (`integrations.js`), with no changes to the wizard UI.

## Version 2.0 — "Emerald Signal"

This is a full brand evolution, not a Blogger port:

- **Two-contact system**: Sales & Marketing (`+255 625 794 188`) handles new projects, pricing and
  payments. Technical Support / Designer (`+255 797 701 372`) handles existing clients and
  maintenance. The split is visible in the nav, hero, pricing, WA CTA, contact section, footer,
  the floating dual dock (bottom-right), and the contact form's Sales/Support toggle — the number
  used depends on which one the visitor picks.
- **New palette**: "Emerald Signal" — deep emerald/jade/mint for Sales, a cooler teal-emerald for
  Support, plus a brass hairline accent used sparingly for luxury contrast.
- **Motion**: custom cursor, 3D tilt cards, mouse-driven hero parallax with a tilting glass phone
  mockup, animated aurora-mesh background, kinetic word-by-word headline reveal, image wipe-reveal
  on portfolio screenshots, animated conic-gradient border on the featured pricing card, magnetic
  buttons, and an SVG line-draw loader with a live percentage counter.
- **New sections**: Testimonials (3 cards from the real demo clients), and a persistent floating
  Sales/Support contact dock.
- All effects respect `prefers-reduced-motion` and disable pointer-only interactions (cursor, tilt,
  parallax, magnetic buttons) on touch devices.

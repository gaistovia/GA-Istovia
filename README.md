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

# -*- coding: utf-8 -*-
"""
partials.py — shared HTML fragments for the GA Istovia static site generator.

Every subpage lives one level deep, e.g. /about/index.html, so relative
links back to the site root use the "../" prefix. Root-level pages
(index.html, start-a-project.html, the hidden client-brief page) use "".
"""

SALES_WA = "https://wa.me/255625794188"
SUPPORT_WA = "https://wa.me/255797701372"
BASE_URL = "https://gaistovia.github.io/GA-Istovia"


def head(prefix, title, description, slug, keywords="", noindex=False, canonical_override=None):
    canonical = canonical_override or f"{BASE_URL}/{slug}/" if slug else f"{BASE_URL}/"
    robots = "noindex, nofollow, noarchive" if noindex else "index, follow"
    og_image = f"{BASE_URL}/assets/images/og-cover.png"
    return f"""<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
{f'<meta name="keywords" content="{keywords}">' if keywords else ''}
<meta name="author" content="GA Istovia">
<meta name="robots" content="{robots}">
{f'<link rel="canonical" href="{canonical}">' if not noindex else ''}

<meta property="og:type" content="website">
<meta property="og:site_name" content="GA Istovia">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
{f'<meta property="og:url" content="{canonical}">' if not noindex else ''}
<meta property="og:locale" content="sw_TZ">
<meta property="og:image" content="{og_image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">

<meta name="theme-color" content="#0b3c2d">
<link rel="icon" href="{prefix}assets/images/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="{prefix}assets/images/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="{prefix}assets/images/apple-touch-icon.png">
<link rel="manifest" href="{prefix}manifest.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;0,700;1,500&amp;family=Manrope:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500;600&amp;display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
<link rel="stylesheet" href="{prefix}assets/css/style.css">"""


def breadcrumb_jsonld(prefix, trail, slug):
    """trail: list of (name, path) tuples, path relative to site root e.g. '' or 'services/'"""
    items = []
    for i, (name, path) in enumerate(trail, start=1):
        url = f"{BASE_URL}/{path}" if path else f"{BASE_URL}/"
        items.append(
            f'{{"@type":"ListItem","position":{i},"name":"{name}","item":"{url}"}}'
        )
    return f"""<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{",".join(items)}]
}}
</script>"""


def breadcrumb_html(prefix, trail):
    """trail: list of (name, href) — href relative, last item has no link."""
    parts = []
    for i, (name, href) in enumerate(trail):
        if href:
            parts.append(f'<a href="{href}">{name}</a>')
        else:
            parts.append(f'<span aria-current="page">{name}</span>')
    return (
        '<nav class="crumb" aria-label="Breadcrumb">'
        + '<i class="fas fa-chevron-right" aria-hidden="true"></i>'.join(parts)
        + "</nav>"
    )


def top_chrome(prefix, active=""):
    def cls(name):
        return " active" if name == active else ""

    return f"""<a href="#main" class="skip-link">Ruka moja kwa moja hadi maudhui</a>

<div class="cursor-dot" id="cursor-dot" aria-hidden="true"></div>
<div class="cursor-ring" id="cursor-ring" aria-hidden="true"></div>

<div class="bg-atmosphere" aria-hidden="true">
  <div class="bg-grid"></div>
  <div class="aurora a1"></div>
  <div class="aurora a2"></div>
  <div class="aurora a3"></div>
  <div class="grain"></div>
</div>

<div id="progress-bar" role="presentation"></div>

<div id="loader" role="status" aria-label="Inapakia">
  <img class="ldr-logo-img" src="{prefix}assets/images/logo-icon-jade.png" alt="" aria-hidden="true">
  <div class="ldr-name" id="ldr-name">GA ISTOVIA</div>
  <div class="ldr-sub">Premium Digital Studio</div>
  <div class="ldr-track"><div class="ldr-track-fill" id="ldr-track-fill"></div></div>
  <div class="ldr-pct" id="loader-pct">0%</div>
</div>

<nav id="site-nav" aria-label="Muhimu">
  <a class="brand" href="{prefix}index.html" aria-label="GA Istovia — Nyumbani">
    <span class="brand-mark"><img src="{prefix}assets/images/logo-icon-light.png" alt="GA Istovia logo"></span>
    <span>
      <span class="brand-name">ISTOVIA</span>
      <span class="brand-sub">Digital Studio</span>
    </span>
  </a>
  <ul class="nav-links">
    <li><a class="{cls('services').strip() or ''}" href="{prefix}services/index.html">Services</a></li>
    <li><a href="{prefix}portfolio/index.html">Portfolio</a></li>
    <li><a href="{prefix}index.html#pricing">Pricing</a></li>
    <li><a href="{prefix}resources/index.html">Resources</a></li>
    <li><a href="{prefix}about/index.html">About</a></li>
    <li><a href="{prefix}index.html#contact">Contact</a></li>
    <li><a class="nav-support" href="{SUPPORT_WA}?text=Habari%20GA%20Istovia%2C%20naomba%20msaada%20wa%20kiufundi" target="_blank" rel="noopener"><i class="fas fa-headset" aria-hidden="true"></i> Support</a></li>
    <li><a class="nav-cta" href="{prefix}start-a-project.html">Start Project</a></li>
  </ul>
  <div class="nav-right">
    <button class="icon-btn" id="theme-toggle" aria-label="Badilisha mwonekano wa giza/nuru"><i class="fas fa-moon" aria-hidden="true"></i></button>
    <div class="burger" id="nav-burger" aria-label="Fungua menyu" role="button" tabindex="0"><span></span><span></span><span></span></div>
  </div>
</nav>

<div class="mobile-nav" id="mobile-nav">
  <a href="{prefix}services/index.html">Services</a>
  <a href="{prefix}portfolio/index.html">Portfolio</a>
  <a href="{prefix}index.html#pricing">Pricing</a>
  <a href="{prefix}resources/index.html">Resources</a>
  <a href="{prefix}about/index.html">About</a>
  <a href="{prefix}index.html#contact">Contact</a>
  <a class="btn btn-sales" href="{prefix}start-a-project.html"><i class="fas fa-rocket" aria-hidden="true"></i> Start Project</a>
  <a class="btn btn-outline-support" href="{SUPPORT_WA}?text=Habari%20GA%20Istovia%2C%20naomba%20msaada" target="_blank" rel="noopener"><i class="fas fa-headset" aria-hidden="true"></i> Support</a>
</div>
"""


def footer(prefix):
    return f"""<footer id="site-footer">
  <div class="footer-top footer-top-wide">
    <div class="footer-brand">
      <div class="brand">
        <span class="brand-mark"><img src="{prefix}assets/images/logo-icon-light.png" alt="GA Istovia logo"></span>
        <span>
          <span class="wordmark-swap">
            <img class="footer-wordmark wm-dark" src="{prefix}assets/images/logo-wordmark-charcoal.png" alt="GA Istovia">
            <img class="footer-wordmark wm-light" src="{prefix}assets/images/logo-wordmark-light.png" alt="GA Istovia">
          </span>
          <span class="brand-sub" style="display:block;margin-top:3px;">Digital Studio</span>
        </span>
      </div>
      <p>Premium digital studio inayojenga websites za kifahari, ecommerce stores na uzoefu wa kidijitali kwa biashara za kisasa Afrika Mashariki na kwingineko.</p>
      <div class="footer-social">
        <a href="{SALES_WA}" target="_blank" rel="noopener" aria-label="WhatsApp Sales"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
        <a href="mailto:gaistovia@gmail.com" aria-label="Email"><i class="fas fa-envelope" aria-hidden="true"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
        <a href="#" aria-label="Facebook"><i class="fab fa-facebook" aria-hidden="true"></i></a>
        <a href="#" aria-label="Twitter"><i class="fab fa-twitter" aria-hidden="true"></i></a>
      </div>
      <div class="footer-newsletter">
        <label for="footer-news-email">Newsletter</label>
        <div class="fn-row">
          <input type="email" id="footer-news-email" placeholder="Barua pepe yako" disabled>
          <button type="button" class="btn btn-ghost btn-sm" disabled><i class="fas fa-paper-plane" aria-hidden="true"></i></button>
        </div>
        <span class="fn-note">Inakuja hivi karibuni</span>
      </div>
    </div>

    <div class="footer-col">
      <h4>Company</h4>
      <ul class="footer-links">
        <li><a href="{prefix}about/index.html">About Us</a></li>
        <li><a href="{prefix}our-story/index.html">Our Story</a></li>
        <li><a href="{prefix}mission-vision/index.html">Mission &amp; Vision</a></li>
        <li><a href="{prefix}team/index.html">Our Team</a></li>
        <li><a href="{prefix}careers/index.html">Careers</a></li>
        <li><a href="{prefix}index.html#contact">Contact Us</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Services</h4>
      <ul class="footer-links">
        <li><a href="{prefix}services/index.html">All Services</a></li>
        <li><a href="{prefix}services/website-design/index.html">Website Design</a></li>
        <li><a href="{prefix}services/web-development/index.html">Web Development</a></li>
        <li><a href="{prefix}services/ui-ux-design/index.html">UI/UX Design</a></li>
        <li><a href="{prefix}services/branding/index.html">Branding</a></li>
        <li><a href="{prefix}services/graphic-design/index.html">Graphic Design</a></li>
        <li><a href="{prefix}services/seo/index.html">SEO</a></li>
        <li><a href="{prefix}services/business-automation/index.html">Business Automation</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Client</h4>
      <ul class="footer-links">
        <li><a href="{prefix}start-a-project.html">Start a Project</a></li>
        <li><a href="{prefix}project-process/index.html">Project Process</a></li>
        <li><a href="{prefix}book-discovery-call/index.html">Book Discovery Call</a></li>
        <li><a href="{prefix}index.html#pricing">Pricing</a></li>
        <li><a href="{prefix}index.html#faq">FAQ</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Resources</h4>
      <ul class="footer-links">
        <li><a href="{prefix}resources/index.html">Resources Hub</a></li>
        <li><a href="{prefix}blog/index.html">Blog</a></li>
        <li><a href="{prefix}knowledge-base/index.html">Knowledge Base</a></li>
        <li><a href="{prefix}case-studies/index.html">Case Studies</a></li>
        <li><a href="{prefix}portfolio/index.html">Portfolio</a></li>
        <li><a href="{prefix}free-resources/index.html">Free Resources</a></li>
        <li><a href="{prefix}website-guide/index.html">Website Guide</a></li>
        <li><a href="{prefix}branding-guide/index.html">Branding Guide</a></li>
        <li><a href="{prefix}seo-guide/index.html">SEO Guide</a></li>
      </ul>
    </div>

    <div class="footer-col">
      <h4>Legal</h4>
      <ul class="footer-links">
        <li><a href="{prefix}privacy-policy/index.html">Privacy Policy</a></li>
        <li><a href="{prefix}terms-conditions/index.html">Terms &amp; Conditions</a></li>
        <li><a href="{prefix}terms-of-service/index.html">Terms of Service</a></li>
        <li><a href="{prefix}cookie-policy/index.html">Cookie Policy</a></li>
        <li><a href="{prefix}refund-policy/index.html">Refund Policy</a></li>
        <li><a href="{prefix}cancellation-policy/index.html">Cancellation Policy</a></li>
        <li><a href="{prefix}service-agreement/index.html">Service Agreement</a></li>
        <li><a href="{prefix}copyright-notice/index.html">Copyright Notice</a></li>
        <li><a href="{prefix}disclaimer/index.html">Disclaimer</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-contact-bar">
    <div class="fcb-item sales">
      <div class="fcb-ic"><i class="fas fa-briefcase" aria-hidden="true"></i></div>
      <div><b>Sales &amp; Marketing</b><a href="{SALES_WA}?text=Habari%20GA%20Istovia" target="_blank" rel="noopener">+255 625 794 188</a></div>
      <a class="btn btn-sales btn-sm" href="{SALES_WA}?text=Habari%20GA%20Istovia" target="_blank" rel="noopener"><i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
    </div>
    <div class="fcb-item support">
      <div class="fcb-ic"><i class="fas fa-headset" aria-hidden="true"></i></div>
      <div><b>Technical Support</b><a href="{SUPPORT_WA}?text=Habari%20GA%20Istovia%2C%20naomba%20msaada" target="_blank" rel="noopener">+255 797 701 372</a></div>
      <a class="btn btn-outline-support btn-sm" href="{SUPPORT_WA}?text=Habari%20GA%20Istovia%2C%20naomba%20msaada" target="_blank" rel="noopener"><i class="fab fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="footer-copy">&copy; 2026 <span>GA Istovia</span>. All rights reserved. Built with <span style="color:#e74c3c;">&hearts;</span> in East Africa. <span class="footer-version">v2.0</span></div>
    <div class="footer-policy"><a href="{prefix}privacy-policy/index.html">Privacy</a><a href="{prefix}terms-conditions/index.html">Terms</a><a href="{prefix}index.html#contact">Contact</a></div>
  </div>
</footer>

<div id="contact-dock">
  <div class="dock-bubble" id="dock-bubble"><i class="fab fa-whatsapp" style="color:var(--sales2);" aria-hidden="true"></i> Tunajibu ndani ya dakika 5!</div>
  <a class="dock-btn support-btn" href="{SUPPORT_WA}?text=Habari%20GA%20Istovia%2C%20naomba%20msaada%20wa%20kiufundi" target="_blank" rel="noopener" aria-label="Wasiliana na Technical Support kwa WhatsApp" title="Technical Support"><i class="fas fa-headset" aria-hidden="true"></i></a>
  <a class="dock-btn sales-btn" id="dock-sales-btn" href="{SALES_WA}?text=Habari%20GA%20Istovia%2C%20nataka%20kuanza%20mradi" target="_blank" rel="noopener" aria-label="Wasiliana na Sales kwa WhatsApp" title="Sales &amp; Marketing"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
</div>
<a href="#hero-top" id="back-top" aria-label="Rudi juu"><i class="fas fa-arrow-up" aria-hidden="true"></i></a>
<div id="toast" role="status" aria-live="polite"></div>

<script src="{prefix}assets/js/main.js"></script>"""

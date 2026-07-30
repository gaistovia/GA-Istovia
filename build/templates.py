# -*- coding: utf-8 -*-
"""templates.py — page-body templates rendered inside the shared chrome."""


def hero(eyebrow, title_html, sub, crumb_html, extra=""):
    return f"""<div class="page-hero reveal" id="hero-top">
  {crumb_html}
  <div class="eyebrow"><i class="fas fa-sparkles" aria-hidden="true"></i> {eyebrow}</div>
  <h1 class="sec-title">{title_html}</h1>
  <p class="sec-sub">{sub}</p>
  {extra}
</div>"""


PLACEHOLDER_NOTE = """<div class="placeholder-note"><i class="fas fa-circle-info" aria-hidden="true"></i><span>Hii ni placeholder page iliyoandaliwa kwa muundo kamili wa website. Maudhui kamili yataongezwa hapa hivi karibuni — muundo, SEO na navigation tayari viko production-ready.</span></div>"""


def cta_band(prefix):
    return f"""<div class="cta-band reveal">
  <h3>Uko Tayari Kuanza?</h3>
  <p>Ongea na timu sahihi — mradi mpya au msaada wa kiufundi.</p>
  <div class="dual-cta">
    <a class="btn btn-sales magnetic" href="{prefix}start-a-project.html"><i class="fas fa-rocket" aria-hidden="true"></i> Anza Mradi</a>
    <a class="btn btn-outline-support magnetic" href="https://wa.me/255797701372?text=Habari%20GA%20Istovia%2C%20naomba%20msaada" target="_blank" rel="noopener"><i class="fas fa-headset" aria-hidden="true"></i> Msaada wa Kiufundi</a>
  </div>
</div>"""


def generic_page(prefix, eyebrow, title_html, sub, crumb_html, blocks_html, wide=False):
    width_cls = "page-content-wide" if wide else "page-content"
    return f"""<main id="main">
{hero(eyebrow, title_html, sub, crumb_html)}
<div class="{width_cls} reveal">
{PLACEHOLDER_NOTE}
{blocks_html}
{cta_band(prefix)}
</div>
</main>"""


def service_page(prefix, name, icon, summary, benefits, features, crumb_html):
    benefits_html = "".join(
        f'<div><i class="fas fa-check" aria-hidden="true"></i> {b}</div>' for b in benefits
    )
    features_html = "".join(
        f'<div class="mini-card"><i class="fas fa-{ic}" aria-hidden="true"></i><h4>{t}</h4><p>{d}</p></div>'
        for ic, t, d in features
    )
    return f"""<main id="main">
<div class="page-hero reveal" id="hero-top">
  {crumb_html}
  <div class="svc-hero-icon"><i class="fas fa-{icon}" aria-hidden="true"></i></div>
  <div class="eyebrow"><i class="fas fa-sparkles" aria-hidden="true"></i> Service</div>
  <h1 class="sec-title">{name}</h1>
  <p class="sec-sub">{summary}</p>
</div>
<div class="page-content-wide reveal">
{PLACEHOLDER_NOTE}
<div class="content-block">
  <h2>Faida Kwako</h2>
  <div class="feat-check-grid">{benefits_html}</div>
</div>
<div class="content-block">
  <h2>Vipengele</h2>
  <div class="mini-cards">{features_html}</div>
</div>
<div class="content-block">
  <h2>Mchakato Wetu</h2>
  <div class="proc-row" style="max-width:none;">
    <div class="proc-step"><div class="proc-num-wrap"><div class="proc-num">01</div></div><h3 class="proc-title">Strategy</h3><p class="proc-desc">Tunaelewa malengo yako na hadhira.</p></div>
    <div class="proc-step"><div class="proc-num-wrap"><div class="proc-num">02</div></div><h3 class="proc-title">Design</h3><p class="proc-desc">Design inayolenga conversions.</p></div>
    <div class="proc-step"><div class="proc-num-wrap"><div class="proc-num">03</div></div><h3 class="proc-title">Build</h3><p class="proc-desc">Utekelezaji safi na sahihi.</p></div>
    <div class="proc-step"><div class="proc-num-wrap"><div class="proc-num">04</div></div><h3 class="proc-title">Launch</h3><p class="proc-desc">Uzinduzi na msaada unaoendelea.</p></div>
  </div>
</div>
{cta_band(prefix)}
</div>
</main>"""


def legal_page(prefix, title, crumb_html, sections):
    body = ""
    for h, paragraphs in sections:
        body += f'<div class="content-block"><h2>{h}</h2>'
        for p in paragraphs:
            body += f"<p>{p}</p>"
        body += "</div>"
    return f"""<main id="main">
<div class="page-hero reveal" id="hero-top">
  {crumb_html}
  <div class="eyebrow"><i class="fas fa-scale-balanced" aria-hidden="true"></i> Legal</div>
  <h1 class="sec-title">{title}</h1>
  <span class="updated-note"><i class="fas fa-clock" aria-hidden="true"></i> Ilisasishwa mwisho: Placeholder — tarehe halisi itaongezwa</span>
</div>
<div class="page-content reveal">
{PLACEHOLDER_NOTE}
{body}
{cta_band(prefix)}
</div>
</main>"""


def client_portal_page(prefix):
    return f"""<main id="main">
<div class="portal-shell">
  <div class="portal-welcome reveal">
    <div class="eyebrow" style="justify-content:center;"><i class="fas fa-user-check" aria-hidden="true"></i> Client Portal</div>
    <h1 class="sec-title">Karibu tena, <em>Mteja wa GA Istovia</em></h1>
    <p class="sec-sub" style="margin:0 auto;">Hii ni portal yako binafsi ya mradi. Hapa chini unaweza kuona hali ya mradi wako, ratiba, na njia za haraka za kuwasiliana na timu yetu.</p>
    <div class="portal-id-chip"><i class="fas fa-hashtag" aria-hidden="true"></i> Project ID: <strong>GA-0000</strong> <span style="color:var(--ink3);font-size:.7rem;">(placeholder — Apps Script itajaza hii Phase 3)</span></div>
  </div>

  <div class="portal-grid reveal">
    <div>
      <div class="portal-card">
        <h3><i class="fas fa-route" aria-hidden="true"></i> Hali ya Mradi</h3>
        <div class="status-track">
          <div class="status-step done"><div class="status-dot"><i class="fas fa-check" aria-hidden="true"></i></div><div><b>Project Received</b><span>Fomu yako imepokelewa na timu yetu.</span></div></div>
          <div class="status-step done"><div class="status-dot"><i class="fas fa-check" aria-hidden="true"></i></div><div><b>Discovery</b><span>Tumepitia mahitaji yako ya awali.</span></div></div>
          <div class="status-step active"><div class="status-dot">3</div><div><b>Planning</b><span>Tunapanga muundo na ratiba ya mradi.</span></div></div>
          <div class="status-step"><div class="status-dot">4</div><div><b>UI/UX Design</b><span>Inasubiri hatua iliyotangulia.</span></div></div>
          <div class="status-step"><div class="status-dot">5</div><div><b>Development</b><span>Inasubiri hatua iliyotangulia.</span></div></div>
          <div class="status-step"><div class="status-dot">6</div><div><b>Testing &amp; Review</b><span>Inasubiri hatua iliyotangulia.</span></div></div>
          <div class="status-step"><div class="status-dot">7</div><div><b>Completed</b><span>Inasubiri hatua iliyotangulia.</span></div></div>
        </div>
      </div>
      <div class="portal-card">
        <h3><i class="fas fa-note-sticky" aria-hidden="true"></i> Maelezo ya Hivi Karibuni</h3>
        <p style="color:var(--ink2);font-size:.88rem;line-height:1.8;">Placeholder — timu yetu itaweka updates za hivi karibuni za mradi wako hapa. (Sehemu hii itaunganishwa na Google Sheets kwenye Phase 3.)</p>
      </div>
    </div>
    <div>
      <div class="portal-card">
        <h3><i class="fas fa-address-book" aria-hidden="true"></i> Wasiliana Nasi</h3>
        <a class="portal-action-btn" href="https://wa.me/255625794188?text=Habari%20GA%20Istovia%2C%20naomba%20taarifa%20za%20mradi%20wangu" target="_blank" rel="noopener"><i class="fas fa-briefcase" aria-hidden="true"></i> Contact Sales</a>
        <a class="portal-action-btn" href="https://wa.me/255797701372?text=Habari%20GA%20Istovia%2C%20naomba%20msaada%20wa%20kiufundi%20kwa%20mradi%20wangu" target="_blank" rel="noopener"><i class="fas fa-headset" aria-hidden="true"></i> Contact Designer/Support</a>
        <a class="portal-action-btn" href="{prefix}book-discovery-call/index.html"><i class="fas fa-calendar" aria-hidden="true"></i> Schedule Meeting <span class="soon-tag">soon</span></a>
      </div>
      <div class="portal-card">
        <h3><i class="fas fa-folder-open" aria-hidden="true"></i> Faili &amp; Nyaraka</h3>
        <a class="portal-action-btn" href="#" onclick="return false;"><i class="fas fa-download" aria-hidden="true"></i> Download Files <span class="soon-tag">soon</span></a>
        <a class="portal-action-btn" href="#" onclick="return false;"><i class="fas fa-file-invoice-dollar" aria-hidden="true"></i> Invoice <span class="soon-tag">soon</span></a>
        <a class="portal-action-btn" href="#" onclick="return false;"><i class="fas fa-file-contract" aria-hidden="true"></i> Contract <span class="soon-tag">soon</span></a>
      </div>
    </div>
  </div>
</div>
</main>"""

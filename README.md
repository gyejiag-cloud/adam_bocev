# FounderOS — Marketing Website

A complete, production-ready marketing site for **FounderOS**, the AI venture intelligence
platform. Static HTML/CSS/JS — no build step, no dependencies, no framework.

## Run it

Open `index.html` in any browser. That's it.

For a local server (recommended, so relative paths behave exactly as in production):

```bash
python -m http.server 8000      # then visit http://localhost:8000
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, problem framing, six-agent architecture, how it works, Founder Score, audience tabs, stats, testimonials, FAQ |
| `platform.html` | Product deep-dive — ingestion, agent conflict resolution, sample partner memo, category comparison table, security |
| `founders.html` | Founder audience — workspace features, simulated investor meetings, 18-month journey timeline, FAQ |
| `investors.html` | Investors, accelerators, family offices, angel networks, universities, public agencies — screening funnel, diligence pack, deployment |
| `pricing.html` | Three founder tiers + enterprise band, monthly/annual toggle, full feature comparison, billing FAQ |
| `about.html` | Story, principles, history, team, responsible-AI position |
| `contact.html` | Demo/snapshot request form, direct contacts, offices, FAQ |

## Structure

```
adam/
├── index.html  platform.html  founders.html  investors.html
├── pricing.html  about.html  contact.html
├── assets/
│   ├── css/style.css     # complete design system — tokens, components, responsive
│   └── js/main.js        # nav, reveal animations, tabs, accordion, counters, forms
└── README.md
```

Nav and footer markup is duplicated per page (standard for a static site). If you change a
nav link, change it in all seven files.

## Design system

Everything is driven by CSS custom properties at the top of `assets/css/style.css`.
To rebrand, edit the `:root` block only:

```css
--accent:  #6E8BFF;   /* primary — buttons, links, highlights */
--mint:    #33E0AE;   /* positive signal — scores, confirmations */
--amber:   #FFC069;   /* caution */
--rose:    #FF7A8A;   /* risk */
--bg:      #06080F;   /* page base */
```

- **Type**: Inter with a full system fallback stack. No external font requests, so the site
  works offline and has no render-blocking third-party calls. Drop in a webfont link if you
  want Inter guaranteed everywhere.
- **Logo**: inline SVG in every page header and footer. Replace both instances per page.
- **Favicon**: inline SVG data URI in each `<head>`.
- **Icons**: all inline SVG (Feather-style, 24×24, `stroke-width` 1.8). No icon library.

## Interactions (`assets/js/main.js`)

Vanilla JS, no dependencies, all progressive enhancement — the site is fully readable
with JavaScript disabled.

- Sticky nav that gains a blurred background on scroll
- Mobile menu
- `IntersectionObserver` scroll reveals (`.reveal`, staggered with `data-d="1..5"`)
- Animated score dial (`.dial[data-score]`) and metric bars (`.metric__bar[data-val]`)
- Counting stats (`[data-to]`, optional `data-dec` for decimals)
- Tab groups (`[data-tabs]`), FAQ accordion, pricing monthly/annual toggle
- Card pointer-tracking glow (`.card--glow`)
- `prefers-reduced-motion` is fully respected — all animation is disabled

## Adam's photo, message and LinkedIn

His photo is in place. Two files are generated from the original `adam_b.jpg` (800×800,
kept in the project root as the master copy — not referenced by the site, safe to delete
before deploying):

```
assets/img/adam-bocev.jpg           800x800  full frame
assets/img/adam-bocev-portrait.jpg  600x600  head-and-shoulders crop
```

Two variants exist because in the original his head sits in the upper-left, so a circular or
small square crop of the full frame put him noticeably off-centre. The crop re-centres him for
the small slots; the full frame keeps the "speaking at an event" composition where there's
room for it. See `assets/img/README.txt` to regenerate or swap either one.

Where he appears:

| Location | Image used | What's there |
|---|---|---|
| `index.html` — Founder's note | crop | Round portrait, short quote, "Connect" LinkedIn button, link to the full message |
| `about.html` — Founder's message (`#founders-message`) | full frame | Large portrait, full signed letter, "Connect on LinkedIn" button |
| `about.html` — Team grid | crop | Square portrait, role, inline LinkedIn link |
| All 7 pages — Footer | — | LinkedIn icon points to his profile |

If an image file ever goes missing, each slot falls back automatically to a styled "AB"
monogram rather than showing a broken image.

His LinkedIn (`https://www.linkedin.com/in/adam-bocev/`) is wired into all of these, opening in
a new tab with `rel="noopener noreferrer"`.

> **The founder's message is draft copy written for Adam, not by him.** It's a plausible,
> well-structured letter — but the story in it (being turned down eleven times, the twelfth
> investor's four-minute feedback) is invented. Have Adam read it and either approve it, edit
> it, or replace it with his real story before this goes live. The same applies to his job
> title (currently "Co-founder & CEO") and his team-card bio. Publishing invented first-person
> claims under a real person's name is the one thing on this site you shouldn't ship unchecked.

## Before going live

1. **The contact form is front-end only.** `contact.html` posts nowhere — `main.js` fakes a
   success state for demo purposes. Wire the `<form data-demo>` to a real endpoint (Formspree,
   Netlify Forms, or your own API) and remove the `data-demo` attribute.
2. **Replace placeholder content.** These are invented and must be swapped for real material
   before publishing:
   - Customer logos in the trust bar (Meridian Ventures, Northwind Capital, Halcyon Labs,
     Ardent Accelerator, Vantage Angels)
   - All testimonials and the people quoted in them
   - Adam's founder message, title and bio — see the section above; needs his sign-off
   - The other three team members on `about.html` (Nadia Karim, Jonas Möller, Lucia Chen)
   - Company names in the sample reports and dashboards (Northbeam Labs, Ledgerline, etc.)
   - Statistics in the `.stats` bands
   - Email addresses (currently `@founderos.example`)
3. **Legal pages.** Privacy, Terms, Security and Responsible AI in the footer point to `#`.
4. **Social links** in the footer point to `#`.
5. **Compliance claims.** SOC 2, data residency and the 99.9% SLA are stated on
   `platform.html` and `pricing.html` — confirm each is accurate before launch.
6. **Open Graph image.** `og:title`/`og:description` are set; add an `og:image` for link previews.
7. **Analytics** — none included. Add your snippet before `</body>`.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses CSS custom properties,
`clamp()`, grid, `backdrop-filter` and `IntersectionObserver` — all broadly supported.
Fully responsive down to 360px.

## Deployment

Any static host — Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3. Drag the folder in;
there is nothing to compile.

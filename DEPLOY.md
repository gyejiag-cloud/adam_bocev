# Deploying Apex Synthesis to Cloudflare Pages

Complete walkthrough for putting this site live on **apexsynthesis.com**, with the
domain registered at Namecheap and the code hosted at
`github.com/gyejiag-cloud/adam_bocev`.

**Time required:** about 30 minutes of clicking, plus 15–60 minutes of waiting for
nameservers to propagate. You can do Part 4 while Part 2 is propagating.

---

## What you are deploying

A static site — seven HTML pages, one stylesheet, one script, two images. There is
**no build step**. Cloudflare serves the repository contents directly from its edge
network. This matters because most Cloudflare Pages tutorials assume a framework
(Next, Astro, Vite) and tell you to fill in a build command. You must leave that
field empty. See [Part 4](#part-4--create-the-pages-project).

Two files in the repo exist purely for hosting:

| File | Purpose |
|---|---|
| `_headers` | Security headers and cache policy, applied by Cloudflare at the edge |
| `DEPLOY.md` | This document |

---

## Before you start

You need:

- The Namecheap account that owns `apexsynthesis.com`
- The GitHub account with access to `gyejiag-cloud/adam_bocev`
- An email address for the Cloudflare account

You do **not** need a credit card. Everything here is on Cloudflare's free plan,
which includes unlimited bandwidth and unlimited requests.

---

## Part 1 — Create the Cloudflare account and add the domain

1. Go to **https://dash.cloudflare.com/sign-up** and create an account. Verify the
   email — you cannot add a domain until you do.
2. On the dashboard, click **Add a domain** (or **+ Add** → **Existing domain**).
3. Enter `apexsynthesis.com`. Enter it **without** `www` and **without** `https://`.
4. When asked to select a plan, choose **Free**. Scroll down — the Free plan is at
   the bottom of the list, below the paid tiers.
5. Cloudflare scans the domain's existing DNS records and shows you what it found.
   For a freshly bought domain this will be Namecheap's parking records. Click
   **Continue** — you will clean these up in Part 3.
6. Cloudflare now shows **two nameservers** assigned to your account. They look like:

   ```
   alice.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```

   The names are randomly assigned and **yours will be different**. Copy both.
   Leave this tab open.

---

## Part 2 — Point Namecheap at Cloudflare

This is the step that takes time to take effect, so do it now.

1. Log in to Namecheap → **Domain List** → find `apexsynthesis.com` → **Manage**.
2. Stay on the **Domain** tab. Find the **NAMESERVERS** section.
3. Change the dropdown from **Namecheap BasicDNS** to **Custom DNS**.
4. Two input boxes appear. Paste one Cloudflare nameserver into each. If you only
   see one box, click **ADD NAMESERVER**.
5. **Click the green checkmark (✓) to save.** This is the most commonly missed step
   on this entire page — navigating away without clicking it silently discards the
   change. Reload the page afterwards and confirm both nameservers are still shown.

Back in the Cloudflare tab, click **Continue** / **Check nameservers now**.

**How long this takes:** usually 15–60 minutes. Namecheap and Cloudflare both quote
"up to 48 hours" as a worst case, but that is rare. Cloudflare emails you when the
zone status changes to **Active**. You cannot attach the custom domain in Part 5
until it is Active, but you *can* do Part 4 in the meantime.

---

## Part 3 — Clean out the parking records

Once the zone is Active, go to **Cloudflare dashboard → apexsynthesis.com → DNS →
Records**.

Delete anything Cloudflare imported from Namecheap. Typically:

- A `URL Redirect` or `A` record on `@` pointing at a Namecheap parking IP
- A `CNAME` on `www` pointing at `parkingpage.namecheap.com`

**Leave these alone if present:**

- `MX` records — these route email. You have none today, but if you later set up
  email on this domain, deleting MX records breaks it.
- `TXT` records containing `v=spf1` or domain verification strings.

If in doubt, screenshot the record list before deleting anything.

After Part 5, this list should contain records pointing at `pages.dev` — those are
created for you, do not hand-edit them.

---

## Part 4 — Create the Pages project

You can do this while Part 2 is still propagating.

1. In the Cloudflare dashboard sidebar: **Compute (Workers & Pages)** → **Create** →
   select the **Pages** tab → **Connect to Git**.
2. Authorize Cloudflare's GitHub app. When GitHub asks which repositories to grant
   access to, you can select **only** `gyejiag-cloud/adam_bocev` rather than all
   repositories.
3. Select `adam_bocev` → **Begin setup**.
4. Configure the build. **These exact values matter:**

   | Field | Value |
   |---|---|
   | Project name | `apexsynthesis` (becomes `apexsynthesis.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | **leave completely empty** |
   | Build output directory | `/` |
   | Root directory | leave as default (blank) |

   If Cloudflare pre-fills a framework preset or a build command, **clear it**. A
   build command on a site with no build system causes the deploy to fail, or
   worse, to succeed while publishing an empty directory.

5. Click **Save and Deploy**. The first deploy takes roughly 30 seconds.
6. You get a URL like `https://apexsynthesis.pages.dev`. **Open it and check the
   site actually renders** — navigation, styling, images, the FAQ accordions.

   Debug at this stage, before DNS is involved. If something is broken here it is a
   repo or build-settings problem; if it only breaks after Part 5 it is a DNS or SSL
   problem. Keeping those separate saves a lot of guessing.

---

## Part 5 — Attach apexsynthesis.com

Requires the zone to be **Active** (Part 2 complete).

1. Open your Pages project → **Custom domains** tab → **Set up a custom domain**.
2. Enter `apexsynthesis.com` → **Continue** → **Activate domain**.

   Because your DNS is already on Cloudflare, it creates the necessary record
   itself. There is nothing to copy into Namecheap. The apex domain works via
   Cloudflare's CNAME flattening.

3. Repeat for `www.apexsynthesis.com`.
4. Status moves from **Initializing** → **Pending** → **Active**. Certificate issuance
   usually takes a few minutes and can occasionally take up to 15.

### Choosing a canonical domain

Having both live means search engines see two copies of the site. Pick one:

- Go to **Rules → Redirect Rules → Create rule**
- Name: `www to apex`
- If incoming requests match: **Hostname** *equals* `www.apexsynthesis.com`
- Then: **Dynamic redirect**, expression `concat("https://apexsynthesis.com", http.request.uri.path)`
- Status: **301** (permanent)

Reverse the hostnames if you prefer `www` as canonical.

---

## Part 6 — SSL settings

**Do not skip this.** Go to **SSL/TLS → Overview**.

1. Set encryption mode to **Full (strict)**.

   If this is left on **Flexible**, Cloudflare connects to Pages over plain HTTP
   while telling the browser the connection is HTTPS. Pages then redirects to
   HTTPS, and you get an infinite redirect loop — `ERR_TOO_MANY_REDIRECTS`. This is
   the single most common Cloudflare Pages failure and it is entirely a settings
   problem, not a code problem.

2. Go to **SSL/TLS → Edge Certificates** and enable:
   - **Always Use HTTPS**
   - **Automatic HTTPS Rewrites**

3. Leave **Universal SSL** enabled. Your certificate is issued and renewed
   automatically at no cost.

---

## Part 7 — Verify

Check each of these in a browser:

- [ ] `https://apexsynthesis.com` loads the site
- [ ] `http://apexsynthesis.com` redirects to HTTPS automatically
- [ ] `https://www.apexsynthesis.com` resolves (redirecting is fine)
- [ ] The padlock shows a valid certificate
- [ ] All seven pages load: index, platform, founders, investors, pricing, about, contact
- [ ] CSS and both images render — a missing stylesheet means a wrong output directory
- [ ] Mobile view: the hamburger menu opens, and the "Apex Synthesis" wordmark does
      not crowd the CTA button at ~360px width
- [ ] The favicon shows the A mark in the browser tab

Command-line check that DNS resolves to Cloudflare:

```bash
nslookup apexsynthesis.com
```

---

## Deploying updates

Once connected, deployment is automatic:

```bash
git add -A
git commit -m "your message"
git push origin main
```

Cloudflare picks up the push and redeploys in about 30 seconds. Watch progress
under **Deployments** in the Pages project.

**Preview deployments:** any branch that is not `main` gets its own URL, so you can
review a change before it goes to the live domain:

```bash
git checkout -b new-testimonials
git push origin new-testimonials
```

**Rollback:** Pages keeps every deployment. Go to **Deployments**, find a known-good
one, and use **⋯ → Rollback to this deployment**. This is instant and does not
require a git revert — useful if a bad change goes out during a launch.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ERR_TOO_MANY_REDIRECTS` | SSL mode is Flexible | Set **Full (strict)** — Part 6 |
| Namecheap parking page still shows | Nameservers not propagated, or parking records left in Cloudflare DNS | Recheck Part 2 saved with the ✓; delete parking records per Part 3 |
| Site loads but is unstyled | Wrong build output directory | Set it to `/` — Part 4 |
| Deploy fails, or publishes nothing | A build command was set | Clear the build command entirely — Part 4 |
| Custom domain stuck "Verifying" | Zone not Active yet | Wait for the Cloudflare email, then retry Part 5 |
| Certificate error for a few minutes after setup | Universal SSL still issuing | Wait up to 15 minutes |
| Nameserver change won't save at Namecheap | Green checkmark not clicked | Redo Part 2, step 5 |
| Old CSS after a deploy | Browser cache | Hard reload (Ctrl+F5). `_headers` sets css/js to revalidate, so this should be rare |

---

## Outstanding before you send real traffic here

These are content and functionality issues, not hosting issues. The site will deploy
fine without them — but it should not be promoted until they are resolved.

### 1. The contact form silently discards submissions

`contact.html:71` defines the only form on the site. `assets/js/main.js:182` handles
it by calling `preventDefault()`, waiting 700ms, showing the green success message,
and **throwing the data away**. Nothing is transmitted anywhere.

A visitor fills it in, sees a confirmation, and you never learn they existed. This
is worse than having no form at all.

Cloudflare has no built-in form handling, so pick one:

- **Pages Function + Resend** — add `/functions/api/contact.js` to this repo, keeps
  everything on Cloudflare, needs a Resend account and API key. Note that older
  tutorials recommending **MailChannels** no longer work; that free relay for
  Cloudflare Workers was discontinued in 2024.
- **Web3Forms / Formspree** — a `fetch` POST to a third-party endpoint. Roughly ten
  lines, no backend, free tiers cover this volume.

### 2. Placeholder content

Listed in full in `README.md` §2. The significant ones:

- Customer logos in the trust bar (Meridian Ventures, Northwind Capital, Halcyon
  Labs, Ardent Accelerator, Vantage Angels) — **invented**
- All testimonials and the people quoted in them — **invented**
- Three of the four team members on `about.html` (Nadia Karim, Jonas Möller,
  Lucia Chen) — **invented**
- Statistics in the `.stats` bands — **invented**

Publishing fabricated customer names, quotes and team members on a live commercial
site is a legal and reputational exposure, not a cosmetic gap.

### 3. Smaller gaps

- Footer legal pages (Privacy, Terms, Security, Responsible AI) all point to `#`
- Footer social links point to `#`
- No `404.html`, so Cloudflare serves a generic error page
- No `og:image`, so link previews on LinkedIn and X show no thumbnail
- Compliance claims on `platform.html` and `pricing.html` (SOC 2, data residency,
  99.9% SLA) need to be verified as accurate before they are published

---

## Reference

- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- `_headers` syntax: https://developers.cloudflare.com/pages/configuration/headers/
- Namecheap nameserver guide: https://www.namecheap.com/support/knowledgebase/article.aspx/767/

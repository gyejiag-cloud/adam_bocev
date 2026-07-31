# Setting up email on apexsynthesis.com

How to get `hello@apexsynthesis.com`, `partners@apexsynthesis.com` and
`security@apexsynthesis.com` — the three addresses already published on
`contact.html` — actually working.

**Prerequisite:** the domain's nameservers must already point at Cloudflare
(see `DEPLOY.md`, Part 2). All DNS changes below happen in the **Cloudflare**
dashboard.

> **Important:** once nameservers moved to Cloudflare, Namecheap's *Advanced DNS*
> tab stopped doing anything. Records added there will be silently ignored. If a
> guide tells you to add DNS records "at your registrar", it means Cloudflare now.

---

## The one constraint

Mail delivery is controlled by **MX records**, and a domain can point its MX at
exactly **one** provider. This is a single choice, not a combination. Switching
later means re-pointing MX and migrating any stored mail.

## Choosing a provider

| | Google Workspace | Zoho Mail (free) | Cloudflare Email Routing |
|---|---|---|---|
| Cost | ~₹150/user/mo + GST | Free | Free |
| Receive | Real mailbox | Real mailbox | Forwards to your Gmail |
| **Send from the address** | Yes | Yes | **No — receive only** |
| Interface | Gmail | Zoho webmail + app | Your existing Gmail |
| IMAP/POP | Yes | **Not on free plan** | N/A |
| Free aliases | 30 per user | Yes | Unlimited |
| Setup time | ~20 min | ~20 min | ~5 min |

**Recommended: Google Workspace, one paid user.** You pay per *mailbox*, and
aliases are free — so `adam@apexsynthesis.com` is the single paid account, and
`hello@`, `partners@` and `security@` are free aliases delivering into it. That
covers every published address for one seat.

The reason to pay rather than take a free tier: **deliverability**. Cold email to
investors from a Google Workspace domain lands in inboxes reliably. That is the
entire job here.

**If the budget is zero:** choose Zoho, not Cloudflare. Being able to *send* from
your domain matters more than inbox convenience. Cloudflare Email Routing forwards
mail in fine, but replies go out from your personal Gmail address, which defeats
the purpose of owning the domain.

Now follow **one** of the three sections below, then do the **Authentication**
section, which applies to all of them.

---

# Option A — Google Workspace (recommended)

## A1. Create the account

1. Go to **https://workspace.google.com** → **Get started**.
2. Enter the business name, employee count (**Just you** is fine) and region
   (**India**).
3. When asked about a domain, choose **Yes, I have one I can use** and enter
   `apexsynthesis.com`.
4. Create your first user — make this the real mailbox, e.g. `adam`. This becomes
   both the login and the admin account.
5. Choose **Business Starter** unless you need more than 30 GB of storage or
   recording-capable Meet.

Billing note: annual commitment is cheaper per month than flexible, but locks you
in for a year. For a pre-launch company, flexible is the safer first choice.

## A2. Verify domain ownership

Google gives you a **TXT record** to prove you own the domain.

1. Copy the value — it looks like `google-site-verification=AbCdEf123...`
2. In Cloudflare: **apexsynthesis.com → DNS → Records → Add record**
   - Type: `TXT`
   - Name: `@`
   - Content: paste the full `google-site-verification=...` string
   - TTL: Auto
3. Save, then click **Verify** in the Google setup wizard.

Usually verifies within a minute or two.

## A3. Add MX records

In Cloudflare **DNS → Records**, first **delete any existing MX records** —
Namecheap parking sometimes leaves one behind.

Then add Google's current single MX record:

| Type | Name | Mail server | Priority | TTL |
|---|---|---|---|---|
| MX | `@` | `smtp.google.com` | `1` | Auto |

> Older Google documentation lists five records (`ASPMX.L.GOOGLE.COM`,
> `ALT1.` … `ALT4.`). Those still work, but the single `smtp.google.com` record is
> the current recommendation and is simpler to maintain. **Use one set or the
> other — never both.**

MX records cannot be proxied, so Cloudflare will show them as DNS-only. That is
correct; do not try to change it.

## A4. Create the aliases

The three published addresses become free aliases on your one mailbox.

1. Go to **admin.google.com** → **Directory → Users**.
2. Click your user → **User information** → **Alternate email addresses (email
   aliases)**.
3. Add each, one per line:
   - `hello@apexsynthesis.com`
   - `partners@apexsynthesis.com`
   - `security@apexsynthesis.com`
4. Save. Aliases become active within about 24 hours, though usually much faster.

You get up to **30 aliases per user at no extra cost**. Mail to all of them lands
in the same inbox.

## A5. Send *as* an alias

By default replies go out as `adam@apexsynthesis.com`. To reply as `hello@`:

1. In Gmail: **Settings (⚙) → See all settings → Accounts and Import**.
2. Under **Send mail as**, click **Add another email address**.
3. Enter the alias, leave **Treat as an alias** ticked, click **Next → Send
   verification**.

Because it is a true Workspace alias, no SMTP credentials are needed.

To make a role address the default sender, click **make default** next to it.

Now skip to [Authentication](#authentication--applies-to-every-option).

---

# Option B — Zoho Mail (free plan)

Zoho's Forever Free plan covers a single domain with a handful of users at 5 GB
each. Access is **web and mobile app only — no IMAP or POP**, so you cannot use
Gmail, Outlook or Apple Mail as the client. Confirm the current user limit when you
sign up; Zoho has revised it more than once.

## B1. Sign up

1. Go to **https://www.zoho.com/mail/** → **Sign Up Now** → scroll to the
   **Forever Free Plan**.
2. Choose **Sign up with a domain I already own** and enter `apexsynthesis.com`.
3. Select your data centre carefully — **India (zoho.in)** or international
   (zoho.com). **This cannot be changed later**, and it determines every hostname
   below.

## B2. Verify the domain

Zoho gives you a TXT (or CNAME) verification record. Add it in Cloudflare
**DNS → Records** exactly as shown, then click **Verify** in Zoho.

## B3. Add MX records

Delete existing MX records first, then add — **for the zoho.com data centre**:

| Type | Name | Mail server | Priority |
|---|---|---|---|
| MX | `@` | `mx.zoho.com` | `10` |
| MX | `@` | `mx2.zoho.com` | `20` |
| MX | `@` | `mx3.zoho.com` | `50` |

If you chose the **India** data centre, the hostnames end in `.zoho.in` instead
(`mx.zoho.in`, `mx2.zoho.in`, `mx3.zoho.in`).

**Use the exact values Zoho's own setup wizard displays.** They are authoritative
for your account and data centre; the table above is only what to expect.

## B4. Create the addresses

In the Zoho control panel, create `hello@` as the primary user, then add
`partners@` and `security@` as **aliases** on that user (**Users → select user →
Mail Aliases**) rather than burning separate user seats.

---

# Option C — Cloudflare Email Routing (free, receive-only)

Choose this only if you genuinely just need mail *forwarded* and accept that you
cannot reply from the domain.

1. Cloudflare dashboard → **apexsynthesis.com → Email → Email Routing** →
   **Get started**.
2. Create the routes:

   | Custom address | Destination |
   |---|---|
   | `hello@apexsynthesis.com` | `sonavane.arnav2@gmail.com` |
   | `partners@apexsynthesis.com` | `sonavane.arnav2@gmail.com` |
   | `security@apexsynthesis.com` | `sonavane.arnav2@gmail.com` |

3. Cloudflare emails the destination address a confirmation link. **Click it** —
   routing stays inactive until the destination is verified.
4. Click **Add records automatically**. Cloudflare adds its own MX records
   (`route1.mx.cloudflare.net` and siblings) plus the matching SPF record. This
   **overwrites existing MX records**, so do not run this alongside Option A or B.

Optionally add a **catch-all** so mail to any address at the domain forwards rather
than bouncing.

---

# Authentication — applies to every option

Three DNS records decide whether your mail reaches inboxes or spam folders, and
whether strangers can forge mail from your domain. Skipping them is the single most
common reason a new domain's email "doesn't work". Add all three in Cloudflare
**DNS → Records**.

## SPF — who may send as you

One TXT record on `@`. Use the value matching your provider:

| Provider | Value |
|---|---|
| Google Workspace | `v=spf1 include:_spf.google.com ~all` |
| Zoho (zoho.com) | `v=spf1 include:zohomail.com ~all` |
| Zoho (zoho.in) | `v=spf1 include:zohomail.in ~all` |
| Cloudflare Routing | added automatically |

**You may only have one SPF record.** If you later add a form or newsletter service
that also sends as your domain, do not add a second record — merge the includes
into the existing one:

```
v=spf1 include:_spf.google.com include:amazonses.com ~all
```

SPF is also capped at **10 DNS lookups**. Each `include:` costs at least one. Two
or three services is fine; a dozen silently breaks SPF entirely.

## DKIM — cryptographic signature

DKIM is generated by the provider, not written by hand.

**Google Workspace:** admin.google.com → **Apps → Google Workspace → Gmail →
Authenticate email** → select the domain → **Generate new record** → choose
**2048-bit** → copy the host (usually `google._domainkey`) and the long TXT value
into Cloudflare → return and click **Start authentication**.

**Zoho:** control panel → **Domains → DKIM → Add selector**, then publish the TXT
record it produces.

The DKIM value is long and often line-wrapped in the UI. Paste it as one
continuous string with no added spaces or line breaks — mangled whitespace is the
usual cause of DKIM failing to verify.

## DMARC — the policy

One TXT record. **Start permissive**, then tighten:

| Field | Value |
|---|---|
| Type | `TXT` |
| Name | `_dmarc` |
| Content | `v=DMARC1; p=none; rua=mailto:adam@apexsynthesis.com; pct=100` |

`p=none` means "monitor and report, enforce nothing". Run it for two to four weeks
and read the aggregate reports sent to the `rua` address. Once you have confirmed
every legitimate sender passes, tighten in stages:

1. `p=none` — monitor only
2. `p=quarantine` — failures go to spam
3. `p=reject` — failures are refused outright

Jumping straight to `p=reject` before checking reports will silently kill mail from
services you forgot were sending as you.

---

# Verify it works

Wait 15–30 minutes after the DNS changes, then:

1. **Send a test in:** from a personal address, email `hello@apexsynthesis.com`.
   Confirm it arrives.
2. **Send a test out:** reply from the domain address. Confirm it arrives and shows
   the correct From.
3. **Check authentication.** In Gmail, open the received message → **⋮ → Show
   original**. You want:

   ```
   SPF:   PASS
   DKIM:  PASS
   DMARC: PASS
   ```

   Anything other than PASS means the corresponding record is wrong or has not
   propagated yet.

4. **Score the domain.** Send a message to the address shown at
   **https://www.mail-tester.com** and aim for 9/10 or better. It names the exact
   failing record if you are short.

Command-line check:

```bash
nslookup -type=mx apexsynthesis.com
nslookup -type=txt apexsynthesis.com
nslookup -type=txt _dmarc.apexsynthesis.com
```

---

# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Incoming mail bounces | MX not propagated, or old MX still present | Check for leftover MX records in Cloudflare DNS |
| Sent mail lands in spam | SPF/DKIM/DMARC missing or failing | Run mail-tester, fix the record it names |
| DKIM shows FAIL | Value pasted with line breaks | Re-paste as one continuous string |
| Records added but nothing changed | Added at Namecheap, not Cloudflare | Namecheap DNS is inert after the nameserver move — use Cloudflare |
| Google verification won't complete | TXT on wrong name | Name must be `@`, not `apexsynthesis.com` |
| Replies show your Gmail address | Using Cloudflare Email Routing | Expected — it is receive-only. Move to Option A or B |
| Two SPF records present | A service told you to add another | Merge the includes into one record |

---

# How this interacts with the contact form

`contact.html` currently discards submissions (see `DEPLOY.md`). When you wire it
up, the sending service also needs to authenticate as your domain:

- **Resend / Amazon SES / Brevo** — each requires its own DKIM records and an
  addition to your **existing** SPF record, not a second one.
- **Web3Forms / Formspree** — these send from *their* domain, so no DNS changes are
  needed. Simpler, at the cost of a less branded notification email.

If you intend to use a sending service, set it up in the same session as the
records above. Doing SPF twice, weeks apart, is how domains end up with two
conflicting records and mail silently failing.

---

# Reference

- Google Workspace MX setup: https://support.google.com/a/answer/140034
- Google DKIM: https://support.google.com/a/answer/174124
- Zoho Mail setup: https://www.zoho.com/mail/help/adminconsole/domain-verification.html
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/
- DMARC overview: https://dmarc.org/overview/

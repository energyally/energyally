# EnergyAlly — Marketing Site

The operating system for energy distribution. A static marketing site for
EnergyAlly, the operational platform for India's LPG, petroleum, solar, and
water distribution businesses.

## Live sections

- **Hero** — animated business-case gauges (addressable units, payback, gross margin)
- **Ops Live** — a "live manifest" ledger showing routes, orders, stock, and complaints
- **Solution** — the operational problems EnergyAlly solves
- **Voices** — customer testimonials
- **Modules** — the nine core product modules
- **Verticals** — an interactive LPG / petroleum / solar / water workflow switcher
- **Pricing** — monthly / yearly toggle with three plans
- **Contact** — details, social links, and a demo request form

## Project structure

```
energyally-website/
├── index.html                  # Page markup
├── css/
│   └── styles.css              # All styling
├── js/
│   └── main.js                 # Scrollspy, reveal animations, gauges,
│                                # ledger counters, vertical switcher, pricing
│                                # toggle, and demo-form submission
├── google-apps-script-leads.gs # Apps Script web app: saves leads to a Google
│                                # Sheet and emails the EnergyAlly inboxes
├── assets/
│   ├── images/
│   │   ├── logo.png            # Full logo lockup (icon + wordmark + tagline)
│   │   └── logo-icon.png       # Icon-only mark, transparent background (used in nav)
│   └── favicon/
│       ├── favicon.ico
│       ├── favicon-16x16.png
│       ├── favicon-32x32.png
│       ├── favicon-48x48.png
│       ├── apple-touch-icon.png
│       ├── android-chrome-192x192.png
│       ├── android-chrome-512x512.png
│       └── site.webmanifest
└── README.md
```

## Running locally

No build step or dependencies — it's plain HTML/CSS/JS. Serve the folder with
any static server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

or just open `index.html` directly in a browser (some browsers restrict
`fetch`/module features on `file://`, but this site doesn't use either, so
opening the file directly also works).

## Deploying

Works as-is on any static host — GitHub Pages, Netlify, Vercel, S3, etc.
For GitHub Pages: push this folder to a repo, then enable Pages on the
`main` branch (root or `/docs`, depending on where you place these files).

## Fonts

Loaded from Google Fonts:
- **Oswald** — headings
- **IBM Plex Sans** — body copy
- **IBM Plex Mono** — data, labels, and ledger figures

## Notes

- The demo request form in the Contact section posts to a Google Apps Script
  web app (`google-apps-script-leads.gs`), which appends each lead to a "Leads"
  Google Sheet on Drive and emails the EnergyAlly inbox
  (`tech.energyally@gmail.com`). To enable it, paste your existing deployed
  Apps Script `/exec` web app URL into the `DEMO_ENDPOINT` constant in
  `js/main.js` (Apps Script project → **Deploy → Manage deployments** → copy
  the Web app URL). No redeployment is required.
- Testimonials and social links use placeholder content/URLs — replace with
  real ones in `index.html` before shipping.

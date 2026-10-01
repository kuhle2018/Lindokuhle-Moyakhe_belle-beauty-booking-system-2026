# Belle Beauty — Hair Weave Salon Booking Site

A calm, mobile-friendly booking website built for **Belle Beauty**, a hair weave installation studio in Cape Town. Designed and developed by **Lindokuhle Moyakhe**.

🔗 **Live site:** https://belle-beauty-booking-mu.vercel.app

![Belle Beauty home page](./screenshots/01-home.png)

## Features

- On-brand design in an off-white, nude and black palette
- Installation service menu with pricing
- Shop page for weave bundles
- Booking form — name, surname, phone, service, date and time
- Booking requests sent straight to the owner's WhatsApp, no admin needed to receive them
- Appointment changes and cancellations handled directly over WhatsApp
- Fully responsive, built mobile-first since most bookings happen on a phone

## Screenshots

| Home | Installation Menu | Shop |
|---|---|---|
| ![Home](./screenshots/01-home.png) | ![Installation menu](./screenshots/02-services.png) | ![Shop](./screenshots/03-shop.png) |

| Gallery | About | Book |
|---|---|---|
| ![Gallery](./screenshots/04-gallery.png) | ![About](./screenshots/05-about.png) | ![Booking form](./screenshots/06-book.png) |

## Tech stack

- Vite-powered frontend, deployed on Vercel
- Optional serverless backend (`api/bookings.js`) for database-backed bookings
- Supabase for the optional database layer
- WhatsApp Cloud API / Resend for optional automated notifications

## Run locally

```bash
npm install
npm run dev
```

Vite will print a local address in the terminal, usually `http://localhost:5173`. The live production site is the Vercel link above — that stays the same regardless of what address your local dev server uses.

## Current booking flow (v1 — live now)

The live site sends booking requests directly to WhatsApp. It doesn't yet save bookings to a database or check availability — the owner confirms each request manually in WhatsApp. This keeps the first launch simple, with no API or database required to go live.

## Optional v2 — database-backed bookings

`api/bookings.js` supports saving bookings to a database and sending automatic email or WhatsApp notifications instead of the manual flow above. It requires:

- A serverless host (already set up on Vercel)
- The schema in `supabase/schema.sql`
- The environment variables below

```text
# WhatsApp Cloud API (optional)
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
BELLE_OWNER_WHATSAPP=27730806573

# Resend email (optional)
RESEND_API_KEY=
BELLE_OWNER_EMAIL=your-email@example.com
```

Verify a sending domain with Resend before using email in production. Do not deploy the v2 flow without these credentials configured.

## Owner contact

Belle Beauty WhatsApp (bookings): 073 080 6573

## Author

**Lindokuhle Moyakhe** — Software Developer & Data Analyst, Cape Town
Email (queries): lindokuhle.moyakhe@gmail.com
GitHub: [github.com/kuhle2018](https://github.com/kuhle2018) · LinkedIn: [Lindokuhle Moyakhe](https://www.linkedin.com/in/lindokuhle-moyakhe-603661253/)

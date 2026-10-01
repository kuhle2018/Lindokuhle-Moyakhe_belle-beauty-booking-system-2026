# Belle Beauty

A calm, mobile-friendly booking site for Belle Beauty by Lindokuhle Moyakhe.

## Run locally

```bash
npm install
npm run dev
```

Open the address shown by Vite, usually `belle-beauty-booking-mu.vercel.app`.

## Included in this version

- Installation menu and Belle Beauty visual design
- Booking form with name, surname, phone, service, date and time
- Booking requests sent directly to Belle Beauty on WhatsApp
- Appointment changes and cancellations requested directly on WhatsApp
- Owner WhatsApp contact: 073 080 6573

## Important for going live

The website currently sends booking requests directly to WhatsApp and does not save bookings or check availability. Lindokuhle must confirm each requested appointment in WhatsApp. This avoids requiring an API or database for the initial launch, but bookings and cancellations are handled manually.

The optional `api/bookings.js` endpoint supports database-backed bookings and email, SMS, or WhatsApp notifications. It requires a serverless host such as Vercel, the SQL in `supabase/schema.sql`, and the server environment variables below. Do not deploy the API flow without configuring those credentials.

Set these server environment variables when the relevant provider is ready:

```text
# WhatsApp Cloud API (optional)
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
BELLE_OWNER_WHATSAPP=27730806573

# Resend email (optional)
RESEND_API_KEY=
BELLE_OWNER_EMAIL=your-email@example.com

# Twilio SMS (optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM=
BELLE_OWNER_SMS=27730806573
```

For email, verify a sending domain with Resend before using this in production. For SMS, `TWILIO_FROM` must be a Twilio SMS-capable number.

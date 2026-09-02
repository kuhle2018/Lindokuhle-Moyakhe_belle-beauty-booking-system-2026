# Belle Beauty

A calm, mobile-friendly booking site for Belle Beauty by Phiwokuhle Ngxingweni.

## Run locally

```bash
npm install
npm run dev
```

Open the address shown by Vite, usually `http://localhost:5173`.

## Included in this version

- Installation menu and Belle Beauty visual design
- Booking form with name, surname, phone, service, date and time
- Five-client daily limit and fully booked message
- Booking reference shown after a reservation
- Client self-service cancellation using that reference
- Owner WhatsApp contact: 082 282 8139

## Important for going live

The current booking storage is a browser-only prototype so the interface and booking rules can be tested immediately. A real public website needs a hosted database and a small server endpoint so every client sees the same availability.

That endpoint should send a WhatsApp Business API notification to Phiwokuhle whenever a booking or cancellation is created, including the client’s name, surname, phone, service, date and time. It should also notify her when the fifth booking for a day is made. This cannot safely be done directly from a public React website because WhatsApp credentials must stay private.

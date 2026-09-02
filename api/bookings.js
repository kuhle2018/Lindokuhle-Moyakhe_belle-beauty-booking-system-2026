import { createClient } from '@supabase/supabase-js'

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

function getDatabase() {
  if (required.some((key) => !process.env[key])) throw new Error('Booking service is not configured.')
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
}

function isValidDate(value) { return /^\d{4}-\d{2}-\d{2}$/.test(value || '') }

function clean(value, max) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }

async function notifyOwner(message) {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, BELLE_OWNER_WHATSAPP } = process.env
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !BELLE_OWNER_WHATSAPP) return
  const response = await fetch(`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: BELLE_OWNER_WHATSAPP, type: 'text', text: { preview_url: false, body: message } }),
  })
  if (!response.ok) console.error('WhatsApp notification failed:', await response.text())
}

export default async function handler(request, response) {
  try {
    const database = getDatabase()
    if (request.method === 'GET') {
      const date = request.query.date
      if (!isValidDate(date)) return response.status(400).json({ error: 'A valid date is required.' })
      const { data, error } = await database.rpc('belle_availability', { p_date: date })
      if (error) throw error
      return response.status(200).json(data[0])
    }
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' })

    const body = request.body || {}
    if (body.action === 'cancel') {
      const token = clean(body.cancellationToken, 80)
      if (!token) return response.status(400).json({ error: 'A cancellation reference is required.' })
      const { data, error } = await database.rpc('belle_cancel_booking', { p_token: token })
      if (error) throw error
      if (!data?.length) return response.status(404).json({ error: 'That booking is already cancelled or could not be found.' })
      const booking = data[0]
      await notifyOwner(`BELLE BEAUTY — CANCELLATION\n${booking.first_name} ${booking.surname} cancelled ${booking.service} on ${booking.appointment_date} at ${booking.appointment_time}. A slot is available again.`)
      return response.status(200).json({ booking })
    }

    const booking = { firstName: clean(body.firstName, 60), surname: clean(body.surname, 60), phone: clean(body.phone, 30), service: clean(body.service, 80), date: clean(body.date, 10), time: clean(body.time, 8), notes: clean(body.notes, 500) }
    if (!booking.firstName || !booking.surname || !booking.phone || !booking.service || !isValidDate(booking.date) || !/^\d{2}:\d{2}$/.test(booking.time)) return response.status(400).json({ error: 'Please complete all required booking details.' })
    const { data, error } = await database.rpc('belle_create_booking', { p_first_name: booking.firstName, p_surname: booking.surname, p_phone: booking.phone, p_service: booking.service, p_date: booking.date, p_time: booking.time, p_notes: booking.notes || null })
    if (error) {
      if (error.message.includes('BELLE_FULL')) return response.status(409).json({ error: 'This day is fully booked. Please select another date.' })
      throw error
    }
    const saved = data[0]
    const fullNotice = saved.remaining === 0 ? '\nThis is the fifth booking — the day is now fully booked.' : ''
    await notifyOwner(`BELLE BEAUTY — NEW BOOKING\n${booking.firstName} ${booking.surname}\n${booking.phone}\n${booking.service}\n${booking.date} at ${booking.time}${booking.notes ? `\nNotes: ${booking.notes}` : ''}${fullNotice}`)
    return response.status(201).json({ booking: saved })
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'The booking service is temporarily unavailable. Please try again.' })
  }
}

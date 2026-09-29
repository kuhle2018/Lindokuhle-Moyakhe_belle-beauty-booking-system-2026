import { useState } from 'react'
import './App.css'
import closureInstall from './assets/Closure installation.jpeg'
import curlyHair from './assets/Curly hair.jpeg'
import deepWaveHair from './assets/Deep wave hair.jpeg'
import frontalInstall from './assets/Frontal installation.jpeg'
import hairMaintenance from './assets/Hair maintenance.jpeg'
import kinkyCurlyHair from './assets/Kinky Curly hair.jpeg'
import sewInWig from './assets/Sew-in wig.jpeg'
import silkStraightHair from './assets/Silk straight hair.jpeg'
import straightBobHair from './assets/straiight bob hair.jpeg'
import wigCustomisation from './assets/Wig customisation.jpeg'
import wigWash from './assets/WIG WASH.jpeg'
import profilePicture from './assets/My profile pic.jpg'

const OWNER_NUMBER = '27730806573'
const OWNER_DISPLAY_NUMBER = '073 080 6573'
const services = [
  { name: 'Closure Install', price: 'From R850', duration: '2–3 hours', detail: 'Seamless closure application with custom blending.', image: closureInstall },
  { name: 'Frontal Install', price: 'From R1,200', duration: '3–4 hours', detail: 'Ear-to-ear frontal with lace tint and a polished finish.', image: frontalInstall },
  { name: 'Sew-In / Weave', price: 'From R700', duration: '2–3 hours', detail: 'Cornrow and sew-in, tailored to your leave-out.', image: sewInWig },
  { name: 'Wig Customisation', price: 'From R550', duration: '1.5–2 hours', detail: 'Plucking, tinting, styling and a clean lay-down.', image: wigCustomisation },
  { name: 'Take-Down & Wash', price: 'From R350', duration: '1 hour', detail: 'Gentle removal, deep cleanse and treatment.', image: wigWash },
  { name: 'Maintenance Visit', price: 'From R400', duration: '1 hour', detail: 'Re-tint and re-lay to keep your install fresh.', image: hairMaintenance },
]
const products = [
  { id: 'straight', name: 'Silk Straight', type: 'Straight', image: silkStraightHair, description: 'Soft, silky human-hair bundles with a natural movement.', sizes: [{ inches: '14”', price: 950 }, { inches: '18”', price: 1200 }, { inches: '22”', price: 1500 }, { inches: '26”', price: 1850 }] },
  { id: 'body-wave', name: 'Body Wave', type: 'Body wave', image: curlyHair, description: 'Full-bodied, loose waves made for everyday glamour.', sizes: [{ inches: '14”', price: 1050 }, { inches: '18”', price: 1350 }, { inches: '22”', price: 1650 }, { inches: '26”', price: 2050 }] },
  { id: 'deep-wave', name: 'Deep Wave', type: 'Deep wave', image: deepWaveHair, description: 'Defined texture with a soft, luxurious finish.', sizes: [{ inches: '14”', price: 1100 }, { inches: '18”', price: 1400 }, { inches: '22”', price: 1750 }, { inches: '26”', price: 2150 }] },
  { id: 'curly', name: 'Kinky Curly Unit', type: 'Curly', image: kinkyCurlyHair, description: 'A pre-plucked unit with beautiful volume and texture.', sizes: [{ inches: '16”', price: 1650 }, { inches: '18”', price: 1850 }, { inches: '22”', price: 2200 }] },
]
const times = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00']

function money(value) { return `R${value.toLocaleString('en-ZA')}` }

function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [confirmation] = useState(null)
  const [cancellation, setCancellation] = useState('')
  const [openProduct, setOpenProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0)
  const remaining = Number.NaN
  const availabilityMessage = selectedDate ? 'Belle Beauty will confirm your requested time on WhatsApp.' : 'Choose a date, then send your request on WhatsApp.'
  function addToCart(product, size) {
    const id = `${product.id}-${size.inches}`
    setCart((items) => { const found = items.find((item) => item.id === id); return found ? items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { id, name: product.name, inches: size.inches, price: size.price, quantity: 1 }] })
    setShowCart(true)
  }
  function updateQuantity(id, amount) { setCart((items) => items.flatMap((item) => item.id === id ? (item.quantity + amount > 0 ? [{ ...item, quantity: item.quantity + amount }] : []) : [item])) }
  function handleBooking(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget)
    const booking = { firstName: form.get('name').trim(), surname: form.get('surname').trim(), phone: form.get('phone').trim(), service: form.get('service'), date: form.get('date'), time: form.get('time'), notes: form.get('notes').trim() }
    const whatsappMessage = encodeURIComponent(`Hello Belle Beauty, I would like to request an appointment.\n\nName: ${booking.firstName} ${booking.surname}\nMy phone number: ${booking.phone}\nService: ${booking.service}\nPreferred date: ${formatDate(booking.date)}\nPreferred time: ${booking.time}${booking.notes ? `\nNotes: ${booking.notes}` : ''}`)
    const whatsappWindow = window.open(`https://wa.me/${OWNER_NUMBER}?text=${whatsappMessage}`, '_blank')
    if (whatsappWindow) whatsappWindow.opener = null
    if (!whatsappWindow) window.alert('WhatsApp could not be opened. Please contact Belle Beauty on 073 080 6573.')
    if (whatsappWindow) event.currentTarget.reset()
  }
  function cancelBooking(event) {
    event.preventDefault(); const bookingDetails = new FormData(event.currentTarget).get('reference').trim()
    const message = encodeURIComponent(`Hello Belle Beauty, I need to change or cancel my appointment.\n\nBooking details or reference: ${bookingDetails}`)
    const whatsappWindow = window.open(`https://wa.me/${OWNER_NUMBER}?text=${message}`, '_blank')
    if (whatsappWindow) whatsappWindow.opener = null
    setCancellation(whatsappWindow ? 'Your message is ready in WhatsApp. Send it to Belle Beauty to request the change.' : 'WhatsApp could not be opened. Please contact Belle Beauty on 073 080 6573.')
    if (whatsappWindow) event.currentTarget.reset()
  }
  const orderMessage = encodeURIComponent(`Hello Belle Beauty, I would like to order:\n${cart.map((item) => `- ${item.name} — ${item.inches} x ${item.quantity} (${money(item.price * item.quantity)})`).join('\n')}\n\nTotal: ${money(cartTotal)}`)
  const bookingMessage = confirmation && encodeURIComponent(`Hello Belle Beauty, I would like to request an appointment.

Name: ${confirmation.firstName} ${confirmation.surname}
Service: ${confirmation.service}
Date: ${formatDate(confirmation.date)}
Time: ${confirmation.time}
${confirmation.notes ? `
Notes: ${confirmation.notes}` : ''}`)

  return <>
    <header className="site-header"><a className="brand" href="#top" aria-label="Belle Beauty home">Belle Beauty <span>HAIR WEAVE STUDIO</span></a><nav aria-label="Main navigation"><a href="#top">Home</a><a href="#services">Installation</a><a href="#shop">Shop weaves</a><a href="#gallery">Gallery</a><a href="#about">About</a><a className="nav-book" href="#book">Book now</a><button className="cart-button" onClick={() => setShowCart(true)} aria-label="Open shopping cart">Bag <b>{cartQuantity}</b></button></nav></header>
    <main id="top">
      <section className="hero section-shell"><p className="eyebrow">By appointment · Cape Town</p><h1>Weaves installed with <em>precision.</em><br />Worn with confidence.</h1><p className="hero-copy">Book your salon appointment or shop your next set of premium bundles — all in one easy place.</p><div className="hero-actions"><a className="button" href="#book">Book an appointment</a><a className="text-link" href="#shop">Shop weaves <span>→</span></a></div><div className="hero-rule"><span />Limited to five appointments per day<span /></div></section>
      <section className="section-shell services" id="services"><div className="section-heading"><p className="eyebrow">Installation menu</p><h2>Made for your install day.</h2><p>Choose your service, then select a date and time that suits you.</p></div><div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.name}><img className="service-image" src={service.image} alt="" /><div className="service-content"><span className="number">0{index + 1}</span><h3>{service.name}</h3><p>{service.detail}</p><div><strong>{service.price}</strong><span>{service.duration}</span></div></div></article>)}</div><a className="section-cta" href="#book">Choose an installation service <span>→</span></a></section>
      <section className="shop section-shell" id="shop"><div className="section-heading"><p className="eyebrow">Shop the collection</p><h2>Find your perfect weave.</h2><p>Tap a collection to reveal every available length and its price.</p></div><div className="product-grid">{products.map((product) => <article className={`product-card ${openProduct === product.id ? 'expanded' : ''}`} key={product.id}><div className="product-art"><img src={product.image} alt={`${product.name} hair`} /><span>{product.type}</span></div><div className="product-info"><p className="eyebrow">Human hair</p><h3>{product.name}</h3><p>{product.description}</p><button className="product-toggle" onClick={() => setOpenProduct(openProduct === product.id ? null : product.id)}>{openProduct === product.id ? 'Hide lengths −' : 'Choose length +'}</button>{openProduct === product.id && <div className="size-list">{product.sizes.map((size) => <button key={size.inches} onClick={() => addToCart(product, size)}><span>{size.inches}</span><strong>{money(size.price)}</strong><i>Add to bag +</i></button>)}</div>}</div></article>)}</div><p className="shop-note">Not sure which length to buy? Add your preferred bundles to your bag and send your order directly to Belle Beauty.</p></section>
      <section className="gallery section-shell" id="gallery"><div className="section-heading"><p className="eyebrow">Recent work</p><h2>Installs from the chair.</h2><p>A small look at the Belle Beauty finish — clean, soft and made to last.</p></div><div className="gallery-grid"><GalleryTile label="Closure blend" image={closureInstall} /><GalleryTile label="Frontal install" image={frontalInstall} /><GalleryTile label="Silk straight" image={straightBobHair} /><GalleryTile label="Kinky curly" image={kinkyCurlyHair} /></div></section>
      <section className="story" id="about"><div className="story-profile"><img src={profilePicture} alt="Lindokuhle Moyakhe, founder of Belle Beauty" /></div><div className="story-copy"><p className="eyebrow">The stylist</p><h2>Hi, I’m Lindokuhle Moyakhe.</h2><p>I created Belle Beauty for clients who want a clean, natural weave install that lasts. Your appointment is one-on-one, so your chair time is about your hair — not waiting for replies.</p><p className="signature">— Lindokuhle Moyakhe</p></div></section>
      <section className="booking-section section-shell" id="book">
      <div className="section-heading">
      <p className="eyebrow">Reserve your slot</p>
      <h2>Book your appointment.</h2>
      <p>Send an appointment request. Your time is confirmed when Belle Beauty replies on WhatsApp.</p>
      </div>
      <div className="booking-layout">
      <aside className="booking-aside">
      <h3>Good to know</h3>
      <p>A few details before you book.</p>
      <dl>
      <div>
      <dt>Hours</dt>
      <dd>Tue–Sat, 9am–5pm</dd>
      </div>
      <div>
      <dt>Daily limit</dt>
      <dd>5 clients per day</dd>
      </div>
      <div>
      <dt>Deposit</dt>
      <dd>R150, non-refundable, required to confirm your appointment.</dd>
      </div>
      <div>
      <dt>Contact</dt>
      <dd>
      <a href={`https://wa.me/${OWNER_NUMBER}`} target="_blank" rel="noreferrer">{OWNER_DISPLAY_NUMBER}</a>
      </dd>
      </div>
      <div>
      <dt>Bank transfer</dt>
      <dd>FNB<br />Account holder: L Moyakhe<br />Account type: Cheque<br />Account number: 63213197551</dd>
      </div>
      <div>
      <dt>Address</dt>
      <dd>
      <a href="https://www.google.com/maps/search/?api=1&query=3099%20Pauli%20Street%2C%20Old%20Crossroads%2C%207750%2C%20South%20Africa" target="_blank" rel="noreferrer">3099 Pauli Street, Old Crossroads, 7750</a>
      </dd>
      </div>
      <div>
      <dt>Enquiries</dt>
      <dd><a href="mailto:lindokuhle.moyakhe@gmail.com">lindokuhle.moyakhe@gmail.com</a></dd>
      </div>
      </dl>
      </aside>
      <form className="booking-form" onSubmit={handleBooking}>
      <div className="form-row">
      <Field label="Name" name="name" placeholder="Your first name" required />
      <Field label="Surname" name="surname" placeholder="Your surname" required />
      </div>
      <Field label="Phone number" name="phone" type="tel" placeholder="e.g. 082 123 4567" required />
      <label className="field">
      <span>Installation service</span>
      <select name="service" required defaultValue="">
      <option value="" disabled>Select a service</option>{services.map((service) => <option key={service.name}>{service.name}</option>)}</select>
      </label>
      <div className="form-row">
      <label className="field">
      <span>Preferred date</span>
      <input name="date" type="date" min={today} required onChange={(event) => setSelectedDate(event.target.value)} />
      </label>
      <label className="field">
      <span>Preferred time</span>
      <select name="time" required defaultValue="">
      <option value="" disabled>Select a time</option>{times.map((time) => <option key={time}>{time}</option>)}</select>
      </label>
      </div>
      <p className={`availability ${remaining <= 0 && selectedDate ? 'full' : ''}`}>{availabilityMessage}</p>
      <label className="field">
      <span>Anything we should know? <i>Optional</i>
      </span>
      <textarea name="notes" placeholder="Hair length, preferred look or any questions" rows="3" />
      </label>
      <button className="button submit" type="submit" disabled={Boolean(selectedDate && remaining <= 0)}>Send request on WhatsApp</button>
      <p className="form-footnote">Sending this request does not confirm your appointment. Belle Beauty will reply on WhatsApp with availability and deposit payment steps.</p>
      </form>
      </div>{confirmation && <div className="confirmation" id="confirmation">
      <p className="eyebrow">Appointment reserved</p>
      <h3>Thank you, {confirmation.firstName}.</h3>
      <p>Your {confirmation.service} booking is set for <strong>{formatDate(confirmation.date)} at {confirmation.time}</strong>.</p>
      <div className="reference">
      <span>Your reference</span>
      <strong>{confirmation.id}</strong>
      </div>
      <p className="notification-note">Your booking is saved. Send the details to Belle Beauty on WhatsApp so Phiwokuhle can confirm your appointment.</p>
      <a className="button" href={`https://wa.me/${OWNER_NUMBER}?text=${bookingMessage}`} target="_blank" rel="noreferrer">Confirm on WhatsApp</a>
      </div>}</section>
      <section className="cancellation section-shell"><div><p className="eyebrow">Plans changed?</p><h2>Need to change your plans?</h2><p>Send your booking details to Belle Beauty on WhatsApp to request a cancellation.</p></div><form onSubmit={cancelBooking}><label><span>Appointment details</span><input name="reference" placeholder="Name and appointment date" required /></label><button className="button button-outline" type="submit">Request a change</button></form>{cancellation && <p className="cancel-message">{cancellation}</p>}</section>
    </main>
    <footer><div><a className="brand" href="#top">Belle Beauty <span>HAIR WEAVE STUDIO</span></a><p>Hair weave installation and premium weaves by appointment in Cape Town.</p></div><div><p>Tuesday – Saturday · 9:00 – 17:00</p><a href={`https://wa.me/${OWNER_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp {OWNER_DISPLAY_NUMBER}</a></div><small>© {new Date().getFullYear()} Belle Beauty</small></footer>
    {showCart && <aside className="cart-drawer" aria-label="Shopping bag"><div className="cart-head"><div><p className="eyebrow">Your selection</p><h2>Shopping bag</h2></div><button onClick={() => setShowCart(false)} aria-label="Close cart">×</button></div>{cart.length === 0 ? <div className="empty-cart"><p>Your bag is empty.</p><button className="text-link" onClick={() => { setShowCart(false); document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' }) }}>Shop weaves →</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div><h3>{item.name}</h3><p>{item.inches} · {money(item.price)}</p></div><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)}>+</button></div></div>)}</div><div className="cart-total"><span>Total</span><strong>{money(cartTotal)}</strong></div><a className="button checkout" href={`https://wa.me/${OWNER_NUMBER}?text=${orderMessage}`} target="_blank" rel="noreferrer">Send order on WhatsApp</a><p className="cart-note">This sends your selected weave order to Belle Beauty for confirmation and payment details.</p></>}</aside>}
  </>
}

function Field({ label, name, type = 'text', placeholder, required }) { return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} /></label> }
function GalleryTile({ label, image }) { return <figure className="gallery-tile"><img src={image} alt={label} /><figcaption>{label}</figcaption></figure> }
function formatDate(date) { return new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`)) }
export default App

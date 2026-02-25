import PageInteractions from './PageInteractions';

export default function Home() {
  return (
    <>
      {/* ── STICKY SIDEBAR NAV ─────────────────────────────── */}
      <nav id="sidebar-nav" aria-label="Page sections">
        <div className="nav-brand">
          <span className="nav-brand-text">DG</span>
        </div>
        <ul className="nav-links">
          {[
            { id: 'home', label: 'Home' },
            { id: 'facilities', label: 'Facilities' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'suitability', label: 'Suitability' },
            { id: 'location', label: 'Location' },
            { id: 'contact', label: 'Contact' },
          ].map(({ id, label }, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`nav-link${i === 0 ? ' active' : ''}`}
                data-section={id}
              >
                <span className="nav-dot" />
                <span className="nav-label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-footer">
          <div className="nav-line" />
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main id="main-content">

        {/* ═══════ HERO ════════════════════════════════════ */}
        <section id="home" className="section section--hero">
          <div className="hero-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1600&q=80&auto=format&fit=crop"
              alt="Forest glamping tent at dawn"
              className="hero-img"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <p className="hero-eyebrow">Escape. Breathe. Stay.</p>
            <h1 className="hero-title">De Glamping</h1>
            <p className="hero-subtitle">
              Where ancient forest meets conscious luxury —<br />
              a still place for restless souls.
            </p>
            <a href="#facilities" className="btn btn--primary">
              Discover the Retreat
            </a>
          </div>
          <div className="section-mask section-mask--bottom" />
        </section>

        {/* ═══════ FACILITIES ══════════════════════════════ */}
        <section id="facilities" className="section section--facilities">
          <div className="section-mask section-mask--top" />
          <div className="container">
            <div className="section-header">
              <span className="section-tag">What Awaits</span>
              <h2 className="section-title">Facilities</h2>
              <p className="section-desc">
                Every detail is crafted for the wanderer who refuses to compromise on comfort.
              </p>
            </div>
            <div className="facilities-grid">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  ),
                  title: 'Canvas Lodges',
                  desc: 'Hand-stitched canvas tents with bamboo frames, king beds, and stargazing skylights.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                    </svg>
                  ),
                  title: 'Forest Spa',
                  desc: 'Herbal stone massages and wild-clay wraps performed among the trees at sunrise.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                  ),
                  title: 'Foraged Dining',
                  desc: 'A rotating menu of hyper-local cuisine — served around a communal fire table each evening.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: 'Private Bathing',
                  desc: 'Rain showers filtered through charcoal and open-air copper soaking tubs under canopy.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  ),
                  title: 'Solar Power',
                  desc: 'Fully off-grid. Solar-powered lighting, composting systems, zero single-use plastics.',
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  ),
                  title: 'Guided Trails',
                  desc: 'Curated forest-bathing routes, birdwatching at dawn, and night-sky telescope sessions.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="facility-card">
                  <div className="facility-icon">{icon}</div>
                  <h3 className="facility-title">{title}</h3>
                  <p className="facility-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="section-mask section-mask--bottom" />
        </section>

        {/* ═══════ GALLERY ═════════════════════════════════ */}
        <section id="gallery" className="section section--gallery">
          <div className="section-mask section-mask--top" />
          <div className="gallery-header container">
            <span className="section-tag">Through the Lens</span>
            <h2 className="section-title">Gallery</h2>
          </div>
          <div className="gallery-scroll-wrapper" id="gallery-track-wrapper">
            <div className="gallery-track" id="gallery-track">
              {[
                { src: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&q=80&auto=format&fit=crop', alt: 'Luxury tent in the forest', caption: 'Canvas Lodge No. 3', cls: '' },
                { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&auto=format&fit=crop', alt: 'Forest lake at sunrise', caption: 'Morning Lake', cls: 'gallery-item--tall' },
                { src: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=800&q=80&auto=format&fit=crop', alt: 'Campfire at glamping site', caption: 'Communal Fire', cls: '' },
                { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop', alt: 'Forest canopy aerial view', caption: 'The Canopy', cls: 'gallery-item--wide' },
                { src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80&auto=format&fit=crop', alt: 'Interior of glamping tent', caption: 'Lodge Interior', cls: '' },
                { src: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80&auto=format&fit=crop', alt: 'Outdoor forest bathing', caption: 'Copper Soaking Tub', cls: 'gallery-item--tall' },
                { src: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80&auto=format&fit=crop', alt: 'Forest trail through trees', caption: 'The Mossy Trail', cls: '' },
                { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop', alt: 'Mountain sunrise glamping', caption: 'Sunrise at De Glamping', cls: '' },
              ].map(({ src, alt, caption, cls }) => (
                <div key={caption} className={`gallery-item${cls ? ' ' + cls : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} loading="lazy" />
                  <div className="gallery-caption">{caption}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="gallery-hint">
            <span className="gallery-hint-line" />
            <span className="gallery-hint-text">Drag to explore</span>
            <span className="gallery-hint-line" />
          </div>
          <div className="section-mask section-mask--bottom" />
        </section>

        {/* ═══════ SUITABILITY ═════════════════════════════ */}
        <section id="suitability" className="section section--suitability">
          <div className="section-mask section-mask--top" />
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Made For</span>
              <h2 className="section-title">Suitable For</h2>
              <p className="section-desc">
                De Glamping speaks to those who feel most alive when surrounded by trees.
              </p>
            </div>
            <div className="suitability-grid" id="suitability-grid">
              {[
                { icon: '🌿', title: 'Solo Seekers', desc: 'Unplug, recharge, and rediscover yourself in the silence of old-growth forest.' },
                { icon: '🤝', title: 'Couples', desc: 'Private lodges, candlelit dinners under the stars, and mornings without alarm clocks.' },
                { icon: '👨‍👩‍👧', title: 'Families', desc: 'Nature walks, firefly nights, and unplugged family time in a safe forest setting.' },
                {
                  icon: '💼', title: 'Corporate Retreats', desc: "Off-site workshops and team experiences rooted in nature's clarity of mind."
                },
                { icon: '🎨', title: 'Creatives', desc: 'Writers, artists, and photographers — the forest has always been your muse.' },
                { icon: '🧘', title: 'Wellness Seekers', desc: 'Forest bathing, meditation, herbal spa journeys — a sanctuary without walls.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="suit-card ethereal-card">
                  <div className="suit-card-inner">
                    <span className="suit-icon">{icon}</span>
                    <h3 className="suit-title">{title}</h3>
                    <p className="suit-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-mask section-mask--bottom" />
        </section>

        {/* ═══════ LOCATION ════════════════════════════════ */}
        <section id="location" className="section section--location">
          <div className="section-mask section-mask--top" />
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Find Us</span>
              <h2 className="section-title">Location</h2>
              <p className="section-desc">3 hours from the city. A world away from everything.</p>
            </div>
            <div className="location-layout">
              <div className="location-info">
                {[
                  { label: 'Address', value: 'Jalan Hutan Dalam, Km 42,\nCameron Highlands, Malaysia' },
                  { label: 'Nearest Town', value: 'Tanah Rata — 18 min drive' },
                  { label: 'From KL', value: '~3.5 hours by car via Simpang Pulai' },
                  { label: 'Elevation', value: '1,540 m above sea level' },
                ].map(({ label, value }) => (
                  <div key={label} className="location-detail">
                    <span className="detail-label">{label}</span>
                    <span className="detail-value" style={{ whiteSpace: 'pre-line' }}>{value}</span>
                  </div>
                ))}
                <a
                  href="https://maps.google.com/?q=Cameron+Highlands+Malaysia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--outline"
                >
                  Open in Maps
                </a>
              </div>
              <div className="location-map-wrapper" id="tilt-container">
                <div className="location-map-card" id="tilt-card">
                  <div className="tilt-shine" id="tilt-shine" />
                  <iframe
                    id="location-map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127391.00000000001!2d101.37!3d4.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4fb27f2c9b5b%3A0x5c6a52c52f9c1a1!2sCameron%20Highlands%2C%20Pahang%2C%20Malaysia!5e0!3m2!1sen!2smy!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="De Glamping Location Map"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="section-mask section-mask--bottom" />
        </section>

        {/* ═══════ CONTACT ═════════════════════════════════ */}
        <section id="contact" className="section section--contact">
          <div className="section-mask section-mask--top" />
          <div className="container">
            <div className="contact-layout">
              <div className="contact-left">
                <span className="section-tag">Get In Touch</span>
                <h2 className="section-title">Contact</h2>
                <p className="section-desc">
                  Ready to disappear into the forest for a few days? We&apos;d love to have you.
                </p>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-icon">✉</span>
                    <a href="mailto:hello@deglamping.my" className="contact-link">hello@deglamping.my</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">☎</span>
                    <a href="tel:+60123456789" className="contact-link">+60 12-345 6789</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">@</span>
                    <a href="https://instagram.com/deglamping" target="_blank" rel="noopener noreferrer" className="contact-link">@deglamping</a>
                  </div>
                </div>
              </div>
              <div className="contact-right">
                <form className="contact-form" id="contact-form" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input type="text" id="name" name="name" className="form-input" placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" id="email" name="email" className="form-input" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dates" className="form-label">Preferred Dates</label>
                    <input type="text" id="dates" name="dates" className="form-input" placeholder="e.g. March 14–17, 2026" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" name="message" className="form-textarea" rows={4} placeholder="Tell us what you're looking for…" required />
                  </div>
                  <button type="submit" className="btn btn--primary btn--full" id="form-submit">
                    Send Message
                  </button>
                  <div className="form-success" id="form-success" aria-live="polite" />
                </form>
              </div>
            </div>
          </div>

          <footer className="site-footer">
            <p className="footer-text">© 2026 De Glamping. Rooted in nature. Guided by stillness.</p>
            <p className="footer-sub">Cameron Highlands, Malaysia</p>
          </footer>
        </section>

      </main>

      {/* Client-side interactions (scroll-spy, gallery drag, tilt, etc.) */}
      <PageInteractions />
    </>
  );
}

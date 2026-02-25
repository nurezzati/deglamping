/* ================================================================
   DE GLAMPING — SCRIPT.JS
   • Sidebar scroll-spy
   • Gallery: fluid-width horizontal drag with friction (momentum)
   • Location: 3D tilt on hover
   • Suitability cards: Ethereal motion (staggered float-in on scroll)
   • Contact form: basic submit handler
   • Generic reveal on scroll
================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   UTILITIES
──────────────────────────────────────────────────────────────── */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp  = (a, b, t)     => a + (b - a) * t;

/* ──────────────────────────────────────────────────────────────
   1. SIDEBAR SCROLL SPY
──────────────────────────────────────────────────────────────── */
(function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = [...navLinks].map(link => {
    const id = link.dataset.section;
    return { link, section: document.getElementById(id) };
  }).filter(({ section }) => !!section);

  const setActive = (link) => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  };

  const onScroll = () => {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    for (const entry of sections) {
      if (entry.section.offsetTop <= scrollY) {
        current = entry;
      }
    }
    setActive(current.link);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth nav link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.dataset.section;
      const target   = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────────
   2. GALLERY — FLUID DRAG + FRICTION (MOMENTUM)
──────────────────────────────────────────────────────────────── */
(function initGalleryDrag() {
  const wrapper = document.getElementById('gallery-track-wrapper');
  const track   = document.getElementById('gallery-track');
  if (!wrapper || !track) return;

  let isDragging   = false;
  let startX       = 0;
  let currentX     = 0;   // current rendered translateX (px)
  let targetX      = 0;   // desired translateX (px)
  let dragStartX   = 0;
  let velocity     = 0;
  let lastX        = 0;
  let lastTime     = 0;
  let rafId        = null;

  // Max scroll range
  const getMaxScroll = () => {
    const trackW   = track.scrollWidth;
    const wrapperW = wrapper.clientWidth;
    return Math.max(0, trackW - wrapperW);
  };

  const applyTransform = (x) => {
    track.style.transform = `translateX(${x}px)`;
  };

  // Friction animation loop
  const FRICTION   = 0.88;   // momentum decay (lower = more friction)
  const LERP_SPEED = 0.12;   // how fast currentX follows targetX when not dragging

  const tick = () => {
    if (!isDragging) {
      // Apply velocity (momentum)
      velocity *= FRICTION;
      if (Math.abs(velocity) > 0.3) {
        targetX += velocity;
      } else {
        velocity = 0;
      }

      // Clamp targetX
      targetX = clamp(targetX, -getMaxScroll(), 0);

      // Lerp currentX toward targetX for smooth ease-out
      currentX = lerp(currentX, targetX, 0.1);

      applyTransform(currentX);

      if (Math.abs(currentX - targetX) > 0.05 || Math.abs(velocity) > 0.1) {
        rafId = requestAnimationFrame(tick);
      } else {
        currentX = targetX;
        applyTransform(currentX);
        rafId = null;
      }
    } else {
      rafId = requestAnimationFrame(tick);
    }
  };

  const startTick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  // Pointer events (mouse + touch)
  const onPointerDown = (e) => {
    isDragging  = true;
    startX      = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartX  = currentX;
    lastX       = startX;
    lastTime    = Date.now();
    velocity    = 0;
    wrapper.style.cursor = 'grabbing';
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const dx      = clientX - startX;

    const now     = Date.now();
    const dt      = now - lastTime;
    if (dt > 0) {
      velocity  = (clientX - lastX) / dt * 14; // scale velocity
    }
    lastX    = clientX;
    lastTime = now;

    currentX = clamp(dragStartX + dx, -getMaxScroll(), 0);
    targetX  = currentX;
    applyTransform(currentX);
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
    targetX = clamp(currentX + velocity * 12, -getMaxScroll(), 0);
    startTick();
  };

  // Mouse wheel horizontal scroll support
  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    velocity   = 0;
    targetX    = clamp(targetX - e.deltaY * 1.2 - e.deltaX * 1.2, -getMaxScroll(), 0);
    startTick();
  }, { passive: false });

  wrapper.addEventListener('mousedown',   onPointerDown);
  wrapper.addEventListener('touchstart',  onPointerDown, { passive: true });
  window.addEventListener('mousemove',    onPointerMove);
  window.addEventListener('touchmove',    onPointerMove, { passive: true });
  window.addEventListener('mouseup',      onPointerUp);
  window.addEventListener('touchend',     onPointerUp);

  // Prevent image dragging
  track.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });
})();

/* ──────────────────────────────────────────────────────────────
   3. LOCATION — 3D TILT ON HOVER
──────────────────────────────────────────────────────────────── */
(function initTilt() {
  const container = document.getElementById('tilt-container');
  const card      = document.getElementById('tilt-card');
  const shine     = document.getElementById('tilt-shine');
  if (!container || !card) return;

  const MAX_TILT  = 12; // degrees
  let   rafId     = null;
  let   targetRX  = 0, targetRY = 0;
  let   currentRX = 0, currentRY = 0;

  const setTransform = () => {
    currentRX = lerp(currentRX, targetRX, 0.1);
    currentRY = lerp(currentRY, targetRY, 0.1);

    card.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale(1.02)`;

    if (shine) {
      const shineX = 50 + currentRY * 3;
      const shineY = 50 - currentRX * 3;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.18) 0%, transparent 65%)`;
    }

    if (Math.abs(currentRX - targetRX) > 0.01 || Math.abs(currentRY - targetRY) > 0.01) {
      rafId = requestAnimationFrame(setTransform);
    } else {
      rafId = null;
    }
  };

  const startTick = () => {
    if (!rafId) rafId = requestAnimationFrame(setTransform);
  };

  container.addEventListener('mousemove', (e) => {
    const rect   = container.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    targetRY =  clamp(dx * MAX_TILT, -MAX_TILT, MAX_TILT);
    targetRX = -clamp(dy * MAX_TILT, -MAX_TILT, MAX_TILT);
    startTick();
  });

  container.addEventListener('mouseleave', () => {
    targetRX = 0;
    targetRY = 0;
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform  = 'rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => { card.style.transition = ''; }, 650);
    cancelAnimationFrame(rafId);
    rafId = null;
  });
})();

/* ──────────────────────────────────────────────────────────────
   4. ETHEREAL MOTION — SUITABILITY CARDS
   Staggered reveal: cards float in with opacity + translateY
   + a subtle rotation drift for the 'ethereal' feel
──────────────────────────────────────────────────────────────── */
(function initEtherealCards() {
  const grid  = document.getElementById('suitability-grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.suit-card');

  // Apply staggered CSS transition delays
  cards.forEach((card, i) => {
    card.style.transitionDelay        = `${i * 100}ms`;
    card.style.transitionDuration     = '0.8s';
    card.style.transitionTimingFunction = 'cubic-bezier(0.16, 1, 0.3, 1)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));

  // Subtle continuous drift for 'ethereal' feel — very gentle parallax on mouse
  const section = document.getElementById('suitability');
  if (!section) return;

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const dx   = (e.clientX - rect.width  / 2) / rect.width;
    const dy   = (e.clientY - rect.height / 2) / rect.height;

    cards.forEach((card, i) => {
      const depth = 0.5 + (i % 3) * 0.3;
      const tx    = dx * depth * 6;
      const ty    = dy * depth * 4;
      if (card.classList.contains('in-view')) {
        card.style.transform = `translateY(-${card.matches(':hover') ? 8 : 0}px) translate(${tx}px, ${ty}px)`;
      }
    });
  });

  section.addEventListener('mouseleave', () => {
    cards.forEach(card => {
      if (!card.matches(':hover')) {
        card.style.transform = '';
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────────
   5. GENERIC SCROLL REVEAL
──────────────────────────────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.facility-card, .section-header, .section-tag, .location-detail, .contact-left > *, .contact-right'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────────────────────
   6. CONTACT FORM — SUBMIT HANDLER
──────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.textContent    = 'Message Sent ✓';
      success.textContent = 'We'll be in touch within 24 hours. Thank you for reaching out.';
      form.reset();
      setTimeout(() => {
        btn.disabled    = false;
        btn.textContent = 'Send Message';
        success.textContent = '';
      }, 5000);
    }, 1400);
  });
})();

/* ──────────────────────────────────────────────────────────────
   7. PARALLAX HERO IMAGE (subtle)
──────────────────────────────────────────────────────────────── */
(function initHeroParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    heroImg.style.transform = `scale(1.06) translateY(${scrollY * 0.25}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

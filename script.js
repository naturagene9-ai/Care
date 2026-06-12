/* =====================================================
   NaturaGene Care — script.js v2.0
   Custom Cursor · Nav · Particles · Reveal · Countdown
   FAQ · Form Validation · Razorpay · GA Events
   ===================================================== */
'use strict';

/* ── UTILS ───────────────────────────────────────────── */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const GA = (event, params = {}) => {
  if (typeof gtag !== 'undefined') gtag('event', event, params);
};

/* ── CUSTOM CURSOR ───────────────────────────────────── */
(function initCursor() {
  const cursor = $('cursor');
  const trail  = $('cursorTrail');
  if (!cursor || !trail) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = -100, my = -100, tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * .15;
    ty += (my - ty) * .15;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale on hover
  document.querySelectorAll('a, button, .ing-card, .benefit-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
      cursor.style.background = 'var(--gold)';
      trail.style.width = '48px';
      trail.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.background = 'var(--sage)';
      trail.style.width = '32px';
      trail.style.height = '32px';
    });
  });
})();

/* ── STICKY HEADER ───────────────────────────────────── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE NAV ──────────────────────────────────────── */
const burger  = $('navBurger');
const navList = $('navList');

burger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

$$('.nav__link, .nav__cta').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target) && navList.classList.contains('open')) {
    navList.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── HERO PARTICLES ──────────────────────────────────── */
(function initParticles() {
  const container = $('heroParticles');
  if (!container) return;
  const COUNT = window.innerWidth < 640 ? 12 : 24;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 6 + 3;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;
    const x = Math.random() * 100;
    const opacity = Math.random() * 0.4 + 0.1;

    Object.assign(p.style, {
      position: 'absolute',
      left: x + '%',
      bottom: '-20px',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: i % 3 === 0 ? 'var(--sage)' : i % 3 === 1 ? 'var(--gold)' : 'rgba(184,227,255,.8)',
      opacity,
      animation: `particleFloat ${duration}s ${delay}s ease-in-out infinite`,
      pointerEvents: 'none',
    });
    container.appendChild(p);
  }

  // Inject keyframes once
  if (!document.getElementById('particleKF')) {
    const style = document.createElement('style');
    style.id = 'particleKF';
    style.textContent = `
      @keyframes particleFloat {
        0%   { transform: translateY(0)    rotate(0deg);   opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: .6; }
        100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── SCROLL REVEAL ───────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

$$('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ── ACTIVE NAV LINK ON SCROLL ───────────────────────── */
const sections = $$('section[id]');
const navLinks = $$('.nav__link:not(.nav__cta)');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--sage-d)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObs.observe(s));

/* ── COUNTDOWN TIMER ─────────────────────────────────── */
// ⚙️ Change this date to your actual launch date
const LAUNCH_DATE = new Date('2025-10-01T00:00:00+05:30');
let prevSecs = -1;

function updateCountdown() {
  const now  = new Date();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    const el = $('countdownTimer');
    if (el) el.innerHTML = '<div style="font-size:2rem;color:var(--gold);font-family:var(--font-serif)">🎉 We are LIVE!</div>';
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  function update(id, val) {
    const el = $(id);
    if (!el) return;
    const str = String(val).padStart(2, '0');
    if (el.textContent !== str) {
      el.classList.remove('flip');
      void el.offsetWidth; // reflow
      el.classList.add('flip');
      el.textContent = str;
    }
  }
  update('cd-days', d);
  update('cd-hours', h);
  update('cd-mins', m);
  update('cd-secs', s);
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── WAITLIST FORM ───────────────────────────────────── */
const waitlistForm = $('waitlistForm');
if (waitlistForm) {
  function setErr(inputId, errId, msg) {
    const input = $(inputId);
    const err   = $(errId);
    if (input) input.classList.add('error');
    if (err)   err.textContent = msg;
  }
  function clearErr(inputId, errId) {
    const input = $(inputId);
    const err   = $(errId);
    if (input) input.classList.remove('error');
    if (err)   err.textContent = '';
  }

  // Live clear on input
  ['wl-name', 'wl-email', 'wl-phone'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => {
      el.classList.remove('error');
      const errId = 'err-' + id.replace('wl-', '');
      const errEl = $(errId);
      if (errEl) errEl.textContent = '';
    });
  });

  waitlistForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name  = $('wl-name')?.value.trim()  || '';
    const email = $('wl-email')?.value.trim() || '';
    const phone = $('wl-phone')?.value.trim() || '';

    clearErr('wl-name',  'err-name');
    clearErr('wl-email', 'err-email');
    clearErr('wl-phone', 'err-phone');

    if (name.length < 2) {
      setErr('wl-name', 'err-name', 'Please enter your full name (min 2 characters).');
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('wl-email', 'err-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (phone && !/^[+]?[\d\s\-]{8,15}$/.test(phone)) {
      setErr('wl-phone', 'err-phone', 'Please enter a valid phone number.');
      valid = false;
    }
    if (!valid) return;

    // Save locally
    const list = JSON.parse(localStorage.getItem('ng_waitlist') || '[]');
    list.push({ name, email, phone, ts: new Date().toISOString() });
    localStorage.setItem('ng_waitlist', JSON.stringify(list));

    // Analytics
    GA('waitlist_signup', { event_category: 'engagement', event_label: email });

    // Success UI
    waitlistForm.reset();
    const successEl = $('formSuccess');
    if (successEl) {
      successEl.style.display = 'block';
      setTimeout(() => { successEl.style.display = 'none'; }, 7000);
    }

    // Animate button
    const btn = $('notifyBtn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>✅ Added to waitlist!</span>';
      btn.style.background = 'var(--sage-d)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 4000);
    }
  });
}

/* ── RAZORPAY ────────────────────────────────────────── */
// ⚙️ Replace with your Razorpay Key ID from dashboard.razorpay.com
const RAZORPAY_KEY = 'rzp_test_REPLACE_WITH_YOUR_KEY';

function openRazorpay() {
  // Prefill from form if filled
  const prefillName  = $('wl-name')?.value.trim()  || '';
  const prefillEmail = $('wl-email')?.value.trim() || '';
  const prefillPhone = $('wl-phone')?.value.trim() || '';

  GA('preorder_initiated', { event_category: 'ecommerce', value: 299 });

  if (RAZORPAY_KEY === 'rzp_test_REPLACE_WITH_YOUR_KEY') {
    showRazorpayNotice();
    return;
  }

  const options = {
    key:         RAZORPAY_KEY,
    amount:      29900,    // ₹299 in paise
    currency:    'INR',
    name:        'NaturaGene Care',
    description: 'Sunflower Soap with Vitamin C — Early Bird Pre-Order',
    prefill:     { name: prefillName, email: prefillEmail, contact: prefillPhone },
    notes:       { product: 'sunflower-soap-vc', source: 'landing_page' },
    theme:       { color: '#7AA874' },
    handler: function(response) {
      onPaymentSuccess(response);
    },
    modal: {
      ondismiss: function() {
        GA('razorpay_dismissed', { event_category: 'ecommerce' });
      }
    }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(res) {
      alert('Payment failed: ' + res.error.description + '\nPlease try again.');
      GA('payment_failed', { event_category: 'ecommerce', event_label: res.error.code });
    });
    rzp.open();
  } catch(err) {
    console.error('Razorpay error:', err);
    showRazorpayNotice();
  }
}

function onPaymentSuccess(response) {
  // Store order
  const orders = JSON.parse(localStorage.getItem('ng_orders') || '[]');
  orders.push({
    payment_id: response.razorpay_payment_id,
    order_id:   response.razorpay_order_id || '',
    ts: new Date().toISOString()
  });
  localStorage.setItem('ng_orders', JSON.stringify(orders));

  // GA purchase event
  GA('purchase', {
    transaction_id: response.razorpay_payment_id,
    value: 299,
    currency: 'INR',
    items: [{ item_id: 'sunflower-soap-vc', item_name: 'Sunflower Soap with Vitamin C', price: 299, quantity: 1 }]
  });

  // Update button
  const btn = document.querySelector('.preorder-card .btn--gold');
  if (btn) {
    btn.textContent = '✅ Pre-Order Confirmed! Check your email.';
    btn.disabled = true;
    btn.style.background = 'var(--sage-d)';
  }

  // Success alert
  alert('🎉 Pre-order confirmed!\nPayment ID: ' + response.razorpay_payment_id + '\nThank you for choosing NaturaGene Care!');
}

function showRazorpayNotice() {
  alert(
    '🔧 Razorpay Setup Required\n\n' +
    'Steps to activate payment:\n' +
    '1. Log in → dashboard.razorpay.com\n' +
    '2. Settings → API Keys → Copy Key ID\n' +
    '3. Open script.js line 3 → replace RAZORPAY_KEY value\n\n' +
    'Test key: rzp_test_XXXXX\n' +
    'Live key: rzp_live_XXXXX'
  );
}

/* ── FAQ ACCORDION ───────────────────────────────────── */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');

    // Close all
    $$('.faq-q.open').forEach(openBtn => {
      openBtn.classList.remove('open');
      openBtn.nextElementSibling?.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      btn.classList.add('open');
      answer?.classList.add('open');
      GA('faq_opened', { event_category: 'engagement', event_label: btn.textContent.trim().slice(0, 60) });
    }
  });
});

/* ── SMOOTH SECTION ANALYTICS ────────────────────────── */
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      GA('section_view', { event_category: 'scroll_depth', event_label: entry.target.id });
    }
  });
}, { threshold: 0.35 });

['hero','why','story','benefits','countdown','waitlist','blog','trust'].forEach(id => {
  const el = $(id);
  if (el) sectionObs.observe(el);
});

/* ── PRODUCT IMAGE PARALLAX (desktop) ────────────────── */
if (window.matchMedia('(min-width: 900px)').matches) {
  const productCard = document.querySelector('.product-frame__card');
  if (productCard) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      productCard.style.transform = `translateY(${scrolled * 0.04}px)`;
    }, { passive: true });
  }
}

/* ── MARQUEE PAUSE ON HOVER ──────────────────────────── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const strip = document.querySelector('.marquee-strip');
  if (strip) {
    strip.addEventListener('mouseenter', () => { marqueeTrack.style.animationPlayState = 'paused'; });
    strip.addEventListener('mouseleave', () => { marqueeTrack.style.animationPlayState = 'running'; });
  }
}

/* ── CONSOLE SETUP GUIDE ─────────────────────────────── */
console.log(
  '%cNaturaGene Care 🌻 v2.0\n%c\n' +
  '✅ Setup Checklist:\n' +
  '1. Google Analytics  → Replace GA_MEASUREMENT_ID in index.html\n' +
  '2. Search Console    → Replace YOUR_SEARCH_CONSOLE_CODE in index.html\n' +
  '3. Razorpay Key      → Replace RAZORPAY_KEY in script.js (line 3)\n' +
  '4. Launch Date       → Update LAUNCH_DATE in script.js (line ~68)\n\n' +
  '📚 Docs:\n' +
  'Razorpay  → https://razorpay.com/docs/\n' +
  'Analytics → https://analytics.google.com\n' +
  'Console   → https://search.google.com/search-console\n',
  'color:#7AA874;font-size:15px;font-weight:bold',
  'color:#666;font-size:11px'
);

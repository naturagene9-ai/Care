/* =====================================================
   NaturaGene Care v3 — script.js
   Cursor · Nav · Particles · Reveal · Countdown
   FAQ · Form + Google Sheets · Razorpay · GA Events
   ===================================================== */
'use strict';

/* ── CONFIG ─────────────────────────────────────────────
   ⚙️  Replace these 3 values before going live
   ─────────────────────────────────────────────────────── */
const CONFIG = {
  // 1. Razorpay Key ID (dashboard.razorpay.com → Settings → API Keys)
  RAZORPAY_KEY: 'rzp_test_REPLACE_WITH_YOUR_KEY',

  // 2. Google Apps Script Web App URL
  //    (paste the URL after deploying your Apps Script — see appscript.js)
  SHEETS_URL: 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_APPS_SCRIPT_URL/exec',

  // 3. Launch countdown date (IST)
  LAUNCH_DATE: new Date('2025-10-01T00:00:00+05:30'),
};

/* ── UTILS ──────────────────────────────────────────── */
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const GA = (ev, params = {}) => {
  if (typeof gtag !== 'undefined') gtag('event', ev, params);
};

/* ── CUSTOM CURSOR ──────────────────────────────────── */
(function () {
  const cursor = $('cursor');
  const dot    = $('cursorDot');
  if (!cursor || !dot) return;
  if (window.matchMedia('(pointer:coarse)').matches) return;

  let mx = -200, my = -200, tx = -200, ty = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    tx += (mx - tx) * .14;
    ty += (my - ty) * .14;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a,button,.ing-card,.bene-card,.gal-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '48px';
      cursor.style.height = '48px';
      cursor.style.borderColor = 'var(--gold)';
      dot.style.background = 'var(--gold)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '32px';
      cursor.style.height = '32px';
      cursor.style.borderColor = 'var(--sage)';
      dot.style.background = 'var(--sage)';
    });
  });
})();

/* ── STICKY HEADER ──────────────────────────────────── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────────────── */
const burger  = $('burger');
const navList = $('navList');

burger.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', e => {
  if (!header.contains(e.target) && navList.classList.contains('open')) {
    navList.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── HERO PARTICLES ─────────────────────────────────── */
(function () {
  const container = $('heroParticles');
  if (!container) return;
  const N = window.innerWidth < 640 ? 10 : 22;
  const colors = ['var(--sage)', 'var(--gold)', 'rgba(184,227,255,.9)'];

  // Inject keyframe once
  if (!document.getElementById('ptKF')) {
    const s = document.createElement('style');
    s.id = 'ptKF';
    s.textContent = `@keyframes ptFloat{0%{transform:translateY(0) rotate(0deg);opacity:0}8%{opacity:.8}90%{opacity:.4}100%{transform:translateY(-105vh) rotate(380deg);opacity:0}}`;
    document.head.appendChild(s);
  }

  for (let i = 0; i < N; i++) {
    const p = document.createElement('div');
    const sz  = Math.random() * 6 + 3;
    Object.assign(p.style, {
      position:        'absolute',
      left:            Math.random() * 100 + '%',
      bottom:          '-20px',
      width:           sz + 'px',
      height:          sz + 'px',
      borderRadius:    '50%',
      background:      colors[i % 3],
      animation:       `ptFloat ${Math.random()*10+8}s ${Math.random()*8}s ease-in-out infinite`,
      pointerEvents:   'none',
    });
    container.appendChild(p);
  }
})();

/* ── SCROLL REVEAL ──────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

$$('.rv, .rv-l, .rv-r').forEach(el => revObs.observe(el));

/* ── ACTIVE NAV HIGHLIGHT ───────────────────────────── */
const navLinks = $$('.nav-link:not(.nav-cta)');
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--sage-d)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

/* ── MARQUEE PAUSE ON HOVER ─────────────────────────── */
const mtrack = document.querySelector('.mtrack');
const mstrip = document.querySelector('.marquee');
if (mtrack && mstrip) {
  mstrip.addEventListener('mouseenter', () => mtrack.style.animationPlayState = 'paused');
  mstrip.addEventListener('mouseleave', () => mtrack.style.animationPlayState = 'running');
}

/* ── COUNTDOWN ──────────────────────────────────────── */
function updateCountdown() {
  const diff = CONFIG.LAUNCH_DATE - new Date();
  if (diff <= 0) {
    const t = $('cdTimer');
    if (t) t.innerHTML = '<p style="font-family:var(--fs);font-size:2rem;color:var(--gold)">🎉 We are LIVE!</p>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  [['cd-d',d],['cd-h',h],['cd-m',m],['cd-s',s]].forEach(([id, val]) => {
    const el = $(id);
    if (!el) return;
    const str = String(val).padStart(2,'0');
    if (el.textContent !== str) {
      el.classList.remove('flip');
      void el.offsetWidth;
      el.classList.add('flip');
      el.textContent = str;
    }
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ── GOOGLE SHEETS SUBMIT ───────────────────────────── */
async function submitToSheets(data) {
  if (CONFIG.SHEETS_URL.includes('REPLACE_WITH_YOUR_APPS_SCRIPT_URL')) {
    console.warn('⚠️ Google Sheets URL not configured. Data saved locally only.');
    return { ok: true, local: true };
  }
  try {
    const res = await fetch(CONFIG.SHEETS_URL, {
      method: 'POST',
      mode:   'no-cors',        // Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { ok: true };
  } catch (err) {
    console.error('Sheets error:', err);
    return { ok: false, error: err.message };
  }
}

/* ── WAITLIST FORM ──────────────────────────────────── */
const wlForm = $('wlForm');
if (wlForm) {
  // Live error clear
  ['wl-name','wl-email','wl-phone'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', () => {
      el.classList.remove('error');
      const errId = { 'wl-name':'en','wl-email':'ee','wl-phone':'ep' }[id];
      const errEl = $(errId);
      if (errEl) errEl.textContent = '';
    });
  });

  wlForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    const name  = $('wl-name')?.value.trim()  || '';
    const email = $('wl-email')?.value.trim() || '';
    const phone = $('wl-phone')?.value.trim() || '';
    const city  = $('wl-city')?.value.trim()  || '';

    // Clear errors
    [['wl-name','en'],['wl-email','ee'],['wl-phone','ep']].forEach(([inp,err]) => {
      $(inp)?.classList.remove('error');
      const e2 = $(err); if (e2) e2.textContent = '';
    });

    // Validate
    if (name.length < 2) {
      $('wl-name')?.classList.add('error');
      const e2 = $('en'); if (e2) e2.textContent = 'Please enter your full name.';
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      $('wl-email')?.classList.add('error');
      const e2 = $('ee'); if (e2) e2.textContent = 'Please enter a valid email.';
      valid = false;
    }
    if (!phone || !/^[+]?[\d\s\-]{8,15}$/.test(phone)) {
      $('wl-phone')?.classList.add('error');
      const e2 = $('ep'); if (e2) e2.textContent = 'Please enter a valid phone number.';
      valid = false;
    }
    if (!valid) return;

    // Disable button
    const btn = $('notifyBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Saving...'; }

    const payload = {
      type:      'waitlist',
      name, email, phone, city,
      source:    'landing_page',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Save to localStorage (backup)
    const list = JSON.parse(localStorage.getItem('ng_waitlist') || '[]');
    list.push(payload);
    localStorage.setItem('ng_waitlist', JSON.stringify(list));

    // Submit to Google Sheets
    await submitToSheets(payload);

    // GA event
    GA('waitlist_signup', { event_category: 'lead', event_label: email, city });

    // Success UI
    wlForm.reset();
    const succ = $('fsuccess');
    if (succ) succ.style.display = 'block';
    if (btn)  { btn.innerHTML = '✅ You\'re on the list!'; btn.style.background = 'var(--sage-d)'; }
    setTimeout(() => {
      if (succ) succ.style.display = 'none';
      if (btn)  { btn.disabled = false; btn.innerHTML = '🔔 Notify Me at Launch'; btn.style.background = ''; }
    }, 7000);
  });
}

/* ── RAZORPAY ───────────────────────────────────────── */
function openRazorpay() {
  const name  = $('wl-name')?.value.trim()  || '';
  const email = $('wl-email')?.value.trim() || '';
  const phone = $('wl-phone')?.value.trim() || '';

  GA('preorder_initiated', { event_category: 'ecommerce', value: 299, currency: 'INR' });

  if (CONFIG.RAZORPAY_KEY.includes('REPLACE')) {
    showRzpGuide();
    return;
  }

  const options = {
    key:         CONFIG.RAZORPAY_KEY,
    amount:      29900,
    currency:    'INR',
    name:        'NaturaGene Care',
    description: 'Sunflower Soap with Vitamin C — Early Bird Pre-Order',
    prefill:     { name, email, contact: phone },
    notes:       { product: 'sunflower-soap-vc', source: 'landing_page_v3' },
    theme:       { color: '#7AA874' },
    handler: response => onPaySuccess(response),
    modal:   { ondismiss: () => GA('razorpay_dismissed', { event_category: 'ecommerce' }) },
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', r => {
      GA('payment_failed', { event_category: 'ecommerce', event_label: r.error.code });
      alert('Payment failed: ' + r.error.description + '\nPlease try again.');
    });
    rzp.open();
  } catch (err) {
    console.error('Razorpay error:', err);
    showRzpGuide();
  }
}

async function onPaySuccess(response) {
  const payload = {
    type:       'preorder',
    payment_id: response.razorpay_payment_id,
    order_id:   response.razorpay_order_id || '',
    amount:     299,
    currency:   'INR',
    product:    'sunflower-soap-vc',
    timestamp:  new Date().toISOString(),
  };

  // Save locally
  const orders = JSON.parse(localStorage.getItem('ng_orders') || '[]');
  orders.push(payload);
  localStorage.setItem('ng_orders', JSON.stringify(orders));

  // Send to Google Sheets
  await submitToSheets(payload);

  // GA purchase
  GA('purchase', {
    transaction_id: response.razorpay_payment_id,
    value: 299, currency: 'INR',
    items: [{ item_id: 'sunflower-soap-vc', item_name: 'Sunflower Soap Vitamin C', price: 299, quantity: 1 }],
  });

  // Update UI — all pre-order buttons
  document.querySelectorAll('.btn-gold').forEach(btn => {
    btn.textContent = '✅ Order Confirmed!';
    btn.disabled = true;
    btn.style.background = 'var(--sage-d)';
  });

  alert('🎉 Pre-order confirmed!\nPayment ID: ' + response.razorpay_payment_id + '\nThank you for choosing NaturaGene Care!');
}

function showRzpGuide() {
  alert(
    '🔧 Razorpay Setup Required\n\n' +
    '1. Go to dashboard.razorpay.com\n' +
    '2. Settings → API Keys → Copy Key ID\n' +
    '3. Open script.js → replace RAZORPAY_KEY in CONFIG object\n\n' +
    'Test key: rzp_test_XXXXX\n' +
    'Live key: rzp_live_XXXXX'
  );
}

/* ── FAQ ACCORDION ──────────────────────────────────── */
$$('.fq').forEach(btn => {
  btn.addEventListener('click', () => {
    const ans    = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    $$('.fq.open').forEach(b => {
      b.classList.remove('open');
      b.nextElementSibling?.classList.remove('open');
    });
    if (!isOpen) {
      btn.classList.add('open');
      ans?.classList.add('open');
      GA('faq_opened', { event_category: 'engagement', event_label: btn.textContent.trim().slice(0,60) });
    }
  });
});

/* ── SECTION SCROLL DEPTH ANALYTICS ────────────────── */
const secTrackObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      GA('section_view', { event_category: 'scroll_depth', event_label: e.target.id || e.target.className.split(' ')[0] });
    }
  });
}, { threshold: 0.35 });
$$('section[id]').forEach(s => secTrackObs.observe(s));

/* ── PARALLAX PRODUCT CARD (desktop) ───────────────── */
if (window.matchMedia('(min-width:900px)').matches) {
  const card = document.querySelector('.hframe-card');
  if (card) {
    window.addEventListener('scroll', () => {
      card.style.transform = `translateY(${window.scrollY * 0.035}px)`;
    }, { passive: true });
  }
}

/* ── CONSOLE GUIDE ──────────────────────────────────── */
console.log(
  '%cNaturaGene Care 🌻 v3.0\n%c\n' +
  '╔══════════════════════════════════════════╗\n' +
  '║        3-Step Setup Checklist           ║\n' +
  '╠══════════════════════════════════════════╣\n' +
  '║ 1. Razorpay Key  → script.js CONFIG     ║\n' +
  '║ 2. Sheets URL    → script.js CONFIG     ║\n' +
  '║ 3. GA ID         → index.html head      ║\n' +
  '║ 4. GSC Code      → index.html head      ║\n' +
  '║ 5. Launch Date   → script.js CONFIG     ║\n' +
  '╚══════════════════════════════════════════╝\n\n' +
  'Local waitlist data: JSON.parse(localStorage.getItem("ng_waitlist"))\n' +
  'Local orders data:   JSON.parse(localStorage.getItem("ng_orders"))',
  'color:#7AA874;font-size:14px;font-weight:bold',
  'color:#555;font-size:11px'
);

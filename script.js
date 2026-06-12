/* ===================================================
   NaturaGene Care — script.js
   Handles: Nav, Scroll Reveal, Countdown, Waitlist Form,
            FAQ Accordion, Razorpay Integration,
            Google Analytics Events
   =================================================== */

'use strict';

/* ── HELPER ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ── STICKY HEADER ──────────────────────────────────── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────────────── */
const burger  = $('navBurger');
const navList = $('navList');

burger.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on link click
$$('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

/* ── COUNTDOWN TIMER ────────────────────────────────── */
// Set launch date here — change as needed
const LAUNCH_DATE = new Date('2025-10-01T00:00:00+05:30');

function updateCountdown() {
  const now  = new Date();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    $('countdownTimer').innerHTML = '<div class="countdown__launched">🎉 We are LIVE!</div>';
    return;
  }

  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000)  / 60000);
  const secs  = Math.floor((diff % 60000)    / 1000);

  $('cd-days').textContent  = String(days).padStart(2, '0');
  $('cd-hours').textContent = String(hours).padStart(2, '0');
  $('cd-mins').textContent  = String(mins).padStart(2, '0');
  $('cd-secs').textContent  = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ── WAITLIST FORM ──────────────────────────────────── */
const form = $('waitlistForm');

function showError(fieldId, errId, msg) {
  $(fieldId).classList.add('error');
  $(errId).textContent = msg;
}
function clearError(fieldId, errId) {
  $(fieldId).classList.remove('error');
  $(errId).textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[+]?[\d\s\-]{8,15}$/.test(phone.trim());
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name  = $('wl-name').value.trim();
  const email = $('wl-email').value.trim();
  const phone = $('wl-phone').value.trim();

  clearError('wl-name', 'err-name');
  clearError('wl-email', 'err-email');
  clearError('wl-phone', 'err-phone');

  if (name.length < 2) {
    showError('wl-name', 'err-name', 'Please enter your full name.');
    valid = false;
  }
  if (!validateEmail(email)) {
    showError('wl-email', 'err-email', 'Please enter a valid email address.');
    valid = false;
  }
  if (phone && !validatePhone(phone)) {
    showError('wl-phone', 'err-phone', 'Please enter a valid phone number.');
    valid = false;
  }

  if (!valid) return;

  // Save to localStorage
  const entries = JSON.parse(localStorage.getItem('ng_waitlist') || '[]');
  entries.push({ name, email, phone, ts: new Date().toISOString() });
  localStorage.setItem('ng_waitlist', JSON.stringify(entries));

  // GA event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'waitlist_signup', {
      event_category: 'engagement',
      event_label: email
    });
  }

  // Show success
  form.reset();
  const successEl = $('formSuccess');
  successEl.style.display = 'block';
  setTimeout(() => { successEl.style.display = 'none'; }, 6000);
});

/* ── RAZORPAY INTEGRATION ───────────────────────────── */
// ⚠️  Replace with your live Razorpay Key ID from the Razorpay Dashboard
const RAZORPAY_KEY = 'rzp_test_REPLACE_WITH_YOUR_KEY';

function openRazorpay() {
  const options = {
    key: RAZORPAY_KEY,
    amount: 29900,            // Amount in paise (₹299)
    currency: 'INR',
    name: 'NaturaGene Care',
    description: 'Sunflower Soap with Vitamin C — Early Bird Pre-Order',
    image: '',                // Logo URL or base64 (optional)
    handler: function(response) {
      // Payment success
      handlePaymentSuccess(response);
    },
    prefill: {
      name:    $('wl-name')  ? $('wl-name').value  : '',
      email:   $('wl-email') ? $('wl-email').value : '',
      contact: $('wl-phone') ? $('wl-phone').value : '',
    },
    notes: {
      product: 'Sunflower Soap Vitamin C',
      source:  'landing_page_preorder'
    },
    theme: {
      color: '#7AA874'
    },
    modal: {
      ondismiss: function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'razorpay_dismissed', { event_category: 'ecommerce' });
        }
      }
    }
  };

  // Validate Razorpay key before opening
  if (RAZORPAY_KEY === 'rzp_test_REPLACE_WITH_YOUR_KEY') {
    showRazorpayPlaceholder();
    return;
  }

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      alert('Payment failed: ' + response.error.description + '\nPlease try again.');
      if (typeof gtag !== 'undefined') {
        gtag('event', 'payment_failed', { event_category: 'ecommerce' });
      }
    });
    rzp.open();
  } catch(err) {
    console.error('Razorpay error:', err);
    showRazorpayPlaceholder();
  }
}

function handlePaymentSuccess(response) {
  // Store order locally
  const orders = JSON.parse(localStorage.getItem('ng_orders') || '[]');
  orders.push({
    payment_id: response.razorpay_payment_id,
    order_id:   response.razorpay_order_id || '',
    ts: new Date().toISOString()
  });
  localStorage.setItem('ng_orders', JSON.stringify(orders));

  // GA ecommerce event
  if (typeof gtag !== 'undefined') {
    gtag('event', 'purchase', {
      transaction_id: response.razorpay_payment_id,
      value: 299,
      currency: 'INR',
      items: [{ item_id: 'sunflower-soap-vc', item_name: 'Sunflower Soap Vitamin C', price: 299, quantity: 1 }]
    });
  }

  // Show confirmation
  const btn = $('razorpayBtn');
  btn.textContent = '✅ Pre-Order Confirmed! Check your email.';
  btn.disabled = true;
  btn.style.background = '#5a8a54';
}

function showRazorpayPlaceholder() {
  alert('🔧 Razorpay is not yet configured.\n\nTo activate:\n1. Log in to Razorpay Dashboard (razorpay.com)\n2. Copy your Key ID\n3. Replace RAZORPAY_KEY value in script.js\n\nTest mode key starts with rzp_test_ | Live key starts with rzp_live_');
}

/* ── FAQ ACCORDION ──────────────────────────────────── */
$$('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer    = btn.nextElementSibling;
    const isOpen    = btn.classList.contains('open');

    // Close all
    $$('.faq__q.open').forEach(openBtn => {
      openBtn.classList.remove('open');
      openBtn.nextElementSibling.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }

    // GA event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'faq_opened', {
        event_category: 'engagement',
        event_label: btn.textContent.trim().slice(0, 50)
      });
    }
  });
});

/* ── SMOOTH SECTION TRACKING (GA) ──────────────────── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio >= 0.4) {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'section_view', {
          event_category: 'scroll',
          event_label: e.target.id
        });
      }
    }
  });
}, { threshold: 0.4 });

['hero','why','story','benefits','countdown','waitlist','blog','faq','trust'].forEach(id => {
  const el = $(id);
  if (el) sectionObserver.observe(el);
});

/* ── CONSOLE INSTRUCTIONS ───────────────────────────── */
console.log(`
%cNaturaGene Care 🌻
%c
Setup checklist:
1. Google Analytics  → Replace GA_MEASUREMENT_ID in index.html
2. Search Console    → Replace YOUR_SEARCH_CONSOLE_VERIFICATION_CODE in index.html
3. Razorpay         → Replace RAZORPAY_KEY in script.js (line ~74)
4. Launch Date      → Update LAUNCH_DATE in script.js (line ~52)
5. Footer links     → Update social + email links in index.html

Razorpay docs: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
Google Analytics: https://analytics.google.com
Search Console: https://search.google.com/search-console
`,
'color:#7AA874;font-size:16px;font-weight:bold',
'color:#666;font-size:12px'
);

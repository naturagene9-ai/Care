# NaturaGene Care — Website v4.0
## What changed from v3

- ✅ **Mobile menu fixed** — was transparent/overlapping before. Now a solid dark-green slide-in drawer from the right, with backdrop overlay, ESC-to-close, and body-scroll lock.
- ✅ **Hero section redesigned** — added animated grid-lines background, floating product card with a gentle bobbing animation, a 4th floating ingredient tag, a stats row (waitlist count / rating / natural %), and a shine-sweep effect on the primary CTA button.
- ✅ **New circular logo** — used in header (56px) and footer (64px), perfectly round with shadow, scales smoothly on hover.
- ✅ **Footer contact updated** — replaced phone number with full address and support email.
- ✅ **All breakpoints re-tested** — 375px / 414px / 768px / 1024px / 1440px.

---

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main website (logo + 9 product images embedded as base64) |
| `style.css` | All styles — mobile-first, fixed nav drawer |
| `script.js` | Interactions, fixed mobile nav, form, Razorpay, GA |
| `appscript.js` | Google Apps Script — paste into script.google.com |

---

## Contact info now shown
**Address:** S-12, Atlanta Shoppers, Vesu, Surat, Gujarat 395007
**Email:** naturagen9@gmail.com
(Phone number intentionally removed from public footer)

---

## Setup Steps (same as before)

### 1. Google Sheets
1. Create a Google Sheet → copy its ID from the URL
2. script.google.com → New Project → paste `appscript.js`
3. Replace `SPREADSHEET_ID` with your Sheet ID
4. Deploy → Web App → Execute as Me → Access: Anyone
5. Copy Web App URL → paste into `script.js` → `CONFIG.SHEETS_URL`

### 2. Razorpay
dashboard.razorpay.com → API Keys → copy Key ID → paste into `script.js` → `CONFIG.RAZORPAY_KEY`

### 3. Google Analytics
analytics.google.com → copy Measurement ID (`G-XXXXXXXXXX`) → paste into `index.html` (2 places)

### 4. Search Console
search.google.com/search-console → HTML tag verification → paste code into `index.html`

### 5. Launch Date
`script.js` → `CONFIG.LAUNCH_DATE`

---

## GitHub Pages Deploy

```bash
git add .
git commit -m "v4.0 - fixed mobile nav + engaging hero + new logo + contact info"
git push
```

Wait 1-2 minutes, then hard-refresh your live URL (Ctrl+Shift+R) to clear cache.

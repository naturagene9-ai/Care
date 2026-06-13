# NaturaGene Care — Website v3.0
## Deploy & Setup Guide

### Files
| File | Purpose |
|------|---------|
| `index.html` | Main website (all images embedded as base64) |
| `style.css` | All styles — mobile-first, responsive |
| `script.js` | Interactions, form, Razorpay, GA events |
| `appscript.js` | Google Apps Script — paste into script.google.com |

---

## Step 1 — Google Sheets Setup

1. Create a new Google Sheet at sheets.google.com
2. Copy the Sheet ID from the URL:
   `docs.google.com/spreadsheets/d/**SHEET_ID**/edit`
3. Go to script.google.com → New Project
4. Delete default code, paste entire `appscript.js`
5. Replace `REPLACE_WITH_YOUR_GOOGLE_SHEET_ID` with your Sheet ID
6. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click Deploy → Copy the Web App URL
8. Paste URL into `script.js` → `CONFIG.SHEETS_URL`

---

## Step 2 — Razorpay Setup

1. Login → dashboard.razorpay.com
2. Settings → API Keys → Generate Key
3. Copy **Key ID** (starts with `rzp_test_` or `rzp_live_`)
4. Paste into `script.js` → `CONFIG.RAZORPAY_KEY`

---

## Step 3 — Google Analytics

1. analytics.google.com → Create Property → Web
2. Copy **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Replace `GA_MEASUREMENT_ID` in `index.html` (2 places)

---

## Step 4 — Google Search Console

1. search.google.com/search-console → Add Property
2. Verify via HTML tag → copy the `content` value
3. Replace `YOUR_GSC_CODE` in `index.html`

---

## Step 5 — Launch Date

In `script.js`, update:
```js
LAUNCH_DATE: new Date('2025-10-01T00:00:00+05:30'),
```

---

## Step 6 — GitHub Pages Deploy

```bash
git init
git add .
git commit -m "NaturaGene Care v3.0 launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/naturagene-care.git
git push -u origin main
```

Then: GitHub → Repo → Settings → Pages → Branch: main → Save

For custom domain, create a `CNAME` file containing:
```
naturagenecare.com
```

---

## Google Sheets Structure (auto-created)

**Waitlist tab:**
| Timestamp | Name | Email | Phone | City | Source | UserAgent |

**PreOrders tab:**
| Timestamp | Payment ID | Order ID | Amount | Currency | Product | Status |

---

## Test Apps Script

In script.google.com editor, run:
- `testWaitlist()` — adds a test waitlist row
- `testPreorder()` — adds a test pre-order row

Both functions will create the sheet tabs automatically if they don't exist.

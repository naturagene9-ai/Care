/**
 * =====================================================
 *  NaturaGene Care — Google Apps Script
 *  File: appscript.js
 *
 *  SETUP STEPS:
 *  1. Go to script.google.com → New Project
 *  2. Paste this ENTIRE file into Code.gs
 *  3. Change SPREADSHEET_ID below
 *  4. Click Deploy → New Deployment → Web App
 *     → Execute as: Me
 *     → Who has access: Anyone
 *  5. Copy the Web App URL
 *  6. Paste it into script.js → CONFIG.SHEETS_URL
 * =====================================================
 */

// ⚙️  REPLACE with your Google Sheet ID
// (found in the Sheet URL: docs.google.com/spreadsheets/d/SHEET_ID/edit)
const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_GOOGLE_SHEET_ID';

// Sheet tab names (will be auto-created if missing)
const WAITLIST_SHEET  = 'Waitlist';
const PREORDER_SHEET  = 'PreOrders';

/* ── Entry point ── */
function doPost(e) {
  try {
    const raw  = e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw);

    if (data.type === 'waitlist') {
      saveWaitlist(data);
    } else if (data.type === 'preorder') {
      savePreorder(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ── GET handler (for testing in browser) ── */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'NaturaGene Apps Script is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ── Save Waitlist Entry ── */
function saveWaitlist(data) {
  const sheet = getOrCreateSheet(WAITLIST_SHEET, [
    'Timestamp', 'Name', 'Email', 'Phone', 'City', 'Source', 'UserAgent'
  ]);

  sheet.appendRow([
    data.timestamp  || new Date().toISOString(),
    data.name       || '',
    data.email      || '',
    data.phone      || '',
    data.city       || '',
    data.source     || 'landing_page',
    data.userAgent  || '',
  ]);

  // Auto-resize columns for readability
  sheet.autoResizeColumns(1, 7);
}

/* ── Save Pre-Order Entry ── */
function savePreorder(data) {
  const sheet = getOrCreateSheet(PREORDER_SHEET, [
    'Timestamp', 'Payment ID', 'Order ID', 'Amount (₹)', 'Currency', 'Product', 'Status'
  ]);

  sheet.appendRow([
    data.timestamp  || new Date().toISOString(),
    data.payment_id || '',
    data.order_id   || '',
    data.amount     || 299,
    data.currency   || 'INR',
    data.product    || 'sunflower-soap-vc',
    'Confirmed',
  ]);

  sheet.autoResizeColumns(1, 7);

  // Send confirmation email (optional — uses your Gmail)
  sendConfirmationEmail(data);
}

/* ── Optional: Confirmation Email ── */
function sendConfirmationEmail(data) {
  try {
    // Only send if email is in the waitlist sheet
    const wlSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(WAITLIST_SHEET);
    if (!wlSheet) return;

    // Find matching email
    const emails = wlSheet.getRange(2, 3, wlSheet.getLastRow() - 1, 1).getValues().flat();
    // (we don't have the buyer email in pre-order payload from Razorpay here,
    //  so this is a placeholder — wire it up when you add server-side order verification)

    MailApp.sendEmail({
      to:      'hello@naturagenecare.com',  // ⚙️ Change to your email
      subject: '🌻 New Pre-Order — NaturaGene Care',
      body:    `New pre-order received!\n\nPayment ID: ${data.payment_id}\nOrder ID:   ${data.order_id}\nAmount:     ₹${data.amount}\nProduct:    ${data.product}\nTime:       ${data.timestamp}`,
    });
  } catch (err) {
    // Email sending is optional — log and continue
    console.error('Email error:', err);
  }
}

/* ── Helper: get or create sheet tab with headers ── */
function getOrCreateSheet(name, headers) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Write header row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    // Style header
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a2e1a');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * =====================================================
 *  TESTING
 *  Run testWaitlist() or testPreorder() from the
 *  Apps Script editor to verify everything works
 *  before going live.
 * =====================================================
 */
function testWaitlist() {
  saveWaitlist({
    type:      'waitlist',
    name:      'Test User',
    email:     'test@example.com',
    phone:     '+91 99999 88888',
    city:      'Surat',
    source:    'test_run',
    timestamp: new Date().toISOString(),
    userAgent: 'TestRunner/1.0',
  });
  console.log('✅ Waitlist test row added.');
}

function testPreorder() {
  savePreorder({
    type:       'preorder',
    payment_id: 'pay_test_' + Date.now(),
    order_id:   'order_test_' + Date.now(),
    amount:     299,
    currency:   'INR',
    product:    'sunflower-soap-vc',
    timestamp:  new Date().toISOString(),
  });
  console.log('✅ Pre-order test row added.');
}

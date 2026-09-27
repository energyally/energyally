const SHEET_NAME = "Leads";
// Notify both the internal tech inbox and the public contact inbox.
const NOTIFY_EMAIL = "tech.energyally@gmail.com,contact@energyally.in";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    body.email = String(body.email || "").trim();
    body.name = String(body.name || "").trim().slice(0, 120);
    if (!body.name || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(body.email) || /[\r\n]/.test(body.email)) {
      throw new Error("A name and valid email address are required.");
    }
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      body.name || "",
      body.phone || "",
      body.email || "",
      body.sector || "",
      body.teamSize || "",
      body.notes || "",
      body.source || "energyally-website",
    ]);

    const subject = `New Demo Request: ${body.name || "Unknown"}`;
    const message = [
      "New Energy Ally demo request received.",
      "",
      `Name: ${body.name || ""}`,
      `Phone: ${body.phone || ""}`,
      `Email: ${body.email || ""}`,
      `Sector: ${body.sector || ""}`,
      `Team Size: ${body.teamSize || ""}`,
      `Notes: ${body.notes || ""}`,
      `Source: ${body.source || "energyally-website"}`,
      `Requested At: ${body.requestedAt || new Date().toISOString()}`,
    ].join("\n");

    MailApp.sendEmail(NOTIFY_EMAIL, subject, message);

    // A confirmation failure must not discard an already recorded lead.
    let confirmationSent = false;
    try {
      const confirmation = demoConfirmation_(body);
      MailApp.sendEmail({
        to: body.email,
        subject: "Your EnergyAlly demo request — let's simplify your day",
        name: "EnergyAlly",
        replyTo: "sales@energyally.in",
        body: confirmation.text,
        htmlBody: confirmation.html,
      });
      confirmationSent = true;
    } catch (confirmationError) {
      console.error("Requester confirmation failed: " + String(confirmationError));
    }

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, confirmationSent: confirmationSent })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function escapeEmailHtml_(value) {
  return String(value || "").replace(/[&<>"']/g, function(character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function demoConfirmation_(lead) {
  const name = escapeEmailHtml_(lead.name);
  const sector = escapeEmailHtml_(lead.sector || "your business");
  const text = [
    "Hi " + lead.name + ",",
    "",
    "Thank you for requesting an EnergyAlly demo. We're glad you're here!",
    "Our team will contact you to arrange a convenient time and tailor the walkthrough to your operation.",
    "",
    "What happens next?",
    "1. A quick conversation about your business and day-to-day challenges.",
    "2. A personalised walkthrough of the workflows that matter to you.",
    "3. Time for your questions and a clear discussion of the next steps.",
    "",
    "Your interest: " + (lead.sector || "EnergyAlly"),
    "This confirms your request; your demo time will be agreed with our team.",
    "",
    "Have something to add? Reply to this email or call +91 95008 06995.",
    "The EnergyAlly team",
    "One platform. Every energy.",
    "https://energyally.in",
  ].join("\n");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f5f2;font-family:Arial,Helvetica,sans-serif;color:#193b35">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Thanks for reaching out. Let's find a simpler way to run your day.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5f2"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="padding:30px 32px;background:#153d34;color:#ffffff"><a href="https://energyally.in" style="color:#ffffff;text-decoration:none;font-size:27px;font-weight:bold">energy<span style="color:#88d4c2">ally</span></a><div style="font-size:12px;color:#c4ddd3;margin-top:7px">One platform. Every energy.</div></td></tr>
<tr><td style="padding:36px 32px 20px"><div style="font-size:11px;letter-spacing:2px;font-weight:bold;color:#168875">LET'S MAKE YOUR DAY SIMPLER</div><h1 style="font-size:30px;line-height:1.2;margin:16px 0 24px">Your next chapter<br>starts with a conversation.</h1><p style="font-size:16px;line-height:1.7">Hi ${name},</p><p style="font-size:15px;line-height:1.8;color:#536d65">Thank you for requesting an <strong style="color:#193b35">EnergyAlly demo</strong>. Our team will contact you to arrange a convenient time and tailor the walkthrough to your operation.</p></td></tr>
<tr><td style="padding:0 32px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eff5ef;border-radius:10px"><tr><td style="padding:22px"><strong style="font-size:15px">Here's what happens next</strong><p style="font-size:14px;line-height:1.8;margin-bottom:0"><b style="color:#168875">01</b> &nbsp; A quick conversation about your business.<br><b style="color:#168875">02</b> &nbsp; A walkthrough of the workflows you need.<br><b style="color:#168875">03</b> &nbsp; Your questions, answered.</p></td></tr></table></td></tr>
<tr><td style="padding:0 32px 30px"><p style="font-size:13px;color:#536d65">Your interest: <strong style="color:#193b35">${sector}</strong></p><p style="font-size:13px;line-height:1.7;color:#536d65">This confirms your request. We'll agree your demo time together.</p><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#126753"><a href="https://energyally.in/#platform" style="display:inline-block;padding:14px 22px;font-size:14px;font-weight:bold;color:white;text-decoration:none">Explore EnergyAlly &rarr;</a></td></tr></table><p style="font-size:14px;line-height:1.8;margin-top:25px">Anything you'd like us to cover? Just reply to this email.<br><strong>The EnergyAlly team</strong></p></td></tr>
<tr><td style="padding:22px 32px;background:#f7faf7;border-top:1px solid #dce5dd;font-size:12px;line-height:1.8;color:#60756b"><a href="mailto:sales@energyally.in" style="color:#126753">sales@energyally.in</a> &nbsp;·&nbsp; <a href="tel:+919500806995" style="color:#126753">+91 95008 06995</a><br>You're receiving this email because you requested a demo at energyally.in.</td></tr>
</table></td></tr></table></body></html>`;
  return { text: text, html: html };
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Created At",
      "Name",
      "Phone",
      "Email",
      "Sector",
      "Team Size",
      "Notes",
      "Source",
    ]);
  }

  return sheet;
}

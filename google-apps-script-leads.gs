const SHEET_NAME = "Leads";
// Notify both the internal tech inbox and the public contact inbox.
const NOTIFY_EMAIL = "tech.energyally@gmail.com,contact@energyally.in";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
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

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
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

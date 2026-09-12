/**
 * BKG (Brandenburgers Kommando Gruppen) — Discord Onboarding Backend
 *
 * This file goes into Google Apps Script, bound to a Google Sheet.
 * Deployment instructions are in README.md.
 *
 * SHEET COLUMNS (must match exactly, order matters):
 * A: Timestamp
 * B: ApplicationID
 * C: Discord Username
 * D: In-game Tag
 * E: Casual Play
 * F: Competitive Play
 * G: Preferred Nation
 * H: Highest Tier
 * I: Preferred Squad
 * J: Microphone
 * K: Age
 * L: Country
 * M: Time Zone
 * N: Other Games
 * O: Status          <-- admin changes this manually: Pending / Approved / Rejected
 */

const SHEET_NAME = "Applications";
const DISCORD_INVITE_LINK = "https://discord.gg/bkg";

const ADMIN_USERNAME = "BKG1389";
const ADMIN_PASSWORD = "admin1389";

/**
 * Handles POST requests: new application submissions and admin login.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === "adminLogin") {
      return handleAdminLogin(data);
    }

    return handleApplicationSubmit(data);
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

/**
 * Handles a new application submission from the onboarding form.
 */
function handleApplicationSubmit(data) {
  const sheet = getOrCreateSheet();

  const applicationId = generateApplicationId();
  const timestamp = new Date();

  sheet.appendRow([
    timestamp,
    applicationId,
    data.discordUsername || "",
    data.ingameTag || "",
    data.casualPlay || "",
    data.competitivePlay || "",
    data.preferredNation || "",
    data.highestTier || "",
    data.preferredSquad || "",
    data.microphone || "",
    data.age || "",
    data.country || "",
    data.timeZone || "",
    data.otherGames || "",
    "Pending"
  ]);

  return jsonResponse({ success: true, applicationId: applicationId });
}

/**
 * Handles admin login: verifies credentials and returns all applications.
 */
function handleAdminLogin(data) {
  if (data.username !== ADMIN_USERNAME || data.password !== ADMIN_PASSWORD) {
    return jsonResponse({ success: false, error: "Invalid username or password." });
  }

  const sheet = getOrCreateSheet();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const applications = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const entry = {};
    headers.forEach((header, idx) => {
      const cell = row[idx];
      entry[header] = cell instanceof Date ? cell.toISOString() : cell;
    });
    applications.push(entry);
  }

  return jsonResponse({ success: true, applications: applications });
}

/**
 * Handles GET request for status check: ?id=APPLICATION_ID
 */
function doGet(e) {
  try {
    const id = e.parameter.id;
    if (!id) {
      return jsonResponse({ success: false, error: "Missing application ID." });
    }

    const sheet = getOrCreateSheet();
    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[1] === id) {
        const status = row[14]; // column O
        const result = { success: true, status: status };
        if (status === "Approved") {
          result.inviteLink = DISCORD_INVITE_LINK;
        }
        return jsonResponse(result);
      }
    }

    return jsonResponse({ success: false, error: "No application found with this ID." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Timestamp", "ApplicationID", "Discord Username", "In-game Tag",
      "Casual Play", "Competitive Play", "Preferred Nation", "Highest Tier",
      "Preferred Squad", "Microphone", "Age", "Country", "Time Zone",
      "Other Games", "Status"
    ]);
  }
  return sheet;
}

function generateApplicationId() {
  // Format: BKG-XXXXXX (6 random alphanumeric characters)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no easily-confused characters (0/O, 1/I)
  let id = "BKG-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

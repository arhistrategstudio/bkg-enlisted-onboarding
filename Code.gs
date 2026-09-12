/**
 * BKG (Brandenburgers Kommando Gruppen) — Discord Onboarding Backend
 *
 * Ovaj fajl ide u Google Apps Script, povezan na Google Sheet.
 * Instrukcije za deploy su u README.md.
 *
 * KOLONE U SHEET-U (mora da se poklapaju tačno, redosled je bitan):
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
 * O: Status          <-- admin ovo ručno menja: Pending / Approved / Rejected
 */

const SHEET_NAME = "Applications";
const DISCORD_INVITE_LINK = "https://discord.gg/bkg";

/**
 * Handles POST request from the onboarding form (new application).
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
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
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

/**
 * Handles GET request for status check: ?id=APPLICATION_ID
 */
function doGet(e) {
  try {
    const id = e.parameter.id;
    if (!id) {
      return jsonResponse({ success: false, error: "Nedostaje ID prijave." });
    }

    const sheet = getOrCreateSheet();
    const values = sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[1] === id) {
        const status = row[14]; // kolona O
        const result = { success: true, status: status };
        if (status === "Approved") {
          result.inviteLink = DISCORD_INVITE_LINK;
        }
        return jsonResponse(result);
      }
    }

    return jsonResponse({ success: false, error: "Prijava sa ovim ID-om nije pronađena." });
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
  // Format: BKG-XXXXXX (6 nasumičnih alfanumeričkih karaktera)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bez lako-zbunjujućih karaktera (0/O, 1/I)
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

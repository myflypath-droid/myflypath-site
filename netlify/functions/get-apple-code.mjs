// ─── get-apple-code.mjs ───────────────────────────────────────────────────
// Lit les credentials depuis un fichier local (non pushé sur GitHub)
// ─────────────────────────────────────────────────────────────────────────
import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Lire les credentials depuis le fichier JSON local
let credentials;
try {
  const credsPath = join(__dirname, "google-credentials.json");
  credentials = JSON.parse(readFileSync(credsPath, "utf8"));
} catch (err) {
  console.error("Impossible de lire google-credentials.json:", err.message);
  throw new Error("Google credentials manquants");
}

async function getSheetClient() {
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await auth.authorize();
  return google.sheets({ version: "v4", auth });
}

export async function getAndMarkAppleCode(email) {
  const sheets = await getSheetClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "Sheet1!A:D",
  });

  const rows = res.data.values || [];

  let targetRow = -1;
  let targetCode = null;

  for (let i = 1; i < rows.length; i++) {
    const code = rows[i][0];
    const used = rows[i][1];
    if (code && (!used || used.toUpperCase() === "FALSE")) {
      targetRow = i + 1;
      targetCode = code;
      break;
    }
  }

  if (!targetRow || !targetCode) return null;

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Sheet1!B${targetRow}:D${targetRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [["TRUE", now, email]] },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: targetRow - 1,
            endRowIndex: targetRow,
            startColumnIndex: 0,
            endColumnIndex: 4,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.9, green: 0.2, blue: 0.2 },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                bold: true,
              },
            },
          },
          fields: "userEnteredFormat(backgroundColor,textFormat)",
        },
      }],
    },
  });

  return targetCode;
}

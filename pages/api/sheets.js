import { google } from "googleapis";

export async function getCompetitionListFromSheets() {
  try {
    const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      scopes
    );

    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Competitions',
    });

    const rows = response.data.values;
    if (rows.length && rows.length > 1) {
      rows.shift();
      return rows.map((row) => ({
        league: row[0],
        date: row[1],
        gym: row[2],
        city: row[3],
        link: row[4],
        type: row[5]
      }));
    }
    return {};
  } catch (err) {
    console.log(err);
  }

  return [];
}

export async function addCompetitorToSheet(
  competitorName, competitorDivision, competitorMobile, date, league, gym) {
    try {
      const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
      const jwt = new google.auth.JWT(
        process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        null,
        (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        scopes
      );
  
      const sheets = google.sheets({ version: "v4", auth: jwt });

      let newRows = [[competitorName, competitorDivision, competitorMobile]];
      let sheetName = `${date} ${league} at ${gym}`;
      let spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  
      // Check if there's already a sheet for this competition.
      const response = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });

      if (response.data.sheets.filter(sheet => sheet.properties.title == sheetName).length == 0) {
        // Need to add the sheet.
        const addSheetResponse = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    frozenRowCount: 1
                  }
                }
              }
            }]
          }
        });
        // Add a header, the frozen row in `gridProperties` above.
        newRows.unshift(['Name', 'Division', 'Mobile']);
      }
      console.log('Adding new rows: ', newRows);
      const addResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A1:D1`,
        valueInputOption: 'RAW',
        resource: {
          values: newRows
        }
      });
    } catch (err) {
      console.log(err);
    }
}

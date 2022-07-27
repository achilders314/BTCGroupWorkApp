// Gets spreadsheet based on ID in Setup tab, pushes new values
function pushRecords() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let recordsId = sheet.getSheetByName("Roster & Settings").getRange("I3").getValue();
  let currentSession = sheet.getActiveSheet().getRange("A3:AG27");
  
  let recordsSheet = SpreadsheetApp.openById(recordsId);
  recordsSheet.getSheetByName("Summary").getRange(2,2).setValue("12");

}

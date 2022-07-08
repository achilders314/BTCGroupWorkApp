//TODO get this working for groups of 2 and 4.
//(For groups of 3) Calculates how many groups of 3 and groups of 2 there will be based on how many students are present.
function numOfGroups() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let rosterCount = sheet.getRange("Roster & Settings!D3").getValue();
  let groupSize = sheet.getRange("Roster & Settings!E3").getValue();
  let numGroups = Math.ceil(rosterCount / groupSize);

  let numGroupsof2;
   if(rosterCount % groupSize === 1) {
     numGroupsof2 = 2;
   }
   if(rosterCount % groupSize === 2){
     numGroupsof2 = 1;
   }
  let numGroupsof3 = numGroups - numGroupsof2;  

  console.log(numGroupsof2, numGroupsof3);
  return rosterCount, numGroups, numGroupsof2, numGroupsof3;
}


function createNewSheet() {

  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let newSheetName = sheet.getRange("Roster & Settings!C3").getValue();
  let template = sheet.getSheetByName('Template (Do Not Delete)');

//Creates a new copy of the template sheet and names the new sheet with the specified sessions name
  let newSession = template.copyTo(sheet);
  newSession.setName(newSheetName);
  newSession.getRange("A1").setValue(`Session: ${newSheetName}`);

//Sets row 3 of new spreadsheet with correct # of problem numbers, and hides unnecessary columns
  let numProblems = sheet.getRange("Roster & Settings!F3").getValue();
  for (let i=1; i<= numProblems; i++) {
    sheet.getSheetByName(newSheetName).getRange(3, i+1).setValue(`#${i}`);
  }

//Sets rubric column to current rubric
  let rubric = sheet.getRange("Roster & Settings!H3").getValue();
  sheet.getSheetByName(newSheetName).getRange("AA3").setValue(`${rubric} Rating 1-10`);

//Makes new session active sheet
  sheet.getSheetByName(newSheetName).activate();
}


//Attendance checkmark buttons
function checkAll() {
  SpreadsheetApp.getActiveSheet().getRange("Roster & Settings!B:B").check();
}

function uncheckAll() {
  SpreadsheetApp.getActiveSpreadsheet().getRange("Roster & Settings!B:B").uncheck();
}


//Unnecessary function for creating menu for now, keeping it for a template in case I decide I need some functions in a menu.

// function onOpen() {
//   let ui = SpreadsheetApp.getUi();
//   ui.createMenu('Custom Formatting').addItem('Format Report', 'formatReport').addItem('Random Person', 'sortNames').addToUi();
// }




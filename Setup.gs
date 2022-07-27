//TODO get this working for groups of 2 and 4.
//(For groups of 3) Calculates how many groups of 3 and groups of 2 there will be based on how many students are present.
function numOfGroups() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let rosterCount = sheet.getRange("Roster & Settings!D3").getValue();
  let groupSize = sheet.getRange("Roster & Settings!E3").getValue();
  var numGroups;
  var numGroupsof2;
  var numGroupsof3;
  var numGroupsof4;

  if(groupSize == 3){
    if(rosterCount % groupSize == 0){
      numGroups = rosterCount / groupSize;
      numGroupsof2 = 0;
      numGroupsof3 = numGroups;
    }
    else {numGroups = Math.ceil(rosterCount / groupSize);
    numGroupsof2 = groupSize - (rosterCount % groupSize);
    numGroupsof3 = numGroups - numGroupsof2;
    }
  }
  else if(groupSize == 4) {
    if(rosterCount % groupSize == 0){
      numGroups = rosterCount / groupSize;
      numGroupsof2 = 0;
      numGroupsof3 = 0;
      numGroupsof4 = numGroups;
    }
    else {numGroups = Math.ceil(rosterCount / groupSize);
    numGroupsof2 = 0;
    numGroupsof3 = groupSize - (rosterCount % groupSize);
    }
  }
  else if(groupSize == 2) {
    numGroups = Math.floor(rosterCount / groupSize);
    numGroupsof3 = rosterCount % groupSize;
    numGroupsof2 = numGroups - numGroupsof3;
  }
console.log(numGroups, numGroupsof2, numGroupsof3, numGroupsof4)

  return [numGroups, numGroupsof2, numGroupsof3, numGroupsof4];
}



function randomAssignments([numGroups, numGroupsof2, numGroupsof3, numGroupsof4], newSheetName) {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let roster = sheet.getRange("Roster & Settings!A3:B50").getValues();
  let exclusion1 = sheet.getRange("Roster & Settings!C28").getValue().split(', ');
  let exclusion2 = sheet.getRange("Roster & Settings!C29").getValue().split(', ');
  let exclusion3 = sheet.getRange("Roster & Settings!C30").getValue().split(', ');
  console.log(exclusion1, exclusion2, exclusion3);


// Checks if students are present for this session, pushes their names into an array
  let presentStudents = [];
  for (let i=0; roster[i][0] != ""; i++){
    if(roster[i][1] === true){
      presentStudents.push(roster[i][0]);
    }
  }

// Randomizes array
let shuffledStudents = presentStudents
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
console.log(shuffledStudents);

startOverSorting();
//Slices array into groups of 2 and pushes those values under group names
function startOverSorting(){
for (let i=0; i<numGroupsof2; i++) {
  let newGroup;
  newGroup = shuffledStudents.slice(2*i,2*i+2);
  if((exclusion1 != [''] && exclusion1.every(name => newGroup.includes(name))) || (exclusion2 != [''] && exclusion2.every(name => newGroup.includes(name))) || (exclusion3 != [''] && exclusion3.every(name => newGroup.includes(name))))
  {
    let temp = shuffledStudents[shuffledStudents.indexOf(exclusion1[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion1[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion2[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion2[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion3[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion3[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion1[1])]; 
      shuffledStudents[shuffledStudents.indexOf(exclusion1[1])] = temp;
      console.log(shuffledStudents)
      startOverSorting();
  }
  newGroup = newGroup.join(", ");
  sheet.getSheetByName(newSheetName).getRange((2*i+5), 1).setValue(`${newGroup}`);
  console.log(newGroup);
}


//Slices remainder of array into groups of 3 and pushes those values under group names
for (let i=numGroupsof2; i<numGroupsof2+numGroupsof3; i++) {
  let newGroup;
  newGroup = shuffledStudents.slice(3*i-numGroupsof2, 3*i-numGroupsof2+3);
  if((exclusion1 != [''] && exclusion1.every(name => newGroup.includes(name))) || (exclusion2 != [''] && exclusion2.every(name => newGroup.includes(name)))) 
    {
      let temp = shuffledStudents[shuffledStudents.indexOf(exclusion1[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion1[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion2[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion2[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion3[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion3[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion1[1])]; 
      shuffledStudents[shuffledStudents.indexOf(exclusion1[1])] = temp;
      console.log(shuffledStudents);
      startOverSorting();
    }
  newGroup = newGroup.join(", ");
  sheet.getSheetByName(newSheetName).getRange(2*i+5, 1).setValue(`${newGroup}`);
  console.log(newGroup);
}


//Slices remainder of array into groups of 4 and pushes those under group names, does not execute if groupSize == 2
if(numGroups - numGroupsof2 - numGroupsof3 != 0){
for (let i=numGroupsof2 + numGroupsof3; i<numGroups; i++) {
  let newGroup;
  newGroup = shuffledStudents.slice(4*i-numGroupsof3,4*i-numGroupsof3+4);
  if((exclusion1 != [''] && exclusion1.every(name => newGroup.includes(name))) || (exclusion2 != [''] && exclusion2.every(name => newGroup.includes(name))) || (exclusion3 != [''] && exclusion3.every(name => newGroup.includes(name)))) 
  {
    let temp = shuffledStudents[shuffledStudents.indexOf(exclusion1[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion1[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion2[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion2[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion3[0])];
      shuffledStudents[shuffledStudents.indexOf(exclusion3[0])] = shuffledStudents[shuffledStudents.indexOf(exclusion1[1])]; 
      shuffledStudents[shuffledStudents.indexOf(exclusion1[1])] = temp;
      console.log(shuffledStudents);
      startOverSorting();
  }
  newGroup = newGroup.join(", ");
  sheet.getSheetByName(newSheetName).getRange(2*i+5, 1).setValue(`${newGroup}`);
  console.log(newGroup);
}
}
}

//Hides unused groups except 1 in case user decides they need to tweak something
let rowToHide = numGroups * 2 + 6
sheet.getSheetByName(newSheetName).hideRows(rowToHide, 1002 - rowToHide);
}


function createNewSheet() {

  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let newSheetName = sheet.getRange("Roster & Settings!C3").getValue();
  let template = sheet.getSheetByName('Template (Do Not Delete)');

//Creates a new copy of the template sheet and names the new sheet with the specified sessions name
  let newSession = template.copyTo(sheet);
  newSession.setName(newSheetName);
  newSession.getRange("A1").setValue(`Session: ${newSheetName}`);

//Makes new session active sheet
  sheet.getSheetByName(newSheetName).activate();

//Sets row 3 of new spreadsheet with correct # of problem numbers, and hides unnecessary columns
  let numProblems = sheet.getRange("Roster & Settings!F3").getValue();
  for (let i=1; i<= numProblems; i++) {
    sheet.getSheetByName(newSheetName).getRange(3, i+1).setValue(`#${i}`);
  }
  for (let i=numProblems+2; i<=26; i++){
  let inactiveRange = sheet.getSheetByName(newSheetName).getRange(3, i);
  sheet.hideColumn(inactiveRange);
  }

//Sets rubric column to selected rubric
  let rubric = sheet.getRange("Roster & Settings!H3").getValue();
  sheet.getSheetByName(newSheetName).getRange("AD3").setValue(`${rubric} Rating 1-10`);

//Gets student groups in new sheet
randomAssignments(numOfGroups(), newSheetName);

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




function pushRecords() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet();
  let recordsId = sheet
    .getSheetByName("Roster & Settings")
    .getRange("J3")
    .getValue();
  let currentSession = sheet.getActiveSheet();
  let groups = currentSession.getRange("A4:A27").getValues();
  let classList = [];
  for (let i = 0; i < 12; i++) {
    if (groups[2 * i + 1][0] != [""]) {
      classList = classList.concat(groups[2 * i + 1][0].split(", "));
    }
  }
  console.log(classList);

  let recordsSheet = SpreadsheetApp.openById(recordsId);

  for (let i = 0; i < classList.length; i++) {
    if (recordsSheet.getSheetByName(classList[i]) == null) {
      let newSheet = recordsSheet
        .getSheetByName("Student_Template")
        .copyTo(recordsSheet);
      newSheet.setName(classList[i]);
      newSheet.getRange("A1").setValue(classList[i]);
    }

    let summaryList = recordsSheet
      .getSheetByName("Summary")
      .getRange("A3:A43")
      .getValues();
    console.log(summaryList);
    if (summaryList.flat().indexOf(classList[i].split(" ")[0]) == -1) {
      let firstEmptySummary;
      for (let j = 0; j < summaryList.length; j++) {
        if (summaryList[j] == "") {
          firstEmptySummary = j + 3;
          break;
        }
      }
      recordsSheet.getSheetByName("Summary").insertRowAfter(firstEmptySummary);
      recordsSheet
        .getSheetByName("Summary")
        .getRange(firstEmptySummary + 1, 1)
        .setValue(classList[i].split(" ")[0]);
      recordsSheet
        .getSheetByName("Summary")
        .getRange(firstEmptySummary + 1, 2)
        .setValue(classList[i].split(" ")[1]);
    }

    let currentStudentSheet = recordsSheet.getSheetByName(classList[i]);
    let dateColumn = currentStudentSheet.getRange("A3:A").getValues().flat();

    function getFirstEmpty() {
      for (j = 0; j < dateColumn.length; j++) {
        if (dateColumn[j] == "") {
          return j;
        }
      }
    }

    //Finds which group current person is in
    function findGroupNumber() {
      for (let j = 0; j < groups.length; j++) {
        if (groups[j][0].split(", ").indexOf(classList[i]) != -1) {
          console.log(j + 5);
          return j + 5;
        }
      }
    }
    console.log(groups);
    let groupNumberCell = findGroupNumber();

    // Finds the correct rubric column
    let currentRubricColumn;
    for (let j = 6; j <= currentStudentSheet.getLastColumn() - 1; j++) {
      if (
        currentSession.getRange("AD3").getValue() ==
        currentStudentSheet.getRange(2, j).getValue()
      ) {
        currentRubricColumn = j;
        break;
      } else if (currentSession.getRange("AD3").getValue() == "None") {
        break;
      } else if (j <= currentStudentSheet.getLastColumn() - 2) {
        continue;
      } else {
        currentRubricColumn = currentStudentSheet.getLastColumn() - 2;
        currentStudentSheet.insertColumnAfter(currentRubricColumn);
        recordsSheet
          .getSheetByName("Summary")
          .insertColumnAfter(currentRubricColumn);
        currentRubricColumn += 1;
        currentStudentSheet
          .getRange(2, currentRubricColumn)
          .setValue(currentSession.getRange("AD3").getValue());
        let a1notation = currentStudentSheet
          .getRange(
            3,
            currentRubricColumn,
            currentStudentSheet.getLastRow() - 6,
            1
          )
          .getA1Notation();
        currentStudentSheet
          .getRange(currentStudentSheet.getLastRow() - 1, currentRubricColumn)
          .setFormula(`=average(${a1notation})`);
        break;
      }
    }

    //Creates a new row after the last session
    let firstEmpty = getFirstEmpty();
    currentStudentSheet.insertRowAfter(firstEmpty + 3);

    // Sets values of columns
    currentStudentSheet
      .getRange(firstEmpty + 3, 1)
      .setValue(currentSession.getRange("A1002").getValue()); //Set Date
    currentStudentSheet
      .getRange(firstEmpty + 3, 2)
      .setValue(currentSession.getRange("A1").getValue().slice(9)); //Session Title
    currentStudentSheet
      .getRange(firstEmpty + 3, 3)
      .setValue(currentSession.getRange(`AE${groupNumberCell - 2}`).getValue()); //✓
    currentStudentSheet
      .getRange(firstEmpty + 3, 4)
      .setValue(currentSession.getRange(`AF${groupNumberCell - 2}`).getValue()); //⚠
    currentStudentSheet
      .getRange(firstEmpty + 3, 5)
      .setValue(currentSession.getRange(`AG${groupNumberCell - 2}`).getValue()); //⊘
    if (currentSession.getRange("AD3").getValue() != "None") {
      currentStudentSheet
        .getRange(firstEmpty + 3, currentRubricColumn)
        .setValue(
          currentSession.getRange(`AD${groupNumberCell - 2}`).getValue()
        ); //Sets rubric value
    }
    currentStudentSheet
      .getRange(firstEmpty + 3, currentStudentSheet.getLastColumn())
      .setValue(currentSession.getRange(`AA${groupNumberCell - 2}`).getValue()); //Sets Comments cell
  }
}

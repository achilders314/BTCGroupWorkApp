function syncStudents() {
  let recordsSheet = SpreadsheetApp.getActiveSpreadsheet();
  let summarySheet = recordsSheet.getSheetByName("Summary");
  let studentList = summarySheet.getRange("A4:B43").getValues();
  console.log(studentList);
  for (let i = 0; i < studentList.length; i++) {
    console.log(studentList[i][0]);
    if (studentList[i][0] != "") {
      let studentName = studentList[i].join(" ");
      console.log(studentName);
      let studentRecord = recordsSheet.getSheetByName(studentName);
      let lastRow = studentRecord.getLastRow();
      summarySheet
        .getRange(`C${i + 4}`)
        .setValue(studentRecord.getRange(`C${lastRow}`).getValue()); // green
      summarySheet
        .getRange(`D${i + 4}`)
        .setValue(studentRecord.getRange(`D${lastRow}`).getValue()); // yellow
      summarySheet
        .getRange(`E${i + 4}`)
        .setValue(studentRecord.getRange(`E${lastRow}`).getValue()); // red
      summarySheet
        .getRange(i + 4, summarySheet.getLastColumn())
        .setValue(
          studentRecord
            .getRange(lastRow - 5, studentRecord.getLastColumn())
            .getValue()
        ); // comments

      //TODO TODO TODO TODO TODO:  Get this part to create new columns as needed, and populate them.
      // Retrieves rubric columns, returns averages
      for (let j = 6; j < summarySheet.getLastColumn() - 1; j++) {
        summarySheet
          .getRange(i + 4, j)
          .setValue(studentRecord.getRange(lastRow - 1, j).getValue());
      }

      //Links student name to their corresponding sheet
      let url = `${recordsSheet.getUrl()}#gid=${studentRecord.getSheetId()}`;
      let linkedName = SpreadsheetApp.newRichTextValue()
        .setText(studentList[i][0])
        .setLinkUrl(url)
        .build();
      summarySheet.getRange(`A${i + 4}`).setRichTextValue(linkedName);
    }
  }
}

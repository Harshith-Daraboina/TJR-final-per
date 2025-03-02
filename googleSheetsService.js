import { google } from "googleapis";
import credentials from "./service-account.json"; // Import JSON key file

// Authenticate Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * ✅ Function to create a new Google Sheet for a course
 */
export const createCourseSheet = async (courseName) => {
  try {
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: courseName }, // Course name as sheet title
        sheets: [{ properties: { title: "Students" } }], // Add "Students" sheet
      },
    });

    const newSheetId = response.data.spreadsheetId;
    console.log(`✅ Created Sheet for ${courseName}: ${newSheetId}`);
    return newSheetId;
  } catch (error) {
    console.error(`❌ Error creating sheet for ${courseName}:`, error);
    throw error;
  }
};

/**
 * ✅ Function to add students to a Google Sheet
 */
export const addStudentsToCourseSheet = async (spreadsheetId, students) => {
  try {
    const values = students.map((student, index) => [index + 1, student.name, student.email]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Students!A:C", // Add students to "Students" sheet
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    console.log("✅ Students added successfully to", spreadsheetId);
  } catch (error) {
    console.error("❌ Error adding students:", error);
    throw error;
  }
};

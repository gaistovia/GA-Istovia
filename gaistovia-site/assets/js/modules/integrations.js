/* ============================================================
   integrations.js
   PHASE 2 (current): frontend-only placeholders.
   PHASE 3 (future): wire these functions to a deployed Google
   Apps Script Web App. Every integration point below is a single
   function — Phase 3 should only need to fill in the fetch calls
   marked "TODO PHASE 3", without touching any UI/wizard code.
   ============================================================ */

/**
 * The Google Sheet (Phase 3) is expected to use these exact columns,
 * in this order, one row per submission:
 *
 *   Project ID | Submission Date | Full Name | Company Name | Email |
 *   Phone Number | WhatsApp Number | Country | City | Requested Service |
 *   Budget | Expected Deadline | Project Description | Lead Status |
 *   Google Drive Folder | Notes
 *
 * `buildSheetRow()` below maps a form payload to that exact column
 * order so the Phase 3 Apps Script can just append the returned array.
 */
export function buildSheetRow(payload) {
  return [
    payload.projectId || "",                 // Project ID (Apps Script assigns the real GA-0001 style ID)
    payload.submissionDate || new Date().toISOString(),
    payload.fullName || "",
    payload.companyName || "",
    payload.email || "",
    payload.phoneNumber || "",
    payload.whatsappNumber || "",
    payload.country || "",
    payload.city || "",
    payload.serviceNeeded || "",
    payload.budgetRange || "",
    payload.expectedDeadline || "",
    payload.projectDescription || "",
    "New",                                    // Lead Status (default for every new submission)
    "",                                        // Google Drive Folder (filled in by Phase 3, see createDriveFolder)
    payload.formSource || ""                   // Notes — which form this came from (public / client-brief)
  ];
}

/**
 * TODO PHASE 3
 * Replace the body of this function with a real fetch() call to your
 * deployed Google Apps Script Web App URL. The Apps Script endpoint
 * should:
 *   1. Generate the next sequential Project ID (GA-0001, GA-0002, ...)
 *      by reading the current row count of the sheet.
 *   2. Append a new row using buildSheetRow(payload).
 *   3. Return { ok: true, projectId: "GA-0001" }.
 *
 * Example of the real implementation (uncomment & fill in when ready):
 *
 *   const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
 *   export async function submitToGoogleSheets(payload) {
 *     const res = await fetch(SHEETS_WEBHOOK_URL, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(payload)
 *     });
 *     return res.json(); // { ok, projectId }
 *   }
 */
export async function submitToGoogleSheets(payload) {
  // No backend yet — resolve locally so the wizard UX works end-to-end.
  console.info("[Phase 3 placeholder] submitToGoogleSheets() called with:", payload);
  return {
    ok: true,
    projectId: null, // Phase 3 Apps Script will return the real GA-0001 style ID
    message: "Stored locally only — Google Sheets not yet connected (Phase 3)."
  };
}

/**
 * TODO PHASE 3
 * The Apps Script Web App (triggered from submitToGoogleSheets on the
 * server side) should call MailApp/GmailApp twice per submission:
 *   1. notifyCompany()  -> send the full lead details to the company inbox.
 *   2. notifyClient()   -> send a short confirmation email to the client.
 * These two client-side stubs exist only so the wizard has a single,
 * obvious place to call from if email is ever triggered client-side
 * instead (e.g. via a transactional email API). Today they are no-ops.
 */
export function notifyCompany(payload) {
  console.info("[Phase 3 placeholder] notifyCompany() would email the team about:", payload.fullName);
}

export function notifyClient(payload) {
  console.info("[Phase 3 placeholder] notifyClient() would send a confirmation email to:", payload.email);
}

/**
 * TODO PHASE 3
 * When a lead is approved, Apps Script should create a Google Drive
 * folder named "<ProjectID> <FullName or CompanyName>" (e.g.
 * "GA-0001 John Doe"), then write the folder URL back into the
 * "Google Drive Folder" column of the same sheet row.
 */
export function createDriveFolder(payload) {
  console.info(
    "[Phase 3 placeholder] createDriveFolder() would create a Drive folder named:",
    `${payload.projectId || "GA-XXXX"} ${payload.companyName || payload.fullName || ""}`.trim()
  );
  return { ok: true, folderUrl: null };
}

/**
 * TEMPORARY client-side reference code shown on the success screen
 * before Phase 3 exists. This is NOT the authoritative Project ID —
 * only the Apps Script (which can see the real row count) may assign
 * the final sequential GA-0001 style ID. We label it clearly as a
 * temporary reference in the UI to avoid implying persistence.
 */
export function generateTempReference() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `TEMP-${rand}`;
}

/* ============================================================
   whatsapp-generator.js
   Builds pre-filled wa.me deep links from form payloads.
   Kept separate from submission logic so the message template
   can evolve independently (e.g. per-service wording later).
   ============================================================ */

export const CONTACTS = {
  sales: "255625794188",
  support: "255797701372"
};

/**
 * Builds the "Continue on WhatsApp" link shown on the success screen.
 * Per spec: message contains the client's name and selected service only
 * (kept short — full details already live in the submission payload /
 * will live in the Google Sheet once Phase 3 is connected).
 */
export function buildProjectWhatsAppLink(payload, contact = "sales") {
  const number = CONTACTS[contact] || CONTACTS.sales;
  const name = payload.fullName || "";
  const service = payload.serviceNeeded || "";
  const ref = payload.projectId ? ` (Ref: ${payload.projectId})` : "";

  const text =
    `Habari GA Istovia! Naitwa ${name}. ` +
    `Ninahitaji msaada wa: ${service}.${ref} ` +
    `Nimejaza fomu ya mradi na ningependa kuendelea.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Generic helper used elsewhere on the site (kept here to avoid duplication). */
export function buildWhatsAppLink(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

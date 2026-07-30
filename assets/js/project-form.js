/* ============================================================
   project-form.js
   Controller for the multi-step "Project Form" wizard used by both
   start-a-project.html (public) and the hidden client-brief page.
   Imports the three focused modules below so each concern stays
   independently testable/replaceable:
     - validation.js          field + step validation
     - whatsapp-generator.js  builds the post-submit wa.me link
     - integrations.js        Phase 3 placeholders (Sheets/Email/Drive/ID)
   ============================================================ */

import { validateStep, clearFieldError } from "./modules/validation.js";
import { buildProjectWhatsAppLink } from "./modules/whatsapp-generator.js";
import {
  submitToGoogleSheets,
  notifyCompany,
  notifyClient,
  createDriveFolder,
  generateTempReference
} from "./modules/integrations.js";

document.addEventListener("DOMContentLoaded", init);

function init() {
  const form = document.getElementById("project-form");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll(".form-step"));
  const progressSteps = Array.from(document.querySelectorAll(".wp-step"));
  const formCard = document.getElementById("form-card-body");
  const successScreen = document.getElementById("success-screen");
  let current = 0;

  updateProgress();

  // Wire Next / Back buttons inside each step
  steps.forEach((step) => {
    const nextBtn = step.querySelector('[data-action="next"]');
    const backBtn = step.querySelector('[data-action="back"]');
    const submitBtn = step.querySelector('[data-action="submit"]');

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        const { valid, firstInvalidEl } = validateStep(step);
        if (!valid) {
          if (firstInvalidEl) firstInvalidEl.focus({ preventScroll: false });
          return;
        }
        goTo(current + 1);
      });
    }
    if (backBtn) {
      backBtn.addEventListener("click", () => goTo(current - 1));
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", handleSubmit);
    }
  });

  // Clear inline errors as the person types/selects (feels premium, not naggy)
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => clearFieldError(el));
    el.addEventListener("change", () => clearFieldError(el));
  });

  function goTo(index) {
    if (index < 0 || index >= steps.length) return;
    steps[current].classList.remove("active");
    steps[index].classList.add("active");
    current = index;
    updateProgress();
    formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgress() {
    progressSteps.forEach((el, i) => {
      el.classList.toggle("active", i === current);
      el.classList.toggle("done", i < current);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const step = steps[current];
    const { valid, firstInvalidEl } = validateStep(step);
    if (!valid) {
      if (firstInvalidEl) firstInvalidEl.focus({ preventScroll: false });
      return;
    }

    const submitBtn = e.currentTarget;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin" aria-hidden="true"></i> Inatuma…';

    const payload = collectPayload(form);

    // ---- PHASE 3 INTEGRATION POINTS (currently no-op placeholders) ----
    const sheetsResult = await submitToGoogleSheets(payload);
    payload.projectId = sheetsResult.projectId || generateTempReference();
    notifyCompany(payload);
    notifyClient(payload);
    createDriveFolder(payload);
    // --------------------------------------------------------------------

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalLabel;

    showSuccess(payload);
  }

  function showSuccess(payload) {
    formCard.style.display = "none";
    document.querySelector(".wizard-progress").style.display = "none";
    successScreen.style.display = "block";
    successScreen.classList.add("reveal", "on");

    const refEl = successScreen.querySelector("[data-success-ref]");
    if (refEl) refEl.textContent = payload.projectId;

    const nameEl = successScreen.querySelector("[data-success-name]");
    if (nameEl) nameEl.textContent = payload.fullName.split(" ")[0] || payload.fullName;

    const waBtn = successScreen.querySelector("[data-success-whatsapp]");
    if (waBtn) waBtn.href = buildProjectWhatsAppLink(payload, "sales");
  }

  function collectPayload(formEl) {
    const get = (name) => {
      const el = formEl.querySelector(`[name="${name}"]`);
      if (!el) return "";
      if (el.type === "radio") {
        const checked = formEl.querySelector(`[name="${name}"]:checked`);
        return checked ? checked.value : "";
      }
      return el.value.trim();
    };

    return {
      fullName: get("fullName"),
      companyName: get("companyName"),
      email: get("email"),
      phoneNumber: get("phoneNumber"),
      whatsappNumber: get("whatsappNumber") || get("phoneNumber"),
      country: get("country"),
      city: get("city"),
      serviceNeeded: get("serviceNeeded"),
      industry: get("industry"),
      budgetRange: get("budgetRange"),
      expectedDeadline: get("expectedDeadline"),
      projectDescription: get("projectDescription"),
      submissionDate: new Date().toISOString(),
      formSource: formEl.dataset.formSource || "public",
      projectId: null
    };
  }
}

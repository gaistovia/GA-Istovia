/* ============================================================
   validation.js
   Reusable field + step validation for the Project Form wizard.
   No dependencies. Pure functions where possible.
   ============================================================ */

export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Loose international phone pattern: allows +, spaces, dashes, 7-15 digits.
  phone: /^[+]?[\d\s-]{7,18}$/
};

/**
 * Validate a single input/select/textarea element based on its
 * `required` attribute, `type`, and any `data-validate="email|phone"` hint.
 * Returns "" when valid, or a human-readable Swahili error message.
 */
export function validateField(el) {
  const value = (el.value || "").trim();
  const isRequired = el.hasAttribute("required");

  if (isRequired && !value) {
    return "Sehemu hii inahitajika.";
  }
  if (!value) return ""; // optional & empty -> valid

  const kind = el.dataset.validate || el.type;

  if (kind === "email" && !patterns.email.test(value)) {
    return "Tafadhali ingiza email sahihi.";
  }
  if (kind === "tel" || kind === "phone") {
    if (!patterns.phone.test(value)) {
      return "Tafadhali ingiza namba sahihi ya simu.";
    }
  }
  if (el.tagName === "SELECT" && value === "") {
    return "Tafadhali chagua chaguo moja.";
  }
  return "";
}

/**
 * Validate every [required] / data-validate field inside a step container.
 * Applies/removes .invalid + inline error text as a side effect, and
 * returns { valid, firstInvalidEl } so the caller can focus/scroll to it.
 */
export function validateStep(stepEl) {
  let valid = true;
  let firstInvalidEl = null;

  const fields = stepEl.querySelectorAll("input, select, textarea");
  fields.forEach((el) => {
    // Radio/checkbox groups: only validate the group once via the fieldset's
    // data-required attribute rather than each individual input.
    if (el.type === "radio" || el.type === "checkbox") return;

    const message = validateField(el);
    const wrapper = el.closest(".field") || el.closest(".choice-pill") || el.parentElement;
    setFieldError(wrapper, el, message);
    if (message && valid) {
      valid = false;
      firstInvalidEl = el;
    }
  });

  // Validate any required radio-pill groups (e.g. Budget Range, Deadline)
  stepEl.querySelectorAll("[data-required-group]").forEach((group) => {
    const name = group.dataset.requiredGroup;
    const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
    const wrapper = group;
    if (!checked) {
      setGroupError(wrapper, "Tafadhali chagua chaguo moja.");
      if (valid) { valid = false; firstInvalidEl = group; }
    } else {
      setGroupError(wrapper, "");
    }
  });

  return { valid, firstInvalidEl };
}

function setFieldError(wrapper, el, message) {
  if (!wrapper) return;
  wrapper.classList.toggle("invalid", Boolean(message));
  let errEl = wrapper.querySelector(".field-error");
  if (!errEl) {
    errEl = document.createElement("div");
    errEl.className = "field-error";
    errEl.innerHTML = '<i class="fas fa-circle-exclamation" aria-hidden="true"></i><span></span>';
    wrapper.appendChild(errEl);
  }
  errEl.querySelector("span").textContent = message;
  el.setAttribute("aria-invalid", message ? "true" : "false");
}

function setGroupError(wrapper, message) {
  wrapper.classList.toggle("invalid", Boolean(message));
  let errEl = wrapper.querySelector(".field-error");
  if (!errEl) {
    errEl = document.createElement("div");
    errEl.className = "field-error";
    errEl.innerHTML = '<i class="fas fa-circle-exclamation" aria-hidden="true"></i><span></span>';
    wrapper.appendChild(errEl);
  }
  errEl.querySelector("span").textContent = message;
}

/** Clears a single field's error state (used on input/change to feel responsive). */
export function clearFieldError(el) {
  const wrapper = el.closest(".field") || el.closest(".choice-pill") || el.parentElement;
  if (wrapper) wrapper.classList.remove("invalid");
}

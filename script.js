/* ============================================================
   MitFloww — Open Layout Javascript Logic
   ============================================================ */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8gLeQT1dU3gMalmJbKCQksVZ8cjNXItnSOU0KixkNlWoYxWSL02uD0FKNUsb-Fs1Z/exec";

const heroSection = document.getElementById("heroSection");
const siteFooter = document.getElementById("siteFooter");
const onboardingFlow = document.getElementById("onboardingFlow");
const successScreen = document.getElementById("successScreen");
const btnJoinWaitlist = document.getElementById("btnJoinWaitlist");
const form = document.getElementById("surveyForm");
const steps = document.querySelectorAll(".step");
const navItems = document.querySelectorAll(".step-item");
const btnBack = document.getElementById("btnBack");
const btnNext = document.getElementById("btnNext");
const btnSubmit = document.getElementById("btnSubmit");
const successContainer = document.getElementById("successContainer");

let currentStep = 1;
const totalSteps = steps.length;

// Initialization
updateUI();

// ─── HERO TO ONBOARDING TRANSITION ───
if(btnJoinWaitlist) {
  btnJoinWaitlist.addEventListener("click", () => {
    heroSection.classList.add("fade-out");
    siteFooter.classList.add("fade-out");
    setTimeout(() => {
      heroSection.style.display = "none";
      siteFooter.style.display = "none";
      onboardingFlow.style.display = "flex";
      // Force reflow for transition
      void onboardingFlow.offsetWidth;
      onboardingFlow.classList.add("fade-in");
    }, 350);
  });
}

// ─── NAVIGATION HANDLERS ───
btnNext.addEventListener("click", () => {
  if (validateCurrentStep()) {
    goToStep(currentStep + 1);
  }
});

btnBack.addEventListener("click", () => {
  goToStep(currentStep - 1);
});

// Watch inputs to enable/disable Next button in real-time
form.addEventListener("input", toggleNextButtonState);
form.addEventListener("change", (e) => {
  toggleNextButtonState();
  handleConditionalLogic(e);
});

const step2Conditional = document.getElementById("step2Conditional");
const otherInputWrapper = document.getElementById("otherInputWrapper");
const currentSolutionCheckboxes = form.querySelectorAll('input[name="current_solution[]"]');
const solutionOtherText = form.querySelector('#solutionOtherText');
const otherTextCounter = document.getElementById('otherTextCounter');
const MAX_OTHER_CHARS = 80;

solutionOtherText.addEventListener('input', () => {
  const currentLength = solutionOtherText.value.length;
  otherTextCounter.textContent = `${currentLength}/${MAX_OTHER_CHARS}`;
  
  if (currentLength >= MAX_OTHER_CHARS) {
    otherTextCounter.classList.add('limit-reached');
  } else {
    otherTextCounter.classList.remove('limit-reached');
  }
});

function handleConditionalLogic(e) {
  // Step 2 main logic
  if (e.target.name === "payment_issue_frequency") {
    if (e.target.value === "Never") {
      step2Conditional.classList.remove("open");
      // Clear selections visually
      currentSolutionCheckboxes.forEach(cb => cb.checked = false);
      otherInputWrapper.classList.remove("open");
      solutionOtherText.value = "";
      otherTextCounter.textContent = `0/${MAX_OTHER_CHARS}`;
      otherTextCounter.classList.remove('limit-reached');
    } else {
      step2Conditional.classList.add("open");
    }
  }

  // "Other" checkbox logic
  if (e.target.id === "solutionOther") {
    if (e.target.checked) {
      otherInputWrapper.classList.add("open");
    } else {
      otherInputWrapper.classList.remove("open");
      solutionOtherText.value = "";
      otherTextCounter.textContent = `0/${MAX_OTHER_CHARS}`;
      otherTextCounter.classList.remove('limit-reached');
    }
  }
}

function goToStep(newStep) {
  if (newStep < 1 || newStep > totalSteps) return;

  const currentEl = document.querySelector(`.step[data-step="${currentStep}"]`);
  const nextEl = document.querySelector(`.step[data-step="${newStep}"]`);

  // Transition classes
  currentEl.classList.remove("active");
  if (newStep > currentStep) {
    currentEl.classList.add("exit-left");
    nextEl.classList.remove("exit-right", "exit-left");
  } else {
    currentEl.classList.add("exit-right");
    nextEl.classList.remove("exit-right", "exit-left");
  }
  
  // Allow microscopic delay for DOM before adding active
  setTimeout(() => {
    nextEl.classList.add("active");
  }, 20);

  currentStep = newStep;
  updateUI();
}

function updateUI() {
  // Update Stepper visually
  navItems.forEach((item, index) => {
    const stepNum = index + 1;
    item.classList.remove("active", "completed");
    
    if (stepNum === currentStep) {
      item.classList.add("active");
    } else if (stepNum < currentStep) {
      item.classList.add("completed");
    }
  });

  // Buttons display
  btnBack.style.visibility = currentStep === 1 ? "hidden" : "visible";

  if (currentStep === totalSteps) {
    btnNext.style.display = "none";
    btnSubmit.style.display = "inline-flex";
  } else {
    btnNext.style.display = "inline-flex";
    btnSubmit.style.display = "none";
  }

  // Validate immediately to set button state
  toggleNextButtonState();
}

// ─── VALIDATION ───
function toggleNextButtonState() {
  const isValid = validateCurrentStep(true); // silent validation
  btnNext.disabled = !isValid;
  btnSubmit.disabled = !isValid;
}

function validateCurrentStep(silent = false) {
  const stepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
  
  if (currentStep === 1) {
    const email = stepEl.querySelector('#email').value.trim();
    const role = stepEl.querySelector('#role').value;
    const exp = stepEl.querySelector('#experience').value;
    
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    
    if (!email || !emailRegex.test(email) || !role || !exp) valid = false;
    
    if (!silent && !valid) {
      if (!email || !emailRegex.test(email)) highlightError(stepEl.querySelector('#email'));
      if (!role) highlightError(stepEl.querySelector('#role'));
      if (!exp) highlightError(stepEl.querySelector('#experience'));
    }
    return valid;
  }

  if (currentStep === 2) {
    const checked = stepEl.querySelector('input[type="radio"]:checked');
    return !!checked;
  }

  if (currentStep === 3) {
    const checked = stepEl.querySelectorAll('input[type="checkbox"]:checked');
    return checked.length > 0;
  }

  if (currentStep === 4) {
    const checked = stepEl.querySelector('input[type="radio"]:checked');
    return !!checked;
  }

  if (currentStep === 5) {
    const checked = stepEl.querySelectorAll('input[type="checkbox"]:checked');
    return checked.length > 0;
  }

  return true;
}

function highlightError(element) {
  element.style.borderColor = "#EF4444";
  const handler = () => {
    element.style.borderColor = "";
    element.removeEventListener("input", handler);
    element.removeEventListener("change", handler);
  };
  element.addEventListener("input", handler);
  element.addEventListener("change", handler);
}

// ─── DATA COLLECTION & SUBMISSION ───
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateCurrentStep()) return;

  const data = collectFormData();
  setLoading(true);

  try {
    // Send as text/plain to avoid CORS preflight block
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(data),
    });

    showSuccess();
  } catch (err) {
    console.error("Submission error:", err);
    alert("Something went wrong connecting to the server. Please try again.");
    setLoading(false);
  }
});

function collectFormData() {
  const data = {};
  data.email = form.email.value.trim();
  data.role = form.role.value;
  data.experience = form.experience.value;
  
  const freq = form.querySelector('input[name="payment_issue_frequency"]:checked');
  data.payment_issue_frequency = freq ? freq.value : "";
  
  const use = form.querySelector('input[name="would_use"]:checked');
  data.would_use = use ? use.value : "";

  data.problems = Array.from(form.querySelectorAll('input[name="problems[]"]:checked')).map(cb => cb.value);
  data.features = Array.from(form.querySelectorAll('input[name="features[]"]:checked')).map(cb => cb.value);

  // Collect conditional data
  const solutions = Array.from(form.querySelectorAll('input[name="current_solution[]"]:checked')).map(cb => cb.value);
  if (solutions.includes("Other")) {
    const otherText = form.solutionOtherText.value.trim();
    if (otherText) solutions.push(`Other: ${otherText}`);
  }
  data.current_solution = solutions;

  return data;
}

function setLoading(isLoading) {
  btnSubmit.disabled = isLoading;
  btnBack.disabled = isLoading;
  const btnText = btnSubmit.querySelector(".btn-text");
  const btnLoader = btnSubmit.querySelector(".btn-loader");
  
  if (btnText && btnLoader) {
    btnText.style.display = isLoading ? "none" : "";
    btnLoader.style.display = isLoading ? "inline-flex" : "none";
  }
}

function showSuccess() {
  onboardingFlow.style.display = "none";
  successScreen.style.display = "flex";

  // Force reflow
  void successScreen.offsetWidth;
  successScreen.classList.add("fade-in");

  // Retrigger Footer
  siteFooter.style.display = "block";
  void siteFooter.offsetWidth;
  siteFooter.classList.remove("fade-out");
}

// ─── REFERRAL LOGIC (MINIMAL) ───
const shareText = `Tired of chasing clients for payment?\n\nThis tool makes them pay before accessing files:\nhttps://mitfloww.com`;

const btnShareNative = document.getElementById("btnShareNative");
if (btnShareNative) {
  btnShareNative.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MitFloww",
          text: shareText
        });
      } catch (err) {
        // User aborted or failed
      }
    } else {
      // Fallback to WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  });
}

const btnCopyLink = document.getElementById("btnCopyLink");
const copyTooltip = document.getElementById("copyTooltip");

if (btnCopyLink && copyTooltip) {
  btnCopyLink.addEventListener("click", () => {
    navigator.clipboard.writeText(shareText).then(() => {
      copyTooltip.classList.add("show");
      
      setTimeout(() => {
        copyTooltip.classList.remove("show");
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy snippet:", err);
    });
  });
}

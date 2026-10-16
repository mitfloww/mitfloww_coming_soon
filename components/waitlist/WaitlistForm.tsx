"use client";

import { useEffect } from "react";
import { useTheme } from "@/lib/theme";
import { initWaitlist } from "./initWaitlist";

function ThemeButton() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      className="prereg-theme"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
      onClick={toggle}
    >
      <svg className="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" /></svg>
      <svg className="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>
    </button>
  );
}

/**
 * The waitlist survey. Markup is identical to the former /preregister/ page;
 * the original form logic (steps, validation, submission) runs from initWaitlist.
 */
export function WaitlistForm() {
  useEffect(() => initWaitlist(), []);

  return (
    <>
      {/* ─── TOP BAR: home link + theme toggle ─── */}
      <div className="prereg-bar">
        <a href="/" className="prereg-bar__home" aria-label="MitFloww home">
          <img className="logo--on-light" src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-black-wordmark.svg" alt="MitFloww" width="128" height="24" />
          <img className="logo--on-dark" src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-white-wordmark.svg" alt="MitFloww" width="128" height="24" />
        </a>
        <ThemeButton />
      </div>

      {/* ─── ONBOARDING FLOW ─── */}
      <div className="onboarding-layout" id="onboardingFlow">

        {/* ─── LEFT SIDEBAR (STEPPER) ─── */}
        <aside className="stepper-sidebar">
          <a href="/" className="brand-link" aria-label="MitFloww home">
            <img src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-black-wordmark.svg" alt="MitFloww.com" className="brand-logo logo--on-light" width="128" height="24" />
            <img src="/assets/logo/SVG/horizontal/mitfloww-logo-horizontal-color-white-wordmark.svg" alt="MitFloww.com" className="brand-logo logo--on-dark" width="128" height="24" />
          </a>

          <div className="vertical-stepper" id="stepper">
            <div className="step-item active" data-nav="1">
              <div className="step-marker">1</div>
              <div className="step-line"></div>
            </div>
            <div className="step-item" data-nav="2">
              <div className="step-marker">2</div>
              <div className="step-line"></div>
            </div>
            <div className="step-item" data-nav="3">
              <div className="step-marker">3</div>
              <div className="step-line"></div>
            </div>
            <div className="step-item" data-nav="4">
              <div className="step-marker">4</div>
              <div className="step-line"></div>
            </div>
            <div className="step-item" data-nav="5">
              <div className="step-marker">5</div>
            </div>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="onboarding-main">
          <h1 className="visually-hidden">Join the MitFloww waitlist: get paid before you deliver</h1>
          <h2 className="visually-hidden">Secure file sharing with payment protection for freelancers</h2>
          <p className="visually-hidden">
            Built for designers, developers, video editors, and freelancers who want to get paid before delivering files.
            Some users search for <a href="/blog/mitflow.html">MitFlow</a>, which refers to MitFloww.
          </p>
          <form id="surveyForm" noValidate>

            <div className="steps-wrapper">

              {/* STEP 1: Basic Info */}
              <div className="step active" data-step="1">
                <h2 className="question-title">Let's set up your profile</h2>
                <p className="question-subtext">Tell us a bit about who you are.</p>

                <div className="input-stack">
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="you@example.com" required />
                  </div>

                  <div className="field">
                    <label htmlFor="role">What kind of work do you do?</label>
                    <select id="role" name="role" required defaultValue="">
                      <option value="" disabled>Select your role</option>
                      <option value="Freelance Designer">Freelance Designer</option>
                      <option value="Freelance Developer">Freelance Developer</option>
                      <option value="Video Editor / Motion Designer">Video Editor / Motion Designer</option>
                      <option value="Photographer">Photographer</option>
                      <option value="Writer / Copywriter">Writer / Copywriter</option>
                      <option value="Social Media Manager">Social Media Manager</option>
                      <option value="Agency Owner">Agency Owner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="experience">How experienced are you?</label>
                    <select id="experience" name="experience" required defaultValue="">
                      <option value="" disabled>Select experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1–3 years">1–3 years</option>
                      <option value="3–5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 2: Issue Frequency */}
              <div className="step" data-step="2">
                <h2 className="question-title">How often do you finish work and then struggle to get paid?</h2>
                <div className="options-pills">
                  <label className="pill-label">
                    <input type="radio" name="payment_issue_frequency" value="Very often" required />
                    Very often
                  </label>
                  <label className="pill-label">
                    <input type="radio" name="payment_issue_frequency" value="Sometimes" />
                    Sometimes
                  </label>
                  <label className="pill-label">
                    <input type="radio" name="payment_issue_frequency" value="Rarely" />
                    Rarely
                  </label>
                  <label className="pill-label">
                    <input type="radio" name="payment_issue_frequency" value="Never" />
                    Never
                  </label>
                </div>

                {/* CONDITIONAL SUB-SECTION */}
                <div className="conditional-wrapper" id="step2Conditional">
                  <div className="conditional-inner">
                    <h3 className="question-subtitle">How do you currently handle this?</h3>
                    <div className="options-pills options-small">
                      <label className="pill-label">
                        <input type="checkbox" name="current_solution[]" value="Watermark before delivery" />
                        Watermark before delivery
                      </label>
                      <label className="pill-label">
                        <input type="checkbox" name="current_solution[]" value="Advance payment" />
                        Advance payment
                      </label>
                      <label className="pill-label">
                        <input type="checkbox" name="current_solution[]" value="Trust-based (no protection)" />
                        Trust-based (no protection)
                      </label>
                      <label className="pill-label">
                        <input type="checkbox" name="current_solution[]" value="Using platforms (Fiverr, Upwork, etc.)" />
                        Using platforms (Fiverr, Upwork, etc.)
                      </label>
                      <label className="pill-label">
                        <input type="checkbox" name="current_solution[]" value="Other" id="solutionOther" />
                        Other
                      </label>
                    </div>

                    {/* Other text input */}
                    <div className="conditional-wrapper" id="otherInputWrapper">
                      <div className="conditional-inner">
                        <div className="other-input-field mt-4">
                          <div className="input-with-counter">
                            <input type="text" id="solutionOtherText" name="solutionOtherText" placeholder="Please specify..." maxLength={80} />
                            <span className="char-counter" id="otherTextCounter">0/80</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 3: Problems */}
              <div className="step" data-step="3">
                <h2 className="question-title">What problems do you face?</h2>
                <p className="question-subtext">Select all that apply.</p>
                <div className="options-pills">
                  <label className="pill-label">
                    <input type="checkbox" name="problems[]" value="Delayed payments" />
                    Delayed payments
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="problems[]" value="No payment after delivery" />
                    No payment after delivery
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="problems[]" value="Too many revisions without extra pay" />
                    Too many revisions without extra pay
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="problems[]" value="Scope creep" />
                    Scope creep
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="problems[]" value="Payment disputes" />
                    Payment disputes
                  </label>
                </div>
              </div>

              {/* STEP 4: Would use? */}
              <div className="step" data-step="4">
                <h2 className="question-title">If clients had to pay before accessing your files, would you use it?</h2>
                <div className="options-pills">
                  <label className="pill-label">
                    <input type="radio" name="would_use" value="Yes, 100%" required />
                    Yes, 100%
                  </label>
                  <label className="pill-label">
                    <input type="radio" name="would_use" value="Maybe" />
                    Maybe
                  </label>
                  <label className="pill-label">
                    <input type="radio" name="would_use" value="No" />
                    No
                  </label>
                </div>
              </div>

              {/* STEP 5: Features */}
              <div className="step" data-step="5">
                <h2 className="question-title">What would you want most?</h2>
                <p className="question-subtext">Select all that apply.</p>
                <div className="options-pills">
                  <label className="pill-label">
                    <input type="checkbox" name="features[]" value="Secure file sharing" />
                    Secure file sharing
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="features[]" value="Payment lock before download" />
                    Payment lock before download
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="features[]" value="Limited revisions system" />
                    Limited revisions system
                  </label>
                  <label className="pill-label">
                    <input type="checkbox" name="features[]" value="Client approval workflow" />
                    Client approval workflow
                  </label>
                </div>
              </div>

            </div> {/* /.steps-wrapper */}

            <footer className="onboarding-footer">
              <button type="button" className="btn btn-ghost" id="btnBack">Back</button>

              <button type="button" className="btn btn-primary" id="btnNext">Continue</button>
              <button type="submit" className="btn btn-primary" id="btnSubmit" style={{ display: "none" }}>
                <span className="btn-text">Submit</span>
                <span className="btn-loader" style={{ display: "none" }}>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </span>
              </button>
            </footer>
          </form>

        </main>
      </div>

      {/* ─── SUCCESS SCREEN ─── */}
      <section className="success-screen" id="successScreen" style={{ display: "none" }}>
        <div className="success-content">
          <div className="success-main">
            <img src="/assets/icon.png" alt="MitFloww Icon" className="hero-icon" />
            <h2 className="hero-title">You're on the MitFloww wishlist</h2>
            <p className="hero-subtitle">We'll notify you when early access opens.</p>
          </div>

          <div className="referral-section minimal">
            <hr className="referral-divider" />
            <p className="referral-hint">Help others stop chasing payments</p>
            <div className="referral-actions-minimal">
              <button type="button" id="btnShareNative" className="icon-btn" aria-label="Share">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </button>
              <div className="tooltip-wrapper">
                <button type="button" id="btnCopyLink" className="icon-btn" aria-label="Copy Link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
                <span className="tooltip-text" id="copyTooltip">Copied</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="site-footer" id="siteFooter" style={{ display: "none" }}>
        <p>
          © 2026 MitFloww • All rights reserved • 
          <a href="/what-is-mitfloww.html" className="footer-link">About</a> •
          <a href="/blog/" className="footer-link">Blog</a> •
          <a href="/mitfloww-review.html" className="footer-link">Review</a>
        </p>
      </footer>


    </>
  );
}

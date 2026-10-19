import '../css/style.css';

/**
 * GHAR SE GROWTH - INTERACTIVE APPLICATION LOGIC
 * Includes Dynamic GST Calculator, Modal Flow, Pathway Quiz, Countdown, & FAQs.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pricing Constants
  const WORKSHOP_BASE = 497.00;
  const TOOLKIT_BASE = 297.00;
  const GST_RATE = 0.18;

  // State
  let hasToolkitAddon = false;
  let selectedBatch = 'Saturday 11:00 AM IST';

  // DOM Elements - Modal & Booking
  const registrationModal = document.getElementById('registrationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalStep1 = document.getElementById('modalStep1');
  const modalStep2 = document.getElementById('modalStep2');
  const registrationForm = document.getElementById('registrationForm');
  const modalToolkitAddon = document.getElementById('modalToolkitAddon');
  const pageToolkitCheckbox = document.getElementById('pageToolkitCheckbox');

  // Breakdown Displays
  const toolkitBreakdownRow = document.getElementById('toolkitBreakdownRow');
  const subtotalDisplay = document.getElementById('subtotalDisplay');
  const gstDisplay = document.getElementById('gstDisplay');
  const totalPayableDisplay = document.getElementById('totalPayableDisplay');

  // Batch Selectors
  const batchCards = document.querySelectorAll('.batch-radio-card');

  // Site Header & Mobile Bar
  const siteHeader = document.getElementById('siteHeader');
  const stickyMobileBar = document.getElementById('stickyMobileBar');

  // FAQs
  const faqItems = document.querySelectorAll('.faq-item');

  // Legal Modal
  const legalModal = document.getElementById('legalModal');
  const legalCloseBtn = document.getElementById('legalCloseBtn');
  const legalModalTitle = document.getElementById('legalModalTitle');
  const legalModalContent = document.getElementById('legalModalContent');

  /* ==========================================================================
     1. DYNAMIC PRICING & GST BREAKDOWN CALCULATOR
     ========================================================================== */
  function updatePricing() {
    const subtotal = WORKSHOP_BASE + (hasToolkitAddon ? TOOLKIT_BASE : 0);
    const gst = subtotal * GST_RATE;
    const total = subtotal + gst;

    if (toolkitBreakdownRow) {
      toolkitBreakdownRow.style.display = hasToolkitAddon ? 'flex' : 'none';
    }

    if (subtotalDisplay) subtotalDisplay.textContent = `₹${subtotal.toFixed(2)}`;
    if (gstDisplay) gstDisplay.textContent = `₹${gst.toFixed(2)}`;
    if (totalPayableDisplay) totalPayableDisplay.textContent = `₹${total.toFixed(2)}`;

    // Sync checkboxes
    if (modalToolkitAddon) modalToolkitAddon.checked = hasToolkitAddon;
    if (pageToolkitCheckbox) pageToolkitCheckbox.checked = hasToolkitAddon;
  }

  if (modalToolkitAddon) {
    modalToolkitAddon.addEventListener('change', (e) => {
      hasToolkitAddon = e.target.checked;
      updatePricing();
    });
  }

  if (pageToolkitCheckbox) {
    pageToolkitCheckbox.addEventListener('change', (e) => {
      hasToolkitAddon = e.target.checked;
      updatePricing();
    });
  }

  // Batch Selection Radio Handling
  batchCards.forEach(card => {
    card.addEventListener('click', () => {
      batchCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedBatch = radio.value;
      }
    });
  });

  /* ==========================================================================
     2. MODAL OPEN / CLOSE & STEP FLOW
     ========================================================================== */
  function openModal() {
    if (!registrationModal) return;
    updatePricing();
    registrationModal.classList.add('open');
    registrationModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!registrationModal) return;
    registrationModal.classList.remove('open');
    registrationModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal on all CTA triggers
  document.querySelectorAll('[data-open-modal="true"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  registrationModal.addEventListener('click', (e) => {
    if (e.target === registrationModal) {
      closeModal();
    }
  });

  // Handle Form Submission
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const phoneInput = document.getElementById('userWhatsapp');
      const emailInput = document.getElementById('userEmail');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      // Validate Phone (10 digits)
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        phoneInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        phoneInput.parentElement.classList.remove('has-error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      if (!isValid) return;

      // Simulate Successful Payment & Transition to Step 2
      const proceedBtn = document.getElementById('proceedToPayBtn');
      const originalText = proceedBtn.innerHTML;
      proceedBtn.innerHTML = `<span>Processing Secure Order...</span>`;
      proceedBtn.disabled = true;

      setTimeout(() => {
        proceedBtn.innerHTML = originalText;
        proceedBtn.disabled = false;

        // Populate Confirmation Screen
        const confirmedUserName = document.getElementById('confirmedUserName');
        const confirmedBatch = document.getElementById('confirmedBatch');
        const confirmedAmount = document.getElementById('confirmedAmount');
        const confirmedToolkit = document.getElementById('confirmedToolkit');

        const finalSubtotal = WORKSHOP_BASE + (hasToolkitAddon ? TOOLKIT_BASE : 0);
        const finalTotal = finalSubtotal * (1 + GST_RATE);

        if (confirmedUserName) confirmedUserName.textContent = nameInput.value.trim();
        if (confirmedBatch) confirmedBatch.textContent = selectedBatch;
        if (confirmedAmount) confirmedAmount.textContent = `₹${finalTotal.toFixed(2)} (incl. GST)`;
        if (confirmedToolkit) confirmedToolkit.textContent = hasToolkitAddon ? 'Yes — Starter Toolkit Included (+₹297)' : 'No (Core Workshop Only)';

        modalStep1.style.display = 'none';
        modalStep2.style.display = 'block';

        // Trigger celebratory toast
        showToast(`🎉 Registration confirmed for ${nameInput.value.trim()}! Check WhatsApp.`);
      }, 900);
    });
  }

  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      closeModal();
      // Reset back to Step 1 for next view
      setTimeout(() => {
        if (modalStep1) modalStep1.style.display = 'block';
        if (modalStep2) modalStep2.style.display = 'none';
        if (registrationForm) registrationForm.reset();
        hasToolkitAddon = false;
        updatePricing();
      }, 400);
    });
  }

  /* ==========================================================================
     3. FAQ ACCORDION LOGIC
     ========================================================================== */
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for clean, uncluttered accordion
      faqItems.forEach(i => {
        i.classList.remove('active');
        const btn = i.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ==========================================================================
     4. INTERACTIVE PATHWAY DISCOVERY TOOL
     ========================================================================== */
  const roleSelect = document.getElementById('userRoleSelect');
  const skillSelect = document.getElementById('userSkillSelect');
  const hoursSelect = document.getElementById('userHoursSelect');

  const quizPathTitle = document.getElementById('quizPathTitle');
  const quizPathDesc = document.getElementById('quizPathDesc');

  const pathwayData = {
    organization: {
      title: "Remote Business Support & Operations Coordination",
      desc: "Your organization and scheduling ability paired with reliable availability makes you ideal for remote business operations, inbox management, and executive client support for busy founders and consulting firms."
    },
    writing: {
      title: "Content & Communications Specialist for Growing Brands",
      desc: "Strong written communication is one of the highest-demand remote services. You can help SMBs, authors, and founders write clear email newsletters, LinkedIn post drafts, and website copy."
    },
    teaching: {
      title: "Specialised Online Tutoring & Micro-Course Mentoring",
      desc: "Your talent for breaking down complex topics into simple steps allows you to offer premium 1-on-1 tutoring, language coaching, or workshops for children or adults from home."
    },
    accounts: {
      title: "Bookkeeping & Financial Administration for Solopreneurs",
      desc: "Thousands of independent business owners struggle with invoice reconciliation, basic spreadsheet tracking, and monthly expense categorization—a perfect recurring monthly retainer model."
    },
    design: {
      title: "Visual Asset Design & Brand Presentation Specialist",
      desc: "Creating polished social graphics, pitch decks, and workbooks using Canva or modern design tools provides an immediate, visual service that clients gladly pay for on a project basis."
    }
  };

  function updateQuizPathway() {
    if (!skillSelect || !quizPathTitle || !quizPathDesc) return;
    const skill = skillSelect.value;
    const match = pathwayData[skill] || pathwayData.organization;
    quizPathTitle.textContent = match.title;
    quizPathDesc.textContent = match.desc;
  }

  if (roleSelect) roleSelect.addEventListener('change', updateQuizPathway);
  if (skillSelect) skillSelect.addEventListener('change', updateQuizPathway);
  if (hoursSelect) hoursSelect.addEventListener('change', updateQuizPathway);

  /* ==========================================================================
     5. COUNTDOWN TIMER TO NEXT LIVE SESSION
     ========================================================================== */
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  // Target upcoming Saturday 11:00 AM IST
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + ((6 - targetDate.getDay() + 7) % 7 || 7));
  targetDate.setHours(11, 0, 0, 0);

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (cdDays) cdDays.textContent = '00';
      if (cdHours) cdHours.textContent = '00';
      if (cdMins) cdMins.textContent = '00';
      if (cdSecs) cdSecs.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(d).padStart(2, '0');
    if (cdHours) cdHours.textContent = String(h).padStart(2, '0');
    if (cdMins) cdMins.textContent = String(m).padStart(2, '0');
    if (cdSecs) cdSecs.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ==========================================================================
     6. SCROLL LISTENER (HEADER SHADOW & MOBILE STICKY BAR)
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header styling
    if (siteHeader) {
      if (scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Sticky mobile bar
    if (stickyMobileBar) {
      if (scrollY > 450) {
        stickyMobileBar.classList.add('visible');
      } else {
        stickyMobileBar.classList.remove('visible');
      }
    }
  });

  /* ==========================================================================
     7. TOAST NOTIFICATIONS & SOCIAL PROOF SIMULATOR
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Realistic Social Proof Notifications every 25 seconds
  const socialProofs = [
    "Pooja from Pune just reserved a seat (Saturday batch)",
    "Ananya from Bengaluru added the Starter Toolkit",
    "Kavita from Jaipur booked for this weekend",
    "Deepa from Delhi registered for the Clarity Workshop",
    "Meenakshi from Hyderabad reserved a workshop seat"
  ];

  let proofIndex = 0;
  setInterval(() => {
    if (Math.random() > 0.3) {
      showToast(`⚡ ${socialProofs[proofIndex % socialProofs.length]}`);
      proofIndex++;
    }
  }, 22000);

  /* ==========================================================================
     8. LEGAL & TRANSPARENCY MODALS
     ========================================================================== */
  const legalTexts = {
    terms: {
      title: "Terms & Conditions",
      html: `
        <p>Welcome to Ghar Se Growth. By registering for this workshop or purchasing any related materials, you agree to the following terms and conditions:</p>
        <h4>Educational Nature of the Workshop</h4>
        <p>This is strictly an educational workshop designed to share business frameworks, evaluation tools, and research strategies. Ghar Se Growth does not offer jobs, employment contracts, client placements, or commercial representation.</p>
        <h4>Intellectual Property</h4>
        <p>All training frameworks, presentations, worksheets, and templates provided are the intellectual property of Ghar Se Growth and Ranu Patel. They are provided solely for personal implementation by the registered attendee and may not be redistributed, resold, or reproduced.</p>
      `
    },
    privacy: {
      title: "Privacy Policy",
      html: `
        <p>We respect your privacy and protect your personal information in accordance with Indian IT standards and applicable data protection practices.</p>
        <h4>Information Collection</h4>
        <p>We collect your name, email address, WhatsApp number, and selected workshop preferences exclusively to deliver workshop access links, calendar invites, and course materials.</p>
        <h4>No Third-Party Sharing</h4>
        <p>We do not sell, rent, or trade your contact information with external marketers or advertising networks. You may unsubscribe or request data deletion at any time by contacting support@gharsegrowth.com.</p>
      `
    },
    refund: {
      title: "Refund & Cancellation Policy",
      html: `
        <h4>Clear & Fair Refund Guidelines</h4>
        <p>We believe in honest and transparent business practices:</p>
        <ul>
          <li><strong>Pre-Session Cancellation:</strong> You are eligible for a 100% refund of your workshop fee if you request cancellation via email at least 2 hours before the scheduled live session starts.</li>
          <li><strong>Emergency Batch Reschedule:</strong> If you are unable to attend due to unforeseen family or health commitments, contact us and we will transfer your registration to the next upcoming live batch at zero additional charge.</li>
          <li><strong>Post-Session Policy:</strong> Once the live Zoom session begins or recorded materials are delivered, registrations are non-refundable.</li>
        </ul>
      `
    },
    disclaimer: {
      title: "Earnings & Results Disclaimer",
      html: `
        <h4>Ethical Income Disclosure</h4>
        <p>Please read this carefully before registering:</p>
        <p>Any references to potential earnings, past earnings, or hypothetical revenues (such as ₹50,000 per month or higher) are illustrative examples based on professional business models. They are <strong>NOT guarantees</strong> or promises of what you will earn.</p>
        <p>Building an independent business from home requires dedicated effort, real-world customer research, continuous skill refinement, and market demand. Your individual results will depend on your skills, experience, execution, pricing, and external market factors.</p>
      `
    }
  };

  function openLegal(key) {
    if (!legalModal || !legalTexts[key]) return;
    legalModalTitle.textContent = legalTexts[key].title;
    legalModalContent.innerHTML = legalTexts[key].html;
    legalModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLegal() {
    if (!legalModal) return;
    legalModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  const openTermsLink = document.getElementById('openTermsLink');
  const openPrivacyLink = document.getElementById('openPrivacyLink');
  const openRefundLink = document.getElementById('openRefundLink');
  const openDisclaimerLink = document.getElementById('openDisclaimerLink');

  if (openTermsLink) openTermsLink.addEventListener('click', (e) => { e.preventDefault(); openLegal('terms'); });
  if (openPrivacyLink) openPrivacyLink.addEventListener('click', (e) => { e.preventDefault(); openLegal('privacy'); });
  if (openRefundLink) openRefundLink.addEventListener('click', (e) => { e.preventDefault(); openLegal('refund'); });
  if (openDisclaimerLink) openDisclaimerLink.addEventListener('click', (e) => { e.preventDefault(); openLegal('disclaimer'); });

  if (legalCloseBtn) legalCloseBtn.addEventListener('click', closeLegal);
  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegal();
    });
  }

  // Keyboard accessibility (ESC to close modals)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeLegal();
    }
  });

  // Initialize Pricing
  updatePricing();
});

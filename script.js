/**
 * MR & MRS DESIGNER STUDIO — Interactive Atelier System
 * Architecture: Mobile-First, Touch-Optimized (UI-UX Pro Max), Anti-Slop (Hallmark / Taste-Skill).
 * Modules: Saree Drape Simulator, Atelier Cost Estimator, Filterable Lookbook, Lightbox Modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoPersistence();
  initDynamicIsland();
  initDrapeSimulator();
  initAtelierEstimator();
  initLookbookFilter();
  initLightboxModal();
  initMobileDrawer();
  initFaqAccordion();
  initConsultationForm();
  initStickyBottomBar();
  initScrollAnimations();
});

/* ==========================================================================
   0. Dynamic Island Header Floating Scroll & User State
   ========================================================================== */
function initDynamicIsland() {
  const island = document.getElementById('dynamicIslandHeader');
  if (island) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        island.classList.add('scrolled');
      } else {
        island.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Check if a client user is logged in
  if (window.StudioDatabase && typeof window.StudioDatabase.getCurrentUser === 'function') {
    const user = window.StudioDatabase.getCurrentUser();
    if (user && user.name) {
      const authLinks = document.querySelectorAll('.island-auth-link[aria-label="Client Sign In"]');
      authLinks.forEach(link => {
        link.title = `Signed in as ${user.name}`;
        link.style.borderColor = 'var(--gold-zari)';
        link.style.background = 'rgba(197, 160, 89, 0.15)';
      });
    }
  }
}

/* ==========================================================================
   1. Interactive Saree Drape Simulator
   ========================================================================== */
function initDrapeSimulator() {
  const drapeButtons = document.querySelectorAll('.drape-btn');
  const titleEl = document.getElementById('drape-title');
  const descEl = document.getElementById('drape-desc');
  const timeBadgeEl = document.getElementById('drape-time-badge');
  const traditionalTimeEl = document.getElementById('drape-trad-time');
  const atelierTimeEl = document.getElementById('drape-atelier-time');

  const drapeData = {
    'nivi': {
      title: 'Classic Nivi Accordion Drape',
      time: 'Ready in 90 Seconds',
      tradTime: '35 - 45 Mins',
      atelierTime: '1.5 Mins',
      description: 'The definitive Indian silhouette. Seven razor-sharp 5-inch pleats anchored at the navel with a sweeping shoulder pallu. Ideal for weddings, formal receptions, and celebrations.'
    },
    'gujarati': {
      title: 'Royal Gujarati Seedha Pallu',
      time: 'Ready in 2 Minutes',
      tradTime: '40 - 50 Mins',
      atelierTime: '2 Mins',
      description: 'The pallu is draped from back to front over the right shoulder, fanning out across the bodice to showcase heavy zari borders and intricate woven brocade artwork.'
    },
    'mermaid': {
      title: 'Sculpted Bridal Mermaid Drape',
      time: 'Ready in 2 Minutes',
      tradTime: '45 - 60 Mins',
      atelierTime: '2 Mins',
      description: 'A contemporary hourglass drape fitted snugly across the waist and hips, flaring into dramatic lower pleats. Popular for modern brides and sangeet evenings.'
    },
    'boxpleat': {
      title: 'Heritage Temple Box-Pleat',
      time: 'Ready in 90 Seconds',
      tradTime: '40 - 50 Mins',
      atelierTime: '1.5 Mins',
      description: 'Symmetrical double-faced box pleats calibrated specifically for heavyweight Kanchipuram and Banarasi silks to ensure flat, bulk-free waistlines.'
    }
  };

  drapeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      drapeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const styleKey = btn.getAttribute('data-style');
      const data = drapeData[styleKey] || drapeData['nivi'];

      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.description;
      if (timeBadgeEl) timeBadgeEl.textContent = data.time;
      if (traditionalTimeEl) traditionalTimeEl.textContent = data.tradTime;
      if (atelierTimeEl) atelierTimeEl.textContent = data.atelierTime;
    });
  });
}

/* ==========================================================================
   2. Atelier Cost & Turnaround Estimator
   ========================================================================== */
function initAtelierEstimator() {
  const serviceRadios = document.querySelectorAll('input[name="est-service"]');
  const complexitySelect = document.getElementById('est-complexity');
  const quantityInput = document.getElementById('est-quantity');
  const speedRadios = document.querySelectorAll('input[name="est-speed"]');
  
  const estAmountEl = document.getElementById('est-amount-val');
  const estTimeEl = document.getElementById('est-time-val');
  const sumServiceEl = document.getElementById('sum-service-val');
  const sumComplexityEl = document.getElementById('sum-complexity-val');
  const sumQtyEl = document.getElementById('sum-qty-val');
  const sumSpeedEl = document.getElementById('sum-speed-val');
  const consultQuoteBtn = document.getElementById('btn-consult-quote');

  const pricingModels = {
    'embroidery': {
      name: 'Bridal & Saree Zardozi Embroidery',
      tiers: {
        'minimal': { base: 950, days: 3, label: 'Delicate Neckline & Sleeve Borders' },
        'moderate': { base: 2100, days: 5, label: 'Detailed Floral Motifs & Shaded Thread' },
        'heavy': { base: 3800, days: 7, label: 'Heirloom All-Over Zardozi & Zari' }
      }
    },
    'prepleating': {
      name: 'Saree Pre-Pleating & Box-Fold',
      tiers: {
        'minimal': { base: 300, days: 1, label: 'Single Silk Saree (Standard Fold)' },
        'moderate': { base: 750, days: 2, label: 'Heavy Zari Bridal Drape & Setting' },
        'heavy': { base: 1400, days: 3, label: 'Bridal Trousseau Set (3 Sarees)' }
      }
    },
    'kidswear': {
      name: 'Kids Customized Couture',
      tiers: {
        'minimal': { base: 850, days: 3, label: 'Traditional Silk Frock / Pattu' },
        'moderate': { base: 1650, days: 5, label: 'Tiered Gown with Handcrafted Bow' },
        'heavy': { base: 2800, days: 7, label: 'Heirloom Pattu Pavadai & Zari Border' }
      }
    },
    'tailoring': {
      name: 'Unisex Bespoke Tailoring',
      tiers: {
        'minimal': { base: 650, days: 3, label: 'Custom Shirt / Kurta / Designer Blouse' },
        'moderate': { base: 1400, days: 4, label: 'Structured Cut with Voile Lining' },
        'heavy': { base: 2500, days: 6, label: 'Bespoke 3-Piece Ensemble / Suit' }
      }
    },
    'printing': {
      name: 'Direct-to-Film & Sublimation Printing',
      tiers: {
        'minimal': { base: 200, days: 2, label: 'Chest Emblem / Pocket Placement' },
        'moderate': { base: 380, days: 3, label: 'Full A4 Front / Back High-Density' },
        'heavy': { base: 620, days: 4, label: 'All-Over Print / Multi-Placement' }
      }
    },
    'corporate': {
      name: 'Corporate Shirt & Monogram Embroidery',
      tiers: {
        'minimal': { base: 160, days: 3, label: 'Executive Monogram / Pocket Tag' },
        'moderate': { base: 320, days: 4, label: 'Chest Crest & Sleeve Insignia' },
        'heavy': { base: 580, days: 5, label: 'Full Back Emblem + Chest Monogram' }
      }
    }
  };

  function recalculate() {
    let activeService = 'embroidery';
    serviceRadios.forEach(r => { if (r.checked) activeService = r.value; });

    const complexity = complexitySelect.value || 'moderate';
    const quantity = Math.max(1, parseInt(quantityInput.value, 10) || 1);

    let isExpress = false;
    speedRadios.forEach(r => { if (r.checked && r.value === 'express') isExpress = true; });

    const model = pricingModels[activeService] || pricingModels['embroidery'];
    const tier = model.tiers[complexity] || model.tiers['moderate'];

    let unitCost = tier.base;
    let days = tier.days;

    // Commercial volume discounts
    if (quantity >= 10 && (activeService === 'printing' || activeService === 'corporate')) {
      unitCost = Math.round(unitCost * 0.82); // 18% bulk manufacturing concession
    } else if (quantity >= 5) {
      unitCost = Math.round(unitCost * 0.9);
    }

    let subtotal = unitCost * quantity;

    if (isExpress) {
      subtotal = Math.round(subtotal * 1.25);
      days = Math.max(1, Math.ceil(days / 2));
    }

    const lowEstimate = Math.round(subtotal * 0.95);
    const highEstimate = Math.round(subtotal * 1.1);

    if (estAmountEl) {
      estAmountEl.textContent = `₹${lowEstimate.toLocaleString('en-IN')} - ₹${highEstimate.toLocaleString('en-IN')}`;
    }
    if (estTimeEl) {
      estTimeEl.textContent = `Estimated Production: ${days} ${days === 1 ? 'Business Day' : 'Business Days'} (${isExpress ? 'Express Priority' : 'Standard Atelier'})`;
    }

    if (sumServiceEl) sumServiceEl.textContent = model.name;
    if (sumComplexityEl) sumComplexityEl.textContent = tier.label;
    if (sumQtyEl) sumQtyEl.textContent = `${quantity} ${quantity === 1 ? 'Piece' : 'Pieces'}`;
    if (sumSpeedEl) sumSpeedEl.textContent = isExpress ? 'Express Priority (24-48h)' : 'Standard Atelier Craft';

    if (consultQuoteBtn) {
      const summaryText = encodeURIComponent(
        `Atelier Inquiry — Mr & Mrs Designer Studio\n` +
        `• Service: ${model.name}\n` +
        `• Specification: ${tier.label}\n` +
        `• Quantity: ${quantity}\n` +
        `• Pace: ${isExpress ? 'Express Priority' : 'Standard Atelier'}\n` +
        `• Estimate Range: ₹${lowEstimate} - ₹${highEstimate}\n\n` +
        `Please advise on fabric consultation and appointment availability.`
      );
      consultQuoteBtn.href = `https://wa.me/?text=${summaryText}`;
    }
  }

  serviceRadios.forEach(r => r.addEventListener('change', recalculate));
  complexitySelect.addEventListener('change', recalculate);
  quantityInput.addEventListener('input', recalculate);
  speedRadios.forEach(r => r.addEventListener('change', recalculate));

  recalculate();
}

/* ==========================================================================
   3. Filterable Lookbook
   ========================================================================== */
function initLookbookFilter() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 15);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. High-Resolution Lightbox Modal
   ========================================================================== */
function initLightboxModal() {
  const modal = document.getElementById('artwork-lightbox');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-image-target');
  const modalTitle = document.getElementById('modal-title-target');
  const modalTag = document.getElementById('modal-tag-target');
  const modalDesc = document.getElementById('modal-desc-target');
  const modalSpecs = document.getElementById('modal-specs-target');
  const modalActionBtn = document.getElementById('modal-order-btn');

  const inspectButtons = document.querySelectorAll('.btn-inspect');

  inspectButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-card');
      const imgSrc = card.querySelector('.portfolio-image-wrapper img').src;
      const title = card.querySelector('h3').textContent;
      const tag = card.querySelector('.portfolio-badge').textContent;
      const desc = card.querySelector('.portfolio-info p').textContent;
      const metaElements = card.querySelectorAll('.meta-pill');

      if (modalImg) modalImg.src = imgSrc;
      if (modalTitle) modalTitle.textContent = title;
      if (modalTag) modalTag.textContent = tag;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalSpecs) {
        let specsHtml = '';
        metaElements.forEach(pill => {
          const parts = pill.textContent.split(':');
          if (parts.length === 2) {
            specsHtml += `<li><span class="title">${parts[0].trim()}</span><span class="value">${parts[1].trim()}</span></li>`;
          } else {
            specsHtml += `<li><span class="title">Detail</span><span class="value">${pill.textContent}</span></li>`;
          }
        });
        modalSpecs.innerHTML = specsHtml;
      }

      if (modalActionBtn) {
        const msg = encodeURIComponent(
          `Consultation Request — Mr & Mrs Designer Studio\n` +
          `• Commission Reference: ${title} (${tag})\n` +
          `• Looking to discuss custom bespoke sizing and fabric options.`
        );
        modalActionBtn.href = `https://wa.me/?text=${msg}`;
      }

      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });
}

/* ==========================================================================
   5. Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const toggleButtons = document.querySelectorAll('.mobile-toggle, #islandMobileToggle');
  const drawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (drawerOverlay) {
      drawerOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawerOverlay) {
      drawerOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  toggleButtons.forEach(btn => btn.addEventListener('click', openDrawer));
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   7. Private Consultation Booking Form
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  const feedbackEl = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value.trim();
      const contact = document.getElementById('book-phone').value.trim();
      const service = document.getElementById('book-service').value;
      const date = document.getElementById('book-date').value;
      const notes = document.getElementById('book-notes').value.trim();

      const bookingMsg = encodeURIComponent(
        `Private Consultation Booking — Mr & Mrs Designer Studio\n` +
        `• Name: ${name}\n` +
        `• Contact: ${contact}\n` +
        `• Service: ${service}\n` +
        `• Desired Date: ${date || 'Earliest available'}\n` +
        `• Notes: ${notes || 'Standard fitting request'}\n\n` +
        `Please confirm studio appointment availability.`
      );

      if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML = `
          <div style="background: rgba(31, 61, 43, 0.1); border: 1px solid #1F3D2B; color: #1F3D2B; padding: 1rem; border-radius: 4px; font-size: 0.85rem; margin-top: 1rem; line-height: 1.5;">
            <strong>Appointment Request Prepared</strong><br>
            Connecting to atelier concierge with your reservation details...
          </div>
        `;
      }

      setTimeout(() => {
        window.open(`https://wa.me/?text=${bookingMsg}`, '_blank');
      }, 650);
    });
  }
}

/* ==========================================================================
   8. Sticky Mobile Bottom App Bar
   ========================================================================== */
function initStickyBottomBar() {
  const actions = document.querySelectorAll('.bottom-bar-action');
  actions.forEach(act => {
    act.addEventListener('click', () => {
      actions.forEach(a => a.classList.remove('active'));
      act.classList.add('active');
    });
  });
}

/* ==========================================================================
   9. Brand Identity Persistence & Dynamic Logo Selector
   ========================================================================== */
function initLogoPersistence() {
  try {
    // Default to the official user-selected logo
    const savedLogo = localStorage.getItem('selected_studio_logo') || 'assets/images/logo.svg';
    document.querySelectorAll('.island-logo-img, .brand-mark img').forEach(img => {
      img.src = savedLogo;
    });
  } catch (e) {}
}

window.applyLogoOption = function(optionNum, imageSrc, name) {
  document.querySelectorAll('.island-logo-img, .brand-mark img').forEach(img => {
    img.src = imageSrc;
  });
  try {
    localStorage.setItem('selected_studio_logo', imageSrc);
    localStorage.setItem('selected_studio_logo_name', name);
  } catch (e) {}

  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById(`logoCard${i}`);
    const badge = document.getElementById(`badgeOption${i}`);
    if (card) {
      const btn = card.querySelector('button');
      if (i === optionNum) {
        card.style.borderColor = 'var(--gold-zari)';
        card.style.background = 'rgba(197, 160, 89, 0.08)';
        if (btn) {
          btn.className = 'btn btn-primary btn-sm';
          btn.textContent = 'Active Brand Selected';
        }
      } else {
        card.style.borderColor = 'var(--border-light)';
        card.style.background = 'var(--color-surface-subtle)';
        if (btn) {
          btn.className = 'btn btn-outline btn-sm';
          btn.textContent = `Apply Option ${i} to Site`;
        }
      }
    }
    if (badge) {
      badge.style.display = i === optionNum ? 'inline-block' : 'none';
      if (i === optionNum) badge.textContent = 'Active Brand';
    }
  }

  const banner = document.getElementById('logoSelectedBanner');
  const nameEl = document.getElementById('activeLogoName');
  if (banner && nameEl) {
    nameEl.textContent = `Option ${optionNum} (${name})`;
    banner.style.display = 'block';
  }
};

/* ==========================================================================
   10. Production-Grade Toast Notifications
   ========================================================================== */
window.showStudioToast = function(message, type = 'success') {
  let container = document.getElementById('studioToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'studioToastContainer';
    container.className = 'studio-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `studio-toast ${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span style="font-size: 1.1rem; color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#C5A059'};">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

/* ==========================================================================
   11. WhatsApp Floating Concierge Widget
   ========================================================================== */
window.toggleWhatsAppChat = function() {
  const card = document.getElementById('whatsappChatCard');
  if (!card) return;
  const isHidden = card.style.display === 'none' || !card.style.display;
  card.style.display = isHidden ? 'flex' : 'none';
};

window.openWhatsAppConcierge = function(topic) {
  const phone = '919876543210';
  const messages = {
    'bridal': 'Hello Mr and Mrs Designer Studio! I would like to schedule a bespoke bridal zardozi embroidery consultation.',
    'pleating': 'Hello! I want to order Saree Pre-Pleating and Box-Fold valet service for my upcoming event.',
    'suiting': 'Hello! I would like to book a bespoke tailoring measurement trial for suiting / bandhgala.',
    'location': 'Hello! Please share your studio map location and landmark directions.',
    'payment': 'Hello! I would like to confirm my advance booking deposit via UPI / Bank transfer.'
  };
  const msg = encodeURIComponent(messages[topic] || 'Hello Mr and Mrs Designer Studio! I would like to inquire about your services.');
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  toggleWhatsAppChat();
};

/* ==========================================================================
   12. Smooth Scroll Animations
   ========================================================================== */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
}


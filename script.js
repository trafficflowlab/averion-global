/* ═══════════════════════════════════════════════════════════════
   Averion Global LLP — CRO-Optimised JavaScript
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initFAQ();
  initCounters();
  initBackToTop();
  initPhoneFormatting();
  initNavHighlight();
  initFormFocus();
  initTimelineProgress();
  initSchemeBar();
});

/* ── SCHEME NOTIFICATION BAR — Seamless infinite scroll ── */
function initSchemeBar() {
  const track = document.getElementById('snb-track');
  if (!track) return;

  /* Clone the entire set of cards and append so scroll loops seamlessly */
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.parentElement.appendChild(clone);
}

/* ── 1. STICKY HEADER ─────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── 2. MOBILE NAV ────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  /* Set --header-wrap-h CSS variable so .mobile-nav positions correctly */
  function updateHeaderWrapHeight() {
    const wrap = document.getElementById('site-header-wrap');
    const h = wrap ? wrap.getBoundingClientRect().height : 70;
    document.documentElement.style.setProperty('--header-wrap-h', h + 'px');
  }
  updateHeaderWrapHeight();
  window.addEventListener('resize', updateHeaderWrapHeight, { passive: true });

  hamburger.addEventListener('click', () => {
    updateHeaderWrapHeight(); /* recalc in case SNB bar changed */
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  /* Close on nav link click */
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close on outside click */
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── 3. SCROLL ANIMATIONS (IntersectionObserver) ─────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ── 4. ACTIVE NAV HIGHLIGHT ──────────────────────────────────── */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === '#' + id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => observer.observe(section));
}

/* ── 5. FAQ ACCORDION ─────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', function () {
      toggleFaq(this);
    });
  });
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const icon = item.querySelector('.faq-icon-wrap');
  const isOpen = item.classList.contains('open');

  /* Close all others */
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    if (openItem !== item) {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = null;
    }
  });

  item.classList.toggle('open', !isOpen);
  if (!isOpen) {
    answer.style.maxHeight = answer.scrollHeight + 'px';
  } else {
    answer.style.maxHeight = null;
  }
}

/* ── 6. ANIMATED COUNTERS ─────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '+';
  const duration = 1600;
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = value.toLocaleString('en-IN') + (progress < 1 ? '' : suffix);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── 7. BACK TO TOP ───────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}

/* ── 8. PHONE NUMBER FORMATTING ───────────────────────────────── */
function initPhoneFormatting() {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function () {
      let val = this.value.replace(/[^\d+]/g, '');
      if (val.startsWith('+91') && val.length > 3) {
        const digits = val.slice(3).replace(/\D/g, '').slice(0, 10);
        this.value = '+91 ' + digits.replace(/(\d{5})(\d{0,5})/, (_, a, b) => b ? `${a} ${b}` : a);
      } else if (val.startsWith('0') && val.length > 1) {
        this.value = val.slice(0, 11);
      } else {
        this.value = val.slice(0, 15);
      }
    });
  });
}

/* ── 9. SMOOTH SCROLL ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || !targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const wrap = document.getElementById('site-header-wrap');
    const headerH = wrap ? wrap.offsetHeight : (document.getElementById('header')?.offsetHeight || 0);
    const offset = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ── 10. FORM FOCUS ENHANCEMENT ───────────────────────────────── */
function initFormFocus() {
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    const group = field.closest('.form-group');
    if (!group) return;
    field.addEventListener('focus', () => group.classList.add('focused'));
    field.addEventListener('blur', () => group.classList.remove('focused'));
  });
}

/* ── 11. TIMELINE PROGRESS BAR ANIMATION ──────────────────────── */
function initTimelineProgress() {
  const timeline = document.getElementById('process-timeline');
  if (!timeline) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(timeline);
}

/* ── 11. HERO FORM HANDLER ────────────────────────────────────── */
function handleHeroForm(e) {
  e.preventDefault();
  const isScheme = e.target.id === 'scheme-mobile-form';
  const prefix = isScheme ? 'sm' : 'h';
  const btn = isScheme
    ? e.target.querySelector('[type="submit"]')
    : document.getElementById('hero-submit-btn');

  const name    = document.getElementById(prefix + '-name').value.trim();
  const mobile  = document.getElementById(prefix + '-mobile').value.trim();
  const service = document.getElementById(prefix + '-service').value;
  const formId  = isScheme ? 'scheme-mobile-form' : 'hero-form';

  if (!name || !mobile || !service) {
    shakeForm(formId);
    return;
  }
  if (!isValidPhone(mobile)) {
    showFieldError(document.getElementById(prefix + '-mobile'), 'Enter a valid mobile number');
    return;
  }

  setButtonLoading(btn, true);
  setTimeout(() => { window.location.href = 'thank-you.html'; }, 1200);
}

/* ── 12. MAIN FORM HANDLER ────────────────────────────────────── */
function handleMainForm(e) {
  e.preventDefault();
  const btn   = document.getElementById('main-submit-btn');
  const name  = document.getElementById('m-name').value.trim();
  const mobile = document.getElementById('m-mobile').value.trim();
  const stage  = document.getElementById('m-stage').value;
  const service = document.getElementById('m-service').value;

  if (!name || !mobile || !stage || !service) {
    shakeForm('main-form');
    return;
  }
  if (!isValidPhone(mobile)) {
    showFieldError(document.getElementById('m-mobile'), 'Enter a valid mobile number');
    return;
  }

  setButtonLoading(btn, true);
  setTimeout(() => { window.location.href = 'thank-you.html'; }, 1400);
}

/* ── HELPERS ──────────────────────────────────────────────────── */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s+\-()]/g, '');
  return /^(\d{10}|91\d{10}|0\d{10})$/.test(cleaned);
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn._origText = btn.innerHTML;
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 0.9s linear infinite"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" opacity=".25"/><path d="M21 12a9 9 0 0 1-9 9"/></svg> Submitting...';
    btn.disabled = true;
    btn.style.opacity = '0.85';
  } else {
    btn.innerHTML = btn._origText || btn.innerHTML;
    btn.disabled = false;
    btn.style.opacity = '';
  }
}

/* Add spin keyframe dynamically */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(spinStyle);

function shakeForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.style.animation = 'none';
  form.offsetHeight; /* reflow */
  form.style.animation = 'shake 0.5s ease';
  setTimeout(() => form.style.animation = '', 500);
}

function showFieldError(field, message) {
  if (!field) return;
  field.style.borderColor = '#c0392b';
  field.style.boxShadow = '0 0 0 3px rgba(192,57,43,.15)';
  field.setAttribute('aria-invalid', 'true');
  /* Remove error on next input */
  const clear = () => {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    field.removeAttribute('aria-invalid');
    field.removeEventListener('input', clear);
  };
  field.addEventListener('input', clear);
  field.focus();
  showToast('⚠️ ' + message, 'warning');
}

function showToast(msg, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.borderLeftColor = type === 'warning' ? '#f59e0b' : '#22c55e';
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 4500);
}

/* Shake animation */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100%{transform:translateX(0)}
  15%,45%,75%{transform:translateX(-6px)}
  30%,60%,90%{transform:translateX(6px)}
}`;
document.head.appendChild(shakeStyle);

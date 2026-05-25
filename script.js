/* ============================================
   HASANDI CHANARA SAMARASEKARA - Portfolio JS
   ============================================ */

// ── Theme Management ──────────────────────────
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || preferred);
}

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ── Navigation ────────────────────────────────
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');

function showPage(pageId) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(l => l.classList.remove('active'));

  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeLink = document.querySelector(`.nav-links a[data-page="${pageId}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Trigger animations
  setTimeout(() => {
    animateSkillBars();
    observeReveal();
  }, 100);
}

// Nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    showPage(page);
    if (window.innerWidth < 768) closeMobileMenu();
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.querySelector('.nav-links');

function closeMobileMenu() {
  hamburger?.classList.remove('open');
  navLinksContainer?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer?.classList.toggle('open');
});

// ── Skill Bars ────────────────────────────────
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach((bar, i) => {
    const target = bar.getAttribute('data-width');
    setTimeout(() => {
      bar.style.width = target + '%';
    }, i * 80);
  });
}

// ── Scroll Reveal ─────────────────────────────
function observeReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

// ── Contact Form ──────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const resetBtn = document.getElementById('resetForm');

function validateField(input) {
  const error = input.parentElement.querySelector('.form-error');
  const value = input.value.trim();
  let valid = true;

  input.classList.remove('input-error');
  if (error) error.classList.remove('show');

  if (input.required && !value) {
    valid = false;
    input.classList.add('input-error');
    if (error) { error.textContent = 'This field is required.'; error.classList.add('show'); }
  } else if (input.type === 'email' && value) {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(value)) {
      valid = false;
      input.classList.add('input-error');
      if (error) { error.textContent = 'Enter a valid email address.'; error.classList.add('show'); }
    }
  }
  return valid;
}

contactForm?.querySelectorAll('input, textarea, select').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('input-error')) validateField(field);
  });
});

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields = contactForm.querySelectorAll('input, textarea, select');
  let allValid = true;
  fields.forEach(f => { if (!validateField(f)) allValid = false; });

  if (!allValid) return;

  const btn = contactForm.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulate send delay
  setTimeout(() => {
    contactForm.style.display = 'none';
    formSuccess?.classList.add('show');
  }, 1200);
});

resetBtn?.addEventListener('click', () => {
  contactForm.reset();
  contactForm.style.display = 'block';
  formSuccess?.classList.remove('show');
  const btn = contactForm.querySelector('.form-submit');
  btn.textContent = '🚀 Send Message';
  btn.disabled = false;
  contactForm.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  contactForm.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
});

// ── Typewriter effect ─────────────────────────
function typewriter(el, texts, speed = 80, pause = 2000) {
  if (!el) return;
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = texts[ti];
    if (deleting) {
      el.textContent = current.slice(0, ci--);
    } else {
      el.textContent = current.slice(0, ci++);
    }

    let delay = deleting ? speed / 2 : speed;
    if (!deleting && ci > current.length) { deleting = true; delay = pause; }
    if (deleting && ci < 0) { deleting = false; ti = (ti + 1) % texts.length; ci = 0; delay = speed; }
    setTimeout(tick, delay);
  }
  tick();
}

// ── Init ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  showPage('home');

  // Typewriter on hero subtitle
  const tw = document.getElementById('heroTypewriter');
  typewriter(tw, [
    'IT Management Student',
    'Web Developer',
    'ICT Enthusiast',
    'Problem Solver'
  ]);

  // Animate skill bars after short delay
  setTimeout(animateSkillBars, 600);
  observeReveal();
});

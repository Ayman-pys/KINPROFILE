/* ============================================================
   AYMAN AL-KINANI PORTFOLIO — script.js
   ============================================================ */

'use strict';

// ── THEME TOGGLE ─────────────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const THEME_KEY   = 'ak-portfolio-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Load saved preference or system preference
(function initTheme() {
  const saved  = localStorage.getItem(THEME_KEY);
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  setTheme(saved || system);
})();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ── CUSTOM CURSOR ─────────────────────────────────────────────
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let   mouseX = 0, mouseY = 0;
let   trailX = 0, trailY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity      = '0';
    cursorTrail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity      = '1';
    cursorTrail.style.opacity = '1';
  });
}

// ── NAV — scroll behaviour & active link ─────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ── MOBILE HAMBURGER ─────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks= document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

// ── TYPED TEXT EFFECT ─────────────────────────────────────────
const phrases = [
  '> Front-End Developer',
  '> Builder of Web Experiences',
  '> CSS Whisperer',
  '> Keyboard-Powered Creator',
  '> Bug Hunter (Level 16)',
];
let   phraseIdx = 0;
let   charIdx   = 0;
let   deleting  = false;
const typedEl   = document.getElementById('typedText');

function typeLoop() {
  if (!typedEl) return;
  const phrase = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      setTimeout(() => { deleting = true; typeLoop(); }, 2000);
      return;
    }
    setTimeout(typeLoop, 65);
  } else {
    typedEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 40);
  }
}
setTimeout(typeLoop, 800);

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ── STAT COUNTER ANIMATION ────────────────────────────────────
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const suffix = target >= 1000 ? '+' : '';
    let   start  = 0;
    const dur    = 1600;
    const step   = 16;
    const inc    = target / (dur / step);

    const tick = () => {
      start += inc;
      if (start >= target) {
        el.textContent = target + suffix;
        return;
      }
      el.textContent = Math.floor(start) + suffix;
      setTimeout(tick, step);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ── SKILL BAR ANIMATION ───────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const fill  = entry.target;
    const level = fill.dataset.level;
    // Slight delay for stagger feel
    const idx   = [...skillFills].indexOf(fill);
    setTimeout(() => {
      fill.style.width = level + '%';
    }, idx * 80);
    skillObserver.unobserve(fill);
  });
}, { threshold: 0.3 });

skillFills.forEach(el => skillObserver.observe(el));

// ── BACK TO TOP ───────────────────────────────────────────────
const backTop = document.getElementById('backTop');
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── CONTACT FORM ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = contactForm.querySelector('#name').value.trim();
  const email   = contactForm.querySelector('#email').value.trim();
  const message = contactForm.querySelector('#message').value.trim();

  if (!name || !email || !message) return;
  if (!email.includes('@')) return;

  // Build mailto link
  const subject  = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  const mailto   = `mailto:kinaniayman50@gmail.com?subject=${subject}&body=${body}`;

  window.location.href = mailto;

  // Show success state
  const btnText    = contactForm.querySelector('.btn-text');
  const btnSuccess = contactForm.querySelector('.btn-success');
  btnText.hidden    = true;
  btnSuccess.hidden = false;

  setTimeout(() => {
    btnText.hidden    = false;
    btnSuccess.hidden = true;
    contactForm.reset();
  }, 3000);
});

// ── DEV JOKES ROTATION ────────────────────────────────────────
const jokes = [
  { q: 'Why do programmers prefer dark mode?',          a: 'Because light attracts bugs! 🐛' },
  { q: 'What is a programmer\'s favorite hangout place?', a: 'Foo Bar 🍺' },
  { q: 'Why do Java developers wear glasses?',          a: 'Because they don\'t C# 👓' },
  { q: 'What do you call a programmer from Finland?',   a: 'Nerdic 🧊' },
  { q: 'How do you comfort a JavaScript bug?',          a: 'You console it 🖥️' },
  { q: 'A QA engineer walks into a bar.',               a: 'Orders 0 beers. Orders 1 beer. Orders 99999 beers. 🍺' },
  { q: 'Why do programmers hate nature?',               a: 'Too many bugs, no wifi 🌿' },
];

const jokeEl  = document.getElementById('devJoke');
const punchEl = document.getElementById('devPunch');
let   jokeIdx = 0;

function rotateJoke() {
  jokeIdx = (jokeIdx + 1) % jokes.length;
  if (jokeEl && punchEl) {
    jokeEl.style.opacity  = '0';
    punchEl.style.opacity = '0';
    setTimeout(() => {
      jokeEl.textContent  = jokes[jokeIdx].q;
      punchEl.textContent = jokes[jokeIdx].a;
      jokeEl.style.opacity  = '1';
      punchEl.style.opacity = '1';
    }, 300);
  }
}

if (jokeEl) {
  jokeEl.style.transition  = 'opacity 0.3s';
  punchEl.style.transition = 'opacity 0.3s';
  setInterval(rotateJoke, 9000);
}

// ── SMOOTH SECTION HIGHLIGHT IN NAV ───────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navAnchors.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.style.color = active ? 'var(--accent)' : '';
    });
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── TILT EFFECT ON PROJECT CARDS ─────────────────────────────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card:not(.project-card--cta)').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── FLOATING CODE PARTICLES (subtle background) ───────────────
(function createFloatingChars() {
  const chars  = ['</', '{}', '//', '=>', '&&', '||', '/*', '*/', '[];', '...'];
  const hero   = document.querySelector('.hero');
  if (!hero) return;

  chars.forEach((ch, i) => {
    const el = document.createElement('span');
    el.className   = 'float-char';
    el.textContent = ch;
    el.style.cssText = `
      position: absolute;
      font-family: 'DM Mono', monospace;
      font-size: ${0.65 + Math.random() * 0.4}rem;
      color: rgba(0,229,160,${0.04 + Math.random() * 0.04});
      top:  ${10 + Math.random() * 80}%;
      left: ${5  + Math.random() * 90}%;
      pointer-events: none;
      user-select: none;
      animation: floatChar ${14 + i * 2}s ease-in-out ${i * -2}s infinite;
      z-index: 0;
    `;
    hero.style.position = 'relative';
    hero.appendChild(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatChar {
      0%,100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
      33%      { transform: translateY(-24px) rotate(4deg); opacity: 1; }
      66%      { transform: translateY(12px) rotate(-3deg); opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
})();

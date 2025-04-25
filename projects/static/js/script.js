// =====================================================
// Custom Portfolio JavaScript
// Author: Diogo Sal
// Handles: UI interaction, ripple effects, theme toggle, tab switching
// =====================================================

// === Debug Load Confirmation ===
console.log("JS Loaded ✅");

// =======================
// DOM ELEMENTS
// =======================
const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');
const customCursor = document.getElementById('custom-cursor');
const hero = document.getElementById('hero');
const btn = document.getElementById('show-more-btn');
const wrapper = document.getElementById('extra-projects-wrapper');
const cards = document.querySelectorAll('.extra-card');
const contactSection = document.getElementById('contact');
const canvasContact = document.getElementById('rippleCanvasContact');
const themeToggle = document.getElementById('theme-toggle');

// =======================
// GLOBAL STATE
// =======================
let isVisible = false;

// =======================
// CANVAS RESIZING (Hero)
// =======================
function resizeCanvasToHero() {
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}
window.addEventListener('resize', resizeCanvasToHero);
resizeCanvasToHero();

// =======================
// MOUSE TRACKING & CURSOR FOLLOW
// =======================
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let smoothMouse = { ...mouse };

document.addEventListener('mousemove', (e) => {
  customCursor.style.left = `${e.clientX}px`;
  customCursor.style.top = `${e.clientY}px`;
});

// Track ripple within hero section
hero.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// =======================
// CURSOR HOVER STYLES
// =======================
document.querySelectorAll('a, button, [role="button"]').forEach(el => {
  el.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
});

// =======================
// SHOW MORE PROJECTS (Toggle with Animation)
// =======================
btn.addEventListener('click', () => {
  isVisible = !isVisible;

  if (isVisible) {
    wrapper.classList.remove('overflow-hidden', 'hidden');
    wrapper.classList.add('open');
    btn.textContent = 'Show Less';

    gsap.fromTo(cards,
      { opacity: 0, yPercent: 20 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        clearProps: "transform"
      }
    );
  } else {
    wrapper.classList.add('overflow-hidden');
    wrapper.classList.remove('open');
    btn.textContent = 'Show More Projects';

    gsap.to(cards, {
      opacity: 0,
      yPercent: 20,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.1,
      onComplete: () => wrapper.classList.add('hidden')
    });
  }
});

// =======================
// HELPER: Convert HEX to RGBA with alpha
// =======================
function hexToRgba(hex, alpha = 1) {
  hex = hex.trim().replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// =======================
// HERO RIPPLE EFFECT (Animated Grid, 30fps optimized)
// =======================
const spacing = 40;
let lastTimeHero = 0;
const frameInterval = 1000 / 30;

function drawHeroRippleGrid(timestamp) {
  if (timestamp - lastTimeHero < frameInterval) {
    requestAnimationFrame(drawHeroRippleGrid);
    return;
  }
  lastTimeHero = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const time = Date.now() / 500;

  smoothMouse.x += (mouse.x - smoothMouse.x) * 0.2;
  smoothMouse.y += (mouse.y - smoothMouse.y) * 0.2;

  const rippleHex = getComputedStyle(document.body).getPropertyValue('--ripple').trim();

  ctx.shadowBlur = 12;
  ctx.shadowColor = hexToRgba(rippleHex, 0.4);

  for (let x = 0; x < canvas.width; x += spacing) {
    for (let y = 0; y < canvas.height; y += spacing) {
      const dx = smoothMouse.x - x;
      const dy = smoothMouse.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = 1.5 + Math.sin(dist * 0.05 - time) * 1.2;
      const alpha = Math.max(0, 0.25 - dist / 800);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(rippleHex, alpha);
      ctx.fill();
    }
  }

  requestAnimationFrame(drawHeroRippleGrid);
}
requestAnimationFrame(drawHeroRippleGrid);

// =======================
// CONTACT RIPPLE EFFECT (Only when visible)
// =======================
if (canvasContact && contactSection) {
  const ctxC = canvasContact.getContext('2d');
  let mouseC = { x: canvasContact.width / 2, y: canvasContact.height / 2 };
  let smoothMouseC = { ...mouseC };
  let isContactVisible = false;
  let lastTimeContact = 0;

  function resizeCanvasToContact() {
    canvasContact.width = canvasContact.offsetWidth;
    canvasContact.height = canvasContact.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvasToContact);
  resizeCanvasToContact();

  contactSection.addEventListener('mousemove', (e) => {
    const rect = canvasContact.getBoundingClientRect();
    mouseC.x = e.clientX - rect.left;
    mouseC.y = e.clientY - rect.top;
  });

  function drawContactRippleGrid(timestamp) {
    if (!isContactVisible || (timestamp - lastTimeContact < frameInterval)) {
      requestAnimationFrame(drawContactRippleGrid);
      return;
    }

    lastTimeContact = timestamp;
    ctxC.clearRect(0, 0, canvasContact.width, canvasContact.height);
    const time = Date.now() / 500;
    smoothMouseC.x += (mouseC.x - smoothMouseC.x) * 0.2;
    smoothMouseC.y += (mouseC.y - smoothMouseC.y) * 0.2;

    const rippleHex = getComputedStyle(document.body).getPropertyValue('--ripple').trim();
    ctxC.shadowBlur = 12;
    ctxC.shadowColor = hexToRgba(rippleHex, 0.4);

    for (let x = 0; x < canvasContact.width; x += spacing) {
      for (let y = 0; y < canvasContact.height; y += spacing) {
        const dx = smoothMouseC.x - x;
        const dy = smoothMouseC.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const r = 1.5 + Math.sin(dist * 0.05 - time) * 1.2;
        const alpha = Math.max(0, 0.25 - dist / 800);
        ctxC.beginPath();
        ctxC.arc(x, y, r, 0, Math.PI * 2);
        ctxC.fillStyle = hexToRgba(rippleHex, alpha);
        ctxC.fill();
      }
    }

    requestAnimationFrame(drawContactRippleGrid);
  }

  requestAnimationFrame(drawContactRippleGrid);

  const observer = new IntersectionObserver(
    ([entry]) => { isContactVisible = entry.isIntersecting; },
    { threshold: 0.1 }
  );
  observer.observe(contactSection);
}

// =======================
// STACK ICON ANIMATION ON SCROLL
// =======================
const stackIcons = document.querySelectorAll('.stack-icon');
const stackObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

stackIcons.forEach(icon => stackObserver.observe(icon));

// =======================
// ABOUT SECTION TABS (Animated with GSAP)
// =======================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
let currentPane = document.querySelector('.tab-pane:not(.hidden)');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.getAttribute('data-tab');
    const newPane = document.getElementById(`tab-${selected}`);
    if (newPane === currentPane) return;

    tabButtons.forEach(b => b.classList.remove('bg-[--light-teal]', 'text-black', 'active'));
    tabPanes.forEach(p => p.classList.add('hidden'));

    btn.classList.add('bg-[--light-teal]', 'text-black', 'active');
    gsap.to(currentPane, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        currentPane.classList.add('hidden');
        newPane.classList.remove('hidden');
        gsap.fromTo(newPane, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'
        });
        currentPane = newPane;
      }
    });
  });
});

// =======================
// THEME SWITCH BUTTON
// =======================
const storedTheme = localStorage.getItem('theme'); // Load saved preference

if (storedTheme === 'dark') {
  document.body.classList.add('dark');
}

// Toggle on click
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
});
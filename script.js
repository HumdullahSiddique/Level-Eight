// ---------- HERO: single pre-combined sequence (5 AI segments + real reveal, chained and graded in one file) ----------
// Just needs to autoplay and loop — all sequencing/crossfading is already
// baked into the video file itself.
const heroSequence = document.getElementById('heroSequence');
window.addEventListener('DOMContentLoaded', () => {
  heroSequence.play().catch(() => {});
});

// ---------- NAV: transparent over the hero, solid once scrolled past it ----------
const nav = document.querySelector('.nav');
const heroSection = document.querySelector('.hero');

function updateNav() {
  const heroHeight = heroSection.offsetHeight;
  if (window.scrollY > heroHeight - 80) {
    nav.classList.add('nav-solid');
  } else {
    nav.classList.remove('nav-solid');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ---------- "SEE THE DIFFERENCE" VIDEO: plain video, real sound, user-initiated play ----------
// No autoplay, no muting, no scroll trickery — browsers block unmuted
// autoplay anyway. Native controls handle play/pause/volume/seek reliably.

// ---------- SCROLL-REVEAL: fade/rise cards into view as the visitor scrolls ----------
const revealTargets = document.querySelectorAll('.process-step, .why-item, .testimonial-card, .reel-item, .gallery-grid a');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach((el) => revealObserver.observe(el));

// ---------- REEL MUTE TOGGLE: each "See Us In Action" card can be unmuted individually ----------
document.querySelectorAll('.reel-item').forEach((item) => {
  const video = item.querySelector('video');
  const btn = item.querySelector('.reel-mute');
  if (!video || !btn) return;
  btn.addEventListener('click', () => {
    // Unmuting one card mutes the others, so only one plays sound at a time.
    document.querySelectorAll('.reel-item video').forEach((v) => { v.muted = true; });
    document.querySelectorAll('.reel-mute').forEach((b) => { b.textContent = '🔇'; });
    video.muted = !video.muted;
    btn.textContent = video.muted ? '🔇' : '🔊';
  });
});

// ---------- REEL CAROUSEL: pages of 3, dot-controlled, auto-advances and loops ----------
const reelViewport = document.querySelector('.reel-viewport');
const reelTrack = document.getElementById('reelTrack');
const reelDots = document.getElementById('reelDots');

if (reelViewport && reelTrack && reelDots) {
  const reelItems = Array.from(reelTrack.querySelectorAll('.reel-item'));
  const PER_PAGE = 3;
  const pageCount = Math.ceil(reelItems.length / PER_PAGE);
  let currentPage = 0;

  for (let i = 0; i < pageCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'reel-dot';
    dot.setAttribute('aria-label', 'Go to video group ' + (i + 1));
    dot.addEventListener('click', () => goToPage(i));
    reelDots.appendChild(dot);
  }
  const dotEls = Array.from(reelDots.children);

  function pageOffset(page) {
    const cardWidth = reelItems[0].getBoundingClientRect().width;
    const gap = 28;
    return (cardWidth + gap) * PER_PAGE * page;
  }

  function goToPage(page) {
    currentPage = (page + pageCount) % pageCount;
    reelTrack.style.transform = `translateX(-${pageOffset(currentPage)}px)`;
    dotEls.forEach((d, i) => d.classList.toggle('active', i === currentPage));
  }

  goToPage(0);
  window.addEventListener('resize', () => goToPage(currentPage));

  let autoTimer = setInterval(() => goToPage(currentPage + 1), 4500);
  const pauseAuto = () => clearInterval(autoTimer);
  const resumeAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(() => goToPage(currentPage + 1), 4500); };
  reelViewport.addEventListener('mouseenter', pauseAuto);
  reelViewport.addEventListener('mouseleave', resumeAuto);
}

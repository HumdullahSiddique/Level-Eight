// ---------- CONCEPT A: Hero autoplay sequence (macro opener -> golden hour reveal) ----------
const macroOpener = document.getElementById('macroOpener');
const heroReveal = document.getElementById('heroReveal');
const heroLayer = document.getElementById('heroVideoLayer');

function startHeroSequence() {
  macroOpener.play().catch(() => {});

  macroOpener.addEventListener('timeupdate', () => {
    const remaining = macroOpener.duration - macroOpener.currentTime;
    if (remaining <= 1.3 && heroReveal.paused) {
      heroReveal.play().catch(() => {});
      heroLayer.classList.add('reveal-active');
    }
  });

  heroReveal.addEventListener('ended', () => {
    heroReveal.currentTime = 0;
    heroReveal.play().catch(() => {});
  });
}

window.addEventListener('DOMContentLoaded', startHeroSequence);

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
// The "See Us In Action" reel videos are separate, silent, looping background clips.

// ── INK POUR canvas ──
// Draws a thick organic blob mass that acts as a solid page-break
// between the hero and about sections. No uniform teeth — just
// overlapping large circles creating a naturally chaotic edge.
function drawInk() {
  const canvas = document.getElementById('hero-ink');
  if (!canvas) return;
  const W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
  const H = canvas.height = canvas.offsetHeight || 380;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  // Seeded pseudo-random — same look every render
  function sr(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  const BG = '#0d0d0d';

  // Solid top band (top 55% of canvas)
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H * 0.55);

  // 60 large overlapping circles create the organic chaotic edge
  const count = 60;
  for (let i = 0; i < count; i++) {
    const x = sr(i)       * W;
    const y = H * 0.38 + sr(i + 100) * H * 0.52;
    const r = 90 + sr(i + 200) * 160;
    ctx.fillStyle = BG;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Extra pass: fill any remaining gaps at the top half
  for (let i = 0; i < 20; i++) {
    const x = sr(i + 300) * W;
    const y = H * 0.1 + sr(i + 400) * H * 0.35;
    const r = 60 + sr(i + 500) * 100;
    ctx.fillStyle = BG;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

drawInk();
window.addEventListener('resize', drawInk, { passive: true });

// ── SCROLL / NAV ──
const prog    = document.getElementById('prog');
const nav     = document.getElementById('nav');
const navGear = document.getElementById('nav-gear');
const hGear   = document.getElementById('hero-gear');
const hGear2  = document.getElementById('hero-gear2');
let ticking   = false;

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y   = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = ((y / max) * 100).toFixed(2) + '%';
    nav.classList.toggle('solid', y > 55);
    const deg = y * 0.18;
    navGear.style.transform = `rotate(${deg}deg)`;
    hGear.style.transform   = `rotate(${-deg * 0.5}deg)`;
    hGear2.style.transform  = `rotate(${deg * 0.38}deg)`;
    ticking = false;
  });
}, { passive: true });

// Entrance animations
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fu, .fl').forEach(el => io.observe(el));

// Showreel crossfade
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');
let cur = 0;
function nextSlide() {
  slides[cur].classList.remove('active');
  dots[cur].classList.remove('on');
  cur = (cur + 1) % slides.length;
  slides[cur].classList.add('active');
  dots[cur].classList.add('on');
}
setInterval(nextSlide, 3500);
dots.forEach((d, i) => {
  d.addEventListener('click', () => {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('on');
    cur = i;
    slides[cur].classList.add('active');
    dots[cur].classList.add('on');
  });
});

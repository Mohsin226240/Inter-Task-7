const $ = (sel, scope=document) => scope.querySelector(sel);
const $$ = (sel, scope=document) => scope.querySelectorAll(sel);

// Sticky progress on scroll
const progress = $('#progress');
document.addEventListener('scroll', ()=>{
const docH = document.documentElement.scrollHeight - window.innerHeight;
const sc = Math.max(window.scrollY, 0);
progress.style.width = `${(sc/docH)*100}%`;
});

// Mobile nav
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));
navLinks.addEventListener('click', (e)=>{
if(e.target.matches('a')) navLinks.classList.remove('open');
});

// Theme toggle
const themeToggle = $('#themeToggle');
const html = document.documentElement;
themeToggle.addEventListener('click', ()=>{
html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Lightweight tilt
$$('[data-tilt]').forEach(card=>{
const damp = 15;
card.addEventListener('mousemove', (e)=>{
const r = card.getBoundingClientRect();
const px = (e.clientX - r.left)/r.width;
const py = (e.clientY - r.top)/r.height;
const rx = (py - 0.5) * damp;
const ry = (0.5 - px) * damp;
card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
});
card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
});

// Pricing toggle with animated numbers
const pricingToggle = $('#togglePricing');
const priceValues = $$('.price-value');
function animateNumber(el, to){
const from = parseFloat(el.textContent) || 0;
const start = performance.now();
const dur = 400;
function tick(now){
const p = Math.min((now - start)/dur, 1);
const val = from + (to - from) * p;
el.textContent = Math.round(val * 100)/100;
if (p < 1) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
}
function setPeriod(yearly){
priceValues.forEach(el=>{
const monthly = parseFloat(el.dataset.monthly);
const yearlyV = parseFloat(el.dataset.yearly);
animateNumber(el, yearly ? yearlyV : monthly);
el.parentElement.querySelector('.period').textContent = yearly ? '/yr' : '/mo';
});
}
if (pricingToggle) pricingToggle.addEventListener('change', e=> setPeriod(e.target.checked));

// Count-up stats in hero
const counters = $$('.count');
const obs = new IntersectionObserver((entries)=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
const el = entry.target; const to = parseFloat(el.dataset.count);
animateNumber(el, to); obs.unobserve(el);
}
});
},{threshold:0.6});
counters.forEach(c=>obs.observe(c));

// Swiper Testimonials
const swiper = new Swiper('#testimonialSwiper', {
slidesPerView: 1,
spaceBetween: 20,
loop: true,
centeredSlides: true,
autoplay: { delay: 4000, disableOnInteraction: false },
pagination: { el: '.swiper-pagination', clickable: true },
navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
keyboard: { enabled: true },
breakpoints: { 900: { slidesPerView: 2 } }
});

// Init AOS
if (window.AOS) AOS.init({ once:true, offset: 80, duration: 600, easing: 'ease-out' });

// Year in footer
$('#year').textContent = new Date().getFullYear();
// === script.js — Kablugen Studios (multipage) === //

// --- MENÚ HAMBURGUESA ---
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
  });

  // Cierra menú al hacer clic en un link
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// --- TRANSICIÓN ENTRE PÁGINAS (fade-out en navegación interna) ---
function enablePageTransitions(){
  const links = document.querySelectorAll('a[data-nav]');
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith('.html')) {
      a.addEventListener('click', function(ev){
        // si ya estamos en la misma página, no forzar
        if (location.pathname.endsWith(href)) return;
        ev.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => { window.location.href = href; }, 250);
      });
    }
  });
}

// --- MARCAR ACTIVO EN NAV SEGÚN data-page (opcional pero útil) ---
function highlightActiveNav(){
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('nav a[data-nav]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(page)) a.classList.add('is-active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
  enablePageTransitions();
  highlightActiveNav();
});

// --- CARRUSEL INFINITO SIN HUECOS (solo si existe en la página) ---
(function(){
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const prevButton = document.querySelector('.carousel-btn.prev');
  const nextButton = document.querySelector('.carousel-btn.next');

  let isMoving = false;
  function slide(dir) {
    if (isMoving) return;
    isMoving = true;

    const card = track.querySelector('.card');
    if (!card) return;

    const gap = 20;
    const width = card.getBoundingClientRect().width + gap;

    track.style.transition = 'transform .5s ease';
    track.style.transform = `translateX(${dir === 'next' ? -width : width}px)`;

    const onEnd = () => {
      track.removeEventListener('transitionend', onEnd);
      if (dir === 'next') {
        track.appendChild(track.firstElementChild);
      } else {
        track.insertBefore(track.lastElementChild, track.firstElementChild);
      }
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      void track.offsetWidth; // reflow
      isMoving = false;
    };
    track.addEventListener('transitionend', onEnd);
  }

  nextButton && nextButton.addEventListener('click', () => slide('next'));
  prevButton && prevButton.addEventListener('click', () => slide('prev'));

  let autoplay = setInterval(() => slide('next'), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => autoplay = setInterval(() => slide('next'), 5000));
})();

// --- PRODUCT SHOWCASE: auto-fade cada 5s, sin flechas (si existe) ---
(function(){
  const slides = document.querySelectorAll('.ps-slide');
  if (!slides.length) return;

  let i = 0;
  const show = (k) => {
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === k));
  };
  show(0);

  setInterval(() => {
    i = (i + 1) % slides.length;
    show(i);
  }, 5000);
})();

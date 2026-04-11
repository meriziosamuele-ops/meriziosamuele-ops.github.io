/* =============================================================================
   Optiform — optiform.js
   Logica specifica della pagina divisione Optiform.
   ============================================================================= */

/* ---------------------------------------------------------------------------
   1. Reveal on scroll — elementi con classe .r
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.r');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('on'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(function (el) { obs.observe(el); });
}());

/* ---------------------------------------------------------------------------
   2. Nav dropdown — apertura/chiusura con click e Escape
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
    var btn = dd.querySelector('.nav-dropdown__btn');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });

    document.addEventListener('click', function () {
      dd.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dd.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}());
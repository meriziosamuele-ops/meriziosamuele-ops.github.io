/* =============================================================================
   floKi s.r.l. — main.js
   Logica UI: navbar scroll state + hamburger mobile menu toggle
   Nessuna dipendenza esterna.
   ============================================================================= */

(function () {
  'use strict';

  var navbar     = document.getElementById('navbar');
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  /* ---------------------------------------------------------------------------
     Navbar: trasparente sulla hero (index.html), opaca sulle pagine interne.
     Su tutte le pagine diventa opaca dopo 24px di scroll.
  --------------------------------------------------------------------------- */
  var isHomepage = document.body.classList.contains('page-home');

  /* Pagine interne — navbar opaca al caricamento */
  if (navbar && !isHomepage) {
    navbar.classList.add('navbar--solid');
  }

  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 24) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  if (navbar) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------------------
     Hamburger: toggle menu mobile
  --------------------------------------------------------------------------- */
  function openMenu() {
    hamburger.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Chiudi menu');
  }

  function closeMenu() {
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Apri menu');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Chiude al click su qualsiasi link del menu mobile
    var mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Chiude se la finestra viene allargata oltre il breakpoint mobile
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });
  }


  /* ---------------------------------------------------------------------------
     Back to top: mostra il pulsante dopo 300px di scroll, click → top
  --------------------------------------------------------------------------- */
  var backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  if (backToTop) {
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop(); // stato iniziale

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

  /* ---------------------------------------------------------------------------
     Hero counters — anima i valori numerici al primo scroll visible
     Usa IntersectionObserver; fallback immediato se non supportato.
  --------------------------------------------------------------------------- */
  (function () {
    function animateCounter(el) {
      var target = parseInt(el.dataset.counter, 10);
      if (isNaN(target)) return;
      var suffix = el.dataset.suffix || '';
      var start  = null;
      var dur    = 1400;

      function step(ts) {
        if (!start) start = ts;
        var p    = Math.min((ts - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { obs.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }
  }());

  /* ---------------------------------------------------------------------------
     Hero wheel-trap
     Il viewer Spline ha pointer-events:none — non riceve wheel events, quindi
     non può zoomare. Il trap rilancia solo i pointer events (mouse follow robot)
     senza intercettare lo scroll: nessun preventDefault, scroll compositor-driven.
  --------------------------------------------------------------------------- */
  (function () {
    var trap   = document.getElementById('hero-wheel-trap');
    var viewer = document.querySelector('.hero-scene__spline');
    if (!trap || !viewer) return;

    /* Attende che Spline crei il canvas nello shadow DOM prima di cacharlo */
    var canvas = null;
    function getCanvas() {
      if (canvas) return canvas;
      var shadow = viewer.shadowRoot;
      if (shadow) canvas = shadow.querySelector('canvas');
      return canvas;
    }

    /* Re-dispatcha i pointer events sul canvas Spline per il mouse follow.
       Nessun wheel listener — lo scroll rimane gestito dal compositor (fluido). */
    function relayPointer(e) {
      var c = getCanvas();
      if (!c) return;
      c.dispatchEvent(new PointerEvent(e.type, {
        bubbles:     true,
        cancelable:  true,
        clientX:     e.clientX,
        clientY:     e.clientY,
        screenX:     e.screenX,
        screenY:     e.screenY,
        movementX:   e.movementX,
        movementY:   e.movementY,
        pointerId:   e.pointerId,
        pointerType: e.pointerType,
        pressure:    e.pressure,
        isPrimary:   e.isPrimary
      }));
    }

    ['pointermove', 'pointerdown', 'pointerup',
     'pointerenter', 'pointerleave', 'pointerover'].forEach(function (type) {
      trap.addEventListener(type, relayPointer, { passive: true });
    });

  }());
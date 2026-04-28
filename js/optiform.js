/* =============================================================================
   floKi s.r.l. — optiform.js  (rev 2 — allineato a schede-elettroniche.js)

   Moduli:
   0. Cursore custom (dot + ring) — accento verde Optiform
   1. Navbar scroll state
   2. Reveal on scroll — .r / .on  (classi CSS optiform.css)
   3. Reveal on scroll — .reveal / .is-visible  (classi CSS base.css)
   4. Nav dropdown
   5. Mobile navigation drawer
   6. Counter animation — data-counter
   7. Why-chain stagger
   8. Stack badges stagger (showcase)
   9. Scroll-to-top
   ============================================================================= */

/* ---------------------------------------------------------------------------
   0. Cursore custom — dot + ring magnetico
   Solo su device con hover. Identico a schede-elettroniche.js.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (window.matchMedia('(hover: none)').matches) return;

  var dot  = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  var dotX = 0, dotY = 0;
  var ringX = 0, ringY = 0;

  document.addEventListener('mousemove', function (e) {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  }, { passive: true });

  (function animateRing() {
    ringX += (dotX - ringX) * 0.14;
    ringY += (dotY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }());

  /* Hover su elementi interattivi — include card specifiche di Optiform */
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('a, button, [data-cursor-hover], .prod, .crosslink-card, .why-card, .feat, .arch-banner')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('a, button, [data-cursor-hover], .prod, .crosslink-card, .why-card, .feat, .arch-banner')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mouseleave', function () { document.body.classList.add('cursor-out'); });
  document.addEventListener('mouseenter', function () { document.body.classList.remove('cursor-out'); });
}());

/* ---------------------------------------------------------------------------
   1. Navbar scroll state — aggiunge is-scrolled dopo 24px
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

/* ---------------------------------------------------------------------------
   2. Reveal on scroll — .r / .on  (optiform.css)
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
   3. Reveal on scroll — .reveal / .is-visible  (base.css)
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

  reveals.forEach(function (el) { obs.observe(el); });
}());

/* ---------------------------------------------------------------------------
   4. Nav dropdown — apertura/chiusura con click e Escape
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
    var btn = dd.querySelector('.nav-dropdown__btn');
    if (!btn) return;

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

/* ---------------------------------------------------------------------------
   5. Mobile navigation — drawer laterale con backdrop
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var toggle   = document.getElementById('navToggle');
  var panel    = document.getElementById('mobileNav');
  if (!toggle || !panel) return;

  var backdrop = document.getElementById('mobileNavBackdrop');
  var links    = panel.querySelectorAll('.mobile-nav__links a, .mobile-nav__cta');

  function setOpen(open) {
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    document.body.classList.toggle('menu-open', open);

    if (open) {
      var first = panel.querySelector('.mobile-nav__links a');
      if (first) {
        window.requestAnimationFrame(function () {
          try { first.focus(); } catch (err) {}
        });
      }
    }
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!panel.classList.contains('is-open'));
  });

  if (backdrop) {
    backdrop.addEventListener('click', function () { setOpen(false); });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}());

/* ---------------------------------------------------------------------------
   6. Counter animation — data-counter
   Usato nelle stats-compact della sezione Tecnologia
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target   = parseInt(el.dataset.counter, 10);
    var suffix   = el.dataset.suffix || '';
    var duration = target <= 10 ? 700 : target <= 30 ? 900 : 1400;
    if (isNaN(target)) return;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.round(easeOutCubic(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    counters.forEach(function (el) { obs.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }
}());

/* ---------------------------------------------------------------------------
   7. Why-chain stagger — le voci della catena processo entrano in sequenza
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var chain = document.querySelector('.why-card__chain');
  if (!chain || !('IntersectionObserver' in window)) return;

  var items = chain.querySelectorAll('span');
  items.forEach(function (item) {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(8px)';
    item.style.transition = 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)';
  });

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      items.forEach(function (item, i) {
        setTimeout(function () {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, i * 75);
      });
    }
  }, { threshold: 0.5 }).observe(chain);
}());

/* ---------------------------------------------------------------------------
   8. Stack badges stagger — usato su eventuali sezioni con .prj-showcase__stack
   (opzionale su Optiform, ma presente per coerenza cross-page)
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var showcaseStack = document.querySelector('.prj-showcase__stack');
  if (!showcaseStack) return;

  var badges = showcaseStack.querySelectorAll('.stack-badge');
  badges.forEach(function (b) {
    b.style.opacity   = '0';
    b.style.transform = 'translateY(6px)';
    b.style.transition = 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
  });

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      badges.forEach(function (b, i) {
        setTimeout(function () {
          b.style.opacity   = '1';
          b.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }
  }, { threshold: 0.6 }).observe(showcaseStack);
}());

/* ---------------------------------------------------------------------------
   9. Scroll-to-top — visibilità al superamento dei 300px e click fluido
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());
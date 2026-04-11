/* =============================================================================
   floKi s.r.l. — main.js
   ============================================================================= */

/* ---------------------------------------------------------------------------
   1. Navbar scroll state
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
   2. Counter animation
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
   3. Stats extra — reveal con linea verticale
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  var items = document.querySelectorAll('.stats-extra__item');
  if (!items.length) { items.forEach(function (el) { el.classList.add('is-visible'); }); return; }
  if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('is-visible'); }); return; }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  items.forEach(function (el) { obs.observe(el); });
}());

/* ---------------------------------------------------------------------------
   4. Reveal on scroll — tutti gli elementi con classe .reveal
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
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

  reveals.forEach(function (el) { obs.observe(el); });
}());

/* ---------------------------------------------------------------------------
   5. Particle canvas — hero background
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];
  var RAF;

  var COLORS = [
    'rgba(37, 99, 235, 0.18)',
    'rgba(37, 99, 235, 0.09)',
    'rgba(217, 119, 6, 0.12)',
    'rgba(217, 119, 6, 0.06)',
    'rgba(100, 116, 139, 0.07)',
  ];

  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 2.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = 200 + Math.random() * 300;
  };
  Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife || this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
      this.reset(); this.life = 0;
    }
  };
  Particle.prototype.draw = function () {
    var alpha = Math.sin((this.life / this.maxLife) * Math.PI);
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };

  function init() {
    particles = [];
    var count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 60);
    for (var i = 0; i < count; i++) {
      var p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife);
      particles.push(p);
    }
  }

  function drawConnections() {
    var maxDist = 120;
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.save(); ctx.globalAlpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = 'rgba(37, 99, 235, 1)'; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    particles.forEach(function (p) { p.update(); p.draw(); });
    RAF = requestAnimationFrame(loop);
  }

  resize(); init(); loop();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { cancelAnimationFrame(RAF); resize(); init(); loop(); }, 200);
  });

  if ('IntersectionObserver' in window) {
    var heroSection = document.getElementById('home');
    if (heroSection) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) loop(); else cancelAnimationFrame(RAF);
      }, { threshold: 0 }).observe(heroSection);
    }
  }
}());

/* ---------------------------------------------------------------------------
   6. Parallax hero image
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  var heroImg = document.querySelector('.hero__img');
  if (!heroImg) return;
  var hero = document.getElementById('home');
  function onScroll() {
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    var shift = Math.min(Math.max((-rect.top / hero.offsetHeight) * 40, -20), 20);
    heroImg.style.transform = 'translateY(' + shift + 'px)';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}());

/* ---------------------------------------------------------------------------
   7. (tilt 3D rimosso) — hover via CSS translateY
--------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   8. Why-chain: stagger sequenziale
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  var chain = document.querySelector('.why-card__chain');
  if (!chain || !('IntersectionObserver' in window)) return;
  var items = chain.querySelectorAll('span');
  items.forEach(function (item) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(8px)';
    item.style.transition = 'opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.45s cubic-bezier(0.22,1,0.36,1)';
  });
  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      items.forEach(function (item, i) {
        setTimeout(function () {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, i * 75);
      });
    }
  }, { threshold: 0.5 }).observe(chain);
}());

/* ---------------------------------------------------------------------------
   9. Stat boxes hero — fade-in stagger (integra l'animazione CSS)
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  /* Le stat box entrano già via animation CSS nel container .stats-float.
     Aggiungiamo stagger ai singoli .stat-box per un effetto più ricco. */
  var boxes = document.querySelectorAll('.stat-box');
  boxes.forEach(function (box, i) {
    box.style.opacity = '0';
    box.style.transform = 'translateY(10px)';
    box.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    box.style.transitionDelay = (0.65 + i * 0.09) + 's';
    /* Fa partire la transizione dopo load */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
      });
    });
  });
}());

/* ---------------------------------------------------------------------------
   10. Stack badges nelle referenze — entrano in sequenza al viewport
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var showcaseStack = document.querySelector('.prj-showcase__stack');
  if (!showcaseStack) return;

  var badges = showcaseStack.querySelectorAll('.stack-badge');
  badges.forEach(function (b) {
    b.style.opacity = '0';
    b.style.transform = 'translateY(6px)';
    b.style.transition = 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)';
  });

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      badges.forEach(function (b, i) {
        setTimeout(function () {
          b.style.opacity = '1';
          b.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }
  }, { threshold: 0.6 }).observe(showcaseStack);
}());

/* ---------------------------------------------------------------------------
   11. Scroll to top — visibilità e animazione
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  // Usa l'ID corretto che hai nel CSS e nell'HTML (#scroll-to-top)
  var scrollBtn = document.querySelector('#scroll-to-top'); 
  if (!scrollBtn) return;

  // Gestione visibilità al variare dello scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  // Gestione click per risalita fluida
  scrollBtn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}());


/* ---------------------------------------------------------------------------
   12. Language Switcher (Dropdown)
--------------------------------------------------------------------------- */
(function () {
  'use strict';
  
  var langSwitcher = document.getElementById('langSwitcher');
  if (!langSwitcher) return;

  var btn = langSwitcher.querySelector('.lang-switcher__btn');

  // Apri/Chiudi al click
  btn.addEventListener('click', function (e) {
    e.stopPropagation(); // Evita che il click si propaghi al document
    langSwitcher.classList.toggle('is-open');
    var isOpen = langSwitcher.classList.contains('is-open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Chiudi cliccando fuori dal selettore
  document.addEventListener('click', function (e) {
    if (!langSwitcher.contains(e.target)) {
      langSwitcher.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}());

/* ---------------------------------------------------------------------------
   13. Mobile navigation (drawer)
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;

  var backdrop = document.getElementById('mobileNavBackdrop');
  var links = panel.querySelectorAll('.mobile-nav__links a, .mobile-nav__cta');

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
          try { first.focus(); } catch (e) {}
        });
      }
    }
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    setOpen(!panel.classList.contains('is-open'));
  });

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}());
/* ---------------------------------------------------------------------------
   14. Nav dropdown — apertura/chiusura con click e Escape
   (gestisce il dropdown "Divisioni" nella navbar principale)
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
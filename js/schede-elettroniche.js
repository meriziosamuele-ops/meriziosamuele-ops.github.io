/* =============================================================================
   floKi s.r.l. — schede-elettroniche.js
   Logica specifica della pagina Schede Elettroniche.
   Non include dropdown né mobile nav (già gestiti da main.js).
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
   2. PCB diagram — animazione trace sequenziale
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var traces = document.querySelectorAll('.pcb-trace');
  if (!traces.length) return;

  traces.forEach(function (trace, i) {
    trace.style.opacity = '0';
    trace.style.transition = 'opacity 0.4s ease';
    setTimeout(function () {
      trace.style.opacity = '1';
    }, 200 + i * 80);
  });
}());

/* ---------------------------------------------------------------------------
   3. PCB chip tooltip — mostra data-label al hover
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var chips = document.querySelectorAll('.pcb-chip[data-label]');
  if (!chips.length) return;

  chips.forEach(function (chip) {
    chip.style.cursor = 'default';

    chip.addEventListener('mouseenter', function () {
      var label = chip.getAttribute('data-label');
      if (!label) return;
      var tip = document.createElement('div');
      tip.className = 'pcb-tooltip';
      tip.textContent = label;
      tip.style.cssText = [
        'position:absolute',
        'bottom:calc(100% + 6px)',
        'left:50%',
        'transform:translateX(-50%)',
        'background:#0d1628',
        'color:rgba(6,182,212,0.9)',
        'font-family:\'JetBrains Mono\',monospace',
        'font-size:0.6rem',
        'font-weight:600',
        'letter-spacing:0.1em',
        'padding:4px 8px',
        'border:1px solid rgba(6,182,212,0.3)',
        'border-radius:3px',
        'white-space:nowrap',
        'pointer-events:none',
        'z-index:10',
        'opacity:0',
        'transition:opacity 0.2s ease'
      ].join(';');
      chip.style.position = 'relative';
      chip.appendChild(tip);
      requestAnimationFrame(function () { tip.style.opacity = '1'; });
    });

    chip.addEventListener('mouseleave', function () {
      var tip = chip.querySelector('.pcb-tooltip');
      if (!tip) return;
      tip.style.opacity = '0';
      setTimeout(function () { if (tip.parentNode) tip.parentNode.removeChild(tip); }, 200);
    });
  });
}());

/* ---------------------------------------------------------------------------
   4. Statusbar — clock in tempo reale
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var bar = document.querySelector('.pcb-statusbar');
  if (!bar) return;

  var clockSpan = document.createElement('span');
  clockSpan.style.cssText = 'margin-left:auto;opacity:0.5;font-size:0.58rem;';
  bar.appendChild(clockSpan);

  function tick() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    var ss = String(now.getSeconds()).padStart(2, '0');
    clockSpan.textContent = hh + ':' + mm + ':' + ss;
  }
  tick();
  setInterval(tick, 1000);
}());

/* ---------------------------------------------------------------------------
   5. Step cards — stagger reveal più marcato
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var steps = document.querySelectorAll('.se-step');
  if (!steps.length || !('IntersectionObserver' in window)) return;

  steps.forEach(function (step, i) {
    step.style.transitionDelay = (i % 2 === 0 ? 0 : 0.1) + 's';
  });
}());

/* ---------------------------------------------------------------------------
   6. Board diagnostica — animazione valori ciclica
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var cyclesEl = document.querySelector('.board-diag__value:not(.board-diag__value--ok):not(.board-diag__value--warn)');
  if (!cyclesEl) return;

  var base = 48291;
  setInterval(function () {
    base += Math.floor(Math.random() * 3);
    cyclesEl.textContent = base.toLocaleString('it-IT');
  }, 3000);
}());
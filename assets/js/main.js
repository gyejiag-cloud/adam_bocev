/* ==========================================================================
   FounderOS — Interactions
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Sticky nav ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var mobile = document.querySelector('.nav__mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('is-active');
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Animated score dial + metric bars ---------- */
  var animateOnce = function (el, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fn(); ob.disconnect(); }
      });
    }, { threshold: 0.4 });
    ob.observe(el);
  };

  document.querySelectorAll('.dial').forEach(function (dial) {
    var fill = dial.querySelector('.fill');
    var out  = dial.querySelector('[data-count]');
    var score = parseFloat(dial.getAttribute('data-score') || '0');
    animateOnce(dial, function () {
      if (fill) fill.style.strokeDashoffset = String(314 - (314 * score) / 100);
      if (out) {
        var start = null, dur = 1600;
        var tick = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          out.textContent = Math.round(score * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
  });

  document.querySelectorAll('.metric__bar').forEach(function (bar) {
    var inner = bar.querySelector('i');
    var val = bar.getAttribute('data-val') || '0';
    animateOnce(bar, function () {
      setTimeout(function () { if (inner) inner.style.width = val + '%'; }, 180);
    });
  });

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-to]').forEach(function (el) {
    var target = parseFloat(el.getAttribute('data-to'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    animateOnce(el, function () {
      var start = null, dur = 1500;
      var tick = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      };
      requestAnimationFrame(tick);
    });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var btns = group.querySelectorAll('.tab');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-tab');
        btns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        group.querySelectorAll('.tab-panel').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-panel') === id);
        });
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      var parent = item.closest('.faq');
      if (parent) {
        parent.querySelectorAll('.faq__item.is-open').forEach(function (o) {
          o.classList.remove('is-open');
          o.querySelector('.faq__a').style.maxHeight = null;
          o.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        });
      }
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Pricing toggle ---------- */
  var sw = document.querySelector('.switch');
  if (sw) {
    var apply = function (yearly) {
      document.querySelectorAll('[data-m]').forEach(function (el) {
        el.textContent = yearly ? el.getAttribute('data-y') : el.getAttribute('data-m');
      });
      document.querySelectorAll('[data-billed]').forEach(function (el) {
        el.textContent = yearly ? 'Billed annually · 2 months free' : 'Billed monthly · cancel anytime';
      });
    };
    sw.addEventListener('click', function () {
      var on = sw.classList.toggle('is-on');
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      apply(on);
    });
  }

  /* ---------- Card pointer glow ---------- */
  document.querySelectorAll('.card--glow').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  /* ---------- Forms (front-end demo handling) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__ok');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      setTimeout(function () {
        if (ok) ok.classList.add('is-shown');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      }, 700);
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

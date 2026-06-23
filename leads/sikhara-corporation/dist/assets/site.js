/* Sikhara Corporation — shared interactions (no dependencies) */
(function () {
  'use strict';

  /* ---------- header: solid on scroll ---------- */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero, .page-banner');
  function onScroll() {
    if (!header) return;
    var threshold = hero ? Math.min(hero.offsetHeight - 90, window.innerHeight * 0.6) : 40;
    header.classList.toggle('is-solid', window.scrollY > threshold);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  if (menu) menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { setMenu(false); closeLightbox(); }
  });

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- stat counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = Number(val).toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- portfolio filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var items = document.querySelectorAll('.gitem');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');
      filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      items.forEach(function (it) {
        var match = cat === 'all' || it.getAttribute('data-cat') === cat;
        it.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.querySelector('.lightbox');
  var lbImg = lb && lb.querySelector('img');
  var lbCap = lb && lb.querySelector('.lightbox__cap');
  var current = -1;
  var list = Array.prototype.slice.call(items);

  function openLightbox(i) {
    if (!lb) return;
    var visible = list.filter(function (it) { return !it.classList.contains('is-hidden'); });
    current = visible.indexOf(list[i]);
    list = visible;
    show();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function show() {
    var it = list[current];
    if (!it) return;
    var src = it.getAttribute('data-full') || (it.querySelector('img') && it.querySelector('img').src);
    var title = it.getAttribute('data-title') || '';
    var cat = it.getAttribute('data-cat-label') || '';
    lbImg.src = src;
    lbImg.alt = title;
    if (lbCap) lbCap.innerHTML = '<b>' + title + '</b>' + cat;
  }
  function closeLightbox() {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function step(dir) {
    if (!list.length) return;
    current = (current + dir + list.length) % list.length;
    show();
  }
  items.forEach(function (it, i) {
    it.addEventListener('click', function () { openLightbox(i); });
  });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });
    var c = lb.querySelector('.lb-close'); if (c) c.addEventListener('click', closeLightbox);
    var p = lb.querySelector('.lb-prev'); if (p) p.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    var n = lb.querySelector('.lb-next'); if (n) n.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear() + 543; // พ.ศ.
})();

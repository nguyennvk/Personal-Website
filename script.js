(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });

  // Header border + scroll progress
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    const max = doc.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    revealVisible();
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(onScroll));
  window.addEventListener('load', onScroll);

  // Scroll-spy
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navAnchors.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => {
        const active = a.getAttribute('href') === `#${entry.target.id}`;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll — position-based so anchor jumps / mid-page reloads never leave content hidden
  let pending = [...document.querySelectorAll('.reveal')];
  const revealVisible = () => {
    if (!pending.length) return;
    const limit = window.innerHeight * 0.95;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
      return true;
    });
  };
  if (reduceMotion) { pending.forEach((el) => el.classList.add('in')); pending = []; }

  onScroll();

  // Count-up stats
  const counters = document.querySelectorAll('[data-count]');
  const fmt = new Intl.NumberFormat('en-US');
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1100;
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduceMotion) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // Project filters
  const chips = document.querySelectorAll('.chip');
  const projects = document.querySelectorAll('.project');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      projects.forEach((p) => {
        const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('in');
      });
    });
  });

  // Copy email
  const copyBtn = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  copyBtn?.addEventListener('click', async () => {
    const label = copyBtn.querySelector('span');
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      label.textContent = 'Copied!';
      status.textContent = 'Email address copied to clipboard';
    } catch {
      label.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => { label.textContent = 'Copy email'; status.textContent = ''; }, 2000);
  });
})();

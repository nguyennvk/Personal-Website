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
  const toTop = document.querySelector('.to-top');
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 8);
    toTop?.classList.toggle('show', y > window.innerHeight * 1.2);
    const max = doc.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    revealVisible();
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(onScroll));
  window.addEventListener('load', () => { onScroll(); setTimeout(onScroll, 700); });

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

  // Tabs (WAI-ARIA pattern) — each [role=tablist] is an independent group,
  // so the case-study tabs and the KinMeet feature sub-tabs don't interfere.
  const groupOf = (tab) => [...tab.closest('[role="tablist"]').querySelectorAll(':scope > [role="tab"]')];
  const selectTab = (tab, focus = true) => {
    groupOf(tab).forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    if (tab.classList.contains('subtab')) tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const group = [...list.querySelectorAll(':scope > [role="tab"]')];
    group.forEach((tab, i) => {
      tab.addEventListener('click', () => selectTab(tab, false));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); selectTab(group[(i + keys[e.key] + group.length) % group.length]); }
        else if (e.key === 'Home') { e.preventDefault(); selectTab(group[0]); }
        else if (e.key === 'End') { e.preventDefault(); selectTab(group[group.length - 1]); }
      });
    });
  });

  // Command palette (Cmd/Ctrl+K or "/")
  const kbar = document.getElementById('kbar');
  const kInput = document.getElementById('kbar-input');
  const kList = document.getElementById('kbar-list');
  const contactAddr = copyBtn?.dataset.email || '';
  const goTo = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  const openUrl = (url) => () => window.open(url, '_blank', 'noopener');
  const showCase = (tabId, subId) => () => {
    selectTab(document.getElementById(tabId), false);
    if (subId) selectTab(document.getElementById(subId), false);
    goTo('deep-dives')();
  };
  const commands = [
    { group: 'Sections', label: 'About', icon: 'i-hash', run: goTo('about') },
    { group: 'Sections', label: 'Experience', icon: 'i-hash', run: goTo('experience') },
    { group: 'Sections', label: 'Deep dives — case studies', icon: 'i-hash', run: goTo('deep-dives') },
    { group: 'Sections', label: 'Projects', icon: 'i-hash', run: goTo('projects') },
    { group: 'Sections', label: 'Skills', icon: 'i-hash', run: goTo('skills') },
    { group: 'Sections', label: 'Education', icon: 'i-hash', run: goTo('education') },
    { group: 'Sections', label: 'Contact', icon: 'i-hash', run: goTo('contact') },
    { group: 'Case studies', label: 'KinMeet — full-stack social app', icon: 'i-code', run: showCase('tab-media') },
    { group: 'Case studies', label: 'KinMeet — image & voice messaging', icon: 'i-code', run: showCase('tab-media', 'st-media') },
    { group: 'Case studies', label: 'KinMeet — accounts & session revocation', icon: 'i-code', run: showCase('tab-media', 'st-session') },
    { group: 'Case studies', label: 'KinMeet — blocking & reporting', icon: 'i-code', run: showCase('tab-media', 'st-safety') },
    { group: 'Case studies', label: 'KinMeet — mobile onboarding & Discover', icon: 'i-phone', run: showCase('tab-media', 'st-mobile') },
    { group: 'Case studies', label: 'Instructli — RISC-V simulator', icon: 'i-cpu', run: showCase('tab-sim') },
    { group: 'Case studies', label: 'GHN — data quality & lineage', icon: 'i-db', run: showCase('tab-dq') },
    { group: 'Links', label: 'GitHub', hint: 'nguyennvk', icon: 'i-github', run: openUrl('https://github.com/nguyennvk') },
    { group: 'Links', label: 'LinkedIn', hint: 'khoi-nguyen-nguyen-vo', icon: 'i-linkedin', run: openUrl('https://www.linkedin.com/in/khoi-nguyen-nguyen-vo') },
    { group: 'Links', label: 'Send an email', icon: 'i-mail', run: () => { window.location.href = 'mailto:' + contactAddr; } },
    { group: 'Links', label: 'Copy email address', icon: 'i-copy', run: () => navigator.clipboard?.writeText(contactAddr) },
  ];
  let filtered = commands;
  let activeIdx = 0;
  const updateActive = () => {
    kList.querySelectorAll('.kbar-item').forEach((el) => el.setAttribute('aria-selected', String(el.id === `kbar-opt-${activeIdx}`)));
    const el = document.getElementById(`kbar-opt-${activeIdx}`);
    if (el) { kInput.setAttribute('aria-activedescendant', el.id); el.scrollIntoView({ block: 'nearest' }); }
  };
  const renderK = () => {
    const q = kInput.value.trim().toLowerCase();
    filtered = commands.filter((c) => `${c.label} ${c.group} ${c.hint || ''}`.toLowerCase().includes(q));
    activeIdx = Math.min(activeIdx, Math.max(filtered.length - 1, 0));
    kList.innerHTML = '';
    if (!filtered.length) {
      kList.innerHTML = '<li class="kbar-empty" role="presentation">No results</li>';
      kInput.removeAttribute('aria-activedescendant');
      return;
    }
    let lastGroup = '';
    filtered.forEach((c, i) => {
      if (c.group !== lastGroup) {
        const g = document.createElement('li');
        g.className = 'kbar-group'; g.setAttribute('role', 'presentation'); g.textContent = c.group;
        kList.appendChild(g); lastGroup = c.group;
      }
      const li = document.createElement('li');
      li.className = 'kbar-item'; li.id = `kbar-opt-${i}`; li.setAttribute('role', 'option');
      li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${c.icon}"/></svg><span></span>${c.hint ? '<span class="kbar-hint"></span>' : ''}`;
      li.querySelector('span').textContent = c.label;
      if (c.hint) li.querySelector('.kbar-hint').textContent = c.hint;
      li.addEventListener('mousemove', () => { if (activeIdx !== i) { activeIdx = i; updateActive(); } });
      li.addEventListener('click', () => runK(i));
      kList.appendChild(li);
    });
    updateActive();
  };
  const openK = () => {
    if (kbar.open) return;
    setMenu(false);
    kInput.value = ''; activeIdx = 0; renderK();
    kbar.showModal(); kInput.focus();
  };
  const closeK = () => { if (kbar.open) kbar.close(); };
  const runK = (i) => { const c = filtered[i]; closeK(); c?.run(); };

  document.querySelector('.kbar-trigger')?.addEventListener('click', openK);
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); kbar.open ? closeK() : openK(); }
    else if (e.key === '/' && !kbar.open && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openK(); }
  });
  kInput.addEventListener('input', () => { activeIdx = 0; renderK(); });
  kInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (filtered.length) { activeIdx = (activeIdx + 1) % filtered.length; updateActive(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (filtered.length) { activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; updateActive(); } }
    else if (e.key === 'Enter') { e.preventDefault(); runK(activeIdx); }
  });
  kbar.addEventListener('click', (e) => { if (e.target === kbar) closeK(); });

  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
    document.querySelectorAll('.kbd-hint').forEach((k) => { k.textContent = 'Ctrl K'; });
  }
})();

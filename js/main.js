(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 모바일 메뉴
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? '메뉴 닫기' : '메뉴 열기';
  };
  toggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.tagName === 'A') setNav(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });

  // 팀별 고민 아코디언
  document.querySelectorAll('.team').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !open);
      document.getElementById(btn.getAttribute('aria-controls')).hidden = open;
    });
  });
  const first = document.querySelector('.team');
  if (first) first.click();

  // 스크롤 등장 + 막대 + 숫자 카운트
  const fmt = (n) => n.toLocaleString('ko-KR');
  const count = (el) => {
    const target = +el.dataset.count;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce) return;
    const start = performance.now(), dur = 1200;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = pre + fmt(Math.round(target * (1 - Math.pow(1 - p, 3)))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  document.querySelectorAll('.section .wrap > *:not(h2)').forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      el.querySelectorAll('.bars').forEach((b) => b.classList.add('is-in'));
      el.querySelectorAll('[data-count]').forEach(count);
      io.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // 현재 섹션 메뉴 강조
  const links = [...nav.querySelectorAll('a')];
  const so = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach((a) => { const s = document.querySelector(a.hash); if (s) so.observe(s); });
})();

(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navPanel = document.querySelector('[data-nav-panel]');
  const closeNav = () => {
    if (!navToggle || !navPanel) return;
    navToggle.classList.remove('is-open');
    navPanel.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      const open = navPanel.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navPanel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[data-site-nav]')) closeNav();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
      closeNav();
    });
  });

  const track = document.querySelector('[data-testimonial-track]');
  if (track) {
    const slides = Array.from(track.querySelectorAll('[data-testimonial-slide]'));
    const prev = document.querySelector('[data-slider-prev]');
    const next = document.querySelector('[data-slider-next]');
    const progress = document.querySelector('[data-slider-progress]');
    let index = 0;

    const perView = () => {
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 900) return 2;
      return 1;
    };
    const maxIndex = () => Math.max(0, slides.length - perView());
    const gap = () => parseFloat(getComputedStyle(track).gap || '16') || 16;

    const updateSlider = () => {
      if (!slides.length) return;
      index = Math.min(index, maxIndex());
      const slideWidth = slides[0].getBoundingClientRect().width;
      const translate = index * (slideWidth + gap());
      track.style.transform = `translateX(-${translate}px)`;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index >= maxIndex();
      if (progress) {
        const steps = maxIndex();
        const ratio = steps === 0 ? 1 : (index + 1) / (steps + 1);
        progress.style.transform = `scaleX(${ratio})`;
      }
    };

    prev?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      updateSlider();
    });
    next?.addEventListener('click', () => {
      index = Math.min(maxIndex(), index + 1);
      updateSlider();
    });
    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  document.querySelectorAll('[data-faq-item]').forEach((item, idx) => {
    const trigger = item.querySelector('[data-faq-trigger]');
    if (!trigger) return;
    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    setOpen(idx === 0 && item.classList.contains('is-open'));
    trigger.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      document.querySelectorAll('[data-faq-item]').forEach((other) => {
        const otherTrigger = other.querySelector('[data-faq-trigger]');
        other.classList.remove('is-open');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      });
      setOpen(shouldOpen);
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .footer-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.split('#')[0] === current) {
      link.classList.add('current-page');
    }
  });
})();

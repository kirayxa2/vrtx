// Плавный скролл к якорным ссылкам (#download, #features и #discord)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.length <= 1) return; // href="#" без цели — пропускаем
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
// Появление секций ниже hero при скролле (fade-up, как остальные анимации на сайте)
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.products-head, .product-card');
  if (!('IntersectionObserver' in window) || revealTargets.length === 0) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // небольшая ступенчатая задержка для карточек, чтобы не выезжали все разом
        const delay = entry.target.classList.contains('product-card')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 120
          : 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => observer.observe(el));
});

// Наклон карточки продукта по позиции курсора (3D tilt)
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.product-card');
  const MAX_TILT = 10; // максимальный угол наклона в градусах
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return;

  cards.forEach(card => {
    card.addEventListener('pointerenter', () => {
      card.classList.add('tilt-active');
    });

    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // позиция курсора в диапазоне -0.5..0.5 от центра карточки
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;

      const rotateX = (-py * MAX_TILT).toFixed(2);
      const rotateY = (px * MAX_TILT).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // позиция блика в процентах для radial-gradient
      card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = '';
    });
  });
});

// Подтягиваем актуальную ссылку на скачивание из status.json
document.addEventListener('DOMContentLoaded', () => {
  const STATUS_URL = 'https://getvrtx.vercel.app/status.json';
  const downloadLinks = document.querySelectorAll('.product-download[data-default-download]');

  if (downloadLinks.length === 0) return;

  fetch(STATUS_URL, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`status.json request failed: ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data || !data.downloadlink) return;
      downloadLinks.forEach(link => {
        link.setAttribute('href', data.downloadlink);
      });
    })
    .catch(err => {
      // при ошибке остаётся ссылка по умолчанию, зашитая в data-default-download
      console.warn('VRTX: cant get link from status.json, using reserve.', err);
    });
});

// Плавный скролл к якорным ссылкам (#download, #features и т.д.)
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

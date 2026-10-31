(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.section-heading, .placeholder, .evidence-list article');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  targets.forEach(target => {
    target.classList.add('reveal-ready', 'reveal-pending');
    observer.observe(target);
  });
  motion.addEventListener('change', event => {
    if (event.matches) {
      targets.forEach(target => target.classList.remove('reveal-pending'));
      observer.disconnect();
    }
  });
})();

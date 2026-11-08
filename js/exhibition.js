(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.section-heading, .placeholder, .artwork-card, .exhibition-chapter-heading, .evidence-list article');
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

(() => {
  const dialog = document.getElementById('artwork-lightbox');
  if (!dialog) return;

  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('.lightbox-caption');
  const closeButton = dialog.querySelector('.lightbox-close');
  let lastTrigger = null;

  const isArtworkImage = anchor => {
    if (anchor.matches('.ruins-mount')) return true;
    try {
      return /\.(?:png|jpe?g|webp|gif|svg)$/i.test(new URL(anchor.href).pathname);
    } catch {
      return false;
    }
  };

  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || !isArtworkImage(anchor)) return;
    const linkedImage = anchor.querySelector('img');
    const source = anchor.matches('.ruins-mount') && linkedImage
      ? (linkedImage.currentSrc || linkedImage.src)
      : anchor.href;

    event.preventDefault();
    lastTrigger = anchor;
    image.src = source;
    image.alt = linkedImage?.alt || anchor.getAttribute('aria-label') || 'Artwork';
    caption.textContent =
      anchor.closest('figure')?.querySelector('figcaption')?.textContent.trim() ||
      anchor.closest('.artwork-card, .exploration-work')?.querySelector('h4, h3')?.textContent.trim() ||
      image.alt;

    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    closeButton.focus();
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    caption.textContent = '';
    if (lastTrigger?.isConnected) lastTrigger.focus();
  });
})();

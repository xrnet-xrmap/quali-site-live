(async () => {
  try {
    const slot = document.getElementById('site-footer');
    if (!slot) return;
    const res = await fetch('/shared/footer.html', { cache: 'no-store' });
    if (!res.ok) return;
    const html = await res.text();
    // Replace placeholder node with footer HTML
    slot.insertAdjacentHTML('afterend', html);
    slot.remove();
  } catch (_) {}
})();

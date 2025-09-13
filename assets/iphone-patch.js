/* Finds the largest tilted, rounded, absolutely-positioned element (the iPhone mockup)
   and tags it so the CSS above can add a clean, right-side thickness edge.
   Also removes the "Automatic access badge" card image by exact alt/src. */
(function () {
  try {
    // Remove the white badge/card overlay image
    document.querySelectorAll('img[alt="Automatic access badge"], img[src*="automatic-access"]')
      .forEach(el => el.remove());

    // Heuristic: biggest transformed, rounded, absolutely/fixed positioned element = the phone
    const all = Array.from(document.querySelectorAll('body *'));
    const candidates = all.filter(el => {
      const cs = getComputedStyle(el);
      const hasTransform = cs.transform && cs.transform !== 'none';
      const hasRadius = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
        .some(k => (parseFloat(cs[k]) || 0) >= 16);
      const rect = el.getBoundingClientRect();
      const bigEnough = rect.width > 260 && rect.height > 500;
      const absolutelyPlaced = cs.position === 'absolute' || cs.position === 'fixed';
      return hasTransform && hasRadius && bigEnough && absolutelyPlaced;
    });

    const phone = candidates.sort((a, b) =>
      (b.getBoundingClientRect().width * b.getBoundingClientRect().height) -
      (a.getBoundingClientRect().width * a.getBoundingClientRect().height)
    )[0];

    if (phone && !phone.hasAttribute('data-iphone-mockup')) {
      phone.setAttribute('data-iphone-mockup', '');
    }
  } catch (e) {
    console.warn('iphone patch failed:', e);
  }
})();

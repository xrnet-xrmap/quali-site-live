(function injectFooter(){
  const mount = document.getElementById('site-footer') || document.body;

  fetch('/footer.html', { cache: 'no-store' })
    .then(r => r.text())
    .then(html => {
      if (mount.id === 'site-footer') {
        mount.outerHTML = html;
      } else {
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        document.body.appendChild(wrap.firstElementChild);
      }

      const y = document.getElementById('ql-year');
      if (y) y.textContent = new Date().getFullYear();

      const findHeaderLogo = () => (
        document.querySelector('header img') ||
        document.querySelector('.site-header img') ||
        document.querySelector('.site-brand img, .brand img, a[href="/"] img') ||
        document.querySelector('img[alt*="Quali"]')
      );
      const headerLogo = findHeaderLogo();
      const footerLogo = document.getElementById('ql-footer-logo');

      if (footerLogo) {
        if (headerLogo && headerLogo.getAttribute('src')) {
          footerLogo.src = headerLogo.getAttribute('src');
        } else {
          const candidates = [
            '/assets/img/quali-wordmark.svg',
            '/assets/img/quali-logo.svg',
            '/assets/img/logo.svg',
            '/img/quali-wordmark.svg'
          ];
          footerLogo.src = candidates[0];
        }
      }
    })
    .catch(console.error);
})();

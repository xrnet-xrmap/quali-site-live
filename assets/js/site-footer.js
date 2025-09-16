/* Safe global footer injector:
   - If a page already has a footer (.ql-footer or any <footer>), DO NOTHING.
   - Otherwise, append our shared footer at the end of <body>.
   - Reuse header wordmark src for the footer logo.
*/
(function () {
  var hasQualiFooter = document.querySelector('.ql-footer');
  var hasAnyFooter = document.querySelector('footer');
  if (hasQualiFooter || hasAnyFooter) {
    // Keep the existing footer; don't remove anything.
    return;
  }

  // Footer template inline (no network fetch = no 404 risk)
  var tpl = document.createElement('template');
  tpl.innerHTML = '\
<footer class="ql-footer">\
  <div class="ql-footer__inner">\
    <a class="ql-footer__brand" href="/">\
      <img id="ql-footer-logo" alt="Quali.chat wordmark" width="140" height="28" />\
      <span class="sr-only">Quali.chat</span>\
    </a>\
    <nav class="ql-footer__nav">\
      <a href="/">Home</a>\
      <a href="https://quali.chat/faq/" target="_blank" rel="noopener">FAQ</a>\
      <a href="https://quali.chat/support/" target="_blank" rel="noopener">Support</a>\
      <a href="https://quali.chat/terms/" target="_blank" rel="noopener">Terms of Use</a>\
      <a href="https://quali.chat/privacy/" target="_blank" rel="noopener">Privacy Policy</a>\
      <a href="https://quali.chat/acceptable-use-policy/" target="_blank" rel="noopener">Acceptable Use</a>\
      <a href="https://quali.chat/copyright/" target="_blank" rel="noopener">Copyright</a>\
    </nav>\
    <div class="ql-footer__meta">\
      <a href="mailto:support@quali.chat">support@quali.chat</a>\
      <span>© <span id="ql-year"></span> Quali.chat</span>\
    </div>\
  </div>\
</footer>';

  var node = tpl.content.firstElementChild;
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(node);

    // Set copyright year
    var y = document.getElementById('ql-year');
    if (y) y.textContent = new Date().getFullYear();

    // Reuse the header wordmark src
    var headerLogo = (
      document.querySelector('header img') ||
      document.querySelector('.site-header img') ||
      document.querySelector('.site-brand img, .brand img, a[href="/"] img') ||
      document.querySelector('img[alt*="Quali"], img[alt*="quali"]')
    );
    var footerLogo = document.getElementById('ql-footer-logo');
    if (footerLogo) {
      if (headerLogo && headerLogo.getAttribute('src')) {
        footerLogo.src = headerLogo.getAttribute('src');
      } else {
        // Non-blocking fallback (only used if header has no <img>)
        var candidates = [
          "/assets/img/quali-wordmark.svg",
          "/assets/img/quali-logo.svg",
          "/assets/img/logo.svg",
          "/img/quali-wordmark.svg"
        ];
        footerLogo.src = candidates[0];
      }
    }
  });
})();

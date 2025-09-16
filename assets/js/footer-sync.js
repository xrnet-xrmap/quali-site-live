/* Footer Sync: make every page use the EXACT same footer as the homepage.
   - On non-home pages, fetch the homepage, extract <footer>, and replace/append.
   - If a previous injected footer (.ql-footer) exists, remove it first.
   - Tries both "/" and the project base (first path segment) for GitHub Pages.
*/
(function () {
  var path = window.location.pathname;
  var isHome = /\/(?:index\.html)?$/.test(path); // e.g., "/", "/repo/", "/index.html", "/repo/index.html"
  if (isHome) return;

  function candidatesFromPath() {
    var urls = ['/', '/index.html'];
    var parts = path.split('/').filter(Boolean);
    if (parts.length) {
      var base = '/' + parts[0] + '/';
      urls.push(base, base + 'index.html');
    }
    return Array.from(new Set(urls));
  }

  function fetchHomeFooter(urls) {
    // Try candidates in order until one yields a <footer>
    return urls.reduce((chain, url) => {
      return chain.catch(() =>
        fetch(url, { cache: 'no-store' }).then(r => {
          if (!r.ok) throw new Error('Fetch failed: ' + url + ' (' + r.status + ')');
          return r.text();
        }).then(html => {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var footer = doc.querySelector('footer');
          if (!footer) throw new Error('No <footer> on ' + url);
          return footer.outerHTML;
        })
      );
    }, Promise.reject());
  }

  document.addEventListener('DOMContentLoaded', function () {
    var urls = candidatesFromPath();
    fetchHomeFooter(urls).then(function (footerHTML) {
      // Remove previously injected generic footer if present
      var oldInjected = document.querySelector('.ql-footer');
      if (oldInjected) oldInjected.remove();

      var existing = document.querySelector('footer');
      var wrap = document.createElement('div');
      wrap.innerHTML = footerHTML;
      var cloned = wrap.firstElementChild;

      if (existing) {
        existing.replaceWith(cloned);
      } else {
        document.body.appendChild(cloned);
      }
    }).catch(function (err) {
      console.error('Footer sync failed:', err);
    });
  });
})();

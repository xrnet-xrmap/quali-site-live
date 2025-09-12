// ---- minimal style (injected) ----
(() => {
  const css = `
    .token-window {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 82%;
      max-width: 280px;
      background: rgba(255,255,255,0.98);
      border-radius: 16px;
      box-shadow: 0 6px 26px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08);
      padding: 14px 16px;
      text-align: center;
      font-family: inherit;
      z-index: 10;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .token-window h3 {
      margin: 8px 0 4px;
      font-size: 14px;
      line-height: 1.2;
      font-weight: 600;
      letter-spacing: .1px;
      color: #111;
      text-transform: none;
    }
    .token-window p {
      margin: 0;
      font-size: 12px;
      opacity: .8;
    }
    .token-window .token-badge {
      display: block;
      margin: 0 auto 8px;
      max-width: 100%;
      height: auto;
    }
    .phone-target { position: relative; }
  `;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
})();

// ---- fix absolute image paths that break on GitHub Pages ----
(() => {
  document.querySelectorAll('img[src^="/images/"]').forEach(img => {
    const rel = img.getAttribute('src').replace(/^\/images\//, './images/');
    img.setAttribute('src', rel);
  });
})();

// ---- remove the duplicate "quali.chat" that appears above "ethereum" ----
(() => {
  const contains = (el, txt) => el && typeof el.textContent === 'string' && el.textContent.toLowerCase().includes(txt);
  const eth = Array.from(document.querySelectorAll('body *')).find(el => contains(el, 'ethereum'));
  if (eth) {
    let prev = eth.previousElementSibling;
    while (prev && !contains(prev, 'quali.chat')) prev = prev.previousElementSibling;
    if (prev) prev.style.display = 'none';
  } else {
    // fallback: if we find multiple "quali.chat", keep the first, hide the rest
    const nodes = Array.from(document.querySelectorAll('body *')).filter(el => contains(el, 'quali.chat'));
    if (nodes.length > 1) nodes.slice(1).forEach(n => n.style.display = 'none');
  }
})();

// ---- add the “you were added to your token chats” window inside the iPhone mockup ----
(() => {
  // Try a few likely selectors used for phone mockups
  const selectors = ['#iphone-mockup', '.mockup-phone', '.phone', '.iphone', '[data-phone]', '.phone-mockup'];
  let phone = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) { phone = el; break; }
  }
  // If not found, treat <main> (or <body>) as fallback container
  if (!phone) phone = document.querySelector('main') || document.body;
  phone.classList.add('phone-target');

  const wrap = document.createElement('div');
  wrap.className = 'token-window';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-live', 'polite');
  wrap.innerHTML = `
    <img class="token-badge" src="./images/automatic-access.png" alt="Automatic access badge" />
    <h3>you were added to your token chats</h3>
    <p>quali.chat</p>
  `;
  phone.appendChild(wrap);
})();

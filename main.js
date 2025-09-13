// v2 — iPhone 3D thickness + glass window
(() => {
  // remove any old window from prior patch
  document.querySelectorAll('.token-window').forEach(n => n.remove());
})();

// ---- styles ----
(() => {
  const css = `
    /* iPhone-like 3D frame & thickness */
    .phone-3d { position: relative; isolation: isolate; }
    .phone-3d {
      perspective: 1200px;
      transform: rotateY(-14deg) rotateX(2deg);
      transform-style: preserve-3d;
      border-radius: 30px;
      box-shadow:
        0 30px 60px rgba(0,0,0,.25),
        0 12px 24px rgba(0,0,0,.18),
        0 2px 6px rgba(0,0,0,.12);
    }
    /* side rim & thickness slab */
    .phone-3d::before{
      content:"";
      position:absolute;
      inset:-6px;
      border-radius: 34px;
      background:
        linear-gradient(180deg,#cfd6df 0%,#7e8792 40%,#51565f 100%);
      transform: translateZ(-10px);
      filter: saturate(90%);
      z-index:0;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.35),
        0 10px 30px rgba(0,0,0,.28);
    }
    /* edge highlight */
    .phone-3d::after{
      content:"";
      position:absolute;
      inset:-6px;
      border-radius:34px;
      background:
        linear-gradient(120deg,rgba(255,255,255,.45),rgba(255,255,255,0) 35%);
      transform: translateZ(-8px);
      z-index:0;
      pointer-events:none;
      mix-blend-mode: screen;
    }

    /* Overlay card (dark glassmorphism) */
    .token-window {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: clamp(220px, 78%, 300px);
      padding: 16px 18px;
      border-radius: 16px;
      background: linear-gradient( to bottom right,
        rgba(20,22,31,.55),
        rgba(12,12,16,.45) );
      border: 1px solid rgba(255,255,255,.14);
      box-shadow:
        0 24px 60px rgba(0,0,0,.35),
        inset 0 0 0 1px rgba(255,255,255,.06);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      text-align: center;
      z-index: 10;
      color: #fff;
    }
    .token-window h3{
      margin: 10px 0 6px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.1px;
      text-transform: uppercase;
    }
    .token-window p{
      margin: 0;
      font-size: 11px;
      opacity: .9;
      letter-spacing: 1.6px;
      text-transform: uppercase;
    }
    .token-window .token-badge{
      display:block;
      margin: 0 auto 10px;
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 8px 22px rgba(0,0,0,.35));
    }
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

// ---- remove duplicate "quali.chat" above "ethereum" (keep first) ----
(() => {
  const contains = (el, txt) => el && typeof el.textContent === 'string' && el.textContent.toLowerCase().includes(txt);
  const eth = Array.from(document.querySelectorAll('body *')).find(el => contains(el, 'ethereum'));
  if (eth) {
    let prev = eth.previousElementSibling;
    while (prev && !contains(prev, 'quali.chat')) prev = prev.previousElementSibling;
    if (prev) prev.style.display = 'none';
  } else {
    const nodes = Array.from(document.querySelectorAll('body *')).filter(el => contains(el, 'quali.chat'));
    if (nodes.length > 1) nodes.slice(1).forEach(n => n.style.display = 'none');
  }
})();

// ---- add the glass token window inside the phone mockup ----
(() => {
  const selectors = ['#iphone-mockup', '.mockup-phone', '.phone', '.iphone', '[data-phone]', '.phone-mockup'];
  let phone = null;
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) { phone = el; break; }
  }
  let phoneFound = true;
  if (!phone) { phone = document.querySelector('main') || document.body; phoneFound = false; }
  if (phoneFound) phone.classList.add('phone-3d'); // add 3D thickness

  // build the overlay
  const wrap = document.createElement('div');
  wrap.className = 'token-window';
  wrap.setAttribute('role','dialog');
  wrap.setAttribute('aria-live','polite');
  wrap.innerHTML = `
    <img class="token-badge" src="./images/automatic-access.png" alt="Automatic access badge" />
    <h3>YOU WERE ADDED TO YOUR TOKEN CHATS</h3>
    <p>QUALI.CHAT</p>
  `;
  phone.appendChild(wrap);
})();


(function(){
  'use strict';

  // --- 1) Inject CSS (no separate file needed) ---
  const css = `
    /* Depth & right-edge thickness for the phone */
    [data-iphone-mockup]{
      position:relative !important;
      filter: drop-shadow(0 20px 30px rgba(0,0,0,.35))
              drop-shadow(10px 0 0 rgba(255,255,255,.07));
      will-change: filter;
    }
    [data-iphone-mockup]::after{
      content:"";
      position:absolute;
      right:-12px;
      top:5%;
      bottom:5%;
      width:18px;
      border-radius:0 28px 28px 0;
      background:linear-gradient(180deg, rgba(255,255,255,.28), rgba(0,0,0,.50));
      box-shadow: inset -2px 0 4px rgba(255,255,255,.25), inset 2px 0 4px rgba(0,0,0,.40);
      pointer-events:none;
    }
    /* If any residual “automatic access” image sneaks in, hide it */
    img[alt*="Automatic access badge" i],
    img[src*="automatic-access" i],
    img[src*="autoaccess" i] { display:none !important; }
  `;
  const style = document.createElement('style');
  style.id = 'global-patch-css';
  style.textContent = css;
  document.head.appendChild(style);

  // --- 2) Remove the big white badge/card overlay (text + heuristics) ---
  function parseRGB(s){
    if(!s) return null;
    const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    return m ? {r:+m[1], g:+m[2], b:+m[3]} : null;
  }
  function isLightWhiteBox(el){
    const cs = getComputedStyle(el);
    const bg = parseRGB(cs.backgroundColor);
    const radius = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
      .map(k => parseFloat(cs[k])||0).reduce((a,b)=>Math.max(a,b),0);
    const shadow = cs.boxShadow && cs.boxShadow !== 'none';
    // “light” background check
    const light = bg && (bg.r+bg.g+bg.b)/3 >= 230;
    const rect = el.getBoundingClientRect();
    const big = rect.width > 200 && rect.height > 120;
    return light && radius >= 12 && (shadow || big);
  }
  function removeCard(){
    // by text
    const textHit = Array.from(document.querySelectorAll('body *')).find(n =>
      n.childElementCount === 0 &&
      /you were added to your token chats/i.test(n.textContent || '')
    );
    if(textHit){
      let box = textHit;
      for(let i=0;i<6 && box;i++){
        if(isLightWhiteBox(box)){ box.remove(); return true; }
        box = box.parentElement;
      }
      textHit.remove();
      return true;
    }
    // by dialog semantics
    const dialog = Array.from(document.querySelectorAll('[role="dialog"],[aria-modal="true"]'))
      .find(d => /you were added to your token chats/i.test(d.textContent||''));
    if(dialog){ dialog.remove(); return true; }
    // by image fallback
    const img = document.querySelector('img[alt*="Automatic access badge" i], img[src*="automatic-access" i], img[src*="autoaccess" i]');
    if(img){
      let box = img;
      for(let i=0;i<6 && box;i++){
        if(isLightWhiteBox(box)){ box.remove(); return true; }
        box = box.parentElement;
      }
      img.remove();
      return true;
    }
    return false;
  }

  // --- 3) Tag the iPhone mockup so CSS can add the thickness ---
  function tagPhone(){
    // Heuristic: largest transformed + rounded + absolutely/fixed positioned element
    const all = Array.from(document.querySelectorAll('body *'));
    const candidates = all.filter(el=>{
      const cs = getComputedStyle(el);
      const t = cs.transform && cs.transform !== 'none';
      const rect = el.getBoundingClientRect();
      const big = rect.width > 260 && rect.height > 500;
      const radius = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
        .some(k => (parseFloat(cs[k])||0) >= 16);
      const pos = cs.position === 'absolute' || cs.position === 'fixed';
      // likely dark-ish device
      const bg = parseRGB(cs.backgroundColor);
      const dark = bg ? ((bg.r+bg.g+bg.b)/3) < 120 : true;
      return t && big && radius && pos && dark;
    });
    const phone = candidates.sort((a,b)=>{
      const ar = (r)=>r.width*r.height;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return ar(rb)-ar(ra);
    })[0];
    if(phone && !phone.hasAttribute('data-iphone-mockup')){
      phone.setAttribute('data-iphone-mockup','');
      return true;
    }
    return false;
  }

  // Try for a bit to handle late-rendered UI
  let tries = 0;
  const timer = setInterval(()=>{
    const removed = removeCard();
    const tagged  = tagPhone();
    tries++;
    if(tries > 40 || (removed && tagged)) clearInterval(timer);
  }, 200);
})();

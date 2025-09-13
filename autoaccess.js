"use strict";
/* Prevent double-run if the script tag already exists */
if (!window.__AA_CLEAN_DEPTH__) {
  window.__AA_CLEAN_DEPTH__ = true;

  // ---------- 1) Remove the large white "automatic access" window ----------
  // a) Remove anything we previously might have injected
  document.querySelectorAll(
    ".autoaccess-modal, #autoaccess, .autoaccess, [data-autoaccess]"
  ).forEach(n => n.remove());

  // b) Find white, rounded, overlay-like cards and remove them
  const killByHeuristic = () => {
    const texts = [
      "you were added to your token chats",
      "automatic access badge",
      "automatic access"
    ];
    const els = Array.from(document.querySelectorAll("body *"));
    els.forEach(el => {
      try {
        const cs = getComputedStyle(el);
        const pos = cs.position;
        const zi = parseInt(cs.zIndex, 10) || 0;
        const br =
          Math.max(
            parseFloat(cs.borderTopLeftRadius) || 0,
            parseFloat(cs.borderTopRightRadius) || 0,
            parseFloat(cs.borderBottomLeftRadius) || 0,
            parseFloat(cs.borderBottomRightRadius) || 0
          ) || 0;

        // parse rgba(...) into components
        const m = cs.backgroundColor.match(
          /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([.\d]+))?\)/
        );
        let light = 0,
          alpha = 0;
        if (m) {
          const r = +m[1],
            g = +m[2],
            b = +m[3];
          alpha = m[4] === undefined ? 1 : +m[4];
          light = (r + g + b) / 3; // >220 is "white-ish"
        }

        const looksLikeWhiteCard =
          (pos === "fixed" || pos === "absolute") &&
          zi >= 10 &&
          br >= 8 &&
          alpha >= 0.6 &&
          light >= 220;

        const hasMatchingText =
          (el.textContent || "")
            .toLowerCase()
            .includes("you were added to your token chats") ||
          texts.some(t =>
            (el.textContent || "").toLowerCase().includes(t)
          );

        if (looksLikeWhiteCard || hasMatchingText) {
          el.remove();
        }
      } catch (_) {}
    });
  };
  // Run now and once after render settles
  killByHeuristic();
  setTimeout(killByHeuristic, 300);

  // ---------- 2) Add right-side depth to the iPhone mockup ----------
  // Try to find the phone/mockup container
  const phone =
    document.querySelector(
      "#iphone, .iphone, .phone, .device, .mockup, .phone-mockup, .tilt-card"
    ) || document.body;

  // Inject CSS once
  const css = `
  /* Subtle upgrade without changing layout/DOM structure elsewhere */
  .aa-phone-depth{ position:relative; }

  /* Right-side thickness slab */
  .aa-phone-depth .aa-side-right{
    position:absolute; top:12px; bottom:12px; right:-12px; width:14px;
    border-radius:12px;
    pointer-events:none;
    background:
      linear-gradient(180deg, #3d4454 0%, #1a1f2b 50%, #0e131c 100%);
    box-shadow:
      inset -1px 0 0 rgba(255,255,255,.14),
      10px 0 24px rgba(0,0,0,.45),
      2px 0 6px rgba(0,0,0,.35);
    filter:saturate(115%);
  }
  /* Specular glint on the metal edge */
  .aa-phone-depth .aa-side-right::after{
    content:"";
    position:absolute; left:1px; top:10%; bottom:10%; width:2px;
    border-radius:2px;
    background:linear-gradient(180deg, rgba(255,255,255,.45), rgba(255,255,255,0));
    opacity:.7;
  }

  /* Optional: a faint under-shadow so the phone pops a bit more */
  .aa-phone-depth::after{
    content:"";
    position:absolute; left:4%; right:8%; bottom:-18px; height:28px;
    border-radius:28px;
    background:radial-gradient(60% 100% at 50% 100%, rgba(0,0,0,.45), rgba(0,0,0,0));
    pointer-events:none;
    filter:blur(1px);
  }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Mark container and add the side slab
  if (!phone.classList.contains("aa-phone-depth")) {
    phone.classList.add("aa-phone-depth");
  }
  if (!phone.querySelector(".aa-side-right")) {
    const side = document.createElement("div");
    side.className = "aa-side-right";
    phone.appendChild(side);
  }
}


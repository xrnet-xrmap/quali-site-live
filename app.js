// year in footer
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// Safety: ensure only ONE toast on the screen (no duplicates from old code)
document.querySelectorAll('.token-toast').forEach((el, idx) => { if (idx > 0) el.remove(); });

// Project Pages base-path fix for any images that mistakenly start with "/"
const base = location.pathname.split('/').slice(0,2).join('/');
document.querySelectorAll('img[src^="/"]').forEach(img=>{
  const s = img.getAttribute('src');
  if (!/^https?:\/\//i.test(s)) img.src = base + s;
});

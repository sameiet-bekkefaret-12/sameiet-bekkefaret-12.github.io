(() => {
  'use strict';
  const clock = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const preview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
    && new URLSearchParams(location.search).get('halloween') === 'preview';
  let layer, pumpkin, toggle, timer;
  let paused = false;
  try { paused = sessionStorage.getItem('halloween-paused') === 'true'; } catch (_) {}
  const svg = (viewBox, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true" focusable="false">${body}</svg>`;
  const leaf = svg('0 0 24 32', '<path fill="currentColor" d="M12 1C3 6-2 16 5 23c3 3 6 3 8 2 9-4 9-14-1-24Z"/><path d="M12 8 8 30m2-12 7-5" fill="none" stroke="#795330" stroke-width="1"/>');
  const bat = svg('0 0 64 30', '<path fill="currentColor" d="M1 3c8 2 14 7 22 12l5-3 1-8 4 5 4-5 1 8 4 3C50 10 56 5 63 3l-5 15c-6-4-10-1-11 5-5-3-9 0-15 6-6-6-10-9-15-6-1-6-5-9-11-5Z"/>');
  const spider = svg('0 0 30 150', '<path d="M15 0v125" stroke="currentColor" stroke-width=".6"/><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="m12 130-7-6-3 3m10 6-9-2-2 4m11 1-8 4v4m8-5-5 6 2 3m9-19 7-6 3 3m-10 6 9-2 2 4m-11 1 8 4v4m-8-5 5 6-2 3"/></g><ellipse cx="15" cy="136" rx="4" ry="6" fill="currentColor"/><circle cx="15" cy="129" r="3" fill="currentColor"/>');
  const pumpkinArt = svg('0 0 48 44', '<path d="M24 11c-2-6 0-8 4-9" fill="none" stroke="#9b8559" stroke-width="3"/><g fill="#ef7a22" stroke="#b7551c" stroke-width="1"><ellipse cx="16" cy="26" rx="12" ry="15"/><ellipse cx="32" cy="26" rx="12" ry="15"/><ellipse cx="24" cy="26" rx="10" ry="16"/></g><path d="m15 23 6-2-1 5Zm18 0-6-2 1 5ZM18 31q6 6 12 0" fill="#25282a"/>');
  const crawler = svg('0 0 48 40', '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><g class="hw-legs-a"><path d="m25 16 5-10 7-3m-12 22 3 9 8 3m-9-20-11-8-8 2m17 13-11 4-7-3"/></g><g class="hw-legs-b"><path d="m26 19 10-8 7 2m-18 9 10 6 7-2m-20-11-4-10-8-2m11 22-4 9-8 3"/></g></g><ellipse cx="21" cy="20" rx="8" ry="6" fill="currentColor"/><circle cx="31" cy="20" r="4.5" fill="currentColor"/>');
  const web = svg('0 0 120 120', '<g fill="none" stroke="currentColor" stroke-width=".8"><path d="M0 0h120M0 0l111 46M0 0l85 85M0 0l46 111M0 0v120"/><path d="M24 0Q20 5 22 9Q16 11 17 17Q11 16 9 22Q5 20 0 24M48 0Q40 10 44 18Q32 22 34 34Q22 32 18 44Q10 40 0 48M72 0Q60 15 66 27Q48 33 51 51Q33 48 27 66Q15 60 0 72M96 0Q80 20 88 36Q64 44 68 68Q44 64 36 88Q20 80 0 96M120 0Q100 25 111 46Q80 55 85 85Q55 80 46 111Q25 100 0 120"/></g>');
  function motion() {
    if (!layer) return;
    layer.hidden = reduced.matches || paused;
    layer.classList.toggle('hw-sleeping', document.hidden);
    toggle.hidden = reduced.matches;
    toggle.textContent = paused ? 'Vis høstbevegelser' : 'Stopp høstbevegelser';
    toggle.setAttribute('aria-pressed', String(paused));
  }
  function mount() {
    layer = document.createElement('div');
    layer.className = 'hw-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = [0, 1, 2, 3].map(i => `<span class="hw-leaf hw-leaf-${i}">${leaf}</span>`).join('')
      + [0, 1, 2].map(i => `<span class="hw-bat hw-bat-${i}">${bat}</span>`).join('')
      + `<span class="hw-spider">${spider}</span>`
      + `<span class="hw-crawler">${crawler}</span>`
      + `<span class="hw-web hw-web-left">${web}</span><span class="hw-web hw-web-right">${web}</span>`;
    pumpkin = document.createElement('div');
    pumpkin.className = 'hw-footer';
    pumpkin.innerHTML = `<span class="hw-pumpkin" aria-hidden="true">${pumpkinArt}</span>`;
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'hw-toggle';
    toggle.addEventListener('click', () => {
      paused = !paused;
      try { sessionStorage.setItem('halloween-paused', String(paused)); } catch (_) {}
      motion();
    });
    pumpkin.append(toggle);
    (document.querySelector('footer') || document.body).append(pumpkin);
    document.body.append(layer);
    motion();
  }
  function sync() {
    clearTimeout(timer);
    const now = new Date();
    const parts = Object.fromEntries(clock.formatToParts(now).map(p => [p.type, p.value]));
    const active = preview || (parts.month === '10' && ['30', '31'].includes(parts.day))
      || (parts.month === '11' && parts.day === '01');
    if (active && !layer) mount();
    if (!active && layer) {
      layer.remove(); pumpkin.remove();
      layer = pumpkin = toggle = null;
    }
    motion();
    // Recheck hourly, and exactly at Oslo midnight; also refresh on tab resume.
    const untilMidnight = (86400 - (+parts.hour * 3600 + +parts.minute * 60 + +parts.second)) * 1000 - now.getMilliseconds();
    timer = setTimeout(sync, Math.min(3600000, untilMidnight));
  }
  reduced.addEventListener('change', motion);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', sync);
  sync();
})();

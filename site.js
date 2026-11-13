(() => {
  'use strict';
  const config = window.GLUEMUSE_SITE || {};
  const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; } };
  for (const name of ['discord', 'telegram', 'donate']) {
    const card = document.querySelector(`[data-social="${name}"]`);
    const url = safeUrl(config[name]);
    if (!url) continue;
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', card.querySelector('h3').textContent + ' — открыть в новой вкладке');
    card.append(link); card.classList.add('is-linked'); card.querySelector('.social-state').textContent = name === 'donate' ? 'Поддержать ↗' : 'Присоединиться ↗';
  }
  const demo = document.querySelector('#demo');
  document.querySelectorAll('button[data-mode]').forEach(button => button.addEventListener('click', () => {
    demo.dataset.mode = button.dataset.mode;
    document.querySelectorAll('button[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  const play = document.querySelector('#demo-play');
  play.addEventListener('click', () => {
    const playing = demo.classList.toggle('is-playing');
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? 'Остановить анимацию макета' : 'Запустить анимацию макета');
  });
  const like = document.querySelector('.like');
  like.addEventListener('click', () => {
    const liked = like.getAttribute('aria-pressed') !== 'true';
    like.setAttribute('aria-pressed', String(liked));
    like.setAttribute('aria-label', liked ? 'Убрать демонстрационный трек из избранного' : 'Добавить демонстрационный трек в избранное');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { demo.classList.remove('is-playing'); play.setAttribute('aria-pressed', 'false'); play.setAttribute('aria-label', 'Запустить анимацию макета'); }
  });
  const repository = typeof config.repository === 'string' && /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(config.repository) ? config.repository : '';
  if (!repository) return;
  const repoUrl = `https://github.com/${repository}`;
  const source = document.querySelector('#source-link'); source.href = repoUrl; source.hidden = false; source.target = '_blank'; source.rel = 'noopener noreferrer';
  const releases = document.querySelector('#all-releases'); releases.href = repoUrl + '/releases'; releases.hidden = false;
  const install = document.querySelector('#install');
  install.href = '#download'; // Public downloads start at stable 1.0 only. // Works even when the API is unavailable.
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 6000);
  fetch(`https://api.github.com/repos/${repository}/releases?per_page=15`, { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
    .then(response => { if (!response.ok) throw new Error('Release lookup failed'); return response.json(); })
    .then(list => {
      if (!Array.isArray(list)) return;
      // Newest published release with a Windows installer, stable 1.0+ builds only.
      const candidates = list.filter(release => !release.draft && !release.prerelease && /^v?(?:[1-9]\d*)\.\d+(?:\.\d+)?$/.test(String(release.tag_name)) && Array.isArray(release.assets)).sort((a,b) => new Date(b.published_at) - new Date(a.published_at));
      for (const release of candidates) {
        const asset = release.assets.find(item => /\.exe$/i.test(item.name) && !/arm64|ia32|uninstall/i.test(item.name));
        if (!asset) continue;
        const url = safeUrl(asset.browser_download_url);
        if (!url || !url.startsWith(repoUrl + '/releases/download/')) continue;
        install.href = url; install.removeAttribute('aria-disabled'); install.firstChild.textContent = 'Скачать для Windows ';
        document.querySelector('#release-version').textContent = String(release.tag_name || release.name || 'Windows x64');
        document.querySelector('#release-size').textContent = `${Math.round(asset.size / 1048576)} МБ · ${release.prerelease ? 'Предварительная версия' : 'Стабильная версия'}`;
        return;
      }
    }).catch(() => {}).finally(() => clearTimeout(timeout));
})();
/* Small interactions inspired by React Bits Tilted Card and Spotlight Card.
   Implemented locally for this static site; no component bundle is loaded. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const card = document.querySelector('[data-tilt]');
  let frame = 0, bounds = null;
  const art = document.querySelector('.hero-art');
  art.addEventListener('pointerenter', () => { bounds = art.getBoundingClientRect(); });
  art.addEventListener('pointermove', event => {
    if (reduced.matches || !fine.matches || !bounds || event.pointerType === 'touch') return;
    const x = Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1));
    const y = Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { card.style.transform = `perspective(1000px) rotateX(${-y*5}deg) rotateY(${x*7}deg) rotate(-3deg)`; });
  });
  art.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); card.style.transform=''; bounds=null; });
  document.querySelectorAll('[data-spotlight]').forEach(element => {
    element.addEventListener('pointermove', event => {
      if (!fine.matches) return;
      const rect=element.getBoundingClientRect();
      element.style.setProperty('--spot-x',`${event.clientX-rect.left}px`);
      element.style.setProperty('--spot-y',`${event.clientY-rect.top}px`);
    });
  });
  const stage=document.querySelector('#demo');
  const comments={forest:'Мне нравится этот зелёный.',warm:'Потеплее. Как свет настольной лампы.',mono:'Ничего лишнего. Тоже хорошо.'};
  document.querySelectorAll('button[data-palette]').forEach(button => button.addEventListener('click',()=>{
    stage.dataset.palette=button.dataset.palette;
    document.querySelectorAll('button[data-palette]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    document.querySelector('.palette-caption').textContent=comments[button.dataset.palette];
  }));
  document.querySelector('.like').addEventListener('click',()=>{
    document.querySelector('#demo-like-note').textContent=document.querySelector('.like').getAttribute('aria-pressed')==='true'?'Оставим в избранном.':'Можно передумать :)';
  });
})();

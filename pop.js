// pop.js — game / music / other / blog 共通の動き（トップページ index.html と同じ遊び心）
(() => {
  const pick = a => a[Math.floor(Math.random() * a.length)];

  // --- 見出しを1文字ずつに分けて、ホバー（タッチではタップ）で跳ねる ---
  document.querySelectorAll('[data-split]').forEach(el => {
    el.innerHTML = el.innerHTML.split('<br>').map(w => [...w].map(c => `<span class="ch">${c}</span>`).join('')).join('<br>');
  });
  document.querySelectorAll('.ch').forEach(c => c.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    c.classList.add('pop'); setTimeout(() => c.classList.remove('pop'), 450);
  }));

  // --- しゃぼん玉 ---
  const cols = ['#ff7ac6', '#a98bff', '#6ee7c8', '#ffe066', '#7cc8ff'];
  const bubbles = (x, y, n = 6) => {
    for (let i = 0; i < n; i++) {
      const b = document.createElement('span'), s = 14 + Math.random() * 36;
      b.className = 'bub';
      Object.assign(b.style, { left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', background: cols[i % cols.length], animationDelay: i * 45 + 'ms' });
      b.style.setProperty('--dx', (Math.random() * 180 - 90) + 'px');
      document.body.appendChild(b); setTimeout(() => b.remove(), 1700);
    }
  };
  addEventListener('click', e => { if (!e.target.closest('a,button,.list div,.tittle')) bubbles(e.clientX, e.clientY); });

  // --- 見出しの i の点を Mitama に（タップでくるっとジャンプ） ---
  document.querySelectorAll('[data-mitama-i]').forEach(h => {
    const ch = [...h.querySelectorAll('.ch')].find(c => c.textContent === 'i');
    if (!ch) return;
    ch.classList.add('idot');
    ch.innerHTML = 'ı<span class="tittle" role="img" aria-label="Mitama"><img src="jpg/artist-image.jpg" alt=""></span>';
    const t = ch.querySelector('.tittle');
    t.addEventListener('click', e => {
      e.stopPropagation();
      t.classList.remove('jump'); void t.offsetWidth; t.classList.add('jump');
      const r = t.getBoundingClientRect(); bubbles(r.left + r.width / 2, r.top, 5);
    });
    t.addEventListener('animationend', e => { if (e.animationName === 'tjump') t.classList.remove('jump'); });
  });

  // --- Mitama がカーソルにゆっくり付いてくる（PCのみ） ---
  const bd = document.querySelector('.buddy');
  if (bd) {
    let tx = innerWidth * .8, ty = 200, bx = tx, by = ty;
    addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { tx = e.clientX + 30; ty = e.clientY + 30; } });
    (function loop() {
      const vx = (tx - bx) * .06, vy = (ty - by) * .06; bx += vx; by += vy;
      bd.style.transform = `translate(${bx - 37}px,${by - 37}px) rotate(${vx * 1.5}deg) scale(${1 + Math.min(Math.abs(vx) + Math.abs(vy), 20) / 100})`;
      requestAnimationFrame(loop);
    })();
  }

  // --- ぷにっと（押す→つぶれる、離す→ゼリーで戻る）。スクロール開始時は解除 ---
  document.querySelectorAll('.puni').forEach(el => {
    const release = jelly => {
      if (!el.classList.contains('pressed')) return;
      el.classList.remove('pressed', 'jelly');
      if (jelly) { void el.offsetWidth; el.classList.add('jelly'); }
    };
    el.addEventListener('pointerdown', e => {
      el.classList.add('pressed');
      if (e.pointerType === 'touch' && navigator.vibrate) navigator.vibrate(8);
    });
    el.addEventListener('pointerup', () => release(true));
    el.addEventListener('pointercancel', () => release(false));
    el.addEventListener('pointerleave', () => release(true));
    el.addEventListener('animationend', e => { if (e.animationName === 'jelly') el.classList.remove('jelly'); });
  });

  // --- カードをタップした瞬間：しゃぼん玉＋ぷにっと → 少し待ってから開く ---
  document.querySelectorAll('.cd').forEach(cd => cd.addEventListener('click', e => {
    const r = cd.getBoundingClientRect();
    bubbles(e.clientX || r.left + r.width / 2, e.clientY || r.top + 60, 9);
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // 新しいタブ指定はそのまま
    e.preventDefault();
    setTimeout(() => {
      if (cd.target !== '_blank') { location.href = cd.href; return; }
      const w = window.open(cd.href, '_blank');
      if (w) w.opener = null; else location.href = cd.href;
    }, 380);
  }));

  // --- スマホメニュー ---
  const mbtn = document.getElementById('mbtn'), mmenu = document.getElementById('mmenu');
  if (mbtn && mmenu) {
    mbtn.addEventListener('click', e => { e.stopPropagation(); const o = mmenu.classList.toggle('open'); mbtn.setAttribute('aria-expanded', o); mbtn.textContent = o ? 'Close' : 'Menu'; });
    document.addEventListener('click', e => { if (!e.target.closest('nav') && mmenu.classList.contains('open')) mbtn.click(); });
  }

  // --- 曲リスト＋プレイヤー（Suno の埋め込みを使用。曲は .list の data-suno から読む） ---
  const mpl = document.getElementById('mplayer');
  if (mpl) {
    const rows = [...document.querySelectorAll('.list [data-suno]')];
    const mpif = document.getElementById('mpif'), cover = document.getElementById('mpcover'), pp = document.getElementById('mpplay');
    let cur = Math.max(0, rows.findIndex(r => r.classList.contains('on'))), playing = false;
    const setSong = (i, play) => {
      cur = (i + rows.length) % rows.length;
      const r = rows[cur], img = r.querySelector('img').getAttribute('src');
      document.getElementById('mpcv').src = img;
      document.getElementById('mptt').textContent = r.dataset.title;
      cover.style.setProperty('--art', `url(${img})`);
      rows.forEach((x, k) => x.classList.toggle('on', k === cur));
      if (play) {
        mpif.hidden = false; mpif.src = 'https://suno.com/embed/' + r.dataset.suno + '/';
        playing = true; mpl.classList.add('playing'); pp.textContent = '❚❚';
      }
    };
    const stop = () => { playing = false; mpl.classList.remove('playing'); mpif.src = 'about:blank'; mpif.hidden = true; pp.textContent = '▶'; };
    pp.addEventListener('click', e => { e.stopPropagation(); playing ? stop() : setSong(cur, true); });
    cover.addEventListener('click', e => { e.stopPropagation(); setSong(cur, true); });
    cover.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSong(cur, true); } });
    document.getElementById('mpnext').addEventListener('click', e => { e.stopPropagation(); setSong(cur + 1, playing); });
    document.getElementById('mpprev').addEventListener('click', e => { e.stopPropagation(); setSong(cur - 1, playing); });
    rows.forEach((r, k) => r.addEventListener('click', () => {
      setSong(k, true);
      if (innerWidth <= 860) mpl.scrollIntoView({ behavior: 'smooth', block: 'center' }); // スマホではプレイヤーへ戻す
    }));
    setSong(cur, false);
  }

  window.SynapsePop = { bubbles, pick };
})();

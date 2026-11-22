/* METAS 인사이트 목록 — blog/posts.json 하나만 읽어 주요 글·전체 게시글·카테고리·검색을 그립니다. */
(() => {
  'use strict';
  const CATEGORIES = ['공지', '수출 사례', '수입 사례', '제품 정보', '무역 정보'];
  const LEGACY = { '무역 실무': '무역 정보' };          // 이전 분류명 자동 변환
  const PAGE = 20;                                      // 한 번에 보여줄 개수

  const blogRoot = new URL('./', document.currentScript.src.replace(/assets\/insight\.js.*$/, 'blog/'));
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const arrowSvg = () => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ins-arrow'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<path d="M7 17 17 7M8 7h9v9"/>'; return s; };

  const state = { posts: [], cat: '전체', q: '', shown: PAGE };

  function safeUrl(v) {
    const raw = String(v || '').trim(); if (!raw) return null;
    try { const u = new URL(raw.replace(/^blog\//, ''), blogRoot); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; }
  }
  function order(d) { const m = String(d || '').match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : 0; }
  function normCat(c) { c = String(c || '').trim(); c = LEGACY[c] || c; return CATEGORIES.includes(c) ? c : '무역 정보'; }

  function thumb(post) {
    const box = el('span', 'ins-thumb');
    const src = safeUrl(post.thumbnail);
    const fallback = () => { box.className = 'ins-thumb placeholder'; box.replaceChildren(); const t = el('span'); t.append(el('b', '', 'METAS'), document.createTextNode(post.category)); box.append(t); };
    if (!src) { fallback(); return box; }
    const img = el('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('error', fallback, { once: true }); img.src = src; box.append(img); return box;
  }
  function meta(post) { const m = el('div'); m.append(el('span', 'ins-cat', post.category)); if (post.date) m.append(el('span', 'ins-date', post.date)); return m; }

  /* 2. 주요 글: featured:true 글 우선, 없으면 최신순으로 최대 3개 */
  function renderFeatured() {
    const box = $('#insFeatured'); const sec = $('#insFeaturedSection');
    const picks = [...state.posts.filter(p => p.featured), ...state.posts.filter(p => !p.featured)].slice(0, 3);
    if (!picks.length) { sec.hidden = true; return; }
    sec.hidden = false;
    const [first, ...rest] = picks;
    const main = el('a', 'ins-feat-main'); main.href = first.href;
    const body = el('div'); body.append(meta(first), el('h3', '', first.title));
    if (first.excerpt) body.append(el('p', '', first.excerpt));
    body.append(el('span', 'ins-go', '자세히 보기 →'));
    main.append(body, thumb(first));
    const nodes = [main];
    if (rest.length) {
      const side = el('div', 'ins-feat-side');
      rest.forEach(p => { const a = el('a', 'ins-feat-sub'); a.href = p.href; const b = el('div'); b.append(meta(p), el('h3', '', p.title)); if (p.excerpt) b.append(el('p', '', p.excerpt)); a.append(thumb(p), b); side.append(a); });
      nodes.push(side);
    }
    box.classList.toggle('single', !rest.length);
    box.replaceChildren(...nodes);
  }

  /* 3. 전체 게시글 */
  function renderTabs() {
    const tabs = $('#insTabs'); tabs.replaceChildren();
    ['전체', ...CATEGORIES].forEach(c => {
      const n = c === '전체' ? state.posts.length : state.posts.filter(p => p.category === c).length;
      const li = el('li'); const b = el('button', '', c); b.type = 'button'; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(state.cat === c)); b.append(el('small', '', String(n)));
      b.addEventListener('click', () => { state.cat = c; state.shown = PAGE; syncUrl(); renderTabs(); renderList(); });
      li.append(b); tabs.append(li);
    });
  }
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return state.posts.filter(p => (state.cat === '전체' || p.category === state.cat) &&
      (!q || [p.title, p.excerpt, p.category].join(' ').toLowerCase().includes(q)));
  }
  function renderList() {
    const list = $('#insList'); const items = filtered(); const pager = $('#insPager');
    $('#insResultCount').textContent = items.length + '개';
    if (!items.length) {
      const msg = el('li', 'ins-empty');
      if (state.q) msg.textContent = `'${state.q}'에 해당하는 글이 없습니다.`;
      else { msg.append(document.createTextNode(`${state.cat} 카테고리에 아직 등록된 글이 없습니다. `)); const a = el('a', '', '거래 문의하기'); a.href = '../inquiry.html'; msg.append(a); }
      list.replaceChildren(msg); pager.hidden = true; return;
    }
    list.replaceChildren(...items.slice(0, state.shown).map(p => {
      const li = el('li', 'ins-row'); const a = el('a'); a.href = p.href;
      const b = el('div'); b.append(meta(p), el('h3', '', p.title)); if (p.excerpt) b.append(el('p', '', p.excerpt));
      a.append(thumb(p), b, arrowSvg()); li.append(a); return li;
    }));
    pager.hidden = items.length <= state.shown;
  }
  function syncUrl() {
    const u = new URL(location.href);
    state.cat === '전체' ? u.searchParams.delete('c') : u.searchParams.set('c', state.cat);
    history.replaceState(null, '', u);
  }

  async function load() {
    try {
      const r = await fetch(new URL('posts.json', blogRoot), { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json(); const seen = new Set();
      state.posts = (Array.isArray(data) ? data : [])
        .filter(p => p && typeof p.title === 'string' && p.title.trim() && p.published !== false && !p.draft)
        .map(p => ({ ...p, category: normCat(p.category), href: safeUrl(p.url) }))
        .filter(p => p.href && !seen.has(p.href) && seen.add(p.href))
        .sort((a, b) => order(b.date) - order(a.date));
    } catch (e) {
      $('#insList').replaceChildren(el('li', 'ins-empty', '게시글을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'));
      return;
    }
    $('#insTotal').textContent = state.posts.length;
    $('#insAllCount').textContent = state.posts.length + '개';
    const c = new URL(location.href).searchParams.get('c'); if (CATEGORIES.includes(c)) state.cat = c;
    renderFeatured(); renderTabs(); renderList();
  }

  $('#insSearch').addEventListener('input', e => { state.q = e.target.value; state.shown = PAGE; renderList(); });
  $('#insMore').addEventListener('click', () => { state.shown += PAGE; renderList(); });
  load();
})();

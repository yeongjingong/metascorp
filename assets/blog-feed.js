/* Shared published-post feed: homepage and blog read a single source. */
(() => {
  'use strict';
  const siteRoot = new URL('../', document.currentScript.src);
  const blogRoot = new URL('blog/', siteRoot);
  const grid = document.querySelector('[data-post-view]');
  if (!grid) return;
  const home = grid.dataset.postView === 'home';
  const element = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text) el.textContent = text;
    return el;
  };
  function resolvePath(value) {
    const raw = String(value || '').trim();
    if (!raw) return null;
    try {
      const base = /^(?:blog|assets)\//i.test(raw) ? siteRoot : blogRoot;
      const url = new URL(raw, base);
      // Reject script, data and other non-web schemes.
      return /^(https?:)$/.test(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function dateOrder(date) {
    const match = String(date || '').match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
    return match ? Date.UTC(+match[1], +match[2]-1, +match[3]) : (Date.parse(date) || 0);
  }
  function status(message) {
    grid.dataset.count = '0';
    grid.replaceChildren(element('p', 'post-status', message));
  }
  function thumbnail(post, container, cls) {
    const thumb = resolvePath(post.thumbnail);
    if (!thumb) {
      container.className = cls + ' placeholder';
      container.textContent = 'METAS TRADE BLOG';
      return;
    }
    container.className = cls + ' has-image';
    const img = element('img');
    img.alt = String(post.alt || post.title); img.loading = 'lazy'; img.decoding = 'async';
    img.addEventListener('error', () => { container.className = cls + ' placeholder'; container.textContent = 'METAS TRADE BLOG'; }, {once:true});
    img.src = thumb; container.append(img);
  }
  function renderCard(post) {
    const article = element('article', home ? 'home-insight-card' : 'blog-card');
    const link = element('a'); link.href = post.href;
    const date = [post.category || '무역 실무', post.date].filter(Boolean).join(' · ');
    if (home) {
      const thumb = element('div'); thumbnail(post, thumb, 'post-thumb');
      const caption = element('div','home-insight-caption');
      caption.append(element('span','',date),element('h3','',post.title));
      if(post.excerpt) caption.append(element('p','',post.excerpt));
      caption.append(element('span','post-read','자세히 보기 →'));
      link.append(thumb,caption); article.append(link);
    } else {
      thumbnail(post,link,'blog-thumb');
      const body = element('div','blog-body');
      const h3 = element('h3','blog-title'); const titleLink = element('a','',post.title); titleLink.href = post.href; h3.append(titleLink);
      const more = element('a','blog-read','자세히 보기'); more.href = post.href;
      body.append(element('div','blog-meta',date),h3,element('p','blog-excerpt',post.excerpt || ''),more);
      article.append(link,body);
    }
    return article;
  }
  async function load() {
    try {
      const response = await fetch(new URL('posts.json',blogRoot),{cache:'no-store'});
      if(!response.ok) throw new Error('HTTP '+response.status);
      const data = await response.json();
      if(!Array.isArray(data)) throw new Error('Invalid post index');
      const seen = new Set();
      let posts = data.filter(p => p && typeof p.title === 'string' && p.title.trim() && p.published !== false && !p.draft)
        .map(p=>({...p,href:resolvePath(p.url)})).filter(p=>p.href)
        .sort((a,b)=>dateOrder(b.date)-dateOrder(a.date))
        .filter(p=>!seen.has(p.href) && seen.add(p.href));
      if(home) posts=posts.slice(0,Math.max(1,Number(grid.dataset.limit)||3));
      if (!posts.length) { status('등록된 블로그 글이 없습니다.'); return; }
      grid.dataset.count=String(posts.length);
      grid.replaceChildren(...posts.map(renderCard));
    } catch(error) { status('블로그 글을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.'); }
  }
  load();
})();

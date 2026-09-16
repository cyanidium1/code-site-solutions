const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.env.OUTDIR || require('os').tmpdir();
const paths = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/rozrobka-saitiv','/rozrobka-saitiv-kyiv','/landing','/corporate-site','/online-store','/seo','/lokalne-seo','/audit','/redesign','/support','/pricing','/calculator','/process','/about','/portfolio','/contacts','/sites-for/medicine','/sites-for/medicine/stomatolohiia','/sites-for/renovation','/sites-for/legal','/sites-for/real-estate','/vs-wordpress','/vs-constructors','/vs-freelancers'];
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const results = [];
  for (const p of paths) {
    const page = await ctx.newPage();
    try {
      await page.goto((process.env.BASE || 'https://www.code-site.art') + p, { waitUntil: 'networkidle', timeout: 60000 });
      // dismiss cookie banner if present
      await page.evaluate(() => { document.querySelectorAll('[class*=cookie],[id*=cookie],[aria-label*=cookie i]').forEach(e => { if (getComputedStyle(e).position === 'fixed') e.remove(); }); });
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 700) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(500);
      const data = await page.evaluate(() => {
        const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
        const main = document.querySelector('main') || document.body;
        const footer = document.querySelector('footer');
        const mainTop = main.getBoundingClientRect().top + scrollY;
        const mainH = main.getBoundingClientRect().height;
        // media: img/video/canvas >= 140px wide and >= 90 tall; big svg >= 200 wide
        const media = [];
        main.querySelectorAll('img,video,picture,canvas,svg').forEach(e => {
          if (e.tagName === 'PICTURE') return;
          if (e.tagName === 'svg' && e.closest('img,picture')) return;
          const r = e.getBoundingClientRect();
          const minW = e.tagName === 'svg' ? 200 : 140;
          if (r.width >= minW && r.height >= 90 && vis(e)) {
            const top = r.top + scrollY, bottom = r.bottom + scrollY;
            if (media.some(m => Math.abs(m.top - top) < 5 && Math.abs(m.bottom - bottom) < 5)) return;
            media.push({ tag: e.tagName, top, bottom, src: (e.currentSrc || e.src || e.getAttribute('aria-label') || '').toString().slice(0, 90), w: Math.round(r.width), h: Math.round(r.height) });
          }
        });
        // also css background images of large elements
        main.querySelectorAll('*').forEach(e => { const bg = getComputedStyle(e).backgroundImage; if (bg && bg.includes('url(')) { const r = e.getBoundingClientRect(); if (r.width >= 200 && r.height >= 120) media.push({ tag: 'BG', top: r.top + scrollY, bottom: r.bottom + scrollY, src: bg.slice(0, 90), w: Math.round(r.width), h: Math.round(r.height) }); } });
        media.sort((a, b) => a.top - b.top);
        // longest gap without media inside main
        let cursor = mainTop, maxGap = 0, gapAt = 0;
        for (const m of media) { if (m.top - cursor > maxGap) { maxGap = m.top - cursor; gapAt = cursor; } cursor = Math.max(cursor, m.bottom); }
        if (mainTop + mainH - cursor > maxGap) { maxGap = mainTop + mainH - cursor; gapAt = cursor; }
        const words = (main.innerText || '').split(/\s+/).filter(w => /[\p{L}\d]/u.test(w)).length;
        // sections: direct-ish children of main with height
        let blocks = Array.from(main.children);
        if (blocks.length <= 2) blocks = blocks.flatMap(b => Array.from(b.children));
        const sections = blocks.map(b => {
          const r = b.getBoundingClientRect(); if (r.height < 40) return null;
          const top = r.top + scrollY, bottom = r.bottom + scrollY;
          const h = b.querySelector('h1,h2');
          const txt = b.innerText || '';
          const w = txt.split(/\s+/).filter(x => /[\p{L}\d]/u.test(x)).length;
          const m = media.filter(x => x.top >= top - 2 && x.bottom <= bottom + 2).length;
          const paras = Array.from(b.querySelectorAll('p')).map(p => p.innerText.split(/\s+/).length);
          const longParas = paras.filter(n => n >= 45).length;
          const cards = b.querySelectorAll('li, article, [class*=card]').length;
          const btn = b.querySelectorAll('a[class*=btn], button, a[class*=button], a[class*=cta]').length;
          return { h2: h ? h.innerText.replace(/\s+/g, ' ').slice(0, 90) : '(' + (b.getAttribute('class') || b.tagName).slice(0, 40) + ')', px: Math.round(r.height), screens: +(r.height / 844).toFixed(1), words: w, media: m, paras: paras.length, longParas, cards, btn };
        }).filter(Boolean);
        return { total: document.documentElement.scrollHeight, mainH: Math.round(mainH), words, mediaCount: media.length, maxGap: Math.round(maxGap), gapAt: Math.round(gapAt), media: media.map(m => ({ tag: m.tag, top: Math.round(m.top), h: m.h, src: m.src })), sections, footerH: footer ? Math.round(footer.getBoundingClientRect().height) : 0, h1: (document.querySelector('h1') || {}).innerText };
      });
      data.path = p; results.push(data);
      console.log(p, data.total, 'screens', (data.total / 844).toFixed(1), 'words', data.words, 'media', data.mediaCount, 'maxGap', data.maxGap);
      const slug = p === '/' ? 'home' : p.replace(/\//g, '_').slice(1);
      await page.screenshot({ path: `${OUT}/${slug}-fold.jpg`, type: 'jpeg', quality: 60 });
    } catch (e) { console.log('ERR', p, e.message); }
    await page.close();
  }
  fs.writeFileSync(OUT + '/measure-' + Date.now() + '.json', JSON.stringify(results, null, 1));
  await browser.close();
})();

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "editorial",
  "accentHue": 295,
  "showTicker": true,
  "showStats": true
}/*EDITMODE-END*/;

// ─── Device Mockup (uses uploaded asset) ──────────────────────────────────
function DeviceMockup() {
  return (
    <div className="mockup">
      <img src="assets/mockup.png" alt="Сайт клініки на ноутбуці та телефоні" />
    </div>
  );
}

// ─── Variants ────────────────────────────────────────────────────────────────
function HeroEditorial({ tweaks }) {
  return (
    <>
      <div className="hero-bg"></div>
      <div className="hero-grain"></div>

      <main className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              <span>САЙТИ ДЛЯ МЕДИЧНОЇ ГАЛУЗІ</span>
              <span className="eyebrow-sep">/</span>
              <span className="eyebrow-em">від $3 500</span>
            </div>

            <h1 className="h1">
              <span className="h1-line">Клініка, до якої</span>
              <span className="h1-line"><em>записуються</em></span>
              <span className="h1-line h1-accent">
                <span className="h1-num">50+</span>
                <span className="h1-num-label">пацієнтів<br/>на місяць</span>
              </span>
            </h1>

            <p className="lede">
              Кастомні сайти для стоматологій, багатопрофільних клінік
              і діагностичних центрів. Запуск за <em>4–6 тижнів</em>,
              гарантія 1 рік.
            </p>

            <div className="features">
              <Feature label="Онлайн-запис" sub="за 2 кліки" />
              <Feature label="Локальне SEO" sub="під район" />
              <Feature label="Інтеграція CRM" sub="Bitrix · AmoCRM" />
              <Feature label="Юр. коректно" sub="за вимогами МОЗ" />
            </div>

            <div className="cta-row">
              <button className="btn-primary">
                <span>Обговорити мій проєкт</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="btn-ghost">
                <span className="btn-play">▶</span>
                <span>Подивитися кейси клінік</span>
              </button>
            </div>

            {tweaks.showStats && (
              <div className="stats">
                <div className="stat">
                  <div className="stat-num">47</div>
                  <div className="stat-lbl">клінік<br/>запущено</div>
                </div>
                <div className="stat-div"></div>
                <div className="stat">
                  <div className="stat-num">4.9<span className="stat-sm">/5</span></div>
                  <div className="stat-lbl">середня<br/>оцінка</div>
                </div>
                <div className="stat-div"></div>
                <div className="stat">
                  <div className="stat-num">×3.2</div>
                  <div className="stat-lbl">більше<br/>записів</div>
                </div>
              </div>
            )}
          </div>

          <div className="hero-right">
            <div className="device-stage">
              <div className="device-glow"></div>
              <div className="device-grid"></div>
              <DeviceMockup />
              <div className="device-tag device-tag-1">
                <span className="dt-dot"></span>
                <span>Онлайн-запис</span>
              </div>
              <div className="device-tag device-tag-2">
                <span>Адаптив</span>
                <span className="dt-mini">100/100</span>
              </div>
              <div className="device-tag device-tag-3">
                <span>Lighthouse</span>
                <span className="dt-mini dt-good">98</span>
              </div>
            </div>
          </div>
        </div>

        {tweaks.showTicker && (
          <div className="ticker">
            <div className="ticker-track">
              {[...Array(2)].map((_, i) => (
                <div className="ticker-row" key={i}>
                  <span>Стоматології</span><span>•</span>
                  <span>Багатопрофільні клініки</span><span>•</span>
                  <span>Діагностичні центри</span><span>•</span>
                  <span>Косметологія</span><span>•</span>
                  <span>Реабілітація</span><span>•</span>
                  <span>Лабораторії</span><span>•</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function HeroSplit({ tweaks }) {
  return (
    <>
      <div className="hero-bg"></div>
      <div className="hero-grain"></div>

      <main className="hero hero-split">
        <div className="split-left">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span>
            <span>МЕДИЧНА ГАЛУЗЬ · ВІД $3 500</span>
          </div>
          <h1 className="h1 h1-split">
            Сайт клініки, який<br/>
            <em>приводить</em> пацієнтів —<br/>
            не просто <em>існує</em>.
          </h1>
          <p className="lede">
            Кастомні сайти для стоматологій, клінік і діагностичних центрів.
            Онлайн-запис 24/7, прозорий прайс, локальне SEO. Запуск за 4–6 тижнів.
          </p>
          <div className="kpi-row">
            <div className="kpi"><div className="kpi-n">50+</div><div className="kpi-l">пацієнтів/міс</div></div>
            <div className="kpi"><div className="kpi-n">×3.2</div><div className="kpi-l">більше записів</div></div>
            <div className="kpi"><div className="kpi-n">4–6</div><div className="kpi-l">тижнів запуск</div></div>
          </div>
          <div className="cta-row">
            <button className="btn-primary"><span>Обговорити проєкт</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn-ghost"><span>Кейси клінік</span></button>
          </div>
        </div>
        <div className="split-right">
          <div className="device-stage">
            <div className="device-glow"></div>
            <DeviceMockup />
          </div>
        </div>
      </main>
    </>
  );
}

function HeroCentered({ tweaks }) {
  return (
    <>
      <div className="hero-bg"></div>
      <div className="hero-grain"></div>

      <main className="hero hero-centered">
        <div className="centered-text">
          <div className="eyebrow eyebrow-center">
            <span className="eyebrow-dot"></span>
            <span>САЙТИ ДЛЯ КЛІНІК · ВІД $3 500</span>
          </div>
          <h1 className="h1 h1-centered">
            Сайт, до якого записуються<br/>
            <span className="h1-big">50+</span>
            <span className="h1-tail">пацієнтів<br/>на місяць.</span>
          </h1>
          <p className="lede lede-center">
            Стоматології · багатопрофільні клініки · діагностичні центри.<br/>
            Онлайн-запис 24/7 · локальне SEO · запуск за 4–6 тижнів.
          </p>
          <div className="cta-row cta-center">
            <button className="btn-primary"><span>Обговорити мій проєкт</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn-ghost"><span>Подивитися кейси</span></button>
          </div>
        </div>
        <div className="device-stage device-stage-wide">
          <div className="device-glow"></div>
          <DeviceMockup />
        </div>
      </main>
    </>
  );
}

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-mark">&lt;/&gt;</span>
          <span className="brand-name">CODE-SITE<span className="brand-dot">.</span>ART</span>
        </div>
        <div className="nav-links">
          <a>Портфоліо</a>
          <a>Послуги</a>
          <a>Блог</a>
          <a>Контакти</a>
        </div>
        <div className="nav-right">
          <button className="lang">UA <span>▾</span></button>
          <button className="nav-cta">
            <span className="nav-cta-dot"></span>
            Обговорити проєкт
          </button>
        </div>
      </div>
    </nav>
  );
}

function Feature({ label, sub }) {
  return (
    <div className="feat">
      <div className="feat-check">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div className="feat-text">
        <div className="feat-label">{label}</div>
        <div className="feat-sub">{sub}</div>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', `oklch(0.55 0.18 ${tweaks.accentHue})`);
    document.documentElement.style.setProperty('--accent-2', `oklch(0.45 0.20 ${Math.max(260, tweaks.accentHue - 10)})`);
    document.documentElement.style.setProperty('--accent-soft', `oklch(0.7 0.14 ${tweaks.accentHue})`);
  }, [tweaks.accentHue]);

  const Variant = {
    editorial: HeroEditorial,
    split: HeroSplit,
    centered: HeroCentered,
  }[tweaks.variant] || HeroEditorial;

  return (
    <>
      <Variant tweaks={tweaks} />
      <TweaksPanel title="Tweaks">
        <TweakSection title="Layout">
          <TweakRadio
            label="Variant"
            value={tweaks.variant}
            onChange={v => setTweak('variant', v)}
            options={[
              { value: 'editorial', label: 'Editorial' },
              { value: 'split', label: 'Split' },
              { value: 'centered', label: 'Centered' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Style">
          <TweakSlider label="Accent hue" min={250} max={340} step={1} value={tweaks.accentHue} onChange={v => setTweak('accentHue', v)} />
          <TweakToggle label="Industry ticker" value={tweaks.showTicker} onChange={v => setTweak('showTicker', v)} />
          <TweakToggle label="Stats row" value={tweaks.showStats} onChange={v => setTweak('showStats', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

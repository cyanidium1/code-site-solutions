import "./outcome.css";

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MockPages({
  url = "efedra.com.ua/послуги",
  tags = ["Стомат.", "Естетика", "Інше"],
}: { url?: string; tags?: string[] } = {}) {
  return (
    <div className="benefit-visual">
      <div className="benefit-visual-bar">
        <span /><span /><span />
        <span className="url">{url}</span>
      </div>
      <div className="benefit-visual-content">
        <div className="mock-pages">
          {tags.map((t, i) => (
            <div className="mock-page" key={i}>
              <div className="mock-page-tag">{t}</div>
              <div className="mock-page-thumb" />
              <div className="mock-page-line" />
              <div className="mock-page-line short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MockBookingForm({
  url = "efedra.com.ua/запис",
}: { url?: string } = {}) {
  return (
    <div className="benefit-visual">
      <div className="benefit-visual-bar">
        <span /><span /><span />
        <span className="url">{url}</span>
      </div>
      <div className="benefit-visual-content">
        <div className="mock-form">
          <div className="mock-form-title">Запис на консультацію</div>
          <div className="mock-form-field">Олена Петрова</div>
          <div className="mock-form-row">
            <div className="mock-form-field">+380 ··</div>
            <div className="mock-form-field">17:30</div>
          </div>
          <div className="mock-form-field">Стоматологія / гігієна</div>
          <div className="mock-form-btn">Записатися</div>
        </div>
      </div>
    </div>
  );
}

export function MockAdmin({
  url = "admin.efedra.com.ua",
}: { url?: string } = {}) {
  return (
    <div className="benefit-visual">
      <div className="benefit-visual-bar">
        <span /><span /><span />
        <span className="url">{url}</span>
      </div>
      <div className="benefit-visual-content">
        <div className="mock-admin">
          <div className="mock-admin-side">
            <div className="mock-admin-side-item" />
            <div className="mock-admin-side-item active" />
            <div className="mock-admin-side-item" />
            <div className="mock-admin-side-item" />
            <div className="mock-admin-side-item" />
            <div className="mock-admin-side-item" />
          </div>
          <div className="mock-admin-main">
            <div className="mock-admin-fld" />
            <div className="mock-admin-fld" />
            <div className="mock-admin-fld tall" />
            <div className="mock-admin-fld" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Outcome() {
  return (
    <section className="outcome">
      <div className="outcome-bg" />
      <div className="outcome-inner">
        <div className="recap-pull">
          <div className="recap-pull-mark">
            <span className="recap-pull-mark-dot" />
            <span>РЕЗУЛЬТАТ ЧЕРЕЗ 6 МІСЯЦІВ</span>
          </div>
          <p className="recap-pull-text">
            За <strong>6 місяців</strong> після запуску клініка{" "}
            <em>«Ефедра»</em> отримала вимірний приріст заявок з Google і повний
            контроль над контентом сайту. Це типовий результат переробки сайту
            клініки — перетворення з «візитки без заявок» на <em>інструмент</em>,
            який реально приводить пацієнтів.
          </p>
        </div>

        <article className="directions">
          <div className="directions-eyebrow">SOLUTION · ARCHITECTURE</div>
          <h3 className="directions-h3">
            Як ми вирішили задачу
            <br />з <em>двома напрямками</em>
          </h3>
          <p className="directions-lede">
            У клієнта було два напрямки: <em>стоматологія</em> і{" "}
            <em>студія краси</em>. Ми не стали робити два окремі сайти — це
            здешевило б проєкт, але роздробило б SEO і вдвічі підвищило б
            вартість підтримки.
          </p>
          <div className="directions-cols">
            <div className="directions-col">
              <h4 className="directions-col-h">
                <span className="directions-col-h-dot" />
                Замість цього
              </h4>
              <ul className="directions-list">
                <li>
                  <span className="directions-bullet">●</span>
                  <span>
                    одна головна сторінка для клініки <em>в цілому</em>
                  </span>
                </li>
                <li>
                  <span className="directions-bullet">●</span>
                  <span>дві окремі підголовні: стоматологія і студія краси</span>
                </li>
                <li>
                  <span className="directions-bullet">●</span>
                  <span>
                    послуги, лікарі і контент розділені <em>за напрямками</em>
                  </span>
                </li>
              </ul>
            </div>
            <div className="directions-col">
              <h4 className="directions-col-h">
                <span className="directions-col-h-dot" />
                Це дозволило
              </h4>
              <ul className="directions-list">
                <li>
                  <span className="directions-check"><CheckIcon /></span>
                  <span>
                    не дробити <em>SEO</em> між двома доменами
                  </span>
                </li>
                <li>
                  <span className="directions-check"><CheckIcon /></span>
                  <span>
                    не втрачати трафік на <em>301-редиректах</em>
                  </span>
                </li>
                <li>
                  <span className="directions-check"><CheckIcon /></span>
                  <span>
                    чітко розділити напрямки <em>для пацієнта</em>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </article>

        <header className="benefits-header">
          <h2 className="benefits-h2">
            Що ви отримаєте
            <br />
            на прикладі <em>реального</em> проєкту
          </h2>
          <p className="benefits-sub">
            Не просто «<em>красивий сайт</em>». Інструменти, що реально впливають
            на потік пацієнтів — структура під SEO, онлайн-запис, керована
            редактором адмінка.
          </p>
        </header>

        <div className="benefit-hero">
          <div className="benefit-hero-stat">
            <div className="benefit-hero-num">×3,4</div>
            <div className="benefit-hero-lbl">
              зростання потоку заявок після редизайну
            </div>
            <div className="benefit-hero-src">
              — за словами власниці клініки «Ефедра»
            </div>
          </div>
          <ul className="benefit-hero-list">
            <li>
              <span className="directions-check"><CheckIcon /></span>
              <span>зручний дизайн без перевантаження</span>
            </li>
            <li>
              <span className="directions-check"><CheckIcon /></span>
              <span>працює на будь-яких пристроях і браузерах</span>
            </li>
          </ul>
        </div>

        <div className="benefit-row">
          <MockPages />
          <div className="benefit-text">
            <div className="benefit-row-num">FEATURE · 01 / 03</div>
            <h3 className="benefit-h3">
              Зрозуміла структура під <em>реальні послуги</em>
            </h3>
            <ul className="benefit-list">
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  розділення на <em>стоматологію</em> і <em>студію краси</em>
                </span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  окремі сторінки під <mark>кожну послугу</mark>
                </span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>логічна навігація без перевантаження</span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>швидкий доступ до запису</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="benefit-row reverse">
          <MockBookingForm />
          <div className="benefit-text">
            <div className="benefit-row-num">FEATURE · 02 / 03</div>
            <h3 className="benefit-h3">
              Система запису, яка <em>реально</em> працює
            </h3>
            <ul className="benefit-list">
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  запис у <mark>2 кліки</mark>
                </span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>вибір послуги і спеціаліста</span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>форми заявок і зворотного звʼязку</span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  інтеграція з <em>CRM</em> / сповіщення
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="benefit-row">
          <MockAdmin />
          <div className="benefit-text">
            <div className="benefit-row-num">FEATURE · 03 / 03</div>
            <h3 className="benefit-h3">
              Ви керуєте сайтом <em>самі</em>
            </h3>
            <ul className="benefit-list">
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  зміна <em>цін</em> з телефона
                </span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>додавання послуг і лікарів</span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>публікація акцій і новин</span>
              </li>
              <li>
                <span className="directions-check"><CheckIcon /></span>
                <span>
                  без <mark>постійної оплати</mark> розробнику
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

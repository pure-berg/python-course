'use strict';
/* Тренажёр: шпаргалка → тест с объяснениями → ошибки. Без сборки, работает и с file://. */

const KEY = 'pycourse-v1';
const PASS = 80;          // % для «пройдено»
const REVIEW_MAX = 15;    // вопросов в одном повторении ошибок

const MODS = (window.MODULES || []).slice().sort((a, b) => a.id - b.id);
const BY_ID = Object.fromEntries(MODS.map(m => [m.id, m]));
const LEARN = MODS.filter(m => m.id > 0);   // все, кроме входного теста
const $app = document.getElementById('app');

/* ---------- состояние ---------- */
function norm(s) {
  s = s && typeof s === 'object' ? s : {};
  const best = {};
  if (s.best && typeof s.best === 'object')
    for (const k in s.best) if (typeof s.best[k] === 'number') best[k] = s.best[k];
  return {
    best,
    wrong: Array.isArray(s.wrong) ? s.wrong.filter(x => typeof x === 'string') : [],
    start: typeof s.start === 'number' ? s.start : null,
    placement: typeof s.placement === 'number' ? s.placement : null,
  };
}
function load() { try { return norm(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return norm({}); } }
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* приватный режим */ } }

const passed = id => (S.best[id] ?? -1) >= PASS;
function findQ(qid) {
  const [mid, i] = qid.split('.').map(Number);
  const m = BY_ID[mid];
  return m && m.questions[i] ? { m, q: m.questions[i], qid } : null;
}
function wrongList() { return S.wrong.filter(findQ); }
function nextModule() {
  const from = S.start || 1;
  return LEARN.find(m => m.id >= from && !passed(m.id)) || LEARN.find(m => !passed(m.id)) || null;
}

/* ---------- утилиты ---------- */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// текст вопросов/вариантов/объяснений: экранируем, `x` → <code>, **x** → <b>, перевод строки → <br>
function fmt(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}
function codeBlock(code) {
  const lines = String(code).replace(/^\n+|\s+$/g, '').split('\n');
  return '<pre><code>' + lines.map((l, i) => `<span class="l" data-n="${i + 1}">${esc(l) || ' '}</span>`).join('') + '</code></pre>';
}
// мини-markdown для шпаргалок: абзацы, списки «- », **жирный**, `код`, блоки кода — строки с отступом 4 пробела
function md(src) {
  const lines = String(src).replace(/^\n+|\s+$/g, '').split('\n');
  let out = '', para = [], list = [];
  const flushP = () => { if (para.length) { out += '<p>' + fmt(para.join(' ')).replace(/<br>/g, ' ') + '</p>'; para = []; } };
  const flushL = () => { if (list.length) { out += '<ul>' + list.map(x => '<li>' + fmt(x) + '</li>').join('') + '</ul>'; list = []; } };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith('    ')) {
      flushP(); flushL();
      const block = [];
      while (i < lines.length && (lines[i].startsWith('    ') || lines[i].trim() === '')) { block.push(lines[i].slice(4)); i++; }
      i--;
      while (block.length && !block[block.length - 1].trim()) block.pop();
      out += '<pre><code>' + block.map(x => `<span class="l">${esc(x) || ' '}</span>`).join('') + '</code></pre>';
    } else if (/^- /.test(l)) { flushP(); list.push(l.slice(2)); }
    else if (/^#+ /.test(l)) { flushP(); flushL(); out += '<h3>' + fmt(l.replace(/^#+ /, '')) + '</h3>'; }
    else if (!l.trim()) { flushP(); flushL(); }
    else if (list.length && /^\s+/.test(l)) list[list.length - 1] += ' ' + l.trim();
    else { flushL(); para.push(l.trim()); }
  }
  flushP(); flushL();
  return out;
}
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function bar(pct) { return `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`; }
function go(h) { if (location.hash === h) route(); else location.hash = h; }
function copyText(text, btn) {
  const done = () => { const t = btn.textContent; btn.textContent = '✓ Скопировано'; setTimeout(() => (btn.textContent = t), 1600); };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done, () => fallback());
  } else fallback();
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { prompt('Скопируй вручную:', text); }
    ta.remove();
  }
}

/* ---------- перенос прогресса ---------- */
function b64enc(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = ''; bytes.forEach(b => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64dec(str) {
  str = str.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
}
function shareLink() { return location.href.split(/[?#]/)[0] + '?p=' + b64enc(S); }
function importFrom(raw) {
  let code = raw.trim();
  const m = code.match(/[?&]p=([^&#\s]+)/);
  if (m) code = decodeURIComponent(m[1]);
  let data;
  try { data = norm(b64dec(code)); } catch (e) { alert('Не получилось прочитать прогресс из ссылки.'); return false; }
  const n = Object.keys(data.best).filter(k => k !== '0' && data.best[k] >= PASS).length;
  if (!confirm(`Загрузить прогресс из ссылки?\nПройдено модулей: ${n}, ошибок в повторении: ${data.wrong.length}.\nТекущий прогресс на этом устройстве будет заменён.`)) return false;
  S = data; save();
  return true;
}
(function importOnOpen() {
  const p = new URLSearchParams(location.search).get('p');
  if (!p) return;
  importFrom('?p=' + p);
  history.replaceState(null, '', location.pathname + location.hash);
})();

/* ---------- экраны ---------- */
function home() {
  const done = LEARN.filter(m => passed(m.id)).length;
  const pct = LEARN.length ? Math.round(100 * done / LEARN.length) : 0;
  const nm = nextModule();
  const wl = wrongList().length;
  let h = `<h1>🐍 Python: понимаю каждую строку</h1>
    <p class="muted">Шпаргалка → тест с объяснениями → повтор ошибок. Модуль в день, ~1,5–2 часа.</p>
    <div class="card"><b>Пройдено модулей: ${done} из ${LEARN.length}</b>${bar(pct)}
    <span class="muted small">Модуль пройден при ${PASS}% верных ответов.</span></div>`;
  if (S.placement === null && BY_ID[0])
    h += `<div class="card warn"><b>Начни с входного теста.</b> ${BY_ID[0].questions.length} вопросов, ~15 минут.
      Он покажет, с какого модуля начать, а лёгкие темы можно будет пропустить.
      <a class="btn primary big" href="#/q/0">Пройти входной тест</a></div>`;
  if (nm) h += `<a class="btn primary big" href="#/m/${nm.id}">▶ Продолжить: модуль ${nm.id}. ${esc(nm.title)}</a>`;
  else if (LEARN.length) h += `<div class="card">🎉 Все модули пройдены. Повторяй ошибки и бери задания для ИИ — это и есть подготовка к собеседованию.</div>`;
  h += wl ? `<a class="btn big" href="#/r">🔁 Повторить ошибки (${wl})</a>`
          : `<button class="big" disabled>🔁 Ошибок для повторения нет</button>`;

  let week = null;
  h += '<ul class="mods">';
  for (const m of MODS) {
    if (m.week !== week) { week = m.week; h += `</ul><h3>${week ? 'Неделя ' + week : 'Старт'}</h3><ul class="mods">`; }
    const b = S.best[m.id];
    const st = m.id === 0
      ? (S.placement !== null ? `<span class="st">${S.placement}%</span>` : '<span class="st">—</span>')
      : passed(m.id) ? '<span class="st done">✓</span>' : `<span class="st">${b !== undefined ? b + '%' : '—'}</span>`;
    let tag = '';
    if (nm && m.id === nm.id) tag = '<span class="tag next">дальше</span>';
    else if (m.id > 0 && S.start && m.id < S.start && !passed(m.id)) tag = '<span class="tag">можно пропустить</span>';
    h += `<li><a href="#/m/${m.id}">${st}<span class="t">${m.id ? m.id + '. ' : ''}${esc(m.title)}</span>${tag}</a></li>`;
  }
  h += '</ul>';
  h += `<div class="row"><a class="btn" href="#/sync">📲 Перенести прогресс на другое устройство</a>
        <button id="reset">Сбросить прогресс</button></div>`;
  $app.innerHTML = h;
  document.getElementById('reset').onclick = () => {
    if (confirm('Удалить весь прогресс на этом устройстве?')) { S = norm({}); save(); home(); }
  };
}

function aiPrompt(m) {
  return `Напиши ${m.ai} (15–25 строк). Код не объясняй.\n` +
    'Потом задай мне 5 вопросов о том, что делает этот код и почему он так написан — строго по одному, ' +
    'у каждого 4 варианта ответа (A–D). Жди мой ответ, говори, верно ли, и объясняй, почему правильный вариант правильный, а мой — нет. ' +
    'Вопросы делай разными: «что выведет», «что будет, если изменить строку N», «зачем здесь эта строка», «где здесь мог бы быть баг». ' +
    'В конце дай оценку и скажи, что повторить.';
}

function moduleView(id) {
  const m = BY_ID[id];
  if (!m) return go('#/');
  const b = S.best[id];
  const nq = m.questions.length;
  let h = `<a class="back" href="#/">← Все модули</a>
    <h1>${m.id ? m.id + '. ' : ''}${esc(m.title)}</h1>
    <p class="muted">${m.week ? 'Неделя ' + m.week + ' · ' : ''}${nq} вопросов${b !== undefined ? ' · лучший результат ' + b + '%' : ''}${passed(id) ? ' ✓' : ''}</p>`;
  if (m.theory) h += `<div class="card theory">${md(m.theory)}</div>`;
  h += `<a class="btn primary big" href="#/q/${id}">Начать тест</a>`;
  if (m.ai) h += `<h2>Практика: читаю чужой код</h2>
    <p class="muted small">Скопируй задание и вставь в ChatGPT или Claude. ИИ напишет код по теме и будет задавать вопросы по нему — ты только выбираешь варианты.</p>
    <button class="big" id="ai">📋 Скопировать задание для ИИ</button>`;
  $app.innerHTML = h;
  window.scrollTo(0, 0);
  if (m.ai) document.getElementById('ai').onclick = e => copyText(aiPrompt(m), e.currentTarget);
}

let QZ = null;   // текущий тест

function startQuiz(id) {
  const m = BY_ID[id];
  if (!m) return go('#/');
  QZ = { mode: 'module', mid: id, title: m.title,
         items: m.questions.map((q, i) => ({ qid: id + '.' + i, m, q })), i: 0, right: 0, misses: [] };
  showQ();
}
function startReview() {
  const list = shuffle(wrongList()).slice(0, REVIEW_MAX).map(findQ);
  if (!list.length) return go('#/');
  QZ = { mode: 'review', title: 'Повтор ошибок', items: list, i: 0, right: 0, misses: [] };
  showQ();
}

function showQ() {
  const it = QZ.items[QZ.i];
  const q = it.q;
  const order = shuffle(q.a.map((_, k) => k));
  it.order = order; it.answered = false;
  const n = QZ.items.length;
  let h = `<a class="back" href="#/">← Выйти</a>
    <div class="qhead"><span>${esc(QZ.title)}${QZ.mode === 'review' ? ' · из модуля ' + it.m.id : ''}</span><span>${QZ.i + 1} / ${n}</span></div>
    ${bar(100 * QZ.i / n)}
    <div class="q">${fmt(q.q)}</div>
    ${q.code ? codeBlock(q.code) : ''}
    <div class="answers${q.run ? ' mono' : ''}">` +
    order.map((k, pos) => `<button data-k="${k}"><span class="k">${pos + 1}</span><span class="v">${fmt(q.a[k])}</span></button>`).join('') +
    `</div><div id="after"></div><p class="muted kbd">Клавиши: 1–4 — ответ, Enter — дальше.</p>`;
  $app.innerHTML = h;
  window.scrollTo(0, 0);
  $app.querySelectorAll('.answers button').forEach(b => (b.onclick = () => answer(+b.dataset.k)));
}

function answer(k) {
  const it = QZ.items[QZ.i];
  if (it.answered) return;
  it.answered = true;
  const ok = k === 0;
  if (ok) QZ.right++; else QZ.misses.push(it);
  // ошибки: неверный ответ добавляет, верный (в любом режиме) убирает
  S.wrong = S.wrong.filter(x => x !== it.qid);
  if (!ok) S.wrong.push(it.qid);
  save();
  $app.querySelectorAll('.answers button').forEach(b => {
    b.disabled = true;
    const bk = +b.dataset.k;
    if (bk === 0) b.classList.add('ok');
    else if (bk === k) b.classList.add('bad');
  });
  const last = QZ.i === QZ.items.length - 1;
  const after = document.getElementById('after');
  after.innerHTML = `<div class="card expl${ok ? '' : ' badx'}"><div class="verdict">${ok ? '✓ Верно' : '✗ Неверно'}</div>${fmt(it.q.e)}</div>
    <button class="primary big" id="next">${last ? 'Результат' : 'Дальше →'}</button>`;
  const nb = document.getElementById('next');
  nb.onclick = () => { if (last) result(); else { QZ.i++; showQ(); } };
  after.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function result() {
  const n = QZ.items.length;
  const pct = Math.round(100 * QZ.right / n);
  let h = `<a class="back" href="#/">← Все модули</a><h1>${esc(QZ.title)}</h1>
    <div class="card"><div class="score">${QZ.right} / ${n}</div>${bar(pct)}`;
  let buttons = '';
  if (QZ.mode === 'module') {
    const id = QZ.mid;
    S.best[id] = Math.max(S.best[id] ?? 0, pct);
    if (id === 0) {
      const missed = QZ.misses.map(it => it.q.m).filter(x => typeof x === 'number');
      const maxM = Math.max(0, ...QZ.items.map(it => it.q.m || 0));
      S.start = missed.length ? Math.min(...missed) : maxM + 1;
      S.placement = pct;
      const sm = BY_ID[S.start] || nextModule();
      h += `<p>${pct}% верных.</p>`;
      h += S.start > 1
        ? `<p>Модули 1–${S.start - 1} помечены «можно пропустить». Начинай с модуля <b>${S.start}</b>. Пролистать шпаргалки пропущенных модулей всё равно полезно.</p>`
        : '<p>Начинай с первого модуля — так надёжнее всего.</p>';
      buttons = sm ? `<a class="btn primary big" href="#/m/${sm.id}">Перейти к модулю ${sm.id}. ${esc(sm.title)}</a>` : '';
    } else {
      h += pct >= PASS ? `<p>✓ Модуль пройден (${pct}%).</p>` : `<p>${pct}%. Для зачёта нужно ${PASS}%. Перечитай шпаргалку и попробуй ещё раз — вопросы те же, варианты перемешаются.</p>`;
      const nm = LEARN.find(m => m.id > id);
      buttons = (nm ? `<a class="btn ${pct >= PASS ? 'primary ' : ''}big" href="#/m/${nm.id}">Следующий модуль: ${nm.id}. ${esc(nm.title)}</a>` : '') +
        `<button class="big${pct >= PASS ? '' : ' primary'}" id="again">Ещё раз</button>`;
    }
    save();
  } else {
    h += `<p>Осталось ошибок для повторения: ${wrongList().length}.</p>`;
    buttons = wrongList().length ? '<button class="primary big" id="again">Ещё порция ошибок</button>' : '';
  }
  h += '</div>' + buttons + '<a class="btn big" href="#/">К списку модулей</a>';
  if (QZ.misses.length) {
    h += '<h2>Где ошибся</h2>' + QZ.misses.map(it =>
      `<div class="card"><div class="q">${fmt(it.q.q)}</div>${it.q.code ? codeBlock(it.q.code) : ''}
       <p>Правильно: <b>${fmt(it.q.a[0])}</b></p><p class="muted">${fmt(it.q.e)}</p></div>`).join('');
  }
  $app.innerHTML = h;
  window.scrollTo(0, 0);
  const again = document.getElementById('again');
  if (again) again.onclick = () => (QZ.mode === 'review' ? startReview() : startQuiz(QZ.mid));
}

function syncView() {
  const link = shareLink();
  $app.innerHTML = `<a class="back" href="#/">← Назад</a><h1>Перенос прогресса</h1>
    <div class="card"><p>Открой эту ссылку на другом устройстве (телефон, ноутбук) — прогресс загрузится туда.
    Ссылка — снимок на текущий момент: после занятий на другом устройстве перенеси обратно так же.</p>
    <textarea readonly id="link">${esc(link)}</textarea>
    <button class="primary big" id="copy">📋 Скопировать ссылку</button></div>
    <div class="card"><p>Или вставь сюда ссылку/код с другого устройства:</p>
    <textarea id="paste" placeholder="https://…?p=…"></textarea>
    <button class="big" id="load">Загрузить прогресс</button></div>`;
  document.getElementById('copy').onclick = e => copyText(link, e.currentTarget);
  document.getElementById('link').onfocus = e => e.target.select();
  document.getElementById('load').onclick = () => {
    const v = document.getElementById('paste').value;
    if (v.trim() && importFrom(v)) go('#/');
  };
}

/* ---------- роутер и клавиатура ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [page, arg] = h.split('/');
  if (page === 'm') moduleView(+arg);
  else if (page === 'q') startQuiz(+arg);
  else if (page === 'r') startReview();
  else if (page === 'sync') syncView();
  else home();
}
window.addEventListener('hashchange', route);
document.addEventListener('keydown', e => {
  const t = e.target;
  if ((t.matches && t.matches('textarea, input')) || e.ctrlKey || e.metaKey || e.altKey) return;
  const btns = [...$app.querySelectorAll('.answers button')];
  const free = !t.matches || t === document.body || t.disabled || t.id === 'next';  // фокус не на другой кнопке/ссылке
  if (/^[1-4]$/.test(e.key) && btns.length && !btns[0].disabled) {
    const b = btns[+e.key - 1];
    if (b) { e.preventDefault(); b.click(); }
  } else if (e.key === 'Enter' && free) {
    const nb = document.getElementById('next');
    if (nb) { e.preventDefault(); nb.click(); }
    else if (location.hash.startsWith('#/m/')) { e.preventDefault(); go('#/q/' + location.hash.split('/')[2]); }
  }
});
route();

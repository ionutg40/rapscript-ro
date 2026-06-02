'use strict';
// RapScript RO — inima + controale (Epic 3-4). Contracte: docs/architecture.md › Implementation Patterns.

// ---- Config (UPPER_SNAKE, sus) ----
const MIN_DELAY = 2000;
const MAX_DELAY = 12000;
const DEFAULT_DELAY = 4000;
const DEFAULT_LEVEL = 'avansat';
const LS_KEY = 'rapscript:settings';

// ---- Backend: Cloudflare Worker (D20 v2): tokenul stă pe Worker, NU în browser ----
// După ce deployezi Worker-ul (vezi docs/worker-setup.md), pune aici URL-ul lui.
const WORKER_URL = '';        // ex: 'https://rapscript-gh.<contul-tău>.workers.dev'
const TURNSTILE_SITEKEY = ''; // (opțional) site key Cloudflare Turnstile (anti-bot)
const LEVELS = ['incepator', 'avansat', 'profesionist'];

// cuvinte adăugate în sesiune (merge optimist; canonic vine din words.js la următorul load, D24)
const sessionAdded = { incepator: [], avansat: [], profesionist: [] };

// ---- State: sursa unică de adevăr runtime (D5) ----
const state = {
  word: '',
  level: DEFAULT_LEVEL,
  intervalMs: DEFAULT_DELAY,
  intervalId: null,
  ready: false,
  playing: false,
  error: false,
  errorMessage: '',
};

// ---- Refs DOM (cache o dată) ----
let wordEl, messageEl, playBtn, speedSlider, speedValueEl, levelSegmentsEl, fullscreenBtn, timerFill;
let openViewerBtn, drawerEl, viewerTitle, viewerList, viewerClose, viewerOverlay, addInput, addBtn, addStatus;
let levelSegs = [];
let prevWord = null; // animație-la-schimbare (Epic 5)

const byId = (id) => document.getElementById(id);

// ---- Funcții pure (testabile, ?test=1) ----
function clampDelay(ms) {
  if (!Number.isFinite(ms)) return DEFAULT_DELAY;
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, ms));
}

function pickWord(bankArray, currentWord) {
  if (bankArray.length === 1) return bankArray[0];
  if (bankArray.length === 2) return bankArray[0] === currentWord ? bankArray[1] : bankArray[0];
  let pick = currentWord;
  for (let i = 0; i < 10 && pick === currentWord; i++) {
    pick = bankArray[Math.floor(Math.random() * bankArray.length)];
  }
  return pick;
}

// banca pentru un nivel = canonic (WORD_BANK) + adăugate în sesiune (D24 merge optimist)
function bankFor(level) {
  return WORD_BANK[level].concat(sessionAdded[level] || []);
}

// validare ÎNAINTE de commit (D22): normalizat lowercase, un cuvânt, ne-existent cross-nivel
function validateNewWord(raw) {
  const word = String(raw || '').trim().toLowerCase();
  if (!word) return { ok: false, msg: 'scrie un cuvânt' };
  if (/[,\s]/.test(word)) return { ok: false, msg: 'un singur cuvânt, fără spațiu sau virgulă' };
  for (const lvl of LEVELS) {
    if (bankFor(lvl).some((w) => w.toLowerCase() === word)) {
      return { ok: false, msg: 'cuvântul există deja în bancă' };
    }
  }
  return { ok: true, word: word };
}

// ---- Persistență (fail-silent, D14) ----
function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.v !== 1) return; // schemă necunoscută → defaults
    if (typeof s.level === 'string' && WORD_BANK[s.level]) state.level = s.level;
    if (Number.isFinite(s.speedSec)) state.intervalMs = clampDelay(s.speedSec * 1000);
  } catch (e) {
    console.error('localStorage parse fail → defaults', e); // nu blochează
  }
}

function saveSettings() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ v: 1, level: state.level, speedSec: state.intervalMs / 1000 }));
  } catch (e) {
    console.error('localStorage setItem fail (private mode?) — ignorat', e);
  }
}

// ---- Render: SINGURUL punct de scriere DOM (regula de aur, D7) ----
function render() {
  if (state.error) {
    document.body.classList.toggle('is-error', true);
    messageEl.textContent = state.errorMessage;
    return;
  }
  document.body.classList.toggle('is-error', false);
  document.body.classList.toggle('is-loading', !state.ready);
  document.body.classList.toggle('is-playing', state.playing);

  if (!state.ready) {
    messageEl.textContent = 'se încarcă cuvintele…';
    playBtn.disabled = true;
    return;
  }
  playBtn.disabled = false;

  // cuvântul: scrie + animă DOAR la schimbare (anti-flicker, D16)
  if (state.word !== prevWord) {
    wordEl.textContent = state.word;
    wordEl.classList.remove('is-entering');
    void wordEl.offsetWidth; // reflow → retrigger animația
    wordEl.classList.add('is-entering');
    prevWord = state.word;
  }
  timerFill.style.setProperty('--interval', state.intervalMs + 'ms');

  // play/pause: eticheta reflectă acțiunea următoare
  playBtn.textContent = state.playing ? '❚❚ pauză' : '▶ pornește';
  playBtn.setAttribute('aria-pressed', String(state.playing));

  // viteză: NU scrie value pe slider dacă e în drag (activeElement) — altfel smucește
  const dragging = document.activeElement === speedSlider;
  if (!dragging) speedSlider.value = String(state.intervalMs / 1000);
  const sec = dragging ? Number(speedSlider.value) : state.intervalMs / 1000;
  speedValueEl.textContent = sec + 's';
  speedSlider.setAttribute('aria-valuetext', sec + ' secunde');

  // nivel activ
  for (const seg of levelSegs) {
    const active = seg.dataset.level === state.level;
    seg.classList.toggle('is-active', active);
    seg.setAttribute('aria-pressed', String(active));
  }

  messageEl.textContent = ''; // controalele arată starea; message = doar loading/error
  updateViewerCount(); // contorul „vezi cuvintele (N)" pe nivelul curent
  console.assert(state.word !== '', 'render: ready cere un cuvânt');
}

// ---- Effect helpers (a treia lume — D9) ----
function restartTimer() {
  clearInterval(state.intervalId);
  state.intervalId = null;
  if (state.playing) state.intervalId = setInterval(handleTick, state.intervalMs);
}

// retrigger animația timer-bar de la 0 (un nou interval începe)
function retriggerTimerBar() {
  timerFill.style.animation = 'none';
  void timerFill.offsetWidth; // reflow
  timerFill.style.animation = ''; // revine la animația din CSS (rulează doar dacă is-playing)
}

// ---- Handlere (forma canonică: mutate state → effect helpers → render) ----
function handleTick() {
  state.word = pickWord(bankFor(state.level), state.word);
  render();
  retriggerTimerBar(); // bara repornește pe noul cuvânt
}

function handlePlayClick() {
  if (!state.ready) return;
  state.playing = !state.playing;
  if (state.playing) state.word = pickWord(bankFor(state.level), state.word); // cuvânt nou la play (t=0)
  restartTimer();
  render();
  if (state.playing) {
    retriggerTimerBar();
  } else {
    wordEl.focus(); // focus-pe-pauză: SR anunță cuvântul (a11y, EXPERIENCE)
  }
}

function handleFullscreen() {
  if (!document.fullscreenElement) {
    const p = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    if (p && p.catch) p.catch(function () {});
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function handleFullscreenChange() {
  const on = !!document.fullscreenElement;
  document.body.classList.toggle('is-fullscreen', on);
  fullscreenBtn.setAttribute('aria-pressed', String(on));
}

function handleSpeedInput() {
  render(); // doar readout live (citește slider-ul în drag); state/timer neatinse
}

function handleSpeedChange() {
  state.intervalMs = clampDelay(Number(speedSlider.value) * 1000);
  saveSettings();
  if (state.playing) { restartTimer(); }
  render();
  if (state.playing) retriggerTimerBar(); // noul interval pentru bară
}

function handleLevelClick(e) {
  const seg = e.target.closest('.level-segment');
  if (!seg) return; // click în gap
  state.level = seg.dataset.level;
  saveSettings();
  render(); // următorul tick folosește noul nivel; cuvântul curent rămâne
}

function handleKeydown(e) {
  if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
    e.preventDefault();
    handlePlayClick();
  }
  if (e.key === 'Escape' && drawerEl && !drawerEl.hidden) closeViewer();
}

// ---- Epic 6: Viewer + Shared Add (prin Cloudflare Worker — tokenul NU e în browser) ----

// Turnstile (anti-bot, opțional): se încarcă DOAR dacă TURNSTILE_SITEKEY e setat (zero request altfel)
let turnstileWidgetId = null;
function loadTurnstile() {
  if (!TURNSTILE_SITEKEY || document.getElementById('cf-turnstile-script')) return;
  const s = document.createElement('script');
  s.id = 'cf-turnstile-script';
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  s.async = true; s.defer = true;
  s.onload = () => {
    const host = byId('turnstile-host');
    if (host && typeof turnstile !== 'undefined') {
      turnstileWidgetId = turnstile.render(host, { sitekey: TURNSTILE_SITEKEY, size: 'invisible' });
    }
  };
  document.head.appendChild(s);
}
async function getTurnstileToken() {
  if (!TURNSTILE_SITEKEY || typeof turnstile === 'undefined' || turnstileWidgetId === null) return '';
  try {
    turnstile.reset(turnstileWidgetId);
    return await new Promise((resolve) => {
      turnstile.execute(turnstileWidgetId, { callback: resolve });
      setTimeout(() => resolve(''), 8000); // timeout de siguranță
    });
  } catch (e) { return ''; }
}

function setAddStatus(msg, kind) {
  addStatus.textContent = msg;
  addStatus.className = 'add-status' + (kind ? ' is-' + kind : '');
}

async function handleAddWord() {
  const v = validateNewWord(addInput.value);
  if (!v.ok) { setAddStatus(v.msg, 'err'); return; }
  if (!WORKER_URL) { setAddStatus('adăugarea nu e configurată încă (vezi docs/worker-setup.md)', 'err'); return; }
  // merge optimist: apare imediat la mine (canonic vine la toți după CI+deploy, D24)
  sessionAdded[state.level].push(v.word);
  addInput.value = '';
  renderViewer();
  setAddStatus('se adaugă „' + v.word + '"…', '');
  addBtn.disabled = true;
  try {
    const cfToken = await getTurnstileToken();
    const r = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word: v.word, level: state.level, cfToken: cfToken }),
    });
    if (!r.ok) {
      const d = await r.json().catch(() => ({}));
      throw new Error(d.error || ('http ' + r.status));
    }
    setAddStatus('„' + v.word + '" adăugat — apare la toți în ~1-2 min', 'ok');
  } catch (e) {
    const i = sessionAdded[state.level].indexOf(v.word); // revert optimist
    if (i >= 0) sessionAdded[state.level].splice(i, 1);
    renderViewer();
    const m = String(e.message);
    if (m === 'exists') setAddStatus('cuvântul există deja în bancă', 'err');
    else if (m === 'turnstile') setAddStatus('verificare anti-bot eșuată — reîncearcă', 'err');
    else if (m === 'origin') setAddStatus('cerere blocată (origin)', 'err');
    else setAddStatus('nu am putut salva (' + m + ') — reîncearcă', 'err');
    console.error('add fail', e);
  } finally {
    addBtn.disabled = false;
  }
}

function renderViewer() {
  const lvl = state.level;
  const canonical = WORD_BANK[lvl];
  const mine = sessionAdded[lvl] || [];
  viewerTitle.textContent = lvl + ' · ' + (canonical.length + mine.length) + ' cuvinte';
  viewerList.replaceChildren();
  const add = (w, mineFlag) => {
    const li = document.createElement('li');
    li.textContent = w;
    if (mineFlag) { li.className = 'is-mine'; li.title = 'adăugat de tine — se publică în ~1-2 min'; }
    viewerList.appendChild(li);
  };
  canonical.forEach((w) => add(w, false));
  mine.forEach((w) => add(w, true));
}

function openViewer() { drawerEl.hidden = false; document.body.classList.add('is-drawer-open'); renderViewer(); }
function closeViewer() { drawerEl.hidden = true; document.body.classList.remove('is-drawer-open'); }

function updateViewerCount() {
  if (!openViewerBtn) return;
  openViewerBtn.textContent = 'vezi cuvintele (' + (WORD_BANK[state.level].length + sessionAdded[state.level].length) + ')';
}

// ---- Boot ----
function boot() {
  wordEl = byId('hero-word'); messageEl = byId('message'); playBtn = byId('btn-play-pause');
  speedSlider = byId('speed-slider'); speedValueEl = byId('speed-value'); levelSegmentsEl = byId('level-segments');
  fullscreenBtn = byId('btn-fullscreen'); timerFill = byId('timer-fill');
  if (![wordEl, messageEl, playBtn, speedSlider, speedValueEl, levelSegmentsEl, fullscreenBtn, timerFill].every(Boolean)) {
    console.error('Refs DOM lipsă'); return; // guard refs
  }
  levelSegs = Array.from(levelSegmentsEl.querySelectorAll('.level-segment'));

  if (typeof WORD_BANK === 'undefined' || typeof WORD_BANK_META === 'undefined') {
    state.error = true;
    state.errorMessage = 'nu am putut încărca cuvintele. reîncarcă pagina.';
    render(); console.error('WORD_BANK lipsește'); return;
  }
  console.log('bancă:', WORD_BANK_META.count, 'cuvinte · hash', String(WORD_BANK_META.hash).slice(0,8));

  loadSettings();
  if (!WORD_BANK[state.level]) state.level = 'incepator';
  state.ready = true;
  state.word = pickWord(bankFor(state.level), '');
  state.playing = false; // default PAUSED (gata cu auto-start)
  render();

  // listeners la fundul boot-ului (D8)
  playBtn.addEventListener('click', handlePlayClick);
  speedSlider.addEventListener('input', handleSpeedInput);
  speedSlider.addEventListener('change', handleSpeedChange);
  levelSegmentsEl.addEventListener('click', handleLevelClick); // delegation
  document.addEventListener('keydown', handleKeydown);

  // Fullscreen (FR8): feature-detect — ascunde butonul dacă API-ul lipsește (iPhone), nu buton mort
  if (document.documentElement.requestFullscreen) {
    fullscreenBtn.addEventListener('click', handleFullscreen);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  } else {
    fullscreenBtn.hidden = true;
  }

  // Epic 6: viewer + add (opțional — dacă markup-ul lipsește, app-ul merge fără)
  openViewerBtn = byId('open-viewer'); drawerEl = byId('viewer');
  viewerTitle = byId('viewer-title'); viewerList = byId('viewer-list');
  viewerClose = byId('viewer-close'); viewerOverlay = byId('viewer-overlay');
  addInput = byId('add-input'); addBtn = byId('add-btn'); addStatus = byId('add-status');
  if (openViewerBtn && drawerEl) {
    updateViewerCount();
    loadTurnstile(); // încarcă anti-bot doar dacă e configurat (altfel no-op)
    openViewerBtn.addEventListener('click', openViewer);
    viewerClose.addEventListener('click', closeViewer);
    viewerOverlay.addEventListener('click', closeViewer);
    addBtn.addEventListener('click', handleAddWord);
    addInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAddWord(); });
  }
}

// ---- Teste funcții pure (?test=1, fără Node — D11) ----
function runTests() {
  const out = [];
  const ok = (n, c) => out.push((c ? 'OK   ' : 'FAIL ') + n);
  ok('clampDelay jos', clampDelay(500) === MIN_DELAY);
  ok('clampDelay sus', clampDelay(99000) === MAX_DELAY);
  ok('clampDelay NaN→default', clampDelay(NaN) === DEFAULT_DELAY);
  ok('clampDelay în interval', clampDelay(5000) === 5000);
  ok('pickWord 1 cuvânt', pickWord(['a'], 'a') === 'a');
  ok('pickWord 2 → celălalt', pickWord(['a', 'b'], 'a') === 'b');
  let rep = 0;
  for (let i = 0; i < 300; i++) if (pickWord(['a', 'b', 'c', 'd', 'e'], 'a') === 'a') rep++;
  ok('pickWord no-immediate-repeat', rep === 0);
  const failed = out.filter(r => r.startsWith('FAIL'));
  console.log('%c?test=1', 'font-weight:bold'); out.forEach(r => console.log(r));
  console.log(failed.length ? `❌ ${failed.length} pică` : `✅ toate ${out.length} trec`);
  if (messageEl) messageEl.textContent = failed.length ? `${failed.length} teste PICĂ (consolă)` : `✅ ${out.length} teste trec`;
}

document.addEventListener('DOMContentLoaded', function () {
  if (location.search.includes('test')) {
    messageEl = byId('message');
    runTests();
    return;
  }
  boot();
});

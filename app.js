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
const WORKER_URL = 'https://rapscript-gh.ionutg40.workers.dev';
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
  listening: false, // Epic 8: microfon activ
  micMsg: '',       // status microfon (afișat în message)
};

// ---- Refs DOM (cache o dată) ----
let wordEl, messageEl, playBtn, speedSlider, speedValueEl, levelSegmentsEl, fullscreenBtn, timerFill, rhymeHintEl, micBtn;
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
    updateRhymeHint(state.word); // rime ambientale sus — se schimbă odată cu cuvântul (Epic 7)
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

  // microfon (Epic 8): butonul reflectă starea; message arată statusul mic (sau gol)
  if (micBtn) {
    micBtn.setAttribute('aria-pressed', String(state.listening));
    document.body.classList.toggle('is-listening', state.listening);
  }
  messageEl.textContent = state.micMsg || ''; // controalele arată starea; message = loading/error/mic
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
  state.micMsg = ''; // generatorul a luat-o înainte → curăță statusul mic
  render();
  retriggerTimerBar(); // bara repornește pe noul cuvânt
}

function handlePlayClick() {
  if (!state.ready) return;
  if (state.listening) stopListening(); // play repornește generatorul → oprește mic-ul
  state.playing = !state.playing;
  if (state.playing) { state.micMsg = ''; state.word = pickWord(bankFor(state.level), state.word); } // cuvânt nou la play (t=0)
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
  if (e.key === 'Escape' && drawerEl && !drawerEl.hidden) closeViewer();
}

// Space: tap scurt = play/pause; ținut apăsat = vorbește (push-to-talk, dacă mic-ul e disponibil)
const PTT_HOLD_MS = 250;
let pttTimer = null, pttTalking = false;
function handleSpaceDown(e) {
  if (e.code !== 'Space' || e.repeat) return;
  const t = e.target.tagName;
  if (t === 'BUTTON' || t === 'INPUT' || t === 'TEXTAREA') return; // lasă butonul/inputul focalizat
  e.preventDefault(); // fără scroll
  if (speechSupported()) {
    pttTalking = false;
    pttTimer = setTimeout(function () { pttTalking = true; startListening(); }, PTT_HOLD_MS);
  }
}
function handleSpaceUp(e) {
  if (e.code !== 'Space') return;
  const t = e.target.tagName;
  if (t === 'BUTTON' || t === 'INPUT' || t === 'TEXTAREA') return;
  if (speechSupported()) {
    clearTimeout(pttTimer);
    if (pttTalking) { pttTalking = false; stopListening(); return; } // a fost ținut → oprește vorbirea
  }
  handlePlayClick(); // tap scurt (sau mic indisponibil) → play/pause
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

// ---- Epic 7: motor de rimă ----
// G2P pur — OGLINDA EXACTĂ a gen_rhymes.py (paritate verificată în ?test=1). Dacă diverg → testul pică.
const RO_VOWEL = { 'a': 'a', 'ă': '@', 'â': '1', 'î': '1', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u' };
const RO_CONS = {
  'ș': 'S', 'ş': 'S', 'ț': 'T', 'ţ': 'T', 'j': 'Z',
  'b': 'b', 'd': 'd', 'f': 'f', 'h': 'h', 'k': 'k', 'l': 'l', 'm': 'm',
  'n': 'n', 'p': 'p', 'r': 'r', 's': 's', 't': 't', 'v': 'v', 'z': 'z',
  'q': 'k', 'w': 'v', 'y': 'i',
};

// cuvânt RO (lowercase) → [[sym, eVocală], …]. Reguli context-sensitive (D28).
function g2p(word) {
  const toks = [];
  const n = word.length;
  let i = 0;
  while (i < n) {
    const c = word[i];
    const nxt = i + 1 < n ? word[i + 1] : '';
    if (c === 'c') {
      if (nxt === 'h') { toks.push(['k', false]); i += 2; continue; }      // ch → /k/
      if (nxt === 'e' || nxt === 'i') { toks.push(['tS', false]); i += 1; continue; } // ce/ci → /tʃ/
      toks.push(['k', false]); i += 1; continue;
    }
    if (c === 'g') {
      if (nxt === 'h') { toks.push(['g', false]); i += 2; continue; }      // gh → /g/
      if (nxt === 'e' || nxt === 'i') { toks.push(['dZ', false]); i += 1; continue; } // ge/gi → /dʒ/
      toks.push(['g', false]); i += 1; continue;
    }
    if (c === 'x') { toks.push(['k', false]); toks.push(['s', false]); i += 1; continue; } // x → /ks/
    if (RO_VOWEL[c]) { toks.push([RO_VOWEL[c], true]); i += 1; continue; }
    toks.push([RO_CONS[c] || c, false]); i += 1;
  }
  // -i final palatalizat (lupi /lupʲ/): după consoană → marcaj, nu nucleu
  const L = toks.length;
  if (L >= 2 && toks[L - 1][0] === 'i' && toks[L - 1][1] && !toks[L - 2][1]) toks[L - 1] = ['j', false];
  return toks;
}

// cheile de rimă pt un cuvânt; aplică override-ul de accent din RHYME_STRESS (RoLEX) — oglindă Python
function rhymeKeysFor(word) {
  const toks = g2p(word);
  const nuc = [];
  for (let k = 0; k < toks.length; k++) if (toks[k][1]) nuc.push(k);
  if (!nuc.length) return null;
  const ov = (typeof RHYME_STRESS !== 'undefined') ? RHYME_STRESS[word] : undefined;
  let s;
  if (Number.isInteger(ov) && ov >= 0 && ov < nuc.length) s = nuc[nuc.length - 1 - ov];
  else if (toks[toks.length - 1][1]) s = nuc.length >= 2 ? nuc[nuc.length - 2] : nuc[nuc.length - 1];
  else s = nuc[nuc.length - 1];
  const tail = toks.slice(s);
  return {
    p: tail.map((t) => t[0]).join('.'),                     // perfect: toate fonemele de la accent
    a: tail.filter((t) => t[1]).map((t) => t[0]).join('.'), // asonanță: doar vocalele
  };
}

// rime pentru un cuvânt: bank → RHYME_KEYS (canonic, respectă stress.json); altfel → G2P runtime.
// extra = rime externe (RoLEX) pt cuvintele sub-deservite în bancă (backfill la 5, D27/OQ-V3).
function rhymesFor(raw) {
  const norm = String(raw || '').trim().toLowerCase().normalize('NFC');
  if (!norm) return { empty: true, perfect: [], near: [], extra: [] };
  if (typeof RHYME_INDEX === 'undefined') return { empty: false, perfect: [], near: [], extra: [] };
  const keys = (typeof RHYME_KEYS !== 'undefined' && RHYME_KEYS[norm]) ? RHYME_KEYS[norm] : rhymeKeysFor(norm);
  if (!keys) return { empty: false, perfect: [], near: [], extra: [] };
  const perfect = (RHYME_INDEX.perfect[keys.p] || []).filter((w) => w !== norm);
  const seen = new Set(perfect);
  const near = (RHYME_INDEX.asonanta[keys.a] || []).filter((w) => w !== norm && !seen.has(w));
  near.forEach((w) => seen.add(w));
  const extra = (typeof RHYME_EXTRA !== 'undefined' && RHYME_EXTRA[norm] ? RHYME_EXTRA[norm] : []).filter((w) => !seen.has(w));
  return { empty: false, perfect: perfect, near: near, extra: extra };
}

// ---- Epic 8: intrare vocală (Web Speech API, D31=A) — cuvântul rostit → cuvântul din centru (D41) ----
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function stripDiacritics(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }

function allBankWords() {
  const out = [];
  for (const lvl of LEVELS) { out.push.apply(out, WORD_BANK[lvl]); out.push.apply(out, sessionAdded[lvl] || []); }
  return out;
}

// fuzzy-snap (D36): cel mai apropiat cuvânt din bancă dacă e suficient de aproape; altfel cuvântul brut.
// Transformă un ASR cu WER mare pe rap într-un clasificator pe banca închisă (NU rime greșite tăcute).
function snapToBank(raw) {
  const word = String(raw || '').trim().toLowerCase().split(/\s+/).pop() || '';
  if (!word) return '';
  const wn = stripDiacritics(word);
  let best = '', bestD = Infinity;
  for (const b of allBankWords()) {
    const d = levenshtein(wn, stripDiacritics(b.toLowerCase()));
    if (d < bestD) { bestD = d; best = b; if (d === 0) break; }
  }
  const thresh = Math.max(1, Math.floor(word.length * 0.34));
  return (best && bestD <= thresh) ? best : word;
}

let recognition = null;
function speechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition) && window.isSecureContext;
}
function getRecognition() {
  if (recognition) return recognition;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'ro-RO';
  recognition.interimResults = true; // afișează cuvântul cum îl spui (D34)
  recognition.continuous = true;
  recognition.onresult = function (e) {
    let txt = '';
    for (let i = e.resultIndex; i < e.results.length; i++) txt = e.results[i][0].transcript;
    const w = snapToBank(txt);          // D36: snap pe bancă
    if (w) { state.word = w; state.micMsg = '🎤 „' + w + '"'; render(); } // → cuvânt central → rime ambientale (D41)
  };
  recognition.onerror = function (e) {
    const map = {
      'not-allowed': 'acces microfon refuzat', 'service-not-allowed': 'microfon indisponibil',
      'no-speech': 'n-am auzit nimic — reîncearcă', 'audio-capture': 'fără microfon', 'network': 'eroare de rețea',
    };
    state.listening = false; state.micMsg = '⚠ ' + (map[e.error] || ('microfon: ' + e.error)); render();
  };
  recognition.onend = function () { state.listening = false; render(); };
  return recognition;
}
function startListening() {
  if (!speechSupported() || state.listening) return;
  if (state.playing) { state.playing = false; restartTimer(); } // oprește generatorul auto (cuvântul rostit rămâne)
  try {
    getRecognition().start();
    state.listening = true; state.micMsg = '🎤 ascult… (audio → Google)'; render(); // disclosure privacy (D39)
  } catch (e) { /* deja pornit — ignoră */ }
}
function stopListening() {
  if (!state.listening) return;
  try { getRecognition().stop(); } catch (e) { /* nimic */ }
  state.listening = false; render();
}
function toggleListening() { if (state.listening) stopListening(); else startListening(); }

const RHYME_HINT_N = 5; // câte rime ambientale arătăm sus pt cuvântul curent

// rime ambientale: top-N pt cuvântul de pe ecran, gri-umbră sus. Apelat din render() la schimbare.
function updateRhymeHint(word) {
  if (!rhymeHintEl) return;
  const r = rhymesFor(word);
  const five = r.perfect.concat(r.near).concat(r.extra).slice(0, RHYME_HINT_N);
  rhymeHintEl.replaceChildren();
  for (const w of five) {
    const s = document.createElement('span');
    s.className = 'rhyme-hint__w';
    s.textContent = w;
    rhymeHintEl.appendChild(s);
  }
}

// ---- Boot ----
function boot() {
  wordEl = byId('hero-word'); messageEl = byId('message'); playBtn = byId('btn-play-pause');
  speedSlider = byId('speed-slider'); speedValueEl = byId('speed-value'); levelSegmentsEl = byId('level-segments');
  fullscreenBtn = byId('btn-fullscreen'); timerFill = byId('timer-fill');
  rhymeHintEl = byId('rhyme-hint'); // opțional — updateRhymeHint guard-uiește dacă lipsește
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
  document.addEventListener('keydown', handleSpaceDown); // Space: tap=play, ținut=vorbește
  document.addEventListener('keyup', handleSpaceUp);

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

  // Epic 7: index de rime pt sugestiile ambientale (D41) — fail-loud dacă lipsește
  if (typeof RHYME_INDEX === 'undefined') {
    console.error('RHYME_INDEX lipsește — sugestiile de rimă nu vor apărea.');
  } else {
    console.log('rime:', RHYME_META.count, 'cuvinte · hash', String(RHYME_META.hash).slice(0, 8));
  }

  // Epic 8: microfon (D31=A Web Speech) — DOAR pe context securizat + suportat (D32); altfel ascuns
  // push-to-talk e pe Space (vezi handleSpaceDown/Up); aici doar butonul + feature-detect (D32)
  micBtn = byId('btn-mic');
  if (micBtn && speechSupported()) {
    micBtn.hidden = false;
    micBtn.addEventListener('click', toggleListening);
    console.log('microfon: Web Speech ro-RO (ține Space sau 🎤; tap Space = play/pauză)');
  } else if (micBtn) {
    micBtn.hidden = true; // file:// / Firefox / iOS-Chrome → fără buton mort (D32)
    console.log('microfon indisponibil (context ne-securizat sau browser nesuportat) — ascuns.');
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

  // Epic 7: paritate G2P JS↔Python — fiecare cuvânt din bancă trebuie să dea EXACT cheile din rhymes.js
  if (typeof RHYME_KEYS !== 'undefined') {
    let mism = 0, checked = 0;
    for (const w in RHYME_KEYS) {
      checked++;
      const k = rhymeKeysFor(w);
      if (!k || k.p !== RHYME_KEYS[w].p || k.a !== RHYME_KEYS[w].a) {
        mism++;
        if (mism <= 5) console.warn('paritate G2P mismatch:', w, '→ JS', k, 'vs PY', RHYME_KEYS[w]);
      }
    }
    ok('G2P paritate JS↔Python (' + checked + ' cuvinte)', mism === 0);
  } else {
    ok('rhymes.js încărcat', false);
  }
  // semantic: rima reală + robustețe pe necunoscut
  if (typeof RHYME_INDEX !== 'undefined') {
    ok('rimă: lumină → conține albină', rhymesFor('lumină').perfect.includes('albină'));
    ok('rimă: cuvânt necunoscut nu crapă', rhymesFor('zzqxw').perfect.length === 0);
    ok('rimă: gol → empty', rhymesFor('').empty === true);
  }
  // Epic 8: fuzzy-snap (D36)
  ok('levenshtein', levenshtein('sceptru', 'sceptrx') === 1 && levenshtein('abc', 'abc') === 0);
  if (typeof WORD_BANK !== 'undefined') {
    ok('snap exact (sceptru)', snapToBank('sceptru') === 'sceptru');
    ok('snap fuzzy → bancă', snapToBank('libertatea') === 'libertate');
    ok('snap necunoscut → brut', snapToBank('calculatorxyz') === 'calculatorxyz');
    ok('snap ia ultimul cuvânt', snapToBank('zic libertate') === 'libertate');
  }

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

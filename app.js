'use strict';
// RapScript RO — inima (Epic 3). Contracte: vezi docs/architecture.md › Implementation Patterns.

// ---- Config (UPPER_SNAKE, sus; numere magice ca constante) ----
const MIN_DELAY = 2000;
const MAX_DELAY = 12000;
const DEFAULT_DELAY = 4000;
const DEFAULT_LEVEL = 'avansat';

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
let wordEl = null;
let messageEl = null;
let prevWord = null; // pentru animația-la-schimbare (Epic 5)

// ---- Funcții pure (testabile, ?test=1) ----
function clampDelay(ms) {
  if (!Number.isFinite(ms)) return DEFAULT_DELAY; // garbage din localStorage → default
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, ms));
}

function pickWord(bankArray, currentWord) {
  if (bankArray.length === 1) return bankArray[0];               // 1 cuvânt → acceptă repetarea
  if (bankArray.length === 2) {                                  // exact 2 → celălalt, determinist
    return bankArray[0] === currentWord ? bankArray[1] : bankArray[0];
  }
  let pick = currentWord;
  for (let i = 0; i < 10 && pick === currentWord; i++) {         // retry mărginit (FR3)
    pick = bankArray[Math.floor(Math.random() * bankArray.length)];
  }
  return pick;
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

  if (state.ready) {
    wordEl.textContent = state.word;
    prevWord = state.word; // animația la schimbare vine în Epic 5
    messageEl.textContent = (state.intervalMs / 1000) + 's · ' + state.level;
  }
  console.assert(!state.ready || state.word !== '', 'render: ready cere un cuvânt');
}

// ---- Effect helpers (a treia lume: nici state, nici DOM — D9) ----
function restartTimer() {
  clearInterval(state.intervalId);
  state.intervalId = null;
  if (state.playing) {
    state.intervalId = setInterval(handleTick, state.intervalMs);
  }
}

// ---- Handlere ----
function handleTick() {
  // mutate state → render (forma canonică); handleTick = excepția care schimbă cuvântul
  state.word = pickWord(WORD_BANK[state.level], state.word);
  render();
}

// ---- Boot ----
function boot() {
  wordEl = document.getElementById('hero-word');
  messageEl = document.getElementById('message');
  if (!wordEl || !messageEl) { console.error('Refs DOM lipsă'); return; } // guard refs

  // guard bancă — fail-loud, nu crash (D10)
  if (typeof WORD_BANK === 'undefined' || typeof WORD_BANK_META === 'undefined') {
    state.error = true;
    state.errorMessage = 'nu am putut încărca cuvintele. reîncarcă pagina.';
    render();
    console.error('WORD_BANK lipsește — words.js neîncărcat?');
    return;
  }
  console.log('bancă:', WORD_BANK_META.count, 'cuvinte ·', WORD_BANK_META.generated);

  if (!WORD_BANK[state.level]) state.level = 'incepator'; // validare level
  state.ready = true;
  state.word = pickWord(WORD_BANK[state.level], ''); // primul cuvânt (scena nu e goală)

  // Epic 3: AUTO-START ca să se vadă cuvintele schimbându-se.
  // TODO Epic 4: înlocuiește cu butonul Play; default = paused.
  state.playing = true;
  render();        // primul cuvânt la t=0
  restartTimer();  // pornește schimbarea la interval
}

// ---- Teste funcții pure (?test=1, fără Node — D11) ----
function runTests() {
  const out = [];
  const ok = (name, cond) => out.push((cond ? 'OK   ' : 'FAIL ') + name);

  ok('clampDelay clamp jos', clampDelay(500) === MIN_DELAY);
  ok('clampDelay clamp sus', clampDelay(99000) === MAX_DELAY);
  ok('clampDelay NaN→default', clampDelay(NaN) === DEFAULT_DELAY);
  ok('clampDelay în interval', clampDelay(5000) === 5000);
  ok('pickWord 1 cuvânt', pickWord(['a'], 'a') === 'a');
  ok('pickWord 2 cuvinte → celălalt', pickWord(['a', 'b'], 'a') === 'b');
  let rep = 0;
  for (let i = 0; i < 300; i++) { if (pickWord(['a', 'b', 'c', 'd', 'e'], 'a') === 'a') rep++; }
  ok('pickWord no-immediate-repeat (≥3)', rep === 0);

  const failed = out.filter(r => r.startsWith('FAIL'));
  console.log('%c?test=1', 'font-weight:bold'); out.forEach(r => console.log(r));
  console.log(failed.length ? `❌ ${failed.length} pică` : `✅ toate ${out.length} trec`);
  if (messageEl) messageEl.textContent = failed.length
    ? `${failed.length} teste PICĂ (vezi consola)` : `✅ ${out.length} teste trec`;
}

document.addEventListener('DOMContentLoaded', function () {
  if (location.search.includes('test')) {
    wordEl = document.getElementById('hero-word');
    messageEl = document.getElementById('message');
    runTests();
    return; // în test mode nu pornim app-ul
  }
  boot();
});

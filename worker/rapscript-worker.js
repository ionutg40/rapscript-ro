// rapscript-worker — backend minimal pe Cloudflare Workers.
// Ține tokenul GitHub ca SECRET (setat o dată) → browserul nu-l vede niciodată.
// Primește un cuvânt, îl validează, îl comite în wordbank.json. CI-ul regenerează words.js.
//
// Secrete de pus în Worker → Settings → Variables and Secrets (tip "Secret"):
//   GH_TOKEN          = fine-grained PAT (Contents: Read/Write DOAR pe ionutg40/rapscript-ro)
//   TURNSTILE_SECRET  = (recomandat) secret Cloudflare Turnstile, anti-bot. Dacă lipsește, Turnstile e sărit.
//
// Protecții: Origin check + validare strictă + size cap + Turnstile + token scoped + zero error leakage.
// Rate-limit: se pune din dashboard (Security → WAF/Rate limiting) — vezi docs/worker-setup.md.

const REPO = 'ionutg40/rapscript-ro';
const BRANCH = 'main';
const FILE_PATH = 'assets/wordbank.json';
const ALLOWED_ORIGIN = 'https://ionutg40.github.io';
const LEVELS = ['incepator', 'avansat', 'profesionist'];
const WORD_RE = /^[a-zăâîșț-]{1,40}$/; // un singur cuvânt RO, fără spațiu/virgulă, max 40

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return reply({ error: 'method' }, 405, cors);
    if (request.headers.get('Origin') !== ALLOWED_ORIGIN) return reply({ error: 'origin' }, 403, cors);

    let body;
    try { body = await request.json(); } catch (e) { return reply({ error: 'json' }, 400, cors); }
    const word = String(body.word || '').trim().toLowerCase();
    const level = String(body.level || '');
    if (!WORD_RE.test(word)) return reply({ error: 'word' }, 400, cors);
    if (!LEVELS.includes(level)) return reply({ error: 'level' }, 400, cors);

    if (env.TURNSTILE_SECRET) {
      const ok = await verifyTurnstile(body.cfToken, env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'));
      if (!ok) return reply({ error: 'turnstile' }, 403, cors);
    }

    try {
      await commitWord(word, level, env.GH_TOKEN);
      return reply({ ok: true }, 200, cors);
    } catch (e) {
      // zero error leakage: nu întoarcem mesajul brut (poate conține detalii server)
      return reply({ error: e.message === 'exists' ? 'exists' : 'commit' }, e.message === 'exists' ? 409 : 500, cors);
    }
  },
};

function reply(obj, status, cors) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...cors } });
}

async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip || '' }),
  });
  const d = await r.json();
  return !!d.success;
}

const GH = 'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH;
const ghHeaders = (token) => ({ Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'User-Agent': 'rapscript-worker' });

// base64 UTF-8 safe (altfel diacriticele ă/â/î/ș/ț se corup — capcana #1)
function decodeB64(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  return new TextDecoder('utf-8').decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
function encodeB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

async function commitWord(word, level, token) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const g = await fetch(GH + '?ref=' + BRANCH, { headers: ghHeaders(token) });
    if (!g.ok) throw new Error('get');
    const meta = await g.json();
    const data = JSON.parse(decodeB64(meta.content));
    const exists = LEVELS.some((l) => (data.levels[l] || []).some((w) => w.toLowerCase() === word));
    if (exists) throw new Error('exists');
    data.levels[level] = data.levels[level].concat(word).sort();
    const p = await fetch(GH, {
      method: 'PUT',
      headers: ghHeaders(token),
      body: JSON.stringify({
        message: 'Add cuvânt: ' + word + ' (' + level + ') [via worker]',
        content: encodeB64(JSON.stringify(data, null, 2) + '\n'),
        sha: meta.sha,
        branch: BRANCH,
      }),
    });
    if (p.ok) return;
    if (p.status === 409) continue; // sha învechit (alt commit) → re-fetch + retry
    throw new Error('put');
  }
  throw new Error('conflict');
}

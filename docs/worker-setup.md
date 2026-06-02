# Setup Cloudflare Worker — token o dată, pe veci (owner, ~20 min, fără terminal)

Tokenul GitHub stă ca **secret pe Worker**, setat O SINGURĂ DATĂ de tine. Userii nu văd niciodată un
token, niciun câmp. Browserul vorbește cu Worker-ul, Worker-ul comite în `wordbank.json`, CI regenerează.

Tot ce faci se face **din dashboard-ul web** (browser), nu din terminal.

## A. Token GitHub (5 min)
1. `github.com/settings/tokens?type=beta` → **Generate new token** (fine-grained).
2. Repository access: **doar** `ionutg40/rapscript-ro`. Permissions → **Contents: Read and write**. Nimic altceva.
3. Expirare: 1 an (max). Generate → copiază `github_pat_…` (apare o dată — pune-l temporar într-un fișier text).
   *(Capcana pe termen lung: la expirare, app-ul „nu mai salvează" (401). Pune-ți reminder în calendar la data aia.)*

## B. Creează Worker-ul (10 min)
4. `cloudflare.com` → cont gratuit (email + parolă + confirmare).
5. Dashboard → **Workers & Pages** → **Create** → **Create Worker** → nume `rapscript-gh` → **Deploy**.
6. **Edit code** → șterge tot → lipește conținutul din `worker/rapscript-worker.js` (din repo) → **Deploy**.

## C. Pune secretul/secretele (3 min)
7. Worker → **Settings** → **Variables and Secrets** → **Add**:
   - tip **Secret** (NU „Text/Plaintext"! — capcana #1; dacă nu vezi „Secret", trimite-mi un screenshot),
   - nume `GH_TOKEN`, valoare = tokenul de la pasul 3 → **Save/Deploy**.

## D. Leagă aplicația (2 min)
8. Copiază URL-ul Worker-ului: `https://rapscript-gh.<contul-tău>.workers.dev`.
9. În `app.js`, sus, pune-l la `WORKER_URL`:
   ```js
   const WORKER_URL = 'https://rapscript-gh.<contul-tău>.workers.dev';
   ```
10. Commit + push `app.js`. Gata — adăugarea din UI funcționează, zero token în browser.

## E. Curățenie
11. Șterge fișierul text cu tokenul. Worker-ul îl ține acum.

---

## (Recomandat) Hardening anti-bot + abuz — fă-l după ce merge

Endpoint-ul Worker-ului e public (URL-ul e în `app.js`). Pentru 2 useri + un word bank e risc mic
(CI validează + orice commit e revertabil), dar pune astea când ai timp:

- **Turnstile (anti-bot invizibil, free) — cel mai important:**
  1. Cloudflare → **Turnstile** → Add site → domeniu `ionutg40.github.io` → primești **Site Key** (public) + **Secret Key**.
  2. În `app.js`: `const TURNSTILE_SITEKEY = '<site key>';`
  3. În Worker → Settings → Variables and Secrets → Secret `TURNSTILE_SECRET` = `<secret key>`.
  - Gata: app-ul ia automat un token anti-bot, Worker-ul îl verifică. Un `curl` simplu nu mai trece.
- **Rate limiting:** Worker → Settings → (sau zona Security) → o regulă „max ~5 req/min pe IP". Plafonează abuzul.
- **Token scoped** (deja): fine-grained, `contents:write`, UN singur repo — blast radius minim.

> **gotcha:** tokenul trăiește pe Worker-ul `rapscript-gh`, secret `GH_TOKEN`, setat o dată. Userii nu-l
> văd. Dacă app-ul dă eroare la salvare → token expirat → regenerează-l (GitHub, Contents R/W pe acest
> repo) și updatează-l ÎNTR-UN SINGUR LOC: Worker → Settings → Variables and Secrets → `GH_TOKEN`.

UI-ul Cloudflare se schimbă des și knowledge-ul meu are o limită — la pasul 7 (Secret) și la Turnstile,
dacă butonul nu arată ca-n pași, **trimite-mi un screenshot** și te duc exact unde trebuie.

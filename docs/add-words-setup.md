# Adăugare cuvinte din UI — setup (o singură dată per user)

RapScript folosește **GitHub ca backend**: când adaugi un cuvânt din aplicație, el se scrie în
`assets/wordbank.json` (în repo), un GitHub Action regenerează `words.js`, iar Pages redeployează —
deci cuvântul ajunge la **toți userii** în ~1-2 minute. Fără server propriu.

Ca să poți adăuga (NU și ca să folosești app-ul — generatorul merge pentru oricine), ai nevoie de:

## 1. Să fii colaborator pe repo
Owner-ul (ionutg40) te adaugă: **repo → Settings → Collaborators → Add people**. Accepți invitația.
*(Tu, ionutg40, ești deja owner.)*

## 2. Un token GitHub fine-grained (cu drepturi minime)
1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new**.
2. **Repository access:** Only select repositories → `rapscript-ro`.
3. **Permissions → Repository permissions → Contents:** **Read and write**. (Atât. Nimic altceva.)
4. Expirare: alege cât vrei (ex. 90 zile). Generează, copiază tokenul (`github_pat_…`).

## 3. Bagă tokenul în aplicație
În app → `vezi cuvintele` → secțiunea **„token GitHub (o singură dată)"** → lipești tokenul → `salvează`.

## Unde trăiește tokenul (onest)
- Salvat **DOAR în browserul tău** (`localStorage`, cheia `rapscript:ghtoken`). Nu pleacă nicăieri
  altundeva decât la `api.github.com` când adaugi un cuvânt. Niciodată în repo, niciodată logat.
- E al TĂU și cu drepturi minime (doar scriere pe acest repo). Dacă-l pierzi: revoci tokenul din GitHub.
- Pe alt dispozitiv/browser → repeți pasul 3 (tokenul nu se sincronizează).

## Ce se întâmplă când adaugi
1. Validare locală (un cuvânt, fără dubluri) → 2. commit în `wordbank.json` (cu tokenul tău) →
3. CI rulează `gen_words.py` (re-validează: fără dubluri cross-nivel, format) → regenerează `words.js` →
4. Pages redeployează → toți văd cuvântul (~1-2 min). Tu îl vezi imediat (merge optimist în sesiune).

Dacă CI dă roșu (ex. cuvânt care încalcă o regulă scăpată local), `words.js` NU se regenerează — banca
canonică rămâne curată (fail-loud). Owner-ul vede checkul roșu.

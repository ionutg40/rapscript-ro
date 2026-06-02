# Adăugare cuvinte din UI — setup (1 token, pe ambele device-uri)

RapScript folosește **GitHub ca backend**: când adaugi un cuvânt din aplicație, el se scrie în
`assets/wordbank.json` (în repo), un GitHub Action regenerează `words.js`, iar Pages redeployează —
deci cuvântul ajunge la **toți userii** în ~1-2 minute. Fără server propriu.

**Model ales (2 useri de încredere):** UN singur token (al owner-ului), lipit pe ambele device-uri.
Colegul NU are nevoie de cont GitHub sau de drepturi pe repo — doar lipește același token.
*(A juca / a vedea lista nu cere token deloc — doar adăugarea.)*

## 1. Creează tokenul (o singură dată, owner-ul = ionutg40)
1. Mergi la **`github.com/settings/tokens?type=beta`** (Fine-grained tokens)
   — sau: avatar → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. **Generate new token.** Nume: ex. „rapscript add". Expirare: ex. 90 zile.
3. **Repository access:** Only select repositories → `rapscript-ro`.
4. **Permissions → Repository permissions → Contents:** **Read and write**. (Atât — nimic altceva.)
5. **Generate token** → copiază tokenul (`github_pat_…`). **Apare o singură dată** — salvează-l pe loc.

## 2. Lipește tokenul în aplicație (pe FIECARE device de pe care vrei să adaugi)
În app → `vezi cuvintele` → apasă **adaugă** o dată → apare câmpul de token → lipești tokenul → **salvează**.
Câmpul dispare după aceea. Repeți pe al 2-lea device (telefon/laptopul colegului) cu **același** token.

## Unde trăiește tokenul (onest)
- Salvat **DOAR în browserul unde l-ai lipit** (`localStorage`, cheia `rapscript:ghtoken`). Nu pleacă
  nicăieri altundeva decât la `api.github.com` când adaugi un cuvânt. Niciodată în repo, niciodată logat.
- E scoped la minim (doar scriere pe acest repo). Toate adăugările apar ca fiind făcute de owner — normal,
  e un singur token.
- Dacă se compromite / vrei să-l schimbi: îl revoci din aceeași pagină GitHub și faci altul. Blast radius
  mic (doar fișierele din acest repo, orice commit e revertabil).

## Ce se întâmplă când adaugi
1. Validare locală (un cuvânt, fără dubluri) → 2. commit în `wordbank.json` (cu tokenul) →
3. CI rulează `gen_words.py` (re-validează: fără dubluri cross-nivel, format) → regenerează `words.js` →
4. Pages redeployează → toți văd cuvântul (~1-2 min). Tu îl vezi imediat (merge optimist în sesiune).

Dacă CI dă roșu (cuvânt care încalcă o regulă scăpată local), `words.js` NU se regenerează — banca
canonică rămâne curată (fail-loud). Owner-ul vede checkul roșu.

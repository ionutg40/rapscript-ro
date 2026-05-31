# Addendum — RapScript RO

Context care nu intră în brief dar e util în aval (PRD, arhitectură, roadmap).

## Inventar complet de funcționalități rapscript.net (referință)

Cules live 2026-05-31. Folosit ca "spec" de replicat. Rapscript.net există din 2008.

| Funcție | Descriere | Fază RapScript RO |
|---|---|---|
| Generator cuvinte random | Cuvinte pe ecran la interval ales | **v1** |
| Viteză reglabilă | ~2-12s, 10 trepte | **v1** |
| 3 niveluri dificultate | începător / avansat / profesionist | **v1** |
| Fullscreen | pentru proiector/monitor | **v1** |
| Play/pause | pornire/oprire automată | **v1** |
| Word bank / dicționar | bază de cuvinte navigabilă | v1 (date) / faza 3 (pagină navigabilă) |
| Beat player | beat-uri de fundal peste care rapezi | **faza 2** |
| Recording | filmare/înregistrare freestyle | **faza 2** |
| Categorii / moduri tematice | (dedus din app) | faza 3 |
| Mod sincron worldwide | cuvinte sincronizate, cyphere Discord/Twitch | faza 3+ (backend real-time) |
| Apps native iOS/Android | mobile | out / vision |
| Comunitate (comentarii, news) | secțiune socială | out / vision |

## Opțiuni sursă word bank RO (de evaluat în PRD/arhitectură)

- **Manual** - listă scrisă/curată de om. Calitate maximă, volum mic, lent.
- **Scraping rimeaza.ro / DEX online** - volum mare, dar nevoie de curățare + atenție la legal/ToS.
- **Generat cu AI + curat de om** - rapid la volum, dar risc de cuvinte ciudate/non-RO; necesită pas de validare umană.
- Probabil **hibrid**: AI generează draft pe nivel de dificultate → om filtrează.

## Definirea nivelurilor de dificultate pe RO (idei de explorat)

- Frecvența cuvântului în limbă (comun → rar).
- Concret vs. abstract (ușor de imaginat → conceptual).
- Lungime / număr de silabe.
- Cât de "rimabil" e (câte rime are în RO) - leagă de rimeaza.ro.

## Resurse adiacente

- [rimeaza.ro](https://www.rimeaza.ro/) - dicționar de rime românești, sortat pe părți de vorbire / silabe. Posibilă sursă de date sau de inspirație pentru niveluri.

## Note de premisă (audit pe scurt; detaliul în .decision-log.md)

- Originalul are română doar ca UI, nu word bank pe web → golul RO e real, dar mic.
- fasty nu face freestyle și nu are public → proiectul e așezat onest ca build/învățare, NU ca produs de comunitate.

---
title: RapScript RO
status: approved
created: 2026-05-31
updated: 2026-05-31
---

# Product Brief: RapScript RO

## Executive Summary

RapScript RO e o aplicație web care generează cuvinte random în limba română pentru antrenament de freestyle rap, după modelul [rapscript.net](https://rapscript.net). Scopul real al proiectului nu e produsul în sine, ci ca **fasty** (intern rekon, zero experiență de programare) să construiască o aplicație web completă, cap-coadă, și să învețe procesul livrării reale - nu un tutorial, ci ceva terminat și folosibil.

Vehiculul e bine ales din două motive. Întâi, rapscript.net oferă un model funcțional clar, ușor de înțeles și de replicat - un "spec" gata făcut. Al doilea, pe web chiar există un gol mic și real: deși rapscript.net pretinde 17 limbi, generatorul web are word bank adevărat doar pe 6 (EN, DE, IT, ES, FR, PT), iar româna e UI tradus, nu conținut.

v1 e deliberat mică și întreagă - "inima": generator de cuvinte RO la viteză reglabilă, 3 niveluri de dificultate, mod fullscreen, play/pause, peste un word bank românesc real. fasty e user #1 și, ca bonus, poate învață și să facă freestyle pe propria unealtă.

## The Problem

Două probleme reale, de mărimi diferite:

- **(principal) fasty trebuie să învețe să construiască web apps.** Are nevoie de un proiect bine delimitat, cu funcționalitate clară de replicat și folosibil de el. Tutorialele nu predau livrarea cap-coadă; un produs propriu, terminat și pus online, da.
- **(secundar, mic) nu există un generator de freestyle cu word bank românesc serios pe web.** rapscript.net pretinde 17 limbi, dar generatorul real acoperă 6; româna e doar interfață tradusă.

Ce **nu** e o problemă pe care pretindem c-o rezolvăm: "freestyleri români subserviți". fasty nu e în scena de freestyle și nu vorbește cu ea - deci brief-ul nu inventează o misiune de produs pentru un public cu care nimeni n-a stat de vorbă.

## The Solution

O aplicație web simplă (KISS): afișează cuvinte românești random pe ecran, la un interval ales de user, pe care el le țese în freestyle. Trei niveluri de dificultate schimbă tipul de cuvinte. Mod fullscreen pentru ecran mare / proiector. Play/pause. Fundația e un word bank românesc curat. Merge în browser, fără cont, fără cloud obligatoriu.

## What Makes This Different

Cinstit, fără avantaj fabricat:

- **E al lui fasty, construit de el.** Valoarea principală e învățarea, nu un moat de piață.
- **Word bank românesc real**, nu UI tradus - singurul lucru care-l face genuin "mai bun pe RO" decât originalul pe web. E și cea mai mare muncă de conținut a proiectului.
- **Simplitate focusată** - o unealtă curată, fără 18 ani de feature creep ca originalul.

Ce **nu** pretindem: tehnologie unică, comunitate, scală, vreun avantaj competitiv durabil.

## Who This Serves

- **Primary - fasty.** În două roluri: builder (învață web dev cap-coadă) și user #1 (poate învață freestyle pe RO). Succes = livrat + învățat.
- **Secondary - oportunist, negarantat.** Oricine ar vrea un generator de freestyle RO pe web. Dacă apare interes, e bonus; nu construim pentru el în v1.

## Success Criteria

- **SM-1: Livrare cap-coadă.** fasty pune online o aplicație web funcțională, accesibilă în browser, cu inima completă: generator + viteze reglabile + 3 dificultăți + fullscreen + word bank RO.
- **SM-2: Învățare documentată.** Un `gotchas.md` cu lecțiile din primul build web real (pattern preluat din proiectul Chat Extractor).
- **SM-3 (soft): Folosibilitate dovedită.** fasty o folosește el însuși de câteva ori ca să facă freestyle - semn că e cu adevărat utilizabilă, nu doar "merge tehnic".

**Counter-metrics (nu optimiza):** numărul brut de cuvinte în bank dacă sunt slabe; feature-uri adăugate care întârzie livrarea inimii.

## Scope

**IN (v1 - "inima"):**
- Generator de cuvinte RO random (single-word)
- Viteză reglabilă (intervalul dintre cuvinte)
- 3 niveluri de dificultate
- Word bank RO (sursa de stabilit - vezi Open Questions)
- Play / pause + mod fullscreen
- Web app responsive

**OUT (faze viitoare / vezi Vision):**
- Beat player de fundal
- Recording (înregistrare freestyle)
- Mod sincron worldwide (cyphere Discord/Twitch) - cere backend real-time
- Apps native iOS / Android
- Comunitate (comentarii, news)
- Cont / cloud / multi-user

## Vision

Dacă inima merge și fasty vrea să continue: **faza 2** adaugă beat player + recording (învață Web Audio / MediaRecorder, fără backend greu). **Faza 3**, categorii de cuvinte / moduri tematice. Pe termen lung, dacă prinde tracțiune cu oameni reali, sincronizare pentru cyphere online. Dar steaua nordică rămâne neschimbată: **primul web app pe care fasty îl duce cap-coadă.**

## Open Questions

1. **Sursa word bank-ului RO** - manual, scraping ([rimeaza.ro](https://www.rimeaza.ro/), DEX), sau listă generată cu AI apoi curată de om? E cea mai mare muncă de conținut și definește direct calitatea diferențiatorului.
2. **Definiția celor 3 niveluri pe RO** - după frecvența cuvântului? abstract vs. concret? lungime/silabe?
3. **Tech stack** - decizie de arhitectură (`bmad-create-architecture`), nu de brief.

# CLAUDE.md: FUP, Fino all'ultimo pallet

Gioco di strategia single player per browser desktop, in stile grand strategy Paradox (Crusader Kings, Europa Universalis, Victoria). Il giocatore è il CEO di un'azienda di logistica e autotrasporto nell'Italia del Nord-Ovest dal 2002 in poi. Le aziende e i clienti sono parodie, la geografia è reale.

## Con chi lavori
- Il proprietario del progetto (Davide) non è un programmatore. **Parla in italiano**, in modo semplice, senza gergo tecnico. Spiega cosa cambia *nel gioco*, non nel codice.
- Prima di modifiche grandi (nuove meccaniche, bilanciamento, cambi allo stile grafico) proponi in 2-3 righe cosa farai. Per le correzioni piccole procedi direttamente.
- Dopo ogni modifica: ricompila, lancia il test, guarda lo screenshot se hai toccato l'interfaccia, poi riassumi in poche righe cosa è cambiato per chi gioca.

## Comandi
```bash
python3 tools/build.py          # src/game.html + assets/ -> dist/fup.html (+ controllo sintassi JS con node)
python3 tests/smoke_test.py     # Chromium headless: menu, alberi, direzione, 3 anni di bot per ogni CEO
```
Requisiti: Python 3 con `pillow numpy scipy openpyxl playwright` (`playwright install chromium`) e Node per il controllo sintassi.
Il gioco si apre facendo doppio clic su `dist/fup.html`, non serve un server.
Gli screenshot dei test finiscono in `tools/out/`, che è ignorata da git.

## Struttura
```
src/game.html      UNICO file sorgente: CSS + HTML + JS vanilla, nessuna libreria
assets/            PNG in pixel art: mappa, ritratti CEO (192x224), manager/dirigenti/staff (96x112)
dist/fup.html      build autonoma con le immagini incorporate in base64 (da committare dopo ogni build)
tools/             build.py e generatori procedurali di asset e fogli (vedi sotto)
tests/             smoke_test.py
docs/              design.md (regole e formule), foglio KPI/bilanciamento, screenshot
```

### Dentro `src/game.html` (sezioni marcate con `/* ===== NOME ===== */`)
- **DATI**: `CITIES`, `SITES` (magazzini acquistabili), `CEOS` (4 personaggi iniziali), `MANAGERS`, `EXECS` (dirigenti), `DIR_ROLES`, `TENDER_POOL` (clienti parodia, con `req` per le tecnologie richieste), `RIVALS`, `TECH` (alberi), `TREES`, `WELFARE`, `RAL`, `HIRE`.
- **UTILITÀ**: `TPAL` (tavolozza pixel art), `TALENTS` (icona 8×8, effetto, testo di colore), `TECH_IC` (icone 12×12), `TFRAME` (cornici per albero), `techIcon()`, `talentIcons()`, formattatori (`eur`, `f1`, `esc`, date).
- **STATO**: `newGame()` crea l'oggetto globale `S`, l'unico stato di gioco (serializzabile in JSON).
- **MOTORE**: `computeWH()` calcola KPI, costi e ricavi di un magazzino; `step()` fa avanzare un giorno; `monthEnd()`; gare (`newTender`, `bidEstimate`, `resolveTender`); helper `R(id)` (tecnologia ricercata), `dirStat(ruolo)`, `fixedMul()`, `capOf()`.
- **EVENTI**: array `EVENTS` con `{id, src, title, text, cond, once?, setup?, opts:[{t, e, f, req?, reqT?}]}`. `fireEvent()` sceglie un evento tra quelli validi; ogni evento ha un'attesa di 240 giorni prima di poter tornare.
- **SALVATAGGIO**: `localStorage` con chiave `KEY`. **Se cambi la forma di `S`, aumenta la versione della chiave** (`fup-salvataggio-vN`) oppure aggiungi una migrazione in `ACT.continue`.
- **MAPPA**: proiezione `pt(lon,lat)`, pan/zoom, marker SVG, camion animati.
- **INTERFACCIA**: `DOCK` (menu a sinistra), `TITLES`, `VIEWS.<finestra>()` restituisce l'HTML della finestra; `renderAll()` ridisegna tutto, saltando le finestre con un campo attivo.
- **AZIONI**: tutti i click passano da `data-act="nome"` → `ACT.nome(dataset, element)`. Per aggiungere un pulsante: `data-act` + `data-*` nell'HTML e una funzione in `ACT`.
- **AVVIO**: schermata iniziale, scelta del CEO e del colore aziendale, game loop (`STEP` = ms per giorno per ogni velocità).
- `window.__FUP` espone stato e funzioni per i test.

## Regole di design (non cambiarle senza chiedere)
- **Niente punti azione o agenda**: come in Crusader Kings, il tempo scorre e i KPI salgono e scendono in base alle statistiche dell'impero.
- **KPI separati**: Puntualità e Accuratezza (non OTIF), con soglie diverse per ogni cliente (`sP`, `sA`, `null` = non richiesta).
- **Personaggi**: 6 abilità base (Operazioni, Precisione, Negoziazione, Leadership, Amministrazione, Innovazione) più talenti, cioè icone con tooltip, effetto e un testo di colore ironico.
- **Personale**: magazzinieri, autisti e "impiegati operativi" (ufficio).
- **Tecnologie**: tre alberi in stile Civ (Logistica / Sviluppo aziendale / Mercato), **una ricerca alla volta**, con tempo di ricerca ridotto dall'Innovazione. Le tecnologie di Logistica, dopo la ricerca, vanno **installate in ogni magazzino** e hanno un periodo di apprendimento; le altre valgono per tutta l'azienda.
- **Dirigenti**: 5 posti (operativo, commerciale, HR, finanza, tecnologia), sbloccati solo dalla ricerca "Struttura direzionale".
- **Eventi**: tanti e vari (meteo, politica, locali, clienti, personale), divertenti ma credibili, **rari**: uno ogni 30-55 giorni.
- **Mappa**: solo il Nord-Ovest è giocabile, il resto d'Italia è desaturato.
- Solo browser desktop, niente versione per telefono.

## Stile
- Testi del gioco in italiano, tono ironico ma da settore (gergo logistico reale: pallet, picking, WMS, soglie KPI, tender).
- Nomi di aziende e clienti: parodie riconoscibili ma mai i marchi veri (es. "Esselonga", "Galbanone", "Amazzonia Italia").
- Grafica: pixel art moderna e colorata, bordi scuri `#16202e`, ombre nette, font *Pixelify Sans* (titoli) e *IBM Plex Sans Condensed* (testo). Colori dalla tavolozza `TPAL`. Le icone sono SVG con `shape-rendering="crispEdges"`.
- Cornici delle tecnologie: Logistica = quadrato arancione, Sviluppo aziendale = ottagono viola, Mercato = tondo verde.
- Interfaccia: mappa a tutto schermo con finestre mobili sopra (stile Paradox); font base grande e leggibile.

## Asset
- I ritratti sono generati in Python (`tools/portraits*.py`, funzione `person(...)` con pelle, capelli, acconciatura, vestiti, occhiali, barba…). Per un nuovo personaggio aggiungi una chiamata in `portraits3.py` / `portraits4.py`, rigenera, poi usa `{{Q_nome}}` nell'oggetto `IMG` di `src/game.html`.
- Mappa: `tools/map_nw.py` (coste e confini disegnati a mano, rumore per il rilievo). Proiezione: `LON0=4.81, LAT1=47.0`, 640×400 mostrata a 2x.
- Il foglio `docs/KPI_Puntualita_Accuratezza.xlsx` è generato da `tools/kpi_xlsx.py`, `personaggi.py`, `eventi.py`, `simsheet.py`, `add_sheets.py`. Non è sincronizzato in automatico con il gioco: le formule autorevoli sono in `src/game.html` e in `docs/design.md`.

## Checklist prima di un commit
1. `python3 tools/build.py` senza errori.
2. `python3 tests/smoke_test.py` termina con `OK`.
3. Se hai toccato l'interfaccia, guarda gli screenshot in `tools/out/`.
4. Se hai cambiato regole o formule, aggiorna `docs/design.md`.
5. Committa anche `dist/fup.html`.

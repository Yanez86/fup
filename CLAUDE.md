# CLAUDE.md: FUP, Fino all'ultimo pallet

Gioco di strategia single player per browser (computer e telefono, installabile come web app), in stile grand strategy Paradox (Crusader Kings, Europa Universalis, Victoria). Il giocatore è il CEO di un'azienda di logistica e autotrasporto nel Nord Italia (da Nizza a Trieste, fino all'Emilia-Romagna) dal 2002 in poi. Le aziende e i clienti sono parodie, la geografia è reale.

## Con chi lavori
- Il proprietario del progetto (Davide) non è un programmatore. **Parla in italiano**, in modo semplice, senza gergo tecnico. Spiega cosa cambia *nel gioco*, non nel codice.
- Prima di modifiche grandi (nuove meccaniche, bilanciamento, cambi allo stile grafico) proponi in 2-3 righe cosa farai. Per le correzioni piccole procedi direttamente.
- Dopo ogni modifica: ricompila, lancia il test, guarda lo screenshot se hai toccato l'interfaccia, poi riassumi in poche righe cosa è cambiato per chi gioca.

## Comandi
```bash
python3 tools/build.py          # src/game.html + assets/ -> dist/fup.html (+ controllo sintassi JS con node)
python3 tests/smoke_test.py     # Chromium headless: telefono (verticale/orizzontale), menu, alberi, direzione, 3 anni di bot per ogni CEO
```
Requisiti: Python 3 con `pillow numpy scipy openpyxl playwright` (`playwright install chromium`) e Node per il controllo sintassi.
Il gioco si apre facendo doppio clic su `dist/fup.html`, non serve un server.
Gli screenshot dei test finiscono in `tools/out/`, che è ignorata da git.

## Struttura
```
src/game.html      UNICO file sorgente del gioco: CSS + HTML + JS vanilla, nessuna libreria
src/manifest.webmanifest, src/sw.js   web app (installazione e gioco senza rete), copiati in dist/ da build.py
assets/            PNG in pixel art: mappa, ritratti CEO (192x224), manager/dirigenti/staff (96x112)
dist/              fup.html (build autonoma con le immagini in base64) + manifest, sw.js e icone della web app (tutto da committare dopo ogni build)
tools/             build.py e generatori procedurali di asset e fogli (vedi sotto)
tests/             smoke_test.py
docs/              design.md (regole e formule), foglio KPI/bilanciamento, screenshot
```

### Dentro `src/game.html` (sezioni marcate con `/* ===== NOME ===== */`)
- **DATI**: `CITIES`, `SITES` (magazzini acquistabili), `CEOS` (4 personaggi iniziali), `MANAGERS`, `EXECS` (dirigenti), `DIR_ROLES`, `TENDER_POOL` (clienti parodia, con `req` per le tecnologie richieste), `RIVALS`, `TECH` (alberi), `TREES`, `WELFARE`, `RAL`, `HIRE`.
- **UTILITÀ**: `TPAL` (tavolozza pixel art), `LOGO` (loghi dei clienti 12×12 su un riquadro 16×16, `logoSvg()`), `REG` / `CITYPOP` / `ZONES` (province, gruppi di province, regioni e macroaree; `zoneW()`, `zoneOverlap()`) / `ORIGINS` / `CINFO` (zone possibili, provenienza della merce e ritiro/consegna per cliente; `clientLog()` calcola viaggi e km), `STATS` / `STAT_IC` (icone 8×8 delle abilità, `statChips()`, `statBadge()`), `TALENTS` (icona 8×8, effetto, testo di colore), `TECH_IC` (icone 12×12), `TFRAME` (cornici per albero), `techIcon()`, `talentIcons()`, formattatori (`eur`, `f1`, `esc`, date). Enciclopedia: `WIKI_CAT`, `WIKI` (voci `{n, s, t}` dove `s` è il testo breve del tooltip e `t` il testo lungo con collegamenti `[[id]]` o `[[id|testo]]`), `kw(id, testo)` crea una parola chiave con tooltip che al clic apre la voce.
- **STATO**: `newGame()` crea l'oggetto globale `S`, l'unico stato di gioco (serializzabile in JSON).
- **MOTORE**: `computeWH()` calcola KPI, costi e ricavi di un magazzino (i km arrivano da `clientLog`); `step()` fa avanzare un giorno; `weekEnd()` (report del lunedì in `S.weeks`); `monthEnd()`; gare (`freeZones`, `zoneScale`, `newTender`, `bidEstimate`, `resolveTender`; `cname()` mostra la zona quando una committente ha più contratti); helper `R(id)` (tecnologia ricercata), `dirStat(ruolo)`, `fixedMul()`, `capOf()`.
- **EVENTI**: array `EVENTS` con `{id, src, title, text, cond, once?, setup?, opts:[{t, d, e, f, req?, reqT?}]}`. `fireEvent()` sceglie un evento tra quelli validi; ogni evento ha un'attesa di 240 giorni prima di poter tornare.
- **SALVATAGGIO**: `localStorage` con chiave `KEY`. **Se cambi la forma di `S`, aumenta la versione della chiave** (`fup-salvataggio-vN`) oppure aggiungi una migrazione in `ACT.continue`.
- **MAPPA**: proiezione `pt(lon,lat)`, pan/zoom, marker SVG, camion animati. Lenti della mappa in `LENSES` (`UI.lens`, tasto L): ogni lente ha `draw()` che restituisce uno strato SVG disegnato sotto città e magazzini; `PROV` contiene i confini delle province.
- **INTERFACCIA**: `DOCK` (menu a sinistra), `TITLES`, `VIEWS.<finestra>()` restituisce l'HTML della finestra; `renderAll()` ridisegna tutto, saltando le finestre con un campo attivo.
- **AZIONI**: tutti i click passano da `data-act="nome"` → `ACT.nome(dataset, element)`. Per aggiungere un pulsante: `data-act` + `data-*` nell'HTML e una funzione in `ACT`.
- **Telefono**: `setMobile()` mette la classe `.mob` (e `.land` in orizzontale) su `<html>`; le regole CSS `.mob …` fanno il layout da telefono, `layoutVars()` misura barra e menu (`--top-h`, `--win-l`, `--win-b`). `TOUCH` sceglie i testi «tocca»/«clic». Tooltip al tocco nella sezione EVENTI DOM, pinch in `initMapControls()`.
- **AVVIO**: schermata introduttiva (`showIntro()`, camioncino in pixel art `introTruck()` col pallet dell'icona; un clic o un tocco la chiude con `ACT.introgo`), elenco delle novità `CHANGELOG` (versione più recente in cima, `VER`, `newsCard()`), schermata iniziale, pulsante «Installa come app» (`installCard()`), registrazione di `sw.js`, scelta del CEO e del colore aziendale, game loop (`STEP` = ms per giorno per ogni velocità).
- `window.__FUP` espone stato e funzioni per i test.

## Regole di design (non cambiarle senza chiedere)
- **Niente punti azione o agenda**: come in Crusader Kings, il tempo scorre e i KPI salgono e scendono in base alle statistiche dell'impero.
- **KPI separati**: Puntualità e Accuratezza (non OTIF), con soglie diverse per ogni cliente (`sP`, `sA`, `null` = non richiesta).
- **Personaggi**: 6 abilità base (Operazioni, Precisione, Negoziazione, Leadership, Amministrazione, Innovazione) più talenti, cioè icone con tooltip, effetto e un testo di colore ironico.
- **Personale**: per ogni magazzino magazzinieri, carrellisti, capiturno, impiegati di magazzino, autisti con patente B (furgoni) e con patente CE (bilici); in sede i pianificatori del traffico. Magazzinieri e carrellisti possono venire da una cooperativa.
- **Tecnologie**: quattro alberi in stile Civ (Logistica / Sviluppo aziendale / Mercato / Welfare), **una ricerca alla volta**, con tempo di ricerca ridotto dall'Innovazione. Le tecnologie di Logistica e i servizi di Welfare, dopo la ricerca, vanno **installati in ogni magazzino** (solo la Logistica ha un periodo di apprendimento); le altre valgono per tutta l'azienda. Ogni tecnologia ha `desc` (effetto) e `txt` (cos'è, in frasi semplici).
- **Dirigenti**: 5 posti (operativo, commerciale, HR, finanza, tecnologia), sbloccati solo dalla ricerca "Struttura direzionale".
- **Eventi**: tanti e vari (meteo, politica, locali, clienti, personale), divertenti ma credibili, **rari**: uno ogni 30-55 giorni.
- **Mappa**: sono giocabili le 8 regioni del Nord (Emilia-Romagna compresa), il resto d'Italia è desaturato.
- **Gare per zona**: la stessa committente può avere più gare e più contratti, uno per zona, purché le zone non abbiano province in comune.
- Computer e telefono: ogni nuova finestra o pulsante va provato anche nel layout `.mob` (il test fa gli screenshot `shot_tel_*`). Pulsanti grandi abbastanza per il dito, niente comandi solo al passaggio del mouse o solo da tastiera.

## Stile
- Testi del gioco in italiano, tono ironico ma da settore (gergo logistico reale: pallet, picking, WMS, soglie KPI, tender).
- Nomi di aziende e clienti: parodie ironiche e parlanti, **mai rimandi diretti a marchi esistenti** (niente nomi storpiati di una lettera, slogan pubblicitari veri o loghi copiati). Es. "Supermercati Carrellone", "Caseificio Stracchinelli", "Tuttosubito Italia". I vecchi nomi rinominati stanno in `RENAMED`, che converte i salvataggi.
- Grafica: pixel art moderna e colorata, bordi scuri `#16202e`, ombre nette, font *Pixelify Sans* (titoli) e *IBM Plex Sans Condensed* (testo). Colori dalla tavolozza `TPAL`. Le icone sono SVG con `shape-rendering="crispEdges"`.
- Ogni abilità ha un colore fisso: Operazioni arancione, Precisione blu, Negoziazione giallo, Leadership rosso, Amministrazione verde, Innovazione viola. Mostra sempre le abilità con `statChips()` / `statBadge()`, mai come semplice testo.
- Ogni nuovo cliente deve avere un logo in `LOGO` e una voce in `CINFO`.
- Ogni nuova meccanica o statistica deve avere una voce in `WIKI` e, dove compare nell'interfaccia, una parola chiave `kw()`. Se cambi una formula, aggiorna anche il testo della voce.
- I grafici sono SVG fatti a mano (`lineChart()`, con crosshair e tooltip in `chartHover`): niente librerie; linee da 2px, le soglie tratteggiate, la legenda sempre presente e le etichette dirette al massimo per 4 serie; una sola scala per grafico.
- Il report KPI imita Excel (barra verde, schede dei fogli, barra della formula), ma resta nella nostra tavolozza.
- Cornici delle tecnologie: Logistica = quadrato arancione, Sviluppo aziendale = ottagono viola, Mercato = tondo verde, Welfare = quadrato smussato rosso.
- Interfaccia: mappa a tutto schermo con finestre mobili sopra (stile Paradox); sul telefono le finestre sono a tutto schermo. Font base grande e leggibile.

## Asset
- I ritratti sono generati in Python (`tools/portraits*.py`, funzione `person(...)` con pelle, capelli, acconciatura, vestiti, occhiali, barba…). Per un nuovo personaggio aggiungi una chiamata in `portraits3.py` / `portraits4.py`, rigenera, poi usa `{{Q_nome}}` nell'oggetto `IMG` di `src/game.html`.
- Icone della web app: `tools/icone.py` (pixel art 32×32 ingrandita) scrive `assets/icona_*.png`.
- Mappa: `tools/map_nw.py` (coste disegnate a mano, rumore per il rilievo; l'area giocabile viene da `assets/province.json`, quindi rigenera prima le province). Proiezione: `LON0=4.81, LAT1=47.0`, 760×400 mostrata a 2x (`MW`×`MH` = 1520×800 in `game.html`).
- Province: `tools/province.py [file.geojson]` legge i confini ISTAT (openpolis/geojson-italy, `limits_IT_provinces.geojson`) delle 8 regioni del Nord, li semplifica e scrive `assets/province.json`, che `build.py` incorpora al posto di `{{PROV}}`. Se il download diretto è bloccato, clona il repo openpolis/geojson-italy e passa il file.
- Il foglio `docs/KPI_Puntualita_Accuratezza.xlsx` è generato da `tools/kpi_xlsx.py`, `personaggi.py`, `eventi.py`, `simsheet.py`, `add_sheets.py`. Non è sincronizzato in automatico con il gioco: le formule autorevoli sono in `src/game.html` e in `docs/design.md`.

## Checklist prima di un commit
1. `python3 tools/build.py` senza errori.
2. `python3 tests/smoke_test.py` termina con `OK`.
3. Se hai toccato l'interfaccia, guarda gli screenshot in `tools/out/`.
4. Se hai cambiato regole o formule, aggiorna `docs/design.md`.
5. Per le novità visibili a chi gioca aggiungi una riga in `CHANGELOG` (nuova versione in cima se è un blocco di lavoro nuovo), in italiano semplice.
6. **Pubblica sempre tutto su `main`** (regola base di Davide): a fine lavoro unisci le modifiche in `main` e fai push, anche se la sessione lavora su un altro ramo.
7. Committa anche `dist/fup.html`: a ogni push su `main` la GitHub Action `.github/workflows/pages.yml` lo pubblica su https://yanez86.github.io/fup/.

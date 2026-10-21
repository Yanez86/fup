# Pacchetto «Relazioni industriali» (progetto)

Espansione da rilasciare in un'unica soluzione. **Stato: costruito nella versione 0.66** (le formule esatte sono in `docs/design.md`, sezione «Pacchetto Relazioni industriali»).

Differenze rispetto al progetto, decise durante la costruzione:
- «Porte aperte»: invece di «abilità del CEO −1» costa −2 nel punteggio delle gare (il CEO passa le mattine in mensa invece che dai buyer).
- «Province confinanti» nel contagio: magazzini entro 70 km.
- Contratto «a pallet»: +12% sul prezzo, e il fornitore adegua da solo le persone ogni lunedì.
- La prossima rata del contratto si vede nella finestra Relazioni industriali e nel menu del telefono, non nella barra in alto (sul telefono non c'è spazio).
- Il pacchetto vale solo per le partite nuove: i salvataggi di prima restano senza pacchetto, quindi non serve convertire la cooperativa.
Si sceglie nel passo «Pacchetti», l'ultimo della creazione della partita (di base è acceso): chi lo spegne gioca come prima, i vecchi salvataggi restano validi.
I numeri sono una prima proposta, da ritoccare in fase di bilanciamento; sono stati tarati su quelli già in uso (morale, stipendi, cooperativa attuale, vedi `design.md`).

## Decisioni prese con Davide
- Agitazione **per magazzino**, con **contagio** ai magazzini vicini.
- La repressione è **una scommessa**: conveniente subito, salata dopo. Mai una strategia che vince sempre.
- Strade di ricerca «dialogo» e «contenimento» **non esclusive**; la talpa si sblocca solo dal contenimento; se scoperta con anche il dialogo, lo scandalo vale **×2**.
- Contratto nazionale: **rinnovo ogni 3 anni, una rata ogni 6 mesi**.
- I fornitori di handling **sostituiscono la cooperativa** attuale.
- In un magazzino magazzinieri e carrellisti sono **o tutti interni o tutti del fornitore** (niente misto).
- Autisti in appalto (padroncini, subvettori): **secondo pacchetto**.
- **8 fornitori locali + 3 globali**, nomi approvati (sotto).

## 1. Agitazione sindacale (una per magazzino)
Valore 0-100, barra + bandierina sul magazzino. Ogni giorno si avvicina al **livello di tensione** di circa il 2% della differenza (il morale usa l'1,2%).

Cosa alza la tensione:

| Causa | Effetto |
|---|---|
| Morale sotto 60 | +1 per punto sotto |
| Rata del contratto nazionale non pagata (stipendi sotto CCNL) | +15 |
| Fornitore di handling | da +5 a +20 secondo il suo rischio sindacale |
| Licenziamento nel magazzino | +4 per 30 giorni (ondata ×2) |
| Accordo integrativo non rispettato | +30 per 90 giorni |
| Policy Linea dura | rancore (vedi §7) |
| Magazzino in cattivo stato / reparti in affanno | +5 / +10 |

Cosa la abbassa: welfare installato, Leadership del manager (−1 per punto sopra 10), accordo firmato (−20 finché dura), Comitato paritetico, talento Mediatore nato / Amico del delegato.

### Contagio
Se un magazzino è più agitato di un vicino, gli trasmette ogni giorno una parte della differenza:
- 100% della spinta nella stessa provincia, 50% nelle province confinanti, 25% nella stessa regione;
- i magazzini con **lo stesso fornitore** si contagiano a qualunque distanza.

### Fasce

| Fascia | Agitazione | Effetti |
|---|---|---|
| Calma | 0-24 | nessuno |
| Mugugno | 25-44 | produttività −3% |
| Stato di agitazione | 45-64 | blocco straordinari (penalità reparti in affanno ×1,5), puntualità −1 |
| Sciopero | 65-84 | 1-3 giorni di blocco al mese, in quei giorni il magazzino lavora al 30% |
| Presidio | 85-100 | magazzino fermo all'80% fino alla firma; reputazione −0,5 a settimana; notizia sul giornale |

Nuova lente della mappa **«Clima sindacale»**: province colorate secondo l'agitazione dei magazzini.

## 2. Sindacati (parodie)

| Sigla | Dove è forte | Carattere |
|---|---|---|
| **CUP**, Confederazione Unitaria del Pallet | personale interno | moderata, chiede soldi, firma volentieri |
| **SAM**, Sindacato Autonomo Mulettisti | molti carrellisti | corporativo, indennità per i carrellisti |
| **CoBaBa**, Comitati di Base della Banchina | fornitori locali | radicale, salta lo stato di agitazione e va al presidio |

Ogni sigla ha un leader con ritratto. Ogni magazzino ha un **delegato RSU** (volto generico, Leadership e Negoziazione, a volte un talento: *Delegato storico*, *Megafono*, *Trattabile*).

## 3. Tavolo delle trattative
- Si apre con agitazione sopra 45 o su richiesta del giocatore.
- Il sindacato presenta **3-5 richieste** con un costo: aumento 2-5%, buoni pasto, indennità carrellisti, turni (niente sabato), sicurezza (manutenzione straordinaria), stabilizzazione (ritorno al personale interno), premio di risultato.
- Per ogni richiesta: *concedo / tratto / rifiuto*. **Una seduta a settimana** (nessun punto azione: il tempo scorre). Esito: Negoziazione di chi tratta (dirigente HR, altrimenti CEO) contro Leadership del delegato.
- A ogni seduta si può offrire **una contropartita** (scambio).
- **Pazienza** del sindacato: cala a ogni seduta; a zero parte lo sciopero.
- Esito: **accordo integrativo** di 18 mesi (24 con Contrattazione di secondo livello).

## 4. Contratto nazionale
- Rinnovo ogni 3 anni (2003, 2006, 2009…), **6 rate semestrali** di aumento su tutti gli stipendi; sulla barra in alto «prossima rata: luglio, +1,5%».
- Aumenti legati all'inflazione storica (più alti 2008-2009 e 2022-2023). Totale tipico 4-9% per rinnovo.
- Il rinnovo è un **evento a puntate**: trattative a Roma → eventuale sciopero nazionale (+20 di agitazione ovunque per 2 settimane) → firma con **arretrati una tantum**.
- Associazione datoriale **«Confpallet»**: quota mensile secondo i dipendenti; rate −0,2% l'una, agitazione −5 ovunque, preavviso dello sciopero nazionale.
- Vale uguale per gli avversari.
- Fornitori: alla rata chiedono la revisione del prezzo; i locali possono «dimenticarsi» di girare l'aumento ai lavoratori (costano meno, agitazione su, rischio responsabilità solidale).

## 5. Fornitori di handling (al posto della cooperativa)
- Per magazzino: magazzinieri e carrellisti tutti interni o tutti del fornitore. Capiturno, impiegati e facility manager restano interni.
- Contratto **a ora** o **a pallet movimentato** (il secondo protegge nei mesi morti, costa di più nei picchi).
- Valori di ogni fornitore: costo, flessibilità, qualità (Accuratezza da −2 a +1), rotazione, rischio sindacale, rischio legale. L'**affidabilità vera** è nascosta fino a Vendor management.
- Costo rispetto all'interno: locali 0,72-0,85, globali 0,85-0,95.
- **Cambio fornitore**: preavviso 30 giorni, penale per i globali, **clausola sociale** (70% delle persone passa al nuovo e porta con sé metà dell'agitazione).
- **Internalizzazione**: 600 € a persona, agitazione −25, morale +5 per 60 giorni.
- **Responsabilità solidale**: se il fornitore fallisce o non paga, il committente paga 1-3 mesi del suo personale.
- I locali possono fallire, fondersi, cambiare nome; un globale può comprare un locale (prezzi e regole da multinazionale per chi lo usava).
- Globali con requisiti (WMS, taglia minima del magazzino); alcuni clienti li premiano in gara.
- Migrazione: la cooperativa dei vecchi salvataggi diventa il fornitore locale della provincia del magazzino.
- La policy «Niente cooperative» diventa **«Niente appalti locali»** (i globali restano permessi).
- Gli eventi esistenti `coop_sciopero`, `coop_ispettorato`, `coop_sparita` passano ai fornitori locali.

### Fornitori locali

| Nome | Province | Carattere |
|---|---|---|
| Coop. Spalle Larghe | Milano, Lodi, Pavia | economica, velocissima nei picchi, rischio legale altissimo |
| Consorzio Facchini Riuniti del Basso Lodigiano | Lodi, Cremona, Piacenza | cambia nome ogni due anni, nessuno sa chi sia il presidente |
| La Laboriosa Soc. Coop. | Bologna, Modena, Reggio Emilia | storica e seria, cara per essere locale, sindacato forte ma dialogante |
| Movimentazioni Fratelli Sgobbo | Verona, Vicenza, Mantova | familiare, buona qualità, poco flessibile |
| Coop. Il Muletto Allegro | Torino, Asti, Cuneo | rotazione alta, Accuratezza ballerina |
| Servizi Portuali Lanterna | Genova, Savona, La Spezia | bravissimi, ma se si fermano si ferma la Liguria |
| Coop. Serenissima Logistica | Venezia, Padova, Treviso | nella media su tutto |
| Friulana Handling | Udine, Pordenone, Trieste | precisi e affidabili, pochi magazzini da servire |

### Fornitori globali

| Nome | Carattere |
|---|---|
| Handlerix Global Services | colosso, qualità costante, solo con WMS, penali di uscita salate |
| OmniMove Group | il più flessibile dei globali, migliore nei picchi, rotazione alta |
| Pallet & People Worldwide | il più caro, certificato: premiato da alcuni clienti nelle gare |

## 6. Ricerche: ramo «Relazioni industriali» (Sviluppo aziendale)

| Strada | Ricerca | Effetto |
|---|---|---|
| — | Relazioni sindacali (ingresso) | mostra richieste e pazienza al tavolo |
| Dialogo | Comitato paritetico | agitazione −5 ovunque, incontro mensile |
| Dialogo | Contrattazione di secondo livello | accordi di 24 mesi, premio di risultato sui KPI (puntualità +0,5) |
| Contenimento | Contenimento sindacale | scioperi −1 giorno, adesione −30% |
| Contenimento | Talpa nel sindacato | avviso degli scioperi 2 settimane prima; al tavolo si vede il limite vero del sindacato |
| — | Vendor management | rischio legale dei fornitori −40%, mostra la loro affidabilità vera |

### Rischio della talpa
Ogni mese 2% di essere scoperti, +0,5% per ogni informazione usata al tavolo, −0,2% per punto di Amministrazione del dirigente HR sopra 10.
Se scoperta: multa per condotta antisindacale, reputazione −8, agitazione 90 in tutti i magazzini, i clienti «etici» rescindono, ricerca bloccata per 5 anni. Con le ricerche del dialogo tutto ×2.

## 7. Policy

| Policy | Sblocco | Pro | Contro |
|---|---|---|---|
| Linea dura | Contenimento sindacale | scioperi falliti al 50% | ogni sciopero respinto aggiunge **rancore nascosto**; sopra 50 il prossimo sciopero è subito presidio; morale −3 |
| Porte aperte | Relazioni sindacali | agitazione −8 | effetto delle abilità del CEO −1 |
| Premio di presenza | Relazioni sindacali | adesione agli scioperi −40% | 2% degli stipendi; agitazione +3; con la talpa scoperta conta come mezza Linea dura |
| Crumiri in appalto | Contenimento sindacale | in sciopero il magazzino lavora al 70% invece del 30% | agitazione +15 a ogni uso, rischio Ispettorato |

## 8. Talenti
- **Ex sindacalista** (esiste già): al tavolo Negoziazione +3.
- **Pugno di ferro**: Linea dura più efficace, agitazione +5 nel suo magazzino.
- **Mediatore nato**: le sedute contano doppio.
- **Amico del delegato**: agitazione −10 nel suo magazzino.

## 9. Gare, clienti, avversari, vittoria
- Nuovo requisito cliente **«pace sociale»** (niente presidi né condanne negli ultimi 12 mesi) per grande distribuzione «etica» ed enti pubblici; alcuni premiano il fornitore globale certificato.
- Avversari con la loro agitazione: stile Prezzo e difficoltà Spietato usano Linea dura e fornitori locali; stile Qualità sceglie il dialogo.
- Evento opportunità: un rivale in presidio, i suoi clienti ti cercano.
- Nuova vittoria **«L'azienda dove tutti vogliono lavorare»**: 5 anni senza scioperi, morale medio sopra 75, almeno 300 dipendenti.

## 10. Eventi (circa 12, dentro la regola di uno ogni 30-55 giorni)
Sciopero a sorpresa prima del Black Friday · Sciopero a singhiozzo · Il delegato si candida in comune · La talpa vuole un aumento · Il caffè della macchinetta diventa una questione politica · Il fornitore offre 50 persone in 48 ore · La cooperativa cambia nome per la terza volta · Il globale manda il consulente dei processi · Il presidente del consorzio è cugino del sindaco · Inchiesta su fatture e caporalato · Il sindacato ti ringrazia pubblicamente · Un rivale in presidio: i suoi clienti ti cercano.

## 11. Da preparare oltre alle regole
- Voci `WIKI` (con `kw()`): agitazione, contagio, fasce, sindacati, delegato, tavolo, pazienza, accordo integrativo, contratto nazionale, rate, arretrati, Confpallet, fornitori, clausola sociale, responsabilità solidale, internalizzazione, rancore, talpa, pace sociale.
- Icone in `tools/icone_gioco/`: 6 ricerche, 4 policy, 3 talenti; loghi degli 11 fornitori e delle 3 sigle.
- Ritratti dei 3 leader sindacali (`portraits4.py`).
- Finestre: tavolo delle trattative, scheda del fornitore, lente «Clima sindacale»; provate anche nel layout telefono.
- Cronaca di fine partita: «10 anni senza sciopero», «La talpa più longeva del Nord».
- Nuova forma di `S`: alzare la versione del salvataggio o aggiungere la migrazione (cooperativa → fornitore).
- Aggiornare `design.md` e `CHANGELOG` al momento della costruzione.

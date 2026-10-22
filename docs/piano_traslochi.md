# Traslochi (progetto)

**Stato: proposta, da discutere con Davide. Niente è ancora costruito.**
I numeri sono una prima proposta, da ritoccare con `tools/bilanciamento.py`.

## L'idea in breve
Il giocatore può spostare il lavoro da un magazzino a un altro: tutto il magazzino (si trasloca e il vecchio capannone si chiude) oppure solo alcuni clienti (per fare spazio, per avvicinarli alla loro zona, per portarli dove c'è la certificazione giusta).
Un trasloco è un **progetto in tre fasi** (preparazione, giorni del trasloco, stabilizzazione) che costa molto, mette sotto pressione le persone e fa ballare i KPI. Fatto bene, ripaga in pochi anni: capannone migliore, meno km, meno affitto. Fatto male (in pieno picco, senza preavviso, con metà della squadra che non segue), fa perdere clienti.

Come nei giochi Paradox, non ci sono punti azione: si decide il piano, poi il tempo scorre e le statistiche fanno il resto.

## Perché traslocare (cosa ci guadagna chi gioca)
Nessuna regola nuova: il vantaggio viene dalle regole che esistono già.
- **Capannone migliore**: da fatiscente o vecchio a moderno o innovativo (produttività, KPI, morale, bollette, gare con le committenti S e A).
- **Più vicino ai clienti**: i km dei giri si calcolano dal magazzino alla zona del cliente, quindi meno gasolio, meno autisti, puntualità migliore.
- **Più spazio**: sopra l'85% di occupazione l'accuratezza scende; spostare un cliente in un magazzino più vuoto la fa respirare.
- **Certificazioni**: un cliente del fresco va dove ci sono celle frigo e catena del freddo.
- **Meno costi fissi**: due magazzini mezzi vuoti diventano uno pieno; oppure si lascia l'affitto per un capannone costruito da zero, di proprietà.
- **Clima** (col pacchetto Relazioni industriali): si può lasciare un magazzino in agitazione, ma il sindacato non la prende bene (vedi sotto).

## 1. Due tipi di trasloco, un solo progetto
| | Trasloco del magazzino | Trasferimento di clienti |
|---|---|---|
| Cosa si sposta | tutti i clienti, il personale, il manager, le motrici | uno o più clienti, più una parte della squadra |
| Destinazione | un capannone da affittare, un tuo cantiere che sta finendo, un tuo magazzino | un tuo magazzino |
| Alla fine | il vecchio capannone si chiude | i due magazzini restano aperti |

Nel gioco è la stessa finestra: si sceglie da dove, verso dove e quali clienti. Se si spostano tutti i clienti compare la casella «Chiudi il vecchio magazzino» (accesa di base).

Effetto collaterale utile: oggi il giocatore non può chiudere un magazzino (lo fanno solo le avversarie). Con i traslochi arriva anche **«Chiudi il magazzino»** per un magazzino rimasto vuoto, con le stesse regole di disdetta del punto 4.

## 2. Le tre fasi
### Fase 1. Preparazione (da 30 giorni in su)
Dal giorno in cui confermi il progetto al primo giorno del trasloco.
- Le committenti coinvolte ricevono il **preavviso**: 60 giorni, 90 per le S e le A (gli stessi del recesso). Si può partire prima, ma ogni settimana mancante costa −1 di soddisfazione a quel cliente.
- A destinazione si prepara tutto: personale da assumere, certificazioni da ottenere, tecnologie da rimontare (punto 5).
- Se il nuovo capannone è lontano più di 40 km, in magazzino girano le voci: morale −3 fino al trasloco.
- Il progetto si può **annullare** finché non iniziano i giorni del trasloco: perdi i soldi del progetto e ogni cliente avvisato perde 2 di soddisfazione («ci avevate detto…»).

### Fase 2. I giorni del trasloco
Si sceglie come farlo:

| | **Lampo** (un fine settimana lungo) | **A ondate** (un cliente alla volta) |
|---|---|---|
| Durata | 2-6 giorni (800 pallet al giorno) | 1-2 settimane per cliente (250 pallet al giorno), una dopo l'altra |
| KPI dei clienti che traslocano | Puntualità −14, Accuratezza −4 nei giorni del trasloco | Puntualità −5, Accuratezza −1,5 nei giorni della sua ondata |
| Clienti rimasti nel vecchio magazzino | — | Puntualità −1 (la squadra carica le navette) |
| Straordinari | personale di magazzino +50% nei giorni del trasloco e nelle 2 settimane dopo | +20% per tutta la durata |
| Morale | −8 subito, ritorna in 30 giorni | −4 subito, ritorna in 30 giorni |
| Doppio affitto | circa un mese | tutta la durata più un mese |
| Rischio all'inventario (punto 6) | alto | basso |
| Stabilizzazione | più lunga e più dura | più corta, cliente per cliente |

Il lampo costa meno in affitti ma tanto in straordinari e nervi; le ondate costano di più ma fanno meno danni ai clienti.

**Straordinari, policy e sindacato.** Con la policy «Zero straordinario» accesa (o, col pacchetto Relazioni industriali, con il magazzino in stato di agitazione, dove già oggi gli straordinari non si fanno) il trasloco va fatto con un'**agenzia esterna**: niente calo di morale dagli straordinari, ma costa il 30% in più, dura una volta e mezza e l'accuratezza scende di un altro punto (gente che non conosce la merce).

Anche i carichi di lavoro esistenti fanno la loro parte: nei giorni del trasloco i reparti di magazzinieri e carrellisti hanno un 40% di lavoro in più (lampo) o 15% (ondate). Se la squadra è già al limite va in affanno, e le formule di oggi tolgono KPI e morale da sole.

### Fase 3. Stabilizzazione
Nel capannone nuovo nessuno sa dove sono le cose: per qualche settimana i KPI e la produttività restano sotto, poi tornano normali un po' alla volta (come l'apprendimento delle tecnologie).

| | Lampo | A ondate (per ogni ondata) |
|---|---|---|
| Al primo giorno | Puntualità −5, Accuratezza −4, produttività −20% | Puntualità −3, Accuratezza −2, produttività −10% |
| Durata di base | 8 settimane | 5 settimane |

La durata si accorcia o si allunga:
- Operazioni del manager del magazzino: −3% per ogni punto sopra 10 (e al contrario sotto);
- WMS appreso ×0,8, radiofrequenza ×0,9, formazione strutturata ×0,85, Academy ×0,9;
- personale nuovo: + metà della quota di persone assunte apposta (con metà squadra nuova, ×1,25);
- cambiare il manager durante il trasloco o la stabilizzazione: ×1,2;
- morale della squadra sotto 45: ×1,2.

Nella finestra del magazzino compare una barra «Stabilizzazione» con le settimane che restano e i malus di oggi.

## 3. Le persone
### Chi segue e chi no
Dipende dalla distanza tra i due capannoni:

| Distanza | Personale che segue |
|---|---|
| fino a 15 km | 95% |
| 15-40 km | 75% |
| 40-80 km | 40% |
| oltre 80 km | 10% |

Ritocchi: +2% per ogni punto di Leadership del manager sopra 10; +15% con i **pulmini** del Welfare installati (fino a 80 km); autisti +20% (guidare è il loro mestiere); impiegati e capiturno +10%.
- Chi non segue se ne va con un mese di buonuscita, come un licenziamento ma senza la notizia sul giornale e senza «ondata».
- Chi segue oltre i 30 km prende un'**indennità di trasferimento**: 1.000 € a testa, una volta.
- Chi manca si assume a destinazione con i tempi di oggi (annuncio o agenzia): conviene cominciare in preparazione.
- Il manager e il facility manager seguono sempre. Oltre gli 80 km può arrivare l'evento del manager pendolare (punto 7).
- **Trasferimento di clienti**: il gioco propone quante persone portare (in proporzione al lavoro che si sposta), con i + e i − di sempre; seguono con le stesse percentuali, gli altri restano dove sono.
- **Cooperativa e fornitori di handling**: se il fornitore locale non lavora nella provincia nuova, a destinazione serve un'altra soluzione (personale interno o gara del fornitore), con le regole di oggi sul cambio d'appalto. I fornitori nazionali seguono.

### Morale
Riassunto dei colpi al morale di un trasloco: voci di corridoio −3 (solo oltre 40 km, in preparazione), straordinari −8 o −4 (per 30 giorni), stabilizzazione −2 sull'obiettivo finché dura. Le risposte agli eventi (festa d'addio, premio trasloco) possono restituirne una parte.

### Col pacchetto Relazioni industriali
- Il sindacato del vecchio magazzino va avvisato: oltre 40 km il trasloco è una **delocalizzazione**, agitazione +20 per 90 giorni e, se il magazzino ha un sindacato, si apre il tavolo con una richiesta nuova «Accordo di trasferimento» (indennità più alta, navetta aziendale, incentivo all'esodo).
- Sindacato e delegato seguono la squadra se segue almeno metà delle persone; altrimenti il magazzino nuovo parte senza sindacato, come oggi.
- Uno sciopero nei giorni del trasloco è il disastro perfetto: KPI dello sciopero più quelli del trasloco.

## 4. I soldi
Prima proposta per un magazzino tipo (3.000 pallet, 40 km, affitto 8.000 €):

| Voce | Regola | Esempio |
|---|---|---|
| Progetto e permessi | 10.000 € (5.000 per un trasferimento di clienti) | 10.000 € |
| Movimentazione | 6 € per pallet in stock (fasciatura, carico, scarico, ubicazione) | 18.000 € |
| Navette | un bilico pieno ogni 33 pallet, andata e ritorno, al costo a km dei bilici | 13.000 € |
| Straordinari | punto 2 | 10-15.000 € |
| Doppio affitto | si pagano tutti e due i capannoni finché il vecchio non si chiude | 8.000 € |
| Disdetta del vecchio affitto | 2 mesi di affitto (la stessa regola delle avversarie di oggi) | 16.000 € |
| Ripristino del capannone | il proprietario lo vuole com'era: (100 − stato) × posti × 0,15 € | 9.000 € con lo stato a 80 |
| Tecnologie da rimontare | metà del costo di installazione (punto 5) | 5-20.000 € |
| Certificazioni | audit di trasferimento a metà prezzo | 1.500 € per l'HACCP |
| Persone che non seguono | un mese di buonuscita più l'assunzione di chi le sostituisce | 15-20.000 € |
| **Totale** | | **circa 110-140.000 €** |

Tutto finisce nella voce «Altro» del conto economico, tranne straordinari (personale) e tecnologie (tecnologie). La finestra del progetto mostra la stima voce per voce prima della conferma.

Il ripristino lega il trasloco alla manutenzione: chi ha trascurato il vecchio capannone lo paga quando lo restituisce.

**Capannone di proprietà lasciato vuoto** (da decidere, vedi domande): proposta, si mette in vendita e si vende tra 2 e 6 mesi all'80-110% del valore di bilancio (posti × 120 €, corretto per la classe); nel frattempo si pagano costo fisso e bollette.

## 5. Cosa resta e cosa si porta
- **Dotazioni** (ribalte, pannelli, mensa, celle frigo…): fanno parte dell'edificio e restano lì. Nel capannone nuovo valgono le sue.
- **Tecnologie di Logistica e servizi di Welfare**: si smontano e si rimontano a metà del costo di installazione; l'apprendimento riparte, ma dura la metà (le persone le sanno già usare). Se il magazzino di destinazione le ha già, niente costi.
- **Certificazioni di magazzino** (HACCP, freddo, GDP, ADR…): sono legate all'edificio, quindi a destinazione serve un audit nuovo, a metà prezzo e con le settimane di sempre. Un cliente che le richiede e arriva prima del certificato perde soddisfazione ogni mese con la regola di oggi; in più può arrivare l'ispezione (ASL, NAS).
- **Motrici di proprietà, regole del traffico, obiettivo di carico**: si portano.
- **Agitazione**: vedi punto 3.

## 6. Le committenti
### All'annuncio
Ogni cliente coinvolto reagisce una volta sola:
- **classe del capannone**: +2 per ogni classe in su, −2 per ogni classe in giù (doppio con le committenti S e A);
- **distanza dalla sua zona**: km dei giri −20% o meglio +3, +20% o peggio −3;
- **fastidio**: −3 per tutti (sistemi da aggiornare, sopralluogo, nuovi indirizzi di consegna);
- **in pieno picco**: se i giorni del trasloco cadono nei mesi più pieni della sua stagionalità, −4;
- **certificazione richiesta ma non ancora valida a destinazione**: −3.

Le committenti S non accettano un capannone fatiscente (come nelle gare): quel cliente non si può spostare lì.

### Durante il trasloco e la stabilizzazione
Il danno vero arriva dalle regole di oggi: con i KPI sotto soglia la soddisfazione scende a fine mese e chi ha le penali le fa pagare.
Per questo nel progetto c'è la **franchigia sui KPI**: si chiede a ogni cliente di non contare i KPI dal primo giorno del trasloco a metà della stabilizzazione. Riesce con una probabilità che sale con la Negoziazione di chi guida il customer service; se accetta, niente penali e cali di soddisfazione dimezzati, ma tariffa −2% per 3 mesi. Se rifiuta, soddisfazione −1 (gli hai fatto capire che qualcosa andrà storto).

### L'inventario
A fine trasloco, per ogni cliente, come all'uscita di un cliente:

| Esito | Lampo | Ondate |
|---|---|---|
| Tutto liscio | 45% | 65% |
| Differenze inventariali (posti × 2-6 €, pagate al cliente) | 30% | 20% |
| Merce danneggiata nelle navette (rimborso e soddisfazione −3) | 15% | 10% |
| Pallet «spariti» che riappaiono dopo settimane (Accuratezza −1 per 4 settimane) | 10% | 5% |

Più è alta l'accuratezza del vecchio magazzino (e la Precisione del manager), meno pesano gli esiti cattivi; il WMS li riduce ancora.

### Alla fine
Se a fine stabilizzazione i KPI sono di nuovo sopra soglia: **trasloco riuscito**, soddisfazione +3 ai clienti che hanno guadagnato un capannone migliore o più vicino, reputazione +1 e una tappa nella cronaca della partita.

## 7. Eventi del trasloco
Nuova fonte **«Trasloco»**, con una scenetta nuova (navetta in partenza, scatoloni, scaffalature smontate).
Sono eventi dedicati come i guasti e gli incendi: non entrano nell'estrazione normale, quindi non tolgono spazio agli altri eventi. Ogni trasloco ne ha 1 o 2, pescati tra quelli possibili in quella fase. Prima idea:

| Evento | Fase | Risposte (in breve) |
|---|---|---|
| **Il buyer vuole vedere il capannone nuovo** | preparazione | visita preparata (costo, soddisfazione +3) / visita così com'è (prova di Precisione del manager) / rimanda (soddisfazione −2) |
| **Manca il certificato dei Vigili del Fuoco** | preparazione (capannone senza antincendio) | consulente urgente (costo) / slitta di 2 settimane / si parte lo stesso (rischio di multa) |
| **Il magazziniere storico non viene** | preparazione | aumento per farlo restare / gli organizzi la festa / lasci perdere (morale −2) |
| **La festa d'addio al vecchio capannone** | ultimi giorni | grigliata in piazzale (costo, morale +4) / targa ricordo / niente |
| **La navetta si ribalta in tangenziale** | trasloco | assicurazione (lenta) / rimborsi subito il cliente / dai la colpa al trasportatore (reputazione) |
| **Il WMS non trova le ubicazioni** | trasloco | inventario straordinario (costo, 3 giorni) / ci arrangiamo (Accuratezza −2 per 4 settimane) |
| **Il vicino protesta per i camion di notte** | trasloco | niente navette di notte (trasloco più lungo) / un regalo al vicino / tiri dritto (rischio ordinanza) |
| **Nevicata** (solo d'inverno) | trasloco | si ferma tutto 2 giorni / si va lo stesso (rischio di danni) |
| **Trovati 40 pallet dimenticati** (di un cliente perso anni fa) | trasloco | li restituisci (reputazione +1) / li vendi (soldi, rischio legale) / discarica (costo) |
| **Il proprietario contesta i danni** | dopo la chiusura | paghi / perizia (prova di Amministrazione) / avvocato |
| **Il manager fa il pendolare** | stabilizzazione (oltre 80 km) | auto aziendale (costo) / foresteria / niente (rischio dimissioni) |
| **Il gatto del magazzino non vuole traslocare** | qualsiasi | lo porti (morale +2) / resta col proprietario / adozione in ufficio |

Col pacchetto Relazioni industriali: **«Il sindacato chiede l'accordo di trasferimento»** (apre il tavolo, punto 3).

## 8. Interfaccia
- **Dove si parte**: nella finestra Magazzini, accanto a ristrutturazione e ampliamento, il pulsante **«Trasloca»**. Anche dalla scheda di un capannone libero o di un cantiere («Trasloca qui»).
- **Il progetto** (pannello dentro la finestra, come quello per costruire da zero), a passi:
  1. **Dove**: i tuoi magazzini, i capannoni liberi (si affittano con il progetto), i tuoi cantieri (la data parte dalla fine dei lavori). Per ognuno distanza, classe, posti liberi, certificazioni.
  2. **Chi**: i clienti del magazzino con una casella ciascuno, logo, pallet in stock e reazione prevista (+/−). «Tutti» = trasloco del magazzino.
  3. **Come**: lampo o a ondate; straordinari o agenzia.
  4. **Quando**: la settimana di partenza, con la stagionalità di ogni cliente coinvolto (il grafico di oggi) e le settimane di picco segnate in rosso; il gioco consiglia la più tranquilla.
  5. **Riepilogo**: costi voce per voce, persone che seguono e da assumere, reazione di ogni cliente, KPI previsti, franchigia da chiedere. Pulsante di conferma.
- **Durante**: nella finestra del magazzino una barra con la fase e i giorni che restano; sulla mappa una freccia tratteggiata tra i due capannoni con i camion navetta che fanno avanti e indietro.
- **Notifiche**: preavviso partito, certificato o personale che mancano a destinazione (problema aperto giallo), inizio e fine del trasloco, esito dell'inventario, fine della stabilizzazione.
- **Telefono**: il pannello a tutto schermo, un passo sotto l'altro; pulsanti grandi.
- **Enciclopedia**: voci nuove «Trasloco», «Stabilizzazione», «Franchigia sui KPI», «Disdetta e ripristino», con le parole chiave nel pannello.

## 9. Le aziende avversarie
- Traslocano anche loro, con poche regole semplici: lasciano un capannone fatiscente o vecchio quando hanno cassa e c'è un capannone migliore libero vicino; accorpano due magazzini mezzi vuoti. Sempre a ondate, mai in picco.
- Il Sole 24 Pallet ne dà notizia; il capannone lasciato torna libero sulla mappa.

## 10. Ordine di lavoro proposto
1. **Base**: progetto, trasferimento di clienti e trasloco del magazzino in affitto, fasi, costi, chi segue, stabilizzazione, reazione delle committenti, chiusura di un magazzino vuoto, interfaccia, enciclopedia, test sul computer e sul telefono.
2. **Rischi e colore**: inventario, franchigia sui KPI, eventi del trasloco e scenetta.
3. **Pacchetto Relazioni industriali** e capannoni di proprietà da vendere.
4. **Avversarie e bilanciamento** (partite di 12 anni: quanto spesso traslocano, se il trasloco ripaga, quanti clienti si perdono).

## Domande per Davide
1. Vanno bene **tutti e due i tipi** (magazzino intero e clienti singoli) o partiamo solo dal trasloco del magazzino intero?
2. **Lampo e a ondate**: tutte e due o una sola?
3. Gli **eventi del trasloco** sono fuori dall'estrazione normale (1-2 per trasloco, come i guasti). La regola «eventi rari» resta valida per tutto il resto: va bene?
4. Un **capannone di proprietà** lasciato vuoto: si vende, resta vuoto con i suoi costi, o si può affittare a un'avversaria?
5. Una committente molto scontenta del trasloco può **andarsene subito** (rifiuta di seguirti) o vale solo la regola di oggi (sotto 25 di soddisfazione se ne va)?

## Note per chi lo costruirà
- Stato del progetto: un campo nuovo per magazzino (o un elenco `S.traslochi`) con origine, destinazione, clienti, modalità, giorni e fase; i vecchi salvataggi non hanno traslochi in corso, quindi basta un valore di partenza vuoto (niente cambio della chiave di salvataggio).
- Effetti nei giorni del trasloco e nella stabilizzazione dentro `computeWH()`, come `riFx()`; durate e malus calanti come l'apprendimento delle tecnologie.
- Cambio di magazzino del cliente = cambio di `c.wh`; i km si ricalcolano da soli con `clientLog()`.
- Morale con `mod()`; buonuscite con la logica di `fireOne()` senza l'«ondata»; disdetta come `botShrink()`.
- Eventi con `solo:true` come `guasto` e `incendio`; scena della fonte in `SCN_SRC`.
- Avvisi solo con `notify()` / `noteVar()`, muti con `isBot()` e `AUTO`.
- Aggiornare `docs/design.md`, `WIKI`, `CHANGELOG`, il test e, se un passo del tutorial indica i pulsanti dell'immobile, il suo `hi`.

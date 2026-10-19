# FUP: regole e formule

Questo è il riferimento per le meccaniche del prototipo. In caso di dubbio, fa fede il codice in `src/game.html` (sezione MOTORE).

## Partita
- Si sceglie uno dei 4 CEO (Gino, Edoardo, Valeria, Marco), il nome dell'azienda e il colore. Ogni CEO ha un magazzino di proprietà, un cliente iniziale, una cassa, delle motrici e dei talenti propri.
- Si parte a gennaio 2002. Le tecnologie e gli eventi hanno un anno minimo.
- Si va in fallimento se a fine mese la cassa è sotto −50.000 €.

## KPI di magazzino (ricalcolati ogni giorno)
- **Puntualità** P = 92 + 0,4·(Operazioni−10) + tecnologie + eventi + direttore operativo·0,15·(Op−10) − 20·max(0, utilizzo autisti CE−1) − 20·max(0, utilizzo autisti B−1) − 8·max(0, utilizzo carrellisti−1,05) − 3·max(0, utilizzo magazzinieri−1,05) − 1,5·impiegati mancanti
- **Accuratezza** A = 96 + 0,3·(Precisione−10) + 0,04·(morale−60) + tecnologie + eventi + ISO 0,5 − 25·max(0, saturazione−0,85) − 8·max(0, utilizzo magazzinieri−1) − 3·max(0, utilizzo carrellisti−1) − 1·impiegati mancanti
- Entrambi sono limitati tra 50 e 99,9.
- **Morale**: obiettivo = 58 + 0,6·(Leadership−10) + welfare + tecnologie + Academy 3 + direttore HR·0,3·(Lead−10) − 20·(sovraccarico magazzinieri) − 20·(sovraccarico carrellisti) − 20·(sovraccarico del gruppo di autisti più carico). Ogni giorno il morale si avvicina all'obiettivo dell'1,2% della differenza.
- Le abilità usate sono quelle del manager del magazzino; senza manager le prestazioni calano.
- **Saturazione dei mezzi** (`satMezzi()`): quanto sono pieni in media i camion in uscita, in % della capienza (`CAPV` = 33 pallet). Base 48,5% (16 pallet a viaggio). Viaggi di distribuzione = ceil(pallet / (33 × saturazione)): più saturazione = meno viaggi, km, gasolio e autisti; il ricavo non cambia.
  - Saturazione naturale = 48,5 + GPS 2 + pianificazione rotte 5 + **Sinergia in pianificazione** 7 × (clienti attivi nel magazzino − 1), massimo +30 (tutte valgono a metà e al contrario durante l'apprendimento).
  - **Obiettivo minimo** (`w.satObj`, nessuno / 55-90%), scelto nella finestra del magazzino. Capacità di pianificazione = naturale + 1,2·(Operazioni del manager−10) + 0,25·(morale−60) + 8 × impiegati in più del necessario (tra −3 e +3) + eventi.
  - Se l'obiettivo supera la naturale: con capacità ≥ obiettivo la saturazione è obiettivo + 35% dell'eccedenza; altrimenti si ferma alla capacità (mai sotto la naturale). Massimo 95%.
  - Costi: Puntualità −0,06 per ogni punto sopra la naturale (camion che aspettano il carico); morale obiettivo −0,5 per ogni punto di obiettivo non raggiunto. Gli impiegati necessari mostrati salgono di quanti ne servono per raggiungere l'obiettivo (massimo 3).

## Economia (mensile)
- Ricavo per cliente = (posti pallet·5,5 + 2·pallet movimentati·3,8 + pallet·(18 + 0,05·km di un viaggio di distribuzione) + viaggi di ritiro·km del ritiro·1,5) × moltiplicatore dell'offerta.
- Personale: RAL magazzinieri 18.000, carrellisti 19.500, impiegati di magazzino 22.000, autisti patente B 19.000, autisti patente CE 23.000, × 1,42 di oneri, ÷ 12.
- Mezzi: km CE × (0,25 l/km × gasolio × riduzione rotte + 0,13) €/km + km B × (0,12 l/km × gasolio × riduzione rotte + 0,06) €/km, più 1.100 € per autista CE, 2.100 € di leasing per ogni autista CE oltre le motrici di proprietà e 900 € di furgone in leasing per autista B.
- Ogni autista CE copre 5.200 km al mese, ogni autista B 4.000 (traffico e soste in città). Se gli autisti sono troppo pochi, la Puntualità cala.
- Immobile: costo fisso + 1.000, × moltiplicatore costi fissi (gestionale −3%, controllo di gestione −4%, direttore finanziario −0,5% per punto di Amministrazione sopra 10).
- CEO 4.000 €/mese; manager e dirigenti a RAL × 1,42.
- Gasolio: 0,86 €/l nel 2002, +0,05 l'anno, con oscillazioni.

## Clienti e contratti
- Ogni cliente ha un **logo** in pixel art 16×16 (`LOGO`).
- **Zona di distribuzione** (`ZONES`): può essere una provincia, una regione (Piemonte, Lombardia, Liguria), tutto il Nord-Ovest o il Nord Italia (che comprende anche Piacenza e Verona). "Tutta Italia" esiste già ma è bloccata finché la mappa non si allarga: i clienti che la richiedono (Spedizioni Tricolore) non partecipano alle gare. La zona viene scelta a ogni gara tra quelle possibili per quel cliente (`CINFO.zones`); il cliente iniziale usa la prima.
- Viaggi di distribuzione = ceil(pallet/16). Km di un viaggio = 2 × distanza media tra il magazzino e i capoluoghi della zona × 1,3 + 30.
- **Approvvigionamento** (`CINFO.src`, `ORIGINS`): da dove arriva la merce. Con `ritiro` andiamo noi a prenderla: ceil(pallet/33) viaggi a pieno carico, ciascuno di 2 × distanza × 1,3 + 20 km. Così servono più autisti e più gasolio, ma c'è anche più fatturato. Con `consegna` la merce la porta il cliente e per noi non ci sono costi.
- Sulla mappa, "Mostra sulla mappa" dalla finestra Clienti disegna le linee verso la zona e la linea di arrivo della merce (arancione se il ritiro è nostro, bianca se consegna il cliente).
- **Lenti della mappa** (`LENSES`, pulsanti in basso a destra o tasto L): cambiano cosa mostra la mappa, come le modalità mappa dei giochi Paradox. Per ora: *Mappa normale* e *Province* (le 25 province di Piemonte, Valle d'Aosta, Lombardia e Liguria con sigla, colori diversi tra province confinanti e bordo più spesso dove hai un magazzino; il tooltip mostra regione, capoluogo, tuoi magazzini e siti in affitto). Sono solo visualizzazione, non cambiano le regole.
- Soddisfazione a fine mese: se entrambi i KPI sono sopra soglia +3 (+1 con EDI, +1 con KAM); entro 2 punti sotto la soglia −4; più sotto −10 e penale del 5%. Sotto 25 il cliente se ne va.
- Rinnovo a 24 mesi se la soddisfazione è ≥ 50 (≥ 40 con KAM).

## Rank delle committenti
- Ogni committente ha un **rank** da S (le migliori) a F (le peggiori), mostrato come medaglia in pixel art (`rankIcon()`) nelle gare, nella lista clienti e nella scelta del CEO; il tooltip mostra i quattro voti.
- Rank = media di 4 voti 0-100: **ricavi promessi** = clamp(10 + (2·pallet + posti)/60; 0; 100) sui volumi base del cliente; **desiderabilità**, **pubblicità** e **solidità** fissi in `RANK_F`.
- Soglie della media: S ≥ 80, A ≥ 68, B ≥ 58, C ≥ 46, D ≥ 36, F sotto.
- Effetti (`RANKS`): prezzo sul listino S +15%, A +8%, B +3%, C 0, D −3%, F −12%; difficoltà della gara S +6, A +3, D −3, F −6; reputazione alla vittoria S +6, A +4, B +2, C +1, D 0, F −1; reputazione se il cliente disdice S −10, A −7, B −4, C −3, D −2, F −1.
- **S e A solo per grandi logistiche** (`NAZ_REQ`): per fare un'offerta servono la ricerca "Accordi quadro nazionali" (Mercato, dopo KAM), almeno 3 magazzini e reputazione ≥ 65. Hanno anche soglie KPI più severe.

## Report KPI settimanale
- Ogni lunedì si chiude la settimana: per ogni magazzino si salvano le medie di Puntualità, Accuratezza, saturazione e morale, insieme ai pallet movimentati, ai viaggi, ai ricavi e ai costi (vengono conservate le ultime 26 settimane in `S.weeks`).
- I grafici a linee del report (passando il mouse si leggono i valori di ogni settimana):
  - nel Riepilogo, Puntualità e Accuratezza per magazzino in due grafici separati, più la media dell'azienda tratteggiata;
  - nel foglio di ogni magazzino, entrambi i KPI e la soglia più severa tra i clienti (tratteggiata); la colonna K riporta la saturazione dei mezzi della settimana (rossa se sotto l'obiettivo);
  - nel foglio Clienti, i KPI del magazzino che serve il cliente scelto e i livelli richiesti dal suo contratto. Per ogni cliente si salvano ogni settimana KPI, soglie e soddisfazione in `S.weeks[].cli`.
- Colori fissi delle serie (controllati per chi distingue male i colori): Puntualità blu `#2f7fd6`, Accuratezza viola `#7b4fe0`; i magazzini seguono l'ordine `SERIES_C`.
- La finestra "Report KPI" imita un foglio Excel: un foglio di riepilogo, un foglio per ogni magazzino, la barra della formula che spiega la cella selezionata e i colori condizionali. Verde = sopra la soglia più severa tra i clienti del magazzino, giallo = entro 2 punti, rosso = sotto.

## Gare (tender)
- Arriva una gara ogni 28-46 giorni (20-35 con l'Ufficio commerciale). Alcune richiedono tecnologie: catena del freddo, EDI, e-commerce.
- Punteggio = 50 + (1−moltiplicatore)·120 + margine P·4 + margine A·4 (ciascuno tra −20 e +10) + (reputazione−50)·0,4 + (Negoziazione CEO−10) + direttore commerciale·0,8·(Neg−10) + ISO 3. Si confronta con 55 + difficoltà della gara + modificatore del rank, con probabilità logistica (scala 6).

## Personale e recruiting
- Giorni per assumere = base × clamp(1 + (55 − attrattività)/40; 0,6; 1,8) × (Ufficio del personale 0,8) × (1 − 0,02·(Leadership del direttore HR − 10)).
- Attrattività = 40 + welfare + (reputazione−50)·0,5 + 5.
- Ogni magazzino ha cinque mestieri (`ROLES`, `w.staff`): magazzinieri (`pick`), carrellisti (`car`), impiegati di magazzino (`imp`), autisti patente B (`autB`), autisti patente CE (`autCE`). Non ci sono più impiegati di sede.
- Produttività base `prod` = 900 × (0,7 + 0,3·morale/70) × (1 + tecnologie di produttività).
- Magazzinieri necessari = pallet consegnati al mese / prod (preparano i pallet in uscita, pesano sull'Accuratezza).
- Carrellisti necessari = movimenti (2 × pallet) / (2·prod) (scaricano, stoccano e caricano col muletto, pesano sulla Puntualità).
- Impiegati necessari per magazzino = 1 + ceil(pallet consegnati / 1.500) (2.000 con il gestionale).
- Autisti B necessari = km di distribuzione dei clienti con `CINFO.veh='B'` / 4.000. Autisti CE = km di distribuzione degli altri clienti + km di tutti i ritiri, / 5.200.
- Clienti con furgoni (`veh:'B'`): FarmaSpa, Moda Grucciani, Scarpinando, Tuttosubito Italia, Spesa Veloce, Spedizioni Tricolore, Cosmetici Belletto, Seterie del Lario.
- Tempi base di assunzione (annuncio / agenzia, giorni): magazzinieri 20/6, carrellisti 25/8, impiegati 20/7, autisti B 15/6, autisti CE 40/16.
- I salvataggi con i vecchi ruoli vengono convertiti (`migrateStaff`): metà dei magazzinieri diventano carrellisti, gli autisti diventano CE (poi quelli in più passano ai furgoni se servono), gli impiegati di sede si dividono tra i magazzini.

## Abilità dei personaggi
Ogni abilità ha un'icona 8×8 e un colore fisso, usati ovunque nel gioco: Operazioni = ingranaggio arancione, Precisione = bersaglio blu, Negoziazione = moneta gialla, Leadership = bandiera rossa, Amministrazione = calcolatrice verde, Innovazione = lampadina viola.

## Tecnologie
- Tre alberi: **Logistica** (barcode → WMS → radiofrequenza → pick-to-light → AMR; formazione → sicurezza muletti → magazzino verticale; GPS → pianificazione rotte → sinergia in pianificazione), **Sviluppo aziendale** (gestionale → ufficio del personale → welfare → Academy; gestionale → struttura direzionale → controllo di gestione → ISO 9001), **Mercato** (ufficio commerciale → EDI → KAM → e-commerce / accordi quadro nazionali; marketing; catena del freddo).
- Una ricerca alla volta. Giorni = base × clamp(1 − 0,03·(Innovazione − 10); 0,6; 1,5). Si usa l'Innovazione più alta tra quella del CEO e quella del direttore tecnologia. Annullando una ricerca si recupera il 50% del costo.
- Logistica: dopo la ricerca si paga l'installazione in ogni magazzino, più un canone mensile. Durante le settimane di apprendimento l'effetto è negativo, poi diventa positivo (Academy −30% sui tempi di apprendimento).

## Dirigenti
- Sbloccati dalla "Struttura direzionale". Posti disponibili: operativo (Operazioni), commerciale (Negoziazione), risorse umane (Leadership), finanziario (Amministrazione), tecnologia (Innovazione).
- I candidati sono i manager già assunti e non assegnati a un magazzino, oppure i dirigenti esterni Ottavio Ferri, Giulia Marchetti e Roberto "Bob" Colombo (head hunter 15.000 €).

## Eventi
- Uno ogni 30-55 giorni (il primo verso il 25° giorno). Un evento non si ripete prima di 240 giorni; quelli con `once` capitano una sola volta.
- Ogni evento ha 2-3 opzioni. Alcune opzioni richiedono un talento o un'abilità del CEO.
- Tipi di evento: meteo (nebbia, neve, afa, allerta Liguria), politica e storia (euro, ZTL, elezioni, Expo, lockdown, caro gasolio), vita locale (Giro, derby, parroco, vicino di capannone), clienti, personale e tecnologia.

## Enciclopedia e parole chiave
- Finestra "Enciclopedia di FUP" (icona del libro nel menu, tasto E): indice per categorie (basi, KPI, abilità, talenti, personale, clienti e gare, soldi e costi, tecnologie, direzione, gergo), ricerca, voci collegate tra loro, pulsanti Indietro e Indice.
- Nell'interfaccia le parole chiave sono sottolineate a puntini: al passaggio del mouse un tooltip dà la spiegazione breve, al clic si apre la voce completa. Anche abilità, talenti, tecnologie installate e i riquadri della barra in alto aprono la loro voce.
- Le voci di abilità, talenti, tecnologie e direttori sono generate dai dati del gioco; le altre sono scritte a mano in `WIKI` e i numeri vanno tenuti allineati alle formule di questo documento.

## Idee aperte
- Espansione oltre il Nord-Ovest, concorrenti più attivi sulla mappa, flotta con tipi di mezzi diversi (motrici, bilici, frigo), contratti con i fornitori, uffici.

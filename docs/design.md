# FUP: regole e formule

Questo è il riferimento per le meccaniche del prototipo. In caso di dubbio, fa fede il codice in `src/game.html` (sezione MOTORE).

## Partita
- Si sceglie uno dei 4 CEO (Gino, Edoardo, Valeria, Marco), il nome dell'azienda e il colore. Ogni CEO ha un magazzino di proprietà, un cliente iniziale, una cassa, delle motrici e dei talenti propri.
- Si parte a gennaio 2002. Le tecnologie e gli eventi hanno un anno minimo.
- Si va in fallimento se a fine mese la cassa è sotto −50.000 €.

## KPI di magazzino (ricalcolati ogni giorno)
- **Puntualità** P = 92 + 0,4·(Operazioni−10) + tecnologie + eventi + direttore operativo·0,15·(Op−10) − 20·max(0, utilizzo autisti−1) − 5·max(0, utilizzo magazzinieri−1,05) − 1,5·impiegati mancanti
- **Accuratezza** A = 96 + 0,3·(Precisione−10) + 0,04·(morale−60) + tecnologie + eventi + ISO 0,5 − 25·max(0, saturazione−0,85) − 8·max(0, utilizzo magazzinieri−1)
- Entrambi sono limitati tra 50 e 99,9.
- **Morale**: obiettivo = 58 + 0,6·(Leadership−10) + welfare + tecnologie + Academy 3 + direttore HR·0,3·(Lead−10) − sovraccarico. Ogni giorno il morale si avvicina all'obiettivo dell'1,2% della differenza.
- Le abilità usate sono quelle del manager del magazzino; senza manager le prestazioni calano.

## Economia (mensile)
- Ricavo per cliente = (posti pallet·5,5 + 2·pallet movimentati·3,8 + pallet·30) × moltiplicatore dell'offerta.
- Personale: RAL magazzinieri 18.500, autisti 20.000, impiegati 22.000, × 1,42 di oneri, ÷ 12.
- Mezzi: viaggi = ceil(pallet/16), 240 km a viaggio, (0,25 l/km × gasolio × riduzione rotte + 0,13) €/km, più 1.100 € per autista e 2.100 € di leasing per ogni autista oltre le motrici di proprietà.
- Immobile: costo fisso + 1.000, × moltiplicatore costi fissi (gestionale −3%, controllo di gestione −4%, direttore finanziario −0,5% per punto di Amministrazione sopra 10).
- CEO 4.000 €/mese; manager e dirigenti a RAL × 1,42.
- Gasolio: 0,86 €/l nel 2002, +0,05 l'anno, con oscillazioni.

## Clienti
- Soddisfazione a fine mese: se entrambi i KPI sono sopra soglia +3 (+1 con EDI, +1 con KAM); entro 2 punti sotto la soglia −4; più sotto −10 e penale del 5%. Sotto 25 il cliente se ne va.
- Rinnovo a 24 mesi se la soddisfazione è ≥ 50 (≥ 40 con KAM).

## Gare (tender)
- Arriva una gara ogni 28-46 giorni (20-35 con l'Ufficio commerciale). Alcune richiedono tecnologie: catena del freddo, EDI, e-commerce.
- Punteggio = 50 + (1−moltiplicatore)·120 + margine P·4 + margine A·4 (ciascuno tra −20 e +10) + (reputazione−50)·0,4 + (Negoziazione CEO−10) + direttore commerciale·0,8·(Neg−10) + ISO 3. Si confronta con 55 + difficoltà della gara, con probabilità logistica (scala 6).

## Personale e recruiting
- Giorni per assumere = base × clamp(1 + (55 − attrattività)/40; 0,6; 1,8) × (Ufficio del personale 0,8) × (1 − 0,02·(Leadership del direttore HR − 10)).
- Attrattività = 40 + welfare + (reputazione−50)·0,5 + 5.
- Impiegati necessari = 2 + 1 ogni 1.500 pallet movimentati (2.000 con il gestionale) + 1 per ogni magazzino oltre il primo.

## Tecnologie
- Tre alberi: **Logistica** (barcode → WMS → radiofrequenza → pick-to-light → AMR; formazione → sicurezza muletti → magazzino verticale; GPS → pianificazione rotte), **Sviluppo aziendale** (gestionale → ufficio del personale → welfare → Academy; gestionale → struttura direzionale → controllo di gestione → ISO 9001), **Mercato** (ufficio commerciale → EDI → KAM → e-commerce; marketing; catena del freddo).
- Una ricerca alla volta. Giorni = base × clamp(1 − 0,03·(Innovazione − 10); 0,6; 1,5). Si usa l'Innovazione più alta tra quella del CEO e quella del direttore tecnologia. Annullando una ricerca si recupera il 50% del costo.
- Logistica: dopo la ricerca si paga l'installazione in ogni magazzino, più un canone mensile. Durante le settimane di apprendimento l'effetto è negativo, poi diventa positivo (Academy −30% sui tempi di apprendimento).

## Dirigenti
- Sbloccati dalla "Struttura direzionale". Posti disponibili: operativo (Operazioni), commerciale (Negoziazione), risorse umane (Leadership), finanziario (Amministrazione), tecnologia (Innovazione).
- I candidati sono i manager già assunti e non assegnati a un magazzino, oppure i dirigenti esterni Ottavio Ferri, Giulia Marchetti e Roberto "Bob" Colombo (head hunter 15.000 €).

## Eventi
- Uno ogni 30-55 giorni (il primo verso il 25° giorno). Un evento non si ripete prima di 240 giorni; quelli con `once` capitano una sola volta.
- Ogni evento ha 2-3 opzioni. Alcune opzioni richiedono un talento o un'abilità del CEO.
- Tipi di evento: meteo (nebbia, neve, afa, allerta Liguria), politica e storia (euro, ZTL, elezioni, Expo, lockdown, caro gasolio), vita locale (Giro, derby, parroco, vicino di capannone), clienti, personale e tecnologia.

## Idee aperte
- Espansione oltre il Nord-Ovest, concorrenti più attivi sulla mappa, flotta con tipi di mezzi diversi (motrici, bilici, frigo), contratti con i fornitori, uffici.

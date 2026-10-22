# Traslochi (progetto)

**Stato: fase 1 costruita nella versione 0.102** (le formule esatte sono in `docs/design.md`, sezioni «Traslochi», «Capannone vuoto e vendita» e «Ordinanza sui capannoni fatiscenti»). Restano da fare le fasi 2-4.
I numeri sono una prima proposta, da ritoccare con `tools/bilanciamento.py`.

Differenze rispetto al progetto, decise durante la costruzione:
- Il pulsante «Trasloca clienti» sta nel riquadro Clienti della finestra del magazzino (non tra i lavori dell'immobile): si spostano clienti.
- Il cliente che non vuole traslocare arriva come richiesta gialla subito alla conferma; se nessuno risponde decide il vice dopo 2 settimane, come per tutti gli eventi (non 4).
- Navette del lampo: a noleggio, tutte insieme, il 20% più care (al posto degli «autisti CE in affanno»).
- La stima del progetto mostra i KPI a regime con la squadra al completo e quante persone assumere nel magazzino di arrivo.
- Il capannone vuoto paga le bollette al 30%; tenerlo è la scelta di base. Venderlo è nella fase 1 (le offerte vengono da compratori qualsiasi); restano per dopo l'affitto a un inquilino e le offerte delle avversarie.
- In più, chiesto da Davide: l'**ordinanza sui capannoni fatiscenti**, un evento raro dal 2007 (ogni capannone ha una data sua tra il 2007 e il 2009, e serve averlo da almeno un anno): entro sei mesi va ristrutturato o chiuso, altrimenti cantiere d'ufficio del Comune, multa e reputazione.
- Gli eventi del trasloco della fase 2 non ci sono ancora: per ora l'unico evento è il rifiuto del cliente.

## Decisioni prese con Davide
- Il trasloco è sempre un **trasferimento di clienti**: si sceglie quali clienti spostare e in quale dei propri magazzini. Per traslocare tutto si apre prima il capannone nuovo (affitto o costruzione) e poi ci si spostano tutti i clienti.
- Due modi, **lampo** e **a ondate**, tutti e due disponibili, ognuno con i suoi svantaggi.
- Gli **eventi del trasloco** sono fuori dall'estrazione normale (1 o 2 per trasloco, come i guasti). La regola «eventi rari» resta valida per tutto il resto.
- Il capannone **di proprietà** rimasto vuoto si può **tenere vuoto, affittare o vendere**.
- Una committente può **rifiutarsi di traslocare e andarsene**.

## L'idea in breve
Il giocatore sposta uno o più clienti da un suo magazzino a un altro: per fare spazio, per avvicinarli alla loro zona, per portarli dove c'è la certificazione giusta o per lasciare un capannone vecchio.
Ogni trasloco è un **progetto in tre fasi** (preparazione, giorni del trasloco, stabilizzazione) che costa molto, mette sotto pressione le persone e fa ballare i KPI. Fatto bene, ripaga in pochi anni: capannone migliore, meno km, meno affitto. Fatto male (in pieno picco, senza preavviso, con metà della squadra che non segue) fa perdere clienti.

Come nei giochi Paradox, non ci sono punti azione: si decide il piano, poi il tempo scorre e le statistiche fanno il resto.

## Perché traslocare (cosa ci guadagna chi gioca)
Nessuna regola nuova: il vantaggio viene dalle regole che esistono già.
- **Capannone migliore**: da fatiscente o vecchio a moderno o innovativo (produttività, KPI, morale, bollette, gare con le committenti S e A).
- **Più vicino ai clienti**: i km dei giri si calcolano dal magazzino alla zona del cliente, quindi meno gasolio, meno autisti, puntualità migliore.
- **Più spazio**: sopra l'85% di occupazione l'accuratezza scende; spostare un cliente in un magazzino più vuoto la fa respirare.
- **Certificazioni**: un cliente del fresco va dove ci sono celle frigo e catena del freddo.
- **Meno costi fissi**: due magazzini mezzi vuoti diventano uno pieno, e quello vuoto si affitta, si vende o si restituisce.
- **Clima** (col pacchetto Relazioni industriali): si può lasciare un magazzino in agitazione, ma il sindacato non la prende bene (vedi sotto).

## 1. Il trasferimento di clienti
- **Da dove**: un tuo magazzino.
- **Verso dove**: un altro tuo magazzino, anche appena aperto, oppure un tuo cantiere (la data del trasloco parte dalla fine dei lavori). Per andare in un capannone nuovo lo si affitta prima, dalla scheda Nuovo magazzino, come oggi.
- **Chi**: uno, alcuni o tutti i clienti del magazzino. Se li sposti tutti, il vecchio magazzino resta vuoto e a fine trasloco si decide cosa farne (punto 5).
- **Con chi**: il gioco propone quante persone portare, in proporzione al lavoro che si sposta (tutte, se si spostano tutti i clienti), con i soliti + e −. Il manager non si sposta da solo: si riassegna con «Cambia» come oggi.
- Un magazzino non può essere origine o destinazione di due traslochi insieme.

## 2. Le tre fasi
### Fase 1. Preparazione (da 30 giorni in su)
Dal giorno in cui confermi il progetto al primo giorno del trasloco.
- Le committenti coinvolte ricevono il **preavviso**: 60 giorni, 90 per le S e le A (gli stessi del recesso). Si può partire prima, ma ogni settimana mancante costa −1 di soddisfazione a quel cliente.
- Ogni committente reagisce all'annuncio e **può rifiutarsi** (punto 6).
- A destinazione si prepara tutto: personale da assumere, certificazioni da ottenere, tecnologie da rimontare (punto 4).
- Se il magazzino di destinazione è lontano più di 40 km, nel vecchio girano le voci: morale −3 fino al trasloco.
- Il progetto si può **annullare** finché non iniziano i giorni del trasloco: perdi i soldi del progetto e ogni cliente avvisato perde 2 di soddisfazione («ci avevate detto…»).

### Fase 2. I giorni del trasloco
Due modi, con svantaggi diversi:

| | **Lampo** (un fine settimana lungo) | **A ondate** (un cliente alla volta) |
|---|---|---|
| Durata | 2-6 giorni (800 pallet al giorno) | 1-2 settimane per cliente (250 pallet al giorno), una dopo l'altra |
| KPI nel magazzino di destinazione | Puntualità −14, Accuratezza −4 nei giorni del trasloco | Puntualità −5, Accuratezza −1,5 nei giorni di ogni ondata |
| KPI nel magazzino di partenza | Puntualità −2 | Puntualità −1 per tutta la durata (la squadra carica le navette) |
| Straordinari | personale di magazzino +50% nei giorni del trasloco e nelle 2 settimane dopo | +20% per tutta la durata |
| Morale | −8 subito, ritorna in 30 giorni | −4 subito, ritorna in 30 giorni |
| Navette | tante insieme: autisti CE in affanno per qualche giorno | poche alla volta, ma per settimane |
| Doppio costo del personale | pochi giorni | per tutta la durata la squadra lavora in due posti, con un 15% di lavoro in più |
| Rischio all'inventario (punto 6) | alto | basso |
| Stabilizzazione | più lunga e più dura, tutta insieme | più corta, ondata per ondata (ma ce n'è una per cliente) |
| Pericolo | se in quei giorni succede qualcosa (sciopero, nevicata, navetta ribaltata) colpisce tutti i clienti | la confusione dura mesi: le committenti rimaste indietro aspettano e si innervosiscono (soddisfazione −1 al mese finché aspettano) |

In breve: il lampo costa meno in tempo e affitti, ma tanto in straordinari, nervi e rischio; le ondate costano di più e durano di più, ma fanno meno danni a ogni singolo cliente.

I malus del magazzino di destinazione pesano in proporzione al lavoro che arriva: se i clienti trasferiti sono un terzo dei pallet del magazzino, il malus vale un terzo (mai meno di un quarto: la confusione la sentono tutti).

**Straordinari, policy e sindacato.** Con la policy «Zero straordinario» accesa (o, col pacchetto Relazioni industriali, con il magazzino in stato di agitazione, dove già oggi gli straordinari non si fanno) il trasloco va fatto con un'**agenzia esterna**: niente calo di morale dagli straordinari, ma costa il 30% in più, dura una volta e mezza e l'accuratezza scende di un altro punto (gente che non conosce la merce).

Anche i carichi di lavoro di oggi fanno la loro parte: nei giorni del trasloco magazzinieri e carrellisti hanno un 40% di lavoro in più (lampo) o 15% (ondate). Se la squadra è già al limite va in affanno, e le formule di oggi tolgono KPI e morale da sole.

### Fase 3. Stabilizzazione
Nel magazzino di destinazione nessuno sa ancora dove sono le cose: per qualche settimana i KPI e la produttività restano sotto, poi tornano normali un po' alla volta (come l'apprendimento delle tecnologie).

| | Lampo | A ondate (per ogni ondata) |
|---|---|---|
| Al primo giorno | Puntualità −5, Accuratezza −4, produttività −20% | Puntualità −3, Accuratezza −2, produttività −10% |
| Durata di base | 8 settimane | 5 settimane |

Anche qui i malus pesano in proporzione al lavoro arrivato. La durata si accorcia o si allunga:
- Operazioni del manager del magazzino: −3% per ogni punto sopra 10 (e al contrario sotto);
- WMS appreso ×0,8, radiofrequenza ×0,9, formazione strutturata ×0,85, Academy ×0,9;
- personale nuovo: + metà della quota di persone assunte apposta (con metà squadra nuova, ×1,25);
- cambiare il manager durante il trasloco o la stabilizzazione: ×1,2;
- morale della squadra sotto 45: ×1,2.

Nella finestra del magazzino compare una barra «Stabilizzazione» con le settimane che restano e i malus di oggi.

## 3. Le persone
### Chi segue e chi no
Dipende dalla distanza tra i due magazzini:

| Distanza | Personale che segue |
|---|---|
| fino a 15 km | 95% |
| 15-40 km | 75% |
| 40-80 km | 40% |
| oltre 80 km | 10% |

Ritocchi: +2% per ogni punto di Leadership del manager del vecchio magazzino sopra 10; +15% con i **pulmini** del Welfare installati (fino a 80 km); autisti +20% (guidare è il loro mestiere); impiegati e capiturno +10%.
- Chi non vuole seguire lascia l'azienda con un mese di buonuscita. È un'uscita concordata: niente notizia sul giornale e niente «ondata» di licenziamenti.
- Chi segue oltre i 30 km prende un'**indennità di trasferimento**: 1.000 € a testa, una volta.
- Chi manca si assume a destinazione con i tempi di oggi (annuncio o agenzia): conviene cominciare in preparazione.
- Chi non era tra le persone da spostare resta dov'è.
- **Cooperativa e fornitori di handling**: se il fornitore locale non lavora nella provincia di destinazione, lì serve un'altra soluzione (personale interno o gara del fornitore), con le regole di oggi. I fornitori nazionali seguono.

### Morale
I colpi al morale di un trasloco: voci di corridoio −3 (solo oltre 40 km, in preparazione), straordinari −8 o −4 (per 30 giorni), stabilizzazione −2 sull'obiettivo finché dura. Le risposte agli eventi (festa d'addio, premio trasloco) possono restituirne una parte.

### Col pacchetto Relazioni industriali
- Oltre 40 km il trasloco è una **delocalizzazione**: agitazione +20 per 90 giorni nel magazzino di partenza e, se lì c'è un sindacato, si apre il tavolo con una richiesta nuova, «Accordo di trasferimento» (indennità più alta, navetta aziendale, incentivo all'esodo).
- Se segue almeno metà delle persone, sindacato e delegato arrivano con loro nel magazzino di destinazione, se lì non c'è già.
- Uno sciopero nei giorni del trasloco è il disastro perfetto: KPI dello sciopero più quelli del trasloco.

## 4. I soldi
### Il trasloco
Prima proposta per 3.000 pallet spostati a 40 km:

| Voce | Regola | Esempio |
|---|---|---|
| Progetto | 5.000 € più 2.000 € per ogni cliente | 9.000 € con 2 clienti |
| Movimentazione | 6 € per pallet in stock (fasciatura, carico, scarico, ubicazione) | 18.000 € |
| Navette | un bilico pieno ogni 33 pallet, andata e ritorno, al costo a km dei bilici | 13.000 € |
| Straordinari | punto 2 | 10-15.000 € |
| Tecnologie da rimontare | metà del costo di installazione, solo quelle che a destinazione mancano | 5-20.000 € |
| Certificazioni | audit di trasferimento a metà prezzo, solo se a destinazione mancano | 1.500 € per l'HACCP |
| Persone che non seguono | un mese di buonuscita più l'assunzione di chi le sostituisce | 15-20.000 € |
| Indennità di trasferimento | 1.000 € a chi segue oltre i 30 km | 10.000 € |
| **Totale** | | **circa 80-120.000 €**, più quello che costa il capannone lasciato (punto 5) |

Tutto finisce nella voce «Altro» del conto economico, tranne straordinari (personale) e tecnologie (tecnologie). La finestra del progetto mostra la stima voce per voce prima della conferma.

### Cosa resta e cosa si porta
- **Dotazioni** (ribalte, pannelli, mensa, celle frigo…): fanno parte dell'edificio e restano lì.
- **Tecnologie di Logistica e servizi di Welfare**: se a destinazione mancano, si smontano e si rimontano a metà del costo di installazione; l'apprendimento riparte, ma dura la metà (le persone le sanno già usare).
- **Certificazioni di magazzino** (HACCP, freddo, GDP, ADR…): sono legate all'edificio. Se a destinazione mancano serve un audit nuovo, a metà prezzo e con le settimane di sempre. Un cliente che le richiede e arriva prima del certificato perde soddisfazione ogni mese con la regola di oggi; in più può arrivare l'ispezione (ASL, NAS).
- **Motrici di proprietà**: si spostano con i clienti, in proporzione.

## 5. Il capannone lasciato vuoto
Quando un magazzino resta senza clienti (dopo un trasloco o perché i contratti sono finiti), nella sua scheda Immobile compare il riquadro **«Cosa fare del capannone»**. Prima bisogna sistemare chi ci lavora ancora: spostarlo in un altro magazzino (segue con le percentuali della distanza) o lasciarlo andare con un mese di buonuscita.

| Scelta | In affitto | Di proprietà |
|---|---|---|
| **Tenerlo vuoto** | sì | sì |
| **Restituirlo** (disdetta) | sì | — |
| **Affittarlo** a qualcun altro | no (il proprietario non lo permette) | sì |
| **Venderlo** | — | sì |

- **Tenerlo vuoto**: paghi affitto o costo fisso, più bollette ridotte al 30%. Torna utile per una gara futura. Senza facility manager lo stato scende, e un capannone malandato si affitta e si vende peggio.
- **Restituirlo**: 2 mesi di affitto di disdetta (la stessa regola delle avversarie di oggi) più il **ripristino**: il proprietario lo vuole com'era, (100 − stato) × posti × 0,15 €. Chi ha trascurato la manutenzione paga adesso.
- **Affittarlo**: metti l'annuncio e in 30-60 giorni arrivano da 1 a 3 offerte di inquilini (aziende parodia che non fanno logistica: un mobilificio, un deposito di bibite, un self-storage), al canone di mercato × 0,8-1. Contratto di 6 anni: incassi ogni mese, l'inquilino si occupa della manutenzione e lo stato resta com'è, tu paghi tasse e manutenzione straordinaria (10% del canone). Per riprenderlo prima della scadenza paghi all'inquilino 6 mesi di canone. Canone di mercato: circa 2,8 € a posto al mese, corretto per la classe.
- **Venderlo**: lo metti in vendita e in 2-6 mesi arrivano offerte da accettare o rifiutare. Prezzo = valore di bilancio (posti × 120 €) × classe (fatiscente 0,5, vecchio 0,75, standard 1, moderno 1,2, innovativo 1,4) × stato (sotto 70: −1% per punto) × mercato (tra 0,85 e 1,15; più basso negli anni della crisi, 2009-2013). Venduto, esce dal bilancio e sparisce dalla mappa come tuo; torna tra i capannoni liberi da affittare.
- Con le avversarie in partita, anche loro possono fare un'offerta per affittarlo o comprarlo: pagano il 10-20% in più, ma prendono un magazzino vicino ai tuoi clienti.

Con lo stesso riquadro il giocatore può finalmente **chiudere un magazzino vuoto** (oggi lo fanno solo le avversarie).

## 6. Le committenti
### All'annuncio
Ogni cliente coinvolto reagisce una volta sola:
- **classe del capannone**: +2 per ogni classe in su, −2 per ogni classe in giù (doppio con le committenti S e A);
- **distanza dalla sua zona**: km dei giri −20% o meglio +3, +20% o peggio −3;
- **fastidio**: −3 per tutti (sistemi da aggiornare, sopralluogo, nuovi indirizzi di consegna);
- **in pieno picco**: se i giorni del trasloco cadono nei suoi mesi più pieni, −4;
- **certificazione richiesta ma non ancora valida a destinazione**: −3.

### Il rifiuto
Una committente può **rifiutarsi di traslocare**:
- se dopo l'annuncio la sua soddisfazione è sotto 35, rifiuta sempre;
- altrimenti rifiuta con una probabilità del 5% per ogni punto di reazione negativa oltre −3 (con una reazione di −7, il 20%), +10% per le committenti S e A;
- una committente S rifiuta sempre un capannone fatiscente (come nelle gare).

Il rifiuto arriva come richiesta gialla del customer service, con tre risposte:
1. **La convinci**: tariffa −3% per un anno e prova di Negoziazione di chi guida il customer service. Se va bene, trasloca; se va male, se ne va.
2. **Resta dov'è**: esce dal progetto e rimane nel vecchio magazzino (soddisfazione −2). Se era l'ultimo cliente, il vecchio magazzino resta aperto per lui.
3. **La lasci andare**: il giorno del trasloco il contratto finisce. Nessuna penale né per te né per lei (sei tu che cambi le carte in tavola), reputazione −metà della perdita del suo rank, inventario di uscita con i rischi di oggi.

Senza risposta per 4 settimane decide il vice: «Resta dov'è».
Anche dopo, durante il trasloco e la stabilizzazione, vale la regola di sempre: sotto 25 di soddisfazione la committente se ne va.

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

Più è alta l'accuratezza del vecchio magazzino (e la Precisione del suo manager), meno pesano gli esiti cattivi; il WMS li riduce ancora.

### Alla fine
Se a fine stabilizzazione i KPI sono di nuovo sopra soglia: **trasloco riuscito**, soddisfazione +3 ai clienti che hanno guadagnato un capannone migliore o più vicino, reputazione +1 e una tappa nella cronaca della partita.

## 7. Eventi del trasloco
Nuova fonte **«Trasloco»**, con una scenetta nuova (navetta in partenza, scatoloni, scaffalature smontate).
Sono eventi dedicati come i guasti e gli incendi: non entrano nell'estrazione normale, quindi non tolgono spazio agli altri eventi. Ogni trasloco ne ha 1 o 2, pescati tra quelli possibili in quella fase (il lampo ha più probabilità di pescare quelli dei giorni del trasloco, le ondate quelli della preparazione e della stabilizzazione).

| Evento | Fase | Risposte (in breve) |
|---|---|---|
| **Il buyer vuole vedere il magazzino nuovo** | preparazione | visita preparata (costo, soddisfazione +3) / visita così com'è (prova di Precisione del manager) / rimanda (soddisfazione −2) |
| **Manca il certificato dei Vigili del Fuoco** | preparazione (magazzino senza antincendio) | consulente urgente (costo) / slitta di 2 settimane / si parte lo stesso (rischio di multa) |
| **Il magazziniere storico non viene** | preparazione | aumento per convincerlo / gli organizzi la festa / lasci perdere (morale −2) |
| **La festa d'addio al vecchio capannone** | ultimi giorni | grigliata in piazzale (costo, morale +4) / targa ricordo / niente |
| **La navetta si ribalta in tangenziale** | trasloco | assicurazione (lenta) / rimborsi subito il cliente / dai la colpa al trasportatore (reputazione) |
| **Il WMS non trova le ubicazioni** | trasloco | inventario straordinario (costo, 3 giorni) / ci arrangiamo (Accuratezza −2 per 4 settimane) |
| **Il vicino protesta per i camion di notte** | trasloco | niente navette di notte (trasloco più lungo) / un regalo al vicino / tiri dritto (rischio ordinanza) |
| **Nevicata** (solo d'inverno) | trasloco | si ferma tutto 2 giorni / si va lo stesso (rischio di danni) |
| **Trovati 40 pallet dimenticati** (di un cliente perso anni fa) | trasloco | li restituisci (reputazione +1) / li vendi (soldi, rischio legale) / discarica (costo) |
| **Il proprietario contesta i danni** | dopo la restituzione | paghi / perizia (prova di Amministrazione) / avvocato |
| **Il manager fa il pendolare** | stabilizzazione (oltre 80 km) | auto aziendale (costo) / foresteria / niente (rischio dimissioni) |
| **Il gatto del magazzino non vuole traslocare** | qualsiasi | lo porti (morale +2) / resta col proprietario / adozione in ufficio |

Col pacchetto Relazioni industriali: **«Il sindacato chiede l'accordo di trasferimento»** (apre il tavolo, punto 3).
Per il capannone vuoto, qualche evento di colore nell'estrazione normale (con `cond` sul capannone vuoto o affittato): l'inquilino che non paga, l'occupazione abusiva di una compagnia teatrale, il compratore che tira sul prezzo all'ultimo.

## 8. Interfaccia
- **Dove si parte**: nella finestra Magazzini, nella parte dell'immobile, il pulsante **«Trasloca clienti»**. Anche dalla scheda di un magazzino di destinazione o di un cantiere («Trasloca qui»).
- **Il progetto** (pannello dentro la finestra, come quello per costruire da zero), a passi:
  1. **Dove**: i tuoi altri magazzini e cantieri, con distanza, classe, posti liberi, certificazioni e tecnologie.
  2. **Chi**: i clienti del magazzino con una casella ciascuno, logo, pallet in stock, reazione prevista (+/−) e rischio di rifiuto.
  3. **Come**: lampo o a ondate (con i due elenchi di pro e contro uno accanto all'altro); straordinari o agenzia; persone da portare (+ e −).
  4. **Quando**: la settimana di partenza, con la stagionalità di ogni cliente coinvolto (il grafico di oggi) e le settimane di picco segnate in rosso; il gioco consiglia la più tranquilla.
  5. **Riepilogo**: costi voce per voce, persone che seguono e da assumere, reazione di ogni cliente, KPI previsti, franchigia da chiedere. Pulsante di conferma.
- **Durante**: nella finestra del magazzino una barra con la fase e i giorni che restano; sulla mappa una freccia tratteggiata tra i due magazzini con i camion navetta che fanno avanti e indietro.
- **Capannone vuoto**: il riquadro «Cosa fare del capannone» (punto 5) con le offerte arrivate; sulla mappa il capannone affittato a terzi ha un'insegna diversa.
- **Notifiche**: preavviso partito, cliente che rifiuta (richiesta gialla), certificato o personale che mancano a destinazione (problema aperto giallo), inizio e fine del trasloco, esito dell'inventario, fine della stabilizzazione, offerte per il capannone.
- **Telefono**: il pannello a tutto schermo, un passo sotto l'altro; pulsanti grandi.
- **Enciclopedia**: voci nuove «Trasloco», «Lampo e a ondate», «Stabilizzazione», «Franchigia sui KPI», «Capannone vuoto» (tenere, restituire, affittare, vendere), con le parole chiave nel pannello.

## 9. Le aziende avversarie
- Traslocano anche loro, con poche regole semplici: lasciano un capannone fatiscente o vecchio quando hanno cassa e ne hanno uno migliore; accorpano due magazzini mezzi vuoti. Sempre a ondate, mai in picco. Il capannone lasciato lo restituiscono (o lo vendono, se è loro).
- Fanno offerte per affittare o comprare i capannoni del giocatore quando cercano un magazzino in quella zona.
- Il Sole 24 Pallet ne dà notizia; il capannone lasciato torna libero sulla mappa.

## 10. Ordine di lavoro proposto
1. **Base**: progetto di trasloco, lampo e a ondate, costi, chi segue, stabilizzazione, reazione e rifiuto delle committenti, capannone vuoto (tenerlo, restituirlo, venderlo), interfaccia, enciclopedia, test sul computer e sul telefono.
2. **Rischi e colore**: inventario, franchigia sui KPI, eventi del trasloco e scenetta.
3. **Affittare il capannone** a un inquilino e il **pacchetto Relazioni industriali**.
4. **Avversarie** (traslocano, comprano e prendono in affitto i tuoi capannoni) e **bilanciamento** (partite di 12 anni: quanto spesso si trasloca, se ripaga, quanti clienti si perdono, quanto vale vendere il primo magazzino).

## Note per chi lo costruirà
- Stato del progetto: un elenco nuovo (per esempio `S.traslochi`) con origine, destinazione, clienti, modalità, persone, giorni e fase; stato del capannone vuoto in un campo del magazzino (in vendita, affittato, offerte). I vecchi salvataggi non hanno traslochi né capannoni in vendita, quindi basta un valore di partenza vuoto (niente cambio della chiave di salvataggio).
- Effetti nei giorni del trasloco e nella stabilizzazione dentro `computeWH()`, come `riFx()`; malus calanti come l'apprendimento delle tecnologie; peso in proporzione ai pallet arrivati.
- Il cliente cambia magazzino cambiando `c.wh` alla fine della sua ondata (o del lampo); i km si ricalcolano da soli con `clientLog()`.
- Rifiuto come richiesta gialla del customer service (`cs:true`, come `cs_proroga`), ricostruita da `restore()`; l'uscita usa `exitClient()` senza penale.
- Morale con `mod()`; buonuscite con la logica di `fireOne()` senza l'«ondata»; restituzione come `botShrink()`, più il ripristino.
- Capannone affittato o venduto: per `siteTaken()` affittato resta occupato, venduto torna libero; il valore in bilancio esce con la vendita.
- Eventi del trasloco con `solo:true` come `guasto` e `incendio`; scena della fonte in `SCN_SRC`.
- Avvisi solo con `notify()` / `noteVar()`, muti con `isBot()` e `AUTO`.
- Aggiornare `docs/design.md`, `WIKI`, `CHANGELOG`, il test e, se un passo del tutorial indica i pulsanti dell'immobile, il suo `hi`.

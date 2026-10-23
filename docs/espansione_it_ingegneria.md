# Pacchetto «Reparto IT e Ingegneria» (progetto)

**Stato: primo pezzo costruito nella versione 0.109** (reparti, consulenti a contratto, tre linee di ricerca, sesto direttore, capannoni innovativi), **secondo pezzo nella 0.110** (avvii nei magazzini), **terzo pezzo nella 0.111** (assistenza, affidabilità, guasti informatici, sistemi che invecchiano, tre ricerche dell'IT); regole esatte in `docs/design.md`. Il resto è ancora proposta, con le decisioni di Davide (sotto).
I numeri sono una prima proposta, tarata su quelli già in uso (stipendi, apprendimento, audit, customer service); vanno ritoccati con `tools/bilanciamento.py`.

## L'idea in breve
Oggi la ricerca è un ufficio invisibile: si paga, si aspettano le settimane, poi con un clic si «installa» la tecnologia in un magazzino e parte l'apprendimento.
Con il pacchetto dietro ogni ricerca e ogni installazione ci sono **persone**, divise in due reparti di sede:

- **Ingegneria** (ufficio tecnico): studia e porta nei magazzini le novità **per le persone e per il modo di lavorare**: formazione, sicurezza, organizzazione del lavoro, impianti e automazione.
- **IT** (sistemi informativi): studia e porta nei magazzini i **sistemi informatici**: barcode, WMS, radiofrequenza, GPS, rotte, gestionale, EDI, portale, e-commerce. In più deve **tenere in piedi** tutto quello che ha installato.

Come nella realtà, all'inizio non si assume nessuno: si chiama un **consulente esterno**. Poi, quando i progetti crescono, si costruisce il reparto interno. Più la squadra è grande e brava, più le ricerche sono veloci e gli avvii nei magazzini filano lisci. Ma i reparti costano stipendi, l'IT con pochi sistemisti fa arrivare i guasti informatici, e un avvio fatto male nel pieno del picco può costare un cliente.

Come nei giochi Paradox, niente punti azione: si decidono le persone e le priorità, poi il tempo scorre e le statistiche fanno il resto.

## Cosa cambia per chi gioca
- **Una scelta nuova**: quanto investire in persone tecniche invece che in magazzini, camion e welfare; consulente o reparto interno.
- **Più ricerche insieme**: una per reparto, fino a tre (Direzione, IT, Ingegneria).
- **Le installazioni diventano progetti**: preparazione, giorno dell'avvio (il *go-live*), esito. Si sceglie se partire piano o tutto in un weekend.
- **I sistemi invecchiano**: dopo qualche anno un WMS va aggiornato, altrimenti si rompe più spesso.
- **Il miglioramento continuo**: gli ingegneri che non sono su un progetto girano per i magazzini e alzano piano piano la produttività.
- **Un sesto posto in Direzione**: il direttore IT e ingegneria.
- **Storie nuove**: il server sotto la scala che si allaga, il ransomware, la fattura elettronica del 2019, il Piano Industria 4.0, il GDPR.

## Decisioni prese con Davide
- **Una ricerca alla volta per reparto**: Direzione (il CEO, come oggi), IT e Ingegneria, quindi fino a tre insieme. È un'eccezione alla regola «una ricerca alla volta», solo col pacchetto. La linea di un reparto si apre quando ha almeno una persona o un consulente a contratto, quindi a inizio partita tutto resta come oggi.
- **Il welfare non passa all'Ingegneria**: le ricerche del Welfare restano nella linea della Direzione, e nei magazzini i servizi li installa il **facility manager** (§6).
- **Consulenti esterni sì**: è la prassi partire con un consulente, quindi sono il primo passo di ogni reparto (§9).
- **Gli anni solo negli eventi**: nessuna ricerca, nessun requisito e nessun personaggio chiede un anno; gli eventi invece hanno i loro anni (il ransomware dal 2016, la fattura elettronica nel 2019). È la stessa regola del gioco base dalla versione 0.107 (§20).
- **Sesto posto in Direzione**: il **direttore IT e ingegneria** (§2), con l'**Innovazione** come abilità (Davide: «un direttore ingegneria con alta innovazione»). Il direttore tecnologia resta com'è.
- **Capannoni innovativi solo col pacchetto**: servono una ricerca specifica, **Edifici intelligenti** («le conoscenze minime per usarli»), e un direttore IT e ingegneria con Innovazione alta (14). Senza pacchetto non si affittano né si costruiscono; chi li ha già li tiene.

## 1. Chi fa cosa: le tecnologie divise per reparto
Ogni tecnologia ha un reparto. Quelle «miste» hanno un reparto che guida (capofila) e uno che dà una mano (supporto).

| Reparto | Tecnologie che esistono già |
|---|---|
| **IT** | Lettori barcode, WMS di base, Radiofrequenza, Telematica GPS, Pianificazione rotte, Sinergia in pianificazione, Gestionale amministrativo, EDI con i clienti, Portale clienti |
| **Ingegneria** | Formazione strutturata, Sicurezza muletti, Academy aziendale |
| **Misti** | Pick-to-light (IT capofila), Logistica e-commerce (IT capofila), Magazzino verticale (Ingegneria capofila), Robot mobili AMR (Ingegneria capofila) |
| **Direzione** (il CEO, come oggi) | Regolamento, Ufficio del personale, Struttura direzionale, Piattaforma welfare, Controllo di gestione, Ufficio commerciale, Marketing, Key account, Accordi quadro, tutto l'albero del Welfare (anche Lavoro agile e Settimana corta), le ricerche delle Relazioni industriali, tutte le Certificazioni |

Le certificazioni restano all'Ufficio qualità, come oggi.

Un reparto senza nessuno (né persone né consulente a contratto) non ha la sua linea di ricerca: le sue tecnologie si studiano nella linea della Direzione, come oggi.

## 2. I due reparti e il sesto direttore
Funzionano come il customer service: un **responsabile** (uno dei manager, scelto con il pulsante «Cambia») più gli **addetti** in sede.

| | Reparto IT | Ingegneria |
|---|---|---|
| Responsabile | Responsabile IT | Responsabile dell'ufficio tecnico |
| Ricerca | Innovazione del responsabile | Innovazione del responsabile |
| Avvii nei magazzini | Precisione (meno errori, meno guasti) | Operazioni (lavori fatti bene in reparto) |
| Addetti | sistemisti e sviluppatori, RAL 32.000 € (circa 3.800 € al mese) | ingegneri e tecnici dei metodi, RAL 36.000 € (circa 4.300 € al mese) |
| Tempi per assumere (annuncio / agenzia) | 30 / 10 giorni | 35 / 12 giorni |
| Massimo | 12 persone | 12 persone |

- **Senza responsabile** fa le sue veci il CEO, «tra mille altre cose»: le sue abilità contano 3 punti in meno.
- **Direttore IT e ingegneria** (sesto posto in Direzione, solo col pacchetto, sbloccato come gli altri dalla Struttura direzionale). Abilità: **Innovazione**. Effetti (0.109): ricerche dei reparti −2% per ogni punto sopra 10 (al massimo −20%); con Innovazione 14 o più, e la ricerca Edifici intelligenti, apre i capannoni innovativi. Nei pezzi successivi: esito degli avvii +1 e affidabilità dei sistemi +1 per ogni punto sopra 10.
- **Direttore tecnologia**: resta com'è e vale per la linea della Direzione (si usa l'Innovazione più alta tra CEO e direttore).
- **Dote iniziale**: Marco («Il nerd del WMS») parte con un sistemista; gli altri CEO partono da zero.
- Talenti che già esistono e che nel reparto trovano un senso nuovo: *Ingegnere informatico* e *Diplomato perito informatico* (responsabile IT: esito degli avvii +5), *Parla con i robot* (avvii degli AMR +10), *Amante dell'IA* (ricerca sull'intelligenza artificiale −30% di tempo), *Allergico al gestionale* (responsabile IT: esito degli avvii −10; ma chi l'ha messo lì?). I loro testi `fx` vanno aggiornati: il tooltip dice tutto quello che fa un talento.

## 3. La lavagna del reparto: chi fa cosa
Ogni reparto ha una lavagna con tre colonne. Il gioco sposta le persone da solo; chi gioca decide solo quante stanno sulla ricerca.

| Colonna | IT | Ingegneria |
|---|---|---|
| **Avvii** | 1 persona per progetto (2 per WMS ed e-commerce) | 1 persona per progetto (2 per verticale e AMR) |
| **Ricerca** | quante ne decide chi gioca (pulsanti + e −) | idem |
| **Magazzini** | assistenza ai sistemi installati (§7) | miglioramento continuo (§8) |

Gli avvii prendono le persone per primi. Tra ricerca e magazzini si sceglie con + e −: più gente sulla ricerca vuol dire ricerche veloci, ma sistemi meno seguiti (IT) o magazzini che migliorano meno (Ingegneria). Se non c'è nessuno sulla ricerca, la ricerca del reparto si ferma (problema aperto giallo «Ricerca IT ferma: la squadra è tutta sui progetti»). Il consulente a contratto sta sempre sulla ricerca (§9).

### Velocità della ricerca nei reparti
Settimane = settimane di base × clamp(1 − 0,03·(Innovazione del responsabile − 10); 0,6; 1,5) × squadra, minimo 3.

| Persone sulla ricerca | 1 | 2 | 3 | 4 | 5 o più |
|---|---|---|---|---|---|
| Durata | ×1,3 | ×1 | ×0,85 | ×0,75 | ×0,7 |

Oltre un certo numero aggiungere persone serve a poco (la voce dell'enciclopedia può citare il vecchio detto: nove donne non fanno un bambino in un mese).

## 4. L'avvio nei magazzini (go-live)
Col pacchetto il pulsante «Installa» delle tecnologie di IT e Ingegneria diventa **«Avvia il progetto»**. Si sceglie chi lo fa: la squadra interna, un consulente (§9) oppure, se non c'è nessuno, il CEO con le sue abilità −3.

### Le fasi
1. **Preparazione**: analisi, configurazione, ordini, montaggio. Occupa le persone del reparto (§3). Durata in settimane: barcode 2, formazione 1, GPS 2, WMS 6, sicurezza muletti 2, rotte 3, radiofrequenza 3, sinergia 2, pick-to-light 4, verticale 8, AMR 8.
2. **Giorno dell'avvio**: alla fine della preparazione. Per le tecnologie IT e per l'automazione si sceglie prima come partire:

| | **Graduale** (un reparto o un cliente alla volta) | **Big bang** (tutto in un fine settimana) |
|---|---|---|
| Apprendimento | come oggi | metà del tempo |
| Primi giorni | — | produttività −20% per 3 giorni |
| Esito | normale | −15 sul punteggio |

3. **Apprendimento**: come oggi (la tecnologia dà metà del suo effetto al contrario, poi vale per intero), allungato o accorciato dall'esito. La persona del reparto resta sul progetto per le prime 2 settimane, poi torna libera.

### Costo
Lo stesso di oggi, pagato all'inizio. Con la squadra interna −15% (meno consulenti da pagare); con un consulente a progetto vale il suo prezzo (§9). Il canone mensile resta.

### L'esito (come il punteggio di un audit)
Punteggio = 60
+ 2 × (abilità di chi fa l'avvio − 10): Precisione del responsabile IT, Operazioni del responsabile dell'Ingegneria, oppure la bravura del consulente
+ 1 × (Innovazione del direttore IT e ingegneria − 10)
+ 5 se nel magazzino c'è la Formazione strutturata, + 5 con l'Academy
+ 0,25 × (morale del magazzino − 60)
− 15 se un reparto del magazzino è in affanno
− 15 in periodo di picco (novembre e dicembre, o un picco di un cliente del magazzino)
− 15 col big bang
− 10 se il reparto di supporto non ha nessuno libero (tecnologie miste)
± 15 a caso.

| Punteggio | Esito | Effetto |
|---|---|---|
| 75 o più | **Liscio come l'olio** | apprendimento −30%, notifica verde |
| 50-74 | **Qualche intoppo** | normale |
| 30-49 | **Avvio difficile** | apprendimento +50%, puntualità −2 e accuratezza −1 per 2 settimane, notifica gialla |
| sotto 30 | **Disastro** | evento giallo (sotto) |

Prima di confermare, la finestra mostra le probabilità («liscio 35%, intoppi 45%, difficile 15%, disastro 5%»), come la probabilità di vittoria di una gara.

Evento **«Il go-live è andato storto»** (scena della sala server):
- *Torna indietro*: la tecnologia si smonta, perdi metà del costo, si può riprovare dopo 8 settimane; morale −3.
- *Tieni duro*: apprendimento ×2, puntualità −3 e accuratezza −2 per 4 settimane, soddisfazione −2 ai clienti del magazzino.
- *Chiama i consulenti*: 25% del costo d'installazione, apprendimento ×1,2, KPI −1 per 2 settimane.

Per i progetti dell'Ingegneria (formazione, sicurezza muletti, layout, ergonomia) il rischio non è il computer che si blocca ma il personale che non ci sta: l'avvio difficile dà morale −3 per 30 giorni (col pacchetto Relazioni industriali anche agitazione +5); il disastro diventa l'evento «Nessuno usa la novità» (i sensori dei muletti coperti col nastro adesivo).

## 5. Collegamenti con le meccaniche di oggi
- **Traslochi**: col reparto Ingegneria il progetto del trasloco costa il 30% in meno e la stabilizzazione dura il 20% in meno. Le tecnologie da rimontare a destinazione passano dal reparto IT come un avvio (con apprendimento a metà, come oggi).
- **Cantieri** (ampliamenti, dotazioni, ristrutturazioni, costruzioni da zero e i lavori del welfare del §6): con almeno un ingegnere nella colonna «Magazzini» durano il 20% in meno.
- **Relazioni industriali**: l'automazione (verticale, AMR) e il cronometro in reparto alzano l'agitazione; la Leadership del responsabile dell'Ingegneria la tiene giù (−1 per punto sopra 10 nei magazzini dove c'è un avvio).

## 6. Il welfare resta ai magazzini: il facility manager
- Le ricerche del Welfare restano nella linea della Direzione.
- Nei magazzini i servizi li installa il **facility manager**: senza facility manager non si installano (oggi si può).
- I servizi piccoli (sotto 5.000 €: acqua, frutta, caffè, corsi di italiano, sportello d'ascolto, lavanderia) partono subito, come oggi.
- Quelli grandi diventano **lavori del facility manager**, come le dotazioni: un cantiere alla volta per magazzino, produttività −5% durante i lavori, il servizio funziona appena finiti (niente apprendimento, come oggi). Settimane: sala pausa 3, mensa 8, pulmini 2, asilo 12, area cani 2, colonnine 3, spogliatoi 4, palestra 6, presidio medico 3, raffrescatori 3, orto 2.
- Costo e canone come oggi (con lo sconto della Piattaforma welfare).

## 7. Assistenza, affidabilità e guasti (reparto IT)
### Assistenza
Ogni sistema installato chiede assistenza: **1 persona ogni 5 sistemi**. Un sistema in un magazzino conta 1 (WMS e AMR contano 2); gestionale, EDI, portale ed e-commerce contano 2 per tutta l'azienda. Il CEO vale 0,3 persone («spegni e riaccendi»): una piccola azienda con un paio di sistemi non ha bisogno di nessuno. Il consulente a contratto vale mezza persona (§9).
Carico come gli altri reparti: verde fino all'85%, giallo fino al 100%, rosso oltre (problema aperto «Reparto IT in affanno»).

### Affidabilità dei sistemi
Una per l'azienda, da 0 a 100. Ogni giorno si avvicina all'obiettivo del 2% della differenza.
Obiettivo = 55 + 25 × copertura (persone in assistenza ÷ necessarie, al massimo 1,2) + 1,5 × (Precisione del responsabile IT − 10) + 1 × (Innovazione del direttore IT e ingegneria − 10) + 5 Sala server e backup + 5 Sicurezza informatica + 5 Server in cloud − 3 per ogni sistema obsoleto.

### Guasti informatici
Ogni mese, per ogni magazzino con sistemi: probabilità = (100 − affidabilità) / 400 × min(1; sistemi del magazzino / 3). Con affidabilità 60 circa un guasto all'anno per magazzino, con 85 uno ogni due anni.
Sono notifiche rosse, non eventi (non pesano sulla regola «un evento ogni 30-55 giorni»), come i guasti del capannone di oggi:

| Guasto | Quando può capitare | Effetto |
|---|---|---|
| WMS fermo | con il WMS | 1-3 giorni: produttività −40%, puntualità −4 |
| Terminali a terra | con barcode o radiofrequenza | 5 giorni: produttività −10%, accuratezza −1 |
| GPS muto | con il GPS | 7 giorni: puntualità −1, saturazione dei mezzi −3 |
| Luci spente | con il pick-to-light | 3 giorni: produttività −15% |
| Robot fermi | con gli AMR | 2 giorni: produttività −30% |
| EDI inceppato | con l'EDI | 5 giorni: i clienti che lo chiedono −1 di soddisfazione |

Con la copertura al completo i guasti durano la metà. Con l'assistenza del consulente ogni guasto costa un intervento (500-1.500 €) e dura un giorno in più. I due guasti grossi sono eventi veri (§13): il server allagato e il ransomware.

### Sistemi che invecchiano
Ogni sistema ha una vita: barcode e radiofrequenza 7 anni, pick-to-light, GPS, rotte, sinergia, portale ed e-commerce 8, WMS, gestionale, EDI e AMR 10. Dopo diventa **obsoleto**: affidabilità −3 e canone +30% (assistenza su una versione che non esiste più).
**Aggiornamento**: un progetto IT come un avvio, che costa il 30% dell'installazione (per i sistemi aziendali il 30% della ricerca), con metà della preparazione, apprendimento ×0,3 ed esito +10. Problema aperto giallo «Il WMS di Novara ha 10 anni»: si sceglie quando farlo, magari non a novembre.

## 8. Miglioramento continuo (Ingegneria)
Gli ingegneri nella colonna «Magazzini» fanno studi di tempi e metodi, rifanno i percorsi di prelievo, spostano gli articoli che escono di più vicino alle baie.
- Ogni magazzino ha un **bonus dei metodi** sulla produttività, da 0 a +6% (+10% con la ricerca Lean).
- Ogni ingegnere sui magazzini aggiunge +0,5 punti al mese, al magazzino che chi gioca segue (il gioco propone quello col bonus più basso).
- Un magazzino che nessuno segue perde 0,2 punti al mese: le vecchie abitudini tornano.
- Compare nella pagina Produttività della finestra del magazzino, come voce a sé.

## 9. I consulenti esterni (si parte da qui)
Come nella realtà, il primo passo non è assumere: si chiama un consulente. Si può usare in due modi.

**A contratto: il consulente fa da reparto.** Un canone al mese, disdetta con 30 giorni di preavviso, niente buonuscita. Un reparto ha al massimo un consulente a contratto, che:
- apre la linea di ricerca del reparto, come una persona sulla ricerca (×1,3), con la sua **bravura** al posto dell'Innovazione del responsabile;
- fa gli avvii al prezzo «a progetto», senza occupare nessuno;
- per l'IT, fa l'assistenza a chiamata: vale mezza persona, ma ogni guasto costa un intervento e dura un giorno in più.

Costa più di una persona interna e rende meno, ma arriva subito e si manda via quando si vuole. Quando il reparto interno cresce si disdice, oppure si tiene per i progetti grossi.

**A progetto.** Un solo avvio, anche avendo il reparto interno: non occupa nessuno, costa di più. L'assistenza dopo l'avvio resta all'IT interno («chi l'ha installato non risponde più al telefono»).

| Nome | Reparto | Canone al mese | Avvio a progetto | Bravura | Carattere |
|---|---|---|---|---|---|
| Software Nebbia S.r.l. (Lodi) | IT | 3.000 € | ×1,1 | 8 | costa poco, sparisce nella nebbia per settimane, la documentazione è un post-it |
| Gigabancale Solutions (Bologna) | IT | 5.000 € | ×1,4 | 14 | serio, manda sempre lo stesso tecnico, Ivano, che ormai conosce il cane del capoturno |
| Consulenti del Lunedì S.p.A. (Milano) | IT | 8.000 € | ×1,8, preparazione −30% | 12 | quattro neolaureati, slide bellissime e un socio che vedrai solo alla cena di fine progetto |
| Studio Ing. Paletti & Associati (Bergamo) | Ingegneria | 5.500 € | ×1,3 | 14 | layout e scaffalature, disegni a mano che sembrano quadri |
| Cronometrini Tempi & Metodi S.a.s. (Torino) | Ingegneria | 3.500 € | ×1 | 10 | arrivano col cronometro e la cartellina; bonus dei metodi +1 nel magazzino, morale −3 |
| Schiena Dritta Ergonomia (Padova) | Ingegneria | 4.000 € | ×1,2 | 11 | stretching alle 6 del mattino; morale +2 nel magazzino |

La bravura conta come l'abilità del responsabile: Innovazione per la ricerca, Precisione o Operazioni per gli avvii.

## 10. Ricerche nuove (solo col pacchetto)
Nessuna ha un anno minimo: servono solo le ricerche indicate.

| Ricerca | Reparto | Costo / settimane | Effetto |
|---|---|---|---|
| Edifici intelligenti (costruita nella 0.109) | Ingegneria | 40.000 € / 9 (serve la Struttura direzionale) | col direttore IT e ingegneria a Innovazione 14 apre affitto e costruzione dei capannoni innovativi |
| Sala server e backup | IT | 8.000 € / 3 | affidabilità +5; nei guasti e negli eventi i dati si recuperano dal backup di stanotte |
| Sicurezza informatica | IT | 25.000 € / 6, 300 €/mese (serve la Sala server) | affidabilità +5, ransomware −80%, truffa dell'IBAN smascherata; dopo l'evento del GDPR la chiedono FarmaSpa e le committenti S |
| Cruscotto dei KPI | IT | 30.000 € / 7 (serve il WMS) | previsione di puntualità e accuratezza a fine mese per ogni cliente, avviso 2 settimane prima di andare sotto soglia; gare +1 |
| Server in cloud | IT | 40.000 € / 8 (serve la Sicurezza) | canoni dei sistemi −15%, assistenza necessaria −30%, affidabilità +5 |
| Previsioni con l'intelligenza artificiale | IT | 60.000 € / 11 (servono cruscotto e cloud) | picchi dei clienti annunciati 4 settimane prima, effetto dei picchi sui reparti −30% |
| Studio tempi e metodi | Ingegneria | 6.000 € / 3 | miglioramento continuo +50% più veloce; sblocca la policy «Cronometro in reparto» |
| Ergonomia delle postazioni | Ingegneria, per magazzino | 10.000 € / 4; 12.000 €, 100 €/mese | morale +2, produttività +2% |
| Progettazione del layout | Ingegneria, per magazzino | 20.000 € / 5 (serve Tempi e metodi); 15.000 € | posti pallet +5%, produttività +3% |
| Lean e miglioramento continuo | Ingegneria | 35.000 € / 8 (serve il layout) | bonus dei metodi fino a +10%; sblocca la policy «Lean partecipata» |
| Esoscheletri | Ingegneria, per magazzino | 30.000 € / 6 (serve l'ergonomia); 60.000 €, 800 €/mese | morale +2, produttività +5% |
| Gemello digitale | misto (Ingegneria capofila) | 50.000 € / 10 (servono layout e cruscotto) | esito degli avvii +10, stabilizzazione dei traslochi −30%, cantieri −20% |

Le 11 nuove si possono tagliare (le prime da togliere: Server in cloud ed Esoscheletri). Ogni ricerca ha `desc`, `txt`, la sua icona e la sua voce nell'enciclopedia.

## 11. Policy
| Policy | Sblocco | Pro | Contro |
|---|---|---|---|
| Congelamento di fine anno | Sala server e backup | niente avvii nel picco; guasti −30% da novembre a metà gennaio | i progetti pronti aspettano fino al 15 gennaio |
| Reperibilità h24 | Sicurezza informatica | i guasti durano la metà | stipendi del reparto IT +15% |
| Cronometro in reparto | Studio tempi e metodi | miglioramento continuo ×1,5 | morale −3 (col pacchetto Relazioni industriali agitazione +5) |
| Lean partecipata | Lean e miglioramento continuo | morale +2, esito degli avvii dell'Ingegneria +10 | miglioramento continuo ×0,8 (si decide tutti insieme, ci vuole più tempo) |

## 12. Talenti nuovi
- **Ha il server in cantina** (misto): Innovazione +2, Amministrazione −1; da responsabile IT affidabilità +5. *«Il backup è una chiavetta che tiene nel portafoglio. Funziona, finché non va in lavatrice.»*
- **Cintura nera del Lean** (positivo): Operazioni +2; da responsabile dell'Ingegneria miglioramento continuo ×1,5. *«Ha appeso cinque cartelli 5S in mensa. Uno spiega dove va appeso il cartello.»*
- **Cronometro facile** (misto): Operazioni +2, Leadership −2; morale −2 nel magazzino che guida. *«Ha cronometrato anche la sua pausa caffè: 3 minuti e 12. Troppi.»*
- **Nemico delle password** (negativo): Innovazione −1, Precisione −1; da responsabile IT affidabilità −5. *«La password è il nome del gatto, su un post-it attaccato al monitor. Il gatto si chiama Password.»*

## 13. Eventi (circa 12, dentro la regola di uno ogni 30-55 giorni)
Due fonti nuove con la loro scenetta: **«Sala server»** (armadi con le lucine, cavi, una ventola che gira) e **«Ufficio tecnico»** (il layout del magazzino sul tavolo, caschi gialli, un cronometro). Come nel gioco base, gli eventi possono avere i loro anni.

1. **Il WMS si ferma il venerdì prima di Natale** (dicembre, con il WMS): carta e penna (accuratezza −3 per una settimana), tecnico del consulente in reperibilità (soldi), aspetti il sistemista (solo con qualcuno in assistenza: 1 giorno).
2. **Il server sotto la scala si è allagato** (con un'allerta meteo, senza Sala server): 2 giorni di magazzini al buio, oppure si paga il recupero dei dischi.
3. **Ransomware: i pallet sono in ostaggio** (dal 2016, più raro con la Sicurezza informatica): pagare il riscatto, ripristinare dal backup (con la Sala server: 1 giorno), ricostruire a mano (7 giorni, accuratezza −3).
4. **Il fornitore ha cambiato IBAN** (dal 2012): la mail sembra vera. Paghi, telefoni per verificare, oppure con la Sicurezza informatica il filtro l'ha già fermata.
5. **Arriva la fattura elettronica** (gennaio 2019, storico): con il gestionale si passa liscio; senza, consulente o due settimane di caos in amministrazione.
6. **Il Piano Industria 4.0** (2017, storico): per due anni le installazioni di automazione (radiofrequenza, pick-to-light, verticale, AMR) costano il 30% in meno.
7. **Arriva il GDPR** (maggio 2018, storico): registro dei trattamenti e informative; consulente della privacy oppure «ci pensa il reparto IT» (una persona ferma per 4 settimane). Da qui FarmaSpa e le committenti S chiedono la Sicurezza informatica.
8. **Il navigatore manda il bilico in Città Alta** (con il GPS): l'autista è incastrato tra le mura venete di Bergamo.
9. **Il robot numero 7 fissa la colonna** (con gli AMR): da tre giorni si ferma davanti alla colonna C14. I colleghi gli hanno dato un nome.
10. **Il neolaureato vuole rifare tutto il layout** (Ingegneria): lo lasci fare (2 settimane di produttività −5%, poi bonus dei metodi +2), lo freni (se ne va), progetto pilota in una corsia.
11. **Il sistemista se ne va in banca** (dal 2010): controfferta +20% o lo lasci andare, e trovarne un altro è lungo.
12. **Un concorrente è fermo per un attacco informatico** (dal 2016, opportunità): i suoi clienti ti chiamano.

Eventi di oggi che cambiano col pacchetto:
- **Il WMS si aggiorna da solo**: con qualcuno in assistenza arriva la terza risposta «Ci pensa il reparto IT» (gratis, un giorno).
- **Lo stagista ha cancellato il database**: con la Sala server e backup c'è «Ripristino dal backup di stanotte».

## 14. Gare, clienti, avversari, vittoria
- **Clienti**: dopo l'evento del GDPR, FarmaSpa e le committenti S chiedono la Sicurezza informatica nelle gare (nuovo requisito; i contratti in corso hanno i 180 giorni di grazia di oggi). Il Cruscotto dei KPI dà +1 in tutte le gare (si presentano i dati, non le promesse).
- **Avversari**: stesse regole, semplificate. Partono col consulente e assumono persone IT e Ingegneria in proporzione ai sistemi e ai magazzini; scelgono il big bang secondo lo stile (Prezzo e Spietato sì, Qualità no); subiscono guasti e ransomware.
- **Vittoria nuova «Magazzino 4.0»**: almeno 3 magazzini con WMS, radiofrequenza e AMR già appresi, affidabilità sopra 85 per 2 anni di fila e nessun avvio disastroso in quei 2 anni.
- **Cronaca di fine partita**: «Primo big bang andato liscio», «Addio al consulente: nasce il reparto IT», «1.000 giorni senza guasti informatici», «Il WMS più vecchio del Nord» (15 anni senza aggiornamenti).

## 15. Interfaccia
- **Finestra Tecnologia**: una scheda in più, **«Reparti tecnici»**, tra «Ricerca» e «Certificati e audit». Due riquadri (IT e Ingegneria, uno sotto l'altro sul telefono), ognuno con: responsabile e «Cambia», addetti con «Assumi» e «Licenzia», il consulente a contratto (scegli, disdici), la lavagna (avvii, ricerca, magazzini) con + e −, il carico verde/giallo/rosso. Per l'IT l'affidabilità con il suo grafico e i sistemi da aggiornare; per l'Ingegneria il bonus dei metodi magazzino per magazzino.
- **Scheda Ricerca**: in cima tre barre invece di una (Direzione, IT, Ingegneria); nell'albero ogni tecnologia ha un bollino del suo reparto (monitor per l'IT, casco giallo per l'Ingegneria).
- **Finestra del magazzino**: «Avvia il progetto» con graduale o big bang, squadra interna o consulente, e le probabilità dell'esito. Gli avvii in corso compaiono tra le tecnologie del magazzino, con le settimane che mancano. I servizi di welfare grandi compaiono come lavori del facility manager.
- **Finestra Direzione**: sei posti invece di cinque.
- **Mappa**: icona del cantiere informatico sul magazzino con un avvio, icona rossa durante un guasto. Lente «Digitalizzazione» facoltativa (province colorate per sistemi installati e anni dei sistemi).
- **Notifiche**: avvio liscio (verde), avvio difficile (giallo), guasto (rosso). Problemi aperti: reparto IT in affanno, ricerca di un reparto ferma, sistema da aggiornare.
- **Menu**: nessuna voce nuova; la riga di stato di Tecnologia diventa per esempio «2 ricerche · 1 avvio».
- **Scene nelle finestre**: la scheda «Reparti tecnici» ha la sala server in cima (ferma se non c'è nessuno al lavoro).
- Tutto provato anche sul telefono (layout `.mob`, screenshot `shot_tel_*`).

## 16. Una partita tipo
- **Primo anno**: si gioca come oggi. Il CEO studia barcode e regolamento nella linea della Direzione e spegne e riaccende il router.
- **Secondo anno**: per il WMS si firma un contratto con Software Nebbia: si apre la linea IT. L'avvio a Novara va «con qualche intoppo» e il consulente sparisce per tre settimane.
- **Quarto anno**: tre magazzini, i guasti aumentano. Si assumono due sistemisti e una responsabile IT con Precisione 14; Software Nebbia viene disdetta.
- **Sesto anno**: Studio Paletti a contratto apre la linea dell'Ingegneria; il magazzino verticale parte a Piacenza (Ingegneria capofila, IT di supporto). Poi il primo ingegnere interno, e il miglioramento continuo porta il magazzino più lento a +4%.
- **Decimo anno**: il WMS di Novara è obsoleto. Aggiornarlo a marzo costa poco; rimandarlo a novembre è una scommessa.
- Intanto un'avversaria si prende un ransomware, e i suoi clienti telefonano.

## 17. Bilanciamento: cosa misurare
Con `tools/bilanciamento.py` (partite di 12 anni, 4 aziende guidate dal computer, con e senza pacchetto):
- tecnologie ricercate a 12 anni: col pacchetto al massimo +30%;
- aziende sopravvissute: col pacchetto entro ±5 punti rispetto a senza;
- stipendi e canoni dei reparti in un'azienda media (3-4 magazzini): tra il 3% e il 6% dei ricavi;
- il consulente a contratto deve convenire nei primi anni, il reparto interno da 2-3 persone in su;
- guasti informatici con un reparto IT al completo: meno di uno all'anno per magazzino;
- avvii disastrosi: meno del 5% con la squadra interna e l'avvio graduale.

## 18. Da preparare oltre alle regole
- Voci `WIKI` (con `kw()`): reparto IT, ingegneria, linee di ricerca, lavagna del reparto, consulente esterno (a contratto e a progetto), bravura, direttore IT e ingegneria, avvio (go-live), graduale e big bang, esito dell'avvio, assistenza, affidabilità, guasti informatici, sistemi obsoleti e aggiornamento, miglioramento continuo e bonus dei metodi, lavori del welfare, ransomware.
- Icone in `tools/icone_pxl/`: 11 ricerche, 4 policy, 4 talenti, i due bollini dei reparti; loghi dei 6 consulenti in `tools/loghi_pxl/`; stemma del pacchetto `pk_<id>` in `tools/loghi_pxl/pacchetti.px.js`.
- Scene in `tools/scene_pxl/`: «Sala server» e «Ufficio tecnico».
- Nessun ritratto nuovo: responsabili, addetti e direttore sono manager e volti generici.
- Pacchetto nel passo «Pacchetti» (`PACKS`), di base spento finché non è bilanciato; vale solo per le partite nuove, quindi i vecchi salvataggi non vanno convertiti. Il tutorial resta senza pacchetti.
- Test: partita col pacchetto, un consulente a contratto, un avvio graduale e uno big bang, un guasto, la scheda «Reparti tecnici» e la Direzione con sei posti, sul computer e sul telefono.
- `design.md` e `CHANGELOG` al momento della costruzione.

## 19. Ordine di costruzione (proposta)
Un pezzo per versione, ognuno giocabile da solo:
1. **I reparti** (fatto nella 0.109): responsabile, addetti, consulente a contratto, divisione delle tecnologie, linee di ricerca, sesto direttore, capannoni innovativi. Scheda «Reparti tecnici». Per ora tutte le persone del reparto lavorano alla ricerca: la lavagna con le colonne Avvii e Magazzini arriva con i pezzi 2-4, quando quelle colonne avranno un lavoro da fare. Le avversarie usano solo i consulenti e non nominano direttori.
2. **Gli avvii** (fatto nella 0.110): preparazione, graduale e big bang, esito, consulente a progetto, eventi «Il go-live è andato storto» e «Nessuno usa la novità». Come previsto: la squadra interna occupa persone che intanto non fanno ricerca; il big bang c'è per le tecnologie informatiche, il magazzino verticale e i robot. Le avversarie installano ancora con un clic. Gli eventi usano per ora le scene che esistono già (l'ufficio tecnologie e il magazzino): la «Sala server» e l'«Ufficio tecnico» arrivano col pezzo degli eventi.
3. **L'IT che tiene in piedi** (fatto nella 0.111): assistenza, affidabilità, guasti, sistemi che invecchiano e aggiornamenti, più le tre ricerche dell'IT che toccano l'affidabilità (Sala server e backup, Sicurezza informatica, Server in cloud; gli altri effetti della Sicurezza arrivano con gli eventi). Ritocchi rispetto al progetto: una persona ogni **6** punti di sistema (non 5) e il CEO vale **0,5** (non 0,3), così con un paio di sistemi non serve nessuno e Marco, col suo sistemista sull'assistenza, non parte «in affanno»; la lavagna dell'IT tiene il numero di persone sull'assistenza (+ e −), i nuovi assunti vanno sulla ricerca; se nel reparto nessuno lavora alla ricerca le sue tecnologie passano alla Direzione. Il magazzino verticale non conta come sistema (lo segue il facility manager). L'icona del guasto sulla mappa arriva col pezzo del contorno. Le avversarie mettono sull'assistenza chi serve, assumono sistemisti e aggiornano subito i sistemi vecchi.
4. **L'Ingegneria in magazzino e il welfare al facility manager**: miglioramento continuo, lavori del welfare, collegamenti con traslochi e cantieri, ricerche nuove.
5. **Il contorno**: policy, talenti, eventi, vittoria, cronaca.
6. **Bilanciamento** e pacchetto acceso di base.

## 20. Le date nel gioco base (deciso, fatto nella versione 0.107)
Davide: «lascia solo gli eventi con gli anni». Quindi:
- **Tolti** gli anni d'arrivo che non sono eventi: i 4 capannoni nuovi (Castel San Giovanni, Calderara, Landriano, Vigasio), la classe innovativa nelle costruzioni, pannelli solari e LED, i 12 manager e dirigenti della «nuova generazione». Sono tutti disponibili dal primo giorno; Andrew «Smilzo» Goodheart passa a 23 anni (nel 2002 ne avrebbe avuti 16).
- **Restano** gli anni degli eventi e degli appuntamenti del mondo: gli eventi con un anno minimo (Black Friday dal 2015, TikTok dal 2020…), quelli storici (euro, Olimpiadi, crisi, Expo, lockdown, caro gasolio), l'ordinanza sui capannoni, l'incentivo del solare 2007-2012, i rinnovi del contratto nazionale, il gasolio che sale.

// Elementi degli esterni dei magazzini: nove scene trasparenti (el_*) che il gioco mette sopra l'esterno del magazzino
// quando il magazzino ha quella dotazione (EST_EL in src/game.html). Fuori dall'elemento tutto resta trasparente.
// Si disegna su 160×72, ma il gioco mostra solo le colonne x 8..151 (le 8 a sinistra e le 8 a destra si tagliano):
// tutto quello che conta sta lì dentro.
// Ognuno sta nella sua zona della pianta comune agli esterni (capannone in x 24..135, y 6..55, terreno 56..71):
//   el_giardino   SINISTRA            x 8..23,   y 18..71   l'orto aziendale
//   el_cani       DAVANTI a sinistra  x 24..59,  y 58..71   l'area cani
//   el_colonnine  DESTRA              x 136..151, y 30..71  la colonnina di ricarica
//   el_muletti    DAVANTI al centro   x 60..103, y 58..71   la zona di ricarica dei muletti
//   el_pulmino    DAVANTI a destra    x 104..135, y 56..71  il pulmino dei dipendenti
//   el_cantiere   gru sopra il tetto  x 100..151, y 0..55   (a destra di x 135 solo sopra y 30: sotto ci sono le colonnine)
// Tre zone hanno un'alternativa (il gioco ne mostra una sola per zona): la dotazione vince sul servizio del welfare.
//   el_mensa      DESTRA              x 136..151, y 30..71  la mensa esterna, al posto delle colonnine (la palazzina
//                                                           continua oltre il bordo; il fumo sale nel cielo fino a y 17)
//   el_parcheggio DAVANTI a sinistra  x 24..59,  y 58..71   il parcheggio dei camion, al posto dell'area cani
//   el_piazzale   DAVANTI a destra    x 104..135, y 56..71  il piazzale esterno con la tettoia, al posto del pulmino
// Sopra gli elementi delle zone il gioco mette ancora, in quest'ordine:
//   el_portineria in basso a sinistra x 8..20,  y 46..71   la guardiola e la sbarra (sopra il giardino; la sbarra abbassata
//                                                           sporge fino a x 28 nelle righe del terreno)
//   el_led        due lampioni        x 22..26 e 134..138, y 28..71   l'illuminazione a LED, sopra a tutto (i pali in
//                                                           x 23..25 e 135..137: mensa, colonnine e sbarra li evitano)
// Le scene prova_elementi e prova_elementi2 (fuori dal gioco) le mettono tutte insieme sopra un esterno finto, per vedere
// che non si pestano: la prima coi servizi del welfare, la seconda con mensa, parcheggio e piazzale; prova_elementi3 come
// la seconda più portineria e lampioni, nell'ordine del gioco.
// Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html). Colori e omini in comune.px.js.
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

const MONDO = { light: [-0.6, -1] }          // la luce viene dall'alto a sinistra
const onda = (c, n = 1) => Math.sin(c.phase * Math.PI * 2 * n)   // va e viene in un giro di 16 fotogrammi

// ================================================================ GIARDINO (x 8..23, y 18..71)
// L'orto aziendale in 16 colonne: il tiglio dietro, il cassone rialzato coi pomodori sulle canne e l'insalata, la collega
// che nella pausa pranzo annaffia i tulipani (l'acqua scende, i fiori ondeggiano col vento), davanti la panchina.

// il prato dell'orto
sprite("gia_prato", { w: 16, h: 16 }, rect(0, 0, 16, 16, "G"), hline(0, 0, 16, "g"))
// il tiglio: tronco che si allarga al piede, rami che salgono nella chioma. La chioma è un mucchio di ciuffi, prima quelli
// in basso: ognuno scuro sotto, medio nel corpo, chiaro sul cappello verso il sole (in alto a sinistra)
const CHIOMA = [[3, 12, 3], [10, 12, 3], [7, 12, 3], [3, 8, 3], [10, 8, 3], [7, 7, 3], [4, 3, 3], [9, 3, 3]]
sprite("gia_albero", { w: 14, h: 34, outline: "K", pivot: "bottom" },
  rect(2, 15, 3, 19, "N"), vline(4, 15, 19, "M"), px(1, 33, "N"), px(5, 33, "M"),
  line(2, 18, 0, 15, "N"), line(4, 17, 7, 14, "M"),
  ...CHIOMA.map(([x, y, r]) => [circ(x, y, r, "g"), circ(x - 1, y - 1, r - 1, "G"),
    clip((px, py) => (px - x) + 1.2 * (py - y) < -r * 0.7, circ(x - 1, y - 1, r - 1, "h"))]).flat())
// la panchina vista di fronte: due assi di schienale, la seduta, le gambe di ferro
sprite("gia_panchina", { w: 7, h: 7, outline: "K", pivot: "bottom" },
  hline(0, 0, 7, "k"), hline(0, 1, 7, "N"), hline(0, 3, 7, "k"), hline(0, 4, 7, "M"),
  vline(1, 2, 1, "d"), vline(5, 2, 1, "d"), vline(1, 5, 2, "d"), vline(5, 5, 2, "d"))
// il cassone rialzato: i pomodori sulle canne a sinistra (rossi, uno ancora verde), il cespo d'insalata a destra
sprite("gia_cassone", { w: 9, h: 14, outline: "K", pivot: "bottom" },
  ...[1, 4].map((x) => vline(x, 0, 10, "k")),
  ...[[1, 2], [4, 1]].map(([x, y]) => [rect(x - 1, y, 3, 8, "G"), hline(x - 1, y, 3, "h"), px(x + 1, y + 1, "g"), vline(x + 1, y + 4, 4, "g")]).flat(),
  px(0, 5, "R"), px(2, 7, "R"), px(3, 4, "R"), px(5, 6, "R"), px(0, 4, "e"), px(3, 3, "e"),
  rect(6, 6, 3, 3, "h"), px(6, 6, "_"), px(8, 6, "_"), hline(6, 8, 3, "G"), px(7, 7, "W"),
  rect(0, 9, 9, 5, "N"), hline(0, 9, 9, "m"), hline(0, 10, 9, "k"), hline(0, 13, 9, "M"), vline(4, 11, 2, "M"))
// l'aiuola dei tulipani davanti: tre steli che ondeggiano col vento (16 fotogrammi)
anim("gia_tulipani", { w: 8, h: 6, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  ...[[1, 1, "Y", "i"], [4, 0, "P", "l"], [7, 1, "R", "e"]].map(([x, y, k, l]) =>
    [vline(x, y + 2, 4 - y, "g"), rect(x - 1, y, 2, 2, k), px(x - 1, y, l), px(x, y + 1, k)]).flat(),
  px(2, 3, "G"), px(5, 3, "G"),
  hline(0, 5, 8, "m"),
  (c) => c.warp((x, y) => [Math.round(onda(c) * (4 - y) / 3), 0], [0, 0, 8, 5]))
// la collega che annaffia: il braccio giù, l'annaffiatoio arancione inclinato in mano, la cipolla sopra i tulipani
persona("_ortolana", { testa: "lunghi", swap: { M: "N" } })
sprite("gia_ortolana", { w: 14, h: 20, outline: "K" },
  stamp("__ortolana"),
  rect(10, 15, 3, 3, "O"), hline(10, 15, 3, "a"), hline(10, 17, 3, "o"),          // il bidoncino
  px(10, 14, "o"), px(11, 13, "o"), px(12, 14, "o"),                               // il manico, nella mano
  px(13, 16, "O"), px(13, 17, "o"))                                                 // il becco e la cipolla
// l'acqua che scende dalla cipolla dell'annaffiatoio: gocce che cadono a due a due (4 fotogrammi)
anim("gia_acqua", { w: 2, h: 3, frames: LOOP, fps: FPS },
  (c) => { for (let y = 0; y < 3; y++) c.px((y + c.frame) % 2, y, (y + c.frame) % 4 < 2 ? "B" : "L") })

function elGiardino() {
  return [
    layer("giardino_prato", stamp("gia_prato", 8, 56)),
    layer("giardino",
      stamp("gia_albero", 16, 54),
      stamp("gia_cassone", 18, 54),
      stamp("gia_ortolana", 8, 46),
      stamp("gia_panchina", 12, 72),
      stamp("gia_tulipani", 19, 72)),
    layer("giardino_acqua", stamp("gia_acqua", 22, 65))]
}

// ================================================================ AREA CANI (x 24..59, y 58..71)
// Il recinto con la staccionata di legno, il prato, il cane che scodinzola e ogni tanto beve dalla ciotola,
// il cartello con l'impronta sul paletto d'angolo.

// il prato del recinto, visto un po' dall'alto: più stretto dietro, ombreggiato sotto la staccionata
sprite("can_prato", { w: 36, h: 10 }, poly([2, 0, 33, 0, 35, 9, 0, 9], "G"), hline(2, 0, 32, "g"), hline(1, 1, 34, "g"))
// la staccionata di dietro: paletti e due traverse di legno
sprite("can_staccionata", { w: 32, h: 6, outline: "K", pivot: "bottom" },
  hline(0, 1, 32, "k"), hline(0, 3, 32, "N"),
  ...[0, 8, 16, 24, 31].map((x) => [vline(x, 0, 6, "N"), px(x, 0, "k")]).flat())
// un lato del recinto: il paletto d'angolo davanti e le traverse che tornano verso la staccionata (dx: quello di destra)
function lato(nome, dx) {
  const X = (x) => (dx ? 3 - x : x)
  sprite(nome, { w: 4, h: 13, outline: "K", pivot: "bottom" },
    (c) => { c.line(X(3), 1, X(0), 7, "k"); c.line(X(3), 3, X(0), 9, "N"); c.vline(X(0), 6, 7, "N"); c.px(X(0), 6, "k") })
}
lato("can_lato_sx", false)
lato("can_lato_dx", true)
// la ciotola rossa con l'acqua
sprite("can_ciotola", { w: 6, h: 2, outline: "K", pivot: "bottom" }, rect(0, 0, 6, 2, "R"), hline(1, 0, 4, "B"), px(1, 0, "L"), hline(0, 1, 6, "r"))
// il cartello con l'impronta, inchiodato al paletto d'angolo
sprite("can_cartello", { w: 7, h: 7, outline: "K", pivot: "bottom" },
  rect(0, 0, 7, 7, "W"), vline(6, 0, 7, "S"), hline(0, 6, 7, "S"),
  grid(1, 1, ".K.K.\nK...K\n..K..\n.KKK.\n.KKK."))
// il cane bianco con la macchia marrone, di profilo col muso a sinistra: scodinzola (2 fotogrammi) e ogni giro
// abbassa la testa nella ciotola per bere (16 fotogrammi)
const CANE_TESTA = "...NN\n.WWWN\nWWKWW\nKWWWW\n.WWWS"
anim("can_cane", { w: 16, h: 11, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  grid(4, 4, [
    "RWWWNNNWWW..",
    "RWWWWNNWWWW.",
    ".WWWWWWWWWS.",
    ".WWSSSSSSWS.",
    ".WS....SWS..",
    ".WS....SW...",
    ".WS....SW..."].join("\n")),
  (c) => {
    const giu = c.frame >= 10 && c.frame < 15
    c.grid(giu ? 0 : 1, giu ? 4 : 0, CANE_TESTA)
    if (!giu && c.frame % 4 < 2) c.px(2, 4, "e")                               // la lingua di fuori
    if (c.frame % 2) c.line(14, 4, 15, 2, "W"); else c.line(14, 5, 15, 4, "S")   // la coda
  })

function elCani() {
  return [
    layer("cani_prato", stamp("can_prato", 24, 62)),
    layer("cani_recinto", stamp("can_staccionata", 42, 66), stamp("can_lato_sx", 27, 72), stamp("can_lato_dx", 57, 72)),
    layer("cani", { sort: "y" },
      stamp("can_ciotola", 38, 71),
      stamp("can_cane", 46, 71)),
    layer("cani_cartello", stamp("can_cartello", 28, 67))]
}

// ================================================================ COLONNINE (x 136..151, y 30..71)
// La pensilina a sbalzo coi pannelli solari, la colonnina di ricarica, l'utilitaria elettrica attaccata al cavo che scende
// davanti alla colonnina (non più a sinistra di x 138: in x 135..137 può esserci il palo del lampione a LED);
// la luce di ricarica pulsa e la barra della batteria si riempie (16 fotogrammi).

// la piazzola d'asfalto con la riga verde del posto auto elettrico
sprite("col_piazzola", { w: 16, h: 14 }, rect(0, 0, 16, 14, "D"), hline(0, 0, 16, "d"), hline(1, 12, 14, "G"), vline(1, 6, 6, "G"), vline(14, 6, 6, "G"))
// la pensilina fotovoltaica a sbalzo: i pannelli inclinati verso il sole, la trave, il pilastro solo, il cartello verde col
// fulmine appeso alla trave sopra la colonnina
sprite("col_pensilina", { w: 14, h: 30, outline: "K", pivot: "bottom" },
  rect(0, 0, 14, 3, "b"), ...[4, 9].map((x) => vline(x, 0, 3, "B")), hline(0, 1, 14, "B"), hline(1, 0, 2, "L"), px(1, 2, "B"),
  hline(0, 3, 14, "S"), hline(0, 4, 14, "s"),
  vline(11, 5, 25, "S"), vline(12, 5, 25, "s"),
  rect(2, 5, 6, 7, "G"), vline(7, 5, 7, "g"), hline(2, 11, 6, "g"), grid(3, 5, "..WW\n.WW.\nWWWW\n.WW.\nWW..\nW..."))
const LUCE = ["g", "g", "G", "G", "h", "h", "W", "W", "h", "h", "G", "G", "g", "g", "g", "g"]   // la luce verde che pulsa
// la colonnina bianca: testa col colore dell'azienda, schermo, presa, la striscia di luce che pulsa;
// sullo schermo la batteria si riempie (16 fotogrammi)
anim("col_colonnina", { w: 6, h: 17, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 0, 6, 17, "W"), vline(5, 0, 17, "S"), hline(0, 16, 6, "S"), hline(0, 0, 6, "T"), hline(0, 1, 6, "t"),
  rect(1, 3, 3, 3, "d"), rect(1, 9, 2, 3, "s"), px(1, 9, "S"),
  (c) => { c.vline(4, 3, 10, LUCE[c.frame]); c.vline(2, 5 - Math.floor(c.frame / 4), Math.floor(c.frame / 4) + 1, "h"); c.px(2, 10, "K") })
// l'utilitaria elettrica, corta e tonda, col muso a destra; la presa di ricarica dietro, con la sua luce che pulsa
anim("col_auto", { w: 12, h: 10, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  poly([2, 4, 3, 0, 8, 0, 11, 4], "R"), hline(3, 0, 5, "e"),
  poly([4, 4, 4, 1, 5, 1, 5, 4], "L"), poly([6, 4, 6, 1, 8, 1, 10, 4], "L"), px(4, 1, "W"), px(6, 1, "W"),
  rect(0, 4, 12, 4, "R"), hline(1, 4, 10, "e"), px(0, 4, "_"), px(11, 4, "_"), hline(0, 7, 12, "r"), vline(11, 5, 2, "r"),
  px(6, 5, "r"), px(11, 5, "i"),
  rect(1, 7, 3, 3, "K"), px(2, 8, "s"), rect(8, 7, 3, 3, "K"), px(9, 8, "s"),
  (c) => { c.rect(0, 5, 2, 2, "d"); c.px(1, 5, LUCE[c.frame]) })

function elColonnine() {
  return [
    layer("colonnine_piazzola", stamp("col_piazzola", 136, 58)),
    layer("colonnine",
      stamp("col_pensilina", 144, 62),
      stamp("col_colonnina", 141, 62),
      stamp("col_auto", 145, 71)),
    // il cavo: dalla presa della colonnina giù fino alla presa dell'auto, con la sua pancia
    layer("colonnine_cavo", px(140, 56, "K"), vline(139, 57, 7, "K"))]
}

// ================================================================ ZONA MULETTI (x 60..103, y 58..71)
// La piazzola di ricarica a strisce gialle e nere, due muletti parcheggiati attaccati al caricabatterie:
// le spie lampeggiano, le tacche della carica salgono (16 fotogrammi), il cartello «P».

// la piazzola vista un po' dall'alto: il bordo a strisce gialle e nere in diagonale, i lati obliqui
sprite("mul_strisce", { w: 44, h: 8 },
  (c) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 44; x++) {
    const bordo = y < 2 || y > 5 || x - (7 - y) / 2 < 3 || x + (7 - y) / 2 > 40
    if (bordo && x >= (7 - y) / 2 && x <= 43 - (7 - y) / 2) c.px(x, y, Math.floor((x + y) / 2) % 2 ? "K" : "Y")
  } })
// la luce in alto a sinistra sui colori piatti: il bordo in alto e a sinistra si schiarisce, quello in basso e a destra si scurisce
// (serve ai disegni che hanno anche il verso specchiato: si disegna piatto, poi si illumina)
function illumina(c, base, chiaro, scuro, x0 = 0, y0 = 0, w = c.w, h = c.h) {
  const fuori = (x, y) => !c.is(x, y, base + chiaro + scuro), su = [], giu = []
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (c.is(x, y, base)) {
    if (chiaro && (fuori(x, y - 1) || fuori(x - 1, y))) su.push([x, y])
    else if (scuro && (fuori(x, y + 1) || fuori(x + 1, y))) giu.push([x, y])
  }
  su.forEach(([x, y]) => c.px(x, y, chiaro)); giu.forEach(([x, y]) => c.px(x, y, scuro))
}

// il muletto piccolo, parcheggiato a forche giù: montante davanti, tettuccio a gabbia sopra il sedile, contrappeso dietro.
// sx: forche a sinistra. Si disegna piatto e poi si illumina, così la luce resta in alto a sinistra in tutti e due i versi.
const MULETTO = [
  "....KKKK.KKKooKKK...",
  "....KSsK.KjjjjjjK...",
  "....KSsK.KjKKKKjK...",
  "....KSsK.KjK.KKjKKK.",
  "....KSsK.KjK.KdYYYYK",
  "....KSsKKKjKKKdYYYYK",
  "....KSsKYYYYYYYYYYYK",
  "....KSsKYYYYYYYYYYYK",
  "KKKKKSsKYYYYYYYYYYYK",
  "KssssssKYYKKYYYKKYYK",
  "KKKKKKKKyKsKKyyKsKKK",
  "........KKKKKKKKKKKK",
  "..........KK....KK.."]
function muletto(nome, sx) {
  const righe = sx ? MULETTO : MULETTO.map((r) => [...r].reverse().map((k) => ({ S: "s", s: "S" })[k] || k).join(""))
  const X = (x) => (sx ? x : 19 - x)
  anim(nome, { w: 20, h: 13, frames: LOOP, fps: FPS, pivot: "bottom" },
    grid(0, 0, righe.join("\n")),
    (c) => illumina(c, "Y", "i", "y", 0, 0, 20, 9),
    (c) => { c.px(X(10), 10, "s"); c.px(X(16), 10, "s") },
    (c) => c.px(X(17), 5, c.frame % 4 < 2 ? "h" : "G"))              // la spia della carica che lampeggia
}
muletto("mul_muletto", true)
muletto("mul_muletto_dx", false)
// il caricabatterie col cartello blu della P in cima: sotto, due barre di tacche (una per muletto) che si riempiono (16 fotogrammi)
anim("mul_colonnina", { w: 6, h: 11, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 0, 6, 7, "B"), vline(5, 0, 7, "b"), hline(0, 6, 6, "b"), hline(0, 0, 5, "L"), grid(1, 1, "WWW\nW.W\nWWW\nW..\nW.."),
  rect(0, 7, 6, 4, "S"), vline(5, 7, 4, "s"), hline(0, 10, 6, "s"), rect(1, 8, 4, 2, "d"),
  (c) => { const n = Math.floor(c.frame / 4); c.hline(1, 8, n + 1, "h"); c.hline(1, 9, ((n + 2) % 4) + 1, "h") })

function elMuletti() {
  return [
    layer("muletti_strisce", stamp("mul_strisce", 60, 64)),
    layer("muletti", stamp("mul_colonnina", 82, 71), stamp("mul_muletto", 70, 71), stamp("mul_muletto_dx", 94, 71)),
    // i cavi della ricarica, dal caricabatterie ai contrappesi
    layer("muletti_cavi", line(79, 66, 77, 64, "K"), line(84, 66, 86, 64, "K"))]
}

// ================================================================ PULMINO (x 104..135, y 56..71)
// Il pulmino dei dipendenti per il turno delle sei: le frecce lampeggiano, l'autista aspetta,
// un collega in fondo dorme già (la testa cala piano e si rialza di scatto), l'ultimo sale dalla porta scorrevole.

anim("pul_pulmino", { w: 30, h: 13, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 1, 25, 9, "W"), hline(1, 0, 23, "W"), poly([24, 0, 25, 0, 29, 5, 29, 9, 24, 9], "W"),   // cassone alto e muso corto
  vline(29, 6, 3, "S"), hline(0, 9, 30, "S"),
  rect(0, 6, 30, 2, "T"), hline(0, 7, 30, "t"),                                                   // la fascia col colore dell'azienda
  rect(2, 2, 5, 3, "L"), rect(17, 2, 5, 3, "L"), poly([23, 2, 25, 2, 28, 5, 23, 5], "L"), px(17, 2, "W"), px(23, 2, "W"),
  rect(24, 3, 2, 2, "F"), hline(24, 2, 2, "M"), px(25, 3, "K"),                                  // l'autista
  rect(9, 1, 6, 9, "d"), hline(9, 9, 6, "D"), vline(15, 1, 9, "S"),                              // la porta scorrevole aperta, il gradino
  rect(10, 2, 3, 3, "M"), hline(10, 2, 3, "N"), rect(9, 5, 5, 3, "Y"), vline(9, 5, 3, "i"), hline(9, 7, 5, "y"),   // chi sale, di spalle
  rect(10, 8, 2, 2, "D"), rect(12, 8, 2, 1, "D"),
  px(29, 5, "i"), hline(0, 8, 2, "r"),
  ...[3, 21].map((x) => grid(x, 8, ".KKK.\nKsssK\nKsSsK\nKsssK\n.KKK.")),                     // le ruote coi cerchioni
  // il collega che dorme in fondo: la testa cala piano e si rialza di scatto (16 fotogrammi)
  (c) => { const giu = c.frame < 12 ? Math.floor(c.frame / 6) : 0; c.rect(3, 3 + giu, 3, 2, "F"); c.hline(3, 2 + giu, 3, "K"); c.px(3, 4 + giu, "f") },
  // le quattro frecce (8 fotogrammi)
  (c) => { const on = c.frame % 8 < 4; c.px(0, 6, on ? "Y" : "o"); c.px(29, 6, on ? "Y" : "o") })

function elPulmino() {
  return [
    layer("pulmino_ombra", hline(106, 71, 28, "d")),
    layer("pulmino", stamp("pul_pulmino", 120, 71))]
}

// ================================================================ CANTIERE (x 100..151, y 0..55)
// La gru gialla dell'ampliamento: torre a traliccio davanti alla parte destra del capannone, braccio sopra il tetto e il cielo
// (finisce a x 150, dentro il taglio del gioco), contrappeso di cemento; il carrello col gancio che oscilla col carico di travi
// (16 fotogrammi), la luce rossa in cima. Giù in basso le transenne bianche e rosse col lampeggiante e il cartello LAVORI.

sprite("gru_torre", { w: 5, h: 46, outline: "K", pivot: "bottom" },
  vline(0, 0, 46, "Y"), vline(4, 0, 46, "y"),
  (c) => { for (let y = 0, k = 0; y < 46; y += 4, k++) c.line(k % 2 ? 3 : 1, y, k % 2 ? 1 : 3, y + 3, "Y") })
sprite("gru_braccio", { w: 50, h: 13, outline: "K" },
  // il braccio verso destra: traliccio a triangoli
  hline(16, 5, 34, "Y"), hline(16, 7, 34, "y"),
  (c) => { for (let x = 16; x < 49; x += 4) { c.px(x + 1, 6, "Y"); c.px(x + 3, 6, "y") } },
  // il controbraccio con i blocchi di cemento
  hline(0, 5, 12, "Y"), hline(0, 7, 12, "y"), rect(0, 8, 6, 4, "S"), hline(0, 8, 6, "W"), vline(5, 9, 3, "s"), hline(0, 10, 6, "s"),
  // la punta della torre e i tiranti
  poly([12, 4, 14, 0, 16, 4], "Y"), line(14, 1, 35, 5, "s"), line(14, 1, 1, 5, "s"),
  // la cabina del gruista
  rect(16, 8, 5, 4, "W"), rect(17, 9, 3, 2, "L"), vline(20, 8, 4, "S"))
// il carico appeso: il cavo dal carrello, il gancio, le travi rosse; oscilla come un pendolo (16 fotogrammi)
anim("gru_carico", { w: 18, h: 16, frames: LOOP, fps: FPS, pivot: [9, 0] },
  (c) => {
    const dx = Math.round(onda(c) * 2), x = 9 + dx
    c.rect(7, 0, 5, 2, "d")                                         // il carrello sotto il braccio
    c.line(9, 2, x, 5, "K")                                          // il cavo
    c.rect(x - 1, 5, 2, 2, "s"); c.px(x, 7, "K")                     // il gancio
    c.line(x, 7, x - 4, 11, "K"); c.line(x, 7, x + 4, 11, "K")       // le funi
    c.rect(x - 5, 12, 11, 3, "R"); c.hline(x - 5, 12, 11, "e"); c.hline(x - 5, 14, 11, "r"); c.box(x - 6, 11, 13, 5, "K")
  })
// la luce rossa in cima alla gru
anim("gru_luce", { w: 1, h: 1, frames: LOOP, fps: FPS }, (c) => c.px(0, 0, c.frame % 8 < 2 ? "R" : "r"))
// la transenna bianca e rossa sui piedi
sprite("gru_transenna", { w: 12, h: 7, outline: "K", pivot: "bottom" },
  (c) => { for (let x = 0; x < 12; x++) { c.px(x, 0, Math.floor(x / 2) % 2 ? "W" : "R"); c.px(x, 1, Math.floor(x / 2) % 2 ? "S" : "r") } },
  vline(1, 2, 5, "s"), vline(10, 2, 5, "s"), hline(0, 6, 3, "d"), hline(9, 6, 3, "d"))
anim("gru_lampeggiante", { w: 3, h: 3, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  (c) => { const on = c.frame % 4 < 2; c.rect(0, 0, 3, 2, on ? "Y" : "y"); if (on) c.px(1, 0, "i"); c.hline(0, 2, 3, "d") })
// il cartello giallo dei lavori
sprite("gru_cartello", { w: 27, h: 11, outline: "K", pivot: "bottom" },
  rect(0, 0, 27, 7, "Y"), hline(0, 6, 27, "y"), text(2, 1, "LAVORI", "K"), vline(3, 7, 4, "s"), vline(23, 7, 4, "s"))

function elCantiere() {
  return [
    layer("cantiere_gru",
      stamp("gru_torre", 115, 56),
      stamp("gru_braccio", 100, -1),
      stamp("gru_carico", 143, 7),
      stamp("gru_luce", 114, 0)),
    layer("cantiere_terra", { sort: "y" },
      rect(110, 52, 9, 3, "s"),                                     // il plinto di cemento della torre
      stamp("gru_cartello", 117, 51),
      stamp("gru_transenna", 107, 56), stamp("gru_transenna", 128, 56),
      stamp("gru_lampeggiante", 133, 48))]
}

// ================================================================ MENSA (x 136..151, y 30..71), al posto delle colonnine
// La mensa esterna: a destra la palazzina bassa (continua oltre il bordo) con l'insegna della forchetta e del coltello sul tetto,
// la tenda e la vetrata; dietro l'insegna spunta il comignolo della cucina, che fuma (16 fotogrammi). Davanti
// il dehors sulla pedana di legno: il tavolino con l'ombrellone e un magazziniere in pausa che beve il caffè.

// la pedana di legno del dehors, rialzata: le assi, il bordo davanti
sprite("men_pedana", { w: 14, h: 11, outline: "K" },
  rect(0, 0, 14, 11, "k"), ...[0, 3, 6].map((y) => hline(0, y, 14, "N")), rect(0, 9, 14, 2, "N"), hline(0, 10, 14, "M"))
// la palazzina: il parapetto, la fascia col colore dell'azienda, la tenda a strisce col bordo a festoni, la vetrata col riflesso
// del cielo e le lampade accese dentro, lo zoccolo
sprite("men_palazzina", { w: 12, h: 14, outline: "K" },
  rect(0, 0, 12, 14, "C"), hline(0, 0, 12, "W"), hline(0, 1, 12, "S"), hline(0, 2, 12, "s"), hline(0, 3, 12, "T"),
  (c) => { for (let x = 0; x < 12; x++) { const k = Math.floor(x / 2) % 2 ? "W" : "T"; c.vline(x, 4, 2, k); if (x % 2 === 0) c.px(x, 6, k) } },
  rect(0, 7, 12, 6, "L"), hline(0, 7, 12, "s"), ...[0, 4, 8].map((x) => vline(x, 7, 6, "s")), hline(0, 12, 12, "s"),
  line(1, 9, 2, 8, "W"), line(9, 9, 10, 8, "W"), px(6, 8, "K"), px(6, 9, "i"), px(11, 8, "K"), px(11, 9, "i"),
  hline(0, 13, 12, "z"))
// l'insegna sul tetto: la forchetta e il coltello bianchi sul cartello rosso
sprite("men_insegna", { w: 10, h: 9, outline: "K" },
  rect(0, 0, 10, 9, "R"), hline(0, 8, 10, "r"),
  grid(1, 1, ["W.W.W..W", "W.W.W.WW", "WWWWW.WW", ".WWW..WW", "..W....W", "..W....W", "..W....W"].join("\n")))
// il comignolo della cucina, d'acciaio, col cappello e la fascetta: sale dal tetto dietro l'insegna (il gioco può mettere
// il lampione a LED di destra in x 134..138, quindi camino e fumo stanno più a destra)
sprite("men_camino", { w: 4, h: 7, outline: "K" },
  hline(0, 0, 4, "s"), hline(0, 1, 4, "S"), rect(1, 2, 2, 5, "S"), vline(2, 2, 5, "s"), hline(1, 4, 2, "d"))
// il fumo della cucina: sbuffi che salgono e piegano col vento verso destra (16 fotogrammi)
// quattro sbuffi in fila: escono piccoli e bianchi, crescono, ingrigiscono e si sfilacciano
anim("men_fumo", { w: 8, h: 7, frames: LOOP, fps: FPS }, (c) => {
  for (const o of [0, 4, 8, 12]) {
    const t = (c.frame + o) % 16, x = Math.round(1 + t * 0.25), y = Math.round(6 - t * 0.3)
    if (t < 3) c.px(x, y, "W")
    else if (t < 8) { c.hline(x, y - 1, 2, "W"); c.hline(x, y, 2, "S") }
    else if (t < 13) { c.hline(x, y - 1, 2, "S"); c.hline(x, y, 3, "S"); c.px(x - 1, y, "j") }
    else { c.px(x + 1, y - 1, "S"); c.px(x, y, "j"); c.px(x + 2, y, "j") }
  }
})
// l'ombrellone a spicchi bianchi e rossi col pomolo in cima, l'asta che scende nel tavolino
sprite("men_ombrellone", { w: 11, h: 18, outline: "K", pivot: "bottom" },
  poly([3, 1, 7, 1, 10, 4, 0, 4], "R"), hline(4, 0, 3, "R"),
  (c) => { for (let y = 0; y < 5; y++) for (let x = 0; x < 11; x++) if (c.is(x, y, "R") && Math.floor((x + 1) / 3) % 2) c.px(x, y, "W") },
  hline(0, 4, 11, "r"), (c) => { for (let x = 1; x < 11; x += 3) c.px(x, 4, "W") },
  vline(5, 5, 13, "S"))
// il magazziniere in pausa, seduto, col gilet giallo
persona("_commensale", { corpo: "seduto", abito: "gilet", swap: { B: "Y", b: "y", M: "N" } })
// ogni tanto sbatte le palpebre (16 fotogrammi)
anim("men_commensale", { w: 10, h: 16, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  stamp("__commensale"), (c) => { if (c.frame === 13 || c.frame === 14) { c.px(3, 5, "F"); c.px(6, 5, "F") } })
// il tavolino con la tovaglia a quadretti bianchi e rossi che scende fin quasi alla pedana
sprite("men_tavolino", { w: 11, h: 7, outline: "K", pivot: "bottom" },
  hline(0, 0, 11, "W"), hline(0, 1, 11, "S"),
  (c) => { for (let y = 2; y < 7; y++) for (let x = 0; x < 11; x++) c.px(x, y, (Math.floor(x / 2) + Math.floor((y - 2) / 2)) % 2 ? "W" : "R") },
  hline(0, 6, 11, "r"), (c) => { for (let x = 1; x < 11; x += 2) if (c.is(x, 6, "r")) c.px(x, 6, "S") })
// la tazzina del caffè
sprite("men_tazzina", { w: 3, h: 2, outline: "K", pivot: "bottom" }, hline(0, 0, 3, "m"), hline(0, 1, 3, "W"))
// il vapore del caffè: un filo che sale ondeggiando (8 fotogrammi)
anim("men_vapore", { w: 3, h: 4, frames: LOOP, fps: FPS },
  (c) => { const t = c.frame % 8; if (t < 6) c.px(1 + [0, 1, 1, 0, -1, -1][t], 3 - Math.floor(t * 2 / 3), t < 3 ? "W" : "S") })

function elMensa() {
  return [
    layer("mensa",
      stamp("men_camino", 141, 23),
      stamp("men_palazzina", 140, 40),
      stamp("men_insegna", 140, 30)),
    layer("mensa_fumo", { unlit: true }, stamp("men_fumo", 141, 16)),
    layer("mensa_dehors",
      stamp("men_pedana", 136, 59),
      stamp("men_ombrellone", 143, 64),
      stamp("men_commensale", 143, 69),
      stamp("men_tavolino", 143, 70),
      stamp("men_tazzina", 147, 63)),
    layer("mensa_vapore", { unlit: true }, stamp("men_vapore", 146, 57))]
}

// ================================================================ PARCHEGGIO DEI CAMION (x 24..59, y 58..71), al posto dell'area cani
// Il parcheggio recintato dei camion: la motrice parcheggiata di muso tra le strisce bianche, il posto libero accanto, la rete
// coi paletti, il lampione col cartello blu della P. In cabina l'autista dorme (le Z salgono, 16 fotogrammi), le quattro frecce
// accese (8 fotogrammi), la lampada del lampione che ogni tanto sfarfalla.

// il piazzale d'asfalto coi posti tracciati in bianco, un po' dall'alto (le righe si aprono verso di noi)
sprite("par_piazzola", { w: 36, h: 14 }, rect(0, 0, 36, 14, "D"), hline(0, 0, 36, "d"), line(7, 3, 6, 13, "W"), line(27, 3, 28, 13, "W"),
  ellipse(32, 10, 2, 1, "d"), px(30, 9, "d"))                                            // la macchia d'olio sul posto libero
// la rete di recinzione dietro: i paletti, il tubo in cima, il filo teso più in basso
sprite("par_rete", { w: 36, h: 4 },
  hline(0, 0, 36, "s"), hline(0, 2, 36, "j"), ...[0, 7, 14, 21, 28, 35].map((x) => [vline(x, 0, 4, "s"), px(x, 0, "S"), px(x, 3, "d")]).flat())
// la motrice vista di muso: lo spoiler sul tetto, il parabrezza, la calandra, i fari, il paraurti, le gomme, gli specchi sui bracci.
// In cabina l'autista dorme con la testa sul finestrino; le quattro frecce lampeggiano (8 fotogrammi)
const MOTRICE = [
  ".....eeeeeee.....",
  "....RRRRRRRRR....",
  "...eeeeeeeeeee...",
  "...RdddddddddR...",
  "...RLLLLLLLLLR...",
  "...RLLLLLLLLLR...",
  "...RLLLLLLLLLR...",
  "...RsdsdsWsdsR...",
  "...RdsdsdsdsdR...",
  "...OYRRRRRRRYO...",
  "...ddddddddddd...",
  "....KKK...KKK...."]
anim("par_motrice", { w: 17, h: 12, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  grid(0, 0, MOTRICE.join("\n")),
  line(4, 6, 6, 4, "W"),                                                                  // il riflesso sul parabrezza
  hline(9, 4, 3, "N"), rect(9, 5, 2, 2, "F"), px(11, 5, "N"), px(9, 5, "f"), px(8, 6, "G"),   // l'autista che dorme, la testa sul finestrino
  layer("specchi", { outline: false }, vline(0, 4, 4, "K"), px(1, 5, "K"), vline(16, 4, 4, "K"), px(15, 5, "K"), px(0, 5, "j"), px(16, 5, "j")),
  (c) => { const on = c.frame % 8 < 4; c.px(3, 9, on ? "a" : "o"); c.px(13, 9, on ? "a" : "o") })
// le Z dell'autista che dorme: escono dal finestrino e salgono, prima piccole poi grandi (16 fotogrammi)
anim("par_zeta", { w: 8, h: 8, frames: LOOP, fps: FPS }, (c) => {
  for (const o of [0, 8]) {
    const t = (c.frame + o) % 16; if (t >= 12) continue
    const big = t >= 6, x = Math.floor(t / 3), y = 7 - Math.floor(t / 2) - (big ? 3 : 2)
    c.grid(x, y, big ? "WWWW\n..W.\n.W..\nWWWW" : "WWW\n.W.\nWWW")
  }
})
// il lampione del parcheggio: il braccio con la lampada, il cartello blu della P sul palo; la lampada ogni tanto sfarfalla
const LAMPADA = "1111111111101111"
anim("par_lampione", { w: 7, h: 12, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  vline(0, 0, 12, "s"), hline(0, 0, 7, "S"), hline(3, 1, 4, "s"), hline(0, 11, 2, "s"),
  rect(2, 3, 5, 7, "B"), hline(2, 3, 5, "L"), hline(2, 9, 5, "b"), grid(3, 4, "WWW\nW.W\nWWW\nW..\nW.."),
  (c) => { const on = LAMPADA[c.frame] === "1"; c.hline(3, 1, 4, on ? "i" : "s"); if (on) c.px(5, 1, "W") })

function elParcheggio() {
  return [
    layer("parcheggio_piazzola", stamp("par_piazzola", 24, 58)),
    layer("parcheggio_rete", stamp("par_rete", 24, 58)),
    layer("parcheggio", stamp("par_motrice", 42, 72), stamp("par_lampione", 28, 72)),
    layer("parcheggio_zeta", { unlit: true }, stamp("par_zeta", 53, 58))]
}

// ================================================================ PIAZZALE ESTERNO (x 104..135, y 56..71), al posto del pulmino
// Il piazzale coperto: la tettoia di lamiera col colore dell'azienda sui pilastri d'acciaio, sotto la pila di pallet vuoti;
// davanti una pila coperta dal telone blu legato male (l'angolo sbatte col vento, 16 fotogrammi), il cassone verde dei rifiuti
// col cartone e il legno che spuntano.

// l'ombra sotto la tettoia
sprite("pia_ombra", { w: 16, h: 11 }, rect(0, 0, 16, 11, "d"), hline(0, 10, 16, "D"))
// la tettoia: la lamiera grecata vista di testa (le onde), la grondaia, i due pilastri con la fascia gialla e nera in basso
sprite("pia_tettoia", { w: 18, h: 14, outline: "K", pivot: "bottom" },
  rect(0, 0, 18, 2, "T"), (c) => { for (let x = 0; x < 18; x += 2) c.px(x, 0, "u") }, hline(0, 2, 18, "t"),
  vline(1, 3, 11, "S"), vline(16, 3, 11, "S"), ...[1, 16].map((x) => [px(x, 10, "Y"), px(x, 11, "K"), px(x, 12, "Y")]).flat())
// una pila di pallet vuoti (2 righe l'uno: le assi, i blocchetti)
function pila(nome, n) {
  sprite(nome, { w: 10, h: 2 * n, outline: "K", pivot: "bottom" },
    ...Array.from({ length: n }, (_, i) => [hline(0, 2 * i, 10, "k"), grid(0, 2 * i + 1, "NN..NN..NN")]).flat(), hline(0, 0, 10, "q"))
}
pila("pia_pila5", 5)
// il telone blu sopra una pila di pallet: le pieghe, la corda, l'angolo libero che si alza e sbatte (16 fotogrammi)
const RAFFICA = [0, 0, 1, 2, 3, 3, 2, 1, 0, 0, 0, 1, 2, 1, 0, 0]
anim("pia_telone", { w: 11, h: 9, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  c.rect(0, 3, 11, 5, "B"); c.hline(0, 3, 11, "L"); c.vline(4, 4, 4, "b"); c.vline(8, 4, 4, "b"); c.hline(0, 7, 11, "b")
  c.hline(0, 5, 11, "N")                                                                    // la corda
  c.hline(0, 8, 11, "k"); c.grid(0, 8, "N..NN..N.NN".replace(/\./g, "."))                  // i pallet che spuntano sotto
  const a = RAFFICA[c.frame]                                                                // l'angolo libero in alto a destra
  if (a) { c.poly([7, 3, 10, 3 - a, 10, 3], "L"); c.line(7, 3, 10, 3 - a, "B") }
})
// il cassone dei rifiuti: verde, la testata inclinata, le costole, il cartone e il legno che spuntano
sprite("pia_cassone", { w: 12, h: 9, outline: "K", pivot: "bottom" },
  rect(2, 0, 4, 2, "k"), hline(2, 0, 4, "q"), rect(7, 0, 3, 2, "N"), hline(7, 0, 3, "k"),
  poly([0, 2, 11, 2, 11, 7, 2, 7], "G"), hline(0, 2, 12, "h"), ...[4, 7, 10].map((x) => vline(x, 3, 4, "g")),
  hline(1, 7, 11, "d"), rect(2, 8, 2, 1, "K"), rect(9, 8, 2, 1, "K"))

function elPiazzale() {
  return [
    layer("piazzale_ombra", stamp("pia_ombra", 106, 60)),
    layer("piazzale", { sort: "y" },
      stamp("pia_tettoia", 114, 72),
      stamp("pia_pila5", 111, 71),
      stamp("pia_telone", 122, 72),
      stamp("pia_cassone", 129, 70))]
}

// ================================================================ PORTINERIA (x 8..20, y 46..71; la sbarra fino a x 28), sopra il giardino
// La guardiola dell'ingresso sull'isola di cemento col bordo a strisce gialle e nere: il portiere col berretto e i baffi al
// finestrino; accanto la sbarra bianca e rossa che si alza, resta su e si riabbassa (16 fotogrammi), il lampeggiante
// arancione acceso mentre si muove, e il portiere che la guarda passare. Da giù la sbarra sporge di qualche pixel a destra,
// sopra il bordo della zona davanti a sinistra (resta nelle righe del terreno); su, sta tutta a sinistra di x 24.

// la guardiola: la soletta del tetto col colore dell'azienda, le pareti bianche (ombra a destra e sotto il tetto), il
// finestrino col portiere, il davanzale dello sportello e il citofono per gli autisti
anim("por_guardiola", { w: 11, h: 21, frames: LOOP, fps: FPS, outline: "K" },
  rect(0, 0, 11, 3, "T"), hline(0, 0, 11, "S"), hline(0, 2, 11, "t"),
  rect(0, 3, 10, 18, "W"), vline(9, 3, 18, "S"), hline(0, 3, 10, "S"),
  rect(0, 5, 9, 9, "s"), rect(1, 6, 7, 7, "L"), px(1, 7, "W"), px(1, 8, "W"),
  grid(1, 6, [".Ddddd.", "DdddYdd", ".KKKKK.", ".FFFFf.", ".FMMMf.", "..FFf..", "ddWRWdd"].join("\n")),
  hline(0, 14, 10, "s"), hline(1, 15, 8, "S"), vline(9, 14, 2, "s"),
  rect(2, 17, 3, 2, "d"), px(2, 17, "s"),
  // gli occhi: guarda avanti, sbatte le palpebre, poi segue la sbarra a destra finché non è giù
  (c) => {
    const f = c.frame
    if (f === 2) return
    const dx = f >= 4 && f <= 14 ? 1 : 0
    c.px(2 + dx, 9, "K"); c.px(4 + dx, 9, "K")
  })
// la sbarra: la cassetta del motore bianca col lampeggiante in cima, l'asta a fasce bianche e rosse di 2 pixel (spessa 2,
// la punta rossa) imperniata in alto sulla cassetta. Angolo per fotogramma: giù, sale, resta su, scende (16 fotogrammi).
// Perno e lunghezza scelti perché l'asta, a ogni angolo, stia sotto la riga 56 o a sinistra di x 24, e da giù finisca a x 27
// (il palo del lampione a LED, x 23..25, ne copre un pezzo: le fasce corte fanno vedere il bianco e il rosso ai due lati).
const SBARRA = [0, 0, 0, 0, 8, 25, 50, 75, 90, 90, 90, 90, 68, 42, 18, 4]
anim("por_sbarra", { w: 11, h: 15, frames: LOOP, fps: FPS, outline: "K" },
  rect(0, 9, 3, 6, "W"), vline(2, 9, 6, "S"), hline(0, 12, 3, "T"), hline(0, 14, 3, "s"),
  (c) => {
    const a = SBARRA[c.frame] * Math.PI / 180, co = Math.cos(a), si = Math.sin(a), L = 8
    for (let y = 0; y < 12; y++) for (let x = 0; x < 11; x++) {
      const dx = x - 1, dy = y - 10, t = dx * co - dy * si, s = dx * si + dy * co
      if (t >= -0.5 && t <= L && s >= -0.5 && s < 1.5) c.px(x, y, Math.floor((t + 0.5) / 2) % 2 ? "W" : "R")
    }
    c.px(1, 10, "s")                                                            // il perno
    c.px(0, 8, c.frame >= 4 && c.frame % 2 === 0 ? "a" : "o")                  // il lampeggiante
  })
// l'isola spartitraffico: il piano di cemento e il bordo a strisce gialle e nere
sprite("por_isola", { w: 13, h: 4, outline: "K" },
  hline(0, 0, 13, "S"),
  (c) => { for (let y = 1; y < 4; y++) for (let x = 0; x < 13; x++) c.px(x, y, Math.floor((x + y) / 2) % 2 ? "K" : "Y") })

function elPortineria() {
  return [
    layer("portineria",
      stamp("por_guardiola", 8, 46),
      stamp("por_sbarra", 17, 52),
      stamp("por_isola", 8, 67))]
}

// ================================================================ LAMPIONI A LED (x 22..26 e 134..138, y 28..71), sopra a tutto
// Due lampioni sottili a testa-palo, uno per lato del capannone: il palo d'acciaio, il basamento di cemento, la testa piatta
// col LED bianco sotto che fa un piccolo alone; l'alone pulsa piano e una falena gira attorno alla luce (16 fotogrammi).
// Disegnati a mano (contorno compreso) per restare larghi 5 pixel: sopra gli elementi coprono solo la colonna del palo.

const ALONE = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0]          // quanto è grande l'alone (16 fotogrammi)
function lampioneLed(nome, verso) {
  anim(nome, { w: 5, h: 44, frames: LOOP, fps: FPS }, (c) => {
    c.vline(1, 4, 37, "K"); c.vline(2, 4, 37, "s"); c.vline(3, 4, 37, "K")                 // il palo (righe 32..68)
    c.rect(1, 41, 3, 3, "s"); c.px(1, 41, "S"); c.vline(0, 41, 3, "K"); c.vline(4, 41, 3, "K")   // il basamento
    c.hline(1, 1, 3, "K"); c.px(0, 2, "K"); c.px(4, 2, "K"); c.px(0, 3, "K"); c.px(4, 3, "K")   // la testa: contorno
    c.px(1, 2, "S"); c.hline(2, 2, 2, "s"); c.hline(1, 3, 3, "W")                             // il cappello, il LED sotto
    // l'alone: sotto la testa ai due lati del palo e, quando è pieno, anche sopra gli angoli
    const n = ALONE[c.frame]
    c.px(2, 4, n ? "W" : "S")
    c.px(0, 4, n ? "W" : "L"); c.px(4, 4, n ? "W" : "L")
    if (n) { c.px(0, 5, "L"); c.px(4, 5, "L") }
    if (n > 1) { c.px(0, 1, "L"); c.px(4, 1, "L"); c.px(0, 6, "L"); c.px(4, 6, "L") }
    // la falena: un giro attorno alla testa (verso = 1 orario, -1 antiorario); dietro la testa non si vede
    const th = verso * c.phase * Math.PI * 2, x = Math.round(2 + 2.2 * Math.cos(th)), y = Math.round(3 + 3 * Math.sin(th))
    if (!(y >= 1 && y <= 3 && Math.sin(th) < 0)) c.px(x, y, "z")
  })
}
lampioneLed("led_lampione_sx", 1)
lampioneLed("led_lampione_dx", -1)

function elLed() {
  return [layer("led", { unlit: true }, stamp("led_lampione_sx", 22, 28), stamp("led_lampione_dx", 134, 28))]
}

// ================================================================ le scene
scene("el_giardino", { w: SW, h: SH, world: MONDO }, ...elGiardino())
scene("el_cani", { w: SW, h: SH, world: MONDO }, ...elCani())
scene("el_colonnine", { w: SW, h: SH, world: MONDO }, ...elColonnine())
scene("el_muletti", { w: SW, h: SH, world: MONDO }, ...elMuletti())
scene("el_pulmino", { w: SW, h: SH, world: MONDO }, ...elPulmino())
scene("el_cantiere", { w: SW, h: SH, world: MONDO }, ...elCantiere())
scene("el_mensa", { w: SW, h: SH, world: MONDO }, ...elMensa())
scene("el_parcheggio", { w: SW, h: SH, world: MONDO }, ...elParcheggio())
scene("el_piazzale", { w: SW, h: SH, world: MONDO }, ...elPiazzale())
scene("el_portineria", { w: SW, h: SH, world: MONDO }, ...elPortineria())
scene("el_led", { w: SW, h: SH, world: MONDO }, ...elLed())

// ================================================================ prova (fuori dal gioco)
// un esterno finto semplice nel riquadro della pianta, con tutti gli elementi sopra
function esternoFinto() {
  return [
    ellipse(14, 5, 8, 2, "W"), ellipse(150, 12, 9, 2, "W"),
    rect(24, 6, 112, 50, "S"), ...Array.from({ length: 13 }, (_, i) => vline(28 + i * 8, 11, 45, "s")),
    rect(24, 6, 112, 1, "K"), rect(24, 7, 112, 4, "T"), hline(24, 10, 112, "t"),
    ...[44, 92].map((x) => [rect(x, 24, 26, 32, "j"), ...[28, 32, 36, 40, 44, 48, 52].map((y) => hline(x, y, 26, "s")), box(x - 1, 23, 28, 33, "D")]).flat(),
    rect(0, 56, SW, 16, "D"), hline(0, 56, SW, "d")]
}
scene("prova_elementi", { w: SW, h: SH, bg: "L", world: MONDO },
  layer("esterno", ...esternoFinto()),
  ...elCantiere(), ...elGiardino(), ...elColonnine(), ...elCani(), ...elMuletti(), ...elPulmino())
// la versione con tutte le dotazioni: mensa, parcheggio dei camion e piazzale esterno al posto di colonnine, area cani e pulmino
scene("prova_elementi2", { w: SW, h: SH, bg: "L", world: MONDO },
  layer("esterno", ...esternoFinto()),
  ...elCantiere(), ...elGiardino(), ...elMensa(), ...elParcheggio(), ...elMuletti(), ...elPiazzale())
// tutto insieme nell'ordine del gioco: elementi delle zone (gru per ultima), poi la portineria, poi i lampioni a LED
scene("prova_elementi3", { w: SW, h: SH, bg: "L", world: MONDO },
  layer("esterno", ...esternoFinto()),
  ...elGiardino(), ...elMensa(), ...elParcheggio(), ...elMuletti(), ...elPiazzale(), ...elCantiere(), ...elPortineria(), ...elLed())

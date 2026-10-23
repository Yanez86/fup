// Scenette per la cima delle finestre (non per gli eventi): customer service, consiglio d'amministrazione, ufficio del direttore,
// certificati e audit.
// Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html). Colori e omini in comune.px.js.
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

// teste con la cuffia del call center: archetto in cima, padiglioni scuri ai lati
TESTE.cuffia = [
  "..KKK",
  ".KMMM",
  "KMMMM",
  "dMFFF",
  "dFFFF",
  "dFFKF",
  "FFFKF",
  "fFFFF",
  ".fFFf",
  "..fff"]
TESTE.cuffia_lunghi = [
  "..KKK",
  ".KMMM",
  "KMMMM",
  "dMMFF",
  "dMFFF",
  "dFFKF",
  "MFFKF",
  "MfFFF",
  "MMfFf",
  "MM.ff"]

// il fumo di una tazza: due riccioli che salgono ondeggiando
anim("_fumo", { w: 5, h: 9, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  const SWAY = [0, 1, 1, 0, -1, -1, 0, 1]
  for (const o of [0, 4]) {
    const t = (c.frame + o) % 8; if (t > 5) continue
    const x = 2 + SWAY[t], y = 7 - t
    c.px(x, y, t < 3 ? "W" : "S"); if (t < 4) c.px(x, y + 1, "S")
  }
})
// la città dalla finestra: palazzi, finestre accese, la gru di un cantiere
sprite("_citta", { w: 64, h: 34 },
  rect(0, 0, 64, 34, "L"), rect(0, 0, 64, 5, "B"), ellipse(14, 8, 6, 1, "W"), ellipse(46, 6, 8, 1, "W"),
  ...[[0, 18, 9, "j"], [9, 12, 8, "s"], [17, 20, 7, "D"], [24, 8, 9, "S"], [33, 15, 8, "j"], [41, 22, 6, "D"], [47, 11, 9, "s"], [56, 17, 8, "j"]]
    .map(([x, y, w, k]) => [rect(x, y, w, 34 - y, k), ...Array.from({ length: Math.floor((34 - y - 2) / 3) }, (_, r) =>
      Array.from({ length: Math.floor((w - 1) / 3) }, (_, q) => px(x + 1 + q * 3, y + 2 + r * 3, (x * 7 + r * 5 + q * 3) % 4 === 0 ? "Y" : "L"))).flat()]).flat(),
  vline(29, 2, 7, "O"), hline(22, 2, 16, "O"), vline(36, 2, 4, "K"), rect(35, 6, 3, 2, "K"), px(29, 1, "R"))

// ================================================================ CUSTOMER SERVICE
// Il call center: quattro postazioni con la cuffia, chi parla e chi ascolta a turno, i telefoni che lampeggiano,
// il tabellone delle chiamate in coda col numero che cambia, la bacheca dei post-it e la tazza del numero uno.

// operatori e operatrici: la bocca si apre a turno, il microfono dall'auricolare alla bocca
const PARLA = ["1010011010000110", "0000110101100101", "0110000010110100", "1101000001101010"]
function operatore(nome, testa, swap, k) {
  persona("_" + nome, { testa, corpo: "seduto", swap })
  anim(nome, { w: 10, h: 16, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__" + nome),
    px(9, 6, "K"), px(8, 7, "K"), px(7, 8, "d"),
    (c) => { if (PARLA[k][c.frame] === "1") { c.px(4, 8, "K"); c.px(5, 8, "r") } })
}
operatore("op_a", "cuffia_lunghi", { B: "O", b: "o", M: "M" }, 0)
operatore("op_b", "cuffia", { B: "B", b: "b", M: "K", F: "c", f: "x" }, 1)
operatore("op_c", "cuffia_lunghi", { B: "P", b: "p", M: "K" }, 2)
operatore("op_d", "cuffia", { B: "G", b: "g", M: "y" }, 3)
// il monitor piatto con la scheda del cliente
sprite("monitor_cs", { w: 12, h: 12, outline: "K", pivot: "bottom" },
  rect(0, 0, 12, 8, "d"), rect(1, 1, 10, 6, "B"), hline(2, 2, 6, "L"), hline(2, 4, 8, "L"), hline(2, 6, 5, "W"), px(9, 2, "R"),
  rect(5, 8, 2, 2, "s"), rect(3, 10, 6, 2, "s"), hline(3, 10, 6, "S"))
// il telefono con la lucina della linea che lampeggia
anim("tel_cs", { w: 8, h: 4, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 0, 8, 4, "D"), hline(0, 0, 8, "j"), rect(1, 2, 5, 1, "d"),
  (c) => c.px(6, 1, c.frame % 4 < 2 ? "h" : "g"))
anim("tel_cs2", { base: "tel_cs" }, (c) => c.px(7, 1, (c.frame + 1) % 8 < 4 ? "R" : "r"))
// la tazza del numero uno
sprite("tazza_n1", { outline: "K", pivot: "bottom" }, `
  mmmmm..
  WWWWWS.
  WWWWW.S
  WWWWWS.
  SSSSS..`, px(1, 2, "R"), px(3, 2, "R"), px(1, 3, "R"), px(2, 2, "R"), px(3, 3, "R"))
// il tabellone delle chiamate in coda: il numero sale e scende, la luce rossa lampeggia quando sono tante
const CODA = ["12", "12", "13", "13", "15", "15", "17", "17", "16", "16", "14", "14", "11", "11", "12", "12"]
anim("tabellone", { w: 40, h: 18, frames: LOOP, fps: FPS, outline: "K" },
  rect(0, 0, 40, 18, "d"), box(1, 1, 38, 16, "D"), text(4, 3, "IN CODA", "S"),
  (c) => { c.text(15, 10, CODA[c.frame], "Y"); if (+CODA[c.frame] >= 15 && c.frame % 2 === 0) { c.rect(32, 10, 3, 3, "R"); c.px(32, 10, "e") } else c.rect(32, 10, 3, 3, "r") })
// la bacheca di sughero coi post-it
sprite("bacheca", { w: 32, h: 22, outline: "K" }, rect(0, 0, 32, 22, "N"), box(0, 0, 32, 22, "M"), rect(1, 1, 30, 20, "k"),
  ...[[3, 3, "Y"], [11, 4, "e"], [20, 2, "h"], [5, 12, "L"], [14, 12, "Y"], [23, 11, "e"]].map(([x, y, k]) => [rect(x, y, 6, 6, k), hline(x + 1, y + 2, 4, "s"), hline(x + 1, y + 4, 3, "s"), px(x + 3, y, "R")]).flat())
// il manifesto col sorriso («sorridi: si sente anche al telefono»)
sprite("manifesto", { w: 18, h: 22, outline: "K" }, rect(0, 0, 18, 22, "W"), circ(9, 9, 6, "Y"), ring(9, 9, 6, "y"),
  px(7, 7, "K"), px(11, 7, "K"), px(6, 10, "K"), px(12, 10, "K"), hline(7, 11, 5, "K"), rect(3, 17, 12, 1, "B"), rect(5, 19, 8, 1, "B"))
// l'orologio da muro
sprite("orologio_cs", { w: 11, h: 11, outline: "K" }, circ(5, 5, 5, "W"), ring(5, 5, 5, "S"), px(5, 1, "K"), px(9, 5, "K"), px(5, 9, "K"), px(1, 5, "K"),
  vline(5, 2, 4, "K"), hline(5, 5, 3, "K"), px(5, 5, "R"))
// i pannelli divisori tra le postazioni
sprite("divisorio", { w: 4, h: 20, outline: "K", pivot: "bottom" }, rect(0, 0, 4, 20, "T"), vline(3, 0, 20, "t"), hline(0, 0, 4, "u"))
// la scrivania lunga delle postazioni
sprite("bancone", { w: 160, h: 16, pivot: "bottom" }, rect(0, 0, 160, 3, "S"), hline(0, 0, 160, "W"), hline(0, 3, 160, "K"),
  rect(0, 4, 160, 9, "j"), hline(0, 12, 160, "s"), ...[2, 40, 80, 120, 156].map((x) => rect(x, 13, 2, 3, "d")),
  ...[6, 46, 86, 126].map((x) => [box(x, 5, 28, 7, "s"), hline(x + 1, 6, 26, "S")]).flat())
// sotto le postazioni: il cestino con le carte appallottolate e lo zaino di chi fa il turno lungo
sprite("cestino", { outline: "K", pivot: "bottom" }, `
  .W.WW.
  sSSSSs
  sSssSs
  sSSSSs
  .ssss.`)
sprite("zaino", { outline: "K", pivot: "bottom" }, `
  .RRRR.
  RrRRrR
  RRRRRR
  RYYYYR
  RRRRRR
  .rrrr.`)

scene("customer", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "B"), hline(0, 3, SW, "b"),
    stamp("bacheca", 8, 7), stamp("tabellone", 60, 6), stamp("manifesto", 116, 6), stamp("orologio_cs", 142, 9),
    rect(0, 56, SW, 16, "D"), ...[59, 63, 68].map((y) => hline(0, y, SW, "d"))),
  layer("postazioni",
    ...[40, 80, 120].map((x) => stamp("divisorio", x, 49)),
    stamp("op_a", 15, 50), stamp("op_b", 55, 50), stamp("op_c", 95, 50), stamp("op_d", 135, 50),
    stamp("bancone", 80, 64),
    ...[30, 70, 110, 150].map((x) => stamp("monitor_cs", x, 49)),
    stamp("tel_cs", 7, 49), stamp("tel_cs2", 47, 49), stamp("tel_cs", 87, 49, { delay: 250 }), stamp("tel_cs2", 127, 49, { delay: 500 }),
    stamp("tazza_n1", 98, 49), stamp("_fumo", 97, 44)),
  layer("pavimento", stamp("cestino", 37, 70), stamp("zaino", 116, 70)),
)

// ================================================================ CONSIGLIO D'AMMINISTRAZIONE
// La sala del consiglio: legno scuro, il ritratto del fondatore, la finestra sulla città. Il presidente a capotavola,
// i consiglieri in giacca, quello che presenta col puntatore, il grafico che sale sullo schermo, e uno che si appisola.

persona("_presidente", { testa: "calvo", corpo: "seduto", abito: "completo", swap: { B: "K", b: "d", M: "W", R: "y" } })
persona("_cons_a", { testa: "lunghi", corpo: "seduto", abito: "completo", swap: { B: "D", b: "d", M: "K", R: "W" } })
persona("_cons_b", { testa: "corti", corpo: "seduto", abito: "completo", swap: { B: "d", b: "K", M: "S", R: "b" } })
persona("_cons_c", { testa: "corti", corpo: "seduto", abito: "completo", swap: { B: "D", b: "d", M: "M", R: "G" } })
carrozzina("_relatore", { testa: "corti", abito: "completo", swap: { B: "b", b: "d", M: "m", F: "c", f: "x" } })
sprite("presidente", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__presidente"))
sprite("cons_a", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__cons_a"))
// il consigliere che si appisola: occhi chiusi, bocca aperta
sprite("cons_b", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__cons_b"), px(3, 5, "F"), px(6, 5, "F"), px(4, 8, "K"), px(5, 8, "K"))
sprite("cons_c", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__cons_c"))
// la Z che sale dal consigliere addormentato, tre alla volta, sfasate
anim("zzz", { w: 14, h: 18, frames: LOOP, fps: FPS }, (c) => {
  for (const o of [0, 6, 11]) {
    const t = (c.frame + o) % 16; if (t > 11) continue
    c.text(Math.floor(t / 2), 13 - t, "Z", t < 8 ? "W" : "S")
  }
})
// chi presenta, in carrozzina: il braccio alzato col puntatore che batte sul grafico
anim("relatore", { w: 34, h: 40, fps: FPS, outline: "K", pivot: [10, 40] }, stamp("__relatore", 0, 17),
  frame({ hold: 4 }, line(16, 23, 32, 1, "N"), rect(14, 24, 2, 4, "b"), px(15, 23, "F")),
  frame({ hold: 4 }, line(16, 23, 33, 4, "N"), rect(14, 24, 2, 4, "b"), px(15, 23, "F")))
// lo schermo del proiettore: la linea del fatturato che si disegna e sale, poi la freccia
const CURVA = [[4, 24], [8, 22], [12, 23], [16, 19], [20, 20], [24, 16], [28, 14], [32, 15], [36, 10], [40, 6]]
anim("schermo", { w: 46, h: 32, frames: LOOP, fps: FPS },
  rect(0, 0, 46, 2, "K"), rect(1, 2, 44, 28, "W"), box(1, 2, 44, 28, "S"), vline(3, 4, 23, "D"), hline(3, 26, 40, "D"),
  ...[8, 14, 20].map((y) => hline(4, y, 38, "S")),
  (c) => {
    const n = Math.min(CURVA.length - 1, Math.floor(c.frame * 0.8))
    for (let i = 0; i < n; i++) c.line(CURVA[i][0], CURVA[i][1], CURVA[i + 1][0], CURVA[i + 1][1], "G")
    if (n === CURVA.length - 1) { c.px(41, 5, "G"); c.px(40, 4, "G"); c.px(41, 4, "G"); c.px(42, 4, "G"); c.px(41, 3, "g") }
  },
  vline(22, 30, 2, "s"))
// il ritratto del fondatore, in cornice d'oro
sprite("ritratto", { w: 14, h: 18, outline: "K" }, rect(0, 0, 14, 18, "q"), box(0, 0, 14, 18, "y"), rect(2, 2, 10, 14, "t"),
  rect(4, 5, 6, 6, "F"), hline(4, 4, 6, "S"), px(4, 5, "S"), px(9, 5, "S"), px(5, 7, "K"), px(8, 7, "K"), hline(5, 9, 4, "S"),
  rect(3, 11, 8, 5, "K"), px(6, 11, "W"), px(7, 11, "W"), px(7, 12, "R"))
// il quadro di paesaggio (la pianura, ovviamente)
sprite("quadro", { w: 20, h: 14, outline: "K" }, rect(0, 0, 20, 14, "q"), box(0, 0, 20, 14, "y"), rect(2, 2, 16, 10, "L"),
  rect(2, 8, 16, 4, "h"), hline(2, 8, 16, "G"), ...[5, 9, 14].map((x) => [vline(x, 4, 4, "G"), vline(x + 1, 5, 3, "g")]).flat(), circ(13, 4, 1, "Y"))
// il tavolo lucido e gli schienali alti delle poltrone
sprite("tavolo_cda", { w: 76, h: 18, pivot: "bottom" },
  rect(0, 0, 76, 4, "M"), hline(0, 0, 76, "N"), hline(0, 3, 76, "m"), box(0, 0, 76, 4, "K"),
  rect(2, 4, 72, 7, "m"), box(2, 4, 72, 7, "K"), hline(4, 6, 68, "M"), rect(4, 11, 3, 7, "m"), rect(69, 11, 3, 7, "m"), box(4, 10, 3, 8, "K"), box(69, 10, 3, 8, "K"))
sprite("poltrona", { w: 12, h: 14, outline: "K", pivot: "bottom" }, rect(0, 0, 12, 14, "r"), hline(1, 0, 10, "R"), vline(0, 1, 13, "R"), ...[3, 6, 9].map((x) => px(x, 3, "m")))
sprite("poltrona_pres", { w: 14, h: 18, outline: "K", pivot: "bottom" }, rect(0, 0, 14, 18, "r"), hline(1, 0, 12, "R"), vline(0, 1, 17, "R"),
  ...[3, 7, 11].map((x) => [px(x, 3, "q"), px(x, 7, "q")]).flat(), hline(0, 0, 14, "q"))
sprite("bottiglia_cda", { outline: "K", pivot: "bottom" }, ".b.\n.L.\nLBL\nLWL\nLBL\nLBL\nbbb")
sprite("bicchiere_cda", { outline: "K", pivot: "bottom" }, "LL\nLW\nLL")
sprite("cartellina", { w: 10, h: 3, outline: "K", pivot: "bottom" }, rect(0, 0, 10, 3, "B"), hline(0, 0, 10, "L"), rect(6, 1, 3, 1, "W"))

scene("consiglio", { w: SW, h: SH, bg: "M", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "m"), hline(0, 3, SW, "q"),
    ...[0, 26, 52, 78].map((x) => [box(x + 40, 8, 22, 28, "m"), hline(x + 41, 8, 20, "N")]).flat(),          // pannelli di legno
    rect(0, 38, SW, 4, "N"), hline(0, 38, SW, "k"), hline(0, 41, SW, "m"),                                         // cimasa
    rect(0, 42, SW, 30, "r"), ...[48, 58].map((y) => hline(0, y, SW, "R")), hline(0, 69, SW, "m"),                 // moquette rossa
    clip([5, 6, 30, 28], stamp("_citta", -10, 1)), box(4, 5, 32, 30, "N"), box(3, 4, 34, 32, "K"), vline(20, 6, 28, "N"), rect(3, 35, 34, 2, "k"), hline(3, 36, 34, "K"),
    stamp("ritratto", 44, 8), stamp("quadro", 66, 10),
    stamp("schermo", 110, 4)),
  layer("poltrone", stamp("poltrona_pres", 37, 44), ...[56, 72, 88].map((x) => stamp("poltrona", x, 44))),
  layer("consiglieri", stamp("presidente", 37, 46), stamp("cons_a", 56, 46), stamp("cons_c", 72, 46), stamp("cons_b", 88, 46)),
  layer("tavolo",
    stamp("tavolo_cda", 64, 62),
    stamp("cartellina", 44, 45), stamp("cartellina", 62, 45), stamp("cartellina", 94, 45),
    stamp("bottiglia_cda", 50, 45), stamp("bicchiere_cda", 66, 45), stamp("bottiglia_cda", 82, 45), stamp("bicchiere_cda", 31, 45),
    stamp("zzz", 92, 15)),
  layer("relatore", stamp("relatore", 110, 66)),
)

// ================================================================ UFFICIO DEL DIRETTORE
// L'ufficio del CEO: la vetrata sulla città, il diploma, la libreria coi trofei, il mappamondo, la scrivania grande
// con la targa, il pendolo di Newton che batte, il telefono che lampeggia e chi porta il caffè. CEO e segreteria uomo o donna.

// il CEO dietro la scrivania (uomo o donna, come quello della partita): ogni tanto sbatte gli occhi
persona("_ceo_m", { testa: "corti", corpo: "seduto", abito: "completo", swap: { B: "b", b: "d", M: "m" } })
persona("_ceo_f", { testa: "lunghi", corpo: "seduto", abito: "completo", swap: { B: "r", b: "m", M: "y", R: "W" } })
for (const x of ["m", "f"]) anim("ceo_" + x, { w: 10, h: 16, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__ceo_" + x),
  frame({ hold: 13 }), frame({ hold: 1 }, px(3, 5, "F"), px(6, 5, "F")), frame({ hold: 2 }))
// chi porta il caffè col vassoio: la segretaria o il segretario
persona("_segr_f", { testa: "lunghi", abito: "completo", swap: { B: "e", b: "r", M: "K", R: "W", D: "d" } })
persona("_segr_m", { testa: "corti", abito: "completo", swap: { B: "T", b: "t", M: "o", D: "d", F: "c", f: "x" } })
for (const x of ["m", "f"]) sprite("segr_" + x, { w: 16, h: 20, outline: "K", pivot: [5, 22] }, stamp("__segr_" + x),
  rect(8, 12, 8, 1, "S"), hline(8, 13, 8, "s"), rect(11, 9, 3, 3, "W"), px(14, 10, "W"), px(11, 9, "m"), px(12, 9, "m"), rect(8, 14, 2, 2, x === "m" ? "c" : "F"))
// la poltrona di pelle dietro la scrivania
sprite("poltrona_ceo", { w: 16, h: 22, outline: "K", pivot: "bottom" }, rect(0, 0, 16, 22, "m"), hline(1, 0, 14, "M"), vline(0, 1, 21, "M"),
  ...[4, 8, 12].map((x) => [px(x, 4, "N"), px(x, 9, "N"), px(x, 14, "N")]).flat())
// la scrivania grande, con la targa
sprite("scrivania_ceo", { w: 70, h: 22, pivot: "bottom" },
  rect(0, 0, 70, 4, "M"), hline(0, 0, 70, "k"), hline(0, 3, 70, "m"), box(0, 0, 70, 4, "K"),
  rect(2, 4, 66, 16, "N"), box(2, 4, 66, 16, "K"), box(5, 7, 20, 10, "M"), box(45, 7, 20, 10, "M"), rect(14, 11, 2, 2, "q"), rect(54, 11, 2, 2, "q"),
  rect(26, 8, 18, 7, "K"), text(29, 9, "CEO", "q"), rect(2, 20, 4, 2, "M"), rect(64, 20, 4, 2, "M"))
// il pendolo di Newton: la pallina di sinistra torna e batte, parte quella di destra, e via così
const PEN_L = [-3, -2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -2, -3, -3]
const PEN_R = [0, 0, 0, 0, 1, 2, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0]
anim("pendolo", { w: 21, h: 10, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  c.rect(0, 9, 21, 1, "d"); c.vline(1, 1, 8, "j"); c.vline(19, 1, 8, "d"); c.hline(1, 0, 19, "D")
  ;[6, 8, 10, 12, 14].forEach((bx, i) => {
    const dx = i === 0 ? PEN_L[c.frame] : i === 4 ? PEN_R[c.frame] : 0, dy = Math.abs(dx) >= 2 ? -1 : 0
    c.line(bx + (i < 2 ? 0 : 1), 1, bx + dx + (i < 2 ? 0 : 1), 5 + dy, "s")
    c.rect(bx + dx, 6 + dy, 2, 2, "S"); c.px(bx + dx, 6 + dy, "W"); c.px(bx + dx + 1, 7 + dy, "j")
  })
})
// il telefono sulla scrivania con la luce della linea interna
anim("tel_ceo", { w: 9, h: 5, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 1, 9, 4, "K"), rect(0, 0, 6, 2, "d"), hline(1, 3, 5, "D"),
  (c) => c.px(7, 2, c.frame % 8 < 4 ? "Y" : "y"))
// il diploma incorniciato, col bollo rosso
sprite("diploma", { w: 18, h: 14, outline: "K" }, rect(0, 0, 18, 14, "M"), box(0, 0, 18, 14, "m"), rect(2, 2, 14, 10, "C"),
  hline(4, 4, 10, "s"), hline(5, 6, 8, "S"), hline(5, 8, 6, "S"), circ(13, 10, 1, "R"), px(13, 10, "e"))
// la libreria: libri di tutti i colori, il trofeo e il modellino del camion
sprite("libreria", { w: 32, h: 50, outline: "K", pivot: "bottom" }, rect(0, 0, 32, 50, "M"), box(0, 0, 32, 50, "m"),
  ...[1, 13, 25, 37].map((y) => rect(2, y, 28, 10, "m")).flat(), ...[11, 23, 35, 47].map((y) => rect(1, y, 30, 2, "N")),
  ...[[2, 3, "R"], [5, 2, "B"], [8, 4, "Y"], [11, 3, "G"], [14, 2, "P"], [17, 5, "O"], [20, 3, "T"], [23, 2, "r"], [26, 4, "b"]]
    .map(([x, h, k]) => rect(x, 1 + h, 3, 10 - h, k)),
  ...[[2, 2, "b"], [5, 3, "q"], [8, 2, "R"], [11, 4, "g"]].map(([x, h, k]) => rect(x, 13 + h, 3, 10 - h, k)),
  rect(18, 18, 5, 3, "Y"), rect(19, 21, 3, 1, "y"), rect(18, 22, 5, 1, "q"), rect(19, 16, 3, 2, "Y"),         // il trofeo
  rect(4, 31, 9, 4, "W"), rect(13, 32, 4, 3, "O"), px(15, 32, "L"), px(6, 35, "K"), px(11, 35, "K"), px(15, 35, "K"),                     // il modellino del bilico
  ...[[20, 3, "G"], [23, 2, "B"], [26, 4, "e"]].map(([x, h, k]) => rect(x, 25 + h, 3, 10 - h, k)),
  ...[[3, 4, "D"], [6, 2, "O"], [9, 3, "L"], [24, 2, "R"], [27, 3, "Y"]].map(([x, h, k]) => rect(x, 37 + h, 3, 10 - h, k)),
  circ(17, 42, 3, "G"), rect(15, 45, 5, 2, "o"))
// il mappamondo sul piedistallo
sprite("mappamondo", { w: 13, h: 22, outline: "K", pivot: "bottom" }, circ(6, 6, 6, "B"), ring(6, 6, 6, "b"),
  poly([3, 2, 7, 1, 8, 4, 5, 6, 3, 5], "G"), poly([7, 7, 10, 6, 10, 10, 8, 11], "G"), px(4, 3, "h"), px(8, 8, "h"), px(3, 8, "L"),
  arc(6, 6, 7, 200, 340, "q"), vline(6, 13, 6, "N"), rect(3, 19, 7, 3, "N"), hline(3, 19, 7, "k"))
// la pianta grande in vaso
sprite("pianta_ceo", { outline: "K", pivot: "bottom" }, `
  ...G..G....
  .GGhGGhG...
  GGhhGGGhG..
  GhGGgGhhGG.
  .GGgGGGgGG.
  GhGGhGgGhG.
  .GgGGgGGG..
  ..GG.N.GG..
  .....N.....
  ....NNN....
  ...ooooo...
  ...OOOOO...
  ...OOaOO...
  ....ooo....`)
// la vetrata sulla città
sprite("vetrata", { w: 56, h: 34 }, clip([2, 2, 52, 30], stamp("_citta", -4, 0)), box(0, 0, 56, 34, "K"), box(1, 1, 54, 32, "S"),
  vline(19, 2, 30, "S"), vline(37, 2, 30, "S"), hline(1, 33, 54, "s"))

// quattro versioni: direttore_<CEO><chi porta il caffè>, m o f (il gioco sceglie quella col CEO della partita)
for (const c of ["m", "f"]) for (const g of ["m", "f"])
scene("direttore_" + c + g, { w: SW, h: SH, bg: "g", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "t"), hline(0, 3, SW, "q"),
    rect(0, 40, SW, 16, "N"), hline(0, 40, SW, "k"), hline(0, 55, SW, "m"), ...[8, 32, 56, 80, 104, 128, 152].map((x) => box(x - 8, 43, 20, 10, "M")),   // boiserie
    rect(0, 56, SW, 16, "k"), ...[60, 65, 70].map((y) => hline(0, y, SW, "N")), ...Array.from({ length: 12 }, (_, i) => vline(i * 14 + (i % 2) * 7, 56, 4, "N")),  // parquet
    stamp("vetrata", 4, 5), stamp("diploma", 98, 10), stamp("libreria", 140, 59)),
  layer("dietro", stamp("pianta_ceo", 12, 67), stamp("mappamondo", 30, 66)),
  layer("ceo", stamp("poltrona_ceo", 76, 45), stamp("ceo_" + c, 76, 49)),
  layer("scrivania",
    stamp("scrivania_ceo", 76, 69),
    stamp("pendolo", 99, 47), stamp("tel_ceo", 52, 47), stamp("cartellina", 64, 47)),
  layer("segretaria", stamp("segr_" + g, 124, 68), stamp("_fumo", 132, 57)),
)

// ================================================================ CERTIFICATI E AUDIT
// L'ufficio qualità il giorno dell'audit: i certificati appesi (con lo scudo azzurro delle certificazioni), la vetrata sul magazzino,
// l'armadio dei raccoglitori. L'auditor (una ragazza col caschetto biondo) col timbro che batte, la checklist alla lavagna che si spunta riga per riga
// (l'ultima con un rilievo rosso) e la responsabile qualità in camice che suda col raccoglitore dell'HACCP in mano.

// lo scudo delle certificazioni con la spunta
sprite("_scudo", { pivot: [3, 0] }, `
  .BBBBB.
  BBBBBBB
  BBBBBWB
  BWBBWBB
  BBWWBBB
  .BBBBB.
  ..bbb..
  ...b...`)
// il certificato incorniciato: titolo, scudo, firma e bollo rosso
sprite("certificato", { w: 14, h: 18, outline: "K" }, rect(0, 0, 14, 18, "M"), box(0, 0, 14, 18, "m"), rect(2, 2, 10, 14, "W"),
  hline(4, 3, 6, "s"), stamp("_scudo", 7, 5), hline(3, 14, 4, "S"), circ(9, 13, 1, "R"), px(9, 13, "e"))
// la vetrata sul magazzino: scaffalature porta-pallet coi colli, il pavimento con la striscia gialla
// [x, ripiano (0 in alto, 2 a terra), altezza, colore]: cartoni e colli col film colorato appoggiati sui correnti arancioni
const COLLI = [[5, 0, 6, "k"], [13, 0, 5, "R"], [24, 0, 7, "Y"], [32, 0, 5, "k"], [5, 1, 6, "O"], [13, 1, 5, "k"], [24, 1, 8, "k"],
  [32, 1, 6, "P"], [5, 2, 7, "k"], [13, 2, 8, "B"], [24, 2, 5, "k"], [32, 2, 8, "G"]]
sprite("vetrata_mag", { w: 48, h: 36 },
  rect(2, 2, 44, 32, "S"), rect(2, 31, 44, 3, "j"), hline(2, 31, 44, "Y"),
  ...COLLI.map(([x, r, h, k]) => { const y = [12, 22, 31][r] - h; return [rect(x, y, 7, h, k), vline(x + 6, y, h, k === "k" ? "N" : k === "Y" ? "y" : "K"), k === "k" ? vline(x + 3, y, h, "q") : hline(x, y + 1, 6, "W")] }).flat(),
  ...[3, 21, 40].map((x) => rect(x, 2, 2, 30, "b")), ...[12, 22].map((y) => rect(3, y, 39, 2, "O")), ...[12, 22].map((y) => hline(3, y + 1, 39, "o")),
  box(0, 0, 48, 36, "K"), box(1, 1, 46, 34, "s"), vline(24, 2, 32, "s"))
// l'armadio basso coi raccoglitori di tutti i colori (etichetta bianca e foro per tirarli fuori)
const RACC = ["R", "B", "Y", "G", "B", "O", "R", "P", "T"]
sprite("armadio_racc", { w: 40, h: 24, outline: "K", pivot: "bottom" },
  rect(0, 0, 40, 24, "j"), hline(0, 0, 40, "S"), rect(1, 1, 38, 12, "D"),
  ...RACC.map((k, i) => [rect(2 + i * 4, 2, 4, 11, k), rect(3 + i * 4, 4, 2, 3, "W"), px(3 + i * 4, 9, "K"), vline(5 + i * 4, 2, 11, k === "Y" ? "y" : k === "W" ? "S" : "K")]).flat(),
  hline(0, 13, 40, "s"), vline(20, 14, 10, "s"), rect(16, 18, 2, 2, "S"), rect(22, 18, 2, 2, "S"), hline(0, 23, 40, "d"))
// la scrivania dell'audit
sprite("scrivania_aud", { w: 64, h: 18, pivot: "bottom" },
  rect(0, 0, 64, 3, "S"), hline(0, 0, 64, "W"), hline(0, 3, 64, "K"),
  rect(2, 4, 60, 11, "j"), box(2, 4, 60, 11, "K"), hline(3, 13, 58, "s"), rect(2, 15, 3, 3, "d"), rect(59, 15, 3, 3, "d"))
// la pila di raccoglitori sulla scrivania e la tazzina
sprite("pila_racc", { w: 14, h: 7, outline: "K", pivot: "bottom" }, rect(0, 0, 13, 3, "B"), rect(1, 3, 13, 4, "R"), hline(1, 3, 13, "e"), rect(2, 4, 3, 2, "W"), rect(2, 1, 3, 1, "W"))
sprite("tazzina", { outline: "K", pivot: "bottom" }, "mmm.\nWWWS\nWWW.\nSSS.")
// la ventiquattrore dell'auditor, per terra
sprite("valigetta", { outline: "K", pivot: "bottom" }, `
  ..mmmm..
  ..m..m..
  MMMMMMMM
  MMMqqMMM
  MMMMMMMM
  mmmmmmmm`)
// l'auditor: una ragazza col caschetto biondo (frangetta, punte al mento, m per l'ombra dei capelli), giacca grigia,
// camicetta bianca e occhiali; col timbro: lo alza, batte sul verbale (un colpo secco) e lo rialza
TESTE.caschetto = [
  "..MMM",
  ".MMMM",
  "MMMMM",
  "MMMMM",
  "MMMFF",
  "MMFKF",
  "MMFKF",
  "MMFFF",
  "mmfFf",
  "...ff"]
persona("_auditor", { testa: "caschetto", corpo: "seduto", abito: "completo", swap: { B: "s", b: "D", M: "Y", m: "y", R: "W" } })
// il timbro tenuto dall'alto: la mano sul pomello, il manico, la base (y = dove sta la mano)
const TIMBRO = (y) => [rect(9, y + 1, 2, 19 - y, "s"), rect(11, y + 2, 1, 2, "M"), rect(9, y + 4, 5, 2, "m"), hline(9, y + 5, 5, "K"), rect(10, y, 3, 2, "F")]
anim("auditor", { w: 16, h: 26, fps: FPS, outline: "K", pivot: [5, 26] }, stamp("__auditor", 0, 10),
  rect(2, 15, 2, 2, "L"), rect(6, 15, 2, 2, "L"), px(3, 15, "K"), px(6, 15, "K"), hline(4, 15, 2, "s"),            // gli occhiali
  frame({ hold: 3 }, ...TIMBRO(8)), frame({ hold: 1 }, ...TIMBRO(13)), frame({ hold: 2 }, ...TIMBRO(18)), frame({ hold: 2 }, ...TIMBRO(14)))
// il colpo del timbro: due trattini ai lati quando batte
anim("colpo", { w: 11, h: 3, fps: FPS }, frame({ hold: 4 }), frame({ hold: 2 }, px(0, 0, "K"), px(1, 1, "K"), px(10, 0, "K"), px(9, 1, "K")), frame({ hold: 2 }))
// la responsabile qualità in camice bianco, col raccoglitore dell'HACCP stretto al petto; una goccia di sudore scende sulla tempia
persona("_rq", { testa: "lunghi", swap: { B: "W", b: "S", M: "N", D: "d" } })
anim("rq", { w: 12, h: 20, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__rq"),
  rect(3, 11, 5, 6, "G"), hline(3, 11, 5, "h"), rect(4, 13, 3, 2, "W"), px(2, 14, "F"), px(8, 14, "F"),
  (c) => { const t = c.frame % 8; if (t < 6) c.px(9, 3 + t, "L") })
// la checklist alla lavagna: le righe si spuntano una alla volta, l'ultima prende la crocetta rossa del rilievo
const SPUNTE = [2, 5, 8, 11]
anim("checklist", { w: 46, h: 36, frames: LOOP, fps: FPS, outline: "K" },
  rect(0, 0, 46, 32, "W"), box(0, 0, 46, 32, "s"), text(14, 3, "AUDIT", "D"), hline(3, 9, 40, "S"),
  ...[12, 17, 22, 27].map((y, i) => [box(4, y, 4, 4, "s"), hline(11, y + 1, [28, 22, 30, 18][i], "S"), hline(11, y + 3, [16, 24, 12, 20][i], "S")]).flat(),
  rect(3, 32, 40, 2, "s"), hline(3, 33, 40, "D"), rect(30, 31, 6, 1, "B"),
  (c) => {
    ;[12, 17, 22].forEach((y, i) => { if (c.frame >= SPUNTE[i]) { c.px(4, y + 1, "G"); c.px(5, y + 2, "G"); c.px(6, y + 1, "G"); c.px(7, y, "G"); c.px(8, y - 1, "G") } })
    if (c.frame >= SPUNTE[3]) { c.line(4, 27, 7, 30, "R"); c.line(7, 27, 4, 30, "R"); c.px(9, 28, "R"); c.px(9, 30, "R") }
  })

scene("audit", { w: SW, h: SH, bg: "C", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "T"), hline(0, 3, SW, "t"),
    rect(0, 56, SW, 16, "S"), hline(0, 56, SW, "s"), ...[61, 67].map((y) => hline(0, y, SW, "j")), ...Array.from({ length: 10 }, (_, i) => vline(i * 16 + 8, 57, 15, "j")),
    stamp("vetrata_mag", 4, 6), stamp("certificato", 58, 7), stamp("certificato", 74, 9), stamp("certificato", 90, 7),
    stamp("checklist", 108, 5)),
  layer("dietro", stamp("armadio_racc", 26, 62), stamp("auditor", 82, 52)),
  layer("scrivania",
    stamp("scrivania_aud", 82, 68), stamp("colpo", 83, 46), hline(85, 49, 10, "W"),
    stamp("pila_racc", 64, 50), stamp("tazzina", 104, 50), stamp("_fumo", 104, 46)),
  layer("davanti", stamp("valigetta", 54, 70), stamp("rq", 128, 69), stamp("pianta_ceo", 150, 69)),
)

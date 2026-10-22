// Scenette degli eventi, gruppo «città»: ministero, edicola, trattoria, golf.
// Per il Mattinale del Ministero, il Sole 24 Pallet e l'Ufficio commerciale. Colori e omini in comune.px.js.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/scene_pxl/citta.px.js --out tools/out/scene_pxl

include("comune.px.js", { palette: true })

// ---------------------------------------------------------------- pezzi in comune a queste scene
// bandiera che sventola su un'asta (colori a strisce verticali, o un disegno a parte); la piega corre dall'asta alla punta
function bandiera(nome, w, h, disegno) {
  anim(nome, { w: w + 2, h: h + 3, frames: LOOP, fps: FPS },
    ...disegno(2, 1),
    (c) => c.warp((x, y) => x > 2 && [0, Math.round(Math.sin(c.phase * Math.PI * 4 - x / 2.5) * (x - 2) / (w * 0.7))], [2, 0, w, h + 2]),
    vline(1, 0, h + 3, "N"), px(1, 0, "Y"))
}
// il vapore di un piatto caldo (come il caffè dell'ufficio)
anim("_fumo", { w: 5, h: 9, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  const SWAY = [0, 1, 1, 0, -1, -1, 0, 1]
  for (const o of [0, 4]) {
    const t = (c.frame + o) % 8; if (t > 5) continue
    const x = 2 + SWAY[t], y = 7 - t
    c.px(x, y, t < 3 ? "W" : "S"); if (t < 4) c.px(x, y + 1, "S")
  }
})
// un omino visto di spalle, in piedi (la nuca e la schiena)
persona("_fila1", { testa: "nuca", swap: { B: "O", b: "o", M: "m" } })
carrozzina("_fila2", { testa: "nuca", retro: true, swap: { B: "T", b: "t", M: "S" } })
sprite("fila1", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__fila1"))
sprite("fila2", { w: 20, h: 23, outline: "K", pivot: "bottom" }, stamp("__fila2"))

// ================================================================ MINISTERO
// Il palazzo con le colonne e la scalinata, le bandiere italiana ed europea che sventolano,
// allo sportello il funzionario che timbra a ripetizione dietro le pile di moduli, e la fila che aspetta.

bandiera("bandiera_it", 12, 8, (x, y) => [rect(x, y, 4, 8, "G"), rect(x + 4, y, 4, 8, "W"), rect(x + 8, y, 4, 8, "R"), hline(x, y + 7, 4, "g"), hline(x + 4, y + 7, 4, "S"), hline(x + 8, y + 7, 4, "r")])
bandiera("bandiera_ue", 12, 8, (x, y) => [rect(x, y, 12, 8, "b"), hline(x, y + 7, 12, "d"),
  ...[[5, 1], [7, 2], [8, 4], [7, 6], [5, 6], [3, 6], [2, 4], [3, 2]].map(([dx, dy]) => px(x + dx, y + dy, "Y"))])

// il funzionario allo sportello: occhiali, maniche della camicia, il timbro su e giù (4 fotogrammi, quattro timbri a giro)
persona("_funzionario", { testa: "calvo", corpo: "seduto", swap: { B: "j", b: "D", M: "s" } })
anim("funzionario", { w: 16, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__funzionario", 0, 4),
  hline(2, 9, 3, "K"), hline(5, 9, 3, "K"),                                              // occhiali
  frame({ hold: 2 }, rect(9, 8, 2, 7, "j"), rect(10, 5, 3, 3, "F"), rect(11, 2, 2, 3, "N"), rect(10, 1, 4, 1, "m"), rect(10, 0, 4, 1, "K")),
  frame({ hold: 1 }, rect(9, 12, 2, 4, "j"), rect(10, 13, 3, 3, "F"), rect(11, 16, 2, 2, "N"), rect(10, 18, 4, 2, "K")),
  frame({ hold: 1 }, rect(9, 12, 2, 4, "j"), rect(10, 13, 3, 3, "F"), rect(11, 16, 2, 2, "N"), rect(10, 18, 4, 2, "K"), px(15, 16, "Y"), px(15, 19, "Y"), px(14, 14, "Y")))
// il foglio sotto il timbro: si riempie di timbri rossi
anim("foglio_timbrato", { w: 8, h: 3, fps: FPS },
  rect(0, 0, 8, 3, "W"), hline(0, 2, 8, "S"),
  frame({ hold: 2 }, rect(2, 0, 3, 2, "R")), frame({ hold: 2 }))
sprite("moduli", { outline: "K", pivot: "bottom" }, `
  ..WWWWW.
  ...LLLLL
  WWWWWWWWW
  SSSSSSSSS
  .WWWWWWWW
  .SSSSSSSS
  WWWWWWWW.
  YYYYYYYY.
  .WWWWWWWW
  .SSSSSSSS`)
// la colonna: capitello, fusto con la scanalatura e il lato in ombra, base
sprite("colonna", { w: 10, h: 33, pivot: "bottom" },
  rect(0, 0, 10, 2, "C"), hline(0, 0, 10, "W"), box(0, 0, 10, 2, "K"),
  rect(1, 2, 8, 29, "C"), vline(7, 2, 29, "z"), vline(8, 2, 29, "Z"), vline(3, 2, 29, "z"), vline(1, 2, 29, "K"), vline(8, 2, 29, "K"),
  rect(0, 31, 10, 2, "z"), box(0, 31, 10, 2, "K"))

scene("ministero", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("palazzo",
    rect(0, 0, SW, 3, "B"), ellipse(60, 7, 10, 2, "W"),
    // timpano, cornicione e fregio col nome
    poly([30, 16, 95, 3, 160, 16], "C"), poly([48, 15, 95, 7, 142, 15], "z"), line(48, 14, 95, 6, "Z"), line(95, 6, 142, 14, "Z"),
    line(30, 15, 95, 2, "K"), line(95, 2, 160, 15, "K"),
    circ(95, 11, 2, "Z"), px(95, 11, "C"),
    rect(30, 15, 130, 3, "C"), hline(30, 15, 130, "K"), hline(30, 17, 130, "Z"),
    rect(32, 18, 128, 6, "q"), text(78, 19, "MINISTERO", "M"),
    rect(30, 24, 130, 2, "C"), hline(30, 25, 130, "Z"), hline(30, 24, 130, "K"),
    rect(32, 26, 128, 29, "q"), ...[31, 38, 45].map((y) => hline(32, y, 128, "y")),
    // lo sportello: targa, vetro, banco di legno
    rect(63, 27, 63, 28, "K"), rect(64, 28, 61, 6, "b"), text(67, 29, "SPORTELLO", "W"), circ(118, 30, 1, "Y"),
    rect(64, 34, 61, 12, "L"), line(66, 44, 74, 36, "W"), line(70, 45, 79, 36, "W"), line(106, 44, 114, 36, "W"),
    rect(64, 46, 61, 8, "k"), hline(64, 46, 61, "q"), hline(64, 53, 61, "N"), rect(88, 44, 14, 2, "K"),
    // scalinata e marciapiede
    rect(30, 54, 130, 4, "S"), hline(30, 54, 130, "W"), hline(30, 57, 130, "s"),
    rect(26, 58, 134, 4, "S"), hline(26, 58, 134, "W"), hline(26, 61, 134, "s"),
    rect(22, 62, 138, 4, "S"), hline(22, 62, 138, "W"), hline(22, 65, 138, "s"),
    rect(0, 66, SW, 6, "j"), ...[4, 20, 36, 52, 68, 84, 100, 116, 132, 148].map((x) => vline(x, 67, 5, "s")), hline(0, 66, SW, "s")),
  layer("colonne", ...[34, 49, 131, 146].map((x) => stamp("colonna", x + 5, 55))),
  // la rampa per le carrozzine, lungo la scalinata a destra, col corrimano
  layer("rampa", poly([112, 66, 160, 52, 160, 57, 128, 66], "j"), line(112, 65, 160, 51, "S"), line(128, 65, 160, 56, "D"),
    line(114, 59, 160, 45, "D"), ...[[116, 59], [130, 55], [144, 51], [158, 46]].map(([x, y]) => vline(x, y, 6, "D"))),
  layer("sportello",
    stamp("foglio_timbrato", 114, 45),
    stamp("funzionario", 112, 50),
    stamp("moduli", 74, 46), stamp("moduli", 89, 46, { flip: "x" })),
  layer("bandiere", vline(5, 2, 64, "s"), vline(18, 6, 60, "s"), rect(3, 64, 5, 2, "D"), rect(16, 64, 5, 2, "D"),
    stamp("bandiera_it", 4, 2), stamp("bandiera_ue", 17, 6, { delay: 250 })),
  layer("fila", { sort: "y" }, stamp("fila1", 80, 69), stamp("fila2", 99, 70)),
)

// ================================================================ EDICOLA
// L'edicola verde all'angolo, le locandine dei giornali sui cavalletti, il signore che legge in piedi,
// i piccioni che beccano, il motorino parcheggiato e i palazzi color pastello dietro.

// la locandina: testata rossa finta (righe bianche, nessun nome vero) e il titolo grande
function locandina(nome, titolo, w) {
  sprite(nome, { w, h: 22, outline: "K", pivot: "bottom" },
    rect(0, 0, w, 14, "W"), rect(0, 0, w, 3, "R"), hline(2, 1, w - 4, "e"),
    text(Math.floor((w - (titolo.length * 4 - 1)) / 2), 5, titolo, "K"), hline(2, 11, w - 4, "s"),
    line(1, 14, 0, 21, "N"), line(w - 2, 14, w - 1, 21, "N"), hline(1, 17, w - 2, "N"))
}
locandina("loc_crisi", "CRISI!", 26)
locandina("loc_euro", "EURO", 20)
locandina("loc_gasolio", "GASOLIO", 31)
// l'edicola: tetto sporgente, le riviste esposte, l'edicolante dentro
sprite("chiosco", { w: 56, h: 46, outline: "K", pivot: "bottom" },
  rect(0, 0, 56, 5, "G"), hline(0, 4, 56, "g"), rect(10, 1, 36, 3, "g"), text(13, -1, "", "W"),
  rect(3, 5, 50, 41, "g"), vline(3, 5, 41, "t"), vline(52, 5, 41, "t"),
  rect(6, 8, 44, 22, "d"),
  ...[[7, 9, "R"], [13, 9, "B"], [19, 9, "Y"], [31, 9, "P"], [37, 9, "O"], [43, 9, "T"], [7, 19, "e"], [13, 19, "h"], [37, 19, "L"], [43, 19, "R"]]
    .map(([x, y, k]) => [rect(x, y, 5, 8, k), hline(x, y + 1, 5, "W"), hline(x + 1, y + 4, 3, "W")]).flat(),
  rect(6, 30, 44, 3, "k"), hline(6, 30, 44, "q"),
  rect(6, 33, 44, 13, "G"), rect(8, 35, 8, 9, "g"), rect(40, 35, 8, 9, "g"),
  rect(18, 35, 20, 9, "W"), rect(18, 35, 20, 2, "R"), text(21, 38, "EURO", "K"), box(18, 35, 20, 9, "K"))   // locandina appesa
sprite("insegna_giornali", { w: 36, h: 7, outline: "K" }, rect(0, 0, 36, 7, "W"), text(3, 1, "GIORNALI", "g"))
persona("_edicolante", { testa: "corti", corpo: "seduto", swap: { B: "S", b: "s", M: "K" } })
sprite("edicolante", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__edicolante"))
// il signore col cappello che legge il giornale aperto (gli si vedono solo cappello, mani e gambe): ogni tanto gira l'angolo
anim("lettore", { w: 20, h: 26, fps: FPS, outline: "K", pivot: "bottom" },
  rect(5, 0, 10, 3, "N"), rect(3, 2, 14, 2, "N"), hline(5, 2, 10, "m"),                 // cappello
  rect(8, 18, 2, 6, "D"), rect(11, 18, 2, 6, "D"), rect(7, 24, 3, 2, "K"), rect(11, 24, 3, 2, "K"), rect(6, 16, 9, 3, "D"),
  rect(0, 4, 20, 14, "W"), vline(10, 4, 14, "S"),                                         // il giornale aperto
  ...[6, 8, 10, 12, 14].map((y) => [hline(2, y, 7, "s"), hline(12, y, 6, "s")]).flat(), rect(12, 6, 6, 4, "j"), hline(2, 5, 7, "K"),
  px(0, 9, "F"), px(19, 9, "F"),
  frame({ hold: 12 }), frame({ hold: 4 }, grid(16, 4, "____\n.__\n.._\n..._"), grid(16, 4, "...W\n..WS\n.WS.\nWS..")))
// i piccioni che beccano (testa giù, testa su)
anim("piccione", { w: 8, h: 6, fps: FPS, outline: "K", pivot: "bottom" },
  grid(0, 2, "..SSSSD\nsSSSSDD\n.ssss..\n..Y.Y.."),
  frame({ hold: 3 }, grid(5, 0, ".s\nTsY")),
  frame({ hold: 1 }, grid(6, 2, "..\n..\n.s\n.Y")))
// il motorino rosso parcheggiato
sprite("motorino", { outline: "K", pivot: "bottom" }, `
  .........SSS.
  ..........R..
  ..........R..
  .dddddd...R..
  RRRRRRR..RRL.
  RRRRRRRRRRRR.
  .rRRRRRRRRRr.
  ..dd.....dd..
  .dsSd...dsSd.
  ..dd.....dd..`)

scene("edicola", { w: SW, h: SH, bg: "q", world: { light: [-0.6, -1], ground: 66 } },
  layer("palazzi",
    rect(0, 0, 76, 56, "q"), rect(76, 0, 84, 56, "a"), vline(76, 0, 56, "o"),
    ...[[6, 6], [26, 6], [46, 6], [6, 28], [26, 28], [46, 28]].map(([x, y]) => [rect(x, y, 10, 14, "d"), rect(x - 3, y, 3, 14, "G"), rect(x + 10, y, 3, 14, "G"), hline(x - 3, y + 14, 16, "C"), hline(x + 4, y, 2, "L")]).flat(),
    ...[[86, 6], [108, 6], [130, 6], [148, 6]].map(([x, y]) => [rect(x, y, 9, 13, "d"), rect(x, y, 9, 6, "g"), hline(x, y + 2, 9, "G"), hline(x, y + 4, 9, "G"), hline(x - 1, y + 13, 11, "C")]).flat(),
    rect(80, 30, 80, 4, "R"), ...[82, 90, 98, 106, 114, 122, 130, 138, 146, 154].map((x) => rect(x, 30, 4, 4, "W")), hline(80, 33, 80, "r"),   // tenda del bar
    rect(84, 36, 70, 20, "d"), rect(86, 38, 30, 16, "L"), rect(122, 38, 30, 16, "L"), vline(101, 38, 16, "S"), vline(137, 38, 16, "S"),
    rect(0, 54, SW, 2, "y"),
    rect(0, 56, SW, 10, "S"), ...[12, 36, 60, 84, 108, 132, 156].map((x) => vline(x, 57, 9, "s")), hline(0, 56, SW, "s"),
    rect(0, 66, SW, 1, "W"), rect(0, 67, SW, 5, "D")),
  layer("strada", { sort: "y" },
    stamp("chiosco", 78, 62),
    stamp("loc_crisi", 38, 66), stamp("loc_gasolio", 124, 66),
    stamp("lettore", 13, 66),
    stamp("motorino", 151, 68),
    stamp("piccione", 63, 70), stamp("piccione", 76, 69, { flip: "x", delay: 250 }), stamp("piccione", 106, 70, { delay: 500 })),
  layer("dentro", stamp("edicolante", 78, 38), stamp("insegna_giornali", 61, 9)),
)

// ================================================================ TRATTORIA
// Pranzo col cliente: tovaglia a quadri, brasato con la polenta che fuma, il fiasco, il buyer che mastica
// col tovagliolo al collo, il commerciale che brinda speranzoso, il cameriere coi baffi e la partita alla TV.

persona("_buyer", { testa: "calvo", corpo: "seduto", abito: "completo", swap: { B: "D", b: "d", M: "m", R: "W" } })
anim("buyer", { w: 10, h: 16, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__buyer"),
  rect(2, 10, 6, 3, "W"), hline(2, 12, 6, "S"), px(4, 9, "W"), px(5, 9, "W"),                   // il tovagliolo al collo
  frame({ hold: 2 }), frame({ hold: 2 }, grid(3, 8, "fmmmf")))                                     // mastica
persona("_commerciale", { testa: "corti", corpo: "seduto", abito: "completo", swap: { B: "b", b: "d", M: "m" } })
// il commerciale alza il bicchiere: «alla nostra collaborazione!»
anim("commerciale", { w: 13, h: 18, fps: FPS, outline: "K", pivot: [5, 18] }, stamp("__commerciale", 0, 2),
  frame({ hold: 6 }, rect(9, 13, 2, 3, "b"), rect(10, 12, 2, 2, "F"), rect(10, 9, 3, 3, "W"), rect(10, 10, 3, 2, "r"), px(11, 12, "S")),
  frame({ hold: 2 }, rect(9, 11, 2, 5, "b"), rect(10, 10, 2, 2, "F"), rect(10, 7, 3, 3, "W"), rect(10, 8, 3, 2, "r"), px(11, 10, "S")))
// il tegame in mezzo al tavolo: brasato e polenta
sprite("tegame", { outline: "K", pivot: "bottom" }, `
  .YYYMMMNMM.
  YYiYYMNMMMN
  oOOOOOOOOOo
  .ooooooooo.`)
persona("_cameriere", { testa: "calvo", abito: "completo", swap: { B: "W", b: "S", M: "K", D: "K", d: "K", R: "K" } })
sprite("cameriere", { w: 12, h: 20, outline: "K", pivot: [5, 20] }, stamp("__cameriere"),
  rect(1, 11, 2, 4, "d"), rect(7, 11, 2, 4, "d"),                                             // il gilet
  rect(2, 15, 6, 4, "W"), hline(2, 18, 6, "S"),                                               // il grembiule lungo
  rect(9, 12, 2, 5, "W"), px(10, 16, "S"))                                                    // il tovagliolo sul braccio
sprite("fiasco", { outline: "K", pivot: "bottom" }, `
  .R.
  .g.
  .G.
  GGG
  qkq
  kqk
  qkq
  yyy`)
sprite("bicchiere_vino", { outline: "K", pivot: "bottom" }, "WW\nrr\n.S\nSS")
sprite("piatto_brasato", { outline: "K", pivot: "bottom" }, `
  ...YYMM...
  SWWWWWWWWS
  .SSSSSSSS.`)
sprite("pane", { outline: "K", pivot: "bottom" }, ".q.q.\nqkqkq\nkkkkk\n.kkk.")
// la TV sulla mensola in alto: la partita, con la palla e i giocatori che corrono
anim("tv_partita", { w: 26, h: 20, frames: LOOP, fps: FPS, outline: "K" },
  rect(0, 0, 26, 17, "d"), rect(2, 2, 22, 13, "G"), hline(2, 8, 22, "h"), vline(13, 2, 13, "h"), ring(13, 8, 2, "h"),
  rect(2, 2, 22, 2, "g"), rect(8, 17, 10, 2, "s"), rect(4, 19, 18, 1, "K"),
  (c) => {
    const t = c.phase * Math.PI * 2, bx = 13 + Math.round(Math.sin(t) * 7), by = 9 + Math.round(Math.sin(t * 2) * 2)
    c.px(bx, by, "W")
    c.rect(bx - 2 + Math.round(Math.sin(t + 1)), by - 2, 1, 2, "R"), c.rect(bx + 3, by + Math.round(Math.cos(t)), 1, 2, "B")
    c.rect(5, 6 + Math.round(Math.sin(t) * 2), 1, 2, "B"), c.rect(20, 10 - Math.round(Math.sin(t) * 2), 1, 2, "R")
  })

scene("trattoria", { w: SW, h: SH, bg: "C", world: { light: [-0.6, -1], ground: 66 } },
  layer("sala",
    rect(0, 0, SW, 2, "k"), rect(0, 34, SW, 22, "N"), hline(0, 34, SW, "k"), hline(0, 55, SW, "M"),
    ...Array.from({ length: 10 }, (_, i) => vline(i * 16 + 8, 35, 20, "M")),
    rect(0, 56, SW, 16, "o"), ...[60, 65, 70].map((y) => hline(0, y, SW, "O")),
    ...[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156].map((x, i) => vline(x + (i % 2) * 6, 56, 4, "O")),
    // finestra con le tendine a quadri
    rect(8, 6, 26, 22, "K"), rect(9, 7, 24, 20, "L"), rect(9, 20, 24, 7, "h"), vline(20, 7, 20, "W"), hline(9, 16, 24, "W"),
    ...Array.from({ length: 6 }, (_, i) => [rect(9 + (i % 3) * 2, 7 + Math.floor(i / 3) * 2, 1, 1, "R")]).flat(),
    rect(9, 7, 7, 12, "W"), rect(26, 7, 7, 12, "W"),
    ...[[9, 7], [11, 9], [13, 7], [15, 9], [9, 11], [13, 11], [11, 13], [15, 13], [9, 15], [13, 15], [11, 17], [15, 17],
        [26, 7], [28, 9], [30, 7], [32, 9], [26, 11], [30, 11], [28, 13], [32, 13], [26, 15], [30, 15], [28, 17], [32, 17]].map(([x, y]) => rect(x, y, 1, 1, "R")),
    // mensola coi vini e la foto del fondatore
    rect(44, 18, 34, 2, "M"), ...[46, 50, 54, 58, 62, 66, 70, 74].map((x, i) => [rect(x, 11, 2, 7, ["G", "r", "g", "d"][i % 4]), px(x, 10, "K")]).flat(),
    rect(88, 6, 14, 16, "N"), rect(90, 8, 10, 12, "q"), circ(95, 12, 2, "k"), rect(92, 15, 6, 5, "D"), px(94, 12, "K"), px(96, 12, "K"),
    stamp("tv_partita", 124, 3)),
  layer("commensali", stamp("buyer", 60, 45), stamp("commerciale", 92, 45)),
  layer("tavolo",
    rect(36, 44, 82, 3, "W"),
    rect(38, 47, 78, 9, "W"), ...Array.from({ length: 39 * 5 }, (_, i) => [i % 39, Math.floor(i / 39)]).filter(([x, y]) => (x + y) % 2 === 0)
      .map(([x, y]) => rect(38 + x * 2, 47 + y * 2, 2, 2, "R")),
    rect(38, 55, 78, 1, "r"), box(37, 44, 80, 12, "K"), rect(40, 56, 3, 10, "M"), rect(111, 56, 3, 10, "M"),
    stamp("piatto_brasato", 60, 45), stamp("piatto_brasato", 93, 45, { flip: "x" }),
    stamp("tegame", 77, 45), stamp("_fumo", 77, 39), stamp("_fumo", 74, 40, { delay: 250 }),
    stamp("bicchiere_vino", 68, 45), stamp("bicchiere_vino", 86, 45),
    stamp("fiasco", 104, 45), stamp("pane", 112, 45)),
  layer("cameriere", stamp("cameriere", 136, 66)),
)

// ================================================================ GOLF
// Il circolo del golf: il cliente fa lo swing (indietro, botta, finale) e la pallina vola verso il green,
// il commerciale in giacca regge la sacca e applaude, la bandierina sventola, il golf cart aspetta.

// il cliente, braccia e mazza disegnate a ogni fase dello swing
TESTE.visiera = [
  "..WWW",
  ".WWWW",
  "WWWWW",
  "SSSSS",
  "MFFFF",
  "FFFKF",
  "FFFKF",
  "fFFFF",
  ".fMMM",
  "..fff"]
CORPI.golf = [
  ".BBBB",
  ".BBBB",
  ".bBBB",
  ".bBBB",
  ".bBBB",
  ".BBBB",
  ".DDDD",
  ".DDd.",
  ".DDd.",
  ".KKK."]
persona("_golfista", { testa: "visiera", corpo: "golf", swap: { B: "B", b: "b", D: "W", d: "S", M: "s" } })
const SWING = (bx, by, mano, testa, extra = []) => [line(...mano, bx, by, "s"), rect(testa[0], testa[1], 2, 2, "K")].concat(extra)
anim("golfista", { w: 30, h: 30, fps: FPS, outline: "K", pivot: [15, 30] },
  stamp("__golfista", 10, 10),
  frame({ hold: 5 }, line(15, 26, 19, 28, "s"), rect(19, 28, 2, 2, "K"), px(22, 29, "W"),                      // in posizione
    line(11, 21, 14, 25, "F"), line(18, 21, 15, 25, "F"), rect(14, 25, 2, 2, "F")),
  frame({ hold: 4 }, line(8, 13, 3, 3, "s"), rect(2, 2, 2, 2, "K"), px(22, 29, "W"),                           // indietro
    line(11, 21, 9, 15, "F"), line(18, 21, 10, 15, "F"), rect(8, 13, 2, 2, "F")),
  frame({ hold: 1 }, line(15, 26, 16, 28, "s"), rect(16, 28, 2, 2, "K"), line(20, 29, 27, 26, "W"),            // la botta
    line(11, 21, 14, 25, "F"), line(18, 21, 15, 25, "F"), rect(14, 25, 2, 2, "F")),
  frame({ hold: 6 }, line(21, 13, 26, 3, "s"), rect(26, 2, 2, 2, "K"),                                          // il finale
    line(11, 21, 20, 15, "F"), line(18, 21, 21, 15, "F"), rect(20, 13, 2, 2, "F")))
// il commerciale con la sacca: applaude il colpo
persona("_portasacca", { testa: "corti", abito: "completo", swap: { B: "D", b: "d", D: "d", M: "K" } })
anim("portasacca", { w: 12, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__portasacca"),
  frame({ hold: 10 }),
  ...[0, 1, 2].map(() => [frame({ hold: 1 }, rect(0, 11, 10, 5, "_"), stamp("__portasacca"), grid(1, 12, "DDDDDDDD"), rect(4, 11, 2, 2, "F")), frame({ hold: 1 }, grid(0, 13, "F........F"))]).flat())
sprite("sacca", { outline: "K", pivot: "bottom" }, `
  .S.S.K
  .SKS.K
  .K.K.K
  RRRRR.
  RRWRR.
  RRRRr.
  RRRRr.
  NNNNN.
  RRRRr.
  RRRRr.
  RRRRr.
  RRRRr.
  NNNNN.
  .K.K..`)
// la bandierina sul green
anim("bandierina", { w: 9, h: 18, frames: LOOP, fps: FPS, pivot: [1, 18] },
  rect(2, 1, 7, 5, "R"), hline(2, 5, 7, "r"),
  (c) => c.warp((x, y) => x > 2 && [0, Math.round(Math.sin(c.phase * Math.PI * 4 - x / 2) * (x - 2) / 5)], [2, 0, 7, 8]),
  vline(1, 0, 17, "W"), px(1, 0, "S"), px(1, 17, "K"))
// il golf cart parcheggiato
sprite("golfcart", { w: 30, h: 21, outline: "K", pivot: "bottom" },
  rect(1, 0, 26, 2, "W"), hline(1, 1, 26, "S"), vline(5, 2, 9, "S"), vline(23, 2, 9, "S"),
  rect(4, 8, 8, 3, "G"), rect(3, 11, 9, 2, "g"),
  rect(0, 11, 30, 6, "W"), hline(0, 16, 30, "S"), rect(22, 9, 7, 3, "W"), hline(22, 9, 7, "S"),
  rect(26, 12, 3, 2, "Y"), circ(6, 18, 2, "K"), circ(23, 18, 2, "K"), px(6, 18, "s"), px(23, 18, "s"))
// un albero lontano
sprite("_albero", { pivot: "bottom" }, `
  ..GGG..
  .GGhGG.
  GGhGGgG
  GGGGGgg
  .gGGgg.
  ...N...`)

scene("golf", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("campo",
    rect(0, 0, SW, 4, "B"), ellipse(40, 10, 10, 2, "W"), ellipse(128, 7, 14, 2, "W"),
    // la club house in fondo, col tetto rosso
    rect(6, 18, 30, 10, "W"), poly([3, 19, 21, 11, 39, 19], "r"), hline(4, 18, 34, "R"), ...[10, 18, 26].map((x) => rect(x, 21, 4, 4, "b")), rect(19, 23, 3, 5, "N"),
    rect(0, 28, SW, 44, "G"),
    // il bosco in fondo: chiome tonde una accanto all'altra, luce da sinistra
    ...Array.from({ length: 21 }, (_, i) => { const x = 42 + i * 6, y = 29 - (i * 7 % 5), r = 4 + (i * 3 % 3)
      return [circ(x, y, r, "g"), circ(x - 1, y - 1, r - 1, "G"), px(x - 2, y - r + 1, "h"), px(x - 3, y - r + 2, "h")] }).flat(),
    rect(0, 30, SW, 3, "g"),
    rect(0, 33, SW, 10, "h"), rect(0, 43, SW, 2, "G"),
    ellipse(122, 50, 32, 7, "h"), ellipse(122, 50, 32, 7, "G", true), ellipse(122, 51, 3, 1, "K"),
    ellipse(48, 55, 11, 3, "q"), ellipse(48, 54, 8, 1, "i"), ellipse(48, 55, 11, 3, "y", true),
    rect(0, 68, SW, 4, "g")),
  layer("pallina", (c) => {
    const f = c.frame; if (f < 9) return
    const u = (f - 8) / 8, x = Math.round(89 + u * 33), y = Math.round(64 - Math.sin(u * Math.PI) * 30 - u * 13)
    c.rect(x, y, 2, 2, "W"); c.px(x + 1, y + 1, "S")
  }),
  layer("gente", { sort: "y" },
    stamp("golfcart", 18, 66),
    stamp("bandierina", 123, 50),
    stamp("golfista", 82, 66),
    stamp("portasacca", 103, 66), stamp("sacca", 112, 66)),
)

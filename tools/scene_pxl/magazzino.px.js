// Scenette degli eventi dentro il magazzino: un giorno normale (Gazzetta del Muletto), l'ispezione, la festa, il talento, il trasloco.
// Le tre scene condividono il capannone: lucernari, scaffalature porta-pallet blu e arancio, pavimento con le strisce gialle.
// Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html). Colori e omini in comune.px.js.
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

// caschetto bianco degli ispettori e giallo del capoturno (W/S e Y/y non vengono toccati dagli swap delle giacche)
TESTE.caschetto = [
  "..WWW",
  ".WWWW",
  "WWWWW",
  "SSSSS",
  "MFFFF",
  "FFFKF",
  "FFFKF",
  "fFFFF",
  ".fFFf",
  "..fff"]
TESTE.elmetto = [
  "..YYY",
  ".YYYY",
  "YYYYY",
  "yyyyy",
  "MFFFF",
  "FFFKF",
  "FFFKF",
  "fFFFF",
  ".fFFf",
  "..fff"]

// ================================================================ il capannone
const PAV = 46                      // dove le scaffalature toccano il pavimento
const R = rng(7)
const SCATOLE = ["k", "k", "k", "R", "B", "G", "Y", "P", "T"]
// un pallet di merce: scatole di cartone col nastro, o colli avvolti nel film colorato
function merce(x, y, tipo, alto) {
  const it = [rect(x, y + 10, 16, 2, "k"), hline(x, y + 11, 16, "N"), px(x + 1, y + 11, "m"), px(x + 7, y + 11, "m"), px(x + 14, y + 11, "m")]
  const top = y + 10 - alto
  if (tipo === "k") {
    it.push(rect(x + 1, top, 14, alto, "k"), vline(x + 7, top, alto, "N"), hline(x + 1, top + Math.floor(alto / 2), 14, "N"),
      hline(x + 1, top, 14, "q"), vline(x + 4, top + 1, 2, "C"))
  } else {
    const sc = { R: "r", B: "b", G: "g", Y: "y", P: "p", T: "t" }[tipo]
    it.push(rect(x + 1, top, 14, alto, tipo), vline(x + 13, top, alto, sc), vline(x + 14, top, alto, sc), vline(x + 3, top + 1, alto - 2, "W"),
      hline(x + 1, top + alto - 1, 14, sc))
  }
  return it
}
// scaffalature: montanti blu ogni 38 pixel, correnti arancioni a tre livelli, due pallet per vano
const MONTANTI = [0, 38, 76, 114, 152]
const LIVELLI = [12, 24, 36]          // dove poggiano i pallet (riga dei correnti)
const VUOTI = { "1,1": 1, "2,0": 1, "3,1": 1 }   // vano,livello,pallet senza merce (la scaffalatura non è mai piena)
function scaffali() {
  const it = []
  MONTANTI.slice(0, 4).forEach((x0, v) => {
    LIVELLI.forEach((yb, l) => {
      for (let p = 0; p < 2; p++) {
        const k = `${v},${l}` + (p ? "" : "")
        if (VUOTI[`${v},${l}`] && p === (v + l) % 2) continue
        const tipo = SCATOLE[Math.floor(R() * SCATOLE.length)], alto = 6 + Math.floor(R() * 4)
        it.push(...merce(x0 + 3 + p * 17, yb + 2 - 12, tipo, alto))
      }
    })
  })
  // correnti e montanti sopra la merce
  LIVELLI.forEach((yb) => it.push(rect(0, yb + 2, SW, 2, "O"), hline(0, yb + 3, SW, "o")))
  MONTANTI.forEach((x) => it.push(rect(x, 0, 2, PAV, "b"), vline(x, 0, PAV, "B"), ...[8, 16, 24, 32, 40].map((y) => px(x + 1, y, "d"))))
  return it
}
sprite("_capannone", { w: SW, h: SH },
  rect(0, 0, SW, PAV, "S"),                                                    // parete di fondo
  rect(0, 0, SW, 3, "d"), ...[10, 50, 90, 130].map((x) => [rect(x, 0, 20, 2, "L"), hline(x, 0, 20, "W")]).flat(),  // lucernari
  ...scaffali(),
  rect(0, PAV, SW, SH - PAV, "S"), hline(0, PAV, SW, "s"),                    // pavimento in cemento
  rect(0, 50, SW, 1, "Y"), rect(0, 69, SW, 1, "Y"),                          // strisce gialle della corsia
  ...[6, 14, 22, 30].map((x) => px(x + 120, 69, "y")))

// ================================================================ MAGAZZINO
// Un giorno qualunque: il muletto alza un pallet col lampeggiante acceso, il magazziniere pompa il transpallet,
// il cane del capoturno scodinzola. Per quasi tutti gli eventi della Gazzetta del Muletto.

// il muletto visto di fianco, forche a sinistra, con l'autista dentro la gabbia
sprite("_muletto", { w: 30, h: 28 },
  rect(9, 14, 19, 9, "Y"), hline(9, 14, 19, "i"), rect(9, 21, 19, 2, "y"), rect(23, 10, 5, 13, "Y"), hline(23, 10, 5, "i"), vline(27, 11, 12, "y"),  // corpo e contrappeso
  rect(10, 18, 13, 1, "y"),
  vline(10, 2, 13, "d"), vline(22, 2, 9, "d"), rect(10, 2, 13, 1, "d"),        // tettuccio di protezione
  rect(5, 0, 2, 24, "d"), vline(5, 0, 24, "D"), rect(7, 18, 3, 3, "d"),       // montante
  circ(13, 24, 3, "K"), px(13, 24, "s"), circ(24, 24, 3, "K"), px(24, 24, "s"))
persona("_mulettista", { corpo: "seduto", swap: { B: "O", b: "o", M: "M" } })
anim("muletto", { w: 31, h: 31, frames: LOOP, fps: FPS, outline: "K", pivot: [16, 31] },
  stamp("__mulettista", 12, 4),
  stamp("_muletto", 0, 3),
  // le forche col pallet: salgono, stanno su, scendono (16 fotogrammi)
  (c) => {
    const H = [0, 0, 1, 2, 4, 6, 8, 9, 10, 10, 10, 9, 7, 5, 3, 1][c.frame], y = 23 - H
    c.rect(0, y, 7, 1, "K"); c.rect(5, y - 6, 2, 6, "s")                       // forche e piastra
    c.rect(0, y - 2, 5, 2, "k"); c.hline(0, y - 1, 5, "N")                     // il pallet di sbieco
    c.rect(0, y - 9, 5, 7, "R"); c.vline(4, y - 9, 7, "r"); c.vline(1, y - 8, 5, "W")
  },
  // il lampeggiante arancione sul tettuccio
  (c) => { const on = c.frame % 4 < 2; c.rect(15, 3, 3, 2, on ? "O" : "o"); if (on) { c.px(14, 2, "Y"); c.px(18, 2, "Y") } })

// il transpallet con un pallet di scatole e il magazziniere che pompa il timone
persona("_magazziniere", { testa: "berretto", abito: "gilet", swap: { B: "Y", b: "y", M: "K", F: "c", f: "x", R: "B", r: "b" } })
anim("transpallet", { w: 35, h: 24, fps: FPS, outline: "K", pivot: [17, 24] },
  ...merce(0, 10, "k", 9),
  rect(0, 22, 20, 1, "R"), rect(17, 19, 3, 4, "R"), hline(17, 19, 3, "e"), px(18, 23, "K"), px(2, 23, "K"),
  stamp("__magazziniere", 25, 4),
  frame({ hold: 2 }, line(19, 19, 23, 15, "d"), rect(23, 14, 2, 2, "K")),
  frame({ hold: 2 }, line(19, 19, 23, 18, "d"), rect(23, 17, 2, 2, "K")))

// una pila di pallet vuoti e l'estintore sul montante
sprite("pila_pallet", { w: 16, h: 12, outline: "K", pivot: "bottom" },
  ...[0, 3, 6, 9].map((y) => [hline(0, y, 16, "k"), hline(0, y + 1, 16, "m"), rect(0, y + 1, 2, 1, "k"), rect(7, y + 1, 2, 1, "k"), rect(14, y + 1, 2, 1, "k"),
    hline(0, y + 2, 16, "N")]).flat(),
  hline(0, 0, 16, "q"))
sprite("estintore", { outline: "K", pivot: "bottom" }, ".KK.\nRRR.\nRRRK\nRWR.\nRRR.\nRRR.\nrrr.")
// il cane del capoturno, seduto, che scodinzola
anim("cane", { w: 13, h: 12, fps: FPS, outline: "K", pivot: "bottom" }, `
  ..MM.........
  .MNNN........
  NNNNNN.......
  KNNKNN.......
  .kkNNN.......
  ...NNN.......
  ..NNNNN......
  ..kNNNNN.....
  ..kNNNNN.....
  ..kNNNNNN....
  ..kNNNNNN....
  .MMk.MMMM....`,
  frame({ hold: 2 }, line(9, 9, 12, 6, "N")),
  frame({ hold: 2 }, line(9, 10, 12, 10, "N")))

scene("magazzino", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(48, 66, 17, 2, "K"), ellipse(110, 67, 18, 2, "K"), ellipse(142, 67, 7, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("muletto", 48, 67),
    stamp("transpallet", 106, 67),
    stamp("cane", 143, 67),
    stamp("pila_pallet", 77, 58),
    stamp("estintore", 155, 46)),
)

// ================================================================ ISPEZIONE
// Lo stesso magazzino con gli ispettori: uno passa il guanto bianco sul corrente, uno scrive sulla cartellina,
// uno fotografa (flash), il capoturno suda. Per NAS, ASL, Ispettorato, Guardia di Finanza, audit e revisori.

persona("_isp1", { testa: "caschetto", abito: "completo", swap: { B: "d", b: "K", M: "M", D: "K", R: "b" } })
persona("_isp2", { testa: "caschetto", abito: "completo", swap: { B: "s", b: "D", M: "K", D: "D", R: "R", F: "c", f: "x" } })
persona("_isp3", { testa: "caschetto", abito: "completo", swap: { B: "D", b: "d", M: "o", D: "d", R: "Y" } })
persona("_capoturno", { testa: "elmetto", abito: "gilet", swap: { B: "O", b: "o", M: "m" } })
// l'ispettore col guanto bianco: lo passa sul corrente, poi lo guarda (grigio di polvere)
anim("isp_guanto", { w: 13, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__isp1"),
  frame({ hold: 2 }, rect(9, 3, 2, 8, "d"), rect(9, 1, 3, 2, "W")),
  frame({ hold: 2 }, rect(9, 3, 2, 8, "d"), px(11, 3, "d"), rect(10, 1, 3, 2, "W")),
  frame({ hold: 4 }, rect(9, 3, 2, 8, "d"), px(11, 3, "d"), px(11, 2, "d"), rect(11, 0, 2, 3, "W")),
  frame({ hold: 8 }, rect(9, 8, 2, 3, "d"), rect(9, 5, 3, 3, "W"), px(11, 5, "s"), px(11, 6, "s")))
// l'ispettore che scrive sulla cartellina: la penna va avanti e indietro
anim("isp_cartella", { w: 12, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__isp2"), vline(0, 11, 4, "S"), vline(9, 11, 5, "D"),
  rect(3, 11, 5, 6, "N"), vline(3, 11, 5, "k"), vline(7, 11, 6, "M"), hline(3, 16, 5, "M"), rect(4, 12, 3, 4, "W"), hline(4, 13, 3, "s"), rect(4, 11, 3, 1, "s"),
  px(2, 15, "c"),
  frame({ hold: 2 }, px(7, 13, "K"), px(8, 14, "c")),
  frame({ hold: 2 }, px(6, 14, "K"), px(7, 15, "c")))
// l'ispettore con la macchina fotografica: flash ogni 8 fotogrammi
anim("isp_foto", { w: 18, h: 22, fps: FPS, outline: "K", pivot: [6, 22] }, stamp("__isp3", 1, 2),
  rect(0, 8, 5, 4, "K"), rect(1, 9, 2, 2, "s"), px(4, 8, "W"), px(5, 10, "F"), rect(5, 12, 1, 2, "D"),
  frame({ hold: 1 }, px(4, 7, "W"), rect(0, 4, 1, 1, "Y"), px(2, 5, "i"), px(0, 6, "i")),
  frame({ hold: 7 }))
// il capoturno con la goccia di sudore
anim("capoturno", { w: 10, h: 20, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__capoturno"),
  (c) => { const t = c.frame % 8; if (t < 6) { const y = 4 + t; c.px(0, y, "L"); if (t > 1) c.px(0, y - 1, "B") } })
// il lampo del flash su tutta la scena: un fotogramma più chiaro ogni 8
sprite("_flash", { w: 16, h: 16, pivot: "center" }, `
  .......W........
  .......W........
  ...W...i...W....
  ....W..i..W.....
  .....WiWiW......
  ......WWW.......
  WWiiiiWWWiiiiWW.
  ......WWW.......
  .....WiWiW......
  ....W..i..W.....
  ...W...i...W....
  .......W........
  .......W........`)
anim("flash", { w: 16, h: 16, fps: FPS, pivot: "center" }, frame({ hold: 1 }, stamp("_flash", 8, 8)), frame({ hold: 7 }))
// il muletto fermo, a forche giù e lampeggiante spento
sprite("muletto_fermo", { w: 31, h: 31, outline: "K", pivot: [16, 31] },
  stamp("__mulettista", 12, 4), stamp("_muletto", 0, 3),
  rect(0, 23, 7, 1, "K"), rect(5, 17, 2, 6, "s"), rect(15, 3, 3, 2, "o"))

scene("ispezione", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(24, 66, 15, 2, "K"), ellipse(72, 58, 6, 1, "K"), ellipse(96, 67, 6, 1, "K"),
    ellipse(122, 67, 6, 1, "K"), ellipse(147, 67, 6, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("muletto_fermo", 24, 67),
    stamp("isp_guanto", 72, 58),
    stamp("isp_cartella", 96, 67),
    stamp("capoturno", 122, 67),
    stamp("isp_foto", 147, 67)),
  layer("lampo", stamp("flash", 138, 51)),
)

// ================================================================ FESTA
// Il magazzino addobbato: festoni, striscione, tavolata con la tovaglia a quadri, pizze, panettone e spumante.
// Il tappo salta, i coriandoli cadono, tutti brindano (a turno). Per feste, cene, pizza del turno di notte, Superenalotto, derby.

// bandierine dei festoni, una per colore
;["R", "Y", "B", "G", "P", "O"].forEach((k, i) => sprite("_bandierina_" + i, { pivot: [2, 0] }, `${k}${k}${k}${k}\n.${k}${k}.\n.${k}${k}.\n..${k}.`))
group("_bandierine", ["_bandierina_0", "_bandierina_1", "_bandierina_2", "_bandierina_3", "_bandierina_4", "_bandierina_5"])
// lo striscione appeso alla scaffalatura
sprite("striscione_festa", { w: 44, h: 11, outline: "K" }, rect(0, 0, 44, 11, "W"), hline(0, 10, 44, "S"),
  text(6, 3, "EVVIVA!", "R"), px(2, 2, "B"), px(41, 2, "B"), px(2, 8, "G"), px(41, 8, "G"))
// la tavolata con la tovaglia a quadri bianchi e rossi
sprite("tavolata", { w: 100, h: 16, outline: "K", pivot: "bottom" },
  rect(0, 0, 100, 2, "W"), hline(0, 1, 100, "S"),
  rect(0, 2, 100, 10, "W"), (c) => { for (let y = 2; y < 12; y += 2) for (let x = (y / 2) % 2 * 2; x < 100; x += 4) c.rect(x, y, 2, 2, "R") },
  hline(0, 11, 100, "r"), rect(3, 12, 3, 4, "M"), rect(94, 12, 3, 4, "M"))
sprite("pizza", { outline: "K", pivot: "bottom" }, `
  ..kkkkkk..
  .kRiRRiRk.
  kRRGRiRRRk
  .WWWWWWWW.`)
sprite("panettone", { outline: "K", pivot: "bottom" }, `
  ..MMMM..
  .MNNNNM.
  MNNNMNNM
  kkkkkkkk
  yqyqyqyq
  yqyqyqyq
  yqyqyqyq`)
sprite("bicchieri", { outline: "K", pivot: "bottom" }, "WW.WW\nSS.SS\nSS.SS")
// lo spumante: il tappo salta in alto con la schiuma, poi ricomincia
anim("spumante", { w: 14, h: 36, frames: LOOP, fps: FPS, pivot: [5, 36] },
  rect(4, 27, 4, 9, "g"), rect(5, 24, 2, 3, "g"), vline(5, 28, 6, "h"), rect(4, 31, 4, 3, "i"), hline(4, 35, 4, "G"),
  box(3, 23, 6, 13, "K"), px(3, 23, "."), px(8, 23, "."),
  (c) => {
    const f = c.frame
    if (f < 2) { c.rect(5, 22, 2, 2, "k"); c.hline(5, 23, 2, "Y"); return }
    const T = [[6, 18], [7, 13], [8, 9], [9, 6], [10, 4], [11, 3], [12, 3], [13, 4]][f - 2]
    if (T) { c.rect(T[0], T[1], 2, 2, "k"); c.px(T[0], T[1] + 1, "N") }                       // il tappo vola via
    const sp = f < 10 ? Math.min(f - 1, 5) : 2                                                  // la schiuma
    for (let i = 0; i < sp; i++) c.px(5 + ((i + f) % 3 === 0 ? 0 : 1) - (i % 2), 22 - i, i % 2 ? "W" : "C")
  })
// i festeggianti dietro la tavolata, ognuno coi suoi colori; brindano alzando il bicchiere
const FESTA = [
  ["_fe1", { testa: "lunghi", corpo: "seduto", swap: { B: "P", b: "p", M: "K" } }],
  ["_fe2", { testa: "corti", corpo: "seduto", abito: "gilet", swap: { B: "Y", b: "y", M: "m", F: "c", f: "x" } }],
  ["_fe3", { testa: "calvo", corpo: "seduto", abito: "completo", swap: { B: "D", b: "d", M: "S" } }],
  ["_fe4", { testa: "berretto", corpo: "seduto", swap: { B: "G", b: "g", M: "o", R: "B", r: "b" } }],
  ["_fe5", { testa: "lunghi", corpo: "seduto", abito: "gilet", swap: { B: "O", b: "o", M: "q" } }],
]
FESTA.forEach(([n, o]) => persona(n, o))
const SKIN = { _fe2: "c" }
FESTA.forEach(([n]) => {
  const pelle = SKIN[n] || "F", manica = { _fe1: "P", _fe2: "Y", _fe3: "D", _fe4: "G", _fe5: "O" }[n]
  anim(n.slice(1), { w: 13, h: 22, fps: FPS, outline: "K", pivot: [5, 22] }, stamp("_" + n, 0, 6),
    frame({ hold: 4 }, rect(9, 13, 2, 3, manica), px(10, 12, pelle), rect(10, 9, 2, 3, "L"), px(10, 9, "i"), px(11, 9, "i")),
    frame({ hold: 4 }, rect(9, 7, 2, 8, manica), px(10, 6, pelle), rect(10, 2, 2, 3, "L"), px(10, 2, "i"), px(11, 2, "i"), px(12, 1, "W")))
})
// coriandoli: cadono in tutta la scena, 5 pixel a fotogramma su un giro di 80 (16 × 5), girando su se stessi
const CORIANDOLI = Array.from({ length: 22 }, (_, i) => ({ x: Math.floor(rng(31 + i)() * SW), y: Math.floor(rng(91 + i)() * 80), k: "RYBGPOe"[i % 7] }))

scene("festa", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone"),
    wire(0, 4, 54, 4, 5, "K", { hang: "_bandierine", every: 5 }), wire(54, 4, 106, 4, 5, "K", { hang: "_bandierine", every: 5, seed: 3 }),
    wire(106, 4, SW, 4, 5, "K", { hang: "_bandierine", every: 5, seed: 5 }),
    stamp("striscione_festa", 57, 13)),
  layer("gente",
    stamp("fe1", 40, 51), stamp("fe2", 58, 51, { delay: 250 }), stamp("fe3", 77, 51, { delay: 500 }),
    stamp("fe4", 96, 51, { delay: 125 }), stamp("fe5", 115, 51, { delay: 375 })),
  layer("ombre", { shade: true }, ellipse(80, 67, 52, 2, "K")),
  layer("tavola",
    stamp("tavolata", 80, 67),
    stamp("pizza", 46, 52), stamp("pizza", 106, 52), stamp("panettone", 72, 52), stamp("bicchieri", 51, 52), stamp("bicchieri", 124, 52),
    stamp("spumante", 87, 52)),
  layer("coriandoli", (c) => CORIANDOLI.forEach((p, i) => {
    const y = (p.y + c.frame * 5) % 80, x = p.x + ((c.frame + i) % 4 < 2 ? 0 : 1)
    if (y < SH) { c.px(x, y, p.k); if ((c.frame + i) % 2) c.px(x + 1, y, p.k) }
  })),
)

// ================================================================ TALENTO
// Un talento in banchina: un raggio di sole dal lucernario cade su un magazziniere salito su un bancale, che alza la mappa
// del picking ridisegnata a mano; sopra la testa la lampadina dell'idea e le scintille. A sinistra il manager col fumetto «!»
// e il capoturno che applaude, il cane scodinzola; a destra la lavagna col grafico che sale. Per gli eventi b_* (talenti in banchina).

persona("_talento", { testa: "corti", abito: "gilet", swap: { B: "O", b: "o", M: "N" } })
persona("_manager", { testa: "calvo", abito: "completo", swap: { B: "d", b: "K", M: "s", D: "K", R: "R" } })
// il bancale su cui è salito
sprite("bancale", { w: 18, h: 3, outline: "K", pivot: "bottom" }, hline(0, 0, 18, "k"), hline(0, 1, 18, "m"), rect(0, 1, 2, 1, "k"), rect(8, 1, 2, 1, "k"),
  rect(16, 1, 2, 1, "k"), hline(0, 2, 18, "N"))
// il magazziniere alza la mappa del magazzino ridisegnata con gli evidenziatori: la sventola su e giù
anim("eureka", { w: 18, h: 26, fps: FPS, outline: "K", pivot: [5, 26] }, stamp("__talento", 0, 6),
  frame({ hold: 4 }, rect(9, 9, 2, 7, "O"), px(10, 8, "F"), rect(10, 1, 7, 7, "W"), hline(11, 2, 4, "Y"), hline(11, 4, 2, "G"), px(14, 4, "R"), hline(11, 6, 5, "B"), vline(16, 1, 7, "S")),
  frame({ hold: 4 }, rect(9, 10, 2, 6, "O"), px(10, 9, "F"), rect(10, 2, 7, 7, "W"), hline(11, 3, 4, "Y"), hline(11, 5, 2, "G"), px(14, 5, "R"), hline(11, 7, 5, "B"), vline(16, 2, 7, "S")))
// la lampadina dell'idea, accesa
sprite("lampadina", { outline: "K", pivot: "bottom" }, `
  .YYY.
  YiiYY
  YiYYy
  YYYYy
  .YYy.
  ..s..
  .sSs.
  ..s..`)
// i raggi della lampadina e le scintille intorno: si accendono a turno (giri da 8 fotogrammi)
const SCINTILLE = [[-14, 12, 0], [12, 4, 3], [-10, 30, 5], [16, 24, 2], [-2, -6, 6]]
anim("scintille", { w: 48, h: 48, frames: LOOP, fps: FPS, pivot: [24, 24] }, (c) => {
  // i raggi della lampadina (in mezzo al raggio di sole servono gialli scuri): lunghi e corti a turno
  // dietro la lampadina un alone chiaro che pulsa, così i raggi si leggono anche sopra le scaffalature
  const lungo = c.frame % 4 < 2, R = [[0, -1, 8], [-1, -1, 6], [1, -1, 6], [-1, 0, 8], [1, 0, 8]]
  c.circ(24, 21, lungo ? 7 : 6, "C"); c.circ(24, 21, lungo ? 5 : 4, "i")
  R.forEach(([a, b, d]) => { const x0 = 24 + a * d, y0 = 21 + b * d; c.px(x0, y0, "W"); c.px(x0 + a, y0 + b, "W"); if (lungo) c.px(x0 + 2 * a, y0 + 2 * b, "Y") })
  SCINTILLE.forEach(([dx, dy, f0]) => {
    const t = (c.frame + f0) % 8, x = 24 + dx, y = 24 + dy
    if (t === 0 || t === 4) c.px(x, y, "Y")
    else if (t === 1 || t === 3) { c.px(x, y, "W"); c.px(x - 1, y, "i"); c.px(x + 1, y, "i"); c.px(x, y - 1, "i"); c.px(x, y + 1, "i") }
    else if (t === 2) { c.px(x, y, "W"); [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([a, b]) => c.px(x + a, y + b, "i")); [[-2, 0], [2, 0], [0, -2], [0, 2]].forEach(([a, b]) => c.px(x + a, y + b, "Y")) }
  })
})
// il manager col fumetto «!» che spunta e rimbalza
sprite("manager", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__manager"))
sprite("_fumetto", { w: 7, h: 9 }, rect(0, 0, 7, 7, "W"), px(1, 7, "W"), px(1, 8, "W"), rect(3, 1, 1, 3, "R"), px(3, 5, "R"))
anim("fumetto", { w: 9, h: 12, frames: LOOP, fps: FPS, outline: "K", pivot: [1, 12] }, (c) => {
  const t = c.frame % 8; if (t > 5) return
  c.stamp("_fumetto", 1, t === 0 ? 3 : t === 1 ? 1 : 2)
})
// il capoturno che applaude
anim("applauso", { w: 10, h: 20, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__capoturno"),
  frame({ hold: 2 }, px(1, 14, "O"), px(8, 14, "O"), px(1, 13, "F"), px(8, 13, "F")),
  frame({ hold: 2 }, rect(2, 13, 2, 2, "O"), rect(6, 13, 2, 2, "O"), px(4, 12, "F"), px(5, 12, "F")))
// la lavagna sul cavalletto: il grafico sale un punto alla volta, poi resta e lampeggia «+12%»
const PUNTI = [[3, 17], [7, 16], [11, 17], [15, 13], [19, 12], [23, 8], [27, 5]]
anim("lavagna", { w: 34, h: 36, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  vline(5, 22, 14, "N"), vline(28, 22, 14, "N"), vline(4, 30, 6, "M"), vline(29, 30, 6, "M"), hline(5, 28, 24, "M"),     // cavalletto
  rect(0, 0, 34, 24, "S"), rect(1, 1, 32, 22, "W"), hline(1, 22, 32, "S"), rect(2, 23, 30, 1, "s"),                       // lavagna
  vline(3, 3, 17, "D"), hline(3, 20, 28, "D"),                                                                              // assi
  px(26, 23, "R"), px(28, 23, "B"),                                                                                         // pennarelli
  (c) => {
    const n = Math.min(PUNTI.length, c.frame + 1)
    for (let i = 1; i < n; i++) c.line(PUNTI[i - 1][0] + 1, PUNTI[i - 1][1] + 1, PUNTI[i][0] + 1, PUNTI[i][1] + 1, "G")
    for (let i = 0; i < n; i++) c.px(PUNTI[i][0] + 1, PUNTI[i][1] + 1, "g")
    if (n === PUNTI.length) { c.line(25, 4, 28, 4, "G"); c.line(28, 4, 28, 7, "G") }                                      // la freccia in cima
    if (c.frame >= 8 && c.frame % 4 < 2) c.text(5, 3, "+12%", "R")
  })

scene("talento", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  // il raggio di sole dal lucernario, e la pozza di luce sul pavimento
  layer("raggio", { light: true }, poly([92, 3, 108, 3, 111, 66, 81, 66], "W")),
  layer("pozza", { light: true }, ellipse(96, 66, 17, 3, "W")),
  layer("ombre", { shade: true }, ellipse(22, 67, 6, 1, "K"), ellipse(40, 67, 6, 1, "K"), ellipse(56, 67, 6, 1, "K"), ellipse(138, 67, 13, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("cane", 22, 67),
    stamp("manager", 40, 67),
    stamp("applauso", 56, 67),
    stamp("bancale", 96, 66),
    stamp("eureka", 92, 63),
    stamp("lavagna", 138, 67)),
  layer("sopra",
    stamp("scintille", 92, 31),
    stamp("lampadina", 92, 34),
    stamp("fumetto", 45, 44)),
)

// ================================================================ TRASLOCO
// Il capannone che si svuota: a sinistra le scaffalature smontate (i montanti nudi, i correnti a terra), in mezzo i pallet
// avvolti nel film pronti a partire, a destra il portone aperto con la navetta accostata alla ribalta (le quattro frecce accese).
// Il muletto carica, un magazziniere avvolge un pallet col rotolo di film, il capoturno suda, e il gatto del magazzino
// guarda tutto dall'alto degli scatoloni muovendo la coda. Per gli eventi della fonte «Trasloco».

const PORTA = { x: 104, y: 8, w: 48 }      // il portone sezionale aperto sulla parete di fondo
// un pallet avvolto nel film: il carico un po' azzurrino, le fasce del film più chiare, il riflesso sul lato in luce
function filmato(x, y, alto) {
  const top = y + 10 - alto
  return [rect(x, y + 10, 16, 2, "k"), hline(x, y + 11, 16, "N"), px(x + 1, y + 11, "m"), px(x + 7, y + 11, "m"), px(x + 14, y + 11, "m"),
    rect(x + 1, top, 14, alto, "L"), ...Array.from({ length: Math.floor(alto / 3) }, (_, i) => hline(x + 1, top + 1 + i * 3, 14, "W")),
    vline(x + 13, top, alto, "B"), vline(x + 14, top, alto, "B"), vline(x + 3, top + 1, alto - 2, "W"), hline(x + 1, top + alto - 1, 14, "B")]
}
sprite("_vuoto", { w: SW, h: SH },
  rect(0, 0, SW, PAV, "S"),                                                    // parete di fondo
  rect(0, 0, SW, 3, "d"), ...[10, 50, 90, 130].map((x) => [rect(x, 0, 20, 2, "L"), hline(x, 0, 20, "W")]).flat(),  // lucernari
  // le scaffalature smontate: restano i montanti, e sulla parete i segni più chiari dove poggiavano i correnti
  ...LIVELLI.map((yb) => hline(0, yb + 3, 78, "W")),
  ...[0, 38, 76].map((x) => [rect(x, 0, 2, PAV, "b"), vline(x, 0, PAV, "B"), ...[8, 16, 24, 32, 40].map((y) => px(x + 1, y, "d"))]).flat(),
  rect(38, LIVELLI[0] + 2, 40, 2, "O"), hline(38, LIVELLI[0] + 3, 40, "o"),   // l'ultimo corrente ancora su
  ...filmato(41, LIVELLI[0] - 10, 8),                                           // e l'ultimo pallet da tirare giù
  // il portone aperto: il telo arrotolato in alto, le guarnizioni scure, dentro il bilico della navetta col cassone aperto
  rect(PORTA.x - 2, PORTA.y - 2, PORTA.w + 4, PAV - PORTA.y + 2, "D"),
  rect(PORTA.x, PORTA.y, PORTA.w, PAV - PORTA.y, "K"),
  rect(PORTA.x, PORTA.y, PORTA.w, 4, "s"), hline(PORTA.x, PORTA.y + 1, PORTA.w, "S"), hline(PORTA.x, PORTA.y + 3, PORTA.w, "j"),
  rect(PORTA.x, PORTA.y + 4, PORTA.w, 5, "L"), hline(PORTA.x, PORTA.y + 8, PORTA.w, "B"),   // fuori, sopra il bilico, il cielo
  rect(PORTA.x + 2, PORTA.y + 9, PORTA.w - 4, PAV - PORTA.y - 12, "S"),        // il telaio posteriore del cassone
  hline(PORTA.x + 2, PORTA.y + 9, PORTA.w - 4, "W"), vline(PORTA.x + PORTA.w - 3, PORTA.y + 9, PAV - PORTA.y - 12, "j"),
  rect(PORTA.x + 5, PORTA.y + 11, PORTA.w - 10, PAV - PORTA.y - 16, "d"),      // dentro il cassone, al buio
  ...[12, 20, 28, 36].map((x) => vline(PORTA.x + x, PORTA.y + 11, PAV - PORTA.y - 16, "D")),   // le centine
  ...filmato(PORTA.x + 7, PAV - 17, 8), ...filmato(PORTA.x + 24, PAV - 17, 6),  // i pallet già caricati
  rect(PORTA.x + 2, PAV - 5, PORTA.w - 4, 2, "j"), hline(PORTA.x + 2, PAV - 5, PORTA.w - 4, "s"),   // il pianale e la traversa paracolpi
  // la ribalta: il piano abbassato giallo e nero sul bordo, i respingenti neri ai lati
  ...Array.from({ length: 12 }, (_, i) => rect(PORTA.x + 4 * i, PAV - 3, 2, 3, i % 2 ? "K" : "Y")),
  rect(PORTA.x - 2, PAV - 7, 3, 5, "K"), rect(PORTA.x + PORTA.w - 1, PAV - 7, 3, 5, "K"),
  rect(0, PAV, SW, SH - PAV, "S"), hline(0, PAV, SW, "s"),                    // pavimento in cemento
  rect(0, 50, SW, 1, "Y"), rect(0, 69, SW, 1, "Y"),                          // strisce gialle della corsia
  ...[0, 4, 8, 12, 16, 20].map((d) => line(PORTA.x + 6 + d, PAV + 1, PORTA.x + 2 + d, PAV + 4, "y")))   // la zona di carico tratteggiata

// i correnti delle scaffalature smontati, impilati a terra
sprite("correnti", { w: 30, h: 7, outline: "K", pivot: "bottom" },
  ...[0, 2, 4].map((y, i) => [rect(i, y, 30 - 2 * i, 2, "O"), hline(i, y + 1, 30 - 2 * i, "o"), px(i, y, "d"), px(29 - i, y, "d")]).flat(),
  rect(4, 6, 2, 1, "N"), rect(24, 6, 2, 1, "N"))
// la pila di scatoloni del trasloco, con le frecce «alto» e il nastro marrone
sprite("scatoloni", { w: 20, h: 21, outline: "K", pivot: "bottom" },
  rect(0, 11, 20, 10, "k"), vline(9, 11, 10, "N"), hline(0, 11, 20, "q"), rect(3, 14, 1, 3, "K"), px(2, 15, "K"), px(4, 15, "K"),
  rect(3, 0, 14, 11, "k"), vline(9, 0, 11, "N"), hline(3, 0, 14, "q"), vline(16, 1, 10, "N"), rect(12, 3, 1, 3, "K"), px(11, 4, "K"), px(13, 4, "K"),
  vline(19, 12, 9, "N"))
// il gatto del magazzino, seduto sugli scatoloni: muove la coda (giro di 4)
anim("gatto", { w: 12, h: 11, fps: FPS, outline: "K", pivot: "bottom" }, `
  .O...O......
  .OO.OO......
  .OOOOO......
  .OKOKO......
  .OOWOO......
  ..oWo.......
  ..OOOO......
  .OoOOOO.....
  .OoOOOOO....
  .OoOOOOO....
  .WW.WWoo....`,
  frame({ hold: 2 }, px(8, 9, "o"), px(9, 8, "O"), px(10, 7, "O"), px(10, 6, "O")),
  frame({ hold: 2 }, px(8, 10, "o"), px(9, 10, "O"), px(10, 9, "O"), px(11, 8, "O")))
// il magazziniere che avvolge il pallet: il rotolo di film sale e scende lungo il carico (giro di 8)
anim("avvolge", { w: 34, h: 22, frames: LOOP, fps: FPS, outline: "K", pivot: [17, 22] },
  stamp("__magazziniere", 0, 2),
  ...filmato(16, 10, 10).map((o) => o),
  (c) => {
    const y = [9, 8, 7, 6, 6, 7, 8, 9][c.frame % 8] + 4
    c.rect(12, y, 3, 4, "W"); c.vline(14, y, 4, "S"); c.px(12, y - 1, "s"); c.px(12, y + 4, "s")   // il rotolo
    c.line(15, y + 2, 17, y + 1, "W")                                                               // il film che si tende
    c.rect(9, y + 1, 3, 2, "F")                                                                     // le mani sul rotolo
  })
// la navetta: le quattro frecce che lampeggiano ai lati del cassone (giro di 8)
anim("frecce", { w: 46, h: 3, fps: FPS, pivot: [0, 0] },
  frame({ hold: 4 }, rect(0, 0, 2, 2, "O"), px(0, 0, "Y"), rect(44, 0, 2, 2, "O"), px(45, 0, "Y")),
  frame({ hold: 4 }, rect(0, 0, 2, 2, "o"), rect(44, 0, 2, 2, "o")))

scene("trasloco", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_vuoto"), stamp("frecce", PORTA.x + 1, PAV - 8)),
  layer("ombre", { shade: true }, ellipse(14, 67, 11, 1, "K"), ellipse(36, 67, 15, 1, "K"), ellipse(62, 67, 17, 2, "K"), ellipse(95, 66, 17, 2, "K"),
    ellipse(132, 67, 6, 1, "K"), ellipse(149, 67, 9, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("scatoloni", 14, 67),
    stamp("correnti", 36, 67),
    stamp("avvolge", 58, 67),
    stamp("muletto", 95, 66),
    stamp("capoturno", 132, 67)),
  layer("sopra", stamp("gatto", 13, 46), ...filmato(141, 55, 9)),
)

// ================================================================ INGRESSO DEL GIOCO (hall_*)
// L'interno del magazzino dietro i cartelli della schermata principale (showStart in src/game.html).
// Non è una scenetta 160×72: sono pezzi di misura libera che il gioco mette insieme col CSS a un ingrandimento intero.
// Soffitto e pavimento si ripetono in larghezza, lo scaffale in larghezza e in altezza (a partire dal pavimento);
// muletto, transpallet e cane stanno sul pavimento. esporta.py li porta con la trasparenza, fermi se non si muovono.
// prova_hall li mette insieme come nel gioco, per guardarli (non va nel gioco).
const HW = 160                       // larghezza dei pezzi che si ripetono: quattro campate da 40
const HL = 18                        // altezza di un livello dello scaffale (quattro livelli in un pezzo da 72)
const HR = rng(31)
const HSC = ["k", "k", "k", "k", "k", "k", "k", "B", "T"]   // quasi tutto cartone: dietro il tabellone lo scaffale deve stare calmo
// scaffalatura porta-pallet vista di fronte: montanti blu ogni 40, correnti arancioni con le etichette di ubicazione,
// due pallet per vano, quasi tutti di cartone; dietro il fondo in ombra. Qualche posto vuoto, perché lo scaffale non è mai pieno.
function hallScaffale() {
  const it = [rect(0, 0, HW, 72, "j")]
  for (let l = 0; l < 4; l++) {
    const yb = l * HL + 16
    for (let v = 0; v < 4; v++) for (let p = 0; p < 2; p++) {
      const x = v * 40 + 4 + p * 18
      if (HR() < 0.16) { it.push(rect(x + 1, yb - 1, 14, 1, "s")); continue }   // posto vuoto: solo la polvere sul corrente
      const tipo = HSC[Math.floor(HR() * HSC.length)], alto = 6 + Math.floor(HR() * 4)
      it.push(...merce(x, yb - 12, tipo, alto))
    }
    it.push(rect(0, yb, HW, 2, "O"), hline(0, yb + 1, HW, "o"))
    for (let v = 0; v < 4; v++) for (let p = 0; p < 2; p++) {
      const x = v * 40 + 4 + p * 18 + 6
      it.push(rect(x, yb, 4, 2, "W"), px(x + 1, yb + 1, "K"), px(x + 2, yb + 1, "K"))    // etichetta col codice a barre
    }
  }
  for (let v = 0; v < 4; v++) {
    const x = v * 40
    it.push(rect(x, 0, 2, 72, "b"), vline(x, 0, 72, "B"), ...Array.from({ length: 12 }, (_, i) => px(x + 1, 3 + i * 6, "d")))
  }
  return it
}
scene("hall_scaffale", { w: HW, h: 72, wrap: true }, ...hallScaffale())

// il soffitto: lamiera scura coi lucernari, la trave reticolare e le lampade a campana appese; sotto è trasparente
function hallSoffitto() {
  const it = [rect(0, 0, HW, 10, "d")]
  ;[12, 92].forEach((x) => it.push(rect(x, 2, 36, 5, "L"), hline(x, 2, 36, "W"), hline(x, 6, 36, "B"), ...[12, 24].map((d) => vline(x + d, 2, 5, "D"))))
  it.push(rect(0, 10, HW, 7, "_"), hline(0, 10, HW, "D"), hline(0, 16, HW, "D"), hline(0, 17, HW, "K"))   // correnti della trave
  for (let x = 0; x < HW; x += 10) it.push(line(x, 11, x + 5, 15, "D"), line(x + 5, 15, x + 10, 11, "D"))
  ;[20, 100].forEach((x) => it.push(vline(x, 18, 4, "K"), rect(x - 1, 21, 3, 1, "K"),
    rect(x - 4, 22, 9, 3, "D"), hline(x - 3, 22, 7, "j"), hline(x - 4, 24, 9, "d"), rect(x - 3, 25, 7, 1, "i"), px(x, 25, "W")))
  return it
}
scene("hall_soffitto", { w: HW, h: 27, wrap: "x" }, ...hallSoffitto())

// il pavimento in cemento: l'ombra sotto lo scaffale, le strisce gialle della corsia, i giunti delle lastre
scene("hall_pavimento", { w: HW, h: 40, bg: "S", wrap: "x" },
  rect(0, 0, HW, 2, "s"), hline(0, 2, HW, "j"),
  rect(0, 6, HW, 2, "Y"), rect(0, 35, HW, 2, "Y"),
  ...[30, 110].map((x) => vline(x, 9, 25, "s")), ...[30, 110].map((x) => vline(x + 1, 9, 25, "W")))

// il muletto che passa con un pallet di scatole sulle forche: ruote che girano, lampeggiante acceso
anim("_muletto_va", { w: 31, h: 31, frames: LOOP, fps: FPS, outline: "K" },
  stamp("__mulettista", 12, 4),
  stamp("_muletto", 0, 3),
  (c) => {
    const y = 19
    c.rect(0, y, 7, 1, "K"); c.rect(5, y - 6, 2, 6, "s")
    c.rect(0, y - 2, 5, 2, "k"); c.hline(0, y - 1, 5, "N")
    c.rect(0, y - 9, 5, 7, "k"); c.vline(2, y - 9, 7, "N"); c.hline(0, y - 9, 5, "q")
  },
  (c) => { const on = c.frame % 4 < 2; c.rect(15, 3, 3, 2, on ? "O" : "o"); if (on) { c.px(14, 2, "Y"); c.px(18, 2, "Y") } },
  (c) => { const [dx, dy] = [[0, -2], [2, 0], [0, 2], [-2, 0]][c.frame % 4]; [13, 24].forEach((x) => c.px(x + dx, 27 + dy, "D")) })
scene("hall_muletto", { w: 33, h: 33 }, stamp("_muletto_va", 0, 0))
scene("hall_transpallet", { w: 37, h: 26 }, stamp("transpallet", 18, 25))
scene("hall_cane", { w: 15, h: 14 }, stamp("cane", 7, 14))

// prova: i pezzi messi insieme come nella schermata principale (a 1×)
scene("prova_hall", { w: 320, h: 180, bg: "j" },
  pattern("hall_scaffale", 0, -76, 320, 216),
  pattern("hall_soffitto", 0, 0, 320, 27),
  pattern("hall_pavimento", 0, 140, 320, 40),
  stamp("transpallet", 60, 172), stamp("cane", 270, 172), stamp("_muletto_va", 170, 141))

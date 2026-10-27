// Scenette delle storie del pacchetto Shift Happens (docs/espansione_eventi.md): una per storia, più la mattina dopo la cena.
// Riusa i pezzi del magazzino (magazzino.px.js: capannone, muletto, transpallet, cane, tavolata, festeggianti, applauso) e gli omini
// di comune.px.js. Tutti i nomi nuovi cominciano con st_ (o ST_), per non pestare quelli dei file inclusi.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/scene_pxl/storie.px.js lontra
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("magazzino.px.js", { palette: true })

// ================================================================ pezzi in comune
// un bancale vuoto e una pila di colli, per riempire il pavimento
sprite("st_scatole", { w: 18, h: 14, outline: "K", pivot: "bottom" }, ...merce(1, 2, "k", 9))
// il cuore (rosso, col lato chiaro), in due misure
sprite("st_cuore", { pivot: "center" }, ".RR.RR.\nReeRRRR\nReRRRRR\n.RRRRR.\n..RRR..\n...R...")
sprite("st_cuorino", { pivot: "center" }, "R.R\nRRR\n.R.")
// la facciata del magazzino vista dal piazzale (come quella di eventi.px.js): cielo, pannelli, fascia, due portoni, asfalto
function stFacciata(cielo = "B") {
  return [
    rect(0, 0, SW, 9, cielo === "B" ? "L" : cielo), rect(0, 0, SW, 3, cielo),
    ellipse(30, 6, 9, 2, "W"), ellipse(118, 4, 12, 2, "W"),
    rect(0, 9, SW, 47, "S"), ...Array.from({ length: 20 }, (_, i) => vline(i * 8 + 4, 13, 43, "s")),
    rect(0, 8, SW, 1, "K"), rect(0, 9, SW, 4, "T"), hline(0, 12, SW, "t"),
    ...[64, 112].map((x) => [rect(x, 22, 30, 34, "j"), ...[25, 29, 33, 37, 41, 45, 49, 53].map((y) => hline(x, y, 30, "s")), box(x - 1, 21, 32, 35, "D"),
      rect(x - 3, 50, 2, 6, "K"), rect(x + 31, 50, 2, 6, "K")]).flat(),
    rect(0, 56, SW, 16, "D"), hline(0, 56, SW, "d"), ...[0, 24, 48, 72, 96, 120, 144].map((x) => hline(x + 4, 70, 12, "Y"))]
}

// ================================================================ LONTRA
// Una lontra tra i bancali: corre avanti e indietro sul pavimento, il magazziniere la insegue con la scopa,
// la volontaria la riprende col telefono. Per la storia della lontra (prima, terza e quarta puntata).

// la lontra di profilo, verso destra: due pose delle zampe (corsa)
const ST_LONTRA = `
  ................MM..
  ...MMMMMMMNNNNNNNNM.
  MMNNNNNNNNNNNNNNNKNN
  .MNNNNNNNNNNNNNNNCCCK
  ....NNNNNNNNNNNNCCC.`
sprite("_st_lontra_a", { w: 21, h: 7 }, grid(0, 0, ST_LONTRA), px(5, 5, "M"), px(4, 6, "M"), px(14, 5, "M"), px(15, 6, "M"))
sprite("_st_lontra_b", { w: 21, h: 7 }, grid(0, 0, ST_LONTRA), px(6, 5, "M"), px(6, 6, "M"), px(13, 5, "M"), px(13, 6, "M"))
sprite("_st_lontra_al", { base: "_st_lontra_a", flip: "x" })
sprite("_st_lontra_bl", { base: "_st_lontra_b", flip: "x" })
// il pesce rubato, lasciato sul pavimento
sprite("st_pesce", { outline: "K", pivot: "bottom" }, "j.jjjj.\njjjjKjj\nj.jjjj.")
// corre a destra per 8 fotogrammi e torna indietro per altri 8, alternando le zampe
anim("st_lontra", { w: 68, h: 9, frames: LOOP, fps: FPS, outline: "K", pivot: [0, 9] }, (c) => {
  const f = c.frame, x = f < 8 ? 2 + f * 6 : 2 + (15 - f) * 6, gamba = f % 2 ? "b" : "a", dir = f < 8 ? "" : "l"
  c.stamp(`_st_lontra_${gamba}${dir}`, x, f % 2 ? 1 : 2)
})
// il magazziniere con la scopa: la scopa spazza avanti e indietro
persona("_st_scopa", { testa: "berretto", abito: "gilet", swap: { B: "O", b: "o", M: "m", R: "G", r: "g" } })
anim("st_scopa", { w: 22, h: 22, fps: FPS, outline: "K", pivot: [12, 22] }, stamp("__st_scopa", 10, 2),
  frame({ hold: 2 }, line(10, 12, 3, 20, "N"), rect(0, 19, 6, 3, "y"), hline(0, 21, 6, "q")),
  frame({ hold: 2 }, line(10, 12, 6, 20, "N"), rect(3, 19, 6, 3, "y"), hline(3, 21, 6, "q")))
// la volontaria col telefono alzato: lo schermo lampeggia (sta riprendendo), il fumetto «!»
persona("_st_volontaria", { testa: "lunghi", abito: "gilet", swap: { B: "T", b: "t", M: "N" } })
anim("st_volontaria", { w: 14, h: 26, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 26] }, stamp("__st_volontaria", 0, 6),
  rect(9, 9, 2, 7, "T"), px(10, 8, "F"), rect(10, 3, 4, 6, "K"),
  (c) => { c.rect(11, 4, 2, 4, c.frame % 4 < 2 ? "L" : "B"); if (c.frame % 8 < 4) c.px(13, 2, "R") })

scene("lontra", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(30, 67, 9, 1, "K"), ellipse(126, 67, 10, 1, "K"), ellipse(148, 67, 9, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("pila_pallet", 148, 66),
    stamp("st_scatole", 104, 61),
    stamp("st_volontaria", 24, 67),
    stamp("st_scopa", 126, 67),
    stamp("st_pesce", 92, 67),
    stamp("st_lontra", 38, 68)),
  layer("sopra", stamp("fumetto", 34, 41)),
)

// ================================================================ TICCHETOCC
// Il pickerista famoso: balla tra gli scaffali col telefono sul bastone, i cuoricini salgono dallo schermo,
// in alto il contatore dei follower; il capoturno guarda con la mano sulla fronte.
persona("_st_picker", { testa: "berretto", abito: "gilet", swap: { B: "Y", b: "y", M: "K", F: "c", f: "x", R: "P", r: "p" } })
// balla: su e giù, le braccia a turno, il bastone del telefono nella mano destra
anim("st_picker", { w: 22, h: 34, frames: LOOP, fps: FPS, outline: "K", pivot: [6, 34] }, (c) => {
  const f = c.frame, su = f % 4 < 2 ? 0 : 1, y0 = 13 + su
  c.stamp("__st_picker", 1, y0)
  c.line(10, y0 + 11, 16, y0 - 3, "s"); c.rect(14, y0 - 9, 5, 7, "K"); c.rect(15, y0 - 8, 3, 5, f % 8 < 4 ? "L" : "B"); c.px(15, y0 - 8, "R")   // bastone e telefono
  if (f % 8 < 4) { c.rect(0, y0 + 1, 2, 7, "Y"); c.px(0, y0, "c") } else { c.rect(0, y0 + 9, 2, 3, "Y") }                                  // il braccio libero, su e giù
})
// i cuoricini che salgono dal telefono, ognuno col suo ritmo
anim("st_cuoricini", { w: 32, h: 42, frames: LOOP, fps: FPS, pivot: [15, 40] }, (c) => {
  ;[[4, 0, "R"], [14, 5, "e"], [22, 10, "P"], [9, 12, "R"], [19, 3, "e"]].forEach(([x, f0, k]) => {
    const t = (c.frame + f0) % 16, y = 38 - t * 2.4, dx = (t >> 2) % 2
    if (t < 15) { const X = x + dx, Y = Math.round(y); c.rect(X, Y, 2, 1, k); c.rect(X + 3, Y, 2, 1, k); c.hline(X, Y + 1, 5, k); c.hline(X + 1, Y + 2, 3, k); c.px(X + 2, Y + 3, k) }
  })
})
// il cartellino «LIVE» e il contatore dei follower
sprite("st_live", { w: 19, h: 7, outline: "K" }, rect(0, 0, 19, 7, "R"), text(2, 1, "LIVE", "W"))
anim("st_follower", { w: 27, h: 9, frames: LOOP, fps: FPS, outline: "K" }, rect(0, 0, 27, 9, "W"), hline(0, 8, 27, "S"), px(2, 3, "R"), px(4, 3, "R"), hline(2, 4, 3, "R"), px(3, 5, "R"),
  (c) => { c.text(7, 2, ["400K", "401K", "402K", "404K"][c.frame >> 2], "K") })
// il capoturno con la mano sulla fronte
persona("_st_capo2", { testa: "elmetto", abito: "gilet", swap: { B: "O", b: "o", M: "s" } })
sprite("st_capo_fronte", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__st_capo2"), rect(7, 5, 3, 2, "F"), rect(8, 7, 2, 6, "O"))

scene("ticchetocc", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(78, 67, 9, 1, "K"), ellipse(130, 67, 6, 1, "K"), ellipse(36, 67, 18, 2, "K")),
  layer("cose", { sort: "y" },
    stamp("transpallet", 36, 67),
    stamp("st_picker", 78, 67),
    stamp("st_capo_fronte", 130, 67)),
  layer("sopra", stamp("st_cuoricini", 92, 40), stamp("st_live", 98, 4), stamp("st_follower", 120, 4)),
)

// ================================================================ URLO
// Il manager tiranno urla in banchina: il fumetto coi segni che tremano, le onde del grido, il cronometro in mano;
// i magazzinieri sbucano da dietro i colli e si rinascondono, uno si tappa le orecchie.
persona("_st_tiranno", { testa: "calvo", abito: "completo", swap: { B: "d", b: "K", M: "s", D: "K", R: "R" } })
anim("st_tiranno", { w: 16, h: 22, frames: LOOP, fps: FPS, outline: "K", pivot: [6, 22] }, (c) => {
  const s = c.frame % 2
  c.stamp("__st_tiranno", s, 2)
  c.rect(6 + s, 9, 3, 2, "K"); c.px(7 + s, 10, "R")                           // la bocca spalancata
  c.rect(1 + s, 6, 2, 1, "K"); c.rect(6 + s, 6, 2, 1, "K")                    // le sopracciglia aggrottate
  c.rect(10 + s, 12, 4, 2, "d"); c.circ(14, 12, 2, "W"); c.px(14, 11, "K"); c.px(14, 12, "K")   // il braccio col cronometro
  const t = c.frame % 8; if (t < 6) { c.px(1, 2 - (t >> 1), "W"); c.px(9, 1 - (t >> 1) + 1, "W"); if (t > 1) { c.px(0, 3 - (t >> 1), "S"); c.px(10, 2 - (t >> 1) + 1, "S") } }   // il fumo dalle orecchie
})
// il fumetto col grido: i segni cambiano e tremano
anim("st_grido", { w: 30, h: 16, frames: LOOP, fps: FPS, outline: "K", pivot: [4, 16] }, (c) => {
  const s = c.frame % 2
  c.rect(0 + s, 0, 30 - s, 12, "W"); c.hline(1, 11, 28, "S"); c.px(3, 12, "W"); c.px(3, 13, "W"); c.px(2, 14, "W")
  c.text(3 + s, 3, ["BASTA!", "FORZA!", "!!!!!!", "SVELTI"][c.frame >> 2], "R")
})
// le onde del grido
anim("st_onde", { w: 12, h: 14, frames: LOOP, fps: FPS, pivot: [0, 7] }, (c) => {
  const t = c.frame % 4
  if (t < 3) { c.vline(2 + t * 3, 7 - 2 - t, 5 + 2 * t, "W"); c.px(1 + t * 3, 7 - 3 - t, "W"); c.px(1 + t * 3, 7 + 3 + t, "W") }
})
// i magazzinieri dietro i colli: la testa spunta e si rinasconde
persona("_st_nasc1", { testa: "corti", swap: { B: "Y", b: "y", M: "N" } })
persona("_st_nasc2", { testa: "lunghi", swap: { B: "G", b: "g", M: "K", F: "c", f: "x" } })
anim("st_nascosto1", { w: 12, h: 24, frames: LOOP, fps: FPS, pivot: [5, 24] }, (c) => { const y = [14, 14, 10, 8, 6, 6, 6, 6, 6, 6, 8, 10, 14, 14, 14, 14][c.frame]; c.stamp("__st_nasc1", 1, y) })
anim("st_nascosto2", { w: 12, h: 24, frames: LOOP, fps: FPS, pivot: [5, 24] }, (c) => { const y = [6, 6, 8, 10, 14, 14, 14, 14, 14, 14, 14, 10, 8, 6, 6, 6][c.frame]; c.stamp("__st_nasc2", 1, y) })
// il carrellista con le mani sulle orecchie
persona("_st_orecchie", { testa: "berretto", abito: "gilet", swap: { B: "O", b: "o", M: "K", R: "B", r: "b" } })
sprite("st_orecchie", { w: 12, h: 20, outline: "K", pivot: [6, 20] }, stamp("__st_orecchie", 1, 0), rect(0, 4, 2, 3, "F"), rect(10, 4, 2, 3, "F"), rect(0, 7, 2, 4, "O"), rect(10, 7, 2, 4, "O"))
sprite("st_muro_colli", { w: 34, h: 16, outline: "K", pivot: "bottom" }, ...merce(0, 4, "k", 10), ...merce(17, 4, "G", 9))

scene("urlo", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(62, 67, 9, 1, "K"), ellipse(128, 67, 18, 2, "K"), ellipse(26, 67, 7, 1, "K")),
  layer("dietro", stamp("st_nascosto1", 120, 62), stamp("st_nascosto2", 136, 62)),
  layer("cose", { sort: "y" },
    stamp("st_muro_colli", 128, 67),
    stamp("st_orecchie", 26, 67),
    stamp("st_tiranno", 62, 67)),
  layer("sopra", stamp("st_grido", 66, 36), stamp("st_onde", 72, 55)),
)

// ================================================================ MATTINA
// La mattina dopo la cena nelle Langhe: alle 6 in banchina ci sono solo in due. Uno seduto su un bancale con gli occhiali
// da sole e il caffè (e la «z» che sale), l'altro in piedi col ghiaccio in testa, che ondeggia. L'orologio segna le 6.
persona("_st_seduto", { testa: "corti", corpo: "seduto", abito: "gilet", swap: { B: "O", b: "o", M: "K" } })
anim("st_sonno", { w: 18, h: 30, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 30] }, stamp("bancale", 0, 27),
  (c) => { const y = c.frame % 8 < 4 ? 11 : 12; c.stamp("__st_seduto", 2, y); c.rect(3, y + 5, 7, 2, "K"); c.px(5, y + 5, "d")    // gli occhiali da sole
    c.rect(11, y + 13, 3, 3, "W"); c.hline(11, y + 13, 3, "m")
    const t = c.frame % 8; c.text(12, 6 - Math.min(t, 6), "Z", t < 6 ? "W" : "S") })
persona("_st_ghiaccio", { testa: "lunghi", abito: "gilet", swap: { B: "Y", b: "y", M: "q" } })
anim("st_ghiaccio", { w: 12, h: 24, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 24] }, (c) => {
  const dx = [0, 0, 1, 1, 1, 0, 0, -1, -1, -1, 0, 0, 1, 1, 0, 0][c.frame] + 1
  c.stamp("__st_ghiaccio", dx, 4); c.rect(dx + 1, 1, 8, 4, "B"); c.hline(dx + 1, 4, 8, "b"); c.px(dx + 3, 2, "W"); c.px(dx + 6, 2, "L"); c.px(dx + 4, 3, "L"); c.rect(dx + 4, 0, 2, 1, "R")   // la borsa del ghiaccio, col tappo rosso
  c.rect(dx + 1, 9, 8, 2, "K") })
sprite("st_orologio6", { w: 15, h: 15, outline: "K" }, circ(7, 7, 7, "W"), circ(7, 7, 6, "C"), vline(7, 2, 6, "K"), vline(7, 8, 4, "K"), px(7, 7, "R"))

scene("mattina", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone"), stamp("st_orologio6", 72, 6)),
  layer("ombre", { shade: true }, ellipse(60, 67, 10, 1, "K"), ellipse(98, 67, 6, 1, "K"), ellipse(140, 67, 17, 2, "K")),
  layer("cose", { sort: "y" },
    stamp("transpallet", 140, 67),
    stamp("st_sonno", 58, 67),
    stamp("st_ghiaccio", 98, 67)),
)

// ================================================================ BANCALE
// Il bancale di nessuno: avvolto nel film nero, impolverato, con il punto di domanda che lampeggia; un magazziniere
// col taglierino si avvicina, il capoturno e una magazziniera si sporgono, il cane annusa.
sprite("st_nero", { w: 22, h: 21, outline: "K", pivot: "bottom" },
  rect(0, 17, 22, 2, "k"), hline(0, 18, 22, "N"), rect(0, 19, 3, 2, "k"), rect(9, 19, 4, 2, "k"), rect(19, 19, 3, 2, "k"),
  poly([2, 2, 6, 0, 13, 1, 19, 0, 21, 3, 21, 17, 1, 17, 1, 4], "d"), vline(20, 3, 14, "K"), vline(7, 2, 15, "K"), vline(14, 1, 16, "K"),
  ...[5, 9, 13].map((y) => hline(2, y, 18, "D")), line(3, 14, 6, 3, "j"), line(9, 12, 12, 4, "j"), line(16, 15, 18, 9, "j"),
  px(4, 2, "s"), px(16, 3, "s"), px(10, 8, "s"), px(18, 12, "s"), px(12, 15, "s"))
anim("st_domanda", { w: 11, h: 13, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 13] }, (c) => {
  const y = c.frame % 8 < 4 ? 0 : 1
  c.rect(0, y, 11, 10, "W"); c.hline(1, y + 9, 9, "S"); c.px(3, y + 10, "W"); c.px(3, y + 11, "W")
  c.hline(4, y + 2, 3, "R"); c.px(7, y + 3, "R"); c.px(6, y + 4, "R"); c.px(5, y + 5, "R"); c.px(5, y + 7, "R")
})
persona("_st_cutter", { testa: "berretto", abito: "gilet", swap: { B: "Y", b: "y", M: "m", F: "c", f: "x", R: "R", r: "r" } })
anim("st_cutter", { w: 16, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__st_cutter"),
  frame({ hold: 4 }, rect(9, 11, 3, 2, "Y"), rect(12, 11, 3, 1, "s")),
  frame({ hold: 4 }, rect(9, 10, 3, 2, "Y"), rect(12, 9, 3, 1, "s"), px(15, 9, "W")))
persona("_st_curiosa", { testa: "lunghi", abito: "gilet", swap: { B: "O", b: "o", M: "K", F: "c", f: "x" } })
anim("st_curiosa", { w: 12, h: 20, fps: FPS, outline: "K", pivot: [6, 20] },
  frame({ hold: 8 }, stamp("__st_curiosa", 0, 0)), frame({ hold: 8 }, stamp("__st_curiosa", 1, 0)))

scene("bancale_nero", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone")),
  layer("ombre", { shade: true }, ellipse(80, 67, 13, 2, "K"), ellipse(56, 67, 6, 1, "K"), ellipse(104, 67, 6, 1, "K"), ellipse(120, 67, 6, 1, "K"), ellipse(36, 68, 6, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("st_nero", 80, 66),
    stamp("st_cutter", 58, 67),
    stamp("capoturno", 104, 67),
    stamp("st_curiosa", 120, 67),
    stamp("cane", 36, 68)),
  layer("sopra", stamp("st_domanda", 80, 41)),
)

// ================================================================ CORSIA 13
// Il fantasma della corsia 13: il magazzino al buio, il cartello «13», il fascio della torcia del magazziniere
// che trema, il lenzuolo che fluttua e fa «uuh», le note della radiolina di Sanremo.
sprite("st_cartello13", { w: 13, h: 9, outline: "K" }, rect(0, 0, 13, 9, "W"), hline(0, 8, 13, "S"), text(3, 2, "13", "K"))
// il fantasma: un lenzuolo con due buchi, l'orlo che ondeggia, su e giù
anim("st_fantasma", { w: 16, h: 22, frames: LOOP, fps: FPS, outline: "K", pivot: [8, 22] }, (c) => {
  const y = [0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 1, 1, 0, 0][c.frame], o = c.frame % 4 < 2
  c.ellipse(8, y + 6, 6, 6, "W"); c.rect(2, y + 6, 13, 10, "W")
  c.vline(14, y + 6, 10, "S"); c.rect(5, y + 5, 2, 3, "K"); c.rect(10, y + 5, 2, 3, "K"); c.ellipse(8, y + 10, 1, 1, "K")
  for (let x = 2; x < 15; x++) c.px(x, y + 16 + ((x + (o ? 0 : 1)) % 3 === 0 ? 1 : 0), x === 14 ? "S" : "W")
})
// le note della radiolina, che salgono a turno
anim("st_note", { w: 20, h: 20, frames: LOOP, fps: FPS, pivot: [10, 20] }, (c) => {
  ;[[3, 0], [12, 8]].forEach(([x, f0]) => { const t = (c.frame + f0) % 16, y = 16 - t
    if (t < 12) { c.vline(x + 2, y, 4, "i"); c.px(x + 3, y, "i"); c.rect(x, y + 3, 2, 2, "i") } })
})
// il magazziniere con la torcia, che trema
persona("_st_torcia", { testa: "berretto", abito: "gilet", swap: { B: "Y", b: "y", M: "K", R: "D", r: "d" } })
anim("st_torcia", { w: 14, h: 20, frames: LOOP, fps: FPS, outline: "K", pivot: [5, 20] }, (c) => {
  const s = c.frame % 2; c.stamp("__st_torcia", s, 0); c.rect(9 + s, 10, 4, 2, "D"); c.px(13, 10 + s, "i") })
// il buio: tutto più scuro di due gradini, tranne il fascio della torcia
const ST_FASCIO = [50, 56, 160, 28, 160, 72, 56, 60]
const stFascio = (x, y) => { const [ax, ay, bx, by, , cy] = ST_FASCIO; if (x < ax) return false; const t = (x - ax) / (bx - ax), lo = ay + (by - ay) * t, hi = ay + (cy - ay) * t; return y >= lo && y <= hi }

scene("corsia13", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone"), stamp("st_cartello13", 101, 4)),
  layer("buio", { shade: 2 }, clip((x, y) => !stFascio(x, y), rect(0, 0, SW, SH, "K"))),
  layer("buio_bordo", { shade: 1 }, clip((x, y) => stFascio(x, y) && !stFascio(x, y - 3), rect(0, 0, SW, SH, "K"))),
  layer("ombre", { shade: true }, ellipse(44, 67, 6, 1, "K"), ellipse(118, 68, 6, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("st_torcia", 44, 67),
    stamp("st_fantasma", 118, 60)),
  layer("sopra", stamp("st_note", 140, 46)),
)

// ================================================================ PROPOSTA
// «Mi vuoi sposare?»: il muletto alza il bancale col cartello, il cuore grande pulsa sopra la coppia,
// il capoturno applaude, cadono cuoricini e coriandoli. Anche per il matrimonio in magazzino (coi festoni).
sprite("st_cartello", { w: 36, h: 11, outline: "K" }, rect(0, 0, 36, 11, "W"), hline(0, 10, 36, "S"), text(2, 3, "SPOSAMI?", "R"))
anim("st_muletto_cuore", { w: 38, h: 46, frames: LOOP, fps: FPS, outline: "K", pivot: [24, 46] },
  stamp("__mulettista", 19, 19), stamp("_muletto", 7, 18),
  (c) => { const H = [0, 1, 3, 5, 7, 9, 11, 12, 13, 13, 13, 13, 13, 12, 12, 13][c.frame], y = 38 - H
    c.rect(7, y, 7, 1, "K"); c.rect(12, y - 6, 2, 6, "s"); c.rect(1, y - 2, 12, 2, "k"); c.hline(1, y - 1, 12, "N")
    c.stamp("st_cartello", 0, y - 13) })
// la coppia, mano nella mano, e il cuore grande che pulsa sopra
persona("_st_sposo1", { testa: "corti", abito: "gilet", swap: { B: "O", b: "o", M: "N" } })
persona("_st_sposo2", { testa: "lunghi", abito: "gilet", swap: { B: "Y", b: "y", M: "K", F: "c", f: "x" } })
sprite("st_coppia", { w: 21, h: 20, outline: "K", pivot: "bottom" }, stamp("__st_sposo1", 0, 0), stamp("__st_sposo2", 11, 0), rect(9, 13, 3, 2, "F"))
anim("st_cuorone", { w: 15, h: 13, frames: LOOP, fps: FPS, outline: "K", pivot: [7, 13] },
  frame({ hold: 4 }, grid(2, 2, ".RR.RR.\nReeRRRR\nReRRRRR\n.RRRRR.\n..RRR..\n...R...")),
  frame({ hold: 4 }, grid(0, 0, ".RRR.RRR.\nReeeRRRRR\nReeRRRRRR\nReRRRRRRR\n.RRRRRRR.\n..RRRRR..\n...RRR...\n....R....")))
const ST_PIOGGIA = Array.from({ length: 18 }, (_, i) => ({ x: Math.floor(rng(57 + i)() * SW), y: Math.floor(rng(77 + i)() * 64), k: i % 3 ? "RYBGPe"[i % 6] : "c" }))

scene("proposta", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("_capannone"),
    wire(0, 4, 54, 4, 5, "K", { hang: "_bandierine", every: 5 }), wire(106, 4, SW, 4, 5, "K", { hang: "_bandierine", every: 5, seed: 5 })),
  layer("ombre", { shade: true }, ellipse(44, 67, 16, 2, "K"), ellipse(96, 67, 11, 1, "K"), ellipse(132, 67, 6, 1, "K"), ellipse(148, 67, 6, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("st_muletto_cuore", 44, 67),
    stamp("st_coppia", 96, 67),
    stamp("applauso", 132, 67),
    stamp("applauso", 148, 67, { delay: 250 })),
  layer("sopra", stamp("st_cuorone", 96, 44)),
  layer("pioggia", (c) => ST_PIOGGIA.forEach((p, i) => {
    const y = (p.y + c.frame * 4) % 64, x = p.x + ((c.frame + i) % 4 < 2 ? 0 : 1)
    if (p.k === "c") { if (y < 60) { c.px(x, y, "R"); c.px(x + 2, y, "R"); c.hline(x, y + 1, 3, "R"); c.px(x + 1, y + 2, "R") } }
    else if (y < SH) c.px(x, y, p.k)
  })),
)

// ================================================================ PORTA
// Il licenziato che se ne va con la porta in spalla: cammina verso il cancello, la porta (con la targhetta) sulla schiena;
// sulla facciata il vano dell'ufficio rimasto senza porta; il guardiano saluta dalla guardiola.
sprite("st_guardiola", { w: 20, h: 30, outline: "K", pivot: "bottom" },
  rect(0, 0, 20, 3, "D"), hline(0, 2, 20, "d"), rect(1, 3, 18, 27, "W"), vline(18, 3, 27, "S"), hline(1, 29, 18, "S"),
  rect(3, 7, 12, 9, "L"), box(3, 7, 12, 9, "D"), hline(4, 8, 6, "W"), rect(3, 18, 12, 2, "R"), hline(3, 19, 12, "r"))
// il guardiano al finestrino: saluta con la mano
anim("st_guardiano", { w: 12, h: 8, fps: FPS, pivot: [0, 0] },
  rect(2, 3, 5, 5, "F"), hline(2, 2, 5, "d"), rect(1, 2, 7, 1, "d"), px(3, 4, "K"), px(5, 4, "K"), hline(3, 6, 3, "M"),
  frame({ hold: 2 }, rect(8, 1, 2, 3, "F")), frame({ hold: 2 }, rect(9, 0, 2, 3, "F")))
// il vano della porta portata via: lo stipite, il buio dell'ufficio, la targhetta rimasta e i cardini
sprite("st_vano", { w: 16, h: 30, outline: "K" }, rect(0, 0, 16, 30, "W"), rect(2, 6, 12, 24, "j"), rect(2, 6, 12, 2, "D"),
  rect(4, 21, 9, 2, "N"), vline(5, 23, 7, "M"), vline(11, 23, 7, "M"), rect(9, 17, 3, 4, "s"), rect(6, 18, 2, 3, "C"), hline(2, 29, 12, "D"),   // dentro: la scrivania, il monitor, un foglio
  rect(1, 9, 1, 3, "s"), rect(1, 22, 1, 3, "s"), rect(3, 1, 10, 4, "C"), hline(4, 3, 8, "N"))
// lui, di schiena, con la porta in spalla: cammina (gambe a turno, su e giù)
persona("_st_portatore", { testa: "nuca", swap: { B: "G", b: "g", M: "m", D: "D" } })
sprite("st_porta_legno", { w: 13, h: 26 }, rect(0, 0, 13, 26, "N"), box(0, 0, 13, 26, "M"), box(2, 2, 9, 9, "k"), box(2, 13, 9, 11, "k"), rect(10, 13, 2, 2, "Y"), rect(3, 5, 7, 3, "C"), hline(4, 6, 5, "N"))
anim("st_portatore", { w: 26, h: 34, frames: LOOP, fps: FPS, outline: "K", pivot: [16, 34] }, (c) => {
  const f = c.frame % 4, su = f === 1 || f === 3 ? 1 : 0
  c.stamp("st_porta_legno", 0, 4 + su)                                         // la porta, tenuta di lato
  c.stamp("__st_portatore", 12, 13 + su)
  if (f < 2) { c.rect(14, 29 + su, 2, 4 - su, "D"); c.rect(18, 30 + su, 2, 3 - su, "D") } else { c.rect(14, 30 + su, 2, 3 - su, "D"); c.rect(18, 29 + su, 2, 4 - su, "D") }
  c.rect(10, 18 + su, 3, 2, "G"); c.px(10, 20 + su, "F"); c.rect(10, 10 + su, 3, 2, "F")   // il braccio che tiene la porta, la mano sul bordo in alto
  c.rect(22, 23 + su, 2, 3, "G"); c.px(22, 26 + su, "F")
})

scene("porta", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", ...stFacciata(), stamp("st_vano", 30, 26)),
  layer("ombre", { shade: true }, ellipse(110, 67, 9, 1, "K"), ellipse(150, 66, 10, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("st_portatore", 110, 67),
    stamp("st_guardiola", 150, 66)),
  layer("sopra", stamp("st_guardiano", 144, 43)),
)

// ================================================================ LANGHE
// La cena aziendale nelle Langhe: tramonto viola e arancio, le colline coi filari, il borgo sulla collina col campanile,
// il pergolato con le lucine che si accendono a turno, la tavolata a quadri, i colleghi che brindano a turno
// e uno che balla sul tavolo; il pullman aspetta giù in fondo.
const ST_CIELO = [["p", 0, 8], ["P", 8, 6], ["l", 14, 5], ["e", 19, 4], ["a", 23, 4], ["i", 27, 4]]
sprite("st_bottiglia", { outline: "K", pivot: "bottom" }, ".g.\n.g.\nggg\ngCg\ngCg\nggg")
sprite("st_calice", { pivot: "bottom" }, "WrW\n.W.\nWWW")
// chi balla sul tavolo: braccia su e giù, fianchi a destra e a sinistra
persona("_st_ballo", { testa: "calvo", abito: "completo", swap: { B: "D", b: "d", M: "s", R: "Y" } })
anim("st_ballo", { w: 16, h: 24, frames: LOOP, fps: FPS, outline: "K", pivot: [7, 24] }, (c) => {
  const f = c.frame % 4, dx = f < 2 ? 2 : 3
  c.stamp("__st_ballo", dx, 4)
  if (f < 2) { c.rect(dx - 2, 1, 2, 9, "D"); c.px(dx - 2, 0, "F"); c.rect(dx + 10, 11, 2, 4, "D") }
  else { c.rect(dx + 10, 1, 2, 9, "D"); c.px(dx + 11, 0, "F"); c.rect(dx - 2, 11, 2, 4, "D") }
})
sprite("st_pullman", { w: 30, h: 13, outline: "K", pivot: "bottom" }, rect(0, 0, 30, 10, "W"), hline(0, 9, 30, "S"), rect(0, 0, 30, 2, "Y"),
  ...[2, 8, 14, 20].map((x) => rect(x, 3, 5, 4, "L")), rect(26, 3, 3, 6, "L"), circ(6, 10, 2, "K"), circ(23, 10, 2, "K"))
// le lucine del pergolato: si accendono e si spengono a turno
anim("st_lucine", { w: SW, h: 8, frames: LOOP, fps: FPS }, (c) => {
  for (let i = 0; i < 16; i++) { const x = 6 + i * 10, y = 2 + Math.round(3 * Math.sin((x / SW) * Math.PI)), on = (i + c.frame) % 4 !== 0
    c.px(x, y, "K"); c.rect(x - 1, y + 1, 2, 2, on ? "i" : "y"); if (on && (i + c.frame) % 4 === 1) c.px(x - 1, y + 3, "C") }
})

scene("langhe", { w: SW, h: SH, bg: "p", world: { light: [0.6, -1], ground: 66 } },
  layer("cielo", ...ST_CIELO.map(([k, y, h]) => rect(0, y, SW, h, k)), circ(128, 30, 6, "i"), circ(128, 30, 5, "Y")),
  layer("colline", poly([0, 34, 30, 28, 62, 31, 98, 26, 132, 30, 160, 27, 160, 44, 0, 44], "t"),
    poly([0, 40, 40, 33, 80, 37, 118, 31, 160, 36, 160, 50, 0, 50], "g"),
    rect(92, 22, 3, 8, "p"), rect(91, 21, 5, 2, "p"), poly([86, 30, 100, 30, 100, 27, 86, 28], "p"), rect(84, 26, 6, 4, "p"),   // il borgo col campanile
    ...Array.from({ length: 22 }, (_, i) => line(i * 8 - 6, 50, i * 8 + 4, 38, "G")),
    rect(0, 48, SW, 24, "N"), hline(0, 48, SW, "k"), ...Array.from({ length: 10 }, (_, i) => vline(8 + i * 16, 49, 23, "M"))),
  layer("pullman", stamp("st_pullman", 22, 46)),
  layer("pergola", rect(4, 6, 3, 60, "M"), rect(153, 6, 3, 60, "M"), rect(0, 4, SW, 3, "M"), hline(0, 6, SW, "m"),
    ...Array.from({ length: 20 }, (_, i) => [rect(i * 8 + 1, 7, 6, 3, i % 2 ? "G" : "g"), px(i * 8 + 3, 10, "G")]).flat()),
  layer("gente",
    stamp("fe1", 40, 51), stamp("fe2", 58, 51, { delay: 250 }), stamp("fe3", 77, 51, { delay: 500 }), stamp("fe4", 96, 51, { delay: 125 })),
  layer("ombre", { shade: true }, ellipse(80, 67, 52, 2, "K")),
  layer("tavola", stamp("tavolata", 80, 67), stamp("st_bottiglia", 50, 52), stamp("st_bottiglia", 88, 52), stamp("st_bottiglia", 112, 52),
    stamp("st_calice", 45, 52), stamp("st_calice", 66, 52), stamp("st_calice", 95, 52), stamp("pizza", 72, 52)),
  layer("sopra", stamp("st_ballo", 118, 52), stamp("st_lucine", 0, 7)),
)

// ================================================================ SLALOM
// Il Trofeo Forche d'Oro alla fiera di Bologna: le tribune piene che tifano a turno, lo striscione, i birilli,
// il muletto che fa lo slalom (avanti e indietro), la torre di bicchieri col bancale in cima, il giudice col cronometro.
sprite("st_striscione", { w: 54, h: 9, outline: "K" }, rect(0, 0, 54, 9, "R"), hline(0, 8, 54, "r"), text(3, 2, "FORCHE D'ORO", "Y"))
sprite("st_birillo", { outline: "K", pivot: "bottom" }, "..O..\n..O..\n.WWW.\n.OOO.\nOOOOO\noooooo")
sprite("_st_mul_r", { w: 31, h: 28 }, stamp("__mulettista", 12, 1), stamp("_muletto", 0, 0), rect(0, 20, 7, 1, "K"), rect(5, 14, 2, 6, "s"), rect(15, 0, 3, 2, "O"))
sprite("_st_mul_l", { base: "_st_mul_r", flip: "x" })
// lo slalom: il muletto va a destra per 8 fotogrammi e torna per altri 8, salendo e scendendo tra i birilli
anim("st_slalom", { w: 140, h: 32, frames: LOOP, fps: FPS, outline: "K", pivot: [0, 32] }, (c) => {
  const f = c.frame, t = f < 8 ? f / 7 : (15 - f) / 7, x = Math.round(2 + t * 88), y = Math.round(2 + 2 * Math.sin(t * Math.PI * 4))
  c.stamp(f < 8 ? "_st_mul_l" : "_st_mul_r", x, y)
})
// la torre di bicchieri col bancale in cima
sprite("st_torre", { w: 21, h: 18, outline: "K", pivot: "bottom" }, ...[0, 1, 2, 3].flatMap((r) => Array.from({ length: 4 - r }, (_, i) => [rect(1 + r * 2 + i * 5, 14 - r * 4, 3, 4, "L"), hline(1 + r * 2 + i * 5, 14 - r * 4, 3, "W")]).flat()),
  rect(4, 0, 13, 2, "k"), hline(4, 1, 13, "N"))
// le tribune: file di teste che saltano a turno, qualche bandiera
const ST_TIFO = Array.from({ length: 3 }, (_, r) => Array.from({ length: 26 }, (_, i) => ({ x: 2 + i * 6 + (r % 2) * 3, y: 12 + r * 6, k: "RYBGPOTe"[(i * 3 + r) % 8], p: (i + r) % 4, s: (i * 7 + r) % 3 === 0 ? "c" : "F" }))).flat()
anim("st_tribune", { w: SW, h: 34, frames: LOOP, fps: FPS }, (c) => {
  for (let r = 0; r < 3; r++) c.rect(0, 15 + r * 6, SW, 6, r % 2 ? "s" : "S")
  ST_TIFO.forEach((t) => { const su = (c.frame + t.p) % 4 < 2 ? 1 : 0; c.rect(t.x, t.y - su + 2, 4, 3, t.k); c.rect(t.x + 1, t.y - su, 2, 2, t.s); c.px(t.x + 1, t.y - su - 1, "K") })
  ;[20, 70, 120].forEach((x, i) => { const on = (c.frame + i * 2) % 4 < 2; c.vline(x, 6, 10, "K"); c.rect(x + 1, on ? 6 : 7, 6, 4, ["G", "W", "R"][i]); c.rect(x + 3, on ? 6 : 7, 2, 4, ["W", "R", "G"][i]) })
})
persona("_st_giudice", { testa: "corti", abito: "completo", swap: { B: "K", b: "d", M: "s", R: "Y" } })
anim("st_giudice", { w: 14, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__st_giudice"), rect(9, 9, 2, 4, "K"),
  frame({ hold: 4 }, circ(11, 8, 2, "W"), px(11, 7, "K")), frame({ hold: 4 }, circ(11, 8, 2, "W"), px(12, 8, "K")))

scene("slalom", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", rect(0, 0, SW, 12, "D"), ...[10, 50, 90, 130].map((x) => rect(x, 0, 20, 2, "L")), stamp("st_tribune", 0, 2),
    rect(0, 36, SW, 36, "S"), hline(0, 36, SW, "s"), rect(0, 48, SW, 1, "Y"), rect(0, 69, SW, 1, "Y")),
  layer("striscione", stamp("st_striscione", 53, 4)),
  layer("ombre", { shade: true }, ellipse(128, 67, 6, 1, "K"), ellipse(148, 67, 11, 1, "K")),
  layer("birilli", ...[34, 58, 82, 106].map((x) => stamp("st_birillo", x, 60))),
  layer("cose", { sort: "y" }, stamp("st_giudice", 128, 67), stamp("st_torre", 148, 67), stamp("st_slalom", 0, 68)),
)

// ================================================================ SET
// Si gira: davanti al capannone, di sera, il set del giallo. I fari sul cavalletto, la macchina da presa con l'operatore,
// il ciak che batte, il regista sulla sedia col megafono, il commissario col trench sopra la sagoma di gesso, la nebbia.
sprite("st_faro", { w: 14, h: 30, outline: "K", pivot: "bottom" }, rect(1, 0, 12, 9, "d"), rect(3, 2, 8, 5, "i"), px(4, 3, "W"),
  vline(7, 9, 15, "s"), line(7, 23, 2, 29, "s"), line(7, 23, 12, 29, "s"), vline(7, 24, 6, "s"))
sprite("st_cinepresa", { w: 22, h: 26, outline: "K", pivot: "bottom" }, rect(4, 4, 12, 8, "K"), rect(16, 6, 5, 4, "d"), circ(6, 2, 3, "d"), circ(13, 2, 3, "d"), px(6, 2, "s"), px(13, 2, "s"),
  vline(10, 12, 8, "s"), line(10, 19, 5, 25, "s"), line(10, 19, 15, 25, "s"))
persona("_st_operatore", { testa: "berretto", swap: { B: "K", b: "d", M: "K", R: "R", r: "r" } })
persona("_st_regista", { testa: "corti", corpo: "seduto", swap: { B: "W", b: "S", M: "s" } })
anim("st_regista", { w: 26, h: 26, fps: FPS, outline: "K", pivot: [12, 26] },
  rect(4, 10, 16, 6, "N"), stamp("__st_regista", 7, 0), rect(3, 16, 18, 8, "N"), hline(3, 23, 18, "M"), vline(4, 24, 2, "M"), vline(19, 24, 2, "M"), text(3, 18, "REGIA", "W"),
  rect(17, 5, 6, 3, "Y"), px(22, 4, "Y"), px(22, 8, "Y"),
  frame({ hold: 2 }, vline(24, 4, 5, "W")), frame({ hold: 2 }, vline(25, 3, 7, "W")), frame({ hold: 4 }))
// il ciak: la stecca si alza e batte
persona("_st_assistente", { testa: "lunghi", swap: { B: "P", b: "p", M: "o" } })
anim("st_ciak", { w: 18, h: 24, fps: FPS, outline: "K", pivot: [5, 24] }, stamp("__st_assistente", 0, 4), rect(9, 6, 8, 6, "K"), hline(10, 8, 6, "W"), hline(10, 10, 6, "W"),
  frame({ hold: 6 }, line(9, 5, 16, 1, "W"), line(9, 4, 15, 0, "K")),
  frame({ hold: 2 }, rect(9, 4, 8, 2, "W"), hline(9, 4, 8, "K"), px(11, 5, "K"), px(14, 5, "K")),
  frame({ hold: 8 }, rect(9, 4, 8, 2, "W"), hline(9, 4, 8, "K"), px(11, 5, "K"), px(14, 5, "K")))
// il commissario col trench e il cappello
persona("_st_commissario", { testa: "corti", swap: { B: "q", b: "k", M: "K" } })
sprite("st_commissario", { w: 12, h: 22, outline: "K", pivot: [5, 22] }, stamp("__st_commissario", 0, 2), rect(0, 1, 10, 3, "M"), rect(-1, 3, 12, 1, "M"), rect(2, 0, 6, 1, "M"))
// la nebbia che passa davanti, a strisce
anim("st_nebbia", { w: SW, h: 10, frames: LOOP, fps: FPS }, (c) => { for (let i = 0; i < 6; i++) { const x = ((i * 34 + c.frame * 2) % (SW + 30)) - 30; c.hline(x, 2 + (i % 3) * 3, 26, "W"); c.hline(x + 4, 3 + (i % 3) * 3, 18, "S") } })

scene("set", { w: SW, h: SH, bg: "p", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", ...stFacciata("p")),
  layer("notte", { shade: 1 }, rect(0, 0, SW, SH, "K")),
  layer("fascio", { light: 1 }, poly([20, 36, 60, 70, 110, 70, 26, 36], "W")),
  layer("gesso", ...[[66, 64], [84, 64]].map(([x, y]) => [hline(x, y, 6, "W")]).flat(), px(70, 62, "W"), px(72, 61, "W"), px(74, 62, "W"), line(76, 64, 80, 61, "W"), px(81, 62, "W")),
  layer("ombre", { shade: true }, ellipse(20, 67, 7, 1, "K"), ellipse(48, 67, 8, 1, "K"), ellipse(96, 67, 6, 1, "K"), ellipse(124, 67, 9, 1, "K"), ellipse(148, 67, 6, 1, "K")),
  layer("cose", { sort: "y" },
    stamp("st_faro", 20, 67), stamp("st_cinepresa", 46, 67), stamp("st_commissario", 96, 67), stamp("st_regista", 124, 67), stamp("st_ciak", 148, 67)),
  layer("nebbia", stamp("st_nebbia", 0, 60)),
)

// ================================================================ PIERINA
// La signora Pierina sul balcone col binocolo, tra i gerani; sotto, il camion in retromarcia col lampeggiante e il «BIP»
// che lampeggia a tempo, le onde del suono.
sprite("st_palazzo", { w: SW, h: 50 }, rect(0, 0, SW, 50, "q"), ...[8, 40, 104, 136].map((x) => [rect(x, 6, 14, 16, "L"), box(x - 1, 5, 16, 18, "D"), rect(x - 4, 5, 3, 18, "g"), rect(x + 15, 5, 3, 18, "g")]).flat(),
  ...[8, 40, 104, 136].map((x) => [rect(x, 30, 14, 14, "L"), box(x - 1, 29, 16, 16, "D")]).flat(), rect(0, 48, SW, 2, "y"))
// il balcone coi gerani
sprite("st_balcone", { w: 40, h: 12, outline: "K", pivot: "bottom" }, rect(0, 9, 40, 3, "S"), hline(0, 11, 40, "s"), ...Array.from({ length: 10 }, (_, i) => vline(i * 4 + 1, 2, 7, "K")), hline(0, 2, 40, "K"),
  ...[3, 30].map((x) => [rect(x, -3, 7, 4, "o"), px(x + 1, -5, "R"), px(x + 3, -6, "R"), px(x + 5, -5, "e"), px(x + 2, -4, "G"), px(x + 4, -4, "G")]).flat())
// la signora col binocolo: lo abbassa e lo rialza
persona("_st_pierina", { testa: "corti", swap: { B: "P", b: "p", M: "W" } })
anim("st_pierina", { w: 14, h: 20, fps: FPS, outline: "K", pivot: [6, 20] }, stamp("__st_pierina", 1, 0), rect(3, 0, 6, 2, "W"), rect(5, -1, 3, 2, "W"),
  frame({ hold: 10 }, rect(2, 5, 8, 3, "K"), px(3, 6, "d"), px(8, 6, "d"), rect(0, 8, 2, 4, "P"), rect(10, 8, 2, 4, "P")),
  frame({ hold: 6 }, rect(2, 11, 8, 3, "K"), px(3, 6, "K"), px(7, 6, "K")))
// il camion in retromarcia: il lampeggiante, la luce bianca della retro, il BIP
sprite("st_camion", { w: 52, h: 26, outline: "K", pivot: "bottom" }, rect(0, 0, 38, 18, "W"), hline(0, 17, 38, "S"), rect(2, 3, 34, 3, "T"), rect(38, 6, 13, 12, "B"), rect(41, 8, 7, 5, "L"),
  rect(0, 18, 51, 3, "d"), circ(8, 22, 3, "K"), circ(30, 22, 3, "K"), circ(44, 22, 3, "K"), px(8, 22, "s"), px(30, 22, "s"), px(44, 22, "s"))
anim("st_bip", { w: 60, h: 34, frames: LOOP, fps: FPS, pivot: [0, 34] }, (c) => {
  const on = c.frame % 4 < 2
  c.rect(43, 6, 4, 2, on ? "O" : "o"); if (on) { c.px(42, 5, "Y"); c.px(47, 5, "Y") }
  c.rect(-1 + 2, 22, 2, 2, on ? "W" : "s")
  if (on) { c.rect(2, 0, 15, 8, "K"); c.text(4, 2, "BIP", "Y"); c.line(0, 12, 2, 10, "W"); c.line(0, 16, 3, 13, "W") }
})

scene("pierina", { w: SW, h: SH, bg: "q", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo", stamp("st_palazzo", 0, 0), rect(0, 50, SW, 6, "S"), hline(0, 50, SW, "s"), rect(0, 56, SW, 16, "D"), hline(0, 56, SW, "d"), ...[0, 32, 64, 96, 128].map((x) => hline(x + 6, 66, 14, "W"))),
  layer("balcone", stamp("st_pierina", 76, 25), stamp("st_balcone", 76, 27)),
  layer("ombre", { shade: true }, ellipse(96, 69, 26, 2, "K")),
  layer("cose", stamp("st_camion", 96, 69), stamp("st_bip", 70, 69)),
)

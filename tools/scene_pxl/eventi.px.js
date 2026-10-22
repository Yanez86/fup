// Scenette degli eventi: piccole scene animate (160×72, mostrate a 2× sul telefono e a 3× sul computer)
// da mettere in cima alla finestra di un evento. Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html).
// Prove: ufficio, sciopero, tavolo delle trattative.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/scene_pxl/eventi.px.js --out tools/out/scene_pxl

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", T: "#1f9e8f", F: "#f2c79b", P: "#9b6bff", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      y: "#c98a00", o: "#c8551f", r: "#a8262a", g: "#217a36", b: "#2f7fd6", s: "#8a96a6", d: "#2a3a50", t: "#146b61", f: "#d9946a",
      p: "#6f43cf", q: "#e8c96a", m: "#3d2412", i: "#ffe680", a: "#ffb07a", e: "#ff8a8d", h: "#8ed15b", l: "#c8adff", u: "#5fd4c4",
      k: "#c08a55", j: "#7f95b0", v: "#ffe2c6",
      // in più per le scene: pelle scura, plastica beige dei computer del 2002
      c: "#b8784a", x: "#8a5232", z: "#e3d9b8", Z: "#b5a983" })
ramps("KdDjsSW", "KbBL", "moOa", "yYi", "KrRe", "KgGh", "xfFv", "mMNk", "tTu", "pPl", "ZzC")

const SW = 160, SH = 72            // misura di ogni scenetta
const FPS = 8, LOOP = 16           // 16 fotogrammi a 8 al secondo: un giro di 2 secondi

// ================================================================ persone
// Omini in stile «chibi» (testa grande quanto il corpo), visti di fronte. Si scrive la metà sinistra
// (5 colonne) e mx la specchia. M capelli, F pelle, f ombra della pelle, K occhi, B giacca, b pieghe,
// D pantaloni, K scarpe. Ogni persona cambia i colori con swap.
const TESTE = {
  corti: [
    "..MMM",
    ".MMMM",
    "MMMMM",
    "MMFFF",
    "MFFFF",
    "FFFKF",
    "FFFKF",
    "fFFFF",
    ".fFFf",
    "..fff"],
  lunghi: [
    "..MMM",
    ".MMMM",
    "MMMMM",
    "MMMFF",
    "MMFFF",
    "MFFKF",
    "MFFKF",
    "MfFFF",
    "MMfFf",
    "MM.ff"],
  calvo: [
    "..FFF",
    ".FFFF",
    "MFFFF",
    "MMFFF",
    "MFFFF",
    "FFFKF",
    "FFFKF",
    "fFFFF",
    ".fMMM",
    "..fff"],
  berretto: [
    "..RRR",
    ".RRRR",
    "RRRRR",
    "rrrrr",
    "MFFFF",
    "FFFKF",
    "FFFKF",
    "fFFFF",
    ".fFFf",
    "..fff"],
  nuca: [
    "..MMM",
    ".MMMM",
    "MMMMM",
    "MMMMM",
    "MMMMM",
    "FMMMM",
    "FMMMM",
    ".MMMM",
    "..MMM",
    "..fff"],
  nuca_calva: [
    "..FFF",
    ".FFFF",
    "FFFFF",
    "FFFFF",
    "MMFFF",
    "FMMMM",
    "FMMMM",
    ".MMMM",
    "..fff",
    "..fff"],
}
const CORPI = {
  piedi: [
    ".BBBB",
    "BBBBB",
    "BbBBB",
    "BbBBB",
    "BbBBB",
    "FbBBB",
    ".DDDD",
    ".DDd.",
    ".DDd.",
    ".KKK."],
  seduto: [
    ".BBBB",
    "BBBBB",
    "BbBBB",
    "BbBBB",
    "BbBBB",
    "BbBBB"],
}
// giacca e cravatta, gilet ad alta visibilità: disegnati sopra al corpo (metà sinistra)
const ABITI = {
  completo: ["....W", "...WR", "..bBR", "..bBR"],
  gilet:    ["", "", "", "BbSSS", "", ""],
}
function persona(nome, { testa = "corti", corpo = "piedi", abito, swap = {} } = {}) {
  const righe = [...TESTE[testa], ...CORPI[corpo]]
  const sopra = abito ? ABITI[abito].map((r, i) => [0, 10 + i, r]).filter(([, , r]) => r) : []
  sprite("_" + nome, { mx: true, swap }, righe.join("\n"), ...sopra.map(([x, y, r]) => grid(x, y, r)))
}

// ================================================================ UFFICIO
// L'ufficio traffico in un pomeriggio qualunque: la finestra sulla tangenziale (passa un bilico),
// la lavagna dei KPI con l'ultima barra in rosso, l'impiegata al telefono mentre l'altro telefono squilla,
// il monitor a tubo visto da dietro (è il 2002), il caffè che fuma, il boccione dell'acqua che fa glu.

// la finestra: tapparella alla veneziana, le Alpi nel sereno, pioppi, la tangenziale con il bilico che passa
sprite("_bilico", `
  WWWWWWWW....
  WWWWWWWW.OO.
  WWWWWWWW.OLO
  WWWWWWWWOOOO
  SSSSSSSSOOOO
  .KK..KK..KK.`)
sprite("_pioppo", { pivot: "bottom" }, `
  .G.
  GGg
  GGg
  GGg
  GGg
  gGg
  .N.`)
anim("_finestra", { w: 38, h: 30, frames: LOOP, fps: FPS },
  rect(0, 0, 38, 30, "L"),
  rect(0, 8, 38, 2, "B"),                                                    // il cielo più carico in alto
  poly([0, 16, 6, 11, 10, 13, 16, 9, 22, 13, 27, 10, 33, 14, 38, 12, 38, 17, 0, 17], "j"),  // le Alpi, lontane
  poly([5, 12, 6, 11, 7, 12], "W"), poly([15, 10, 16, 9, 17, 10], "W"), poly([26, 11, 27, 10, 28, 11], "W"),
  rect(0, 16, 38, 5, "h"),                                                   // campi
  hline(0, 18, 38, "G"),
  ...[2, 6, 30, 34].map((x) => stamp("_pioppo", x, 21)),
  (c) => { const x = -12 + Math.floor(c.phase * 50); c.stamp("_bilico", x, 16) },
  rect(0, 22, 38, 3, "D"), hline(0, 23, 38, "s"),                           // la tangenziale
  hline(0, 21, 38, "S"),                                                     // guardrail
  ...[1, 9, 17, 25, 33].map((x) => hline(x, 23, 3, "W")),
  rect(0, 25, 38, 5, "G"), hline(0, 29, 38, "g"),
  // tapparella veneziana mezza giù
  rect(0, 0, 38, 7, "S"), ...[1, 3, 5].map((y) => hline(0, y, 38, "W")), hline(0, 7, 38, "s"),
  vline(30, 7, 3, "s"), px(30, 10, "D"))
sprite("finestra_cornice", { w: 42, h: 35 }, box(0, 0, 42, 34, "K"), box(1, 1, 40, 32, "W"), hline(1, 32, 40, "S"),
  vline(20, 2, 30, "W"), vline(21, 2, 30, "S"), rect(0, 33, 42, 2, "S"), hline(0, 34, 42, "K"))   // telaio, montante e davanzale

// il calendario da muro del gommista, con i giorni barrati
sprite("calendario", { w: 10, h: 14, outline: "K" }, rect(0, 0, 10, 14, "W"), rect(0, 0, 10, 5, "B"), rect(2, 1, 6, 3, "L"), px(4, 2, "Y"),
  ...[0, 1, 2].map((r) => [0, 1, 2, 3].map((k) => px(1 + k * 2, 7 + r * 2, r < 2 || k < 2 ? "R" : "s"))).flat(), px(4, -1, "K"))
// orologio da parete: le cinque meno cinque
sprite("orologio", { w: 11, h: 11, outline: "K" }, circ(5, 5, 5, "W"), ring(5, 5, 5, "S"), px(5, 1, "K"), px(9, 5, "K"), px(5, 9, "K"), px(1, 5, "K"),
  vline(5, 2, 4, "K"), line(5, 5, 7, 6, "K"), px(5, 5, "R"))

// lavagna dei KPI: barre verdi, l'ultima rossa sotto la soglia tratteggiata
sprite("lavagna", { w: 40, h: 26 }, rect(0, 0, 40, 26, "S"), box(0, 0, 40, 26, "K"), rect(2, 2, 36, 21, "W"),
  text(4, 4, "KPI", "b"),
  ...[[14, 11], [19, 13], [24, 10], [29, 12]].map(([x, h]) => [rect(x, 21 - h, 3, h, "G"), vline(x + 2, 21 - h, h, "g")]).flat(),
  rect(34, 15, 3, 6, "R"), vline(36, 15, 6, "r"),
  ...[3, 7, 11, 15, 19, 23, 27, 31, 35].map((x) => hline(x, 12, 2, "R")),   // la soglia del cliente
  hline(3, 21, 34, "D"),
  rect(6, 23, 28, 2, "s"), rect(10, 22, 4, 1, "b"), rect(16, 22, 3, 1, "R"))  // vaschetta dei pennarelli

// la scrivania (vista di fronte): piano di legno e pannello
sprite("scrivania", { w: 72, h: 22, pivot: "bottom" }, rect(0, 0, 72, 3, "k"), hline(0, 0, 72, "q"), hline(0, 2, 72, "N"),
  rect(2, 3, 68, 17, "N"), rect(4, 5, 64, 13, "k"), hline(4, 17, 64, "N"), box(2, 3, 68, 17, "M"), rect(2, 20, 4, 2, "M"), rect(66, 20, 4, 2, "M"),
  box(0, 0, 72, 3, "M"), rect(32, 9, 8, 1, "M"))
// monitor a tubo visto da dietro, beige, con le feritoie
sprite("crt", { outline: "K", pivot: "bottom" }, `
  ..zzzzzzzzzzzz..
  .zzzzzzzzzzzzYYZ
  zzzzzzzzzzzzzYYZ
  zzZZzZZzZZzZZzzZ
  zzzzzzzzzzzzzzzZ
  zzZZzZZzZZzZZzzZ
  zzzzzzzzzzzzzzzZ
  ZZZZZZZZZZZZZZZZ
  .....ZzzzzZ.....
  ...zzzzzzzzzZ...`)
// pile di pratiche, una un po' storta
sprite("pratiche", { outline: "K", pivot: "bottom" }, `
  .WWWWW......
  .SSSSS......
  WWWWW.......
  SSSSS.WWWWW.
  .WWWWWSSSSS.
  .bbbbbWWWWW.
  .WWWWWSSSSS.
  .SSSSSYYYYY.
  WWWWW.WWWWWW
  SSSSS.SSSSSS`)
// tazza di caffè (il fumo lo fa plume nella scena)
sprite("tazza", { outline: "K", pivot: "bottom" }, `
  emmme..
  RRRRRr.
  RRRRR.r
  RRRRRr.
  rrrrr..`)
// il fumo del caffè: due riccioli che salgono ondeggiando e sfumano
anim("vapore", { w: 5, h: 9, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  const SWAY = [0, 1, 1, 0, -1, -1, 0, 1]
  for (const o of [0, 4]) {
    const t = (c.frame + o) % 8; if (t > 5) continue
    const x = 2 + SWAY[t], y = 7 - t
    c.px(x, y, t < 3 ? "W" : "S"); if (t < 4) c.px(x, y + 1, "S")
  }
})
// il telefono fisso che squilla: sobbalza e fa i trilli
anim("telefono", { w: 16, h: 12, fps: FPS, pivot: "bottom" },
  frame({ hold: 1 }, grid(3, 4, ".RRRRRRR.\nRrrrrrrrR\nRRRRRRRRR\nRRSWSWSRR\nRRWSWSWRR\nrrrrrrrrr")),
  frame({ hold: 1 }, grid(3, 3, ".RRRRRRR.\nRrrrrrrrR\nRRRRRRRRR\nRRSWSWSRR\nRRWSWSWRR\nrrrrrrrrr"), px(1, 1, "Y"), px(0, 3, "Y"), px(14, 1, "Y"), px(15, 3, "Y")),
  frame({ hold: 1 }, grid(4, 4, ".RRRRRRR.\nRrrrrrrrR\nRRRRRRRRR\nRRSWSWSRR\nRRWSWSWRR\nrrrrrrrrr"), px(0, 2, "Y"), px(1, 0, "Y"), px(15, 2, "Y"), px(14, 0, "Y")),
  frame({ hold: 1 }, grid(3, 3, ".RRRRRRR.\nRrrrrrrrR\nRRRRRRRRR\nRRSWSWSRR\nRRWSWSWRR\nrrrrrrrrr"), px(1, 1, "Y"), px(0, 3, "Y"), px(14, 1, "Y"), px(15, 3, "Y")),
  frame({ hold: 4 }, grid(3, 4, ".RRRRRRR.\nRrrrrrrrR\nRRRRRRRRR\nRRSWSWSRR\nRRWSWSWRR\nrrrrrrrrr")))
// il boccione dell'acqua: ogni tanto sale una bolla (glu)
anim("boccione", { w: 12, h: 30, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(1, 0, 10, 13, "L"), rect(3, 0, 6, 1, "B"), rect(1, 9, 10, 4, "B"), vline(9, 1, 8, "B"), vline(2, 2, 6, "W"),
  rect(4, 13, 4, 1, "b"),
  rect(0, 14, 12, 16, "W"), rect(0, 14, 12, 1, "S"), vline(11, 15, 15, "S"), rect(2, 17, 3, 2, "B"), rect(7, 17, 3, 2, "R"),
  rect(3, 22, 6, 1, "S"),
  (c) => { const f = c.frame; if (f < 8) { const y = 12 - Math.floor(f * 1.5); c.px(5, y, "W"); if (f > 1) c.px(6, y + 3, "W") } })
// la pianta (un ficus, unico essere vivente che non si lamenta)
sprite("pianta", { outline: "K", pivot: "bottom" }, `
  ....G.G....
  ..GGhGGG...
  .GhhGGgGG..
  GGhGGgGhGG.
  .GGgGhhGGg.
  ..GgGGhGgG.
  .GGhGgGGG..
  ..gGG.GgG..
  ....N.N....
  .....N.....
  .....N.....
  ...ooooo...
  ...OOOOO...
  ...OOOOO...
  ....ooo....`)

persona("_impiegata", { testa: "lunghi", corpo: "seduto", swap: { B: "P", b: "p", M: "o" } })
sprite("impiegata", { base: "__impiegata", outline: "K", pivot: "bottom" },
  // la cornetta all'orecchio e la mano che la tiene
  rect(8, 3, 2, 6, "R"), px(9, 2, "r"), px(9, 9, "r"), rect(8, 9, 2, 2, "F"), px(9, 11, "p"))
persona("_capo", { testa: "calvo", corpo: "piedi", abito: "completo", swap: { B: "D", b: "d", D: "d", M: "S" } })
sprite("capo", { w: 14, h: 20, outline: "K", pivot: [6, 22] }, stamp("__capo"),
  // tiene in mano il report stampato, con l'ultima riga in rosso
  rect(10, 10, 4, 6, "W"), hline(11, 11, 2, "s"), hline(11, 13, 2, "s"), hline(11, 14, 2, "R"), px(9, 15, "F"), px(10, 15, "F"))

scene("ufficio", { w: SW, h: SH, bg: "C", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "q"), hline(0, 3, SW, "k"),                         // fascia in alto
    rect(0, 54, SW, 2, "k"), hline(0, 54, SW, "q"), hline(0, 55, SW, "N"), // battiscopa
    rect(0, 56, SW, 16, "j"), ...[59, 63, 68].map((y) => hline(0, y, SW, "s")),   // linoleum
    ...[0, 20, 40, 60, 80, 100, 120, 140].map((x, i) => vline(x + (i % 2) * 7, 59, 4, "s")),
    stamp("_finestra", 8, 8), stamp("finestra_cornice", 6, 6),
    stamp("orologio", 59, 7), stamp("calendario", 124, 12),
    stamp("lavagna", 76, 8)),
  layer("cose", { sort: "y" },
    stamp("pianta", 126, 66),
    stamp("boccione", 147, 66),
    stamp("capo", 21, 66)),
  layer("scrivania",
    stamp("impiegata", 64, 48),
    stamp("scrivania", 68, 68),
    stamp("pratiche", 38, 47),
    stamp("crt", 86, 47),
    stamp("telefono", 104, 47, { delay: 0 }),
    stamp("tazza", 50, 47),
    stamp("vapore", 50, 42)),
)

// ================================================================ SCIOPERO
// Davanti ai cancelli del magazzino: lo striscione, la bandiera che sventola, il delegato col megafono,
// il pugno alzato, il bidone col fuoco (con un pallet dentro, ovviamente) e il bilico fermo che non entra.

// i lavoratori in gilet ad alta visibilità
persona("_op1", { testa: "corti", abito: "gilet", swap: { B: "Y", b: "y", M: "m" } })
persona("_op2", { testa: "berretto", abito: "gilet", swap: { B: "O", b: "o", M: "K", F: "c", f: "x" } })
persona("_op3", { testa: "lunghi", abito: "gilet", swap: { B: "O", b: "o", M: "q" } })
persona("_op4", { testa: "corti", abito: "gilet", swap: { B: "Y", b: "y", M: "K", F: "c", f: "x" } })
persona("_delegato", { testa: "corti", swap: { B: "R", b: "r", M: "s" } })
sprite("op1", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__op1"))
sprite("op2", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__op2"))
sprite("op3", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__op3"))
// il pugno alzato, su e giù a tempo con il coro
anim("op4", { w: 12, h: 24, fps: FPS, outline: "K", pivot: [5, 24] }, stamp("__op4", 0, 4),
  frame({ hold: 2 }, rect(9, 5, 2, 10, "Y"), rect(9, 2, 3, 3, "c"), px(11, 2, "x")),
  frame({ hold: 2 }, rect(9, 7, 2, 8, "Y"), rect(9, 4, 3, 3, "c"), px(11, 4, "x")))
// il delegato col megafono: le onde del coro escono a ritmo
anim("delegato", { w: 18, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__delegato"),
  rect(8, 7, 2, 3, "W"), rect(10, 6, 2, 5, "W"), rect(12, 5, 2, 7, "S"), px(10, 8, "R"), px(11, 8, "R"),   // il megafono
  rect(8, 10, 2, 4, "R"), px(8, 10, "F"), px(9, 10, "F"),                                                   // il braccio che lo regge
  frame({ hold: 2 }, vline(15, 6, 5, "W")),
  frame({ hold: 2 }, vline(15, 7, 3, "W"), vline(17, 5, 7, "W")))

// lo striscione retto da due persone, con le aste
sprite("striscione", { w: 39, h: 15, outline: "K", pivot: "bottom" },
  vline(0, 0, 15, "N"), vline(38, 0, 15, "N"), px(0, 0, "Y"), px(38, 0, "Y"),
  rect(1, 1, 37, 9, "W"), hline(1, 9, 37, "S"), text(4, 3, "SCIOPERO", "R"))
// la bandiera rossa che sventola sull'asta
anim("bandiera", { w: 20, h: 30, frames: LOOP, fps: FPS, outline: "K", pivot: [1, 30] },
  vline(1, 1, 29, "N"), px(1, 0, "Y"),
  rect(2, 1, 16, 10, "R"), hline(2, 10, 16, "r"), text(5, 3, "RSU", "W"),
  (c) => c.warp((x, y) => x > 2 && [0, Math.round(Math.sin(c.phase * Math.PI * 4 - x / 2.5) * (x - 2) / 9)], [2, 0, 18, 13]))
// il bidone con il fuoco
sprite("bidone", { outline: "K", pivot: "bottom" }, `
  mmmmmmmmm
  oOOOaOOoo
  oOOOaOOoo
  mmmmmmmmm
  oOOOaOOoo
  oOOOaOOoo
  oOOOaOOoo
  mmmmmmmmm
  oOOOaOOoo
  oooooooom`)
// il bilico fermo davanti al cancello, con l'autista che aspetta a braccia conserte
sprite("bilico_fermo", { w: 46, h: 27, outline: "K", pivot: "bottom" },
  rect(0, 0, 30, 19, "B"), hline(0, 0, 30, "L"), hline(0, 18, 30, "b"), ...[7, 15, 23].map((x) => vline(x, 1, 17, "b")),  // telone
  rect(0, 19, 46, 3, "d"), rect(30, 2, 15, 18, "O"), hline(30, 2, 15, "a"), vline(44, 3, 17, "o"),                       // telaio e cabina
  rect(33, 4, 9, 7, "L"), px(41, 4, "W"), rect(36, 7, 4, 4, "F"), hline(36, 6, 4, "m"), px(37, 8, "K"), px(39, 8, "K"),  // finestrino e autista
  hline(36, 10, 4, "B"), vline(32, 4, 14, "o"), rect(42, 16, 4, 2, "Y"), rect(45, 5, 1, 4, "K"),
  circ(7, 23, 3, "K"), circ(15, 23, 3, "K"), circ(38, 23, 3, "K"), px(7, 23, "s"), px(15, 23, "s"), px(38, 23, "s"))

scene("sciopero", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo",
    rect(0, 0, SW, 3, "B"),
    ellipse(30, 6, 9, 2, "W"), ellipse(118, 4, 12, 2, "W"),
    rect(0, 9, SW, 47, "S"), ...Array.from({ length: 20 }, (_, i) => vline(i * 8 + 4, 13, 43, "s")),
    rect(0, 8, SW, 1, "K"), rect(0, 9, SW, 4, "T"), hline(0, 12, SW, "t"),            // fascia col colore dell'azienda
    ...[56, 104].map((x) => [rect(x, 22, 30, 34, "j"), ...[25, 29, 33, 37, 41, 45, 49, 53].map((y) => hline(x, y, 30, "s")), box(x - 1, 21, 32, 35, "D"),
      rect(x - 3, 50, 2, 6, "K"), rect(x + 31, 50, 2, 6, "K")]).flat(),                   // portoni delle baie di carico
    rect(0, 56, SW, 16, "D"), hline(0, 56, SW, "d"), ...[0, 24, 48, 72, 96, 120, 144].map((x) => hline(x + 4, 70, 12, "Y"))),
  layer("ombre", { shade: true }, ellipse(80, 67, 70, 2, "K")),
  layer("gente", { sort: "y" },
    stamp("bilico_fermo", 21, 69),
    stamp("bandiera", 54, 66),
    stamp("op1", 57, 66),
    stamp("op3", 75, 67), stamp("op2", 100, 67),
    stamp("striscione", 87, 68),
    stamp("delegato", 119, 66),
    stamp("op4", 136, 67),
    stamp("bidone", 150, 68)),
  layer("fuoco",
    (c) => c.flame(150, 58, 9, "iYOR", { period: 8, wind: 0.2 }),
    (c) => c.plume(150, 50, "SsD", { every: 2, life: 16, rise: 26, size: [1, 4], wind: -0.4 })),
)

// ================================================================ TRATTATIVA
// Sala riunioni, le tre di notte: l'azienda da una parte del tavolo, il sindacato dall'altra (di spalle).
// Il delegato in piedi batte il pugno e le carte saltano, l'amministratore delegato suda, i caffè sono finiti da un pezzo.

persona("_ad", { testa: "calvo", corpo: "seduto", abito: "completo", swap: { B: "D", b: "d", M: "S" } })
persona("_hr", { testa: "lunghi", corpo: "seduto", abito: "completo", swap: { B: "p", b: "K", M: "K", R: "W" } })
persona("_legale", { testa: "corti", corpo: "seduto", abito: "completo", swap: { B: "d", b: "K", M: "y", R: "b" } })
persona("_rsu1", { testa: "nuca", corpo: "seduto", abito: "gilet", swap: { B: "Y", b: "y", M: "m" } })
persona("_rsu2", { testa: "nuca_calva", corpo: "seduto", swap: { B: "T", b: "t", M: "K", F: "c", f: "x" } })
persona("_rsu3", { testa: "corti", corpo: "piedi", swap: { B: "R", b: "r", M: "s" } })
sprite("legale", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__legale"), hline(2, 5, 6, "K"))   // occhiali
sprite("hr", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__hr"))
sprite("rsu1", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__rsu1"))
sprite("rsu2", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__rsu2"))
// l'amministratore delegato: una goccia di sudore che scende dalla tempia
anim("ad", { w: 10, h: 16, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__ad"),
  (c) => { const t = c.frame % 8; if (t < 6) { const y = 3 + t; c.px(9, y, "L"); if (t > 1) c.px(9, y - 1, "B") } })
// il delegato in piedi accanto al tavolo che batte il pugno: su (a lungo), giù di colpo sull'angolo del tavolo, botta, e torna su
const PUGNO = { su: [rect(3, 3, 2, 10, "R"), rect(2, 0, 3, 3, "F"), px(2, 2, "f")],
                meta: [rect(2, 11, 3, 3, "R"), rect(0, 9, 3, 3, "F")],
                giu: [rect(2, 14, 2, 2, "R"), rect(0, 15, 3, 3, "F"), px(0, 17, "f")] }
anim("rsu3", { w: 14, h: 24, fps: FPS, outline: "K", pivot: [9, 24] }, stamp("__rsu3", 4, 4), rect(4, 15, 1, 4, "r"),
  frame({ hold: 7 }, ...PUGNO.su),
  frame({ hold: 1 }, ...PUGNO.meta),
  frame({ hold: 2 }, ...PUGNO.giu),
  frame({ hold: 4 }, ...PUGNO.giu),
  frame({ hold: 2 }, ...PUGNO.meta))
// la botta: due trattini gialli che saltano fuori dall'angolo del tavolo
anim("botta", { w: 9, h: 6, fps: FPS },
  frame({ hold: 8 }), frame({ hold: 2 }, px(0, 2, "Y"), px(1, 3, "Y"), px(8, 2, "Y"), px(7, 3, "Y"), px(4, 0, "Y"), px(4, 1, "Y")), frame({ hold: 6 }))
// le carte sul tavolo che saltano alla botta
anim("carte", { w: 14, h: 6, fps: FPS, pivot: "bottom" },
  frame({ hold: 8 }, rect(0, 4, 6, 2, "W"), hline(0, 5, 6, "S"), rect(7, 4, 6, 2, "W"), hline(7, 5, 6, "S")),
  frame({ hold: 2 }, rect(0, 1, 6, 2, "W"), hline(0, 2, 6, "S"), rect(8, 2, 6, 1, "W"), hline(8, 3, 6, "S")),
  frame({ hold: 6 }, rect(0, 4, 6, 2, "W"), hline(0, 5, 6, "S"), rect(7, 4, 6, 2, "W"), hline(7, 5, 6, "S")))
sprite("bicchiere", { outline: "K", pivot: "bottom" }, "WW\nSS\nSS")
sprite("thermos", { outline: "K", pivot: "bottom" }, `
  .KK.
  RRRR
  RRRR
  RrrR
  RRRR
  RRRR
  rrrr`)
sprite("bottiglia", { outline: "K", pivot: "bottom" }, ".b.\n.L.\nLBL\nLWL\nLBL\nLBL\nbbb")
// la sedia vista da dietro
sprite("sedia_retro", { w: 14, h: 11, outline: "K", pivot: "bottom" }, rect(0, 0, 14, 6, "d"), hline(0, 0, 14, "D"), rect(1, 6, 12, 2, "K"), rect(2, 8, 2, 3, "d"), rect(10, 8, 2, 3, "d"))
// la finestra di notte: luna, luci della zona industriale, l'antenna con la luce rossa che lampeggia
anim("_notte", { w: 30, h: 22, frames: LOOP, fps: FPS },
  rect(0, 0, 30, 22, "d"), rect(0, 0, 30, 6, "K"), circ(22, 5, 3, "C"), circ(23, 4, 2, "d"),
  rect(0, 16, 30, 6, "K"), rect(2, 13, 6, 9, "K"), rect(14, 14, 9, 8, "K"), vline(25, 6, 16, "D"),
  ...[[3, 15], [6, 15], [16, 16], [19, 16], [16, 18], [4, 18], [27, 19]].map(([x, y]) => px(x, y, "Y")),
  (c) => { if (c.frame % 8 < 3) c.px(25, 5, "R") })
sprite("finestra_notte", { w: 34, h: 27 }, box(0, 0, 34, 26, "K"), box(1, 1, 32, 24, "W"), vline(16, 2, 22, "W"), rect(0, 25, 34, 2, "S"), hline(0, 26, 34, "K"))
// l'orologio segna le tre
sprite("orologio3", { w: 11, h: 11, outline: "K" }, circ(5, 5, 5, "W"), ring(5, 5, 5, "S"), px(5, 1, "K"), px(9, 5, "K"), px(5, 9, "K"), px(1, 5, "K"),
  vline(5, 2, 4, "K"), hline(5, 5, 3, "K"), px(5, 5, "R"))
// la lavagna a fogli con le cifre della trattativa: +5% cancellato, +2% e un punto di domanda
sprite("lavagna_fogli", { w: 24, h: 34, pivot: "bottom" },
  rect(1, 0, 22, 24, "W"), box(1, 0, 22, 24, "K"), hline(2, 23, 20, "S"), rect(0, 0, 24, 2, "D"),
  text(4, 4, "+5%", "R"), line(3, 9, 16, 4, "K"), text(4, 12, "+2%", "b"), text(17, 12, "?", "K"),
  line(5, 24, 2, 33, "D"), line(18, 24, 21, 33, "D"), vline(12, 24, 10, "D"))
// la lampada a sospensione sopra il tavolo
sprite("lampada", { w: 16, h: 12, outline: "K", pivot: [8, 0] }, vline(8, 0, 6, "K"), poly([3, 6, 13, 6, 16, 11, 0, 11], "g"), hline(1, 10, 14, "G"), rect(6, 11, 4, 1, "i"))
// il tavolo lungo visto di fronte
sprite("tavolo", { w: 100, h: 18, pivot: "bottom" },
  rect(0, 0, 100, 4, "k"), hline(0, 0, 100, "q"), hline(0, 3, 100, "N"), box(0, 0, 100, 4, "K"),
  rect(2, 4, 96, 6, "M"), box(2, 4, 96, 6, "K"), rect(4, 10, 3, 8, "M"), rect(93, 10, 3, 8, "M"), box(4, 9, 3, 9, "K"), box(93, 9, 3, 9, "K"))

scene("trattativa", { w: SW, h: SH, bg: "l", world: { light: { at: [80, 12] } } },
  layer("muro",
    rect(0, 0, SW, 2, "p"), rect(0, 30, SW, 12, "N"), hline(0, 30, SW, "k"), hline(0, 41, SW, "M"),     // muro e boiserie
    ...Array.from({ length: 10 }, (_, i) => vline(i * 16 + 8, 31, 10, "M")),
    rect(0, 42, SW, 30, "t"), ...[48, 56, 66].map((y) => hline(0, y, SW, "T")),                       // moquette
    stamp("_notte", 124, 5), stamp("finestra_notte", 122, 3),
    stamp("orologio3", 101, 7)),
  layer("azienda",
    stamp("hr", 56, 44), stamp("ad", 80, 44), stamp("legale", 104, 44)),
  layer("lavagna", stamp("lavagna_fogli", 15, 54)),
  layer("tavolo",
    stamp("tavolo", 80, 58),
    stamp("carte", 74, 41), stamp("carte", 100, 41), stamp("carte", 50, 41),
    stamp("thermos", 63, 41), stamp("bicchiere", 67, 41), stamp("bicchiere", 92, 41), stamp("bottiglia", 115, 41),
    stamp("botta", 121, 34)),
  layer("in piedi", stamp("rsu3", 137, 48)),
  layer("sindacato", { sort: "y" },
    stamp("rsu1", 66, 62), stamp("sedia_retro", 66, 69),
    stamp("rsu2", 98, 62), stamp("sedia_retro", 98, 69)),
  layer("lampada", stamp("lampada", 80, 0)),
)

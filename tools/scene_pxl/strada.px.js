// Scenette della strada (eventi di Radio Traffico Nord): estate al casello, nebbia, neve, pioggia.
// Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html). Colori e omini in comune.px.js.
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

// ================================================================ pezzi della strada (vista di lato)
// il bilico: telone col nastro colorato, cabina arancione, guarda a destra
sprite("_bilico", { w: 58, h: 25, outline: "K", pivot: "bottom" },
  rect(0, 0, 40, 17, "W"), rect(0, 6, 40, 3, "B"), hline(0, 8, 40, "b"), hline(0, 16, 40, "S"),
  ...[10, 20, 30].map((x) => vline(x, 1, 15, "S")),
  rect(0, 17, 58, 3, "d"),
  rect(42, 1, 15, 17, "O"), hline(42, 1, 15, "a"), vline(56, 2, 16, "o"), hline(42, 17, 15, "o"),
  rect(46, 4, 9, 6, "L"), px(54, 4, "W"), px(53, 5, "W"), vline(45, 4, 13, "o"),
  rect(55, 13, 3, 4, "s"), px(57, 12, "i"), rect(43, 18, 6, 1, "s"),
  ...[7, 15, 49].map((x) => [circ(x, 21, 3, "K"), px(x, 21, "s")]).flat())
// l'auto delle ferie: bagagli sul tetto
sprite("_auto", { w: 26, h: 15, outline: "K", pivot: "bottom" },
  rect(0, 7, 26, 5, "R"), hline(0, 7, 26, "e"), hline(0, 11, 26, "r"),
  poly([5, 7, 8, 3, 18, 3, 22, 7], "R"), poly([7, 7, 9, 4, 13, 4, 13, 7], "L"), poly([14, 7, 14, 4, 17, 4, 20, 7], "L"),
  px(24, 8, "i"), px(0, 8, "r"),
  rect(8, 0, 10, 3, "N"), rect(9, 0, 4, 2, "O"), rect(14, 1, 3, 2, "B"),        // valigie sul portapacchi
  circ(5, 12, 2, "K"), circ(20, 12, 2, "K"), px(5, 12, "s"), px(20, 12, "s"))
// pioppo della pianura
sprite("_pioppo", { pivot: "bottom" }, `
  ..h..
  .hGg.
  .hGg.
  hGGgg
  .hGg.
  hGGgg
  .hGg.
  hGGgg
  .GGg.
  hGGgg
  .GGg.
  ..g..
  ..N..
  ..N..`)
// guardrail lungo tutta la scena, con i paletti ogni 8 pixel
const guardrail = (y, a = "S", b = "s") => [rect(0, y, SW, 2, a), hline(0, y + 1, SW, b), ...Array.from({ length: 20 }, (_, i) => vline(i * 8 + 3, y + 2, 2, b))]
// asfalto: bordo, mezzeria tratteggiata, bordo vicino
const asfalto = (y0, y1, base = "D", riga = "W") => [rect(0, y0, SW, y1 - y0, base), hline(0, y0 + 1, SW, riga), hline(0, y1 - 2, SW, riga),
  ...Array.from({ length: 10 }, (_, i) => hline(i * 16 + 4, Math.round((y0 + y1) / 2), 8, riga))]

// ================================================================ STRADA
// Coda al casello in pieno agosto: il sole picchia, l'aria trema sopra l'asfalto, la sbarra non si alza
// (lampeggia la luce gialla), il papà scende dall'auto a farsi aria col giornale, il bambino saluta dal finestrino.

// il papà in canottiera, calvo con gli occhiali da sole, che si sventola col giornale
persona("_papa", { testa: "calvo", swap: { B: "W", b: "S", D: "b", M: "m" } })
anim("papa", { w: 13, h: 20, fps: FPS, outline: "K", pivot: [5, 20] }, stamp("__papa"),
  rect(2, 5, 2, 2, "d"), rect(6, 5, 2, 2, "d"), hline(4, 5, 2, "K"), px(2, 5, "j"), px(6, 5, "j"),   // occhiali da sole
  frame({ hold: 2 }, rect(9, 2, 4, 6, "W"), hline(10, 3, 2, "s"), hline(10, 5, 2, "s"), vline(12, 2, 6, "S"), rect(9, 8, 2, 3, "F")),
  frame({ hold: 2 }, rect(9, 5, 4, 5, "W"), hline(10, 6, 2, "s"), hline(10, 8, 2, "s"), vline(12, 5, 5, "S"), rect(9, 10, 2, 1, "F")))
// la goccia di sudore che scende dalla testa pelata
anim("goccia", { w: 2, h: 7, frames: LOOP, fps: FPS }, (c) => { const t = c.frame % 8; if (t < 6) c.px(0, t, t < 4 ? "L" : "B") })
// il bambino nel finestrino posteriore: la manina saluta
anim("bimbo", { w: 6, h: 6, fps: FPS },
  rect(1, 2, 3, 3, "F"), hline(1, 1, 3, "y"), px(2, 3, "K"),
  frame({ hold: 2 }, px(4, 1, "F"), px(5, 0, "F")),
  frame({ hold: 2 }, px(4, 2, "F"), px(5, 2, "F")))
// il sole, coi raggi che girano
anim("sole", { w: 23, h: 23, frames: LOOP, fps: FPS },
  circ(11, 11, 6, "Y"), circ(11, 11, 4, "i"), px(9, 8, "W"),
  (c) => {
    const diag = (c.frame % 8) < 4
    const R = diag ? [[1, 1], [1, -1], [-1, 1], [-1, -1]] : [[1, 0], [-1, 0], [0, 1], [0, -1]]
    for (const [dx, dy] of R) for (let k = diag ? 7 : 8; k <= (diag ? 8 : 10); k++) c.px(11 + dx * k, 11 + dy * k, "Y")
  })
// la luce del casello che lampeggia (Telepass in tilt)
anim("lampeggiante", { w: 4, h: 3, fps: FPS, outline: "K" },
  frame({ hold: 4 }, rect(0, 0, 4, 3, "Y"), px(1, 0, "i")),
  frame({ hold: 4 }, rect(0, 0, 4, 3, "y")))
// il casello: pensilina con il cartello, pilastri, la cabina sull'isola e la sbarra abbassata
sprite("casello", { w: 52, h: 50, pivot: "bottom" },
  rect(0, 0, 52, 6, "W"), box(0, 0, 52, 6, "K"), hline(1, 3, 50, "G"), hline(1, 4, 50, "g"),     // pensilina
  rect(14, 6, 15, 8, "b"), box(14, 6, 15, 8, "K"), text(16, 8, "ALT", "W"),                      // cartello della pista
  ...[4, 46].map((x) => [rect(x, 6, 3, 44, "S"), vline(x + 2, 6, 44, "s"), box(x, 6, 3, 44, "K")]).flat(),
  rect(24, 46, 22, 4, "Y"), ...[25, 29, 33, 37, 41].map((x) => rect(x, 46, 2, 4, "K")), box(24, 46, 22, 4, "K"),  // isola zebrata
  rect(28, 22, 14, 24, "S"), box(28, 22, 14, 24, "K"), rect(27, 20, 16, 3, "R"), box(27, 20, 16, 3, "K"),   // cabina
  rect(30, 25, 10, 8, "L"), px(31, 26, "W"), rect(33, 29, 4, 4, "F"), hline(33, 28, 4, "m"),      // finestrino col casellante
  rect(26, 34, 2, 3, "D"), ...Array.from({ length: 11 }, (_, i) => rect(5 + i * 2, 35, 2, 2, i % 2 ? "W" : "R")), box(4, 34, 24, 4, "K"))

scene("strada", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 60 } },
  layer("fondo",
    rect(0, 0, SW, 8, "B"),
    ellipse(70, 9, 10, 2, "W"), ellipse(126, 6, 7, 1, "W"),
    rect(0, 27, SW, 3, "g"), ...[6, 22, 50, 96, 104].map((x) => ellipse(x, 27, 6, 2, "g")),    // filari lontani
    rect(0, 30, SW, 9, "q"), ...[[12, 32], [40, 34], [70, 33], [100, 35], [128, 32], [24, 36], [86, 37], [146, 36]].map(([x, y]) => hline(x, y, 6, "y")),
    ...[30, 38, 62, 70, 78].map((x) => stamp("_pioppo", x, 39)),
    ...guardrail(38),
    ...asfalto(40, 61),
    // l'aria che trema sopra l'asfalto: le righe lontane ondeggiano di un pixel
    (c) => c.warp((x, y) => [Math.round(Math.sin(y * 1.3 + c.phase * Math.PI * 4) * 0.6), 0], [0, 26, SW, 16])),
  layer("cielo", stamp("sole", 6, 0)),
  layer("traffico",
    stamp("casello", 132, 62),
    stamp("_auto", -2, 61),
    stamp("_bilico", 40, 61),
    stamp("_auto", 98, 61),
    stamp("bimbo", 92, 47),
    stamp("lampeggiante", 138, 28)),
  layer("davanti",
    stamp("papa", 76, 61), stamp("goccia", 72, 43),
    rect(0, 62, SW, 10, "q"), ...guardrail(62), ...[8, 40, 74, 110, 150].map((x) => [px(x, 67, "y"), px(x + 1, 66, "y"), px(x + 2, 67, "y")]).flat()),
)

// ================================================================ NEBBIA
// Nebbia in Val Padana: i pioppi sono ombre, il bilico è un fantasma e si vedono solo i suoi fari,
// l'auto davanti ha il retronebbia acceso e le quattro frecce, il pannello sopra la strada lampeggia «NEBBIA».
// La nebbia passa a sbuffi: ogni sbuffo nasce, scivola a sinistra e si scioglie in un giro.

const FANTASMA = { W: "S", B: "S", b: "S", S: "S", s: "S", d: "j", O: "j", a: "S", o: "j", L: "S", i: "i", K: "j" }   // il bilico lontano, quasi sparito
const OMBRA = { W: "S", B: "j", b: "j", S: "j", s: "j", d: "s", O: "s", a: "j", o: "s", L: "j", i: "i", K: "s" }       // la cabina, un po' più vicina
// il pannello a messaggio variabile, con le due luci gialle che si alternano
anim("pmv", { w: 34, h: 13, fps: FPS, outline: "K" },
  rect(0, 0, 34, 13, "d"), rect(1, 1, 32, 11, "K"), text(6, 4, "NEBBIA", "Y"),
  frame({ hold: 4 }, rect(1, 1, 3, 2, "O"), rect(30, 1, 3, 2, "o")),
  frame({ hold: 4 }, rect(1, 1, 3, 2, "o"), rect(30, 1, 3, 2, "O")))
// gli sbuffi di nebbia (16 fotogrammi: tengono il ritmo di tutta la scena)
anim("sbuffi", { w: SW, h: SH, frames: LOOP, fps: FPS }, (c) => {
    // [x di partenza, riga, lunghezza, quando nasce]
    const S = [[30, 44, 18, 0], [110, 46, 22, 0.3], [70, 54, 26, 0.55], [150, 52, 16, 0.8], [10, 57, 20, 0.15], [96, 34, 20, 0.65], [44, 30, 16, 0.4]]
    for (const [x0, y, L, off] of S) {
      const age = (c.phase + off) % 1, len = Math.round(L * Math.min(1, age * 4, (1 - age) * 4))
      const x = x0 - Math.floor(age * 8)
      if (len > 0) { c.hline(x - (len >> 1), y, len, "W"); if (len > 6) c.hline(x - (len >> 1) + 3, y - 1, len - 6, "W") }
    }
  })
// le quattro frecce dell'auto davanti
anim("frecce", { w: 26, h: 3, fps: FPS }, frame({ hold: 4 }, px(0, 0, "O"), px(25, 0, "O")), frame({ hold: 4 }))
scene("nebbia", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 60 } },
  layer("fondo",
    rect(0, 22, SW, 18, "W"),                                                                       // la nebbia è più bianca in basso
    ...[4, 12, 20, 44, 52, 60, 100, 108, 116, 140, 148].map((x) => stamp("_pioppo", x, 39, { swap: { h: "S", G: "S", g: "S", N: "S" } })),
    ...[28, 36, 76, 84, 92, 128].map((x) => stamp("_pioppo", x, 40, { swap: { h: "j", G: "j", g: "s", N: "s" } })),
    ...guardrail(38, "S", "j"),
    ...asfalto(40, 61, "s", "S")),
  layer("cartello",
    rect(118, 0, 3, 40, "j"), vline(120, 0, 40, "s"), rect(98, 4, 22, 2, "j"),
    stamp("pmv", 82, 6)),
  layer("traffico",
    // l'auto davanti: grigia nella nebbia, con il retronebbia rosso acceso
    stamp("_auto", 128, 61, { swap: { R: "S", e: "W", r: "j", L: "j", N: "j", O: "S", B: "S", K: "j", s: "S", i: "S" } }),
    rect(115, 51, 2, 2, "R"), px(114, 52, "e"), px(117, 51, "e"),
    stamp("frecce", 115, 49),
    stamp("_bilico", 26, 61, { swap: FANTASMA }),
    clip([38, 30, 22, 32], stamp("_bilico", 26, 61, { swap: OMBRA })),
    // il fascio dei fari che buca la nebbia
    poly([56, 46, 84, 42, 92, 49, 86, 57, 56, 51], "C"), poly([56, 47, 70, 46, 71, 50, 56, 50], "W"),
    rect(54, 46, 2, 3, "i")),
  layer("sbuffi", stamp("sbuffi")),
  layer("davanti", rect(0, 62, SW, 10, "j"), ...guardrail(62, "s", "D"), ...[14, 52, 90, 132].map((x) => [px(x, 68, "s"), px(x + 1, 67, "s"), px(x + 2, 68, "s")]).flat()),
)

// ================================================================ NEVE
// Neve al Frejus: le montagne bianche, i larici carichi, la neve che scende, lo spazzaneve col lampeggiante
// arancione che sputa neve dalla lama, e l'autista del bilico fermo con le catene aggrovigliate in mano.

// fiocchi: ognuno scende di 36 o 72 righe in un giro (così il giro si chiude) e ondeggia di un pixel
const rnd = rng(7)
const FIOCCHI = Array.from({ length: 70 }, () => [Math.floor(rnd() * SW), Math.floor(rnd() * SH), rnd() < 0.25 ? 2 : 1, Math.floor(rnd() * 8)])
anim("fiocchi", { w: SW, h: SH, frames: LOOP, fps: FPS }, (c) => {
  for (const [x0, y0, big, ph] of FIOCCHI) {
    const fall = big === 2 ? 72 : 36, y = (y0 + Math.floor(c.phase * fall)) % SH
    const x = x0 + ((c.frame + ph) % 8 < 4 ? 0 : 1)
    c.px(x, y, "W"); if (big === 2) c.px(x + 1, y, "W")
  }
})
// larice carico di neve
sprite("_larice", { outline: "K", pivot: "bottom" }, `
  ...W...
  ..WtW..
  ..ttt..
  .WWtWW.
  .ttttt.
  WWtttWW
  ttttttt
  .WWNWW.
  ...N...`)
// lo spazzaneve: lama gialla zebrata davanti, spargisale dietro; il lampeggiante gira e la lama sputa neve
sprite("_spazzaneve", { w: 50, h: 26, outline: "K", pivot: "bottom" },
  rect(0, 8, 15, 12, "O"), hline(0, 8, 15, "a"), ...[3, 7, 11].map((x) => vline(x, 9, 11, "o")),     // spargisale
  rect(15, 4, 15, 16, "O"), hline(15, 4, 15, "a"), rect(19, 7, 9, 6, "L"), px(27, 7, "W"), vline(18, 7, 12, "o"),   // cabina
  rect(30, 10, 10, 10, "O"), hline(30, 10, 10, "a"), vline(39, 11, 9, "o"),                          // muso
  rect(0, 20, 42, 2, "d"),
  poly([41, 9, 46, 12, 46, 24, 40, 24, 42, 14], "Y"), ...[13, 17, 21].map((y) => line(41, y + 2, 45, y - 2, "K")),   // lama
  rect(20, 2, 5, 2, "d"),
  ...[8, 33].map((x) => [circ(x, 22, 3, "K"), px(x, 22, "s")]).flat())
anim("lampeggiante_neve", { w: 11, h: 5, fps: FPS },
  rect(3, 2, 5, 3, "o"),
  frame({ hold: 1 }, rect(3, 2, 2, 3, "O"), px(1, 2, "a"), px(0, 3, "a")),
  frame({ hold: 1 }, rect(4, 2, 3, 3, "O"), rect(5, 1, 1, 1, "a"), px(5, 0, "a")),
  frame({ hold: 1 }, rect(6, 2, 2, 3, "O"), px(9, 2, "a"), px(10, 3, "a")),
  frame({ hold: 1 }))
anim("spruzzo", { w: 14, h: 14, fps: FPS },
  frame({ hold: 2 }, px(2, 10, "W"), px(5, 7, "W"), px(6, 8, "W"), px(9, 5, "W"), px(4, 11, "S"), px(8, 9, "S")),
  frame({ hold: 2 }, px(3, 9, "W"), px(7, 5, "W"), px(8, 6, "W"), px(11, 3, "W"), px(12, 6, "S"), px(6, 10, "S"), px(1, 11, "W")))
// l'autista col berretto di lana e le catene aggrovigliate; il fiato fa la nuvoletta
persona("_autista", { testa: "berretto", swap: { R: "Y", r: "y", B: "T", b: "t", D: "d", M: "m" } })
anim("autista", { w: 18, h: 26, fps: FPS, outline: "K", pivot: [5, 26] }, stamp("__autista", 0, 6),
  rect(9, 16, 2, 3, "T"), rect(9, 19, 2, 2, "F"),                                                     // braccio teso con le catene
  frame({ hold: 2 }, ...[[11, 20], [12, 22], [13, 23], [14, 22], [15, 24], [16, 25], [12, 24], [14, 25]].map(([x, y], i) => px(x, y, i % 2 ? "D" : "s"))),
  frame({ hold: 2 }, ...[[11, 20], [12, 21], [13, 23], [13, 24], [14, 25], [15, 24], [16, 23], [12, 25]].map(([x, y], i) => px(x, y, i % 2 ? "D" : "s"))),
  frame({ hold: 2 }, ...[[11, 20], [12, 22], [13, 23], [14, 22], [15, 24], [16, 25], [12, 24], [14, 25]].map(([x, y], i) => px(x, y, i % 2 ? "D" : "s")), px(11, 11, "W"), px(12, 10, "W"), px(13, 10, "W")),
  frame({ hold: 2 }, ...[[11, 20], [12, 21], [13, 23], [13, 24], [14, 25], [15, 24], [16, 23], [12, 25]].map(([x, y], i) => px(x, y, i % 2 ? "D" : "s")), rect(13, 7, 3, 2, "W"), px(16, 7, "S"), px(14, 6, "S")))
// cartello rotondo blu «catene obbligatorie»
sprite("cartello_catene", { w: 9, h: 18, outline: "K", pivot: "bottom" }, rect(4, 8, 1, 10, "s"), circ(4, 4, 4, "b"), ring(4, 4, 3, "W"), circ(4, 4, 1, "W"), px(4, 4, "b"))

scene("neve", { w: SW, h: SH, bg: "j", world: { light: [-0.6, -1], ground: 60 } },
  layer("fondo",
    poly([0, 34, 18, 14, 30, 22, 52, 4, 74, 24, 92, 12, 116, 26, 138, 8, 160, 20, 160, 40, 0, 40], "S"),       // le Alpi
    poly([45, 10, 52, 4, 59, 10, 55, 9, 52, 12, 49, 9], "W"), poly([132, 14, 138, 8, 144, 14, 140, 12, 137, 15], "W"), poly([88, 16, 92, 12, 96, 16, 92, 15], "W"),
    poly([0, 40, 0, 30, 24, 24, 46, 32, 70, 26, 100, 34, 126, 28, 160, 32, 160, 40], "D"),               // il versante vicino
    poly([18, 26, 24, 24, 30, 26, 26, 27], "W"), poly([64, 28, 70, 26, 76, 28, 70, 29], "W"), poly([120, 30, 126, 28, 132, 30, 126, 31], "W"),
    ...[6, 14, 34, 42, 58, 84, 92, 104, 146, 154].map((x, i) => stamp("_larice", x, 40 + (i % 2))),
    rect(0, 39, SW, 4, "W"), ...[10, 40, 70, 100, 130].map((x) => ellipse(x, 39, 9, 2, "W")), hline(0, 42, SW, "S"),   // neve sul bordo lontano
    rect(0, 43, SW, 18, "j"), ...[47, 48, 54, 55].map((y) => hline(0, y, SW, "s")),                          // carreggiata con le tracce
    stamp("cartello_catene", 72, 44)),
  layer("mezzi",
    stamp("_spazzaneve", 26, 61), stamp("lampeggiante_neve", 15, 34), stamp("spruzzo", 47, 39),
    stamp("_bilico", 116, 61, { swap: { B: "R", b: "r" } })),
  layer("davanti",
    rect(0, 61, SW, 11, "W"), ...[16, 48, 80, 112, 144].map((x) => ellipse(x, 61, 12, 2, "W")), ...[64, 67].map((y) => hline(0, y, SW, "S")),
    ...guardrail(60, "S", "s").slice(0, 2),
    stamp("autista", 98, 68)),
  layer("neve che cade", stamp("fiocchi")),
)

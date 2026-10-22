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
anim("lampeggiante_neve", { w: 15, h: 8, fps: FPS },
  rect(5, 6, 5, 2, "K"), rect(5, 3, 5, 3, "o"), hline(5, 2, 5, "K"), vline(4, 3, 3, "K"), vline(10, 3, 3, "K"),
  frame({ hold: 1 }, rect(5, 3, 2, 3, "Y"), px(2, 3, "Y"), px(0, 2, "Y"), px(1, 5, "i")),
  frame({ hold: 1 }, rect(6, 3, 3, 3, "Y"), px(7, 1, "Y"), px(7, 0, "i"), px(4, 0, "i"), px(10, 0, "i")),
  frame({ hold: 1 }, rect(8, 3, 2, 3, "Y"), px(12, 3, "Y"), px(14, 2, "Y"), px(13, 5, "i")),
  frame({ hold: 1 }))
anim("spruzzo", { w: 14, h: 14, fps: FPS },
  frame({ hold: 2 }, rect(1, 9, 2, 2, "W"), px(3, 7, "W"), rect(5, 5, 2, 2, "W"), px(6, 8, "W"), px(9, 4, "W"), px(10, 7, "W"), px(12, 6, "W"), px(4, 11, "W"), px(8, 10, "W")),
  frame({ hold: 2 }, rect(2, 8, 2, 2, "W"), px(4, 6, "W"), rect(7, 3, 2, 2, "W"), px(8, 6, "W"), px(11, 2, "W"), px(12, 5, "W"), px(13, 8, "W"), px(6, 10, "W"), px(1, 11, "W")))
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
    stamp("_spazzaneve", 26, 61), stamp("lampeggiante_neve", 15, 31), stamp("spruzzo", 47, 39),
    stamp("_bilico", 116, 61, { swap: { B: "R", b: "r" } })),
  layer("davanti",
    rect(0, 61, SW, 11, "W"), ...[16, 48, 80, 112, 144].map((x) => ellipse(x, 61, 12, 2, "W")), ...[64, 67].map((y) => hline(0, y, SW, "S")),
    ...guardrail(60, "S", "s").slice(0, 2),
    stamp("autista", 98, 68)),
  layer("neve che cade", stamp("fiocchi")),
)

// ================================================================ PIOGGIA
// Allerta rossa in Liguria, vista dalla cabina: diluvia, i tergicristalli vanno a tutta, le gocce sul vetro,
// l'auto davanti alza gli spruzzi, il pannello dice «ALLERTA», a sinistra i paesini colorati sul monte,
// a destra il mare grigio; ogni tanto un lampo (un fotogramma). Dentro: il volante, le mani, l'alberello profumato che dondola.

const VETRO = (x, y) => y >= 6 && y < 52 && x >= 12 - (8 * (y - 6)) / 46 && x < 148 + (8 * (y - 6)) / 46
const LAMPO = 11                                                     // il fotogramma del lampo
const rndP = rng(11)
const GOCCE_FUORI = Array.from({ length: 46 }, () => [Math.floor(rndP() * SW), Math.floor(rndP() * SH)])
const GOCCE_VETRO = Array.from({ length: 26 }, () => [14 + Math.floor(rndP() * 132), 8 + Math.floor(rndP() * 42), Math.floor(rndP() * 8)])
anim("_fuori", { w: SW, h: SH, frames: LOOP, fps: FPS }, (c) => {
  const lampo = c.frame === LAMPO
  c.rect(0, 0, SW, 18, lampo ? "j" : "D"); c.rect(0, 18, SW, 13, lampo ? "S" : "j")             // cielo di tempesta
  for (const [x, y, rx] of [[30, 8, 22], [90, 5, 26], [140, 10, 18], [60, 14, 14]]) c.ellipse(x, y, rx, 4, lampo ? "s" : "d")
  if (lampo) c.line(118, 0, 114, 8, "W"), c.line(114, 8, 121, 14, "W"), c.line(121, 14, 116, 24, "W"), c.line(116, 24, 119, 30, "i")
  c.rect(80, 30, 80, 12, lampo ? "b" : "d")                                                     // il mare
  for (const [x, y] of [[96, 33], [120, 35], [140, 32], [108, 38], [132, 39], [150, 36]]) c.hline(x - Math.floor(c.phase * 4) % 4, y, 3, lampo ? "L" : "D")
  c.poly([0, 52, 0, 12, 14, 10, 30, 16, 48, 22, 66, 28, 82, 31, 60, 52], "t")                  // il monte sul mare
  c.poly([0, 40, 0, 16, 14, 13, 28, 19, 20, 30], "g")
  for (const [x, y, k] of [[8, 22, "q"], [13, 20, "a"], [18, 24, "e"], [24, 25, "Y"], [11, 27, "O"], [34, 25, "i"], [40, 27, "a"], [29, 29, "e"]])
    c.rect(x, y, 3, 3, k), c.px(x + 1, y + 1, "K"), c.hline(x, y - 1, 3, "r")                    // paesini colorati coi tetti rossi
  c.poly([30, 52, 130, 52, 82, 31, 78, 31], "s")                                                // la strada bagnata
  c.line(30, 52, 78, 31, "D"); c.line(130, 52, 82, 31, "D")
  c.line(26, 52, 77, 31, "S"); c.line(134, 52, 83, 31, "S")                                     // guardrail
  for (const [y0, y1] of [[33, 34], [37, 39], [43, 46], [50, 52]]) c.line(80, y0, 80, y1, "W")
  // l'auto davanti, con gli stop accesi e gli spruzzi
  c.rect(75, 34, 11, 6, "K"); c.rect(76, 35, 9, 2, "D"); c.px(76, 38, "R"); c.px(84, 38, "R"); c.px(75, 38, "e"); c.px(85, 38, "e")
  const sp = c.frame % 2; c.px(74 - sp, 40, "S"); c.px(73, 39 + sp, "S"); c.px(86 + sp, 40, "S"); c.px(87, 39 + sp, "S")
  // il pannello sopra la strada
  c.line(66, 31, 66, 20, "K"); c.line(94, 31, 94, 20, "K")
  c.rect(64, 13, 33, 10, "K"); c.text(67, 15, "ALLERTA", "R")
  c.px(65, 14, c.frame % 4 < 2 ? "O" : "o"); c.px(95, 14, c.frame % 4 < 2 ? "o" : "O")
  // la pioggia: righe oblique che cadono di 144 righe in un giro
  for (const [x0, y0] of GOCCE_FUORI) {
    const y = (y0 + Math.floor(c.phase * 144)) % SH, x = (x0 + Math.floor(y / 2)) % SW
    c.px(x, y, "L"); c.px(x + 1, y + 2, "j")
  }
})
// le gocce sul vetro: compaiono e restano finché non passa la spazzola
anim("_gocce", { w: SW, h: SH, frames: LOOP, fps: FPS }, (c) => {
  for (const [x, y, t0] of GOCCE_VETRO) if ((c.frame - t0 + 16) % 8 < 5) { c.px(x, y, "L"); c.px(x, y + 1, "B") }
})
// i tergicristalli: vanno su e giù in 8 fotogrammi
const ANGOLI = [186, 208, 238, 266, 282, 266, 238, 208]
anim("tergicristalli", { w: SW, h: SH, frames: LOOP, fps: FPS }, (c) => {
  const a = (ANGOLI[c.frame % 8] * Math.PI) / 180
  for (const [x0, L] of [[44, 40], [100, 42]]) {
    const x1 = Math.round(x0 + Math.cos(a) * L), y1 = Math.round(52 + Math.sin(a) * L)
    c.line(x0, 52, x1, y1, "K", 2)
    c.line(x0 + Math.round(Math.cos(a) * 10), 52 + Math.round(Math.sin(a) * 10), x1, y1, "s")
  }
})
// l'alberello profumato appeso al tetto della cabina, che dondola
anim("alberello", { w: 9, h: 16, fps: FPS },
  ...[[0, 2], [1, 2], [0, 2], [-1, 2]].map(([dx, h]) => frame({ hold: h }, line(4, 0, 4 + dx, 6, "S"),
    grid(2 + dx, 7, "..G..\n.GGG.\nGGgGG\n.GGG.\nGGGgG\n..N.."))))
// la spia arancione sul cruscotto
anim("spia", { w: 3, h: 2, fps: FPS }, frame({ hold: 4 }, rect(0, 0, 3, 2, "O")), frame({ hold: 4 }, rect(0, 0, 3, 2, "o")))
scene("pioggia", { w: SW, h: SH, bg: "d", world: { light: [-0.6, -1] } },
  layer("fuori", clip(VETRO, stamp("_fuori"), stamp("_gocce"))),
  layer("tergicristalli", clip((x, y) => y < 54, stamp("tergicristalli"))),
  layer("cabina",
    clip((x, y) => !VETRO(x, y), rect(0, 0, SW, SH, "d")),
    line(12, 6, 4, 52, "K"), line(148, 6, 156, 52, "K"), hline(12, 5, 137, "K"), rect(0, 0, SW, 5, "D"), hline(0, 4, SW, "s"),   // montanti e cielo della cabina
    rect(116, 4, 9, 2, "K"),                                                                      // il gancio dell'alberello
    stamp("alberello", 116, 6),
    rect(0, 52, SW, 20, "D"), hline(0, 52, SW, "j"), hline(0, 53, SW, "s"), rect(0, 66, SW, 6, "d"),   // cruscotto
    ...[[33, 58], [55, 58]].map(([x, y]) => [circ(x, y, 3, "K"), ring(x, y, 3, "s"), line(x, y, x + 2, y - 2, "W")]).flat(),
    stamp("spia", 96, 58),
    rect(108, 56, 22, 7, "K"), rect(110, 58, 12, 3, "u"), px(126, 59, "R"), px(124, 59, "O"),      // la radio CB
    ring(44, 101, 40, "s"), ring(44, 101, 39, "K"), ring(44, 101, 38, "K"), ring(44, 101, 37, "d"),   // il volante
    rect(20, 64, 5, 4, "F"), hline(20, 67, 5, "f"), poly([14, 72, 19, 68, 25, 68, 23, 72], "b"),   // le mani sul volante
    rect(63, 64, 5, 4, "F"), hline(63, 67, 5, "f"), poly([65, 72, 63, 68, 69, 68, 74, 72], "b")),
)

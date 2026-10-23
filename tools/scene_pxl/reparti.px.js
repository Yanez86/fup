// Scenette dei reparti, in cima alle finestre del gioco (non negli eventi): lavoro in magazzino e ufficio tecnologie.
// Stesse regole delle scene degli eventi: 160×72, 16 fotogrammi a 125 ms, colori di TPAL, omini da persona() (comune.px.js).
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

// caschetto bianco del capoturno (W/S non vengono toccati dagli swap delle giacche)
TESTE.casco = [
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

// ================================================================ LAVORO
// La zona spedizioni vista da vicino: le scatole arrivano dalla tenda a strisce, scorrono sul nastro, il picker le spara
// con lo scanner (bip!), il tunnel di lettura le legge, al banco si chiude il collo col nastro adesivo e si stampa l'etichetta.
// Davanti il roll container pieno di colli e il capoturno che guarda il tablet.

// i colli che viaggiano sul nastro: scatola di cartone e busta bianca
sprite("_collo_a", { outline: "K" }, `
  kkkkNkkkkk
  kkkkNkkWWk
  kkkkNkkWWk
  kkkkNkkkkk
  NNNNNNNNNN`)
sprite("_collo_b", { outline: "K" }, `
  WWWWWWWW
  WSWWWRRW
  WWWWWRRW
  SSSSSSSS`)
// il nastro: tappeto che corre a destra, telaio, rulli e gambe
anim("_nastro", { w: 92, h: 18, frames: LOOP, fps: FPS }, (c) => {
  c.rect(0, 0, 92, 3, "d"); c.hline(0, 0, 92, "D")
  for (let x = 0; x < 92; x++) if ((x - 2 * c.frame + 64) % 8 === 0) c.px(x, 1, "K")         // le righe del tappeto, 2 pixel a fotogramma
  c.rect(0, 3, 92, 4, "D"); c.hline(0, 3, 92, "S"); c.hline(0, 6, 92, "d")
  for (let x = 3; x < 92; x += 8) c.px(x, 4, "s")
  for (const x of [4, 44, 84]) { c.rect(x, 7, 3, 11, "d"); c.vline(x, 7, 11, "D") }
  c.hline(4, 12, 84, "d")
})
// i colli sul nastro: uno schema che si ripete ogni 32 pixel e avanza di 2 a fotogramma, così il giro si chiude in 16
anim("_colli", { w: 92, h: 10, frames: LOOP, fps: FPS }, (c) => {
  for (let k = -1; k < 4; k++) {
    const x = 2 * c.frame + 32 * k
    c.stamp("_collo_a", x, 2); c.stamp("_collo_b", x + 17, 4)
  }
})
// la tenda a strisce del passaggio nel muro, da dove arrivano i colli
sprite("tenda_strisce", { w: 12, h: 18 }, rect(0, 0, 12, 18, "K"), rect(0, 0, 12, 2, "D"),
  ...[2, 4, 6, 8].map((x) => [vline(x, 2, 16, "L"), vline(x + 1, 2, 16, "j")]).flat(), box(0, 0, 12, 18, "K"))
// il tunnel di lettura in fondo al nastro, con la luce che diventa verde quando ha letto
anim("tunnel", { w: 18, h: 20, fps: FPS, outline: "K" },
  rect(0, 0, 18, 20, "S"), rect(0, 0, 18, 2, "W"), vline(17, 2, 18, "s"), rect(3, 5, 12, 6, "d"), hline(3, 5, 12, "K"),
  hline(4, 8, 10, "R"), rect(2, 14, 14, 2, "Y"), hline(2, 15, 14, "y"),
  frame({ hold: 6 }, rect(13, 1, 3, 2, "R")), frame({ hold: 2 }, rect(13, 1, 3, 2, "G")))
// il lampeggiante giallo sul palo all'inizio del nastro
anim("faro", { w: 5, h: 16, fps: FPS, outline: "K", pivot: "bottom" }, vline(2, 4, 12, "s"), rect(1, 2, 3, 3, "D"),
  frame({ hold: 2 }, rect(0, 0, 5, 3, "Y"), px(1, 0, "i")), frame({ hold: 2 }, rect(0, 0, 5, 3, "y")))

// il picker col gilet giallo e lo scanner a pistola
persona("_picker", { testa: "corti", abito: "gilet", swap: { B: "Y", b: "y", M: "m" } })
sprite("picker", { w: 13, h: 20, outline: "K", pivot: [5, 22] }, stamp("__picker"),
  rect(9, 8, 4, 2, "d"), px(12, 9, "R"), px(10, 10, "d"), rect(9, 10, 1, 3, "Y"), px(9, 10, "F"))     // lo scanner alzato sul nastro
// il bip: il raggio rosso dallo scanner alla scatola, due volte al giro
anim("bip", { w: 6, h: 6, fps: FPS },
  frame({ hold: 2 }, line(0, 0, 2, 4, "R"), px(3, 5, "e"), px(4, 0, "W"), px(5, 1, "W")),
  frame({ hold: 6 }))
// la collega col berretto che prende un collo dal nastro
persona("_presa", { testa: "berretto", abito: "gilet", swap: { B: "O", b: "o", M: "K", F: "c", f: "x", R: "G", r: "g" } })
sprite("presa", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__presa"), rect(0, 14, 2, 2, "c"), rect(8, 14, 2, 2, "c"))
// il magazziniere davanti, con un collo in braccio da mettere nel roll
persona("_carico", { testa: "corti", swap: { B: "T", b: "t", M: "K", F: "c", f: "x" } })
sprite("carico", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__carico"),
  rect(1, 11, 8, 6, "k"), hline(1, 16, 8, "N"), vline(5, 11, 5, "N"), rect(6, 12, 2, 2, "W"), px(0, 14, "c"), px(9, 14, "c"))
// il roll container pieno di colli colorati
sprite("roll", { w: 22, h: 28, outline: "K", pivot: "bottom" },
  rect(1, 1, 20, 24, "d"),
  rect(1, 15, 9, 10, "k"), vline(5, 15, 10, "N"), rect(10, 17, 11, 8, "R"), hline(10, 24, 11, "r"), rect(2, 9, 8, 6, "W"), hline(2, 14, 8, "S"),
  rect(10, 7, 10, 10, "B"), hline(10, 16, 10, "b"), rect(2, 2, 7, 7, "Y"), hline(2, 8, 7, "y"), rect(12, 2, 8, 5, "k"), hline(12, 6, 8, "N"),
  ...[0, 5, 10, 15, 21].map((x) => vline(x, 0, 26, "S")), hline(0, 0, 22, "S"), hline(0, 12, 22, "S"), hline(0, 25, 22, "s"),
  rect(1, 26, 3, 2, "K"), rect(18, 26, 3, 2, "K"))
// il banco di imballo: piano di legno, il collo da chiudere, il rotolo di film estensibile in piedi
sprite("banco", { w: 34, h: 26, outline: "K", pivot: "bottom" },
  rect(26, 0, 6, 15, "L"), vline(27, 1, 13, "W"), vline(31, 0, 15, "j"), hline(26, 0, 6, "S"), rect(28, 0, 2, 1, "N"),   // film estensibile
  rect(9, 6, 14, 9, "k"), hline(9, 6, 14, "q"), vline(15, 6, 9, "N"), hline(9, 14, 14, "N"),                              // il collo
  rect(0, 15, 34, 3, "k"), hline(0, 15, 34, "q"), hline(0, 17, 34, "N"), rect(1, 18, 32, 6, "N"), rect(3, 19, 28, 4, "M"),
  rect(1, 24, 3, 2, "M"), rect(30, 24, 3, 2, "M"))
// la stampante delle etichette: l'etichetta esce piano piano
anim("stampante", { w: 10, h: 10, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  const n = Math.min(4, Math.floor(c.frame / 3))
  if (n) { c.rect(2, 4 - n, 6, n, "W"); c.hline(3, 4 - n + 1 > 3 ? 3 : 4 - n + 1, 3, "K") }
  c.rect(0, 4, 10, 6, "Z"); c.hline(0, 4, 10, "z"); c.hline(1, 6, 8, "K"); c.px(8, 8, "G")
})
// l'imballatrice col maglione viola: chiude il collo con la pistola del nastro adesivo
persona("_imballo", { testa: "lunghi", swap: { B: "P", b: "p", M: "K" } })
anim("imballo", { w: 14, h: 20, fps: FPS, outline: "K", pivot: [5, 22] }, stamp("__imballo"),
  frame({ hold: 2 }, rect(9, 13, 3, 2, "R"), px(11, 12, "L"), px(9, 15, "F")),
  frame({ hold: 2 }, rect(10, 13, 3, 2, "R"), px(12, 12, "L"), px(10, 15, "F")),
  frame({ hold: 2 }, rect(11, 13, 3, 2, "R"), px(13, 12, "L"), px(11, 15, "F")),
  frame({ hold: 2 }, rect(10, 13, 3, 2, "R"), px(12, 12, "L"), px(10, 15, "F")))
// il capoturno col caschetto bianco e il tablet: sullo schermo le barre delle spedizioni
persona("_capoturno", { testa: "casco", abito: "gilet", swap: { B: "O", b: "o", M: "m" } })
anim("capoturno", { w: 10, h: 20, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, stamp("__capoturno"),
  (c) => {
    c.rect(2, 12, 6, 5, "d"); c.rect(3, 13, 4, 3, "B")
    const h = [1, 2, 3, 2][Math.floor(c.frame / 4)]
    c.vline(3, 16 - 1, 1, "W"); c.vline(4, 16 - h, h, "W"); c.vline(5, 16 - 2, 2, "W")
    c.px(1, 15, "F"); c.px(8, 15, "F")
  })
// lampade industriali dal soffitto
sprite("lampada_ind", { w: 9, h: 6, outline: "K", pivot: [4, 0] }, vline(4, 0, 2, "K"), poly([2, 2, 7, 2, 9, 5, 0, 5], "D"), hline(1, 4, 7, "d"), rect(2, 5, 5, 1, "i"))
// il bancale avvolto nel film, sul fondo
sprite("bancale_film", { w: 20, h: 18, outline: "K", pivot: "bottom" },
  rect(0, 0, 20, 15, "k"), ...[0, 5, 10].map((y) => hline(0, y + 4, 20, "N")), ...[6, 13].map((x) => vline(x, 0, 15, "N")),
  line(2, 14, 12, 0, "L"), line(8, 14, 18, 2, "L"), hline(0, 0, 20, "q"),
  rect(0, 15, 20, 3, "N"), rect(2, 16, 4, 2, "M"), rect(14, 16, 4, 2, "M"))

scene("lavoro", { w: SW, h: SH, bg: "S", world: { light: [-0.6, -1], ground: 66 } },
  layer("fondo",
    rect(0, 0, SW, 3, "d"), hline(0, 3, SW, "K"),
    rect(0, 6, SW, 5, "L"), ...Array.from({ length: 9 }, (_, i) => vline(i * 20 + 2, 6, 5, "s")), hline(0, 6, SW, "W"), hline(0, 11, SW, "s"),  // finestre alte
    ...Array.from({ length: 10 }, (_, i) => vline(i * 16 + 8, 12, 32, "s")),
    rect(0, 44, SW, 28, "j"), hline(0, 44, SW, "s"), hline(0, 57, SW, "Y"), hline(0, 70, SW, "Y"),             // pavimento con le strisce
    vline(56, 3, 11, "K"), vline(94, 3, 11, "K"),
    rect(54, 14, 43, 9, "G"), box(54, 14, 43, 9, "K"), hline(55, 21, 41, "g"), text(56, 16, "SPEDIZIONI", "W"),   // cartello
    ...[24, 76, 128].map((x) => stamp("lampada_ind", x, 3))),
  layer("dietro", stamp("picker", 50, 42), stamp("presa", 82, 42)),
  layer("nastro",
    stamp("_nastro", 24, 40), stamp("_colli", 24, 30),
    stamp("tenda_strisce", 16, 24), stamp("tunnel", 101, 23), stamp("bip", 58, 28), stamp("faro", 30, 31)),
  layer("ombre", { shade: true }, ellipse(14, 68, 12, 1, "K"), ellipse(36, 70, 6, 1, "K"), ellipse(100, 69, 6, 1, "K"), ellipse(139, 67, 18, 1, "K")),
  layer("davanti", { sort: "y" },
    stamp("roll", 14, 68), stamp("carico", 36, 70), stamp("capoturno", 100, 69),
    stamp("imballo", 141, 58), stamp("banco", 139, 67), stamp("stampante", 128, 52)),
)

// ================================================================ TECNOLOGIA
// L'ufficio tecnologie al lavoro su una ricerca: l'armadio dei server con le lucine, due tecnici di spalle ai monitor
// (il codice che scorre, il grafico, la barra di avanzamento), la ricercatrice alla lavagna degli schemi con la lampadina
// dell'idea, il robottino prototipo sulla scrivania. Senza ricerca in corso il gioco la mostra ferma sul fotogramma 0.

// tecnici visti di spalle: nuca + corpo seduto; uno con le cuffie
persona("_tec1", { testa: "nuca", corpo: "seduto", swap: { B: "P", b: "p", M: "K" } })
persona("_tec2", { testa: "nuca", corpo: "seduto", swap: { B: "G", b: "g", M: "o" } })
sprite("tec1", { w: 10, h: 17, outline: "K", pivot: "bottom" }, stamp("__tec1", 0, 1), hline(2, 0, 6, "d"), px(1, 1, "d"), px(8, 1, "d"),
  rect(0, 4, 2, 3, "R"), rect(8, 4, 2, 3, "R"))                                                     // le cuffie
sprite("tec2", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__tec2"), px(7, 6, "Y"), px(8, 5, "Y"))   // la matita dietro l'orecchio
// la sedia da ufficio vista da dietro
sprite("sedia_uff", { w: 12, h: 12, outline: "K", pivot: "bottom" }, rect(1, 0, 10, 5, "d"), hline(1, 0, 10, "D"), vline(5, 5, 3, "K"), vline(6, 5, 3, "K"),
  hline(1, 8, 10, "K"), px(0, 9, "K"), px(11, 9, "K"), px(5, 9, "K"), rect(0, 10, 2, 2, "K"), rect(10, 10, 2, 2, "K"), rect(5, 10, 2, 2, "K"))
// i monitor: codice che scorre, grafico che scorre, barra di avanzamento
const CODICE = [[0, 7, "P"], [2, 9, "B"], [2, 5, "G"], [4, 8, "W"], [4, 6, "Y"], [2, 4, "B"], [0, 3, "P"], [0, 10, "G"]]   // rientro, lunghezza, colore
function schermo(c) { c.rect(0, 0, 22, 16, "K"); c.rect(1, 1, 20, 13, "d"); c.rect(9, 16, 4, 2, "s"); c.rect(6, 18, 10, 1, "s") }
anim("mon_codice", { w: 22, h: 19, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  schermo(c)
  CODICE.forEach(([ind, len, k], i) => { const y = 2 + ((2 * i - c.frame + 32) % 16); if (y < 13) c.hline(2 + ind, y, Math.min(len, 18 - ind), k) })
  if (c.frame % 4 < 2) c.px(19, 12, "W")
})
anim("mon_grafico", { w: 22, h: 19, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  schermo(c)
  for (const y of [4, 8, 12]) c.hline(1, y, 20, "D")
  for (let x = 1; x < 21; x++) {
    const y = 8 - Math.round(3 * Math.sin(2 * Math.PI * (x + c.frame) / 16)); c.px(x, y, "u")
    if ((x + c.frame) % 8 === 0) c.vline(x, 9, 4, "Y")
  }
})
anim("mon_barra", { w: 22, h: 19, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  schermo(c)
  c.text(3, 3, "R&S", "W"); c.box(2, 9, 18, 4, "s"); c.rect(3, 10, 1 + c.frame, 2, "g"); c.vline(3 + c.frame, 10, 2, "G")
})
// il robottino prototipo: l'antenna lampeggia, saluta col braccio
anim("robot", { w: 11, h: 13, fps: FPS, outline: "K", pivot: "bottom" },
  vline(5, 0, 2, "s"), rect(2, 2, 7, 5, "W"), vline(8, 2, 5, "S"), rect(3, 3, 5, 2, "b"), px(4, 3, "u"), px(6, 3, "u"),
  rect(3, 7, 5, 4, "S"), vline(7, 7, 4, "s"), rect(2, 11, 2, 2, "D"), rect(7, 11, 2, 2, "D"), px(1, 8, "S"),
  frame({ hold: 4 }, px(5, 0, "R"), rect(9, 6, 1, 3, "S")),
  frame({ hold: 4 }, px(5, 0, "e"), rect(9, 4, 1, 3, "S"), px(10, 4, "S")))
// la scrivania lunga bianca
sprite("scrivania_bianca", { w: 90, h: 16, outline: "K", pivot: "bottom" },
  rect(0, 0, 90, 3, "W"), hline(0, 2, 90, "S"), rect(2, 3, 86, 5, "S"), hline(2, 7, 86, "j"), rect(3, 8, 3, 8, "j"), rect(84, 8, 3, 8, "j"), rect(44, 8, 2, 8, "j"))
// l'armadio dei server, con le lucine che lampeggiano ognuna al suo ritmo
anim("server", { w: 22, h: 54, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  c.rect(0, 0, 22, 54, "d"); c.rect(0, 0, 22, 2, "D"); c.vline(21, 2, 52, "K"); c.rect(2, 50, 18, 4, "K")
  for (let r = 0; r < 9; r++) {
    const y = 3 + r * 5; c.rect(2, y, 18, 4, "K"); c.hline(2, y, 18, "D")
    for (let k = 0; k < 4; k++) {
      const i = r * 4 + k, per = [2, 4, 8, 16][(i * 7) % 4], fase = (i * 5) % per, on = (c.frame + fase) % per < per / 2
      const col = i % 11 === 3 ? "R" : i % 5 === 1 ? "Y" : i % 7 === 2 ? "B" : "G"
      c.px(4 + k * 2, y + 2, on ? col : "d")
    }
    c.hline(13, y + 2, 5, "D")
  }
})
// la lavagna degli schemi: riquadri, frecce, un punto di domanda
sprite("lavagna_schemi", { w: 34, h: 26, outline: "K" },
  rect(0, 0, 34, 26, "S"), rect(1, 1, 32, 22, "W"), rect(2, 23, 30, 3, "s"), rect(8, 23, 4, 1, "R"), rect(14, 23, 4, 1, "b"),
  box(3, 3, 8, 5, "b"), box(23, 3, 8, 5, "b"), box(13, 14, 8, 5, "G"), line(11, 5, 22, 5, "R"), px(21, 4, "R"), px(21, 6, "R"),
  line(7, 8, 14, 13, "R"), line(27, 8, 20, 13, "R"), text(26, 15, "?", "P"), hline(4, 20, 8, "s"))
// la ricercatrice in camice, in carrozzina, che indica la lavagna
carrozzina("_ricerca", { testa: "lunghi", swap: { B: "W", b: "S", M: "y", D: "b" } })
sprite("ricercatrice", { w: 20, h: 26, outline: "K", pivot: [10, 26] }, stamp("__ricerca", 0, 3),
  rect(14, 4, 2, 9, "W"), vline(15, 4, 9, "S"), rect(14, 1, 2, 3, "F"), px(16, 1, "R"))               // braccio alzato col pennarello
// la lampadina dell'idea: spenta, poi si accende coi raggi
anim("idea", { w: 9, h: 9, fps: FPS },
  frame({ hold: 8 }),
  frame({ hold: 8 }, grid(0, 0, `
    ....Y....
    .Y.....Y.
    ...KKK...
    ..KYiYK..
    Y.KYYYK.Y
    ..KYYYK..
    ...KSK...
    ...KSK...
    ....K....`)))
// il primo brevetto dell'azienda, incorniciato
sprite("brevetto", { w: 14, h: 16, outline: "K" }, rect(0, 0, 14, 16, "k"), rect(1, 1, 12, 14, "C"), ...[3, 5, 7, 9].map((y) => hline(3, y, 8, "s")),
  circ(9, 12, 2, "R"), px(9, 12, "Y"), hline(2, 3, 4, "N"))
// tazza
sprite("tazza_tec", { outline: "K", pivot: "bottom" }, "TTTT.\nTTTTT\nTTTT.\ntttt.")

scene("tecnologia", { w: SW, h: SH, bg: "L", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "b"), hline(0, 3, SW, "B"), ...[30, 80, 130].map((x) => [rect(x - 8, 4, 16, 1, "W"), hline(x - 8, 5, 16, "S")]).flat(),
    rect(0, 46, SW, 2, "D"), rect(0, 48, SW, 24, "D"), ...[56, 64].map((y) => hline(0, y, SW, "d")),
    ...Array.from({ length: 10 }, (_, i) => vline(i * 16 + 8, 48, 24, "d")),
    stamp("lavagna_schemi", 122, 8), stamp("brevetto", 31, 7),
    curve([26, 62, 40, 64, 60, 62], "K")),                                                            // il cavo dal server alla scrivania
  layer("arredi",
    stamp("server", 15, 66),
    stamp("scrivania_bianca", 77, 60),
    stamp("mon_codice", 50, 44), stamp("mon_grafico", 75, 44), stamp("mon_barra", 100, 44),
    stamp("robot", 115, 44), stamp("tazza_tec", 37, 44),
    stamp("ricercatrice", 139, 66), stamp("idea", 128, 34)),
  layer("ombre", { shade: true }, ellipse(15, 67, 12, 1, "K"), ellipse(139, 67, 10, 1, "K")),
  layer("tecnici", { sort: "y" },
    stamp("tec1", 62, 61), stamp("sedia_uff", 62, 72),
    stamp("tec2", 92, 61), stamp("sedia_uff", 92, 72)),
)

// ================================================================ SALA SERVER (pacchetto Reparto IT e Ingegneria)
// Per gli eventi della fonte «Sala server» e del Reparto IT, e in cima alla scheda Reparti tecnici: tre armadi coi led
// (gli stessi dell'ufficio tecnologie), i cavi che salgono nella canalina, il condizionatore con la ventola che gira,
// il sistemista col portatile, un post-it sull'armadio e la luce d'allarme che lampeggia.
persona("_sis", { testa: "corti", swap: { B: "T", b: "t", M: "N" } })
sprite("sistemista", { w: 14, h: 21, outline: "K", pivot: "bottom" }, stamp("__sis", 0, 1),
  rect(8, 11, 6, 4, "D"), rect(9, 11, 5, 3, "d"), hline(8, 15, 6, "s"))                              // il portatile aperto in mano
anim("schermo_sis", { w: 4, h: 2, fps: FPS }, frame({ hold: 4 }, rect(0, 0, 4, 2, "u")), frame({ hold: 4 }, rect(0, 0, 2, 2, "u"), rect(2, 0, 2, 2, "G")))
// il condizionatore a parete: la ventola gira (4 posizioni, un giro ogni 4 fotogrammi), il display segna 18 gradi
anim("clima_sala", { w: 32, h: 24, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  c.rect(0, 0, 32, 24, "S"); c.rect(0, 0, 32, 2, "W"); c.vline(31, 2, 22, "s"); c.hline(0, 23, 32, "s")
  c.circ(11, 12, 8, "d"); c.circ(11, 12, 7, "D")
  const p = c.frame % 4, R = [[0, -6, 0, 6], [-4, -4, 4, 4], [-6, 0, 6, 0], [-4, 4, 4, -4]][p]
  c.line(11 + R[0], 12 + R[1], 11 + R[2], 12 + R[3], "j"); c.line(11 - R[1], 12 + R[0], 11 + R[1], 12 - R[0], "j"); c.px(11, 12, "W")
  c.rect(22, 5, 8, 6, "K"); c.text(23, 6, "18", "G"); [14, 17, 20].forEach((y) => c.hline(22, y, 8, "s"))
})
// la luce d'allarme sopra la porta: lampeggia ogni 8 fotogrammi
anim("allarme", { w: 6, h: 5, fps: FPS, outline: "K" },
  frame({ hold: 4 }, rect(0, 0, 6, 4, "r"), hline(0, 4, 6, "D")),
  frame({ hold: 4 }, rect(0, 0, 6, 4, "R"), rect(1, 1, 2, 1, "e"), hline(0, 4, 6, "D")))
sprite("postit", { w: 5, h: 5, outline: "K" }, rect(0, 0, 5, 5, "Y"), hline(1, 1, 3, "y"), hline(1, 3, 2, "y"))
// la piastrella del pavimento flottante sollevata, coi cavi che spuntano
sprite("piastrella", { w: 14, h: 9, outline: "K", pivot: "bottom" }, rect(0, 0, 14, 3, "S"), hline(0, 2, 14, "s"), rect(1, 3, 2, 6, "d"), rect(11, 3, 2, 6, "d"),
  curve([4, 9, 6, 4, 9, 9], "Y"), curve([6, 9, 8, 5, 11, 9], "B"))

scene("sala_server", { w: SW, h: SH, bg: "d", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "K"), rect(0, 5, SW, 3, "D"), hline(0, 8, SW, "K"),                              // la canalina dei cavi
    ...[18, 44, 70].map((x) => [vline(x - 4, 8, 4, "Y"), vline(x, 8, 4, "B"), vline(x + 4, 8, 4, "G")]).flat(),
    rect(0, 46, SW, 26, "j"), ...[52, 58, 64, 70].map((y) => hline(0, y, SW, "s")), ...Array.from({ length: 14 }, (_, i) => vline(i * 12 + 4, 46, 26, "s")),
    rect(96, 14, 18, 32, "D"), box(96, 14, 18, 32, "K"), rect(99, 17, 5, 3, "L"), px(110, 30, "Y"),    // la porta tagliafuoco
    stamp("allarme", 102, 9), stamp("clima_sala", 122, 12)),
  layer("arredi",
    stamp("server", 18, 66), stamp("server", 44, 66), stamp("server", 70, 66), stamp("postit", 49, 20),
    stamp("piastrella", 140, 66)),
  layer("ombre", { shade: true }, ellipse(44, 67, 34, 1, "K"), ellipse(110, 67, 6, 1, "K")),
  layer("persone", { sort: "y" }, stamp("sistemista", 110, 66), stamp("schermo_sis", 111, 52)),
)

// ================================================================ UFFICIO TECNICO
// Per gli eventi della fonte «Ufficio tecnico» e dell'Ingegneria: la pianta del magazzino appesa al muro, l'ingegnere col casco
// giallo che la indica con la bacchetta, il collega al tavolo da disegno con la lampada, i caschi sul tavolo, il cronometro
// a muro con la lancetta che fa un giro in 16 fotogrammi, i raccoglitori sullo scaffale.
persona("_ing", { testa: "casco", swap: { W: "Y", S: "y", B: "O", b: "o" } })
anim("ingegnere", { w: 16, h: 21, fps: FPS, outline: "K", pivot: "bottom" },
  frame({ hold: 8 }, stamp("__ing", 0, 1), line(9, 12, 15, 2, "N")),
  frame({ hold: 8 }, stamp("__ing", 0, 1), line(9, 12, 14, 0, "N")))
persona("_dis", { testa: "nuca", corpo: "seduto", swap: { B: "B", b: "b", M: "M" } })
sprite("disegnatore", { w: 10, h: 16, outline: "K", pivot: "bottom" }, stamp("__dis"))
// la pianta del magazzino: corsie, scaffali, baie e il percorso rosso del prelievo
sprite("pianta", { w: 52, h: 30, outline: "K" },
  rect(0, 0, 52, 30, "b"), box(2, 2, 48, 26, "L"),
  ...[6, 14, 22, 30, 38].map((x) => rect(x, 5, 4, 14, "B")), ...[8, 20, 32, 44].map((x) => rect(x, 23, 4, 4, "L")),
  line(10, 21, 42, 21, "R"), line(42, 21, 42, 6, "R"), px(41, 7, "R"), px(43, 7, "R"), text(4, 3, "", "W"))
// il cronometro a muro: la lancetta fa un giro in 16 fotogrammi
anim("cronometro", { w: 13, h: 15, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  c.rect(5, 0, 3, 2, "s"); c.circ(6, 8, 6, "S"); c.circ(6, 8, 5, "W")
  const a = (c.frame / 16) * 2 * Math.PI; c.line(6, 8, 6 + Math.round(4 * Math.sin(a)), 8 - Math.round(4 * Math.cos(a)), "R"); c.px(6, 8, "K")
})
sprite("tavolo_dis", { w: 24, h: 18, outline: "K", pivot: "bottom" }, line(2, 6, 22, 2, "W"), line(2, 7, 22, 3, "S"), rect(3, 7, 2, 11, "D"), rect(19, 4, 2, 14, "D"),
  vline(20, 0, 4, "s"), rect(18, 0, 4, 2, "Y"))                                                          // il piano inclinato e la lampada
sprite("casco_giallo", { w: 7, h: 4, outline: "K", pivot: "bottom" }, rect(1, 0, 5, 3, "Y"), hline(0, 3, 7, "y"))
sprite("tavolo_lungo", { w: 48, h: 14, outline: "K", pivot: "bottom" }, rect(0, 0, 48, 3, "k"), hline(0, 2, 48, "N"), rect(2, 3, 3, 11, "N"), rect(43, 3, 3, 11, "N"))
sprite("raccoglitori", { w: 22, h: 30, outline: "K" }, rect(0, 0, 22, 30, "k"), ...[9, 19, 29].map((y) => hline(0, y, 22, "N")),
  ...[[1, "R"], [4, "B"], [7, "G"], [10, "Y"], [13, "P"], [16, "B"]].map(([x, k]) => rect(x, 1, 2, 8, k)),
  ...[[1, "G"], [4, "Y"], [7, "R"], [12, "B"], [15, "B"], [18, "O"]].map(([x, k]) => rect(x, 11, 2, 8, k)),
  ...[[2, "S"], [6, "S"], [10, "W"]].map(([x, k]) => rect(x, 21, 3, 8, k)))
sprite("muletto_mod", { w: 9, h: 6, outline: "K", pivot: "bottom" }, rect(0, 1, 6, 4, "O"), vline(7, 0, 5, "D"), hline(7, 4, 2, "D"), px(1, 5, "K"), px(4, 5, "K"))

scene("ufficio_tecnico", { w: SW, h: SH, bg: "C", world: { light: [-0.6, -1], ground: 66 } },
  layer("muro",
    rect(0, 0, SW, 3, "k"), hline(0, 3, SW, "N"), rect(0, 46, SW, 26, "z"), hline(0, 46, SW, "Z"), ...[56, 66].map((y) => hline(0, y, SW, "Z")),
    stamp("pianta", 56, 7), stamp("cronometro", 122, 8), stamp("raccoglitori", 134, 16)),
  layer("arredi",
    stamp("tavolo_lungo", 82, 66), stamp("casco_giallo", 66, 52), stamp("casco_giallo", 74, 52), stamp("muletto_mod", 94, 52),
    stamp("tavolo_dis", 26, 66), stamp("disegnatore", 18, 62)),
  layer("ombre", { shade: true }, ellipse(82, 67, 24, 1, "K"), ellipse(26, 67, 12, 1, "K"), ellipse(118, 67, 6, 1, "K")),
  layer("persone", { sort: "y" }, stamp("ingegnere", 118, 66)),
)

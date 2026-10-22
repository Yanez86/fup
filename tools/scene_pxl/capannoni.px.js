// Il capannone nella scheda di un magazzino (finestra Magazzini): un'immagine 160×72 a strati trasparenti,
// tutti da 16 fotogrammi (un giro di 2 secondi), che il gioco sovrappone (CAP in src/game.html):
//   cap_sfondo                         cielo, colline, prato e asfalto (sotto a tutto)
//   cap_c_<classe>                     l'edificio: fat, vec, std, mod, inn (con i portoni a raso)
//   cap_<dotazione>                    una per dotazione (ribalte, solare, led, parcheggio, portineria, piazzale, giardino,
//                                      mensa, frigo, sprinkler, ricarica); l'antincendio ha anche cap_sprinkler_dietro (la cisterna)
//   cap_lotto, cap_cantiere            il terreno edificabile e il cantiere, sopra lo sfondo
// Le misure dell'edificio sono fisse (X0..X1, tetto, portoni) così ogni strato cade al suo posto su ogni classe.
//   python3 tools/scene_pxl/esporta.py   (porta gli strati in assets/capannoni/)
include("comune.px.js", { palette: true })

const X0 = 34, X1 = 126, TOP = 20, BASE = 56       // facciata dell'edificio
const PORTE = [42, 62, 82]                          // portoni (14 px di larghezza)
const strato = (nome, ...ops) => anim("cap_" + nome, { w: SW, h: SH, frames: LOOP, fps: FPS }, ...ops)
const giro = (c, n) => Math.floor(c.frame / (LOOP / n)) % 2   // 0/1 che cambia n volte a giro

// ================================================================ sfondo
strato("sfondo",
  rect(0, 0, SW, 46, "L"), rect(0, 0, SW, 6, "B"), hline(0, 6, SW, "B"),
  poly([0, 40, 18, 32, 34, 36, 52, 30, 74, 35, 96, 29, 118, 34, 140, 30, 160, 34, 160, 46, 0, 46], "j"),
  poly([0, 44, 26, 38, 50, 42, 80, 37, 112, 42, 140, 38, 160, 41, 160, 46, 0, 46], "S"),
  rect(0, 44, SW, 13, "h"), hline(0, 44, SW, "G"), ...[6, 20, 140, 152].map((x) => px(x, 48, "G")),
  rect(0, 57, SW, 15, "s"), hline(0, 57, SW, "j"), ...[0, 24, 48, 72, 96, 120, 144].map((x) => hline(x + 4, 71, 10, "S")),
  (c) => { // due nuvole che passano
    [[0, 12, 0], [0.5, 20, 1]].forEach(([o, y, k]) => { const x = Math.floor(((c.phase + o) % 1) * 200) - 30
      c.rect(x, y, 14 + 4 * k, 3, "W"); c.rect(x + 3, y - 2, 7, 2, "W"); c.hline(x + 1, y + 3, 12 + 4 * k, "S") }) })

// ================================================================ edifici
// facciata comune: muro, fascia delle finestre, tre portoni a raso, la porta del personale
function facciata({ muro, riga, fin, telaio, porta, rigaPorta, finestre = "fascia" }) {
  const o = [rect(X0, TOP, X1 - X0, BASE - TOP, muro), ...[32, 44].map((y) => hline(X0, y, X1 - X0, riga)),
    vline(X0, TOP, BASE - TOP, "K"), vline(X1 - 1, TOP, BASE - TOP, "K"), hline(X0, BASE - 1, X1 - X0, "K")]
  if (finestre === "fascia") o.push(rect(X0 + 4, 24, X1 - X0 - 8, 4, fin), hline(X0 + 4, 23, X1 - X0 - 8, telaio), hline(X0 + 4, 28, X1 - X0 - 8, telaio),
    ...[48, 64, 80, 96, 112].map((x) => vline(x, 24, 4, telaio)))
  if (finestre === "quadre") [40, 54, 68, 82, 96, 110].forEach((x) => o.push(rect(x, 24, 6, 5, fin), box(x - 1, 23, 8, 7, telaio)))
  PORTE.forEach((x) => { o.push(rect(x, 40, 14, 16, porta), box(x - 1, 39, 16, 17, "K")); [43, 46, 49, 52].forEach((y) => o.push(hline(x, y, 14, rigaPorta))) })
  o.push(rect(100, 47, 5, 9, "W"), box(99, 46, 7, 10, "K"), px(103, 51, "K"))
  return o
}
// Standard: grigio, tetto piano
strato("c_std",
  rect(X0 - 2, 15, X1 - X0 + 4, 5, "D"), hline(X0 - 2, 15, X1 - X0 + 4, "K"), hline(X0 - 2, 19, X1 - X0 + 4, "d"),
  ...facciata({ muro: "S", riga: "s", fin: "L", telaio: "D", porta: "s", rigaPorta: "j" }))
// Vecchio: muri color crema, tetto a capanna di coppi, finestre quadre, portoni di legno e la ciminiera che fuma
strato("c_vec",
  rect(110, 4, 5, 12, "M"), hline(109, 4, 7, "K"),
  poly([X0 - 3, 21, 80, 12, X1 + 3, 21], "N"), poly([X0 - 3, 21, 80, 12, X1 + 3, 21, X1 + 3, 22, X0 - 3, 22], "M"),
  ...[16, 18].map((y) => hline(56, y, 48, "M")),
  ...facciata({ muro: "C", riga: "q", fin: "L", telaio: "N", porta: "N", rigaPorta: "M", finestre: "quadre" }),
  (c) => { for (let i = 0; i < 3; i++) { const p = (c.phase + i / 3) % 1, y = 2 - Math.floor(p * 10), x = 112 + Math.floor(p * 6)
    if (y > -3) { c.rect(x, y, 3 + Math.floor(p * 3), 2, p < 0.5 ? "S" : "W") } } })
// Fatiscente: tetto a shed arrugginito con un buco, muro scrostato, vetri rotti, portoni arrugginiti, erbacce
strato("c_fat",
  ...[0, 1, 2, 3, 4, 5].map((i) => poly([X0 - 2 + i * 16, 20, X0 - 2 + i * 16, 12, X0 + 14 + i * 16, 20], i === 3 ? "o" : "O")),
  hline(X0 - 2, 20, X1 - X0 + 4, "o"), rect(86, 14, 4, 4, "K"),
  ...facciata({ muro: "k", riga: "f", fin: "L", telaio: "M", porta: "o", rigaPorta: "M" }),
  ...[[52, 24], [76, 25], [104, 24]].map(([x, y]) => rect(x, y, 5, 3, "K")),
  rect(36, 34, 6, 5, "f"), rect(116, 30, 7, 6, "f"), line(58, 33, 61, 38, "M"), line(118, 41, 121, 45, "M"),
  ...[37, 40, 60, 79, 98, 108, 122].map((x) => [px(x, 54, "G"), px(x + 1, 53, "G"), px(x + 1, 54, "g")]).flat(),
  (c) => { const a = giro(c, 4); c.rect(122, 31 + a, 4, 1, "O"); c.px(125, 32 + a, "o") })   // la lamiera che sbatte
// Moderno: bianco con la fascia verde acqua e la bandiera
strato("c_mod",
  rect(X0 - 1, 17, X1 - X0 + 2, 3, "D"), hline(X0 - 1, 17, X1 - X0 + 2, "K"),
  ...facciata({ muro: "W", riga: "S", fin: "L", telaio: "b", porta: "S", rigaPorta: "s" }),
  rect(X0 + 1, TOP, X1 - X0 - 2, 3, "T"), hline(X0 + 1, TOP + 3, X1 - X0 - 2, "t"),
  vline(120, 2, 15, "D"),
  (c) => { const f = c.frame % 4; [0, 1, 2, 3].forEach((r) => c.hline(121, 3 + r, 8 - Math.abs(((r + f) % 4) - 2), r < 2 ? "G" : "W")); c.px(128 - (f % 2), 4, "R") })
// Innovativo: vetrata degli uffici a sinistra, fascia viola, la piccola pala eolica sul tetto
strato("c_inn",
  rect(X0 - 1, 17, X1 - X0 + 2, 3, "G"), hline(X0 - 1, 17, X1 - X0 + 2, "K"), hline(X0 - 1, 19, X1 - X0 + 2, "g"),
  ...facciata({ muro: "W", riga: "S", fin: "L", telaio: "P", porta: "S", rigaPorta: "s" }),
  rect(X0 + 1, TOP, 6, 36, "L"), rect(X0 + 1, TOP, 6, 36, "L"), ...[24, 30, 36, 42, 48].map((y) => hline(X0 + 1, y, 6, "b")), vline(X0 + 4, TOP, 36, "b"),
  rect(X0 + 1, TOP, X1 - X0 - 2, 2, "P"), hline(X0 + 1, TOP + 2, X1 - X0 - 2, "p"),
  vline(58, 6, 11, "D"),
  (c) => { const a = c.frame % 4, B = [[[0, -5], [0, 5]], [[-4, -3], [4, 3]], [[-5, 0], [5, 0]], [[-4, 3], [4, -3]]][a]
    B.forEach(([x, y]) => c.line(58, 6, 58 + x, 6 + y, "W")); c.px(58, 6, "K") })

// ================================================================ dotazioni
// Ribalte: i portoni diventano baie rialzate con i respingenti gialli e neri; un semirimorchio attraccato, la baia di mezzo che si apre
strato("ribalte",
  ...PORTE.map((x) => [rect(x, 40, 14, 12, "s"), ...[42, 45, 48].map((y) => hline(x, y, 14, "j")), rect(x - 1, 52, 16, 4, "d"), box(x - 1, 39, 16, 17, "K"),
    rect(x - 1, 50, 2, 4, "Y"), px(x - 1, 51, "K"), rect(x + 13, 50, 2, 4, "Y"), px(x + 14, 51, "K"), hline(x - 1, 56, 16, "D")]).flat(),
  // il semirimorchio di spalle sulla prima baia
  rect(40, 30, 18, 24, "W"), box(40, 30, 18, 24, "K"), vline(49, 31, 22, "S"), hline(41, 50, 16, "S"), rect(40, 54, 18, 2, "K"), rect(42, 56, 4, 2, "K"), rect(52, 56, 4, 2, "K"),
  (c) => { const a = giro(c, 4); c.px(41, 51, a ? "R" : "r"); c.px(56, 51, a ? "R" : "r")
    const h = [0, 2, 4, 6, 8, 10, 10, 10, 10, 10, 8, 6, 4, 2, 0, 0][c.frame], x = PORTE[1]   // la serranda della baia di mezzo
    if (h) { c.rect(x, 40 + 12 - h, 14, h, "d"); c.rect(x + 3, 52 - Math.min(h, 5), 5, Math.min(h, 5), "N"); c.hline(x + 3, 52 - Math.min(h, 5), 5, "k") } })
// Pannelli solari sul tetto, con il riflesso del sole che scorre
strato("solare",
  ...[40, 52, 64, 76].map((x) => [poly([x, 16, x + 3, 11, x + 13, 11, x + 10, 16], "b"), line(x + 1, 14, x + 11, 14, "B"), line(x + 2, 12, x + 12, 12, "B"),
    line(x + 6, 11, x + 5, 16, "B"), hline(x, 16, 11, "K"), vline(x + 2, 16, 2, "D"), vline(x + 9, 16, 2, "D")]).flat(),
  (c) => { const x = 40 + Math.floor(c.phase * 52); c.px(x, 12, "W"); c.px(x + 1, 12, "L") })
// LED: lampade bianche sopra i portoni, con il cono di luce
strato("led",
  ...PORTE.map((x) => [rect(x + 5, 35, 4, 2, "K"), hline(x + 6, 36, 2, "W"), px(x + 5, 37, "i"), px(x + 8, 37, "i"), px(x + 4, 38, "i"), px(x + 9, 38, "i")]).flat(),
  rect(99, 42, 7, 2, "K"), hline(100, 43, 5, "W"))
// Celle frigo: il gruppo frigorifero sul tetto con la ventola che gira, e il fiocco sulla porta
strato("frigo",
  rect(90, 8, 16, 9, "S"), box(90, 8, 16, 9, "K"), ...[11, 13, 15].map((y) => hline(91, y, 6, "s")), circ(101, 12, 3, "D"),
  rect(92, 30, 7, 7, "B"), box(91, 29, 9, 9, "K"), vline(95, 31, 5, "W"), hline(93, 33, 5, "W"), px(94, 32, "W"), px(96, 34, "W"), px(96, 32, "W"), px(94, 34, "W"),
  (c) => { const a = c.frame % 2; c.line(101 - (a ? 2 : 0), 10 + (a ? 0 : 2), 101 + (a ? 2 : 0), 14 - (a ? 0 : 2), "S"); c.px(101, 12, "K") })
// Antincendio: la cisterna rossa dietro il capannone (strato a parte) e l'idrante davanti con il lampeggiante sulla facciata
strato("sprinkler_dietro",
  rect(110, 0, 12, 18, "R"), rect(118, 0, 4, 18, "r"), box(110, -1, 12, 19, "K"), ...[4, 9, 14].map((y) => hline(111, y, 10, "r")), vline(108, 0, 18, "D"), ...[2, 6, 10, 14].map((y) => px(107, y, "D")))
strato("sprinkler",
  rect(30, 52, 4, 6, "R"), rect(29, 54, 6, 2, "R"), rect(30, 51, 4, 1, "r"), box(29, 50, 6, 8, "K"),
  rect(116, 34, 5, 4, "K"),
  (c) => { const a = giro(c, 4); c.rect(117, 35, 3, 2, a ? "R" : "e") })
// Ricarica dei muletti: l'armadietto verde con il fulmine e la spia che lampeggia
strato("ricarica",
  rect(108, 46, 7, 10, "G"), box(107, 45, 9, 11, "K"), line(112, 47, 110, 51, "Y"), line(110, 51, 112, 51, "Y"), line(112, 51, 110, 54, "Y"),
  (c) => { c.px(113, 47, giro(c, 8) ? "Y" : "g") })
// Mensa: la palazzina a sinistra, con il tetto rosso e la cappa che fuma
strato("mensa",
  rect(4, 40, 28, 16, "C"), box(4, 40, 28, 16, "K"), rect(2, 36, 32, 4, "R"), hline(2, 39, 32, "r"), box(2, 35, 32, 5, "K"),
  ...[7, 15].map((x) => [rect(x, 44, 6, 5, "L"), box(x - 1, 43, 8, 7, "N"), hline(x, 47, 6, "N")]).flat(),
  rect(24, 46, 5, 10, "W"), box(23, 45, 7, 11, "K"), px(27, 51, "K"),
  rect(9, 30, 3, 6, "S"), box(8, 29, 5, 7, "K"),
  (c) => { for (let i = 0; i < 2; i++) { const p = (c.phase + i / 2) % 1, y = 27 - Math.floor(p * 18), x = 9 + Math.floor(Math.sin(p * 6.28) * 2)
    c.rect(x, y, 3, 2, p < 0.6 ? "W" : "S") } })
// Parcheggio dei camion: la recinzione, la motrice parcheggiata col lampeggiante e il cartello P
strato("parcheggio",
  rect(127, 50, 33, 8, "s"), hline(127, 50, 33, "j"), ...[133, 145, 157].map((x) => vline(x, 51, 6, "W")),
  hline(127, 45, 33, "S"), ...[127, 135, 143, 151, 159].map((x) => vline(x, 45, 6, "s")),
  rect(134, 40, 14, 12, "O"), rect(134, 40, 6, 6, "L"), box(133, 39, 16, 14, "K"), hline(134, 47, 14, "o"), rect(136, 52, 4, 3, "K"), rect(144, 52, 4, 3, "K"), rect(146, 37, 2, 2, "S"),
  vline(155, 34, 16, "D"), rect(151, 30, 9, 8, "b"), box(150, 29, 11, 10, "K"), vline(154, 31, 5, "W"), rect(155, 31, 2, 1, "W"), px(157, 32, "W"), rect(155, 33, 2, 1, "W"),
  (c) => { c.rect(146, 37, 2, 2, giro(c, 4) ? "Y" : "o") })
// Portineria: la guardiola davanti a sinistra e la sbarra che si alza e si abbassa
strato("portineria",
  rect(2, 52, 14, 16, "W"), box(2, 52, 14, 16, "K"), rect(1, 49, 16, 3, "D"), hline(1, 49, 16, "K"), rect(4, 55, 10, 5, "L"), box(3, 54, 12, 7, "D"), rect(7, 61, 4, 7, "S"),
  rect(17, 60, 3, 8, "Y"), box(16, 59, 5, 9, "K"),
  (c) => { if (c.frame < 8) { for (let x = 21; x < 42; x++) c.px(x, 61, Math.floor((x - 21) / 3) % 2 ? "W" : "R"); c.hline(21, 60, 21, "K"); c.hline(21, 62, 21, "K") }
    else { for (let y = 39; y < 60; y++) c.px(19, y, Math.floor((y - 39) / 3) % 2 ? "W" : "R"); c.vline(18, 39, 21, "K"); c.vline(20, 39, 21, "K") } })
// Piazzale: le strisce, le cataste di pallet vuoti e il muletto che fa avanti e indietro
sprite("_pila", `
  NkNkNkNk
  NNNNNNNN
  NkNkNkNk
  NNNNNNNN
  NkNkNkNk
  NNNNNNNN`)
sprite("_muletto_p", `
  ...DDD....
  ...D.D....
  ...D.DYYYY
  D..D.YLLLY
  D..DYYYYYY
  DDDDYYYYYY
  ....KK..KK`)
strato("piazzale",
  ...[46, 98].map((x) => hline(x, 70, 20, "W")), vline(66, 60, 11, "W"), vline(98, 60, 11, "W"),
  stamp("_pila", 47, 62), stamp("_pila", 55, 64), stamp("_pila", 101, 63),
  (c) => { const x = 68 + Math.round(10 * (1 - Math.cos(c.phase * 6.2832)) / 2 * 2); c.stamp("_muletto_p", x, 62) })
// Giardino: due alberi, la siepe e la panchina; le chiome si muovono col vento
strato("giardino",
  rect(104, 66, 56, 4, "G"), hline(104, 66, 56, "h"), hline(104, 69, 56, "g"),
  rect(128, 63, 10, 2, "N"), vline(129, 65, 3, "M"), vline(136, 65, 3, "M"),
  ...[[123, 53], [152, 51]].map(([x, y]) => [rect(x - 1, y + 4, 3, 10, "N"), vline(x + 1, y + 4, 10, "M")]).flat(),
  (c) => { const a = giro(c, 2);
    [[123, 53, 6], [152, 51, 7]].forEach(([x, y, r]) => { c.circ(x + a, y, r, "G"); c.circ(x + a + 1, y + 2, r - 2, "g"); c.circ(x + a - 1, y - 1, r - 3, "G") }) })

// ================================================================ terreno e cantiere (sopra lo sfondo, al posto dell'edificio)
strato("lotto",
  rect(30, 46, 100, 10, "G"), ...[36, 52, 70, 88, 106, 122].map((x) => [vline(x, 44, 6, "N"), px(x, 43, "R")]).flat(),
  hline(36, 46, 87, "W"),
  rect(80, 26, 44, 14, "W"), box(79, 25, 46, 16, "K"), text(82, 28, "LOTTO", "K"), text(82, 34, "IN VENDITA", "R"), vline(88, 41, 15, "N"), vline(116, 41, 15, "N"),
  vline(46, 24, 26, "D"),
  (c) => { const f = c.frame % 4; [0, 1, 2, 3].forEach((r) => c.hline(47, 25 + r, 8 - Math.abs(((r + f) % 4) - 2), "R")) })
strato("cantiere",
  ...[X0, 56, 78, 100, X1 - 2].map((x) => rect(x, 26, 2, 30, "D")), hline(X0, 26, X1 - X0, "D"), hline(X0, 40, X1 - X0, "D"),
  ...[X0, 56, 78, 100].map((x) => [line(x + 1, 27, x + 21, 39, "j"), line(x + 1, 41, x + 21, 55, "j")]).flat(),
  rect(X0, 46, 22, 10, "S"), ...[48, 52].map((y) => hline(X0, y, 22, "s")),
  vline(140, 4, 52, "Y"), vline(141, 4, 52, "y"), ...[8, 14, 20, 26, 32, 38, 44, 50].map((y) => line(140, y, 141, y + 3, "K")),
  rect(90, 4, 66, 2, "Y"), hline(90, 6, 66, "y"), rect(148, 6, 8, 5, "D"), rect(136, 0, 9, 4, "Y"), box(135, -1, 11, 5, "K"),
  (c) => { const x = 100 + Math.round(16 * (1 - Math.cos(c.phase * 6.2832)) / 2), y = 20 + Math.round(4 * Math.sin(c.phase * 6.2832 * 2))
    c.vline(x, 7, y - 7, "K"); c.rect(x - 4, y, 9, 3, "N"); c.hline(x - 4, y, 9, "k") })

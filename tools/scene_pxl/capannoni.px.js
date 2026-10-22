// Il capannone nella scheda di un magazzino (finestra Magazzini): un'immagine 160×72 a strati trasparenti,
// tutti da 16 fotogrammi (un giro di 2 secondi), che il gioco sovrappone (CAP_ORD in src/game.html).
// Stesso stile delle scenette degli eventi: inquadratura vicina, contorno scuro su ogni cosa, omini di comune.px.js.
//   cap_sfondo                     cielo, pioppi lontani, prato e asfalto del piazzale (sotto a tutto)
//   cap_c_<classe>                 l'edificio: fat, vec, std, mod, inn, con i portoni a raso
//   cap_<dotazione>                uno per dotazione; dietro all'edificio stanno cap_sprinkler_dietro (la cisterna),
//                                  cap_giardino_dietro (gli alberi), cap_mensa e cap_parcheggio
//   cap_lotto, cap_cantiere        il terreno edificabile e il cantiere, sopra lo sfondo
// Le misure dell'edificio sono fisse (X0..X1, TOP, i portoni) così ogni strato cade al suo posto su ogni classe.
//   python3 tools/scene_pxl/esporta.py   (porta gli strati in assets/capannoni/)
include("comune.px.js", { palette: true })

const X0 = 26, X1 = 134, TOP = 18, BASE = 56, GND = 66   // facciata, piede dell'edificio, piedi delle persone
const PORTE = [38, 86], PW = 28                           // le due baie (larghe 28)
const strato = (nome, ...ops) => anim("cap_" + nome, { w: SW, h: SH, frames: LOOP, fps: FPS }, ...ops)
const ombra = (x, y, rx) => [ellipse(x, y, rx, 1, "d"), hline(x - rx + 1, y, 2 * rx - 1, "d")]   // ombra netta sull'asfalto

// ================================================================ pezzi
sprite("_pioppo", { outline: "K", pivot: "bottom" }, `
  ...h...
  ..hGg..
  ..hGg..
  .hGGgg.
  .hGGgg.
  hGGGggg
  .hGGgg.
  hGGGggg
  .hGGgg.
  hGGGggg
  .GGGgg.
  ..GGg..
  ...N...
  ...N...`)
// albero dalla chioma tonda, per il giardino
sprite("_albero", { w: 20, h: 26, outline: "K", pivot: "bottom" },
  circ(10, 9, 9, "G"), circ(12, 11, 7, "g"), circ(9, 8, 6, "G"), circ(7, 6, 3, "h"), px(13, 4, "h"), px(4, 11, "h"),
  rect(9, 17, 3, 9, "N"), vline(11, 17, 9, "M"), px(8, 25, "N"), px(12, 25, "N"))
// la guardiola col portiere al finestrino (come nella scena del piazzale)
sprite("_guardiola", { w: 20, h: 30, outline: "K", pivot: "bottom" },
  rect(0, 0, 20, 3, "D"), hline(0, 2, 20, "d"), rect(1, 3, 18, 27, "W"), vline(18, 3, 27, "S"), hline(1, 29, 18, "S"),
  rect(3, 7, 12, 9, "L"), box(3, 7, 12, 9, "D"), hline(4, 8, 6, "W"),
  rect(7, 11, 5, 5, "F"), hline(7, 10, 5, "d"), rect(6, 10, 7, 1, "d"), px(8, 12, "K"), px(10, 12, "K"), hline(7, 15, 5, "D"),
  rect(3, 18, 12, 2, "R"), hline(3, 19, 12, "r"), rect(15, 22, 3, 2, "D"))
// la sbarra bianca e rossa: giù, su, ferma, giù
anim("_sbarra", { w: 34, h: 34, frames: LOOP, fps: FPS, outline: "K", pivot: [2, 34] }, (c) => {
  const ANG = [0, 0, 0, 0, 0, 0, 30, 60, 84, 84, 84, 84, 84, 84, 60, 30][c.frame] * Math.PI / 180
  c.rect(0, 20, 4, 14, "S"); c.vline(3, 20, 14, "s"); c.rect(0, 18, 4, 3, "D")
  for (let t = 1; t <= 30; t++) {
    const x = Math.round(2 + t * Math.cos(ANG)), y = Math.round(19 - t * Math.sin(ANG)), k = Math.floor(t / 4) % 2 ? "W" : "R"
    c.px(x, y, k); c.px(x + (ANG > 0.7 ? 1 : 0), y + (ANG > 0.7 ? 0 : 1), k)
  }
})
// il semaforo della baia: rosso, poi verde
anim("_semaforo", { w: 5, h: 9, fps: FPS, outline: "K" }, rect(0, 0, 5, 9, "d"),
  frame({ hold: 8 }, rect(1, 1, 3, 3, "R"), px(1, 1, "e"), rect(1, 5, 3, 3, "g")),
  frame({ hold: 8 }, rect(1, 1, 3, 3, "r"), rect(1, 5, 3, 3, "G"), px(1, 5, "h")))
// il semirimorchio di spalle attaccato alla baia, porte aperte e pallet dentro
sprite("_rimorchio", { w: 32, h: 38, outline: "K", pivot: "bottom" },
  rect(0, 0, 32, 31, "S"), hline(0, 0, 32, "W"), vline(0, 1, 30, "W"), vline(31, 1, 30, "s"), rect(3, 3, 26, 26, "d"), rect(3, 3, 26, 3, "K"),
  rect(5, 14, 10, 15, "k"), hline(5, 21, 10, "N"), hline(5, 28, 10, "M"), rect(17, 17, 10, 12, "O"), hline(17, 22, 10, "o"), hline(17, 28, 10, "o"),
  rect(5, 11, 10, 3, "q"), rect(0, 31, 32, 3, "K"), rect(1, 29, 3, 2, "R"), rect(28, 29, 3, 2, "R"), rect(13, 31, 6, 2, "Y"),
  rect(2, 34, 8, 4, "K"), rect(22, 34, 8, 4, "K"), hline(3, 35, 6, "d"), hline(23, 35, 6, "d"))
// il muletto visto di fianco, con il carrellista nella gabbia: le forche salgono e scendono col pallet
sprite("_muletto_c", { w: 30, h: 28 },
  rect(9, 14, 19, 9, "Y"), hline(9, 14, 19, "i"), rect(9, 21, 19, 2, "y"), rect(23, 10, 5, 13, "Y"), hline(23, 10, 5, "i"), vline(27, 11, 12, "y"),
  rect(10, 18, 13, 1, "y"),
  vline(10, 2, 13, "d"), vline(22, 2, 9, "d"), rect(10, 2, 13, 1, "d"),
  rect(5, 0, 2, 24, "d"), vline(5, 0, 24, "D"), rect(7, 18, 3, 3, "d"),
  circ(13, 24, 3, "K"), px(13, 24, "s"), circ(24, 24, 3, "K"), px(24, 24, "s"))
persona("_carrellista", { corpo: "seduto", swap: { B: "O", b: "o", M: "M" } })
anim("_muletto", { w: 31, h: 31, frames: LOOP, fps: FPS, outline: "K", pivot: [16, 31] },
  stamp("__carrellista", 12, 4), stamp("_muletto_c", 0, 3),
  (c) => {
    const H = [0, 0, 1, 2, 4, 6, 8, 9, 10, 10, 10, 9, 7, 5, 3, 1][c.frame], y = 23 - H
    c.rect(0, y, 7, 1, "K"); c.rect(5, y - 6, 2, 6, "s")
    c.rect(0, y - 2, 5, 2, "k"); c.hline(0, y - 1, 5, "N")
    c.rect(0, y - 9, 5, 7, "B"); c.vline(4, y - 9, 7, "b"); c.vline(1, y - 8, 5, "W")
  },
  (c) => { const on = c.frame % 4 < 2; c.rect(15, 3, 3, 2, on ? "O" : "o"); if (on) { c.px(14, 2, "Y"); c.px(18, 2, "Y") } })
// pile di pallet vuoti e di colli avvolti nel film
sprite("_pila", { w: 16, h: 12, outline: "K", pivot: "bottom" },
  ...[0, 3, 6, 9].map((y) => [hline(0, y, 16, "k"), hline(0, y + 1, 16, "m"), rect(0, y + 1, 2, 1, "k"), rect(7, y + 1, 2, 1, "k"), rect(14, y + 1, 2, 1, "k"),
    hline(0, y + 2, 16, "N")]).flat(), hline(0, 0, 16, "q"))
sprite("_colli", { w: 14, h: 15, outline: "K", pivot: "bottom" },
  rect(0, 0, 14, 12, "k"), rect(0, 0, 14, 2, "q"), vline(6, 0, 12, "N"), hline(0, 6, 14, "N"), rect(9, 2, 4, 3, "W"), hline(9, 3, 4, "s"),
  rect(0, 12, 14, 3, "N"), rect(1, 13, 3, 2, "m"), rect(10, 13, 3, 2, "m"))
// la motrice parcheggiata vista di fronte, con il lampeggiante sul tetto
sprite("_motrice", { w: 22, h: 25, outline: "K", pivot: "bottom" },
  rect(0, 2, 22, 19, "O"), hline(0, 2, 22, "a"), vline(21, 3, 18, "o"),
  rect(2, 4, 18, 7, "L"), box(2, 4, 18, 7, "d"), vline(11, 4, 7, "d"), px(3, 5, "W"), px(4, 5, "W"), px(12, 5, "W"),
  rect(4, 13, 14, 5, "D"), ...[14, 16].map((y) => hline(5, y, 12, "d")), rect(1, 13, 3, 2, "i"), rect(18, 13, 3, 2, "i"),
  rect(0, 19, 22, 2, "K"), rect(1, 21, 4, 4, "K"), rect(17, 21, 4, 4, "K"), rect(8, 0, 6, 2, "s"), rect(0, 7, 2, 4, "S"), rect(20, 7, 2, 4, "S"))
anim("_lampeggiante", { w: 4, h: 3, fps: FPS },
  frame({ hold: 2 }, rect(0, 1, 4, 2, "O"), px(1, 0, "Y"), px(2, 0, "Y")),
  frame({ hold: 2 }, rect(0, 1, 4, 2, "o")))
// il cartello del parcheggio
sprite("_cartello_p", { w: 11, h: 24, outline: "K", pivot: "bottom" },
  rect(0, 0, 11, 11, "b"), box(1, 1, 9, 9, "W"), rect(4, 3, 2, 6, "W"), rect(6, 3, 2, 1, "W"), rect(7, 4, 1, 2, "W"), rect(6, 5, 1, 1, "W"),
  rect(5, 11, 2, 13, "S"), vline(6, 11, 13, "s"))
// l'autista col caffè della macchinetta
persona("_autista", { testa: "berretto", swap: { R: "B", r: "b", B: "G", b: "g", M: "K" } })
sprite("_autista_c", { w: 12, h: 20, outline: "K", pivot: [5, 22] }, stamp("__autista"), rect(9, 13, 3, 3, "W"), hline(9, 13, 3, "m"), px(9, 15, "F"))
// il fumo che sale (caffè, cappa della mensa, ciminiera)
anim("_vapore", { w: 5, h: 9, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  const SWAY = [0, 1, 1, 0, -1, -1, 0, 1]
  for (const o of [0, 4]) { const t = (c.frame + o) % 8; if (t > 5) continue
    const x = 2 + SWAY[t], y = 7 - t; c.px(x, y, t < 3 ? "W" : "S"); if (t < 4) c.px(x, y + 1, "S") } })
anim("_fumo", { w: 9, h: 14, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  for (const o of [0, 8]) { const t = (c.frame + o) % 16, y = 11 - Math.floor(t * 0.75), x = 2 + Math.round(Math.sin(t / 2.5) * 1.5)
    if (t < 13) { const k = t < 5 ? "S" : t < 10 ? "j" : "s"; c.rect(x, y, t < 6 ? 3 : 4, 2, k); c.px(x + 1, y - 1, k) } } })
// la bandiera che sventola sull'asta (la piega corre dall'asta alla punta)
function bandiera(nome, w, h, disegno) {
  anim(nome, { w: w + 2, h: h + 3, frames: LOOP, fps: FPS },
    ...disegno(2, 1),
    (c) => c.warp((x, y) => x > 2 && [0, Math.round(Math.sin(c.phase * Math.PI * 4 - x / 2.5) * (x - 2) / (w * 0.7))], [2, 0, w, h + 2]),
    vline(1, 0, h + 3, "K"), px(1, 0, "Y"))
}
bandiera("_bandiera", 12, 7, (x, y) => [rect(x, y, 12, 7, "T"), rect(x, y + 2, 12, 3, "W"), box(x, y, 12, 7, "K")])
bandiera("_bandierina", 9, 6, (x, y) => [rect(x, y, 9, 6, "R"), hline(x, y + 5, 9, "r"), box(x, y, 9, 6, "K")])

// ================================================================ sfondo
strato("sfondo",
  rect(0, 0, SW, 46, "L"), rect(0, 0, SW, 3, "B"), ellipse(14, 8, 9, 2, "W"), ellipse(150, 5, 10, 2, "W"), ellipse(70, 3, 7, 1, "W"),
  poly([0, 42, 14, 37, 30, 40, 46, 36, 64, 40, 84, 36, 104, 40, 124, 36, 144, 39, 160, 36, 160, 46, 0, 46], "j"),
  ...[3, 10, 17, 142, 149, 156].map((x, i) => stamp("_pioppo", x, 46 + (i % 2))),
  rect(0, 46, SW, 10, "h"), hline(0, 46, SW, "G"), ...[5, 31, 140, 152].map((x) => [px(x, 50, "G"), px(x + 1, 49, "G")]).flat(),
  rect(0, 56, SW, 16, "D"), hline(0, 56, SW, "d"), ...[0, 24, 48, 72, 96, 120, 144].map((x) => hline(x + 4, 70, 12, "Y")))

// ================================================================ edifici
// facciata comune: tetto (cornicione), muro, fascia, finestre, i due portoni a raso e la porta del personale.
// muro: colore e funzione della trama; porta: colori del portone sezionale
function facciata({ tetto, tetto2, muro, trama, fascia, fascia2, fin = "L", telaio = "D", porta = "j", porta2 = "s", ferro = "D" }) {
  return [
    rect(X0, TOP, X1 - X0, BASE - TOP, muro), ...(trama || []),
    rect(X0 - 3, 14, X1 - X0 + 6, 4, tetto), hline(X0 - 3, 17, X1 - X0 + 6, tetto2), box(X0 - 4, 13, X1 - X0 + 8, 6, "K"),
    ...(fascia ? [rect(X0, TOP, X1 - X0, 3, fascia), hline(X0, TOP + 2, X1 - X0, fascia2)] : []),
    ...PORTE.map((x) => [rect(x, 27, PW, BASE - 27, porta), ...[30, 33, 36, 39, 42, 45, 48, 51, 54].map((y) => hline(x, y, PW, porta2)),
      box(x - 1, 26, PW + 2, BASE - 25, ferro), rect(x + PW / 2 - 2, 52, 4, 1, "K")]).flat(),
    rect(120, 41, 8, 15, fin === "L" ? "W" : fin), box(119, 40, 10, 16, "K"), rect(121, 43, 6, 4, "L"), px(126, 49, "K"),
    vline(X0 - 1, TOP - 4, BASE - TOP + 4, "K"), vline(X1, TOP - 4, BASE - TOP + 4, "K"), hline(X0 - 1, BASE, X1 - X0 + 2, "K")]
}
const lamiera = (k, da = X0 + 2, passo = 4) => Array.from({ length: Math.ceil((X1 - da) / passo) }, (_, i) => vline(da + i * passo, TOP, BASE - TOP, k))
const finestre = (y, k, t) => [rect(X0 + 4, y, 30, 3, k), rect(72, y, 10, 3, k), rect(X1 - 34, y, 30, 3, k), ...[[X0 + 3, 32], [71, 12], [X1 - 35, 32]].map(([x, w]) => box(x, y - 1, w, 5, t))]

// Standard: lamiera grigia, fascia scura, finestre a nastro
strato("c_std", ...facciata({ tetto: "D", tetto2: "d", muro: "S", trama: lamiera("s"), fascia: "D", fascia2: "d" }), ...finestre(22, "L", "D"))
// Moderno: pannelli bianchi, fascia verde acqua, bandiera sul tetto
strato("c_mod", ...facciata({ tetto: "S", tetto2: "s", muro: "W", trama: [...lamiera("S", X0 + 6, 12)], fascia: "T", fascia2: "t", telaio: "b", porta: "S", porta2: "j", ferro: "b" }),
  ...finestre(22, "L", "b"), stamp("_bandiera", 128, 0), vline(129, 9, 5, "K"))
// Innovativo: blocco uffici in vetro a sinistra, fascia viola, tetto verde e la pala eolica
anim("_pala", { w: 15, h: 22, frames: LOOP, fps: FPS, pivot: "bottom" }, rect(6, 7, 2, 15, "D"), vline(7, 7, 15, "d"),
  (c) => { const a = c.phase * Math.PI * 2 / 3
    for (let k = 0; k < 3; k++) { const t = a + k * Math.PI * 2 / 3; for (let r = 1; r <= 6; r++) c.px(7 + Math.round(Math.cos(t) * r), 6 + Math.round(Math.sin(t) * r), r > 4 ? "D" : "j") }
    c.rect(6, 5, 3, 3, "D"); c.px(7, 6, "K") })
strato("c_inn", ...facciata({ tetto: "G", tetto2: "g", muro: "W", trama: [...lamiera("S", X0 + 16, 12)], fascia: "P", fascia2: "p", telaio: "P", porta: "S", porta2: "j", ferro: "p" }),
  ...[X0 - 3, X0 + 6, X0 + 15, X1 - 20, X1 - 8].map((x) => [px(x, 14, "h"), px(x + 2, 14, "h"), px(x + 1, 13, "G")]).flat(),
  rect(X0, TOP, 11, BASE - TOP, "L"), ...[23, 29, 35, 41, 47].map((y) => hline(X0, y, 11, "b")), vline(X0 + 5, TOP, BASE - TOP, "b"), vline(X0 + 11, TOP, BASE - TOP, "K"),
  rect(X0 + 1, 50, 9, 6, "W"), box(X0, 49, 11, 7, "K"), vline(X0 + 5, 50, 6, "S"),
  ...finestre(22, "L", "P").slice(1), stamp("_pala", 128, 14))
// Vecchio: muro intonacato con lo zoccolo di mattoni, tetto a shed, finestre quadre, portoni di legno, la ciminiera che fuma
strato("c_vec",
  rect(122, 0, 6, 14, "N"), rect(121, 0, 8, 2, "M"), box(121, -1, 8, 15, "K"), ...[4, 8, 12].map((y) => hline(122, y, 6, "M")), stamp("_fumo", 125, 1),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => { const x = X0 - 3 + i * 16; return [poly([x, 14, x, 6, x + 16, 14], "N"), line(x, 6, x + 16, 14, "M"), vline(x, 6, 8, "L"), vline(x + 1, 7, 7, "B"), line(x, 6, x, 14, "K")] }).flat(),
  ...facciata({ tetto: "M", tetto2: "m", muro: "C", trama: [rect(X0, 46, X1 - X0, 10, "k"), ...[48, 51, 54].map((y) => hline(X0, y, X1 - X0, "N")),
    ...Array.from({ length: 27 }, (_, i) => [vline(X0 + 2 + i * 4, 46, 2, "N"), vline(X0 + i * 4, 49, 2, "N"), vline(X0 + 2 + i * 4, 52, 2, "N")]).flat()], fascia: "q", fascia2: "k",
    telaio: "N", porta: "N", porta2: "M", ferro: "M" }),
  ...[X0 + 4, 70, X1 - 14].map((x) => [rect(x, 23, 8, 6, "L"), box(x - 1, 22, 10, 8, "N"), vline(x + 3, 23, 6, "N"), hline(x, 25, 8, "N")]).flat())
// Fatiscente: lamiere arrugginite e storte, un pannello che manca, vetri rotti, erbacce e la lamiera che sbatte
strato("c_fat",
  ...facciata({ tetto: "o", tetto2: "M", muro: "k", trama: [...lamiera("f"), rect(X0 + 40, TOP + 4, 7, 14, "f"), ...[0, 1, 2].map((i) => vline(X0 + 41 + i * 2, TOP + 4, 14, "o")),
    rect(X0 + 84, TOP + 10, 9, 18, "O"), ...[0, 1, 2, 3].map((i) => vline(X0 + 85 + i * 2, TOP + 10, 18, "o")), rect(X0 + 22, TOP + 12, 6, 10, "K"), vline(X0 + 24, TOP + 12, 10, "d"),
    line(X0 + 8, 30, X0 + 12, 38, "M"), line(X0 + 12, 38, X0 + 10, 44, "M"), line(X1 - 6, 24, X1 - 9, 33, "M")],
    fin: "k", telaio: "M", porta: "o", porta2: "M", ferro: "M" }),
  ...finestre(22, "L", "M"), ...[[X0 + 8, 22], [X0 + 26, 22], [77, 22], [X1 - 22, 22], [X1 - 12, 22]].map(([x, y]) => [rect(x, y, 3, 3, "K"), px(x + 3, y, "K")]).flat(),
  rect(X0 + 50, 13, 10, 2, "L"), px(X0 + 54, 14, "B"),                                     // un pezzo di cornicione che manca
  rect(PORTE[1] + 3, 30, 8, 5, "M"), rect(PORTE[0] + 16, 44, 9, 4, "M"),                    // ruggine sui portoni
  ...[X0 + 2, X0 + 9, 70, 82, 117, X1 - 3, X1 + 3].map((x) => [vline(x, BASE - 3, 3, "G"), px(x - 1, BASE - 2, "G"), px(x + 1, BASE - 1, "g"), px(x + 1, BASE - 4, "h")]).flat(),
  (c) => { const a = [0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0][c.frame]   // la lamiera che sbatte al vento
    c.rect(X1 - 9, TOP + 8 + a, 7, 9 - a, "O"); c.box(X1 - 10, TOP + 7 + a, 9, 11 - a, "K"); c.vline(X1 - 7, TOP + 8 + a, 9 - a, "o"); c.vline(X1 - 4, TOP + 8 + a, 9 - a, "o") })

// ================================================================ dotazioni davanti all'edificio
// Ribalte: le baie rialzate col tunnel nero, i respingenti e il semaforo; il semirimorchio attaccato alla prima,
// la seconda che si apre: dentro, i pallet e il magazziniere col transpallet
persona("_magazz", { testa: "berretto", abito: "gilet", swap: { B: "Y", b: "y", M: "K", F: "c", f: "x", R: "B", r: "b" } })
strato("ribalte",
  ...PORTE.map((x) => [rect(x - 3, 24, PW + 6, 25, "K"), rect(x - 2, 25, PW + 4, 23, "d"), rect(x, 27, PW, 21, "j"), ...[30, 33, 36, 39, 42, 45].map((y) => hline(x, y, PW, "s")),
    rect(x - 2, 48, PW + 4, 8, "s"), hline(x - 2, 48, PW + 4, "S"), ...Array.from({ length: (PW + 4) / 2 }, (_, i) => px(x - 2 + i * 2, 49, "K")), ...Array.from({ length: (PW + 4) / 2 }, (_, i) => px(x - 1 + i * 2, 49, "Y")),
    rect(x - 1, 51, 4, 5, "K"), rect(x + PW - 3, 51, 4, 5, "K"), box(x - 3, 47, PW + 6, 10, "K"), stamp("_semaforo", x + PW + 4, 29)]).flat(),
  (c) => {   // la serranda della seconda baia: su, aperta, giù
    const x = PORTE[1], h = [0, 0, 3, 7, 11, 15, 19, 21, 21, 21, 21, 21, 17, 12, 7, 3][c.frame]
    if (!h) return
    c.rect(x, 27 + 21 - h, PW, h, "K")
    if (h > 8) { c.rect(x + 2, 48 - Math.min(h, 10), 10, Math.min(h, 10), "k"); c.hline(x + 2, 48 - Math.min(h, 10), 10, "q"); c.hline(x + 2, 46, 10, "N") }
    if (h > 14) c.stamp("__magazz", x + 15, 48 - 20)
  },
  stamp("_rimorchio", PORTE[0] + 14, 64), ...ombra(PORTE[0] + 14, 65, 16))
// Ricarica dei muletti: l'armadietto verde col fulmine, il cavo e la spia che lampeggia
strato("ricarica",
  rect(71, 37, 11, 17, "G"), hline(71, 37, 11, "h"), vline(81, 38, 16, "g"), box(70, 36, 13, 19, "K"), rect(73, 41, 7, 7, "g"),
  line(77, 42, 75, 45, "Y"), line(75, 45, 78, 45, "Y"), line(78, 45, 76, 48, "Y"), rect(73, 50, 7, 2, "D"),
  line(76, 55, 79, 57, "K"), hline(79, 57, 5, "K"),
  (c) => { const on = c.frame % 8 < 4; c.rect(79, 38, 2, 2, on ? "h" : "g") })
// LED: le plafoniere bianche sopra le baie e la luce sul piazzale
strato("led",
  ...PORTE.map((x) => [rect(x + PW / 2 - 4, 22, 9, 2, "W"), box(x + PW / 2 - 5, 21, 11, 4, "K"), hline(x + PW / 2 - 4, 23, 9, "i"),
    ...[0, 2, 4, 6, 8].map((i) => px(x + PW / 2 - 4 + i, 25, "i"))]).flat(),
  rect(123, 37, 3, 2, "W"), box(122, 36, 5, 4, "K"))
// Antincendio: la campana d'allarme rossa sulla facciata e l'idrante davanti
strato("sprinkler",
  circ(31, 25, 3, "R"), circ(31, 25, 1, "r"), px(30, 23, "e"), ...[[27, 25], [35, 25], [31, 21], [31, 29]].map(([x, y]) => px(x, y, "K")), box(27, 21, 9, 9, "K"),
  rect(31, 29, 1, 3, "K"),
  rect(129, 57, 6, 8, "R"), rect(128, 59, 8, 2, "R"), rect(130, 56, 4, 1, "r"), vline(134, 57, 8, "r"), box(127, 55, 10, 11, "K"), rect(131, 58, 2, 2, "S"), ...ombra(132, 66, 5),
  (c) => { if (c.frame % 8 < 2) { c.px(25, 22, "Y"); c.px(37, 22, "Y"); c.px(24, 25, "Y"); c.px(38, 25, "Y") } })
// Celle frigo: il fiocco sulla porta del personale (porta della cella) e il gruppo frigo sul tetto con la ventola che gira
anim("_gruppo_frigo", { w: 18, h: 11, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" },
  rect(0, 0, 18, 11, "S"), hline(0, 0, 18, "W"), vline(17, 1, 10, "s"), ...[2, 4, 6, 8].map((y) => hline(1, y, 6, "s")), circ(12, 5, 4, "D"), circ(12, 5, 3, "d"),
  (c) => { const a = c.frame % 2; c.line(12 - (a ? 3 : 0), 5 - (a ? 0 : 3), 12 + (a ? 3 : 0), 5 + (a ? 0 : 3), "S"); c.line(12 - (a ? 0 : 2), 5 + (a ? 2 : 0), 12 + (a ? 0 : 2), 5 - (a ? 2 : 0), "s"); c.px(12, 5, "K") })
strato("frigo",
  stamp("_gruppo_frigo", 94, 13),
  rect(120, 41, 8, 15, "B"), vline(127, 41, 15, "b"), box(119, 40, 10, 16, "K"), vline(123, 43, 7, "W"), hline(121, 46, 5, "W"),     // la porta della cella col fiocco
  px(121, 44, "W"), px(125, 44, "W"), px(121, 48, "W"), px(125, 48, "W"), rect(121, 52, 2, 2, "S"))
// Pannelli solari sul tetto, in file inclinate, con il riflesso del sole che passa
strato("solare",
  ...[30, 44, 58, 72].map((x) => [poly([x, 13, x + 3, 6, x + 15, 6, x + 12, 13], "b"), line(x + 1, 11, x + 13, 11, "B"), line(x + 2, 8, x + 14, 8, "B"), line(x + 7, 6, x + 5, 13, "B"),
    line(x, 13, x + 3, 6, "K"), hline(x + 3, 5, 13, "K"), line(x + 12, 13, x + 15, 6, "K"), hline(x, 13, 13, "K"), vline(x + 2, 13, 1, "D"), vline(x + 11, 13, 1, "D")]).flat(),
  (c) => { const x = 28 + Math.floor(c.phase * 64); if (x < 86) { c.px(x + 3, 7, "W"); c.px(x + 2, 9, "W"); c.px(x + 4, 7, "L") } })
// Piazzale: le strisce bianche, le pile di pallet e colli, il carrellista che fa avanti e indietro col muletto
strato("piazzale",
  ...[60, 108].map((x) => [vline(x, 58, 9, "W"), hline(x, 66, 12, "W")]).flat(),
  ...ombra(108, 67, 12), stamp("_pila", 103, 67), stamp("_colli", 116, 67),
  (c) => { const x = 80 + Math.round(7 * Math.sin(c.phase * Math.PI * 2)); for (const d of [-9, 9]) c.hline(x + d - 5, 68, 10, "d"); c.stamp("_muletto", x, 69) })
// Portineria: la guardiola col portiere e la sbarra che si alza
strato("portineria", ...ombra(12, 66, 10), stamp("_guardiola", 12, 66), stamp("_sbarra", 24, 66))
// Giardino: la siepe fiorita davanti a destra, la panchina e la farfalla
strato("giardino",
  rect(147, 63, 13, 9, "G"), hline(147, 63, 13, "h"), ...[149, 155].map((x) => [px(x, 63, "K"), px(x + 2, 63, "K")]).flat(),
  ...[[149, 66, "R"], [154, 65, "Y"], [157, 68, "P"], [151, 69, "W"]].map(([x, y, k]) => [px(x, y, k), px(x + 1, y, k), px(x, y + 1, k), px(x + 1, y + 1, "K")]).flat(),
  vline(146, 63, 9, "K"), hline(147, 62, 13, "K"), rect(147, 70, 13, 2, "g"),
  (c) => { const t = c.phase * Math.PI * 2, x = 153 + Math.round(Math.cos(t) * 4), y = 57 + Math.round(Math.sin(t * 2) * 2), a = c.frame % 2
    c.px(x, y, "K"); c.px(x - 1, y - a, "Y"); c.px(x + 1, y - a, "Y"); c.px(x - 1, y + 1 - a, "y"); c.px(x + 1, y + 1 - a, "y") })
strato("giardino_dietro", stamp("_albero", 144, 57), stamp("_albero", 156, 59))

// ================================================================ dotazioni dietro all'edificio
// Mensa: la palazzina a sinistra col tetto rosso, l'insegna e la cappa che fuma
strato("mensa",
  rect(0, 26, 24, 30, "C"), vline(23, 27, 29, "q"), box(-1, 25, 25, 32, "K"), rect(-1, 20, 27, 6, "R"), hline(-1, 25, 27, "r"), box(-2, 19, 28, 7, "K"),
  text(3, 21, "MENSA", "W"), rect(16, 12, 4, 8, "S"), box(15, 11, 6, 9, "K"), stamp("_vapore", 18, 11),
  ...[2, 12].map((x) => [rect(x, 30, 8, 7, "L"), box(x - 1, 29, 10, 9, "N"), hline(x, 34, 8, "N"), rect(x + 1, 35, 3, 2, "O"), rect(x + 5, 35, 2, 2, "W")]).flat(),
  rect(4, 42, 9, 14, "W"), box(3, 41, 11, 15, "K"), rect(5, 44, 7, 5, "L"), px(11, 50, "K"))
// Parcheggio dei camion: la motrice ferma col lampeggiante, il cartello P e l'autista che beve il caffè
strato("parcheggio",
  rect(X1 + 1, 50, SW - X1 - 1, 6, "s"), hline(X1 + 1, 50, SW - X1, "j"), ...[X1 + 1, 150, 159].map((x) => vline(x, 50, 6, "W")),
  stamp("_cartello_p", 153, 45), ...ombra(146, 56, 11), stamp("_motrice", 146, 56), stamp("_lampeggiante", 144, 30),
  ...ombra(141, 68, 5), stamp("_autista_c", 141, 68), stamp("_vapore", 148, 55))
// Antincendio: la cisterna rossa dell'acqua dietro al tetto, con la scaletta
strato("sprinkler_dietro",
  rect(106, 0, 14, 14, "R"), rect(116, 0, 4, 14, "r"), ...[3, 7, 11].map((y) => hline(106, y, 14, "r")), box(105, -1, 16, 16, "K"),
  vline(103, 0, 14, "D"), ...[1, 4, 7, 10].map((y) => hline(102, y, 3, "D")))

// ================================================================ terreno e cantiere (sopra lo sfondo, al posto dell'edificio)
// Il terreno: il prato incolto, il nastro bianco e rosso, il cartello «lotto in vendita» e il geometra col treppiede
persona("_geometra", { testa: "corti", swap: { B: "W", b: "S", M: "N", D: "j" } })
anim("_geom", { w: 22, h: 22, frames: LOOP, fps: FPS, outline: "K", pivot: [6, 22] },
  stamp("__geometra", 0, 2), rect(1, 0, 8, 3, "Y"), hline(1, 2, 8, "y"),
  line(16, 10, 13, 22, "D"), line(16, 10, 19, 22, "D"), line(16, 10, 16, 22, "D"), rect(14, 7, 5, 3, "Y"), px(14, 8, "K"),
  (c) => { if (c.frame % 8 < 4) c.px(10, 9, "F"); else c.px(11, 8, "F") })
sprite("_cartello_lotto", { w: 44, h: 26, outline: "K", pivot: "bottom" },
  rect(0, 0, 44, 15, "W"), box(1, 1, 42, 13, "R"), text(3, 3, "LOTTO", "K"), text(3, 8, "IN VENDITA", "R"),
  rect(6, 15, 2, 11, "N"), rect(36, 15, 2, 11, "N"))
strato("lotto",
  rect(20, 44, 120, 12, "h"), ...[24, 40, 56, 72, 88, 104, 120, 136].map((x) => [vline(x, 41, 15, "N"), px(x, 40, "K")]).flat(),
  ...Array.from({ length: 56 }, (_, i) => px(24 + i * 2, 43, i % 2 ? "W" : "R")), ...Array.from({ length: 56 }, (_, i) => px(25 + i * 2, 43, i % 2 ? "R" : "W")),
  ...[30, 46, 61, 79, 97, 113, 128].map((x, i) => [vline(x, 50 - (i % 3), 3 + (i % 3), "G"), px(x + 1, 51, "G"), px(x - 1, 52, "g")]).flat(),
  ...ombra(64, 66, 22), stamp("_cartello_lotto", 64, 66), ...ombra(112, 66, 8), stamp("_geom", 106, 66),
  stamp("_bandierina", 38, 24), vline(39, 32, 11, "K"))
// Il cantiere: la struttura d'acciaio, il basamento di cemento, la gru col carico che dondola, la betoniera che gira
sprite("_betoniera", { w: 24, h: 18, outline: "K", pivot: "bottom" },
  rect(0, 4, 8, 10, "O"), rect(1, 5, 5, 4, "L"), rect(0, 12, 24, 3, "D"), poly([8, 4, 22, 2, 23, 12, 8, 12], "W"), line(10, 4, 14, 12, "S"), line(16, 3, 20, 12, "S"),
  ...[4, 18].map((x) => [circ(x, 15, 2, "K"), px(x, 15, "s")]).flat())
persona("_operaio", { testa: "corti", abito: "gilet", swap: { B: "O", b: "o", M: "m" } })
sprite("_operaio_c", { w: 10, h: 20, outline: "K", pivot: "bottom" }, stamp("__operaio"), rect(1, 0, 8, 3, "Y"), hline(1, 2, 8, "y"))
strato("cantiere",
  rect(X0, 50, X1 - X0, 6, "S"), hline(X0, 50, X1 - X0, "W"), box(X0 - 1, 49, X1 - X0 + 2, 8, "K"),
  ...[X0, 52, 78, 104, X1 - 3].map((x) => [rect(x, 18, 3, 32, "D"), vline(x + 2, 18, 32, "d"), box(x - 1, 17, 5, 34, "K")]).flat(),
  ...[18, 33].map((y) => [rect(X0, y, X1 - X0, 2, "D"), hline(X0, y - 1, X1 - X0, "K"), hline(X0, y + 2, X1 - X0, "K")]).flat(),
  ...[X0, 52, 78].map((x) => [line(x + 3, 21, x + 25, 32, "j"), line(x + 3, 36, x + 25, 48, "j")]).flat(),
  rect(104, 21, 26, 28, "S"), ...[25, 29, 33, 37, 41, 45].map((y) => hline(104, y, 26, "s")),
  rect(142, 0, 4, 56, "Y"), ...Array.from({ length: 14 }, (_, i) => line(142, i * 4, 145, i * 4 + 3, "y")), box(141, -1, 6, 58, "K"),
  rect(86, 2, 74, 3, "Y"), hline(86, 4, 74, "y"), box(85, 1, 76, 5, "K"), rect(146, 6, 10, 5, "D"), box(145, 5, 12, 7, "K"),
  rect(139, 6, 9, 6, "Y"), rect(140, 7, 4, 3, "L"), box(138, 5, 11, 8, "K"),
  ...ombra(40, 67, 13), stamp("_betoniera", 40, 67), ...ombra(70, 67, 5), stamp("_operaio_c", 70, 67),
  (c) => { const x = 104 + Math.round(18 * (1 - Math.cos(c.phase * Math.PI * 2)) / 2), y = 24 + Math.round(2 * Math.sin(c.phase * Math.PI * 4))
    c.vline(x, 6, y - 6, "K"); c.rect(x - 6, y, 13, 4, "k"); c.hline(x - 6, y, 13, "q"); c.box(x - 7, y - 1, 15, 6, "K"); c.px(x - 1, y - 1, "K"); c.px(x + 1, y - 1, "K") })

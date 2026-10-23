// Icone dei pacchetti (passo «Pacchetti» della creazione della partita), in stile stemma Paradox:
// scudo con la cornice d'oro smussata, la gemma in cima e il simbolo sul campo. Disegnate con pxl (.claude/skills/pxl-pixel-art).
// 32×32, lettere di TPAL (src/game.html): tools/loghi_pxl/esporta.py le riporta in PACK_IC.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/pacchetti.px.js --out tools/out/loghi_pxl
//   python3 tools/loghi_pxl/esporta.py

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", F: "#f2c79b", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      y: "#c98a00", r: "#a8262a", b: "#2f7fd6", s: "#8a96a6", d: "#2a3a50", f: "#d9946a", i: "#ffe680", e: "#ff8a8d", k: "#c08a55" })

// ---- lo scudo: 30×30 prima del contorno (32×32 dopo) ----
// forma base (dritto fino a metà, poi curve fino alla punta); ogni anello verso l'interno è la forma erosa di un pixel,
// così cornice, filetto e campo restano paralleli anche sulla punta
const N = 30, CX = 15
const hw = (y) => (y < 16 ? 15 : 15 * (1 - Math.pow((y - 16) / 14, 1.45)))
const M0 = Array.from({ length: N }, (_, y) => Array.from({ length: N }, (_, x) => Math.abs(x + 0.5 - CX) <= hw(y + 0.5) && !((y === 0) && (x === 0 || x === N - 1))))
const erode = (m) => m.map((row, y) => row.map((v, x) => v && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dy]) => (m[y + dy] || [])[x + dx])))
const MS = [M0]; for (let i = 1; i < 6; i++) MS.push(erode(MS[i - 1]))
const inS = (i) => (x, y) => !!(MS[i][y] || [])[x]
const band = (a, b) => (x, y) => inS(a)(x, y) && !inS(b)(x, y)
const lit = (x, y) => x + y * 0.6 < 24                                               // luce da in alto a sinistra
function shield(field, fieldD, gem, gemL) {
  return [
    clip(band(0, 3), rect(0, 0, N, N, "Y")),                                         // cornice d'oro, 3 pixel
    clip((x, y) => band(0, 3)(x, y) && !lit(x, y), rect(0, 0, N, N, "y")),           // lato in ombra della cornice
    clip((x, y) => band(0, 1)(x, y) && lit(x, y), rect(0, 0, N, N, "i")),            // filo di luce sul bordo esterno
    clip(band(2, 3), rect(0, 0, N, N, "K")),                                         // filetto scuro tra cornice e campo
    clip(inS(3), rect(0, 0, N, N, field)),                                           // campo, pieno
    clip((x, y) => inS(3)(x, y) && !inS(3)(x, y + 2), rect(0, 0, N, N, fieldD)),     // fascia più scura in fondo al campo (stile delle icone)
    rect(14, 0, 2, 2, gem), px(14, 0, gemL),                                         // gemma in cima, incastonata nella cornice
  ]
}

// ---- simboli ----
// gioco base: il pallet con le casse, quello di «Fino all'ultimo pallet»
sprite("_pallet", { outline: "K", pivot: "center" }, `
  ...NNNNNNN...
  ...NkkCkkN...
  ...NkkCkkN...
  ...NkkkkkN...
  ...NMMMMMN...
  NNNNNNNNNNNNN
  NkkCkkNkkCkkN
  NkkCkkNkkCkkN
  NkkkkkNkkkkkN
  NMMMMMNMMMMMN
  NNNNNNNNNNNNN
  kkkkkkkkkkkkk
  MM...MMM...MM
  kkkkkkkkkkkkk`)

// Relazioni industriali: il pugno chiuso alzato, con la manica della tuta da lavoro
sprite("_pugno", { outline: "K", pivot: "center" }, `
  ..FF.FF.FF..
  .FFFFFFFFFF.
  .FFfFFfFFfF.
  .FFfFFfFFfF.
  FFFFFFFFFFF.
  FffffffFFFF.
  FFFFFFFfFFF.
  .FFFFFFFFFf.
  ..fFFFFFFf..
  ..CCCCCCC...
  .BBBBBBBBB..
  .BBBBBBBBb..
  .bbbbbbbbb..`)

sprite("pk_base", { w: 30, h: 30, outline: "K" }, ...shield("B", "b", "R", "e"), stamp("_pallet", 15, 13))
sprite("pk_ri", { w: 30, h: 30, outline: "K" }, ...shield("R", "r", "B", "L"), stamp("_pugno", 15, 13))

// Reparto IT e Ingegneria: il caschetto giallo dell'ufficio tecnico sopra il monitor del reparto IT
sprite("_reparti", { outline: "K", pivot: "center" }, `
  ....YYYYY....
  ..YYYYYYYYY..
  .YYYYYYYYYYY.
  YYYYYYYYYYYYY
  yyyyyyyyyyyyy
  SSSSSSSSSSSSS
  SbbbbbbbbbbbS
  SbiibbbbbbbbS
  SbbbbLLLbbbbS
  SbiiiibbbbbbS
  SSSSSSSSSSSSS
  .....sss.....
  ...sssssss...`)
sprite("pk_it", { w: 30, h: 30, outline: "K" }, ...shield("D", "d", "Y", "i"), stamp("_reparti", 15, 13))

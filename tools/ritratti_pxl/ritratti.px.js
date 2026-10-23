// Ritratti di CEO, manager, personale, candidati e sindacalisti, nello stile delle scenette degli eventi:
// testa grande e tonda, contorno scuro attorno a tutta la figura, occhi a puntino, colori pieni con una sola ombra.
// Ogni ritratto è 48×56: tools/ritratti_pxl/esporta.py lo ingrandisce 2× per i manager (assets/p_<nome>.png, 96×112)
// e 4× per i CEO (assets/ritratto_<nome>.png, 192×224). Sfondo trasparente: la cornice la mette il gioco.
// Per un personaggio nuovo: una riga ritratto("p_nome", {...}) qui sotto, poi esporta.py e build.py.

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", T: "#1f9e8f", F: "#f2c79b", P: "#9b6bff", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      y: "#c98a00", o: "#c8551f", r: "#a8262a", g: "#217a36", b: "#2f7fd6", s: "#8a96a6", d: "#2a3a50", t: "#146b61", f: "#d9946a",
      p: "#6f43cf", q: "#e8c96a", m: "#3d2412", i: "#ffe680", a: "#ffb07a", e: "#ff8a8d", h: "#8ed15b", l: "#c8adff", u: "#5fd4c4",
      k: "#c08a55", j: "#7f95b0", v: "#ffe2c6", c: "#b8784a", x: "#8a5232", A: "#e3a877", X: "#b97c50", Z: "#e9edf2",
      // chiavi «di lavoro», cambiate da ogni personaggio con swap:
      // capelli H I J (base, riflesso, ombra), vestito Q U V (base, chiaro, ombra), pelle F f v (base, ombra, luce),
      // 1 occhiali, 2 labbra, 3 orecchini, 4 cravatta o collana: colori propri (a un passo da K, R e Y), perché swap cambia
      // un colore ovunque e, con gli stessi colori del contorno o del rosso, gli occhiali colorati ricoloravano anche il contorno
      H: "#3d2412", I: "#6b3e1f", J: "#2a1a0e", Q: "#4a5f7a", U: "#7f95b0", V: "#2a3a50",
      1: "#16202f", 2: "#e0393f", 3: "#ffd240", 4: "#e1393e" })

// ================================================================ testa (metà sinistra, 12 colonne; mx la specchia)
// 3 righe vuote in cima per i capelli; occhi alle righe 15-17, bocca alla 21, mento alla 25
const VISO = [
  "............",
  "............",
  "............",
  "........FFFF",
  "......FFFFFF",
  "....FFFFFFFF",
  "...FFFFFFFFF",
  "..FFFFFFFFFF",
  "..FFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  "FFFFFFFFFFFF",
  "FfFFFFFKKFFF",
  "FfFFFFFKKFFF",
  "FFFFFFFKKFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".FFFFFFFFFFF",
  ".fFFFFFFFFff",
  "..fFFFFFFFFF",
  "...fFFFFFFFF",
  "....ffFFFFFF",
  "......ffffff"]
const BOCCHE = {            // [riga 20, riga 21]
  seria:    ["", ".fFFFFFFFFff"],
  sorriso:  [".FFFFFFFFfFF", ".fFFFFFFFFff"],
  rossetto: ["", ".fFFFFFFFF22"],
  ridente:  [".FFFFFFFFf22", ".fFFFFFFFF22"],
}
// capelli: "." lascia il viso, "_" cancella; le righe partono dalla cima della testa
const CAPELLI = {
  corti: [
    "............",
    "........HHHH",
    ".....HHHHHHH",
    "...HHHHHHHHH",
    "..HHHHHHIIHH",
    ".HHHHHHIIHHH",
    ".HHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHJJJH",
    "HHHJ........",
    "HHJ.........",
    "HH..........",
    "HJ.........."],
  rasati: [
    "............",
    "............",
    "............",
    "........HHHH",
    "......HHHHHH",
    "....HHHHHHHH",
    "...HHHHHHHHH",
    "..HHHHHHHHHH",
    "..HHHHHHHHHH",
    ".HHHHHHHHHHH",
    ".HJ........."],
  spettinati: [
    "......H...H.",
    "....HHH..HHH",
    "...HHHHHHHHH",
    "..HHHHHHHHHH",
    ".HHHHHHIIHHH",
    ".HHHHHIIHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHJHHHJHHH",
    "HHJ.J...J.J.",
    "HH..........",
    "HJ.........."],
  stempiato: [
    "............",
    "............",
    "............",
    "........HHHH",
    "......HHHIHH",
    "....HHHH....",
    "...HHHH.....",
    "..HHH.......",
    ".HHH........",
    "HHHH........",
    "HHH.........",
    "HHH.........",
    "HHJ.........",
    "HJ.........."],
  lunghi: [
    "............",
    "........HHHH",
    ".....HHHHHHH",
    "...HHHHHHHHH",
    "..HHHHHHIIHH",
    ".HHHHHHIIHHH",
    ".HHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHJJJJJJJJ",
    "HHHJ........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHJ.........",
    "HHJ.........",
    "HHJ.........",
    "HHJJ........",
    "HHJJJJ......",
    "HHHJJJJJ....",
    "HHHJJJJJ....",
    "HHHJJJJJ....",
    "HHHJJJJJ....",
    "HHHHJJJJ....",
    "HHHHJJJJ....",
    "HHHHJJJJ....",
    "JJJJ........"],
  caschetto: [
    "............",
    "........HHHH",
    ".....HHHHHHH",
    "...HHHHHHHHH",
    "..HHHHHHIIHH",
    ".HHHHHHIIHHH",
    ".HHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHJHHJHH",
    "HHHJ..J..J..",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHH.........",
    "HHJ.........",
    "HHJ.........",
    "JJJ........."],
  ricci: [
    "....HH..HH..",
    "...HHHHHHHHH",
    "..HHHHHHHHHH",
    ".HHHHHHHHHHH",
    "HHHHHIHHHIHH",
    "HHHHIIHHIIHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHJHHJHHJH",
    "HHHJ.J..J..J",
    "HHHH........",
    "HHHH........",
    "HHH.........",
    "HHH.........",
    "HHHH........",
    "HHHH........",
    "HHH.........",
    "HHHH........",
    "HHJH........",
    "HJJ........."],
  // ricci corti e folti (Del Sasso): solo in cima, niente ciocche sulle guance
  riccetti: [
    "...H..H..H..",
    "..HHHHHHHHHH",
    ".HHHHIHHHIHH",
    ".HHHIIHHIIHH",
    "HHHHHHHHHHHH",
    "HHIHHHIHHHIH",
    "HIIHHIIHHIIH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHJHHJHHJHH",
    "HHJ.J..J..J.",
    "HJ.........."],
  // nuvola di ricci fino alle spalle (Greta)
  riccioni: [
    "...HH.HH.HH.",
    "..HHHHHHHHHH",
    ".HHHHIHHHIHH",
    "HHHHIIHHIIHH",
    "HHHHHHHHHHHH",
    "HHIHHHIHHHIH",
    "HIIHHIIHHIIH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHJHHJHHJH",
    "HHHJ.J..J..J",
    "HHHH........",
    "HIHH........",
    "HHH.........",
    "HHH.........",
    "HHHH........",
    "HIHH........",
    "HHH.........",
    "HHHH........",
    "HHIH........",
    "HHHH........",
    "HHHH........",
    "HIHHJ.......",
    "HHHJJJ......",
    "HHHHJJJ.....",
    "HIHHJJJ.....",
    "HHHHJJJ.....",
    "HHHJJJ......",
    "HHHH........",
    ".HH........."],
  permanente: [
    "....HH..HH..",
    "..HHHHHHHHHH",
    ".HHHHHIHHHIH",
    "HHHHIIHHHIIH",
    "HHHHHHHHHHHH",
    "HHHIHHHIHHHH",
    "HHIIHHIIHHHH",
    "HHHHHHHHHHHH",
    "HHHHHHHHHHHH",
    "HHHHJHHJHHJH",
    "HHHJ.J..J..J",
    "HHHH........",
    "HHHH........",
    "HHJ.........",
    "HJ.........."],
  calvo: [
    "............",
    "............",
    "............",
    "............",
    "........vvF.",
    "......vvF...",
    "............",
    "............",
    "............",
    "............",
    ".HH.........",
    "HHH.........",
    "HHH.........",
    "HHJ.........",
    "HJ.........."],
}
// dettagli del viso: [riga di partenza, righe]; prima dei capelli quelli che stanno sotto, dopo gli altri
const SOTTO = {
  barba: [18, [
    ".J..........",
    ".JJ.........",
    ".JJJ........",
    ".JJJJJJJJJJJ",
    "..JJJJJJJJ__",
    "...JJJJJJJJJ",
    "....JJJJJJJJ",
    "......JJJJJJ"]],
  baffi: [20, [
    "........JJJJ",
    ".......J...."]],
  naso: [18, [
    "..........f.",
    "..........f.",
    ".........ff."]],
  occhioni: [15, [
    "......KKK...",
    "......WKK...",
    "......WKK..."]],
  senzaocchi: [15, [
    ".......FF...",
    ".......FF...",
    ".......FF..."]],
}
const SOPRA = {
  occhiali: [13, [
    "....11111111",
    "11111....1..",
    "....1....1..",
    "....1....1..",
    "....111111.."]],
  quadrati: [13, [
    "...111111111",
    "11111....11.",
    "...1.....1..",
    "...1.....1..",
    "...1111111.."]],
  stretti: [15, [
    "....11111111",
    "11111....1..",
    "....111111.."]],
  orecchini: [17, ["3", "3"]],
}
function merge(base, over, y0 = 0) {
  const out = base.slice()
  over.forEach((r, i) => {
    const y = y0 + i
    const b = (out[y] || "............").split("")
    r.split("").forEach((ch, x) => { if (ch !== ".") b[x] = ch === "_" ? "." : ch })
    out[y] = b.join("")
  })
  return out
}
function testa(nome, { capelli = "corti", bocca = "seria", viso = [] }) {
  let g = VISO.slice()
  const [b20, b21] = BOCCHE[bocca]
  if (b20) g = merge(g, [b20], 20)
  g = merge(g, [b21], 21)
  for (const e of viso) if (SOTTO[e]) g = merge(g, SOTTO[e][1], SOTTO[e][0])
  g = merge(g, CAPELLI[capelli])
  for (const e of viso) if (SOPRA[e]) g = merge(g, SOPRA[e][1], SOPRA[e][0])
  sprite("_t_" + nome, { mx: true, outline: "K" }, g.join("\n"))
}

// ================================================================ busto (metà sinistra, 22 colonne)
const COLLO = ["..................ffff", "..................fFFF", "..................fFFF"]
const BUSTO = [
  "..................fFFF",
  "..................fFFF",
  "..................fFFF",
  "............QQQQQQVfFF",
  "........QQQQQQQQQQQVFF",
  ".....QQQQQQQQQQQQQQQVV",
  "...QQQQQQQQQQQQQQQQQQQ",
  "..QQQQQQQQQQQQQQQQQQQQ",
  ".QQQQQQQQQQQQQQQQQQQQQ",
  ".QQQQQQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ",
  "QQQQQVQQQQQQQQQQQQQQQQ"]
// scollo con la camicia (bianca, o del colore c)
const scollo = c => [3, [
  `................Q${c}${c}${c}${c}${c}`,
  `................V${c}${c}${c}${c}${c}`,
  `................QV${c}${c}${c}${c}`,
  `................QV${c}${c}${c}${c}`,
  `.................V${c}${c}${c}${c}`,
  `.................QV${c}${c}${c}`,
  `..................V${c}${c}${c}`,
  `..................QV${c}${c}`,
  `..................QV${c}${c}`,
  `...................V${c}${c}`,
  "...................QVV",
  "...................QQQ"]]
// gilet ad alta visibilità aperto sul davanti (c colore, d piega)
const gilet = (c, d) => [3, [
  `............${c.repeat(6)}VfFF`,
  `........${c.repeat(11)}VFF`,
  `.....${c.repeat(15)}QV`,
  `...${c.repeat(16)}QQQ`,
  `..${c.repeat(16)}QQQQ`,
  `.${c.repeat(16)}QQQQQ`,
  ".SSSSSSSSSSSSSSSQQQQQQ",
  ...[0, 0, 0, 0].map(() => `${c.repeat(5)}${d}${c.repeat(10)}QQQQQQ`),
  "SSSSSSSSSSSSSSSSQQQQQQ",
  ...[0, 0, 0, 0, 0].map(() => `${c.repeat(5)}${d}${c.repeat(10)}QQQQQQ`)]]
const ABITO = {
  maglia: [],
  camicia: [scollo("W")],
  azzurra: [scollo("L")],
  completo: [scollo("W"), [3, [
    "......................",
    ".....................4",
    "....................44",
    ".....................4",
    ".....................4",
    ".....................4",
    ".....................4",
    ".....................4",
    ".....................4",
    ".....................4",
    ".....................r"]]],
  polo: [[2, [
    "................UU....",
    "...............UUUU...",
    "...............VUUUFFF",
    "................VVUfFF",
    "...................VFF",
    "...................VQV",
    "...................VQQ",
    "...................VQS",
    "...................VQQ"]]],
  collana: [[6, [
    "..................4...",
    "...................4..",
    "....................44"]]],
  gilet: [gilet("O", "o")],
  gilet_giallo: [gilet("Y", "y")],
  // giubbotto ad alta visibilità giallo aperto su camicia a quadri (Gino)
  quadri: [[3, [
    "............YYYYYYyRrR",
    "........YYYYYYYYYYYyRr",
    ".....YYYYYYYYYYYYYYyrR",
    "...YYYYYYYYYYYYYYYYyRr",
    "..YYYYYYYYYYYYYYYYYyrR",
    ".YYYYYYYYYYYYYYYYYYyRr",
    ".SSSSSSSSSSSSSSSSSSyrR",
    "YYYYYyYYYYYYYYYYYYYyRr",
    "YYYYYyYYYYYYYYYYYYYyrR",
    "YYYYYyYYYYYYYYYYYYYyRr",
    "YYYYYyYYYYYYYYYYYYYyrR",
    "SSSSSSSSSSSSSSSSSSSyRr",
    "YYYYYyYYYYYYYYYYYYYyrR",
    "YYYYYyYYYYYYYYYYYYYyRr",
    "YYYYYyYYYYYYYYYYYYYyrR",
    "YYYYYyYYYYYYYYYYYYYyRr",
    "YYYYYyYYYYYYYYYYYYYyrR"]]],
  // camicetta bianca (Ornella): colletto aperto chiaro (U) sulla base (Q), scollo a V, bottoni, pieghe sotto il petto, vita stretta
  camicetta: [[3, [
    "............QQVUUUVFFF",
    "........QQQQQQQVUUUVFF",
    ".....QQQQQQQQQQQVUUVFF",
    "...QQQQQQQQQQQQQQVUUVF",
    "..QQQQQQQQQQQQQQQQVUVf",
    ".QQQQQQQQQQQQQQQQQQVVV",
    ".QQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQVQQQQQUUUUQQQQQQs",
    "QQQQQVQQQQQQUUQQQQQQVQ",
    "QQQQQVQQQQQQQQQQQQQVQQ",
    "QQQQQVQQQVQQQQQQQQVQQs",
    "QQQQQVQQQQVVVVVVVVQQQQ",
    "QQQQQVVQQQQQQQQQQQQQQQ",
    "QQQQQVVQQQQQQQQQQQQQQs",
    "QQQQQVVVQQQQQQQQQQQQQQ",
    "QQQQQVVVQQQQQQQQQQQQQQ",
    "QQQQQVVVVQQQQQQQQQQQQs"]]],
  // felpa col cappuccio (Marco): cordini chiari sul petto
  felpa: [[3, [
    "...........UUUUUUUVfFF",
    ".......UUUUQQQQQQQUVFF",
    "...................UVV",
    "..................U...",
    "..................U...",
    "..................W...",
    "......................"]]],
}
// poncho a righe sopra la camicetta bianca (Marzia): una riga di colore per riga di pixel (r), motivi a puntini nelle bande,
// scollo a V da cui spunta il colletto, orlo in diagonale con le frange gialle, la camicetta resta sulle braccia
const poncho = r => {
  const da = [12, 8, 5, 3, 2, 1, 1, 0, 0, 0, 0, 3, 6, 9, 11, 13, 15], a = [13, 14, 15, 16, 17, 18, 19, 20]
  const mot = { 4: [1, "W"], 8: [3, "Y"], 12: [1, "R"] }
  return da.map((x0, y) => [...Array(22)].map((_, x) => {
    if (x >= x0 && x <= (a[y] ?? 21)) return mot[y] && x % 4 === mot[y][0] ? mot[y][1] : r[y]
    return y && x < x0 && x >= da[y - 1] && x % 2 === 0 ? "Y" : "."
  }).join(""))
}
ABITO.poncho = [...ABITO.camicetta, [3, poncho("RRYTTTYPPPYOOOYRR")]]
function busto(nome, abito) {
  let g = [...COLLO, ...BUSTO]
  for (const [y, r] of ABITO[abito]) g = merge(g, r, y + COLLO.length)
  sprite("_b_" + nome, { mx: true, outline: "K" }, g.join("\n"))
}

// ================================================================ cose sopra al ritratto (coordinate del ritratto 48×56)
// la testa parte da x 11, y 6: colonna c della metà sinistra = x 12+c, riga r = y 7+r; il busto parte da y 34
const casco = (c1, c2) => grid(10, 4, `
  .........KKKKKK.........
  .......KK${c1.repeat(6)}KK.......
  .....KK${c1.repeat(10)}KK.....
  ....K${c1.repeat(14)}K....
  ...K${c1.repeat(16)}K...
  ...K${c1.repeat(16)}K...
  ..K${c1.repeat(18)}K..
  KK${c2.repeat(20)}KK
  K${c2.repeat(22)}K
  .KKKKKKKKKKKKKKKKKKKKKK.`)
const berretto = (c1, c2, logo = c1) => grid(10, 5, `
  ........KKKKKKKK........
  ......KK${c1.repeat(8)}KK......
  .....K${c1.repeat(12)}K.....
  ....K${c1.repeat(5)}${logo}${logo}${c1.repeat(7)}K....
  ...K${c1.repeat(4)}${logo.repeat(4)}${c1.repeat(8)}K...
  ...K${c1.repeat(16)}K...
  ..K${c2.repeat(18)}K..
  ..KKKKKKKKKKKKKKKKKKKKK${c2}KKK
  ......................K${c2.repeat(3)}K
  .......................KKKK`)
const cuffia = () => grid(9, 10, `
  ...KKKKKKKKKKKKKKKKKKK...
  ..K...................K..
  .K.....................K.
  .K.....................K.
  .K.....................K.
  .K.....................K.
  .K.....................K.
  KKK...................KKK
  KDK...................KDK
  KDK...................KDK
  KKK...................KKK
  .K.......................
  .K.......................
  ..K......................
  ...KKK...................
  ...KdK...................
  ...KKK...................`)
const cartellina = () => grid(32, 44, `
  ..KKK..
  .KKSKK.
  KNNNNNK
  KNWWWNK
  KNKKWNK
  KNWWWNK
  KNKWKNK
  KNWWWNK
  KNNNNNK
  .KKKKK.`)
const chiave = () => grid(32, 44, `
  KK.KK
  KSKSK
  KSSSK
  .KSK.
  .KSK.
  .KSK.
  .KSK.
  KSSSK
  .KKK.`)
const tesserino = () => grid(29, 46, "KKKK\nKuWK\nKWWK\nKKKK")
const spilla = c => grid(12, 46, `KKKK\nK${c}${c}K\nK${c}${c}K\nKKKK`)
const auricolare = () => grid(35, 20, "KKK\nKBK\nKKK\n.K.\n.K.")
const cuffie_collo = () => grid(13, 36, `
  .....KKKKKKKKKKKK.....
  ....K............K....
  KKKKK............KKKKK
  KuuuK............KuuuK
  KuuuK............KuuuK
  KtttK............KtttK
  KKKKK............KKKKK`)
const occhiolino = () => grid(26, 22, "FKKF\nKFFK\nFFFF")   // l'occhio a destra chiuso a lunetta
const punto = () => grid(21, 44, `
  .KKKK.
  KssssK
  ...KsK
  ..KsK.
  ..KK..
  ......
  ..Ks..`)

// ================================================================ personaggi
const PELLE = { chiara: {}, media: { F: "A", f: "X", v: "F" }, scura: { F: "c", f: "x", v: "k" } }
const scuro = (hex, k = 0.68) => "#" + [1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, "0")).join("")
// p: pelle, capelli (acconciatura), cap [base, riflesso, ombra?], vest [base, ombra, chiaro], abito, bocca, viso [...],
//    occhiali (colore della montatura), labbra, orecchini, accento (cravatta o collana)
function ritratto(nome, p, sopra = []) {
  const [hc, hl, hd] = p.cap
  const [vc, vd, vl] = p.vest
  testa(nome, p); busto(nome, p.abito || "maglia")
  const swap = { ...PELLE[p.pelle || "chiara"], H: hc, I: hl || hc, J: hd || scuro(hc), Q: vc, V: vd, U: vl,
    1: p.occhiali || "K", 2: p.labbra || "R", 3: p.orecchini || "Y", 4: p.accento || "R", ...(p.swap || {}) }
  sprite(nome, { w: 48, h: 56, swap }, stamp("_b_" + nome, 1, 33), stamp("_t_" + nome, 11, 6), ...sopra)
}
// colori dei vestiti [base, ombra, chiaro]
const BLU = ["#2b3550", "#1b2238", "#44547a"], NAVY = ["#26365c", "#1b2238", "#3a4f80"]

// --- i quattro CEO (ritratto_<nome>.png)
ritratto("ceo_gino", { pelle: "media", capelli: "corti", cap: ["#9aa0a8", "#c9ced4", "#6b7280"], viso: ["baffi"], abito: "quadri", vest: ["#e8a317", "#b97f0c", "#ffd36b"] },
  [berretto("D", "d", "O")])
ritratto("ceo_edoardo", { capelli: "corti", cap: ["#6b4a30", "#8a6448"], bocca: "sorriso", abito: "completo", vest: NAVY, accento: "R" })
ritratto("ceo_valeria", { pelle: "media", capelli: "caschetto", cap: ["#4a3426", "#6e4e38"], bocca: "rossetto", labbra: "#b8323a", viso: ["occhiali", "orecchini"], abito: "camicia", vest: NAVY })
ritratto("ceo_marco", { pelle: "media", capelli: "spettinati", cap: ["#2c2420", "#463830"], viso: ["barba", "occhiali"], abito: "felpa", vest: ["#5d636b", "#3e434a", "#8a9098"] },
  [tesserino()])

// --- manager e dirigenti (p_<nome>.png)
ritratto("p_rosa", { pelle: "media", capelli: "ricci", cap: ["#7a3220", "#a3482c"], bocca: "rossetto", labbra: "#a83a3a", viso: ["orecchini"], orecchini: "#e2b84a", abito: "camicia", vest: ["#b8323a", "#8a222a", "#d65a60"] },
  [grid(14, 45, "KKKK\nKRRK\nKRRK\nKKKK")])
ritratto("p_toto", { pelle: "scura", capelli: "calvo", cap: ["#c9ced4", "#e6e9ec"], bocca: "sorriso", viso: ["baffi"], swap: { J: "#3d3a38" }, abito: "azzurra", vest: ["#3a6db0", "#264f86", "#5a8bd0"] },
  [auricolare()])
ritratto("p_chiara", { capelli: "lunghi", cap: ["#b98a4e", "#d9ad6c"], bocca: "rossetto", labbra: "#c85a62", viso: ["occhiali"], abito: "camicia", vest: ["#1f9e8f", "#157366", "#3dd6c4"] })
ritratto("p_davide", { pelle: "media", capelli: "rasati", cap: ["#2c2420", "#463830"], viso: ["barba"], swap: { J: "#5a4a40" }, abito: "polo", vest: ["#ff8a2a", "#c86a1f", "#ffb070"] })
ritratto("p_luca", { capelli: "spettinati", cap: ["#4a3426", "#6e4e38"], vest: ["#2e3440", "#1f242c", "#4a5262"] }, [cuffie_collo()])
ritratto("p_franca", { capelli: "permanente", cap: ["#b9bec5", "#dfe3e8"], bocca: "rossetto", labbra: "#b0505a", viso: ["occhiali"], occhiali: "#8a5f36", abito: "collana", accento: "#f4f1ec", vest: ["#7a4fa0", "#58377a", "#9b6bc4"] })
ritratto("p_ottavio", { capelli: "calvo", cap: ["#9aa0a8", "#c9ced4"], viso: ["occhiali"], abito: "completo", accento: "G", vest: BLU })
ritratto("p_giulia", { pelle: "media", capelli: "caschetto", cap: ["#a3482c", "#c86a40"], bocca: "rossetto", labbra: "#b8323a", viso: ["orecchini"], orecchini: "#e2b84a", abito: "collana", accento: "#e2b84a", vest: ["#e8a317", "#b97f0c", "#ffd36b"] })
ritratto("p_roberto", { pelle: "scura", capelli: "corti", cap: ["#c9ced4", "#eef1f4"], bocca: "sorriso", abito: "completo", accento: "R", vest: ["#4a2f5c", "#33203f", "#6b4a82"] })
ritratto("p_giorgio", { pelle: "media", capelli: "corti", cap: ["#3d2419", "#5a3a28"], viso: ["barba"], abito: "polo", vest: ["#c8551f", "#9a3f15", "#ff8a4a"] })
ritratto("p_aisha", { pelle: "scura", capelli: "ricci", cap: ["#1c1612", "#3d2419"], bocca: "ridente", labbra: "#8f3a3a", viso: ["orecchini"], orecchini: "Y", abito: "collana", accento: "#f4f5f7", vest: ["#5fb4f0", "#3a8ccc", "#a9dcff"] })
ritratto("p_ivan", { capelli: "rasati", cap: ["#d9ad6c", "#f0d090"], bocca: "sorriso", abito: "polo", vest: NAVY, swap: { U: "#f4f5f7" } })
ritratto("p_sara", { capelli: "lunghi", cap: ["#2c2420", "#4a3c34"], bocca: "rossetto", labbra: "#b8323a", viso: ["occhiali"], vest: ["#e0393e", "#a8262b", "#ff6a6e"] })
ritratto("p_nicola", { pelle: "media", capelli: "spettinati", cap: ["#5d636b", "#8a9098"], viso: ["baffi", "occhiali"], occhiali: "#8a5f36", vest: ["#2e9e48", "#1f7a34", "#5cc472"] })
ritratto("p_elena", { pelle: "media", capelli: "lunghi", cap: ["#a3482c", "#c86a40"], bocca: "rossetto", labbra: "#c85a62", viso: ["orecchini"], orecchini: "#e2b84a", abito: "collana", accento: "Y", vest: ["#4a5f7a", "#33445a", "#6b819e"] })
ritratto("p_matteo", { capelli: "spettinati", cap: ["#4a3426", "#6e4e38"], viso: ["barba", "occhiali"], bocca: "sorriso", vest: ["#9b6bff", "#6f43cf", "#c8adff"] })
ritratto("p_beatrice", { capelli: "caschetto", cap: ["#b9bec5", "#dfe3e8"], bocca: "rossetto", labbra: "#b0505a", viso: ["orecchini"], orecchini: "S", abito: "camicia", vest: ["#16202e", "#0c131d", "#2f3d52"] })
ritratto("p_paolo", { pelle: "media", capelli: "corti", cap: ["#9aa0a8", "#c9ced4"], viso: ["occhiali"], abito: "completo", accento: "P", vest: ["#5a3e2b", "#3e2a1c", "#7a5a40"] })
ritratto("p_federico", { pelle: "scura", capelli: "corti", cap: ["#2c2420", "#463830"], viso: ["barba"], abito: "completo", accento: "K", vest: ["#1f9e8f", "#157366", "#3dd6c4"] })
ritratto("p_andrew", { capelli: "corti", cap: ["#e8c25a", "#fbe39a", "#b08a2e"], bocca: "sorriso", viso: ["quadrati"], vest: ["#2e9e48", "#1f7a34", "#5cc472"] })
ritratto("p_mirella", { capelli: "caschetto", cap: ["#5a2430", "#8a3a4a"], bocca: "rossetto", labbra: "#b8323a", viso: ["orecchini"], orecchini: "#e2b84a", abito: "camicia", vest: ["#e0393e", "#a8262b", "#ff6a6e"] }, [cuffia()])
ritratto("p_gianfranco", { pelle: "media", capelli: "corti", cap: ["#9aa0a8", "#c9ced4"], viso: ["baffi"], abito: "completo", accento: "Y", vest: ["#3a6db0", "#264f86", "#5a8bd0"] })
ritratto("p_kevin", { pelle: "media", capelli: "spettinati", cap: ["#2c2420", "#4a3c34"], viso: ["occhiali"], bocca: "sorriso", vest: ["#1f9e8f", "#157366", "#3dd6c4"] }, [cuffia()])
ritratto("p_delsasso", { pelle: "media", capelli: "riccetti", cap: ["#2c2420", "#4a3c34"], bocca: "sorriso", vest: NAVY })
ritratto("p_sorrentino", { pelle: "media", capelli: "stempiato", cap: ["#4a4644", "#9aa0a8"], viso: ["naso", "stretti"], abito: "polo", vest: ["#2f5f9e", "#1f4377", "#4a7fc0"] })
ritratto("p_greta", { capelli: "riccioni", cap: ["#e8c25a", "#fbe39a", "#b08a2e"], bocca: "ridente", labbra: "#c85a62", viso: ["occhioni", "orecchini"], abito: "polo", vest: ["#ff7a3d", "#c8551f", "#ffb07a"] })
ritratto("p_daniele", { capelli: "corti", cap: ["#1c1a22", "#3a3848"], viso: ["occhiali"], vest: ["#2a2a33", "#16161c", "#4a4a56"] })
ritratto("p_marzia", { capelli: "lunghi", cap: ["#5d4a3e", "#8a7466", "#3d2f26"], bocca: "rossetto", labbra: "#b0505a", viso: ["occhiali", "orecchini"], occhiali: "#7a3220",
  orecchini: "#e2b84a", abito: "poncho", vest: ["#e9edf2", "#c3d0dc", "#ffffff"] })

// --- la dottoressa Ornella Ribalta, insegnante dei tutorial: tre espressioni (spiega, contenta, occhiolino)
const ORNELLA = { pelle: "media", capelli: "caschetto", cap: ["#1c1a22", "#3a3848"], viso: ["occhiali", "orecchini"], occhiali: "#e0393e",
  orecchini: "#e2b84a", labbra: "#c8323a", abito: "camicetta", vest: ["#e9edf2", "#c3d0dc", "#ffffff"] }
ritratto("p_ornella", { ...ORNELLA, bocca: "rossetto" })
ritratto("p_ornella_contenta", { ...ORNELLA, bocca: "ridente" })
ritratto("p_ornella_occhiolino", { ...ORNELLA, bocca: "ridente" }, [occhiolino()])

// --- ritratti a scelta per il CEO creato dal giocatore
ritratto("p_cc1", { pelle: "media", capelli: "corti", cap: ["#2c2420", "#463830"], bocca: "sorriso", abito: "completo", accento: "Y", vest: NAVY })
ritratto("p_cc2", { capelli: "caschetto", cap: ["#b98a4e", "#d9ad6c"], bocca: "rossetto", labbra: "#c85a62", viso: ["orecchini"], orecchini: "#e2b84a", abito: "collana", accento: "#f4f5f7", vest: ["#2e9e48", "#1f7a34", "#5cc472"] })
ritratto("p_cc3", { pelle: "scura", capelli: "rasati", cap: ["#2c2420", "#4a3c34"], viso: ["barba"], vest: ["#e0393e", "#a8262b", "#ff6a6e"] })
ritratto("p_cc4", { pelle: "media", capelli: "lunghi", cap: ["#7a3220", "#a3482c"], bocca: "rossetto", labbra: "#a83a3a", viso: ["occhiali"], vest: ["#4a5f7a", "#33445a", "#6b819e"] })
ritratto("p_cc5", { capelli: "corti", cap: ["#9aa0a8", "#c9ced4"], viso: ["baffi"], abito: "completo", accento: "B", vest: ["#5a3e2b", "#3e2a1c", "#7a5a40"] })
ritratto("p_cc6", { pelle: "scura", capelli: "ricci", cap: ["#1c1612", "#3d2419"], bocca: "rossetto", labbra: "#8f3a3a", viso: ["orecchini"], orecchini: "#e2b84a", vest: ["#9b6bff", "#6f43cf", "#c8adff"] })
ritratto("p_cc7", { capelli: "spettinati", cap: ["#4a3426", "#6e4e38"], viso: ["barba", "occhiali"], occhiali: "#8a5f36", vest: ["#ff7a3d", "#c8551f", "#ffb07a"] })
ritratto("p_cc8", { pelle: "media", capelli: "permanente", cap: ["#b9bec5", "#dfe3e8"], bocca: "rossetto", labbra: "#b0505a", viso: ["occhiali"], vest: ["#1f9e8f", "#157366", "#3dd6c4"] })
ritratto("p_cc9", { pelle: "media", capelli: "calvo", cap: ["#5d636b", "#8a9098"], viso: ["barba"], abito: "completo", accento: "O", vest: ["#3a4658", "#2a3442", "#4f5d72"] })
ritratto("p_cc10", { capelli: "lunghi", cap: ["#ffd23f", "#fff3c4", "#c98a00"], bocca: "rossetto", labbra: "#c85a62", abito: "collana", accento: "Y", vest: BLU })

// --- personale generico
ritratto("p_magazziniere", { pelle: "media", capelli: "corti", cap: ["#3d2419", "#5a3a28"], abito: "gilet", vest: ["#3a4658", "#2a3442", "#4f5d72"] }, [casco("Y", "y")])
ritratto("p_autista", { pelle: "scura", capelli: "corti", cap: ["#2c2420", "#463830"], viso: ["barba"], bocca: "sorriso", abito: "polo", vest: ["#5fb4f0", "#3a8ccc", "#a9dcff"] }, [berretto("R", "r")])
ritratto("p_impiegata", { capelli: "caschetto", cap: ["#2c2420", "#4a3c34"], bocca: "rossetto", labbra: "#c85a62", abito: "camicia", vest: ["#d6dbe2", "#b5bec9", "#f4f5f7"] }, [cuffia()])
ritratto("p_carrellista", { capelli: "corti", cap: ["#b98a4e", "#d9ad6c"], viso: ["baffi"], swap: { J: "#8a5f36" }, abito: "gilet_giallo", vest: ["#3a6db0", "#264f86", "#5a8bd0"] }, [casco("W", "S")])
ritratto("p_corriere", { pelle: "media", capelli: "spettinati", cap: ["#4a3426", "#6e4e38"], bocca: "sorriso", abito: "polo", vest: ["#1f9e8f", "#157366", "#3dd6c4"] }, [berretto("O", "o")])
ritratto("p_capoturno", { pelle: "scura", capelli: "corti", cap: ["#2c2420", "#463830"], viso: ["baffi"], vest: ["#2e9e48", "#1f7a34", "#5cc472"] }, [casco("R", "r"), cartellina()])
ritratto("p_pianificatore", { capelli: "spettinati", cap: ["#7a3220", "#a3482c"], viso: ["barba", "occhiali"], abito: "completo", accento: "P", vest: ["#4a5f7a", "#33445a", "#6b819e"] })
ritratto("p_facility", { pelle: "media", capelli: "rasati", cap: ["#5a4a40", "#7a6a5e"], viso: ["barba", "occhiali"], vest: ["#1f9e8f", "#157366", "#3dd6c4"] }, [casco("W", "S"), chiave()])
ritratto("p_operatore", { pelle: "scura", capelli: "rasati", cap: ["#1c1612", "#3d2419"], bocca: "sorriso", abito: "polo", vest: ["#ffd23f", "#d9a514", "#ffe88a"] }, [cuffia()])

// --- leader dei tre sindacati (pacchetto Relazioni industriali): una spilla col colore della sigla
ritratto("p_u_cup", { capelli: "caschetto", cap: ["#b9bec5", "#dfe3e8"], bocca: "rossetto", labbra: "#a83a3a", viso: ["occhiali", "orecchini"], orecchini: "S", abito: "collana", accento: "#f4f5f7", vest: ["#e0393e", "#a8262b", "#ff6a6e"] }, [spilla("R")])
ritratto("p_u_sam", { pelle: "media", capelli: "rasati", cap: ["#2c2420", "#463830"], viso: ["baffi"], abito: "polo", vest: ["#5a3e2b", "#3e2a1c", "#7a5a40"], swap: { U: "#3a2a1c" } }, [spilla("O")])
ritratto("p_u_coba", { pelle: "scura", capelli: "spettinati", cap: ["#1c1612", "#3d2419"], viso: ["barba"], vest: NAVY }, [spilla("P")])

// --- posto vacante: sagoma in ombra, senza occhi, con un punto di domanda sul petto
ritratto("p_anonimo", { capelli: "corti", cap: ["#2f3d52"], viso: ["senzaocchi"], vest: ["#2f3d52", "#1f2a3a", "#3d4d66"],
  swap: { K: "#0c131d", F: "#2f3d52", f: "#26334a", v: "#2f3d52", I: "#2f3d52", J: "#26334a" } }, [punto()])

// --- volti generici dei candidati creati dal gioco: 0-19 uomini, 20-39 donne; a gruppi di 7 per fascia d'età
// (0-6 giovani, 7-13 di mezza età, 14-19 anziani). Stesse caratteristiche dei volti di prima: il gioco li sceglie per sesso ed età.
const VOLTI = [
  ["chiara", "corti", ["#7a3220", "#a3482c"], ["#3a4658", "#2a3442", "#4f5d72"], {}],
  ["media", "corti", ["#5a2430", "#8a3a4a"], ["#5fb4f0", "#3a8ccc", "#a9dcff"], { abito: "completo", accento: "Y" }],
  ["media", "spettinati", ["#2c2420", "#463830"], ["#e8a317", "#b97f0c", "#ffd36b"], { viso: ["barba"], abito: "polo" }],
  ["media", "spettinati", ["#3d2419", "#5a3a28"], ["#16202e", "#0c131d", "#2f3d52"], { abito: "polo", bocca: "sorriso" }],
  ["chiara", "corti", ["#7a3220", "#a3482c"], ["#9b6bff", "#6f43cf", "#c8adff"], { bocca: "sorriso" }],
  ["chiara", "corti", ["#d9ad6c", "#f0d090"], ["#3a4658", "#2a3442", "#4f5d72"], {}],
  ["media", "corti", ["#5a2430", "#8a3a4a"], ["#3a4658", "#2a3442", "#4f5d72"], { abito: "completo", accento: "#f4f5f7" }],
  ["scura", "corti", ["#3d2419", "#5a3a28"], ["#16202e", "#0c131d", "#2f3d52"], { viso: ["barba"], abito: "completo", accento: "R" }],
  ["scura", "calvo", ["#5a2430", "#8a3a4a"], ["#16202e", "#0c131d", "#2f3d52"], { viso: ["baffi"], abito: "polo" }],
  ["media", "spettinati", ["#5a2430", "#8a3a4a"], ["#ff7a3d", "#c8551f", "#ffb07a"], { abito: "completo", accento: "Y", bocca: "sorriso" }],
  ["scura", "spettinati", ["#5a2430", "#8a3a4a"], ["#3a4658", "#2a3442", "#4f5d72"], {}],
  ["media", "corti", ["#5a2430", "#8a3a4a"], ["#ff7a3d", "#c8551f", "#ffb07a"], { abito: "completo", accento: "B" }],
  ["media", "rasati", ["#b98a4e", "#d9ad6c"], ["#1f9e8f", "#157366", "#3dd6c4"], { bocca: "sorriso" }],
  ["chiara", "corti", ["#5a2430", "#8a3a4a"], ["#9b6bff", "#6f43cf", "#c8adff"], { viso: ["barba", "occhiali"], occhiali: "#8a5f36", abito: "completo", accento: "Y" }],
  ["media", "rasati", ["#9aa0a8", "#c9ced4"], ["#5fb4f0", "#3a8ccc", "#a9dcff"], { viso: ["barba"], abito: "polo" }],
  ["scura", "calvo", ["#5d636b", "#8a9098"], ["#e0393e", "#a8262b", "#ff6a6e"], { viso: ["occhiali"], occhiali: "#8a5f36", abito: "completo", accento: "K" }],
  ["media", "calvo", ["#b9bec5", "#dfe3e8"], ["#1f9e8f", "#157366", "#3dd6c4"], { abito: "completo", accento: "G", bocca: "sorriso" }],
  ["media", "calvo", ["#b9bec5", "#dfe3e8"], ["#e0393e", "#a8262b", "#ff6a6e"], { viso: ["baffi"], abito: "completo", accento: "K" }],
  ["media", "corti", ["#b9bec5", "#dfe3e8"], ["#ff7a3d", "#c8551f", "#ffb07a"], { viso: ["occhiali"], abito: "polo" }],
  ["scura", "spettinati", ["#5d636b", "#8a9098"], NAVY, { viso: ["occhiali"], abito: "completo", accento: "K" }],
  ["media", "lunghi", ["#5a2430", "#8a3a4a"], ["#5fb4f0", "#3a8ccc", "#a9dcff"], { labbra: "#c85a62", bocca: "ridente" }],
  ["media", "caschetto", ["#7a3220", "#a3482c"], ["#1f9e8f", "#157366", "#3dd6c4"], { labbra: "#8f3a3a", orecchini: "#e2b84a", abito: "collana", accento: "P" }],
  ["chiara", "lunghi", ["#2c2420", "#463830"], ["#1f9e8f", "#157366", "#3dd6c4"], { labbra: "#b0505a", abito: "collana", accento: "Y" }],
  ["scura", "lunghi", ["#1c1612", "#3d2419"], ["#3a4658", "#2a3442", "#4f5d72"], { labbra: "#c85a62" }],
  ["media", "caschetto", ["#d9ad6c", "#f0d090"], ["#3a4658", "#2a3442", "#4f5d72"], { labbra: "#b0505a", orecchini: "S" }],
  ["media", "ricci", ["#5a2430", "#8a3a4a"], ["#ff7a3d", "#c8551f", "#ffb07a"], { viso: ["occhiali"], labbra: "#8f3a3a", orecchini: "#e2b84a", abito: "camicia" }],
  ["media", "lunghi", ["#3d2419", "#5a3a28"], ["#4a5f7a", "#33445a", "#6b819e"], { viso: ["occhiali"], labbra: "#a83a3a", orecchini: "#e2b84a" }],
  ["chiara", "ricci", ["#1c1612", "#3d2419"], ["#2e9e48", "#1f7a34", "#5cc472"], { labbra: "#8f3a3a", abito: "collana", accento: "P", bocca: "ridente" }],
  ["media", "caschetto", ["#5d636b", "#8a9098"], ["#e8a317", "#b97f0c", "#ffd36b"], { labbra: "#a83a3a", orecchini: "S", abito: "collana", accento: "R" }],
  ["scura", "caschetto", ["#5d636b", "#8a9098"], ["#16202e", "#0c131d", "#2f3d52"], { labbra: "#8f3a3a", orecchini: "#e2b84a" }],
  ["chiara", "ricci", ["#9aa0a8", "#c9ced4"], NAVY, { labbra: "#b0505a", abito: "collana", accento: "Y" }],
  ["chiara", "caschetto", ["#9aa0a8", "#c9ced4"], ["#2e9e48", "#1f7a34", "#5cc472"], { labbra: "#a83a3a", orecchini: "S", abito: "camicia" }],
  ["scura", "lunghi", ["#2c2420", "#463830"], ["#ff7a3d", "#c8551f", "#ffb07a"], { labbra: "#8f3a3a", orecchini: "#e2b84a", bocca: "ridente" }],
  ["media", "caschetto", ["#b98a4e", "#d9ad6c"], ["#ff7a3d", "#c8551f", "#ffb07a"], { viso: ["occhiali"], labbra: "#b0505a", abito: "camicia" }],
  ["media", "permanente", ["#5d636b", "#8a9098"], ["#16202e", "#0c131d", "#2f3d52"], { labbra: "#a83a3a", abito: "camicia" }],
  ["chiara", "permanente", ["#5d636b", "#8a9098"], ["#4a5f7a", "#33445a", "#6b819e"], { labbra: "#c85a62", abito: "collana", accento: "Y" }],
  ["chiara", "permanente", ["#5d636b", "#8a9098"], ["#5fb4f0", "#3a8ccc", "#a9dcff"], { labbra: "#b8323a", orecchini: "#e2b84a", bocca: "ridente" }],
  ["media", "caschetto", ["#c9ced4", "#eef1f4"], ["#4a5f7a", "#33445a", "#6b819e"], { labbra: "#c85a62", orecchini: "#e2b84a", abito: "camicia" }],
  ["media", "caschetto", ["#c9ced4", "#eef1f4"], ["#5a3e2b", "#3e2a1c", "#7a5a40"], { labbra: "#b8323a", orecchini: "S" }],
  ["media", "caschetto", ["#b9bec5", "#dfe3e8"], ["#e8a317", "#b97f0c", "#ffd36b"], { labbra: "#8f3a3a", orecchini: "S", abito: "camicia" }],
]
VOLTI.forEach(([pelle, capelli, cap, vest, o], i) => {
  const donna = i >= 20
  const viso = [...(o.viso || []), ...(o.orecchini ? ["orecchini"] : [])]
  ritratto("p_v" + i, { pelle, capelli, cap, vest, bocca: donna ? "rossetto" : "seria", ...o, viso })
})

sheet("prova_tutti", ["ceo_*", "p_*"], { cols: 12, pad: 2 })

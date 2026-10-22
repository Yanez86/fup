// Icone del gioco disegnate con pxl: parte comune a tutti i file (colori, stile, tessere per le anteprime).
// Ogni gruppo di icone sta in un suo file che comincia con include("comune.px.js", { palette: true }).
// tools/icone_pxl/esporta.py builda tutti i file, rilegge i PNG e scrive assets/icone.json (lettere di TPAL).
//
// Stile (CLAUDE.md): colori pieni, contorno K (#16202e) attorno alla sagoma (lo mette outline), una sola fascia
// più scura sul fondo di ogni forma alta almeno 3 pixel (la mette fascia()), nessun riflesso. L'ombra netta di 1 pixel
// in basso a destra e la tessera colorata le aggiunge il gioco. Si disegna su una tela di 2 pixel più piccola
// dell'icona: il contorno la fa crescere di 1 pixel per lato (talenti, menu, lenti e pulsanti 14 -> 16;
// tecnologie e policy 10 -> 12; abilità 8 -> 10).
//
// Lettere: le maiuscole sono i colori base, le minuscole i toni scuri e i colori di contenuto (schermi, vetri,
// codice). Solo lettere di TPAL (src/game.html): le cifre servono alle anteprime e non devono finire nelle icone.

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", T: "#1f9e8f", F: "#f2c79b", P: "#9b6bff", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      // toni scuri (fascia d'ombra, pieghe, linee interne)
      y: "#c98a00", o: "#c8551f", r: "#a8262a", g: "#217a36", b: "#2f7fd6", n: "#6b3e1f", s: "#8a96a6", d: "#2a3a50",
      t: "#146b61", f: "#d9946a", p: "#6f43cf", q: "#e8c96a", m: "#3d2412",
      // toni chiari, solo come colori di contenuto (schermi, vetri, codice, fiamme): mai come riflesso sui bordi
      i: "#ffe680", a: "#ffb07a", e: "#ff8a8d", h: "#8ed15b", l: "#c8adff", u: "#5fd4c4", k: "#c08a55", j: "#7f95b0", v: "#ffe2c6",
      // solo per le tessere delle anteprime (fondo, fascia, filetto, ombra): mai nelle icone
      1: "#eaf6ec", 2: "#d5ecda", 3: "#c4e2cb", 4: "#fbecec", 5: "#f2d4d4", 6: "#eccaca", 7: "#fff6dc", 8: "#f6e6b5", 9: "#efdca3",
      0: "#e0a800", "!": "#ffe8d9", "+": "#ffd6bd", ";": "#e8d9a0", "=": "#ece3ff", "%": "#dccdff", "&": "#dff3d6",
      "*": "#c9e9bd", "@": "#ffe1e1", "$": "#ffcaca", "^": "#e1f1fc", "~": "#c8e4f8", ":": "#e6eef3" })
ramps("KdDjsSW", "KbBL", "moOa", "yYi", "KrRe", "KgGh", "mfFv", "mMNk", "tTu", "pPl", "qC")

// ================================================================ stile
// fascia(): il pixel più basso di ogni colonna di una forma (alta almeno 3 pixel dello stesso colore) prende il
// tono scuro del suo colore, come l'ombra interna in basso dei pulsanti. tieni: lettere da lasciare piatte
// (per esempio "W" per fogli e schermi). Va messa dopo il disegno; con mx basta sulla metà disegnata.
const SCURO = { Y: "y", O: "o", R: "r", G: "g", B: "b", N: "n", S: "s", D: "d", T: "t", F: "f", P: "p", C: "q", L: "B", W: "S", M: "m" }
const fascia = (tieni = "") => (c) => {
  const k = (x, y) => (x >= 0 && y >= 0 && x < c.w && y < c.h ? c.key(x, y) : ".")
  const giu = []
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) {
    const a = k(x, y)
    if (SCURO[a] && !tieni.includes(a) && k(x, y + 1) !== a && k(x, y - 1) === a && k(x, y - 2) === a) giu.push([x, y, SCURO[a]])
  }
  for (const [x, y, s] of giu) c.px(x, y, s)
}

// nome di un'icona -> nome del file: minuscole senza accenti, il resto diventa "_" (uguale in esporta.py)
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")

// icona(prefisso, nome, lato, opzioni, ...disegno): lato = misura finale col contorno.
// opzioni: { mx: true } per scrivere solo la metà sinistra (colonne 0..lato/2-2), { tieni: "W" } per la fascia,
// { fascia: false } per non metterla, { dopo: [...] } per i disegni da fare dopo la fascia (scritte e simboli sopra
// una forma, che altrimenti farebbero scurire il pixel sopra di loro), { contorno: false } per disegnare anche il
// contorno a mano (tela intera).
const ICONE = []
function icona(pre, nome, lato, o, ...art) {
  const id = pre + "_" + slug(nome), cont = o.contorno !== false
  const n = cont ? lato - 2 : lato
  sprite(id, { w: n, h: n, mx: o.mx, outline: cont ? "K" : undefined }, ...art, ...(o.fascia === false ? [] : [fascia(o.tieni || "")]), ...(o.dopo || []))
  ICONE.push({ id, pre, lato, tipo: o.tipo })
  return id
}
// talenti 16×16 (nella tessera 20×20 del gioco): tipo "pos" | "neg" | "mix" colora solo l'anteprima
const talento = (nome, tipo, o, ...art) => icona("tal", nome, 16, { ...o, tipo }, ...art)
// tecnologie 12×12 (nella cornice 16×16 dell'albero): albero "log" | "org" | "mkt" | "wel" | "cert"
const tecnologia = (id, albero, o, ...art) => icona("tec", id, 12, { ...o, tipo: albero }, ...art)
// policy 12×12 (sul foglio del regolamento 16×16)
const policy = (id, o, ...art) => icona("pol", id, 12, { ...o, tipo: "pol" }, ...art)
// dotazioni dell'immobile e classi dell'edificio (c_<classe>) 12×12 (nella tessera grigio-azzurra 16×16 della planimetria)
const dotazione = (id, o, ...art) => icona("dot", id, 12, { ...o, tipo: "dot" }, ...art)
// abilità 10×10, menu e lenti 16×16, pulsanti (ui) quadrati di qualsiasi misura (di solito 16)
const abilita = (id, o, ...art) => icona("stat", id, 10, o, ...art)
const menu = (id, o, ...art) => icona("menu", id, 16, o, ...art)
const lente = (id, o, ...art) => icona("lens", id, 16, o, ...art)
const pulsante = (id, lato, o, ...art) => icona("ui", id, lato, o, ...art)

// ================================================================ anteprime
// foglio(nome): una scena con tutte le icone del file nelle tessere del gioco (bordo, filetto, fondo, fascia in basso,
// ombra netta del disegno), 8 per riga, su fondo grigio chiaro. Solo per guardarle: PXL shot file.px.js <nome>.
const TESS = {   // fondo, fascia in basso, filetto, ombra del disegno, lato, rientro per riga (o funzione dentro/fuori)
  pos: ["1", "2", "G", "3", 20, "smussa"], neg: ["4", "5", "R", "6", 20, "smussa"], mix: ["7", "8", "0", "9", 20, "smussa"],
  log: ["!", "+", "O", "+", 16, [0, 0, 0]], org: ["=", "%", "P", "%", 16, [3, 2, 1]], mkt: ["&", "*", "G", "*", 16, [5, 3, 2, 1, 1]],
  wel: ["@", "$", "R", "$", 16, [2, 1]], cert: ["^", "~", "b", "~", 16, { rows: [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4, 5, 6] }],
  pol: ["C", ";", null, ";", 16, [0]], dot: [":", "S", "D", "S", 16, [1]],
}
function tessera(t, X, Y, id) {
  const [bg, bg2, rim, sh, n, cut] = TESS[t]
  const dentro = cut === "smussa" ? (x, y) => x >= 0 && y >= 0 && x < n && y < n && Math.min(x, n - 1 - x) + Math.min(y, n - 1 - y) >= 2
    : cut.rows ? (x, y) => y >= 0 && y < n && x >= cut.rows[y] && x < n - cut.rows[y]
    : (x, y) => { if (y < 0 || y >= n) return false; const d = Math.min(y, n - 1 - y), c = cut[d] || 0; return x >= c && x < n - c }
  const bordo = (x, y) => dentro(x, y) && !(dentro(x - 1, y) && dentro(x + 1, y) && dentro(x, y - 1) && dentro(x, y + 1))
  const filetto = (x, y) => !!rim && [-1, 0, 1].some((a) => [-1, 0, 1].some((b) => bordo(x + a, y + b)))
  const libero = (x, y) => dentro(x - X, y - Y) && !bordo(x - X, y - Y) && !filetto(x - X, y - Y)
  return [
    (c) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (dentro(x, y))
      c.px(X + x, Y + y, bordo(x, y) ? "K" : filetto(x, y) ? rim : y >= n - 4 ? bg2 : bg) },
    clip(libero, stamp(id, X + 3, Y + 3, { silhouette: sh })),
    clip(libero, stamp(id, X + 2, Y + 2)),
  ]
}
function foglio(nome, per = 8) {
  const lista = ICONE.slice()
  const passo = Math.max(...lista.map((i) => (i.pre === "tal" ? 20 : i.pre === "tec" || i.pre === "pol" || i.pre === "dot" ? 16 : i.lato))) + 4
  const righe = Math.ceil(lista.length / per)
  scene(nome, { w: per * passo + 4, h: righe * passo + 4, bg: ":" }, ...lista.flatMap((ic, i) => {
    const X = 4 + (i % per) * passo, Y = 4 + Math.floor(i / per) * passo
    if (ic.pre === "tal" || ic.pre === "tec" || ic.pre === "pol" || ic.pre === "dot") return tessera(ic.pre === "pol" || ic.pre === "dot" ? ic.pre : ic.tipo, X, Y, ic.id)
    return [stamp(ic.id, X, Y)]
  }))
}

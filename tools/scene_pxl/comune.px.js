// Scenette degli eventi: parte comune a tutti i file (colori, misure, omini).
// Ogni gruppo di scene sta in un suo file che comincia con include("comune.px.js").
// Le scene sono 160×72 pixel, 16 fotogrammi a 8 al secondo (un giro di 2 secondi): ogni cosa che si muove
// deve ripetersi in 2, 4, 8 o 16 fotogrammi. tools/scene_pxl/esporta.py le porta nel gioco.

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

// persona in carrozzina (18 colonne), vista di fronte o da dietro («retro», con le teste «nuca»): le ruote grandi
// un po' di sbieco ai lati (copertone K, cerchio s, mozzo S), le maniglie di spinta dietro le spalle, i braccioli, la pedana.
// Come persona(): carrozzina("_x", {...}) crea la parte "__x" (senza contorno), da timbrare nello sprite finale 20×23.
function carrozzina(nome, { testa = "corti", abito, swap = {}, retro = false } = {}) {
  const T = TESTE[testa], C = CORPI.seduto
  const busto = retro ? [C[0], C[1], C[2], "BbddD", "BbddD", "BbddD"] : C          // da dietro lo schienale copre la schiena
  const righe = [
    ...T.map((r, i) => (i >= 8 ? "....s" : ".....") + r),
    ...busto.map((r, i) => (i >= 5 ? "....d" : ".....") + r),
    "....d" + (retro ? "ddddd" : ".DDDD"),
    "....." + (retro ? ".dd.." : ".DDDD"),
    "....." + (retro ? ".d..." : ".DDd."),
    "....." + (retro ? ".d..." : ".DDd."),
    "....." + (retro ? ".d..." : ".KKK."),
    "....." + (retro ? "KK..." : "sssss"),
    "....." + (retro ? "....." : ".K...")]
  const sopra = abito ? ABITI[abito].map((r, i) => [5, 10 + i, r]).filter(([, , r]) => r) : []
  sprite("_" + nome + "_corpo", { mx: true, swap }, righe.join("\n"), ...sopra.map(([x, y, r]) => grid(x, y, r)))
  // la ruota di sbieco: copertone scuro, corrimano chiaro, dentro i raggi e il mozzo (si vede attraverso)
  const ruota = (cx) => [ellipse(cx, 16, 3, 6, "K"), ellipse(cx, 16, 2, 5, "S"), ellipse(cx, 16, 1, 4, "_"), vline(cx, 12, 9, "s"), px(cx, 16, "d")]
  sprite("_" + nome, { w: 20, h: 23 }, stamp("_" + nome + "_corpo"), ...ruota(3), ...ruota(16))
}

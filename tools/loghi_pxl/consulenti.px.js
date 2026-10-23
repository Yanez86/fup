// Loghi dei 6 consulenti dei reparti tecnici (pacchetto Reparto IT e Ingegneria), disegnati con pxl (.claude/skills/pxl-pixel-art).
// Come i loghi dei fornitori: un disegno 12×12 (con il contorno) nel riquadro 16×16 dei loghi dei clienti (pxLogo in src/game.html).
// Le lettere sono quelle di TPAL in src/game.html: il PNG di ogni logo si riconverte in righe di lettere e va in CLOGO.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/consulenti.px.js --out tools/out/loghi_pxl
//   python3 tools/loghi_pxl/esporta.py      # scrive HLOGO, CLOGO e PACK_IC in src/game.html

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", T: "#1f9e8f", F: "#f2c79b", P: "#9b6bff", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      y: "#c98a00", o: "#c8551f", r: "#a8262a", g: "#217a36", b: "#2f7fd6", n: "#6b3e1f", s: "#8a96a6", d: "#2a3a50",
      t: "#146b61", f: "#d9946a", i: "#ffe680", a: "#ffb07a", e: "#ff8a8d", h: "#8ed15b", k: "#c08a55", j: "#7f95b0" })

// fondo del riquadro di ogni logo (quello che il gioco mette dietro), solo per le anteprime
const BG = { nebbia: "D", gigabancale: "Y", lunedi: "B", paletti: "P", cronometrini: "O", schiena: "G" }

// Software Nebbia S.r.l.: tre banchi di nebbia della Bassa, che coprono tutto (anche la documentazione)
// (niente contorno: sul fondo scuro le strisce restano sfumate, come la nebbia vera)
sprite("_nebbia", { pivot: "center" }, `
  ...WWWWWW...
  .WWWWWWWWW..
  ............
  .....LLLLLLL
  ..LLLLLLLL..
  ............
  WWWWW...WWW.
  ............
  ..SSSSSSSS..
  ....SSSS....`)

// Gigabancale Solutions: il bancale con sopra i blocchi di dati
sprite("_gigabancale", { mx: true, outline: "K", pivot: "center" }, `
  .BB.B
  .BB.B
  .bb.b
  NNNNN
  N..N.
  NNNNN`)

// Consulenti del Lunedì S.p.A.: colletto bianco e cravatta rossa
sprite("_lunedi", { mx: true, outline: "K", pivot: "center" }, `
  WWW..
  .WWWR
  ..WRR
  ...RR
  ...RR
  ..RRR
  ..RRR
  ...RR
  ....R`)

// Studio Ing. Paletti & Associati: la squadra da disegno, col foro in mezzo
sprite("_paletti", { outline: "K", pivot: "center" }, `
  Y........
  YY.......
  YYY......
  YYYY.....
  YY.YY....
  YY..YY...
  YY...YY..
  YYYYYYYY.
  yyyyyyyyy`)

// Cronometrini Tempi & Metodi S.a.s.: il cronometro, con la lancetta che corre
sprite("_cronometrini", { outline: "K", pivot: "center" }, `
  ...SSSS...
  ....SS....
  ..SSSSSS..
  .SWWWWWWS.
  SWWWWRWWWS
  SWWWWRWWWS
  SWWWWWWWWS
  .SWWWWWWS.
  ..ssssss..`)

// Schiena Dritta Ergonomia: la colonna vertebrale, dritta come un fuso
sprite("_schiena", { mx: true, outline: "K", pivot: "center" }, `
  ...WW
  ..WWW
  ...ff
  ...WW
  ..WWW
  ...ff
  ...WW
  ..WWW
  ...ff
  ...WW`)

const IDS = Object.keys(BG)
// il logo 12×12 come lo usa il gioco: il disegno centrato, il resto trasparente
for (const id of IDS) sprite("logo_" + id, { w: 12, h: 12 }, stamp("_" + id, 6, 6))
// anteprima: il riquadro 16×16 del gioco (fondo, bordo scuro, angoli tagliati) col logo dentro
for (const id of IDS) sprite("tile_" + id, { w: 16, h: 16 },
  rect(0, 0, 16, 16, "K"), rect(1, 1, 14, 14, BG[id]), rect(1, 1, 1, 1, "K"), rect(14, 1, 1, 1, "K"), rect(1, 14, 1, 1, "K"), rect(14, 14, 1, 1, "K"),
  rect(0, 0, 1, 1, "_"), rect(15, 0, 1, 1, "_"), rect(0, 15, 1, 1, "_"), rect(15, 15, 1, 1, "_"),
  stamp("logo_" + id, 2, 2))

sheet("loghi_consulenti", IDS.map((id) => "tile_" + id), { pad: 2 })

// Loghi degli 11 fornitori di handling (pacchetto Relazioni industriali), disegnati con pxl (.claude/skills/pxl-pixel-art).
// Ogni logo è un disegno 12×12 (con il contorno) che il gioco mette nel riquadro 16×16 dei loghi dei clienti (pxLogo in src/game.html).
// Le lettere sono quelle di TPAL in src/game.html: il PNG di ogni logo si riconverte in righe di lettere e va in HLOGO.
//
//   node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/fornitori.px.js --out tools/out/loghi_pxl
//   python3 tools/loghi_pxl/esporta.py      # scrive HLOGO in src/game.html

pal({ K: "#16202e", W: "#ffffff", Y: "#ffd23f", O: "#ff7a3d", R: "#e0393e", G: "#2e9e48", B: "#5fb4f0", N: "#8a5f36", S: "#c3d0dc",
      D: "#4a5f7a", T: "#1f9e8f", F: "#f2c79b", P: "#9b6bff", C: "#fff3c4", L: "#bfe6ff", M: "#6b3e1f",
      y: "#c98a00", o: "#c8551f", r: "#a8262a", g: "#217a36", b: "#2f7fd6", n: "#6b3e1f", s: "#8a96a6", d: "#2a3a50",
      t: "#146b61", f: "#d9946a", i: "#ffe680", a: "#ffb07a", e: "#ff8a8d", h: "#8ed15b", k: "#c08a55", j: "#7f95b0" })

// fondo del riquadro di ogni logo (quello che il gioco mette dietro), solo per le anteprime
const BG = { spalle: "O", basso: "D", laboriosa: "R", sgobbo: "G", muletto: "Y", lanterna: "B", serenissima: "T", friulana: "P", handlerix: "D", omnimove: "O", ppw: "G" }

// Coop. Spalle Larghe: il facchino che regge la cassa a braccia alzate, spalle larghe
sprite("_spalle", { mx: true, outline: "K", pivot: "center" }, `
  .kkkk
  .NNNN
  .nnnn
  .F...
  .F.FF
  .F.Ff
  .FWWW
  WWWWW
  .WWSS
  .BB..`)

// Consorzio Facchini Riuniti del Basso Lodigiano: il punto interrogativo (nessuno sa chi sia il presidente)
sprite("_basso", { outline: "K", pivot: "center" }, `
  ..YYYY.
  .YiiYYY
  YY...YY
  .....YY
  ....YYy
  ...YYy.
  ...Yy..
  .......
  ...YY..
  ...yy..`)

// La Laboriosa Soc. Coop.: l'ape al lavoro, vista di lato, con le ali chiare
sprite("_laboriosa", { outline: "K", pivot: "center" }, `
  ....LL.LL.
  ...LWLLWLL
  ....LLLLL.
  .dd.YdYYdY
  dWdYYdYYdY
  dddyydyydy
  .d.yydyydy
  ...d...d..`)

// Movimentazioni Fratelli Sgobbo: due fratelli col berretto, uno in camicia bianca e uno in tuta blu
sprite("_sgobbo", { outline: "K", pivot: "center" }, `
  .NNN..NNN.
  NNNnn.nNNN
  .FFF..FFF.
  .FdF..FdF.
  .FFf..fFF.
  ..........
  WWWS..BBBb
  WWWS..BBBb
  WWWS..BBBb`)

// Coop. Il Muletto Allegro: il muletto arancione con la faccia sorridente, il montante e le forche
sprite("_muletto", { outline: "K", pivot: "center" }, `
  ..DDDD....
  ..DLLD..S.
  ..DLLD..S.
  OOOOOOO.S.
  OOdOdOO.S.
  OdOOOdOSS.
  OOdddOO.S.
  ooooooo.S.
  .dd..dd.SSS
  .dd..dd....`)

// Servizi Portuali Lanterna: la Lanterna del porto a fasce bianche e rosse, sullo scoglio
sprite("_lanterna", { outline: "K", pivot: "center" }, `
  ....dd....
  .Y.KYYK.Y.
  ....dd....
  ...WWWS...
  ...RRRr...
  ...WWWS...
  ..RRRRrr..
  ..WWWWSS..
  .RRRRRRrr.
  ssSSSSSsss`)

// Coop. Serenissima Logistica: la gondola col ferro di prua e un pallet a bordo, sull'acqua
sprite("_serenissima", { outline: "K", pivot: "center" }, `
  .........W
  ........WW
  ....kkk..d
  ....NNN..d
  dd..ddd.dd
  .dddddddd.
  ..dddddd..
  LL.LLL.LLL`)

// Friulana Handling: due cime innevate sopra i prati del Friuli
sprite("_friulana", { outline: "K", pivot: "center" }, `
  ...W......
  ..WWS..W..
  .WSsS.WWS.
  .SSssSSsSs
  SSssSssSss
  SsssssSsss
  hhhhhhhhhh
  gggggggggg`)

// Handlerix Global Services: il mappamondo con la H bianca
sprite("_handlerix", { outline: "K", pivot: "center" }, `
  ..BBBBBB..
  .BBWBBWBB.
  BBBWBBWBBb
  GBBWWWWBBb
  GGBWBBWBgb
  GGGWBBWggb
  .GGBBBggb.
  ..ggbbbb..`)

// OmniMove Group: due frecce che vanno e vengono (si sposta tutto, in fretta)
sprite("_omnimove", { outline: "K", pivot: "center" }, `
  ......W...
  ......WW..
  WWWWWWWWW.
  SSSSSSWW..
  ......S...
  ...W......
  ..WW......
  .WWWWWWWWW
  ..WWSSSSSS
  ...S......`)

// Pallet & People Worldwide: la coccarda della certificazione con il pallet, e i nastri
sprite("_ppw", { outline: "K", pivot: "center" }, `
  ..YYYY..
  .YiYYYY.
  YYNNNNYy
  YYnnnnYy
  YYNdNNYy
  .YyyyyY.
  ..RyyR..
  .RR..RR.
  .rR..Rr.`)

const IDS = Object.keys(BG)
// il logo 12×12 come lo usa il gioco: il disegno centrato, il resto trasparente
for (const id of IDS) sprite("logo_" + id, { w: 12, h: 12 }, stamp("_" + id, 6, 6))
// anteprima: il riquadro 16×16 del gioco (fondo, bordo scuro, angoli tagliati) col logo dentro
for (const id of IDS) sprite("tile_" + id, { w: 16, h: 16 },
  rect(0, 0, 16, 16, "K"), rect(1, 1, 14, 14, BG[id]), rect(1, 1, 1, 1, "K"), rect(14, 1, 1, 1, "K"), rect(1, 14, 1, 1, "K"), rect(14, 14, 1, 1, "K"),
  rect(0, 0, 1, 1, "_"), rect(15, 0, 1, 1, "_"), rect(0, 15, 1, 1, "_"), rect(15, 15, 1, 1, "_"),
  stamp("logo_" + id, 2, 2))

sheet("loghi", IDS.map((id) => "tile_" + id), { pad: 2 })

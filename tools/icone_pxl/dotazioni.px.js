// Icone delle dotazioni dell'immobile e delle classi dell'edificio (12×12, nella tessera grigio-azzurra 16×16 della planimetria):
// tela 10×10 più il contorno. Le classi si chiamano c_<classe> (c_fat, c_vec, c_std, c_mod, c_inn), il terreno edificabile lotto.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/dotazioni.px.js foglio
include("comune.px.js", { palette: true })

// Ribalte di carico: il portone aperto con la pedana a strisce gialle e nere
dotazione("ribalte", { tieni: "d" }, `
  SSSSSSSSSS
  SDDDDDDDDS
  SDddddddDS
  SDddddddDS
  SDddddddDS
  SDddddddDS
  SYKYKYKYKS
  SSSSSSSSSS
  SSSSSSSSSS
  SSSSSSSSSS`)
// Pannelli solari: il pannello con la griglia e il sole
dotazione("solare", { fascia: false }, `
  ......YYYY
  ......YYYY
  ......YYYY
  BBBBBBBB..
  BbBBbBBbB.
  BBBBBBBBB.
  BbBBbBBbBB
  BBBBBBBBBB
  ...DD..DD.
  ...DD..DD.`)
// Illuminazione LED: la lampadina fredda
dotazione("led", { tieni: "L" }, `
  ...LLLL...
  ..LLLLLL..
  .LLLWWLLL.
  .LLWLLWLL.
  .LLLWWLLL.
  ..LLLLLL..
  ...LLLL...
  ...SSSS...
  ...DDDD...
  ...SSSS...`)
// Parcheggio dei camion: il cartello blu con la P
dotazione("parcheggio", { tieni: "W" }, `
  bbbbbbbbbb
  bbWWWWWbbb
  bbWWbbWWbb
  bbWWbbWWbb
  bbWWWWWbbb
  bbWWbbbbbb
  bbWWbbbbbb
  bbbbbbbbbb
  ....SS....
  ....SS....`)
// Portineria: la guardiola con la sbarra bianca e rossa
dotazione("portineria", { tieni: "RW" }, `
  DDDDDD....
  .DDDD.....
  .DLLD.....
  .DLLD.....
  .DDDDRRWWR
  .DNNDRRWWR
  .DNND.....
  .DNND.....
  .DNND.....
  .DDDD.....`)
// Piazzale esterno: i pallet accatastati sull'asfalto con le strisce
dotazione("piazzale", { tieni: "D" }, `
  ..........
  ..NNNNNN..
  ..NnNNnN..
  ..NNNNNN..
  NNNNNNNNNN
  NnNNnNNnNN
  NNNNNNNNNN
  DDDDDDDDDD
  DYYDDYYDDD
  DDDDDDDDDD`)
// Giardino: l'albero sul prato
dotazione("giardino", {}, `
  ...GGGG...
  ..GGGGGG..
  .GGGGGGGG.
  .GGGGGGGG.
  .GGGGGGGG.
  ..GGGGGG..
  ....NN....
  ....NN....
  GGGGNNGGGG
  GGGGGGGGGG`)
// Mensa esterna: la scodella di minestra con il cucchiaio
dotazione("mensa", { tieni: "O" }, `
  ......SS..
  ......SS..
  ......SS..
  OOOOOOSSOO
  RRRRRRRRRR
  RRRRRRRRRR
  .RRRRRRRR.
  ..RRRRRR..
  ...RRRR...
  ..RRRRRR..`)
// Celle frigo: il fiocco di neve sulla porta della cella
dotazione("frigo", { tieni: "W" }, `
  BBBBBBBBBB
  BBBBWBBBBB
  BBWBWBWBBB
  BBBWWWBBBB
  BWWWWWWWBB
  BBBWWWBBBB
  BBWBWBWBBB
  BBBBWBBBBB
  BBBBBBBBBB
  BBBBBBBBBB`)
// Impianto antincendio: l'estintore
dotazione("sprinkler", { tieni: "W" }, `
  ..DDDDD...
  ....D.....
  ...DDD....
  ..RRRRR...
  .RRRRRRR..
  .RWWWWWR..
  .RWRRRWR..
  .RWWWWWR..
  .RRRRRRR..
  .RRRRRRR..`)
// Ricarica dei muletti: la batteria con il fulmine
dotazione("ricarica", { tieni: "Y" }, `
  ...SSSS...
  .GGGGGGGG.
  .GGGGYYGG.
  .GGGYYGGG.
  .GGYYGGGG.
  .GYYYYYGG.
  .GGGYYGGG.
  .GGYYGGGG.
  .GGYGGGGG.
  .GGGGGGGG.`)
// Terreno edificabile: il paletto con la bandierina sul campo
dotazione("lotto", { tieni: "R" }, `
  ....RRRR..
  ....RRRRR.
  ....RRRR..
  ....N.....
  ....N.....
  ....N.....
  ....N.....
  GGGGNGGGGG
  GGGGGGGGGG
  NNNNNNNNNN`)

// ---- classi dell'edificio: lo stesso capannone, dal rudere al polo innovativo
// Fatiscente: tetto arrugginito con un buco, finestra rotta, portone di legno
dotazione("c_fat", {}, `
  ..........
  ..........
  .OOO.OOOO.
  OOOO.OOOOO
  NNNNNNNNNN
  NKNNNNNDNN
  NNNNNNNNNN
  NNMMMMMNNN
  NNMKMMMNNN
  NNMMMMMNNN`)
// Vecchio: muri color crema, tetto marrone e la ciminiera
dotazione("c_vec", { tieni: "C" }, `
  .......M..
  .......M..
  .NNNNNNMN.
  NNNNNNNNNN
  CCCCCCCCCC
  CLCCCCCCLC
  CCCCCCCCCC
  CCNNNNNNCC
  CCNnNnNnCC
  CCNNNNNNCC`)
// Standard: il capannone grigio della zona industriale
dotazione("c_std", { tieni: "S" }, `
  ..........
  ..........
  .DDDDDDDD.
  DDDDDDDDDD
  SSSSSSSSSS
  SLLSSSSLLS
  SSSSSSSSSS
  SSDDDDDDSS
  SSDdDdDdSS
  SSDDDDDDSS`)
// Moderno: bianco con la fascia verde acqua e tre ribalte
dotazione("c_mod", { tieni: "W" }, `
  ..........
  ..........
  TTTTTTTTTT
  WWWWWWWWWW
  WLLLLLLLLW
  WWWWWWWWWW
  WWWWWWWWWW
  WDDWDDWDDW
  WDDWDDWDDW
  WWWWWWWWWW`)
// Innovativo: pannelli sul tetto, vetrate e il prato davanti
dotazione("c_inn", { tieni: "W" }, `
  BbBbBbBbBb
  BBBBBBBBBB
  PPPPPPPPPP
  WLLLLLLLLW
  WLLLLLLLLW
  WWWWWWWWWW
  WDDWDDWDDW
  WDDWDDWDDW
  WWWWWWWWWW
  GGGGGGGGGG`)

foglio("foglio")

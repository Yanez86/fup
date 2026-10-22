// Icone delle policy aziendali (12×12, sul foglio giallino del regolamento 16×16): tela 10×10 più il contorno.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/policy.px.js foglio
include("comune.px.js", { palette: true })

// Zero straordinario: l'orologio alle cinque, sbarrato
policy("zerostra", { tieni: "W", dopo: [grid(1, 1, `
  ......RR
  .....RR.
  ....RR..
  ...RR...
  ..RR....
  .RR.....
  RR......`)] }, `
  ...WWWW...
  .WWWWWWWW.
  .WWWKWWWW.
  WWWWKWWWWW
  WWWWKWWWWW
  WWWWKKWWWW
  WWWWWWKWWW
  .WWWWWWKW.
  .WWWWWWWW.
  ...WWWW...`)
// Sabato obbligatorio: il calendario con la S
policy("sabato", { fascia: false }, `
  ..K....K..
  RRKRRRRKRR
  RRRRRRRRRR
  WWWWWWWWWW
  WWWKKKKWWW
  WWWKWWWWWW
  WWWKKKKWWW
  WWWWWWKWWW
  WWWKKKKWWW
  SSSSSSSSSS`)
// Telefoni nell'armadietto: il telefono chiuso col lucchetto
policy("telefoni", { tieni: "L" }, `
  DDDDDD....
  DLLLLD....
  DLLLLD....
  DLLLLD....
  DLLLLD....
  DLLLLD.SS.
  DLLLLKS..S
  DDDDKYYYYY
  ....KYYKYY
  ....KYYYYY`)
// Doppia spunta in uscita: due spunte
policy("spunta", {}, `
  ......GG..
  .....GG...
  GG..GG....
  .GGGG.....
  ..GG......
  ........GG
  .......GG.
  ..GG..GG..
  ...GGGG...
  ....GG....`)
// Niente cooperative: il cartellino aziendale col proprio dipendente
policy("nocoop", {}, `
  ....SS....
  .OOOSSOOO.
  .OOOOOOOO.
  .WWWWWWWW.
  .WNNNWWWW.
  .WFFFWjjW.
  .WFFFWWWW.
  .WDDDWjjW.
  .WWWWWWWW.
  .WWWWWWWW.`)
// Spending review: le forbici
policy("spending", {}, `
  SS......SS
  .SS....SS.
  ..SS..SS..
  ...SSSS...
  ....SS....
  ...RRRR...
  .RRR..RRR.
  RR.R..R.RR
  RRRR..RRRR
  .RR....RR.`)
// Il cliente ha sempre ragione: la corona
policy("cliente", { mx: true }, `
  .....
  Y...Y
  YY..Y
  YYY.Y
  YYYYY
  YYRYB
  YYYYY
  YYYYY`)
// Rispondiamo entro 2 ore: la busta e il cronometro
policy("dueore", { tieni: "W" }, `
  ......OOO.
  .....OWKWO
  .....OWKKO
  WWWWWOWWWO
  WjWWWKOOO.
  WWjWjWWW..
  WWWjWWWW..
  WWWWWWWW..
  WWWWWWWW..`)
// Limite 80 all'ora per i bilici: il cartello col bordo rosso (tela intera, contorno a mano)
policy("limite80", { contorno: false, fascia: false }, `
  ...KKKKKK...
  ..KRRRRRRK..
  .KRRWWWWRRK.
  KRRWWWWWWRRK
  KRWWWWWWWWRK
  KRWWWWWWWWRK
  KRWWWWWWWWRK
  KRWWWWWWWWRK
  KRRWWWWWWRRK
  .KRRWWWWRRK.
  ..KRRRRRRK..
  ...KKKKKK...`,
  grid(3, 3, `
  KKK.KKK
  K.K.K.K
  KKK.K.K
  K.K.K.K
  KKK.KKK`))
// Smart working in sede: il portatile con la casetta sullo schermo
policy("smart", { mx: true, tieni: "L", fascia: false }, `
  .DDDD
  .DLLR
  .DLRR
  .DRRR
  .DLWW
  .DLWN
  .DDDD
  SSSSS
  sssss`)
// Rotazione delle mansioni: due frecce in cerchio
policy("rotazione", {}, `
  ...OOOO...
  .OOOOOOOO.
  OOO....OO.
  OO....OOOO
  .......OO.
  .BB.......
  BBBB....BB
  .BB....BBB
  .BBBBBBBB.
  ...BBBB...`)
// Settimana corta: ombrellone e sole
policy("corta", {}, `
  ..RWWWR.YY
  .RRWWWRRYY
  RRRWWWRRR.
  ....N.....
  ....N.....
  ....N.....
  ....N.....
  ....N.....
  ..qqqqqq..
  qqqqqqqqqq`)
// Linea dura: il pugno chiuso
policy("lineadura", {}, `
  .FF.FF.FF.
  FFFfFFfFFF
  FFFfFFfFfF
  FFFfFFfFfF
  fffffFFFFF
  FFFFFfFFFF
  FFFFFFFFFF
  .FFFFFFFF.
  ..DDDDDD..
  ..DDDDDD..`)
// Porte aperte: la porta socchiusa con la luce dentro
policy("porte", {}, `
  DDDDDDD...
  DYYYYYNN..
  DYYYYYNNN.
  DYYYYYNNNN
  DYYYYYNNYN
  DYYYYYNNNN
  DYYYYYNNNN
  DYYYYYNNNN
  DYYYYYNNN.
  DDDDDDNN..`)
// Premio di presenza: la medaglia col nastro
policy("presenza", { dopo: [grid(3, 6, `
  ...y
  y.y.
  .y..`)] }, `
  RRR....BBB
  .RRR..BBB.
  ..RRRBBB..
  ...RRBB...
  ...YYYY...
  ..YYYYYY..
  ..YYYYYY..
  ..YYYYYY..
  ..YYYYYY..
  ...YYYY...`)
// Crumiri in appalto: il pulmino del fornitore
policy("crumiri", {}, `
  ..........
  OOOOOOOO..
  OLLOLLOLO.
  OLLOLLOLLO
  OOOOOOOOOO
  OOOOOOOOOO
  OOOOOOOOOO
  .DD...DD..
  .DD...DD..`)
// Corso sicurezza obbligatorio: il casco giallo
policy("sicurezza", { mx: true }, `
  .....
  ...YY
  ..YYY
  .YYYy
  .YYYy
  .YYYy
  YYYYY
  YYYYY`)

foglio("foglio", 6)

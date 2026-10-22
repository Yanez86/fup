// Tecnologie degli alberi Certificazioni (scudo azzurro) e Welfare (quadrato smussato rosso): tela 10×10, icona 12×12.
// Nelle certificazioni lo scudo si stringe in basso: il disegno sta in alto e si restringe verso la punta.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/tecnologie_2.px.js foglio
include("comune.px.js", { palette: true })

// ================================================================ certificazioni
// HACCP: cappello da cuoco bianco con le pieghe
tecnologia("haccp", "cert", { fascia: false }, `
  .WW.WW.WW.
  WWWsWWsWWW
  WWWWWWWWWW
  SWWWWWWWWS
  .SSSSSSSS.
  ..WWWWWW..
  ..WsWWsW..
  ..SSSSSS..
  ..........
  ..........`)
// Catena del freddo: fiocco di neve
tecnologia("freddo", "cert", { fascia: false }, `
  ....BB....
  .B..BB..B.
  ..B.BB.B..
  .BBBBBBBB.
  .BBBBBBBB.
  ..B.BB.B..
  .B..BB..B.
  ....BB....
  ..........
  ..........`)
// ISO 9001: medaglia d'oro col nastro e la spunta
tecnologia("iso", "cert", { fascia: false, dopo: [grid(3, 4, `
  ...y
  y.y.
  .y..`)] }, `
  RRR....RRR
  .RRR..RRR.
  ..RRRRRR..
  ...YYYY...
  ..YYYYYY..
  ..YYYYYY..
  ..YYYYYY..
  ..yYYYYy..
  ...yyyy...
  ..........`)
// Buone pratiche per i farmaci: croce verde della farmacia, accesa
tecnologia("gdp", "cert", { fascia: false }, `
  ...GGGG...
  ...GhhG...
  .GGGhhGGG.
  .GhhhhhhG.
  .GhhhhhhG.
  .ggGhhGgg.
  ...GhhG...
  ...gggg...
  ..........
  ..........`)
// Ambiente ISO 14001: germoglio con due foglie
tecnologia("iso14001", "cert", { fascia: false }, `
  .......GGG
  .....GGGGG
  GG...GGGG.
  GGGG.GGG..
  .GGGGGG...
  ...GGG....
  ....GG....
  ....GG....
  ....gg....
  ..........`)
// Sicurezza ISO 45001: testa d'operaio col casco arancione
tecnologia("iso45001", "cert", { fascia: false }, `
  ...OOOO...
  ..OOOOOO..
  .OOOOOOOO.
  oooooooooo
  .FFFFFFFF.
  .FFKFFKFF.
  .FFKFFKFF.
  ..FFFFFF..
  ...ffff...
  ..........`)
// Merci pericolose ADR: rombo rosso col simbolo della fiamma
tecnologia("adr", "cert", { dopo: [grid(3, 2, `
  .W..
  WW.W
  WWWW
  WWWW
  .WW.`)] }, `
  ....RR....
  ...RRRR...
  ..RRRRRR..
  .RRRRRRRR.
  RRRRRRRRRR
  .RRRRRRRR.
  ..RRRRRR..
  ...RRRR...
  ....RR....
  ..........`)
// Bollino Banchina Sicura: lucchetto d'acciaio
tecnologia("banchina", "cert", { dopo: [grid(4, 4, `
  KK
  KK
  KK`)] }, `
  ...DDDD...
  ..D....D..
  ..D....D..
  .SSSSSSSS.
  .SSSSSSSS.
  .SSSSSSSS.
  .SSSSSSSS.
  ..SSSSSS..
  ..........
  ..........`)
// Operatore doganale autorizzato: timbro di approvazione
tecnologia("aeo", "cert", { fascia: false }, `
  ....RR....
  ...RRRR...
  ...RRRR...
  ....rr....
  .NNNNNNNN.
  .NNNNNNNN.
  .nnnnnnnn.
  ..DDDDDD..
  ..........
  ..........`)
// Deposito fiscale e doganale: botte cerchiata col sigillo di ceralacca
tecnologia("doganale", "cert", { fascia: false }, `
  ..NNNNNN..
  .DDDDDDDD.
  .NnNRRNnN.
  .NnRRRRnN.
  .NnRRRRnN.
  .NnNRRNnN.
  .DDDDDDDD.
  ..nnnnnn..
  ..........
  ..........`)
// Parità di genere: simbolo femminile viola con l'uguale
tecnologia("parita", "cert", { dopo: [grid(3, 2, `
  WWWW
  ....
  WWWW`)] }, `
  ..PPPPPP..
  .PPPPPPPP.
  .PPPPPPPP.
  .PPPPPPPP.
  .PPPPPPPP.
  .PPPPPPPP.
  ..PPPPPP..
  ....PP....
  ...PPPP...
  ....PP....`)

// ================================================================ welfare
// Boccioni d'acqua: erogatore col boccione rovesciato e i rubinetti caldo e freddo
tecnologia("acqua", "wel", { dopo: [grid(2, 6, `
  RR..BB`)] }, `
  ..LLLLLL..
  ..LLLLLL..
  ..LLLLLL..
  ...LLLL...
  ....LL....
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.`)
// Servizio frutta: cassetta di legno con la mela e la banana
tecnologia("frutta", "wel", { fascia: false }, `
  ..nGG...y.
  .RRRR...YY
  RRRRRR.YYY
  RRRRRKYYY.
  RRRRKYYY..
  NNNNNNNNNN
  NNNNNNNNNN
  nnnnnnnnnn
  NNNNNNNNNN
  nnnnnnnnnn`)
// Mensa aziendale: piatto di spaghetti al pomodoro con la forchetta piantata
tecnologia("mensa", "wel", { fascia: false }, `
  ......SS..
  ......SS..
  ...RRRSS..
  ..YRRRRY..
  .YYYRRYYY.
  .yyyyyyyy.
  WWWWWWWWWW
  .WWWWWWWW.
  ..SSSSSS..
  ..........`)
// Pulmini per i dipendenti: pulmino giallo di fianco
tecnologia("pulmino", "wel", {}, `
  ..........
  YYYYYYYY..
  YLLYLLYLL.
  YLLYLLYLLL
  YYYYYYYYYY
  YYYYYYYYYY
  YYYYYYYYYY
  .DD....DD.
  .DD....DD.
  ..........`)
// Asilo aziendale: carrozzina col tettuccio
tecnologia("asilo", "wel", { fascia: false }, `
  .BBB......
  BBBBB....D
  BBBBBB..D.
  BBBBBB.D..
  bbbbbbbbb.
  BBBBBBBBB.
  .bbbbbbb..
  ..........
  .DD...DD..
  .DD...DD..`)
// Area cani: muso di cane con le orecchie a penzoloni e la lingua fuori
tecnologia("cani", "wel", { fascia: false }, `
  ..NNNNNN..
  MMNNNNNNMM
  MMNNNNNNMM
  MMNKNNKNMM
  MMNKNNKNMM
  MMNCCCCNMM
  MM.CKKC.MM
  .M.CCCC.M.
  ....RR....
  ..........`)
// Orto aziendale: carota che spunta dalla terra e un germoglio
tecnologia("orto", "wel", {}, `
  .GG.GG....
  ..GGGG....
  ...GG...G.
  ..OOOO.GGG
  ..OOOO.GGG
  ...OO...G.
  NNNNNNNNNN
  NNNNNNNNNN
  NNNNNNNNNN
  NNNNNNNNNN`)
// Macchinette del caffè: tazzina fumante sul piattino
tecnologia("caffe", "wel", { fascia: false }, `
  ..........
  ..........
  ..........
  .WWWWWW...
  .WMMMMWWW.
  .WWWWWWWW.
  ..SSSSS...
  WWWWWWWWWW
  .SSSSSSSS.
  ..........`,
  layer("linee", { outline: false }, grid(0, 0, `
  ...s..s...
  ..s..s....`)))
// Sala pausa arredata: divanetto coi braccioli
tecnologia("relax", "wel", { fascia: false }, `
  ..........
  .TTTTTTTT.
  .TTTTTTTT.
  TTTTTTTTTT
  TTttttttTT
  TTtTTTTtTT
  TTtTTTTtTT
  tttttttttt
  .N......N.
  ..........`)
// Colonnine di ricarica: colonnina verde col fulmine, il cavo e la spina
tecnologia("colonnine", "wel", { dopo: [grid(2, 4, `
  ..YY
  .YY.
  YYYY
  .YY.
  YY..`)] }, `
  .GGGGGG...
  .GuuuuG...
  .GuuuuG.SS
  .GGGGGG.SS
  .GGGGGG...
  .GGGGGG...
  .GGGGGG...
  .GGGGGG...
  .GGGGGG...
  .GGGGGG...`,
  layer("linee", { outline: false }, grid(7, 4, `
  .K
  .K
  .K
  .K
  K.`)))
// Spogliatoi e docce: soffione della doccia con l'acqua che scende
tecnologia("spogliatoi", "wel", { fascia: false }, `
  SSSSSS....
  SSSSSS....
  ....SS....
  ..SSSSSS..
  .SSSSSSSS.
  .ssssssss.
  ..........
  ..........
  ..........
  ..........`,
  layer("linee", { outline: false }, grid(0, 7, `
  .B.B..B.B.
  .B.B..B.B.
  B..B..B..B`)))
// Lavanderia delle divise: lavatrice con l'oblò
tecnologia("lavanderia", "wel", { fascia: false }, `
  WWWWWWWWWW
  WjjWWWWDDW
  SSSSSSSSSS
  WWWDDDDWWW
  WWDLLLLDWW
  WWDBBBBDWW
  WWDBBBBDWW
  WWWDDDDWWW
  WWWWWWWWWW
  SSSSSSSSSS`)
// Palestra aziendale: manubrio coi dischi
tecnologia("palestra", "wel", {}, `
  ..........
  ..........
  .DD....DD.
  DDD....DDD
  DDDSSSSDDD
  DDDSSSSDDD
  DDD....DDD
  .DD....DD.
  ..........
  ..........`)
// Presidio medico: valigetta del pronto soccorso con la croce rossa
tecnologia("presidio", "wel", { dopo: [grid(2, 3, `
  ..RR..
  ..RR..
  RRRRRR
  RRRRRR
  ..RR..
  ..RR..`)] }, `
  ...DDDD...
  ...D..D...
  .WWWWWWWW.
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  .WWWWWWWW.`)
// Sportello d'ascolto: fumetto col cuore
tecnologia("ascolto", "wel", { dopo: [grid(2, 1, `
  RR..RR
  RRRRRR
  .RRRR.
  ..RR..`)] }, `
  .WWWWWWWW.
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  WWWWWWWWWW
  .WWWWWWWW.
  ..WWW.....
  ..WW......
  ..W.......`)
// Corsi di italiano: libro con la copertina tricolore
tecnologia("italiano", "wel", { fascia: false }, `
  gGGWWWRRR.
  gGGWWWRRRC
  gGGWWWRRRC
  gGGWWWRRRC
  gGGWWWRRRC
  gGGWWWRRRC
  gGGWWWRRRC
  gggSSSrrrC
  .qqqqqqqqq
  ..........`)
// Raffrescatori in reparto: ventilatore con le pale
tecnologia("clima", "wel", { fascia: false }, `
  ...SSSS...
  ..SBBLLS..
  .SLBBLBBS.
  .SLLDDBBS.
  .SBBDDLLS.
  .SBBLBBLS.
  ..SLLBBS..
  ...SSSS...
  ....DD....
  ..DDDDDD..`)
// Lavoro agile: portatile con la casetta sullo schermo
tecnologia("agile", "wel", { fascia: false }, `
  ..........
  .DDDDDDDD.
  .DLLRRLLD.
  .DLRRRRLD.
  .DRRRRRRD.
  .DLWWWWLD.
  .DLWNNWLD.
  .DDDDDDDD.
  SSSSSSSSSS
  ssssssssss`)
// Settimana corta: ombrellone a strisce piantato nella sabbia
tecnologia("corta", "wel", { fascia: false }, `
  ...WRRW...
  .RWWRRWWR.
  RRWWRRWWRR
  rrSSrrSSrr
  ....NN....
  ....NN....
  ....NN....
  ....NN....
  .YYYYYYYY.
  yyyyyyyyyy`)

foglio("foglio")

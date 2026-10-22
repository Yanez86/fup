// Icone delle tecnologie degli alberi Logistica (log), Sviluppo aziendale (org) e Mercato (mkt): tela 10×10, icona 12×12
// dentro la cornice dell'albero (quadrato arancione, ottagono viola, tondo verde).
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/tecnologie_1.px.js foglio
include("comune.px.js", { palette: true })

// ================================================================ Logistica (quadrato arancione)
// Lettori barcode: etichetta a barre attraversata dal laser rosso
tecnologia("barcode", "log", { tieni: "W" }, `
  ..........
  WWWWWWWWWW
  WKKWKWKKWW
  WKKWKWKKWW
  RRRRRRRRRR
  WKKWKWKKWW
  WKKWKWKKWW
  WKKWKWKKWW
  WWWWWWWWWW
  ..........`)
// Formazione strutturata: lavagna verde sul cavalletto con gli appunti in gesso
tecnologia("formazione", "log", { dopo: [grid(2, 2, `
  WWW.WW
  ......
  WW.WWW`)] }, `
  NNNNNNNNNN
  NGGGGGGGGN
  NGGGGGGGGN
  NGGGGGGGGN
  NGGGGGGGGN
  NGGGGGGGGN
  NNNNNNNNNN
  .N......N.
  .N......N.
  .N......N.`)
// Telematica GPS: il segnaposto rosso piantato sulla mappa
tecnologia("gps", "log", { mx: true, dopo: [grid(4, 3, `
  W
  W`)] }, `
  ...RR
  .RRRR
  .RRRR
  RRRRR
  RRRRR
  .RRRR
  ..RRR
  ...RR
  ....R
  ....R`)
// WMS di base: monitor con la pianta del magazzino, un posto pallet acceso
tecnologia("wms", "log", {}, `
  DDDDDDDDDD
  DuuduuduuD
  DddddddddD
  DuudYYduuD
  DddddddddD
  DuuduuduuD
  DddddddddD
  DDDDDDDDDD
  ....SS....
  ..SSSSSS..`)
// Sicurezza muletti: muletto col lampeggiante blu
tecnologia("anticoll", "log", {}, `
  ......BB..
  ..S...BB..
  ..S.DDDDDD
  ..S.D....D
  ..S.YYYYYY
  ..SYYYYYYY
  ..SYYYYYYY
  ..SDDD.DDD
  ..SDSD.DSD
  SSSDDD.DDD`)
// Pianificazione rotte: palo con i cartelli delle direzioni
tecnologia("rotte", "log", { dopo: [grid(1, 2, `
  WW.WWW`), grid(3, 6, `
  WWW.WW`)] }, `
  ....NN....
  BBBBBBBBB.
  BBBBBBBBBB
  BBBBBBBBB.
  ....NN....
  .GGGGGGGGG
  GGGGGGGGGG
  .GGGGGGGGG
  ....NN....
  ....NN....`)
// Radiofrequenza: terminale portatile con il segnale radio
tecnologia("rf", "log", {}, `
  ..........
  ..........
  DDDDDD....
  DhhhhD....
  DhhhhD....
  DhhhhD....
  DDDDDD....
  DSDSDD....
  DDDDDD....
  DSDSDD....`,
  layer("linee", { outline: false }, grid(6, 0, `
  ..b.
  ...b
  .b.b
  .b.b
  .b.b
  ...b
  ..b.`)))
// Magazzino verticale: torre automatica a cassetti con la freccia su e giù
tecnologia("verticale", "log", {}, `
  SSSSSS..Y.
  SOOBBS.YYY
  SssssS..Y.
  SGGRRS..Y.
  SssssS..Y.
  SBBYYS..Y.
  SssssS..Y.
  SKKKKS..Y.
  SOOOOS.YYY
  SSSSSS..Y.`)
// Sinergia in pianificazione: camion carico di colli di clienti diversi
tecnologia("sinergia", "log", {}, `
  ..........
  RRKBB.....
  RRKBB.OOO.
  KKKKK.OOLL
  GGKYY.OOLL
  GGKYY.OOOO
  SSSSSSSSSS
  .DDD..DDD.
  .DSD..DSD.
  .DDD..DDD.`)
// Pick-to-light: scaffale a cassette, la luce accesa su quella giusta
tecnologia("ptl", "log", {}, `
  DDDDDDDDDD
  DBBDBBDBBD
  DBBDBBDBBD
  DssDYYDssD
  DDDDDDDDDD
  DBBDBBDBBD
  DBBDBBDBBD
  DssDssDssD
  DDDDDDDDDD
  D........D`)
// Robot mobili (AMR): robottino arancione che solleva lo scaffale e lo porta in giro
tecnologia("amr", "log", {}, `
  NNNN.BBBB.
  NNNN.BBBB.
  SSSSSSSSSS
  S.OOOOOO.S
  S.OuOOuO.S
  S.OuOOuO.S
  ..OOOOOO..
  ..DD..DD..
  ..DD..DD..
  ..........`)

// ================================================================ Sviluppo aziendale (ottagono viola)
// Gestionale amministrativo: portatile con l'euro sullo schermo
tecnologia("gestionale", "org", { tieni: "W", dopo: [grid(2, 0, `
  ...GGG
  ..G...
  GGGGG.
  .G....
  GGGGG.
  ..G...
  ...GGG`)] }, `
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .DDDDDDDD.
  SSSSSSSSSS
  .ssssssss.`)
// Regolamento aziendale: le tavole della legge (aziendale)
tecnologia("regolamento", "org", { mx: true, dopo: [grid(1, 2, `
  ss
  ..
  ss
  ..
  ss`)] }, `
  .SS..
  SSSS.
  SSSS.
  SSSS.
  SSSS.
  SSSS.
  SSSS.
  SSSS.
  SSSS.
  .....`)
// Ufficio del personale: una persona col più verde (si assume)
tecnologia("hr", "org", { dopo: [grid(4, 5, `
  .KGGG.
  KGGWGG
  KGWWWG
  KGGWGG
  .KGGG.`)] }, `
  .NNNN.....
  NNNNNN....
  NFFFFN....
  FKFFKF....
  FKFFKF....
  FFFFFF....
  .FFFF.....
  BBBBBB....
  BBBBBB....
  .BBBBB....`)
// Struttura direzionale: la poltrona (rossa) da direttore
tecnologia("direzione", "org", { mx: true, dopo: [grid(2, 4, `
  rrr
  r..
  r..
  r..`)] }, `
  ..RRR
  .RRRR
  .RRRR
  RRRRR
  RRRRR
  RRRRR
  RRRRR
  RRRRR
  RRRRR
  .N...`)
// Piattaforma welfare: cartellino della convenzione col cuore
tecnologia("welfare2", "org", { dopo: [grid(4, 3, `
  RR.RR
  RRRRR
  RRRRR
  .RRR.
  ..R..`)] }, `
  ..........
  ...YYYYYYY
  ..YYYYYYYY
  .YYYYYYYYY
  YYKYYYYYYY
  YYKYYYYYYY
  .YYYYYYYYY
  ..YYYYYYYY
  ...YYYYYYY
  ..........`)
// Controllo di gestione: torta dei costi con una fetta che scappa
tecnologia("controllo", "org", {}, `
  ......R...
  ...GG.RRR.
  .GGGG.RRRR
  GGGGG.RRRR
  GGGGG.....
  GGGGGYYYY.
  GGGGGYYYY.
  GGGGGYYYY.
  .GGGGYYY..
  ...GGY....`)
// Academy aziendale: tocco da laureato sopra il libro
tecnologia("academy", "org", {}, `
  ....DD....
  ..DDDDDD..
  DDDDDDDDDD
  ..DDDDDD.Y
  ..DDDDDD.Y
  .........Y
  .RRRRRRRR.
  RCCCCCCCCR
  RCCCCCCCCR
  .RRRRRRRR.`)
// Relazioni sindacali: due nuvolette, l'azienda (bianca) e il sindacato (rossa)
tecnologia("relsind", "org", { tieni: "W", dopo: [grid(1, 1, `
  sssss
  ss.ss`), grid(4, 6, `
  WW.W`)] }, `
  .WWWWW....
  WWWWWWW...
  WWWWWWW...
  .WWWWW....
  .W........
  ...RRRRR..
  ..RRRRRRR.
  ..RRRRRRR.
  ...RRRRR..
  .......R..`)
// Vendor management: cartellina dell'audit con le spunte e la croce
tecnologia("vendor", "org", { tieni: "W", dopo: [grid(2, 3, `
  GG.ss.
  ......
  RR.ss.
  ......
  GG.ss.`)] }, `
  ...SSSS...
  .NNSSSSNN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NWWWWWWN.
  .NNNNNNNN.`)
// Comitato paritetico: bilancia in pari, piatto blu dell'azienda e piatto rosso del sindacato
tecnologia("paritetico", "org", {}, `
  ....YY....
  YYYYYYYYYY
  .S..YY..S.
  .S..YY..S.
  BBB.YY.RRR
  BBB.YY.RRR
  ....YY....
  ....YY....
  ..YYYYYY..
  .YYYYYYYY.`)
// Contenimento sindacale: il consulente in giacca scura e occhiali neri
tecnologia("contenim", "org", { mx: true }, `
  ..MMM
  .MMMM
  .MFFF
  KKKKK
  .FKKF
  .FFFF
  ..FFF
  DDDWW
  DDDWK
  DDDDK`)
// Contrattazione di secondo livello: stretta di mano tra azienda (manica blu) e sindacato (manica rossa)
tecnologia("secondo", "org", {}, `
  ..........
  ..........
  BBB....RRR
  BBBFF.FRRR
  BBFFFFFFRR
  BBFFfFfFRR
  BBBFfFfFRR
  ...FFFFF..
  ..........
  ..........`)
// Talpa nel sindacato: la talpa che sbuca dalla sua montagnola
tecnologia("talpa", "org", { mx: true }, `
  ..DDD
  .DDDD
  DDKDD
  DDKDD
  DDDDF
  FDDDF
  FFDDD
  .NNNN
  NNNNN
  .NNNN`)

// ================================================================ Mercato (tondo verde)
// Ufficio commerciale: il telefono rosso dei venditori
tecnologia("commerciale", "mkt", { dopo: [grid(3, 5, `
  .WW.
  WKKW
  WKKW
  .WW.`)] }, `
  ..........
  .RRRRRRRR.
  .RRR..RRR.
  ..........
  ..RRRRRR..
  .RRRRRRRR.
  RRRRRRRRRR
  .RRRRRRRR.
  .RRRRRRRR.
  ..........`)
// EDI con i clienti: due documenti che si scambiano da soli
tecnologia("edi", "mkt", { tieni: "W" }, `
  ..........
  WW.....WW.
  WWW....WWW
  ssW..G.ssW
  WWWGGGGWWW
  ssW..G.ssW
  WWW.B..WWW
  ssWBBBBssW
  WWW.B..WWW
  ..........`)
// Marketing e fiere: il megafono
tecnologia("marketing", "mkt", {}, `
  ..........
  .....RR...
  ...RRRR..Y
  SSRRRRR...
  SSRRRRR.YY
  SSRRRRR...
  ...RRRR..Y
  ...N.RR...
  ...N......
  ..........`)
// Key account management: la chiave del cliente, con l'impugnatura a cuore
tecnologia("kam", "mkt", {}, `
  ..........
  ..........
  .YY.......
  YYYY......
  YYYYY.....
  .YYYYYYYYY
  YYYYY.Y.Y.
  YYYY......
  .YY.......
  ..........`)
// Portale clienti: finestra del browser con il collo e la barra della spedizione
tecnologia("portale", "mkt", { tieni: "W", dopo: [grid(2, 3, `
  NNN...
  NNN.R.
  NNN...
  ......
  GGGGss`)] }, `
  ..........
  .BBBBBBBB.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  .WWWWWWWW.
  ..........`)
// Accordi quadro nazionali: contratto con la coccarda tricolore
tecnologia("accordi", "mkt", { tieni: "W", dopo: [grid(2, 2, `
  sss
  ...
  sss`), grid(4, 4, `
  .RRR.
  RWWWR
  RWGWR
  RWWWR
  .RRR.`)] }, `
  ..........
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  .WWWWWW...
  ..........`)
// Logistica e-commerce: il pacco col cursore del mouse che lo compra
tecnologia("ecom", "mkt", { dopo: [grid(4, 3, `
  K....
  KK...
  KWK..
  KWWK.
  KWWWK
  KWKK.
  KK...`)] }, `
  ..........
  .NNNCNNN..
  .NNNCNNN..
  .NNNNNNN..
  .NNNNNNN..
  .NNNNNNN..
  .NNNNNNN..
  .NNNNNNN..
  ..........
  ..........`)

foglio("foglio")

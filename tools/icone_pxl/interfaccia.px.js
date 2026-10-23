// Icone dell'interfaccia: abilità (10×10), voci del menu (16×16), lenti della mappa e pulsanti (16×16).
// Si disegna sulla tela senza contorno (8×8 per le abilità, 14×14 per il resto): il contorno K lo aggiunge comune.px.js.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/interfaccia.px.js foglio
include("comune.px.js", { palette: true })

// ================================================================ abilità (colore fisso per ognuna)
// Operazioni: ingranaggio arancione
abilita("op", { mx: true }, `
  ..O.
  .OOO
  OOOO
  .OO.
  .OO.
  OOOO
  .OOO
  ..O.`)
// Precisione: bersaglio azzurro col centro rosso
abilita("prec", { mx: true, tieni: "W" }, `
  ..BB
  .BWW
  BWWB
  BWBR
  BWBR
  BWWB
  .BWW
  ..BB`)
// Negoziazione: moneta con l'euro
abilita("neg", { fascia: false }, `
  ..YYYY..
  .YYYyyY.
  YYYyYYYY
  YyyyyYYY
  YYYyYYYY
  YyyyyYYY
  .YYYyyY.
  ..YYYY..`)
// Leadership: bandiera rossa a coda di rondine
abilita("lead", {}, `
  Y.......
  SRRRRRRR
  SRRRRRRR
  SRRRRR..
  SRRRRRRR
  SRRRRRRR
  S.......
  S.......`)
// Amministrazione: calcolatrice verde
abilita("amm", { fascia: false }, `
  GGGGGGGG
  GLLLLLLG
  GLLLLLLG
  GGGGGGGG
  GWGWGWRG
  GGGGGGRG
  GWGWGWRG
  gggggggg`)
// Innovazione: lampadina viola
abilita("inn", { mx: true }, `
  ..PP
  .PPP
  PPPY
  PPPY
  .PPP
  ..SS
  ..ss
  ...S`)

// ================================================================ menu
// Azienda e CEO: il capo in giacca e cravatta
menu("azienda", { mx: true, fascia: false }, `
  ....NNN
  ..NNNNN
  .NNNNNN
  .NNFFFF
  .NFFFFF
  .NFFKFF
  ..FFKFF
  ..fFFFF
  ...fFFF
  .....FF
  ..DDDWW
  .DDDDWR
  DDDDdDR
  ddddddr`)
// Magazzini: capannone col tetto rosso e due baie di carico
menu("magazzini", { mx: true }, `
  ......R
  ....RRR
  ..RRRRR
  RRRRRRR
  .SSSSSS
  .SSSSSS
  .SddddS
  .SDDDDS
  .SddddS
  .SDDDDS
  .SddddS
  .SDDDDS
  .SddddS`)
// Clienti: valigetta
menu("clienti", { mx: true }, `
  .......
  ....NNN
  ....N..
  NNNNNNN
  NNNNNNN
  NNNNNNN
  nnnnnYY
  NNNNNYY
  NNNNNNN
  NNNNNNN
  NNNNNNN
  NNNNNNN`)
// Ufficio traffico: semaforo
menu("traffico", { mx: true }, `
  ...DDDD
  ..DDDDD
  ..DDDRR
  ..DDRRR
  ..DDDRR
  ..DDDDD
  ..DDDYY
  ..DDYYY
  ..DDDYY
  ..DDDDD
  ..DDDGG
  ..DDGGG
  ..DDDGG
  ..DDDDD`)
// Gare d'appalto: capitolato con il sigillo di ceralacca
menu("gare", { tieni: "W" }, `
  .WWWWWWW......
  .WWWWWWWS.....
  .WWjjjjWSS....
  .WWWWWWWWWW...
  .WWjjjjjjWW...
  .WWWWWWWWWW...
  .WWjjjjjjWW...
  .WWWWWWWWWW...
  .WWjjjjRRRR...
  .WWWWWRRRRRR..
  .WWjjjRRYYRR..
  .WWWWWRRYYRR..
  .WWWWWRRRRRR..
  .......r..r...`)
// Personale: due operai col casco
menu("personale", {}, `
  ........OOOO..
  .......OOOOOO.
  .......OOOOOOO
  ..YYYY..FFFFF.
  .YYYYYY.FKFKF.
  YYYYYYYYFKFKF.
  .FFFFFF.FFFFF.
  .FKFFKF..FFF..
  .FKFFKF.GGGGGG
  .FFFFFF.GGGGGG
  ..FFFF..GGGGGG
  BBBBBBBBGGGGGG
  BBBBBBBBGGGGGG
  BBBBBBBBGGGGGG`)
// Direzione: organigramma
menu("direzione", {},
  `
  ....YYYYYY....
  ....YYYYYY....
  ....YYYYYY....
  ....YYYYYY....
  ..............
  ..............
  ..............
  ..............
  BBBB.OOOO.GGGG
  BBBB.OOOO.GGGG
  BBBB.OOOO.GGGG
  BBBB.OOOO.GGGG`,
  layer("linee", { outline: false }, rect(6, 4, 2, 3, "K"), rect(1, 6, 12, 1, "K"), rect(1, 7, 2, 1, "K"), rect(6, 7, 2, 1, "K"), rect(11, 7, 2, 1, "K")))
// Policy aziendali: cartellina col regolamento
menu("policy", { tieni: "W" }, `
  .....SSSS.....
  ..NNNSSSSNNN..
  ..NWWWWWWWWN..
  ..NWGWjjjjWN..
  ..NWWWWWWWWN..
  ..NWGWjjjjWN..
  ..NWWWWWWWWN..
  ..NWGWjjjjWN..
  ..NWWWWWWWWN..
  ..NWRWjjjWWN..
  ..NNNNNNNNNN..
  ..NNNNNNNNNN..
  ..NNNNNNNNNN..`)
// Report KPI: foglio di calcolo con l'istogramma
menu("report", { tieni: "WS" }, `
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  SWWWWWWWWWWWWW
  SWWWWWWWWWWBBW
  SWWWWWWWWWWBBW
  SWWWWWWWOOWBBW
  SWWWWWWWOOWBBW
  SWWWWWWWOOWBBW
  SWWWGGWWOOWBBW
  SWWWGGWWOOWBBW
  SWWWGGWWOOWBBW
  SWWjjjjjjjjjjW
  SWWWWWWWWWWWWW`)
// Riepilogo dell'azienda: cruscotto con i riquadri
menu("riepilogo", { fascia: false }, `
  DDDDDDDDDDDDDD
  DddddddddddddD
  DdYYYYdhhhhhdD
  DdYYYYdhhhhhdD
  DddddddddddddD
  DdjjjjddddddBD
  DddddddddddBBD
  DdjjjddddOdBBD
  DddddddddOdBBD
  DddddddGdOdBBD
  DdddddGGdOdBBD
  DddddddddddddD
  DDDDDDDDDDDDDD
  dddddddddddddd`)
// Tecnologia: microchip
menu("tecnologia", { fascia: false }, `
  ...S.S..S.S...
  ...S.S..S.S...
  ..DDDDDDDDDD..
  SSDDDDDDDDDDSS
  ..DDLLLLLLDD..
  SSDDLBBBBLDDSS
  ..DDLBBBBLDD..
  ..DDLBBBBLDD..
  SSDDLBBBBLDDSS
  ..DDLLLLLLDD..
  SSDDDDDDDDDDSS
  ..dddddddddd..
  ...S.S..S.S...
  ...S.S..S.S...`)
// Espansione: magazzino nuovo col più verde
menu("espansione", {}, `
  ..........GG..
  ..........GG..
  ........GGGGGG
  ........GGGGGG
  ....R.....GG..
  ..RRRRR...GG..
  RRRRRRRRR.....
  .SSSSSSS......
  .SSSSSSS......
  .SSddddS......
  .SSDDDDS......
  .SSddddS......
  .SSDDDDS......
  .SSddddS......`)
// Enciclopedia: libro viola col punto di domanda
menu("enciclopedia", {}, `
  .ppPPPPPPPPP..
  .ppPPPPPPPPPP.
  .ppPPPYYYPPPP.
  .ppPPYPPPYPPP.
  .ppPPPPPPYPPP.
  .ppPPPPPYPPPP.
  .ppPPPPYPPPPP.
  .ppPPPPYPPPPP.
  .ppPPPPPPPPPP.
  .ppPPPPYPPPPP.
  .ppPPPPPPPPRP.
  .ppWWWWWWWWRW.
  .ppSSSSSSSSSS.
  ..............`)
// Il giornale
menu("giornale", { tieni: "WS" }, `
  ..............
  WWWWWWWWWWWWWW
  WKKKKKKKKKKKKW
  WKKKKKKKKKKKKW
  WWWWWWWWWWWWWW
  WSSSSSWjjjjjjW
  WSLLLSWWWWWWWW
  WSLLLSWjjjjjjW
  WSSSSSWWWWWWWW
  WWWWWWWjjjjjjW
  WjjjjjWWWWWWWW
  WWWWWWWjjjjjjW
  WWWWWWWWWWWWWW
  SSSSSSSSSSSSSS`)
// Classifica: coppa sul podio
menu("classifica", {}, `
  ....YYYYYY....
  ..YYYYYYYYYY..
  ..Y.YYYYYY.Y..
  ...YYYYYYYY...
  .....YYYY.....
  ......YY......
  .....YYYY.....
  ..............
  .....YYYY.....
  SSSS.YYYY.....
  SSSS.YYYY.OOOO
  SSSS.YYYY.OOOO
  SSSS.YYYY.OOOO`)
// Customer service: cuffia col microfono
menu("customer", {}, `
  ....DDDDDD....
  ..DDDDDDDDDD..
  .DDD......DDD.
  .DD........DD.
  RRRR......RRRR
  RRRR......RRRR
  RRRR......RRRR
  RRRR......RRRR
  RRRR......RRRR
  .DD...........
  .DD...........
  ..DD..........
  ...DDDDDRR....
  ........RR....`)
// Manager: candidato sotto la lente dell'head hunter
menu("manager", {}, `
  ...NNNNN......
  ..NNNNNNN.....
  ..NFFFFFN.....
  ..FFKFKFF.....
  ..FFKFKFF.....
  ..FFFFFFF.....
  ...FFFFF.SSSS.
  .....FF.SLLLLS
  DDDDWRWDSLLLLS
  DDDDDRDDSLLLLS
  DDDDDRDDSLLLLS
  DDDDDDDDDSSSSN
  DDDDDDDDDDD.NN
  DDDDDDDDDDD..N`)
// Certificazioni: scudo con la spunta
sprite("_scudo", { w: 14, h: 13, mx: true }, `
  BBBBBBB
  BBBBBBB
  BBBBBBB
  BBBBBBB
  BBBBBBB
  BBBBBBB
  BBBBBBB
  .BBBBBB
  .BBBBBB
  ..BBBBB
  ...BBBB
  ....BBB
  ......B`)
menu("certificazioni", { dopo: [grid(3, 3, `
  .......W
  ......WW
  W....WW.
  WW..WW..
  .WWWW...
  ..WW....`)] }, stamp("_scudo", 0, 0))
// Relazioni industriali: bandiera del sindacato che sventola
menu("sindacato", { dopo: [grid(2, 4, `
  WWW.WW.WWW
  ..........
  WWWW.WWW..`)] }, `
  N.............
  NRRRRR.......R
  NRRRRRRR..RRRR
  NRRRRRRRRRRRRR
  NRRRRRRRRRRRRR
  NRRRRRRRRRRRRR
  NRRRRRRRRRRRRR
  NRRRRRRRRRRRRR
  NRRRRRRR.RRRRR
  NRRRRR......RR
  N.............
  N.............
  N.............
  N.............`)

// ================================================================ lenti della mappa
// Mappa normale: cartina piegata in tre
lente("base", { fascia: false, dopo: [grid(9, 1, `
  .RRR.
  RRRRR
  RRCRR
  RRRRR
  .RRR.
  ..R..`)] }, `
  hhhhqhhhhqCCCC
  hhhhqhhhCqCCCC
  hhhCqhhCCqCCCC
  hhCCqhCCCqCCCC
  hCCCqCCCBqCCCC
  CCCCqCCBBqCCCC
  CCCCqCBBCqCCCC
  CCCCqBBCCqCCCC
  CCCBBBCCCqCCCC
  CCBBqCCCCqCCCC
  CBBCqCCCCqCCCC
  BBCCqCCCCqCCCC
  qqqqqqqqqqqqqq`)
// Province: le macchie colorate delle province
lente("prov", {}, `
  ..GGGGK.BBB...
  .GGGGGKBBBBBB.
  GGGGGGKBBBBBBB
  GGGGGKBBBBBBKK
  GGGGGKBBBBBKYY
  KKKKKKKKBBKYYY
  OOOOOKPPKKYYYY
  OOOOOKPPPKYYYY
  OOOOKPPPPPKYYY
  OOOOKPPPPPKKKK
  .OOOKPPPPKRRR.
  ..OOKPPPKRRR..
  ....KKKKRRR...
  ........RR....`)
// Viaggi: camion
lente("trips", {}, `
  ..............
  WWWWWWWWW.....
  WWWWWWWWW.OOO.
  WWWWWWWWW.OLLO
  WWWWWWWWW.OLLO
  WWWWWWWWW.OOOO
  WWWWWWWWW.OOOO
  WWWWWWWWW.OOOO
  SSSSSSSSSSSSSS
  .DDD.....DDD..
  .DSD.....DSD..
  .DDD.....DDD..`)
// Clima sindacale: quadrante verde, giallo e rosso con la lancetta
lente("clima", { tieni: "W" }, `
  ..............
  ..............
  .....YYYY.....
  ...GGYYYYRR...
  ..GGGWWWWRRR..
  .GGGWWWWWWRRR.
  .GGWWWWWWWKRR.
  GGGWWWWWWKKRRR
  GGWWWWWWKKWWRR
  GGWWWWWKKWWWRR
  GGWWWWDDDWWWRR
  DDDDDDDDDDDDDD`)

// ================================================================ pulsanti
// Produttività (10×10): pallet con la freccia che sale
pulsante("prod", 10, {}, `
  ...GG...
  ..GGGG..
  .GGGGGG.
  ...GG...
  ...GG...
  NNNNNNNN
  N..NN..N
  NNNNNNNN`)
// Opzioni: ingranaggio grigio
pulsante("opzioni", 16, { mx: true }, `
  ......S
  ..S..SS
  .SSSSSS
  ..SSSSS
  ..SSS..
  .SSS...
  SSSS...
  .SSS...
  ..SSS..
  ..SSSSS
  .SSSSSS
  ..S..SS
  ......S`)
// Lenti: lente d'ingrandimento
pulsante("lente", 16, {}, `
  ...SSSSS......
  ..SSLLLSS.....
  .SSLLLLLSS....
  .SLLLLLLLS....
  .SLLLLLLLS....
  .SLLLLLLLS....
  .SSLLLLLSS....
  ..SSLLLSS.....
  ...SSSSSNN....
  ........NNN...
  .........NNN..
  ..........NNN.
  ...........NN.`)
// Evento: fumetto col punto esclamativo
pulsante("evento", 16, { tieni: "W" }, `
  .WWWWWWWWWWWW.
  WWWWWWWWWWWWWW
  WWWWWWRRWWWWWW
  WWWWWWRRWWWWWW
  WWWWWWRRWWWWWW
  WWWWWWRRWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWRRWWWWWW
  WWWWWWWWWWWWWW
  .WWWWWWWWWWWW.
  ..WWW.........
  ..WW..........
  ..W...........`)
// Cassa: moneta d'oro con l'euro
pulsante("cassa", 16, { fascia: false }, `
  ....YYYYYY....
  ..YYYYYYYYYY..
  .YYYYYyyyyYYY.
  .YYYYyYYYYyYY.
  YYYYyYYYYYYYYY
  YYYyyyyyYYYYYY
  YYYYyYYYYYYYYY
  YYYyyyyyYYYYYY
  YYYYyYYYYYYYYY
  .YYYYyYYYYyYY.
  .YYYYYyyyyYYY.
  ..YYYYYYYYYY..
  ..yyYYYYYYyy..
  ....yyyyyy....`)
// Stagioni: fiore (primavera), sole (estate), foglia (autunno), fiocco di neve (inverno)
pulsante("s_pri", 16, {}, `
  .....RRR......
  ....RRRRR.....
  .RR.RRRRR.RR..
  RRRRRRRRRRRRR.
  RRRRRYYYRRRRR.
  .RRRRYYYRRRR..
  ..RRRYYYRRR...
  .RRRRRRRRRRR..
  RRRRRRRRRRRRR.
  .RR.RRGRR.RR..
  ......G.......
  ...GG.G.......
  ....GGG.......
  ......G.......`)
pulsante("s_est", 16, {}, `
  ......Y.......
  ......Y.......
  ..Y.......Y...
  ...Y.YYY.Y....
  .....YYYYY....
  ....YYYYYYY...
  YY..YYYYYYY..YY
  ....YYYYYYY...
  .....YYYYY....
  ...Y.YYY.Y....
  ..Y.......Y...
  ......Y.......
  ......Y.......`)
pulsante("s_aut", 16, {}, `
  ..........OOOO
  ........OOOOOO
  ......OOOOOOOO
  .....OOOOOOoOO
  ....OOOOOOoOOO
  ...OOOOOOoOOOO
  ...OOOOOoOOOOO
  ..OOOOOoOOOOO.
  ..OOOOoOOOOO..
  ..OOOoOOOOO...
  ..OOoOOOOO....
  ..NoOOOOO.....
  .N............
  N.............`)
pulsante("s_inv", 16, { mx: true, fascia: false }, `
  ......L
  ....L.L
  .....LL
  .L....L
  ..L...L
  LLLL..L
  ....LLL
  ....LLL
  LLLL..L
  ..L...L
  .L....L
  .....LL
  ....L.L
  ......L`)
// Salva: dischetto
pulsante("salva", 16, { tieni: "W" }, `
  BBBBBBBBBBBB..
  BBBSSSSSSKSBB.
  BBBSSSSSSKSBBB
  BBBSSSSSSKSBBB
  BBBSSSSSSSSBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBWWWWWWWWWWBB
  BBWjjjjjjjjWBB
  BBWWWWWWWWWWBB
  BBWjjjjjjjjWBB
  BBWWWWWWWWWWBB
  BBWWWWWWWWWWBB`)
// Calendario
pulsante("calendario", 16, { tieni: "W" }, `
  ...K......K...
  RRRKRRRRRRKRRR
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  WWWWWWWWWWWWWW
  WjjWjjWjjWjjWW
  WWWWWWWWWWWWWW
  WjjWjjWjjWjjWW
  WWWWWWWWWWWWWW
  WjjWRRWjjWjjWW
  WWWWWWWWWWWWWW
  WjjWjjWWWWWWWW
  WWWWWWWWWWWWWW
  SSSSSSSSSSSSSS`)
// Nuova partita: più arancione
pulsante("nuova", 16, { mx: true }, `
  .....OO
  .....OO
  .....OO
  .....OO
  .....OO
  OOOOOOO
  OOOOOOO
  .....OO
  .....OO
  .....OO
  .....OO
  .....OO`)
// Cestino
pulsante("cestino", 16, { mx: true }, `
  .....RR
  ....R..
  .RRRRRR
  RRRRRRR
  .......
  .RRRRRR
  .RrRRrR
  .RrRRrR
  .RrRRrR
  ..rRRrR
  ..rRRrR
  ..rRRrR
  ..RRRRR`)
// Giù: freccia della tendina (tutta scura: niente contorno in più)
pulsante("giu", 16, { contorno: false, fascia: false }, `
  ................
  ................
  ................
  ................
  .KKK........KKK.
  .KDDK......KDDK.
  ..KDDK....KDDK..
  ...KDDK..KDDK...
  ....KDDKKDDK....
  .....KDDDDK.....
  ......KDDK......
  .......KK.......
  ................
  ................
  ................
  ................`)
// Nuvola (salvataggio online)
pulsante("nuvola", 16, {}, `
  ..............
  ..............
  ..............
  ......LLL.....
  .....LLLLL....
  ..LL.LLLLLL...
  .LLLLLLLLLLLL.
  .LLLLLLLLLLLLL
  LLLLLLLLLLLLLL
  LLLLLLLLLLLLLL
  .LLLLLLLLLLLL.`)
// Ospite: omino col cappellino
pulsante("ospite", 16, { mx: true }, `
  ....YYY
  ..YYYYY
  ..YYYYY
  .YYYYYY
  ..FFFFF
  ..FFKFF
  ..FFKFF
  ..fFFFF
  ...fFFF
  .....FF
  ..DDDDD
  .DDDDDD
  DDDDDDD
  DDDDDDD`)
// Chiave
pulsante("chiave", 16, {}, `
  ..............
  ..............
  ..............
  .YYYY.........
  YYYYYY........
  YY..YYYYYYYYYY
  YY..YYYYYYYYYY
  YYYYYY....Y.YY
  .YYYY.....Y.Y.
  ..............`)
// Scarica e carica: foglio con la freccia
pulsante("scarica", 16, { tieni: "W" }, `
  WWWWWWWS......
  WjjjjjWSS.....
  WWWWWWWWWW....
  WjjjjjjjjW....
  WWWWWWWWWW....
  WjjjjjjjBBBB..
  WWWWWWWWBBBB..
  WjjjjjjjBBBB..
  WWWWWWWWBBBB..
  WWWWWBBBBBBBBB
  .......BBBBBB.
  ........BBBB..
  .........BB...`)
pulsante("carica", 16, { tieni: "W" }, `
  WWWWWWWS.GG...
  WjjjjjWSGGGG..
  WWWWWWWGGGGGG.
  WjjjjjGGGGGGGG
  WWWWWWWWGGGG..
  WjjjjjjjGGGG..
  WWWWWWWWGGGG..
  WjjjjjjjGGGG..
  WWWWWWWWGGGG..
  WWWWWWWWWW....
  WjjjjjjjjW....
  WWWWWWWWWW....
  SSSSSSSSSS....`)

// Eventi con un posto sulla mappa (dalla 0.106): nuvola con la nebbia, la pioggia o la neve, cono del cantiere,
// maglia rosa del Giro, divieto di transito per i camion (ZTL, valichi chiusi)
pulsante("m_nebbia", 16, { tieni: "W" }, `
  ..............
  .....SSSS.....
  ...SSSSSSSS...
  ..SSSSSSSSSSS.
  .SSSSSSSSSSSSS
  .SSSSSSSSSSSSS
  ..SSSSSSSSSSS.
  ..............
  .WWWWWWWWWW...
  ..............
  ...WWWWWWWWWWW
  ..............
  WWWWWWW.......`)
pulsante("m_pioggia", 16, {}, `
  ..............
  .....DDDD.....
  ...DDDDDDDD...
  ..DDDDDDDDDDD.
  .DDDDDDDDDDDDD
  .DDDDDDDDDDDDD
  ..DDDDDDDDDDD.
  ..............
  ..B...B...B...
  ..B...B...B...
  ..............
  ....B...B...B.
  ....B...B...B.`)
pulsante("m_neve", 16, {}, `
  ..............
  .....LLLL.....
  ...LLLLLLLL...
  ..LLLLLLLLLLL.
  .LLLLLLLLLLLLL
  .LLLLLLLLLLLLL
  ..LLLLLLLLLLL.
  ...W.....W....
  ..WWW...WWW...
  ...W.....W....
  ......W.....W.
  .....WWW...WWW
  ......W.....W.`)
pulsante("m_cantiere", 16, { tieni: "W" }, `
  ......OO......
  ......OO......
  .....OOOO.....
  .....WWWW.....
  ....WWWWWW....
  ....OOOOOO....
  ...OOOOOOOO...
  ...WWWWWWWW...
  ..WWWWWWWWWW..
  ..OOOOOOOOOO..
  .OOOOOOOOOOOO.
  DDDDDDDDDDDDDD
  DDDDDDDDDDDDDD`)
pulsante("m_giro", 16, {}, `
  ..............
  ...eee..eee...
  .eeeeeWWeeeee.
  eeeeeeeeeeeeee
  eeeeeeeeeeeeee
  eee.eeeeee.eee
  ...eeeeeeee...
  ...eeeWWeee...
  ...eeWeeWee...
  ...eeeeWeee...
  ...eeeWeeee...
  ...eeWWWWee...
  ...eeeeeeee...`)
pulsante("m_divieto", 16, { tieni: "W" }, `
  ....RRRRRR....
  ..RRRRRRRRRR..
  .RRRWWWWWWRRR.
  .RRWWWWWWWWRR.
  RRWWWWWWWWWWRR
  RRWKKKKKKWWWRR
  RRWKKKKKKKKWRR
  RRWKKKKKKKKWRR
  RRWWKWWWWKWWRR
  RRWWWWWWWWWWRR
  .RRWWWWWWWWRR.
  .RRRWWWWWWRRR.
  ..RRRRRRRRRR..
  ....RRRRRR....`)

// Reparti tecnici (scheda della finestra Tecnologia, pacchetto Reparto IT e Ingegneria): il caschetto giallo dell'Ingegneria sul monitor dell'IT
menu("reparti", { tieni: "b" }, `
  .....YYYY.....
  ...YYYYYYYY...
  ..YYYYYYYYYY..
  .YYYYYYYYYYYY.
  DDDDDDDDDDDDDD
  DbbbbbbbbbbbbD
  DbiibbbbbbbbbD
  DbbbbhhhhbbbbD
  DbbbbbbbbbbbbD
  DbiiiibbbbbbbD
  DDDDDDDDDDDDDD
  ......DD......
  ....DDDDDD....
  ..............`)
// bollini dei reparti tecnici sulle tecnologie: il monitor del Reparto IT e il caschetto dell'Ingegneria (12×12)
pulsante("dep_it", 12, { tieni: "b", fascia: false }, `
  ..........
  DDDDDDDDDD
  DbbbbbbbbD
  DbiibbbbbD
  DbbbhhbbbD
  DbbbbbbbbD
  DDDDDDDDDD
  ....DD....
  ..DDDDDD..
  ..........`)
pulsante("dep_ing", 12, { mx: true }, `
  .....
  .....
  ...YY
  ..YYY
  .YYYY
  .YYYY
  YYYYY
  .....
  .....
  .....`)

// Happy Squid Inc.: calamaro sorridente (firma in fondo alle Opzioni); occhi, guance e bocca dopo la fascia
pulsante("squid", 16, { mx: true, dopo: [grid(3, 6, `
  .K....K.
  e......e
  ..K..K..
  ...KK...`)] }, `
  ......P
  .....PP
  ....PPP
  ..PPPPP
  PPPPPPP
  .PPPPPP
  ..PPPPP
  ..PPPPP
  ..PPPPP
  ..PPPPP
  ..PPPPP
  ..PP.PP
  .PP..P.
  P....P.`)

foglio("foglio")

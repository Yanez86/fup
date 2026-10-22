// Talenti dei personaggi (prima parte, 37 icone): carriera, carattere, abitudini e titoli di studio.
// Tela 14×14, l'icona finale è 16×16 col contorno; il tipo colora solo la tessera dell'anteprima.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/talenti_1.px.js foglio
include("comune.px.js", { palette: true })

// Un milione di km al volante: il volante del camion con le razze e il clacson
talento("Un milione di km al volante", "mix", { mx: true, fascia: false }, `
  ....DDD
  ..DDDDD
  .DDD...
  .DD....
  DD.....
  DD.....
  DD.....
  DDSSSSR
  DDSSSSR
  DD...SS
  .DD...S
  .DDD..S
  ..DDDDD
  ....ddd`)

// Allergico al gestionale: il monitor del WMS con la X rossa
talento("Allergico al gestionale", "neg", { mx: true, tieni: "LR" }, `
  DDDDDDD
  DLLLLLL
  DLRRLLL
  DLLRRLL
  DLLLRRL
  DLLLLRR
  DLLLRRL
  DLLRRLL
  DLRRLLL
  DLLLLLL
  DDDDDDD
  ddddddd
  ......S
  ...SSSS`)

// Dialetto stretto: fumetto giallo pieno di parole storte
talento("Dialetto stretto", "mix", { dopo: [grid(2, 3, `
  ..KK..KK..
  KK..KK..KK
  ..........
  ..KK..KK..
  KK..KK....`)] }, `
  ..............
  .YYYYYYYYYYYY.
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  YYYYYYYYYYYYYY
  .YYYYYYYYYYYY.
  ..YYY.........
  ..YY..........
  ..Y...........`)

// Laureato in Bocconi: tocco da laureato con la nappa gialla
talento("Laureato in Bocconi", "mix", {}, `
  ..............
  ......DD......
  ....DDDDDD....
  ..DDDDDDDDDD..
  DDDDDDYYYYYYYD
  ..DDDDDDDDDDY.
  ...KDDDDDDK.Y.
  ...DKKDDKKD.Y.
  ...DDDKKDDD.Y.
  ...DDDDDDDD.YY
  ...DDDDDDDD.YY
  ...DDDDDDDD.YY
  ....DDDDDD....
  ..............`)

// Papà ha sempre ragione: il fondatore, pelato coi baffoni grigi e la cravatta
talento("Papà ha sempre ragione", "neg", { mx: true, dopo: [grid(0, 4, `
  ...SSS.
  ....K..
  ....K..
  ......f
  ...SSSS
  ..SS...`)] }, `
  ...FFFF
  ..FFFFF
  .FFFFFF
  .SFFFFF
  SSFFFFF
  SFFFFFF
  SFFFFFF
  .FFFFFF
  .FFFFFF
  .FFFFFF
  ..FFFFF
  ...FFFF
  .NNNNWW
  NNNNNWR`)

// Sempre al telefono: il cellulare che squilla
talento("Sempre al telefono", "mix", { tieni: "L", dopo: [grid(5, 8, `
  S.S.S
  .....
  S.S.S
  .....
  S.S.S`)] }, `
  .........D....
  .........D....
  ....DDDDDDD...
  ....DLLLLLD...
  ....DLLLLLD...
  ....DLLLLLD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...
  ....DDDDDDD...`,
  layer("linee", { outline: false }, grid(1, 3, `
  .K..........
  K...........
  K...........
  .K..........`), grid(12, 3, `
  K.
  .K
  .K
  K.`)))

// Parla per acronimi: fumetto bianco con scritto KPI
talento("Parla per acronimi", "mix", { dopo: [grid(1, 3, `
  B.B.BB..BBB
  B.B.B.B..B.
  BB..BB...B.
  B.B.B....B.
  B.B.B...BBB`)] }, `
  ..............
  .WWWWWWWWWWW..
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  WWWWWWWWWWWWW.
  .WWWWWWWWWWW..
  ........WWW...
  ..........WW..
  ............W.
  ..............`)

// Stacanovista: la sveglia rossa con le campane
talento("Stacanovista", "mix", { dopo: [grid(7, 5, `
  K..
  K..
  KKK`)] }, `
  .YYY......YYY.
  YYYY......YYYY
  YYY..RRRR..YYY
  ...RRRRRRRR...
  ..RRWWWWWWRR..
  .RRWWWWWWWWRR.
  .RWWWWWWWWWWR.
  .RWWWWWWWWWWR.
  .RWWWWWWWWWWR.
  .RRWWWWWWWWRR.
  ..RRWWWWWWRR..
  ...RRRRRRRR...
  ..RR......RR..
  ..............`)

// Cena col buyer: bottiglia di vino e calice pieno
talento("Cena col buyer", "pos", { tieni: "L", dopo: [grid(1, 7, `
  CCCC
  CRRC
  CCCC`)] }, `
  ..NN..........
  ..GG..........
  ..GG..........
  ..GG..........
  .GGGG.........
  .GGGG.LLLLLLL.
  .GGGG.LLLLLLL.
  .GGGG.RRRRRRR.
  .GGGG..RRRRR..
  .GGGG...RRR...
  .GGGG....L....
  .GGGG....L....
  .GGGG....L....
  .GGGG..LLLLL..`)

// Excel-dipendente: foglio di calcolo con la cella selezionata
talento("Excel-dipendente", "mix", { tieni: "WSG" }, `
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  SSSSSSSSSSSSSS
  SWWWSWWWWSWWWW
  SjjWSWWjjSWjjW
  SSSSGGGGGGSSSS
  SWWWGWWWWGWWWW
  SjjWGWjjWGWjjW
  SSSSGGGGGGSSSS
  SWWWSWWWWSWWWW
  SjjWSWjjWSWWWW
  SSSSSSSSSSSSSS
  SWWWSWWWWSWWWW
  SjjWSWWWWSWjjW`)

// Parla con i robot: testa di robot con la visiera e l'antenna
talento("Parla con i robot", "mix", { mx: true }, `
  .....RR
  .....RR
  ......S
  .SSSSSS
  .SSSSSS
  .SDDDDD
  DSDuuDD
  DSDuuDD
  DSDDDDD
  .SSSSSS
  .SSdSdS
  .SSSSSS
  .SSSSSS
  .SSSSSS`)

// Calma olimpica: il caffè fumante sul piattino, in mezzo all'alluvione
talento("Calma olimpica", "pos", {}, `
  ..............
  ..............
  ..............
  ..............
  ..WWWWWWW.....
  ..WMMMMMWWW...
  ..WWWWWWW.W...
  ..WWWWWWW.W...
  ...WWWWWWW....
  ....WWWWW.....
  BB.SSSSSSSS.BB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB`,
  layer("linee", { outline: false }, grid(4, 0, `
  .s..s
  s..s.
  .s..s
  s..s.`)))

// Ha fatto il militare: medaglia a stella col nastro tricolore
talento("Ha fatto il militare", "mix", {}, `
  ....GGWWRR....
  ....GGWWRR....
  ....GGWWRR....
  ....GGWWRR....
  ..............
  ......YY......
  ......YY......
  .....YYYY.....
  YYYYYYYYYYYYYY
  .YYYYYYYYYYYY.
  ...YYYYYYYY...
  ...YYYYYYYY...
  ..YYYY..YYYY..
  .YYY......YYY.`)

// Ex sindacalista: il megafono del picchetto
talento("Ex sindacalista", "pos", {}, `
  ..............
  ..............
  ........Rr....
  ......RRRr....
  ....RRRRRr....
  ..RRRRRRRr....
  SSRRRRRRRr....
  SSRRRRRRRr....
  ..RRRRRRRr....
  ....RRRRRr....
  ....DDRRRr....
  ....DD..Rr....
  ....DD........
  ..............`,
  layer("linee", { outline: false }, grid(11, 2, `
  ..K
  .K.
  ...
  ...
  KKK
  ...
  ...
  .K.
  ..K`)))

// Conosce tutti al bar: l'insegna del bar sotto casa, con la tenda a righe
talento("Conosce tutti al bar", "pos", { tieni: "L", dopo: [grid(1, 1, `
  YY...Y..YY.
  Y.Y.Y.Y.Y.Y
  YY..YYY.YY.
  Y.Y.Y.Y.Y.Y
  YY..Y.Y.Y.Y`)] }, `
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDD.
  GGWWGGWWGGWWG.
  GGWWGGWWGGWWG.
  GGWWGGWWGGWWG.
  CLLLLLLCNNNCC.
  CLLLLLLCNNNCC.
  CLLLLLLCNNNCC.
  CLLLLLLCNNNCC.`)

// Braccino corto: il sacco dei soldi chiuso col lucchetto
talento("Braccino corto", "mix", {}, `
  ...NN....NN...
  ....NNNNNN....
  .....nnnn.....
  ....NNNNNN....
  ..NNNNNNNNNN..
  .NNNNNSSNNNNN.
  .NNNNSSSSNNNN.
  NNNNSNNNNSNNNN
  NNNNSNNNNSNNNN
  NNNKYYYYYYKNNN
  NNNKYYKKYYKNNN
  NNNKYYKKYYKNNN
  .NNKYYYYYYKNN.
  ...KYYYYYYK...`)

// Mano larga: la pizza offerta al turno di notte
talento("Mano larga", "mix", { dopo: [grid(2, 2, `
  ......WW..
  .WW...WW..
  .WW.G.....
  .....G..G.
  .G......G.
  ...WW.....
  ...WW..WW.
  .......WW.`)] }, `
  ....YYYYYY....
  ..YYYYYYYYYY..
  .YYRRRRRRRRYY.
  .YRRRRRRRRRRY.
  YYRRRRRRRRRRYY
  YRRRRRRRRRRRRY
  YRRRRRRRRRRRRY
  YRRRRRRRRRRRRY
  YRRRRRRRRRRRRY
  YYRRRRRRRRRRYY
  .YRRRRRRRRRRY.
  .YYRRRRRRRRYY.
  ..YYYYYYYYYY..
  ....YYYYYY....`)

// Ansia da prestazione: faccia preoccupata con la goccia di sudore
talento("Ansia da prestazione", "mix", { tieni: "N", dopo: [grid(2, 4, `
  .K..K.
  K....K
  .K..K.
  .K..K.
  ......
  .K.K..
  K.K.K.`)] }, `
  ..NNNNNN......
  .NNNNNNNN.....
  NNNNNNNNNN....
  NNFFFFFFNN..B.
  NFFFFFFFFN.BB.
  FFFFFFFFFF.BBB
  FFFFFFFFFF.BBB
  FFFFFFFFFF.BBB
  FFFFFFFFFF..B.
  .FFFFFFFFF....
  .FFFFFFFFF....
  ..FFFFFFF.....
  ...FFFFF......
  ..............`)

// Insonne: la luna con l'occhio spalancato
talento("Insonne", "neg", {}, `
  ....YYY.......
  ...YYY...Y....
  ..YYYY..YYY...
  .YYYYY...Y....
  YYYYYY........
  YWWWYY........
  YWWKYY........
  YWWKYYY.......
  YyyyYYYY......
  YYYYYYYYY.....
  .YYYYYYYYYYYY.
  ..YYYYYYYYYY..
  ...YYYYYYYY...
  ....YYYYYY....`)

// Tifo sfegatato: la sciarpa da stadio a righe tenuta in alto, con le frange
talento("Tifo sfegatato", "mix", { mx: true }, `
  .......
  OOOOBBO
  OOOOBBO
  OOOOBBO
  OOOOBBO
  BBBB...
  BBBB...
  OOOO...
  OOOO...
  BBBB...
  BBBB...
  O.O....
  O.O....
  .......`)

// Ex fumatore: divieto di fumo sopra la sigaretta
talento("Ex fumatore", "pos", { fascia: false }, `
  ....RRRRRR....
  ..RRRRRRRRRR..
  .RRRRWWWWRRRR.
  .RRRRWWWWWWRR.
  RRWRRRWWWWWWRR
  RRWWRRRWWWWWRR
  RRWKKRRRKKKWRR
  RRWKKKRRRKKWRR
  RRWWWWWRRRWWRR
  RRWWWWWWRRRWRR
  .RRWWWWWWRRRR.
  .RRRRWWWWRRRR.
  ..RRRRRRRRRR..
  ....rrrrrr....`)

// Esaurito: la batteria scarica, con l'ultima tacca rossa
talento("Esaurito", "neg", { mx: true, fascia: false }, `
  .....SS
  .....SS
  ..SSSSS
  ..Sdddd
  ..Sdddd
  ..Sdddd
  ..Sdddd
  ..Sdddd
  ..Sdddd
  ..Sdddd
  ..SRRRR
  ..SRRRR
  ..SSSSS
  ..sssss`)

// Mentore: il gufo saggio
talento("Mentore", "pos", { mx: true }, `
  .N.....
  .NN....
  .NNNNNN
  NCCCCNN
  NCCCKNN
  NCCCKNO
  NCCCCNO
  NNNNNNO
  NNNCCCC
  NNCCnCC
  NNCnCCn
  NNCCCCC
  .NNCCCC
  ...OO..`)

// Meditazione quotidiana: seduto a gambe incrociate, occhi chiusi
talento("Meditazione quotidiana", "pos", { mx: true, dopo: [grid(4, 4, "KK")] }, `
  ....NNN
  ...NNNN
  ...NFFF
  ...FFFF
  ...FFFF
  ...FFFF
  ....FFF
  ....PPP
  ...PPPP
  ..PP.PP
  .PP..PP
  FF.DDDD
  .DDDDDD
  DDDDDDD`)

// Mal di schiena cronico: la colonna vertebrale con la vertebra dolorante
talento("Mal di schiena cronico", "neg", {}, `
  ....CCCCCC....
  .....CCCC.....
  ..............
  ....CCCCCC....
  .....CCCC.....
  ..............
  ....RRRRRR....
  .....RRRR.....
  ..............
  ....CCCCCC....
  .....CCCC.....
  ..............
  ....CCCCCC....
  .....CCCC.....`,
  layer("linee", { outline: false }, grid(0, 3, `
  .R..........R.
  ..R........R..
  ..............
  RR..........RR
  ..............
  ..R........R..
  .R..........R.`)))

// Formato sulla sicurezza: il gilet ad alta visibilità con le bande riflettenti
talento("Formato sulla sicurezza", "pos", { mx: true, dopo: [grid(0, 0, `
  ...S...
  ...S...
  ...S...
  ...S...
  ...S...
  ...S...
  ...S...
  ...S...
  SSSSSSS
  .......
  .......
  SSSSSSS`)] }, `
  ..OOO..
  ..OOO..
  .OOOO..
  OOOOOO.
  OOOOOO.
  OOOOOO.
  OOOOOOO
  OOOOOOO
  OOOOOOO
  OOOOOOO
  OOOOOOO
  OOOOOOO
  OOOOOOO
  OOOOOOO`)

// Ha visto la morte in faccia: il teschio
talento("Ha visto la morte in faccia", "mix", { mx: true, dopo: [grid(0, 0, `
  .......
  .......
  .......
  .......
  .......
  ..KKK..
  ..KKK..
  ...KK..
  ......K
  .......
  ....K..
  ....K..
  .......`)] }, `
  ...WWWW
  .WWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  .WWWWWW
  ..WWWWW
  ..WWWWW
  ..WWWWW
  ...WWWW
  .......`)

// Patentino del muletto: il carrello elevatore giallo
talento("Patentino del muletto", "pos", {}, `
  ..SS..DDDDDDD.
  ..SS..D.....D.
  ..SS..D.....D.
  ..SS..D.....D.
  ..SS..D.....D.
  ..SSYYYYYYYYYY
  ..SSYYYYYYYYYY
  ..SSYYYYYYYYYY
  ..SSYYYYYYYYYY
  ..SSYYYYYYYYYY
  ..SSYDDYYYYDDY
  ..SSDDDD..DDDD
  SSSSDDDD..DDDD
  .....DD....DD.`)

// Esperto di dogane: il timbro e il documento timbrato
talento("Esperto di dogane", "pos", { tieni: "W", dopo: [grid(1, 4, `
  jjjjj
  .....
  jjjj.
  .....
  jjjjj
  .RRRR
  R...R
  R...R
  .RRRR`)] }, `
  ...........NN.
  ..........NNNN
  ...........NN.
  WWWWWWWW...NN.
  WWWWWWWW..NNNN
  WWWWWWWW..NNNN
  WWWWWWWW..NNNN
  WWWWWWWW..RRRR
  WWWWWWWW......
  WWWWWWWW......
  WWWWWWWW......
  WWWWWWWW......
  WWWWWWWW......
  WWWWWWWW......`)

// Licenza media: la matita di scuola
talento("Licenza media", "mix", {}, `
  ............RR
  ...........RRR
  ..........SRR.
  .........YSS..
  ........YYY...
  .......YYY....
  ......YYY.....
  .....YYY......
  ....YYY.......
  ...FFY........
  ..FFF.........
  ..DF..........
  .D............
  ..............`)

// Diplomato ragioniere: la calcolatrice scrivente col rotolo di carta
talento("Diplomato ragioniere", "pos", { fascia: false }, `
  ....WWWWWW....
  ....WjjjjW....
  ....WWWWWW....
  ....WjjjWW....
  ....WWWWWW....
  .SSSSSSSSSSSS.
  .SLLLLLLLLLLS.
  .SLLLLLLLLLLS.
  .SSSSSSSSSSSS.
  .SWWSWWSWWSOS.
  .SSSSSSSSSSOS.
  .SWWSWWSWWSOS.
  .SSSSSSSSSSSS.
  .ssssssssssss.`)

// Diplomato perito industriale: chiave inglese e cacciavite incrociati
talento("Diplomato perito industriale", "pos", {}, `
  ..........SS..
  .S.......SSS.S
  ..S......SS.SS
  ...S.....SSSSS
  ....S....SSSS.
  .....S..SS....
  ......SSS.....
  ......SS......
  .....SS.RR....
  ....SS..RRR...
  ...SS....RRR..
  ..SS......RRR.
  .SS........RRR
  SS..........RR`)

// Diplomato perito informatico: il mouse col filo
talento("Diplomato perito informatico", "pos", { dopo: [grid(3, 3, `
  ....s....
  ....D....
  ....D....
  ....s....
  sssssssss`)] }, `
  ........DDD...
  .......D......
  .......D......
  .....WWWWW....
  ....WWWWWWW...
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ...WWWWWWWWW..
  ....WWWWWWW...
  .....WWWWW....`)

// Diplomato geometra: la squadra da disegno
talento("Diplomato geometra", "pos", { dopo: [grid(0, 2, `
  K.
  ..
  KK
  ..
  K.
  ..
  KK
  ..
  K.`)] }, `
  Y.............
  YY............
  YYY...........
  YYYY..........
  YYYYY.........
  YYYYYY........
  YYY.YYY.......
  YYY..YYY......
  YYY...YYY.....
  YYY....YYY....
  YYY.....YYY...
  YYYYYYYYYYYY..
  YYYYYYYYYYYYY.
  YYYYYYYYYYYYYY`)

// Maturità classica: la colonna greca
talento("Maturità classica", "mix", { mx: true, dopo: [grid(1, 2, "K")] }, `
  .WWWWWW
  WWWWWWW
  WWWWWWW
  WWWSSSS
  ....WSW
  ....WSW
  ....WSW
  ....WSW
  ....WSW
  ....WSW
  ....WSW
  ...WWWW
  ..WWWWW
  .WWWWWW`)

// Maturità scientifica: il cannocchiale sul treppiede, puntato in alto
talento("Maturità scientifica", "pos", {}, `
  ............BB
  ..........BBBB
  .........BBBBB
  ........DBBBBB
  ......BBDBBB..
  ....BBBBDB....
  ..BBBBBB......
  ..BBBB........
  SSBB.DD.......
  SS...DD.......
  ....N..N......
  ...N....N.....
  ..N......N....
  .N........N...`)

// Diplomato all'alberghiero: la campana d'argento da servizio sul piatto
talento("Diplomato all'alberghiero", "mix", { mx: true }, `
  .......
  .....SS
  ......S
  ....SSS
  ..SSSSS
  .SSSSSS
  .SSSSSS
  .SSSSSS
  .SSSSSS
  .SSSSSS
  .SSSSSS
  WWWWWWW
  ..SSSSS
  .......`)

foglio("foglio")

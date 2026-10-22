// Talenti dei personaggi (seconda parte): studi e lauree, vizi e manie di contorno. Tela 14×14, icona finale 16×16.
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/talenti_2.px.js foglio
include("comune.px.js", { palette: true })

// t2netto(): toglie i K che toccano il vuoto o il bordo della tela. Le parti stampate col loro contorno (e le linee K
// tirate fino al bordo) lasciano così la linea scura solo dove coprono un'altra forma; il contorno esterno lo rimette
// icona(), uguale a quello delle altre icone.
const t2netto = (c) => {
  const vuoto = (x, y) => x < 0 || y < 0 || x >= c.w || y >= c.h || c.is(x, y, ".")
  const via = []
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++)
    if (c.is(x, y, "K") && (vuoto(x - 1, y) || vuoto(x + 1, y) || vuoto(x, y - 1) || vuoto(x, y + 1))) via.push([x, y])
  for (const [x, y] of via) c.px(x, y, "_")
}

// ================================================================ parti
// chiave inglese a forchetta, di sbieco
sprite("_t2chiave", { w: 8, h: 9, outline: "K" }, `
  ....SS.S
  ....SS.S
  ....SSSS
  ...SSSS.
  ...SS...
  ..SS....
  .SS.....
  SS......
  S.......`)
// fumetto azzurro con la coda in basso a destra
sprite("_t2fumetto", { w: 9, h: 9, outline: "K" }, `
  .BBBBBBB.
  BBBBBBBBB
  BBBBBBBBB
  BBBBBBBBB
  BBBBBBBBB
  BBBBBBBBB
  .BBBBBBB.
  ......BB.
  .......B.`)
// compasso da disegno
sprite("_t2compasso", { w: 10, h: 13, mx: true, outline: "K" }, `
  ....D
  ...SS
  ...SS
  ...S.
  ...S.
  ...S.
  ..S..
  ..S..
  ..S..
  .S...
  .S...
  .S...
  S....`)
// pennello col colore sulla punta
sprite("_t2pennello", { w: 7, h: 7, outline: "K" }, `
  BB.....
  BBS....
  .SSD...
  ...DD..
  ....DD.
  .....DD
  ......D`)
// cuscino del lettino
sprite("_t2cuscino", { w: 3, h: 2, outline: "K" }, `
  CCC
  CCC`)
// cronometro del lead time
sprite("_t2orologio", { w: 7, h: 8, outline: "K" }, `
  ...S...
  ..WWW..
  .WWKWW.
  WWWKWWW
  WWWKKWW
  WWWWWWW
  .WWWWW.
  ..WWW..`)
// bambino: capelli N, maglietta R (si cambiano con swap)
sprite("_t2bimbo", { w: 6, h: 14, outline: "K" }, `
  .NNNN.
  NNNNNN
  NFFFFN
  FKFFKF
  FKFFKF
  .FFFF.
  RRRRRR
  RRRRRR
  RRRRRR
  RRRRRR
  RRRRRR
  RRRRRR
  RRRRRR
  RRRRRR`)

// ================================================================ studi
// Diplomato al nautico: l'ancora
talento("Diplomato al nautico", "mix", { mx: true }, `
  .....DD
  ....DD.
  ....DD.
  .....DD
  ..DDDDD
  ......D
  ......D
  .D....D
  DDD...D
  .DD...D
  .DD...D
  .DDD..D
  ..DDDDD
  ...DDDD`)
// Qualifica professionale: la cassetta degli attrezzi con chiave e cacciavite
talento("Qualifica professionale", "pos", {}, `
  .S.S..........
  .SSS......YYY.
  ..S.......YYY.
  ..S..SSSS.YYY.
  ..S..S..S..S..
  ..S..S..S..S..
  .RRRRRRRRRRRR.
  RRRRRRRRRRRRRR
  rrrrrrYYrrrrrr
  RRRRRRYYRRRRRR
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR`)
// Ingegnere gestionale: il diagramma di Gantt (anche per le ferie)
talento("Ingegnere gestionale", "mix", { tieni: "W" }, `
  DDDDDDDDDDDDDD
  WWWWWWWWWWWWWW
  WOOOOOWWWWWWWW
  WOOOOOWWWWWWWW
  WWWWWWWWWWWWWW
  WWWBBBBBWWWWWW
  WWWBBBBBWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWGGGGGWWW
  WWWWWWGGGGGWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWPPPPW
  WWWWWWWWWPPPPW
  WWWWWWWWWWWWWW`)
// Ingegnere meccanico: ingranaggio e chiave inglese
talento("Ingegnere meccanico", "mix", {}, `
  .....OO.......
  .OO.OOOO.OO...
  .OOOOOOOOOO...
  ..OOOOOOOO....
  .OOOO..OOOO...
  OOOO....OOOO..
  OOOO....OOOO..
  .OOOO..OOOO...
  ..OOOOOOOO....
  .OOOOOOOOOO...
  .OO.OOOO.OO...
  .....OO.......`,
  stamp("_t2chiave", 5, 4), t2netto)
// Ingegnere informatico: il portatile col codice che capisce solo lui
talento("Ingegnere informatico", "mix", { fascia: false }, `
  ..............
  .DDDDDDDDDDDD.
  .DddddddddddD.
  .DdhhhhhddddD.
  .DddduuuuuddD.
  .DddduuuddddD.
  .DdhhhhddiidD.
  .DddduuuudddD.
  .DdhhhddddddD.
  .DddddddddddD.
  .DDDDDDDDDDDD.
  SSSSSSSSSSSSSS
  ssssssssssssss
  ..............`)
// Ingegnere dei trasporti: il cartello delle direzioni
talento("Ingegnere dei trasporti", "pos", { dopo: [grid(1, 1, `
  ..WW.....W..
  .WWWW....WW.
  WWWWWW.WWWWW
  ..WW...WWWWW
  ..WW.....WW.
  ..WW.....W..`)] }, `
  .GGGGGGGGGGGG.
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  GGGGGGGGGGGGGG
  .GGGGGGGGGGGG.
  ......SS......
  ......SS......
  ......SS......
  ......SS......
  ......SS......
  ......SS......`)
// Laureato in economia: domanda e offerta che si incrociano
talento("Laureato in economia", "pos", { tieni: "W" }, `
  WWWWWWWWWWWWWW
  WKRRWWWWWWWWBB
  WKWRRWWWWWWBBW
  WKWWRRWWWWBBWW
  WKWWWRRWWBBWWW
  WKWWWWRRBBWWWW
  WKWWWWWYYWWWWW
  WKWWWWBBRRWWWW
  WKWWWBBWWRRWWW
  WKWWBBWWWWRRWW
  WKWBBWWWWWWRRW
  WKBBWWWWWWWWRR
  WKKKKKKKKKKKKK
  WWWWWWWWWWWWWW`)
// Laureato in giurisprudenza: la bilancia della giustizia
talento("Laureato in giurisprudenza", "mix", { mx: true, fascia: false }, `
  ......Y
  .....YY
  YYYYYYY
  .Y....Y
  Y.Y...Y
  Y.Y...Y
  YYYY..Y
  .yy...Y
  ......Y
  ......Y
  ......Y
  ....YYY
  ..YYYYY
  ..yyyyy`)
// Laureato in lettere: libro aperto e penna d'oca
talento("Laureato in lettere", "mix", { fascia: false }, `
  ............PP
  ...........PpP
  ..........PpPP
  .........PpPP.
  .........pPP..
  ........pP....
  .WWWWW..KWWWW.
  WWWWWWSSWWWWWW
  WjjjjWSSWjjjjW
  WWWWWWSSWWWWWW
  WjjjWWSSWjjjjW
  WWWWWWSSWWWWWW
  NNNNNNNNNNNNNN
  .nnnnnnnnnnnn.`)
// Laureato in scienze umanistiche: la pergamena della tesi, col sigillo
talento("Laureato in scienze umanistiche", "mix", { fascia: false }, `
  ..............
  NCCCCCCCCCCCCN
  NqqqqqqqqqqqqN
  ..CCCCCCCCCC..
  ..CjjjjjjjjC..
  ..CCCCCCCCCC..
  ..CjjjjjjCCC..
  ..CCCCCCCCCC..
  ..CjjjjjjjjC..
  ..CCCCCCCRRC..
  ..CjjjjjCRRC..
  NCCCCCCCCCCCCN
  NqqqqqqqqqqqqN
  ..............`)
// Laureato in filosofia: la nuvoletta del dubbio
talento("Laureato in filosofia", "mix", { dopo: [grid(5, 1, `
  .PPP.
  PP.PP
  ...PP
  ..PP.
  .....
  ..PP.`)] }, `
  ....LLL..LLL..
  ..LLLLLLLLLLL.
  .LLLLLLLLLLLLL
  LLLLLLLLLLLLLL
  LLLLLLLLLLLLLL
  LLLLLLLLLLLLLL
  .LLLLLLLLLLLLL
  ....LLLL.LLLL.
  ..............
  ..............
  .LL...........
  .LL...........
  ..............
  ..............`)
// Laureato in psicologia: il lettino dello psicanalista
talento("Laureato in psicologia", "mix", {}, `
  ..............
  ..............
  .RR...........
  RRRR..........
  RRRRR.........
  RRRRRR........
  RRRRRRR.......
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  rrrrrrrrrrrrrr
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  .NN........NN.
  .NN........NN.`,
  stamp("_t2cuscino", 4, 4), t2netto)
// Laureato in scienze politiche: la scheda che entra nell'urna
talento("Laureato in scienze politiche", "mix", { tieni: "W" }, `
  ....WWWWWW....
  ....WRWWRW....
  ....WWRRWW....
  ....WWRRWW....
  ....WRWWRW....
  .LLKKKKKKKKLL.
  LLLLLLLLLLLLLL
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBBBWWWWWWBBBB
  BBBBWWWWWWBBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB`)
// Laureato in lingue: due fumetti, A e Z
talento("Laureato in lingue", "pos", { dopo: [grid(2, 1, `
  .W.
  W.W
  WWW
  W.W
  W.W`), grid(8, 6, `
  WWW
  ..W
  .W.
  W..
  WWW`)] }, `
  .RRRRRRR......
  RRRRRRRRR.....
  RRRRRRRRR.....
  RRRRRRRRR.....
  RRRRRRRRR.....
  RRRRRRRRR.....
  .RRRRRRR......
  .RR...........
  .R............
  ..............
  ..............
  ..............
  ..............
  ..............`,
  stamp("_t2fumetto", 4, 4), t2netto)
// Laureato in matematica: la lavagna col pi greco
talento("Laureato in matematica", "mix", { fascia: false }, `
  NNNNNNNNNNNNNN
  NGGGGGGGGGGGGN
  NGWWWWWWWWWWGN
  NGGGWGGGGWGGGN
  NGGGWGGGGWGGGN
  NGGGWGGGGWGGGN
  NGGGWGGGGWGGGN
  NGGWGGGGGWGGGN
  NGWGGGGGGGWWGN
  NGGGGGGGGGGGGN
  NNNNNNNNNNNNNN
  nnnnnnnnnnnnnn
  ..N........N..
  ..N........N..`)
// Laureato in chimica: la beuta che bolle
talento("Laureato in chimica", "pos", { mx: true, tieni: "L", dopo: [grid(6, 9, "h"), grid(3, 11, "h\nh")] }, `
  ....SSS
  .....LL
  .....LL
  .....LL
  ....LLL
  ....LLL
  ...LLLL
  ...hhhh
  ..GGGGG
  ..GGGGG
  .GGGGGG
  .GGGGGG
  GGGGGGG
  GGGGGGG`)
// Laureato in architettura: compasso sul progetto
talento("Laureato in architettura", "mix", { tieni: "SB" }, `
  ..............
  ..............
  ..............
  ..............
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BLLLLLLLLLLLLB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BBBBBBBBBBBBBB
  BLLLLLLLLLLLLB
  BBBBBBBBBBBBBB
  bbbbbbbbbbbbbb`,
  stamp("_t2compasso", 1, -1), t2netto)
// Laureato in agraria: la pesca matura
talento("Laureato in agraria", "pos", {}, `
  .........GGG..
  ......NGGGGGG.
  ......NGGGGG..
  ...OOONOOO....
  .OOOOOoOOOOO..
  OOOOOOoOOOOOO.
  OOOOOoOOOOOOO.
  OOOOOoOOOOOOO.
  OOOOOoOOOOOOO.
  OOOOOOOOOOOOO.
  OOOOOOOOOOOOO.
  .OOOOOOOOOOO..
  ..OOOOOOOOO...
  ....OOOOO.....`)
// Laureato in scienze della comunicazione: tavolozza e pennello (il logo, versione 3)
talento("Laureato in scienze della comunicazione", "mix", { dopo: [grid(1, 3, `
  .RR..YY......
  .RR..YY..GG..
  .........GG..
  .............
  PP...........
  PP...........`)] }, `
  ..............
  ...NNNNNNNN...
  .NNNNNNNNNNNN.
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNN.
  NNNN..NNNNNN..
  NNNN..NNNNN...
  NNNNNNNNNN....
  .NNNNNNNN.....
  ...NNNNN......
  ..............
  ..............`,
  stamp("_t2pennello", 6, 6), t2netto)
// Medicina, mai finita: la borsa del dottore
talento("Medicina, mai finita", "mix", { dopo: [grid(4, 6, `
  ..WW..
  ..WW..
  WWWWWW
  WWWWWW
  ..WW..
  ..WW..`)] }, `
  ..............
  .....NNNN.....
  ....N....N....
  ....N....N....
  .MMMMMMMMMMMM.
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN`)
// Master in supply chain: pallet di scatole e cronometro del lead time
talento("Master in supply chain", "pos", { fascia: false }, `
  ..............
  ..............
  .kkkNkkk......
  .kkkNkkk......
  .kkkNkkk......
  .NNNNNNN......
  KKKKKKKKKKKKKK
  kkkNkkkKkkkNkk
  kkkNkkkKkkkNkk
  kkkNkkkKkkkNkk
  NNNNNNNKNNNNNN
  KKKKKKKKKKKKKK
  NNNNNNNNNNNNNN
  NNN..NNNN..NNN`,
  stamp("_t2orologio", 6, -1), t2netto)
// MBA all'estero: la cabina telefonica rossa di Londra
talento("MBA all'estero", "mix", { mx: true, fascia: false }, `
  .....RR
  ...RRRR
  .RRRRRR
  .RWWWWW
  .RRRRRR
  .RLLRLL
  .RLLRLL
  .RRRRRR
  .RLLRLL
  .RLLRLL
  .RRRRRR
  .RLLRLL
  .RLLRLL
  rrrrrrr`)
// Dottorato di ricerca: il microscopio
talento("Dottorato di ricerca", "mix", {}, `
  ...SSSS.......
  ....SS........
  ....SS.DDDD...
  ....SSDDDDDD..
  ....SSDD..DDD.
  ....SS.....DD.
  ....SS.....DD.
  ...SSSS....DD.
  .DDDDDDDDDDDD.
  ...........DD.
  ..........DDD.
  .........DDD..
  ...DDDDDDDDDDD
  ..DDDDDDDDDDDD`)
// Fuoricorso eterno: la clessidra che non finisce mai
talento("Fuoricorso eterno", "neg", { mx: true, fascia: false }, `
  NNNNNNN
  nnnnnnn
  .N.LLLL
  .N.LLLL
  .N..LYY
  .N...YY
  .N....Y
  .N....Y
  .N...LY
  .N..LLY
  .N.LYYY
  .N.YYYY
  NNNNNNN
  nnnnnnn`)

// ================================================================ vita privata e manie
// Autodidatta: la pila di manuali
talento("Autodidatta", "mix", { fascia: false }, `
  ..............
  ...YYYYYYYYY..
  ...YWWWWWWWY..
  ...yyyyyyyyy..
  .GGGGGGGGGGG..
  .GWWWWWWWWWG..
  .ggggggggggg..
  ..BBBBBBBBBBBB
  ..BWWWWWWWWWWB
  ..bbbbbbbbbbbb
  RRRRRRRRRRRRR.
  RWWWWWWWWWWWR.
  rrrrrrrrrrrrr.
  ..............`)
// Pendolare della Torino-Milano: il regionale col pantografo
talento("Pendolare della Torino-Milano", "mix", { fascia: false }, `
  ....SSSSS.....
  .....S.S......
  ......S.......
  WWWWWWWWWWW...
  WWWWWWWWWWWW..
  WLLWLLWLLWWdd.
  WLLWLLWLLWWddd
  WWWWWWWWWWWWWW
  GGGGGGGGGGGGGG
  WWWWWWWWWWWWWY
  SSSSSSSSSSSSSS
  .DDDD....DDDD.
  SSSSSSSSSSSSSS
  ..............`)
// Vegano convinto: la carota
talento("Vegano convinto", "mix", { dopo: [grid(8, 5, "o.\n.o"), grid(5, 8, "o.\n.o"), grid(3, 10, "o.\n.o")] }, `
  .........GG.GG
  .........GGGG.
  ..........GGGG
  ........OOO...
  .......OOOOO..
  ......OOOOOO..
  .....OOOOOO...
  ....OOOOOO....
  ....OOOOO.....
  ...OOOOO......
  ..OOOOO.......
  ..OOOO........
  .OOO..........
  OO............`)
// Collezionista di multe: l'autovelox che scatta
talento("Collezionista di multe", "neg", { fascia: false }, `
  ............Y.
  SSSSSSSSSS.Y..
  SSdddSSSSS....
  SdBBBdSYYS....
  SdBBBdSYYS.YYY
  SdBBBdSSSS....
  SSdddSSSSS....
  SSSSSSSSSS.Y..
  ssssssssss..Y.
  ....DD........
  ....DD........
  ....DD........
  ....DD........
  ....dd........`)
// Re del karaoke: il microfono con la corona
talento("Re del karaoke", "pos", { mx: true, fascia: false }, `
  ...Y..Y
  ...YY.Y
  ...YYYY
  ...yyyy
  ...SSSS
  ..SSSSS
  ..SsSsS
  ..SSSSS
  ...ssss
  .....DD
  ......D
  ......D
  ......D
  ......d`)
// Fumatore incallito: posacenere pieno, sigaretta accesa e fumo
talento("Fumatore incallito", "mix", {}, `
  ..............
  ..............
  ..............
  ..............
  ..............
  ..............
  .O..OOWWWWWRs.
  .OO.OOWWWWWRs.
  DDDDDDDDDDDDDD
  DDDDDDDDDDDDDD
  DDDDDDDDDDDDDD
  .DDDDDDDDDDDD.
  ..DDDDDDDDDD..`,
  layer("fumo", { outline: false }, grid(10, 0, `
  .s..
  ..s.
  ..s.
  .s..
  .s..
  ..s.
  ..s.`)))
// Maratoneta: la scarpa da corsa
talento("Maratoneta", "pos", {}, `
  ..............
  ..............
  ....RRRR......
  ....RRRRW.....
  ....RRRRWW....
  ....RRRRRWW...
  ...RRRRRRRWW..
  ...RRRRRRRRRR.
  ...RRRRRRRRRRR
  ...RRRRRRRRRRR
  ...WWWWWWWWWWW
  ...SSSSSSSSSSS
  ..............
  ..............`,
  layer("scia", { outline: false }, grid(0, 4, `
  ss
  ..
  ss
  ..
  ss`)))
// Superstizioso: il cornetto rosso
talento("Superstizioso", "mix", {}, `
  .....YY.......
  ....Y..Y......
  .....YY.......
  ...YYYYYY.....
  ...yyyyyy.....
  ...RRRRRR.....
  ...RRRRRR.....
  ....RRRRR.....
  ....RRRRR.....
  .....RRRR...R.
  .....RRRRR.RR.
  ......RRRRRR..
  .......RRRR...
  ..............`)
// Divorziato due volte: il cuore rotto in tre pezzi
talento("Divorziato due volte", "mix", {}, `
  ..............
  ..RRR....RRR..
  .RRRRR..RRRRR.
  RRRRRRR.RRRRRR
  RRRRRR.RRRRRRR
  RRRRRR.RRRRRRR
  RRRRR..RRRRRRR
  .R...RR.RRRRR.
  ..RRRR.RRRRR..
  ...RRR.RRRR...
  ....RRR.RR....
  .....RR.R.....
  ......RR......
  ..............`)
// Tre figli piccoli: due fratelli grandi dietro e il piccolo davanti
talento("Tre figli piccoli", "mix", {},
  stamp("_t2bimbo", -1, -1, { swap: { N: "O", R: "B" } }),
  stamp("_t2bimbo", 7, -1, { swap: { N: "M", R: "R" } }),
  stamp("_t2bimbo", 3, 5, { swap: { N: "Y", R: "G" } }), t2netto)
// Guru dei social: pollice in su e cuoricino della notifica
talento("Guru dei social", "mix", {}, `
  ....FF...RR.RR
  ...FFFF..RRRRR
  ...FFFF...RRR.
  ...FFFF....R..
  ...FFFF.......
  ..FFFFFFFFFF..
  DDFFFFFFFFFFF.
  DDFFFFFffffff.
  DDFFFFFFFFFFF.
  DDFFFFFfffff..
  DDFFFFFFFFFF..
  DDFFFFFffff...
  DDFFFFFFFFF...
  ..............`)
// Cuoco provetto: il cappello da chef
talento("Cuoco provetto", "pos", { mx: true }, `
  ....WWW
  .WW.WWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  .WWWWWW
  ..WWWWW
  ..WWSWW
  ..WWSWW
  ..WWSWW
  ..WWSWW
  ..WWSWW
  ..WWWWW`)

foglio("foglio", 6)

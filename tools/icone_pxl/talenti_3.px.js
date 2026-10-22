// Talenti dei personaggi, terzo gruppo (37 icone 16×16: hobby, manie, customer service, relazioni industriali, promozione interna).
//   node .claude/skills/pxl-pixel-art/bin/pxl.js shot tools/icone_pxl/talenti_3.px.js foglio
include("comune.px.js", { palette: true })

// Job hopper: lo scatolone di chi se ne va, con la pianta e la foto della scrivania
talento("Job hopper", "mix", {}, `
  ..GG..........
  .GGGG.GG......
  GGgGGGGg.YYYYY
  .GGgGgGG.YLLLY
  ..GGGGG..YLLLY
  ...GgG...YhhhY
  nnnnnnnnnnnnnn
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNWWWWNNNNN
  NNNNNWWWWNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN`)
// Ipocondriaco: termometro e capsula
talento("Ipocondriaco", "mix", {}, `
  ...WW.........
  ..WWWW........
  ..WWWW........
  ..WRRW........
  ..WRRW........
  ..WRRW........
  ..WRRW........
  ..WRRW........
  ..RRRR........
  .RRRRRR..BBWW.
  .RRRRRR.BBBWWW
  .RRRRRR.BBBWWW
  ..RRRR...BBWW.
  ..............`)
// Collezionista di camion d'epoca: autocarro verde anni Cinquanta col cassone di legno
talento("Collezionista di camion d'epoca", "mix", {}, `
  ..............
  .......GGGG...
  .......GLLG...
  NNNNNN.GLLG...
  nnnnnn.GLLGG..
  NNNNNN.GGGGGGG
  nnnnnnNGGGGGGY
  NNNNNNNGGGGGGG
  dddddddddddddd
  .GGGG....GGGG.
  GGDDGG..GGDDGG
  .DSSD....DSSD.
  .DSSD....DSSD.
  ..DD......DD..`)
// Consigliere comunale: il municipio con la torre dell'orologio e il tricolore
talento("Consigliere comunale", "mix", {}, `
  ......SGGWWRR.
  ......SGGWWRR.
  ......S.......
  ....OOOOOO....
  ....OOWWOO....
  ....OWKWWO....
  ....OWKKWO....
  ....OOWWOO....
  .RRRRRRRRRRRR.
  RRRRRRRRRRRRRR
  .OOOOOOOOOOOO.
  .OLLOONNOOLLO.
  .OLLOONNOOLLO.
  .OOOOONNOOOOO.`)
// Cacciatore: il trofeo col cervo appeso in ufficio
talento("Cacciatore", "mix", { mx: true }, `
  C...C..
  C...C..
  CC.CC..
  .CCC...
  ..CC...
  NN.CNNN
  NNNNNNN
  ..NNNNN
  ...NKNN
  ...NKNN
  ...MNNN
  .MMMNNN
  .MMMNKK
  .MMMMMM`)
// Ex calciatore di serie C: il pallone a pentagoni (pezze scure D, così il contorno resta tondo)
talento("Ex calciatore di serie C", "mix", { mx: true, dopo: [grid(0, 0, `
  .....DD
  .....DD
  .......
  .......
  ......D
  DD...DD
  DD...DD
  D.....D
  .......
  .......
  .......
  ..DD...
  ...DD..`)] }, `
  .....WW
  ...WWWW
  ..WWWWW
  .WWWWWW
  .WWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  .WWWWWW
  .WWWWWW
  ..WWWWW
  ...WWWW
  .....WW`)
// Ha un cugino per tutto: il coltellino multiuso, lama e cavatappi aperti
talento("Ha un cugino per tutto", "pos", {}, `
  ..............
  .........SS...
  ........SSS...
  .......SSS....
  ......SSS..SS.
  .....SSS....SS
  ....SSS....SS.
  ...SSS......SS
  ..SSS......SS.
  .RRRRRRRRRRRR.
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  RRRRRRRRRRRRRR
  .RRRRRRRRRRRR.`)
// Allergico ai pollini: la margherita che sparge polline
talento("Allergico ai pollini", "neg", {}, `
  ...WWWW.......
  WW.WWWW.WW..Y.
  WWWWWWWWWW....
  .WWWYYWWW...Y.
  WWWYYYYWWW....
  WWWYYYYWWW.Y..
  .WWWYYWWW.....
  WWWWWWWWWW..Y.
  WW.WWWW.WW....
  ...WGGW.......
  ....GG.GG.....
  .GG.GGGGG.....
  .GGGGG........
  ....GG........`)
// Smemorato: i post-it uno sull'altro, quello davanti col punto di domanda
talento("Smemorato", "neg", { dopo: [grid(3, 5, `
  .RRR.
  RR.RR
  ...RR
  ..RR.
  ..RR.
  .....
  ..RR.`)] }, `
  OOOOOOO.......
  OOOOOOO.BBBBBB
  OOOOOOO.BBBBBB
  KKKKKKKKKKKKBB
  YYYYYYYYYYYKBB
  YYYYYYYYYYYKBB
  YYYYYYYYYYYKBB
  YYYYYYYYYYYKBB
  YYYYYYYYYYYKBB
  YYYYYYYYYYY...
  YYYYYYYYYYY...
  YYYYYYYYYYY...
  YYYYYYYYYYY...
  YYYYYYYYYYY...`)
// Golfista: la bandierina sul green e la pallina
talento("Golfista", "mix", {}, `
  ...WRRR.......
  ...WRRRRR.....
  ...WRRRRRRR...
  ...WRRRRR.....
  ...WRRR.......
  ...W..........
  ...W..........
  ...W..........
  ...W..........
  ...W......WW..
  .GGKGGGGGGWWG.
  GGKKKGGGGGGGGG
  GGGGGGGGGGGGGG
  .GGGGGGGGGGGG.`)
// Maniaco dell'ordine: il guanto bianco col dito impolverato
talento("Maniaco dell'ordine", "mix", {}, `
  ....sss.......
  ....sss.......
  ....WWW.......
  ....WWW.......
  ....WWWWWW....
  ....WWWSWWWW..
  .WW.WWWSWWSWW.
  WWWWWWWSWWSWW.
  WWWWWWWWWWSWW.
  .WWWWWWWWWWWW.
  ..WWWWWWWWWWW.
  ...WWWWWWWWW..
  ...DDDDDDDDD..
  ...DDDDDDDDD..`)
// Motociclista: il casco integrale rosso con la visiera
talento("Motociclista", "mix", {}, `
  ..............
  .....RRRRR....
  ...RRRRRRRRR..
  ..RRRRRRRRRRR.
  .RRRRRRRRRRRRR
  .RRRRRRRKKKKKK
  RRRRRRRKBBBBBB
  RRRRRRRKBBBBBB
  RRRRRRRKBBBBBB
  RRRRRRRRKKKKKK
  RRRRRRRRRRRRRR
  .RRRRRRRRRRRR.
  ..DDDDDDDDDD..
  ..............`)
// Complottista: il cappello di carta stagnola e lo sguardo di traverso
talento("Complottista", "neg", {}, `
  ......SS......
  .....SSSS.....
  .....SsSS.....
  ....SSSSsS....
  ...SSsSSSSS...
  ..SSSSSSsSSS..
  .SSsSSSSSSSsS.
  ..FFFFFFFFFF..
  ..FFffFFFffF..
  .FFFFKFFFFKFF.
  .FFFFKFFFFKFF.
  ..FFFFFFFFFF..
  ...FFFKKKFF...
  ....FFFFFF....`)
// Nostalgico della lira: la moneta d'argento col simbolo della lira
sprite("_lira", { w: 14, h: 14, mx: true }, `
  .....SS
  ...SSSS
  ..SSSSS
  .SSSSSS
  .SSSSSS
  SSSSSSS
  SSSSSSS
  SSSSSSS
  SSSSSSS
  .SSSSSS
  .SSSSSS
  ..SSSSS
  ...SSSS
  .....SS`)
talento("Nostalgico della lira", "mix", { dopo: [grid(4, 3, `
  ..sss.
  .ss..s
  .ss...
  sssss.
  .ss...
  sssss.
  .ss...
  ssssss`)] }, stamp("_lira", 0, 0))
// Cantautore incompreso: la chitarra acustica
talento("Cantautore incompreso", "mix", {}, `
  ...........MM.
  ..........MMMM
  ..........MMM.
  .........MM...
  ........MM....
  .......MM.....
  ...OOOMM......
  ..OOOOMOO.....
  ...OOKKOOO....
  .OOOKKOOOO....
  OOOOOOOOO.....
  OOOMMOOOOO....
  OOOOOOOOOO....
  .OOOOOOOO.....`)
// Gatto in ufficio: Bancale, il gatto rosso seduto sul pallet
talento("Gatto in ufficio", "pos", {}, `
  .OO....OO.....
  .OeO..OeO.....
  .OOOooOOO.....
  .OOOOOOOO.....
  .OOKOOKOO.....
  .OOKOOKOO.....
  .OOOeeOOO.....
  ..OOOOOO...OO.
  ..OOOOOOO..OO.
  .OOOOOOOOO.OO.
  .OOOOOOOOOOOO.
  NNNNNNNNNNNNNN
  NN..NN..NN..NN
  NNNNNNNNNNNNNN`)
// Ottimista patologico: il sole con gli occhiali da sole che sorride
talento("Ottimista patologico", "mix", { mx: true }, `
  ......O
  .O....O
  ..O....
  ....YYY
  ...YYYY
  ..YKKKK
  OOYKKKY
  OOYYKKY
  ..YYKYY
  ...YYKK
  ....YYY
  ..O....
  .O....O
  ......O`)
// Pessimista cosmico: la nuvola nera del temporale, col fulmine e la pioggia
talento("Pessimista cosmico", "mix", {}, `
  ......DDD.....
  ..DD.DDDDD....
  .DDDDDDDDDDD..
  DDDDDDDDDDDDD.
  DDDDDDDDDDDDDD
  .DDDDDDDDDDDD.
  ......YY......
  .B...YY....B..
  .B..YYYYY..B..
  ......YY......
  ..B..YY....B..
  ..B..Y.....B..
  ..............
  ..............`)
// Pignolo sulle virgole: la lente d'ingrandimento sopra un punto e virgola
talento("Pignolo sulle virgole", "mix", { tieni: "L", dopo: [grid(4, 2, `
  RR
  RR
  ..
  RR
  RR
  R.`)] }, `
  ...DDDD.......
  .DDLLLLDD.....
  .DLLLLLLD.....
  DLLLLLLLLD....
  DLLLLLLLLD....
  DLLLLLLLLD....
  DLLLLLLLLD....
  .DLLLLLLD.....
  .DDLLLLDDNN...
  ...DDDDNNNN...
  ........NNNN..
  .........NNNN.
  ..........NNNN
  ...........NNN`)
// Fortunato al gratta e vinci: il biglietto col 7 7 da grattare e la monetina
talento("Fortunato al gratta e vinci", "pos", { tieni: "W" }, `
  OOOOOOOOOOOOOO
  OWWWWWWWWWWWWO
  OWRRRWRRRWSSSO
  OWWWRWWWRWSSSO
  OWWRWWWRWWSSSO
  OWWRWWWRWWSSSO
  OWWWWWWWWWSSSO
  OOOOOOOOOKKKKO
  OOOOOOOOKYYYYK
  OOOOOOOKYYYYYY
  ........YYYYYY
  ........YYYYYY
  ........YYYYYY
  .........YYYY.`)
// Venuto dalla strada: la cassetta di frutta dell'ortomercato
talento("Venuto dalla strada", "mix", {}, `
  ..............
  .....G........
  .OOO.GRR..OOO.
  OOOOKRRRRKOOOO
  OOOOKRRRRKOOOO
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  ..............
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  ..............
  NNNNNNNNNNNNNN
  NNNNNNNNNNNNNN
  ..............`)
// Spirito bellicoso: il guantone da boxe, col pollice staccato e il polsino a fascia bianca
talento("Spirito bellicoso", "mix", {}, `
  ...RRRRRR.....
  ..RRRRRRRR....
  .RRRRRRRRRR...
  .RRRRRRRRRR...
  .RRRRRRRRRRR..
  .RRRRRRRRKRRR.
  .RRRRRRRKRRRRR
  .RRRRRRRKRRRRR
  .RRRRRRRRKRRR.
  ..RRRRRRRRRR..
  ..RRRRRRRRR...
  ..WWWWWWWWW...
  ..RRRRRRRRR...
  ..RRRRRRRRR...`)
// Cuore d'oro: il cuore d'oro
talento("Cuore d'oro", "pos", { mx: true }, `
  .......
  ..YYY..
  .YYYYY.
  YYYYYYY
  YYYYYYY
  YYYYYYY
  YYYYYYY
  .YYYYYY
  ..YYYYY
  ...YYYY
  ....YYY
  .....YY
  ......Y
  .......`)
// Amante dell'IA: il robottino viola innamorato, col cuore sull'antenna
talento("Amante dell'IA", "mix", { mx: true }, `
  ....RR.
  ....RRR
  .....RR
  ......R
  ......P
  .PPPPPP
  .PPPPPP
  DPPdddd
  DPPduud
  DPPduud
  DPPdddd
  .PPPPPP
  .PPPPPP
  .......`)
// Larper: Elrandil, l'elfo coi capelli biondi lunghi e le orecchie a punta
talento("Larper", "mix", { mx: true, tieni: "Y" }, `
  ....YYY
  ...YYYY
  ..YYYYY
  F.YYYYY
  FFYYYFF
  .FFYFFF
  ..YFFKF
  ..YFFKF
  ..YFFFF
  ..YYFFK
  ..YYYFF
  ..YGGGG
  .YGGGGY
  GGGGGGG`)
// Guerrafondaio: il softarista con l'elmetto mimetico e il trucco da battaglia
talento("Guerrafondaio", "mix", {}, `
  ....GGGGGG....
  ..GGNNGGGgGG..
  .GGNNGGGGGGNG.
  .GGGGGgGGGNNG.
  GGgGGGGGNNGGGG
  GGGGNNGGGGGgGG
  GGGGGGGGGGGGGG
  ..FFFFFFFFFF..
  ..FFKFFFFKFF..
  ..FFKFFFFKFF..
  ..FggFFFFggF..
  ..FFFFKKFFFF..
  ...FFFFFFFF...
  ....GGGGGG....`)
// Otaku: l'onigiri kawaii
talento("Otaku", "mix", { mx: true, dopo: [grid(0, 0, `
  .......
  .......
  .......
  .......
  .......
  .......
  ....K..
  ....K..
  ..ee..K
  .......
  ....DDD
  ....DDD
  ....DDD
  ....DDD`)] }, `
  ......W
  .....WW
  ....WWW
  ....WWW
  ...WWWW
  ...WWWW
  ..WWWWW
  ..WWWWW
  .WWWWWW
  .WWWWWW
  WWWWWWW
  WWWWWWW
  WWWWWWW
  .WWWWWW`)
// Musicista: il rullante con le bacchette incrociate
talento("Musicista", "mix", { mx: true }, `
  ..NN...
  ...NN..
  ....NN.
  .....NN
  ....NN.
  ...NN..
  .WNNWWW
  WWWWWWW
  SSSSSSS
  YRRRYRR
  RYRYRYR
  RRYRRRY
  SSSSSSS
  .......`)
// Voce da call center: la cuffia col microfono attorno a un cuore
talento("Voce da call center", "pos", {}, `
  ....DDDDDD....
  ..DDD....DDD..
  .DD........DD.
  .D..........D.
  DD..........DD
  TTT.RR..RR.TTT
  TTT.RRRRRR.TTT
  TTT.RRRRRR.TTT
  TTT..RRRR..TTT
  TTT...RR...TTT
  .D............
  .DD...........
  ..DDDDDD......
  ..............`)
// Risponde anche alle 23: il telefono che squilla alle 23 sotto la luna
talento("Risponde anche alle 23", "mix", { tieni: "S", dopo: [grid(2, 3, `
  iii.iii
  ..i...i
  iii.iii
  i.....i
  iii.iii`)] }, `
  ..........YY..
  SSSSSSSSS..YY.
  SdddddddS...YY
  SdddddddS...YY
  SdddddddS..YY.
  SdddddddS.YY..
  SdddddddS.....
  SdddddddS.....
  SdddddddS.....
  SdddddddS.....
  SdddddddS.....
  SSSSSSSSS.....
  SSSSDSSSS.....
  SSSSSSSSS.....`)
// Promette tutto: il fumetto col «SÌ!» grande, a qualsiasi richiesta
talento("Promette tutto", "mix", { tieni: "W", dopo: [grid(2, 1, `
  ......K...
  .......K..
  .KKK..KK.KK
  KK....KK.KK
  .KK...KK.KK
  ..KK..KK...
  KKK...KK.KK`)] }, `
  .WWWWWWWWWWWW.
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  WWWWWWWWWWWWWW
  .WWWWWWWWWWWW.
  ..WWW.........
  ..WW..........
  .WW...........
  ..............`)
// Maniaco delle procedure: la lista di controllo con tutte le spunte
talento("Maniaco delle procedure", "pos", { tieni: "W" }, `
  .WWWWWWWWW....
  .WWWWWWWWWS...
  .WWWWWWWWWSS..
  .WWWGWWWWWWWW.
  .WGWGjjjjjjWW.
  .WWGWWWWWWWWW.
  .WWWWWWWWWWWW.
  .WWWGWWWWWWWW.
  .WGWGjjjjjjWW.
  .WWGWWWWWWWWW.
  .WWWWWWWWWWWW.
  .WWWGWWWWWWWW.
  .WGWGjjjjjWWW.
  .WWGWWWWWWWWW.`)
// Vive di raccoglitori: tre raccoglitori ad anelli, il rosso del 1994 sporge
talento("Vive di raccoglitori", "mix", { tieni: "W" }, `
  .....RRRR.....
  BBBB.RRRR.....
  BWWB.RWWR.GGGG
  BWWB.RWWR.GWWG
  BWWB.RWWR.GWWG
  BBBB.RRRR.GWWG
  BBBB.RRRR.GGGG
  BBBB.RRRR.GGGG
  BKKB.RKKR.GGGG
  BKKB.RKKR.GKKG
  BBBB.RRRR.GKKG
  BBBB.RRRR.GGGG
  BBBB.RRRR.GGGG
  BBBB.RRRR.GGGG`)
// Pugno di ferro: il pugno nel guanto d'arme
talento("Pugno di ferro", "mix", {}, `
  ..............
  .SS.SS.SS.SS..
  .SSsSSsSSsSSS.
  .SSsSSsSSsSSS.
  .SSsSSsSSsSSS.
  SSssssssSSSSS.
  SSSSSSSsSSSSS.
  SSSSSSSSSSSSS.
  .SSSSSSSSSSSS.
  ..SSSSSSSSSS..
  ..DDDDDDDDDD..
  ..DDDDDDDDDD..
  ..DDDDDDDDDD..
  ..DDDDDDDDDD..`)
// Mediatore nato: la colomba della pace col ramoscello d'ulivo
talento("Mediatore nato", "pos", {}, `
  .........WW...
  ........WWW...
  .......WWWW...
  ......WWWWS...
  .WW..WWWWS....
  WWWWWWWWS.....
  OWKWWWWWWWWW..
  .WWWWWWWWWWWWW
  .GWWWWWWWWWWW.
  GGG.WWWWWWWWWW
  .G.....SSS....
  ..............
  ..............
  ..............`)
// Amico del delegato: le carte da briscola (coppe e denari)
talento("Amico del delegato", "pos", { tieni: "W" }, `
  WWWWWWWW......
  WWWWWWWW......
  WRRRWWWW......
  WRRRWKKK......
  WWRWWKWWWWWWWW
  WRRRWKWWWWWWWW
  WWWWWKWWWYYYYW
  WWWWWKWWYYYYYY
  WWWWWKWWYYRRYY
  WWWWWKWWYYRRYY
  WWWWWKWWYYYYYY
  ......WWWYYYYW
  ......WWWWWWWW
  ......WWWWWWWW`)

// Cresciuto in banchina: il germoglio che spunta da un bancale (chi è diventato manager dopo un anno di affiancamento)
talento("Cresciuto in banchina", "pos", {}, `
  ...........GG.
  .........GGGgG
  .GG.....GGGgGG
  GgGG...GGGgGG.
  GGgGG..GGgGG..
  .GGgGG.GgGG...
  ..GGgGGgGG....
  ....GgGG......
  .....GG.......
  .....GG.......
  .....GG.......
  NNNNNNNNNNNNNN
  NN..NN..NN..NN
  NNNNNNNNNNNNNN`)

foglio("foglio")

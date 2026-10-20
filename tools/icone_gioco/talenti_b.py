"""Talenti 16x16 (gruppo B): T[nome] = (tipo, funzione che restituisce 16 righe da 16 lettere)."""
import math
from motore import Cv, process, overlay

T = {}
E = '.'*16

def heart(c, col, cx=7.5, top=5.4, r=3.3, tip=13):
    c.disc(cx-2.5, top, r, col); c.disc(cx+2.5, top, r, col)
    for y in range(int(top), tip+1):
        half = (cx+2.5+r-0.5 - cx) * (tip - y) / (tip - top)
        c.rect(int(round(cx-half)), y, int(round(cx+half)), y, col)

def comunicazione():
    # tavolozza del pittore e pennello: il logo rifatto tre volte
    c = Cv(16)
    c.disc(7.0, 7.5, 6.0, 'N'); c.disc(11.6, 11.2, 2.4, '.')
    c.clear_disc(4.0, 10.2, 1.2)
    c.line(14, 7, 9, 13, 'S'); c.line(14, 8, 10, 13, 'S'); c.rect(8, 13, 9, 14, 'K')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '.....RR..YY.....',
        '.....RR..YY.....',
        '................',
        '..BB....GG......',
        '..BB....GG......',
        '..........W.....',
        '................',
        '................',
        '................',
        '................',
        '........KK......'])
T['Laureato in scienze della comunicazione'] = ('mix', comunicazione)

def medicina():
    # borsa del dottore con la croce
    c = Cv(16)
    c.rect(1, 5, 14, 13, 'N'); c.set(1, 5, '.'); c.set(14, 5, '.')
    c.rect(5, 2, 10, 4, 'D'); c.rect(7, 3, 8, 4, '.')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E,
        '................',
        '.......WW.......',
        '.......WW.......',
        '.....WWWWWW.....',
        '.....WWWWWW.....',
        '.......WW.......',
        '.......WW.......'])
T['Medicina, mai finita'] = ('mix', medicina)

def supply():
    # scatolone sul pallet con l'orologio del lead time
    c = Cv(16)
    c.rect(2, 4, 11, 10, 'N')
    c.rect(1, 12, 14, 12, 'k'); c.rect(1, 13, 2, 13, 'k'); c.rect(7, 13, 8, 13, 'k'); c.rect(13, 13, 14, 13, 'k')
    c.disc(11.5, 4.5, 3.1, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E,
        '...........K....',
        '...........K....',
        '......kk...KKK..',
        '......kk........',
        '......kk........',
        '......kk........',
        '......kk........'])
T['Master in supply chain'] = ('pos', supply)

def mba():
    # cabina del telefono di Londra
    c = Cv(16)
    c.rect(4, 2, 11, 14, 'R'); c.rect(5, 1, 10, 1, 'R')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '.....WWWWWW.....',
        '................',
        '.....LL..LL.....',
        '.....LL..LL.....',
        '................',
        '.....LL..LL.....',
        '.....LL..LL.....',
        '................',
        '.....LL..LL.....',
        '................',
        '..........K.....'])
T["MBA all'estero"] = ('mix', mba)

def dottorato():
    # microscopio
    g = ['................',
         '...DD...........',
         '...DDD..........',
         '....DDD.........',
         '.....DDD..DD....',
         '......DDDDDD....',
         '.......DDDDD....',
         '........S..DD...',
         '.......SSS.DD...',
         '...PPPPPPP.DD...',
         '...........DD...',
         '..........DDD...',
         '......DDDDDDD...',
         '...DDDDDDDDDDD..',
         '...DDDDDDDDDDD..',
         '................']
    return process(g)
T['Dottorato di ricerca'] = ('mix', dottorato)

def fuoricorso():
    # clessidra
    g = ['................',
         '...NNNNNNNNNN...',
         '...NNNNNNNNNN...',
         '...N.LLLLLL.N...',
         '...N.LYYYYL.N...',
         '...N..LYYL..N...',
         '...N...LL...N...',
         '...N...YL...N...',
         '...N...LL...N...',
         '...N..LYYL..N...',
         '...N.LYYYYL.N...',
         '...N.YYYYYY.N...',
         '...N.YYYYYY.N...',
         '...NNNNNNNNNN...',
         '...NNNNNNNNNN...',
         '................']
    return process(g, keep='L')
T['Fuoricorso eterno'] = ('neg', fuoricorso)

def autodidatta():
    # pila di manuali
    c = Cv(16)
    c.rect(1, 11, 13, 13, 'R'); c.rect(2, 8, 12, 10, 'B'); c.rect(3, 5, 14, 7, 'G'); c.rect(4, 2, 11, 4, 'Y')
    r = process(c.rows())
    return overlay(r, [E, E,
        '..........W.....',
        '..........W.....',
        '................',
        '.............W..',
        '.............W..',
        '................',
        '...........W....',
        '...........W....',
        '................',
        '............W...',
        '............W...'])
T['Autodidatta'] = ('mix', autodidatta)

def pendolare():
    # muso del treno regionale
    c = Cv(16)
    c.rect(2, 2, 13, 13, 'B'); c.set(2, 2, '.'); c.set(13, 2, '.')
    c.rect(4, 14, 5, 14, 'D'); c.rect(10, 14, 11, 14, 'D')
    r = process(c.rows())
    return overlay(r, [E, E,
        '................',
        '....KKKKKKKK....',
        '...LLLLLLLLLL...',
        '...LLLLLLLLLL...',
        '...LLLLLLLLLL...',
        '................',
        '..WWWWWWWWWWWW..',
        '................',
        '...YY......YY...',
        '................',
        '..DDDDDDDDDDDD..'])
T['Pendolare della Torino-Milano'] = ('mix', pendolare)

def vegano():
    # carota
    c = Cv(16)
    for i in range(30):
        t = i/29; c.disc(10.2 - 7*t, 5.2 + 7.6*t, 2.6 - 2.1*t, 'O')
    c.line(11, 3, 13, 1, 'G'); c.line(12, 4, 14, 2, 'G'); c.line(10, 3, 10, 1, 'G'); c.line(11, 4, 14, 3, 'G'); c.line(10, 2, 12, 1, 'G')
    r = process(c.rows())
    return overlay(r, [E, E, E, E,
        '................',
        '.......o........',
        '.........o......',
        '......o.........',
        '........o.......',
        '.....o..........'])
T['Vegano convinto'] = ('mix', vegano)

def multe():
    # autovelox con il flash
    c = Cv(16)
    c.rect(2, 3, 11, 9, 'D'); c.rect(6, 10, 7, 13, 'S'); c.rect(4, 14, 9, 14, 'S')
    c.disc(5.5, 6, 2.3, 'L')
    r = process(c.rows(), keep='L')
    return overlay(r, [
        '..............Y.',
        '.............Y..',
        '................',
        '.............YY.',
        '................',
        '.....KK......Y..',
        '.....KK.......Y.',
        '................',
        '.........RR.....'])
T['Collezionista di multe'] = ('neg', multe)

def karaoke():
    # microfono con la corona
    c = Cv(16)
    c.set(4, 1, 'Y'); c.rect(7, 1, 8, 1, 'Y'); c.set(11, 1, 'Y')
    c.rect(4, 2, 5, 2, 'Y'); c.rect(7, 2, 8, 2, 'Y'); c.rect(10, 2, 11, 2, 'Y'); c.rect(4, 3, 11, 3, 'Y')
    c.disc(7.5, 7, 3.2, 'S')
    c.rect(6, 10, 9, 11, 'D'); c.rect(7, 12, 8, 14, 'D')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E,
        '......s.s.......',
        '.....s.s.s......',
        '......s.s.s.....',
        '.....s.s.s......',
        '......s.s.......'])
T['Re del karaoke'] = ('pos', karaoke)

def fumatore():
    # posacenere pieno, con l'ultima sigaretta ancora accesa
    c = Cv(16)
    c.rect(2, 10, 13, 10, 'S'); c.rect(1, 11, 14, 13, 'S'); c.rect(2, 14, 13, 14, 'S')
    c.line(3, 9, 12, 5, 'W'); c.line(3, 8, 12, 4, 'W')
    c.rect(4, 9, 5, 9, 'W'); c.rect(8, 9, 9, 9, 'W')
    c.set(13, 1, 'S'); c.set(12, 2, 'S'); c.set(13, 3, 'S')
    r = process(c.rows(), keep='W')
    fix = [list(E) for _ in range(16)]
    fix[8][3] = 'O'; fix[9][3] = 'O'; fix[8][4] = 'O'; fix[4][12] = 'R'; fix[5][12] = 'R'; fix[9][4] = 'O'; fix[9][8] = 'O'
    fix[10][3] = 'd'; fix[10][4] = 'd'; fix[10][5] = 'd'; fix[10][6] = 'd'; fix[10][7] = 'd'; fix[10][8] = 'd'; fix[10][9] = 'd'; fix[10][10] = 'd'; fix[10][11] = 'd'; fix[10][12] = 'd'
    return overlay(r, [''.join(f) for f in fix])
T['Fumatore incallito'] = ('mix', fumatore)

def maratoneta():
    # scarpa da corsa
    g = ['................',
         '................',
         '................',
         '..RRRR..........',
         '..RRRRR.........',
         '..RRRRRR........',
         '..RRRRRRR.......',
         '..RRRRRRRR......',
         '..RRRRRRRRRR....',
         '..RRRRRRRRRRRR..',
         '..RRRRRRRRRRRRR.',
         '..RRRRRRRRRRRRR.',
         '.WWWWWWWWWWWWWW.',
         '.ssssssssssssss.',
         '................',
         '................']
    r = process(g, keep='W')
    return overlay(r, [E, E, E,
        '...KK...........',
        '................',
        '.......W........',
        '........W.......',
        '.........W......',
        '................',
        '................',
        '..r.............'])
T['Maratoneta'] = ('pos', maratoneta)

def superstizioso():
    # cornetto rosso con il cappuccio dorato, appeso
    c = Cv(16)
    pts = [(5.0, 5.0, 2.7), (6.6, 6.3, 2.4), (8.0, 7.8, 2.1), (9.2, 9.3, 1.7), (10.2, 10.8, 1.3), (11.0, 12.2, 0.9), (11.6, 13.4, 0.5)]
    for (x0, y0, r0), (x1, y1, r1) in zip(pts, pts[1:]):
        for k in range(8):
            t = k/7; c.disc(x0 + (x1-x0)*t, y0 + (y1-y0)*t, r0 + (r1-r0)*t, 'R')
    c.disc(3.6, 3.6, 2.2, 'Y'); c.ring(2.2, 2.2, 1.6, 0.6, 'Y')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E,
        '................',
        '......r.........',
        '........r.......',
        '.........r......'])
T['Superstizioso'] = ('mix', superstizioso)

def divorziato():
    # cuore spezzato
    c = Cv(16)
    heart(c, 'R')
    for (x, y) in [(8, 2), (7, 3), (7, 4), (8, 5), (8, 6), (7, 7), (7, 8), (8, 9), (8, 10), (7, 11), (7, 12), (7, 13)]:
        c.set(x, y, '.')
    return process(c.rows())
T['Divorziato due volte'] = ('neg', divorziato)

def tre_figli():
    # tre bambini di altezze diverse
    c = Cv(16)
    c.disc(2.5, 6, 1.6, 'F'); c.rect(1, 8, 4, 12, 'R'); c.rect(1, 13, 1, 14, 'D'); c.rect(4, 13, 4, 14, 'D')
    c.disc(7.5, 3.5, 1.8, 'F'); c.rect(6, 6, 9, 11, 'B'); c.rect(6, 12, 6, 14, 'D'); c.rect(9, 12, 9, 14, 'D')
    c.disc(12.5, 7, 1.5, 'F'); c.rect(11, 9, 14, 12, 'Y'); c.rect(11, 13, 11, 14, 'D'); c.rect(14, 13, 14, 14, 'D')
    r = process(c.rows())
    return overlay(r, [E,
        '................',
        '......NNNN......',
        '................',
        '.NNN............',
        '...........NNN..'])
T['Tre figli piccoli'] = ('mix', tre_figli)

def social():
    # pollice in su con la notifica
    g = ['................',
         '......FF........',
         '......FFF.......',
         '......FFF.......',
         '.....FFFF.......',
         '.....FFFFFFFF...',
         '.BBB.FFFFFFFFF..',
         '.BBB.FFFFFFFF...',
         '.BBB.FFFFFFFFF..',
         '.BBB.FFFFFFFF...',
         '.BBB.FFFFFFFFF..',
         '.BBB.FFFFFFFF...',
         '.BBB.FFFFFFF....',
         '................',
         '................',
         '................']
    r = process(g)
    r = overlay(r, [E, E, E, E, E, E,
        '.........ffff...',
        '................',
        '.........ffff...',
        '................',
        '.........ffff...'])
    c = Cv(16); c.disc(12.5, 2.5, 1.9, 'R')
    b = process(c.rows())
    return overlay(r, [x.replace('.', '.') for x in [b[0], b[1], b[2], b[3], b[4]]])
T['Guru dei social'] = ('mix', social)

def cuoco():
    # cappello da chef
    c = Cv(16)
    c.disc(4.5, 5, 2.8, 'W'); c.disc(8, 3.8, 3.0, 'W'); c.disc(11.5, 5, 2.8, 'W'); c.rect(3, 5, 12, 9, 'W')
    c.rect(4, 10, 11, 13, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E, E, E, E, E,
        '................',
        '................',
        '....SSSSSSSS....',
        '.....s..s..s....',
        '.....s..s..s....',
        '....ssssssss....'])
T['Cuoco provetto'] = ('pos', cuoco)

def job_hopper():
    # scatolone dell'ufficio: pianta, fogli e tazza, di nuovo
    c = Cv(16)
    c.disc(4, 5, 2.2, 'G'); c.rect(4, 6, 4, 8, 'G')
    c.rect(6, 2, 9, 7, 'W')
    c.rect(11, 5, 13, 8, 'R'); c.set(14, 6, 'R')
    c.rect(2, 9, 13, 14, 'N')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E,
        '.......KK.......',
        '................',
        '.......KK.......',
        '................',
        '................',
        '................',
        '..kkkkkkkkkkkk..'])
T['Job hopper'] = ('mix', job_hopper)

def ipocondriaco():
    # termometro e pillola
    c = Cv(16)
    for i in range(20):
        t = i/19; c.disc(4 + 7.5*t, 10.5 - 7.5*t, 1.1, 'W')
    c.disc(3.3, 11.2, 2.1, 'R')
    c.rect(10, 11, 14, 13, 'B'); c.rect(12, 11, 14, 13, 'W')
    r = process(c.rows(), keep='W')
    fix = [list(E) for _ in range(16)]
    for i in range(5):
        fix[10-i][4+i] = 'R'
    return overlay(r, [''.join(f) for f in fix])
T['Ipocondriaco'] = ('neg', ipocondriaco)

def camion_epoca():
    # autocarro del 1958: cassone di legno, cabina tonda, cofano lungo
    g = ['................',
         '................',
         '................',
         '........GGGG....',
         '.......GGGGGG...',
         '.......GLLLGG...',
         'NNNNNNNGLLLGGGG.',
         'NNNNNNNGGGGGGGG.',
         'NNNNNNNGGGGGGGG.',
         'NNNNNNNGGGGGGGG.',
         '.DDDDDDDDDDDDDD.',
         '..DD......DD....',
         '..DD......DD....',
         '................',
         '................',
         '................']
    c = Cv(16); c.paste(0, 0, g); c.rect(0, 6, 0, 9, '.')
    c.disc(4, 11.5, 2.2, 'D'); c.disc(11.5, 11.5, 2.2, 'D')
    r = process(c.rows(), keep='L')
    return overlay(r, [E, E, E, E, E, E,
        '..k..k..........',
        '..k..k.........S',
        '..k..k.........S',
        E,
        E,
        '....S......S....'])
T["Collezionista di camion d'epoca"] = ('mix', camion_epoca)

def consigliere():
    # la rotonda davanti al magazzino, vista dall'alto
    c = Cv(16)
    c.rect(6, 1, 9, 14, 'S'); c.rect(1, 6, 14, 9, 'S')
    c.disc(7.5, 7.5, 5.0, 'S')
    c.disc(7.5, 7.5, 2.6, 'G')
    r = process(c.rows())
    return overlay(r, [E,
        '................',
        '................',
        '.......W........',
        '................',
        '................',
        '................',
        '..W....YY....W..',
        '.......YY.......',
        '................',
        '................',
        '..........OO....',
        '.......W..OO....'])
T['Consigliere comunale'] = ('mix', consigliere)

def cacciatore():
    # trofeo con le corna sulla targa di legno
    c = Cv(16)
    c.line(5, 7, 2, 2, 'M'); c.line(4, 5, 1, 5, 'M'); c.line(3, 3, 3, 1, 'M')
    c.line(10, 7, 13, 2, 'M'); c.line(11, 5, 14, 5, 'M'); c.line(12, 3, 12, 1, 'M')
    c.line(5, 6, 4, 3, 'M'); c.line(10, 6, 11, 3, 'M')
    c.rect(6, 6, 9, 10, 'k'); c.rect(7, 11, 8, 11, 'k')
    c.rect(4, 12, 11, 13, 'N'); c.rect(5, 14, 10, 14, 'N')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E, E,
        '......K..K......',
        E, E,
        '.......KK.......'])
T['Cacciatore'] = ('mix', cacciatore)

def calciatore():
    # pallone da calcio: pentagono al centro e cinque mezze toppe sul bordo
    c = Cv(16)
    c.disc(7.5, 7.5, 6.3, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E,
        '................',
        '......KKKK......',
        '.......ss.......',
        '..KK...ss...KK..',
        '.KKKs.....sKKKK.',
        '.KKs...KK...sKK.',
        '......KKKK......',
        '......KKKK......',
        '.......KK.......',
        '.KKKs......sKKK.',
        '..KKK.s..s.KKK..',
        '...KK.s..s.KK...',
        '......s..s......'])
T['Ex calciatore di serie C'] = ('mix', calciatore)

def cugino():
    # coltellino multiuso: un attrezzo per ogni cugino
    c = Cv(16)
    c.rect(2, 9, 13, 12, 'R'); c.set(2, 9, '.'); c.set(13, 9, '.'); c.set(2, 12, '.'); c.set(13, 12, '.')
    c.line(4, 8, 2, 2, 'S'); c.line(5, 8, 3, 2, 'S'); c.line(3, 4, 3, 2, 'S')
    c.rect(7, 2, 8, 8, 'S'); c.set(7, 1, 'S')
    c.line(10, 8, 12, 4, 'S'); c.line(11, 8, 13, 4, 'S'); c.set(13, 3, 'S'); c.set(12, 3, 'S')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E, E, E, E,
        '................',
        '...S........S...',
        '................'])
T['Ha un cugino per tutto'] = ('pos', cugino)

def pollini():
    # fiore e polline
    c = Cv(16)
    for k in range(5):
        a = -math.pi/2 + k*2*math.pi/5
        c.disc(7.5 + 3.0*math.cos(a), 6 + 3.0*math.sin(a), 2.0, 'W')
    c.disc(7.5, 6, 1.8, 'Y')
    c.rect(7, 10, 8, 14, 'G'); c.rect(3, 11, 6, 12, 'G'); c.rect(9, 12, 11, 13, 'G')
    r = process(c.rows(), keep='W')
    return overlay(r, [
        '..y..........y..',
        '................',
        '.............y..',
        'y...............',
        '................',
        '..............y.'])
T['Allergico ai pollini'] = ('neg', pollini)

def smemorato():
    # post-it, uno sopra l'altro
    c = Cv(16)
    c.rect(5, 1, 14, 9, 'h')
    c.rect(1, 5, 10, 14, 'Y')
    r = process(c.rows())
    return overlay(r, [E, E,
        '.......hhhhh....',
        '................',
        '................',
        '................',
        '....KKK.........',
        '...K...K........',
        '.......K........',
        '.....KK.........',
        '.....K..........',
        '................',
        '.....K..........',
        '.........y......'])
T['Smemorato'] = ('neg', smemorato)

def golfista():
    # bandierina in buca e pallina
    c = Cv(16)
    c.rect(1, 12, 14, 14, 'G'); c.rect(2, 11, 13, 11, 'G')
    c.rect(5, 1, 5, 11, 'S')
    for y in range(1, 7):
        w = 6 - abs(y-3.5)*1.6
        c.rect(6, y, 6 + int(round(w)), y, 'R')
    c.disc(11.5, 9.5, 1.5, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E, E, E, E, E, E, E, E,
        '....KK..........'])
T['Golfista'] = ('mix', golfista)

def ordine():
    # guanto bianco: il dito alzato, sporco di polvere
    g = ['................',
         '.....WW.........',
         '.....WW.........',
         '.....WW.........',
         '.....WW.........',
         '.....WWWWWWW....',
         '.....WWWWWWWW...',
         '..WW.WWWWWWWW...',
         '..WWWWWWWWWWW...',
         '...WWWWWWWWWW...',
         '....WWWWWWWW....',
         '....WWWWWWWW....',
         '....SSSSSSSS....',
         '....SSSSSSSS....',
         '................',
         '................']
    r = process(g, keep='W')
    return overlay(r, [E,
        '.....ss.........',
        '.....s..........',
        E, E, E,
        '.......S.S.S....',
        '................',
        '................',
        E, E, E,
        '................',
        '....ssssssss....'])
T["Maniaco dell'ordine"] = ('mix', ordine)

def motociclista():
    # casco da moto con la visiera
    c = Cv(16)
    c.disc(7, 7.5, 6.0, 'R'); c.rect(0, 13, 15, 15, '.')
    c.rect(9, 9, 13, 12, 'R')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '...WWW..........',
        '..WW............',
        '..W.............',
        '........KKKKK...',
        '........KDDDDK..',
        '........KDDDDK..',
        '.........KKKKK..'])
T['Motociclista'] = ('mix', motociclista)

def complottista():
    # cappello di stagnola e occhi sospettosi
    c = Cv(16)
    for y in range(1, 8):
        h = (y-1)*0.95
        c.rect(int(round(7.5-h)), y, int(round(7.5+h)), y, 'S')
    c.rect(4, 8, 11, 13, 'F'); c.set(4, 13, '.'); c.set(11, 13, '.')
    r = process(c.rows())
    return overlay(r, [E, E,
        '.......s........',
        '......s.s.......',
        '.....s...s......',
        '....s..s..s.....',
        '...s.s...s.s....',
        '................',
        '................',
        '.....WK..WK.....',
        '................',
        '................',
        '......KfKf......'])
T['Complottista'] = ('neg', complottista)

def lira():
    # moneta d'argento con il simbolo della lira
    c = Cv(16)
    c.disc(7.5, 7.5, 6.3, 'S')
    r = process(c.rows())
    return overlay(r, [E, E,
        '................',
        '.......dddd.....',
        '......dd..dd....',
        '......dd........',
        '....dddddd......',
        '......dd........',
        '....dddddd......',
        '......dd........',
        '.....dddddddd...',
        '................'])
T['Nostalgico della lira'] = ('mix', lira)

def cantautore():
    # chitarra acustica
    c = Cv(16)
    c.disc(5.2, 10.6, 3.4, 'N'); c.disc(7.6, 7.9, 2.5, 'N')
    c.line(9, 7, 12, 3, 'M'); c.line(10, 7, 13, 3, 'M'); c.line(9, 6, 12, 2, 'M')
    c.rect(12, 1, 14, 2, 'M')
    r = process(c.rows())
    fix = [list(E) for _ in range(16)]
    for (x, y) in [(5, 10), (6, 10), (5, 11), (6, 11), (6, 9), (4, 10)]:
        fix[y][x] = 'K'
    fix[12][4] = 'M'; fix[12][5] = 'M'; fix[12][6] = 'M'
    return overlay(r, [''.join(f) for f in fix])
T['Cantautore incompreso'] = ('mix', cantautore)

def ottimista():
    # sole con gli occhiali da sole
    c = Cv(16)
    c.disc(7.5, 7.5, 4.1, 'Y')
    c.rect(7, 1, 8, 2, 'Y'); c.rect(7, 13, 8, 14, 'Y'); c.rect(1, 7, 2, 8, 'Y'); c.rect(13, 7, 14, 8, 'Y')
    for (x, y) in [(2, 2), (3, 3), (12, 2), (13, 3), (2, 13), (3, 12), (12, 12), (13, 13)]:
        c.set(x if x < 8 else x, y, 'Y')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E,
        '................',
        '....KKK.KKK.....',
        '....KKKKKKK.....',
        '.....K...K......',
        '................',
        '.....K...K......',
        '......KKK.......'])
T['Ottimista patologico'] = ('mix', ottimista)

def pessimista():
    # nuvola nera con la pioggia
    c = Cv(16)
    c.disc(5, 5.5, 2.8, 'D'); c.disc(9, 4.5, 3.2, 'D'); c.disc(11.8, 6.6, 2.2, 'D'); c.rect(3, 6, 13, 8, 'D'); c.disc(3.2, 7.2, 1.8, 'D')
    for (x, y) in [(4, 11), (8, 11), (12, 11), (3, 13), (7, 13), (11, 13)]:
        c.set(x, y, 'B'); c.set(x, y+1 if y < 13 else y, 'B')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E,
        '.....K....K.....',
        '................',
        '......KKKK......'])
T['Pessimista cosmico'] = ('mix', pessimista)

def pignolo():
    # lente d'ingrandimento sopra una virgola
    c = Cv(16)
    c.ring(6, 6, 5.0, 3.4, 'D'); c.disc(6, 6, 3.4, 'L')
    for i in range(4):
        c.rect(9+i, 10+i, 10+i, 11+i, 'N')
    r = process(c.rows(), keep='L')
    return overlay(r, [E, E, E, E,
        '.....KK.........',
        '.....KK.........',
        '......K.........',
        '.....K..........'])
T['Pignolo sulle virgole'] = ('mix', pignolo)

def gratta():
    # quadrifoglio: quattro foglie a cuore
    c = Cv(16)
    for (x, y) in [(4.4, 4.0), (10.6, 4.0), (4.4, 10.0), (10.6, 10.0)]:
        c.disc(x, y, 2.5, 'G')
    for (x, y) in [(2, 2), (13, 2), (2, 12), (13, 12)]:
        c.set(x, y, '.')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E, E,
        '.......gg.......',
        E, E, E, E, E,
        '.........gg.....',
        '..........gg....'])
T['Fortunato al gratta e vinci'] = ('pos', gratta)

def cuore_oro():
    # cuore d'oro con lo scintillio
    c = Cv(16)
    heart(c, 'Y', cx=7.0, top=6.0, r=3.2, tip=13)
    c.rect(13, 1, 13, 3, 'W'); c.rect(12, 2, 14, 2, 'W')
    return process(c.rows(), keep='W')
T["Cuore d'oro"] = ('pos', cuore_oro)

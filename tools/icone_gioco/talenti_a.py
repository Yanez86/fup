"""Talenti 16x16 (gruppo A: carattere, salute, studi): T[nome] = (tipo, funzione che restituisce 16 righe da 16 lettere)."""
import math
from motore import Cv, process, overlay

T = {}

def spans(c, rows, col):
    """rows: {y: (x0, x1)} oppure {y: [(x0, x1), ...]}"""
    for y, v in rows.items():
        for a, b in (v if isinstance(v, list) else [v]):
            c.rect(a, y, b, y, col)

def thick(c, x0, y0, x1, y1, col, w=1):
    """linea spessa: a ogni passo un rombo di raggio w (w=0: linea di 1 pixel)"""
    n = max(abs(x1-x0), abs(y1-y0), 1)
    for i in range(n+1):
        x = round(x0 + (x1-x0)*i/n); y = round(y0 + (y1-y0)*i/n)
        for dx in range(-w, w+1):
            for dy in range(-w, w+1):
                if abs(dx)+abs(dy) <= w: c.set(x+dx, y+dy, col)

def gear(c, cx, cy, r, n, col, hole=1.3, phase=0.0):
    c.disc(cx, cy, r, col)
    for k in range(n):
        a = phase + 2*math.pi*k/n
        tx, ty = cx + (r+0.9)*math.cos(a), cy + (r+0.9)*math.sin(a)
        c.disc(tx, ty, 1.05, col)
    if hole: c.clear_disc(cx, cy, hole)

# ---------------------------------------------------------------- carattere e salute

def militare():
    c = Cv(16)
    c.rect(5, 1, 6, 5, 'G'); c.rect(7, 1, 8, 5, 'W'); c.rect(9, 1, 10, 5, 'R')
    c.rect(7, 6, 8, 6, 'Y')
    spans(c, {7: (7, 8), 8: (6, 9), 9: (2, 13), 10: (3, 12), 11: (4, 11), 12: (4, 11), 13: [(3, 6), (9, 12)], 14: [(3, 4), (11, 12)]}, 'Y')
    return process(c.rows())
T['Ha fatto il militare'] = ('mix', militare)

def sindacalista():
    c = Cv(16)
    c.rect(1, 6, 2, 9, 'D')
    for x in range(3, 11):
        d = (x-3)*4//7
        c.rect(x, 6-d, x, 9+d, 'R')
    c.rect(11, 2, 11, 13, 'S')
    c.rect(5, 10, 6, 13, 'D')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '..............K', '..............K', '', '', '', '', '..............K', '..............K'])
T['Ex sindacalista'] = ('pos', sindacalista)

def bar():
    c = Cv(16)
    c.rect(1, 1, 10, 12, 'W')
    c.rect(7, 9, 12, 13, 'R'); c.rect(13, 10, 13, 11, 'R')
    c.rect(5, 14, 14, 14, 'S')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '..KKKKKKK', '', '..ssssss', '', '..sssss', '..........S', '..ssss....S', '........NNNN', '..ssss'])
T['Conosce tutti al bar'] = ('pos', bar)

def ansia():
    c = Cv(16)
    c.disc(7, 8.5, 5.9, 'Y')
    c.set(13, 2, 'B'); c.rect(12, 3, 14, 5, 'B'); c.set(13, 6, 'B')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '...K.....K', '', '...WW...WW', '...WK...KW', '', '',
                       '....K.K.K.', '.....K.K.K', ''])
T['Ansia da prestazione'] = ('mix', ansia)

def tifo():
    c = Cv(16)
    c.disc(7.5, 7.5, 6.6, 'W')
    r = process(c.rows(), keep='W')
    g = [list(x) for x in r]
    inside = lambda x, y: (x-7.5)**2 + (y-7.5)**2 <= 6.0**2
    def poly(cx, cy, rad, rot):
        pts = [(cx + rad*math.cos(rot + 2*math.pi*k/5), cy + rad*math.sin(rot + 2*math.pi*k/5)) for k in range(5)]
        for y in range(16):
            for x in range(16):
                px_, py_ = x, y
                ok = True
                for k in range(5):
                    (x1, y1), (x2, y2) = pts[k], pts[(k+1) % 5]
                    if (x2-x1)*(py_-y1) - (y2-y1)*(px_-x1) < -0.3: ok = False; break
                if ok and inside(x, y): g[y][x] = 'K'
        return pts
    pts = poly(7.5, 7.8, 2.6, -math.pi/2)
    for k in range(5):
        a = -math.pi/2 + 2*math.pi*k/5
        for t in range(26, 52):
            rr = t/10
            x, y = int(round(7.5 + rr*math.cos(a))), int(round(7.8 + rr*math.sin(a)))
            if inside(x, y): g[y][x] = 'K'
        a2 = a + math.pi/5
        cx, cy = 7.5 + 6.6*math.cos(a2), 7.5 + 6.6*math.sin(a2)
        for y in range(16):
            for x in range(16):
                if (x-cx)**2 + (y-cy)**2 <= 2.3**2 and inside(x, y): g[y][x] = 'K'
    return [''.join(x) for x in g]
T['Tifo sfegatato'] = ('mix', tifo)

def ex_fumatore():
    c = Cv(16)
    c.rect(2, 7, 4, 8, 'O'); c.rect(5, 7, 12, 8, 'W'); c.rect(13, 7, 13, 8, 'R')
    c.ring(7.5, 7.5, 7.2, 5.4, 'R')
    for i in range(10):
        c.rect(3+i, 3+i, 4+i, 3+i, 'R')
    return process(c.rows(), keep='W')
T['Ex fumatore'] = ('pos', ex_fumatore)

def esaurito():
    c = Cv(16)
    c.rect(6, 1, 9, 2, 'S'); c.rect(3, 3, 12, 14, 'S')
    c.rect(5, 5, 10, 12, 'd'); c.rect(5, 11, 10, 12, 'R')
    return process(c.rows())
T['Esaurito'] = ('neg', esaurito)

def mentore():
    c = Cv(16)
    c.disc(7.5, 9, 5.6, 'N')
    c.rect(3, 2, 4, 5, 'N'); c.rect(11, 2, 12, 5, 'N'); c.rect(3, 4, 12, 6, 'N')
    c.disc(5, 6.5, 2.1, 'W'); c.disc(10, 6.5, 2.1, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '', '', '....KK....KK', '....KK....KK', '.......YY', '.......yy',
                       '......kkkk', '.....kkkkkk', '.....kkkkkk', '......kkkk', '.....Y....Y'])
T['Mentore'] = ('pos', mentore)

def meditazione():
    c = Cv(16)
    spans(c, {r: (1+r-5 if r < 9 else r-4, 2+(r-5)//1 if r < 8 else 6) for r in range(5, 12)}, 'l')
    spans(c, {r: (13-(r-5) if r < 8 else 9, 14-(r-5) if r < 9 else 15-(r-4)) for r in range(5, 12)}, 'l')
    spans(c, {2: (7, 8), 3: (6, 9), 4: (6, 9), 5: (5, 10), 6: (5, 10), 7: (5, 10), 8: (5, 10), 9: (5, 10), 10: (5, 10), 11: (6, 9)}, 'P')
    spans(c, {12: (2, 13), 13: (1, 14)}, 'G')
    return process(c.rows())
T['Meditazione quotidiana'] = ('pos', meditazione)

def schiena():
    c = Cv(16)
    for y in (1, 4, 7, 10, 13):
        c.rect(5, y, 10, y+1, 'W')
    for y in (3, 6, 9, 12):
        c.rect(6, y, 9, y, 'S')
    c.rect(5, 7, 10, 8, 'R')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '', '.R............R', '..R..........R', '...R........R', '...R........R', '..R..........R', '.R............R'])
T['Mal di schiena cronico'] = ('neg', schiena)

def sicurezza():
    c = Cv(16)
    c.rect(3, 1, 5, 4, 'O'); c.rect(10, 1, 12, 4, 'O')
    spans(c, {5: [(2, 6), (9, 13)], 6: [(2, 7), (8, 13)]}, 'O')
    c.rect(2, 7, 13, 14, 'O')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '', '', '.......K', '..WWWWKKWWWW', '.......K', '.......K', '..WWWWKKWWWW', '.......K', '.......K'])
T['Formato sulla sicurezza'] = ('pos', sicurezza)

def morte():
    c = Cv(16)
    c.disc(7.5, 6.5, 5.6, 'W'); c.rect(4, 10, 11, 13, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '', '...KKK..KKK', '...KKK..KKK', '...KKK..KKK', '', '.......KK', '', '.....K.K.K', '.....K.K.K'])
T['Ha visto la morte in faccia'] = ('mix', morte)

def muletto():
    c = Cv(16)
    c.rect(3, 1, 4, 12, 'D'); c.rect(1, 11, 2, 12, 'S')
    c.rect(6, 1, 13, 1, 'D'); c.rect(6, 2, 6, 5, 'D'); c.rect(13, 2, 13, 5, 'D')
    c.rect(5, 6, 14, 10, 'Y'); c.rect(9, 4, 11, 5, 'N')
    c.disc(7.6, 11.6, 2.0, 'D'); c.disc(12, 11.6, 2.0, 'D')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '', '', '', '', '', '', '.......SS...SS', '.......SS...SS'][:0] + ['']*11 + ['.......S....S'])
T['Patentino del muletto'] = ('pos', muletto)

def dogane():
    c = Cv(16)
    c.rect(1, 6, 10, 14, 'W')
    c.disc(12, 2, 1.6, 'N'); c.rect(11, 3, 13, 6, 'N'); c.rect(9, 7, 14, 8, 'D'); c.rect(9, 9, 14, 9, 'R')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '', '', '', '..ssss', '', '..sss..', '...RRRR', '..R....R', '..R.RR.R', '...RRRR'])
T['Esperto di dogane'] = ('pos', dogane)

# ---------------------------------------------------------------- titoli di studio

def licenza():
    c = Cv(16)
    thick(c, 4, 11, 12, 3, 'Y', 1)
    thick(c, 3, 12, 4, 11, 'F', 1)
    c.set(2, 13, 'K'); c.set(1, 14, 'K')
    thick(c, 11, 4, 11, 4, 'S', 1)
    thick(c, 12, 3, 13, 2, 'e', 1)
    return process(c.rows())
T['Licenza media'] = ('mix', licenza)

def ragioniere():
    c = Cv(16)
    c.rect(1, 2, 14, 13, 'N'); c.rect(2, 3, 13, 12, 'C')
    for y in (4, 7, 10):
        c.rect(2, y, 13, y, 's')
    for y, col, xs in ((4, 'R', (3, 6, 11)), (7, 'G', (3, 9, 11)), (10, 'B', (3, 5, 7, 12))):
        for x in xs:
            c.rect(x, y-1, x+1, y+1, col)
    return process(c.rows(), keep='C')
T['Diplomato ragioniere'] = ('pos', ragioniere)

def perito_ind():
    c = Cv(16)
    thick(c, 3, 3, 9, 9, 'S', 0); c.set(2, 2, 'S')
    thick(c, 10, 10, 13, 13, 'O', 1)
    thick(c, 4, 11, 10, 5, 'S', 1)
    c.disc(11.2, 4, 2.8, 'S'); c.disc(3.5, 12.5, 2.0, 'S')
    for p in ((12, 2), (13, 3), (12, 3), (13, 2), (14, 2), (13, 1)):
        c.set(*p, '.')
    c.set(3, 12, '.'); c.set(4, 12, '.') if False else None
    return process(c.rows())
T['Diplomato perito industriale'] = ('pos', perito_ind)

def perito_inf():
    c = Cv(16)
    c.rect(1, 1, 14, 14, 'B'); c.set(14, 1, '.')
    c.rect(4, 1, 11, 5, 'S'); c.rect(3, 8, 12, 14, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '.........dd', '.........dd', '.........dd', '', '', '', '', '', '....ssssss', '', '....ssss', '', ''])
T['Diplomato perito informatico'] = ('mix', perito_inf)

def geometra():
    c = Cv(16)
    for y in range(1, 15):
        c.rect(1, y, y, y, 'Y')
    for y in range(7, 12):
        c.rect(4, y, y-3, y, '.')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '', '', '', '', '', '', '', '', '..K.K.K.K.K.K'])
T['Diplomato geometra'] = ('pos', geometra)

def classica():
    c = Cv(16)
    c.rect(1, 1, 14, 1, 'S'); c.rect(2, 2, 13, 3, 'S')
    c.rect(4, 4, 11, 12, 'W')
    c.rect(3, 13, 12, 13, 'S'); c.rect(2, 14, 13, 14, 'S')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '.....s.s.s', '.....s.s.s', '.....s.s.s', '.....s.s.s', '.....s.s.s', '.....s.s.s', '.....s.s.s', '.....s.s.s'])
T['Maturità classica'] = ('mix', classica)

def scientifica():
    c = Cv(16)
    c.disc(7.5, 7.5, 2.1, 'R')
    r = process(c.rows())
    g = [list(x) for x in r]
    for a in (0, math.pi/3, -math.pi/3):
        for k in range(200):
            t = 2*math.pi*k/200
            x = 7.5 + 6.6*math.cos(t)*math.cos(a) - 2.4*math.sin(t)*math.sin(a)
            y = 7.5 + 6.6*math.cos(t)*math.sin(a) + 2.4*math.sin(t)*math.cos(a)
            xi, yi = int(round(x)), int(round(y))
            if 0 <= xi < 16 and 0 <= yi < 16 and g[yi][xi] == '.': g[yi][xi] = 'b'
    for (x, y) in ((14, 8), (4, 2), (4, 13)):
        g[y][x] = 'Y'
    return [''.join(x) for x in g]
T['Maturità scientifica'] = ('pos', scientifica)

def alberghiero():
    c = Cv(16)
    c.disc(4, 5.5, 2.9, 'W'); c.disc(7.5, 3.8, 3.2, 'W'); c.disc(11, 5.5, 2.9, 'W')
    c.rect(4, 7, 11, 12, 'W'); c.rect(4, 12, 11, 13, 'S')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '', '', '', '', '', '', '......s..s', '......s..s', '......s..s', '......s..s'])
T['Diplomato all\'alberghiero'] = ('mix', alberghiero)

def nautico():
    r = ['................',
         '......KKKK......',
         '.....KDDDDK.....',
         '.....KDKKDK.....',
         '.....KDDDDK.....',
         '..KKKKKDDKKKKK..',
         '..KDDDDDDDDDDK..',
         '..KddddDDddddK..',
         '..KKKKKDDKKKKK..',
         '.KK...KDDK...KK.',
         'KDDK..KDDK..KDDK',
         '.KDDK.KDDK.KDDK.',
         '..KDDKKDDKKDDK..',
         '...KDDDDDDDDK...',
         '....KddddddK....',
         '.....KKKKKK.....']
    return r
T['Diplomato al nautico'] = ('mix', nautico)

def qualifica():
    c = Cv(16)
    c.rect(1, 7, 14, 13, 'R')
    c.rect(5, 3, 10, 3, 'S'); c.rect(5, 4, 5, 6, 'S'); c.rect(10, 4, 10, 6, 'S')
    c.rect(2, 4, 3, 6, 'Y'); c.rect(12, 2, 13, 6, 'S')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '', '', '', '', '.rrrrrrrrrrrrrr', '.......YY', '.......yy'])
T['Qualifica professionale'] = ('pos', qualifica)

def gestionale():
    c = Cv(16)
    c.rect(1, 1, 14, 14, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '',
                       '..OOOOO..R',
                       '..ooooo..R',
                       '.....BBBBRB',
                       '.....bbbbRb',
                       '.........R',
                       '.......GGRGGG',
                       '.......gggggg',
                       '.........R',
                       '...YYYYYYR',
                       '...yyyyyyR',
                       '.........R',
                       '..ssssssssssss'])
T['Ingegnere gestionale'] = ('mix', gestionale)

def meccanico():
    big = ['....OOO....',
           '.OO.OOO.OO.',
           '.OOOOOOOOO.',
           '..OOOOOOO..',
           'OOOOO.OOOOO',
           'OOOO...OOOO',
           'OOOOO.OOOOO',
           '..OOOOOOO..',
           '.OOOOOOOOO.',
           '.OO.OOO.OO.',
           '....OOO....']
    small = ['...SSS...',
             '.S.SSS.S.',
             '..SSSSS..',
             'SSSS.SSSS',
             'SSS...SSS',
             'SSSS.SSSS',
             '..SSSSS..',
             '.S.SSS.S.',
             '...SSS...']
    c = Cv(16)
    c.paste(6, 1, small); c.paste(1, 4, big)
    return process(c.rows())
T['Ingegnere meccanico'] = ('mix', meccanico)

def trasporti():
    c = Cv(16)
    c.rect(1, 1, 14, 9, 'G'); c.rect(7, 10, 8, 14, 'S')
    r = process(c.rows())
    return overlay(r, ['',
                       '',
                       '....W',
                       '...WWW....W',
                       '..W.W.....WW',
                       '....W..WWWWWW',
                       '....W.....WW',
                       '....W.....W',
                       ''])
T['Ingegnere dei trasporti'] = ('pos', trasporti)

def economia():
    c = Cv(16)
    c.rect(1, 1, 14, 14, 'W')
    r = process(c.rows(), keep='W')
    g = [list(x) for x in r]
    for y in range(2, 14): g[y][2] = 'K'
    for x in range(2, 14): g[13][x] = 'K'
    for i in range(10):
        g[3+i][4+i] = 'R'
        g[12-i][4+i] = 'b'
    g[7][8] = 'Y'; g[8][8] = 'Y'; g[7][9] = 'Y'; g[8][9] = 'Y'
    return [''.join(x) for x in g]
T['Laureato in economia'] = ('pos', economia)

def giurisprudenza():
    c = Cv(16)
    c.rect(7, 1, 8, 2, 'Y'); c.rect(7, 3, 8, 12, 'Y'); c.rect(1, 3, 14, 3, 'Y'); c.rect(4, 13, 11, 14, 'Y')
    c.rect(1, 8, 4, 8, 'Y'); c.rect(2, 9, 3, 9, 'Y'); c.rect(11, 8, 14, 8, 'Y'); c.rect(12, 9, 13, 9, 'Y')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '..K..........K', '..K..........K', '.K.K........K.K', '.K.K........K.K'])
T['Laureato in giurisprudenza'] = ('mix', giurisprudenza)

def umanistiche():
    c = Cv(16)
    c.rect(3, 3, 12, 12, 'C')
    c.rect(2, 1, 13, 2, 'N'); c.rect(2, 13, 13, 14, 'N'); c.rect(1, 1, 1, 2, 'M'); c.rect(14, 1, 14, 2, 'M'); c.rect(1, 13, 1, 14, 'M'); c.rect(14, 13, 14, 14, 'M')
    r = process(c.rows(), keep='C')
    return overlay(r, ['', '', '', '', '....ssssss', '', '....sssss', '', '....ssssss', '', '....ssss'])
T['Laureato in scienze umanistiche'] = ('mix', umanistiche)

def filosofia():
    c = Cv(16)
    c.disc(5, 6, 3.4, 'L'); c.disc(9.5, 4.8, 3.8, 'L'); c.disc(11.8, 7.8, 2.6, 'L'); c.disc(7.5, 8.2, 3.0, 'L')
    c.rect(3, 11, 4, 12, 'L'); c.set(1, 14, 'L')
    r = process(c.rows(), keep='L')
    return overlay(r, ['', '', '........KK', '.......K..K', '..........K', '.........K', '........K', '', '........K'])
T['Laureato in filosofia'] = ('mix', filosofia)

def psicologia():
    c = Cv(16)
    c.rect(1, 9, 14, 11, 'R'); c.rect(1, 5, 3, 8, 'R'); c.rect(4, 7, 4, 8, 'R')
    c.rect(2, 12, 2, 13, 'N'); c.rect(13, 12, 13, 13, 'N')
    c.rect(4, 6, 6, 8, 'W')
    r = process(c.rows(), keep='W')
    return r
T['Laureato in psicologia'] = ('mix', psicologia)

def politiche():
    c = Cv(16)
    c.rect(5, 1, 10, 7, 'W'); c.rect(1, 7, 14, 14, 'B')
    r = process(c.rows(), keep='W')
    return overlay(r, ['', '', '......R..R', '.......RR', '.......RR', '......R..R', '', '....KKKKKKKK', '', '', '..WWWWWWWWWW'])
T['Laureato in scienze politiche'] = ('mix', politiche)

def lingue():
    c = Cv(16)
    c.rect(1, 1, 8, 7, 'R'); c.set(2, 8, 'R'); c.set(2, 9, 'R'); c.set(3, 8, 'R')
    c.rect(6, 6, 14, 12, 'B'); c.set(13, 13, 'B'); c.set(12, 13, 'B'); c.set(13, 14, 'B')
    r = process(c.rows())
    return overlay(r, ['', '...WW', '..W..W', '..WWWW', '..W..W', '......KKK', '.....K', '.....K..WWWWW', '...........W', '..........W', '.........W', '........WWWWW'])
T['Laureato in lingue'] = ('pos', lingue)

def matematica():
    c = Cv(16)
    c.rect(1, 2, 14, 12, 'N'); c.rect(2, 3, 13, 11, 'g'); c.rect(3, 13, 12, 13, 'N')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '...WWWWWW', '....W..W', '....W..W', '....W..W', '....W..WW', '...W', '.........WW'][:10])
T['Laureato in matematica'] = ('mix', matematica)

def chimica():
    c = Cv(16)
    c.rect(6, 1, 9, 1, 'S'); c.rect(6, 2, 9, 5, 'L')
    for y in range(6, 15):
        d = (y-6)*5//8
        c.rect(6-d-1 if y > 6 else 5, y, 9+d+1 if y > 6 else 10, y, 'L')
    for y in range(10, 15):
        d = (y-6)*5//8
        c.rect(6-d, y, 9+d, y, 'G')
    r = process(c.rows(), keep='L')
    return overlay(r, ['', '', '', '', '', '', '', '', '', '', '', '......W', '........W', '.....W'])
T['Laureato in chimica'] = ('pos', chimica)

def architettura():
    c = Cv(16)
    c.rect(1, 6, 14, 14, 'B')
    c.disc(7.5, 1.8, 1.5, 'D')
    thick(c, 7, 3, 3, 12, 'S', 0); thick(c, 6, 3, 2, 12, 'S', 0)
    thick(c, 8, 3, 12, 12, 'S', 0); thick(c, 9, 3, 13, 12, 'S', 0)
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '', '', '', '', '..L...L...L', '.LLLLLLLLLLLLL'[:0] or '', '', '..L...L...L'])
T['Laureato in architettura'] = ('mix', architettura)

def agraria():
    c = Cv(16)
    c.disc(7.5, 9.2, 5.5, 'O')
    c.rect(8, 2, 8, 3, 'N'); c.rect(9, 1, 12, 2, 'G'); c.rect(10, 3, 11, 3, 'G')
    r = process(c.rows())
    return overlay(r, ['', '', '', '', '', '.......o', '.......o', '......o', '......o', '......o', '......o', '.......o'])
T['Laureato in agraria'] = ('pos', agraria)

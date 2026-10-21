"""Tecnologie 12x12 (prima parte): TE[id] = (albero, nome, funzione che restituisce 12 righe da 12 lettere)."""
from motore import Cv, process, ov

# ---------- tecnologie 12x12 ----------
TE = {}
def t_barcode():
    c = Cv(12); c.rect(1, 2, 10, 9, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '..K.KK.K.K', '..K.KK.K.K', '..K.KK.K.K', '..K.KK.K.K', 'RRRRRRRRRRRR', '..K.KK.K.K', ''])
TE['barcode'] = ('log', 'Lettori barcode', t_barcode)
def t_wms():
    c = Cv(12); c.rect(1, 1, 10, 7, 'D'); c.rect(4, 8, 7, 9, 'S'); c.rect(2, 10, 9, 10, 'S')
    r = process(c.rows())
    return ov(r, ['', '', '..BBB.OOO', '..BBB.OOO', '', '..GGG.YYY', '..GGG.YYY'])
TE['wms'] = ('log', 'WMS di base', t_wms)
def t_gps():
    c = Cv(12); c.disc(5.5, 4.2, 3.6, 'R')
    for i, (a, b) in enumerate([(3, 8), (4, 7), (5, 6)]):
        c.rect(a, 8+i, b, 8+i, 'R')
    r = process(c.rows())
    return ov(r, ['', '', '....WW', '...WWWW', '...WWWW', '....WW'])
TE['gps'] = ('log', 'Telematica GPS', t_gps)
def t_freddo():
    c = Cv(12)
    for i in range(11):
        c.set(5, i, 'b'); c.set(i, 5, 'b')
    for i in range(1, 10):
        c.set(i, i, 'b'); c.set(10-i, i, 'b')
    for (x, y) in [(4, 1), (6, 1), (4, 9), (6, 9), (1, 4), (1, 6), (9, 4), (9, 6)]:
        c.set(x, y, 'b')
    c.rect(4, 4, 6, 6, 'W'); c.set(5, 5, 'L')
    return process(c.rows(), shade=False)
TE['freddo'] = ('cert', 'Catena del freddo', t_freddo)
def t_haccp():
    # registro dell'autocontrollo sulla tavoletta, con la mela: igiene alimentare
    c = Cv(12); c.rect(0, 1, 8, 11, 'N'); c.rect(1, 2, 7, 10, 'W'); c.rect(3, 0, 5, 1, 'S')
    c.disc(8.5, 8.5, 2.9, 'R'); c.set(9, 5, 'G'); c.set(10, 4, 'G')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '..K.KKK', '', '..K.KK', '', '..K.K'])
TE['haccp'] = ('cert', 'HACCP', t_haccp)
def t_mensa():
    c = Cv(12); c.rect(0, 6, 11, 7, 'W'); c.rect(1, 8, 10, 8, 'W'); c.rect(3, 9, 8, 9, 'W')
    c.rect(2, 4, 9, 5, 'O')
    r = process(c.rows(), keep='W')
    return ov(r, ['...S..S', '..S..S', '...S..S', '', '...Y..G'])
TE['mensa'] = ('wel', 'Mensa aziendale', t_mensa)
def t_direzione():
    c = Cv(12); c.rect(4, 1, 7, 3, 'Y'); c.rect(0, 8, 3, 10, 'B'); c.rect(4, 8, 7, 10, 'O'); c.rect(8, 8, 11, 10, 'G')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '.....KK', '.KKKKKKKKKK', '.K...KK...K'])
TE['direzione'] = ('org', 'Struttura direzionale', t_direzione)

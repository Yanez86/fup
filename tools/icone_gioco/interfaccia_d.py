"""Stagioni, 16x16: l'icona accanto alla data in alto e nel grafico della stagionalità delle committenti
(stanno sulla barra scura: niente sfondo pieno)."""
import math
from motore import Cv, process, ov

UI = {}

# primavera: fiore a quattro petali rosa col bottone giallo, stelo e foglia
def s_primavera():
    r = process([
        '................',
        '......RR........',
        '.....RRRR.......',
        '..RR.RRRR.RR....',
        '.RRRR.RR.RRRR...',
        '.RRRRRYYRRRRR...',
        '..RRRRYYRRRR....',
        '.....RRRR.......',
        '.....RRRR.......',
        '......RR........',
        '.......G..GG....',
        '...GG..G.GGGG...',
        '..GGGG.G.GGG....',
        '...GGG.GG.......',
        '.......G........',
        '................'])
    return r
UI['s_pri'] = ('Primavera', s_primavera)

# estate: sole con otto raggi
def s_estate():
    c = Cv(16)
    c.disc(7.5, 7.5, 3.9, 'Y')
    for k in range(8):
        a = k*math.pi/4; x = 7.5 + 6.0*math.cos(a); y = 7.5 + 6.0*math.sin(a)
        c.rect(int(round(x-0.5)), int(round(y-0.5)), int(round(x-0.5)), int(round(y-0.5)), 'O')
        x = 7.5 + 5.0*math.cos(a); y = 7.5 + 5.0*math.sin(a)
        c.rect(int(round(x-0.5)), int(round(y-0.5)), int(round(x-0.5)), int(round(y-0.5)), 'O')
    return process(c.rows())
UI['s_est'] = ('Estate', s_estate)

# autunno: foglia d'acero arancione, in diagonale, col picciolo marrone
def s_autunno():
    c = Cv(16)
    c.disc(8.5, 6.5, 4.6, 'O'); c.disc(4.5, 7.5, 2.4, 'O'); c.disc(9.5, 11.0, 2.4, 'O'); c.disc(12.0, 3.5, 1.8, 'O')
    c.clear_disc(3.0, 3.0, 2.2); c.clear_disc(13.5, 11.5, 2.4)
    c.line(2, 14, 6, 10, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '', '..........o', '.........o', '........o', '.......o', '......o', '.....o'])
UI['s_aut'] = ('Autunno', s_autunno)

# inverno: fiocco di neve a sei bracci
def s_inverno():
    return process([
        '................',
        '.......L........',
        '.....L.L.L......',
        '..L...LLL...L...',
        '...LL..L..LL....',
        '..L.LL.L.LL.L...',
        '......LLL.......',
        '.LLLLLLWLLLLLL..',
        '......LLL.......',
        '..L.LL.L.LL.L...',
        '...LL..L..LL....',
        '..L...LLL...L...',
        '.....L.L.L......',
        '.......L........',
        '................',
        '................'], shade=False)
UI['s_inv'] = ('Inverno', s_inverno)

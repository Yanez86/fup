"""Talenti 16x16 del pacchetto Relazioni industriali: T[nome] = (tipo, funzione)."""
from motore import Cv, process, overlay

T = {}
E = '.'*16

def pugno():
    # pugno di ferro: guanto grigio chiuso
    c = Cv(16)
    c.rect(3, 3, 12, 9, 'S'); c.rect(4, 10, 11, 13, 'S')
    r = process(c.rows())
    return overlay(r, [E, E, E, E,
        '.....K..K..K....',
        '.....K..K..K....',
        '.....K..K..K....',
        '...KKKKK........',
        E, E, '....DDDDDDDD....'])
T['Pugno di ferro'] = ('mix', pugno)

def mediatore():
    # bilancia in equilibrio
    c = Cv(16)
    c.rect(7, 2, 8, 12, 'N'); c.rect(2, 3, 13, 3, 'N')
    c.rect(1, 7, 5, 8, 'Y'); c.rect(10, 7, 14, 8, 'Y')
    c.line(2, 4, 1, 6, 'S'); c.line(4, 4, 5, 6, 'S'); c.line(11, 4, 10, 6, 'S'); c.line(13, 4, 14, 6, 'S')
    c.rect(5, 13, 10, 14, 'N')
    return process(c.rows())
T['Mediatore nato'] = ('pos', mediatore)

def briscola():
    # due carte da briscola: un asso di coppe e un re
    c = Cv(16)
    c.rect(1, 2, 8, 13, 'W'); c.rect(7, 4, 14, 14, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E,
        '....R...........',
        '...RRR..........',
        '....R...K.......',
        '........KYYYY...',
        '.........YYY....',
        '........KRRRR...',
        '.........RRR....',
        '.........R.R....'])
T['Amico del delegato'] = ('pos', briscola)

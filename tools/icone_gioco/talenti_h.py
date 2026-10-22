"""Talenti 16x16 delle passioni (IA, gioco di ruolo dal vivo, softair, Giappone, musica): T[nome] = (tipo, funzione)."""
from motore import Cv, process, overlay

T = {}
E = '.'*16

def ia():
    # fumetto della chat con la scintilla dell'intelligenza artificiale
    c = Cv(16)
    c.rect(1, 3, 11, 10, 'W'); c.set(1, 3, '.'); c.set(11, 3, '.'); c.set(1, 10, '.'); c.set(11, 10, '.')
    c.rect(3, 11, 4, 11, 'W'); c.set(3, 12, 'W')
    c.rect(12, 1, 12, 7, 'P'); c.rect(10, 4, 14, 4, 'P'); c.rect(11, 3, 13, 5, 'P')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E, E, E,
        '...KK.KK.KK.....',
        '...KK.KK.KK.....'])
T['Amante dell\'IA'] = ('mix', ia)

def elfo():
    # orecchio a punta da elfo con la foglia del bosco
    c = Cv(16)
    c.paste(0, 0, ['................',
                   '.F..............',
                   '.FF.............',
                   '..FF............',
                   '..FFF...........',
                   '...FFFF.........',
                   '...FFFFFF.......',
                   '....FFFFFFF.....',
                   '....FFFFFFFF....',
                   '.....FFFFFFFF...',
                   '......FFFFFFF...',
                   '.......FFFFFF...',
                   '........FFFFF...',
                   '........FFFF....',
                   '.........FF.....'])
    c.rect(11, 2, 13, 4, 'G'); c.set(12, 1, 'G'); c.set(14, 1, 'G'); c.set(10, 5, 'g')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E,
        '.....f..........',
        '......ff........',
        '........ff......',
        '..........f.....',
        '..........f.....',
        '.........f......',
        '.........f......'])
T['Larper'] = ('mix', elfo)

def softair():
    # elmetto mimetico con la maschera arancione del softair
    c = Cv(16)
    c.disc(7.5, 8.5, 6.4, 'G'); c.rect(0, 9, 15, 15, '.')
    c.rect(1, 9, 14, 10, 'G')
    c.rect(3, 11, 12, 13, 'O')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '......NN........',
        '.....NN....g....',
        '..g.......gg....',
        '..gg..NN.......',
        '.......NN...NN..',
        '................',
        '................',
        '................',
        '....SS....SS....',
        '....SS....SS....'])
T['Guerrafondaio'] = ('mix', softair)

def onigiri():
    # polpetta di riso giapponese con l'alga
    c = Cv(16)
    for y in range(2, 14):
        h = (y - 2) * 7 // 11 + 1
        c.rect(8 - h, y, 7 + h, y, 'W')
    c.rect(2, 13, 13, 13, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E, E, E, E, E, E,
        '.....dddddd.....',
        '.....dddddd.....',
        '.....dddddd.....',
        '.....dddddd.....',
        '.....dddddd.....',
        '.....dddddd.....'])
T['Otaku'] = ('mix', onigiri)

def tamburo():
    # rullante con le bacchette incrociate
    c = Cv(16)
    c.rect(2, 8, 13, 13, 'R'); c.rect(2, 7, 13, 7, 'S')
    c.line(2, 1, 9, 6, 'k'); c.line(13, 1, 6, 6, 'k')
    r = process(c.rows())
    return overlay(r, [E, E, E, E, E, E, E, E,
        '..Y..Y..Y..Y..Y.',
        '..Y.Y.Y.Y.Y.Y...',
        '...Y...Y...Y....',
        '..Y.Y.Y.Y.Y.Y...',
        '..Y..Y..Y..Y..Y.'])
T['Musicista'] = ('mix', tamburo)

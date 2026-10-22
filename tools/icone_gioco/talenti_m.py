"""Talenti 16x16 dei manager arrivati dopo (Sorrentino, Brambilla): T[nome] = (tipo, funzione)."""
from motore import Cv, process, overlay

T = {}
E = '.'*16

def strada():
    # strada in prospettiva con la mezzeria tratteggiata
    c = Cv(16)
    for y in range(2, 15):
        h = (y - 2) * 6 // 12 + 1
        c.rect(7 - h, y, 8 + h, y, 'D')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '.......WW.......',
        E,
        '.......WW.......',
        '.......WW.......',
        E, E,
        '.......WW.......',
        '.......WW.......',
        '.......WW.......'])
T['Venuto dalla strada'] = ('mix', strada)

def guantone():
    # guantone da boxe rosso con il polsino bianco
    c = Cv(16)
    c.disc(8, 6, 5, 'R'); c.rect(3, 6, 13, 10, 'R'); c.disc(3, 8, 2, 'R')
    c.rect(5, 11, 12, 14, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E,
        '.......K........',
        '.......K........',
        '......K.........',
        E, E, E, E, E,
        '.....SSSSSSSS...'])
T['Spirito bellicoso'] = ('mix', guantone)

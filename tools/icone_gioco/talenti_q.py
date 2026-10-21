"""Talenti 16x16 della qualità: T[nome] = (tipo, funzione che restituisce 16 righe da 16 lettere)."""
from motore import Cv, process, overlay

T = {}
E = '.'*16

def procedure():
    # cartella delle procedure con il numero di revisione e la spunta
    c = Cv(16)
    c.rect(2, 1, 13, 14, 'W'); c.rect(2, 1, 13, 3, 'B')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E,
        '....KKKKKK......',
        E,
        '....KKKKKKKK....',
        E,
        '....KKKKK.......',
        '..........G.....',
        '.........GG.....',
        '....G...GG......',
        '.....G.GG.......',
        '......GG........'])
T['Maniaco delle procedure'] = ('pos', procedure)

def raccoglitori():
    # tre raccoglitori ad anelli, uno rosso
    c = Cv(16)
    c.rect(1, 2, 4, 14, 'B'); c.rect(6, 2, 9, 14, 'R'); c.rect(11, 2, 14, 14, 'G')
    r = process(c.rows())
    return overlay(r, [E, E, E,
        '..W....W....W...',
        '..W....W....W...',
        E, E, E, E, E,
        '.WWW..WWW..WWW..',
        '.KKK..KKK..KKK..'])
T['Vive di raccoglitori'] = ('mix', raccoglitori)

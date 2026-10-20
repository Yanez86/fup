"""Talenti 16x16 (gruppo C, customer service): T[nome] = (tipo, funzione che restituisce 16 righe da 16 lettere)."""
from motore import Cv, process, overlay

T = {}
E = '.'*16

def voce():
    # cuffia con microfono: archetto, padiglioni e la stanghetta verso la bocca
    c = Cv(16)
    c.ring(7.5, 8.5, 6.6, 5.0, 'D'); c.rect(0, 9, 15, 15, '.')
    c.rect(1, 7, 3, 12, 'B'); c.rect(12, 7, 14, 12, 'B')
    c.line(12, 12, 9, 14, 'S'); c.rect(7, 13, 8, 14, 'R')
    return process(c.rows())
T['Voce da call center'] = ('pos', voce)

def ore23():
    # busta della mail sotto la luna: si risponde anche di notte
    c = Cv(16)
    c.disc(11.5, 4.0, 3.2, 'Y'); c.clear_disc(13.3, 2.6, 2.4)
    c.rect(1, 6, 11, 13, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E, E, E, E, E,
        '..K.......K.....',
        '...K.....K......',
        '....K...K.......',
        '.....KKK........'])
T['Risponde anche alle 23'] = ('mix', ore23)

def promette():
    # fumetto grande con la spunta verde: «Ma certo!»
    c = Cv(16)
    c.rect(1, 2, 14, 11, 'W'); c.set(1, 2, '.'); c.set(14, 2, '.'); c.set(1, 11, '.'); c.set(14, 11, '.')
    c.rect(3, 12, 6, 12, 'W'); c.rect(3, 13, 4, 13, 'W')
    r = process(c.rows(), keep='W')
    return overlay(r, [E, E, E,
        '...........GG...',
        '..........GG....',
        '...GG....GG.....',
        '....GG..GG......',
        '.....GGGG.......',
        '......GG........'])
T['Promette tutto'] = ('mix', promette)

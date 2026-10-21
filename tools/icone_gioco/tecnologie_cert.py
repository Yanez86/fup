"""Certificazioni 12x12 (fase 3): TE[id] = (albero, nome, funzione che restituisce 12 righe da 12 lettere)."""
from motore import Cv, process, ov

TE = {}

def t_gdp():
    # scatola di farmaci con la croce verde e il termometro
    c = Cv(12); c.rect(0, 3, 7, 10, 'W'); c.rect(9, 1, 10, 8, 'W'); c.rect(8, 8, 11, 11, 'R')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '..........R', '...GG.....R', '...GG.....R', '.GGGGGG...R', '.GGGGGG...R', '...GG.....R', '...GG', ''])
TE['gdp'] = ('cert', 'Buone pratiche per i farmaci (GDP)', t_gdp)

def t_iso14001():
    # foglia verde con la nervatura
    c = Cv(12)
    for y, (a, b) in enumerate([(7, 9), (5, 10), (4, 10), (3, 10), (2, 9), (2, 8), (2, 7), (3, 6), (4, 5)]):
        c.rect(a, 1+y, b, 1+y, 'G')
    c.line(1, 11, 4, 8, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '.......h', '......h', '.....h', '....h', '...h'])
TE['iso14001'] = ('cert', 'Ambiente ISO 14001', t_iso14001)

def t_iso45001():
    # elmetto da cantiere giallo
    c = Cv(12); c.disc(5.5, 7, 4.6, 'Y'); c.rect(0, 7, 11, 11, '.'); c.rect(0, 7, 11, 8, 'Y'); c.rect(5, 2, 6, 6, 'y')
    r = process(c.rows())
    return r
TE['iso45001'] = ('cert', 'Sicurezza ISO 45001', t_iso45001)

def t_adr():
    # rombo arancione delle merci pericolose con la fiamma
    c = Cv(12)
    for y in range(11):
        d = abs(5 - y); c.rect(d, y, 10 - d, y, 'O')
    r = process(c.rows())
    return ov(r, ['', '', '.....K', '....KK', '....KKK', '...KKKK', '...KKKK', '....KK', ''])
TE['adr'] = ('cert', 'Merci pericolose (ADR)', t_adr)

def t_banchina():
    # lucchetto con l'occhio della telecamera
    c = Cv(12); c.ring(5.5, 4, 3.6, 2.2, 'S'); c.rect(0, 5, 11, 11, '.'); c.rect(1, 5, 10, 11, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '.....KK', '.....KK', '......K', ''])
TE['banchina'] = ('cert', 'Bollino Banchina Sicura', t_banchina)

def t_aeo():
    # timbro della dogana: manico, tampone blu e impronta sul foglio
    c = Cv(12); c.rect(4, 0, 7, 2, 'N'); c.rect(2, 3, 9, 4, 'D'); c.rect(1, 6, 10, 9, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '', '', '..B.BB.B', '..BB.B.BB', ''])
TE['aeo'] = ('cert', 'Operatore doganale autorizzato', t_aeo)

def t_doganale():
    # cassa piombata con il sigillo rosso
    c = Cv(12); c.rect(0, 2, 11, 10, 'N'); c.rect(0, 5, 11, 6, 'n')
    r = process(c.rows())
    return ov(r, ['', '', '', '.K........K', '', '....RRR', '....RRR', '.....R', '', '.K........K'])
TE['doganale'] = ('cert', 'Deposito fiscale e doganale', t_doganale)

def t_parita():
    # bilancia a due piatti in pari
    c = Cv(12); c.rect(5, 1, 6, 9, 'S'); c.rect(1, 3, 10, 3, 'S'); c.rect(3, 10, 8, 11, 'S')
    c.rect(0, 6, 3, 7, 'P'); c.rect(8, 6, 11, 7, 'P'); c.set(1, 4, 'S'); c.set(10, 4, 'S'); c.set(1, 5, 'S'); c.set(10, 5, 'S')
    r = process(c.rows())
    return r
TE['parita'] = ('cert', 'Parità di genere', t_parita)

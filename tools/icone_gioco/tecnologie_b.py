"""Tecnologie 12x12 (albero Welfare): TE[id] = (albero, nome, funzione che restituisce 12 righe da 12 lettere)."""
from motore import Cv, process, ov

TE = {}

def t_acqua():
    c = Cv(12)
    c.rect(3, 1, 8, 4, 'L'); c.rect(5, 5, 6, 5, 'L')
    c.rect(2, 6, 9, 10, 'S')
    r = process(c.rows())
    return ov(r, ['', '', '...BBBBBB', '...BBBBBB', '', '', '', '...KKKKKK', '...RK..bK', '', ''])
TE['acqua'] = ('wel', 'Boccioni d\'acqua', t_acqua)

def t_frutta():
    c = Cv(12)
    c.disc(4.6, 6.8, 3.7, 'R')
    c.rect(5, 2, 5, 3, 'N')
    for (x, y) in [(10, 3), (10, 4), (10, 5), (10, 6), (9, 6), (9, 7), (9, 8), (8, 8), (8, 9), (7, 9), (9, 5)]:
        c.set(x, y, 'Y')
    r = process(c.rows())
    return ov(r, ['', '......GG', '.....GG'])
TE['frutta'] = ('wel', 'Servizio frutta', t_frutta)

def t_pulmino():
    c = Cv(12)
    c.rect(1, 2, 10, 7, 'Y'); c.set(10, 2, '.')
    c.disc(3, 8.5, 1.4, 'D'); c.disc(8, 8.5, 1.4, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '', '..LL.LL.LL', '..LL.LL.LL', '', '.........R', '', '...S....S'])
TE['pulmino'] = ('wel', 'Pulmini per i dipendenti', t_pulmino)

def t_asilo():
    c = Cv(12)
    for i, (a, b) in enumerate([(5, 6), (4, 7), (3, 8), (2, 9), (1, 10)]):
        c.rect(a, 1+i, b, 1+i, 'R')
    c.rect(2, 6, 9, 10, 'C')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '...RR.RR', '...RRRRR', '....RRR', '.....R'])
TE['asilo'] = ('wel', 'Asilo aziendale', t_asilo)

def t_cani():
    c = Cv(12)
    c.rect(3, 1, 4, 2, 'N'); c.rect(7, 1, 8, 2, 'N')
    c.rect(1, 3, 2, 4, 'N'); c.rect(9, 3, 10, 4, 'N')
    c.rect(3, 6, 8, 10, 'N'); c.rect(2, 7, 9, 9, 'N'); c.set(3, 10, '.'); c.set(8, 10, '.')
    return process(c.rows())
TE['cani'] = ('wel', 'Area cani', t_cani)

def t_orto():
    c = Cv(12)
    c.rect(1, 7, 10, 10, 'N')
    c.rect(5, 3, 6, 6, 'G'); c.rect(3, 2, 4, 3, 'G'); c.rect(7, 2, 8, 3, 'G')
    c.rect(2, 5, 2, 6, 'G'); c.rect(9, 5, 9, 6, 'G'); c.set(1, 5, 'G'); c.set(10, 5, 'G')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '...O....O', '...O....O', '........', ''])
TE['orto'] = ('wel', 'Orto aziendale', t_orto)

def t_caffe():
    c = Cv(12)
    c.rect(2, 4, 7, 8, 'W'); c.rect(3, 9, 6, 9, 'W')
    c.ring(8.4, 6.2, 2.0, 0.9, 'W')
    c.rect(1, 10, 9, 10, 'S')
    r = process(c.rows())
    return ov(r, ['...S..S', '....S..S', '...S..S', '', '...NNNN'])
TE['caffe'] = ('wel', 'Macchinette del caffè', t_caffe)

def t_relax():
    c = Cv(12)
    c.rect(2, 2, 9, 6, 'B')
    c.rect(1, 5, 2, 9, 'B'); c.rect(9, 5, 10, 9, 'B')
    c.rect(3, 7, 8, 9, 'L')
    r = process(c.rows(), keep='L')
    return ov(r, ['', '', '', '', '', '', '', '', '', '', '..K......K'])
TE['relax'] = ('wel', 'Sala pausa arredata', t_relax)

def t_colonnine():
    c = Cv(12)
    c.rect(1, 1, 6, 10, 'G')
    c.rect(7, 5, 8, 5, 'D'); c.rect(8, 6, 8, 8, 'D'); c.rect(8, 9, 10, 9, 'D'); c.rect(10, 7, 10, 8, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '..WWWW', '..WWYW', '..WYYW', '..YYYY', '..WYYW', '..WYWW', '', '...KK'])
TE['colonnine'] = ('wel', 'Colonnine di ricarica', t_colonnine)

def t_spogliatoi():
    c = Cv(12)
    c.rect(1, 1, 10, 10, 'B')
    r = process(c.rows())
    return ov(r, ['', '....K..K', '.ss.Kss.Kss', '....K..K', '.ss.Kss.Kss', '....K..K', '..W.K.WK..W', '....K..K', '....K..K'])
TE['spogliatoi'] = ('wel', 'Spogliatoi e docce', t_spogliatoi)

def t_lavanderia():
    c = Cv(12)
    c.rect(1, 4, 10, 5, 'T'); c.rect(1, 6, 2, 7, 'T'); c.rect(9, 6, 10, 7, 'T'); c.rect(3, 5, 8, 10, 'T')
    r = process(c.rows())
    return ov(r, ['.....K', '......K', '.....K', '....SSS', '....WTW', '.....W'])
TE['lavanderia'] = ('wel', 'Lavanderia delle divise', t_lavanderia)

def t_palestra():
    c = Cv(12)
    c.rect(1, 2, 2, 9, 'D'); c.rect(9, 2, 10, 9, 'D')
    c.rect(3, 4, 3, 7, 'S'); c.rect(8, 4, 8, 7, 'S'); c.rect(4, 5, 7, 6, 'S')
    return process(c.rows())
TE['palestra'] = ('wel', 'Palestra aziendale', t_palestra)

def t_presidio():
    c = Cv(12)
    c.rect(1, 3, 10, 10, 'W'); c.rect(4, 1, 7, 2, 'S'); c.rect(5, 2, 6, 2, '.')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '.....RR', '....RRRR', '....RRRR', '.....RR', '', '.ssssssss'])
TE['presidio'] = ('wel', 'Presidio medico', t_presidio)

def t_ascolto():
    c = Cv(12)
    c.rect(1, 1, 10, 7, 'W'); c.set(1, 1, '.'); c.set(10, 1, '.'); c.set(1, 7, '.'); c.set(10, 7, '.')
    c.rect(2, 8, 3, 8, 'W'); c.set(2, 9, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '...RR.RR', '...RRRRR', '....RRR', '.....R'])
TE['ascolto'] = ('wel', 'Sportello d\'ascolto', t_ascolto)

def t_italiano():
    c = Cv(12)
    c.rect(1, 1, 10, 8, 'N'); c.rect(2, 9, 2, 10, 'N'); c.rect(9, 9, 9, 10, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '..GGGGGGGG', '..G.WGWWG', '..GWGWWGW', '..GWWWGWG', '..GWGWWWW', '..GGGGGGGG', '..GGWWRR'][:0] +
              ['', '', '..GGGGGGGG', '..GWGGWWGG', '..WGWGWGWG', '..WWWGWWGG', '..WGWGWWGG', '..GGGGGGGG', '..GGWWWRRR'])
TE['italiano'] = ('wel', 'Corsi di italiano', t_italiano)

def t_clima():
    return ['...KKKKKK...',
            '..KSSSSSSK..',
            '.KSLLBBLLSK.',
            'KSLLLBBLLLSK',
            'KSLBBKKBBLSK',
            'KSLBBKKBBLSK',
            'KSLLLBBLLLSK',
            '.KSLLBBLLSK.',
            '..KssssssK..',
            '...KKSSKK...',
            '..KSSSSSSK..',
            '..KKKKKKKK..']
TE['clima'] = ('wel', 'Raffrescatori in reparto', t_clima)

def t_portale():
    # schermo con il pallet e la spunta verde: il cliente segue i suoi pallet da solo
    c = Cv(12)
    c.rect(0, 1, 11, 8, 'D'); c.rect(1, 2, 10, 7, 'L'); c.rect(5, 9, 6, 9, 'S'); c.rect(3, 10, 8, 10, 'S')
    r = process(c.rows(), keep='L')
    return ov(r, ['', '', '', '..NNN...G', '..NNN..G', '..nnnGG', '..n.n.G', ''])
TE['portale'] = ('mkt', 'Portale clienti', t_portale)

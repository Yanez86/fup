"""Tecnologie 12x12 del pacchetto Relazioni industriali (albero Sviluppo aziendale): TE[id] = (albero, nome, funzione)."""
from motore import Cv, process, ov

TE = {}

def t_relsind():
    # due fumetti che si parlano: bianco a sinistra, giallo a destra
    c = Cv(12)
    c.rect(1, 1, 6, 5, 'W'); c.set(2, 6, 'W')
    c.rect(5, 5, 10, 9, 'Y'); c.set(9, 10, 'Y')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '..K.K.K', '', '', '', '', '......KKK', ''])
TE['relsind'] = ('org', 'Relazioni sindacali', t_relsind)

def t_vendor():
    # cartellina degli audit con la lente
    c = Cv(12)
    c.rect(1, 1, 7, 10, 'N'); c.rect(2, 2, 6, 9, 'W'); c.rect(3, 0, 5, 1, 'S')
    c.ring(8, 7, 2.6, 1.4, 'D'); c.disc(8, 7, 1.4, 'L'); c.line(10, 9, 11, 10, 'D')
    r = process(c.rows(), keep='WL')
    return ov(r, ['', '', '', '...KK', '', '...KK', '', '...K'])
TE['vendor'] = ('org', 'Vendor management', t_vendor)

def t_paritetico():
    # tavolo tondo con due persone, una per parte
    c = Cv(12)
    c.disc(2.5, 3.5, 1.6, 'F'); c.disc(8.5, 3.5, 1.6, 'F')
    c.rect(1, 5, 4, 7, 'R'); c.rect(7, 5, 10, 7, 'B')
    c.rect(0, 7, 11, 8, 'N'); c.rect(2, 9, 2, 10, 'N'); c.rect(9, 9, 9, 10, 'N')
    return process(c.rows())
TE['paritetico'] = ('org', 'Comitato paritetico', t_paritetico)

def t_contenim():
    # scudo grigio con la fascia scura: si fa muro
    c = Cv(12)
    c.rect(2, 1, 9, 6, 'S'); c.rect(3, 7, 8, 8, 'S'); c.rect(4, 9, 7, 9, 'S'); c.rect(5, 10, 6, 10, 'S')
    c.rect(5, 1, 6, 9, 'D')
    return process(c.rows())
TE['contenim'] = ('org', 'Contenimento sindacale', t_contenim)

def t_secondo():
    # accordo firmato con la moneta del premio di risultato
    c = Cv(12)
    c.rect(1, 1, 7, 10, 'W')
    c.disc(8.5, 8.0, 2.6, 'Y')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '..KKKK', '', '..KKKK', '', '..BB', '........K', '........K', ''])
TE['secondo'] = ('org', 'Contrattazione di secondo livello', t_secondo)

def t_talpa():
    # la talpa spia: spunta dalla buca con gli occhiali scuri e il naso rosa
    c = Cv(12)
    c.disc(5.5, 6.0, 4.2, 'D'); c.rect(1, 6, 10, 8, 'D')
    c.rect(0, 9, 11, 10, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '', '..KKK.KKK', '..KLK.KLK', '...KKKKK', '.....ee', '..F.....F', ''])
TE['talpa'] = ('org', 'Talpa nel sindacato', t_talpa)

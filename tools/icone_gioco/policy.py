"""Policy aziendali 12x12, sul foglio del regolamento: POL[id] = (nome, funzione che restituisce 12 righe da 12 lettere)."""
from motore import Cv, process, ov

POL = {}

def p_zerostra():
    # orologio con la barra rossa: alle 17 si stacca
    c = Cv(12); c.disc(5.5, 5.5, 4.6, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['',
                  '..........R',
                  '.....K...R',
                  '.....K..R',
                  '.....K.R',
                  '.....KR',
                  '.....RKKK',
                  '....R',
                  '...R',
                  '..R',
                  '.R'])
POL['zerostra'] = ('Zero straordinario', p_zerostra)

def p_sabato():
    # pagina del calendario col 6: il sabato
    c = Cv(12); c.rect(1, 2, 10, 10, 'W'); c.rect(1, 2, 10, 3, 'R')
    r = process(c.rows(), keep='W')
    return ov(r, ['...K....K',
                  '...K....K',
                  '',
                  '',
                  '.....KKK',
                  '....K',
                  '....KKK',
                  '....K..K',
                  '.....KK'])
POL['sabato'] = ('Sabato obbligatorio', p_sabato)

def p_telefoni():
    # armadietto con il telefono chiuso dentro
    c = Cv(12); c.rect(2, 0, 9, 11, 'S')
    r = process(c.rows())
    return ov(r, ['',
                  '...KKKK',
                  '',
                  '...KKKK',
                  '',
                  '...KKKKK',
                  '...KBBK',
                  '...KBBK.Y',
                  '...KDDK',
                  '...KKKK'])
POL['telefoni'] = ('Telefoni nell\'armadietto', p_telefoni)

def p_spunta():
    # doppia spunta verde: due controlli, uno sopra l'altro
    c = Cv(12)
    c.line(1, 3, 3, 5, 'G'); c.line(3, 5, 7, 1, 'G')
    c.line(4, 8, 6, 10, 'G'); c.line(6, 10, 10, 6, 'G')
    return process(c.rows(), shade=False)
POL['spunta'] = ('Doppia spunta in uscita', p_spunta)

def p_nocoop():
    # contratto vero: foglio, firma blu e timbro verde
    c = Cv(12); c.rect(2, 0, 9, 11, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['',
                  '...KKKKK',
                  '',
                  '...KKKKKK',
                  '',
                  '...KKKK',
                  '.......GG',
                  '......G..G',
                  '..B...G..G',
                  '.B.BB..GG'])
POL['nocoop'] = ('Niente cooperative', p_nocoop)

def p_spending():
    # forbici che tagliano una moneta
    c = Cv(12)
    c.ring(2.5, 2.5, 2.2, 1.0, 'R'); c.ring(2.5, 9.0, 2.2, 1.0, 'R')
    c.line(4, 3, 9, 7, 'S'); c.line(4, 8, 9, 4, 'S')
    c.disc(9.2, 9.0, 2.4, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '.........y', '........y'])
POL['spending'] = ('Spending review', p_spending)

def p_cliente():
    # corona: il cliente è il re
    c = Cv(12)
    c.rect(1, 6, 10, 9, 'Y')
    for x in (1, 5, 6, 10):
        c.rect(x, 3, x, 5, 'Y')
    c.rect(2, 5, 9, 5, 'Y'); c.rect(4, 4, 7, 4, 'Y'); c.rect(1, 3, 1, 3, 'Y')
    c.set(5, 2, 'Y'); c.set(6, 2, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '..R..BB..R', '..R..BB..R'])
POL['cliente'] = ('Il cliente ha sempre ragione', p_cliente)

def p_limite80():
    # cartello del limite di velocità
    c = Cv(12); c.disc(5.5, 5.5, 5.4, 'R'); c.disc(5.5, 5.5, 4.0, 'W')
    r = process(c.rows(), shade=False)
    return ov(r, ['', '', '',
                  '...KKK.KKK',
                  '...K.K.K.K',
                  '...KKK.K.K',
                  '...K.K.K.K',
                  '...KKK.KKK'])
POL['limite80'] = ('Limite 80 all\'ora per i bilici', p_limite80)

def p_smart():
    # casa con il portatile davanti
    c = Cv(12)
    for i, (a, b) in enumerate([(5, 6), (4, 7), (3, 8), (2, 9), (1, 10)]):
        c.rect(a, 0+i, b, 0+i, 'R')
    c.rect(2, 5, 9, 9, 'W')
    c.rect(3, 7, 8, 9, 'D'); c.rect(1, 10, 10, 10, 'S')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '', '', '....BBBB', '....BBBB'])
POL['smart'] = ('Smart working in sede', p_smart)

def p_rotazione():
    # due frecce che girano: oggi al picking, domani al muletto
    c = Cv(12)
    c.ring(5.5, 5.5, 5.0, 3.2, 'O')
    for y in range(12):
        for x in range(12):
            if c.g[y][x] == 'O' and y >= 6: c.g[y][x] = 'B'
    c.rect(0, 5, 1, 5, '.'); c.rect(10, 6, 11, 6, '.')
    c.rect(8, 5, 11, 5, 'O'); c.rect(9, 6, 10, 6, 'O')
    c.rect(0, 6, 3, 6, 'B'); c.rect(1, 5, 2, 5, 'B')
    return process(c.rows())
POL['rotazione'] = ('Rotazione delle mansioni', p_rotazione)

def p_corta():
    # ombrellone a spicchi, sole e sabbia: tre giorni a casa
    c = Cv(12)
    c.rect(1, 4, 9, 4, 'R'); c.rect(2, 3, 8, 3, 'R'); c.rect(3, 2, 7, 2, 'R'); c.rect(4, 1, 6, 1, 'R')
    c.rect(5, 5, 5, 9, 'N')
    c.disc(10, 1.4, 1.5, 'Y')
    c.rect(0, 10, 11, 11, 'F')
    r = process(c.rows(), shade=False)
    return ov(r, ['', '....W.', '...WW.', '..WWW..R', '.WWW..RR'][:0] + ['', '.....W', '....WW', '...WWW', '..WWW'])
POL['corta'] = ('Settimana corta', p_corta)

def p_sicurezza():
    # elmetto giallo da cantiere
    c = Cv(12)
    c.disc(5.5, 6.5, 4.4, 'Y'); c.rect(0, 7, 11, 11, '.')
    c.rect(0, 7, 11, 8, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '.....yy', '.....yy', '.....yy', '.....yy'])
POL['sicurezza'] = ('Corso sicurezza obbligatorio', p_sicurezza)

def p_dueore():
    # busta della mail con l'orologio: risposta entro due ore
    c = Cv(12); c.rect(0, 4, 7, 10, 'W'); c.disc(8.5, 3.5, 3.2, 'Y')
    r = process(c.rows(), keep='W')
    return ov(r, ['',
                  '........K',
                  '........K',
                  '........KK',
                  '',
                  '.K....K',
                  '..K..K',
                  '...KK'])
POL['dueore'] = ('Rispondiamo entro 2 ore', p_dueore)

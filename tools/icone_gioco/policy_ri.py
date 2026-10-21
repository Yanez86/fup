"""Policy 12x12 del pacchetto Relazioni industriali: POL[id] = (nome, funzione)."""
from motore import Cv, process, ov

POL = {}

def p_lineadura():
    # pugno chiuso
    c = Cv(12)
    c.rect(2, 2, 9, 7, 'F'); c.rect(3, 8, 8, 10, 'F')
    r = process(c.rows())
    return ov(r, ['', '', '....K.K', '....K.K', '....K.K', '..KKKK', '', '', '', ''])
POL['lineadura'] = ('Linea dura', p_lineadura)

def p_porte():
    # porta aperta con la luce gialla dentro
    c = Cv(12)
    c.rect(2, 1, 9, 10, 'Y'); c.rect(2, 1, 4, 10, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '...y', '', '', '', ''])
POL['porte'] = ('Porte aperte', p_porte)

def p_presenza():
    # moneta col segno di spunta: premio a chi c'è
    c = Cv(12)
    c.disc(5.5, 5.5, 4.6, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '........G', '.......G', '..G...G', '...G.G', '....G', '', ''])
POL['presenza'] = ('Premio di presenza', p_presenza)

def p_crumiri():
    # pulmino arancione con il punto interrogativo: chi c'è dentro?
    c = Cv(12)
    c.rect(0, 3, 10, 8, 'O'); c.set(10, 3, '.')
    c.disc(2.5, 9.0, 1.3, 'D'); c.disc(8.5, 9.0, 1.3, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '.LL.LL.LL', '.LL.LL.LL', '', '', ''])
POL['crumiri'] = ('Crumiri in appalto', p_crumiri)

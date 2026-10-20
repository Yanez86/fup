"""Icone delle notifiche (colonna a destra della mappa), 16x16: stanno sulle tessere colorate delle notifiche."""
from motore import Cv, process, ov

UI = {}

# evento da decidere: fumetto bianco con il punto esclamativo rosso
def u_evento():
    c = Cv(16)
    c.rect(1, 1, 14, 10, 'W')
    for x, y in ((1, 1), (14, 1), (1, 10), (14, 10)): c.set(x, y, '.')
    c.rect(4, 11, 6, 11, 'W'); c.rect(4, 12, 5, 12, 'W'); c.set(4, 13, 'W')
    r = process(c.rows())
    return ov(r, ['', '', '', '.......RR', '.......RR', '.......RR', '.......rr', '', '.......RR'])
UI['evento'] = ('Evento da decidere', u_evento)

# cassa: moneta d'oro con il simbolo dell'euro
def u_cassa():
    c = Cv(16)
    c.disc(7.5, 7.5, 6.6, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '.......yyy', '......y', '.....yyyy', '......y', '.....yyyy', '......y', '.......yyy'])
UI['cassa'] = ('Cassa', u_cassa)

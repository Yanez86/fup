"""Manager e head hunter (menu): un manager in giacca e cravatta con la lente d'ingrandimento di chi lo cerca."""
from motore import Cv, process, ov

MENU = {}
def m_manager():
    c = Cv(16)
    c.disc(5.5, 4.5, 2.9, 'F'); c.rect(3, 1, 8, 2, 'N'); c.set(3, 1, '.'); c.set(8, 1, '.')
    c.rect(1, 9, 10, 14, 'D'); c.set(1, 9, '.'); c.set(10, 9, '.')
    c.ring(10.5, 9, 3.9, 2.3, 'Y'); c.disc(10.5, 9, 2.3, 'L')
    c.line(13, 12, 15, 14, 'N'); c.line(13, 13, 14, 14, 'N'); c.line(14, 12, 15, 13, 'N')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '', '.....W', '....WRW', '.....R', '.....R', '.....r'])
MENU['manager'] = ('Manager e head hunter', m_manager)

def m_certificazioni():
    # scudo azzurro con la spunta, come la cornice delle certificazioni
    c = Cv(16)
    for y, (a, b) in enumerate([(3, 12), (2, 13), (2, 13), (2, 13), (2, 13), (2, 13), (2, 13), (2, 13), (3, 12), (3, 12), (4, 11), (5, 10), (6, 9), (7, 8)]):
        c.rect(a, 1+y, b, 1+y, 'B')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '...........W', '..........WW', '.....W...WW', '.....WW.WW', '......WWW', '.......W'])
MENU['certificazioni'] = ('Certificazioni', m_certificazioni)

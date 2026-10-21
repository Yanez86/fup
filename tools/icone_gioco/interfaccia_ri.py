"""Menu e lente del pacchetto Relazioni industriali, 16x16."""
from motore import Cv, process, ov

MENU = {}
LENS = {}

def m_sindacato():
    # bandiera rossa sull'asta, mossa dal vento
    c = Cv(16)
    c.rect(2, 1, 3, 14, 'N')
    c.rect(4, 2, 12, 7, 'R'); c.rect(13, 3, 13, 8, 'R'); c.rect(4, 8, 12, 8, 'R')
    r = process(c.rows())
    return ov(r, ['', '', '', '......YY', '.....Y..Y', '......YY', '', ''])
MENU['sindacato'] = ('Relazioni industriali', m_sindacato)

def l_clima():
    # cartina a tre colori (calma, agitazione, presidio) con la bandierina
    c = Cv(16)
    c.rect(1, 1, 5, 14, 'G'); c.rect(6, 1, 10, 14, 'Y'); c.rect(11, 1, 14, 14, 'R')
    r = process(c.rows(), shade=False)
    return ov(r, ['', '', '.........KWWW', '.........KWWW', '.........K', '.........K', '.........K'])
LENS['clima'] = ('Clima sindacale', l_clima)

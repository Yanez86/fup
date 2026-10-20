"""Icone della schermata principale (partite salvate, nuova partita, novità), 16x16."""
from motore import Cv, process, ov

UI = {}

# partite salvate: dischetto azzurro con la linguetta grigia e l'etichetta bianca
def u_salva():
    c = Cv(16)
    c.rect(1, 1, 14, 14, 'B'); c.set(14, 1, '.')
    c.rect(4, 1, 10, 5, 'S')
    c.rect(3, 8, 12, 14, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '........DD', '........DD', '........DD', '', '', '', '', '', '....SSSSSS', '', '....SSSSSS'])
UI['salva'] = ('Partite salvate', u_salva)

# data della partita: calendario con la fascia rossa, gli anelli e un giorno segnato
def u_calendario():
    c = Cv(16)
    c.rect(1, 2, 14, 14, 'W'); c.rect(1, 2, 14, 5, 'R')
    c.rect(4, 0, 4, 3, 'S'); c.rect(11, 0, 11, 3, 'S')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '', '', '', '...SS.SS.SS.SS', '', '', '...SS.RR.SS', '', ''])
UI['calendario'] = ('Data della partita', u_calendario)

# nuova partita: croce arancione
def u_nuova():
    c = Cv(16)
    c.rect(6, 2, 9, 13, 'O'); c.rect(2, 6, 13, 9, 'O')
    return process(c.rows())
UI['nuova'] = ('Nuova partita', u_nuova)

# cancella: cestino rosso col coperchio grigio
def u_cestino():
    c = Cv(16)
    c.rect(6, 1, 9, 2, 'S'); c.set(7, 2, '.'); c.set(8, 2, '.')
    c.rect(2, 3, 13, 4, 'S')
    c.rect(3, 6, 12, 14, 'R')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '.....r..r..r', '.....r..r..r', '.....r..r..r', '.....r..r..r', '.....r..r..r', '.....r..r..r'])
UI['cestino'] = ('Cancella', u_cestino)

# tendina: freccia verso il basso (aperta, il gioco la gira)
def u_giu():
    c = Cv(16)
    for y, (a, b) in enumerate(((2, 4), (3, 5), (4, 6), (5, 7)), start=4):
        c.rect(a, y, b, y, 'D'); c.rect(15-b, y, 15-a, y, 'D')
    c.rect(6, 8, 9, 8, 'D'); c.rect(7, 9, 8, 9, 'D')
    return process(c.rows(), shade=False)
UI['giu'] = ('Apri la tendina', u_giu)

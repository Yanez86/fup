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

# salvataggio online: nuvola azzurra
def u_nuvola():
    c = Cv(16)
    c.paste(0, 3, ['......LLLL', '.....LLLLLL', '..LL.LLLLLLL', '.LLLLLLLLLLLLL', '.LLLLLLLLLLLLLL', '.LLLLLLLLLLLLLL', '.LLLLLLLLLLLLLL', '..LLLLLLLLLLLL'])
    return process(c.rows())
UI['nuvola'] = ('Salvataggio online', u_nuvola)

# ospite: persona col cappellino giallo da visitatore
def u_ospite():
    c = Cv(16)
    c.rect(3, 11, 12, 14, 'D'); c.rect(4, 10, 11, 10, 'D')
    c.rect(5, 4, 10, 9, 'F'); c.rect(5, 1, 10, 3, 'Y'); c.rect(4, 3, 13, 3, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '......K..K'])
UI['ospite'] = ('Ospite', u_ospite)

# accesso con un account: chiave gialla
def u_chiave():
    c = Cv(16)
    c.disc(4.5, 7.5, 3.5, 'Y'); c.disc(4.5, 7.5, 1, '.')
    c.rect(7, 6, 14, 8, 'Y'); c.rect(11, 9, 12, 11, 'Y'); c.rect(14, 9, 14, 10, 'Y')
    return process(c.rows(), shade=False)
UI['chiave'] = ('Entra con un account', u_chiave)

# scarica su file: foglio bianco con la freccia blu verso il basso
def u_scarica():
    c = Cv(16)
    c.rect(2, 1, 11, 14, 'W')
    c.rect(9, 6, 12, 11, 'B'); c.rect(7, 11, 14, 12, 'B'); c.rect(8, 13, 13, 13, 'B'); c.rect(9, 14, 12, 14, 'B'); c.rect(10, 15, 11, 15, 'B')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '...SSSSS', '', '...SSSSS', '', '...SSS', ''])
UI['scarica'] = ('Scarica su file', u_scarica)

# carica da file: foglio bianco con la freccia verde verso l'alto
def u_carica():
    c = Cv(16)
    c.rect(2, 1, 11, 14, 'W')
    c.rect(10, 5, 11, 5, 'G'); c.rect(9, 6, 12, 6, 'G'); c.rect(8, 7, 13, 7, 'G'); c.rect(7, 8, 14, 9, 'G'); c.rect(9, 10, 12, 14, 'G')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '...SSSSS', '', '...SSSSS', '', '...SSS', ''])
UI['carica'] = ('Carica da file', u_carica)

# customer service (menu): cornetta del telefono rossa e fumetto con i tre puntini
MENU = {}
def m_customer():
    c = Cv(16)
    c.rect(5, 1, 14, 7, 'W'); c.set(5, 1, '.'); c.set(14, 1, '.'); c.set(5, 7, '.'); c.set(14, 7, '.'); c.rect(7, 8, 8, 8, 'W')
    c.rect(1, 8, 4, 10, 'R'); c.rect(1, 11, 3, 13, 'R'); c.rect(2, 13, 7, 14, 'R'); c.rect(6, 12, 9, 13, 'R')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '.......K.K.K', ''])
MENU['customer'] = ('Customer service', m_customer)

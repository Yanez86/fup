"""Icone dell'interfaccia: abilità 10x10 (ST), menu a sinistra 16x16 (MENU), lenti della mappa e pulsanti 16x16 (LENS, UI)."""
from motore import Cv, process, ov

# ---------- abilità 10x10 ----------
ST = {}
def st_op():
    t = ['....KK....',
         '.K.KOOK.K.',
         'KOKOOOOKOK',
         '.KOOKKOOK.',
         'KOOK..KOOK',
         'KOOK..KOOK',
         '.KOOKKOOK.',
         'KOKOOOOKOK',
         '.K.KOOK.K.',
         '....KK....']
    t[7] = 'KoKooooKoK'; t[8] = '.K.KooK.K.'
    return t
ST['op'] = ('Operazioni', st_op)
def st_prec():
    c = Cv(10); c.disc(4.5, 4.5, 4.4, 'B'); c.disc(4.5, 4.5, 3.1, 'W'); c.disc(4.5, 4.5, 1.9, 'B')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '....RR', '....RR'])
ST['prec'] = ('Precisione', st_prec)
def st_neg():
    return ['..KKKKKK..',
            '.KYYYYYYK.',
            'KYYYYyyyYK',
            'KYYYyYYYYK',
            'KYyyyyYYYK',
            'KYYYyYYYYK',
            'KYyyyyYYYK',
            'KYYYYyyyYK',
            '.KyyyyyyK.',
            '..KKKKKK..']
ST['neg'] = ('Negoziazione', st_neg)
def st_lead():
    c = Cv(10); c.rect(1, 0, 1, 9, 'S'); c.rect(2, 1, 8, 5, 'R'); c.set(8, 3, '.'); c.set(7, 3, '.')
    r = process(c.rows())
    return ov(r, ['.K', '', '', '', '', '', '', '', '', '.K'][:0] + [''])
ST['lead'] = ('Leadership', st_lead)
def st_amm():
    c = Cv(10); c.rect(1, 0, 8, 9, 'G')
    r = process(c.rows())
    return ov(r, ['', '..LLLLL', '..LLLLL', '', '..W.W.W', '', '..W.W.W', '', '..W.W.R'])
ST['amm'] = ('Amministrazione', st_amm)
def st_inn():
    c = Cv(10); c.disc(4.5, 3.6, 3.4, 'P'); c.rect(3, 6, 6, 7, 'P'); c.rect(3, 8, 6, 9, 'S')
    r = process(c.rows())
    return ov(r, ['', '...W', '..W', '', '', '', '', '', '...s.s'])
ST['inn'] = ('Innovazione', st_inn)

# ---------- menu 16x16 ----------
MENU = {}
def m_azienda():
    c = Cv(16); c.disc(7.5, 5, 3.4, 'F'); c.rect(4, 1, 11, 3, 'N'); c.set(4, 1, '.'); c.set(11, 1, '.')
    c.rect(2, 10, 13, 14, 'D'); c.set(2, 10, '.'); c.set(13, 10, '.')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '.....K..K', '', '', '', '', '......WW', '......RR', '......Rr', '......rr'])
MENU['azienda'] = ('Azienda e CEO', m_azienda)
def m_magazzini():
    c = Cv(16)
    for i, (a, b) in enumerate([(6, 9), (4, 11), (2, 13), (1, 14)]):
        c.rect(a, 2+i, b, 2+i, 'R')
    c.rect(1, 6, 14, 14, 'S')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '....KKKKKK', '....KssssK', '....KDDDDK', '....KssssK', '....KDDDDK', '....KssssK', '....KDDDDK'])
MENU['magazzini'] = ('Magazzini', m_magazzini)
def m_clienti():
    c = Cv(16); c.rect(1, 5, 14, 13, 'N'); c.rect(5, 2, 10, 4, 'D'); c.rect(7, 3, 8, 4, '.')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '.KKKKKKKKKKKKKK', '......KYYK', '......KyyK', '......KKKK'])
MENU['clienti'] = ('Clienti', m_clienti)
def m_traffico():
    c = Cv(16); c.rect(4, 1, 11, 14, 'D'); c.rect(2, 3, 3, 4, 'D'); c.rect(12, 3, 13, 4, 'D'); c.rect(2, 7, 3, 8, 'D'); c.rect(12, 7, 13, 8, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '......RR', '.....RRRR', '......RR', '', '......YY', '.....YYYY', '......YY', '', '......GG', '.....GGGG', '......GG'])
MENU['traffico'] = ('Ufficio traffico', m_traffico)
def m_gare():
    c = Cv(16); c.rect(3, 1, 12, 14, 'W'); c.rect(10, 1, 12, 3, '.')
    c.disc(11.5, 12, 2.6, 'R')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '..........K', '..........SK', '..........SSK', '', '....KKKKKK', '', '....KKKKK', '', '....KKKK', '', '...........e', '..........eR', ''])
MENU['gare'] = ('Gare d\'appalto', m_gare)
def m_personale():
    c = Cv(16)
    c.disc(4.5, 5.5, 2.4, 'F'); c.rect(2, 2, 7, 4, 'Y'); c.rect(1, 4, 8, 4, 'Y')
    c.disc(11, 5.5, 2.4, 'F'); c.rect(8, 2, 13, 4, 'O'); c.rect(8, 4, 14, 4, 'O')
    c.rect(1, 9, 7, 14, 'B'); c.rect(9, 9, 14, 14, 'G')
    r = process(c.rows())
    return r
MENU['personale'] = ('Personale e manager', m_personale)
def m_direzione():
    c = Cv(16); c.rect(5, 1, 10, 4, 'Y'); c.rect(1, 10, 4, 13, 'B'); c.rect(6, 10, 9, 13, 'O'); c.rect(11, 10, 14, 13, 'G')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '.......KK', '.......KK', '..KKKKKKKKKKKK', '..KK...KK...KK', '..KK...KK...KK'])
MENU['direzione'] = ('Direzione', m_direzione)
def m_policy():
    c = Cv(16); c.rect(2, 2, 13, 14, 'N'); c.rect(4, 4, 11, 13, 'W'); c.rect(5, 1, 10, 3, 'S')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '....G..KKKK', '...GG', '..G', '', '....G..KKKK', '...GG', '..G', ''])
MENU['policy'] = ('Policy aziendali', m_policy)
def m_report():
    c = Cv(16); c.rect(1, 1, 14, 14, 'W'); c.rect(1, 1, 14, 3, 'G')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '...........B', '...........B', '.......O...B', '.......O...B', '...G...O...B', '...G...O...B', '...G...O...B', '..ssssssssss'])
MENU['report'] = ('Report KPI', m_report)
def m_riepilogo():
    c = Cv(16); c.rect(1, 1, 14, 14, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '..YYYY..hhhh', '..YyyY..hggh', '..YYYY..hhhh', '', '', '..........BB', '.......OO.BB', '....GG.OO.BB', '....GG.OO.BB', '..S.GG.OO.BB', '..SSSSSSSSSSS'][:13])
MENU['riepilogo'] = ('Riepilogo dell\'azienda', m_riepilogo)
def m_tecnologia():
    c = Cv(16); c.rect(3, 3, 12, 12, 'D')
    r = process(c.rows())
    pins = ['....S.S.S.S', '', '', '.S..........S', '', '.S..........S', '', '.S..........S', '', '.S..........S', '', '', '....S.S.S.S']
    r = ov(r, [''] + pins)
    return ov(r, ['', '', '', '', '', '.....BBBBB', '.....BBBBB', '.....BBBBB', '.....BBBBB', '.....bbbbb'])
MENU['tecnologia'] = ('Tecnologia', m_tecnologia)
def m_espansione():
    c = Cv(16)
    for i, (a, b) in enumerate([(3, 6), (1, 8)]):
        c.rect(a, 5+i, b, 5+i, 'R')
    c.rect(1, 7, 8, 14, 'S')
    c.rect(11, 1, 12, 8, 'G'); c.rect(8, 4, 15, 5, 'G')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '', '...KKKK', '...KDDK', '...KssK', '...KDDK', '...KssK'])
MENU['espansione'] = ('Espansione', m_espansione)
def m_enciclopedia():
    c = Cv(16); c.rect(2, 1, 12, 13, 'P'); c.rect(3, 14, 13, 14, 'W'); c.rect(13, 2, 13, 13, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '...p', '...p..YYYY', '...p.....Y', '...p....Y', '...p...Y', '...p', '...p...Y', '...p', '..........RR', '..........RR', '..........R', ''])
MENU['enciclopedia'] = ('Enciclopedia', m_enciclopedia)
def m_giornale():
    c = Cv(16); c.rect(1, 2, 14, 13, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '..KKKKKKKKKK', '..KKKKKKKKKK', '', '..SSSS.KKKKK', '..SSSS', '..SSSS.KKKKK', '..SSSS', '..SSSS.KKKKK', '', '..KKKKKKKKKK'])
MENU['giornale'] = ('Il giornale', m_giornale)

def m_classifica():
    # podio a tre gradini (argento, oro, bronzo) con la stella sopra il primo
    c = Cv(16); c.rect(1, 9, 4, 14, 'S'); c.rect(5, 6, 10, 14, 'Y'); c.rect(11, 10, 14, 14, 'O')
    c.rect(7, 0, 8, 4, 'Y'); c.rect(5, 2, 10, 2, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '.......KK', '......KKK', '.......KK', '.......KK', '.......KK'])
MENU['classifica'] = ('Classifica', m_classifica)


LENS = {}
UI = {}

# pulsante Produttività nella finestra del magazzino: pallet con la freccia in su (10x10, mostrata a 20 px)
def u_prod():
    return ['....KK....',
            '...KGGK...',
            '..KGGGGK..',
            '.KggGGggK.',
            '.KKKGGKKK.',
            '...KggK...',
            'KKKKKKKKKK',
            'KNNNNNNNNK',
            'KnKKnnKKnK',
            'KKKKKKKKKK']
UI['prod'] = ('Produttività', u_prod)

"""Tecnologie 12x12 (seconda parte): Logistica, Sviluppo aziendale, Mercato. TE[id] = (albero, nome, funzione)."""
from motore import Cv, process, ov
from policy import p_smart, p_corta

TE = {}

# ---------------- Logistica ----------------
def t_formazione():
    # lavagna su cavalletto: corsi veri
    c = Cv(12); c.rect(1, 1, 10, 7, 'N'); c.rect(2, 2, 9, 6, 'D')
    c.line(3, 8, 2, 10, 'N'); c.line(8, 8, 9, 10, 'N')
    r = process(c.rows(), keep='D')
    return ov(r, ['', '', '...WW', '...WWWW.W', '.....WW', '...W..WWW'])
TE['formazione'] = ('log', 'Formazione strutturata', t_formazione)

def t_anticoll():
    # triangolo di pericolo
    c = Cv(12)
    for i in range(9):
        a = 5 - i//2; b = 6 + i//2
        c.rect(a, 1+i, b, 1+i, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '.....KK', '.....KK', '.....KK', '', '.....KK'])
TE['anticoll'] = ('log', 'Sicurezza muletti', t_anticoll)

def t_rotte():
    # giro ottimizzato: partenza verde, strada, bandierina d'arrivo
    c = Cv(12)
    for (x0, y0, x1, y1) in [(2, 9, 2, 6), (2, 6, 6, 6), (6, 6, 6, 3), (6, 3, 8, 3)]:
        c.line(x0, y0, x1, y1, 'B')
    c.rect(1, 9, 3, 10, 'G')
    c.rect(9, 1, 9, 5, 'D'); c.rect(10, 1, 10, 2, 'R')
    return process(c.rows(), shade=False)
TE['rotte'] = ('log', 'Pianificazione rotte', t_rotte)

def t_rf():
    # terminale portatile con l'antenna che trasmette
    c = Cv(12); c.rect(3, 2, 7, 10, 'D'); c.rect(6, 0, 6, 1, 'D')
    r = process(c.rows())
    return ov(r, ['', '.........B', '....LLL.B.B', '....LLL..B', '....LLL', '', '....S.S', '', '....S.S'])
TE['rf'] = ('log', 'Radiofrequenza', t_rf)

def t_verticale():
    # torre automatica: scaffale alto con i cassetti colorati
    c = Cv(12); c.rect(2, 0, 9, 11, 'S')
    r = process(c.rows())
    return ov(r, ['',
                  '...OOO.BBB',
                  '..KKKKKKKK',
                  '...YYY.GGG',
                  '..KKKKKKKK',
                  '...BBB.OOO',
                  '..KKKKKKKK',
                  '...GGG.YYY',
                  '..KKKKKKKK',
                  '...OOO.BBB'])
TE['verticale'] = ('log', 'Magazzino verticale', t_verticale)

def t_sinergia():
    # camion con la merce di clienti diversi nello stesso cassone
    c = Cv(12); c.rect(0, 2, 7, 8, 'W'); c.rect(8, 4, 10, 8, 'O')
    c.disc(2.5, 9.5, 1.5, 'D'); c.disc(8.5, 9.5, 1.5, 'D')
    r = process(c.rows(), keep='WD')
    return ov(r, ['', '', '', '.RR.YY', '.RR.YY', '.BB.GG.', '.BB.GG', '', '', '..S.....S', '', '', ''][:0] +
              ['', '', '', '.RR.YY', '.RR.YY', '.BB.GG...L', '.BB.GG...L', '', '', '..S.....S'])
TE['sinergia'] = ('log', 'Sinergia in pianificazione', t_sinergia)

def t_ptl():
    # scaffale con le lucine sopra i vani: si accende quella giusta
    c = Cv(12)
    c.rect(1, 1, 2, 2, 'S'); c.rect(5, 1, 6, 2, 'G'); c.rect(9, 1, 10, 2, 'S')
    c.rect(0, 4, 11, 10, 'S')
    r = process(c.rows())
    return ov(r, ['', '', '', '',
                  '',
                  '.OO.KBBBK.YY',
                  '.OO.KBBBK.YY',
                  'KKKKKKKKKKKK',
                  '.NN.KYYYK.BB',
                  '.NN.KYYYK.BB'])
TE['ptl'] = ('log', 'Pick-to-light', t_ptl)

def t_amr():
    # robottino arancione che porta lo scaffale
    c = Cv(12); c.rect(2, 1, 9, 6, 'S'); c.rect(1, 7, 10, 9, 'O')
    r = process(c.rows())
    return ov(r, ['',
                  '',
                  '...NN.BB',
                  '..KKKKKKKK',
                  '...YY.NN',
                  '',
                  '',
                  '',
                  '....KLLK',
                  '',
                  '.KK....KK'])
TE['amr'] = ('log', 'Robot mobili (AMR)', t_amr)

# ---------------- Sviluppo aziendale ----------------
def t_gestionale():
    # fattura con il totale in euro
    c = Cv(12); c.rect(2, 0, 9, 11, 'W'); c.rect(8, 0, 9, 1, '.')
    r = process(c.rows(), keep='W')
    return ov(r, ['........K',
                  '........SK',
                  '...KKKK',
                  '',
                  '...ssssss',
                  '...ssss',
                  '...ssssss',
                  '',
                  '...GGGGGG',
                  '...GGWWGG',
                  '...GGGGGG'])
TE['gestionale'] = ('org', 'Gestionale amministrativo', t_gestionale)

def t_regolamento():
    # fascicolo delle regole sulla tavoletta, con la firma
    c = Cv(12); c.rect(2, 1, 9, 11, 'N'); c.rect(3, 2, 8, 10, 'W'); c.rect(4, 0, 7, 1, 'S')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '....KKKK', '', '....KKK', '', '....KKKK', '', '......R.', '.....R.R'])
TE['regolamento'] = ('org', 'Regolamento aziendale', t_regolamento)

def t_hr():
    # candidato sotto la lente: si cerca, si assume
    c = Cv(12); c.disc(4, 3, 2.2, 'F'); c.rect(1, 6, 7, 10, 'B')
    c.ring(8.5, 7.5, 2.6, 1.3, 'D'); c.disc(8.5, 7.5, 1.3, 'L'); c.line(10, 9, 11, 10, 'N')
    r = process(c.rows(), keep='L')
    return r
TE['hr'] = ('org', 'Ufficio del personale', t_hr)

def t_welfare2():
    # cuore con la moneta: convenzioni, si spende meno
    c = Cv(12)
    c.paste(0, 1, ['..RRR..RRR..',
                   '.RRRRRRRRRR.',
                   '.RRRRRRRRRR.',
                   '.RRRRRRRRRR.',
                   '..RRRRRRRR..',
                   '...RRRRRR...',
                   '....RRRR....',
                   '.....RR.....'])
    c.disc(8.6, 8.6, 2.2, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '', '', '', '........y', '........y'])
TE['welfare2'] = ('org', 'Piattaforma welfare', t_welfare2)

def t_controllo():
    # torta del budget: dove vanno i soldi
    import math
    c = Cv(12); c.disc(5.5, 5.5, 4.6, 'G')
    for y in range(12):
        for x in range(12):
            if c.g[y][x] != 'G': continue
            a = math.degrees(math.atan2(y - 5.5, x - 5.5))
            if -90 <= a < 0: c.g[y][x] = 'Y'
            elif 0 <= a < 60: c.g[y][x] = 'O'
    return process(c.rows())
TE['controllo'] = ('org', 'Controllo di gestione', t_controllo)

def t_academy():
    # tocco da laureato sopra il libro: la scuola interna
    c = Cv(12)
    for i, (a, b) in enumerate([(5, 6), (3, 8), (1, 10), (3, 8)]):
        c.rect(a, 1+i, b, 1+i, 'D')
    c.rect(3, 5, 8, 5, 'D')
    c.rect(1, 7, 10, 10, 'P')
    r = process(c.rows())
    return ov(r, ['', '', '.........Y', '.........Y', '.........Y', '........YY', '', '', '.WWWWWWWWW', ''])
TE['academy'] = ('org', 'Academy aziendale', t_academy)

def t_iso():
    # coccarda con il nastro blu e la spunta: certificati
    c = Cv(12); c.rect(3, 7, 4, 11, 'B'); c.rect(7, 7, 8, 11, 'B')
    c.disc(5.5, 4.5, 3.9, 'Y')
    r = process(c.rows())
    return ov(r, ['', '', '.......G', '......G', '..G..G', '...GG', '', '', '', '', '...B....B', ''])
TE['iso'] = ('cert', 'Certificazione ISO 9001', t_iso)

# ---------------- Mercato ----------------
def t_commerciale():
    # telefono rosso: i venditori chiamano loro
    c = Cv(12)
    c.rect(2, 2, 9, 3, 'R'); c.rect(1, 3, 2, 4, 'R'); c.rect(9, 3, 10, 4, 'R')
    c.rect(3, 5, 8, 9, 'R'); c.rect(2, 7, 9, 9, 'R')
    r = process(c.rows())
    return ov(r, ['', '', '', '', '', '....KK', '...KWWK', '...KWWK', '....KK'])
TE['commerciale'] = ('mkt', 'Ufficio commerciale', t_commerciale)

def t_edi():
    # due documenti che si scambiano ordini e bolle da soli
    c = Cv(12); c.rect(1, 2, 3, 9, 'W'); c.rect(8, 2, 10, 9, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '',
                  '.sss..O.sss',
                  '.....OOO',
                  '.sss..O.sss',
                  '.....O..',
                  '.sssOOO.sss',
                  '.....O..',
                  '.sss....sss'][:3] + ['.sss..O..ss', '......OO', '.ss...O..sss', '', '.sss.O...ss', '....OO', '.ss..O...sss'])
TE['edi'] = ('mkt', 'EDI con i clienti', t_edi)

def t_marketing():
    # megafono con le onde: il nome inizia a girare
    c = Cv(12)
    for i, (a, b) in enumerate([(6, 7), (5, 7), (3, 7), (3, 7), (5, 7), (6, 7)]):
        c.rect(a, 3+i, b, 3+i, 'O')
    c.rect(1, 5, 2, 6, 'D'); c.rect(4, 8, 4, 10, 'D')
    r = process(c.rows())
    return ov(r, ['', '', '.........B', '..........B', '.........B..', '..........B', '.........B'])
TE['marketing'] = ('mkt', 'Marketing e fiere', t_marketing)

def t_kam():
    # la chiave del grande cliente
    c = Cv(12); c.ring(3.5, 4.5, 2.6, 1.1, 'Y'); c.rect(6, 4, 10, 5, 'Y'); c.rect(8, 6, 8, 7, 'Y'); c.rect(10, 6, 10, 7, 'Y')
    r = process(c.rows())
    return r
TE['kam'] = ('mkt', 'Key account management', t_kam)

def t_accordi():
    # contratto nazionale: fascia tricolore e ceralacca
    c = Cv(12); c.rect(2, 1, 8, 10, 'W'); c.disc(8.5, 8.5, 2.0, 'R')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '...GGWWRR', '', '...ssss', '', '...ssss', '', '...ss'])
TE['accordi'] = ('mkt', 'Accordi quadro nazionali', t_accordi)

def t_ecom():
    # carrello della spesa online con il pacco dentro
    c = Cv(12)
    c.rect(4, 1, 7, 2, 'N')
    c.rect(1, 3, 10, 3, 'S'); c.rect(2, 4, 10, 4, 'S'); c.rect(2, 5, 9, 5, 'S'); c.rect(3, 6, 9, 6, 'S')
    c.set(0, 2, 'S')
    c.rect(3, 8, 4, 9, 'D'); c.rect(8, 8, 9, 9, 'D')
    r = process(c.rows(), keep='D')
    return ov(r, ['', '.....y'])
TE['ecom'] = ('mkt', 'Logistica e-commerce', t_ecom)

# ---------------- Welfare: usano il disegno della policy che sbloccano ----------------
TE['agile'] = ('wel', 'Lavoro agile', p_smart)
TE['corta'] = ('wel', 'Settimana corta', p_corta)

"""Lenti della mappa e pulsante Opzioni, 16x16 (stanno su pulsanti scuri: niente sfondo pieno)."""
from motore import Cv, process, ov

LENS = {}
UI = {}

def l_base():
    c = Cv(16)
    c.rect(1, 2, 5, 12, 'C'); c.rect(6, 3, 10, 13, 'C'); c.rect(11, 2, 14, 12, 'C')
    r = process(c.rows(), shade=False)
    return ov(r, ['', '', '..GG', '.GGGG.qqqqqGG', '.GGGGqqqqqGGGG', '..GGBBqqqqGGG', '....BBqqRRqG', '....qBBqRRqG', '...GqqBBqKqq', '..GGqqqBBqqq', '..GGqqqqBBqq', '.....qqqqqBB', '......qqqq'])
LENS['base'] = ('Mappa normale', l_base)

def l_prov():
    c = Cv(16)
    for (x, y, rr) in [(7, 7, 5.0), (10.5, 6, 4.0), (4, 10, 3.2), (9, 11, 3.2), (12, 10, 2.4)]:
        c.disc(x, y, rr, 'Y')
    seeds = [(4, 5, 'O'), (9.5, 3, 'B'), (12.5, 8, 'G'), (8, 10, 'Y'), (3, 11.5, 'P')]
    g = c.g
    for y in range(16):
        for x in range(16):
            if g[y][x] != '.': g[y][x] = min(seeds, key=lambda s: (s[0]-x)**2 + (s[1]-y)**2)[2]
    src = [r[:] for r in g]
    for y in range(16):
        for x in range(16):
            if src[y][x] in 'OBYGP':
                rt = src[y][x+1] if x+1 < 16 else '.'; dn = src[y+1][x] if y+1 < 16 else '.'
                if (rt in 'OBYGP' and rt != src[y][x]) or (dn in 'OBYGP' and dn != src[y][x]): g[y][x] = 'K'
    return process(c.rows(), shade=False)
LENS['prov'] = ('Province', l_prov)

def l_trips():
    c = Cv(16)
    c.line(5, 9, 12, 2, 'G'); c.line(6, 9, 13, 2, 'G')
    c.rect(6, 11, 12, 11, 'Y')
    c.line(3, 8, 5, 2, 'R'); c.line(4, 8, 6, 2, 'R')
    c.rect(1, 9, 5, 14, 'W'); c.rect(1, 8, 5, 9, 'R')
    c.rect(12, 1, 14, 3, 'W'); c.rect(13, 10, 15, 12, 'W'); c.rect(5, 1, 7, 2, 'W')
    r = process(c.rows(), keep='W')
    return ov(r, ['', '', '', '', '', '', '', '', '', '', '', '...D', '..DDD', '..DDD'])
LENS['trips'] = ('Viaggi', l_trips)

def u_opzioni():
    import math
    c = Cv(16)
    c.disc(7.5, 7.5, 4.9, 'S')
    for k in range(8):
        a = k*math.pi/4; cx = 7.5 + 5.6*math.cos(a); cy = 7.5 + 5.6*math.sin(a)
        c.rect(int(round(cx-1)), int(round(cy-1)), int(round(cx-1))+1, int(round(cy-1))+1, 'S')
    c.clear_disc(7.5, 7.5, 2.0)
    return process(c.rows())
UI['opzioni'] = ('Opzioni', u_opzioni)

"""Motore delle icone in pixel art di FUP (talenti, abilità, menu, tecnologie, policy, lenti).

Stile, uguale al resto dell'interfaccia: colori pieni con il bordo scuro K (#16202e), una sola fascia più scura
sul fondo di ogni forma alta almeno 3 pixel (come l'ombra interna in basso dei pulsanti), nessun riflesso sui lati;
nel gioco le tessere aggiungono l'ombra netta del disegno, spostata di 1 pixel in basso a destra.

Si disegna una sagoma piatta con i colori base (lettere maiuscole della tavolozza), poi process() aggiunge contorno
e fascia d'ombra; i dettagli si sistemano a mano con overlay(). Le minuscole sono i toni scuri: restano come sono.
Le lettere devono esistere anche in TPAL dentro src/game.html (lo controlla genera.py)."""
import math
from PIL import Image

PAL = {
 'K': '#16202e', 'W': '#ffffff', 'Y': '#ffd23f', 'O': '#ff7a3d', 'R': '#e0393e', 'G': '#2e9e48', 'B': '#5fb4f0', 'N': '#8a5f36',
 'S': '#c3d0dc', 'D': '#4a5f7a', 'T': '#1f9e8f', 'F': '#f2c79b', 'P': '#9b6bff', 'C': '#fff3c4', 'L': '#bfe6ff', 'M': '#6b3e1f',
 # toni scuri (fascia d'ombra e dettagli)
 'y': '#c98a00', 'o': '#c8551f', 'r': '#a8262a', 'g': '#217a36', 'b': '#2f7fd6', 'n': '#6b3e1f', 's': '#8a96a6', 'd': '#2a3a50',
 't': '#146b61', 'f': '#d9946a', 'p': '#6f43cf', 'q': '#e8c96a', 'm': '#3d2412',
 # toni chiari, solo come colori di contenuto (schermi, vetri, codice): mai come riflesso sui bordi
 'i': '#ffe680', 'a': '#ffb07a', 'e': '#ff8a8d', 'h': '#8ed15b', 'l': '#c8adff', 'u': '#5fd4c4', 'k': '#c08a55', 'j': '#7f95b0', 'v': '#ffe2c6',
}
DARK = {'Y': 'y', 'O': 'o', 'R': 'r', 'G': 'g', 'B': 'b', 'N': 'n', 'S': 's', 'D': 'd', 'T': 't', 'F': 'f', 'P': 'p', 'C': 'q', 'L': 'B', 'W': 'S', 'M': 'm'}

class Cv:
    """tela per le sagome: rettangoli, dischi, anelli, linee."""
    def __init__(s, n, m=None):
        s.w = n; s.h = m or n; s.g = [['.']*s.w for _ in range(s.h)]
    def set(s, x, y, c):
        if 0 <= x < s.w and 0 <= y < s.h: s.g[y][x] = c
    def rect(s, x0, y0, x1, y1, c):
        for y in range(y0, y1+1):
            for x in range(x0, x1+1): s.set(x, y, c)
    def disc(s, cx, cy, r, c):
        for y in range(s.h):
            for x in range(s.w):
                if (x-cx)**2 + (y-cy)**2 <= r*r: s.set(x, y, c)
    def ring(s, cx, cy, r1, r0, c):
        for y in range(s.h):
            for x in range(s.w):
                d = (x-cx)**2 + (y-cy)**2
                if r0*r0 < d <= r1*r1: s.set(x, y, c)
    def clear_disc(s, cx, cy, r):
        s.disc(cx, cy, r, '.')
    def line(s, x0, y0, x1, y1, c):
        dx, dy = abs(x1-x0), -abs(y1-y0); sx = 1 if x0 < x1 else -1; sy = 1 if y0 < y1 else -1; e = dx+dy
        while True:
            s.set(x0, y0, c)
            if x0 == x1 and y0 == y1: break
            e2 = 2*e
            if e2 >= dy: e += dy; x0 += sx
            if e2 <= dx: e += dx; y0 += sy
    def paste(s, x0, y0, rows):
        for y, r in enumerate(rows):
            for x, c in enumerate(r):
                if c != '.': s.set(x0+x, y0+y, c)
    def rows(s):
        return [''.join(r) for r in s.g]

def process(rows, outline=True, shade=True, keep=''):
    """contorno scuro attorno alla sagoma e fascia d'ombra sul fondo delle forme alte almeno 3 pixel.
    keep: lettere da non ombreggiare (per esempio 'W' per fogli e schermi)."""
    g = [list(r) for r in rows]; H = len(g); Wd = len(g[0])
    src = [r[:] for r in g]
    get = lambda x, y: src[y][x] if 0 <= x < Wd and 0 <= y < H else '.'
    if shade:
        for y in range(H):
            for x in range(Wd):
                c = src[y][x]
                if c not in DARK or c in keep: continue
                if get(x, y+1) != c and get(x, y-1) == c and get(x, y-2) == c:
                    g[y][x] = DARK[c]
    if outline:
        out = [r[:] for r in g]
        for y in range(H):
            for x in range(Wd):
                if src[y][x] != '.': continue
                if any(get(x+dx, y+dy) not in '.K' for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    out[y][x] = 'K'
        g = out
    return [''.join(r) for r in g]

def overlay(rows, fix):
    """ritocchi a mano: fix ha righe come rows (anche più corte o meno righe); '.' lascia, '_' svuota, altro sostituisce."""
    n = len(rows[0]); fix = [(f + '.'*n)[:n] for f in fix] + ['.'*n]*(len(rows)-len(fix))
    return [''.join(c if fc == '.' else ('.' if fc == '_' else fc) for c, fc in zip(r, f)) for r, f in zip(rows, fix)]
ov = overlay

def drop(rows, ch='Q'):
    """ombra netta: la sagoma spostata di 1 pixel in basso a destra (come la fa il gioco)."""
    H = len(rows); Wd = len(rows[0]); g = [list(r) for r in rows]
    for y in range(1, H):
        for x in range(1, Wd):
            if rows[y][x] == '.' and rows[y-1][x-1] != '.': g[y][x] = ch
    return [''.join(r) for r in g]

# ---------------- tessere, uguali a quelle che disegna il gioco ----------------
# tipo del talento: fondo, fascia in basso, filetto, ombra del disegno
TAL_T = {'pos': ('#eaf6ec', '#d5ecda', '#2e9e48', '#c4e2cb'), 'neg': ('#fbecec', '#f2d4d4', '#e0393e', '#eccaca'), 'mix': ('#fff6dc', '#f6e6b5', '#e0a800', '#efdca3')}
# alberi delle tecnologie: filetto, fondo, fascia in basso, angoli tagliati riga per riga
TEC_T = {'log': ('#ff7a3d', '#ffe8d9', '#ffd6bd', [0, 0, 0]), 'org': ('#9b6bff', '#ece3ff', '#dccdff', [3, 2, 1]),
         'mkt': ('#2e9e48', '#dff3d6', '#c9e9bd', [5, 3, 2, 1, 1]), 'wel': ('#e0393e', '#ffe1e1', '#ffcaca', [2, 1])}
POL_T = ('#fff3c4', '#e8d9a0')   # foglio del regolamento: fondo e fascia in basso

def _tile(n, inside, rim, bg, bg2, art, off, sh):
    edge = lambda x, y: inside(x, y) and not (inside(x-1, y) and inside(x+1, y) and inside(x, y-1) and inside(x, y+1))
    g = [[None]*n for _ in range(n)]
    for y in range(n):
        for x in range(n):
            if not inside(x, y): continue
            if edge(x, y): g[y][x] = PAL['K']; continue
            ring = rim and any(edge(x+a, y+b) for a in (-1, 0, 1) for b in (-1, 0, 1))
            g[y][x] = rim if ring else (bg2 if y >= n-4 else bg)
    a = drop(art)
    for y, r in enumerate(a):
        for x, c in enumerate(r):
            if c == '.' or g[y+off][x+off] in (None, PAL['K'], rim): continue
            g[y+off][x+off] = sh if c == 'Q' else PAL[c]
    return g

def tal_tile(art, typ):
    bg, bg2, rim, sh = TAL_T[typ]; n = 20
    return _tile(n, lambda x, y: 0 <= x < n and 0 <= y < n and min(x, n-1-x) + min(y, n-1-y) >= 2, rim, bg, bg2, art, 2, sh)

def tec_tile(art, tree):
    rim, bg, bg2, cut = TEC_T[tree]; n = 16
    cu = lambda r: cut[min(r, n-1-r)] if min(r, n-1-r) < len(cut) else 0
    return _tile(n, lambda x, y: 0 <= y < n and cu(y) <= x < n-cu(y), rim, bg, bg2, art, 2, bg2)

def pol_tile(art):
    bg, bg2 = POL_T; n = 16
    return _tile(n, lambda x, y: 0 <= x < n and 0 <= y < n, None, bg, bg2, art, 2, bg2)

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4)) + (255,)

def img(g, scale=1):
    """g: righe di lettere oppure griglia di colori (None = trasparente)."""
    H = len(g); Wd = len(g[0]); im = Image.new('RGBA', (Wd, H), (0, 0, 0, 0))
    for y, r in enumerate(g):
        for x, c in enumerate(r):
            if c is None or c == '.': continue
            im.putpixel((x, y), hexrgb(PAL[c] if len(c) == 1 else c))
    return im.resize((Wd*scale, H*scale), Image.NEAREST)

"""Icone della web app (schermata Home del telefono, scheda del browser): la scritta FUP sopra un collo su un pallet.
Disegnate su una griglia 32x32 e ingrandite senza sfumature. Scrive assets/icona_*.png, che build.py copia in dist/.
Uso: python3 tools/icone.py"""
import os
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = {'K': '#16202e', 'k': '#0c131d', 'b': '#1d2a3b', 'e': '#2a3a50', 'Y': '#ffd23f', 'y': '#b97f0c',
     'O': '#ff7a3d', 'o': '#c8551f', 'l': '#ffb07a', 'T': '#fff3c4', 'N': '#8a5f36', 'M': '#6b3e1f'}
FONT = {'F': ['###', '#..', '##.', '#..', '#..'], 'U': ['#.#', '#.#', '#.#', '#.#', '###'], 'P': ['##.', '#.#', '##.', '#..', '#..']}

def grid(n=32):
    g = [['b'] * n for _ in range(n)]
    def rect(x0, y0, x1, y1, c):  # estremi inclusi
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1): g[y][x] = c
    # scritta FUP (font 3x5 ingrandito 2 volte) con ombra netta
    for sh, col in ((1, 'k'), (0, 'Y')):
        for i, ch in enumerate('FUP'):
            for r, row in enumerate(FONT[ch]):
                for c, v in enumerate(row):
                    if v == '#': rect(5 + i * 8 + c * 2 + sh, 3 + r * 2 + sh, 6 + i * 8 + c * 2 + sh, 4 + r * 2 + sh, col)
    # collo di cartone con nastro, bordo scuro
    rect(7, 14, 24, 25, 'K'); rect(8, 15, 23, 24, 'O'); rect(8, 15, 23, 15, 'l'); rect(23, 15, 23, 24, 'o'); rect(8, 24, 23, 24, 'o')
    rect(15, 15, 16, 24, 'T'); rect(11, 18, 13, 19, 'o')
    # pallet: tavola e tre blocchetti
    rect(5, 25, 26, 29, 'K'); rect(6, 26, 25, 27, 'N'); rect(6, 28, 25, 29, 'b')
    for x in (6, 14, 22): rect(x, 28, x + 3, 29, 'M')
    rect(5, 30, 26, 30, 'K')
    return g

def image(g, size, pad=0):
    n = len(g) + 2 * pad
    im = Image.new('RGB', (n, n), C['b'])
    for y, row in enumerate(g):
        for x, c in enumerate(row): im.putpixel((x + pad, y + pad), tuple(int(C[c][i:i + 2], 16) for i in (1, 3, 5)))
    return im.resize((size, size), Image.NEAREST)

if __name__ == '__main__':
    g = grid()
    for sz in (32, 180, 192, 512):
        image(g, sz).save(os.path.join(ROOT, 'assets', f'icona_{sz}.png'))
    image(g, 512, pad=6).save(os.path.join(ROOT, 'assets', 'icona_maskable_512.png'))  # margine per le icone ritagliate a cerchio (Android)
    print('icone scritte in assets/')

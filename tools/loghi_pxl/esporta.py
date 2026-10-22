"""Porta nel gioco i loghi dei fornitori disegnati con pxl (tools/loghi_pxl/fornitori.px.js).
Legge i PNG 12x12 tools/out/loghi_pxl/sprites/logo_<id>.png, li riconverte in righe di lettere TPAL
e riscrive HLOGO in src/game.html (fondo del riquadro preso da BG nel file .px.js).
Uso: node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/fornitori.px.js --out tools/out/loghi_pxl
     python3 tools/loghi_pxl/esporta.py"""
import json, os, re
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'src', 'game.html'); PX = os.path.join(ROOT, 'tools', 'loghi_pxl', 'fornitori.px.js')
s = open(SRC, encoding='utf-8').read()
i = s.index('const TPAL={'); tp = re.findall(r"(\w):'(#[0-9a-f]{6})'", s[i:s.index('};', i)])
rev = {}
for k, h in tp:   # a parità di colore vince la prima lettera (le maiuscole vengono prima)
    rev.setdefault(tuple(int(h[j:j+2], 16) for j in (1, 3, 5)), k)
bg = dict(re.findall(r'(\w+): "(\w)"', re.search(r'const BG = \{([^}]*)\}', open(PX, encoding='utf-8').read()).group(1)))
out = {}
for id, b in bg.items():
    im = Image.open(os.path.join(ROOT, 'tools', 'out', 'loghi_pxl', 'sprites', f'logo_{id}.png')).convert('RGBA')
    assert im.size == (12, 12), (id, im.size)
    rows = [''.join('.' if im.getpixel((x, y))[3] < 128 else rev[im.getpixel((x, y))[:3]] for x in range(12)) for y in range(12)]
    out[id] = {'bg': b, 'ic': rows}
a = s.index('const HLOGO='); z = s.index(';\n', a)
s = s[:a] + 'const HLOGO=' + json.dumps(out, separators=(',', ':')) + s[z:]
open(SRC, 'w', encoding='utf-8').write(s)
print('HLOGO aggiornato:', ', '.join(out))

"""Porta nel gioco i loghi dei fornitori (tools/loghi_pxl/fornitori.px.js), dei consulenti (consulenti.px.js) e gli stemmi dei pacchetti (pacchetti.px.js), disegnati con pxl.
Legge i PNG 12x12 tools/out/loghi_pxl/sprites/logo_<id>.png, li riconverte in righe di lettere TPAL
e riscrive HLOGO e CLOGO in src/game.html (fondo del riquadro preso da BG nel file .px.js).
Gli stemmi 32x32 (pk_<id>.png) vanno in PACK_IC.
Uso: node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/fornitori.px.js --out tools/out/loghi_pxl
     node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/consulenti.px.js --out tools/out/loghi_pxl
     node .claude/skills/pxl-pixel-art/bin/pxl.js build tools/loghi_pxl/pacchetti.px.js --out tools/out/loghi_pxl
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
def bgOf(px): return dict(re.findall(r'(\w+): "(\w)"', re.search(r'const BG = \{([^}]*)\}', open(px, encoding='utf-8').read()).group(1)))
bg = bgOf(PX); cbg = bgOf(os.path.join(ROOT, 'tools', 'loghi_pxl', 'consulenti.px.js'))
SP = os.path.join(ROOT, 'tools', 'out', 'loghi_pxl', 'sprites')
def rows(name, n):
    im = Image.open(os.path.join(SP, name + '.png')).convert('RGBA')
    assert im.size == (n, n), (name, im.size)
    return [''.join('.' if im.getpixel((x, y))[3] < 128 else rev[im.getpixel((x, y))[:3]] for x in range(n)) for y in range(n)]
def put(name, val):
    global s
    a = s.index('const ' + name + '='); z = s.index(';\n', a)
    s = s[:a] + 'const ' + name + '=' + json.dumps(val, separators=(',', ':')) + s[z:]
out = {id: {'bg': b, 'ic': rows('logo_' + id, 12)} for id, b in bg.items()}
put('HLOGO', out)
cout = {id: {'bg': b, 'ic': rows('logo_' + id, 12)} for id, b in cbg.items()}
put('CLOGO', cout)
pk = {f[3:-4]: rows(f[:-4], 32) for f in sorted(os.listdir(SP)) if f.startswith('pk_') and f.endswith('.png')}
if pk: put('PACK_IC', pk)
open(SRC, 'w', encoding='utf-8').write(s)
print('HLOGO aggiornato:', ', '.join(out), '· CLOGO:', ', '.join(cout), '· PACK_IC:', ', '.join(pk))

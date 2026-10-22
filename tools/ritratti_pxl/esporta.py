"""Porta nel gioco i ritratti disegnati con pxl (tools/ritratti_pxl/ritratti.px.js).
Ogni ritratto è 48x56: quelli che si chiamano ceo_<nome> diventano assets/ritratto_<nome>.png (4x, 192x224),
quelli che si chiamano p_<nome> diventano assets/p_<nome>.png (2x, 96x112). build.py li incorpora al posto di
{{P_nome}} e {{Q_nome}}. Scrive anche l'anteprima di tutti in tools/out/ritratti_anteprima.png.
Uso: python3 tools/ritratti_pxl/esporta.py"""
import os, shutil, subprocess, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'tools', 'ritratti_pxl', 'ritratti.px.js')
OUT = os.path.join(ROOT, 'tools', 'out', 'ritratti_pxl')
DEST = os.path.join(ROOT, 'assets')
PXL = os.path.join(ROOT, '.claude', 'skills', 'pxl-pixel-art', 'bin', 'pxl.js')
W, H = 48, 56

shutil.rmtree(OUT, ignore_errors=True)
r = subprocess.run(['node', PXL, 'build', SRC, '--out', OUT], capture_output=True, text=True)
if r.returncode: sys.exit(f'la build non è andata\n{r.stdout}{r.stderr}')

fatti = []
for f in sorted(os.listdir(os.path.join(OUT, 'sprites'))):
    nome, ext = os.path.splitext(f)
    if ext != '.png' or not nome.startswith(('ceo_', 'p_')): continue
    im = Image.open(os.path.join(OUT, 'sprites', f)).convert('RGBA')
    if im.size != (W, H): sys.exit(f'{nome}: il ritratto deve essere {W}x{H}, è {im.size}')
    k, dest = (4, f'ritratto_{nome[4:]}.png') if nome.startswith('ceo_') else (2, f'{nome}.png')
    im.resize((W * k, H * k), Image.NEAREST).save(os.path.join(DEST, dest), optimize=True)
    fatti.append(im)

# anteprima: tutti i ritratti a 2x su sfondo chiaro, 12 per riga
n = 12
prev = Image.new('RGBA', (n * (W * 2 + 4) + 4, -(-len(fatti) // n) * (H * 2 + 4) + 4), '#bfe6ff')
for i, im in enumerate(fatti):
    prev.alpha_composite(im.resize((W * 2, H * 2), Image.NEAREST), (4 + (i % n) * (W * 2 + 4), 4 + (i // n) * (H * 2 + 4)))
prev.save(os.path.join(ROOT, 'tools', 'out', 'ritratti_anteprima.png'))
print(f'{len(fatti)} ritratti esportati in assets/ (anteprima in tools/out/ritratti_anteprima.png)')

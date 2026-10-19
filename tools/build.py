"""Costruisce dist/fup.html da src/game.html sostituendo i segnaposto {{...}} con le immagini in base64.
Uso: python3 tools/build.py   (poi apri dist/fup.html nel browser)"""
import base64, re, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, *p)
s = open(A('src', 'game.html'), encoding='utf-8').read()
def b64(f):
    return 'data:image/png;base64,' + base64.b64encode(open(A('assets', f), 'rb').read()).decode()
s = s.replace('{{MAP}}', b64('mappa_nw.png'))
s = re.sub(r'\{\{P_(\w+)\}\}', lambda m: b64(f'ritratto_{m.group(1)}.png'), s)  # CEO
s = re.sub(r'\{\{Q_(\w+)\}\}', lambda m: b64(f'p_{m.group(1)}.png'), s)         # manager, dirigenti, staff
left = re.findall(r'\{\{\w+\}\}', s)
if left: sys.exit(f'Segnaposto senza immagine: {left}')
os.makedirs(A('dist'), exist_ok=True)
open(A('dist', 'fup.html'), 'w', encoding='utf-8').write(s)
# controllo sintassi del JavaScript (se node è installato)
js = re.search(r'<script>(.*)</script>', s, re.S).group(1)
open(A('tools', 'out', 'check.js'), 'w', encoding='utf-8').write(js)
try:
    r = subprocess.run(['node', '--check', A('tools', 'out', 'check.js')], capture_output=True, text=True)
    if r.returncode: sys.exit('Errore di sintassi JS:\n' + r.stderr)
    print('sintassi JS ok')
except FileNotFoundError:
    print('node non trovato: salto il controllo sintassi')
print(f'dist/fup.html scritto ({len(s)//1024} KB)')

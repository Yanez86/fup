"""Costruisce dist/fup.html da src/game.html sostituendo i segnaposto {{...}} con le immagini in base64.
Copia accanto i file della web app (manifest, service worker, icone), che servono solo online (GitHub Pages).
Uso: python3 tools/build.py   (poi apri dist/fup.html nel browser)"""
import base64, hashlib, json, re, os, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, *p)
s = open(A('src', 'game.html'), encoding='utf-8').read()
def b64(f):
    return 'data:image/png;base64,' + base64.b64encode(open(A('assets', f), 'rb').read()).decode()
s = s.replace('{{MAP}}', b64('mappa_nw.png'))
s = s.replace('{{ICON}}', b64('icona_32.png'))
s = s.replace('{{PROV}}', open(A('assets', 'province.json'), encoding='utf-8').read().strip())  # confini, da tools/province.py
s = s.replace('{{ICONE}}', open(A('assets', 'icone.json'), encoding='utf-8').read().strip())  # icone in pixel art, da tools/icone_gioco/genera.py
s = re.sub(r'\{\{P_(\w+)\}\}', lambda m: b64(f'ritratto_{m.group(1)}.png'), s)  # CEO
s = re.sub(r'\{\{Q_(\w+)\}\}', lambda m: b64(f'p_{m.group(1)}.png'), s)         # manager, dirigenti, staff
left = re.findall(r'\{\{\w+\}\}', s.replace('{{SUPABASE}}', ''))
if left: sys.exit(f'Segnaposto senza immagine: {left}')
# libreria ufficiale di Supabase (salvataggio online), copiata da npm in assets/: la versione è scritta qui sotto
SB_VER = '2.117.2'
s = s.replace('{{SUPABASE}}', f'/* @supabase/supabase-js {SB_VER}, licenza MIT (assets/supabase.LICENSE) */\n' + open(A('assets', 'supabase.js'), encoding='utf-8').read().strip())
os.makedirs(A('dist'), exist_ok=True)
open(A('dist', 'fup.html'), 'w', encoding='utf-8').write(s)
# web app: manifest (controllato come JSON), icone e service worker con la versione della build
json.load(open(A('src', 'manifest.webmanifest'), encoding='utf-8'))
shutil.copy(A('src', 'manifest.webmanifest'), A('dist', 'manifest.webmanifest'))
for f in os.listdir(A('assets')):
    if f.startswith('icona_') and f != 'icona_32.png': shutil.copy(A('assets', f), A('dist', f))
ver = hashlib.sha1(s.encode()).hexdigest()[:10]
open(A('dist', 'sw.js'), 'w', encoding='utf-8').write(open(A('src', 'sw.js'), encoding='utf-8').read().replace('{{VER}}', ver))
# controllo sintassi del JavaScript (se node è installato)
js = re.findall(r'<script>(.*?)</script>', s, re.S)[-1]  # il gioco è l'ultimo script, prima c'è la libreria di Supabase
open(A('tools', 'out', 'check.js'), 'w', encoding='utf-8').write(js)
try:
    r = subprocess.run(['node', '--check', A('tools', 'out', 'check.js')], capture_output=True, text=True)
    if r.returncode: sys.exit('Errore di sintassi JS:\n' + r.stderr)
    r = subprocess.run(['node', '--check', A('dist', 'sw.js')], capture_output=True, text=True)
    if r.returncode: sys.exit('Errore di sintassi in sw.js:\n' + r.stderr)
    print('sintassi JS ok')
except FileNotFoundError:
    print('node non trovato: salto il controllo sintassi')
print(f'dist/fup.html scritto ({len(s)//1024} KB)')

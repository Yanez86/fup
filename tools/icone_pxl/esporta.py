"""Porta nel gioco le icone disegnate con pxl (tools/icone_pxl/*.px.js) e scrive assets/icone.json,
che build.py incorpora al posto di {{ICONE}}.

Builda ogni file (tranne comune.px.js) in una cartella pulita, rilegge i PNG degli sprite, li riconverte in righe di
lettere TPAL e controlla misure, colori e nomi contro i dati del gioco (talenti, tecnologie, policy, menu, lenti).
Scrive anche i fogli di anteprima nelle tessere del gioco: tools/out/icone_talenti.png, _tecnologie, _policy,
_interfaccia.

Nomi degli sprite (li crea comune.px.js): tal_<nome del talento senza accenti>, tec_<id>, pol_<id>, stat_<id>,
menu_<id>, lens_<id>, ui_<id>.
Uso: python3 tools/icone_pxl/esporta.py                       (tutti i file -> assets/icone.json)
     python3 tools/icone_pxl/esporta.py --prova policy.px.js   (solo quei file: controlli e anteprime, senza scrivere assets/icone.json)"""
import json, os, re, shutil, subprocess, sys, unicodedata
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIR = os.path.join(ROOT, 'tools', 'icone_pxl')
OUT = os.path.join(ROOT, 'tools', 'out', 'icone_pxl')
PXL = os.path.join(ROOT, '.claude', 'skills', 'pxl-pixel-art', 'bin', 'pxl.js')
SRC = open(os.path.join(ROOT, 'src', 'game.html'), encoding='utf-8').read()
KIND = {'tal': 'tal', 'tec': 'tec', 'pol': 'pol', 'stat': 'stat', 'menu': 'menu', 'lens': 'lens', 'ui': 'ui'}
SIZE = {'tal': 16, 'tec': 12, 'pol': 12, 'stat': 10, 'menu': 16, 'lens': 16}

def slug(s):   # uguale a slug() di comune.px.js
    s = ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower()
    return re.sub(r'[^a-z0-9]+', '_', s).strip('_')

def game_data():
    i = SRC.index('const TALENTS={'); j = SRC.index('\n};', i)
    tal = {n.replace("\\'", "'"): t for n, t in re.findall(r"^ '((?:[^'\\]|\\.)+)':\{t:'(\w+)'", SRC[i:j], re.M)}
    i = SRC.index('const TECH=['); j = SRC.index('\n];', i)
    tec = dict(re.findall(r"\{id:'(\w+)',tree:'(\w+)'", SRC[i:j]))
    i = SRC.index('const POLICIES=['); j = SRC.index('\n];', i)
    pol = re.findall(r"\{id:'(\w+)'", SRC[i:j])
    dock = re.findall(r"^ \['(\w+)','", SRC, re.M)
    lens = re.findall(r"\{id:'(\w+)',n:'[^']*',d:", SRC)
    i = SRC.index('const TPAL={'); j = SRC.index('};', i)
    tpal = re.findall(r"'?(\w)'?:'(#[0-9a-f]{6})'", SRC[i:j])
    return tal, tec, pol, dock, lens, tpal

def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def build(files=None):
    shutil.rmtree(OUT, ignore_errors=True)
    for f in files or sorted(os.listdir(DIR)):
        if f.endswith('.px.js') and f != 'comune.px.js':
            r = subprocess.run(['node', PXL, 'build', os.path.join(DIR, f), '--out', OUT], capture_output=True, text=True)
            if r.returncode or 'rror' in r.stderr: sys.exit(f'{f}: la build non è andata\n{r.stdout}{r.stderr}')

def collect(tpal):
    rev = {}
    for k, h in tpal: rev.setdefault(hexrgb(h), k)   # a parità di colore vince la prima lettera (le maiuscole vengono prima)
    out = {k: {} for k in KIND}; err = []
    sp = os.path.join(OUT, 'sprites')
    for f in sorted(os.listdir(sp)):
        nome, ext = os.path.splitext(f); pre = nome.split('_')[0]
        if ext != '.png' or pre not in KIND: continue
        im = Image.open(os.path.join(sp, f)).convert('RGBA'); w, h = im.size
        n = SIZE.get(pre, w)
        if (w, h) != (n, n): err.append(f'{nome}: deve essere {n}x{n}, è {w}x{h}'); continue
        rows = []
        for y in range(h):
            r = ''
            for x in range(w):
                c = im.getpixel((x, y))
                if c[3] == 0: r += '.'; continue
                if c[3] < 255 or c[:3] not in rev: err.append(f'{nome}: colore fuori da TPAL in {x},{y}: {c}'); r += '.'; continue
                r += rev[c[:3]]
            rows.append(r)
        out[pre][nome[len(pre)+1:]] = rows
    return out, err

def check(out, data):
    tal, tec, pol, dock, lens, tpal = data; err = []; warn = []
    tslug = {slug(n): n for n in tal}
    talenti = {}
    for k, rows in out['tal'].items():
        if k not in tslug: err.append(f'talento sconosciuto: {k} (il nome deve essere quello di TALENTS)')
        else: talenti[tslug[k]] = rows
    out['tal'] = {n: talenti[n] for n in tal if n in talenti}   # nell'ordine di TALENTS
    for kind, known in (('tec', tec), ('pol', pol)):
        for k in out[kind]:
            if k not in known: err.append(f'{kind}: id sconosciuto {k}')
    warn += [f'talento senza icona: {k}' for k in tal if k not in out['tal']]
    warn += [f'tecnologia senza icona: {k}' for k in tec if k not in out['tec']]
    warn += [f'policy senza icona: {k}' for k in pol if k not in out['pol']]
    warn += [f'voce del menu senza icona: {k}' for k in dock if k not in out['menu']]
    warn += [f'lente senza icona: {k}' for k in lens if k not in out['lens']]
    return err, warn

# ---------------- anteprime nelle tessere del gioco (come tileGrid in src/game.html) ----------------
TAL_T = {'pos': ('#eaf6ec', '#d5ecda', '#2e9e48', '#c4e2cb'), 'neg': ('#fbecec', '#f2d4d4', '#e0393e', '#eccaca'), 'mix': ('#fff6dc', '#f6e6b5', '#e0a800', '#efdca3')}

def tframes():
    """cornici delle tecnologie lette da TFRAME in src/game.html"""
    i = SRC.index('const TFRAME={'); j = SRC.index('};', i); s = SRC[i:j]; fr = {}
    for t, body in re.findall(r"(\w+):\{(c:'[^}]*)\}", s):
        g = dict(re.findall(r"(\w+):'(#[0-9a-f]{6})'", body))
        rows = re.search(r'rows:\[([\d,]+)\]', body); cut = re.search(r'cut:\[([\d,]*)\]', body)
        fr[t] = (g['c'], g['bg'], g['bg2'], {'rows': [int(v) for v in rows.group(1).split(',')]} if rows else [int(v) for v in cut.group(1).split(',') if v])
    return fr

def tile(n, inside, rim, bg, bg2, art, sh, pal):
    edge = lambda x, y: inside(x, y) and not (inside(x-1, y) and inside(x+1, y) and inside(x, y-1) and inside(x, y+1))
    g = [[None]*n for _ in range(n)]
    for y in range(n):
        for x in range(n):
            if not inside(x, y): continue
            if edge(x, y): g[y][x] = pal['K']; continue
            ring = rim and any(edge(x+a, y+b) for a in (-1, 0, 1) for b in (-1, 0, 1))
            g[y][x] = rim if ring else (bg2 if y >= n-4 else bg)
    on = lambda x, y: 0 <= y < len(art) and 0 <= x < len(art[y]) and art[y][x] != '.'
    free = lambda x, y: 0 <= x < n and 0 <= y < n and g[y][x] not in (None, pal['K'], rim)
    for y, r in enumerate(art):
        for x, c in enumerate(r):
            if c != '.' and not on(x+1, y+1) and free(x+3, y+3): g[y+3][x+3] = sh
    for y, r in enumerate(art):
        for x, c in enumerate(r):
            if c != '.' and free(x+2, y+2): g[y+2][x+2] = pal[c]
    return g

def img(g, pal, scale):
    if g and isinstance(g[0], str): g = [[None if c == '.' else pal[c] for c in r] for r in g]
    im = Image.new('RGBA', (len(g[0]), len(g)), (0, 0, 0, 0))
    for y, r in enumerate(g):
        for x, c in enumerate(r):
            if c: im.putpixel((x, y), hexrgb(c) + (255,))
    return im.resize((im.width*scale, im.height*scale), Image.NEAREST)

def sheet(items, path, pal, scale=3, per=8, label_w=130):
    if not items: return
    w = max(len(g[0]) for _, g in items)*scale; h = max(len(g) for _, g in items)*scale
    cw = max(w, label_w) + 16; ch = h + 34; rows = (len(items)+per-1)//per
    im = Image.new('RGBA', (per*cw+16, rows*ch+16), (230, 238, 243, 255)); d = ImageDraw.Draw(im)
    for i, (lab, g) in enumerate(items):
        x = 16 + (i % per)*cw; y = 16 + (i//per)*ch
        t = img(g, pal, scale); im.paste(t, (x, y), t)
        d.text((x, y+h+4), lab[:22], fill=(22, 32, 46, 255))
    im.save(path)

def previews(out, data):
    tal, tec, pol, dock, lens, tpal = data; pal = dict(tpal); od = os.path.join(ROOT, 'tools', 'out'); fr = tframes()
    def tt(art, typ):
        bg, bg2, rim, sh = TAL_T.get(typ, TAL_T['mix']); n = 20
        return tile(n, lambda x, y: 0 <= x < n and 0 <= y < n and min(x, n-1-x) + min(y, n-1-y) >= 2, rim, bg, bg2, art, sh, pal)
    def te(art, tree):
        rim, bg, bg2, cut = fr[tree]; n = 16
        cu = (lambda r: cut['rows'][r]) if isinstance(cut, dict) else (lambda r: cut[min(r, n-1-r)] if min(r, n-1-r) < len(cut) else 0)
        return tile(n, lambda x, y: 0 <= y < n and cu(y) <= x < n-cu(y), rim, bg, bg2, art, bg2, pal)
    pt = lambda art: tile(16, lambda x, y: 0 <= x < 16 and 0 <= y < 16, None, '#fff3c4', '#e8d9a0', art, '#e8d9a0', pal)
    sheet([(n, tt(g, tal.get(n, 'mix'))) for n, g in out['tal'].items()], os.path.join(od, 'icone_talenti.png'), pal)
    sheet([(k, te(g, tec.get(k, 'log'))) for k, g in out['tec'].items()], os.path.join(od, 'icone_tecnologie.png'), pal, 4)
    sheet([(k, pt(g)) for k, g in out['pol'].items()], os.path.join(od, 'icone_policy.png'), pal, 4)
    sheet([(k, g) for kind in ('stat', 'menu', 'lens', 'ui') for k, g in out[kind].items()], os.path.join(od, 'icone_interfaccia.png'), pal, 4)

if __name__ == '__main__':
    prova = '--prova' in sys.argv
    data = game_data()
    build([a for a in sys.argv[1:] if a.endswith('.px.js')])
    out, err = collect(data[5])
    e2, warn = check(out, data); err += e2
    if not prova:
        for w in warn: print('attenzione:', w)
    if err:
        for e in err: print('ERRORE:', e)
        sys.exit(1)
    out = {k: out[k] for k in ('tal', 'tec', 'pol', 'stat', 'menu', 'lens', 'ui')}
    if prova:
        previews(out, data); print('prova:', {k: len(v) for k, v in out.items()}, '· anteprime in tools/out/icone_*.png'); sys.exit()
    json.dump(out, open(os.path.join(ROOT, 'assets', 'icone.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    previews(out, data)
    print('assets/icone.json scritto:', {k: len(v) for k, v in out.items()}, '· anteprime in tools/out/icone_*.png')

"""Raccoglie i disegni delle icone, li controlla e scrive assets/icone.json (incorporato da build.py al posto di {{ICONE}}).

Uso:
  python3 tools/icone_gioco/genera.py                      # tutte le icone -> assets/icone.json + anteprime in tools/out/
  python3 tools/icone_gioco/genera.py --anteprima talenti_a --out /percorso/foglio.png   # solo il foglio di un modulo

I disegni stanno nei moduli di questa cartella:
  talenti*.py      T[nome del talento]  = (tipo, funzione)   16x16, nella tessera 20x20 col filetto del tipo
  tecnologie*.py   TE[id]               = (albero, nome, f)  12x12, nella cornice dell'albero
  policy*.py       POL[id]              = (nome, f)          12x12, sul foglio del regolamento
  interfaccia*.py  ST (abilità 10x10), MENU, LENS (16x16), UI (pulsanti, quadrate di qualsiasi misura)"""
import importlib, json, os, re, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import motore as M

SRC = open(os.path.join(ROOT, 'src', 'game.html'), encoding='utf-8').read()

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
    tpal = set(re.findall(r"'?(\w)'?:'#", SRC[i:j]))
    return tal, tec, pol, dock, lens, tpal

def modules(prefix):
    return sorted(f[:-3] for f in os.listdir(HERE) if f.startswith(prefix) and f.endswith('.py'))

def load(name):
    return importlib.import_module(name)

def collect():
    out = {'tal': {}, 'tec': {}, 'pol': {}, 'stat': {}, 'menu': {}, 'lens': {}, 'ui': {}}
    for m in modules('talenti'):
        for n, v in load(m).T.items(): out['tal'][n] = v[1]() if isinstance(v, tuple) else v()
    for m in modules('tecnologie'):
        for k, v in load(m).TE.items(): out['tec'][k] = v[2]()
    for m in modules('policy'):
        for k, v in load(m).POL.items(): out['pol'][k] = v[1]()
    for m in modules('interfaccia'):
        mod = load(m)
        for k, v in getattr(mod, 'ST', {}).items(): out['stat'][k] = v[1]()
        for key in ('menu', 'lens', 'ui'):
            for k, v in getattr(mod, key.upper(), {}).items(): out[key][k] = v[1]()
    return out

SIZE = {'tal': 16, 'tec': 12, 'pol': 12, 'stat': 10, 'menu': 16, 'lens': 16, 'ui': 16}

def check(out):
    tal, tec, pol, dock, lens, tpal = game_data(); err = []; warn = []
    for kind, d in out.items():
        n = SIZE[kind]
        for k, rows in d.items():
            if kind == 'ui': n = len(rows)   # pulsanti: basta che sia quadrata
            if len(rows) != n or any(len(r) != n for r in rows): err.append(f'{kind}/{k}: deve essere {n}x{n}')
            bad = {c for r in rows for c in r if c != '.' and (c not in M.PAL or c not in tpal)}
            if bad: err.append(f'{kind}/{k}: lettere senza colore in TPAL {sorted(bad)}')
    for k in out['tal']:
        if k not in tal: err.append(f'talento sconosciuto: {k}')
    for k in out['tec']:
        if k not in tec: err.append(f'tecnologia sconosciuta: {k}')
    for k in out['pol']:
        if k not in pol: err.append(f'policy sconosciuta: {k}')
    warn += [f'talento senza icona nuova: {k}' for k in tal if k not in out['tal']]
    warn += [f'tecnologia senza icona nuova: {k}' for k in tec if k not in out['tec']]
    warn += [f'policy senza icona nuova: {k}' for k in pol if k not in out['pol']]
    warn += [f'voce del menu senza icona nuova: {k}' for k in dock if k not in out['menu']]
    warn += [f'lente senza icona nuova: {k}' for k in lens if k not in out['lens']]
    return err, warn

def sheet(items, path, scale=3, per=8, label_w=130):
    """items: [(etichetta, griglia di colori)]"""
    if not items: return
    w = max(len(g[0]) for _, g in items)*scale; h = max(len(g) for _, g in items)*scale
    cw = max(w, label_w) + 16; ch = h + 34
    rows = (len(items)+per-1)//per
    im = Image.new('RGBA', (per*cw+16, rows*ch+16), M.hexrgb('#e6eef3')); d = ImageDraw.Draw(im)
    for i, (lab, g) in enumerate(items):
        x = 16 + (i % per)*cw; y = 16 + (i//per)*ch
        t = M.img(g, scale); im.paste(t, (x, y), t)
        d.text((x, y+h+4), lab[:22], fill=(22, 32, 46, 255))
    im.save(path)

def previews(out, prefix='icone'):
    tal, tec, pol, dock, lens, tpal = game_data(); od = os.path.join(ROOT, 'tools', 'out'); os.makedirs(od, exist_ok=True)
    sheet([(n, M.tal_tile(g, tal.get(n, 'mix'))) for n, g in out['tal'].items()], os.path.join(od, prefix+'_talenti.png'))
    sheet([(k, M.tec_tile(g, tec.get(k, 'log'))) for k, g in out['tec'].items()], os.path.join(od, prefix+'_tecnologie.png'), 4)
    sheet([(k, M.pol_tile(g)) for k, g in out['pol'].items()], os.path.join(od, prefix+'_policy.png'), 4)
    sheet([(k, g) for kind in ('stat', 'menu', 'lens', 'ui') for k, g in out[kind].items()], os.path.join(od, prefix+'_interfaccia.png'), 4)

def anteprima(mod, path):
    """foglio del solo modulo indicato, per chi disegna."""
    tal, tec, pol, dock, lens, tpal = game_data(); m = load(mod); items = []
    for n, v in getattr(m, 'T', {}).items(): items.append((n, M.tal_tile(v[1]() if isinstance(v, tuple) else v(), tal.get(n, 'mix'))))
    for k, v in getattr(m, 'TE', {}).items(): items.append((k, M.tec_tile(v[2](), tec.get(k, v[0]))))
    for k, v in getattr(m, 'POL', {}).items(): items.append((k, M.pol_tile(v[1]())))
    for key in ('ST', 'MENU', 'LENS', 'UI'):
        for k, v in getattr(m, key, {}).items(): items.append((k, v[1]()))
    sheet(items, path, scale=6, per=6)
    print('anteprima:', path, len(items), 'icone')

if __name__ == '__main__':
    if '--anteprima' in sys.argv:
        a = sys.argv; anteprima(a[a.index('--anteprima')+1], a[a.index('--out')+1]); sys.exit()
    out = collect(); err, warn = check(out)
    for w in warn: print('attenzione:', w)
    if err:
        for e in err: print('ERRORE:', e)
        sys.exit(1)
    json.dump(out, open(os.path.join(ROOT, 'assets', 'icone.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    previews(out)
    print('assets/icone.json scritto:', {k: len(v) for k, v in out.items()})

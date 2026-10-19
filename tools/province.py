"""Genera assets/province.json: i confini delle province del Nord-Ovest nelle coordinate della mappa (1280x800).
Fonte: openpolis/geojson-italy (ISTAT). Uso: python3 tools/province.py [file.geojson]
Senza argomento scarica il file da GitHub. Il risultato viene incorporato da build.py al posto di {{PROV}}."""
import json, os, sys, math, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_provinces.geojson'
LON0, LAT1, KX, KY = 4.81, 47.0, 78.29 * 2, 111.111 * 2   # stessa proiezione di pt() in game.html
REG = {1: 'Piemonte', 2: "Valle d'Aosta", 3: 'Lombardia', 7: 'Liguria'}
NAMES = {'AO': "Valle d'Aosta", 'MB': 'Monza e Brianza'}
# tavolozza della lente (lettere di TPAL), assegnata in modo che province confinanti abbiano colori diversi
COLS = ['O', 'B', 'G', 'Y', 'P', 'T', 'R']

def pt(lon, lat): return ((lon - LON0) * KX, (LAT1 - lat) * KY)

def dp(pts, eps):  # Douglas-Peucker
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1e-9
    best, idx = 0, 0
    for i in range(1, len(pts) - 1):
        p = pts[i]
        d = abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / L if L > 1e-9 else math.hypot(p[0] - a[0], p[1] - a[1])
        if d > best: best, idx = d, i
    if best <= eps: return [a, b]
    return dp(pts[:idx + 1], eps)[:-1] + dp(pts[idx:], eps)

def area(r): return 0.5 * sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))

def city_boxes():  # riquadri occupati da segnaposto e nome delle città (da CITIES in game.html), da non coprire con le sigle
    import re
    src = open(os.path.join(ROOT, 'src', 'game.html'), encoding='utf-8').read()
    block = src[src.index('const CITIES=['):src.index('const SITES=')]
    out = []
    for n, lo, la, big in re.findall(r"\['([^']+)',([\d.]+),([\d.]+)(?:,(\d))?", block):
        x, y = pt(float(lo), float(la)); cw = 11 if big == '1' else 8
        out.append((x - 7, y - 14, x + 10 + cw * len(n), y + 8))
    for lo, la in re.findall(r"lon:([\d.]+),lat:([\d.]+)", src[src.index('const SITES='):src.index('const SITES=') + 3000]):
        x, y = pt(float(lo), float(la)); out.append((x - 20, y - 18, x + 20 + 8 * 16, y + 12))  # magazzino + nome
    return out
BOX = city_boxes()

def label_pt(ring, txt):  # punto interno lontano dai bordi che non copre i nomi delle città (griglia)
    xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
    def inside(x, y):
        c = False
        for i in range(len(ring)):
            (x1, y1), (x2, y2) = ring[i - 1], ring[i]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: c = not c
        return c
    def dist(x, y):
        m = 1e9
        for i in range(len(ring)):
            (x1, y1), (x2, y2) = ring[i - 1], ring[i]; dx, dy = x2 - x1, y2 - y1; L = dx * dx + dy * dy
            t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / L)) if L else 0
            m = min(m, math.hypot(x - x1 - t * dx, y - y1 - t * dy))
        return m
    best = None
    for gx in range(int(min(xs)), int(max(xs)) + 1, 2):
        for gy in range(int(min(ys)), int(max(ys)) + 1, 2):
            if not inside(gx, gy): continue
            db = dist(gx, gy); sz = max(11, min(22, db * 0.9)); hw, hh = sz * 0.75, sz * 0.5
            free = not any(gx + hw > x0 and gx - hw < x1 and gy + hh > y0 and gy - hh < y1 for x0, y0, x1, y1 in BOX)
            key = (free, db)
            if not best or key > best[0]: best = (key, gx, gy, sz)
    return [best[1], best[2], round(best[3])]

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else None
    data = json.load(open(src, encoding='utf-8')) if src else json.load(urllib.request.urlopen(URL))
    provs = []
    for f in data['features']:
        p = f['properties']
        if p['reg_istat_code_num'] not in REG: continue
        g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        rings, raw = [], []
        for poly in polys:
            r = [pt(*c[:2]) for c in poly[0]]
            raw.extend(poly[0])
            s = dp(r, 0.9)
            if len(s) >= 4 and abs(area(s)) > 6: rings.append([[round(x), round(y)] for x, y in s])
        big = max(rings, key=lambda r: abs(area(r)))
        provs.append({'id': p['prov_acr'], 'n': NAMES.get(p['prov_acr'], p['prov_name']), 'reg': REG[p['reg_istat_code_num']],
                      'rings': rings, 'lp': label_pt(big, p['prov_acr']), '_raw': {(round(a, 3), round(b, 3)) for a, b in raw}})
    # confinanti = condividono vertici dei confini originali
    adj = {a['id']: {b['id'] for b in provs if b is not a and len(a['_raw'] & b['_raw']) > 2} for a in provs}
    col = {}
    for pr in sorted(provs, key=lambda q: -len(adj[q['id']])):
        used = {col.get(n) for n in adj[pr['id']]}
        col[pr['id']] = next(c for c in COLS if c not in used)
    for pr in provs:
        pr['c'] = col[pr['id']]; del pr['_raw']
    out = os.path.join(ROOT, 'assets', 'province.json')
    json.dump(provs, open(out, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'{out}: {len(provs)} province, {os.path.getsize(out) // 1024} KB')

main()

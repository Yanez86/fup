"""Porta nel gioco le scenette degli eventi disegnate con pxl (tools/scene_pxl/*.px.js).
Builda ogni file (tranne comune.px.js) in una cartella pulita, poi per ogni scena scrive assets/scene/<nome>.png:
una striscia di 16 fotogrammi 160x72 da 125 ms l'uno, che il gioco fa scorrere con il CSS (vedi SCN in src/game.html).
build.py le incorpora tutte al posto di {{SCENE}}. Le scene che si chiamano prova_* o test_* restano fuori.
Le scene el_* (elementi da mettere sopra un esterno di magazzino) sono trasparenti fuori dall'elemento: restano con la trasparenza.
Gli esterni (est_*) e i loro strati (el_*) si disegnano su 160x72 ma si tagliano a x 8..151: nel gioco sono 144x72, un po' meno allungati.
I pezzi dell'ingresso (hall_*, interno del magazzino della schermata principale) hanno misura libera e la trasparenza;
se non si muovono restano un'immagine sola, altrimenti sono una striscia di 16 fotogrammi come le scene.
Uso: python3 tools/scene_pxl/esporta.py            (tutti i file; toglie le scene che non esistono più)
     python3 tools/scene_pxl/esporta.py eventi.px.js  (solo quei file)"""
import os, shutil, subprocess, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DIR = os.path.join(ROOT, 'tools', 'scene_pxl')
OUT = os.path.join(ROOT, 'tools', 'out', 'scene_pxl_esporta')
DEST = os.path.join(ROOT, 'assets', 'scene')
PXL = os.path.join(ROOT, '.claude', 'skills', 'pxl-pixel-art', 'bin', 'pxl.js')
W, H, N, MS = 160, 72, 16, 125   # misura, fotogrammi e durata di ogni fotogramma (16 x 125 ms = 2 secondi)
TAGLIO = 8                       # colonne tolte a sinistra e a destra degli esterni e dei loro strati

shutil.rmtree(OUT, ignore_errors=True)
tutti = len(sys.argv) < 2
for f in sorted(os.listdir(DIR)) if tutti else sys.argv[1:]:
    if f.endswith('.px.js') and f != 'comune.px.js':
        r = subprocess.run(['node', PXL, 'build', os.path.join(DIR, f), '--out', OUT], capture_output=True, text=True)
        if r.returncode: sys.exit(f'{f}: la build non è andata\n{r.stdout}{r.stderr}')

def frames(nome, modo='RGB'):
    """I fotogrammi della GIF della scena, ripetuti secondo la loro durata, fino a 16 da 125 ms."""
    im = Image.open(os.path.join(OUT, 'scenes', nome + '.gif'))
    out = []
    for i in range(im.n_frames):
        im.seek(i)
        fr = im.convert(modo)
        out += [fr] * max(1, round(im.info.get('duration', MS) / MS))   # la GIF arrotonda a centesimi: 125 ms diventano 130
    # se tutto quello che si muove ha un giro più corto (8, 4 o 2 fotogrammi), pxl ne esporta solo uno: lo ripeto fino a 2 secondi
    return out * (N // len(out)) if N % len(out) == 0 else out

os.makedirs(DEST, exist_ok=True)
fatte = []
for f in sorted(os.listdir(os.path.join(OUT, 'scenes'))):
    nome, ext = os.path.splitext(f)
    if ext != '.png' or nome.startswith(('prova', 'test')): continue
    hall = nome.startswith('hall_')
    if hall and not os.path.exists(os.path.join(OUT, 'scenes', nome + '.gif')):   # pezzo fermo: l'immagine così com'è
        shutil.copy(os.path.join(OUT, 'scenes', f), os.path.join(DEST, f))
        fatte.append(f'{nome} ({os.path.getsize(os.path.join(DEST, f)) // 1024 + 1} KB)'); continue
    if not os.path.exists(os.path.join(OUT, 'scenes', nome + '.gif')): sys.exit(f'{nome}: la scena non si muove (serve almeno una cosa animata)')
    el = nome.startswith('el_') or hall
    fr = frames(nome, 'RGBA' if el else 'RGB')
    if len(fr) != N or (fr[0].size != (W, H) and not hall): sys.exit(f'{nome}: servono {N} fotogrammi da {MS} ms di {W}x{H}, ne ho {len(fr)} da {fr[0].size}')
    if (el and not hall) or nome.startswith('est_'): fr = [x.crop((TAGLIO, 0, W - TAGLIO, H)) for x in fr]
    w, h = fr[0].size
    st = Image.new('RGBA' if el else 'RGB', (w * N, h))
    for i, x in enumerate(fr): st.paste(x, (w * i, 0))
    if el:   # elemento trasparente: PNG con la trasparenza, i pixel o sono pieni o non ci sono
        st.save(os.path.join(DEST, nome + '.png'), optimize=True)
        fatte.append(f'{nome} ({os.path.getsize(os.path.join(DEST, nome + ".png")) // 1024 + 1} KB)'); continue
    # tavolozza esatta: i colori della scena e nient'altro (niente sfumature inventate dalla compressione)
    col = [c for _, c in st.getcolors(256) or sys.exit(f'{nome}: più di 256 colori')]
    pal = Image.new('P', (1, 1)); pal.putpalette([v for c in col for v in c] + [0] * (768 - 3 * len(col)))
    p = st.quantize(palette=pal, dither=Image.Dither.NONE)
    assert p.convert('RGB').tobytes() == st.tobytes(), nome
    p.save(os.path.join(DEST, nome + '.png'), optimize=True)
    fatte.append(f'{nome} ({os.path.getsize(os.path.join(DEST, nome + ".png")) // 1024 + 1} KB)')
vecchie = [f for f in os.listdir(DEST) if f[:-4] not in [x.split(' ')[0] for x in fatte]] if tutti else []
for f in vecchie: os.remove(os.path.join(DEST, f))
print('Scene esportate in assets/scene:', ', '.join(fatte) + (f' · tolte: {", ".join(vecchie)}' if vecchie else ''))

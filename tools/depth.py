import math, json, random
exec(open('raster.py').read().split("res={}")[0])
alps=[(6.9,44.15),(7.0,44.9),(7.1,45.5),(7.3,45.85),(7.9,45.95),(8.4,46.3),(9.3,46.42),(10.2,46.4),(10.8,46.6),(11.5,46.85),(12.3,46.75),(12.9,46.55),(13.6,46.4)]
def dpoly(p,pl): return min(dist_seg(p,pl[i],pl[i+1]) for i in range(len(pl)-1))
extra=[[(8.75,40.6),(9.35,39.9)],[(14.0,37.9),(14.8,37.9)],[(15.9,39.5),(16.6,39.2)],[(15.0,37.75),(15.0,37.76)],[(12.9,44.0),(11.9,44.25)],[(10.3,44.2),(9.4,44.5)]]
grid2={}
for (c,r),t in grid.items():
    p=cell_center(c,r); lon,lat=p
    if t=='fx':
        grid2[(c,r)]='fx2' if (c*7+r*3)%11==0 else 'fx'; continue
    if t=='lake': grid2[(c,r)]='lake'; continue
    da=dpoly(p,alps); ds=dpoly(p,spine); de=min(dpoly(p,e) for e in extra)
    etna=math.hypot((lon-14.99)*0.745,lat-37.75)
    lvl=0
    if da<0.12 or etna<0.07: lvl=5
    elif da<0.28 or etna<0.13: lvl=4
    elif da<0.45 or ds<0.1: lvl=3
    elif da<0.62 or ds<0.2 or de<0.12 or etna<0.2: lvl=2
    elif ds<0.33 or de<0.22 or da<0.75: lvl=1
    grid2[(c,r)]='L%d'%lvl
# coast shallow water
for r in range(ROWS):
    for c in range(COLS):
        if (c,r) in grid2: continue
        near=min((max(abs(dc),abs(dr)) for dc in range(-2,3) for dr in range(-2,3) if (c+dc,r+dr) in grid and grid[(c+dc,r+dr)]!='lake'),default=9)
        if near==1: grid2[(c,r)]='s1'
        elif near==2: grid2[(c,r)]='s2'
# plain dither
for k,v in list(grid2.items()):
    c,r=k
    if v=='L0' and (c+2*r)%5==0: grid2[k]='L0d'
    if v=='L1' and (2*c+r)%5==0: grid2[k]='L1d'
random.seed(4)
waves=set()
for i in range(70):
    c=random.randrange(COLS); r=random.randrange(ROWS)
    if (c,r) not in grid2 and (c+1,r) not in grid2: waves.add((c,r))
def runs_of(key):
    out=[]
    for r in range(ROWS):
        c=0
        while c<COLS:
            if grid2.get((c,r))==key and (c,r) not in roadcells:
                s=c
                while c<COLS and grid2.get((c,r))==key and (c,r) not in roadcells: c+=1
                out.append((s,r,c-s))
            else: c+=1
    return out
def svg(rs): return ''.join(f'<rect x="{s*CELL}" y="{r*CELL}" width="{w*CELL}" height="{CELL}"></rect>' for s,r,w in rs)
cols={'s2':'#2f8fd8','s1':'#4cabeb','fx':'#b9cdb3','fx2':'#a9bfa2','L0':'#9fe063','L0d':'#8fd456','L1':'#6cc04a','L1d':'#5fb240','L2':'#3f9640','L3':'#b48552','L4':'#8a5f36','L5':'#eef4f8','lake':'#4cabeb'}
out=''
for k,col in cols.items():
    out+=f'<g fill="{col}">'+svg(runs_of(k))+'</g>\n'
out+='<g fill="#7cc4f4">'+''.join(f'<rect x="{c*CELL+1}" y="{r*CELL+2}" width="8" height="2"></rect>' for c,r in sorted(waves))+'</g>\n'
# italy silhouette for shadow
it=[(c,r) for (c,r),t in grid.items() if t!='fx']
def runs2(S):
    o=[]
    for r in range(ROWS):
        c=0
        while c<COLS:
            if (c,r) in S:
                s=c
                while (c,r) in S: c+=1
                o.append((s,r,c-s))
            else: c+=1
    return o
S=set(it)
shadow='<g fill="#1a5e9e">'+svg([(s,r,w) for s,r,w in runs2(S)])+'</g>'
open('layers.svg','w').write(shadow+'\n'+out)
print(len(shadow)+len(out))
for r in range(ROWS):
    print(''.join({'L0':'.','L0d':'.','L1':':','L1d':':','L2':'+','L3':'n','L4':'N','L5':'*','lake':'o','fx':' ','fx2':' ','s1':'~','s2':'-'}.get(grid2.get((c,r)),' ') for c in range(COLS)))

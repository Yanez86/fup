import os as _os
ROOT=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from scipy import ndimage
W=48; H=56
yy,xx=np.mgrid[0:H,0:W]+0.5
def hexc(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)],float)
class Canvas:
    def __init__(s):
        s.img=np.zeros((H,W,3)); s.obj=np.zeros((H,W),bool)
    def fill(s,m,c):
        s.img[m]=hexc(c); s.obj|=m
    def px(s,pts,c):
        for x,y in pts: s.img[y,x]=hexc(c); s.obj[y,x]=True
    def shaded(s,m,base,dark,light,cx,cy,rx,ry,td=0.35,tl=-0.5):
        u=((xx-cx)/rx*0.8+(yy-cy)/ry*0.6)
        s.fill(m,base)
        s.img[m&(u>td)]=hexc(dark)
        s.img[m&(u<tl)]=hexc(light)
    def outline(s,c='#1b1420'):
        edge=s.obj&~ndimage.binary_erosion(s.obj)
        s.img[edge]=hexc(c)
    def save(s,path,scale=4):
        a=np.zeros((H,W,4),np.uint8); a[...,:3]=s.img.astype(np.uint8); a[...,3]=np.where(s.obj,255,0)
        Image.fromarray(a,'RGBA').resize((W*scale,H*scale),Image.NEAREST).save(path)
def ell(cx,cy,rx,ry): return ((xx-cx)/rx)**2+((yy-cy)/ry)**2<=1
def rect(x0,y0,x1,y1): return (xx>=x0)&(xx<x1)&(yy>=y0)&(yy<y1)
def line_px(x0,x1,y): return [(x,y) for x in range(x0,x1+1)]

SK='#e9b48c'; SKD='#c98762'; SKL='#f6d2b0'; SKDD='#a86a4a'


OUT=ROOT+'/assets/'
def save2(c,name):
    a=np.zeros((H,W,4),np.uint8); a[...,:3]=c.img.astype(np.uint8); a[...,3]=np.where(c.obj,255,0)
    Image.fromarray(a,'RGBA').resize((W*2,H*2),Image.NEAREST).save(OUT+f'p_{name}.png')
SKINS={'chiara':('#f1c4a0','#d29a76','#fbdcc0','#b07a58'),'media':(SK,SKD,SKL,SKDD),'scura':('#c98f62','#a26c45','#dcaa80','#83532f')}
def person(name,skin='media',hair='#3d2419',hairl=None,hairstyle='short',cloth='#26365c',clothd=None,clothl=None,glasses=None,beard=None,mustache=None,lips=None,collar=None,extra=None,bald=False,earring=None):
    s,sd,sl,sdd=SKINS[skin]; hl=hairl or hair
    c=Canvas()
    torso=ell(24,58,24,18)&(yy<56)
    c.shaded(torso,cloth,clothd or cloth,clothl or cloth,24,50,22,10)
    if hairstyle in ('long','bob','curly'):
        back=ell(24,22,13.5,13)|(rect(10.5,20,37.5,(36 if hairstyle!='long' else 44))&ell(24,27,13.5,(14 if hairstyle!='long' else 19)))
        if hairstyle=='curly': back=ell(24,21,14.5,13.5)|(rect(9.5,20,38.5,36)&ell(24,26,14.5,14))
        c.shaded(back,hair,'#1c1612' if hair<'#5' else hair,hl,22,18,13,13)
        if hairstyle=='curly':
            cur=back&(((xx.astype(int)*3+yy.astype(int)*2)%5)==0); c.img[cur]=hexc(hl)
    neck=rect(20,32,28,42); c.shaded(neck,sd,sdd,s,24,36,4,5,td=0.25,tl=-0.6)
    c.px([(x,41) for x in range(21,27)],sdd)
    if collar: collar(c)
    for ex in (14,34): c.shaded(ell(ex,24,2,3),s,sd,sl,ex,24,2,3)
    head=ell(24,23,9.8,12)|ell(24,27,9.3,8.5)
    c.shaded(head,s,sd,sl,22,22,10,12)
    c.px([(x,35) for x in range(20,29)],sd)
    if hairstyle=='short':
        h=(ell(24,15,10.8,6.5)&(yy<18.5))|(rect(14,14,16.5,22)&head)|(rect(31.5,14,34,22)&head)
        c.shaded(h,hair,'#1c1612',hl,20,10,11,6)
    elif hairstyle=='buzz':
        h=(ell(24,15.5,10.5,6)&(yy<17.5))
        c.shaded(h,hair,'#1c1612',hl,20,10,11,6); dots=h&(((xx.astype(int)+yy.astype(int))%2)==0); c.img[dots]=c.img[dots]*0.8
    elif hairstyle=='messy':
        h=(ell(24,14,11.5,7)&(yy<18))|(rect(14,14,16.5,23)&head)|(rect(31.5,14,34,23)&head)
        c.shaded(h,hair,'#1c1612',hl,20,10,11,6)
        c.px([(16,8),(19,7),(22,7),(26,7),(29,8),(31,9),(17,8),(28,7)],hair)
    elif hairstyle=='bald':
        h=(rect(13.5,16,17,25)&head)|(rect(31,16,34.5,25)&head)
        c.shaded(h,hair,hair,hl,24,20,10,8)
        c.px([(20,13),(21,13),(22,14)],sl)
    elif hairstyle in ('bob','long','curly'):
        fr=ell(24,13,12,7)&(yy<18)
        jag=(yy>=15.5)&((xx.astype(int)%3)==0)
        c.shaded(fr&~jag,hair,'#1c1612' if hair<'#5' else hair,hl,20,10,12,6)
        side=(rect(13,15,16.5,33)|rect(31.5,15,35,33))&ell(24,24,14,14)
        c.shaded(side,hair,'#1c1612' if hair<'#5' else hair,hl,22,18,13,13)
    elif hairstyle=='perm':
        h=ell(24,15,12.5,8.5)&(yy<20)|(rect(12.5,14,16.5,25)&ell(24,20,13,12))|(rect(31.5,14,35.5,25)&ell(24,20,13,12))
        c.shaded(h,hair,'#8f949b',hl,20,10,11,7)
        cur=h&(((xx.astype(int)*2+yy.astype(int)*3)%4)==0); c.img[cur]=hexc(hl)
    # sopracciglia e occhi
    bc=hair if hairstyle!='bald' else '#5d636b'
    c.px(line_px(17,21,20),bc); c.px(line_px(27,31,20),bc)
    c.px([(18,23),(19,23),(20,23)],'#f4f1ec'); c.px([(19,23),(20,23),(19,24)],'#2a1d1d')
    c.px([(28,23),(29,23),(30,23)],'#f4f1ec'); c.px([(28,23),(29,23),(29,24)],'#2a1d1d')
    c.px([(18,24),(20,24),(30,24),(28,24)],sd)
    if glasses:
        gl=glasses
        c.px(line_px(16,22,22)+line_px(26,32,22)+[(23,23),(24,23),(25,23)],gl)
        c.px([(16,23),(16,24),(22,23),(22,24),(26,23),(26,24),(32,23),(32,24)],gl)
        c.px(line_px(17,21,25)+line_px(27,31,25),gl)
    c.px([(24,25),(24,26),(25,27),(23,28),(25,28)],sd); c.px([(24,28)],sdd)
    c.px([(18,27),(19,27),(29,27),(30,27)],'#e39383' if skin!='scura' else '#b9705a')
    if beard:
        b=head&(yy>27.5)&~(ell(24,31.5,3.5,1.6)); c.shaded(b,beard,beard,beard,24,32,9,6)
        dots=b&(((xx.astype(int)+yy.astype(int))%2)==0); c.img[dots]=c.img[dots]*0.85
    if mustache:
        c.px([(x,29) for x in range(20,29)]+[(x,30) for x in range(19,30)]+[(19,31),(29,31)],mustache)
    if lips: c.px(line_px(22,26,31),lips); c.px(line_px(23,25,32),lips)
    else: c.px([(21,31),(22,32),(23,32),(24,32),(25,32),(26,32),(27,31)] if not mustache else line_px(21,27,32),'#8f3a32')
    if earring: c.px([(14,30),(34,30)],earring)
    if extra: extra(c)
    c.outline(); save2(c,name)

# ---------- manager ----------
def rosa_col(c):
    m=(yy>41)&(np.abs(xx-24)<4)&(yy<56)&ell(24,58,24,18); c.fill(m,'#f4f5f7')
    c.px([(16,46),(17,46),(16,47),(17,47)],'#e0393e')
person('rosa',skin='media',hair='#7a3220',hairl='#a3482c',hairstyle='curly',cloth='#b8323a',clothd='#8a222a',clothl='#d65a60',lips='#a83a3a',earring='#e2b84a',collar=rosa_col)
def toto_x(c):
    c.fill(rect(35,20,39,31),'#16202e'); c.px([(36,22),(37,22)],'#5fb4f0')
def toto_col(c):
    m=(np.abs(xx-24)<(yy-39)*0.6)&ell(24,58,24,18)&(yy<56); c.fill(m,'#cfe3f0')
person('toto',skin='scura',hair='#c9ced4',hairl='#e6e9ec',hairstyle='bald',cloth='#3a6db0',clothd='#264f86',clothl='#5a8bd0',mustache='#3d3a38',extra=toto_x,collar=toto_col)
def chiara_col(c):
    m=(np.abs(xx-24)<(yy-39)*0.5)&ell(24,58,24,18)&(yy<56); c.fill(m,'#f4f5f7')
person('chiara',skin='chiara',hair='#b98a4e',hairl='#d9ad6c',hairstyle='long',cloth='#1f9e8f',clothd='#157366',clothl='#3dd6c4',glasses='#16202e',lips='#c85a62',collar=chiara_col)
def davide_col(c):
    m=ell(24,58,24,18)&(yy<56)&(np.abs(xx-24)<3)&(yy<47); c.fill(m,'#c86a1f')
    c.px([(x,49) for x in range(8,41)],'#e6ecf0')
person('davide',skin='media',hair='#2c2420',hairl='#463830',hairstyle='buzz',cloth='#ff8a2a',clothd='#c86a1f',clothl='#ffb070',beard='#5a4a40',collar=davide_col)
def luca_x(c):
    c.px(line_px(15,33,40)+[(14,38),(14,39),(34,38),(34,39)],'#16202e'); c.fill(rect(12,37,16,42),'#3dd6c4'); c.fill(rect(32,37,36,42),'#3dd6c4')
person('luca',skin='chiara',hair='#4a3426',hairl='#6e4e38',hairstyle='messy',cloth='#2e3440',clothd='#1f242c',clothl='#4a5262',extra=luca_x)
def franca_col(c):
    c.px([(19,41),(20,42),(21,43),(22,43),(23,44),(24,44),(25,44),(26,43),(27,43),(28,42),(29,41)],'#f4f1ec')
    c.px([(17,26),(16,28),(16,30),(17,32)],'#e2b84a')
person('franca',skin='chiara',hair='#b9bec5',hairl='#dfe3e8',hairstyle='perm',cloth='#7a4fa0',clothd='#58377a',clothl='#9b6bc4',glasses='#8a5f36',lips='#b0505a',collar=franca_col)
# ---------- personale generico ----------
def helmet(c):
    hm=ell(24,15,11.5,7.5)&(yy<17); c.shaded(hm,'#ffd23f','#d9a514','#ffe88a',22,10,11,6)
    c.px(line_px(12,36,17),'#d9a514')
def vest(c):
    v=ell(24,58,24,18)&(yy<56)&((xx<19.5)|(xx>28.5)); c.fill(v,'#ff7a3d'); c.px([(x,49) for x in range(6,20)]+[(x,49) for x in range(29,42)],'#e6ecf0')
person('magazziniere',skin='media',hair='#3d2419',hairstyle='short',cloth='#3a4658',clothd='#2a3442',clothl='#4f5d72',extra=lambda c:(helmet(c),vest(c)))
def cap(c):
    cr=ell(24,15,11.5,8)&(yy<16); c.shaded(cr,'#e0393e','#a8262a','#ff8a8d',22,10,11,6)
    br=ell(24,16.3,13.5,2.6)&(yy>=15); c.shaded(br,'#a8262a','#7a1a1e','#e0393e',24,16,13,2)
person('autista',skin='scura',hair='#2c2420',hairstyle='short',cloth='#5fb4f0',clothd='#3a8ccc',clothl='#a9dcff',beard='#2c2420',extra=cap)
def headset(c):
    c.px(line_px(14,34,9)+[(13,10),(35,10),(13,11),(35,11)],'#16202e'); c.fill(rect(11,20,15,28),'#16202e'); c.px([(14,28),(15,29),(16,30),(17,31),(18,31)],'#16202e')
person('impiegata',skin='chiara',hair='#2c2420',hairl='#4a3c34',hairstyle='bob',cloth='#f4f5f7',clothd='#d6dbe2',clothl='#ffffff',lips='#c85a62',extra=headset)
def helmet_w(c):
    hm=ell(24,15,11.5,7.5)&(yy<17); c.shaded(hm,'#f4f5f7','#c3d0dc','#ffffff',22,10,11,6)
    c.px(line_px(12,36,17),'#c3d0dc')
def vest_y(c):
    v=ell(24,58,24,18)&(yy<56)&((xx<19.5)|(xx>28.5)); c.fill(v,'#ffd23f'); c.px([(x,49) for x in range(6,20)]+[(x,49) for x in range(29,42)],'#c3d0dc')
person('carrellista',skin='chiara',hair='#b98a4e',hairstyle='short',cloth='#3a6db0',clothd='#264f86',clothl='#5a8bd0',mustache='#8a5f36',extra=lambda c:(helmet_w(c),vest_y(c)))
def cap_t(c):
    cr=ell(24,15,11.5,8)&(yy<16); c.shaded(cr,'#ff7a3d','#c85a1f','#ffb070',22,10,11,6)
    br=ell(24,16.3,13.5,2.6)&(yy>=15); c.shaded(br,'#c85a1f','#8a3e14','#ff7a3d',24,16,13,2)
person('corriere',skin='media',hair='#4a3426',hairstyle='messy',cloth='#1f9e8f',clothd='#157366',clothl='#3dd6c4',extra=cap_t)
names=['rosa','toto','chiara','davide','luca','franca','magazziniere','autista','impiegata','carrellista','corriere']
bg=Image.new('RGBA',(5*104,3*120),(42,58,80,255))
for i,n in enumerate(names):
    im=Image.open(OUT+f'p_{n}.png'); bg.alpha_composite(im,(4+(i%5)*104,4+(i//5)*118))
bg.save(ROOT+'/tools/out/staff_preview.png')

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
def person(name,skin='media',hair='#3d2419',hairl=None,hairstyle='short',cloth='#26365c',clothd=None,clothl=None,glasses=None,beard=None,mustache=None,lips=None,collar=None,extra=None,bald=False,earring=None,haird='#1c1612'):
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
        c.shaded(h,hair,haird,hl,20,10,11,6)
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


def tie(col):
    def f(c):
        m=(np.abs(xx-24)<(yy-39)*0.55)&ell(24,58,24,18)&(yy<56); c.fill(m,'#f4f5f7')
        t=ell(24,58,24,18)&(yy<56)&(np.abs(xx-24)<=1.2)&(yy>41); c.fill(t,col)
    return f
person('ottavio',skin='chiara',hair='#9aa0a8',hairl='#c9ced4',hairstyle='bald',cloth='#2b3550',clothd='#1b2238',clothl='#44547a',glasses='#16202e',collar=tie('#2e9e48'))
def giulia_col(c):
    c.px([(21,41),(22,42),(23,42),(24,43),(25,42),(26,42),(27,41)],'#e2b84a')
person('giulia',skin='media',hair='#a3482c',hairl='#c86a40',hairstyle='bob',cloth='#e8a317',clothd='#b97f0c',clothl='#ffd36b',lips='#b8323a',earring='#e2b84a',collar=giulia_col)
person('roberto',skin='scura',hair='#c9ced4',hairl='#eef1f4',hairstyle='short',cloth='#4a2f5c',clothd='#33203f',clothl='#6b4a82',collar=tie('#e0393e'))
# ritratti a scelta per il CEO creato dal giocatore (p_cc1 ... p_cc10)
def cc_col(col):
    def f(c): c.px([(21,41),(22,42),(23,42),(24,42),(25,42),(26,42),(27,41)],col)
    return f
person('cc1',skin='media',hair='#2c2420',hairl='#463830',hairstyle='short',cloth='#26365c',clothd='#1b2238',clothl='#3a4f80',collar=tie('#ffd23f'))
person('cc2',skin='chiara',hair='#b98a4e',hairl='#d9ad6c',hairstyle='bob',cloth='#2e9e48',clothd='#1f7a34',clothl='#5cc472',lips='#c85a62',earring='#e2b84a',collar=cc_col('#f4f5f7'))
person('cc3',skin='scura',hair='#2c2420',hairl='#4a3c34',hairstyle='buzz',cloth='#e0393e',clothd='#a8262b',clothl='#ff6a6e',beard='#2c2420')
person('cc4',skin='media',hair='#7a3220',hairl='#a3482c',hairstyle='long',cloth='#4a5f7a',clothd='#33445a',clothl='#6b819e',glasses='#16202e',lips='#a83a3a')
person('cc5',skin='chiara',hair='#9aa0a8',hairl='#c9ced4',hairstyle='short',cloth='#5a3e2b',clothd='#3e2a1c',clothl='#7a5a40',mustache='#9aa0a8',collar=tie('#5fb4f0'))
person('cc6',skin='scura',hair='#1c1612',hairl='#3d2419',hairstyle='curly',cloth='#9b6bff',clothd='#6f43cf',clothl='#c8adff',lips='#8f3a3a',earring='#e2b84a')
person('cc7',skin='chiara',hair='#4a3426',hairl='#6e4e38',hairstyle='messy',cloth='#ff7a3d',clothd='#c8551f',clothl='#ffb07a',glasses='#8a5f36',beard='#4a3426')
person('cc8',skin='media',hair='#b9bec5',hairl='#dfe3e8',hairstyle='perm',cloth='#1f9e8f',clothd='#157366',clothl='#3dd6c4',lips='#b0505a',glasses='#16202e')
person('cc9',skin='media',hair='#5d636b',hairl='#8a9098',hairstyle='bald',cloth='#3a4658',clothd='#2a3442',clothl='#4f5d72',beard='#5d636b',collar=tie('#ff7a3d'))
person('cc10',skin='chiara',hair='#ffd23f',hairl='#fff3c4',hairstyle='long',cloth='#2b3550',clothd='#1b2238',clothl='#44547a',lips='#c85a62',collar=cc_col('#ffd23f'))

# nuova generazione: manager e dirigenti che arrivano sul mercato negli anni, per sostituire chi va in pensione
def polo(col):
    def f(c):
        m=(np.abs(xx-24)<3)&ell(24,58,24,18)&(yy<47)&(yy>40); c.fill(m,col)
    return f
person('giorgio',skin='media',hair='#3d2419',hairl='#5a3a28',hairstyle='short',cloth='#c8551f',clothd='#9a3f15',clothl='#ff8a4a',beard='#3d2419',collar=polo('#9a3f15'))
person('aisha',skin='scura',hair='#1c1612',hairl='#3d2419',hairstyle='curly',cloth='#5fb4f0',clothd='#3a8ccc',clothl='#a9dcff',lips='#8f3a3a',earring='#ffd23f',collar=cc_col('#f4f5f7'))
person('ivan',skin='chiara',hair='#d9ad6c',hairl='#f0d090',hairstyle='buzz',cloth='#26365c',clothd='#1b2238',clothl='#3a4f80',collar=polo('#f4f5f7'))
person('sara',skin='chiara',hair='#2c2420',hairl='#4a3c34',hairstyle='long',cloth='#e0393e',clothd='#a8262b',clothl='#ff6a6e',glasses='#16202e',lips='#b8323a')
person('nicola',skin='media',hair='#5d636b',hairl='#8a9098',hairstyle='messy',cloth='#2e9e48',clothd='#1f7a34',clothl='#5cc472',mustache='#5d636b',glasses='#8a5f36')
person('elena',skin='media',hair='#a3482c',hairl='#c86a40',hairstyle='long',cloth='#4a5f7a',clothd='#33445a',clothl='#6b819e',lips='#c85a62',earring='#e2b84a',collar=cc_col('#ffd23f'))
person('matteo',skin='chiara',hair='#4a3426',hairl='#6e4e38',hairstyle='messy',cloth='#9b6bff',clothd='#6f43cf',clothl='#c8adff',beard='#4a3426',glasses='#16202e')
person('beatrice',skin='chiara',hair='#b9bec5',hairl='#dfe3e8',hairstyle='bob',cloth='#16202e',clothd='#0c131d',clothl='#2f3d52',lips='#b0505a',earring='#c3d0dc',collar=cc_col('#f4f5f7'))
person('paolo',skin='media',hair='#9aa0a8',hairl='#c9ced4',hairstyle='short',cloth='#5a3e2b',clothd='#3e2a1c',clothl='#7a5a40',glasses='#16202e',collar=tie('#9b6bff'))
person('federico',skin='scura',hair='#2c2420',hairl='#463830',hairstyle='short',cloth='#1f9e8f',clothd='#157366',clothl='#3dd6c4',beard='#2c2420',collar=tie('#16202e'))
def tshirt(col):   # maglietta girocollo: bordino scuro attorno al collo
    def f(c):
        m=ell(24,41,6,3.2)&~ell(24,40.5,4.6,2.2)&(yy>40); c.fill(m,col)
    return f
# Andrew Goodheart: biondo, capelli corti, occhiali squadrati dalla montatura spessa
def sq_glasses(c):
    c.px(line_px(16,22,21)+line_px(26,32,21)+[(15,22),(15,23),(15,24),(33,22),(33,23),(33,24)],'#16202e')
person('andrew',skin='chiara',hair='#e8c25a',hairl='#fbe39a',haird='#b08a2e',hairstyle='short',cloth='#2e9e48',clothd='#1f7a34',clothl='#5cc472',glasses='#16202e',collar=tshirt('#1f7a34'),extra=sq_glasses)
# customer service: i responsabili (manager) e l'addetto in sede, con la cuffia del telefono
def headset(c):
    c.px(line_px(14,34,9)+[(13,10),(35,10),(13,11),(35,11)],'#16202e'); c.fill(rect(11,20,15,28),'#16202e'); c.px([(14,28),(15,29),(16,30),(17,31),(18,31)],'#16202e')
person('mirella',skin='chiara',hair='#5a2430',hairl='#8a3a4a',hairstyle='bob',cloth='#e0393e',clothd='#a8262b',clothl='#ff6a6e',lips='#b8323a',earring='#e2b84a',collar=cc_col('#f4f5f7'),extra=headset)
person('gianfranco',skin='media',hair='#9aa0a8',hairl='#c9ced4',hairstyle='short',cloth='#3a6db0',clothd='#264f86',clothl='#5a8bd0',mustache='#9aa0a8',collar=tie('#ffd23f'))
person('kevin',skin='media',hair='#2c2420',hairl='#4a3c34',hairstyle='messy',cloth='#1f9e8f',clothd='#157366',clothl='#3dd6c4',glasses='#16202e',collar=tshirt('#157366'),extra=headset)
person('operatore',skin='scura',hair='#1c1612',hairl='#3d2419',hairstyle='buzz',cloth='#ffd23f',clothd='#d9a514',clothl='#ffe88a',collar=polo('#d9a514'),extra=headset)
# Luca "Non il calciatore" Del Sasso: giovane, ricci folti e scuri, spalle da palestra in maglietta aderente
HEADM=ell(24,23,9.8,12)|ell(24,27,9.3,8.5)
# trama dei ricci: piccoli anelli sfalsati (riflesso in alto a sinistra, ombra in basso a destra)
_X=xx.astype(int); _Y=yy.astype(int); _U=(_X+2*((_Y//3)%2))%4; _V=_Y%3
RL=((_U==0)&(_V==0))|((_U==1)&(_V==0)); RD=((_U==2)&(_V==1))|((_U==1)&(_V==2))
def ricci(col,cold,coll,top=13,ry=8.5):
    def f(c):
        m=(ell(24,top,13.5,ry)&(yy<18.5))|(rect(12.5,13,16,23)&ell(24,20,14,13))|(rect(32,13,35.5,23)&ell(24,20,14,13))
        for cx,cy in [(12,11),(15,7),(19,5),(24,4.5),(29,5),(33,7),(36,11),(11,16),(37,16),(12,21),(36,21)]: m=m|ell(cx,cy+(top-13),2.6,2.6)
        m=m&~(HEADM&(yy>=18))
        c.fill(m,col)
        c.img[m&RL]=hexc(coll); c.img[m&RD]=hexc(cold)
    return f
def muscoli(c):
    s,sd,sl,sdd=SKINS['media']
    c.shaded(rect(18,32,30,41)&~HEADM,s,sd,sl,24,37,6,4,td=0.25,tl=-0.6)
    c.px(line_px(19,29,40),sdd)
    for cx in (9,39): c.shaded(ell(cx,47,7,5.5)&ell(24,58,24,18)&(yy<56),'#26365c','#1b2238','#3a4f80',cx-2,45,7,5)
    c.fill(ell(24,41,6,3.2)&~ell(24,40.5,4.6,2.2)&(yy>40),'#1b2238')
    c.px(line_px(15,22,49)+line_px(26,33,49)+[(14,48),(34,48),(23,50),(25,50),(24,50)],'#1b2238')
def luca_col(c): muscoli(c); ricci('#2c2420','#16120f','#4a3c34')(c)
person('delsasso',skin='media',hair='#2c2420',hairl='#4a3c34',hairstyle='buzz',cloth='#26365c',clothd='#1b2238',clothl='#3a4f80',extra=luca_col)
# Giuseppe "O' Mariuolo" Sorrentino: grigio e stempiato, occhiali stretti, naso importante
def mariuolo(c):
    s,sd,sl,sdd=SKINS['media']
    # mento più lungo: la faccia scende di tre pixel, la bocca resta dov'è
    chin=ell(24,31,8.2,7.2)&(yy>=33)
    c.shaded(chin,s,sd,sl,22,30,9,7); c.px(line_px(20,28,38),sd)
    c.px([(23,35),(24,35),(25,35)],sd)
    # stempiato e brizzolato: capelli corti in cima e ai lati, fronte alta
    top=(ell(24,12.5,9.5,4.2)&(yy<14.5))|(rect(13.5,14,17,25)&HEADM)|(rect(31,14,34.5,25)&HEADM)
    c.shaded(top,'#4a4644','#2c2a28','#6b6f75',22,10,10,5)
    c.img[top&(((_X+_Y)%3)==0)]=hexc('#9aa0a8')
    c.px(line_px(17,21,20)+line_px(27,31,20),'#4a4644')
    c.px(line_px(16,22,22)+line_px(26,32,22)+line_px(16,22,24)+line_px(26,32,24)+[(16,23),(22,23),(26,23),(32,23),(23,22),(24,22),(25,22)],'#16202e')
    c.px([(17,23),(18,23),(21,23),(27,23),(28,23),(31,23)],'#bfe6ff'); c.px([(19,23),(20,23),(29,23),(30,23)],'#2a1d1d')
    c.px([(24,25),(25,25),(24,26),(25,26),(25,27),(26,27),(22,27),(26,28),(22,28),(26,29),(22,29)],sd)
    c.px([(23,27),(24,27),(23,28),(24,28),(25,28)],s); c.px([(23,25),(23,26)],sl)
    c.px([(23,29),(25,29),(26,27),(26,28)],sdd); c.px([(24,29)],sd)
person('sorrentino',skin='media',hair='#4a4644',hairl='#6b6f75',hairstyle='bald',cloth='#2f5f9e',clothd='#1f4377',clothl='#4a7fc0',collar=polo('#1f4377'),extra=mariuolo)
# Greta Brambilla: ricci biondi, occhi grandi e tondi
def occhioni(c):
    for x0 in (17,27):
        c.px([(x0+1,21),(x0+2,21),(x0,22),(x0+1,22),(x0+2,22),(x0+3,22),(x0,23),(x0+1,23),(x0+2,23),(x0+3,23),(x0+1,24),(x0+2,24)],'#f4f1ec')
        c.px([(x0+1,22),(x0+2,23),(x0+1,23)],'#2a1d1d')
        c.px([(x0+1,20),(x0+2,20),(x0,21),(x0+3,21)],'#16202e')
    c.px(line_px(17,21,19)+line_px(27,31,19),'#b08a2e')
def greta_x(c):
    m=c.obj&~HEADM&(yy<38)&~(ell(14,24,2,3)|ell(34,24,2,3))
    m=m|(ell(24,21,18,17)&(yy<40)&~HEADM&~(ell(14,24,2,3)|ell(34,24,2,3)))|(ell(24,12,14,9)&(yy<18))
    for cx,cy in [(10,11),(14,6),(19,3.5),(24,3),(29,3.5),(34,6),(38,11),(7,17),(41,17),(7,24),(41,24),(8,31),(40,31),(10,37),(38,37),(9,34),(39,34),(12,34),(36,34)]: m=m|ell(cx,cy,3.2,3.2)
    m=m&~(rect(17,32,31,56)&~HEADM&(yy>=34))
    m=m|(HEADM&(yy<18))
    c.fill(m,'#e8c25a'); c.img[m&RL]=hexc('#fbe39a'); c.img[m&RD]=hexc('#b08a2e')
    occhioni(c)
person('greta',skin='chiara',hair='#e8c25a',hairl='#fbe39a',hairstyle='curly',cloth='#ff7a3d',clothd='#c8551f',clothl='#ffb07a',lips='#c85a62',earring='#ffd23f',collar=polo('#c8551f'),extra=greta_x)
NEW=['delsasso','sorrentino','greta','giorgio','aisha','ivan','sara','nicola','elena','matteo','beatrice','paolo','federico','andrew','mirella','gianfranco','kevin','operatore']

# posto vacante: sagoma anonima in ombra (p_anonimo), con un punto di domanda sul petto
def anonimo():
    c=Canvas()
    torso=ell(24,58,24,18)&(yy<56); neck=rect(20,32,28,42); head=ell(24,23,9.8,12)|ell(24,27,9.3,8.5)
    c.shaded(torso,'#2f3d52','#1f2a3a','#3d4d66',24,50,22,10)
    c.shaded(neck,'#26334a','#1b2536','#2f3d52',24,36,4,5,td=0.25,tl=-0.6)
    c.shaded(head,'#2f3d52','#1f2a3a','#3d4d66',22,22,10,12)
    q=[(22,44),(23,43),(24,43),(25,43),(26,44),(26,45),(25,46),(24,47),(24,48),(24,50)]
    c.px(q,'#8a96a6')
    c.outline('#0c131d'); save2(c,'anonimo')
anonimo()
bg=Image.new('RGBA',(3*104,120),(42,58,80,255))
for i,n in enumerate(['ottavio','giulia','roberto']):
    im=Image.open(OUT+f'p_{n}.png'); bg.alpha_composite(im,(4+i*104,4))
bg.save(ROOT+'/tools/out/exec_preview.png')
bg=Image.new('RGBA',(10*104,120),(42,58,80,255))
for i in range(10):
    im=Image.open(OUT+f'p_cc{i+1}.png'); bg.alpha_composite(im,(4+i*104,4))
bg.save(ROOT+'/tools/out/cc_preview.png')
bg=Image.new('RGBA',(len(NEW)*104,120),(42,58,80,255))
for i,n in enumerate(NEW):
    im=Image.open(OUT+f'p_{n}.png'); bg.alpha_composite(im,(4+i*104,4))
bg.save(ROOT+'/tools/out/nuovi_preview.png')

# volti generici per i candidati creati dal gioco (p_v0 ... p_v39): 0-19 uomini, 20-39 donne;
# fascia d'età (i%20)//7: 0 giovani, 1 di mezza età, 2 anziani (capelli grigi). Il gioco sceglie il volto adatto (FACES in game.html)
import random as _r
_R=_r.Random(2026)
CLOTH=[('#26365c','#1b2238','#3a4f80'),('#2e9e48','#1f7a34','#5cc472'),('#e0393e','#a8262b','#ff6a6e'),('#4a5f7a','#33445a','#6b819e'),('#5a3e2b','#3e2a1c','#7a5a40'),
       ('#9b6bff','#6f43cf','#c8adff'),('#ff7a3d','#c8551f','#ffb07a'),('#1f9e8f','#157366','#3dd6c4'),('#3a4658','#2a3442','#4f5d72'),('#5fb4f0','#3a8ccc','#a9dcff'),
       ('#e8a317','#b97f0c','#ffd36b'),('#16202e','#0c131d','#2f3d52')]
HAIR_Y=[('#2c2420','#463830'),('#3d2419','#5a3a28'),('#4a3426','#6e4e38'),('#1c1612','#3d2419'),('#b98a4e','#d9ad6c'),('#7a3220','#a3482c'),('#d9ad6c','#f0d090'),('#5a2430','#8a3a4a')]
HAIR_O=[('#9aa0a8','#c9ced4'),('#b9bec5','#dfe3e8'),('#5d636b','#8a9098'),('#c9ced4','#eef1f4')]
NECK=['#ffd23f','#e0393e','#5fb4f0','#16202e','#2e9e48','#9b6bff','#f4f5f7']
VOLTI=[]
for i in range(40):
    f=i>=20; band=(i%20)//7
    skin=_R.choice(['chiara','chiara','media','media','media','scura'])
    hair,hairl=_R.choice(HAIR_O if band==2 or (band==1 and _R.random()<0.3) else HAIR_Y)
    cl,cd,cll=_R.choice(CLOTH)
    kw=dict(skin=skin,hair=hair,hairl=hairl,cloth=cl,clothd=cd,clothl=cll)
    if _R.random()<0.3: kw['glasses']=_R.choice(['#16202e','#16202e','#8a5f36'])
    if f:
        kw['hairstyle']=_R.choice(['perm','bob','perm','curly']) if band==2 else _R.choice(['bob','long','curly','long','bob'])
        kw['lips']=_R.choice(['#b8323a','#c85a62','#a83a3a','#b0505a','#8f3a3a'])
        if _R.random()<0.5: kw['earring']=_R.choice(['#e2b84a','#c3d0dc'])
        kw['collar']=_R.choice([cc_col(_R.choice(NECK)),tshirt(cd),None])
    else:
        kw['hairstyle']=_R.choice(['short','buzz','messy','short']+(['bald','bald'] if band>0 else []))
        r=_R.random()
        if r<0.22: kw['beard']=hair
        elif r<0.36 and band>0: kw['mustache']=hair
        kw['collar']=_R.choice([tie(_R.choice(NECK)),tie(_R.choice(NECK)),polo(cd),tshirt(cd)])
    if kw.get('collar') is None: kw.pop('collar',None)
    person(f'v{i}',**kw); VOLTI.append(f'v{i}')
bg=Image.new('RGBA',(10*104,4*120),(42,58,80,255))
for i,n in enumerate(VOLTI):
    im=Image.open(OUT+f'p_{n}.png'); bg.alpha_composite(im,(4+(i%10)*104,4+(i//10)*120))
bg.save(ROOT+'/tools/out/volti_preview.png')

# leader dei tre sindacati del pacchetto Relazioni industriali (u_cup, u_sam, u_coba): una spilla col colore della sigla
def spilla(col):
    def f(c): c.px([(16,47),(17,47),(16,48),(17,48)],col); c.px([(16,49),(17,49)],'#16202e')
    return f
def _uni(c,col,collar):
    collar(c); spilla(col)(c)
def u_cup(c): _uni(c,'#e0393e',cc_col('#f4f5f7'))
def u_sam(c): _uni(c,'#ff7a3d',polo('#3a2a1c'))
def u_coba(c): _uni(c,'#9b6bff',tshirt('#1b2238'))
person('u_cup',skin='chiara',hair='#b9bec5',hairl='#dfe3e8',hairstyle='bob',cloth='#e0393e',clothd='#a8262b',clothl='#ff6a6e',glasses='#16202e',lips='#a83a3a',earring='#c3d0dc',extra=u_cup)
person('u_sam',skin='media',hair='#2c2420',hairl='#463830',hairstyle='buzz',cloth='#5a3e2b',clothd='#3e2a1c',clothl='#7a5a40',mustache='#2c2420',extra=u_sam)
person('u_coba',skin='scura',hair='#1c1612',hairl='#3d2419',hairstyle='messy',cloth='#26365c',clothd='#1b2238',clothl='#3a4f80',beard='#1c1612',extra=u_coba)

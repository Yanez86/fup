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

# ================= GINO =================
c=Canvas()
torso=ell(24,58,24,18)&(yy<56)
c.shaded(torso,'#b63a3a','#842626','#d45a4f',24,50,23,10)
# flannel checks
chk=torso&(((xx.astype(int)//3)%2==0)^((yy.astype(int)//3)%2==0))
c.img[chk]=c.img[chk]*0.82
# vest
vest=torso&((xx<19.5)|(xx>28.5))
c.shaded(vest,'#f2cf2a','#c9a312','#fbe26a',24,50,23,10)
strip=vest&(yy>=48)&(yy<50)
c.img[strip]=hexc('#e6ecf0'); c.img[strip&(xx>34)]=hexc('#b9c3cb'); 
# neck
neck=rect(19,32,29,41)
c.shaded(neck,SKD,SKDD,SK,24,36,5,5,td=0.2,tl=-0.6)
c.px([(x,40) for x in range(20,28)],SKDD)
# collar
c.px([(18,40),(19,41),(20,42),(21,43),(29,40),(28,41),(27,42),(26,43)],'#842626')
c.px([(19,40),(20,41),(21,42),(28,40),(27,41),(26,42)],'#d45a4f')
# ears
for ex in (13.5,34.5):
    c.shaded(ell(ex,25,2.2,3.2),SK,SKD,SKL,ex,25,2,3)
# head
head=ell(24,23,10.5,12.5)|ell(24,28,10,8)
c.shaded(head,SK,SKD,SKL,22,22,10,12)
# jaw shadow
c.px([(x,36) for x in range(19,30)],SKD)
# sideburns grey
c.fill(rect(13.5,15,16,24)&head|rect(13.5,15,16,22),'#9aa0a8')
c.fill(rect(32,15,34.5,24)&head|rect(32,15,34.5,22),'#9aa0a8')
c.px([(14,22),(15,23),(33,22),(32,23)],'#7d838b')
# cap
crown=ell(24,15,11.5,8)&(yy<16)
c.shaded(crown,'#2b4a86','#1d3260','#4a6db0',22,10,11,6)
panel=ell(24,13,6,5.5)&(yy<16)&(yy>7.5)
c.fill(panel,'#f2f4f6')
c.px([(22,11),(23,11),(24,11),(25,11),(22,12),(23,12),(24,12),(25,12),(26,12),(26,13)],'#ff7a3d')
c.px([(22,13),(25,13)],'#1b1420')
brim=ell(24,16.3,13.5,2.6)&(yy>=15)
c.shaded(brim,'#22396b','#152548','#3a5a96',24,16,13,2)
c.px(line_px(12,36,18),SKDD)  # brim shadow on forehead
c.px([(c_,18) for c_ in (13,14,34,35)],'#7d838b')
# brows
c.px(line_px(16,21,21)+line_px(17,21,20),'#5d636b')
c.px(line_px(27,32,21)+line_px(27,31,20),'#5d636b')
# eyes
c.px([(17,23),(18,23),(19,23),(20,23)],'#f4f1ec'); c.px([(19,23),(20,23),(19,24)],'#2a1d1d')
c.px([(28,23),(29,23),(30,23),(31,23)],'#f4f1ec'); c.px([(28,23),(29,23),(29,24)],'#2a1d1d')
c.px([(17,24),(18,24),(20,24),(30,24),(31,24),(28,24)],SKD)
# crow's feet / bags
c.px([(16,24),(15,23),(16,25),(32,24),(33,23),(32,25)],SKD)
# nose
c.px([(23,24),(23,25),(23,26),(24,27),(25,27),(22,28),(26,28)],SKD)
c.px([(24,25),(24,26)],SKL)
c.px([(23,28),(25,28)],SKDD)
# cheeks
c.px([(18,27),(19,27),(29,27),(30,27)],'#de8f78')
# mustache
must=[(x,29) for x in range(19,30)]+[(x,30) for x in range(18,31)]+[(x,31) for x in range(18,20)]+[(x,31) for x in range(29,31)]+[(18,32),(30,32)]
c.px(must,'#7f858d')
c.px([(x,29) for x in range(20,29,2)],'#a3a9b0')
c.px([(x,30) for x in range(19,30,3)],'#5f656c')
# mouth
c.px(line_px(21,27,32),'#7a3a32'); c.px(line_px(22,26,33),SKD)
# stubble
stub=head&(yy>31)&(yy<37)&(((xx.astype(int)+yy.astype(int))%2)==0)
c.img[stub&~((yy.astype(int)==32)&(xx>20)&(xx<28))]=hexc('#b78d73')
c.outline()
c.save(ROOT+'/assets/ritratto_gino.png')

# ================= VALERIA =================
c=Canvas()
torso=ell(24,58.5,23,18)&(yy<56)
c.shaded(torso,'#26365c','#18233f','#3b5288',24,50,22,10)
shirt=torso&(np.abs(xx-24)<(yy-38)*0.7)
c.fill(shirt,'#f4f5f7'); c.img[shirt&(xx>25)]=hexc('#d6dbe2')
# lapels
lap=torso&(np.abs(np.abs(xx-24)-(yy-38)*0.7)<1.3)&(yy>39)
c.img[lap]=hexc('#4a6296')
# necklace
c.px([(21,41),(22,42),(23,42),(24,43),(25,42),(26,42),(27,41)],'#e2b84a')
# hair back
back=ell(24,22,13.5,13)|(rect(10.5,20,37.5,35)&ell(24,26,13.5,14))
c.shaded(back,'#3d2419','#28160f','#5e3a28',22,18,13,13)
# neck
neck=rect(20,32,28,42)
c.shaded(neck,SKD,SKDD,SK,24,36,4,5,td=0.25,tl=-0.6)
c.px([(x,41) for x in range(21,27)],SKDD)
# head
head=ell(24,23,9.6,12)|ell(24,27,9,8.5)
c.shaded(head,SK,SKD,SKL,22,22,10,12)
c.px([(x,35) for x in range(20,29)],SKD)
# fringe
fr=ell(24,13,12,7)&(yy<19)
jag=(yy>=16)&((xx.astype(int)%3)==0)
c.shaded(fr&~jag,'#3d2419','#28160f','#6a432f',20,10,12,6)
# hair sides over head edges
side=(rect(13,15,16.5,33)|rect(31.5,15,35,33))&back
c.shaded(side,'#3d2419','#28160f','#5e3a28',22,18,13,13)
c.px([(17,17),(18,17),(30,17),(31,17)],'#3d2419')
# shine
c.px([(18,10),(19,10),(20,11),(21,11),(22,11)],'#7d5640')
# brows
c.px(line_px(17,21,20)+[(16,21)],'#3d2419'); c.px(line_px(27,31,20)+[(32,21)],'#3d2419')
# glasses
gl='#1b1420'
for x0 in (16,26):
    c.px(line_px(x0,x0+6,22)+line_px(x0,x0+6,26)+[(x0,23),(x0,24),(x0,25),(x0+6,23),(x0+6,24),(x0+6,25)],gl)
    c.px([(x,y) for x in range(x0+1,x0+6) for y in (23,24,25)],'#e4eef6')
c.px([(23,23),(24,23),(25,23)],gl)
c.px([(15,23),(33,23)],gl)
# eyes inside
c.px([(18,24),(19,24),(20,24)],'#f4f1ec'); c.px([(19,24),(20,24)],'#2a1d1d'); c.px([(18,23),(19,23),(20,23)],'#3d2419')
c.px([(28,24),(29,24),(30,24)],'#f4f1ec'); c.px([(28,24),(29,24)],'#2a1d1d'); c.px([(28,23),(29,23),(30,23)],'#3d2419')
c.px([(21,23)],'#ffffff')
# nose
c.px([(24,26),(24,27),(25,28),(23,29),(25,29)],SKD); c.px([(24,29)],SKDD)
# blush
c.px([(18,28),(19,28),(29,28),(30,28)],'#e39383')
# lips
c.px(line_px(22,26,31),'#b8323a'); c.px(line_px(21,27,32)[1:-1],'#8f2228'); c.px([(23,31)],'#d9575d')
c.px([(21,31),(27,31)],SKD)
# earring
c.px([(14,30),(34,30)],'#e2b84a')
c.outline()
c.save(ROOT+'/assets/ritratto_valeria.png')
# preview side by side on bg
bg=Image.new("RGBA",(420,240),(42,58,80,255))
for i,n in enumerate(('gino','valeria')):
    im=Image.open(f'{ROOT}/assets/ritratto_{n}.png')
    bg.alpha_composite(im,(10+i*210,9))
bg.save(ROOT+'/tools/out/ritratti_preview.png')

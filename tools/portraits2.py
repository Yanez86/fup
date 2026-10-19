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
# ================= EDOARDO =================
c=Canvas()
torso=ell(24,58,24,18)&(yy<56)
c.shaded(torso,'#2b3550','#1b2238','#44547a',24,50,22,10)
shirt=torso&(np.abs(xx-24)<(yy-39)*0.55)
c.fill(shirt,'#f4f5f7'); c.img[shirt&(xx>25)]=hexc('#d6dbe2')
tie=torso&(np.abs(xx-24)<=1.2)&(yy>41)
c.fill(tie,'#c0303a'); c.px([(24,42),(23,41),(24,41),(25,41)],'#8f1f28')
lap=torso&(np.abs(np.abs(xx-24)-(yy-39)*0.55)<1.2)&(yy>40)
c.img[lap]=hexc('#5a6b96')
neck=rect(20,32,28,42); c.shaded(neck,SKD,SKDD,SK,24,36,4,5,td=0.25,tl=-0.6)
c.px([(x,41) for x in range(21,27)],SKDD)
for ex in (14,34):
    c.shaded(ell(ex,24,2,3),SK,SKD,SKL,ex,24,2,3)
head=ell(24,23,9.8,12)|ell(24,27,9.3,8.5)
c.shaded(head,SK,SKD,SKL,22,22,10,12)
c.px([(x,35) for x in range(20,29)],SKD)
hair=(ell(24,15,11,7)&(yy<19))|(ell(16,17,4,5)&(yy<21))|(ell(32,17,4,4.5)&(yy<20))
c.shaded(hair,'#5a3a22','#3d2616','#8a5c36',20,10,11,6)
c.px([(x,10) for x in range(17,27)],'#a8744a'); c.px([(x,11) for x in range(15,19)],'#a8744a')
c.px([(21,12),(21,13),(22,14)],'#3d2616')
c.px(line_px(17,21,20),'#5a3a22'); c.px(line_px(27,31,20),'#5a3a22')
c.px([(18,23),(19,23),(20,23)],'#f4f1ec'); c.px([(19,23),(20,23)],'#2a1d1d')
c.px([(28,23),(29,23),(30,23)],'#f4f1ec'); c.px([(28,23),(29,23)],'#2a1d1d')
c.px([(24,24),(24,25),(24,26),(25,27),(23,28),(25,28)],SKD); c.px([(24,28)],SKDD)
c.px([(21,31),(22,31),(23,31),(24,31),(25,31),(26,30),(27,30)],'#8f3a32'); c.px([(22,32),(23,32),(24,32),(25,32)],SKD)
c.px([(18,27),(30,27)],'#e39383')
c.outline(); c.save(OUT+'ritratto_edoardo.png')

# ================= MARCO =================
c=Canvas()
torso=ell(24,58,24,18)&(yy<56)
c.shaded(torso,'#5b6573','#3d4550','#7d8896',24,50,22,10)
hood=torso&(np.abs(xx-24)<7)&(yy<44)
c.img[hood]=hexc('#4a535f')
c.px([(21,44),(21,45),(21,46),(21,47),(27,44),(27,45),(27,46),(27,47)],'#d6dbe2')
c.px([(x,52) for x in range(13,20)],'#3dd6c4'); c.px([(19,49),(19,50),(19,51),(18,48)],'#3dd6c4')
c.fill(rect(15,49,21,55),'#f4f5f7'); c.px([(16,51),(17,51),(18,51),(19,51),(16,53),(17,53)],'#16202e')
neck=rect(20,32,28,42); c.shaded(neck,SKD,SKDD,SK,24,36,4,5,td=0.25,tl=-0.6)
for ex in (14,34):
    c.shaded(ell(ex,24,2,3),SK,SKD,SKL,ex,24,2,3)
head=ell(24,23,9.8,12)|ell(24,27,9.3,8.5)
c.shaded(head,SK,SKD,SKL,22,22,10,12)
beard=head&(yy>27.5)&~(ell(24,31.5,3.5,1.6))
c.shaded(beard,'#2c2420','#1c1612','#463830',24,32,9,6)
c.px([(x,30) for x in range(20,29)],'#2c2420')
hair=(ell(24,14.5,10.5,6)&(yy<18))|(rect(14,13,17,22)&head)|(rect(31,13,34,22)&head)
c.shaded(hair,'#2c2420','#1c1612','#4a3c34',20,10,11,6)
c.px([(x,12) for x in range(18,24,2)],'#4a3c34')
c.px(line_px(17,21,20),'#2c2420'); c.px(line_px(27,31,20),'#2c2420')
gl='#16202e'
c.px(line_px(16,22,22)+line_px(26,32,22)+[(23,23),(24,23),(25,23)],gl)
c.px([(16,23),(16,24),(22,23),(22,24),(26,23),(26,24),(32,23),(32,24)],gl)
c.px(line_px(17,21,25)+line_px(27,31,25),gl)
c.px([(18,23),(19,23),(20,23),(28,23),(29,23),(30,23)],'#f4f1ec')
c.px([(19,24),(20,24),(28,24),(29,24)],'#2a1d1d'); c.px([(18,24),(21,24),(27,24),(30,24)],'#e4eef6')
c.px([(24,25),(24,26),(25,27),(23,28),(25,28)],SKD); c.px([(24,28)],SKDD)
c.px([(22,31),(23,31),(24,31),(25,31),(26,31)],'#a0524a')
c.outline(); c.save(OUT+'ritratto_marco.png')
bg=Image.new('RGBA',(420,240),(42,58,80,255))
for i,n in enumerate(('edoardo','marco')):
    im=Image.open(OUT+f'ritratto_{n}.png'); bg.alpha_composite(im,(10+i*210,9))
bg.save(ROOT+'/tools/out/ritratti2.png')

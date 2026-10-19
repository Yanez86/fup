"""Test automatico: apre il gioco in Chromium headless, clicca tutti i menu, prova alberi tecnologici e direzione,
poi fa giocare un bot semplice 3 anni con ognuno dei 4 CEO. Fallisce se ci sono errori JavaScript.
Uso: python3 tools/build.py && python3 tests/smoke_test.py   (richiede: pip install playwright && playwright install chromium)"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out'); os.makedirs(OUT, exist_ok=True)
HTML = open(os.path.join(ROOT, 'dist', 'fup.html'), encoding='utf-8').read()
PAGE = os.path.join(OUT, 'test_page.html')
open(PAGE, 'w', encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"></head><body>' + HTML + '</body></html>')

CLEAR = '''()=>{const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}}'''
BOT = '''(ceo)=>{
 const F=window.__FUP; F.newGame(ceo); const S=F.S; const out=[];
 const clr=()=>{const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}};
 for(let d=0; d<365*3 && !S.over; d++){
   S.speed=1; clr();
   S.tenders.filter(t=>!t.done&&!t.bid).forEach(t=>{ const e=F.bidEstimate(t,S.warehouses[0].id,0.95); if(e&&e.fits&&e.sat<0.85) t.bid={wh:S.warehouses[0].id,mult:0.95}; });
   S.warehouses.forEach(w=>{ const k=F.computeWH(w);
     const pal=S.clients.filter(c=>c.wh===w.id&&c.status==='avvio').reduce((a,c)=>a+c.pal,0);
     const pkm=S.clients.filter(c=>c.wh===w.id&&c.status==='avvio').reduce((a,c)=>a+F.clientLog(c,w).km,0), needA=Math.ceil((k.km+pkm)/5200), needM=Math.max(2,Math.ceil((k.mov+2*pal)/900));
     while(w.staff.aut+S.queue.filter(q=>q.wh===w.id&&q.role==='aut').length<needA){ S.queue.push({role:'aut',wh:w.id,days:18}); S.cash-=1800; }
     while(w.staff.mag+S.queue.filter(q=>q.wh===w.id&&q.role==='mag').length<needM){ S.queue.push({role:'mag',wh:w.id,days:9}); S.cash-=1200; }
   });
   F.step();
 }
 return {ceo, day:S.day, over:S.over, cash:Math.round(S.cash), clienti:S.clients.filter(c=>c.status==='attivo').length};}'''

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1440, 'height': 860})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + PAGE)
        await pg.click('[data-act=startgame]'); await pg.click('[data-act=closemodal]')
        for w in ['azienda','magazzini','clienti','gare','report','personale','direzione','espansione','giornale','tecnologia']:
            await pg.click(f'#dock [data-id={w}]')
        for t in ['log','org','mkt']:
            await pg.click(f'#win-tecnologia [data-act=seltree][data-id={t}]')
            await pg.screenshot(path=os.path.join(OUT, f'shot_tree_{t}.png'))
        # ricerca + installazione + direzione
        await pg.click('#win-tecnologia [data-act=seltree][data-id=log]')
        await pg.click('#win-tecnologia [data-act=seltech][data-id=barcode]')
        await pg.click('#win-tecnologia [data-act=research]')
        await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; S.cash+=500000;
          for(let i=0;i<60;i++){ const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();} F.step(); }
          S.researched.gestionale=true; S.researched.direzione=true;}''')
        await pg.evaluate(CLEAR)
        await pg.click('#win-tecnologia [data-act=seltech][data-id=barcode]')
        await pg.click('#win-tecnologia [data-act=install]')
        await pg.click('#dock [data-id=direzione]')  # chiude la finestra aperta prima...
        if not await pg.query_selector('#win-direzione'): await pg.click('#dock [data-id=direzione]')  # ...e la riapre in primo piano
        await pg.click('#win-direzione [data-act=hireexec][data-id=ottavio]')
        await pg.select_option('#win-direzione select[data-role=fin]', 'ottavio')
        await pg.screenshot(path=os.path.join(OUT, 'shot_direzione.png'))
        st = await pg.evaluate('()=>({barcode:!!window.__FUP.S.warehouses[0].tech.barcode, fin:window.__FUP.S.dirs.fin})')
        assert st['barcode'] and st['fin'] == 'ottavio', st
        # enciclopedia: tutti i collegamenti [[id]] puntano a voci esistenti; parole chiave, ricerca e navigazione
        bad = await pg.evaluate('''()=>{const W=window.__FUP.WIKI,out=[];Object.values(W).forEach(w=>(w.t||'').replace(/\\[\\[([^|\\]]+)/g,(m,id)=>{if(!W[id])out.push(w.id+' -> '+id);}));return out;}''')
        assert not bad, bad
        await pg.evaluate(CLEAR)
        await pg.click('#dock [data-id=magazzini]')
        if not await pg.query_selector('#win-magazzini'): await pg.click('#dock [data-id=magazzini]')
        await pg.hover('#win-magazzini .kw[data-id=saturazione]')
        assert await pg.is_visible('#tip'), 'tooltip parola chiave non visibile'
        await pg.click('#win-magazzini .kw[data-id=saturazione]')
        assert await pg.query_selector('#win-enciclopedia .wk-it[aria-current=true][data-id=saturazione]')
        await pg.click('#win-enciclopedia .wk-txt .kw[data-id=accuratezza]')
        await pg.click('#win-enciclopedia [data-act=wikiback]')
        assert await pg.query_selector('#win-enciclopedia .wk-it[aria-current=true][data-id=saturazione]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_enciclopedia.png'))
        await pg.fill('#wiki-q', 'muletti'); n = await pg.eval_on_selector_all('#wiki-list .wk-it', 'e=>e.length')
        assert n >= 1, 'ricerca vuota'
        await pg.click('#wiki-list .wk-it'); await pg.click('#win-enciclopedia [data-act=wikihome]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_enciclopedia_indice.png'))
        await pg.click('#win-enciclopedia [data-act=close]')
        for ceo in ['gino','edoardo','valeria','marco']:
            print(await pg.evaluate(BOT, ceo))
        await b.close()
    if errs:
        print('ERRORI JS:', *errs, sep='\n  '); sys.exit(1)
    print('OK: nessun errore JavaScript. Screenshot in tools/out/')
asyncio.run(main())

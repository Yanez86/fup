"""Test automatico: apre il gioco in Chromium headless, clicca tutti i menu, prova alberi tecnologici e direzione,
crea un CEO personalizzato, prova il gioco su un telefono (verticale e orizzontale: finestre, tocchi, zoom con due dita),
poi fa giocare un bot semplice 3 anni con ognuno dei 4 CEO e con uno creato. Fallisce se ci sono errori JavaScript.
Uso: python3 tools/build.py && python3 tests/smoke_test.py   (richiede: pip install playwright && playwright install chromium)"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out'); os.makedirs(OUT, exist_ok=True)
PAGE = os.path.join(ROOT, 'dist', 'fup.html')

CLEAR = '''()=>{const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}}'''
BOT = '''(ceo)=>{
 const F=window.__FUP; const out=[];
 if(ceo==='custom') F.newGame(null,F.ccCeo(Object.assign(F.ccNew(),{nome:'Ornella',cognome:'Bancalini',base:'valeria',edu:'Ingegnere dei trasporti',tal:['Calma olimpica','Parla con i robot']})));
 else F.newGame(ceo);
 const S=F.S;
 const clr=()=>{const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}};
 for(let d=0; d<365*3 && !S.over; d++){
   S.speed=1; clr();
   S.tenders.filter(t=>!t.done&&!t.bid).forEach(t=>{ const e=F.bidEstimate(t,S.warehouses[0].id,0.95); if(e&&e.fits&&e.sat<0.85) t.bid={wh:S.warehouses[0].id,mult:0.95}; });
   S.warehouses.forEach(w=>{ const pend=S.clients.filter(c=>c.wh===w.id&&c.status==='avvio'); pend.forEach(c=>c.status='attivo');
     const k=F.computeWH(w); pend.forEach(c=>c.status='avvio');
     const days={pick:9,car:9,capo:12,imp:9,autB:9,autCE:18};
     Object.keys(days).forEach(r=>{ while(w.staff[r]+S.queue.filter(q=>q.wh===w.id&&q.role===r).length<k.need[r]){ S.queue.push({role:r,wh:w.id,days:days[r]}); S.cash-=1500; } });
   });
   while(S.office.plan+S.queue.filter(q=>q.role==='plan').length<F.planNeed()){ S.queue.push({role:'plan',wh:null,days:12}); S.cash-=1500; }
   if(ceo==='valeria'&&d===200) S.warehouses[0].coop=true;
   F.step();
 }
 return {ceo, day:S.day, over:S.over, cash:Math.round(S.cash), clienti:S.clients.filter(c=>c.status==='attivo').length};}'''

# telefono: ogni finestra resta dentro lo schermo, la pagina non scorre di lato, tooltip al tocco, pinch sulla mappa
PINCH = r'''()=>{const mw=document.querySelector('#mapwrap'), m=document.querySelector('#map'), s0=m.style.transform;
  const ev=(t,id,x,y)=>mw.dispatchEvent(new PointerEvent(t,{pointerId:id,clientX:x,clientY:y,pointerType:'touch',bubbles:true,isPrimary:id===1}));
  ev('pointerdown',1,150,400); ev('pointerdown',2,250,400);
  for(let i=1;i<=5;i++){ev('pointermove',1,150-i*15,400);ev('pointermove',2,250+i*15,400);}
  ev('pointerup',1,75,400); ev('pointerup',2,325,400);
  const sc=t=>+((t.match(/scale\(([\d.]+)\)/)||[])[1]||0); return [sc(s0),sc(m.style.transform)];}'''
FITS = '''(sel)=>{const r=document.querySelector(sel).getBoundingClientRect();
  return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth;}'''

async def phone(b, w, h, name, errs):
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{name}: {e}'))
    await pg.goto('file://' + PAGE)
    assert await pg.evaluate("document.documentElement.classList.contains('mob')"), 'layout telefono non attivo'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_avvio.png'))
    await pg.tap('[data-act=startgame]'); await pg.tap('[data-act=closemodal]')
    await pg.wait_for_timeout(100)
    for d in await pg.eval_on_selector_all('#dock button', 'e=>e.map(b=>b.dataset.id)'):
        assert await pg.evaluate(FITS, f'#dock [data-id={d}]'), f'{name}: pulsante {d} fuori schermo'
    zoom = await pg.evaluate(PINCH)
    assert zoom[1] > zoom[0] * 1.5, f'{name}: pinch non ha zoomato {zoom}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_mappa.png'))
    for wn in ['azienda','riepilogo','magazzini','clienti','gare','report','personale','direzione','espansione','giornale','tecnologia','enciclopedia']:
        await pg.tap(f'#dock [data-id={wn}]')
        assert await pg.evaluate(FITS, f'#win-{wn}'), f'{name}: finestra {wn} esce dallo schermo'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_{wn}.png'))
        await pg.tap(f'#win-{wn} [data-act=close]')
    # parola chiave: primo tocco = tooltip, secondo tocco = enciclopedia
    await pg.tap('#dock [data-id=magazzini]')
    await pg.tap('#win-magazzini .kw[data-id=saturazione]')
    assert await pg.is_visible('#tip') and not await pg.query_selector('#win-enciclopedia'), f'{name}: il primo tocco deve mostrare il tooltip'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_tooltip.png'))
    await pg.tap('#win-magazzini .kw[data-id=saturazione]')
    assert await pg.query_selector('#win-enciclopedia .wk-it[aria-current=true][data-id=saturazione]'), f'{name}: il secondo tocco deve aprire la voce'
    # il menu riporta davanti una finestra coperta invece di chiuderla
    await pg.tap('#dock [data-id=magazzini]')
    assert await pg.query_selector('#win-magazzini'), f'{name}: la finestra coperta è stata chiusa'
    # riepilogo dopo tre anni di gioco: ogni scheda resta dentro lo schermo
    await pg.evaluate(BOT, 'gino')
    for _ in range(5): await pg.evaluate(CLEAR)
    await pg.evaluate("()=>{window.__FUP.S.speed=0;document.querySelector('#modal').innerHTML='';document.querySelector('#toasts').innerHTML='';}")
    if await pg.query_selector('#win-magazzini'): await pg.tap('#win-magazzini [data-act=close]')
    await pg.tap('#dock [data-id=riepilogo]')
    for t in ['gen','soldi','op','cli','pers']:
        await pg.tap(f'#win-riepilogo [data-act=rptab][data-id={t}]')
        assert await pg.evaluate(FITS, '#win-riepilogo'), f'{name}: riepilogo {t} esce dallo schermo'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_riepilogo_{t}.png'))
    await ctx.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        await phone(b, 390, 844, 'verticale', errs)
        await phone(b, 844, 390, 'orizzontale', errs)
        pg = await b.new_page(viewport={'width': 1440, 'height': 860})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://' + PAGE)
        # i tooltip devono stare sopra a tutto: schermata iniziale (talenti dei CEO) e finestre aperte
        TIP_ON_TOP = '''(()=>{const t=document.querySelector('#tip'),r=t.getBoundingClientRect();t.style.pointerEvents='auto';const e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);t.style.pointerEvents='';return !t.hidden&&!!e&&!!e.closest('#tip');})()'''
        await pg.hover('#start .ceo[data-id=edoardo] .tal')
        assert await pg.evaluate(TIP_ON_TOP), 'tooltip del talento coperto nella schermata iniziale'
        # creazione del CEO: senza nome e titolo non si parte
        await pg.click('[data-act=pickceo][data-id=custom]')
        await pg.click('[data-act=startgame]')
        assert 'nome e cognome' in await pg.inner_text('#start [role=alert]')
        await pg.fill('#cc-nome', 'Ornella'); await pg.fill('#cc-cognome', 'Bancalini')
        await pg.click('[data-act=ccedu][data-n="Laureato in scienze umanistiche"]')
        await pg.click('[data-act=ccedu][data-n="Ingegnere informatico"]')   # cambia titolo
        for n in ['Calma olimpica', 'Insonne', 'Cena col buyer', 'Stacanovista']:  # il quarto non entra
            await pg.click(f'[data-act=cctal][data-n="{n}"]', force=True)
        for _ in range(3): await pg.click('[data-act=ccst][data-k=op][data-d="1"]')
        await pg.click('[data-act=ccimg][data-d="1"]'); await pg.click('[data-act=ccbase][data-id=marco]')
        assert await pg.input_value('#cc-nome') == 'Ornella' and await pg.input_value('#coname-in') == 'Trasporti Bancalini'
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_ceo.png'), full_page=True)
        await pg.click('[data-act=startgame]'); await pg.click('[data-act=closemodal]')
        c = await pg.evaluate('()=>{const S=window.__FUP.S;return {id:S.ceoId,n:S.custom.name,tal:S.custom.tal,st:S.custom.st,co:S.company.name,wh:S.warehouses[0].site,cl:S.clients[0].name}}')
        assert c['id'] == 'custom' and c['n'] == 'Ornella Bancalini' and c['co'] == 'Trasporti Bancalini', c
        assert c['tal'] == ['Ingegnere informatico', 'Calma olimpica', 'Insonne', 'Cena col buyer'], c['tal']
        # 8 di base, +3 in Operazioni; Ingegnere informatico Inn +4 Lead −2; Calma +1 Lead; Insonne Op −2 Prec −2; Cena Neg +4
        assert c['st'] == {'op': 9, 'prec': 6, 'neg': 12, 'lead': 7, 'amm': 8, 'inn': 12}, c['st']
        assert c['wh'] == 'voltri' and c['cl'] == 'Caffè Portuale', c
        await pg.click('#dock [data-id=azienda]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_azienda_ceo_creato.png'))
        await pg.click('#dock [data-id=azienda]')
        # lente delle province
        await pg.click('#lenses [data-act=lens][data-id=prov]')
        n = await pg.evaluate("document.querySelectorAll('#ov path.prov').length")
        assert n == 25, f'province disegnate: {n}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_lente_province.png'))
        await pg.keyboard.press('KeyL')  # torna alla mappa normale
        assert await pg.evaluate("document.querySelectorAll('#ov path.prov').length") == 0
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
        assert await pg.evaluate(TIP_ON_TOP), 'tooltip coperto da una finestra'
        await pg.hover('#top .chip[data-id=cassa]')
        assert await pg.evaluate(TIP_ON_TOP), 'tooltip della barra in alto coperto dalle finestre'
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
        # finestre del personale con i cinque mestieri
        await pg.evaluate(CLEAR)
        await pg.click('#dock [data-id=personale]')
        if not await pg.query_selector('#win-personale'): await pg.click('#dock [data-id=personale]')
        assert await pg.eval_on_selector_all('#win-personale table.t tr', 'e=>e.length') == 7
        await pg.screenshot(path=os.path.join(OUT, 'shot_personale.png'))
        await pg.click('#win-personale [data-act=openwh]')
        assert await pg.eval_on_selector_all('#win-magazzini [data-act=hire]', 'e=>e.length') == 6
        await pg.click('#win-magazzini [data-act=coop]')
        assert await pg.evaluate('()=>window.__FUP.S.warehouses[0].coop')
        await pg.click('#win-magazzini [data-act=hire][data-role=pick]')
        assert 'Cooperativa' in await pg.inner_text('#modal'), 'canale cooperativa mancante'
        await pg.screenshot(path=os.path.join(OUT, 'shot_cooperativa.png'))
        await pg.evaluate(CLEAR)
        await pg.screenshot(path=os.path.join(OUT, 'shot_magazzino_personale.png'))
        # un salvataggio con i vecchi ruoli viene convertito
        mig = await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('marco'); const S=F.S;
          const w=S.warehouses[0]; w.staff={mag:5,aut:3}; S.imp=3; S.queue=[{role:'imp',wh:null,days:5},{role:'aut',wh:w.id,days:9}];
          S.clients.push({...S.clients[0],id:'cx',name:'Tuttosubito Italia',zone:'nordovest',pal:400});
          F.save(); return true;}''')
        await pg.evaluate('()=>location.reload()'); await pg.wait_for_selector('[data-act=continue]')
        await pg.click('[data-act=continue]'); await pg.evaluate(CLEAR)
        st = await pg.evaluate('''()=>{const S=window.__FUP.S;return {st:S.warehouses[0].staff,imp:S.imp,q:S.queue.map(q=>q.role+String.fromCharCode(58)+!!q.wh)}}''')
        assert st['imp'] is None and sum(st['st'].values()) == 8+3 and st['st']['autB'] > 0, st
        assert st['q'] == ['imp:true', 'autCE:true'], st
        assert await pg.evaluate('()=>window.__FUP.S.office.plan===0 && window.__FUP.S.warehouses[0].coop===false')
        # eventi dei talenti: ognuno compare con il suo talento e tutte le scelte funzionano
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame(null,F.ccCeo(Object.assign(F.ccNew(),{nome:'Prova',cognome:'Eventi',edu:'Autodidatta'})));
          const S=F.S,evs=F.EVENTS.filter(e=>e.id.startsWith('t_')),bad=[];S.custom.tal=[];
          evs.forEach(e=>{const nm=(e.cond.toString().match(/hasTal[(]'(.+?)'[)]/)||[])[1];if(!nm||!F.TALENTS[nm.replace(/\\\\/g,'')])bad.push(e.id+': talento?');});
          if(evs.some(e=>{try{return e.cond();}catch(x){return true;}}))bad.push('evento senza talento');
          S.custom.tal=Object.keys(F.TALENTS);
          evs.forEach(e=>e.opts.forEach((o,i)=>{const ev={...e};try{if(ev.setup)ev.setup(ev);if(!ev.text)bad.push(e.id+': testo');o.f.call(ev);}catch(x){bad.push(e.id+'/'+i+': '+x);}}));
          return {n:evs.length,bad};}''')
        assert r['n'] >= 30 and not r['bad'], r
        for ceo in ['gino','edoardo','valeria','marco','custom']:
            print(await pg.evaluate(BOT, ceo))
        # riepilogo dell'azienda dopo tre anni: storico mensile e tutte le schede
        for _ in range(5): await pg.evaluate(CLEAR)
        await pg.evaluate("()=>{window.__FUP.S.speed=0;document.querySelector('#modal').innerHTML='';document.querySelector('#toasts').innerHTML='';}")
        h = await pg.evaluate('()=>{const S=window.__FUP.S;return {n:S.hist.length,g:S.tw.win+S.tw.lose+S.tw.skip}}')
        assert h['n'] >= 6 and h['g'] > 0, h
        await pg.click('#dock [data-id=riepilogo]')
        if not await pg.query_selector('#win-riepilogo'): await pg.click('#dock [data-id=riepilogo]')
        for t in ['gen','soldi','op','cli','pers']:
            await pg.click(f'#win-riepilogo [data-act=rptab][data-id={t}]')
            assert await pg.eval_on_selector_all('#win-riepilogo .rp-t', 'e=>e.length') >= 6, t
            await pg.screenshot(path=os.path.join(OUT, f'shot_riepilogo_{t}.png'))
        await pg.click('#win-riepilogo [data-act=rptab][data-id=gen]')
        await pg.hover('#win-riepilogo svg[data-chart=rp_cash]')
        assert 'Cassa' in await pg.inner_text('#tip'), 'tooltip del grafico della cassa'
        await b.close()
    if errs:
        print('ERRORI JS:', *errs, sep='\n  '); sys.exit(1)
    print('OK: nessun errore JavaScript. Screenshot in tools/out/')
asyncio.run(main())

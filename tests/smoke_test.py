"""Test automatico: apre il gioco in Chromium headless, clicca tutti i menu, prova alberi tecnologici e direzione,
crea un CEO personalizzato, prova il gioco su un telefono (verticale e orizzontale: finestre, tocchi, zoom con due dita),
poi fa giocare un bot semplice 3 anni con ognuno dei 4 CEO e con uno creato. Fallisce se ci sono errori JavaScript.
Uso: python3 tools/build.py && python3 tests/smoke_test.py   (richiede: pip install playwright && playwright install chromium)"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out'); os.makedirs(OUT, exist_ok=True)
PAGE = os.path.join(ROOT, 'dist', 'fup.html')

CLEAR = '''()=>{const F=window.__FUP,n=(F.S.notes||[]).find(x=>x.k==='ev');F.cardsOff();if(n&&!document.querySelector('#modal').innerHTML)F.ACT.note({id:n.id});const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}}'''
BOT = '''(ceo)=>{
 const F=window.__FUP; const out=[];
 if(ceo==='custom') F.newGame(null,F.ccCeo(Object.assign(F.ccNew(),{nome:'Ornella',cognome:'Bancalini',base:'valeria',edu:'Ingegnere dei trasporti',tal:['Calma olimpica','Parla con i robot']})));
 else F.newGame(ceo);
 const S=F.S;
 // risponde subito agli eventi (aprendo la tessera) e chiude le finestre, come un giocatore sbrigativo
 const clr=()=>{const n=(S.notes||[]).find(x=>x.k==='ev'); if(n&&!document.querySelector('#modal').innerHTML) F.ACT.note({id:n.id}); const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}};
 for(let d=0; d<365*3 && !S.over; d++){
   S.speed=1; clr();
   S.tenders.filter(t=>!t.done&&!t.bid).forEach(t=>{ const e=F.bidEstimate(t,S.warehouses[0].id,0.95); if(e&&e.fits&&e.sat<0.85) t.bid={wh:S.warehouses[0].id,mult:0.95}; });
   S.warehouses.forEach(w=>{ const pend=S.clients.filter(c=>c.wh===w.id&&c.status==='avvio'); pend.forEach(c=>c.status='attivo');
     // il bot assume guardando il carico di lavoro dei reparti, come il giocatore
     const days={pick:9,car:9,capo:12,imp:9,autB:9,autCE:18,fm:15}, real=w.staff, tmp={...real};
     Object.keys(days).forEach(r=>tmp[r]+=S.queue.filter(q=>q.wh===w.id&&q.role===r).length);
     w.staff=tmp;
     for(let i=0;i<60;i++){ const l=F.staffLoad(w,F.computeWH(w)); const r=Object.keys(days).find(r=>l[r]>1);
       if(!r) break; tmp[r]++; S.queue.push({role:r,wh:w.id,days:days[r]}); S.cash-=1500; }
     w.staff=real; pend.forEach(c=>c.status='avvio');
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
# fa arrivare subito un evento preciso (come notifica nella colonna a destra)
FIRE = '''(id)=>{const F=window.__FUP,S=F.S;document.querySelector('#modal').innerHTML='';S.nextEvent=1e9;S.seen={};const e=F.EVENTS.find(x=>x.id===id);
  const old=e.cond;e.cond=()=>true;F.EVENTS.forEach(x=>{if(x!==e)S.seen[x.id]=S.day;});F.fireEvent();e.cond=old;}'''
FITS = '''(sel)=>{const r=document.querySelector(sel).getBoundingClientRect();
  return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&document.documentElement.scrollWidth<=innerWidth;}'''

# telefono: dentro una finestra niente scorre di lato e nessun pulsante ha il testo più largo di lui
NOSIDE = '''(sel)=>{const el=document.querySelector(sel), out=[];
  [el.querySelector('.win-b'),...el.querySelectorAll('.win-b *')].forEach(e=>{const o=getComputedStyle(e).overflowX;
    if((o==='auto'||o==='scroll'||e.classList.contains('win-b'))&&e.scrollWidth>e.clientWidth+1) out.push('scorre di lato: '+(e.className||e.tagName));});
  el.querySelectorAll('button').forEach(b=>{if(b.offsetParent&&b.scrollWidth>b.clientWidth+1) out.push('testo fuori dal pulsante: '+b.innerText.slice(0,30));});
  return out;}'''

SEED = '''()=>{const F=window.__FUP; [['gino',1],['marco',2],['valeria',3]].forEach(([c,n])=>{F.slot=n; F.newGame(c); F.S.company.name='Prova '+n;
  for(let d=0;d<35;d++){document.querySelector('#modal').innerHTML=''; F.step();} document.querySelector('#modal').innerHTML=''; if(n===3) F.S.cash=-12000; F.save();
  const k=F.slotKey(n), v=JSON.parse(localStorage.getItem(k)); v.at=Date.now()-(n===2?0:86400000*n); localStorage.setItem(k,JSON.stringify(v));}); F.slot=1;}'''

# barra in alto: in pausa tutti i riquadri hanno la stessa altezza e «In pausa» sta in fondo a destra
BAR = '''()=>{window.__FUP.ACT.speed({v:'0'}); const hs=[...document.querySelectorAll('#top .wkn,#top .date,#top .optb,#top .paused,#top .chip')].filter(e=>e.offsetParent).map(e=>Math.round(e.getBoundingClientRect().height));
  const p=document.querySelector('#paused').getBoundingClientRect(), t=document.querySelector('#top').getBoundingClientRect();
  return {hs:[...new Set(hs)], eq:new Set(hs).size===1, right:!document.querySelector('#paused').hidden&&p.width>0&&t.right-p.right<30&&p.top<t.top+60};}'''

async def intro(pg, shot):
    # schermata introduttiva: il camioncino arriva, poi un tocco la chiude e resta la schermata iniziale
    await pg.wait_for_timeout(2900)
    await pg.screenshot(path=os.path.join(OUT, shot))
    assert await pg.evaluate(FITS, '#intro [data-act=introgo]'), f'{shot}: pulsante della schermata introduttiva fuori schermo'
    await pg.tap('#intro') if await pg.evaluate("navigator.maxTouchPoints>0") else await pg.click('#intro')
    await pg.wait_for_selector('#intro:empty', state='attached')

async def menu(pg, wid):
    # telefono: le finestre si aprono dal menu che entra da sinistra
    await pg.tap('#burger'); await pg.wait_for_timeout(220)
    await pg.tap(f'#dock [data-id={wid}]'); await pg.wait_for_timeout(220)

async def phone(b, w, h, name, errs):
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{name}: {e}'))
    await pg.goto('file://' + PAGE)
    assert await pg.evaluate("document.documentElement.classList.contains('mob')"), 'layout telefono non attivo'
    # schermata principale con due partite salvate (il terzo posto resta per la partita del test)
    await pg.evaluate(SEED); await pg.evaluate(f"localStorage.removeItem(window.__FUP.slotKey(3))"); await pg.reload()
    await intro(pg, f'shot_tel_{name}_intro.png')
    assert await pg.evaluate("document.querySelectorAll('#start .sv').length") == 2, f'{name}: partite salvate mancanti'
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: la schermata principale scorre di lato'
    assert await pg.evaluate("[...document.querySelectorAll('#start button')].filter(b=>b.offsetParent&&b.scrollWidth>b.clientWidth+1).map(b=>b.innerText.slice(0,30))") == [], f'{name}: testo fuori dai pulsanti della schermata principale'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_avvio.png'), full_page=True)
    await pg.tap('#start .news summary'); await pg.wait_for_timeout(100)
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_novita.png'), full_page=True)
    await pg.tap('#start .news summary')
    # creazione del CEO e dell'azienda a passaggi: ogni schermata deve stare nella larghezza del telefono
    await pg.tap('[data-act=newgame]')
    await pg.tap('[data-act=pickceo][data-id=custom]')
    await pg.fill('#cc-nome', 'Ornella'); await pg.fill('#cc-cognome', 'Bancalini'); await pg.tap('[data-act=sugg][data-f=nick]')
    for st in ['identita', 'abilita', 'studi', 'cv', 'azienda']:
        if st == 'studi': await pg.tap('[data-act=ccedu][data-n="Diplomato geometra"]')
        assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: {st} scorre di lato'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_{st}.png'), full_page=True)
        await pg.tap('[data-act=stnext]')
    await pg.tap('[data-act=stamp]'); await pg.wait_for_timeout(700)
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: la visura scorre di lato'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_visura.png'), full_page=True)
    # lobby: le quattro aziende, il ritmo del tempo e le condizioni di vittoria
    await pg.tap('[data-act=stnext]'); await pg.wait_for_timeout(200)
    assert await pg.evaluate("document.querySelectorAll('#start .lb-slot').length") == 4, f'{name}: lobby senza i 4 posti'
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: la lobby scorre di lato'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_lobby.png'), full_page=True)
    await pg.tap('[data-act=startgame]'); await pg.tap('[data-act=closemodal]')
    await pg.wait_for_timeout(100)
    # menu: un solo pulsante sulla mappa; aperto, l'elenco sta nello schermo e ha tutte le voci
    assert await pg.evaluate(FITS, '#burger'), f'{name}: pulsante Menu fuori schermo'
    # pulsante della velocità accanto al Menu: pausa <-> tempo che scorre (niente x2)
    assert await pg.evaluate(FITS, '#ppb'), f'{name}: pulsante pausa fuori schermo'
    pr = await pg.evaluate("[document.querySelector('#ppb').getBoundingClientRect(),document.querySelector('#burger').getBoundingClientRect()].map(r=>[r.left,r.right,r.height])")
    assert pr[0][1] <= pr[1][0] and pr[0][2] == pr[1][2], f'{name}: pulsante pausa sovrapposto o di altezza diversa {pr}'
    v0 = await pg.evaluate('window.__FUP.S.speed'); seen = []
    for i in range(2):
        await pg.tap('#ppb'); seen.append(await pg.evaluate('window.__FUP.S.speed'))
    assert sorted(seen) == [0, 1] and seen[1] == v0, f'{name}: il pulsante pausa non alterna {v0} {seen}'
    await pg.tap('#lenses [data-act=lensmenu]'); await pg.wait_for_timeout(100)
    assert await pg.evaluate(FITS, '#lenses'), f'{name}: lenti aperte fuori schermo'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_lenti.png'))
    await pg.tap('#lenses [data-act=lensmenu]')
    assert not await pg.is_visible('#dock [data-id=azienda]'), f'{name}: il menu deve partire chiuso'
    await pg.tap('#burger'); await pg.wait_for_timeout(250)
    assert await pg.evaluate(FITS, '#dock'), f'{name}: menu aperto fuori schermo'
    assert len(await pg.query_selector_all('#dock button[data-act=toggle]')) == 15, f'{name}: mancano voci nel menu'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_menu.png'))
    await pg.tap('#dock .dh [data-act=menu]'); await pg.wait_for_timeout(250)
    assert not await pg.is_visible('#dock [data-id=azienda]'), f'{name}: il menu non si chiude'
    zoom = await pg.evaluate(PINCH)
    assert zoom[1] > zoom[0] * 1.5, f'{name}: pinch non ha zoomato {zoom}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_mappa.png'))
    # barra in alto: tutto su una riga sopra i numeri, riquadri di settimana e mese sempre larghi uguali
    top = await pg.evaluate('''()=>{const y=s=>Math.round(document.querySelector(s).getBoundingClientRect().top), w=document.querySelector('#wkn'), d=document.querySelector('#date');
      const ws=['S1','S52'].map(t=>{w.textContent=t;return w.offsetWidth;}), ds=['gen 02','set 08'].map(t=>{d.textContent=t;return d.offsetWidth;});
      return {row:Math.abs(y('#wkn')-y('#top .optb'))<12, ws, ds, txt:(window.__FUP.ACT.speed({v:'0'}),document.querySelector('#date').textContent)};}''')
    bar = await pg.evaluate(BAR)
    assert bar['eq'] and bar['right'], f'{name}: barra in alto {bar}'
    assert top['row'] and top['ws'][0] == top['ws'][1] and top['ds'][0] == top['ds'][1] and top['txt'] == 'gen 02', f'{name}: barra in alto {top}'
    # notifiche: l'evento arriva come tessera, con il cartellino accanto; la tessera apre la finestra, «Decidi più tardi» la lascia lì
    await pg.evaluate(FIRE, 'cesto'); await pg.wait_for_timeout(100)
    for sel in ['#notes', '#notecard']:
        assert await pg.evaluate(FITS, sel), f'{name}: {sel} fuori dallo schermo'
    assert await pg.evaluate("()=>document.querySelector('#notes').getBoundingClientRect().bottom<=document.querySelector('#burger').getBoundingClientRect().top"), f'{name}: notifiche sotto il pulsante Menu'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_notifiche.png'))
    await pg.tap('#notes [data-act=note]')
    assert await pg.query_selector('#modal [data-act=evopt]'), f'{name}: la tessera non apre l\'evento'
    await pg.tap('#modal [data-act=closemodal]')
    assert await pg.evaluate("()=>window.__FUP.S.notes.some(n=>n.k==='ev')"), f'{name}: evento sparito con «Decidi più tardi»'
    await pg.evaluate("()=>{const F=window.__FUP; ['regolamento','barcode'].forEach(t=>F.S.researched[t]=true); F.ACT.hiremgr({id:'chiara'});}")
    for wn in ['azienda','riepilogo','magazzini','traffico','clienti','gare','report','personale','direzione','policy','espansione','giornale','tecnologia','enciclopedia']:
        await menu(pg, wn)
        assert await pg.evaluate(FITS, f'#win-{wn}'), f'{name}: finestra {wn} esce dallo schermo'
        bad = await pg.evaluate(NOSIDE, f'#win-{wn}')
        assert not bad, f'{name}: finestra {wn}: {bad}'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_{wn}.png'))
        await pg.tap(f'#win-{wn} [data-act=close]')
    # parola chiave: primo tocco = tooltip, secondo tocco = enciclopedia
    await menu(pg, 'magazzini')
    await pg.tap('#win-magazzini .kw[data-id=saturazione]')
    assert await pg.is_visible('#tip') and not await pg.query_selector('#win-enciclopedia'), f'{name}: il primo tocco deve mostrare il tooltip'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_tooltip.png'))
    await pg.tap('#win-magazzini .kw[data-id=saturazione]')
    assert await pg.query_selector('#win-enciclopedia .wk-it[aria-current=true][data-id=saturazione]'), f'{name}: il secondo tocco deve aprire la voce'
    # il menu riporta davanti una finestra coperta invece di chiuderla
    await menu(pg, 'magazzini')
    assert await pg.query_selector('#win-magazzini'), f'{name}: la finestra coperta è stata chiusa'
    # riepilogo dopo tre anni di gioco: ogni scheda resta dentro lo schermo
    await pg.evaluate(BOT, 'gino')
    for _ in range(5): await pg.evaluate(CLEAR)
    await pg.evaluate("()=>{window.__FUP.S.speed=0;document.querySelector('#modal').innerHTML='';document.querySelector('#toasts').innerHTML='';}")
    # pagina Produttività del magazzino: grafico con lo storico e dettaglio delle voci, dentro lo schermo
    if not await pg.query_selector('#win-magazzini'): await menu(pg, 'magazzini')
    await pg.tap('#win-magazzini [data-act=whprod][data-on="1"]')
    assert await pg.query_selector('#win-magazzini svg[data-chart^=pr_]'), f'{name}: grafico della produttività mancante'
    assert await pg.evaluate(FITS, '#win-magazzini'), f'{name}: produttività esce dallo schermo'
    bad = await pg.evaluate(NOSIDE, '#win-magazzini')
    assert not bad, f'{name}: produttività: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_produttivita.png'), full_page=True)
    await pg.tap('#win-magazzini [data-act=whprod][data-on="0"]')
    assert await pg.query_selector('#win-magazzini [data-act=whprod][data-on="1"]'), f'{name}: non si torna al magazzino'
    if await pg.query_selector('#win-magazzini'): await pg.tap('#win-magazzini [data-act=close]')
    await menu(pg, 'riepilogo')
    for t in ['gen','soldi','op','cli','pers','mod']:
        await pg.tap(f'#win-riepilogo [data-act=rptab][data-id={t}]')
        assert await pg.evaluate(FITS, '#win-riepilogo'), f'{name}: riepilogo {t} esce dallo schermo'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_riepilogo_{t}.png'))
    # report della partita (anche a partita in corso, dal Riepilogo): ogni scheda resta dentro lo schermo
    await pg.tap('#win-riepilogo [data-act=rptab][data-id=gen]')
    await pg.tap('#win-riepilogo [data-act=finale]')
    for t in ['sint','cresc','anni','cron']:
        await pg.tap(f'#win-finale [data-act=fintab][data-id={t}]')
        assert await pg.evaluate(FITS, '#win-finale'), f'{name}: report {t} esce dallo schermo'
        bad = await pg.evaluate(NOSIDE, '#win-finale')
        assert not bad, f'{name}: report {t}: {bad}'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_finale_{t}.png'))
    await pg.tap('#win-finale [data-act=close]')
    await pg.tap('#win-riepilogo [data-act=close]')
    # numeri in alto: ognuno apre la sua finestra di dettaglio; dalla cassa si chiede un prestito
    for wn in ['cassa','mese','morale','otif']:
        await pg.evaluate(f"document.querySelector('#stats [data-id={wn}]').scrollIntoView()")
        await pg.tap(f'#stats [data-id={wn}]')
        assert await pg.query_selector(f'#win-{wn}'), f'{name}: il numero {wn} non apre la finestra'
        assert await pg.evaluate(FITS, f'#win-{wn}'), f'{name}: finestra {wn} esce dallo schermo'
        bad = await pg.evaluate(NOSIDE, f'#win-{wn}')
        assert not bad, f'{name}: finestra {wn}: {bad}'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_dato_{wn}.png'), full_page=True)
        if wn == 'cassa':
            # il bot dei tre anni a volte fallisce: per provare il prestito l'azienda torna in piedi
            r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; S.over=false; S.cash=Math.max(S.cash,150000); const c0=S.cash,d0=F.debt(); document.querySelector('#win-cassa [data-act=loantake]').click();
              const l=(S.loans||[])[(S.loans||[]).length-1]; if(!l) return {got:false,d0}; const got=S.cash-c0>=l.amt-1, left=l.left; for(let i=0;i<32;i++){document.querySelector('#modal').innerHTML='';S.cash=Math.max(S.cash,150000);F.step();}
              return {got, paid:l.left<left, d0, d1:F.debt(), over:S.over, day:S.day};}''')
            assert r['got'] and r['paid'], f'{name}: prestito non funziona {r}'
        await pg.tap(f'#win-{wn} [data-act=close]')
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
        await intro(pg, 'shot_intro.png')
        await pg.click('#start .news summary')
        assert await pg.evaluate("document.querySelector('#start .news').open"), 'elenco delle novità non si apre'
        await pg.screenshot(path=os.path.join(OUT, 'shot_novita.png'))
        await pg.click('#start .news summary')
        assert await pg.query_selector('#start .hm-empty') and await pg.evaluate("!document.querySelector('#start [data-act=newgame]').disabled"), 'schermata principale senza partite'
        await pg.click('[data-act=newgame]')
        # i tooltip devono stare sopra a tutto: schermata iniziale (talenti dei CEO) e finestre aperte
        TIP_ON_TOP = '''(()=>{const t=document.querySelector('#tip'),r=t.getBoundingClientRect();t.style.pointerEvents='auto';const e=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);t.style.pointerEvents='';return !t.hidden&&!!e&&!!e.closest('#tip');})()'''
        await pg.hover('#start .ceo[data-id=edoardo] .tal')
        assert await pg.evaluate(TIP_ON_TOP), 'tooltip del talento coperto nella schermata iniziale'
        # creazione del CEO a passaggi: senza nome e titolo non si va avanti
        await pg.click('[data-act=pickceo][data-id=custom]')
        await pg.click('[data-act=stnext]')
        assert 'nome e cognome' in await pg.inner_text('#start [role=alert]')
        await pg.click('[data-act=sugg][data-f=persona]')
        assert await pg.input_value('#cc-nome') and await pg.input_value('#cc-cognome'), 'nome e cognome non suggeriti'
        await pg.fill('#cc-nome', 'Ornella'); await pg.fill('#cc-cognome', 'Bancalini'); await pg.fill('#cc-nick', 'la Bolla')
        await pg.click('[data-act=sugg][data-f=motto]')
        assert await pg.input_value('#cc-nome') == 'Ornella' and await pg.input_value('#cc-motto')
        await pg.click('[data-act=ccimg][data-d="1"]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_1_identita.png'), full_page=True)
        await pg.click('[data-act=stnext]')
        for _ in range(3): await pg.click('[data-act=ccst][data-k=op][data-d="1"]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_2_abilita.png'), full_page=True)
        await pg.click('[data-act=stnext]')
        await pg.click('[data-act=stnext]')
        assert 'titolo di studio' in await pg.inner_text('#start [role=alert]')
        await pg.click('[data-act=ccedu][data-n="Laureato in scienze umanistiche"]')
        await pg.click('[data-act=ccedu][data-n="Ingegnere informatico"]')   # cambia titolo
        for n in ['Calma olimpica', 'Insonne', 'Cena col buyer', 'Stacanovista']:  # il quarto non entra
            await pg.click(f'[data-act=cctal][data-n="{n}"]', force=True)
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_3_studi.png'), full_page=True)
        await pg.click('[data-act=stnext]')
        assert 'la Bolla' in await pg.inner_text('#start .cv')
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_4_cv.png'), full_page=True)
        await pg.click('[data-act=stback]'); await pg.click('[data-act=stnext]')   # indietro e di nuovo avanti
        await pg.click('[data-act=stnext]')
        assert await pg.input_value('#coname-in') == 'Trasporti Bancalini'
        await pg.click('[data-act=sugg][data-f=name]')
        assert await pg.input_value('#coname-in') not in ('', 'Trasporti Bancalini'), 'nome azienda non suggerito'
        await pg.fill('#coname-in', 'Trasporti Bancalini')
        await pg.click('[data-act=ccbase][data-id=marco]'); await pg.click('[data-act=cologo][data-id=muletto]')
        await pg.fill('#co-claim', 'Ogni bancale è una promessa.')
        assert await pg.inner_text('#co-prev-c') == 'Ogni bancale è una promessa.'
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_5_azienda.png'), full_page=True)
        await pg.click('[data-act=stnext]'); await pg.click('[data-act=stamp]'); await pg.wait_for_timeout(700)
        assert await pg.query_selector('#start .timbro')
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_6_visura.png'), full_page=True)
        await pg.click('[data-act=stnext]')
        assert await pg.evaluate("document.querySelectorAll('#start .lb-slot').length") == 4, 'lobby senza i 4 posti'
        await pg.click('[data-act=lbbot][data-id=gino][data-k=on][data-v="0"]')   # un avversario resta fuori
        # comportamento e difficoltà: tendina chiusa con Standard · Normale, si apre per cambiarli
        assert await pg.evaluate("[...document.querySelectorAll('#start .lb-slot.cpu:not(.off) .lb-fh')].every(b=>b.innerText.includes('Standard · Normale')&&b.getAttribute('aria-expanded')==='false')"), 'le CPU devono partire Standard · Normale, a tendina chiusa'
        assert not await pg.query_selector('#start [data-act=lbbot][data-k=diff]'), 'la tendina deve partire chiusa'
        await pg.click('[data-act=lbfold][data-id=edoardo]'); await pg.click('[data-act=lbbot][data-id=edoardo][data-k=diff][data-v=spietato]')
        await pg.click('[data-act=lbfold][data-id=valeria]'); await pg.click('[data-act=lbbot][data-id=valeria][data-k=style][data-v=prezzo]')
        await pg.click('[data-act=lbwin][data-id=reputazione]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_7_lobby.png'), full_page=True)
        await pg.click('[data-act=startgame]'); await pg.click('[data-act=closemodal]')
        lb = await pg.evaluate('()=>{const F=window.__FUP,H=F.HUM;return {n:H.bots.length,ids:H.bots.map(b=>b.bot.id),diff:H.bots.find(b=>b.bot.id==="edoardo").bot.diff,sty:Object.fromEntries(H.bots.map(b=>[b.bot.id,b.bot.style])),win:H.cfg.win,mode:H.cfg.mode,cols:[H.company.color,...H.bots.map(b=>b.company.color)]}}')
        assert lb['n'] == 2 and 'gino' not in lb['ids'] and 'marco' not in lb['ids'] and lb['diff'] == 'spietato' and lb['sty'] == {'edoardo': 'standard', 'valeria': 'prezzo'}, lb
        assert lb['win']['reputazione'] and lb['mode'] == 'classica' and len(set(lb['cols'])) == 3, lb
        c = await pg.evaluate('()=>{const S=window.__FUP.S;return {id:S.ceoId,n:S.custom.name,tal:S.custom.tal,st:S.custom.st,co:S.company.name,logo:S.company.logo,claim:S.company.claim,nick:S.custom.nick,wh:S.warehouses[0].site,cl:S.clients[0].name}}')
        assert c['id'] == 'custom' and c['n'] == 'Ornella Bancalini' and c['co'] == 'Trasporti Bancalini', c
        assert c['logo'] == 'muletto' and c['claim'] == 'Ogni bancale è una promessa.' and c['nick'] == 'la Bolla', c
        assert c['tal'] == ['Ingegnere informatico', 'Calma olimpica', 'Insonne', 'Cena col buyer'], c['tal']
        # 8 di base, +3 in Operazioni; Ingegnere informatico Inn +4 Lead −2; Calma +1 Lead; Insonne Op −2 Prec −2; Cena Neg +4
        assert c['st'] == {'op': 9, 'prec': 6, 'neg': 12, 'lead': 7, 'amm': 8, 'inn': 12}, c['st']
        assert c['wh'] == 'voltri' and c['cl'] == 'Caffè Portuale', c
        await pg.click('#dock [data-id=azienda]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_azienda_ceo_creato.png'))
        await pg.click('#dock [data-id=azienda]')
        bar = await pg.evaluate(BAR)
        assert bar['eq'] and bar['right'] and await pg.evaluate("document.querySelectorAll('#top .spd button').length") == 2, f'barra in alto {bar}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_barra_pausa.png'), clip={'x': 0, 'y': 0, 'width': 1440, 'height': 120})
        # lente delle province
        assert not await pg.is_visible('#lenses [data-act=lens][data-id=prov]'), 'le lenti devono partire chiuse'
        await pg.click('#lenses [data-act=lensmenu]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_lenti_aperte.png'))
        await pg.click('#lenses [data-act=lens][data-id=prov]')
        assert not await pg.is_visible('#lenses [data-act=lens][data-id=prov]'), 'scelta la lente, il menu delle lenti resta aperto'
        n = await pg.evaluate("document.querySelectorAll('#ov path.prov').length")
        assert n == 47, f'province disegnate: {n}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_lente_province.png'))
        await pg.keyboard.press('KeyL')  # lente dei viaggi
        assert await pg.evaluate("document.querySelectorAll('#ov path.prov').length") == 0
        assert await pg.evaluate("document.querySelector('#ov [aria-label=Viaggi]')!==null"), 'lente Viaggi non disegnata'
        await pg.screenshot(path=os.path.join(OUT, 'shot_lente_viaggi.png'))
        await pg.keyboard.press('KeyL')  # torna alla mappa normale
        for w in ['azienda','magazzini','traffico','clienti','gare','report','personale','direzione','policy','espansione','giornale','classifica','tecnologia']:
            await pg.click(f'#dock [data-id={w}]')
            assert await pg.evaluate(FITS, f'#win-{w}'), f'finestra {w} esce dal fondo dello schermo'
            if w == 'classifica':
                assert await pg.eval_on_selector_all('#win-classifica .cls', 'e=>e.length') == 3, 'classifica senza le 3 aziende'
                await pg.screenshot(path=os.path.join(OUT, 'shot_classifica.png'))
        for t in ['log','org','mkt','wel']:
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
        # welfare: ricerca simulata, installazione in un magazzino e morale che sale
        await pg.evaluate("()=>{window.__FUP.S.researched.acqua=true;}")
        await pg.click('#win-tecnologia [data-act=seltree][data-id=wel]')
        await pg.click('#win-tecnologia [data-act=seltech][data-id=acqua]')
        await pg.eval_on_selector('#win-tecnologia [data-act=install]', 'e=>e.click()')
        ok = await pg.evaluate("()=>{const F=window.__FUP,w=F.S.warehouses[0];return !!w.tech.acqua;}")
        assert ok, 'boccioni d\'acqua non installati'
        await pg.screenshot(path=os.path.join(OUT, 'shot_tree_wel_inst.png'))
        await pg.click('#dock [data-id=direzione]')  # chiude la finestra aperta prima...
        if not await pg.query_selector('#win-direzione'): await pg.click('#dock [data-id=direzione]')  # ...e la riapre in primo piano
        await pg.click('#win-direzione [data-act=hireexec][data-id=ottavio]')
        await pg.select_option('#win-direzione select[data-role=fin]', 'ottavio')
        await pg.screenshot(path=os.path.join(OUT, 'shot_direzione.png'))
        st = await pg.evaluate('()=>({barcode:!!window.__FUP.S.warehouses[0].tech.barcode, fin:window.__FUP.S.dirs.fin})')
        assert st['barcode'] and st['fin'] == 'ottavio', st
        # policy: accensione, attesa di 90 giorni, pretese dei manager, ultimatum con aumento e dimissioni
        await pg.evaluate(CLEAR)
        await pg.evaluate("()=>{const S=window.__FUP.S; ['regolamento','barcode','hr'].forEach(t=>S.researched[t]=true);}")
        await pg.click('#dock [data-id=policy]')
        if not await pg.query_selector('#win-policy'): await pg.click('#dock [data-id=policy]')
        await pg.click('#win-policy [data-act=poltog][data-id=zerostra]')
        assert await pg.evaluate("()=>window.__FUP.polOn('zerostra')"), 'zero straordinario non acceso'
        assert await pg.eval_on_selector('#win-policy [data-act=poltog][data-id=zerostra]', 'e=>e.disabled'), 'la policy si può cambiare subito'
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; F.ACT.hiremgr({id:'davide'}); F.ACT.hiremgr({id:'rosa'});
          const d=S.managers.find(x=>x.id==='davide'), r0=d.ral; let ult=0;
          for(let i=0;i<40;i++){ F.step(); const n=S.notes.find(x=>x.k==='ev'); if(n) F.ACT.note({id:n.id}); const m=document.querySelector('#modal');
            if(n&&n.title.includes('minaccia')){ ult++; m.querySelectorAll('[data-act=evopt]')[1].click(); } else if(m.innerHTML){const c=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(c) c.click();} }
          const rosa=S.managers.find(x=>x.id==='rosa');
          return {ult, tol:!!(d.tol||{}).zerostra, raise:d.ral>r0, g:F.grievances(d).length, rosa:F.grievances(rosa).map(x=>x.id)};}''')
        assert r['ult'] >= 1 and r['tol'] and r['raise'] and r['g'] == 0, r
        await pg.click('#dock [data-id=policy]')
        if not await pg.query_selector('#win-policy'): await pg.click('#dock [data-id=policy]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_policy.png'))
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.ACT.hiremgr({id:'chiara'}); const c=S.managers.find(x=>x.id==='chiara'); c.unh=29;
          F.step(); const n=S.notes.find(x=>x.k==='ev'); if(n) F.ACT.note({id:n.id}); const m=document.querySelector('#modal'); const ok=!!n&&m.textContent.includes('minaccia'); m.querySelectorAll('[data-act=evopt]')[2].click();
          for(let i=0;i<31;i++){ F.step(); document.querySelector('#modal').innerHTML=''; } return {ok, hired:c.hired};}''')
        assert r['ok'] and not r['hired'], f'dimissioni dopo il preavviso: {r}'
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
        assert await pg.eval_on_selector_all('#win-personale .pr-r', 'e=>e.length') == 7
        await pg.screenshot(path=os.path.join(OUT, 'shot_personale.png'))
        await pg.click('#win-personale [data-act=openwh]')
        assert await pg.eval_on_selector_all('#win-magazzini [data-act=hire]', 'e=>e.length') == 7
        # facility manager, manutenzione e ampliamento
        await pg.evaluate("()=>{const S=window.__FUP.S,w=S.warehouses[0]; w.staff.fm=1; w.cond=45; S.cash+=900000;}")
        await pg.click('#dock [data-id=personale]'); await pg.click('#dock [data-id=personale]')
        await pg.click('#win-personale [data-act=openwh]')
        await pg.eval_on_selector('#win-magazzini [data-act=straord]', 'e=>e.click()')
        await pg.eval_on_selector('#win-magazzini [data-act=amplia]', 'e=>e.click()')
        st = await pg.evaluate("()=>{const w=window.__FUP.S.warehouses[0];return [w.cond,!!w.build];}")
        assert st[0] == 100 and st[1], f'manutenzione/ampliamento: {st}'
        await pg.evaluate("()=>{const F=window.__FUP;F.S.warehouses[0].cond=52;}")
        await pg.click('#dock [data-id=magazzini]'); 
        if not await pg.query_selector('#win-magazzini'): await pg.click('#dock [data-id=magazzini]')
        card = await pg.evaluate_handle("()=>document.querySelector('#win-magazzini [data-act=straord]').closest('.card')")
        await card.as_element().scroll_into_view_if_needed()
        await card.as_element().screenshot(path=os.path.join(OUT, 'shot_magazzino_immobile.png'))
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
          delete S.boss; delete S.alumni; S.managers=S.managers.filter(m=>!m.from).map(m=>{const x={...m}; delete x.bd; delete x.log; delete x.ann; return x;}); S.execs.forEach(e=>{delete e.bd; delete e.log;});
          F.save(); return true;}''')
        await pg.evaluate('()=>location.reload()'); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached'); await pg.wait_for_selector('[data-act=continue]')
        await pg.click('[data-act=continue]'); await pg.evaluate(CLEAR)
        st = await pg.evaluate('''()=>{const S=window.__FUP.S;return {st:S.warehouses[0].staff,imp:S.imp,q:S.queue.map(q=>q.role+String.fromCharCode(58)+!!q.wh)}}''')
        assert st['imp'] is None and sum(st['st'].values()) == 8+3 and st['st']['autB'] > 0, st
        assert st['q'] == ['imp:true', 'autCE:true'], st
        assert await pg.evaluate('()=>window.__FUP.S.office.plan===0 && window.__FUP.S.warehouses[0].coop===false')
        st = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S;return {boss:S.boss.name,age:F.ageOf(S.boss),m:S.managers.length,bd:F.people().every(p=>p.bd!=null&&Array.isArray(p.log))}}''')
        assert st['boss'] == 'Marco Pellegrino' and st['age'] == 36 and st['m'] >= 13 and st['bd'], st
        # eventi dei talenti: ognuno compare con il suo talento e tutte le scelte funzionano
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame(null,F.ccCeo(Object.assign(F.ccNew(),{nome:'Prova',cognome:'Eventi',edu:'Autodidatta'})));
          const S=F.S,evs=F.EVENTS.filter(e=>e.id.startsWith('t_')),bad=[];S.boss.tal=[];
          evs.forEach(e=>{const nm=(e.cond.toString().match(/hasTal[(]'(.+?)'[)]/)||[])[1];if(!nm||!F.TALENTS[nm.replace(/\\\\/g,'')])bad.push(e.id+': talento?');});
          if(evs.some(e=>{try{return e.cond();}catch(x){return true;}}))bad.push('evento senza talento');
          S.boss.tal=Object.keys(F.TALENTS);
          evs.forEach(e=>e.opts.forEach((o,i)=>{const ev={...e};try{if(ev.setup)ev.setup(ev);if(!ev.text)bad.push(e.id+': testo');o.f.call(ev);}catch(x){bad.push(e.id+'/'+i+': '+x);}}));
          return {n:evs.length,bad};}''')
        assert r['n'] >= 30 and not r['bad'], r
        # ogni committente ha logo, zone valide e provenienza; tante gare piccole
        r = await pg.evaluate('''()=>{const F=window.__FUP,bad=[];F.newGame('marco');
          F.TENDER_POOL.forEach(t=>{const ci=F.CINFO[t.name];if(!F.LOGO[t.name])bad.push(t.name+': logo');if(!ci){bad.push(t.name+': CINFO');return;}
            ci.zones.forEach(z=>{if(!F.ZONES[z])bad.push(t.name+': zona '+z);});if(!F.ORIGINS[ci.src])bad.push(t.name+': origine');});
          F.EVENTS.forEach(e=>{const ev={...e};if(ev.setup)try{ev.setup(ev);}catch(x){}(ev.opts||[]).concat(e.opts).forEach(o=>{if(!o.r)bad.push(e.id+': testo del risultato');});});
          const S=F.S;let small=0,n=0;for(let i=0;i<300;i++){S.tenders=[];F.newTender();const t=S.tenders[0];n++;if(F.ZONES[t.zone].k==='prov'||F.ZONES[t.zone].k==='grp')small++;}
          return {bad,small:small/n,open:F.S.tenders.length};}''')
        assert not r['bad'] and r['small'] > 0.4, r
        # eventi: l'effetto della scelta arriva il giorno dopo, con il racconto di com'è andata
        await pg.evaluate("()=>{const F=window.__FUP;F.newGame('marco');F.S.speed=1;}")
        await pg.evaluate(FIRE, 'cesto')
        r = await pg.evaluate("()=>{const S=window.__FUP.S;return {speed:S.speed,modal:document.querySelector('#modal').innerHTML,card:!document.querySelector('#notecard').hidden,ev:S.notes.filter(n=>n.k==='ev').length}}")
        assert r['speed'] == 0 and not r['modal'] and r['card'] and r['ev'] == 1, f'evento: niente finestra, tessera, cartellino e pausa {r}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_notifiche_evento.png'))
        cash0 = await pg.evaluate('()=>window.__FUP.S.cash')
        await pg.click('#notes [data-act=note]')
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        r = await pg.evaluate('()=>{const S=window.__FUP.S;return {cash:S.cash,pend:S.evPend.length,altro:S.cur.altro}}')
        assert r['cash'] == cash0 and r['pend'] == 1, r
        assert await pg.evaluate("()=>window.__FUP.S.speed") == 1, 'dopo la scelta il tempo non riparte'
        altro0 = r['altro']
        await pg.evaluate("()=>{const F=window.__FUP;F.S.speed=0;F.step();}")
        await pg.click('#notes .nt.blue')
        txt = await pg.inner_text('#notepop')
        assert "Com'è andata" in txt and 'panettone' in txt, txt
        await pg.screenshot(path=os.path.join(OUT, 'shot_evento_risultato.png'))
        r = await pg.evaluate('()=>{const S=window.__FUP.S;return {altro:S.cur.altro,pend:S.evPend.length}}')
        assert r['altro'] - altro0 == 2500 and r['pend'] == 0, r
        await pg.click('#notepop [data-act=notedel]')
        assert not await pg.query_selector('#notes .nt.blue'), 'la notifica letta non se ne va'
        # nelle Opzioni si toglie la pausa automatica; senza risposta, dopo due settimane decide il vice
        await pg.click('#top [data-act=options]')
        await pg.click('#modal [data-act=evpause]')
        await pg.click('#modal [data-act=closemodal]')
        r = await pg.evaluate('''(fire)=>{const F=window.__FUP,S=F.S; S.speed=1; eval(fire)('cesto'); const sp=S.speed; S.speed=0;
          for(let i=0;i<15;i++) F.step(); return {sp, ev:S.notes.filter(n=>n.k==='ev').length, vice:S.notes.filter(n=>n.g==='vice').length, pend:S.evPend.length};}''', FIRE)
        assert r['sp'] == 1 and r['ev'] == 0 and r['vice'] == 1, f'pausa automatica o decisione del vice {r}'
        await pg.evaluate("()=>{window.__FUP.HUM.cfg.noPause=false;}")
        # eventi personali: CEO, manager e dirigenti; tutte le scelte funzionano e cambiano abilità e talenti
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame('gino');const S=F.S,bad=[],w=S.warehouses[0];
          document.querySelector('#modal').innerHTML=''; S.researched.direzione=true; ['chiara','davide','rosa'].forEach(id=>F.ACT.hiremgr({id}));
          const c=S.managers.find(m=>m.id==='chiara'); w.mgr='chiara'; c.wh=w.id; S.execs.forEach(e=>{e.hired=true;}); S.dirs.fin=S.execs[0].id;
          S.boss.tal.push('Fumatore incallito','Stacanovista');
          const evs=F.EVENTS.filter(e=>/^(p|m|d|x)_/.test(e.id));
          evs.forEach(e=>{try{e.cond();}catch(x){bad.push(e.id+': cond '+x);} e.opts.forEach((o,i)=>{const ev={...e}, T=F.people().map(p=>[p,[...p.tal],{...p.st},p.quit]);try{if(ev.setup)ev.setup(ev);if(!ev.text)bad.push(e.id+': testo');if(!ev.p)bad.push(e.id+': persona');o.f.call(ev);}catch(x){bad.push(e.id+'/'+i+': '+x);}
            T.forEach(([p,t,st,q])=>{p.tal=t;p.st=st;p.quit=q;});});});
          const p=S.managers.find(m=>m.id==='rosa'), st0={...p.st}; F.gainTal(p,'Mentore'); const up=p.st.lead-st0.lead; F.loseTal(p,'Mentore'); const back=p.st.lead===st0.lead;
          ['Esaurito','Golfista','Maratoneta','Cuoco provetto'].forEach(n=>F.gainTal(p,n));
          return {n:evs.length,bad,up,back,max:p.tal.length};}''')
        assert r['n'] >= 20 and not r['bad'] and r['up'] == 2 and r['back'] and r['max'] == 5, r
        # il risultato di un evento personale mostra cosa è cambiato
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S;S.day=Math.max(S.day,800);S.boss.tal=S.boss.tal.filter(t=>t!=='Esperto di dogane');}")
        await pg.evaluate(FIRE, 'p_dogane')
        await pg.click('#notes [data-act=note]')
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        await pg.evaluate("()=>{window.__FUP.step();}")
        await pg.click('#notes .nt.blue')
        assert await pg.query_selector('#notepop .ev-chg .chg'), await pg.inner_text('#notepop')
        await pg.screenshot(path=os.path.join(OUT, 'shot_evento_personale.png'))
        await pg.click('#notepop [data-act=notedel]')
        # pensione di un manager: al compleanno dei 66 anni annuncia la pensione, dopo il preavviso esce dalle liste
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.ACT.hiremgr({id:'toto'}); const t=S.managers.find(m=>m.id==='toto');
          t.bd=S.day+1-66*365; S.nextEvent=1e9; F.step(); return {age:F.ageOf(t),ev:S.notes.filter(n=>n.k==='ev').map(n=>n.title).join()};}''')
        assert r['age'] == 66 and 'pensione' in r['ev'], r
        await pg.click('#notes [data-act=note]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_pensione.png'))
        await pg.click('#modal [data-act=evopt][data-i="2"]')
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,t=S.managers.find(m=>m.id==='toto'); const q=!!(t.quit&&t.quit.ret); t.quit.day=S.day; F.step(); return {q,ret:t.retired,hired:t.hired};}''')
        assert r['q'] and r['ret'] and not r['hired'], r
        # il CEO compie 65 anni, lascia, e si sceglie il successore
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S;document.querySelector('#modal').innerHTML='';S.boss.bd=S.day+1-65*365;F.step();}")
        await pg.click('#notes [data-act=note]')
        assert 'pensione' in (await pg.inner_text('#modal')).lower()
        await pg.click('#modal [data-act=evopt][data-i="2"]')
        await pg.evaluate("()=>{window.__FUP.step();}")
        assert await pg.query_selector('#modal [data-act=succ]'), 'scelta del successore non mostrata'
        await pg.screenshot(path=os.path.join(OUT, 'shot_successione.png'))
        old = await pg.evaluate('()=>window.__FUP.S.boss.name')
        await pg.click('#modal [data-act=succ]:not([disabled])')
        r = await pg.evaluate('()=>{const S=window.__FUP.S;return {n:S.boss.name,al:S.alumni.length}}')
        assert r['n'] != old and r['al'] == 1, r
        await pg.click('#modal [data-act=closemodal]')
        await pg.click('#dock [data-id=azienda]')
        if not await pg.query_selector('#win-azienda'): await pg.click('#dock [data-id=azienda]')
        assert 'CEO precedenti' in await pg.inner_text('#win-azienda')
        await pg.screenshot(path=os.path.join(OUT, 'shot_nuovo_ceo.png'))
        for ceo in ['gino','edoardo','valeria','marco','custom']:
            print(await pg.evaluate(BOT, ceo))
        # riepilogo dell'azienda dopo tre anni: storico mensile e tutte le schede
        for _ in range(5): await pg.evaluate(CLEAR)
        await pg.evaluate("()=>{window.__FUP.S.speed=0;document.querySelector('#modal').innerHTML='';document.querySelector('#toasts').innerHTML='';}")
        h = await pg.evaluate('()=>{const S=window.__FUP.S;return {n:S.hist.length,g:S.tw.win+S.tw.lose+S.tw.skip}}')
        assert h['n'] >= 6 and h['g'] > 0, h
        await pg.click('#dock [data-id=riepilogo]')
        if not await pg.query_selector('#win-riepilogo'): await pg.click('#dock [data-id=riepilogo]')
        for t in ['gen','soldi','op','cli','pers','mod']:
            await pg.click(f'#win-riepilogo [data-act=rptab][data-id={t}]')
            assert await pg.eval_on_selector_all('#win-riepilogo '+('.rp-mod' if t=='mod' else '.rp-t'), 'e=>e.length') >= (3 if t=='mod' else 6), t
            await pg.screenshot(path=os.path.join(OUT, f'shot_riepilogo_{t}.png'))
        await pg.click('#win-riepilogo [data-act=rptab][data-id=gen]')
        await pg.hover('#win-riepilogo svg[data-chart=rp_cash]')
        assert 'Cassa' in await pg.inner_text('#tip'), 'tooltip del grafico della cassa'
        # modificatori: le voci della puntualità sommano al valore del KPI; gli effetti degli eventi ricordano da dove vengono
        chk = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0],k=F.computeWH(w);
          const r=k.pP.reduce((a,x)=>a+x[1],0), m=k.pM.reduce((a,x)=>a+x[1],0);
          F.mod('all',{P:-2},5); const src=S.mods[S.mods.length-1].src; S.mods.pop();
          return {p:Math.abs(Math.max(50,Math.min(99.9,r))-k.P)<1e-9, m:Math.abs(Math.max(0,Math.min(100,m))-k.morT)<1e-9, src};}''')
        assert chk['p'] and chk['m'] and chk['src'] is None, chk
        # un'azienda più ricca: tecnologie, manager, un dirigente, welfare e un evento in corso
        await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0];
          ['barcode','formazione','gestionale','direzione','iso'].forEach(t=>S.researched[t]=true); w.tech.barcode={day:S.day-200}; w.tech.formazione={day:S.day-2};
          const m=S.managers[0]; m.hired=true; w.mgr=m.id; const e=S.execs[0]; e.hired=true; S.dirs.op=e.id; S.welfare.buoni=true;
          S.mods.push({scope:'all',P:-6,mor:3,until:S.day+7,src:'Nebbia in Val Padana'}); F.ACT.rptab({id:'mod'});}''')
        await pg.screenshot(path=os.path.join(OUT, 'shot_riepilogo_mod_pieno.png'))
        await pg.evaluate("()=>{const b=document.querySelector('#win-riepilogo .win-b');b.scrollTop=b.scrollHeight;}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_riepilogo_mod_pieno_sotto.png'))
        # notifiche dopo tre mesi di gioco: la colonna sta tra la barra e le lenti, le varie si aprono in una schedina e si leggono aprendo la finestra
        await pg.evaluate("()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.newGame('marco'); const S=F.S; S.cash+=300000; for(let i=0;i<90;i++) F.step(); S.speed=0; F.cardsOff();}")
        await pg.click('#top [data-act=speed][data-v="0"]')
        col = await pg.evaluate('''()=>{const n=document.querySelector('#notes'),r=n.getBoundingClientRect(),l=document.querySelector('#lenses').getBoundingClientRect();
          return {n:n.querySelectorAll('.nt').length,ok:r.bottom<=l.top&&r.top>=document.querySelector('#top').getBoundingClientRect().bottom,g:[...n.querySelectorAll('[data-act=noteg]')].map(e=>e.dataset.id)}}''')
        assert col['n'] >= 2 and col['ok'] and col['g'], f'colonna delle notifiche {col}'
        await pg.click(f'#notes [data-act=noteg][data-id={col["g"][0]}]')
        assert await pg.is_visible('#notepop .np-l'), 'la tessera delle notizie varie non apre l\'elenco'
        await pg.screenshot(path=os.path.join(OUT, 'shot_notifiche.png'))
        await pg.click('#notepop [data-act=notegopen]')
        assert not await pg.query_selector(f'#notes [data-act=noteg][data-id={col["g"][0]}]'), 'aprendo la finestra le notizie varie restano'
        await pg.evaluate("()=>document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click())")
        # partita completa con 3 avversari: due anni senza errori, offerte vere nelle gare, magazzini rivali sulla mappa
        r = await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('gino',null,{mode:'classica',win:{reputazione:true},reputazione:200});
          const H=F.HUM; H.bots=[['edoardo','espansione'],['valeria','qualita'],['marco','prezzo']].map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],'normale',i));
          let bids=0;
          for(let d=0;d<730&&!H.over;d++){ const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}
            H.cash=Math.max(H.cash,300000); bids+=H.tenders.filter(t=>t.bids&&Object.keys(t.bids).length&&t.deadline===H.day).length; F.step(); }
          F.ACT.toggle({id:'classifica'});
          return {bids,cli:H.bots.map(b=>b.clients.filter(c=>c.status==='attivo').length),day:H.day,mk:document.querySelectorAll('#ov [data-act=openclass]').length,
            sizeKB:Math.round(JSON.stringify(H).length/1024)};}''')
        assert r['bids'] > 3 and sum(r['cli']) > 6 and r['day'] >= 729, r
        print('avversari dopo 2 anni:', r)
        assert r['sizeKB'] < 2500, f'salvataggio troppo grande: {r}'
        # vittoria: una condizione facile fa comparire la finestra di fine partita
        w = await pg.evaluate('''()=>{const F=window.__FUP,H=F.HUM; document.querySelector('#modal').innerHTML=''; H.cfg.reputazione=1; F.checkWin();
          return {won:H.won,txt:document.querySelector('#modal').innerText};}''')
        assert w['won'] and 'vinto' in w['txt'].lower(), w
        await pg.screenshot(path=os.path.join(OUT, 'shot_vittoria.png'))
        await pg.click('#modal [data-act=openclass]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_classifica_fine.png'))
        # report di fine partita: dalla classifica, con tutte le schede; la cronaca ha le tappe della partita
        await pg.click('#win-classifica [data-act=finale]')
        for t in ['sint','cresc','anni','cron','avv']:
            await pg.click(f'#win-finale [data-act=fintab][data-id={t}]')
            await pg.screenshot(path=os.path.join(OUT, f'shot_finale_{t}.png'))
        fin = await pg.evaluate('''()=>{const F=window.__FUP,H=F.HUM,q=s=>document.querySelectorAll('#win-finale '+s).length; F.ACT.fintab({id:'sint'}); const r={tiles:q('.rp-t'),esito:document.querySelector('#win-finale .fin-esito').innerText};
          F.ACT.fintab({id:'cresc'}); r.charts=q('svg[data-chart^=fn_]'); F.ACT.fintab({id:'cron'}); r.cron=q('.fin-cr'); r.log=(H.log||[]).length; F.ACT.fintab({id:'avv'}); r.avv=q('tr')-1;
          // più di tre anni di storia: i grafici passano a un punto per anno
          const h0=H.hist; H.hist=h0.concat(h0.map(h=>({...h,d:h.d+730}))); F.ACT.fintab({id:'cresc'}); r.yr=document.querySelector('#win-finale svg[data-chart=fn_ru]').closest('figure').innerText.includes('anno'); H.hist=h0;
          return r;}''')
        assert fin['tiles'] >= 12 and fin['esito'] in ('Vittoria','Sconfitta') and fin['charts'] == 7 and fin['cron'] >= 5 and fin['avv'] == 4 and fin['yr'], fin
        print('report di fine partita:', fin)
        # fallimento: il pulsante nella finestra apre il report
        await pg.evaluate("()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.newGame('gino'); const S=F.S; for(let i=0;i<70;i++) F.step(); S.cash=-90000; for(let i=0;i<31&&!S.over;i++) F.step();}")
        await pg.click('#modal [data-act=finale]')
        assert 'Fallimento' in await pg.inner_text('#win-finale .fin-esito'), 'report dopo il fallimento'
        await pg.screenshot(path=os.path.join(OUT, 'shot_finale_fallimento.png'))
        await pg.evaluate("()=>document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click())")
        # tempo senza pausa: in modalità Veloce i giorni passano anche con una finestra aperta
        d0 = await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('valeria',null,{mode:'veloce',win:{}}); F.S.speed=1; F.ACT.options(); return F.S.day;}''')
        await pg.wait_for_timeout(3500)
        d1 = await pg.evaluate('()=>window.__FUP.S.day')
        assert d1 >= d0 + 1, f'tempo fermo in modalità veloce: {d0} -> {d1}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_tempo_veloce.png'))
        # modalità persistente: dieci giorni veri di assenza diventano dieci settimane recuperate, con il riepilogo
        await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('marco',null,{mode:'persistente',win:{}});
          F.S.clock={at:Date.now()-10*86400000,day:0}; F.S.speed=1;}''')
        await pg.wait_for_selector('#modal .modal', timeout=20000)
        pr = await pg.evaluate('()=>({day:window.__FUP.S.day,txt:document.querySelector("#modal").innerText})')
        assert 69 <= pr['day'] <= 71 and 'settimane' in pr['txt'], pr
        await pg.screenshot(path=os.path.join(OUT, 'shot_persistente_rientro.png'))
        # cancellare la partita: dalle opzioni in gioco e dalla schermata iniziale, sempre con conferma
        await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('marco'); F.S.speed=0; F.save(); F.ACT.options();}''')
        await pg.click('#modal [data-act=delgame]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_cancella_conferma.png'))
        await pg.click('#modal [data-act=closemodal]')
        assert await pg.evaluate('()=>!!localStorage.getItem(window.__FUP.KEY)'), 'salvataggio sparito senza conferma'
        await pg.evaluate('()=>window.__FUP.ACT.options()'); await pg.click('#modal [data-act=delgame]'); await pg.click('#modal [data-act=delgameok]')
        assert await pg.evaluate('()=>!localStorage.getItem(window.__FUP.KEY)'), 'salvataggio non cancellato'
        assert not await pg.query_selector('#start [data-act=continue]'), 'partita cancellata ancora nella schermata iniziale'
        await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('gino'); F.save();}''')
        await pg.evaluate('()=>location.reload()'); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
        await pg.click('#start [data-act=delask]'); await pg.screenshot(path=os.path.join(OUT, 'shot_cancella_avvio.png'))
        await pg.click('#start [data-act=delno]'); await pg.wait_for_selector('#start [data-act=continue]')
        await pg.click('#start [data-act=delask]'); await pg.click('#start [data-act=delsave]')
        assert not await pg.query_selector('#start [data-act=continue]') and await pg.evaluate('()=>!localStorage.getItem(window.__FUP.KEY)'), 'cancellazione dalla schermata iniziale'
        # tre posti di salvataggio: l'ultima giocata in cima, con tre partite il pulsante per una nuova si spegne
        await pg.evaluate(SEED); await pg.reload(); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
        hm = await pg.evaluate("({n:document.querySelectorAll('#start .sv').length, top:document.querySelector('#start .sv.top .sv-co').innerText, full:document.querySelector('#start [data-act=newgame]').disabled})")
        assert hm == {'n': 3, 'top': 'Prova 2', 'full': True}, hm
        await pg.screenshot(path=os.path.join(OUT, 'shot_avvio_partite.png'), full_page=True)
        await pg.click('#start [data-act=delask][data-slot="3"]'); await pg.click('#start [data-act=delsave][data-slot="3"]')
        hm = await pg.evaluate("({n:document.querySelectorAll('#start .sv').length, full:document.querySelector('#start [data-act=newgame]').disabled, s3:localStorage.getItem(window.__FUP.slotKey(3))})")
        assert hm == {'n': 2, 'full': False, 's3': None}, hm
        await pg.click('[data-act=newgame]'); assert await pg.query_selector('#start .ceos'), 'nuova partita senza scelta del CEO'
        await pg.click('[data-act=stback]'); await pg.wait_for_selector('#start .sv.top')
        await pg.click('#start [data-act=continue][data-slot="1"]'); await pg.evaluate(CLEAR)
        r = await pg.evaluate('''()=>{const F=window.__FUP; F.S.company.name='Prova 1 bis'; F.save();
          const g=n=>{const v=JSON.parse(localStorage.getItem(F.slotKey(n))); return v&&v.S.company.name;}; return {slot:F.slot, s1:g(1), s2:g(2)};}''')
        assert r == {'slot': 1, 's1': 'Prova 1 bis', 's2': 'Prova 2'}, r
        await pg.evaluate('()=>window.__FUP.ACT.quitgame()')
        assert await pg.inner_text('#start .sv.top .sv-co') == 'Prova 1 bis', 'la partita appena giocata deve andare in cima'
        # salvataggio online: archivio finto al posto di Supabase (il test non usa la rete)
        await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; for(let n=1;n<=F.SLOTS;n++) localStorage.removeItem(F.slotKey(n));
          window.DB={}; const D=window.DB, cp=o=>JSON.parse(JSON.stringify(o));
          Object.assign(F.CLOUD_IO,{list:async()=>Object.values(D).map(r=>({slot:r.slot,at:r.at,dev:r.dev,nome:r.nome,giorno:r.giorno})),
            get:async n=>D[n]?{at:D[n].at,dati:cp(D[n].dati)}:null,
            insert:async r=>{if(D[r.slot]){const e=new Error('doppia');e.code='23505';throw e;} D[r.slot]=cp(r);},
            update:async(r,prev)=>{if(!D[r.slot]||D[r.slot].at!==prev) return []; D[r.slot]=cp(r); return [{slot:r.slot}];},
            put:async r=>{D[r.slot]=cp(r);}, del:async(n,max)=>{if(D[n]&&D[n].at<=max) delete D[n];}, wipe:async()=>{for(const k in D) delete D[k];}});
          F.slot=1; F.newGame('gino'); F.save(); F.ACT.quitgame();}''')
        r = await pg.evaluate('''async()=>{const F=window.__FUP; F.cloudUser({id:'u1',email:'prova@example.com'}); await new Promise(r=>setTimeout(r,300));
          const up=Object.keys(DB).join()==='1'&&F.cMeta(1).cat===F.load(1).at;
          DB[1].at+=5000; DB[1].dati.at=DB[1].at; DB[1].dati.S.day=400; DB[1].giorno=400; DB[1].dev='telefono iOS'; await F.cloudSync();
          const down=F.load(1).S.day===400;
          const sv=F.load(1); sv.at+=100; sv.S.day=401; localStorage.setItem(F.slotKey(1),JSON.stringify(sv)); DB[1].at+=9000; DB[1].giorno=500; DB[1].dati.S.day=500; DB[1].dati.at=DB[1].at; await F.cloudSync();
          const clash=!!F.CL.clash[1]&&!!document.querySelector('#start .cl-x [data-act=clkeep]');
          return {up,down,clash};}''')
        assert r == {'up': True, 'down': True, 'clash': True}, r
        await pg.screenshot(path=os.path.join(OUT, 'shot_online_conflitto.png'))
        await pg.click('#start [data-act=clkeep][data-w=cloud]'); await pg.wait_for_timeout(200)
        assert await pg.evaluate('()=>window.__FUP.load(1).S.day===500 && !window.__FUP.CL.clash[1]'), 'conflitto: versione online non scaricata'
        await pg.click('#start [data-act=delask][data-slot="1"]'); await pg.click('#start [data-act=delsave]'); await pg.wait_for_timeout(200)
        assert await pg.evaluate('()=>!Object.keys(DB).length && !window.__FUP.load(1)'), 'partita cancellata ma rimasta online'
        await pg.evaluate("()=>{window.__FUP.CL.user=null; window.__FUP.showStart();}")
        await b.close()
    if errs:
        print('ERRORI JS:', *errs, sep='\n  '); sys.exit(1)
    print('OK: nessun errore JavaScript. Screenshot in tools/out/')
asyncio.run(main())

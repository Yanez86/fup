"""Test automatico: apre il gioco in Chromium headless, clicca tutti i menu, prova alberi tecnologici e direzione,
crea un CEO personalizzato, prova il gioco su un telefono (verticale e orizzontale: finestre, tocchi, zoom con due dita),
poi fa giocare un bot semplice 3 anni con ognuno dei 4 CEO e con uno creato, e una partita col pacchetto Relazioni industriali.
Prova anche un trasloco completo (con un cliente che si rifiuta), gli imprevisti del trasloco e la franchigia, il capannone vuoto restituito,
venduto e affittato a un inquilino, il trasloco col sindacato, i traslochi e le offerte delle avversarie e l'ordinanza sui capannoni fatiscenti.
Percorre anche i due tutorial della dottoressa Ribalta (base e avanzato), sul computer e sul telefono.
Fallisce se ci sono errori JavaScript.
Uso: python3 tools/build.py && python3 tests/smoke_test.py   (richiede: pip install playwright && playwright install chromium)"""
import asyncio, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out'); os.makedirs(OUT, exist_ok=True)
PAGE = os.path.join(ROOT, 'dist', 'fup.html')
# animazioni di finestre e notifiche spente (casella delle Opzioni, 0.100): misure e tocchi trovano tutto già fermo al suo posto.
# Solo la partita sul computer le tiene accese, come di base, e prova che funzionano.
ANIM_OFF = "try{if(localStorage.getItem('fup-animazioni')==null)localStorage.setItem('fup-animazioni','0');}catch(e){}"

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

# finestrella di scelta di un manager: prima tutte le righe che si possono scegliere, poi quelle in grigio
MPORD = '''()=>{const r=[...document.querySelectorAll('#modal .mp-r')], i=r.findIndex(e=>e.classList.contains('off'));
  return r.length>1&&(i<0||r.slice(i).every(e=>e.classList.contains('off')))&&r.slice(0,i<0?r.length:i).every(e=>e.dataset.act==='mpick');}'''

SEED = '''()=>{const F=window.__FUP; [['gino',1],['marco',2],['valeria',3]].forEach(([c,n])=>{F.slot=n; F.newGame(c); F.S.company.name='Prova '+n;
  for(let d=0;d<35;d++){document.querySelector('#modal').innerHTML=''; F.step();} document.querySelector('#modal').innerHTML=''; if(n===3) F.S.cash=-12000; F.save();
  const k=F.slotKey(n), v=JSON.parse(localStorage.getItem(k)); v.at=Date.now()-(n===2?0:86400000*n); localStorage.setItem(k,JSON.stringify(v));}); F.slot=1;}'''

# barra in alto: in pausa tutti i riquadri hanno la stessa altezza e «In pausa» sta in fondo a destra
BAR = '''()=>{window.__FUP.ACT.speed({v:'0'}); const hs=[...document.querySelectorAll('#top .wkn,#top .date,#top .optb,#top .paused,#top .chip')].filter(e=>e.offsetParent).map(e=>Math.round(e.getBoundingClientRect().height));
  const p=document.querySelector('#paused').getBoundingClientRect(), t=document.querySelector('#top').getBoundingClientRect();
  return {hs:[...new Set(hs)], eq:new Set(hs).size===1, right:!document.querySelector('#paused').hidden&&p.width>0&&t.right-p.right<30&&p.top<t.top+60};}'''

# Chromium a volte perde il localStorage delle pagine file:// quando le ricarica (succedeva anche prima dei traslochi, a caso):
# prima di ricaricare se ne fa una copia e, se dopo manca qualcosa, lo si rimette e si ricarica di nuovo. Il gioco legge i salvataggi come sempre.
KEEP = "(s)=>{let n=0; for(const [k,v] of Object.entries(s)) if(localStorage.getItem(k)===null){localStorage.setItem(k,v); n++;} return n;}"
async def reload(pg):
    snap = await pg.evaluate("()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))")
    for _ in range(4):
        await pg.reload()
        if not await pg.evaluate(KEEP, snap): return

async def intro(pg, shot):
    # schermata introduttiva: il camioncino arriva, poi un tocco la chiude e resta la schermata iniziale
    await pg.wait_for_timeout(2900)
    await pg.screenshot(path=os.path.join(OUT, shot))
    assert await pg.evaluate(FITS, '#intro [data-act=introgo]'), f'{shot}: pulsante della schermata introduttiva fuori schermo'
    await pg.tap('#intro') if await pg.evaluate("navigator.maxTouchPoints>0") else await pg.click('#intro')
    await pg.wait_for_selector('#intro:empty', state='attached')

# finestre unite (0.69): le vecchie voci del menu sono schede della finestra madre
TABS = {'magazzini': ['espansione'], 'clienti': ['customer'], 'manager': ['direzione'], 'azienda': ['policy'], 'tecnologia': ['certificazioni']}
PARENT = {t: p for p, l in TABS.items() for t in l}

async def win(pg, w):
    # computer: apre dal menu la finestra di w in primo piano e, se w è una scheda, la sceglie; restituisce il selettore della finestra
    p = PARENT.get(w, w)
    await pg.click(f'#dock [data-id={p}]')
    if not await pg.query_selector(f'#win-{p}'): await pg.click(f'#dock [data-id={p}]')
    if p in TABS: await pg.click(f'#win-{p} [data-act=wtab][data-id={w}]')
    return f'#win-{p}'

async def menu(pg, wid):
    # telefono: le finestre si aprono dal menu che entra da sinistra
    await pg.tap('#burger'); await pg.wait_for_timeout(220)
    await pg.tap(f'#dock [data-id={wid}]'); await pg.wait_for_timeout(220)

async def phone(b, w, h, name, errs):
    ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True)
    await ctx.add_init_script(ANIM_OFF)
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{name}: {e}'))
    await pg.goto('file://' + PAGE)
    assert await pg.evaluate("document.documentElement.classList.contains('mob')"), 'layout telefono non attivo'
    # schermata principale con due partite salvate (il terzo posto resta per la partita del test)
    await pg.evaluate(SEED); await pg.evaluate(f"localStorage.removeItem(window.__FUP.slotKey(3))"); await reload(pg)
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
        # Indietro e Avanti sulla stessa riga, testo dentro i pulsanti
        nav = await pg.evaluate("(()=>{const b=[...document.querySelectorAll('#start .st-nav>.btn')].map(e=>e.getBoundingClientRect());return {riga:Math.abs(b[0].top-b[1].top)<2,dentro:b[1].right<=innerWidth}})()")
        assert nav["riga"] and nav["dentro"], f"{name}: pulsanti in fondo a {st} {nav}"
        if st == 'azienda': await pg.locator('#start .st-nav').screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_pulsanti.png'))
        await pg.tap('[data-act=stnext]')
    await pg.tap('[data-act=stamp]'); await pg.wait_for_timeout(700)
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: la visura scorre di lato'
    lati = await pg.evaluate("[...document.querySelectorAll('#start, #start *')].filter(e=>['auto','scroll'].includes(getComputedStyle(e).overflowX)&&e.scrollWidth>e.clientWidth+1).map(e=>e.className)")
    assert lati == [], f'{name}: la visura scorre di lato dentro la finestra {lati}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_visura.png'), full_page=True)
    # lobby: le quattro aziende, il ritmo del tempo e le condizioni di vittoria
    await pg.tap('[data-act=stnext]'); await pg.wait_for_timeout(200)
    ri = name == 'verticale'   # in verticale si gioca col pacchetto Relazioni industriali (acceso di base), in orizzontale senza
    assert await pg.evaluate("document.querySelectorAll('#start .lb-slot').length") == 4, f'{name}: lobby senza i 4 posti'
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: la lobby scorre di lato'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_lobby.png'), full_page=True)
    # pacchetti: il gioco base sempre incluso, le espansioni accese di base
    await pg.tap('[data-act=stnext]'); await pg.wait_for_timeout(200)
    assert await pg.evaluate("document.querySelector('#start [data-act=lbpack][data-id=ri]').getAttribute('aria-pressed')") == 'true', f'{name}: il pacchetto deve partire acceso'
    if not ri: await pg.tap('[data-act=lbpack][data-id=ri]')
    # il pacchetto Reparto IT e Ingegneria parte spento: in verticale lo si accende, insieme alle Relazioni industriali
    assert await pg.evaluate("document.querySelector('#start [data-act=lbpack][data-id=it]').getAttribute('aria-pressed')") == 'false', f'{name}: il pacchetto Reparto IT e Ingegneria deve partire spento'
    if ri: await pg.tap('[data-act=lbpack][data-id=it]')
    assert await pg.evaluate('document.documentElement.scrollWidth<=innerWidth'), f'{name}: i pacchetti scorrono di lato'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_crea_pacchetti.png'), full_page=True)
    await pg.tap('[data-act=startgame]'); await pg.tap('[data-act=closemodal]')
    assert await pg.evaluate('!!window.__FUP.HUM.cfg.ri') == ri, f'{name}: pacchetto Relazioni industriali sbagliato'
    assert await pg.evaluate('!!window.__FUP.HUM.cfg.it') == ri, f'{name}: pacchetto Reparto IT e Ingegneria sbagliato'
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
    # Opzioni: la casella delle animazioni c'è (qui spenta dal test) e la finestrella sta nello schermo
    await pg.tap('#top [data-act=options]')
    assert await pg.evaluate("document.querySelector('#modal [data-act=animset]').checked===false&&!document.documentElement.classList.contains('anim')"), f'{name}: casella delle animazioni mancante o sbagliata'
    assert await pg.evaluate(FITS, '#modal .modal'), f'{name}: le Opzioni escono dallo schermo'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_opzioni.png'))
    await pg.tap('#modal [data-act=closemodal]')
    assert not await pg.is_visible('#dock [data-id=azienda]'), f'{name}: il menu deve partire chiuso'
    await pg.tap('#burger'); await pg.wait_for_timeout(250)
    assert await pg.evaluate(FITS, '#dock'), f'{name}: menu aperto fuori schermo'
    nv = 12 + (1 if ri else 0) + (1 if await pg.evaluate('window.__FUP.HUM.bots.length') else 0)   # la Classifica c'è solo con gli avversari
    assert len(await pg.query_selector_all('#dock button[data-act=toggle]')) == nv, f'{name}: mancano voci nel menu'
    assert len(await pg.query_selector_all('#dock .dg')) == 4, f'{name}: il menu non ha i 4 gruppi'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_menu.png'))
    await pg.tap('#dock .dh [data-act=menu]'); await pg.wait_for_timeout(250)
    assert not await pg.is_visible('#dock [data-id=azienda]'), f'{name}: il menu non si chiude'
    zoom = await pg.evaluate(PINCH)
    assert zoom[1] > zoom[0] * 1.5, f'{name}: pinch non ha zoomato {zoom}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_mappa.png'))
    # barra in alto: tutto su una riga sopra i numeri, riquadri di settimana e mese sempre larghi uguali
    top = await pg.evaluate('''()=>{const y=s=>Math.round(document.querySelector(s).getBoundingClientRect().top), w=document.querySelector('#wkn'), d=document.querySelector('#date');
      const ws=['S1','S52'].map(t=>{w.textContent=t;return w.offsetWidth;}), ds=['1 gen 02','28 mar 08'].map(t=>{d.textContent=t;return d.offsetWidth;});
      return {row:Math.abs(y('#wkn')-y('#top .optb'))<12, ws, ds, txt:(window.__FUP.ACT.speed({v:'0'}),document.querySelector('#date').textContent)};}''')
    bar = await pg.evaluate(BAR)
    assert bar['eq'] and bar['right'], f'{name}: barra in alto {bar}'
    assert top['row'] and top['ws'][0] == top['ws'][1] and top['ds'][0] == top['ds'][1] and top['txt'] == '1 gen 02', f'{name}: barra in alto {top}'
    # notifiche: l'evento arriva come tessera, con il cartellino accanto; la tessera apre la finestra, «Decidi più tardi» la lascia lì
    await pg.evaluate(FIRE, 'cesto'); await pg.wait_for_timeout(100)
    for sel in ['#notes', '#notecard']:
        assert await pg.evaluate(FITS, sel), f'{name}: {sel} fuori dallo schermo'
    assert await pg.evaluate("()=>document.querySelector('#notes').getBoundingClientRect().bottom<=document.querySelector('#burger').getBoundingClientRect().top"), f'{name}: notifiche sotto il pulsante Menu'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_notifiche.png'))
    await pg.tap('#notes [data-act=note]')
    assert await pg.query_selector('#modal [data-act=evopt]'), f'{name}: la tessera non apre l\'evento'
    # scenetta in cima all'evento: a 2× sul telefono (o più piccola se lo schermo è stretto), dentro la finestra
    scn = await pg.evaluate("""()=>{const i=document.querySelector('#modal .ev-scn i'), m=document.querySelector('#modal .modal'); if(!i) return null;
      const r=i.getBoundingClientRect(), q=m.getBoundingClientRect(); return {k:i.dataset.scena, w:r.width, h:r.height, in:r.left>=q.left&&r.right<=q.right};}""")
    assert scn and scn['in'] and abs(scn['w'] / scn['h'] - 160 / 72) < 0.02 and (scn['w'] == 320 or w < 400), f'{name}: scenetta dell\'evento {scn}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_evento.png'))
    # iPhone: l'evento lungo resta fuori dalla barra di stato e dalla striscia del tasto Home (bordi finti via CDP)
    cdp = await ctx.new_cdp_session(pg)
    await cdp.send('Emulation.setSafeAreaInsetsOverride', {'insets': {'top': 59, 'bottom': 34}}); await pg.wait_for_timeout(50)
    m = await pg.evaluate("()=>{const r=document.querySelector('#modal .modal').getBoundingClientRect();return {top:r.top,bottom:r.bottom,h:innerHeight};}")
    assert m['top'] >= 59 + 8 and m['bottom'] <= m['h'] - 34, f'{name}: evento sotto la barra di stato del telefono {m}'
    await cdp.send('Emulation.setSafeAreaInsetsOverride', {'insets': {}}); await cdp.detach()
    await pg.tap('#modal [data-act=closemodal]')
    assert await pg.evaluate("()=>window.__FUP.S.notes.some(n=>n.k==='ev')"), f'{name}: evento sparito con «Decidi più tardi»'
    await pg.evaluate("()=>{const F=window.__FUP; ['regolamento','barcode'].forEach(t=>F.S.researched[t]=true); F.ACT.hiremgr({id:'chiara'}); if(!F.S.tenders.some(t=>!t.done)) F.newTender();}")
    # un talento in banchina in crescita: la sua scheda nella finestra Manager deve stare nello schermo
    await pg.evaluate("()=>{const S=window.__FUP.S,w=S.warehouses[0]; S.cresc=[{id:'gt1',name:'Mirko Pozzi',sx:'m',bd:S.day-27*365,face:3,role:'pick',wh:w.id,wn:w.name,k:'op',star:0,men:1,day0:S.day-100,end:S.day+265}];}")
    for wn in ['azienda','riepilogo','magazzini','traffico','clienti','gare','report','personale','manager','giornale','tecnologia','enciclopedia']+(['sindacato'] if ri else []):
        await menu(pg, wn)
        if wn in TABS: await pg.tap(f'#win-{wn} [data-act=wtab][data-id={wn}]')   # dal menu si apre la scheda con un problema: si riparte dalla prima
        assert await pg.evaluate(FITS, f'#win-{wn}'), f'{name}: finestra {wn} esce dallo schermo'
        bad = await pg.evaluate(NOSIDE, f'#win-{wn}')
        assert not bad, f'{name}: finestra {wn}: {bad}'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_{wn}.png'))
        if wn == 'magazzini':   # scelta del manager: i liberi sopra, chi ha già un incarico in grigio sotto
            await pg.evaluate("()=>{const F=window.__FUP; F.ACT.hirecs({id:'rosa'}); F.ACT.hiremgr({id:'toto'}); F.renderAll();}")
            await pg.tap('#win-magazzini [data-act=mpopen][data-k=wh]')
            assert await pg.evaluate(MPORD), f'{name}: scelta del manager, i disponibili devono stare sopra'
            assert 'customer service' in await pg.inner_text('#modal .mp-r.off'), f'{name}: il responsabile del customer service non è in grigio col suo ruolo'
            assert await pg.evaluate(FITS, '#modal .modal'), f'{name}: la scelta del manager esce dallo schermo'
            bad = await pg.evaluate(NOSIDE, '#modal .modal')
            assert not bad, f'{name}: scelta del manager: {bad}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_scelta_manager.png'))
            await pg.tap('#modal [data-act=closemodal]')
        if wn == 'clienti':   # dettagli del primo cliente: trasporti, contratto e inventario fiscale
            await pg.evaluate("()=>{const F=window.__FUP,c=F.S.clients.find(x=>x.status==='attivo'); F.step(); F.UI.cliOpen={[c.id]:true}; F.renderAll();}")
            assert 'Previsione dell' in await pg.inner_text('#win-clienti'), f'{name}: la scheda del cliente non mostra la previsione dell\'inventario'
            bad = await pg.evaluate(NOSIDE, '#win-clienti')
            assert not bad, f'{name}: dettagli del cliente: {bad}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_clienti_dettagli.png'))
        if wn == 'gare':   # scelta del magazzino per la gara
            await pg.tap('#win-gare [data-act=mpopen][data-k=bid]')
            assert await pg.evaluate(FITS, '#modal .modal'), f'{name}: la scelta del magazzino esce dallo schermo'
            bad = await pg.evaluate(NOSIDE, '#modal .modal')
            assert not bad, f'{name}: scelta del magazzino: {bad}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_scelta_magazzino.png'))
            await pg.tap('#modal [data-act=closemodal]')
        if wn == 'manager':   # le altre due schede: candidati con la trattativa e head hunter
            for tb in ['cand', 'hh']:
                await pg.tap(f'#win-manager [data-act=mtab][data-id={tb}]')
                bad = await pg.evaluate(NOSIDE, '#win-manager')
                assert not bad, f'{name}: finestra manager, scheda {tb}: {bad}'
                await pg.evaluate("()=>{const e=document.querySelector('#win-manager .ng'); if(e) e.scrollIntoView({block:'center'});}")
                await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_manager_{tb}.png'))
            await pg.tap('#win-manager [data-act=mtab][data-id=team]')
        if wn == 'sindacato':   # le schede del pacchetto, con un tavolo aperto
            await pg.evaluate("()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0]; ['relsind','talpa','vendor'].forEach(t=>S.researched[t]=true); F.riW(w); F.riUnionize(w); w.ag=60; w.tavCd=0; F.riTavOpen(w); F.hdlTender(w); F.ACT.ritab({id:'clima'});}")
            for tb in ['clima', 'tav', 'ccnl', 'hdl']:
                await pg.tap(f'#win-sindacato [data-act=ritab][data-id={tb}]')
                bad = await pg.evaluate(NOSIDE, '#win-sindacato')
                assert not bad, f'{name}: relazioni industriali, scheda {tb}: {bad}'
                await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_sindacato_{tb}.png'))
            await pg.tap('#win-sindacato [data-act=ritab][data-id=tav]')
            await pg.tap('#win-sindacato [data-act=rireq][data-i="0"][data-v=si]')
            assert await pg.evaluate("window.__FUP.S.warehouses[0].tav.reqs[0].c==='si'"), f'{name}: il pulsante Concedo non funziona'
            await pg.evaluate("()=>{const S=window.__FUP.S; S.warehouses[0].tav=null; S.warehouses[0].ag=20;}")
        if wn == 'tecnologia' and ri:   # col pacchetto Reparto IT e Ingegneria: un consulente e un responsabile, perché la scheda abbia tutto
            await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.cash=Math.max(S.cash,500000); F.ACT.consign({id:'gigabancale',ok:1}); F.ACT.hiremgr({id:'sara'}); F.ACT.setdep({k:'ing'},{value:'sara'}); S.office.it=2; F.renderAll();}")
        if wn == 'tecnologia' and ri:   # finestrella dell'avvio di una tecnologia nel magazzino
            await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.researched.barcode=true; F.ACT.avvopen({id:'barcode',wh:S.warehouses[0].id});}")
            assert await pg.evaluate(FITS, '#modal .modal'), f'{name}: la finestrella dell\'avvio esce dallo schermo'
            bad = await pg.evaluate(NOSIDE, '#modal .modal')
            assert not bad, f'{name}: finestrella dell\'avvio: {bad}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_avvio.png'))
            await pg.tap('#modal [data-act=closemodal]')
        for tb in TABS.get(wn, []) + (['reparti'] if wn == 'tecnologia' and ri else []):   # le altre schede della finestra
            await pg.tap(f'#win-{wn} [data-act=wtab][data-id={tb}]')
            assert await pg.evaluate(FITS, f'#win-{wn}'), f'{name}: finestra {wn}, scheda {tb}, esce dallo schermo'
            bad = await pg.evaluate(NOSIDE, f'#win-{wn}')
            assert not bad, f'{name}: finestra {wn}, scheda {tb}: {bad}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_{tb}.png'))
        await pg.tap(f'#win-{wn} [data-act=close]')
    # progetto di un magazzino da costruire su un terreno (scheda Nuovo magazzino)
    # scheda di un capannone sopra l'elenco: il suo esterno (capannone della sua classe con sopra le sue dotazioni), numeri e dotazioni
    await pg.evaluate("()=>{const F=window.__FUP; F.S.cash=2e6; F.ACT.site({id:'bologna'});}")
    sc = await pg.evaluate('''()=>{const i=document.querySelector('#modal .ev-scn i'); return {img:!!i&&i.dataset.scena.startsWith('est_')&&(i.style.backgroundImage.match(/url\(/g)||[]).length,elenco:!!document.querySelector('#win-magazzini .es-k'),dot:document.querySelectorAll('#modal .dt-r').length};}''')
    assert sc['elenco'] and sc['img'] >= 2 and sc['dot'] == 11, f'{name}: scheda del capannone {sc}'
    assert await pg.evaluate(FITS, '#modal .modal'), f'{name}: la scheda del capannone esce dallo schermo'
    bad = await pg.evaluate(NOSIDE, '#modal .modal')
    assert not bad, f'{name}: scheda del capannone: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_capannone.png'))
    await pg.tap('#modal [data-act=closemodal]')
    await pg.evaluate("()=>{window.__FUP.ACT.edsel({id:'l_vercelli'});}")
    assert await pg.query_selector('#win-magazzini .ed-box'), f'{name}: manca il progetto del nuovo magazzino'
    assert await pg.evaluate(FITS, '#win-magazzini'), f'{name}: il progetto del magazzino esce dallo schermo'
    bad = await pg.evaluate(NOSIDE, '#win-magazzini')
    assert not bad, f'{name}: progetto del magazzino: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_progetto.png'))
    await pg.evaluate("()=>{window.__FUP.ACT.edclose();}")
    await pg.tap('#win-magazzini [data-act=close]')
    # trasloco (0.103): il progetto a passi e il riquadro del capannone vuoto stanno nello schermo del telefono
    await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.cash=3e6; const id=Object.keys(F.SITES).find(k=>F.rentable(k)); F.ACT.rent({id}); window.__nw=S.warehouses.find(w=>w.site===id).id; document.querySelector('#modal').innerHTML=''; F.ACT.openwh({id:S.warehouses[0].id}); F.ACT.tropen({wh:S.warehouses[0].id});}")
    assert await pg.query_selector('#win-magazzini .tr-box [data-act=trgo]'), f'{name}: manca il progetto del trasloco'
    assert await pg.evaluate(FITS, '#win-magazzini'), f'{name}: il progetto del trasloco esce dallo schermo'
    bad = await pg.evaluate(NOSIDE, '#win-magazzini')
    assert not bad, f'{name}: progetto del trasloco: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_trasloco.png'))
    await pg.evaluate("()=>document.querySelector('#win-magazzini [data-act=trgo]').scrollIntoView({block:'center'})")
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_trasloco_conto.png'))
    await pg.evaluate("()=>{const F=window.__FUP; F.ACT.trclose(); F.ACT.openwh({id:window.__nw}); document.querySelector('#win-magazzini [data-act=wvrent]').closest('.card').scrollIntoView({block:'center'});}")
    bad = await pg.evaluate(NOSIDE, '#win-magazzini')
    assert not bad, f'{name}: capannone vuoto: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_capannone_vuoto.png'))
    # capannoni affittati ad altri (0.105): il riquadro della scheda Nuovo magazzino sta nello schermo
    await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=JSON.parse(JSON.stringify(S.warehouses.find(x=>x.id===window.__nw))); S.leases=[{id:'lsT',w,by:'Mobilificio Divanoni',amt:5000,from:S.day,until:S.day+60,bot:null}];
      F.ACT.leases(); document.querySelector('#win-magazzini [data-act=lsback]').closest('.card').scrollIntoView({block:'center'});}''')
    assert await pg.query_selector('#win-magazzini [data-act=lsren]'), f'{name}: manca il rinnovo dell\'affitto'
    bad = await pg.evaluate(NOSIDE, '#win-magazzini')
    assert not bad, f'{name}: capannoni affittati: {bad}'
    await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_affittati.png'))
    await pg.evaluate("()=>{window.__FUP.S.leases=[]; window.__FUP.renderAll();}")
    await pg.tap('#win-magazzini [data-act=close]')
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
        # le cifre in colonna non vanno a capo (ogni numero resta su una riga)
        rotti = await pg.evaluate("""w=>[...document.querySelectorAll(w+' table.num td.r')].filter(td=>{const r=document.createRange();r.selectNodeContents(td);return new Set([...r.getClientRects()].filter(x=>x.width>0).map(x=>Math.round(x.top))).size>1&&!td.textContent.includes('/')}).map(td=>td.textContent)""", f'#win-{wn}')
        assert not rotti, f'{name}: finestra {wn}: numeri a capo {rotti}'
        await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_dato_{wn}.png'), full_page=True)
        if wn == 'cassa':
            # il bot dei tre anni a volte fallisce: per provare il prestito l'azienda torna in piedi
            r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; S.over=false; S.cash=Math.max(S.cash,150000); const c0=S.cash,d0=F.debt(); document.querySelector('#win-cassa [data-act=loantake]').click();
              const l=(S.loans||[])[(S.loans||[]).length-1]; if(!l) return {got:false,d0}; const got=S.cash-c0>=l.amt-1, left=l.left; for(let i=0;i<32;i++){document.querySelector('#modal').innerHTML='';S.cash=Math.max(S.cash,150000);F.step();}
              return {got, paid:l.left<left, d0, d1:F.debt(), over:S.over, day:S.day};}''')
            assert r['got'] and r['paid'], f'{name}: prestito non funziona {r}'
            # al massimo tre prestiti in corso: col terzo aperto la banca non ne concede altri
            r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; S.cash=Math.max(S.cash,150000); S.loans=(S.loans||[]).slice(0,3);
              while(S.loans.length<3) S.loans.push({amt:10000,left:10000,rate:6,n:48,rata:240,day:S.day});
              F.renderAll(); const btn=!!document.querySelector('#win-cassa [data-act=loantake]'); F.UI.sel.loanA=10000; F.ACT.loantake();
              return {n:S.loans.length, btn, lim:F.loanLimit(), txt:document.querySelector('#win-cassa').textContent.includes('3 prestiti in corso, il massimo')};}''')
            assert r == {'n': 3, 'btn': False, 'lim': 0, 'txt': True}, f'{name}: tetto di tre prestiti {r}'
            await pg.screenshot(path=os.path.join(OUT, f'shot_tel_{name}_tre_prestiti.png'), full_page=True)
        await pg.tap(f'#win-{wn} [data-act=close]')
    await ctx.close()

# tutorial della dottoressa Ribalta: si percorre tutto toccando quello che il riquadro giallo indica (o «Avanti»);
# nei passi in cui il tempo scorre il test fa avanzare i giorni più in fretta. Il fumetto resta nello schermo, il tempo resta fermo
# nei passi da leggere, la partita si salva e riparte dal passo giusto, la gara della lezione si vince e alla fine arriva l'attestato.
TUT_ST = """()=>{const F=window.__FUP,S=F.S,L=F.tutSteps(S.tut.id),s=L[S.tut.i]||{};return {i:S.tut.i,n:L.length,done:S.tut.done||0,run:!!s.run,speed:S.speed}}"""
TUT_HI = """()=>{const h=document.querySelector('#tuthi');if(!h||h.hidden)return null;const r=h.getBoundingClientRect();return [r.left+Math.min(r.width/2,26),r.top+Math.min(r.height/2,26)]}"""
async def tutorial(b, errs, mob, tid='base'):
    av = tid == 'avanzato'
    name = ('tel_' if mob else '') + ('tutorial_avanzato' if av else 'tutorial')
    ctx = await (b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True) if mob else b.new_context(viewport={'width': 1440, 'height': 860}))
    await ctx.add_init_script(ANIM_OFF)
    pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(f'{name}: {e}'))
    await pg.goto('file://' + PAGE)
    await (pg.tap if mob else pg.click)('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
    await pg.screenshot(path=os.path.join(OUT, f'shot_{name}_avvio.png'))
    await (pg.tap if mob else pg.click)(f'#start [data-act=tutorial][data-id={tid}]')
    if av:   # la partita avanzata parte da due anni giocati in fretta, con la barra di avanzamento
        await pg.wait_for_selector('#tutprep'); await pg.screenshot(path=os.path.join(OUT, f'shot_{name}_preparazione.png'))
    await pg.wait_for_selector('#tut .tut-b', timeout=60000)
    shots = {0: 'benvenuto', 3: 'direzione', 6: 'trattativa', 10: 'customer', 14: 'audit', 17: 'capannone', 20: 'policy', 23: 'sindacato', 27: 'classifica', 29: 'prestito', 31: 'fine'} if av else \
        {0: 'benvenuto', 6: 'personale', 10: 'offerta', 13: 'ricerca', 20: 'evento', 21: 'risposte', 26: 'report', 29: 'fine'}
    last, seen, held, idle = -1, set(), False, 0
    for _ in range(600):
        st = await pg.evaluate(TUT_ST)
        if st['done']: break
        if st['i'] != last:
            last, idle = st['i'], 0; seen.add(last)
            await pg.wait_for_timeout(150)
            assert await pg.evaluate(FITS, '#tut'), f'{name}: fumetto fuori dallo schermo al passo {last}'
            if last in shots: await pg.screenshot(path=os.path.join(OUT, f'shot_{name}_{last:02d}_{shots[last]}.png'))
            if not st['run'] and not held:
                held = True; assert await pg.evaluate("()=>{const F=window.__FUP; F.ACT.speed({v:'1'}); return F.S.speed}") == 0, f'{name}: il tempo parte in un passo da leggere'
            if last == 12 and not mob and not av:
                # la partita salvata riparte dal passo dov'era
                await pg.evaluate('()=>window.__FUP.save()'); await reload(pg)
                await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
                await pg.click('#start [data-act=continue]'); await pg.wait_for_selector('#tut .tut-b')
                assert await pg.evaluate('()=>window.__FUP.S.tut.i') == 12, f'{name}: dopo il caricamento il tutorial non riparte dal passo giusto'
            continue
        if await pg.evaluate('()=>window.__FUP.S.tut.i') != last: continue
        nx = await pg.query_selector('#tut [data-act=tutnext]')
        if nx and await nx.is_visible():
            await (nx.tap() if mob else nx.click()); await pg.wait_for_timeout(80); continue
        if st['run'] and st['speed'] > 0:   # tempo che scorre: un giorno in più a ogni giro
            await pg.evaluate("()=>{const F=window.__FUP; if(F.S.speed>0){F.step(); F.renderAll();}}")
        hi = await pg.evaluate(TUT_HI)
        if hi and idle % 5 == 0:
            if mob: await pg.touchscreen.tap(hi[0], hi[1])
            else: await pg.mouse.click(hi[0], hi[1])
        idle += 1; assert idle < 120, f'{name}: tutorial fermo al passo {last}'
        await pg.wait_for_timeout(150)
    await pg.wait_for_selector('#modal .attest')
    await pg.screenshot(path=os.path.join(OUT, f'shot_{name}_attestato.png'))
    if av:
        # due anni dopo: tre magazzini, un avversario, il pacchetto; e le scelte delle lezioni fatte davvero
        r = await pg.evaluate("""()=>{const F=window.__FUP,S=F.S,w=S.warehouses.find(x=>x.id===S.tut.cw);
          return {done:S.tut.done, anno:new Date(Date.UTC(2002,0,1)+S.day*864e5).getUTCFullYear(), wh:S.warehouses.length, riv:S.bots.length, ri:!!S.cfg.ri,
            dir:Object.values(S.dirs).some(Boolean), cs:!!S.cs.resp, tratta:!!S.tut.ng, audit:!w||!!w.tech.haccp, dot:S.warehouses.some(x=>x.build&&x.build.k==='dot'),
            pol:F.POLICIES.some(P=>!!(S.pol[P.id]&&S.pol[P.id].on)!==!!S.tut.pol0[P.id]), ev:S.nextEvent<1e8, gare:S.tNext<1e8}}""")
        assert len(seen) >= st['n'] - 3 and r == {'done': 1, 'anno': 2004, 'wh': 3, 'riv': 1, 'ri': True, 'dir': True, 'cs': True, 'tratta': True, 'audit': True, 'dot': True, 'pol': True, 'ev': True, 'gare': True}, (sorted(set(range(st['n'])) - seen), r)
        await (pg.tap if mob else pg.click)('#modal [data-act=closemodal]')
        await ctx.close(); return
    r = await pg.evaluate("""()=>{const F=window.__FUP,S=F.S,g=S.tenders.find(t=>t.tut);
      return {done:S.tut.done, vinta:!!g&&S.clients.some(c=>c.name===g.name), fm:S.warehouses[0].staff.fm+S.queue.filter(q=>q.role==='fm').length,
        ricerca:!!S.project||!!S.researched.barcode, ev:S.nextEvent<1e8, gare:S.tNext<1e8}}""")
    assert len(seen) == st['n'] and r == {'done': 1, 'vinta': True, 'fm': 1, 'ricerca': True, 'ev': True, 'gare': True}, (sorted(set(range(st['n'])) - seen), r)
    await (pg.tap if mob else pg.click)('#modal [data-act=closemodal]')
    assert await pg.evaluate("()=>!document.querySelector('#tut').innerHTML&&document.querySelector('#tuthi').hidden"), f'{name}: fumetto rimasto dopo la fine'
    if not mob:
        # saltare il tutorial (con conferma): la partita continua normale
        await pg.evaluate('()=>window.__FUP.ACT.quitgame()'); await pg.click('#start [data-act=tutorial]'); await pg.wait_for_selector('#tut .tut-b')
        await pg.click('#tut [data-act=tutskip]'); await pg.click('#modal [data-act=okgo]')
        r = await pg.evaluate("()=>{const S=window.__FUP.S;return {done:S.tut.done,ev:S.nextEvent<1e8,tut:!!document.querySelector('#tut').innerHTML}}")
        assert r == {'done': 2, 'ev': True, 'tut': False}, r
    await ctx.close()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errs = []
        await tutorial(b, errs, False)
        await tutorial(b, errs, True)
        await tutorial(b, errs, False, 'avanzato')
        await tutorial(b, errs, True, 'avanzato')
        await phone(b, 390, 844, 'verticale', errs)
        await phone(b, 844, 390, 'orizzontale', errs)
        # «riduci movimento» nel sistema: finché non si sceglie nelle Opzioni, le animazioni partono spente
        rc = await b.new_context(viewport={'width': 1440, 'height': 860}, reduced_motion='reduce'); rp = await rc.new_page(); await rp.goto('file://' + PAGE)
        assert not await rp.evaluate("document.documentElement.classList.contains('anim')"), 'con «riduci movimento» le animazioni devono partire spente'
        await rc.close()
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
        await pg.click('[data-act=stnext]')
        assert await pg.evaluate("document.querySelectorAll('#start .pk').length") == 3, 'passo Pacchetti: gioco base più le due espansioni'
        await pg.screenshot(path=os.path.join(OUT, 'shot_crea_8_pacchetti.png'), full_page=True)
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
        # menu (0.69): 4 gruppi; su uno schermo grande parte largo, il pulsante in cima lo riduce a icone e la scelta resta
        m = await pg.evaluate("()=>{const d=document.querySelector('#dock'); return {wide:d.classList.contains('wide'), g:d.querySelectorAll('.dg').length, fit:d.getBoundingClientRect().bottom<=innerHeight, rows:[...d.querySelectorAll('[data-act=toggle] .dl small')].length};}")
        assert m['wide'] and m['g'] == 4 and m['fit'] and m['rows'] >= 10, f'menu largo: {m}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_menu_largo.png'))
        await pg.click('#dock [data-act=dockw]')
        m = await pg.evaluate("()=>({wide:document.querySelector('#dock').classList.contains('wide'), ls:localStorage.getItem('fup-menu-largo'), w:document.querySelector('#dock').offsetWidth})")
        assert not m['wide'] and m['ls'] == '0' and m['w'] < 80, f'menu a icone: {m}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_menu_icone.png'))
        await pg.click('#dock [data-act=dockw]')
        # animazioni (0.100): accese di base; la finestra entra animata e, chiusa, esce subito dal gioco
        # (la copia che svanisce non ha il suo id né pulsanti e se ne va da sola); dalle Opzioni si spengono per questo dispositivo
        WINANIM = '''()=>{const F=window.__FUP; if(document.querySelector('#win-gare')) F.ACT.toggle({id:'gare'}); document.querySelector('#ghosts').innerHTML='';
          F.ACT.toggle({id:'gare'}); const w=document.querySelector('#win-gare'), o={inn:w.classList.contains('w-in')}; w.querySelector('[data-act=close]').click();
          const g=document.querySelector('#ghosts>.win'); o.gone=!document.querySelector('#win-gare'); o.ghost=!!g&&g.inert&&!g.id&&!g.querySelector('[data-act]'); return o;}'''
        a = await pg.evaluate(WINANIM); await pg.wait_for_timeout(250)
        a['vuoto'] = await pg.evaluate("document.querySelector('#ghosts').children.length===0")
        assert await pg.evaluate("document.documentElement.classList.contains('anim')") and a == {'inn': True, 'gone': True, 'ghost': True, 'vuoto': True}, f'animazioni delle finestre {a}'
        await pg.click('#top [data-act=options]')
        assert await pg.evaluate("document.querySelector('#modal .ovl').classList.contains('m-in')"), 'la finestrella delle Opzioni non entra animata'
        await pg.click('#modal [data-act=animset]')
        a = await pg.evaluate("()=>({anim:document.documentElement.classList.contains('anim'), ls:localStorage.getItem('fup-animazioni')})")
        await pg.click('#modal [data-act=closemodal]')
        a['ovl'] = await pg.evaluate("document.querySelectorAll('body>.ovl').length")
        a.update(await pg.evaluate(WINANIM))
        assert a == {'anim': False, 'ls': '0', 'ovl': 0, 'inn': False, 'gone': True, 'ghost': False}, f'animazioni spente dalle Opzioni {a}'
        await pg.click('#top [data-act=options]'); await pg.click('#modal [data-act=animset]'); await pg.click('#modal [data-act=closemodal]')
        assert await pg.evaluate("document.documentElement.classList.contains('anim')&&localStorage.getItem('fup-animazioni')==='1'"), 'animazioni non riaccese'
        await pg.wait_for_timeout(250)
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
        for w in ['azienda','magazzini','traffico','clienti','gare','report','personale','manager','giornale','classifica','tecnologia']:
            await pg.click(f'#dock [data-id={w}]')
            for t in TABS.get(w, []) + ([w] if w in TABS else []):   # ogni scheda, poi di nuovo la prima
                await pg.click(f'#win-{w} [data-act=wtab][data-id={t}]')
                assert await pg.evaluate(FITS, f'#win-{w}'), f'finestra {w}, scheda {t}, esce dal fondo dello schermo'
            assert await pg.evaluate(FITS, f'#win-{w}'), f'finestra {w} esce dal fondo dello schermo'
            if w == 'classifica':
                assert await pg.eval_on_selector_all('#win-classifica .cls', 'e=>e.length') == 3, 'classifica senza le 3 aziende'
                await pg.screenshot(path=os.path.join(OUT, 'shot_classifica.png'))
        for t in ['log','org','mkt','wel','cert']:
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
        # certificazioni: una gara alimentare chiede l'HACCP nel magazzino scelto; audit di due settimane, poi si può fare l'offerta
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0]; S.researched.haccp=true; delete w.tech.haccp; delete w.tech.freddo;
          const tpl=F.TENDER_POOL.find(t=>t.name==='Riseria La Mondina'), ci=F.CINFO[tpl.name], t={...tpl,zone:ci.zones[0],src:ci.src,mode:ci.mode,dur:24};
          const a=F.bidEstimate(t,w.id,1).certW.length, c0=S.cash; F.ACT.install({id:'haccp',wh:w.id}); const paid=c0-S.cash, b=F.bidEstimate(t,w.id,1).certW.length;
          F.ACT.install({id:'freddo',wh:w.id}); const fr0=!!w.tech.freddo; F.certAudit(w,F.TECH.find(x=>x.id==='haccp'),'init',50); const c=F.bidEstimate(t,w.id,1).certW.length;
          F.ACT.opencert({tab:'mag'}); return {a,b,c,paid,fr0,ok:F.certOk(w,'haccp'),win:!!document.querySelector('#win-tecnologia .ce-w')};}''')
        assert r['a'] == 1 and r['b'] == 1 and r['c'] == 0 and r['ok'] and r['paid'] == 3000 and r['win'], f'HACCP nel magazzino: {r}'
        # audit (0.68): rilievi e azione correttiva, sospensione (il cliente se ne accorge, la gara si chiude), audit straordinario
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0],T=F.TECH.find(x=>x.id==='haccp'),it=w.tech.haccp,o={};
          const C=F.confOf(w).v; o.conf=C>=0&&C<=100; o.exp0=it.exp;
          F.certAudit(w,T,'year',50-C); o.nc=F.certState(w,T)==='nc'&&F.certOk(w,'haccp');
          const c0=S.cash; F.ACT.certact({k:'fix',id:'haccp',wh:w.id}); o.fix=it.nc===null&&c0-S.cash===1500;
          F.certAudit(w,T,'year',-500); o.susp=F.certState(w,T)==='susp'&&!F.certOk(w,'haccp');
          const tpl=F.TENDER_POOL.find(t=>t.name==='Riseria La Mondina'), ci=F.CINFO[tpl.name]; o.gara=F.bidEstimate({...tpl,zone:ci.zones[0],src:ci.src,mode:ci.mode,dur:24},w.id,1).certW.length===1;
          F.ACT.certact({k:'extra',id:'haccp',wh:w.id}); o.pend=it.pend===S.day+14;
          F.certAudit(w,T,'extra',50); o.back=F.certOk(w,'haccp')&&it.exp===o.exp0&&it.pend===null;
          F.certAudit(w,T,'year',50-C); return o;}''')
        assert all(r.values()), f'audit delle certificazioni: {r}'
        # fasi 3 e 4 (0.69): certificazioni nuove, nuova linea di un cliente, ufficio qualità e audit interno, eventi a tema, ispezioni
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0],o={},err=[];
          o.tech=['gdp','adr','banchina','aeo','doganale','iso14001','iso45001','parita'].every(id=>F.TECH.some(x=>x.id===id&&x.tree==='cert'));
          const c={...S.clients[0],id:'cl1',name:'Spedizioni Tricolore',req:[],line:null,lineDone:0,grace:null,wh:w.id,status:'attivo',pal:400,stock:300,sat:60}; S.clients.push(c);
          o.lf=!!F.lineFor(c); F.lineStart(c,S.day+10,0); o.req=c.req.includes('adr')&&F.certMiss(c).length===0;
          S.researched.adr=true; w.tech.adr={day:S.day-20}; F.certAudit(w,F.TECH.find(x=>x.id==='adr'),'init',50); c.line.due=S.day;
          const p0=c.pal; F.lineDaily(c); o.line=c.pal>p0&&!c.line&&c.lineDone===1;
          const c0=F.confOf(w).v; F.ACT.qualhire(); const c1=F.confOf(w).v; F.ACT.iaudit({wh:w.id}); const c2=F.confOf(w).v; o.qual=c1>c0&&c2>c1&&S.qual.n===1;
          let ran=0; ['isp_asl','isp_nas','isp_lavoro','aud_registro','aud_muletto','aud_buyer'].forEach(id=>{ const b=F.EVENTS.find(e=>e.id===id); if(!b){err.push(id);return;}
            try{ if(!b.cond()) return; b.opts.forEach(op=>{ const ev={...b}; if(b.setup) b.setup(ev); if(!op.req||op.req()) op.f.call(ev); }); ran++; }catch(e){err.push(id+': '+e.message);} });
          o.ev=!err.length; o.ran=ran>0;
          const w2=S.warehouses[0]; w2.tech.haccp=w2.tech.haccp||{day:0}; Object.assign(w2.tech.haccp,{iss:S.day,exp:S.day+900,next:S.day+300,nc:null,susp:null,pend:null});
          const k0=S.cash; F.ispezione(w2,'haccp',200,'ASL',2000,6000); o.isp=S.cash===k0;
          F.ispezione(w2,'haccp',-300,'ASL',2000,6000); o.multa=S.cash<k0&&!F.certOk(w2,'haccp');
          S.clients=S.clients.filter(x=>x.id!=='cl1'); o.err=err.join(' | ')||true; return o;}''')
        assert all(r.values()) and r['err'] is True, f'certificazioni, fasi 3 e 4: {r}'
        await pg.evaluate(CLEAR)
        await pg.screenshot(path=os.path.join(OUT, 'shot_certificazioni.png'))
        await pg.click('#win-tecnologia [data-act=ctab][data-id=az]')
        await pg.screenshot(path=os.path.join(OUT, 'shot_certificazioni_azienda.png'))
        await pg.click('#win-tecnologia [data-act=close]')
        await win(pg, 'direzione')
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; F.ACT.hiremgr({id:'ottavio'}); const o=S.managers.find(m=>m.id==='ottavio'); S.warehouses.forEach(w=>{if(w.mgr==='ottavio')w.mgr=null;}); o.wh=null;}")
        await win(pg, 'direzione')
        await pg.click('#win-manager [data-act=mpopen][data-k=dir][data-id=fin]')
        assert await pg.evaluate(MPORD), 'scelta del manager: i disponibili devono stare sopra quelli già impegnati'
        await pg.screenshot(path=os.path.join(OUT, 'shot_scelta_direttore.png'))
        await pg.click('#modal [data-act=mpick][data-v=ottavio]')
        assert not await pg.query_selector('#modal .mp'), 'la finestrella di scelta resta aperta'
        await pg.screenshot(path=os.path.join(OUT, 'shot_direzione.png'))
        # nel magazzino il nuovo direttore finanziario è in grigio, col suo ruolo
        await win(pg, 'magazzini')
        await pg.click('#win-magazzini [data-act=mpopen][data-k=wh]')
        assert 'Direttore finanziario' in await pg.inner_text('#modal .mp-r.off'), 'nella scelta del manager il direttore non è in grigio col suo ruolo'
        assert not await pg.query_selector('#modal [data-act=mpick][data-v=ottavio]'), 'un direttore si può scegliere come manager di magazzino'
        assert await pg.evaluate(MPORD), 'scelta del manager: i disponibili devono stare sopra quelli già impegnati'
        await pg.screenshot(path=os.path.join(OUT, 'shot_scelta_manager.png'))
        await pg.click('#modal [data-act=closemodal]')
        await win(pg, 'customer')
        await pg.click('#win-clienti [data-act=mpopen][data-k=cs]')
        assert await pg.evaluate(MPORD), 'scelta del responsabile: i disponibili devono stare sopra quelli già impegnati'
        await pg.screenshot(path=os.path.join(OUT, 'shot_scelta_cs.png'))
        await pg.click('#modal [data-act=closemodal]')
        await win(pg, 'direzione')
        st = await pg.evaluate('()=>({barcode:!!window.__FUP.S.warehouses[0].tech.barcode, fin:window.__FUP.S.dirs.fin})')
        assert st['barcode'] and st['fin'] == 'ottavio', st
        # policy: accensione, attesa di 90 giorni, pretese dei manager, ultimatum con aumento e dimissioni
        await pg.evaluate(CLEAR)
        await pg.evaluate("()=>{const S=window.__FUP.S; ['regolamento','barcode','hr'].forEach(t=>S.researched[t]=true);}")
        await win(pg, 'policy')
        await pg.click('#win-azienda [data-act=poltog][data-id=zerostra]')
        assert not await pg.evaluate("()=>window.__FUP.polOn('zerostra')"), 'la policy deve aspettare la conferma'
        await pg.click('#modal [data-act=okgo]')
        assert await pg.evaluate("()=>window.__FUP.polOn('zerostra')"), 'zero straordinario non acceso'
        assert await pg.eval_on_selector('#win-azienda [data-act=poltog][data-id=zerostra]', 'e=>e.disabled'), 'la policy si può cambiare subito'
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; F.ACT.hiremgr({id:'davide'}); F.ACT.hiremgr({id:'rosa'});
          const d=S.managers.find(x=>x.id==='davide'), r0=d.ral; let ult=0;
          for(let i=0;i<40;i++){ F.step(); const n=S.notes.find(x=>x.k==='ev'); if(n) F.ACT.note({id:n.id}); const m=document.querySelector('#modal');
            if(n&&n.title.includes('minaccia')){ ult++; m.querySelectorAll('[data-act=evopt]')[1].click(); } else if(m.innerHTML){const c=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(c) c.click();} }
          const rosa=S.managers.find(x=>x.id==='rosa');
          return {ult, tol:!!(d.tol||{}).zerostra, raise:d.ral>r0, g:F.grievances(d).length, rosa:F.grievances(rosa).map(x=>x.id)};}''')
        assert r['ult'] >= 1 and r['tol'] and r['raise'] and r['g'] == 0, r
        await win(pg, 'policy')
        await pg.screenshot(path=os.path.join(OUT, 'shot_policy.png'))
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.ACT.hiremgr({id:'chiara'}); const c=S.managers.find(x=>x.id==='chiara'); c.unh=29;
          F.step(); const n=S.notes.find(x=>x.k==='ev'); if(n) F.ACT.note({id:n.id}); const m=document.querySelector('#modal'); const ok=!!n&&m.textContent.includes('minaccia'); m.querySelectorAll('[data-act=evopt]')[2].click();
          for(let i=0;i<31;i++){ F.step(); document.querySelector('#modal').innerHTML=''; } return {ok, hired:c.hired};}''')
        assert r['ok'] and not r['hired'], f'dimissioni dopo il preavviso: {r}'
        # ricerca dei manager: candidature spontanee, trattativa (firma, controproposta, offesa), head hunter, preavviso e controfferta
        r = await pg.evaluate("""()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.newGame('gino'); const S=F.S, out={}; S.nextEvent=1e9;
          const clr=()=>{document.querySelector('#modal').innerHTML='';};
          const B=F.mktList(); out.board=B.length; out.low=B.every(p=>p.gen&&p.face!=null&&['F','D','C'].includes(F.mRank(p))&&p.ral>=25000&&p.ral<=60000);
          // offerta generosa: firma e arriva dopo una settimana
          const a=B[0]; a.mn=0.9; F.negOffer(a.id,F.needOf(a)*1.02); for(let i=0;i<8&&!S.managers.some(m=>m.id===a.id);i++){clr(); F.step();}
          const qa=S.managers.find(m=>m.id===a.id); out.sign=!!qa&&qa.arr!=null&&!F.mktList().some(p=>p.id===a.id)&&F.mktList().length===3;
          for(let i=0;i<8;i++){clr(); F.step();} out.arrived=!!qa&&qa.hired&&qa.arr==null;
          // offerta un po' bassa: controproposta, poi la accetti
          const b=F.mktList()[0]; b.mn=0.9; F.negOffer(b.id,F.needOf(b)*0.93); for(let i=0;i<8&&!(S.negs[b.id]&&S.negs[b.id].counter);i++){clr(); F.step();}
          const nb=S.negs[b.id]; out.counter=!!nb&&nb.counter>=F.needOf(b); out.alert=F.S.notes.some(n=>n.title.includes('controproposta'));
          F.ACT.toggle({id:'manager'}); F.ACT.mtab({id:'cand'}); out.okBtn=!!document.querySelector('#win-manager [data-act=negok]');
          F.ACT.negok({id:b.id}); out.signB=S.managers.some(m=>m.id===b.id&&m.arr!=null);
          // offerta ridicola: si offende e sparisce
          const c=F.mktList()[0]; c.mn=0.9; F.negOffer(c.id,F.needOf(c)*0.6); for(let i=0;i<8&&S.negs[c.id];i++){clr(); F.step();} out.off=!F.mktList().some(p=>p.id===c.id)&&!S.managers.some(m=>m.id===c.id);
          // head hunter: metà parcella subito, tre profili con l'abilità chiesta
          S.cash=400000; const fee=F.hhFee(16), h=F.hhStart('prec',16); out.paid=Math.abs(S.cash-(400000-Math.round(fee/2/500)*500))<1; out.second=F.hhStart('op',10)===null;
          for(let i=0;i<120&&S.hh.length;i++){clr(); F.step();} const cs=S.cands.map(x=>x.p||S.managers.find(m=>m.id===x.ref));
          out.found=cs.length===3&&cs.every(p=>p.st.prec>=16); out.hhNote=S.notes.some(n=>n.title.includes('tre profili'));
          // firma tramite head hunter con controfferta: si lascia andare e il posto resta vuoto
          const R0=Math.random; Math.random=()=>0.05; const x=F.candById(cs[0].id), q=F.signCand(x.p,x.p.ral,x); Math.random=R0;
          out.pre=q.arr-S.day===F.MGR.arr[F.mRank(q)]&&q.cof!=null&&S.cands.length===2;
          let ev=null; for(let i=0;i<60&&!ev;i++){ F.step(); ev=S.notes.find(n=>n.k==='ev'&&n.ev.id==='controfferta'); if(!ev) clr(); }
          out.cof=!!ev; if(ev){ F.ACT.note({id:ev.id}); const bt=document.querySelectorAll('#modal [data-act=evopt]'); bt[2].click(); for(let i=0;i<3;i++){clr(); F.step();} }
          out.gone=!S.managers.some(m=>m.id===q.id&&(m.hired||m.arr!=null));
          F.ACT.mtab({id:'hh'}); out.hhTab=!!document.querySelector('#win-manager [data-act=hhgo]');
          return out;}""")
        assert all(r.values()), f'ricerca dei manager: {r}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_manager_hh.png'))
        await pg.evaluate("()=>window.__FUP.ACT.mtab({id:'cand'})")
        await pg.screenshot(path=os.path.join(OUT, 'shot_manager_candidati.png'))
        await pg.evaluate("()=>window.__FUP.ACT.mtab({id:'team'})")
        await pg.screenshot(path=os.path.join(OUT, 'shot_manager_squadra.png'))
        await pg.evaluate("()=>document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click())")
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
        # chi è in arrivo: una barretta per persona sotto il reparto e nelle assunzioni in corso, che si riempie fino all'arrivo
        q = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0],q0=S.queue; S.queue=[{role:'pick',wh:w.id,days:5,tot:20},{role:'plan',wh:null,days:9}]; F.renderAll();
          const W=s=>[...document.querySelectorAll('#win-personale '+s)].map(i=>i.style.width), r={row:W('.pr-in .qbs .bar i'),card:W('.pr-q .pr-n .bar i')};
          S.queue=q0; F.renderAll(); return r;}''')
        assert q['row'] == ['75%'] and q['card'][0] == '75%' and len(q['card']) == 2, f'barrette delle assunzioni in arrivo: {q}'
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
        # immobile (0.92): classe, dotazioni, lavori, guasti, ristrutturazione e costruzione da zero
        im = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0],o={};
          o.cl=!!F.WCLASS[w.cl]; w.build=null; S.cash+=2e6; const p0=F.computeWH(w).prod;
          F.renderAll(); const b=document.querySelector('#win-magazzini [data-act=dotbuild]:not([disabled])'), di=b&&b.dataset.id; b.click(); o.cant=!!w.build&&w.build.k==='dot'&&w.build.id===di;
          w.build.left=1; F.stepOne(); o.dot=!!w.dot[di];
          F.koStart(w,'ricarica'); const kx=w.ko.ricarica, p1=F.computeWH(w).prod; delete w.ko.ricarica; const p2=F.computeWH(w).prod; w.ko.ricarica=kx; o.ko=p1<p2*0.95&&p0>0; o.ev=S.notes.some(n=>n.k==='ev'&&n.ev.id==='guasto');
          F.renderAll(); document.querySelector('#win-magazzini [data-act=koripara][data-id=ricarica]').click(); o.rip=w.ko.ricarica.fine>S.day;
          w.ko.ricarica.fine=S.day+1; F.stepOne(); F.stepOne(); o.fixed=!w.ko.ricarica;
          F.fuocoStart(w); o.fuoco=S.notes.some(n=>n.k==='ev'&&n.ev.id==='incendio');
          w.cl='vec'; F.ACT.rist({wh:w.id,ok:1}); o.rist=!!w.build&&w.build.k==='rist'&&w.build.to==='std'; w.build.left=1; F.stepOne(); o.std=w.cl==='std';
          o.taken=!F.siteOpen(w.site)&&!F.rentable('l_casale')&&F.siteOpen('landriano')&&!F.rentable('landriano')&&!F.edilCls().includes('inn');   // innovativi: solo col pacchetto Reparto IT e Ingegneria
          F.ACT.site({id:'l_casale'}); o.lotto=!!document.querySelector('#modal .sc [data-act=edsel]'); document.querySelector('#modal [data-act=edsel]').click(); o.box=!!document.querySelector('#win-magazzini .ed-box')&&!document.querySelector('#modal').innerHTML;
          F.ACT.edgo({ok:1}); o.cantiere=S.cantieri.length===1&&!F.siteOpen('l_casale');
          S.cantieri[0].left=1; F.stepOne(); const n=S.warehouses.find(x=>x.site==='l_casale'); o.nuovo=!!n&&n.own&&n.cl==='mod'&&!!n.dot.ribalte&&n.cap===3000;
          F.ACT.openwh({id:w.id}); F.renderAll(); return o;}''')
        assert all(im.values()), f'immobile: {im}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_magazzino_dotazioni.png'))
        # elenco dei capannoni a schede e scheda con l'immagine; «Affitta» dalla scheda la chiude e apre il magazzino
        await pg.evaluate("()=>{window.__FUP.ACT.openwh({id:window.__FUP.S.warehouses[0].id}); window.__FUP.ACT.site({id:'castelsg'});}")
        assert await pg.query_selector('#modal .ev-scn'), 'Castel San Giovanni deve esserci da subito (niente anni d\'attesa)'
        await pg.evaluate("()=>{document.querySelector('#modal').innerHTML=''; window.__FUP.ACT.site({id:'orio'});}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_capannone.png'))
        assert await pg.evaluate("()=>{const i=document.querySelector('#modal .ev-scn i'); return !!i&&i.dataset.scena.startsWith('est_')&&i.dataset.el.includes('el_muletti');}"), 'scheda del capannone senza il suo esterno'
        ca = await pg.evaluate('''()=>{const F=window.__FUP,n=F.S.warehouses.length; document.querySelector('#modal [data-act=rent]').click();
          return {n:F.S.warehouses.length-n,chiusa:!document.querySelector('#modal').innerHTML,orio:F.S.warehouses.some(w=>w.site==='orio'&&w.cl==='mod'&&!!w.dot.sprinkler)};}''')
        assert all(ca.values()) and ca['n'] == 1, f'affitto dalla scheda: {ca}'
        await pg.evaluate("()=>{window.__FUP.ACT.wtab({p:'magazzini',id:'espansione'});}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_espansione.png'))
        await pg.evaluate("()=>{const F=window.__FUP; F.ACT.wtab({p:'magazzini',id:'magazzini'}); F.ACT.openwh({id:F.S.warehouses[0].id});}")
        await pg.evaluate(CLEAR)
        await pg.click('#win-magazzini [data-act=coop]')
        assert not await pg.evaluate('()=>window.__FUP.S.warehouses[0].coop'), 'la cooperativa deve aspettare la conferma'
        assert 'Conferma' in await pg.inner_text('#modal'), 'manca la conferma della cooperativa'
        await pg.screenshot(path=os.path.join(OUT, 'shot_conferma.png'))
        await pg.click('#modal [data-act=okgo]')
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
          delete S.boss; delete S.alumni; const EX=['ottavio','giulia','roberto']; S.execs=S.managers.filter(m=>EX.includes(m.id)).map(e=>{const x={...e}; delete x.bd; delete x.log; return x;}); S.execs[0].hired=true;
          S.managers=S.managers.filter(m=>!EX.includes(m.id)).map(m=>{const x={...m}; delete x.bd; delete x.log; delete x.ann; return x;}); delete S.hh; delete S.cands; delete S.negs; delete S.mkt;
          delete S.certMig; S.researched.freddo=true; delete S.researched.haccp; delete w.tech.haccp; delete w.tech.freddo;
          F.save(); return true;}''')
        await reload(pg); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached'); await pg.wait_for_selector('[data-act=continue]')
        await pg.click('[data-act=continue]'); await pg.evaluate(CLEAR)
        st = await pg.evaluate('''()=>{const S=window.__FUP.S;return {st:S.warehouses[0].staff,imp:S.imp,q:S.queue.map(q=>q.role+String.fromCharCode(58)+!!q.wh)}}''')
        assert st['imp'] is None and sum(st['st'].values()) == 8+3 and st['st']['autB'] > 0, st
        assert st['q'] == ['imp:true', 'autCE:true'], st
        assert await pg.evaluate('()=>window.__FUP.S.office.plan===0 && window.__FUP.S.warehouses[0].coop===false')
        # certificazioni (0.67-0.68): chi aveva la Catena del freddo la ritrova nei magazzini, valida, con l'HACCP; un cliente alimentare porta l'HACCP nel suo magazzino
        ce = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0];
          const o=JSON.parse(JSON.stringify(S)); delete o.certMig; o.researched={}; o.warehouses.forEach(x=>{delete x.tech.haccp;}); F.fillSave(o);
          return {fr:!!w.tech.freddo&&F.certOk(w,'freddo'),ha:!!w.tech.haccp&&!!S.researched.haccp,cli:!!o.researched.haccp&&!!o.warehouses[0].tech.haccp&&!o.researched.freddo};}''')
        assert ce['fr'] and ce['ha'] and ce['cli'], f'conversione delle certificazioni: {ce}'
        st = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S;return {boss:S.boss.name,age:F.ageOf(S.boss),m:S.managers.length,bd:F.people().every(p=>p.bd!=null&&Array.isArray(p.log)),
          ex:S.execs.length,ott:(S.managers.find(m=>m.id==='ottavio')||{}).hired,hh:Array.isArray(S.hh)&&Array.isArray(S.cands)&&!!S.negs,board:F.mktList().length}}''')
        assert st['boss'] == 'Marco Pellegrino' and st['age'] == 36 and st['m'] >= 23 and st['bd'], st
        assert st['ex'] == 0 and st['ott'] and st['hh'] and st['board'] == 3, f'dirigenti convertiti in manager: {st}'
        st = await pg.evaluate('''()=>{const F=window.__FUP,o={}; ['gino','marco','edoardo','valeria'].forEach(c=>{F.newGame(c); o[c]=F.certOk(F.S.warehouses[0],'haccp');}); return o;}''')
        assert st == {'gino': True, 'marco': True, 'edoardo': False, 'valeria': False}, f'HACCP alla partenza: {st}'
        # eventi dei talenti: ognuno compare con il suo talento e tutte le scelte funzionano
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame(null,F.ccCeo(Object.assign(F.ccNew(),{nome:'Prova',cognome:'Eventi',edu:'Autodidatta'})));
          const S=F.S,evs=F.EVENTS.filter(e=>e.id.startsWith('t_')),bad=[];S.boss.tal=[];
          evs.forEach(e=>{const nm=(e.cond.toString().match(/(?:hasTal|csHas)[(]'(.+?)'[)]/)||[])[1];if(!nm||!F.TALENTS[nm.replace(/\\\\/g,'')])bad.push(e.id+': talento?');});
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
        # scenette degli eventi: ogni evento ne ha una che esiste, ogni striscia è 16 fotogrammi da 160x72
        r = await pg.evaluate('''async()=>{const F=window.__FUP,bad=[],ids=F.EVENTS.map(e=>e.id);
          F.EVENTS.forEach(e=>{const k=F.SCN_EV[e.id]||F.SCN_SRC[e.src]; if(!k||!F.SCENE[k]) bad.push(e.id+': scena '+k);});
          Object.keys(F.SCN_EV).forEach(id=>{if(!ids.includes(id)) bad.push('SCN_EV: evento '+id+' inesistente');});
          [...Object.values(F.SCN_EV),...Object.values(F.SCN_SRC)].forEach(k=>{if(!F.SCENE[k]) bad.push('scena mancante: '+k);});
          for(const [k,src] of Object.entries(F.SCENE)){const im=new Image(); im.src=src; await im.decode(); if(im.naturalWidth!==(/^(est|el)_/.test(k)?2304:2560)||im.naturalHeight!==72) bad.push(k+': '+im.naturalWidth+'x'+im.naturalHeight);}
          return {bad,n:Object.keys(F.SCENE).length};}''')
        assert not r['bad'] and r['n'] >= 38, r
        # scene in cima alle finestre: Magazzini, Tecnologia, Customer service, Direzione, Azienda e CEO (3× nelle finestre larghe, 2× nelle strette);
        # la Tecnologia è ferma senza ricerca e si muove con una ricerca in corso
        r = await pg.evaluate('''()=>{const F=window.__FUP,out={},P={magazzini:'magazzini',personale:'personale',tecnologia:'tecnologia',reparti:'tecnologia',customer:'clienti',direzione:'manager',azienda:'azienda'};F.newGame('marco',null,{mode:'classica',win:{},it:true});F.S.researched.direzione=true;
          const apri=tab=>{document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.ACT.toggle({id:P[tab]}); F.ACT.wtab({p:P[tab],id:tab}); return document.querySelector('#wins .win .ev-scn');};
          for(const [tab,w] of Object.entries(F.WSCN)){let k=typeof w==='function'?w():w; k=k.k||k; const d=apri(tab), i=d&&d.querySelector('i'); out[tab]=!!i&&i.dataset.scena===k&&i.offsetWidth===(['customer','personale'].includes(tab)?320:tab==='magazzini'?432:480);}   // offsetWidth: la misura vera, anche mentre la finestra si apre con lo zoom
          // esterni dei magazzini: il capannone segue la classe dell'edificio (celle frigo: quello frigorifero), sopra le dotazioni dell'area esterna
          const w=F.S.warehouses[0], tipi=['fatiscente','vecchio','standard','moderno','innovativo','freddo'], s0={cl:w.cl,dot:w.dot,tech:w.tech,build:w.build};
          out.est12=tipi.every(t=>F.SCENE['est_'+t+'1']&&F.SCENE['est_'+t+'2'])&&!!F.SCENE.est_lotto&&!!F.SCENE.est_costruzione; out.el=F.EST_EL.every(([n])=>F.SCENE['el_'+n]);
          out.su=F.EST_SU.every(([,p])=>Object.keys(F.SCENE).some(k=>k.startsWith('el_'+p+'_')));
          Object.assign(w,{cl:'fat',dot:{},tech:{},build:null}); out.fat=F.estScena(w).k.startsWith('est_fatiscente');
          w.cl='std'; out.std=F.estScena(w).k.startsWith('est_standard')&&F.estScena(w).el.join()==='el_muletti';
          w.dot={frigo:{day:0}}; out.frigo=F.estScena(w).k.startsWith('est_freddo'); w.dot={giardino:{day:0}};
          const im=apri('magazzini').querySelector('i'); out.vista=im.dataset.el==='el_giardino el_muletti'&&(im.style.backgroundImage.match(/url\(/g)||[]).length===3;
          Object.assign(w,s0);
          // l'ufficio del direttore: quattro versioni, il CEO come quello della partita
          out.dir4=['mm','mf','fm','ff'].every(x=>F.SCENE['direttore_'+x]); F.S.boss.sx='f'; out.dirF=apri('azienda').querySelector('i').dataset.scena.startsWith('direttore_f');
          F.S.boss.sx='m'; out.dirM=apri('azienda').querySelector('i').dataset.scena.startsWith('direttore_m');
          out.ferma=apri('tecnologia').classList.contains('ferma'); const t=F.TECH.find(x=>!F.S.researched[x.id]); F.S.project={tech:t.id,left:20,total:20,cost:t.cost}; F.renderAll();
          out.va=!document.querySelector('#wins .win .ev-scn').classList.contains('ferma'); F.S.project=null;
          document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); return out;}''')
        assert all(r.values()), f'scene nelle finestre {r}'
        # eventi: l'effetto della scelta arriva il giorno dopo, con il racconto di com'è andata
        await pg.evaluate("()=>{const F=window.__FUP;F.newGame('marco');F.S.speed=1;}")
        await pg.evaluate(FIRE, 'cesto')
        r = await pg.evaluate("()=>{const S=window.__FUP.S;return {speed:S.speed,modal:document.querySelector('#modal').innerHTML,card:!document.querySelector('#notecard').hidden,ev:S.notes.filter(n=>n.k==='ev').length}}")
        assert r['speed'] == 0 and not r['modal'] and r['card'] and r['ev'] == 1, f'evento: niente finestra, tessera, cartellino e pausa {r}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_notifiche_evento.png'))
        cash0 = await pg.evaluate('()=>window.__FUP.S.cash')
        await pg.click('#notes [data-act=note]')
        scn = await pg.evaluate("()=>{const i=document.querySelector('#modal .ev-scn i'); return i&&[i.dataset.scena,i.getBoundingClientRect().width]}")
        assert scn == ['festa', 480], f'scenetta del cesto natalizio {scn}'   # sul computer a 3×
        await pg.screenshot(path=os.path.join(OUT, 'shot_evento.png'))
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
        # customer service: responsabile, addetti, qualità; un dramma del cliente arriva come tessera gialla e si risolve il giorno dopo
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; S.cash+=200000;
          const c0=S.clients[0]; for(let i=0;i<4;i++) S.clients.push({...c0,id:'cs'+i,name:F.TENDER_POOL[i].name});
          const q0=F.csQual().v, n=F.csNeed(); F.ACT.hirecs({id:'mirella'}); S.office.cs=1; const q1=F.csQual().v;
          F.ACT.open({id:'customer'}); return {q0,q1,n,resp:S.cs.resp};}''')
        assert r['n'] == 1 and r['resp'] == 'mirella' and r['q1'] > r['q0'], r
        assert await pg.query_selector('#win-clienti [data-act=wtab][data-id=customer][aria-selected=true]'), 'la vecchia voce Customer service non apre la sua scheda'
        await pg.screenshot(path=os.path.join(OUT, 'shot_customer.png'))
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; F.cardsOff(); F.csEvent({c:'cs1',v:0,day:S.day});}")
        assert await pg.query_selector('#notes .nt.yellow[data-act=note]'), 'il dramma del cliente non arriva come tessera gialla'
        await pg.click('#notes .nt.yellow[data-act=note]')
        assert 'manca un bancale' in await pg.inner_text('#modal'), 'testo del dramma mancante'
        await pg.screenshot(path=os.path.join(OUT, 'shot_customer_evento.png'))
        sat0 = await pg.evaluate("()=>window.__FUP.S.clients.find(c=>c.id==='cs1').sat")
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        await pg.evaluate("()=>{const F=window.__FUP;F.S.speed=0;F.step();}")
        r = await pg.evaluate("()=>{const S=window.__FUP.S;return {sat:S.clients.find(c=>c.id==='cs1').sat,log:S.cs.log[0],res:S.notes.some(n=>n.k==='res'&&/manca un bancale/.test(n.title))}}")
        assert r['sat'] == min(100, sat0+3) and r['log']['how'] == 'manager' and r['res'], r
        await win(pg, 'customer')
        assert 'Risolto' in await pg.inner_text('#win-clienti'), 'la richiesta non compare tra le recenti'
        await pg.click('#win-clienti [data-act=close]')
        # picco di consegne e overstock: si accettano dalla tessera gialla, il giorno dopo cambiano pallet e posti occupati
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; F.cardsOff(); S.notes=S.notes.filter(n=>n.k!=='ev'); F.csEvent({c:'cs2',k:'picco',day:S.day});}")
        await pg.click('#notes .nt.yellow[data-act=note]')
        assert 'picco di consegne' in await pg.inner_text('#modal'), 'testo del picco mancante'
        await pg.screenshot(path=os.path.join(OUT, 'shot_customer_picco.png'))
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        await pg.evaluate("()=>{const F=window.__FUP;F.S.speed=0;F.step();}")
        r = await pg.evaluate("()=>{const F=window.__FUP,S=F.S,c=S.clients.find(x=>x.id==='cs2'),p=c.peak,d0=S.day,a=F.computeWH(S.warehouses[0]).cons; S.day=p.from; const b=F.computeWH(S.warehouses[0]).cons; S.day=d0; return {mul:p.mul,full:p.full,a,b};}")
        assert r['full'] == 1 and r['b'] > r['a'], r
        st0 = await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.warehouses[0].cap=20000; F.cardsOff(); document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.csEvent({c:'cs3',k:'over',day:S.day}); return F.computeWH(S.warehouses[0]).stock;}")
        await pg.click('#notes .nt.yellow[data-act=note]')
        assert 'Proponi' in await pg.inner_text('#modal'), 'overstock: nessun magazzino da proporre'
        await pg.screenshot(path=os.path.join(OUT, 'shot_customer_overstock.png'))
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        await pg.evaluate("()=>{const F=window.__FUP;F.S.speed=0;F.step();}")
        r = await pg.evaluate("()=>{const F=window.__FUP,S=F.S; return {ov:S.cs.ov.length,st:F.computeWH(S.warehouses[0]).stock,n:(S.cs.ov[0]||{}).n};}")
        assert r['ov'] == 1 and r['st'] == st0 + r['n'], r
        await win(pg, 'customer')
        assert 'In corso' in await pg.inner_text('#win-clienti'), 'picchi e overstock non compaiono nella finestra'
        await pg.click('#win-clienti [data-act=close]')
        # inventario fiscale (0.102): il sabato e la domenica, poi conti, soddisfazione e il prossimo; con un brutto punteggio differenze e verifica dopo 13 settimane
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,c=S.clients.find(x=>x.status==='attivo'&&!x.exit),w=S.warehouses.find(x=>x.id===c.wh),o={};
          F.cardsOff(); document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev');
          o.dur=Object.values(F.DUR_RANK).every(a=>a.every(m=>m>=24))&&F.durOf({dur:12})===24;
          const n0=(c.invLog||[]).length, k0=S.cash, sat0=c.sat; c.inv={d:S.day-1}; c.sat=50; const sc=F.invScore(c,w), tm=sc.tm, fee=F.invFee(c);
          o.team=tm.n>=2&&tm.cost>0&&fee>0&&sc.L[0][0]==='Base';
          F.invDaily(); const L=c.invLog[c.invLog.length-1]; o.done=c.invLog.length===n0+1&&L.fee===fee&&Math.abs(S.cash-(k0+L.fee-L.cost-L.diff))<0.01;
          o.sat=c.sat===Math.max(0,Math.min(100,50+F.invBand(L.v).sat)); o.next=(L.v<50?c.inv.rip&&c.inv.d>=S.day+91:c.inv.d>=S.day+300&&!c.inv.rip)&&new Date(Date.UTC(2002,0,1)+c.inv.d*864e5).getUTCDay()===6;
          const r0=Math.random, mor=w.morale, cond=w.cond; Math.random=()=>0; w.morale=0; w.cond=0; c.inv={d:S.day-1}; c.sat=50; const k1=S.cash;
          try{ F.invDo(c,w); } finally{ Math.random=r0; w.morale=mor; w.cond=cond; }
          const B=c.invLog[c.invLog.length-1]; o.bad=B.v<50&&B.diff>0&&c.sat===42&&c.inv.rip===true&&c.inv.d>=S.day+91&&c.inv.d<S.day+130&&Math.abs(S.cash-(k1+B.fee-B.cost-B.diff))<0.01;
          o.note=S.notes.some(n=>n.col==='red'&&/differenze inventariali/.test(n.title));
          c.sat=sat0; o.id=c.id; return o;}''')
        assert all(v for k, v in r.items() if k != 'id'), f'inventario fiscale: {r}'
        await win(pg, 'clienti')
        await pg.evaluate("(id)=>{const F=window.__FUP; F.UI.cliOpen={[id]:true}; F.renderAll(); document.querySelector('#win-clienti .cl-a [aria-expanded=true]').scrollIntoView({block:'start'});}", r['id'])
        await pg.wait_for_timeout(400)
        txt = await pg.inner_text('#win-clienti')
        assert 'Inventario di verifica' in txt and 'Previsione dell' in txt and 'Ultimi inventari' in txt, 'scheda del cliente senza l\'inventario'
        await pg.screenshot(path=os.path.join(OUT, 'shot_clienti_inventario.png'))
        await pg.click('#win-clienti [data-act=close]')
        # nelle Opzioni si toglie la pausa automatica; senza risposta, dopo due settimane decide il vice
        await pg.click('#top [data-act=options]')
        await pg.click('#modal [data-act=evpause]')
        await pg.click('#modal [data-act=closemodal]')
        # (richieste dei clienti in coda e controfferte dei manager restano ferme, così conta solo l'evento di prova)
        r = await pg.evaluate('''(fire)=>{const F=window.__FUP,S=F.S; S.speed=1; eval(fire)('cesto'); const sp=S.speed; S.speed=0;
          S.cs.q=[]; S.cs.last=S.day+60; S.managers.forEach(m=>{delete m.cof;});
          for(let i=0;i<15;i++) F.step(); return {sp, ev:S.notes.filter(n=>n.k==='ev').length, evs:S.notes.filter(n=>n.k==='ev').map(n=>n.ev.id), vice:S.notes.filter(n=>n.g==='vice').length, pend:S.evPend.length};}''', FIRE)
        assert r['sp'] == 1 and r['ev'] == 0 and r['vice'] == 1, f'pausa automatica o decisione del vice {r}'
        await pg.evaluate("()=>{window.__FUP.HUM.cfg.noPause=false;}")
        # eventi personali: CEO, manager e dirigenti; tutte le scelte funzionano e cambiano abilità e talenti
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame('gino');const S=F.S,bad=[],w=S.warehouses[0];
          document.querySelector('#modal').innerHTML=''; S.researched.direzione=true; ['chiara','davide','rosa'].forEach(id=>F.ACT.hiremgr({id}));
          const c=S.managers.find(m=>m.id==='chiara'); w.mgr='chiara'; c.wh=w.id; ['ottavio','giulia'].forEach(id=>{S.managers.find(m=>m.id===id).hired=true;}); S.dirs.fin='ottavio';
          // un secondo magazzino guidato da Rosa: alcuni eventi riguardano solo chi guida un magazzino
          S.cash+=1e6; F.ACT.rent({id:Object.keys(F.SITES).find(k=>!S.warehouses.some(x=>x.site===k))}); const w2=S.warehouses[1]; w2.mgr='rosa'; S.managers.find(m=>m.id==='rosa').wh=w2.id;
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
        # talenti in banchina: l'evento raro con la sua scenetta, un anno di affiancamento nella finestra Manager, poi la promozione a manager
        r = await pg.evaluate('''()=>{const F=window.__FUP;F.newGame('gino');const S=F.S,bad=[],w=S.warehouses[0]; document.querySelector('#modal').innerHTML='';
          S.day=800; w.staff.pick=Math.max(w.staff.pick,4); w.staff.imp=Math.max(w.staff.imp,2); S.cash+=1e5;
          // ogni storia: titolo, racconto, persona e magazzino; tutte le risposte funzionano
          const evs=F.EVENTS.filter(e=>e.id.startsWith('b_'));
          evs.forEach(e=>{ e.opts.forEach((o,i)=>{ const ev={...e}, st0={...w.staff}, c0=S.cresc; try{ e.setup(ev); if(!ev.text||!ev.p||!ev.w||ev.title===e.title) bad.push(e.id+': racconto');
            if(!o.req||o.req()) o.f.call(ev); }catch(x){bad.push(e.id+' '+i+': '+x);} w.staff=st0; S.cresc=c0; }); });
          // raro: dopo una scoperta ne passano almeno due anni prima della prossima
          const rnd=Math.random; Math.random=()=>0; const b=evs[0], ok0=b.cond(); S.seen[b.id]=S.day-100; const ok1=evs[1].cond(); S.seen[b.id]=S.day-800; const ok2=evs[1].cond(); Math.random=rnd;
          // la stoffa: un fuoriclasse è sempre di rango S, uno normale mai
          const rk=star=>{ S.cresc=[{id:'gx'+star,name:'Prova '+star,sx:'f',bd:S.day-30*365,face:21,role:'imp',wh:w.id,wn:w.name,k:'prec',star,men:0,day0:S.day,end:S.day}];
            F.cresDaily(); const p=S.managers.pop(); S.warehouses.forEach(x=>{if(x.mgr===p.id) x.mgr=null;}); w.staff.imp++; return F.mRank(p); };
          const r2=[0,1,2,3].map(()=>rk(2)), r0=[0,1,2,3].map(()=>rk(0)); S.notes=[]; S.cresc=[]; S.seen={}; document.querySelector('#toasts').innerHTML='';
          return {n:evs.length,bad,ok0,ok1,ok2,r2,r0,scn:evs.every(e=>F.evScena(e.id,e.src)==='talento')};}''')
        assert r['n'] == 6 and not r['bad'] and r['ok0'] and not r['ok1'] and r['ok2'] and r['scn'], r
        assert all(x == 'S' for x in r['r2']) and 'S' not in r['r0'], f'stoffa dei talenti in banchina {r}'
        await pg.evaluate(FIRE, 'b_picking')
        await pg.click('#notes [data-act=note]')
        scn = await pg.evaluate("()=>{const i=document.querySelector('#modal .ev-scn i'); return i&&[i.dataset.scena,i.getBoundingClientRect().width]}")
        assert scn == ['talento', 480], f'scenetta del talento in banchina {scn}'
        who = await pg.evaluate("()=>{const e=document.querySelector('#modal .ev-who'); return e&&e.innerText}")
        nm = await pg.evaluate("()=>window.__FUP.S.notes.find(n=>n.k==='ev').ev.vars.nm")
        assert who and nm in who, f'chi è coinvolto nell\'evento: {who} {nm}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_evento_talento.png'))
        # un anno di affiancamento: la scelta passa dal salvataggio (evUnpack), il giorno dopo parte la crescita
        cash0 = await pg.evaluate('()=>window.__FUP.S.cash')
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        await pg.evaluate("()=>{const F=window.__FUP;F.S.nextEvent=1e9;F.step();}")
        r = await pg.evaluate("()=>{const S=window.__FUP.S,x=(S.cresc||[])[0];return {n:(S.cresc||[]).length,nm:x&&x.name,days:x&&x.end-x.day0,cash:S.cash}}")
        assert r['n'] == 1 and r['nm'] == nm and r['days'] == 365 and cash0 - r['cash'] >= 3000, r
        sel = await win(pg, 'manager')
        assert nm in await pg.inner_text(f'{sel} .win-b'), 'il talento in crescita non compare nella finestra Manager'
        await pg.evaluate(f"()=>{{const c=[...document.querySelectorAll('{sel} .card')].find(e=>e.innerText.includes('diventa manager')); if(c) c.scrollIntoView({{block:'center'}});}}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_manager_crescita.png'))
        # un anno dopo diventa manager: lascia il reparto, prende il talento, costa meno del mercato e guida un magazzino libero
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,x=S.cresc[0],w=S.warehouses.find(v=>v.id===x.wh); w.mgr=null; const pk=w.staff.pick; x.end=S.day; S.nextEvent=1e9; F.step();
          const p=S.managers.find(m=>m.name===x.name); return {p:!!p,hired:p&&p.hired,tal:p&&p.tal.includes('Cresciuto in banchina'),cheap:p&&p.ral<F.ralOf(F.mScore(p)),
            wh:p&&p.wh===w.id&&w.mgr===p.id,staff:pk-w.staff.pick,left:S.cresc.length,note:S.notes.some(n=>n.k==='info'&&n.title.includes(x.name.split(' ')[0]))};}''')
        assert r['p'] and r['hired'] and r['tal'] and r['cheap'] and r['wh'] and r['staff'] == 1 and r['left'] == 0 and r['note'], f'promozione del talento in banchina {r}'
        await pg.click(f'{sel} [data-act=close]'); await pg.evaluate("()=>window.__FUP.cardsOff()")
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
          const m=S.managers[0]; m.hired=true; w.mgr=m.id; const e=S.managers.find(x=>x.id==='ottavio'); e.hired=true; S.dirs.op=e.id; S.welfare.buoni=true;
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
        # gare: il magazzino si sceglie dalla finestrella, sopra chi può prendere il cliente, sotto in grigio chi no (qui manca l'HACCP)
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; S.cash=Math.max(S.cash,5e6); const clr=()=>{document.querySelector('#modal').innerHTML='';};
          const ids=Object.keys(F.SITES).filter(i=>!S.warehouses.some(w=>w.site==i)); F.ACT.rent({id:ids[3]}); F.ACT.rent({id:ids[9]}); clr();
          S.researched.haccp=true; const w=S.warehouses[S.warehouses.length-2]; w.tech.haccp={day:0,iss:S.day,exp:S.day+900,next:S.day+300,nc:null,susp:null,pend:null};
          let t=null; for(let i=0;i<30;i++){ S.tenders=S.tenders.filter(x=>x.done); F.newTender(); t=S.tenders[S.tenders.length-1]; t.req=['haccp']; t.stock=Math.min(t.stock,1200); const e=F.bidEstimate(t,w.id,1); if(e&&e.fits) break; }
          document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); return {w:w.id,name:w.name,n:S.warehouses.length};}''')
        await win(pg, 'gare')
        await pg.click('#win-gare [data-act=mpopen][data-k=bid]')
        assert await pg.evaluate(MPORD), 'scelta del magazzino: quelli che possono prendere il cliente devono stare sopra'
        assert 'HACCP' in await pg.inner_text('#modal .mp-r.off'), 'il magazzino senza certificazione non è in grigio col motivo'
        assert await pg.eval_on_selector_all('#modal .mp-r', 'e=>e.length') == r['n'], 'nella scelta mancano dei magazzini'
        await pg.screenshot(path=os.path.join(OUT, 'shot_scelta_magazzino_gara.png'))
        await pg.click(f'#modal [data-act=mpick][data-v={r["w"]}]')
        assert r['name'] in await pg.inner_text('#win-gare [data-act=mpopen][data-k=bid]'), 'il magazzino scelto non compare nella gara'
        assert not await pg.eval_on_selector('#win-gare [data-act=bid]', 'e=>e.disabled'), 'col magazzino certificato l\'offerta resta bloccata'
        await pg.click('#win-gare [data-act=close]')
        # partita completa con 3 avversari: due anni senza errori, offerte vere nelle gare, magazzini rivali sulla mappa
        r = await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('gino',null,{mode:'classica',win:{reputazione:true},reputazione:200});
          const H=F.HUM; H.bots=[['edoardo','espansione'],['valeria','qualita'],['marco','prezzo']].map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],'normale',i));
          let bids=0;
          for(let d=0;d<730&&!H.over;d++){ const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}
            H.cash=Math.max(H.cash,300000); bids+=H.tenders.filter(t=>t.bids&&Object.keys(t.bids).length&&t.deadline===H.day).length; F.step(); }
          F.ACT.toggle({id:'classifica'});
          const gm=H.bots.reduce((a,b)=>a+b.managers.filter(m=>m.gen&&(m.hired||m.arr!=null)).length,0), more=H.bots.some(b=>b.warehouses.filter(w=>w.mgr!=='ceo').length>1);   // il CEO può guidare un magazzino da sé: serve un manager nuovo solo oltre quello
          return {gm,more,board:F.mktList().length,bids,cli:H.bots.map(b=>b.clients.filter(c=>c.status==='attivo').length),day:H.day,mk:document.querySelectorAll('#ov [data-act=openclass]').length,
            sizeKB:Math.round(JSON.stringify(H).length/1024)};}''')
        assert r['bids'] > 3 and sum(r['cli']) > 6 and r['day'] >= 729, r
        assert r['board'] == 3 and (r['gm'] >= 1 or not r['more']), f'le avversarie non assumono dalle candidature spontanee: {r}'
        print('avversari dopo 2 anni:', r)
        assert r['sizeKB'] < 2500, f'salvataggio troppo grande: {r}'
        # gare sulla mappa (0.106): una puntina per ogni gara aperta, tooltip calcolato all'apertura, il clic apre la gara e la evidenzia
        g = await pg.evaluate("""()=>{const F=window.__FUP,H=F.HUM; document.querySelector('#modal').innerHTML=''; document.querySelectorAll('.win [data-act=close]').forEach(b=>b.click());
          if(!H.tenders.some(t=>!t.done)) F.newTender(); F.renderMap();
          const pins=[...document.querySelectorAll('#ov [data-act=mapten]')], t=H.tenders.find(x=>!x.done&&x.id===pins[0].dataset.id);
          pins[0].dispatchEvent(new MouseEvent('mouseover',{bubbles:true})); const tip=document.querySelector('#tip').innerText;
          F.ACT.mapten({id:t.id}); const on=!!document.querySelector('#win-gare')&&document.querySelectorAll('#ov path[stroke-dasharray="7 5"]').length>0;
          const sel=document.querySelector('#ov [data-act=mapten][data-id="'+t.id+'"] .mk-ring').getAttribute('fill');
          document.querySelector('#win-gare [data-act=mapten][data-tog]').click(); const off=document.querySelectorAll('#ov path[stroke-dasharray="7 5"]').length===0;
          return {n:pins.length,open:H.tenders.filter(x=>!x.done).length,tip,on,sel,off};}""")
        assert g['n'] == g['open'] and g['n'] > 0, f'puntine delle gare sulla mappa: {g}'
        assert ' km · ' in g['tip'] and 'probabilità' in g['tip'].lower(), f'tooltip della puntina: {g}'
        assert g['on'] and g['sel'] == '#ffd23f' and g['off'], f'gara evidenziata sulla mappa: {g}'
        await pg.evaluate("()=>{const F=window.__FUP; F.ACT.mapten({id:F.HUM.tenders.find(x=>!x.done).id});}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_gare_mappa.png'))
        # eventi con un posto (0.106): la zona compare sulla mappa e la risposta pesa su ogni magazzino in proporzione ai suoi viaggi
        # nella zona. Il giocatore di questa partita non fa offerte: per il controllo gli si presta un cliente in Lombardia (poi si toglie).
        # Si prende l'evento la cui zona tocca di più i suoi viaggi (P0 = puntualità della prima risposta)
        P0 = {'nebbia': -4, 'allerta': -8, 'moda': -2, 'a1': -2, 'brennero': -4, 'po': -6}
        ev_id = await pg.evaluate("""(P0)=>{const F=window.__FUP,H=F.HUM; document.querySelectorAll('.win [data-act=close]').forEach(b=>b.click()); F.cardsOff();
          H.notes=H.notes.filter(n=>n.k!=='ev'); H.evPend=[];
          const c0=H.bots.flatMap(b=>b.clients)[0]; H.clients.push({...c0,id:'clzona',req:[],line:null,peak:null,wh:H.warehouses[0].id,status:'attivo',zone:'reg_lom',mode:'consegna',pal:300,stock:250,sat:60});
          const best=Object.keys(P0).map(k=>[k,Math.max(0,...H.warehouses.map(w=>F.areaShare(k,w)))]).sort((a,b)=>b[1]-a[1])[0]; return best[0];}""", P0)
        await pg.evaluate(FIRE, ev_id)
        a = await pg.evaluate("""(id)=>{const F=window.__FUP,S=F.S,n=S.notes.find(x=>x.k==='ev'&&x.ev&&x.ev.id===id); F.ACT.note({id:n.id});
          return {aree:S.aree.length, mappa:document.querySelectorAll('#ov [data-tipf=area]').length, win:document.querySelector('#modal').innerText};}""", ev_id)
        assert a['aree'] == 1 and a['mappa'] == 1 and 'Sulla mappa' in a['win'], f'zona dell\'evento {ev_id}: {a}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_evento_zona.png'))
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        a = await pg.evaluate("""([id,p0])=>{const F=window.__FUP,S=F.S,tt=F.EVENTS.find(e=>e.id===id).title; for(let i=0;i<2;i++) F.step();
          const q=S.warehouses.map(w=>{const s=F.areaShare(id,w), m=S.mods.find(x=>x.scope===w.id&&x.src===tt); return [Math.round(s*1000)/1000, m?m.P:null];});
          const ok=q.every(([s,p])=>s<0.03?p==null:Math.abs(p-Math.round(p0*s*10)/10)<0.15);
          const all=S.mods.some(x=>x.scope==='all'&&x.src===tt), z=S.aree[0], until=z&&z.until;
          for(let i=0;until&&S.day<=until&&i<60;i++) F.step();
          S.clients=S.clients.filter(c=>c.id!=='clzona');
          return {q,ok,all,until,dopo:S.aree.length,mappa:document.querySelectorAll('#ov [data-tipf=area]').length,hit:q.some(([s])=>s>=0.03)};}""", [ev_id, P0[ev_id]])
        assert a['hit'] and a['ok'] and not a['all'] and a['until'] and a['dopo'] == 0 and a['mappa'] == 0, f'effetto di {ev_id} in proporzione ai viaggi: {a}'
        print(f'evento con un posto «{ev_id}»: quota dei viaggi e puntualità per magazzino', a['q'])
        # vittoria: una condizione facile fa comparire la finestra di fine partita
        w = await pg.evaluate('''()=>{const F=window.__FUP,H=F.HUM; document.querySelector('#modal').innerHTML=''; H.cfg.reputazione=1; F.checkWin();
          return {won:H.won,txt:document.querySelector('#modal').innerText};}''')
        assert w['won'] and 'vinto' in w['txt'].lower(), w
        await pg.screenshot(path=os.path.join(OUT, 'shot_vittoria.png'))
        await pg.evaluate("()=>window.__FUP.cardsOff()")   # un cartellino rimasto dalla partita coprirebbe le schede del report
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
        # pacchetto Relazioni industriali: tre anni con tre avversari, rate del contratto, tavolo, fornitori, talpa e la finestra
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click());
          F.newGame('gino',null,{mode:'classica',win:{clima:true},ri:true}); const H=F.HUM; H.nextEvent=40;
          H.bots=[['edoardo','espansione'],['valeria','qualita'],['marco','prezzo']].map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],'normale',i));
          for(let d=0;d<1095&&!H.over;d++){ const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}
            const n=(H.notes||[]).find(x=>x.k==='ev'); if(n&&!m.innerHTML) F.ACT.note({id:n.id});
            H.cash=Math.max(H.cash,300000); H.tenders.filter(t=>!t.done&&!t.bid).forEach(t=>{const e=F.bidEstimate(t,H.warehouses[0].id,0.95); if(e&&e.fits&&e.sat<0.85) t.bid={wh:H.warehouses[0].id,mult:0.95};}); F.step(); }
          document.querySelector('#modal').innerHTML='';
          const w=H.warehouses[0], out={day:H.day,wage:H.ri.wage,idx:H.riw.idx,ti:H.riw.ti,ag:w.ag!=null,bots:H.bots.map(b=>!!b.ri&&b.warehouses.every(x=>x.ag!=null)),
            tech:F.TECH.some(t=>t.id==='talpa'),strikes:H.ri.strikes,clima:F.climaProg(H)};
          // le tariffe si provano su un cliente attivo: se dopo tre anni il magazzino non ne ha (gare perse), gliene diamo uno
          if(!H.clients.some(c=>c.status==='attivo'&&c.wh===w.id)){ const c0=H.clients[0]||H.bots.flatMap(b=>b.clients)[0]; if(c0) H.clients.push({...c0,id:'cltar',req:[],line:null,peak:null,wh:w.id,status:'attivo',pal:400,stock:300,sat:60}); }
          { const r0=F.computeWH(w).rev; H.riw.ti*=1.1; const r1=F.computeWH(w).rev; H.riw.ti/=1.1; out.tarOk=r0>0&&r1/r0>1.05&&r1/r0<1.1001; }
          // tavolo forzato: concedendo tutto si firma alla prima seduta
          // il magazzino nasce senza sindacato: senza, niente tavolo; col morale a terra il sindacato arriva
          const w2=H.warehouses[H.warehouses.length-1]; out.nosind=w2.sind===false||w2.sind===true;
          w.sind=false; w.rsu=null; w.sindP=0; w.ag=70; w.tav=null; w.deal=null; out.notav=!F.riTavOpen(w)&&F.fascia(w)<=1;
          for(let i=0;i<20;i++){ w.morale=30; F.step(); } out.sind=w.sind&&!!w.rsu;
          w.tav=null; w.deal=null; w.tavCd=0; w.ag=70; F.riTavOpen(w); w.tav.reqs.forEach(r=>r.c='si'); w.tav.next=H.day; F.step(); out.deal=!!w.deal&&!w.tav;
          // il tavolo non si riapre a comando: dopo un tavolo saltato si aspettano tre mesi
          w.deal=null; w.ag=70; F.riTavOpen(w); F.ACT.riquit({wh:w.id,ok:1}); F.step(); out.cool=!w.tav&&w.tavCd>H.day+80;
          // gara per l'handling: tre settimane di offerte, poi si sceglie; e ritorno al personale interno
          w.ag=20; w.tavCd=1e9; w.strike=null; const av=F.hdlAvail(w); out.av=av.length;
          if(av.length){ F.hdlTender(w); out.early=F.htPick(w,0)===null; for(let i=0;i<22;i++){ document.querySelector('#modal').innerHTML=''; F.step(); }
            out.offers=w.ht?w.ht.offers.length:0; const r=F.htPick(w,0); out.hdl=r==='now'&&!!w.hdl&&w.coop&&w.hp>0&&w.hEnd>H.day; F.hdlInternal(w,true); out.back=!w.hdl&&!w.coop; }
          // la talpa scoperta: multa, reputazione, agitazione alle stelle, ricerca bloccata
          H.researched.talpa=true; const rep0=H.rep; F.riTalpaFound(); out.talpa=!H.researched.talpa&&H.rep<rep0&&w.ag>=90&&H.ri.ban>H.day;
          F.renderAll(); out.dock=!!document.querySelector('#dock [data-id=sindacato]'); return out;}''')
        assert r['wage'] > 1.01 and r['idx'] > 1.01 and r['ag'] and all(r['bots']) and r['tech'], f'pacchetto Relazioni industriali: {r}'
        # clausola di adeguamento: le tariffe salgono di metà degli aumenti del contratto nazionale
        assert r['tarOk'] and 1.004 < r['ti'] < r['idx'] and abs((r['ti'] - 1) - (r['idx'] - 1) / 2) < 0.01, f'adeguamento delle tariffe: {r}'
        assert r['notav'] and r['sind'] and r['deal'] and r['cool'] and r['talpa'] and r['dock'] and (not r['av'] or (r['early'] and r['offers'] >= 1 and r['hdl'] and r['back'])), f'pacchetto Relazioni industriali: {r}'
        print('relazioni industriali dopo 3 anni:', r)
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0]; S.ri.ban=0; ['relsind','talpa','vendor','paritetico'].forEach(t=>S.researched[t]=true); F.riUnionize(w); w.ag=62; w.tavCd=0; F.riTavOpen(w); F.hdlTender(w); F.ACT.toggle({id:'sindacato'});}")
        for t in ['clima','tav','ccnl','hdl']:
            await pg.click(f'#win-sindacato [data-act=ritab][data-id={t}]')
            await pg.screenshot(path=os.path.join(OUT, f'shot_ri_{t}.png'))
        await pg.evaluate("()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.ACT.openwh({id:F.S.warehouses[0].id}); document.querySelector('#win-magazzini .ri-whb').scrollIntoView();}")
        await pg.screenshot(path=os.path.join(OUT, 'shot_ri_magazzino.png'))
        await pg.evaluate("()=>{document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); window.__FUP.ACT.lens({id:'clima'});}")
        assert await pg.query_selector('#ov [aria-label="Clima sindacale"]'), 'lente del clima sindacale mancante'
        await pg.screenshot(path=os.path.join(OUT, 'shot_ri_lente.png'))
        await pg.evaluate("()=>window.__FUP.ACT.lens({id:'base'})")
        # pacchetto Reparto IT e Ingegneria (0.109): consulente a contratto, tre ricerche insieme, responsabile, squadra, reparto vuoto,
        # sesto direttore e capannoni innovativi; poi un anno con tre avversarie e le schermate
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); document.querySelector('#modal').innerHTML='';
          F.newGame('gino',null,{mode:'classica',win:{},it:true}); const S=F.S, o={}, T=id=>F.TECH.find(t=>t.id===id); S.cash=3e6; S.nextEvent=1e9;
          o.dir6=F.DIR_ROLES.length===6&&'ing' in S.dirs; o.tech=!!T('edifici');
          o.lock=!F.rentable('landriano')&&!F.edilCls().includes('inn')&&F.innWhy().includes('Edifici');
          o.closed=F.techLine(T('wms'))==='dir'&&!F.depOpen('it');
          F.ACT.consign({id:'gigabancale',ok:1}); o.open=F.depOpen('it')&&F.techLine(T('barcode'))==='it'&&F.techLine(T('regolamento'))==='dir';
          F.ACT.research({id:'barcode'}); F.ACT.research({id:'regolamento'}); o.two=F.projs().length===2;
          const w1=F.techWeeks(T('wms'),'it'); S.office.it=3; o.team=F.techWeeks(T('wms'),'it')<w1; S.office.it=0;
          F.ACT.hiremgr({id:'sara'}); F.ACT.setdep({k:'ing'},{value:'sara'}); o.resp=S.dep.ing.resp==='sara'&&!S.warehouses.some(w=>w.mgr==='sara')&&F.depOpen('ing')&&F.depInn('ing')===S.managers.find(m=>m.id==='sara').st.inn;
          F.ACT.research({id:'formazione'}); o.three=F.projs().length===3;
          const c0=S.cash; for(let i=0;i<30;i++){ document.querySelector('#modal').innerHTML=''; F.step(); } o.done=!!S.researched.barcode&&!!S.researched.regolamento&&!!S.researched.formazione;
          F.ACT.consstop({k:'it',ok:1}); o.notice=!!S.dep.it.cons&&S.dep.it.cons.end>S.day; for(let i=0;i<31;i++){ document.querySelector('#modal').innerHTML=''; F.step(); } o.gone=!S.dep.it.cons&&!F.depOpen('it');
          // reparto vuoto: la ricerca in corso si ferma
          S.dep.it.proj={tech:'wms',left:20,total:30,cost:40000}; F.step(); o.stop=S.dep.it.proj.left===20&&F.noteAlerts().some(a=>a.id==='depstopit');
          // il responsabile licenziato lascia il posto
          F.ACT.firemgr({id:'sara',ok:1}); o.fired=!S.dep.ing.resp;
          // capannoni innovativi: ricerca Edifici intelligenti e direttore IT e ingegneria con Innovazione 14
          S.researched.gestionale=true; S.researched.direzione=true; S.researched.edifici=true; F.ACT.hiremgr({id:'giorgio'}); F.ACT.setdir({role:'ing'},{value:'giorgio'}); o.low=!F.innOk()&&F.innWhy().includes('Innovazione');
          F.ACT.hiremgr({id:'federico'}); F.ACT.setdir({role:'ing'},{value:'federico'}); o.inn=F.innOk()&&F.rentable('landriano')&&F.edilCls().includes('inn');
          F.ACT.rent({id:'landriano'}); o.rent=S.warehouses.some(w=>w.site==='landriano');
          return o;}''')
        assert all(r.values()), f'pacchetto Reparto IT e Ingegneria: {r}'
        # avvii (0.110): la squadra interna lascia la ricerca, giorno dell'avvio con esito e apprendimento, fine dell'assistenza;
        # un consulente a progetto non occupa nessuno; disastro forzato, evento e marcia indietro
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('gino',null,{mode:'classica',win:{},it:true}); const S=F.S,o={},w=S.warehouses[0]; S.cash=3e6; S.nextEvent=1e9;
          ['barcode','wms'].forEach(t=>S.researched[t]=true); S.office.it=1; F.ACT.hiremgr({id:'sara'}); F.ACT.setdep({k:'it'},{value:'sara'});
          F.ACT.install({id:'barcode',wh:w.id}); o.modal=!!document.querySelector('#modal [data-act=avvgo]');
          F.ACT.avvset({by:'int',mode:'grad'}); F.ACT.avvgo(); const a=S.avv[0]; o.start=!!a&&a.by==='int'&&a.n===1&&F.depFree('it')===1&&!w.tech.barcode&&a.cost===10200&&!document.querySelector('#modal').innerHTML;
          F.ACT.research({id:'rf'}); o.res=!!S.dep.it.proj;
          for(let i=0;i<16&&!a.esito;i++){ document.querySelector('#modal').innerHTML=''; F.step(); } o.live=!!a.esito&&!!w.tech.barcode&&w.tech.barcode.lm>0;
          for(let i=0;i<16;i++){ document.querySelector('#modal').innerHTML=''; F.step(); } o.care=!S.avv.includes(a)&&F.depFree('it')===2;
          F.ACT.avvopen({id:'wms',wh:w.id}); F.ACT.avvset({by:'nebbia',mode:'bb'}); F.ACT.avvgo(); const b=S.avv.find(x=>x.tech==='wms'); o.cons=!!b&&b.n===0&&F.depFree('it')===2;
          b.live=S.day; const R0=Math.random; Math.random=()=>0; F.step(); Math.random=R0; o.bad=b.esito==='disastro'&&!!w.tech.wms;
          const n=S.notes.find(x=>x.k==='ev'&&x.ev.id==='avv_ko'); o.ev=!!n; if(n) F.ACT.note({id:n.id}); window.__cash=S.cash; return o;}''')
        assert all(r.values()), f'avvii del pacchetto Reparto IT e Ingegneria: {r}'
        await pg.click('#modal [data-act=evopt][data-i="0"]')
        r = await pg.evaluate("()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0]; document.querySelector('#modal').innerHTML=''; F.step(); return {gone:!w.tech.wms,cd:!!(w.avvCd&&w.avvCd.wms>S.day),back:S.cash>window.__cash};}")
        assert all(r.values()), f'avvio disastroso, marcia indietro: {r}'
        # assistenza, affidabilità, guasti e sistemi obsoleti (0.111): lavagna, carico, guasto forzato con i suoi effetti e la sua fine,
        # sistema obsoleto (avviso, canone, obiettivo), aggiornamento come progetto del Reparto IT, sistema aziendale, ricerche nuove dell'IT
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('marco',null,{mode:'classica',win:{},it:true}); const S=F.S,o={},w=S.warehouses[0]; S.cash=3e6; S.nextEvent=1e9;
          S.office.it=1; S.dep.it.as=1; const T=id=>F.TECH.find(t=>t.id===id);
          o.techs=['sala','sicurezza','cloud'].every(T);
          o.pts=F.itSys().reduce((a,x)=>a+x.n,0)===6&&Math.abs(F.itNeed()-1)<1e-9&&F.itSupply()===1.5&&F.depFree('it')===0&&F.techLine(T('rf'))==='dir';
          F.ACT.itas({v:-1}); o.lav=S.dep.it.as===0&&F.depFree('it')===1&&F.itSupply()===0.5&&F.noteAlerts().some(a=>a.id==='itload');
          F.ACT.itas({v:1}); o.back=S.dep.it.as===1&&!F.noteAlerts().some(a=>a.id==='itload');
          const t0=F.itTgt(); S.dep.it.aff=50; F.step(); o.aff=S.dep.it.aff>50&&S.dep.it.aff<t0;
          F.step(); const k0=w.kpi; F.itKoStart(w,'wms'); const k1=w.kpi; o.ko=!!w.itko&&k1.prod<k0.prod*0.7&&k1.pP.some(x=>x[0].includes('Guasto informatico'))&&S.notes.some(n=>n.key==='itko'+w.id);
          for(let i=0;i<4;i++){ document.querySelector('#modal').innerHTML=''; F.step(); } o.fixed=!w.itko;
          const c0=w.kpi.tCan; w.tech.wms.day=S.day-3700; F.step(); o.old=F.sysObs(F.sysRec('wms',w))&&F.noteAlerts().some(a=>a.id==='itold')&&w.kpi.tCan>c0&&F.itTarget().some(x=>x[0].includes('obsolet'));
          o.why=!!F.avvWhy(T('gps'),w,'int',1);
          F.ACT.updopen({id:'wms',wh:w.id}); o.modal=document.querySelector('#modal').innerText.includes('Aggiornamento');
          F.ACT.avvset({by:'gigabancale'}); F.ACT.avvgo(); const a=S.avv.find(x=>x.upd); o.upd=!!a&&a.dep==='it'&&a.n===0&&a.cost===10500;
          a.live=S.day; const R0=Math.random; Math.random=()=>0.99; F.step(); Math.random=R0; o.done=!!a.esito&&S.day-w.tech.wms.day<=1&&!F.sysObs(F.sysRec('wms',w))&&w.tech.wms.lm<1;
          S.sysDay.gestionale=S.day-3700; F.ACT.updopen({id:'gestionale'}); F.ACT.avvgo(); const g=S.avv.find(x=>x.tech==='gestionale'); o.co=!!g&&g.wh===null&&g.by==='int';
          g.live=S.day; Math.random=()=>0.99; F.step(); Math.random=R0; o.coDone=!!g.esito&&!F.sysObs(F.sysRec('gestionale',null));
          const tg=F.itTgt(), nd=F.itNeed(); ['sala','sicurezza','cloud'].forEach(id=>S.researched[id]=true); o.res=F.itTgt()>=Math.min(100,tg+10)&&F.itNeed()<nd&&F.itFees()===300;
          return o;}''')
        assert all(r.values()), f'assistenza, affidabilità, guasti e aggiornamenti del Reparto IT: {r}'
        r = await pg.evaluate('''()=>{const F=window.__FUP; F.newGame('gino',null,{mode:'classica',win:{},it:true}); const H=F.HUM; H.nextEvent=40;
          H.bots=[['edoardo','espansione'],['valeria','qualita'],['marco','prezzo']].map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],'normale',i));
          for(let d=0;d<365&&!H.over;d++){ const m=document.querySelector('#modal'); if(m.innerHTML){const b=m.querySelector('[data-act=evopt]:not([disabled])')||m.querySelector('[data-act=closemodal]'); if(b) b.click();}
            const n=(H.notes||[]).find(x=>x.k==='ev'); if(n&&!m.innerHTML) F.ACT.note({id:n.id}); H.bots.forEach(b=>{b.cash=Math.max(b.cash,800000);}); F.step(); }
          document.querySelector('#modal').innerHTML='';
          return {day:H.day,bots:H.bots.map(b=>!!b.dep&&b.office.it!=null),cons:H.bots.filter(b=>b.dep&&(b.dep.it.cons||b.dep.ing.cons)).length,lines:H.bots.reduce((a,b)=>a+(b.dep&&(b.dep.it.proj||b.dep.ing.proj)?1:0),0)};}''')
        assert r['day'] >= 365 and all(r['bots']), f'avversarie col pacchetto Reparto IT e Ingegneria: {r}'
        print('reparto IT e ingegneria, avversarie dopo un anno:', r)
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); S.cash=3e6; F.ACT.consign({id:'paletti',ok:1}); F.ACT.hiremgr({id:'sara'}); F.ACT.setdep({k:'it'},{value:'sara'}); S.office.it=2; F.ACT.research({id:'barcode'}); F.ACT.research({id:'formazione'}); F.ACT.research({id:'regolamento'}); document.querySelectorAll('#toasts > *').forEach(e=>e.remove()); F.cardsOff(); F.openWin('reparti');}"); await pg.wait_for_timeout(600)
        assert await pg.query_selector('#win-tecnologia .dep-k [data-act=consign]') and await pg.query_selector('#win-tecnologia [data-act=mpopen][data-k=dep]'), 'scheda Reparti tecnici incompleta'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_reparti.png'))
        await pg.evaluate("()=>{window.__FUP.openWin('tecnologia');}"); await pg.wait_for_timeout(600)
        assert await pg.evaluate("document.querySelectorAll('#win-tecnologia .rbars .rbar').length") == 3, 'col pacchetto la scheda Ricerca deve avere tre barre'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_ricerca.png'))
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.researched.barcode=true; F.openWin('reparti'); const w=S.warehouses.find(x=>!x.tech.barcode)||S.warehouses[0]; F.ACT.avvopen({id:'barcode',wh:w.id});}"); await pg.wait_for_timeout(400)
        assert await pg.query_selector('#modal [data-act=avvgo]') and await pg.query_selector('#modal .av-pb'), 'finestrella dell\'avvio incompleta'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_avvio.png'))
        await pg.evaluate("()=>{document.querySelector('#modal').innerHTML='';}")
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S,w=S.warehouses[0]; w.tech.wms={day:S.day-3700}; S.dep.it.as=1; F.itKoStart(w,'wms'); F.step(); document.querySelector('#modal').innerHTML=''; document.querySelectorAll('#toasts > *').forEach(e=>e.remove()); F.cardsOff(); F.openWin('reparti'); document.querySelectorAll('#win-tecnologia .dep-k')[1].scrollIntoView();}"); await pg.wait_for_timeout(500)
        assert await pg.query_selector('#win-tecnologia .lv [data-act=itas]') and await pg.query_selector('#win-tecnologia [data-act=updopen]'), 'scheda Reparti tecnici senza lavagna o senza aggiornamenti'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_sistemi.png'))
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; F.ACT.updopen({id:'wms',wh:S.warehouses[0].id});}"); await pg.wait_for_timeout(400)
        assert await pg.query_selector('#modal [data-act=avvgo]') and 'Aggiornamento' in await pg.inner_text('#modal'), 'finestrella dell\'aggiornamento incompleta'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_aggiorna.png'))
        await pg.evaluate("()=>{document.querySelector('#modal').innerHTML='';}")
        await pg.evaluate("()=>{window.__FUP.ACT.mpopen({k:'dep',id:'ing'});}"); await pg.wait_for_timeout(400)
        assert 'Responsabile IT' in await pg.inner_text('#modal'), 'nella scelta del responsabile chi guida l\'altro reparto deve stare in grigio col suo ruolo'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_scelta.png'))
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; S.researched.gestionale=true; S.researched.direzione=true; F.ACT.hiremgr({id:'federico'}); F.ACT.setdir({role:'ing'},{value:'federico'}); document.querySelectorAll('#toasts > *').forEach(e=>e.remove()); document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); F.cardsOff(); F.openWin('direzione');}"); await pg.wait_for_timeout(600)
        assert await pg.evaluate("document.querySelectorAll('#win-manager .dr-s').length") == 6, 'col pacchetto la Direzione ha sei posti'
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_direzione.png'))
        await pg.evaluate("()=>{document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); window.__FUP.openWin('espansione');}"); await pg.wait_for_timeout(600)
        await pg.screenshot(path=os.path.join(OUT, 'shot_it_capannoni.png'))
        await pg.evaluate("()=>document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click())")
        # traslochi (0.103): progetto a passi nella finestra del magazzino, conferma, un cliente che si rifiuta, giorni del trasloco,
        # stabilizzazione e fine; capannone vuoto restituito e venduto; ordinanza sul capannone fatiscente e cantiere d'ufficio
        await pg.evaluate('''()=>{const F=window.__FUP; document.querySelectorAll('#wins .win [data-act=close]').forEach(b=>b.click()); document.querySelector('#modal').innerHTML='';
          F.newGame('gino'); const S=F.S; S.cash=3e6; S.speed=0; F.ACT.rent({id:'piacenza'}); document.querySelector('#modal').innerHTML='';
          const o=S.warehouses[0], d=S.warehouses[1]; Object.assign(d.staff,{pick:4,car:4,imp:2,autCE:3,autB:2,fm:1});
          const t=F.TENDER_POOL.find(x=>!(x.req||[]).length&&F.CINFO[x.name]), ci=F.CINFO[t.name];
          S.clients.push({id:'cx1',name:t.name,slogan:t.slogan,sector:t.sector,req:[],stock:400,pal:300,sP:t.sP,sA:t.sA,zone:ci.zones[0],src:ci.src,mode:ci.mode,wh:o.id,mult:1,sat:20,status:'attivo',start:0,end:900,dur:24});
          F.ACT.openwh({id:o.id}); F.ACT.tropen({wh:o.id});}''')
        tb = await pg.evaluate('''()=>{const b=document.querySelector('#win-magazzini .tr-box'); return {box:!!b,steps:b?b.querySelectorAll('.tr-n').length:0,to:!!b&&!!b.querySelector('[data-act=trto][aria-pressed=true]'),go:!!b&&!b.querySelector('[data-act=trgo]').disabled};}''')
        assert tb == {'box': True, 'steps': 6, 'to': True, 'go': True}, f'progetto di trasloco: {tb}'
        await pg.click('#win-magazzini [data-act=trmode][data-v=lampo]')
        s0 = await pg.evaluate("()=>window.__FUP.trEst(window.__FUP.UI.sel.tr).start")
        await pg.click('#win-magazzini [data-act=trwk][data-v="7"]')
        s1 = await pg.evaluate("()=>window.__FUP.trEst(window.__FUP.UI.sel.tr).start")
        assert s1 == s0 + 7, f'data del trasloco: {s0} -> {s1}'
        box = await pg.query_selector('#win-magazzini .tr-box'); await box.scroll_into_view_if_needed(); await box.screenshot(path=os.path.join(OUT, 'shot_trasloco_progetto.png'))
        await pg.click('#win-magazzini [data-act=trgo]')
        assert 'Traslocare' in await pg.inner_text('#modal'), 'manca la conferma del trasloco'
        await pg.evaluate("()=>{window.__R0=Math.random; Math.random=()=>0.99;}")   # rifiuta solo chi è sicuro di rifiutare
        await pg.click('#modal [data-act=okgo]')
        await pg.evaluate("()=>{Math.random=window.__R0;}")
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,T=F.trList()[0],n=S.notes.find(x=>x.k==='ev'&&x.ev.id==='tr_rifiuto');
          return {T:!!T&&T.fase==='prep',ref:!!T&&T.ref.includes('cx1'),note:!!n,cid:n?n.id:0,c0:!!T&&S.clients[0].tr===T.id,closed:!document.querySelector('#win-magazzini [data-act=trgo]')};}''')
        assert r['T'] and r['ref'] and r['note'] and r['c0'] and r['closed'], f'conferma del trasloco: {r}'
        await pg.evaluate(f"()=>window.__FUP.ACT.note({{id:{r['cid']}}})")
        assert await pg.eval_on_selector_all('#modal [data-act=evopt]', 'e=>e.length') == 3, 'cliente che non vuole traslocare: tre risposte'
        await pg.wait_for_timeout(400); await pg.screenshot(path=os.path.join(OUT, 'shot_trasloco_rifiuto.png'))
        await pg.click('#modal [data-act=evopt][data-i="1"]')
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.stepOne(); const T=F.trList()[0],c2=S.clients.find(c=>c.id==='cx1');
          return {out:!T.cli.includes('cx1')&&!c2.tr&&c2.wh===S.warehouses[0].id};}''')
        assert r['out'], f'il cliente resta dov\'è: {r}'
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,T=F.trList()[0],o=S.warehouses[0],d=S.warehouses[1],c=S.clients[0],out={};
          const go=()=>{ document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.stepOne(); };
          while(T.fase==='prep'&&S.day<400) go();
          out.move=T.fase==='move'&&c.wh===d.id; const k=F.computeWH(d); out.malus=k.pP.some(x=>x[0]==='Trasloco in corso'&&x[1]<0);
          F.renderMap(); out.arrow=!!document.querySelector('#ov polygon'); F.ACT.openwh({id:d.id}); document.querySelector('#win-magazzini .win-b').scrollTop=0; out.card=!!document.querySelector('#win-magazzini .tr-box .wh-bar');
          return out;}''')
        assert all(r.values()), f'giorni del trasloco: {r}'
        await pg.screenshot(path=os.path.join(OUT, 'shot_trasloco_in_corso.png'))
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,T=F.trList()[0],o=S.warehouses[0],d=S.warehouses[1],c=S.clients[0],out={};
          const go=()=>{ document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.stepOne(); };
          while(T.fase==='move'&&S.day<500) go();
          const k=F.computeWH(d); out.stab=T.fase==='stab'&&k.pP.some(x=>x[0].startsWith('Stabilizzazione')&&x[1]<0)&&k.prF.trs<1;
          while(F.trList().includes(T)&&S.day<900) go();
          out.done=!F.trList().length&&!c.tr&&S.notes.some(n=>n.k==='info'&&/^Trasloco (riuscito|finito)/.test(n.title)); out.left=S.clients.find(x=>x.id==='cx1').wh===o.id;
          return out;}''')
        assert all(r.values()), f'stabilizzazione: {r}'
        await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.ACT.rent({id:'lodi'}); document.querySelector('#modal').innerHTML='';
          const w=S.warehouses.find(x=>x.site==='lodi'); w.staff.pick=2; w.cond=60; F.ACT.openwh({id:w.id});}''')
        card = await pg.evaluate_handle("()=>document.querySelector('#win-magazzini [data-act=wvrent]').closest('.card')")
        await card.as_element().scroll_into_view_if_needed()
        await card.as_element().screenshot(path=os.path.join(OUT, 'shot_capannone_vuoto.png'))
        cash0 = await pg.evaluate("()=>window.__FUP.S.cash")
        await pg.click('#win-magazzini [data-act=wvrent]')
        await pg.click('#modal [data-act=okgo]')
        r = await pg.evaluate(f"()=>{{const F=window.__FUP,S=F.S; return {{gone:!S.warehouses.some(x=>x.site==='lodi'),paid:{cash0}-S.cash,free:F.rentable('lodi')}};}}")
        assert r['gone'] and r['free'] and r['paid'] >= 2 * 6500, f'capannone restituito: {r}'
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,o=S.warehouses[0],d=S.warehouses[1],out={}; S.clients.filter(c=>c.wh===o.id).forEach(c=>c.wh=d.id);
          F.ACT.openwh({id:o.id}); document.querySelector('#win-magazzini [data-act=wvsale]').click(); out.sale=!!o.sale;
          let k=0; do{ o.sale.next=S.day; F.stepOne(); }while(!o.sale.off&&k++<20);   // una volta su cinque arriva il compratore che tira sul prezzo (wv_prezzo)
          out.off=!!o.sale.off&&S.notes.some(n=>n.k==='info'&&n.title.startsWith('Offerta per'));
          const amt=o.sale.off.amt, c0=S.cash; F.ACT.wvsell({wh:o.id,ok:1}); out.sold=!S.warehouses.includes(o)&&S.cash>c0+amt*0.9; return out;}''')
        assert all(r.values()), f'capannone venduto: {r}'
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S; document.querySelector('#modal').innerHTML=''; F.ACT.rent({id:'mortara'}); document.querySelector('#modal').innerHTML='';
          const w=S.warehouses.find(x=>x.site==='mortara'); w.d0=S.day-400; S.day=Math.max(S.day,F.ordDay(w)); return F.ordCand().includes(w);}''')
        assert r, 'ordinanza: il capannone fatiscente deve essere candidato'
        await pg.evaluate(FIRE, 'ordinanza')
        await pg.evaluate("()=>{const F=window.__FUP,n=F.S.notes.find(x=>x.k==='ev'&&x.ev.id==='ordinanza'); F.ACT.note({id:n.id});}")
        assert await pg.eval_on_selector_all('#modal [data-act=evopt]', 'e=>e.length') == 3, 'ordinanza: tre risposte'
        await pg.wait_for_timeout(400); await pg.screenshot(path=os.path.join(OUT, 'shot_ordinanza.png'))
        await pg.click('#modal [data-act=evopt][data-i="1"]')
        r = await pg.evaluate('''()=>{const F=window.__FUP,S=F.S,w=S.warehouses.find(x=>x.site==='mortara'),out={}; document.querySelector('#modal').innerHTML=''; F.stepOne();
          out.ord=!!w.ord&&w.ord.k==='chiudi'&&w.ord.until>S.day; out.alert=F.noteAlerts().some(a=>a.id==='ord'); F.ACT.openwh({id:w.id}); out.card=!!document.querySelector('#win-magazzini .cl-bad [data-id=ordinanza]');
          w.ord.until=S.day+1; const c0=S.cash, r0=S.rep; F.stepOne(); F.stepOne(); out.uff=!!w.build&&w.build.k==='rist'&&!!w.build.uff&&S.cash<c0-20000&&S.rep<r0;
          w.build.left=1; F.stepOne(); F.stepOne(); out.chiusa=!w.ord&&w.cl==='vec'; return out;}''')
        assert all(r.values()), f'ordinanza: {r}'
        # imprevisti del trasloco (0.104): alla conferma 1 o 2 appuntamenti e la franchigia sui KPI; ogni evento del trasloco e del
        # capannone vuoto ha la scena, le risposte con il testo del risultato e si risolve il giorno dopo; dopo un salvataggio si ricostruisce
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('gino'); const S=F.S; S.cash=3e6; S.speed=0;
          F.ACT.rent({id:'piacenza'}); document.querySelector('#modal').innerHTML=''; const o=S.warehouses[0], d=S.warehouses[1], c=S.clients[0], bad=[];
          Object.assign(d.staff,{pick:4,car:4,imp:2,autCE:3,autB:2,fm:1}); F.TR_EV.forEach(x=>x.opts({},null).forEach(q=>{ if(!q.r) bad.push(x.id+': testo del risultato'); }));
          F.ACT.openwh({id:o.id}); F.ACT.tropen({wh:o.id}); F.UI.sel.tr.mode='lampo'; F.UI.sel.tr.fr=true; F.renderAll(); const sw=!!document.querySelector('#win-magazzini [data-act=trfr]:checked');
          let k=0; const R=Math.random; Math.random=()=>k++===0?0.01:0.99; F.ACT.trgo({ok:1}); Math.random=R; const T=F.trList()[0];
          const plan=!!T&&T.evs.length>=1&&T.evs.length<=2&&T.evs.every(x=>['prep','move','stab'].includes(x.ph)&&x.at>=0);
          T.evs=[]; T.start=S.day+200; S.notes=S.notes.filter(n=>n.k!=='ev'); const done=[];
          const fire=(x,i)=>{ const v={tr:T.id}; if(x.ph&&x.setup) x.setup(v,T,o,d);
            if(x.id==='tr_danni') Object.assign(v,{nm:'Lodi',n:4200}); if(x.id==='wv_prezzo') Object.assign(v,{w:o,n:300000,by:'un fondo immobiliare'}); if(x.id==='wv_teatro') v.w=o;
            F.trEvShow(x.id,v); let n=S.notes.filter(q=>q.k==='ev'&&q.ev.id===x.id).pop(); if(!n){ bad.push(x.id+': nessuna notifica'); return; }
            S.notes=JSON.parse(JSON.stringify(S.notes)); n=S.notes.find(q=>q.id===n.id);   // come dopo un salvataggio
            F.ACT.note({id:n.id}); const b=document.querySelectorAll('#modal [data-act=evopt]'); if(b.length<2||!document.querySelector('#modal .ev-scn')||!document.querySelector('#modal .ev-x').textContent) bad.push(x.id+': finestra');
            if(x.ph&&F.evScena(x.id,n.src)!=='trasloco') bad.push(x.id+': scena'); b[i%b.length].click(); document.querySelector('#modal').innerHTML=''; F.stepOne();
            if(!S.notes.some(q=>q.k==='res'&&q.title===n.title)) bad.push(x.id+": com'è andata"); S.notes=S.notes.filter(q=>q.k!=='res'&&q.k!=='ev'); done.push(x.id); };
          let i=0; F.TR_EV.filter(x=>x.ph==='prep'||x.ph==='any').forEach(x=>fire(x,i++));
          T.start=S.day; while(T.fase==='prep'){ document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.stepOne(); }
          const frGo=!!c.fr&&c.fr.on!=null&&c.mult===0.98; T.waves.forEach(w=>{w.to+=40;}); T.end+=40;
          F.TR_EV.filter(x=>x.ph==='move').forEach(x=>fire(x,i++));
          const fr=[]; let g=0; while(c.fr&&g++<200){ c.lastPen=-1; const on=c.fr.on!=null&&(c.fr.until==null||S.day<=c.fr.until); document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.stepOne(); if(c.lastPen!==-1) fr.push([on,c.lastPen]); }
          T.waves.forEach(w=>{ if(!w.done) w.to=S.day; }); g=0; while(T.fase==='move'&&g++<60){ document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(n=>n.k!=='ev'); F.stepOne(); }
          const m=S.managers.find(p=>!p.hired); if(m&&T.fase==='stab'){ m.hired=true; m.wh=d.id; d.mgr=m.id; T.mgrS=m.id; }
          F.TR_EV.filter(x=>x.ph==='stab'||!x.ph).forEach(x=>fire(x,i++));
          return {bad,sw,plan,frGo,fr:fr.length>0&&fr.every(x=>!x[0]||x[1]===0),n:done.length,all:F.TR_EV.length};}''')
        assert not r['bad'] and r['sw'] and r['plan'] and r['frGo'] and r['fr'] and r['n'] == r['all'], f'imprevisti del trasloco e franchigia: {r}'
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; F.trEvShow('tr_navetta',{c:S.clients[0],n:3000,tr:'x'}); F.ACT.note({id:S.notes.filter(n=>n.k==='ev').pop().id});}")
        await pg.wait_for_timeout(400); await pg.screenshot(path=os.path.join(OUT, 'shot_trasloco_evento.png'))
        await pg.evaluate("()=>{document.querySelector('#modal').innerHTML=''; window.__FUP.S.notes=[];}")
        # affitto a un inquilino (0.105): annuncio, offerte, firma, canone nei conti del mese, mappa, rinnovo e ripresa; eventi dell'inquilino
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('gino'); const S=F.S; S.cash=3e6; S.speed=0;
          F.ACT.rent({id:'piacenza'}); document.querySelector('#modal').innerHTML=''; const o=S.warehouses[0], d=S.warehouses[1], out={}; S.clients.forEach(c=>c.wh=d.id);
          F.ACT.openwh({id:o.id}); out.btn=!!document.querySelector('#win-magazzini [data-act=wvlet]:not([disabled])'); F.ACT.wvlet({wh:o.id}); o.let.next=S.day; F.stepOne();
          out.offs=o.let.offs.length>=1&&o.let.offs.every(x=>x.amt>0)&&S.notes.some(n=>n.key==='let'+o.id); F.ACT.openwh({id:o.id}); out.card=!!document.querySelector('#win-magazzini [data-act=lslet]');
          const amt=o.let.offs[0].amt; F.ACT.lslet({wh:o.id,i:0,ok:1}); const a=S.leases[0]; out.let=!S.warehouses.includes(o)&&!!a&&a.amt===amt&&!F.rentable(o.site);
          F.renderMap(); out.mk=!!document.querySelector('#ov [data-act=leases]');
          const h0=(S.hist||[]).length; let k=0; while((S.hist||[]).length===h0&&k++<40){ S.notes=[]; F.stepOne(); } out.aff=S.hist[S.hist.length-1].aff===Math.round(amt*0.9);
          F.ACT.open({id:'mese'}); out.mese=document.querySelector('#win-mese')?document.querySelector('#win-mese').innerText.includes('Affitti dei capannoni'):document.body.innerText.includes('Affitti dei capannoni');
          a.until=S.day+90; F.ACT.leases(); out.ren=!!document.querySelector('#win-magazzini [data-act=lsren]'); F.ACT.lsren({id:a.id}); out.renOk=a.until>S.day+2000&&a.amt>amt;
          const c0=S.cash; F.ACT.lsback({id:a.id,ok:1}); out.back=S.warehouses.includes(o)&&!S.leases.length&&Math.round(c0-S.cash)===6*a.amt;
          // gli eventi dell'inquilino: il moroso e quello che vuole comprare
          F.lsLet(o,{by:'Vivaio Pollice Verde',amt:4000}); const b=S.leases[0]; b.from=S.day-400; const bad=[];
          for(const [id,i] of [['ls_moroso',2],['ls_compra',0]]){ const base=F.EVENTS.find(e=>e.id===id); if(!base.cond(base)){ bad.push(id+': cond'); continue; } const ev={...base}; base.setup(ev); F.trEvShow(id,ev);
            const n=S.notes.filter(q=>q.k==='ev'&&q.ev.id===id).pop(); if(!n){ bad.push(id+': notifica'); continue; } S.notes=JSON.parse(JSON.stringify(S.notes)); F.ACT.note({id:n.id});
            const bt=document.querySelectorAll('#modal [data-act=evopt]'); if(bt.length!==3||!document.querySelector('#modal .ev-x').textContent.includes('Vivaio')) bad.push(id+': finestra'); bt[i].click(); document.querySelector('#modal').innerHTML=''; F.stepOne(); S.notes=[]; }
          out.ev=!bad.length&&!S.leases.length&&b.skip===2; out.bad=bad; return out;}''')
        assert all(v for k, v in r.items() if k != 'bad'), f'affitto a un inquilino: {r}'
        await pg.evaluate("()=>{const F=window.__FUP,S=F.S; S.leases=[{id:'lsT',w:JSON.parse(JSON.stringify(S.warehouses[0])),by:'Palestra CrossPallet',amt:5200,from:S.day,until:S.day+60,bot:null}]; F.ACT.leases(); document.querySelector('#win-magazzini [data-act=lsback]').closest('.card').scrollIntoView({block:'center'});}")
        await pg.evaluate("()=>{const F=window.__FUP; F.S.notes=[]; document.querySelector('#notecard')&&document.querySelector('#notecard').classList.add('out'); F.renderAll();}")
        await pg.wait_for_timeout(400)
        card = await pg.evaluate_handle("()=>document.querySelector('#win-magazzini [data-act=lsback]').closest('.card')")
        await card.as_element().screenshot(path=os.path.join(OUT, 'shot_capannoni_affittati.png'))
        # col pacchetto Relazioni industriali (0.105): trasloco oltre 40 km da un magazzino col sindacato = delocalizzazione; il tavolo con l'accordo
        # di trasferimento, firmato, raddoppia l'indennità; a fine trasloco il sindacato arriva nel magazzino nuovo con chi ha seguito
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('gino',null,{mode:'classica',ri:true}); const S=F.S; S.cash=3e6; S.speed=0;
          const o=S.warehouses[0]; F.ACT.rent({id:'voltri'}); document.querySelector('#modal').innerHTML=''; const d=S.warehouses[1], out={}; Object.assign(d.staff,{pick:4,car:4,imp:2,autCE:3,autB:2,fm:1});
          o.sind=true; o.rsu={name:'Rocco Prova',sx:'m',face:1,lead:10,neg:10,tal:null}; S.notes=[];
          F.ACT.openwh({id:o.id}); F.ACT.tropen({wh:o.id}); F.UI.sel.tr.mode='lampo'; F.renderAll(); out.warn=document.querySelector('#win-magazzini .tr-box').innerText.includes('delocalizzazione');
          const R=Math.random; Math.random=()=>0.99; F.ACT.trgo({ok:1}); Math.random=R; const T=F.trList()[0]; T.evs=[];
          out.mod=S.mods.some(m=>m.scope===o.id&&m.src==='Delocalizzazione'&&m.ag===20); const n=S.notes.find(q=>q.k==='ev'&&q.ev.id==='tr_sind'); out.note=!!n;
          F.ACT.note({id:n.id}); out.scn=!!document.querySelector('#modal .ev-scn'); document.querySelectorAll('#modal [data-act=evopt]')[1].click(); document.querySelector('#modal').innerHTML=''; F.stepOne();
          out.tav=!!o.tav&&o.tav.reqs[0].id==='trasf'; o.tav.reqs.forEach(q=>q.c='si'); o.tav.next=S.day; F.stepOne(); out.acc=T.acc===1&&!!o.deal;
          let k=0; while(T.fase!=='stab'&&k++<300){ document.querySelector('#modal').innerHTML=''; S.notes=S.notes.filter(q=>q.k!=='ev'); F.stepOne(); }
          out.sind=T.log.fol<T.log.ref||d.sind&&d.rsu===o.rsu; return out;}''')
        assert all(r.values()), f'trasloco col sindacato: {r}'
        # avversarie (0.105): comprano un capannone del giocatore pagando più del mercato, lo prendono in affitto (e se ne vanno pagando
        # due mesi), traslocano da un capannone vecchio a uno migliore e poi chiudono quello vuoto
        r = await pg.evaluate('''()=>{const F=window.__FUP; document.querySelector('#modal').innerHTML=''; F.newGame('gino',null,{mode:'classica',win:{reputazione:true},reputazione:200});
          const H=F.HUM, out={}; H.bots=[['edoardo','espansione'],['valeria','qualita'],['marco','prezzo']].map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],'normale',i));
          H.cash=3e6; H.bots.forEach(b=>{ b.cash=2e6; b.hist=Array.from({length:6},(_,i)=>({d:i,util:20000,tech:0,ric:1e5})); });
          F.ACT.rent({id:'piacenza'}); document.querySelector('#modal').innerHTML=''; const o=H.warehouses[0], d=H.warehouses[1]; H.clients.forEach(c=>c.wh=d.id);
          F.ACT.wvsale({wh:o.id}); let k=0; do{ o.sale.off=null; o.sale.next=H.day; F.stepOne(); H.notes=[]; }while(!(o.sale.off&&o.sale.off.bot)&&k++<60);
          const off=o.sale.off, b0=H.bots.find(b=>b.bot.id===off.bot); out.price=off.amt>F.wvPrice(o); const n0=b0.warehouses.length;
          F.ACT.wvsell({wh:o.id,ok:1}); out.sold=!H.warehouses.includes(o)&&b0.warehouses.length===n0+1&&b0.warehouses[n0].own&&b0.warehouses[n0].site===o.site;
          // in affitto: il capannone nuovo, svuotato e reso di proprietà per la prova
          d.own=true; F.ACT.rent({id:'lodi'}); document.querySelector('#modal').innerHTML=''; H.clients.forEach(c=>c.wh=H.warehouses[1].id);
          F.ACT.wvlet({wh:d.id}); k=0; do{ d.let.offs=[]; d.let.next=H.day; F.stepOne(); H.notes=[]; }while(!d.let.offs.some(x=>x.bot)&&k++<60);
          const i=d.let.offs.findIndex(x=>x.bot); F.ACT.lslet({wh:d.id,i,ok:1}); const a=H.leases[0], b1=H.bots.find(b=>b.bot.id===a.bot), nw=b1.warehouses.find(w=>w.lease&&w.lease.id===a.id);
          out.lease=!!nw&&nw.fixed===a.amt; F.withCo(b1,()=>{ F.S.warehouses=F.S.warehouses.filter(w=>w!==nw); }); const c0=H.cash; F.stepOne(); out.left=H.warehouses.includes(d)&&!H.leases.length&&H.cash>c0+a.amt;
          // trasloco di un'avversaria: capannone vecchio, un sito migliore vicino, cassa e conti in ordine
          const b2=H.bots.find(b=>b.warehouses.length===1&&b.warehouses[0].site==='pioltello')||H.bots[0]; H.day=400; H.bots.forEach(b=>b.day=400);
          const site0=b2.warehouses[0].site; F.withCo(b2,()=>{ const S=F.S, w=S.warehouses[0]; w.cl='vec'; S.clients.filter(c=>c.wh===w.id).forEach(c=>c.stock=Math.min(c.stock,600)); F.botMove(); out.move=(S.tras||[]).length===1&&S.tras[0].mode==='ondate'; });
          out.news=H.news.some(x=>JSON.stringify(x).includes('trasloca a'));
          k=0; while((b2.tras||[]).length&&k++<400){ document.querySelector('#modal').innerHTML=''; H.notes=[]; F.step(); }
          for(let j=0;j<10;j++){ document.querySelector('#modal').innerHTML=''; H.notes=[]; F.step(); }
          out.closed=!(b2.tras||[]).length&&!b2.warehouses.some(w=>w.site===site0)&&b2.warehouses.length>=1; if(!out.closed) out.dbg=JSON.stringify(b2.warehouses.map(w=>[w.site,w.trLeft,b2.clients.filter(c=>c.wh===w.id).map(c=>c.status)])); return out;}''')
        assert all(r.values()), f'avversarie e capannoni: {r}'
        # senza il pacchetto la partita resta com'era: niente ricerche, voce di menu e lente del pacchetto
        off = await pg.evaluate("()=>{const F=window.__FUP; F.newGame('gino'); F.renderAll(); return {tech:F.TECH.some(t=>t.ri),pol:F.POLICIES.some(p=>p.ri),dock:!!document.querySelector('#dock [data-id=sindacato]'),lens:F.lensL().some(l=>l.ri)};}")
        assert not any(off.values()), f'senza pacchetto restano pezzi del pacchetto: {off}'
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
        await reload(pg); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
        await pg.click('#start [data-act=delask]'); await pg.screenshot(path=os.path.join(OUT, 'shot_cancella_avvio.png'))
        await pg.click('#start [data-act=delno]'); await pg.wait_for_selector('#start [data-act=continue]')
        await pg.click('#start [data-act=delask]'); await pg.click('#start [data-act=delsave]')
        assert not await pg.query_selector('#start [data-act=continue]') and await pg.evaluate('()=>!localStorage.getItem(window.__FUP.KEY)'), 'cancellazione dalla schermata iniziale'
        # tre posti di salvataggio: l'ultima giocata in cima, con tre partite il pulsante per una nuova si spegne
        await pg.evaluate(SEED); await reload(pg); await pg.click('#intro'); await pg.wait_for_selector('#intro:empty', state='attached')
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

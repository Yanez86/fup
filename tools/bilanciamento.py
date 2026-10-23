"""Bilanciamento: fa giocare molte partite con 4 aziende guidate dal computer e stampa le medie anno per anno.

Anche l'azienda del giocatore è guidata dal computer (con lo stile Standard, `botThink()` come le avversarie);
i suoi eventi li decide subito il vice. Se fallisce esce dal gioco come un'avversaria e il mondo va avanti.
Ogni partita ha il suo seme: con lo stesso seme e lo stesso codice esce la stessa partita.
Le partite si confrontano con e senza i pacchetti (Relazioni industriali con --ri, Reparto IT e Ingegneria con --it).

Uso:
  python3 tools/build.py && python3 tools/bilanciamento.py                  # 12 anni, 32 partite per lato
  python3 tools/bilanciamento.py --anni 6 --semi 16 --ri on                 # solo col pacchetto
  python3 tools/bilanciamento.py --ri on --it both                          # Reparto IT e Ingegneria: con e senza, sempre con le Relazioni industriali
  python3 tools/bilanciamento.py --sub 'vecchio|||nuovo'                    # prova al volo una modifica del codice (senza ricompilare)
  python3 tools/bilanciamento.py --riepilogo tools/out/bil_*.json           # rilegge risultati già salvati
Cosa guardare: «vive» = aziende ancora in piedi (senza pacchetti, al 12° anno: 43%); margine = utile / ricavi;
le voci di costo sono in % dei ricavi; fasce = giorni-magazzino in calma, mugugno, stato di agitazione, sciopero, presidio.
Richiede playwright e Chromium come smoke_test.py. I risultati grezzi vanno in tools/out/ (ignorata da git)."""
import asyncio, os, sys, json, argparse, statistics as st
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'tools', 'out')

SIM = r'''async (o)=>{
 const F=window.__FUP;
 // generatore con seme: la stessa partita a ogni lancio
 let a=o.seed>>>0; Math.random=function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
 if(o.pre) eval(o.pre);   // --pre: modifiche ai dati prima della partita (per esempio F.CEOS)
 F.newGame(o.human,null,{mode:'classica',win:{},ri:o.ri,it:!!o.it});
 const H=F.HUM; H.cfg.noPause=true;
 H.bots=o.rivals.map((x,i)=>F.newRival(x[0],['#ff4f9a','#3dd6c4','#9b6bff'][i],'camion',x[1],o.diff,i));
 const cos=[H,...H.bots], acc=cos.map(()=>({f:[0,0,0,0,0],ag:0,n:0,strDays:0,presDays:0,yr:[]}));
 let hDead=null;
 const yrRow=c=>{ const h=(c.hist||[]).slice(-12), s=k=>h.reduce((x,r)=>x+(r[k]||0),0), R=c.ri;
   return {over:!!c.over,cash:Math.round(c.cash),debt:Math.round(F.withCo(c,()=>F.debt())),ric:s('ric'),util:s('util'),pers:s('pers'),mezzi:s('mezzi'),fissi:s('fissi'),
     tech:s('tech'),mgr:s('mgr'),welf:s('welf'),pen:s('pen'),altro:s('altro'),
     cli:c.clients.filter(x=>x.status==='attivo').length,wh:c.warehouses.length,rep:c.rep,mor:h.length?h.reduce((x,r)=>x+r.mor,0)/h.length:0,
     staff:c.warehouses.reduce((x,w)=>x+Object.values(w.staff).reduce((p,q)=>p+q,0),0),
     tr:c.trSt?c.trSt.n:0,trOk:c.trSt?c.trSt.ok:0,trLost:c.trSt?c.trSt.lost:0,trCost:c.trSt?c.trSt.cost:0,trCli:c.trSt?c.trSt.cli:0,
     v1:F.withCo(c,()=>{const w=c.warehouses.find(x=>x.own); return w?F.wvPrice(w):0;}),
     res:Object.values(c.researched||{}).filter(Boolean).length,itc:12*F.withCo(c,()=>F.itCost()),aff:c.dep&&c.dep.it.aff!=null?c.dep.it.aff:null,ko:c.dep?c.dep.it.ko||0:0,
     itp:c.office.it||0,ingp:c.office.ing||0,cons:c.dep?['it','ing'].filter(k=>c.dep[k].cons).length:0,ransom:c.ransom!=null?1:0,
     wage:R?R.wage:1,strikes:R?R.strikes||0:0,deals:R?R.deals||0:0,fails:R?(R.hist||[]).filter(x=>!x.ok).length:0,hdl:c.warehouses.filter(w=>w.hdl).length,conf:R&&R.conf?1:0}; };
 for(let d=0; d<o.years*365; d++){
   if(cos.every((c,i)=>c.over||(i===0&&hDead!=null))) break;
   document.querySelector('#modal').innerHTML='';
   (H.notes||[]).forEach(n=>{ if(n.k==='ev') n.due=Math.min(n.due,H.day); });   // il vice decide subito
   if(hDead==null&&(H.day+3)%7===0){ H.bot={id:'me',style:o.hstyle,diff:'normale',k:0};
     try{ F.withCo(H,()=>{ F.botThink(); if(o.hook) eval(o.hook); }); } finally{ delete H.bot; }
     H.tenders.forEach(t=>{ if(t.bids&&t.bids.me){ if(!t.done&&!t.bid) t.bid={wh:t.bids.me.wh,mult:t.bids.me.mult}; delete t.bids.me; } }); }
   F.step();
   if(H.over&&hDead==null){ hDead=H.day; acc[0].yr.push({...yrRow(H),over:true});
     // il giocatore fallisce: come un'avversaria, clienti e magazzini tornano liberi e il mondo va avanti
     H.over=false; H.clients.forEach(c=>c.status='perso'); H.warehouses=[]; H.queue=[]; H.loans=[]; H.office.plan=0; H.office.cs=0; H.nextEvent=1e9;
     H.managers.forEach(p=>{p.hired=false; p.wh=null; delete p.arr;}); H.tenders.forEach(t=>t.bid=null); H.notes=[]; H.evPend=[]; }
   if(hDead!=null){ H.cash=1e9; H.over=false; }
   cos.forEach((c,i)=>{ if(c.over||(i===0&&hDead!=null)) return; const A=acc[i];
     F.withCo(c,()=>c.warehouses.forEach(w=>{ if(w.ag==null) return; A.f[F.fascia(w)]++; A.ag+=w.ag; A.n++; if((w.strikeOn||0)>0) A.strDays++; if(w.pres) A.presDays++; })); });
   if(H.day%365===0) cos.forEach((c,i)=>{ if(i===0&&hDead!=null) return; if(c.over&&acc[i].yr.some(r=>r.over)) return; acc[i].yr.push(yrRow(c)); });
 }
 return cos.map((c,i)=>({style:i?o.rivals[i-1][1]:o.hstyle,ceo:i?o.rivals[i-1][0]:o.human,over:i===0?hDead!=null:!!c.over,acc:acc[i]}));
}'''

# CEO del giocatore e avversarie (CEO, stile), a rotazione sui semi: ogni stile gioca con tutti i CEO
ROT = [
    ('gino', [['edoardo', 'espansione'], ['valeria', 'qualita'], ['marco', 'prezzo']]),
    ('edoardo', [['valeria', 'prezzo'], ['marco', 'espansione'], ['gino', 'qualita']]),
    ('valeria', [['marco', 'qualita'], ['gino', 'prezzo'], ['edoardo', 'espansione']]),
    ('marco', [['gino', 'espansione'], ['edoardo', 'qualita'], ['valeria', 'prezzo']]),
]
FASCE = ['calma', 'mugugno', 'agitazione', 'sciopero', 'presidio']

def report(res):
    mean = lambda x: st.mean(x) if x else float('nan')
    for ri, it in ((False, False), (True, False), (False, True), (True, True)):
        R = [x for x in res if x['o']['ri'] == ri and bool(x['o'].get('it')) == it]
        if not R: continue
        years = max(x['o']['years'] for x in R)
        by = defaultdict(list)
        for x in R:
            for i, c in enumerate(x['r']): by[('giocatore ' if i == 0 else '') + c['style']].append(c)
        allc = [c for v in by.values() for c in v]; N = len(allc)
        nome = ' e '.join([n for n, on in (('Relazioni industriali', ri), ('Reparto IT e Ingegneria', it)) if on])
        print(f"===== {'CON ' + nome if nome else 'SENZA pacchetti'}: {len(R)} partite, {N} aziende")
        print('fallite %d/%d · per stile: %s' % (sum(c['over'] for c in allc), N, ', '.join(f"{k} {sum(c['over'] for c in v)}/{len(v)}" for k, v in by.items())))
        byc = defaultdict(list)
        for c in allc: byc[c['ceo']].append(c)
        alive = lambda c, y: len(c['acc']['yr']) >= y and not c['acc']['yr'][y-1]['over']
        print('per CEO (fallite in %d anni · vive al 5° anno · utile medio dei primi 5 anni): %s' % (years, ' · '.join(
            f"{k} {sum(c['over'] for c in v)}/{len(v)}, {sum(alive(c, 5) for c in v)}, {mean([r['util'] for c in v for r in c['acc']['yr'][:5] if not r['over']])/1e3:.0f}k" for k, v in sorted(byc.items()))))
        for y in range(1, years + 1):
            rows = [c['acc']['yr'][y-1] for c in allc if len(c['acc']['yr']) >= y and not c['acc']['yr'][y-1]['over']]
            if not rows: continue
            g = lambda k: mean([r[k] for r in rows]); T = max(1, sum(r['ric'] for r in rows)); pc = lambda k: 100 * sum(r[k] for r in rows) / T
            line = (f" anno {y:2d}: vive {100*len(rows)/N:3.0f}% · cassa {g('cash')/1e3:4.0f}k debiti {g('debt')/1e3:3.0f}k · ricavi {g('ric')/1e3:5.0f}k margine {pc('util'):5.1f}%"
                    f" · personale {pc('pers'):4.1f} mezzi {pc('mezzi'):4.1f} immobili {pc('fissi'):4.1f} tecnologie {pc('tech'):3.1f} manager {pc('mgr'):3.1f} altro {pc('altro'):3.1f}"
                    f" · clienti {g('cli'):4.1f} magazzini {g('wh'):3.1f} dipendenti {g('staff'):4.1f} morale {g('mor'):3.0f} · traslochi {g('tr'):3.2f}")
            if ri: line += f" · stipendi {g('wage'):.3f} scioperi {g('strikes'):3.1f} accordi {g('deals'):3.1f} tavoli saltati {g('fails'):3.1f} Confpallet {g('conf'):3.1f}"
            line += f" · ricerche {g('res'):4.1f}"
            if it:
                af = [r['aff'] for r in rows if r.get('aff') is not None]
                ko = [r['ko'] for r in rows]
                line += (f" · reparti {pc('itc'):3.1f}% dei ricavi · IT {g('itp'):3.1f} ING {g('ingp'):3.1f} consulenti {g('cons'):3.1f}"
                         f" · affidabilità {mean(af):4.1f} · guasti in tutto {g('ko'):4.1f} · ransomware {100*g('ransom'):3.0f}%")
            print(line)
        # traslochi: quanti ne fanno le aziende in tutta la partita, quanti riescono, clienti persi e costo; valore del primo magazzino di proprietà
        last = [c['acc']['yr'][-1] for c in allc if c['acc']['yr']]
        trn = sum(r['tr'] for r in last)
        if trn:
            print(f" traslochi: {trn} in {len(last)} aziende ({100*sum(1 for r in last if r['tr'])/len(last):.0f}% ne fa almeno uno) · riusciti {sum(r['trOk'] for r in last)}"
                  f" · clienti spostati {sum(r['trCli'] for r in last)}, persi {sum(r['trLost'] for r in last)} · costo medio {sum(r['trCost'] for r in last)/max(1,sum(r['trOk'] for r in last) or trn)/1e3:.0f}k")
        else: print(' traslochi: nessuno')
        v1 = [(y, mean([c['acc']['yr'][y-1]['v1'] for c in allc if len(c['acc']['yr']) >= y and c['acc']['yr'][y-1]['v1']])) for y in (1, 6, years)]
        print(' primo magazzino di proprietà, prezzo di vendita: ' + ' · '.join(f'anno {y} {v/1e3:.0f}k' for y, v in v1 if v == v))
        if ri:
            F = [sum(c['acc']['f'][k] for c in allc) for k in range(5)]; T = sum(F) or 1
            print(' fasce: ' + ', '.join(f'{n} {100*v/T:.1f}%' for n, v in zip(FASCE, F))
                  + ' · agitazione media %.1f · giorni di sciopero %.2f%% · di presidio %.2f%%' % (
                      sum(c['acc']['ag'] for c in allc) / max(1, sum(c['acc']['n'] for c in allc)),
                      100 * sum(c['acc']['strDays'] for c in allc) / T, 100 * sum(c['acc']['presDays'] for c in allc) / T))
            for k, v in by.items():
                F = [sum(c['acc']['f'][j] for c in v) for j in range(5)]; T = sum(F) or 1
                print(f'   {k:22s} ' + ' '.join(f'{100*q:5.1f}' for q in [x / T for x in F])
                      + f"   agitazione {sum(c['acc']['ag'] for c in v)/max(1,sum(c['acc']['n'] for c in v)):4.1f}")

async def simulate(a):
    from playwright.async_api import async_playwright
    html = open(os.path.join(ROOT, 'dist', 'fup.html'), encoding='utf-8').read()
    for sb in a.sub:
        old, new = sb.split('|||')
        assert html.count(old) == 1, f'--sub: il testo deve comparire una volta sola ({html.count(old)} volte): {old}'
        html = html.replace(old, new)
    os.makedirs(OUT, exist_ok=True)
    page = os.path.join(OUT, f'bil_pagina_{os.getpid()}.html'); open(page, 'w', encoding='utf-8').write(html)
    jobs = []
    for s in range(a.semi):
        human, rivals = ROT[(s + a.seed0) % len(ROT)]
        for ri in ([False, True] if a.ri == 'both' else [a.ri == 'on']):
            for it in ([False, True] if a.it == 'both' else [a.it == 'on']):
                jobs.append(dict(seed=1000 + (s + a.seed0) * 7919, ri=ri, it=it, years=a.anni, human=human, hstyle='standard', rivals=rivals, diff=a.diff, hook=a.hook, pre=a.pre))
    async with async_playwright() as p:
        br = await p.chromium.launch(); sem = asyncio.Semaphore(a.par); done = [0]
        async def one(o):
            async with sem:
                pg = await br.new_page(); errs = []
                pg.on('pageerror', lambda e: errs.append(str(e)))
                await pg.goto('file://' + page); await pg.wait_for_function('window.__FUP')
                r = await pg.evaluate(SIM, o); await pg.close()
                if errs: print('errori JavaScript nel seme', o['seed'], errs[:3], file=sys.stderr)
                done[0] += 1; print(f'\r{done[0]}/{len(jobs)} partite', end='', file=sys.stderr, flush=True)
                return {'o': o, 'r': r}
        res = await asyncio.gather(*[one(o) for o in jobs])
        await br.close()
    os.remove(page); print(file=sys.stderr)
    return res

def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--anni', type=int, default=12)
    ap.add_argument('--semi', type=int, default=32, help='partite per lato (ogni partita ha 4 aziende)')
    ap.add_argument('--seed0', type=int, default=0, help='primo seme: per aggiungere partite nuove a quelle già fatte')
    ap.add_argument('--ri', choices=['on', 'off', 'both'], default='both')
    ap.add_argument('--it', choices=['on', 'off', 'both'], default='off', help='pacchetto Reparto IT e Ingegneria')
    ap.add_argument('--diff', default='normale', help='difficoltà delle avversarie')
    ap.add_argument('--par', type=int, default=os.cpu_count() or 2, help='partite in parallelo')
    ap.add_argument('--sub', action='append', default=[], help="prova una modifica senza ricompilare: 'vecchio|||nuovo'")
    ap.add_argument('--hook', default='', help="codice JS eseguito ogni settimana dopo le scelte del giocatore (F = window.__FUP)")
    ap.add_argument('--pre', default='', help="codice JS eseguito prima di creare la partita, per provare dati diversi (F = window.__FUP, per esempio F.CEOS)")
    ap.add_argument('--out', default=os.path.join(OUT, 'bil_ultimo.json'))
    ap.add_argument('--riepilogo', nargs='*', help='non simula: rilegge questi file di risultati')
    a = ap.parse_args()
    if a.riepilogo:
        res = [x for f in a.riepilogo for x in json.load(open(f))]
    else:
        res = asyncio.run(simulate(a))
        json.dump(res, open(a.out, 'w')); print('risultati in', a.out)
    report(res)

if __name__ == '__main__':
    main()

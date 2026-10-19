import math
P=dict(cassa0=180000, capienza=2500, t_stocc=5.5, t_handl=3.5, t_dist=28.0,
 ral_mag=18500, ral_aut=20000, ral_imp=22000, coeff=1.42, ceo=4000, immobile=5500, varie=1500,
 prod_mag=900, pallet_viaggio=16, km_viaggio=240, viaggi_aut=20, fuel=0.86, cons=0.25, pedaggio=0.08, usura=0.05,
 motrice_fissi=1100, leasing_motrice=2100, motrici_proprie=3, imp_per_volume=1500, min_mag=2, min_imp=2,
 baseP=92, kP=0.4, baseA=96, kA=0.3)
def eu(x): return f"{x:,.0f}".replace(',', '.')
TECH={'barcode':dict(A=1.5,P=0,una=12000,mese=150,set=2), 'wms':dict(A=1.5,P=0.5,una=65000,mese=800,set=6)}
def sim(clients, mesi=24, ritardo=0, op=17, prec=9, lead=14, tech=(), allergico=True, P=P):
    cassa=P['cassa0']; morale=65.0; prev=None; sat={c['nome']:60.0 for c in clients}; persi=set(); log=[]
    for m in range(1,mesi+1):
        act=[c for c in clients if c['inizio']<=m and c['nome'] not in persi]
        stock=sum(c['stock'] for c in act); cons=sum(c['pallet'] for c in act); mov=2*cons
        viaggi=math.ceil(cons/P['pallet_viaggio'])
        need=(max(P['min_mag'],math.ceil(mov/P['prod_mag'])), max(1,math.ceil(viaggi/P['viaggi_aut'])), P['min_imp']+cons//P['imp_per_volume'])
        mag,aut,imp = need if (ritardo==0 or prev is None) else prev
        prod=P['prod_mag']*(0.7+0.3*morale/70)
        u_mag=mov/(mag*prod); u_aut=viaggi/(aut*P['viaggi_aut']); satur=stock/P['capienza']
        tA=tP=0; tcost=0
        for name,start in tech:
            t=TECH[name]; settimane=t['set']*(1.5 if allergico else 1)
            if m==start: tcost+=t['una']
            if m>=start:
                tcost+=t['mese']
                mesi_att=(m-start+1)*4.3
                f=-0.5 if mesi_att<=settimane else 1.0   # durante l'apprendimento metà effetto in negativo
                tA+=t['A']*f; tP+=t['P']*f
        punt=P['baseP']+P['kP']*(op-10)+tP-20*max(0,u_aut-1)-5*max(0,u_mag-1.05)
        acc=P['baseA']+P['kA']*(prec-10)+0.04*(morale-60)+tA-25*max(0,satur-0.85)-8*max(0,u_mag-1)
        punt=max(50,min(99.9,punt)); acc=max(50,min(99.9,acc))
        target=58+0.6*(lead-10)-30*max(0,u_mag-1)-20*max(0,u_aut-1)
        morale=max(0,min(100,morale+0.35*(target-morale)))
        ric=stock*P['t_stocc']+mov*P['t_handl']+cons*P['t_dist']; pen=0
        for c in act:
            w=min(punt-c['sP'], (acc-c['sA']) if c['sA'] else 9)
            if w>=0: sat[c['nome']]+=3
            elif w>=-2: sat[c['nome']]-=4
            else:
                sat[c['nome']]-=10; pen+=0.05*(c['stock']*P['t_stocc']+c['pallet']*2*P['t_handl']+c['pallet']*P['t_dist'])
            sat[c['nome']]=max(0,min(100,sat[c['nome']]))
            if sat[c['nome']]<25: persi.add(c['nome'])
        k=P['coeff']/12
        pers=(mag*P['ral_mag']+aut*P['ral_aut']+imp*P['ral_imp'])*k
        mezzi=viaggi*P['km_viaggio']*(P['cons']*P['fuel']+P['pedaggio']+P['usura'])+aut*P['motrice_fissi']+max(0,aut-P['motrici_proprie'])*P['leasing_motrice']
        fissi=P['ceo']+P['immobile']+P['varie']
        costi=pers+mezzi+fissi+tcost; util=ric-costi-pen; cassa+=util
        log.append(dict(m=m,cli=len(act),stock=stock,satur=satur,staff=(mag,aut,imp),ric=ric,costi=costi,pen=pen,util=util,cassa=cassa,punt=punt,acc=acc,mor=morale,sat=dict(sat),persi=sorted(persi)))
        prev=need if ritardo else None
    return log
def show(name,log,months=(1,3,4,5,6,8,9,10,12,15,18,24)):
    print('==',name)
    for r in log:
        if r['m'] in months:
            print(f"m{r['m']:>2} cli{r['cli']} sat {r['satur']*100:3.0f}% staff {r['staff']} ric {eu(r['ric']):>7} costi {eu(r['costi']):>7} pen {eu(r['pen']):>5} utile {eu(r['util']):>7} cassa {eu(r['cassa']):>8}  P {r['punt']:.1f} A {r['acc']:.1f} mor {r['mor']:.0f} | "+' '.join(f"{k[:5]}:{v:.0f}" for k,v in r['sat'].items()))
    mn=min(r['cassa'] for r in log); print(f"   cassa minima {eu(mn)}, finale {eu(log[-1]['cassa'])}, persi {log[-1]['persi']}")
RUM=dict(nome='Rummolo',inizio=1,stock=700,pallet=300,sP=92,sA=None)
GAL=dict(nome='Galbanone',inizio=4,stock=600,pallet=480,sP=93,sA=96)
FER=dict(nome='Ferramenta',inizio=9,stock=500,pallet=250,sP=90,sA=97)
ESS=dict(nome='Supermercati Carrellone',inizio=4,stock=1500,pallet=2400,sP=98,sA=95)
if __name__=='__main__':
    show('A passivo',sim([RUM]))
    show('B crescita, assunzioni in anticipo',sim([RUM,GAL,FER]))
    show('C crescita, assunzioni in ritardo di un mese',sim([RUM,GAL,FER],ritardo=1))
    show('D crescita + barcode m3 + WMS m7',sim([RUM,GAL,FER],tech=(('barcode',3),('wms',7))))
    show('E Supermercati Carrellone dal mese 4',sim([RUM,ESS]))

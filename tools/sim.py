import math, copy
# ---------- parametri ----------
P=dict(
 cassa0=180000, capienza=2500,
 t_stocc=5.5, t_handl=3.5, t_dist=28.0,         # €/posto/mese, €/pallet mosso, €/pallet consegnato
 ral_mag=18500, ral_aut=20000, ral_imp=22000, coeff=1.42,
 ceo=4000, immobile=5500, varie=1500,
 prod_mag=900,        # movimenti pallet/mese per magazziniere a morale 70
 pallet_viaggio=16, km_viaggio=240, viaggi_aut=20,  # motrice
 fuel=0.86, cons=0.25, pedaggio=0.08, usura=0.05, motrice_fissi=1100, motrice_nuova=95000, leasing_motrice=2100,
 imp_per_volume=1500, # pallet consegnati/mese per impiegato traffico/amm. oltre il minimo di 2
 min_mag=2, min_imp=2,
)
def euro(x): return f"{x:,.0f}".replace(',', '.')
def sim(clients, P=P, mesi=24, ritardo=1, gino_op=17, gino_prec=9, gino_lead=14, tech_P=0, tech_A=0, tech_from=99, extra_fixed=0, verbose=False, welfare=0):
    cassa=P['cassa0']; morale=65.0; need_prev=None
    sat={c['nome']:60.0 for c in clients}; attivi={}
    log=[]
    for m in range(1,mesi+1):
        act=[c for c in clients if c['inizio']<=m and c['nome'] not in attivi.get('persi',[])]
        persi=attivi.setdefault('persi',[])
        act=[c for c in act if c['nome'] not in persi]
        stock=sum(c['stock'] for c in act); mov=sum(c['pallet']*2 for c in act); cons=sum(c['pallet'] for c in act)
        # fabbisogni
        n_mag=max(P['min_mag'],math.ceil(mov/P['prod_mag'])); viaggi=math.ceil(cons/P['pallet_viaggio'])
        n_aut=max(1,math.ceil(viaggi/P['viaggi_aut'])); n_imp=max(P['min_imp'],P['min_imp']+math.floor(cons/P['imp_per_volume']))
        need=(n_mag,n_aut,n_imp)
        have=need if (need_prev is None or ritardo==0) else tuple(max(a,b) if False else a for a,b in zip(need_prev,need))
        if need_prev is None: have=need
        mag,aut,imp=have
        # carichi
        prod=P['prod_mag']*(0.7+0.3*morale/70)
        u_mag=mov/(mag*prod) if mag else 9
        u_aut=viaggi/(aut*P['viaggi_aut'])
        satur=stock/P['capienza']
        # KPI
        tP= tech_P if m>=tech_from else 0; tA= tech_A if m>=tech_from else 0
        punt=90+0.5*(gino_op-10)+tP-25*max(0,u_aut-0.95)-5*max(0,u_mag-1.0)
        acc =92+0.5*(gino_prec-10)+0.08*(morale-60)+tA-40*max(0,satur-0.85)-12*max(0,u_mag-1.0)
        punt=min(99.5,punt); acc=min(99.8,acc)
        # morale
        target=58+0.6*(gino_lead-10)+welfare-30*max(0,u_mag-1.0)-20*max(0,u_aut-1.0)
        morale+= 0.35*(target-morale)
        # ricavi e costi
        ric=stock*P['t_stocc']+mov*P['t_handl']+cons*P['t_dist']
        pen=0
        for c in act:
            esitoP = punt-c['soglia_P']; esitoA = (acc-c['soglia_A']) if c['soglia_A'] else 5
            worst=min(esitoP,esitoA)
            if worst>=0: sat[c['nome']]+=3
            elif worst>=-2: sat[c['nome']]-=4
            else:
                sat[c['nome']]-=10; r_c=c['stock']*P['t_stocc']+c['pallet']*2*P['t_handl']+c['pallet']*P['t_dist']; pen+=0.05*r_c
            sat[c['nome']]=max(0,min(100,sat[c['nome']]))
            if sat[c['nome']]<25: persi.append(c['nome'])
        k=P['coeff']/12
        pers=mag*P['ral_mag']*k+aut*P['ral_aut']*k+imp*P['ral_imp']*k
        km=viaggi*P['km_viaggio']
        mezzi=km*(P['cons']*P['fuel']+P['pedaggio']+P['usura'])+aut*P['motrice_fissi']
        nuove=max(0,aut-3)   # Gino possiede 3 motrici: oltre servono leasing
        mezzi+=nuove*P['leasing_motrice']
        fissi=P['ceo']+P['immobile']+P['varie']+extra_fixed+welfare*0*1+ (mag+aut+imp)*welfare*20
        costi=pers+mezzi+fissi
        util=ric-costi-pen
        cassa+=util
        log.append(dict(m=m,clienti=len(act),stock=stock,satur=satur,mag=mag,aut=aut,imp=imp,ric=ric,costi=costi,pen=pen,util=util,cassa=cassa,punt=punt,acc=acc,morale=morale,sat=dict(sat)))
        need_prev=need if ritardo else None
    return log
def show(name,log,cols=('m','clienti','stock','mag','aut','imp','ric','costi','util','cassa','punt','acc','morale')):
    print('==',name)
    for r in log:
        if r['m'] in (1,2,3,4,6,8,10,12,15,18,21,24):
            print(f"m{r['m']:>2} cli {r['clienti']} stock {r['stock']:>4} sat {r['satur']*100:4.0f}% staff {r['mag']}/{r['aut']}/{r['imp']} ric {euro(r['ric']):>8} costi {euro(r['costi']):>8} pen {euro(r['pen']):>6} utile {euro(r['util']):>8} cassa {euro(r['cassa']):>9} P {r['punt']:.1f} A {r['acc']:.1f} mor {r['morale']:.0f} | " + ' '.join(f"{k[:6]}:{v:.0f}" for k,v in r['sat'].items()))
RUM=dict(nome='Rummolo',inizio=1,stock=700,pallet=300,soglia_P=92,soglia_A=None)
GAL=dict(nome='Galbanone',inizio=4,stock=600,pallet=480,soglia_P=93,soglia_A=96)
FER=dict(nome='Ferramenta',inizio=9,stock=500,pallet=250,soglia_P=90,soglia_A=97)
ESS=dict(nome='Esselonga',inizio=4,stock=1500,pallet=2400,soglia_P=98,soglia_A=95)
if __name__=='__main__':
    show('A passivo: solo Rummolo',sim([RUM]))
    show('B crescita: +Galbanone m4, +Ferramenta m9',sim([RUM,GAL,FER]))
    show('C troppo grande: +Esselonga m4',sim([RUM,ESS]))
    show('D crescita + WMS/barcode m6',sim([RUM,GAL,FER],tech_A=4,tech_P=1,tech_from=6,extra_fixed=0))

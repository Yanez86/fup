// Esterni dei magazzini: sei tipi (fatiscente, vecchio, standard, moderno, innovativo, frigorifero), due versioni per tipo.
// Tutte nella stessa pianta, perché sopra ci vanno gli elementi del magazzino (giardino, colonnine, area cani, muletti, pulmino, gru):
//   il capannone nel riquadro x 24..135, y 6..55 (la base della facciata è la riga 55), il terreno dalla riga 56;
//   zone lasciate libere (solo erba o asfalto liscio): a sinistra x 0..23 dalla riga 18, a destra x 136..159 dalla riga 30,
//   davanti x 24..103 dalla riga 58 e x 104..135 dalla riga 56. La luce viene dall'alto a sinistra.
// Disegnate con pxl (.claude/skills/pxl-pixel-art), lettere di TPAL (src/game.html). Colori e misure in comune.px.js.
//
//   python3 tools/scene_pxl/esporta.py     (builda tutti i file e porta le scene in assets/scene/)

include("comune.px.js", { palette: true })

const BASE = 55, TERRA = 56          // ultima riga della facciata, prima riga del terreno
const MONDO = { light: [-0.6, -1], ground: TERRA }

// ================================================================ FONDO
// il cielo in due fasce, con le nuvole [x, y, raggio]
function cielo(c, { su = "B", giu = "L", nub = "W", pancia = "S", nuvole = [] } = {}) {
  c.rect(0, 0, SW, 48, giu); c.rect(0, 0, SW, 4, su)
  for (const [x, y, r] of nuvole) {
    c.ellipse(x, y + 1, r, 1, pancia); c.ellipse(x, y, r, 1, nub); c.ellipse(x - Math.round(r / 3), y - 1, Math.round(r / 2), 1, nub)
  }
}
// la pianura lontana ai lati del capannone: i campi e una fila bassa di siepi e gelsi
const FILARI = [[2, 5], [12, 4], [20, 3], [139, 3], [147, 5], [157, 4]]
function campagna(c, { campo = "h", siepe = "G", scuro = "g" } = {}) {
  for (const [x, r] of FILARI) c.ellipse(x, 48, r, 2, siepe)
  c.rect(0, 48, SW, 8, campo); c.hline(0, 48, SW, scuro)
}
// il terreno: piazzale d'asfalto liscio, a sinistra l'aiuola col cordolo
function terreno(c, { asf = "D", erba = "G", riga = "d" } = {}) {
  c.rect(0, TERRA, SW, SH - TERRA, asf); c.hline(0, TERRA, SW, riga)
  c.rect(0, TERRA, 21, SH - TERRA, erba); c.hline(0, TERRA, 21, "g")
  c.vline(21, TERRA, SH - TERRA, "S"); c.vline(22, TERRA, SH - TERRA, "s")
}

// una scena d'esterno: cielo e campagna, il capannone (l'anim "_ed_" + tipo), il terreno, poi gli strati della scena:
// dietro = cose sul tetto nascoste in parte dal parapetto, ombre a terra, cose davanti, vapore (non prende luce).
// «grigio» è il cielo coperto dei capannoni fatiscenti, con i campi secchi e le crepe nell'asfalto.
const GRIGIO = { cielo: { su: "s", giu: "S", pancia: "j" }, campagna: { campo: "q", siepe: "g" }, terreno: { erba: "g" } }
const ESTERNI = {}
function esterno(nome, { grigio = false, nuvole = [] }, { dietro = [], ombre = [], cose = [], vapore = [] } = {}) {
  ESTERNI[nome] = { grigio, nuvole }
  const f = grigio ? GRIGIO : {}
  scene(nome, { w: SW, h: SH, bg: grigio ? "S" : "L", world: MONDO },
    layer("fondo", (c) => { cielo(c, { ...f.cielo, nuvole }); campagna(c, f.campagna) }),
    ...(dietro.length ? [layer("tetto", ...dietro)] : []),
    layer("edificio", stamp("_ed_" + nome.slice(4), -1, -1)),
    layer("terreno", (c) => { terreno(c, f.terreno); if (grigio) crepe(c) }),
    ...(ombre.length ? [layer("ombre", { shade: true }, ...ombre)] : []),
    ...(cose.length ? [layer("cose", ...cose)] : []),
    ...(vapore.length ? [layer("vapore", { unlit: true }, ...vapore)] : []))
}
// le crepe nell'asfalto davanti ai capannoni abbandonati, con l'erbaccia che ci cresce (solo nella fascia lungo il muro)
const CREPE = [[30, 56, 36, 57], [62, 57, 70, 56], [92, 56, 97, 57]]
function crepe(c) { for (const [a, b, x, y] of CREPE) { c.line(a, b, x, y, "d"); erbaccia(c, x, y, a % 3) } }

// ================================================================ IL CAPANNONE (con i parametri)
// la riga del colmo per ogni colonna: tetto piatto, a capanna, a botte (arco), a shed (denti di sega) o a rampa
// (una falda sola che sale verso sinistra: «top» è la gronda a destra, a sinistra è più alta di «alza»)
function profilo(tetto, x0, x1, top, alza, denti) {
  const mid = (x0 + x1) / 2, half = (x1 - x0) / 2, tw = (x1 - x0 + 1) / denti
  return (x) => {
    if (tetto === "rampa") return top - Math.round(alza * (x1 - x) / (x1 - x0))
    if (tetto === "capanna") return top - Math.round(alza * (1 - Math.abs(x - mid) / half))
    if (tetto === "botte") return top - Math.round(alza * Math.sqrt(Math.max(0, 1 - ((x - mid) / half) ** 2)))
    if (tetto === "shed") return top - alza + Math.round(alza * (((x - x0) % tw) / tw))
    return top
  }
}
// il corpo del capannone: sagoma, pannelli (verticali, orizzontali o lamiera grecata a costole), fascia che segue il tetto,
// bordo in cima (la scossalina presa dalla luce), zoccolo di cemento. Restituisce il profilo per i dettagli.
function capannone(c, o) {
  const { x0, x1, top, tetto = "piatto", alza = 0, denti = 4, parete, trama = "vert", passo = 8, giunto, costole, fascia, bordo, zoccolo } = o
  const cima = profilo(tetto, x0, x1, top, alza, denti)
  for (let x = x0; x <= x1; x++) c.vline(x, cima(x), BASE - cima(x) + 1, parete)
  if (trama === "vert") for (let x = x0 + passo; x < x1; x += passo) c.vline(x, cima(x), BASE - cima(x) + 1, giunto)
  if (trama === "oriz") for (let y = top + passo; y < BASE; y += passo) for (let x = x0; x <= x1; x++) if (y > cima(x)) c.px(x, y, giunto)
  if (trama === "lamiera") for (let x = x0; x <= x1; x++) c.vline(x, cima(x), BASE - cima(x) + 1, costole[(x - x0) % costole.length])
  if (fascia) { const [col, ombra, h] = fascia; for (let x = x0; x <= x1; x++) { c.vline(x, cima(x), h, col); c.px(x, cima(x) + h - 1, ombra) } }
  if (bordo) for (let x = x0; x <= x1; x++) c.px(x, cima(x), bordo)
  if (zoccolo) { const [col, h, riga] = zoccolo; c.rect(x0, BASE - h + 1, x1 - x0 + 1, h, col); if (riga) c.hline(x0, BASE - h + 1, x1 - x0 + 1, riga) }
  return cima
}

// portone sezionale: telaio, doghe orizzontali, l'ombra dell'architrave in alto e dello stipite a sinistra
function portone(c, x, y, w, h, { col = "j", riga = "s", ombra = "d", telaio = "D", passo = 3 } = {}) {
  c.rect(x - 1, y - 1, w + 2, h + 1, telaio); c.rect(x, y, w, h, col)
  for (let yy = y + passo; yy < y + h; yy += passo) c.hline(x, yy, w, riga)
  c.hline(x, y, w, ombra); c.vline(x, y + 1, h - 1, ombra)
}
// sotto il portone il molo all'altezza del pianale: il labbro della rampa e i due respingenti di gomma
function molo(c, x, w, y, { labbro = "S", gomma = "K" } = {}) {
  c.hline(x, y, w, labbro); c.rect(x, y + 1, 2, 3, gomma); c.rect(x + w - 2, y + 1, 2, 3, gomma)
}
// il sigillante della baia (la cornice imbottita dove si appoggia il rimorchio) con le strisce gialle di guida
function sigillante(c, x, y, w, h, { col = "d", guida = "Y" } = {}) {
  c.rect(x, y, w, h, "K"); c.rect(x + 1, y + 1, w - 2, h - 1, col)
  c.vline(x + 1, y + 4, h - 6, guida); c.vline(x + w - 2, y + 4, h - 6, guida)
}
// finestra: telaio, vetro che riflette il cielo con un riflesso in diagonale, montanti e traversi
function finestra(c, x, y, w, h, { vetro = "L", telaio = "D", lampo = "W", montanti = 0, traversi = 0 } = {}) {
  c.rect(x - 1, y - 1, w + 2, h + 2, telaio); c.rect(x, y, w, h, vetro)
  if (lampo) for (let i = 0; i < h; i++) { const xx = x + 1 + (h - 1 - i); if (xx < x + w) c.px(xx, y + i, lampo) }
  if (montanti) for (let xx = x + montanti; xx < x + w; xx += montanti + 1) c.vline(xx, y, h, telaio)
  if (traversi) for (let yy = y + traversi; yy < y + h; yy += traversi + 1) c.hline(x, yy, w, telaio)
}
// un ciuffo d'erbaccia (tre forme), dalle crepe e dove il muro tocca terra
const CIUFFI = [[[0, 0], [2, 0], [1, 1]], [[1, 0], [0, 1], [2, 1], [1, 2]], [[0, 0], [1, 1], [3, 0], [2, 1]]]
function erbaccia(c, x, y, t = 0) { for (const [dx, dy] of CIUFFI[t % 3]) c.px(x + dx, y + dy - 2, dy === 0 ? "h" : "G") }

// ================================================================ COSE CHE SI MUOVONO (in comune)

// il semaforo della baia: 8 fotogrammi rosso, 8 verde
anim("_semaforo", { w: 4, h: 8, fps: FPS },
  rect(0, 0, 4, 8, "K"),
  frame({ hold: 8 }, rect(1, 1, 2, 2, "R"), px(1, 1, "e"), rect(1, 5, 2, 2, "g")),
  frame({ hold: 8 }, rect(1, 1, 2, 2, "r"), rect(1, 5, 2, 2, "G"), px(1, 5, "h")))

// la bandiera che sventola (due onde per giro), a strisce verticali dall'asta
function bandiera(nome, strisce, extra = []) {
  anim(nome, { w: 13, h: 12, frames: LOOP, fps: FPS, outline: "K" },
    ...strisce.map(([x, w, k, kk]) => [rect(x, 2, w, 7, k), hline(x, 8, w, kk)]).flat(), ...extra,
    (c) => c.warp((x, y) => x > 0 && [0, Math.round(Math.sin(c.phase * Math.PI * 4 - x / 2.5) * x / 6)], [0, 0, 13, 12]))
}
bandiera("_bandiera_it", [[0, 4, "G", "g"], [4, 4, "W", "S"], [8, 4, "R", "r"]])
bandiera("_bandiera_ue", [[0, 12, "b", "d"]], [[6, 3], [8, 4], [8, 6], [6, 7], [4, 6], [4, 4]].map(([x, y]) => px(x, y, "Y")))

// il rimorchio visto da dietro, attaccato alla baia: aperto coi pallet dentro, o chiuso con le aste di chiusura
function rimorchio(nome, { cassa = "S", luce = "W", ombra = "s", aperto = true } = {}) {
  sprite(nome, { w: 18, h: 25, outline: "K", pivot: "bottom" }, (c) => {
    c.rect(0, 0, 18, 19, cassa); c.hline(0, 0, 18, luce); c.vline(0, 1, 18, luce); c.vline(17, 1, 18, ombra)
    if (aperto) {
      c.rect(2, 2, 14, 16, "d"); c.rect(2, 2, 14, 2, "K")                                       // dentro, al buio
      c.rect(3, 9, 6, 8, "k"); c.vline(5, 9, 8, "N"); c.hline(3, 12, 6, "N"); c.hline(3, 9, 6, "q")   // pallet di scatole
      c.rect(10, 11, 5, 6, "O"); c.vline(14, 11, 6, "o"); c.vline(11, 12, 4, "a")                // pallet nel film arancione
      c.hline(2, 17, 14, "N")
    } else {
      c.vline(8, 1, 18, ombra); c.vline(9, 1, 18, "K")                                          // le due porte
      for (const x of [3, 6, 12, 15]) { c.vline(x, 2, 16, ombra); c.px(x, 9, "K") }             // aste e maniglie
      for (const y of [3, 15]) { c.px(0, y, "K"); c.px(17, y, "K") }                            // cerniere
    }
    c.rect(0, 19, 18, 2, "K"); c.hline(1, 19, 3, "R"); c.hline(14, 19, 3, "R"); c.rect(7, 19, 4, 2, "Y")   // luci e targa
    c.hline(2, 21, 14, "s")                                                                       // il paraincastro
    c.rect(1, 21, 5, 4, "K"); c.rect(12, 21, 5, 4, "K"); c.hline(2, 22, 3, "D"); c.hline(13, 22, 3, "D")  // ruote gemellate
  })
}
rimorchio("_rimorchio_aperto")
rimorchio("_rimorchio_chiuso", { cassa: "B", luce: "L", ombra: "b", aperto: false })

// ================================================================ STANDARD
// Il capannone di tutti: pannelli prefabbricati, le baie coi portoni sezionali, gli uffici, la bandiera,
// un bilico attaccato a una baia col semaforo che passa dal rosso al verde.

// grigio con la fascia verde acqua, tetto piatto, palazzina uffici bianca a sinistra
anim("_ed_standard1", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  capannone(c, { x0: 50, x1: 134, top: 16, parete: "S", giunto: "s", passo: 8, fascia: ["T", "t", 4], bordo: "u", zoccolo: ["s", 5, "j"] })
  ;[56, 80, 106].forEach((x, i) => {
    portone(c, x, 33, 16, 17); molo(c, x, 16, 50)
    c.rect(x, 21, 5, 7, "W"); c.text(x + 1, 22, String(i + 1), "d")          // il numero della baia
    c.rect(x + 9, 26, 5, 2, "d"); c.hline(x + 9, 28, 5, "i")                 // il faro a LED
  })
  sigillante(c, 76, 29, 24, 22)                                               // la baia 2, col rimorchio
  c.rect(125, 45, 6, 10, "D"); c.rect(126, 46, 4, 9, "j"); c.px(129, 50, "K")  // la porta pedonale
  // la palazzina degli uffici
  capannone(c, { x0: 25, x1: 48, top: 24, parete: "W", trama: "oriz", passo: 7, giunto: "S", fascia: ["T", "t", 3], bordo: "u", zoccolo: ["s", 2] })
  c.vline(49, 24, 32, "K"); c.vline(50, 25, 31, "s")                          // lo spigolo e la sua ombra sul magazzino
  finestra(c, 27, 30, 20, 4, { montanti: 4 }); finestra(c, 27, 38, 20, 4, { montanti: 4 })
  c.rect(31, 45, 12, 2, "T"); c.hline(31, 46, 12, "t"); c.hline(32, 47, 10, "s")  // la pensilina dell'ingresso
  finestra(c, 33, 48, 8, 7, { vetro: "B", lampo: "L", montanti: 3 })
  c.vline(28, 8, 16, "S"); c.px(28, 7, "Y")                                   // l'asta della bandiera
})

// beige a capanna, pannelli orizzontali tra i pilastri, palazzina in mattoni a destra con le persiane verdi
anim("_ed_standard2", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  const cima = capannone(c, { x0: 25, x1: 103, top: 28, tetto: "capanna", alza: 14, parete: "z", trama: "oriz", passo: 6, giunto: "Z", fascia: ["N", "M", 2], zoccolo: ["N", 4, "M"] })
  for (const x of [25, 44, 63, 82, 101]) for (let i = 0; i < 3; i++) c.vline(x + i, cima(x + i) + 2, 50 - cima(x + i) - 1, i === 2 ? "Z" : "C")  // pilastri
  c.circ(64, 20, 3, "Z"); c.circ(64, 20, 2, "M"); c.hline(62, 19, 5, "Z"); c.hline(62, 21, 5, "Z")              // l'oblò di aerazione
  ;[48, 67].forEach((x) => { portone(c, x, 32, 14, 18, { col: "G", riga: "g", ombra: "g", telaio: "M" }); molo(c, x, 14, 50) })
  sigillante(c, 65, 29, 18, 22, { col: "D" })
  for (const x of [31, 88]) finestra(c, x, 25, 9, 3, { montanti: 4 })
  c.rect(31, 41, 8, 14, "M"); c.rect(32, 42, 6, 13, "N"); c.px(37, 48, "Y")                                     // la porta pedonale
  // la palazzina in mattoni: corsi di due righe di mattone e una di malta, giunti sfalsati
  capannone(c, { x0: 104, x1: 134, top: 30, parete: "o", trama: "nessuna", fascia: ["C", "z", 2], zoccolo: ["Z", 2] })
  for (let y = 34; y < 53; y += 3) { c.hline(104, y, 31, "k"); for (let x = 104 + ((y / 3) % 2) * 3; x < 135; x += 6) c.vline(x, y + 1, 2, "k") }
  for (const [x, y] of [[108, 35], [127, 35], [108, 45], [127, 45], [117, 35]]) {
    finestra(c, x, y, 4, 6, { telaio: "W", lampo: "W" }); c.rect(x - 3, y - 1, 2, 8, "G"); c.rect(x + 5, y - 1, 2, 8, "G")
    for (let yy = y; yy < y + 7; yy += 2) { c.hline(x - 3, yy, 2, "g"); c.hline(x + 5, yy, 2, "g") }
  }
  c.rect(116, 43, 7, 2, "C"); c.hline(116, 44, 7, "z")                      // la pensilina dell'ingresso
  c.rect(117, 45, 5, 10, "W"); c.rect(118, 46, 3, 9, "N"); c.px(120, 50, "Y")
  c.vline(106, 9, 21, "S"); c.vline(121, 9, 21, "S"); c.px(106, 8, "Y"); c.px(121, 8, "Y")                    // le aste delle bandiere
})

esterno("est_standard1", { nuvole: [[12, 9, 8], [100, 6, 11], [150, 12, 7]] }, {
  ombre: [rect(79, 56, 20, 2, "K")],
  cose: [stamp("_rimorchio_aperto", 88, 57), stamp("_semaforo", 100, 35), stamp("_bandiera_it", 28, 6)] })

esterno("est_standard2", { nuvole: [[8, 7, 7], [52, 4, 10], [146, 8, 9]] }, {
  ombre: [rect(65, 56, 20, 2, "K")],
  cose: [stamp("_rimorchio_chiuso", 74, 57), stamp("_semaforo", 86, 35), stamp("_bandiera_it", 106, 7), stamp("_bandiera_ue", 121, 7)] })

// ================================================================ FATISCENTE
// Il capannone che nessuno ha voluto: lamiere arrugginite, vetri rotti, crepe con le erbacce, l'insegna mezza staccata,
// il lampione che sfarfalla, una lamiera che sbatte col vento, i piccioni (o i corvi) sul tetto.

// il lampione a sbraccio sul muro: si accende e si spegne con un ritmo storto (16 fotogrammi)
const SFARFALLA = "1101111001011101"
anim("_lampione", { w: 13, h: 11, frames: LOOP, fps: FPS }, (c) => {
  c.grid(0, 0, `
    K..KKKK......
    KKKsSSsK.....
    Ks.K...sK....
    KK......sK...
    ........KsK..
    .......KdddK.
    ......KdDDddK
    ......KKKKKKK`)
  const on = SFARFALLA[c.frame] === "1"
  c.hline(7, 7, 5, on ? "i" : "s")
  if (on) { c.px(6, 9, "Y"); c.px(9, 10, "Y"); c.px(12, 9, "Y") }
})
// il lampione a piatto smaltato, appeso a un braccio curvo: un'altra lampada, un altro ritmo
const SFARFALLA2 = "1111100111110100"
anim("_lampione_piatto", { w: 11, h: 10, frames: LOOP, fps: FPS }, (c) => {
  c.grid(0, 0, `
    K.KKK......
    KKsssK.....
    K.....sK...
    K......K...
    ......KGK..
    ....KKGGGKK
    ...KgggggggK
    ....KKKKKKK`)
  const on = SFARFALLA2[c.frame] === "1"
  c.hline(5, 7, 5, on ? "i" : "d")
  if (on) { c.px(4, 9, "Y"); c.px(7, 9, "Y"); c.px(10, 9, "Y") }
})
// la lamiera mezza staccata: inchiodata in alto, il vento la solleva e la sbatte (16 fotogrammi)
const VENTO = [0, 0, 1, 2, 3, 4, 4, 3, 1, 0, 0, 0, 1, 2, 1, 0]
anim("_lamiera", { w: 12, h: 14, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  const d = VENTO[c.frame]
  const sx = Math.floor(d / 2), fondo = 11 - 2 * d                                         // si alza verso di noi: si accorcia
  for (let i = 0; i < 6; i++) c.line(i, 0, i + sx, fondo, ["S", "S", "s", "j"][i % 4])
  c.hline(sx, fondo, 6, "o"); c.px(sx + 2, fondo, "N")                                        // il bordo mangiato dalla ruggine
})
// la lamiera del tetto a shed che si alza dal fondo e ricade
const VENTO2 = [0, 0, 0, 1, 2, 3, 3, 2, 0, 0, 1, 2, 1, 0, 0, 0]
anim("_lamiera_tetto", { w: 13, h: 10, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  const d = VENTO2[c.frame]
  c.line(0, 3, 10, 8 - d * 2, "s"); c.line(0, 2, 10, 7 - d * 2, "S")
})
// il piccione: becca due volte per giro
const BECCA = "0000110000011000"
const PICCIONE = `
  .DD.....
  SKDs....
  .DDsss..
  ..sssddd
  ..ssss..
  ...a.a..`
const BECCATA = `
  ........
  ........
  ...sss..
  .DDssddd
  SKDsss..
  ...a.a..`
anim("_piccione", { w: 8, h: 6, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => c.grid(0, 0, BECCA[c.frame] === "1" ? BECCATA : PICCIONE))
sprite("_piccione_fermo", { pivot: "bottom" }, PICCIONE)
// il corvo: gracchia (becco aperto) e sbatte le ali una volta per giro
const GRACCHIA = "0000011100000000"
anim("_corvo", { w: 9, h: 6, frames: LOOP, fps: FPS, pivot: "bottom" }, (c) => {
  const f = c.frame, ali = f >= 9 && f <= 12
  c.grid(0, 2, `
    ....KK...
    KKKKKd...
    .KKKKK...
    ...K.K...`)
  c.grid(4, 0, GRACCHIA[f] === "1" ? "..sK\n.KKs\n..s." : "....\n.KKs\n....")
  c.px(5, 1, "W")
  if (ali) c.grid(0, 0, f % 2 ? "..K..\n.KK..\nKK..." : "KK...\n.KK..")
})
sprite("_corvo_fermo", { pivot: "bottom" }, `
  ...KK..
  ..KWKs.
  KKKKd..
  .KKKK..
  ..K.K..`)

// l'insegna storta: la tavola scende di un pixel ogni «passo» colonne, sempre tra una lettera e l'altra,
// così ogni lettera resta intera (lettere ogni 4 pixel a partire da m). «dopo» aggiunge i segni di ogni insegna.
function insegna(nome, testo, { m = 2, passo = 8, fondo = "C", ombra = "z", lettere = "r", bordo = "k", h = 9, dopo } = {}) {
  const W = testo.length * 4 + 2 * m - 1, giu = (x) => Math.floor((x + 5 - m) / passo)
  sprite(nome, { w: W, h: h + giu(W - 1), outline: "K" }, (c) => {
    for (let x = 0; x < W; x++) { const t = giu(x); c.vline(x, t, h, fondo); c.px(x, t, bordo); c.px(x, t + h - 2, ombra); c.px(x, t + h - 1, bordo) }
    c.vline(0, giu(0), h, bordo); c.vline(W - 1, giu(W - 1), h, bordo)
    ;[...testo].forEach((ch, i) => { const x = m + 4 * i; if (ch !== " ") c.text(x, giu(x) + 2, ch, lettere) })
    if (dopo) dopo(c, giu, W)
  })
}
// TRASPORTI con la P caduta (resta la sua ombra pulita sulla tavola sbiadita), tiene un bullone solo: a destra la ruggine del foro
insegna("_insegna_trasporti", "TRAS ORTI", { m: 3, passo: 8, dopo: (c, giu, W) => {
  c.rect(19, giu(19) + 2, 3, 5, "z"); c.px(1, giu(1) + 1, "s"); c.vline(W - 2, giu(W - 2) + 2, 4, "o") } })
// DEPOSITO appesa a una catena sola: l'altro capo è caduto
insegna("_insegna_deposito", "DEPOSITO", { m: 2, passo: 4, fondo: "S", ombra: "s", lettere: "b", bordo: "j", h: 8, dopo: (c, giu, W) => {
  c.px(1, giu(1) + 1, "D"); c.vline(W - 2, giu(W - 2) + 2, 3, "o") } })

const BOTTE = profilo("botte", 26, 133, 31, 18, 4)        // il tetto a botte del primo (per posare i piccioni)
const SHED = profilo("shed", 25, 134, 27, 13, 4)           // i denti del secondo (per posare i corvi)

// a botte, in lamiera grecata grigia mangiata dalla ruggine, finestre a nastro coi vetri rotti, il portone scorrevole storto
const ROTTI = { 1: 1, 3: 1, 4: 1, 6: 1, 7: 1, 9: 1 }
anim("_ed_fatiscente1", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  const cima = capannone(c, { x0: 26, x1: 133, top: 31, tetto: "botte", alza: 18, parete: "S", trama: "lamiera", costole: ["S", "S", "s", "j"], fascia: ["s", "d", 2] })
  // la giuntura delle lamiere, coi rivetti: sotto ogni rivetto la ruggine cola
  for (let x = 26; x <= 133; x++) if (cima(x) < 43) c.px(x, 43, "d")
  const R = c.rng(11)
  for (let x = 28; x < 133; x += 4 + Math.floor(R() * 5)) { c.px(x, 43, "N"); c.vline(x, 44, 1 + Math.floor(R() * 5), "o") }
  // il fondo marcio: le costole arrugginite, i buchi dove la lamiera tocca terra
  for (let x = 26; x <= 133; x++) {
    const h = 3 + Math.round(2 * Math.sin(x / 3.1) + Math.sin(x / 1.7))
    c.vline(x, BASE - h + 1, h, ["o", "o", "N", "M"][(x - 26) % 4]); c.px(x, BASE - h, "N")
  }
  for (const x of [41, 42, 87, 116, 117, 118]) { c.px(x, 54, "K"); c.px(x, 55, "K") }
  // finestre a nastro: vetri sporchi, molti rotti (dentro è buio, restano le schegge)
  for (const x0 of [33, 101]) for (let i = 0; i < 5; i++) {
    const x = x0 + i * 5, rotto = ROTTI[(x0 > 60 ? 5 : 0) + i]
    c.rect(x - 1, 33, 6, 7, "d"); c.rect(x, 34, 4, 5, rotto ? "K" : "j")
    if (rotto) { c.px(x, 34, "S"); c.px(x + 3, 38, "S"); c.px(x + 1, 34, "j") } else c.px(x + 2, 35, "S")
  }
  // il portone scorrevole: binario, anta sinistra al suo posto, anta destra uscita dal binario e storta
  c.rect(60, 31, 40, 2, "d"); for (const x of [64, 76, 84, 96]) c.px(x, 32, "S")
  for (let x = 62; x <= 79; x++) c.vline(x, 33, 23, ["r", "r", "M", "m"][(x - 62) % 4])
  c.rect(80, 33, 18, 4, "K")
  for (let x = 80; x <= 97; x++) { const t = 33 + Math.round((x - 80) / 6); c.vline(x, t, BASE - t + 1, ["r", "r", "M", "m"][(x - 80) % 4]) }
  c.vline(79, 33, 23, "K")                                                                           // la fessura tra le ante
  for (const y of [39, 49]) { c.hline(62, y, 18, "m"); c.hline(80, y + 2, 18, "m") }                  // i traversi (l'anta storta più in basso)
  for (const x of [64, 70, 90]) c.vline(x, 47, 4 + (x % 3), "o")                                     // ruggine sotto i bulloni
  // il buco dietro la lamiera che sbatte, e il guano sotto ai piccioni
  c.rect(114, 41, 6, 12, "K"); c.rect(115, 42, 4, 10, "d")
  for (const x of [64, 88, 104]) { c.px(x, cima(x) + 1, "W"); c.px(x + 1, cima(x + 1) + 2, "W") }
  for (const [x, t] of [[30, 0], [45, 1], [58, 2], [99, 0], [111, 1], [127, 2]]) erbaccia(c, x, BASE, t)
})

// a shed, in muratura intonacata d'ocra che si scrosta: finestroni coi vetri rotti, una sbarrata, la serranda mezza alzata
anim("_ed_fatiscente2", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  const cima = capannone(c, { x0: 25, x1: 134, top: 27, tetto: "shed", alza: 13, denti: 4, parete: "q", trama: "nessuna", fascia: ["s", "j", 2], zoccolo: ["s", 4, "j"] })
  c.hline(25, 27, 110, "k")                                                                          // il cornicione
  for (const x of [25, 53, 80, 108]) c.vline(x, cima(x), 27 - cima(x), "j")                          // le vetrate dei denti, di taglio
  // l'umidità che sale da terra
  for (let x = 25; x <= 134; x++) { const t = 47 + Math.round(Math.sin(x / 4) + Math.sin(x / 2.3)); c.vline(x, t, 52 - t, "k") }
  // dove l'intonaco è caduto si vedono i mattoni
  for (const [cx, cy, rx, ry] of [[40, 50, 5, 2.6], [65, 42, 4, 3.2], [122, 48, 5, 3.6]]) {
    const dentro = (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 - 0.3 * Math.sin(x * 1.7 + y * 2.3)
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      if (!dentro(x, y)) continue
      const r = y + 30, malta = r % 3 === 2 || (x + (Math.floor(r / 3) % 2) * 3) % 6 === 0
      c.px(x, y, !dentro(x - 1, y) || !dentro(x, y - 1) ? "y" : malta ? "k" : "o")    // il bordo dell'intonaco fa ombra
    }
  }
  // i finestroni con le inferriate: vetri sporchi, alcuni rotti; il secondo sbarrato con le assi
  finestra(c, 31, 31, 14, 16, { vetro: "j", telaio: "d", lampo: "S", montanti: 3, traversi: 3 })
  for (const [x, y] of [[35, 31], [39, 35], [31, 39], [43, 43], [39, 43]]) c.rect(x, y, 3, 3, "K")
  c.rect(47, 31, 14, 16, "d")
  for (const y of [32, 36, 40, 44]) { c.rect(47, y, 14, 3, "N"); c.hline(47, y + 2, 14, "M"); c.px(48, y + 1, "s"); c.px(59, y + 1, "s") }
  c.line(47, 45, 60, 32, "k")
  for (const x of [31, 47]) { c.hline(x - 1, 47, 16, "S"); c.vline(x + 3, 48, 3, "y"); c.vline(x + 10, 48, 2, "y") }   // davanzali e le colature
  c.line(45, 48, 50, 55, "M"); c.px(46, 48, "M")                                                     // la crepa dall'angolo della finestra
  // la serranda mezza alzata, ammaccata; sotto il buio
  c.rect(71, 35, 32, 2, "D"); c.hline(71, 35, 32, "j")
  c.rect(72, 37, 30, 19, "K"); c.rect(73, 48, 28, 7, "d")
  for (let y = 37; y < 47; y++) c.hline(72, y, 30, (y - 37) % 2 ? "s" : "S")
  c.hline(72, 46, 30, "N"); c.hline(72, 47, 30, "o")
  c.px(84, 41, "s"); c.px(85, 42, "S"); c.px(86, 41, "s"); c.px(92, 39, "s")                         // le ammaccature
  c.vline(71, 37, 19, "d"); c.vline(102, 37, 19, "d")
  c.line(76, 43, 79, 41, "P"); c.line(79, 41, 81, 44, "P"); c.px(83, 42, "P")                        // la firma di qualcuno
  // il pluviale rotto: manca un pezzo e sotto la macchia
  c.rect(107, 28, 2, 12, "s"); c.rect(107, 46, 2, 10, "s"); c.vline(108, 40, 6, "y"); c.vline(107, 41, 4, "k")
  // finestre dei denti, rotte
  for (const x of [57, 84, 112]) { c.rect(x, 18, 4, 3, "d"); c.px(x + 1, 19, "K"); c.px(x + 2, 19, "j") }
  for (const [x, t] of [[27, 0], [44, 1], [66, 2], [104, 1], [113, 0], [131, 2]]) erbaccia(c, x, BASE, t)
})

esterno("est_fatiscente1", { grigio: true, nuvole: [[14, 8, 9], [70, 5, 12], [148, 10, 9]] }, {
  cose: [stamp("_insegna_trasporti", 60, 19), stamp("_lampione", 38, 25), stamp("_lamiera", 113, 40),
    stamp("_piccione", 88, BOTTE(88) - 1), stamp("_piccione_fermo", 64, BOTTE(64) - 1), stamp("_piccione_fermo", 104, BOTTE(104) - 1, { flip: "x" })] })

esterno("est_fatiscente2", { grigio: true, nuvole: [[10, 6, 8], [96, 4, 9], [150, 9, 8]] }, {
  cose: [stamp("_insegna_deposito", 69, 27), stamp("_lampione_piatto", 60, 28), stamp("_lamiera_tetto", 61, 13),
    stamp("_corvo", 54, SHED(54) - 1), stamp("_corvo_fermo", 81, SHED(81) - 1), stamp("_corvo_fermo", 121, SHED(121) - 1)] })

// ================================================================ MODERNO
// Il magazzino nuovo: alto, pannelli colorati, uffici in vetro, pannelli solari, luci a LED.
// Dentro la vetrata gira un AGV (o sale e scende la navetta del magazzino automatico), sul vetro scorrono i riflessi.

// i riflessi che scorrono sul vetro: una fascia in diagonale che attraversa le lastre (16 fotogrammi)
function riflesso(c, x0, x1, y0, y1, chiari) {
  const p = -16 + c.frame * 7
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const d = x + (y - y0) * 0.7 - x0 - p
    if (d >= 0 && d < 3) { const k = c.key(x, y); if (chiari[k]) c.px(x, y, chiari[k]) }
  }
}
// i pannelli solari sul tetto, appena visibili sopra il parapetto
function solari(c, x0, x1, y) { for (let x = x0; x + 5 <= x1; x += 7) { c.rect(x, y, 6, 3, "b"); c.hline(x, y, 6, "B"); c.px(x + 1, y + 1, "L") } }
// una baia moderna: sigillante nero, portone grigio con la finestratura, la lucina di stato sopra
function baia_moderna(c, x, w, y, { col = "S", spia = "G" } = {}) {
  c.rect(x - 2, y - 2, w + 4, 50 - y + 3, "K"); portone(c, x, y, w, 50 - y, { col, riga: "s", telaio: "K" })
  c.rect(x + 1, y + 3, w - 2, 1, "L"); molo(c, x, w, 50, { labbro: "j" })
  c.px(x + Math.floor(w / 2), y - 4, spia)
}
const AGVX = [0, 3, 6, 9, 12, 15, 18, 21, 24, 21, 18, 15, 12, 9, 6, 3]
const TONI = ["W", "S", "L", "B", "b"]

// tutto in un blocco alto bianco e blu, uffici in vetro azzurro a sinistra, la vetrata dove gira l'AGV
anim("_ed_moderno1", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  capannone(c, { x0: 52, x1: 134, top: 10, parete: "W", trama: "nessuna", bordo: "S", zoccolo: ["D", 18, "d"] })
  solari(c, 54, 134, 7)
  // i pannelli verticali colorati: dal bianco a sinistra al blu a destra, come un codice a barre
  const R = c.rng(5)
  for (let x = 52; x <= 133; x += 3) {
    const t = (x - 52) / 82, i = Math.max(0, Math.min(4, Math.floor(t * 5 + (R() - 0.5) * 2.2)))
    const w = Math.min(3, 135 - x)                                                                    // l'ultimo pannello è più stretto
    c.rect(x, 12, w, 24, TONI[i]); c.vline(x + w - 1, 12, 24, i < 2 ? "S" : i < 4 ? "B" : "b")
  }
  c.hline(52, 12, 83, "S"); c.hline(52, 35, 83, "s")
  for (let x = 54; x < 134; x += 8) c.px(x, 11, "i")                                               // i LED sulla gronda
  // la vetrata: dentro le scaffalature e l'AGV che va e viene con un pallet sopra
  c.rect(57, 39, 37, 14, "W"); c.rect(58, 40, 35, 12, "d")
  for (const x of [60, 68, 76, 84, 92]) c.vline(x, 40, 12, "b")
  for (const y of [43, 47]) c.hline(58, y, 35, "o")
  for (const [x, y] of [[61, 40], [77, 40], [85, 41], [62, 44], [78, 44]]) { c.rect(x, y, 6, 3, "j"); c.hline(x, y, 6, "S"); c.vline(x + 5, y, 3, "D") }
  c.hline(58, 51, 35, "D")
  const ax = 60 + AGVX[c.frame]
  c.rect(ax, 48, 7, 3, "O"); c.hline(ax, 48, 7, "a"); c.hline(ax, 50, 7, "o"); c.rect(ax + 1, 46, 5, 2, "k"); c.hline(ax + 1, 47, 5, "N")
  c.px(ax + 3, 45, c.frame % 4 < 2 ? "B" : "b")
  for (const x of [69, 81]) c.vline(x, 40, 12, "W")
  c.line(63, 51, 70, 40, "D"); c.line(88, 51, 93, 43, "D")                                          // i riflessi fissi sul vetro
  c.px(95, 41, c.frame % 8 < 4 ? "h" : "g")                                                         // la luce di stato della zona AGV
  // la pensilina delle baie con le luci a LED
  c.rect(96, 36, 39, 2, "S"); c.hline(96, 36, 39, "W")
  for (let x = 98; x < 134; x += 4) c.px(x, 38, "i")
  baia_moderna(c, 98, 9, 41, { spia: "G" }); baia_moderna(c, 111, 9, 41, { spia: c.frame % 4 < 2 ? "R" : "r" }); baia_moderna(c, 124, 9, 41, { spia: "G" })
  // gli uffici in vetro: piani con i marcapiani, montanti, l'ingresso
  capannone(c, { x0: 25, x1: 51, top: 19, parete: "B", trama: "nessuna", bordo: "W", zoccolo: ["S", 1] })
  c.hline(25, 20, 27, "S")
  for (const y of [21, 33]) c.rect(25, y, 27, 3, "L")
  for (const y of [31, 43]) { c.rect(25, y, 27, 2, "D"); c.hline(25, y, 27, "s") }
  for (let x = 30; x < 51; x += 5) c.vline(x, 21, 34, "d")
  c.vline(52, 19, 37, "s")
  c.rect(32, 45, 12, 2, "W"); c.hline(32, 46, 12, "S"); c.rect(34, 47, 8, 8, "L"); c.vline(38, 47, 8, "d")
  riflesso(c, 25, 51, 21, 54, { B: "L", L: "W" })
})

// silo automatico alto a sinistra (bianco e verde), corpo basso antracite con la fascia verde-gialla, uffici in vetro verde a destra
const TRASLO = [44, 41, 37, 33, 29, 25, 21, 18, 16, 16, 18, 22, 27, 33, 39, 43]
const TONI2 = ["g", "G", "h", "i", "Y"]
anim("_ed_moderno2", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  // il silo: lamiera a costole bianche, la fascia verde in cima, la fessura vetrata col traslo elevatore
  capannone(c, { x0: 25, x1: 57, top: 8, parete: "W", trama: "lamiera", costole: ["W", "W", "W", "S"], fascia: ["G", "g", 3], bordo: "h" })
  c.rect(51, 11, 3, 45, "G"); c.vline(53, 11, 45, "g"); c.vline(51, 11, 45, "h")                  // la striscia verde
  c.rect(36, 13, 11, 39, "d"); c.rect(35, 12, 13, 1, "S"); c.rect(35, 52, 13, 1, "S")
  for (let y = 17; y < 52; y += 6) { c.hline(36, y, 11, "s"); c.rect(37, y - 3, 3, 3, (y / 6) % 2 ? "k" : "O"); c.rect(43, y - 3, 3, 3, (y / 6) % 3 ? "B" : "k") }
  c.vline(41, 13, 39, "j")                                                                          // la colonna del traslo
  const ty = TRASLO[c.frame]; c.rect(40, ty, 3, 3, "Y"); c.hline(40, ty + 3, 3, "y"); c.rect(40, ty - 3, 3, 3, "k")
  c.vline(36, 13, 39, "D"); c.vline(46, 13, 39, "D")
  c.px(41, 9, c.frame % 8 < 2 ? "h" : "g")                                                        // la luce di stato in cima
  // il corpo basso: pannelli orizzontali antracite, i solari a dente di sega, la fascia dei pannelli colorati
  capannone(c, { x0: 58, x1: 134, top: 24, parete: "D", trama: "oriz", passo: 4, giunto: "d", bordo: "j" })
  solari(c, 60, 134, 21)
  const R = c.rng(9)
  for (let x = 58; x <= 133; x += 4) {
    const i = Math.max(0, Math.min(4, Math.floor(((x - 58) / 76) * 5 + (R() - 0.5) * 2)))
    c.rect(x, 26, 4, 6, TONI2[i]); c.vline(x + 3, 26, 6, i < 2 ? "g" : "y")
  }
  c.rect(60, 33, 46, 2, "S"); c.hline(60, 33, 46, "W"); for (let x = 62; x < 105; x += 4) c.px(x, 35, "i")   // pensilina con i LED
  baia_moderna(c, 64, 9, 38); baia_moderna(c, 78, 9, 38, { spia: c.frame % 4 < 2 ? "R" : "r" }); baia_moderna(c, 92, 9, 38)
  // gli uffici in vetro verde, con l'angolo arrotondato
  capannone(c, { x0: 107, x1: 134, top: 31, parete: "u", trama: "nessuna", bordo: "W" })
  c.px(107, 31, "_"); c.px(108, 31, "_"); c.px(107, 32, "_")
  for (const y of [32, 43]) c.rect(107, y, 28, 2, "T")
  for (const y of [41, 52]) { c.rect(107, y, 28, 2, "D"); c.hline(107, y, 28, "s") }
  for (let x = 112; x < 134; x += 5) c.vline(x, 32, 22, "t")
  c.vline(106, 31, 25, "s")
  riflesso(c, 107, 134, 32, 55, { u: "W", T: "u" })
})

esterno("est_moderno1", { nuvole: [[12, 8, 8], [150, 6, 9]] })

esterno("est_moderno2", { nuvole: [[10, 10, 7], [80, 5, 12], [148, 12, 8]] })

// ================================================================ FRIGORIFERO
// Il magazzino del freddo: pannelli isolanti, i gruppi frigo sul tetto con le ventole che girano, il vapore,
// le porte a tenuta delle celle con la brina, il camion frigo col suo gruppo frigo.

// le pale di una ventola: quattro pose, un giro ogni 4 fotogrammi
const PALE = [[[-2, 0], [-1, 0], [1, 0], [2, 0]], [[-2, 1], [-1, 1], [1, -1], [2, -1]], [[0, -2], [0, -1], [0, 1], [0, 2]], [[-1, -2], [-1, -1], [1, 1], [1, 2]]]
function ventola(c, cx, cy, r = 3, { pale = "S", fondo = "K", griglia = "d" } = {}) {
  c.circ(cx, cy, r, griglia); c.circ(cx, cy, r - 1, fondo)
  for (const [dx, dy] of PALE[c.frame % 4]) c.px(cx + dx, cy + dy, pale)
  c.px(cx, cy, "s")
}
// il gruppo frigo (condensatore) sul tetto: cassone, ventole che girano, la lucina verde
function condensatore(nome, n, { col = "S" } = {}) {
  const w = n * 9 + 2
  anim(nome, { w, h: 11, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
    c.rect(0, 0, w, 9, col); c.hline(0, 0, w, "W"); c.vline(w - 1, 1, 8, "s"); c.hline(0, 8, w, "s")
    c.rect(1, 9, 2, 2, "d"); c.rect(w - 3, 9, 2, 2, "d")
    for (let i = 0; i < n; i++) ventola(c, 5 + i * 9, 4)
    c.px(w - 2, 2, c.frame % 16 < 2 ? "h" : "g")
  })
}
condensatore("_condensatore2", 2)
condensatore("_condensatore3", 3)

// il camion frigo (motrice) di fianco, muso a sinistra: cabina bianca, cassone isotermico, il gruppo frigo sul davanti del cassone
anim("_camion_frigo", { w: 48, h: 25, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  c.rect(14, 1, 34, 18, "W"); c.vline(47, 2, 17, "S"); c.hline(14, 18, 34, "S")                   // il cassone
  for (const x of [22, 31, 40]) c.vline(x, 2, 16, "S")
  c.rect(14, 13, 34, 2, "B"); c.hline(14, 14, 34, "b")
  c.rect(17, 4, 7, 7, "B"); c.px(20, 5, "W"); c.hline(18, 7, 5, "W"); c.vline(20, 5, 5, "W"); c.px(18, 5, "W"); c.px(22, 9, "W"); c.px(18, 9, "W"); c.px(22, 5, "W")  // il fiocco di neve
  c.rect(7, 2, 7, 7, "S"); c.hline(7, 2, 7, "W"); c.vline(13, 3, 6, "s"); ventola(c, 10, 5, 2, { griglia: "s" })   // il gruppo frigo
  c.rect(1, 9, 13, 11, "B"); c.hline(1, 9, 13, "L"); c.vline(13, 10, 10, "b")                       // la cabina blu
  c.rect(1, 10, 7, 5, "L"); c.px(1, 10, "W"); c.line(2, 14, 6, 10, "W"); c.vline(9, 10, 9, "b")    // parabrezza e porta
  c.hline(1, 16, 13, "W"); c.rect(0, 18, 3, 2, "Y"); c.hline(0, 20, 48, "K")
  c.circ(6, 21, 3, "K"); c.circ(34, 21, 3, "K"); c.circ(41, 21, 3, "K"); for (const x of [6, 34, 41]) c.px(x, 21, "s")
})
// il furgone frigo, più piccolo: il gruppo frigo basso sul tetto della cabina, cabina rossa
anim("_furgone_frigo", { w: 32, h: 20, frames: LOOP, fps: FPS, outline: "K", pivot: "bottom" }, (c) => {
  c.rect(11, 0, 21, 15, "W"); c.vline(31, 1, 14, "S"); c.hline(11, 14, 21, "S"); c.vline(21, 1, 13, "S")
  c.rect(11, 10, 21, 2, "T")
  c.rect(1, 2, 10, 3, "S"); c.hline(1, 2, 10, "W"); for (let x = 2; x < 10; x += 2) c.px(x, 3, "d"); c.px(9, 3, c.frame % 4 < 2 ? "S" : "d")
  c.rect(0, 5, 11, 10, "R"); c.hline(0, 5, 11, "e"); c.vline(10, 6, 9, "r")
  c.rect(0, 6, 6, 4, "L"); c.px(0, 6, "W"); c.line(1, 9, 4, 6, "W"); c.vline(7, 6, 8, "r")
  c.rect(0, 13, 2, 2, "Y"); c.hline(0, 15, 32, "K")
  c.circ(5, 16, 3, "K"); c.circ(26, 16, 3, "K"); c.px(5, 16, "s"); c.px(26, 16, "s")
})

// porta scorrevole a tenuta della cella: telaio spesso, binario in alto, l'oblò, la maniglia, la brina ai bordi
function porta_cella(c, x, y, w, { col = "W", bordo = "Y" } = {}) {
  c.rect(x - 3, y - 3, w + 8, 2, "d"); c.hline(x - 3, y - 3, w + 8, "s")                          // il binario
  c.rect(x - 1, y - 1, w + 2, BASE - y + 2, "s"); c.rect(x, y, w, BASE - y + 1, col)
  c.vline(x + w - 1, y, BASE - y + 1, "S"); c.hline(x, y, w, "S")
  c.circ(x + Math.floor(w / 2), y + 5, 2, "D"); c.circ(x + Math.floor(w / 2), y + 5, 1, "L")
  c.rect(x + 1, y + 10, 2, 4, bordo); c.vline(x + w + 1, y, BASE - y + 1, "S")
  for (const yy of [y, y + 4, y + 9, BASE - 2]) { c.px(x - 1, yy, "W"); c.px(x + w, yy + 1, "W") }  // brina
}
// porta rapida in PVC blu col finestrino trasparente, nella baia col sigillante
function porta_rapida(c, x, y, w, { col = "b" } = {}) {
  sigillante(c, x - 3, y - 3, w + 6, 50 - y + 4, { col: "K", guida: "W" })
  c.rect(x, y, w, 50 - y, col); c.hline(x, y, w, "d"); c.rect(x + 1, y + 4, w - 2, 2, "L"); c.hline(x, 49, w, "d")
  molo(c, x, w, 50); for (let xx = x; xx < x + w; xx += 3) c.px(xx, 49, "W")
}
// ghiaccioli sotto un bordo
function ghiaccioli(c, x0, x1, y) { for (let x = x0; x <= x1; x += 3) c.vline(x, y, 1 + ((x * 7) % 3 === 0 ? 1 : 0), "W") }

// bianco con la fascia blu, un unico blocco: i gruppi frigo sul tetto, due baie con le porte rapide, la porta della cella
anim("_ed_freddo1", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  capannone(c, { x0: 25, x1: 134, top: 19, parete: "W", trama: "oriz", passo: 4, giunto: "S", fascia: ["B", "b", 4], bordo: "L", zoccolo: ["S", 3, "s"] })
  c.vline(25, 23, 30, "S"); c.vline(134, 23, 30, "s")                                              // i coprispigoli
  c.rect(28, 25, 11, 11, "b"); c.rect(29, 26, 9, 9, "B")                                           // il cartello del fiocco di neve
  c.vline(33, 27, 7, "W"); c.hline(30, 30, 7, "W"); c.px(31, 28, "W"); c.px(35, 28, "W"); c.px(31, 32, "W"); c.px(35, 32, "W")
  porta_rapida(c, 82, 33, 12); porta_rapida(c, 101, 33, 12)
  porta_cella(c, 121, 36, 9)
  ghiaccioli(c, 79, 116, 23); ghiaccioli(c, 117, 132, 33)
  c.rect(96, 13, 2, 6, "s"); c.rect(95, 12, 4, 1, "d"); c.rect(70, 14, 2, 5, "s"); c.rect(69, 13, 4, 1, "d")   // i camini del vapore
})

// cella alta bianca con la fascia verde acqua e la torre evaporativa, anticella azzurrina con la pensilina
anim("_ed_freddo2", { w: SW, h: SH, frames: 1, outline: "K" }, (c) => {
  capannone(c, { x0: 72, x1: 134, top: 14, parete: "W", trama: "vert", passo: 6, giunto: "S", fascia: ["T", "t", 3], bordo: "u", zoccolo: ["S", 2] })
  c.rect(80, 8, 20, 6, "S"); c.hline(80, 8, 20, "W"); for (let y = 10; y < 14; y += 2) c.hline(81, y, 18, "s"); c.rect(85, 7, 10, 1, "d")  // la torre evaporativa
  c.rect(110, 20, 20, 9, "b"); c.text(112, 22, "-25", "W"); c.rect(125, 21, 2, 5, "W"); c.px(125, 21, "B"); c.rect(124, 26, 4, 2, "R")    // il cartello coi gradi
  porta_cella(c, 112, 34, 14, { col: "W", bordo: "O" }); ghiaccioli(c, 109, 130, 31)
  // l'anticella: pannelli azzurrini, la pensilina sopra le baie
  capannone(c, { x0: 25, x1: 71, top: 30, parete: "L", trama: "oriz", passo: 5, giunto: "B", fascia: ["b", "d", 2], bordo: "B", zoccolo: ["S", 2] })
  c.rect(25, 35, 47, 2, "W"); c.hline(25, 37, 47, "S"); c.hline(25, 38, 47, "B")                   // pensilina e la sua ombra
  porta_rapida(c, 31, 41, 11, { col: "O" }); porta_rapida(c, 53, 41, 11, { col: "O" })
})

esterno("est_freddo1", { nuvole: [[10, 9, 8], [60, 5, 10], [148, 7, 9]] }, {
  dietro: [stamp("_condensatore3", 46, 21), stamp("_condensatore2", 118, 21)],
  ombre: [rect(30, 56, 46, 2, "K")],
  cose: [stamp("_camion_frigo", 52, 57)],
  vapore: [(c) => c.plume(96, 11, "WSj", { every: 2, life: 16, rise: 12, size: [1, 3], wind: 0.3 }),
    (c) => c.plume(70, 12, "WSj", { every: 2, life: 16, rise: 10, size: [1, 3], wind: 0.3, seed: 4 })] })

esterno("est_freddo2", { nuvole: [[14, 6, 9], [56, 9, 8], [150, 4, 8]] }, {
  dietro: [stamp("_condensatore2", 37, 32), stamp("_condensatore2", 59, 32)],
  ombre: [rect(75, 56, 29, 2, "K")],
  cose: [stamp("_furgone_frigo", 88, 57)],
  vapore: [(c) => c.plume(90, 6, "WSj", { every: 2, life: 16, rise: 8, size: [2, 4], wind: 0.4 })] })

// ================================================================ VECCHIO
// Il capannone degli anni Settanta-Ottanta, vecchio ma in piedi: pannelli prefabbricati di cemento ingrigiti con le colature,
// lucernari in vetroresina ondulata, il tetto basso, i portoni a libro, l'insegna con le lettere colorate, gli uffici con le
// tapparelle, la caldaia col camino che fuma. Si muovono il fumo, l'insegna al neon (o una tapparella) e un piccione.

// portone a libro: ante strette a fisarmonica coi vetrini in alto e il traverso a metà, il binario sopra, gli stipiti;
// «piegate» ante già raccolte contro lo stipite sinistro (di taglio: una colonna presa dalla luce e una in ombra),
// poi il varco aperto sul buio del magazzino, col pallet appena dentro
function libro(c, x, y, w, { fondo = BASE, col = "O", luce = "a", ombra = "o", vetro = "j", anta = 5, piegate = 0, varco = 0, guida = "D" } = {}) {
  const h = fondo - y + 1
  c.rect(x - 1, y - 2, w + 2, 2, guida); c.hline(x - 1, y - 2, w + 2, "s")
  c.vline(x - 1, y, h, guida); c.vline(x + w, y, h, guida)
  let ax = x
  for (let i = 0; i < piegate; i++, ax += 2) { c.vline(ax, y, h, luce); c.vline(ax + 1, y, h, ombra) }
  if (varco) {
    c.rect(ax, y, varco, h, "K"); c.hline(ax, fondo, varco, "d")
    c.rect(ax + 1, fondo - 4, varco - 2, 3, "k"); c.hline(ax + 1, fondo - 4, varco - 2, "q"); c.hline(ax + 1, fondo - 1, varco - 2, "N")
    ax += varco
  }
  for (; ax < x + w; ax += anta) {
    const lw = Math.min(anta, x + w - ax)
    c.rect(ax, y, lw, h, col); c.vline(ax, y, h, luce); c.vline(ax + lw - 1, y, h, ombra)
    c.rect(ax + 1, y + 2, lw - 2, 3, vetro); c.px(ax + 1, y + 2, "S")
    c.hline(ax + 1, y + Math.floor(h / 2) + 1, lw - 2, ombra)
  }
}
// finestra con la tapparella giù di «giu» righe (stecche chiare e fughe scure, il terminale scuro in fondo), il davanzale
// di marmo che sporge e, se c'è, la colatura sporca che scende dai due angoli del davanzale
function tapparella(c, x, y, w, h, giu, { telaio = "S", vetro = "j", stecca = "z", fuga = "Z", davanzale = "W", colatura } = {}) {
  finestra(c, x, y, w, h, { telaio, vetro, lampo: "S" })
  for (let i = 0; i < giu; i++) c.hline(x, y + i, w, i % 2 ? fuga : stecca)
  if (giu > 0 && giu < h) c.hline(x, y + giu - 1, w, fuga)
  c.hline(x - 2, y + h + 1, w + 4, davanzale)
  if (colatura) { c.vline(x - 1, y + h + 2, 2, colatura); c.vline(x + w, y + h + 2, 3, colatura) }
}

const VOLTA = [2, 3, 4, 5, 5, 5, 5, 4, 3, 2]                  // la curva di un lucernario a voltina, 10 colonne
const TEGOLI = [38, 50, 62, 74, 86, 98, 110]                    // le testate dei tegoli del primo, ogni 12 colonne
const NEON = ["R", "O", "Y", "h", "B", "l", "e", "a", "i", "u"]  // le lettere dell'insegna, una per colore
const SFARFALLA3 = "1111011111100101"                           // la Z al neon che fa i capricci

// cemento coi lucernari a voltina, l'insegna al neon, due portoni a libro arancioni (uno mezzo aperto); a sinistra
// la centrale termica col camino d'acciaio, a destra la palazzina degli uffici in klinker con le tapparelle
anim("_ed_vecchio1", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  capannone(c, { x0: 38, x1: 111, top: 25, parete: "z", trama: "vert", passo: 12, giunto: "Z", bordo: "s", zoccolo: ["Z", 2] })
  // i lucernari a voltina in vetroresina ondulata, ingialliti, con lo sporco in fondo, tra le testate dei tegoli
  for (const t of TEGOLI.slice(0, -1)) VOLTA.forEach((h, i) => { c.vline(t + 2 + i, 25 - h, h, i % 2 ? "z" : "C"); c.px(t + 2 + i, 24, "q") })
  for (const t of TEGOLI) { c.rect(t, 22, 2, 4, "S"); c.vline(t + 1, 23, 3, "s") }
  // le colature: l'acqua che trabocca dalla gronda sotto le testate scende lungo i giunti
  for (const [x, l] of [[38, 5], [51, 9], [63, 4], [75, 7], [87, 10], [99, 6], [110, 8]]) { c.vline(x, 26, l, "Z"); c.vline(x + 1, 26, l >> 1, "Z") }
  for (let x = 38; x <= 111; x++) { const t = 52 + Math.round(Math.sin(x / 3) + 0.6 * Math.sin(x / 1.9)); c.vline(x, t, 54 - t, "Z") }   // gli schizzi da terra
  // l'insegna a cassonetto: lettere al neon, una per colore; la Z sfarfalla. Sotto le staffe la ruggine che cola
  c.rect(53, 28, 43, 7, "s"); c.hline(53, 28, 43, "S"); c.rect(54, 29, 41, 5, "d")
  ;[..."SPEDIZIONI"].forEach((ch, i) => c.text(55 + 4 * i, 29, ch, i !== 5 || SFARFALLA3[c.frame] === "1" ? NEON[i] : "D"))
  for (const x of [57, 91]) c.vline(x, 35, 2 + (x % 3), "k")
  libro(c, 42, 38, 20)
  libro(c, 88, 38, 20, { piegate: 2, varco: 6 })
  // la porta pedonale con l'applique, il cartello dell'estintore
  c.rect(70, 44, 8, 12, "D"); c.rect(71, 45, 6, 11, "s"); c.rect(72, 46, 4, 3, "j"); c.px(72, 46, "S"); c.px(75, 50, "Y")
  c.rect(72, 41, 4, 2, "s"); c.hline(73, 42, 2, "C")
  c.rect(65, 46, 3, 3, "R"); c.px(66, 47, "W")
  // la centrale termica in blocchetti di cemento: la porta di lamiera con le feritoie, il triangolo giallo del pericolo
  capannone(c, { x0: 25, x1: 36, top: 41, parete: "S", trama: "oriz", passo: 3, giunto: "s", bordo: "s" })
  for (let y = 41, r = 0; y < BASE; y += 3, r++) for (let x = 25 + (r % 2) * 3; x <= 36; x += 6) c.vline(x, y + 1, 2, "s")
  c.rect(28, 45, 6, 11, "j"); c.vline(28, 45, 11, "D"); c.hline(28, 45, 6, "D"); for (let y = 47; y < 53; y += 2) c.hline(29, y, 4, "D"); c.px(32, 53, "Y")
  c.px(35, 43, "Y"); c.hline(34, 44, 3, "Y"); c.px(35, 44, "K")
  c.vline(37, 41, 15, "K")
  // il camino d'acciaio: i collari, la cuffia annerita, la staffa che lo tiene al capannone
  c.vline(30, 15, 26, "S"); c.vline(31, 15, 26, "s"); for (const y of [22, 32]) c.hline(30, y, 2, "j")
  c.hline(32, 28, 6, "s")
  c.rect(29, 13, 4, 2, "D"); c.hline(29, 13, 4, "s"); c.hline(30, 15, 2, "D")
  // la palazzina degli uffici in klinker marrone: le finestre a nastro con le tapparelle a mezz'asta, la pensilina di cemento
  capannone(c, { x0: 113, x1: 134, top: 20, parete: "N", trama: "oriz", passo: 3, giunto: "M", fascia: ["z", "Z", 2], zoccolo: ["Z", 2] })
  c.vline(112, 20, 36, "K")
  for (const [x, giu] of [[115, 2], [121, 6], [127, 3]]) tapparella(c, x, 26, 5, 6, giu)
  tapparella(c, 115, 44, 4, 6, 1); tapparella(c, 130, 44, 3, 6, 4)
  c.rect(121, 45, 6, 11, "S"); c.rect(122, 46, 4, 10, "j"); c.px(122, 46, "L"); c.px(125, 51, "Y")
  c.rect(119, 42, 10, 2, "z"); c.hline(119, 43, 10, "Z")
})

const SCIVOLA = [6, 6, 6, 4, 4, 2, 2, 2, 2, 3, 4, 5, 6, 6, 6, 6]     // la tapparella con la cinghia rotta: la tirano su a strattoni, ricade
const PITTURA = ["R", "O", "G", "B", "P", "r", "o", "g", "b"]          // le lettere dell'insegna sul tetto
const ARCOBALENO = ["R", "O", "Y", "G", "B"]

// cemento a pannelli orizzontali tra i pilastri, la fascia di lucernari in vetroresina ondulata, due portoni a libro azzurri
// sul molo, l'insegna sul tetto con le lettere colorate e l'arcobaleno; a sinistra la palazzina intonacata color pesca
// col comignolo di mattoni e le tapparelle verdi (quella in mezzo ha la cinghia rotta)
anim("_ed_vecchio2", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  capannone(c, { x0: 59, x1: 134, top: 25, parete: "S", trama: "nessuna", fascia: ["s", "s", 2], bordo: "S", zoccolo: ["s", 2] })
  for (const y of [40, 47]) c.hline(59, y, 76, "s")
  // la fascia di lucernari in vetroresina ondulata: cresta chiara e cavo scuro, lo sporco in fondo, i profili d'alluminio;
  // una lastra è stata cambiata da poco ed è ancora bianca
  for (let x = 59; x <= 134; x++) {
    const nuova = x >= 92 && x < 100
    c.vline(x, 28, 3, (nuova ? ["W", "W", "C", "z"] : ["C", "C", "z", "q"])[x % 4]); c.px(x, 31, (nuova ? ["C", "C", "z", "q"] : ["z", "z", "q", "Z"])[x % 4])
  }
  c.hline(59, 27, 76, "j"); c.hline(59, 32, 76, "s")
  // il cemento ingrigito: l'acqua scende nei cavi delle onde e cola dal profilo di sotto, una riga ogni cavo; da terra gli schizzi
  c.hline(59, 33, 76, "j")
  for (let x = 63; x <= 134; x += 4) { const l = [3, 7, 2, 10, 5, 4, 2, 8][(x >> 2) % 8]; c.vline(x, 33, l, "s"); c.vline(x - 1, 33, l >> 1, "s") }
  for (let x = 59; x <= 134; x++) { const t = 52 + Math.round(Math.sin(x / 2.7) + 0.6 * Math.sin(x / 1.6)); c.vline(x, t, 54 - t, "s") }
  for (const x of [59, 84, 109, 132]) { c.rect(x, 27, 3, 29, "S"); c.vline(x, 27, 29, "W"); c.vline(x + 2, 27, 29, "s") }
  for (const x of [65, 90]) { libro(c, x, 37, 16, { fondo: 49, col: "B", luce: "L", ombra: "b", vetro: "D", anta: 4 }); molo(c, x, 16, 50) }
  // nella terza campata la porta pedonale con la pensilina e la cassetta rossa dell'idrante
  c.rect(116, 43, 8, 13, "D"); c.rect(117, 44, 6, 12, "s"); c.rect(118, 45, 4, 3, "j"); c.px(118, 45, "S"); c.px(121, 50, "Y")
  c.rect(114, 40, 12, 2, "S"); c.hline(114, 41, 12, "s")
  c.rect(126, 44, 4, 5, "R"); c.rect(127, 45, 2, 2, "L"); c.hline(126, 48, 4, "r")
  c.circ(120, 36, 3, "K"); c.circ(120, 36, 2, "W"); c.vline(120, 34, 3, "K"); c.px(121, 36, "K")              // l'orologio di fabbrica
  // l'insegna sul tetto: tavola bianca col bordo di lamiera, lettere colorate e l'arcobaleno, sulle gambe di tubo
  for (const x of [77, 93, 109]) c.vline(x, 23, 2, "s")
  c.rect(73, 13, 41, 10, "s"); c.hline(73, 13, 41, "S"); c.rect(74, 14, 39, 8, "W")
  ;[..."MAGAZZINI"].forEach((ch, i) => c.text(76 + 4 * i, 15, ch, PITTURA[i]))
  ARCOBALENO.forEach((k, i) => c.hline(76 + 7 * i, 21, 7, k))
  // la palazzina degli uffici
  capannone(c, { x0: 25, x1: 57, top: 18, parete: "v", trama: "nessuna", fascia: ["C", "f", 2], bordo: "W", zoccolo: ["S", 3, "s"] })
  c.vline(58, 18, 38, "K")
  c.hline(25, 36, 33, "C"); c.hline(25, 37, 33, "f")                                      // il marcapiano
  const verde = { telaio: "W", stecca: "G", fuga: "g", colatura: "f" }
  for (const [x, giu] of [[27, 2], [38, SCIVOLA[c.frame]], [49, 4]]) tapparella(c, x, 24, 7, 6, giu, verde)
  for (const [x, giu] of [[27, 3], [49, 1]]) { tapparella(c, x, 41, 7, 6, giu, verde); for (let xx = x + 1; xx < x + 7; xx += 2) c.vline(xx, 41, 6, "d") }
  c.rect(38, 43, 7, 13, "S"); c.rect(39, 44, 5, 12, "j"); c.px(39, 44, "L"); c.px(42, 49, "Y")     // la porta d'ingresso
  c.rect(36, 40, 11, 2, "S"); c.hline(36, 41, 11, "s")
  c.rect(46, 45, 2, 3, "y"); c.px(46, 45, "Y")                                                    // la targa d'ottone
  // il comignolo di mattoni della caldaia, col cappello di cemento annerito
  c.rect(29, 9, 4, 9, "o"); c.vline(32, 9, 9, "r"); for (const y of [11, 14]) c.hline(29, y, 4, "k")
  c.rect(28, 7, 6, 2, "S"); c.hline(28, 8, 6, "s"); c.hline(30, 9, 2, "d")
})

esterno("est_vecchio1", { nuvole: [[14, 7, 8], [84, 5, 11], [148, 11, 8]] }, {
  cose: [stamp("_piccione", 68, 19), stamp("_piccione_fermo", 105, 19, { flip: "x" }), stamp("_piccione_fermo", 128, 19)],
  vapore: [(c) => c.plume(30, 12, "WSs", { young: "sj", every: 2, life: 16, rise: 11, size: [1, 3], wind: 0.35 })] })

esterno("est_vecchio2", { nuvole: [[10, 9, 7], [58, 4, 9], [146, 7, 10]] }, {
  cose: [stamp("_piccione", 98, 12), stamp("_piccione_fermo", 50, 17, { flip: "x" })],
  vapore: [(c) => c.plume(30, 6, "WSs", { young: "sj", every: 2, life: 16, rise: 8, size: [1, 3], wind: 0.3, seed: 3 })] })

// ================================================================ INNOVATIVO
// Il polo che i clienti vogliono visitare per farci le foto: alto, il tetto verde col prato, la facciata in vetro o a lamelle
// di legno, i pannelli solari, la pala eolica o il drone, gli schermi LED coi dati, i sensori con le lucine.
// Si muovono le navette dietro la vetrata (o il drone), la pala, i riflessi, le luci di stato.

// il tetto verde visto da sotto: la terra col prato che sporge dal parapetto (ciuffi d'erba, qualche fiore) e i cespugli
const FIORI = { 3: "Y", 11: "e", 19: "W", 26: "Y", 34: "l", 41: "e" }
function prato(c, x0, x1, cima, cespugli = []) {
  for (let x = x0; x <= x1; x++) {
    const y = cima(x)
    c.px(x, y - 1, "g"); c.px(x, y - 2, "G")
    if ((x * 5) % 7 < 4) c.px(x, y - 3, x % 3 ? "G" : "h")
    const f = FIORI[(x - x0) % 47]; if (f) c.px(x, y - 3, f)
  }
  for (const [x, r] of cespugli) {
    const y = cima(x) - 2 - r
    c.ellipse(x, y, r + 1, r, "g"); c.ellipse(x - 1, y - 1, r, Math.max(1, r - 1), "G"); c.px(x - r, y - 1, "h")
  }
}
// i sensori: scatolette scure con la lucina che lampeggia, ognuna al suo momento del giro
function sensore(c, x, y, d, luce = "R") { c.rect(x, y, 2, 2, "d"); c.px(x + 1, y, (c.frame + d) % 16 < 2 ? luce : "D") }

// la pala eolica piccola: tre pale che fanno due terzi di giro a ciclo (con tre pale il giro si chiude), il mozzo, il palo
anim("_pala", { w: 9, h: 14, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  c.vline(4, 5, 9, "S")
  for (let i = 0; i < 3; i++) {
    const a = c.phase * Math.PI * 4 / 3 + i * Math.PI * 2 / 3 - Math.PI / 2
    c.line(4, 4, 4 + Math.round(4 * Math.cos(a)), 4 + Math.round(4 * Math.sin(a)), "W")
  }
  c.px(4, 4, "s")
})

// le navette del magazzino automatico dietro la vetrata: [primo pixel della corsa, lunghezza, giri a ciclo, fase]
const NAVETTE = [[38, 26, 1, 0], [66, 30, 2, 0.25], [44, 34, 1, 0.6], [56, 28, 1, 0.3], [40, 22, 2, 0.75], [70, 26, 1, 0.1]]
const ENERGIA = [1, 2, 2, 3, 2, 3, 4, 3, 3, 4, 4, 3, 2, 2, 1, 1]        // la curva dell'energia prodotta (si ripete ogni 16 colonne)

// vetro e bianco, alto, il tetto verde coi pannelli solari: la grande vetrata col magazzino automatico e le navette,
// a sinistra l'ingresso con la striscia di LED, a destra lo schermo dell'energia e due baie
anim("_ed_innovativo1", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  capannone(c, { x0: 25, x1: 134, top: 12, parete: "W", trama: "nessuna", bordo: "S", zoccolo: ["D", 4, "d"] })
  for (let y = 21; y < 50; y += 9) { c.hline(25, y, 10, "S"); c.hline(105, y, 30, "S") }
  solari(c, 56, 99, 6)
  prato(c, 25, 134, () => 12, [[31, 2], [50, 1], [104, 2], [124, 1]])
  // la vetrata: dentro sei piani di cassette sulle travi arancioni, le navette gialle che corrono avanti e indietro
  c.rect(35, 14, 70, 39, "D"); c.rect(36, 15, 68, 37, "d")
  const R = c.rng(21)
  for (let p = 0; p < 6; p++) {
    const yb = 15 + p * 6
    for (let x = 37; x + 3 <= 103; x += 5) {
      const r = R(); if (r < 0.15) continue
      const [k, l] = r < 0.62 ? ["j", "S"] : r < 0.9 ? ["b", "B"] : ["o", "O"]
      c.rect(x, yb + 1, 4, 3, k); c.hline(x, yb + 1, 4, l)
    }
    c.hline(36, yb + 4, 68, "o")
  }
  c.rect(36, 50, 68, 2, "D")
  NAVETTE.forEach(([a, l, giri, fase], p) => {
    const yb = 15 + p * 6, ang = 2 * Math.PI * (giri * c.phase + fase), x = a + Math.round(l * (1 - Math.cos(ang)) / 2)
    c.rect(x, yb + 2, 5, 2, "Y"); c.hline(x, yb + 3, 5, "y"); c.px(Math.sin(ang) > 0 ? x + 4 : x, yb + 2, "W")
  })
  for (const x of [53, 70, 87]) c.vline(x, 15, 37, "S")
  riflesso(c, 36, 103, 15, 51, { d: "D", D: "j", j: "S", S: "W", b: "B", B: "L", o: "O", O: "a", Y: "i", y: "Y" })
  // l'ingresso: porta di vetro sotto la pensilina di legno, sopra la striscia di LED che sale
  c.rect(27, 45, 6, 11, "D"); c.rect(28, 46, 4, 10, "L"); c.vline(30, 46, 10, "D"); c.px(28, 46, "W")
  c.rect(25, 43, 10, 2, "k"); c.hline(25, 44, 10, "N")
  c.vline(30, 15, 26, "S"); for (let y = 15; y < 41; y++) if ((y + c.frame) % 8 < 2) c.px(30, y, "u")
  // lo schermo dell'energia: i kWh col contatore che sale, sotto la curva che scorre
  c.rect(106, 14, 28, 15, "K")
  c.text(108, 16, "KWH", "u"); c.text(121, 16, "81" + (2 + (c.frame >> 2)), "W")
  for (let j = 0; j < 24; j++) { const v = ENERGIA[(j + c.frame) % 16]; c.vline(108 + j, 27 - v, v, "t"); c.px(108 + j, 26 - v, "h") }
  baia_moderna(c, 108, 8, 36, { spia: "G" }); baia_moderna(c, 123, 8, 36, { spia: c.frame % 8 < 4 ? "O" : "o" })
  sensore(c, 26, 14, 0); sensore(c, 118, 31, 6, "u"); sensore(c, 32, 41, 11)
})

// il drone delle consegne: le eliche che girano (due pose), la lucina che lampeggia, il pacco appeso;
// fa un otto nel cielo in 16 fotogrammi, dondolando su e giù
anim("_drone", { w: 30, h: 13, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  const t = c.phase * Math.PI * 2, x = 10 + Math.round(9 * Math.sin(t)), y = 2 + Math.round(1.5 + 1.5 * Math.sin(2 * t))
  c.grid(x, y, (c.frame % 2 ? "SSS...SSS" : ".S.....S.") + `
    .D.....D.
    .DDWWWDD.
    ...SSS...
    ....D....
    ...qqk...
    ...kkN...`)
  c.px(x + 4, y + 3, c.frame % 4 < 2 ? "R" : "r")
})

const PAGINE = [["CO2", "-42%"], ["KWH", "+900"]]               // lo schermo cambia pagina ogni 8 fotogrammi
const FRECCIA = `
  ..h..
  ..h..
  h.h.h
  .hhh.
  ..h..`
const LAMPO = `
  ...Y.
  ..Y..
  .YYY.
  ..Y..
  .Y...`

// tetto verde in pendenza e facciata a lamelle di legno; a sinistra il giardino verticale con l'ingresso sotto la pensilina
// fotovoltaica, sulle lamelle lo schermo coi dati, sotto la trave di legno gli uffici in vetro e tre baie
anim("_ed_innovativo2", { w: SW, h: SH, frames: LOOP, fps: FPS, outline: "K" }, (c) => {
  const cima = capannone(c, { x0: 25, x1: 134, top: 21, tetto: "rampa", alza: 13, parete: "M", trama: "nessuna", fascia: ["N", "M", 2], zoccolo: ["D", 2] })
  prato(c, 25, 134, cima, [[40, 1], [70, 2], [96, 1], [118, 2]])
  // le lamelle di legno: una faccia presa dalla luce, una in ombra, e dietro il buio
  for (let x = 51; x <= 134; x++) c.vline(x, cima(x) + 2, 33 - cima(x), ["k", "N", "M"][(x - 51) % 3])
  // lo schermo coi dati, appeso alle lamelle: due pagine (CO2 che scende, energia del fotovoltaico)
  c.rect(57, 18, 29, 14, "K")
  const [a, b] = PAGINE[c.frame >> 3]
  c.text(59, 20, a, "h"); c.text(59, 26, b, "W"); c.grid(78, 22, c.frame >> 3 ? LAMPO : FRECCIA)
  // la trave di legno sopra il piano terra; sotto gli uffici in vetro coi montanti di legno e le baie
  c.rect(51, 35, 84, 2, "N"); c.hline(51, 35, 84, "k")
  c.rect(51, 37, 84, 17, "D")
  c.rect(53, 39, 34, 13, "B"); c.hline(53, 39, 34, "b"); for (let x = 59; x < 87; x += 6) c.vline(x, 39, 13, "N")
  for (let x = 55; x < 87; x += 6) c.px(x, 37, "i")
  riflesso(c, 53, 86, 39, 51, { B: "L", b: "B", L: "W" })
  baia_moderna(c, 93, 9, 41); baia_moderna(c, 107, 9, 41, { spia: c.frame % 4 < 2 ? "R" : "r" }); baia_moderna(c, 121, 9, 41)
  // il giardino verticale a tutta altezza: file di fioriere (le foglie prese dalla luce in cima, l'ombra sotto), i telai di legno
  for (let x = 25; x <= 50; x++) for (let y = cima(x) + 2; y < 54; y++) {
    const r = (y - 9) % 5
    c.px(x, y, r === 0 ? "h" : r === 4 ? "g" : r === 1 && (x + y) % 5 === 0 ? "e" : "G")      // i fiori in fila sotto il bordo della fioriera
  }
  for (const x of [25, 33, 41, 50]) c.vline(x, cima(x) + 2, 54 - cima(x) - 2, "N")
  c.hline(25, 30, 26, "N")
  c.rect(34, 45, 7, 9, "L"); c.vline(37, 45, 9, "N"); c.px(34, 45, "W")
  c.rect(27, 42, 23, 2, "b"); c.hline(27, 42, 23, "B"); for (let x = 30; x < 50; x += 4) c.px(x, 43, "L")
  sensore(c, 88, 38, 0, "h"); sensore(c, 104, 38, 5); sensore(c, 118, 38, 10)
})

esterno("est_innovativo1", { nuvole: [[12, 10, 7], [74, 4, 10], [148, 9, 9]] }, { dietro: [stamp("_pala", 35, 0)] })

esterno("est_innovativo2", { nuvole: [[12, 12, 8], [46, 3, 8], [148, 8, 9]] }, { cose: [stamp("_drone", 76, -2)] })
